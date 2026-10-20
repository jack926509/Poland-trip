import { escapeHtml, safeHttpsUrl } from './html.mjs';

export function mealTiming(item, day) {
  if (item.planStatus === 'unavailable') return '本日不採用；保留作其他時段參考';
  if (!item.stepId) return /早餐|午餐|晚餐/.test(item.role) ? '候選未排時段，須先調整行程' : '彈性候選，未排定時段';
  const step = day.steps.find(step => step.id === item.stepId);
  if (!step) throw new Error(`Day ${day.n} 找不到用餐步驟 ${item.stepId}`);
  return `行程預留 ${step.t} · ${step.label}（不代表已訂位）`;
}

const CITY_NAMES_BY_KEY = { warsaw: '華沙', krakow: '克拉科夫', wroclaw: '樂斯拉夫', poznan: '波茲南', wieliczka: 'Wieliczka' };

/**
 * 「行程餐廳營業時間」表的唯一來源：從每日餐位（day-dining.js）中挑出
 * 已核實或部分核實的門市，不再手寫一份會漂移的子集清單。
 * 同一門市在多天出現時只保留第一筆，順序依 Day 1→8、當天內原順序。
 */
export function plannedVerifiedPlaces(dayDiningByDay) {
  const seen = new Map();
  for (const [dayN, items] of Object.entries(dayDiningByDay)) {
    for (const item of items) {
      if (!['verified', 'partial'].includes(item.verificationStatus)) continue;
      if (!seen.has(item.placeId)) seen.set(item.placeId, { ...item, dayN: Number(dayN), city: CITY_NAMES_BY_KEY[item.cityKey] || item.cityKey });
    }
  }
  return [...seen.values()];
}

export function renderDiningFacts(item, { includeHours = true } = {}) {
  const status = {verified:'已核實所列資料',partial:'部分核實，仍有缺項',pending:'資料待確認'}[item.verificationStatus] || '資料待確認';
  const source = safeHttpsUrl(item.sourceUrl);
  const menu = safeHttpsUrl(item.menuUrl);
  return `${includeHours ? `<p class="food-map-note">營業時間：${escapeHtml(item.hours || '待確認')}</p>` : ''}
    <p class="source-meta">${status}${item.checkedAt ? ` · ${escapeHtml(item.checkedAt)}` : ''}${source ? ` · <a href="${source}" target="_blank" rel="noopener noreferrer">查核來源 ↗</a>` : ''}</p>
    ${item.hoursNote ? `<p class="food-map-note">營業時間來源：${escapeHtml(item.hoursNote)}</p>` : ''}
    ${item.verificationNote ? `<p class="food-map-note">${escapeHtml(item.verificationNote)}</p>` : ''}
    ${menu ? `<p class="food-map-note"><a href="${menu}" target="_blank" rel="noopener noreferrer">菜單／餐點來源 ↗</a>${item.menuNote ? ` · ${escapeHtml(item.menuNote)}` : ''}</p>` : ''}`;
}

const STATUS_BADGES = {
  verified: ['已查證', 'verified'],
  partial: ['部分查證', 'partial'],
  pending: ['待確認', 'pending'],
};

/**
 * 訂位狀態（餐廳主檔 booking 欄位，選填）。只有這四種值；沒有依據就不填、不顯示徽章。
 * 「已訂」要等使用者真的訂了才能填，目前全部尚未訂位。
 */
export const BOOKING_LABELS = { required: '必訂', recommended: '建議訂', 'walk-in': '免訂', booked: '已訂' };

/** 2026-10-12 → 10/12；只用在徽章短字，完整日期仍在查核紀錄。 */
function shortDate(value) {
  const match = /^\d{4}-(\d{2})-(\d{2})$/.exec(value || '');
  return match ? `${Number(match[1])}/${Number(match[2])}` : '';
}

/**
 * 店名下方的一列小標：料理類型、查證狀態、最近一次確認仍營業的日期。
 * 用 span 不用 p——導航膠囊必須排在第一個段落之前（標題列），見 day-food 測試。
 */
export function renderStoreBadges(item) {
  if (!item.placeId && !item.cuisine) return '';
  const [label, key] = STATUS_BADGES[item.verificationStatus] || STATUS_BADGES.pending;
  const live = shortDate(item.liveCheckedAt);
  const bookingLabel = Object.hasOwn(BOOKING_LABELS, item.booking) ? BOOKING_LABELS[item.booking] : '';
  const booking = bookingLabel ? `<span class="store-booking store-booking-${item.booking}" data-booking="${item.booking}">${bookingLabel}</span>` : '';
  return `<span class="store-badges">${booking}${item.cuisine ? `<span class="store-tag">${escapeHtml(item.cuisine)}</span>` : ''}<span class="store-status store-status-${key}">${label}</span>${live ? `<span class="store-live">${live} 確認仍營業</span>` : ''}</span>`;
}

function toMinutes(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(String(value || '').trim());
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
}

/**
 * 排定時刻是否落在當天營業時段內，並保留 45 分鐘用餐。
 * dayHours 寫成「12:00–22:00」「08:00–翌日 01:00」或「24 小時」；
 * 行程時刻不是 HH:MM（例如「抵站放行李後」）時回傳 null，由卡片改顯示「依抵達時間」。
 */
export function openingCheck(dayHours, time, { mealMinutes = 45 } = {}) {
  const start = toMinutes(time);
  if (!dayHours) return null;
  if (/24 小時/.test(dayHours)) return start === null ? null : { ok: true, open: 0, close: 1440 };
  const match = /(\d{1,2}):(\d{2})–(翌日 )?(\d{1,2}):(\d{2})/.exec(dayHours);
  if (!match) throw new Error(`無法解析當天營業時段：${dayHours}`);
  const open = Number(match[1]) * 60 + Number(match[2]);
  let close = Number(match[4]) * 60 + Number(match[5]);
  if (match[3] || close <= open) close += 1440;
  if (start === null) return null;
  return { ok: start >= open && start + mealMinutes <= close, open, close };
}

/**
 * 店家卡的主體：營業時間與推薦菜色一律直接可見（不收合），
 * 菜單做成 44px 的按鈕（店家不放電話鈕，訂位與確認都走線上）；地址、查核日期與來源收在「地址與查核紀錄」。
 */
export function renderStoreBody(item, { note = item.note, condition = item.condition, timing = '', foldFacts = true, day = null, time = '' } = {}) {
  const dishes = Array.isArray(item.dishes) ? item.dishes : [];
  const menu = safeHttpsUrl(item.menuUrl);
  // 排定餐段：先給「當天」那一行（日期＋當天時段＋能不能坐下吃），全週時段收進查核紀錄；
  // 備選與名錄沒有指定日子，照舊直接列全週時段。
  // 沒有指定日子（營業時間名錄、今日卡備選）就不顯示「當天」，回到全週時段。
  const dayHours = day ? item.dayHours : '';
  const check = dayHours ? openingCheck(dayHours, time) : null;
  const fit = !dayHours ? ''
    : check === null ? '<span class="store-fit store-fit-relative">依實際抵達時間</span>'
    : check.ok ? `<span class="store-fit store-fit-ok">✓ ${escapeHtml(time)} 入座在營業時間內</span>`
    : `<span class="store-fit store-fit-warn">⚠ ${escapeHtml(time)} 不在營業時間內</span>`;
  const hoursRow = dayHours
    ? `<div class="store-fact store-fact-today"><dt>當天</dt><dd><b>${escapeHtml(day.date)} ${escapeHtml(dayHours)}</b>${fit}</dd></div>`
    : `<div class="store-fact"><dt>營業</dt><dd>${escapeHtml(item.hours || '待確認')}</dd></div>`;
  const facts = `<dl class="store-facts">
      ${hoursRow}
      ${dishes.length ? `<div class="store-fact"><dt>推薦</dt><dd><ul class="store-dishes">${dishes.map(dish => `<li>${escapeHtml(dish)}</li>`).join('')}</ul></dd></div>` : ''}
    </dl>`;
  const actions = menu ? `<p class="store-actions"><a class="store-action" href="${menu}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(item.name)} 的菜單">菜單 ↗</a></p>` : '';
  const record = foldFacts
    ? `<details><summary>地址、全週營業與查核紀錄</summary><p class="food-map-note">${escapeHtml(item.address)}</p>${renderDiningFacts(item, { includeHours: Boolean(dayHours) })}<p class="source-meta">行程預留不代表已訂位。</p></details>`
    : '';
  return `${facts}
      ${note ? `<p>${escapeHtml(note)}</p>` : ''}
      ${condition ? `<p class="store-condition"><b>採用／改備案：</b>${escapeHtml(condition)}</p>` : ''}
      ${timing ? `<p class="food-map-note">${escapeHtml(timing)}</p>` : ''}
      ${actions}
      ${record}`;
}

/** 店名列：標題與小標在左，導航膠囊在右上角。 */
export function renderStoreHead(item, eyebrow) {
  const map = safeHttpsUrl(item.map || item.mapUrl);
  return `<div class="day-food-head"><div class="day-food-title"><span class="eyebrow">${escapeHtml(eyebrow)}</span><h4>${escapeHtml(item.name)}</h4>${renderStoreBadges(item)}</div>
      ${map ? `<a class="day-food-map" href="${map}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(item.name)} 的 Google Maps 導航">導航 ↗</a>` : ''}</div>`;
}

const LAST_MEAL_CUTOFF_MINUTE = 23 * 60;

/** 每日頁、今日卡與餐飲指南共用；沒有門市的餐次只顯示安排，不產生假導航。 */
export function renderMealList(day, meals) {
  const labels = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };
  return `<ul class="day-food-list" data-three-meals="${day.n}">${meals.map(item => {
    const step = day.steps.find(step => step.id === item.stepId);
    if (!step) throw new Error(`Day ${day.n} 找不到三餐步驟 ${item.stepId}`);
    const eyebrow = `${labels[item.meal]} · ${step.t}${item.condition ? ' · 先確認' : ''}`;
    // data-meal-minute：今日卡依華沙時間收合已過的餐用（step.t 不是 HH:MM 時不給，維持原樣）。
    // 「出礦後」「抵站放行李後」這類相對時間沒有分鐘數：改記行程表中它後面第一個有時刻的步驟，
    // 該時刻到了就代表這餐已經錯過（data-meal-before-minute）。
    const minute = toMinutes(step.t);
    const laterStep = minute === null ? day.steps.slice(day.steps.indexOf(step) + 1).map(next => toMinutes(next.t)).find(value => value !== null) : undefined;
    // 當天最後一餐後面沒有任何有時刻的步驟：保守算華沙時間 23:00 後已過，不讓它永遠停在「下一餐」。
    const later = minute === null && laterStep === undefined ? LAST_MEAL_CUTOFF_MINUTE : laterStep;
    return `<li class="day-food-item" id="meal-${escapeHtml(item.stepId)}" data-meal="${item.meal}" data-meal-label="${labels[item.meal]}" data-meal-time="${escapeHtml(step.t)}"${minute === null ? '' : ` data-meal-minute="${minute}"`}${later === undefined ? '' : ` data-meal-before-minute="${later}"`}${item.placeId ? '' : ' data-self="true"'}>
      ${renderStoreHead(item, eyebrow)}
      ${item.placeId ? renderStoreBody(item, { day, time: step.t }) : `<p>${escapeHtml(item.note)}</p>`}
    </li>`;
  }).join('')}</ul>`;
}

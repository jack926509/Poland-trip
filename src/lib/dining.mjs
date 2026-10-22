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

// 2026-10-22 出發前收斂：沒查到的營業時間與門牌不再顯示「待確認」，改成旅途中照做的一句話。
export const displayHours = hours => (!hours || /^(營業時間)?待確認$/.test(String(hours).trim()) ? '出門前看 Google 地圖' : hours);
export const displayAddress = address => (/^門牌待確認$/.test(String(address ?? '').trim()) ? '點店名開 Google 地圖' : address);

export function renderDiningFacts(item, { includeHours = true } = {}) {
  const source = safeHttpsUrl(item.sourceUrl);
  const menu = safeHttpsUrl(item.menuUrl);
  return `${includeHours ? `<p class="food-map-note">營業時間：${escapeHtml(displayHours(item.hours))}</p>` : ''}
    ${source ? `<p class="source-meta"><a href="${source}" target="_blank" rel="noopener noreferrer">店家資訊 ↗</a></p>` : ''}
    ${menu ? `<p class="food-map-note"><a href="${menu}" target="_blank" rel="noopener noreferrer">菜單 ↗</a></p>` : ''}`;
}

/**
 * 訂位狀態（餐廳主檔 booking 欄位，選填）。只有這四種值；沒有依據就不填、不顯示徽章。
 * 「已訂」要等使用者真的訂了才能填，已確認的訂位才標為 booked。
 */
export const BOOKING_LABELS = { required: '必訂', recommended: '建議訂', 'walk-in': '免訂', booked: '已訂' };

/**
 * 店名下方的一列小標：訂位需求與料理類型。
 * 用 span 不用 p——導航膠囊必須排在第一個段落之前（標題列），見 day-food 測試。
 */
export function renderStoreBadges(item) {
  if (!item.placeId && !item.cuisine) return '';
  const bookingLabel = Object.hasOwn(BOOKING_LABELS, item.booking) ? BOOKING_LABELS[item.booking] : '';
  const booking = bookingLabel ? `<span class="store-booking store-booking-${item.booking}" data-booking="${item.booking}">${bookingLabel}</span>` : '';
  return `<span class="store-badges">${booking}${item.cuisine ? `<span class="store-tag">${escapeHtml(item.cuisine)}</span>` : ''}</span>`;
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
 * 菜單做成 44px 的按鈕（店家不放電話鈕，訂位與確認都走線上）；地址與全週營業收在摺疊區。
 */
export function renderStoreBody(item, { note = item.note, condition = item.condition, timing = '', foldFacts = true, day = null, time = '' } = {}) {
  const dishes = Array.isArray(item.dishes) ? item.dishes : [];
  const menu = safeHttpsUrl(item.menuUrl);
  // 排定餐段：先給「當天」那一行（日期＋當天時段＋能不能坐下吃），全週時段收進摺疊區；
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
    : `<div class="store-fact"><dt>營業</dt><dd>${escapeHtml(displayHours(item.hours))}</dd></div>`;
  const facts = `<dl class="store-facts">
      ${hoursRow}
      ${dishes.length ? `<div class="store-fact"><dt>推薦</dt><dd><ul class="store-dishes">${dishes.map(dish => `<li>${escapeHtml(dish)}</li>`).join('')}</ul></dd></div>` : ''}
    </dl>`;
  const actions = menu ? `<p class="store-actions"><a class="store-action" href="${menu}" target="_blank" rel="noopener noreferrer" aria-label="在新視窗開啟 ${escapeHtml(item.name)} 的菜單">菜單 ↗</a></p>` : '';
  const record = foldFacts
    ? `<details><summary>地址與全週營業</summary><p class="food-map-note">${escapeHtml(displayAddress(item.address))}</p>${renderDiningFacts(item, { includeHours: Boolean(dayHours) })}<p class="source-meta">不訂位，直接到店。</p></details>`
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
const MEAL_LABELS = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐' };

/**
 * 一餐的時刻資訊：每日頁的三餐清單與今日卡的「下一餐」共用，判斷規則只寫一次。
 * minute：step.t 是 HH:MM 時的分鐘數，否則 null。
 * before：「出礦後」「抵站放行李後」這類相對時間沒有分鐘數，改記行程表中它後面第一個有時刻的步驟，
 * 該時刻到了就代表這餐已經錯過；當天最後一餐後面沒有任何有時刻的步驟，保守算華沙時間 23:00 後已過。
 */
export function mealSchedule(day, item) {
  const step = day.steps.find(step => step.id === item.stepId);
  if (!step) throw new Error(`Day ${day.n} 找不到三餐步驟 ${item.stepId}`);
  const minute = toMinutes(step.t);
  const laterStep = minute === null ? day.steps.slice(day.steps.indexOf(step) + 1).map(next => toMinutes(next.t)).find(value => value !== null) : undefined;
  const before = minute === null && laterStep === undefined ? LAST_MEAL_CUTOFF_MINUTE : laterStep;
  return { step, label: MEAL_LABELS[item.meal], time: step.t, minute, before };
}

/** 每日頁、今日卡與餐飲指南共用；沒有門市的餐次只顯示安排，不產生假導航。 */
export function renderMealList(day, meals) {
  const labels = MEAL_LABELS;
  return `<ul class="day-food-list" data-three-meals="${day.n}">${meals.map(item => {
    const { step, minute, before: later } = mealSchedule(day, item);
    const eyebrow = `${labels[item.meal]} · ${step.t}${item.booking === 'booked' ? ' · 已訂妥' : item.condition ? ' · 先確認' : ''}`;
    return `<li class="day-food-item" id="meal-${escapeHtml(item.stepId)}" data-meal="${item.meal}" data-meal-label="${labels[item.meal]}" data-meal-time="${escapeHtml(step.t)}"${minute === null ? '' : ` data-meal-minute="${minute}"`}${later === undefined ? '' : ` data-meal-before-minute="${later}"`}${item.placeId ? '' : ' data-self="true"'}>
      ${renderStoreHead(item, eyebrow)}
      ${item.placeId ? renderStoreBody(item, { day, time: step.t }) : `<p>${escapeHtml(item.note)}</p>`}
    </li>`;
  }).join('')}</ul>`;
}

import { mealSchedule } from '../lib/dining.mjs';
import { dayMeals } from '../data/day-dining.js';
import { escapeAttr, escapeHtml, safeHttpsUrl, splitVerification } from '../lib/html.mjs';

// 2026-10-20 UX C：今日卡的硬時間只留第一句（要做什麼），查核括號（例如「官方要求…」）與後續說明不佔一屏空間；
// 完整原文在每日頁的「時間彈性」。
const actionText = value => {
  const text = splitVerification(value).main || String(value ?? '');
  const first = text.split(/(?<=；)/)[0].replace(/；$/, '');
  // 還是太長（手機超過兩行）時再拿掉括號補充說明。
  // 去掉括號後，前後若是英文或數字就補半形空格，避免「Zachodnia為規劃目標」這種黏在一起。
  const joinGap = (prev = '', next = '') => ((/[A-Za-z0-9]/.test(prev) && /[\u4e00-\u9fff]/.test(next)) || (/[\u4e00-\u9fff]/.test(prev) && /[A-Za-z0-9]/.test(next)) ? ' ' : '');
  return first.length > 36 ? first.replace(/（[^（）]*）/g, (match, at, whole) => joinGap(whole[at - 1], whole[at + match.length])) : first;
};
import { isDepartureDay, stayForDate } from '../lib/journey.mjs';
import { segmentForDay } from '../lib/rail.mjs';
import { renderLayout } from './layout.mjs';
import { dayOperations } from '../data/travel-database.js';
import { toMinutes, parseHardTimes, HARD_TIME_DEADLINES, dayIsoDate, todayIn } from '../lib/schedule.mjs';
import { privateSlots } from '../data/private-slots.js';
import { renderPrivateRuntime } from './private-panel.mjs';
import { dayGap, warsawTodayLocal, selectToday, statusText, warsawMinutes, nextPlanIndex, planEta, initializeToday } from '../scripts/today.js';
import { weatherCodeText, weatherIcon, weatherUrl, weatherAdvice, renderWeatherInto, loadWeather } from '../scripts/weather.js';
import { weatherPoints } from '../data/weather-points.js';

// 票券存放位置：只輸出「空的容器」，內容由瀏覽器端從這支手機的 localStorage 填入
// （見 scripts/private-data.js）。公開資料只有提醒文字，不含任何私人內容。
export function privateProofLine(slot, privateHref) {
  return `<span class="today-proof" data-private-slot="${escapeAttr(slot.id)}">
      <span data-private-has="where" hidden>票券在：<b data-private-text="where"></b></span>
      <span data-private-missing="where">存放位置還沒填 · <a href="${escapeAttr(privateHref)}">填寫</a></span>
      ${slot.kind === 'train' ? '<span data-private-has="seat" hidden> · 車廂／座位：<b data-private-text="seat"></b></span>' : ''}
      <span data-private-has="code" hidden> · 訂位代號 <b class="today-proof-code" data-private-text="code"></b></span>
    </span>`;
}

// 天氣：一行（圖示＋高低溫＋地點＋日落＋短標籤），不另開區塊。
// 建置時先放 10 月下旬平均氣候；瀏覽器端抓到當天預報再換掉（scripts/weather.js）。
function renderWeather(day, iso, sun) {
  const point = weatherPoints[day.n];
  if (!point) return '';
  return `<div class="today-weather" data-today-weather data-weather-lat="${point.lat}" data-weather-lng="${point.lng}" data-weather-date="${escapeAttr(iso)}" role="group" aria-label="${escapeAttr(point.place)}天氣提醒">
      <p class="today-weather-main"><span data-weather-summary hidden></span><span data-weather-fallback>🌥️ 10 月平均 ${point.climate.low}–${point.climate.high}°C</span><span class="today-weather-place"><span class="today-weather-name">${escapeHtml(point.place)}</span>${sun ? `<span class="today-weather-sun"> · 日落 ${escapeHtml(sun.sunset)}</span>` : ''}</span><span class="today-weather-meta" data-weather-meta hidden></span></p>
      <ul class="today-weather-tips" data-weather-tips data-weather-default><li>☂️ 備傘</li><li>🧥 帶外套</li></ul>
    </div>`;
}

// 一天的時間步驟（只取有 HH:MM 的），附上唯一確認過的地點與導航網址。
// 今日卡的「下一站」與晚上的「明天第一件事」共用。
function timedSteps(day) {
  const operation = dayOperations[day.n];
  return day.steps.map(step => {
    const matches = (operation?.addresses || []).filter(item => item.stepLabels?.includes(step.label));
    const place = matches.length === 1 ? matches[0] : null;
    const unresolved = operation?.unresolvedSteps?.find(item => item.label === step.label);
    const verifiedPlace = unresolved || !place?.reliable || /票面/.test(step.label) ? null : place;
    return {...step, minute:toMinutes(step.t), place:verifiedPlace, navigationHref:safeHttpsUrl(verifiedPlace?.url), reason:unresolved?.reason};
  }).filter(step => step.minute !== null).sort((a,b) => a.minute-b.minute);
}

// 一天的硬時間：一句可能含多個時刻且語意不同，逐一取出分類；來源字串保持原文。
function hardTimes(day, trainSegment) {
  return [
    ...(day.hardConstraints || []).flatMap(item => parseHardTimes(item)),
    ...(trainSegment ? parseHardTimes(`${trainSegment.dep} 發車 · ${trainSegment.type} · ${trainSegment.leg || '訂票狀態待確認'}`)
      .slice(0, 1).map(item => ({...item, text:`${trainSegment.dep} 發車 · ${trainSegment.type} · ${trainSegment.leg || '訂票狀態待確認'}`})) : []),
  ].sort((a,b) => a.minutes - b.minutes);
}

// 城際移動（火車、長途巴士、班機）：從行程步驟取，才分得出去程與回程；
// 步驟時刻對得上 rail 資料的那一段，訂票狀態取該段落的字句。
const INTERCITY_STEP = /(^|\s)(EIP|EIC|IC|TLK) \d+ 前往|^Lajkonik · |回程巴士|QR \d+ 起飛/;
function intercityLegs(steps, trainSegment) {
  const clauses = String(trainSegment?.leg || '').split('；').map(text => text.trim()).filter(Boolean);
  return steps.filter(step => INTERCITY_STEP.test(step.label)).map(step => {
    const own = clauses.find(text => text.includes(step.t)) || (step.t === trainSegment?.dep ? clauses[0] : '');
    // 摘要列只留狀態字：「已購票 · 17:40 發車」→「已購票」；「回程 15:30 → 16:55 尚未購票」→「尚未購票」。
    return { step, status: /未購|尚未/.test(own) ? '尚未購票' : own.split(' · ')[0] };
  });
}

function renderDayCard(day, { iso, stay, sun, dayHref, privateHref, tomorrow }) {
  const daySlots = privateSlots.filter(slot => slot.day === day.n);
  const trainSegment = segmentForDay(day);
  const bed = stayForDate(stay, iso);
  const checkout = !bed && stay.find(item => item.itineraryActive !== false && item.checkOut === iso);
  const operation = dayOperations[day.n];
  const steps = timedSteps(day);
  const timed = hardTimes(day, trainSegment);
  const legs = intercityLegs(steps, trainSegment);

  // 「幾點該開始移動」只從行程表既有的移動步驟推導，不自行加固定緩衝分鐘。
  // 找不到對應步驟就標待確認——寧可說不知道，也不給看起來像保證的數字。
  // 只看緊鄰期限的前一個步驟：中間若還有別的行程，代表人還在那裡沒開始移動，
  // 拿更早的移動步驟當出發時間會差上好幾小時（例如導覽整場結束後才要搭回程巴士）。
  const movementFor = minute => {
    const before = steps.filter(step => step.minute < minute);
    const step = before[before.length - 1];
    return step && /前往|出發|退房|搭|轉乘|步行|回旅館|取行李|報到|進站|抵|班次|列車|巴士|火車|SKM/.test(`${step.label} ${step.sub || ''}`)
      ? step : null;
  };
  // 前一段移動不一定通往同一個地方：例如某個場館「最後入場」之前最近的
  // 移動步驟，其實是前往另一個景點，拿它當出發時間會指錯地方。因此交通類
  // 期限（發車、報到）才直接採用行程表的進站步驟，場館類期限必須確認步驟與
  // 期限講的是同一個地點，對不上就標待確認。
  const sharedPhrase = (left, right, min = 3) => {
    const clean = value => String(value).replace(/[\s\d:：（）()、，,。;；·+]/g, '');
    const a = clean(left), b = clean(right);
    for (let len = Math.min(a.length, b.length); len >= min; len -= 1) {
      for (let i = 0; i + len <= a.length; i += 1) if (b.includes(a.slice(i, i + len))) return true;
    }
    return false;
  };
  const moveHint = item => {
    if (!HARD_TIME_DEADLINES.has(item.kind)) return '';
    const step = movementFor(item.minutes);
    const sameTarget = step && (item.kind === 'departure' || item.kind === 'checkin'
      || sharedPhrase(item.text, `${step.label} ${step.sub || ''}`));
    return sameTarget
      ? `<span class="today-move">依行程表，這段移動由 ${escapeHtml(step.t)}「${escapeHtml(step.label)}」開始${step.dur ? `（行程表估時 ${escapeHtml(step.dur)}）` : '（行程表未列估時）'}；實際出發仍須加上取行李與現場狀況。</span>`
      : '<span class="today-move">這站沒有估好的移動時間：照票券時間提早 15 分出門。</span>';
  };
  // 這站要帶的票：步驟名稱命中票券欄位；沒命中但下一步 60 分鐘內就要用票（例如抵達場館後入場、
  // 抵站後上車），也提早一站提醒。
  const ticketFor = (step, index) => {
    const match = item => daySlots.find(slot => slot.stepPattern && item.label.includes(slot.stepPattern));
    const nextStep = steps[index + 1];
    return match(step) || (nextStep && nextStep.minute - step.minute <= 60 ? match(nextStep) : null);
  };
  const leaving = isDepartureDay(day);
  // 離境日的班機起飛時刻：從行程步驟（QR 000 起飛）推導，起飛後今日卡改顯示結束語。
  const flightStep = leaving ? steps.find(step => /起飛/.test(step.label) && /\b[A-Z]{2} \d+/.test(step.label)) : null;
  const hotelMap = bed?.addressVerified ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bed.name+' '+bed.address)}` : null;
  const hotelNavLabel = bed?.id === 'poznan-towarowa' ? '接待處導航' : '住宿導航';
  const meals = (dayMeals[day.n] || []).map(item => ({ item, ...mealSchedule(day, item) }));
  const nightCount = operation?.nightChecklist?.length || 0;

  // 晚上的「明天第一件事」：明天第一個有時刻的步驟、最早的硬時間、要帶的票與退房。
  const tomorrowBlock = (() => {
    if (!tomorrow) return '';
    // 明天一早就起飛的班機（例如 QR 815 香港 01:25）步驟時刻寫成相對時間，不在有時刻的清單裡，要先補進來。
    const earlyFlight = (() => {
      const step = tomorrow.day.steps[0];
      const clock = step?.timingMode === 'relative' && /\b[A-Z]{2} \d+/.test(step.label) ? String(step.sub || '').match(/\d{1,2}:\d{2}/)?.[0] : null;
      return clock ? { ...step, t: `${clock} 起飛` } : null;
    })();
    const first = earlyFlight || timedSteps(tomorrow.day)[0];
    const hard = hardTimes(tomorrow.day, segmentForDay(tomorrow.day)).find(item => HARD_TIME_DEADLINES.has(item.kind));
    const slots = privateSlots.filter(slot => slot.day === tomorrow.day.n && slot.kind !== 'flight');
    const checkout = stay.find(item => item.itineraryActive !== false && item.checkOut === tomorrow.iso);
    return `<section class="today-block today-tomorrow" data-today-tomorrow>
      <div class="today-block-head"><h3>明天第一件事</h3><span class="today-next-progress">Day ${tomorrow.day.n} · ${escapeHtml(tomorrow.day.date)}</span></div>
      ${first ? `<div class="today-next-main"><p class="today-next-clock"><b>${escapeHtml(first.t)}</b></p><p class="today-next-title">${escapeHtml(first.label)}</p>${first.navigationHref ? `<a class="today-next-nav" href="${first.navigationHref}" target="_blank" rel="noopener noreferrer">導航 ↗</a>` : ''}</div>` : '<p>明天沒有排定時刻的行程。</p>'}
      <ul class="today-glance">
        ${hard ? `<li data-glance-wrap><span class="today-glance-key">硬時間</span><span class="today-glance-val"><b>${escapeHtml(hard.hhmm)} · ${escapeHtml(hard.kindLabel)}</b> ${escapeHtml(actionText(hard.text))}</span></li>` : ''}
        ${slots.length ? `<li data-glance-wrap><span class="today-glance-key">要帶</span><span class="today-glance-val">${slots.map(slot => escapeHtml(slot.label)).join('、')}</span></li>` : ''}
        ${checkout ? `<li><span class="today-glance-key">退房</span><span class="today-glance-val"><b>${escapeHtml(checkout.name)}</b> · ${escapeHtml(checkout.checkOutTime || '依訂房確認')} 前</span></li>` : ''}
      </ul>
    </section>`;
  })();

  return `<article class="today-card" data-today-card data-today-date="${escapeHtml(iso)}" data-time-zone="${escapeHtml(day.timeZone || 'Europe/Warsaw')}"${flightStep ? ` data-flight-minute="${flightStep.minute}"` : ''}>
    <header class="today-head">
      <p class="today-head-meta"><span class="today-day-badge">Day ${day.n}</span><span class="today-head-date">${escapeHtml(day.date)}</span></p>
      <h2>${escapeHtml(day.title)}</h2>
      <p class="today-head-dek">${escapeHtml(day.headline)}</p></header>
    <div class="today-day" data-today-day>
    <section class="today-block today-next" data-today-next>
      <div class="today-block-head"><h3>下一站</h3><span class="today-next-mode" data-next-mode>依行程表時刻，不是即時定位。</span><span class="today-next-progress" data-next-progress hidden></span></div>
      ${steps.map((step, index) => { const slot = ticketFor(step, index); return `<div class="today-next-step" data-next-step data-plan-minute="${step.minute}">
        <div class="today-next-main"><p class="today-next-clock"><b>${escapeHtml(step.t)}</b><span class="today-next-eta" data-next-eta hidden></span></p>
        <p class="today-next-title">${escapeHtml(step.label)}</p>
        <a class="today-next-nav" data-next-nav href="${step.navigationHref ? step.navigationHref : escapeHtml(dayHref+'#directions')}" ${step.navigationHref ? 'target="_blank" rel="noopener noreferrer"' : ''}>${step.navigationHref ? '導航 ↗' : '地址 →'}</a></div>
        ${slot ? `<p class="today-next-ticket"><span class="today-glance-key">要帶</span><b>${escapeHtml(slot.label)}</b>${privateProofLine(slot, privateHref)}</p>` : ''}
        ${step.place ? `<p class="today-next-sub" lang="pl">${escapeHtml(step.place.address)}${step.place.entranceNote ? ` · ${escapeHtml(step.place.entranceNote)}` : ''}</p>` : step.sub ? `<p class="today-next-sub">${escapeHtml(step.sub)}</p>` : ''}
      </div>`; }).join('')}
      ${timed.map(item => `<p class="today-hard" data-hard-time data-plan-minute="${item.minutes}"><b>${escapeHtml(item.hhmm)} · ${escapeHtml(item.kindLabel)}</b><span class="today-hard-eta" data-hard-eta hidden></span><span class="today-hard-source">${escapeHtml(actionText(item.text))}</span>${moveHint(item)}</p>`).join('')}
      <p class="today-next-ended" data-next-ended hidden>今天已沒有更晚的預定行程。</p>
    </section>
    <ul class="today-glance today-glance-day">
      <li data-next-meal data-glance-wrap hidden><span class="today-glance-key">下一餐</span><span class="today-glance-val" data-next-meal-text></span><a class="today-glance-nav" data-next-meal-nav href="${escapeHtml(dayHref)}#day-food" hidden>導航 ↗</a></li>
      ${legs.map(({ step, status }) => `<li data-today-leg data-glance-wrap data-plan-minute="${step.minute}"><span class="today-glance-key">下一段車</span><span class="today-glance-val"><b>${escapeHtml(step.t)}</b> ${escapeHtml(step.label.replace(/^★\s*/, ''))}${status ? ` · ${escapeHtml(status)}` : ''}</span></li>`).join('')}
      <li data-today-bed-row><span class="today-glance-key">${bed ? '住宿' : leaving ? '今晚' : '住宿'}</span><span class="today-glance-val">${bed ? `<b>${escapeHtml(bed.name)}</b>` : leaving ? '離境／機上過夜' : day.overnight ? escapeHtml(day.overnight) : '<b>查不到今晚住宿</b>'}</span>${hotelMap ? `<a class="today-glance-nav" href="${escapeHtml(hotelMap)}" target="_blank" rel="noopener noreferrer">導航 ↗</a>` : ''}</li>
    </ul>
    <ul hidden data-today-meals>${meals.map(({ item, label, time, minute, before }) => { const map = safeHttpsUrl(item.map || item.mapUrl); return `<li data-meal-label="${escapeAttr(label)}" data-meal-time="${escapeAttr(time)}" data-meal-name="${escapeAttr(item.name)}"${minute === null ? '' : ` data-meal-minute="${minute}"`}${before === undefined ? '' : ` data-meal-before-minute="${before}"`}${map ? ` data-meal-map="${escapeAttr(map)}"` : ''}></li>`; }).join('')}</ul>
    ${renderWeather(day, iso, sun)}
    ${checkout ? `<p class="today-hotel-phone" data-private-slot="stay-${escapeAttr(checkout.id)}" data-private-has="phone" hidden>${escapeHtml(checkout.name)} 退房聯絡：<a data-private-tel="phone" class="private-tel"></a></p>` : ''}
    <a class="today-full-link" data-today-full href="${escapeHtml(dayHref)}#schedule">看今天完整行程 →</a>
    </div>
    <div class="today-evening" data-today-evening>
    <section class="today-block today-stay${!bed && !leaving && !day.overnight ? ' today-block-alert' : ''}" data-today-stay><div class="today-block-head"><h3>${bed ? '回住宿' : leaving ? '離境與行李' : day.overnight ? '轉機與行李' : '今晚住宿：資料缺漏'}</h3></div>
      ${bed ? `<div class="today-next-main today-stay-main"><p class="today-next-title">${escapeHtml(bed.name)}</p>${hotelMap ? `<a class="today-next-nav" href="${escapeHtml(hotelMap)}" target="_blank" rel="noopener noreferrer" aria-label="${hotelNavLabel}">${hotelNavLabel} ↗</a>` : ''}</div>
        <p class="today-address" lang="pl">${escapeHtml(bed.address)}</p>
        <p class="today-hotel-phone" data-private-slot="stay-${escapeAttr(bed.id)}"><span data-private-missing="phone">住宿電話：填在「我的私人資料」（只存在這支手機）</span><a data-private-has="phone" data-private-tel="phone" hidden class="private-tel"></a>${!bed.addressVerified ? '<span class="source-meta">門牌尚未確認，請先核對私人訂房資料；不提供精確導航。</span>' : bed.id === 'poznan-towarowa' ? '<span class="source-meta">此地址為接待與取鑰匙處；實際公寓門牌依私人訂房確認。</span>' : ''}</p>`
        : day.overnight ? `<p>${escapeHtml(day.overnight)}。電子機票、登機證存離線，抵香港後直接前往轉機登機門。</p>`
        : leaving ? `<p data-leaving-pre>今晚離境／機上過夜。先確認航班報到、退稅與機場交通。</p><p data-leaving-post hidden><b>旅程結束，一路順風。</b></p>`
        : `<p><b>這一天不是離境日，但查不到當晚住宿。</b>這是資料缺漏，不是「不用住」——請先補上訂房或確認安排。</p>`}
    </section>
    ${tomorrowBlock}
    <div class="today-evening-actions">
      ${nightCount ? `<a class="today-glance-link" data-night-link href="${escapeHtml(dayHref)}#night-checklist-heading">晚間準備 ${nightCount} 項 →</a>` : ''}
      <a class="today-full-link" data-evening-full href="${escapeHtml(tomorrow ? tomorrow.href : dayHref)}#schedule">${tomorrow ? '看明天完整行程 →' : '看今天完整行程 →'}</a>
    </div>
    </div>
  </article>`;
}

/**
 * 今日卡：旅途中唯一真正會開的一頁。
 *
 * 八天全部在建置時靜態渲染，前端只決定顯示哪一張——靜態站不知道「今天」是
 * 哪天，而把內容留到前端組裝會讓離線與無 JavaScript 情境同時失效。
 * 日期以華沙當地時間判斷（行前倒數看台北，人在當地時看當地），
 * 跨越 10/25 冬令時轉換仍正確。
 *
 * 所有選取器一律用 data-*，不用 id：單檔版會替每頁的 id 加前綴，
 * 寫死 id 的腳本在單檔版會失效。
 */
export function renderToday({ meta, days, stay, daylight = [], safety, pathPrefix = '' }) {
  const daylightByDay = new Map(daylight.map(item => [item.day, item]));
  const dayHrefOf = day => `${pathPrefix}day-${String(day.n).padStart(2, '0')}.html`;
  const cards = days.map((day, index) => renderDayCard(day, {
    iso: dayIsoDate(day.date, meta.tripStart),
    stay,
    sun: daylightByDay.get(day.n),
    dayHref: dayHrefOf(day),
    privateHref: `${pathPrefix}practical/essentials.html#my-private`,
    tomorrow: days[index + 1] ? { day: days[index + 1], iso: dayIsoDate(days[index + 1].date, meta.tripStart), href: dayHrefOf(days[index + 1]) } : null,
  })).join('');

  // 內嵌時沒有 import；日期與選日函式的相依也必須一起帶入。
  const todayRuntime = [todayIn, dayGap, warsawTodayLocal, selectToday, statusText, warsawMinutes, nextPlanIndex, planEta, weatherCodeText, weatherIcon, weatherUrl, weatherAdvice, renderWeatherInto, loadWeather, initializeToday]
    .map(fn => fn.toString()).join('\n');

  // 緊急電話排成一列可點的號碼膠囊：號碼大、說明小，一眼就能按。
  // 原本是滿版紅色區塊，把「接下來去哪」推出首屏——真的要打時只需要號碼本身。
  // 旅途中的精簡版（手機）只留 112、999 與駐波蘭代表處急難救助三顆，其餘號碼加 today-sos-extra
  // 在精簡版隱藏；非旅途期間版面不變，代表處那一顆（today-sos-compact-only）也不出現。
  const COMPACT_KEEP = new Set(['112', '999']);
  const emergency = (safety?.emergency || [])
    .map(([label, number]) => `<li${COMPACT_KEEP.has(number) ? '' : ` class="today-sos-extra${number.replace(/\D/g, '').length > 4 ? ' today-sos-wide' : ''}"`}><a href="tel:${escapeAttr(number.replace(/\s+/g, ''))}">${escapeHtml(number)}</a><span>${escapeHtml(label)}</span></li>`).join('');
  const embassyUrgent = (safety?.embassy || []).find(([label]) => /急難救助/.test(label));
  const embassyItem = embassyUrgent
    ? `<li class="today-sos-compact-only today-sos-wide"><a href="tel:${escapeAttr(embassyUrgent[1].replace(/[^\d+]/g, ''))}">${escapeHtml(embassyUrgent[1])}</a><span>駐波蘭代表處急難救助</span></li>` : '';
  // 保險救援電話只在使用者填過之後才出現（內容來自這支手機的 localStorage）。
  const insurerItem = `<li class="today-sos-insurer today-sos-wide" data-private-has="insurerPhone" hidden><a data-private-tel="insurerPhone" class="private-tel"></a><span>我的保險救援</span></li>`;

  const bodyHtml = `
    <div data-today-page>
    <header class="journal-appendix-header is-compact">
      <!-- 版式的 ::before 已經印出「TODAY」（稽核 M11）；這裡再放一次 section-num
           會在手機上變成上下兩行一模一樣的 TODAY，白佔一段首屏。 -->
      <h1>今日卡</h1>
      <p class="hero-dek">今天該做什麼、住哪、幾點出發、天黑前要收哪一段，集中在這一頁。出發日以台北時間，其餘日期以華沙時間判斷；轉機航段另標各機場當地時間。</p>
    </header>

    <nav class="today-date-controls" aria-label="切換旅行日期">
      <label class="today-field">查看日期 <select data-date-picker>${days.map(day => `<option value="${dayIsoDate(day.date, meta.tripStart)}">Day ${day.n} · ${escapeHtml(day.date)}</option>`).join('')}</select></label>
      <div class="today-date-buttons">
        <button type="button" data-date-prev aria-label="看前一天">← 前一天</button>
        <button type="button" data-date-reset>回到今天</button>
        <button type="button" data-date-next aria-label="看後一天">後一天 →</button>
      </div>
    </nav>
    <p class="today-status" data-today-status>正在判斷今天是旅程的第幾天…</p>
    <noscript><p class="today-status">JavaScript 未啟用時無法自動選日，以下列出全部 ${days.length} 天。</p></noscript>

    <!-- 出發前／旅程結束後的提示原本排在整頁最底，要捲過八張卡才看得到；
         改放在日期列正下方，一眼就知道「現在看的是預覽」以及下一步去哪。 -->
    <aside class="today-outside" data-today-outside aria-label="不在旅程期間" hidden>
      <p class="today-outside-title">不在旅程期間</p>
      <p data-today-outside-note></p>
      <p class="today-outside-links"><a href="${pathPrefix}practical/booking.html#countdown">看待辦總覽 →</a><a href="${pathPrefix}practical/todos.html">待辦事項 →</a><a href="${pathPrefix}index.html#days">八日行程目錄 →</a></p>
    </aside>

    <section class="today-sos" data-today-sos aria-label="緊急電話">
      <p class="today-sos-title"><span class="today-sos-tag">SOS</span>緊急電話</p>
      <ul class="today-sos-list">${emergency}${embassyItem}${insurerItem}</ul>
      <p class="source-meta">歐洲通用緊急號碼 112 可直接撥打，不需解鎖或有 SIM 卡餘額。</p>
      <p class="source-meta today-sos-private" data-private-missing="insurerPhone">保險救援電話還沒填 · <a href="${pathPrefix}practical/essentials.html#my-private">填入我的私人資料</a>（只存在這支手機）</p>
    </section>

    <div data-today-cards>${cards}</div>

    </div>

    <script>
      (function() {
        ${todayRuntime}
        const root = document.currentScript.closest('.standalone-page') || document;
        initializeToday(root, undefined, ${JSON.stringify(meta.travelStart)});
      }());
    </script>
    ${renderPrivateRuntime()}`;

  return renderLayout({
    title: '今日卡',
    activeNav: 'today',
    bodyHtml: bodyHtml.trim(),
    pathPrefix,
    pageKind: 'today',
    currentPage: 'today.html',
    // 自動章節目錄會列出全部八張日卡的標題，但其中七張由 JS 隱藏：
    // 連到看不見的內容，還把「接下來去哪」推到兩個螢幕以外。這頁自己排優先順序。
    chapterIndex: false,
    description: '旅途中的單頁速查：今天的硬時間點、住宿地址、交通、餐飲、日照與備案。',
  });
}

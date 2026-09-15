import { bookingProgress, isDepartureDay } from '../lib/journey.mjs';
import { renderLayout } from './layout.mjs';
import { dayOperations } from '../data/travel-database.js';
import { toMinutes, parseHardTimes, HARD_TIME_DEADLINES } from '../lib/schedule.mjs';
import { dayIsoDate } from '../lib/schedule.mjs';
import { dayGap, warsawTodayLocal, selectToday, statusText, warsawMinutes, nextPlanIndex, initializeToday } from '../scripts/today.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeHttpsUrl(value) {
  const raw = String(value ?? '').trim();
  return /^https:\/\//.test(raw) ? raw : null;
}

/** 當晚落腳處：入住日當天到退房日前一天都算這一筆。 */
function stayForDate(stay, iso) {
  return stay.find(item => item.checkIn <= iso && iso < item.checkOut) || null;
}

function renderSteps(day) {
  const rows = day.steps.map(step => `<tr>
      <td class="number" data-label="時間"><b>${escapeHtml(step.t || '—')}</b></td>
      <td data-label="行程">${escapeHtml(step.label)}${step.sub ? `<br><span class="source-meta">${escapeHtml(step.sub)}</span>` : ''}</td>
    </tr>`).join('');
  return `<div class="table-wrap"><table class="table-editorial"><thead><tr><th>時間</th><th>行程</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderDayCard(day, { iso, stay, dining, sun, dayHref }) {
  const bed = stayForDate(stay, iso);
  const checkout = stay.find(item => item.checkOut === iso);
  const operation = dayOperations[day.n];
  const progress = bookingProgress(day);
  const list = items => items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  const meal = item => `<li><b>${escapeHtml(item.role)}：${escapeHtml(item.name)}</b>
    <p>${escapeHtml(item.note || '')}</p><p class="source-meta">${escapeHtml(item.address || '')}</p>
    ${safeHttpsUrl(item.map) ? `<a href="${escapeHtml(item.map)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}導航 ↗</a>` : ''}</li>`;
  // 同一天的「首選」其實橫跨不同餐別（午餐＋晚餐＋點心），不是互斥選項。
  // 正餐與點心分開列，避免看起來像「這些全都要吃」或「只能挑一家」。
  const primary = (dining || []).filter(item => !/替補|備案/.test(item.role));
  const alternatives = (dining || []).filter(item => /替補|備案/.test(item.role));
  const mainMeals = primary.filter(item => /早餐|午餐|晚餐/.test(item.role));
  const snacks = primary.filter(item => !/早餐|午餐|晚餐/.test(item.role));
  const steps = day.steps.map(step => {
    const matches = (operation?.addresses || []).filter(item => item.stepLabels?.includes(step.label));
    const place = matches.length === 1 ? matches[0] : null;
    const unresolved = operation?.unresolvedSteps?.find(item => item.label === step.label);
    return {...step, minute:toMinutes(step.t), place:unresolved || !place?.reliable || /票面/.test(step.label) ? null : place, reason:unresolved?.reason};
  }).filter(step => step.minute !== null).sort((a,b) => a.minute-b.minute);

  // 一句可能含多個時刻且語意不同，逐一取出分類；來源字串保持原文。
  const timed = [
    ...(day.hardConstraints || []).flatMap(item => parseHardTimes(item)),
    ...(day.train ? parseHardTimes(`${day.train.dep} 發車 · ${day.train.type} · ${day.train.leg || '訂票狀態待確認'}`)
      .slice(0, 1).map(item => ({...item, text:`${day.train.dep} 發車 · ${day.train.type} · ${day.train.leg || '訂票狀態待確認'}`})) : []),
  ].sort((a,b) => a.minutes - b.minutes);

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
  // 前一段移動不一定通往同一個地方：Day 7 的「17:00 皇家城堡最後入場」之前
  // 最近的移動步驟是前往起義博物館，拿它當出發時間會指錯地方。因此交通類
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
      : '<span class="today-move">最晚出發時間待確認：行程表沒有對得上這個地點的移動步驟與估時，請依票券與現場公告自行抓緩衝。</span>';
  };
  const leaving = isDepartureDay(day);
  const hotelMap = bed?.addressVerified ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(bed.name+' '+bed.address)}` : null;
  return `<article class="today-card" data-today-card data-today-date="${escapeHtml(iso)}">
    <header class="today-head"><span class="eyebrow">Day ${day.n} · ${escapeHtml(day.date)}</span>
      <h2>${escapeHtml(day.title)}</h2><p>${escapeHtml(day.headline)}</p><a href="${escapeHtml(dayHref)}">完整當日行程 →</a></header>
    <section class="today-block today-next" data-today-next>
      <h3>接下來去哪</h3><p class="source-meta" data-next-mode>依行程表預覽；不是即時定位或交通資訊。</p>
      <label>改看其他行程 <select data-step-picker aria-label="選擇要查看的行程">${steps.map((step,index) => `<option value="${index}">${escapeHtml(step.t)} · ${escapeHtml(step.label)}</option>`).join('')}</select></label>
      ${steps.map(step => `<div data-next-step data-plan-minute="${step.minute}">
        <p class="today-next-title"><b>${escapeHtml(step.t)} · ${escapeHtml(step.label)}</b></p>
        <p>${escapeHtml(step.sub || '')}</p>
        ${step.place ? `<p lang="pl">${escapeHtml(step.place.address)}</p><p>${escapeHtml(step.place.entranceNote || '')}</p>` : `<p class="source-meta">${escapeHtml(step.reason || '此步驟沒有唯一確認的入口，請查看當日地址與移動步驟。')}</p>`}
        <a data-next-nav href="${step.place && safeHttpsUrl(step.place.url) ? escapeHtml(step.place.url) : escapeHtml(dayHref+'#directions')}" ${step.place && safeHttpsUrl(step.place.url) ? 'target="_blank" rel="noopener noreferrer"' : ''}>${step.place && safeHttpsUrl(step.place.url) ? '導航到這一站 ↗' : '查看地址與移動方式 →'}</a>
      </div>`).join('')}
      <p data-next-ended hidden>今天已沒有更晚的預定行程。可查看其他時段或回住宿休息。</p>
    </section>
    <nav class="today-actions" aria-label="今日快捷操作">
      <button type="button" data-today-action="next">下一站</button><button type="button" data-today-action="food">今天吃哪</button>
      <button type="button" data-today-action="stay">${bed ? '回住宿' : leaving ? '去機場' : '住宿待確認'}</button><a href="${escapeHtml(dayHref)}">完整行程</a>
    </nav>
    <section class="today-block today-block-alert">
      <h3>下一個時間提醒</h3>
      ${timed.length ? `${timed.map(item => `<p data-hard-time data-plan-minute="${item.minutes}"><b>${escapeHtml(item.hhmm)} · ${escapeHtml(item.kindLabel)}</b><span class="today-hard-source">${escapeHtml(item.text)}</span>${moveHint(item)}</p>`).join('')}
      <p data-hard-ended hidden>今天的定時提醒都已過時間；仍請核對票券與現場公告。</p>
      <p class="source-meta">報到、入場、最後入場與發車分開標示。預定時間不代表已訂妥。</p>`
      : '<p><b>今天沒有定時的硬性時間點。</b></p><p class="source-meta">這一天的限制不綁時刻（見下方展開），仍請核對票券與現場公告。</p>'}
      <details><summary>今天不能延誤／時間不夠怎麼調整</summary><ul>${list(day.hardConstraints || [])}</ul>
        <p><b>可以壓縮：</b></p><ul>${list(day.compressible || [])}</ul></details>
    </section>
    ${day.train ? `<section class="today-block"><h3>今天的城際移動</h3>
      <p class="today-transport-status"><b>${escapeHtml(day.train.leg || '訂票狀態待確認')}</b></p>
      <p>${escapeHtml(day.train.type)} · ${escapeHtml(day.train.from)} → ${escapeHtml(day.train.to)}</p>
      <p><b>${escapeHtml(day.train.dep)} – ${escapeHtml(day.train.arr)}</b>（${escapeHtml(day.train.dur)}）</p>
      <a href="${escapeHtml(dayHref)}#day-preparation">票務與當日提醒 →</a></section>` : ''}
    <section class="today-block" data-today-food><h3>今天吃哪</h3>
      <p class="source-meta">正餐按餐別各列一家；點心與候選看體力和動線插入，不必全吃。候選不代表已訂位，導航開啟後請再確認營業與最後點餐時間。</p>
      <ul class="today-list">${mainMeals.map(meal).join('') || '<li>今天沒有指定正餐，依現場動線用餐。</li>'}</ul>
      ${snacks.length ? `<p class="today-snack-label"><b>順路點心／候選</b>（${snacks.length} 家，不必全吃）</p>
      <ul class="today-list">${snacks.map(meal).join('')}</ul>` : ''}
      ${alternatives.length ? `<details><summary>客滿或想換口味：${alternatives.length} 家替補</summary><ul class="today-list">${alternatives.map(meal).join('')}</ul></details>` : ''}
      <a href="${escapeHtml(dayHref)}#day-food">順路必吃與完整餐飲 →</a></section>
    <section class="today-block${!bed && !leaving ? ' today-block-alert' : ''}" data-today-stay><h3>${bed ? '住宿與行李' : leaving ? '離境與行李' : '今晚住宿：資料缺漏'}</h3>
      ${checkout ? `<p><b>今天退房：</b>${escapeHtml(checkout.name)}。${escapeHtml(checkout.checkOutTime || '退房時間依訂房確認')}前辦理；寄放與取件方式先向住宿確認。</p>` : ''}
      ${bed ? `<p><b>今晚落腳：${escapeHtml(bed.name)}</b>（${escapeHtml(bed.status)}）</p>
        <p class="today-address" lang="pl">${escapeHtml(bed.address)}</p>
        <p>${bed.checkIn === iso ? `今天入住：${escapeHtml(bed.checkInTime || '時間依訂房確認')}` : '今晚連住，不必再次辦理入住。'}</p>
        <p class="source-meta">${!bed.addressVerified ? '門牌尚未確認，請先核對私人訂房資料；不提供精確導航。' : bed.id === 'poznan-towarowa' ? '此地址為接待與取鑰匙處；實際公寓門牌依私人訂房確認。' : '已核對的住宿地址，可出示給司機或櫃檯。'}</p>
        ${hotelMap ? `<a href="${escapeHtml(hotelMap)}" target="_blank" rel="noopener noreferrer">${bed.id === 'poznan-towarowa' ? '接待處導航' : '住宿導航'} ↗</a>` : ''}` : leaving ? `<p>今晚離境／機上過夜。先確認航班報到、退稅與機場交通。</p><a href="${escapeHtml(dayHref)}#directions">開啟機場地址與交通 →</a>`
        : `<p><b>這一天不是離境日，但查不到當晚住宿。</b>這是資料缺漏，不是「不用住」——請先補上訂房或確認安排。</p><a href="${escapeHtml(dayHref)}#day-preparation">查看當日訂房與提醒 →</a>`}
    </section>
    <details class="today-block"><summary>全天時間表</summary>${renderSteps(day)}</details>
    <details class="today-block"><summary>預約與待辦 · ${progress.pending.length} 項待處理</summary>
      <h3>仍未訂妥</h3><ul>${list(progress.pending) || '<li>無待訂項目。</li>'}</ul>
      ${progress.confirmed.length ? `<h3>已完成預約</h3><ul>${list(progress.confirmed)}</ul>` : ''}
      <a href="${escapeHtml(dayHref)}#day-preparation">完整訂票提醒 →</a></details>
    <details class="today-block"><summary>日照、備案與晚間準備</summary>
      ${sun ? `<h3>日照</h3><p>日出 ${escapeHtml(sun.sunrise)}／日落 <b>${escapeHtml(sun.sunset)}</b>／藍調至 ${escapeHtml(sun.blueHourEnd)}（${escapeHtml(sun.tz)}）</p><p>${escapeHtml(sun.note)}</p>` : ''}
      <h3>備案</h3><ul>${(day.backup || []).map(item => `<li><b>${escapeHtml(item.label)}：${escapeHtml(item.where)}</b><p>${escapeHtml(item.why || '')}</p>${safeHttpsUrl(item.map) ? `<a href="${escapeHtml(item.map)}" target="_blank" rel="noopener noreferrer">備案導航 ↗</a>` : ''}</li>`).join('')}</ul>
      <h3>晚間準備</h3><ul>${list(operation?.nightChecklist || [])}</ul>
    </details>
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
export function renderToday({ meta, days, stay, dayDining = {}, daylight = [], safety, pathPrefix = '' }) {
  const daylightByDay = new Map(daylight.map(item => [item.day, item]));
  const cards = days.map(day => renderDayCard(day, {
    iso: dayIsoDate(day.date, meta.tripStart),
    stay,
    dining: dayDining[String(day.n)],
    sun: daylightByDay.get(day.n),
    dayHref: `${pathPrefix}day-${String(day.n).padStart(2, '0')}.html`,
  })).join('');

  // 內嵌時沒有 import，相依函式要全部列進來（dayGap 支撐 selectToday）。
  const todayRuntime = [dayGap, warsawTodayLocal, selectToday, statusText, warsawMinutes, nextPlanIndex, initializeToday]
    .map(fn => fn.toString()).join('\n');

  const emergency = (safety?.emergency || [])
    .map(([label, number]) => `<li><b>${escapeHtml(number)}</b>　${escapeHtml(label)}</li>`).join('');

  const bodyHtml = `
    <header class="journal-appendix-header">
      <span class="section-num">Today</span>
      <h1>今日卡</h1>
      <p class="hero-dek">今天該做什麼、住哪、幾點出發、天黑前要收哪一段，集中在這一頁。日期以華沙當地時間判斷。</p>
    </header>

    <nav class="today-date-controls" aria-label="切換旅行日期">
      <button type="button" data-date-prev aria-label="看前一天">← 前一天</button>
      <label>查看日期 <select data-date-picker>${days.map(day => `<option value="${dayIsoDate(day.date, meta.tripStart)}">Day ${day.n} · ${escapeHtml(day.date)}</option>`).join('')}</select></label>
      <button type="button" data-date-next aria-label="看後一天">後一天 →</button>
      <button type="button" data-date-reset>回到今天</button>
    </nav>
    <p class="today-status" data-today-status>正在判斷今天是旅程的第幾天…</p>
    <noscript><p class="today-status">JavaScript 未啟用時無法自動選日，以下列出全部 ${days.length} 天。</p></noscript>

    <div data-today-cards>${cards}</div>

    <section class="section" data-today-outside hidden>
      <div class="section-heading"><span class="section-num">Off-trip</span><h2>不在旅程期間</h2></div>
      <p data-today-outside-note></p>
      <p><a class="journal-text-link" href="${pathPrefix}practical/booking.html#countdown">看訂票與查核倒數 →</a>　<a class="journal-text-link" href="${pathPrefix}index.html#days">開啟八日行程目錄 →</a></p>
    </section>

    <section class="section">
      <div class="section-heading"><span class="section-num">SOS</span><h2>緊急電話</h2></div>
      <ul class="today-list">${emergency}</ul>
      <p class="source-meta">歐洲通用緊急號碼 112 可直接撥打，不需解鎖或有 SIM 卡餘額。</p>
    </section>

    <script>
      (function() {
        ${todayRuntime}
        const root = document.currentScript.closest('.standalone-page') || document;
        initializeToday(root);
      }());
    </script>`;

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

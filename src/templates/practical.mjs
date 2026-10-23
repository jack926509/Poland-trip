import { mealTiming, renderMealList, renderStoreBadges, renderStoreBody, renderStoreHead } from '../lib/dining.mjs';
import { dayMeals, dayDining } from '../data/day-dining.js';
import { days } from '../data/trip.js';
import { todoItemId } from '../lib/journey.mjs';
import { todoStats, isTodoOpen, statusTagClass } from '../lib/todo-status.mjs';
import { escapeHtml, linkifyText, safeHttpsUrl, renderDataNote, splitVerification, VERIFICATION_PATTERN } from '../lib/html.mjs';
import { renderLayout } from './layout.mjs';
import { cityGuideByName, dayPageForDate, cityRoutes } from '../lib/city-guide.mjs';
import { renderFastFoodMenu } from './fast-food.mjs';
import { renderSosSection, renderPrivateRuntime } from './sos.mjs';

/**
 * 實用資料原本與每日行程、城市指南完全沒有內容連結（只靠導覽選單）。
 * 這些欄位本來就帶著對應鍵——門票是「城市 · 景點」、火車有日期、交通票價按城市分、
 * 米其林訂位的店名帶「（城市）」——接回去即可。對不上就不給連結，不硬湊。
 * 實用資料頁都在 practical/ 之下，所以前綴是 '../'。
 */
function cityLink(text, suffix = '') {
  const guide = cityGuideByName(text, '../');
  return guide ? `<a class="cross-link" href="${guide.href}${suffix}">${guide.name}指南 →</a>` : '';
}

function dayLink(date) {
  const day = dayPageForDate(date, '../');
  return day ? `<a class="cross-link" href="${day.href}">Day ${day.n} →</a>` : '';
}

import { getTaipeiToday, toComparableDate, todayIn, isOpenTodoStatus, isOpenEntryStatus, calculateDashboard, calculateCountdown, collectDeadlines, urgencyOf, labelOf, initializeCountdown, dashboardCsv, initializeDashboard, markOverdueRechecks } from '../scripts/dashboard.js';
// 內嵌用的是 fn.toString()，吐出的是函式「自己的名字」而不是 import 的別名。
// getTaipeiToday 是 taipeiToday 的別名，內嵌後頁面上只會有 taipeiToday，
// 呼叫端必須用真名，否則在瀏覽器裡是 ReferenceError（靜態輸出看起來正常，
// 但每分鐘的重算完全不會執行）。
import { taipeiToday, dayIsoDate } from '../lib/schedule.mjs';
import { meta } from '../data/trip.js';

function serializeForInlineScript(value) {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function renderAppendixHeader({ kicker, title, dek, compact = false }) {
  return `<header class="journal-appendix-header${compact ? ' is-compact' : ''}">
    <span class="section-num">${escapeHtml(kicker)}</span>
    <h1>${escapeHtml(title)}</h1>
    <p class="hero-dek">${escapeHtml(dek)}</p>
  </header>`;
}

// compactHeader：只有待辦頁使用（UX 1017 M5），刊頭縮小讓第一筆待辦進入第一屏；其他頁輸出不變。
function renderPracticalLayout(title, eyebrow, intro, content, file, { compactHeader = false } = {}) {
  const bodyHtml = `
${renderAppendixHeader({ kicker: eyebrow, title, dek: intro, compact: compactHeader })}
    ${content.trim()}`;
  return renderLayout({
    title,
    activeNav: 'practical',
    bodyHtml: bodyHtml.trim(),
    pathPrefix: '../',
    pageKind: 'practical',
    currentPage: file,
  });
}

/** 2026-10-20 UX F6：純文字欄位拆成「旅客要做的事」與收進「資料說明」的查核句。 */
function verified(value) {
  const { main, notes } = splitVerification(value);
  return { html: escapeHtml(main), notes: notes.map(escapeHtml) };
}

// 2026-10-20 UX F10：航班跟火車同一種兩行精簡卡（第一行 日期 時刻→時刻 航班；第二行 路段＋狀態），轉機只佔一行。
function renderFlightTable(legs) {
  return `<ol class="rail-cards flight-cards">${legs.map(leg => leg.layover
    ? `<li class="flight-layover">${escapeHtml(leg.code)} 轉機 · ${escapeHtml(leg.when)}</li>`
    : `<li class="rail-card">
        <p class="rail-card-time"><b class="number">${escapeHtml(leg.when).replace(' → ', '&nbsp;→&nbsp;')}</b><span class="rail-card-code">${escapeHtml(leg.code)}</span></p>
        <p class="rail-card-route"><span>${escapeHtml(leg.leg)}${leg.dur ? ` · ${escapeHtml(leg.dur)}` : ''}</span><span class="${statusTagClass(leg.status || '待確認')}">${escapeHtml(leg.status || '待確認')}</span></p>
      </li>`).join('')}</ol>`;
}

/**
 * 實用資訊頁開頭的資料聲明（UX 審查第 9 項）：原本是一整段框，手機第一個螢幕
 * 被它和刊頭佔滿。改成一行可收合的小字，內容一字不少，點開才看。
 */
function renderDisclaimer(title, bodyHtml) {
  return `<details class="callout-note practical-disclaimer"><summary>${title}</summary><p>${bodyHtml}</p></details>`;
}

/** 在待辦頁本身時不輸出連回待辦頁的連結（原本按了沒反應）。 */
function renderBookingNotice({ onTodosPage = false } = {}) {
  const where = onTodosPage ? '' : '；逐項狀態見<a href="../practical/todos.html">待辦事項</a>';
  return renderDisclaimer('訂票狀態不是即時庫存', `「可查／購」只表示可前往售票頁查詢，不代表有票或已訂妥。付款前請核對指定日期、場次與價格${where}。`);
}

/**
 * 訂票頁頂端的「還沒處理 N 項」精簡卡。
 *
 * 原本這頁前三章（倒數表、訂票優先順序、什麼時候處理）都是待辦頁的重述，
 * 約 12,900 px，而且把「已完成」與「資料重查日」混進倒數，出現「逾期 19 天」這類假警報。
 * 現在狀態只有待辦頁一個正本：這裡的數字由 todoGroups 即時算出，細項請去待辦頁。
 * id="countdown" 保留，今日卡與舊連結仍可跳到這張卡。
 */
export function renderBookingStatusCard(todoGroups, deadlines = [], today = taipeiToday()) {
  const stats = todoStats(todoGroups);
  // 還沒完成、又不屬於待辦頁的期限（複查、證件）：待辦頁不會出現，只能在這裡列出，否則旅客看不到。
  // 有 todoRef 的期限狀態由待辦正本管理，不重複列。
  const standalone = deadlines
    .filter(item => !item.todoRef && isOpenTodoStatus(item.status))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  const standaloneHtml = standalone.length ? `
        <div class="booking-status-extra" data-booking-extra>
          <h3>待辦頁以外還要做</h3>
          <ul>${standalone.map(item => `<li data-deadline-id="${escapeHtml(item.id)}" data-recheck-at="${escapeHtml(item.date)}" data-recheck-open="true"><b class="number">${escapeHtml(item.date.slice(5).replace('-', '/'))}</b>　${escapeHtml(item.title)}<span class="tag-red todo-recheck-flag" data-recheck-flag${item.date < today ? '' : ' hidden'}>已逾期</span></li>`).join('')}</ul>
          <script>
            (function() {
              ${[todayIn, taipeiToday, markOverdueRechecks].map(fn => fn.toString()).join('\n')}
              const root = document.currentScript.closest('.standalone-page') || document;
              markOverdueRechecks(root.querySelector('[data-booking-extra]') || root, taipeiToday);
            }());
          </script>
        </div>` : '';
  // 還沒買／還沒訂的逐項列出（依日期），點了直接跳到待辦頁那一筆；已完成的不再列。
  const openItems = todoGroups.flatMap(group => group.items.filter(isTodoOpen).map(item => ({ item, group })))
    .sort((a, b) => todoSortKey(a.item) - todoSortKey(b.item));
  const rows = openItems.map(({ item, group }) => `<li><a href="todos.html#${todoItemId(group, item)}"><span><b class="number">${escapeHtml(item.date)}</b>　${escapeHtml(item.name)}</span><b class="${statusTagClass(item.status)}">${escapeHtml(item.status)}</b></a></li>`).join('');
  return `
    <section class="section booking-status" id="countdown" data-todo-open="${stats.open}" data-todo-total="${stats.total}">
      <div class="booking-status-card">
        <span class="eyebrow">待辦總覽</span>
        <h2>${stats.open ? `還沒處理 <b class="number" data-booking-open>${stats.open}</b> 項` : '待辦已全部處理完畢'}</h2>
        <p>火車、Auschwitz 去回程巴士與鹽礦已購票；航班延後後當地住宿為 6 晚，10/24 這晚因航班改期不入住，已通知飯店；退款結果未確認。</p>
        <ul class="booking-status-groups">${rows}</ul>${standaloneHtml}
        <p class="action-links"><a class="booking-status-cta" href="todos.html">看待辦事項 →</a></p>
      </div>
    </section>`;
}

export function renderBooking({ flights, trains, stay, todoGroups = [], deadlines = [], railOfficialLinks = [], railPurchaseSteps = [], auschwitzBus = null }) {
  const statusCardHtml = renderBookingStatusCard(todoGroups, deadlines);
  const railTrains = trains.filter(train => !String(train.id).startsWith('bus-'));
  const bookedTrains = railTrains.filter(train => train.status === '已購票').length;
  // 2026-10-20 UX F10：每段車程原本是 7 欄表格，手機一段約 600px。改成兩行精簡卡：
  // 第一行「日期 發車 → 抵達 車次」，第二行「路段＋狀態徽章」；車程、票價、附註與資料說明收進「附註」。
  const statusBadges = status => String(status || '').split('／').filter(Boolean)
    .map(part => `<span class="${statusTagClass(part)}">${escapeHtml(part)}</span>`).join('');
  const trainCards = trains.map(train => {
    const leg = splitVerification(train.leg), note = splitVerification(train.note);
    const price = /未提供/.test(train.price) ? '' : /^\d/.test(train.price) && !/PLN|zł/.test(train.price) ? `PLN ${train.price}` : train.price;
    const sale = String(train.status).split('／').every(part => /已購票$/.test(part.trim())) ? '' : train.saleOpens ? `${escapeHtml(train.saleOpens)} 起預售` : '現場購票';
    const extra = [
      train.dur ? `<p><b>車程：</b>${train.dur}</p>` : '',
      leg.main ? `<p>${leg.main}</p>` : '',
      sale ? `<p><b>預售：</b>${sale}</p>` : '',
      price ? `<p><b>票價：</b>${price}</p>` : '',
      note.main ? `<p>${note.main}</p>` : '',
      renderDataNote([...leg.notes, ...(price ? [] : [escapeHtml(train.price)]), ...note.notes]),
    ].join('');
    const time = train.id === 'bus-lajkonik' && auschwitzBus
      ? `去程 ${auschwitzBus.outbound.booked.dep}（${auschwitzBus.outbound.booked.bay.split('（')[0]}）→ ${auschwitzBus.outbound.booked.arr}／回程 ${auschwitzBus.inbound.booked.dep} → ${auschwitzBus.inbound.booked.arr}`
      : `${train.dep} → ${train.arr}`;
    const link = dayLink(train.date);
    return `
      <li class="rail-card" id="rail-${escapeHtml(train.id)}">
        <p class="rail-card-time"><b class="number">${train.date}</b><b class="number">${time}</b><span class="rail-card-code">${train.type}</span></p>
        <p class="rail-card-route"><span>${train.seg}</span>${statusBadges(train.status)}</p>
        <div class="rail-card-foot">${link}<details class="rail-card-more"><summary>附註</summary>${extra}</details></div>
      </li>`;
  }).join('');
  const stayHtml = stay.map(item => {
    const coordinate = item.coordinates;
    const mapUrl = coordinate
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${coordinate.lat},${coordinate.lng}`)}`
      : null;
    return `
    <article class="card">
      <span class="eyebrow">${escapeHtml(item.city)}</span><h3>${escapeHtml(item.name)} <span class="${statusTagClass(item.status)}">${escapeHtml(item.status)}</span></h3>
      <p><b>${escapeHtml(item.checkIn)}${item.checkInTime ? ` ${escapeHtml(item.checkInTime)}` : ''} → ${escapeHtml(item.checkOut)}${item.checkOutTime ? ` ${escapeHtml(item.checkOutTime)}` : ''}</b> · ${item.nights} 晚 · ${item.rooms} 間房</p>
      <p><b>地址：</b>${escapeHtml(item.address)}${item.addressVerified ? '' : ' <span class="tag-yellow">門牌待確認</span>'}</p>
      <p><b>電話：</b>${item.phone ? `<a href="tel:${escapeHtml(item.phone.replace(/[^\d+]/g, ''))}">${escapeHtml(item.phone)}</a>` : '請看訂房確認信'}</p>
      ${(() => { const note = verified(item.note); return `${note.html ? `<p class="timeline-note">${note.html}</p>` : ''}${renderDataNote(note.notes)}`; })()}
      <p class="action-links">${mapUrl ? `<a href="${mapUrl}" target="_blank" rel="noopener noreferrer">地圖導航 →</a>` : ''}<a href="${escapeHtml(item.officialUrl)}" target="_blank" rel="noopener noreferrer">飯店官網 →</a></p>
    </article>`;
  }).join('');


  const bus = auschwitzBus ? {
    site: verified(auschwitzBus.siteNote),
    fare: verified(auschwitzBus.fare),
    arriveBy: verified(auschwitzBus.tour?.arriveBy),
    entryRule: verified(auschwitzBus.tour?.entryRule),
    outbound: verified(auschwitzBus.outbound.note),
    inbound: verified(auschwitzBus.inbound.note),
    // 「已於官方售票頁查得／尚未購票」這類狀態只顯示旅客要知道的那一段。
    status: value => String(value).split('／').filter(part => !VERIFICATION_PATTERN.test(part)).join('／') || String(value),
    statusNote: value => String(value).split('／').filter(part => VERIFICATION_PATTERN.test(part)).map(escapeHtml),
  } : null;
  const busHtml = auschwitzBus ? `
    <section class="section" id="auschwitz-bus">
      <div class="section-heading"><span class="section-num">Bus</span><h2>Auschwitz 往返巴士（${escapeHtml(auschwitzBus.operator)}）</h2></div>
      <div class="callout-note">
        <b>售票站：</b>
        <p><a href="${escapeHtml(auschwitzBus.site)}" target="_blank" rel="noopener noreferrer">lajkonikbus.pl</a></p>
        <details class="rail-card-more"><summary>網站怎麼操作</summary><p>${bus.site.html}</p>${renderDataNote(bus.site.notes)}</details>
      </div>
      ${auschwitzBus.tour ? `
      <div class="callout-note">
        <b>這一天的錨點 · 已訂妥的參觀場次：</b>
        <p><b>${escapeHtml(auschwitzBus.tour.date)} ${escapeHtml(auschwitzBus.tour.time)}</b>　${escapeHtml(auschwitzBus.tour.name)}<br>
        ${escapeHtml(auschwitzBus.tour.scope)}　·　${escapeHtml(auschwitzBus.tour.language)}　·　${escapeHtml(String(auschwitzBus.tour.duration).replace(/^官方標示\s*/, ''))}　·　${escapeHtml(auschwitzBus.tour.people)}<br>
        <b>最晚抵達：</b>${bus.arriveBy.html}　<b>預計結束：</b>${escapeHtml(auschwitzBus.tour.endsAt)}</p>
        <p><b>入場規定：</b>${bus.entryRule.html}</p>
        <p class="action-links"><a href="${escapeHtml(auschwitzBus.tour.officialUrl)}" target="_blank" rel="noopener noreferrer">Auschwitz 訂票系統 →</a></p>
        ${renderDataNote([/^官方標示/.test(auschwitzBus.tour.duration) ? `導覽時長：${escapeHtml(auschwitzBus.tour.duration)}` : '', ...bus.arriveBy.notes, bus.entryRule.notes.length ? `入場規定原文：${escapeHtml(auschwitzBus.tour.entryRule)}` : ''])}
      </div>` : ''}
      <div class="grid-wide">
        <article class="card"><span class="eyebrow">上下車點</span>
          <p><b>克拉科夫：</b>${escapeHtml(auschwitzBus.stops.krakow)}</p>
          <p><b>奧斯威辛：</b>${escapeHtml(auschwitzBus.stops.oswiecim)}</p>
          <p class="timeline-note"><b>票價：</b>${bus.fare.html}</p>${renderDataNote(bus.fare.notes)}
        </article>
      </div>

      <details class="bus-leg"><summary><h3>去程 · <span class="${statusTagClass(bus.status(auschwitzBus.outbound.status))}">${escapeHtml(bus.status(auschwitzBus.outbound.status))}</span></h3><span class="bus-leg-hint">班次表</span></summary>
      <div class="table-wrap"><table class="table-editorial">
        <thead><tr><th>發車</th><th>抵達</th><th>車程</th><th>站位</th><th>票價</th><th>採用</th></tr></thead>
        <tbody>${auschwitzBus.outbound.services.map(item => `
          <tr>
            <td class="number"><b>${escapeHtml(item.dep)}</b></td>
            <td class="number">${escapeHtml(item.arr)}</td>
            <td class="number">${escapeHtml(item.dur)}</td>
            <td class="number">${escapeHtml(item.bay)}</td>
            <td class="number">${escapeHtml(item.fare)}</td>
            <td><span class="${item.decision === '採用' ? 'tag-yellow' : 'tag-muted'}">${escapeHtml(item.decision)}</span></td>
          </tr>`).join('')}</tbody>
      </table></div>
      ${bus.outbound.html ? `<p class="timeline-note">${bus.outbound.html}</p>` : ''}${renderDataNote([...bus.statusNote(auschwitzBus.outbound.status), ...bus.outbound.notes])}</details>

      <details class="bus-leg"><summary><h3>回程 · <span class="${statusTagClass(bus.status(auschwitzBus.inbound.status))}">${escapeHtml(bus.status(auschwitzBus.inbound.status))}</span></h3><span class="bus-leg-hint">班次表</span></summary>
      <div class="table-wrap"><table class="table-editorial">
        <thead><tr><th>發車</th><th>抵達</th><th>車程</th><th>票價</th><th>採用</th></tr></thead>
        <tbody>${auschwitzBus.inbound.services.map(item => `
          <tr>
            <td class="number"><b>${escapeHtml(item.dep)}</b></td>
            <td class="number">${escapeHtml(item.arr)}</td>
            <td class="number">${escapeHtml(item.dur)}</td>
            <td class="number">${escapeHtml(item.fare)}</td>
            <td><span class="${item.decision === '採用' ? 'tag-yellow' : 'tag-muted'}">${escapeHtml(item.decision)}</span></td>
          </tr>`).join('')}</tbody>
      </table></div>
      ${bus.inbound.html ? `<p class="timeline-note">${bus.inbound.html}</p>` : ''}${renderDataNote([...bus.statusNote(auschwitzBus.inbound.status), ...bus.inbound.notes])}</details>
      <p class="timeline-note"><b>退票規則：</b>去程：${escapeHtml(auschwitzBus.outbound.booked.refundRules)}<br>回程：${escapeHtml(auschwitzBus.inbound.booked.refundRules)}</p>
      <p class="action-links"><a href="${escapeHtml(auschwitzBus.site)}" target="_blank" rel="noopener noreferrer">到 lajkonikbus.pl 買票 →</a><a href="https://moj-bus.pl/en" target="_blank" rel="noopener noreferrer">Moj Bus 線上買票 →</a></p>
    </section>` : '';

  const content = `
    ${statusCardHtml}
    <section class="section" id="rail-itinerary">
      <div class="section-heading"><span class="section-num">Rail</span><h2>城際交通</h2></div>
      <div class="callout-note"><b>已購 ${bookedTrains}／${railTrains.length} 段城際火車。</b><p>逐段購票狀態看<a href="todos.html#todo-rail">待辦事項</a>。10/25 EIP 1306、10/27 IC 3830、10/28 IC 260、10/29 EIC 8104 都已在 PKP App 票券清單；艙等、車廂與座位看票券詳細頁，並保存離線票券。</p></div>
      <ol class="rail-cards">${trainCards}</ol>
    </section>
    ${busHtml}
    <section class="section">
      <div class="section-heading"><span class="section-num">Flights</span><h2>航班</h2></div>
      <h3>去程</h3>${renderFlightTable(flights.out)}
      <h3>回程</h3>${renderFlightTable(flights.back)}
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Stay</span><h2>住宿</h2></div>
      <div class="grid-wide">${stayHtml}</div>
    </section>`;

  return renderPracticalLayout('訂票與交通', 'Booking plan', '火車、Auschwitz 巴士、航班與住宿一頁看完。', content.replaceAll('退票規則見『訂票與交通』頁', '見下方退票規則'), 'practical/booking.html');
}

// 待辦日期寫成「10/25」；轉成可排序的數字，沒有日期的排最後。
function todoSortKey(item) {
  const match = String(item.date || '').match(/(\d{1,2})\/(\d{1,2})/);
  return match ? Number(match[1]) * 100 + Number(match[2]) : 9999;
}

/**
 * 待辦連結的按鈕文字要說實話：連到 Google 地圖就叫「地圖」，連到評論或米其林頁就叫「店家頁」，
 * 只有網址真的是訂位入口（官方訂位頁或 TheFork／MojStolik／zjedz 等訂位平台）才叫「訂位」。
 * 火車與景點的連結是購票入口，叫「購票頁」。
 */
export function todoLinkLabel(item, group) {
  const url = String(item.url || '');
  if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(url)) return '地圖';
  if (group.id === 'prep' || item.name.includes('Carla')) return '官網';
  if (group.id !== 'dining') return '購票頁';
  if (/rezerwac|reserv|booking|mojstolik|thefork|zjedz/i.test(url)) return '訂位';
  return '店家頁';
}

function renderTodoItem(item, group) {
  const open = !item.skip && isOpenTodoStatus(item.status);
  const checked = toComparableDate(item.checkedAt);
  const recheck = toComparableDate(item.recheckAt);
  // 每筆有固定錨點，每日頁與今日卡的預約列直接連到這裡；反向再連回行程日。
  const day = dayPageForDate(item.date, '../');
  return `<li class="todo-item${open ? '' : ' is-done'}" id="${todoItemId(group, item)}">
        <div class="todo-head"><span class="todo-date">${item.date}</span><b class="todo-name">${item.name}</b><span class="${open ? statusTagClass(item.status) : item.skip ? 'tag-muted' : statusTagClass(item.status)}">${item.status}</span></div>
        <p class="todo-action">${linkifyText(item.action)}${item.url ? ` <a class="todo-link" href="${item.url}" target="_blank" rel="noopener">${todoLinkLabel(item, group)} →</a>` : ''}</p>
      </li>`;
}

export function renderTodos({ todoGroups }) {
  const allItems = todoGroups.flatMap(group => group.items);
  const total = allItems.filter(item => !item.skip && isOpenTodoStatus(item.status)).length;
  // UX 審查第 5 項：每類先列未完成（依日期），已完成的收進「已完成 N 項」；
  // 每項改成「日期＋事項＋狀態」一行標題、下一步一段文字、查核日期一行小字。
  const groupsHtml = todoGroups.map(group => {
    const byDate = [...group.items].sort((a, b) => todoSortKey(a) - todoSortKey(b));
    // skip：線上訂不到、旅客要求不再提醒，但仍排在行程裡——不算待辦也不算完成。
    const openItems = byDate.filter(item => !item.skip && isOpenTodoStatus(item.status));
    const skippedItems = byDate.filter(item => item.skip);
    const doneItems = byDate.filter(item => !item.skip && !isOpenTodoStatus(item.status));
    return `<section class="section" id="todo-${group.id}">
      <div class="section-heading"><span class="section-num">${group.eyebrow}</span><h2>${group.title}</h2></div>
      <p class="lead">${group.intro}</p>
      ${openItems.length ? `<ul class="todo-list" data-todo-open>${openItems.map(item => renderTodoItem(item, group)).join('')}</ul>` : '<p class="source-meta">這一類已全部完成。</p>'}
      ${skippedItems.length ? `<details class="todo-done todo-skipped"><summary>線上售完／不排入，不需處理 ${skippedItems.length} 項</summary><ul class="todo-list" data-todo-skipped>${skippedItems.map(item => renderTodoItem(item, group)).join('')}</ul></details>` : ''}
      ${doneItems.length ? `<details class="todo-done"><summary>已完成 ${doneItems.length} 項</summary><ul class="todo-list" data-todo-done>${doneItems.map(item => renderTodoItem(item, group)).join('')}</ul></details>` : ''}
    </section>`;
  }).join('');

  // UX 1017 M5：「N 項待辦」摘要縮成一列緊接第一個分類；「訂票狀態由人工維護」說明與購票入口連結移到清單最後，
  // 打開待辦頁第一屏就是待辦本身。文字一字不少。
  const content = `
    <div class="callout-risk todo-summary"><span class="tag-todo">${total} 項待辦</span><p>共 ${allItems.length} 項；每類先列未完成，已完成的收在「已完成」裡供核對。完成後請將票券與訂位資訊離線保存。</p>${renderDataNote(['未開賣項目仍以官方系統實際可售狀態為準。'])}</div>
    ${groupsHtml}
    ${renderBookingNotice({ onTodosPage: true })}
    <script>
      (function() {
        ${[todayIn, taipeiToday, markOverdueRechecks].map(fn => fn.toString()).join('\n')}
        const root = document.currentScript.closest('.standalone-page') || document;
        markOverdueRechecks(root, taipeiToday);
      }());
    </script>`.trim();

  return renderPracticalLayout('待辦事項', 'Action list', '城際交通、景點與餐飲訂位集中在一頁。先處理有日期與指定場次的票，再處理彈性訂位。', content, 'practical/todos.html', { compactHeader: true });
}

export function renderDining({ michelinSummary, michelinReservations, verifiedRestaurantHours = [], cafeGuide = [], fastFoodChains = [], fastFoodBranches = {}, fastFoodHubs = [] }) {
  const summaryRows = michelinSummary.map(item => `
    <tr>
      <td><b>${item.city}</b></td><td class="number">${item.stars}</td>
      <td>${[...item.star2List, ...item.star1List].join(' · ') || '—'}</td>
      <td>${item.bibList.join(' · ') || '—'}</td>
    </tr>`).join('');
  const reservationRows = michelinReservations.map(item => `
    <tr><td>${item.mapUrl ? `<a href="${item.mapUrl}" target="_blank" rel="noopener"><b>${item.restaurant}</b></a>` : `<b>${item.restaurant}</b>`}</td><td class="number">${item.perPerson}</td><td>${item.channel}${item.mapUrl ? `<br><a href="${item.mapUrl}" target="_blank" rel="noopener">Google Maps 定位 →</a>` : ''}${cityLink(item.restaurant, '#city-dining') ? `<br>${cityLink(item.restaurant, '#city-dining')}` : ''}</td></tr>`).join('');
  // 營業時間（UX 審查第 4 項）：原本 4 欄表格在手機一家一張長卡、約 20,000px。
  // 改為依城市分組，每家只露「店名＋導航＋營業時間＋行程安排＋特色一行」，
  // 地址、查核狀態與日期、來源、菜單說明全部收進「查核紀錄」，資料一筆不少。
  const hoursCities = [...new Set(verifiedRestaurantHours.map(item => item.city))];
  const hoursHtml = hoursCities.map(city => {
    const items = verifiedRestaurantHours.filter(item => item.city === city);
    const list = items.map(item => {
      const day = days.find(day => day.n === item.dayN);
      const step = day?.steps.find(step => step.id === item.stepId);
      const plan = day ? `<a href="../day-${String(day.n).padStart(2, '0')}.html#day-food">Day ${day.n}</a> · ${escapeHtml(item.role)}${step ? ` · ${escapeHtml(step.t)}` : ''}` : escapeHtml(item.role);
      // 店家卡：店名連店家公告、右上角導航；營業時間與推薦菜色直接可見，地址與查核紀錄收合。
      return `<li class="day-food-item hours-item">
        <div class="day-food-head"><div class="day-food-title"><span class="eyebrow">${plan}</span><h4><a href="${item.url}" target="_blank" rel="noopener">${item.name}</a></h4>${renderStoreBadges(item)}</div>
        ${item.mapUrl ? `<a class="day-food-map" href="${item.mapUrl}" target="_blank" rel="noopener" aria-label="在新視窗開啟 ${escapeHtml(item.name)} 的 Google Maps 導航">導航 ↗</a>` : ''}</div>
        ${renderStoreBody(item, { note: item.highlight, condition: '' })}
      </li>`;
    }).join('');
    // 59 家全展開手機要捲 27,000px；改成依城市收合，摘要列出城市與家數，點開才看店家卡。
    return `<details class="card hours-city-group"><summary><h3>${escapeHtml(city)}（${items.length} 家）</h3><span class="hours-city-hint">營業時間、推薦菜色與導航</span></summary><ul class="day-food-list">${list}</ul></details>`;
  }).join('');
  // 咖啡與甜點：依城市收合，卡片小標寫順路時段；已排入行程的標「已排入」，其餘是順路候選。
  const cafeTotal = cafeGuide.reduce((sum, group) => sum + group.items.length, 0);
  const cafeHtml = cafeGuide.map(group => `<details class="card hours-city-group" id="cafes-${escapeHtml(group.cityKey)}"><summary><h3>${escapeHtml(group.city)}（${group.items.length} 家）</h3><span class="hours-city-hint">順路時段、營業時間與導航</span></summary><ul class="day-food-list">${group.items.map(item => `<li class="day-food-item cafe-item">${renderStoreHead(item, `${item.type} · ${item.when}`)}${renderStoreBody(item, { note: item.highlight, condition: '' })}</li>`).join('')}</ul></details>`).join('');
  const content = `
    <section class="section" id="daily-meals">
      <div class="section-heading"><span class="section-num">Daily meals</span><h2>八天三餐與備選</h2></div>
      <p class="lead">每日行程與今日卡共用這份安排。時刻為波蘭當地時間，候選不代表已訂位；每餐擇一，依交通與接單情況改備案。</p>
      <nav class="day-jump" aria-label="跳到某一天的三餐">${days.map(day => `<a href="#meals-day-${day.n}" data-meal-date="${dayIsoDate(day.date, meta.tripStart)}"><b>Day ${day.n}</b><span>${escapeHtml(day.date.replace(/\s*\(.*\)/, ''))}</span></a>`).join('')}</nav>
      ${days.map(day => `<details class="card meals-day hash-fold" id="meals-day-${day.n}" data-meal-date="${dayIsoDate(day.date, meta.tripStart)}"${day.n === 1 ? ' open' : ''}><summary><h3>Day ${day.n} · ${escapeHtml(day.date)} · ${escapeHtml(day.city)}</h3></summary>${renderMealList(day, dayMeals[day.n])}
        <details><summary>保留的備選、備餐與點心 · ${dayDining[day.n].filter(item => !item.meal).length} 家</summary><ul class="day-food-list">${dayDining[day.n].filter(item => !item.meal).map(item => `<li class="day-food-item">${renderStoreHead(item, item.role)}${renderStoreBody(item, { condition: '', timing: mealTiming(item, day) })}</li>`).join('')}</ul></details>
        <p><a href="../day-${String(day.n).padStart(2,'0')}.html#day-food">當日完整動線與餐廳導航 →</a></p>
        <p class="meals-back"><a href="#daily-meals">↑ 換一天</a></p></details>`).join('')}
      <script>
        // UX 1017 M6：旅途期間把日期列上的「今天」標出來（華沙當地日期）；不用 id 選取器，單檔版才不會失效。
        (function () {
          ${todayIn.toString()}
          var root = document.currentScript.closest('.standalone-page') || document;
          var today = todayIn('Europe/Warsaw', new Date());
          var link = root.querySelector('.day-jump [data-meal-date="' + today + '"]');
          if (link) link.setAttribute('aria-current', 'date');
          // 旅途中只展開今天那一天的三餐，其餘收合；出發前預設展開 Day 1。
          var card = root.querySelector('details.meals-day[data-meal-date="' + today + '"]');
          if (card) root.querySelectorAll('details.meals-day').forEach(function (item) { item.open = item === card; });
        }());
      </script>
    </section>
    <section class="section" id="cafes">
      <div class="section-heading"><span class="section-num">Coffee &amp; sweets</span><h2>咖啡與甜點</h2></div>
      <p class="lead">四城 ${cafeTotal} 家咖啡、熱巧克力與甜點店，依行程先後排，小標寫適合排在哪一天哪一段；標「已排入」的就在每日時間表裡，其餘是順路候選。</p>
      <div class="hours-city-list">${cafeHtml}</div>
    </section>
    <section class="section" id="restaurant-hours">
      <div class="section-heading"><span class="section-num">Hours</span><h2>行程餐廳營業時間</h2></div>
      <p class="lead">依城市分組，點城市展開；店名連到店家公告，「導航」開 Google Maps，Day 連回排定的那一天。地址與菜單收在每家的摺疊區。</p>
      <div class="hours-city-list">${hoursHtml}</div>
    </section>
    ${renderFastFoodMenu({ chains: fastFoodChains, branches: fastFoodBranches, hubs: fastFoodHubs })}`;
  return renderPracticalLayout('餐廳與速食', 'Food guide', '八天三餐、咖啡甜點與備選都在這頁，依日期找就好；趕行程用的連鎖速食在最後。', content, 'practical/dining.html');
}

export function renderTransit({ transitFares, airportTransit, recommendedApps, passChecklist, usefulRoutes, practical = [] }) {
  const fareRows = transitFares.map(item => `<tr><td><a href="${item.officialUrl}" target="_blank" rel="noopener"><b>${item.city}</b></a>${cityLink(item.city) ? `<br>${cityLink(item.city)}` : ''}</td><td>${item.short}</td><td>${item.min90}</td><td>${item.hour24}</td><td>${item.note}</td></tr>`).join('');
  const airportRows = airportTransit.map(item => `<tr><td><b>${item.route}</b></td><td>${item.method}</td><td class="number">${item.price}</td><td class="number">${item.time}</td><td>${item.note}</td></tr>`).join('');
  const appCards = recommendedApps.map(item => `<article class="card"><h3>${item.name}</h3><p>${item.desc}</p></article>`).join('');
  const practicalCards = practical.map(item => `<article class="card"><span class="eyebrow">${item.tag}</span><h3>${item.name}</h3><p>${item.note}</p></article>`).join('');
  const content = `
    <section>
      <div class="section-heading"><span class="section-num">Fares</span><h2>四城市內票價</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>城市</th><th>短程</th><th>90 分</th><th>24 小時</th><th>備註</th></tr></thead><tbody>${fareRows}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Airport</span><h2>機場到市區</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>路線</th><th>方式</th><th>票價</th><th>時間</th><th>備註</th></tr></thead><tbody>${airportRows}</tbody></table></div>
    </section>
    <section class="section"><div class="section-heading"><span class="section-num">Apps</span><h2>推薦工具</h2></div><div class="grid-wide">${appCards}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Passes</span><h2>票券怎麼選</h2></div><ul class="check-list">${passChecklist.map(item => `<li>${item}</li>`).join('')}</ul></section>
    <section class="section"><div class="section-heading"><span class="section-num">Tips</span><h2>實用路線與搭車技巧</h2></div><ul class="check-list">${usefulRoutes.map(item => `<li>${item}</li>`).join('')}</ul></section>
    ${practical.length ? `<section class="section"><div class="section-heading"><span class="section-num">Ground rules</span><h2>其他實用資訊</h2></div><div class="grid">${practicalCards}</div></section>` : ''}`;
  return renderPracticalLayout('市內交通', 'City transit', '四城大多可步行；需要搭車時，先查短程票與 Jakdojade，通常不必買多日券。', content, 'practical/transit.html');
}

export function renderShopping({ souvenirCards, luxuryShopping, souvenirShops = [], shopping = [], zabkaCards }) {
  const souvenirHtml = souvenirCards.map(item => `<article class="card"><h3>${item.title}</h3><p>${item.desc}</p></article>`).join('');
  const shopRows = souvenirShops.map(item => `<tr><td>${item.city}</td><td><a href="${item.mapUrl}" target="_blank" rel="noopener"><b>${item.name}</b></a></td><td>${item.note}</td></tr>`).join('');
  const luxuryRows = luxuryShopping.map(item => `<tr><td><a href="${item.mapUrl}" target="_blank" rel="noopener"><b>${item.shop}</b></a></td><td>${item.city}</td><td>${item.note}</td></tr>`).join('');
  const legacyCards = shopping.map(item => `<article class="card"><span class="eyebrow">${item.tag}</span><h3>${item.name}</h3><p>${item.note}</p></article>`).join('');
  const zabkaHtml = zabkaCards.map(item => `<article class="card"><h3>${item.title}</h3><p>${item.desc}</p></article>`).join('');
  const content = `
    <section><div class="section-heading"><span class="section-num">Souvenirs</span><h2>14 種伴手禮</h2></div><div class="grid">${souvenirHtml}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Where to buy</span><h2>實際店家</h2></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>城市</th><th>店家</th><th>備註</th></tr></thead><tbody>${shopRows}</tbody></table></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Quick list</span><h2>傳統伴手禮備忘</h2></div><div class="grid">${legacyCards}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Luxury</span><h2>精品購物</h2></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>店家</th><th>城市</th><th>備註</th></tr></thead><tbody>${luxuryRows}</tbody></table></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Żabka</span><h2>超商怎麼逛</h2></div><p class="action-links"><a href="groceries.html">四城超市與便利商店・採買推薦 →</a></p><div class="grid">${zabkaHtml}</div></section>`;
  return renderPracticalLayout('伴手禮與購物', 'Shopping', '先決定要買什麼，再直接打開店家地圖；肉製品入境台灣限制也已標出。', content, 'practical/shopping.html');
}

export function renderEssentials({ phrases, packingDefault, about, safety, sources = [] }) {
  const phraseRows = phrases.map(item => `<tr><td>${item[0]}</td><td><b>${item[1]}</b></td><td>${item[2] || '—'}</td></tr>`).join('');
  const aboutCards = about.map(item => `<article class="card"><span class="eyebrow">${item[0]}</span><p>${item[1]}</p></article>`).join('');
  const packingHtml = Object.entries(packingDefault).map(([category, items]) => `<article class="card"><h3>${category}</h3><ul class="check-list">${items.map(item => `<li>${item}</li>`).join('')}</ul></article>`).join('');
  const emergencyRows = safety.emergency.map(item => `<tr><td>${item[0]}</td><td class="number"><b><a href="tel:${item[1].replace(/\s+/g, '')}">${escapeHtml(item[1])}</a></b></td></tr>`).join('');
  const embassyRows = safety.embassy.map(item => `<tr><td>${item[0]}</td><td><b>${item[1]}</b></td></tr>`).join('');
  const safetyCards = safety.tips.map(item => `<article class="card"><h3>${item.label}</h3><p>${item.text}</p></article>`).join('');
  const sourceRows = sources.map(item => `<tr><td><a href="${item.url}" target="_blank" rel="noopener"><b>${item.name}</b></a></td><td>${item.note}</td></tr>`).join('');
  const content = `
    ${renderSosSection()}
    <section class="section"><div class="section-heading"><span class="section-num">Basics</span><h2>基本須知</h2></div><div class="grid">${aboutCards}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Language</span><h2>常用波蘭語</h2></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>中文</th><th>波蘭語</th><th>音譯</th></tr></thead><tbody>${phraseRows}</tbody></table></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Packing</span><h2>打包清單</h2></div><div class="grid-wide">${packingHtml}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Phone</span><h2>其他緊急電話</h2></div><div class="grid-wide"><div class="table-wrap"><table class="table-editorial"><thead><tr><th>單位</th><th>電話</th></tr></thead><tbody>${emergencyRows}</tbody></table></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>駐波蘭代表處</th><th>資訊</th></tr></thead><tbody>${embassyRows}</tbody></table></div></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Safety</span><h2>安全與禮儀</h2></div><div class="grid-wide">${safetyCards}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Sources</span><h2>官方來源</h2></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>項目</th><th>重點</th></tr></thead><tbody>${sourceRows}</tbody></table></div></section>`;
  return renderPracticalLayout('安全與基本須知', 'Essentials', '緊急電話、我的保險與訂位資料、常用波蘭語與打包清單。', content + renderPrivateRuntime(), 'practical/essentials.html');
}

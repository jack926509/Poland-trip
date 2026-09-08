import { renderLayout } from './layout.mjs';
import { getTaipeiToday, toComparableDate, isOpenTodoStatus, isOpenEntryStatus, calculateDashboard, dashboardCsv, initializeDashboard } from '../scripts/dashboard.js';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function serializeForInlineScript(value) {
  return JSON.stringify(value)
    .replaceAll('<', '\\u003c')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}

function renderAppendixHeader({ kicker, title, dek }) {
  return `<header class="journal-appendix-header">
    <span class="section-num">${escapeHtml(kicker)}</span>
    <h1>${escapeHtml(title)}</h1>
    <p class="hero-dek">${escapeHtml(dek)}</p>
  </header>`;
}

function renderPracticalLayout(title, eyebrow, intro, content, file) {
  const bodyHtml = `
${renderAppendixHeader({ kicker: eyebrow, title, dek: intro })}
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

function renderFlightTable(legs) {
  return `<div class="table-wrap"><table class="table-editorial">
    <thead><tr><th>航班</th><th>路段</th><th>日期／時間</th><th>時長</th><th>狀態</th></tr></thead>
    <tbody>${legs.map(leg => `<tr><td>${leg.code}</td><td>${leg.leg}</td><td>${leg.when}</td><td>${leg.dur || '—'}</td><td>${leg.layover ? '轉機' : `<span class="tag-muted">${leg.status || '待確認'}</span>`}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

function renderBookingNotice() {
  return '<div class="callout-note"><b>訂票狀態由人工維護，未連線查詢即時庫存。</b><p>「可查／購」只表示可前往售票頁查詢，不代表有票或已訂妥。付款前請核對指定日期、場次與價格；各項最近查核日期列於<a href="../practical/todos.html">待辦事項</a>，未記錄日期的狀態請重新確認。</p></div>';
}

export function renderBooking({ flights, trains, stay, bookingTiers, reservations, railOfficialLinks = [], railPurchaseSteps = [] }) {
  const tiersHtml = bookingTiers.map((tier, index) => `
    <article class="card ${index === 0 ? 'card-accent' : ''}">
      <span class="eyebrow">Priority ${index + 1}</span>
      <h3>${tier.tier}</h3>
      <p>${tier.note}</p>
      <ul class="link-list">${tier.items.map(item => `<li><a href="${item.url}" target="_blank" rel="noopener">${item.name} →</a></li>`).join('')}</ul>
    </article>`).join('');

  const reservationRows = reservations.map(item => `<tr><td><b>${item.when}</b></td><td>${item.what}</td></tr>`).join('');
  const trainRows = trains.map(train => `
    <tr>
      <td><b>${train.seg}</b>${train.leg ? `<br><span class="timeline-note">${train.leg}</span>` : ''}${train.status ? `<br><span class="tag-todo">${train.status}</span>` : ''}</td>
      <td class="number">${train.date}</td><td>${train.type}</td>
      <td class="number">${train.dep} → ${train.arr}</td>
      <td class="number">${train.dur}</td>
      <td><b>${train.saleOpens ? `${escapeHtml(train.saleOpens)} 起預售` : '官方日期待確認'}</b>${train.saleCheckedAt ? `<br><span class="timeline-note">PKP Intercity 官方售票系統查核：${escapeHtml(train.saleCheckedAt)}</span>` : ''}</td>
      <td class="number">${/^\d/.test(train.price) ? `PLN ${train.price}` : train.price}${train.note ? `<br><span class="timeline-note">${train.note}</span>` : ''}</td>
    </tr>`).join('');
  const railLinkCards = railOfficialLinks.map(item => `
    <a class="card card-link" href="${item.url}" target="_blank" rel="noopener">
      <h3>${item.name}</h3><p>${item.note}</p><span>開啟官網 →</span>
    </a>`).join('');
  const railStepCards = railPurchaseSteps.map((item, index) => `
    <article class="card">
      <span class="section-num">${String(index + 1).padStart(2, '0')}</span>
      <h3>${item.title}</h3><p>${item.detail}</p>
    </article>`).join('');
  const stayHtml = stay.map(item => {
    const coordinate = item.coordinates;
    const coordinateLabel = coordinate ? `${coordinate.lat.toFixed(6)}, ${coordinate.lng.toFixed(6)}` : '尚未提供';
    const mapUrl = coordinate
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${coordinate.lat},${coordinate.lng}`)}`
      : null;
    return `
    <article class="card">
      <span class="eyebrow">${escapeHtml(item.status)} · ${escapeHtml(item.city)}</span><h3>${escapeHtml(item.name)}</h3>
      <p><b>${escapeHtml(item.checkIn)}${item.checkInTime ? ` ${escapeHtml(item.checkInTime)}` : ''} → ${escapeHtml(item.checkOut)}${item.checkOutTime ? ` ${escapeHtml(item.checkOutTime)}` : ''}</b> · ${item.nights} 晚 · ${item.rooms} 間房</p>
      <p><b>地址：</b>${escapeHtml(item.address)}${item.addressVerified ? '' : ' <span class="tag-todo">門牌待確認</span>'}</p>
      <p><b>座標：</b><span class="number">${coordinateLabel}</span>${coordinate ? `<br><span class="timeline-note">${escapeHtml(coordinate.status)} · ${escapeHtml(coordinate.checkedAt)}</span>` : ''}</p>
      <p class="timeline-note">${escapeHtml(item.note)}</p>
      <p class="action-links">${mapUrl ? `<a href="${mapUrl}" target="_blank" rel="noopener noreferrer">座標導航 →</a>` : ''}<a href="${escapeHtml(item.officialUrl)}" target="_blank" rel="noopener noreferrer">飯店官網 →</a></p>
    </article>`;
  }).join('');

  const content = `
    ${renderBookingNotice()}
    <section>
      <div class="section-heading"><span class="section-num">Do first</span><h2>訂票優先順序</h2></div>
      <div class="grid">${tiersHtml}</div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Timeline</span><h2>什麼時候處理</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>時間</th><th>事項</th></tr></thead><tbody>${reservationRows}</tbody></table></div>
    </section>
    <section class="section" id="rail-itinerary">
      <div class="section-heading"><span class="section-num">Rail</span><h2>城際交通</h2></div>
      <div class="callout-risk"><span class="tag-todo">班次已查核／尚未開賣</span><p>2026-09-08 已逐班核對 PKP Intercity 官方售票系統。下表列的是官方目前顯示的預售起始日；尚未到開賣日，也不代表已訂妥。開賣後仍須再次核對時間、價格、車廂與座位。</p></div>
      <p><b>三班評估：</b>10/27 IC 3600 能提早抵達樂斯拉夫；10/28 Baltic Express 260 候選車程僅 1 小時 19 分，最能保留白天遊玩；10/29 EIC 8104 在正午山羊秀與下午行程後出發，並適合加選一等艙體驗。若 10/25 已搭 EIP 一等艙，可依價差決定 10/29 是否再搭一等艙。</p>
      <p><a href="https://www.intercity.pl/en/site/for-passengers/trains/about-eic.html" target="_blank" rel="noopener">PKP 官方 EIC 服務說明</a>列有一等艙飲品與點心；指定班次的編組、設備、餐飲與票價仍以購票頁為準。</p>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>路段</th><th>日期</th><th>車種</th><th>時刻</th><th>時長</th><th>預售</th><th>票價</th></tr></thead><tbody>${trainRows}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Official</span><h2>官方購票與時刻表</h2></div>
      <p class="lead">Passenger Portal 用來查班次與異動；PKP Intercity 官方售票頁用來確認可售價格、車廂與座位。兩者用途不同，建議都保留。</p>
      <div class="grid">${railLinkCards}</div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">How to</span><h2>網路購票教學</h2></div>
      <div class="grid-wide">${railStepCards}</div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Flights</span><h2>航班</h2></div>
      <h3>去程</h3>${renderFlightTable(flights.out)}
      <h3>回程</h3>${renderFlightTable(flights.back)}
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Stay</span><h2>已確認住宿</h2></div>
      <div class="callout-note"><b>公開資料範圍：</b><p>依旅客授權列出住宿名稱、入住日期、公開地址與地圖座標；不包含住客姓名、訂房代碼、付款資料或房號。Piast 門牌與 Towarowa 實際入住門牌仍以訂房確認為準。</p></div>
      <div class="grid-wide">${stayHtml}</div>
    </section>`;

  return renderPracticalLayout('訂票與交通', 'Booking plan', '先看最急的票，再核對火車、航班與已確認住宿。尚未確認的時段保留原樣，不用猜。', content, 'practical/booking.html');
}

export function renderTodos({ todoGroups }) {
  const total = todoGroups.flatMap(group => group.items).length;
  const groupsHtml = todoGroups.map((group, index) => {
    const rows = group.items.map(item => `<tr>
      <td class="number"><b>${item.date}</b></td>
      <td><b>${item.name}</b><br><span class="tag-todo">${item.status}</span></td>
      <td>${toComparableDate(item.checkedAt) ? `<time datetime="${toComparableDate(item.checkedAt)}">${toComparableDate(item.checkedAt)}</time>` : '未記錄，請重查'}${toComparableDate(item.recheckAt) ? `<br>下次查核：<time datetime="${toComparableDate(item.recheckAt)}">${toComparableDate(item.recheckAt)}</time>` : ''}</td>
      <td>${item.action}${item.url ? `<br><a href="${item.url}" target="_blank" rel="noopener">開啟處理頁 →</a>` : ''}</td>
    </tr>`).join('');
    return `<section class="section" id="todo-${group.id}">
      <div class="section-heading"><span class="section-num">${group.eyebrow}</span><h2>${group.title}</h2></div>
      <p class="lead">${group.intro}</p>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>日期</th><th>事項／狀態</th><th>最近人工查核</th><th>下一步</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>`;
  }).join('');

  const content = `
    ${renderBookingNotice()}
    <div class="callout-risk"><span class="tag-todo">${total} 項待辦</span><p>按「要買什麼」而非逐日行程整理。完成後請將票券與訂位資訊離線保存；未開賣項目仍以官方系統實際可售狀態為準。</p></div>
    ${groupsHtml}`.trim();

  return renderPracticalLayout('待辦事項', 'Action list', '城際交通、景點、餐飲與雨天備案集中在一頁。先處理有日期與指定場次的票，再處理彈性訂位。', content, 'practical/todos.html');
}

export function renderDining({ michelinSummary, michelinReservations, verifiedRestaurantHours = [] }) {
  const summaryRows = michelinSummary.map(item => `
    <tr>
      <td><b>${item.city}</b></td><td class="number">${item.stars}</td>
      <td>${[...item.star2List, ...item.star1List].join(' · ') || '—'}</td>
      <td>${item.bibList.join(' · ') || '—'}</td>
    </tr>`).join('');
  const reservationRows = michelinReservations.map(item => `
    <tr><td><b>${item.restaurant}</b></td><td class="number">${item.perPerson}</td><td>${item.channel}</td></tr>`).join('');
  const hoursRows = verifiedRestaurantHours.map(item => `
    <tr><td>${item.city}</td><td><a href="${item.url}" target="_blank" rel="noopener"><b>${item.name}</b></a><br>${item.address}</td><td>${item.hours}</td><td>${item.feature}</td></tr>`).join('');
  const content = `
    <div class="callout-note"><b>資料界線：</b>米其林名單以 2026-05-29 官方發布為準；Google 星等與評論數會變，本站不把它們當成固定資料。高價餐廳預算已於 2026-09-08 對照旅程試算表更新；營業時間查證於 2026-08-09，訂位前仍看店家公告。</div>
    <section>
      <div class="section-heading"><span class="section-num">Guide</span><h2>2026 米其林總表</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>城市</th><th>星級</th><th>星級餐廳</th><th>Bib Gourmand</th></tr></thead><tbody>${summaryRows}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Hours</span><h2>行程餐廳營業時間</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>城市</th><th>餐廳／地址</th><th>店家公告時間</th><th>特色與限制</th></tr></thead><tbody>${hoursRows}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Reserve</span><h2>訂位與每人預算</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>餐廳</th><th>每人 PLN</th><th>訂位管道／備註</th></tr></thead><tbody>${reservationRows}</tbody></table></div>
    </section>`;
  return renderPracticalLayout('米其林與餐廳', 'Michelin 2026', '已把 2026 米其林名單與本行程實際餐廳分開；營業時間只寫能追到店家來源的分店。', content, 'practical/dining.html');
}

export function renderTickets({ fares, ticketsByCity, notices = [] }) {
  const fareRows = fares.map(item => `
    <tr>
      <td><a href="${item.mapUrl}" target="_blank" rel="noopener"><b>${item.name}</b></a></td>
      <td class="number">${item.fullPrice}</td><td class="number">${item.discountPrice}</td>
      <td>${item.note || '—'}<br><a href="${item.officialUrl}" target="_blank" rel="noopener">官網確認 →</a></td>
    </tr>`).join('');
  const quickCards = ticketsByCity.map(group => `
    <article class="card">
      <h3>${group.city}</h3>
      <ul class="check-list">${group.items.map(item => `<li><b>${item[0]}</b>：${item[1]}</li>`).join('')}</ul>
    </article>`).join('');
  const content = `
    ${notices.map(item => `<div class="callout-risk"><span class="tag-todo">${item.status}</span><p>${item.text} <a href="${item.url}" target="_blank" rel="noopener">開啟官網 →</a></p></div>`).join('')}
    <section>
      <div class="section-heading"><span class="section-num">2026-09</span><h2>最新門票速查</h2></div>
      <p class="lead">全票／優待皆為 PLN。2026/09/08 已再核對高風險條目；動態票價、指定日場次與臨時閉館，購票前仍以官網為準。</p>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>景點</th><th>全票</th><th>優待</th><th>備註</th></tr></thead><tbody>${fareRows}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">By city</span><h2>行程快速清單</h2></div>
      <p class="lead">這組是行程原本的城市分組備忘；若與上表不同，以「最新門票速查」與官網為準。</p>
      <div class="grid-wide">${quickCards}</div>
    </section>`;
  return renderPracticalLayout('門票速查', 'Tickets', '把景點價格、優待、閉館與官方連結放在同一頁，規劃預算時不必來回找。', content, 'practical/tickets.html');
}

export function renderTransit({ transitFares, airportTransit, recommendedApps, passChecklist, usefulRoutes, practical = [] }) {
  const fareRows = transitFares.map(item => `<tr><td><a href="${item.officialUrl}" target="_blank" rel="noopener"><b>${item.city}</b></a><br><small>查核 ${item.checkedAt}</small></td><td>${item.short}</td><td>${item.min90}</td><td>${item.hour24}</td><td>${item.note}</td></tr>`).join('');
  const airportRows = airportTransit.map(item => `<tr><td><b>${item.route}</b></td><td>${item.method}</td><td class="number">${item.price}</td><td class="number">${item.time}</td><td>${item.note}</td></tr>`).join('');
  const appCards = recommendedApps.map(item => `<article class="card"><h3>${item.name}</h3><p>${item.desc}</p></article>`).join('');
  const practicalCards = practical.map(item => `<article class="card"><span class="eyebrow">${item.tag}</span><h3>${item.name}</h3><p>${item.note}</p></article>`).join('');
  const content = `
    <div class="callout-note"><b>2026/09/08 複核：</b>華沙、克拉科夫與波茲南票價已對照各城市官方價目；樂斯拉夫保留現行票價並明確標示出發前重查。班次、改道與售票機規則仍屬動態資料。</div>
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
    <section class="section"><div class="section-heading"><span class="section-num">Żabka</span><h2>超商怎麼逛</h2></div><div class="grid">${zabkaHtml}</div></section>`;
  return renderPracticalLayout('伴手禮與購物', 'Shopping', '先決定要買什麼，再直接打開店家地圖；肉製品入境台灣限制也已標出。', content, 'practical/shopping.html');
}

export function renderEssentials({ phrases, packingDefault, about, safety, sources = [] }) {
  const phraseRows = phrases.map(item => `<tr><td>${item[0]}</td><td><b>${item[1]}</b></td><td>${item[2] || '—'}</td></tr>`).join('');
  const aboutCards = about.map(item => `<article class="card"><span class="eyebrow">${item[0]}</span><p>${item[1]}</p></article>`).join('');
  const packingHtml = Object.entries(packingDefault).map(([category, items]) => `<article class="card"><h3>${category}</h3><ul class="check-list">${items.map(item => `<li>${item}</li>`).join('')}</ul></article>`).join('');
  const emergencyRows = safety.emergency.map(item => `<tr><td>${item[0]}</td><td class="number"><b>${item[1]}</b></td></tr>`).join('');
  const embassyRows = safety.embassy.map(item => `<tr><td>${item[0]}</td><td><b>${item[1]}</b></td></tr>`).join('');
  const safetyCards = safety.tips.map(item => `<article class="card"><h3>${item.label}</h3><p>${item.text}</p></article>`).join('');
  const sourceRows = sources.map(item => `<tr><td><a href="${item.url}" target="_blank" rel="noopener"><b>${item.name}</b></a></td><td>${item.checkedAt}</td><td>${item.note}</td></tr>`).join('');
  const content = `
    <div class="callout-note"><b>2026/09/08 複核：</b>ETIAS 目前仍未啟用；但 EU 官方仍以 2026 年第 4 季為啟用期，本行程 10/24 出發前必須再查一次。緊急電話、免簽條件與 TAX FREE 門檻皆保留官方來源。</div>
    <section><div class="section-heading"><span class="section-num">Basics</span><h2>基本須知</h2></div><div class="grid">${aboutCards}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Language</span><h2>常用波蘭語</h2></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>中文</th><th>波蘭語</th><th>音譯</th></tr></thead><tbody>${phraseRows}</tbody></table></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Packing</span><h2>打包清單</h2></div><div class="grid-wide">${packingHtml}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">SOS</span><h2>緊急聯絡</h2></div><div class="grid-wide"><div class="table-wrap"><table class="table-editorial"><thead><tr><th>單位</th><th>電話</th></tr></thead><tbody>${emergencyRows}</tbody></table></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>駐波蘭代表處</th><th>資訊</th></tr></thead><tbody>${embassyRows}</tbody></table></div></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Safety</span><h2>安全與禮儀</h2></div><div class="grid-wide">${safetyCards}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Sources</span><h2>官方查核來源</h2></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>項目</th><th>查核日期</th><th>目前結論</th></tr></thead><tbody>${sourceRows}</tbody></table></div></section>`;
  return renderPracticalLayout('安全與基本須知', 'Essentials', '語言、插座、打包、緊急電話與常見陷阱集中在這裡，出發前可快速複查。', content, 'practical/essentials.html');
}

export function renderNotes({ preDepartureNotes }) {
  const cards = preDepartureNotes.map((item, index) => `<article class="card ${index < 3 || index === 8 ? 'card-accent' : ''}"><span class="section-num">${String(index + 1).padStart(2, '0')}</span><p>${item}</p></article>`).join('');
  return renderPracticalLayout('行前提醒', 'Pre-trip', '這些限制直接對應 2026/10/24–10/31 的日期；先處理閉館、日落、夏令時間與訂票節奏。', `<div class="grid-wide">${cards}</div>`, 'practical/notes.html');
}

export function renderOpsDashboard({ entries, statusLabels, syncRows, todoGroups }) {
  const statusCount = Object.fromEntries(Object.keys(statusLabels).map(status => [status, 0]));
  entries.forEach((entry) => {
    if (statusCount[entry.status] === undefined) statusCount[entry.status] = 1;
    else statusCount[entry.status] += 1;
  });

  const privateCount = entries.filter(item => item.private).length;
  const privateEntryIds = new Set(entries.filter(item => item.private).map(item => item.id));
  const publicSyncRows = (syncRows || []).filter(item => !item.private && !privateEntryIds.has(item.id));
  const todoCount = todoGroups.reduce((sum, group) => sum + group.items.length, 0);
  const openTodos = todoGroups
    .flatMap(group => group.items.map(item => ({ group: group.eyebrow, ...item })))
    .filter(item => isOpenTodoStatus(item.status));
  const checkedDates = [...new Set((syncRows || []).map(item => item.checkedAt).filter(Boolean))].sort();
  const latestCheckedDate = checkedDates.at(-1);
  const previousCheckedDate = checkedDates.at(-2);
  const latestSyncCount = latestCheckedDate ? (syncRows || []).filter(item => item.checkedAt === latestCheckedDate).length : 0;
  const previousSyncCount = previousCheckedDate ? (syncRows || []).filter(item => item.checkedAt === previousCheckedDate).length : null;
  const latestSyncDelta = previousSyncCount === null ? '—' : `${latestSyncCount - previousSyncCount}`;
  const latestSyncRows = publicSyncRows.filter(item => item.checkedAt && item.checkedAt === latestCheckedDate);

  const syncHistory = publicSyncRows
    .slice()
    .sort((a, b) => (b.checkedAt || '').localeCompare(a.checkedAt || ''))
    .slice(0, 8)
    .map(item => `<tr>
      <td>${escapeHtml(item.id)}</td>
      <td>${escapeHtml(statusLabels[item.status] || item.status || '—')}</td>
      <td>${escapeHtml(item.checkedAt || '—')}</td>
      <td>${escapeHtml(item.summary || '—')}</td>
    </tr>`)
    .join('');

  const todoUrgent = todoGroups
    .flatMap(group => group.items.map(item => ({ group: group.eyebrow, ...item })))
    .filter(item => isOpenTodoStatus(item.status))
    .slice(0, 12)
    .map(item => `<li><b>${escapeHtml(item.name)}</b>（${escapeHtml(item.group)}）— ${escapeHtml(item.status)}<br>${escapeHtml(item.action)}</li>`)
    .join('');

  const workflowSteps = [
    ['1. 更新網站資料', '以 src/data 內的網站資料為主要來源，維護 id 對應欄位（status、sourceUrl、verifiedAt、recheckAt、summary、offlineNote、private）。'],
    ['2. 匯入人工盤點', '需要整併 Google Sheet 時，執行 node tools/sync-dashboard-overrides.mjs --source dashboard-export.csv，將盤點差異轉成覆寫檔。'],
    ['3. 重新建置', '建議直接執行 npm run build，驗證頁面匯出完成後再推送。'],
    ['4. 驗證公開資料', '檢查自由行資料庫、待辦頁與公開匯出；私人內容不得寫入網站產物。'],
  ].map((step, index) => {
    // 小標與標題原本都帶同一個數字（「1」＋「1. 更新網站資料」），看起來像重複編號。
    // 數字留在小標，標題只留步驟名稱。
    const title = step[0].replace(/^\d+\.\s*/, '');
    return `<article class="card"><span class="section-num">Step ${String(index + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${step[1]}</p></article>`;
  }).join('');

  const dashboardInput = {
    metrics: {
      totalEntries: entries.length,
      verified: statusCount.verified || 0,
      recheck: statusCount.recheck || 0,
      pending: statusCount.pending || 0,
      privateRequired: statusCount['private-required'] || 0,
      privateCount,
      todos: todoCount,
      todoOpen: openTodos.length,
      latestSyncDate: latestCheckedDate || '—',
      latestSyncCount,
      syncDelta: latestSyncDelta,
    },
    alertCandidates: [
      ...openTodos
        .map(item => ({
          type: 'todo-overdue',
          key: `${item.group}-${item.name}`,
          date: item.recheckAt || item.date,
          status: item.status,
          name: item.name,
          action: item.action,
        })),
      ...entries
        .filter(entry => !entry.private)
        .filter(entry => isOpenEntryStatus(entry.status))
        .map(entry => ({
          type: 'entry-overdue',
          key: entry.id,
          date: entry.recheckAt || '',
          status: entry.status,
          name: entry.title,
          action: entry.summary || '',
        })),
    ],
    // Only anonymous dates from private records are needed for aggregate counts.
    privateDueDates: entries.filter(item => item.private && isOpenEntryStatus(item.status)).map(item => item.recheckAt || null),
    syncDates: (syncRows || []).map(item => item.checkedAt || null),
    syncRows: latestSyncRows.map(item => ({
      id: item.id,
      status: item.status,
      checkedAt: item.checkedAt,
      summary: item.summary || '',
      offlineNote: item.offlineNote || '',
    })),
  };

  const handover = calculateDashboard(dashboardInput);
  const { todaySyncCount, overdue: overdueCount } = handover.metrics;
  const dashboardPayload = serializeForInlineScript(dashboardInput);
  const dashboardRuntime = [getTaipeiToday, toComparableDate, calculateDashboard, dashboardCsv, initializeDashboard]
    .map(fn => fn.toString()).join('\n');

  const content = `
    <section>
      <div class="section-heading"><span class="section-num">Data Health</span><h2>資料品質面板</h2></div>
      <p>統計日期（台灣時間）：<span data-dashboard-today>${handover.generatedAt}</span>。依目前載入的紀錄重新計算；訂票狀態仍須人工查核。</p>
      <noscript><p>JavaScript 未啟用，以下為建置時的統計快照。</p></noscript>
      <div class="grid">
        <article class="card"><span class="eyebrow">今日更新量</span><h3 data-dashboard-today-count>${todaySyncCount} 筆</h3><p>最近同步日：${latestCheckedDate || '—'}，該日 ${latestSyncCount} 筆，較前一次 ${latestSyncDelta}</p></article>
        <article class="card"><span class="eyebrow">公開資料</span><h3>共 ${entries.length} 筆</h3><p>已確認：${statusCount.verified || 0}、重查：${statusCount.recheck || 0}、待確認：${statusCount.pending || 0}、待補資料：${statusCount['private-required'] || 0}</p></article>
        <article class="card"><span class="eyebrow">私有欄位</span><h3>${privateCount} 筆</h3><p>保留為本次行程所需的敏感欄位，網站不對外展示。</p></article>
        <article class="card"><span class="eyebrow">未完成項目</span><h3>${openTodos.length} / ${todoCount}</h3><p>含交通、景點、門票、餐飲與備案。建議在待辦頁更新後再同步 dashboard。</p></article>
        <article class="card"><span class="eyebrow">逾期項目</span><h3 data-dashboard-overdue>${overdueCount} 筆</h3><p>含 dashboard 重查到期 + 待辦日期到期但未完成。</p></article>
      </div>
      <div class="grid">
        ${workflowSteps}
      </div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Sync</span><h2>最近同步紀錄（以 checkedAt 排序）</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>id</th><th>狀態</th><th>盤查日期</th><th>摘要</th></tr></thead><tbody>${syncHistory || '<tr><td colspan="4">尚未有 dashboard 同步紀錄</td></tr>'}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Action list</span><h2>儀表板對齊優先清單</h2></div>
      <ul class="check-list">${todoUrgent || '<li>目前待辦內容無需即時更新</li>'}</ul>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Handover</span><h2>交接摘要與匯出</h2></div>
      <p>可直接輸出不含私人內容的「今日異常清單」與「最近同步清單」，給接手者交接時使用。</p>
      <div class="grid">
        <button id="export-handover-json" data-handover-export="json" type="button" class="btn-export">匯出 JSON</button>
        <button id="export-handover-csv" data-handover-export="csv" type="button" class="btn-export">匯出 CSV</button>
      </div>
      <script>
        (function() {
          ${dashboardRuntime}
          const root = document.currentScript.closest('.standalone-page') || document;
          initializeDashboard(root, ${dashboardPayload});
        }());
      </script>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Rule</span><h2>網站資料維護規則</h2></div>
      <div class="callout-note"><b>欄位邏輯：</b>網站資料是主要來源，只處理已知欄位與資料庫 entry；需要新增欄位時先修改網站資料契約，再更新 dashboard 對照表、同步與驗證規則。</div>
      <div class="grid"><article class="card"><p>欄位對應與資料規格已固定為 status、sourceUrl、verifiedAt、recheckAt、checkedAt、summary、offlineNote、private、id。</p><p>建議同步後檢查：待確認/重查比例、待辦 pending 是否下降。</p></article></div>
    </section>
  `;

  return renderPracticalLayout('資料更新儀表板', 'Ops', '把 dashboard、待辦與網站三者同步；每次更新都先落在欄位、再看頁面。', content, 'practical/ops-dashboard.html');
}

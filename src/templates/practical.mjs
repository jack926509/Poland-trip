import { renderLayout } from './layout.mjs';

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

function renderPracticalLayout(title, eyebrow, intro, content) {
  const bodyHtml = `
${renderAppendixHeader({ kicker: eyebrow, title, dek: intro })}
    ${content.trim()}`;
  return renderLayout({ title, activeNav: 'practical', bodyHtml: bodyHtml.trim(), pathPrefix: '../', pageKind: 'practical' });
}

function getTaipeiToday() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Taipei' });
}

function toComparableDate(dateText) {
  if (!dateText) return null;
  const raw = String(dateText).trim();
  if (!raw) return null;

  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) return `${ymd[1]}-${ymd[2]}-${ymd[3]}`;

  const md = raw.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!md) return null;

  const month = Number(md[1]);
  const day = Number(md[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isOpenTodoStatus(text) {
  return /待|需|尚未|未|指定日/.test(String(text || ''));
}

function isOpenEntryStatus(status) {
  return status === 'pending' || status === 'recheck' || status === 'private-required';
}

function renderFlightTable(legs) {
  return `<div class="table-wrap"><table class="table-editorial">
    <thead><tr><th>航班</th><th>路段</th><th>日期／時間</th><th>時長</th></tr></thead>
    <tbody>${legs.map(leg => `<tr><td>${leg.code}</td><td>${leg.leg}</td><td>${leg.when}</td><td>${leg.dur || '—'}</td></tr>`).join('')}</tbody>
  </table></div>`;
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
      <td class="number">${train.dur}</td><td class="number">${/^\d/.test(train.price) ? `PLN ${train.price}` : train.price}</td>
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
  const stayHtml = stay.map(item => `
    <article class="card">
      <span class="eyebrow">${item.status} · ${item.city}</span><h3>${item.name}</h3>
      <p><b>${item.checkIn}${item.checkInTime ? ` ${item.checkInTime}` : ''} → ${item.checkOut}${item.checkOutTime ? ` ${item.checkOutTime}` : ''}</b> · ${item.nights} 晚 · ${item.rooms} 間房</p>
      <p>${item.address}</p><p class="timeline-note">${item.note}</p>
      <a href="${item.officialUrl}" target="_blank" rel="noopener">飯店官網 →</a>
    </article>`).join('');

  const content = `
    <section>
      <div class="section-heading"><span class="section-num">Do first</span><h2>訂票優先順序</h2></div>
      <div class="grid">${tiersHtml}</div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Timeline</span><h2>什麼時候處理</h2></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>時間</th><th>事項</th></tr></thead><tbody>${reservationRows}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Rail</span><h2>城際交通</h2></div>
      <div class="callout-risk"><span class="tag-todo">尚未開賣／確認</span><p>下表是行程銜接所需的目標時段，不是已核實班次。只有在 PKP Intercity／KOLEO 顯示 2026-10-25 至 10-29 的實際車次並完成購票後，才可視為成立。</p></div>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>路段</th><th>日期</th><th>車種</th><th>時刻</th><th>時長</th><th>票價</th></tr></thead><tbody>${trainRows}</tbody></table></div>
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
      <div class="grid-wide">${stayHtml}</div>
    </section>`;

  return renderPracticalLayout('訂票與交通', 'Booking plan', '先看最急的票，再核對火車、航班與已確認住宿。尚未確認的時段保留原樣，不用猜。', content);
}

export function renderTodos({ todoGroups }) {
  const total = todoGroups.flatMap(group => group.items).length;
  const groupsHtml = todoGroups.map((group, index) => {
    const rows = group.items.map(item => `<tr>
      <td class="number"><b>${item.date}</b></td>
      <td><b>${item.name}</b><br><span class="tag-todo">${item.status}</span></td>
      <td>${item.action}${item.url ? `<br><a href="${item.url}" target="_blank" rel="noopener">開啟處理頁 →</a>` : ''}</td>
    </tr>`).join('');
    return `<section class="section" id="todo-${group.id}">
      <div class="section-heading"><span class="section-num">${group.eyebrow}</span><h2>${group.title}</h2></div>
      <p class="lead">${group.intro}</p>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>日期</th><th>事項／狀態</th><th>下一步</th></tr></thead><tbody>${rows}</tbody></table></div>
    </section>`;
  }).join('');

  const content = `
    <div class="callout-risk"><span class="tag-todo">${total} 項待辦</span><p>按「要買什麼」而非逐日行程整理。完成後請將票券與訂位資訊離線保存；未開賣項目仍以官方系統實際可售狀態為準。</p></div>
    ${groupsHtml}`.trim();

  return renderPracticalLayout('待辦事項', 'Action list', '城際交通、景點、餐飲與雨天備案集中在一頁。先處理有日期與指定場次的票，再處理彈性訂位。', content);
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
    <div class="callout-note"><b>資料界線：</b>米其林名單以 2026-05-29 官方發布為準；Google 星等與評論數會變，本站不再把它們當成固定資料。營業時間查證於 2026-08-09，訂位前仍看店家公告。</div>
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
  return renderPracticalLayout('米其林與餐廳', 'Michelin 2026', '已把 2026 米其林名單與本行程實際餐廳分開；營業時間只寫能追到店家來源的分店。', content);
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
      <div class="section-heading"><span class="section-num">2026-08</span><h2>最新門票速查</h2></div>
      <p class="lead">全票／優待皆為 PLN。動態票價與冬季開放時間，出發前仍以官網為準。</p>
      <div class="table-wrap"><table class="table-editorial"><thead><tr><th>景點</th><th>全票</th><th>優待</th><th>備註</th></tr></thead><tbody>${fareRows}</tbody></table></div>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">By city</span><h2>行程快速清單</h2></div>
      <p class="lead">這組是行程原本的城市分組備忘；若與上表不同，以「最新門票速查」與官網為準。</p>
      <div class="grid-wide">${quickCards}</div>
    </section>`;
  return renderPracticalLayout('門票速查', 'Tickets', '把景點價格、優待、閉館與官方連結放在同一頁，規劃預算時不必來回找。', content);
}

export function renderTransit({ transitFares, airportTransit, recommendedApps, passChecklist, usefulRoutes, practical = [] }) {
  const fareRows = transitFares.map(item => `<tr><td><b>${item.city}</b></td><td>${item.short}</td><td>${item.min90}</td><td>${item.hour24}</td><td>${item.note}</td></tr>`).join('');
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
  return renderPracticalLayout('市內交通', 'City transit', '四城大多可步行；需要搭車時，先查短程票與 Jakdojade，通常不必買多日券。', content);
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
  return renderPracticalLayout('伴手禮與購物', 'Shopping', '先決定要買什麼，再直接打開店家地圖；肉製品入境台灣限制也已標出。', content);
}

export function renderEssentials({ phrases, packingDefault, about, safety }) {
  const phraseRows = phrases.map(item => `<tr><td>${item[0]}</td><td><b>${item[1]}</b></td><td>${item[2] || '—'}</td></tr>`).join('');
  const aboutCards = about.map(item => `<article class="card"><span class="eyebrow">${item[0]}</span><p>${item[1]}</p></article>`).join('');
  const packingHtml = Object.entries(packingDefault).map(([category, items]) => `<article class="card"><h3>${category}</h3><ul class="check-list">${items.map(item => `<li>${item}</li>`).join('')}</ul></article>`).join('');
  const emergencyRows = safety.emergency.map(item => `<tr><td>${item[0]}</td><td class="number"><b>${item[1]}</b></td></tr>`).join('');
  const embassyRows = safety.embassy.map(item => `<tr><td>${item[0]}</td><td><b>${item[1]}</b></td></tr>`).join('');
  const safetyCards = safety.tips.map(item => `<article class="card"><h3>${item.label}</h3><p>${item.text}</p></article>`).join('');
  const content = `
    <section><div class="section-heading"><span class="section-num">Basics</span><h2>基本須知</h2></div><div class="grid">${aboutCards}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Language</span><h2>常用波蘭語</h2></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>中文</th><th>波蘭語</th><th>音譯</th></tr></thead><tbody>${phraseRows}</tbody></table></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Packing</span><h2>打包清單</h2></div><div class="grid-wide">${packingHtml}</div></section>
    <section class="section"><div class="section-heading"><span class="section-num">SOS</span><h2>緊急聯絡</h2></div><div class="grid-wide"><div class="table-wrap"><table class="table-editorial"><thead><tr><th>單位</th><th>電話</th></tr></thead><tbody>${emergencyRows}</tbody></table></div><div class="table-wrap"><table class="table-editorial"><thead><tr><th>駐波蘭代表處</th><th>資訊</th></tr></thead><tbody>${embassyRows}</tbody></table></div></div></section>
    <section class="section"><div class="section-heading"><span class="section-num">Safety</span><h2>安全與禮儀</h2></div><div class="grid-wide">${safetyCards}</div></section>`;
  return renderPracticalLayout('安全與基本須知', 'Essentials', '語言、插座、打包、緊急電話與常見陷阱集中在這裡，出發前可快速複查。', content);
}

export function renderNotes({ preDepartureNotes }) {
  const cards = preDepartureNotes.map((item, index) => `<article class="card ${index < 3 || index === 8 ? 'card-accent' : ''}"><span class="section-num">${String(index + 1).padStart(2, '0')}</span><p>${item}</p></article>`).join('');
  return renderPracticalLayout('行前提醒', 'Pre-trip', '這些限制直接對應 2026/10/24–10/31 的日期；先處理閉館、日落、夏令時間與訂票節奏。', `<div class="grid-wide">${cards}</div>`);
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
  const today = getTaipeiToday();
  const todoOverdueCount = openTodos.filter(item => {
    const parsed = toComparableDate(item.date);
    return parsed !== null && parsed < today;
  }).length;
  const databaseOverdueCount = entries
    .filter(entry => isOpenEntryStatus(entry.status))
    .filter(entry => entry.recheckAt != null && toComparableDate(entry.recheckAt) !== null && toComparableDate(entry.recheckAt) < today)
    .length;
  const overdueCount = todoOverdueCount + databaseOverdueCount;

  const checkedDates = [...new Set((syncRows || []).map(item => item.checkedAt).filter(Boolean))].sort();
  const latestCheckedDate = checkedDates.at(-1);
  const previousCheckedDate = checkedDates.at(-2);
  const todaySyncCount = (syncRows || []).filter(item => item.checkedAt === today).length;
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
    .filter(item => /未|需|待/.test(item.status))
    .slice(0, 12)
    .map(item => `<li><b>${escapeHtml(item.name)}</b>（${escapeHtml(item.group)}）— ${escapeHtml(item.status)}<br>${escapeHtml(item.action)}</li>`)
    .join('');

  const workflowSteps = [
    ['1. 更新網站資料', '以 src/data 內的網站資料為主要來源，維護 id 對應欄位（status、sourceUrl、verifiedAt、recheckAt、summary、offlineNote、private）。'],
    ['2. 匯入人工盤點', '需要整併 Google Sheet 時，執行 node tools/sync-dashboard-overrides.mjs --source dashboard-export.csv，將盤點差異轉成覆寫檔。'],
    ['3. 重新建置', '建議直接執行 npm run build，驗證頁面匯出完成後再推送。'],
    ['4. 驗證公開資料', '檢查自由行資料庫、待辦頁與公開匯出；私人內容不得寫入網站產物。'],
  ].map((step) => `<article class="card"><span class="section-num">${step[0].split('.')[0]}</span><h3>${step[0]}</h3><p>${step[1]}</p></article>`).join('');

  const handoverSummary = {
    generatedAt: getTaipeiToday(),
    metrics: {
      totalEntries: entries.length,
      verified: statusCount.verified || 0,
      recheck: statusCount.recheck || 0,
      pending: statusCount.pending || 0,
      privateRequired: statusCount['private-required'] || 0,
      privateCount,
      todos: todoCount,
      todoOpen: openTodos.length,
      overdue: overdueCount,
      overdueTodos: todoOverdueCount,
      overdueEntries: databaseOverdueCount,
      latestSyncDate: latestCheckedDate || '—',
      latestSyncCount,
      syncDelta: latestSyncDelta,
    },
    handoverAlerts: [
      ...openTodos
        .filter(item => toComparableDate(item.date) !== null && toComparableDate(item.date) < today)
        .map(item => ({
          type: 'todo-overdue',
          key: `${item.group}-${item.name}`,
          date: item.date,
          status: item.status,
          name: item.name,
          action: item.action,
        })),
      ...entries
        .filter(entry => !entry.private)
        .filter(entry => isOpenEntryStatus(entry.status))
        .filter(entry => entry.recheckAt != null && toComparableDate(entry.recheckAt) !== null && toComparableDate(entry.recheckAt) < today)
        .map(entry => ({
          type: 'entry-overdue',
          key: entry.id,
          date: entry.recheckAt || '',
          status: entry.status,
          name: entry.title,
          action: entry.summary || '',
        })),
    ],
    syncRows: latestSyncRows.map(item => ({
      id: item.id,
      status: item.status,
      checkedAt: item.checkedAt,
      summary: item.summary || '',
      offlineNote: item.offlineNote || '',
    })),
  };

  const handoverPayload = serializeForInlineScript(handoverSummary);
  const csvRows = ['類型,關鍵字,日期,狀態,說明'];
  for (const alert of handoverSummary.handoverAlerts) {
    const note = String(alert.action).replaceAll('"', '""');
    csvRows.push(`"${alert.type}","${String(alert.name).replaceAll('"', '""')}","${alert.date}","${alert.status}","${note}"`);
  }
  const handoverCsv = [...new Set(csvRows)].join('\\n');
  const handoverCsvWithSync = [handoverCsv, '', `最近同步清單（${latestCheckedDate || '無'}）`, `"id","status","checkedAt","summary","offlineNote"`, ...latestSyncRows.map(item => [
    `"${String(item.id).replaceAll('"', '""')}"`,
    `"${String(item.status || '').replaceAll('"', '""')}"`,
    `"${String(item.checkedAt || '').replaceAll('"', '""')}"`,
    `"${String(item.summary || '').replaceAll('"', '""')}"`,
    `"${String(item.offlineNote || '').replaceAll('"', '""')}"`,
  ].join(','))].join('\\n');
  const handoverCsvPayload = serializeForInlineScript(handoverCsvWithSync);

  const content = `
    <section>
      <div class="section-heading"><span class="section-num">Data Health</span><h2>資料品質面板</h2></div>
      <div class="grid">
        <article class="card"><span class="eyebrow">今日更新量</span><h3>${todaySyncCount} 筆</h3><p>最近同步日：${latestCheckedDate || '—'}，該日 ${latestSyncCount} 筆，較前一次 ${latestSyncDelta}</p></article>
        <article class="card"><span class="eyebrow">公開資料</span><h3>共 ${entries.length} 筆</h3><p>已確認：${statusCount.verified || 0}、重查：${statusCount.recheck || 0}、待確認：${statusCount.pending || 0}、待補資料：${statusCount['private-required'] || 0}</p></article>
        <article class="card"><span class="eyebrow">私有欄位</span><h3>${privateCount} 筆</h3><p>保留為本次行程所需的敏感欄位，網站不對外展示。</p></article>
        <article class="card"><span class="eyebrow">未完成項目</span><h3>${openTodos.length} / ${todoCount}</h3><p>含交通、景點、門票、餐飲與備案。建議在待辦頁更新後再同步 dashboard。</p></article>
        <article class="card"><span class="eyebrow">逾期項目</span><h3>${overdueCount} 筆</h3><p>含 dashboard 重查到期 + 待辦日期到期但未完成。</p></article>
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
        <button id="export-handover-json" data-handover-export="json" type="button" class="tag-todo" style="cursor:pointer; border:none; padding: .55rem .8rem; border-radius:.55rem; display:inline-block; text-align:left;">匯出 JSON</button>
        <button id="export-handover-csv" data-handover-export="csv" type="button" class="tag-todo" style="cursor:pointer; border:none; padding: .55rem .8rem; border-radius:.55rem; display:inline-block; text-align:left; margin-left:.5rem;">匯出 CSV</button>
      </div>
      <script>
        (function() {
          const handover = ${handoverPayload};
          const csvText = ${handoverCsvPayload};
          const root = document.currentScript.closest('.standalone-page') || document;
          const exportText = (filename, text, type) => {
            const blob = new Blob([text], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            a.remove();
          };
          root.querySelector('[data-handover-export="json"]').addEventListener('click', () => {
            exportText('handover-' + handover.generatedAt + '.json', JSON.stringify(handover, null, 2), 'application/json;charset=utf-8');
          });
          root.querySelector('[data-handover-export="csv"]').addEventListener('click', () => {
            exportText('handover-' + handover.generatedAt + '.csv', csvText, 'text/csv;charset=utf-8');
          });
        }());
      </script>
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Rule</span><h2>網站資料維護規則</h2></div>
      <div class="callout-note"><b>欄位邏輯：</b>網站資料是主要來源，只處理已知欄位與資料庫 entry；需要新增欄位時先修改網站資料契約，再更新 dashboard 對照表、同步與驗證規則。</div>
      <div class="grid"><article class="card"><p>欄位對應與資料規格已固定為 status、sourceUrl、verifiedAt、recheckAt、checkedAt、summary、offlineNote、private、id。</p><p>建議同步後檢查：待確認/重查比例、待辦 pending 是否下降。</p></article></div>
    </section>
  `;

  return renderPracticalLayout('資料更新儀表板', 'Ops', '把 dashboard、待辦與網站三者同步；每次更新都先落在欄位、再看頁面。', content);
}

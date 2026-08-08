import { renderLayout } from './layout.mjs';

function renderPracticalLayout(title, eyebrow, intro, content) {
  const bodyHtml = `
    <header class="hero">
      <div class="hero-copy">
        <span class="section-num">${eyebrow}</span>
        <h1>${title}</h1>
        <p class="hero-dek">${intro}</p>
      </div>
    </header>
    ${content}`;
  return renderLayout({ title, activeNav: 'practical', bodyHtml, pathPrefix: '../' });
}

function renderFlightTable(legs) {
  return `<div class="table-wrap"><table class="table-editorial">
    <thead><tr><th>航班</th><th>路段</th><th>日期／時間</th><th>時長</th></tr></thead>
    <tbody>${legs.map(leg => `<tr><td>${leg.code}</td><td>${leg.leg}</td><td>${leg.when}</td><td>${leg.dur || '—'}</td></tr>`).join('')}</tbody>
  </table></div>`;
}

export function renderBooking({ flights, trains, stay, bookingTiers, reservations }) {
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
  const stayHtml = stay.map(item => `
    <article class="card">
      <span class="eyebrow">${item.en}</span><h3>${item.city}</h3>
      <p><b>${item.pick}</b></p><p>${item.note}</p><p class="timeline-note">${item.tip}</p>
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
      <div class="section-heading"><span class="section-num">Flights</span><h2>航班</h2></div>
      <h3>去程</h3>${renderFlightTable(flights.out)}
      <h3>回程</h3>${renderFlightTable(flights.back)}
    </section>
    <section class="section">
      <div class="section-heading"><span class="section-num">Stay</span><h2>住宿選區</h2></div>
      <div class="grid-wide">${stayHtml}</div>
    </section>`;

  return renderPracticalLayout('訂票與交通', 'Booking plan', '先看最急的票，再核對火車、航班與住宿區域。尚未確認的時段保留原樣，不用猜。', content);
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
    <div class="callout-note"><b>資料界線：</b>米其林名單以 2026-05-29 官方發布為準；Google 星等與評論數會變，本站不再把它們當成固定資料。營業時間查證於 2026-08-08，訂位前仍看店家公告。</div>
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

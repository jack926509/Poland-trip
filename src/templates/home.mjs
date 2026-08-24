import { renderLayout } from './layout.mjs';

const cityFileKeys = {
  WAW: 'warszawa',
  KRK: 'krakow',
  WRO: 'wroclaw',
  POZ: 'poznan',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderFlight(direction, legs) {
  const actualLegs = legs.filter(leg => !leg.layover);
  return `<article class="card card-accent">
    <span class="eyebrow">${direction}</span>
    <h3>${actualLegs.map(leg => leg.code).join(' · ')}</h3>
    <ul class="link-list">
      ${legs.map(leg => `<li><b>${leg.leg}</b>　${leg.when}${leg.dur ? ` · ${leg.dur}` : ''}</li>`).join('')}
    </ul>
  </article>`;
}

export function renderHome({ meta, days, flights, cities, todoGroups = [], databaseEntries = [] }) {
  const todoCount = todoGroups.reduce((total, group) => total + group.items.length, 0);
  const syncItems = databaseEntries.length;
  const pendingCount = databaseEntries.filter(entry => entry.status === 'pending').length;
  const recheckCount = databaseEntries.filter(entry => entry.status === 'recheck').length;
  const verifiedCount = databaseEntries.filter(entry => entry.status === 'verified').length;
  const todoCards = todoGroups.map(group => `
    <article class="card">
      <span class="eyebrow">${escapeHtml(group.eyebrow)}</span>
      <h3>${escapeHtml(group.title)}</h3>
      <p>${escapeHtml(group.intro)}</p>
      <ul class="check-list">
        ${group.items.map(item => `<li>
          <span class="eyebrow">${escapeHtml(item.date)} · ${escapeHtml(item.status)}</span><br>
          <b>${escapeHtml(item.name)}</b>
        </li>`).join('')}
      </ul>
      <a href="practical/todos.html#todo-${escapeHtml(group.id)}">查看下一步與處理連結 →</a>
    </article>`).join('');
  const dayRows = days.map(day => `
    <tr>
      <td class="number" data-label="天數">Day ${String(day.n).padStart(2, '0')}</td>
      <td class="number" data-label="日期">${day.date}</td>
      <td data-label="城市">${day.city}</td>
      <td data-label="主題"><b>${day.title}</b><br><span class="timeline-note">${day.headline}</span></td>
      <td data-label="狀態">${day.mustBook.length ? `<span class="tag-todo">待訂 ${day.mustBook.length}</span>` : '<span class="tag-muted">無待訂</span>'}</td>
      <td data-label="開啟"><a href="day-${String(day.n).padStart(2, '0')}.html">打開行程 →</a></td>
    </tr>`).join('');

  const cityCards = cities.map(city => `
    <a class="card card-link" href="city-${cityFileKeys[city.key]}.html">
      <span class="eyebrow">${city.tag}</span>
      <h3>${city.name}</h3>
      <p class="lead">${city.pl} · ${city.vibe}</p>
      <p>${city.highlights.join(' · ')}</p>
      <span>打開城市地圖與指南 →</span>
    </a>`).join('');

  const bodyHtml = `
    <header class="hero">
      <div class="hero-copy">
        <span class="section-num">${meta.edition}</span>
        <h1>四城旅程<br>一頁掌握</h1>
        <p class="hero-dek">${meta.route}。逐日時間表、交通、門票、餐廳與互動地圖都已整理成可直接拿來規劃的頁面。</p>
      </div>
      <aside class="hero-aside">
        <dl class="meta-list">
          <div><dt>日期</dt><dd>${meta.dateRange}</dd></div>
          <div><dt>天數</dt><dd>${meta.days} 天 ${meta.nights} 夜</dd></div>
          <div><dt>待處理</dt><dd><a href="#todos"><span class="tag-todo">${todoCount} 項待辦</span></a></dd></div>
        </dl>
      </aside>
    </header>

    <div class="route-strip" aria-label="旅程路線">
      ${['華沙', '克拉科夫', '樂斯拉夫', '波茲南', '華沙'].map(city => `<span class="route-stop">${city}</span>`).join('')}
    </div>

    <section class="section" id="todos">
      <div class="section-heading section-heading-simple"><h2>待辦事項</h2></div>
      <p class="lead">共 ${todoCount} 項：先處理有日期有時段的票務與景點，再做其餘備案。可直接點「待辦事項」更新狀態與備註。</p>
      <div class="grid">${todoCards}</div>
      <p><a href="practical/todos.html">開啟完整待辦事項 →</a></p>
    </section>

    <section class="section">
      <div class="section-heading"><span class="section-num">Data Ops</span><h2>資料更新主軸</h2></div>
      <p class="lead">這版網站把資料更新放在網站欄位上：每天更新後先反映到自由行資料庫，再由導覽、待辦與城市頁自動對應。當前共 ${syncItems} 筆資料、${verifiedCount} 筆已確認、${recheckCount} 筆待重查、${pendingCount} 筆待確認，會在資料庫頁面顯示目前狀態。</p>
      <div class="grid">
        <article class="card">
          <span class="eyebrow">Day 1–8</span>
          <h3>網站資料是主要來源</h3>
          <p>先在網站資料檔維護 ID、狀態、官網來源、盤查日期與備註；Google Sheet dashboard 作為盤點、交換與人工複核介面。</p>
        </article>
        <article class="card">
          <span class="eyebrow">Workflow</span>
          <h3>更新完才是可對外資訊</h3>
          <p>每次只改一批欄位，執行同步腳本後再重建頁面。<a href="practical/ops-dashboard.html">查看網站同步儀表板 →</a></p>
        </article>
        <article class="card">
          <span class="eyebrow">Privacy</span>
          <h3>公開版與私人版分離</h3>
          <p>網站與公開匯出不展示訂位代碼、護照與保險資訊；敏感內容只保留在未發布的私人資料來源。</p>
        </article>
      </div>
    </section>

    <section class="section" id="days">
      <div class="section-heading"><span class="section-num">01 / Itinerary</span><h2>8 天行程總覽</h2></div>
      <p class="lead">先看每天的轉場與待訂數量，再點進當天查看精確時間、備案和風險。</p>
      <div class="table-wrap table-wrap-cards">
        <table class="table-editorial table-itinerary">
          <thead><tr><th>天數</th><th>日期</th><th>城市</th><th>主題</th><th>狀態</th><th></th></tr></thead>
          <tbody>${dayRows}</tbody>
        </table>
      </div>
    </section>

    <section class="section" id="cities">
      <div class="section-heading"><span class="section-num">02 / Cities</span><h2>4 個城市</h2></div>
      <p class="lead">每個城市頁都有真實比例互動地圖、景點、餐廳、備案與拍照時間。</p>
      <div class="grid-wide">${cityCards}</div>
    </section>

    <section class="section">
      <div class="section-heading"><span class="section-num">03 / Flights</span><h2>航班摘要</h2></div>
      <div class="grid-wide">
        ${renderFlight('去程', flights.out)}
        ${renderFlight('回程', flights.back)}
      </div>
    </section>

    <section class="section" id="practical">
      <div class="section-heading"><span class="section-num">04 / Toolkit</span><h2>規劃工具</h2></div>
      <div class="grid">
        <a class="card card-link" href="practical/booking.html"><h3>訂票與交通</h3><p>航班、火車、住宿與分級訂票清單。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/dining.html"><h3>米其林與餐廳</h3><p>2026 星級、必比登、訂位管道與預算。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/tickets.html"><h3>門票速查</h3><p>21 個景點全票、優待與官網。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/transit.html"><h3>市內交通</h3><p>四城票價、機場接駁與購票方式。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/shopping.html"><h3>伴手禮與購物</h3><p>14 種伴手禮、實際店家與 Żabka。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/database.html#database-lookup-heading"><h3>資料索引搜尋</h3><p>從 ${syncItems} 筆條目裡以關鍵字、城市、類別快速定位官方資訊。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/notes.html"><h3>出發前提醒</h3><p>夏令時間、日落、閉館與訂票節奏。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/database.html"><h3>自由行資料庫</h3><p>SOS、行前重查與各主題官方資料集中管理。</p><span>查看 →</span></a>
      </div>
    </section>`;

  return renderLayout({ title: '首頁', activeNav: 'home', bodyHtml });
}

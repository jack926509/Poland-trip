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
  return `<article class="journal-flight">
    <span class="eyebrow">${escapeHtml(direction)}</span>
    <h3>${actualLegs.map(leg => escapeHtml(leg.code)).join(' · ')}</h3>
    <ul class="link-list">
      ${legs.map(leg => `<li><b>${escapeHtml(leg.leg)}</b>　${escapeHtml(leg.when)}${leg.dur ? ` · ${escapeHtml(leg.dur)}` : ''}</li>`).join('')}
    </ul>
  </article>`;
}

export function renderHome({ meta, days, flights, cities, todoGroups = [], databaseEntries = [] }) {
  const todoCount = todoGroups.reduce((total, group) => total + group.items.length, 0);
  const syncItems = databaseEntries.length;
  const pendingCount = databaseEntries.filter(entry => entry.status === 'pending').length;
  const recheckCount = databaseEntries.filter(entry => entry.status === 'recheck').length;
  const verifiedCount = databaseEntries.filter(entry => entry.status === 'verified').length;
  const coverCity = cities[0];
  const coverFigure = coverCity?.photo?.hero ? `
      <figure class="journal-cover-figure">
        <img class="journal-cover-photo" src="${escapeHtml(coverCity.photo.hero)}" alt="${escapeHtml(coverCity.name)}城市風景" width="1200" height="800" decoding="async" fetchpriority="high">
        <figcaption>${escapeHtml(coverCity.pl)} · ${escapeHtml(coverCity.vibe)}</figcaption>
      </figure>` : '<div class="journal-cover-figure journal-cover-fallback" aria-hidden="true"></div>';
  const todoCards = todoGroups.map(group => `
    <article class="journal-note-card">
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
  const dayEntries = days.map(day => `
    <li class="journal-day-entry">
      <a href="day-${String(day.n).padStart(2, '0')}.html">
        <span class="journal-day-number">${String(day.n).padStart(2, '0')}</span>
        <span class="journal-day-date">${escapeHtml(day.date)}</span>
        <span class="journal-day-copy"><b>${escapeHtml(day.title)}</b><small>${escapeHtml(day.city)} · ${escapeHtml(day.headline)}</small></span>
        <span class="${day.mustBook.length ? 'tag-todo' : 'tag-muted'}">${day.mustBook.length ? `待訂 ${day.mustBook.length}` : '無待訂'}</span>
      </a>
    </li>`).join('');

  const cityCards = cities.map(city => `
    <article class="journal-city-card">
      <a href="city-${cityFileKeys[city.key]}.html">
        <figure>
          <img src="${escapeHtml(city.photo.hero)}" alt="${escapeHtml(city.name)}城市風景" width="1200" height="900" loading="lazy" decoding="async">
          <figcaption>${escapeHtml(city.tag)} · ${escapeHtml(city.pl)}</figcaption>
        </figure>
        <div>
          <h3>${escapeHtml(city.name)}</h3>
          <p>${escapeHtml(city.vibe)}</p>
          <span>打開城市地圖與指南 →</span>
        </div>
      </a>
    </article>`).join('');

  const bodyHtml = `
    <header class="journal-cover">
      <div class="journal-cover-copy">
        <span class="journal-kicker">${escapeHtml(meta.edition)} · PAPER TRAVEL JOURNAL</span>
        <h1>POLSKA</h1>
        <p class="journal-cover-route">${escapeHtml(meta.route)}</p>
        <dl class="journal-cover-meta">
          <div><dt>日期</dt><dd>${escapeHtml(meta.dateRange)}</dd></div>
          <div><dt>旅程</dt><dd>${meta.days} 天 ${meta.nights} 夜</dd></div>
        </dl>
      </div>
${coverFigure}
    </header>

    <div class="route-strip journal-route" aria-label="旅程路線">
      ${['華沙', '克拉科夫', '樂斯拉夫', '波茲南', '華沙'].map(city => `<span class="route-stop">${city}</span>`).join('')}
    </div>

    <aside class="journal-status-strip" aria-label="旅程準備狀態">
      <a href="#todos" aria-label="${todoCount} 項待辦"><strong>${todoCount}</strong><span>項待辦</span></a>
      <span><strong>${verifiedCount}</strong><span>已確認</span></span>
      <span><strong>${recheckCount}</strong><span>待重查</span></span>
      <span><strong>${pendingCount}</strong><span>待確認</span></span>
      <a href="practical/database.html"><strong>${syncItems}</strong><span>筆資料</span></a>
    </aside>

    <section class="section" id="days">
      <div class="section-heading"><span class="section-num">01 / Contents</span><h2>八日旅程目錄</h2></div>
      <p class="lead">從城市轉場到現場提醒，每一天都是一個可獨立翻閱的章節。</p>
      <ol class="journal-itinerary">${dayEntries}</ol>
    </section>

    <section class="section" id="cities">
      <div class="section-heading"><span class="section-num">02 / City stories</span><h2>四城攝影章節</h2></div>
      <p class="lead">先讀城市氣質，再打開地圖、景點、餐廳與拍照時間。</p>
      <div class="journal-city-chapters">${cityCards}</div>
    </section>

    <section class="section journal-todo-notes" id="todos">
      <div class="section-heading"><span class="section-num">03 / Field notes</span><h2>出發前待辦</h2></div>
      <p class="lead">共 ${todoCount} 項。先處理有日期與時段的票務，再完成交通、餐飲及備案。</p>
      <div class="journal-notes-grid">${todoCards}</div>
      <p><a class="journal-text-link" href="practical/todos.html">開啟完整待辦事項 →</a></p>
    </section>

    <section class="section">
      <div class="section-heading"><span class="section-num">04 / Flights</span><h2>往返航班</h2></div>
      <div class="journal-flight-grid">
        ${renderFlight('去程', flights.out)}
        ${renderFlight('回程', flights.back)}
      </div>
    </section>

    <section class="section" id="practical">
      <div class="section-heading"><span class="section-num">05 / Appendix</span><h2>旅行附錄</h2></div>
      <div class="journal-toolkit">
        <a class="card card-link" href="practical/booking.html"><h3>訂票與交通</h3><p>航班、火車、住宿與分級訂票清單。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/dining.html"><h3>米其林與餐廳</h3><p>2026 星級、必比登、訂位管道與預算。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/tickets.html"><h3>門票速查</h3><p>21 個景點全票、優待與官網。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/transit.html"><h3>市內交通</h3><p>四城票價、機場接駁與購票方式。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/shopping.html"><h3>伴手禮與購物</h3><p>14 種伴手禮、實際店家與 Żabka。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/notes.html"><h3>出發前提醒</h3><p>夏令時間、日落、閉館與訂票節奏。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/database.html"><h3>自由行資料庫</h3><p>SOS、行前重查與各主題官方資料集中管理。</p><span>查看 →</span></a>
      </div>
    </section>`;

  return renderLayout({ title: '首頁', activeNav: 'home', bodyHtml, pageKind: 'home' });
}

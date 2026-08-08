import { renderLayout } from './layout.mjs';

const cityFileKeys = {
  WAW: 'warszawa',
  KRK: 'krakow',
  WRO: 'wroclaw',
  POZ: 'poznan',
};

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

export function renderHome({ meta, days, flights, cities }) {
  const mustBookCount = days.reduce((total, day) => total + day.mustBook.length, 0);
  const dayRows = days.map(day => `
    <tr>
      <td class="number">Day ${String(day.n).padStart(2, '0')}</td>
      <td class="number">${day.date}</td>
      <td>${day.city}</td>
      <td><b>${day.title}</b><br><span class="timeline-note">${day.headline}</span></td>
      <td>${day.mustBook.length ? `<span class="tag-todo">待訂 ${day.mustBook.length}</span>` : '<span class="tag-muted">無待訂</span>'}</td>
      <td><a href="day-${String(day.n).padStart(2, '0')}.html">打開行程 →</a></td>
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
          <div><dt>步調</dt><dd>${meta.style}</dd></div>
          <div><dt>待處理</dt><dd><span class="tag-todo">${mustBookCount} 項尚未訂</span></dd></div>
        </dl>
      </aside>
    </header>

    <div class="route-strip" aria-label="旅程路線">
      ${['華沙', '克拉科夫', '樂斯拉夫', '波茲南', '華沙'].map(city => `<span class="route-stop">${city}</span>`).join('')}
    </div>

    <section class="section" id="days">
      <div class="section-heading"><span class="section-num">01 / Itinerary</span><h2>8 天行程總覽</h2></div>
      <p class="lead">先看每天的轉場與待訂數量，再點進當天查看精確時間、備案和風險。</p>
      <div class="table-wrap">
        <table class="table-editorial">
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
        <a class="card card-link" href="practical/notes.html"><h3>出發前提醒</h3><p>夏令時間、日落、閉館與訂票節奏。</p><span>查看 →</span></a>
      </div>
    </section>`;

  return renderLayout({ title: '首頁', activeNav: 'home', bodyHtml });
}

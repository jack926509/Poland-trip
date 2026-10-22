import { cityRoutes } from '../lib/city-guide.mjs';
import { escapeHtml } from '../lib/html.mjs';
import { bookingProgress, dayDate, isDepartureDay, nightStay } from '../lib/journey.mjs';
import { renderLayout } from './layout.mjs';
import { getTaipeiToday, todayIn, warsawToday, departureLabel, resolveHomeStatus, warsawMinutes, nextStepFor, initializeHomeStatus } from '../scripts/dashboard.js';
import { taipeiToday, parseStepTime } from '../lib/schedule.mjs';
import { todoStats, todoBreakdownText } from '../lib/todo-status.mjs';

const cityFileKeys = Object.fromEntries(cityRoutes.map(city => [city.key, city.fileKey]));

function renderFlight(direction, legs) {
  const actualLegs = legs.filter(leg => !leg.layover);
  return `<article class="journal-flight">
    <span class="eyebrow">${escapeHtml(direction)}</span>
    <h3>${actualLegs.map(leg => escapeHtml(leg.code)).join(' · ')}</h3>
    <ul class="link-list">
      ${legs.map(leg => `<li><b>${escapeHtml(leg.leg)}</b>　${escapeHtml(leg.when)}${leg.dur ? ` · ${escapeHtml(leg.dur)}` : ''}${leg.status ? ` · <span class="tag-muted">${escapeHtml(leg.status)}</span>` : ''}</li>`).join('')}
    </ul>
  </article>`;
}

/**
 * 日期格下方的狀態小卡（UX 審查 B7）：出發前把「還剩幾項待辦」放進第一屏。
 * 出發前：距出發 N 天・還有 M 項待辦（依分類）→ 看待辦。
 * 旅程期間（華沙日期落在 tripStart–tripEnd）：今天 Day N：主軸＋下一站 → 今日卡。
 * 待辦數字來自 todoStats（待辦正本）；兩種版本都先寫進 HTML，前端依日期切換，
 * 所以離線與無 JavaScript 時仍看得到出發前版本。
 */
function renderHomeStatusCard({ meta, days, stats }) {
  const daysToDeparture = resolveHomeStatus('0000-00-00', getTaipeiToday(), meta.travelStart, meta.tripStart, meta.tripEnd).days;
  const breakdown = stats.groups.filter(row => row.open > 0).map(row => `<span class="home-status-cat">${escapeHtml(row.title)} ${row.open}</span>`).join('／');
  const before = `<a class="home-status-card home-status-before" data-home-status="before" href="practical/todos.html">
      <span class="home-status-main"><b data-home-departure>${escapeHtml(departureLabel(daysToDeparture))}</b>・${stats.open ? `還有 <b data-home-open>${stats.open}</b> 項待辦` : '待辦已全部完成'}</span>
      ${stats.open ? `<span class="home-status-sub">${breakdown}</span>` : ''}
      <span class="home-status-cta">看待辦 →</span>
    </a>`;
  const dayCards = days.map(day => {
    const iso = dayDate(day);
    const steps = day.steps
      .map(step => ({ parsed: parseStepTime(step.t), label: step.label }))
      .filter(step => step.parsed && step.label)
      .map(step => [step.parsed.minutes, step.label])
      .sort((a, b) => a[0] - b[0]);
    return `<a class="home-status-card home-status-during" data-home-day="${escapeHtml(iso)}" data-home-steps="${escapeHtml(JSON.stringify(steps))}" href="today.html" hidden>
      <span class="home-status-main"><b>今天 Day ${day.n}</b>：${escapeHtml(day.title)}</span>
      <span class="home-status-sub" data-home-next></span>
      <span class="home-status-cta">今日卡 →</span>
    </a>`;
  }).join('');
  const after = `<p class="home-status-card home-status-after" data-home-status="after" hidden><span class="home-status-main">旅程已結束，歡迎回家。</span></p>`;
  return `<div class="home-status" aria-label="目前最該做的事" aria-live="polite">${before}<div data-home-status="during" hidden>${dayCards}</div>${after}</div>`;
}

export function renderHome({ meta, days, flights, cities, todoGroups = [], databaseEntries = [], trains = [], deadlines = [] }) {
  // 待辦數字一律來自 lib/todo-status.mjs（todoGroups 正本），首頁各處共用同一份計算。
  const stats = todoStats(todoGroups);
  const todoCount = stats.open;
  const totalTodos = stats.total;
  const coverCity = cities[0];
  const coverFigure = coverCity?.photo?.hero ? `
      <figure class="journal-cover-figure">
        <img class="journal-cover-photo" src="${escapeHtml(coverCity.photo.hero)}" alt="${escapeHtml(coverCity.name)}城市風景" width="1200" height="800" decoding="async" fetchpriority="high">
        <figcaption>${escapeHtml(coverCity.pl)} · ${escapeHtml(coverCity.vibe)}</figcaption>
      </figure>` : '<div class="journal-cover-figure journal-cover-fallback" aria-hidden="true"></div>';
  // 首頁原本把每個分類的全部項目（16 項）逐條列出，和 practical/todos.html
  // 的完整清單（21 項）大面積重複。首頁只留「這類還有幾項要處理」的計數
  // 加連結，項目本身只在待辦頁看一次（稽核 M9）。
  const todoCards = todoGroups.map(group => {
    const pending = stats.groups.find(row => row.id === group.id).open;
    return `<a class="card card-link" href="practical/todos.html#todo-${escapeHtml(group.id)}">
      <span class="eyebrow">${escapeHtml(group.eyebrow)}</span>
      <h3>${escapeHtml(group.title)}</h3>
      <p>${escapeHtml(group.intro)}</p>
      <span>${pending ? `${pending} 項待處理` : '已全部完成'}（共 ${group.items.length} 項）→</span>
    </a>`;
  }).join('');
  // 八日目錄同時是「全程動線」：每一天一列，白天主題、今晚住哪、強度與待訂數一起看。
  // 原本另有一張「全程動線與過夜安排」表把同樣八天再列一次，手機上多捲約 2,000px，
  // 兩份清單也各自取用待訂數；合併後只剩這一份，待訂數與待辦頁同源（lib/journey.mjs）。
  const dayEntries = days.map(day => {
    const pending = bookingProgress(day).pending.length;
    const hotel = nightStay(day);
    const stayText = hotel ? `今晚 ${hotel.city} · ${hotel.name}` : isDepartureDay(day) ? '離境／機上過夜' : '⚠ 住宿資料缺漏';
    return `
    <li class="journal-day-entry">
      <a href="day-${String(day.n).padStart(2, '0')}.html">
        <span class="journal-day-number">${String(day.n).padStart(2, '0')}</span>
        <span class="journal-day-date">${escapeHtml(day.date)}</span>
        <span class="journal-day-copy"><b>${escapeHtml(day.title)}</b><small>${escapeHtml(day.city)} · ${escapeHtml(day.headline)}</small><small class="journal-day-stay">${escapeHtml(stayText)}<span>強度 ${escapeHtml(day.intensity)}</span></small></span>
        <span class="${pending ? 'tag-todo' : 'tag-green'}">${pending ? `待訂 ${pending}` : '無待訂'}</span>
      </a>
    </li>`;
  }).join('');

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

  const statusCardHtml = renderHomeStatusCard({ meta, days, stats });
  const bodyHtml = `
    <nav class="trip-day-picker" aria-label="快速選擇旅行日期" data-trip-timezone="${escapeHtml(meta.timeZone)}">
      ${days.map(day => {
        const [month, date] = day.date.split(' ')[0].split('/');
        const iso = `${meta.tripStart.slice(0, 4)}-${month.padStart(2, '0')}-${date.padStart(2, '0')}`;
        return `<a href="day-${String(day.n).padStart(2, '0')}.html" data-trip-date="${escapeHtml(iso)}"><b>${escapeHtml(day.date.split(' ')[0])}</b><span>Day ${day.n}</span></a>`;
      }).join('')}
    </nav>
    ${statusCardHtml}
    <header class="journal-cover">
      <div class="journal-cover-copy">
        <span class="journal-kicker">${escapeHtml(meta.edition)}</span>
        <h1>POLSKA</h1>
        <p class="journal-cover-route">${meta.route.split(' → ').map(city => `<span>${escapeHtml(city)}</span>`).join(' → ')}</p>
        <dl class="journal-cover-meta">
          <div><dt>航空往返</dt><dd>${escapeHtml(meta.flightDateRange || meta.dateRange)}</dd></div>
          <div><dt>波蘭境內</dt><dd>${escapeHtml(meta.dateRange)}</dd></div>
          <div><dt>旅程</dt><dd>${meta.days} 天 ${meta.nights} 夜</dd></div>
        </dl>
      </div>
${coverFigure}
    </header>

    <div class="route-strip journal-route" aria-label="旅程路線">
      ${['華沙', '克拉科夫', '樂斯拉夫', '波茲南', '華沙'].map(city => `<span class="route-stop"><span>${city}</span></span>`).join('')}
    </div>

    <nav class="journey-entry" aria-label="依旅行需求查找">
      <a href="#journey-overview"><b>出發前規劃</b><span>八日動線、過夜與強度</span></a>
      <a href="today.html"><b>旅途中速查</b><span>今天行程、導航與餐飲</span></a>
      <a href="practical/todos.html"><b>處理預約</b><span>票券、交通與待辦</span></a>
    </nav>
    <!-- 2026-10-20 UX F15：「N 項待辦／已完成」兩張統計大卡與頁首狀態列重複，已移除。 -->

    <section class="section" id="days">
      <div class="section-heading"><span class="section-num">01 / Contents</span><h2>八日旅程目錄</h2></div>
      <p class="lead">白天玩哪裡、晚上住哪裡、還有幾件要先訂，一列看完；點進去是當天完整章節。轉場日先保留取行李與進站時間。</p>
      <ol class="journal-itinerary" id="journey-overview">${dayEntries}</ol>
    </section>

    <section class="section" id="cities">
      <div class="section-heading"><span class="section-num">02 / City stories</span><h2>四城指南與行程銜接</h2></div>
      <p class="lead">先讀城市氣質，再打開地圖、景點、餐廳與拍照時間。</p>
      <div class="journal-city-chapters">${cityCards}</div>
    </section>

    <section class="section journal-todo-notes" id="todos">
      <div class="section-heading"><span class="section-num">03 / Field notes</span><h2>出發前待辦</h2></div>
      <p class="lead">共 ${totalTodos} 項，還有 ${todoCount} 項待處理。先處理有日期與時段的票務，再完成交通、餐飲及備案。</p>
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
        <a class="card card-link" href="practical/booking.html"><h3>訂票與交通</h3><p>航班、火車、Auschwitz 巴士與住宿。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/dining.html"><h3>餐廳與速食</h3><p>八天三餐、咖啡甜點與四城連鎖速食。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/transit.html"><h3>市內交通</h3><p>四城票價、機場接駁與 Jakdojade。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/essentials.html"><h3>SOS 與安全須知</h3><p>緊急電話、保險與訂位資料、常用波蘭語。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/groceries.html"><h3>超市與便利商店</h3><p>四城超市、零食與伴手禮清單。</p><span>查看 →</span></a>
        <a class="card card-link" href="practical/shopping.html"><h3>伴手禮與購物</h3><p>伴手禮、實際店家與 Żabka。</p><span>查看 →</span></a>
      </div>
    </section>
    <script>
      (function() {
        ${[todayIn, taipeiToday, warsawToday, warsawMinutes, departureLabel, resolveHomeStatus, nextStepFor, initializeHomeStatus].map(fn => fn.toString()).join('\n')}
        const root = document.currentScript.closest('.standalone-page') || document;
        initializeHomeStatus(root, ${JSON.stringify({ travelStart: meta.travelStart, tripStart: meta.tripStart, tripEnd: meta.tripEnd })});
      }());
    </script>`;

  return renderLayout({ title: '首頁', activeNav: 'home', bodyHtml, pageKind: 'home' });
}

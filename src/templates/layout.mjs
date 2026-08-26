function current(activeNav, key) {
  return activeNav === key ? ' aria-current="page"' : '';
}

// 目前所在的章節群組：視覺上已用 .nav-dropdown-current 標示，
// 這裡補上 aria-current 讓螢幕閱讀器也聽得到「目前位置」。
function currentGroup(activeNav, key) {
  return activeNav === key ? ' aria-current="true"' : '';
}

export const searchIndexPlaceholder = '__SITE_SEARCH_INDEX__';

export function renderSiteSearch({
  pathPrefix = '',
  searchIndexJson = searchIndexPlaceholder,
  databaseHref = '',
} = {}) {
  const path = file => `${pathPrefix}${file}`;
  const fallbackHref = databaseHref || path('practical/database.html');
  return `<section class="site-search-region" aria-label="全站旅遊搜尋">
    <details class="site-search-shell" data-site-search data-search-path-prefix="${pathPrefix}" open>
    <summary class="site-search-toggle"><span aria-hidden="true">⌕</span>搜尋整個旅遊網站</summary>
    <div class="site-search-inner">
      <div class="site-search-form-row">
        <label for="site-search-input">搜尋整個旅遊網站</label>
        <div class="site-search-input-row">
          <span class="site-search-icon" aria-hidden="true">⌕</span>
          <input id="site-search-input" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="火車、餐廳、景點、城市特色" aria-controls="site-search-results" aria-describedby="site-search-help">
          <button class="site-search-clear" type="button" data-search-clear hidden>清除</button>
        </div>
      </div>
      <div class="site-search-quick-row" role="group" aria-label="快捷分類">
        <span id="site-search-help">快速找：</span>
        <button type="button" data-search-category="train" aria-pressed="false">🚆 火車</button>
        <button type="button" data-search-category="restaurant" aria-pressed="false">🍽️ 餐廳</button>
        <button type="button" data-search-category="map" aria-pressed="false">🗺️ 地圖</button>
        <button type="button" data-search-category="city" aria-pressed="false">✶ 城市</button>
      </div>
      <p class="site-search-summary" data-search-summary aria-live="polite"></p>
      <ol class="site-search-results" id="site-search-results" data-search-results hidden></ol>
      <div class="site-search-empty" data-search-empty hidden>
        <p><b>找不到相符資料</b><br>試試城市名、店名或「火車」「地圖」等類型。</p>
        <button type="button" data-search-reset>清除條件</button>
      </div>
      <noscript><p class="site-search-noscript">瀏覽器未開啟 JavaScript，請改用 <a href="${fallbackHref}">自由行資料庫</a>。</p></noscript>
      <script type="application/json" data-site-search-index>${searchIndexJson}</script>
    </div>
    </details>
  </section>`;
}

export function renderLayout({
  title,
  activeNav,
  bodyHtml,
  extraHead = '',
  pathPrefix = '',
  pageKind = 'practical',
}) {
  const path = file => `${pathPrefix}${file}`;
  const dayLinks = Array.from({ length: 8 }, (_, index) => {
    const day = index + 1;
    const file = `day-${String(day).padStart(2, '0')}.html`;
    return `<li><a href="${path(file)}">Day ${day}</a></li>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="2026 波蘭四城 8 天旅遊規劃：逐日行程、城市地圖、交通、門票與餐廳。">
  <meta name="color-scheme" content="light dark">
  <meta name="theme-color" content="#f4eddf" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#191411" media="(prefers-color-scheme: dark)">
  <title>${title} · POLSKA 波蘭行</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%232b2723'/%3E%3Ctext x='32' y='44' text-anchor='middle' font-size='38' font-family='serif' font-weight='700' fill='%23f6f1e8'%3EP%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- 字型改為非阻斷載入：字型 CDN 連不上時，內文立刻以系統中文字型顯示，
       不會整頁空白等到逾時（實測阻斷式載入在 CDN 無回應時會空白 12.4 秒） -->
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&amp;family=Noto+Sans+TC:wght@400;500;700&amp;family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet" media="print" onload="this.media='all';this.onload=null">
  <noscript><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&amp;family=Noto+Sans+TC:wght@400;500;700&amp;family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="${path('assets/main.css')}">
  ${extraHead}
</head>
<body class="journal-site journal-${pageKind}">
  <a class="skip-link" href="#main-content">跳至主要內容</a>
  <nav class="nav journal-masthead" aria-label="主要導覽">
    <a class="nav-brand" href="${path('index.html')}"${current(activeNav, 'home')}>
      <span>POLSKA</span>
      <small>Paper Travel Journal</small>
    </a>
    <span class="journal-edition" aria-hidden="true">VOL. 2026 · 08 DAYS</span>
    <details class="nav-dropdown${activeNav === 'days' ? ' nav-dropdown-current' : ''}" name="primary-navigation">
      <summary${currentGroup(activeNav, 'days')}>每日行程</summary>
      <ul><li><a href="${path('index.html#days')}">行程總覽</a></li>${dayLinks}</ul>
    </details>
    <details class="nav-dropdown${activeNav === 'cities' ? ' nav-dropdown-current' : ''}" name="primary-navigation">
      <summary${currentGroup(activeNav, 'cities')}>城市指南</summary>
      <ul>
        <li><a href="${path('index.html#cities')}">城市總覽</a></li>
        <li><a href="${path('city-warszawa.html')}">華沙 Warszawa</a></li>
        <li><a href="${path('city-krakow.html')}">克拉科夫 Kraków</a></li>
        <li><a href="${path('city-wroclaw.html')}">樂斯拉夫 Wrocław</a></li>
        <li><a href="${path('city-poznan.html')}">波茲南 Poznań</a></li>
      </ul>
    </details>
    <details class="nav-dropdown${activeNav === 'practical' ? ' nav-dropdown-current' : ''}" name="primary-navigation">
      <summary${currentGroup(activeNav, 'practical')}>實用資訊</summary>
      <ul>
        <li><a href="${path('index.html#practical')}">實用資訊總覽</a></li>
        <li><a href="${path('practical/todos.html')}">待辦事項</a></li>
        <li><a href="${path('practical/booking.html')}">訂票與交通</a></li>
        <li><a href="${path('practical/dining.html')}">米其林與餐廳</a></li>
        <li><a href="${path('practical/tickets.html')}">門票速查</a></li>
        <li><a href="${path('practical/transit.html')}">市內交通</a></li>
        <li><a href="${path('practical/shopping.html')}">伴手禮與購物</a></li>
        <li><a href="${path('practical/essentials.html')}">安全與基本須知</a></li>
        <li><a href="${path('practical/notes.html')}">行前提醒</a></li>
        <li><a href="${path('practical/ops-dashboard.html')}">資料更新儀表板</a></li>
        <li><a href="${path('practical/database.html')}">自由行資料庫</a></li>
      </ul>
    </details>
  </nav>
  ${renderSiteSearch({ pathPrefix })}
  <main class="page" id="main-content">
    ${bodyHtml}
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>POLSKA 波蘭行 · 2026/10/24–10/31</p>
      <p>票價、開放時間與交通資料查證於 2026-08-09；尚未開賣或會變動的項目已明確標示，實際以官網與已購票券為準。</p>
    </div>
  </footer>
  <script src="${path('assets/nav.js')}" defer></script>
  <script type="module" src="${path('assets/site-search.js')}"></script>
</body>
</html>`;
}

function current(activeNav, key) {
  return activeNav === key ? ' aria-current="page"' : '';
}

function currentGroup(activeNav, key) {
  return activeNav === key ? ' aria-current="true"' : '';
}

const CITY_LINKS = [
  ['city-warszawa.html', '華沙 Warszawa'],
  ['city-krakow.html', '克拉科夫 Kraków'],
  ['city-wroclaw.html', '樂斯拉夫 Wrocław'],
  ['city-poznan.html', '波茲南 Poznań'],
];

const PRACTICAL_LINKS = [
  ['practical/todos.html', '待辦事項'],
  ['practical/booking.html', '訂票與交通'],
  ['practical/dining.html', '米其林與餐廳'],
  ['practical/tickets.html', '門票速查'],
  ['practical/transit.html', '市內交通'],
  ['practical/shopping.html', '伴手禮與購物'],
  ['practical/essentials.html', '安全與基本須知'],
  ['practical/notes.html', '行前提醒'],
  ['practical/ops-dashboard.html', '資料更新儀表板'],
  ['practical/database.html', '自由行資料庫'],
];

const DAY_LINKS = Array.from({ length: 8 }, (_, index) => {
  const day = index + 1;
  return [`day-${String(day).padStart(2, '0')}.html`, `Day ${day}`];
});

function escapeAttr(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildChapterIndex(bodyHtml) {
  // 實用資訊頁的第一塊常寫成沒有 class 的 <section>，只認 class="section" 會漏掉它，
  // 索引就少一項也放錯位置。這裡把所有 <section> 都納入，有 h2 的才進索引。
  const sectionPattern = /<section(?![^>]*\bclass="(?:site-search|standalone))([^>]*)>/g;
  const items = [];
  let counter = 0;

  const rewritten = bodyHtml.replace(sectionPattern, (match, attrs) => {
    counter += 1;
    const existingId = /\bid="([^"]+)"/.exec(attrs)?.[1];
    const id = existingId || `sec-${counter}`;
    items.push({ id });
    return existingId ? match : `<section${attrs} id="${id}">`;
  });

  const blocks = rewritten.split(/<section[ >]/);
  items.forEach((item, position) => {
    const block = blocks[position + 1] || '';
    item.num = /<span class="section-num">([^<]*)<\/span>/.exec(block)?.[1]?.trim() || '';
    item.title = /<h2[^>]*>([\s\S]*?)<\/h2>/.exec(block)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
  });

  const usable = items.filter(item => item.title);
  if (usable.length < 3) return bodyHtml;

  const links = usable.map(item => `<li><a href="#${escapeAttr(item.id)}">${
    item.num ? `<span>${item.num}</span>` : ''
  }${item.title}</a></li>`).join('');
  const indexHtml = `<nav class="chapter-index" aria-labelledby="chapter-index-label">
      <p class="chapter-index-label" id="chapter-index-label">本頁章節</p>
      <ol>${links}</ol>
    </nav>`;
  const firstSection = rewritten.search(/<section[ >]/);
  return firstSection === -1
    ? rewritten
    : `${rewritten.slice(0, firstSection)}${indexHtml}\n    ${rewritten.slice(firstSection)}`;
}

function stripTags(value) {
  return String(value ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * 手機把表格改成卡片時要靠 td 的 data-label 顯示欄位名。
 * 每個表格都手寫一次太容易漏，所以在組版時用 thead 自動補上。
 * 已經有 data-label 的沿用原值；含 colspan 的儲存格（例如「查無資料」整列）跳過。
 */
export function addTableCellLabels(html) {
  return html.replace(/<table class="table-editorial([^"]*)"([^>]*)>([\s\S]*?)<\/table>/g,
    (match, extraClass, attrs, inner) => {
      const headRow = /<thead>[\s\S]*?<tr>([\s\S]*?)<\/tr>[\s\S]*?<\/thead>/.exec(inner)?.[1];
      if (!headRow) return match;
      const headers = Array.from(headRow.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)).map(cell => stripTags(cell[1]));
      if (!headers.length) return match;

      const body = inner.replace(/<tbody>([\s\S]*?)<\/tbody>/, (bodyMatch, rows) =>
        `<tbody>${rows.replace(/<tr([^>]*)>([\s\S]*?)<\/tr>/g, (rowMatch, rowAttrs, cells) => {
          let column = -1;
          const labelled = cells.replace(/<td([^>]*)>/g, (cellMatch, cellAttrs) => {
            column += 1;
            if (/\bcolspan=/.test(cellAttrs) || /\bdata-label=/.test(cellAttrs)) return cellMatch;
            const label = headers[column];
            return label ? `<td${cellAttrs} data-label="${escapeAttr(label)}">` : cellMatch;
          });
          return `<tr${rowAttrs}>${labelled}</tr>`;
        })}</tbody>`);

      return `<table class="table-editorial${extraClass}"${attrs}>${body}</table>`;
    });
}

export const SITE_ORIGIN = 'https://polandtrip.xiehnet.com';
const DEFAULT_DESCRIPTION = '2026 波蘭四城 8 天旅遊規劃：逐日行程、城市地圖、交通、門票與餐廳。';
const DEFAULT_OG_IMAGE = 'assets/og/polska-og.jpg';
const DEFAULT_OG_IMAGE_ALT = '波蘭旅程總覽海報';

export const searchIndexPlaceholder = '__SITE_SEARCH_INDEX__';

export function renderSiteSearch({
  pathPrefix = '',
  searchIndexJson = searchIndexPlaceholder,
  databaseHref = '',
} = {}) {
  const path = file => `${pathPrefix}${file}`;
  const fallbackHref = databaseHref || path('practical/database.html');
  return `<section class="site-search-shell" data-site-search data-search-path-prefix="${pathPrefix}" aria-label="全站旅遊搜尋">
    <div class="site-search-inner">
      <div class="site-search-form-row">
        <label class="site-search-label" for="site-search-input">搜尋整個旅遊網站</label>
        <div class="site-search-input-row">
          <span class="site-search-icon" aria-hidden="true">⌕</span>
          <input id="site-search-input" type="search" inputmode="search" autocomplete="off" spellcheck="false" placeholder="搜尋火車、餐廳、景點、城市" aria-controls="site-search-results" aria-describedby="site-search-help">
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
  </section>`;
}

export function renderLayout({
  title,
  activeNav,
  bodyHtml,
  extraHead = '',
  pathPrefix = '',
  pageKind = 'practical',
  currentPage = '',
  chapterIndex = true,
  description = '',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
}) {
  const path = file => `${pathPrefix}${file}`;
  const pageDescription = description || DEFAULT_DESCRIPTION;
  const ogUrl = `${SITE_ORIGIN}/${currentPage}`;
  const ogImageUrl = `${SITE_ORIGIN}/${ogImage}`;
  const useChapterIndex = chapterIndex && pageKind !== 'home' && !bodyHtml.includes('database-index');
  const pageBody = addTableCellLabels(useChapterIndex ? buildChapterIndex(bodyHtml) : bodyHtml);
  const navLink = ([file, label]) => {
    const isCurrent = currentPage === file;
    return `<li><a href="${path(file)}"${isCurrent ? ' aria-current="page" class="nav-link-current"' : ''}>${label}</a></li>`;
  };
  const dayLinks = DAY_LINKS.map(navLink).join('');
  const cityLinks = CITY_LINKS.map(navLink).join('');
  const practicalLinks = PRACTICAL_LINKS.map(navLink).join('');

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="2026 波蘭四城 8 天旅遊規劃：逐日行程、城市地圖、交通、門票與餐廳。">
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#f4eddf">
  <title>${title} · POLSKA 波蘭行</title>
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="POLSKA · Paper Travel Journal">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(pageDescription)}">
  <meta property="og:url" content="${escapeAttr(ogUrl)}">
  <meta property="og:image" content="${escapeAttr(ogImageUrl)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${escapeAttr(ogImageAlt)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(pageDescription)}">
  <meta name="twitter:image" content="${escapeAttr(ogImageUrl)}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%232b2723'/%3E%3Ctext x='32' y='44' text-anchor='middle' font-size='38' font-family='serif' font-weight='700' fill='%23f6f1e8'%3EP%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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
      <ul><li><a href="${path('index.html#cities')}">城市總覽</a></li>${cityLinks}</ul>
    </details>
    <details class="nav-dropdown${activeNav === 'practical' ? ' nav-dropdown-current' : ''}" name="primary-navigation">
      <summary${currentGroup(activeNav, 'practical')}>實用資訊</summary>
      <ul><li><a href="${path('index.html#practical')}">實用資訊總覽</a></li>${practicalLinks}</ul>
    </details>
  </nav>
  ${renderSiteSearch({ pathPrefix })}
  <main class="page" id="main-content">
    ${pageBody}
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>POLSKA 波蘭行 · 2026/10/24–10/31</p>
      <p>行程與介面檢視：2026-09-08。各筆資料查核日期見待辦與資料庫；候選班次未訂妥，票價及開放時間以官方公告與已購票券為準。</p>
    </div>
  </footer>
  <script src="${path('assets/nav.js')}" defer></script>
  <script type="module" src="${path('assets/site-search.js')}"></script>
</body>
</html>`;
}

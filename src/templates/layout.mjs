function current(activeNav, key) {
  return activeNav === key ? ' aria-current="page"' : '';
}

// 目前所在的章節群組：視覺上已用 .nav-dropdown-current 標示，
// 這裡補上 aria-current 讓螢幕閱讀器也聽得到「目前位置」。
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

// 長頁面（每日 5~6 螢幕、城市 8 螢幕）需要跳章節的入口。
// 這裡直接掃描組好的 bodyHtml，替沒有 id 的 .section 補上 id 並產生索引，
// 不必在每個頁面樣板各寫一份。
function buildChapterIndex(bodyHtml) {
  const sectionPattern = /<section class="section([^"]*)"([^>]*)>/g;
  const items = [];
  let counter = 0;

  const rewritten = bodyHtml.replace(sectionPattern, (match, extraClass, attrs) => {
    counter += 1;
    const existingId = /\bid="([^"]+)"/.exec(attrs)?.[1];
    const id = existingId || `sec-${counter}`;
    items.push({ id, index: counter });
    return existingId ? match : `<section class="section${extraClass}" id="${id}"${attrs}>`;
  });

  // 逐段補上標題文字：section-num 當眉標，h2 當章節名
  const blocks = rewritten.split('<section class="section');
  items.forEach((item, position) => {
    const block = blocks[position + 1] || '';
    item.num = /<span class="section-num">([^<]*)<\/span>/.exec(block)?.[1]?.trim() || '';
    item.title = /<h2[^>]*>([\s\S]*?)<\/h2>/.exec(block)?.[1]?.replace(/<[^>]+>/g, '').trim() || '';
  });

  const usable = items.filter(item => item.title);
  if (usable.length < 3) return { bodyHtml, indexHtml: '' };

  const links = usable.map(item => `<li><a href="#${escapeAttr(item.id)}">${
    item.num ? `<span>${item.num}</span>` : ''
  }${item.title}</a></li>`).join('');

  const indexHtml = `<nav class="chapter-index" aria-labelledby="chapter-index-label">
      <p class="chapter-index-label" id="chapter-index-label">本頁章節</p>
      <ol>${links}</ol>
    </nav>`;

  // 放在第一個 .section 之前：每日／城市頁在封面之後，附錄頁在大標之後
  const firstSection = rewritten.indexOf('<section class="section');
  const withIndex = firstSection === -1
    ? rewritten
    : `${rewritten.slice(0, firstSection)}${indexHtml}\n    ${rewritten.slice(firstSection)}`;

  return { bodyHtml: withIndex, indexHtml };
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
}) {
  const path = file => `${pathPrefix}${file}`;
  // 首頁本身就是目錄，資料庫頁已有自己的主題索引，兩者不再重複產生
  const useChapterIndex = chapterIndex && pageKind !== 'home' && !bodyHtml.includes('database-index');
  const pageBody = useChapterIndex ? buildChapterIndex(bodyHtml).bodyHtml : bodyHtml;
  // 標出「你正在看這一頁」：視覺上加點，輔助技術則聽到 current page
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
      <ul><li><a href="${path('index.html#cities')}">城市總覽</a></li>${cityLinks}</ul>
    </details>
    <details class="nav-dropdown${activeNav === 'practical' ? ' nav-dropdown-current' : ''}" name="primary-navigation">
      <summary${currentGroup(activeNav, 'practical')}>實用資訊</summary>
      <ul><li><a href="${path('index.html#practical')}">實用資訊總覽</a></li>${practicalLinks}</ul>
    </details>
  </nav>
  <main class="page" id="main-content">
    ${pageBody}
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>POLSKA 波蘭行 · 2026/10/24–10/31</p>
      <p>票價、開放時間與交通資料查證於 2026-08-09；尚未開賣或會變動的項目已明確標示，實際以官網與已購票券為準。</p>
    </div>
  </footer>
  <script src="${path('assets/nav.js')}" defer></script>
</body>
</html>`;
}

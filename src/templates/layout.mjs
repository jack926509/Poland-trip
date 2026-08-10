function current(activeNav, key) {
  return activeNav === key ? ' aria-current="page"' : '';
}

export function renderLayout({ title, activeNav, bodyHtml, extraHead = '', pathPrefix = '' }) {
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
  <title>${title} · POLSKA 波蘭行</title>
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='8' fill='%232b2723'/%3E%3Ctext x='32' y='44' text-anchor='middle' font-size='38' font-family='serif' font-weight='700' fill='%23f6f1e8'%3EP%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&amp;family=Noto+Sans+TC:wght@400;500;700&amp;family=Inter:wght@400;500;700&amp;display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${path('assets/main.css')}">
  ${extraHead}
</head>
<body>
  <a class="skip-link" href="#main-content">跳至主要內容</a>
  <nav class="nav" aria-label="主要導覽">
    <a class="nav-brand" href="${path('index.html')}"${current(activeNav, 'home')}>POLSKA</a>
    <details class="nav-dropdown${activeNav === 'days' ? ' nav-dropdown-current' : ''}">
      <summary>每日行程</summary>
      <ul><li><a href="${path('index.html#days')}">行程總覽</a></li>${dayLinks}</ul>
    </details>
    <details class="nav-dropdown${activeNav === 'cities' ? ' nav-dropdown-current' : ''}">
      <summary>城市指南</summary>
      <ul>
        <li><a href="${path('index.html#cities')}">城市總覽</a></li>
        <li><a href="${path('city-warszawa.html')}">華沙 Warszawa</a></li>
        <li><a href="${path('city-krakow.html')}">克拉科夫 Kraków</a></li>
        <li><a href="${path('city-wroclaw.html')}">樂斯拉夫 Wrocław</a></li>
        <li><a href="${path('city-poznan.html')}">波茲南 Poznań</a></li>
      </ul>
    </details>
    <details class="nav-dropdown${activeNav === 'practical' ? ' nav-dropdown-current' : ''}">
      <summary>實用資訊</summary>
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
        <li><a href="${path('practical/database.html')}">自由行資料庫</a></li>
      </ul>
    </details>
  </nav>
  <main class="page" id="main-content">
    ${bodyHtml}
  </main>
  <footer class="footer">
    <div class="footer-inner">
      <p>POLSKA 波蘭行 · 2026/10/24–10/31</p>
      <p>票價、開放時間與交通資料查證於 2026-08-09；尚未開賣或會變動的項目已明確標示，實際以官網與已購票券為準。</p>
    </div>
  </footer>
</body>
</html>`;
}

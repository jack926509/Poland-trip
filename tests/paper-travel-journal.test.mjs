import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const read = relativePath => fs.readFileSync(path.join(distDir, relativePath), 'utf8');
const css = () => fs.readFileSync(path.join(distDir, 'assets/main.css'), 'utf8');

test('正式頁面使用紙上旅行誌外框且保留可及性入口', () => {
  const home = read('index.html');
  assert.match(home, /<body class="journal-site journal-home">/);
  assert.match(home, /class="nav journal-masthead"/);
  assert.match(home, /class="journal-edition"/);
  assert.match(home, /<a class="skip-link" href="#main-content">跳至主要內容<\/a>/);
  assert.match(home, /<details class="nav-dropdown[^>]*name="primary-navigation">/);
});

test('長頁保留章節索引、目前頁面與目前導覽群組標示', () => {
  const day = read('day-02.html');
  assert.match(day, /class="chapter-index"/);
  assert.match(day, /<a href="day-02\.html" aria-current="page" class="nav-link-current">Day 2<\/a>/);
  assert.match(day, /<summary aria-current="true">每日行程<\/summary>/);
});

test('頁面保留深色模式中繼設定與非阻斷字型載入', () => {
  const home = read('index.html');
  assert.match(home, /<meta name="color-scheme" content="light">/);
  assert.equal((home.match(/<meta name="theme-color"/g) || []).length, 1);
  assert.match(home, /rel="stylesheet" media="print" onload="this\.media='all'/);
  assert.match(home, /<noscript><link[^>]+fonts\.googleapis\.com[^>]+rel="stylesheet"><\/noscript>/);
});

test('旅行誌視覺契約包含紙色、墨紫、觸控與 reduced motion', () => {
  const source = css();
  assert.match(source, /--paper:\s*#f4eddf/i);
  assert.match(source, /--plum:\s*#493747/i);
  assert.match(source, /\.nav-dropdown\s*>\s*summary[\s\S]*min-height:\s*44px/);
  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(source, /scroll-behavior:\s*auto/);
});

test('首頁是旅行誌封面、8 日目錄與四城攝影章節', () => {
  const home = read('index.html');
  assert.match(home, /<header class="journal-cover">/);
  assert.match(home, /class="journal-cover-photo"[^>]*src="assets\/photos\/warszawa-hero\.webp"/);
  assert.match(home, /alt="華沙城市風景"/);
  assert.match(home, /<ol class="journal-itinerary"/);
  assert.equal((home.match(/class="journal-day-entry"/g) || []).length, 8);
  assert.match(home, /class="journal-city-chapters"/);
  assert.equal((home.match(/class="journal-city-card"/g) || []).length, 4);
  assert.equal((home.match(/src="assets\/photos\/(?:warszawa|krakow|wroclaw|poznan)-hero\.webp"/g) || []).length, 5);
  assert.doesNotMatch(home, /src="assets\/photos\/[^"]+-thumb\.webp"/);
  assert.match(home, /class="journal-toolkit"/);
});

test('每日頁有城市攝影章節且保留現場操作資訊', () => {
  const day = read('day-02.html');
  assert.match(day, /<body class="journal-site journal-day">/);
  assert.match(day, /class="journal-day-cover"/);
  assert.match(day, /src="assets\/photos\/krakow-hero\.webp"/);
  assert.match(day, /class="journal-day-facts"/);
  assert.match(day, /class="table-editorial table-schedule"/);
  assert.match(day, /class="section operation-section"/);
});

test('跨城每日頁使用最右側已知目的地的城市照片', () => {
  assert.match(read('day-06.html'), /src="assets\/photos\/warszawa-hero\.webp"/);
  assert.match(read('day-08.html'), /src="assets\/photos\/warszawa-hero\.webp"/);
});

test('城市頁以授權照片開章且保留 Leaflet 地圖接口', () => {
  const city = read('city-wroclaw.html');
  assert.match(city, /<body class="journal-site journal-city">/);
  assert.match(city, /class="journal-city-cover"/);
  assert.match(city, /src="assets\/photos\/wroclaw-hero\.webp"/);
  assert.match(city, /alt="樂斯拉夫城市風景"/);
  assert.match(city, /data-map-key="wroclaw"/);
  assert.match(city, /class="map-container"/);
});

test('實用頁採旅行誌附錄版式且資料庫接口不變', () => {
  const todos = read('practical/todos.html');
  const database = read('practical/database.html');
  assert.match(todos, /<body class="journal-site journal-practical">/);
  assert.match(todos, /class="journal-appendix-header"/);
  assert.match(database, /class="journal-database"/);
  for (const selector of ['data-db-query', 'data-db-city', 'data-db-category', 'data-db-status', 'data-db-privacy', 'data-db-summary']) {
    assert.ok(database.includes(selector), `資料庫缺少 ${selector}`);
  }
  assert.match(database, /data-db-filter-input="query"/);
  assert.match(database, /data-db-filter-select="city"/);
  assert.match(database, /data-db-clear="filters"/);
  assert.match(database, /src="\.\.\/assets\/database-filter\.js"/);
});

test('單檔版使用旅行誌刊頭並完整封裝 23 個章節', () => {
  const standalone = fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
  assert.match(standalone, /<body class="journal-site journal-standalone">/);
  assert.match(standalone, /POLSKA PAPER TRAVEL JOURNAL/);
  assert.equal((standalone.match(/class="standalone-page"/g) || []).length, 23);
  assert.match(standalone, /<style data-bundled="main\.css">/);
  assert.match(standalone, /<style data-bundled="leaflet\.css">/);
  assert.match(standalone, /<script data-bundled="leaflet\.js">/);
  assert.match(standalone, /<script data-bundled="database-filter\.js">/);
  assert.doesNotMatch(standalone, /href="assets\/main\.css"/);
  assert.doesNotMatch(standalone, /src="\.\.\/assets\/database-filter\.js"/);
});

test('單檔版導覽與下拉連結提供至少 44px 觸控高度', () => {
  const standalone = fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
  assert.match(standalone, /\.standalone-home,\s*\.standalone-menu > summary \{[^}]*min-height:\s*44px/);
  assert.match(standalone, /\.standalone-menu-panel a \{[^}]*min-height:\s*44px/);
  assert.match(standalone, /\.standalone-page-controls a \{[^}]*min-height:\s*44px/);
  assert.match(standalone, /\.standalone-page-controls a:last-child \{[^}]*justify-content:\s*flex-end/);
});

test('單檔版手機刊頭可在兩欄 grid cell 內換行且不再 nowrap 溢出', () => {
  const standalone = fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
  const mobileCss = standalone.match(/@media \(max-width: 640px\) \{([\s\S]*?)@media print/)?.[1];
  assert.ok(mobileCss, '缺少單檔版 max-width: 640px 手機樣式');
  assert.match(mobileCss, /\.standalone-nav \{[^}]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);

  const mobileHomeRule = mobileCss.match(/\.standalone-home \{([^}]*)\}/)?.[1];
  assert.ok(mobileHomeRule, '缺少手機版 standalone-home 專用樣式');
  assert.match(mobileHomeRule, /min-width:\s*0/);
  assert.match(mobileHomeRule, /white-space:\s*normal/);
  assert.match(mobileHomeRule, /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(mobileHomeRule, /white-space:\s*nowrap/);
});

test('必要搜尋資訊與首頁行程摘要字級至少 16px', () => {
  const source = css();
  assert.match(source, /\.site-search-result-copy small,[\s\S]*font-size:\s*1rem/);
  assert.match(source, /\.site-search-map-link\s*\{[^}]*font-size:\s*1rem/);
  assert.match(source, /\.journal-day-date\s*\{[^}]*font-size:\s*1rem/);
  assert.match(source, /\.journal-day-copy small\s*\{[^}]*font-size:\s*1rem/);
  assert.match(source, /nav\.section-heading\s*>\s*a\s*\{[^}]*min-height:\s*44px/);
});

test('深色模式樣式與 meta 已全數移除', () => {
  const source = css();
  const standalone = fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
  const home = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  assert.doesNotMatch(source, /prefers-color-scheme/);
  assert.doesNotMatch(standalone, /prefers-color-scheme/);
  assert.doesNotMatch(home, /prefers-color-scheme/);
  assert.doesNotMatch(source, /color-scheme:\s*dark/);
  assert.match(source, /color-scheme:\s*light/);
});

test('表格儲存格自動帶入 data-label 供手機卡片版顯示欄名', () => {
  const booking = fs.readFileSync(path.join(distDir, 'practical/booking.html'), 'utf8');
  assert.match(booking, /<td[^>]*data-label="路段"/);
  assert.match(booking, /<td[^>]*data-label="票價"/);

  // colspan 的整列訊息不該被硬塞欄名
  const dashboard = fs.readFileSync(path.join(distDir, 'practical/ops-dashboard.html'), 'utf8');
  assert.doesNotMatch(dashboard, /<td colspan="4"[^>]*data-label=/);

  // 手機把每一欄堆疊顯示，並解除 .number 的 nowrap，避免整頁被撐寬
  const source = css();
  assert.match(source, /\.table-editorial td\[data-label\]::before \{[^}]*content:\s*attr\(data-label\)/);
  assert.match(source, /\.table-editorial \.number \{\s*white-space:\s*normal/);
  assert.match(source, /\.table-editorial tbody \{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
});

test('日期捷徑帶得出可比對的當地日期，並提供回頂端按鈕', () => {
  const home = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  assert.match(home, /data-trip-timezone="Europe\/Warsaw"/);
  assert.match(home, /data-trip-date="2026-10-24"/);
  assert.match(home, /data-trip-date="2026-10-31"/);

  const navScript = fs.readFileSync(path.join(distDir, 'assets/nav.js'), 'utf8');
  assert.match(navScript, /Intl\.DateTimeFormat\('en-CA'/);
  assert.match(navScript, /classList\.add\('is-today'\)/);
  assert.match(navScript, /className = 'to-top'/);
});

test('地圖縮放鈕與主題索引達到 44px 觸控高度', () => {
  const source = css();
  assert.match(source, /\.leaflet-touch \.leaflet-bar a\.leaflet-control-zoom-in[\s\S]*?height:\s*44px/);
  assert.match(source, /\.database-index ol a \{[^}]*min-height:\s*44px/);
  assert.match(source, /a\[href\^="tel:"\][\s\S]*?min-height:\s*44px/);
});

test('每日頁封面左欄縮小，且八天共用同一組樣式', () => {
  const source = css();
  assert.match(source, /\.journal-day-header \{\s*grid-template-columns:\s*minmax\(15rem, 0\.55fr\) minmax\(0, 1\.45fr\)/);

  // 城市頁維持原比例，不受影響
  assert.match(source, /\.journal-day-header,\s*\.journal-city-cover \{[^}]*grid-template-columns:\s*minmax\(20rem, 0\.82fr\)/);

  // 八天都走同一個樣板，頁面本身不得帶行內欄寬
  for (let day = 1; day <= 8; day += 1) {
    const html = fs.readFileSync(path.join(distDir, `day-0${day}.html`), 'utf8');
    assert.match(html, /<header class="journal-day-header">/);
    assert.doesNotMatch(html, /journal-day-header"[^>]*style=/);
  }
});

test('多頁與單檔導覽都支援 Escape 關閉選單', () => {
  const navScript = fs.readFileSync(path.join(distDir, 'assets/nav.js'), 'utf8');
  const standalone = fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
  assert.match(navScript, /const closeMenu = \(menu, restoreFocus = false\) => \{[^}]*menu\.open = false/s);
  assert.match(navScript, /addEventListener\('click',[\s\S]*closeMenu\(menu\)/s);
  assert.match(navScript, /event\.key !== 'Escape'[\s\S]*closeMenu\(getOpenMenu\(\), true\)/s);

  assert.match(standalone, /addEventListener\('click',[\s\S]*menu\.removeAttribute\('open'\)/s);
  assert.match(standalone, /event\.key !== 'Escape'[\s\S]*openMenu\.open = false/s);
});

# POLSKA Paper Travel Journal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將既有 23 頁 POLSKA 靜態網站與單檔版改造成方案 C「紙上旅行誌」，同時保留全部行程資料、地圖、篩選、隱私與手機操作契約。

**Architecture:** 保留 `src/data/*.js → src/templates/*.mjs → build.mjs` 的單一資料來源與建置流程。正式版只修改 layout、首頁／每日／城市／實用模板結構、共用 CSS 與單檔外框；原型程式碼、切換器與 `?variant=` 不進正式輸出。

**Tech Stack:** 原生 HTML、CSS、ES modules、Node.js 內建 test runner、靜態建置腳本、Leaflet、原生 `details/summary` 導覽、本機瀏覽器驗收。

**Spec:** `docs/superpowers/specs/2026-08-25-paper-travel-journal-redesign-design.md`

## Global Constraints

- 所有旅遊內容仍只從 `src/data/*.js` 產生；不得直接修改 `dist/` 或 `poland-travel-guide-2026.html`。
- 正式輸出維持正好 23 頁，並保留根目錄單檔版。
- 不修改旅遊事實、票價、地址、營業時間、圖釘狀態或公開／私人資料邊界。
- 只使用現有 `assets/photos/*.webp` 與 `assets/photos/CREDITS.md` 已記錄的授權素材。
- 原型 `prototype/uxui-three-directions/`、方案切換器及 `?variant=` 不得進入正式 build、prepare 或部署輸出。
- 手機驗收寬度為 390px 與 320px；正文至少 16px，主要觸控目標至少 44px，頁面不得水平溢出。
- 必須支援 `prefers-reduced-motion: reduce`、鍵盤焦點、跳至內容連結及描述性圖片替代文字。
- 不推送、不合併、不部署；完成實作與交叉審查後，停在本機讓使用者驗收。

---

### Task 1: 鎖定正式旅行誌外框與視覺契約

**Files:**
- Create: `tests/paper-travel-journal.test.mjs`
- Modify: `src/templates/layout.mjs:5-74`
- Modify: `src/templates/home.mjs:156`
- Modify: `src/styles/main.css:1-389`

**Interfaces:**
- Consumes: 現有 `renderLayout({ title, activeNav, bodyHtml, extraHead, pathPrefix })`
- Produces: `renderLayout({ title, activeNav, bodyHtml, extraHead = '', pathPrefix = '', pageKind = 'practical' }): string`
- Produces: `<body class="journal-site journal-${pageKind}">`、`.journal-masthead`、`.journal-edition`

- [ ] **Step 1: 建立失敗測試，鎖定外框、色票與可及性**

```js
// tests/paper-travel-journal.test.mjs
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
  assert.match(home, /class="journal-masthead"/);
  assert.match(home, /class="journal-edition"/);
  assert.match(home, /<a class="skip-link" href="#main-content">跳至主要內容<\/a>/);
  assert.match(home, /<details class="nav-dropdown[^>]*name="primary-navigation">/);
});

test('旅行誌視覺契約包含紙色、墨紫、觸控與 reduced motion', () => {
  const source = css();
  assert.match(source, /--paper:\s*#f4eddf/i);
  assert.match(source, /--plum:\s*#493747/i);
  assert.match(source, /\.nav-dropdown\s*>\s*summary[\s\S]*min-height:\s*44px/);
  assert.match(source, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(source, /scroll-behavior:\s*auto/);
});
```

- [ ] **Step 2: 執行新測試確認失敗**

Run: `npm run build && node --test tests/paper-travel-journal.test.mjs`

Expected: FAIL，因正式頁面尚無 `journal-site`、`journal-masthead`、`journal-edition` 與新色票。

- [ ] **Step 3: 擴充 layout 介面並建立旅行誌刊頭**

將 `renderLayout` 簽名改為：

```js
export function renderLayout({
  title,
  activeNav,
  bodyHtml,
  extraHead = '',
  pathPrefix = '',
  pageKind = 'practical',
}) {
```

將 `<body>` 與導覽前段改為下列結構；三組既有 `details`、連結與 `nav.js` 載入保持原樣：

```html
<body class="journal-site journal-${pageKind}">
  <a class="skip-link" href="#main-content">跳至主要內容</a>
  <nav class="nav journal-masthead" aria-label="主要導覽">
    <a class="nav-brand" href="${path('index.html')}"${current(activeNav, 'home')}>
      <span>POLSKA</span>
      <small>Paper Travel Journal</small>
    </a>
    <span class="journal-edition" aria-hidden="true">VOL. 2026 · 08 DAYS</span>
    <!-- 保留原本三組 details 導覽 -->
  </nav>
```

`pageKind` 只允許呼叫端傳入固定字串 `home`、`day`、`city`、`practical`；不接受外部輸入。
Task 1 同時將首頁既有 `renderLayout` 呼叫加上 `pageKind: 'home'`，只建立外框類型，不提前改首頁內容結構。

- [ ] **Step 4: 建立正式色票與共用紙本元件**

在 `:root` 使用以下 token，並將現有元件逐一改用 token，不留下不存在的 `--accent-pale`：

```css
:root {
  --paper: #f4eddf;
  --paper-deep: #e7dcc9;
  --paper-light: #fffaf1;
  --ink: #2c2522;
  --ink-soft: #675e58;
  --plum: #493747;
  --plum-soft: #735c70;
  --accent: #a84b32;
  --accent-dark: #783521;
  --accent-pale: #f3dfd5;
  --line: #d4c6b3;
  --line-strong: #8e7e70;
  --red: #a33a32;
  --yellow: #805819;
  --green: #356248;
  --content-width: 1180px;
  --shadow-paper: 0 18px 44px rgb(44 37 34 / 10%);
}
```

加入 `.journal-masthead`、`.nav-brand small`、`.journal-edition`、`.journal-rule`、`.journal-caption`、`.journal-info-strip` 與 `.journal-stamp`。裝飾元素使用 pseudo-element 或 `aria-hidden="true"`，不得進入朗讀順序。

- [ ] **Step 5: 加入 reduced-motion 與焦點守門**

```css
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

保留 `a:focus-visible`、`button:focus-visible`、`summary:focus-visible` 三類焦點，outline 與背景對比至少 3:1；導覽 summary 與選單連結維持 `min-height: 44px`。

- [ ] **Step 6: 執行外框測試與既有完整測試**

Run: `npm run build && node --test tests/paper-travel-journal.test.mjs`

Expected: 新增 2 tests PASS，0 FAIL。

Run: `npm test`

Expected: 全部 tests PASS，23 頁及既有資料契約不變。

- [ ] **Step 7: 提交外框切片**

```bash
git add tests/paper-travel-journal.test.mjs src/templates/layout.mjs src/styles/main.css
git commit -m "feat: 建立紙上旅行誌正式外框"
```

### Task 2: 將首頁改為旅行誌封面與章節目錄

**Files:**
- Modify: `tests/paper-travel-journal.test.mjs`
- Modify: `tests/build.test.mjs:697-760`
- Modify: `src/templates/home.mjs:19-157`
- Modify: `src/styles/main.css`

**Interfaces:**
- Consumes: 現有 `meta`、`days`、`flights`、`cities`、`todoGroups`、`databaseEntries`
- Produces: `.journal-cover`、`.journal-cover-photo`、`.journal-status-strip`、`.journal-itinerary`、`.journal-city-chapters`、`.journal-toolkit`
- Preserves: 8 個 day 連結、4 個 city 連結、14 項待辦、所有 practical 入口

- [ ] **Step 1: 擴充失敗測試，鎖定首頁資訊架構**

```js
test('首頁是旅行誌封面、8 日目錄與四城攝影章節', () => {
  const home = read('index.html');
  assert.match(home, /<header class="journal-cover">/);
  assert.match(home, /class="journal-cover-photo"[^>]*src="assets\/photos\/warszawa-hero\.webp"/);
  assert.match(home, /alt="華沙城市風景"/);
  assert.match(home, /<ol class="journal-itinerary"/);
  assert.equal((home.match(/class="journal-day-entry"/g) || []).length, 8);
  assert.match(home, /class="journal-city-chapters"/);
  assert.equal((home.match(/class="journal-city-card"/g) || []).length, 4);
  assert.match(home, /class="journal-toolkit"/);
});
```

在 `tests/build.test.mjs` 將「手機行程總覽與時間表」拆成兩個契約：首頁檢查 `.journal-itinerary` 的 8 個語意化連結；每日頁仍檢查 `.table-schedule` 卡片欄位標籤。不得刪除原本對 8 天、4 城、practical links 與 14 項待辦的完整性測試。

- [ ] **Step 2: 執行測試確認首頁契約失敗**

Run: `npm run build && node --test tests/paper-travel-journal.test.mjs tests/build.test.mjs`

Expected: 新首頁結構測試 FAIL；既有資料與安全測試仍 PASS。

- [ ] **Step 3: 重寫首頁 hero 為紙上旅行誌封面**

使用 `cities[0]` 的既有華沙圖片，不寫死另一份圖片資料：

```js
const coverCity = cities[0];
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
    <figure class="journal-cover-figure">
      <img class="journal-cover-photo" src="${escapeHtml(coverCity.photo.hero)}" alt="${escapeHtml(coverCity.name)}城市風景" width="1200" height="800">
      <figcaption>${escapeHtml(coverCity.pl)} · ${escapeHtml(coverCity.vibe)}</figcaption>
    </figure>
  </header>`;
```

圖片加入 `width`、`height`、`decoding="async"`；首屏封面圖不加 `loading="lazy"`，其餘城市圖使用 `loading="lazy"`。

- [ ] **Step 4: 將待辦與資料狀態濃縮為資訊條**

`.journal-status-strip` 顯示「14 項待辦」、「已確認／待重查／待確認」三個數字與兩個入口。完整待辦分類內容移到同頁後段 `.journal-todo-notes`，確保既有 14 項名稱與跳脫測試仍通過。

- [ ] **Step 5: 將 8 天表格改為語意化章節目錄**

```js
const dayEntries = days.map(day => `
  <li class="journal-day-entry">
    <a href="day-${String(day.n).padStart(2, '0')}.html">
      <span class="journal-day-number">${String(day.n).padStart(2, '0')}</span>
      <span class="journal-day-date">${escapeHtml(day.date)}</span>
      <span class="journal-day-copy"><b>${escapeHtml(day.title)}</b><small>${escapeHtml(day.city)} · ${escapeHtml(day.headline)}</small></span>
      <span class="${day.mustBook.length ? 'tag-todo' : 'tag-muted'}">${day.mustBook.length ? `待訂 ${day.mustBook.length}` : '無待訂'}</span>
    </a>
  </li>`).join('');
```

目錄使用 `<ol>`，連結覆蓋整列但焦點框不可被 `overflow` 裁掉。

- [ ] **Step 6: 將四城與工具改為攝影章節**

每個 `.journal-city-card` 使用 `city.photo.thumb`、描述性 alt、`city.name`、`city.pl`、`city.vibe` 與既有 city link。`.journal-toolkit` 保留 booking、dining、tickets、transit、shopping、notes、database 等既有入口及數量文案。

- [ ] **Step 7: 完成首頁桌機與手機 CSS**

桌機封面使用 5/7 不對稱網格；8 天目錄使用單欄跨頁式分隔；四城章節使用 2 欄。`@media (max-width: 700px)` 下全部改為單欄，封面圖 `aspect-ratio: 4 / 3`，Day 目錄每列至少 64px，狀態 tag 不壓縮主標題。

- [ ] **Step 8: 執行首頁測試與全套回歸**

Run: `npm run build && node --test tests/paper-travel-journal.test.mjs tests/build.test.mjs`

Expected: 首頁旅行誌測試與既有資料／安全測試全部 PASS。

Run: `npm test`

Expected: 全部 tests PASS，0 FAIL。

- [ ] **Step 9: 提交首頁切片**

```bash
git add tests/paper-travel-journal.test.mjs tests/build.test.mjs src/templates/home.mjs src/styles/main.css
git commit -m "feat: 將首頁改為紙上旅行誌目錄"
```

### Task 3: 將每日行程與城市頁改為攝影章節

**Files:**
- Modify: `tests/paper-travel-journal.test.mjs`
- Modify: `src/templates/day.mjs:86-221`
- Modify: `src/templates/city.mjs:32-193`
- Modify: `build.mjs:378-400`
- Modify: `src/styles/main.css`

**Interfaces:**
- Consumes: `renderDay(day, photoSpotsForDay, operation, city)`，其中 `city.photo.hero` 為既有圖片路徑
- Produces: `.journal-day-cover`、`.journal-day-facts`、`.journal-city-cover`、`.journal-city-story`
- Preserves: `.table-schedule`、`.operation-section`、`.map-container`、地圖 `data-map-key`、Leaflet 初始化腳本

- [ ] **Step 1: 寫入每日與城市章節失敗測試**

```js
test('每日頁有城市攝影章節且保留現場操作資訊', () => {
  const day = read('day-02.html');
  assert.match(day, /<body class="journal-site journal-day">/);
  assert.match(day, /class="journal-day-cover"/);
  assert.match(day, /src="assets\/photos\/krakow-hero\.webp"/);
  assert.match(day, /class="journal-day-facts"/);
  assert.match(day, /class="table-editorial table-schedule"/);
  assert.match(day, /class="section operation-section"/);
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
```

- [ ] **Step 2: 執行測試確認新章節契約失敗**

Run: `npm run build && node --test tests/paper-travel-journal.test.mjs`

Expected: 每日與城市章節測試 FAIL，首頁與外框測試 PASS。

- [ ] **Step 3: 在 build 階段為每日頁選取現有城市圖片**

```js
for (const day of trip.days) {
  const photoSpotsForDay = cities.photoSpots.filter(spot => spot.day === day.n);
  const namedCities = cities.cities.filter(city => day.city.includes(city.name));
  const journalCity = namedCities.at(-1) || cities.cities[0];
  writeHtml(
    `day-${String(day.n).padStart(2, '0')}.html`,
    renderDay(day, photoSpotsForDay, travelDatabase.dayOperations[day.n], journalCity),
  );
}
```

Day 2、4、5、6 取目的地城市；Day 8 因只命中華沙而保留華沙。不要把多哈新增成不存在的城市資料。

- [ ] **Step 4: 擴充 renderDay 並重排頁首**

將簽名改為：

```js
export function renderDay(day, photoSpotsForDay = [], operation = null, city = null) {
```

若 `city?.photo?.hero` 存在，輸出 `.journal-day-cover` 圖片與 figcaption；若缺少圖片，輸出同結構的純色 `.journal-day-cover-fallback`，不得產生 `src="undefined"`。將城市、強度、天氣與類型放入 `.journal-day-facts`，其餘時間表與現場資訊原順序不刪減。呼叫 `renderLayout` 時傳 `pageKind: 'day'`。

- [ ] **Step 5: 重排城市頁首與故事順序**

`.journal-city-cover` 使用 `city.photo.hero` 與 `city.name` alt；將既有 `storyHtml` 移到地圖 section 之前。地圖 container 的 id、class、`data-map-key`、高度與 JS 初始化程式碼不得改名。呼叫 `renderLayout` 時傳 `pageKind: 'city'`。

- [ ] **Step 6: 建立章節 CSS 並保護地圖操作**

`.journal-day-cover`、`.journal-city-cover` 使用圖片與漸層疊字；正文不放在低對比圖片區。手機下圖片 `aspect-ratio: 4 / 3`、facts 單欄或 2×2；`.map-container` 保留既有最小高度與觸控行為，頁面本身不得設定 `overflow-y: hidden`。

- [ ] **Step 7: 執行每日、城市、圖釘與連結回歸**

Run: `npm run build && node --test tests/paper-travel-journal.test.mjs tests/build.test.mjs`

Expected: 新章節 tests PASS；8 個每日頁資料一致、4 城合計 56 圖釘、所有相對連結與 XSS 契約 PASS。

Run: `npm run audit:map-pins`

Expected: 56 個圖釘完成稽核，沒有 invalid；已驗證／待確認計數與實作前一致。

- [ ] **Step 8: 提交每日與城市切片**

```bash
git add tests/paper-travel-journal.test.mjs src/templates/day.mjs src/templates/city.mjs build.mjs src/styles/main.css
git commit -m "feat: 將每日與城市頁改為攝影章節"
```

### Task 4: 統一實用附錄、資料庫與單檔版

**Files:**
- Modify: `tests/paper-travel-journal.test.mjs`
- Modify: `src/templates/practical.mjs`
- Modify: `src/templates/database.mjs:156-225`
- Modify: `build.mjs:126-358`
- Modify: `src/styles/main.css`

**Interfaces:**
- Consumes: 既有 practical renderers、database toolbar data attributes、standalone bundler
- Produces: `journal-practical` body class、`.journal-appendix-header`、`.journal-database`、紙上旅行誌單檔刊頭
- Preserves: `data-db-*` selectors、`aria-live`、ID／for／ARIA 前綴改寫、23 個 standalone sections

- [ ] **Step 1: 寫入附錄與單檔版失敗測試**

```js
test('實用頁採旅行誌附錄版式且資料庫接口不變', () => {
  const todos = read('practical/todos.html');
  const database = read('practical/database.html');
  assert.match(todos, /<body class="journal-site journal-practical">/);
  assert.match(todos, /class="journal-appendix-header"/);
  assert.match(database, /class="journal-database"/);
  for (const selector of ['data-db-query', 'data-db-city', 'data-db-category', 'data-db-status', 'data-db-privacy', 'data-db-summary']) {
    assert.ok(database.includes(selector), `資料庫缺少 ${selector}`);
  }
});

test('單檔版使用旅行誌刊頭並完整封裝 23 個章節', () => {
  const standalone = fs.readFileSync(path.resolve('poland-travel-guide-2026.html'), 'utf8');
  assert.match(standalone, /<body class="journal-site journal-standalone">/);
  assert.match(standalone, /POLSKA PAPER TRAVEL JOURNAL/);
  assert.equal((standalone.match(/class="standalone-page"/g) || []).length, 23);
  assert.match(standalone, /<style data-bundled="main\.css">/);
  assert.doesNotMatch(standalone, /href="assets\/main\.css"/);
  assert.doesNotMatch(standalone, /src="\.\.\/assets\/database-filter\.js"/);
});
```

- [ ] **Step 2: 執行測試確認附錄契約失敗**

Run: `npm run build && node --test tests/paper-travel-journal.test.mjs`

Expected: 附錄與單檔新結構 FAIL；前 3 個 Task 的測試 PASS。

- [ ] **Step 3: 統一 practical renderer 的附錄頁首**

在 `practical.mjs` 新增純模板 helper：

```js
function renderAppendixHeader({ kicker, title, dek }) {
  return `<header class="journal-appendix-header">
    <span class="section-num">${escapeHtml(kicker)}</span>
    <h1>${escapeHtml(title)}</h1>
    <p class="hero-dek">${escapeHtml(dek)}</p>
  </header>`;
}
```

每個 practical renderer 以固定、程式內定義的 kicker/title/dek 呼叫；資料文字仍使用既有跳脫 helper。所有 `renderLayout` 呼叫加入 `pageKind: 'practical'`，不改輸入資料介面與既有表格內容。

- [ ] **Step 4: 將資料庫頁改為附錄索引版式**

`renderDatabase` 外層加入 `.journal-database`，hero 改用 `.journal-appendix-header` 等價結構。保留 `db-query`、`db-city`、`db-category`、`db-status`、`db-privacy`、`db-clear`、`database-result-summary`、`database-empty` 的 id 與全部 `data-db-*`。

- [ ] **Step 5: 同步單檔版外框但不碰 bundling 邏輯**

只修改 `buildStandalone()` 產出的展示結構與 inline wrapper CSS：

```html
<body class="journal-site journal-standalone">
  <a class="skip-link" href="#page-index">跳至旅程首頁</a>
  <nav class="standalone-nav journal-masthead" aria-label="單檔版目錄">
    <a class="standalone-home" href="#page-index">POLSKA PAPER TRAVEL JOURNAL</a>
    <!-- 保留三組 standalone-menu -->
  </nav>
```

`bundlePage()` 對 href、id、for、`aria-labelledby`、`aria-describedby` 的改寫，以及資料庫 script 移除／嵌入流程不得修改。

- [ ] **Step 6: 建立附錄與單檔響應式 CSS**

附錄頁以較窄閱讀欄、索引細線與紙張層次呈現；資料庫在桌機維持多欄，700px 以下所有 filter 為單欄、input/select/button 高度至少 44px。單檔 sticky menu 在 640px 以下保留 2 欄入口與可捲動 panel，不遮住目前章節標題。

- [ ] **Step 7: 執行完整自動驗收**

Run: `env -u NODE_OPTIONS ./verify.sh`

Expected: build、全部 Node tests、map audit、連結／安全／單檔契約全數 PASS，0 FAIL。

Run: `git diff --check`

Expected: 無空白錯誤。

- [ ] **Step 8: 提交附錄與單檔切片**

```bash
git add tests/paper-travel-journal.test.mjs src/templates/practical.mjs src/templates/database.mjs build.mjs src/styles/main.css
git commit -m "feat: 統一旅行誌附錄與單檔版"
```

### Task 5: 真實瀏覽器驗收、交叉審查與使用者交付

**Files:**
- Create: `docs/verification/2026-08-25-paper-travel-journal-results.md`
- Create: `docs/reviews/2026-08-25-paper-travel-journal-handoff.md`
- Modify: `README.md:1-8`

**Interfaces:**
- Consumes: 完成 Task 1–4 的正式 build 與 `env -u NODE_OPTIONS ./verify.sh`
- Produces: 可重現的桌機／手機／單檔驗收紀錄，以及另一個 AI 可直接審查的交接包

- [ ] **Step 1: 更新 README 的正式設計與驗收說明**

將開頭改為：

````markdown
# POLSKA — 2026 波蘭四城紙上旅行誌

23 頁資料驅動靜態旅行誌：8 天行程、四城攝影章節與地圖、訂票待辦、實用附錄、資料更新儀表板及自由行資料庫。內容只從 `src/data/*.js` 產生，請勿直接修改 `dist/` 或根目錄單檔版。

正式驗收：

```bash
env -u NODE_OPTIONS ./verify.sh
```
````

- [ ] **Step 2: 執行最終自動驗收並記錄原始結果**

Run: `env -u NODE_OPTIONS ./verify.sh`

Expected: 全數 PASS，0 FAIL；記錄測試總數、23 頁 build 訊息、圖釘稽核結果與執行時間到 verification 文件。

- [ ] **Step 3: 從專案根目錄啟動本機正式站**

Run: `python3 -m http.server 8915`

Expected: `http://127.0.0.1:8915/dist/index.html` 與 `http://127.0.0.1:8915/poland-travel-guide-2026.html` 回應 200。

- [ ] **Step 4: 在 1280×900 驗收正式多頁版**

依序檢查首頁、Day 2、樂斯拉夫城市頁、待辦頁與自由行資料庫：

- 首頁有封面照片、8 個 Day、4 個城市、14 項待辦與全部實用入口。
- Day 2 有克拉科夫照片、完整時間表、現場地址、風險與晚間準備。
- 城市頁照片正常、Leaflet 地圖與圖釘可見。
- 資料庫關鍵字搜尋、城市／類別／狀態／公開性篩選、清除與空狀態可操作。
- 每頁 `console error === 0`，所有圖片 `complete && naturalWidth > 0`。

- [ ] **Step 5: 在 390×844 與 320×844 驗收手機版**

對首頁、Day 2、城市地圖與資料庫逐頁檢查：

```js
({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
  imagesLoaded: [...document.images].every(image => image.complete && image.naturalWidth > 0),
})
```

Expected: 兩個寬度均 `scrollWidth === clientWidth`、圖片載入成功、主要操作高度至少 44px、選單在內容上層、時間表不需水平滑動、快速篩選後焦點仍在按鈕且不叫出鍵盤。

- [ ] **Step 6: 驗收鍵盤、reduced motion 與單檔版**

使用 Tab／Enter／Escape 操作三組導覽與資料庫；焦點框全程可見。模擬 `prefers-reduced-motion: reduce` 後確認內容完整。單檔版切換至少首頁、Day 2、城市、資料庫四章，hash、前後頁、地圖 resize 與篩選皆正常；列印預覽顯示所有章節。

- [ ] **Step 7: 寫入 verification 文件**

文件逐列記錄：網址、viewport、核心動作、預期、實際、console errors、圖片狀態、overflow 結果。若任何項目未通過，狀態寫「未完成」並回到對應 Task 修正，不得以說明代替驗收。

- [ ] **Step 8: 建立交叉審查交接包**

`docs/reviews/2026-08-25-paper-travel-journal-handoff.md` 必須包含：

1. `git diff main --name-only` 的實際改動檔清單。
2. 本規格第 8 節七項白話驗收條件。
3. 實作者風險提示：首頁資訊密度、城市照片 crop、單檔 ID／ARIA 改寫、手機地圖捲動與資料庫焦點。
4. `env -u NODE_OPTIONS ./verify.sh` 與瀏覽器驗收的實際證據位置。

將 diff、驗收條件與風險提示交給另一個 AI；審查者必須實跑驗收、以 `檔案:行號` 回報 finding，或明確列出已檢查且無發現的範圍。

- [ ] **Step 9: 提交驗收與交接文件**

```bash
git add README.md docs/verification/2026-08-25-paper-travel-journal-results.md docs/reviews/2026-08-25-paper-travel-journal-handoff.md
git commit -m "docs: 記錄紙上旅行誌驗收與審查交接"
```

- [ ] **Step 10: 停在本機交由使用者驗收**

提供本機首頁與單檔版網址，請使用者實際完成「首頁 → Day 2 → 城市地圖 → 資料庫搜尋」核心路徑。沒有使用者新的明確確認，不執行 push、merge 或部署。

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-25-paper-travel-journal-redesign.md`. Execution must use `superpowers:executing-plans` task-by-task in the current session; this專案依 `DEVELOPMENT.md` 要求在每個切片後測試與提交，完成後再交由另一個 AI 交叉審查。不得在實作同一批改動時由同一個 AI 自行宣稱審查完成。

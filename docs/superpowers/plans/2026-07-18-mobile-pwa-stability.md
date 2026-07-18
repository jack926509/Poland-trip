# POLSKA 手機 PWA 穩定化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把既有 `B_Companion` 建立為啟動、更新與離線行為穩定的正式手機 PWA，同時維持桌機分章雜誌。

**Architecture:** `mobile.html` 成為直接掛載手機 React 應用的獨立殼，根入口繼續依 768 px 掛載桌機或手機。Manifest 保留 `id: "./"` 並把啟動位置改到手機殼；單一 Service Worker precache 雙殼並依 navigation 路徑選擇離線 fallback。

**Tech Stack:** 靜態 HTML、React 18 預編譯 bundle、原生 JavaScript、Service Worker、Web App Manifest、Node `node:test`。

## Global Constraints

- `redesign/data.js` 是桌機與手機日期、日次、交通、票價及訂票的唯一資料來源。
- `mobile.html` 永遠掛載 `B_Companion`，不依螢幕寬度切換桌機版。
- Manifest `id` 維持 `./`，`start_url` 使用 `./mobile.html`。
- Cache 版本統一升級為 `polska-v16`，不得混用 v15、v16 資產網址。
- Service Worker 不自動 `skipWaiting()`；只有使用者確認更新後才切換。
- 不改造手機四分頁 UI，不新增登入、後端、資料庫、同步或推播。
- 不刪除 archive 或舊入口檔案；不合併、推送或部署。

---

### Task 1: 手機入口與 Manifest 失敗契約

**Files:**
- Modify: `tests/entrypoints.test.mjs`

**Interfaces:**
- Consumes: 現有 `mobile.html`、`manifest.json`、`legacy-redirect.js`。
- Produces: 手機正式殼、PWA 啟動位置及舊入口的可執行契約。

- [ ] **Step 1: 改寫入口測試，要求手機殼直接載入**

測試必須要求 `mobile.html` 包含以下資產與掛載程式，且不含 `legacy-redirect.js`：

```js
for (const asset of [
  'redesign/pwa-core.js?v=polska-v16',
  'redesign/data.js?v=polska-v16',
  'redesign/dist/B-companion.js?v=polska-v16',
  'pwa-register.js?v=polska-v16',
]) assert.match(mobile, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
assert.match(mobile, /ReactDOM\.createRoot/);
assert.match(mobile, /B_Companion/);
assert.doesNotMatch(mobile, /legacy-redirect\.js/);
```

Manifest 測試要求：

```js
assert.equal(manifest.id, './');
assert.equal(manifest.start_url, './mobile.html');
assert.equal(today.url, './mobile.html#top');
assert.equal(tickets.url, './mobile.html#B-tickets');
```

- [ ] **Step 2: 執行測試並確認因現況契約而失敗**

Run: `node --test tests/entrypoints.test.mjs`

Expected: FAIL，原因為 `mobile.html` 仍是轉址頁、Manifest 仍指向根入口。

- [ ] **Step 3: 暫不改正式檔，提交失敗契約不成立；繼續 Task 2 實作後一併提交**

---

### Task 2: 建立穩定的手機正式殼

**Files:**
- Modify: `mobile.html`
- Modify: `tests/entrypoints.test.mjs`

**Interfaces:**
- Consumes: `window.TRIP`、`window.B_Companion`、既有 React vendor 檔與 PWA 註冊器。
- Produces: 可直接瀏覽與安裝啟動的 `mobile.html`。

- [ ] **Step 1: 以根入口的手機資產建立最小手機殼**

`mobile.html` 必須包含：

```html
<link rel="manifest" href="manifest.json">
<link rel="stylesheet" href="redesign/tokens.css?v=polska-v16">
<link rel="stylesheet" href="redesign/B-companion.css?v=polska-v16">
<a class="skip-link" href="#app-main">跳到主要內容</a>
<div id="root"></div>
<noscript>手機旅伴需要 JavaScript；你仍可返回 <a href="./">POLSKA 網頁版</a>。</noscript>
```

掛載程式先驗證資料與 bundle：

```js
const root = document.getElementById('root');
try {
  if (!window.TRIP || !Array.isArray(window.TRIP.days) || window.TRIP.days.length !== 8 || typeof window.B_Companion !== 'function') {
    throw new Error('mobile app data unavailable');
  }
  ReactDOM.createRoot(root).render(React.createElement(B_Companion));
}
catch (error) {
  root.innerHTML = '<main id="app-main"><h1>行程資料載入失敗，請重新整理</h1><p>若問題持續，請確認網路連線後再試一次。</p></main>';
}
```

- [ ] **Step 2: 執行入口與既有 UI 測試**

Run: `node --test tests/entrypoints.test.mjs tests/ui-contract.test.mjs`

Expected: 手機殼行為 PASS；Manifest 測試仍 FAIL。

- [ ] **Step 3: 提交手機殼**

```bash
git add mobile.html tests/entrypoints.test.mjs
git commit -m "feat: 建立手機 PWA 正式入口"
```

---

### Task 3: Manifest 與舊入口相容

**Files:**
- Modify: `manifest.json`
- Modify: `legacy-redirect.js`
- Modify: `desktop.html`
- Modify: `app-preview.html`
- Modify: `tests/entrypoints.test.mjs`

**Interfaces:**
- Consumes: 目前頁面的 pathname、search、hash。
- Produces: `buildLegacyTarget(location)` 可測試函式及兩個舊入口的正確導向。

- [ ] **Step 1: 補兩種舊入口的失敗測試**

```js
assert.equal(
  redirect('desktop.html?day=3#logistics'),
  'https://jack926509.github.io/Poland-trip/?day=3&view=desktop#logistics',
);
assert.equal(
  redirect('app-preview.html?day=3#B-tickets'),
  'https://jack926509.github.io/Poland-trip/mobile.html?day=3&view=mobile#B-tickets',
);
```

- [ ] **Step 2: 執行入口測試確認導向尚未分流**

Run: `node --test tests/entrypoints.test.mjs`

Expected: FAIL，舊入口目前都回根網址。

- [ ] **Step 3: 實作 pathname 導向並保留 query/hash**

`legacy-redirect.js` 依檔名選擇目標，使用 `URLSearchParams.set('view', ...)`，不得用字串拼接 query。

- [ ] **Step 4: 更新 Manifest**

把 `start_url` 與 shortcuts 改為手機殼，但 `id`、`scope`、名稱、圖示、顏色與 orientation 保持不變。

- [ ] **Step 5: 執行入口測試**

Run: `node --test tests/entrypoints.test.mjs`

Expected: PASS。

- [ ] **Step 6: 提交 Manifest 與相容導向**

```bash
git add manifest.json legacy-redirect.js desktop.html app-preview.html tests/entrypoints.test.mjs
git commit -m "feat: 固定手機 PWA 啟動與舊入口導向"
```

---

### Task 4: 雙殼離線 Service Worker

**Files:**
- Modify: `sw.js`
- Modify: `index.html`
- Modify: `mobile.html`
- Modify: `tests/sw-contract.test.mjs`
- Modify: `tests/entrypoints.test.mjs`

**Interfaces:**
- Consumes: navigation request URL pathname。
- Produces: `navigationFallback(url)` 選擇 `./mobile.html` 或 `./`；所有核心資產統一使用 `polska-v16`。

- [ ] **Step 1: 補雙殼 precache 與 fallback 失敗測試**

測試要求 `PRECACHE_URLS` 包含：

```js
[
  './', './mobile.html',
  './desktop/desktop.css?v=polska-v16',
  './desktop/desktop-app.js?v=polska-v16',
  './desktop/chapters.js?v=polska-v16',
  './redesign/data.js?v=polska-v16',
  './redesign/dist/B-companion.js?v=polska-v16',
]
```

離線 `mobile.html` navigation 回傳 mobile shell；離線根 navigation 回傳 root shell。

- [ ] **Step 2: 執行 Service Worker 測試確認失敗**

Run: `node --test tests/sw-contract.test.mjs tests/entrypoints.test.mjs`

Expected: FAIL，現況只有根殼 fallback 且仍使用 v15。

- [ ] **Step 3: 實作雙殼 fallback 與 v16 統一版本**

```js
function navigationFallback(url) {
  return url.pathname.endsWith('/mobile.html') ? './mobile.html' : './';
}
```

Navigation catch 改為：

```js
fetch(request).catch(() => caches.match(navigationFallback(url)))
```

同步更新 `index.html`、`mobile.html`、`sw.js` 的正式資產 query 至 `polska-v16`。

- [ ] **Step 4: 執行 Service Worker、入口與更新生命週期測試**

Run: `node --test tests/sw-contract.test.mjs tests/entrypoints.test.mjs`

Expected: PASS，且既有 update lifecycle 測試仍通過。

- [ ] **Step 5: 提交雙殼離線策略**

```bash
git add sw.js index.html mobile.html tests/sw-contract.test.mjs tests/entrypoints.test.mjs
git commit -m "feat: 加入桌機與手機雙殼離線 fallback"
```

---

### Task 5: 發布、文件與完整驗收

**Files:**
- Modify: `README.md`
- Modify: `docs/verification/2026-07-18-desktop-segmented-magazine-results.md`
- Create: `docs/verification/2026-07-18-mobile-pwa-stability-results.md`
- Create: `docs/reviews/2026-07-18-mobile-pwa-stability-handoff.md`

**Interfaces:**
- Consumes: 完成的雙介面入口與 `_site` allowlist。
- Produces: 可供獨立審查者重跑的驗收證據與風險交接。

- [ ] **Step 1: 執行完整自動驗收**

Run: `./verify.sh`

Expected: 全部 PASS、0 fail；build 後 bundle 無未提交差異。

- [ ] **Step 2: 從空目錄驗證發布產物**

Run:

```bash
output="$(mktemp -d)/site"
mkdir -p "$output"
./prepare-site.sh "$output"
```

Expected: `_site` 等價輸出包含 `mobile.html`、雙介面資產與 v16 Service Worker，且不包含 archive、tests、docs。

- [ ] **Step 3: 實際瀏覽器驗收**

驗證 390、320 px 根入口及 `mobile.html`：四分頁、Drawer、交通 Sheet、訂票、跳到主要內容、無水平溢出與 console 0 error。另驗證 768、1024、1440 px 桌機根入口未退化。

- [ ] **Step 4: 記錄驗收與交接**

文件需列出測試數量、五種寬度、PWA ready 狀態、離線 fallback 自動測試、已知限制，以及「未經使用者確認不可合併／推送／部署」。

- [ ] **Step 5: 提交驗收文件**

```bash
git add README.md docs/verification docs/reviews
git commit -m "docs: 記錄手機 PWA 穩定化驗收"
```

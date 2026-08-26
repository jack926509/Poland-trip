# 手機優先全站旅遊搜尋 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 23 個多頁頁面與單檔版加入手機優先的全站旅遊搜尋，支援火車、餐廳、地圖、城市快捷分類。

**Architecture:** 建置期從現有公開資料與已渲染頁面產生靜態索引，由共用 layout 輸出搜尋元件與 JSON。多頁版載入共用 `site-search.js`，單檔版則嵌入同一份程式與改寫後連結。

**Tech Stack:** Node.js ESM、資料驅動 HTML 模板、原生 CSS、原生 JavaScript、Node test runner。

**Spec:** `docs/superpowers/specs/2026-08-26-mobile-site-search-design.md`

## Global Constraints

- 只索引公開網站內容，不引入護照、保險、付款、訂單號或私人住址。
- 輸入框至少 48 px；其他互動元素至少 44 px。
- 不新增第三方套件、動畫、網路搜尋或搜尋記錄。
- 維持 GitHub Pages 子路徑相對連結、單檔 bundling、Leaflet 地圖、資料庫篩選與手機無溢出契約。

---

### Task 1: 搜尋索引建置器

**Files:**
- Create: `src/search/site-search-index.mjs`
- Create: `tests/site-search.test.mjs`
- Modify: `build.mjs`

**Interfaces:**
- Consumes: `trip.days`, `trip.trains`, `cities.cities`, `cities.cityStories`, `cities.mapPins`, `dining.cityDining`, `dining.cityFood`, `dining.foodBackup`, `dining.verifiedRestaurantHours`
- Produces: `buildTravelSearchRecords(data): SearchRecord[]`, `buildPageSearchRecords(pages): SearchRecord[]`, `serializeSearchIndex(records): string`

- [x] **Step 1: 寫索引建置失敗測試**

  在 `tests/site-search.test.mjs` 用手寫小型 fixture 斷言：火車、餐廳、地圖、城市、行程都有結果；重複餐廳依城市＋店名去重；私人字串不會進入序列化索引。

- [x] **Step 2: 執行測試並確認因缺少 module 失敗**

  Run: `node --test tests/site-search.test.mjs`

  Expected: FAIL，原因為 `src/search/site-search-index.mjs` 尚不存在。

- [x] **Step 3: 實作最小索引建置器**

  建立 `buildTravelSearchRecords`，產生穩定 `id/type/typeLabel/title/meta/summary/href/mapUrl/searchText` 欄位；用 `normalizeText()` 移除多餘空白並小寫化搜尋文字；不傳入 `travelDatabase` 私人條目。

- [x] **Step 4: 在建置器產生全站索引**

  `build.mjs` 先寫完 23 頁，再從每頁 `<main>` 取出公開文字補上頁級記錄，與旅遊記錄合併後傳給下一階段。

- [x] **Step 5: 執行索引測試確認通過**

  Run: `node --test tests/site-search.test.mjs`

  Expected: PASS，且實際資料至少有 5 筆火車、4 座城市與 56 個地圖圖釘。

### Task 2: 共用搜尋元件與多頁版互動

**Files:**
- Modify: `src/templates/layout.mjs`
- Create: `src/scripts/site-search.js`
- Modify: `src/styles/main.css`
- Modify: `build.mjs`
- Modify: `tests/site-search.test.mjs`

**Interfaces:**
- Consumes: `renderLayout()` 輸出的搜尋元件、`data-search-path-prefix` 與 `__SITE_SEARCH_INDEX__` 佔位字串
- Produces: `[data-site-search]` 互動元件、`assets/site-search.js`、最多 8 筆可鍵盤操作結果

- [x] **Step 1: 寫多頁輸出失敗測試**

  斷言 23 頁皆包含可見 label、`type="search"`、四個 `data-search-category`、`aria-live="polite"`、正確相對路徑的 `site-search.js`，且搜尋 JSON 不含 `</script>` 注入邊界。

- [x] **Step 2: 重建並確認輸出測試失敗**

  Run: `node build.mjs && node --test tests/site-search.test.mjs`

  Expected: FAIL，原因為頁面尚無全站搜尋元件。

- [x] **Step 3: 實作 layout 元件與安全 JSON 嵌入**

  在導覽下輸出搜尋列、快捷分類、摘要、結果區與無 JS 降級連結；元件保留 `__SITE_SEARCH_INDEX__` 佔位與當頁 `pathPrefix`，`build.mjs` 再對 `<` 與 script 邊界字元安全編碼後注入索引。

- [x] **Step 4: 實作瀏覽器搜尋互動**

  `site-search.js` 讀取當頁 JSON，依標題完全命中、標題部分命中、`searchText` 命中排序；輸出最多 8 筆；支援分類、清除、Escape、`aria-pressed` 與結果公告。所有動態文字使用 DOM `textContent`，不使用 `innerHTML` 插入資料。

- [x] **Step 5: 實作紙上旅行誌手機優先樣式**

  在 `main.css` 用現有色彩與字體 token；搜尋框最小 48 px，其他操作最小 44 px；390 px 時單欄結果、滿寬輸入、兩列或可換行分類；不新增動畫、漸層或水平捲軸。

- [x] **Step 6: 執行多頁輸出測試確認通過**

  Run: `node build.mjs && node --test tests/site-search.test.mjs`

  Expected: PASS，且 `dist/assets/site-search.js` 存在。

### Task 3: 單檔版整合

**Files:**
- Modify: `build.mjs`
- Modify: `tests/site-search.test.mjs`

**Interfaces:**
- Consumes: 多頁搜尋索引、`site-search.js`、`standalonePageId(relativePath)`
- Produces: 單檔版搜尋元件與只使用 `#page-*` 的結果連結

- [x] **Step 1: 寫單檔失敗測試**

  斷言單檔只有一個全站搜尋元件，嵌入 `site-search.js`，不含 `src="assets/site-search.js"`，所有站內結果 href 都以 `#page-` 開頭。

- [x] **Step 2: 執行單檔測試並確認失敗**

  Run: `node build.mjs && node --test tests/site-search.test.mjs`

  Expected: FAIL，原因為單檔刊頭尚未嵌入搜尋。

- [x] **Step 3: 改寫單檔索引與嵌入程式**

  將 `relative/page.html#anchor` 改為 `#page-relative-page--anchor`，將無 anchor 連結改為 `#page-relative-page`；單檔刊頭下輸出同一搜尋元件，內嵌程式緊接現有單檔導覽程式。

- [x] **Step 4: 執行單檔測試確認通過**

  Run: `node build.mjs && node --test tests/site-search.test.mjs`

  Expected: PASS，且多頁與單檔索引記錄數一致。

### Task 4: 完整驗收與紀錄

**Files:**
- Create: `docs/verification/2026-08-26-mobile-site-search-results.md`
- Modify: `docs/superpowers/plans/2026-08-26-mobile-site-search.md`

**Interfaces:**
- Consumes: 已建置的 `dist/`、`poland-travel-guide-2026.html`、本機預覽伺服器
- Produces: 自動驗收、桌面／手機瀏覽器驗收、交叉審查紀錄

- [x] **Step 1: 執行完整自動驗收**

  Run: `env -u NODE_OPTIONS ./verify.sh`

  Expected: build、全部 Node tests 與地圖圖釘稽核皆通過，且 23 頁數不變。

- [x] **Step 2: 瀏覽器驗收多頁版**

  以 390×844 開啟 `dist/index.html`，測試「火車」、「U Fukiera」、「小矮人」、四類快捷分類與 Escape；測量輸入框／按鈕，檢查水平溢出與 console error。

- [x] **Step 3: 瀏覽器驗收單檔版**

  以 390×844 與 1280 px 開啟 `poland-travel-guide-2026.html`，搜尋火車與餐廳，點選結果確認只顯示正確章節並滾到對應 anchor。

- [x] **Step 4: 寫驗收紀錄與回填計畫狀態**

  在驗收紀錄填寫指令、通過數、視窗、搜尋範例、觸控尺寸、溢出、console 與未完成項；將本計畫的核取方塊全部改為 `[x]`。

- [x] **Step 5: 交叉審查與收尾提交**

  提供 diff、本規格的驗收條件與風險提示（單檔 href 改寫、索引私密性、手機觸控尺寸）給獨立 AI 審查；修正 finding 後重跑完整驗收再 commit，不 push、不部署。

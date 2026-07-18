# POLSKA 桌機分章雜誌 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立桌機分章雜誌，並維持目前手機 PWA 行為。

**Architecture:** 根網址依 768 px 或 `view` query 掛載桌機原生 JavaScript 介面或既有 `B_Companion`。`desktop/desktop-app.js` 的路由與資料工具可由 Node VM 單獨測試；`desktop/chapters.js` 只放非核心旅程文章。

**Tech Stack:** 靜態 HTML、原生 JavaScript、CSS、Node `node:test`、React 18 手機 PWA。

## Global Constraints

- `redesign/data.js` 是日期、Day 1–8、交通、票價與訂票資料的唯一來源。
- 桌機為大於等於 768 px 或 `?view=desktop`；手機為小於 768 px 或 `?view=mobile`。
- 不改造 `mobile.html`、manifest、`sw.js`、`pwa-register.js` 或手機 UI。
- 未知 hash 回到 `#overview`；Day 低於 1 回 Day 1，高於 8 回 Day 8。
- 不合併、推送或部署；每個功能切片都先測試後實作並提交。

---

### Task 1: 桌機路由與資料模型

**Files:** Create `desktop/desktop-app.js`, `desktop/chapters.js`, `tests/desktop-router.test.mjs`, `tests/desktop-content.test.mjs`.

**Interfaces:** `globalThis.PolskaDesktop` 輸出 `CHAPTERS`、`normalizeRoute(hash)`、`nextRoute(route, direction)`、`buildDayModel(trip, dayNumber)`、`buildLogisticsModel(trip)`、`buildBookingsModel(trip)`、`hasDuplicatedCoreTripData(source)`。

- [ ] 寫失敗測試：`normalizeRoute('#itinerary/day-9')` 回傳 Day 8；未知 hash 回傳 `#overview`；`buildDayModel(trip, 3).steps === trip.days[2].steps`；文章檔不含 `dep:`、`arr:`、`price:`。
- [ ] 執行 `node --test tests/desktop-router.test.mjs tests/desktop-content.test.mjs`，預期因模組不存在而 FAIL。
- [ ] 實作純函式與只含城市／文化／實用資訊的 `POLSKA_DESKTOP_CHAPTERS`。
- [ ] 重跑同一命令，預期 PASS；提交 `feat: 建立桌機分章路由與資料契約`。

### Task 2: 雜誌殼層與可存取互動

**Files:** Create `desktop/desktop.css`; modify `desktop/desktop-app.js`, `tests/desktop-content.test.mjs`.

**Interfaces:** `mountDesktopApp(root, options)` 產生單一 `main`、七個導覽按鈕、Day 1–8 控制項與可聚焦的 `h1`／`h2`。

- [ ] 寫失敗測試：程式含 `aria-current`、`heading.focus()`；CSS 含紅白國旗線、郵票章、城市座標與桌機斷點。
- [ ] 執行 `node --test tests/desktop-content.test.mjs`，預期 FAIL。
- [ ] 實作 Masthead、紅白旗線、`POLSKA` 郵票章、低調紋章分隔、固定章節導覽與單一內容區；切換時更新 hash、`aria-current` 及焦點。
- [ ] 重跑測試，預期 PASS；提交 `feat: 加入 POLSKA 桌機雜誌殼層`。

### Task 3: 根入口分流與手機回歸保護

**Files:** Modify `index.html`, `tests/entrypoints.test.mjs`, `tests/ui-contract.test.mjs`.

**Interfaces:** 桌機載入 `desktop/desktop.css`、`desktop/chapters.js`、`desktop/desktop-app.js`；手機仍載入 React、`B_Companion` 和既有 PWA register。

- [ ] 先改入口測試，要求 `matchMedia('(min-width: 768px)')`、`searchParams.get('view')`、三個桌機資產、`B_Companion` 及「行程資料載入失敗，請重新整理」。
- [ ] 執行 `node --test tests/entrypoints.test.mjs tests/ui-contract.test.mjs`，預期 FAIL。
- [ ] 改造 `index.html`：共用資料載入完成後，依 query 或寬度掛載桌機或既有手機；桌機資料缺失顯示指定錯誤，不留空白殼。
- [ ] 重跑測試與 `./build.sh`，預期 PASS；提交 `feat: 根入口分流至桌機雜誌與既有手機 PWA`。

### Task 4: 發布 allowlist、文件與完整自動驗收

**Files:** Modify `prepare-site.sh`, `verify.sh`, `tests/deploy-contract.test.mjs`, `README.md`.

- [ ] 先讓部署測試要求 `_site/desktop/desktop.css`、`desktop-app.js`、`chapters.js` 存在，且 `archive`、`tests`、`docs`、`.superpowers` 不存在。
- [ ] 執行 `node --test tests/deploy-contract.test.mjs`，預期 FAIL。
- [ ] 更新 `prepare-site.sh` 只複製三個桌機正式檔；`verify.sh` 對兩個桌機 JS 加入 `node --check`；README 說明雙介面與單一資料來源。
- [ ] 執行 `./verify.sh` 與空目錄 `./prepare-site.sh`，預期全數 PASS；提交 `build: 發布桌機分章雜誌資產`。

### Task 5: 瀏覽器驗收與交叉審查交接

**Files:** Create `docs/verification/2026-07-18-desktop-segmented-magazine-results.md`, `docs/reviews/2026-07-18-desktop-segmented-magazine-handoff.md`.

- [ ] 在本機 HTTP 服務驗證 1440、1024、768 px 的章節、Day 1–8、hash、返回鍵、方向鍵、焦點與無水平溢出。
- [ ] 在 390、320 px 驗證既有四分頁 PWA 與 `?view=desktop`／`?view=mobile`。
- [ ] 記錄每個尺寸、網址、結果與 console 錯誤數；交接文件列出 diff、成功標準與根入口分流／PWA 快取風險。
- [ ] 提交 `docs: 記錄桌機雜誌驗收與審查交接`。

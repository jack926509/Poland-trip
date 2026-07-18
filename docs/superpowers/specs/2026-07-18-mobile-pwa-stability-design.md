# POLSKA 手機 PWA 穩定化設計規格

日期：2026-07-18（Asia/Taipei）

狀態：使用者已核准依既有雙介面計劃開始手機階段；本文件將「穩定優先」轉為可驗收契約。

## 1. 結論

手機版沿用既有 `B_Companion` 的「今日／行程／交通／訂票」四分頁，不重新設計主要操作。這一階段只把手機入口、安裝啟動、離線 fallback、更新流程與舊網址相容做成明確、可測試的正式 PWA 契約。

採用「獨立手機殼＋共用核心資料」：`mobile.html` 直接掛載 `B_Companion`，桌機根入口繼續掛載分章雜誌。兩者共用 `redesign/data.js`、`redesign/pwa-core.js`、React bundle、PWA 註冊器與同一個 Service Worker。

## 2. 方案與採用理由

### 方案 A：已安裝 PWA 繼續從根網址啟動

改動最少，但根網址會依寬度判斷介面。平板、外接螢幕或視窗狀態改變時，已安裝的手機旅伴可能誤進桌機指南，不符合穩定啟動需求。

### 方案 B：Manifest 使用 `./?view=mobile`

能強制手機模式，但離線 navigation fallback、分享網址與舊 query 合併較難閱讀，也沒有建立計劃指定的正式 `mobile.html` 殼。

### 方案 C：`mobile.html` 成為正式手機 PWA 殼（採用）

已安裝 App 永遠從明確的手機殼啟動，根入口仍可依裝置提供桌機或手機介面。代價是 `index.html` 與 `mobile.html` 會各有一小段掛載程式，但可透過入口契約測試防止資產版本與資料來源分歧。

## 3. 成功標準

1. 390、320 px 開啟根網址或 `mobile.html`，都看到既有四分頁旅伴。
2. `mobile.html` 不執行相容轉址，直接載入 `B_Companion`。
3. `manifest.json` 的 `id` 維持 `./`，`start_url` 改為 `./mobile.html`；已安裝 PWA 仍被視為同一個 App。
4. Manifest shortcuts 分別指向 `./mobile.html#top` 與 `./mobile.html#B-tickets`。
5. 手機與桌機繼續使用同一份 `redesign/data.js`，日期、日次、交通、票價與訂票資訊不分叉。
6. 完成一次線上載入後，手機核心殼、Day 1–8、交通、訂票、字型以外的必要樣式與圖示可離線使用。
7. 離線重新開啟 `mobile.html` 時回到手機殼；離線開根網址或桌機深層 hash 時回到桌機根殼。
8. Service Worker 更新仍由使用者按「立即更新」後才切換，不在查看行程途中突然重載。
9. `mobile.html`、根入口與部署輸出遇到資料載入失敗時顯示可理解的錯誤，不留下空白畫面。
10. `./verify.sh`、發布 allowlist、JavaScript 語法檢查及 390／320 px 實際瀏覽器驗收全部通過。

## 4. 正式入口責任

### 根入口 `index.html`

- 大於等於 768 px 或 `?view=desktop`：桌機分章雜誌。
- 小於 768 px 或 `?view=mobile`：既有 `B_Companion`。
- 保留公開分享、SEO 與一般瀏覽器入口。

### 手機入口 `mobile.html`

- 直接載入 React、`redesign/data.js`、`redesign/pwa-core.js`、`B_Companion` 與 `pwa-register.js`。
- 不依螢幕寬度切換成桌機版。
- 使用和根入口一致的 metadata、圖示、manifest、資料錯誤訊息及版本化資產。
- JavaScript 不可用時顯示需要啟用 JavaScript 的說明及返回網頁版連結。

### 舊入口

- `desktop.html` 導向 `./?view=desktop`，保留原 query 與 hash。
- `app-preview.html` 導向 `./mobile.html?view=mobile`，保留原 query 與 hash。
- `mobile.html` 不再使用 `legacy-redirect.js`。
- `archive/classic-index.html` 保持封存，不加入發布或快取。

## 5. Manifest 與安裝穩定性

- `id` 固定為 `./`，避免建立第二個 App 身分。
- `start_url` 固定為 `./mobile.html`。
- `scope` 維持 `./`，讓同一個 Service Worker 可服務兩個正式殼。
- orientation 維持 `portrait-primary`，不改現有圖示、名稱與主題色。
- shortcuts 使用手機殼的實際錨點，且自動測試必須確認錨點存在。

## 6. Service Worker 契約

- Cache 版本由 `polska-v15` 升級為 `polska-v16`，啟用時清除舊 `polska-*` 快取。
- Precache 同時包含 `./`、`./mobile.html`、桌機三個資產、手機 React／CSS／資料／bundle、manifest、註冊器及圖示。
- Navigation 使用 network-first：
  - `mobile.html` 請求失敗時 fallback 至快取的 `./mobile.html`。
  - 根入口、`desktop.html` 或桌機 hash 導覽失敗時 fallback 至快取的 `./`。
- 正式同源資產使用 cache-first 並背景更新；非 allowlist 同源檔案只走網路，不寫入 PWA cache。
- 第三方字型維持 stale-while-revalidate；字型失敗不得阻止核心頁面閱讀。
- 不自動 `skipWaiting()`；沿用既有等待使用者確認的更新流程。

## 7. 錯誤與降級

- `window.TRIP` 缺少或 Day 1–8 不完整時，手機顯示「行程資料載入失敗，請重新整理」。
- Service Worker 不支援或註冊失敗時，網站仍可線上使用，並顯示目前無法準備離線資料。
- `localStorage` 不可用時，備註只保留本次工作階段，沿用現有提示。
- 外部地圖與訂票連結在離線時不開啟，沿用現有「目前離線」提示。
- 舊快取升級失敗時保留目前 active worker，不強制重載或清空正在查看的畫面。

## 8. 測試與驗收

### 自動測試

- `tests/entrypoints.test.mjs`：手機殼直接掛載、舊入口正確導向、manifest 啟動與 shortcuts。
- `tests/sw-contract.test.mjs`：雙殼 precache、依入口 fallback、cache v16 與舊快取清理。
- `tests/deploy-contract.test.mjs`：`_site` 包含正式手機殼與雙介面資產，排除 archive、tests、docs。
- 既有 PWA lifecycle、localStorage、焦點、更新與 bundle 一致性測試全部保留。

### 實際瀏覽器

- 390、320 px：根入口與 `mobile.html` 都顯示四分頁，無水平溢出。
- 點選今日、行程、交通、訂票，確認 Drawer／Sheet 焦點與返回操作正常。
- `?view=desktop` 在窄螢幕仍可人工檢查桌機版；`mobile.html` 不受寬度影響。
- console 需為 0 error；PWA 註冊狀態需進入 ready，或在不支援環境顯示明確降級狀態。

## 9. 發布門檻

依序通過 `./verify.sh`、實際瀏覽器驗收、未參與撰寫者的交叉審查及使用者操作確認後，才可合併、推送或部署。這一階段不新增登入、後端、資料庫、雲端同步、推播通知或手機視覺重設計。

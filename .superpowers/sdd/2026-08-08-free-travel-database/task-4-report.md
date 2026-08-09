# Task 4 實作報告：每日操作導航與晚間檢查

## 交付內容

- `src/data/travel-database.js`
  - Day 1–8 的 `dayOperations` 都已加入 `addresses[]`、`navigation[]`、`dailyAlerts[]`、`nightChecklist[]`。
  - 地址以機場、主車站與當日固定景點為主，導航使用 HTTPS Google Maps 地點搜尋連結。
  - 未確定住宿與分店一律顯示「待住宿／分店確定後填入」，不放訂單或私人資料。
  - PKP、奧斯威辛往返與市內交通都明確標示「目標」、「開賣後確定」或「當日重查」，沒有把未開賣班次寫成確定行程。
  - 每晚共用四項基本檢查：裝置充電、離線保存票券、截圖集合點／月台、重查天氣／營運，另加入各日特有任務。
- `src/templates/day.mjs`
  - `renderDay(day, photoSpotsForDay, operation)` 已接受每日操作資料。
  - 新增「今天怎麼走」與「晚間準備」，地址、移動步驟與當日注意分開呈現。
  - 操作資料一律 HTML escape；只允許 `https:` 外部連結，並加上 `target="_blank" rel="noopener noreferrer"`。
- `build.mjs`
  - 產生每日頁時傳入 `travelDatabase.dayOperations[day.n]`。
- `src/styles/main.css`
  - 新增地址簿、交通標籤、晚間勾選清單與行動版單欄排版。
- `tests/build.test.mjs`
  - 覆蓋 8 天四組資料契約、每日標題、HTTPS 連結、安全屬性、Day 2 非營業週日、Day 8 離開 EU 與待填住宿文字。

## TDD 與驗證

1. RED：先加每日操作測試，`npm test` 在 `operation.addresses` 不存在時如預期失敗（28 通過、1 失敗）。
2. Focused GREEN：`node --test --test-name-pattern='Day 1–8 都有現場導航' tests/build.test.mjs` 通過（1/1）。
3. 完整 GREEN：`npm test` 通過（29/29），build 產生 21 頁。
4. `git diff --check` 通過。

## 範圍說明

- 未修改 ledger；`progress.md` 的現有變動由根任務管理，本任務沒有寫入。
- 未碰觸 `.agents/`、`.claude/`、`skills-lock.json`，也未自行提交。

## Fix round 1

- 審查發現 Day 3 原用的 `Więźniów Oświęcimia 20` 是 Auschwitz I 通訊地址，不是旅客應抵達的新訪客服務中心。
- 先加回歸測試，要求 Day 3 資料與產出 HTML 皆含門牌 `55`、不得含門牌 `20`，並確認測試如預期 RED。
- 地點名稱改為「Auschwitz I 訪客服務中心／入口」，顯示地址與 Google Maps query 一併改為 `Więźniów Oświęcimia 55, 32-600 Oświęcim`。
- Focused 回歸測試於重新 build 後 1/1 通過。

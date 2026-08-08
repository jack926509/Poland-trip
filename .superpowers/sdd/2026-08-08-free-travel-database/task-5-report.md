# Task 5 實作報告：安全、時效與內容完整性防護

## 完成內容

- 在 `src/data/travel-database.js` 新增 `validateTravelDatabase()`，並於正式資料模組載入時立即驗證：
  - 每筆狀態都必須存在於 `statusLabels`。
  - `verified` 必須有 HTTPS 來源與 `YYYY-MM-DD` 查證日期。
  - `recheck` 必須有查證日期與重查日期。
  - `pending`、`private-required` 可保留 `null`，但非空來源與日期仍必須符合格式。
  - section 與 entry ID 不得重複，每個 section 至少有一筆資料。
  - readiness 必須指向既有 entry，且兩者狀態一致。
  - Day 1–8 必須具有地址、導航、當日警示、晚間準備四組非空資料；資料中的 `url`／`link` 必須使用 HTTPS。
  - 禁止舊代表處館址、Auschwitz 舊入口與敏感資料欄位標籤進入公開資料。
- 在 `src/templates/database.mjs` 對 entry 與 section 的所有資料文字做 HTML escaping。
- 官方來源只在能解析為 HTTPS URL 時才輸出超連結，外部連結使用 `rel="noopener noreferrer"`；非 HTTPS 值只顯示安全提示。
- SOS 急難電話改為固定、安全的 `tel:` 連結，不再以資料字串取代方式插入 HTML。
- 在 `tests/build.test.mjs` 新增資料契約、故意違規攔截、模板注入防護與全站禁止內容測試。

## TDD 證據

- RED：先加入測試後執行 `npm test`，因資料模組尚未匯出 `validateTravelDatabase` 而失敗：`SyntaxError: ... does not provide an export named 'validateTravelDatabase'`。
- GREEN：完成驗證器與模板防護後，`npm test` 通過 33／33，0 failures。
- 故意違規案例保留在測試中：把第一筆 entry 狀態改為 `未定義狀態`，確認驗證器以 `未知狀態` 錯誤攔截；正式資料未被修改。

## 驗證結果

- `npm test`：34／34 通過。
- `env -u NODE_OPTIONS ./verify.sh`：通過，最後一行為 `✅ POLSKA 新版靜態網站自動驗收完成`。
- `git diff --check`：通過，無輸出。
- 未修改或加入 `.agents/`、`.claude/`、`skills-lock.json`，未自行提交。

## 審查修正 Round 1

- 日期驗證由格式檢查加強為 UTC round-trip 真實曆日檢查；負向測試確認 `2026-02-30` 與非閏年的 `2025-02-29` 都會被攔截。
- section、entry、readiness ID 限制為 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` 穩定 slug；負向測試分別涵蓋空白、`%20` 與 `#`。
- SOS 代表處的 `tel:+48668027574` 操作連結已放入同一個 `.database-card` article；測試以代表處 article 起訖界線確認 DOM 結構。
- Day 1–8 schema 已分欄驗證：
  - `addresses` 每項必須是物件，且具有非空 `name`、`address` 與 HTTPS `url`。
  - `navigation` 每項必須是物件，且具有非空 `mode`、`route`、`action`。
  - `dailyAlerts`、`nightChecklist` 每項必須是非空字串。
  - `entryIds` 必須是非空陣列，且全部指向既有 entry。
- Round 1 TDD RED：新增測試後共有 3 組失敗，分別是不存在日期未攔截、每日操作缺欄未攔截、SOS 電話不在代表處卡片內；修正後 34／34 通過。

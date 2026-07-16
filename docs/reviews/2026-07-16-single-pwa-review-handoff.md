# POLSKA 單一 PWA 交叉審查交接

## Diff 與狀態

審查基準為 `git diff a0d2553..75ac832`。最終 committed diff 為 31 個檔案、3,675 行新增、2,826 行刪除，包含 `prepare-site.sh` 與 `tests/deploy-contract.test.mjs`。

第四輪修正 3 個 Important 與 1 個 Minor：Pages artifact 改為安全 allowlist、預覽其他日不套用現在分鐘、背景更新失敗清除失效 waiting worker、archive 測試改固定 SHA-256。瀏覽器另發現 unversioned 核心程式可與新版 bundle 混載，已把 `pwa-core.js`、`pwa-register.js` 一併版本化並補契約。

## 驗收證據

- 52/52 Node tests；`./verify.sh` exit 0。
- bundle 32,150 bytes；source／dist build 前後一致。
- temp `_site` 共 21 個 allowlist 檔，forbidden count 0。
- 390 px overflow 0；Day 2 預覽 09:00、Day 4 預覽 18:30；當日 Day 2 分鐘過濾由純行為測試覆蓋。
- 真實 redundant probe：ready 保留、更新失敗文案顯示、立即更新按鈕與 panel 都消失。
- v15 核心 URL 一致後，停止 server 離線 reload 成功，乾淨分頁 console error／warning 0。

完整證據見 `docs/verification/2026-07-16-single-pwa-results.md`。

## 獨立審查狀態與部署門檻

本文件不宣稱 Claude 已完成獨立審查。iPhone non-zero safe-area、真正 standalone 安裝啟動與使用者核心路徑仍未完成；不得推送或部署。待另一個 AI 獨立審查與使用者操作確認後，再另行詢問是否發布。

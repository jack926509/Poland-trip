# 手機 PWA 穩定化審查交接

日期：2026-07-18（Asia/Taipei）

## 審查範圍

- 分支：`codex/mobile-pwa-stability`
- 基準：桌機分章雜誌已驗證修正版 `4f51088`
- 核心變更：獨立 `mobile.html`、Manifest 手機啟動、舊入口分流、`polska-v16` 雙殼離線 fallback、根入口手機白畫面降級。

## 建議重跑

1. 執行 `./verify.sh`，預期 73 pass、0 fail。
2. 從空目錄執行 `./prepare-site.sh <輸出目錄>`，確認沒有 `archive/`、`tests/`、`docs/`。
3. 在 320、390 px 檢查四分頁、Drawer、Day 2 交通 Sheet、訂票定位與水平溢出。
4. 在 768、1024、1440 px 檢查根入口仍為桌機分章雜誌。
5. 檢查 `sw.js` 不會在 install 階段自動呼叫 `skipWaiting()`。

## 風險與門檻

- 瀏覽器自動化沙盒無法證明真實裝置的安裝提示與 Service Worker 狀態，正式發布前仍建議用一支實體手機安裝並離線開啟一次。
- 未經使用者確認，不得合併、推送或部署。

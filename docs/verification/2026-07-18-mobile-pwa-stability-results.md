# 手機 PWA 穩定化驗收紀錄

日期：2026-07-18（Asia/Taipei）

## 結果

- `./verify.sh`：73 項測試全部通過，0 fail；正式 bundle build 後沒有未提交差異。
- 發布組裝：從全新空目錄執行 `./prepare-site.sh` 成功；輸出包含 `mobile.html`、桌機資產及 `polska-v16` Service Worker，不含 `archive/`、`tests/`、`docs/`。
- 預快取清單：17 個雙介面核心網址逐一回應 HTTP 200。
- 離線契約：自動測試確認 `/mobile.html` navigation 回手機殼、根 navigation 回根殼，且不自動 `skipWaiting()`。

## 實際瀏覽器

- 390 px：手機旅伴直接載入；四個固定分頁、8 日 Drawer、Day 2 火車詳情 Sheet、訂票定位與跳到主要內容均可操作，client width 與 scroll width 同為 390 px。
- 由 `mobile.html#B-tickets` 直接啟動時，React 掛載後會正確定位並顯示訂票區，console 0 error。
- 320 px：client width 與 scroll width 同為 320 px，無水平溢出。
- 768、1024、1440 px：根入口均成功渲染桌機分章雜誌與總覽標題，console 0 error。
- 瀏覽器驗收環境不提供可用的 Service Worker 安裝狀態，因此畫面顯示離線資料準備失敗；核心資產 HTTP 200、安裝／更新／雙殼 fallback 均由自動測試驗證。

## 已知限制與發布門檻

- 手機仍使用現有 `B_Companion` 四分頁，不含登入、跨裝置同步、後端、推播或正式購票狀態。
- 本次只完成分支實作與本機驗收；未經使用者確認，不得合併、推送或部署。

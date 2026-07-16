# POLSKA 單一 PWA 最終驗收結果

- 驗收時間：2026-07-16 23:18–23:38（Asia/Taipei）
- 驗收基準：`a0d2553..75ac832`
- 驗收 commit：`75ac832`（`fix: 封閉 Pages 發布與 PWA 邊界狀態`）
- 本機網址：`http://localhost:4173/`

## 自動驗收

`node --test tests/*.test.mjs` 與 `./verify.sh` 均實際完成：52 tests、52 pass、0 fail、0 skipped。`./verify.sh` exit code 0；正式 bundle `redesign/dist/B-companion.js` 為 32,150 bytes（31.4 kB），build 前後 `cmp` 一致；6 個 JavaScript `node --check`、2 個 shell `bash -n` 與 `git diff --check` 通過。

經典版改以 Node crypto 驗證固定 SHA-256：`5d1126029e882a15e285ba7e2fa107a7a55f13869b2b7a38e1ac41ac481df978`，測試不再依賴 git history 或 `git show`。

## Pages 公開 artifact

workflow 現在依序執行 `./verify.sh`、`./prepare-site.sh _site`，且 `upload-pages-artifact` 只上傳 `_site`。實際以 temp 空目錄組裝得到 21 個 allowlist 檔；核心入口、PWA、legacy redirect、B-companion、vendor 與圖示齊全，archive、tests、docs、workflow、A/C、ios-frame、開發腳本的 forbidden count 為 0。`_site/` 已加入 `.gitignore`。本次沒有實際部署。

## 瀏覽器與 lifecycle

- 390 × 844：clientWidth／scrollWidth 390／390，overflow 0。
- 行前選 Day 2 顯示最早硬時間 `09:00 華沙 → 克拉科夫火車`；預覽 Day 4 顯示最早含時間限制 `18:30 前取行李…`。
- 純行為測試另固定證明：旅程中 Warsaw 12:00 查看當日 Day 2 時，會略過 09:00 並顯示 17:30；行前、行後或查看其他日不套用現在分鐘。
- 真實安裝失敗 probe 讓背景 worker 進入 redundant：畫面保留 `ready`，顯示「更新失敗，仍使用目前版本」，「立即更新」按鈕數 0、更新 panel 不存在。probe 完成後已還原正式檔案。
- 瀏覽器曾抓到 v15 bundle 與未版本化舊 `pwa-core.js` 混載；補 RED 契約後，`pwa-core.js` 與 `pwa-register.js` 均加入 v15 query 並同步 precache。重新開啟乾淨分頁後渲染正常、console error／warning 0。
- 停止 HTTP server 後 reload：v15 標題、Day 1–8、訂票、`ready` 仍存在，390／390，console error／warning 0。

## 尚未實測

- iPhone 真機 non-zero safe-area。
- 真正接受安裝提示後的 standalone 啟動。
- Browser 無時鐘覆寫介面，因此 Day 2 當日分鐘過濾由可執行純行為測試驗證；瀏覽器驗證行前 Day 2 與其他日預覽。

本次未部署、未推送、未刪除專案檔案，也未改動 `.codex-staging/`。

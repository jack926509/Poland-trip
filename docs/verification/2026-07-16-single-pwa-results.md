# POLSKA 單一 PWA 最終驗收結果

- 驗收時間：2026-07-16 23:18–23:21（Asia/Taipei）
- 驗收基準：`a0d2553..c1b6c72`
- 驗收 commit：`c1b6c72`（`fix: 完成單一 PWA 最終整體修正`）
- 本機網址：`http://localhost:4173/`

## 自動驗收

`node --test tests/*.test.mjs` 與 `./verify.sh` 均實際完成：46 tests、46 pass、0 fail、0 skipped。`./verify.sh` exit code 0，esbuild 正式 bundle `redesign/dist/B-companion.js` 為 32,110 bytes（顯示 31.4 kB），build 前後 `cmp` 一致；6 個 JavaScript `node --check` 與 `git diff --check` 通過。

經典版 `archive/classic-index.html` 已用 `apply_patch` 建立，Node byte comparison 與 shell `cmp` 均確認和 `git show a0d2553:index.html` 完全相同；未進入 manifest、sitemap、Service Worker 或 build。

## 真實瀏覽器

| Viewport | clientWidth / scrollWidth | overflow | 導覽與版面 |
| --- | --- | ---: | --- |
| 320 × 844 | 320 / 320 | 0 px | 手機導覽 grid、桌機導覽隱藏、PWA ready |
| 390 × 844 | 390 / 390 | 0 px | 手機導覽 grid；Day 2 顯示「下一個硬時間」17:30 |
| 1440 × 900 | 1440 / 1440 | 0 px | 桌機導覽 grid、手機導覽隱藏、右欄可見 |

Day 2 交通卡以鍵盤 Enter 啟動唯一「開啟火車交通詳情」按鈕後，`火車詳情` dialog 可見；「關閉火車詳情」可用 Enter 關閉。Intercity 訂票、出發站地圖、抵達站地圖各自只有一個獨立連結，沒有互動元素巢狀。

三個舊入口均在 390 × 844 導回根應用並完整保留 query/hash：`mobile.html?day=3&from=legacy#B-tickets`、`desktop.html?day=4&from=legacy#B-guide`、`app-preview.html?day=5&from=legacy#B-day-5`；三次寬度皆為 390 / 390。

瀏覽器實際偵測 v14 waiting worker；未按時保留目前版本，按「立即更新」後才切換並 reload。新版接管後停止 HTTP server，再 reload 仍顯示新標題、8 個日次、訂票內容、`ready` 與 390 / 390；console error／warning 為 0。

## 尚未實測

- iPhone 真機 non-zero safe-area。
- 真正接受安裝提示後的 standalone 啟動。

以上兩項需要真實裝置或改動使用者瀏覽器安裝狀態，仍留作部署前使用者驗收；本次未部署、未推送。

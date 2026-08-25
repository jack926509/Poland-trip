# 紙上旅行誌改版交叉審查交接包

## 審查範圍

請以 `main` 為固定比較點，審查分支 `plan/paper-travel-journal-redesign-20260825`。實作者不得自行宣稱交叉審查完成；請另一個 AI 實際執行驗收，finding 以 `檔案:行號` 回報。若無 finding，請明確列出已檢查的範圍。

`git diff main --name-only` 實際清單：

```text
README.md
build.mjs
docs/reviews/2026-08-25-paper-travel-journal-handoff.md
docs/superpowers/plans/2026-08-25-paper-travel-journal-redesign.md
docs/superpowers/specs/2026-08-25-paper-travel-journal-redesign-design.md
docs/verification/2026-08-25-paper-travel-journal-results.md
poland-travel-guide-2026.html
src/scripts/nav.js
src/styles/main.css
src/templates/city.mjs
src/templates/database.mjs
src/templates/day.mjs
src/templates/home.mjs
src/templates/layout.mjs
src/templates/practical.mjs
tests/build.test.mjs
tests/paper-travel-journal.test.mjs
```

## 七項白話驗收條件

1. 打開首頁，第一眼看到的是旅行誌封面、波蘭四城照片與旅程日期，不再像資料管理儀表板。
2. 手機打開首頁，不用左右滑即可看完，並能清楚點進任何一天、城市與實用工具。
3. 任一每日頁仍找得到時間、交通、地址、風險、待訂與下一天入口。
4. 任一城市頁仍能操作地圖並看到景點、餐廳、備案與拍照資訊。
5. 自由行資料庫搜尋與快速篩選維持可用，結果數與空狀態正確。
6. `env -u NODE_OPTIONS ./verify.sh` 全數通過，瀏覽器 console 沒有 error。
7. 另一個 AI 依 diff、驗收條件與風險提示完成交叉審查，使用者再實際操作核心路徑。

## 實作者風險提示

- 首頁資訊密度：檢查 320px、390px 與 1280px 的封面、狀態列、8 日目錄與城市卡是否仍有清楚層級。
- 城市照片 crop：四張 hero 與 thumbnail 都使用 `object-fit: cover`，請逐城確認主體沒有被不當切掉。
- 單檔 ID／ARIA 改寫：請檢查 href、id、for、`aria-labelledby`、`aria-describedby` 的頁面前綴，以及地圖 `data-map-key` 不受改寫影響。
- 手機地圖捲動：地圖容器必須保留 `touch-action: pan-y`，頁面不可鎖住垂直捲動。
- 資料庫焦點：快速篩選後焦點應留在按鈕；搜尋、select、清除、結果數與空狀態都要實際操作。
- 瀏覽器驗收曾修正兩項問題：390px 封面 2px 溢出，以及 Escape 無法關閉導覽；請優先回歸這兩處。

## 實跑指令與證據

```bash
env -u NODE_OPTIONS ./verify.sh
git diff --check
python3 -m http.server 8915 --bind 127.0.0.1
```

- 自動與瀏覽器證據：`docs/verification/2026-08-25-paper-travel-journal-results.md`
- 設計規格：`docs/superpowers/specs/2026-08-25-paper-travel-journal-redesign-design.md`
- 執行計畫：`docs/superpowers/plans/2026-08-25-paper-travel-journal-redesign.md`
- 多頁版：`http://127.0.0.1:8915/dist/index.html`
- 單檔版：`http://127.0.0.1:8915/poland-travel-guide-2026.html`

## 審查回報格式

```text
Findings
- [P0-P3] 標題 — 檔案:行號
  原因、重現步驟與建議修正。

已檢查且無發現
- 範圍與實際執行的驗收。
```

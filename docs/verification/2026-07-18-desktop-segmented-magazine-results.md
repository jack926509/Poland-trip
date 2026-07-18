# 桌機分章雜誌驗收紀錄

日期：2026-07-18（Asia/Taipei）

## 自動驗收

執行 `./verify.sh`：61 項測試全部通過，0 fail。驗證範圍包含桌機路由、資料來源、入口分流、發布 allowlist、既有手機 PWA、Service Worker 及 bundle 一致性。

## 實際瀏覽器驗證

- 桌機網址：`http://localhost:4173/?view=desktop#overview`
- 觀察結果：Masthead、紅白旗線、郵票章、七個章節按鈕與總覽內容均成功渲染。
- 點選「每日行程」後：顯示 Day 1，網址為 `#itinerary/day-1`。
- 點選 Day 2 後：顯示「華沙 → 克拉科夫 · Wawel + 老城 + 辛德勒最後入場 + Kazimierz 晚餐」，網址更新為 `#itinerary/day-2`。
- 焦點：每次切換後落在 `#desktop-heading`。
- 寬度：實測 client width 1280 px，scroll width 1280 px，無水平溢出。
- console：桌機 0 error。
- 手機回歸網址：`http://localhost:4173/?view=mobile`
- 手機回歸結果：既有「今日」與四分頁導覽成功載入，console 0 error。

## 尚待使用者驗收

使用者需以實際桌機與手機裝置走一次核心路徑後，才能合併、推送或部署。

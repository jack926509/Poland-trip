# 桌機分章雜誌驗收紀錄

日期：2026-07-18（Asia/Taipei）

## 自動驗收

執行 `./verify.sh`：66 項測試全部通過，0 fail。驗證範圍包含桌機路由、實際資料欄位與渲染結果、入口分流、發布 allowlist、既有手機 PWA、Service Worker 及 bundle 一致性。

## 實際瀏覽器驗證

- 桌機驗證寬度：1440、1024、768 px；手機驗證寬度：390、320 px。
- 所有尺寸的 client width 與 scroll width 相同，沒有水平溢出。
- Masthead、紅白旗線、郵票章、七個章節按鈕與單一主內容區均成功渲染。
- 交通章顯示 `WAW → KRK` 等完整路線、四城住宿及可讀航班資料，不含 `undefined` 或 `[object Object]`。
- 門票章顯示各城票價、確認期限及 16 個官方連結，不含 `[object Object]`。
- 城市章可在同一個 `#cities` hash 內由 Warszawa 切換至 Kraków，標題、美食及焦點會立即更新。
- Day 2 顯示警告、必訂項目、備案地點與原因、實務節點；方向鍵、返回鍵及焦點管理維持正常。
- 390、320 px 根網址依寬度自動載入既有 `B_Companion`，跳到主要內容指向存在的 `#app-main`。
- `?view=desktop` 在 390 px 仍可強制開啟桌機指南。
- console：桌機與手機均為 0 error、0 warning。

## 尚待使用者驗收

使用者需以實際桌機與手機裝置走一次核心路徑後，才能合併、推送或部署。

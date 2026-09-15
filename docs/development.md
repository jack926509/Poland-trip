# 開發與資料維護指南

基本建置與部署指令見 [README](../README.md)。本頁保留目前維護時需要的規則，不記錄逐次工作過程。

## 旅遊資料與訂票狀態

- `src/data/trip.js` 的 `todoGroups` 是人工訂票紀錄。查核後更新 `status`、`checkedAt`（實際查核日）、`recheckAt`（下次查核期限）、`action` 與 `url`，不要用建置或部署日期代填查核日。
- 「可查／購」仍是未完成。收到訂票確認後才改為「已訂妥」或「已完成」，並同步核對 `days`、`trains`、`reservations` 與 `bookingTiers`。票號、訂位代碼與付款資料另存私人票券。
- 每日餐位維護於 `day-dining.js`，額外順路美食維護於 `trip.js` 的 `eat`；城市餐飲整合由 `src/templates/city-dining.mjs` 推導，避免另外手寫一份候選名單。
- 刪除城市餐廳時，檢查 `cities.js` 的 `mapPins` 與 `mapPinChecks` 是否需同步更新。座標要有查核依據，Google Maps 搜尋連結不能當作已驗證座標。
- 資料庫 CSV 匯入只更新 `travel-database.js` 的對應條目，不會完成購票或自動更新 `todoGroups`。
- 儀表板依台灣日期重新計算更新量與逾期數，今日行程依華沙日期判斷；離線時計算的是已載入資料，不會自動查票。
- 倒數期限整合火車開賣日、手動期限與資料庫重查日，應修改各來源正本，避免重抄日期。日照可用 `npm run sun:times` 重算，行程時間可用 `npm run audit:schedule` 檢查。

## 頁面與離線機制

- 新增頁面時，核對 `build.mjs` 的 `standalonePages`、導覽分組、`htmlCount`，以及 `sw.js` 預快取、搜尋索引、`sitemap.xml` 和 `tests/build.test.mjs` 的頁數斷言。
- `renderLayout` 會為適用頁面建立章節索引，頁面樣板不需另外維護同一份目錄。
- 站台採固定淺色主題；修改介面時保留鍵盤焦點、手機觸控尺寸與減少動態效果設定。
- `sw.js` 頁面採 network-first，靜態資源採 cache-first，OpenStreetMap 圖磚採 stale-while-revalidate，最多保留 400 塊。離線地圖僅能使用已快取圖磚。
- 建置會為離線快取版本加上資源指紋。不要用根目錄的原始 `sw.js` 覆蓋輸出版本。
- Leaflet 由 `vendor/leaflet/` 提供，建置時複製到多頁版並內嵌到單檔版。升級時同步更新此目錄並保持 LF 換行。
- Google Fonts 載入失敗時使用系統字型；地圖載入失敗時提供文字與導航連結備援。

離線驗證：建置後以 localhost 靜態伺服器開啟網站，等待 service worker 啟用並完成快取，再切離線檢查頁面導覽與已快取地圖。

## 照片與查核文件

- 新增照片時，依 [照片來源](../assets/photos/CREDITS.md) 的流程確認可改作授權、裁切、長邊 1200px 與 WebP 輸出，並同步補上來源與授權。
- 具來源依據的旅遊查核資料放在 [research/](research/)，資料校正參考 [資料校正表](資料校正表.md)。歷史文件可能已被後續查核取代，請核對日期及現行資料。
- 功能修改與驗證結果寫入 commit 或 PR；只有仍影響開發的決策與操作方式才更新本指南。

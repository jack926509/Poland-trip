# POLSKA — 2026 波蘭四城紙上旅行誌

23 頁資料驅動靜態旅行誌：8 天行程、四城攝影章節與地圖、訂票待辦、實用附錄、資料更新儀表板及自由行資料庫。內容只從 `src/data/*.js` 產生，請勿直接修改 `dist/` 或根目錄單檔版。

正式驗收：

```bash
env -u NODE_OPTIONS ./verify.sh
```

建置結果在 `dist/`；部署前以 `./prepare-site.sh <空目錄>` 組裝正式檔案。舊版頁面與 PWA 僅保留於 `archive/`。

## 離線能力

出國漫遊時網路不穩，所以站台刻意不依賴外部 CDN 執行：

- `sw.js` 是真正的快取 service worker，安裝時預快取 23 頁與 CSS／JS／城市主圖。
  頁面走 network-first（有網路拿最新），靜態資源走 cache-first，
  OpenStreetMap 圖磚走 stale-while-revalidate 並限制在 400 塊以內。
- Leaflet 自行 host 於 `vendor/leaflet/`，建置時複製到 `dist/assets/leaflet/`，
  單檔版則直接內嵌。**升級 Leaflet 時請一併更新 `vendor/leaflet/`**，
  並確認檔案是 LF 換行（上游 `leaflet.css` 是 CRLF，會讓 `git diff --check` 失敗）。
- 字型仍走 Google Fonts，但改為非阻斷載入：CDN 連不上時內文立即以系統中文字型顯示。
- 地圖載入失敗時 `.map-container` 會顯示說明文字，引導改用景點清單的 Google Maps 連結。

離線實測方式：`node build.mjs` 後以任一靜態伺服器服務 `dist/`，
載入首頁待 service worker 啟用，再切離線走訪各頁。

## 導覽與長頁面

- 下拉選單會用 `aria-current="page"` 與 `.nav-link-current` 標出目前所在頁。
- `renderLayout` 會掃描組好的 `bodyHtml`，替沒有 id 的 `.section` 補 id
  並在第一個章節前插入「本頁章節」索引（少於 3 個章節、首頁與資料庫頁除外，
  後兩者本身就是目錄）。頁面樣板不需要各自維護索引。

## 城市照片

照片授權與處理紀錄見 `assets/photos/CREDITS.md`。目前四座城市各一張，
Day 01／06／07／08 共用華沙同一張。若要補充照片，請沿用 CREDITS.md 記錄的流程
（Wikimedia Commons 允許改作的授權 → 裁切 → 長邊 1200px → WebP），
並把新檔案與授權資訊一併補進該表。

## 儀表板與訂票狀態維護

- 儀表板在開啟、每分鐘、切回頁面及匯出前，依台灣日期重新計算今日更新量和逾期數；離線時也可計算，但使用的是已載入的資料，沒有自動查票。
- JSON 與 CSV 使用匯出當下的日期及相同統計；CSV 採 UTF-8 BOM、CRLF 換行，所有欄位皆處理引號。
- `src/data/trip.js` 的 `todoGroups` 為人工訂票紀錄。查核後更新 `status`、`checkedAt`（實際查核日期）、`recheckAt`（下次查核期限）、`action` 與 `url`。缺少查核日期時顯示「未記錄，請重查」，不以建置或部署日期代填。
- 「可查／購」仍計入未完成項目。只有收到訂票確認後才改為「已訂妥」或「已完成」，並核對 `days`、`trains`、`reservations` 與 `bookingTiers` 的相應行程；票號、訂位代碼與付款資料另存私人票券。
- 資料庫 CSV 匯入只更新 `travel-database.js` 的對應條目，不會替使用者完成購票或自動更新 `todoGroups`。修改後執行 `env -u NODE_OPTIONS ./verify.sh`，再提交部署。

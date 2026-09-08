# POLSKA — 2026 波蘭四城 8 天 7 夜旅行誌

[正式網站](https://polandtrip.xiehnet.com/) · 航空往返 2026/10/23–11/01 · 波蘭境內 2026/10/24–10/31

23 頁資料驅動靜態旅行誌：完整航班、8 天逐日行程、四城攝影章節與地圖、已訂住宿名稱／地址／座標、訂票待辦、實用附錄、資料更新儀表板及自由行資料庫。內容只從 `src/data/*.js` 產生，請勿直接修改 `dist/` 或根目錄單檔版。

## 公開資料範圍

- 已公開：旅遊日期、航班號碼與時間、住宿名稱、公開地址、地圖座標、景點與交通規劃。
- 不公開：旅客姓名、護照或證件號碼、訂位代碼、票號、付款資料、房號與私人聯絡方式。
- 火車時刻標示為「參考班次／尚未訂票」時，只代表已選入規劃；完成指定日核實及購票後才可視為成立。
- Hotel Piast 完整門牌、Poznań Apartments Towarowa 實際入住門牌仍須以訂房確認為準；網站只顯示目前可核對的公開資訊與座標。

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

## 2026-09-08 行程與 UX/UI 檢視

- 首頁增加 8 日日期捷徑；每日時間表提前，提供「時間表／地址與導航／訂票與提醒」直接入口。
- 縮小每日封面與手機照片高度，放大常用標籤與觸控區域，保留旅行誌、深色模式及鍵盤導覽。
- 對照提供的 8 天 7 晚規劃：Day 2 留足經 Kazimierz 步行到辛德勒工廠的時間；Wawel 改短路線。Day 6 將牛角麵包博物館列為主行程，週四英語場仍須確認。
- 10/27 IC 3600 17:55–20:52、10/28 IC 260 19:10–20:29、10/29 EIC 8104 17:40–20:00 為使用者提供候選，尚未核實指定日運行、一等艙庫存與票價。每日頁、交通表與操作步驟同步更新，保留取行李和進站緩衝。
- 修正克拉科夫住宿到鄰近車站不必要的叫車建議、華沙雨天備案距離、波茲南兩處景點「全程室內」的誤述，以及「PLN 待開賣」顯示。
- 依使用者 2026-09-08 明確授權，完整行程、航班、住宿名稱／已知地址與地圖資料公開發布；未知地址仍標待確認，不以猜測補齊。
- 沿用 `main` 推送觸發 Cloudflare Pages 與 GitHub Pages 的既有部署，並升級離線快取版本。

## 2026-09-08 每日地圖、克拉科夫餐廳與實用資訊複核

- Day 1–8 地圖改以白天遊覽城市為範圍；晚間跨城抵達點不再把地圖縮成跨城市視野。Day 5 只顯示樂斯拉夫，並補齊中央廣場、糖果屋雙屋、教堂塔樓、全景畫、百年廳、日本花園、座堂島與 Wrocław Główny 等操作點。
- 每日地圖與城市地圖加入可見的放大、縮小、重設範圍按鈕，並支援滾輪、雙擊與雙指縮放。
- 克拉科夫加入使用者指定的 Okrąglak、Szalone Widelce、Bar Mleczny Pod Temidą；城市地圖共 21 點，全站城市圖釘共 54 點（51 個精確錨點、3 個範圍代表點）。
- 9 個逐日拍照建議改成座標站位、鏡頭方向與光線／構圖提示，可直接開啟站位導航。
- 實用資訊已複核 ETIAS、緊急電話、TAX FREE、城市交通票價、Wawel 花園季節與華沙起義博物館免費日；動態資訊仍明確要求出發前重查。

`env -u NODE_OPTIONS ./verify.sh` 全數通過（107 項測試）。

## 2026-09-08 UX/UI 版面優化（實測數據）

以 390×844 手機與 1440×900 桌機實測 bounding box，修正四個量得出來的版面問題：

- 全站搜尋列在手機佔掉首屏 386px（46%）。標題改由 placeholder 承擔、快捷分類改單行橫向捲動後降為 121px，首頁封面自 y=697 提前到 y=427。分類按鈕仍維持 44px 觸控高度，`aria-describedby` 目標只做視覺隱藏，螢幕閱讀器不受影響。
- 桌機封面 `h1`「POLSKA」溢出欄位 183px（scrollWidth 490 / clientWidth 307）。字級改依欄寬計算（`container-type: inline-size` + `cqw`，另備 `vw` fallback），現已完整落在版面內。
- 每日與城市封面圖被 `max-height: 23rem` 截斷，右欄留下 176px 空白。改為填滿欄位；手機仍保留原本 9rem 的壓縮高度。
- `.nav > a` 的特異度高於 `.nav-brand`，刊頭一直被壓成單行 inline-flex。改用同級選擇器後恢復兩行左對齊。

另外兩項操作性調整：

- 每日頁的「時間表／地址與導航／訂票與提醒」移到封面正下方並改為吸附，路上捲到任何位置都能一按跳轉；`scroll-margin-top` 一併調整避免標題被遮住。手機 `#schedule` 由 y=1586 提前到 y=1336。
- 「本頁章節」索引原本在每日頁被 `max-height: 8rem` 從字中間切斷，改為可換行的標籤列，不再裁切。

深色模式、鍵盤焦點樣式與 `prefers-reduced-motion` 均已隨新樣式驗證；`env -u NODE_OPTIONS ./verify.sh` 全數通過（98 項測試）。

## 2026-09-08 UX/UI 第二輪：移除深色模式與操作性調整

**深色模式已完全移除**：`prefers-color-scheme` 區塊、`color-scheme: dark`，以及成對的
`theme-color` meta 都不再輸出，`main.css`、單檔版與 23 頁 HTML 皆已驗證為零命中。
站台固定使用原本的紙感淺色配色。

手機與桌機操作性調整（同樣以實測 bounding box 為依據）：

- **所有表格在手機改為卡片式呈現。** 原本只有每日時間表有這個處理，其餘 20 幾張表
  維持橫向捲動：`practical/booking.html` 的表格在 390px 寬的畫面裡是 1210px，
  首欄「現在就查／訂（最急）」被壓到一行一個字。欄名改由 `layout.mjs` 的
  `addTableCellLabels()` 依 `<thead>` 自動補進每個 `<td>` 的 `data-label`，
  不必逐張表手寫；含 `colspan` 的整列訊息會跳過。
  過程中順帶修掉兩個會把整頁推寬的成因：`tbody` 的 grid track 沒指定會撐成
  `max-content`，以及 `.number` 的 `white-space: nowrap` 讓整段備註不換行。
  修正後 `booking` 的水平溢出由 169px 歸零。
- **觸控目標補到 44px。** Leaflet 縮放鈕原為 30px（leaflet.css 在 main.css 之後載入，
  且用 `.leaflet-touch` 前綴，特異度較高，需要更明確的選擇器才蓋得過）；
  資料庫主題索引、電話連結與待辦頁的行動呼籲連結原本只有 17px。
  句中的外部連結（Google Maps、官網）改用 `padding-block` 擴大點擊範圍，
  不影響行內排版。
- **日期捷徑會標出「今天」。** 依 `meta.timeZone`（Europe/Warsaw）比對當地日期，
  命中時加上 `aria-current="date"` 與標記並捲進可視範圍；不在 10/24–10/31 區間內
  就不顯示，也不影響無 JavaScript 的瀏覽。
- **長頁面加上「回頂端」。** 自由行資料庫在手機高達 19000px，捲到底沒有回頭路；
  按鈕在捲動超過 900px 後出現，並遵守 `prefers-reduced-motion`。
- 首頁路線列在手機改為換行，不必左右滑。

`env -u NODE_OPTIONS ./verify.sh` 全數通過（102 項測試，含本輪新增的 4 項迴歸測試）。

## 2026-09-08 每日頁封面比例調整

每日頁封面左側紫框由 41%（`0.82fr / 1.18fr`）縮為 **27.4%**（`0.55fr / 1.45fr`），
照片吃到更多版面。八天走同一個樣板與同一組樣式，實測 Day 1–8 皆為 27.4%，
照片高度與欄位高度一致（無留白），標題無溢出。

- 標題字級在雙欄版型下改依欄寬計算（`14cqw`，上下限 1.6–2.4rem）；
  920px 以下維持單欄與原本的手機字級（26.5px），平板 900px 也維持 30.6px 不變。
- 城市頁封面比例未動。

本次查核的官方來源（不代表已取得指定日票券）：

- [POLIN 開放時間](https://polin.pl/en/planning-your-visit/basic-information)：週五 10:00–18:00、主展最晚 16:00 入場，保留既有 Day 7 順序。
- [辛德勒工廠](https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory)：週日 09:00–20:00，最後入場為閉館前 1.5 小時，保留 17:30 目標。
- [牛角麵包博物館個人場](https://rogalowemuzeum.pl/indywidualni/)與[售票頁](https://rogalowemuzeum.pl/en/buy-ticket/)：不能把週末／暑期英語場套用到 10/29 週四。
- [PKP EIC 服務](https://www.intercity.pl/en/site/for-passengers/trains/about-eic.html)：一等艙飲品及點心說明；指定班次仍須重查。

## 2026-09-08 UX/UI 第三輪：旅行誌視覺升級（Edition 03）

維持既有語彙（紙色 `#f4eddf`、墨紫 `#493747`、單一淺色主題、23 頁資料驅動），
把版面從「線框＋平面色塊」升級成有材質與層次的雜誌感。改動集中在
`src/styles/main.css` 末段的 Edition 03 區塊與 `src/scripts/nav.js`，
資料、路由、地圖與離線行為皆未更動。

- **底色與材質**：全站加上暖色光暈與極輕紙紋（`body::before`，不透明度 0.035，
  `pointer-events: none`，列印時隱藏）；卡片改為漸層紙面＋頂部高光＋三階陰影。
- **刊頭**：半透明玻璃感（`backdrop-filter`）、底部紅金細線、品牌左側色條；
  下拉選單改圓角浮層。長頁面加一條閱讀進度線（`.reading-progress`，
  `aria-hidden`，與回頂端共用同一個 `requestAnimationFrame`）。
- **章節標題**：編號改為底線戳章，標題後接漸層細線，層級更清楚。
- **首頁**：封面改圓角＋墨紫漸層＋內框金線，照片加漸層壓暗；準備狀態列改成
  5 塊可點統計磚（手機 2 欄、待辦磚跨欄）；八日目錄加圓形日碼、hover 位移與左側色條；
  四城章節改成整張照片卡＋底部漸層字幕，hover 時照片微幅放大。
- **每日頁**：當日捷徑改為 sticky（桌機貼在刊頭下 76px，手機貼齊頂端）；
  桌機時間表左側加時間軌（圓點＋直線），手機仍維持卡片版——時間軌只在
  `min-width: 701px` 生效，否則 `td::before` 會蓋掉 `data-label` 帶出的欄名。
- **現場操作**：地址簿與拍照建議的導航連結改為膠囊按鈕，移動步驟加序號圓標，
  提示框改成左側色條＋圖示（`!`／`★`／`›`／`✓`）。
- **無障礙與觸控**：所有 44px 觸控高度、`data-label` 卡片表格、reduced-motion
  與 `color-scheme: light` 契約不變；焦點樣式改為 2px 實線外框＋3px offset。
- 未加入深色模式（既有測試明確禁止），也未使用捲動驅動動畫，避免內容在
  不支援或截圖／列印情境下停在 opacity 0。

離線快取版本升為 `polska-journal-v10`，讓既有安裝取得新樣式與腳本。
`env -u NODE_OPTIONS ./verify.sh` 全數通過（107 項測試）。

## 2026-09-08 餐廳地圖連結與章節膠囊對齊

- **每日「順路必吃」**：`trip.js` 的 `eat` 由字串改為 `{text, place, map, note}`，
  有明確店家的品項在卡片下方附 Google Maps 連結（膠囊按鈕，44px 觸控高度）。
  沒有固定店址的 Obwarzanek（克拉科夫街邊推車）與 Rogal Świętomarciński
  （多家認證烘焙坊）只寫說明，不硬給連結指向單一店家。
  模板同時相容舊的字串寫法。
- **城市頁主餐廳與備案餐廳**：`cityFood` 補上 25 筆缺少的地圖連結，備案餐廳原本
  就已全數具備，現在四城的兩個區塊 100% 有連結。一格寫兩家店的項目
  （U Fukiera / Polka、Starka / Szara Gęś、Hamsa / Klezmer-Hois、Pod Fredrą / Jadka）
  改用 `maps: [{name, url}]`，各給一條，不讓一條連結指錯店。
- 新增連結一律是 `https://www.google.com/maps/search/?api=1&query=店名+城市` 的
  **搜尋連結**，不是查證過的座標圖釘；使用者原本指定的 `maps.app.goo.gl` 短連結
  與既有 `cid` 連結都保持原樣。地圖圖釘稽核（54 點）不受影響。
- **本頁章節膠囊**：英文小標與中文標題改為 baseline 對齊，觸控高度改由上下
  padding 撐出，解決 0.72rem 英文與 0.95rem 中文置中時一高一低的問題。

`env -u NODE_OPTIONS ./verify.sh` 全數通過（107 項測試）。

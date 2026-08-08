# 波蘭旅遊資料內容盤點

來源檔案：
- A. `/Users/xieh/Desktop/技術開發/Poland-trip/redesign/data.js`（631 行）
- B. `/Users/xieh/Desktop/技術開發/Poland-trip/poland-travel-guide-final.html`（618 行）

驗證指令：`grep -c '<section id=' poland-travel-guide-final.html` → **10**（與 nav.tabs 的 10 個分頁連結一致）

---

## A. data.js — 頂層資料集合盤點（共 21 個頂層 key）

`window.TRIP = { ... }` 的頂層 key，依出現順序：

### 1. `meta`（物件，非陣列，1 筆）
用途：整趟旅程的基本資訊卡。
欄位：`code, edition, dateRange, tripStart, tripEnd, timeZone, nights, days, cities, route, style, highestRiskDays, flights`
（`flights` 在此僅是文字描述「國泰 + 卡達 + 長榮聯運」，與第 8 項的 `flights` 物件不同，注意改版時勿混淆同名欄位。）

### 2. `days`（陣列，**8 筆**，Day 1–8）
用途：逐日行程時刻表，是全站最核心的資料集合。
每筆物件欄位（並非每天都有全部欄位，見備註）：
`n, date, city, title, headline, tag, intensity, hardConstraints[], mustBook[], compressible[], weather, train{}(選填), steps[], eat[](選填), backup[], warn(選填,字串), practical[](選填), extend[](選填)`

- `steps[]` 子欄位：`t, label, sub(選填), cost(選填), dur(選填)`
- `backup[]` 子欄位：`label, where, why`
- `practical[]` 子欄位：`tag, name, note`
- `extend[]` 子欄位（僅 Day 7 有）：`label, when, why`
- `train{}` 子欄位：`type, from, to, dep, arr, dur, price`；Day 3（Auschwitz 巴士）額外多一個 `leg` 欄位區分「去程」。

各天欄位差異（供改版時注意，不是每天都齊全）：
| Day | train | warn | practical | extend | eat |
|---|---|---|---|---|---|
| 1 | 無 | 無 | 有 | 無 | 有 |
| 2 | 有 | 有 | 有 | 無 | 有 |
| 3 | 有(含leg) | 有 | 無 | 無 | 無 |
| 4 | 有 | 有 | 有 | 無 | 有 |
| 5 | 有 | 有 | 無 | 無 | 有 |
| 6 | 有 | 無 | 無 | 無 | 有 |
| 7 | 無 | 有 | 無 | 有 | 有 |
| 8 | 無 | 無 | 無 | 無 | 無 |

### 3. `cities`（陣列，**4 筆**：WAW/KRK/WRO/POZ）
用途：四城總覽卡（用於城市選單／封面）。
欄位：`key, name, pl, tag, nights, totalNights(僅WAW/KRK有), stayNote(僅WAW/KRK有), vibe, highlights[](每筆4個字串), photo{hero,thumb}`

### 4. `photoSpots`（陣列，**10 筆**）
用途：攝影點清單，標記各城最佳拍照時段與光線。
欄位：`id, cityKey, day, name, bestTime, light`

### 5. `photoCredits`（陣列，**8 筆**）
用途：城市封面照片的 CC 授權標註（每城 hero+thumb 各一筆，4 城 ×2）。
欄位：`file, city, author, license, licenseUrl, url`
（檔內註解特別提醒：`licenseUrl` 是授權條款頁、`url` 是照片來源頁，兩者不可互換。）

### 6. `trains`（陣列，**5 筆**）
用途：城際火車／巴士時刻總表（跨城段落，不含市內交通）。
欄位：`seg, date, type, dep, arr, dur, price`；Auschwitz 巴士那筆額外有 `leg` 欄位標示「往返全程」。
（檔內註解特別提醒：這筆 `arr:14:30` 是回抵克拉科夫的時間，不是抵達奧斯威辛的時間，抵達時間記在 `days[2].train`。）

### 7. `bookingTiers`（陣列，**3 筆**，共 16 個訂票項目）
用途：訂票優先順序分級清單。
欄位：`tier, note, items[]`；`items[]` 子欄位 `name, url`。
筆數：第一優先 6 項、第二優先 6 項、餐廳與備案 4 項。

### 8. `flights`（物件，非陣列）
用途：來回段機票時刻。
子集合：`out[]`（5 段，含 2 段轉機）、`back[]`（5 段，含 2 段轉機）。
欄位：`code, leg, when, dur, layover(選填布林值，僅轉機列有)`

### 9. `stay`（陣列，**4 筆**）
用途：四城住宿選區建議。
欄位：`city, en, pick, note, tip`

### 10. `tickets`（陣列，**4 筆**，依城市分組，共 17 個票券項目）
用途：門票速查表資料源。
欄位：`city, items[]`；`items[]` 為 `[名稱, 價格說明]` 二元陣列（非物件）。
筆數：華沙 6、克拉科夫 6、樂斯拉夫 2、波茲南 3。

### 11. `foods`（陣列，**12 筆**）
用途：全波蘭必吃美食圖鑑（非城市分組，通用）。
欄位：`n, cn, pl, desc`

### 12. `cityFood`（陣列，**4 筆**，依城市分組，共 35 個餐廳項目）
用途：主餐廳推薦清單。
欄位：`city, en, items[]`；`items[]` 子欄位 `tag, name, note, book, map(選填)`
筆數：華沙 11、克拉科夫 10、樂斯拉夫 8、波茲南 6。

### 13. `foodBackup`(陣列，**4 筆**，依城市分組，共 32 個備案餐廳項目)
用途：主餐廳客滿時的備案清單。
欄位同 `cityFood`：`city, en, items[]`（子欄位 `tag, name, note, book, map選填`）
筆數：華沙 10、克拉科夫 10、樂斯拉夫 6、波茲南 7。

### 14. `safety`（物件，非陣列）
用途：緊急聯絡與安全提醒。
子集合：`emergency[]`（5 筆，`[名稱,號碼]`）、`embassy[]`（4 筆，`[名稱,值]`）、`tips[]`（4 筆，`{label,text}`）

### 15. `practical`（陣列，**6 筆**）
用途：寄物／換錢／SIM／付款／退稅／交通卡等實用資訊。
欄位：`tag, name, note`

### 16. `reservations`（陣列，**8 筆**）
用途：訂票時程表（何時該訂什麼）。
欄位：`when, what`

### 17. `shopping`（陣列，**7 筆**）
用途：伴手禮總覽（陶瓷、琥珀、伏特加等，非城市分組）。
欄位：`tag, name, note`

### 18. `cityStories`（陣列，**4 筆**）
用途：城市歷史文化背景讀物（深度閱讀內容，非行程操作資訊）。
欄位：`city, en, geo, history, stories[](每城3–4則,子欄位title/text), onSite[](每城3個字串)`

### 19. `phrases`（陣列，**12 筆**）
用途：波蘭語常用句。
欄位：三元陣列 `[中文, 波蘭語, 音譯]`（音譯部分空字串出現於 3 筆：'是/否'、'廁所在哪'、'買單'、'多少錢' 這幾筆無音譯）

### 20. `packingDefault`（物件，非陣列）
用途：打包清單，4 大分類：
`證件與金錢`(5項) / `電子`(5項) / `衣物（10月波蘭）`(5項) / `藥品盥洗`(4項)

### 21. `about`（陣列，**9 筆**）
用途：旅遊基本須知（語言/電壓/時區/匯率/物價/小費/簽證/ETIAS）。
欄位：二元陣列 `[標籤, 內容]`

---

## B. poland-travel-guide-final.html — Section 盤點（共 10 個，與 grep 結果一致）

導覽列（`nav.tabs`）10 個分頁與 section id 完全對應：01–10。

| # | section id | 中文標題 | 子區塊 |
|---|---|---|---|
| 01 | `warsaw` | 華沙 Warszawa · WAW | 1 張 Leaflet 地圖 + 景點表格(12列) + 美食表格(21列) + 1 個 note 備註框 |
| 02 | `krakow` | 克拉科夫 Kraków · KRK | 1 張地圖 + 景點表格(6列) + 美食表格(13列) + note |
| 03 | `wroclaw` | 樂斯拉夫 Wrocław · WRO | 1 張地圖 + 景點表格(8列) + 美食表格(11列) + note |
| 04 | `poznan` | 波茲南 Poznań · POZ | 1 張地圖 + 景點表格(9列) + 美食表格(11列) + note |
| 05 | `michelin` | 米其林 2026 | 城市/星級總表(4列) + note.warn 提醒框 + 訂位&預算 fare 表格(9列) + note |
| 06 | `fares` | 門票速查 | 單一 fare 表格，21 列（景點/全票/優待/備註，含每列一個官網連結按鈕） |
| 07 | `transit` | 市內交通 | 票價速查表(4列) + 機場↔市區表(6列,含rowspan) + note + 推薦App卡片區(4張) + 幾日券checklist(4項) + 實用路線checklist(5項) + note |
| 08 | `souvenir` | 伴手禮 | 卡片區(14張) + 精品購物表格(2列) + note |
| 09 | `store` | 超商 | note + Żabka怎麼逛卡片區(7張) |
| 10 | `notes` | 行前提醒 | checklist(9項) + note |

各景點/美食表格欄位標題統一為：
- 景點表：`景點 / 類型 / 票價 備註`
- 美食表：`店家 / 等級 / 重點 招牌`
- fares 表：`景點 / 全票 / 優待 / 備註`
- michelin 訂位表：`餐廳 / 每人 PLN / 訂位管道 備註`
- transit 票價表：`城市 / 短程 / 90分 / 24小時 / 備註`
- transit 機場表：`路線 / 方式 / 票價 / 時間 / 備註`
- souvenir 精品表：`店家 / 城市 / 備註`

---

## C. 交集與衝突比對（已逐項比對，非只抽查）

比對範圍：兩份資料中同時出現的景點票價、開放狀態、地點、數量等具體事實，共交叉比對約 22 個共同主題。

**發現 12 筆確定衝突，逐筆列出如下：**

1. **華沙皇家城堡票價**（最大衝突）
   - data.js `days[6].warn`（行 223）、`tickets`（行 351）：「官網分級為 PLN 50／40／100」
   - HTML `poland-travel-guide-final.html:180`（景點表）、`:391`（fares表）：「博物館/王室路線 60/45 · 城堡路線 95/75 · 宮殿路線 30/20 · 金票(全區) 110/90」
   - 兩邊價格體系完全不同（50/40/100 vs 30–110 多階），改版時須以 HTML 較新（2026-08 查證）或重新查證官網為準，不可直接沿用 data.js 數字。

2. **科學文化宮觀景台票價**
   - data.js `tickets`（行 355）、多處 `steps.cost`：一律寫 `PLN 25`
   - HTML `:183`（景點表）、`:392`（fares表）：「PLN 30 / 優待 25」，且明註「已更新（原標 25）」——HTML 自己承認 25 是舊資料。
   - 結論：data.js 的 25 元是舊值，HTML 30/25 較新。

3. **Auschwitz 導覽票價**
   - data.js `days[2].steps`（行 101）、`tickets`（行 362）：固定 `PLN 150`
   - HTML `:237`（景點表）、`:401`（fares表）：「約 130–150（優待 120）」
   - 價格區間與是否有優待價不一致。

4. **Auschwitz 訂票開放時間**
   - data.js `warn`（行 107）、`reservations`（行 514）：「參觀日前 90 天開放訂位」
   - HTML `:401`（fares表備註）：「提前 2–3 週訂」
   - 兩邊給的訂票時程建議差距很大（90 天 vs 2–3 週），會直接影響使用者何時該動作，建議之後只保留一個版本並重新查證。

5. **樂斯拉夫百年廳票價**
   - data.js `tickets`（行 367）：`PLN 30`
   - HTML `:281`（景點表）、`:404`（fares表）：「PLN 25 / 優待 20」

6. **樂斯拉夫百年廳 10/28 是否關閉圓頂展廳，語氣不同**
   - data.js `days[4].warn`（行 171）：明確斷言「❗10/28（正好是本日）圓頂展廳不開放」，來源為官方預約日曆查證。
   - HTML `:281`：僅泛稱「圓頂偶因活動關閉，行前 3–5 天查 halastulecia.pl 確認」，未特別標註 10/28 這天。
   - 若改版把兩者合併，須決定以 data.js 的「已查證、確定 10/28 關閉」為準，還是採用 HTML 較保守、未特定日期的說法。

7. **波茲南帝王城堡票價**
   - data.js `days[5].steps`（行 194）、`tickets`（行 372）：`PLN 16`
   - HTML `:324`（景點表）：「多為免費入場，特展/導覽另計」
   - 一邊說要付費 16 元，一邊說多半免費，屬直接矛盾。

8. **波茲南教堂島 Ostrów Tumski 票價**
   - data.js `days[5].steps`（行 190）：09:00 該行程 `cost:'PLN 16'`
   - HTML `:325`（景點表）：無票價欄位內容（暗示免費，僅標「古城」）
   - 備註：data.js 這筆 16 元與同一天 14:00 帝王城堡的 16 元數字相同，不排除是資料建置時複製貼上留下的筆誤，改版時建議一併查證波茲南主教座堂本身是否收費。

9. **華沙 Neon 霓虹博物館：價格與地點皆不同**
   - data.js `days[6].extend`（行 226）：「Praga 區，共產時期霓虹招牌收藏，PLN 20」
   - HTML `:175`（景點表）、`:393`（fares表）：「PLN 25 / 優待 18」且「已遷入科學文化宮 4 樓（Marszałkowska 入口）」
   - 這筆不只是價格差（20 vs 25/18），**地點也不同**——data.js 說在 Praga 區，HTML 說已搬到科學文化宮 4 樓。若照 data.js 帶旅客去 Praga 會撲空，是本次比對中風險最高的一筆。

10. **波茲南古市政廳博物館：data.js 未反映閉館**
    - data.js `tickets`（行 373）：`['古市政廳博物館', 'PLN 10']`，寫法暗示可正常購票入場。
    - HTML `:323`（景點表）、`:410`（fares表）：「2026/7/1–2027/11/30 整修閉館，行程期間無法入內，僅能外觀」
    - data.js 完全沒有提到閉館這件事，若改版沿用 data.js 的 `tickets` 集合，使用者會被誤導成可以買票入內。

11. **樂斯拉夫小矮人尊數**
    - data.js `cityStories`（行 572）：「城裡 600+ 尊銅製小矮人」
    - HTML `:276`（景點表）：「全城 1000+ 尊小銅像」
    - 兩邊給的總數差了近一倍。

12. **波茲南山羊鐘樓秀場次**
    - data.js `days[5].steps`（行 192）：`sub:'每天中午限定'`，暗示一天僅一場。
    - HTML `:321`（景點表）：「每日正午兩隻機械山羊頂角 12 次（部分資料另有 15:00 場，現場再確認）」——HTML 自己也不確定是否有下午場，但至少提出了這個疑點，data.js 完全未提及。

**未發現衝突、資訊一致（或僅 HTML 補充細節、不算矛盾）的共同主題，共比對約 10 項，包含：**
辛德勒工廠票價(60/45)、維利奇卡鹽礦票價(143/121)、POLIN票價(45)、華沙起義博物館票價(35/30)、拉茨瓦維採全景畫票價(50)、蕭邦博物館 2026 全年閉館、Sukiennice紡織會館免費、MSN現代美術館(Gallery A免費+晚間30)、瓦維爾城堡套票區間(45–65，與HTML的30–47/199–149大致同量級但顆粒度不同，未列為確定衝突)、Wieliczka鹽礦3個月前開放訂位(HTML未提及但不矛盾)。

---

## D. Leaflet 地圖盤點（共 4 張，位於 HTML 檔尾 `<script>`，行 565）

| 容器 id | 對應城市 | center 座標 | zoom | 圖釘數 |
|---|---|---|---|---|
| `leaflet-warsaw` | 華沙 Warszawa | `[52.235, 21.01]` | 13 | 14 |
| `leaflet-krakow` | 克拉科夫 Kraków | `[50.058, 19.94]` | 13 | 20 |
| `leaflet-wroclaw` | 樂斯拉夫 Wrocław | `[51.111, 17.045]` | 13 | 9 |
| `leaflet-poznan` | 波茲南 Poznań | `[52.408, 16.935]` | 13 | 8 |

- 圖釘資料結構：`[lat, lng, 名稱, 分類註記, Google Maps連結, 分類代碼]`，分類代碼共 8 種（`sight/star2/star1/bib/food/shop/store/luxury`），對應右下角圖例（`map-legend`）自動生成顏色圓點。
- 地圖初始化程式：`initMaps()`（行 566），用 `L.map(el,{scrollWheelZoom:false}).setView(center, zoom)` + OpenStreetMap tile layer，逐點 `L.circleMarker` 加 popup。

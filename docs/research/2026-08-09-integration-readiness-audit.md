# 2026 波蘭行程整合前最終盤點

- 查證日期：2026-08-09（Asia/Taipei）
- 行程日期：2026-10-24 至 2026-10-31
- 固定路線：華沙 → 克拉科夫 → 樂斯拉夫（Wrocław）→ 波茲南 → 華沙
- 唯讀檢查範圍：`src/data/trip.js`、`transit.js`、`tickets.js`、`cities.js`、`dining.js` 與既有 `docs/research/`
- 來源原則：交通、場館與餐廳營業資訊以營運單位官網為主；Michelin Guide 是 Michelin 評鑑的第一方來源，但不能證明餐廳當日營業；Google Maps 評價則是非第一方動態資料。每項結論均以本文件查證日為準，指定日期庫存、臨時閉館、工程改道與月台仍須在出發前複查。

## 結論

目前資料經修正後已達到**可準備整合、但不能把待購票項目宣稱為已確認**的狀態。日期、城市順序、住宿晚數與主要博物館的保守標示大致正確；本次發現並處理下列項目：

1. `dining.js` 的 2026 米其林資料已由 Michelin 官方 2026 發布確認：Alon Omakase 為華沙新一星，BABA 由 2025 Bib 升為一星，Most 為樂斯拉夫新一星；NUTA、Rozbrat 20、hub.praga、Muga 保持一星，Bottiglieria 1881 保持二星。先前只查 2025 餐廳頁而得出的衝突結論錯誤，已更正。[Michelin Poland 2026 官方發布](https://www.michelin.com/en/publications/products-and-services/the-michelin-guide-poland-2026)（查證：2026-08-09）
2. `cities.js` 仍有大量無抓取日期的 Google 星等與評論數；這些數字會變動，也不是場館／店家第一方資料，不能宣稱為「最新」。整合前應移除數字，或加上「Google Maps 非第一方快照＋抓取日期」。店家是否仍營業須另由官網／官方社群／訂位頁確認。（查證：2026-08-09）
3. Auschwitz 日的巴士已改用較精確的官方串接資料。博物館官方交通頁直接連到 Lajkonik；業者現行去程班表（有效期自 2026-03-01 起至另行通知）有 Kraków MDA 07:10 → Muzeum Auschwitz 08:35，適合 10:00 導覽；現行回程頁列 13:45 與 15:30，3.5 小時導覽約 13:30 才結束，13:45 幾乎沒有離場緩衝，因此網站已改以 15:30 → Kraków MDA 16:55 為較安全參考。[Auschwitz 官方交通說明](https://www.auschwitz.org/zwiedzanie/dojazd/)、[Lajkonik 去程](https://www.lajkonikbus.eu/krakow-oswiecim.html)、[Lajkonik 回程](https://www.lajkonikbus.eu/oswiecim-krakow.html)（查證：2026-08-09；回程頁仍標「2024-01-01 起至另行通知」，購票前必須再查）
4. Day 3 的「無 Auschwitz 導覽額度」備案目前寫 MOCAK＋Galicia Jewish Museum，但 10/26 是星期一，MOCAK 官網明載星期一閉館；這個雙館備案不可行。Galicia Jewish Museum 官網則列每日 10:00–18:00，可單獨作星期一備案。[MOCAK 官方開放時間](https://en.mocak.pl/opening-hours)、[Galicia Jewish Museum 官方實用資訊](https://galiciajewishmuseum.org/en/visit/practical-information/)（查證：2026-08-09）

上列靜態資料修正完成後可整合進雲端；但在官方售票系統取得 4 段城際車與指定日景點票之前，網站仍須維持「待確認／待購」狀態，不能稱為全部完成訂票。

## 一、檔案逐項盤點

| 檔案 | 盤點結果 | 整合前處理 |
| --- | --- | --- |
| `trip.js` | 8 天 7 夜、日期與城市順序一致；城際車都標成「目標」而非已確認，做法正確。Auschwitz 回程時刻需修正；Day 2、5、7 都是高強度且依固定入場時間成立。 | 修正 Auschwitz 巴士；城際車開賣後用唯一車次覆蓋目標值；指定票未付款前不得改成已訂。 |
| `transit.js` | 市內交通採「抵達日／當日確認」的保守做法合理，但缺城際官方購票入口、官方全國時刻表入口與實際教學。 | 加入 PKP Intercity e-IC 2.0、Portal Pasażera、Lajkonik 入口與下方教學。 |
| `tickets.js` | 主要場館票價與營業規則大致和官網一致；動態票量也有保留。原華沙皇家城堡 `officialUrl` 指向測試／鏡像網域。 | 已改用 `https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026`。 |
| `cities.js` | 景點集合完整，但 Google 星等與評論數沒有日期；「1000+ 小矮人」、「最多人造訪」等宣傳性主張也未逐項附第一方證據。 | 動態星等移除或加來源日期；宣傳性形容降級成建議，不當作已查證事實。 |
| `dining.js` | 4 間 `verifiedRestaurantHours` 有官網支持；Michelin 2026 星級／Bib 摘要可由官方發布支持。 | 保留 Michelin 2026；移除無抓取日的 Google 評價數；未指定分店者不可標「已確認營業」。 |

餐飲筆數須注意資料結構會重複呈現同一店家：`cityDining` 本身有 56 列，另有 `cityFood`、`foodBackup`、`foods`、Michelin 與行程 `eat` 清單。若以前端去重後的「67 筆餐廳」作盤點單位，本次**不能逐店證明 67 筆都仍營業**；除下方 4 間有店家官網直接確認的分店外，其餘一律應標成「探索清單／出發前複查」，不可顯示「最新營業已確認」。（查證：2026-08-09）

## 二、火車官網、時刻表狀況與購票教學

### 2.1 建議放進網站的官方入口

| 用途 | 官方入口 | 可確認內容 |
| --- | --- | --- |
| 全波蘭時刻表 | [Portal Pasażera](https://portalpasazera.pl/en) | 查出發／抵達、直達或轉乘、承運商、完整沿途站與預定月台；官網提醒月台會因現場調度變更。 |
| PKP Intercity 購票 | [e-IC 2.0](https://ebilet.intercity.pl/) | 購買 EIP、EIC、IC、TLK 等 PKP Intercity 國內票；入口可能對自動化瀏覽器回應 403，但仍是 PKP Intercity 官方售票網域。 |
| PKP Intercity 首頁 | [PKP Intercity](https://www.intercity.pl/en/) | 規則、公告、App 與客服入口。 |
| 官方售票規則 | [e-IC 規章（2026-03-04 起版本）](https://regulamin-eic.intercity.pl/files/Tekst_ujednolicony_Regulamin_e-IC_zmiany_1-32_FK.pdf) | 可不註冊購票，但須填姓名、電子郵件並接受規章；App 購票需註冊；付款選定後有 15 分鐘限制。 |

Portal Pasażera 官方教學說明：搜尋結果可展開車次、承運商與完整時刻，並可導向承運商購票；一般預售多為最早 30 天前，少數國際列車為 60 天前。該站也說明時刻異動最晚會在新時刻生效前 21 天公開，並每週更新；因此現在不能把 10 月目標時間寫成最終時刻。[Portal Pasażera 官方教學](https://portalpasazera.pl/en/Poradnik)（查證：2026-08-09）

### 2.2 四段城際車狀態

| 日期 | 路段（搜尋時使用完整站名） | 現有網站目標 | 最早 30 天參考日 | 本次查證結論 |
| --- | --- | --- | --- | --- |
| 10/25 | Warszawa Centralna → Kraków Główny | 約 09:00，約 2.5 小時 | 09/25 | 尚無可固定的官方 10/25 車號、票價、月台或座位；EIP／IC 車種也須以售票結果為準。 |
| 10/27 | Kraków Główny → Wrocław Główny | 約 19:30，約 2 小時 50 分 | 09/27 | 尚未確認；開賣後應以「直達」及抵達時間反推當日 Kazimierz 可停留多久。 |
| 10/28 | Wrocław Główny → Poznań Główny | 約 19:00，約 2 小時 20 分 | 09/28 | 尚未確認；須先鎖定車次，才能承諾看完座堂島點燈再取行李。 |
| 10/29 | Poznań Główny → Warszawa Centralna | 約 17:30，約 2 小時 20 分 | 09/29 | 尚未確認；不能先寫成 EIP，須以實際搜尋的承運商／車種為準。 |

上述日期是依官方教學「通常最早 30 天」倒推的**提醒日，不是保證開賣日**；鐵路可能整批調整或延後放票，應從提醒日前 1–2 天開始每日查一次。[Portal Pasażera 官方教學](https://portalpasazera.pl/en/Poradnik)（查證：2026-08-09）

### 2.3 白話購票教學

1. 先到 [Portal Pasażera](https://portalpasazera.pl/en)，輸入完整車站名、日期與希望出發時間；勾選 `Direct connections`，避免誤買需轉車行程。搜尋結果可看車號、承運商、沿途站與當下公告。[官方教學](https://portalpasazera.pl/en/Poradnik)（查證：2026-08-09）
2. 選定班次後按 `Buy ticket`，或直接到 [PKP Intercity e-IC 2.0](https://ebilet.intercity.pl/) 以相同起訖站與日期搜尋。只把售票頁真的顯示的 EIP／EIC／IC／TLK、出發時間、到站時間與車號寫回網站。
3. 選人數、二等／一等與座位偏好。沒有符合波蘭法定優待資格時選一般票，不要因為是外國學生或長者就自行套用波蘭折扣；若選優待，搭車時須能出示符合規定的證明。
4. 填一位實際搭車者的姓名與電子郵件；多人同票時規章只要求票面列其中一位旅客，但票面姓名的人必須同行。未註冊也可在 e-IC 2.0 購票，App 則須註冊。[e-IC 規章，第 37、54–58 點](https://regulamin-eic.intercity.pl/files/Tekst_ujednolicony_Regulamin_e-IC_zmiany_1-32_FK.pdf)（查證：2026-08-09）
5. 核對日期、起訖站、直達／轉乘、車次、車廂、座位、姓名與價格後付款。官方規章要求選定後 15 分鐘內完成付款，否則交易取消。[e-IC 規章，第 15–18、28 點](https://regulamin-eic.intercity.pl/files/Tekst_ujednolicony_Regulamin_e-IC_zmiany_1-32_FK.pdf)（查證：2026-08-09）
6. 下載 PDF／加入官方 App 並離線保存；若之後改票面姓名，要重新下載更新票。出發當日再用 Portal Pasażera／PKP Intercity App 查誤點與月台，並以車站螢幕及廣播為準，因官方明示預定月台可能臨時變更。[Portal Pasażera 官方教學](https://portalpasazera.pl/en/Poradnik)、[e-IC 規章](https://regulamin-eic.intercity.pl/files/Tekst_ujednolicony_Regulamin_e-IC_zmiany_1-32_FK.pdf)（查證：2026-08-09）

### 2.4 Auschwitz 巴士時刻與購票

- 博物館官方交通頁明確指出 Lajkonik 直達巴士會開到博物館停車場，這是現有資料缺少的官方串接。[Auschwitz 官方交通頁](https://www.auschwitz.org/zwiedzanie/dojazd/)（查證：2026-08-09）
- 去程目前應改成 **Kraków MDA（Bosacka 18，地下月台 D10）07:10 → Muzeum Auschwitz 08:35**；10:00 導覽前有 85 分鐘，可完成寄物、安檢並提早 30 分鐘報到。[Lajkonik 去程班表與線上購票](https://www.lajkonikbus.eu/krakow-oswiecim.html)、[Auschwitz 參觀規則](https://www.auschwitz.org/en/visiting/)（查證：2026-08-09）
- 10:00 標準導覽約 3.5 小時，13:45 回程過緊；目前保守選擇為 **Muzeum Auschwitz 15:30 → Kraków MDA 16:55**。回程頁的有效期標示較舊，付款前必須再次核對 10/26 指定日；若業者售票頁未顯示該班次，就改查 Oświęcim 火車站的官方鐵路班次，不用猜測。[Lajkonik 回程班表](https://www.lajkonikbus.eu/oswiecim-krakow.html)（查證：2026-08-09）

## 三、主要景點／博物館最新核對

| 日期／景點 | 官方查證結果 | 對現有安排的判斷 |
| --- | --- | --- |
| 10/25 Wawel Castle | 10 月週二至週日 09:00–17:00；一、二樓完整路線 95／71 PLN，最後入場為閉館前 120 分鐘；官網票通常提前一個月開放。[官方參觀頁](https://wawel.krakow.pl/en/what-to-see)、[官方 FAQ](https://wawel.krakow.pl/en/common-questions)（查證：2026-08-09） | 14:00 入場可行，但 2 小時會壓到 16:00；同日再排中央廣場與 17:30 辛德勒工廠，任何火車／午餐延誤都會造成連鎖衝突。 |
| 10/25 Wawel Cathedral | 4–10 月週日 12:30–17:00，售票至 16:30；大教堂博物館週日不開。[官方參觀資訊](https://www.katedra-wawelska.pl/en/katedra-wawelska/zaplanuj-wizyte/)（查證：2026-08-09） | 13:00 可行；若華沙火車晚到，先保城堡已訂時段，縮短或取消大教堂內部。 |
| 10/25 辛德勒工廠 | 週二至週日 09:00–20:00、最後入場 18:30；60／45 PLN；個人網路票於 90 天前 09:00 開放，票具名且入場須帶原始身分證件。[官方分館頁](https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory%C2%A0)（查證：2026-08-09） | 17:30 合規且已在可售窗口；應立即以售票頁實查／購買。 |
| 10/26 Auschwitz-Birkenau | 10 月可入場時段 07:30–17:00；標準導覽約 3.5 小時；自 2026-03-01 起所有入場證只在官方網路提供，入口不售票；至少提早 30 分鐘到，隨身包不得超過 35×25×15 cm。[官方參觀資訊](https://www.auschwitz.org/en/visiting/)、[2026 線上入場證公告](https://www.auschwitz.org/en/museum/news/visit-auschwitz-org-entry-cards-to-the-memorial-available-only-online-from-1-march%2C1819.html)（查證：2026-08-09） | 10:00 英文導覽方向正確；庫存與價格只能以 [官方預約](https://visit.auschwitz.org/) 實查。交通改用 07:10 去／15:30 回的保守版。 |
| 10/26 MOCAK／Galicia 雨備 | MOCAK 週二至週日 11:00–19:00，星期一閉館；Galicia Jewish Museum 每日 10:00–18:00。[MOCAK 官方時間](https://en.mocak.pl/opening-hours)、[Galicia 官方時間](https://galiciajewishmuseum.org/en/visit/practical-information/)（查證：2026-08-09） | 現有「兩館同看」備案在星期一錯誤；刪除 MOCAK，只保留 Galicia，或另找星期一開館的第一方已確認備案。 |
| 10/27 Wieliczka 鹽礦 | Tourist Route 約 2–3 小時、3.5 km、深 135 m、800+ 階、地下約 17–18°C；通用頁只承諾票價 `from 131 PLN`，指定日英文場與價格要看日期選擇器。[官方路線](https://www.wieliczka-saltmine.com/individual-tourist/tourist-route)、[官方票價／時間](https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours)（查證：2026-08-09） | 10:00 英文團合理，但必須先買到場次；出場時間應抓到 13:00 左右，不宜承諾 13:00 已坐下吃完整午餐。 |
| 10/28 Panorama Racławicka | 4/1–10/31 每日 08:30–19:00，指定場次 30 分鐘，50／35 PLN；2026 閉館日不含 10/28。[官方資訊](https://mnwr.pl/en/branches/panorama-of-the-battle-of-raclawice/information/)（查證：2026-08-09） | 11:30 合規；應購指定時段。 |
| 10/28 百年廳 | 4–10 月週二至週日 10:00–18:00；Visitor Centre 25／20，含大廳 30／25；廳內是否可看依 availability calendar。[官方 Visitor Centre](https://halastulecia.pl/zwiedzanie/visitor-centre/)、[官方訪客頁](https://halastulecia.pl/en/for-visitors/)（查證：2026-08-09） | 13:30 可行，但未看到 10/28 availability 前只能保證 Visitor Centre／外觀，不能承諾大廳內部。 |
| 10/29 波茲南正午山羊 | 市府資料確認每日正午，機械山羊互頂 12 次。[Poznań 市府老城路線](https://www.poznan.pl/mim/main/en/-%2Cp%2C661%2C22074%2C22076.html)（查證：2026-08-09） | 12:00 可保留；不採非官方 15:00 說法。 |
| 10/29 可頌博物館 | 個人票按官方售票日曆；固定英文公開場資訊以週末 14:00 為主，週四英文場不能預先保證。[官方英文頁](https://rogalowemuzeum.pl/en/)、[官方購票](https://rogalowemuzeum.pl/en/buy-ticket/)（查證：2026-08-09） | 只作雨備正確；10/29 售票頁沒有英文場就不要排。 |
| 10/30 華沙皇家城堡 | 2026-05-02 起週二至週日 10:00–18:00、最後入場 17:00；Castle Route 95／75，含語音導覽。[官方 2026 時間與票價](https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026)（查證：2026-08-09） | 10:00 第一站正確；完整路線抓 2 小時，午餐不能排在需要久候的店。 |
| 10/30 POLIN | 週五 10:00–18:00；核心展最後入場 16:00；入口有安檢，館方對特定區域有人流限制。[官方 FAQ](https://www.polin.pl/en/planning-your-visit/frequently-asked-questions)（查證：2026-08-09） | 13:15 入場可行；2 小時只能看重點，若想完整理解應和起義博物館二擇一深看。 |
| 10/30 華沙起義博物館 | 週二閉館；常設展建議約 2 小時，少於閉館前 2 小時入場只能看部分；票價 35／30 PLN，官方售票入口是 `bilety.1944.pl`。[官方規章](https://bilety.1944.pl/pliki/regulamin_zwiedzania_muzeum_powstania_warszawskiego.pdf)、[官方票價](https://bilety.1944.pl/cennik.html)、[官方售票](https://bilety.1944.pl/?lang=en)（查證：2026-08-09） | 16:00 必須先看到 10/30 可售時段才成立；前館延誤時，不應用趕展方式硬塞。 |

## 四、餐廳與評價資料盤點

### 4.1 可確認仍營業、且和行程直接相關

| 城市／店家 | 店家第一方確認 | 行程建議 |
| --- | --- | --- |
| 華沙 U Fukiera | Rynek Starego Miasta 27；週五 12:00–23:30，官網有訂位入口。[店家官網](https://www.ufukiera.pl/kontakt/)（查證：2026-08-09） | 適合 10/30 最後晚餐；19:30 先訂位。價格與「好不好吃」不是官網能證明，應另標非第一方評價。 |
| 華沙 Polka | Świętojańska 2，皇家城堡旁；每日 12:00–22:00，官網有訂位入口。[店家官網](https://warszawa.restauracjapolka.pl/about-us)（查證：2026-08-09） | 最適合 Day 7 城堡後快速午餐，但 45 分鐘仍應先訂位並註明行程時間。晚餐則是 U Fukiera 客滿時的地理備案。 |
| 華沙 E.Wedel Pijalnia | Krakowskie Przedmieście 45；週五、週六 10:00–23:00，週日 10:00–22:00。[官方分店表](https://wedelpijalnie.pl/lokale)（查證：2026-08-09） | Day 1／Day 7 可用；現有資料正確。不要套用 Złote Tarasy 非營業週日規則到這間街邊店。 |
| 樂斯拉夫 Konspira | Plac Solny 11；週一至四 13:00–23:45、廚房到 23:00；週一至四可送訂位詢問，店家回覆後才算確認。[店家官網](https://restauracjakonspira.pl/menu)（查證：2026-08-09） | 10/28 是週三，營業規則相容；但當天 19:00 目標火車使晚餐不可行，應改成 12:30 左右午餐或放棄，不要同時排 Panorama 11:30 與百年廳 13:30 後還期待完整正餐。 |

直接寫進每日時間軸的其他餐飲仍有缺口：Day 1 `Zapiecek · Podwale 19`、Day 2 Plac Nowy 的 Endzior／Krzysiek，以及各日 `eat` 欄位的多數店家，本次未找到同時能確認「指定分店、指定日期營業、可否訂位」的店家第一方資料。它們可以保留為探索候選，但不能和上表 4 間同樣標成已確認；出發前選定單一店家與地址後，再查店家官網／官方社群／有效訂位頁。（查證：2026-08-09）

### 4.2 Michelin 與 Google 評價的正確標示方式

- Michelin Guide 是 Michelin 評鑑的第一方來源，但不是餐廳營業公告。2026 官方發布確認：Bottiglieria 1881 二星；Alon Omakase、BABA、Most 為 2026 新一星／升星，NUTA、Rozbrat 20、hub.praga、Muga 維持一星；新 Bib 名單亦包含網站列出的 WANDAL、WIN、AHAAN、Nat Bistro、Bufet KRK、Pijalni 等。[Michelin Poland 2026 官方發布](https://www.michelin.com/en/publications/products-and-services/the-michelin-guide-poland-2026)（查證：2026-08-09）
- Google Maps 星等與評論數是非第一方動態資料。若保留，格式應是「Google Maps 4.x／評論數，擷取 2026-08-09」，而不是直接寫在 `tier` 或 `tag` 裡讓讀者誤認為長期事實；更穩妥的做法是只保留地圖連結與店家類型。（查證：2026-08-09）
- `dining.js` 中未指定分店或沒有官網／官方社群／有效訂位頁的店，只能標成「候選」，不能標「已確認營業」。例如 `Gościniec / Zapiecek / u Kresowiaka` 把三個品牌寫在同一列，無法查營業、地址或訂位，整合前必須拆店與選分店。（查證：2026-08-09）

## 五、每日移動與行程可行性建議

| 日 | 已確認骨架 | 盤點與建議 |
| --- | --- | --- |
| Day 1，10/24 華沙 | 13:30 抵達、只排戶外老城 | 合理。入境、行李、進城任何延誤都不影響已購票景點；晚餐採老城附近有營業分店即可。 |
| Day 2，10/25 華沙→克拉科夫 | 城際移動＋Wawel＋辛德勒工廠 | 全程最脆弱日之一。先鎖火車，再鎖 Wawel 14:00 與辛德勒 17:30。若火車晚點，優先順序是「已購 Wawel／辛德勒」高於大教堂、中央廣場與紡織會館；中央廣場可移到 Day 4。 |
| Day 3，10/26 Auschwitz | 10:00 官方英文導覽 | 改成 07:10 Lajkonik 去、15:30 回，約 16:55 抵 Kraków MDA。晚餐排 18:00 後合理；不要再加博物館。 |
| Day 4，10/27 Wieliczka＋克拉科夫→樂斯拉夫 | 10:00 鹽礦、晚間城際車 | 可行，但需先鎖鹽礦與火車。鹽礦結束與回市區後，把 Kazimierz／紡織會館當二選一；至少保留取行李、到站 60 分鐘。 |
| Day 5，10/28 樂斯拉夫→波茲南 | Panorama、百年廳、座堂島、晚間車 | 動線跨老城—百年廳—座堂島—車站，強度很高。建議 11:30 Panorama 後直接簡餐，13:30 百年廳；百年廳內部不可看時立即回老城／座堂島。Konspira 若要吃應改午餐並預約，否則以外帶取代。 |
| Day 6，10/29 波茲南→華沙 | 教堂島、12:00 山羊、晚間車 | 合理。雨備可頌博物館不能預設週四英文場；帝王城堡／Stary Browar 維持可壓縮。17:30 只是目標，買到實際火車後重排 14:00 後內容。 |
| Day 7，10/30 華沙三館 | 皇家城堡、POLIN、起義博物館 | 地理上可完成，但內容沉重且幾乎無遲延空間。建議預設「皇家城堡＋POLIN 深看」，起義博物館只有在 16:00 已購票且前館準時離開時才進；或反過來保留皇家城堡＋起義，POLIN 改重點版。午餐用 Polka 這類靠城堡且可訂位的店，晚餐訂 U Fukiera。 |
| Day 8，10/31 離境 | 11:00 前到機場、14:40 起飛 | 合理，不新增正式景點。SKM 班次、月台與票價當日查 WTP；有退稅品時維持更早到場。 |

## 六、整合前清單

### P0：未完成前不要推成「最終正確版」

- 保留已由 Michelin 2026 官方發布確認的星級與 Bib；移除沒有擷取日期的 Google 星等／評論數，避免把動態快照當長期事實。
- 修正 Auschwitz 巴士為 07:10 → 08:35、保守回程 15:30 → 16:55，加入 Lajkonik 官方購票與班表連結；指定日付款前再查。
- 在 PKP Intercity 開賣後，逐段寫回「車號、車種、起訖完整站名、出發／抵達、座位、票價、購票狀態」；未付款前保持 pending。
- 實際購買／確認 Wawel、辛德勒、Auschwitz、Wieliczka、Panorama、皇家城堡、POLIN 與起義博物館的指定日票；目前官網營業規則正確不等於有票。

### P1：整合時一併修正

- 移除 `cities.js` 無日期 Google 星等／評論數，或加「非第一方快照＋擷取日」。
- 皇家城堡 URL 已換成正式 `www.zamek-krolewski.pl`。
- `transit.js` 加 Portal Pasażera、e-IC 2.0、PKP Intercity 與上述白話購票步驟。
- 每餐拆成明確店名、地址、日期、時間、官網／訂位頁與狀態；多品牌合併列只留作搜尋提示，不當作已確認餐廳。

### P2：出發前動態複查

- 出發前 30 天：開始盯四段城際車與餐廳訂位。
- 出發前 14 天：重查場館特別閉館、百年廳 availability、Auschwitz／Lajkonik 指定日班次、各餐廳包場／休店。
- 出發前 72 小時：重新下載離線票、核對姓名與時區、查施工與改道。
- 搭車當日：以 Portal Pasażera／PKP Intercity App、車站螢幕及廣播確認月台與誤點；網站的預定月台不當最終指示。[Portal Pasażera 官方教學](https://portalpasazera.pl/en/Poradnik)（查證：2026-08-09）

## 最終判定

- **日期／城市／遊玩天數：可保留。**
- **主要景點營業與參觀限制：大致可保留，但指定日票量仍未完成。**
- **城際時刻：不可當成最終時刻；待 9/25–9/29 前後官方開賣實查。**
- **Auschwitz 交通：已有更好的官方班表證據，現有時間需修正。**
- **餐廳營業：只有少數指定分店已由店家官網確認；其餘仍是候選。**
- **評價／米其林：Michelin 2026 已由官方發布確認；Google 動態星等已移除。餐廳當日營業仍須由店家第一方另查。**

因此，本地與雲端的正確整合順序應是：**先修 P0 資料 → 跑網站資料驗證 → 比對本地與 GitHub 差異 → 再決定提交／推送**；本文件本身不授權推送、部署或覆蓋雲端資料。

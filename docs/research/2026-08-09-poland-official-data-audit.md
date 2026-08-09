# 波蘭自由行官方資料盤查

- 查詢日期：2026-08-09（Asia/Taipei）
- 適用行程：2026-10-24 至 2026-10-31
- 範圍：`src/data/trip.js` 的待確認／待複查項目，以及實際排入行程的景點、票券、城際與市內交通、已選餐廳。
- 方法：只採營運單位、場館、餐廳或地方政府的第一手頁面；Google Maps、聚合票務網站與舊行程資料均未作為確認依據。

## 結論與處理原則

1. 2026-10 的城際車次、月台、座位與每一場館的可售庫存，均屬即時售票資料；截至查詢日不能以歷史班次或「目標時間」當作已確認事實。
2. 已確認的固定規則可保留在資料庫；每一個「指定日期、指定時段可購」必須在官方售票頁實查後才可改為已完成。
3. 目前需要修正或降級的既有敘述：辛德勒工廠不是出發前 4–6 週才訂；百年廳 10/28 圓頂展廳「確定關閉」沒有官方公開佐證；Wieliczka 的 143／121 PLN 與「約三個月前開賣」無法由官方通用頁支持；Rogalowe Muzeum 的週四英文場與 47 PLN 不能預先保證。

## 景點與票券

| 日期／項目 | 官方確認結果 | 適用日期與仍待確認事項 | 官方 URL |
| --- | --- | --- | --- |
| 10/25 Wawel 城堡 | 二至日 09:00–17:00；一、二樓完整路線 95／71 PLN、最後入場 15:00。14:00 入場在營運規則內。 | 適用 4–10 月；個別票量以當日官方售票系統為準。不可假定抵達當日尚有現場票。 | [Wawel 官方參觀資訊](https://wawel.krakow.pl/en/what-to-see) |
| 10/25 Wawel 大教堂 | 4–10 月週日 12:30–17:00、售票至 16:30；26／18 PLN；大教堂博物館週日關閉。 | 適用 2026-10-25；原行程安排可行。 | [Wawel Cathedral 官方參觀資訊](https://www.katedra-wawelska.pl/en/katedra-wawelska/zaplanuj-wizyte/) |
| 10/25 辛德勒工廠 | 目前二至日 09:00–20:00、最後入場 18:30；普通／優待 60／45 PLN；17:30 屬可行時段。 | 個人網路票於參觀日前 90 天、09:00 開放；10/25 已進入可查／可買窗口。秋季特別營運與庫存仍須在官方售票頁確認。 | [Museum of Krakow 官方分館頁](https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory) |
| 10/26 Auschwitz-Birkenau | 10 月入場 07:30–17:00；全年每日開放，1/1、12/25、復活節週日除外；標準導覽約 3.5 小時；入場證只在線上提供，入口不售票；須至少提早 30 分鐘抵達。 | 10/26 不屬公告例外日。10:00 英文導覽的庫存與價格只能由官方預約系統確認；本次無法證實「90 天前開賣」或「已開窗」。 | [Auschwitz 官方參觀資訊](https://www.auschwitz.org/en/visiting/)、[官方開放時間](https://www.auschwitz.org/en/visiting/opening-hours/)、[官方預約](https://visit.auschwitz.org/) |
| 10/27 Wieliczka 鹽礦 Tourist Route | 09:00–17:00；約 2–3 小時、3.5 km、深 135 m、17–18°C、800+ 階。10:00 英文團方向合理。 | 官方通用頁只列「from 131 PLN」；10/27 英文場、實際票價、庫存和開放窗口必須在日期選擇器確認，不能把 143／121 PLN 或「約三個月前」寫成確認事實。 | [官方 Tourist Route](https://www.wieliczka-saltmine.com/individual-tourist/tourist-route)、[官方票價與開放時間](https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours) |
| 10/28 Panorama Racławicka | 4/1–10/31 每日 08:30–19:00，每場 30 分；50／35 PLN；公告 2026 閉館日不含 10/28。 | 11:30 與 50 PLN 可保留；仍須購買指定場次。 | [Panorama 官方資訊](https://mnwr.pl/en/branches/panorama-of-the-battle-of-raclawice/information/) |
| 10/28 百年廳 | Visitor Centre 在 4–10 月週二至日 10:00–18:00；Visitor Centre 25／20 PLN，含大廳參觀 30／25 PLN。 | 官方公開頁無法證實 10/28 圓頂展廳關閉；應改為「以 availability calendar 確認」，不得當成已確認關閉。 | [Centennial Hall 官方參觀資訊](https://halastulecia.pl/en/sightseeing/visitor-centre/) |
| 10/28 座堂島煤氣燈 | 未找到市府或營運方公開的固定出發分鐘。 | 「日落前到場等候，不保證看到」為正確保守規劃；不能售作固定活動。 | 無可確認的官方固定時刻頁 |
| 10/29 波茲南市政廳山羊 | 市府確認雙山羊每日正午出現、互頂 12 次。 | 適用 10/29；12:00 免費觀賞可保留。 | [Poznań 市府頁](https://www.poznan.pl/mim/eurzad/en/-,p,37,51,102.html) |
| 10/29 Rogalowe Muzeum 雨備 | 官方英文個人秀固定資訊為週六、週日 14:00；其他日期視售票而定，網路票通常於 1–30 天前釋出。 | 週四 10/29 的英語場、價格與庫存都不能預先保證；刪除「11:00／14:00、47 PLN 已確定」的說法。 | [官方英文頁](https://rogalowemuzeum.pl/en/)、[官方購票頁](https://rogalowemuzeum.pl/en/buy-ticket/) |
| 10/29 帝王城堡 | 官方文化中心可確認語音導覽 12:00–20:00、19:00 前借用、10 PLN。 | 室內展覽開放與特展票價未找到可覆蓋 10/29 的固定官方日曆；「多為免費」不可視為可稽結論。 | [CK Zamek 官方語音導覽頁](https://mediateka.ckzamek.pl/object/zwiedzanie-zamku/) |
| 10/30 華沙皇家城堡 | 二至日 10:00–18:00、最後入場 17:00；Castle Route 約 150 分、95／75 PLN。 | 10:00 起始與票價可保留；10/30 票量仍須實查。個人可當日購票，團體另有申請規則。 | [Royal Castle 官方開放與票價](https://www.zamek-krolewski.pl/en/godziny-otwarcia-i-ceny-biletow) |
| 10/30 POLIN | 週五 10:00–18:00，核心展最後入場 16:00；2026 公告閉館日不含 10/30。 | 13:15 安排可行；現行 45 PLN 未由本次官方基本資訊頁確認，應標示待官方票務頁實查。 | [POLIN 官方基本資訊](https://www.polin.pl/en/planning-your-visit/basic-information) |
| 10/30 華沙起義博物館 | 普通／優待 35／30 PLN。 | 官方票務頁不預先保證 10/30 的可售時段；16:00 僅是規劃目標。 | [官方票價](https://bilety.1944.pl/cennik.html)、[官方售票](https://bilety.1944.pl/?lang=en) |

## 城際與市內交通

| 項目 | 官方確認結果 | 適用日期與仍待確認事項 | 官方 URL |
| --- | --- | --- | --- |
| PKP Intercity 四段（WAW→KRK、KRK→WRO、WRO→POZ、POZ→WAW） | 尚未取得能鎖定 2026-10 指定日期的官方可售班次、車型、票價、月台或座位。 | 四段均維持 `pending`；開賣後應以 [PKP Intercity](https://www.intercity.pl/en/) 的實際搜尋結果建立唯一車次記錄。不可用目前的「目標 09:00／19:30／19:00／17:30」作為確認班次。 | [PKP Intercity](https://www.intercity.pl/en/) |
| Kraków→Auschwitz 往返 | 博物館官方只確認場館旁有 Kraków 方向 PKS／minibus 停靠。 | 業者、月台、10/26 發車與票價均未由營運商的指定日班表確認，維持 `pending`。優先以已購入的導覽時段倒推交通。 | [Auschwitz 官方交通說明](https://www.auschwitz.org/en/visiting/) |
| Kraków KMK／KMŁ 鹽礦聯票 | 70 分鐘 KMK+KMŁ 全票 10 PLN，涵蓋 Wieliczka Bogucice—Wieliczka Rynek Kopalnia 與含 Kraków 名稱的車站／站點，**不含 Kraków Airport**。 | 適用目前 2026 票價表；10/27 仍須以當日工程／時刻表確認火車。原行程的 10 PLN 可保留。 | [ZTP Kraków 官方票券指南](https://ztp.krakow.pl/en/kmk-public-transport/kmk-ticket-guide) |
| Poznań ZTM | 15／45／90 分鐘為 5／7／9 PLN；24 小時 A 區為 18 PLN、全網為 24 PLN；時間票可轉乘。 | 適用現行官方票價；10/29 的路線與臨時改道仍當日查。 | [Poznań ZTM 官方票價](https://www.ztm.poznan.pl/wszystko-o-biletach/cennik-biletow/) |
| Wrocław MPK | 市府目前列 15 分 3.20、30 分 4.00、60 分 5.20、90 分 7.00、24 小時 15.00 PLN；車上售票僅可刷卡。 | 適用現行市府票價頁；10/28 依即時公告查改道。原行程票價可保留。 | [Wrocław 市府票價](https://www.wroclaw.pl/komunikacja/mpk-wroclaw-ceny-biletow)、[MPK 官方購票方式](https://mpk.wroc.pl/buses-and-trams) |
| Warsaw WTP | 本次未取得可公開核對、明示 2026 價格的官方英文票價頁。 | 現有 75 分鐘第 1 區 4.40 PLN 不應升級為本次已核對；維持 `recheck`，在抵達日以 WTP 官方票價／售票機確認。 | [Warsaw WTP](https://www.wtp.waw.pl/en/) |

## 餐廳：只確認有店家官方頁的實際分店

| 餐廳 | 官方確認結果 | 適用日期與仍待確認事項 | 官方 URL |
| --- | --- | --- | --- |
| U Fukiera，華沙 | Rynek Starego Miasta 27；一至四 12:00–23:00、五六 12:00–23:30、日 12:00–23:00；有官方訂位連結。 | 10/30（五）營運規則相容；仍應訂位確認。 | [店家官方聯絡頁](https://www.ufukiera.pl/kontakt/) |
| Polka，華沙 | Świętojańska 2；每日 12:00–22:00；官方提供訂位。 | 10/30 相容；仍應訂位確認。 | [店家官方頁](https://warszawa.restauracjapolka.pl/about-us) |
| E. Wedel Pijalnia，Krakowskie Przedmieście 45 | 一至四 10:00–22:00、五六 10:00–23:00、日 10:00–22:00。 | 10/24、10/25、10/30、10/31 均可依相應星期安排；臨時包場仍應出發前複查。 | [E. Wedel 官方分店頁](https://wedelpijalnie.pl/lokale) |
| Konspira，Wrocław | Plac Solny 11；一至四 13:00–23:45、五至日 12:00–23:45；廚房至 23:00。 | 10/28（三）符合；訂位／包場狀態另確認。 | [店家官方頁](https://restauracjakonspira.pl/menu) |
| 其他行程餐廳／餐飲清單 | 目前多為 Google Maps 或未指定分店，沒有可稽核的店家官方營業頁。 | 不可標為「已確認營業」；先選定地址與用餐日期，再以店家官方訂位／聯絡頁確認。這是資料缺口，不應以推測補齊。 | 不適用 |

## 可關閉的待辦與不能提前關閉的待辦

- 可立即處理：購買／確認 Wawel、辛德勒工廠、Auschwitz、Wieliczka、Panorama、皇家城堡、POLIN、起義博物館的**指定日期票**；選定每餐的實際餐廳分店。
- 只能在開賣或接近出發日處理：四段 PKP、Auschwitz 往返巴士、所有月台與市區工程改道、景點票券庫存、餐廳臨時休息／包場。
- 不可宣稱已解決的私人資料：住宿地址、電子機票／行李額度、保險與旅客個人資料，仍須由旅客提供或在其帳戶中確認。

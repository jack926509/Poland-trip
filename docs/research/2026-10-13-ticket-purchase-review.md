# 景點購票指南獨立查核

查核日期：2026-10-13（Asia/Taipei）。原始版本：`cf22d48`。範圍為四城 41 組購票入口與參觀規則，並核對同頁相關票價及城市／每日頁的消費資料。

## 修正項目

1. 地下市集、舊猶太會堂原共用辛德勒的 `idl=1`，分別改成官方館頁連出的 `idl=20` 與 `idl=2`；`idl` 是分館參數，`lang` 才是語言。
2. 波茲南考古博物館官網已有 ToBilet 連結，改成線上購票。館方價目更新為單館 20／15 PLN、聯票 30／25，家庭票 50／80。官網列週二免費，但平台摘要文字不同，保留衝突並按付費規劃，不斷言週四免費。
3. Neon 霓虹博物館全票更新為 28 PLN（優待仍為 18），同步城市與 Day 7 備案。
4. 水上宮殿維持本趟週五免費，移除其他日期的過時估價；引用官方參觀規則，不再依賴導覽來源。
5. 鹽礦原官方說明頁標題為 Tourist Route，正文卻混入 Miners’ Route，改連內容正確的 Tourist Route 主頁。
6. Sky Tower 原說明網址在實際瀏覽器出現憑證日期錯誤；改用可讀且具正式營運者資訊的官方售票規則頁。未略過瀏覽器憑證警告。

主行程、用餐選擇及 7 項景點訂票進度均保持原狀。僅 Auschwitz 沿用既有已訂妥紀錄。海報館仍保留官網公告互相衝突的提醒；未驗證指定日期即時庫存。

## 樂斯拉夫與波茲南 15 組

| 景點 | 判定及證據 |
|---|---|
| 全景畫 | 通過；每場 30 分鐘，3 個月內含三館常設展。[官方](https://mnwr.pl/oddzialy/panorama-raclawicka/bilety-informacje-praktyczne/) |
| 樂斯拉夫國家博物館 | 通過；持全景畫票免買常設展。[官方](https://mnwr.pl/en/branches/national-museum/information/) |
| 聖伊莉莎白塔樓 | 通過；現場票、雨／雷暴關閉。[市政府](https://www.wroclaw.pl/dla-mieszkanca/kosciol-elzbiety-bazylika-mniejsza-poznaj-wroclaw) |
| 樂斯拉夫主教座堂 | 通過；塔樓與小堂付費，官網同頁價目不一致已提醒。[官方](https://katedra.wroclaw.pl/ZWIEDZANIE/) |
| 百年廳 | 通過；展覽與含廳內票不同，須查活動日曆。[官方](https://halastulecia.pl/zwiedzanie/visitor-centre/) |
| 動物園 | 通過；票含 Afrykarium，官方直接連出所列售票站。[官方](https://zoo.wroclaw.pl/en/prices/) |
| Hydropolis | 通過；票價頁可連到個人售票流程。[官方](https://bilety.hydropolis.pl/cennik.html?lang=en) |
| Kolejkowo | 通過；售票首頁選城市，Wrocław 位於 Sky Tower。[官方](https://bilety.kolejkowo.pl/) |
| Sky Tower | 購票入口通過；官方說明連結已替換。[規則](https://bilety.skytower.pl/regulamin.html?lang=en) |
| CK ZAMEK | 通過；官方直接連至 ckzamek.bilety24.pl；依展期方案買票。[官方](https://ckzamek.pl/podstrony/6071-zwiedzanie-zamku/) |
| 可頌博物館 | 通過；官方預約頁存在，10/29 英語場仍待日曆確認。[官方](https://rogalowemuzeum.pl/en/buy-ticket/) |
| 考古博物館 | 已修正線上售票與票價；免費日衝突保留。[官方價目](https://nowa.muzarp.poznan.pl/pl/bilety)、[官網連出售票](https://tobilet.pl/wystawy-prezentowane-w-muzeum-archeologicznym-w-poznaniu.html) |
| 波茲南主教座堂 | 通過；地下墓室／塔樓在旅客服務處買票，季節與禮拜限制。[官方](https://www.katedra.archpoznan.pl/turysci-w-katedrze/) |
| 古市政廳 | 通過；閉館至預計 2027 年底／2028 年初。[官方](https://mnp.art.pl/ratusz-muzeum-poznania) |
| 棕櫚屋 | 通過；因改建暫關、未公布重開日。[官方公告](https://palmiarnia.poznan.pl/zamkniecie-palmiarni-2/) |

## 程式驗收範圍

修正後 `env -u NODE_OPTIONS ./verify.sh`：369 項通過、0 項失敗；47 個地圖圖釘無無效紀錄。獨立審查實跑購票測試 5／5，確認待辦區塊與原版完全一致。實際瀏覽器已檢視 localhost 的 41 列、城市跳轉及修正連結；1280px 桌面無水平溢出、console 無 error。工具的 390px 尺寸設定未實際生效，因此不宣稱手機視覺驗收通過。

獨立審查已涵蓋 41 組資料、票價主檔對應、7 項待辦、城市跳轉、每日頁、搜尋、單檔輸出及快取指紋。另補分館購票路由回歸測試，防止兩館再次誤連辛德勒。

以下保留另外兩份獨立查核的原始發現；其中列出的修正項目已納入本次資料更新。

---

# 華沙購票資料查核（2026-10-13，台北時間）

範圍：`src/data/ticket-purchases.js:25–90` 的 WAW 16 組、`docs/poland-attraction-tickets.md:27–42`，並對照 `docs/development.md` 的官方入口、免費／閉館不誤導、POLIN 只保留參考及不變更訂票紀錄規則。只查閱，未修改專案。

## 結論與 findings

新增購票主資料 **15 組通過、1 組附條件通過（海報館官方公告互相衝突，現有提醒有忠實保留）**，未發現新增購票資料的阻擋性錯誤。16 組均找到所列館方一手來源；沒有把可售場次當作已訂票。`trip.js:558–559` 仍為尚未訂，POLIN 未加入 `trip.js`。

旁及既有票價正本有 2 處應更正，並非 cf22d48 新增內容的回歸：

1. **P2，`src/data/venues.js:68`：Neon 全票 25 PLN 過時。** 官方購票資訊現列 28 PLN／18 PLN，現場售票、科學文化宮 4 樓及時間與資料一致。建議全票改 28 並補查核日；購票指南的現場售票分類正確。[官方來源](https://www.neonmuzeum.org/kup-bilety)。
2. **P2，`src/data/venues.js:381`：水上宮殿其他日期「約 20–25 PLN」與官方當期價目不符。** 官方 10/1–4/30 列宮殿等四館聯票 60／30 PLN；週五仍免費。建議刪除過時估價或改寫當期聯票，並把週五免費的依據從「多個導覽來源」改為館方參觀規則第 5.1 條。[官方價目](https://www.lazienki-krolewskie.pl/en/zwiedzanie/cennik)、[官方參觀規則](https://www.lazienki-krolewskie.pl/en/regulamin-zwiedzania)。

## 逐項證據

| 組別／原始碼行 | 判定與核對內容 | 一手來源 |
|---|---|---|
| 皇家城堡 25–27 | 通過；Royal Route 約 60 分、Castle Route 約 150 分，官方導向相同售票站。 | [開放／票價](https://www.zamek-krolewski.pl/en/godziny-otwarcia-i-ceny-biletow)、[售票](https://bilety.zamek-krolewski.pl/index.html?lang=en) |
| 起義博物館 29–31 | 通過；週四免費，週五 08:00–18:00 收費；官方直接連結所用入口。 | [參觀資訊](https://www.1944.pl/en/article/visit-us,4993.html)、[售票](https://bilety.1944.pl/?lang=en) |
| 水上宮殿 33–37 | 通過；規則第 5.1 條明訂週五個人參觀直接入場、不領票、不預約；公園免費。 | [規則](https://www.lazienki-krolewskie.pl/en/regulamin-zwiedzania)、[價目](https://www.lazienki-krolewskie.pl/en/zwiedzanie/cennik) |
| 國家博物館 39–41 | 通過；週五 17:00–20:00 半價，1 PLN 票除外，不累加折扣；臨展票含常設展。 | [參觀資訊](https://www.mnw.art.pl/en/visit/)、[售票](https://bilety.mnw.art.pl/) |
| 科學文化宮 43–45 | 通過；所列頁是官方觀景台售票，線上票 12 個月有效，頁面不要求指定時段。 | [官方售票](https://www.bilety.pkin.pl/) |
| Neon 47–49 | 通過；官方明載現場售票與科學文化宮地址。既有票價正本另見 finding。 | [官方購票說明](https://www.neonmuzeum.org/kup-bilety) |
| MSN 51–53 | 通過；Gallery A 免費、其餘展覽有票種，官網直接連至使用的售票頁。 | [參觀資訊](https://artmuseum.pl/en/visit)、[售票](https://sklep.artmuseum.pl/rezerwacja/wydarzenie.html) |
| 維拉努夫宮 55–57 | 通過；官方票價頁有線上購票與宮殿／公園不同票種，宮殿票已含公園。 | [官方票價入口](https://wilanow-palac.pl/en/tickets) |
| 海報館 59–62 | 附條件通過；首頁同時顯示暫時閉館與 10/13 重開，且直接連到資料所列 MNW 分館售票頁。現有文字正確保留衝突，不能推定 10/30 保證開館。 | [首頁](https://www.postermuseum.pl/)、[官方連出入口](https://bilety.mnw.art.pl/rezerwacja/grupa-wydarzen.html?d=3&idl=7&lang=pl) |
| 歷史館 64–66 | 通過；當期臨展週五免費但需現場／線上取得票；屋頂平台免費。另官網提示平台目前僅樓梯可達。 | [參觀資訊](https://muzhp.pl/en/visit)、[售票](https://sklep.muzhp.pl/) |
| Wedel 68–70 | 通過；官網明列英語導覽週一／週五，工作坊票不含博物館導覽，首頁直接連出所用入口。 | [官方英文頁](https://fabrykaczekolady.pl/en/)、[售票](https://bilety.fabrykaczekolady.pl/) |
| Kolejkowo 72–74 | 通過；官方售票首頁確實要選 Warszawa／Wrocław 等館別。 | [官網](https://kolejkowo.pl/)、[售票](https://bilety.kolejkowo.pl/) |
| 居禮夫人館 76–78 | 通過；官網有現場售票資訊、週二個人免費。 | [參觀資訊](https://www.mmsc.waw.pl/en/plan-your-visit/) |
| 大教堂墓室 80–82 | 通過；教堂官方頁列墓室票價，與戶外老城散步分開。彌撒及宗教活動時墓室關閉。 | [教堂官方頁](https://katedra.mkw.pl/wnetrze/) |
| POLIN 84–86 | 通過；官網導向 bilety.polin.pl，程式 plan 為 reference，文件為附件參考。 | [官網](https://polin.pl/en)、[售票入口](https://bilety.polin.pl/) |
| 蕭邦館 88–90 | 通過；官方公告 2026/1/1–12/31 整修閉館，資料無購票入口。 | [官方公告](https://muzeum.nifc.pl/en/muzeum/wizyta-informacje-miejsce/1_kontakt/) |

## 查核界線

已閱讀官方網頁或搜尋工具取回的一手來源完整相關段落，不以 HTTP 成功作為判定。水上宮殿直接開頁逾時、蕭邦館直接開頁僅 JavaScript 殼，但搜尋工具取得相同官方 URL 的明確規則／2026 公告；此為官方內容證據，非即時售票或當日庫存驗證。POLIN 售票頁直接擷取失敗，官網的 Buy Ticket 導向仍可確認。其餘主要售票頁已看到實際場館、分類或票種。未登入、未加入購物車、未付款，也未把任何日期標成已購票。

---

# KRK 景點購票資訊核對

核對日期：2026-10-13（台北時間）。範圍：`/tmp/poland-ticket-review-20261013` 的 `src/data/ticket-purchases.js` KRK 10 組、`docs/poland-attraction-tickets.md` 及相關 venues／trip。使用官方頁面正文與館方購票按鈕實際目的地，不以 HTTP 成功判定內容正確。未修改專案，未購買或預約。

## 建議修正

1. **Rynek Underground 與 Old Synagogue 購票連結先帶到錯館**：`ticket-purchases.js:123`、`:136` 共用第 8 行含 `idl=1` 的 mkTickets，實際顯示 Location: Oskar Schindler's Enamel Factory，只有辛德勒常設展／團體／英語導覽／臨展可選。`idl` 是館別，`lang` 是語言，已由各館官網按鈕交叉驗證。雖文字提醒選館且可點 Change 修正，但直接購票按鈕應帶正確館別，避免誤買。
   - [目前辛德勒頁](https://bilety.mhk.pl/rezerwacja/wydarzenie.html?idl=1&lang=en)。
   - [Rynek 官方頁](https://muzeumkrakowa.pl/en/branches/rynek-underground)「Purchase and booking of tickets」實際連到 [idl=20](https://bilety.mhk.pl/rezerwacja/wydarzenie.html?idl=20)，正文顯示 Rynek Podziemny；[英語版 idl=20&lang=en](https://bilety.mhk.pl/rezerwacja/wydarzenie.html?idl=20&lang=en) 成功顯示 Rynek Underground 個人／團體票，建議採用。
   - [Old Synagogue 官方頁](https://muzeumkrakowa.pl/en/branches/old-synagogue) 按鈕實際連到 [idl=2](https://bilety.mhk.pl/rezerwacja/wydarzenie.html?idl=2)，正文顯示 Stara Synagoga 常設展，建議採用。附 `&lang=en` 版本本次 web 工具讀取失敗，不能宣稱該英語版本已驗證。
   - 同步文件 `docs/poland-attraction-tickets.md:54`、`:57`。

2. **Wieliczka 官方說明連結正文錯配**：`ticket-purchases.js:115`、文件第 52 行指向 [important-information/tourist-route](https://www.wieliczka-saltmine.com/individual-tourist/useful-information/important-information/tourist-route)。標題雖是 Tourist Route，但抓得正文反覆為 Miners’ Route、Regis Shaft、10 歲以上、頭燈安全帽、14–16°C，與本次 Tourist Route 的 Daniłowicz Shaft、17–18°C 不符。這是官方頁面本身內容錯配，不應用 slug 判斷。建議來源改為 [Tourist Route 官方主頁](https://www.wieliczka-saltmine.com/individual-tourist/tourist-route)，其正文確認鹽湖、St Kinga’s Chapel、超過 800 階、2–3 小時、17–18°C、3.5 km、135 m，且直接連官方票價與售票頁。購票 URL 與目前購票說明本身正確。

## 逐項通過證據

| 景點 | 核對結果與官方來源 |
|---|---|
| Wawel 皇家城堡 | [官方參觀頁](https://wawel.krakow.pl/en/what-to-see) 列一二樓 95／71、一樓及二樓各 57／43、地下／寶庫／軍械庫各 47／35，10 月二至日 09:00–17:00；[FAQ](https://wawel.krakow.pl/en/common-questions) 列寶庫與軍械庫約 40 分、地下約 60 分，支持選一小時短路線。官網明文城堡不售大教堂／鐘樓／墓室票。官網售票按鈕導向 [bilety.wawel.krakow.pl](https://bilety.wawel.krakow.pl/)，正文為城堡官方售票。venues 第 120、138 行價格與末入場時刻相符。 |
| Wawel 大教堂 | [官方參觀頁](https://www.katedra-wawelska.pl/en/katedra-wawelska/zaplanuj-wizyte/) 明列成人 26／優待 18、4–10 月週日 12:30–17:00、售票至 16:30；Cathedral Museum 週日及假日休館；票含大教堂、鐘樓、王室墓室、Cathedral Museum、Archdiocesan Museum。官網購票鈕連 [bilety-wawel.pl](https://bilety-wawel.pl/)，正文商品成人 26。trip 第 106 行正確。 |
| 辛德勒工廠 | [波蘭文官方頁](https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera) 與 [英語頁](https://muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory) 一致：週二至日 09:00–20:00，末入場前 90 分；固定英語團為 10:00／12:00／16:00；個人網購實名票須證件正本；90 天前開賣，個人 09:00。售票頁也明列英語固定三場，故 17:30 選一般參觀正確。venues 第 156 行及 trip 第 109 行相符。 |
| Auschwitz-Birkenau | [官方 Visiting](https://www.auschwitz.org/en/visiting/) 明載所有入場證僅線上取得，兩營區均須個人入場證、入口不供票，導覽均涵蓋 I 與 II。官網直接連 visit.auschwitz.org。購票站本次 web 工具回 502／不可讀，僅能確認官方域名和規則，不能宣稱已驗證指定場次或即時售票流程。已訂妥狀態僅沿用專案 todoGroups，未取得新票面，不更動。 |
| Wieliczka | [官方售票首頁](https://bilety.kopalnia.pl/index.html?lang=en) 明文只在此域與礦區售票口／售票機銷售；個人購票下一頁分 Tourist Route（Trasa Turystyczna）及 Miners’ Route，前者有英語選項。[官方票價頁](https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours) 明列非波蘭語／英語才強制事先線上買。指定 10/27 的 143／121 與庫存是原 10/06 歷史查價，未重新確認，現有標示已保留日期與不保證庫存。 |
| 聖瑪麗教堂＋號角塔 | [官方遊客頁](https://mariacki.com/en/tourists/) 明列教堂參觀與塔樓不同費用，塔樓 11–4 月關閉，不接受預約，只能參觀當天於 7 Mariacki Square 買限量票；備註完全相符。 |
| Rynek Underground | [官方分館頁](https://muzeumkrakowa.pl/en/branches/rynek-underground) 明列週二免費、不可預約、當日售票口限量、每人最多 5 張；週日 10:00–20:00，末入場前 75 分，45／35。規則與 trip 備案正確，購票連結須修正。 |
| Galicia | [官方實用資訊](https://galiciajewishmuseum.org/en/visit/practical-information/) 每日 10:00–18:00，35／25／家庭 55；其按鈕連 [現用 Tickets online](https://galiciajewishmuseum.org/en/tickets-online/)，明列一般入場票及官方 Evenea 購票鈕，票未綁日期時間且當年度單次有效。一般參觀需另買票說明成立。 |
| MOCAK | [官方 Visiting](https://en.mocak.pl/visiting) 週二至日 11:00–19:00、週一閉館；週四僅 -1 層館藏展免費，臨展折扣，支持免費規則不同。Buy Ticket 鈕指向 [bilety.mocak.pl](https://bilety.mocak.pl/)，正文為 MOCAK 官方售票系統。10/26 週一不適用正確。 |
| Old Synagogue | [官方頁](https://muzeumkrakowa.pl/en/branches/old-synagogue) 為室內博物館，成人 22／優待 16、週二至日 09:00–17:00、週一 10:00–15:00；週一免費且此館允許先預約。目前一般入內購票敘述無誤，但深連結應改 idl=2。 |

## 可選補充與保留界線

- trip 第 107 行說「二樓代表廳需時較長」，官方 FAQ 約 50 分，比寶庫／軍械庫 40 分稍長，但比地下 60 分短。不是新購票指南的阻擋項目，不必擴大重排主行程。
- 大教堂售票站頁首現為週日 12:30–16:00，但教堂主站明確按 4–10 月／11–3 月分季節。本次 10/25 依主站 17:00 合理；保留來源層級，付款前重查。
- Auschwitz 主站一般導覽概述寫 3.5 小時；專案已訂行程記錄寫 3 小時 45 分。沒有票面不宜改掉既有票券導覽時間。10 月免費自導開始時刻不是此新增指南必要內容，尚未驗證 venues 第 187 行 16:00 切換說法。
- 官網可售規則與網址確認不等於 10/25、10/27 可售名額確認，未做結帳或新增訂位。

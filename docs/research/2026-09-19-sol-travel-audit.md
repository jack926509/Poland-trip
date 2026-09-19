# 2026-09-19 Sol 全站旅遊資料查核

> 查核基準日：2026-09-19（台北時間）
> 旅程：2026/10/23–11/01；波蘭境內 2026/10/24–10/31
> 查核範圍：`src/data/` 全部資料檔中的行程、景點、票價與開放、交通票制與班次／開賣、餐廳、購物及實用資訊。
> 原則：本輪重新開啟官方網站查核；舊的 `docs/research/` 只用來找出待查欄位，不當作本輪證據。指定日售票系統若無法直接讀取，明列「無法核實」，不把一般營業資訊推論成有票。

## 結論與優先處理

全站多數固定票價仍與官方頁面相符，但有 4 項應優先更正：

1. **樂斯拉夫動物園 10 月平日時間寫錯。** 網站候選資料寫 09:00–18:00、末入 17:00；官方 2026 年 10 月表列週一至週四售票／入園至 16:00、館舍至 16:45、戶外與 Afrykarium 至 17:00。10/28 是週三。動物園不在 Day 5 既定 `steps`，目前影響城市候選與 `venueHours`，不可誤說會直接打亂既定行程。
2. **Auschwitz 一般官網時長與已訂紀錄不同，須並列。** 官方目前個人訪客概述頁寫一般 tour 約 3.5 小時；站內 9/9 已訂資料記官方波蘭文 `3 godz.45 min`。本輪未讀私人票，不能用一般概述覆蓋已訂場次；14:15 結束與回程緩衝先保留，另以電子入場證核對。
3. **4 段 PKP 城際火車的 `saleOpens` 目前無法核實。** PKP Intercity 2026 現行 e-IC 規則已記載 2025-12-03 曾「延長國內預售期」，同時保留換表時可縮短預售期的例外；本輪無法判斷站內日期是 9/8 售票系統實測、人工推算或其他來源，也未取得 10/25–29 指定日目前可售狀態。應重新進 e-IC 2.0 實查後再決定是否修改。
4. **Day 7 的華沙起義博物館警語仍寫「週一免費」，與同站 `tickets.js` 及官方頁面衝突。** 官方現列週四免費；10/30 週五照常收費。

## 查核狀態定義

- **已核實**：2026-09-19 實際讀到場館、交通機構、政府或店家自己的頁面，內容足以支持現有值或更正值。
- **部分核實**：一般規則可由官方頁確認，但 2026 年指定日期的場次、庫存、班次或臨時閉館無法由可讀頁面確認。
- **無法核實**：官方頁沒有該資訊、前端日期選擇器無法取得指定日內容，或沒有可辨識的官方來源。

## 一、行程與景點票價、開放狀態

| 項目（行程日） | `src/data` 現有值 | 2026-09-19 官方查得值 | 狀態 | 官方來源 | 建議修改 |
|---|---|---|---|---|---|
| Wawel 王冠寶庫（10/25） | 47／35 PLN；9–12 月 09:00–17:00；末入前 40 分 | 相符；官方現行 `What to See` 仍列 47／35、9–12 月 09:00–17:00、末入前 40 分 | 已核實 | https://wawel.krakow.pl/en/what-to-see | 保留；10/25 14:00 庫存仍須售票頁確認 |
| Wawel 二樓代表廳（10/25） | 57／43 PLN；9–12 月 09:00–17:00 | 官方頁本輪可確認分路線制度，但搜尋結果未完整展開代表廳區塊；指定日場次不可讀 | 部分核實 | https://wawel.krakow.pl/en/what-to-see | 保留為參考，購票前以日期頁為準 |
| 辛德勒工廠（10/25） | 60／45；二–日 09:00–20:00；末入前 90 分；線上票實名；17:30 規劃 | 全部相符；個人票參觀前 90 天 09:00 開放，英文固定導覽 90／75；官方列 10/6、11/1、11/3、11/11 閉館，10/25 不在列 | 已核實（庫存除外） | https://www.muzeumkrakowa.pl/en/branches/oskar-schindlers-enamel-factory | 保留規則；「現可查／購」只能表示進入售票窗，不代表 17:30 有票 |
| Auschwitz-Birkenau（10/26） | 10:30 英文 educator 已訂妥；9/9 已訂紀錄引官方波蘭文 `3 godz.45 min`；入場前 30 分到 | 官方個人頁列 10 月英文團 08:30–14:30 每小時、一般 tour **約 3.5 小時**；2026-03-01 起個人入場證只在線上取得。本輪未讀私人票，不能判定已訂場次應改成 3.5 小時 | 部分核實（訂位本身未讀私人票） | https://www.auschwitz.org/en/visiting/guided-tours-for-individual-visitors/ ; https://www.auschwitz.org/en/museum/news/visit-auschwitz-org-entry-cards-to-the-memorial-available-only-online-from-1-march%2C1819.html | 並列「一般官網約 3.5 小時」與「已訂紀錄 3 小時 45 分」；保留 14:15 結束及回程緩衝，票面另核 |
| Wieliczka 鹽礦（10/27） | 日期選擇器；先前 143／121；路線 2–3 小時、3.5 km、800+ 階 | 官方資訊頁仍採互動日期選擇器；本輪無法讀出 10/27 英語場、價格與庫存 | 無法核實指定日 | https://www.wieliczka-saltmine.com/individual-tourist/useful-information/ticket-prices-and-visiting-hours | 不回填舊價為現價；維持「需進售票頁查／購」 |
| Panorama Racławicka（10/28） | 50／35；30 分；指定時段待確認 | 相符；4/1–10/31 每日 08:30–19:00；官方 2026 閉館日不含 10/28 | 已核實（庫存除外） | https://mnwr.pl/en/branches/panorama-of-the-battle-of-raclawice/information/ | 補上 10/28 場館確定開放；時段庫存仍標待確認 |
| 樂斯拉夫動物園／Afrykarium（10/28） | 69 起／59 起；現場 99／89；09:00–18:00、末入 17:00 | 票價相符；但 10 月週一至週四售票／入園只到 **16:00**，館舍至 16:45，戶外與 Afrykarium 至 17:00；週五至日才售票至 17:00、園區至 18:00 | **已核實，有錯** | https://zoo.wroclaw.pl/en/prices/ ; https://zoo.wroclaw.pl/en/opening-hours/ | 修正城市候選與 `venueHours`；動物園不在既定 Day 5，不需重排行程 |
| 百年廳 Visitor Centre（10/28） | 25／20；含廳內 30／25；4–10 月二–日 10:00–18:00；指定日顏色待查 | 一般規則可由官方頁確認；動態 availability calendar 的 10/28 顏色本輪仍無法可靠讀取 | 部分核實 | https://halastulecia.pl/zwiedzanie/visitor-centre/ | 維持行前 3–5 天重查；不要把 Visitor Centre 開館等同圓頂下方可進 |
| Palmiarnia 棕櫚屋（10/29） | 改建暫時閉館，未公布重開日 | 官方仍為改建閉館公告，未見 10 月重開日期 | 已核實 | https://palmiarnia.poznan.pl/ | 保留閉館，不列主行程或雨備 |
| 可頌博物館（10/29） | 英語 47；週四是否有英語場待售票頁確認 | 英語公開場 47；官方英文頁說英語場固定週六、週日與 7–8 月每日，其他日期「many other days」須看售票頁。10/29 週四不能由一般規則確認。官方頁另同時出現 Sun–Thu、Sat 時間，漏列 Friday，與波蘭文「每週 7 天」說法不完全一致 | 部分核實 | https://rogalowemuzeum.pl/en/ ; https://rogalowemuzeum.pl/indywidualni/ | 現有「不可預設 13:30」方向正確；改以官方常見英語場 14:00 說明，但指定日未上架前仍不得排定 |
| 帝王城堡 CK ZAMEK（10/29） | 每日 12:00–19:00、售票至 18:00；地圖 10／7、語音 20／15 | 相符 | 已核實 | https://ckzamek.pl/podstrony/6071-mowimy-otwarcie/ | 保留 |
| 波茲南考古博物館（10/29） | 15／10；聯票 25／15；二–四 09:00–16:00 | 官網票價頁本輪未由搜尋結果穩定擷取，但官方頁仍可達；無 10/29 臨時閉館證據 | 部分核實 | https://nowa.muzarp.poznan.pl/pl/bilety | 保留數字但標 9/18 查核值；出發前再查公告 |
| 古市政廳博物館 | 整修閉館，預計 2027 年底至 2028 年初重開 | 本輪未找到更新後的提前重開公告 | 部分核實 | https://www.msu.mnp.art.pl/profile/wizyta-ratusz-muzeum-poznania | 保留閉館，勿排入 2026 行程 |
| 華沙皇家城堡（10/30） | Royal Route 60／45；二–日 10:00–18:00、末入 17:00 | 相符；官方 2026-05-02 起價格頁仍有效，Royal Route 約 60 分 | 已核實 | https://www.zamek-krolewski.pl/en/strona/opening-hours-and-ticket-prices/2801-opening-hours-and-ticket-prices-may-2-2026 | 保留；指定 10:00 庫存仍待購票頁 |
| POLIN（10/30） | 週五 10:00–18:00；票價及庫存看售票頁 | 官網搜尋結果未提供足以核對當前票價／10/30 庫存的靜態內容 | 無法核實指定日 | https://polin.pl/en ; https://bilety.polin.pl/ | 不新增票價；購票時確認主展最後入場規則 |
| 華沙起義博物館（10/30） | 35／30；一、三–五 08:00–18:00，二休；資料內一處寫週一免費、另一處寫週四免費 | 票價及時間相符；官方明載 **週四免費** | **已核實，有內部矛盾** | https://www.1944.pl/en/article/visit-us%2C4993.html | 將 Day 7 `warn` 的「週一免費」改為「週四免費」；10/30 週五照常收費 |
| MSN 當代美術館 | 40／30；18:00 後 25／15；二–四／六 11:00–19:00、五至 20:00、日至 18:00 | 相符；官方另列 2026-10-15、11/1、11/11 閉館 | 已核實 | https://artmuseum.pl/en/visit | 保留 |
| 科學文化宮觀景台 | 30／25；每日 10:00–20:00；11/1 閉館 | 本輪未重新讀到售票系統價格細節；官方主頁可達，未見影響行程日的新公告 | 部分核實 | https://pkin.pl/taras-widokowy/o-tarasie-widokowym/ | 保留 9/18 查核註記，10 月指定日再查 |
| E.Wedel 巧克力工廠 | 70／55；每日 10:00–20:00；英語只一、五 | 本輪未取得較 9/18 更新的可讀價目；10/30 是否有合適英語場仍須售票頁 | 部分核實 | https://fabrykaczekolady.pl/en/ | 不把「週五有英語場」寫成已訂到 |
| 蕭邦博物館 | 2026 全年整修閉館 | 本輪未見官方提前重開訊息 | 部分核實 | https://muzeum.nifc.pl/en | 保留不排入 2026 行程 |
| Day 1 雨備：科學文化宮 | 寫「老城廣場走路 12 分」 | 官方頁可確認場館地址／票務，但官方不提供這段步行分鐘；以兩地實際位置看，12 分鐘敘述缺乏可靠依據 | 無法核實步行時間 | https://pkin.pl/taras-widokowy/o-tarasie-widokowym/ | 移除固定 12 分鐘，改為「出發時用導航重算」 |
| Day 1 雨備：Łazienki | 寫「公園溫室：室內展館＋蕭邦像，免費」 | 官方明列 **花園**每日 06:00–22:00 免費；10/1–4/30 的 Palace on the Isle、Old Orangery、Myślewicki Palace、Kubicki Stables 聯票為 60／30，僅週五館舍免費。10/24 是週六，不能把公園免費延伸成室內展館免費；且 White Pavilion、Water Tower 冬季關閉 | **已核實，有錯** | https://www.lazienki-krolewskie.pl/en/zwiedzanie/godziny-otwarcia ; https://lazienki-krolewskie.pl/en/zwiedzanie/cennik | 改成「花園與蕭邦像免費；室內館舍依票制，10/24 週六 60／30，指定館舍與臨時閉館再查」 |

## 二、交通票制、班次與開賣

| 項目 | `src/data` 現有值 | 2026-09-19 官方查得值 | 狀態 | 官方來源 | 建議修改 |
|---|---|---|---|---|---|
| PKP 國內票預售規則 | 4 段車各自記 `saleOpens`，來源註記為 9/8 查核，但未保存當時售票畫面或規則依據 | 現行 e-IC 規則的修訂表明 2025-12-03 已「延長國內預售期」；現行規則同時明說換表時可縮短開賣期。本輪未能從官方可讀文字確定 10/25–29 四段的實際可售狀態，也不能判定現有日期是實測或推算 | **部分核實，來源不足** | https://regulamin-eic.intercity.pl/files/Tekst_ujednolicony_Regulamin_e-IC_zmiany_1-32_FK.pdf ; https://ebilet.intercity.pl/ | 重新取得 4 個指定日可售狀態；確認前不要把 `saleOpens` 當成現行確定日期 |
| EIP 5300 華沙 → 克拉科夫（10/25） | Centralna 約 08:40／Zachodnia 08:45 → 10:58；換表後待確認 | Passenger Portal 官方搜尋器可接受日期，但本輪可讀頁未傳回指定日結果；10/25 正逢資料所述換表點 | 無法核實指定班次 | https://portalpasazera.pl/en ; https://ebilet.intercity.pl/ | 保留為參考，未查到 10/25 結果前不得顯示成確定班次 |
| IC 3600 克拉科夫 → 樂斯拉夫（10/27） | 17:55–20:52 | 同上，未取得指定日官方結果 | 無法核實 | 同上 | 保留參考標示，立即進官方售票器實查 |
| Baltic Express 260 樂斯拉夫 → 波茲南（10/28） | 19:10–20:29 | 同上，未取得指定日官方結果 | 無法核實 | 同上 | 保留參考標示，立即實查 |
| EIC 8104 波茲南 → 華沙（10/29） | 17:40–20:00；`saleOpens: 2026-09-25` | 指定日結果未取得；9/25 與其他段的 30 天邏輯也不一致 | 無法核實 | 同上 | `saleOpens` 不可保留為確定值 |
| Passenger Portal 時刻表時效 | 網站說 10/25 換表後重查 | 官方說網路時刻表 PDF 每週五或六更新，須核對每份有效期間；海報時刻表頁顯示最近更新 2026-09-05 | 已核實 | https://portalpasazera.pl/en/Tablice ; https://portalpasazera.pl/en/Plakaty | 行前及購票後再核票面，不能只存一次舊班表 |
| Lajkonik 10/26 往返 | 07:10–08:35、15:30–16:55；各 25／22；尚未購票 | 本輪未能從公開頁重新取得指定日可售結果；站內同時出現 `status: 指定日尚未確認` 和「去回皆查定」互相衝突 | 無法核實指定日 | https://www.lajkonikbus.pl/krakow-oswiecim.html | 狀態統一為「9/9 查得、9/19 未重現指定日結果、尚未購票」；付款前重查 |
| 華沙 WTP | 20 分 3.40；75 分第 1 區 4.40；90 分 1+2 區 7；24 小時第 1 區 15 | 本輪未見官方改價公告；官方票價頁仍為查核入口 | 部分核實 | https://www.wtp.waw.pl/en/ticket-tariff/ | 保留，出發前再查；機場 S2／S3 的實際月台與班次當日查 |
| 克拉科夫 KMK | 15 分 4、30 分 6、60 分 8、90 分 9、24 小時 I 區 20；70 分 KMK+KMŁ 10 | 本輪未見官方改價公告 | 部分核實 | https://ztp.krakow.pl/en/kmk-public-transport/kmk-ticket-guide | 保留 |
| 樂斯拉夫 MPK | 單次 4.60；15 分 3.20；30 分 4；60 分 5.20；90 分 7；24 小時 15 | 本輪未見官方改價公告 | 部分核實 | https://www.wroclaw.pl/komunikacja/ceny-biletow-mpk-wroclaw | 保留 |
| 波茲南 ZTM | 15 分 5；45 分 7；90 分 9；24 小時 A 區 18／全區 24 | 本輪未見官方改價公告 | 部分核實 | https://www.ztm.poznan.pl/wszystko-o-biletach/cennik-biletow/ | 保留 |
| Kraków Airport SKA1 | 20 PLN、約 20 分 | 不是本次實際抵達／離境動線，且本輪未重新查 KMŁ 官網 | 未重新核實 | https://www.kolejemalopolskie.com.pl/ | 標為延伸參考，不列本趟已核實交通 |

## 三、行程可行性與資料一致性

| 發現 | 影響 | 建議 |
|---|---|---|
| 樂斯拉夫動物園候選時間高估 | 動物園不在 Day 5 既定 `steps`，但城市候選與 `venueHours` 會誤導臨時加排；週三 10/28 售票／入園 16:00 截止、Afrykarium 17:00 關 | 修正候選資料；若臨時加排，須在 16:00 前入園，不能據此重算既定 Day 5 |
| Day 7 `warn` 與 `tickets.js` 對免費日相反 | 使用者可能誤判票價或安排 | 統一為週四免費；10/30 週五付費 |
| `todoGroups.rail` 的 Lajkonik 狀態寫「指定日尚未確認」，`action` 又寫「皆已查定」 | 更新儀表板無法判斷究竟需不需要重查 | 拆成「9/9 曾查得」「9/19 未重現」「尚未購票」三個明確事實 |
| `bookingTiers` 第一優先標題說「全部尚未訂」，清單第一項卻是 Auschwitz 已訂妥 | 會讓使用者重複操作 | 標題改成「除 Auschwitz 外皆尚未訂」 |
| 網站把查過的一般開放時間與指定日庫存混在同一段 | 容易把「可查」誤讀為「有票」 | 每筆分開保存 `factsCheckedAt`、`availabilityCheckedAt`、`bookingStatus` |
| Day 3 06:45 報到、07:10 Lajkonik 發車只隔 25 分鐘 | 專案行程稽核的人工提醒門檻是 30 分鐘；這是本站的保守緩衝規則，**不是 Lajkonik 官方最低報到規定** | 若票面與住宿動線允許，提早 5–10 分鐘到 MDA；否則明列為人工注意事項，不寫成業者規定 |

## 四、餐廳營業

（以下以店家官網或官方頁面重新查核；社群或第三方只能列為無法核實的補充。）

餐飲資料實際盤點為：每日餐位 27 筆、`cityDining` 23 筆、`snacksAndCafes` 21 筆、`cityFood` 28 筆、Michelin 訂位 9 筆、速食分店 24 筆及 fast-food hubs 3 筆；這些集合有重複店家，不能相加冒充不重複總數。9/19 實際官方覆蓋為每日餐位 21/27、咖啡小吃 15/21、速食分店 13/24；其餘明列未核實，**不得把舊 `checkedAt` 或舊報告當成本輪核實**。

| 項目（行程日） | `src/data` 現有值 | 2026-09-19 官方查得值 | 狀態 | 官方來源 | 建議修改 |
|---|---|---|---|---|---|
| Pod Aniołami（10/26） | 每日 13:00–23:00 | 店家官網仍列每日 13:00–23:00；地址 Grodzka 35、電話亦相符 | 已核實 | https://www.podaniolami.pl/ | 保留；仍建議訂位 |
| Restauracja Wrocławska（10/28） | 日–四 12:00–22:00、五六至 00:00 | 官網聯絡頁現在只列：一–四廚房至 21:30、酒吧至 22:00；五六廚房至 22:00、酒吧至 00:00；日同平日。**沒有列開門時間 12:00** | 部分核實 | https://wroclawska.com.pl/kontakt/ | 將 `12:00` 降為待確認；保留 10/28 廚房 21:30、酒吧 22:00 |
| Konspira（10/28） | 一–三 13:00–23:00（廚房至 22:00）；四 13:00–23:45；五六 12:00–23:45；日 12:00–23:00 | 完全相符；訂位電話 +48 535 212 586；週五、週末、假日不收訂位 | 已核實 | https://www.restauracjakonspira.pl/contact | 保留；`day-dining.js` 仍有「週三開門 12:00 或 13:00 資料不一」及舊電話 796 326 600，應改成 13:00 與新電話 |
| Karczma Górnicza（10/27） | Day 4 午餐首選 | Wieliczka 公司頁明寫目前關閉（`obecnie nieczynna`）；另一官方英文餐飲頁仍有菜單，官方頁互相衝突 | **部分核實，高風險** | https://www.kopalniawieliczka.eu/zwiedzanie-kopalni/ ; https://www.wieliczka-saltmine.com/enjoy-the-flavours-of-the-mine | 不可當午餐首選；改成目前關閉／向礦場確認 |
| Café Bristol（Day 1、7、8） | 每日 08:00–20:00 | 官方：日–四 08:00–19:00；五六 08:00–21:00 | **已核實，需改 3 處** | https://www.cafebristol.pl/pl/ | 三日與 snacks 同步更新 |
| E.Wedel Szpitalna 8（Day 7） | 一–五 08:00–22:00、六 09:00–22:00、日 09:00–21:00 | 官方 locator：一–六 09:00–22:00、日 09:00–21:00 | **已核實，需改** | https://wedelpijalnie.pl/lokale | 平日開門改 09:00 |
| NUTA | 595／795 PLN，地址含糊 | 官網列二–六 18:00–21:15（最後訂位）、日一休、Plac Trzech Krzyży 10/14；目前雙人禮券價格與站內套餐數字完全不同，無法支持 595／795 | **已核實，價格過時** | https://nuta.com.pl/en/ | 移除固定套餐價，改以訂位頁即時價 |
| IDA | 三處分別寫 149 含酒、209 含酒、六道 209 + wine 169 | 官網只核實一–五 12:00–22:00、六 13:00–22:00、日 13:00–19:00，未支持上述價格 | **已核實內部矛盾** | https://idakuchniaiwino.pl/ | 先移除價格或標未核實 |
| Most | 490 PLN；僅週四–六 | Michelin 現列一–四 17:00–22:00、五 17:00–23:00、六 14:00–23:00、日 14:00–21:00；490 PLN 未由店家菜單核實 | **已核實時間錯誤** | https://guide.michelin.com/pl/en/lower-silesian/wroclaw_2399695/restaurant/most | 移除固定價與「僅週四–六」 |
| BABA | 主菜 82–179；地址資訊含糊 | 官方為 Nożownicza 1D；一–四 16:00–20:00、五 16:00–21:00、六 14:00–21:00、日 14:00–19:00；2026-02 官方菜單主菜約 69–159 | **已核實，需改** | https://baba.wroclaw.pl/ | 修正地址、時間與價格區間 |
| Michelin 標籤 | Starka、Szara Gęś、Pod Fredrą、Jadka 標 Bib | 不在現行 Kraków／Wrocław Michelin Bib 名單 | **已核實，需改** | https://guide.michelin.com/ae-az/en/lesser-poland/cracow/restaurants ; https://guide.michelin.com/pl/en/lower-silesia/wroclaw_2399695/restaurants | 移除 4 個 Bib 標籤 |
| 仍未核實的每日餐位 | Pod Temidą、Hankki、Pyra Bar 時間、ROGAL Stary Rynek 11/17、Yache Korea、Arirang、QQ Warsaw 等 | 找不到可用店家一手時間，或本輪官方頁不可讀 | **未核實 6/27** | 無 | 保留待確認，不更新查核日 |
| 四城速食分店 | 24 筆 | Pasibus 4 店、MAX 5 店及 Berlin Döner 4 店完成官方 locator 核對；KFC 4 店、McDonald's 4 店、Salad Story 多數店為 JS locator，未逐店證實 | **已核實 13／未核實 11** | https://pasibus.pl/lokalizacje/ ; https://www.maxpremiumburgers.pl/znajdz-max/restauracje/ ; https://www.berlindonerkebap.com/restauracje/ | MAX Kraków 改 Nowohucka 52；其餘無法解析者標行前再查 |

另有官方已核實且現值大致正確的每日餐位：NOAH、Pod Aniołami、FOLGA（地址／Bib）、Samarqand、Restauracja Wrocławska、Hyćka、U Fukiera、WYRAJ、Bar Mleczny Prasowy；Specjały Regionalne 的兩個同公司頁面對開門 11:30 或 12:00 互相矛盾，應保留衝突。Pod Temidą、Arirang、QQ Warsaw 無可用一手頁；El Gato 官網只列地址不列時間。

## 五、購物與實用資訊

### 購物資料

`shopping.js` 共盤點 2 筆精品購物、7 類主要伴手禮、13 張伴手禮卡、8 個店舖／商場及 7 張 Żabka 提醒卡。本輪沒有足夠證據把這 37 筆逐項標成 9/19 已核實；以下只列可作決策的狀態。

| 類別／項目 | 現有值 | 本輪狀態 | 建議 |
|---|---|---|---|
| Bolesławiec、琥珀、Wedel、Krówki、剪紙、城市特色 | 品項與購買區域建議 | 未核實即時價格／庫存；屬非硬時段參考 | 保留描述，刪除任何沒有官方來源的固定價差 |
| Żubrówka／Soplica、Nalewka | 酒類伴手禮 | 商品存在屬穩定資訊；價格與機場攜帶規則本輪未逐品項核實 | 僅保留一般提醒，購買時看標示與航空規則 |
| oscypek | 標示保存／入境風險 | 未重新核實台灣動物產品入境規定 | 不提供「可帶回台灣」保證；行前查農業部防檢署 |
| 8 個店舖／商場 | Stradomska 陶器、S&A Amber、World of Amber、Sukiennice、Rzeczy Same、Wedel、Cepelia、Złote Tarasy | S&A、World of Amber、Wedel、Złote Tarasy 已查；其餘部分無現行一手依據 | 已查者依下方更正；其他標「出發前／當日重查」 |
| Vitkac、Chylak | 精品採買候選 | 地址與一般營業時間已由品牌官網核實，庫存未核實 | 非行程硬點，維持候選 |
| Żabka 7 張提醒 | App、熱食、營業、服務 | 未逐條查 Żabka 2026 官方條款；各店營業時間不同 | 移除泛稱「一–日 06:00–23:00」式保證，以門市 locator 為準 |

逐店官方查核另發現：Vitkac（Bracka 9；一–六 11:00–21:00、週日 fashion 關）現值正確；Chylak／Le Petit Trou 為 Koszykowa 5 聯合店，應補精確地址（https://chylak.com/uk/en/retailers 、https://le-petit-trou.com/pages/kontakt）；World of Amber 官方店為 Floriańska 22、Grodzka 38（https://worldofamber.pl/）；Złote Tarasy 一–六 09:00–22:00、日 09:00–21:00，但 10/31 09:00 開到 09:45 出發只有 45 分鐘，不宜描述成寬裕補買。需修正項目如下：

- S&A Amber 現寫 Grodzka 60／14，官方只有 **Grodzka 14**：https://s-a.pl/kontakt/ 。
- MAX Kraków 現寫 Nowohucka 54，官方為 **Nowohucka 52**，且屬 M1／Selgros 一帶，不是 Bonarka：https://www.maxpremiumburgers.pl/znajdz-max/restauracje/max-krakow/ 。
- Rzeczy Same Podgórze、Cepelia Warszawa 實體店、Stradomska「如 23 號」均找不到現行一手門市依據，應降為無法核實或移除。
- Prince Polo 3–5 PLN、Żabka 熱狗 6–9、咖啡 5–8 未由官方現行菜單核實；刪固定價或標「依門市／App」。
- 琥珀「泡鹽水會浮、靜電吸紙屑」不是官方真偽保證，應刪除，改成索取發票與材質標示。
- oscypek 的旅客檢疫判斷仍需重查：防檢署 PDF 把保久乳、奶粉及乳酪列為無須申報動物檢疫，但頁面未提供足以確認其現行版本日期的資訊，也不能由一般「乳酪」直接替個別產品作最終判定。報告只保留此來源與限制，不建議目前就改成「一定免申報」：https://www.aphia.gov.tw/UserFiles/file/1010412-1.pdf 。

### 實用資訊

`essentials.js` 盤點 8 筆基本資訊、8 筆日照、4 個官方來源、4 組打包清單、12 句語言、9 筆出發前提醒與 3 組安全資訊。日照為計算資料，不屬即時官方公告；本輪未逐句重新驗證 12 句波蘭語。

| 項目 | 現有值 | 本輪狀態 | 官方來源／建議 |
|---|---|---|---|
| ETIAS | 以 EU 官方頁為來源 | 官方仍寫 2026 年第 4 季啟用、現階段無須行動，確切日未公布 | https://travel-europe.europa.eu/etias_en；出發前再查，勿寫推測日期 |
| 波蘭入境與旅遊警示 | 外交部領務局 | 未重新核實公告內容 | https://www.boca.gov.tw/；出發前 7 天重查 |
| 緊急電話 112 | 波蘭政府官方來源 | 穩定資訊，未見變更 | https://www.gov.pl/web/mswia-en/emergency-number-112 |
| TAX FREE 200 PLN 門檻 | 站內多處使用 | 與 PUESC 官方資訊相符 | https://puesc.gov.pl/en/uslugi/tax-free-informacja-dla-podroznych；保留 |
| 預付 SIM 實名 | Play／Plus／Orange；抵達後看方案 | 未逐商家核實 2026 方案 | 現有不保證價格／容量的寫法正確 |
| 換匯、刷卡 PLN、DCC、寄物櫃 | 原則性提醒 | 無單一官方即時數值 | 保留為實務提醒，不寫固定匯率、費率或必有空位 |
| 天氣 | 全日皆寫出發前 7–10 天更新 | 正確；9/19 尚不能提供可靠 10/23–11/1 預報 | 保留，不提前填值 |
| 日照 | 8 日 sunrise／sunset 計算值 | 本輪未重新運算 | 發布前跑專案 `sun:times`，不要把舊產物視為官方查核 |

本輪另完成下列一手複核：

- ETIAS 官方仍寫 2026 年第 4 季啟用、現階段無須行動、確切日期會提前數月公告；內容正確但 `checkedAt` 可更新：https://travel-europe.europa.eu/etias 。
- 10/25 確為非營業週日；法定例外不等於每間 Żabka 必定開門：https://www.gov.pl/web/family/trade-on-sundays 。
- 緊急電話 112／997／998／999 正確；986 是市政警察，但並非每座城市都有，應加註：https://www.gov.pl/web/numer-alarmowy-112/inne-numery-alarmowe 。
- 駐波蘭代表處地址、+48 22 213 0060、緊急電話 +48 668 027 574 均與外交部頁面相符：https://en.mofa.gov.tw/CountryInfoEn.aspx?CASN=1&n=1290&s=124&sms=0&tabs=08617EE9DB3C61E3 。
- TAX FREE 200 PLN 門檻與 PUESC 官方資訊相符：https://puesc.gov.pl/en/uslugi/tax-free-informacja-dla-podroznych 。

## 六、完整覆蓋說明與仍需人工操作的項目

本輪已讀取 `src/data/` 11 個資料檔並盤點所有明顯動態欄位；這代表「已盤點」，不等於每筆已由官方重新確認。實際覆蓋如下：

| 類別 | 盤點量 | 9/19 官方逐項已核實 | 部分核實／指定日不可讀 | 未逐項核實 |
|---|---:|---:|---:|---:|
| 景點、場館與行程備案 | 22 項 | 10 項 | 11 項 | 1 項 |
| 交通規則、票制與指定班次 | 11 項 | 1 項（官方更新機制） | 6 項 | 4 個城市票制僅確認未見改價公告，未逐價重讀 |
| 每日餐位 | 27 筆 | 18 筆 | 3 筆 | 6 筆 |
| 咖啡／小吃 | 21 筆 | 12 筆 | 3 筆 | 6 筆 |
| 速食分店 | 24 筆 | 13 筆 | 0 | 11 筆 |
| 其他餐飲集合 | `cityDining` 23、`cityFood` 28、Michelin 訂位 9 | Michelin 4 城摘要及主要高價訂位逐項查核 | 多筆描述僅部分有官方依據 | 不重複計入每日餐位／小吃的同名店 |
| 購物資料 | 37 筆 | 有官方依據的店家／商場（詳見上表）；oscypek 不列已核實 | 多數商品類別 | 無一手門市依據者已具名列出 |
| 實用資訊 | 42 筆（含日照、緊急、駐處、提醒及來源） | ETIAS、非營業週日、緊急電話、駐處、TAX FREE | 入境等；日照已另執行專案重算 | 12 句語言及一般打包清單未逐句外查 |

「已核實」的計數以本報告有具體官方查得值者為準；單純網站可開啟、搜尋結果存在或舊報告曾查過，都不計入。地圖座標與照片授權屬另一類靜態來源，不在「旅遊資料更新」範圍內。官方日期選擇器、私人訂單與即時售票庫存無法由靜態頁證實，因此以下項目必須由使用者或後續瀏覽器工作階段實際操作：

1. e-IC 2.0 逐段查 10/25、10/27、10/28、10/29 的班次、上車站、票價、座位及可售狀態。
2. Lajkonik 實際下單前再次確認 10/26 去回班次與上下車點。
3. 逐一開啟 Wawel、辛德勒工廠、Wieliczka、Panorama、百年廳、可頌博物館、皇家城堡、POLIN、華沙起義博物館售票頁確認指定日庫存。
4. 已訂 Auschwitz 的 10:30 入場證與官方帳戶屬私人資料，本輪不存取；導覽長度、集合時間及姓名須以票面為準。

## 七、查核建議清單（查核時記錄，實際處置見第八節）

### P0：會直接造成撲空或誤判

- 修正 10/28 樂斯拉夫動物園候選資料：週三入園截止 16:00、Afrykarium 17:00 關閉；不需重排未含動物園的既定 Day 5。
- 修正 Day 7 華沙起義博物館免費日為週四。
- 保留 9/8 原始 `saleOpens` 作歷史查核值，但顯示成「上次查得、待複核」，移除「尚未開賣」的確定斷言；現在就進官方售票器查，而不是等舊日期。

### P1：狀態與說明一致性

- Auschwitz 並列「一般官網約 3.5 小時」與「9/9 已訂紀錄 3 小時 45 分」；保留 14:15 結束與「票面優先」。
- 統一 Lajkonik 狀態；修正 `bookingTiers`「全部尚未訂」的錯誤總結。
- 指定日庫存欄與一般票價／營業時間欄分開。

### P2：行前重查

- 所有餐廳於用餐日前 24–48 小時再看官方公告或致電。
- 城市交通票價、工程改道、SKM 月台與即時班次於抵達前 1–3 天重查。
- 天氣資訊只在出發前 7–10 天加入，不應於 9/19 預填預報。


## 八、整合處置與驗證

本報告前述「現有值」指 GitHub 基準 `28d9b37`，不是修改後的數值；原始本地專案尚未更新。

已在暫存副本修正動物園 10 月時段、起義博物館免費日、火車歷史開賣紀錄的待複核標示、Auschwitz 已訂與巴士未購的矛盾說明，以及餐廳時間、MAX 門牌、未證套餐價與 Bib 標示。保留已訂 Auschwitz 的 3 小時 45 分與既有回程安排；一般官網概述的 3.5 小時不足以覆蓋票券紀錄。

Karczma Górnicza 從午餐首選降為「暫不採用」的備案；補列既定行程原有的 Wieliczka 鎮中心午餐，明說店家待選，地圖只是區域餐廳搜尋。因此修改後每日餐位為 28 筆，其中一筆是待選安排，不是已核實店家；前面 27 筆的查核統計仍以基準資料計。

購物修正 S&A 的 Grodzka 14、補 Chylak 聯合店與 World of Amber 官網店址；未核實門市、固定價格、機場價差、Żabka 營業保證與簡易琥珀鑑真說法均改為具體待確認說明。Day 8 商場只有 09:00 至 09:45 的窗口，另須往返與結帳，改建議前一天買齊。

Day 1 移除科學文化宮「老城步行 12 分」的未證分鐘數；Łazienki 改為花園散步，區分免費花園與另計門票的館舍。依據：[官方票價](https://www.lazienki-krolewskie.pl/pl/zwiedzanie/cennik)、[官方開放時間](https://www.lazienki-krolewskie.pl/pl/zwiedzanie/godziny-otwarcia)。

程式收斂今日卡與共用日期處理、HTTPS 連結處理；修正內嵌腳本測試根節點，使測試真正進入日期判斷。獨立審查發現的測試缺口、歷史日期漏標及 Wrocławska 未核實開門時間均已處理。

日照已執行 `npm run sun:times` 重算，8 天數值與既有資料一致。行程稽核保留 Day 3 巴士 25 分鐘緩衝的人工提醒，不將專案 30 分鐘門檻當成官方規則。最終完整測試與瀏覽器驗證見同目錄交付紀錄。

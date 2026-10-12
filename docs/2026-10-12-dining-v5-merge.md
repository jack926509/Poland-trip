# 餐飲 v5 整併紀錄（2026-10-12）

依使用者提供的兩份稿件整併：「波蘭 2026｜每日餐飲安排」（下稱 A 稿，含推薦菜色與安排理由）與「波蘭自由行 每日三餐安排 v5」（下稱 v5，含營業時間、威靈頓牛排、異國與速食備案）。兩稿衝突時以 v5 為主選（較新，且依專案資料調整過），A 稿的菜色與理由併入說明，A 稿主選改列備選。原有餐廳一律保留為備選，不刪除。

## 最終三餐總表

| 日期 | 早餐 | 午餐 | 晚餐 | 點心／咖啡 |
|---|---|---|---|---|
| 10/24（六）華沙 | 機上 | 機上／抵達後輕食 | Specjały Regionalne 18:30 | 回飯店路上在 Żabka 買隔天備用早餐 |
| 10/25（日）→克拉科夫 | Green Caffè Nero（中央車站） | **Restauracja Polonia** 12:00 | Hankki 19:15 | Endzior 宵夜（有力氣再去） |
| 10/26（一）奧斯威辛 | 自備（前一天 Lajkonik 買） | 自備 | **Mr. Jerry** 18:30（Beef Wellington） | — |
| 10/27（二）鹽礦→樂斯拉夫 | **Charlotte Plac Szczepański** 07:45 | Bistro Posolone | Samarqand | — |
| 10/28（三）樂斯拉夫→波茲南 | Central Cafe | Restauracja Wrocławska 12:00 | MAX Wroclavia 外帶上車 | El Gato 咖啡 |
| 10/29（四）波茲南→華沙 | **Charlotte Krysiewicza** 08:00 | Pyra Bar 12:30 | **Arirang**（抵站後） | **ROGAL** 12:15 |
| 10/30（五）華沙 | Bar Mleczny Bambino | Café Bristol 11:30 | **Rusiko** 18:30 | A. Blikle pączki、Wedel 熱巧克力 |
| 10/31（六）離境 | Charlotte Bouillon Złota | 機場（安檢後） | 機上 | — |

粗體為本次更換的主選。

## 衝突與取捨

| 餐次 | A 稿 | v5 | 採用 | 原主選去向 |
|---|---|---|---|---|
| 10/25 午 | Polonia | Polonia | Polonia | Przypiecek → 備選（24 小時） |
| 10/26 晚 | FOLGA | Mr. Jerry | Mr. Jerry（唯一吃得到威靈頓的晚餐） | Pod Aniołami、FOLGA → 備選 |
| 10/27 早 | Charlotte | Charlotte | Charlotte；先退房寄行李再吃 | 前晚備妥的麵包 → 備案 |
| 10/28 早 | Charlotte Pokoyhof | Central Cafe | Central Cafe（原專案主選） | Pokoyhof 維持備案 |
| 10/28 晚 | KFC 車站 | MAX Wroclavia | MAX（原專案主選） | KFC、Pasibus Wroclavia → 備案 |
| 10/29 早 | Charlotte | Charlotte | Charlotte，08:00 用餐、09:30 教堂島不變 | Ptasie Radio → 備選 |
| 10/29 點心 | ROGAL | ROGAL | ROGAL | Kandulski → 備選 |
| 10/29 晚 | Yache Korea | Arirang | Arirang（Yache 週四 20:30 關，晚抵來不及） | Ćma → 24 小時備案 |
| 10/30 早 | Bułkę przez Bibułkę | Bambino | Bambino（原專案主選） | Bułkę przez Bibułkę → 備選 |
| 10/30 午 | 不排 Café Bristol | Café Bristol | Café Bristol（POLIN 已於 10/10 取消，A 稿的折返顧慮不再成立） | — |
| 10/30 晚 | U Fukiera | Rusiko | Rusiko | WYRAJ、Kieliszki、U Fukiera、Ceviche Bar → 備選，依當時所在地選 |

## 新增門市（14 筆，97 → 111）

Mr. Jerry、Charlotte Plac Szczepański、Milkbar Tomasza、Zen On、Rusiko、Ceviche Bar、Bułkę przez Bibułkę｜Zgoda、Soul Kitchen、Bydło i Powidło（Wellington Show，只在週一，標為排不進）、McDonald's 中央車站周邊，以及四家已在速食清單的 Pasibus（Galeria Krakowska、Wroclavia、Święty Marcin、Złote Tarasy）。四家 Pasibus 改由餐飲主檔維護，速食頁共用同一筆資料。

MOLÁM、Arirang、Oseyo 25、Inna Piekarnia 依 v5 補上地址或時段；其餘既有門市補入兩稿的推薦菜色。

## 查核界線

- 本次建置環境無法連線 Mr. Jerry、Charlotte 等官網，新增門市除四家 Pasibus（沿用 2026-09-19 官網查核）外一律標 `pending`，時段註明出自 v5 稿。
- 出發前要確認：Mr. Jerry 10/26 是否供應 Wellington 並訂位、Rusiko 10/30 營業與訂位、Arirang 週四最後接單、Charlotte Plac Szczepański 門牌與週二 07:00 開門、Polonia 是否 11:30 就開。
- Bar Bambino 地址：v5 列 Krucza 21，官網為 Hoża 19，以官網為準。
- 已購車票、Auschwitz 導覽與各館時段不因用餐調整；10/27 早餐改為先退房再吃，仍趕 09:00 往 Wieliczka 的車。

## 驗證

`./verify.sh` 全數通過（352 項）；`audit:schedule` 8 天、78 個有時刻步驟結構檢查通過。兩項測試的預期值依本次變更更新：已核實餐段門市 31 → 35（四家 Pasibus），未記錄查核日的待辦 6 → 7（Mr. Jerry、Rusiko 取代已查核的 WYRAJ 與 Pod Aniołami）。

## 第二輪：逐店複查、三餐動線盤點與店家卡改版（2026-10-12）

建置環境無法直接連線店家網站，改以網路搜尋交叉比對官網、Michelin、Yelp、Tripadvisor 與在地目錄。每家結果寫進餐飲主檔：`liveCheckedAt`（確認仍營業的日期）、`hours`（只留時段）、`hoursNote`（時段出處，收在查核紀錄）、`cuisine`、`dishes`（推薦菜色）、`phone`。

### 複查結果

- 排入八天的 59 家餐廳全部仍在營業，沒有發現倒閉。
- 速食分店：Poznań Stary Rynek 87 的 McDonald's 仍在改建，**尚未開幕**，換成 Półwiejska 2A；Salad Story Avenida 查無門市，移除（34 → 33 間）。其餘 14 間原本待確認的分店都已確認營業並補上時段。
- 待確認升為部分核實 21 家（例如 Mr. Jerry、Rusiko、Charlotte Plac Szczepański、Arirang、Polonia、Hankki、Milkbar Tomasza、Zen On、Ceviche Bar、Kieliszki），已核實／部分核實的行程餐廳從 35 家增為 56 家。

### 地址更正

| 店家 | 原資料 | 更正 |
|---|---|---|
| Rusiko | Wierzbowa 11 | 確認 Wierzbowa 11；Yelp 顯示的 Al. Ujazdowskie 22 是舊址 |
| Oseyo 25 | 門牌待確認 | Malarska 25 |
| Kieliszki na Próżnej | 門牌待確認 | Próżna 12 |
| Bułkę przez Bibułkę | Zgoda（門牌待確認） | Zgoda 3 |
| Milkbar Tomasza | 門牌待確認 | Świętego Tomasza 24 |
| Ceviche Bar | Twarda 2-4 | Twarda 4 |
| Cukiernia Kandulski | 門牌待確認 | Stary Rynek 沒有分店；最近的是 Plac Ratajskiego 1（往帝王城堡路上） |
| A. Blikle | Nowy Świat 33 | 甜點店在 Nowy Świat 35 |

### 三餐動線盤點後的調整

- 10/26 晚：FOLGA 週一是否營業來源矛盾，改由每日 13:00–23:00 的 Pod Aniołami 當 Mr. Jerry 首替。
- 10/28 午：Konspira 週三 13:00 才開，註明只在午餐延後時替補。
- 10/29：ROGAL 售完時改往帝王城堡路上的 Kandulski（Plac Ratajskiego 1）；Arirang 確認週四營業至 22:00，補兩支電話；新增週四營業、招牌是威靈頓的 Soul Kitchen 為晚餐備選。
- 10/25 早：McDonald's 確認在 Warszawa Centralna 站內、約 05:00 開門，作為 Green Caffè Nero 的同站備案。
- 其餘每一餐的用餐時刻都落在店家營業時間內，前後步驟的交通時間不變。

### 店家卡改版

每日行程、今日速查、餐飲指南與城市指南共用同一張店家卡：

- 店名下一列小標：料理類型、查證狀態（已查證／部分查證／待確認）、「10/12 確認仍營業」。
- 營業時間與推薦菜色直接可見，菜色做成標籤。
- 菜單與電話是 44px 按鈕，電話可直接撥打。
- 採用條件用黃底提示框；地址、時段出處、查核日期與來源收在「地址與查核紀錄」。
- 速食分店：營業時間獨立一行，加上各家推薦三樣；餐飲指南新增依城市分組的「分店與營業時間」名錄。
- 餐飲指南的營業時間清單，每家都連回排定的那一天；城市指南也順帶修正了手機卡片版店名被擠成窄欄的舊問題。

## 第三輪：資料正確性複查與三餐卡改版（2026-10-12）

### 資料更正

- 過時說明清除：Specjały 晚餐時刻（19:00 → 18:30）、Okrąglak「Day 2 晚餐順路」、Camelot「Day 4 採購後歇腳」、WANDAL「Day 7 晚餐候選」、Hala Koszyki「Day 6 首選」、QQ「店址待確認」。
- Endzior：多數來源週日公休，10/25（週日）的宵夜改註「可能公休，改圓亭其他窗口」。
- Pierożki u Vincenta：本店在 Bronowice（Lea 114，平日 16:30 關），改列 Kazimierz 的 Pierogi MR Vincent（Bożego Ciała 12）。
- Green Caffè Nero 站內店：現為 Green Nero Express（Lokal N20，Yelp 2026-03 列 24 小時）。
- 補查並升為部分核實：Weranda（Świętosławska 10，週四 09:00 開）、Gate One（機場官網確認在申根區）、Karma Kawiarnia（Krupnicza 12/3）、Cukiernia Michałek（Krupnicza 6）、Endzior。
- 每一餐的行程步驟都點名同一家店（自動比對 18 個餐段全數一致）。

### 當天營業檢查

每個排定餐段新增 `dayHours`（行程那一天的營業時段，取各來源最保守的交集）。新測試逐餐檢查：HH:MM 用餐時刻必須落在當天時段內，且離關門至少 45 分鐘；之後改行程或改店，只要時間對不上，測試會直接失敗。

### 三餐卡改版

- 早餐、午餐、晚餐各自是一張卡，左緣色條依餐別（早餐金、午餐綠、晚餐紫），餐別與時刻做成膠囊。
- 第一行是「當天」：例如「10/26 (一) 15:00–22:00 ✓ 18:30 入座在營業時間內」；抵達時間不固定的餐顯示「依實際抵達時間」。全週時段移到收合區。
- 自備餐與機上餐改為虛線卡，和有店家的卡區分開。
- 寬畫面（餐飲指南桌機）三餐並排三欄，同一天一眼比較；手機維持單欄。

## 第四輪：全站 UX 複查與資料更新（2026-10-12）

以 Playwright 在 390px 手機與 1280px 桌機逐頁開啟 25 頁，檢查水平溢出、頁長、觸控目標、文字尺寸、錨點與主控台錯誤（地圖底圖與外部照片因建置環境擋外網而載不到，不算缺陷；觸控目標在觸控裝置已有 44px 規則）。

| 問題 | 修正 | 結果（手機頁長） |
|---|---|---|
| 資料更新儀表板被長網址撐寬 268px | 待辦文字中的網址改成「網域 ↗」短連結，長字可斷行 | 溢出 0 |
| 餐飲指南過長 | Day 1–8 跳轉列；營業時間名錄依城市收合 | 50,535 → 23,841px |
| 城市頁餐廳表過長（華沙 28 家候選全展開） | 三餐主選與順路必吃先展開，備選與點心另一組收合；每列查核紀錄收合，營業時間仍可見 | 華沙餐廳區 19,235 → 6,379px |
| 訂票倒數手機卡片一筆約 500px | 倒數、日期、類別並排成一行 | 約減半 |
| 本頁章節手機一個標籤佔一行 | 手機隱藏英文小標，標籤兩個一列 | — |

資料更新：
- 倒數看板「米其林與熱門餐廳訂位」仍在推 Bottiglieria、BABA、Most（均未排入行程），改為實際要訂的 Mr. Jerry、Rusiko、Hankki、Specjały，附電話與訂位管道；待辦清單的「現在可先訂」同步改寫。
- 車站無障礙協助：PKP Intercity 官網現寫出發前 24 小時申請（舊頁仍寫 48 小時），補 24 小時客服電話，重查日改 10/22。
- 仍逾期的兩筆（景點票券、住宿確認）屬私人訂單資料，需使用者自行核對。

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

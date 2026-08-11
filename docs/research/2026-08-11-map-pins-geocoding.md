# 地圖圖釘座標查證紀錄

- 查證日期：2026-08-11（Asia/Taipei）
- 範圍：`src/data/cities.js` 的 55 筆 `mapPins`
- 座標服務：Nominatim／OpenStreetMap，識別 User-Agent 為 `PolandTripDataAudit/1.0`，查詢間隔至少 1 秒。
- 原則：地理編碼只用於將已知地址或明確店名轉為座標；不能取得可靠對應結果的圖釘維持 `unverified`，不憑目測改點。

## 目前進度

| 狀態 | 筆數 | 說明 |
|---|---:|---|
| `coordinate-verified` | 32 | 已取得可對應結果，並記錄現值差距。 |
| `unverified` | 23 | 尚未完成第一方地址及座標的獨立比對；不視為正確。 |

## 已完成座標比對

| 城市 | 圖釘 | 已知地址或名稱 | Nominatim 座標 | 與原值差距 | 處置 |
|---|---|---|---|---:|---|
| 華沙 | 皇家城堡 | Zamek Królewski, Plac Zamkowy 4 | 52.2479003, 21.0152802 | 80 m | 維持原座標。 |
| 華沙 | POLIN 猶太史博物館 | Mordechaja Anielewicza 6 | 52.2493716, 20.9931609 | 26 m | 維持原座標。 |
| 華沙 | 華沙起義博物館 | Grzybowska 79 | 52.2321024, 20.9813775 | 41 m | 維持原座標。 |
| 華沙 | 科學文化宮觀景台 | Pałac Kultury i Nauki, Plac Defilad 1 | 52.2317657, 21.0057979 | 16 m | 維持原座標。 |
| 華沙 | NUTA ★ | plac Trzech Krzyży 10/14 | 52.2296785, 21.0227183 | 86 m | 維持原座標。 |
| 華沙 | WANDAL | Pańska 97 | 52.2299561, 20.9894022 | 4 m | 維持原座標。 |
| 華沙 | Zagoździński | Górczewska 15 | 52.2366176, 20.9673791 | 22 m | 維持原座標。 |
| 華沙 | Hotel Metropol | Marszałkowska 99A | 52.2289902, 21.0110039 | 2 m | 維持原座標。 |
| 克拉科夫 | Bottiglieria 1881 ★★ | Bocheńska 5 | 50.0486716, 19.9462338 | 9 m | 維持原座標。 |
| 克拉科夫 | ibis budget Kraków Stare Miasto | Pawia 11 | 50.0708624, 19.9462851 | 15 m | 維持原座標。 |
| 克拉科夫 | 辛德勒工廠博物館 | Fabryka Emalia Oskara Schindlera, Lipowa 4 | 50.0474554, 19.9617094 | 12 m | 維持原座標。 |
| 克拉科夫 | Bufet KRK | Bufet KRK | 50.0516853, 19.9494114 | 3 m | 維持原座標。 |
| 克拉科夫 | Folga | Folga | 50.0517893, 19.9454656 | 4 m | 維持原座標。 |
| 克拉科夫 | MOLÁM Thai | Molam Thai Canteen & Bar, Rajska 3/4 | 50.0648507, 19.9276671 | 13 m | 維持原座標。 |
| 克拉科夫 | NOAH | Noah | 50.0514826, 19.9442829 | 1 m | 維持原座標。 |
| 克拉科夫 | Nat Bistro | Nat Bistro, Krakowska 34 | 50.0492839, 19.9432290 | 2 m | 維持原座標。 |
| 克拉科夫 | Plac Nowy (zapiekanka) | Plac Nowy | 50.0517373, 19.9446185 | 28 m | 維持原座標；結果為市集範圍。 |
| 克拉科夫 | Mirror Bistro | Mirror Bistro | 50.0539657, 19.9447965 | 3 m | 維持原座標。 |
| 樂斯拉夫 | 中央市集廣場 | Rynek | 51.1100431, 17.0318427 | 73 m | 維持原座標；結果為廣場幾何中心。 |
| 樂斯拉夫 | Afrykarium 動物園 | Wróblewskiego 1-5 | 51.1042548, 17.0748493 | 34 m | 維持原座標。 |
| 樂斯拉夫 | 百年廳 Hala Stulecia | Wystawowa 1 | 51.1068875, 17.0773185 | 7 m | 維持原座標。 |
| 樂斯拉夫 | BABA ★ | Baba, Nożownicza 1d | 51.1127291, 17.0319772 | 11 m | 維持原座標。 |
| 樂斯拉夫 | Miś SC | Bar Mleczny Miś, Kuźnicza 48 | 51.1125538, 17.0342353 | 14 m | 維持原座標。 |
| 樂斯拉夫 | Piast | Piłsudskiego 98 | 51.1001298, 17.0356866 | 0 m | 維持原座標；確認門牌，更新住宿資料的完整門牌待另行核對。 |
| 波茲南 | 舊市集廣場 Stary Rynek | Stary Rynek | 52.4082892, 16.9335980 | 64 m | 維持原座標；結果為廣場幾何中心。 |
| 波茲南 | 大教堂島 Ostrów Tumski | Bazylika Archikatedralna Świętych Apostołów Piotra i Pawła | 52.4115729, 16.9486465 | 448 m | 改為 52.411573, 16.948647；原圖釘偏到座堂島北側。 |
| 波茲南 | 可頌博物館 | Rogalowe Muzeum Poznania, Stary Rynek 41/2 | 52.4083783, 16.9350150 | 12 m | 維持原座標。 |
| 波茲南 | Palmiarnia 棕櫚屋 | Palmiarnia Poznańska | 52.4017764, 16.9012734 | 48 m | 維持原座標。 |
| 波茲南 | Muga ★ | Muga | 52.4039992, 16.9291647 | 4 m | 維持原座標。 |
| 波茲南 | Na Winklu | Na Winklu | 52.4113151, 16.9529741 | 4 m | 維持原座標。 |
| 波茲南 | Szarlotta | Bistro Szarlotta | 52.4072462, 16.9342333 | 10 m | 維持原座標。 |
| 波茲南 | Poznan Apartments Towarowa | Towarowa 37/201 附近接待處 | 52.4040007, 16.9152789 | 25 m | 維持原座標；結果名稱為同址的 Capital Apartments，出發前仍以住宿確認單為準。 |

## 後續處理

1. 其餘 23 筆先取得第一方地址，再做同樣的座標比對。
2. 差距超過 100 m 且地址、地理編碼結果可信時才修正。
3. Rozbrat 20 沒有門牌級座標前不加入圖釘；街道中心座標不可視為驗證完成。
4. 住宿旁 Żabka 未取得可靠座標前不調整或新增圖釘。

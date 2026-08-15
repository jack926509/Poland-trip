# 地圖圖釘座標查證紀錄

- 查證日期：2026-08-11、2026-08-12、2026-08-15（Asia/Taipei）
- 範圍：`src/data/cities.js` 的 `mapPins`（2026-08-15 加入 Rozbrat 20 ★ 後為 56 筆）
- 座標服務：Nominatim／OpenStreetMap，識別 User-Agent 為 `PolandTripDataAudit/1.0`，查詢間隔至少 1 秒。
- 原則：地理編碼只用於將已知地址或明確店名轉為座標；不能取得可靠對應結果的圖釘維持 `unverified`，不憑目測改點。

## 目前進度

| 狀態 | 筆數 | 說明 |
|---|---:|---|
| `coordinate-verified` | 49 | 已取得可對應結果，並記錄現值差距。 |
| `unverified` | 7 | 4 家 Żabka 依使用者決定不再逐店確認；其餘 3 筆是面狀景點，本來就沒有門牌級錨點。 |

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

## 2026-08-12 補充查證

以下各筆先以場館或店家第一方頁面取得地址，再以 Nominatim／OpenStreetMap 查詢；數字是與 2026-08-12 前原圖釘的直線距離。除克拉科夫陶器店外，所有差距均低於 100 m，故保留原座標。

| 城市 | 圖釘 | 第一方地址與來源 | Nominatim 座標 | 差距 | 處置 |
|---|---|---|---|---:|---|
| 華沙 | Alon Omakase ★ | Woronicza 33C lok. U4；[店家條款](https://omakase.eu/en/terms-conditions/) | 52.1884477, 20.9914154 | 7 m | 維持。 |
| 華沙 | hub.praga ★ | Jagiellońska 22；[店家聯絡頁](https://hub-praga.pl/kontakt) | 52.2511343, 21.0361172 | 4 m | 維持。 |
| 華沙 | Pijalnia Czekolady E.Wedel（巧克力） | Szpitalna 8；[Wedel 店點](https://wedelpijalnie.pl/lokale) | 52.2333391, 21.0148208 | 8 m | 維持。 |
| 華沙 | Vitkac | Bracka 9；[Vitkac 聯絡頁](https://www.vitkac.com/us/lp/contact) | 52.2310149, 21.0185680 | 10 m | 維持。 |
| 華沙 | Chylak（波蘭設計師包款） | Koszykowa 5；[Chylak 店點](https://chylak.com/pl/pl/retailers) | 52.2218013, 21.0200005 | 45 m | 維持。 |
| 華沙 | ibis budget Warszawa Reduta | Bitwy Warszawskiej 16A；[Accor 飯店頁](https://all.accor.com/hotel/7148/index.en.shtml) | 52.2145926, 20.9676645 | 35 m | 維持。 |
| 克拉科夫 | Wawel 皇家城堡 | Wawel 5；[城堡聯絡頁](https://wawel.krakow.pl/kontakt) | 50.0542052, 19.9361367 | 52 m | 維持。 |
| 克拉科夫 | Bar Smak | Karmelicka 10；[店家頁](https://bar-smak-krakow.eatbu.com/) | 50.0640243, 19.9321602 | 1 m | 維持。 |
| 克拉科夫 | Hamsa | Szeroka 2；[店家頁](https://hamsa.eatbu.com/?lang=pl) | 50.0531324, 19.9476916 | 7 m | 維持。 |
| 克拉科夫 | Ceramika Bolesławiecka（陶器） | Kobalt，Grodzka 62；[陶器品牌經銷頁](https://kobalt.com.pl/gile) | 50.0552314, 19.9384705 | 293 m | 改為此官方列出的經銷店座標。 |
| 克拉科夫 | World of Amber（琥珀） | Grodzka 38；[店家頁](https://worldofamber.pl/) | 50.0583170, 19.9381812 | 5 m | 維持。 |
| 克拉科夫 | Sukiennice 布廊（伴手禮攤位） | Rynek Główny 1–3；[市府旅遊頁](https://krakow.travel/en/54-krakow-cloth-hall) | 50.0615174, 19.9371069 | 28 m | 維持；地理編碼結果為廣場代表點。 |
| 樂斯拉夫 | Most ★ | Księcia Witolda 1；[餐廳頁](https://miedzy-mostami.pl/en/most-restaurant/) | 51.1147935, 17.0311032 | 4 m | 維持。 |
| 樂斯拉夫 | IDA kuchnia i wino | Łazienna 4；[店家頁](https://idakuchniaiwino.pl/) | 51.1124135, 17.0293523 | 18 m | 維持。 |

## 2026-08-15 補充查證（結案輪）

前兩輪剩下的兩筆餐飲圖釘，本輪在可連通 Nominatim 的環境完成門牌級比對。

| 城市 | 圖釘 | 門牌與來源 | Nominatim 座標 | 差距 | 處置 |
|---|---|---|---|---:|---|
| 華沙 | Bar Mleczny Rusałka | Floriańska 14, 03-707；多家波蘭商家名錄一致列出（[Panorama Firm](https://panoramafirm.pl/mazowieckie,,warszawa,praga_p%C3%B3%C5%82noc,floria%C5%84ska,14/rusalka_bar_mleczny_maria_sobolewska-pgcce_bpl.html)、[TerazOtwarte](https://teraz-otwarte.pl/warszawa/rusa%C5%82ka-bar-mleczny-161684)、[Targeo](https://mapa.targeo.pl/rusalka-florianska-14-03-707-warszawa~4803259/mleczny-bar/adres)），OSM 該門牌郵遞區號同為 03-707 | 52.2525818, 21.0305631 | 20 m | 維持原座標，改為 `coordinate-verified`。 |
| 克拉科夫 | Svensson Pierogi | Długa 58, 31-146（`dining.js` 已記錄之門牌，OSM 有對應建物節點） | 50.0706916, 19.9363640 | 4 m | 維持原座標，改為 `coordinate-verified`。 |

至此 52 筆非 Żabka 圖釘中，除 3 筆面狀景點外全部完成門牌級或錨點級比對。

## 後續處理

1. 中央市集廣場、Kazimierz 猶太區與大教堂島 Ostrów Tumski 都是面狀景點，沒有單一門牌級錨點；維持未驗證，避免把代表點誤標成精確位置。
2. 4 家 Żabka 分店依使用者決定排除逐店查證，維持未驗證即可。
3. Rozbrat 20 已於 2026-08-15 取得門牌級座標並加入圖釘：OSM 餐廳節點 `52.2242001, 21.0350992`（Rozbrat 20, 00-447 Warszawa），分類 `star1`。與先前引用的街道中心估值 `52.226000, 21.034167` 相差 210 m，證實街道中心座標確實不可當成門牌位置使用。華沙圖釘數因此由 16 增為 17，全站合計 56。

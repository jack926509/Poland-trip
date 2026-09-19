# 2026-09-19 連鎖速食門市查核

## 結論

原資料共有 24 個地址群組，其中 9 組把兩間門市寫在同一筆。本輪拆成 **33 間單店**：18 間可由品牌官方門市頁或官方 locator 直接確認地址，15 間因官方 locator 無法逐店重現而保留為 `pending`。`pending` 不帶查核日，營業時間統一寫「待確認」，沒有以購物中心或第三方頁面代替品牌官方證據。

## 已核實門市

| 品牌 | 城市／門市 | 官方確認內容 | 官方來源 |
|---|---|---|---|
| Pasibus | 華沙 Hoża 29、Złote Tarasy；克拉科夫 Galeria Krakowska；樂斯拉夫 Świdnicka、Wroclavia；波茲南 Św. Marcin、Avenida | 7 間地址與逐日時間 | [官方 locator](https://pasibus.pl/lokalizacje/)、[Hoża](https://pasibus.pl/lokalizacje/warszawa/pasibus-hoza-warszawa/)、[Złote Tarasy](https://pasibus.pl/lokalizacje/warszawa/warszawa-zlote-tarasy/)、[Galeria Krakowska](https://pasibus.pl/lokalizacje/krakow/pasibus-krakow-galeria-krakowska/)、[Świdnicka](https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-stacja-swidnicka/)、[Wroclavia](https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-wroclavia/)、[Św. Marcin](https://pasibus.pl/lokalizacje/poznan/lokal-pasibus-sw-marcin/)、[Avenida](https://pasibus.pl/lokalizacje/poznan/foodcourt-pasibus-avenida/) |
| MAX Premium Burgers | 華沙 Złote Tarasy；克拉科夫 Nowohucka 52；樂斯拉夫 Galeria Dominikańska、Wroclavia；波茲南 Hetmańska 82a | 5 間地址；前 4 間另有逐日時間，Hetmańska 僅由官方外送門市表確認地址 | [Złote Tarasy](https://www.maxpremiumburgers.pl/znajdz-max/restauracje/warszawa-2/)、[Kraków](https://www.maxpremiumburgers.pl/znajdz-max/restauracje/max-krakow/)、[Galeria Dominikańska](https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw/)、[Wroclavia](https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw3/)、[官方外送門市表](https://www.maxpremiumburgers.pl/dostawa/) |
| Berlin Döner Kebap | 華沙 Złote Tarasy；克拉科夫 Galeria Krakowska、Galeria Kazimierz；樂斯拉夫 Pasaż Grunwaldzki；波茲南 King Cross、Poznań Plaza | 6 間地址與逐日時間 | [Złote Tarasy](https://www.berlindonerkebap.com/restauracje/warszawa/zote-tarasy/)、[Galeria Krakowska](https://www.berlindonerkebap.com/restauracje/krakow/galeria_krakowska/)、[Galeria Kazimierz](https://www.berlindonerkebap.com/restauracje/krakow/galeria-kazimierz/)、[Pasaż Grunwaldzki](https://www.berlindonerkebap.com/restauracje/wrocaw/pasaz_grunwaldzki/)、[King Cross](https://www.berlindonerkebap.com/restauracje/poznan/ch-king-cross-marcelin/)、[Poznań Plaza](https://www.berlindonerkebap.com/restauracje/poznan/pozna-plaza/) |

## 未核實但保留的門市

以下 15 間保留原候選與精確 Google Maps 搜尋，但本輪無法由品牌官方 locator 逐店確認，因此標為 `pending`：

- KFC：華沙 Złota 59、克拉科夫 Floriańska 33、樂斯拉夫 Świdnicka 13、波茲南 Półwiejska 42。官方入口：[KFC 門市](https://kfc.pl/restauracje)。
- McDonald’s：華沙 Świętokrzyska 35、克拉科夫 Szewska 2、樂斯拉夫 Rynek 30、波茲南 Stary Rynek 87。官方入口：[McDonald’s 門市](https://mcdonalds.pl/restauracje/)。
- Salad Story：華沙 Chmielna 73、Złota 59；克拉科夫 Pawia 5、Podgórska 34；樂斯拉夫 Sucha 1；波茲南 Półwiejska 42、Matyi 2。官方入口：[Salad Story 門市](https://saladstory.com/lokale/)。

## 資料修正原則

- 原資料的 `Hoża 29/31` 依 Pasibus 官網改為 `Hoża 29`。
- MAX Kraków 依品牌門市頁使用 `Nowohucka 52`；官方另一個外送彙整頁寫成 54，兩頁有衝突，本檔採用專屬門市頁並在出發前仍以 locator 為準。
- McDonald’s 的 Burger Drwala 不再寫死某年 11 月上市或據此推斷行程一定吃不到；季節商品以官方即時菜單為準。
- `fastFoodHubs.branchIds` 指向拆分後的單店；hub 可包含 `pending` 門市，前端應顯示每筆自身的查核狀態。

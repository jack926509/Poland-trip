# 2026-10-07 餐廳圖釘補強與景點票券本地複核

本輪只交叉檢查專案正本與既有研究，沒有成功取得新的外部座標或票券證明。

## 來源連線限制

- `https://koszyki.com/`、`https://nominatim.openstreetmap.org/search` 與 Auschwitz 官方頁的 HTTPS 請求被環境代理拒絕：`CONNECT tunnel failed, response 403`，目標 HTTP 狀態為 000。
- Nominatim 請求使用可識別的 `PolandTripDataAudit/1.0 (https://github.com/jack926509/Poland-trip)` User-Agent。沒有並行或大量查詢，亦沒有繞過網路限制。
- 其他缺點餐廳的既有研究沒有足以補入城市地圖的逐店座標證據。Stary Browar 雖有既有每日圖座標，景點主檔 `checkedAt` 是 null，研究未記錄逐點地理編碼結果；本輪不將它升格為已驗證餐廳點。
- **未新增任何餐廳座標，覆蓋仍為 18/104，剩餘 86 家。**

## 已完成的本地改正

- 覆蓋率以 `placeId`／門市 ID 比對，避免同名品牌不同分店互相算作已涵蓋；無 ID 的舊記錄不代替已有 ID 的分店。
- Szpitalna 8 的 Wedel 巧克力圖釘接回該分店 ID 與主檔導航；沿用既有 2026-08-12 座標查核日期，不改寫為今天。Krakowskie Przedmieście 45 仍在待補清單。
- `npm run audit:map-pins -- --details` 可輸出最新逐店 JSON，包括 ID、名稱、地址、狀態、來源與是否列入每日餐廳候選。下表是本輪快照，執行時以正本資料重新計算。
- 景點票券文件原摘要說全部尚待確認，已按 `todoGroups` 更正：主要景點 8 項加牛角麵包博物館 1 項，共 9 項；Auschwitz 10/26 10:30 英文官方導覽、2 人已有 2026-09-09 訂妥紀錄，其餘 8 項沒有已購票確認。
- 私人 PDF、證件、日期、時段、語言、人數與集合點仍須核對。文件改用 `private-required`，保留 `verifiedAt: null` 與原到期日 2026-09-24；本地複核不等於已完成私人票券查核，逾期提醒保留。

## 逐店待補清單

先查「每日候選」，再查地址明確的其他分店。狀態欄是店家事實的查核狀態，不是座標已驗證；即使 verified，也必須另取得能對應到同一門牌／分店的座標證據。未提供來源或門牌待確認者先確認店址，不能只依品牌名或 Google Maps 搜尋網址產生精確圖釘。

| 城市 | 優先 | placeId | 店名 | 地址 | 店家事實查核狀態 | 地址／店家來源 |
|---|---|---|---|---|---|---|
| 華沙 | 每日候選 | warsaw-u-fukiera | U Fukiera | Rynek Starego Miasta 27, Warszawa | verified | https://www.ufukiera.pl/kontakt/ |
| 華沙 | 每日候選 | warsaw-wyraj | WYRAJ | Krochmalna 59/lok U2, Warszawa | verified | https://wyraj.net/kontakt/ |
| 華沙 | 每日候選 | warsaw-bar-mleczny-prasowy-marszalkowska | Bar Mleczny Prasowy | Marszałkowska 10/16, Warszawa | verified | https://wcit.waw.pl/ |
| 華沙 | 每日候選 | warsaw-cafe-bristol | Café Bristol | Krakowskie Przedmieście 42/44, Warszawa | verified | https://www.cafebristol.pl/pl/ |
| 華沙 | 每日候選 | warsaw-specjaly-regionalne | Specjały Regionalne | Nowy Świat 44, Warszawa | partial | https://www.specjalyregionalne.pl/sklepy-stacjonarne/ |
| 華沙 | 每日候選 | warsaw-pyzy-flaki-gorace | Pyzy Flaki Gorące | Podwale 5, Warszawa | partial | https://www.pyzyflakigorace.pl/kontakt/ |
| 華沙 | 每日候選 | warsaw-yache-korea | Yache Korea | Nowogrodzka 25, Warszawa | verified | https://yachekorea.com/ |
| 華沙 | 每日候選 | warsaw-arirang-restaurant | Arirang Restaurant | Nowogrodzka 38, Warszawa | pending | 未提供 |
| 華沙 | 每日候選 | warsaw-qq-warsaw-matcha-korean-toasts | QQ Warsaw \| Matcha & Korean Toasts | QQ Warsaw Warszawa | pending | 未提供 |
| 華沙 | 其他候選 | warsaw-hala-koszyki | Hala Koszyki | ul. Koszykowa 63, Warszawa | verified | https://koszyki.com/ |
| 華沙 | 其他候選 | warsaw-zapiecek | Zapiecek | 門牌待確認 | pending | 未提供 |
| 華沙 | 其他候選 | warsaw-polka | Polka | Świętojańska 2（皇家城堡旁） | pending | https://warszawa.restauracjapolka.pl/about-us |
| 華沙 | 其他候選 | warsaw-wedel-krakowskie-45 | E.Wedel Pijalnia · Krakowskie Przedmieście 45 | Krakowskie Przedmieście 45, Warszawa | verified | https://wedelpijalnie.pl/lokale |
| 華沙 | 其他候選 | warsaw-kieliszki-na-proznej | Kieliszki na Próżnej | 門牌待確認 | pending | 未提供 |
| 華沙 | 其他候選 | warsaw-stary-dom | Stary Dom | 門牌待確認 | pending | 未提供 |
| 華沙 | 其他候選 | warsaw-bar-mleczny-bambino | Bar Mleczny Bambino | 門牌待確認 | pending | 未提供 |
| 華沙 | 其他候選 | warsaw-a-blikle-1869 | A. Blikle 1869 | 門牌待確認 | pending | 未提供 |
| 華沙 | 其他候選 | warsaw-kfc-zlote-tarasy | KFC · Złota 59 | Złota 59 | pending | https://kfc.pl/restauracje |
| 華沙 | 其他候選 | warsaw-mcdonalds-swietokrzyska | McDonald's · Świętokrzyska 35 | Świętokrzyska 35 | pending | https://mcdonalds.pl/restauracje/ |
| 華沙 | 其他候選 | warsaw-pasibus-hoza | Pasibus · Hoża 29 | Hoża 29 | verified | https://pasibus.pl/lokalizacje/warszawa/pasibus-hoza-warszawa/ |
| 華沙 | 其他候選 | warsaw-pasibus-zlote-tarasy | Pasibus · Złota 59 | Złota 59 | verified | https://pasibus.pl/lokalizacje/warszawa/warszawa-zlote-tarasy/ |
| 華沙 | 其他候選 | warsaw-max-zlote-tarasy | MAX Premium Burgers · Złota 59 | Złota 59 | verified | https://www.maxpremiumburgers.pl/znajdz-max/restauracje/warszawa-2/ |
| 華沙 | 其他候選 | warsaw-berlin-doner-zlote-tarasy | Berlin Döner Kebap · Złota 59 | Złota 59 | verified | https://www.berlindonerkebap.com/restauracje/warszawa/zote-tarasy/ |
| 華沙 | 其他候選 | warsaw-salad-story-varso | Salad Story · Chmielna 73 | Chmielna 73 | pending | https://saladstory.com/lokale/ |
| 華沙 | 其他候選 | warsaw-salad-story-zlote-tarasy | Salad Story · Złota 59 | Złota 59 | pending | https://saladstory.com/lokale/ |
| 克拉科夫 | 每日候選 | krakow-pod-aniolami | Pod Aniołami | Grodzka 35, Kraków | verified | https://www.podaniolami.pl/ |
| 克拉科夫 | 每日候選 | krakow-hankki | Hankki | Zabłocie 19A, Kraków | pending | https://guide.michelin.com/cz/en/lesser-poland/krakow/restaurant/hankki |
| 克拉科夫 | 其他候選 | krakow-pierozki-u-vincenta | Pierożki u Vincenta | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-endzior | Endzior · Plac Nowy 圓亭 | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-karma-coffee-roasters | Karma Coffee Roasters | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-cukiernia-michalek | Cukiernia Michałek | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-starka | Starka | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-szara-ges | Szara Gęś | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-klezmer-hois | Klezmer-Hois | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-pierogarnia-krakowiacy | Pierogarnia Krakowiacy | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-miod-malina | Miód Malina | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-cafe-camelot | Café Camelot | 門牌待確認 | pending | 未提供 |
| 克拉科夫 | 其他候選 | krakow-kfc-florianska | KFC · Floriańska 33 | Floriańska 33 | pending | https://kfc.pl/restauracje |
| 克拉科夫 | 其他候選 | krakow-mcdonalds-szewska | McDonald's · Szewska 2 | Szewska 2 | pending | https://mcdonalds.pl/restauracje/ |
| 克拉科夫 | 其他候選 | krakow-pasibus-galeria-krakowska | Pasibus · Pawia 5 | Pawia 5 | verified | https://pasibus.pl/lokalizacje/krakow/pasibus-krakow-galeria-krakowska/ |
| 克拉科夫 | 其他候選 | krakow-max-nowohucka | MAX Premium Burgers · Nowohucka 52 | Nowohucka 52 | verified | https://www.maxpremiumburgers.pl/znajdz-max/restauracje/max-krakow/ |
| 克拉科夫 | 其他候選 | krakow-berlin-doner-galeria-krakowska | Berlin Döner Kebap · Pawia 5 | Pawia 5 | verified | https://www.berlindonerkebap.com/restauracje/krakow/galeria_krakowska/ |
| 克拉科夫 | 其他候選 | krakow-berlin-doner-galeria-kazimierz | Berlin Döner Kebap · Podgórska 34 | Podgórska 34 | verified | https://www.berlindonerkebap.com/restauracje/krakow/galeria-kazimierz/ |
| 克拉科夫 | 其他候選 | krakow-salad-story-galeria-krakowska | Salad Story · Pawia 5 | Pawia 5 | pending | https://saladstory.com/lokale/ |
| 克拉科夫 | 其他候選 | krakow-salad-story-galeria-kazimierz | Salad Story · Podgórska 34 | Podgórska 34 | pending | https://saladstory.com/lokale/ |
| 樂斯拉夫 | 每日候選 | wroclaw-konspira | Konspira | Plac Solny 11, Wrocław | verified | https://www.restauracjakonspira.pl/contact |
| 樂斯拉夫 | 每日候選 | wroclaw-samarqand | Samarqand | Stawowa 23, Wrocław | verified | https://samarqand.pl/regulamin/ |
| 樂斯拉夫 | 其他候選 | wroclaw-el-gato-specialty-coffee | El Gato Specialty Coffee | Odrzańska 8, Wrocław | verified | https://elgatocoffee.pl/kontakt/ |
| 樂斯拉夫 | 其他候選 | wroclaw-dessert-boutique | Dessert Boutique | Świętego Mikołaja 43, Wrocław | partial | https://dessertboutique.pl/pages/contact |
| 樂斯拉夫 | 其他候選 | wroclaw-pierogarnia-stary-mlyn | Pierogarnia Stary Młyn | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-hala-targowa | Hala Targowa | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-pod-fredra | Pod Fredrą | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-jadka | Jadka | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-piwnica-swidnicka | Piwnica Świdnicka | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-kurna-chata | Kurna Chata | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-vincent-kazimierza-wielkiego-甜點 | Vincent · Kazimierza Wielkiego 甜點 | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-browar-stu-mostow | Browar Stu Mostów | 門牌待確認 | pending | 未提供 |
| 樂斯拉夫 | 其他候選 | wroclaw-kfc-swidnicka | KFC · Świdnicka 13 | Świdnicka 13 | pending | https://kfc.pl/restauracje |
| 樂斯拉夫 | 其他候選 | wroclaw-mcdonalds-rynek | McDonald's · Rynek 30 | Rynek 30 | pending | https://mcdonalds.pl/restauracje/ |
| 樂斯拉夫 | 其他候選 | wroclaw-pasibus-swidnicka | Pasibus · Świdnicka 11 | Świdnicka 11 | verified | https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-stacja-swidnicka/ |
| 樂斯拉夫 | 其他候選 | wroclaw-pasibus-wroclavia | Pasibus · Sucha 1 | Sucha 1 | verified | https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-wroclavia/ |
| 樂斯拉夫 | 其他候選 | wroclaw-max-galeria-dominikanska | MAX Premium Burgers · plac Dominikański 3 | plac Dominikański 3 | verified | https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw/ |
| 樂斯拉夫 | 其他候選 | wroclaw-max-wroclavia | MAX Premium Burgers · Sucha 1 | Sucha 1 | verified | https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw3/ |
| 樂斯拉夫 | 其他候選 | wroclaw-berlin-doner-pasaz-grunwaldzki | Berlin Döner Kebap · plac Grunwaldzki 22 | plac Grunwaldzki 22 | verified | https://www.berlindonerkebap.com/restauracje/wrocaw/pasaz_grunwaldzki/ |
| 樂斯拉夫 | 其他候選 | wroclaw-salad-story-wroclavia | Salad Story · Sucha 1 | Sucha 1 | pending | https://saladstory.com/lokale/ |
| 波茲南 | 每日候選 | poznan-pyra-bar | Pyra Bar | Strzelecka 13, Poznań | verified | https://pyrabar.eatbu.com/?lang=en |
| 波茲南 | 每日候選 | poznan-rogal | ROGAL Świętomarciński | Stary Rynek 11/17, Poznań | pending | 未提供 |
| 波茲南 | 每日候選 | poznan-hycka | Hyćka | Rynek Śródecki 17, Poznań | verified | https://hycka.pl/ |
| 波茲南 | 其他候選 | poznan-cukiernia-kandulski | Cukiernia Kandulski | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-stary-browar | Stary Browar | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-whiskey-in-the-jar | Whiskey In The Jar | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-hotel-bazar | Hotel Bazar | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-fromazeria | Fromażeria | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-spot | SPOT. | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-brovaria | Brovaria | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-weranda-caffe | Weranda Caffe | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-pijalnia-czekolady-e-wedel-stary-rynek | Pijalnia Czekolady E.Wedel · Stary Rynek | 門牌待確認 | pending | 未提供 |
| 波茲南 | 其他候選 | poznan-kfc-stary-browar | KFC · Półwiejska 42 | Półwiejska 42 | pending | https://kfc.pl/restauracje |
| 波茲南 | 其他候選 | poznan-mcdonalds-stary-rynek | McDonald's · Stary Rynek 87 | Stary Rynek 87 | pending | https://mcdonalds.pl/restauracje/ |
| 波茲南 | 其他候選 | poznan-pasibus-swiety-marcin | Pasibus · Święty Marcin 58/64 | Święty Marcin 58/64 | verified | https://pasibus.pl/lokalizacje/poznan/lokal-pasibus-sw-marcin/ |
| 波茲南 | 其他候選 | poznan-pasibus-avenida | Pasibus · Matyi 2 | Matyi 2 | verified | https://pasibus.pl/lokalizacje/poznan/foodcourt-pasibus-avenida/ |
| 波茲南 | 其他候選 | poznan-max-hetmanska | MAX Premium Burgers · Hetmańska 82a | Hetmańska 82a | partial | https://www.maxpremiumburgers.pl/dostawa/ |
| 波茲南 | 其他候選 | poznan-berlin-doner-king-cross | Berlin Döner Kebap · Bukowska 156 | Bukowska 156 | verified | https://www.berlindonerkebap.com/restauracje/poznan/ch-king-cross-marcelin/ |
| 波茲南 | 其他候選 | poznan-berlin-doner-poznan-plaza | Berlin Döner Kebap · Drużbickiego 2 | Drużbickiego 2 | verified | https://www.berlindonerkebap.com/restauracje/poznan/pozna-plaza/ |
| 波茲南 | 其他候選 | poznan-salad-story-stary-browar | Salad Story · Półwiejska 42 | Półwiejska 42 | pending | https://saladstory.com/lokale/ |
| 波茲南 | 其他候選 | poznan-salad-story-avenida | Salad Story · Matyi 2 | Matyi 2 | pending | https://saladstory.com/lokale/ |

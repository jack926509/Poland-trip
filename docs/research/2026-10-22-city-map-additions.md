# 2026-10-22 城市地圖補點查證

本次只新增城市圖釘及篩選，不改行程文字、時間或順序。以下每個 OSM ID 都在本次由 Nominatim `/lookup` 或 `/search` 回傳；使用 User-Agent `poland-trip-check/1.0`，依序查詢並限速。座標全部直接採 Nominatim 回傳的 `lat` / `lon`；coordinate-verified 的 distanceMeters = 0 表示與來源完全相同，並非現場量測誤差。node / way / relation 皆照回傳類型記錄，沒有用門牌點冒充商家。

有門牌的商家必須名稱、分店、門牌吻合；沒有固定門牌的紀念碑、城門等以名稱與所在街道比對。街道、廣場、橋身、園區、商場與建物群採 area-reference；代表點不是入口，不作門牌級承諾。新點一律採本次 OSM 座標；即使每日地圖有同名點也不覆寫它，避免動到每日編號或既有查證日期。舊城市圖釘不更動。

## 新增圖釘

| 城市 | 名稱（placeId） | OSM 類型+ID | OSM 名稱 | OSM 地址 | 採用座標（緯度, 經度） | 狀態 |
| --- | --- | --- | --- | --- | --- | --- |
| warsaw | Specjały Regionalne (`warsaw-specjaly-regionalne`) | [node/4408894491](https://www.openstreetmap.org/node/4408894491) | Specjały Regionalne | 44, Nowy Świat, Powiśle-Skarpa, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-363, Polska | 52.2345825, 21.0189984 | coordinate-verified |
| krakow | Lajkonik Basztowa (`krakow-lajkonik-basztowa`) | [node/2389248574](https://www.openstreetmap.org/node/2389248574) | Lajkonik | 15, Basztowa, Kleparz, Stare Miasto, Kraków, województwo małopolskie, 31-143, Polska | 50.0663241, 19.9403304 | coordinate-verified |
| krakow | Pimiento Shop and Bistro (`krakow-pimiento-shop-bistro`) | [node/2628685548](https://www.openstreetmap.org/node/2628685548) | Pimiento | 21, Świętego Filipa, Kleparz, Stare Miasto, Kraków, województwo małopolskie, 31-150, Polska | 50.0677985, 19.9421352 | coordinate-verified |
| krakow | Mr. Jerry (`krakow-mr-jerry`) | [node/475387245](https://www.openstreetmap.org/node/475387245) | Mr Jerry | 5, Jagiellońska, Stare Miasto, Kraków, województwo małopolskie, 31-009, Polska | 50.0628558, 19.93522 | coordinate-verified |
| wroclaw | Samarqand (`wroclaw-samarqand`) | [node/7077819111](https://www.openstreetmap.org/node/7077819111) | Samarqand | 23, Stawowa, Przedmieście Świdnickie, Wrocław, województwo dolnośląskie, 50-018, Polska | 51.1000212, 17.0336442 | coordinate-verified |
| warsaw | Arirang Restaurant (`warsaw-arirang-restaurant`) | [node/4878937179](https://www.openstreetmap.org/node/4878937179) | Arirang | 38, Nowogrodzka, Koszyki, Śródmieście Południowe, Śródmieście, Warszawa, województwo mazowieckie, 00-691, Polska | 52.228577, 21.0108084 | coordinate-verified |
| warsaw | Bułkę przez Bibułkę \| Zgoda (`warsaw-bulke-przez-bibulke-zgoda`) | [node/316892293](https://www.openstreetmap.org/node/316892293) | Bułkę przez Bibułkę | 3, Zgoda, Centrum, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-032, Polska | 52.2325833, 21.0140889 | coordinate-verified |
| warsaw | Polka (`warsaw-polka`) | [node/416560107](https://www.openstreetmap.org/node/416560107) | Polka | 2, Świętojańska, Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-267, Polska | 52.2482476, 21.013769 | coordinate-verified |
| warsaw | Soul Kitchen (`warsaw-soul-kitchen`) | [node/4373643390](https://www.openstreetmap.org/node/4373643390) | Soul Kitchen | 18A, Nowogrodzka, Krucza, Śródmieście Południowe, Śródmieście, Warszawa, województwo mazowieckie, 00-511, Polska | 52.2294483, 21.0148815 | coordinate-verified |
| warsaw | E.Wedel Pijalnia · Krakowskie Przedmieście 45 (`warsaw-wedel-krakowskie-45`) | [node/5194716723](https://www.openstreetmap.org/node/5194716723) | Pijalnia Czekolady E.Wedel | 45, Krakowskie Przedmieście, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-322, Polska | 52.2446285, 21.0137953 | coordinate-verified |
| warsaw | Café Bristol (`warsaw-cafe-bristol`) | [node/4551462797](https://www.openstreetmap.org/node/4551462797) | Cafe Bristol | 42/44, Krakowskie Przedmieście, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-072, Polska | 52.2421169, 21.015898 | coordinate-verified |
| warsaw | QQ Warsaw \| Matcha & Korean Toasts (`warsaw-qq-warsaw-matcha-korean-toasts`) | [node/3429255098](https://www.openstreetmap.org/node/3429255098) | QQ | 32/34, Żurawia, Krucza, Śródmieście Południowe, Śródmieście, Warszawa, województwo mazowieckie, 00-514, Polska | 52.2282747, 21.0138294 | coordinate-verified |
| krakow | Café Camelot (`krakow-cafe-camelot`) | [node/10951576960](https://www.openstreetmap.org/node/10951576960) | Camelot Cafe | 17, Świętego Tomasza, Stare Miasto, Kraków, województwo małopolskie, 31-022, Polska | 50.0629974, 19.9391046 | coordinate-verified |
| wroclaw | Charlotte Pasaż Pokoyhof (`wroclaw-charlotte-pokoyhof`) | [node/4372103191](https://www.openstreetmap.org/node/4372103191) | Charlotte | 2-4, Świętego Antoniego, Dzielnica Czterech Wyznań, Stare Miasto, Wrocław, województwo dolnośląskie, 50-073, Polska | 51.1084796, 17.0260038 | coordinate-verified |
| wroclaw | Paloma Coffee (`wroclaw-paloma-coffee`) | [node/5317362791](https://www.openstreetmap.org/node/5317362791) | Paloma | 8-9, Plac Solny, Dzielnica Czterech Wyznań, Stare Miasto, Wrocław, województwo dolnośląskie, 50-061, Polska | 51.109519, 17.0286819 | coordinate-verified |
| wroclaw | Słodki Chłopak w Muzeum Narodowym (`wroclaw-slodki-chlopak-muzeum-narodowe`) | [node/1452237509](https://www.openstreetmap.org/node/1452237509) | Słodki Chłopak | 5, Plac Powstańców Warszawy, Ostrów Tumski, Stare Miasto, Wrocław, województwo dolnośląskie, 50-153, Polska | 51.1107113, 17.0475408 | coordinate-verified |
| wroclaw | Dessert Boutique (`wroclaw-dessert-boutique`) | [node/5275535787](https://www.openstreetmap.org/node/5275535787) | Dessert Boutique | 43, Świętego Mikołaja, Dzielnica Czterech Wyznań, Stare Miasto, Wrocław, województwo dolnośląskie, 50-128, Polska | 51.1113645, 17.0235207 | coordinate-verified |
| poznan | Weranda Caffe (`poznan-weranda-caffe`) | [node/430266133](https://www.openstreetmap.org/node/430266133) | Weranda Caffe | 10, Świętosławska, Garbary, Chwaliszewo, Stare Miasto, Poznań, województwo wielkopolskie, 61-840, Polska | 52.4069438, 16.9341176 | coordinate-verified |
| krakow | Massolit Books & Café (`krakow-massolit-books-cafe`) | [node/3519353826](https://www.openstreetmap.org/node/3519353826) | Massolit | 4, Felicjanek, Nowy Świat, Stare Miasto, Kraków, województwo małopolskie, 31-104, Polska | 50.0584495, 19.9296035 | coordinate-verified |
| warsaw | 哥白尼紀念碑 Pomnik Kopernika | [node/282661680](https://www.openstreetmap.org/node/282661680) | Mikołaj Kopernik | Mikołaja Kopernika, Powiśle-Skarpa, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-328, Polska | 52.2381578, 21.0179739 | coordinate-verified |
| warsaw | 聖十字教堂 Kościół św. Krzyża | [way/28092628](https://www.openstreetmap.org/way/28092628) | Kościół pw. Świętego Krzyża | 3, Krakowskie Przedmieście, Centrum, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-927, Polska | 52.2387357, 21.0167603 | coordinate-verified |
| warsaw | 波蘭猶太人歷史博物館（外觀） | [way/186141946](https://www.openstreetmap.org/way/186141946) | Muzeum Historii Żydów Polskich Polin | 6, Mordechaja Anielewicza, Muranów, Śródmieście, Warszawa, województwo mazowieckie, 00-157, Polska | 52.2493716, 20.9931609 | coordinate-verified |
| warsaw | BUW 華沙大學圖書館屋頂花園 | [relation/6414970](https://www.openstreetmap.org/relation/6414970) | Biblioteka Uniwersytecka | 56/66, Dobra, Powiśle-Skarpa, Powiśle, Śródmieście, Warszawa, województwo mazowieckie, 00-312, Polska | 52.2426428, 21.0250683 | area-reference |
| warsaw | 瓦津基公園 · 蕭邦紀念碑 | [way/1448330230](https://www.openstreetmap.org/way/1448330230) | Fryderyk Chopin | Droga Belwederska, Powiśle-Solec, Ujazdów, Śródmieście, Warszawa, województwo mazowieckie, 00-758, Polska | 52.2147016, 21.0280881 | coordinate-verified |
| warsaw | MSN 現代美術館 | [way/944207076](https://www.openstreetmap.org/way/944207076) | Muzeum Sztuki Nowoczesnej | 103, Marszałkowska, Żelazna Brama, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-110, Polska | 52.2331288, 21.0089838 | coordinate-verified |
| warsaw | 克拉辛斯基廣場・起義紀念碑 | [way/1327606552](https://www.openstreetmap.org/way/1327606552) | Pomnik Powstania Warszawskiego | Plac Krasińskich, Staromiejskie, Nowe Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-238, Polska | 52.2493699, 21.0058184 | coordinate-verified |
| warsaw | 新城廣場 Rynek Nowego Miasta | [way/320220423](https://www.openstreetmap.org/way/320220423) | Rynek Nowego Miasta | Staromiejskie, Nowe Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-229, Polska | 52.2529105, 21.0083736 | area-reference |
| warsaw | 聖母訪親教堂 | [way/136396035](https://www.openstreetmap.org/way/136396035) | Kościół parafialny pw. Nawiedzenia Najświętszej Maryi Panny | 2, Przyrynek, Staromiejskie, Nowe Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-219, Polska | 52.2543057, 21.0090175 | coordinate-verified |
| warsaw | Freta 16 居禮夫人出生地紀念牌 | [node/5171659521](https://www.openstreetmap.org/node/5171659521) | Maria Skłodowska-Curie | 16, Freta, Staromiejskie, Nowe Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-227, Polska | 52.2514555, 21.0085289 | coordinate-verified |
| warsaw | 甕城 Barbakan | [way/249395313](https://www.openstreetmap.org/way/249395313) | Barbakan | Nowomiejska, Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-271, Polska | 52.2505875, 21.010017 | coordinate-verified |
| warsaw | 聖若望大教堂 | [way/404052334](https://www.openstreetmap.org/way/404052334) | Archikatedra pw. Świętego Jana Chrzciciela | 8, Świętojańska, Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-288, Polska | 52.2488818, 21.0136708 | coordinate-verified |
| warsaw | 聖安妮教堂（外觀） | [way/25865144](https://www.openstreetmap.org/way/25865144) | Kościół pw. Świętej Anny | 68, Krakowskie Przedmieście, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-322, Polska | 52.2462123, 21.0143595 | coordinate-verified |
| warsaw | 大劇院・國家歌劇院（外觀） | [node/8839947745](https://www.openstreetmap.org/node/8839947745) | Opera Narodowa | 1, Plac Teatralny, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-923, Polska | 52.243632, 21.010346 | coordinate-verified |
| warsaw | 無名塚 Grób Nieznanego Żołnierza | [way/72833763](https://www.openstreetmap.org/way/72833763) | Grób Nieznanego Żołnierza | Plac Piłsudskiego, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-073, Polska | 52.2409328, 21.0113096 | coordinate-verified |
| warsaw | Zachęta 國家美術館 | [way/28894938](https://www.openstreetmap.org/way/28894938) | Zachęta | 3, Plac Stanisława Małachowskiego, Centrum, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-063, Polska | 52.2392415, 21.0114907 | coordinate-verified |
| warsaw | 水上宮殿 Pałac na Wyspie | [way/1325609735](https://www.openstreetmap.org/way/1325609735) | Pałac na Wyspie | 1, Agrykola, Powiśle-Solec, Ujazdów, Śródmieście, Warszawa, województwo mazowieckie, 00-460, Polska | 52.215056, 21.0358058 | coordinate-verified |
| warsaw | 三十字廣場 Plac Trzech Krzyży | [way/442135655](https://www.openstreetmap.org/way/442135655) | Plac Trzech Krzyży | Krucza, Śródmieście Południowe, Śródmieście, Warszawa, województwo mazowieckie, Polska | 52.2286979, 21.0225486 | area-reference |
| warsaw | 戴高樂圓環棕櫚樹 Palma | [node/1795659661](https://www.openstreetmap.org/node/1795659661) | Palma | Rondo Generała Charles'a de Gaulle'a, Powiśle-Skarpa, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-373, Polska | 52.2318536, 21.0208595 | coordinate-verified |
| warsaw | 訪親會教堂 Kościół Wizytek | [way/320592658](https://www.openstreetmap.org/way/320592658) | Kościół Wizytek | 34, Krakowskie Przedmieście, Powiśle-Skarpa, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-325, Polska | 52.2411839, 21.017317 | coordinate-verified |
| warsaw | 普魯斯紀念碑 | [way/1449391820](https://www.openstreetmap.org/way/1449391820) | Bolesław Prus | Karowa, Powiśle-Skarpa, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-324, Polska | 52.2417276, 21.0163642 | coordinate-verified |
| warsaw | 總統府（外觀） | [way/855256739](https://www.openstreetmap.org/way/855256739) | Pałac Prezydencki | 46/48, Krakowskie Przedmieście, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-325, Polska | 52.2430186, 21.0151657 | coordinate-verified |
| warsaw | Złote Tarasy 購物中心 | [way/30611687](https://www.openstreetmap.org/way/30611687) | Złote Tarasy | 59, Złota, Żelazna Brama, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-120, Polska | 52.2300714, 21.0024449 | area-reference |
| warsaw | 猶太隔離區英雄紀念碑 | [way/231919035](https://www.openstreetmap.org/way/231919035) | Pomnik Bohaterów Getta | Ludwika Zamenhofa, Muranów, Śródmieście, Warszawa, województwo mazowieckie, 00-187, Polska | 52.2497446, 20.9942223 | coordinate-verified |
| warsaw | 聖卡齊米日教堂 | [way/250177780](https://www.openstreetmap.org/way/250177780) | Kościół pw. św. Kazimierza | 2, Rynek Nowego Miasta, Staromiejskie, Nowe Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-229, Polska | 52.2532073, 21.0088273 | coordinate-verified |
| warsaw | 聖雅各教堂 | [way/30064563](https://www.openstreetmap.org/way/30064563) | Kościół pw. Świętego Jacka | 10, Freta, Staromiejskie, Nowe Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-227, Polska | 52.2513951, 21.0094131 | coordinate-verified |
| warsaw | 聖靈教堂 | [way/135770017](https://www.openstreetmap.org/way/135770017) | Kościół pw. Świętego Ducha | 3, Długa, Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-263, Polska | 52.250522, 21.009046 | coordinate-verified |
| warsaw | Szeroki Dunaj | [way/1566768498](https://www.openstreetmap.org/way/1566768498) | Szeroki Dunaj | Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-255, Polska | 52.2496643, 21.0103927 | area-reference |
| warsaw | Wąski Dunaj | [way/25866261](https://www.openstreetmap.org/way/25866261) | Wąski Dunaj | Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-268, Polska | 52.2495233, 21.0106759 | area-reference |
| warsaw | 石階街 Kamienne Schodki | [way/26071459](https://www.openstreetmap.org/way/26071459) | Kamienne Schodki | Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-258, Polska | 52.2505329, 21.0122892 | area-reference |
| warsaw | Brzozowa 街 | [way/356466572](https://www.openstreetmap.org/way/356466572) | Brzozowa | Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-286, Polska | 52.2503461, 21.0130572 | area-reference |
| warsaw | Gnojna Góra 觀景點 | [node/4106662489](https://www.openstreetmap.org/node/4106662489) | Gnojna Góra | Dawna, Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-281, Polska | 52.2499763, 21.0141211 | coordinate-verified |
| warsaw | Kanonia 許願鐘 | [node/457281543](https://www.openstreetmap.org/node/457281543) | Dzwon na Kanonii | Kanonia, Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-281, Polska | 52.2492622, 21.0139661 | coordinate-verified |
| warsaw | 城堡廣場 Plac Zamkowy | [way/133637274](https://www.openstreetmap.org/way/133637274) | Plac Zamkowy | Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, Polska | 52.2478685, 21.0137433 | area-reference |
| warsaw | 薩克森花園 Ogród Saski | [way/4943389](https://www.openstreetmap.org/way/4943389) | Ogród Saski | Śródmieście, Warszawa, województwo mazowieckie, Polska | 52.2407099, 21.0085004 | area-reference |
| warsaw | Nike 紀念碑 | [way/1559054664](https://www.openstreetmap.org/way/1559054664) | Warszawska Nike | Nowy Przejazd, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-245, Polska | 52.2459104, 21.009202 | coordinate-verified |
| warsaw | Jabłonowski 宮（外觀） | [relation/6408563](https://www.openstreetmap.org/relation/6408563) | Pałac Jabłonowskich | 16, Senatorska, Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-082, Polska | 52.2447157, 21.0096033 | coordinate-verified |
| warsaw | Ostrogski 宮（外觀） | [way/188250947](https://www.openstreetmap.org/way/188250947) | Zamek Ostrogskich | 1, Okólnik, Powiśle-Skarpa, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-368, Polska | 52.23648, 21.0229695 | coordinate-verified |
| warsaw | 河岸美人魚像 Syrena | [way/432808623](https://www.openstreetmap.org/way/432808623) | Syrena | Tunel Wisłostrady, Powiśle-Skarpa, Powiśle, Śródmieście, Warszawa, województwo mazowieckie, 00-390, Polska | 52.2402594, 21.0320788 | coordinate-verified |
| warsaw | 哥白尼科學中心（遠觀） | [way/504034835](https://www.openstreetmap.org/way/504034835) | Centrum Nauki Kopernik | 20, Wybrzeże Kościuszkowskie, Powiśle-Skarpa, Powiśle, Śródmieście, Warszawa, województwo mazowieckie, 00-390, Polska | 52.241776, 21.0286002 | coordinate-verified |
| warsaw | Belweder（外觀） | [way/25748432](https://www.openstreetmap.org/way/25748432) | Belweder | 56, Belwederska, Powiśle-Solec, Ujazdów, Śródmieście, Warszawa, województwo mazowieckie, 00-594, Polska | 52.213131, 21.0276323 | coordinate-verified |
| warsaw | Ujazdowski 城堡（外觀） | [way/28363553](https://www.openstreetmap.org/way/28363553) | Zamek Ujazdowski | 2, Jazdów, Ujazdów, Śródmieście, Warszawa, województwo mazowieckie, 00-467, Polska | 52.219513, 21.0307682 | coordinate-verified |
| warsaw | 新世界街 Nowy Świat | [way/48279415](https://www.openstreetmap.org/way/48279415) | Nowy Świat | Centrum, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, 00-363, Polska | 52.2348301, 21.0186643 | area-reference |
| warsaw | 瓦津基公園 Łazienki Królewskie | [relation/19860651](https://www.openstreetmap.org/relation/19860651) | Łazienki Królewskie | Śródmieście, Warszawa, województwo mazowieckie, 00-460, Polska | 52.2126209, 21.0339496 | area-reference |
| warsaw | 劇院廣場 Plac Teatralny | [way/462597687](https://www.openstreetmap.org/way/462597687) | Plac Teatralny | Staromiejskie, Śródmieście Północne, Śródmieście, Warszawa, województwo mazowieckie, Polska | 52.244136, 21.0095735 | area-reference |
| krakow | 聖瑪利亞聖殿 | [way/26195267](https://www.openstreetmap.org/way/26195267) | Bazylika Wniebowzięcia Najświętszej Maryi Panny | 5, Plac Mariacki, Stare Miasto, Kraków, województwo małopolskie, 31-042, Polska | 50.0616547, 19.9394485 | coordinate-verified |
| krakow | 聖弗洛里安城門 Brama Floriańska | [way/39357538](https://www.openstreetmap.org/way/39357538) | Brama Floriańska | Floriańska, Stare Miasto, Kraków, województwo małopolskie, 31-019, Polska | 50.0648558, 19.9413527 | coordinate-verified |
| krakow | 甕城 Barbakan | [relation/13562708](https://www.openstreetmap.org/relation/13562708) | Barbakan | Basztowa, Stare Miasto, Kraków, województwo małopolskie, 31-157, Polska | 50.0654581, 19.941451 | coordinate-verified |
| krakow | Podgórze・猶太英雄廣場 | [relation/4097302](https://www.openstreetmap.org/relation/4097302) | Plac Bohaterów Getta | Stare Podgórze, Podgórze, Kraków, województwo małopolskie, 30-527, Polska | 50.0467762, 19.9544056 | area-reference |
| krakow | Bernatek 人行橋 | [way/242682567](https://www.openstreetmap.org/way/242682567) | Kładka Ojca Bernatka | Bulwar Podolski, Stare Podgórze, Podgórze, Kraków, województwo małopolskie, 30-500, Polska | 50.0465578, 19.947504 | area-reference |
| krakow | Stary Kleparz 市集 | [way/25070800](https://www.openstreetmap.org/way/25070800) | Stary Kleparz | 20, Rynek Kleparski, Kleparz, Stare Miasto, Kraków, województwo małopolskie, 31-150, Polska | 50.0673844, 19.9410863 | area-reference |
| krakow | Szeroka 街 | [way/232097169](https://www.openstreetmap.org/way/232097169) | Szeroka | Kazimierz, Stare Miasto, Kraków, województwo małopolskie, 31-053, Polska | 50.0522204, 19.9481526 | area-reference |
| wroclaw | Papa Krasnal 小矮人 | [node/309596819](https://www.openstreetmap.org/node/309596819) | Papa Krasnal | Kazimierza Wielkiego, Dzielnica Czterech Wyznań, Stare Miasto, Wrocław, województwo dolnośląskie, 50-067, Polska | 51.1075437, 17.0325128 | coordinate-verified |
| wroclaw | 鹽廣場 Plac Solny | [way/447669947](https://www.openstreetmap.org/way/447669947) | Plac Solny | Dzielnica Czterech Wyznań, Stare Miasto, Wrocław, województwo dolnośląskie, Polska | 51.1094086, 17.0294577 | area-reference |
| wroclaw | Neon Side Gallery | [node/4416661032](https://www.openstreetmap.org/node/4416661032) | Galeria Neonów | 46c, Ruska, Dzielnica Czterech Wyznań, Stare Miasto, Wrocław, województwo dolnośląskie, 50-079, Polska | 51.1099964, 17.0244398 | coordinate-verified |
| wroclaw | Hala Targowa 市場大廳 | [way/101200681](https://www.openstreetmap.org/way/101200681) | Hala Targowa | Księdza Wincentego Kraińskiego, Ostrów Tumski, Stare Miasto, Wrocław, województwo dolnośląskie, 50-158, Polska | 51.1124301, 17.0403366 | area-reference |
| wroclaw | 沙上聖母堂 | [way/101205863](https://www.openstreetmap.org/way/101205863) | Kościół Najświętszej Marii Panny na Piasku | 1, Świętej Jadwigi, Ostrów Tumski, Stare Miasto, Wrocław, województwo dolnośląskie, 50-266, Polska | 51.1146306, 17.0412122 | coordinate-verified |
| wroclaw | Słodowa 島 | [way/32343150](https://www.openstreetmap.org/way/32343150) | Wyspa Słodowa | Ostrów Tumski, Stare Miasto, Wrocław, województwo dolnośląskie, Polska | 51.1160692, 17.0373468 | area-reference |
| wroclaw | 座堂橋 Most Tumski | [way/388043341](https://www.openstreetmap.org/way/388043341) | Most Tumski | Najświętszej Marii Panny, Ostrów Tumski, Stare Miasto, Wrocław, województwo dolnośląskie, 50-266, Polska | 51.1147184, 17.0422654 | area-reference |
| wroclaw | 屠夫巷 Jatki | [way/22727451](https://www.openstreetmap.org/way/22727451) | Jatki | Dzielnica Czterech Wyznań, Stare Miasto, Wrocław, województwo dolnośląskie, 50-111, Polska | 51.1121441, 17.0306343 | area-reference |
| wroclaw | 國家博物館（外觀） | [relation/1442961](https://www.openstreetmap.org/relation/1442961) | Muzeum Narodowe | 5, Plac Powstańców Warszawy, Ostrów Tumski, Stare Miasto, Wrocław, województwo dolnośląskie, 50-153, Polska | 51.1108793, 17.0476455 | coordinate-verified |
| wroclaw | Grunwaldzki 橋 | [way/127897753](https://www.openstreetmap.org/way/127897753) | most Grunwaldzki | Trójkąt, Przedmieście Oławskie, Wrocław, województwo dolnośląskie, 50-406, Polska | 51.1094962, 17.0525464 | area-reference |
| wroclaw | Przejście 無名行人雕像 | [node/3176881040](https://www.openstreetmap.org/node/3176881040) | Pomnik Anonimowego Przechodnia | Marszałka Józefa Piłsudskiego, Przedmieście Świdnickie, Wrocław, województwo dolnośląskie, 50-030, Polska | 51.1014011, 17.0295374 | coordinate-verified |
| poznan | 波茲南市政廳・山羊鐘樓 | [way/30611684](https://www.openstreetmap.org/way/30611684) | Ratusz | 1, Stary Rynek, Garbary, Chwaliszewo, Stare Miasto, Poznań, województwo wielkopolskie, 61-772, Polska | 52.4085774, 16.9340166 | coordinate-verified |
| poznan | Stary Browar | [way/181129696](https://www.openstreetmap.org/way/181129696) | Stary Browar (Pasaż) | 42, Półwiejska, Piekary, Chwaliszewo, Stare Miasto, Poznań, województwo wielkopolskie, 61-888, Polska | 52.4024419, 16.9253067 | area-reference |
| poznan | 帝王城堡 Zamek Cesarski（外觀） | [relation/1483520](https://www.openstreetmap.org/relation/1483520) | Zamek Cesarski | 80/82, Święty Marcin, Stare Miasto, Poznań, województwo wielkopolskie, 61-809, Polska | 52.4080345, 16.918695 | area-reference |
| poznan | Cytadela「Nierozpoznani」 | [way/430843991](https://www.openstreetmap.org/way/430843991) | Nierozpoznani | Aleja Generała Stanisława Sosabowskiego, Stare Winogrady, Winogrady, Poznań, województwo wielkopolskie, 61-659, Polska | 52.4218633, 16.9356334 | area-reference |
| poznan | 皇家城堡山丘（Przemysł 王城） | [way/363747422](https://www.openstreetmap.org/way/363747422) | Zamek Królewski | Góra Przemysła, Piekary, Chwaliszewo, Stare Miasto, Poznań, województwo wielkopolskie, 61-768, Polska | 52.409156, 16.9310337 | area-reference |
| poznan | 自由廣場 Plac Wolności | [way/634296533](https://www.openstreetmap.org/way/634296533) | Plac Wolności | Święty Marcin, Stare Miasto, Poznań, województwo wielkopolskie, Polska | 52.4081225, 16.9277159 | area-reference |
| poznan | Okrąglak 圓形百貨 | [way/246117826](https://www.openstreetmap.org/way/246117826) | Okrąglak | 14, Seweryna Mielżyńskiego, Święty Marcin, Stare Miasto, Poznań, województwo wielkopolskie, 61-725, Polska | 52.4084134, 16.9222469 | coordinate-verified |
| poznan | Kaponiera「5 Figur」 | [node/9107873635](https://www.openstreetmap.org/node/9107873635) | 5 Figur | 22, Franklina Roosevelta, Jeżyce, Poznań, województwo wielkopolskie, 60-829, Polska | 52.4072699, 16.9119251 | coordinate-verified |
| poznan | Chwaliszewo 街 | [way/309450787](https://www.openstreetmap.org/way/309450787) | Chwaliszewo | Garbary, Chwaliszewo, Stare Miasto, Poznań, województwo wielkopolskie, 61-104, Polska | 52.4084822, 16.9412887 | area-reference |
| poznan | 聖馬丁街 Święty Marcin | [way/1107818044](https://www.openstreetmap.org/way/1107818044) | Święty Marcin | Stare Miasto, Poznań, województwo wielkopolskie, 61-703, Polska | 52.4069704, 16.9220327 | area-reference |
| warsaw | 華沙老城市場廣場 | [relation/6458642](https://www.openstreetmap.org/relation/6458642) | Rynek Starego Miasta | Staromiejskie, Stare Miasto, Śródmieście, Warszawa, województwo mazowieckie, 00-272, Polska | 52.2497952, 21.0117988 | area-reference |
| warsaw | 湖上圓形劇場 Teatr na Wyspie | [relation/1736885](https://www.openstreetmap.org/relation/1736885) | Teatr na Wyspie | Promenada Królewska, Powiśle-Solec, Ujazdów, Śródmieście, Warszawa, województwo mazowieckie, 00-460, Polska | 52.2137525, 21.0362185 | area-reference |
| krakow | Floriańska 街 | [way/3989492](https://www.openstreetmap.org/way/3989492) | Floriańska | Stare Miasto, Kraków, województwo małopolskie, 31-019, Polska | 50.063417, 19.9402664 | area-reference |
| krakow | Grodzka 街 | [way/244620139](https://www.openstreetmap.org/way/244620139) | Grodzka | Stare Miasto, Kraków, województwo małopolskie, 31-044, Polska | 50.05653, 19.9381822 | area-reference |
| krakow | Bulwar Czerwieński 河岸 | [way/247800795](https://www.openstreetmap.org/way/247800795) | Bulwar Czerwieński | Stradom, Stare Miasto, Kraków, województwo małopolskie, 31-069, Polska | 50.051074, 19.9342686 | area-reference |

## 未放圖釘：餐飲

以下為本次 scheduled 四城餐廳及 cafeGuide 中，仍無可用城市圖釘的完整名單。這些店保留城市頁「其他行程餐廳的導航連結」；沒有拿商場、門牌點或不同分店替代。

| 城市 | 名稱 / placeId | 原因及觀察到的 OSM 物件 |
| --- | --- | --- |
| warsaw | Green Nero Express PKP Centralny (`warsaw-green-caffe-nero-centralny`) | 以 Green Nero Express / Green Caffè Nero 與 Warszawa Centralna 搜尋無同名且 N20 門牌吻合的物件，不能用車站代表店家。 |
| krakow | Hankki (`krakow-hankki`) | node/12158301449 名稱 Hankki，但回傳 Przemysłowa、無 19A；與 Zabłocie 19A 不符。 |
| wroclaw | Central Cafe (`wroclaw-central-cafe`) | node/1200187952 是 Świętego Antoniego 10 地址點，沒有店名；node/2494650466 為 Central Café，同街但未列 10，不能把兩物件拼成已核實門市。 |
| wroclaw | MAX Premium Burgers Wroclavia (`wroclaw-max-wroclavia`) | way/1223269617 為 Max、Sucha 但缺門牌；way/526922862 為 Sucha 1 商場，不是 MAX 門市。 |
| poznan | Charlotte Krysiewicza (`poznan-charlotte-krysiewicza`) | node/13392485412 為 Charlotte，Bolesława Krysiewicza，未列 3a/27。 |
| poznan | Carla Trattoria Moderna (`poznan-carla-trattoria-moderna`) | 搜尋 Carla / Carla Trattoria Moderna 無同名門市；way/130279698 是 Święty Marcin 34 建物、無店名。 |
| warsaw | A. Blikle 1869 (`warsaw-a-blikle-1869`) | 搜尋 A. Blikle / Blikle Nowy Świat 33，僅查得 Górczewska、Plac Wilsona 2、Sarmacka 16 等分店，未查得 33 號門市。 |
| warsaw | Charlotte Bouillon Złota (`warsaw-charlotte-zlota`) | 搜尋 Charlotte 與 Złota 83，只查得 Plac Zbawiciela 4、Nowy Świat 6/12、Plac Inwalidów 10，分店不符。 |
| krakow | Karma Kawiarnia (`krakow-karma-coffee-roasters`) | node/1762294622 為 Karma、Krupnicza 10；主檔為 Krupnicza 12/3，門牌不符。 |
| krakow | Cukiernia Michałek (`krakow-cukiernia-michalek`) | node/4958281908 為 Michałek、Krupnicza，但未列 6 號，精確地址搜尋也未命中。 |
| wroclaw | El Gato Specialty Coffee (`wroclaw-el-gato-specialty-coffee`) | node/7581177856 為 El Gato、Odrzańska，未列 8 號。 |
| poznan | LAGACCA Cafe by Brisman (`poznan-lagacca-cafe-by-brisman`) | 以 LAGACCA Cafe by Brisman / Lagacca 搜尋未查得可核對 Woźna 21 的物件。 |
| poznan | ROGAL Świętomarciński (`poznan-rogal`) | ROGAL / Rogal Stary Rynek 搜尋未命中；node/7102833673 僅是 Stary Rynek 11 地址點、無店名，不能視為 11/17 的門市。 |
| poznan | Cukiernia Kandulski (`poznan-cukiernia-kandulski`) | 搜尋只查得 Sarmacka 的 node/2401569430 與 Kotowo 的 way/446179615，沒有 Plac Cyryla Ratajskiego 1 分店。 |
| poznan | Stragan Kawiarnia (`poznan-stragan-kawiarnia`) | node/4879037021 為 Café Stragan、Franciszka Ratajczaka，缺 31 號。 |

## 未放圖釘：景點

| 城市 | 名稱 | 原因 |
| --- | --- | --- |
| warsaw | 華沙大學正門 | Brama Główna Uniwersytetu Warszawskiego / Brama Uniwersytetu 搜尋未命中可核對物件。 |
| warsaw | Hotel Bristol 外觀 | 本次沒有取得可同時核對名稱與門牌的 OSM 物件，不以鄰近 Café Bristol 的點代替飯店。 |
| warsaw | Staszic 宮 | relation/11634086 名稱吻合但回傳 Mikołaja Kopernika、無門牌，未確認 Nowy Świat 72。哥白尼紀念碑另有圖釘。 |
| warsaw | 居禮夫人雕像（Przyrynek） | Maria Skłodowska-Curie / Pomnik Marii Skłodowskiej-Curie 搜尋未命中此雕像；Freta 16 的 node/5171659521 是出生地紀念牌，並非這尊雕像。 |
| warsaw | 聖馬丁教堂 | 正確教堂為 way/128808348，Piwna、未列門牌。每日資料 way/128808346 實際是修院 Dom Zakonny Sióstr Franciszkanek Służebnic Krzyża、Piwna 9/11；不能沿用為教堂圖釘。本次不改每日地圖。 |
| warsaw | 舊橘園 | way/25748410 名稱 Stara Oranżeria、無門牌，未能核對場館門牌；瓦津基公園保留範圍點。 |
| warsaw | Myślewicki 宮 | way/25748436 名稱吻合、無門牌，未確認場館地址。 |
| warsaw | 聖亞歷山大教堂 | way/238713516 名稱吻合，但無街道與門牌，未確認地址。三十字廣場另有範圍點。 |
| warsaw | 波蘭國家博物館外觀 | node/9984134345 名稱吻合、Aleje Jerozolimskie，缺 3 號；不當成門牌級驗證。 |
| warsaw | Siatkarka 霓虹招牌、河岸步道、Aleje Ujazdowskie | 未取得逐點查證物件，不以附近地標座標推估。 |
| krakow | 瓦維爾大教堂 | way/85151350 回傳 Zamek Wawel 1，與 venues.js 的 Wawel 3 不同，不標為 coordinate-verified。既有 Wawel 城堡點保留。 |
| wroclaw | 糖果屋雙屋 Jaś i Małgosia | Jaś 搜尋回傳 way/101206992 的 OSM 名稱是 Domek Miedziorytnika、Świętego Mikołaja 1；Małgosia way/101189953 是 Odrzańska 39-40，不能將雙屋門牌合併推定。 |
| wroclaw | 聖伊莉莎白教堂 | way/368635824 名稱與街道吻合，但未列 Świętej Elżbiety 1/2。 |
| wroclaw | 白鸛猶太會堂 | way/101136228 名稱吻合，回傳 Pasaż Pokoyhof、無 7 號，未能核對 Włodkowica 7。 |
| wroclaw | 大學主樓 | way/101205499 是 Plac Uniwersytecki 1 建物，但 OSM 名稱空白，不把地址建物當具名場館。 |
| wroclaw | 拉茨瓦維採全景畫外觀 | way/1072344584 名稱吻合、Purkyniego，缺 11 號。 |
| wroclaw | 主教座堂 | node/9127158745 是 information 類地標，無 plac Katedralny 18；不拿導覽資訊點當正門。既有島區範圍點保留。 |
| poznan | 波茲南主教座堂 | way/279545051 回傳 Ostrów Tumski 19，與 venues.js 的 17 號不符，既有島區點不改。 |
| poznan | Śródka 壁畫 | node/9083719475 名稱吻合，但回傳 Filipińska、無 Śródka 3，未完成門牌比對。 |

## Massolit 官方查證

- 官方來源：[Massolit 咖啡館頁](https://massolit.pl/cafe)、[官方首頁](https://massolit.pl/)。頁尾列 Massolit Books & Café、Felicjanek 4, 31-104 Kraków，以及 massolit.com 的品牌電子郵件網域；舊 massolit.com 本次 TLS 連線失敗，改讀現行官方站。
- 2026-10-22 以 curl 取得官方頁及它載入的 `/assets/index-DjI11GWI.js`。英文翻譯鍵 `footer.address` / `directions.addressValue` 均列 Felicjanek 4；`cafePage.hoursValue` 明列每日 10:00–20:00。地址與營業時間為官方已核實，verificationStatus = verified；沒有採用目錄仍列週五、六 21:00 的舊時間。
- 官方咖啡館介紹列自製美式糕點、胡蘿蔔蛋糕、紐約起司蛋糕；主檔只列咖啡與這兩項蛋糕，不保存電話。
- Nominatim lookup node/3519353826：Massolit、Felicjanek 4，50.0584495, 19.9296035，與官方門牌吻合。
- when 採「Day 2 · Wawel 前後，或 Day 4 回城後有餘裕才順繞」：main Day 2 有 Wawel；Day 4 13:15 目標回城、Kazimierz 只是有餘裕才去，15:00 前結束並取行李，因此不暗示老城已有固定咖啡時段。

## 驗收與大小

`./verify.sh`：451 個測試全數通過（其中本次新增 8 個）；`npm run audit:schedule` 通過；`npm run audit:map-pins`：144 點、106 coordinate-verified、38 area-reference、未驗證 0、無效紀錄 0。

城市頁成品：warsaw 117,407 bytes、krakow 89,463 bytes、wroclaw 80,019 bytes、poznan 77,767 bytes。既有 100 KiB（102,400 bytes）城市頁預算測試針對 city-krakow.html，維持原值並通過；華沙原版模板與原圖釘資料為 110,837 bytes，本來已超過此值，本次未放寬任何預算。只在城市頁的內嵌地圖資料省略 runtime 不需要的 ID 與完整查證 metadata；完整查證仍保存在資料模組與本文件。

Chrome 以本地檔案、阻擋 DNS（不載入圖磚）測試四城 × 360/390px：8 組皆無水平溢出、所有分類按鈕至少 44px、反覆切換正常。另以 VM 執行真實內嵌腳本驗證缺少 Leaflet 的情況；無 localhost 測試失敗。

既有測試調整：更新圖釘／餐飲分類／小吃筆數；精確範圍點名單增加本次 35 個範圍點，保留原有完全相等比對。Wedel 分店測試原先硬寫 KP 45 沒有圖釘，與本次已核實補點衝突，改成兩分店皆各有獨立圖釘、各自對應導航 URL，並保留不同 placeId 不得互算的檢查；未放寬安全性檢查。這兩個固定資料前提不能只改數字便符合新資料，因此一併更新明確名單／覆蓋預期。

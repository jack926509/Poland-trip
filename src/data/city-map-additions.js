// 2026-10-22 城市地圖補點。逐點證據與未放圖釘原因：
// docs/research/2026-10-22-city-map-additions.md。
// 每列：名稱、OSM 類型/ID、緯度、經度、說明、分類、placeId、是否範圍點。
import { diningPlaces } from './dining-places.js';

const additions = {
  warsaw: [
    ["Specjały Regionalne","node/4408894491",52.2345825,21.0189984,"Nowy Świat 44","food","warsaw-specjaly-regionalne",false],
    ["Arirang Restaurant","node/4878937179",52.228577,21.0108084,"Nowogrodzka 38","food","warsaw-arirang-restaurant",false],
    ["Bułkę przez Bibułkę | Zgoda","node/316892293",52.2325833,21.0140889,"Zgoda 3","cafe","warsaw-bulke-przez-bibulke-zgoda",false],
    ["Polka","node/416560107",52.2482476,21.013769,"Świętojańska 2","food","warsaw-polka",false],
    ["Soul Kitchen","node/4373643390",52.2294483,21.0148815,"Nowogrodzka 18A","food","warsaw-soul-kitchen",false],
    ["E.Wedel Pijalnia · Krakowskie Przedmieście 45","node/5194716723",52.2446285,21.0137953,"Krakowskie Przedmieście 45","cafe","warsaw-wedel-krakowskie-45",false],
    ["Café Bristol","node/4551462797",52.2421169,21.015898,"Krakowskie Przedmieście 42/44","cafe","warsaw-cafe-bristol",false],
    ["QQ Warsaw | Matcha & Korean Toasts","node/3429255098",52.2282747,21.0138294,"Żurawia 32/34","cafe","warsaw-qq-warsaw-matcha-korean-toasts",false],
    ["哥白尼紀念碑 Pomnik Kopernika","node/282661680",52.2381578,21.0179739,"Mikołaja Kopernika","sight",null,false],
    ["聖十字教堂 Kościół św. Krzyża","way/28092628",52.2387357,21.0167603,"Krakowskie Przedmieście 3","sight",null,false],
    ["波蘭猶太人歷史博物館（外觀）","way/186141946",52.2493716,20.9931609,"Mordechaja Anielewicza 6","sight",null,false],
    ["BUW 華沙大學圖書館屋頂花園","relation/6414970",52.2426428,21.0250683,"範圍代表點；非單一入口","sight",null,true],
    ["瓦津基公園 · 蕭邦紀念碑","way/1448330230",52.2147016,21.0280881,"Droga Belwederska","sight",null,false],
    ["MSN 現代美術館","way/944207076",52.2331288,21.0089838,"Marszałkowska 103","sight",null,false],
    ["克拉辛斯基廣場・起義紀念碑","way/1327606552",52.2493699,21.0058184,"Plac Krasińskich","sight",null,false],
    ["新城廣場 Rynek Nowego Miasta","way/320220423",52.2529105,21.0083736,"範圍代表點；非單一入口","sight",null,true],
    ["聖母訪親教堂","way/136396035",52.2543057,21.0090175,"Przyrynek 2","sight",null,false],
    ["Freta 16 居禮夫人出生地紀念牌","node/5171659521",52.2514555,21.0085289,"Freta 16","sight",null,false],
    ["甕城 Barbakan","way/249395313",52.2505875,21.010017,"Nowomiejska","sight",null,false],
    ["聖若望大教堂","way/404052334",52.2488818,21.0136708,"Świętojańska 8","sight",null,false],
    ["聖安妮教堂（外觀）","way/25865144",52.2462123,21.0143595,"Krakowskie Przedmieście 68","sight",null,false],
    ["大劇院・國家歌劇院（外觀）","node/8839947745",52.243632,21.010346,"Plac Teatralny 1","sight",null,false],
    ["無名塚 Grób Nieznanego Żołnierza","way/72833763",52.2409328,21.0113096,"Plac Piłsudskiego","sight",null,false],
    ["Zachęta 國家美術館","way/28894938",52.2392415,21.0114907,"Plac Stanisława Małachowskiego 3","sight",null,false],
    ["水上宮殿 Pałac na Wyspie","way/1325609735",52.215056,21.0358058,"Agrykola 1","sight",null,false],
    ["三十字廣場 Plac Trzech Krzyży","way/442135655",52.2286979,21.0225486,"範圍代表點；非單一入口","sight",null,true],
    ["戴高樂圓環棕櫚樹 Palma","node/1795659661",52.2318536,21.0208595,"Rondo Generała Charles'a de Gaulle'a","sight",null,false],
    ["訪親會教堂 Kościół Wizytek","way/320592658",52.2411839,21.017317,"Krakowskie Przedmieście 34","sight",null,false],
    ["普魯斯紀念碑","way/1449391820",52.2417276,21.0163642,"Karowa","sight",null,false],
    ["總統府（外觀）","way/855256739",52.2430186,21.0151657,"Krakowskie Przedmieście 46/48","sight",null,false],
    ["Złote Tarasy 購物中心","way/30611687",52.2300714,21.0024449,"範圍代表點；非單一入口","sight",null,true],
    ["猶太隔離區英雄紀念碑","way/231919035",52.2497446,20.9942223,"Ludwika Zamenhofa","sight",null,false],
    ["聖卡齊米日教堂","way/250177780",52.2532073,21.0088273,"Rynek Nowego Miasta 2","sight",null,false],
    ["聖雅各教堂 Kościół św. Jacka","way/30064563",52.2513951,21.0094131,"Freta 10","sight",null,false],
    ["聖靈教堂","way/135770017",52.250522,21.009046,"Długa 3","sight",null,false],
    ["Szeroki Dunaj","way/1566768498",52.2496643,21.0103927,"範圍代表點；非單一入口","sight",null,true],
    ["Wąski Dunaj","way/25866261",52.2495233,21.0106759,"範圍代表點；非單一入口","sight",null,true],
    ["石階街 Kamienne Schodki","way/26071459",52.2505329,21.0122892,"範圍代表點；非單一入口","sight",null,true],
    ["Brzozowa 街","way/356466572",52.2503461,21.0130572,"範圍代表點；非單一入口","sight",null,true],
    ["Gnojna Góra 觀景點","node/4106662489",52.2499763,21.0141211,"Dawna","sight",null,false],
    ["Kanonia 許願鐘","node/457281543",52.2492622,21.0139661,"Kanonia","sight",null,false],
    ["城堡廣場 Plac Zamkowy","way/133637274",52.2478685,21.0137433,"範圍代表點；非單一入口","sight",null,true],
    ["薩克森花園 Ogród Saski","way/4943389",52.2407099,21.0085004,"範圍代表點；非單一入口","sight",null,true],
    ["Nike 紀念碑","way/1559054664",52.2459104,21.009202,"Nowy Przejazd","sight",null,false],
    ["Jabłonowski 宮（外觀）","relation/6408563",52.2447157,21.0096033,"Senatorska 16","sight",null,false],
    ["Ostrogski 宮（外觀）","way/188250947",52.23648,21.0229695,"Okólnik 1","sight",null,false],
    ["河岸美人魚像 Syrena","way/432808623",52.2402594,21.0320788,"Tunel Wisłostrady","sight",null,false],
    ["哥白尼科學中心（遠觀）","way/504034835",52.241776,21.0286002,"Wybrzeże Kościuszkowskie 20","sight",null,false],
    ["Belweder（外觀）","way/25748432",52.213131,21.0276323,"Belwederska 56","sight",null,false],
    ["Ujazdowski 城堡（外觀）","way/28363553",52.219513,21.0307682,"Jazdów 2","sight",null,false],
    ["新世界街 Nowy Świat","way/48279415",52.2348301,21.0186643,"範圍代表點；非單一入口","sight",null,true],
    ["瓦津基公園 Łazienki Królewskie","relation/19860651",52.2126209,21.0339496,"範圍代表點；非單一入口","sight",null,true],
    ["劇院廣場 Plac Teatralny","way/462597687",52.244136,21.0095735,"範圍代表點；非單一入口","sight",null,true],
    ["華沙老城市場廣場","relation/6458642",52.2497952,21.0117988,"範圍代表點；非單一入口","sight",null,true],
    ["湖上圓形劇場 Teatr na Wyspie","relation/1736885",52.2137525,21.0362185,"範圍代表點；非單一入口","sight",null,true],
  ],
  krakow: [
    ["Lajkonik Basztowa","node/2389248574",50.0663241,19.9403304,"Basztowa 15","food","krakow-lajkonik-basztowa",false],
    ["Pimiento Shop and Bistro","node/2628685548",50.0677985,19.9421352,"Świętego Filipa 21","food","krakow-pimiento-shop-bistro",false],
    ["Mr. Jerry","node/475387245",50.0628558,19.93522,"Jagiellońska 5","food","krakow-mr-jerry",false],
    ["Café Camelot","node/10951576960",50.0629974,19.9391046,"Świętego Tomasza 17","cafe","krakow-cafe-camelot",false],
    ["Massolit Books & Café","node/3519353826",50.0584495,19.9296035,"Felicjanek 4","cafe","krakow-massolit-books-cafe",false],
    ["聖瑪利亞聖殿","way/26195267",50.0616547,19.9394485,"Plac Mariacki 5","sight",null,false],
    ["聖弗洛里安城門 Brama Floriańska","way/39357538",50.0648558,19.9413527,"Floriańska","sight",null,false],
    ["甕城 Barbakan","relation/13562708",50.0654581,19.941451,"Basztowa","sight",null,false],
    ["Podgórze・猶太英雄廣場","relation/4097302",50.0467762,19.9544056,"範圍代表點；非單一入口","sight",null,true],
    ["Bernatek 人行橋","way/242682567",50.0465578,19.947504,"範圍代表點；非單一入口","sight",null,true],
    ["Stary Kleparz 市集","way/25070800",50.0673844,19.9410863,"範圍代表點；非單一入口","sight",null,true],
    ["Szeroka 街","way/232097169",50.0522204,19.9481526,"範圍代表點；非單一入口","sight",null,true],
    ["Floriańska 街","way/3989492",50.063417,19.9402664,"範圍代表點；非單一入口","sight",null,true],
    ["Grodzka 街","way/244620139",50.05653,19.9381822,"範圍代表點；非單一入口","sight",null,true],
    ["Bulwar Czerwieński 河岸","way/247800795",50.051074,19.9342686,"範圍代表點；非單一入口","sight",null,true],
  ],
  wroclaw: [
    ["Samarqand","node/7077819111",51.1000212,17.0336442,"Stawowa 23","food","wroclaw-samarqand",false],
    ["Charlotte Pasaż Pokoyhof","node/4372103191",51.1084796,17.0260038,"Świętego Antoniego 2-4","cafe","wroclaw-charlotte-pokoyhof",false],
    ["Paloma Coffee","node/5317362791",51.109519,17.0286819,"Plac Solny 8-9","cafe","wroclaw-paloma-coffee",false],
    ["Słodki Chłopak w Muzeum Narodowym","node/1452237509",51.1107113,17.0475408,"Plac Powstańców Warszawy 5","cafe","wroclaw-slodki-chlopak-muzeum-narodowe",false],
    ["Dessert Boutique","node/5275535787",51.1113645,17.0235207,"Świętego Mikołaja 43","cafe","wroclaw-dessert-boutique",false],
    ["Papa Krasnal 小矮人","node/309596819",51.1075437,17.0325128,"Kazimierza Wielkiego","sight",null,false],
    ["鹽廣場 Plac Solny","way/447669947",51.1094086,17.0294577,"範圍代表點；非單一入口","sight",null,true],
    ["Neon Side Gallery","node/4416661032",51.1099964,17.0244398,"Ruska 46c","sight",null,false],
    ["Hala Targowa 市場大廳","way/101200681",51.1124301,17.0403366,"範圍代表點；非單一入口","sight",null,true],
    ["沙上聖母堂","way/101205863",51.1146306,17.0412122,"Świętej Jadwigi 1","sight",null,false],
    ["Słodowa 島","way/32343150",51.1160692,17.0373468,"範圍代表點；非單一入口","sight",null,true],
    ["座堂橋 Most Tumski","way/388043341",51.1147184,17.0422654,"範圍代表點；非單一入口","sight",null,true],
    ["屠夫巷 Jatki","way/22727451",51.1121441,17.0306343,"範圍代表點；非單一入口","sight",null,true],
    ["國家博物館（外觀）","relation/1442961",51.1108793,17.0476455,"Plac Powstańców Warszawy 5","sight",null,false],
    ["Grunwaldzki 橋","way/127897753",51.1094962,17.0525464,"範圍代表點；非單一入口","sight",null,true],
    ["Przejście 無名行人雕像","node/3176881040",51.1014011,17.0295374,"Marszałka Józefa Piłsudskiego","sight",null,false],
  ],
  poznan: [
    ["Weranda Caffe","node/430266133",52.4069438,16.9341176,"Świętosławska 10","cafe","poznan-weranda-caffe",false],
    ["波茲南市政廳・山羊鐘樓","way/30611684",52.4085774,16.9340166,"Stary Rynek 1","sight",null,false],
    ["Stary Browar","way/181129696",52.4024419,16.9253067,"範圍代表點；非單一入口","sight",null,true],
    ["帝王城堡 Zamek Cesarski（外觀）","relation/1483520",52.4080345,16.918695,"範圍代表點；非單一入口","sight",null,true],
    ["皇家城堡山丘（Przemysł 王城）","way/363747422",52.409156,16.9310337,"範圍代表點；非單一入口","sight",null,true],
    ["自由廣場 Plac Wolności","way/634296533",52.4081225,16.9277159,"範圍代表點；非單一入口","sight",null,true],
    ["Okrąglak 圓形百貨","way/246117826",52.4084134,16.9222469,"Seweryna Mielżyńskiego 14","sight",null,false],
    ["Kaponiera「5 Figur」","node/9107873635",52.4072699,16.9119251,"Franklina Roosevelta 22","sight",null,false],
    ["Chwaliszewo 街","way/309450787",52.4084822,16.9412887,"範圍代表點；非單一入口","sight",null,true],
    ["聖馬丁街 Święty Marcin","way/1107818044",52.4069704,16.9220327,"範圍代表點；非單一入口","sight",null,true],
  ],
};

export function addCityMapPins(pins, checks) {
  for (const [city, rows] of Object.entries(additions)) {
    for (const [name, osm, lat, lon, description, category, placeId, area] of rows) {
      const map = placeId ? diningPlaces[placeId].map : `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
      pins[city].points.push([lat, lon, name, description, map, category, null, placeId]);
      const check = {status: area ? 'area-reference' : 'coordinate-verified', checkedAt: '2026-10-22', coordinateSource: `Nominatim / OpenStreetMap（${osm}）`};
      if (area) check.note = '範圍代表點，非單一入口或門牌；請依實際目的地導航。';
      // 0 = 與 Nominatim 回傳的 OSM 來源座標相同，非現場量測誤差。
      else check.distanceMeters = 0;
      checks[city][name] = check;
    }
  }
  for (const [placeId, lat, lon] of [['wieliczka-sztolnia', 49.9831039, 20.0599403], ['krakow-obwarzanek-tunel', 50.0646599, 19.944894]]) {
    const place = diningPlaces[placeId];
    pins.krakow.points.push([lat, lon, place.name, place.address, place.map, 'food', null, placeId]);
    checks.krakow[place.name] = {status: 'coordinate-verified', checkedAt: '2026-10-23', coordinateSource: place.map, distanceMeters: 0};
  }
}

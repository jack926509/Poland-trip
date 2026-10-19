import { venuePin } from '../lib/venues.mjs';
import { diningPlaces } from './dining-places.js';

// 每日地圖只以「白天實際遊覽城市」為主。晚間火車抵達城市不納入當日視野，
// 避免 fitBounds 把兩座城市同時縮到無法辨識；車站與住宿僅在同一主城市且有操作價值時保留。
export const dayMapPlans = {
  1: { focus: '華沙 Warszawa', center: [52.236, 21.014], zoom: 14, selections: { warsaw: ['Hotel Metropol'] } },
  2: { focus: '克拉科夫 Kraków', center: [50.057, 19.944], zoom: 14, selections: { krakow: ['Wawel 皇家城堡', '中央市集廣場', 'Kazimierz 猶太區', '辛德勒工廠博物館', 'Okrąglak（Plac Nowy zapiekanka）', 'ibis budget Krakow Stare Miasto'] } },
  3: { focus: '奧斯威辛 Oświęcim／Brzezinka', center: [50.033, 19.192], zoom: 13, selections: {} },
  4: { focus: '克拉科夫 Kraków＋Wieliczka', center: [50.040, 19.995], zoom: 12, selections: { krakow: ['Kazimierz 猶太區', 'Sukiennice 布廊（伴手禮攤位）', 'ibis budget Krakow Stare Miasto'] } },
  5: { focus: '樂斯拉夫 Wrocław', center: [51.110, 17.049], zoom: 13, selections: { wroclaw: ['中央市集廣場', '大教堂島 Ostrów Tumski', '百年廳 Hala Stulecia', 'Restauracja Wrocławska', 'Piast'] } },
  6: { focus: '波茲南 Poznań', center: [52.407, 16.930], zoom: 14, selections: { poznan: ['舊市集廣場 Stary Rynek', '大教堂島 Ostrów Tumski', 'Poznan Apartments Towarowa'] } },
  7: { focus: '華沙 Warszawa', center: [52.236, 21.010], zoom: 13, selections: { warsaw: ['皇家城堡', 'Hotel Metropol', '科學文化宮觀景台', 'Pijalnia Czekolady E.Wedel（巧克力）'] } },
  8: { focus: '華沙 Warszawa＋蕭邦機場', center: [52.202, 20.991], zoom: 12, selections: { warsaw: ['Hotel Metropol'] } },
};

// 精煉切片 4b：有對到 src/data/venues.js 的補充圖釘改用 venuePin() 取座標與
// 導航連結（單一來源，不再跟 venues.js 各存一份同樣的座標——見 data-audit.md
// §2-E）；label／category／座標查證來源仍是當天的敘述，不是地點本身的固定
// 事實，繼續留在呼叫端。純粹只在地圖上當路標、travel-database.js 與
// venues.js 都沒有這個地點的（Podgórze 猶太英雄廣場、Papa Krasnal 小矮人等），
// 保持原本的字面陣列，不勉強湊一個 venue。
// 2026-10-15 補的 Day 1（Specjały、E.Wedel KP 45）與 Day 7（POLIN、BUW、
// 瓦津基蕭邦紀念碑、Soul Kitchen）圖釘：座標取自 OpenStreetMap 物件，經
// Nominatim 查詢確認門牌或名稱與行程地址一致，第 7 欄記 OSM 物件連結。
export const daySupplementaryPins = {
  1: [
    // 2026-10-19 座標改為聖十字教堂（Krakowskie Przedmieście 3，OSM way 28092628，Nominatim 2026-10-19 查得）；
    // 原本沿用 venues.js 皇家大道街道點，落在總統府附近，與說明差約 390 m；改名後序號對到「★ 聖十字教堂」那一列。
    // 哥白尼紀念碑另立一顆（OSM node 282661680，Nominatim 2026-10-19 查得），讓「哥白尼紀念碑＋Staszic 宮」那列保有序號。
    [52.2381578, 21.0179739, '哥白尼紀念碑 Pomnik Kopernika', 'Krakowskie Przedmieście 南端 · Staszic 宮前', 'https://www.google.com/maps/search/?api=1&query=Pomnik%20Miko%C5%82aja%20Kopernika%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/node/282661680'],
    [52.2387357, 21.0167603, '聖十字教堂 Kościół św. Krzyża', 'Krakowskie Przedmieście 3 · 皇家大道傍晚散步北行的中段', 'https://www.google.com/maps/search/?api=1&query=Ko%C5%9Bci%C3%B3%C5%82%20%C5%9Awi%C4%99tego%20Krzy%C5%BCa%2C%20Krakowskie%20Przedmie%C5%9Bcie%203%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/28092628'],
    venuePin('warsaw-centralna-station', { label: 'Złote Tarasy 就在車站旁：晚餐後逛街採買', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.228917&mlon=21.003315' }),
    [52.2446285, 21.0137953, 'E.Wedel Pijalnia · Krakowskie Przedmieście 45', '17:35 熱巧克力：今天往北的折返點', diningPlaces['warsaw-wedel-krakowskie-45'].map, 'food', 'https://www.openstreetmap.org/node/5194716723'],
    [52.2345825, 21.0189984, 'Specjały Regionalne', 'Nowy Świat 44 · 18:30 晚餐', diningPlaces['warsaw-specjaly-regionalne'].map, 'food', 'https://www.openstreetmap.org/node/4408894491'],
  ],
  2: [
    venuePin('krakow-wawel-cathedral', { label: 'Wawel 3 · 主入口區', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=50.054727&mlon=19.935226' }),
    venuePin('krakow-st-mary-basilica', { label: 'plac Mariacki 5', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=50.061692&mlon=19.939409' }),
    venuePin('krakow-sukiennice', { label: 'Rynek Główny 3', category: 'shop', coordinateSource: 'https://www.openstreetmap.org/?mlat=50.061713&mlon=19.937349' }),
    [50.046828, 19.954386, 'Podgórze・猶太英雄廣場', '步行往辛德勒工廠的明確中途錨點', 'https://www.google.com/maps/search/?api=1&query=Ghetto%20Heroes%20Square%2C%20Krak%C3%B3w', 'sight', 'https://www.openstreetmap.org/?mlat=50.046828&mlon=19.954386'],
  ],
  3: [
    venuePin('krakow-auschwitz-i-entrance', { label: '官方確認入口 · Więźniów Oświęcimia 55', category: 'sight', coordinateSource: 'https://www.auschwitz.org/en/museum/news/new-visitor-services-center-at-the-auschwitz-memorial-change-of-the-place-of-arrival-and-entrance-from-15-june%2C1614.html' }),
    venuePin('krakow-auschwitz-ii-birkenau', { displayName: 'Auschwitz II–Birkenau 主入口', label: 'Ofiar Faszyzmu 12 · 導覽接駁下車後依現場指示集合', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=50.035948&mlon=19.178314' }),
  ],
  4: [
    venuePin('krakow-wieliczka', { displayName: '維利奇卡鹽礦 Daniłowicz Shaft', label: '官方確認 Tourist Route 集合入口', category: 'sight', coordinateSource: 'https://www.wieliczka-saltmine.com/events/important-information/map-and-access', mapUrl: 'https://www.google.com/maps/search/?api=1&query=Wieliczka%20Salt%20Mine%2C%20Dani%C5%82owicza%2010%2C%20Wieliczka' }),
    [49.982938, 20.054328, 'Wieliczka Rynek-Kopalnia 車站', 'KMŁ 下車站；步行前往 Daniłowicz Shaft', 'https://www.google.com/maps/search/?api=1&query=Wieliczka%20Rynek-Kopalnia%20railway%20station', 'transport', 'https://www.openstreetmap.org/?mlat=49.982938&mlon=20.054328'],
    venuePin('krakow-glowny-station', { label: '取行李後的城際火車出發站', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=50.069918&mlon=19.947160' }),
  ],
  5: [
    [51.108896, 17.026714, 'Papa Krasnal 小矮人', 'Świdnicka 地下道旁；小矮人尋寶的具體起點', 'https://www.google.com/maps/search/?api=1&query=Papa%20Krasnal%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.108896&mlon=17.026714'],
    [51.111690, 17.029114, '糖果屋雙屋 Jaś i Małgosia', 'Świętego Mikołaja 1', 'https://www.google.com/maps/search/?api=1&query=Hansel%20and%20Gretel%20Houses%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.111690&mlon=17.029114'],
    [51.111492, 17.029774, '聖伊莉莎白教堂', 'Świętej Elżbiety 1/2 · 只拍高塔外觀，不上塔', 'https://www.google.com/maps/search/?api=1&query=St.%20Elizabeth%20Church%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.111492&mlon=17.029774'],
    venuePin('wroclaw-panorama', { displayName: '拉茨瓦維採全景畫（外觀）', label: 'Jana Ewangelisty Purkyniego 11 · 13:10 只看圓形館外觀', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=51.110187&mlon=17.044488' }),
    venuePin('wroclaw-cathedral', { label: 'plac Katedralny 18 · 座堂島散步終點', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=51.114616&mlon=17.046989' }),
    venuePin('wroclaw-glowny-station', { label: '18:35 前抵達的晚間轉場車站', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=51.098928&mlon=17.036255' }),
    [51.1089276, 17.0260020, 'Central Cafe', 'Świętego Antoniego 10 · 07:30 早餐', diningPlaces['wroclaw-central-cafe'].map, 'food', 'https://www.openstreetmap.org/node/1200187952'],
    [51.1094086, 17.0294577, '鹽廣場 Plac Solny', '廣場範圍中心 · 花市所在', 'https://www.google.com/maps/search/?api=1&query=Plac%20Solny%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/447669947'],
    [51.1084698, 17.0254208, '白鸛猶太會堂', '四教派街區代表點 · Włodkowica 7 庭院在其南側', 'https://www.google.com/maps/search/?api=1&query=Synagoga%20Pod%20Bia%C5%82ym%20Bocianem%2C%20W%C5%82odkowica%207%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/101136228'],
    [51.1099964, 17.0244398, 'Neon Side Gallery', 'Ruska 46c · 霓虹燈招牌庭院', 'https://www.google.com/maps/search/?api=1&query=Galeria%20Neon%C3%B3w%2C%20Ruska%2046c%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/node/4416661032'],
    [51.1139333, 17.0338340, '大學主樓 Uniwersytet Wrocławski', 'Plac Uniwersytecki 1 · 大學區核心建物', 'https://www.google.com/maps/search/?api=1&query=University%20of%20Wroc%C5%82aw%20Main%20Building%2C%20Plac%20Uniwersytecki%201%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/101205499'],
    [51.1122350, 17.0314430, 'El Gato Specialty Coffee', 'Odrzańska 8 · 咖啡', diningPlaces['wroclaw-el-gato-specialty-coffee'].map, 'food', 'https://www.openstreetmap.org/node/7581177856'],
    [51.1124376, 17.0403126, 'Hala Targowa 市場大廳', 'Piaskowa 17 附近 · 市場大廳建物', 'https://www.google.com/maps/search/?api=1&query=Hala%20Targowa%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/101200681'],
    [51.1146306, 17.0412122, '沙上聖母堂', 'Świętej Jadwigi 1 · 沙島到座堂橋途中', 'https://www.google.com/maps/search/?api=1&query=Ko%C5%9Bci%C3%B3%C5%82%20Naj%C5%9Bwi%C4%99tszej%20Marii%20Panny%20na%20Piasku%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/101205863'],
    [51.1160692, 17.0373468, 'Słodowa 島', '島嶼範圍中心 · 非單一入口', 'https://www.google.com/maps/search/?api=1&query=Wyspa%20S%C5%82odowa%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/32343150'],
    [51.1147184, 17.0422654, '座堂橋 Most Tumski', '橋身中段 · 通往大教堂島', 'https://www.google.com/maps/search/?api=1&query=Most%20Tumski%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/388043341'],
    [51.1121441, 17.0306343, '屠夫巷 Jatki', '小巷中心 · 非單一入口', 'https://www.google.com/maps/search/?api=1&query=Jatki%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/way/22727451'],
    [51.1113645, 17.0235207, 'Dessert Boutique', 'Świętego Mikołaja 43 · 甜點', diningPlaces['wroclaw-dessert-boutique'].map, 'food', 'https://www.openstreetmap.org/node/5275535787'],
    [51.0964161, 17.0348220, 'Wroclavia 購物中心', '商場內 · MAX／Pasibus 外帶晚餐 · Sucha 1', diningPlaces['wroclaw-max-wroclavia'].map, 'food', 'https://www.openstreetmap.org/way/526922862'],
  ],
  6: [
    venuePin('poznan-cathedral', { label: 'Ostrów Tumski 17', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.411873&mlon=16.949286' }),
    venuePin('poznan-town-hall', { displayName: '波茲南市政廳・山羊鐘樓', label: 'Stary Rynek 1 · 12:00 卡位點', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.408265&mlon=16.934560' }),
    venuePin('poznan-stary-browar', { label: 'Półwiejska 42 · 12:45 舊啤酒廠紅磚建築', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.400887&mlon=16.928376' }),
    venuePin('poznan-ck-zamek', { displayName: '帝王城堡 Zamek Cesarski（外觀）', label: 'Święty Marcin 80/82 · 15:25 帝王區只看外觀', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.407808&mlon=16.919214' }),
    venuePin('poznan-glowny-station', { label: '17:05 前抵達的城際火車出發站', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.402786&mlon=16.912914' }),
    [52.4040190, 16.9295712, 'Charlotte Krysiewicza', 'Krysiewicza 3a/27 · 07:15 早餐', diningPlaces['poznan-charlotte-krysiewicza'].map, 'food', 'https://www.openstreetmap.org/node/13392485412'],
    [52.4218633, 16.9356334, 'Cytadela「Nierozpoznani」', 'Cytadela 公園內 · 雕塑群中心', 'https://www.google.com/maps/search/?api=1&query=Nierozpoznani%20sculptures%2C%20Cytadela%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/way/430843991'],
    [52.4112715, 16.9534828, 'Śródka 壁畫', 'Śródka 3 / Rynek Śródecki 轉角 · 屋頂小號手與貓', 'https://www.google.com/maps/search/?api=1&query=Opowie%C5%9B%C4%87%20%C5%9Br%C3%B3decka%20z%20tr%C4%99baczem%20na%20dachu%20i%20kotem%20w%20tle%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/node/9083719475'],
    [52.4069438, 16.9341176, 'Weranda Caffe', 'Świętosławska 10 · 咖啡', diningPlaces['poznan-weranda-caffe'].map, 'food', 'https://www.openstreetmap.org/node/430266133'],
    [52.4091560, 16.9310337, '皇家城堡山丘（Przemysł 王城）', 'Góra Przemysła · 皇家城堡建物', 'https://www.google.com/maps/search/?api=1&query=Royal%20Castle%2C%20G%C3%B3ra%20Przemys%C5%82a%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/way/363747422'],
    [52.4079388, 16.9340378, 'ROGAL Świętomarciński', 'Stary Rynek 11/17 · 座標取 11 號門牌，約 20 公尺內', diningPlaces['poznan-rogal'].map, 'food', 'https://www.openstreetmap.org/node/7102833673'],
    [52.4081225, 16.9277159, '自由廣場 Plac Wolności', '廣場範圍中心', 'https://www.google.com/maps/search/?api=1&query=Plac%20Wolno%C5%9Bci%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/way/634296533'],
    [52.4084134, 16.9222469, 'Okrąglak 圓形百貨', 'Seweryna Mielżyńskiego 14 · 飯後往帝王區順路拍', 'https://www.google.com/maps/search/?api=1&query=Okr%C4%85glak%2C%20Seweryna%20Miel%C5%BCy%C5%84skiego%2014%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/way/246117826'],
    [52.4065273, 16.9261119, 'Carla Trattoria Moderna', 'Święty Marcin 34 · 建物中心，實際店門約 30 公尺內', diningPlaces['poznan-carla-trattoria-moderna'].map, 'food', 'https://www.openstreetmap.org/way/130279698'],
    [52.4072699, 16.9119251, 'Kaponiera「5 Figur」', 'Roosevelta 22 附近 · 街頭雕塑', 'https://www.google.com/maps/search/?api=1&query=5%20Figur%20sculpture%2C%20Kaponiera%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/node/9107873635'],
  ],
  7: [
    venuePin('warsaw-old-town-square', { label: '10:40 老城廣場；前後是甕城、石階街、許願鐘與聖若望大教堂', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.249778&mlon=21.012151' }),
    [52.2493716, 20.9931609, 'POLIN 波蘭猶太人歷史博物館（外觀）', 'Mordechaja Anielewicza 6 · 早上第一站，只看外觀', 'https://www.google.com/maps/search/?api=1&query=POLIN%20Museum%2C%20Mordechaja%20Anielewicza%206%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/186141946'],
    [52.2426428, 21.0250683, 'BUW 華沙大學圖書館屋頂花園', 'Dobra 56/66 · 14:35 屋頂花園＋河岸步道', 'https://www.google.com/maps/search/?api=1&query=Biblioteka%20Uniwersytecka%20w%20Warszawie%2C%20Dobra%2056%2F66%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/relation/6414970'],
    [52.2147016, 21.0280881, '瓦津基公園 · 蕭邦紀念碑', '15:25 進公園的第一站；水上宮殿在公園中央湖邊', 'https://www.google.com/maps/search/?api=1&query=Chopin%20Monument%2C%20%C5%81azienki%20Kr%C3%B3lewskie%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/1448330230'],
    [52.2294483, 21.0148815, 'Soul Kitchen', 'Nowogrodzka 18A · 18:30 最後晚餐', diningPlaces['warsaw-soul-kitchen'].map, 'food', 'https://www.openstreetmap.org/node/4373643390'],
    [52.2325833, 21.0140889, 'Bułkę przez Bibułkę', 'Zgoda 3 · 早餐', diningPlaces['warsaw-bulke-przez-bibulke-zgoda'].map, 'food', 'https://www.openstreetmap.org/node/316892293'],
    [52.2331288, 21.0089838, 'MSN 現代美術館', 'Marszałkowska 103', 'https://www.google.com/maps/search/?api=1&query=Museum%20of%20Modern%20Art%2C%20Marsza%C5%82kowska%20103%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/944207076'],
    [52.2493699, 21.0058184, '克拉辛斯基廣場・起義紀念碑', '華沙起義紀念碑（戶外雕塑）', 'https://www.google.com/maps/search/?api=1&query=Warsaw%20Uprising%20Monument%2C%20plac%20Krasi%C5%84skich%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/1327606552'],
    [52.2529105, 21.0083736, '新城廣場 Rynek Nowego Miasta', '廣場範圍中心', 'https://www.google.com/maps/search/?api=1&query=Rynek%20Nowego%20Miasta%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/320220423'],
    [52.2543057, 21.0090175, '聖母訪親教堂', 'Przyrynek 2 · 新城北端河岸高地', 'https://www.google.com/maps/search/?api=1&query=Church%20of%20the%20Visitation%2C%20Przyrynek%202%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/136396035'],
    [52.2514555, 21.0085289, 'Freta 16 居禮夫人出生地', 'Freta 16', 'https://www.google.com/maps/search/?api=1&query=Maria%20Sk%C5%82odowska-Curie%20Museum%2C%20Freta%2016%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/node/5171659521'],
    [52.2505875, 21.0100170, '甕城 Barbakan', 'Nowomiejska 15/17', 'https://www.google.com/maps/search/?api=1&query=Barbakan%2C%20Nowomiejska%2015%2F17%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/249395313'],
    [52.2488818, 21.0136708, '聖若望大教堂', 'Świętojańska 8', 'https://www.google.com/maps/search/?api=1&query=St.%20John\'s%20Archcathedral%2C%20%C5%9Awi%C4%99toja%C5%84ska%208%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/404052334'],
    [52.2481101, 21.0124709, '聖馬丁教堂', 'Piwna 9/11 門面 · 座標約 30 公尺內', 'https://www.google.com/maps/search/?api=1&query=Piwna%209%2F11%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/128808346'],
    [52.2482476, 21.0137690, 'Polka', 'Świętojańska 2 · 12:30 午餐', diningPlaces['warsaw-polka'].map, 'food', 'https://www.openstreetmap.org/node/416560107'],
    [52.2436320, 21.0103460, '劇院廣場・大劇院', 'Plac Teatralny 1 · 建物內座標，非入口', 'https://www.google.com/maps/search/?api=1&query=Teatr%20Wielki%20Opera%20Narodowa%2C%20Plac%20Teatralny%201%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/node/8839947745'],
    [52.2409328, 21.0113096, '無名塚 Grób Nieznanego Żołnierza', 'Plac Piłsudskiego · 薩克森花園東緣', 'https://www.google.com/maps/search/?api=1&query=Tomb%20of%20the%20Unknown%20Soldier%2C%20Plac%20Pi%C5%82sudskiego%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/72833763'],
    [52.2392415, 21.0114907, 'Zachęta 國家美術館', 'Plac Stanisława Małachowskiego 3', 'https://www.google.com/maps/search/?api=1&query=Zach%C4%99ta%20National%20Gallery%20of%20Art%2C%20Plac%20Ma%C5%82achowskiego%203%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/28894938'],
    [52.2150560, 21.0358058, '水上宮殿 Pałac na Wyspie', 'Agrykola 1 · 湖中島', 'https://www.google.com/maps/search/?api=1&query=Palace%20on%20the%20Isle%2C%20%C5%81azienki%20Kr%C3%B3lewskie%2C%20Agrykola%201%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/1325609735'],
    [52.2286979, 21.0225486, '三十字廣場 Plac Trzech Krzyży', '廣場範圍中心', 'https://www.google.com/maps/search/?api=1&query=Plac%20Trzech%20Krzy%C5%BCy%2C%20Warszawa', 'sight', 'https://www.openstreetmap.org/way/442135655'],
    [52.2282747, 21.0138294, 'QQ Warsaw', 'Żurawia 32/34 · 下午點心', diningPlaces['warsaw-qq-warsaw-matcha-korean-toasts'].map, 'food', 'https://www.openstreetmap.org/node/3429255098'],
  ],
  8: [
    venuePin('warsaw-centralna-station', { label: '由 Hotel Metropol 前往機場線的市中心交通錨點', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.228917&mlon=21.003315' }),
    [52.2294024, 21.0075880, 'Warszawa Śródmieście', 'SKM S2 上車站 · Hotel Metropol 旁約 250 公尺', 'https://www.google.com/maps/search/?api=1&query=Warszawa%20%C5%9Ar%C3%B3dmie%C5%9Bcie%20SKM', 'transport', 'https://www.openstreetmap.org/node/2351113017'],
    [52.169709, 20.975785, 'Warszawa Lotnisko Chopina 機場鐵路站', 'PKP PLK 車站目錄座標 · 非航廈報到入口', 'https://www.google.com/maps/search/?api=1&query=Warszawa%20Lotnisko%20Chopina%20railway%20station%2C%20Warszawa%2C%20Poland', 'transport', 'https://portalpasazera.pl/en/KatalogStacji?stacja=Warszawa+Lotnisko+Chopina'],
  ],
};

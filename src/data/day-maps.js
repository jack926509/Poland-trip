import { venuePin } from '../lib/venues.mjs';

// 每日地圖只以「白天實際遊覽城市」為主。晚間火車抵達城市不納入當日視野，
// 避免 fitBounds 把兩座城市同時縮到無法辨識；車站與住宿僅在同一主城市且有操作價值時保留。
export const dayMapPlans = {
  1: { focus: '華沙 Warszawa', center: [52.247, 21.013], zoom: 15, selections: { warsaw: ['皇家城堡'] } },
  2: { focus: '克拉科夫 Kraków', center: [50.057, 19.944], zoom: 14, selections: { krakow: ['Wawel 皇家城堡', '中央市集廣場', 'Kazimierz 猶太區', '辛德勒工廠博物館', 'Okrąglak（Plac Nowy zapiekanka）', 'ibis budget Krakow Stare Miasto'] } },
  3: { focus: '奧斯威辛 Oświęcim／Brzezinka', center: [50.033, 19.192], zoom: 13, selections: {} },
  4: { focus: '克拉科夫 Kraków＋Wieliczka', center: [50.040, 19.995], zoom: 12, selections: { krakow: ['Kazimierz 猶太區', 'Sukiennice 布廊（伴手禮攤位）', 'ibis budget Krakow Stare Miasto'] } },
  5: { focus: '樂斯拉夫 Wrocław', center: [51.110, 17.049], zoom: 13, selections: { wroclaw: ['中央市集廣場', '大教堂島 Ostrów Tumski', '百年廳 Hala Stulecia', 'Restauracja Wrocławska', 'Piast'] } },
  6: { focus: '波茲南 Poznań', center: [52.407, 16.930], zoom: 14, selections: { poznan: ['舊市集廣場 Stary Rynek', '大教堂島 Ostrów Tumski', '可頌博物館', 'Poznan Apartments Towarowa'] } },
  7: { focus: '華沙 Warszawa', center: [52.241, 20.997], zoom: 13, selections: { warsaw: ['皇家城堡', 'POLIN 猶太史博物館', '華沙起義博物館', 'MEI', 'Hotel Metropol'] } },
  8: { focus: '華沙 Warszawa＋蕭邦機場', center: [52.202, 20.991], zoom: 12, selections: { warsaw: ['Hotel Metropol'] } },
};

// 精煉切片 4b：有對到 src/data/venues.js 的補充圖釘改用 venuePin() 取座標與
// 導航連結（單一來源，不再跟 venues.js 各存一份同樣的座標——見 data-audit.md
// §2-E）；label／category／座標查證來源仍是當天的敘述，不是地點本身的固定
// 事實，繼續留在呼叫端。純粹只在地圖上當路標、travel-database.js 與
// venues.js 都沒有這個地點的（Podgórze 猶太英雄廣場、Papa Krasnal 小矮人等），
// 保持原本的字面陣列，不勉強湊一個 venue。
export const daySupplementaryPins = {
  1: [
    venuePin('warsaw-old-town-square', { displayName: '華沙老城市場廣場・美人魚像', label: 'Day 1 老城散步中心點', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.249778&mlon=21.012151' }),
    venuePin('warsaw-krakowskie-przedmiescie', { displayName: '皇家大道・Krakowskie Przedmieście', label: '以聖十字教堂前作為傍晚散步錨點', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.242160&mlon=21.015690' }),
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
    [51.111492, 17.029774, '聖伊莉莎白教堂塔樓入口', 'Świętej Elżbiety 1/2 · 登塔依當日公告', 'https://www.google.com/maps/search/?api=1&query=St.%20Elizabeth%20Church%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.111492&mlon=17.029774'],
    venuePin('wroclaw-panorama', { displayName: '拉茨瓦維採全景畫', label: 'Jana Ewangelisty Purkyniego 11', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=51.110187&mlon=17.044488' }),
    [51.109767, 17.079944, '日本花園 Ogród Japoński', '百年廳周邊備選；當日依季節開放狀態決定', 'https://www.google.com/maps/search/?api=1&query=Japanese%20Garden%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.109767&mlon=17.079944'],
    venuePin('wroclaw-cathedral', { label: 'plac Katedralny 18 · 座堂島散步終點', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=51.114616&mlon=17.046989' }),
    venuePin('wroclaw-glowny-station', { label: '18:35 前抵達的晚間轉場車站', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=51.098928&mlon=17.036255' }),
  ],
  6: [
    venuePin('poznan-cathedral', { label: 'Ostrów Tumski 17', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.411873&mlon=16.949286' }),
    venuePin('poznan-town-hall', { displayName: '波茲南市政廳・山羊鐘樓', label: 'Stary Rynek 1 · 12:00 卡位點', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.408265&mlon=16.934560' }),
    venuePin('poznan-ck-zamek', { displayName: '帝王城堡 Zamek Cesarski', label: 'Święty Marcin 80/82', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.407808&mlon=16.919214' }),
    venuePin('poznan-stary-browar', { label: 'Półwiejska 42', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.400887&mlon=16.928376' }),
    venuePin('poznan-glowny-station', { label: '17:05 前抵達的城際火車出發站', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.402786&mlon=16.912914' }),
  ],
  7: [
    venuePin('warsaw-old-town-square', { label: '三館後的老城與晚餐收尾區', category: 'sight', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.249778&mlon=21.012151' }),
  ],
  8: [
    venuePin('warsaw-centralna-station', { label: '由 Hotel Metropol 前往機場線的市中心交通錨點', category: 'transport', coordinateSource: 'https://www.openstreetmap.org/?mlat=52.228917&mlon=21.003315' }),
    [52.169709, 20.975785, 'Warszawa Lotnisko Chopina 機場鐵路站', 'PKP PLK 車站目錄座標 · 非航廈報到入口', 'https://www.google.com/maps/search/?api=1&query=Warszawa%20Lotnisko%20Chopina%20railway%20station%2C%20Warszawa%2C%20Poland', 'transport', 'https://portalpasazera.pl/en/KatalogStacji?stacja=Warszawa+Lotnisko+Chopina'],
  ],
};

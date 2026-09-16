// 每日地圖只以「白天實際遊覽城市」為主。晚間火車抵達城市不納入當日視野，
// 避免 fitBounds 把兩座城市同時縮到無法辨識；車站與住宿僅在同一主城市且有操作價值時保留。
export const dayMapPlans = {
  1: { focus: '華沙 Warszawa', center: [52.247, 21.013], zoom: 15, selections: { warsaw: ['皇家城堡'] } },
  2: { focus: '克拉科夫 Kraków', center: [50.057, 19.944], zoom: 14, selections: { krakow: ['Wawel 皇家城堡', '中央市集廣場', 'Kazimierz 猶太區', '辛德勒工廠博物館', 'Okrąglak（Plac Nowy zapiekanka）', 'ibis budget Krakow Stare Miasto'] } },
  3: { focus: '奧斯威辛 Oświęcim／Brzezinka', center: [50.033, 19.192], zoom: 13, selections: {} },
  4: { focus: '克拉科夫 Kraków＋Wieliczka', center: [50.040, 19.995], zoom: 12, selections: { krakow: ['Kazimierz 猶太區', 'Sukiennice 布廊（伴手禮攤位）', 'ibis budget Krakow Stare Miasto'] } },
  5: { focus: '樂斯拉夫 Wrocław', center: [51.110, 17.049], zoom: 13, selections: { wroclaw: ['中央市集廣場', '大教堂島 Ostrów Tumski', '百年廳 Hala Stulecia', 'Piast'] } },
  6: { focus: '波茲南 Poznań', center: [52.407, 16.930], zoom: 14, selections: { poznan: ['舊市集廣場 Stary Rynek', '大教堂島 Ostrów Tumski', '可頌博物館', 'Poznan Apartments Towarowa'] } },
  7: { focus: '華沙 Warszawa', center: [52.241, 20.997], zoom: 13, selections: { warsaw: ['皇家城堡', 'POLIN 猶太史博物館', '華沙起義博物館', 'Hotel Metropol'] } },
  8: { focus: '華沙 Warszawa＋蕭邦機場', center: [52.202, 20.991], zoom: 12, selections: { warsaw: ['Hotel Metropol'] } },
};

export const daySupplementaryPins = {
  1: [
    [52.249778, 21.012151, '華沙老城市場廣場・美人魚像', 'Day 1 老城散步中心點', 'https://www.google.com/maps/search/?api=1&query=Warsaw%20Old%20Town%20Market%20Square%20Mermaid', 'sight', 'https://www.openstreetmap.org/?mlat=52.249778&mlon=21.012151'],
    [52.242160, 21.015690, '皇家大道・Krakowskie Przedmieście', '以聖十字教堂前作為傍晚散步錨點', 'https://www.google.com/maps/search/?api=1&query=Holy%20Cross%20Church%20Krakowskie%20Przedmie%C5%9Bcie%20Warsaw', 'sight', 'https://www.openstreetmap.org/?mlat=52.242160&mlon=21.015690'],
  ],
  2: [
    [50.054727, 19.935226, '瓦維爾大教堂', 'Wawel 3 · 主入口區', 'https://www.google.com/maps/search/?api=1&query=Wawel%20Cathedral%2C%20Wawel%203%2C%20Krak%C3%B3w', 'sight', 'https://www.openstreetmap.org/?mlat=50.054727&mlon=19.935226'],
    [50.061692, 19.939409, '聖瑪利亞聖殿', 'plac Mariacki 5', 'https://www.google.com/maps/search/?api=1&query=St.%20Mary%27s%20Basilica%2C%20plac%20Mariacki%205%2C%20Krak%C3%B3w', 'sight', 'https://www.openstreetmap.org/?mlat=50.061692&mlon=19.939409'],
    [50.061713, 19.937349, '紡織會館 Sukiennice', 'Rynek Główny 3', 'https://www.google.com/maps/search/?api=1&query=Sukiennice%2C%20Rynek%20G%C5%82%C3%B3wny%203%2C%20Krak%C3%B3w', 'shop', 'https://www.openstreetmap.org/?mlat=50.061713&mlon=19.937349'],
    [50.046828, 19.954386, 'Podgórze・猶太英雄廣場', '步行往辛德勒工廠的明確中途錨點', 'https://www.google.com/maps/search/?api=1&query=Ghetto%20Heroes%20Square%2C%20Krak%C3%B3w', 'sight', 'https://www.openstreetmap.org/?mlat=50.046828&mlon=19.954386'],
  ],
  3: [
    [50.029763, 19.204816, 'Auschwitz I 訪客服務中心／入口', '官方確認入口 · Więźniów Oświęcimia 55', 'https://www.google.com/maps/search/?api=1&query=Auschwitz%20Memorial%20Visitor%20Services%20Center%2C%2055%20Wi%C4%99%C5%BAni%C3%B3w%20O%C5%9Bwi%C4%99cimia%2C%20O%C5%9Bwi%C4%99cim%2C%20Poland', 'sight', 'https://www.auschwitz.org/en/museum/news/new-visitor-services-center-at-the-auschwitz-memorial-change-of-the-place-of-arrival-and-entrance-from-15-june%2C1614.html'],
    [50.035948, 19.178314, 'Auschwitz II–Birkenau 主入口', 'Ofiar Faszyzmu 12 · 導覽接駁下車後依現場指示集合', 'https://www.google.com/maps/search/?api=1&query=Auschwitz%20II-Birkenau%2C%20Ofiar%20Faszyzmu%2012%2C%20Brzezinka', 'sight', 'https://www.openstreetmap.org/?mlat=50.035948&mlon=19.178314'],
  ],
  4: [
    [49.983480, 20.054770, '維利奇卡鹽礦 Daniłowicz Shaft', '官方確認 Tourist Route 集合入口', 'https://www.google.com/maps/search/?api=1&query=Dani%C5%82owicz%20Shaft%2C%20Wieliczka%20Salt%20Mine%2C%20Poland', 'sight', 'https://www.wieliczka-saltmine.com/events/important-information/map-and-access'],
    [49.982938, 20.054328, 'Wieliczka Rynek-Kopalnia 車站', 'KMŁ 下車站；步行前往 Daniłowicz Shaft', 'https://www.google.com/maps/search/?api=1&query=Wieliczka%20Rynek-Kopalnia%20railway%20station', 'transport', 'https://www.openstreetmap.org/?mlat=49.982938&mlon=20.054328'],
    [50.069918, 19.947160, 'Kraków Główny', '取行李後的城際火車出發站', 'https://www.google.com/maps/search/?api=1&query=Krak%C3%B3w%20G%C5%82%C3%B3wny', 'transport', 'https://www.openstreetmap.org/?mlat=50.069918&mlon=19.947160'],
  ],
  5: [
    [51.108896, 17.026714, 'Papa Krasnal 小矮人', 'Świdnicka 地下道旁；小矮人尋寶的具體起點', 'https://www.google.com/maps/search/?api=1&query=Papa%20Krasnal%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.108896&mlon=17.026714'],
    [51.111690, 17.029114, '糖果屋雙屋 Jaś i Małgosia', 'Świętego Mikołaja 1', 'https://www.google.com/maps/search/?api=1&query=Hansel%20and%20Gretel%20Houses%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.111690&mlon=17.029114'],
    [51.111492, 17.029774, '聖伊莉莎白教堂塔樓入口', 'Świętej Elżbiety 1/2 · 登塔依當日公告', 'https://www.google.com/maps/search/?api=1&query=St.%20Elizabeth%20Church%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.111492&mlon=17.029774'],
    [51.110187, 17.044488, '拉茨瓦維採全景畫', 'Jana Ewangelisty Purkyniego 11', 'https://www.google.com/maps/search/?api=1&query=Panorama%20Rac%C5%82awicka%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.110187&mlon=17.044488'],
    [51.109767, 17.079944, '日本花園 Ogród Japoński', '百年廳周邊備選；當日依季節開放狀態決定', 'https://www.google.com/maps/search/?api=1&query=Japanese%20Garden%2C%20Wroc%C5%82aw', 'sight', 'https://www.openstreetmap.org/?mlat=51.109767&mlon=17.079944'],
    [51.114616, 17.046989, '樂斯拉夫主教座堂', 'plac Katedralny 18 · 座堂島散步終點', 'https://www.google.com/maps/search/?api=1&query=Wroc%C5%82aw%20Cathedral%2C%20plac%20Katedralny%2018', 'sight', 'https://www.openstreetmap.org/?mlat=51.114616&mlon=17.046989'],
    [51.098928, 17.036255, 'Wrocław Główny', '18:35 前抵達的晚間轉場車站', 'https://www.google.com/maps/search/?api=1&query=Wroc%C5%82aw%20G%C5%82%C3%B3wny', 'transport', 'https://www.openstreetmap.org/?mlat=51.098928&mlon=17.036255'],
  ],
  6: [
    [52.411873, 16.949286, '波茲南主教座堂', 'Ostrów Tumski 17', 'https://www.google.com/maps/search/?api=1&query=Pozna%C5%84%20Cathedral%2C%20Ostr%C3%B3w%20Tumski%2017', 'sight', 'https://www.openstreetmap.org/?mlat=52.411873&mlon=16.949286'],
    [52.408265, 16.934560, '波茲南市政廳・山羊鐘樓', 'Stary Rynek 1 · 12:00 卡位點', 'https://www.google.com/maps/search/?api=1&query=Pozna%C5%84%20Town%20Hall%2C%20Stary%20Rynek%201', 'sight', 'https://www.openstreetmap.org/?mlat=52.408265&mlon=16.934560'],
    [52.407808, 16.919214, '帝王城堡 Zamek Cesarski', 'Święty Marcin 80/82', 'https://www.google.com/maps/search/?api=1&query=Zamek%20Cesarski%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/?mlat=52.407808&mlon=16.919214'],
    [52.400887, 16.928376, 'Stary Browar', 'Półwiejska 42', 'https://www.google.com/maps/search/?api=1&query=Stary%20Browar%2C%20Pozna%C5%84', 'sight', 'https://www.openstreetmap.org/?mlat=52.400887&mlon=16.928376'],
    [52.402786, 16.912914, 'Poznań Główny', '17:05 前抵達的城際火車出發站', 'https://www.google.com/maps/search/?api=1&query=Pozna%C5%84%20G%C5%82%C3%B3wny', 'transport', 'https://www.openstreetmap.org/?mlat=52.402786&mlon=16.912914'],
  ],
  7: [
    [52.249778, 21.012151, '華沙老城市場廣場', '三館後的老城與晚餐收尾區', 'https://www.google.com/maps/search/?api=1&query=Warsaw%20Old%20Town%20Market%20Square', 'sight', 'https://www.openstreetmap.org/?mlat=52.249778&mlon=21.012151'],
  ],
  8: [
    [52.249778, 21.012151, '華沙老城市場廣場', '早餐後若有餘裕的短程散步點', 'https://www.google.com/maps/search/?api=1&query=Warsaw%20Old%20Town%20Market%20Square', 'sight', 'https://www.openstreetmap.org/?mlat=52.249778&mlon=21.012151'],
    [52.228917, 21.003315, 'Warszawa Centralna', '由 Hotel Metropol 前往機場線的市中心交通錨點', 'https://www.google.com/maps/search/?api=1&query=Warszawa%20Centralna', 'transport', 'https://www.openstreetmap.org/?mlat=52.228917&mlon=21.003315'],
    [52.169709, 20.975785, 'Warszawa Lotnisko Chopina 機場鐵路站', 'PKP PLK 車站目錄座標 · 非航廈報到入口', 'https://www.google.com/maps/search/?api=1&query=Warszawa%20Lotnisko%20Chopina%20railway%20station%2C%20Warszawa%2C%20Poland', 'transport', 'https://portalpasazera.pl/en/KatalogStacji?stacja=Warszawa+Lotnisko+Chopina'],
  ],
};

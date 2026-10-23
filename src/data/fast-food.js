import { diningPlaces } from './dining-places.js';
// 連鎖速食資料與一般餐廳分開維護；每筆 branch 只代表一間實體門市。
// 2026-10-12 逐店以網路交叉比對確認仍在營業；只有第三方時段的分店標 partial，找不到的分店已移除。
const chainMap = query => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const fastFoodChains = [
  {
    name: 'KFC',
    cn: '肯德基',
    kind: '炸雞',
    tags: ['沾醬選擇多'],
    signature: ['Zinger 香辣雞腿堡', 'Twister／iTwist 墨西哥捲', 'Kubełek 全家桶', 'Hot Wings 辣雞翅', 'Strips 雞柳條'],
    note: '波蘭 KFC 的炸雞、雞柳、雞翅與捲餅可作快速用餐選項；實際菜單與供應依門市當日為準。',
  },
  {
    name: "McDonald's",
    cn: '麥當勞',
    kind: '漢堡',
    tags: ['波蘭限定'],
    signature: ['WieśMac 鄉村堡', 'McRoyal', '季節商品（依當日菜單）'],
    note: 'WieśMac 是波蘭代表性品項；Burger Drwala 與其他季節商品的上市日每年不同，行程期間是否供應須看官方即時菜單。',
  },
  {
    name: 'Pasibus',
    cn: '波蘭本土漢堡',
    kind: '漢堡',
    tags: ['波蘭品牌', '素食可換'],
    signature: ['Gonzalez（微辣）', 'Chorizard', 'Bebek Junior', 'Awokodus（酪梨）', 'Triple Smash', '松露 smash'],
    note: '源自樂斯拉夫的波蘭品牌；品項與替換選項以門市當日菜單為準。',
  },
  {
    name: 'MAX Premium Burgers',
    cn: '瑞典連鎖',
    kind: '漢堡',
    tags: ['高價位', '植物肉'],
    signature: ['Frisco Burger', 'Rywala Bacon', 'Rywal Umami', 'sweet potato fries', 'onion rings', '奶昔'],
    note: '提供牛肉、雞肉與植物肉餐點；品項與供應以門市當日菜單為準。',
  },
  {
    name: 'Berlin Döner Kebap',
    cn: '土耳其式旋轉烤肉',
    kind: '烤肉捲',
    tags: ['平價', '適合宵夜'],
    signature: ['Döner kebab', 'kebab box', 'American wrap'],
    note: '有捲餅、麵包與餐盒等形式；肉類與菜單供應以門市當日為準。',
  },
  {
    name: 'Salad Story',
    cn: '沙拉連鎖',
    kind: '沙拉',
    tags: ['素食友善', '有營養標示'],
    signature: ['沙拉', 'poke bowls', 'warm bowls', 'wraps', '湯品'],
    note: '提供沙拉、碗餐與捲餅；品項與營養資訊以官方即時菜單為準。',
  },
];

const verified = ({id, chain, cityKey, address, note, query, hours, sourceUrl, checkedAt = '2026-09-19', verificationStatus = 'verified'}) => ({
  id, chain, cityKey, address, note, map: chainMap(query), hours, sourceUrl,
  checkedAt, verificationStatus,
});

// 已排入三餐的分店共用餐飲主檔，避免速食備案與正餐顯示不同時段。
const plannedBranch = (id, chain, note) => {
  const place = diningPlaces[id];
  return {id, chain, cityKey:place.cityKey, address:place.address, note, map:place.map, hours:place.hours, sourceUrl:place.sourceUrl, checkedAt:place.checkedAt, verificationStatus:place.verificationStatus};
};

export const fastFoodBranches = {
  warsaw: [
    verified({id: 'warsaw-kfc-zlote-tarasy', chain: 'KFC', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy，中央車站旁。', query: 'KFC Złote Tarasy, Złota 59, Warszawa', hours: '週一–六 08:45–22:00；週日 08:45–21:00（商場頁列 09:00 起）', sourceUrl: 'https://kfc.pl/restauracje/kfc-warszawa-ch-zlote-tarasy-782', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'warsaw-mcdonalds-swietokrzyska', chain: "McDonald's", cityKey: 'warsaw', address: 'Świętokrzyska 35', note: '市中心，近地鐵 Świętokrzyska 站。', query: "McDonald's Świętokrzyska 35, Warszawa", hours: '07:00 開門；關門 23:00 至翌日 04:00 依星期（第三方目錄不一）', sourceUrl: 'https://ding.pl/mcdonalds,warszawa-swietokrzyska-35,27083', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'warsaw-pasibus-hoza', chain: 'Pasibus', cityKey: 'warsaw', address: 'Hoża 29', note: '街邊店；官網門市頁地址為 Hoża 29。', query: 'Pasibus Hoża 29, Warszawa', hours: '週日–四 10:00–22:00；週五–六 10:00–00:00', sourceUrl: 'https://www.google.com/maps/search/?api=1&query=Pasibus%20Ho%C5%BCa%2029%20Warszawa', checkedAt: '2026-10-06'}),
    plannedBranch('warsaw-pasibus-zlote-tarasy', 'Pasibus', 'Złote Tarasy，中央車站旁；晚班火車抵華沙時的速食備案與宵夜選項。'),
    plannedBranch('warsaw-pasibus-nowy-swiat', 'Pasibus', 'Nowy Świat 街邊店；週四營業到翌日 01:00，華沙最晚的 Pasibus。'),
    verified({id: 'warsaw-max-zlote-tarasy', chain: 'MAX Premium Burgers', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy。', query: 'MAX Premium Burgers Złote Tarasy, Złota 59, Warszawa', hours: '週一–六 09:00–22:00；週日 09:00–21:00', sourceUrl: 'https://www.maxpremiumburgers.pl/znajdz-max/restauracje/warszawa-2/'}),
    verified({id: 'warsaw-berlin-doner-zlote-tarasy', chain: 'Berlin Döner Kebap', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy；官方標示非營業週日亦開門。', query: 'Berlin Döner Kebap Złote Tarasy, Złota 59, Warszawa', hours: '週一–六 09:00–22:00；週日 09:00–21:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/warszawa/zote-tarasy/'}),
    verified({id: 'warsaw-salad-story-varso', chain: 'Salad Story', cityKey: 'warsaw', address: 'Chmielna 73', note: 'Varso 2，中央車站旁；週末時段短。', query: 'Salad Story Varso, Chmielna 73, Warszawa', hours: '平日依辦公大樓；週六 11:00–17:30；週日休（Wolt）', sourceUrl: 'https://wolt.com/en/pol/warsaw/restaurant/salad-story-varso', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'warsaw-salad-story-zlote-tarasy', chain: 'Salad Story', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy 美食區。', query: 'Salad Story Złote Tarasy, Złota 59, Warszawa', hours: '依商場時段（約 09:00–22:00，週日至 21:00）', sourceUrl: 'https://www.yelp.com/biz/salad-story-warszawa-6', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
  ],
  krakow: [
    verified({id: 'krakow-kfc-florianska', chain: 'KFC', cityKey: 'krakow', address: 'Floriańska 33', note: '老城 Floriańska 街，營業到深夜。', query: 'KFC Floriańska 33, Kraków', hours: '週日–四 09:00–翌日 02:00；週五、六 09:00–翌日 05:00', sourceUrl: 'https://kfc.pl/en/restaurants/kfc-krakow-florianska-523', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'krakow-mcdonalds-szewska', chain: "McDonald's", cityKey: 'krakow', address: 'Szewska 2', note: '中央市集廣場旁，營業到深夜。', query: "McDonald's Szewska 2, Kraków", hours: '約 07:00–翌日 04:00；週四至六至 05:00（第三方目錄）', sourceUrl: 'https://www.yelp.com/biz/mcdonalds-krak%C3%B3w-10', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    plannedBranch('krakow-pasibus-galeria-krakowska', 'Pasibus', 'Galeria Krakowska，中央車站旁；車站旁的速食備案。'),
    verified({id: 'krakow-max-nowohucka', chain: 'MAX Premium Burgers', cityKey: 'krakow', address: 'Nowohucka 52', note: '離市中心較遠；官網門市頁確認地址為 52。', query: 'MAX Premium Burgers Nowohucka 52, Kraków', hours: '週一–四、週日 09:00–02:00；週五–六 09:00–03:00', sourceUrl: 'https://www.maxpremiumburgers.pl/znajdz-max/restauracje/max-krakow/'}),
    verified({id: 'krakow-berlin-doner-galeria-krakowska', chain: 'Berlin Döner Kebap', cityKey: 'krakow', address: 'Pawia 5', note: 'Galeria Krakowska，中央車站旁。', query: 'Berlin Döner Kebap Galeria Krakowska, Pawia 5, Kraków', hours: '週一–六 09:00–22:00；週日 10:00–21:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/krakow/galeria_krakowska/'}),
    verified({id: 'krakow-berlin-doner-galeria-kazimierz', chain: 'Berlin Döner Kebap', cityKey: 'krakow', address: 'Podgórska 34', note: 'Galeria Kazimierz。', query: 'Berlin Döner Kebap Galeria Kazimierz, Podgórska 34, Kraków', hours: '週一–六 10:00–21:00；營業週日 10:00–20:00；非營業週日 12:00–20:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/krakow/galeria-kazimierz/'}),
    verified({id: 'krakow-salad-story-galeria-krakowska', chain: 'Salad Story', cityKey: 'krakow', address: 'Pawia 5', note: 'Galeria Krakowska 美食區。', query: 'Salad Story Galeria Krakowska, Pawia 5, Kraków', hours: '依商場時段（約 09:00–22:00）', sourceUrl: 'https://wolt.com/en/pol/krakow/restaurant/salad-story-galeria-krakowska', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'krakow-salad-story-galeria-kazimierz', chain: 'Salad Story', cityKey: 'krakow', address: 'Podgórska 34', note: 'Galeria Kazimierz 美食區。', query: 'Salad Story Galeria Kazimierz, Podgórska 34, Kraków', hours: '依商場時段（約 10:00–21:00）', sourceUrl: 'https://www.yelp.com/biz/salad-story-krak%C3%B3w', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
  ],
  wroclaw: [
    plannedBranch('wroclaw-kfc-pkp', 'KFC', 'Wrocław Główny 站內，Samarqand 晚抵或 MAX 久候時的備案。'),
    verified({id: 'wroclaw-kfc-swidnicka', chain: 'KFC', cityKey: 'wroclaw', address: 'Świdnicka 13', note: '老城中心，週四至六 24 小時。', query: 'KFC Świdnicka 13, Wrocław', hours: '週一–三 09:00–翌日 02:00；週四–六 24 小時；週日 06:00–翌日 02:00', sourceUrl: 'https://www.yelp.com/biz/kfc-wroc%C5%82aw-17', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'wroclaw-mcdonalds-rynek', chain: "McDonald's", cityKey: 'wroclaw', address: 'Rynek 30', note: '中央廣場。', query: "McDonald's Rynek 30, Wrocław", hours: '約 07:00–翌日 03:00；週四至六至 06:00', sourceUrl: 'https://www.tiendeo.pl/sklepy/wroc%C5%82aw/mcdonalds-ul-rynek/8116', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'wroclaw-pasibus-swidnicka', chain: 'Pasibus', cityKey: 'wroclaw', address: 'Świdnicka 11', note: '老城街邊店。', query: 'Pasibus Świdnicka 11, Wrocław', hours: '週一–四 12:00–00:00；週五–六 12:00–02:00；週日 12:00–00:00', sourceUrl: 'https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-stacja-swidnicka/', checkedAt: '2026-10-06'}),
    plannedBranch('wroclaw-pasibus-wroclavia', 'Pasibus', 'Wroclavia，中央車站旁；MAX 排隊時的同商場替代。'),
    verified({id: 'wroclaw-max-galeria-dominikanska', chain: 'MAX Premium Burgers', cityKey: 'wroclaw', address: 'plac Dominikański 3', note: 'Galeria Dominikańska，市中心深夜保底。', query: 'MAX Premium Burgers Galeria Dominikańska, plac Dominikański 3, Wrocław', hours: '週一–四、週日 09:00–04:00；週五–六 09:00–05:00', sourceUrl: 'https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw/'}),
    plannedBranch('wroclaw-max-wroclavia', 'MAX Premium Burgers', 'Wroclavia，中央車站旁；取行李後外帶，勿壓縮進站時間。'),
    verified({id: 'wroclaw-berlin-doner-pasaz-grunwaldzki', chain: 'Berlin Döner Kebap', cityKey: 'wroclaw', address: 'plac Grunwaldzki 22', note: 'Pasaż Grunwaldzki，大學區，離老城稍遠。', query: 'Berlin Döner Kebap Pasaż Grunwaldzki, plac Grunwaldzki 22, Wrocław', hours: '週一–六 10:00–22:00；週日 12:00–20:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/wrocaw/pasaz_grunwaldzki/'}),
    verified({id: 'wroclaw-salad-story-wroclavia', chain: 'Salad Story', cityKey: 'wroclaw', address: 'Sucha 1', note: 'Wroclavia，中央車站旁。', query: 'Salad Story Wroclavia, Sucha 1, Wrocław', hours: '依商場時段；週日 10:00–20:45（Wolt）', sourceUrl: 'https://wolt.com/en/pol/wroclaw/restaurant/salad-story-wroclavia', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
  ],
  poznan: [
    verified({id: 'poznan-kfc-stary-browar', chain: 'KFC', cityKey: 'poznan', address: 'Półwiejska 42', note: 'Stary Browar 美食區，近老城。', query: 'KFC Stary Browar, Półwiejska 42, Poznań', hours: '週一–六 09:00–21:00；週日 10:00–20:00', sourceUrl: 'https://kfc.pl/en/restaurants/kfc-poznan-stary-browar-fc-1130', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    verified({id: 'poznan-mcdonalds-polwiejska', chain: "McDonald's", cityKey: 'poznan', address: 'Półwiejska 2A', note: '老城南側往 Stary Browar 的路口；原列 Stary Rynek 87 分店仍在改建，尚未開幕。', query: "McDonald's Półwiejska 2A, Poznań", hours: '約 07:00–翌日 02:00；週三、四至 03:00；週五、六至 05:00', sourceUrl: 'https://www.yelp.com/biz/mcdonalds-pozna%C5%84-14', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
    plannedBranch('poznan-pasibus-swiety-marcin', 'Pasibus', '市中心主街街邊店；Pyra Bar 排隊太久時的備案。'),
    verified({id: 'poznan-pasibus-avenida', chain: 'Pasibus', cityKey: 'poznan', address: 'Matyi 2', note: 'Avenida，中央車站旁。', query: 'Pasibus Avenida, Matyi 2, Poznań', hours: '週一–六 09:00–21:00；週日 09:00–20:00', sourceUrl: 'https://pasibus.pl/lokalizacje/poznan/foodcourt-pasibus-avenida/'}),
    verified({id: 'poznan-max-hetmanska', chain: 'MAX Premium Burgers', cityKey: 'poznan', address: 'Hetmańska 82a', note: '市中心南側，不在老城範圍；官方目前可確認地址，逐日時間待門市頁重現。', query: 'MAX Premium Burgers Hetmańska 82a, Poznań', hours: '待確認', sourceUrl: 'https://www.maxpremiumburgers.pl/dostawa/', verificationStatus:'partial'}),
    verified({id: 'poznan-berlin-doner-king-cross', chain: 'Berlin Döner Kebap', cityKey: 'poznan', address: 'Bukowska 156', note: 'King Cross Marcelin，離老城較遠；非營業週日休息。', query: 'Berlin Döner Kebap King Cross Marcelin, Bukowska 156, Poznań', hours: '週一–六 09:00–21:00；營業週日 10:00–20:00；非營業週日休息', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/poznan/ch-king-cross-marcelin/'}),
    verified({id: 'poznan-berlin-doner-poznan-plaza', chain: 'Berlin Döner Kebap', cityKey: 'poznan', address: 'Drużbickiego 2', note: 'Poznań Plaza，離老城較遠。', query: 'Berlin Döner Kebap Poznań Plaza, Drużbickiego 2, Poznań', hours: '週一–六 09:30–21:00；營業週日 10:00–20:00；非營業週日 12:00–20:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/poznan/pozna-plaza/'}),
    verified({id: 'poznan-salad-story-stary-browar', chain: 'Salad Story', cityKey: 'poznan', address: 'Półwiejska 42', note: 'Stary Browar 美食區。', query: 'Salad Story Stary Browar, Półwiejska 42, Poznań', hours: '依商場時段（約 09:00–21:00）', sourceUrl: 'https://www.yelp.com/biz/salad-story-pozna%C5%84-2', checkedAt: '2026-10-12', verificationStatus: 'partial'}),
  ],
};

export const fastFoodHubs = [
  {
    cityKey: 'warsaw', city: '華沙', place: 'Złote Tarasy', address: 'Złota 59（中央車站旁）',
    chains: ['KFC', 'Pasibus', 'MAX Premium Burgers', 'Berlin Döner Kebap', 'Salad Story'],
    branchIds: ['warsaw-kfc-zlote-tarasy', 'warsaw-pasibus-zlote-tarasy', 'warsaw-max-zlote-tarasy', 'warsaw-berlin-doner-zlote-tarasy', 'warsaw-salad-story-zlote-tarasy'],
    map: chainMap('Złote Tarasy, Złota 59, Warszawa'),
  },
  {
    cityKey: 'krakow', city: '克拉科夫', place: 'Galeria Krakowska', address: 'Pawia 5（中央車站旁）',
    chains: ['Pasibus', 'Berlin Döner Kebap', 'Salad Story'],
    branchIds: ['krakow-pasibus-galeria-krakowska', 'krakow-berlin-doner-galeria-krakowska', 'krakow-salad-story-galeria-krakowska'],
    map: chainMap('Galeria Krakowska, Pawia 5, Kraków'),
  },
  {
    cityKey: 'wroclaw', city: '樂斯拉夫', place: 'Wroclavia', address: 'Sucha 1, Wrocław（中央車站旁）',
    chains: ['Pasibus', 'MAX Premium Burgers', 'Salad Story'],
    branchIds: ['wroclaw-pasibus-wroclavia', 'wroclaw-max-wroclavia', 'wroclaw-salad-story-wroclavia'],
    map: chainMap('Wroclavia, Sucha 1, Wrocław'),
  },
];

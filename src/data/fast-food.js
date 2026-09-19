// 連鎖速食資料與一般餐廳分開維護；每筆 branch 只代表一間實體門市。
// 官方 locator 無法在本輪逐店重現者保留候選，但明確標為 pending。
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

const pending = ({id, chain, cityKey, address, note, query, sourceUrl}) => ({
  id, chain, cityKey, address, note, map: chainMap(query), hours: '待確認', sourceUrl,
  checkedAt: '', verificationStatus: 'pending',
});

const verified = ({id, chain, cityKey, address, note, query, hours, sourceUrl}) => ({
  id, chain, cityKey, address, note, map: chainMap(query), hours, sourceUrl,
  checkedAt: '2026-09-19', verificationStatus: 'verified',
});

export const fastFoodBranches = {
  warsaw: [
    pending({id: 'warsaw-kfc-zlote-tarasy', chain: 'KFC', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy，中央車站旁；本輪未能由官方 locator 逐店重現。', query: 'KFC Złote Tarasy, Złota 59, Warszawa', sourceUrl: 'https://kfc.pl/restauracje'}),
    pending({id: 'warsaw-mcdonalds-swietokrzyska', chain: "McDonald's", cityKey: 'warsaw', address: 'Świętokrzyska 35', note: '市中心，近地鐵 Świętokrzyska 站；本輪未能由官方 locator 逐店重現。', query: "McDonald's Świętokrzyska 35, Warszawa", sourceUrl: 'https://mcdonalds.pl/restauracje/'}),
    verified({id: 'warsaw-pasibus-hoza', chain: 'Pasibus', cityKey: 'warsaw', address: 'Hoża 29', note: '街邊店；官網門市頁地址為 Hoża 29。', query: 'Pasibus Hoża 29, Warszawa', hours: '週一–四 10:00–22:00；週五–六 10:00–00:00；週日 10:00–23:00', sourceUrl: 'https://pasibus.pl/lokalizacje/warszawa/pasibus-hoza-warszawa/'}),
    verified({id: 'warsaw-pasibus-zlote-tarasy', chain: 'Pasibus', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy，中央車站旁。', query: 'Pasibus Złote Tarasy, Złota 59, Warszawa', hours: '週一–六 09:00–22:00；週日 09:00–21:00', sourceUrl: 'https://pasibus.pl/lokalizacje/warszawa/warszawa-zlote-tarasy/'}),
    verified({id: 'warsaw-max-zlote-tarasy', chain: 'MAX Premium Burgers', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy。', query: 'MAX Premium Burgers Złote Tarasy, Złota 59, Warszawa', hours: '週一–六 09:00–22:00；週日 09:00–21:00', sourceUrl: 'https://www.maxpremiumburgers.pl/znajdz-max/restauracje/warszawa-2/'}),
    verified({id: 'warsaw-berlin-doner-zlote-tarasy', chain: 'Berlin Döner Kebap', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy；官方標示非營業週日亦開門。', query: 'Berlin Döner Kebap Złote Tarasy, Złota 59, Warszawa', hours: '週一–六 09:00–22:00；週日 09:00–21:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/warszawa/zote-tarasy/'}),
    pending({id: 'warsaw-salad-story-varso', chain: 'Salad Story', cityKey: 'warsaw', address: 'Chmielna 73', note: 'Varso，中央車站旁；本輪未能由官方 locator 逐店重現。', query: 'Salad Story Varso, Chmielna 73, Warszawa', sourceUrl: 'https://saladstory.com/lokale/'}),
    pending({id: 'warsaw-salad-story-zlote-tarasy', chain: 'Salad Story', cityKey: 'warsaw', address: 'Złota 59', note: 'Złote Tarasy；本輪未能由官方 locator 逐店重現。', query: 'Salad Story Złote Tarasy, Złota 59, Warszawa', sourceUrl: 'https://saladstory.com/lokale/'}),
  ],
  krakow: [
    pending({id: 'krakow-kfc-florianska', chain: 'KFC', cityKey: 'krakow', address: 'Floriańska 33', note: '老城 Floriańska 街；本輪未能由官方 locator 逐店重現。', query: 'KFC Floriańska 33, Kraków', sourceUrl: 'https://kfc.pl/restauracje'}),
    pending({id: 'krakow-mcdonalds-szewska', chain: "McDonald's", cityKey: 'krakow', address: 'Szewska 2', note: '中央市集廣場旁；本輪未能由官方 locator 逐店重現。', query: "McDonald's Szewska 2, Kraków", sourceUrl: 'https://mcdonalds.pl/restauracje/'}),
    verified({id: 'krakow-pasibus-galeria-krakowska', chain: 'Pasibus', cityKey: 'krakow', address: 'Pawia 5', note: 'Galeria Krakowska，中央車站旁。', query: 'Pasibus Galeria Krakowska, Pawia 5, Kraków', hours: '週一–六 09:00–22:00；週日 09:30–21:00', sourceUrl: 'https://pasibus.pl/lokalizacje/krakow/pasibus-krakow-galeria-krakowska/'}),
    verified({id: 'krakow-max-nowohucka', chain: 'MAX Premium Burgers', cityKey: 'krakow', address: 'Nowohucka 52', note: '離市中心較遠；官網門市頁確認地址為 52。', query: 'MAX Premium Burgers Nowohucka 52, Kraków', hours: '週一–四、週日 09:00–02:00；週五–六 09:00–03:00', sourceUrl: 'https://www.maxpremiumburgers.pl/znajdz-max/restauracje/max-krakow/'}),
    verified({id: 'krakow-berlin-doner-galeria-krakowska', chain: 'Berlin Döner Kebap', cityKey: 'krakow', address: 'Pawia 5', note: 'Galeria Krakowska，中央車站旁。', query: 'Berlin Döner Kebap Galeria Krakowska, Pawia 5, Kraków', hours: '週一–六 09:00–22:00；週日 10:00–21:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/krakow/galeria_krakowska/'}),
    verified({id: 'krakow-berlin-doner-galeria-kazimierz', chain: 'Berlin Döner Kebap', cityKey: 'krakow', address: 'Podgórska 34', note: 'Galeria Kazimierz。', query: 'Berlin Döner Kebap Galeria Kazimierz, Podgórska 34, Kraków', hours: '週一–六 10:00–21:00；營業週日 10:00–20:00；非營業週日 12:00–20:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/krakow/galeria-kazimierz/'}),
    pending({id: 'krakow-salad-story-galeria-krakowska', chain: 'Salad Story', cityKey: 'krakow', address: 'Pawia 5', note: 'Galeria Krakowska；本輪未能由官方 locator 逐店重現。', query: 'Salad Story Galeria Krakowska, Pawia 5, Kraków', sourceUrl: 'https://saladstory.com/lokale/'}),
    pending({id: 'krakow-salad-story-galeria-kazimierz', chain: 'Salad Story', cityKey: 'krakow', address: 'Podgórska 34', note: 'Galeria Kazimierz；本輪未能由官方 locator 逐店重現。', query: 'Salad Story Galeria Kazimierz, Podgórska 34, Kraków', sourceUrl: 'https://saladstory.com/lokale/'}),
  ],
  wroclaw: [
    pending({id: 'wroclaw-kfc-swidnicka', chain: 'KFC', cityKey: 'wroclaw', address: 'Świdnicka 13', note: '老城中心；本輪未能由官方 locator 逐店重現。', query: 'KFC Świdnicka 13, Wrocław', sourceUrl: 'https://kfc.pl/restauracje'}),
    pending({id: 'wroclaw-mcdonalds-rynek', chain: "McDonald's", cityKey: 'wroclaw', address: 'Rynek 30', note: '中央廣場；本輪未能由官方 locator 逐店重現。', query: "McDonald's Rynek 30, Wrocław", sourceUrl: 'https://mcdonalds.pl/restauracje/'}),
    verified({id: 'wroclaw-pasibus-swidnicka', chain: 'Pasibus', cityKey: 'wroclaw', address: 'Świdnicka 11', note: '老城街邊店。', query: 'Pasibus Świdnicka 11, Wrocław', hours: '週一–四 12:00–01:00；週五–六 12:00–03:00；週日 12:00–00:00', sourceUrl: 'https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-stacja-swidnicka/'}),
    verified({id: 'wroclaw-pasibus-wroclavia', chain: 'Pasibus', cityKey: 'wroclaw', address: 'Sucha 1', note: 'Wroclavia，中央車站旁。', query: 'Pasibus Wroclavia, Sucha 1, Wrocław', hours: '週一–六 09:00–22:00；週日 11:00–21:00', sourceUrl: 'https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-wroclavia/'}),
    verified({id: 'wroclaw-max-galeria-dominikanska', chain: 'MAX Premium Burgers', cityKey: 'wroclaw', address: 'plac Dominikański 3', note: 'Galeria Dominikańska，市中心深夜保底。', query: 'MAX Premium Burgers Galeria Dominikańska, plac Dominikański 3, Wrocław', hours: '週一–四、週日 09:00–04:00；週五–六 09:00–05:00', sourceUrl: 'https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw/'}),
    verified({id: 'wroclaw-max-wroclavia', chain: 'MAX Premium Burgers', cityKey: 'wroclaw', address: 'Sucha 1', note: 'Wroclavia，中央車站旁。', query: 'MAX Premium Burgers Wroclavia, Sucha 1, Wrocław', hours: '週一–四 08:00–01:00；週五–六 07:00–02:00；週日 07:00–01:00', sourceUrl: 'https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw3/'}),
    verified({id: 'wroclaw-berlin-doner-pasaz-grunwaldzki', chain: 'Berlin Döner Kebap', cityKey: 'wroclaw', address: 'plac Grunwaldzki 22', note: 'Pasaż Grunwaldzki，大學區，離老城稍遠。', query: 'Berlin Döner Kebap Pasaż Grunwaldzki, plac Grunwaldzki 22, Wrocław', hours: '週一–六 10:00–22:00；週日 12:00–20:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/wrocaw/pasaz_grunwaldzki/'}),
    pending({id: 'wroclaw-salad-story-wroclavia', chain: 'Salad Story', cityKey: 'wroclaw', address: 'Sucha 1', note: 'Wroclavia，中央車站旁；本輪未能由官方 locator 逐店重現。', query: 'Salad Story Wroclavia, Sucha 1, Wrocław', sourceUrl: 'https://saladstory.com/lokale/'}),
  ],
  poznan: [
    pending({id: 'poznan-kfc-stary-browar', chain: 'KFC', cityKey: 'poznan', address: 'Półwiejska 42', note: 'Stary Browar，近老城；本輪未能由官方 locator 逐店重現。', query: 'KFC Stary Browar, Półwiejska 42, Poznań', sourceUrl: 'https://kfc.pl/restauracje'}),
    pending({id: 'poznan-mcdonalds-stary-rynek', chain: "McDonald's", cityKey: 'poznan', address: 'Stary Rynek 87', note: '舊城市集廣場候選；本輪未能由官方 locator 逐店重現，存在性與時間均待確認。', query: "McDonald's Stary Rynek 87, Poznań", sourceUrl: 'https://mcdonalds.pl/restauracje/'}),
    verified({id: 'poznan-pasibus-swiety-marcin', chain: 'Pasibus', cityKey: 'poznan', address: 'Święty Marcin 58/64', note: '市中心主街街邊店。', query: 'Pasibus Święty Marcin 58/64, Poznań', hours: '週日–四 12:00–23:00；週五–六 12:00–00:00', sourceUrl: 'https://pasibus.pl/lokalizacje/poznan/lokal-pasibus-sw-marcin/'}),
    verified({id: 'poznan-pasibus-avenida', chain: 'Pasibus', cityKey: 'poznan', address: 'Matyi 2', note: 'Avenida，中央車站旁。', query: 'Pasibus Avenida, Matyi 2, Poznań', hours: '週一–六 09:00–21:00；週日 09:00–20:00', sourceUrl: 'https://pasibus.pl/lokalizacje/poznan/foodcourt-pasibus-avenida/'}),
    verified({id: 'poznan-max-hetmanska', chain: 'MAX Premium Burgers', cityKey: 'poznan', address: 'Hetmańska 82a', note: '市中心南側，不在老城範圍；官方目前可確認地址，逐日時間待門市頁重現。', query: 'MAX Premium Burgers Hetmańska 82a, Poznań', hours: '待確認', sourceUrl: 'https://www.maxpremiumburgers.pl/dostawa/'}),
    verified({id: 'poznan-berlin-doner-king-cross', chain: 'Berlin Döner Kebap', cityKey: 'poznan', address: 'Bukowska 156', note: 'King Cross Marcelin，離老城較遠；非營業週日休息。', query: 'Berlin Döner Kebap King Cross Marcelin, Bukowska 156, Poznań', hours: '週一–六 09:00–21:00；營業週日 10:00–20:00；非營業週日休息', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/poznan/ch-king-cross-marcelin/'}),
    verified({id: 'poznan-berlin-doner-poznan-plaza', chain: 'Berlin Döner Kebap', cityKey: 'poznan', address: 'Drużbickiego 2', note: 'Poznań Plaza，離老城較遠。', query: 'Berlin Döner Kebap Poznań Plaza, Drużbickiego 2, Poznań', hours: '週一–六 09:30–21:00；營業週日 10:00–20:00；非營業週日 12:00–20:00', sourceUrl: 'https://www.berlindonerkebap.com/restauracje/poznan/pozna-plaza/'}),
    pending({id: 'poznan-salad-story-stary-browar', chain: 'Salad Story', cityKey: 'poznan', address: 'Półwiejska 42', note: 'Stary Browar，近老城；本輪未能由官方 locator 逐店重現。', query: 'Salad Story Stary Browar, Półwiejska 42, Poznań', sourceUrl: 'https://saladstory.com/lokale/'}),
    pending({id: 'poznan-salad-story-avenida', chain: 'Salad Story', cityKey: 'poznan', address: 'Matyi 2', note: 'Avenida，中央車站旁；本輪未能由官方 locator 逐店重現。', query: 'Salad Story Avenida, Matyi 2, Poznań', sourceUrl: 'https://saladstory.com/lokale/'}),
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
    cityKey: 'wroclaw', city: '樂斯拉夫', place: 'Wroclavia', address: 'Sucha 1（中央車站旁）',
    chains: ['Pasibus', 'MAX Premium Burgers', 'Salad Story'],
    branchIds: ['wroclaw-pasibus-wroclavia', 'wroclaw-max-wroclavia', 'wroclaw-salad-story-wroclavia'],
    map: chainMap('Wroclavia, Sucha 1, Wrocław'),
  },
];

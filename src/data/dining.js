// 本檔整合 poland-travel-guide-final.html 的 2026 餐飲資料，
// 以及 redesign/data.js 的行程餐廳、備案與必吃清單。
// 由來源機械轉錄，頁面模板不得另行寫死餐飲內容。

export const michelinSummary = [
  {
    "city": "克拉科夫",
    "stars": "★★",
    "star2List": [
      "Bottiglieria 1881"
    ],
    "star1List": [],
    "bibList": [
      "Folga",
      "MOLÁM",
      "NOAH",
      "Bufet KRK",
      "Nat Bistro"
    ]
  },
  {
    "city": "華沙",
    "stars": "★",
    "star2List": [],
    "star1List": [
      "Alon Omakase",
      "hub.praga",
      "NUTA",
      "Rozbrat 20"
    ],
    "bibList": [
      "Ceviche Bar",
      "Kieliszki na Próżnej",
      "Koneser Grill",
      "kontakt",
      "Le Braci",
      "Wyraj",
      "AHAAN",
      "Blisko Bar",
      "WANDAL",
      "WIN"
    ]
  },
  {
    "city": "樂斯拉夫",
    "stars": "★",
    "star2List": [],
    "star1List": [
      "BABA",
      "Most"
    ],
    "bibList": [
      "IDA kuchnia i wino",
      "Tarasowa",
      "Pijalni"
    ]
  },
  {
    "city": "波茲南",
    "stars": "★",
    "star2List": [],
    "star1List": [
      "Muga"
    ],
    "bibList": [
      "Fromażeria",
      "Posto",
      "SPOT.",
      "TU.REStAURANT"
    ]
  }
];

export const michelinReservations = [
  {
    "restaurant": "⭐⭐ Bottiglieria 1881（克拉科夫）",
    "mapUrl": "https://maps.google.com/?cid=8570908113421134699",
    "perPerson": "940 / 990",
    "channel": "自家電話 +48 660 661 756 · ul. Bocheńska 5 · 平日另有單點，週末僅套餐"
  },
  {
    "restaurant": "⭐ Alon Omakase（華沙）",
    "mapUrl": "https://maps.google.com/?cid=8029724309073713102",
    "perPerson": "1,250",
    "channel": "omakase.eu 線上 · 取消/減人照收全額 · Edomae 壽司"
  },
  {
    "restaurant": "⭐ Most（樂斯拉夫）",
    "mapUrl": "https://maps.google.com/?cid=9490447263206449328",
    "perPerson": "490",
    "channel": "miedzy-mostami.pl · 僅週四–六 · 需訂金 · Księcia Witolda 1"
  },
  {
    "restaurant": "⭐ Muga（波茲南）",
    "mapUrl": "https://maps.google.com/?cid=2998937238608160974",
    "perPerson": "560 / 685",
    "channel": "官網／電話 · 法系套餐；高階版本含魚子醬"
  },
  {
    "restaurant": "⭐ NUTA（華沙）",
    "mapUrl": "https://maps.google.com/?cid=4624148008162643045",
    "perPerson": "595 / 795",
    "channel": "Michelin 線上/官網 · plac Trzech Krzyży（ETHOS）· 主廚 Andrea Camastra"
  },
  {
    "restaurant": "⭐ Rozbrat 20（華沙）",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Rozbrat%2020%20Warszawa",
    "perPerson": "590 / 690",
    "channel": "rozbrat20.com.pl · 需信用卡 · +12.5% 服務費 · smart casual、12 歲以上"
  },
  {
    "restaurant": "⭐ BABA（樂斯拉夫）",
    "mapUrl": "https://maps.google.com/?cid=9335659011047272773",
    "perPerson": "主菜 82–179",
    "channel": "Michelin 免費線上 · Nożownicza 26 席 · 主廚 Beata Śniechowska"
  },
  {
    "restaurant": "Bib · Bufet KRK（克拉科夫）",
    "mapUrl": "https://maps.google.com/?cid=861978380086701482",
    "perPerson": "€€",
    "channel": "二星副牌 · 較好訂 · 訂不到二星的替代"
  },
  {
    "restaurant": "Bib · IDA kuchnia i wino（樂斯拉夫）",
    "mapUrl": "https://maps.google.com/?cid=10589009865057440004",
    "perPerson": "209",
    "channel": "套餐含酒 · 全趟最高CP"
  }
];

// 僅收錄能由店家官網直接確認、且和本行程實際用餐有關的分店。
// 營業時間查證日：2026-08-08；餐廳仍可能臨時包場或調整，訂位頁優先。
export const verifiedRestaurantHours = [
  {
    city: '華沙',
    name: 'U Fukiera',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=U%20Fukiera%2C%20Rynek%20Starego%20Miasta%2027%2C%20Warszawa',
    address: 'Rynek Starego Miasta 27',
    hours: '週一–四 12:00–23:00；週五–六 12:00–23:30；週日 12:00–23:00',
    feature: '歷史老城波蘭料理；官網菜單可確認 żurek、餃子、鯡魚與韃靼牛肉。',
    url: 'https://www.ufukiera.pl/kontakt/',
  },
  {
    city: '華沙',
    name: 'Polka',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Restauracja%20Polka%2C%20%C5%9Awi%C4%99toja%C5%84ska%202%2C%20Warszawa',
    address: 'Świętojańska 2（皇家城堡旁）',
    hours: '每日 12:00–22:00',
    feature: '傳統波蘭料理，位置最適合接皇家城堡；不是 U Fukiera 的同一間店。',
    url: 'https://warszawa.restauracjapolka.pl/about-us',
  },
  {
    city: '華沙',
    name: 'E.Wedel Pijalnia',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Pijalnia%20Czekolady%20E.Wedel%2C%20Krakowskie%20Przedmie%C5%9Bcie%2045%2C%20Warszawa',
    address: 'Krakowskie Przedmieście 45',
    hours: '週一–四 10:00–22:00；週五–六 10:00–23:00；週日 10:00–22:00',
    feature: 'E.Wedel 巧克力飲品與甜點；已鎖定分店，避免套用商場分店的週日休店規則。',
    url: 'https://wedelpijalnie.pl/lokale',
  },
  {
    city: '樂斯拉夫',
    name: 'Konspira',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Konspira%2C%20Plac%20Solny%2011%2C%20Wroc%C5%82aw',
    address: 'Plac Solny 11',
    hours: '週一–四 13:00–23:45；週五–日 12:00–23:45；廚房至 23:00',
    feature: '傳統波蘭料理與 1980 年代反共地下運動主題空間；週五至日不接受一般訂位，依到店順序。',
    url: 'https://restauracjakonspira.pl/menu',
  },
];

export const cityDining = {
  "warsaw": [
    {
      "name": "Zagoździński",
      "tier": "甜點",
      "highlight": "招牌：pączki 玫瑰餡甜甜圈 · 1925 至今排隊名店（Górczewska）",
      "mapUrl": "https://maps.google.com/?cid=5270464504046978357"
    },
    {
      "name": "Gościniec（探索候選）",
      "tier": "餃子",
      "highlight": "招牌：手工 pierogi 餃子（肉餡／馬鈴薯起司／藍莓）· 指定分店、營業時間與訂位狀態須在出發前查證",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Go%C5%9Bciniec%20Warszawa"
    },
    {
      "name": "Bar Mleczny Rusałka",
      "tier": "牛奶吧",
      "highlight": "招牌：傳統家常套餐（湯＋主菜） · Praga · 一餐 25 PLN 內",
      "mapUrl": "https://maps.google.com/?cid=14427558643223382901"
    },
    {
      "name": "Sapko Kebab",
      "tier": "街食",
      "highlight": "招牌：土耳其 kebab，肉香四溢、份量足，在地口碑名店",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Sapko%20Kebab%20Warszawa"
    },
    {
      "name": "OKIENKO",
      "tier": "街食",
      "highlight": "招牌：比利時薯條配多款自製沾醬 · 窗口式外帶",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=OKIENKO%20Warszawa"
    },
    {
      "name": "Coś Na Ząbkowskiej",
      "tier": "在地",
      "highlight": "Praga 藝術區（Ząbkowska 9）· 招牌：波蘭家常菜現代詮釋",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Co%C5%9B%20Na%20Z%C4%85bkowskiej%20Warszawa"
    },
    {
      "name": "Hala Koszyki",
      "tier": "美食廣場",
      "highlight": "免訂位 · 多攤集合，可一次吃到多國小吃",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%20Warszawa"
    },
    {
      "name": "✦ NUTA",
      "tier": "✦ 自選 · ★",
      "highlight": "招牌：主廚 Andrea Camastra 創意套餐，義式底蘊融合亞洲香料，劇場式上菜 · 提前 3–5 週",
      "mapUrl": "https://maps.google.com/?cid=4624148008162643045"
    },
    {
      "name": "✦ Wyraj",
      "tier": "✦ 自選 · Bib",
      "highlight": "招牌：時令波蘭傳統家常菜重製",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Wyraj%20Warszawa"
    },
    {
      "name": "✦ Specjały Regionalne",
      "tier": "✦ 自選 · 波蘭地方料理",
      "highlight": "Nowy Świat 老城區 · 招牌：波蘭地方特色料理 · Day 1 晚餐 · 一–四 12:00–22:00；五、六 12:00–23:30；日 12:00–22:00",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Specjaly+Regionalne+Warsaw"
    },
    {
      "name": "✦ Pijalnia Czekolady E.Wedel Szpitalna 8",
      "tier": "✦ 自選 · 熱巧克力",
      "highlight": "Szpitalna 8 分店 · 招牌：E.Wedel 濃稠熱巧克力 · Day 1 甜點 · 一–五 08:00–22:00；六 09:00–22:00；日 09:00–21:00",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Pijalnia+Czekolady+E.Wedel+Szpitalna+8+Warsaw"
    },
    {
      "name": "✦ Café Bristol",
      "tier": "✦ 自選 · 咖啡輕食",
      "highlight": "Krakowskie Przedmieście（Hotel Bristol 內）· 招牌：輕食午餐與下午茶 · Day 7 午餐、Day 8 早餐 · 每日 08:00–20:00；週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Cafe+Bristol+Warsaw"
    },
    {
      "name": "✦ MEI 韓式烤肉",
      "tier": "✦ 自選 · 韓式烤肉",
      "highlight": "Solec 81B · 招牌：韓式烤肉 · 備選 · 營業時間待核實",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=MEI+Solec+81B+Warsaw"
    },
    {
      "name": "✦ Yache Korea",
      "tier": "✦ 自選 · 韓式",
      "highlight": "招牌：韓式家常料理 · 備選 · 營業時間待核實",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Yache+Korea+Warsaw"
    },
    {
      "name": "✦ Arirang",
      "tier": "✦ 自選 · 韓式",
      "highlight": "招牌：韓式定食與烤肉 · 備選 · 營業時間待核實",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Arirang+Restaurant+Warsaw"
    },
    {
      "name": "✦ QQ Warsaw Matcha & Korean Toasts",
      "tier": "✦ 自選 · 韓式甜點",
      "highlight": "招牌：抹茶飲品與韓式厚吐司 · 備選 · 營業時間待核實",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=QQ+Warsaw+Matcha+Korean+Toasts"
    },
    {
      "name": "✦ Pyzy Flaki Gorące（Praga）",
      "tier": "✦ 自選 · Praga 街食",
      "highlight": "招牌：玻璃罐裝 pyzy 馬鈴薯糰 · Praga 區備選 · 營業時間待核實",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Pyzy+Flaki+Gorace+Warsaw"
    }
  ],
  "krakow": [
    {
      "name": "obwarzanek 麻花圈",
      "tier": "街食",
      "highlight": "PGI · 僅克拉科夫產 · 約 3 PLN · 藍色街車（Rynek 周邊、Tunel）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=obwarzanek%20%E9%BA%BB%E8%8A%B1%E5%9C%88%20Krak%C3%B3w"
    },
    {
      "name": "Okrąglak（Plac Nowy 圓亭）",
      "tier": "使用者指定 · 街食",
      "highlight": "plac Nowy 4B · 圓亭四周聚集多家 zapiekanka 窗口；Day 2 晚餐可直接排在 Kazimierz 動線末段",
      "mapUrl": "https://maps.app.goo.gl/2Nitej5cqG4VAcbp6?g_st=il"
    },
    {
      "name": "Szalone Widelce",
      "tier": "使用者指定 · 波蘭料理",
      "highlight": "Szpitalna 40 · 位於老城東側，適合接中央市集廣場；營業時間與訂位以店家即時頁面為準",
      "mapUrl": "https://maps.app.goo.gl/U3yMsjdSgM3Pwgqe9?g_st=il"
    },
    {
      "name": "Bar Mleczny Pod Temidą",
      "tier": "使用者指定 · 牛奶吧",
      "highlight": "Grodzka 43 · 在中央廣場與 Wawel 之間，適合排平價早餐或午餐；官網每日 09:00–20:00，惟部分來源說週末公休，行前電話 12 422 08 74 確認",
      "mapUrl": "https://maps.app.goo.gl/xCGDapoy56MBvg2y7?g_st=il"
    },
    {
      "name": "Mirror Bistro",
      "tier": "餃子",
      "highlight": "招牌：手工 pierogi 十種內餡任選＋白羅宋湯 · Kazimierz 高人氣早午餐",
      "mapUrl": "https://www.google.com/maps/place/?q=place_id:ChIJOwi62GpbFkcRoi0KiVCj1dk"
    },
    {
      "name": "Pierogi Szwedzkie Svensson",
      "tier": "餃子",
      "highlight": "Długa 58 · 招牌：大顆創意餡料餃子",
      "mapUrl": "https://maps.google.com/?cid=10705718930784059170"
    },
    {
      "name": "Bar Smak",
      "tier": "在地候選",
      "highlight": "舊城（每天大排長龍）· 招牌：手工 pierogi＋馬鈴薯煎餅，份量大、道地家常味",
      "mapUrl": "https://maps.google.com/?cid=7513589258053856766"
    },
    {
      "name": "Hamsa",
      "tier": "在地候選",
      "highlight": "Kazimierz（Szeroka 2）· 招牌：中東鷹嘴豆泥 hummus、falafel",
      "mapUrl": "https://maps.google.com/?cid=1317891001987072687"
    },
    {
      "name": "Bar Mleczny 牛奶吧",
      "tier": "牛奶吧",
      "highlight": "舊城／Kazimierz 多家 · 招牌：家常湯品與馬鈴薯煎餅 · 一餐 25 PLN 內",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20%E7%89%9B%E5%A5%B6%E5%90%A7%20Krak%C3%B3w"
    },
    {
      "name": "✦ NOAH",
      "tier": "✦ 自選 · Bib",
      "highlight": "招牌：以色列烤羊肉串配 pitta 餅 · 平價實惠 · Day 2 19:45 Kazimierz 晚餐 · 日 13:00–21:30",
      "mapUrl": "https://maps.google.com/?cid=6279990201826816109"
    },
    {
      "name": "✦ FOLGA",
      "tier": "✦ 自選 · Bib",
      "highlight": "招牌：當代創意料理小盤 · 高CP",
      "mapUrl": "https://maps.google.com/?cid=7193800786272583343"
    },
    {
      "name": "✦ Endzior @ Okrąglak（Plac Nowy 圓亭）",
      "tier": "✦ 自選 · 街食",
      "highlight": "Plac Nowy 4B 圓亭內 zapiekanka 名攤 · Day 2 晚餐已排在這裡",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Endzior+Krakow"
    },
    {
      "name": "✦ Pod Aniołami",
      "tier": "✦ 自選 · 地窖晚餐",
      "highlight": "地窖燭光氛圍 · 招牌：傳統波蘭菜 · Day 3 18:00 晚餐，要訂位；官網每日 13:00–23:00，惟本項風險最高，行前電話 12 421 39 99 確認週一是否照常營業",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Pod+Aniolami+Krakow"
    },
    {
      "name": "✦ Hankki 韓式",
      "tier": "✦ 自選 · 韓式",
      "highlight": "招牌：韓式定食 · 備選 · 營業時間待核實",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Hankki+Krakow"
    }
  ],
  "wroclaw": [
    {
      "name": "Piwnica Świdnicka",
      "tier": "歷史",
      "highlight": "市政廳地窖 · 歐洲最古老餐廳之一（1273）· 招牌：傳統燉肉與啤酒",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Piwnica%20%C5%9Awidnicka%20Wroc%C5%82aw"
    },
    {
      "name": "Miś SC",
      "tier": "牛奶吧",
      "highlight": "樂斯拉夫最有名的牛奶吧，招牌：pierogi、家常湯品，價格實惠、天天排隊",
      "mapUrl": "https://maps.google.com/?cid=9100083269168988599"
    },
    {
      "name": "Bar Witek",
      "tier": "街食",
      "highlight": "招牌：zapiekanka 烤餅 · 樂斯拉夫在地地標，門口有專屬小矮人雕像",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Bar%20Witek%20Wroc%C5%82aw"
    },
    {
      "name": "Ze Smakiem Pierogarnia",
      "tier": "餃子",
      "highlight": "舊城西側 · 招牌：手工 pierogi，在地公認最道地之一",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Ze%20Smakiem%20Pierogarnia%20Wroc%C5%82aw"
    },
    {
      "name": "jagodzianka 藍莓包",
      "tier": "甜點",
      "highlight": "在地麵包店 · 招牌：夏季限定藍莓酵母麵包",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=jagodzianka%20%E8%97%8D%E8%8E%93%E5%8C%85%20Wroc%C5%82aw"
    },
    {
      "name": "✦ IDA kuchnia i wino",
      "tier": "✦ 自選 · Bib",
      "highlight": "招牌：現代版 kopytka 馬鈴薯疙瘩、pierogi、żurek 酸湯 · 149 PLN 含酒套餐，高CP · Day 5 17:00 提早晚餐 · 週三 12:00–22:00",
      "mapUrl": "https://maps.google.com/?cid=10589009865057440004"
    },
    {
      "name": "✦ Restauracja Wrocławska",
      "tier": "✦ 自選 · 在地",
      "highlight": "戰前風味 · 招牌：bigos 獵人燉菜、Silesian 餃 · Day 5 午餐 · 週三 12:00–22:00（多來源一致，非官網一手，行前電話確認）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Wroc%C5%82awska%20Wroc%C5%82aw"
    },
    {
      "name": "✦ Konspira",
      "tier": "✦ 自選 · 傳統小館",
      "highlight": "Plac Solny 11 · 1980 年代反共主題 · 招牌：Śląskie kluski · 現為備案（Day 5 午餐主位改 ✦ Restauracja Wrocławska）· 週三開門時間 12:00 或 13:00 資料不一，行前電話 796 326 600 確認 · 週五至日不接受訂位",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Konspira+Wroclaw"
    },
    {
      "name": "✦ El Gato Specialty Coffee",
      "tier": "✦ 自選 · 精品咖啡",
      "highlight": "Odrzańska 8 · 招牌：精品手沖咖啡 · Day 5 咖啡 · 一–五 09:00–18:00；六、日 10:00–18:00",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=El+Gato+Specialty+Coffee+Odrzanska+8+Wroclaw"
    },
    {
      "name": "✦ Dessert Boutique",
      "tier": "✦ 自選 · 甜點",
      "highlight": "招牌：精緻歐式甜點 · Day 5 甜點 · 二–五 12:00–19:00；六、日 11:00–20:00",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Dessert+Boutique+Cukiernia+Premium+Wroclaw"
    },
    {
      "name": "✦ Samarqand",
      "tier": "✦ 自選 · 烏茲別克／喬治亞料理",
      "highlight": "招牌：中亞與高加索料理 · 備選 · 營業時間待核實",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Samarqand+Kuchnia+Uzbecka+Gruzi%C5%84ska+Wroclaw"
    }
  ],
  "poznan": [
    {
      "name": "rogal świętomarciński",
      "tier": "名物",
      "highlight": "PGI 聖馬丁可頌 · 白罌粟籽餡 · 四季有售 · Rogalowe Muzeum、Wise Cafe（Mercure 內）公認名版本",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=rogal%20%C5%9Bwi%C4%99tomarci%C5%84ski%20Pozna%C5%84"
    },
    {
      "name": "Na Winklu",
      "tier": "餃子",
      "highlight": "Śródka 區河畔 · 招牌：烤製版大顆 pierogi，外皮酥脆內餡多汁，在地人氣首選",
      "mapUrl": "https://maps.google.com/?cid=17998777227118824033"
    },
    {
      "name": "✦ Pyra Bar",
      "tier": "✦ 自選 · 在地",
      "highlight": "馬鈴薯專門 · 招牌：pyry s bzikiem 起司烤馬鈴薯 · Day 6 12:30 快速午餐 · 週四 11:00–21:00",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Pyra%20Bar%20Pozna%C5%84"
    },
    {
      "name": "✦ Hyćka",
      "tier": "✦ 自選 · 傳統",
      "highlight": "大波蘭菜 · 招牌：烤鴨配 pyzy 蒸糰",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Hy%C4%87ka%20Pozna%C5%84"
    },
    {
      "name": "Szarlotta",
      "tier": "在地候選",
      "highlight": "招牌：鴨肉餃子（Duck Pierogi）——當地公認波茲南最佳餃子之一",
      "mapUrl": "https://maps.google.com/?cid=8072844045178633315"
    },
    {
      "name": "Restaurant 62",
      "tier": "傳統",
      "highlight": "招牌：鴨胸／鱘魚主菜、血湯配金箔 · 經典菜式創意重製",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Restaurant%2062%20Pozna%C5%84"
    }
  ]
};

// 2026-09-09 新增：小吃、牛奶吧與咖啡廳推薦。
// 每筆都必須有可點的 Google Maps 連結；營業時間屬動態資料，只寫查得到來源的，並要求出發前重查。
export const snacksAndCafes = {
  warsaw: [
    {name:'Bar Mleczny Prasowy', type:'牛奶吧', note:'1954 年開業的華沙老牌牛奶吧，żurek、pierogi、炸豬排都是銅板價。距 Hotel Metropol 沿 Marszałkowska 步行約 5 分鐘，是最順路的一餐；Day 8 早餐備案。', hours:'多數來源每日 08:00–20:00，少數來源說 09:00 才開，行前電話 666 353 776 確認', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Prasowy%2C%20Marsza%C5%82kowska%2010%2F16%2C%20Warszawa'},
    {name:'A. Blikle 1869', type:'甜點 · 咖啡', note:'1869 年創立的波蘭國民甜點店，pączki 玫瑰果醬甜甜圈是招牌。Nowy Świat 本店距飯店步行約 15 分；09:00 開門，退房前想買 pączki 帶走可繞去，不適合當 Day 8 早餐主位。', hours:'每日 09:00–21:00（官網確認）', map:'https://www.google.com/maps/search/?api=1&query=A.Blikle%2C%20Nowy%20%C5%9Awiat%2033%2C%20Warszawa'},
    {name:'✦ Pijalnia Czekolady E.Wedel · Szpitalna 8', type:'甜點 · 咖啡', note:'Szpitalna 8 分店，Day 1 晚餐後甜點，與 Krakowskie Przedmieście 分店為不同門市。', hours:'一–五 08:00–22:00、六 09:00–22:00、日 09:00–21:00', map:'https://www.google.com/maps/search/?api=1&query=Pijalnia+Czekolady+E.Wedel+Szpitalna+8+Warsaw'},
    {name:'✦ Café Bristol', type:'咖啡 · 輕食', note:'Krakowskie Przedmieście（Hotel Bristol 內），Day 7 城堡→POLIN 途中順路輕食、Day 8 早餐主位。', hours:'每日 08:00–20:00；週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認', map:'https://www.google.com/maps/search/?api=1&query=Cafe+Bristol+Warsaw'},
    {name:'Hala Koszyki', type:'美食大廳 · 宵夜', note:'百年市集改建的美食大廳，公告營業至凌晨 1:00，Day 6 晚班抵達後最好用的宵夜選項；距飯店步行約 10–15 分。', hours:'公告一–六 08:00–01:00、日 09:00–01:00（出發前重查）', map:'https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa'},
  ],
  krakow: [
    {name:'Bar Mleczny Pod Temidą', type:'牛奶吧', note:'Grodzka 43，老城區最方便的牛奶吧，pierogi、湯品與馬鈴薯煎餅都便宜；Day 2 11:30 午餐已排在這裡。', hours:'官網每日 09:00–20:00，惟部分來源說週末公休，行前電話 12 422 08 74 確認', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Pod%20Temid%C4%85%2C%20Grodzka%2043%2C%20Krak%C3%B3w'},
    {name:'✦ Endzior @ Okrąglak（Plac Nowy 圓亭）', type:'小吃 · zapiekanka', note:'Kazimierz 圓亭（Okrąglak）內的 zapiekanka 名攤，長棍麵包烤蘑菇起司，PLN 18–25；Day 2 晚餐後可繞來吃。', hours:'圓亭各攤營業到深夜，個別攤位時間不同', map:'https://www.google.com/maps/search/?api=1&query=Endzior+Krakow'},
    {name:'Karma Coffee Roasters', type:'精品咖啡', note:'2010 年開業，克拉科夫第一家精品咖啡店，Kazimierz 自家烘豆。公開資料列一–五 08:00–20:00、六日 10:00–19:00。', hours:'一–五 08:00–20:00、六日 10:00–19:00（公開資料，出發前重查）', map:'https://www.google.com/maps/search/?api=1&query=Karma%20Coffee%20Krupnicza%20Krak%C3%B3w'},
    {name:'Cukiernia Michałek', type:'甜點', note:'在地人推薦的 sernik（波蘭起司蛋糕）與傳統甜點；Day 4 已列為順路必吃。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia%20Micha%C5%82ek%20Krak%C3%B3w'},
  ],
  wroclaw: [
    {name:'Bar Mleczny Miś', type:'牛奶吧', note:'Kuźnicza 48，樂斯拉夫最知名的牛奶吧，營運逾 50 年；湯約 3–6 PLN、主菜 12–25 PLN。**週日公休**，本行程 10/28（三）可用。', hours:'一–五 07:00–18:00、六 08:00–17:00、日休（2026 公開資料，出發前重查）', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Mi%C5%9B%2C%20Ku%C5%BAnicza%2048%2C%20Wroc%C5%82aw'},
    {name:'✦ Konspira', type:'傳統小館', note:'Plac Solny 11，1980 年代地下反共運動主題餐廳，Śląskie kluski 等傳統菜；週五至日不接受訂位、依到店順序。現為備案（Day 5 午餐主位改 ✦ Restauracja Wrocławska）。', hours:'一–四 13:00–23:45、五–日 12:00–23:45（廚房至 23:00）；惟週三開門時間另有來源說是 12:00，資料不一，行前電話 796 326 600 確認', map:'https://www.google.com/maps/search/?api=1&query=Konspira%2C%20Plac%20Solny%2011%2C%20Wroc%C5%82aw'},
    {name:'✦ El Gato Specialty Coffee', type:'咖啡 · 精品咖啡', note:'Odrzańska 8，Day 5 午餐後咖啡，弗羅茨瓦夫精品咖啡選項。', hours:'一–五 09:00–18:00、六日 10:00–18:00', map:'https://www.google.com/maps/search/?api=1&query=El+Gato+Specialty+Coffee+Odrzanska+8+Wroclaw'},
    {name:'✦ Dessert Boutique', type:'甜點', note:'Day 5 甜點候選，弗羅茨瓦夫精緻歐式甜點店。', hours:'二–五 12:00–19:00、六日 11:00–20:00', map:'https://www.google.com/maps/search/?api=1&query=Dessert+Boutique+Cukiernia+Premium+Wroclaw'},
  ],
  poznan: [
    {name:'Cukiernia Kandulski', type:'甜點 · rogal', note:'聖馬丁牛角麵包（PGI）認證店家之一，Day 6 12:15 已列為順路必吃；認證店家眾多，也可依官方認證名單就近選。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia%20Kandulski%20Pozna%C5%84'},
    {name:'✦ Pyra Bar', type:'小吃 · 在地菜', note:'以大波蘭特色的 pyry z gzikiem（水煮馬鈴薯配 twaróg 起司醬）聞名，價位親民；Day 6 12:30 已列為順路必吃。', hours:'一–四 11:00–21:00、五六 11:00–23:00、日 11:00–21:00', map:'https://www.google.com/maps/search/?api=1&query=Pyra%20Bar%20Pozna%C5%84'},
  ],
};

export const cityFood = [
  {
    "city": "華沙",
    "en": "Warszawa",
    "items": [
      {
        "tag": "✦ 自選 · 晚餐",
        "name": "✦ Specjały Regionalne",
        "note": "Day 1 晚餐，Nowy Świat 波蘭地方料理；一–四 12:00–22:00、五六 12:00–23:30、日 12:00–22:00",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Specjaly+Regionalne+Warsaw"
      },
      {
        "tag": "✦ 自選 · 甜點",
        "name": "✦ Pijalnia Czekolady E.Wedel Szpitalna 8",
        "note": "Day 1 甜點，Szpitalna 8 分店；一–五 08:00–22:00、六 09:00–22:00、日 09:00–21:00",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pijalnia+Czekolady+E.Wedel+Szpitalna+8+Warsaw"
      },
      {
        "tag": "美食市集",
        "name": "Hala Koszyki",
        "note": "Day 6 宵夜，波茲南→華沙晚班抵達後最方便的宵夜選項",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Hala+Koszyki+Warszawa"
      },
      {
        "tag": "✦ 自選 · 午餐",
        "name": "✦ Café Bristol",
        "note": "Day 7 11:15 午餐（城堡→POLIN 途中）、Day 8 08:00 早餐；每日 08:00–20:00，週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Cafe+Bristol+Warsaw"
      },
      {
        "tag": "老城經典",
        "name": "U Fukiera",
        "note": "Day 7 晚餐，Żurek 麵包碗，老城最後晚餐",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=U+Fukiera+Warszawa"
      }
    ]
  },
  {
    "city": "克拉科夫",
    "en": "Kraków",
    "items": [
      {
        "tag": "牛奶吧",
        "name": "Bar Mleczny Pod Temidą",
        "note": "Day 2 11:30 午餐，Grodzka 43，往 Wawel 路上；官網每日 09:00–20:00，惟部分來源說週末公休，行前電話 12 422 08 74 確認",
        "book": "walk",
        "map": "https://maps.app.goo.gl/xCGDapoy56MBvg2y7?g_st=il"
      },
      {
        "tag": "✦ 自選 · 晚餐",
        "name": "✦ NOAH",
        "note": "Day 2 19:45 Kazimierz 晚餐，以色列烤羊肉串配 pitta 餅；日 13:00–21:30",
        "book": "must",
        "map": "https://maps.google.com/?cid=6279990201826816109"
      },
      {
        "tag": "✦ 自選 · 街食",
        "name": "✦ Endzior @ Okrąglak（Plac Nowy 圓亭）",
        "note": "Day 2 晚餐後 zapiekanka 街食",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Endzior+Krakow"
      },
      {
        "tag": "✦ 自選 · 地窖晚餐",
        "name": "✦ Pod Aniołami",
        "note": "Day 3 18:00 晚餐，地窖傳統菜，要訂位；官網每日 13:00–23:00，惟本項風險最高，行前電話 12 421 39 99 確認週一是否照常營業",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Pod+Aniolami+Krakow"
      },
      {
        "tag": "精品咖啡",
        "name": "Karma Coffee Roasters",
        "note": "Day 3 回程後的一杯咖啡",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Karma%20Coffee%20Krupnicza%20Krak%C3%B3w"
      },
      {
        "tag": "地下餐廳",
        "name": "Karczma Górnicza",
        "note": "Day 4 Wieliczka 鹽礦 125m 地下餐廳午餐",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Karczma+Gornicza+Kopalnia+Soli+Wieliczka"
      },
      {
        "tag": "Sernik",
        "name": "Cukiernia Michałek",
        "note": "Day 4 甜點，百年甜點老店 sernik",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Cukiernia+Michalek+Krakow"
      },
      {
        "tag": "Pierogi",
        "name": "Pierożki u Vincenta",
        "note": "Day 4 晚餐，Kazimierz 家常 pierogi 小店",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Piero%C5%BCki%20u%20Vincenta%2C%20B%C5%82ogos%C5%82awionej%20Bronis%C5%82awy%2C%20Krak%C3%B3w"
      }
    ]
  },
  {
    "city": "樂斯拉夫",
    "en": "Wrocław",
    "items": [
      {
        "tag": "✦ 自選 · 午餐",
        "name": "✦ Restauracja Wrocławska",
        "note": "Day 5 午餐，戰前風味，招牌 bigos 獵人燉菜；週三 12:00–22:00（多來源一致，非官網一手，行前電話確認）",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Wroc%C5%82awska%20Wroc%C5%82aw"
      },
      {
        "tag": "✦ 自選 · 晚餐",
        "name": "✦ IDA kuchnia i wino",
        "note": "Day 5 17:00 提早晚餐，19:10 火車前，含酒套餐高 CP；週三 12:00–22:00",
        "book": "must",
        "map": "https://maps.google.com/?cid=10589009865057440004"
      },
      {
        "tag": "✦ 自選 · 咖啡",
        "name": "✦ El Gato Specialty Coffee",
        "note": "Day 5 咖啡，Odrzańska 8；一–五 09:00–18:00",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=El+Gato+Specialty+Coffee+Odrzanska+8+Wroclaw"
      },
      {
        "tag": "✦ 自選 · 甜點",
        "name": "✦ Dessert Boutique",
        "note": "Day 5 甜點；二–五 12:00–19:00",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Dessert+Boutique+Cukiernia+Premium+Wroclaw"
      }
    ]
  },
  {
    "city": "波茲南",
    "en": "Poznań",
    "items": [
      {
        "tag": "PGI 牛角",
        "name": "Cukiernia Kandulski",
        "note": "Day 6 12:15 聖馬丁牛角麵包，認明 PGI 證書",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Cukiernia+Kandulski+Poznan"
      },
      {
        "tag": "✦ 自選 · 家常",
        "name": "✦ Pyra Bar",
        "note": "Day 6 12:30 快速午餐，馬鈴薯佐凝乳；週四 11:00–21:00",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pyra+Bar+Poznan"
      }
    ]
  }
];

export const foodBackup = [
  {
    "city": "華沙",
    "en": "Warszawa",
    "items": [
      {
        "tag": "✦ 自選 · 韓式烤肉",
        "name": "✦ MEI 韓式烤肉",
        "note": "Solec 81B，韓式烤肉備選；營業時間待核實",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=MEI+Solec+81B+Warsaw"
      },
      {
        "tag": "✦ 自選 · 韓式",
        "name": "✦ Yache Korea",
        "note": "韓式家常料理備選；營業時間待核實",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Yache+Korea+Warsaw"
      },
      {
        "tag": "✦ 自選 · 韓式",
        "name": "✦ Arirang",
        "note": "韓式定食與烤肉備選；營業時間待核實",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Arirang+Restaurant+Warsaw"
      },
      {
        "tag": "✦ 自選 · 韓式甜點",
        "name": "✦ QQ Warsaw Matcha & Korean Toasts",
        "note": "抹茶飲品與韓式厚吐司備選；營業時間待核實",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=QQ+Warsaw+Matcha+Korean+Toasts"
      },
      {
        "tag": "✦ 自選 · 必比登備案",
        "name": "✦ WYRAJ",
        "note": "斯拉夫傳統食材當代化",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Wyraj+restauracja+Warszawa"
      },
      {
        "tag": "✦ 自選 · 米其林一星備案",
        "name": "✦ NUTA（米其林一星）",
        "note": "主廚 Andrea Camastra 創意套餐，義式底蘊融合亞洲香料；提前 3–5 週訂位",
        "book": "must",
        "map": "https://maps.google.com/?cid=4624148008162643045"
      },
      {
        "tag": "✦ 自選 · Praga 區",
        "name": "✦ Pyzy Flaki Gorące",
        "note": "玻璃罐裝 pyzy 馬鈴薯糰 · Praga 區備選",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Pyzy+Flaki+Gorace+Warszawa"
      },
      {
        "tag": "Pierogi",
        "name": "Zapiecek",
        "note": "老城多家分店",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Zapiecek+Polskie+Pierogarnie+Warszawa"
      },
      {
        "tag": "傳統備案",
        "name": "Stary Dom",
        "note": "老派滿漢波蘭菜 · 韃靼牛肉名店，離市中心稍遠",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Restauracja+Stary+Dom+Warszawa"
      },
      {
        "tag": "牛奶吧備案",
        "name": "Bar Mleczny Familijny",
        "note": "Nowy Świat 上 · Bar Prasowy 排隊時的替代",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Bar+Mleczny+Familijny+Nowy+Swiat+Warszawa"
      },
      {
        "tag": "甜點備案",
        "name": "A. Blikle 1869",
        "note": "09:00 開門，退房前想買 pączki 帶走可繞去；每日 09:00–21:00（官網確認）",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=A.Blikle+Nowy+Swiat+Warszawa"
      }
    ]
  },
  {
    "city": "克拉科夫",
    "en": "Kraków",
    "items": [
      {
        "tag": "✦ 自選 · 韓式",
        "name": "✦ Hankki 韓式",
        "note": "備選韓式定食；營業時間待核實",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Hankki+Krakow"
      },
      {
        "tag": "✦ 自選 · 必比登備案",
        "name": "✦ FOLGA（現代料理）",
        "note": "當代創意料理小盤，高 CP，Bib Gourmand",
        "book": "must",
        "map": "https://maps.google.com/?cid=7193800786272583343"
      },
      {
        "tag": "猶太料理",
        "name": "Klezmer-Hois",
        "note": "Kazimierz 猶太料理老店",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Klezmer-Hois+Krakow"
      },
      {
        "tag": "Pierogi 備案",
        "name": "Pierożki u Vincenta",
        "note": "Kazimierz 家常 pierogi 小店，Day 3／Day 4 主位之外的備案",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pierozki+u+Vincenta+Krakow"
      },
      {
        "tag": "Pierogi",
        "name": "Pierogarnia Krakowiacy",
        "note": "老城手工餃子",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Krakowiacy+Krakow"
      },
      {
        "tag": "家常備案",
        "name": "Kuchnia u Doroty",
        "note": "Kazimierz 在地家常 · 波蘭媽媽味 · 平價",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Kuchnia+u+Doroty+Krakow"
      }
    ]
  },
  {
    "city": "樂斯拉夫",
    "en": "Wrocław",
    "items": [
      {
        "tag": "✦ 自選 · 午餐備案",
        "name": "✦ Konspira",
        "note": "週三開門時間 12:00 或 13:00 資料不一，行前電話 796 326 600 確認（現為備案，Day 5 午餐主位改 ✦ Restauracja Wrocławska）",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Konspira+Wroclaw"
      },
      {
        "tag": "✦ 自選 · 中亞料理",
        "name": "✦ Samarqand（烏茲別克／喬治亞）",
        "note": "烏茲別克／喬治亞料理備選；營業時間待核實",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Samarqand+Kuchnia+Uzbecka+Gruzi%C5%84ska+Wroclaw"
      },
      {
        "tag": "精釀啤酒",
        "name": "Browar Stu Mostów",
        "note": "樂斯拉夫代表性精釀酒廠，不喝酒可略過",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Browar+Stu+Mostow+Wroclaw"
      },
      {
        "tag": "Pierogi",
        "name": "Pierogarnia Stary Młyn",
        "note": "廣場旁",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Stary+Mlyn+Wroclaw"
      },
      {
        "tag": "傳統備案",
        "name": "Kurna Chata",
        "note": "民俗風家常波蘭菜 · 廣場旁 · 平價大份",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Kurna+Chata+Wroclaw"
      }
    ]
  },
  {
    "city": "波茲南",
    "en": "Poznań",
    "items": [
      {
        "tag": "✦ 自選 · 傳統",
        "name": "✦ Hyćka（大波蘭菜，教堂島旁）",
        "note": "大波蘭菜，招牌烤鴨配 pyzy 蒸糰",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Hy%C4%87ka%20Pozna%C5%84"
      },
      {
        "tag": "餃子",
        "name": "Na Winklu",
        "note": "Śródka 區河畔，烤製版大顆 pierogi，在地人氣首選",
        "book": "walk",
        "map": "https://maps.google.com/?cid=17998777227118824033"
      },
      {
        "tag": "傳統備案",
        "name": "Ratuszova",
        "note": "市政廳正對面地窖餐廳 · 看完山羊直接下樓",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Ratuszova+Poznan"
      },
      {
        "tag": "早餐備案",
        "name": "Modra Kuchnia",
        "note": "在地人氣早午餐 · 出發回華沙前的悠閒早餐",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Modra+Kuchnia+Poznan"
      }
    ]
  }
];

export const foods = [
  {
    "n": "01",
    "cn": "波蘭餃子",
    "pl": "Pierogi",
    "desc": "國民料理，半月形餃子有鹹甜兩款。最經典 Pierogi Ruskie（馬鈴薯加 twaróg 起司）。"
  },
  {
    "n": "02",
    "cn": "獵人燉菜",
    "pl": "Bigos",
    "desc": "波蘭國菜。酸菜 + 新鮮高麗菜 + 多種肉長時間慢燉，每位媽媽都有自家配方。"
  },
  {
    "n": "03",
    "cn": "酸黑麥湯",
    "pl": "Żurek",
    "desc": "發酵黑麥麵粉熬製，配香腸水煮蛋盛在挖空麵包碗，湯喝完碗也吃掉。"
  },
  {
    "n": "04",
    "cn": "炸豬排",
    "pl": "Kotlet Schabowy",
    "desc": "波蘭家庭週日必備。豬里肌錘薄裹麵包粉炸金黃，配馬鈴薯泥酸菜。"
  },
  {
    "n": "05",
    "cn": "包心菜捲",
    "pl": "Gołąbki",
    "desc": "意為「小鴿子」。高麗菜葉包米飯絞肉，淋番茄醬汁烘烤。"
  },
  {
    "n": "06",
    "cn": "波蘭披薩",
    "pl": "Zapiekanka",
    "desc": "長棍麵包剖半鋪蘑菇起司火腿烤製。1970 年代誕生，Plac Nowy 圓亭最有名。"
  },
  {
    "n": "07",
    "cn": "波蘭甜甜圈",
    "pl": "Pączki",
    "desc": "油炸酵母麵團，玫瑰果醬內餡。Blikle / Stara Pączkarnia 公認最佳。"
  },
  {
    "n": "08",
    "cn": "起司蛋糕 / 蘋果派",
    "pl": "Sernik / Szarlotka",
    "desc": "Sernik twaróg 起司蛋糕比紐約款輕盈濕潤；Szarlotka 蘋果派配香草冰淇淋。"
  },
  {
    "n": "09",
    "cn": "圓圈麵包 PGI",
    "pl": "Obwarzanek",
    "desc": "克拉科夫街頭環形麵包，類似貝果但更輕。歐盟地理標誌保護，PLN 3–5。"
  },
  {
    "n": "10",
    "cn": "煙燻羊乳酪",
    "pl": "Oscypek",
    "desc": "塔特拉山牧羊人手工製作，鹽水浸泡後針葉樹煙燻。可炙烤淋蔓越莓醬。"
  },
  {
    "n": "11",
    "cn": "馬鈴薯餅",
    "pl": "Placki Ziemniaczane",
    "desc": "馬鈴薯刨絲混蛋液煎成酥脆，配酸奶油或匈牙利風味牛肉燉醬。"
  },
  {
    "n": "12",
    "cn": "野牛草伏特加",
    "pl": "Żubrówka",
    "desc": "比亞沃韋札森林野牛草浸泡，每瓶都有真草。經典喝法 Tatanka：配蘋果汁。"
  }
];

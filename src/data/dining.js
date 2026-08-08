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
    "perPerson": "290 / 360",
    "channel": "自家電話 +48 660 661 756 · ul. Bocheńska 5 · 平日另有單點，週末僅套餐"
  },
  {
    "restaurant": "⭐ Alon Omakase（華沙）",
    "perPerson": "~1100",
    "channel": "omakase.eu 線上 · 取消/減人照收全額 · Edomae 壽司"
  },
  {
    "restaurant": "⭐ Most（樂斯拉夫）",
    "perPerson": "490",
    "channel": "miedzy-mostami.pl · 僅週四–六 · 需訂金 · Księcia Witolda 1"
  },
  {
    "restaurant": "⭐ Muga（波茲南）",
    "perPerson": "390–540",
    "channel": "官網/電話 · 法系套餐"
  },
  {
    "restaurant": "⭐ NUTA（華沙）",
    "perPerson": "€€€€",
    "channel": "Michelin 線上/官網 · plac Trzech Krzyży（ETHOS）· 主廚 Andrea Camastra"
  },
  {
    "restaurant": "⭐ Rozbrat 20（華沙）",
    "perPerson": "€€€€",
    "channel": "rozbrat20.com.pl · 需信用卡 · +12.5% 服務費 · smart casual、12 歲以上"
  },
  {
    "restaurant": "⭐ BABA（樂斯拉夫）",
    "perPerson": "€€",
    "channel": "Michelin 免費線上 · Nożownicza 26 席 · 主廚 Beata Śniechowska"
  },
  {
    "restaurant": "Bib · Bufet KRK（克拉科夫）",
    "perPerson": "€€",
    "channel": "二星副牌 · 較好訂 · 訂不到二星的替代"
  },
  {
    "restaurant": "Bib · IDA kuchnia i wino（樂斯拉夫）",
    "perPerson": "149",
    "channel": "套餐含酒 · 全趟最高CP"
  }
];

// 僅收錄能由店家官網直接確認、且和本行程實際用餐有關的分店。
// 營業時間查證日：2026-08-08；餐廳仍可能臨時包場或調整，訂位頁優先。
export const verifiedRestaurantHours = [
  {
    city: '華沙',
    name: 'U Fukiera',
    address: 'Rynek Starego Miasta 27',
    hours: '週一–四 12:00–23:00；週五–六 12:00–23:30；週日 12:00–23:00',
    feature: '歷史老城波蘭料理；官網菜單可確認 żurek、餃子、鯡魚與韃靼牛肉。',
    url: 'https://www.ufukiera.pl/kontakt/',
  },
  {
    city: '華沙',
    name: 'Polka',
    address: 'Świętojańska 2（皇家城堡旁）',
    hours: '每日 12:00–22:00',
    feature: '傳統波蘭料理，位置最適合接皇家城堡；不是 U Fukiera 的同一間店。',
    url: 'https://warszawa.restauracjapolka.pl/about-us',
  },
  {
    city: '華沙',
    name: 'E.Wedel Pijalnia',
    address: 'Krakowskie Przedmieście 45',
    hours: '週一–四 10:00–22:00；週五–六 10:00–23:00；週日 10:00–22:00',
    feature: 'E.Wedel 巧克力飲品與甜點；已鎖定分店，避免套用商場分店的週日休店規則。',
    url: 'https://wedelpijalnie.pl/lokale',
  },
  {
    city: '樂斯拉夫',
    name: 'Konspira',
    address: 'Plac Solny 11',
    hours: '週一–四 13:00–23:45；週五–日 12:00–23:45；廚房至 23:00',
    feature: '傳統波蘭料理與 1980 年代反共地下運動主題空間；週五至日不接受一般訂位，依到店順序。',
    url: 'https://restauracjakonspira.pl/menu',
  },
];

export const cityDining = {
  "warsaw": [
    {
      "name": "Alon Omakase",
      "tier": "★4.8（134） ★ 新",
      "highlight": "2026 新一星 · 招牌：Edomae 握壽司 omakase，以頂級松露搭配見長 · 位少需早訂",
      "mapUrl": "https://maps.google.com/?cid=8029724309073713102"
    },
    {
      "name": "NUTA",
      "tier": "★4.8（505） ★",
      "highlight": "招牌：主廚 Andrea Camastra 創意套餐，義式底蘊融合亞洲香料，劇場式上菜 · 提前 3–5 週",
      "mapUrl": "https://maps.google.com/?cid=4624148008162643045"
    },
    {
      "name": "hub.praga",
      "tier": "★4.9（391） ★",
      "highlight": "招牌：Skrei 鱈魚配蘿蔔、海鮮冷盤、牛小排+螯蝦「海陸雙拼」 · Praga 區一星 · Day 7 順路升級",
      "mapUrl": "https://maps.google.com/?cid=10117754456971759897"
    },
    {
      "name": "Rozbrat 20",
      "tier": "★",
      "highlight": "招牌：多層次現代歐陸套餐（逾百種食材組合出的一致風味）· 提前 3–5 週 · 需信用卡 +12.5% 服務費",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Rozbrat%2020%20Warszawa"
    },
    {
      "name": "WANDAL",
      "tier": "★4.5（506） Bib 新",
      "highlight": "米其林 2026「年度開幕」· 招牌：顛覆式當代波蘭菜",
      "mapUrl": "https://maps.google.com/?cid=15993615675406452524"
    },
    {
      "name": "AHAAN",
      "tier": "Bib 新",
      "highlight": "招牌：泰式咖哩＋道地街頭辣度 · 泰國菜",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=AHAAN%20Warszawa"
    },
    {
      "name": "Ceviche Bar",
      "tier": "Bib",
      "highlight": "招牌：秘魯風 ceviche 生醃海鮮 · 南美料理",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Ceviche%20Bar%20Warszawa"
    },
    {
      "name": "Koneser Grill",
      "tier": "Bib",
      "highlight": "招牌：炭火牛排與燒烤 · Praga 區排隊牛排館",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Koneser%20Grill%20Warszawa"
    },
    {
      "name": "kontakt",
      "tier": "Bib",
      "highlight": "招牌：地中海風味時蔬與海鮮小盤",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=kontakt%20Warszawa"
    },
    {
      "name": "Le Braci",
      "tier": "Bib",
      "highlight": "招牌：義式手工麵食＋炭烤 · 義式小酒館",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Le%20Braci%20Warszawa"
    },
    {
      "name": "Wyraj",
      "tier": "Bib",
      "highlight": "招牌：時令波蘭傳統家常菜重製",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Wyraj%20Warszawa"
    },
    {
      "name": "Blisko Bar",
      "tier": "Bib 新",
      "highlight": "招牌：自然酒配精緻小酒館菜",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Blisko%20Bar%20Warszawa"
    },
    {
      "name": "Kieliszki na Próżnej",
      "tier": "Bib",
      "highlight": "招牌：酒杯小酌配歐陸小盤 · 酒吧型小酒館",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Kieliszki%20na%20Pr%C3%B3%C5%BCnej%20Warszawa"
    },
    {
      "name": "WIN wine bar & shop",
      "tier": "Bib 新",
      "highlight": "招牌：季節小盤配自然酒 · 酒鋪型餐酒館",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=WIN%20wine%20bar%20%26amp%3B%20shop%20Warszawa"
    },
    {
      "name": "Zagoździński",
      "tier": "★4.7（1,238） 甜點",
      "highlight": "招牌：pączki 玫瑰餡甜甜圈 · 1925 至今排隊名店（Górczewska）",
      "mapUrl": "https://maps.google.com/?cid=5270464504046978357"
    },
    {
      "name": "Gościniec / Zapiecek / u Kresowiaka",
      "tier": "餃子",
      "highlight": "招牌：手工 pierogi 餃子（肉餡／馬鈴薯起司／藍莓）· 名店（Nowy Świat / Koszykowa）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Go%C5%9Bciniec%20Warszawa"
    },
    {
      "name": "Bar Mleczny Rusałka",
      "tier": "★4.3（2,501） 牛奶吧",
      "highlight": "招牌：傳統家常套餐（湯＋主菜） · Praga · 一餐 25 PLN 內",
      "mapUrl": "https://maps.google.com/?cid=14427558643223382901"
    },
    {
      "name": "Sapko Kebab",
      "tier": "★4.6（高 則） 街食",
      "highlight": "招牌：土耳其 kebab，肉香四溢、份量足，在地口碑名店",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Sapko%20Kebab%20Warszawa"
    },
    {
      "name": "OKIENKO",
      "tier": "★4.5（2,154 則） 街食",
      "highlight": "招牌：比利時薯條配多款自製沾醬 · 窗口式外帶",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=OKIENKO%20Warszawa"
    },
    {
      "name": "Coś Na Ząbkowskiej",
      "tier": "★4.6（577 則） 在地",
      "highlight": "Praga 藝術區（Ząbkowska 9）· 招牌：波蘭家常菜現代詮釋",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Co%C5%9B%20Na%20Z%C4%85bkowskiej%20Warszawa"
    },
    {
      "name": "Hala Koszyki",
      "tier": "美食廣場",
      "highlight": "免訂位 · 多攤集合，可一次吃到多國小吃",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%20Warszawa"
    }
  ],
  "krakow": [
    {
      "name": "Bottiglieria 1881",
      "tier": "★4.6（1,056） ★★",
      "highlight": "全波蘭唯一二星(Kazimierz) · 招牌：波蘭×北歐兩套 tasting · 逾 500 款酒",
      "mapUrl": "https://maps.google.com/?cid=8570908113421134699"
    },
    {
      "name": "Folga",
      "tier": "★4.6（1,441） Bib",
      "highlight": "招牌：當代創意料理小盤 · 高CP",
      "mapUrl": "https://maps.google.com/?cid=7193800786272583343"
    },
    {
      "name": "MOLÁM",
      "tier": "★4.6（4,600） Bib",
      "highlight": "招牌：泰式烤全雞配糯米飯、khao soi 咖哩麵 · 道地泰式風味",
      "mapUrl": "https://maps.google.com/?cid=14914780693072191645"
    },
    {
      "name": "NOAH",
      "tier": "★4.7（1,150） Bib",
      "highlight": "招牌：以色列烤羊肉串配 pitta 餅 · 平價實惠",
      "mapUrl": "https://maps.google.com/?cid=6279990201826816109"
    },
    {
      "name": "Bufet KRK",
      "tier": "★4.6（1,071） Bib 新",
      "highlight": "二星 Bottiglieria 1881 的平價副牌 · 招牌：自製黑血腸（kaszanka）與炭烤精選肉品 · 訂不到二星的最佳替代",
      "mapUrl": "https://maps.google.com/?cid=861978380086701482"
    },
    {
      "name": "Nat Bistro",
      "tier": "★4.8（415） Bib 新",
      "highlight": "招牌：牛肉塔塔、鴨胸配時令蔬果 · 自然酒",
      "mapUrl": "https://maps.google.com/?cid=10025714057570046192"
    },
    {
      "name": "obwarzanek 麻花圈",
      "tier": "街食",
      "highlight": "PGI · 僅克拉科夫產 · 約 3 PLN · 藍色街車（Rynek 周邊、Tunel）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=obwarzanek%20%E9%BA%BB%E8%8A%B1%E5%9C%88%20Krak%C3%B3w"
    },
    {
      "name": "zapiekanka",
      "tier": "街食",
      "highlight": "Plac Nowy 圓亭攤（Kazimierz）· 夜宵經典（招牌 Endzior）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Plac%20Nowy%20zapiekanka%20Krak%C3%B3w"
    },
    {
      "name": "Mirror Bistro",
      "tier": "★4.7（7,485） 餃子",
      "highlight": "招牌：手工 pierogi 十種內餡任選＋白羅宋湯 · Kazimierz 高人氣早午餐",
      "mapUrl": "https://www.google.com/maps/place/?q=place_id:ChIJOwi62GpbFkcRoi0KiVCj1dk"
    },
    {
      "name": "Pierogi Szwedzkie Svensson",
      "tier": "★4.4（236） 餃子",
      "highlight": "Długa 58 · 招牌：大顆創意餡料餃子",
      "mapUrl": "https://maps.google.com/?cid=10705718930784059170"
    },
    {
      "name": "Bar Smak",
      "tier": "★4.6（3,014） 在地口碑",
      "highlight": "舊城（每天大排長龍）· 招牌：手工 pierogi＋馬鈴薯煎餅，份量大、道地家常味",
      "mapUrl": "https://maps.google.com/?cid=7513589258053856766"
    },
    {
      "name": "Hamsa",
      "tier": "★4.5（6,453） 在地口碑",
      "highlight": "Kazimierz（Szeroka 2）· 招牌：中東鷹嘴豆泥 hummus、falafel",
      "mapUrl": "https://maps.google.com/?cid=1317891001987072687"
    },
    {
      "name": "Bar Mleczny 牛奶吧",
      "tier": "牛奶吧",
      "highlight": "舊城／Kazimierz 多家 · 招牌：家常湯品與馬鈴薯煎餅 · 一餐 25 PLN 內",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20%E7%89%9B%E5%A5%B6%E5%90%A7%20Krak%C3%B3w"
    }
  ],
  "wroclaw": [
    {
      "name": "BABA",
      "tier": "★4.6（965） ★ 新",
      "highlight": "2025 Bib 升 2026 一星 · 主廚 Beata Śniechowska · 招牌：「Petit Bonbon」創意餃子、招牌肉卷（meatloaf）",
      "mapUrl": "https://maps.google.com/?cid=9335659011047272773"
    },
    {
      "name": "Most",
      "tier": "★4.7（479） ★ 新",
      "highlight": "2026 新一星 · 招牌：南瓜餡餃子配松露、鱈魚配醃紫洋蔥菇菌醬",
      "mapUrl": "https://maps.google.com/?cid=9490447263206449328"
    },
    {
      "name": "IDA kuchnia i wino",
      "tier": "★4.8（2,002） Bib",
      "highlight": "招牌：現代版 kopytka 馬鈴薯疙瘩、pierogi、żurek 酸湯 · 149 PLN 含酒套餐，高CP",
      "mapUrl": "https://maps.google.com/?cid=10589009865057440004"
    },
    {
      "name": "Tarasowa",
      "tier": "Bib",
      "highlight": "招牌：Złotnicka 豬肉、Zielenica 鱒魚卵 · 百年廳畔露台景觀",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Tarasowa%20Wroc%C5%82aw"
    },
    {
      "name": "Pijalni",
      "tier": "Bib 新",
      "highlight": "招牌：柴火慢烤季節料理 · 重味道、不花俏、自然酒選擇多",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Pijalni%20Wroc%C5%82aw"
    },
    {
      "name": "Restauracja Wrocławska",
      "tier": "在地",
      "highlight": "戰前風味 · 招牌：bigos 獵人燉菜、Silesian 餃",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Wroc%C5%82awska%20Wroc%C5%82aw"
    },
    {
      "name": "Piwnica Świdnicka",
      "tier": "歷史",
      "highlight": "市政廳地窖 · 歐洲最古老餐廳之一（1273）· 招牌：傳統燉肉與啤酒",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Piwnica%20%C5%9Awidnicka%20Wroc%C5%82aw"
    },
    {
      "name": "Miś SC",
      "tier": "★4.4（7,028） 牛奶吧",
      "highlight": "樂斯拉夫最有名的牛奶吧，招牌：pierogi、家常湯品，價格實惠、天天排隊",
      "mapUrl": "https://maps.google.com/?cid=9100083269168988599"
    },
    {
      "name": "Bar Witek",
      "tier": "★4.0（23 則） 街食",
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
    }
  ],
  "poznan": [
    {
      "name": "Muga",
      "tier": "★4.7（869） ★",
      "highlight": "波茲南首家、目前唯一一星 · 法系 · 招牌：時令 10–12 道套餐（如烤鴿配無花果）· 套餐 390–540 PLN",
      "mapUrl": "https://maps.google.com/?cid=2998937238608160974"
    },
    {
      "name": "Fromażeria",
      "tier": "Bib",
      "highlight": "招牌：起司主題料理，融合波蘭與地中海／黎凡特香料風味",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Froma%C5%BCeria%20Pozna%C5%84"
    },
    {
      "name": "Posto",
      "tier": "Bib",
      "highlight": "穀倉改建空間 · 招牌：czernina 鴨血湯、蝦仁干貝燉飯、法式肉派",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Posto%20Pozna%C5%84"
    },
    {
      "name": "SPOT.",
      "tier": "Bib",
      "highlight": "招牌：當代創意料理小盤",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=SPOT.%20Pozna%C5%84"
    },
    {
      "name": "TU.REStAURANT",
      "tier": "Bib",
      "highlight": "招牌：現代歐陸料理融合南歐香料",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=TU.REStAURANT%20Pozna%C5%84"
    },
    {
      "name": "rogal świętomarciński",
      "tier": "名物",
      "highlight": "PGI 聖馬丁可頌 · 白罌粟籽餡 · 四季有售 · Rogalowe Muzeum、Wise Cafe（Mercure 內）公認名版本",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=rogal%20%C5%9Bwi%C4%99tomarci%C5%84ski%20Pozna%C5%84"
    },
    {
      "name": "Na Winklu",
      "tier": "★4.8（3,222） 餃子",
      "highlight": "Śródka 區河畔 · 招牌：烤製版大顆 pierogi，外皮酥脆內餡多汁，在地人氣首選",
      "mapUrl": "https://maps.google.com/?cid=17998777227118824033"
    },
    {
      "name": "Pyra Bar",
      "tier": "在地",
      "highlight": "馬鈴薯專門 · 招牌：pyry s bzikiem 起司烤馬鈴薯",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Pyra%20Bar%20Pozna%C5%84"
    },
    {
      "name": "Hyćka",
      "tier": "傳統",
      "highlight": "大波蘭菜 · 招牌：烤鴨配 pyzy 蒸糰（Muga 主廚推薦）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Hy%C4%87ka%20Pozna%C5%84"
    },
    {
      "name": "Szarlotta",
      "tier": "★4.5（2,798） 在地口碑",
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

export const cityFood = [
  {
    "city": "華沙",
    "en": "Warszawa",
    "items": [
      {
        "tag": "美食市集",
        "name": "Hala Koszyki",
        "note": "百年美食市集",
        "book": "walk"
      },
      {
        "tag": "Pierogi",
        "name": "Zapiecek",
        "note": "老城多家分店",
        "book": "walk"
      },
      {
        "tag": "熱巧克力",
        "name": "E. Wedel Pijalnia",
        "note": "蕭邦曾常去",
        "book": "queue"
      },
      {
        "tag": "米其林必比登",
        "name": "U Fukiera / Polka",
        "note": "Żurek 麵包碗",
        "book": "must"
      },
      {
        "tag": "牛奶吧",
        "name": "Bar Prasowy",
        "note": "套餐 PLN 25–35",
        "book": "walk"
      },
      {
        "tag": "Pączki",
        "name": "A. Blikle",
        "note": "1869 年老字號",
        "book": "queue"
      },
      {
        "tag": "河畔酒吧",
        "name": "Plaża Poniatówka",
        "note": "維斯瓦河畔沙灘酒吧，日落後氣氛佳",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Plaza+Poniatowka+Warszawa"
      },
      {
        "tag": "猶太料理",
        "name": "Beit Warszawa 周邊小館",
        "note": "POLIN 附近，可接續博物館主題",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=POLIN+Museum+restaurants+Warszawa"
      },
      {
        "tag": "精釀啤酒",
        "name": "Warszawski Klub Piwoszy",
        "note": "老城周邊，適合最後一晚小酌",
        "book": "walk"
      },
      {
        "tag": "伴手甜點",
        "name": "Cukiernia Pawełek",
        "note": "手工巧克力與糖果，適合最後採買",
        "book": "walk"
      },
      {
        "tag": "年度開幕獎 2026",
        "name": "WANDAL",
        "note": "必比登 · 顛覆式波蘭菜，Day 7 晚餐候選",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=WANDAL+restauracja+Warszawa"
      }
    ]
  },
  {
    "city": "克拉科夫",
    "en": "Kraków",
    "items": [
      {
        "tag": "米其林必比登",
        "name": "Starka / Szara Gęś",
        "note": "Kazimierz 與廣場",
        "book": "must"
      },
      {
        "tag": "地窖晚餐",
        "name": "Pod Aniołami",
        "note": "燭光氛圍",
        "book": "must"
      },
      {
        "tag": "文青早午餐",
        "name": "Charlotte",
        "note": "Plac Szczepański",
        "book": "queue"
      },
      {
        "tag": "猶太料理",
        "name": "Hamsa / Klezmer-Hois",
        "note": "Kazimierz",
        "book": "walk"
      },
      {
        "tag": "Pierogi",
        "name": "Pierogarnia Krakowiacy",
        "note": "老城手工餃子",
        "book": "walk"
      },
      {
        "tag": "Zapiekanka",
        "name": "Plac Nowy 圓亭",
        "note": "Endzior / Krzysiek",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Plac+Nowy+Okraglak+Krakow"
      },
      {
        "tag": "米其林二星",
        "name": "Bottiglieria 1881",
        "note": "2026 連續第四年二星 · 全波蘭唯一 · 需提前 2 週+ 訂位",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Bottiglieria+1881+Krakow"
      },
      {
        "tag": "Sernik",
        "name": "Cukiernia Michałek",
        "note": "百年甜點老店",
        "book": "walk"
      },
      {
        "tag": "必比登 2026",
        "name": "Bufet KRK",
        "note": "Bottiglieria 1881 平價副牌，免長預約",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Bufet+KRK+Krakow"
      },
      {
        "tag": "必比登 2026",
        "name": "Nat Bistro",
        "note": "年度青年主廚獎 Ida Malec · 自然酒",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Nat+Bistro+Krakow"
      }
    ]
  },
  {
    "city": "樂斯拉夫",
    "en": "Wrocław",
    "items": [
      {
        "tag": "西里西亞",
        "name": "Konspira",
        "note": "80 年代反共主題",
        "book": "walk"
      },
      {
        "tag": "Pierogi",
        "name": "Pierogarnia Stary Młyn",
        "note": "廣場旁",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Stary+Mlyn+Wroclaw"
      },
      {
        "tag": "融合料理",
        "name": "Karczma Lwowska",
        "note": "波蘭/烏克蘭",
        "book": "walk"
      },
      {
        "tag": "市場午餐",
        "name": "Hala Targowa",
        "note": "PLN 20–30",
        "book": "walk"
      },
      {
        "tag": "精釀啤酒",
        "name": "Browar Stu Mostów",
        "note": "旗艦廠",
        "book": "walk"
      },
      {
        "tag": "米其林必比登",
        "name": "Pod Fredrą / Jadka",
        "note": "廣場旁傳統",
        "book": "must"
      },
      {
        "tag": "米其林一星 2026",
        "name": "BABA",
        "note": "新升星 · 波蘭菜當代詮釋，午間較易訂",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=BABA+restauracja+Wroclaw"
      },
      {
        "tag": "必比登 2026",
        "name": "Pijalni",
        "note": "重風味輕形式",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pijalni+Wroclaw"
      }
    ]
  },
  {
    "city": "波茲南",
    "en": "Poznań",
    "items": [
      {
        "tag": "Lech 啤酒",
        "name": "Stary Browar",
        "note": "古釀酒廠改造",
        "book": "walk"
      },
      {
        "tag": "燒烤",
        "name": "Whiskey In The Jar",
        "note": "燒烤名店",
        "book": "must"
      },
      {
        "tag": "PGI 牛角",
        "name": "Cukiernia Kandulski",
        "note": "百年老店",
        "book": "queue"
      },
      {
        "tag": "家常",
        "name": "Pyra Bar",
        "note": "馬鈴薯佐凝乳",
        "book": "walk"
      },
      {
        "tag": "歷史名宅",
        "name": "Hotel Bazar",
        "note": "蕭邦曾下榻",
        "book": "walk"
      },
      {
        "tag": "重口味",
        "name": "Stary Maglownik",
        "note": "鴨血酸湯",
        "book": "walk"
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
        "tag": "必比登備案",
        "name": "Kieliszki na Próżnej",
        "note": "酒杯牆名店 · 波蘭菜配酒，WANDAL 訂不到的首替",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Kieliszki+na+Proznej+Warszawa"
      },
      {
        "tag": "必比登備案",
        "name": "kontakt",
        "note": "小館精緻路線，座位少",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=kontakt+restauracja+Warszawa"
      },
      {
        "tag": "必比登備案",
        "name": "Wyraj",
        "note": "斯拉夫傳統食材當代化",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Wyraj+restauracja+Warszawa"
      },
      {
        "tag": "傳統備案",
        "name": "Stary Dom",
        "note": "老派滿漢波蘭菜 · 韃靼牛肉名店，離市中心稍遠",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Restauracja+Stary+Dom+Warszawa"
      },
      {
        "tag": "傳統備案",
        "name": "Podwale 25",
        "note": "啤酒館巨無霸豬腳 · 老城旁 · 氣氛熱鬧",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Podwale+25+Kompania+Piwna+Warszawa"
      },
      {
        "tag": "牛奶吧備案",
        "name": "Bar Mleczny Familijny",
        "note": "Nowy Świat 上 · Bar Prasowy 排隊時的替代",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Bar+Mleczny+Familijny+Nowy+Swiat+Warszawa"
      },
      {
        "tag": "Praga 區",
        "name": "Pyzy Flaki Gorące",
        "note": "玻璃罐裝 pyzy 馬鈴薯糰 · Day 7 Praga 行程順路",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Pyzy+Flaki+Gorace+Warszawa"
      },
      {
        "tag": "甜點備案",
        "name": "Lukullus",
        "note": "新派法波混血甜點房，多分店",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Cukiernia+Lukullus+Warszawa"
      },
      {
        "tag": "快食備案",
        "name": "Manekin",
        "note": "波蘭可麗餅 naleśniki 專門店 · 平價大份",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Manekin+Warszawa"
      }
    ]
  },
  {
    "city": "克拉科夫",
    "en": "Kraków",
    "items": [
      {
        "tag": "必比登備案",
        "name": "NOAH",
        "note": "Kazimierz 以色列菜 · Hamsa 滿座時的替代",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=NOAH+restaurant+Krakow"
      },
      {
        "tag": "必比登備案",
        "name": "MOLÁM",
        "note": "泰菜 · 連日波蘭菜吃膩時的出口",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=MOLAM+Krakow"
      },
      {
        "tag": "必比登備案",
        "name": "Folga",
        "note": "波蘭菜輕盈版 · 價格友善",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Folga+restauracja+Krakow"
      },
      {
        "tag": "傳統備案",
        "name": "Morskie Oko",
        "note": "塔特拉山區高地菜 · 烤 oscypek 與烤肉 · 現場民俗樂",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Morskie+Oko+restauracja+Krakow"
      },
      {
        "tag": "傳統備案",
        "name": "Miód Malina",
        "note": "「蜂蜜覆盆子」· 廣場旁氣氛店，觀光但穩定",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Miod+Malina+Krakow"
      },
      {
        "tag": "傳統備案",
        "name": "Pod Wawelem",
        "note": "城堡腳下啤酒館 · 巨份炸豬排，快食快走",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Pod+Wawelem+Kompania+Kuflowa+Krakow"
      },
      {
        "tag": "家常備案",
        "name": "Kuchnia u Doroty",
        "note": "Kazimierz 在地家常 · 波蘭媽媽味 · 平價",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Kuchnia+u+Doroty+Krakow"
      },
      {
        "tag": "Pierogi 備案",
        "name": "Przystanek Pierogarnia",
        "note": "現包現煮小店 · Pierogarnia Krakowiacy 排隊時替代",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Przystanek+Pierogarnia+Krakow"
      },
      {
        "tag": "咖啡甜點",
        "name": "Cafe Camelot",
        "note": "老城巷內百年氛圍 · szarlotka 蘋果派",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Cafe+Camelot+Krakow"
      },
      {
        "tag": "冰淇淋",
        "name": "Good Lood",
        "note": "克拉科夫現象級冰淇淋 · 每日限定口味",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Good+Lood+Krakow"
      }
    ]
  },
  {
    "city": "樂斯拉夫",
    "en": "Wrocław",
    "items": [
      {
        "tag": "米其林一星 2026",
        "name": "Most",
        "note": "BABA 之外的另一顆新星 · 兩者擇一卡位即可",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Most+restauracja+Wroclaw"
      },
      {
        "tag": "必比登備案",
        "name": "IDA kuchnia i wino",
        "note": "區域波蘭菜配酒 · 老城 Łazienna 街",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=IDA+kuchnia+i+wino+Wroclaw"
      },
      {
        "tag": "必比登備案",
        "name": "Tarasowa",
        "note": "河景露台 · 天氣好時首選",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Tarasowa+restauracja+Wroclaw"
      },
      {
        "tag": "傳統備案",
        "name": "Kurna Chata",
        "note": "民俗風家常波蘭菜 · 廣場旁 · 平價大份",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Kurna+Chata+Wroclaw"
      },
      {
        "tag": "廣場備案",
        "name": "Bernard",
        "note": "捷克餐酒館 · 廣場直視座位 · 營業時間長",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Bernard+restauracja+Rynek+Wroclaw"
      },
      {
        "tag": "快食備案",
        "name": "Pierogarnia Stary Młyn（二店）",
        "note": "主店客滿時問二店或外帶",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Stary+Mlyn+Wroclaw"
      }
    ]
  },
  {
    "city": "波茲南",
    "en": "Poznań",
    "items": [
      {
        "tag": "米其林一星",
        "name": "Muga",
        "note": "波茲南唯一星級 · 想升級 Day 6 午餐的天花板選項",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Muga+restauracja+Poznan"
      },
      {
        "tag": "必比登備案",
        "name": "SPOT.",
        "note": "咖啡烘焙起家的現代小館",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=SPOT+restauracja+Poznan"
      },
      {
        "tag": "必比登備案",
        "name": "Fromażeria",
        "note": "起司主題 · 酒配起司輕食",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Fromazeria+Poznan"
      },
      {
        "tag": "必比登備案",
        "name": "Posto",
        "note": "義大利菜 · 波蘭菜吃膩時的出口",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Posto+restauracja+Poznan"
      },
      {
        "tag": "傳統備案",
        "name": "Ratuszova",
        "note": "市政廳正對面地窖餐廳 · 看完山羊直接下樓",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Ratuszova+Poznan"
      },
      {
        "tag": "傳統備案",
        "name": "Brovaria",
        "note": "Stary Rynek 上的自釀啤酒餐廳 · 順路一杯",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Brovaria+Poznan"
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

// 本檔整合 poland-travel-guide-final.html 的 2026 餐飲資料，
// 以及 redesign/data.js 的行程餐廳與必吃清單。
// 由來源機械轉錄，頁面模板不得另行寫死餐飲內容。
//
// 2026-09-14 精煉與整併：城市頁原本有「行程主餐廳推薦」「備案餐廳」「小吃 · 牛奶吧 · 咖啡廳」
// 三個區塊，前兩者是兩份互相重複的清單（NOAH／MOLÁM／Most／Muga 等十餘家兩邊都有）。
// 三塊已整併為單一張「行程餐廳推薦」表，由 templates/city-dining.mjs 的 mergeCityDining()
// 把 cityDining、cityFood、snacksAndCafes 與 day-dining.js 的候選合成一份、同店只留一列。
// `foodBackup` 匯出不再存在，備案併入 cityFood 並以 role: 'primary' / 'backup' 區分；
// snacksAndCafes 仍是獨立資料來源，在表中標為 role: 'snack'。
// 保留標準：① 你的候選（day-dining.js）② 米其林星級／必比登
// ③ 各分類代表（餃子、牛奶吧、市集、甜點）④ 首選訂不到時真的會改去的備案。
// 沒有固定店址的品項（obwarzanek、jagodzianka 等）交給每日「順路必吃」處理，不佔餐廳列。

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
      "name": "NUTA",
      "tier": "★",
      "highlight": "招牌：主廚 Andrea Camastra 創意套餐，義式底蘊融合亞洲香料，劇場式上菜 · 提前 3–5 週",
      "mapUrl": "https://maps.google.com/?cid=4624148008162643045"
    },
    {
      "name": "Wyraj",
      "tier": "Bib",
      "highlight": "招牌：時令波蘭傳統家常菜重製",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Wyraj%20Warszawa"
    },
    {
      "name": "WANDAL",
      "tier": "Bib · 2026 新",
      "highlight": "米其林 2026「年度開幕」· 招牌：顛覆式當代波蘭菜",
      "mapUrl": "https://maps.google.com/?cid=15993615675406452524"
    },
    {
      "name": "Kieliszki na Próżnej",
      "tier": "Bib",
      "highlight": "招牌：酒杯小酌配歐陸小盤 · 酒吧型小酒館",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Kieliszki%20na%20Pr%C3%B3%C5%BCnej%20Warszawa"
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
      "tier": "★★",
      "highlight": "全波蘭唯一二星(Kazimierz) · 招牌：波蘭×北歐兩套 tasting · 逾 500 款酒",
      "mapUrl": "https://maps.google.com/?cid=8570908113421134699"
    },
    {
      "name": "Folga",
      "tier": "Bib",
      "highlight": "招牌：當代創意料理小盤 · 高CP",
      "mapUrl": "https://maps.google.com/?cid=7193800786272583343"
    },
    {
      "name": "NOAH",
      "tier": "Bib",
      "highlight": "招牌：以色列烤羊肉串配 pitta 餅 · 平價實惠",
      "mapUrl": "https://maps.google.com/?cid=6279990201826816109"
    },
    {
      "name": "Hamsa",
      "tier": "在地候選",
      "highlight": "Kazimierz（Szeroka 2）· 招牌：中東鷹嘴豆泥 hummus、falafel",
      "mapUrl": "https://maps.google.com/?cid=1317891001987072687"
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
    }
  ],
  "wroclaw": [
    {
      "name": "BABA",
      "tier": "★ · 2026 新",
      "highlight": "2025 Bib 升 2026 一星 · 主廚 Beata Śniechowska · 招牌：「Petit Bonbon」創意餃子、招牌肉卷（meatloaf）",
      "mapUrl": "https://maps.google.com/?cid=9335659011047272773"
    },
    {
      "name": "IDA kuchnia i wino",
      "tier": "Bib",
      "highlight": "招牌：現代版 kopytka 馬鈴薯疙瘩、pierogi、żurek 酸湯 · 149 PLN 含酒套餐，高CP",
      "mapUrl": "https://maps.google.com/?cid=10589009865057440004"
    },
    {
      "name": "Restauracja Wrocławska",
      "tier": "在地",
      "highlight": "戰前風味 · 招牌：bigos 獵人燉菜、Silesian 餃 · 週三 12:00–22:00（多來源一致，非官網一手，行前電話確認）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Wroc%C5%82awska%20Wroc%C5%82aw"
    },
    {
      "name": "Piwnica Świdnicka",
      "tier": "歷史",
      "highlight": "市政廳地窖 · 歐洲最古老餐廳之一（1273）· 招牌：傳統燉肉與啤酒",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Piwnica%20%C5%9Awidnicka%20Wroc%C5%82aw"
    }
  ],
  "poznan": [
    {
      "name": "Muga",
      "tier": "★",
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
      "name": "SPOT.",
      "tier": "Bib",
      "highlight": "招牌：當代創意料理小盤",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=SPOT.%20Pozna%C5%84"
    },
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
      "name": "Hyćka",
      "tier": "傳統",
      "highlight": "大波蘭菜 · 招牌：烤鴨配 pyzy 蒸糰（Muga 主廚推薦）",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Hy%C4%87ka%20Pozna%C5%84"
    },
    {
      "name": "Pyra Bar",
      "tier": "在地",
      "highlight": "馬鈴薯專門 · 招牌：pyry s bzikiem 起司烤馬鈴薯 · 週四 11:00–21:00",
      "mapUrl": "https://www.google.com/maps/search/?api=1&query=Pyra%20Bar%20Pozna%C5%84"
    }
  ]
};

// 2026-09-09 新增：小吃、牛奶吧與咖啡廳推薦。
// 2026-09-14 起併入城市頁的「行程餐廳推薦」表，標為 role: 'snack'，不再有獨立區塊。
// 每筆都必須有可點的 Google Maps 連結；營業時間屬動態資料，只寫查得到來源的，並要求出發前重查。
export const snacksAndCafes = {
  warsaw: [
    {name:'Bar Mleczny Prasowy', type:'牛奶吧', note:'1954 年開業的華沙老牌牛奶吧，żurek、pierogi、炸豬排都是銅板價。距 Hotel Metropol 沿 Marszałkowska 步行約 5 分鐘，是最順路的一餐；Day 8 早餐備案。', hours:'多數來源每日 08:00–20:00，少數來源說 09:00 才開，行前電話 666 353 776 確認', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Prasowy%2C%20Marsza%C5%82kowska%2010%2F16%2C%20Warszawa'},
    {name:'Bar Mleczny Bambino', type:'牛奶吧', note:'1959 年開業，公認華沙最「體面」的牛奶吧，內裝與菜單維持舊時樣貌。2026 年公開資料列一–五 08:00–20:00、週末 09:00–18:00；不同來源對門牌有 Hoża 19 與 Krucza 21 兩說，出發前用地圖確認分店。', hours:'一–五 08:00–20:00、六日 09:00–18:00（公開資料，出發前重查）', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Bambino%20Warszawa'},
    {name:'A. Blikle 1869', type:'甜點 · 咖啡', note:'1869 年創立的波蘭國民甜點店，pączki 玫瑰果醬甜甜圈是招牌。Nowy Świat 本店距飯店步行約 15 分，Day 7 老城行程順路；09:00 開門，退房前想買 pączki 帶走可繞去，不適合當 Day 8 早餐主位。', hours:'每日 09:00–21:00（官網確認）', map:'https://www.google.com/maps/search/?api=1&query=A.Blikle%2C%20Nowy%20%C5%9Awiat%2033%2C%20Warszawa'},
    {name:'Cukiernia Zagoździński', type:'甜點', note:'1925 年開業的老派甜甜圈店，被在地人視為華沙 pączek 標準答案；位在 Wola 區 Górczewska 15，需搭電車前往，適合有半天餘裕時安排。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia%20Zago%C5%BAdzi%C5%84ski%2C%20G%C3%B3rczewska%2015%2C%20Warszawa'},
    {name:'Café Bristol', type:'咖啡 · 輕食', note:'Krakowskie Przedmieście（Hotel Bristol 內），Day 7 城堡→POLIN 途中順路輕食、Day 8 早餐主位。', hours:'每日 08:00–20:00；週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認', map:'https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Bristol%20Krakowskie%20Przedmie%C5%9Bcie%2042/44%2C%20Warszawa'},
    {name:'Hala Koszyki', type:'美食大廳 · 宵夜', note:'百年市集改建的美食大廳，公告營業至凌晨 1:00，Day 6 晚班抵達後最好用的宵夜選項；距飯店步行約 10–15 分。', hours:'公告一–六 08:00–01:00、日 09:00–01:00（出發前重查）', map:'https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa'},
  ],
  krakow: [
    {name:'Bar Mleczny Pod Temidą', type:'牛奶吧', note:'Grodzka 43，老城區最方便的牛奶吧，pierogi、湯品與馬鈴薯煎餅都便宜；Day 2 11:30 午餐已排在這裡。', hours:'官網每日 09:00–20:00，惟部分來源說週末公休，行前電話 12 422 08 74 確認', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Pod%20Temid%C4%85%2C%20Grodzka%2043%2C%20Krak%C3%B3w'},
    {name:'Endzior · Plac Nowy 圓亭', type:'小吃 · zapiekanka', note:'Kazimierz 圓亭（Okrąglak）內的 zapiekanka 名攤，長棍麵包烤蘑菇起司，PLN 18–25；Day 2 晚餐後可繞來吃。', hours:'圓亭各攤營業到深夜，個別攤位時間不同', map:'https://www.google.com/maps/search/?api=1&query=Endzior%20Plac%20Nowy%20Krak%C3%B3w'},
    {name:'Karma Coffee Roasters', type:'精品咖啡', note:'2010 年開業，克拉科夫第一家精品咖啡店，Kazimierz 自家烘豆。公開資料列一–五 08:00–20:00、六日 10:00–19:00。', hours:'一–五 08:00–20:00、六日 10:00–19:00（公開資料，出發前重查）', map:'https://www.google.com/maps/search/?api=1&query=Karma%20Coffee%20Krupnicza%20Krak%C3%B3w'},
    {name:'Café Camelot', type:'咖啡廳', note:'老城區老牌文青咖啡館，距中央廣場數步，復古內裝、地窖有卡巴萊表演；適合 Day 4 採購後歇腳。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Cafe%20Camelot%2C%20%C5%9Aw.%20Tomasza%2017%2C%20Krak%C3%B3w'},
    {name:'Cukiernia Michałek', type:'甜點', note:'在地人推薦的 sernik（波蘭起司蛋糕）與傳統甜點；Day 4 已列為順路必吃。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia%20Micha%C5%82ek%20Krak%C3%B3w'},
  ],
  wroclaw: [
    {name:'Bar Mleczny Miś', type:'牛奶吧', note:'Kuźnicza 48，樂斯拉夫最知名的牛奶吧，營運逾 50 年；湯約 3–6 PLN、主菜 12–25 PLN。**週日公休**，本行程 10/28（三）可用。', hours:'一–五 07:00–18:00、六 08:00–17:00、日休（2026 公開資料，出發前重查）', map:'https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Mi%C5%9B%2C%20Ku%C5%BAnicza%2048%2C%20Wroc%C5%82aw'},
    {name:'Vincent · Kazimierza Wielkiego 甜點', type:'甜點 · 咖啡', note:'老城區連鎖甜點咖啡館，蛋糕櫃選擇多，適合小矮人散步途中補糖。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia%20Vincent%20Wroc%C5%82aw'},
    {name:'Konspira', type:'傳統小館', note:'Plac Solny 11，1980 年代地下反共運動主題餐廳，Śląskie kluski 等傳統菜；週五至日不接受訂位、依到店順序。現為備案（Day 5 午餐主位改 Restauracja Wrocławska）。', hours:'一–四 13:00–23:45、五–日 12:00–23:45（廚房至 23:00）；惟週三開門時間另有來源說是 12:00，資料不一，行前電話 796 326 600 確認', map:'https://www.google.com/maps/search/?api=1&query=Konspira%2C%20Plac%20Solny%2011%2C%20Wroc%C5%82aw'},
    {name:'Browar Stu Mostów', type:'精釀啤酒', note:'樂斯拉夫代表性精釀酒廠，不喝酒可略過。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Browar%20Stu%20Most%C3%B3w%20Wroc%C5%82aw'},
    {name:'El Gato Specialty Coffee', type:'咖啡 · 精品咖啡', note:'Odrzańska 8，Day 5 午餐後咖啡，樂斯拉夫精品咖啡選項。', hours:'一–五 09:00–18:00、六日 10:00–18:00', map:'https://www.google.com/maps/search/?api=1&query=El%20Gato%20Specialty%20Coffee%20Roasters%20Odrza%C5%84ska%208/1%2C%20Wroc%C5%82aw'},
    {name:'Dessert Boutique', type:'甜點', note:'Świętego Mikołaja 43，Day 5 甜點候選，樂斯拉夫精緻歐式甜點店。', hours:'二–五 12:00–19:00、六日 11:00–20:00', map:'https://www.google.com/maps/search/?api=1&query=Dessert%20Boutique%20%C5%9Awi%C4%99tego%20Miko%C5%82aja%2043%2C%20Wroc%C5%82aw'},
  ],
  poznan: [
    {name:'Cukiernia Kandulski', type:'甜點 · rogal', note:'聖馬丁牛角麵包（PGI）認證店家之一，Day 6 12:15 已列為順路必吃；認證店家眾多，也可依官方認證名單就近選。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Cukiernia%20Kandulski%20Pozna%C5%84'},
    {name:'Pyra Bar', type:'小吃 · 在地菜', note:'以大波蘭特色的 pyry z gzikiem（水煮馬鈴薯配 twaróg 起司醬）聞名，價位親民；Day 6 12:30 午餐首選。', hours:'一–四 11:00–21:00、五六 11:00–23:00、日 11:00–21:00', map:'https://www.google.com/maps/search/?api=1&query=Pyra%20Bar%20Pozna%C5%84'},
    {name:'Weranda Caffe', type:'咖啡廳 · 早午餐', note:'Świętosławska 10，就在舊城市場旁，庭院座位安靜，常被列入波茲南最佳早餐；Day 6 等 12:00 山羊鐘樓秀前可先坐。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Weranda%20Caffe%2C%20%C5%9Awi%C4%99tos%C5%82awska%2010%2C%20Pozna%C5%84'},
    {name:'Pijalnia Czekolady E.Wedel · Stary Rynek', type:'熱巧克力', note:'舊城市場上的 Wedel 巧克力沙龍，雨天或等表演時的室內選擇。', hours:'依店家當日公告', map:'https://www.google.com/maps/search/?api=1&query=Pijalnia%20Czekolady%20E.Wedel%20Stary%20Rynek%20Pozna%C5%84'},
  ],
};

// 城市餐廳清單：role 為 primary（主推）或 backup（首選訂不到時的替代）。
export const cityFood = [
  {
    "city": "華沙",
    "en": "Warszawa",
    "items": [
      {
        "tag": "美食市集",
        "name": "Hala Koszyki",
        "note": "百年美食市集",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Hala+Koszyki+Warszawa",
        "role": "primary"
      },
      {
        "tag": "Pierogi",
        "name": "Zapiecek",
        "note": "老城多家分店",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Zapiecek+Polskie+Pierogarnie+Warszawa",
        "role": "primary"
      },
      {
        "tag": "熱巧克力",
        "name": "E. Wedel Pijalnia",
        "note": "1851 年創立的華沙巧克力老牌，招牌是濃稠熱巧克力",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Pijalnia+Czekolady+E.Wedel+Warszawa",
        "role": "primary"
      },
      {
        "tag": "老城經典",
        "name": "U Fukiera / Polka",
        "note": "Żurek 麵包碗；兩家皆非米其林必比登名單，屬觀光區老牌波蘭餐廳",
        "book": "must",
        "maps": [
          {
            "name": "U Fukiera",
            "url": "https://www.google.com/maps/search/?api=1&query=U+Fukiera+Warszawa"
          },
          {
            "name": "Polka",
            "url": "https://www.google.com/maps/search/?api=1&query=Restauracja+Polka+Warszawa"
          }
        ],
        "role": "primary"
      },
      {
        "tag": "年度開幕獎 2026",
        "name": "WANDAL",
        "note": "必比登 · 顛覆式波蘭菜，Day 7 晚餐候選",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=WANDAL+restauracja+Warszawa",
        "role": "primary"
      },
      {
        "tag": "必比登備案",
        "name": "Kieliszki na Próżnej",
        "note": "酒杯牆名店 · 波蘭菜配酒，WANDAL 訂不到的首替",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Kieliszki+na+Proznej+Warszawa",
        "role": "backup"
      },
      {
        "tag": "傳統備案",
        "name": "Stary Dom",
        "note": "老派滿漢波蘭菜 · 韃靼牛肉名店，離市中心稍遠",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Restauracja+Stary+Dom+Warszawa",
        "role": "backup"
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
        "book": "must",
        "maps": [
          {
            "name": "Starka",
            "url": "https://www.google.com/maps/search/?api=1&query=Starka+Restauracja+Krakow"
          },
          {
            "name": "Szara Gęś",
            "url": "https://www.google.com/maps/search/?api=1&query=Szara+Ges+w+Kuchni+Krakow"
          }
        ],
        "role": "primary"
      },
      {
        "tag": "地窖晚餐",
        "name": "Pod Aniołami",
        "note": "燭光氛圍",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Pod+Aniolami+Krakow",
        "role": "primary"
      },
      {
        "tag": "猶太料理",
        "name": "Hamsa / Klezmer-Hois",
        "note": "Kazimierz",
        "book": "walk",
        "maps": [
          {
            "name": "Hamsa",
            "url": "https://www.google.com/maps/search/?api=1&query=Hamsa+Hummus+and+Happiness+Krakow"
          },
          {
            "name": "Klezmer-Hois",
            "url": "https://www.google.com/maps/search/?api=1&query=Klezmer-Hois+Krakow"
          }
        ],
        "role": "primary"
      },
      {
        "tag": "Pierogi",
        "name": "Pierogarnia Krakowiacy",
        "note": "老城手工餃子",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Krakowiacy+Krakow",
        "role": "primary"
      },
      {
        "tag": "Pierogi",
        "name": "Pierożki u Vincenta",
        "note": "Kazimierz 小店，份量與價位親民，適合不想走遠的安靜一餐；Day 4 列為順路必吃。",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Piero%C5%BCki%20u%20Vincenta%2C%20B%C5%82ogos%C5%82awionej%20Bronis%C5%82awy%2C%20Krak%C3%B3w",
        "role": "primary"
      },
      {
        "tag": "Zapiekanka",
        "name": "Okrąglak（Plac Nowy 圓亭）",
        "note": "plac Nowy 4B · 多家 zapiekanka 窗口；Day 2 晚餐順路",
        "book": "queue",
        "map": "https://maps.app.goo.gl/2Nitej5cqG4VAcbp6?g_st=il",
        "role": "primary"
      },
      {
        "tag": "波蘭料理",
        "name": "Szalone Widelce",
        "note": "Szpitalna 40 · 老城東側，可接中央市集廣場",
        "book": "queue",
        "map": "https://maps.app.goo.gl/U3yMsjdSgM3Pwgqe9?g_st=il",
        "role": "primary"
      },
      {
        "tag": "牛奶吧",
        "name": "Bar Mleczny Pod Temidą",
        "note": "Grodzka 43 · 中央廣場往 Wawel 的順路平價選擇",
        "book": "queue",
        "map": "https://maps.app.goo.gl/xCGDapoy56MBvg2y7?g_st=il",
        "role": "primary"
      },
      {
        "tag": "米其林二星",
        "name": "Bottiglieria 1881",
        "note": "2026 連續第四年二星 · 全波蘭唯一 · 需提前 2 週+ 訂位",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Bottiglieria+1881+Krakow",
        "role": "primary"
      },
      {
        "tag": "傳統備案",
        "name": "Miód Malina",
        "note": "「蜂蜜覆盆子」· 廣場旁氣氛店，觀光但穩定",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Miod+Malina+Krakow",
        "role": "backup"
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
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Konspira+Wroclaw",
        "role": "primary"
      },
      {
        "tag": "Pierogi",
        "name": "Pierogarnia Stary Młyn",
        "note": "廣場旁",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Stary+Mlyn+Wroclaw",
        "role": "primary"
      },
      {
        "tag": "市場午餐",
        "name": "Hala Targowa",
        "note": "PLN 20–30",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Hala+Targowa+Wroclaw",
        "role": "primary"
      },
      {
        "tag": "米其林必比登",
        "name": "Pod Fredrą / Jadka",
        "note": "廣場旁傳統",
        "book": "must",
        "maps": [
          {
            "name": "Pod Fredrą",
            "url": "https://www.google.com/maps/search/?api=1&query=Restauracja+Pod+Fredra+Wroclaw"
          },
          {
            "name": "Jadka",
            "url": "https://www.google.com/maps/search/?api=1&query=Jadka+Wroclaw"
          }
        ],
        "role": "primary"
      },
      {
        "tag": "米其林一星 2026",
        "name": "BABA",
        "note": "新升星 · 波蘭菜當代詮釋，午間較易訂",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=BABA+restauracja+Wroclaw",
        "role": "primary"
      },
      {
        "tag": "傳統備案",
        "name": "Kurna Chata",
        "note": "民俗風家常波蘭菜 · 廣場旁 · 平價大份",
        "book": "queue",
        "map": "https://www.google.com/maps/search/?api=1&query=Kurna+Chata+Wroclaw",
        "role": "backup"
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
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Stary+Browar+Poznan",
        "role": "primary"
      },
      {
        "tag": "燒烤",
        "name": "Whiskey In The Jar",
        "note": "燒烤名店",
        "book": "must",
        "map": "https://www.google.com/maps/search/?api=1&query=Whiskey+in+the+Jar+Poznan",
        "role": "primary"
      },
      {
        "tag": "歷史名宅",
        "name": "Hotel Bazar",
        "note": "1918 年帕德瑞夫斯基陽台演說與大波蘭起義的重要歷史地點",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Hotel+Bazar+Poznan",
        "role": "primary"
      },
      {
        "tag": "家常",
        "name": "Pyra Bar",
        "note": "馬鈴薯佐凝乳",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Pyra+Bar+Poznan",
        "role": "primary"
      },
      {
        "tag": "傳統備案",
        "name": "Brovaria",
        "note": "Stary Rynek 上的自釀啤酒餐廳 · 順路一杯",
        "book": "walk",
        "map": "https://www.google.com/maps/search/?api=1&query=Brovaria+Poznan",
        "role": "backup"
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

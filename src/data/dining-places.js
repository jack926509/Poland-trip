// 門市主檔：地址、導航、營業時間與查核證據只在這裡維護。
// booking（選填）：required 必訂｜recommended 建議訂｜walk-in 免訂｜booked 已訂。
// 只在店家說明或官方資料有明確依據時才填；沒有依據就不加欄位（不顯示徽章）。目前全部尚未訂位，不得填 booked。
export const diningPlaces = {
  "poznan-manekin": {
    "id": "poznan-manekin",
    "booking": "walk-in",
    "cityKey": "poznan",
    "name": "Manekin",
    "address": "Kwiatowa 3, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Manekin%2C%20Kwiatowa%203%2C%20Pozna%C5%84",
    "hours": "週一至五早餐 10:00–13:00；營業 10:00–22:00（menu.pl 寫 21:45）；出發前再確認",
    "sourceUrl": "https://manekin.pl/",
    "menuUrl": "https://manekin.pl/wp-content/uploads/2026/01/Poznan-KWIATOWA-SNIADANIA-1.pdf",
    "checkedAt": "2026-10-28",
    "verificationStatus": "partial",
    "notes": [
      "官方早餐菜單時段與價格約 17.5–24 zł，咖啡約 6 zł，公休與價格出發前再確認。"
    ],
    "verificationNote": "官方早餐菜單時段與價格約 17.5–24 zł，咖啡約 6 zł，公休與價格出發前再確認。",
    "cuisine": "煎餅早餐",
    "dishes": [
      "炒蛋煎餅",
      "起司煎餅",
      "pancake burger",
      "burrito"
    ]
  },
  "poznan-stary-browar-food-hall": {
    "id": "poznan-stary-browar-food-hall",
    "booking": "walk-in",
    "cityKey": "poznan",
    "name": "Stary Browar Food Hall",
    "address": "Półwiejska 42, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Stary%20Browar%20Food%20Hall%2C%20P%C3%B3%C5%82wiejska%2042%2C%20Pozna%C5%84",
    "hours": "週一至四 12:00–22:00；商場週一至六 09:00–21:00；出發前再確認",
    "sourceUrl": "https://starybrowar5050.com/wydarzenia/foodhall-stary-browar-otwarty/",
    "checkedAt": "2026-10-28",
    "verificationStatus": "partial",
    "notes": [
      "13:00 午餐與逛街，14:00 離開；各攤價格依現場標價，出發前再確認。"
    ],
    "verificationNote": "13:00 午餐與逛街，14:00 離開；各攤價格依現場標價，出發前再確認。",
    "cuisine": "美食廣場",
    "dishes": [
      "依攤位選擇"
    ]
  },

  "krakow-massolit-books-cafe": {
    "id": "krakow-massolit-books-cafe",
    "cityKey": "krakow",
    "name": "Massolit Books & Café",
    "address": "Felicjanek 4, 31-104 Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Massolit%20Books%20%26%20Cafe%2C%20Felicjanek%204%2C%20Krak%C3%B3w",
    "hours": "每日 10:00–20:00（官方咖啡館頁）",
    "sourceUrl": "https://massolit.pl/cafe",
    "checkedAt": "2026-10-22",
    "verificationStatus": "verified",
    "notes": ["英文書店兼咖啡館；Wawel 西北側、Planty 外圍，有餘裕才繞去歇腳。"],
    "verificationNote": "2026-10-22 官網 massolit.pl/cafe 與其前端資源確認 Felicjanek 4、每日 10:00–20:00；舊網域 massolit.com 無法連線。",
    "cuisine": "書店咖啡館",
    "dishes": ["咖啡", "胡蘿蔔蛋糕", "紐約起司蛋糕"]
  },
  "warsaw-hala-koszyki": {
    "id": "warsaw-hala-koszyki",
    "booking": "walk-in",
    "cityKey": "warsaw",
    "name": "Hala Koszyki",
    "address": "ul. Koszykowa 63, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa",
    "hours": "大廳一、二 08:00–23:00；三 08:00–00:00；四、五、六 08:00–01:00；日 08:00–23:00（各攤位時間另查；週四到 01:00 為 Google 地圖）",
    "sourceUrl": "https://koszyki.com/",
    "checkedAt": "2026-09-23",
    "verificationStatus": "verified",
    "notes": [
      "百年美食市集",
      "免訂位 · 多攤集合，可一次吃到多國小吃",
      "百年市集改建的美食大廳；10/29 晚抵若 Arirang 已收單，可來吃宵夜（內有 24 小時的 Ćma），距飯店步行約 10–15 分。官方註明各店時間可能與大廳不同，抵達前先確認個別店家。"
    ]
  },
  "warsaw-cma-hala-koszyki": {
    "id": "warsaw-cma-hala-koszyki",
    "cityKey": "warsaw",
    "name": "Ćma by Mateusz Gessler",
    "address": "Hala Koszyki, Koszykowa 63, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=%C4%86ma%20by%20Mateusz%20Gessler%2C%20Hala%20Koszyki%2C%20Koszykowa%2063%2C%20Warszawa",
    "hours": "24 小時營業",
    "sourceUrl": "https://www.mateuszgessler.com.pl/restauracje/cma/",
    "checkedAt": "2026-10-07",
    "verificationStatus": "verified",
    "notes": [
      "現代小盤：推薦 Chipotle 手撕牛肉吐司、Burrata 沙拉或檸檬醬烤鮭魚。10/29 晚餐改 Arirang 後，作為誤點超過 20:40 的 24 小時備案。"
    ],
    "verificationNote": "店家官網與 Hala Koszyki 店家頁皆標示 24/7；大廳本身週四 08:00–00:00，深夜入口以現場指示為準。24 小時營業不等於全部菜色全天供應，深夜接單與菜單仍需確認。2024 年續約 5 年，Tripadvisor 2026 年評論仍為 24 小時。",
    "menuUrl": "https://www.mateuszgessler.com.pl/wp-content/uploads/2026/03/Menu-Cma-Styczen-2026.pdf",
    "cuisine": "現代小盤 · 24h",
    "dishes": [
      "Chipotle 手撕牛肉吐司",
      "Burrata 沙拉",
      "檸檬醬烤鮭魚"
    ],
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網與 Hala Koszyki 標示 24/7"
  },
  "warsaw-zapiecek": {
    "id": "warsaw-zapiecek",
    "cityKey": "warsaw",
    "name": "Zapiecek",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Zapiecek+Polskie+Pierogarnie+Warszawa",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "老城多家分店"
    ]
  },
  "warsaw-wedel-szpitalna-8": {
    "id": "warsaw-wedel-szpitalna-8",
    "cityKey": "warsaw",
    "name": "Pijalnia Czekolady E.Wedel",
    "address": "Szpitalna 8, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Pijalnia%20Czekolady%20E.Wedel%20Szpitalna%208%2C%20Warszawa",
    "hours": "週一至週六 09:00–22:00；週日 09:00–21:00",
    "sourceUrl": "https://wedelpijalnie.pl/lokale",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "1851 年創立的華沙巧克力老牌，招牌是濃稠熱巧克力；晚餐後或咖啡時間想喝熱巧克力可來（到 22:00）。"
    ],
    "verificationNote": "官方分店頁確認為 Staroświecki Sklep；不可套用其他 Wedel 分店時段。",
    "cuisine": "熱巧克力",
    "dishes": [
      "經典熱巧克力",
      "巧克力鍋",
      "Ptasie Mleczko 伴手禮"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-wandal": {
    "id": "warsaw-wandal",
    "booking": "required",
    "cityKey": "warsaw",
    "name": "WANDAL",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=15993615675406452524",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "必比登 · 顛覆式當代波蘭菜",
      "米其林 2026「年度開幕」；未排入本趟每日餐位，想吃需另外訂位並重排晚餐。"
    ]
  },
  "warsaw-kieliszki-na-proznej": {
    "id": "warsaw-kieliszki-na-proznej",
    "cityKey": "warsaw",
    "name": "Kieliszki na Próżnej",
    "address": "Próżna 12, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Kieliszki%20na%20Pr%C3%B3%C5%BCnej%2C%20Pr%C3%B3%C5%BCna%2012%2C%20Warszawa",
    "hours": "週一至週三 12:00–22:00；週四至週六 12:00–23:00；週日休",
    "sourceUrl": "https://kieliszkinaproznej.pl/en/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "酒杯牆名店 · 現代歐陸季節料理配葡萄酒，比 WYRAJ 更接近 Hotel Metropol",
      "招牌：酒杯小酌配歐陸小盤 · 酒吧型小酒館"
    ],
    "cuisine": "歐陸小盤配酒",
    "dishes": [
      "季節小盤",
      "單杯葡萄酒"
    ],
    "phone": "+48 501 764 674",
    "verificationNote": "Michelin Bib Gourmand；Michelin 列週六 14:00 起，週五不受影響。",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網"
  },
  "warsaw-stary-dom": {
    "id": "warsaw-stary-dom",
    "cityKey": "warsaw",
    "name": "Stary Dom",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Restauracja+Stary+Dom+Warszawa",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "老派滿漢波蘭菜 · 韃靼牛肉名店，離市中心稍遠"
    ]
  },
  "krakow-pod-aniolami": {
    "id": "krakow-pod-aniolami",
    "cityKey": "krakow",
    "name": "Pod Aniołami",
    "address": "Grodzka 35, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Pod%20Anio%C5%82ami%20Grodzka%2035%2C%20Krak%C3%B3w",
    "hours": "每日 13:00–23:00",
    "sourceUrl": "https://www.podaniolami.pl/",
    "checkedAt": "2026-09-18",
    "verificationStatus": "verified",
    "notes": [
      "燭光氛圍",
      "地窖燭光的傳統波蘭菜；10/26 晚餐改排 Mr. Jerry 後保留為備選。",
      "訂位 Email：restauracja@podaniolami.pl。",
      "木火烤山鱒魚與野菇湯；菜單加 10% 服務費。"
    ],
    "verificationNote": "沿用 店家官網查核，官方原文為每日營業。官網每日 13:00–23:00。",
    "menuUrl": "https://www.podaniolami.pl/wp-content/uploads/2026/05/menu_polskie_a3.pdf",
    "menuNote": "初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "地窖波蘭菜",
    "dishes": [
      "木火烤山鱒魚",
      "野菇湯",
      "傳統波蘭肉類主菜"
    ],
    "phone": "+48 12 421 39 99",
    "liveCheckedAt": "2026-10-12"
  },
  "krakow-pierogarnia-krakowiacy": {
    "id": "krakow-pierogarnia-krakowiacy",
    "cityKey": "krakow",
    "name": "Pierogarnia Krakowiacy",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Krakowiacy+Krakow",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "老城手工餃子"
    ]
  },
  "krakow-pierozki-u-vincenta": {
    "id": "krakow-pierozki-u-vincenta",
    "cityKey": "krakow",
    "name": "Pierogi MR Vincent（Kazimierz）",
    "address": "Bożego Ciała 12, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Pierogi%20MR%20Vincent%2C%20Bo%C5%BCego%20Cia%C5%82a%2012%2C%20Krak%C3%B3w",
    "hours": "約至 21:00",
    "sourceUrl": "https://www.yelp.com/biz/pierogi-mr-vincent-krak%C3%B3w",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Kazimierz 的 Bożego Ciała 12 分店；保留為克拉科夫城市餐飲候選。Bronowice 的 Lea 114 本店太遠、平日 16:30 就關，不採用。"
    ],
    "verificationNote": "官網只列 Lea 114；Kazimierz 分店見 Yelp 官方頁，出發前確認。",
    "hoursNote": "Yelp 2026-08；本店 Lea 114 只開週一至週五 11:00–16:30",
    "liveCheckedAt": "2026-10-12",
    "cuisine": "餃子",
    "dishes": [
      "手工 Pierogi"
    ]
  },
  "krakow-okraglak-plac-nowy-圓亭": {
    "id": "krakow-okraglak-plac-nowy-圓亭",
    "cityKey": "krakow",
    "name": "Okrąglak（Plac Nowy 圓亭）",
    "address": "plac Nowy 4B, Kraków",
    "map": "https://maps.app.goo.gl/2Nitej5cqG4VAcbp6?g_st=il",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "plac Nowy 4B · Kazimierz 圓亭四周聚集多家 zapiekanka 窗口；本趟晚餐在 Zabłocie，只在 Kazimierz 有空檔時順路。"
    ]
  },
  "krakow-szalone-widelce": {
    "id": "krakow-szalone-widelce",
    "cityKey": "krakow",
    "name": "Szalone Widelce",
    "address": "Szpitalna 40, Kraków",
    "map": "https://maps.app.goo.gl/U3yMsjdSgM3Pwgqe9?g_st=il",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Szpitalna 40 · 老城東側，可接中央市集廣場",
      "Szpitalna 40 · 位於老城東側，適合接中央市集廣場；營業時間與訂位以店家即時頁面為準"
    ]
  },
  "krakow-bar-mleczny-pod-temida": {
    "id": "krakow-bar-mleczny-pod-temida",
    "cityKey": "krakow",
    "name": "Bar Mleczny Pod Temidą",
    "address": "Grodzka 43, Kraków",
    "map": "https://maps.app.goo.gl/xCGDapoy56MBvg2y7?g_st=il",
    "hours": "每日 09:00–20:00",
    "sourceUrl": "https://podtemida.pl/",
    "checkedAt": "2026-09-24",
    "verificationStatus": "verified",
    "notes": [
      "Grodzka 43 · 中央廣場往 Wawel 的順路平價選擇",
      "Grodzka 43 · 在中央廣場與 Wawel 之間，適合排平價早餐或午餐；",
      "Grodzka 43，老城區最方便的牛奶吧，pierogi、湯品與馬鈴薯煎餅都便宜；",
      "官網每日 09:00–20:00 時段；若臨時休店，可改中央廣場周邊午餐。"
    ],
    "verificationNote": "瀏覽器讀取官網頁尾：pon - niedz.: 9-20；頁首確認 Grodzka 43（頁尾街名 Gordzka 為拼字誤植）。",
    "cuisine": "牛奶吧",
    "dishes": [
      "Pierogi",
      "每日湯品",
      "馬鈴薯煎餅"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "krakow-bottiglieria-1881": {
    "id": "krakow-bottiglieria-1881",
    "cityKey": "krakow",
    "name": "Bottiglieria 1881",
    "address": "Bocheńska 5, Kraków",
    "map": "https://maps.google.com/?cid=8570908113421134699",
    "hours": "週二–六 17:00 起（關門時間未列）；週日、一休息",
    "sourceUrl": "https://1881.com.pl/nasze-menu/",
    "checkedAt": "2026-10-06",
    "verificationStatus": "partial",
    "notes": [
      "2026 米其林二星 · Kazimierz 餐廳候選，需先查詢可訂日期。",
      "僅供 tasting menu，不供單點，也不可分食套餐；同桌須選相同套餐。官網價格 940／990 PLN，另加 12.5% 服務費。"
    ],
    "verificationNote": "官網確認地址、開門日與套餐規則；關門時間未公布，維持部分查證。尚未訂位，餐價及菜單可能調整。"
  },
  "krakow-miod-malina": {
    "id": "krakow-miod-malina",
    "cityKey": "krakow",
    "name": "Miód Malina",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Miod+Malina+Krakow",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "「蜂蜜覆盆子」· 廣場旁氣氛店，觀光但穩定"
    ]
  },
  "wroclaw-konspira": {
    "id": "wroclaw-konspira",
    "cityKey": "wroclaw",
    "name": "Konspira",
    "address": "Plac Solny 11, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Konspira%20Plac%20Solny%2011%2C%20Wroc%C5%82aw",
    "hours": "週一至週三 13:00–23:00（廚房至 22:00）；週四 13:00–23:45（廚房至 23:00）；週五、週六 12:00–23:45（廚房至 23:00）；週日 12:00–23:00（廚房至 22:00）",
    "sourceUrl": "https://www.restauracjakonspira.pl/contact",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "80 年代反共主題",
      "Plac Solny 11，1980 年代地下反共運動主題餐廳，Śląskie kluski 等傳統菜；",
      "週五至日不接受訂位、依到店順序。",
      "現為備案（Day 5 午餐主位改 Restauracja Wrocławska）。",
      "傳統波蘭料理與 1980 年代反共地下運動主題空間。",
      "官方明示週五、週末與假日不接受訂位，依到店順序；",
      "訂位 Email：rezerwacje.konspira@gmail.com。"
    ],
    "verificationNote": "沿用 官方聯絡頁查核；Day 5 週三為 13:00–23:00。週三 13:00 才開門，12:00 午餐不能直接改這間。",
    "cuisine": "波蘭家常菜",
    "dishes": [
      "Pierogi",
      "波蘭家常主菜"
    ],
    "phone": "+48 796 326 600",
    "liveCheckedAt": "2026-10-12"
  },
  "wroclaw-pierogarnia-stary-mlyn": {
    "id": "wroclaw-pierogarnia-stary-mlyn",
    "cityKey": "wroclaw",
    "name": "Pierogarnia Stary Młyn",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Pierogarnia+Stary+Mlyn+Wroclaw",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "廣場旁"
    ]
  },
  "wroclaw-hala-targowa": {
    "id": "wroclaw-hala-targowa",
    "cityKey": "wroclaw",
    "name": "Hala Targowa",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Hala+Targowa+Wroclaw",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "PLN 20–30"
    ]
  },
  "wroclaw-baba": {
    "id": "wroclaw-baba",
    "cityKey": "wroclaw",
    "name": "BABA",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=9335659011047272773",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "新升星 · 波蘭菜當代詮釋，午間較易訂",
      "2025 Bib 升 2026 一星 · Nożownicza 1D · 主廚 Beata Śniechowska · 主菜約 69–159 PLN"
    ]
  },
  "wroclaw-kurna-chata": {
    "id": "wroclaw-kurna-chata",
    "cityKey": "wroclaw",
    "name": "Kurna Chata",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Kurna+Chata+Wroclaw",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "民俗風家常波蘭菜 · 廣場旁 · 平價大份"
    ]
  },
  "poznan-stary-browar": {
    "id": "poznan-stary-browar",
    "cityKey": "poznan",
    "name": "Stary Browar",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Stary+Browar+Poznan",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "古釀酒廠改造"
    ]
  },
  "poznan-whiskey-in-the-jar": {
    "id": "poznan-whiskey-in-the-jar",
    "cityKey": "poznan",
    "name": "Whiskey In The Jar",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Whiskey+in+the+Jar+Poznan",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "燒烤名店"
    ]
  },
  "poznan-hotel-bazar": {
    "id": "poznan-hotel-bazar",
    "cityKey": "poznan",
    "name": "Hotel Bazar",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Hotel+Bazar+Poznan",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "1918 年帕德瑞夫斯基陽台演說與大波蘭起義的重要歷史地點"
    ]
  },
  "poznan-pyra-bar": {
    "id": "poznan-pyra-bar",
    "cityKey": "poznan",
    "name": "Pyra Bar",
    "address": "Strzelecka 13, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Pyra%20Bar%20Strzelecka%2013%2C%20Pozna%C5%84",
    "hours": "週一至週四、週日 11:00–21:00；週五、六 11:00–23:00",
    "sourceUrl": "https://pyrabar.eatbu.com/?lang=en",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "馬鈴薯佐凝乳",
      "以大波蘭特色的 pyry z gzikiem（水煮馬鈴薯配 twaróg 起司醬）聞名，價位親民；",
      "兩人直接點 Pyry z bzikiem 烤馬鈴薯配 Gzik 香草凝乳（36 PLN）與 Szare ale jare 灰色馬鈴薯麵糰配培根酸白菜（38 PLN）。"
    ],
    "verificationNote": "店家官方訂位頁確認地址與完整週時段；再以店家 Instagram 確認週五、六延長至 23:00，週四 11:00–21:00 不變。",
    "menuUrl": "https://pyrabar.pl/pyrabar-poznan/",
    "menuNote": "初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "大波蘭馬鈴薯料理",
    "dishes": [
      "Pyry z bzikiem 烤馬鈴薯＋Gzik（36 PLN）",
      "Szare ale jare 灰馬鈴薯麵糰＋培根酸白菜（38 PLN）"
    ],
    "phone": "+48 618 516 762",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "店家 Instagram、Menix 2026"
  },
  "poznan-carla-trattoria-moderna": {
    "id": "poznan-carla-trattoria-moderna",
    "booking": "walk-in",
    "cityKey": "poznan",
    "name": "Carla Trattoria Moderna",
    "address": "Święty Marcin 34, 61-803 Poznań",
    "map": "https://www.google.com/maps/place/Carla+Trattoria+Moderna/@52.4063215,16.9259795,17z/data=!4m6!3m5!1s0x47045ba3edcbf40b:0x738c9e5bda0ca31!8m2!3d52.4063215!4d16.9259795!16s%2Fg%2F11ml052h1z",
    "hours": "週一至週四 14:00–22:30；週五 14:00–23:30；週六 13:00–23:30；週日 13:00–20:00（Google 地圖、zjedz.my）",
    "sourceUrl": "https://zjedz.my/carla-trattoria-moderna",
    "checkedAt": "2026-10-12",
    "verificationStatus": "verified",
    "notes": [
      "現代義大利菜：手工麵、披薩、小盤分享；未排入 10/29 主行程。"
    ],
    "menuUrl": null,
    "verificationNote": "Google 地圖與 zjedz.my 一致週四 14:00–22:30；menu.pl 外送時段週四 14:00–21:30；店家 Instagram 表示 10/1 起新營業時間。近期有評論抱怨上菜慢，出發前再確認。",
    "phone": "+48 796 200 002",
    "cuisine": "現代義大利菜",
    "dishes": [
      "Spaghetti assassina 46 zł",
      "Spaghetti carbonara 52 zł",
      "Papardelle cacio e pepe 49 zł",
      "Margherita classica 34 zł",
      "Tiramisu 35 zł",
      "Panna cotta 32 zł"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "poznan-brovaria": {
    "id": "poznan-brovaria",
    "cityKey": "poznan",
    "name": "Brovaria",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Brovaria+Poznan",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Stary Rynek 上的自釀啤酒餐廳 · 順路一杯"
    ]
  },
  "warsaw-nuta": {
    "id": "warsaw-nuta",
    "booking": "required",
    "cityKey": "warsaw",
    "name": "NUTA",
    "address": "Plac Trzech Krzyży 10/14, Warszawa",
    "map": "https://maps.google.com/?cid=4624148008162643045",
    "hours": "週二至週六 18:00–21:15（最後訂位）；週日、週一休息",
    "sourceUrl": "https://nuta.com.pl/en/",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "招牌：主廚 Andrea Camastra 創意套餐，義式底蘊融合亞洲香料，劇場式上菜 · 提前 3–5 週"
    ],
    "verificationNote": "官方頁確認地址與最後訂位時段；套餐價格應以訂位頁即時顯示為準。官網週二至週六 18:00 起、最後訂位 21:15。",
    "cuisine": "米其林一星套餐",
    "dishes": [
      "主廚套餐（需訂位）"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-wyraj": {
    "id": "warsaw-wyraj",
    "cityKey": "warsaw",
    "name": "WYRAJ",
    "address": "Krochmalna 59/lok U2, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=WYRAJ%20Krochmalna%2059%2C%20Warszawa",
    "hours": "週一至週四 12:00–23:00；週五 12:00–00:00；週六 10:00–00:00；週日 10:00–22:00",
    "sourceUrl": "https://wyraj.net/kontakt/",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "notes": [
      "斯拉夫風味與時令穀物、野禽／野味料理；季節前菜、Pierogi。菜單隨季節換。10/30 晚餐已排 Soul Kitchen，這間保留為晚餐備選；人在 Wola 一帶時可改來。"
    ],
    "verificationNote": "官網與 Michelin 週五皆為 12:00–00:00，10/30 有營業；TheFork 可訂位，尚未訂位。",
    "menuUrl": "https://wyraj.net/wp-content/uploads/2026/06/Wersja-na-strone-www-i-google-ANG-Uczta-Noc-LATO-2026-26.06.pdf",
    "cuisine": "現代斯拉夫菜",
    "dishes": [
      "季節前菜",
      "Pierogi",
      "禽類／野味主菜"
    ],
    "phone": "+48 570 010 570",
    "liveCheckedAt": "2026-10-12"
  },
  "krakow-folga": {
    "id": "krakow-folga",
    "cityKey": "krakow",
    "name": "FOLGA",
    "address": "Estery 12, Kraków",
    "map": "https://maps.google.com/?cid=7193800786272583343",
    "hours": "週一可能休息；Instagram 列週一至週四 13:00–22:00；週五、六約 12:00–23:00",
    "sourceUrl": "https://www.yelp.com/biz/folga-krak%C3%B3w",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "招牌：當代創意料理小盤 · 高 CP",
      "魚類、海鮮與當季 Sharing Plates，一份主菜＋數份小盤分享；海鯛 Ceviche、蝦仁 Rigatoni、白大比目魚候選。Wellington 僅週四至週日，週一不採用。"
    ],
    "verificationNote": "Michelin Bib Gourmand；週一營業與否來源矛盾，10/26（週一）不當首替，要去先看 Google 地圖當日營業狀態。",
    "menuUrl": "https://folgakrakow.pl/wp-content/uploads/2026/09/MENU-Wrzesien%CC%81-GABLOTA-%E2%80%94-2026.pdf",
    "menuNote": "初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "現代小盤",
    "dishes": [
      "海鯛 Ceviche",
      "蝦仁 Rigatoni",
      "當季 Sharing plates"
    ],
    "phone": "+48 515 392 674",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Yelp 2026-09、teraz-otwarte"
  },
  "krakow-noah": {
    "id": "krakow-noah",
    "cityKey": "krakow",
    "name": "NOAH",
    "address": "Meiselsa 24, Kraków",
    "map": "https://maps.google.com/?cid=6279990201826816109",
    "hours": "週一至週四 16:00–22:00；週五 14:00–23:00；週六 13:00–23:00；週日 13:00–21:30",
    "sourceUrl": "https://noahkrakow.pl/",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "招牌：以色列烤羊肉串配 pitta 餅 · 平價實惠"
    ],
    "verificationNote": "店家官網直接列出地址與完整週營業時間；Day 2 週日晚餐適用 13:00–21:30。Pearl 列 2026 Bib Gourmand。",
    "cuisine": "以色列菜",
    "dishes": [
      "Hummus",
      "中東烤肉",
      "分享小盤"
    ],
    "phone": "+48 799 049 349",
    "liveCheckedAt": "2026-10-12"
  },
  "krakow-hamsa": {
    "id": "krakow-hamsa",
    "cityKey": "krakow",
    "name": "Hamsa",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=1317891001987072687",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Kazimierz（Szeroka 2）· 招牌：中東鷹嘴豆泥 hummus、falafel"
    ]
  },
  "wroclaw-ida-kuchnia-i-wino": {
    "id": "wroclaw-ida-kuchnia-i-wino",
    "cityKey": "wroclaw",
    "name": "IDA kuchnia i wino",
    "address": "Łazienna 4, Wrocław",
    "map": "https://maps.google.com/?cid=10589009865057440004",
    "hours": "週一至週五 12:00–22:00；週六 13:00–22:00；週日 13:00–19:00",
    "sourceUrl": "https://idakuchniaiwino.pl/",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "招牌：現代版 kopytka 馬鈴薯疙瘩、pierogi、żurek 酸湯"
    ],
    "verificationNote": "沿用 官方查核；固定套餐與搭酒價格未由官網核實。",
    "cuisine": "波蘭菜配酒",
    "dishes": [
      "酸湯",
      "Pierogi",
      "鴨肉"
    ],
    "phone": "+48 608 728 260",
    "liveCheckedAt": "2026-10-12"
  },
  "wroclaw-restauracja-wroclawska": {
    "id": "wroclaw-restauracja-wroclawska",
    "cityKey": "wroclaw",
    "name": "Restauracja Wrocławska",
    "address": "Szewska 59/60, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Wroc%C5%82awska%20Szewska%2059/60%2C%20Wroc%C5%82aw",
    "hours": "每日 12:00 開門；週日至週四廚房至 21:30、酒吧至 22:00；週五、週六廚房至 22:00、酒吧至 00:00",
    "sourceUrl": "https://restauracja-wroclawska.eatbu.com/?lang=en",
    "checkedAt": "2026-09-24",
    "verificationStatus": "partial",
    "notes": [
      "下西里西亞地方菜：Śląskie niebo 果乾燉豬肉配 Wrocław dumplings（65 PLN）、Bigos Wrocławski 紅甘藍燉肉（41 PLN）、Hekele 鯡魚前菜；胃口夠再加 Crayfish Soup。",
      "Day 5 午餐首選；菜單提醒主菜約需 30 分鐘，另留候位與交通。"
    ],
    "verificationNote": "已讀出店家 DISH 官網完整週時段；廚房收單時間另以 wroclawska.com.pl/kontakt/ 核對。12:00 午餐、13:00 結束去 Panorama；可訂位但非必要，預設現場候位，12:00 起接聽，但出餐速度未獲保證。英文聯絡頁僅列結束時刻，12:00 開門沿用 9/24 自管頁記錄，出發前再確認。週三 12:00–22:00 各來源一致。",
    "menuUrl": "https://wroclawska.com.pl/wp-content/uploads/2026/09/Wroclawska-menuA4-20-EN-web.pdf",
    "cuisine": "下西里西亞菜",
    "dishes": [
      "Śląskie niebo 果乾燉豬肉配餃子（65 PLN）",
      "Bigos Wrocławski（41 PLN）",
      "Hekele 鯡魚前菜",
      "Crayfish Soup"
    ],
    "phone": "+48 71 305 12 28",
    "liveCheckedAt": "2026-10-12"
  },
  "wroclaw-piwnica-swidnicka": {
    "id": "wroclaw-piwnica-swidnicka",
    "cityKey": "wroclaw",
    "name": "Piwnica Świdnicka",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Piwnica%20%C5%9Awidnicka%20Wroc%C5%82aw",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "市政廳地窖 · 歐洲最古老餐廳之一（1273）· 招牌：傳統燉肉與啤酒"
    ]
  },
  "poznan-muga": {
    "id": "poznan-muga",
    "cityKey": "poznan",
    "name": "Muga",
    "address": "Krysiewicza 5, Poznań",
    "map": "https://maps.google.com/?cid=2998937238608160974",
    "hours": "營業時間待確認",
    "sourceUrl": "https://www.restauracjamuga.pl/en/menu/reserva",
    "checkedAt": "2026-10-06",
    "verificationStatus": "partial",
    "notes": [
      "法系 tasting menu · Reserva 套餐 560 PLN，含魚子醬版本 685 PLN；另加 12.5% 服務費。套餐約 2–3 小時，菜單與價格以訂位時店家公告為準。"
    ],
    "verificationNote": "重新核對 Reserva 官方菜單及費用，官方 contact 頁確認 Krysiewicza 5；完整營業時間尚未核對，維持部分查證，尚未訂位。"
  },
  "poznan-fromazeria": {
    "id": "poznan-fromazeria",
    "cityKey": "poznan",
    "name": "Fromażeria",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Froma%C5%BCeria%20Pozna%C5%84",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "招牌：起司主題料理，融合波蘭與地中海／黎凡特香料風味"
    ]
  },
  "poznan-spot": {
    "id": "poznan-spot",
    "cityKey": "poznan",
    "name": "SPOT.",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=SPOT.%20Pozna%C5%84",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "招牌：當代創意料理小盤"
    ]
  },
  "poznan-rogal": {
    "id": "poznan-rogal",
    "cityKey": "poznan",
    "name": "ROGAL Świętomarciński",
    "address": "Stary Rynek 11/17, Poznań",
    "map": "https://www.google.com/maps/place/ROGAL+%C5%9Awi%C4%99tomarci%C5%84ski/@52.4079727,16.9340286,17z/data=!3m1!4b1!4m6!3m5!1s0x47045be6c6dec08b:0x2738305616ca929f!8m2!3d52.4079727!4d16.9340286!16s%2Fg%2F11wnltgtr4",
    "hours": "週一至週四 09:00–20:00；週五 09:00–21:00（第三方 Google 地圖，出發前再確認）",
    "sourceUrl": "https://visitpoznan.pl/en/rogal-swietomarcinski-stary-rynek-en",
    "checkedAt": "2026-10-17",
    "verificationStatus": "partial",
    "notes": [
      "PGI 聖馬丁可頌（Rogal świętomarciński）· 白罌粟籽餡；10/29 12:05 山羊秀後的點心站，兩人買一個分享即可。"
    ],
    "verificationNote": "初稿引波茲南觀光局 Stary Rynek 11/17；營業與售完時間仍待確認，僅作順路外帶候選。店內每日烘焙，可外帶或內用；營業時間未查到。Google 地圖店家頁確認門牌 Stary Rynek 11/17、座標 52.40797,16.93403，只取得週一 09:00–20:00；週四與 10/29 特殊公告未查到，出發前看 facebook.com/ROGALSTARYRYNEK。不要和 Stary Rynek 41 的 Rogalowe Muzeum 混淆。Google 地圖週一至四 09:00–20:00、週五 09:00–21:00，10/29 週四 12:05 依第三方時段規劃；仍只有 Google 一個來源，出發前再確認。",
    "phone": "+48 573 465 226",
    "cuisine": "聖馬丁可頌",
    "dishes": [
      "Rogal świętomarciński 聖馬丁可頌"
    ],
    "liveCheckedAt": "2026-10-17"
  },
  "poznan-na-winklu": {
    "id": "poznan-na-winklu",
    "cityKey": "poznan",
    "name": "Na Winklu",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=17998777227118824033",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Śródka 區河畔 · 招牌：烤製版大顆 pierogi，外皮酥脆內餡多汁，在地人氣首選"
    ]
  },
  "poznan-hycka": {
    "id": "poznan-hycka",
    "cityKey": "poznan",
    "name": "Hyćka",
    "address": "Rynek Śródecki 17, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Hy%C4%87ka%20Rynek%20%C5%9Ar%C3%B3decki%2017%2C%20Pozna%C5%84",
    "hours": "週一 11:00–20:00；週二、週三 11:00–21:00；週四、週五 11:00–22:00；週六 12:00–22:00；週日 12:00–20:00",
    "sourceUrl": "https://hycka.pl/",
    "checkedAt": "2026-09-24",
    "verificationStatus": "verified",
    "notes": [
      "大波蘭菜 · 招牌：烤鴨配 pyzy 蒸糰（Muga 主廚推薦）"
    ],
    "verificationNote": "官網列完整週時段與 Rynek Śródecki 17；沒有線上訂位。官網週四 11:00–22:00，沒有線上訂位。",
    "cuisine": "大波蘭菜",
    "dishes": [
      "烤鴨配蒸糰",
      "大波蘭家常菜"
    ],
    "phone": "+48 535 045 035",
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-bar-mleczny-prasowy-marszalkowska": {
    "id": "warsaw-bar-mleczny-prasowy-marszalkowska",
    "cityKey": "warsaw",
    "name": "Bar Mleczny Prasowy",
    "address": "Marszałkowska 10/16, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Prasowy%2C%20Marsza%C5%82kowska%2010%2F16%2C%20Warszawa",
    "hours": "週一 09:00–20:00；週二至週日 09:00–19:00",
    "sourceUrl": "https://wcit.waw.pl/",
    "checkedAt": "2026-09-17",
    "verificationStatus": "verified",
    "notes": [
      "1954 年開業的華沙老牌牛奶吧，żurek、pierogi、炸豬排都是銅板價。",
      "⚠️ 位置更正：門市在 Marszałkowska 10/16（Śródmieście Południowe、近 plac Zbawiciela），Hotel Metropol 在 Marszałkowska 99a（Rondo Dmowskiego／Centrum 一帶）——兩者在同一條街的兩端，不是步行五分鐘的相鄰位置。"
    ],
    "verificationNote": "沿用華沙市府旅遊資訊中心；10/31 週六 09:00 才開，不適合 08:00 早餐。"
  },
  "warsaw-bar-mleczny-bambino": {
    "id": "warsaw-bar-mleczny-bambino",
    "cityKey": "warsaw",
    "name": "Bar Mleczny Bambino",
    "address": "Hoża 19, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Bambino%2C%20Ho%C5%BCa%2019%2C%20Warszawa",
    "hours": "週一至週五 08:00–20:00；週六、日 09:00–18:00",
    "sourceUrl": "https://barbambino.pl/",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "notes": [
      "波蘭牛奶吧早餐：jajecznica 炒蛋、naleśniki 可麗餅配 kompot，或菠菜歐姆蛋。平日 08:00 才開，10/30 改為早餐備選（行程 08:05 就要出發搭地鐵往北）。"
    ],
    "menuUrl": "https://barbambino.pl/sniadanie/",
    "verificationNote": "本輪官網確認 Hoża 19（餐飲 v5 稿列 Krucza 21，以官網為準）；早餐品項與當日供應再查菜單。官網平日 08:00–20:00、週末 09:00–18:00。",
    "cuisine": "牛奶吧",
    "dishes": [
      "Jajecznica 炒蛋",
      "Naleśniki 可麗餅",
      "Kompot 果汁",
      "菠菜歐姆蛋"
    ],
    "phone": "+48 22 625 16 95",
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-a-blikle-1869": {
    "id": "warsaw-a-blikle-1869",
    "cityKey": "warsaw",
    "name": "A. Blikle 1869",
    "address": "Nowy Świat 33, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=A.%20Blikle%2C%20Nowy%20%C5%9Awiat%2033%2C%20Warszawa",
    "hours": "每日 09:00–21:00（品牌官網門市頁）",
    "sourceUrl": "https://blikle.pl/lokale/",
    "checkedAt": "2026-10-21",
    "verificationStatus": "partial",
    "notes": [
      "1869 年創立的波蘭國民甜點店，pączki 玫瑰果醬甜甜圈是招牌。10/31 09:10 早餐後外帶；品牌官網列 Nowy Świat 33 每日 09:00–21:00。"
    ],
    "cuisine": "百年甜點",
    "dishes": [
      "Pączki 玫瑰果醬甜甜圈",
      "咖啡外帶"
    ],
    "verificationNote": "品牌官網門市頁（https://blikle.pl/lokale/，2026-10-21 讀取）列「Cukiernia Nowy Świat, ul. Nowy Świat 33, pon. – ndz. 9:00-21:00」，導航以 33 號為準。先前資料：Wolt、TableJourney、In Your Pocket 都把門市寫成 Nowy Świat 33（有資料說 2017 年底由 35 號遷入）；兩門相鄰約 20 m，現場看招牌即可。2026 年有新聞提到 Nowy Świat 店面租金欠款與市府協商分期，出發前再看一次是否照常營業。",
    "liveCheckedAt": "2026-10-21",
    "hoursNote": "品牌官網"
  },
  "warsaw-cukiernia-zagozdzinski": {
    "id": "warsaw-cukiernia-zagozdzinski",
    "cityKey": "warsaw",
    "name": "Cukiernia Zagoździński",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=5270464504046978357",
    "hours": "依店家當日公告",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "1925 年開業的老派甜甜圈店，被在地人視為華沙 pączek 標準答案；位在 Wola 區 Górczewska 15，需搭電車前往，適合有半天餘裕時安排。"
    ]
  },
  "warsaw-cafe-bristol": {
    "id": "warsaw-cafe-bristol",
    "cityKey": "warsaw",
    "name": "Café Bristol",
    "address": "Krakowskie Przedmieście 42/44, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Bristol%20Krakowskie%20Przedmie%C5%9Bcie%2042/44%2C%20Warszawa",
    "hours": "週日至週四 08:00–19:00；週五、週六 08:00–21:00",
    "sourceUrl": "https://www.cafebristol.pl/pl/",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "Krakowskie Przedmieście 42/44（Hotel Bristol 內），就在總統府隔壁；10/30 為午餐備選，也可和 E.Wedel 二選一當熱飲甜點點。",
      "三明治＋咖啡、Bristol cake；官網湯與主餐自 12:00 起供應。"
    ],
    "verificationNote": "營業時間沿用 官方查核；各日備選共用此筆資料，未代表已訂位。Marriott 頁與本站官方時段一致（週五、六至 21:00）。",
    "menuUrl": "https://www.cafebristol.pl/pl/our-menus",
    "menuNote": "初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "飯店老派咖啡廳",
    "dishes": [
      "Bristol cake",
      "三明治",
      "Mille-feuille 千層酥",
      "咖啡"
    ],
    "phone": "+48 22 551 18 28",
    "liveCheckedAt": "2026-10-12"
  },
  "krakow-endzior": {
    "id": "krakow-endzior",
    "cityKey": "krakow",
    "name": "Endzior · Plac Nowy 圓亭",
    "address": "plac Nowy 4B, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Zapiekanki%20u%20Endziora%2C%20plac%20Nowy%204B%2C%20Krak%C3%B3w",
    "hours": "各來源不一，週日不一定有開，出門前看 Google 地圖",
    "sourceUrl": "https://www.inyourpocket.com/krakow/Mini-Bar-Endzior_19875v",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Kazimierz 圓亭（Okrąglak）內的 zapiekanka 名攤，長棍麵包烤蘑菇起司，PLN 18–25。週日不一定有開，10/25（週日）沒開就改買圓亭其他窗口。"
    ],
    "cuisine": "街頭小吃",
    "dishes": [
      "Zapiekanka 長棍披薩"
    ],
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Yelp 2026-03、In Your Pocket；Tripadvisor 另列每日營業",
    "phone": "+48 12 429 37 54",
    "verificationNote": "營業時段各來源不一，週日是否營業要現場看。"
  },
  "krakow-karma-coffee-roasters": {
    "id": "krakow-karma-coffee-roasters",
    "cityKey": "krakow",
    "name": "Karma Kawiarnia",
    "address": "Krupnicza 12/3, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Karma%20Kawiarnia%2C%20Krupnicza%2012%2C%20Krak%C3%B3w",
    "hours": "週一至週五 08:00–20:00；週六、日 10:00–19:00",
    "sourceUrl": "https://www.karmaroasters.com/kontakt",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "2010 年開業，克拉科夫第一家精品咖啡店，Kazimierz 自家烘豆。公開資料列一–五 08:00–20:00、六日 10:00–19:00。"
    ],
    "hoursNote": "店家官網；karmaroasters.com 與 Yelp 一致，另一個網站 karmakrakow.pl 列平日 07:00–18:00，選配，未排入行程；營業時間兩個來源不一致，去之前看 Google 地圖",
    "liveCheckedAt": "2026-10-20",
    "phone": "+48 662 387 281",
    "cuisine": "自家烘焙咖啡",
    "dishes": [
      "手沖咖啡",
      "Flat White",
      "蛋糕"
    ],
    "verificationNote": "官網列 Krupnicza 12/3 咖啡館時段；Świętego Wawrzyńca 9 的烘豆廠只在週末開。"
  },
  "krakow-cafe-camelot": {
    "id": "krakow-cafe-camelot",
    "cityKey": "krakow",
    "name": "Café Camelot",
    "address": "Świętego Tomasza 17, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Cafe%20Camelot%2C%20%C5%9Aw.%20Tomasza%2017%2C%20Krak%C3%B3w",
    "hours": "每日 09:00–23:00（2023 年報導）",
    "sourceUrl": "https://www.gillespudlowski.com/357546/rendez-vous/cracovie-un-verre-et-plus-au-cafe-camelot",
    "checkedAt": "2026-10-15",
    "verificationStatus": "partial",
    "notes": [
      "老城老牌咖啡館，距中央廣場數步，地窖是卡巴萊劇場；10/25 中央廣場散步時的歇腳點。"
    ],
    "verificationNote": "門牌多來源一致；營業時間僅 2023 年報導，前往前看 Google Maps。",
    "cuisine": "咖啡廳 · 蛋糕",
    "dishes": ["蘋果派 szarlotka", "熱紅酒", "咖啡"]
  },
  "krakow-cukiernia-michalek": {
    "id": "krakow-cukiernia-michalek",
    "cityKey": "krakow",
    "name": "Cukiernia Michałek",
    "address": "Krupnicza 6, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Cukiernia%20Micha%C5%82ek%2C%20Krupnicza%206%2C%20Krak%C3%B3w",
    "hours": "週二至週五 08:00–20:00；週六 08:00–16:00；週日、一可能休",
    "sourceUrl": "https://www.findglocal.com/PL/Krak%C3%B3w/284656445022520/Cukiernia-Micha%C5%82ek",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Krupnicza 6，在老城西側；不在 10/27 動線上，城市延伸。"
    ],
    "hoursNote": "2026-04 目錄，各來源不一",
    "liveCheckedAt": "2026-10-12",
    "phone": "+48 12 422 47 05",
    "cuisine": "老派甜點",
    "dishes": [
      "Sernik 波蘭起司蛋糕",
      "傳統糕點"
    ],
    "verificationNote": "門牌多來源一致；sernik 為在地推薦，供應以櫃台為準。"
  },
  "wroclaw-bar-mleczny-mis": {
    "id": "wroclaw-bar-mleczny-mis",
    "cityKey": "wroclaw",
    "name": "Bar Mleczny Miś",
    "address": "Kuźnicza 48, Wrocław",
    "map": "https://maps.google.com/?cid=9100083269168988599",
    "hours": "一–五 07:00–18:00、六 08:00–17:00、日休（2026 公開資料）",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Kuźnicza 48，樂斯拉夫最知名的牛奶吧，營運逾 50 年；湯約 3–6 PLN、主菜 12–25 PLN。**週日公休**，本行程 10/28（三）可用。"
    ]
  },
  "wroclaw-vincent-kazimierza-wielkiego-甜點": {
    "id": "wroclaw-vincent-kazimierza-wielkiego-甜點",
    "cityKey": "wroclaw",
    "name": "Vincent · Kazimierza Wielkiego 甜點",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Cukiernia%20Vincent%20Wroc%C5%82aw",
    "hours": "依店家當日公告",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "老城區連鎖甜點咖啡館，蛋糕櫃選擇多，適合小矮人散步途中補糖。"
    ]
  },
  "wroclaw-browar-stu-mostow": {
    "id": "wroclaw-browar-stu-mostow",
    "cityKey": "wroclaw",
    "name": "Browar Stu Mostów",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Browar%20Stu%20Most%C3%B3w%20Wroc%C5%82aw",
    "hours": "依店家當日公告",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "樂斯拉夫代表性精釀酒廠，不喝酒可略過。"
    ]
  },
  "wroclaw-slodki-chlopak-muzeum-narodowe": {
    "id": "wroclaw-slodki-chlopak-muzeum-narodowe",
    "cityKey": "wroclaw",
    "name": "Słodki Chłopak w Muzeum Narodowym",
    "address": "pl. Powstańców Warszawy 5, Wrocław（國家博物館內）",
    "map": "https://www.google.com/maps/search/?api=1&query=S%C5%82odki%20Ch%C5%82opak%20Muzeum%20Narodowe%2C%20pl.%20Powsta%C5%84c%C3%B3w%20Warszawy%205%2C%20Wroc%C5%82aw",
    "hours": "跟國家博物館主館開放時間：冬季（10/1–3/31）週二至週五 10:00–16:00、週六日 10:00–17:00，週一休；10/28（週三）10:00–16:00",
    "sourceUrl": "https://slodkichlopak.pl/kawiarnie/muzeum-narodowe/",
    "checkedAt": "2026-10-20",
    "verificationStatus": "partial",
    "notes": [
      "樂斯拉夫在地甜點連鎖的博物館分店，店家頁註明不需博物館門票即可進入；Day 5 13:20 在博物館內吃甜點 30–40 分；10/28 10:00–16:00 照常開放，16:00 前離開，出發前再確認。"
    ],
    "verificationNote": "地址與免票入店取自店家官網門市頁；國家博物館官網 Cafe 頁說明館內咖啡廳依博物館開放時間營業，冬季時段取自 mnwr.pl 官方參觀資訊頁（搜尋核對；本環境無法直接開啟官網，屬部分核實）。第三方目錄（Apple 地圖等）仍列夏季 10:00–17:00，以官方冬季時段為準；臨時閉館以博物館官網公告為準。",
    "cuisine": "甜點 · 咖啡",
    "dishes": [
      "當日蛋糕",
      "咖啡"
    ]
  },
  "wroclaw-el-gato-specialty-coffee": {
    "id": "wroclaw-el-gato-specialty-coffee",
    "cityKey": "wroclaw",
    "name": "El Gato Specialty Coffee",
    "address": "Odrzańska 8, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=El%20Gato%20Specialty%20Coffee%20Roasters%20Odrza%C5%84ska%208%2C%20Wroc%C5%82aw",
    "hours": "每日 08:00–20:00（Odrzańska 8 分店）",
    "sourceUrl": "https://elgatocoffee.pl/kontakt/",
    "checkedAt": "2026-09-24",
    "verificationStatus": "verified",
    "notes": [
      "老城 Odrzańska 8 分店，自家烘豆：Flat White、手沖與當日甜點；Day 5 有餘裕才去，不壓縮座堂島。"
    ],
    "verificationNote": "官方聯絡頁逐分店列時段；先前 09:00–18:00／週末 10:00–18:00 屬 Trzebnica，不能套用 Wrocław 老城分店。",
    "cuisine": "精品咖啡",
    "dishes": [
      "Flat White",
      "手沖咖啡",
      "當日甜點"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "wroclaw-dessert-boutique": {
    "id": "wroclaw-dessert-boutique",
    "cityKey": "wroclaw",
    "name": "Dessert Boutique",
    "address": "Świętego Mikołaja 43, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Dessert%20Boutique%20%C5%9Awi%C4%99tego%20Miko%C5%82aja%2043%2C%20Wroc%C5%82aw",
    "hours": "實體店：週二至週五 12:00–19:00；週六、週日 11:00–20:00；週一未列",
    "sourceUrl": "https://dessertboutique.pl/pages/contact",
    "checkedAt": "2026-09-24",
    "verificationStatus": "partial",
    "notes": [
      "Świętego Mikołaja 43，Day 5 甜點候選，樂斯拉夫精緻歐式甜點店。"
    ],
    "verificationNote": "官方聯絡頁與門市頁一致；週一實體店狀態未列，線上服務每日 09:00–17:00 不等於門市營業時間。Day 5 週三適用 12:00–19:00。"
  },
  "poznan-cukiernia-kandulski": {
    "id": "poznan-cukiernia-kandulski",
    "cityKey": "poznan",
    "name": "Cukiernia Kandulski",
    "address": "Plac Cyryla Ratajskiego 1, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Cukiernia%20Kandulski%2C%20Plac%20Cyryla%20Ratajskiego%201%2C%20Pozna%C5%84",
    "hours": "週一至週五 09:00–17:00；週六 09:00–13:00；週日休",
    "sourceUrl": "https://kandulski.pl/lokalizacje/",
    "checkedAt": "2026-10-17",
    "verificationStatus": "partial",
    "notes": [
      "聖馬丁可頌 PGI 認證店家；Stary Rynek 沒有分店，最近的是 Plac Ratajskiego 1，在往帝王城堡的路上，ROGAL 售完時改這間。"
    ],
    "cuisine": "PGI 認證糕點",
    "dishes": [
      "Rogal świętomarciński 聖馬丁可頌"
    ],
    "phone": "+48 61 855 34 82",
    "verificationNote": "官網分店頁 重查確認；10/29 週四 09:00–17:00（Google 地圖週四 09:00–17:00 一致）。",
    "liveCheckedAt": "2026-10-17",
    "hoursNote": "官網"
  },
  "poznan-weranda-caffe": {
    "id": "poznan-weranda-caffe",
    "cityKey": "poznan",
    "name": "Weranda Caffe",
    "address": "Świętosławska 10, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Weranda%20Caffe%2C%20%C5%9Awi%C4%99tos%C5%82awska%2010%2C%20Pozna%C5%84",
    "hours": "週一 10:00–20:00；週二至週四 09:00–22:00；週五、六 09:00–23:00；週日 09:00–20:00",
    "sourceUrl": "https://werandafamily.com/pl/restaurant/weranda-caffe",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Świętosławska 10，舊城市場旁，庭院座位安靜，全天供應早餐；週四 09:00 才開，不當早餐；10/29 11:05 從皇家城堡山丘下來進來坐，等 12:00 山羊秀。"
    ],
    "verificationNote": "官網確認門市與時段；Stary Browar 另有分店。",
    "hoursNote": "Weranda Family 官網",
    "liveCheckedAt": "2026-10-12",
    "cuisine": "早午餐咖啡館",
    "dishes": [
      "全天早餐",
      "咖啡",
      "甜點"
    ],
    "phone": "+48 61 853 25 87"
  },
  "poznan-pijalnia-czekolady-e-wedel-stary-rynek": {
    "id": "poznan-pijalnia-czekolady-e-wedel-stary-rynek",
    "cityKey": "poznan",
    "name": "Pijalnia Czekolady E.Wedel · Stary Rynek",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Pijalnia%20Czekolady%20E.Wedel%20Stary%20Rynek%20Pozna%C5%84",
    "hours": "依店家當日公告",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "舊城市場上的 Wedel 巧克力沙龍，雨天或等表演時的室內選擇。"
    ]
  },
  "warsaw-u-fukiera": {
    "id": "warsaw-u-fukiera",
    "cityKey": "warsaw",
    "name": "U Fukiera",
    "address": "Rynek Starego Miasta 27, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=U%20Fukiera%2C%20Rynek%20Starego%20Miasta%2027%2C%20Warszawa",
    "hours": "週一至週四 12:00–23:00；週五、週六 12:00–23:30；週日 12:00–23:00",
    "sourceUrl": "https://www.ufukiera.pl/kontakt/",
    "checkedAt": "2026-08-09",
    "verificationStatus": "verified",
    "notes": [
      "歷史老城波蘭料理；綜合 Pierogi、Żurek、波蘭烤鴨，老城收尾的最後一晚氣氛。",
      "官網菜單可確認 żurek、餃子、鯡魚與韃靼牛肉。",
      "秋季菜單候選：番茄南瓜濃湯、Stroganow 牛菲力；供應以當日菜單為準。"
    ],
    "verificationNote": "沿用 店家官網查核日，不冒充本輪重新查核。官網廚房至 22:30。",
    "menuUrl": "https://www.ufukiera.pl/menu/",
    "menuNote": "初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "老城波蘭菜",
    "dishes": [
      "Żurek 酸黑麥湯",
      "綜合 Pierogi",
      "波蘭烤鴨",
      "韃靼牛肉"
    ],
    "phone": "+48 22 831 10 13",
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-polka": {
    "id": "warsaw-polka",
    "cityKey": "warsaw",
    "name": "Polka",
    "address": "Świętojańska 2（皇家城堡旁）",
    "map": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Polka%2C%20%C5%9Awi%C4%99toja%C5%84ska%202%2C%20Warszawa",
    "hours": "每日 12:00–22:00；平日 12:00–16:00 午間套餐",
    "sourceUrl": "https://warszawa.restauracjapolka.pl/about-us",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "傳統波蘭料理，Świętojańska 2 就在皇家城堡旁；10/30 走完 Piwna 街、城堡廣場與聖安妮教堂外觀，12:30 進來吃午餐，平日 12:00–16:00 有午間套餐。",
      "不是 U Fukiera 的同一間店。"
    ],
    "cuisine": "波蘭菜（Magda Gessler）",
    "dishes": [
      "Pierogi 餃子",
      "Żurek 酸黑麥湯",
      "平日午間套餐"
    ],
    "phone": "+48 22 635 35 35",
    "verificationNote": "官網每日 12:00–22:00；Yelp 列至 23:00。",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網"
  },
  "warsaw-wedel-krakowskie-45": {
    "id": "warsaw-wedel-krakowskie-45",
    "cityKey": "warsaw",
    "name": "E.Wedel Pijalnia · Krakowskie Przedmieście 45",
    "address": "Krakowskie Przedmieście 45, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Pijalnia%20Czekolady%20E.Wedel%2C%20Krakowskie%20Przedmie%C5%9Bcie%2045%2C%20Warszawa",
    "hours": "週一至週四 10:00–22:00；週五、週六 10:00–23:00；週日 10:00–22:00",
    "sourceUrl": "https://wedelpijalnie.pl/lokale",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "E.Wedel 巧克力飲品與甜點；",
      "已鎖定分店，避免套用商場分店的週日休店規則。"
    ],
    "verificationNote": "官方分店頁確認；與 Szpitalna 8 是兩間不同分店，必須用地址共同對接。"
  },
  "warsaw-specjaly-regionalne": {
    "id": "warsaw-specjaly-regionalne",
    "booking": "recommended",
    "cityKey": "warsaw",
    "name": "Specjały Regionalne",
    "address": "Nowy Świat 44, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Specja%C5%82y%20Regionalne%20Nowy%20%C5%9Awiat%2044%2C%20Warszawa",
    "hours": "品牌門市頁：週日至週四 11:30–22:00；週五、週六 11:30–23:00",
    "sourceUrl": "https://www.specjalyregionalne.pl/sklepy-stacjonarne/",
    "checkedAt": "2026-09-24",
    "verificationStatus": "partial",
    "notes": [
      "波蘭地方料理。",
      "Żurek 酸黑麥湯＋綜合 Pierogi，主菜選梅醬豬肋排或半隻烤鴨；還有胃口再加甜點。"
    ],
    "verificationNote": "品牌門市頁確認 Nowy Świat 44 與上述時段；polishcuisine.pl 另列每日 12:00 開門、週五六至 23:30，其餘至 22:00，仍需訂位確認。週六時段各來源 11:30–23:00 至 12:00–23:30 不一，需以現場為準。",
    "menuUrl": "https://polishcuisine.pl/pl/menu-2/",
    "menuNote": "初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "波蘭地方菜",
    "dishes": [
      "Żurek 酸黑麥湯",
      "綜合 Pierogi 餃子",
      "梅醬豬肋排",
      "半隻烤鴨"
    ],
    "phone": "+48 662 254 215",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "與另一官方站版本不一致"
  },
  "warsaw-pyzy-flaki-gorace": {
    "id": "warsaw-pyzy-flaki-gorace",
    "cityKey": "warsaw",
    "name": "Pyzy Flaki Gorące",
    "address": "Podwale 5, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Pyzy%20Flaki%20Gor%C4%85ce%20Podwale%205%2C%20Warszawa",
    "hours": "週一至週六 12:00–22:00；週日 12:00–21:00",
    "sourceUrl": "https://www.pyzyflakigorace.pl/kontakt/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "老城店，馬鈴薯糰與牛肚湯。"
    ],
    "verificationNote": "官網補齊週六 12:00–22:00；老城店在 Podwale 5。",
    "cuisine": "華沙小館",
    "dishes": [
      "Pyzy 馬鈴薯糰",
      "Flaki 牛肚湯"
    ],
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網，Podwale 5 與 Brzeska 兩店同"
  },
  "krakow-hankki": {
    "id": "krakow-hankki",
    "booking": "walk-in",
    "cityKey": "krakow",
    "name": "Hankki",
    "address": "Zabłocie 19A, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Hankki%20Zab%C5%82ocie%2019A%2C%20Krak%C3%B3w",
    "hours": "週日 13:00–21:00",
    "sourceUrl": "https://guide.michelin.com/cz/en/lesser-poland/krakow/restaurant/hankki",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "韓日料理。最後點餐約 20:45（推測，出發前再確認）；不用訂位，現場候位；出餐慢，一次點完。",
      "Gyoza 煎餃、Honey Garlic Popcorn Chicken 蜂蜜蒜味炸雞、Kimbap 飯捲與 Bibimbap 拌飯；另有 Red jjamppong 辣湯麵。"
    ],
    "verificationNote": "週日 13:00–21:00，最後點餐約 20:45（推測，出發前再確認）；不用訂位，現場候位；出餐慢，一次點完。",
    "menuUrl": "https://guide.michelin.com/cz/en/lesser-poland/krakow/restaurant/hankki",
    "menuNote": "初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "韓式",
    "dishes": [
      "Gyoza 煎餃",
      "Honey Garlic Popcorn Chicken",
      "Kimbap 飯捲",
      "Bibimbap 拌飯",
      "Red jjamppong 辣湯麵"
    ],
    "phone": "+48 798 399 851",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Wanderlog、Pearl；Restaurant Guru 列至 22:00"
  },
  "wieliczka-wieliczka-鎮中心午餐": {
    "id": "wieliczka-wieliczka-鎮中心午餐",
    "cityKey": "wieliczka",
    "name": "Wieliczka 鎮中心午餐",
    "address": "Wieliczka 鎮中心",
    "map": "https://www.google.com/maps/search/?api=1&query=restaurants+Wieliczka+Rynek",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "鎮中心午餐安排，尚未指定餐廳。"
    ]
  },
  "wieliczka-sztolnia": {
    "id": "wieliczka-sztolnia",
    "cityKey": "krakow",
    "name": "Sztolnia Wieliczka",
    "address": "ul. Zamkowa 5, 32-020 Wieliczka",
    "map": "https://maps.app.goo.gl/P9NgnL6Qk6hmp4xKA",
    "hours": "週一至週四、週日 11:00–22:00；週五、週六 11:00–23:00",
    "sourceUrl": "https://maps.app.goo.gl/P9NgnL6Qk6hmp4xKA",
    "menuUrl": "https://sztolniawieliczka.restaurants-info.com/menu",
    "checkedAt": "2026-10-23",
    "verificationStatus": "partial",
    "booking": "walk-in",
    "notes": [
      "豬肋排份量大，兩人分一份再加湯；13:20 前結帳。",
      "未訂位、現場入座；付款方式未查到，卡與少量現金都帶。"
    ],
    "dishes": [
      "ŻEBERKA WIEPRZOWE 蜂蜜啤酒豬肋排 57 zł",
      "ŻEBERKA WIEPRZOWE 蒜味豬肋排 57 zł",
      "ŻEBERKA WOŁOWE BBQ 牛肋排 90 zł"
    ],
    "verificationNote": "營業時間與價格來自第三方；以現場菜單為準。OSM 列每日 11:00–20:00，與第三方不一致；午餐時段不受影響。OSM 社群資料標示收卡、建議訂位。"
  },
  "krakow-obwarzanek-tunel": {
    "id": "krakow-obwarzanek-tunel",
    "cityKey": "krakow",
    "name": "Obwarzanek Krakowski - Tunel",
    "address": "skrzyżowanie Basztowa – Lubicz – Westerplatte, Pawia lokal nr 2, Kraków",
    "map": "https://maps.app.goo.gl/eYkM3UFkHK4ZfpUu5",
    "hours": "每日 08:00–18:00",
    "sourceUrl": "https://maps.app.goo.gl/eYkM3UFkHK4ZfpUu5",
    "checkedAt": "2026-10-23",
    "verificationStatus": "partial",
    "booking": "walk-in",
    "notes": [
      "Basztowa／Lubicz 地下道的克拉科夫圈餅，先水煮再烤；可外帶當車上點心。",
      "付款方式未查到，準備零錢。"
    ],
    "dishes": [
      "芝麻或罌粟籽圈餅"
    ],
    "verificationNote": "營業時間來自第三方，以現場公告為準。"
  },
  "wieliczka-bistro-posolone": {
    "id": "wieliczka-bistro-posolone",
    "cityKey": "wieliczka",
    "name": "Bistro Posolone",
    "address": "park Kingi 6, Wieliczka（鹽礦園區）",
    "map": "https://www.google.com/maps/search/?api=1&query=Bistro%20Posolone%2C%20park%20Kingi%206%2C%20Wieliczka",
    "hours": "每日 08:00–18:00",
    "sourceUrl": "https://www.kopalnia.pl/zasmakuj-w-kopalni",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "鹽礦入口旁的礦方餐廳：湯、披薩、漢堡、麵食等簡餐"
    ],
    "verificationNote": "礦方官網只寫「每日於鹽礦開放時間內營業」，未列確切開關門時刻與門牌；出礦後依現場指標前往。多數目錄每日 08:00–18:00，新增季節湯與 pierogi。",
    "menuUrl": "https://www.kopalnia.pl/menu-bistro-posolone",
    "menuNote": "菜單連結與餐點建議沿用使用者初稿，當日供應待確認。",
    "cuisine": "鹽礦簡餐",
    "dishes": [
      "當日湯（番茄湯約 14 PLN）",
      "Pierogi ruskie（約 25 PLN）",
      "漢堡、披薩、沙拉"
    ],
    "phone": "+48 12 278 75 20",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "目錄；礦方官網只寫依鹽礦開放時間"
  },
  "wieliczka-karczma-gornicza": {
    "id": "wieliczka-karczma-gornicza",
    "cityKey": "wieliczka",
    "name": "Karczma Górnicza",
    "address": "Kopalnia Soli Wieliczka",
    "map": "https://www.google.com/maps/search/?api=1&query=Karczma+Gornicza+Kopalnia+Soli+Wieliczka",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "鹽礦地下餐廳；官方營業資訊矛盾，未確認前不採用。"
    ]
  },
  "wroclaw-samarqand": {
    "id": "wroclaw-samarqand",
    "cityKey": "wroclaw",
    "name": "Samarqand",
    "address": "Stawowa 23, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Samarqand%20Stawowa%2023%2C%20Wroc%C5%82aw",
    "hours": "週一至週四、週日 08:00–23:00；週五、週六 08:00–00:00；廚房於關門前 1 小時結束",
    "sourceUrl": "https://samarqand.pl",
    "checkedAt": "2026-09-19",
    "verificationStatus": "partial",
    "notes": [
      "烏茲別克／喬治亞料理；牛肉抓飯 Plow fergański（Uzbek Plov）、Manti 分享湯餃與湯品，可加船形起司麵包。"
    ],
    "verificationNote": "官網與店家 eatbu 頁時段不一致；關門前 1 小時廚房結束不等於最後接單。約 21:00 前能到店且確認仍接單才採用，否則改車站 KFC。週二各來源 12:00 或 08:00 開、22:00 或 23:00 關；以 21:00 前入座為準。",
    "menuUrl": "https://samarqand.pl/menu",
    "cuisine": "烏茲別克菜",
    "dishes": [
      "Plov 抓飯",
      "Manti 蒸餃",
      "Lagman 拉麵湯",
      "Khachapuri 船形起司麵包"
    ],
    "phone": "+48 603 183 949",
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-yache-korea": {
    "id": "warsaw-yache-korea",
    "cityKey": "warsaw",
    "name": "Yache Korea",
    "address": "Nowogrodzka 25, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Yache%20Korea%20Nowogrodzka%2025%2C%20Warszawa",
    "hours": "週一至週四 12:00–20:30；週五 12:00–21:30",
    "sourceUrl": "https://yachekorea.com/",
    "checkedAt": "2026-09-17",
    "verificationStatus": "verified",
    "notes": [
      "韓式料理：Kkanpungi、Bulgogi、Kimchijjigae。"
    ],
    "verificationNote": "保留原查核日；10/29 週四 19:59（Koleo）才抵華沙，不可當晚抵備案。週末時段未納入本次已核實內容。官網、Wolt、Uber Eats 週四仍為 12:00–20:30。",
    "cuisine": "韓式",
    "dishes": [
      "Kkanpungi 辣炸雞",
      "Bulgogi",
      "Kimchi jjigae 泡菜鍋"
    ],
    "phone": "+48 518 072 059",
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-arirang-restaurant": {
    "id": "warsaw-arirang-restaurant",
    "cityKey": "warsaw",
    "name": "Arirang Restaurant",
    "address": "Nowogrodzka 38, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Arirang%20Restaurant%20Nowogrodzka%2038%2C%20Warszawa",
    "hours": "週四 12:00–22:00",
    "sourceUrl": "https://gdziezjescwarszawa.com/miejsca/arirang-nowogrodzka-38/",
    "checkedAt": "2026-10-23",
    "verificationStatus": "partial",
    "notes": [
      "韓式料理：Bulgogi 韓式烤牛肉、拌飯、Jajangmyeon 炸醬麵、海鮮煎餅或韓式湯鍋。"
    ],
    "verificationNote": "Google 地圖資料轉載目錄（gdziezjescwarszawa、menuradar，2026-10-23 查）列週四 12:00–22:00、週二公休；無店家官網，最後點餐時間查不到，出發前再確認。",
    "cuisine": "韓式",
    "dishes": [
      "Bulgogi 韓式烤牛肉",
      "Bibimbap 拌飯",
      "Jajangmyeon 炸醬麵",
      "Haemul pajeon 海鮮煎餅"
    ],
    "phone": "+48 22 881 78 51",
    "liveCheckedAt": "2026-10-23",
    "hoursNote": "Google 地圖資料轉載目錄列週四 12:00–22:00、週二公休；最後點餐時間查不到，出發前再確認。"
  },
  "warsaw-mei": {
    "id": "warsaw-mei",
    "cityKey": "warsaw",
    "name": "MEI",
    "address": "Solec 81B, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=MEI%20Solec%2081B%2C%20Warszawa",
    "hours": "週一至週四、週日 12:00–21:00；週五、週六 12:00–22:00",
    "sourceUrl": "https://mei.eatbu.com/?lang=en",
    "checkedAt": "2026-09-24",
    "verificationStatus": "verified",
    "notes": [
      "韓式烤肉。"
    ],
    "verificationNote": "以瀏覽器讀出店家官網動態週時段及官方 Google Maps 商家定位。Yelp 2026-07 列週六 11:30–22:00、週日 12:00–18:00，與本站時段略有差異。",
    "cuisine": "韓式烤肉",
    "dishes": [
      "韓式桌邊烤肉",
      "壽司"
    ],
    "phone": "+48 571 219 973",
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-qq-warsaw-matcha-korean-toasts": {
    "id": "warsaw-qq-warsaw-matcha-korean-toasts",
    "cityKey": "warsaw",
    "name": "QQ Warsaw | Matcha & Korean Toasts",
    "address": "Żurawia 32/34, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=QQ%20Warsaw%2C%20%C5%BBurawia%2032%2F34%2C%20Warszawa",
    "hours": "週一至週五 11:00–20:00；週六、日 10:00–20:00；廚房至 19:30",
    "sourceUrl": "https://www.instagram.com/qqwarsaw/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Żurawia 32/34 的抹茶與韓式吐司小店；10/30 新路線不排入的下午點心備選。"
    ],
    "verificationNote": "店家 Instagram 時段；另有目錄列週二休，前往前確認。",
    "cuisine": "韓式吐司 · 抹茶",
    "dishes": [
      "韓式吐司",
      "抹茶拿鐵"
    ],
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "店家 Instagram"
  },
  "krakow-starka": {
    "id": "krakow-starka",
    "cityKey": "krakow",
    "name": "Starka",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Starka+Restauracja+Krakow",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Kazimierz 與廣場"
    ]
  },
  "krakow-szara-ges": {
    "id": "krakow-szara-ges",
    "cityKey": "krakow",
    "name": "Szara Gęś",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Szara+Ges+w+Kuchni+Krakow",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Kazimierz 與廣場"
    ]
  },
  "krakow-klezmer-hois": {
    "id": "krakow-klezmer-hois",
    "cityKey": "krakow",
    "name": "Klezmer-Hois",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Klezmer-Hois+Krakow",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "Kazimierz"
    ]
  },
  "wroclaw-pod-fredra": {
    "id": "wroclaw-pod-fredra",
    "cityKey": "wroclaw",
    "name": "Pod Fredrą",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Restauracja+Pod+Fredra+Wroclaw",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "廣場旁傳統"
    ]
  },
  "wroclaw-jadka": {
    "id": "wroclaw-jadka",
    "cityKey": "wroclaw",
    "name": "Jadka",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Jadka+Wroclaw",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "廣場旁傳統"
    ]
  },
  "warsaw-alon-omakase": {
    "id": "warsaw-alon-omakase",
    "booking": "required",
    "cityKey": "warsaw",
    "name": "Alon Omakase",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=8029724309073713102",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "role": "reference",
    "notes": [
      "米其林一星 · Edomae 壽司 omakase，僅 omakase.eu 線上訂位，取消／減人照收全額",
      "地圖圖釘參考店，未排入本趟每日餐廳安排"
    ]
  },
  "warsaw-hub-praga": {
    "id": "warsaw-hub-praga",
    "cityKey": "warsaw",
    "name": "hub.praga",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=10117754456971759897",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "role": "reference",
    "notes": [
      "米其林一星 · Praga 區餐廳",
      "地圖圖釘參考店，未排入本趟每日餐廳安排"
    ]
  },
  "warsaw-rozbrat-20": {
    "id": "warsaw-rozbrat-20",
    "booking": "required",
    "cityKey": "warsaw",
    "name": "Rozbrat 20",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Rozbrat%2020%20Warszawa",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "role": "reference",
    "notes": [
      "米其林一星 · rozbrat20.com.pl 訂位，需信用卡、+12.5% 服務費，smart casual、12 歲以上",
      "地圖圖釘參考店，未排入本趟每日餐廳安排"
    ]
  },
  "krakow-bufet-krk": {
    "id": "krakow-bufet-krk",
    "cityKey": "krakow",
    "name": "Bufet KRK",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=861978380086701482",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "role": "reference",
    "notes": [
      "必比登推介 · Bottiglieria 1881 姊妹店，訂不到二星時的替代",
      "地圖圖釘參考店，未排入本趟每日餐廳安排"
    ]
  },
  "krakow-molam-thai": {
    "id": "krakow-molam-thai",
    "cityKey": "krakow",
    "name": "MOLÁM Thai",
    "address": "Rajska 3/4, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=MOL%C3%81M%2C%20Rajska%203%2F4%2C%20Krak%C3%B3w",
    "hours": "出門前看 Google 地圖當日營業",
    "sourceUrl": "https://www.falstaff.com/en/restaurants/molam",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "必比登推介 · 泰式料理",
      "異國料理城市延伸參考。"
    ],
    "verificationNote": "營業時間未核實：Falstaff、Waze、Yelp 等來源列的時段不一（2026-10-21 稽核），出門前看 Google 地圖當日營業。Michelin Bib Gourmand。",
    "cuisine": "泰國伊善料理",
    "dishes": [
      "伊善風味小吃（青木瓜沙拉、烤肉）",
      "泰式咖哩"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "krakow-nat-bistro": {
    "id": "krakow-nat-bistro",
    "cityKey": "krakow",
    "name": "Nat Bistro",
    "address": "門牌待確認",
    "map": "https://maps.google.com/?cid=10025714057570046192",
    "hours": "營業時間待確認",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "role": "reference",
    "notes": [
      "必比登推介",
      "地圖圖釘參考店，未排入本趟每日餐廳安排"
    ]
  },
  "wroclaw-most": {
    "id": "wroclaw-most",
    "cityKey": "wroclaw",
    "name": "Most",
    "address": "Księcia Witolda 1, Wrocław",
    "map": "https://maps.google.com/?cid=9490447263206449328",
    "hours": "Michelin 指南現列一–四 17:00–22:00、五 17:00–23:00、六 14:00–23:00、日 14:00–21:00",
    "sourceUrl": null,
    "checkedAt": null,
    "verificationStatus": "pending",
    "role": "reference",
    "notes": [
      "米其林一星",
      "地圖圖釘參考店，未排入本趟每日餐廳安排"
    ],
    "hoursNote": "尚未經店家官網查核"
  },
  "warsaw-green-caffe-nero-centralny": {
    "id": "warsaw-green-caffe-nero-centralny",
    "cityKey": "warsaw",
    "name": "Green Nero Express PKP Centralny",
    "address": "al. Jerozolimskie 54, Lokal N20（Warszawa Centralna 站內）",
    "map": "https://www.google.com/maps/search/?api=1&query=Green%20Nero%20Express%2C%20PKP%20Centralny%2C%20al.%20Jerozolimskie%2054%2C%20Warszawa",
    "hours": "週日 07:00–19:00；週六 06:00–19:30",
    "sourceUrl": "https://www.yelp.com/biz/green-nero-express-warszawa-2",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "車站外帶：可頌／甜麵包、火腿起司三明治＋Americano 或 Latte；10/25 不經中央車站，僅作城市延伸參考。"
    ],
    "menuUrl": "https://www.greencaffenero.pl/pl/menu/jedzenie/kanapki",
    "verificationNote": "站內門市為 Green Nero Express（Lokal N20；Yelp 2026-03 曾列 24 小時，Google 地圖同連鎖車站旁門市為週日 07:00–19:00、週六 06:00–19:30，並非 24 小時，是否為同一間 N20 未能確認）；站外公車迴轉道另有一個 Box 店。舊資料寫 Lokal N24，以現場指標為準。",
    "cuisine": "車站咖啡外帶",
    "dishes": [
      "可頌／甜麵包",
      "火腿起司三明治",
      "Americano／Latte"
    ],
    "phone": "+48 22 350 70 19",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Google 地圖；Yelp 2026-03 的 24 小時說法未證實，舊目錄另列週日 05:00–22:30"
  },
  "krakow-przypiecek": {
    "id": "krakow-przypiecek",
    "cityKey": "krakow",
    "name": "Przypiecek",
    "address": "Sławkowska 32, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Przypiecek%2C%20S%C5%82awkowska%2032%2C%20Krak%C3%B3w",
    "hours": "24 小時",
    "sourceUrl": "https://www.inyourpocket.com/krakow/przypiecek_18631v",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Mix tradycyjny 綜合餃子；可配甜菜湯。24 小時營業，可作晚到時的替代。"
    ],
    "menuUrl": "https://przypiecek.pl/?page_id=14",
    "verificationNote": "多數來源為 24 小時；當日供餐仍須確認。",
    "cuisine": "餃子 · 24h",
    "dishes": [
      "Mix tradycyjny 綜合餃子",
      "Barszcz 甜菜湯"
    ],
    "phone": "+48 12 422 74 95",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Yelp 2026-07、In Your Pocket；少數目錄列 11:00–21:00"
  },
  "krakow-lajkonik-basztowa": {
    "id": "krakow-lajkonik-basztowa",
    "cityKey": "krakow",
    "name": "Lajkonik Basztowa",
    "address": "Basztowa 15, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Lajkonik%20Basztowa%2C%20Basztowa%2015%2C%20Krak%C3%B3w",
    "hours": "週一至週五 06:00–20:00；週日 07:00–19:00（週六另查）",
    "sourceUrl": "https://lajkonik-pik.pl/shop/kawiarnia-lajkonik-krakow-basztowa-15/",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "notes": [
      "麵包與三明治外帶；隔天早出門的備餐採買點。"
    ],
    "menuUrl": "https://lajkonik-pik.pl/en/menu-2/",
    "verificationNote": "本輪核對官方分店頁；隔夜食物依包裝保存條件，無冷藏就選常溫麵包與水果。",
    "cuisine": "麵包外帶",
    "dishes": [
      "三明治",
      "Drożdżówka 甜麵包",
      "可頌"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "wroclaw-central-cafe": {
    "id": "wroclaw-central-cafe",
    "cityKey": "wroclaw",
    "name": "Central Cafe",
    "address": "Świętego Antoniego 10, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Central%20Cafe%2C%20%C5%9Awi%C4%99tego%20Antoniego%2010%2C%20Wroc%C5%82aw",
    "hours": "週一至週五 07:00 起；週末 08:00 起",
    "sourceUrl": "https://centralcafe.eatbu.com/?lang=pl",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "美式鬆餅、HUMMUS 鷹嘴豆泥貝果、水果核桃燕麥粥；魚類選 LOX NOVA。"
    ],
    "menuUrl": "https://cdn.website.dish.co/media/6b/d4/2420931/Central-Cafe-Menu.pdf",
    "verificationNote": "本輪核對自管頁店址與時段；初稿指出菜單時段涉及自取／配送，不能視為確定開門時間。初稿提供餐點建議；當日供應與最後接單待確認。各來源一致平日 07:00 開門，10/28（週三）07:55 早餐；官方週三 07:00–21:00，出發前再確認。",
    "cuisine": "美式早餐",
    "dishes": [
      "美式鬆餅",
      "HUMMUS 貝果",
      "水果核桃燕麥粥",
      "LOX NOVA 鮭魚貝果"
    ],
    "phone": "+48 71 794 96 23",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "多數來源至 16:00，自管頁列至 21:00"
  },
  "wroclaw-charlotte-pokoyhof": {
    "id": "wroclaw-charlotte-pokoyhof",
    "booking": "walk-in",
    "cityKey": "wroclaw",
    "name": "Charlotte Pasaż Pokoyhof",
    "address": "Świętego Antoniego 2/4, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Charlotte%20Pasa%C5%BC%20Pokoyhof%2C%20%C5%9Awi%C4%99tego%20Antoniego%202%2F4%2C%20Wroc%C5%82aw",
    "hours": "週一至週四 07:00–24:00；週五 07:00–翌日 01:00；週六 08:00–翌日 01:00；週日 08:00–22:00",
    "sourceUrl": "https://bistrocharlotte.com/pl/lokale/charlotte-pasaz-pokoyhof-wroclaw/",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "notes": [
      "French Breakfast、Breakfast with egg、可頌與咖啡；Central Cafe 未供餐時的同街備案（Świętego Antoniego 2/4）。"
    ],
    "menuUrl": "https://bistrocharlotte.com/pl/lokale/charlotte-pasaz-pokoyhof-wroclaw/",
    "verificationNote": "本輪官網核對地址與時段；16:00 前不接受訂位，早餐候位依現場，趕行程改外帶。",
    "cuisine": "法式早餐",
    "dishes": [
      "French Breakfast",
      "Breakfast with egg",
      "可頌＋咖啡"
    ],
    "phone": "+48 608 646 966",
    "liveCheckedAt": "2026-10-12"
  },
  "poznan-ptasie-radio": {
    "id": "poznan-ptasie-radio",
    "cityKey": "poznan",
    "name": "Ptasie Radio",
    "address": "Kościuszki 74/3, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Ptasie%20Radio%2C%20Ko%C5%9Bciuszki%2074%2F3%2C%20Pozna%C5%84",
    "hours": "週一至週五 08:00–24:00，廚房 08:00–23:00；週六 09:00–24:00、週日 09:00–23:00",
    "sourceUrl": "https://www.ptasieradio.pl/en/contact/",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "notes": [
      "麵包搭煙燻鱒魚抹醬、蛋沙拉與凝乳，或班尼迪克蛋。10/29 早餐改 Manekin 後保留為備選。"
    ],
    "menuUrl": "https://www.ptasieradio.pl/menu-restauracji/dania/",
    "verificationNote": "本輪官網確認店址與週四 08:00 開門；採用須另留前往教堂島的交通時間。初稿提供餐點建議；當日供應與最後接單待確認。",
    "cuisine": "早餐咖啡館",
    "dishes": [
      "煙燻鱒魚抹醬配麵包",
      "班尼迪克蛋",
      "蛋沙拉"
    ],
    "phone": "+48 512 357 237",
    "liveCheckedAt": "2026-10-12"
  },
  "poznan-charlotte-krysiewicza": {
    "id": "poznan-charlotte-krysiewicza",
    "booking": "walk-in",
    "cityKey": "poznan",
    "name": "Charlotte Krysiewicza",
    "address": "Krysiewicza 3a/27, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Charlotte%20Krysiewicza%2C%20Krysiewicza%203a%2F27%2C%20Pozna%C5%84",
    "hours": "週一至週四 07:00–24:00；週五 07:00–翌日 01:00；週六 08:00–翌日 01:00；週日 08:00–22:00",
    "sourceUrl": "https://bistrocharlotte.com/pl/lokale/charlotte-krysiewicza-poznan/",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "notes": [
      "French Breakfast、麵包籃、可頌與咖啡；Poznań rugelach（白罌粟籽小可頌）可兩人分享。未排入主行程。"
    ],
    "menuUrl": "https://bistrocharlotte.com/pl/lokale/charlotte-krysiewicza-poznan/",
    "verificationNote": "本輪官網核對地址與時段；16:00 前不接受訂位，早餐候位依現場，趕行程改外帶。官網週四 07:00 開門，早餐全天供應。",
    "cuisine": "法式早餐",
    "dishes": [
      "French Breakfast",
      "麵包籃＋自製果醬",
      "Poznań rugelach 白罌粟籽小可頌"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-warsze-polin": {
    "id": "warsaw-warsze-polin",
    "cityKey": "warsaw",
    "name": "WARSZE by Bracia Wiśniewscy",
    "address": "POLIN, Mordechaja Anielewicza 6, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=WARSZE%20by%20Bracia%20Wi%C5%9Bniewscy%2C%20POLIN%2C%20Mordechaja%20Anielewicza%206%2C%20Warszawa",
    "hours": "隨博物館開放；週五 10:00–18:00",
    "sourceUrl": "https://www.polin.pl/pl/zaplanuj-wizyte/zapraszamy-do-muzealnej-restauracji",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "role": "reference",
    "notes": [
      "猶太與華沙風味當日午餐；czulent、kreplach 為官方曾介紹的菜色，非當日保證。",
      "使用者決定本趟不進 POLIN；此筆僅保留資料，未排入每日餐廳安排。"
    ],
    "menuUrl": "https://www.polin.pl/pl/kolacja-w-warsze-bracia-wisniewscy",
    "verificationNote": "本輪官方頁確認餐廳在 0 樓、進餐廳不必展覽票；10/30 菜單、午餐出餐速度與空位待確認。"
  },
  "warsaw-charlotte-zlota": {
    "id": "warsaw-charlotte-zlota",
    "cityKey": "warsaw",
    "name": "Charlotte Bouillon Złota",
    "address": "Złota 83, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Charlotte%20Bouillon%20Z%C5%82ota%2C%20Z%C5%82ota%2083%2C%20Warszawa",
    "hours": "週六 08:00–翌日 01:00；早餐供應至閉店",
    "sourceUrl": "https://bistrocharlotte.com/pl/lokale/charlotte-bouillon-zlota-warszawa/",
    "checkedAt": "2026-10-10",
    "verificationStatus": "partial",
    "notes": [
      "French Breakfast、可頌、咖啡；想吃飽一點加 Croque-Monsieur。週六 08:00 開門，第一批進店。"
    ],
    "menuUrl": "https://bistrocharlotte.com/pl/lokale/charlotte-bouillon-zlota-warszawa/",
    "verificationNote": "本輪官網核對分店、早餐菜單；離境日需先保留往返住宿取行李的時間。新開幕，官網週六 08:00 開門。",
    "cuisine": "法式早餐",
    "dishes": [
      "French Breakfast（可頌＋咖啡）",
      "Croque-Monsieur",
      "麵包籃＋果醬"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-gate-one-airport": {
    "id": "warsaw-gate-one-airport",
    "cityKey": "warsaw",
    "name": "Gate One",
    "address": "Chopin Airport, Schengen Gate 25/26、27/28, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Gate%20One%2C%20Chopin%20Airport%2C%20Schengen%20Gate%2025%2F26%E3%80%8127%2F28%2C%20Warszawa",
    "hours": "每日 04:00–22:00",
    "sourceUrl": "https://lotnisko-chopina.pl/en/service-points/restaurants/gate-one/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "申根區候選：瑞可塔菠菜義式餃或檸檬酸豆醬鱈魚。"
    ],
    "menuUrl": "https://www.gateone.pl/",
    "verificationNote": "機場官網確認位於出境層申根區中央碼頭（Gate 25–28 一帶）；QR 260 往杜哈走非申根區，過邊檢後到不了，不當首選。",
    "hoursNote": "蕭邦機場官網",
    "liveCheckedAt": "2026-10-12",
    "phone": "+48 781 816 815",
    "cuisine": "機場餐廳"
  },
  "krakow-polonia": {
    "id": "krakow-polonia",
    "cityKey": "krakow",
    "name": "Restauracja Polonia",
    "address": "Basztowa 25, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Polonia%2C%20Basztowa%2025%2C%20Krak%C3%B3w",
    "hours": "每日 12:00–22:00",
    "sourceUrl": "https://hotel-polonia.com.pl/hotel-polonia/restauracja/menu",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Kraków Główny 旁的傳統波蘭菜：Schabowy 炸豬排、Pierogi 與湯品；車站旁用餐參考。"
    ],
    "menuUrl": "https://hotel-polonia.com.pl/hotel-polonia/restauracja/menu",
    "verificationNote": "飯店官網與在地指南列 12:00–22:00；舊目錄的 06:30／07:00 是飯店早餐時段。不要和另一家同名的 Hotel Polonia Park 搞混。",
    "cuisine": "傳統波蘭菜",
    "dishes": [
      "傳統炸豬排配馬鈴薯、炒高麗菜（約 62 PLN）",
      "Pierogi",
      "湯品"
    ],
    "phone": "+48 12 422 12 33",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "飯店官網菜單頁"
  },
  "krakow-pimiento-shop-bistro": {
    "id": "krakow-pimiento-shop-bistro",
    "booking": "recommended",
    "cityKey": "krakow",
    "name": "Pimiento Shop and Bistro",
    "address": "Świętego Filipa 21, 31-150 Kraków",
    "map": "https://www.google.com/maps/place/Pimiento+Shop+and+Bistro/@50.0678495,19.9419987,17z/data=!4m6!3m5!1s0x47165b801404f333:0x34b6de7597d28894!8m2!3d50.0678495!4d19.9419987!16s%2Fg%2F11shrf9xn_",
    "hours": "週一至週六 09:00–20:00；週日 09:00–15:00（Google 地圖與 MapQuest）。早餐菜單 09:00–13:00，午餐菜單 13:00 起（官網）",
    "sourceUrl": "https://pimiento.pl/stary-kleparz/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Stary Kleparz 市場旁的 Pimiento 小型熟食店兼 bistro：阿根廷牛排、Tatar、烤雞、Argentine burger；城市延伸參考，ibis 步行約 7 分。"
    ],
    "menuUrl": "https://pimiento.pl/wp-content/uploads/2025/10/pimiento-shop-and-bistro-menu-calosc.pdf",
    "verificationNote": "營業時間來源：Google 地圖與 MapQuest 皆列週日 09:00–15:00；官網只列菜單時段、未列逐日時間，也查不到 10/25 特殊公告。午餐菜單 13:00 才開始，早餐菜單 09:00–13:00。官網線上訂位只涵蓋 Kazimierz 與 Stare Miasto 分店，Stary Kleparz 用官網表單或 Email pimiento@pimiento.pl 訂位。",
    "phone": "+48 517 475 818",
    "cuisine": "阿根廷牛排／熟食 bistro",
    "dishes": [
      "Tatar z wołowiny argentyńskiej 49 zł",
      "Argentyński burger wołowy 44 zł",
      "阿根廷牛排（Rib-eye 36.50 zł／100 g）",
      "Pajda 麵包片（早餐菜單）"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "poznan-inna-piekarnia": {
    "id": "poznan-inna-piekarnia",
    "cityKey": "poznan",
    "name": "Inna Piekarnia",
    "address": "Ratajczaka 39, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Inna%20Piekarnia%2C%20Ratajczaka%2039%2C%20Pozna%C5%84",
    "hours": "週一至週六 08:30–19:00；週日休",
    "sourceUrl": "https://www.google.com/maps/search/?api=1&query=Inna%20Piekarnia%20Ratajczaka%2039%20Pozna%C5%84",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Butter Croissant、麵包與咖啡；08:30 才開，作為 Manekin 客滿時的早餐備案。"
    ],
    "menuUrl": null,
    "verificationNote": "Ratajczaka 39 分店；另有 Garbary 26 分店。",
    "cuisine": "手作麵包店",
    "dishes": [
      "Butter Croissant",
      "酸種麵包",
      "咖啡"
    ],
    "phone": "+48 724 019 494",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Instagram、多個目錄"
  },
  "wroclaw-oseyo-25": {
    "id": "wroclaw-oseyo-25",
    "cityKey": "wroclaw",
    "name": "Oseyo 25",
    "address": "Malarska 25, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Oseyo%2025%2C%20Malarska%2025%2C%20Wroc%C5%82aw",
    "hours": "每日 12:00–22:00",
    "sourceUrl": "https://www.tripadvisor.com/Restaurant_Review-g274812-d24106343-Reviews-Oseyo_25-Wroclaw_Lower_Silesia_Province_Southern_Poland.html",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "老城 Malarska 25 的韓式小館；Wrocławska 客滿時的韓式午餐備選，離老城廣場步行約 5 分。"
    ],
    "menuUrl": null,
    "verificationNote": "門牌與每日 12:00–22:00 由多個第三方來源一致確認；沒有店家官網。",
    "cuisine": "韓式",
    "dishes": [
      "Bibimbap 拌飯",
      "韓式炸雞"
    ],
    "phone": "+48 535 731 862",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Tripadvisor 等多來源一致"
  },
  "wroclaw-max-wroclavia": {
    "id": "wroclaw-max-wroclavia",
    "cityKey": "wroclaw",
    "name": "MAX Premium Burgers Wroclavia",
    "address": "Sucha 1, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=MAX%20Premium%20Burgers%20Wroclavia%2C%20Sucha%201%2C%20Wroc%C5%82aw",
    "hours": "週一至週四 08:00–翌日 01:00；週五、六 07:00–翌日 02:00；週日 07:00–翌日 01:00",
    "sourceUrl": "https://www.maxpremiumburgers.pl/znajdz-max/restauracje/wroclaw3/",
    "checkedAt": "2026-09-19",
    "verificationStatus": "partial",
    "notes": [
      "Frisco Burger 牛肉培根漢堡、Halloumi 起司漢堡或地瓜薯條；趕車優先外帶。"
    ],
    "menuUrl": "https://www.maxpremiumburgers.pl/jedzenie/nasze-menu/",
    "verificationNote": "時段沿用專案 官方查核及 初稿；當日候餐速度待確認。",
    "cuisine": "瑞典漢堡",
    "dishes": [
      "Frisco Burger",
      "Halloumi Burger",
      "地瓜薯條"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "wroclaw-kfc-pkp": {
    "id": "wroclaw-kfc-pkp",
    "cityKey": "wroclaw",
    "name": "KFC Wrocław PKP",
    "address": "Piłsudskiego 105",
    "map": "https://www.google.com/maps/search/?api=1&query=KFC%20Wroc%C5%82aw%20PKP%2C%20Pi%C5%82sudskiego%20105%2C%20Wroc%C5%82aw",
    "hours": "週一至週三、週日 06:01–翌日 01:00；週四 06:01–翌日 02:00；週五六時段另見官方分店頁",
    "sourceUrl": "https://kfc.pl/restauracje/kfc-wroclaw-pkp-888",
    "checkedAt": "2026-10-10",
    "verificationStatus": "verified",
    "notes": [
      "車站內炸雞與捲餅：Zinger、Twister、Hot Wings 或 Strips；晚抵或趕車時的備案，可內用或外帶上車。"
    ],
    "menuUrl": "https://kfc.pl/menu",
    "verificationNote": "官方分店頁核對；同為翌日 01:00 的店家，不宣稱 MAX 比此店更晚。",
    "cuisine": "速食",
    "dishes": [
      "Zinger 香辣雞腿堡",
      "Twister 捲餅",
      "Hot Wings"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "krakow-mr-jerry": {
    "id": "krakow-mr-jerry",
    "booking": "booked",
    "cityKey": "krakow",
    "name": "Mr. Jerry",
    "address": "Jagiellońska 5, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Mr.%20Jerry%2C%20Jagiello%C5%84ska%205%2C%20Krak%C3%B3w",
    "hours": "週一 15:00–22:00",
    "sourceUrl": "https://www.mrjerry.pl/mr-jerry-krakow/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "老城牛排館，官網菜單寫「kultowy Beef Wellington」（招牌威靈頓牛排）；胃口大可加乾式熟成牛排。",
      "10/26 18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點；離 ibis 步行約 10 分。"
    ],
    "menuUrl": "https://www.mrjerry.pl/o-nas-krakow/",
    "verificationNote": "官網確認 2024 年 5 月開幕、Jagiellońska 5、菜單有招牌 Beef Wellington；In Your Pocket 與 Tripadvisor 評論也提到。週一時段以多數來源為準。",
    "cuisine": "牛排館",
    "dishes": [
      "Beef Wellington 威靈頓牛排（份量大）",
      "熔岩石板牛排",
      "Steakboard 分享拼盤"
    ],
    "phone": "+48 533 836 624",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "Tripadvisor、Apple Maps、Restaurant Guru 一致；官網各區塊互相矛盾"
  },
  "krakow-charlotte-plac-szczepanski": {
    "id": "krakow-charlotte-plac-szczepanski",
    "booking": "walk-in",
    "cityKey": "krakow",
    "name": "Charlotte Plac Szczepański",
    "address": "plac Szczepański 2, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Charlotte%2C%20plac%20Szczepa%C5%84ski%202%2C%20Krak%C3%B3w",
    "hours": "週一至週四 07:00–24:00；週五 07:00–01:00；週六 08:00–01:00；週日 08:00–22:00",
    "sourceUrl": "https://bistrocharlotte.com/en/lokale/charlotte-plac-szczepanski-krakow/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "French Breakfast、麵包籃配自製果醬、可頌與蛋料理（Breakfast with egg）＋咖啡。"
    ],
    "menuUrl": null,
    "verificationNote": "官網確認 plac Szczepański 2、週二 07:00 開門，早餐供應到關門；16:00 前不收訂位，現場候位。",
    "cuisine": "法式早餐",
    "dishes": [
      "French Breakfast（可頌＋咖啡，約 18 PLN）",
      "Charlotte Breakfast 麵包籃（約 26 PLN）",
      "蛋料理"
    ],
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網"
  },
  "krakow-milkbar-tomasza": {
    "id": "krakow-milkbar-tomasza",
    "cityKey": "krakow",
    "name": "Milkbar Tomasza",
    "address": "Świętego Tomasza 24, Kraków",
    "map": "https://www.google.com/maps/search/?api=1&query=Milkbar%20Tomasza%2C%20%C5%9Awi%C4%99tego%20Tomasza%2024%2C%20Krak%C3%B3w",
    "hours": "週一休；週二至週六 08:00–18:00；週日 09:00–18:00",
    "sourceUrl": "https://milkbar-tomasza-krakow.pl/kontakt",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "牛奶吧／平價波蘭料理體驗；可作城市延伸參考。"
    ],
    "menuUrl": null,
    "verificationNote": "官網確認門牌與時段；10/25 週日 09:00–18:00 有開。",
    "cuisine": "牛奶吧",
    "dishes": [
      "Pierogi",
      "Kotlet schabowy 炸豬排",
      "每日湯品"
    ],
    "phone": "+48 12 422 17 06",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網"
  },
  "krakow-pasibus-galeria-krakowska": {
    "id": "krakow-pasibus-galeria-krakowska",
    "cityKey": "krakow",
    "name": "Pasibus Galeria Krakowska",
    "address": "Pawia 5",
    "map": "https://www.google.com/maps/search/?api=1&query=Pasibus%20Galeria%20Krakowska%2C%20Pawia%205%2C%20Krak%C3%B3w",
    "hours": "週一–六 09:00–22:00；週日 09:30–21:00",
    "sourceUrl": "https://pasibus.pl/lokalizacje/krakow/pasibus-krakow-galeria-krakowska/",
    "checkedAt": "2026-09-19",
    "verificationStatus": "verified",
    "notes": [
      "Galeria Krakowska（中央車站旁）的樂斯拉夫本土漢堡，推薦 Gonzalez；同層另有 Berlin Döner（週日 10:00–21:00）。",
      "車站旁的速食備案。"
    ],
    "menuUrl": null,
    "verificationNote": "沿用速食門市 官網查核；10/25 為非營業週日，商場是否開門當日再確認。",
    "cuisine": "本土漢堡",
    "dishes": [
      "Gonzalez（微辣）",
      "Chorizard",
      "Awokodus 酪梨堡"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "wroclaw-pasibus-wroclavia": {
    "id": "wroclaw-pasibus-wroclavia",
    "cityKey": "wroclaw",
    "name": "Pasibus Wroclavia",
    "address": "Sucha 1, Wrocław",
    "map": "https://www.google.com/maps/place/Pasibus+%7C+Better+Burger/@51.0961134,17.033663,17z/data=!3m1!4b1!4m6!3m5!1s0x470fc26f5f6e0217:0xcba5f296c1614565!8m2!3d51.0961134!4d17.033663!16s%2Fg%2F11gd1rxd65",
    "hours": "週一–六 09:00–22:00；週日 11:00–21:00",
    "sourceUrl": "https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-wroclavia/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "verified",
    "notes": [
      "Wroclavia（中央車站旁）的本土漢堡，推薦 Gonzalez；MAX 排隊時的同商場替代，也是 10/27 抵樂斯拉夫後的宵夜選項（週二營業到 22:00）。"
    ],
    "menuUrl": null,
    "verificationNote": "再讀官方分店頁，時間不變（週一至週六 09:00–22:00、週日 11:00–21:00）；Google 地圖未顯示逐日時間，最後點餐時間未查到，宵夜以 21:30 前到店為準。",
    "phone": "+48 732 192 561",
    "cuisine": "本土漢堡",
    "dishes": [
      "Gonzalez（微辣）",
      "Chorizard",
      "Triple Smash"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "poznan-zen-on": {
    "id": "poznan-zen-on",
    "cityKey": "poznan",
    "name": "Zen On",
    "address": "Święty Marcin 21, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Zen%20On%2C%20%C5%9Awi%C4%99ty%20Marcin%2021%2C%20Pozna%C5%84",
    "hours": "週一休；週二至週四、週日 12:00–20:00；週五、六 12:00–22:00",
    "sourceUrl": "https://guide.michelin.com/en/wielkopolskie/poznan_2395985/restaurant/zen-on",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Michelin 推薦日式拉麵：拉麵、烏龍麵、bao；Pyra Bar 排隊太久時的同街區備選。"
    ],
    "menuUrl": null,
    "verificationNote": "Michelin 推薦；餐廳 FAQ 與多個目錄一致。尖峰常排隊。",
    "cuisine": "日式拉麵",
    "dishes": [
      "拉麵",
      "烏龍麵",
      "Bao 刈包"
    ],
    "phone": "+48 609 116 450",
    "liveCheckedAt": "2026-10-12"
  },
  "poznan-pasibus-swiety-marcin": {
    "id": "poznan-pasibus-swiety-marcin",
    "cityKey": "poznan",
    "name": "Pasibus Święty Marcin",
    "address": "Święty Marcin 58/64, Poznań",
    "map": "https://www.google.com/maps/place/Pasibus+%7C+Better+Burger/@52.407038,16.922813,17z/data=!3m1!4b1!4m6!3m5!1s0x47045b880e1b4933:0xfbcc8de511cb1063!8m2!3d52.407038!4d16.922813!16s%2Fg%2F11sx0f3ln7",
    "hours": "週日–四 12:00–23:00；週五–六 12:00–00:00",
    "sourceUrl": "https://pasibus.pl/lokalizacje/poznan/lokal-pasibus-sw-marcin/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "verified",
    "notes": [
      "市中心主街街邊店，推薦 Gonzalez；Pyra Bar 排隊太久時的速食備案，往帝王城堡順路；也是 10/28 抵波茲南後的宵夜選項（週三營業到 23:00）。"
    ],
    "menuUrl": null,
    "verificationNote": "再讀官方分店頁，時間不變（週日至週四 12:00–23:00、週五至週六 12:00–24:00）；最後點餐時間未查到，宵夜以 22:30 前到店為準。從 Towarowa 37 步行約 10 分（座標估算）。",
    "phone": "+48 512 553 285",
    "cuisine": "本土漢堡",
    "dishes": [
      "Gonzalez（微辣）",
      "Chorizard",
      "Triple Smash"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-pasibus-zlote-tarasy": {
    "id": "warsaw-pasibus-zlote-tarasy",
    "cityKey": "warsaw",
    "name": "Pasibus Złote Tarasy",
    "address": "Złota 59, Warszawa",
    "map": "https://www.google.com/maps/place/Pasibus+%7C+Better+Burger/@52.230079,21.0024459,17z/data=!3m1!4b1!4m6!3m5!1s0x471ecc8da58f0dd5:0x74c5fc115ab0a7b8!8m2!3d52.230079!4d21.0024459!16s%2Fg%2F11g01_3w_5",
    "hours": "週一–六 09:00–22:00；週日 09:00–21:00",
    "sourceUrl": "https://pasibus.pl/lokalizacje/warszawa/warszawa-zlote-tarasy/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "verified",
    "notes": [
      "Złote Tarasy（中央車站對面）；同商場另有 KFC、MAX、Berlin Döner，皆約 22:00 關。10/29 Arirang 來不及時的速食備案，也是抵華沙後的宵夜選項（週四營業到 22:00）。"
    ],
    "menuUrl": null,
    "verificationNote": "再讀官方分店頁，時間不變；22:00 關門，最後點餐時間未查到，宵夜以 21:30 前到店為準，誤點過晚改 Nowy Świat 分店（營業到翌日 01:00）或 Ćma。",
    "phone": "+48 518 327 787",
    "cuisine": "本土漢堡",
    "dishes": [
      "Gonzalez（微辣）",
      "Chorizard",
      "Triple Smash"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-pasibus-nowy-swiat": {
    "id": "warsaw-pasibus-nowy-swiat",
    "cityKey": "warsaw",
    "name": "Pasibus Nowy Świat",
    "address": "Nowy Świat 29, Warszawa",
    "map": "https://www.google.com/maps/place/Pasibus+%7C+Better+Burger/@52.233142,21.0167101,17z/data=!4m6!3m5!1s0x471ecd8b1d992077:0xfe2d8f626f94676b!8m2!3d52.233142!4d21.019285!16s%2Fg%2F11xgnv5wkz",
    "hours": "週一至週四 10:00–翌日 01:00；週五至週六 10:00–翌日 03:00；週日 10:00–24:00",
    "sourceUrl": "https://pasibus.pl/lokalizacje/warszawa/nowy-swiat/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "verified",
    "notes": [
      "Nowy Świat 街邊店，華沙最晚營業的 Pasibus；10/29 週四營業到翌日 01:00，晚餐 Arirang 後或 Złote Tarasy 已關時的宵夜備案。"
    ],
    "menuUrl": null,
    "verificationNote": "讀官方分店頁（頁面更新）；Google 地圖未顯示逐日時間，最後點餐時間未查到，宵夜以 00:30 前到店為準。從 Hotel Metropol 步行約 12 分、中央車站約 20 分（座標估算）。",
    "phone": "+48 510 425 802",
    "cuisine": "本土漢堡",
    "dishes": [
      "Gonzalez（微辣）",
      "Chorizard",
      "Triple Smash"
    ],
    "liveCheckedAt": "2026-10-12"
  },
  "warsaw-mcdonalds-centralna": {
    "id": "warsaw-mcdonalds-centralna",
    "cityKey": "warsaw",
    "name": "McDonald's Warszawa Dworzec Centralny",
    "address": "al. Jerozolimskie 54（Warszawa Centralna 站內）",
    "map": "https://www.google.com/maps/search/?api=1&query=McDonald's%20Warszawa%20Dworzec%20Centralny%2C%20al.%20Jerozolimskie%2054%2C%20Warszawa",
    "hours": "每日約 05:00–翌日 04:00",
    "sourceUrl": "https://czynneoddo.pl/mcdonalds-mccafe-warszawa-centralna,warszawa-aleje-jerozolimskie-54-godziny-otwarcia,27386.html",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "車站內速食；Green Nero Express 沒開或排隊時的早餐備案，第三方目錄列約 05:00 開門。"
    ],
    "menuUrl": null,
    "verificationNote": "站內分店存在；營業時間只有第三方目錄，出發前用 McDonald’s App 確認。",
    "cuisine": "速食",
    "dishes": [
      "McMuffin 早餐",
      "WieśMac 波蘭限定",
      "McCafé 咖啡"
    ],
    "phone": "+48 666 078 280",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "第三方目錄；Wolt 外送 06:00–01:30"
  },
  "warsaw-bulke-przez-bibulke-zgoda": {
    "id": "warsaw-bulke-przez-bibulke-zgoda",
    "cityKey": "warsaw",
    "name": "Bułkę przez Bibułkę | Zgoda",
    "address": "Zgoda 3, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Bu%C5%82k%C4%99%20przez%20Bibu%C5%82k%C4%99%2C%20Zgoda%203%2C%20Warszawa",
    "hours": "週一至週五 07:30–23:00；週六、日 08:00–22:00",
    "sourceUrl": "https://bulkeprzezbibulke.pl/en/location/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Zgoda 3 市中心早午餐：Bagel、Scrambled Eggs、Avocado Toast；平日 07:30 開門，10/30 08:15 搭地鐵往北前的早餐首選。"
    ],
    "menuUrl": null,
    "verificationNote": "官網分店頁列 Zgoda 3；第三方目錄週末時段不一。",
    "cuisine": "早午餐",
    "dishes": [
      "Bagel 貝果",
      "Scrambled Eggs 炒蛋",
      "Avocado Toast"
    ],
    "phone": "+48 730 285 522",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網"
  },
  "warsaw-ceviche-bar": {
    "id": "warsaw-ceviche-bar",
    "cityKey": "warsaw",
    "name": "Ceviche Bar",
    "address": "Twarda 4, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Ceviche%20Bar%2C%20Twarda%204%2C%20Warszawa",
    "hours": "週一至週五 12:00–23:00；週日較短（12:00–18:00 或 21:00）",
    "sourceUrl": "https://new.cevichebar.pl/en/home-english/",
    "checkedAt": "2026-10-12",
    "verificationStatus": "partial",
    "notes": [
      "Bib Gourmand 祕魯／南美料理：ceviche 與小盤。"
    ],
    "menuUrl": null,
    "verificationNote": "Michelin Bib Gourmand；部分來源寫 Twarda 2/4，為同一家。",
    "cuisine": "祕魯菜",
    "dishes": [
      "Ceviche 檸汁醃魚",
      "Tiradito 生魚片",
      "Pisco sour"
    ],
    "phone": "+48 22 304 94 02",
    "liveCheckedAt": "2026-10-12",
    "hoursNote": "官網、Yelp 2026-04"
  },
  "warsaw-soul-kitchen": {
    "id": "warsaw-soul-kitchen",
    "booking": "booked",
    "cityKey": "warsaw",
    "name": "Soul Kitchen",
    "address": "Nowogrodzka 18A, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Soul%20Kitchen%2C%20Nowogrodzka%2018A%2C%20Warszawa",
    "hours": "週五 12:00–16:30、17:30–23:00（下午 16:30–17:30 休息，Google 地圖）；週一至週四約 12:00–22:00",
    "sourceUrl": "https://restaurantguru.com/Soul-Kitchen-Warsaw",
    "checkedAt": "2026-10-22",
    "verificationStatus": "partial",
    "notes": [
      "10/30 最後晚餐首選：Restaurant Guru 2026 年 7 月華沙威靈頓榜第一、Tripadvisor 威靈頓榜第二，離 Metropol 步行約 8 分。",
      "In Your Pocket 與 Warsaw Insider 都列 Nowogrodzka 18A；2026 年獲 Wine Spectator Award of Excellence，仍在營業。"
    ],
    "menuUrl": null,
    "verificationNote": "店家 10/22 回信確認 10/30 18:00–20:00、2 人，保留訂位 15 分鐘，已註記 1 份 Beef Wellington；訂位已確認，完整菜單與當天實際供餐仍依店家。",
    "cuisine": "歐陸／波蘭",
    "dishes": [
      "Beef Wellington（店家已註記 10/30 1 份）",
      "桌邊韃靼牛肉",
      "Żurek 酸麵包湯",
      "鴨肉配蔓越莓紫甘藍"
    ],
    "phone": "+48 519 020 888",
    "liveCheckedAt": "2026-10-13",
    "hoursNote": "Google 地圖：週五分段 12:00–16:30、17:30–23:00；Google 另列官網 soulkitchen.pl"
  },
  "warsaw-primitivo": {
    "id": "warsaw-primitivo",
    "cityKey": "warsaw",
    "name": "Primitivo Kuchnia i Wino",
    "address": "Waliców 13, Warszawa",
    "map": "https://www.google.com/maps/search/?api=1&query=Primitivo%20Kuchnia%20i%20Wino%2C%20Wali%C3%B3w%2013%2C%20Warszawa",
    "hours": "每日 12:00–22:00；週四至週六至 23:00",
    "sourceUrl": "https://inyourpocket.com/warsaw/primitivo-kuchnia-i-wino_171792v",
    "checkedAt": "2026-10-13",
    "verificationStatus": "partial",
    "notes": [
      "Tripadvisor 華沙威靈頓榜第一（4.9），評論稱 Beef Wellington 火候完美；地中海料理與 Primitivo 酒單。",
      "在 Wola（地鐵 Rondo ONZ），晚上從 Metropol 過去要搭車，Soul Kitchen 不能訂時再考慮。"
    ],
    "menuUrl": null,
    "verificationNote": "營業時間來自 In Your Pocket（2026 年 7 月更新）；威靈頓只見於評論，是否常態供應未確認，訂位時先問。",
    "cuisine": "地中海／歐陸",
    "dishes": [
      "Beef Wellington（評論推薦，需先確認）",
      "義式麵食",
      "Primitivo 紅酒"
    ],
    "phone": "+48 606 44 44 62",
    "liveCheckedAt": "2026-10-13"
  },
  "warsaw-bydlo-i-powidlo": {
    "id": "warsaw-bydlo-i-powidlo",
    "cityKey": "warsaw",
    "name": "Bydło i Powidło（Wellington Show）",
    "address": "門牌待確認",
    "map": "https://www.google.com/maps/search/?api=1&query=Byd%C5%82o%20i%20Powid%C5%82o%2C%20Warszawa",
    "hours": "Wellington Show 只在週一 17:00–22:00",
    "sourceUrl": "https://www.bydloipowidlo.pl/wellington-show",
    "checkedAt": null,
    "verificationStatus": "pending",
    "notes": [
      "桌邊製作威靈頓牛排的 Wellington Show，每人 159 PLN（含韃靼牛肉與甜點）。"
    ],
    "menuUrl": null,
    "verificationNote": "只在週一推出，這趟華沙沒有週一，排不進行程；資訊來自 餐飲 v5 稿。"
  },
  "wroclaw-paloma-coffee": {
    "id": "wroclaw-paloma-coffee",
    "cityKey": "wroclaw",
    "name": "Paloma Coffee",
    "address": "Plac Solny 8–9, Wrocław",
    "map": "https://www.google.com/maps/search/?api=1&query=Paloma%20Coffee%2C%20Plac%20Solny%208%2C%20Wroc%C5%82aw",
    "hours": "每日 08:00–21:00（TableJourney、CaffeAtlas；另一份較舊目錄列週五、週六至 22:00）",
    "sourceUrl": "https://tablejourney.com/poland/wroclaw/coffee-roasters/paloma-roasters/",
    "checkedAt": "2026-10-15",
    "verificationStatus": "partial",
    "notes": [
      "鹽廣場邊的精品咖啡與自家烘豆，烘豆機就在店後；10/28 08:50 走到鹽廣場時順路外帶手沖或 V60。"
    ],
    "verificationNote": "門牌與每日 08:00 開門多個來源一致，打烊時間來源不一；未能連上店家官網或樂斯拉夫觀光局頁面確認。",
    "cuisine": "精品咖啡 · 自家烘豆",
    "dishes": [
      "V60 手沖",
      "Flat White"
    ]
  },
  "poznan-stragan-kawiarnia": {
    "id": "poznan-stragan-kawiarnia",
    "cityKey": "poznan",
    "name": "Stragan Kawiarnia",
    "address": "Ratajczaka 31, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=Stragan%20Kawiarnia%2C%20Ratajczaka%2031%2C%20Pozna%C5%84",
    "hours": "週一至週五 08:00 起（打烊各來源列 21:00 或 22:00）；週六 12:00–18:00；週日休（TableJourney）",
    "sourceUrl": "https://tablejourney.com/poland/poznan/cafes/stragan-kawiarnia/",
    "checkedAt": "2026-10-15",
    "verificationStatus": "partial",
    "notes": [
      "波茲南精品咖啡的老字號，自有烘豆品牌；Ratajczaka 從自由廣場往 Stary Browar 的路上，10/29 12:45 往南走時可外帶一杯。"
    ],
    "verificationNote": "門牌一致；週四 08:00 開門兩個來源都成立，打烊時間不一；未能連上店家官網確認。",
    "cuisine": "精品咖啡",
    "dishes": [
      "單品手沖",
      "蛋糕"
    ]
  },
  "poznan-lagacca-cafe-by-brisman": {
    "id": "poznan-lagacca-cafe-by-brisman",
    "cityKey": "poznan",
    "name": "LAGACCA Cafe by Brisman",
    "address": "Woźna 21, Poznań",
    "map": "https://www.google.com/maps/search/?api=1&query=LAGACCA%20Cafe%20by%20Brisman%2C%20Wo%C5%BAna%2021%2C%20Pozna%C5%84",
    "hours": "營業時間未查到（前往前看 Google Maps）",
    "sourceUrl": "https://visitpoznan.pl/en/lagaccacafe-by-brisman-en",
    "checkedAt": "2026-10-15",
    "verificationStatus": "partial",
    "notes": [
      "波茲南名店 Brisman 搬到老城後的新店，Mateusz Gaca 的微型烘豆咖啡館；在舊市集廣場東南側，10/29 等山羊秀前後可順路。"
    ],
    "verificationNote": "波茲南官方觀光網列此店與門牌，並註明 Jeżyce 舊店 Brisman 已遷來；營業時間各來源都沒有列出。",
    "cuisine": "精品咖啡 · 自家烘豆",
    "dishes": [
      "Espresso",
      "Chemex 手沖"
    ]
  }
};

export function resolveDining(item) {
  const place = diningPlaces[item.placeId];
  if (!place) throw new Error('找不到餐廳門市：' + item.placeId);
  return {...place, ...item, name:place.name, address:place.address, map:place.map, mapUrl:place.map,
    hours:place.hours, url:place.sourceUrl, note:item.note ?? place.notes.map(note => note.replace(/[；。]+$/, '')).join('；'),
    highlight:place.notes.map(note => note.replace(/[；。]+$/, '')).join('；'), feature:[...place.notes.map(note => note.replace(/[；。]+$/, '')),place.verificationNote].filter(Boolean).join('；')};
}

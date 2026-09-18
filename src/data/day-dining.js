// 當日正餐（早餐／午餐／晚餐）首選與替補；候選尚未訂位，與每日時間表搭配使用。
// 城市指南的「你的候選」標記由這份資料推導（templates/city-dining.mjs 的 plannedMealsFor），
// 因此每一筆都要有能判斷城市的 address 或 map；不是特定餐廳的項目標 cityGuide: false。
// 2026-09-13 重整：正餐首選以 trip.js days[].eat[] 拍板的安排為準；順路點（咖啡、甜點、街食）
// 改放 trip.js 的 eat[]，同一天不重複。營業時間只採 dining-hours.md 查證結果，不新增未查證的時段。
export const dayDining = {
  "1": [
    {
      "role": "晚餐首選",
      "name": "Specjały Regionalne",
      "address": "Nowy Świat 44, Warszawa",
      "note": "皇家大道散步後的波蘭地方料理；一–四 12:00–22:00、五六 12:00–23:30、日 12:00–22:00。",
      "map": "https://www.google.com/maps/search/?api=1&query=Specja%C5%82y%20Regionalne%20Nowy%20%C5%9Awiat%2044%2C%20Warszawa"
    },
    {
      "role": "替補",
      "name": "Pyzy Flaki Gorące",
      "address": "Podwale 5, Warszawa",
      "note": "老城店，馬鈴薯糰與牛肚湯；抵達後可依胃口擇一，週六營業時間待核實。",
      "map": "https://www.google.com/maps/search/?api=1&query=Pyzy%20Flaki%20Gor%C4%85ce%20Podwale%205%2C%20Warszawa"
    },
    {
      "role": "咖啡甜點",
      "name": "Café Bristol",
      "address": "Krakowskie Przedmieście 42/44, Warszawa",
      "note": "皇家大道途中休息；與 Wedel 擇一優先。每日 08:00–20:00，週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認。",
      "map": "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Bristol%20Krakowskie%20Przedmie%C5%9Bcie%2042/44%2C%20Warszawa"
    }
  ],
  "2": [
    {
      "role": "午餐首選",
      "name": "Bar Mleczny Pod Temidą",
      "address": "Grodzka 43, Kraków",
      "note": "中央廣場往 Wawel 路上的平價牛奶吧。⚠️ 2026-09-18 複查確認這家沒有官方網站，第三方資料對週日有「公休」「09:00–20:00」「10:45–19:00」三種說法。10/25 是週日，出發前必打 +48 12 422 08 74 確認；沒接通就別把它當唯一午餐。",
      "map": "https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Pod%20Temid%C4%85%20Grodzka%2043%2C%20Krak%C3%B3w"
    },
    {
      "role": "晚餐首選",
      "name": "NOAH",
      "address": "Meiselsa 24, Kraków",
      "note": "以色列烤羊肉串配 pitta 餅，Kazimierz；日 13:00–21:30。飯後再走去圓亭吃 Endzior zapiekanka。",
      "map": "https://www.google.com/maps/search/?api=1&query=NOAH%20Meiselsa%2024%2C%20Krak%C3%B3w"
    },
    {
      "role": "替補",
      "name": "Hankki",
      "address": "Zabłocie 19A, Kraków",
      "note": "辛德勒工廠後不想再回 Kazimierz 吃正餐時的替補；韓日料理，營業時間待核實，確認當晚收客時間。",
      "map": "https://www.google.com/maps/search/?api=1&query=Hankki%20Zab%C5%82ocie%2019A%2C%20Krak%C3%B3w"
    }
  ],
  "3": [
    {
      "role": "晚餐首選",
      "name": "Pod Aniołami",
      "address": "Grodzka 35, Kraków",
      "note": "地窖傳統波蘭菜，要訂位。2026-09-18 官網（podaniolami.pl）查證：「Otwarte codziennie 13:00–23:00」——每日營業，10/26 週一照常，先前的週一風險註記已解除。訂位電話 +48 12 421 39 99 或 +48 12 430 21 13。",
      "map": "https://www.google.com/maps/search/?api=1&query=Pod%20Anio%C5%82ami%20Grodzka%2035%2C%20Krak%C3%B3w"
    },
    {
      "role": "替補",
      "name": "FOLGA",
      "address": "Estery 12, Kraków",
      "note": "當代創意料理小盤，高 CP，Bib Gourmand；建議訂位，取代本日晚餐、不另加餐位。",
      "map": "https://www.google.com/maps/search/?api=1&query=FOLGA%20Estery%2012%2C%20Krak%C3%B3w"
    }
  ],
  "4": [
    {
      "role": "午餐首選",
      "name": "Karczma Górnicza",
      "//": "在維利奇卡鹽礦地下 125 公尺，不屬四座城市，因此不推進城市指南的餐廳表。",
      "cityGuide": false,
      "address": "Kopalnia Soli Wieliczka",
      "note": "Wieliczka 鹽礦 125 公尺地下餐廳午餐。",
      "map": "https://www.google.com/maps/search/?api=1&query=Karczma+Gornicza+Kopalnia+Soli+Wieliczka"
    },
    {
      "role": "抵達後候選",
      "name": "Samarqand",
      "address": "Stawowa 23, Wrocław",
      "note": "車站附近的烏茲別克／喬治亞料理，營業時間待核實；參考 20:52 抵站後須確認最後點餐，延誤改簡餐。",
      "map": "https://www.google.com/maps/search/?api=1&query=Samarqand%20Stawowa%2023%2C%20Wroc%C5%82aw"
    }
  ],
  "5": [
    {
      "role": "午餐首選",
      "name": "Restauracja Wrocławska",
      "address": "Szewska 59/60, Wrocław",
      "note": "戰前風味，招牌 bigos 獵人燉菜。2026-09-18 查證官方網站 wroclawska.com.pl：日–四 12:00–22:00、五六 12:00–00:00，10/28 週三為 12:00–22:00。訂位電話 +48 71 305 12 28。須先挪出完整午餐時間，不能直接塞在全景畫與百年廳之間。",
      "map": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Wroc%C5%82awska%20Szewska%2059/60%2C%20Wroc%C5%82aw"
    },
    {
      "role": "晚餐首選",
      "name": "IDA kuchnia i wino",
      "address": "Łazienna 4, Wrocław",
      "note": "19:10 火車前的提早晚餐，建議訂位並單點；六道套餐 209 PLN，葡萄酒搭配另加 169 PLN（現行菜單）；週三 12:00–22:00。",
      "map": "https://www.google.com/maps/search/?api=1&query=IDA%20kuchnia%20i%20wino%20%C5%81azienna%204%2C%20Wroc%C5%82aw"
    },
    {
      "role": "替補",
      "name": "Konspira",
      "address": "Plac Solny 11, Wrocław",
      "note": "1980 年代反共主題傳統小館；現為備案，週三開門時間 12:00 或 13:00 資料不一，行前電話 796 326 600 確認，週五至日不接受訂位。",
      "map": "https://www.google.com/maps/search/?api=1&query=Konspira%20Plac%20Solny%2011%2C%20Wroc%C5%82aw"
    }
  ],
  "6": [
    {
      "role": "午餐首選",
      "name": "Pyra Bar",
      "address": "Strzelecka 13, Poznań",
      "note": "馬鈴薯地方料理，看山羊鐘樓秀後的快速午餐；週四 11:00–21:00，需配合牛角麵包博物館實際場次。",
      "map": "https://www.google.com/maps/search/?api=1&query=Pyra%20Bar%20Strzelecka%2013%2C%20Pozna%C5%84"
    },
    {
      "role": "替補",
      "name": "Hyćka",
      "address": "Rynek Śródecki 17, Poznań",
      "note": "大波蘭菜，招牌烤鴨配 pyzy 蒸糰；週四 11:00 起，想吃地方料理可選，但需重排動線，不要吃完趕正午山羊秀。",
      "map": "https://www.google.com/maps/search/?api=1&query=Hy%C4%87ka%20Rynek%20%C5%9Ar%C3%B3decki%2017%2C%20Pozna%C5%84"
    },
    {
      "role": "特色糕點",
      "name": "ROGAL Świętomarciński",
      "address": "Stary Rynek 11/17, Poznań",
      "note": "老城廣場的聖馬丁牛角麵包店，可取代未指定分店的 Kandulski。",
      "map": "https://www.google.com/maps/search/?api=1&query=ROGAL%20%C5%9Awi%C4%99tomarci%C5%84ski%20Stary%20Rynek%2011/17%2C%20Pozna%C5%84"
    },
    {
      "role": "韓式（改日或提早才可行）",
      "name": "Yache Korea",
      "address": "Nowogrodzka 25, Warszawa",
      "note": "⚠️ 不要當 Day 6 晚抵備案。2026-09-17 官網 yachekorea.com：週一–四 12:00–20:30、週五 12:00–21:30。10/29 是週四，20:30 就打烊，而本日預計 20:30 才走到餐廳——等於撲空。想吃改排 Day 7（10/30 週五，到 21:30）或當日提早到店。",
      "map": "https://www.google.com/maps/search/?api=1&query=Yache%20Korea%20Nowogrodzka%2025%2C%20Warszawa"
    },
    {
      "role": "韓式替補",
      "name": "Arirang Restaurant",
      "address": "Nowogrodzka 38, Warszawa",
      "note": "同樣位於 Nowogrodzka，但適用門市與最後點餐都找不到店家一手公告，只能當候選、不能當可靠保底；晚抵達前先致電確認。",
      "map": "https://www.google.com/maps/search/?api=1&query=Arirang%20Restaurant%20Nowogrodzka%2038%2C%20Warszawa"
    }
  ],
  "7": [
    {
      "role": "午餐首選",
      "name": "Café Bristol",
      "address": "Krakowskie Przedmieście 42/44, Warszawa",
      "note": "城堡→POLIN 途中的輕食站；每日 08:00–20:00，週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認。",
      "map": "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Bristol%20Krakowskie%20Przedmie%C5%9Bcie%2042/44%2C%20Warszawa"
    },
    {
      "role": "晚餐首選",
      "name": "U Fukiera",
      "address": "Rynek Starego Miasta 27, Warszawa",
      "note": "Żurek 酸黑麥湯，老城最後晚餐；週一–四 12:00–23:00、週五–六 12:00–23:30、週日 12:00–23:00。",
      "map": "https://www.google.com/maps/search/?api=1&query=U%20Fukiera%2C%20Rynek%20Starego%20Miasta%2027%2C%20Warszawa"
    },
    {
      "role": "替補",
      "name": "WYRAJ",
      "address": "Krochmalna 59, Warszawa",
      "note": "起義博物館後的斯拉夫料理，建議訂位；現為備案，選這裡就不必特地回老城吃飯。",
      "map": "https://www.google.com/maps/search/?api=1&query=WYRAJ%20Krochmalna%2059%2C%20Warszawa"
    },
    {
      "role": "替補",
      "name": "NUTA",
      "address": "NUTA Warszawa",
      "note": "主廚 Andrea Camastra 創意套餐，義式底蘊融合亞洲香料；現為備案，需提前 3–5 週訂位，並向店家確認現址與時間。",
      "map": "https://www.google.com/maps/search/?api=1&query=NUTA%20NUTA%20Warszawa"
    },
    {
      "role": "韓式烤肉替補",
      "name": "MEI",
      "address": "Solec 81B, Warszawa",
      "note": "特別想吃烤肉才專程安排，取代本日晚餐；營業時間待核實。",
      "map": "https://www.google.com/maps/search/?api=1&query=MEI%20Solec%2081B%2C%20Warszawa"
    },
    {
      "role": "下午輕食候選",
      "name": "QQ Warsaw | Matcha & Korean Toasts",
      "address": "QQ Warsaw Warszawa",
      "note": "平日 11:00 才開門；僅在三館行程有餘裕時安排，不當早出門早餐。",
      "map": "https://www.google.com/maps/search/?api=1&query=QQ%20Warsaw%20%7C%20Matcha%20%26%20Korean%20Toasts%20QQ%20Warsaw%20Warszawa"
    },
    {
      "role": "巧克力甜點",
      "name": "Pijalnia Czekolady E.Wedel",
      "address": "Szpitalna 8, Warszawa",
      "note": "熱巧克力，Szpitalna 8 分店；一–五 08:00–22:00、六 09:00–22:00、日 09:00–21:00。若抵達日已喝過，可略過。",
      "map": "https://www.google.com/maps/search/?api=1&query=Pijalnia%20Czekolady%20E.Wedel%20Szpitalna%208%2C%20Warszawa"
    }
  ],
  "8": [
    {
      "role": "早餐",
      "name": "Café Bristol",
      "address": "Krakowskie Przedmieście 42/44, Warszawa",
      "note": "每日 08:00–20:00；週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認。保留退房與機場交通時間，不專程追店。",
      "map": "https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Bristol%20Krakowskie%20Przedmie%C5%9Bcie%2042/44%2C%20Warszawa"
    },
    {
      "role": "替補",
      "name": "Bar Mleczny Prasowy",
      "address": "Marszałkowska 10/16, Warszawa",
      "note": "⚠️ 已降級為不可靠備案。2026-09-17 華沙市府旅遊資訊中心列這家（Marszałkowska 10/16）週一 09:00–20:00、週二–日 09:00–19:00——10/31 是週六，09:00 才開，趕不上 08:00 早餐與 09:45 退房。網路上的「08:00 開」是 Powiśle 分店（Zajęcza 1a）。且此店在 Marszałkowska 南端，與 Marszałkowska 99a 的 Hotel Metropol 不是步行五分鐘的距離。",
      "map": "https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Prasowy%2C%20Marsza%C5%82kowska%2010%2F16%2C%20Warszawa"
    }
  ]
};

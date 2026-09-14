// 當日正餐（早餐／午餐／晚餐）與其替補；候選尚未訂位，與每日時間表搭配使用。
// 2026-09-13 重整：內容以本分支 trip.js days[].eat[] 目前拍板的正餐安排為準，
// 營業時間只採本分支 dining.js／trip.js 現有文字與 dining-hours.md 查證結果，不新增未查證的時段。
export const dayDining = {
  "1": [
    {
      "role": "晚餐首選",
      "name": "Specjały Regionalne",
      "address": "Nowy Świat 44, Warszawa",
      "note": "皇家大道散步後的波蘭地方料理；一–四 12:00–22:00、五六 12:00–23:30、日 12:00–22:00。",
      "map": "https://www.google.com/maps/search/?api=1&query=Specjaly+Regionalne+Warsaw"
    },
    {
      "role": "替補",
      "name": "Pyzy Flaki Gorące",
      "address": "Podwale 5, Warszawa",
      "note": "老城店，馬鈴薯糰與牛肚湯；抵達後可依胃口擇一，週六營業時間待核實。",
      "map": "https://www.google.com/maps/search/?api=1&query=Pyzy+Flaki+Gorace+Warsaw"
    }
  ],
  "2": [
    {
      "role": "午餐首選",
      "name": "Bar Mleczny Pod Temidą",
      "address": "Grodzka 43, Kraków",
      "note": "中央廣場往 Wawel 路上的平價牛奶吧；官網每日 09:00–20:00，惟部分來源說週末公休，行前電話 12 422 08 74 確認。",
      "map": "https://maps.app.goo.gl/xCGDapoy56MBvg2y7?g_st=il"
    },
    {
      "role": "晚餐首選",
      "name": "NOAH",
      "address": "Meiselsa 24, Kraków",
      "note": "以色列烤羊肉串配 pitta 餅，Kazimierz；日 13:00–21:30。",
      "map": "https://maps.google.com/?cid=6279990201826816109"
    },
    {
      "role": "替補",
      "name": "Hankki",
      "address": "Zabłocie 19A, Kraków",
      "note": "辛德勒工廠後不想再回 Kazimierz 吃正餐時的替補；韓日料理，營業時間待核實，確認當晚收客時間。",
      "map": "https://www.google.com/maps/search/?api=1&query=Hankki+Krakow"
    }
  ],
  "3": [
    {
      "role": "晚餐首選",
      "name": "Pod Aniołami",
      "address": "Grodzka 35, Kraków",
      "note": "地窖傳統波蘭菜，要訂位；官網每日 13:00–23:00，惟本項風險最高，行前電話 12 421 39 99 確認週一是否照常營業。",
      "map": "https://www.google.com/maps/search/?api=1&query=Pod+Aniolami+Krakow"
    },
    {
      "role": "替補",
      "name": "FOLGA",
      "address": "Estery 12, Kraków",
      "note": "當代創意料理小盤，高 CP，Bib Gourmand；建議訂位，取代本日晚餐、不另加餐位。",
      "map": "https://maps.google.com/?cid=7193800786272583343"
    }
  ],
  "4": [
    {
      "role": "午餐首選",
      "name": "Karczma Górnicza",
      "note": "Wieliczka 鹽礦 125 公尺地下餐廳午餐。",
      "map": "https://www.google.com/maps/search/?api=1&query=Karczma+Gornicza+Kopalnia+Soli+Wieliczka"
    },
    {
      "role": "抵達後候選",
      "name": "Samarqand",
      "address": "Stawowa 23, Wrocław",
      "note": "車站附近的烏茲別克／喬治亞料理，營業時間待核實；參考 20:52 抵站後須確認最後點餐，延誤改簡餐。",
      "map": "https://www.google.com/maps/search/?api=1&query=Samarqand+Kuchnia+Uzbecka+Gruzinska+Wroclaw"
    }
  ],
  "5": [
    {
      "role": "午餐首選",
      "name": "Restauracja Wrocławska",
      "address": "Szewska 59/60, Wrocław",
      "note": "戰前風味，招牌 bigos 獵人燉菜；週三 12:00–22:00（多來源一致，非官網一手，行前電話確認）。",
      "map": "https://www.google.com/maps/search/?api=1&query=Restauracja%20Wroc%C5%82awska%20Wroc%C5%82aw"
    },
    {
      "role": "晚餐首選",
      "name": "IDA kuchnia i wino",
      "address": "Łazienna 4, Wrocław",
      "note": "19:10 火車前的提早晚餐，含酒套餐高 CP；週三 12:00–22:00。",
      "map": "https://maps.google.com/?cid=10589009865057440004"
    },
    {
      "role": "替補",
      "name": "Konspira",
      "address": "Plac Solny 11, Wrocław",
      "note": "1980 年代反共主題傳統小館；現為備案，週三開門時間 12:00 或 13:00 資料不一，行前電話 796 326 600 確認，週五至日不接受訂位。",
      "map": "https://www.google.com/maps/search/?api=1&query=Konspira+Wroclaw"
    }
  ],
  "6": [
    {
      "role": "午餐首選",
      "name": "Pyra Bar",
      "address": "Strzelecka 13, Poznań",
      "note": "馬鈴薯地方料理，看山羊鐘樓秀後的快速午餐；週四 11:00–21:00。",
      "map": "https://www.google.com/maps/search/?api=1&query=Pyra+Bar+Poznan"
    },
    {
      "role": "替補",
      "name": "Hyćka",
      "address": "Rynek Śródecki 17, Poznań",
      "note": "大波蘭菜，招牌烤鴨配 pyzy 蒸糰；想吃地方料理可選，但需重排動線，不要吃完趕正午山羊秀。",
      "map": "https://www.google.com/maps/search/?api=1&query=Hy%C4%87ka%20Pozna%C5%84"
    }
  ],
  "7": [
    {
      "role": "午餐首選",
      "name": "Café Bristol",
      "address": "Krakowskie Przedmieście 42/44, Warszawa",
      "note": "城堡→POLIN 途中的輕食站；每日 08:00–20:00，週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認。",
      "map": "https://www.google.com/maps/search/?api=1&query=Cafe+Bristol+Warsaw"
    },
    {
      "role": "晚餐首選",
      "name": "U Fukiera",
      "note": "Żurek 酸黑麥湯，老城最後晚餐。",
      "map": "https://www.google.com/maps/search/?api=1&query=U+Fukiera+Warszawa"
    },
    {
      "role": "替補",
      "name": "WYRAJ",
      "address": "Krochmalna 59, Warszawa",
      "note": "起義博物館後的斯拉夫料理，建議訂位；現為備案，選這裡就不必特地回老城吃飯。",
      "map": "https://www.google.com/maps/search/?api=1&query=Wyraj+restauracja+Warszawa"
    },
    {
      "role": "替補",
      "name": "NUTA",
      "note": "主廚 Andrea Camastra 創意套餐，義式底蘊融合亞洲香料；現為備案，需提前 3–5 週訂位，並向店家確認現址與時間。",
      "map": "https://maps.google.com/?cid=4624148008162643045"
    }
  ],
  "8": [
    {
      "role": "早餐",
      "name": "Café Bristol",
      "address": "Krakowskie Przedmieście 42/44, Warszawa",
      "note": "每日 08:00–20:00；週六開門時間各來源不一致，行前電話 +48 22 551 18 28 確認。",
      "map": "https://www.google.com/maps/search/?api=1&query=Cafe+Bristol+Warsaw"
    },
    {
      "role": "替補",
      "name": "Bar Mleczny Prasowy",
      "note": "多數來源顯示每日 08:00–20:00，少數來源說 09:00 才開，行前電話 666 353 776 確認；若 Café Bristol 週六開門時間有異可改這裡。",
      "map": "https://www.google.com/maps/search/?api=1&query=Bar%20Mleczny%20Prasowy%2C%20Marsza%C5%82kowska%2010%2F16%2C%20Warszawa"
    }
  ]
};

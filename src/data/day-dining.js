import { resolveDining } from './dining-places.js';
// 每日只維護門市引用、餐別與當日安排；店家事實見 dining-places.js。
export const dayDiningPlans = {
  "1": [
    {
      "placeId": "warsaw-specjaly-regionalne",
      "role": "晚餐首選",
      "note": "皇家大道散步後的波蘭地方料理：兩人分享綜合 pierogi 與 żurek 酸黑麥湯，胃口夠再加一道肉類主菜。週六晚上先訂位。",
      "stepId": "d1-dinner",
      "planStatus": "scheduled"
    },
    {
      "placeId": "warsaw-pyzy-flaki-gorace",
      "role": "替補",
      "note": "老城店，馬鈴薯糰與牛肚湯；與晚餐首選擇一。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-cafe-bristol",
      "role": "咖啡甜點",
      "note": "皇家大道途中休息；與 Wedel 擇一優先。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "2": [
    {
      "placeId": "krakow-bar-mleczny-pod-temida",
      "role": "午餐首選",
      "note": "Grodzka 43、中央廣場往 Wawel 路上的牛奶吧；官網已確認每日 09:00–20:00，週日可安排。",
      "stepId": "d2-lunch",
      "planStatus": "scheduled"
    },
    {
      "placeId": "krakow-noah",
      "role": "晚餐首選",
      "note": "以色列烤羊肉串配 pitta 餅，可加 hummus、烤茄子分享。週日 21:30 打烊，訂 19:45 並確認最後點餐；飯後可走去圓亭吃 Endzior。",
      "stepId": "d2-dinner",
      "planStatus": "scheduled"
    },
    {
      "placeId": "krakow-hankki",
      "role": "替補",
      "note": "辛德勒工廠後不想回 Kazimierz 用餐時的替補，先確認收客時間。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "3": [
    {
      "placeId": "krakow-pod-aniolami",
      "role": "晚餐首選",
      "note": "地窖傳統波蘭菜，建議訂位。",
      "stepId": "d3-dinner",
      "planStatus": "scheduled"
    },
    {
      "placeId": "krakow-folga",
      "role": "替補",
      "note": "當代創意小盤料理；取代本日晚餐，不另加餐位。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "4": [
    {
      "placeId": "wieliczka-bistro-posolone",
      "role": "午餐首選",
      "cityGuide": false,
      "note": "出礦後最近的選擇，選湯或簡餐即可；導覽拖到 13:00 後才結束就外帶，直接搭車回克拉科夫取行李。",
      "stepId": "d4-lunch",
      "planStatus": "scheduled"
    },
    {
      "placeId": "wieliczka-wieliczka-鎮中心午餐",
      "role": "午餐備案（鎮中心，店家待選）",
      "cityGuide": false,
      "note": "Bistro Posolone 客滿或想進鎮上時的備案；店家未選定，地圖只搜尋鎮中心餐廳，不代表已確認營業。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wieliczka-karczma-gornicza",
      "role": "午餐備案（營業待確認，暫不採用）",
      "cityGuide": false,
      "note": "2026-09-19 查核：礦場公司波蘭文頁列目前關閉，英文餐飲頁仍有菜單，官方資訊不一致；未獲礦場確認前不採用，午餐改用礦方確認每日營業的 Bistro Posolone。",
      "stepId": null,
      "planStatus": "unavailable"
    },
    {
      "placeId": "wroclaw-samarqand",
      "role": "晚餐首選（抵達後）",
      "note": "Stawowa 23，車站與 Hotel Piast 旁；週二營業至 23:00、廚房至 22:00，最適合晚抵。換個口味吃烏茲別克牛肉抓飯（plov）＋分享湯餃；火車誤點過 21:45 就改車站簡餐。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "5": [
    {
      "placeId": "wroclaw-restauracja-wroclawska",
      "role": "午餐首選",
      "note": "12:30 預留午餐；官網已確認 12:00 開門。推薦 Śląskie niebo 與 Bigos Wrocławski。14:05 前離開，接 14:15 國家博物館，16:15 前抵座堂島。",
      "stepId": "d5-lunch",
      "planStatus": "scheduled"
    },
    {
      "placeId": "wroclaw-ida-kuchnia-i-wino",
      "role": "午餐備選",
      "note": "Łazienna 4，週三 12:00–22:00；Wrocławska 客滿時的午餐替代，選酸湯、餃子或鴨肉。晚上要趕 19:10 火車，本日不排坐下晚餐，改車站外帶。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-konspira",
      "role": "午餐替補",
      "note": "反共主題傳統小館；本日只作午餐替補，晚上趕車不排晚餐。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "6": [
    {
      "placeId": "poznan-pyra-bar",
      "role": "午餐首選",
      "note": "12:30 預留快速午餐：Pyry z bzikiem 或 Szare ale jare。訂到 14:00 英文場就 13:35 前離開；排隊太久改外帶。",
      "stepId": "d6-lunch",
      "planStatus": "scheduled"
    },
    {
      "placeId": "warsaw-cma-hala-koszyki",
      "role": "晚餐首選（抵華沙後）",
      "note": "24/7 營業，火車誤點也吃得到；推薦 żurek、餃子或烤肋排。位於 Hala Koszyki 內，由飯店步行約 10–15 分。",
      "stepId": "d6-dinner",
      "planStatus": "scheduled"
    },
    {
      "placeId": "poznan-hycka",
      "role": "替補",
      "note": "大波蘭菜、烤鴨配蒸糰；替換午餐時須重排動線。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-rogal",
      "role": "特色糕點",
      "note": "老城廣場糕點候選，具體門市待確認。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-yache-korea",
      "role": "韓式（改日或提早才可行）",
      "note": "不適合本日晚抵後用餐；若想吃需改日或提早到店。",
      "stepId": null,
      "planStatus": "unavailable"
    },
    {
      "placeId": "warsaw-arirang-restaurant",
      "role": "韓式替補",
      "note": "韓式晚餐候選，尚無可靠營業及最後點餐證據，勿當晚抵保底。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "7": [
    {
      "placeId": "warsaw-cafe-bristol",
      "role": "午餐首選",
      "note": "城堡往 POLIN 途中的輕食。",
      "stepId": "d7-lunch",
      "planStatus": "scheduled"
    },
    {
      "placeId": "warsaw-u-fukiera",
      "role": "替補",
      "note": "想在老城吃最後晚餐時改這間（Żurek 酸黑麥湯）；從起義博物館過去需搭車約 20–30 分。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-wyraj",
      "role": "晚餐首選",
      "note": "起義博物館步行約 10 分，18:30 入座、先訂位；時令波蘭料理，選野菇前菜、餃子加一道主菜，當作最後一晚的正式晚餐。",
      "stepId": "d7-dinner",
      "planStatus": "scheduled"
    },
    {
      "placeId": "warsaw-nuta",
      "role": "替補",
      "note": "主廚創意套餐備案，價格以訂位頁為準。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-mei",
      "role": "韓式烤肉替補",
      "note": "特別想吃韓式烤肉才專程安排，取代本日晚餐。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-qq-warsaw-matcha-korean-toasts",
      "role": "下午輕食候選",
      "note": "只有行程有餘裕才安排；門牌與營業時間待確認，不作早出門早餐。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-wedel-szpitalna-8",
      "role": "巧克力甜點",
      "note": "Szpitalna 8 分店熱巧克力；抵達日已喝過可略過。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "8": [
    {
      "placeId": "warsaw-bar-mleczny-prasowy-marszalkowska",
      "role": "替補",
      "note": "不適合本日早餐時段；此店不在旅館旁，無法及時用餐時改找退房路線或車站內店家。",
      "stepId": null,
      "planStatus": "unavailable"
    }
  ]
};
export const dayDining = Object.fromEntries(Object.entries(dayDiningPlans).map(([day, items]) => [day, items.map(resolveDining)]));

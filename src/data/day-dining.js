import { resolveDining } from './dining-places.js';
// 每日只維護門市引用、餐別與當日安排；店家事實見 dining-places.js。
export const dayDiningPlans = {
  "1": [
    {
      "placeId": "warsaw-specjaly-regionalne",
      "role": "晚餐首選",
      "note": "皇家大道散步後的波蘭地方料理，出發前確認訂位。",
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
      "note": "中央廣場往 Wawel 路上的牛奶吧；週日營業待電話確認，未確認前不要作為唯一午餐。",
      "stepId": "d2-lunch",
      "planStatus": "scheduled"
    },
    {
      "placeId": "krakow-noah",
      "role": "晚餐首選",
      "note": "以色列烤羊肉串配 pitta 餅；飯後可走去圓亭吃 Endzior。",
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
      "placeId": "wieliczka-wieliczka-鎮中心午餐",
      "role": "午餐首選（店家待選）",
      "cityGuide": false,
      "note": "依既定行程 13:00 在鎮中心午餐，店家尚未選定；鹽礦地下餐廳營業有官方資訊衝突，先不要依賴。地圖只搜尋鎮中心餐廳，不代表已確認營業；出礦後確認店家，保留回克拉科夫取行李的時間。",
      "stepId": "d4-lunch",
      "planStatus": "scheduled"
    },
    {
      "placeId": "wieliczka-karczma-gornicza",
      "role": "午餐備案（營業待確認，暫不採用）",
      "cityGuide": false,
      "note": "2026-09-19 查核：礦場公司波蘭文頁列目前關閉，英文餐飲頁仍有菜單，官方資訊不一致；未獲礦場確認前不採用，依既定 13:00 Wieliczka 鎮中心午餐安排，店家現場再選。",
      "stepId": null,
      "planStatus": "unavailable"
    },
    {
      "placeId": "wroclaw-samarqand",
      "role": "抵達後候選",
      "note": "晚抵車站後候選；須計入火車延誤及廚房最後點餐，無法及時到店則改簡餐。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "5": [
    {
      "placeId": "wroclaw-restauracja-wroclawska",
      "role": "午餐首選",
      "note": "午餐候選未排時段；需先確認開門時間，再挪出完整用餐與交通時間，不能直接塞在全景畫與百年廳之間。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-ida-kuchnia-i-wino",
      "role": "晚餐首選",
      "note": "晚餐候選未排時段；座堂島結束後已安排取行李與抵站，須先調整景點／用餐動線，不能直接視為已排妥。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-konspira",
      "role": "替補",
      "note": "反共主題傳統小館，作午晚餐替補；需配合店家接受訂位的日期。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "6": [
    {
      "placeId": "poznan-pyra-bar",
      "role": "午餐首選",
      "note": "馬鈴薯地方料理；午餐候選未排時段，需配合山羊秀及牛角麵包博物館場次。",
      "stepId": null,
      "planStatus": "candidate"
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
      "role": "晚餐首選",
      "note": "Żurek 酸黑麥湯，老城最後晚餐。",
      "stepId": "d7-dinner",
      "planStatus": "scheduled"
    },
    {
      "placeId": "warsaw-wyraj",
      "role": "替補",
      "note": "起義博物館後的斯拉夫料理備案；選這裡就不必特地回老城吃晚餐。",
      "stepId": null,
      "planStatus": "candidate"
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
      "placeId": "warsaw-cafe-bristol",
      "role": "早餐",
      "note": "早餐後保留退房與機場交通時間，不專程追店。",
      "stepId": "d8-breakfast",
      "planStatus": "scheduled"
    },
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

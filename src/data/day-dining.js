import { resolveDining } from './dining-places.js';
// 門市事實只在 dining-places.js 維護；meal 標記當日三餐首選，沒有 meal 的餐廳仍為備選／點心。
export const dayDiningPlans = {
  "1": [
    {
      "placeId": "warsaw-specjaly-regionalne",
      "role": "晚餐首選",
      "note": "18:30 入座（行程稿另寫 18:45，訂位以待辦的 18:30 為準）：Żurek 酸黑麥湯＋綜合 Pierogi，主菜選梅醬豬肋排或半隻烤鴨。城堡廣場拍完沿皇家大道走回 Nowy Świat 就到；入境排太久就先刪城堡廣場。飯後經科學文化宮步行到 Złote Tarasy。",
      "stepId": "d1-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "dayHours": "11:30–23:00"
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
      "note": "行程改成沿皇家大道多看幾個外觀點，城堡廣場拍完直接走回晚餐，咖啡不排入；想坐下就把 Potocki 宮到聖安妮教堂那段縮短。總統府隔壁，Bristol cake 配咖啡（週六至 21:00）。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-wedel-krakowskie-45",
      "role": "咖啡甜點",
      "note": "行程改成城堡廣場拍完直接走回晚餐，咖啡不排入；Krakowskie Przedmieście 45，週六 10:00–23:00，飯後想回頭喝也還開著。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-a-blikle-1869",
      "role": "甜點外帶",
      "note": "Nowy Świat 35，16:30 沿新世界街北行時順路外帶一顆 pączek；開門時間各目錄不一，沒開就略過。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "2": [
    {
      "placeId": "warsaw-green-caffe-nero-centralny",
      "role": "早餐首選（條件式）",
      "note": "退房到中央車站後在站內 Green Nero Express（Yelp 列 24 小時）外帶可頌或火腿起司三明治＋Americano／Latte，可多帶一份麵包上車；07:55 結束採買，08:05 起找月台。店未開或排隊就用前晚在 Żabka 買的麵包。",
      "stepId": "d2-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "condition": "分店開門與品項待確認；不壓縮 08:40 發車前的進站緩衝。",
      "dayHours": "24 小時"
    },
    {
      "placeId": "warsaw-mcdonalds-centralna",
      "role": "早餐備案",
      "note": "同在 Warszawa Centralna 站內，約 05:00 就開；Green Nero Express 沒開或排隊時改 McMuffin＋咖啡外帶，也可改 EIP 車上餐車。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-lajkonik-basztowa",
      "role": "隔日備餐採買",
      "note": "寄放行李後先買隔日早餐及午餐（三明治、Drożdżówka 甜麵包、可頌、水果），接著走去中央廣場；不等晚餐後才去。需冷藏的餐點先確認住宿保存條件，否則選常溫麵包與水果。",
      "stepId": "d2-prep",
      "planStatus": "scheduled",
      "dayHours": "07:00–19:00"
    },
    {
      "placeId": "krakow-pimiento-shop-bistro",
      "role": "午餐首選（條件式）",
      "note": "Świętego Filipa 21，離 ibis 步行約 7 分、離中央廣場約 12 分；13:00 準時入座才吃得到午餐菜單：Tatar 阿根廷牛韃靼、Argentine burger，或照重量點阿根廷牛排。13:50 前離店，步行約 26 分接 14:30 瓦維爾大教堂。",
      "stepId": "d2-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "condition": "午餐菜單 13:00 起才供應（早餐菜單 09:00–13:00）；週日只開到 15:00，資料來自 Google 地圖與 MapQuest，官網未列，10/22 複查再看一次。先用官網「ZAREZERWUJ」或電話 +48 517 475 818 訂 13:00 兩位；客滿、關門或列車延誤改 Polonia 或 24 小時的 Przypiecek。",
      "dayHours": "09:00–15:00（早餐菜單 09:00–13:00，午餐菜單 13:00 起）"
    },
    {
      "placeId": "krakow-polonia",
      "role": "午餐備選",
      "note": "Basztowa 25（Hotel Polonia 內），離 ibis 步行約 5 分，週日 12:00 開門：Schabowy 炸豬排、Pierogi 或湯品。Pimiento 客滿、關門或抵達太晚時改這間，吃完仍接 14:30 瓦維爾大教堂。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-przypiecek",
      "role": "午餐備選",
      "note": "原午餐首選保留；Sławkowska 32，24 小時營業，Pimiento 與 Polonia 都不行或抵達較晚時改點綜合餃子配甜菜湯。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-milkbar-tomasza",
      "role": "午餐備選",
      "note": "św. Tomasza 24，週日 09:00–18:00 有開；想體驗牛奶吧平價 Pierogi、炸豬排可改這間；Pimiento 客滿或關門時的備選，下午時間緊仍以 Pimiento 或 Polonia 較省時。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-bar-mleczny-pod-temida",
      "role": "午餐備選",
      "note": "原首選保留；往 Wawel 路上的牛奶吧，與 Pimiento 擇一，不加一餐。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-pasibus-galeria-krakowska",
      "role": "午餐速食備案",
      "note": "車站旁 Galeria Krakowska 的 Pasibus／Berlin Döner；10/25 為非營業週日，商場是否開門先確認。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-hankki",
      "role": "晚餐首選（條件式）",
      "note": "辛德勒工廠預計 19:00 前離館，步行約 5 分，暫排 19:15。點 Gyoza、Honey Garlic Popcorn Chicken、Kimbap 或 Bibimbap；飯後不再特地折返吃點心。",
      "stepId": "d2-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "須先確認週日 19:15 仍接單（店 21:00 關）；若工廠改到更晚場，改當時仍營業的快食。",
      "dayHours": "13:00–21:00"
    },
    {
      "placeId": "krakow-molam-thai",
      "role": "晚餐備選",
      "note": "想把韓式換成泰式（Bib Gourmand，Rajska 3/4，週日至 21:30）時改這間；離辛德勒工廠較遠，需搭車。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-noah",
      "role": "晚餐備選",
      "note": "原首選保留；想吃以色列料理才回 Kazimierz，先確認當晚最後接單。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "3": [
    {
      "placeId": "krakow-mr-jerry",
      "role": "晚餐首選（條件式）",
      "note": "16:55 回城休息後 18:30 入座：招牌 Beef Wellington，胃口大可加乾式熟成牛排。本趟唯一吃得到威靈頓牛排的機會。",
      "stepId": "d3-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "建議訂位並確認 10/26 當天供應 Wellington；週一 15:00–22:00、廚房至 21:30。返程延誤先聯絡餐廳。",
      "dayHours": "15:00–22:00"
    },
    {
      "placeId": "krakow-pod-aniolami",
      "role": "晚餐備選",
      "note": "Mr. Jerry 訂不到時的首替：每日 13:00–23:00，老城 Grodzka 35，木火烤山鱒魚＋野菇湯，訂位時確認 10% 服務費。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-folga",
      "role": "晚餐備選（週一先電話確認）",
      "note": "魚類、海鮮與當季 Sharing Plates，口味較輕；但週一是否營業來源矛盾，10/26 要去先打電話。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-molam-thai",
      "role": "晚餐備選",
      "note": "泰式 Bib Gourmand，週一 16:00–22:00；想吃異國料理時替代。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-pasibus-galeria-krakowska",
      "role": "晚餐速食備案",
      "note": "巴士站就在 Galeria Krakowska 後面，太累不想走去老城時直接吃（到 22:00）。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "4": [
    {
      "placeId": "krakow-charlotte-plac-szczepanski",
      "role": "早餐首選（條件式）",
      "note": "先退房寄行李，07:05 入座：French Breakfast、可頌或蛋料理＋咖啡；07:35 收尾後步行回 Kraków Główny，搭 08:00 前後的 KMŁ 趕 09:00 鹽礦場次。",
      "stepId": "d4-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "condition": "候位太久就外帶，或改吃前晚在 Lajkonik／Żabka 備妥的麵包。",
      "dayHours": "07:00–24:00"
    },
    {
      "placeId": "wieliczka-bistro-posolone",
      "role": "午餐首選（條件式）",
      "cityGuide": false,
      "note": "09:00 場約 11:30–12:00 出礦，點 Soup of the day、Halloumi Salad，或 Pizza 兩人分享，簡餐即可；12:45 收尾，另留走回車站與候車時間。",
      "stepId": "d4-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "condition": "13:00 前出礦且有餘裕才坐下吃；較晚結束就外帶，略過 Kazimierz，保住 16:10 抵站。若取消鹽礦，不特地前往 Wieliczka，改在克拉科夫老城動線上找午餐。",
      "dayHours": "08:00–18:00"
    },
    {
      "placeId": "wieliczka-wieliczka-鎮中心午餐",
      "role": "午餐備案（鎮中心，店家待選）",
      "note": "Bistro Posolone 客滿或想進鎮上時的備案；店家未選定，地圖只搜尋鎮中心餐廳，不代表已確認營業。",
      "stepId": null,
      "planStatus": "candidate",
      "cityGuide": false
    },
    {
      "placeId": "wieliczka-karczma-gornicza",
      "role": "午餐備案（營業待確認，暫不採用）",
      "note": "2026-09-19 查核：礦場公司波蘭文頁列目前關閉，英文餐飲頁仍有菜單，官方資訊不一致；未獲礦場確認前不採用，午餐改用礦方確認每日營業的 Bistro Posolone。",
      "stepId": null,
      "planStatus": "unavailable",
      "cityGuide": false
    },
    {
      "placeId": "wroclaw-samarqand",
      "role": "晚餐首選（條件式）",
      "note": "約 19:55（推估）抵站、20:05 Piast 放行李，20:15 入座：Uzbek Plov 牛肉抓飯、Manti 湯餃與湯品，可分享船形起司麵包。關門前 1 小時廚房就不出餐，晚到就改車站 KFC 或 MAX。",
      "stepId": "d4-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "約 21:00 前能到店且確認仍接單才採用；否則改 KFC Wrocław PKP 或 Wroclavia 的 MAX。抵達時間待查票面。",
      "dayHours": "12:00–22:00"
    },
    {
      "placeId": "wroclaw-kfc-pkp",
      "role": "晚餐備案",
      "note": "Samarqand 不接單、誤點或太累時，直接在 Wrocław Główny 內用餐／外帶，吃完再回 Piast；最穩定的保底。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-max-wroclavia",
      "role": "晚餐備案",
      "note": "車站旁 Wroclavia，營業到翌日 01:00；同商場 Pasibus 到 22:00。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-pasibus-wroclavia",
      "role": "宵夜選項（不取代晚餐）",
      "note": "Wroclavia（Sucha 1）food court，車站步行約 6 分、到 Piast 約 8 分。10/27 週二營業到 22:00，最晚 21:30 前要到店（最後點餐時間未查到）；Samarqand 吃完還想吃，或晚餐改簡單吃時用。抵達時間待查票面，誤點太久就改 Świdnicka 11 分店（週二到 24:00）。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "09:00–22:00"
    }
  ],
  "5": [
    {
      "placeId": "wroclaw-central-cafe",
      "role": "早餐首選（條件式）",
      "note": "07:00 出門走 Świdnicka 大街，07:30 入座：美式鬆餅、貝果或燕麥粥；08:10 收尾，接 08:15 四教派街區。",
      "stepId": "d5-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "condition": "先確認早餐供應起始；07:30 尚未供餐或需久候就改同街的 Charlotte Pokoyhof。",
      "dayHours": "07:00–16:00"
    },
    {
      "placeId": "wroclaw-charlotte-pokoyhof",
      "role": "早餐備案",
      "note": "Central Cafe 尚未供餐時改 French Breakfast 或 Breakfast with egg；兩店擇一，仍於 08:10 前收尾。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-restauracja-wroclawska",
      "role": "午餐首選",
      "note": "逛完 Hala Targowa 市場大廳，12:00 開門就進店、入座就點餐：必點 Śląskie niebo 果乾燉豬肉配 Wrocław dumplings＋Bigos Wrocławski 紅甘藍燉肉，胃口夠再加 Crayfish Soup。主菜現做約 30 分鐘，13:10 離開，接全景畫外觀與 13:20 電車往百年廳。想省排隊可先打 +48 71 305 12 28 訂位（選配）。",
      "stepId": "d5-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "dayHours": "12:00–22:00"
    },
    {
      "placeId": "wroclaw-ida-kuchnia-i-wino",
      "role": "午餐備選",
      "note": "Łazienna 4，週三 12:00–22:00；Wrocławska 客滿時的午餐替代，選酸湯、餃子或鴨肉。晚上要趕 19:10 火車，本日不排坐下晚餐。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-konspira",
      "role": "午餐替補",
      "note": "反共主題傳統小館，週三 13:00 才開門；只在午餐延後時替補，晚上趕車不排晚餐。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-oseyo-25",
      "role": "午餐備選",
      "note": "Malarska 25，每日 12:00–22:00，離老城廣場步行約 5 分；Wrocławska 客滿又想吃韓式時改這間。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-max-wroclavia",
      "role": "晚餐首選（條件式）",
      "note": "取回行李後買 Frisco Burger 或 Halloumi 漢堡＋地瓜薯條外帶上車；18:15 前取餐，18:35 前到主站找月台。不要等到波茲南再吃：抵達時間待查票面，但已是晚上，車站旁 Avenida 21:00 就關。",
      "stepId": "d5-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "若取行李或候餐延誤就直接去車站 KFC／買現成麵包，不為用餐壓縮 19:10 火車緩衝。",
      "dayHours": "08:00–翌日 01:00"
    },
    {
      "placeId": "wroclaw-kfc-pkp",
      "role": "晚餐備案",
      "note": "MAX 排隊或來不及繞到 Wroclavia 時改主站內外帶（Zinger、Twister、Hot Wings 或 Strips）；18:35 後以進站為優先。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-pasibus-wroclavia",
      "role": "晚餐備案",
      "note": "同在 Wroclavia、到 22:00；MAX 排隊時改這間，一樣外帶上車。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-pasibus-swiety-marcin",
      "role": "宵夜選項（不取代晚餐）",
      "note": "Święty Marcin 58/64 街邊店，從 Towarowa 37 步行約 10 分。10/28 週三營業到 23:00，最晚 22:30 前要到店（最後點餐時間未查到）；放行李後約 21:15 到，誤點 60 分鐘仍來得及。車站旁 Avenida 週三 21:00 就關，不當預設。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "12:00–23:00"
    }
  ],
  "6": [
    {
      "placeId": "poznan-charlotte-krysiewicza",
      "role": "早餐首選",
      "note": "07:00 退房寄行李後，07:15–07:55：French Breakfast、可頌＋咖啡，Poznań rugelach 白罌粟籽小可頌兩人分享；08:00 搭電車去 Cytadela。07:00 開門。",
      "stepId": "d6-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "dayHours": "07:00–24:00"
    },
    {
      "placeId": "poznan-inna-piekarnia",
      "role": "早餐備案（不列順位）",
      "note": "Ratajczaka 39，週一至週六 08:30 起：Butter Croissant、麵包與咖啡；08:30 才開門，趕不上 08:00 去 Cytadela，只當備案。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-weranda-caffe",
      "role": "山羊秀前咖啡",
      "note": "Świętosławska 10，週四 09:00 開門；11:05 從皇家城堡山丘下來進來坐，11:45 再去廣場卡位。就在粉紅色 Fara 教堂那條街，從街上拍 Fara。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-ptasie-radio",
      "role": "早餐備選",
      "note": "原首選保留；Kościuszki 74/3，08:00 開門，煙燻鱒魚抹醬或班尼迪克蛋。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-cukiernia-kandulski",
      "role": "點心備選",
      "note": "Plac Ratajskiego 1（週四 09:00–18:00），在老城往 Stary Browar、Carla 的路上；ROGAL 週四營業時間沒查到，排隊或售完時改這間買。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-carla-trattoria-moderna",
      "role": "午餐首選（條件式）",
      "note": "Święty Marcin 34，14:00 開門即入座（Okrąglak 就在旁邊，到帝王城堡約 17 分）：手工麵、披薩與小盤分享，兩人點兩道麵加一份分享即可。14:00–15:15 用餐，15:15 前結帳；15:30 還沒吃完，就把帝王區縮短到只看帝王城堡外觀、跳過 Kaponiera，先保 17:05 到站。",
      "stepId": "d6-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "condition": "週四 14:00 才開門，12:30 吃不到；先在 zjedz.my 訂 10/29 14:00 兩位（尚未訂）。近期有評論說上菜偏慢，15:30 還沒吃完就放棄城堡內部。客滿或訂不到改 Pyra Bar。",
      "dayHours": "14:00–22:30"
    },
    {
      "placeId": "poznan-pyra-bar",
      "role": "午餐備案",
      "note": "Strzelecka 13，週四 11:00–21:00 全天有開。Carla 客滿或訂不到時改這間：Pyry z bzikiem 與 Szare ale jare 兩人分享；可改回 12:15 吃午餐，時間比 Carla 方案寬鬆。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "11:00–21:00"
    },
    {
      "placeId": "poznan-zen-on",
      "role": "午餐備選",
      "note": "Michelin 推薦拉麵，Święty Marcin 21，週四 12:00–20:00（+48 609 116 450）：拉麵、烏龍麵、bao；Carla 客滿或訂不到時的另一個午餐備案，可改回 12:15 吃，尖峰常排隊。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-pasibus-swiety-marcin",
      "role": "午餐速食備案",
      "note": "Święty Marcin 58/64，12:00–23:00；Carla 客滿或訂不到、Pyra Bar 又排隊時改這間。",
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
      "placeId": "warsaw-arirang-restaurant",
      "role": "晚餐首選（條件式）",
      "note": "約 20:30（推估，待查票面）抵華沙、放行李後步行約 5 分到 Nowogrodzka 38，21:00 到店：Bulgogi 韓式烤牛肉、拌飯，或 Jajangmyeon、海鮮煎餅。21:15 前還沒能入座就改 Złote Tarasy 或 Ćma。",
      "stepId": "d6-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "週四 12:00–22:00（多個目錄一致，無店家官網），當天先打 22 881 78 51 或 22 622 18 86 確認仍接單；21:00 到店、21:15 前無法入座就改 Złote Tarasy 速食或 24 小時的 Ćma。",
      "dayHours": "12:00–22:00"
    },
    {
      "placeId": "warsaw-pasibus-zlote-tarasy",
      "role": "晚餐速食備案／宵夜選項",
      "note": "中央車站對面 Złote Tarasy：Pasibus、MAX、Berlin Döner 到 22:00，另有 KFC。10/29 週四 Pasibus 營業到 22:00，最晚 21:30 前要到店（最後點餐時間未查到）；Arirang 來不及，或吃完還想吃點東西時用，不取代 Arirang 晚餐。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "09:00–22:00"
    },
    {
      "placeId": "warsaw-pasibus-nowy-swiat",
      "role": "宵夜備案（營業最晚）",
      "note": "Nowy Świat 29 街邊店，離 Hotel Metropol 步行約 12 分。10/29 週四營業到翌日 01:00，最晚 00:30 前要到店；Złote Tarasy 已關、或 Arirang 後想吃宵夜時去。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "10:00–翌日 01:00"
    },
    {
      "placeId": "warsaw-cma-hala-koszyki",
      "role": "晚餐備案",
      "note": "原首選保留；24 小時營業，Arirang 21:15 前不能入座或誤點時改這間（Chipotle 手撕牛肉吐司、Burrata 沙拉或烤鮭魚），深夜先確認菜色。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-yache-korea",
      "role": "韓式（本日排不進）",
      "note": "週四 20:30 關門，晚抵後來不及；想吃需改日或提早到店。",
      "stepId": null,
      "planStatus": "unavailable"
    },
    {
      "placeId": "warsaw-soul-kitchen",
      "role": "晚餐備選",
      "note": "Nowogrodzka 18A，離 Metropol 步行約 8 分，週四至 22:00；Arirang 不接單時可改這間，但隔天 10/30 晚餐已排這裡吃威靈頓，避免連吃兩晚。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "7": [
    {
      "placeId": "warsaw-bulke-przez-bibulke-zgoda",
      "role": "早餐首選",
      "note": "07:30 開門就進：Bagel、Scrambled Eggs 或 Avocado Toast＋咖啡，08:05 前結帳，走到 Świętokrzyska 搭 M1 往北到 Dworzec Gdański。",
      "stepId": "d7-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "dayHours": "07:30–23:00"
    },
    {
      "placeId": "warsaw-bar-mleczny-bambino",
      "role": "早餐備選",
      "note": "Hoża 19，平日 08:00 才開；想吃牛奶吧早餐，後面從 08:30 那站開始全部順延約 45 分，並刪掉 BUW 屋頂花園。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-polka",
      "role": "午餐首選",
      "note": "老城、新城上午走完，12:40 繞 Piwna 街回城堡廣場，12:55 進城堡旁的店：平日 12:00–16:00 午間套餐，或點 Pierogi、Żurek；13:40 離開往劇院廣場。客滿改甕城旁的 Pyzy Flaki Gorące。",
      "stepId": "d7-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "condition": "客滿或候位超過 15 分就改甕城旁的 Pyzy Flaki Gorące 或老城廣場的 U Fukiera，或買外帶邊走邊吃。",
      "dayHours": "12:00–22:00"
    },
    {
      "placeId": "warsaw-pyzy-flaki-gorace",
      "role": "午餐備案",
      "note": "Podwale 5（甕城旁），週一到週六 12:00 開門；Polka 客滿就改這間，吃華沙在地的 pyzy 馬鈴薯丸子。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-cafe-bristol",
      "role": "午餐備選",
      "note": "想坐下喝咖啡配 Bristol cake 可改這間，但要從城堡往南走約 10 分再折回老城；10/24 傍晚已排過一次。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-soul-kitchen",
      "role": "晚餐首選（威靈頓）",
      "note": "17:25 回 Metropol 休息換衣服，步行約 8 分到 Nowogrodzka 18A，18:30 入座：Beef Wellington 為招牌，前菜可點桌邊韃靼牛肉或 Żurek。飯後可選去 Wedel Szpitalna 8 喝熱巧克力。",
      "stepId": "d7-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "菜單隨季節換、官方菜單未確認：電話 +48 519 020 888 訂位時請店家預留 Wellington 並確認 10/30 供應；沒有就改 Rusiko。",
      "dayHours": "17:30–22:00"
    },
    {
      "placeId": "warsaw-rusiko",
      "role": "晚餐備選（原首選）",
      "note": "Wierzbowa 11（劇院廣場旁），週二至週六 13:00–24:00；Soul Kitchen 沒有威靈頓或客滿時改這間：khachapuri、khinkali、chanakhi 燉羊腿，由 Metropol 搭車約 10 分。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-primitivo",
      "role": "威靈頓備選",
      "note": "Waliców 13（Wola），Tripadvisor 華沙威靈頓榜第一，週五至 23:00；離晚上動線較遠，Soul Kitchen 訂不到又堅持吃威靈頓時再考慮，電話 +48 606 44 44 62 先問供應。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-ceviche-bar",
      "role": "晚餐備選",
      "note": "Bib Gourmand 祕魯菜，Twarda 4，週五 12:00–23:00。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-kieliszki-na-proznej",
      "role": "晚餐備選",
      "note": "市中心：現代歐陸季節料理配葡萄酒，比 WYRAJ 更接近 Hotel Metropol；先確認營業與空位。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-u-fukiera",
      "role": "午／晚餐備選",
      "note": "老城廣場 27：午餐 Polka 客滿時改這間；晚餐想在老城吃最後一晚也可以，綜合 Pierogi、Żurek、波蘭烤鴨。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-wyraj",
      "role": "晚餐備選",
      "note": "原首選保留；Krochmalna 59（Wola），週五 12:00–00:00。新行程白天都在老城與瓦津基，離 Wola 較遠，Soul Kitchen 不能訂時再考慮。",
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
      "placeId": "warsaw-bydlo-i-powidlo",
      "role": "威靈頓秀（排不進）",
      "note": "Wellington Show 只在週一 17:00–22:00，這趟華沙沒有週一。",
      "stepId": null,
      "planStatus": "unavailable"
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
      "note": "20:15 晚餐後到 Szpitalna 8 喝熱巧克力（到 22:00），選配；喝完散步回飯店整理行李。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "8": [
    {
      "placeId": "warsaw-charlotte-zlota",
      "role": "早餐首選（條件式）",
      "note": "08:00 第一批進店：French Breakfast、可頌＋咖啡，想吃飽一點加 Croque-Monsieur；08:45 收尾，預留 45 分鐘回 Metropol 取行李，09:45 退房出發。",
      "stepId": "d8-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "condition": "08:15 還無法入座就外帶或回住宿／車站沿線用餐；保住 11:00 到機場目標。",
      "dayHours": "08:00–24:00"
    },
    {
      "placeId": "warsaw-bar-mleczny-prasowy-marszalkowska",
      "role": "替補",
      "note": "不適合本日早餐時段；此店不在旅館旁，無法及時用餐時改找退房路線或車站內店家。",
      "stepId": null,
      "planStatus": "unavailable"
    },
    {
      "placeId": "warsaw-gate-one-airport",
      "role": "午餐候選（僅申根區）",
      "note": "初稿候選保留；QR 260 往多哈須走非申根流程，不將 Gate One 當成可直接抵達的首選。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ]
};
export const dayDining = Object.fromEntries(Object.entries(dayDiningPlans).map(([day, items]) => [day, items.map(resolveDining)]));

// 自備與機上餐沒有虛構門市，也不提供餐廳導航。
export const selfCateredMeals = {
  "1": [
    {
      "meal": "breakfast",
      "name": "機上早餐／出發前自理",
      "stepId": "d1-breakfast",
      "note": "依實際航段供餐，不另安排市區早餐。"
    },
    {
      "meal": "lunch",
      "name": "機上、機場或抵達後輕食",
      "stepId": "d1-lunch",
      "note": "依落地與行李時間買三明治、熱飲即可，保留晚餐食量。"
    }
  ],
  "3": [
    {
      "meal": "breakfast",
      "name": "自備早餐（前一天買好）",
      "stepId": "d3-breakfast",
      "note": "07:15–07:35 在住宿吃完，07:35 出門；前一天 Lajkonik 採買的麵包搭飲品，07:55 巴士報到（08:25 發車）。"
    },
    {
      "meal": "lunch",
      "name": "自備午餐與水",
      "stepId": "d3-lunch",
      "note": "依導覽允許的休息時段與用餐區吃三明治／水果；不在參觀區進食，不為午餐離團。"
    }
  ],
  "8": [
    {
      "meal": "lunch",
      "name": "機場安檢後依登機區選餐",
      "stepId": "d8-lunch",
      "note": "依實際可通行的登機區、營業與登機截止選擇；QR 260 往多哈，不把申根區 Gate One 當作首選。"
    },
    {
      "meal": "dinner",
      "name": "機上晚餐",
      "stepId": "d8-dinner",
      "note": "依實際航段與航空公司供餐；若需轉機用餐，先確認登機門與截止時間。"
    }
  ]
};
export const dayMeals = Object.fromEntries(Object.entries(dayDining).map(([day, items]) => {
  const meals = [...items.filter(item => item.meal), ...(selfCateredMeals[day] || [])];
  return [day, ['breakfast', 'lunch', 'dinner'].map(slot => {
    const matching = meals.filter(item => item.meal === slot);
    if (matching.length !== 1) throw new Error('Day ' + day + ' 餐次必須唯一：' + slot);
    return matching[0];
  })];
}));

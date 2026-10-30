import { resolveDining } from './dining-places.js';
// 門市事實只在 dining-places.js 維護；meal 標記當日三餐首選，沒有 meal 的餐廳仍為備選／點心。
export const dayDiningPlans = {
  "1": [
    {
      "placeId": "warsaw-specjaly-regionalne",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "11:30–23:00"
    },
    {
      "placeId": "warsaw-pyzy-flaki-gorace",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-cafe-bristol",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-wedel-krakowskie-45",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-a-blikle-1869",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "2": [
    {
      "placeId": "krakow-pasibus-galeria-krakowska",
      "role": "抵站後速食備案",
      "note": "車站旁 Galeria Krakowska 的 Pasibus／Berlin Döner；10/25 為非營業週日，商場是否開門先確認。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-hankki",
      "role": "晚餐首選（條件式）",
      "note": "18:12 抵站、先入住 ibis，約 18:45 搭車到 Zabłocie 19A，19:15 現場入座；延誤就改近站快食。",
      "stepId": "d2-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "依列車抵達、入住及當晚接單情況；不另外訂位。當晚先備妥隔日導覽餐食。",
      "dayHours": "13:00–21:00"
    },
    {
      "placeId": "krakow-molam-thai",
      "role": "晚餐備選",
      "note": "想把韓式換成泰式（Bib Gourmand，Rajska 3/4；出門前看 Google 地圖有沒有開）時改這間；由住宿出發需搭車，依當晚時間取捨。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-noah",
      "role": "晚餐備選",
      "note": "原首選保留；想吃以色列料理才回 Kazimierz，先確認當晚最後接單。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-green-caffe-nero-centralny",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "10/25 不經中央車站，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "週日 07:00–19:00（Google 地圖）"
    },
    {
      "placeId": "warsaw-mcdonalds-centralna",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "10/25 不經中央車站，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-lajkonik-basztowa",
      "role": "早餐麵包採買備案",
      "note": "10/26、10/27 早餐麵包採買點（週日 07:00–19:00，18:12 抵站後來得及就先買）；抵達後採買只當備案。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "07:00–19:00"
    },
    {
      "placeId": "krakow-pimiento-shop-bistro",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "09:00–15:00（早餐菜單 09:00–13:00，午餐菜單 13:00 起）"
    },
    {
      "placeId": "krakow-polonia",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-przypiecek",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-milkbar-tomasza",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-bar-mleczny-pod-temida",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "去程延後，原時段不排入；僅保留自選餐廳作城市延伸參考。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-endzior",
      "role": "城市延伸備選（改班後原時段不排入）",
      "note": "保留原自選店；10/25 晚抵不排白天散步，且 Endzior 週日不一定有開，不當作當日餐食保證。",
      "stepId": null,
      "planStatus": "candidate"
    }
  ],
  "3": [
    {
      "placeId": "krakow-mr-jerry",
      "role": "晚餐首選（已訂位）",
      "note": "10/26 18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點。",
      "stepId": "d3-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "18:00 已訂位（2 位、無訂金）；Beef Wellington 無法預點，到店再點。週一 15:00–22:00、廚房至 21:30。",
      "dayHours": "15:00–22:00"
    },
    {
      "placeId": "krakow-pod-aniolami",
      "role": "晚餐備選",
      "note": "Mr. Jerry 備案：每日 13:00–23:00，老城 Grodzka 35，木火烤山鱒魚＋野菇湯，點餐前確認 10% 服務費。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-folga",
      "role": "晚餐備選（週一先看 Google 地圖營業狀態）",
      "note": "魚類、海鮮與當季 Sharing Plates，口味較輕；但週一是否營業來源矛盾，10/26 要去先看 Google 地圖當日營業狀態。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-molam-thai",
      "role": "晚餐備選",
      "note": "泰式 Bib Gourmand，出門前看 Google 地圖有沒有開；想吃異國料理時替代。",
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
      "role": "早餐備選（不順路）",
      "note": "原早餐首選；離 ibis 與車站約 1 公里，來回會吃掉 07:55 到站的緩衝，改在 ibis 吃前晚備妥的麵包。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wieliczka-sztolnia",
      "role": "午餐首選",
      "cityGuide": false,
      "note": "12:00 吃蜂蜜啤酒或蒜味豬肋排 57 zł，兩人分一份再加湯；第三方價格，以現場菜單為準。13:20 前結帳，未訂位、現場入座；付款方式未查到，卡與少量現金都帶。",
      "stepId": "d4-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "dayHours": "11:00–22:00"
    },
    {
      "placeId": "wieliczka-bistro-posolone",
      "role": "午餐備案",
      "cityGuide": false,
      "note": "Sztolnia 客滿或出礦太晚時使用；最晚搭 15:11 SKA1，跳過圈餅。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "08:00–18:00"
    },
    {
      "placeId": "krakow-obwarzanek-tunel",
      "role": "午後點心",
      "cityGuide": false,
      "note": "14:10 在 Basztowa／Lubicz 地下道買圈餅；搭 15:11 SKA1 就跳過。",
      "stepId": "d4-snack",
      "planStatus": "scheduled",
      "dayHours": "08:00–18:00"
    },
    {
      "placeId": "wieliczka-karczma-gornicza",
      "role": "午餐備案（不優先）",
      "note": "礦場公司波蘭文頁列目前關閉，英文餐飲頁仍有菜單，官方資訊不一致；未獲礦場確認前不採用，午餐改用礦方確認每日營業的 Bistro Posolone。",
      "stepId": null,
      "planStatus": "unavailable",
      "cityGuide": false
    },
    {
      "placeId": "wroclaw-samarqand",
      "role": "晚餐首選（條件式）",
      "note": "19:50 抵站（Koleo）、20:05 Piast 放行李，20:15 入座：Uzbek Plov 牛肉抓飯、Manti 湯餃與湯品，可分享船形起司麵包。關門前 1 小時廚房就不出餐，晚到就改車站 KFC 或 MAX。",
      "stepId": "d4-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "約 21:00 前能到店且確認仍接單才採用；否則改 KFC Wrocław PKP 或 Wroclavia 的 MAX。IC 3830 預計 19:50 抵達，誤點再用 PKP App 查。",
      "dayHours": "08:00–23:00（廚房關門前 1 小時結束）"
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
      "note": "Wroclavia（Sucha 1）food court，車站步行約 6 分、到 Piast 約 8 分。10/27 週二營業到 22:00，最晚 21:30 前要到店（最後點餐時間未查到）；Samarqand 吃完還想吃，或晚餐改簡單吃時用。IC 3830 預計 19:50 抵達，誤點太久就改 Świdnicka 11 分店（週二到 24:00）。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "09:00–22:00"
    }
  ],
  "5": [
    {
      "placeId": "wroclaw-central-cafe",
      "role": "早餐首選（條件式）",
      "note": "07:30 Piast 出發，07:55 入座；08:35 收尾，08:40 白鸛會堂只看外觀。",
      "stepId": "d5-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "condition": "先確認早餐供應起始；07:55 尚未供餐或需久候就改同街的 Charlotte Pokoyhof。",
      "dayHours": "07:00–21:00"
    },
    {
      "placeId": "wroclaw-charlotte-pokoyhof",
      "role": "早餐備案",
      "note": "Central Cafe 尚未供餐時改 French Breakfast 或 Breakfast with egg；兩店擇一，仍於 08:35 前收尾。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "wroclaw-restauracja-wroclawska",
      "role": "午餐首選",
      "note": "12:00 午餐：Śląskie niebo、Bigos、Pierogi；可訂位但非必要，預設現場候位，+48 71 305 12 28（12:00 起接聽）。13:00 結束去 Panorama，只拍外觀；營業時間出發前再確認。",
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
      "note": "取回行李後買 Frisco Burger 或 Halloumi 漢堡＋地瓜薯條外帶上車；17:45 往 MAX 外帶，18:10 前取餐，18:20 前到主站找月台。不要等到波茲南再吃：IC 260 預計 20:29 抵達，但已是晚上，車站旁 Avenida 21:00 就關。",
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
      "placeId": "poznan-manekin",
      "role": "早餐首選",
      "note": "Kwiatowa 3；官方早餐週一至五 10:00–13:00，營業 10:00–22:00（menu.pl 寫 21:45）。炒蛋煎餅、起司煎餅、pancake burger 或 burrito 約 17.5–24 zł，咖啡約 6 zł；當日公休與價格出發前再確認。11:30 前離開。",
      "stepId": "d6-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "dayHours": "10:00–22:00"
    },
    {
      "placeId": "poznan-inna-piekarnia",
      "role": "早餐備案（不列順位）",
      "note": "Ratajczaka 39，週一至週六 08:30 起：Butter Croissant、麵包與咖啡；只當早餐備案。",
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
      "note": "Plac Ratajskiego 1（週四 09:00–17:00），在老城往 Stary Browar 的路上；ROGAL 排隊或售完時改這間買。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-stary-browar-food-hall",
      "role": "午餐首選",
      "note": "午餐 · Stary Browar Food Hall 與逛街；商場週一至六 09:00–21:00，Food Hall 週一至四 12:00–22:00，出發前再確認。舊啤酒廠紅磚建築與洗手間，14:00 離開。",
      "stepId": "d6-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "dayHours": "12:00–22:00"
    },
    {
      "placeId": "poznan-pyra-bar",
      "role": "午餐備案",
      "note": "Strzelecka 13，週四 11:00–21:00 全天有開。Stary Browar Food Hall 客滿時改這間：Pyry z bzikiem 與 Szare ale jare 兩人分享；13:00 午餐備案，仍保留 14:00 離開。",
      "stepId": null,
      "planStatus": "candidate",
      "dayHours": "11:00–21:00"
    },
    {
      "placeId": "poznan-zen-on",
      "role": "午餐備選",
      "note": "Michelin 推薦拉麵，Święty Marcin 21，週四 12:00–20:00：拉麵、烏龍麵、bao；Stary Browar Food Hall 客滿時的另一個午餐備案，13:00 用餐，尖峰常排隊。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-pasibus-swiety-marcin",
      "role": "午餐速食備案",
      "note": "Święty Marcin 58/64，12:00–23:00；Stary Browar Food Hall 客滿、Pyra Bar 又排隊時改這間。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "poznan-hycka",
      "role": "不當替補（Śródka 09:44 經過時未開）",
      "note": "大波蘭菜、烤鴨配蒸糰；店在 Śródka，週四 11:00 才開，上午經過時還沒營業，中午從市中心折回又不順路。Stary Browar Food Hall 客滿改 Pyra Bar 或 Zen On。",
      "stepId": null,
      "planStatus": "unavailable"
    },
    {
      "placeId": "warsaw-arirang-restaurant",
      "role": "晚餐首選（條件式）",
      "note": "19:59（Koleo）抵華沙、20:15 入住放行李後，20:20 到 Nowogrodzka 38（從 Hotel Metropol 步行約 3 分／約 150–200 m）：Bulgogi 韓式烤牛肉、拌飯，或 Jajangmyeon、海鮮煎餅。出發前再確認；20:40 前還沒能入座就改 Złote Tarasy 或 Ćma。",
      "stepId": "d6-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "週四 12:00–22:00（多個目錄一致，無店家官網），最後點餐時間未查到；不用訂位，當天先看 Google 地圖營業狀態；出發前再確認，20:20 到店；20:40 前還沒能入座就改 Złote Tarasy 或 Ćma。",
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
      "note": "原首選保留；24 小時營業，出發前再確認；Arirang 20:40 前不能入座或誤點時改這間（Chipotle 手撕牛肉吐司、Burrata 沙拉或烤鮭魚），深夜先確認菜色。",
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
      "note": "08:10–08:50 早餐，Zgoda 3/5；Bagel、Scrambled Eggs 或 Avocado Toast＋咖啡，接著 08:55 拍 MSN 與科學文化宮並搭 M1 往北。營業時間出發前再確認。",
      "stepId": "d7-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "dayHours": "07:30–23:00"
    },
    {
      "placeId": "warsaw-kubus-piekarenka-marszalkowska",
      "role": "早餐備選",
      "note": "Marszałkowska 19，08:00–20:00（出發前再確認）；離 Zgoda 約 1.8 km，需另留交通時間，座標未驗證。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-gospoda-pod-zygmuntem",
      "role": "午餐首選",
      "note": "Świętojańska 15，週五 11:00–23:00（出發前再確認）；Google 4.7／15,253 則評論，評分來自第三方 Google 評論。13:45 離開；客滿改 Gościniec Polskie Pierogi（Krakowskie Przedmieście 29，11:00–23:30，出發前再確認；Google 4.7／24,488 則評論，評分來自第三方 Google 評論），約 14:00 在往南路上吃；此備案刪掉 BUW 屋頂花園和河邊美人魚，從 Tamka 走回 Nowy Świat 搭 116 或 180 到 Łazienki Królewskie，接著到水上宮殿。",
      "stepId": "d7-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "condition": "Gospoda 客滿 → Gościniec，約 14:00 在往南路上吃；此備案刪掉 BUW 屋頂花園和河邊美人魚，從 Tamka 走回 Nowy Świat 搭 116 或 180 到 Łazienki Królewskie，接著到水上宮殿。",
      "dayHours": "11:00–23:00（出發前再確認）"
    },
    {
      "placeId": "warsaw-gosciniec-polskie-pierogi",
      "role": "午餐備案",
      "note": "Krakowskie Przedmieście 29，11:00–23:30（出發前再確認）；Google 4.7／24,488 則評論，評分來自第三方 Google 評論。如果改去 Gościniec：12:50 從城堡廣場慢慢沿皇家大道往南走，看總統府、Bristol、訪親會教堂、華沙大學，約 14:00 在 Krakowskie Przedmieście 29 吃午餐；吃完接聖十字教堂、哥白尼紀念碑、Tamka 街蕭邦長椅；這個情況下刪掉 BUW 屋頂花園和河邊美人魚，從 Tamka 走回 Nowy Świat 搭 116 或 180 到 Łazienki Królewskie，接著到水上宮殿。餐廳座標未驗證。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-cafe-bristol",
      "role": "午餐備選",
      "note": "午餐備選；需由城堡往南再折返老城，依當天時間取捨。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-soul-kitchen",
      "role": "晚餐首選（威靈頓）",
      "note": "10/30 18:00–20:00、2 人已訂妥；17:50 從 Metropol 步行約 8 分到 Nowogrodzka 18A。店家保留訂位 15 分鐘，已註記 1 份 Beef Wellington。",
      "stepId": "d7-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "店家 10/22 回信已確認訂位，威靈頓為店家已註記，未擴大解讀為供餐保證；確認信存離線。",
      "dayHours": "17:30–23:00（週五另有 12:00–16:30，下午休息）"
    },
    {
      "placeId": "warsaw-primitivo",
      "role": "威靈頓備選",
      "note": "Waliców 13（Wola），Tripadvisor 華沙威靈頓榜第一，週五至 23:00；離晚上動線較遠，Soul Kitchen 客滿或點不到威靈頓、又堅持要吃時再考慮。",
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
      "note": "老城廣場 27：城市延伸選項；晚餐想在老城吃最後一晚也可以，綜合 Pierogi、Żurek、波蘭烤鴨。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "warsaw-wyraj",
      "role": "晚餐備選",
      "note": "原首選保留；Krochmalna 59（Wola），週五 12:00–00:00。新行程白天都在老城與瓦津基，離 Wola 較遠，Soul Kitchen 客滿時再考慮。",
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
      "role": "下午點心備選（10/30 新路線不排入）",
      "note": "10/30 改為 BUW 後步行接公車 116 或 180 到瓦津基，QQ 不在順路範圍；想吃抹茶與韓式吐司再自行安排。Żurawia 32/34，週五 11:00–20:00（店家 Instagram，另有目錄列週二休），前往前確認。",
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
      "placeId": "warsaw-baken",
      "role": "早餐首選",
      "note": "Żurawia 6/12，09:00–09:35 丹麥風早餐、自家酸種麵包。不收訂位，現場排隊。第三方評論 4.4／約 1,400 則（評分來自第三方評論）。",
      "stepId": "d8-breakfast",
      "planStatus": "scheduled",
      "meal": "breakfast",
      "condition": "BAKEN 客滿時改外帶或車站沿線用餐，保留回飯店與退房時間。",
      "dayHours": "08:00–16:30（出發前再確認）"
    },
    {
      "placeId": "warsaw-charlotte-zlota",
      "role": "早餐備選（較遠）",
      "note": "Złota 83，原機場日早餐首選；來回步行約 85 分鐘，機場日不採用，留作備選。",
      "stepId": null,
      "planStatus": "candidate"
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
      "note": "QR 260 往杜哈須走非申根流程，不將 Gate One 當成可直接抵達的首選。",
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
      "name": "早餐 · 自理",
      "stepId": "d1-breakfast",
      "note": "今天仍在臺灣，依出門時間安排。"
    },
    {
      "meal": "lunch",
      "name": "午餐 · 自理",
      "stepId": "d1-lunch",
      "note": "依出門時間安排。"
    },
    {
      "meal": "dinner",
      "name": "晚餐 · 桃園機場",
      "stepId": "d1-dinner",
      "note": "先完成報到、安檢及登機門確認，再依可用時間用餐。"
    }
  ],
  "3": [
    {
      "meal": "breakfast",
      "name": "自備早餐（前一天買好）",
      "stepId": "d3-breakfast",
      "note": "07:15–07:35 在住宿吃完，07:35 出門；前一天在 Lajkonik 麵包店買的麵包搭飲品，07:55 巴士報到（08:25 發車）。"
    },
    {
      "meal": "lunch",
      "name": "自備午餐與水",
      "stepId": "d3-lunch",
      "note": "依導覽允許的休息時段與用餐區吃三明治／水果；不在參觀區進食，不為午餐離團。"
    }
  ],
  "4": [
    {
      "meal": "breakfast",
      "name": "自備早餐（前晚買好）",
      "stepId": "d4-breakfast",
      "note": "前晚在 Lajkonik 麵包店（Basztowa 15）或 Żabka 買好麵包與飲品，07:05–07:45 在 ibis 吃完；車站只隔約 200 公尺，07:55 前到站。"
    }
  ],
  "8": [
    {
      "meal": "lunch",
      "name": "機場安檢後依登機區選餐",
      "stepId": "d8-lunch",
      "note": "依實際可通行的登機區、營業與登機截止選擇；QR 260 往杜哈，不把申根區 Gate One 當作首選。"
    },
    {
      "meal": "dinner",
      "name": "機上晚餐",
      "stepId": "d8-dinner",
      "note": "依實際航段與航空公司供餐；若需轉機用餐，先確認登機門與截止時間。"
    }
  ],
  "2": [
    {
      "meal": "breakfast",
      "name": "早餐 · 機上或杜哈轉機",
      "stepId": "d2-breakfast",
      "note": "依實際供餐與登機門時間調整。"
    },
    {
      "meal": "lunch",
      "name": "午餐 · 機上或機場輕食",
      "stepId": "d2-lunch",
      "note": "先入境、提行李與轉西站，不繞路進市中心用餐。"
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

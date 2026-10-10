import { resolveDining } from './dining-places.js';
// 門市事實只在 dining-places.js 維護；meal 標記當日三餐首選，沒有 meal 的餐廳仍為備選／點心。
export const dayDiningPlans = {
  "1": [
    {
      "placeId": "warsaw-specjaly-regionalne",
      "role": "晚餐首選",
      "note": "酸黑麥湯＋梅醬豬肋排或烤鴨，餃子留明天。皇家大道散步後用餐，先確認座位；抵達晚就縮短散步。",
      "stepId": "d1-dinner",
      "planStatus": "scheduled",
      "meal": "dinner"
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
      "role": "午餐備選",
      "note": "原首選保留；往 Wawel 路上的牛奶吧，取代 Przypiecek，不加一餐。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-noah",
      "role": "晚餐備選",
      "note": "原首選保留；想吃以色列料理才回 Kazimierz，先確認當晚最後接單；Endzior 僅為有餘裕的點心。",
      "stepId": null,
      "planStatus": "candidate"
    },
    {
      "placeId": "krakow-hankki",
      "role": "晚餐首選（條件式）",
      "note": "辛德勒工廠參觀約至 19:30，移動後暫排 19:45。點 Popcorn chicken 炸雞＋Red jjamppong 辣湯麵；飯後不再特地折返吃點心。",
      "stepId": "d2-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "須先確認 19:45 仍接單；若工廠改到更晚場，改當時仍營業的快食。"
    },
    {
      "placeId": "warsaw-green-caffe-nero-centralny",
      "meal": "breakfast",
      "role": "早餐首選（條件式）",
      "stepId": "d2-breakfast",
      "planStatus": "scheduled",
      "note": "退房到中央車站後買法棍＋咖啡外帶；07:55 結束採買，08:05 起找月台。店未開或排隊就用前晚準備的麵包。",
      "condition": "分店開門與品項待確認；不壓縮 08:40 發車前的進站緩衝。"
    },
    {
      "placeId": "krakow-przypiecek",
      "meal": "lunch",
      "role": "午餐首選（條件式）",
      "stepId": "d2-lunch",
      "planStatus": "scheduled",
      "note": "放行李後前往 Sławkowska 32，點 Mix tradycyjny 綜合餃子與甜菜湯；12:30 前離店，另留前往 Wawel 時間。",
      "condition": "抵達時間待查票面；延誤改外帶，先保留預定景點時段。"
    },
    {
      "placeId": "krakow-polonia",
      "role": "午餐備選",
      "stepId": null,
      "planStatus": "candidate",
      "note": "12:00 起才安排；若抵達較晚或想換菜色，可替換 Przypiecek，仍須核對 Wawel 入場。"
    },
    {
      "placeId": "krakow-lajkonik-basztowa",
      "role": "隔日備餐採買",
      "stepId": "d2-prep",
      "planStatus": "scheduled",
      "note": "寄放行李後先買隔日早餐及午餐，順路接 Przypiecek；不等晚餐後才去。需冷藏的餐點先確認住宿保存條件，否則選常溫麵包與水果。"
    }
  ],
  "3": [
    {
      "placeId": "krakow-pod-aniolami",
      "role": "晚餐首選",
      "note": "回城休息後暫排 19:00；木火烤山鱒魚＋野菇湯。預留初稿所列 10% 服務費，訂位時確認；返程延誤先聯絡餐廳。",
      "stepId": "d3-dinner",
      "planStatus": "scheduled",
      "meal": "dinner"
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
      "role": "午餐首選（條件式）",
      "cityGuide": false,
      "note": "導覽後選番茄 Pappardelle＋羊乳酪甜菜沙拉；趕時間改切片披薩或自備麵包。13:30 收尾，另留走回車站與候車時間。",
      "stepId": "d4-lunch",
      "planStatus": "scheduled",
      "meal": "lunch",
      "condition": "13:00 前出礦且有餘裕才坐下吃；較晚結束就外帶，略過 Kazimierz，保住 16:10 抵站。"
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
      "role": "晚餐首選（條件式）",
      "note": "先到 Piast 放行李，再吃烏茲別克牛肉抓飯，可分享船形起司麵包。",
      "stepId": "d4-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "約 21:00 前能到店且確認仍接單才採用；否則改 KFC Wrocław PKP。抵達時間待查票面。"
    },
    {
      "placeId": "wroclaw-kfc-pkp",
      "role": "晚餐備案",
      "stepId": null,
      "planStatus": "candidate",
      "note": "Samarqand 不接單、誤點或太累時，直接在 Wrocław Główny 內用餐／外帶。"
    }
  ],
  "5": [
    {
      "placeId": "wroclaw-restauracja-wroclawska",
      "role": "午餐首選",
      "note": "沿用全景畫後 12:30 午餐；Śląskie niebo 果乾燉豬肉＋Hekele 鯡魚前菜。主菜約需 30 分鐘，13:45 結帳，14:00 前離店接 14:15 國家博物館。",
      "stepId": "d5-lunch",
      "planStatus": "scheduled",
      "meal": "lunch"
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
    },
    {
      "placeId": "wroclaw-central-cafe",
      "meal": "breakfast",
      "role": "早餐首選（條件式）",
      "stepId": "d5-breakfast",
      "planStatus": "scheduled",
      "note": "貝果＋燕麥粥；08:15 前收尾，接 09:00 老城廣場。",
      "condition": "先確認早餐供應起始；07:30 尚未供餐或需久候就改 Charlotte Pokoyhof。"
    },
    {
      "placeId": "wroclaw-charlotte-pokoyhof",
      "role": "早餐備案",
      "stepId": null,
      "planStatus": "candidate",
      "note": "Central Cafe 尚未供餐時改法式麵包早餐；兩店擇一，仍於 08:15 前收尾。"
    },
    {
      "placeId": "wroclaw-max-wroclavia",
      "meal": "dinner",
      "role": "晚餐首選（條件式）",
      "stepId": "d5-dinner",
      "planStatus": "scheduled",
      "note": "取回行李後買 Frisco 或 Halloumi 漢堡外帶上車；18:15 前取餐，18:35 前到主站找月台。",
      "condition": "若取行李或候餐延誤就直接去車站 KFC／買現成麵包，不為用餐壓縮 19:10 火車緩衝。"
    },
    {
      "placeId": "wroclaw-kfc-pkp",
      "role": "晚餐備案",
      "stepId": null,
      "planStatus": "candidate",
      "note": "MAX 排隊或來不及繞到 Wroclavia 時改主站內外帶；18:35 後以進站為優先。"
    },
    {
      "placeId": "wroclaw-oseyo-25",
      "role": "午餐備選（待確認）",
      "stepId": null,
      "planStatus": "candidate",
      "note": "想吃韓式可另選，但門牌與營業未核實，不當作當日可靠備案。"
    }
  ],
  "6": [
    {
      "placeId": "poznan-pyra-bar",
      "role": "午餐首選",
      "note": "山羊秀後選 Pyry z bzikiem 或 Szare ale jare，兩人分享；13:15 收尾、另留前往帝王城堡的時間。排隊太久改外帶。",
      "stepId": "d6-lunch",
      "planStatus": "scheduled",
      "meal": "lunch"
    },
    {
      "placeId": "warsaw-cma-hala-koszyki",
      "role": "晚餐首選（條件式）",
      "note": "抵華沙、放行李後再前往；Chipotle 手撕牛肉吐司＋Burrata 沙拉，或檸檬醬烤鮭魚。",
      "stepId": "d6-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "營業 24 小時不保證全菜單供應；深夜先確認菜色，太累就找車站當時營業的外帶。"
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
    },
    {
      "placeId": "poznan-ptasie-radio",
      "meal": "breakfast",
      "role": "早餐首選（條件式）",
      "stepId": "d6-breakfast",
      "planStatus": "scheduled",
      "note": "08:00–08:40 早餐：麵包配煙燻鱒魚抹醬、蛋沙拉或班尼迪克蛋；之後預留約 50 分鐘移動，教堂島調整為 09:30。",
      "condition": "若教堂島必須維持 09:00，改 Charlotte 07:30 早餐並重算交通；有訂票以票面優先。"
    },
    {
      "placeId": "poznan-charlotte-krysiewicza",
      "role": "早餐備案",
      "stepId": null,
      "planStatus": "candidate",
      "note": "要提早前往教堂島時，改 07:30–08:00 早餐，08:00 後出發；開門與交通先確認。"
    },
    {
      "placeId": "poznan-inna-piekarnia",
      "role": "早餐備選（待確認）",
      "stepId": null,
      "planStatus": "candidate",
      "note": "原稿候選保留；未確認分店與開門時間，不排入早出門主線。"
    }
  ],
  "7": [
    {
      "placeId": "warsaw-cafe-bristol",
      "role": "午餐／茶點備選",
      "note": "原首選保留；主餐與湯自 12:00 起，採用就要重排行程，不與 WARSZE 午餐疊加。",
      "stepId": null,
      "planStatus": "candidate"
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
      "role": "晚餐首選（條件式）",
      "note": "起義博物館後暫排 18:30；當季穀物料理搭野禽／野味，秋季菜單以現場為準。",
      "stepId": "d7-dinner",
      "planStatus": "scheduled",
      "meal": "dinner",
      "condition": "週五資訊有分歧，須向店家確認 10/30 營業與座位；不適用改 U Fukiera，另留往老城交通。"
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
    },
    {
      "placeId": "warsaw-bar-mleczny-bambino",
      "meal": "breakfast",
      "role": "早餐首選",
      "stepId": "d7-breakfast",
      "planStatus": "scheduled",
      "note": "08:00–08:45 牛奶吧早餐：菠菜歐姆蛋、鮮乳酪配酸奶油與小紅蘿蔔；之後預留交通，09:30 前往皇家城堡入口報到。"
    },
    {
      "placeId": "warsaw-warsze-polin",
      "meal": "lunch",
      "role": "午餐首選（條件式）",
      "stepId": "d7-lunch",
      "planStatus": "scheduled",
      "note": "皇家城堡結束後直達 POLIN，12:00–12:45 先吃館內猶太風味當日午餐，再接 13:15 展覽。",
      "condition": "當日午餐供應與出餐速度先確認；12:30 仍未能用餐就改現成輕食，不延誤入展。"
    },
    {
      "placeId": "warsaw-kieliszki-na-proznej",
      "role": "晚餐備選",
      "stepId": null,
      "planStatus": "candidate",
      "note": "初稿候選保留；先確認菜單、當日營業與空位，再取代 WYRAJ，不另外增加晚餐。"
    }
  ],
  "8": [
    {
      "placeId": "warsaw-bar-mleczny-prasowy-marszalkowska",
      "role": "替補",
      "note": "不適合本日早餐時段；此店不在旅館旁，無法及時用餐時改找退房路線或車站內店家。",
      "stepId": null,
      "planStatus": "unavailable"
    },
    {
      "placeId": "warsaw-charlotte-zlota",
      "meal": "breakfast",
      "role": "早餐首選（條件式）",
      "stepId": "d8-breakfast",
      "planStatus": "scheduled",
      "note": "08:00–08:45 法式吐司或歐姆蛋；07:20 左右由住宿出發，吃完預留 45 分鐘回 Metropol 取行李，09:45 退房出發。",
      "condition": "08:15 還無法入座就外帶或回住宿／車站沿線用餐；保住 11:00 到機場目標。"
    },
    {
      "placeId": "warsaw-gate-one-airport",
      "role": "午餐候選（僅申根區）",
      "stepId": null,
      "planStatus": "candidate",
      "note": "初稿候選保留；QR 260 往多哈須走非申根流程，不將 Gate One 當成可直接抵達的首選。"
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
      "note": "06:00–06:20 在住宿吃完，06:20 出門；前一天 Lajkonik 採買的麵包搭飲品，06:40 巴士報到。"
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
      "name": "前晚備妥的早餐",
      "stepId": "d4-breakfast",
      "note": "麵包、優格、水果與飲品；依保存條件準備，吃完退房寄行李，不為早餐繞路。"
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

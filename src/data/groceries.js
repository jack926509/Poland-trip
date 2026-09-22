import { groceryPhotos } from './grocery-photos.js';
// 門市候選沿用使用者採買指南；商品於 2026-09-22 依逐項來源重新收錄。
//
// 2026-09-22 逐店核對：12 筆地址全部由品牌官方來源確認（見
// docs/research/2026-09-22-grocery-branch-verification.md）。
// verified＝官方門市頁同時給出地址與逐日營業時間；partial＝地址已由官方來源確認，
// 營業時間本輪無法由官方取得（Lidl 門市頁的時間由 JS 載入、Żabka 不逐店公布）。
// 品牌官方入口（sklepy／znajdz-sklep 首頁）仍然不能當作單店證據，
// 只有逐店頁或官方門市清單才算；營業時間連 Biedronka 自己都註明僅供參考。
export const groceryChains = [
  {
    "id": "biedronka",
    "name": "Biedronka",
    "kind": "平價連鎖超市",
    "buy": "巧克力、糖果、零食、早餐與集中採買",
    "url": "https://www.biedronka.pl/pl/sklepy"
  },
  {
    "id": "lidl",
    "name": "Lidl",
    "kind": "連鎖超市",
    "buy": "麵包、乳製品、自有品牌與食品補給",
    "url": "https://www.lidl.pl/"
  },
  {
    "id": "zabka",
    "name": "Żabka",
    "kind": "便利商店",
    "buy": "飲料、咖啡、Hot Dog、三明治；熱食品項依分店",
    "url": "https://www.zabka.pl/znajdz-sklep/"
  }
];

export const groceryBranches = [
  {
    "id": "warsaw-1",
    "cityKey": "warsaw",
    "chain": "biedronka",
    "name": "Biedronka",
    "address": "Al. Jerozolimskie 54, 00-024 Warszawa, Poland",
    "area": "Warszawa Centralna／文化科學宮一帶",
    "note": "抵達華沙後補水與早餐；最後一晚集中採買伴手禮；回程前最後補貨",
    "hours": "每日 05:00–01:00（官方門市頁）",
    "sundayOpen": true,
    "sundayNote": "官方門市頁標示「sklep czynny w niedzielę」，非交易星期日也營業（車站型門市）。",
    "sourceUrl": "https://www.biedronka.pl/pl/shop,id,2678,title,warszawa-al-jerozolimskie-54",
    "verificationStatus": "verified",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "warsaw-2",
    "cityKey": "warsaw",
    "chain": "lidl",
    "name": "Lidl",
    "address": "ul. Wolska 19/25, 01-207 Warszawa, Poland",
    "area": "華沙起義博物館附近",
    "note": "博物館行程順路補貨；想買 Lidl 自有品牌時特別前往",
    "hours": "待確認",
    "sundayOpen": false,
    "sundayNote": "非車站門市，非交易星期日應視為不營業。",
    "sourceUrl": "https://www.lidl.pl/s/pl-PL/sklepy/warszawa/ul-wolska-19-25",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "warsaw-3",
    "cityKey": "warsaw",
    "chain": "zabka",
    "name": "Żabka - Wars Sawa Junior",
    "address": "Marszałkowska 104/122, 00-017 Warszawa, Poland",
    "area": "市中心",
    "note": "晚上臨時補給；咖啡、飲料、熱食；不想特別繞路時",
    "hours": "待確認",
    "sundayOpen": null,
    "sundayNote": "Żabka 星期日與夜間營業依各店公告，須逐店確認。",
    "sourceUrl": "https://www.zabka.pl/konkurs-merch",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "krakow-1",
    "cityKey": "krakow",
    "chain": "biedronka",
    "name": "Biedronka",
    "address": "Rynek Główny 34, 31-010 Kraków, Poland",
    "area": "老城中央廣場",
    "note": "老城行程中直接採買；零食與伴手禮試吃",
    "hours": "週一至週六 06:00–23:00；星期日不營業（官方門市頁）",
    "sundayOpen": false,
    "sundayNote": "官方門市頁星期日為 Zamknięte，沒有「czynny w niedzielę」標記。",
    "sourceUrl": "https://www.biedronka.pl/pl/shop,id,2853,title,krakow-rynek-glowny-34",
    "verificationStatus": "verified",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "krakow-2",
    "cityKey": "krakow",
    "chain": "lidl",
    "name": "Lidl",
    "address": "ul. Mogilska 116, 31-445 Kraków, Poland",
    "area": "老城東側，離中央廣場有段距離",
    "note": "想特別找 Lidl 商品；不建議為了少量補給特別繞路",
    "hours": "待確認",
    "sundayOpen": false,
    "sundayNote": "非車站門市，非交易星期日應視為不營業。",
    "sourceUrl": "https://www.lidl.pl/s/pl-PL/sklepy/krakow/ul-mogilska-116",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "krakow-3",
    "cityKey": "krakow",
    "chain": "zabka",
    "name": "Żabka",
    "address": "Rynek Główny 6, 31-042 Kraków, Poland",
    "area": "老城中央廣場",
    "note": "老城臨時補飲料；晚上宵夜；星期日大型超市不便時作備案",
    "hours": "待確認",
    "sundayOpen": null,
    "sundayNote": "Żabka 星期日與夜間營業依各店公告，須逐店確認。",
    "sourceUrl": "https://cdn.zabka.pl/wp-content/uploads/2024/02/02092801/Lista-sklepow-Zabka-z-dostepnymi-produktami-Ramen-Szamamm.pdf",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "wroclaw-1",
    "cityKey": "wroclaw",
    "chain": "biedronka",
    "name": "Biedronka",
    "address": "Krawiecka 3a, 50-148 Wrocław, Poland",
    "area": "老城／Rynek 一帶",
    "note": "老城行程途中採買；零食、巧克力、香腸補貨",
    "hours": "週一至週六 06:00–23:00；星期日不營業（官方門市頁）",
    "sundayOpen": false,
    "sundayNote": "官方門市頁星期日為 Zamknięte，沒有「czynny w niedzielę」標記。",
    "sourceUrl": "https://www.biedronka.pl/pl/shop,id,940,title,wroclaw-krawiecka-3a",
    "verificationStatus": "verified",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "wroclaw-2",
    "cityKey": "wroclaw",
    "chain": "lidl",
    "name": "Lidl",
    "address": "ul. Braniborska 82, 53-680 Wrocław, Poland",
    "area": "火車站西側",
    "note": "一次買比較多；想找 Lidl 自有品牌",
    "hours": "待確認",
    "sundayOpen": false,
    "sundayNote": "非車站門市，非交易星期日應視為不營業。",
    "sourceUrl": "https://www.lidl.pl/s/pl-PL/sklepy/wroclaw/braniborska-82",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "wroclaw-3",
    "cityKey": "wroclaw",
    "chain": "zabka",
    "name": "Żabka",
    "address": "Rynek 8 lok. 1A, 50-106 Wrocław, Poland",
    "area": "老城 Rynek",
    "note": "最順路；飲料、咖啡、Hot Dog、臨時補給",
    "hours": "待確認",
    "sundayOpen": null,
    "sundayNote": "Żabka 星期日與夜間營業依各店公告，須逐店確認。",
    "sourceUrl": "https://cdn.zabka.pl/wp-content/uploads/2024/02/02092801/Lista-sklepow-Zabka-z-dostepnymi-produktami-Ramen-Szamamm.pdf",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "poznan-1",
    "cityKey": "poznan",
    "chain": "biedronka",
    "name": "Biedronka",
    "address": "Dworcowa 2, 61-801 Poznań, Poland",
    "area": "Poznań Główny 車站／Avenida",
    "note": "抵達或離開波茲南時採買；搭車前買零食與飲料",
    "hours": "週一至週六 06:00–23:00；星期日 06:00–22:00（官方門市頁）",
    "sundayOpen": true,
    "sundayNote": "官方門市頁標示「sklep czynny w niedzielę」，非交易星期日也營業（車站型門市）。",
    "sourceUrl": "https://www.biedronka.pl/pl/shop,id,2817,title,poznan-dworcowa-2",
    "verificationStatus": "verified",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "poznan-2",
    "cityKey": "poznan",
    "chain": "lidl",
    "name": "Lidl",
    "address": "ul. Św. Marcin 24, 61-805 Poznań, Poland",
    "area": "市中心 Św. Marcin 街",
    "note": "市中心散步途中採買；Lidl 自有品牌補貨",
    "hours": "待確認",
    "sundayOpen": false,
    "sundayNote": "非車站門市，非交易星期日應視為不營業。",
    "sourceUrl": "https://www.lidl.pl/s/pl-PL/sklepy/poznan/ul-sw-marcin-24",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  },
  {
    "id": "poznan-3",
    "cityKey": "poznan",
    "chain": "zabka",
    "name": "Żabka",
    "address": "ul. Stary Rynek 53/54, 61-840 Poznań, Poland",
    "area": "老城 Stary Rynek",
    "note": "山羊鐘樓秀前後；飲料、咖啡、熱食",
    "hours": "待確認",
    "sundayOpen": null,
    "sundayNote": "Żabka 星期日與夜間營業依各店公告，須逐店確認。",
    "sourceUrl": "https://cdn.zabka.pl/wp-content/uploads/2024/02/02092801/Lista-sklepow-Zabka-z-dostepnymi-produktami-Ramen-Szamamm.pdf",
    "verificationStatus": "partial",
    "verifiedAt": "2026-09-22"
  }
];

// rank 僅保留既有商品錨點相容性，不代表排名；新商品使用新的識別碼。
export const groceryProducts = [
  {
    "rank": 1,
    "name": "鳥奶巧克力",
    "localName": "Ptasie Mleczko",
    "packaging": "E. Wedel 長方紙盒",
    "use": "伴手禮候選",
    "priority": true,
    "note": "E. Wedel 巧克力包覆的輕盈奶霜甜點。找長方形紙盒上的 Ptasie Mleczko；Waniliowe 是香草、Czekoladowe 是巧克力、Śmietankowe 是奶油。",
    "reason": "2026 遊記推薦香草口味；巧克力外層搭配輕柔奶霜。照片示範巧克力口味，購買時另看口味名稱。",
    "sources": [
      {
        "title": "Becca Daily｜波蘭伴手禮",
        "url": "https://beccadaily.com/poland-souvenirs/",
        "date": "2026-07-02",
        "kind": "2026 旅遊推薦"
      },
      {
        "title": "English Wizards｜Polish Snacks and Souvenirs",
        "url": "https://englishwizards.org/student-stories/polish-snacks-souvenirs/",
        "date": "未標示日期",
        "kind": "採買指南（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 11,
    "name": "李子巧克力",
    "localName": "Śliwka Nałęczowska",
    "packaging": "藍底綠點包裝，找 Śliwka 字樣",
    "use": "伴手禮候選",
    "priority": true,
    "note": "果乾搭配巧克力，適合喜歡水果風味的人。品牌有不同容量，照片為包裝辨識參考。",
    "reason": "2026 遊記中作者最推薦的一款，適合優先買小盒試吃。",
    "sources": [
      {
        "title": "Becca Daily｜波蘭伴手禮",
        "url": "https://beccadaily.com/poland-souvenirs/",
        "date": "2026-07-02",
        "kind": "2026 旅遊推薦"
      },
      {
        "title": "Colian｜Śliwka Nałęczowska",
        "url": "https://colian.com/nasze-marki/sliwka-naleczowska-2/",
        "date": "未標示日期",
        "kind": "品牌商品資料"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 6,
    "name": "果凍巧克力餅乾",
    "localName": "Delicje",
    "packaging": "長方形餅乾包",
    "use": "伴手禮候選",
    "priority": true,
    "note": "Delicje Szampańskie 果凍巧克力餅乾；可先試橘子口味，袋面常見橘子圖案。",
    "reason": "2026 遊記推薦的果味巧克力點心，可從柳橙口味開始。",
    "sources": [
      {
        "title": "Becca Daily｜波蘭伴手禮",
        "url": "https://beccadaily.com/poland-souvenirs/",
        "date": "2026-07-02",
        "kind": "2026 旅遊推薦"
      },
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 12,
    "name": "鹹餅乾棒",
    "localName": "Paluszki",
    "packaging": "細長餅乾棒袋裝；照片為 Lajkonik",
    "use": "伴手禮／旅途零食",
    "priority": true,
    "note": "想換鹹口味時可找鹽味或芝麻口味。Paluszki 是品類名稱，照片品牌只是辨識範例，並非來源指定品牌。",
    "reason": "2026 遊記列入推薦的鹹口零食；便於旅行途中分享。",
    "sources": [
      {
        "title": "Becca Daily｜波蘭伴手禮",
        "url": "https://beccadaily.com/poland-souvenirs/",
        "date": "2026-07-02",
        "kind": "2026 旅遊推薦"
      },
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 13,
    "name": "Princessa 威化餅",
    "localName": "Princessa",
    "packaging": "單支長條包裝；照片為椰子口味",
    "use": "伴手禮／旅途零食",
    "priority": false,
    "note": "想和 Prince Polo 比較口味時可各買一支。照片上的 kokosowa 是椰子口味；來源推薦品牌，沒有指定這個口味。",
    "reason": "2026 遊記列入可順手採買的威化餅。",
    "sources": [
      {
        "title": "Becca Daily｜波蘭伴手禮",
        "url": "https://beccadaily.com/poland-souvenirs/",
        "date": "2026-07-02",
        "kind": "2026 旅遊推薦"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 2,
    "name": "波蘭牛奶糖",
    "localName": "Krówki",
    "packaging": "牛圖案、獨立糖紙",
    "use": "伴手禮候選",
    "priority": false,
    "note": "焦糖牛奶糖，常見乳牛圖案、獨立糖紙與袋裝。找 Krówka／Krówki 字樣。",
    "reason": "牛奶焦糖類經典甜食，獨立糖紙方便分送。",
    "sources": [
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      },
      {
        "title": "English Wizards｜Polish Snacks and Souvenirs",
        "url": "https://englishwizards.org/student-stories/polish-snacks-souvenirs/",
        "date": "未標示日期",
        "kind": "採買指南（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 5,
    "name": "巧克力威化",
    "localName": "Prince Polo",
    "packaging": "長條單支包裝",
    "use": "伴手禮候選",
    "priority": true,
    "note": "巧克力威化餅，長條單支包裝；找 Prince Polo 字樣，適合分送。",
    "reason": "網友反覆提及的巧克力威化，適合搭車時試吃。",
    "sources": [
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      },
      {
        "title": "English Wizards｜Polish Snacks and Souvenirs",
        "url": "https://englishwizards.org/student-stories/polish-snacks-souvenirs/",
        "date": "未標示日期",
        "kind": "採買指南（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 7,
    "name": "堅果巧克力糖",
    "localName": "Michałki",
    "packaging": "獨立糖果、大袋裝",
    "use": "伴手禮候選",
    "priority": false,
    "note": "花生／堅果巧克力糖，多為獨立糖紙與大袋裝；有過敏需求請逐包核對成分。",
    "reason": "喜歡花生巧克力可試；有過敏需求先核對標籤。",
    "sources": [
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 3,
    "name": "波蘭細香腸",
    "localName": "Kabanosy",
    "packaging": "透明長條香腸袋",
    "use": "當地食用",
    "priority": false,
    "note": "細長乾燥香腸；可留意 Tarczyński、Lidl 的 Pikok。Wieprzowe 是豬肉、Drobiowe 是禽肉。僅安排在波蘭當地吃，不列為回台伴手禮。",
    "reason": "網友推薦的鹹口細香腸，安排在波蘭當地吃。",
    "sources": [
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      },
      {
        "title": "English Wizards｜Polish Snacks and Souvenirs",
        "url": "https://englishwizards.org/student-stories/polish-snacks-souvenirs/",
        "date": "未標示日期",
        "kind": "採買指南（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "rank": 8,
    "name": "果汁飲料",
    "localName": "Tymbark",
    "packaging": "玻璃瓶／PET／紙盒",
    "use": "當地食用",
    "priority": false,
    "note": "果汁／果汁飲料。Jabłko 蘋果、Wiśnia 酸櫻桃、Jabłko-Mięta 蘋果薄荷、Multiwitamina 綜合水果；不同系列果汁含量不同。",
    "reason": "網友推薦的在地飲料品牌，順路補給時嘗試即可。",
    "sources": [
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      }
    ],
    "checkedAt": "2026-09-22"
  }
].map(product => ({ ...product, photo: groceryPhotos[product.rank] }));

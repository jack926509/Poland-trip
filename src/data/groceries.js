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
    "id": 1,
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
    "id": 11,
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
    "id": 6,
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
    "id": 12,
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
    "id": 13,
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
    "id": 2,
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
    "id": 5,
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
    "id": 7,
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
      },
      {
        "title": "Wawel｜Michałki z Wawelu Klasyczne",
        "url": "https://www.wawel.com.pl/oferta/michalki-z-wawelu-klasyczne",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌商品資料"
      }
    ],
    "checkedAt": "2026-09-22"
  },
  {
    "id": 3,
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
    "id": 8,
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
  },

  {
    "id": 14,
    "name": "磚型巧克力",
    "localName": "E. Wedel Czekolada",
    "packaging": "E. Wedel 標誌與長方形包裝，依 mleczna（牛奶）或 gorzka（黑巧克力）選口味。",
    "use": "常溫選品",
    "priority": false,
    "reason": "薄片容易分配行李空間，可先買一片試吃再補送禮數量。",
    "note": "巧克力怕熱；包裝平整不等於耐壓。照片為牛奶巧克力代表包裝。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "E. Wedel 商品系列",
        "url": "https://wedel.com/our-products",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 15,
    "name": "水果軟糖巧克力",
    "localName": "Wawel Mieszanka Krakowska",
    "packaging": "找 Wawel 與 Mieszanka Krakowska 字樣，內為水果軟糖裹巧克力。",
    "use": "常溫選品",
    "priority": false,
    "reason": "想在牛奶糖之外增加口感變化，可試水果軟糖與巧克力的組合。",
    "note": "品牌有多種水果與組合版本，依實際包裝挑選；不是一般實心巧克力。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Wawel 官方商品",
        "url": "https://www.wawel.com.pl/oferta/mieszanka-krakowska",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 16,
    "name": "可可威化餅",
    "localName": "Grześki",
    "packaging": "認 Grześki 字樣；有原味威化及巧克力包覆版本。",
    "use": "常溫選品",
    "priority": false,
    "reason": "可與清單中的 Prince Polo 各買一條試吃，再選喜歡的帶回。",
    "note": "威化餅容易碎，放在硬盒內；照片是可可威化的代表版本。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Colian／Grześki 品牌介紹",
        "url": "https://colian.com/nasze-marki/grzeski/",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 17,
    "name": "托倫薑餅",
    "localName": "Kopernik Katarzynki",
    "packaging": "找 Kopernik、Katarzynki 或 Pierniki 字樣；照片為巧克力包覆薑餅。",
    "use": "常溫選品",
    "priority": false,
    "reason": "想找巧克力與威化以外的波蘭點心，可從托倫薑餅試起。",
    "note": "含香料的薑餅有原味、糖霜及巧克力等版本；餅乾仍需防壓。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Kopernik／Katarzynki 介紹",
        "url": "https://konkurs.kopernik.com.pl/en/24%2C26/dzial_katarzynki__.html",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 18,
    "name": "香草布丁粉",
    "localName": "Dr. Oetker Budyń waniliowy",
    "packaging": "烘焙／甜點粉區的 Budyń 小袋裝；照片為香草口味。",
    "use": "常溫選品・需煮",
    "priority": false,
    "reason": "體積小，適合喜歡自己做甜點的人；回家依包裝加牛奶煮。",
    "note": "這款為需煮的布丁粉，不是即食布丁或只加熱水的版本。其他品牌、口味請各自確認做法。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Dr. Oetker 官方商品與做法",
        "url": "https://www.oetker.pl/produkty/p/budyn-waniliowy",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 19,
    "name": "穀物棒",
    "localName": "Bakalland BA!",
    "packaging": "BA! 大字樣與獨立條裝；照片為 5 Bakalii 果乾堅果版本。",
    "use": "常溫選品・旅途零食",
    "priority": false,
    "reason": "適合搭車時少量補給，也可選幾種口味分享。",
    "note": "BA! 也有麥片等品項，請認條裝穀物棒。含穀物、堅果等成分依各口味標示確認。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Bakalland 官方品牌介紹",
        "url": "https://jeszcodobre.bakalland.pl/",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 20,
    "name": "巧克力榛果奶霜甜點",
    "localName": "Zott Monte",
    "packaging": "冷藏杯裝，Monte 字樣與奶白、巧克力色甜點圖。",
    "use": "當地吃・冷藏",
    "priority": false,
    "reason": "喜歡奶香與榛果巧克力口味，可買小杯當飯後甜點。",
    "note": "找冷藏櫃的 Monte 甜點，別與 Monte Drink 或其他系列混淆；購後依包裝冷藏並儘快食用。",
    "supplement": true,
    "localOnly": true,
    "sources": [
      {
        "title": "Zott Monte Original 官方商品",
        "url": "https://www.zott-dairy.com/pl/marki-produkty/monte/monte-original/",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 21,
    "name": "牛奶米布丁",
    "localName": "Zott Belriso",
    "packaging": "冷藏圓杯，Belriso 字樣；不同口味的醬料與杯蓋圖案不同。",
    "use": "當地吃・冷藏",
    "priority": false,
    "reason": "想試米粒口感的乳製甜點，可選一杯與 Monte 比較。",
    "note": "口味以貨架為準；旅途中維持包裝要求的冷藏條件，住宿沒有冰箱時避免囤貨。",
    "supplement": true,
    "localOnly": true,
    "sources": [
      {
        "title": "Zott Belriso 官方系列",
        "url": "https://www.zott-dairy.com/pl/marki-produkty/belriso/",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 22,
    "name": "甜味白起司杯",
    "localName": "Danio",
    "packaging": "冷藏杯裝，找 Danio、serek 與 waniliowy（香草）字樣。",
    "use": "當地吃・冷藏",
    "priority": false,
    "reason": "喜歡濃稠乳製甜點，可試香草白起司杯；它與一般優格的質地不同。",
    "note": "這是均質白起司甜點，不是原味無糖優格。照片包裝規格可能與現場不同；依標示冷藏。",
    "supplement": true,
    "localOnly": true,
    "sources": [
      {
        "title": "Danio 香草白起司官方商品",
        "url": "https://danio.com.pl/produkty/klasyczne/danio-o-smaku-klasycznej-wanilii/",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 23,
    "name": "米布丁",
    "localName": "Müller Riso",
    "packaging": "Müller 與 Riso 字樣的冷藏杯；照片是櫻桃版本。",
    "use": "當地吃・冷藏",
    "priority": false,
    "reason": "可和 Belriso 擇一試吃；想吃米粒乳製甜點時多一個選擇。",
    "note": "有原味及不同醬料口味，照片不代表各店固定供貨。依包裝冷藏，不安排長途常溫攜帶。",
    "supplement": true,
    "localOnly": true,
    "sources": [
      {
        "title": "Auchan／Müller Riso 商品資料",
        "url": "https://zakupy.auchan.pl/products/riso-deser-mleczno-ry%C5%BCowy-naturalny-m%C3%BCller-200-g/00902378",
        "date": "未標示發布日期；2026-09-23 查閱",
        "kind": "品牌／零售商商品資料（使用者清單補充）"
      }
    ],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 24,
    "name": "焦糖榛果巧克力餅乾",
    "localName": "Jeżyki Classic",
    "packaging": "找 Jeżyki Classic 字樣與長條餅乾袋；照片為 140 g 代表包裝。",
    "use": "常溫零食",
    "priority": false,
    "reason": "餅乾、焦糖與榛果的組合，適合先買一包試吃；『最好吃之一』屬個人口味評語，未找到原始試吃來源。",
    "note": "有奶、榛果等過敏原，依實際包裝成分確認；易碎且怕熱，回程注意防壓。",
    "supplement": true,
    "localOnly": false,
    "sources": [{"title":"Jeżyki 品牌｜Classic","url":"https://jezykiciastka.pl/","date":"未標示發布日期；2026-09-23 查閱","kind":"品牌商品資料（使用者提名）"}],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 25,
    "name": "黑色綜合果汁飲料",
    "localName": "Frugo Czarne",
    "drink": true,
    "packaging": "黑色 FRUGO 大字瓶身；照片為 Czarne 代表包裝。",
    "use": "當地試喝",
    "priority": false,
    "reason": "波蘭品牌飲料；先選一瓶試喝，無須把『國民飲料』當成排行。",
    "note": "Frugo 有不同顏色與配方，Czarne 是其中一款，果汁含量與甜味劑請以瓶身標示為準。",
    "supplement": true,
    "localOnly": true,
    "sources": [{"title":"Frugo 品牌｜Frugo czarne","url":"https://frugo.pl/frugo-czarne","date":"未標示發布日期；2026-09-23 查閱","kind":"品牌商品資料（使用者提名）"}],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 26,
    "name": "蘋果、胡蘿蔔、香蕉果汁",
    "localName": "Kubuś 100% Jabłko Marchew Banan",
    "drink": true,
    "packaging": "Kubuś 小熊與 K 100% 標誌；照片為 300 ml 代表包裝。",
    "use": "當地試喝",
    "priority": false,
    "reason": "Kubuś 有果汁、果泥等不同系列，選 100% 系列小瓶先試。",
    "note": "這款含蘋果、胡蘿蔔、香蕉；其他 Kubuś 系列不一定是 100% 果汁。",
    "supplement": true,
    "localOnly": true,
    "sources": [{"title":"Kubuś 品牌｜100% 300 ml","url":"https://kubus.pl/produkt/kubus-banan-marchew-jablko/","date":"未標示發布日期；2026-09-23 查閱","kind":"品牌商品資料（使用者提名）"}],
    "checkedAt": "2026-09-23"
  },
  {
    "id": 27,
    "name": "波蘭百花蜂蜜",
    "localName": "Miód wielokwiatowy",
    "packaging": "蜂蜜罐看 Miód wielokwiatowy、產地國與生產商；照片為 Sądecki Bartnik 代表包裝。",
    "use": "伴手禮候選",
    "priority": false,
    "reason": "波蘭蜂蜜適合作為採買候選；目前未找到『波蘭 Anna』推薦的原文，這款品牌不歸因於她。",
    "note": "照片是 Sądecki Bartnik 百花蜜，非唯一推薦品牌。混合蜂蜜也可能使用不同國家原料，請看瓶上產地；玻璃瓶需防撞。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {"title":"Sądecki Bartnik｜波蘭養蜂場百花蜜","url":"https://sklep.bartnik.pl/pl/produkt/1587-miod-wielokwiatowy-50-g-z-polskich-pasiek.html","date":"未標示發布日期；2026-09-23 查閱","kind":"品牌商品資料（代表品牌）"},
      {"title":"波蘭文化機構 Culture.pl｜蜂蜜介紹","url":"https://culture.pl/zht/article/50023","date":"2024-11-07；2026-09-23 查閱","kind":"品類介紹"},
      {"title":"波蘭官方｜2026 蜂蜜產地標示","url":"https://www.gov.pl/web/ijhars/nowe-zasady-znakowania-zywnosci-flaga-kraju-pochodzenia-na-owocach-i-warzywach-oraz-zmiany-w-oznakowaniu-przetworow-owocowych-i-miodu","date":"2025-12-02；2026-09-23 查閱","kind":"產地標示規則"}
    ],
    "checkedAt": "2026-09-23"
  }
// id 同時是錨點（#product-<id>）與照片鍵：groceryPhotos 與 assets/photos/grocery-NN.webp
// 都以同一個編號對應。這個欄位原本叫 rank，但商品早就不按它排序
// （目前順序是 1、11、6、12、13…），頁面本身也寫明「不代表銷售或人氣排名」；
// 叫 rank 會讓人以為重排或重編號是安全的，實際上會靜默換掉商品照片。
].map(product => ({ ...product, photo: groceryPhotos[product.id] }));

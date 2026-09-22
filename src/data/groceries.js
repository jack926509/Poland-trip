// 候選地址與商品清單來自使用者 2026-09-22 提供的採買指南。
// pending 不代表門市已核實；官方品牌入口不能當作單店存在／營業時間證據。
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
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "warsaw-2",
    "cityKey": "warsaw",
    "chain": "lidl",
    "name": "Lidl",
    "address": "Wolska 19/25, 01-207 Warszawa, Poland",
    "area": "華沙起義博物館附近",
    "note": "博物館行程順路補貨；想買 Lidl 自有品牌時特別前往",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "warsaw-3",
    "cityKey": "warsaw",
    "chain": "zabka",
    "name": "Żabka - Wars Sawa Junior",
    "address": "Marszałkowska 104/122, 00-017 Warszawa, Poland",
    "area": "市中心",
    "note": "晚上臨時補給；咖啡、飲料、熱食；不想特別繞路時",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "krakow-1",
    "cityKey": "krakow",
    "chain": "biedronka",
    "name": "Biedronka",
    "address": "Rynek Główny 34, 31-010 Kraków, Poland",
    "area": "中央廣場",
    "note": "老城行程中直接採買；零食與伴手禮試吃",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "krakow-2",
    "cityKey": "krakow",
    "chain": "lidl",
    "name": "Lidl",
    "address": "Mogilska 116, 31-445 Kraków, Poland",
    "area": "老城以東",
    "note": "想特別找 Lidl 商品；不建議為了少量補給特別繞路",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "krakow-3",
    "cityKey": "krakow",
    "chain": "zabka",
    "name": "Żabka",
    "address": "Rynek Główny 6, 31-042 Kraków, Poland",
    "area": "中央廣場",
    "note": "老城臨時補飲料；晚上宵夜；星期日大型超市不便時作備案",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "wroclaw-1",
    "cityKey": "wroclaw",
    "chain": "biedronka",
    "name": "Biedronka",
    "address": "Krawiecka 3A, 50-148 Wrocław, Poland",
    "area": "老城／Rynek 東側",
    "note": "老城行程途中採買；零食、巧克力、香腸補貨",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "wroclaw-2",
    "cityKey": "wroclaw",
    "chain": "lidl",
    "name": "Lidl",
    "address": "Braniborska 82, 53-680 Wrocław, Poland",
    "area": "市中心偏西",
    "note": "一次買比較多；想找 Lidl 自有品牌",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "wroclaw-3",
    "cityKey": "wroclaw",
    "chain": "zabka",
    "name": "Żabka",
    "address": "Rynek 8, 50-106 Wrocław, Poland",
    "area": "中央廣場",
    "note": "最順路；飲料、咖啡、Hot Dog、臨時補給",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "poznan-1",
    "cityKey": "poznan",
    "chain": "biedronka",
    "name": "Biedronka",
    "address": "Dworcowa 2, 61-801 Poznań, Poland",
    "area": "Poznań Główny 中央車站附近",
    "note": "抵達或離開波茲南時採買；搭車前買零食與飲料",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "poznan-2",
    "cityKey": "poznan",
    "chain": "lidl",
    "name": "Lidl",
    "address": "Święty Marcin 24, 61-805 Poznań, Poland",
    "area": "市中心／Stary Browar 一帶",
    "note": "市中心散步途中採買；Lidl 自有品牌補貨",
    "verificationStatus": "pending",
    "verifiedAt": null
  },
  {
    "id": "poznan-3",
    "cityKey": "poznan",
    "chain": "zabka",
    "name": "Żabka",
    "address": "Stary Rynek 53/54, 61-840 Poznań, Poland",
    "area": "老城廣場",
    "note": "山羊鐘樓秀前後；飲料、咖啡、熱食",
    "verificationStatus": "pending",
    "verifiedAt": null
  }
];

export const groceryProducts = [
  {
    "rank": 1,
    "name": "鳥奶巧克力",
    "localName": "Ptasie Mleczko",
    "packaging": "E. Wedel 長方紙盒",
    "availability": [
      "◎",
      "○",
      "△"
    ],
    "use": "伴手禮候選",
    "priority": true,
    "note": "E. Wedel 巧克力包覆的輕盈奶霜甜點。找長方形紙盒上的 Ptasie Mleczko；Waniliowe 是香草、Czekoladowe 是巧克力、Śmietankowe 是奶油。"
  },
  {
    "rank": 2,
    "name": "波蘭牛奶糖",
    "localName": "Krówki",
    "packaging": "牛圖案、獨立糖紙",
    "availability": [
      "◎",
      "◎",
      "○"
    ],
    "use": "伴手禮候選",
    "priority": true,
    "note": "焦糖牛奶糖，常見乳牛圖案、獨立糖紙與袋裝。找 Krówka／Krówki 字樣。"
  },
  {
    "rank": 3,
    "name": "波蘭細香腸",
    "localName": "Kabanosy",
    "packaging": "透明長條香腸袋",
    "availability": [
      "◎",
      "◎",
      "○"
    ],
    "use": "當地食用",
    "priority": false,
    "note": "細長乾燥香腸；可留意 Tarczyński、Lidl 的 Pikok。Wieprzowe 是豬肉、Drobiowe 是禽肉。僅安排在波蘭當地吃，不列為回台伴手禮。"
  },
  {
    "rank": 4,
    "name": "洋芋片／零食",
    "localName": "Przysnacki",
    "packaging": "大包零食袋",
    "availability": [
      "◎",
      "○",
      "○"
    ],
    "use": "伴手禮候選",
    "priority": true,
    "note": "洋芋片與玉米零食，找袋面 Przysnacki 字樣；口味與包裝顏色不同，先買小包試吃。"
  },
  {
    "rank": 5,
    "name": "巧克力威化",
    "localName": "Prince Polo",
    "packaging": "長條單支包裝",
    "availability": [
      "◎",
      "◎",
      "◎"
    ],
    "use": "伴手禮候選",
    "priority": true,
    "note": "巧克力威化餅，長條單支包裝；找 Prince Polo 字樣，適合分送。"
  },
  {
    "rank": 6,
    "name": "果凍巧克力餅乾",
    "localName": "Delicje",
    "packaging": "長方形餅乾包",
    "availability": [
      "◎",
      "◎",
      "○"
    ],
    "use": "伴手禮候選",
    "priority": true,
    "note": "Delicje Szampańskie 果凍巧克力餅乾；可先試橘子口味，袋面常見橘子圖案。"
  },
  {
    "rank": 7,
    "name": "堅果巧克力糖",
    "localName": "Michałki",
    "packaging": "獨立糖果、大袋裝",
    "availability": [
      "◎",
      "○",
      "△"
    ],
    "use": "伴手禮候選",
    "priority": false,
    "note": "花生／堅果巧克力糖，多為獨立糖紙與大袋裝；有過敏需求請逐包核對成分。"
  },
  {
    "rank": 8,
    "name": "果汁飲料",
    "localName": "Tymbark",
    "packaging": "玻璃瓶／PET／紙盒",
    "availability": [
      "◎",
      "◎",
      "◎"
    ],
    "use": "當地食用",
    "priority": false,
    "note": "果汁／果汁飲料。Jabłko 蘋果、Wiśnia 酸櫻桃、Jabłko-Mięta 蘋果薄荷、Multiwitamina 綜合水果；不同系列果汁含量不同。"
  },
  {
    "rank": 9,
    "name": "波蘭酸湯",
    "localName": "Żurek",
    "packaging": "湯包／瓶裝／冷藏",
    "availability": [
      "◎",
      "○",
      "△"
    ],
    "use": "當地食用",
    "priority": false,
    "note": "酸黑麥湯。玻璃瓶也可能只是發酵湯底，不是開瓶即食湯；購買前看調理方式、冷藏要求與有無肉類。"
  },
  {
    "rank": 10,
    "name": "波蘭餃子",
    "localName": "Pierogi",
    "packaging": "冷藏透明盒／袋",
    "availability": [
      "◎",
      "◎",
      "△"
    ],
    "use": "當地食用",
    "priority": false,
    "note": "波蘭餃子。Ruskie 馬鈴薯＋起司、z mięsem 肉餡、z kapustą i grzybami 酸菜＋蘑菇。冷藏／冷凍商品先看保存與煮食說明，確認住宿有加熱設備。"
  }
];

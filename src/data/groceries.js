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
    "buy": "飲料、牛奶果汁小瓶、咖啡、Hot Dog、三明治、Szamamm 湯；熱食品項依分店",
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

// 商品事實查核於 2026-10-13；查核日不等於上市日或門市有貨。
const withPhoto = pick => ({ ...pick, photo: groceryPhotos[pick.id] });
const drinkGuide = {
  "checkedAt": "2026-10-13",
  "milk": [
    {
      "id": "milk-laciate",
      "name": "常溫全脂牛奶",
      "localName": "Łaciate 3,2% UHT",
      "when": "商品資料查核 2026/10/13",
      "where": "超市牛奶區；分店庫存依現場",
      "look": "白底乳牛斑紋紙盒，認 Łaciate、UHT、3,2%；官方有 500 ml 與 1 l，照片為 1 l。",
      "why": "沒冰箱時適合買未開封可常溫保存的 UHT；一人早餐可挑 500 ml，避免開封後喝不完。",
      "tip": "開封後須冷藏，500 ml 商品標示 3 天內喝完；以手上包裝為準。不以平台銷售排行當口味評比。",
      "sources": [
        {
          "title": "Mlekpol｜Łaciate 3.2% 500 ml",
          "url": "https://mlekpol.com.pl/index.php/produkt/mleko-uht-laciate-32-2/",
          "kind": "品牌／零售商商品資料"
        },
        {
          "title": "Auchan｜500 ml 保存方式",
          "url": "https://zakupy.auchan.pl/products/mleko-uht-3-2-%C5%82aciate-500-ml/00153712",
          "kind": "品牌／零售商商品資料"
        }
      ]
    },
    {
      "id": "milk-mleczna-dolina-swieze",
      "name": "冷藏鮮奶 1 l",
      "localName": "Mleczna Dolina Mleko świeże 3,2% 1 l",
      "when": "商品資料查核 2026/10/13",
      "where": "Biedronka（Mleczna Dolina 為其自有品牌）；依分店供應",
      "look": "白色塑膠瓶、藍色 Mleczna Dolina 標籤，認 Mleko świeże 與紅色 3,2%；包裝另有 Polskie mleko 標示。照片為實拍的 1 l 瓶裝。",
      "why": "świeże 是冷藏鮮奶，口味比常溫 UHT 新鮮；住宿有冰箱、早餐要配麥片或咖啡時可買。",
      "tip": "要到冷藏櫃找，不是常溫貨架上的 UHT；開封後冷藏並儘快喝完，保存期限與天數以瓶身為準。品牌是 Biedronka 自有，Żabka 等其他店不一定有。",
      "sources": [
        {
          "title": "Biedronka｜Mleczna Dolina 乳製品（含 Mleko świeże 3,2% 1 l）",
          "url": "https://www.biedronka.pl/pl/mleczna-dolina",
          "kind": "品牌／零售商商品資料"
        }
      ]
    },
    {
      "id": "milk-kefir",
      "name": "克菲爾發酵乳",
      "localName": "Kefir Krasnystaw 420 g",
      "when": "商品資料查核 2026/10/13",
      "where": "超市乳品冷藏櫃；分店庫存依現場",
      "look": "認 Krasnystaw、kefir 與 420 g；不要把其他品牌的優惠價格套用到這瓶。",
      "why": "想試微酸的發酵乳，可買小瓶配早餐麵包，和甜味乳飲換換口味。",
      "tip": "依包裝冷藏、開封後儘快喝完；售價與其他品牌的價差看當日貨架。",
      "sources": [
        {
          "title": "Krasnystaw｜瓶裝 Kefir 420 g",
          "url": "https://www.krasnystaw.eu/pl/produkty/kefir/kefir-w-butelce",
          "kind": "品牌／零售商商品資料"
        }
      ]
    }
  ],
  "juice": [
    {
      "id": "juice-tymbark-100",
      "name": "100% 蘋果汁小盒",
      "localName": "Tymbark Sok 100% Jabłko",
      "when": "商品資料查核 2026/10/13",
      "where": "超市果汁區、便利商店；依分店供應",
      "look": "認 Tymbark、Jabłko 與 Sok 100%；官方有 200 ml 小盒，照片為 300 ml 代表包裝。",
      "why": "小盒方便搭車或早餐一次喝完；想喝純蘋果汁時按品名挑，不要拿到 Napój 果味飲料。",
      "tip": "純果汁仍有水果本身的糖。按標籤區分果汁與飲料，不用玻璃瓶／紙盒判斷；保存方式依包裝。",
      "sources": [
        {
          "title": "Tymbark｜純蘋果汁 200 ml",
          "url": "https://tymbark.com/produkt/jablko/",
          "kind": "品牌／零售商商品資料"
        },
        {
          "title": "Tymbark｜其他容量蘋果汁",
          "url": "https://tymbark.com/produkt/jablko-bez-dodatku-cukru/",
          "kind": "品牌／零售商商品資料"
        }
      ]
    },
    {
      "id": "juice-bracia-sadownicy-mango",
      "name": "冷壓蘋果芒果汁",
      "localName": "Bracia Sadownicy Tłoczone jabłko z mango 750 ml",
      "when": "商品資料查核 2026/10/13",
      "where": "部分 Żabka 分店（Wolt 有上架）、其他超市；依分店供應",
      "look": "黃色標籤玻璃瓶，上方白色圓標寫 Bracia Sadownicy，認 tłoczone jabłko z mango 與 750 ml；官方另有 250 ml。照片為實拍的 750 ml 瓶裝。",
      "why": "品牌標示 tłoczony（冷壓）、nie z koncentratu（非濃縮還原）、無添加糖，成分為蘋果汁 90%、芒果泥 10%、維生素 C；想喝帶芒果香的果汁時可選。",
      "tip": "天然混濁、有沉澱屬正常；官方每 100 ml 糖約 9,8 g，仍是含糖飲品，750 ml 一人喝不完可選 250 ml。保存方式以瓶身為準。",
      "sources": [
        {
          "title": "Bracia Sadownicy｜Tłoczone jabłko z mango（容量 750 ml／250 ml）",
          "url": "https://braciasadownicy.pl/produkty/tloczone-jablko-z-mango/",
          "kind": "品牌／零售商商品資料"
        },
        {
          "title": "Wolt｜Żabka 門市 750 ml 上架頁",
          "url": "https://wolt.com/pl/pol/krakow/venue/zabka-jush-podgorze/sok-tloczony-z-jablek-z-mango-bracia-sadownicy-750-ml-itemid-3199d72288475a6f84c3bbda",
          "kind": "品牌／零售商商品資料"
        }
      ]
    },
    {
      "id": "juice-hortex",
      "name": "100% 蘋果汁",
      "localName": "Hortex Sok jabłkowy 1 l",
      "when": "商品資料查核 2026/10/13",
      "where": "超市果汁區；依分店供應",
      "look": "認 Hortex、Jabłko、Sok 100% 與 1 l。照片是紙盒，零售商也有 1 l 塑膠瓶，外觀可能不同。",
      "why": "住宿有冰箱、兩人分飲時可選 1 l；官方零售資料列濃縮還原蘋果汁。",
      "tip": "開封後依包裝冷藏；少量購買先看單件價格，多件優惠不一定適合旅途中使用。",
      "sources": [
        {
          "title": "Auchan｜Hortex 蘋果汁 1 l",
          "url": "https://zakupy.auchan.pl/products/sok-jab%C5%82kowy-100-hortex-1-l/00009087",
          "kind": "品牌／零售商商品資料"
        }
      ]
    },
    {
      "id": "juice-riviva",
      "name": "超市自有品牌蘋果汁",
      "localName": "Riviva Sok 100% Jabłko",
      "when": "商品資料查核 2026/10/13",
      "where": "Biedronka；依分店供應",
      "look": "認 Riviva、Sok 100% 與 Jabłko；官方列多種容量，照片為 1 l 紙盒，另有 200 ml 小盒。",
      "why": "在 Biedronka 順路補給的選擇；單人可找 200 ml，小盒較容易一次喝完。",
      "tip": "先看當日單件價格與優惠件數。有押金標誌的 PET 包裝另收 0.50 zł；紙盒不適用。",
      "sources": [
        {
          "title": "Biedronka｜Riviva 蘋果汁 200 ml",
          "url": "https://zakupy.biedronka.pl/riviva-riviva-sok-100-jablko-200-ml-0000006545.html",
          "kind": "品牌／零售商商品資料"
        },
        {
          "title": "Biedronka｜品項與容量",
          "url": "https://www.biedronka.pl/pl/nutri-score-pl",
          "kind": "品牌／零售商商品資料"
        },
        {
          "title": "Biedronka｜押金制度（2026/05/05 生效）",
          "url": "https://cdn.biedronka.pl/policies/Regulamin_systemu_kaucyjnego_(obowiazuje_od_05.05.2026).pdf",
          "kind": "官方規則"
        }
      ]
    },
    {
      "id": "juice-solevita",
      "name": "柳橙汁候選・現行規格待確認",
      "localName": "Solevita Sok 100% Pomarańcza",
      "when": "2026/10/13 複查：僅有歷史官方品項證據",
      "where": "Lidl 候選；目前分店供應待確認",
      "look": "找 Solevita、Sok 100% 與 Pomarańcza；照片為舊 1 l 代表紙盒，不保證現在外觀或容量。",
      "why": "逛 Lidl 時可留意自有品牌柳橙汁；本次只找到較舊官方清單，先列候選，不列為已確認的當期推薦。",
      "tip": "價格、容量與是否冷藏看實際包裝；NFC 不等於未殺菌鮮榨。",
      "sources": [
        {
          "title": "Lidl｜歷史品項清單，非現貨證明",
          "url": "https://www.lidl.pl/static/assets/VAT-STOP-Lista-produktow-3-877702.pdf",
          "kind": "歷史官方資料；目前規格待確認"
        }
      ]
    }
  ],
  "zabka": [
    {
      "id": "zabka-szamamm-soup",
      "name": "加熱即食湯",
      "localName": "Szamamm Zupa",
      "when": "商品資料查核 2026/10/13",
      "where": "Żabka 冷藏櫃；依當日供應",
      "look": "找 Szamamm 湯名；官方現列 Żurek、Minestrone 等。照片是菇湯麵舊包裝，該口味目前供應未確認。",
      "why": "天冷或晚到住宿時可加一碗湯；想試波蘭風味可找 Żurek，想吃蔬菜湯可找 Minestrone，成分逐款確認。",
      "tip": "購買前確認店內能否加熱，或住宿是否有微波爐；冷藏與加熱方式依包裝。",
      "sources": [
        {
          "title": "Żabka｜Szamamm 現行品牌與湯品",
          "url": "https://www.zabka.pl/marki-wlasne/szamamm/",
          "kind": "品牌／零售商商品資料"
        },
        {
          "title": "Żabka｜2026/01/19 湯品公告",
          "url": "https://www.zabka.pl/sprobuj-pysznych-zup-szamamm-z-linii-porcja-dobrego/",
          "kind": "品牌官方公告"
        }
      ]
    },
    {
      "id": "zabka-wolowiner",
      "name": "加熱即食牛肉漢堡",
      "localName": "Szamamm Wołowiner",
      "when": "商品資料查核 2026/10/13",
      "where": "Żabka；依當日供應",
      "look": "認 Wołowiner 品名；官網菜單有 146 g 一般版與 158 g extra cheddar，照片為代表紅盒。",
      "why": "趕車或餐廳已收店時的熱食備案；喜歡起司可比較 extra cheddar 版本，價格看現場單件價。",
      "tip": "購買前確認加熱服務，保存與加熱照包裝。同系列 Wieprzowiner 本次未確認現行供應。",
      "sources": [
        {
          "title": "Żabka｜官方菜單 Burgery 分類",
          "url": "https://www.zabka.pl/zabka-menu/",
          "kind": "品牌／零售商商品資料"
        }
      ]
    }
  ],
  "labels": [
    [
      "Mleko UHT",
      "常溫保久乳，未開封按包裝保存；開封後冷藏"
    ],
    [
      "Mleko świeże / pasteryzowane",
      "鮮奶／巴氏殺菌乳，依包裝冷藏"
    ],
    [
      "3,2% · 2% · 1,5% · 0,5%",
      "脂肪含量；3,2% 為全脂款"
    ],
    [
      "bez laktozy",
      "無乳糖"
    ],
    [
      "Sok 100%",
      "100% 果汁／蔬果汁，仍有原料本身的糖"
    ],
    [
      "Nektar",
      "果汁／果泥調製飲品，可能加糖或甜味劑；看果汁比例"
    ],
    [
      "Napój",
      "飲料；果汁比例與添加成分看標示"
    ],
    [
      "tłoczony / NFC",
      "壓榨／非濃縮還原；不代表未殺菌，冷藏條件看包裝"
    ],
    [
      "z koncentratu",
      "濃縮還原"
    ],
    [
      "mętny",
      "混濁型"
    ],
    [
      "bez dodatku cukru",
      "無添加糖，不等於無糖"
    ]
  ]
};
export const groceryDrinkGuide = {
  ...drinkGuide,
  milk: drinkGuide.milk.map(withPhoto),
  juice: drinkGuide.juice.map(withPhoto),
  zabka: drinkGuide.zabka.map(withPhoto),
};

// rank 僅保留既有商品錨點相容性，不代表排名；新商品使用新的識別碼。
export const groceryProducts = [
  {
    "id": 1,
    "name": "鳥奶巧克力",
    "localName": "Ptasie Mleczko",
    "packaging": "E. Wedel 長方紙盒",
    "use": "伴手禮候選",
    "priority": true,
    "note": "巧克力包覆的輕盈奶泡糖。Waniliowe 是香草、Czekoladowe 是巧克力、Śmietankowe 是奶油風味；不是冷藏鮮奶油甜點。",
    "reason": "想帶一盒波蘭經典甜食，可先試香草口味；照片為巧克力口味，請另看盒上名稱。",
    "sources": [
      {
        "title": "E. Wedel｜Ptasie Mleczko 香草與系列",
        "url": "https://wedel.pl/nasze-produkty/ptasie-mleczko/ptasie-mleczko-waniliowe",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
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
    "checkedAt": "2026-10-13"
  },
  {
    "id": 11,
    "name": "李子巧克力",
    "localName": "Śliwka Nałęczowska",
    "packaging": "找 Śliwka Nałęczowska 品名；多種容量與禮盒外觀",
    "use": "伴手禮候選",
    "priority": true,
    "note": "果乾搭配巧克力，適合喜歡水果風味的人。品牌有不同容量，照片為包裝辨識參考。",
    "reason": "喜歡果乾搭配巧克力可先買小盒試吃，再決定伴手禮數量。",
    "sources": [
      {
        "title": "Colian｜Śliwka Nałęczowska 官方型錄",
        "url": "https://colian.com/nasze-marki/sliwka-naleczowska-2/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
      {
        "title": "Becca Daily｜波蘭伴手禮",
        "url": "https://beccadaily.com/poland-souvenirs/",
        "date": "2026-07-02",
        "kind": "2026 旅遊推薦"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 6,
    "name": "果凍巧克力餅乾",
    "localName": "Delicje",
    "packaging": "長方形餅乾包",
    "use": "伴手禮候選",
    "priority": true,
    "note": "Delicje Szampańskie 果凍巧克力餅乾；可先試橘子口味，袋面常見橘子圖案。",
    "reason": "果凍、餅乾與巧克力三種口感，先從柳橙口味小包試吃。",
    "sources": [
      {
        "title": "Biedronka｜Delicje 柳橙 147 g",
        "url": "https://zakupy.biedronka.pl/delicje-delicje-szampanskie-biszkopty-z-galaretka-pomaranczowa-oblewane-czekolada-147-g-0000005795.html",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
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
    "checkedAt": "2026-10-13"
  },
  {
    "id": 12,
    "name": "鹹餅乾棒",
    "localName": "Paluszki",
    "packaging": "細長餅乾棒袋裝；照片為 Lajkonik",
    "use": "伴手禮／旅途零食",
    "priority": true,
    "note": "想換鹹口味時可找鹽味或芝麻口味。Paluszki 是品類名稱，照片品牌只是辨識範例，並非來源指定品牌。",
    "reason": "甜食吃多時換鹹口味；袋裝細棒方便搭車時分食。",
    "sources": [
      {
        "title": "Lajkonik｜Paluszki 官方系列",
        "url": "https://lajkonik.pl/produkty-kategoria/paluszki/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
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
    "checkedAt": "2026-10-13"
  },
  {
    "id": 13,
    "name": "Princessa 威化餅",
    "localName": "Princessa",
    "packaging": "單支長條包裝；照片為椰子口味",
    "use": "伴手禮／旅途零食",
    "priority": false,
    "note": "想和 Prince Polo 比較口味時可各買一支。照片上的 kokosowa 是椰子口味；來源推薦品牌，沒有指定這個口味。",
    "reason": "想比較威化餅，可和 Prince Polo 各買一支；官方仍列椰子等多種口味。",
    "sources": [
      {
        "title": "Nestlé｜Princessa 官方系列",
        "url": "https://www.nestle.pl/brands/slodycze/princessa",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
      {
        "title": "Becca Daily｜波蘭伴手禮",
        "url": "https://beccadaily.com/poland-souvenirs/",
        "date": "2026-07-02",
        "kind": "2026 旅遊推薦"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 2,
    "name": "波蘭牛奶糖",
    "localName": "Krówki",
    "packaging": "牛圖案、獨立糖紙",
    "use": "伴手禮候選",
    "priority": false,
    "note": "Krówki 是牛奶糖品類，常見獨立糖紙與袋裝。官方來源以 Wawel 為品類範例，照片為 Krówki Milanowskie；不是同一品牌或規格。",
    "reason": "牛奶焦糖類經典甜食，獨立糖紙方便分送。",
    "sources": [
      {
        "title": "Wawel｜Krówka Mleczna 品類範例",
        "url": "https://www.wawel.com.pl/oferta/krowka-mleczna",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
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
    "checkedAt": "2026-10-13"
  },
  {
    "id": 5,
    "name": "巧克力威化",
    "localName": "Prince Polo",
    "packaging": "長條單支包裝",
    "use": "伴手禮候選",
    "priority": true,
    "note": "巧克力威化餅，長條單支包裝；找 Prince Polo 字樣，適合分送。",
    "reason": "單支威化方便旅途中試吃或分送；照片為 XXL Classic 代表規格，各店容量以貨架為準。",
    "sources": [
      {
        "title": "Mondelēz｜波蘭 Prince Polo 生產與品牌",
        "url": "https://www.mondelezinternational.com/poland-baltics/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
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
    "checkedAt": "2026-10-13"
  },
  {
    "id": 7,
    "name": "堅果巧克力糖",
    "localName": "Michałki",
    "packaging": "獨立糖果、大袋裝",
    "use": "伴手禮候選",
    "priority": false,
    "note": "Wawel 經典款是花生巧克力糖，官方有 245 g、1,000 g 與散裝；其他品牌、口味與過敏原請各自核對。",
    "reason": "喜歡花生巧克力可試；有過敏需求先核對標籤。",
    "sources": [
      {
        "title": "Wawel｜Michałki 經典花生巧克力糖",
        "url": "https://www.wawel.com.pl/oferta/michalki-z-wawelu-klasyczne",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 3,
    "name": "波蘭細香腸",
    "localName": "Kabanosy",
    "packaging": "透明長條香腸袋",
    "use": "當地食用",
    "priority": false,
    "note": "細長乾燥香腸，可找 Tarczyński。Wieprzowe 是豬肉，Drobiowe 是禽肉；寫 Drobiowe z Wieprzowiną 的款式含禽肉與豬肉，不能當成純禽肉。僅安排在波蘭當地吃。",
    "reason": "需要鹹口旅途點心時，可買小包細香腸；肉類與保存條件依包裝確認。",
    "sources": [
      {
        "title": "Tarczyński｜Kabanosy 官方型錄",
        "url": "https://tarczynski.pl/index.php/kategoria/kabanosy",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
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
    "checkedAt": "2026-10-13"
  },
  {
    "id": 8,
    "name": "果汁飲料",
    "localName": "Tymbark",
    "drink": true,
    "packaging": "玻璃瓶／PET／紙盒",
    "use": "當地食用",
    "priority": false,
    "note": "果汁／果汁飲料。Jabłko 蘋果、Wiśnia 酸櫻桃、Jabłko-Mięta 蘋果薄荷、Multiwitamina 綜合水果；不同系列果汁含量不同。",
    "reason": "想喝果味飲料可試蘋果薄荷或櫻桃蘋果；想要純果汁則找 Sok 100%，兩種系列不要混淆。",
    "sources": [
      {
        "title": "Tymbark｜官方飲料系列",
        "url": "https://tymbark.com/produkty/napoje/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      },
      {
        "title": "Reddit r/poland｜Quintessential Polish Snacks",
        "url": "https://www.reddit.com/r/poland/comments/1mbyjhu/quintessential_polish_snacks/",
        "date": "2025-07-29",
        "kind": "歷年網友推薦（補充）"
      }
    ],
    "checkedAt": "2026-10-13"
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
        "title": "E. Wedel｜官方巧克力系列",
        "url": "https://wedel.com/our-products/chocolates",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
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
        "title": "Wawel｜Mieszanka Krakowska",
        "url": "https://www.wawel.com.pl/oferta/mieszanka-krakowska",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 16,
    "name": "可可威化餅",
    "localName": "Grześki",
    "packaging": "認 Grześki 字樣；有未裹巧克力的可可威化及巧克力包覆版本。",
    "use": "常溫選品",
    "priority": false,
    "reason": "可與清單中的 Prince Polo 各買一條試吃，再選喜歡的帶回。",
    "note": "威化餅容易碎，放在硬盒內；照片是可可威化的代表版本。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Colian 自營商店｜Grześki 可可威化 34 g",
        "url": "https://islodycze.pl/goplana-wafelek-mega-grzesiek-kakaowy",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 17,
    "name": "托倫薑餅",
    "localName": "Kopernik Katarzynki",
    "packaging": "找 Kopernik、Katarzynki 或 Pierniki 字樣；照片為巧克力包覆薑餅。",
    "use": "常溫選品",
    "priority": false,
    "reason": "想找巧克力與威化以外的波蘭點心，可從托倫薑餅試起。",
    "note": "Katarzynki 有原味、黑巧克力與白巧克力等版本；照片為巧克力包覆款，餅乾需防壓。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Kopernik｜Katarzynki 現行官方目錄",
        "url": "https://kopernik.com.pl/pl_PL/category/katarzynki-r",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
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
        "title": "Dr. Oetker｜香草布丁粉與做法",
        "url": "https://www.oetker.pl/produkty/p/budyn-waniliowy",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 19,
    "name": "穀物棒",
    "localName": "Bakalland 5 Bakalii",
    "packaging": "Bakalland 與 5 Bakalii 字樣的獨立條裝；照片為五種果乾穀物棒。",
    "use": "常溫選品・旅途零食",
    "priority": false,
    "reason": "適合搭車時少量補給，也可選幾種口味分享。",
    "note": "40 g 款含蘋果、葡萄乾、蔓越莓、李子乾與杏桃乾。BA! 也有其他系列，請認品名；穀物與過敏原依實際包裝確認。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Foodwell／Bakalland｜5 Bakalii 40 g 與成分",
        "url": "https://b2b.foodwell.pl/baton-bakalland-5-bakalii-40g-p1045",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 20,
    "name": "巧克力榛果奶霜甜點",
    "localName": "Zott Monte",
    "packaging": "冷藏杯裝，Monte 字樣與奶白、巧克力色甜點圖。",
    "use": "當地吃・冷藏",
    "priority": false,
    "reason": "喜歡奶香與榛果巧克力口味，可買小杯當飯後甜點。",
    "note": "找冷藏櫃的 Monte 甜點，別與 Monte Drink 混淆。照片為海外代表包裝，波蘭販售規格以貨架為準；購後依包裝冷藏。",
    "supplement": true,
    "localOnly": true,
    "sources": [
      {
        "title": "Zott｜Monte Original 波蘭官方系列",
        "url": "https://www.zott-dairy.com/pl/marki-produkty/monte/monte-original/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
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
        "title": "Zott｜Belriso 官方系列",
        "url": "https://www.zott-dairy.com/pl/marki-produkty/belriso/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
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
        "title": "Danio｜香草白起司 130 g",
        "url": "https://danio.com.pl/produkty/klasyczne/danio-o-smaku-klasycznej-wanilii/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
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
        "title": "Müller｜Riso 櫻桃米布丁 200 g",
        "url": "https://www.mullerpolska.pl/produkty/riso/riso-original/riso-wisnia",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 24,
    "name": "焦糖榛果巧克力餅乾",
    "localName": "Jeżyki Classic",
    "packaging": "找 Jeżyki Classic 字樣與長條餅乾袋；照片為 140 g 代表包裝。",
    "use": "常溫零食",
    "priority": false,
    "reason": "喜歡焦糖、榛果與巧克力餅乾，可先買 140 g 小包試吃；怕熱且易碎，帶回時放硬盒。",
    "note": "有奶、榛果等過敏原，依實際包裝成分確認；易碎且怕熱，回程注意防壓。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Colian 自營商店｜Jeżyki Classic 140 g",
        "url": "https://islodycze.pl/goplana-jezyki-classic",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
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
    "sources": [
      {
        "title": "Frugo｜Czarne 官方商品",
        "url": "https://frugo.pl/frugo-czarne",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 26,
    "name": "蘋果、胡蘿蔔、香蕉蔬果汁",
    "localName": "Kubuś 100% Jabłko Marchew Banan",
    "drink": true,
    "packaging": "Kubuś 小熊與 K 100% 標誌；照片為 300 ml 代表包裝。",
    "use": "當地試喝",
    "priority": false,
    "reason": "Kubuś 有果汁、果泥等不同系列，選 100% 系列小瓶先試。",
    "note": "官方 300 ml 款含濃縮還原蘋果汁、胡蘿蔔泥與香蕉泥，口感帶果泥；其他 Kubuś 系列不一定是 100% 蔬果汁。",
    "supplement": true,
    "localOnly": true,
    "sources": [
      {
        "title": "Kubuś｜100% 蘋果胡蘿蔔香蕉 300 ml",
        "url": "https://kubus.pl/produkt/kubus-banan-marchew-jablko/",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    "id": 27,
    "name": "波蘭百花蜂蜜",
    "localName": "Miód wielokwiatowy",
    "packaging": "蜂蜜罐看 Miód wielokwiatowy、產地國與生產商；照片為 Sądecki Bartnik 代表包裝。",
    "use": "伴手禮候選",
    "priority": false,
    "reason": "喜歡蜂蜜可挑小罐百花蜜，少占行李空間；依瓶上產地選購，不將這個品牌歸因於未找到原文的推薦者。",
    "note": "照片是 Sądecki Bartnik 代表瓶，官方所引商品為波蘭產 50 g 百花蜜，不能推定照片容量或整個品牌產地。選購時逐瓶看產地國；玻璃瓶需防撞。",
    "supplement": true,
    "localOnly": false,
    "sources": [
      {
        "title": "Sądecki Bartnik｜波蘭百花蜜 50 g",
        "url": "https://sklep.bartnik.pl/pl/produkt/1587-miod-wielokwiatowy-50-g-z-polskich-pasiek.html",
        "date": "未標示發布日期；2026-10-13 查核",
        "kind": "官方／零售商商品資料"
      }
    ],
    "checkedAt": "2026-10-13"
  },
  {
    id: 28,
    name: '鹹味椒鹽脆餅',
    localName: 'Lajkonik Precelki Chrupkie',
    packaging: '找 Lajkonik 與 Precelki 字樣的袋裝結形脆餅；本次核對 130 g。',
    use: '常溫零食・旅途鹹口',
    priority: false,
    reason: '想在巧克力與威化餅之外換個鹹口，可買一包在搭車時分著吃。',
    note: '是小顆結形脆餅，不是麵包店的大顆椒鹽捲餅。依包裝保存，開封後封好防潮；放行李時注意防壓。',
    supplement: true,
    localOnly: false,
    sources: [
      { title: 'Lajkonik｜Precelki 官方商品', url: 'https://lajkonik.pl/produkty/precelki/', date: '未標示發布日期；2026-10-13 查核', kind: '品牌商品資料' },
      { title: 'E.Leclerc｜Precelki 130 g 與保存標示', url: 'https://leclerc.com.pl/lajkonik-precelki-chrupkie', date: '未標示發布日期；2026-10-13 查核', kind: '零售商商品資料' },
    ],
    checkedAt: '2026-10-13',
  },
  {
    id: 29,
    name: '原味冰島式優格',
    localName: 'Piątnica Skyr naturalny',
    packaging: '冷藏櫃找 Piątnica、Skyr 與 naturalny 字樣；本次核對 150 g 杯裝。',
    use: '當地吃・冷藏早餐',
    priority: false,
    reason: '喜歡濃稠原味優格，可買小杯搭配水果或麵包，作為住宿早餐的一部分。',
    note: '依杯身標示冷藏；住宿沒有冰箱時買了就吃，避免囤貨。naturalny 是原味，不等於無糖；別與飲用型或水果口味混淆。',
    supplement: true,
    localOnly: true,
    sources: [
      { title: 'Piątnica｜Skyr naturalny 150 g 官方商品', url: 'https://piatnica.com.pl/produkt/skyr-naturalny-150g/', date: '未標示發布日期；2026-10-13 查核', kind: '品牌商品資料' },
      { title: 'Auchan｜150 g 杯裝與保存方式', url: 'https://zakupy.auchan.pl/products/skyr-jogurt-typu-islandzkiego-naturalny-pi%C4%85tnica-150-g/00871064', date: '未標示發布日期；2026-10-13 查核', kind: '零售商商品資料' },
    ],
    checkedAt: '2026-10-13',
  }
// id 同時是錨點（#product-<id>）與照片鍵：groceryPhotos 與 assets/photos/grocery-NN.webp
// 都以同一個編號對應。這個欄位原本叫 rank，但商品早就不按它排序
// （目前順序是 1、11、6、12、13…），頁面本身也寫明「不代表銷售或人氣排名」；
// 叫 rank 會讓人以為重排或重編號是安全的，實際上會靜默換掉商品照片。
].map(product => ({ ...product, photo: groceryPhotos[product.id] }));

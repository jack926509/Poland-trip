// 門市事實在 dining-places.js；本檔僅維護推薦分類與訂位管道。
import { resolveDining } from './dining-places.js';
import { dayDining } from './day-dining.js';
import { plannedVerifiedPlaces } from '../lib/dining.mjs';
export { fastFoodChains, fastFoodBranches, fastFoodHubs } from './fast-food.js';
export const michelinSummary = [
  {
    "city": "克拉科夫",
    "stars": "★★",
    "star2List": [
      "Bottiglieria 1881"
    ],
    "star1List": [],
    "bibList": [
      "Folga",
      "MOLÁM",
      "NOAH",
      "Bufet KRK",
      "Nat Bistro"
    ]
  },
  {
    "city": "華沙",
    "stars": "★",
    "star2List": [],
    "star1List": [
      "Alon Omakase",
      "hub.praga",
      "NUTA",
      "Rozbrat 20"
    ],
    "bibList": [
      "Ceviche Bar",
      "Kieliszki na Próżnej",
      "Koneser Grill",
      "kontakt",
      "Le Braci",
      "Wyraj",
      "AHAAN",
      "Blisko Bar",
      "WANDAL",
      "WIN"
    ]
  },
  {
    "city": "樂斯拉夫",
    "stars": "★",
    "star2List": [],
    "star1List": [
      "BABA",
      "Most"
    ],
    "bibList": [
      "IDA kuchnia i wino",
      "Tarasowa",
      "Pijalni"
    ]
  },
  {
    "city": "波茲南",
    "stars": "★",
    "star2List": [],
    "star1List": [
      "Muga"
    ],
    "bibList": [
      "Fromażeria",
      "Posto",
      "SPOT.",
      "TU.REStAURANT"
    ]
  }
];
export const michelinReservations = [
  {
    "restaurant": "⭐⭐ Bottiglieria 1881（克拉科夫）",
    "mapUrl": "https://maps.google.com/?cid=8570908113421134699",
    "perPerson": "940 / 990",
    "channel": "自家電話 +48 660 661 756 · ul. Bocheńska 5 · 平日另有單點，週末僅套餐"
  },
  {
    "restaurant": "⭐ Alon Omakase（華沙）",
    "mapUrl": "https://maps.google.com/?cid=8029724309073713102",
    "perPerson": "1,250",
    "channel": "omakase.eu 線上 · 取消/減人照收全額 · Edomae 壽司"
  },
  {
    "restaurant": "⭐ Most（樂斯拉夫）",
    "mapUrl": "https://maps.google.com/?cid=9490447263206449328",
    "perPerson": "價格待店家最新菜單確認",
    "channel": "Michelin 現列一–四 17:00–22:00、五 17:00–23:00、六 14:00–23:00、日 14:00–21:00 · Księcia Witolda 1"
  },
  {
    "restaurant": "⭐ Muga（波茲南）",
    "mapUrl": "https://maps.google.com/?cid=2998937238608160974",
    "perPerson": "560 / 685",
    "channel": "官網／電話 · 法系套餐；高階版本含魚子醬"
  },
  {
    "restaurant": "⭐ NUTA（華沙）",
    "mapUrl": "https://maps.google.com/?cid=4624148008162643045",
    "perPerson": "價格依訂位頁",
    "channel": "官網 · Plac Trzech Krzyży 10/14 · 二–六 18:00–21:15 接受最後訂位 · 主廚 Andrea Camastra"
  },
  {
    "restaurant": "⭐ Rozbrat 20（華沙）",
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Rozbrat%2020%20Warszawa",
    "perPerson": "590 / 690",
    "channel": "rozbrat20.com.pl · 需信用卡 · +12.5% 服務費 · smart casual、12 歲以上"
  },
  {
    "restaurant": "⭐ BABA（樂斯拉夫）",
    "mapUrl": "https://maps.google.com/?cid=9335659011047272773",
    "perPerson": "主菜約 69–159（2026-02 官網菜單）",
    "channel": "Michelin 免費線上 · Nożownicza 1D · 主廚 Beata Śniechowska"
  },
  {
    "restaurant": "Bib · Bufet KRK（克拉科夫）",
    "mapUrl": "https://maps.google.com/?cid=861978380086701482",
    "perPerson": "€€",
    "channel": "二星副牌 · 較好訂 · 訂不到二星的替代"
  },
  {
    "restaurant": "Bib · IDA kuchnia i wino（樂斯拉夫）",
    "mapUrl": "https://maps.google.com/?cid=10589009865057440004",
    "perPerson": "價格待店家最新菜單確認",
    "channel": "官網未列站內原有套餐價；訂位前查看最新菜單"
  }
];
export const foods = [
  {
    "n": "01",
    "cn": "波蘭餃子",
    "pl": "Pierogi",
    "desc": "國民料理，半月形餃子有鹹甜兩款。最經典 Pierogi Ruskie（馬鈴薯加 twaróg 起司）。"
  },
  {
    "n": "02",
    "cn": "獵人燉菜",
    "pl": "Bigos",
    "desc": "波蘭國菜。酸菜 + 新鮮高麗菜 + 多種肉長時間慢燉，每位媽媽都有自家配方。"
  },
  {
    "n": "03",
    "cn": "酸黑麥湯",
    "pl": "Żurek",
    "desc": "發酵黑麥麵粉熬製，配香腸水煮蛋盛在挖空麵包碗，湯喝完碗也吃掉。"
  },
  {
    "n": "04",
    "cn": "炸豬排",
    "pl": "Kotlet Schabowy",
    "desc": "波蘭家庭週日必備。豬里肌錘薄裹麵包粉炸金黃，配馬鈴薯泥酸菜。"
  },
  {
    "n": "05",
    "cn": "包心菜捲",
    "pl": "Gołąbki",
    "desc": "意為「小鴿子」。高麗菜葉包米飯絞肉，淋番茄醬汁烘烤。"
  },
  {
    "n": "06",
    "cn": "波蘭披薩",
    "pl": "Zapiekanka",
    "desc": "長棍麵包剖半鋪蘑菇起司火腿烤製。1970 年代誕生，Plac Nowy 圓亭最有名。"
  },
  {
    "n": "07",
    "cn": "波蘭甜甜圈",
    "pl": "Pączki",
    "desc": "油炸酵母麵團，玫瑰果醬內餡。Blikle / Stara Pączkarnia 公認最佳。"
  },
  {
    "n": "08",
    "cn": "起司蛋糕 / 蘋果派",
    "pl": "Sernik / Szarlotka",
    "desc": "Sernik twaróg 起司蛋糕比紐約款輕盈濕潤；Szarlotka 蘋果派配香草冰淇淋。"
  },
  {
    "n": "09",
    "cn": "圓圈麵包 PGI",
    "pl": "Obwarzanek",
    "desc": "克拉科夫街頭環形麵包，類似貝果但更輕。歐盟地理標誌保護，PLN 3–5。"
  },
  {
    "n": "10",
    "cn": "煙燻羊乳酪",
    "pl": "Oscypek",
    "desc": "塔特拉山牧羊人手工製作，鹽水浸泡後針葉樹煙燻。可炙烤淋蔓越莓醬。"
  },
  {
    "n": "11",
    "cn": "馬鈴薯餅",
    "pl": "Placki Ziemniaczane",
    "desc": "馬鈴薯刨絲混蛋液煎成酥脆，配酸奶油或匈牙利風味牛肉燉醬。"
  },
  {
    "n": "12",
    "cn": "野牛草伏特加",
    "pl": "Żubrówka",
    "desc": "比亞沃韋札森林野牛草浸泡，每瓶都有真草。經典喝法 Tatanka：配蘋果汁。"
  }
];
export const cityFood = [
  {
    "city": "華沙",
    "en": "Warszawa",
    "items": [
      {
        "placeId": "warsaw-hala-koszyki",
        "tag": "美食市集",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "warsaw-zapiecek",
        "tag": "Pierogi",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "warsaw-wedel-szpitalna-8",
        "tag": "熱巧克力",
        "book": "queue",
        "role": "primary"
      },
      {
        "placeId": "warsaw-u-fukiera",
        "tag": "老城經典",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "warsaw-polka",
        "tag": "老城經典",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "warsaw-wandal",
        "tag": "年度開幕獎 2026",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "warsaw-kieliszki-na-proznej",
        "tag": "必比登備案",
        "book": "must",
        "role": "backup"
      },
      {
        "placeId": "warsaw-stary-dom",
        "tag": "傳統備案",
        "book": "must",
        "role": "backup"
      }
    ]
  },
  {
    "city": "克拉科夫",
    "en": "Kraków",
    "items": [
      {
        "placeId": "krakow-starka",
        "tag": "傳統餐廳",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "krakow-szara-ges",
        "tag": "傳統餐廳",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "krakow-pod-aniolami",
        "tag": "地窖晚餐",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "krakow-hamsa",
        "tag": "猶太料理",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "krakow-klezmer-hois",
        "tag": "猶太料理",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "krakow-pierogarnia-krakowiacy",
        "tag": "Pierogi",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "krakow-pierozki-u-vincenta",
        "tag": "Pierogi",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "krakow-okraglak-plac-nowy-圓亭",
        "tag": "Zapiekanka",
        "book": "queue",
        "role": "primary"
      },
      {
        "placeId": "krakow-szalone-widelce",
        "tag": "波蘭料理",
        "book": "queue",
        "role": "primary"
      },
      {
        "placeId": "krakow-bar-mleczny-pod-temida",
        "tag": "牛奶吧",
        "book": "queue",
        "role": "primary"
      },
      {
        "placeId": "krakow-bottiglieria-1881",
        "tag": "米其林二星",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "krakow-miod-malina",
        "tag": "傳統備案",
        "book": "must",
        "role": "backup"
      }
    ]
  },
  {
    "city": "樂斯拉夫",
    "en": "Wrocław",
    "items": [
      {
        "placeId": "wroclaw-konspira",
        "tag": "西里西亞",
        "book": "walk",
        "role": "backup"
      },
      {
        "placeId": "wroclaw-pierogarnia-stary-mlyn",
        "tag": "Pierogi",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "wroclaw-hala-targowa",
        "tag": "市場午餐",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "wroclaw-pod-fredra",
        "tag": "傳統餐廳",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "wroclaw-jadka",
        "tag": "傳統餐廳",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "wroclaw-baba",
        "tag": "米其林一星 2026",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "wroclaw-kurna-chata",
        "tag": "傳統備案",
        "book": "queue",
        "role": "backup"
      }
    ]
  },
  {
    "city": "波茲南",
    "en": "Poznań",
    "items": [
      {
        "placeId": "poznan-stary-browar",
        "tag": "Lech 啤酒",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "poznan-whiskey-in-the-jar",
        "tag": "燒烤",
        "book": "must",
        "role": "primary"
      },
      {
        "placeId": "poznan-hotel-bazar",
        "tag": "歷史名宅",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "poznan-pyra-bar",
        "tag": "家常",
        "book": "walk",
        "role": "primary"
      },
      {
        "placeId": "poznan-brovaria",
        "tag": "傳統備案",
        "book": "walk",
        "role": "backup"
      }
    ]
  }
].map(group => ({...group,items:group.items.map(resolveDining)}));
export const cityDining = Object.fromEntries(Object.entries({
  "warsaw": [
    {
      "placeId": "warsaw-nuta",
      "tier": "★"
    },
    {
      "placeId": "warsaw-wyraj",
      "tier": "Bib"
    },
    {
      "placeId": "warsaw-wandal",
      "tier": "Bib · 2026 新"
    },
    {
      "placeId": "warsaw-kieliszki-na-proznej",
      "tier": "Bib"
    },
    {
      "placeId": "warsaw-hala-koszyki",
      "tier": "美食廣場"
    }
  ],
  "krakow": [
    {
      "placeId": "krakow-bottiglieria-1881",
      "tier": "★★"
    },
    {
      "placeId": "krakow-folga",
      "tier": "Bib"
    },
    {
      "placeId": "krakow-noah",
      "tier": "Bib"
    },
    {
      "placeId": "krakow-hamsa",
      "tier": "在地候選"
    },
    {
      "placeId": "krakow-okraglak-plac-nowy-圓亭",
      "tier": "使用者指定 · 街食"
    },
    {
      "placeId": "krakow-szalone-widelce",
      "tier": "使用者指定 · 波蘭料理"
    },
    {
      "placeId": "krakow-bar-mleczny-pod-temida",
      "tier": "使用者指定 · 牛奶吧"
    }
  ],
  "wroclaw": [
    {
      "placeId": "wroclaw-baba",
      "tier": "★ · 2026 新"
    },
    {
      "placeId": "wroclaw-ida-kuchnia-i-wino",
      "tier": "Bib"
    },
    {
      "placeId": "wroclaw-restauracja-wroclawska",
      "tier": "在地"
    },
    {
      "placeId": "wroclaw-piwnica-swidnicka",
      "tier": "歷史"
    }
  ],
  "poznan": [
    {
      "placeId": "poznan-muga",
      "tier": "★"
    },
    {
      "placeId": "poznan-fromazeria",
      "tier": "Bib"
    },
    {
      "placeId": "poznan-spot",
      "tier": "Bib"
    },
    {
      "placeId": "poznan-rogal",
      "tier": "名物"
    },
    {
      "placeId": "poznan-na-winklu",
      "tier": "餃子"
    },
    {
      "placeId": "poznan-hycka",
      "tier": "傳統"
    },
    {
      "placeId": "poznan-pyra-bar",
      "tier": "在地"
    }
  ]
}).map(([city,items]) => [city,items.map(resolveDining)]));
export const snacksAndCafes = Object.fromEntries(Object.entries({
  "warsaw": [
    {
      "placeId": "warsaw-bar-mleczny-prasowy-marszalkowska",
      "type": "牛奶吧"
    },
    {
      "placeId": "warsaw-bar-mleczny-bambino",
      "type": "牛奶吧"
    },
    {
      "placeId": "warsaw-a-blikle-1869",
      "type": "甜點 · 咖啡"
    },
    {
      "placeId": "warsaw-cukiernia-zagozdzinski",
      "type": "甜點"
    },
    {
      "placeId": "warsaw-cafe-bristol",
      "type": "咖啡 · 輕食"
    },
    {
      "placeId": "warsaw-hala-koszyki",
      "type": "美食大廳 · 宵夜"
    }
  ],
  "krakow": [
    {
      "placeId": "krakow-bar-mleczny-pod-temida",
      "type": "牛奶吧"
    },
    {
      "placeId": "krakow-endzior",
      "type": "小吃 · zapiekanka"
    },
    {
      "placeId": "krakow-karma-coffee-roasters",
      "type": "精品咖啡"
    },
    {
      "placeId": "krakow-cafe-camelot",
      "type": "咖啡廳"
    },
    {
      "placeId": "krakow-cukiernia-michalek",
      "type": "甜點"
    }
  ],
  "wroclaw": [
    {
      "placeId": "wroclaw-bar-mleczny-mis",
      "type": "牛奶吧"
    },
    {
      "placeId": "wroclaw-vincent-kazimierza-wielkiego-甜點",
      "type": "甜點 · 咖啡"
    },
    {
      "placeId": "wroclaw-konspira",
      "type": "傳統小館"
    },
    {
      "placeId": "wroclaw-browar-stu-mostow",
      "type": "精釀啤酒"
    },
    {
      "placeId": "wroclaw-el-gato-specialty-coffee",
      "type": "咖啡 · 精品咖啡"
    },
    {
      "placeId": "wroclaw-dessert-boutique",
      "type": "甜點"
    }
  ],
  "poznan": [
    {
      "placeId": "poznan-cukiernia-kandulski",
      "type": "甜點 · rogal"
    },
    {
      "placeId": "poznan-pyra-bar",
      "type": "小吃 · 在地菜"
    },
    {
      "placeId": "poznan-weranda-caffe",
      "type": "咖啡廳 · 早午餐"
    },
    {
      "placeId": "poznan-pijalnia-czekolady-e-wedel-stary-rynek",
      "type": "熱巧克力"
    }
  ]
}).map(([city,items]) => [city,items.map(resolveDining)]));
// 舊版是一份手寫子集，容易漏掉新排進行程的已核實門市（也漏掉真正 pending 的店卻被列進來）。
// 現在改由「當天餐位是否已核實／部分核實」直接推導，見 src/lib/dining.mjs 的 plannedVerifiedPlaces。
export const verifiedRestaurantHours = plannedVerifiedPlaces(dayDining);

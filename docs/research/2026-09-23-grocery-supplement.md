# 採買清單補充（2026-09-23）

依使用者提供的 poland-supermarket-shopping.md 補充目前 main，保留既有 10 項商品、12 家門市與商品卡片。

## 收錄方式

新增 6 項常溫選品、4 項冷藏甜點。推薦起點為使用者清單，品牌／零售商頁只用來確認商品種類，不當作獨立推薦排行，也不宣稱是 2026 發表的新文。來源日期未明者明列未標示，另記查閱日。

| 商品 | 核對來源 |
|---|---|
| E. Wedel Czekolada | https://wedel.com/our-products |
| Wawel Mieszanka Krakowska | https://www.wawel.com.pl/oferta/mieszanka-krakowska |
| Grześki | https://colian.com/nasze-marki/grzeski/ |
| Kopernik Katarzynki | https://konkurs.kopernik.com.pl/en/24%2C26/dzial_katarzynki__.html |
| Dr. Oetker Budyń waniliowy | https://www.oetker.pl/produkty/p/budyn-waniliowy |
| Bakalland BA! | https://jeszcodobre.bakalland.pl/ |
| Zott Monte | https://www.zott-dairy.com/pl/marki-produkty/monte/monte-original/ |
| Zott Belriso | https://www.zott-dairy.com/pl/marki-produkty/belriso/ |
| Danio | https://danio.com.pl/produkty/klasyczne/danio-o-smaku-klasycznej-wanilii/ |
| Müller Riso | https://zakupy.auchan.pl/products/riso-deser-mleczno-ry%C5%BCowy-naturalny-m%C3%BCller-200-g/00902378 |

## 對參考清單的修正

- 既有 Ptasie Mleczko、Krówki、Prince Polo、Delicje 不重複新增。
- 不沿用「全國品項通用」「Biedronka／Lidl 一定最便宜」或保證指定門市有貨的說法。
- 不沿用「星期日只有 Żabka 開」：保留既有車站型 Biedronka 例外與逐店核對結果；Żabka 時間仍待確認。
- 冷藏甜點歸入當地食用；常溫選品不等於台灣入境許可，沿用官方入境資訊入口。
- Budyń 明確標出需要加牛奶煮，與冷藏即食甜點分開。
- 不引用未核實的兩人各 25kg 行李額度；10/30–31 華沙集中採買為行程建議。
- 麵包與 Żabka 餐飲以補給方式說明，沒有新增未核實的價格、庫存或門市。
- Carrefour 店型與 Rossmann 甜食依官方頁補充。Kaufland／Auchan／Netto 僅列備選，不新增未查核門市地址。

## 照片

新增 grocery-14.webp 至 grocery-23.webp，均來自 Open Food Facts，CC BY-SA 3.0。已目視確認品牌與代表口味；縮放與 WebP 轉檔，來源、原圖和授权見 assets/photos/GROCERY-CREDITS.md。照片是代表包裝，不保證現場版本；Riso 來源頁是原味，照片明列櫻桃款。Belriso 照片為巧克力款。

## 驗證

verify.sh 通過（282 tests），涵蓋商品卡唯一性、搜尋索引、離線單檔、照片放大互動與門市星期日三態。新增照片已加入 service worker 預快取。

## 追加查詢：Jeżyki、Michałki、Frugo、Kubuś、Żabka、蜂蜜

2026-09-23 依使用者提名補入四款代表商品及 Żabka 早餐／熱食資訊；Michałki 原已收錄，僅補 Wawel 原廠來源。不宣稱 Jeżyki 的「最好吃之一」評語有可查的原試吃貼文，也未查到「波蘭 Anna」蜂蜜推薦原始內容；Sądecki Bartnik 是示例品牌，並非代言或 Anna 指定。

| 品項 | 資料來源 | 照片來源 |
|---|---|---|
| Jeżyki Classic | https://jezykiciastka.pl/ | Open Food Facts 5900352002361 |
| Michałki 經典款 | https://www.wawel.com.pl/oferta/michalki-z-wawelu-klasyczne | 沿用 grocery-07.webp |
| Frugo Czarne | https://frugo.pl/frugo-czarne | Open Food Facts 5901861003504 |
| Kubuś 100% 蘋果胡蘿蔔香蕉 | https://kubus.pl/produkt/kubus-banan-marchew-jablko/ | Open Food Facts 5901067451024 |
| 百花蜂蜜／Sądecki Bartnik 代表包裝 | https://sklep.bartnik.pl/pl/produkt/1587-miod-wielokwiatowy-50-g-z-polskich-pasiek.html ; https://culture.pl/zht/article/50023 | Open Food Facts 5900597000016 |
| 蜂蜜產地標示 | https://www.gov.pl/web/ijhars/nowe-zasady-znakowania-zywnosci-flaga-kraju-pochodzenia-na-owocach-i-warzywach-oraz-zmiany-w-oznakowaniu-przetworow-owocowych-i-miodu | 無 |
| Żabka Tosty、Panini、Zapiekanki、咖啡 | https://www.zabka.pl/sniadania-w-zabce-staly-sie-hitem/ ; https://www.zabka.pl/zabka-menu/ | 無 |

各分店即食餐飲與飲料庫存以現場為準；官方菜單沒有足夠資訊可宣稱每家咖啡都為自助。新四張照片使用 Open Food Facts 原尺寸 JPG，來源／授權逐張列在 GROCERY-CREDITS.md，離線單檔及 PWA 預快取一併納入。

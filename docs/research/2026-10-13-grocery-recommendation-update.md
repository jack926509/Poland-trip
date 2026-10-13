# 推薦資料更新計畫與驗收

使用者已授權更新最新推薦並可新增品項。本次僅在本機功能分支實作，未另獲發布正式站的授權。

1. 更新既有 32 張卡片的商品來源、實際查核日期與購物用途，保留穩定錨點及照片授權。
2. 移除未核實促銷及動態排行推論，修正 Tymbark、BA! 成分、NFC 翻譯及 PET 押金條件；供應未確認者明示。
3. 新增 Lajkonik Precelki 130 g 與 Piątnica Skyr naturalny 150 g 共 2 張卡片，理由限定旅行補給用途；照片採 OFF 實物圖。
4. 沿用五節與收合分組；「先買小份試吃」取代以文章年份命名的推薦區，歷史文章僅留來源參考。

驗收條件：所有 34 張商品卡有正確唯一錨點、照片、來源；新增項目可搜尋；單檔版與 PWA 照片快取同步；不存在未來查核日期或過期促銷的推薦口吻；完整 verify.sh 通過，瀏覽器實際展開商品與放大圖片，手機無橫向溢出。分店營業時間沒有在此次重查，不更新其日期。

## 實作與驗收結果（2026-10-13）

- 保留原有 32 張卡片及其 ID，新增 28／29 共 2 張，總數 34；12 筆分店資料未改。
- 修正商品來源錯配、成分與標籤翻譯，移除過期促銷及排行推論；Solevita 與特定即食品項供應未確認處明示。
- 新增兩款 OFF 波蘭文正面照片：Precelki `front_pl.17.400.jpg`（pyrka）、Skyr `front_pl.59.400.jpg`（summerseal），皆 CC BY-SA 3.0；已目視核對並保存署名。
- 完整 `env -u NODE_OPTIONS ./verify.sh` 通過：369 項測試、0 失敗；建置、地圖資料結構與差異空白檢查通過。初次沙盒執行因測試需監聽本機連接埠受限，授權重跑後通過。
- 獨立審查未發現 P1／P2；另跑 28 項相關測試通過，確認新增照片的多頁、單檔內嵌與 PWA 快取一致，搜尋索引及唯一錨點正確。
- 瀏覽器實測 390 × 844 手機寬度：頁寬與內容寬皆 390 px；兩款新照片可放大。桌面搜尋 `Skyr` 可找到商品並跳至 `#product-29`，卡片正常渲染；完成後重設暫用視窗尺寸。
- 本輪僅本地功能分支更新，尚未推送或發布。

# 波蘭超市與便利商店商品查核總表

查核日期：2026-10-13（台北時間）。涵蓋 24 張零食／甜點／飲料卡、6 張牛奶果汁卡、2 張即食卡，共 32 張商品卡，以及 Żabka 熱食說明。

結論：多數商品仍有品牌或零售商第一方資料，但整份清單不能宣稱已全部更新為最新；有未來日期、動態排行日期、未確認歷史促銷、商品來源錯配、成分與翻譯問題。沒有確認個別分店現貨及 10/24–31 售價。Solevita 及部分具體湯品／替代品證據仍不足。

前一輪已實際開啟 GitHub Pages 超市頁並展開牛奶果汁區，確認問題確實呈現在網站；以下各分項是修改前的查核快照。後續依使用者授權更新，實作及驗收紀錄見本文件最前方。

# 波蘭超市商品查核：經典商品

查核日：2026-10-13（Asia/Taipei）。只讀查核，未修改網站。

商品官方型錄存在僅能證明品牌或品項，不能保證特定門市庫存、出遊日售價，亦不能確認 Open Food Facts 舊照片即為最新包裝。

| 網站品項 | 本次結論 | 第一方來源 |
|---|---|---|
| Ptasie Mleczko | 香草、巧克力與奶油口味仍有官方資料；中文宜稱輕盈泡沫糖／奶泡糖內餡，避免誤認鮮奶油甜點。 | https://wedel.pl/nasze-produkty/ptasie-mleczko/ptasie-mleczko-waniliowe ; https://wedel.prowly.com/presskits/produkty-e-wedel-ptasie-mleczko |
| Śliwka Nałęczowska | 官方型錄仍列巧克力李子、多種容量；包裝不宜限定只有藍底綠點。官方存在不同禮盒、限定款。 | https://colian.com/nasze-marki/sliwka-naleczowska-2/ |
| Delicje | Biedronka 第一方商品頁仍列柳橙果凍巧克力餅乾 147 g，基本描述可保留。 | https://zakupy.biedronka.pl/delicje-delicje-szampanskie-biszkopty-z-galaretka-pomaranczowa-oblewane-czekolada-147-g-0000005795.html |
| Paluszki（Lajkonik） | 官方仍列經典鹽味與芝麻版本。品類與示範品牌分開的寫法可保留。 | https://lajkonik.pl/produkty-kategoria/paluszki/ |
| Princessa | Nestlé 官方仍列 Longa 椰子口味與其他系列。 | https://www.nestle.pl/brands/slodycze/princessa |
| Krówki | Wawel 官方仍有牛奶糖（180／250／900／1000 g 與散裝）。這只能佐證品類；網站 Krówki Milanowskie 代表照片未取得同條碼最新包裝證據。 | https://www.wawel.com.pl/oferta/krowka-mleczna |
| Prince Polo | Mondelēz 官方仍列在波蘭製造；Carrefour 有 Classic 35 g 商品頁。XXL 代表照片不代表各店唯一規格。 | https://www.mondelezinternational.com/poland-baltics/ ; https://www.carrefour.pl/artykuly-spozywcze/slodycze/batony-wafle/prince-polo-classic-wafelek-classic-35g-32x8x-1-22-kg |
| Michałki | Wawel 官方經典款為花生巧克力糖，245 g／1000 g／散裝。網站基本描述可保留，宜精確寫花生。 | https://www.wawel.com.pl/oferta/michalki-z-wawelu-klasyczne |
| Kabanosy | Tarczyński 官方仍列多款細香腸；部分 Drobiowe z Wieprzowiną 是禽肉混豬肉，不能僅看 Drobiowe 當成純禽肉。Lidl Pikok 本次沒有取得可確證今日門市庫存的一手資料。 | https://tarczynski.pl/index.php/kategoria/kabanosy |
| Tymbark 品牌飲料 | 官方仍區分 Napoje 與 Sok 100%；蘋果薄荷、櫻桃蘋果等口味存在。一般品牌卡照片為 100% 蘋果汁，應保留系列差異提醒。 | https://tymbark.com/produkty/ ; https://tymbark.com/produkty/napoje/ |

網站引用的 Becca Daily 原文仍標示 2026-07-02，確實有五款相關推薦；這是旅遊作者偏好，不能等同最新銷售排行或店內現貨：https://beccadaily.com/poland-souvenirs/ 。


---

# groceryProducts 14–27 官方商品查核

查核日：2026-10-13（Asia/Taipei）。範圍：`src/data/groceries.js` ID 14–27，以及 `grocery-photos.js` 與 14 張實際商品照片。專案只讀，沒有修改程式或圖片。

結論：14 款均找到品牌或製造商官方商品證據，未發現需直接刪除的商品。ID 19 的「果乾堅果版本」及「BA! 大字樣」應修正；ID 17 舊來源應換現行官方頁；ID 23 可換成與櫻桃照片一致的官方商品頁。商品頁存在只證明官方仍有產品資料，不證明目前各分店庫存、照片為最新包裝或旅遊當日一定買得到。

## 逐款結果

| ID | 商品 | 查核結果與規格／照片核對 | 官方證據 |
|---|---|---|---|
| 14 | E. Wedel 磚型巧克力 | 通過。官方巧克力分類仍有牛奶、黑巧克力等；普通牛奶 90 g，其他種類另有 80 g、90 g、100 g。現有文字沒有把重量固定化，照片牛奶巧克力身分正確。 | [E. Wedel 巧克力分類](https://wedel.com/our-products/chocolates) |
| 15 | Wawel Mieszanka Krakowska | 通過。官方說明為水果軟糖裹巧克力，含檸檬、柳橙、覆盆子、鳳梨口味；列 245 g、1,000 g、2.8 kg 及秤重形式。現有文字與照片一致，沒有把水果軟糖誤當實心巧克力。 | [Wawel 官方商品](https://www.wawel.com.pl/oferta/mieszanka-krakowska) |
| 16 | Grześki 可可威化 | 通過，文字可更準確。品牌及製造商自營商店都有產品；Mega 可可未裹巧克力版 34 g，另有裹巧克力版。現有「原味威化」建議改「未裹巧克力的威化」，避免把可可夾餡寫成原味。既有 Colian 介紹頁讀取遇 429，不據此判定失效。 | [Grześki 品牌](https://grzeski.pl/)、[Colian 自營商店：34 g 可可威化](https://islodycze.pl/goplana-wafelek-mega-grzesiek-kakaowy)、[商品分類](https://islodycze.pl/polskie-slodycze/wafelki-grzeski) |
| 17 | Kopernik Katarzynki | 商品通過，來源需更新。新官方目錄可讀到巧克力包覆 56 g、123 g 等，以及原味、黑巧克力、白巧克力版本。照片的巧克力薑餅身分正確。「糖霜」可屬一般托倫薑餅，但本次 Katarzynki 目錄未證明此版本，宜收斂描述。 | [現行 Katarzynki 官方目錄](https://kopernik.com.pl/pl_PL/category/katarzynki-r)、[巧克力包覆 123 g](https://kopernik.com.pl/pl_PL/produkt/katarzynki-r-w-deserowej-czekoladzie-2) |
| 18 | Dr. Oetker 香草布丁粉 | 通過。官方商品為 40 g、4 份，需加牛奶煮；現有需煮、非即食布丁的敘述正確。照片為香草口味。 | [Dr. Oetker Budyń waniliowy](https://www.oetker.pl/produkty/p/budyn-waniliowy) |
| 19 | Bakalland BA!／5 Bakalii | **需修正。** 官方製造商 B2B 精確商品為 40 g，EAN 5900749610933。五種果乾是蘋果、葡萄乾、蔓越莓、李子乾、杏桃乾；成分配方沒有列堅果作為原料，堅果屬過敏／交叉接觸注意事項。實際照片是 BAKALLAND 與 5 BAKALII 字樣，沒有醒目的 BA! 大字。 | [Foodwell／Bakalland 官方 5 Bakalii 40 g 商品及完整成分](https://b2b.foodwell.pl/baton-bakalland-5-bakalii-40g-p1045) |
| 20 | Zott Monte | 通過，照片須視為代表包裝。官方波蘭系列有 Original 150 g、MAX 4 × 100 g、6 × 55 g、Mega 400 g 等，巧克力榛果奶霜甜點身分正確。照片上為德文 MAXI 4 × 100 g，不能保證波蘭貨架使用同一外觀；現有描述未指定容量。 | [Zott Monte Original 波蘭官方系列](https://www.zott-dairy.com/pl/marki-produkty/monte/monte-original/) |
| 21 | Zott Belriso | 通過。官方明確說明牛奶與米製甜點，分水果、甜點、牛奶系列；照片巧克力口味圓杯與品牌一致。文字沒有指定容量或保證口味供貨。 | [Zott Belriso 官方系列](https://www.zott-dairy.com/pl/marki-produkty/belriso/) |
| 22 | Danio 香草白起司杯 | 通過。現行官方頁為 130 g 的均質白起司甜點，配方有白起司、鮮奶油、糖、香草香料等，並非原味無糖優格。照片香草款身分正確；現有包裝規格可能不同的說明宜保留。 | [Danio 香草官方商品](https://danio.com.pl/produkty/klasyczne/danio-o-smaku-klasycznej-wanilii/) |
| 23 | Müller Riso | 商品通過，建議換精確官方來源。照片為櫻桃款，官方 Riso Wiśnia 為 200 g，明確說明牛奶米甜點配櫻桃醬。現有 Auchan 原味商品來源不是照片同款，但一般品類描述無誤。 | [Müller 官方 Riso Wiśnia 200 g](https://www.mullerpolska.pl/produkty/riso/riso-original/riso-wisnia)、[Riso Original 系列](https://www.mullerpolska.pl/produkty/riso/riso-original) |
| 24 | Jeżyki Classic | 通過。品牌與製造商商店都確認餅乾、焦糖、榛果、米脆粒及牛奶巧克力；製造商商店確認 140 g，與照片一致。 | [Jeżyki 官方品牌](https://jezykiciastka.pl/)、[Colian 自營商店 Classic 140 g](https://islodycze.pl/goplana-jezyki-classic) |
| 25 | Frugo Czarne | 身分通過，精確配方／容量仍以瓶身為準。現行官方有 Czarne 專頁及商品形象；該頁沒有足夠文字可獨立確認現行 500 ml 或果汁比例。現有資料沒有固定容量，且已註明依瓶身，無需新增不確定數字。 | [Frugo Czarne 官方頁](https://frugo.pl/frugo-czarne) |
| 26 | Kubuś 100% 蘋果胡蘿蔔香蕉 | 通過。官方 300 ml 對應照片與標示，成分為濃縮還原蘋果汁 56%、胡蘿蔔泥 30%、香蕉泥 14%，另加維生素 C。官方稱 100% sok；中文可細化為「含果泥的蔬果汁」，不要誤解為澄清純果汁。 | [Kubuś 官方 300 ml](https://kubus.pl/produkt/kubus-banan-marchew-jablko/) |
| 27 | Sądecki Bartnik 百花蜂蜜 | 商品及所引 SKU 波蘭產地通過。官方連結是 50 g 小玻璃瓶，明確寫原產國 Polska；照片是較大的代表瓶，未能由正面照片確認容量或產地。現有未指定照片重量、要求看產地的文字合理；不可將這個 50 g SKU 的產地擴大為整個品牌所有蜂蜜都波蘭產。 | [Sądecki Bartnik 波蘭百花蜜 50 g](https://sklep.bartnik.pl/pl/produkt/1587-miod-wielokwiatowy-50-g-z-polskich-pasiek.html) |

## 明確修正清單（未執行）

1. `src/data/groceries.js:715`：將「BA! 大字樣與獨立條裝；照片為 5 Bakalii 果乾堅果版本。」改成「Bakalland 與 5 Bakalii 字樣的獨立條裝；照片為五種果乾穀物棒。」`localName` 可改「Bakalland 5 Bakalii」，或保留系列名但不要誤導照片辨識。第 719 行成分提醒可改「各口味的穀物、果乾與過敏原請依實際標示確認。」不要把無堅果原料解讀為對堅果過敏者安全。第 725 行換上上述 Foodwell 精確商品頁。
2. `src/data/groceries.js:683`：舊 `konkurs.kopernik.com.pl` 頁本次讀取 502，舊 www 網址亦不能提供有效正文；改用現行官方目錄 URL。新目錄與 123 g 頁本次均曾成功讀取完整商品內容；重開目錄曾出現工具 Internal Error，屬讀取不穩，不能據此推翻已取得內容。第 677 行可改「Katarzynki 有原味、黑巧克力與白巧克力等版本；餅乾仍需防壓。」
3. ID 23 `sources`：將 Auchan 原味頁換為 Müller 官方櫻桃 200 g 商品頁，與照片和描述一致。
4. 已查核的上述品牌商品來源與 ID 14–27 `checkedAt` 可記 2026-10-13，但來源發布日期仍寫「未標示發布日期」。ID 27 的 Culture.pl 及法規來源本次不在商品證據研究範圍，不可一起假裝重查。

## 可選文字與來源改善

- 第 652 行「原味威化」改「未裹巧克力的威化」。ID 16 可使用現行品牌首頁及 Colian 自營商店作來源，避免依賴本次被限流的介紹頁。
- ID 20 註明「照片為海外代表包裝，波蘭販售規格以貨架為準」。不用換圖也可清楚交代差異。
- ID 26 中文名稱可改「蘋果、胡蘿蔔、香蕉蔬果汁」，備註補含果泥；現有 100%／300 ml 沒有錯。
- ID 27 若繼續用 50 g 證據頁，來源標題直接標「百花蜜 50 g」即可，不要推定照片容量。

未查分店庫存、價格、銷售排行、旅遊日期供貨或蜂蜜法規；上述商品頁也不能證明這些事項。所有食品實際成分、保存及過敏原仍依購得包裝批次。


---

# 超市乳品、果汁與標籤查核

查核日：2026-10-13（Asia/Taipei）。範圍：`src/data/groceries.js:222–355` 的 milk、juice 共 6 款及 labels。只讀專案，未修改資料。

## 判定摘要

6 款均找到品牌或零售商商品存在的第一方證據，但 **不能宣稱全部為最新售價／在架資料**。Łaciate、Krasnystaw、Tymbark、Hortex 有現行品牌／直營零售商品頁；Riviva 1 L 有 Biedronka 品項頁，200 ml 有直接商品頁；Solevita 1 L 目前只補到 Lidl 舊官方品項清單，2026-10-09 活動尚無第一方原始傳單可核實。3 個 Pepper 活動頁本次無法擷取，不能據此斷言活動不存在。

## 必須修正或收斂的內容

1. **P1：:223–226 查核日期在未來。** `checkedAt: 2026-10-14` 及同日註解超過本次 2026-10-13，不可當成實際查核紀錄。
2. **P2：:232、:238 Łaciate 排行月份過時。** 現有 Allegro 動態 URL 顯示「2026 年 10 月」、更新日 2026-10-11，第一名仍是 Łaciate UHT 3,2% 1000 ml；該 URL 無法證實 6 月歷史榜。可改成精確目前快照或只留品牌規格。[Allegro 第一方排行](https://allegro.pl/ranking/mleko-i-napoje-mleczne)
3. **P2：:246、:249、:252 Krasnystaw 8 月特價／2.29 與原價 2.89 未證實。** Blix 是更新中的類別頁，現為 10 月頁，看到 Activia、Mleczna Dolina 等，不能作指定 Krasnystaw 420 g 的 8 月促銷原始證據。「Mleczna Dolina 更便宜」也欠同規格、同日期價差。建議移除這些確定口吻。[原引用頁](https://blix.pl/produkty/artykuly-spozywcze/nabial/kefir/biedronka)
4. **P1：:266 Tymbark「2026 年 5 月起取消」不忠實。** 原 WH 文的可讀導言已說品牌預告消費者參與的新計畫，94% 本文受訂閱限制。直接採訪 Maspex 的 WP 2026-05-15 本文明說標語將以新形式回歸；品牌官網目前仍介紹瓶蓋標語。因此只能說曾出現空白瓶蓋／行銷活動，不能寫成永久取消，也不能用這則新聞證明蘋果小盒是新品。[品牌第一方說明](https://tymbark.com/o-nas/o-tymbarku/)、[原 WH 引用](https://www.wiadomoscihandlowe.pl/branza-po-godzinach/tymbark-bez-kultowych-hasel-maspex-ujawnia-co-stanie-sie-z-kapslami-2535139)、[直接採訪本文](https://finanse.wp.pl/co-z-haslami-pod-kapslami-tymbarku-firma-zabrala-glos-nasz-news-7286085805250624a)
5. **P2：:264–269 Tymbark 品項證據錯配。** 標題是純蘋果，來源 Gemini 是蘋果水蜜桃；「新品」標籤無法證明 2026 上市。品牌確認純蘋果 200 ml 紙盒（有 Disney 圖案），另有 300 ml 版本；建議小盒鎖定 200 ml。「玻璃瓶裝全是果汁飲料」未獲證實，應按 Sok 100%／Napój 標籤判讀，不按容器材質分類。[純蘋果 200 ml](https://tymbark.com/produkt/jablko/)、[其他容量蘋果汁](https://tymbark.com/produkt/jablko-bez-dodatku-cukru/)
6. **P2：:276–283、:290–297、:304–311 促銷只能列歷史待查。** Hortex 8/20–22 買 6、Riviva 8/26 買 3 送 3／1.49、Solevita 10/9 買 3 送 3 的原引用均為 Pepper 社群頁，本次無法讀取、未找到同活動第一方傳單。即使活動真實也已過期，不能代表 10 月下旬價錢與庫存。Hortex 引用 Empik 2 L 不精確支持本卡的 1 L；Solevita 的 2026 活動包裝缺少第一方證據，不能據此確認卡片的紙盒描述，需逐一 SKU 核對。
7. **P2：:294 Riviva 押金要加限定。** 0.50 PLN 對納入制度的 PET 正確，但必須是有押金標誌的包裝；不能只因是寶特瓶就斷言，紙盒不在制度內。[Biedronka 官方規則，2026-05-05 生效](https://cdn.biedronka.pl/policies/Regulamin_systemu_kaucyjnego_(obowiazuje_od_05.05.2026).pdf)
8. **P2：:308、:351 `tłoczony / NFC` 不是「鮮榨」的同義詞。** 建議「壓榨／非濃縮還原；是否殺菌、是否冷藏看包裝」。波蘭 IJHARS 明確區分壓榨與未經保存處理的鮮榨；已殺菌產品不宜宣稱鮮榨。[官方消費說明](https://www.gov.pl/web/wijhars-bydgoszcz/sok-czy-nektar)
9. **P3：:349–350 Nektar／Napój 過度簡化。** Nektar 可寫「加水果汁／果泥飲品，可能加糖或甜味劑，查看果汁比例」；Napój 是飲料，果汁比例需看標示，不能一律比 Nektar 低。[波蘭官方說明](https://www.gov.pl/web/psse-rawa-mazowiecka/soki-nektary-napoje-czym-sie-roznia-w-czym-sa-podobne-)

## 可保留的第一方已確證資訊

| 品項 | 可保留內容與證據 | 待確認界線 |
|---|---|---|
| Łaciate 3,2% UHT | 品牌有 500 ml 與 1 L；未開封長效保存。Auchan 500 ml 標示開封後冷藏、3 天內飲用，牛斑包裝也對應。 | 不保證任一指定門市有貨；排行是平台銷售排行，不是口味評比。 |
| Krasnystaw Kefir | 品牌波蘭文頁確有 420 g、EAN 5902057001748，成分為牛奶、乳蛋白及菌種。 | Biedronka 指定促銷、替代牌價差未確認。 |
| Tymbark 蘋果汁 | 品牌 200 ml 紙盒頁明列 Sok 100%，另有 300 ml／1 L 產品。 | 舊新聞不支持「新品」或取消瓶蓋標語。 |
| Hortex 蘋果汁 | Auchan 第一方 1 L 頁確認 100% 濃縮還原蘋果汁加維生素 C、經殺菌；有 1 L 塑膠瓶。 | 原文「細長紙盒」只可描述照片版本，不能概括所有 1 L；歷史促銷未確認。 |
| Riviva 蘋果汁 | Biedronka 品項頁列 1 L／2 L／330 ml 蘋果汁；官方 200 ml 商品頁也列 100% 濃縮還原蘋果汁。 | 品項頁不等於即時門市庫存；1.49 活動價待查。 |
| Solevita 柳橙汁 | Lidl 官方清單確有 Solevita Sok 100% pomarańczowy 1 L，也有不同 NFC／壓榨款。 | 官方清單較舊，不能證明 2026 活動或目前包裝；10/9 活動待第一方補證。 |

來源：

- [Mlekpol 500 ml](https://mlekpol.com.pl/index.php/produkt/mleko-uht-laciate-32-2/)
- [Mlekpol 1 L](https://mlekpol.com.pl/index.php/en/produkt/laciate-uht-milk-32/)
- [Auchan 500 ml 牛奶與儲存方式](https://zakupy.auchan.pl/products/mleko-uht-3-2-%C5%82aciate-500-ml/00153712)
- [Krasnystaw 原廠 420 g](https://www.krasnystaw.eu/pl/produkty/kefir/kefir-w-butelce)
- [Auchan Hortex 1 L](https://zakupy.auchan.pl/products/sok-jab%C5%82kowy-100-hortex-1-l/00009087)
- [Biedronka 品項頁](https://www.biedronka.pl/pl/nutri-score-pl)
- [Biedronka Riviva 200 ml](https://zakupy.biedronka.pl/riviva-riviva-sok-100-jablko-200-ml-0000006545.html)
- [Lidl 官方品項清單（較舊）](https://www.lidl.pl/static/assets/VAT-STOP-Lista-produktow-3-877702.pdf)

其他標籤：Mleko UHT、bez laktozy、Sok 100%、z koncentratu、bez dodatku cukru 的翻譯可保留；`mętny` 建議只寫「混濁型」，刪除絕對的「未過濾」，因混濁程度不能單獨證明製程。乳品冷藏及保存期限仍依手上實際包裝。

## 證據方法與限制

已閱讀官方／直接零售商品與規則內容，媒體只用於驗證原引用究竟說了什麼。沒有登入、購買、查指定住宿附近門市庫存，也不把搜尋索引日期當產品上市日。查核日可記錄為 2026-10-13，但建議每筆另列已確認的層次與未確認的促銷，不用共同日期掩蓋證據不足。記憶只用於確認此專案應保留來源與推薦資訊、不還原未證實 availability；所有商品結論均為本次查詢。


---

# Żabka 即食商品與早餐查核

查核日期：2026-10-13（Asia/Taipei）。唯讀範圍：`src/data/groceries.js:315–342` 與 `src/templates/groceries.mjs:201–207`。未改專案。以官方網頁、品牌公告及 Chrome 實際操作動態菜單核對；不以 Open Food Facts 推定目前在售，亦未確認個別門市當天庫存。

## 結論與建議

| 項目 | 判定 | 建議 |
|---|---|---|
| Szamamm 即食湯 | 品牌及目前湯品類別可證實；指定照片的菇湯麵未確認當期供應 | 改用官方品牌頁及 2026/01/19 湯品公告，照片僅作包裝辨識參考；菇湯麵、Kimchi 等特定口味不能一概寫成每店現售。 |
| Wołowiner 牛肉漢堡 | 現行官方動態菜單確有 Wołowiner 146 g 及 extra cheddar 158 g | 主要來源改用官方菜單；原紅盒照片與成分文字可作辨識參考，仍以現場包裝為準。 |
| Wieprzowiner 手撕豬肉同系列 | 官方 2025 活動資料曾列產品，但本次現行菜單 Burgery 分類未列 | 刪除「同系列還有」的現售口吻，或標示目前供應待確認。未證實停售。 |
| 2026 美式熱狗全國供應 | 有 2026/04/15 第一方公告，現行動態菜單也列 Hot Dog Amerykański | 把媒體來源換成官方公告，可精確寫「2026 年 4 月官方宣布擴至全國門市」；庫存仍依現場。 |
| 無肉熱狗 | 找到 2020 上市、2025 活動名單；本次現行 Hot Dogi 清單未列無肉版本 | 改為「曾推出無肉版本，目前供應須向門市確認」，或移除肯定句。不能因未列就宣稱停售。 |
| Tosty、Panini、Zapiekanka | 現行官方動態菜單可證實 | 原火腿起司／雞肉培根吐司說明正確；「只在有 PROSTO z PIECA 的門市才有」需更新，因官方 2025/06/11 已宣布全門市烤爐完成。改為供應口味依分店與現場庫存。 |
| 咖啡 | 現行官網有黑咖啡、Latte、Cappuccino、Espresso | 原文可保留，補官方菜單來源。未把優惠價格寫成旅行期間價格。 |

## 第一方來源與證據

### 湯品

- [Żabka Szamamm 官方品牌頁](https://www.zabka.pl/marki-wlasne/szamamm/)：2026/10/13 在 Chrome 點選 `Zupy`，可見 Pumpkin spice 450 g、Żurek 380 g、Gyros 380 g、minestrone 380 g、Barszcz ukraiński 380 g、kalafiorowa 380 g。這是本次已顯示的品項，沒有按「更多」擴查，不能當成完整清單。頁面亦表示多數餐點可微波，應看包裝標誌。
- [2026/01/19 官方湯品公告](https://www.zabka.pl/sprobuj-pysznych-zup-szamamm-z-linii-porcja-dobrego/)：明列 Szamamm 湯由 Nowalijka Convenience Food 製作，例舉清雞湯、番茄濃湯、泰式雞湯與墨西哥湯。足以替代目前引用的產業媒體，不能證明 10 月每一口味仍有貨。
- [製造商 Kimchi 公告](https://nowalijka.pl/zupa-kimchi-nowalijki-w-ofercie-sieci-zabka/)：稱原 Halloween 限定款後改為 Żabka 常態品項；可作該款存在的第一方依據，未確認各分店現貨。
- 菇湯麵 EAN 5900907009296：本次未取得當期官方品項證據。品牌站搜尋摘要曾露出 `Prywatne: Zupa grzybowa`，直接開頁未顯示，不能採用該摘要宣稱目前在售。照片應標為參考，不能以 Open Food Facts 代替現售證據。

### 漢堡

- [Żabka 現行官方菜單](https://www.zabka.pl/zabka-menu/)：Chrome 於 2026/10/13 點選 `Burgery`，顯示 Wołowiner 146 g、Wołowiner extra cheddar 158 g；另有 Chrupczak classic／tokio、Kurczaker。Wołowiner 當時顯示 11.99 PLN 原價、搭 Żappka 買 2 件條件 9.99 PLN，僅為查核快照，不應填成旅遊日期價格。
- [2021/02/19 官方 Wołowiner 說明](https://www.zabka.pl/danie-gotowe-marki-szamamm-najlepszym-produktem-2021-roku/)：可支持 Wołowiner 的牛肉漢堡排與 Cheddar、店內加熱／帶回家加熱歷史描述；不能用此舊文驗證 2026 現行配方或加熱秒數。
- [2025 官方活動產品名單 PDF](https://cdn.zabka.pl/wp-content/uploads/2025/05/27153848/Regulamin-Konkursu_Zabka-Merch-drop-02.docx.pdf)：列 Wołowiner 冷藏 146 g、Wieprzowiner 冷藏及熱食 164 g。僅歷史證據。

### 熱狗與烤爐

- [2026/04/15 官方美式熱狗公告](https://www.zabka.pl/nowy-gracz-w-druzynie-zabki-hot-dog-amerykanski-debiutuje-obok-kultowych-zapiekanek/)：明言美式熱狗原在行動店販售，現擴至全部逾 12,000 店，含番茄醬、酸黃瓜醬與炸洋蔥。公告當期促銷不延伸至本趟日期。
- [2025/06/11 全門市烤爐完成公告](https://www.zabka.pl/street-food-dostepny-w-kazdej-zabce/)：官方稱最後一台烤爐在華沙 Ordona 7B 啟用，全網逾 11,600 店已備烤爐，可供應熱食。故原「只在部分有烤爐的店才有」暗示已過時；仍需保留現貨差異。
- [2020/03/05 無肉熱狗上市公告](https://www.zabka.pl/nowosc-w-zabce-hot-dog-bez-miesa/)：可證明曾推出植物配方；不能單獨證明 2026/10 現售。本次 Chrome `Hot Dogi` 顯示美式、MAX、一般熱狗及肉類口味，未見無肉選項，仍標未確認。

### 吐司、長麵包與咖啡

- [現行菜單](https://www.zabka.pl/zabka-menu/)：Chrome `Tosty` 有蘑菇起司、雞肉培根、火腿起司；`Panini` 有手撕牛肉蘑菇、雞肉、火腿 jalapeño、Cheddar、蘑菇、雞肉羅勒醬；`Zapiekanki` 有雞肉起司、蘑菇起司、salami 起司。咖啡頁列黑咖啡、Latte、Espresso、Cappuccino 等。
- [2025/08/29 官方早餐介紹](https://www.zabka.pl/sniadania-w-zabce-staly-sie-hitem/)：明列火腿起司與雞肉培根吐司、炒蛋培根 Panini；同文指出全店已配烤爐。原吐司文案可證實。

## 可直接採用的簡短文案

- 即食湯：「Szamamm 即食湯有不同口味，官方目前列有 Żurek、蔬菜湯等；圖片為菇湯包裝參考，不保證當期或每間分店供應。加熱方式依包裝標示。」
- 漢堡：「官方菜單現列 Wołowiner 牛肉漢堡，也有 extra cheddar 版本；照片為包裝辨識參考，品項與價格依現場。」
- 熱狗：「可選香腸與醬料；2026 年 4 月官方宣布美式熱狗擴至全國。無肉版本目前供應未確認，需詢問門市。」
- 早餐：「火腿起司、雞肉培根吐司、Panini 與 Zapiekanka 都列在官方菜單；官方已完成全門市烤爐配置，實際口味依當日供應。」

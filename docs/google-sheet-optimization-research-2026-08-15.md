# Google Sheet 優化研究：餐廳價格與伴手禮購買地點

查證日期：2026-08-15（台北時間）  
資料來源：Google Sheet「波蘭旅遊」的「各城市推薦餐廳」`A1:G100` 與「伴手禮與零食清單」`A1:F100`。本次僅唯讀；沒有修改 Google Sheet。

## 使用原則

- 餐廳只採餐廳官網、餐廳官方菜單 PDF 或官方訂位頁；找不到固定價就留白或寫「單點」，不把網友估價當成每人預算。
- 商品購買地點優先用品牌直營店、製造商列出的正式經銷點，或大型連鎖超市的官方商品頁與分店頁。
- 超市網頁能證明該連鎖販售該商品，但不能保證每一家實體分店當天有貨；試算表宜加「庫存依分店」短註。
- 台灣入境判斷以防檢署、關務署及食藥署資料為準。規則可能變動，出發前應再查一次。

## 一、餐廳「預算每人」可直接寫入值

下列價格均為 PLN／人，飲料配對未計入。服務費不是餐價本身，宜留在「訂位／備註」欄。

| 城市 | 餐廳 | 試算表建議值 | 官方依據與保守註記 |
|---|---|---:|---|
| 華沙 | Alon Omakase | `1,250 PLN` | 官方只有一套季節 omakase，1,250 PLN／人；飲料、酒另計，帳單另加 10% 服務費。[官方菜單](https://omakase.eu/en/menu/) |
| 華沙 | NUTA | `595／795 PLN` | Virtuoso 595、Maestro 795 PLN／人；另加 10% 服務費。[官方菜單](https://nuta.com.pl/menu/) |
| 華沙 | hub.praga | `660／780 PLN；素食 640 PLN` | 小／大品嚐套餐 660／780，素食 640 PLN／人；另加 10%。[官方 2026 菜單 PDF](https://hub-praga.pl/sites/default/files/menu/menu_2026_15.04_online_0.pdf) |
| 華沙 | Rozbrat 20 | `590／690 PLN` | 短版 590、完整版 690 PLN；另加 12.5%。[官方品嚐菜單 PDF](https://rozbrat20.com.pl/wp-content/uploads/2023/09/menu_pelna_degustacja_PL.pdf) |
| 克拉科夫 | Bottiglieria 1881 | `940／990 PLN` | Zapoznanie 940、Pełne doświadczenie 990 PLN；另加 12.5%。[官方菜單](https://1881.com.pl/nasze-menu/) |
| 樂斯拉夫 | BABA | `單點；主菜 82–179 PLN，甜點 40–60 PLN` | 官方菜單沒有固定每人套餐價；不要硬填一個每人預算。可列官方菜單的主菜、甜點價格帶。[官方網站／菜單入口](https://baba.wroclaw.pl/) |
| 樂斯拉夫 | MOST／Między Mostami | `490 PLN` | 品嚐套餐 490 PLN／人；週四至週六供應、需預約並付訂金。[官方品嚐菜單](https://miedzy-mostami.pl/most/degustacja/) |
| 樂斯拉夫 | IDA kuchnia i wino | `209 PLN` | 官方 6 道品嚐套餐 209 PLN／人；6 人以上另加 10%。[官方菜單 PDF](https://idakuchniaiwino.pl/assets/menu/menu.pdf) |
| 波茲南 | Muga | `560 PLN；魚子醬版 685 PLN` | Reserva 560；加魚子醬 685 PLN；另加 12.5%。[官方菜單](https://restauracjamuga.pl/en/menu/reserva) |

### 與試算表現值相比，應優先更正

| 餐廳 | 現值 | 建議值 |
|---|---:|---:|
| Alon Omakase | 約 1,100 | 1,250 PLN |
| NUTA | €€€€ | 595／795 PLN |
| hub.praga | 空白 | 660／780 PLN；素食 640 PLN |
| Rozbrat 20 | €€€€ | 590／690 PLN |
| Bottiglieria 1881 | 290／360 | 940／990 PLN |
| IDA kuchnia i wino | 149 | 209 PLN |
| Muga | 390–540 | 560 PLN；魚子醬版 685 PLN |
| MOST | 490 | 可保留 490 PLN |
| BABA | €€ | 改為單點價格帶，不寫星級價位符號 |

其餘餐廳若官網沒有穩定套餐或完整價目，建議「預算每人」留白。這比用 `€€`、`€€€€` 或評論網站推估更可靠。

## 二、伴手禮與零食：可直接寫入「建議購買地點」

| 品項 | 建議購買地點（可直接寫入） | 來源與注意事項 |
|---|---|---|
| Wycinanki 剪紙 | `PolArt－Dom Sztuki Ludowej，華沙 Rynek Starego Miasta 10` | 店家官網表示長期販售 wycinanki 等波蘭民藝。[官方介紹](https://domsztukiludowej.pl/o-nas/) |
| 波羅的海琥珀 | `S&A jewellery design，克拉科夫 Grodzka 14；或華沙 Świętojańska 23/25` | S&A 官網列出兩家市中心品牌店。試算表原寫「Grodzka 60／14」應統一改成目前官網的 Grodzka 14。[官方分店](https://s-a.pl/kontakt/) |
| Bolesławiec 陶器 | `Zakłady Ceramiczne Bolesławiec 直營店，華沙 Prosta 2/14` | 製造商官網列為直營店；另列克拉科夫 Szewska 9、Sławkowska 11、Sukiennice 攤位 38 等正式經銷點。[製造商通路](https://home.zakladyboleslawiec.com/dystrybucja/) |
| 伏特加 Wódka | `Carrefour Market 華沙 Złota 59（酒類區；庫存依分店）` | 此分店靠近中央車站且官方列為大型 Market。返台酒類：年滿 18 歲，1.5 公升內免稅；最多 5 公升，超過 1.5 公升須走紅線申報補稅。[分店頁](https://www.carrefour.pl/sklep/warszawa/zlota-59)、[台灣關務署](https://web.customs.gov.tw/singlehtml/2222?cntId=b8f47b6346924fc3a5a85b89a6d3434d) |
| E. Wedel 巧克力／Ptasie Mleczko | `E.Wedel Staroświecki Sklep，華沙 Szpitalna 8` | 品牌官方分店頁列出歷史店與地址。[官方分店](https://wedelpijalnie.pl/lokale) |
| Prince Polo 巧克力威化棒 | `Carrefour Market 華沙 Złota 59（庫存依分店）` | Carrefour 官方商品頁可查到 Prince Polo；Mondelēz 官方確認 Prince Polo 為波蘭生產的在地品牌。[商品頁](https://www.carrefour.pl/partner/27254465387911645999299352671)、[品牌方](https://www.mondelezinternational.com/poland-baltics/?trk=test) |
| Delicje 果醬夾心餅 | `Carrefour Market 華沙 Złota 59（庫存依分店）` | Carrefour 官方商品頁有多種 Delicje。試算表「Wedel 出品」不正確；品牌方 Mondelēz 表示 Delicje 在其 Płońsk 工廠生產。[商品頁](https://www.carrefour.pl/hAsypWB2)、[品牌方](https://www.mondelezinternational.com/poland-baltics/?trk=test) |
| Mieszanka Krakowska | `Wawel 品牌店，克拉科夫 Rynek Główny 33` | Wawel 官網列出該直營店與產品。試算表不宜寫「克拉科夫限定鐵盒」；官方常態商品是 280 g 巧克力水果軟糖，並非只限克拉科夫販售。[官方分店](https://www.wawel.com.pl/sklepy)、[官方產品](https://www.wawel.com.pl/karta-produktu/?id=5900102021567) |
| Paluszki 鹹餅乾棒 | `Carrefour Market 華沙 Złota 59（選 Lajkonik；庫存依分店）` | Carrefour 官方商品頁列出 Lajkonik 原味與其他口味。[商品頁](https://images.carrefour.pl/artykuly-spozywcze/przekaski/paluszki-krakersy) |
| Herbapol 花草茶 | `Carrefour Market 華沙 Złota 59（庫存依分店）` | Carrefour 官方 Herbapol 品牌頁列有多款花草茶。[商品頁](https://www.carrefour.pl/marki/herbapol) |
| 椴樹蜜 miód lipowy | `Carrefour Market 華沙 Złota 59（選商業密封原包裝；庫存依分店）` | Carrefour 官方頁列有椴樹蜜。因蜂蜜未在防檢署參考表中明確逐項說明，保守作法是保留完整標籤並於入境時主動詢問檢疫櫃檯。[商品頁](https://www.carrefour.pl/promocje/dzemy-powidla-miody)、[台灣農畜水產品規定](https://web.customs.gov.tw/taipei/singlehtml/3392?cntId=cus2_3392_3392_1351) |
| Toruń 薑餅 Pierniki | `Carrefour Market 華沙 Złota 59（選 Kopernik；庫存依分店）` | Carrefour 官方商品頁列有 Kopernik Toruńskie Pierniki。[商品頁](https://www.carrefour.pl/artykuly-spozywcze/slodycze/ciastka/kopernik-pierniki-torunskie-w-czekoladzie-z-nadzieniem-o-smaku-sliwkowym-150-g) |
| Nalewka 水果利口酒 | `Carrefour Market 華沙 Złota 59（酒類區；庫存依分店）` | 同伏特加入境規則：18 歲以上，1.5 公升內免稅，超量須申報；不要把「1.5 公升」誤寫成禁止上限。[分店頁](https://www.carrefour.pl/sklep/warszawa/zlota-59)、[台灣關務署](https://web.customs.gov.tw/singlehtml/2222?cntId=b8f47b6346924fc3a5a85b89a6d3434d) |
| oscypek 煙燻羊乳酪 | `oscypki.pl 認證生產者官方網店（可寄送波蘭境內）；若現場買，認明 PDO／ChNP 認證` | 官方商品頁顯示真正 oscypek 季節約 5 月至 10 月中；本次 10 月下旬行程不應假定仍有新鮮貨。防檢署 2016 年官方參考表列「乳酪」無須申報動物檢疫，但該表也明訂應以最新公告為主；因此可保留本品項，出發前仍應再確認。另受自用食品 6 公斤、1,000 美元規則，並須評估長途冷藏。[官方商品](https://www.oscypki.pl/produkt/oscypek-prawdziwy/)、[台灣防檢署參考表 PDF](https://news.aphia.gov.tw/NewsPublish/NewsPhoto/11376/%E5%B8%B8%E8%A6%8B%E5%85%A5%E5%A2%83%E6%97%85%E5%AE%A2%E6%94%9C%E5%B8%B6%E6%A4%8D%E7%89%A9%E6%88%96%E5%85%B6%E7%94%A2%E5%93%81%E6%AA%A2%E7%96%AB%E8%A6%8F%E5%AE%9A%E5%8F%83%E8%80%83%E8%A1%A8.pdf)、[台灣關務署](https://web.customs.gov.tw/taipei/singlehtml/3392?cntId=cus2_3392_3392_1351) |
| rogal świętomarciński | `依 Poznań 市政府連結的當年度認證糕餅店地圖購買` | 真品須由取得證書的業者製作；認證會更新，不宜把單一家寫成永久「公認最好」。[Poznań 市政府說明](https://www.poznan.pl/mim/smartcity/infoteka%2C1042/rogale-swietomarcinskie-i-imieniny-ulicy-swiety-marcin%2C266113.html) |
| obwarzanek 克拉科夫麻花圈 | `Żywe Muzeum Obwarzanka，克拉科夫 Paderewskiego 4` | 官方 FAQ 確認現場可買真正 obwarzanek，但數量會售完。屬當地現吃品，較不適合列為長途伴手禮。[官方 FAQ](https://www.muzeumobwarzanka.com/faq/) |

## 三、應從清單刪除的品項

### Kabanosy 煙燻香腸乾

結論：**整列刪除**，不要只改成「不能帶」。

台灣防檢署明確列出香腸、肉乾等加工肉製品（包含真空包裝）禁止攜帶入境；臺北關也重申肉類或加工肉類若未附合格文件不得輸入。這正符合使用者要求「不能帶回台灣的東西就刪除」。

- [防檢署：加工肉製品禁止攜帶](https://www.aphia.gov.tw/ws.php?id=18065)
- [臺北關：真空包裝肉製品規定](https://web.customs.gov.tw/taipei/singlehtml/3130?cntId=cus2_177199_3130)

目前查證範圍內，**只有 Kabanosy 能以官方資料明確判定應刪除**。oscypek 屬乳酪，防檢署 2016 年官方參考表列為無須申報動物檢疫；因此不應只因「乳製品」三字就誤刪。但該表也提醒要以最新公告為主，建議出發前再向防檢署確認，並留意冷藏、食品總量與旅程日期。

## 四、台灣入境共通註記（宜放在備註，不需另留「帶回台灣」欄）

- 肉類與加工肉品：不要攜帶，真空包裝也不例外。
- 乳酪：防檢署 2016 年官方參考表列為無須申報動物檢疫；但需以最新公告為主，出發前再確認。
- 一般自用食品：價值在 1,000 美元以下且總重量 6 公斤以內，免申請食品查驗；農畜水產品類總量同樣不得超過 6 公斤。[關務署完整說明](https://web.customs.gov.tw/taipei/singlehtml/3392?cntId=cus2_3392_3392_1351)
- 酒類：年滿 18 歲，1.5 公升內免稅；1.5–5 公升須紅線申報補稅；超過 5 公升須另具許可。[關務署 2025 修正說明](https://web.customs.gov.tw/singlehtml/2222?cntId=b8f47b6346924fc3a5a85b89a6d3434d)

## 五、給試算表編輯者的精簡對照

### 餐廳欄位

- Alon：`1,250 PLN`
- NUTA：`595／795 PLN`
- hub.praga：`660／780 PLN；素食 640 PLN`
- Rozbrat 20：`590／690 PLN`
- Bottiglieria 1881：`940／990 PLN`
- BABA：`單點；主菜 82–179，甜點 40–60 PLN`
- MOST：`490 PLN`
- IDA：`209 PLN`
- Muga：`560 PLN；魚子醬版 685 PLN`
- 其他沒有官方固定價者：留白，不寫 `€€` 或 `€€€€`。

### 伴手禮欄位

- 刪除 Kabanosy 整列。
- 保留 oscypek；改註「2016 年官方參考表列乳酪免申報動物檢疫，但出發前需再查；10 月下旬新鮮貨未必供應，需冷藏」。
- 刪除「帶回台灣」欄後，把酒類、食品 6 公斤與肉品禁帶規則濃縮到表尾備註。
- 修正 Delicje：不是 E.Wedel 出品，為 Mondelēz 品牌。
- 修正 Mieszanka Krakowska：不是可靠的「克拉科夫限定鐵盒」描述。
- 修正 S&A 地址：Grodzka 14。
- 共通超市採買可集中寫：`Carrefour Market，華沙 Złota 59（庫存依分店）`。

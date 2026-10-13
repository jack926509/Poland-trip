# 新增採買候選查核（2026-10-13）

查閱日：2026-10-13，Asia/Taipei。依 research 技能進行背景研究，只新增本筆記；未修改 `src`、照片或快取。

兩款都有現行品牌商品證據，可以新增為旅途選品。推薦理由是補充鹹口零食與原味冷藏早餐選擇，屬本清單的使用情境建議，不代表銷售排行、品牌官方背書或指定分店庫存。未加入營養、醫療或減重宣稱。

## 1. Lajkonik Precelki／Precelki Chrupkie

| 項目 | 查核結論 |
|---|---|
| 正確品名 | 品牌現行頁標題是 **Precelki**；製造商 eLorenz 商務平台稱 **Precelki Chrupkie**。不要把「mini pretzels」當成另一個已確認的官方系列名稱。 |
| 商品與規格 | 鹹味椒鹽結形脆餅。eLorenz 目前首頁商品清單列 **Lajkonik Precelki 130 gramów**、商品代碼 E2030140；整箱 16 包是商務包裝，卡片寫單包 **130 g** 即可。 |
| 成分辨識 | 品牌頁列小麥粉、菜籽油、鹽、海鹽、酵母、大麥麥芽萃取等，並列可能含芝麻、奶、蛋。卡片不需要複製配方，過敏原依實際包裝。 |
| 保存 | 品牌消費者頁沒有寫保存條件；不能假稱已從該頁核實。E.Leclerc 自家商品頁的包裝資料列常溫、避光乾燥、遠離熱源，可作第二層輔助證據。卡片使用「依包裝保存，開封後封好防潮」即可，不填固定溫度或保存天數。 |
| 用途 | 本清單建議：搭車時想吃鹹口脆餅，可與甜巧克力、威化餅輪替；不是新鮮麵包店的大顆椒鹽捲餅。 |

第一方來源：

- [Lajkonik 品牌商品頁](https://lajkonik.pl/produkty/precelki/)：實際讀取標題、成分及商品照片連結。未標示發布日期。
- [eLorenz 製造商商務平台](https://elorenz.pl/)：首頁 Precelki Chrupkie 項目明列 130 g。精確商品連結為 <https://elorenz.pl/lajkonik-precelki-130g-16-szt/kar>，本次工具讀取此深層頁失敗，規格依成功讀取的首頁內容，不以網址推定。
- [eLorenz 平台條款](https://elorenz.pl/polityka-prywatnosci)：第 1 條確認營運者為 Lorenz P.S.A.，與 Lajkonik 官網所列品牌行銷公司一致，據此確認商務平台第一方身分。此條款只用於查核來源身分。
- 輔助來源：[E.Leclerc 自家商品頁](https://leclerc.com.pl/lajkonik-precelki-chrupkie)：130 g、EAN 5900320001334、常溫及乾燥避光保存。此為零售商提供的商品標示，不冒稱品牌直接發布。

### 建議卡片文案

- `name`：鹹味迷你椒鹽脆餅
- `localName`：Lajkonik Precelki Chrupkie
- `packaging`：找 Lajkonik 與 Precelki 字樣的袋裝脆餅；本次核對單包 130 g。
- `use`：常溫零食・旅途鹹口
- `reason`：想在巧克力與威化餅之外換個鹹口，可買一包在搭車時分著吃。
- `note`：是結形小脆餅；依包裝保存，開封後封好防潮，放行李時注意防壓。
- `localOnly`：false；`priority`：false；`checkedAt`：2026-10-13。

## 2. Piątnica Skyr naturalny 150 g

| 項目 | 查核結論 |
|---|---|
| 正確品名 | **Skyr naturalny 150 g**，原味冰島式濃稠優格。不是同品牌 Skyr 飲用型，也不是香草或水果口味。 |
| 規格 | 現行品牌商品頁列 **150 g** 及另一個 **450 g** 版本。此候選鎖定較小的 150 g 杯裝。 |
| 商品身分 | 官方描述濃稠、奶油般質地；成分列巴氏殺菌牛奶與優格菌種。不要把 naturalny 翻成「無糖」，也不要沿用高蛋白等營養宣傳作推薦理由。 |
| 保存 | 冷藏確定。品牌舊型錄（官方路徑標 2024）第 16 頁、PDF 索引 15，對 Skyr 150 g／450 g 列 **+1 至 +8°C**。現行 Auchan 商品標示則為 **+1 至 +6°C**、開封後即食，數值不同。產品現行網頁沒有溫度，因此公開卡片寫「依杯身標示冷藏」，不沿用舊型錄的 +8°C 或保存天數。 |
| 用途 | 本清單建議：住宿有冰箱時，可搭水果、麵包作早餐的一部分；僅安排當地食用。 |

第一方來源：

- [Piątnica Skyr naturalny 150 g 官方商品頁](https://piatnica.com.pl/produkt/skyr-naturalny-150g/)：實際讀取名稱、150 g／450 g 規格、質地與成分；未標示發布日期。
- [Piątnica 官方產品型錄](https://piatnica.com.pl/content/uploads/2024/01/Piatnica_2024_Katalog_produktowy.pdf)：第 16 頁 Skyr 表格可確認冷藏性質；舊版數字不直接當作現行杯身要求。
- 輔助比對：[Auchan 自家 150 g 商品標示](https://zakupy.auchan.pl/products/skyr-jogurt-typu-islandzkiego-naturalny-pi%C4%85tnica-150-g/00871064)：EAN 5900531004544 與 +1 至 +6°C 保存資料。這是零售商資料，保留與舊型錄差異，不把差異隱去。

### 建議卡片文案

- `name`：原味冰島式優格
- `localName`：Piątnica Skyr naturalny
- `packaging`：冷藏櫃找 Piątnica、Skyr 與 naturalny 字樣；本次核對 150 g 杯裝。
- `use`：當地吃・冷藏早餐
- `reason`：喜歡濃稠原味優格，可買小杯搭配水果或麵包，作為住宿早餐的一部分。
- `note`：需依杯身標示冷藏；住宿沒有冰箱時買了就吃，別與飲用型或水果口味混淆。
- `localOnly`：true；`priority`：false；`checkedAt`：2026-10-13。

## Open Food Facts 照片候選與署名資料

已唯讀查詢 Open Food Facts API 的商品身分、容量、front 圖片版本與原圖上傳者。**本研究沒有下載照片、目視驗圖或新增照片檔案**；以下 URL 是 API 實際回傳值，交實作者下載後核對。OFF 是照片及代表包裝來源，不取代前述品牌商品證據。

| 商品 | OFF 條碼／商品頁 | API 回傳 front URL | 原圖資訊 |
|---|---|---|---|
| Lajkonik Precelki słone 130 g | [5900320001334](https://world.openfoodfacts.org/product/5900320001334) | <https://images.openfoodfacts.org/images/products/590/032/000/1334/front_en.102.400.jpg> | 原圖 ID 10；上傳者 `foodless`；front_en rev 102；完整原圖尺寸 2184 × 4080。 |
| Piątnica Skyr Naturalny 150 g | [5900531004544](https://world.openfoodfacts.org/product/5900531004544) | <https://images.openfoodfacts.org/images/products/590/053/100/4544/front_en.39.400.jpg> | 原圖 ID 9；上傳者 `therealleo`；front_en rev 39；完整原圖尺寸 3024 × 4032。 |

Skyr 另有更新的波文 front_pl，API 中原圖 ID 13、rev 59、上傳者 `summerseal`、尺寸 2355 × 1968，可由 API 的 `selected_images` 或商品頁另取波文圖片，下載後比較哪張較適合卡片。不要只因語言鍵為 en／pl 就推定圖片上實際印刷語言。

API 查詢：

- <https://world.openfoodfacts.org/api/v2/product/5900320001334.json?fields=code,product_name,brands,quantity,image_front_url,images>
- <https://world.openfoodfacts.org/api/v2/product/5900531004544.json?fields=code,product_name,brands,quantity,image_front_url,images>

照片落地時仍需依專案既有 `GROCERY-CREDITS.md` 慣例記錄來源、作者、授權與實際轉檔；本筆記只交付研究與來源，不宣稱完成照片／快取／頁面整合驗收。

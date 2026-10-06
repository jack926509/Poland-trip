# 餐飲與購物資料修正

查核日期：2026-10-06（台北時間）。波蘭門市時間為當地時間。

本次依全專案資料查核修正來源資料；價格代表本日可讀的官方菜單，不是 10 月指定日期的固定報價，也不代表已有訂位。

## 官方證據與修正

| 項目 | 官方資料與採用內容 | 修改位置 |
|---|---|---|
| Pasibus Hoża 29 | 官方列週日–四 10:00–22:00、週五–六 10:00–00:00。修正週日多出的 1 小時，該筆查核日更新為本日。[官方門市頁](https://pasibus.pl/lokalizacje/warszawa/pasibus-hoza-warszawa/) | `src/data/fast-food.js` |
| Pasibus Świdnicka 11 | 官方列週一–四與週日 12:00–24:00、週五–六 12:00–02:00。以 00:00 表示午夜；移除平日至 01:00、五六至 03:00 的舊時段，該筆查核日更新為本日。[官方門市頁](https://pasibus.pl/lokalizacje/wroclaw/lokal-pasibus-stacja-swidnicka/) | `src/data/fast-food.js` |
| Muga | Reserva 560 PLN、含魚子醬版本 685 PLN，另加 12.5% 服務費，套餐約 2–3 小時。[官方菜單](https://www.restauracjamuga.pl/en/menu/reserva)；聯絡頁確認 Krysiewicza 5、Poznań。[官方聯絡頁](https://www.restauracjamuga.pl/en/contact) | `src/data/dining-places.js`、`src/data/dining.js` |
| Bottiglieria 1881 | 地址 Bocheńska 5；週二–六 17:00 起，日、一休息；套餐 940／990 PLN，另加 12.5% 服務費。官網不提供單點或分食套餐，同桌須選相同套餐。移除「平日有單點」及未核對的訂位週數保證。[官方菜單與店家資料](https://1881.com.pl/nasze-menu/) | `src/data/dining-places.js`、`src/data/dining.js` |
| Delicje | Mondelēz 官方說明其 Płońsk 工廠持續生產 Delicje，移除 Wedel 出品的錯誤。[品牌方工廠資料](https://www.mondelezinternational.com/poland-baltics/)；零售商實際商品頁列橘子果凍、海綿餅乾與巧克力的 147 g 版本，採買只提示橘子口味，不把未指定 SKU 的口味或包裝形狀寫死。[Carrefour 商品頁](https://www.carrefour.pl/partner/27254902963127719187145039295) | `src/data/shopping.js` |
| Wawel Mieszanka Krakowska | 官方系列為水果果凍與巧克力，列秤重、245 g、1 kg 等多種包裝。[品牌系列](https://www.wawel.com.pl/marki/mieszanka-krakowska)；官方網店亦售此系列，移除「克拉科夫限定金色鐵盒」說法。[官方網店](https://www.slodkiwawel.pl/kolekcje/mieszanka-krakowska,24) | `src/data/shopping.js` |
| Żabka Nano | 可用 Żappka App 綁卡掃碼，或感應支付卡入店。首次感應卡入店須輸入電話與簡訊碼；每次入店暫扣 15 PLN，之後結算實際採買。台灣門號可否驗證未核實，移除「多半收得到」；區分一般有人門市與 Nano 入店流程。[Nano 官方使用說明](https://nano.zabka.pl/) | `src/data/shopping.js` |

## 查核狀態與未確認項目

- Muga 僅確認菜單、費用及地址，完整營業時間未重現；Bottiglieria 官網未公布關門時間。兩店均為 `partial`，仍屬候選，沒有新增每日餐位或代為訂位。
- Pierożki u Vincenta：可讀訂餐頁列 Lea 114，但混入無關博弈內容、評論資料亦偏舊，不能用來保證現行分店。[可讀訂餐頁](https://pierozkiuvincenta.pl/)。移除主檔的 Bronisławy 限定導航與 Kazimierz「順路必吃」斷言，改為城市內店名搜尋，保留 `pending`，採用前須確認實體分店。
- 既有已安排餐廳、Specjały／Pyzy 的部分查證、其他未採用候選及待查門市，均未因本次修正而假定營業、已訂位或不存在。
- 9 月歷史研究與計畫文件保留原樣；本日修正以現行 `src/data` 為準。

## 驗證與整合要求

本分項實跑結果：4 個來源檔語法檢查通過；`node --test tests/dining-connectivity.test.mjs tests/groceries.test.mjs` 為 21 通過、0 失敗；`git diff --check` 通過。測試使用現有生成頁，本分項未重建。

全站重建、完整測試、頁面渲染及推送由整合流程執行。須在整合時同步 Day 4 的 Pierożki u Vincenta 提示，避免主行程仍稱 Kazimierz。

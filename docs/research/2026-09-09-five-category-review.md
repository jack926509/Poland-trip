# 2026-09-09 五大分類複查：飯店／交通／美食／景點／伴手禮

- 複查日期：2026-09-09（Asia/Taipei）
- 觸發原因：使用者告知**飯店有更動**，要求逐項查明並補充、更新旅遊資料。
- 範圍：`src/data/*.js` 全部資料源、`docs/` 既有查核紀錄、產出頁與測試。
- 網路限制：本次工作環境的對外連線只放行搜尋，飯店官網、PKP Intercity、KOLEO 等第一方網站
  皆被 egress proxy 阻擋（`EGRESS_BLOCKED`）。因此**沒有**重新做第一方逐頁查證；
  下列標為「本次查得」的資訊來自公開搜尋結果，已在資料中同時寫入「出發前以官方頁面為準」的提醒。

## 1. 飯店

### 異動內容
| 期間 | 原資料 | 現行資料 |
| --- | --- | --- |
| 10/24–10/25 | ibis budget Warszawa Reduta（Bitwy Warszawskiej 16 A，鄰 Warszawa Zachodnia） | **Hotel Metropol**（ul. Marszałkowska 99a，鄰 Warszawa Centralna／Metro Centrum） |
| 10/29–10/31 | Hotel Metropol | Hotel Metropol（未變） |

住宿仍為 5 筆訂單、7 晚，日期連續無空窗：10/24–25、10/25–27、10/27–28、10/28–29、10/29–31。

### 全站殘留檢查（已查明）
- `src/`、`tests/`、根目錄單檔版與 `dist/` 皆已無 `Reduta`／`West Station`／`Bitwy Warszawskiej`／`warsaw-reduta`。
- `tests/build.test.mjs` 另有兩道守門測試，確保 `stay` 與 Day 1 頁面不得再出現舊飯店名。
- 唯二殘留在 `docs/research/` 的兩份歷史查核紀錄；本次於
  `2026-08-10-confirmed-hotel-addresses.md` 頂部加上異動聲明，保留歷史但標明失效。
- 地圖圖釘：華沙 15／克拉科夫 21／樂斯拉夫 9／波茲南 8＝**53**（西站飯店圖釘已移除）。
  `docs/資料校正表.md` 原記「16／20／10／9，合計 55」為過時數字，本次一併更正。

### 本次補上的資料
- 兩段 Hotel Metropol 補入 `checkInTime` 15:00、`checkOutTime` 12:00，並註明櫃檯可寄放行李。
- 第一段住宿說明改寫為飯店位置導向（Metro Centrum 出口對面、距 Warszawa Centralna 約 500 公尺）。

## 2. 交通

- **Day 1 進城**：SKM S2／S3 皆停 **Warszawa Śródmieście**（機場約 22–30 分），出站即 Metro Centrum、
  飯店在對街。原本只寫「SKM 進城」，未指定下車站，已補上。
- **Day 2 上車站**：現行班表 EIP 5300 先停 Warszawa Centralna（約 08:40）再停 Zachodnia（約 08:45）。
  住宿改到 Centralna 旁之後，原本「由飯店叫車去西站」的建議已不合理，改為：
  以票面上車站為準，優先比較由 Centralna 上車（步行 500 公尺）；若票面仍是西站，
  由 Centralna 轉 SKM／KM 約 7–10 分。10/25 換表後仍須重新核實停靠站。
- **預售日敘述矛盾**：`railPurchaseSteps` 原寫「10/29 的提醒日是 9/29」，
  與 2026-09-08 逐班查核所得的 EIC 8104 預售起始日 9/25 不一致，已改寫為引用實際查核結果。
- 四段規劃班次的時刻、預售日、查核日維持 2026-09-08 的查核值，本次未更動。

## 3. 美食

- **補上 Day 6 缺口**：10/29 EIC 8104 約 20:00 抵 Warszawa Centralna，原行程到此結束、沒有晚餐安排。
  已新增 20:30 晚餐步驟與備案：車站對面 Złote Tarasy（一–六約至 22:00、日至 21:00）
  或步行 10–15 分的 Hala Koszyki 美食大廳（公告營業至凌晨 1:00），並保留「當日確認個別店家營業與訂位」。
- 米其林／Bib 名單、`verifiedRestaurantHours` 四筆已查證營業時間本次未更動。
- 附帶記錄：Bib Gourmand 的 WANDAL 就位於 Złote Tarasy，是本次換飯店後步行可達的餐廳。

## 4. 景點

- **蕭邦博物館**由「2026 整年閉館（待再確認）」升級為明確資訊：
  蕭邦研究所公告 2026-01-01 至 12-31 全年整修閉館、預計 2027 年 1 月配合蕭邦鋼琴大賽百年重開，
  期間售票處移至隔壁 Tamka 43。Day 7 的提醒文字同步改寫，不再列為待查事項。
- 其餘票價與開放時間（皇家城堡、Wawel、辛德勒工廠、鹽礦、奧斯威辛、百年廳、全景畫、
  可頌博物館、古市政廳整修閉館等）維持 2026-08-11／08-12 的官網查核值；
  本次因無法連線第一方網站，未做重新查證，動態價格仍標示「出發前以官方售票頁為準」。

## 5. 伴手禮

- 新增 `souvenirShops` 一筆：**Złote Tarasy（中央車站對面）**，距 Hotel Metropol 約 500 公尺，
  作為 Day 8 出發前補買的順路點；同步改寫 Day 8「紀念品最後採買」備案，
  把機場店由首選降為最後備案（價差約 +10–15%）。
- 琥珀、Bolesławiec 陶器、Wedel、Prince Polo、oscypek 檢疫提醒等內容未變動。

## 尚待第一方查證（本次環境無法完成）

1. EIP 5300 在 **10/25 新班表**後的實際停靠站與時刻（Centralna 是否仍停）。
2. 四段城際車開賣後的實際票價、車廂與座位。
3. Hotel Metropol 入住／退房時間與行李寄放，以訂房確認為最終依據。
4. Złote Tarasy、Hala Koszyki 個別店家 10/29、10/31 當日營業時間。

---

## 追加（同日）：定位連結全面補齊與小吃／咖啡廳新增

使用者追加三項要求，處理如下。

### 1. 順路必吃要確實與 Google Maps 連結

盤點 8 天的 `days[].eat`，原本 15 筆中有 2 筆沒有連結，因為它們刻意沒有固定店址：

| 項目 | 原狀 | 處理 |
| --- | --- | --- |
| Obwarzanek 圓圈麵包（Day 2） | 街邊推車，無固定店址 | 連到推車最密集的中央廣場一帶，說明寫明非固定店址 |
| Rogal Świętomarciński（Day 6） | 認證店家眾多、未選定分店 | 先連到示範分店 Cukiernia Kandulski，並註明選定分店後改導航 |

另補上 Day 3（奧斯威辛日）原本完全沒有的必吃清單兩筆。現在 8 天共 **17 筆，全數有連結**。

### 2. 所有景點、餐廳都要有定位

盤點結果與處理：

| 資料 | 筆數 | 原本缺定位 | 處理 |
| --- | --- | --- | --- |
| `fares`（景點票價） | 21 | 0 | — |
| `cityDining`（城市餐廳） | 58 | 0 | — |
| `cityFood`（主餐廳） | 37 | 0 | 4 筆「A / B」合併卡本來就用 `maps` 陣列各給一條 |
| `foodBackup`（備案餐廳） | 32 | 0 | — |
| `michelinReservations`（訂位表） | 9 | **9** | 全數補 `mapUrl`，訂位頁改成可點店名＋定位連結 |
| `verifiedRestaurantHours`（已查時間） | 4 | **4** | 全數補 `mapUrl` |
| `souvenirShops`／`luxuryShopping` | 8／2 | 0 | — |
| 每日 `backup`／`extend` | 22 | **全部** | 屬於具體地點的 17 筆補上定位；5 筆純排程建議（例如「改訂 18:30 最後入場」）不加，因為那不是地點 |

### 3. 新增小吃與咖啡廳推薦

新增 `snacksAndCafes`（`src/data/dining.js`），四城共 18 筆：

- **華沙 5**：Bar Mleczny Prasowy、Bar Mleczny Bambino、A. Blikle 1869、Cukiernia Zagoździński、Hala Koszyki
- **克拉科夫 5**：Bar Mleczny Pod Temidą、Endzior（Plac Nowy 圓亭）、Karma Coffee Roasters、Café Camelot、Cukiernia Michałek
- **樂斯拉夫 4**：Bar Mleczny Miś、Cukiernia Vincent、Konspira、Browar Stu Mostów
- **波茲南 4**：Cukiernia Kandulski、Pyra Bar、Weranda Caffe、E.Wedel Pijalnia（Stary Rynek）

每筆都有 `map` 定位與 `hours` 欄位。營業時間只寫查得到公開來源的（Bambino、Karma、Miś、Hala Koszyki），
其餘一律標「依店家當日公告」，不以推測填時間。城市頁新增「小吃 · 牛奶吧 · 咖啡廳」區塊，
並納入全站搜尋索引（可用「牛奶吧」「咖啡廳」「小吃」搜尋）。

已知需要現場確認的點：Bar Mleczny Bambino 的門牌有 Hoża 19 與 Krucza 21 兩種公開說法，
資料中已註明並用店名搜尋連結；Bar Mleczny Miś 週日公休，本行程 10/28（三）不受影響。

### 守門測試

新增 `tests/map-links.test.mjs`，五項測試涵蓋上述三件事，日後少了任何一個定位都會讓 `npm test` 失敗。

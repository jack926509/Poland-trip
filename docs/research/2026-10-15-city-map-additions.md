# 2026-10-15 城市地圖補點：行程餐廳、咖啡甜點、採點景點

## 範圍

- 每日時間表已排入（`planStatus: 'scheduled'`）的四城餐廳：機場與 Wieliczka 鎮上不在城市地圖內。
- 餐飲指南「咖啡與甜點」一節的 23 家。
- 10/24、10/28、10/29、10/30 採點行程裡有名稱的景點、紀念碑、廣場與橋。
- 每座城市的主車站。

城市地圖由 47 個點增為 140 個：華沙 52、克拉科夫 29、樂斯拉夫 34、波茲南 25。

## 座標來源與查證狀態

| 類型 | 點數 | 狀態 | 說明 |
|---|---|---|---|
| 每日地圖既有錨點 | 16 | coordinate-verified | 直接沿用 `day-maps.js` 的座標與 OSM 來源，狀態比照每日地圖（2026-09-08） |
| 網路搜尋取得 | 77 | unverified | 本環境連不到 Nominatim、Wikipedia、店家官網（代理 403／DNS 失敗），只能從搜尋結果裡的店家頁、Tripadvisor／Wolt 結構化資料、Wikipedia 座標摘要取得 |

每一點的來源寫在 `src/data/cities.js` 的 `cityMapAdditions`（`coordinateSource`）。
unverified 的圖釘彈窗會註明「約略位置：座標取自公開地圖資料、未逐點比對，導航以 Google Maps 為準」。

只有建物或範圍代表點、不是店門口的：

- Soul Kitchen（Nowogrodzka 18A 建物）、QQ Warsaw（Żurawia 32/34 建物）、Charlotte Złota（Złota 83 建物）
- Cukiernia Kandulski：Plac Cyryla Ratajskiego 廣場中心，距店約 50–70 m
- 瓦津基公園、薩克森花園、自由廣場、Chwaliszewo 街等面狀地點

已捨棄的來源：

- latitude.to：華沙總統府、聖若望大教堂、齊格蒙特圓柱都偏 600–700 m。
- 其他捨棄的點：aroundus 的 MSN 經度（落在中央車站以西）、AXI IMMO 的 Żurawia 32/34、Restaurant Guru 的 LAGACCA 舊址。

## 搜尋時順帶發現、需要出發前再看的事

- **A. Blikle**
  - Wolt、TableJourney、In Your Pocket 都把門市寫成 Nowy Świat 33，另有資料說它在 2017 年底由 35 號遷入；專案原記錄是「甜點店 35、咖啡館 33」，兩門相鄰約 20 m。
  - 2026 年有新聞提到店面租金欠款與市府協商分期。
  - 已寫入 `dining-places.js` 的查核紀錄。
- **Carla Trattoria Moderna**：menu.pl 外送頁顯示「zamknięte」，但這可能只是外送平台當下的狀態。Dynks 的〈Ciao, Carla!〉是開幕介紹，不是停業公告；visitpoznan.pl 仍列在 2025 新開餐廳。行程維持不變，訂位時順便確認。
- **Dessert Boutique**：舊的 Tripadvisor／MapQuest 快照曾標「已停業」，官網與 Wolt 仍有營業時間。
- **Cukiernia Michałek**：lovekrakow.pl 報導創辦人過世、由子女接手，去之前看一下最新評論。
- **Pimiento**：主檔 Google Maps 商家點與 Tripadvisor 相差約 145 m，採 Google 商家點。

## 介面

- 新分類「咖啡／甜點／麵包」。
- 城市地圖圖例只列本城有的分類並附數量，兼作篩選鈕：點一下隱藏該類圖釘，再點一下顯示。
- 「其他行程餐廳的導航連結」改以 placeId 比對；已有圖釘的店不再重複列出。

# 🇵🇱 2026年波蘭旅遊規劃

> 一份給台灣旅人的波蘭四城旅行控制台。整合權威旅遊資料來源，涵蓋華沙、克拉科夫、樂斯拉夫、波茲南的 10/24–10/31 個人化 8 日行程、美食、交通、住宿、訂票與備案。

---

## 站台架構

這份指南有**三個並行版本**，依裝置自動分流：

| 版本 | 入口 | 適用情境 | 技術 |
|---|---|---|---|
| 經典雜誌版 | `index.html` | 完整田野指南 / SEO 主頁 | 純 HTML + CSS + 原生 JS |
| **A · 桌機雜誌版** | `desktop.html` | 出發前在電腦上閱覽 | React 18 + `redesign/A-magazine.*` |
| **B · 手機旅伴版** | `mobile.html` | 出門帶著看（Today = Day X） | React 18 + `redesign/B-companion.*` |
| **C · iOS App 預覽** | `app-preview.html` | 未來 App 樣貌的設計稿 | React 18 + `redesign/C-app.*` |

### 自動分流邏輯

`index.html` 開頭內嵌一段 device redirect script：

- 手機（≤ 640px 或 UA 含 iPhone / Android Mobile）→ 自動跳 `mobile.html`
- 桌機 → 自動跳 `desktop.html`
- 加上 `?classic=1` → 強制停留在經典版（會記到 sessionStorage）

### 共用資料

四個版本的行程資料由 `redesign/data.js` 提供（`window.TRIP`），三個 React 版本共享同一份來源，所以更新一次三處同步。

---

## 離線與 PWA

`sw.js` 是 Service Worker（目前 `polska-v10`），在 `main.js` 載入後註冊：

- **HTML**：network-first，失敗回快取（出國當地無 Wi-Fi 仍可看舊版）
- **同源資源（CSS / JS / 圖片）**：cache-first + 背景更新
- **第三方（Google Fonts 等）**：stale-while-revalidate
- 內容有更新時跳出「📖 指南有新內容可用」banner，由使用者決定何時切換（不自動 `skipWaiting`）

`manifest.json` 提供 PWA 安裝資訊（紅白雙色 icon、`#a8231d` theme），iOS / Android 可加到主畫面當 App 用。

---

## 開發與建置

### 修改純 HTML / CSS / JS

直接編輯 `index.html`、`styles.css`、`main.js` 即可，無需建置步驟。

### 修改 React 三版本（A / B / C）

原始碼在 `redesign/*.jsx`，編譯後輸出到 `redesign/dist/*.js`：

```bash
./build.sh
# 釘版 esbuild@0.24.0，避免跨日跳號導致輸出飄移
```

腳本會處理：`A-magazine.jsx`、`B-companion.jsx`、`C-app.jsx`、`ios-frame.jsx`、`tweaks-panel.jsx`。

### 更新行程資料

只改 `redesign/data.js`（`window.TRIP.days[]`），三個 React 版本立即同步；經典版 `index.html` 是手寫，需另外調整。

### 更新 Service Worker

修改 `sw.js` 時記得提升 `CACHE_VERSION`（如 `polska-v10` → `polska-v11`），舊快取會在啟用時清除，並讓使用者看到更新提示。

### 部署

`main` 推送後由 `.github/workflows/deploy.yml` 自動部署到 GitHub Pages（`actions/upload-pages-artifact@v3` + `actions/deploy-pages@v4`），不需要手動 build。

---

## 檔案結構

```
Poland-trip/
├── index.html              經典雜誌版（1746 行，SEO 主頁）
├── styles.css              經典版樣式
├── main.js                 經典版互動 + Service Worker 註冊
├── desktop.html            A · 桌機雜誌版入口
├── mobile.html             B · 手機旅伴版入口
├── app-preview.html        C · iOS App 預覽入口
├── sw.js                   Service Worker（離線快取）
├── manifest.json           PWA manifest
├── build.sh                esbuild JSX → dist 編譯腳本
├── apple-touch-icon.png    iOS 桌面圖示
├── og-image.svg            Open Graph 分享圖
├── sitemap.xml / robots.txt
├── redesign/
│   ├── data.js             ★ 三版本共用行程資料（window.TRIP）
│   ├── tokens.css          設計 token（顏色 / 字級）
│   ├── A-magazine.{jsx,css}    桌機雜誌版 React
│   ├── B-companion.{jsx,css}   手機旅伴版 React
│   ├── C-app.{jsx,css}         iOS App 預覽 React
│   ├── ios-frame.jsx       iOS 裝置外框
│   ├── tweaks-panel.jsx    設計微調面板
│   └── dist/               build.sh 編譯產物
├── vendor/
│   ├── react.production.min.js
│   └── react-dom.production.min.js
└── .github/workflows/deploy.yml    GitHub Pages 自動部署
```

---

## 內容章節（經典版 / 桌機雜誌版）

| # | 章節 | 內容重點 |
|---|------|---------|
| 01 | 關於波蘭 | 速覽資料、ETIAS 2026 重要更新 |
| 02 | 四城角色 | 華沙、克拉科夫、樂斯拉夫、波茲南 |
| 03 | 波蘭美食 | 12 道必嘗料理 + Bar Mleczny 牛奶吧提示 + 四城專屬料理對照表 |
| 04 | 人文歷史 | 966 基督化 → 1989 團結工聯 → 第三共和 |
| 05 | 氣候天氣 | 四季氣溫、最佳旅遊月份 |
| 06 | 交通指南 | 火車、巴士、城內交通、必備 App、城際時間票價表 |
| 07 | 住宿區域 | 各城市建議住宿區與房價區間 |
| 08 | 門票價格 | 主要景點成人全票一覽 |
| 09 | 節慶日曆 | 國定假日、避坑日、追節活動 |
| 10 | 購物與語言 | 必買伴手禮、Tax Free、波蘭語生存包 |
| 11 | 鄰國延伸 | 柏林、布拉格、布達佩斯、維爾紐斯 |
| 12 | 安全與緊急 | 緊急電話、駐波蘭代表處、觀光陷阱、在地禮儀 |
| 13 | 本次航班 | 台北 ↔ 華沙（國泰 + 卡達 + 長榮）|
| 14 | 8 日行程 | 四城深度路線：路線地圖 + 火車一覽 + 逐時刻表 + 必吃美食 + 訂票時程 |

---

## 本次旅行概要

- **日期**：2026/10/23（四）– 11/1（日）
- **航空**：去程 國泰 CX 479 + 卡達 QR 815 / QR 259；回程 卡達 QR 260 / QR 818 + 長榮 BR 872
- **轉機點**：香港 HKG · 多哈 DOH
- **寄艙行李**：每人 25 kg
- **在地時間**：10/24（六）13:30 抵 WAW – 10/31（六）14:40 離 WAW，共 7 晚 8 天

---

## 8 日四城行程

### 路線概覽

四城深度路線，避開「抵達當天搭火車」「時差未消去 Auschwitz」「行李集中最後一天」三大陷阱：

| 城市 | 晚數 | 主要行程 |
|---|---|---|
| 華沙 Warszawa | 1 晚（Day 1） | 抵達日老城散步、倒時差 |
| 克拉科夫 Kraków | 2 晚（Day 2-3） | 老城三大景點 + Auschwitz + 辛德勒工廠 + Kazimierz |
| 樂斯拉夫 Wrocław | 1 晚（Day 5） | 700 小矮人 + 百年廳 + 全景畫 + 座堂島煤氣燈點燈 |
| 波茲南 Poznań | 1 晚（Day 6） | 教堂島 + 12:00 山羊鐘樓秀 + 聖馬丁牛角麵包 |
| 華沙 Warszawa | 2 晚（Day 6-7） | POLIN + 起義博物館 + 皇家城堡 + 離境準備 |

**晚數分配**：WAW(1) + KRK(2) + WRO(1) + POZ(1) + WAW(2) = **7 晚**

### 規劃重點

| 常見陷阱 | 此行程的安排 |
|---|---|
| 抵達當天直奔克拉科夫 | Day 1 直接住華沙倒時差 |
| 時差未消當天去 Auschwitz | Day 3 已恢復狀態才去 |
| 鹽礦與 Auschwitz 兩個沉重景點疊加 | 改為 Auschwitz + 樂斯拉夫 + 波茲南三城多元體驗 |
| 行李集中在最後一天搬 | 5 段火車分散搬運壓力 |

### 5 段跨城火車

```
Day 2  WAW → KRK   EIP Pendolino  09:00 → 11:25  (2h25)
Day 3  KRK ⇄ Auschwitz             Lajkonik 巴士  (1h30 × 2)
Day 4  KRK → WRO   IC               17:30 → 21:00  (3h30)
Day 5  WRO → POZ   IC               19:00 → 21:20  (2h20)
Day 6  POZ → WAW   EIP              17:30 → 19:50  (2h20)
```

完整逐時刻表、訂票時程、住宿區建議、注意事項詳見 **[index.html § 14](https://trip.xieh.tw/#itinerary)**。

### 四城必吃美食精選

| 城市 | 招牌料理 | 推薦店家 |
|---|---|---|
| 華沙 | Pierogi · Żurek · Wedel 熱巧克力 | Zapiecek / U Fukiera / E. Wedel Pijalnia |
| 克拉科夫 | Obwarzanek (PGI) · Zapiekanka · Sernik · 米其林 | 街頭藍車 / Plac Nowy 圓亭 / Szara Gęś |
| 樂斯拉夫 | Śląskie kluski · Rolada śląska · 精釀啤酒 | Konspira / Browar Stu Mostów |
| 波茲南 | Rogal Świętomarciński (PGI) · Pyry z gzikiem | Cukiernia Kandulski / Pyra Bar |

完整 4 城專屬料理對照表詳見 **[index.html § 3](https://trip.xieh.tw/#food)**。

---

## 每日大致安排

| Day | 日期 | 城市 | 重點安排 |
|---|---|---|---|
| 1 | 10/24（六） | 華沙 | 13:30 抵 WAW · SKM 進城 · 老城散步、克拉科夫郊區大街 · 倒時差早睡 |
| 2 | 10/25（日） | 華沙 → 克拉科夫 | 09:00 EIP Pendolino 南下（2h25）· 下午 Wawel 城堡 + 老城廣場 · 17:30 辛德勒工廠最後入場 · Kazimierz Plac Nowy 晚餐 |
| 3 | 10/26（一） | 克拉科夫 ⇄ Auschwitz | Lajkonik 巴士來回 · 全天奧斯威辛 · 傍晚安靜晚餐沉澱情緒 |
| 4 | 10/27（二） | 克拉科夫 → 樂斯拉夫 | 上午 Wieliczka 鹽礦英文團（2.5h）· 下午 Kazimierz 白天補拍 + 紡織會館採購 · 17:30 IC 北上（3h30）|
| 5 | 10/28（三） | 樂斯拉夫 → 波茲南 | 上午 700 小矮人尋寶 + 全景畫 · 13:00 出發百年廳 · 傍晚座堂島煤氣燈 · 19:00 IC 北上（2h20）|
| 6 | 10/29（四） | 波茲南 → 華沙 | 上午教堂島 + 12:00 山羊鐘樓秀 · 下午聖馬丁牛角麵包 · 17:30 EIP 東返（2h20）|
| 7 | 10/30（五） | 華沙 | POLIN 猶太博物館 · 起義博物館 · 皇家城堡 · 老城晚餐 + 自由漫步 |
| 8 | 10/31（六） | 華沙 → 桃園 | 上午購物或補景點 · 14:40 起飛 · 11/01（日）抵桃園 |

完整逐日時刻表、訂票連結、住宿區建議：**[線上版](https://trip.xieh.tw/#itinerary)**。

---

## 資料來源

- 中華民國外交部領事事務局
- 駐波蘭台北代表處
- 波蘭臺北辦事處（Polish Office in Taipei）
- PKP Intercity 官方（intercity.pl）
- visit.auschwitz.org 官方預約
- mhk.pl/en（辛德勒工廠）
- talkpolish.com、saltinourhair.com、insightvacations.com 等旅遊權威

## 授權

內容為旅遊資訊整理，圖文僅供旅遊規劃參考。

---

最後更新：2026-05-19

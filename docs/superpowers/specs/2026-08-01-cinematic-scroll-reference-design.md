# 電影感捲動參考頁（Cinematic Scroll Reference）設計文件

- 日期：2026-08-01（Asia/Taipei）
- 狀態：待使用者複核
- 目標讀者：非工程師的專案擁有者 + 後續實作 agent

---

## 1. 這是什麼、為什麼要做

使用者想改善 POLSKA 波蘭行程網站的網頁版 UX/UI，並提供了一份外部參考規格
（Mostar 電影感捲動頁，逐值精確的建置規格，含所有座標、CSS 變數、JS 動畫數學）。

**本專案的目的不是上線新功能，而是產出一個可以親眼比較的決策素材：**
先用波蘭自己的內容跑一遍這套捲動編排，讓使用者看到「我的行程站長這樣會如何」，
再決定要不要、以及要移植哪些手法到正式站。

因此本頁是**參考頁（reference）**，不是產品頁。

---

## 2. 範圍界線（硬性）

### 2.1 絕對不動正式站

- 新增內容全部隔離在 `reference/cinematic-scroll/`。
- 不 import 專案任何檔案，也不被任何檔案 import。
- **部署隔離已驗證**：`prepare-site.sh` 採逐檔白名單 `cp`（見 `prepare-site.sh:19-36`），
  不是整包掃描，因此新資料夾不可能被帶進 Cloudflare / GitHub Pages 輸出。
- 不修改 `sw.js`、`manifest.json`、`sitemap.xml`、`index.html`、`mobile.html`、`desktop.html`。
- 不修改 Service Worker 快取版本號。

### 2.2 不是本次範圍

- 不改正式站任何一行樣式或行為。
- 不做離線化、不做效能優化（本頁本來就重，見 §6）。
- 不做 A/B 上線、不做網址對外發布。

---

## 3. 什麼照抄、什麼換成波蘭

這是本文件最重要的一節。

### 3.1 逐值照抄（引擎層，不得擅改）

以下一律照使用者提供的規格原文實作，**包含所有數字、`.toFixed` 位數、
z-index、DOM 來源順序、媒體查詢斷點**：

- `:root` 全部 CSS 自訂屬性初始值
- 每個元素的定位、尺寸、transform、transform-origin、filter
- JS 動畫引擎：`clamp` / `smoothstep` / `lerp` / `segmentInOut` / `getScrollDistance`
- 每幀 `update()` 的所有中間變數與所有 CSS 變數寫入公式
- 無限輪播的三組 clone + 即時跳轉正規化邏輯
- 三個媒體查詢與 `prefers-reduced-motion` 區塊
- 捲動總高 `calc(100vh + 3700px)`、`.stage` sticky 行為

**實作紀律**：若照抄後某處視覺看起來怪，**照抄結果保留、寫進回報**，
由使用者決定改不改。實作者不得自行「順手修正」。

### 3.2 場景圖層維持 Mostar（硬限制，非選擇）

七張 `img.scene-img` 場景圖**必須沿用原始遠端 PNG**：

| 圖層 | 為什麼不能換 |
|---|---|
| sky / back-four / back-bazaar / splitframe-left / splitframe-right / bridge | 這些是**透明去背的分層插畫**。整套視差深度靠透明邊緣互相疊合；splitframe 左右兩半更是必須能對稱分開。專案內的 `assets/photos/*.webp` 是**矩形**旅遊照，放進去會露出硬邊方框，視差與分層效果直接失效。 |

例外見 §3.3 第 6 項（`frame-two-img` 可換，因為它是全幅置中淡入，不依賴透明邊緣）。

### 3.3 換成波蘭（內容層）

資料來源：`redesign/data.js`（`window.TRIP`，625 行，含 8 天行程、4 城市、
`meta.route`、`meta.dateRange`）與 `assets/photos/`。

| # | 位置 | Mostar 原值 | 換成 |
|---|---|---|---|
| 1 | `<title>` | `Mostar city` | `POLSKA — 2026 波蘭行程` |
| 2 | `meta[name=description]` | Mostar 敘述 | 波蘭行程對應敘述 |
| 3 | `.site-logo` | `Bosnia and Herzegovina` | `Poland · POLSKA 2026` |
| 4 | `.site-nav` 四項 | Intro / Bridge / Bazaar / Routes | Intro / Warszawa / Kraków / Routes（**錨點 id 維持 `#cinema` `#bridge` `#bazaar` `#routes` 不變**，避免動到 CSS 選擇器） |
| 5 | `.hero-title` | `MOSTAR` | `POLSKA` |
| 6 | `.frame-two-img` | 遠端河景特寫 PNG | `assets/photos/krakow-hero.webp`（相對路徑引用）。理由：此層為全幅置中淡入，不依賴透明邊緣。 |
| 7 | `.intro-copy p` | Mostar 敘述 | 依 `TRIP.meta.route` / `.style` 改寫的一句話 |
| 8 | `.hero-tags` 三顆藥丸 | Old Bridge / Neretva River / UNESCO old city | `8 天 4 城` / `2026.10.24–10.31` / `UNESCO 老城` |
| 9 | 5 張 `.sight-card` | Mostar 五景點 | 波蘭五景點，取自 `data.js` 實際行程（kicker / h3 / p / aria-label 全換） |
| 10 | 3 個 `.sight-pin` 圖示 | 遠端 cutout PNG | `assets/photos/{warszawa,krakow,wroclaw}-thumb.webp` |
| 11 | `.story-panel-bridge` | 橋的文案 + `1566` / `2005` | 華沙老城主題文案 + 兩組年份事實 |
| 12 | `.story-panel-bazaar` | 市集文案 + `Open old town notes` | 克拉科夫舊城主題文案 + `開啟舊城筆記` |

### 3.4 文案撰寫規則（第 7、9、11、12 項）

上表中「改寫」的四處文案，實作者**必須先讀 `redesign/data.js`** 再下筆，規則如下：

- 五張景點卡的地名，**只能**取自 `data.js` 內實際出現的行程地點，不得自行發明。
- 每張卡的欄位長度須與原規格相當（kicker 2–4 字、h3 單行不超出、p 兩行內），
  超出會被 CSS 的 `-webkit-line-clamp:2` 與 `text-overflow:ellipsis` 截掉。
- 文案語氣比照原規格：平實敘述，不用行銷腔、不用驚嘆號。
- 全部須通過 §5.6 的中文檢查。

### 3.5 必要偏離（唯一一處，須明確標註在程式碼註解）

`.sight-pin` 規格為 `width:67.2px; height:67.2px`（正方）。
專案的 thumb 為**矩形** webp，直接套用會被壓扁。
因此 `.sight-pin` **加上** `object-fit: cover; border-radius: 12px;`。

這是全案唯一允許的樣式偏離，其餘一律照抄。

### 3.6 配色：本階段不動

`#fdf1e1` 奶油色與 `74,181,224` 藍色遮罩是與場景圖一起調過的，
換成波蘭 tokens（`--paper:#f4ecd8` / `--crimson:#a8231d`）會與藍色遮罩打架。

**本階段維持 Mostar 原配色。** 波蘭配色版列為後續選項，
待使用者看過第一版實際效果後再決定，不在本次交付內。

---

## 4. 檔案結構

```
reference/cinematic-scroll/
├── index.html      原生 HTML，DOM 來源順序照規格
├── styles.css      所有樣式，含 :root 與三組媒體查詢
├── script.js       動畫引擎，defer 載入
└── README.md       這頁是什麼、怎麼開、已知限制
```

- 純原生，無框架、無建置步驟、無 npm 相依。
- 場景圖與字型走遠端 CDN；波蘭照片走相對路徑 `../../assets/photos/`。

---

## 5. 驗收條件（可機械檢查，由 fresh-context agent 執行，禁止自驗）

### 5.1 部署隔離

- `./prepare-site.sh <空目錄>` 執行成功，且輸出目錄中**不存在** `reference/`。
- `git status` 顯示正式站檔案（`index.html`、`sw.js`、`manifest.json`、
  `mobile.html`、`desktop.html`、`styles.css`、`main.js`）**零改動**。

### 5.2 渲染與編排（headless Chrome 實跑，非目視程式碼）

捲到以下 8 個位置各截圖一張，逐項對照規格 §9 編排說明：

| scrollY | 應觀察到 |
|---|---|
| 0 | `POLSKA` 大標完整、intro 段落與三顆藥丸可見 |
| 650 | 大標已淡出（`--title-opacity` ≈ 0），intro 已下沉淡出 |
| 1100 | 橋變寬、splitframe 左右分開中、模糊與藍色遮罩上升 |
| 1620 | 橋已上飛消失、華沙面板可見 |
| 2200 | 華沙面板退場中 |
| 2700 | 克拉科夫面板可見、`開啟舊城筆記` 藥丸可見 |
| 3200 | 景點卡滑入中 |
| 3700 | 五張卡與左右圓鈕就位、圓鈕可點 |

### 5.3 公式正確性（抽驗計算後的值，不是讀原始碼）

在指定 scrollY 下讀 `getComputedStyle(document.documentElement)`，比對：

- scrollY=1620 時 `--bridge-width` 應為 `105vw`（`67.2 + 1 × 37.8`）
- scrollY=0 時 `--back-scale` 應為 `0.76`
- scrollY=3700 時 `--sights-visibility` 應為 `visible`
- `prefers-reduced-motion` 模擬開啟時，`--mx` 與 `--my` 應為 `0`

### 5.4 資產載入

- **6 張遠端場景圖**（`frame-two` 已換本地，見 §3.3 第 6 項）
  \+ 1 個遠端字型
  \+ **4 張本地 webp**（`krakow-hero` 作 frame-two；3 張 thumb 作 pin），
  以 `performance.getEntriesByType('resource')` 確認**全部** HTTP 200 且非零位元組。
- 主控台無 error 等級訊息。

### 5.5 輪播

- 連按 `→` 8 次，不出現空白區塊，且卡片內容循環回到第一張。
- 連按 `←` 8 次，同上。

### 5.6 內容正確性

- 全頁**無簡體字**。
- 中文與英文／數字之間有半形空格。
- 頁面上不出現 `Mostar`、`Stari Most`、`Kujundziluk`、`Neretva`、
  `Bosnia` 等波士尼亞專有名詞（場景圖本身除外，那是圖不是字）。
- 五張景點卡的地名與 `redesign/data.js` 內的行程一致，非虛構。

### 5.7 事實查核（重要）

story-panel 的年份事實（如 UNESCO 登錄年份）**必須查證後才寫入**，
不得憑印象填。查不到就改用 `data.js` 內確定的行程數字（如 `8 天` / `4 城`）。

---

## 6. 已知限制（先揭露，非做完才說）

1. **頁面總重約 32.3 MB**（6 張遠端場景 PNG 合計約 32.2 MB、本地圖約 79 KB，
   2026-08-03 實測）。單是天空 PNG 就 8.3 MB、橋 2.8 MB。
   這是來源規格決定的，不是實作缺陷。慢速網路首次載入會很久。
2. **遠端資產不受控**。`raft-blast-61784561.figma.site` 是第三方網站的資產，
   對方改版即失效。2026-08-01 實測全部 HTTP 200，但**不保證未來可用**。
   本頁定位為短期參考素材，不適合當長期資產。
3. **不可離線**。與正式站的 PWA 離線能力相反，本頁斷網即空白。
   這正是不該把整套原樣搬上正式站的主要理由。
4. **場景仍是波士尼亞的橋與市集**。內容層是波蘭，圖層是 Mostar。
   使用者看的是「編排手法」，不是「成品長相」。

---

## 7. 後續（不在本次範圍）

看過第一版後，使用者可決定：

- 是否要波蘭配色版（`tokens.css` 的 paper/crimson）。
- 是否值得為正式站產製波蘭的**透明去背分層圖**（這是讓效果真正屬於波蘭的唯一途徑，
  需要影像處理工作量，屆時另開案）。
- 哪些單項手法（sticky 舞台、指標視差、無限輪播、藥丸標籤）值得單獨移植。

# 桌機版電影感改版 — 規格書

- 日期：2026-08-04（台北時間）
- 狀態：待使用者審閱
- 範圍：**只改桌機版**。手機版（`mobile.html` 與 `redesign/B-companion.*`）不在本次改動範圍，外觀與行為不得因本次改動而改變。載入重量原則上不變；唯一例外是 `index.html:83-89` 新增的 `desktop/cinema.js`（見 §7）——手機也會下載這個檔案，但必須是純函式定義、載入時零副作用、大小有明訂上限（見 §7、§9）。

---

## 1. 要做什麼（一句話）

把桌機版從現在的「紅白復古報紙、點按切章節」改成「深色電影感捲動」：開場是滿版城市照與大標題，往下捲依序推進華沙 → 克拉科夫 → 樂斯拉夫 → 波茲南四城，再落進清楚可讀的實用段；**所有既有實用內容（逐日行程、交通、門票、城市、實用資訊、關於波蘭）與「❗尚未訂」提醒一字不減**。

## 2. 為什麼

使用者看到一份電影感捲動的參考頁後要求正式站改成同樣質感。本次已用可捲動原型驗證過方向：

- 配色方向 A「深色電影」（墨黑 + 暗金 + 米白）— 已確認
- 四城「釘住」的捲動節奏 — 已確認「時間可以」
- 電影段落進實用段的轉換 — 已確認「可以順的」
- 照片解析度 — 原 1200 px 判定「有點糊」，改用重抓的 Wikimedia 原檔 2560 px + 電影調光，已確認「照片可以」

原型位置：`.superpowers/brainstorm/55837-1785856470/content/motion-prototype-v2.html`（git-ignored，僅供對照，不進版控也不上線）。

---

## 3. 架構真相（寫程式前必讀）

`desktop.html` **不是**桌機版的內容頁，只是 12 行轉址樁（`desktop.html:1-12` → `legacy-redirect.js:1-10` → `./?view=desktop`）。

真正的桌機版入口是 `index.html`，桌機手機共用同一個 SPA 殼：

- `index.html:90-105`：以 `matchMedia('(min-width: 768px)')` 或 `?view=desktop` 分流，桌機分支呼叫 `PolskaDesktop.mountDesktopApp(root, { trip: window.TRIP })`
- `index.html:83-89`：依序載入 `vendor/react*.js`、`redesign/pwa-core.js`、`redesign/data.js`、`desktop/chapters.js`、`desktop/desktop-app.js`、`redesign/dist/B-companion.js`
- `index.html:66-68`：`redesign/tokens.css` + `redesign/B-companion.css` + `desktop/desktop.css` 三檔並載

目前桌機版是 hash 路由 + 每次 `rootElement.innerHTML` 全量重寫（`desktop/desktop-app.js:140`），**完全沒有捲動相關程式**（無 `scroll`／`IntersectionObserver`／`requestAnimationFrame`），也**完全沒有渲染任何照片**（`trip.cities[].photo` 欄位存在但從未被讀）。本次是新接一條捲動與照片管線，不是換皮。

---

## 4. 頁面結構

桌機頁面自上而下分兩段，**同一個文件、一路捲到底**：

```
┌─ 電影段（cinema）──────────────── 新建 ─┐
│  0. 開場       滿版克拉科夫照 + POLSKA 大標
│  1. 華沙        釘住 220vh，照片推近，字幕淡入淡出
│  2. 克拉科夫    同上
│  3. 樂斯拉夫    同上
│  4. 波茲南      同上
└──────────────────────────────────────┘
┌─ 實用段（chapters）─────── 沿用既有渲染 ─┐
│  黏頂導覽列（總覽／每日行程／交通與住宿／
│              門票與預約／美食與城市／
│              實用資訊／關於波蘭）
│  章節內容 = 既有 render*() 輸出，只換 CSS
└──────────────────────────────────────┘
┌─ 頁尾 ────────────────────────── 新建 ─┐
│  照片出處與授權（CC BY / CC BY-SA，必要）
└──────────────────────────────────────┘
```

現行 `desktop-app.js:140` 輸出的 `.desktop-masthead`（內含紅白國旗 `.desktop-flag` 與郵票章 `.desktop-stamp`）**整段移除**，品牌識別改由電影段開場承擔——見 §7。

### 4.1 hash 路由如何與捲動共存

- 章節切換**仍走 hash 路由**，`normalizeRoute` / `nextRoute` 行為契約完全不變（`tests/desktop-router.test.mjs` 三條測試必須原樣通過）。
- 進站時若網址**沒有 hash**：從電影段開頭開始，正常捲。
- 進站時若網址**帶 hash**（例如分享出去的 `#logistics`、`#itinerary/day-3`）：跳過電影段，直接把捲軸定位到實用段並渲染該章節。深連結不能被電影段擋住。
- 章節切換時**只重繪實用段容器**，電影段不重建（避免每次切章節都重跑一次開場動畫）。這是對現行「整個 `#root` 全量重寫」的必要調整。
- 實用段的黏頂導覽列在捲進實用段後固定在畫面上方；在電影段時不顯示。

---

## 5. 視覺規格（數值取自已確認的原型）

### 5.1 色票（桌機專屬，不得改 `redesign/tokens.css`）

| 用途 | 值 |
|---|---|
| 底色 `--d-ink` | `#0d0c0b` |
| 主色／強調 `--d-gold` | `#c9a227` |
| 文字主色 `--d-cream` | `#f6f1e6` |
| 次要文字 `--d-mute` | `#9c9384` |
| 警示（❗尚未訂）`--d-alert` | `#e0654f` |
| 分隔線 | `#241f19` |

這些變數定義在 `desktop/desktop.css` 內、掛在桌機專屬 selector 底下（例如 `.desktop-cinema`），**不覆寫也不修改 `redesign/tokens.css` 既有變數**，否則手機版配色會被一起改掉。

**硬約束**：`desktop/desktop.css` 全檔規則的選擇器一律以 `.desktop-`／`.cinema-` 開頭的 class 為根；**禁止** `html`、`body`、`img`、`section`、`*` 等裸元素選擇器與任何全域規則。原因：`index.html:68` 會**無條件**載入這份 CSS（手機開 `/` 渲染 B-companion 時也會套用），現況全檔選擇器都是 `.desktop-*` 前綴才無害，裸元素選擇器（例如電影感常見的 `body{background:#0d0c0b}`）一旦寫下去會直接毀掉手機版底色。

### 5.2 照片調光

所有城市照套用 `filter: brightness(.56) saturate(.78) contrast(1.08)`。原檔是明亮白天全景，不調光會變成觀光照而非電影感。

### 5.3 遮罩

- 開場橫向遮罩：`linear-gradient(100deg, rgba(6,6,6,.95) 0%, rgba(6,6,6,.78) 40%, rgba(6,6,6,.3) 76%, rgba(6,6,6,.08) 100%)`
- 開場縱向遮罩：`linear-gradient(180deg, rgba(6,6,6,.6) 0%, rgba(6,6,6,.1) 24%, rgba(6,6,6,.55) 68%, var(--d-ink) 100%)`
- 城市段縱向遮罩：`linear-gradient(180deg, rgba(6,6,6,.8) 0%, rgba(6,6,6,.3) 38%, rgba(6,6,6,.92) 100%)`
- 城市段橫向遮罩：`linear-gradient(96deg, rgba(6,6,6,.94) 0%, rgba(6,6,6,.86) 34%, rgba(6,6,6,.42) 66%, rgba(6,6,6,.06) 100%)`

橫向遮罩是可讀性的硬需求，不是裝飾：拿掉之後字幕壓在亮色立面上會看不清楚（原型第一版就踩過這個坑）。

### 5.4 捲動動態

| 段落 | 進度變數 | 效果 |
|---|---|---|
| 開場 | `p = min(scrollY / vh, 1)` | 底圖 `scale(1 + p*0.18)`；文字 `translateY(p * -110px)`、`opacity = max(0, 1 - p*1.5)` |
| 城市（各 220vh，內層 `position: sticky; top: 0; height: 100vh`） | `q = clamp(-top / (height - vh), 0, 1)` | 底圖 `scale(1.06 + q*0.16)`；字幕 `q` 在 0→0.16 淡入、0.74→1 淡出，位移 ±44px |
| 實用段 | `IntersectionObserver`（threshold 0.15） | 每個日期區塊 `opacity 0→1`、`translateY 26px→0`，0.8s ease，只觸發一次 |

捲動計算一律包在 `requestAnimationFrame` 內，`scroll` 監聽器加 `{ passive: true }`。

### 5.5 無障礙（硬需求）

- `@media (prefers-reduced-motion: reduce)`：關閉全部捲動驅動的 transform 與淡入淡出，照片靜態顯示、字幕恆定可見、實用段不做浮現動畫。**不得出現「動畫關掉後內容永久空白」的狀態**——參考頁 `reference/cinematic-scroll/README.md` 記錄過這個缺陷，本次不得重蹈。
- 保留既有可及性契約：`aria-current`、渲染後把焦點移到標題的 `focus()`、主內容區 `id="desktop-main"`（`tests/desktop-content.test.mjs:142-147` 會守）。
- 電影段的城市照為裝飾性影像，`alt=""` 並以 `aria-hidden="true"` 排除；城市名與敘述以真實文字呈現，不做成圖片。
- Skip-link（`index.html:80`，桌機分支 `href` 設為 `#desktop-main`，見 `index.html:96`）跳過整個電影段，直接落在實用段主內容 `#desktop-main`，不因本次改版而改變目標。
- 手機以 `?view=desktop` 開啟桌機版時（`desktop.css:5` 既有 `@media (max-width: 767px)` 分支），電影段維持單欄縱向排版，不做額外的行動版專屬設計；驗收見 §9。

---

## 6. 照片資產

### 6.1 產生方式

從 Wikimedia Commons 原始檔（7,214–13,855 px 全景）重新處理：

| 城市 | 原始尺寸 | 置中裁切為 2:1 | 輸出 |
|---|---|---|---|
| 華沙 | 7214×3448 | 6896×3448 | 2560×1280 |
| 克拉科夫 | 7505×3690 | 7380×3690 | 2560×1280 |
| 樂斯拉夫 | 8087×2893 | 5786×2893 | 2560×1280 |
| 波茲南 | 13855×3352 | 6704×3352 | 2560×1280 |

輸出檔名 `assets/photos/{city}-cinema.webp`，四張合計**必須 ≤ 2.0 MB**（原型的 JPEG 版本為 3.3 MB，轉 WebP 後應落在 1.2–1.5 MB；超過 2.0 MB 就降 quality 重壓）。

既有的 `{city}-hero.webp`（1200 px）與 `{city}-thumb.webp`（200 px）**保留不動**，手機版仍在用。

### 6.2 發布與離線

- `prepare-site.sh:31` 是 `cp assets/photos/*.webp`，萬用字元，**新照片會自動帶上線，此檔不需修改**。
- **不把 `-cinema.webp` 放進 `sw.js` 的 `PRECACHE_URLS`**。理由：同一個 Service Worker 服務手機與桌機，放進去會讓手機安裝時白白多下載 1.5 MB 它永遠用不到的圖。
- 改為放寬 runtime cache：`sw.js:96-100` 目前對非 `OFFICIAL_APP_URLS` 的同源資產一律 network-only。新增一個**精確 URL 白名單**（`new URL('./assets/photos/warszawa-cinema.webp', self.location.href).href` 等四筆組成 `Set`，與 `OFFICIAL_APP_URLS` 同樣用 `Set.has(url.href)` 比對），只有這四個完整 URL 才進 runtime cache。**禁止**用 `includes('/assets/photos/')` 或字尾 `endsWith('-cinema.webp')` 這類寬鬆比對——`tests/sw-contract.test.mjs:166-182` 專門堵「巢狀路徑不得命中 runtime cache」這個漏洞（例如 `archive/assets/photos/warszawa-cinema.webp` 不得被寬鬆比對誤放行），寬鬆寫法會繞過這條測試但實際重開這個安全漏洞。`CACHE_VERSION`（`sw.js:3`）遞增一版，見 §7 版本策略。
- 「離線且從未瀏覽過桌機版」的情境：`<img>` 掛 `onerror`，退回已被預快取的 `{city}-hero.webp`（1200 px）。頁面不得因此破版或空白。**已知取捨**：1200 px 版本正是 §2 記錄「有點糊」而被否決、才改用 2560 px 的那個畫質，離線首次瀏覽的使用者會看到已被否決的畫質——這是可接受的降級（有畫面總比破版好），不是要修的 bug，但驗收與使用者說明要點破，避免被誤認為沒改對。

### 6.3 授權（不可省略）

四張照片授權為 CC BY 4.0（樂斯拉夫）與 CC BY-SA 4.0／3.0（華沙、克拉科夫、波茲南）。授權條件要求：

1. **必須在網站上標示出處**（作者 + 授權 + 來源連結）。
2. CC BY-SA 三張屬 ShareAlike，**改作後的衍生檔須以相同或相容授權釋出**，網站上要寫明這件事。

作法：頁尾新增「照片出處」區塊，比照手機版既有實作（`redesign/B-companion.jsx:764-774` 已渲染同類內容，含法律句與最小觸區，桌機直接照抄同一套即可）。資料**不得**併入既有 `trip.photoCredits`（`redesign/data.js:280`，手機版讀取、`tests/photo-spots.test.mjs:23,41` 鎖死長度為 8 與逐筆內容）——四張電影照的出處改用**新增獨立頂層欄位**承載（例如 `trip.cinemaPhotoCredits`），不得改動 `photoCredits` 的長度、順序或元素。

**注意**：`assets/photos/CREDITS.md` 是內部紀錄，`prepare-site.sh:31` 只複製 `*.webp`，**這份檔案不會上線**。授權標示義務完全靠頁尾區塊履行，改完 `CREDITS.md` 不代表 §6.3 的義務已完成——`CREDITS.md` 只需補記新照片的處理方式供內部留存。

---

## 7. 檔案異動清單

### 新建

| 檔案 | 職責 |
|---|---|
| `desktop/cinema.js` | 電影段：資料 → DOM、捲動引擎、reduced-motion 分支、照片 onerror 退回。掛在 `window.PolskaCinema` 上，對外只暴露 `mountCinema(container, { trip })` 與 `destroyCinema()` 兩個函式。**頂層（模組載入當下）不得執行任何程式或引用任何瀏覽器 API**——只能定義函式並掛到 `window.PolskaCinema`，因為 `index.html:83-89` 是手機也會無條件載入的區段（見下）。**檔案大小上限 60 KB**（未壓縮），這是手機使用者因本次改版唯一會多下載的東西 |
| `assets/photos/{warszawa,krakow,wroclaw,poznan}-cinema.webp` | 2560×1280 城市照 |

拆成新檔的理由：捲動引擎與既有的「資料 → HTML 字串」渲染是兩種不同的東西，混在 `desktop-app.js` 會讓該檔從 186 行漲到 450 行以上。代價是要同步更新下列契約，這些契約每一處都有測試守著，漏改會直接紅燈，風險可控。

### 修改

| 檔案 | 改什麼 |
|---|---|
| `desktop/desktop.css` | 整份改寫為深色電影感樣式；保留 `@media (min-width: 768px)` 與 `prefers-reduced-motion: reduce` 兩個既有斷言字串；選擇器約束見 §5.1 |
| `desktop/desktop-app.js` | `mountDesktopApp` 改為：掛載電影段（一次）+ 掛載實用段容器；`render()` 只重繪實用段容器而非整個 `#root`；帶 hash 進站時定位到實用段；移除 `:140` 的 `.desktop-masthead`（含 `.desktop-flag`、`.desktop-stamp`）整段。**所有 `render*()` 函式的簽名與輸出文字不變**；`document`／`matchMedia`／`IntersectionObserver`／`requestAnimationFrame` 等瀏覽器 API 只能出現在 `mountDesktopApp` 函式體內，不得移到模組頂層（沙箱測試見 §8）；`shouldRenderImmediately` 必須保留在 `window.PolskaDesktop` 匯出面上，語意不變 |
| `desktop/chapters.js` | 僅視需要調整章節導言文案以配合深色版面；不得新增行程班次、抵達時間或票價（`tests/desktop-content.test.mjs:136-140` 守著） |
| `index.html` | 桌機分支（`:90-105`）新增呼叫 `mountCinema`；載入標籤本身加在 `:83-89`（無條件載入區段，見上方 scope 例外）。**不得動手機分支（`:106-113`）**；skip-link（`:80`）與 noscript（`:82`）維持原樣，目標見 §5.5 |
| `sw.js` | `CACHE_VERSION`（`:3`）由 `polska-v21` 改為 `polska-v22`；**只新增** `./desktop/cinema.js?v=polska-v22` 這一筆進 `PRECACHE_URLS`；**既有各筆的 `?v=` 一律維持 `polska-v21` 不動**——快取名稱一換，`install` 本來就會對 `PRECACHE_URLS` 全部重抓，不需要靠改 query string 觸發更新，這樣可避免同時改動 `mobile.html`（不可動清單內）的 6 處 `?v=`；runtime cache 白名單見 §6.2 |
| `prepare-site.sh` | 白名單加入 `desktop/cinema.js`（照片走萬用字元，不需改） |
| `verify.sh` | 加入 `node --check desktop/cinema.js`（新檔不會自動被既有的逐檔列舉納入） |
| `tests/deploy-contract.test.mjs:38` | 必要檔案清單加入 `desktop/cinema.js` |
| `tests/entrypoints.test.mjs:15-17,21-22,32-35` | `:15-17` 腳本標籤斷言加入 `desktop/cinema.js`；`:21-22,32-35` 是既有的 `?v=polska-v21` 版本字串比對，這幾處**維持 v21 不動**（因為對應資產的 query string 沒改，見上）——之所以列在這裡，是提醒實作者不要誤觸 |
| `tests/sw-contract.test.mjs:91-101` | 預快取斷言加入 `desktop/cinema.js?v=polska-v22` 這一筆 |
| `tests/sw-contract.test.mjs:94-98,176,193,199,200,202-205,209,213,220,243` | `CACHE_VERSION` 版本字串比對與正則白名單，逐一改成允許 `polska-v22` 出現、`polska-v21` 不再是唯一合法值：`:200,213` 的 `'polska-v21'` 字面比對改 `'polska-v22'`；`:209` 的 `/polska-v(1[0-9]\|20)/` 依既有升版慣例改 `/polska-v(1[0-9]\|2[01])/`；`:220` 的 `doesNotMatch(sw, /polska-v(?!21)\d+/)` 改成 `/polska-v(?!22)\d+/`；其餘為既有版本字串出現位置，逐一比對後同步更新 |
| `tests/sw-contract.test.mjs:166-182` | 新增一條斷言：巢狀路徑（例如 `archive/assets/photos/warszawa-cinema.webp`）不得命中新的 runtime cache 白名單（§6.2 的安全約束的測試化） |
| `tests/sw-contract.test.mjs:344-356`（既有 PRECACHE 解析手法） | 新增一條斷言：`PRECACHE_URLS` 相對改版前只新增 `desktop/cinema.js` 這一筆，四張 `-cinema.webp` 不得出現在其中（§9 第 6 條驗收的測試化） |
| `tests/desktop-content.test.mjs:149-155` | 見下方 §8 |
| `assets/photos/CREDITS.md` | 補記 `-cinema.webp` 的處理方式（2:1 置中裁切 + 2560 px + WebP），授權表沿用；此檔不上線，見 §6.3 |

### 不可動（動了會波及手機版）

`redesign/data.js` 的既有欄位（只可新增，不可改名或改型別）、`redesign/tokens.css`、`redesign/B-companion.*`、`mobile.html`、`vendor/*`、`index.html` 的手機分支。

---

## 8. 這些測試要改，理由寫在這裡

本節分兩類：一類是**語意變更**（設計換了，契約跟著換），一類是**純版本字串同步**（見 §7 的 `sw-contract.test.mjs`／`entrypoints.test.mjs` 條列，機械性更新、不代表設計改變，此處不重複列）。以下只講語意變更的一條。

`tests/desktop-content.test.mjs:149-155` 目前斷言 `desktop/desktop.css` 內含 `desktop-flag`（紅白國旗）與 `desktop-stamp`（郵票章）兩個 class。這兩個是舊「復古報紙風」的裝飾元素，深色電影感版面不會有。

**裁決：改這條測試**，把 `desktop-flag` / `desktop-stamp` 換成新設計的等價契約（`desktop-cinema`、`desktop-hero`），並**原樣保留** `@media (min-width: 768px)` 與 `prefers-reduced-motion: reduce` 兩條斷言。

理由：這條測試的目的是「桌機樣式表確實實作了預期的設計」，不是「國旗必須永遠存在」。設計換了，契約跟著換是正確的；但無障礙那兩條與設計無關，是底線，必須留。

`tests/desktop-content.test.mjs` 除 `:149-155` 外的**其餘所有斷言**（第 1 至 12 條——逐一驗證 `renderLogistics` / `renderBookings` / `renderDay` / `renderCities` / `renderPractical` / `renderAbout` 的輸出字串，以及路由與可及性契約）**全部原樣通過，一個字都不改**。這是本次改版的安全網：只要這些測試還綠，就證明實用內容沒有在改版中掉字。

這批測試用 `vm.runInNewContext` 在只有 `{globalThis, window}` 的沙箱裡載入 `desktop/chapters.js` + `desktop/desktop-app.js`（`:12-18`）——沙箱裡**沒有** `document`、`IntersectionObserver`、`matchMedia`、`requestAnimationFrame`。這正是為什麼 §7 要求瀏覽器 API 只能出現在 `mountDesktopApp` 函式體內：只要有任何瀏覽器 API 跑到模組頂層，整檔載入即拋，這 11 條會**全部**紅燈，不是只影響新功能。

特別點名第 6 條（`shouldRenderImmediately`，`:70-74`）：這條測試綁的正是「同一個 hash 要不要立即重繪」，而 §4.1 改的正是這段行為（章節切換時只重繪實用段容器）。實作時要格外注意這條不能因為捲動邏輯的加入而被意外改壞語意。

---

## 9. 驗收條件（白話版，使用者看得懂的）

0. **動手改任何檔案之前**，先用 headless Chrome 對 `mobile.html`（390×844）截一張基準圖，存檔留存——沒有這張基準圖，第 6 條「與改版前一致」無從比對。
1. `env -u NODE_OPTIONS ./verify.sh` 全綠，貼出實際輸出末段。
2. 用 headless Chrome 在 1440×900 實際開啟桌機版，捲到底，**零 console 錯誤**，並截圖三個位置：開場、某一城市釘住中、實用段。
3. 內容不掉字：`tests/desktop-content.test.mjs` 除 `:149-155`（見 §8）外**全部**斷言未經修改即通過。
4. 「❗尚未訂」提醒在新版桌機版上肉眼看得到——截圖 `?view=desktop#itinerary/day-2` 的「必須預訂」區塊，以及 `?view=desktop#bookings` 的第一優先卡。
5. 深連結可用：直接開 `?view=desktop#logistics` 與 `?view=desktop#itinerary/day-3`，畫面停在正確章節，不會被電影段擋住。
6. 手機版零回歸：`mobile.html` 在 390×844 的渲染與第 0 條的基準圖比對一致；`?view=desktop` 在 390×844 開啟時電影段維持單欄縱向排版、不破版（截圖為證）；Service Worker 的 `PRECACHE_URLS` 相對改版前**只新增** `desktop/cinema.js` 一筆，四張 `-cinema.webp` 不得出現在 `PRECACHE_URLS` 內。
7. 無障礙：開啟系統「減少動態效果」後重載，畫面內容完整可見、可捲、不空白。
8. 授權：頁尾看得到四張照片的作者、授權與來源連結，且寫明 ShareAlike 條件（`assets/photos/CREDITS.md` 不算數，見 §6.3）。
9. 部署後抓線上三個網域（`polandtrip.xiehnet.com`、`jack926509.github.io/Poland-trip`、`poland-trip-7wm.pages.dev`——**不是** `poland-trip.pages.dev`，那是另一個無關的 app，見專案 memory 的已知陷阱）的 `desktop/cinema.js` 與四張 `-cinema.webp` 做位元組比對，與本地一致。
10. 極端尺寸不破版：額外用 headless Chrome 截 2560×1440（超寬）與 1440×700（極矮）兩個尺寸，畫面比例不失衡（見 §11 風險列）。

## 10. 明確不做（YAGNI）

- 不動手機版任何一行。
- 不移植 `reference/cinematic-scroll/` 的分層去背插畫手法——我們沒有那種素材，也不打算購買或製作。該參考頁維持不上線。
- 不做每日／每景點的額外照片，只用四張城市照。
- 不引入任何第三方動畫函式庫或外部圖床，全部自寫、全部同源。
- 不改 hash 路由的對外行為（網址格式不變，舊連結繼續有效）。

## 11. 已知風險

| 風險 | 影響 | 對策 |
|---|---|---|
| `render()` 從「全量重寫 `#root`」改成「只重繪實用段」，可能漏掉重新綁定事件或焦點管理 | 章節切換失效、鍵盤導覽壞掉 | 既有的可及性測試（`:142-147`）與路由測試會擋一部分；驗收第 5 項用真實瀏覽器走一遍 |
| 四張 2560 px 照片讓桌機首次載入變重 | 慢速網路首屏等待 | 開場圖 `fetchpriority="high"`，其餘三張 `loading="lazy"`；總量硬上限 2.0 MB |
| 電影段在超寬螢幕（≥ 2560 px）或極矮視窗（< 700 px 高）比例失衡 | 版面破碎 | §9 第 10 條驗收 |
| `desktop.css` 整份改寫，可能誤刪仍被其他章節使用的樣式 | 實用段破版 | 驗收第 2 項的三張截圖須涵蓋實用段；`renderPractical` / `renderAbout` 的內容測試同時把關 |
| `CACHE_VERSION` 遞增會讓 `activate`（`sw.js:55-65`）清掉舊版快取，既有使用者（含手機）下次連線需重抓整份 `PRECACHE_URLS`；`sw.js:40-41` 刻意不呼叫 `skipWaiting()`，使用者不主動按「立即更新」就會一直停在舊版 | 出發前臨時改版時，人在波蘭、網路不穩的情況下被迫重新下載整包資源 | 部署避開出發前 24 小時；升版後自己先用手機完整走一次「更新→離線可用」流程再宣布完成 |
| 離線且從未瀏覽過桌機版時，`onerror` 退回 `{city}-hero.webp`（1200 px）——這正是 §2 記錄「有點糊」而被否決、才改用 2560 px 的畫質 | 使用者離線首次瀏覽會看到已被否決的畫質，可能誤以為改版沒生效 | 這是可接受的降級（有畫面優於破版），驗收與對使用者的說明要點出這是預期行為，不是 bug |

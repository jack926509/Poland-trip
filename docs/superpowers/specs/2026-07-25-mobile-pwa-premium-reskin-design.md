# POLSKA 手機 PWA 精緻化改版設計規格

日期：2026-07-25（Asia/Taipei）

狀態：使用者已核准設計方向（換皮膚＋加範例好功能、波蘭紅⊕黃銅金、資料存手機本機），本文件將設計定案轉為可驗收契約。

## 1. 結論

把現有手機 PWA（`B_Companion`，目前「今日／行程／交通／訂票」四分頁）改造為 **「SEOUL Travel Hub」風格的精緻旅伴**：暖米紙底 × 波蘭磚紅主色 × 黃銅金點綴 × 深棕墨字，襯線中文＋等寬數字。

底部分頁重整為 **`[首頁][行程][交通][更多]`**：

- **首頁**：城市大圖輪播 hero ＋今日行程卡 ＋三格儀表（天數/花費/下一步）＋今日時間軸預覽。
- **行程**：DAY 膠囊選日 ＋大圖卡片時間軸（航班/火車/步行/餐飲標籤）。
- **交通**：航班段卡 ＋火車班次卡（狀態）＋訂票清單（待訂/已規劃/已訂）。
- **更多**：工具方格，每格點入獨立子頁——**記帳**（完整開發）、Photo Map、匯率換算、打包清單、SOS 緊急卡、實用資訊（含波蘭語）。

**所有使用者資料存手機本機 `localStorage`，不新增後端、帳號、資料庫或雲端同步。** 理由：出國離線可用、免費、零維運，符合既有雙介面計劃 §15 的範圍界定。

沿用既有架構：`B_Companion` 為單一 React 元件，源碼 `redesign/B-companion.jsx` 經 `./build.sh`（esbuild）編譯為 `redesign/dist/B-companion.js`，樣式在 `redesign/B-companion.css` ＋ `redesign/tokens.css`，資料共用 `redesign/data.js`（`window.TRIP`）。桌機分章雜誌不受影響。

## 2. 方案與採用理由

### 資料儲存：本機 localStorage（採用）vs 後端資料庫

使用者一度表示「需要後端也可以，只要讓網頁更好」。評估後採本機儲存，理由：

- **離線可用**：出國在波蘭當地網路不穩／漫遊貴，記帳、打包勾選、備註必須離線即時可寫。後端方案在無網路時反而不能寫。
- **零成本零維運**：無伺服器帳單、無資料庫維護、無帳號登入流程；使用者非工程師，維運負擔要趨近零。
- **符合既有範圍**：既有計劃明確將後端／帳號／資料庫列為範圍外；本機儲存不破壞該界定。
- **代價**：資料綁單一裝置、不跨機同步、清除瀏覽器資料會遺失。對「一趟 8 日旅程、單人單機」的使用情境，此代價可接受；未來若真需跨機，再獨立評估匯出／匯入 JSON。

### 視覺重設計：改造現有 `B_Companion`（採用）vs 新建元件

改造現有元件而非重寫。理由：既有元件已通過穩定化契約（入口、離線、SW、測試），重寫會丟失這些保證並使測試大量失效。

**現況重要事實（盤點確認）**：目前手機版**不是真正的分頁**，而是「單一長頁 ＋ 錨點捲動」——底部 4 顆按鈕（`B_PrimaryNav`）都是 `scrollIntoView` 到同一長頁的不同區塊（`navActions`），沒有 `activeTab` 狀態、沒有內容切換。所有內容（`.B-today` hero、`.B-scrub`、`.B-timeline`、`.B-train`、`<aside className="B-secondary-column">` 的訂票/餐飲/備援/實用）都疊在一頁上。

因此本階段的「最小侵入」是指**資料層與既有 CSS 語彙沿用**，而**導覽層是真正新建**：新增 `activeTab` 狀態（`'home'|'trip'|'move'|'more'`），`B_PrimaryNav` 改吃 `activeTab`/`onChangeTab` 並加選中態，各 tab 只渲染自己的內容區塊。既有的兩種疊層模式（`B-drawer` 全屏側滑、`B-sheet-mask`/`B-train-sheet` 底部彈出）可直接沿用為子頁容器，不引入路由套件。

### 子頁面呈現：同元件內 view 切換（採用）vs 多 HTML 檔

工具子頁用元件內狀態切換（如 `subPage` state）呈現，不新增 HTML 檔。理由：維持單一 PWA 殼與單一 Service Worker 契約，離線一致；符合既有「獨立手機殼＋共用核心」架構。

## 3. 成功標準

1. 390、320 px 開啟 `mobile.html`，底部顯示 `[首頁][行程][交通][更多]` 四分頁，無水平溢出。
2. 首頁 hero 顯示四城（華沙／克拉科夫／樂斯拉夫／波茲南）輪播，自動換圖、有進度點、城市名同步；`prefers-reduced-motion` 時停止自動輪播。
3. 「更多」頁工具方格點任一格，進入對應獨立子頁，並可返回；子頁切換不整頁重載。
4. **記帳**子頁可新增／檢視／刪除一筆花費（PLN 金額、分類、日期、付款方式），自動換算台幣顯示，總花費與預算條即時更新，資料寫入 `localStorage` 並在重開後保留。
5. 視覺套用波蘭紅（#a8231d）主色 ＋黃銅金（--amber #c4892b）點綴 ＋米紙底（#f4ecd8）＋深棕墨字（#1a1612），襯線中文＋等寬數字。
6. 行程、交通兩頁的資料仍全部來自 `redesign/data.js`（`window.TRIP`），日期、日次、班次、票價、訂票不分叉、不硬編。
7. 完成一次線上載入後，改版後的手機殼、Day 1–8、交通、訂票、記帳子頁可離線使用。
8. `./verify.sh` 全綠（含既有測試不回歸＋bundle 一致性）；390／320 px 實際瀏覽器 headless 驗收渲染正常、console 0 error。
9. 桌機分章雜誌介面完全不受影響（未改 `A-magazine.*`）。
10. 繁體中文、無簡體字，中英數字間半形空格；非工程師看得懂每個標籤與訊息。

## 4. 分頁與導覽結構

### 底部分頁（tab bar）

| Tab | 標籤 | 內容 |
|-----|------|------|
| home | 首頁 | Hero 輪播、今日卡、三格儀表、今日時間軸預覽 |
| trip | 行程 | DAY 膠囊、大圖卡片時間軸 |
| move | 交通 | 航班段、火車班次、訂票清單 |
| more | 更多 | 工具方格 ＋預算預覽 |

- tab 切換用**新增的 `activeTab` 狀態**（取代現有 `scrollIntoView` 錨點導覽），各 tab 只渲染自己的內容，不整頁重載。
- 分頁列 sticky 於底部，尊重 `safe-area-inset-bottom`；選中 tab 有明確高亮態。

### 子頁面（從「更多」進入）

- `expense`（記帳，完整開發）、`photomap`（Photo Map）、`fx`（匯率換算）、`packing`（打包清單）、`sos`（SOS 緊急卡）、`info`（實用資訊，含波蘭語常用句）。
- 子頁以獨立 view 呈現，左上返回鍵回「更多」；子頁本身可上下捲動。
- 本階段以 **記帳** 為完整功能；其餘子頁先完成版面與靜態內容骨架（Photo Map 的城市完成度、匯率換算器、打包清單勾選、SOS 卡、實用資訊列表），互動深度於後續迭代補強——但打包清單勾選與匯率換算輸入須可即時運作，因為它們是離線最常用的兩項。

## 5. 視覺系統

沿用並收斂 `redesign/tokens.css` 既有色票（已與設計一致）：

- **色彩**：`--paper:#f4ecd8`（米紙底）、`--crimson:#a8231d`（磚紅主色）、`--crimson-deep:#7a1812`、`--amber:#c4892b`（黃銅金點綴）、`--amber-deep:#8b5e15`、`--ink:#1a1612`（深棕墨字）、`--ink-mute:#6e6358`（次要文字）、卡片底 `#fbf6ea`。
- **字體**：中文襯線 `Noto Serif TC`；數字等寬 `JetBrains Mono`（`font-variant-numeric: tabular-nums`）；拉丁展示字（POLSKA 字標）`Bodoni Moda / Georgia`。
- **語彙**：uppercase mono kicker 小標（沿用既有 `.kicker`）、細金線分隔、卡片柔和陰影。
- **金色克制**：金色只用於點綴（分隔線、kicker、選中態、次要圖示），主行動與強調用紅；避免整頁泛金。

## 6. 各頁內容規格

### 6.1 首頁 home

- **Hero 輪播**：四城市大圖（正式版換真實照片，開發期用漸層佔位塊）每約 3.2 秒自動換，底部進度點，城市名（華沙→克拉科夫→樂斯拉夫→波茲南）同步更新；`prefers-reduced-motion` 停止自動輪播並顯示第一張。POLSKA 字標與日期區間疊字於 hero。
- **今日卡**：依當前日期對應 `window.TRIP.days` 的今日（旅程外顯示第 1 天或倒數），顯示城市、標題、headline、強度標籤。
- **三格儀表**：第幾天/共 8 天、目前累計花費（讀 localStorage 記帳）、下一步（今日行程下一個 step）。
- **今日時間軸預覽**：今日 `steps` 前幾項，點入跳「行程」對應日。

### 6.2 行程 trip

- 頂部 DAY 膠囊列（Day 1–8，可橫捲），選中高亮。
- 選中日的大圖卡片時間軸：每個 `step` 一張卡，含時間、標題、副標、花費、時長；依 step 性質標籤（航班/火車/步行/餐飲）。
- 餐飲（`eat`）、備案（`backup`）、實用（`practical`）以次區塊呈現。

### 6.3 交通 move

- **航班段卡**：`window.TRIP.flights.out / back`，起降時間、航段。
- **火車班次卡**：各日 `train`（type/from/to/dep/arr/dur/price），含狀態。
- **訂票清單**：`window.TRIP.tickets` 或 `mustBook`，狀態膠囊（待訂/已規劃/已訂）。狀態可由使用者切換並存 localStorage。

### 6.4 更多 more

- **工具方格**：記帳、Photo Map、匯率換算、打包清單、SOS 緊急卡、實用資訊。
- **預算預覽**：讀 localStorage 記帳，顯示已花/預算與分類縮圖，點入「記帳」子頁。

## 7. 記帳子頁完整規格（本階段重點）

### 版面

- 深色總花費卡：當前累計（PLN 現地幣別）＋自動換算台幣；顯示匯率（預設 1 PLN ≈ NT$7.7，可於匯率子頁調整並共用）。
- 預算條：已花 / 總預算，超支變紅。
- 四大分類統計卡：餐飲、門票、交通、購物（各顯示小計）。
- 日期篩選膠囊：全部 / Day 1–8。
- 花費列表：每筆顯示品項、分類、PLN 金額、自動台幣、付款方式、日期；可刪除。
- 浮動按鈕「＋新增記帳」：開新增表單（品項、金額 PLN、分類、日期、付款方式）。

### 資料與 localStorage

- key：`polska.expenses.v1`，值為 JSON 陣列，每筆 `{ id, day, category, item, amountPLN, method, ts }`。
- key：`polska.settings.v1`，含 `{ fxRate, budgetTWD }`，記帳與匯率子頁共用。
- 讀寫以 try/catch 包覆；`localStorage` 不可用時退化為僅本次工作階段記憶體，並顯示提示（沿用既有降級語彙）。
- 台幣自動換算 = `amountPLN * fxRate`，四捨五入至整數。

## 8. 其他子頁骨架

- **Photo Map**：四城完成度（去過打卡數／目標），城市卡片；打卡狀態存 `polska.photomap.v1`。
- **匯率換算**：PLN ⇄ TWD 雙向輸入即時換算；可調整 `fxRate` 並寫回 `polska.settings.v1`（與記帳共用）。
- **打包清單**：分類項目 checkbox，勾選狀態存 `polska.packing.v1`，離線即時可勾。
- **SOS 緊急卡**：波蘭緊急電話（112 等）、辦事處、保險、護照影本提醒——資料來源 `window.TRIP.safety`（既有 `safety.emergency`、`safety.tips`，盤點確認存在）。
- **實用資訊**：插座/電壓、小費、營業時間，＋波蘭語常用句——資料來源 `window.TRIP.practical`（頂層）與 `window.TRIP.phrases`（既有波蘭語句庫，盤點確認存在，注意與逐日 `d.practical` 不同來源）。

## 9. 離線與降級

- 改版後的 CSS、bundle、記帳子頁納入 Service Worker precache；cache 版本號自 `polska-v16` 升一版並清舊快取（沿用既有 SW 契約）。
- `window.TRIP` 缺失或 Day 1–8 不完整時，沿用既有「行程資料載入失敗，請重新整理」。
- `localStorage` 不可用時，記帳／打包／打卡退化為僅本次工作階段，顯示提示；不可白屏、不可拋錯中斷。
- 外部地圖／訂票連結離線不開啟，沿用既有離線提示。

## 10. 測試與驗收

### 自動測試（`./verify.sh`）

- 既有全套測試不回歸（entrypoints、sw-contract、deploy-contract、pwa-lifecycle、ui-contract 等）。
- 新增／更新 `tests/ui-contract.test.mjs`（或新測試檔）覆蓋：新四分頁存在、子頁可切換的 DOM 契約、記帳 localStorage 讀寫的純函式（換算、加總、分類統計抽成可測純函式）。
- bundle 一致性：source 與 `dist/B-companion.js` 一併提交，`verify.sh` 的 `cmp` 通過。

### 實際瀏覽器（headless Chrome）

- 390、320 px：四分頁顯示、hero 輪播運作、無水平溢出。
- 點「更多 → 記帳」進子頁、新增一筆、確認台幣換算與總額更新、返回、重開後資料仍在。
- console 0 error；PWA 註冊進入 ready 或明確降級。

## 11. 發布門檻與範圍外

依序通過 `./verify.sh`、headless Chrome 實際渲染驗收、未參與撰寫者的 fresh-context 交叉審查、使用者操作確認後，才可合併、推送或部署。

**本階段範圍外**：登入、後端、雲端資料庫、跨機同步、推播通知、桌機介面改動、真實城市照片替換（照片由使用者後續提供，開發期用漸層佔位）。

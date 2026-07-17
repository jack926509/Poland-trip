# POLSKA 桌機分章雜誌＋手機 PWA 設計計劃書

日期：2026-07-17（Asia/Taipei）

## 一、計劃結論

POLSKA 採用「C 改良版」雙介面架構：桌機恢復原網頁版的雜誌視覺與完整旅遊內容，但不恢復一次向下閱讀 15 個章節的長頁；手機則保留目前已完成的四分頁 PWA 旅伴。

系統只保留兩個有明確用途的正式介面：

- 桌機「行前規劃指南」：適合在電腦上查資料、比較城市、整理交通與訂票。
- 手機「旅途中 PWA」：適合當天快速查看今日、行程、交通與訂票。

兩個介面共用同一份核心旅程資料，不恢復經典版、新版、預覽版等多條維護路徑。

## 二、使用者需求與成功標準

### 需求

1. 桌機版要保留原本 `POLSKA — Travel Atlas` 的田野雜誌風格。
2. 桌機版不能是從首頁一路向下閱讀所有內容的長頁。
3. 桌機版要一次只顯示目前選取的章節或日次。
4. 手機版維持目前已完成的 PWA，不因桌機改版而退回舊手機版。
5. 桌機與手機的日期、每日行程、交通與訂票資訊不得互相矛盾。
6. 不刪除目前封存的經典版原始碼，不新增後端、帳號或資料庫。

### 完成後會看到什麼

- 電腦開啟根網址時，看到原版雜誌風格的桌機首頁。
- 頂部導覽可切換「總覽、行程、交通、住宿、門票、美食與城市、實用資訊」。
- 選擇「每日行程」後，再用 Day 1–8 切換日期；畫面一次只顯示一天。
- 選擇「交通」後，內容在同一主內容區切換，不需要往下捲過其他章節。
- 手機開啟網站或從主畫面啟動時，仍進入「今日／行程／交通／訂票」PWA。
- 桌機與手機會從 `redesign/data.js` 取得相同的核心行程資料。

## 三、方案比較與採用理由

### 方案 A：每個章節建立獨立 HTML

每個主題分成 `transport.html`、`food.html` 等實體頁面。優點是頁面概念直接；缺點是頁首、導覽、Metadata 與共用資料容易重複，維護成本會再次上升。

### 方案 B：桌機儀表板加彈出視窗

首頁以大量卡片開啟內容。優點是操作快速；缺點是較像管理系統，會失去使用者偏好的旅行雜誌感，長篇城市與文化內容也不適合放在小彈窗。

### 方案 C：單頁分章雜誌（採用）

桌機保留一個雜誌殼層與一個主內容區，透過章節導覽在原地切換內容。網址 hash 保留目前章節，支援重新整理、返回鍵與分享。此方案能保留原版個性，同時消除長頁與重複頁面。

## 四、正式入口與裝置切換

### 根網址

- `/` 仍是公開、分享與 SEO 使用的根網址。
- 寬度大於等於 768 px 時顯示桌機分章雜誌。
- 寬度小於 768 px 或行動裝置時導向 `mobile.html`。
- 網址帶有 `?view=desktop` 時，即使在平板或手機也可查看桌機指南。
- 網址帶有 `?view=mobile` 時，可從桌機直接預覽手機旅伴。

### PWA 入口

- `mobile.html` 改為正式 PWA 應用殼，不再是轉址頁。
- `manifest.json` 的 `start_url` 改為 `./mobile.html`。
- `manifest.json` 的 `id` 維持 `./`，避免已安裝 PWA 被瀏覽器視為另一個新 App。
- PWA shortcuts 指向 `mobile.html#top` 與 `mobile.html#B-tickets`。
- Service Worker 的 scope 維持 `./`，同時可服務桌機指南與手機 PWA；離線導覽 fallback 依請求路徑回到對應殼層。

### 舊入口

- `desktop.html` 導向 `./?view=desktop` 並保留原 query 與 hash。
- `app-preview.html` 導向 `./mobile.html?view=mobile` 並保留 hash。
- 經典版封存檔 `archive/classic-index.html` 不加入正式部署 allowlist，不出現在 sitemap、manifest 或 Service Worker 快取。

## 五、桌機版資訊架構

桌機版把原本 15 個連續章節整理成 7 個主入口。整理是重新分類，不刪除有價值內容。

### 1. 旅行總覽 `#overview`

- 旅行日期、8 天 7 晚與四城路線。
- 航班摘要、旅遊風格與高風險日。
- 目前仍需完成的訂票與確認事項。
- 四城市快速入口。

### 2. 每日行程 `#itinerary/day-1` 至 `#itinerary/day-8`

- Day 1–8 日次切換。
- 每次只顯示一天的標題、硬限制、逐時步驟、費用、餐食、備案與實務節點。
- 跨城日顯示火車出發、抵達、車種、價格與緩衝。
- 支援上一天、下一天與鍵盤方向鍵切換。

### 3. 交通與住宿 `#logistics`

- 航班、機場進城、五段跨城交通。
- 各城市車站、寄物、當地交通與住宿區域。
- 以城市或日期切換，不一次展開所有內容。

### 4. 門票與預約 `#bookings`

- 必訂項目、建議期限、官方網址與適用日期。
- 顯示「尚未確認、已規劃」等資訊狀態；不新增跨裝置同步的虛假購票狀態。
- 外部連結無網路時，顯示需要連線的提示。

### 5. 美食與城市 `#cities`

- 先選城市，再顯示該城市的美食、景點、文化、購物與雨天備案。
- 原版的城市故事與人文內容保留在桌機版，不強迫塞入手機首要操作流程。

### 6. 實用資訊 `#practical`

- 天氣與穿著、安全與緊急聯絡、換錢、SIM、常用波蘭語。
- 資訊採折疊區塊，預設只展開使用者選取的主題。

### 7. 關於波蘭 `#about`

- 歷史、節慶、文化與鄰國延伸閱讀。
- 保留原版雜誌的長文價值，但此區只有在使用者主動選取時才載入畫面。

## 六、桌機版視覺與互動

### 保留的原版元素

- `Cormorant Garamond`、`Bodoni Moda`、`Noto Serif TC` 與 `JetBrains Mono` 字體組合。
- 米白紙張、波蘭紅、黑色墨水與細線網格。
- `VOL. I`、`POLSKA — Travel Atlas`、章節編號與田野指南語氣。
- 原版 Masthead、雙線分隔、章節大標與桌機多欄排版。

### 改變的互動

- 導覽列固定在頁面上方，但只切換主內容區。
- 每次切換章節後，焦點移到新章節標題，讓鍵盤與螢幕閱讀器知道內容已更新。
- 瀏覽器返回鍵依序回到上一個章節或日次。
- 章節切換保留 hash，不建立第二套歷史狀態資料庫。
- 桌機內容區允許章節內正常短距離捲動，但不得把其他主章節接在後面。

## 七、手機 PWA 保留範圍

- 保留目前 `B_Companion` 的「今日／行程／交通／訂票」四分頁。
- 保留 Day 1–8、目前行程、下一站、硬限制、地圖、訂票連結與本機備註。
- 保留安裝提示、safe-area、更新提示與離線狀態。
- 不把桌機長文、完整歷史與大量城市文章放進手機主要流程。
- 手機仍以 `redesign/B-companion.jsx` 與 `redesign/B-companion.css` 為正式介面。

## 八、資料與檔案責任

### 共用資料

`redesign/data.js` 繼續提供 `window.TRIP`，負責：

- `TRIP.meta`：日期、時區、城市、路線與航班摘要。
- `TRIP.days`：Day 1–8 每日步驟、交通、餐食、備案與實務節點。
- 訂票與官方連結需要整理為可供桌機、手機共用的機器可讀欄位。

### 桌機專屬內容

新增 `desktop/chapters.js`，只保存不屬於每日核心行程的文章內容，例如歷史、節慶、文化與鄰國。它不得複製 `TRIP.days` 的日期、交通班次或票價。

### 預計檔案責任

- 修改 `index.html`：桌機雜誌殼層、裝置分流與 SEO metadata。
- 修改 `mobile.html`：手機 PWA 應用殼。
- 新增 `desktop/desktop-app.js`：章節 hash 路由、日次切換與焦點管理。
- 新增 `desktop/desktop.css`：從原版 `styles.css` 抽出的桌機視覺及分章狀態。
- 新增 `desktop/chapters.js`：桌機專屬文化與城市文章。
- 修改 `redesign/data.js`：補齊桌機、手機需要共用的訂票與交通欄位。
- 修改 `manifest.json`、`sw.js`、`pwa-register.js`：手機 PWA 啟動、離線與更新。
- 修改 `legacy-redirect.js`、`desktop.html`、`app-preview.html`：舊入口相容導向。
- 修改 `prepare-site.sh`：把正式桌機資產加入安全 allowlist，仍排除 archive 與開發檔。
- 修改 `README.md`：說明桌機指南與手機 PWA 的雙介面、單資料架構。

## 九、離線、錯誤與降級處理

- 手機 PWA 完成一次線上載入後，核心 Day 1–8、交通、訂票與圖示需可離線使用。
- 桌機指南完成一次載入後，可離線閱讀最後快取版本；外部地圖與官方訂票連結仍需網路。
- 桌機收到未知 hash 時回到 `#overview`，並以 `history.replaceState()` 修正網址，不顯示空白頁。
- `redesign/data.js` 載入失敗時，桌機與手機都顯示「行程資料載入失敗，請重新整理」；不得留下只有空白版面的殼。
- Service Worker 不支援或更新失敗時，網站仍可線上使用。
- `localStorage` 不可用時，手機備註只保留當次使用並顯示提示。

## 十、實作階段

### 階段 1：建立回復點與入口契約

- 從最新 `main` 建立 `codex/desktop-segmented-magazine` 工作分支與隔離 worktree。
- 寫出裝置分流、manifest、舊入口與部署 allowlist 的失敗測試。
- 不先修改正式入口，先確認測試能抓到目前的單一 PWA 架構。

### 階段 2：恢復桌機雜誌殼層

- 以 `archive/classic-index.html`、`styles.css` 與 `main.js` 為視覺參考。
- 建立 `desktop/desktop.css` 與桌機 HTML 殼層。
- 只恢復 Masthead、導覽、字體、配色與章節視覺，不直接復原舊裝置跳轉或長頁結構。

### 階段 3：建立分章路由

- 寫出 hash 解析、未知 hash、上一章／下一章與 Day 1–8 的測試。
- 實作 `desktop/desktop-app.js`。
- 驗證重新整理、直接開啟深層 hash 與瀏覽器返回鍵。

### 階段 4：接入共用行程資料

- 桌機 Day 1–8 從 `window.TRIP.days` 產生。
- 交通與訂票主資料從 `window.TRIP` 產生。
- 原版文化、城市、歷史長文搬入 `desktop/chapters.js`，並檢查沒有複製核心班次與票價。

### 階段 5：恢復手機 PWA 獨立入口

- 把目前根入口的 PWA 殼移到 `mobile.html`。
- 調整 manifest、shortcuts、Service Worker 與相容轉址。
- 升級 PWA cache 版本，避免手機繼續看到先前的單一根入口快取。

### 階段 6：部署邊界與文件

- 更新 `prepare-site.sh` 的公開 allowlist。
- 確認 `archive/`、測試、設計檔與 `.superpowers/` 不會發布。
- 更新 README、驗收紀錄與交叉審查交接資料。

### 階段 7：完整驗收與交叉審查

- 執行 `./verify.sh`，所有測試、build、語法檢查與 `git diff --check` 必須通過。
- 以實際瀏覽器驗證 1440 px、1024 px、768 px、390 px 與 320 px。
- 驗證桌機章節切換、Day 1–8、hash、返回鍵、鍵盤與無水平溢出。
- 驗證手機 PWA 四分頁、安裝入口、更新、safe-area 與離線重新載入。
- 由未參與撰寫的子代理進行規格符合性與程式品質審查。
- 使用者實際操作桌機與手機核心路徑，確認後才可合併 `main` 或部署。

## 十一、自動測試規劃

### `tests/entrypoints.test.mjs`

- 根入口包含桌機殼層及 768 px 裝置分流。
- `mobile.html` 直接載入 `B_Companion`，不是相容轉址。
- `desktop.html` 與 `app-preview.html` 導向正確介面並保留 query/hash。
- manifest 的 `id`、`start_url` 與 shortcuts 符合雙介面架構。

### `tests/desktop-router.test.mjs`

- `#overview`、`#itinerary/day-1` 至 `day-8` 與其他合法章節能正確解析。
- 未知 hash 回到 `#overview`。
- Day 小於 1 或大於 8 時回到有效範圍。
- 每次切換只啟用一個主章節。

### `tests/desktop-content.test.mjs`

- 桌機 Day 1–8 由 `TRIP.days` 產生。
- `desktop/chapters.js` 不得另行定義 8 天日期與跨城班次。
- 桌機導覽具備正確的按鈕、焦點目標與 `aria-current`。

### `tests/sw-contract.test.mjs`

- precache 同時包含桌機與手機核心資產。
- `archive/`、`tests/`、`docs/` 不進入快取清單。
- `mobile.html` 導覽離線時回到手機殼；桌機根導覽回到桌機殼。
- cache 版本升級後清除舊的 `polska-v15`。

### `tests/deploy-contract.test.mjs`

- `_site` 包含桌機、手機、manifest、Service Worker、圖示與共用資料。
- `_site` 不包含 archive、設計稿、測試、文件與開發腳本。

## 十二、白話驗收清單

1. 電腦開根網址，第一眼是原本的 POLSKA 雜誌感，不是放大的手機畫面。
2. 點「交通」只看到交通章節，不會在下方接著出現住宿、美食與歷史。
3. 點「每日行程」可切 Day 1–8，每次只顯示一天。
4. 重新整理或把章節網址貼到新分頁，仍回到同一章。
5. 使用瀏覽器上一頁，可回到上一個章節或日次。
6. 手機開網站仍看到「今日／行程／交通／訂票」四個入口。
7. 已安裝的手機 PWA 更新後仍被視為同一個 POLSKA App。
8. 桌機與手機顯示相同的日期、火車時間、票價與訂票連結。
9. 斷網重新開啟後，仍能查看核心行程；外部連結會清楚說明需要網路。
10. GitHub Pages 與 Cloudflare 的發布檔案不包含封存經典版。

## 十三、風險與控制方式

### 風險 1：已安裝 PWA 啟動位置改變

控制方式：manifest `id` 維持 `./`，只調整 `start_url`；以已安裝模式實測更新前後是否仍為同一 App。

### 風險 2：Service Worker 導覽 fallback 回錯介面

控制方式：依 URL pathname 分流 `mobile.html` 與根入口 fallback，並加入離線契約測試。

### 風險 3：桌機文章重新形成第二份行程資料

控制方式：`desktop/chapters.js` 只保存非核心文章；日次、交通、票價與訂票一律引用 `window.TRIP`。

### 風險 4：裝置寬度判斷造成平板介面不符預期

控制方式：使用 768 px 明確斷點，另提供 `?view=desktop` 與 `?view=mobile` 人工覆寫，不依賴 User-Agent 作為唯一判斷。

### 風險 5：恢復原版時不小心恢復舊日期或舊跳轉

控制方式：經典版只作視覺參考；不得直接以封存 HTML 覆蓋入口。所有日期與行程由現有 `TRIP` 資料生成。

## 十四、回復方案

- 實作在獨立分支與 worktree 進行，現有 `main` 保持可用。
- 每個階段完成測試後獨立 commit，任何階段不合格可停止並回到上一個 commit。
- 未經使用者桌機與手機實際驗收，不合併 `main`。
- 未經使用者明確同意，不推送正式部署。
- 若 PWA 升級驗收失敗，保留現有單一 PWA 架構，不勉強切換正式入口。

## 十五、不在本次範圍

- 不新增登入、多人協作、雲端同步、後端或資料庫。
- 不新增即時火車、天氣、定位、推播或付款 API。
- 不改變已確認的 2026/10/24–10/31 行程內容。
- 不刪除 `archive/classic-index.html`、`styles.css` 或 `main.js`。
- 不把桌機所有長文完整複製到手機 PWA。
- 本設計文件核准前不開始實作；實作完成並通過驗收前不部署。

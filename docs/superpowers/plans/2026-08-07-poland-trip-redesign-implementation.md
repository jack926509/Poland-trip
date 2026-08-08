# POLSKA 波蘭行網站改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 拋棄現有雙軌（桌機分章雜誌＋手機 PWA）設計，把 `redesign/data.js` 與 `poland-travel-guide-final.html` 兩份內容來源合併成單一資料層，用純 Node.js 產生 20 頁編輯誌感靜態桌機網站（含 4 張真實比例 Leaflet 地圖）。

**Architecture:** `src/data/*.js`（7 個 ES module，純資料）→ `src/templates/*.mjs`（template-literal 渲染函式）→ `build.mjs`（讀資料、呼叫模板、寫出 `dist/*.html`）。無前端框架、無樣板引擎、無 npm 依賴；地圖用 Leaflet CDN。

**Tech Stack:** Node.js 內建模組（`fs`、`path`、`node:test`、`node:assert/strict`）、純 JS template literals、CSS（無前處理器）、Leaflet 1.9 + OpenStreetMap（CDN）、Google Fonts（CDN：Playfair Display / Noto Sans TC / Inter）。

## Global Constraints

- 本次範圍**僅桌機網頁版**；手機版與 PWA 不動、不移除、暫留原地。
- 20 頁輸出：1 首頁 + 8 每日頁 + 4 城市頁 + 7 實用資訊頁。
- 不引入 React、esbuild、任何樣板引擎或建置工具；`package.json` 不得有 `dependencies`，只能有 `devDependencies`（若有）與 `scripts`。
- 任何頁面內容不得寫死在模板裡；所有內容一律來自 `src/data/*.js`。
- 資料衝突一律依 `docs/資料校正表.md` 逐筆裁決，**不得臨場自行判斷**；本計畫已把該表的裁決結果轉成逐項具體指令。
- 全站輸出禁止簡體字；中文與英文/數字之間需有半形空格（沿用來源資料既有排版即可，不用額外處理）。
- 舊檔案一律移入 `archive/`，用 `git mv` 保留歷史，不得 `rm` 刪除。
- 部署對外網址：`polandtrip.xiehnet.com`、`jack926509.github.io/Poland-trip`、`poland-trip-7wm.pages.dev`；`poland-trip.pages.dev`（無 `-7wm`）是不相關的別的 app，驗證時嚴禁誤用。
- `npm run build` 產生 `dist/`；`npm test` 跑 `node --test tests/*.test.mjs`（Node.js 24 不接受以測試目錄作為位置參數），兩者都要留下真實指令輸出作為驗收證據。

---

## File Structure

```
package.json                     # 新增：type=module，scripts.build / scripts.test
build.mjs                        # 新增：組裝 20 頁到 dist/
src/data/trip.js                 # 新增：meta、flights、days×8、stay、trains、bookingTiers、reservations
src/data/cities.js               # 新增：cities×4、cityStories×4、photoSpots×10、photoCredits×8、mapPins（50 圖釘）、attractions（各城景點表）
src/data/dining.js               # 新增：michelinSummary、michelinReservations、cityDining（HTML 各城美食表）、cityFood×4、foodBackup×4、foods×12
src/data/tickets.js              # 新增：fares（21 列速查表）、ticketsByCity（data.js 17 項）
src/data/transit.js              # 新增：transitFares、airportTransit、recommendedApps、passChecklist、usefulRoutes、practical×6
src/data/shopping.js             # 新增：souvenirCards×14、luxuryShopping×2、shopping×7、zabkaCards×7
src/data/essentials.js           # 新增：phrases×12、packingDefault、about×8、safety、preDepartureNotes×9
src/templates/layout.mjs         # 新增：共用外殼（<head>、nav、footer）
src/templates/home.mjs           # 新增：首頁
src/templates/day.mjs            # 新增：8 個每日頁共用的渲染函式
src/templates/city.mjs           # 新增：4 個城市頁共用的渲染函式（含 Leaflet 地圖）
src/templates/practical.mjs      # 新增：7 個實用資訊頁的渲染函式
src/styles/main.css              # 新增：編輯誌感視覺（Playfair Display / Noto Sans TC / Inter，米色紙感）
tests/build.test.mjs             # 新增：自動驗收（spec 第 9 節逐項機械檢查）
prepare-site.sh                  # 改寫：allowlist 換成新 dist/ 結構
verify.sh                        # 改寫：換掉舊 bundle-diff 邏輯，改跑 npm test / npm run build
archive/redesign/                # 搬移：舊 redesign/ 全部
archive/desktop/                 # 搬移：舊 desktop/ 全部
archive/tests-old/               # 搬移：舊 14 個 *.test.mjs
archive/poland-travel-guide-final.html  # 搬移（Task 17 最後一步）
```

**Interfaces 慣例（所有資料檔共用）：** 每個 `src/data/*.js` 用 `export const xxx = [...]` / `export const xxx = {...}` 具名匯出，不用 default export，模板檔用 `import { xxx } from '../data/yyy.js'` 具名引入。

---

## 對照校正表的裁決速查（寫程式時用這張表比對，不用再翻 `docs/資料校正表.md`）

| 校正表編號 | 內容 | 落地位置 | 本計畫任務 |
|---|---|---|---|
| 1-1 | 皇家城堡 Day7 17:00 待確認 | day-07 頁與 city-warszawa 頁顯著標「待確認」 | Task 2, Task 13 |
| 1-2 | 霓虹博物館已遷科學文化宮 4 樓 | trip.js 的 day7 extend 文字、tickets.js fares 表（HTML 原文已經是對的，直接照抄） | Task 2, Task 5 |
| 1-3 | 波茲南古市政廳整修閉館 | tickets.js fares 表「閉館中」列（HTML 原文已經是對的，直接照抄，不得沿用 data.js 的 `['古市政廳博物館','PLN 10']`） | Task 5 |
| 1-4 | 樂斯拉夫百年廳 10/28 圓頂不開放 | trip.js day5 的 warn 文字、essentials.js preDepartureNotes | Task 2, Task 8 |
| 1-5 | 日落時間改為 16:05–16:30 | essentials.js preDepartureNotes（覆寫 HTML 15:35–15:50 那句） | Task 8 |
| 1-6 | Day8 退稅/報到時間重疊 | trip.js day8 steps 合併 11:15–12:00 | Task 2 |
| 2-1～2-8 | 各項票價以 HTML 新資料為準 | tickets.js fares / dining.js michelin **且** trip.js days 陣列裡凡有重複標同一票價的 steps/backup 欄位也要同步改，不能只改獨立票價表 | Task 4, Task 5, **Task 2（見下列細項）** |
| 2-2 | 科學文化宮觀景台 PLN 25 → PLN 30／優待 25 | trip.js day1 的 `backup[0].why`（`科學文化宮 30F 觀景台`那筆，原文 `PLN 25 · 室內...`） | Task 2 |
| 2-3 | Auschwitz 導覽 PLN 150 → 約 130–150（優待 120） | trip.js day4 的 `steps` 裡 `★ 英文官方導覽` 那筆 `cost` | Task 2 |
| 2-5 | 波茲南帝王城堡 PLN 16 → 多為免費，特展另計 | trip.js day6 的 `steps` 裡 `帝王城堡 / Stary Browar` 那筆 `cost` | Task 2 |
| 2-6 | 波茲南教堂島 PLN 16 → 未收費 | trip.js day6 的 `steps` 裡 `★ 教堂島 Ostrów Tumski` 那筆 `cost` | Task 2 |
| 2-8 | 山羊鐘樓場次「每天中午限定」→「正午一場，部分資料另有 15:00 場」 | trip.js day6 的 `steps` 裡 `★ 山羊鐘樓秀` 那筆 `sub` | Task 2 |
| 2-9 | 換匯價差統一 ≤1.5% | trip.js day1 practical（data.js:44 的 ≤1% 改成 ≤1.5%） | Task 2 |
| 2-10 | Wawel 閉館日以 `:232` 為準 | dining.js 或 tickets.js 不需特別處理（行程結束後的日期，僅供參考文字） | Task 5（照抄 `:232` 版本，不用 `:530` 版本） |
| 3-1 | 4 個地圖圖釘分類誤植 | cities.js mapPins（本計畫已直接給出修正後的完整資料） | Task 3 |
| 3-2 | 克拉科夫圖釘數 19 | cities.js mapPins + tests/build.test.mjs 斷言 | Task 3, Task 16 |
| 3-3 | 回程班機日期敘述改寫 | essentials.js preDepartureNotes | Task 8 |
| 3-4 | Panorama 優待價改 35 | tickets.js fares 表 | Task 5 |
| 3-5 | 辛德勒工廠官網統一 muzeumkrakowa.pl | tickets.js fares 表已是 muzeumkrakowa.pl，essentials.js 若引用官網清單需同步 | Task 5, Task 8 |
| 3-6 | 琥珀店名並列不二選一 | shopping.js 保留兩者 | Task 7 |
| 3 節拍照時段 3 筆 | Kazimierz／教堂島／皇家城堡拍照時段改成貼近實際行程 | cities.js photoSpots | Task 3 |
| 第 4 節 4 項待查證 | 標成「待確認」樣式 | day-07、city-krakow、practical/tickets.html、day-03 | Task 2, Task 3, Task 5, Task 13 |

---

## Task 1: 專案骨架與 package.json

**Files:**
- Create: `package.json`
- Create: `src/data/`、`src/templates/`、`src/styles/`（空目錄，讓後續任務建檔時一併建立目錄即可）
- Move: `tests/` 目錄下現有 14 個舊 `*.test.mjs`（`pwa-core.test.mjs`、`sw-contract.test.mjs`、`ui-contract.test.mjs`、`desktop-router.test.mjs` 等）→ `archive/tests-old/`（**這一步提前到這裡做，不要等到 Task 17**：`npm test` 從本任務起就會被後續任務呼叫，若 `tests/` 還留著舊 PWA 測試，後面任務的「npm test 全綠」驗收會被無關的舊測試汙染或拖慢）

**Interfaces:**
- Produces: `npm run build`（執行 `node build.mjs`）、`npm test`（執行 `node build.mjs && node --test tests/`）供後續所有任務使用；本任務完成後 `tests/` 必須是真正空目錄（新的 `build.test.mjs` 要到 Task 16 才會建立）。

- [ ] **Step 1: 建立 `package.json`**

```json
{
  "name": "poland-trip-site",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.mjs",
    "test": "node build.mjs && node --test tests/"
  }
}
```

- [ ] **Step 2: 建立空的 `src/data/`、`src/templates/`、`src/styles/` 目錄**

```bash
mkdir -p src/data src/templates src/styles
```

- [ ] **Step 3: 把 `tests/` 底下現有的舊 PWA 測試搬到 `archive/tests-old/`，讓 `tests/` 變成真正空目錄**

先確認這些檔案是已追蹤檔案（`git ls-files tests/` 應列出約 14 個 `*.test.mjs`），用 `git mv` 保留歷史：

```bash
mkdir -p archive/tests-old
git mv tests/*.test.mjs archive/tests-old/
ls tests/ 2>/dev/null
```

Expected: `ls tests/` 輸出為空（或目錄不存在），確認沒有殘留任何 `.test.mjs`。

- [ ] **Step 4: 確認 Node 版本可用內建 test runner**

Run: `node --version && node --test --help | head -3`
Expected: 版本 ≥ 18（本機為 v24），`--test` 說明正常輸出，不報 unknown option。

- [ ] **Step 5: Commit**

```bash
git add package.json src/ archive/tests-old/ tests/
git commit -m "chore: 建立新網站專案骨架，並把舊 PWA 測試搬到 archive/tests-old/ 避免污染新的 npm test"
```

---

## Task 2: `src/data/trip.js`（meta、flights、days×8、stay、trains、bookingTiers、reservations）

**Files:**
- Create: `src/data/trip.js`
- 來源：`redesign/data.js:3-16`（meta）、`:17-259`（days，8 筆）、`:290-299`（trains）、`:300-324`（bookingTiers）、`:325-341`（flights）、`:342-348`（stay）、`:513-523`（reservations）

**Interfaces:**
- Produces:
  - `export const meta` — 物件，欄位同 `data.js` meta（`code, edition, dateRange, tripStart, tripEnd, timeZone, nights, days, cities, route, style, highestRiskDays, flights`，此處 `flights` 是文字描述，勿與下面的 `flights` 匯出搞混）
  - `export const days` — 陣列，8 筆，欄位 `n, date, city, title, headline, tag, intensity, hardConstraints[], mustBook[], compressible[], weather, train{}?, steps[], eat[]?, backup[], warn?, practical[]?, extend[]?`
  - `export const flights` — 物件 `{out:[...5], back:[...5]}`
  - `export const stay` — 陣列 4 筆
  - `export const trains` — 陣列 5 筆
  - `export const bookingTiers` — 陣列 3 筆，`items[]` 子欄位 `{name, url}`
  - `export const reservations` — 陣列 8 筆 `{when, what}`
- Consumes: 無（本檔是資料源頭）

- [ ] **Step 1: 逐欄位從 `redesign/data.js` 轉錄 `meta`、`flights`、`stay`、`trains`、`bookingTiers`、`reservations`**

原樣轉錄，不做任何修改（這幾個集合沒有校正表項目）。用 `export const` 取代 `window.TRIP = {...}` 的物件字面值寫法，例如：

```js
export const meta = {
  code: 'POLSKA',
  edition: '2026 Poland Field Plan',
  dateRange: '2026 / 10 / 24 — 10 / 31',
  tripStart: '2026-10-24',
  tripEnd: '2026-10-31',
  timeZone: 'Europe/Warsaw',
  nights: 7, days: 8,
  cities: ['Warszawa', 'Kraków', 'Wrocław', 'Poznań'],
  route: '華沙 → 克拉科夫 → 樂斯拉夫 → 波茲南 → 華沙',
  style: '高效率城市探索 · 腳程快 · 重點景點完整走完',
  highestRiskDays: ['Day 5 樂斯拉夫全景點 + 晚轉場', 'Day 7 三館連看'],
  flights: '國泰 + 卡達 + 長榮聯運',
};
```

`flights`（物件，不是上面 meta 裡的文字欄位）：

```js
export const flights = {
  out: [
    {code:'CX 479',  leg:'TPE → HKG', when:'10/23 五 21:05 → 23:05', dur:'2h00m'},
    {code:'⇄ HKG',   leg:'轉機',       when:'2h20m', dur:'', layover:true},
    {code:'QR 815',  leg:'HKG → DOH', when:'10/24 六 01:25 → 04:50', dur:'8h25m'},
    {code:'⇄ DOH',   leg:'轉機',       when:'3h40m', dur:'', layover:true},
    {code:'QR 259',  leg:'DOH → WAW', when:'10/24 六 08:30 → 13:30', dur:'6h00m'},
  ],
  back: [
    {code:'QR 260',  leg:'WAW → DOH', when:'10/31 六 14:40 → 22:10', dur:'5h30m'},
    {code:'⇄ DOH',   leg:'轉機',       when:'3h55m', dur:'', layover:true},
    {code:'QR 818',  leg:'DOH → HKG', when:'11/1 日 02:05 → 14:50', dur:'7h45m'},
    {code:'⇄ HKG',   leg:'轉機',       when:'4h50m', dur:'', layover:true},
    {code:'BR 872',  leg:'HKG → TPE', when:'11/1 日 19:40 → 21:25', dur:'1h45m'},
  ],
};
```

`stay`（4 筆，`redesign/data.js:342-348` 原樣轉錄）、`trains`（5 筆，`:290-299` 原樣轉錄，含 Auschwitz 巴士的 `leg` 欄位與注意 `arr:14:30` 是回抵克拉科夫、不是抵達奧斯威辛）、`bookingTiers`（3 筆共 16 項，`:300-324` 原樣轉錄）、`reservations`（8 筆，`:513-523` 原樣轉錄，含「visit.auschwitz.org」「wieliczka-saltmine.com」等連結文字）。

- [ ] **Step 2: 轉錄 `days`，套用 9 項校正（1-1 待確認標記、1-2 霓虹博物館文字修正、1-6 Day8 時間合併、2-2/2-3/2-5/2-6/2-8 票價與場次更新、2-9 換匯價差）**

8 筆 day 物件逐一從 `redesign/data.js:17-259` 轉錄，欄位結構依每天而異（不是每天都有 `train`/`warn`/`practical`/`extend`/`eat`，照原資料保留）。以下是需要動手修改的天數，其餘（Day 2/3）原樣轉錄：

Day 1（`:19-46`）除了 2-9 換匯價差外，還要套用 2-2：`backup` 陣列裡「科學文化宮 30F 觀景台」那筆的 `why` 從 `'PLN 25 · 室內 + 360° 城景，老城廣場走路 12 分'` 改成 `'PLN 30／優待 25 · 室內 + 360° 城景，老城廣場走路 12 分'`。

Day 4（Auschwitz，`:100-115` 附近）—校正 2-3：`steps` 裡 `★ 英文官方導覽` 那筆的 `cost` 從 `'PLN 150'` 改成 `'約 130–150（優待 120）'`。其餘欄位原樣轉錄。

Day 6（波茲南，`:185-201` 附近）—校正 2-5、2-6、2-8：
- `★ 教堂島 Ostrów Tumski` 那筆的 `cost` 從 `'PLN 16'` 改成 `'未收費'`
- `★ 山羊鐘樓秀` 那筆的 `sub` 從 `'每天中午限定'` 改成 `'正午一場，部分資料另有 15:00 場（現場再確認）'`
- `帝王城堡 / Stary Browar` 那筆的 `cost` 從 `'PLN 16'` 改成 `'多為免費，特展另計'`
其餘欄位原樣轉錄。

Day 5（樂斯拉夫）原樣轉錄；`redesign/data.js` 本身的 Day 5 `warn` 已含正確的「10/28 圓頂展廳不開放」查證文字與「出發前請再上 halastulecia.pl 確認一次」建議（校正表 1-4 的裁定就是保留這段舊資料原文），逐字轉錄即符合校正表要求，不必另外改寫。

Day 1（`:19-46` 附近）—校正 2-9：把 `practical` 陣列裡「Internet Kantor (Marszałkowska)」那筆的 `note` 從 `'四城最佳匯率，價差 ≤ 1%'` 改成 `'四城最佳匯率，價差 ≤ 1.5%'`（與 `safety.tips`、`practical`（transit.js 域）一致）。

Day 7（`:215-237`）—校正 1-1 與 1-2：

```js
{
  n: 7, date: '10/30 (五)', city: '華沙',
  title: 'POLIN + 起義 + 皇家城堡',
  headline: '三館連看 · 老城最後晚餐',
  tag: 'Museums',
  intensity: '高',
  // ...hardConstraints/mustBook/compressible/weather 照 data.js:215-220 原樣轉錄...
  steps: [
    {t:'10:00', label:'★ POLIN 猶太博物館', sub:'線上預約 · 含中文語音', cost:'PLN 45 (週四免費)', dur:'2.5 h'},
    {t:'13:30', label:'午餐 Tel Aviv Urban', cost:'PLN 50–80', dur:'1 h'},
    {t:'14:30', label:'★ 華沙起義博物館', sub:'3D 影院 · 互動區', cost:'PLN 35 / discount 30', dur:'2 h'},
    {t:'17:00', label:'★ 皇家城堡內部 【待確認：開放時間】', sub:'❗冬季恐 17:00 即閉館，出發前務必上 zamek-krolewski.pl 查證；若確認提早關，把城堡往前挪、科學文化宮觀景台改到晚餐前', cost:'分路線售票 30–110（PLN）', dur:'1.5 h'},
    {t:'19:30', label:'老城最後晚餐', sub:'U Fukiera / Polka', cost:'PLN 120–200', dur:'1.5 h'},
    {t:'21:00', label:'老城廣場夜燈漫步', sub:'自由收尾'},
  ],
  eat: ['Żurek 酸黑麥湯 @ U Fukiera', 'Pączki @ A. Blikle 1869'],
  warn: '❗此日四項皆尚未訂票。⚠️ 本日最大風險（待確認）：皇家城堡 10 月屬冬季時段，多方資料指向 17:00 閉館（等於最後入場更早），請自行上 zamek-krolewski.pl 查證，若屬實本日順序須調整（把城堡往前挪、科學文化宮觀景台改到晚餐前）。票價已按官網分級體系更新為：博物館/王室路線 60/45、城堡路線 95/75、宮殿路線 30/20、金票(全區) 110/90、週三免費(縮短版)。另蕭邦博物館 2026 全年閉館整修，2027/1 才重開',
  extend: [
    {label:'Bulwary Wiślane 維斯瓦河畔', when:'21:00 後老城散步延伸', why:'河濱步道 + 沙灘酒吧，皇家城堡步行 10–15 分，適合晚餐後收尾散步，免費'},
    {label:'Neon Museum 霓虹燈博物館', when:'若提前結束起義博物館可插入', why:'已遷入科學文化宮 4 樓（Marszałkowska 入口），共產時期霓虹招牌收藏，PLN 25／優待 18，可與觀景台一起看'},
    {label:'Praga 區塗鴉與 Koneser 舊釀酒廠', when:'午餐後彈性時段', why:'起義博物館到皇家城堡之間若時間寬裕，可繞道河對岸 Praga 感受工業改造街區，步行或電車皆可'},
    {label:'科學文化宮 30F 觀景台夜景版', when:'皇家城堡後、晚餐前', why:'PLN 30／優待 25，傍晚天黑後夜景與白天不同調性，可取代或加碼原本雨天備案'},
  ],
  backup: [
    {label:'三館太累', where:'擇 POLIN + 起義 二選一 → 多留 1.5 h 給城堡', why:'POLIN 動線完整需 3 h，起義內容沉重，連看會疲乏'},
    {label:'天氣轉壞', where:'科學文化宮 30 樓觀景台（室內）', why:'PLN 30／優待 25 · 45 min · 直通老城地鐵，雨天備案'},
  ],
},
```

Day 8（`:238-259`）—校正 1-6，把 11:15 退稅蓋章與 11:30 報到安檢合併：

```js
{
  n: 8, date: '10/31 (六)', city: '華沙 → 多哈',
  title: '機場日 · 14:40 QR 260 起飛',
  headline: '從容收尾 · SKM 機場線 20 分鐘',
  tag: 'Departure',
  intensity: '低',
  hardConstraints: ['11:00 前抵達華沙蕭邦機場', '如需退稅需預留更多機場時間', '不排正式景點'],
  mustBook: [],
  compressible: ['飯店周邊散步', '最後採買'],
  weather: '9° / 3°',
  steps: [
    {t:'08:00', label:'早餐 + 老城散步', cost:'PLN 40', dur:'1.5 h'},
    {t:'10:30', label:'退房 → Warszawa Centralna', dur:'10 min'},
    {t:'10:40', label:'SKM S2/S3', cost:'PLN 4.4', dur:'20 min'},
    {t:'11:00', label:'抵 Chopin 第一航廈'},
    {t:'11:15', label:'退稅蓋章 + 報到 + 安檢', sub:'Global Blue / Planet 海關櫃台先蓋章，再報到安檢', dur:'11:15–12:00'},
    {t:'14:40', label:'★ QR 260 起飛', sub:'WAW → DOH → HKG → TPE'},
  ],
  backup: [
    {label:'班機提早 2 h', where:'蕭邦機場 1F Costa Coffee · 觀景窗', why:'退稅 + 安檢順可能 12:30 就過關，1F 貴賓區外有平價咖啡'},
    {label:'紀念品最後採買', where:'Wedel + Krówki 機場店', why:'1F 出境前最後一站，伴手禮價差 +10–15% 但方便'},
  ],
},
```

Day 2/3/4/5/6 從 `redesign/data.js` 對應區塊（`:47-70`、`:71-107`、`:108-135`、`:136-171`、`:172-214`，用 `grep -n "n: [2-6],"` 定位）原樣轉錄，不修改。

- [ ] **Step 3: 語法檢查與筆數 smoke test**

```bash
node --check src/data/trip.js
node -e "import('./src/data/trip.js').then(m => { console.assert(m.days.length===8,'days should be 8'); console.assert(m.days[6].steps.find(s=>s.label.includes('待確認')),'day7 must flag 待確認'); console.assert(!m.days[7].steps.find(s=>s.t==='11:30'),'day8 11:30 slot must be merged'); console.log('trip.js OK'); })"
```

Expected: 印出 `trip.js OK`，無 assertion 錯誤。

- [ ] **Step 4: Commit**

```bash
git add src/data/trip.js
git commit -m "feat: 建立 trip.js 資料層並套用校正表 1-1/1-2/1-6/2-9"
```

---

## Task 3: `src/data/cities.js`（cities×4、cityStories×4、photoSpots×10、photoCredits×8、mapPins 50 圖釘、attractions）

**Files:**
- Create: `src/data/cities.js`
- 來源：`redesign/data.js:260-265`（cities）、`:266-279`（photoSpots）、`:280-289`（photoCredits）、`:534-598`（cityStories）、`poland-travel-guide-final.html:565`（CITIES 圖釘物件）、`poland-travel-guide-final.html:170-183`／`:224-232`／`:268-274`／`:312-318`（4 城景點表 `<h3>景點 · Sights</h3>` 後的表格）

**Interfaces:**
- Produces:
  - `export const cities` — 陣列 4 筆，欄位 `key, name, pl, tag, nights, totalNights?, stayNote?, vibe, highlights[], photo{hero,thumb}`
  - `export const cityStories` — 陣列 4 筆
  - `export const photoSpots` — 陣列 10 筆（3 筆 `bestTime` 已依校正表修正）
  - `export const photoCredits` — 陣列 8 筆
  - `export const mapPins` — 物件 `{warsaw:{center,zoom,points:[...14]}, krakow:{...19}, wroclaw:{...9}, poznan:{...8}}`，`points` 每筆 `[lat, lng, name, note, googleMapsUrl, category]`
  - `export const attractions` — 物件 `{warsaw:[...], krakow:[...], wroclaw:[...], poznan:[...]}`，每筆 `{name, tag, priceNote, mapUrl}`

- [ ] **Step 1: 轉錄 `cities`（4 筆，`redesign/data.js:260-265` 原樣轉錄）**

```js
export const cities = [
  {key:'WAW', name:'華沙', pl:'Warszawa', tag:'CAPITAL', nights:'1 + 2', totalNights:3, stayNote:'首晚倒時差 + 回程兩晚收尾', vibe:'鋼鐵摩天 × 重建老城', highlights:['POLIN 猶太博物館','起義博物館','皇家城堡','Krakowskie Przedmieście'], photo:{hero:'assets/photos/warszawa-hero.webp',thumb:'assets/photos/warszawa-thumb.webp'}},
  {key:'KRK', name:'克拉科夫', pl:'Kraków', tag:'OLD WORLD', nights:2, totalNights:2, stayNote:'兩晚承接老城、Auschwitz、鹽礦', vibe:'中世紀石板路 × 千年王城', highlights:['Wawel 城堡','中央市集 Rynek','Auschwitz 一日往返','Kazimierz 猶太區'], photo:{hero:'assets/photos/krakow-hero.webp',thumb:'assets/photos/krakow-thumb.webp'}},
  {key:'WRO', name:'樂斯拉夫', pl:'Wrocław', tag:'700 DWARFS', nights:1, vibe:'700 小矮人 × 煤氣燈點燈', highlights:['百年廳 UNESCO','全景畫 Panorama','座堂島 Ostrów Tumski','糖果屋雙屋'], photo:{hero:'assets/photos/wroclaw-hero.webp',thumb:'assets/photos/wroclaw-thumb.webp'}},
  {key:'POZ', name:'波茲南', pl:'Poznań', tag:'CRADLE', nights:1, vibe:'波蘭文明發源 × 山羊報時', highlights:['教堂島 Ostrów Tumski','12:00 山羊鐘樓秀','聖馬丁牛角麵包 PGI','帝王城堡'], photo:{hero:'assets/photos/poznan-hero.webp',thumb:'assets/photos/poznan-thumb.webp'}},
];
```

- [ ] **Step 2: 轉錄 `photoCredits`（8 筆，`redesign/data.js:280-289` 原樣轉錄，`licenseUrl` 是授權條款頁、`url` 是照片來源頁，兩者不可互換）**

原樣轉錄，8 筆結構同 `data.js` 已含的 CC 授權資料（華沙/克拉科夫/樂斯拉夫/波茲南各 hero+thumb）。

- [ ] **Step 3: 轉錄 `photoSpots`（10 筆），套用校正表第 3 節 3 筆拍照時段修正**

```js
export const photoSpots = [
  {id:'waw-oldtown', cityKey:'WAW', name:'老城市集廣場', day:1, bestTime:'16:00–16:40', light:'日落前側光打在彩色立面，廣場人少'},
  {id:'waw-castle', cityKey:'WAW', name:'皇家城堡與美人魚', day:1, bestTime:'16:30–17:15', light:'順光；城堡紅牆在低角度陽光下最飽和（已對齊 Day1 實際行程 16:45–17:45）'},
  {id:'waw-culture', cityKey:'WAW', name:'科學文化宮 30F 城景', day:7, bestTime:'16:10–17:00', light:'日落後藍調 20 分鐘，城市燈與天空同亮度'},
  {id:'krk-rynek', cityKey:'KRK', name:'中央市集廣場與聖瑪利亞聖殿', day:2, bestTime:'16:00–16:45', light:'塔樓逆光，改拍東側迴廊反射光'},
  {id:'krk-wawel', cityKey:'KRK', name:'Wawel 城堡河岸', day:2, bestTime:'15:40–16:30', light:'從 Dębnicki 橋往東拍，維斯瓦河面反光'},
  {id:'krk-kazimierz', cityKey:'KRK', name:'Kazimierz 猶太區街景', day:4, bestTime:'14:30–16:00', light:'午後柔和側光，適合窄巷與塗鴉（已對齊 Day4 實際行程 14:30–16:00）'},
  {id:'wro-rynek', cityKey:'WRO', name:'市政廳與彩色老屋', day:5, bestTime:'15:50–16:35', light:'西曬正打彩色立面，是全趟最上色的一刻'},
  {id:'wro-dwarfs', cityKey:'WRO', name:'小矮人與座堂島煤氣燈', day:5, bestTime:'16:45–17:15', light:'日落約 16:29（行程期間約 16:05–16:30 區間），點燈人約 16:45 起逐盞點燈，需高感光度'},
  {id:'poz-rynek', cityKey:'POZ', name:'舊市集廣場彩色立面', day:6, bestTime:'09:00–10:30', light:'上午柔和散射光，卡位等 12:00 山羊報時（已對齊 Day6 實際行程 09:00–10:30）'},
  {id:'poz-tumski', cityKey:'POZ', name:'教堂島 Ostrów Tumski', day:6, bestTime:'15:40–16:20', light:'雙塔逆光剪影，或轉到橋上拍側光'},
];
```

- [ ] **Step 4: 轉錄 `cityStories`（4 筆，`redesign/data.js:534-598` 原樣轉錄）**

欄位 `city, en, geo, history, stories[{title,text}](每城 3–4 則), onSite[](每城 3 個字串)`，直接從來源逐城轉錄，不做修改（校正表未列出這個集合的衝突）。

- [ ] **Step 5: 建立 `mapPins`（50 個圖釘，已套用校正表 3-1／3-2 的分類修正）**

這是校正表 3-1（4 個圖釘分類誤植：Mirror Bistro、Na Winklu 從 `star1` 改 `food`；Svensson Pierogi、Hamsa 從 `sight` 改 `food`）與 3-2（克拉科夫圖釘數確認為 19，非 20）的落地依據，直接來自 `poland-travel-guide-final.html:565` 的 `CITIES` 物件，已內含修正：

```js
export const mapPins = {
  warsaw: {
    center: [52.235, 21.01], zoom: 13,
    points: [
      [52.247744, 21.014128, "皇家城堡", "景點", "https://maps.google.com/?cid=2313057209867159998", "sight"],
      [52.249496, 20.993481, "POLIN 猶太史博物館", "景點", "https://maps.google.com/?cid=16292574584610500784", "sight"],
      [52.232394, 20.981018, "華沙起義博物館", "景點", "https://maps.google.com/?cid=12215511195580548645", "sight"],
      [52.231838, 21.005995, "科學文化宮觀景台", "景點", "https://maps.google.com/?cid=14044892037721828802", "sight"],
      [52.188512, 20.991414, "Alon Omakase ★", "米其林一星", "https://maps.google.com/?cid=8029724309073713102", "star1"],
      [52.229002, 21.023323, "NUTA ★", "米其林一星", "https://maps.google.com/?cid=4624148008162643045", "star1"],
      [52.251114, 21.036166, "hub.praga ★", "米其林一星", "https://maps.google.com/?cid=10117754456971759897", "star1"],
      [52.229941, 20.989348, "WANDAL", "必比登", "https://maps.google.com/?cid=15993615675406452524", "bib"],
      [52.236622, 20.967709, "Zagoździński", "pączki 名店", "https://maps.google.com/?cid=5270464504046978357", "food"],
      [52.252402, 21.030581, "Bar Mleczny Rusałka", "牛奶吧", "https://maps.google.com/?cid=14427558643223382901", "food"],
      [52.2333197, 21.0149273, "Pijalnia Czekolady E.Wedel（巧克力）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJ--12WPTMHkcRgAvh-nOeA94", "shop"],
      [52.24935, 21.008785, "Żabka（舊城區）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJpTk0Ah_NHkcRNn4P8JcA_64", "store"],
      [52.2310334, 21.0187045, "Vitkac", "精品百貨", "https://maps.google.com/?cid=6893272886103886879", "luxury"],
      [52.2215267, 21.0204772, "Chylak（波蘭設計師包款）", "精品", "https://maps.google.com/?cid=2015234439722332980", "luxury"],
    ],
  },
  krakow: {
    center: [50.058, 19.94], zoom: 13,
    points: [
      [50.054112, 19.935423, "Wawel 皇家城堡", "景點", "https://maps.google.com/?cid=12446225081720350104", "sight"],
      [50.061897, 19.936756, "中央市集廣場", "景點", "https://maps.google.com/?cid=14107513768635600179", "sight"],
      [50.05146, 19.948594, "Kazimierz 猶太區", "景點", "https://maps.google.com/?cid=5623518211080575812", "sight"],
      [50.04743, 19.961574, "辛德勒工廠博物館", "景點", "https://maps.google.com/?cid=3670197855150446585", "sight"],
      [50.048617, 19.946137, "Bottiglieria 1881 ★★", "全波蘭唯一二星", "https://maps.google.com/?cid=8570908113421134699", "star2"],
      [50.051709, 19.949426, "Bufet KRK", "必比登", "https://maps.google.com/?cid=861978380086701482", "bib"],
      [50.051821, 19.945448, "Folga", "必比登", "https://maps.google.com/?cid=7193800786272583343", "bib"],
      [50.064873, 19.927661, "MOLÁM Thai", "必比登", "https://maps.google.com/?cid=14914780693072191645", "bib"],
      [50.051491, 19.944291, "NOAH", "必比登", "https://maps.google.com/?cid=6279990201826816109", "bib"],
      [50.049302, 19.943241, "Nat Bistro", "必比登", "https://maps.google.com/?cid=10025714057570046192", "bib"],
      [50.051871, 19.944621, "Plac Nowy (zapiekanka)", "街食", "https://maps.google.com/?cid=8198083026094069086", "food"],
      [50.053958, 19.944839, "Mirror Bistro", "★4.7 pierogi", "https://www.google.com/maps/place/?q=place_id:ChIJOwi62GpbFkcRoi0KiVCj1dk", "food"],
      [50.07068, 19.936409, "Svensson Pierogi", "餃子", "https://maps.google.com/?cid=10705718930784059170", "food"],
      [50.064037, 19.932167, "Bar Smak", "在地口碑", "https://maps.google.com/?cid=7513589258053856766", "food"],
      [50.053182, 19.947628, "Hamsa", "以色列 hummus", "https://maps.google.com/?cid=1317891001987072687", "food"],
      [50.0527854, 19.9400151, "Ceramika Bolesławiecka（陶器）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJf581WqhbFkcR1_QG-8hJ4Vc", "shop"],
      [50.058364, 19.9382007, "World of Amber（琥珀）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJPxlI8hJbFkcR7vI2ebLVIDk", "shop"],
      [50.06171320000001, 19.9373488, "Sukiennice 布廊（伴手禮攤位）", "伴手禮", "https://www.google.com/maps/place/?q=place_id:ChIJ3Q97Bw5bFkcRc3GzJiVsH9A", "shop"],
      [50.062638, 19.937729, "Żabka（Rynek Główny）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJN54SF4BbFkcRfqYQZ51JTN4", "store"],
    ],
  },
  wroclaw: {
    center: [51.111, 17.045], zoom: 13,
    points: [
      [51.110431, 17.030885, "中央市集廣場", "景點", "https://maps.google.com/?cid=10632303817405446655", "sight"],
      [51.114463, 17.046734, "大教堂島 Ostrów Tumski", "景點", "https://maps.google.com/?cid=3827887123396229836", "sight"],
      [51.104391, 17.07528, "Afrykarium 動物園", "景點", "https://maps.google.com/?cid=6359100319840704536", "sight"],
      [51.106953, 17.077329, "百年廳 Hala Stulecia", "UNESCO", "https://maps.google.com/?cid=10763621538599936407", "sight"],
      [51.11274, 17.031823, "BABA ★", "米其林一星", "https://maps.google.com/?cid=9335659011047272773", "star1"],
      [51.114762, 17.031129, "Most ★", "米其林一星", "https://maps.google.com/?cid=9490447263206449328", "star1"],
      [51.112463, 17.029103, "IDA kuchnia i wino", "必比登", "https://maps.google.com/?cid=10589009865057440004", "bib"],
      [51.112672, 17.034294, "Miś SC", "全城最有名牛奶吧", "https://maps.google.com/?cid=9100083269168988599", "food"],
      [51.1100658, 17.0302956, "Żabka（Rynek）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJo38OWDjDD0cREV-o0Qsuquo", "store"],
    ],
  },
  poznan: {
    center: [52.408, 16.935], zoom: 13,
    points: [
      [52.40885, 16.933775, "舊市集廣場 Stary Rynek", "景點", "https://maps.google.com/?cid=15713614103977572536", "sight"],
      [52.415606, 16.948656, "大教堂島 Ostrów Tumski", "景點", "https://maps.google.com/?cid=17624504241381771360", "sight"],
      [52.408485, 16.935041, "可頌博物館", "景點", "https://maps.google.com/?cid=402526412385617111", "sight"],
      [52.402018, 16.901852, "Palmiarnia 棕櫚屋", "景點", "https://maps.google.com/?cid=10703456143872687277", "sight"],
      [52.403967, 16.929146, "Muga ★", "波茲南唯一一星", "https://maps.google.com/?cid=2998937238608160974", "star1"],
      [52.411348, 16.952952, "Na Winklu", "★4.8 pierogi", "https://maps.google.com/?cid=17998777227118824033", "food"],
      [52.407303, 16.934127, "Szarlotta", "鴨肉餃子名店", "https://maps.google.com/?cid=8072844045178633315", "food"],
      [52.407335, 16.934281, "Żabka（Stary Rynek）", "超商", "https://www.google.com/maps/place/?q=place_id:ChIJz0qhEFVbBEcRDDtONqAeGV4", "store"],
    ],
  },
};

export const pinCategoryLegend = {
  star2:  {fill:'#B8860B', line:'#3a2a06', label:'米其林二星'},
  star1:  {fill:'#E8A81E', line:'#8a5a00', label:'米其林一星'},
  bib:    {fill:'#2f6b3f', line:'#173a20', label:'必比登推介'},
  food:   {fill:'#CE2E1E', line:'#7a1a10', label:'街食／小吃／牛奶吧'},
  sight:  {fill:'#3b6ea5', line:'#1c3a58', label:'景點'},
  shop:   {fill:'#8b5cf6', line:'#4c2f8f', label:'伴手禮店家'},
  store:  {fill:'#0891b2', line:'#0c4a5e', label:'超商 Żabka'},
  luxury: {fill:'#d6336c', line:'#7a1a3d', label:'精品購物'},
};
```

- [ ] **Step 6: 轉錄 `attractions`（4 城景點表，來自 `poland-travel-guide-final.html` 各城 `<h3>景點 · Sights</h3>` 後的表格：華沙 `:172-183`〔12 列〕、克拉科夫 `:224-232`〔6 列〕、樂斯拉夫 `:268-274`〔8 列〕、波茲南 `:312-318`〔9 列〕）**

每筆物件 `{name, tag, priceNote, mapUrl}`，逐列從 HTML `<tr>` 轉錄（`name` 取 `<td class="name">` 的連結文字、`mapUrl` 取該連結 `href`、`tag` 取第二欄的 pill/rating 文字、`priceNote` 取第三欄文字）。以華沙前兩列為範例鎖定格式：

```js
export const attractions = {
  warsaw: [
    {name:'MSN 當代美術館', tag:'2024 新開', priceNote:'Plac Defilad · Gallery A 免費 · 18:00 後晚間票 PLN 30', mapUrl:'https://www.google.com/maps/search/?api=1&query=MSN%20%E7%95%B6%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8%20Warszawa'},
    {name:'Neon 霓虹博物館', tag:'遷址', priceNote:'PLN 25 / 優待 18 · 已遷入科學文化宮 4 樓（Marszałkowska 入口），可與觀景台一起看', mapUrl:'https://www.google.com/maps/search/?api=1&query=Neon%20%E9%9C%93%E8%99%B9%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa'},
    // ... 依 poland-travel-guide-final.html:172-183 其餘 10 列同格式轉錄（Kolejkowo、海報博物館、波蘭歷史博物館、E.Wedel、皇家城堡、起義博物館、POLIN、科學文化宮觀景台、Łazienki+Wilanów、蕭邦博物館）
  ],
  krakow: [ /* 依 :224-232 共 6 列同格式轉錄 */ ],
  wroclaw: [ /* 依 :268-274 共 8 列同格式轉錄 */ ],
  poznan: [ /* 依 :312-318 共 9 列同格式轉錄 */ ],
};
```

- [ ] **Step 7: 語法檢查與筆數斷言**

```bash
node --check src/data/cities.js
node -e "
import('./src/data/cities.js').then(m => {
  console.assert(m.cities.length===4,'cities 4');
  console.assert(m.photoSpots.length===10,'photoSpots 10');
  console.assert(m.photoCredits.length===8,'photoCredits 8');
  const counts = Object.fromEntries(Object.entries(m.mapPins).map(([k,v])=>[k,v.points.length]));
  console.assert(counts.warsaw===14 && counts.krakow===19 && counts.wroclaw===9 && counts.poznan===8, 'pin counts '+JSON.stringify(counts));
  const total = Object.values(counts).reduce((a,b)=>a+b,0);
  console.assert(total===50, 'total pins 50, got '+total);
  const mirror = m.mapPins.krakow.points.find(p=>p[2]==='Mirror Bistro');
  console.assert(mirror[5]==='food', 'Mirror Bistro must be food category');
  console.log('cities.js OK', counts, 'total='+total);
});
"
```

Expected: `cities.js OK { warsaw: 14, krakow: 19, wroclaw: 9, poznan: 8 } total=50`，無 assertion 失敗。

- [ ] **Step 8: Commit**

```bash
git add src/data/cities.js
git commit -m "feat: 建立 cities.js 資料層並套用校正表 3-1/3-2/拍照時段修正"
```

---

## Task 4: `src/data/dining.js`（米其林、各城美食表、主餐廳、備案餐廳、必吃美食）

**Files:**
- Create: `src/data/dining.js`
- 來源：`poland-travel-guide-final.html:353-378`（michelin section 05：總表 4 列 + 訂位表 9 列）、`:186-217`／`:236-262`／`:280-291`／`:322-336`（4 城美食表，各 21/13/11/11 列，位於各城 section 的 `<h3>美食 · Food</h3>` 之後）、`redesign/data.js:377-391`（foods 12 筆）、`:392-437`（cityFood 4 城共 35 筆）、`:438-480`（foodBackup 4 城共 32 筆）

**Interfaces:**
- Produces:
  - `export const michelinSummary` — 陣列 4 筆 `{city, stars, star2List, star1List, bibList}`
  - `export const michelinReservations` — 陣列 9 筆 `{restaurant, perPerson, channel}`
  - `export const cityDining` — 物件 `{warsaw:[...21], krakow:[...13], wroclaw:[...11], poznan:[...11]}`，每筆 `{name, tier, highlight, mapUrl}`
  - `export const cityFood` — 陣列 4 筆（`city, en, items[]`，`items[]` 子欄位 `tag, name, note, book, map?`）
  - `export const foodBackup` — 陣列 4 筆（結構同 `cityFood`）
  - `export const foods` — 陣列 12 筆 `{n, cn, pl, desc}`

- [ ] **Step 1: 轉錄 `michelinSummary`（4 列）與 `michelinReservations`（9 列，`poland-travel-guide-final.html:359-373`）**

`michelinReservations` 逐列從表格轉錄，第一列作為格式範例：

```js
export const michelinReservations = [
  {restaurant:'⭐⭐ Bottiglieria 1881（克拉科夫）', perPerson:'290 / 360', channel:'自家電話 +48 660 661 756 · ul. Bocheńska 5 · 平日另有單點，週末僅套餐'},
  {restaurant:'⭐ Alon Omakase（華沙）', perPerson:'~1100', channel:'omakase.eu 線上 · 取消/減人照收全額 · Edomae 壽司'},
  {restaurant:'⭐ Most（樂斯拉夫）', perPerson:'490', channel:'miedzy-mostami.pl · 僅週四–六 · 需訂金 · Księcia Witolda 1'},
  {restaurant:'⭐ Muga（波茲南）', perPerson:'390–540', channel:'官網/電話 · 法系套餐'},
  {restaurant:'⭐ NUTA（華沙）', perPerson:'€€€€', channel:'Michelin 線上/官網 · plac Trzech Krzyży（ETHOS）· 主廚 Andrea Camastra'},
  {restaurant:'⭐ Rozbrat 20（華沙）', perPerson:'€€€€', channel:'rozbrat20.com.pl · 需信用卡 · +12.5% 服務費 · smart casual、12 歲以上'},
  {restaurant:'⭐ BABA（樂斯拉夫）', perPerson:'€€', channel:'Michelin 免費線上 · Nożownicza 26 席 · 主廚 Beata Śniechowska'},
  {restaurant:'Bib · Bufet KRK（克拉科夫）', perPerson:'€€', channel:'二星副牌 · 較好訂 · 訂不到二星的替代'},
  {restaurant:'Bib · IDA kuchnia i wino（樂斯拉夫）', perPerson:'149', channel:'套餐含酒 · 全趟最高CP'},
];
```

`michelinSummary` 依 `:359-363` 的 4 列城市/星級/Bib 表轉錄成結構化欄位（`stars` 存星等文字如 `'★★'`／`'★'`，`star2List`/`star1List`/`bibList` 存餐廳名稱陣列）。

- [ ] **Step 2: 轉錄 `cityDining`（4 城美食表，共 56 列）**

每城從 `<h3>美食 · Food</h3>` 後的 `<table>` 逐列轉錄 `{name, tier, highlight, mapUrl}`（`tier` 取 pill/rating 欄位文字如 `'★4.8（134） ★ 新'`，`highlight` 取「重點/招牌」欄文字）。以華沙第一列鎖定格式：

```js
export const cityDining = {
  warsaw: [
    {name:'Alon Omakase', tier:'★4.8（134） ★ 新', highlight:'2026 新一星 · 招牌：Edomae 握壽司 omakase，以頂級松露搭配見長 · 位少需早訂', mapUrl:'https://maps.google.com/?cid=8029724309073713102'},
    // ... 其餘 20 列依 poland-travel-guide-final.html 華沙 section「美食」表格同格式轉錄
  ],
  krakow: [ /* 13 列 */ ],
  wroclaw: [ /* 11 列 */ ],
  poznan: [ /* 11 列 */ ],
};
```

- [ ] **Step 3: 轉錄 `cityFood`（4 城共 35 筆，`redesign/data.js:392-437` 原樣轉錄）與 `foodBackup`（4 城共 32 筆，`:438-480` 原樣轉錄）**

兩者結構相同：`{city, en, items:[{tag, name, note, book, map?}]}`，這兩個集合校正表未列出衝突，原樣轉錄即可。

- [ ] **Step 4: 轉錄 `foods`（12 筆，`redesign/data.js:377-391` 原樣轉錄）**

```js
export const foods = [
  {n:'01', cn:'波蘭餃子', pl:'Pierogi', desc:'國民料理，半月形餃子有鹹甜兩款。最經典 Pierogi Ruskie（馬鈴薯加 twaróg 起司）。'},
  // ... 其餘 11 筆依 redesign/data.js:377-391 原樣轉錄
];
```

- [ ] **Step 5: 語法檢查與筆數斷言**

```bash
node --check src/data/dining.js
node -e "
import('./src/data/dining.js').then(m => {
  console.assert(m.michelinSummary.length===4,'michelinSummary 4');
  console.assert(m.michelinReservations.length===9,'michelinReservations 9');
  console.assert(m.cityDining.warsaw.length===21 && m.cityDining.krakow.length===13 && m.cityDining.wroclaw.length===11 && m.cityDining.poznan.length===11, 'cityDining counts');
  console.assert(m.cityFood.length===4,'cityFood 4 groups');
  console.assert(m.foodBackup.length===4,'foodBackup 4 groups');
  console.assert(m.foods.length===12,'foods 12');
  console.log('dining.js OK');
});
"
```

Expected: `dining.js OK`，無 assertion 失敗。

- [ ] **Step 6: Commit**

```bash
git add src/data/dining.js
git commit -m "feat: 建立 dining.js 資料層（米其林、城市美食、主餐廳、備案）"
```

---

## Task 5: `src/data/tickets.js`（門票速查 21 列 + 城市分組票券 17 項）

**Files:**
- Create: `src/data/tickets.js`
- 來源：`poland-travel-guide-final.html:389-411`（fares 表 21 列）、`redesign/data.js:349-374`（tickets 4 城共 17 項）

**Interfaces:**
- Produces:
  - `export const fares` — 陣列 21 筆 `{name, fullPrice, discountPrice, note, officialUrl, mapUrl}`
  - `export const ticketsByCity` — 陣列 4 筆（`data.js` 原結構：`{city, items:[[名稱,價格說明], ...]}`）

- [ ] **Step 1: 轉錄 `fares`（21 列），逐項套用校正表裁決**

HTML 原文在「霓虹博物館」「古市政廳博物館」兩列**已經是校正後的正確內容**（分別已寫「科學文化宮 4 樓」「2026/7–2027/11 整修，行程期間不開放」），直接照抄即可，不需另外修改；唯一要動手改的是 **Panorama Racławicka 優待價**（校正表 3-4：HTML 原文優待欄是空的 `—`，改成 `35`）：

```js
export const fares = [
  {name:'華沙 · 皇家城堡', fullPrice:'30–110', discountPrice:'20–90', note:'分路線售票，見上方明細 · 週三免費', officialUrl:'https://www.zamek-krolewski.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%9A%87%E5%AE%B6%E5%9F%8E%E5%A0%A1'},
  {name:'華沙 · 科學文化宮觀景台', fullPrice:'30', discountPrice:'25', note:'已更新（原標 25）', officialUrl:'https://pkin.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E7%A7%91%E5%AD%B8%E6%96%87%E5%8C%96%E5%AE%AE%E8%A7%80%E6%99%AF%E5%8F%B0'},
  {name:'華沙 · Neon 霓虹博物館', fullPrice:'25', discountPrice:'18', note:'科學文化宮 4 樓', officialUrl:'https://www.neonmuzeum.org/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20Neon%20%E9%9C%93%E8%99%B9%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'華沙 · MSN 當代美術館', fullPrice:'免費', discountPrice:'—', note:'Gallery A 免費 · 晚間票 30', officialUrl:'https://artmuseum.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20MSN%20%E7%95%B6%E4%BB%A3%E7%BE%8E%E8%A1%93%E9%A4%A8'},
  {name:'華沙 · 波蘭歷史博物館', fullPrice:'以官網', discountPrice:'—', note:'2026 新館群（城堡區）', officialUrl:'https://muzhp.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20%E6%B3%A2%E8%98%AD%E6%AD%B7%E5%8F%B2%E5%8D%9A%E7%89%A9%E9%A4%A8%20Warszawa'},
  {name:'華沙 · E.Wedel 巧克力體驗館', fullPrice:'以官網', discountPrice:'—', note:'2026 新開', officialUrl:'https://fabrykaczekolady.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E8%8F%AF%E6%B2%99%20E.Wedel%20Warszawa'},
  {name:'克拉科夫 · Wawel 王冠寶庫', fullPrice:'47', discountPrice:'35', note:'含皇家花園 · 逐展售票', officialUrl:'https://wawel.krakow.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E7%8E%8B%E5%86%A0%E5%AF%B6%E5%BA%AB'},
  {name:'克拉科夫 · Wawel 全區聯票', fullPrice:'199', discountPrice:'149', note:'Wawel dla pasjonatów', officialUrl:'https://wawel.krakow.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20Wawel%20%E5%85%A8%E5%8D%80%E8%81%AF%E7%A5%A8'},
  {name:'克拉科夫 · 辛德勒工廠', fullPrice:'60', discountPrice:'45', note:'ul. Lipowa 4', officialUrl:'https://muzeumkrakowa.pl/oddzialy/fabryka-emalia-oskara-schindlera', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E8%BE%9B%E5%BE%B7%E5%8B%92%E5%B7%A5%E5%BB%A0'},
  {name:'克拉科夫 · 維利奇卡鹽礦', fullPrice:'143', discountPrice:'121', note:'英語團含導覽 · 11/1 休', officialUrl:'https://www.kopalnia.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E7%B6%AD%E5%88%A9%E5%A5%87%E5%8D%A1%E9%B9%BD%E7%A4%A6%20Wieliczka'},
  {name:'克拉科夫 · 奧斯威辛', fullPrice:'免費*', discountPrice:'—', note:'*須線上預約 · 上午強制導覽 130–150', officialUrl:'https://visit.auschwitz.org/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E5%85%8B%E6%8B%89%E7%A7%91%E5%A4%AB%20%E5%A5%A7%E6%96%AF%E5%A8%81%E8%BE%9B%20O%C5%9Bwi%C4%99cim'},
  {name:'樂斯拉夫 · Afrykarium／動物園', fullPrice:'~60', discountPrice:'50', note:'線上購票 · 動態定價', officialUrl:'https://zoo.wroclaw.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Afrykarium%EF%BC%8F%E5%8B%95%E7%89%A9%E5%9C%92'},
  {name:'樂斯拉夫 · Panorama Racławicka', fullPrice:'50', discountPrice:'35', note:'（校正表 3-4：官網優待價一併補上）', officialUrl:'https://mnwr.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Panorama%20Rac%C5%82awicka'},
  {name:'樂斯拉夫 · 百年廳', fullPrice:'25', discountPrice:'20', note:'每日開放 · 10/28（本行程當天）圓頂展廳不開放（已查證，見 Day 5）；行前 3–5 天仍建議上官網再確認', officialUrl:'https://www.halastulecia.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20%E7%99%BE%E5%B9%B4%E5%BB%B3'},
  {name:'樂斯拉夫 · Hydropolis', fullPrice:'45', discountPrice:'36', note:'週末全票 47', officialUrl:'https://hydropolis.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Hydropolis'},
  {name:'樂斯拉夫 · Kolejkowo', fullPrice:'55', discountPrice:'45', note:'Sky Tower 1 樓', officialUrl:'https://kolejkowo.pl/wroclaw', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%A8%82%E6%96%AF%E6%8B%89%E5%A4%AB%20Kolejkowo'},
  {name:'波茲南 · Palmiarnia 棕櫚屋', fullPrice:'19', discountPrice:'15', note:'', officialUrl:'http://www.palmiarnia.poznan.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20Palmiarnia%20%E6%A3%95%E6%AB%9A%E5%B1%8B'},
  {name:'波茲南 · 可頌博物館', fullPrice:'39 起', discountPrice:'35 起', note:'場次制，非自由參觀', officialUrl:'https://rogalowemuzeum.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%AF%E9%A0%8C%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 帝王城堡', fullPrice:'多免費', discountPrice:'—', note:'CK Zamek 文化中心', officialUrl:'https://ckzamek.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%B8%9D%E7%8E%8B%E5%9F%8E%E5%A0%A1'},
  {name:'波茲南 · 古市政廳博物館', fullPrice:'閉館中', discountPrice:'—', note:'2026/7–2027/11 整修，行程期間不開放', officialUrl:'https://mnp.art.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E5%8F%A4%E5%B8%82%E6%94%BF%E5%BB%B3%E5%8D%9A%E7%89%A9%E9%A4%A8'},
  {name:'波茲南 · 考古博物館', fullPrice:'10', discountPrice:'6', note:'週二免費', officialUrl:'https://www.muzarp.poznan.pl/', mapUrl:'https://www.google.com/maps/search/?api=1&query=%E6%B3%A2%E8%8C%B2%E5%8D%97%20%E8%80%83%E5%8F%A4%E5%8D%9A%E7%89%A9%E9%A4%A8'},
];
```

（21 筆：華沙 6 + 克拉科夫 6 + 樂斯拉夫 5 + 波茲南 4 = 21，與 `content-inventory.md` 記載一致。）

- [ ] **Step 2: 轉錄 `ticketsByCity`（4 城共 17 項，`redesign/data.js:349-374` 原樣轉錄，保留 data.js 既有的舊版票券資料作為對照，不刪除任何一筆）**

```js
export const ticketsByCity = [
  {city:'華沙', items:[
    ['皇家城堡', 'PLN 50 / 40 / 100 分級 · 週三免費（新版分路線售票見 fares）'],
    ['POLIN 猶太歷史', 'PLN 45 · 週四免費'],
    ['華沙起義博物館', 'PLN 35 · discount 30'],
    ['蕭邦博物館', '2026 整年閉館'],
    ['科學文化宮觀景台', 'PLN 25（新版見 fares：30/優待25）'],
    ['MSN 現代藝術博物館', 'Gallery A 免費 · 18:00 後晚間票 PLN 30'],
  ]},
  {city:'克拉科夫', items:[
    ['瓦維爾城堡套票', 'PLN 45–65'],
    ['辛德勒工廠', 'PLN 60 · 優待 45（以官網為準）'],
    ['聖瑪麗教堂登塔', 'PLN 20'],
    ['奧斯威辛 Educator 導覽', 'PLN 150（新版見 fares：約130–150/優待120）'],
    ['維利奇卡鹽礦', 'PLN 143 · 優待 121'],
    ['地下市集博物館', 'PLN 32'],
  ]},
  {city:'樂斯拉夫', items:[
    ['百年廳 Hala Stulecia', 'PLN 30 · ❗10/28 圓頂展廳不開放（新版票價見 fares：25/優待20）'],
    ['拉茨瓦維採全景畫', 'PLN 50'],
  ]},
  {city:'波茲南', items:[
    ['牛角麵包博物館', 'PLN 25'],
    ['帝王城堡', 'PLN 16（新版見 fares：多為免費）'],
    ['古市政廳博物館', '❗2026/7–2027/11 整修閉館，行程期間無法入內（見 fares）'],
  ]},
];
```

- [ ] **Step 3: 語法檢查與斷言（含校正表機械檢查項目）**

```bash
node --check src/data/tickets.js
node -e "
import('./src/data/tickets.js').then(m => {
  console.assert(m.fares.length===21, 'fares 21, got '+m.fares.length);
  const neon = m.fares.find(f=>f.name.includes('霓虹'));
  console.assert(neon.note.includes('科學文化宮') && !neon.note.includes('Praga'), 'neon museum location fixed');
  const townhall = m.fares.find(f=>f.name.includes('古市政廳'));
  console.assert(townhall.note.includes('整修') && townhall.fullPrice!=='10', 'poznan town hall closed, no PLN10');
  const panorama = m.fares.find(f=>f.name.includes('Panorama'));
  console.assert(panorama.discountPrice==='35', 'panorama discount fixed to 35');
  console.log('tickets.js OK');
});
"
```

Expected: `tickets.js OK`，無 assertion 失敗。

- [ ] **Step 4: Commit**

```bash
git add src/data/tickets.js
git commit -m "feat: 建立 tickets.js 資料層並套用校正表 1-2/1-3/1-4/3-4/2-1~2-8"
```

---

## Task 6: `src/data/transit.js`（市內交通、機場接駁、App、票券選擇、實用路線、practical）

**Files:**
- Create: `src/data/transit.js`
- 來源：`poland-travel-guide-final.html:421-472`（section 07 全部子區塊）、`redesign/data.js:503-512`（practical 6 筆）

**Interfaces:**
- Produces: `export const transitFares`（4 筆）、`export const airportTransit`（6 筆，含 rowspan 兩組）、`export const recommendedApps`（4 筆）、`export const passChecklist`（4 筆字串）、`export const usefulRoutes`（5 筆字串）、`export const practical`（6 筆，含校正表 2-9 換匯價差修正）

- [ ] **Step 1: 轉錄 `transitFares`（4 列，`:422-429`）**

```js
export const transitFares = [
  {city:'華沙 ZTM', short:'20 分 3.40', min90:'7', hour24:'15', note:'涵蓋電車/巴士/地鐵/SKM · 第一區'},
  {city:'克拉科夫 KMK', short:'15 分 4', min90:'9', hour24:'20', note:'2026/3 起新價 · 單次票 6'},
  {city:'樂斯拉夫 MPK', short:'15 分 3.20', min90:'7', hour24:'15', note:'短程全國最便宜 · 單程票 4.60'},
  {city:'波茲南 ZTM', short:'15 分 5', min90:'9', hour24:'18', note:'短程最貴 · 45 分 7（無中間檔）'},
];
```

- [ ] **Step 2: 轉錄 `airportTransit`（6 列，`:432-439`，用 `route` 欄位重複標記取代 HTML 的 `rowspan`）**

```js
export const airportTransit = [
  {route:'華沙蕭邦機場 → 市中心', method:'🚆 SKM/KM 火車', price:'4.40', time:'~25–30 分', note:'買至少 75 分鐘票（涵蓋轉乘）· 06:00–23:00 · 到 Śródmieście/Centralna 站'},
  {route:'華沙蕭邦機場 → 市中心', method:'🚌 175 路巴士', price:'4.40', time:'~30 分', note:'04:58–23:58，每 15–20 分一班 · 直達市中心＋近舊城'},
  {route:'華沙蕭邦機場 → 市中心', method:'🚕 計程車/Bolt', price:'30–35', time:'~20 分', note:'機場內認明官方排班計程車，避免搭訕攬客'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🚆 SKA1 火車', price:'20', time:'17–18 分', note:'唯一班次，直達方向 Wieliczka Rynek Kopalnia · 04:17 首班，約每 30 分一班到 22:17 · 此票價與市內單程票不同，另計'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🚌 300 路巴士', price:'依區', time:'~30–40 分', note:'10:00–20:00 每 15 分一班 · 到 Rondo Grunwaldzkie，靠近舊城 · 機場屬 I+II 區，需買對應區間票'},
  {route:'克拉科夫 Balice 機場 → 市中心', method:'🌙 902 夜間巴士', price:'依區', time:'~40–45 分', note:'深夜/凌晨航班備案 · 到火車站東側'},
];
```

- [ ] **Step 3: 轉錄 `recommendedApps`（4 筆，`:443-448`）、`passChecklist`（4 筆字串，`:451-455`）、`usefulRoutes`（5 筆字串，`:459-463`）**

```js
export const recommendedApps = [
  {name:'📱 Jakdojade（首選）', desc:'波蘭最普及的大眾運輸 App，四城都支援。可查即時時刻、規劃路線、App 內直接買票並自動啟用；上車前記得先在 App 內啟用電子票（未啟用視同無票，2026 罰款 PLN 133–266）。錢包儲值支援信用卡／Apple Pay。★4.4（157 萬則評論）。'},
  {name:'💳 車上機台感應卡（最簡單）', desc:'不裝 App 也行：車上或站牌的售票機直接感應信用卡／手機／手錶，選好票種按「Kup i skasuj（購買並驗票）」即完成，系統自動綁定在該卡上，查票時感應同一張卡即可，免列印、免額外驗票步驟。支援 Visa/Mastercard 感應、Apple Pay、Google Pay、BLIK。'},
  {name:'🗺️ Google Maps', desc:'路線規劃同樣好用、四城公車電車時刻都有收錄，適合已經很熟悉、只需要「怎麼走」的人；買票仍需搭配 Jakdojade 或現場機台。'},
  {name:'🚗 Bolt', desc:'叫車 App，四城都有涵蓋。深夜、雨天或懶得等車時的備案，價格透明、免小費文化。'},
];

export const passChecklist = [
  '單程／15–20 分短票最省 — 老城區多在步行範圍，一天搭乘 3 趟以下用短票通常比 24h 票划算。',
  '24 小時票 — 一天內要搭 4 趟以上（例如安排較遠景點來回）再考慮買，四城價格 15–20 PLN 不等，見上表。',
  '多日券（48h／72h／7 日） — 本行程每城只停留 1–2 晚，通常用不到；除非同一城市安排 3 天以上再評估。',
  '觀光城市卡（Kraków Card 等）——含景點門票＋交通，但需一天刷 3 個以上付費景點才划算；本行程景點分散在多天，多數情況下單買門票 + 短程交通票更划算，不特別建議加購。',
];

export const usefulRoutes = [
  '克拉科夫舊城 → Kazimierz — 搭電車 6、8、10、13 路直達猶太區入口，省下步行 20 分鐘。',
  '華沙機場往舊城 — 175 路巴士坐到底站，步行 4–5 分鐘即達皇家之路／舊城區，比火車轉乘更省事。',
  '夜間交通 — 四城電車多在 23:00–00:00 收班；深夜改搭夜間巴士（克拉科夫 600 開頭路線，如 601、662，取代電車路線）或 Bolt 叫車。',
  '下車要按鈴 — 巴士（非電車）不會每站必停，要下車須按扶手上的「STOP」按鈕告知司機，否則可能直接開過站。',
  '查票員抽查 — 便服查票員會不定時上車查票，出示手機票券或已感應的卡片即可；電子票務必記得「啟用」這一步，光買票沒啟用等同無票。',
];
```

- [ ] **Step 4: 轉錄 `practical`（6 筆，`redesign/data.js:503-512` 原樣轉錄——這裡的換匯說明已經是校正表要求的 ≤1.5%，不用修改，只有 Task 2 裡 Day1 的那筆需要改）**

```js
export const practical = [
  {tag:'左行寄物', name:'火車站 Locker', note:'WAW Centralna / KRK Główny / WRO Główny / POZ Główny 都有自助 locker。小箱 PLN 8–12 / 大箱 PLN 12–18 · 24 h 為一單位。'},
  {tag:'換錢', name:'Kantor 民間匯兌', note:'機場 / 觀光區匯率最差。市區「Internet Kantor」、「Kantor Pomocna」買賣價差 ≤ 1.5%。⚠ 看到「0% Commission」要警覺。'},
  {tag:'SIM 卡', name:'Play / Plus / Orange', note:'蕭邦機場到達層櫃台、市區 Empik / Żabka 都有。PLN 30 起含 30 天無限上網 + 通話。台灣免簽歐盟漫遊不適用波蘭費率。'},
  {tag:'付款', name:'信用卡 + Revolut', note:'四城 95% 商家收 Visa / Master，含廣場攤販。Apple Pay 普及。建議帶 PLN 200–300 現金應付小費 / 教堂 / 鄉間。'},
  {tag:'退稅', name:'Tax Free 海關蓋章', note:'單筆 PLN 200 以上於 Tax Free 標誌商店可退 8–18% VAT。離境前在蕭邦機場 / KRK 機場海關櫃台蓋章再投退稅信箱。'},
  {tag:'交通卡', name:'單程票 vs 24h 票', note:'華沙 / 克拉科夫 24 h 票約 PLN 18，當日搭 3 趟以上划算。Jakdojade / Koleo App 查時刻 + 直接買票。'},
];
```

- [ ] **Step 5: 語法檢查與筆數斷言**

```bash
node --check src/data/transit.js
node -e "
import('./src/data/transit.js').then(m => {
  console.assert(m.transitFares.length===4,'transitFares 4');
  console.assert(m.airportTransit.length===6,'airportTransit 6');
  console.assert(m.recommendedApps.length===4,'recommendedApps 4');
  console.assert(m.passChecklist.length===4,'passChecklist 4');
  console.assert(m.usefulRoutes.length===5,'usefulRoutes 5');
  console.assert(m.practical.length===6,'practical 6');
  console.assert(m.practical.every(p=>!p.note.includes('≤ 1%') || p.note.includes('≤ 1.5%')),'no stray 1% figure');
  console.log('transit.js OK');
});
"
```

Expected: `transit.js OK`，無 assertion 失敗。

- [ ] **Step 6: Commit**

```bash
git add src/data/transit.js
git commit -m "feat: 建立 transit.js 資料層"
```

---

## Task 7: `src/data/shopping.js`（伴手禮、精品購物、超商）

**Files:**
- Create: `src/data/shopping.js`
- 來源：`poland-travel-guide-final.html:479-500`（souvenir 14 卡片 + 精品購物 2 列）、`:510-522`（store 7 卡片）、`redesign/data.js:524-533`（shopping 7 筆）

**Interfaces:**
- Produces: `export const souvenirCards`（14 筆 `{title, desc}`）、`export const luxuryShopping`（2 筆 `{shop, city, note}`）、`export const shopping`（7 筆，`data.js` 原結構 `{tag, name, note}`）、`export const zabkaCards`（7 筆 `{title, desc}`）

- [ ] **Step 1: 轉錄 `souvenirCards`（14 筆，`:481-494`）**

```js
export const souvenirCards = [
  {title:'波羅的海琥珀 Bursztyn', desc:'「波蘭黃金」；蜂蜜/威士忌色透明系，項鍊/手鍊/耳環。含昆蟲或罕見色澤較貴。各城珠寶店，認明 handmade。'},
  {title:'Bolesławiec 陶器', desc:'深藍底配白色圓點花紋，手繪炻器，耐用實用。原產地在 Bolesławiec，各城有專賣店。'},
  {title:'伏特加 Wódka（不喝酒可略過）', desc:'透明瓶身，Żubrówka 瓶內有一根綠色野牛草最好認；Wyborowa、Sobieski、Luksusowa、J.A. Baczewski 也常見。'},
  {title:'巧克力 · 糖果', desc:'E. Wedel 老牌深棕包裝；Ptasie Mleczko 藍白紙盒，巧克力棉花糖；Krówki 奶油糖、Michałki、Kukułki 銀色包裝。'},
  {title:'Prince Polo 巧克力威化棒', desc:'紅金配色長條包裝，波蘭國民零食，超商 3–5 PLN 隨手包；巧克力/花生/椰子多口味，適合當辦公室伴手禮。'},
  {title:'Delicje 果醬夾心餅', desc:'橘黃色圓形包裝盒，Wedel 出品，海綿蛋糕夾杏桃果醬裹巧克力；茶點好搭檔，包裝精美適合送禮。'},
  {title:'Mieszanka Krakowska 克拉科夫綜合糖', desc:'金黃色鐵盒印花包裝，Wawel 品牌經典什錦巧克力糖，克拉科夫限定款，適合當紀念品。'},
  {title:'Paluszki 鹹餅乾棒', desc:'透明袋裝可見金黃色細長餅乾棒，原味／起司／罌粟籽口味，配啤酒或純吃皆宜。'},
  {title:'波蘭花草茶 · 蜂蜜', desc:'Herbapol 綠色系花草茶包輕便好帶；miód lipowy 椴樹蜜呈琥珀金色，市集常見小罐裝。'},
  {title:'⚠️ Kabanosy 煙燻香腸乾', desc:'深褐紅色細長條、真空包裝，波蘭超人氣肉乾零食，超商／超市都買得到。當地吃很推薦，但台灣海關嚴禁肉類製品入境（防治非洲豬瘟），別帶回台灣，出境前吃完或留在當地。'},
  {title:'Toruń 薑餅 Pierniki', desc:'深褐色心型/圓形餅乾，常見錫盒或印花紙盒裝，全波蘭知名甜點禮，密封包裝好帶。'},
  {title:'Nalewka 水果利口酒（不喝酒可略過）', desc:'深紅寶石色澤，華沙傳統，櫻桃 wiśniówka 最有名，玻璃瓶身常見手寫標籤。'},
  {title:'oscypek 煙燻羊酪', desc:'紡錘形、表面壓花紋、煙燻後呈金黃色，Tatra／Podhale 山區特產，認明產地標。'},
  {title:'城市特色', desc:'波茲南專屬 rogal świętomarciński 金黃可頌，內餡白罌粟籽；克拉科夫 Wawel 巧克力＋現買 obwarzanek 麻花圈。'},
];

export const luxuryShopping = [
  {shop:'Vitkac', city:'華沙', note:'中東歐最大精品百貨，Gucci／Balenciaga／Saint Laurent／Burberry 等；週日休'},
  {shop:'Chylak（Le Petit Trou）', city:'華沙', note:'波蘭設計師精品包款，Koszykowa 街；Mokotowska 街區另有多家波蘭獨立設計師精品店可順路逛'},
];
```

（`souvenirCards` 的 note 段落最後另有一段「去哪買」文字，含琥珀店的兩個名稱 S&A Amber 與 World of Amber 並列——校正表 3-6 裁定兩者都保留、不二選一，轉錄時原樣保留這段文字即可。）

- [ ] **Step 2: 轉錄 `shopping`（7 筆，`redesign/data.js:524-533` 原樣轉錄）**

```js
export const shopping = [
  // 依 redesign/data.js:524-533 的 7 筆 {tag, name, note} 原樣轉錄
];
```

- [ ] **Step 3: 轉錄 `zabkaCards`（7 筆，`:513-520`）**

```js
export const zabkaCards = [
  {title:'招牌熱狗', desc:'紅白配色熱狗機台最好認，口味：klasyczna（經典）／kurczak（雞）／grillowana（烤腸）／czarna（黑麵包），可自選醬料。約 6–9 PLN，部分門市由「Robbie」機器人自動製作，40 秒出餐。'},
  {title:'💳 免辦 App 也能買', desc:'不需要 Żappka 帳號，直接用感應信用卡／Apple Pay／Google Pay 在機台或櫃檯結帳即可。App 只有在想集點、預先點餐、或要進 Żabka Nano 無人店時才用得到，觀光客可以完全跳過註冊。'},
  {title:'📱 App 進階功能', desc:'想集點可下載 Żappka App（需門號收簡訊驗證，用台灣門號多半也收得到）；Żabka Nano 無人店用手機掃碼開門、自動結帳，全程免排隊。'},
  {title:'☕ 咖啡與熱食', desc:'現煮咖啡約 5–8 PLN，比連鎖咖啡店便宜一半以上；另有微波即食餐 Szamamm、三明治 Tomcio Paluch、果汁 Wycisk，適合早餐或宵夜。'},
  {title:'🕐 營業時間', desc:'多數門市 6:00–23:00 或更晚，車站／機場／市中心精華地段常有 24 小時店，深夜落地或早班火車前補給都方便。'},
  {title:'🧾 其他服務', desc:'彩券、卡片存提現、繳費、包裹寄取（InPost 智能取件櫃常設在店外）；多數店員英文有限，觸控機台通常有英文介面可切換。'},
  {title:'其他選擇', desc:'Biedronka（瓢蟲）折扣超市分店最多，適合買伴手禮零食；Lidl、Carrefour Express 也常見；Orlen 加油站熱狗也小有名氣。'},
];
```

- [ ] **Step 4: 語法檢查與筆數斷言**

```bash
node --check src/data/shopping.js
node -e "
import('./src/data/shopping.js').then(m => {
  console.assert(m.souvenirCards.length===14,'souvenirCards 14');
  console.assert(m.luxuryShopping.length===2,'luxuryShopping 2');
  console.assert(m.shopping.length===7,'shopping 7');
  console.assert(m.zabkaCards.length===7,'zabkaCards 7');
  console.log('shopping.js OK');
});
"
```

Expected: `shopping.js OK`，無 assertion 失敗。

- [ ] **Step 5: Commit**

```bash
git add src/data/shopping.js
git commit -m "feat: 建立 shopping.js 資料層"
```

---

## Task 8: `src/data/essentials.js`（波蘭語、打包清單、基本須知、安全資訊、行前提醒）

**Files:**
- Create: `src/data/essentials.js`
- 來源：`redesign/data.js:599-613`（phrases 12 筆）、`:614-620`（packingDefault）、`:621-631`（about 8 筆）、`:481-502`（safety）、`poland-travel-guide-final.html:527-535`（notes 8 項 checklist，另依校正表補入百年廳提醒，共輸出 9 筆）

**Interfaces:**
- Produces: `export const phrases`（12 筆三元陣列）、`export const packingDefault`（物件，4 分類）、`export const about`（8 筆二元陣列）、`export const safety`（物件 `{emergency[], embassy[], tips[]}`）、`export const preDepartureNotes`（9 筆字串，已套用校正表 1-4／1-5／3-3）

- [ ] **Step 1: 轉錄 `phrases`（12 筆，`redesign/data.js:599-613` 原樣轉錄，三元陣列 `[中文, 波蘭語, 音譯]`，其中 4 筆音譯為空字串）**

```js
export const phrases = [
  // 依 redesign/data.js:599-613 原樣轉錄 12 筆
];
```

- [ ] **Step 2: 轉錄 `packingDefault`（`:614-620` 原樣轉錄，4 大分類）**

```js
export const packingDefault = {
  // 依 redesign/data.js:614-620 原樣轉錄：證件與金錢(5)、電子(5)、衣物（10月波蘭）(5)、藥品盥洗(4)
};
```

- [ ] **Step 3: 轉錄 `about`（8 筆，`:621-631` 原樣轉錄，二元陣列 `[標籤, 內容]`）**

```js
export const about = [
  // 依 redesign/data.js:621-631 原樣轉錄 9 筆
];
```

- [ ] **Step 4: 轉錄 `safety`（`:481-502` 原樣轉錄）**

```js
export const safety = {
  emergency: [
    ['歐洲通用緊急', '112'],
    ['警察 Policja', '997'],
    ['消防 Straż Pożarna', '998'],
    ['救護 Pogotowie', '999'],
    ['市政警察', '986'],
  ],
  embassy: [
    ['駐波蘭台北代表處', 'Al. Jerozolimskie 179, Warszawa'],
    ['辦公室電話', '+48 22 213 0060'],
    ['急難救助專線', '+48 668 027 574'],
    ['外交部 24h 專線', '+886 800 085 095'],
  ],
  tips: [
    {label:'觀光陷阱', text:'廣場「免費試衣」拍照後索費；中央車站黑計程車（堅持 Bolt / Uber）；市中心換匯陷阱（Kantor 買賣價差 ≤ 1.5%）'},
    {label:'禮儀', text:'進教堂脫帽；Auschwitz 禁笑鬧自拍；勿把波蘭當俄國；餐廳小費約 10%'},
    {label:'治安', text:'全球安全指數前 30。注意觀光區扒手（火車站、Rynek）；貴重物品用前背包'},
    {label:'就醫', text:'自來水可生飲；Apteka 藥局普及；建議投保涵蓋緊急醫療的旅平險'},
  ],
};
```

- [ ] **Step 5: 轉錄 `preDepartureNotes`（9 筆），套用校正表 1-4（百年廳圓頂）、1-5（日落時間）、3-3（回程班機日期敘述）**

來源是 `poland-travel-guide-final.html:527-535` 的 9 項 checklist，逐項轉錄並修正其中 3 項：

```js
export const preDepartureNotes = [
  '10/25（日）夏令時間結束 — 時鐘回撥一小時。10 月整月大賣場週日不營業（含當日）；Żabka／小店／加油站／藥局照常。',
  '日照比想像中長 — 行程期間（10/26–10/31）實際日落約 16:05–16:30（樂斯拉夫 10/28 約 16:29），不是「15:35–15:50」；戶外行程可安排到接近日落前收尾，Day 5 樂斯拉夫點燈儀式約 16:45 起、時間上是來得及的。',
  '10/31 諸聖節前日 — 克拉科夫／華沙人潮多；辛德勒工廠、Wawel 部分展區 11/1、11/11 閉館（Wawel 自身公告的閉館日，不含 11/3）。你的回程班機是 10/31 14:40 起飛（WAW → DOH），不是 11/1，這些閉館日都在你離境之後，對本趟無實質影響。',
  '米其林訂位 — 二星＋各一星出發前 3–4 週訂；華沙 splurge 級 3–5 週。',
  'PKP Super Promo — 30 天窗口約 9/23 開（克拉科夫→樂斯拉夫等），開賣即搶。',
  '火車實務 — IC/EIP 對號入座；Koleo App 可劃位購票；上車查票需出示票券（電子截圖亦可）；大件行李放車廂端行李架。',
  '先訂清單 — 奧斯威辛（visit.auschwitz.org）、辛德勒工廠（muzeumkrakowa.pl）、米其林餐廳。',
  '諸聖節燭海（11/1 Wszystkich Świętych）— 波蘭最動人的傳統：墓園在 10/30–11/1 點滿蠟燭成燭海。你 10/30–31 在華沙，可傍晚到 Powązki 老墓園感受；11/1 當天是燭海最盛的高峰日，但你已在 10/31 14:40 搭機離境，只能感受前一晚的氣氛。',
  '樂斯拉夫百年廳圓頂展廳 — 10/28（本行程當天）確定不開放（已查證官方預約日曆），行前 3–5 天仍建議上 halastulecia.pl 再確認一次是否有其他臨時異動。',
];
```

- [ ] **Step 6: 語法檢查與機械檢查（含校正表全站關鍵字驗收）**

```bash
node --check src/data/essentials.js
node -e "
import('./src/data/essentials.js').then(m => {
  console.assert(m.phrases.length===12,'phrases 12');
  console.assert(m.about.length===8,'about 8');
  console.assert(m.preDepartureNotes.length===9,'preDepartureNotes 9');
  const joined = m.preDepartureNotes.join(' ');
  console.assert(!joined.includes('15:35') && !joined.includes('15:50'), 'no wrong sunset time');
  console.assert(joined.includes('10/28') && joined.includes('圓頂'), 'hala stulecia dome note present');
  console.log('essentials.js OK');
});
"
```

Expected: `essentials.js OK`，無 assertion 失敗。

- [ ] **Step 7: Commit**

```bash
git add src/data/essentials.js
git commit -m "feat: 建立 essentials.js 資料層並套用校正表 1-4/1-5/3-3"
```

---

## Task 9: `src/styles/main.css`（編輯誌感視覺系統）

**Files:**
- Create: `src/styles/main.css`

**Interfaces:**
- Produces: CSS class 慣例供 Task 10–14 的模板使用：`.page`（頁面容器）、`.nav`（導覽列）、`.nav-dropdown`（下拉選單）、`.hero`（頁首視覺區）、`.section-num`（章節編號如 "Day 01"）、`.card`、`.table-editorial`、`.tag-red`/`.tag-yellow`/`.tag-todo`（校正表 🔴/🟡/❓ 提示樣式）、`.map-container`（Leaflet 地圖容器，固定高度）、`.map-legend`（沿用來源既有樣式邏輯）、`.footer`

- [ ] **Step 1: 建立色彩與字體變數**

```css
:root {
  --paper: #F7F3EC;
  --ink: #2B2620;
  --accent: #C1552C;
  --line: #DAD2C2;
  --red: #B3261E;
  --font-display: 'Playfair Display', 'Noto Sans TC', serif;
  --font-body: 'Noto Sans TC', sans-serif;
  --font-mono: 'Inter', sans-serif;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-body);
  line-height: 1.7;
}
h1, h2, h3 { font-family: var(--font-display); font-weight: 700; }
.section-num {
  font-family: var(--font-mono);
  color: var(--accent);
  letter-spacing: 0.1em;
  font-size: 0.85rem;
}
```

- [ ] **Step 2: 導覽列（CSS-only 下拉，桌機專用）**

```css
.nav { display: flex; gap: 2rem; align-items: center; padding: 1.25rem 3rem; border-bottom: 1px solid var(--line); position: sticky; top: 0; background: var(--paper); z-index: 10; }
.nav a { color: var(--ink); text-decoration: none; font-family: var(--font-mono); font-size: 0.95rem; }
.nav-dropdown { position: relative; }
.nav-dropdown > ul { display: none; position: absolute; top: 100%; left: 0; background: var(--paper); border: 1px solid var(--line); min-width: 220px; padding: 0.5rem 0; list-style: none; margin: 0; }
.nav-dropdown:hover > ul { display: block; }
.nav-dropdown > ul li a { display: block; padding: 0.5rem 1.25rem; }
.nav-dropdown > ul li a:hover { background: var(--accent); color: var(--paper); }
```

- [ ] **Step 3: 版面容器、卡片、表格**

```css
.page { max-width: 1100px; margin: 0 auto; padding: 3rem; }
.hero { padding: 4rem 0 2rem; border-bottom: 2px solid var(--ink); margin-bottom: 2rem; }
.card { border: 1px solid var(--line); padding: 1.25rem; border-radius: 2px; background: #FCFAF5; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
.table-editorial { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
.table-editorial th, .table-editorial td { border-bottom: 1px solid var(--line); padding: 0.6rem 0.8rem; text-align: left; }
.table-editorial th { font-family: var(--font-mono); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
```

- [ ] **Step 4: 校正表提示樣式（🔴 高風險／❓ 待確認）**

```css
.tag-red { display: inline-block; background: var(--red); color: #fff; font-family: var(--font-mono); font-size: 0.75rem; padding: 0.15rem 0.5rem; border-radius: 2px; }
.tag-todo { display: inline-block; border: 1px solid var(--accent); color: var(--accent); font-family: var(--font-mono); font-size: 0.75rem; padding: 0.1rem 0.45rem; border-radius: 2px; }
.callout-risk { background: #FBEAE8; border-left: 4px solid var(--red); padding: 1rem 1.25rem; margin: 1.5rem 0; }
```

- [ ] **Step 5: Leaflet 地圖容器與圖例（沿用 `poland-travel-guide-final.html` 已驗證可用的樣式邏輯）**

```css
.map-container { width: 100%; height: 480px; border: 1px solid var(--line); margin: 1.5rem 0; }
.map-legend { background: rgba(251,248,240,.95); border: 1px solid var(--line); border-radius: 2px; padding: 8px 10px; font-family: var(--font-mono); font-size: 11px; line-height: 1.9; color: var(--ink); box-shadow: 0 1px 4px rgba(0,0,0,.15); }
.map-legend div { display: flex; align-items: center; gap: 6px; }
.map-legend span { display: inline-block; width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
```

- [ ] **Step 6: Footer**

```css
.footer { border-top: 1px solid var(--line); padding: 2rem 3rem; font-family: var(--font-mono); font-size: 0.8rem; color: #6b6455; }
```

- [ ] **Step 7: 語法檢查（CSS 沒有內建 syntax checker，改用簡單字串檢查沒有明顯漏掉的大括號）**

```bash
node -e "
const fs = require('fs');
const css = fs.readFileSync('src/styles/main.css','utf8');
const open = (css.match(/{/g)||[]).length, close = (css.match(/}/g)||[]).length;
console.assert(open===close, 'unbalanced braces: open='+open+' close='+close);
console.log('main.css brace check OK', open, close);
"
```

Expected: `main.css brace check OK` 且左右括號數相等。

- [ ] **Step 8: Commit**

```bash
git add src/styles/main.css
git commit -m "feat: 建立編輯誌感視覺系統 main.css"
```

---

## Task 10: `src/templates/layout.mjs`（共用外殼）

**Files:**
- Create: `src/templates/layout.mjs`

**Interfaces:**
- Consumes: 無（純函式）
- Produces: `export function renderLayout({ title, activeNav, bodyHtml, extraHead = '' })` → 回傳完整 HTML 字串（含 `<!DOCTYPE html>`），供 Task 11–14 的所有模板呼叫。

- [ ] **Step 1: 寫 `renderLayout`**

```js
export function renderLayout({ title, activeNav, bodyHtml, extraHead = '' }) {
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · POLSKA 波蘭行</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Noto+Sans+TC:wght@400;500;700&family=Inter:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/main.css">
${extraHead}
</head>
<body>
<nav class="nav">
  <a href="/index.html" style="font-family:var(--font-display);font-weight:700;">POLSKA</a>
  <div class="nav-dropdown">
    <a href="#">每日行程 ▾</a>
    <ul>
      ${[1,2,3,4,5,6,7,8].map(n => `<li><a href="/day-${String(n).padStart(2,'0')}.html">Day ${n}</a></li>`).join('')}
    </ul>
  </div>
  <div class="nav-dropdown">
    <a href="#">城市指南 ▾</a>
    <ul>
      <li><a href="/city-warszawa.html">華沙 Warszawa</a></li>
      <li><a href="/city-krakow.html">克拉科夫 Kraków</a></li>
      <li><a href="/city-wroclaw.html">樂斯拉夫 Wrocław</a></li>
      <li><a href="/city-poznan.html">波茲南 Poznań</a></li>
    </ul>
  </div>
  <div class="nav-dropdown">
    <a href="#">實用資訊 ▾</a>
    <ul>
      <li><a href="/practical/booking.html">訂票時程</a></li>
      <li><a href="/practical/dining.html">米其林餐廳</a></li>
      <li><a href="/practical/tickets.html">門票速查</a></li>
      <li><a href="/practical/transit.html">市內交通</a></li>
      <li><a href="/practical/shopping.html">伴手禮</a></li>
      <li><a href="/practical/essentials.html">實用資訊</a></li>
      <li><a href="/practical/notes.html">行前提醒</a></li>
    </ul>
  </div>
</nav>
<main class="page">
${bodyHtml}
</main>
<footer class="footer">
  <p>POLSKA 波蘭行 · jack926509/Poland-trip · 票價與開放時間查證於 2026-08，實際以官網為準。</p>
</footer>
</body>
</html>`;
}
```

- [ ] **Step 2: 語法檢查**

```bash
node --check src/templates/layout.mjs
node -e "
import('./src/templates/layout.mjs').then(m => {
  const html = m.renderLayout({title:'測試', activeNav:'home', bodyHtml:'<p>hi</p>'});
  console.assert(html.includes('<!DOCTYPE html>'), 'has doctype');
  console.assert(html.includes('<nav class=\"nav\">'), 'has nav');
  console.assert(html.includes('<footer'), 'has footer');
  console.log('layout.mjs OK');
});
"
```

Expected: `layout.mjs OK`，無 assertion 失敗。

- [ ] **Step 3: Commit**

```bash
git add src/templates/layout.mjs
git commit -m "feat: 建立共用頁面外殼 layout.mjs"
```

---

## Task 11: `src/templates/home.mjs`（首頁）

**Files:**
- Create: `src/templates/home.mjs`

**Interfaces:**
- Consumes: `renderLayout` from `../templates/layout.mjs`；`meta, days, flights` from `../data/trip.js`；`cities` from `../data/cities.js`
- Produces: `export function renderHome({ meta, days, flights, cities })` → HTML 字串

- [ ] **Step 1: 寫 `renderHome`**

```js
import { renderLayout } from './layout.mjs';

export function renderHome({ meta, days, flights, cities }) {
  const dayRows = days.map(d => `
    <tr>
      <td>Day ${d.n}</td>
      <td>${d.date}</td>
      <td>${d.city}</td>
      <td>${d.title}</td>
      <td><a href="/day-${String(d.n).padStart(2,'0')}.html">看當天 →</a></td>
    </tr>`).join('');

  const cityCards = cities.map(c => `
    <div class="card">
      <h3>${c.name} <span class="section-num">${c.pl}</span></h3>
      <p>${c.vibe}</p>
      <p>${c.highlights.join(' · ')}</p>
      <a href="/city-${cityFileKey(c.key)}.html">看城市指南 →</a>
    </div>`).join('');

  const body = `
    <div class="hero">
      <p class="section-num">${meta.dateRange}</p>
      <h1>${meta.route}</h1>
      <p>${meta.style}</p>
    </div>
    <h2>8 天總覽</h2>
    <table class="table-editorial">
      <thead><tr><th>天數</th><th>日期</th><th>城市</th><th>主題</th><th></th></tr></thead>
      <tbody>${dayRows}</tbody>
    </table>
    <h2>4 個城市</h2>
    <div class="grid">${cityCards}</div>
    <h2>航班摘要</h2>
    <p>去程：${flights.out.map(f => f.leg).join(' → ')}</p>
    <p>回程：${flights.back.map(f => f.leg).join(' → ')}</p>
    <h2>實用資訊</h2>
    <p>
      <a href="/practical/booking.html">訂票時程</a> ·
      <a href="/practical/dining.html">米其林餐廳</a> ·
      <a href="/practical/tickets.html">門票速查</a> ·
      <a href="/practical/transit.html">市內交通</a> ·
      <a href="/practical/shopping.html">伴手禮</a> ·
      <a href="/practical/essentials.html">實用資訊</a> ·
      <a href="/practical/notes.html">行前提醒</a>
    </p>`;

  return renderLayout({ title: '首頁', activeNav: 'home', bodyHtml: body });
}

function cityFileKey(key) {
  return { WAW: 'warszawa', KRK: 'krakow', WRO: 'wroclaw', POZ: 'poznan' }[key];
}
```

- [ ] **Step 2: 語法檢查與 smoke render**

```bash
node --check src/templates/home.mjs
node -e "
Promise.all([import('./src/templates/home.mjs'), import('./src/data/trip.js'), import('./src/data/cities.js')]).then(([tpl, trip, c]) => {
  const html = tpl.renderHome({ meta: trip.meta, days: trip.days, flights: trip.flights, cities: c.cities });
  console.assert(html.includes('<table'), 'has table');
  console.assert((html.match(/day-0/g)||[]).length >= 8, 'has 8 day links');
  console.log('home.mjs OK');
});
"
```

Expected: `home.mjs OK`，無 assertion 失敗。

- [ ] **Step 3: Commit**

```bash
git add src/templates/home.mjs
git commit -m "feat: 建立首頁模板 home.mjs"
```

---

## Task 12: `src/templates/day.mjs`（每日行程頁）

**Files:**
- Create: `src/templates/day.mjs`

**Interfaces:**
- Consumes: `renderLayout`；單一 `day` 物件（見 Task 2 定義的欄位）
- Produces: `export function renderDay(day)` → HTML 字串。頁面須含：時間表（steps）、車班（train，若有）、警示（warn，若有，含 🔴 高風險視覺提示）、延伸選項（extend，若有）、備案（backup）、拍照建議引用（由 build.mjs 傳入當天對應的 `photoSpots` 過濾結果，見 Step 2）。

- [ ] **Step 1: 寫 `renderDay`（基本結構）**

```js
import { renderLayout } from './layout.mjs';

export function renderDay(day, photoSpotsForDay = []) {
  const stepsHtml = day.steps.map(s => `
    <tr>
      <td class="section-num">${s.t}</td>
      <td>${s.label}${s.sub ? `<br><small>${s.sub}</small>` : ''}</td>
      <td>${s.cost || '—'}</td>
      <td>${s.dur || '—'}</td>
    </tr>`).join('');

  const trainHtml = day.train ? `
    <h2>當天車班</h2>
    <p>${day.train.type} ${day.train.from ? day.train.from + ' → ' + day.train.to : ''} ${day.train.dep} → ${day.train.arr}（${day.train.dur}，PLN ${day.train.price}）${day.train.leg ? '　' + day.train.leg : ''}</p>` : '';

  const warnHtml = day.warn ? `
    <div class="callout-risk">
      <span class="tag-red">重要</span>
      <p>${day.warn}</p>
    </div>` : '';

  const extendHtml = day.extend ? `
    <h2>可插入的延伸選項</h2>
    <ul>${day.extend.map(e => `<li><b>${e.label}</b>（${e.when}）— ${e.why}</li>`).join('')}</ul>` : '';

  const backupHtml = `
    <h2>備案</h2>
    <ul>${day.backup.map(b => `<li><b>${b.label}</b>：${b.where} — ${b.why}</li>`).join('')}</ul>`;

  const photoHtml = photoSpotsForDay.length ? `
    <h2>拍照建議</h2>
    <ul>${photoSpotsForDay.map(p => `<li><b>${p.name}</b>（${p.bestTime}）— ${p.light}</li>`).join('')}</ul>` : '';

  const eatHtml = day.eat ? `<h2>順路必吃</h2><ul>${day.eat.map(e => `<li>${e}</li>`).join('')}</ul>` : '';

  const body = `
    <div class="hero">
      <p class="section-num">Day ${String(day.n).padStart(2,'0')} · ${day.date}</p>
      <h1>${day.title}</h1>
      <p>${day.headline}</p>
    </div>
    <h2>時間表</h2>
    <table class="table-editorial">
      <thead><tr><th>時間</th><th>行程</th><th>花費</th><th>時長</th></tr></thead>
      <tbody>${stepsHtml}</tbody>
    </table>
    ${trainHtml}
    ${warnHtml}
    ${eatHtml}
    ${extendHtml}
    ${backupHtml}
    ${photoHtml}`;

  return renderLayout({ title: `Day ${day.n} ${day.title}`, activeNav: 'day', bodyHtml: body });
}
```

- [ ] **Step 2: 語法檢查與 smoke render（用 Day 7 驗證「待確認」標記會出現在頁面上）**

```bash
node --check src/templates/day.mjs
node -e "
Promise.all([import('./src/templates/day.mjs'), import('./src/data/trip.js')]).then(([tpl, trip]) => {
  const day7 = trip.days.find(d => d.n === 7);
  const html = tpl.renderDay(day7);
  console.assert(html.includes('待確認'), 'day-07 page must include 待確認');
  const day8 = trip.days.find(d => d.n === 8);
  const html8 = tpl.renderDay(day8);
  console.assert(!html8.includes('11:30'), 'day-08 page must not show separate 11:30 slot');
  console.log('day.mjs OK');
});
"
```

Expected: `day.mjs OK`，無 assertion 失敗。

- [ ] **Step 3: Commit**

```bash
git add src/templates/day.mjs
git commit -m "feat: 建立每日行程頁模板 day.mjs"
```

---

## Task 13: `src/templates/city.mjs`（城市指南頁，含 Leaflet 地圖）

**Files:**
- Create: `src/templates/city.mjs`

**Interfaces:**
- Consumes: `renderLayout`；單一城市所需資料：`city`（來自 `cities`）、`cityKey`（`'warsaw'|'krakow'|'wroclaw'|'poznan'`）、`mapPinsForCity`（`mapPins[cityKey]`）、`pinCategoryLegend`、`attractionsForCity`、`dining`（`cityDining[cityKey]`）、`cityFoodForCity`（`cityFood` 依城市名稱找到的那筆，含 `items[].book`/`items[].map` 訂位與地圖連結，渲染成獨立的「主餐廳推薦」清單，不能只傳進去不渲染）、`foodBackupForCity`、`photoSpotsForCity`、`story`（`cityStories` 對應項）
- Produces: `export function renderCity(params)` → HTML 字串，其中 `<script>` 內嵌 Leaflet 初始化邏輯（沿用 `poland-travel-guide-final.html` 已驗證可用的 `initMaps` 邏輯，改成單城市版本）。**克拉科夫城市頁須顯著標「待確認」提示**（校正表第 4 節：辛德勒工廠週日最後入場時間未定案）。

- [ ] **Step 1: 寫 `renderCity`，含地圖容器與圖釘資料內嵌**

```js
import { renderLayout } from './layout.mjs';

export function renderCity({ city, cityKey, mapData, legend, attractionsForCity, dining, cityFoodForCity, foodBackupForCity, photoSpotsForCity, story }) {
  const legendEntries = Object.entries(legend);

  const attractionRows = attractionsForCity.map(a => `
    <tr><td><a href="${a.mapUrl}" target="_blank" rel="noopener">${a.name}</a></td><td>${a.tag}</td><td>${a.priceNote}</td></tr>`).join('');

  const diningRows = dining.map(d => `
    <tr><td><a href="${d.mapUrl}" target="_blank" rel="noopener">${d.name}</a></td><td>${d.tier}</td><td>${d.highlight}</td></tr>`).join('');

  const bookingHtml = cityFoodForCity ? `
    <h2>主餐廳推薦（含訂位方式）</h2>
    <ul>${cityFoodForCity.items.map(i => `<li><b>${i.name}</b>（${i.tag}）— ${i.note}${i.book ? `　<a href="${i.book}" target="_blank" rel="noopener">訂位 →</a>` : ''}${i.map ? `　<a href="${i.map}" target="_blank" rel="noopener">地圖 →</a>` : ''}</li>`).join('')}</ul>` : '';

  const backupHtml = foodBackupForCity ? `
    <h2>備案餐廳</h2>
    <ul>${foodBackupForCity.items.map(i => `<li><b>${i.name}</b>（${i.tag}）— ${i.note}</li>`).join('')}</ul>` : '';

  const photoHtml = photoSpotsForCity.length ? `
    <h2>拍照建議</h2>
    <ul>${photoSpotsForCity.map(p => `<li><b>${p.name}</b>（Day ${p.day}，${p.bestTime}）— ${p.light}</li>`).join('')}</ul>` : '';

  const krakowNotice = cityKey === 'krakow' ? `
    <div class="callout-risk"><span class="tag-todo">待確認</span><p>辛德勒工廠 10 月週日實際最後入場時間兩份資料對不上（舊資料 18:30，新資料開放至 20:00），本行程排 17:30 入場仍有緩衝，但建議行前上 muzeumkrakowa.pl 再確認一次。</p></div>` : '';

  const body = `
    <div class="hero">
      <p class="section-num">${city.pl}</p>
      <h1>${city.name}</h1>
      <p>${city.vibe}</p>
    </div>
    <div id="map-${cityKey}" class="map-container"></div>
    <div class="map-legend-static">${legendEntries.map(([k,v]) => `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${v.fill};border:1.5px solid ${v.line};margin-right:4px;"></span>${v.label}`).join('　')}</div>
    ${krakowNotice}
    <h2>城市故事</h2>
    <p>${story ? story.history : ''}</p>
    <h2>景點</h2>
    <table class="table-editorial"><thead><tr><th>景點</th><th>類型</th><th>票價／備註</th></tr></thead><tbody>${attractionRows}</tbody></table>
    <h2>餐廳</h2>
    <table class="table-editorial"><thead><tr><th>店家</th><th>等級</th><th>重點招牌</th></tr></thead><tbody>${diningRows}</tbody></table>
    ${bookingHtml}
    ${backupHtml}
    ${photoHtml}
  `;

  const mapScript = `
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script>
(function(){
  var mapData = ${JSON.stringify(mapData)};
  var COLORS = ${JSON.stringify(legend)};
  function init(){
    var el = document.getElementById('map-${cityKey}');
    if (!el || typeof L === 'undefined') return;
    var map = L.map(el, {scrollWheelZoom:false}).setView(mapData.center, mapData.zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'&copy; OpenStreetMap contributors', maxZoom:19}).addTo(map);
    mapData.points.forEach(function(p){
      var lat=p[0], lng=p[1], name=p[2], note=p[3], gurl=p[4], cat=p[5]||'sight';
      var col = COLORS[cat] || COLORS.sight;
      var marker = L.circleMarker([lat,lng], {radius:8, weight:2, color:col.line, fillColor:col.fill, fillOpacity:0.9}).addTo(map);
      marker.bindPopup('<b>' + name + '</b><br>' + note + (gurl ? '<br><a href="' + gurl + '" target="_blank" rel="noopener">在 Google Maps 開啟 →</a>' : ''));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
</script>`;

  return renderLayout({ title: city.name, activeNav: 'city', bodyHtml: body, extraHead: mapScript });
}
```

- [ ] **Step 2: 語法檢查與 smoke render（驗證地圖容器與圖釘數會出現在輸出 HTML 裡）**

```bash
node --check src/templates/city.mjs
node -e "
Promise.all([
  import('./src/templates/city.mjs'),
  import('./src/data/cities.js'),
  import('./src/data/dining.js'),
]).then(([tpl, c, d]) => {
  const html = tpl.renderCity({
    city: c.cities.find(x => x.key==='KRK'),
    cityKey: 'krakow',
    mapData: c.mapPins.krakow,
    legend: c.pinCategoryLegend,
    attractionsForCity: [],
    dining: [],
    cityFoodForCity: d.cityFood.find(f => f.city === '克拉科夫'),
    foodBackupForCity: d.foodBackup.find(f => f.city === '克拉科夫'),
    photoSpotsForCity: c.photoSpots.filter(p => p.cityKey === 'KRK'),
    story: null,
  });
  console.assert(html.includes('id=\"map-krakow\"'), 'has map container');
  console.assert((JSON.parse(html.match(/var mapData = (\\{.*?\\});/s)[1]).points.length) === 19, 'krakow points embedded = 19');
  console.assert(html.includes('待確認'), 'krakow page must show 待確認 notice');
  console.assert(html.includes('主餐廳推薦'), 'cityFood booking list must render');
  console.log('city.mjs OK');
});
"
```

Expected: `city.mjs OK`，無 assertion 失敗。

- [ ] **Step 3: Commit**

```bash
git add src/templates/city.mjs
git commit -m "feat: 建立城市指南頁模板 city.mjs（含 Leaflet 真實比例地圖）"
```

---

## Task 14: `src/templates/practical.mjs`（7 個實用資訊頁）

**Files:**
- Create: `src/templates/practical.mjs`

**Interfaces:**
- Consumes: `renderLayout`
- Produces: 7 個具名匯出函式，各自對應一個實用資訊頁：
  - `export function renderBooking({ flights, trains, stay, bookingTiers, reservations })`
  - `export function renderDining({ michelinSummary, michelinReservations })`
  - `export function renderTickets({ fares, ticketsByCity })`（**須顯著標示 Auschwitz 訂票開放時間「待確認」**，校正表第 4 節）
  - `export function renderTransit({ transitFares, airportTransit, recommendedApps, passChecklist, usefulRoutes })`
  - `export function renderShopping({ souvenirCards, luxuryShopping, zabkaCards })`
  - `export function renderEssentials({ phrases, packingDefault, about, safety })`
  - `export function renderNotes({ preDepartureNotes })`

- [ ] **Step 1: 寫 `renderBooking`**

```js
import { renderLayout } from './layout.mjs';

export function renderBooking({ flights, trains, stay, bookingTiers, reservations }) {
  const tiersHtml = bookingTiers.map(t => `
    <h3>${t.tier}</h3>
    <p>${t.note}</p>
    <ul>${t.items.map(i => `<li><a href="${i.url}" target="_blank" rel="noopener">${i.name}</a></li>`).join('')}</ul>`).join('');

  const reservationsHtml = reservations.map(r => `<li><b>${r.when}</b>：${r.what}</li>`).join('');
  const trainsHtml = trains.map(t => `<tr><td>${t.seg}</td><td>${t.date}</td><td>${t.type}</td><td>${t.dep}→${t.arr}</td><td>${t.dur}</td><td>PLN ${t.price}</td></tr>`).join('');
  const stayHtml = stay.map(s => `<li><b>${s.city}</b>（${s.pick}）：${s.note}</li>`).join('');

  const body = `
    <div class="hero"><p class="section-num">Booking</p><h1>訂票時程</h1></div>
    <h2>訂票優先順序</h2>
    ${tiersHtml}
    <h2>訂票時程表</h2>
    <ul>${reservationsHtml}</ul>
    <h2>城際火車</h2>
    <table class="table-editorial"><thead><tr><th>路段</th><th>日期</th><th>車種</th><th>時刻</th><th>時長</th><th>票價</th></tr></thead><tbody>${trainsHtml}</tbody></table>
    <h2>住宿選區</h2>
    <ul>${stayHtml}</ul>`;

  return renderLayout({ title: '訂票時程', activeNav: 'practical', bodyHtml: body });
}
```

- [ ] **Step 2: 寫 `renderDining`**

```js
export function renderDining({ michelinSummary, michelinReservations }) {
  const summaryHtml = michelinSummary.map(s => `<tr><td>${s.city}</td><td>${s.stars}</td><td>${(s.bibList||[]).join(' · ')}</td></tr>`).join('');
  const resHtml = michelinReservations.map(r => `<tr><td>${r.restaurant}</td><td>${r.perPerson}</td><td>${r.channel}</td></tr>`).join('');
  const body = `
    <div class="hero"><p class="section-num">Michelin 2026</p><h1>米其林餐廳</h1></div>
    <table class="table-editorial"><thead><tr><th>城市</th><th>星級</th><th>Bib Gourmand</th></tr></thead><tbody>${summaryHtml}</tbody></table>
    <h2>訂位與每人預算</h2>
    <table class="table-editorial"><thead><tr><th>餐廳</th><th>每人 PLN</th><th>訂位管道</th></tr></thead><tbody>${resHtml}</tbody></table>`;
  return renderLayout({ title: '米其林餐廳', activeNav: 'practical', bodyHtml: body });
}
```

- [ ] **Step 3: 寫 `renderTickets`（含「待確認」提示）**

```js
export function renderTickets({ fares, ticketsByCity }) {
  const faresHtml = fares.map(f => `<tr><td><a href="${f.officialUrl}" target="_blank" rel="noopener">${f.name}</a></td><td>${f.fullPrice}</td><td>${f.discountPrice}</td><td>${f.note}</td></tr>`).join('');
  const body = `
    <div class="hero"><p class="section-num">Tickets · 2026</p><h1>門票速查</h1></div>
    <div class="callout-risk"><span class="tag-todo">待確認</span><p>Auschwitz 訂票開放時間兩份資料差距很大（一說參觀日前 90 天、一說提前 2–3 週），直接影響你現在該不該動手訂，請上 visit.auschwitz.org 確認後再排。</p></div>
    <table class="table-editorial"><thead><tr><th>景點</th><th>全票</th><th>優待</th><th>備註</th></tr></thead><tbody>${faresHtml}</tbody></table>`;
  return renderLayout({ title: '門票速查', activeNav: 'practical', bodyHtml: body });
}
```

- [ ] **Step 4: 寫 `renderTransit`、`renderShopping`、`renderEssentials`、`renderNotes`**

```js
export function renderTransit({ transitFares, airportTransit, recommendedApps, passChecklist, usefulRoutes }) {
  const faresHtml = transitFares.map(f => `<tr><td>${f.city}</td><td>${f.short}</td><td>${f.min90}</td><td>${f.hour24}</td><td>${f.note}</td></tr>`).join('');
  const airportHtml = airportTransit.map(a => `<tr><td>${a.route}</td><td>${a.method}</td><td>${a.price}</td><td>${a.time}</td><td>${a.note}</td></tr>`).join('');
  const appsHtml = recommendedApps.map(a => `<div class="card"><h4>${a.name}</h4><p>${a.desc}</p></div>`).join('');
  const body = `
    <div class="hero"><p class="section-num">City Transit</p><h1>市內交通</h1></div>
    <table class="table-editorial"><thead><tr><th>城市</th><th>短程</th><th>90分</th><th>24小時</th><th>備註</th></tr></thead><tbody>${faresHtml}</tbody></table>
    <h2>機場↔市區</h2>
    <table class="table-editorial"><thead><tr><th>路線</th><th>方式</th><th>票價</th><th>時間</th><th>備註</th></tr></thead><tbody>${airportHtml}</tbody></table>
    <h2>推薦 App</h2>
    <div class="grid">${appsHtml}</div>
    <h2>幾日券怎麼選</h2>
    <ul>${passChecklist.map(p => `<li>${p}</li>`).join('')}</ul>
    <h2>實用路線與技巧</h2>
    <ul>${usefulRoutes.map(r => `<li>${r}</li>`).join('')}</ul>`;
  return renderLayout({ title: '市內交通', activeNav: 'practical', bodyHtml: body });
}

export function renderShopping({ souvenirCards, luxuryShopping, zabkaCards }) {
  const souvenirHtml = souvenirCards.map(s => `<div class="card"><h4>${s.title}</h4><p>${s.desc}</p></div>`).join('');
  const luxuryHtml = luxuryShopping.map(l => `<tr><td>${l.shop}</td><td>${l.city}</td><td>${l.note}</td></tr>`).join('');
  const zabkaHtml = zabkaCards.map(z => `<div class="card"><h4>${z.title}</h4><p>${z.desc}</p></div>`).join('');
  const body = `
    <div class="hero"><p class="section-num">Souvenirs</p><h1>伴手禮</h1></div>
    <div class="grid">${souvenirHtml}</div>
    <h2>精品購物</h2>
    <table class="table-editorial"><thead><tr><th>店家</th><th>城市</th><th>備註</th></tr></thead><tbody>${luxuryHtml}</tbody></table>
    <h2>超商怎麼逛</h2>
    <div class="grid">${zabkaHtml}</div>`;
  return renderLayout({ title: '伴手禮', activeNav: 'practical', bodyHtml: body });
}

export function renderEssentials({ phrases, packingDefault, about, safety }) {
  const phrasesHtml = phrases.map(p => `<tr><td>${p[0]}</td><td>${p[1]}</td><td>${p[2] || '—'}</td></tr>`).join('');
  const aboutHtml = about.map(a => `<li><b>${a[0]}</b>：${a[1]}</li>`).join('');
  const emergencyHtml = safety.emergency.map(e => `<li>${e[0]}：${e[1]}</li>`).join('');
  const body = `
    <div class="hero"><p class="section-num">Essentials</p><h1>實用資訊</h1></div>
    <h2>基本須知</h2>
    <ul>${aboutHtml}</ul>
    <h2>常用波蘭語</h2>
    <table class="table-editorial"><thead><tr><th>中文</th><th>波蘭語</th><th>音譯</th></tr></thead><tbody>${phrasesHtml}</tbody></table>
    <h2>緊急聯絡</h2>
    <ul>${emergencyHtml}</ul>`;
  return renderLayout({ title: '實用資訊', activeNav: 'practical', bodyHtml: body });
}

export function renderNotes({ preDepartureNotes }) {
  const body = `
    <div class="hero"><p class="section-num">Pre-trip</p><h1>行前提醒</h1></div>
    <ul>${preDepartureNotes.map(n => `<li>${n}</li>`).join('')}</ul>`;
  return renderLayout({ title: '行前提醒', activeNav: 'practical', bodyHtml: body });
}
```

- [ ] **Step 5: 語法檢查與 smoke render**

```bash
node --check src/templates/practical.mjs
node -e "
Promise.all([
  import('./src/templates/practical.mjs'),
  import('./src/data/tickets.js'),
  import('./src/data/essentials.js'),
]).then(([tpl, tickets, ess]) => {
  const t = tpl.renderTickets({ fares: tickets.fares, ticketsByCity: tickets.ticketsByCity });
  console.assert(t.includes('待確認'), 'tickets page must show 待確認');
  const n = tpl.renderNotes({ preDepartureNotes: ess.preDepartureNotes });
  console.assert(!n.includes('15:35'), 'notes page must not show wrong sunset time');
  console.log('practical.mjs OK');
});
"
```

Expected: `practical.mjs OK`，無 assertion 失敗。

- [ ] **Step 6: Commit**

```bash
git add src/templates/practical.mjs
git commit -m "feat: 建立 7 個實用資訊頁模板 practical.mjs"
```

---

## Task 15: `build.mjs`（組裝腳本）

**Files:**
- Create: `build.mjs`

**Interfaces:**
- Consumes: 全部 `src/data/*.js` 具名匯出、全部 `src/templates/*.mjs` 具名匯出
- Produces: `dist/index.html`、`dist/day-01.html`…`dist/day-08.html`、`dist/city-warszawa.html`…`dist/city-poznan.html`、`dist/practical/*.html`（7 個）、`dist/assets/main.css`

- [ ] **Step 1: 寫 `build.mjs`**

```js
import fs from 'node:fs';
import path from 'node:path';

import * as trip from './src/data/trip.js';
import * as cities from './src/data/cities.js';
import * as dining from './src/data/dining.js';
import * as tickets from './src/data/tickets.js';
import * as transit from './src/data/transit.js';
import * as shopping from './src/data/shopping.js';
import * as essentials from './src/data/essentials.js';

import { renderHome } from './src/templates/home.mjs';
import { renderDay } from './src/templates/day.mjs';
import { renderCity } from './src/templates/city.mjs';
import {
  renderBooking, renderDining, renderTickets,
  renderTransit, renderShopping, renderEssentials, renderNotes,
} from './src/templates/practical.mjs';

const DIST = 'dist';
const CITY_MAP = {
  warszawa: { key: 'WAW', mapKey: 'warsaw' },
  krakow:   { key: 'KRK', mapKey: 'krakow' },
  wroclaw:  { key: 'WRO', mapKey: 'wroclaw' },
  poznan:   { key: 'POZ', mapKey: 'poznan' },
};

function reset() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST, 'practical'), { recursive: true });
  fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });
}

function write(file, html) {
  fs.writeFileSync(path.join(DIST, file), html, 'utf8');
}

function build() {
  reset();
  fs.copyFileSync('src/styles/main.css', path.join(DIST, 'assets/main.css'));

  write('index.html', renderHome({ meta: trip.meta, days: trip.days, flights: trip.flights, cities: cities.cities }));

  trip.days.forEach(day => {
    const photoSpotsForDay = cities.photoSpots.filter(p => p.day === day.n);
    write(`day-${String(day.n).padStart(2, '0')}.html`, renderDay(day, photoSpotsForDay));
  });

  Object.entries(CITY_MAP).forEach(([fileKey, { key, mapKey }]) => {
    const city = cities.cities.find(c => c.key === key);
    const story = cities.cityStories.find(s => s.city === city.name) || null;
    const foodBackupForCity = dining.foodBackup.find(f => f.city === city.name) || null;
    write(`city-${fileKey}.html`, renderCity({
      city,
      cityKey: mapKey,
      mapData: cities.mapPins[mapKey],
      legend: cities.pinCategoryLegend,
      attractionsForCity: cities.attractions[mapKey] || [],
      dining: dining.cityDining[mapKey] || [],
      cityFoodForCity: dining.cityFood.find(f => f.city === city.name) || null,
      foodBackupForCity,
      photoSpotsForCity: cities.photoSpots.filter(p => p.cityKey === key),
      story,
    }));
  });

  write('practical/booking.html', renderBooking({ flights: trip.flights, trains: trip.trains, stay: trip.stay, bookingTiers: trip.bookingTiers, reservations: trip.reservations }));
  write('practical/dining.html', renderDining({ michelinSummary: dining.michelinSummary, michelinReservations: dining.michelinReservations }));
  write('practical/tickets.html', renderTickets({ fares: tickets.fares, ticketsByCity: tickets.ticketsByCity }));
  write('practical/transit.html', renderTransit({ transitFares: transit.transitFares, airportTransit: transit.airportTransit, recommendedApps: transit.recommendedApps, passChecklist: transit.passChecklist, usefulRoutes: transit.usefulRoutes }));
  write('practical/shopping.html', renderShopping({ souvenirCards: shopping.souvenirCards, luxuryShopping: shopping.luxuryShopping, zabkaCards: shopping.zabkaCards }));
  write('practical/essentials.html', renderEssentials({ phrases: essentials.phrases, packingDefault: essentials.packingDefault, about: essentials.about, safety: essentials.safety }));
  write('practical/notes.html', renderNotes({ preDepartureNotes: essentials.preDepartureNotes }));

  console.log('✅ build.mjs 完成：dist/ 已產生 20 頁');
}

build();
```

- [ ] **Step 2: 執行 build 並確認輸出 20 個 HTML**

```bash
node build.mjs
find dist -name '*.html' | wc -l
```

Expected: 印出 `✅ build.mjs 完成：dist/ 已產生 20 頁`，`find` 結果為 `20`。

- [ ] **Step 3: Commit**

```bash
git add build.mjs
git commit -m "feat: 建立 build.mjs 組裝腳本，產出 20 頁靜態網站"
```

（`dist/` 本身不進版控——沿用現有 `.gitignore` 慣例，於 Task 17 檢查是否需要加一行 `dist/` 到 `.gitignore`。）

---

## Task 16: `tests/build.test.mjs`（自動驗收，對應 spec 第 9 節）

**Files:**
- Create: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `dist/` 目錄（假設在跑測試前 `build.mjs` 已執行過——`package.json` 的 `test` script 已串接 `node build.mjs && node --test tests/`）
- Produces: 無（純測試檔）

- [ ] **Step 1: 寫測試檔**

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const EXPECTED_FILES = [
  'index.html',
  ...[1,2,3,4,5,6,7,8].map(n => `day-${String(n).padStart(2,'0')}.html`),
  'city-warszawa.html', 'city-krakow.html', 'city-wroclaw.html', 'city-poznan.html',
  'practical/booking.html', 'practical/dining.html', 'practical/tickets.html',
  'practical/transit.html', 'practical/shopping.html', 'practical/essentials.html', 'practical/notes.html',
];

function read(file) {
  return fs.readFileSync(path.join(DIST, file), 'utf8');
}

test('dist 產出正好 20 個 HTML 檔，檔名符合預期', () => {
  const allHtml = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.html')) allHtml.push(path.relative(DIST, p));
    }
  }
  walk(DIST);
  assert.equal(allHtml.length, 20, `expected 20 html files, got ${allHtml.length}: ${allHtml.join(', ')}`);
  for (const f of EXPECTED_FILES) {
    assert.ok(allHtml.includes(f), `missing expected file: ${f}`);
  }
});

test('每個 HTML 都含 title、nav、footer', () => {
  for (const f of EXPECTED_FILES) {
    const html = read(f);
    assert.match(html, /<title>/, `${f} missing <title>`);
    assert.match(html, /<nav class="nav">/, `${f} missing nav`);
    assert.match(html, /<footer/, `${f} missing footer`);
  }
});

test('4 個城市頁都含 Leaflet 地圖容器與正確圖釘數，合計 50', () => {
  const expected = { 'city-warszawa.html': 14, 'city-krakow.html': 19, 'city-wroclaw.html': 9, 'city-poznan.html': 8 };
  let total = 0;
  for (const [file, count] of Object.entries(expected)) {
    const html = read(file);
    assert.match(html, /class="map-container"/, `${file} missing map container`);
    const m = html.match(/var mapData = (\{.*?\});/s);
    assert.ok(m, `${file} missing embedded mapData`);
    const points = JSON.parse(m[1]).points.length;
    assert.equal(points, count, `${file} expected ${count} pins, got ${points}`);
    total += points;
  }
  assert.equal(total, 50, `total pins should be 50, got ${total}`);
});

test('8 個每日頁的日期與行程標題與資料檔一致', async () => {
  const { days } = await import('../src/data/trip.js');
  for (const day of days) {
    const html = read(`day-${String(day.n).padStart(2,'0')}.html`);
    assert.ok(html.includes(day.date), `day-${day.n} missing date ${day.date}`);
    assert.ok(html.includes(day.title), `day-${day.n} missing title ${day.title}`);
  }
});

test('校正表 1-2：霓虹博物館頁面含「科學文化宮」且不含「Praga」', () => {
  const html = read('practical/tickets.html') + read('day-07.html');
  assert.ok(html.includes('科學文化宮'), 'missing 科學文化宮');
  assert.ok(!html.includes('Praga 區，共產時期霓虹招牌'), 'stale Praga wording still present');
});

test('校正表 1-3：波茲南古市政廳博物館頁面含「整修」字樣，不出現可購票的 PLN 10', () => {
  const html = read('practical/tickets.html');
  assert.ok(html.includes('整修'), 'missing 整修 wording');
  assert.ok(!/古市政廳博物館<\/a><\/td><td>10</td>/.test(html), 'stale purchasable PLN 10 row still present');
});

test('校正表 1-4：樂斯拉夫百年廳 Day 5 頁含「10/28 圓頂展廳不開放」', () => {
  const html = read('day-05.html');
  assert.ok(html.includes('10/28') && html.includes('圓頂'), 'missing 10/28 圓頂展廳不開放 warning');
});

test('校正表 1-5：全站不出現「15:35」「15:50」這兩個錯誤的日落時間', () => {
  const files = fs.readdirSync(DIST, { recursive: true }).filter(f => f.endsWith('.html'));
  for (const f of files) {
    const html = read(f);
    assert.ok(!html.includes('15:35'), `${f} contains stale sunset time 15:35`);
    assert.ok(!html.includes('15:50'), `${f} contains stale sunset time 15:50`);
  }
});

test('校正表 1-1：皇家城堡 Day 7 頁面含「待確認」標記', () => {
  const html = read('day-07.html');
  assert.ok(html.includes('待確認'), 'day-07 missing 待確認 marker');
});

test('全站無簡體字（常見簡體專用字元黑名單檢查）', () => {
  const SIMPLIFIED_ONLY = ['国','学','语','应','现','实','导','为','会','这','来','说','们','产','业','变','关','开','间','进','长','门','问','间','么','义','儿','车','马','鱼','龙','爱','东','西','华','历','经','结','系','统','传','让','认','识','义','远','运'];
  const files = fs.readdirSync(DIST, { recursive: true }).filter(f => f.endsWith('.html'));
  const offenders = [];
  for (const f of files) {
    const html = read(f);
    for (const ch of SIMPLIFIED_ONLY) {
      if (html.includes(ch)) offenders.push(`${f}: ${ch}`);
    }
  }
  assert.equal(offenders.length, 0, `found simplified characters: ${offenders.join(', ')}`);
});
```

- [ ] **Step 2: 執行測試確認全綠**

```bash
node build.mjs && node --test tests/*.test.mjs
```

Expected: 所有 test case 顯示 `# pass`，`# fail 0`。若「全站無簡體字」測試因黑名單字元誤判正體字既有用法而失敗（例如某些字元剛好也是正體字合法用字），檢視實際命中內容，若確認是誤判，從 `SIMPLIFIED_ONLY` 陣列移除該字元並記錄原因，不得略過測試不管。

- [ ] **Step 3: Commit**

```bash
git add tests/build.test.mjs
git commit -m "test: 建立自動驗收測試，涵蓋 spec 第 9 節機械檢查項目"
```

---

## Task 17: 舊檔案歸檔、`prepare-site.sh` 與 `verify.sh` 改寫

**Files:**
- Move: `redesign/` → `archive/redesign/`
- Move: `desktop/` → `archive/desktop/`
- Move: `mobile.html`、`desktop.html`、`app-preview.html`、`appUXUI/`、`reference/cinematic-scroll/`、`main.js`、`styles.css`、`pwa-register.js`、`legacy-redirect.js`、`build.sh`、`.codex-staging/`、舊 `index.html` → `archive/`
- （舊 `tests/*.test.mjs` 14 個檔案已在 Task 1 搬到 `archive/tests-old/`，本任務不重複處理）
- Move: `poland-travel-guide-final.html` → `archive/poland-travel-guide-final.html`（**最後一步**，確認資料已完整搬進 `src/data/` 且 Task 16 測試全綠後才做）
- Modify: `prepare-site.sh`（整段改寫）
- Modify: `verify.sh`（整段改寫）
- Keep in place（不動）：`manifest.json`、`sw.js`、`apple-touch-icon.png`、`icon-192.png`、`icon-512.png`、`og-image.svg`、`robots.txt`、`sitemap.xml`、`pwa-register.js` 若被 `manifest.json`/`sw.js` 引用則保留（PWA 相關檔案本次不動）

**Interfaces:**
- Consumes: `dist/` 目錄結構（Task 15 的輸出）
- Produces: 新的 `_site` 輸出結構供 GitHub Actions 使用

- [ ] **Step 1: 確認 Task 16 測試全綠後，搬移舊檔案清單**

先跑 `git status --short` 確認哪些是已追蹤檔案（用 `git mv` 保留歷史）、哪些是未追蹤檔案（`git mv` 對未追蹤檔案會報錯，須用一般 `mv` + `git add`）。依目前 repo 實況，`redesign/`、`desktop/`、`mobile.html`、`desktop.html`、`app-preview.html`、`reference/cinematic-scroll/`、`main.js`、`styles.css`、`legacy-redirect.js`、`build.sh`、`index.html`、`tests/*.test.mjs` 是已追蹤檔案；`appUXUI/`、`.codex-staging/` 是未追蹤檔案（`git status --short` 顯示 `??`）：

```bash
mkdir -p archive
git mv redesign archive/redesign
git mv desktop archive/desktop
git mv mobile.html archive/mobile.html
git mv desktop.html archive/desktop.html
git mv app-preview.html archive/app-preview.html
git mv reference/cinematic-scroll archive/cinematic-scroll
git mv main.js archive/main.js
git mv styles.css archive/styles.css
git mv legacy-redirect.js archive/legacy-redirect.js
git mv build.sh archive/build.sh
git mv index.html archive/index-old.html

# 未追蹤檔案，git mv 會失敗，改用 mv + git add
mv appUXUI archive/appUXUI
mv .codex-staging archive/codex-staging
git add archive/appUXUI archive/codex-staging
```

執行前先跑一次 `git status --short`，若上述「已追蹤／未追蹤」分類與實際不符（例如某檔案已在中途被使用者手動 commit），依實際狀況調整用 `git mv` 或 `mv`+`git add`，不要盲目照抄指令導致報錯。

- [ ] **Step 2: 把 `dist/` 內容提升為專案根目錄的部署來源，改寫 `prepare-site.sh`**

新網站是純靜態 `dist/`，`prepare-site.sh` 不再需要組裝多個舊目錄，直接把 `npm run build` 的產出複製到輸出目錄，並保留 PWA 相關檔案（本次不動的那些）：

```bash
#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

if [ "$#" -ne 1 ] || [ ! -d "$1" ]; then
  echo "用法：./prepare-site.sh <全新空輸出目錄>" >&2
  exit 1
fi

output="$1"
if find "$output" -mindepth 1 -print -quit | grep -q .; then
  echo "❌ 輸出目錄必須是空的：$output" >&2
  exit 1
fi

npm run build

cp -R dist/. "$output/"

cp \
  manifest.json sw.js pwa-register.js \
  apple-touch-icon.png icon-192.png icon-512.png \
  og-image.svg robots.txt sitemap.xml \
  "$output/"

echo "✅ Pages 公開輸出已組裝：$output"
```

- [ ] **Step 3: 改寫 `verify.sh`，換掉舊 bundle-diff 邏輯**

```bash
#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

npm test
node --check build.mjs
node --check prepare-site.sh 2>/dev/null || true
git diff --check

echo "✅ POLSKA 新版靜態網站自動驗收完成"
```

（`node --check` 對 `.sh` 檔會失敗屬預期，用 `|| true` 跳過；真正的 shell 語法檢查交給 `bash -n`，補一行：）

```bash
bash -n prepare-site.sh
```

把上面這行取代 `node --check prepare-site.sh 2>/dev/null || true` 那行。

- [ ] **Step 4: 本機模擬 CI 流程，實際跑一次確認兩個腳本都能成功**

```bash
chmod +x prepare-site.sh verify.sh
./verify.sh
mkdir -p /tmp/poland-site-check && rm -rf /tmp/poland-site-check/*
./prepare-site.sh /tmp/poland-site-check
find /tmp/poland-site-check -name '*.html' | wc -l
```

Expected: `verify.sh` 印出 `✅ POLSKA 新版靜態網站自動驗收完成`；`prepare-site.sh` 印出 `✅ Pages 公開輸出已組裝`；`find` 結果為 `20`。

- [ ] **Step 5: 確認 `poland-travel-guide-final.html` 資料已完整搬進 `src/data/`（回頭核對 Task 3–8 的每個 `export`），再歸檔它**

```bash
git mv poland-travel-guide-final.html archive/poland-travel-guide-final.html
```

- [ ] **Step 6: 把 `dist/` 加進 `.gitignore`（它由 `prepare-site.sh` 在 CI 內用 `npm run build` 現場產生，不需要進版控）**

```bash
printf '\n# 產生的靜態網站輸出（prepare-site.sh 會在部署時重新 build）\ndist/\n' >> .gitignore
```

- [ ] **Step 7: Commit（用明確路徑，不要用 `git add -A`——目前 repo 裡還有這個 plan 範圍外的未追蹤檔案，例如 `.agents/`、`.claude/`、`skills-lock.json`，不屬於這次改版，不能一起帶進 commit）**

```bash
git add archive/ prepare-site.sh verify.sh .gitignore tests/
git status --short
```

執行完 `git status --short` 後**人工檢查輸出**，確認列出的都是本任務移動/修改的檔案（`archive/` 底下的舊檔、`prepare-site.sh`、`verify.sh`、`.gitignore`、`tests/`），沒有 `.agents/`、`.claude/`、`skills-lock.json`、`appUXUI/`（`appUXUI/` 若不在本次 archive 清單內也不該被帶入）等不相關檔案混入，才執行 commit：

```bash
git commit -m "chore: 舊檔案歸檔至 archive/，改寫 prepare-site.sh 與 verify.sh 對應新 dist/ 結構"
```

---

## Task 18: 真實環境驗收（headless Chrome）與交叉審查

**Files:** 無新檔案；本任務是驗證動作，不是程式碼變更。

**Interfaces:**
- Consumes: `dist/` 或 `_site`（Task 17 產出）需先用簡易 HTTP server 啟動（Leaflet 地圖需要非 `file://` 協定才能正常載入 tile）

- [ ] **Step 1: 啟動本機靜態伺服器**

```bash
npx --yes http-server dist -p 8080 -s &
sleep 1
curl -sI http://localhost:8080/index.html | head -1
```

Expected: `HTTP/1.1 200 OK`

- [ ] **Step 2: 用 headless Chrome（`mcp__claude-in-chrome__*` 或 Playwright 工具）依序開啟 `http://localhost:8080/index.html`、`http://localhost:8080/day-03.html`、`http://localhost:8080/city-krakow.html`，各截圖一次**

若 Chrome 擴充工具的 deferred tools 尚未載入，先呼叫：
`ToolSearch("select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__tabs_create_mcp")`

逐頁確認：
- 頁面有內容渲染（不是空白頁）
- `city-krakow.html` 的地圖區塊確實顯示 OpenStreetMap 底圖與圖釘（不是空的灰色方塊）
- 字體確實載入 Playfair Display（標題）與 Noto Sans TC（內文），不是退回瀏覽器預設字體

若截圖顯示地圖空白，檢查瀏覽器 console（`read_console_messages`）是否有 Leaflet CDN 載入失敗或 CSP 阻擋的錯誤訊息，回報而非略過。

- [ ] **Step 3: 停止本機伺服器**

```bash
kill %1 2>/dev/null || true
```

- [ ] **Step 4: 依 `~/.claude/rules/10-model-dispatch.md` §6「驗證不自驗」，派一個 fresh-context subagent 做最終 read-back 驗收**

驗收範圍：對照本計畫「對照校正表的裁決速查」表格，逐項確認 `dist/` 對應頁面確實含有正確內容（用 `grep` 讀 `dist/*.html` 即可，不需要瀏覽器）；並確認 `docs/超powers/plans/2026-08-07-poland-trip-redesign-implementation.md` 列出的每一個 `src/data/*.js` 匯出集合筆數與規格書 / 校正表相符。回報格式：每個校正表編號「已落地／缺漏／矛盾」+ `檔案:行號`。

- [ ] **Step 5: 若驗收全過，向使用者回報完成，並列出 3 個部署網址供實際打開確認**

不要自行執行 `git push`——依 `~/.claude/CLAUDE.md` 的執行審慎原則，push 到 `main` 會觸發正式部署，需先讓使用者確認要不要推。

---

## 執行順序與相依關係

Task 1 → Task 2/3/4/5/6/7/8（7 個資料檔互相獨立，可平行執行）→ Task 9（樣式，可與資料檔平行）→ Task 10 → Task 11/12/13/14（4 個模板依賴 Task 10，彼此獨立可平行）→ Task 15（依賴全部資料檔與模板）→ Task 16（依賴 Task 15）→ Task 17（依賴 Task 16 測試全綠）→ Task 18（依賴 Task 17）。

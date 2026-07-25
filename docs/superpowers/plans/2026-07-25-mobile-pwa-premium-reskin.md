# 手機 PWA 精緻化改版 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把手機 PWA（`B_Companion`）從「單一長頁＋錨點捲動」改造為底部 `[首頁][行程][交通][更多]` 真分頁的精緻旅伴，套用波蘭紅⊕黃銅金視覺，並新增以本機 `localStorage` 儲存的完整記帳功能與工具子頁。

**Architecture:** 沿用既有單一 React 元件 `redesign/B-companion.jsx`（esbuild → `redesign/dist/B-companion.js`）。導覽層新增 `activeTab` 狀態取代 scroll 錨點（僅作用於行動版 <900px；桌機 ≥900px 雙欄佈局保留不動）。工具子頁用新增的 `subpage` 狀態＋沿用既有疊層樣式呈現，不引入路由套件。記帳/匯率/打包/打卡的純邏輯與 storage 存取放進 `redesign/pwa-core.js`（`PolskaPwaCore`），比照既有 `readNotes/writeNotes` 的依賴注入模式，用 `vm` 沙箱單元測試。

**Tech Stack:** React 18（vendored，無 JSX runtime，`React.createElement`）、esbuild 0.24.0、Node `node:test`（靜態原始碼契約＋`vm` 純函式測試）、原生 CSS（`redesign/B-companion.css` ＋ `redesign/tokens.css`）、`localStorage`。

## Global Constraints

- 繁體中文，**絕對禁止簡體字**；中文與英文/數字間加半形空格（例：我有 3 台）。
- 不新增後端、帳號、資料庫、雲端同步、推播；資料一律存本機 `localStorage`。
- 不改動桌機分章雜誌（`redesign/A-magazine.*`）；不改動 `B_Companion` 桌機 ≥900px 雙欄佈局既有行為。
- 每個 Task 結束必跑 `./verify.sh` 全綠；**source 與 `redesign/dist/B-companion.js` 必須一併提交**（`verify.sh` 用 `cmp` 檢查 bundle 一致）。
- 改 `.jsx` 後一律先 `./build.sh` 再 `./verify.sh`，再 commit（含 source＋dist）。
- 尊重 `prefers-reduced-motion`（停自動動畫）與 `safe-area-inset-*`。
- 色票沿用 `redesign/tokens.css`：`--crimson:#a8231d`、`--amber:#c4892b`、`--paper:#f4ecd8`、`--ink:#1a1612`、`--ink-mute:#6e6358`、卡片底 `#fbf6ea`。中文襯線 `Noto Serif TC`，數字等寬 `JetBrains Mono` ＋ `tabular-nums`。
- localStorage key 命名：`polska.expenses.v1`、`polska.settings.v1`、`polska.packing.v1`、`polska.photomap.v1`。所有讀寫以 try/catch 包覆，不可用時退化為記憶體並顯示提示，禁止白屏或拋錯中斷。
- 設計規格來源：`docs/superpowers/specs/2026-07-25-mobile-pwa-premium-reskin-design.md`（權威，衝突以 spec 為準）。
- 現況盤點參考：`/private/tmp/claude-501/-Users-xieh/2918951c-e0ac-46a1-b70e-a9957ce96379/scratchpad/`（若在）＋本計劃內引用的 `檔案:行號`。

---

## 檔案結構總覽

| 檔案 | 責任 | 動作 |
|------|------|------|
| `redesign/pwa-core.js` | 共用純邏輯與 storage 存取（notes、記帳、匯率、打包、打卡） | 修改（新增函式） |
| `redesign/B-companion.jsx` | 手機 PWA React 元件：導覽、各分頁、hero、子頁 | 修改（大改導覽與新增子頁） |
| `redesign/B-companion.css` | 視覺樣式 | 修改（新增分頁/hero/工具/記帳/子頁樣式） |
| `redesign/data.js` | `window.TRIP` 靜態旅程資料 | 修改（僅在缺欄位時補靜態內容，如打包預設清單） |
| `redesign/dist/B-companion.js` | 編譯產物 | 每次 build 重生、一併提交 |
| `tests/pwa-core.test.mjs` | pwa-core 純函式測試 | 修改（新增記帳/匯率測試）或另開 `tests/expense.test.mjs` |
| `tests/ui-contract.test.mjs` | UI 結構靜態契約 | 修改（更新分頁標籤、新增子頁/hero/記帳契約） |
| `sw.js` | Service Worker 快取契約 | 修改（cache 版本升級） |

---

## Task 0：記帳純邏輯與 storage 基座（pwa-core.js）

先做純函式與測試，UI 之後接。所有函式無副作用或以注入的 `storage` 為唯一外部相依，可用 `vm` 沙箱測。

**Files:**
- Modify: `redesign/pwa-core.js`（在 `PolskaPwaCore` 匯出物件內新增函式；現有 `readNotes` 在 `redesign/pwa-core.js:51`、`writeNotes` 在 `:62`，比照其 try/catch 與 DI 風格）
- Test: `tests/expense.test.mjs`（新建，比照 `tests/pwa-core.test.mjs:6-8` 的 `vm.runInNewContext` 載入方式）

**Interfaces — Produces（後續 Task 5/6/7 依賴這些簽名）:**
- `readJSON(storage, key, fallback)` → 解析後的值或 `fallback`（storage 不可用/JSON 壞掉時回 `fallback` 的深拷貝）
- `writeJSON(storage, key, value)` → `true`/`false`（不可用時 `false`，不拋錯）
- `DEFAULT_SETTINGS` → `{ fxRate: 7.7, budgetTWD: 21600 }`
- `EXPENSE_CATEGORIES` → `[{ key:'food', label:'餐飲' },{ key:'ticket', label:'門票' },{ key:'transport', label:'交通' },{ key:'shop', label:'購物' }]`
- `plnToTwd(amountPLN, fxRate)` → 四捨五入整數；非數字回 `0`
- `expenseTotals(expenses)` → `{ count, totalPLN, byCategory: { food, ticket, transport, shop } }`（金額累加 PLN；未知分類忽略；空陣列回全 0）
- `budgetStatus(totalPLN, fxRate, budgetTWD)` → `{ spentTWD, budgetTWD, ratio, over }`（`ratio` = spentTWD/budgetTWD，budgetTWD≤0 時 ratio 0；`over` 布林）

- [ ] **Step 1: 寫失敗測試** — 建 `tests/expense.test.mjs`

```javascript
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), context);
const core = context.globalThis.PolskaPwaCore;

test('readJSON 在 storage 壞掉時回 fallback 深拷貝', () => {
  const broken = { getItem() { throw new Error('blocked'); } };
  const fb = { a: 1 };
  const got = core.readJSON(broken, 'k', fb);
  assert.deepEqual(got, { a: 1 });
  got.a = 999;
  assert.equal(fb.a, 1, 'fallback 不可被外部改動污染');
});

test('readJSON 在 JSON 壞掉時回 fallback', () => {
  const s = { getItem() { return '{bad'; } };
  assert.deepEqual(core.readJSON(s, 'k', []), []);
});

test('writeJSON 在 storage 壞掉時回 false 不拋錯', () => {
  const broken = { setItem() { throw new Error('blocked'); } };
  assert.equal(core.writeJSON(broken, 'k', { a: 1 }), false);
});

test('writeJSON 正常寫入回 true 並可回讀', () => {
  const bag = {};
  const s = { getItem: (k) => (k in bag ? bag[k] : null), setItem: (k, v) => { bag[k] = v; } };
  assert.equal(core.writeJSON(s, 'polska.settings.v1', { fxRate: 8 }), true);
  assert.deepEqual(core.readJSON(s, 'polska.settings.v1', null), { fxRate: 8 });
});

test('plnToTwd 四捨五入為整數，壞輸入回 0', () => {
  assert.equal(core.plnToTwd(100, 7.7), 770);
  assert.equal(core.plnToTwd(12.5, 7.7), 96); // 96.25 → 96
  assert.equal(core.plnToTwd('x', 7.7), 0);
  assert.equal(core.plnToTwd(100, 0), 0);
});

test('expenseTotals 依分類加總，忽略未知分類', () => {
  const expenses = [
    { category: 'food', amountPLN: 50 },
    { category: 'food', amountPLN: 30 },
    { category: 'ticket', amountPLN: 120 },
    { category: 'mystery', amountPLN: 999 },
  ];
  const t = core.expenseTotals(expenses);
  assert.equal(t.count, 4);
  assert.equal(t.totalPLN, 200); // 50+30+120，忽略 mystery
  assert.deepEqual(t.byCategory, { food: 80, ticket: 120, transport: 0, shop: 0 });
});

test('expenseTotals 空陣列全 0', () => {
  assert.deepEqual(core.expenseTotals([]), {
    count: 0, totalPLN: 0, byCategory: { food: 0, ticket: 0, transport: 0, shop: 0 },
  });
});

test('budgetStatus 計算已花台幣與超支旗標', () => {
  const s = core.budgetStatus(1000, 7.7, 21600);
  assert.equal(s.spentTWD, 7700);
  assert.equal(s.budgetTWD, 21600);
  assert.equal(s.over, false);
  assert.ok(Math.abs(s.ratio - 7700 / 21600) < 1e-9);
  const over = core.budgetStatus(3000, 7.7, 21600); // 23100 > 21600
  assert.equal(over.over, true);
  assert.equal(core.budgetStatus(1000, 7.7, 0).ratio, 0); // 預算 0 不除以 0
});

test('DEFAULT_SETTINGS 與分類常數存在且正確', () => {
  assert.deepEqual(core.DEFAULT_SETTINGS, { fxRate: 7.7, budgetTWD: 21600 });
  assert.deepEqual(core.EXPENSE_CATEGORIES.map((c) => c.key), ['food', 'ticket', 'transport', 'shop']);
  assert.deepEqual(core.EXPENSE_CATEGORIES.map((c) => c.label), ['餐飲', '門票', '交通', '購物']);
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/expense.test.mjs`
Expected: FAIL（`core.readJSON is not a function` 等）

- [ ] **Step 3: 在 pwa-core.js 實作**

在 `redesign/pwa-core.js` 的 `PolskaPwaCore` 匯出物件內（與 `readNotes`/`writeNotes` 同層）加入：

```javascript
var DEFAULT_SETTINGS = { fxRate: 7.7, budgetTWD: 21600 };
var EXPENSE_CATEGORIES = [
  { key: 'food', label: '餐飲' },
  { key: 'ticket', label: '門票' },
  { key: 'transport', label: '交通' },
  { key: 'shop', label: '購物' },
];

function readJSON(storage, key, fallback) {
  var clone = JSON.parse(JSON.stringify(fallback));
  try {
    var raw = storage && storage.getItem ? storage.getItem(key) : null;
    if (raw == null) return clone;
    var parsed = JSON.parse(raw);
    return parsed == null ? clone : parsed;
  } catch (e) {
    return clone;
  }
}

function writeJSON(storage, key, value) {
  try {
    if (!storage || !storage.setItem) return false;
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    return false;
  }
}

function plnToTwd(amountPLN, fxRate) {
  var a = Number(amountPLN), r = Number(fxRate);
  if (!isFinite(a) || !isFinite(r)) return 0;
  return Math.round(a * r);
}

function expenseTotals(expenses) {
  var by = { food: 0, ticket: 0, transport: 0, shop: 0 };
  var totalPLN = 0, count = 0;
  (expenses || []).forEach(function (e) {
    count += 1;
    var amt = Number(e && e.amountPLN) || 0;
    if (Object.prototype.hasOwnProperty.call(by, e && e.category)) {
      by[e.category] += amt;
      totalPLN += amt;
    }
  });
  return { count: count, totalPLN: totalPLN, byCategory: by };
}

function budgetStatus(totalPLN, fxRate, budgetTWD) {
  var spentTWD = plnToTwd(totalPLN, fxRate);
  var budget = Number(budgetTWD) || 0;
  var ratio = budget > 0 ? spentTWD / budget : 0;
  return { spentTWD: spentTWD, budgetTWD: budget, ratio: ratio, over: budget > 0 && spentTWD > budget };
}
```

並把 `DEFAULT_SETTINGS, EXPENSE_CATEGORIES, readJSON, writeJSON, plnToTwd, expenseTotals, budgetStatus` 一併加入既有 `PolskaPwaCore` 匯出物件（找到 `globalThis.PolskaPwaCore = { ... }` 那一段，把新符號補進去）。

- [ ] **Step 4: 跑測試確認通過**

Run: `node --test tests/expense.test.mjs`
Expected: PASS（9 tests）

- [ ] **Step 5: 完整驗收 + commit**

Run: `./verify.sh`
Expected: 全綠（既有測試不回歸；`node --check redesign/pwa-core.js` 通過）

```bash
git add redesign/pwa-core.js tests/expense.test.mjs
git commit -m "feat(pwa-core): 記帳/匯率/預算純函式與 JSON storage 基座

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 1：導覽改真分頁（activeTab，行動版）

把行動版底部導覽從 scroll 錨點改為 `activeTab` 分頁切換。桌機 ≥900px 雙欄佈局與其 nav 行為**保留不動**。

**Files:**
- Modify: `redesign/B-companion.jsx`
  - `B_PrimaryNav` `redesign/B-companion.jsx:179`（改為吃 `active`/`onChange`，行動版加選中態）
  - `navActions` `redesign/B-companion.jsx:454`（新增 `activeTab` state；行動版點擊改 `setActiveTab`）
  - 行動版 nav 掛載處 `redesign/B-companion.jsx:978`
  - 主內容區：把 `.B-today`（`:511`）、`.B-scrub`+`.B-timeline`（`:598`/`:698`）、`.B-train`（`:612`）、`<aside className="B-secondary-column">`（`:805`）依 tab 分組，行動版依 `activeTab` 只顯示對應組
- Modify: `redesign/B-companion.css`（新增 `.B-primary-nav button.active`；新增行動版 tab 分組顯示規則）
- Test: `tests/ui-contract.test.mjs`（更新分頁標籤與新增 activeTab 契約）

**Interfaces:**
- Consumes: 無（起始 Task）
- Produces: `activeTab` state（值 `'home'|'trip'|'move'|'more'`）；`setActiveTab`；tab 內容分組容器 class `.B-tabview[data-tab]`（供後續 Task 掛內容）

**分頁對應（行動版）：**
- `home` 首頁：`.B-today` hero 區（Task 3 換成輪播）＋三格儀表（Task 8）＋今日預覽
- `trip` 行程：`.B-scrub` ＋ `.B-timeline`
- `move` 交通：`.B-train` 卡＋訂票（原 aside 內 tickets 區塊 `:815`）
- `more` 更多：工具方格（Task 4）

- [ ] **Step 1: 更新契約測試（先失敗）** — 改 `tests/ui-contract.test.mjs`

把原本 L14-18 的測試改為：

```javascript
test('行動版底部導覽為四個真分頁', () => {
  for (const label of ['首頁', '行程', '交通', '更多']) assert.match(jsx, new RegExp(label));
  assert.match(jsx, /B-mobile-nav/);
  assert.match(jsx, /B-desktop-nav/); // 桌機雙欄 nav 保留
  assert.match(jsx, /activeTab/);
  assert.match(jsx, /setActiveTab/);
  assert.match(css, /\.B-primary-nav button\.active/);
});
```

保留 L20-26「寬螢幕採雙欄網頁布局」測試不動（桌機不變）。

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL（找不到 `首頁`/`activeTab` 等）

- [ ] **Step 3: 實作導覽分頁**

在 `B_Companion`（`:219`）內加：`const [activeTab, setActiveTab] = React.useState('home');`

改 `B_PrimaryNav`（`:179`）：行動版 `placement==='mobile'` 時 items 改為 `[['home','首頁'],['trip','行程'],['move','交通'],['more','更多']]`，每顆 button `className={active===key?'active':''}`、`aria-current={active===key?'page':undefined}`、`onClick={()=>onChange(key)}`；桌機 `placement==='desktop'` 維持原有 scroll callbacks（傳入 `navActions`），行為不變。行動版掛載處（`:978`）改傳 `active={activeTab} onChange={setActiveTab}`。

主內容：行動版把四組內容包進 `<div className="B-tabview" data-tab={activeTab}>`，用 CSS 依 `data-tab` 顯示對應 section（見 Step 4）。桌機 ≥900px 的 `.B-web-grid` 雙欄仍全部顯示（tab 分組規則限定在 `@media (max-width: 899px)`）。

CSS（`redesign/B-companion.css` 末新增）：

```css
.B-primary-nav button.active{ color:var(--crimson); }
.B-primary-nav button.active::after{
  content:""; position:absolute; left:50%; bottom:6px; width:5px; height:5px;
  transform:translateX(-50%); border-radius:999px; background:var(--crimson);
}
.B-primary-nav button{ position:relative; }

@media (max-width: 899px){
  .B-tabview [data-tabsection]{ display:none; }
  .B-tabview[data-tab="home"] [data-tabsection="home"],
  .B-tabview[data-tab="trip"] [data-tabsection="trip"],
  .B-tabview[data-tab="move"] [data-tabsection="move"],
  .B-tabview[data-tab="more"] [data-tabsection="more"]{ display:block; }
}
```

各 section 外層加 `data-tabsection="home|trip|move|more"`。桌機不受 `max-width:899px` 規則影響，維持雙欄全顯示。

- [ ] **Step 4: 跑契約測試確認通過 + build**

Run: `node --test tests/ui-contract.test.mjs` → PASS
Run: `./build.sh` → `✅` 產出 bundle

- [ ] **Step 5: 真實瀏覽器驗收**

用 headless Chrome（見 Task 8 驗收法）在 390px 開 `mobile.html`，點四個 tab，確認：只顯示對應內容、選中態高亮、無水平溢出、console 0 error。

- [ ] **Step 6: 完整驗收 + commit**

Run: `./verify.sh` → 全綠（含 bundle 一致性）

```bash
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 底部導覽改為 [首頁][行程][交通][更多] 真分頁

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2：視覺換皮（卡片與版式收斂）

tokens 色票已與設計一致（見 Global Constraints），本 Task 只做視覺語言收斂：kicker 小標、細金線分隔、卡片底色與陰影，套到既有卡片，讓整體貼近 SEOUL 範例的質感。**不改資料、不改結構。**

**Files:**
- Modify: `redesign/B-companion.css`（調整 `.B-card` 家族、head、pill 的用色與間距；金色僅作點綴）
- Test: `tests/ui-contract.test.mjs`（新增視覺 token 契約）

**Interfaces:** Consumes：Task 1 的分頁結構。Produces：無新介面（純樣式）。

- [ ] **Step 1: 新增視覺契約測試（先失敗）**

在 `tests/ui-contract.test.mjs` 加：

```javascript
test('卡片套用米紙底與金色點綴語彙', () => {
  assert.match(css, /--card-bg:\s*#fbf6ea|background:\s*#fbf6ea/);
  assert.match(css, /var\(--amber\)/); // 金色作為點綴出現
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs` → 新測試 FAIL

- [ ] **Step 3: 實作樣式收斂**

在 `redesign/B-companion.css`：
- `.B-card` 底色統一為 `#fbf6ea`、border `1px solid rgba(26,22,18,.10)`、陰影用 `var(--shadow-sm)`、圓角 14px。
- 卡片頂部 kicker/小標用 `var(--amber-deep)`，細分隔線 `border-top:1px solid var(--amber)` 透明度 .35。
- 主要行動（book-cta 等）維持 `var(--crimson)`；金色只用於分隔線、kicker、選中點綴。
- 標題用 `var(--serif)`，數字元素加 `font-variant-numeric:tabular-nums`。

- [ ] **Step 4: 跑測試 + build**

Run: `node --test tests/ui-contract.test.mjs` → PASS
Run: `./build.sh`（CSS 改動不影響 bundle，但仍執行以保持流程；bundle 不變）

- [ ] **Step 5: 真實瀏覽器目視 + 驗收 + commit**

headless Chrome 390px 截圖確認卡片質感；`./verify.sh` 全綠。

```bash
git add redesign/B-companion.css tests/ui-contract.test.mjs
git commit -m "style(mobile): 卡片套用米紙底與黃銅金點綴視覺語彙

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3：首頁 hero 城市輪播

把 `.B-today` 頂部區加上四城市大圖輪播（開發期用 CSS 漸層佔位塊，正式版換真實照片）。自動輪播、進度點、城市名同步、`prefers-reduced-motion` 停自動。

**Files:**
- Modify: `redesign/B-companion.jsx`（新增 `B_Hero` 子元件，掛在 `home` 分頁 `.B-today` 頂部 `:511` 之前）
- Modify: `redesign/B-companion.css`（新增 `.B-hero*` 樣式與四城漸層）
- Test: `tests/ui-contract.test.mjs`（hero 契約）

**Interfaces:**
- Consumes: `window.TRIP.meta`（`dateRange`、`code`），Task 1 的 `home` 分頁。
- Produces: `.B-hero` 區塊（供 Task 8 疊三格儀表於其下）。

**四城順序與 class：** 華沙 `hs-waw`、克拉科夫 `hs-krk`、樂斯拉夫 `hs-wro`、波茲南 `hs-poz`。城市名陣列 `['華沙','克拉科夫','樂斯拉夫','波茲南']`。

- [ ] **Step 1: hero 契約測試（先失敗）**

```javascript
test('首頁 hero 為四城市輪播且尊重減量動畫', () => {
  assert.match(jsx, /function B_Hero/);
  assert.match(jsx, /華沙[\s\S]*克拉科夫[\s\S]*樂斯拉夫[\s\S]*波茲南/);
  assert.match(jsx, /prefers-reduced-motion/);
  assert.match(css, /\.B-hero-slide/);
  assert.match(css, /\.B-hero-dots/);
});
```

- [ ] **Step 2: 跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs` → FAIL

- [ ] **Step 3: 實作 B_Hero**

在 `B_Companion` 上方（helper 區，約 `:195` 附近）新增：

```javascript
function B_Hero(props) {
  var cities = ['華沙', '克拉科夫', '樂斯拉夫', '波茲南'];
  var slides = ['hs-waw', 'hs-krk', 'hs-wro', 'hs-poz'];
  var reduce = false;
  try { reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var idxState = React.useState(0);
  var idx = idxState[0], setIdx = idxState[1];
  React.useEffect(function () {
    if (reduce) return undefined;
    var id = setInterval(function () { setIdx(function (i) { return (i + 1) % slides.length; }); }, 3200);
    return function () { clearInterval(id); };
  }, [reduce]);
  return React.createElement('div', { className: 'B-hero' },
    slides.map(function (s, i) {
      return React.createElement('div', {
        key: s, className: 'B-hero-slide ' + s + (i === idx ? ' is-active' : ''), 'aria-hidden': i === idx ? undefined : 'true',
      });
    }),
    React.createElement('div', { className: 'B-hero-cap' },
      React.createElement('span', { className: 'B-hero-code' }, props.code || 'POLSKA'),
      React.createElement('span', { className: 'B-hero-city' }, cities[idx]),
      React.createElement('span', { className: 'B-hero-date' }, props.dateRange || '')
    ),
    React.createElement('div', { className: 'B-hero-dots', role: 'presentation' },
      slides.map(function (s, i) {
        return React.createElement('span', { key: s, className: 'B-hero-dot' + (i === idx ? ' is-active' : '') });
      })
    )
  );
}
```

在 `home` 分頁最上方掛：`React.createElement(B_Hero, { code: t.meta.code, dateRange: t.meta.dateRange })`（`t` 為既有 `window.TRIP`，見 `:220`）。

CSS：

```css
.B-hero{ position:relative; height:230px; border-radius:16px; overflow:hidden; margin:0 0 var(--gap-md); box-shadow:var(--shadow-md); }
.B-hero-slide{ position:absolute; inset:0; opacity:0; transition:opacity .8s var(--ease-out); }
.B-hero-slide.is-active{ opacity:1; }
.B-hero-slide.hs-waw{ background:linear-gradient(150deg,#8a1a15,#c4892b); }
.B-hero-slide.hs-krk{ background:linear-gradient(150deg,#7a1812,#3d4a2a); }
.B-hero-slide.hs-wro{ background:linear-gradient(150deg,#a8231d,#6e6358); }
.B-hero-slide.hs-poz{ background:linear-gradient(150deg,#8b5e15,#1a1612); }
.B-hero-cap{ position:absolute; left:16px; bottom:26px; display:flex; flex-direction:column; gap:2px; color:#f4ecd8; text-shadow:0 1px 8px rgba(0,0,0,.4); }
.B-hero-code{ font-family:var(--display); font-size:2.4rem; letter-spacing:.14em; line-height:1; }
.B-hero-city{ font-family:var(--serif); font-size:1.1rem; }
.B-hero-date{ font-family:var(--mono); font-size:.72rem; letter-spacing:.12em; opacity:.9; }
.B-hero-dots{ position:absolute; left:16px; bottom:14px; display:flex; gap:6px; }
.B-hero-dot{ width:6px; height:6px; border-radius:999px; background:rgba(244,236,216,.45); transition:background .3s; }
.B-hero-dot.is-active{ background:#f4ecd8; }
@media (prefers-reduced-motion: reduce){ .B-hero-slide{ transition:none; } }
```

- [ ] **Step 4: 跑測試 + build**

Run: `node --test tests/ui-contract.test.mjs` → PASS；`./build.sh`

- [ ] **Step 5: 真實瀏覽器驗收**

headless Chrome 390px：確認輪播自動換、城市名同步、進度點會動、無溢出。

- [ ] **Step 6: 驗收 + commit**

Run: `./verify.sh` → 全綠

```bash
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 首頁四城市 hero 輪播（漸層佔位，尊重減量動畫）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4：更多頁工具方格與子頁容器框架

建「更多」分頁的工具方格，與一個由 `subpage` state 控制的通用子頁容器（沿用既有疊層樣式）。本 Task 只做**框架與導覽**，各子頁內容在 Task 5–7 填。

**Files:**
- Modify: `redesign/B-companion.jsx`（新增 `subpage` state、`B_Subpage` 通用容器、`more` 分頁工具方格）
- Modify: `redesign/B-companion.css`（`.B-more-grid`、`.B-tool-card`、`.B-subpage*`）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1 的 `more` 分頁。
- Produces: `subpage` state（`null|'expense'|'photomap'|'fx'|'packing'|'sos'|'info'`）；`setSubpage`；`B_Subpage`（props：`title`, `onBack`, `children`）；六張工具卡（`data-open` 屬性）。

- [ ] **Step 1: 契約測試（先失敗）**

```javascript
test('更多頁有六張工具卡與可返回的子頁容器', () => {
  assert.match(jsx, /subpage/);
  assert.match(jsx, /setSubpage/);
  assert.match(jsx, /function B_Subpage/);
  for (const label of ['旅行記帳', 'Photo Map', '匯率換算', '打包清單', 'SOS', '實用資訊']) {
    assert.match(jsx, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.match(css, /\.B-tool-card/);
  assert.match(css, /\.B-subpage/);
});
```

- [ ] **Step 2: 跑測試確認失敗** → `node --test tests/ui-contract.test.mjs` FAIL

- [ ] **Step 3: 實作框架**

在 `B_Companion` 加 `const [subpage, setSubpage] = React.useState(null);`

通用容器（helper 區）：

```javascript
function B_Subpage(props) {
  return React.createElement('div', { className: 'B-subpage-mask', role: 'dialog', 'aria-modal': 'true', 'aria-label': props.title },
    React.createElement('div', { className: 'B-subpage' },
      React.createElement('header', { className: 'B-subpage-head' },
        React.createElement('button', { className: 'B-subpage-back', onClick: props.onBack, 'aria-label': '返回更多' }, '‹ 返回'),
        React.createElement('h2', null, props.title)
      ),
      React.createElement('div', { className: 'B-subpage-body' }, props.children)
    )
  );
}
```

`more` 分頁內容：工具方格，每張卡 `onClick={()=>setSubpage(key)}`，六 key 對應 `expense/photomap/fx/packing/sos/info`，標籤 `旅行記帳/Photo Map/匯率換算/打包清單/SOS 緊急卡/實用資訊`，各配一個簡單 emoji-free 圖示（用文字或 CSS 圓點，避免用 emoji 當語意標記）。

在 `B_Companion` return 尾端（與 drawer/trainSheet 疊層同層）加：

```javascript
subpage && React.createElement(B_Subpage, { title: SUBPAGE_TITLES[subpage], onBack: function () { setSubpage(null); } },
  subpage === 'expense' && React.createElement(B_Expense, { storage: storage }),
  subpage === 'fx' && React.createElement(B_FxTool, { storage: storage }),
  subpage === 'packing' && React.createElement(B_Packing, { storage: storage }),
  subpage === 'sos' && React.createElement(B_Sos, { trip: t }),
  subpage === 'info' && React.createElement(B_Info, { trip: t }),
  subpage === 'photomap' && React.createElement(B_PhotoMap, { trip: t, storage: storage })
)
```

（`SUBPAGE_TITLES` 為常數對照表；`storage` 為既有 `B_getStorage()` 結果，見 `:223` 附近的 `storage` 變數。Task 5–7 補齊各子元件；本 Task 先放暫時佔位 `function B_Expense(){return React.createElement('p',null,'（記帳，下一步實作）');}` 等六個佔位，確保可切換與返回。）

CSS：

```css
.B-more-grid{ display:grid; grid-template-columns:1fr 1fr; gap:var(--gap-sm); }
.B-tool-card{ display:flex; flex-direction:column; gap:6px; padding:var(--pad-md); background:#fbf6ea; border:1px solid rgba(26,22,18,.10); border-radius:14px; box-shadow:var(--shadow-sm); text-align:left; font-family:var(--serif); }
.B-tool-card .tool-name{ font-size:1rem; color:var(--ink); }
.B-tool-card .tool-sub{ font-size:.72rem; color:var(--ink-mute); font-family:var(--mono); letter-spacing:.06em; }
.B-tool-card::before{ content:""; width:22px; height:3px; border-radius:999px; background:var(--amber); }
.B-subpage-mask{ position:fixed; inset:0; z-index:120; background:var(--paper); display:flex; flex-direction:column; padding-bottom:var(--safe-bottom); }
.B-subpage{ display:flex; flex-direction:column; height:100%; }
.B-subpage-head{ position:sticky; top:0; display:flex; align-items:center; gap:12px; padding:calc(var(--safe-top) + 12px) 16px 12px; background:var(--paper); border-bottom:1px solid var(--amber); }
.B-subpage-head h2{ margin:0; font-family:var(--serif); font-size:1.15rem; }
.B-subpage-back{ font-family:var(--mono); font-size:.85rem; color:var(--crimson); background:none; border:none; padding:4px 2px; }
.B-subpage-body{ flex:1; overflow-y:auto; padding:16px; -webkit-overflow-scrolling:touch; }
```

- [ ] **Step 4: 跑測試 + build** → PASS；`./build.sh`

- [ ] **Step 5: 真實瀏覽器驗收** — 390px 點「更多」→ 六卡；點每卡進子頁、返回正常。

- [ ] **Step 6: 驗收 + commit**

```bash
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 更多頁工具方格與可返回子頁容器框架

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5：記帳子頁（完整功能，本階段重點）

`B_Expense` 子元件：總花費卡、預算條、分類統計、日期篩選、花費列表、新增/刪除，接 Task 0 純函式，存 `polska.expenses.v1` 與 `polska.settings.v1`。

**Files:**
- Modify: `redesign/B-companion.jsx`（實作 `B_Expense` 取代 Task 4 佔位）
- Modify: `redesign/B-companion.css`（`.B-expense*`、`.B-fab`）
- Test: `tests/ui-contract.test.mjs`（記帳 UI 契約）；純邏輯已由 `tests/expense.test.mjs` 覆蓋

**Interfaces:**
- Consumes: `core.readJSON/writeJSON/expenseTotals/budgetStatus/plnToTwd/DEFAULT_SETTINGS/EXPENSE_CATEGORIES`（Task 0）；`storage`（Task 4）；`window.TRIP.days`（日期篩選來源）。
- Produces: 無（葉子元件）。

**行為規格：**
- 載入時 `readJSON(storage,'polska.expenses.v1',[])` 與 `readJSON(storage,'polska.settings.v1',DEFAULT_SETTINGS)`。
- 新增：FAB「＋新增記帳」開表單（品項文字、金額 PLN 數字、分類下拉、Day 下拉 1–8、付款方式），送出建 `{id:Date.now()+random, day, category, item, amountPLN:Number, method, ts:Date.now()}`，`unshift` 後 `writeJSON` 存回，state 更新。
- 刪除：每列刪除鈕，過濾後存回。
- 日期篩選膠囊：全部 / Day1–8，只影響列表顯示，不影響總額（總額為全部）。
- 台幣顯示：每筆與總額用 `plnToTwd(amountPLN, settings.fxRate)`。
- 預算條：`budgetStatus(totals.totalPLN, fxRate, budgetTWD)`，`over` 時條變紅。
- storage 不可用（`writeJSON` 回 false）：顯示「目前無法儲存，本次紀錄僅暫存」提示，仍可操作當次 session。

- [ ] **Step 1: 記帳 UI 契約測試（先失敗）**

```javascript
test('記帳子頁含總額、預算條、分類統計、新增與列表', () => {
  assert.match(jsx, /function B_Expense/);
  assert.match(jsx, /polska\.expenses\.v1/);
  assert.match(jsx, /新增記帳/);
  assert.match(jsx, /core\.expenseTotals|expenseTotals\(/);
  assert.match(jsx, /core\.budgetStatus|budgetStatus\(/);
  assert.match(css, /\.B-expense-total/);
  assert.match(css, /\.B-budget-bar/);
  assert.match(css, /\.B-fab/);
});
```

- [ ] **Step 2: 跑測試確認失敗** → FAIL

- [ ] **Step 3: 實作 B_Expense**

實作 `B_Expense`（React.useState 管 expenses/settings/表單開關/篩選日）。JSX 結構（class 名稱為契約，須一致）：

- `.B-expense-total`（深色卡）：`.total-pln`（PLN 大字）＋ `.total-twd`（≈ NT$…）＋ `.total-rate`（1 PLN ≈ NT${fxRate}）。
- `.B-budget-bar`：內 `.fill`（寬度 `Math.min(ratio,1)*100%`；`over` 時加 `.is-over`）＋文字「已花 NT${spentTWD} / 預算 NT${budgetTWD}」。
- `.B-cat-grid`：四張 `.B-cat-tile`，各顯示分類 label 與該類 `plnToTwd(byCategory[key],fxRate)`。
- `.B-day-filter`：膠囊「全部」＋ Day1–8（讀 `t.days` 長度），選中 `.active`。
- `.B-expense-list`：每筆 `.B-expense-row`：品項、`.cat`、`.amt`（PLN）、`.twd`（≈NT$）、`.method`、`.day`，右側 `.del` 刪除鈕。
- `.B-fab`：固定右下「＋新增記帳」，開 `.B-expense-form`（可用既有 sheet 樣式或 inline 表單）。
- 數字元素一律 `font-variant-numeric:tabular-nums`、`font-family:var(--mono)`。

CSS（新增）：

```css
.B-expense-total{ background:var(--ink); color:var(--paper); border-radius:16px; padding:var(--pad-lg); display:flex; flex-direction:column; gap:4px; }
.B-expense-total .total-pln{ font-family:var(--mono); font-size:2.1rem; font-variant-numeric:tabular-nums; }
.B-expense-total .total-twd{ font-family:var(--mono); font-size:1rem; color:var(--amber); }
.B-expense-total .total-rate{ font-family:var(--mono); font-size:.7rem; opacity:.7; letter-spacing:.08em; }
.B-budget-bar{ margin:var(--gap-md) 0; height:10px; border-radius:999px; background:rgba(26,22,18,.10); overflow:hidden; }
.B-budget-bar .fill{ height:100%; background:var(--amber); transition:width .4s var(--ease-out); }
.B-budget-bar .fill.is-over{ background:var(--crimson); }
.B-cat-grid{ display:grid; grid-template-columns:1fr 1fr; gap:var(--gap-sm); }
.B-cat-tile{ background:#fbf6ea; border:1px solid rgba(26,22,18,.10); border-radius:12px; padding:var(--pad-sm); }
.B-cat-tile .amt{ font-family:var(--mono); font-variant-numeric:tabular-nums; color:var(--crimson); }
.B-day-filter{ display:flex; gap:6px; overflow-x:auto; padding:var(--gap-sm) 0; }
.B-day-filter .pill{ white-space:nowrap; }
.B-day-filter .pill.active{ background:var(--crimson); color:var(--paper); }
.B-expense-row{ display:grid; grid-template-columns:1fr auto auto; gap:8px; align-items:center; padding:var(--pad-sm) 0; border-bottom:1px solid rgba(26,22,18,.08); }
.B-expense-row .amt,.B-expense-row .twd{ font-family:var(--mono); font-variant-numeric:tabular-nums; }
.B-expense-row .del{ color:var(--crimson); background:none; border:none; font-size:1.1rem; }
.B-fab{ position:fixed; right:16px; bottom:calc(var(--safe-bottom) + 76px); background:var(--crimson); color:var(--paper); border:none; border-radius:999px; padding:14px 20px; box-shadow:var(--shadow-md); font-family:var(--serif); z-index:130; }
.B-expense-empty{ text-align:center; color:var(--ink-mute); padding:var(--pad-lg); font-family:var(--serif); }
```

- [ ] **Step 4: 跑測試 + build** → `node --test tests/ui-contract.test.mjs` PASS；`node --test tests/expense.test.mjs` PASS；`./build.sh`

- [ ] **Step 5: 真實瀏覽器驗收（關鍵）**

headless Chrome 390px：更多→記帳→新增一筆（如 餐飲 50 PLN）→ 確認列表出現、台幣≈NT$385、總額與預算條更新 → 重新整理頁面 → 資料仍在（localStorage 持久化）→ 刪除一筆 → 總額回落。console 0 error。

- [ ] **Step 6: 驗收 + commit**

Run: `./verify.sh` → 全綠

```bash
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 完整記帳子頁（本機儲存、PLN→TWD、預算與分類）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6：匯率換算與打包清單子頁

兩個離線最常用的互動子頁：匯率即時換算（可調整 fxRate 並寫回共用 settings）、打包清單勾選（存 localStorage）。

**Files:**
- Modify: `redesign/B-companion.jsx`（實作 `B_FxTool`、`B_Packing`）
- Modify: `redesign/B-companion.css`（`.B-fx*`、`.B-packing*`）
- Modify: `redesign/data.js`（新增 `TRIP.packingDefault` 靜態預設清單，若不存在）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: `core.readJSON/writeJSON/plnToTwd/DEFAULT_SETTINGS`；`storage`；`window.TRIP.packingDefault`。
- Produces: 無。fxRate 與 Task 5 共用 `polska.settings.v1`（改匯率後記帳台幣同步）。

**行為：**
- 匯率換算：兩個輸入框 PLN ⇄ TWD 即時雙向換算（改一邊算另一邊）；一個「1 PLN = ? TWD」可調欄位，改動後 `writeJSON(storage,'polska.settings.v1',{...settings,fxRate})`。
- 打包清單：讀 `packingDefault`（分類 → 項目陣列）＋ `readJSON(storage,'polska.packing.v1',{})`（勾選狀態 map，key 為項目）；checkbox 勾選即時 `writeJSON` 存回。

- [ ] **Step 1: 契約測試（先失敗）**

```javascript
test('匯率換算與打包清單子頁存在且持久化', () => {
  assert.match(jsx, /function B_FxTool/);
  assert.match(jsx, /function B_Packing/);
  assert.match(jsx, /polska\.settings\.v1/);
  assert.match(jsx, /polska\.packing\.v1/);
  assert.match(css, /\.B-fx/);
  assert.match(css, /\.B-packing/);
});
```

- [ ] **Step 2: 跑測試確認失敗** → FAIL

- [ ] **Step 3: 實作**

`data.js` 加（若無）`TRIP.packingDefault`，例：

```javascript
packingDefault: {
  '證件與金錢': ['護照', '簽證/ETIAS 確認', '信用卡', '歐元/茲羅提現金', '旅遊保險單'],
  '電子': ['手機', '充電器', '歐規轉接頭', '行動電源', '耳機'],
  '衣物（10 月波蘭）': ['保暖外套', '毛帽手套', '圍巾', '雨具', '好走的鞋'],
  '藥品盥洗': ['常備藥', '暈車藥', '牙刷牙膏', '保養品'],
},
```

`B_FxTool`：class `.B-fx`，含兩輸入 `.B-fx-input`（PLN、TWD）與 `.B-fx-rate`（可調匯率）。改 PLN → TWD = `plnToTwd(pln, rate)`；改 TWD → PLN = `(twd/rate)` 顯示兩位小數；改 rate → `writeJSON` 存回並重算。

`B_Packing`：class `.B-packing`，依 `packingDefault` 分類渲染，每項 `<label><input type=checkbox checked={checked[item]} onChange=...></label>`，onChange 更新 map 並 `writeJSON`。顯示各分類「已打包 x/y」。

CSS：

```css
.B-fx{ display:flex; flex-direction:column; gap:var(--gap-md); }
.B-fx-input,.B-fx-rate{ display:flex; align-items:center; gap:10px; font-family:var(--mono); }
.B-fx-input input,.B-fx-rate input{ flex:1; font-family:var(--mono); font-variant-numeric:tabular-nums; font-size:1.2rem; padding:10px 12px; border:1px solid rgba(26,22,18,.18); border-radius:10px; background:#fbf6ea; }
.B-fx-rate{ color:var(--ink-mute); font-size:.85rem; }
.B-packing-group{ margin-bottom:var(--gap-md); }
.B-packing-group h3{ font-family:var(--serif); font-size:1rem; display:flex; justify-content:space-between; border-bottom:1px solid var(--amber); padding-bottom:4px; }
.B-packing label{ display:flex; align-items:center; gap:10px; padding:8px 0; font-family:var(--serif); }
.B-packing input[type="checkbox"]{ width:20px; height:20px; accent-color:var(--crimson); }
```

- [ ] **Step 4: 跑測試 + build** → PASS；`./build.sh`

- [ ] **Step 5: 真實瀏覽器驗收**

390px：匯率頁改 PLN 看 TWD 即時變、改匯率後回記帳頁確認台幣換算同步；打包頁勾選後重整仍保留。

- [ ] **Step 6: 驗收 + commit**

```bash
git add redesign/B-companion.jsx redesign/B-companion.css redesign/data.js redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 匯率換算與打包清單子頁（本機持久化、匯率共用）

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7：SOS、實用資訊、Photo Map 子頁

三個以既有資料為主的子頁。SOS/實用資訊讀 `window.TRIP`（盤點確認 `t.safety`、`t.practical`、`t.phrases` 皆存在）；Photo Map 讀四城市＋打卡存 localStorage。

**Files:**
- Modify: `redesign/B-companion.jsx`（`B_Sos`、`B_Info`、`B_PhotoMap`）
- Modify: `redesign/B-companion.css`（`.B-sos*`、`.B-info*`、`.B-photomap*`）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: `window.TRIP.safety`（`.emergency`、`.tips`）、`window.TRIP.practical`、`window.TRIP.phrases`、`window.TRIP.days`（取城市清單）；`core.readJSON/writeJSON`；`storage`。
- Produces: 無。

**行為：**
- `B_Sos`：卡片列出 `t.safety.emergency`（緊急電話，若為陣列/物件依既有結構渲染）與 `t.safety.tips`；緊急電話用可點 `tel:` 連結，大字醒目。
- `B_Info`：分區顯示 `t.practical`（插座/電壓/小費等）與 `t.phrases`（波蘭語常用句，中／波對照）。
- `B_PhotoMap`：四城市卡（華沙/克拉科夫/樂斯拉夫/波茲南或由 `t.days` 去重城市），每城「打卡」toggle 存 `polska.photomap.v1`，頂部顯示完成度 x/4。

- [ ] **Step 1: 契約測試（先失敗）**

```javascript
test('SOS、實用資訊、Photo Map 子頁存在且接既有資料', () => {
  assert.match(jsx, /function B_Sos/);
  assert.match(jsx, /function B_Info/);
  assert.match(jsx, /function B_PhotoMap/);
  assert.match(jsx, /safety/);
  assert.match(jsx, /phrases/);
  assert.match(jsx, /polska\.photomap\.v1/);
  assert.match(css, /\.B-sos/);
  assert.match(css, /\.B-photomap/);
});
```

- [ ] **Step 2: 跑測試確認失敗** → FAIL

- [ ] **Step 3: 實作三子頁**

依 `data.js` 實際結構讀取（實作前先確認 `t.safety`/`t.practical`/`t.phrases` 的欄位形狀：讀 `redesign/data.js` 對應段落，注意 `t.practical` 是頂層、與逐日 `d.practical` 不同）。渲染要防禦：欄位缺失時該區塊不顯示、不拋錯。

CSS（重點類）：

```css
.B-sos-call{ display:flex; justify-content:space-between; align-items:center; background:var(--crimson); color:var(--paper); border-radius:14px; padding:var(--pad-md); margin-bottom:var(--gap-sm); font-family:var(--mono); font-size:1.3rem; }
.B-sos-tip{ padding:8px 0; border-bottom:1px solid rgba(26,22,18,.08); font-family:var(--serif); }
.B-info-phrase{ display:flex; justify-content:space-between; gap:12px; padding:8px 0; border-bottom:1px solid rgba(26,22,18,.08); }
.B-info-phrase .pl{ font-family:var(--serif); color:var(--crimson); }
.B-photomap-head{ font-family:var(--mono); color:var(--amber-deep); margin-bottom:var(--gap-sm); }
.B-photomap-city{ display:flex; justify-content:space-between; align-items:center; padding:var(--pad-md); background:#fbf6ea; border:1px solid rgba(26,22,18,.10); border-radius:14px; margin-bottom:var(--gap-sm); }
.B-photomap-city.is-done{ border-color:var(--crimson); }
```

- [ ] **Step 4: 跑測試 + build** → PASS；`./build.sh`

- [ ] **Step 5: 真實瀏覽器驗收** — 三子頁各開一次，SOS 電話可見、實用資訊有波蘭語、Photo Map 打卡後重整保留、完成度更新。

- [ ] **Step 6: 驗收 + commit**

```bash
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): SOS 緊急卡、實用資訊（含波蘭語）、Photo Map 子頁

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 8：三格儀表接記帳、SW 快取升級與全面驗收

收尾：首頁三格儀表接真實記帳累計、更多頁預算預覽、Service Worker 快取版本升級以納入新資產，最後全面 headless Chrome 驗收。

**Files:**
- Modify: `redesign/B-companion.jsx`（首頁三格儀表 `home` 分頁、更多頁預算預覽讀 `core.expenseTotals`）
- Modify: `sw.js`（cache 版本 `polska-v16` → `polska-v17`，啟用時清舊 `polska-*`）
- Modify: `tests/sw-contract.test.mjs`（若其斷言 cache 版本字串，更新為 v17）
- Modify: `mobile.html`（資產 querystring `?v=polska-v16` → `?v=polska-v17`，與既有版本化慣例一致；見 `mobile.html:16-50`）
- Test: `tests/ui-contract.test.mjs`、`tests/sw-contract.test.mjs`

**Interfaces:** Consumes：Task 0/5 的記帳資料與純函式。Produces：無。

- [ ] **Step 1: 檢查現有 SW 版本契約測試**

Run: `grep -n "polska-v" sw.js tests/sw-contract.test.mjs mobile.html`
確認目前版本字串位置（預期多處 `polska-v16`）。

- [ ] **Step 2: 更新測試為 v17（先失敗）**

把 `tests/sw-contract.test.mjs` 中斷言 cache 名稱的地方改為 `polska-v17`（若測試以變數比對則同步）。新增 ui-contract 斷言：

```javascript
test('首頁三格儀表接記帳累計', () => {
  assert.match(jsx, /B-dash/);
  assert.match(jsx, /expenseTotals\(/);
});
```

- [ ] **Step 3: 跑測試確認失敗** → `node --test tests/sw-contract.test.mjs tests/ui-contract.test.mjs` FAIL

- [ ] **Step 4: 實作**

- `sw.js`：cache 常數改 `polska-v17`；`activate` 時清除非當前的 `polska-*`（沿用既有清理邏輯）。precache 清單確認含 `redesign/B-companion.css`、`redesign/dist/B-companion.js`、`redesign/pwa-core.js`、`redesign/data.js`、`mobile.html`（多為既有項，僅隨版本更新）。
- `mobile.html`：所有 `?v=polska-v16` 改 `?v=polska-v17`。
- 首頁三格儀表 `.B-dash`：第幾天/共 8、`expenseTotals(expenses).totalPLN`→台幣、下一步（今日 steps 下一項或既有 `B_formatMinutes` 邏輯）。更多頁預算預覽用 `budgetStatus`。

- [ ] **Step 5: 跑測試 + build** → PASS；`./build.sh`

- [ ] **Step 6: 全面驗收（headless Chrome）**

見下方「全域驗收法」。在 390px 與 320px 各跑一次：四分頁、hero 輪播、六子頁、記帳新增/持久化、無水平溢出、console 0 error；離線（DevTools offline）重開 `mobile.html` 仍可用核心與記帳。

- [ ] **Step 7: 完整驗收 + commit**

Run: `./verify.sh` → 全綠

```bash
git add redesign/B-companion.jsx redesign/dist/B-companion.js sw.js mobile.html tests/sw-contract.test.mjs tests/ui-contract.test.mjs
git commit -m "feat(mobile): 三格儀表接記帳、SW 快取升 v17、全面驗收

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## 全域驗收法（每個 UI Task 的真實瀏覽器步驟）

本機起靜態伺服器後用 headless Chrome（或 Playwright MCP）驗：

```bash
# 於專案根起簡易伺服器（擇一）
python3 -m http.server 8080
# 另開驗證：載入 http://localhost:8080/mobile.html，viewport 390x844 與 320x568
```

每次驗收檢查：(1) 目標互動可完成；(2) `document.body.scrollWidth <= window.innerWidth`（無水平溢出）；(3) console 0 error；(4) localStorage 類功能重整後保留。截圖存 `docs/verification/` 供回溯。

---

## Self-Review（對照 spec 逐項）

- **spec §4 四分頁** → Task 1 ✅；**spec §6.1 hero 輪播** → Task 3 ✅；**§6.2 行程/§6.3 交通** → Task 1 分組（沿用既有 timeline/train/tickets 內容）✅；**§6.4 更多** → Task 4 ✅。
- **spec §7 記帳完整** → Task 0（純邏輯）＋ Task 5（UI）✅。
- **spec §8 其他子頁**：匯率/打包 → Task 6 ✅；SOS/實用資訊/Photo Map → Task 7 ✅。
- **spec §5 視覺系統** → Task 2 ✅（tokens 已對，收斂卡片語彙）。
- **spec §9 離線** → Task 8 SW 升級 ✅；降級（storage 不可用提示）→ Task 5/6/7 各自處理 ✅。
- **spec §3 成功標準 1–10**：分頁(1,T1)、hero(2,T3)、子頁切換(3,T4)、記帳持久化(4,T5)、視覺(5,T2)、資料不分叉(6, 沿用 window.TRIP 全程)、離線(7,T8)、verify+headless(8, 每 Task)、桌機不動(9, Global Constraints＋T1 限定 max-width:899px)、繁中無簡體(10, Global Constraints)。全部有對應。
- **Placeholder scan**：Task 4 明列「先放暫時佔位，Task 5–7 取代」屬刻意的漸進骨架，非計劃空洞；其餘步驟均含實際程式碼或精確類名契約。
- **Type consistency**：`readJSON/writeJSON/expenseTotals/budgetStatus/plnToTwd/DEFAULT_SETTINGS/EXPENSE_CATEGORIES` 在 Task 0 定義，Task 5/6/7/8 引用一致；storage key `polska.{expenses,settings,packing,photomap}.v1` 全程一致；state 名 `activeTab`/`subpage` 一致。

## 風險與備註

- **UI 大改的測試限制**：本專案 UI 測試為「靜態原始碼 regex 契約」，無法驗真實渲染。故每個 UI Task **必跑 headless Chrome 真實驗收**（見上），這是硬門檻，不可只靠 `verify.sh` 綠燈。
- **桌機 B_Companion ≥900px**：實務上 `index.html` 於 ≥768px 給桌機分章雜誌，B_Companion 桌機雙欄少被觸及，但測試仍守；Task 1 用 `max-width:899px` 限定 tab 規則以確保桌機契約不破。
- **真實照片**：hero 與 Photo Map 開發期用漸層佔位；正式照片由使用者後續提供，替換時只動 CSS 背景/img src，不動邏輯。
- **bundle 一致性**：最易踩雷點——改 `.jsx` 忘記 `./build.sh` 會被 `verify.sh` 的 `cmp` 擋下。每個改 jsx 的 Task 都已內含 build 步驟。

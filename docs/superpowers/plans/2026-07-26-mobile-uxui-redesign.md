# 手機 UX/UI 重新設計 實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把 `/mobile.html` 手機 PWA 改成照片主導的暖白紙卡介面，底部分頁改為「首頁／行程／交通／記帳」，並加上退稅門檻提醒、下一班車倒數、景點級拍照清單三個旅途實用功能。

**Architecture:** 三層推進——先在 `redesign/pwa-core.js`（IIFE 全域單例、可用 `node:vm` 真跑）補齊所有新的純函式與資料防護，再把照片資產與部署／離線契約接好，最後才動 `redesign/B-companion.jsx`／`B-companion.css` 的外觀與資訊架構。純邏輯全部 TDD（真的執行函式），UI 結構用既有的原始碼 regex 契約測試把關。桌機版一行都不改。

**Tech Stack:** React 18（`vendor/react.production.min.js`，全域 `React`，非 ES module）／JSX 經 `build.sh` 用 esbuild `--jsx=transform` 編成已提交的 `redesign/dist/B-companion.js`／Node 內建 test runner（`node --test tests/*.test.mjs`）／原生 Service Worker／localStorage／無任何前端框架或套件管理器依賴。

## Global Constraints

以下每一條適用於每個 Task，不再重複列出：

- **繁體中文，絕對禁止簡體字。** 中文與英文／數字之間加半形空格（例：`已花 NT$1,311`）。
- **桌機版禁改：** `redesign/tokens.css`、`desktop/desktop.css`、`desktop/desktop-app.js`、`desktop/chapters.js`、`index.html` 的桌機區塊一律不動。`tokens.css` 的 `--paper #f4ecd8`／`--crimson #a8231d` 是桌機雜誌用色，方案 A 的新色票必須以**新變數**寫在 `redesign/B-companion.css`，作用範圍限定手機殼。
- **改 `B-companion.jsx` 必須同一個 commit 內跑 `./build.sh` 並 `git add redesign/dist/B-companion.js`。** `verify.sh` 會比對 build 前後 bundle，不一致直接 fail。
- **驗收指令一律 `./verify.sh`**，綠燈才能 commit。目前基線：89 tests pass / 0 fail、bundle 48.0kb。
- **紅色只作訊號**（硬限制、最後入場、誤點、超支），不作裝飾。取代現況「滿頁紅字」。
- **不引入任何外部套件、CDN、webfont、執行時 API 呼叫。** 離線優先。
- **localStorage 既有 key 不可破壞：** `polska.expenses.v1`、`polska.settings.v1`、`polska.packing.v1`、`polska.photomap.v1`、`polska-notes`。變更資料形狀一律寫遷移並備份舊值。
- **照片授權必須在 App 內看得見。** 四張照片三張 CC BY-SA、一張 CC BY，`assets/photos/CREDITS.md` 放在 repo 裡不算履行義務（訪客看不到），必須有可從介面到達的出處畫面。
- **新增任何線上檔案，三件事一起做：** 升 `sw.js:3` 的 `CACHE_VERSION`、加進 `PRECACHE_URLS`（`sw.js:6-24`）、同步 `index.html`（9 處）與 `mobile.html`（6 處）的 `?v=` 字串，並加進 `prepare-site.sh` 的 allowlist。漏 allowlist＝線上 404，漏 precache＝離線缺圖，且 `caches.addAll` 是原子操作，漏一項會讓**整個**離線功能失效。
- **規格來源：** `docs/superpowers/specs/2026-07-26-mobile-uxui-redesign-design.md`。與本計畫衝突時以規格為準，並回報衝突。

---

## File Structure

| 檔案 | 責任 | 本計畫的動作 |
|---|---|---|
| `redesign/pwa-core.js`（129 行） | 所有純邏輯與 storage 存取；IIFE 掛 `window.PolskaPwaCore` | 修 `readJSON`；新增退稅、倒數、拍照清單遷移共 7 個函式 |
| `redesign/data.js`（594 行，`window.TRIP`） | 唯一旅程資料來源 | 新增 `photoSpots`、`cities[].photo`、`photoCredits` 三個欄位，不改既有欄位語意 |
| `redesign/B-companion.jsx`（1608 行，`window.B_Companion`） | 整支手機 App | 分頁結構、首頁／記帳／行程／交通／拍照清單改版、M2–M4 修復 |
| `redesign/B-companion.css`（1055 行，`B-` 前綴） | 手機樣式 | 新增方案 A token 區段與各畫面樣式 |
| `assets/photos/`（新目錄） | 四城照片與授權紀錄 | 新建，8 個 WebP ＋ `CREDITS.md` |
| `sw.js`（129 行） | 離線快取 | 版本升 v18、precache 加 8 張照片 |
| `prepare-site.sh`（32 行） | 發布白名單 | 加 `assets/photos` |
| `tests/*.test.mjs` | 契約測試 | 新增 `tax-refund.test.mjs`、`next-train.test.mjs`、`photo-spots.test.mjs`；擴充 `ui-contract.test.mjs`、`expense.test.mjs`、`sw-contract.test.mjs`、`deploy-contract.test.mjs` |

照片素材已備妥（本計畫外先完成）：`/private/tmp/claude-501/-Users-xieh/f651e88f-1f75-4af2-89af-03435f37ebc7/scratchpad/photos/` 內 8 個 WebP 共 255KB ＋ `CREDITS.md`。

---

## Task 1：M1 — `readJSON` 型別守門

**Files:**
- Modify: `redesign/pwa-core.js:75-85`
- Test: `tests/expense.test.mjs`（沿用其 `vm.runInNewContext` 引入方式）

**Interfaces:**
- Consumes: 無
- Produces: `readJSON(storage, key, fallback)` 行為改變——當 storage 內的值與 `fallback` 的型別不符（陣列 vs 物件 vs 純量）時回傳 fallback 深拷貝，不再把壞資料交給呼叫端。所有後續 Task 都依賴這個保證。

- [ ] **Step 1：寫失敗測試**

加到 `tests/expense.test.mjs` 末尾：

```js
test('readJSON 型別不符時回 fallback，不把壞資料交出去', () => {
  const bad = { getItem: () => '{"oops":1}', setItem: () => {} };
  assert.deepEqual(core.readJSON(bad, 'polska.expenses.v1', []), []);

  const badArr = { getItem: () => '[1,2,3]', setItem: () => {} };
  assert.deepEqual(core.readJSON(badArr, 'polska.settings.v1', { fxRate: 7.7 }), { fxRate: 7.7 });

  const good = { getItem: () => '[{"amountPLN":50}]', setItem: () => {} };
  assert.deepEqual(core.readJSON(good, 'polska.expenses.v1', []), [{ amountPLN: 50 }]);

  const num = { getItem: () => '"abc"', setItem: () => {} };
  assert.equal(core.readJSON(num, 'k', 0), 0);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/expense.test.mjs`
Expected: FAIL — 第一個斷言就掛，實際回 `{oops:1}` 而非 `[]`。

- [ ] **Step 3：實作**

把 `redesign/pwa-core.js:75-85` 整段換成：

```js
  function readJSON(storage, key, fallback) {
    var clone = JSON.parse(JSON.stringify(fallback));
    try {
      var raw = storage && storage.getItem ? storage.getItem(key) : null;
      if (raw == null) return clone;
      var parsed = JSON.parse(raw);
      if (parsed == null) return clone;
      if (Array.isArray(fallback) !== Array.isArray(parsed)) return clone;
      if (typeof parsed !== typeof fallback) return clone;
      return parsed;
    } catch (e) {
      return clone;
    }
  }
```

- [ ] **Step 4：跑測試確認通過**

Run: `./verify.sh`
Expected: 全綠，測試數由 89 增加。

- [ ] **Step 5：Commit**

```bash
git add redesign/pwa-core.js tests/expense.test.mjs
git commit -m "fix(pwa-core): readJSON 加型別守門，壞資料不再造成白頁

M1：polska.expenses.v1 若存成非陣列，原本會讓 expenseTotals 的 forEach 拋
TypeError，整支 App 白頁且非工程師無法自救。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 2：M2／M3 — 寫入失敗與表單錯誤都要看得見

**Files:**
- Modify: `redesign/B-companion.jsx:508-512`（`B_PhotoMap.toggle`）、`:564-574`（`B_FxTool.onRateChange`）、`:616-621`（`B_Packing.toggle`）、`:370-386`（`submitForm`）、以及三個元件的 JSX 各加一行警語
- Modify: `redesign/B-companion.css`（加 `.B-store-warn`、`.B-form-error`）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: Task 1 的 `readJSON` 保證
- Produces: 三個工具元件各有 `storeOk` state；`B_Expense` 有 `formError` state。命名固定，Task 11 會沿用 `.B-store-warn` 樣式。

- [ ] **Step 1：寫失敗測試**

加到 `tests/ui-contract.test.mjs` 末尾：

```js
test('三個工具子頁接住 writeJSON 失敗並顯示警語', () => {
  assert.match(jsx, /const \[storeOk, setStoreOk\] = B_useState\(true\)/);
  assert.match(jsx, /setStoreOk\(core\.writeJSON\(storage, 'polska\.photomap\.v1'/);
  assert.match(jsx, /setStoreOk\(core\.writeJSON\(storage, 'polska\.settings\.v1'/);
  assert.match(jsx, /setStoreOk\(core\.writeJSON\(storage, 'polska\.packing\.v1'/);
  assert.match(css, /\.B-store-warn/);
});

test('記帳表單驗證失敗顯示可讀錯誤而非靜默 return', () => {
  assert.match(jsx, /const \[formError, setFormError\] = B_useState\('')/);
  assert.match(jsx, /setFormError\('請填品項名稱'\)/);
  assert.match(jsx, /setFormError\('金額請填大於 0 的數字'\)/);
  assert.match(jsx, /role="alert"/);
  assert.match(css, /\.B-form-error/);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL — 兩個測試都因為 `storeOk`／`formError` 不存在而失敗。

- [ ] **Step 3：實作三處 writeJSON**

`B_PhotoMap`（原 508-512）：

```js
  const [storeOk, setStoreOk] = B_useState(true);
  const toggle = (city) => {
    const next = { ...checkins, [city]: !checkins[city] };
    setCheckins(next);
    setStoreOk(core.writeJSON(storage, 'polska.photomap.v1', next));
  };
```

`B_FxTool`（原 564-574，只改 571 那行與加 state）：

```js
  const [storeOk, setStoreOk] = B_useState(true);
```
```js
    setStoreOk(core.writeJSON(storage, 'polska.settings.v1', nextSettings));
```

`B_Packing`（原 616-621）：

```js
  const [storeOk, setStoreOk] = B_useState(true);
  const toggle = (group, item) => {
    const key = packKey(group, item);
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    setStoreOk(core.writeJSON(storage, 'polska.packing.v1', next));
  };
```

三個元件的 return 最外層第一個子元素都加：

```jsx
      {!storeOk && <p className="B-store-warn">目前無法儲存，這次的變更只在這個畫面有效</p>}
```

- [ ] **Step 4：實作 submitForm 錯誤提示**

`redesign/B-companion.jsx:370-386` 換成：

```js
  const submitForm = (e) => {
    e.preventDefault();
    const amount = Number(form.amountPLN);
    if (!form.item.trim()) { setFormError('請填品項名稱'); return; }
    if (!isFinite(amount) || amount <= 0) { setFormError('金額請填大於 0 的數字'); return; }
    setFormError('');
    const entry = {
      id: Date.now() + Math.random(),
      day: Number(form.day),
      category: form.category,
      item: form.item.trim(),
      amountPLN: amount,
      method: form.method,
      ts: Date.now(),
    };
    persist([entry, ...expenses]);
    setForm({ item: '', amountPLN: '', category: form.category, day: Number(form.day), method: form.method });
    setFormOpen(false);
  };
```

`B_Expense` 內加 state（放在 `persistOk` 宣告旁，原 350 附近）：

```js
  const [formError, setFormError] = B_useState('');
```

表單內（送出鍵上方）加：

```jsx
        {formError && <p className="B-form-error" role="alert">{formError}</p>}
```

- [ ] **Step 5：加樣式**

`redesign/B-companion.css` 末尾：

```css
/* ---- 儲存失敗與表單錯誤提示 ---- */
.B-store-warn,
.B-form-error {
  margin: 0 0 10px;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 12.5px;
  line-height: 1.45;
  background: #FDEDE3;
  color: #8C3E1C;
}
```

- [ ] **Step 6：Build、驗收、Commit**

```bash
./build.sh && ./verify.sh
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "fix(mobile): 寫入失敗與表單驗證失敗都給使用者看得見的提示

M2：Photo Map／匯率／打包清單三處丟棄 writeJSON 回傳值，Safari 隱私模式下
畫面顯示已儲存但實際沒存。M3：記帳表單驗證失敗直接 return，使用者按儲存
毫無反應會判定 App 壞了。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 3：M4 — 子頁接上既有的焦點管理 hook

**Files:**
- Modify: `redesign/B-companion.jsx:284-296`（`B_Subpage`）、`:917-931`（Escape 與 scroll lock effect）、`:1594-1603`（渲染入口）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: 既有 `B_useModalFocus(open, panelRef, closeRef, returnFocusRef)`（`B-companion.jsx:138-177`，drawer 與交通 sheet 已在用）
- Produces: `subpageReturnFocusRef`；子頁與其他 modal 表面行為一致。Task 9 的「⋯」工具選單會沿用同一模式。

- [ ] **Step 1：寫失敗測試**

```js
test('子頁沿用既有 modal 焦點契約，Escape 可關且鎖背景滾動', () => {
  assert.match(jsx, /subpageReturnFocusRef/);
  assert.match(jsx, /B_useModalFocus\(\s*!!subpage/);
  assert.match(jsx, /e\.key === 'Escape' && subpage/);
  assert.match(jsx, /drawerOpen \|\| trainSheet \|\| subpage \? 'hidden' : ''/);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL — `subpageReturnFocusRef` 不存在。

- [ ] **Step 3：實作**

`B_Companion` 內（`drawerReturnFocusRef` 宣告處 773 附近）加：

```js
  const subpageRef = B_useRef(null);
  const subpageCloseRef = B_useRef(null);
  const subpageReturnFocusRef = B_useRef(null);
```
```js
  B_useModalFocus(!!subpage, subpageRef, subpageCloseRef, subpageReturnFocusRef);
```

Escape effect（917-925）換成：

```js
  // Close modal surfaces on Escape
  B_useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (subpage) { setSubpage(null); return; }
      if (trainSheet) { setTrainSheet(false); return; }
      if (drawerOpen) setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen, trainSheet, subpage]);
```

scroll lock effect（928-931）換成：

```js
  // Lock body scroll while modal surfaces are open.
  B_useEffect(() => {
    document.body.style.overflow = drawerOpen || trainSheet || subpage ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen, trainSheet, subpage]);
```

`B_Subpage`（284-296）把 `subpageRef` 綁到 `.B-subpage-mask` 的面板、`subpageCloseRef` 綁到返回鍵——改成接 props：

```jsx
function B_Subpage({ title, onBack, panelRef, closeRef, children }) {
```

渲染入口（1595）補上：

```jsx
    <B_Subpage title={SUBPAGE_TITLES[subpage]} onBack={() => setSubpage(null)} panelRef={subpageRef} closeRef={subpageCloseRef}>
```

開啟處（`B_ToolGrid` 的 `onOpen`，1532）改成記住開啟者：

```jsx
        onOpen={(key, ev) => { subpageReturnFocusRef.current = ev && ev.currentTarget; setSubpage(key); }}
```

並在 `B_ToolGrid`（311）把事件物件傳出去：

```jsx
          onClick={(ev) => onOpen(key, ev)}
```

- [ ] **Step 4：Build、驗收**

Run: `./build.sh && ./verify.sh`
Expected: 全綠。

- [ ] **Step 5：Commit**

```bash
git add redesign/B-companion.jsx redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "fix(mobile): 子頁併入既有 modal 焦點契約（M4）

子頁宣告 role=dialog aria-modal 卻沒有配套：Escape 不關、背景可滾動、焦點
留在外面的工具卡。改為沿用 drawer 與交通 sheet 共用的 B_useModalFocus。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 4：退稅門檻純函式

**Files:**
- Modify: `redesign/pwa-core.js`（新增函式並加入 124-127 的 export 物件）
- Create: `tests/tax-refund.test.mjs`

**Interfaces:**
- Consumes: 無
- Produces:
  - `TAX_FREE_MIN_PLN = 200`（常數）
  - `taxRefundStatus(amountPLN, category)` → `{ state: 'eligible'|'near'|'none', shortfallPLN: number }`；`near` 的門檻是 150–199.99
  - `taxRefundEstimate(amountPLN, fxRate)` → `{ lowTWD: number, highTWD: number }`（10%／18%，四捨五入到整數）
  - `taxRefundSummary(expenses, fxRate)` → `{ count, totalPLN, lowTWD, highTWD }`（只計 `category === 'shop'` 且單筆 ≥ 200 的項目）

- [ ] **Step 1：寫失敗測試**

建 `tests/tax-refund.test.mjs`：

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), context);
const core = context.globalThis.PolskaPwaCore;

test('門檻是單筆 200 PLN，199 不算達標', () => {
  assert.equal(core.TAX_FREE_MIN_PLN, 200);
  assert.equal(core.taxRefundStatus(200, 'shop').state, 'eligible');
  assert.equal(core.taxRefundStatus(250.5, 'shop').state, 'eligible');
  assert.equal(core.taxRefundStatus(199, 'shop').state, 'near');
  assert.equal(core.taxRefundStatus(199, 'shop').shortfallPLN, 1);
  assert.equal(core.taxRefundStatus(150, 'shop').state, 'near');
  assert.equal(core.taxRefundStatus(149.99, 'shop').state, 'none');
});

test('只有購物分類會觸發退稅提示', () => {
  assert.equal(core.taxRefundStatus(500, 'food').state, 'none');
  assert.equal(core.taxRefundStatus(500, 'transport').state, 'none');
  assert.equal(core.taxRefundStatus(500, 'ticket').state, 'none');
});

test('預估退稅金額用 10%–18% 區間換算台幣', () => {
  const est = core.taxRefundEstimate(200, 9.5);
  assert.equal(est.lowTWD, 190);  // 200*0.10*9.5
  assert.equal(est.highTWD, 342); // 200*0.18*9.5
});

test('彙總不合併不同筆——兩筆各 150 不算一筆 300', () => {
  const expenses = [
    { category: 'shop', amountPLN: 150 },
    { category: 'shop', amountPLN: 150 },
    { category: 'shop', amountPLN: 220 },
    { category: 'food', amountPLN: 900 },
  ];
  const s = core.taxRefundSummary(expenses, 9.5);
  assert.equal(s.count, 1);
  assert.equal(s.totalPLN, 220);
});

test('無資料與壞資料不炸', () => {
  assert.equal(core.taxRefundSummary([], 9.5).count, 0);
  assert.equal(core.taxRefundSummary(null, 9.5).count, 0);
  assert.equal(core.taxRefundStatus(NaN, 'shop').state, 'none');
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/tax-refund.test.mjs`
Expected: FAIL — `core.TAX_FREE_MIN_PLN` 是 undefined。

- [ ] **Step 3：實作**

加在 `redesign/pwa-core.js` 的 `budgetStatus` 之後：

```js
  // 波蘭 TAX FREE：門檻為「單張收據、同一店家」滿 200 PLN 含稅。
  // 不同收據不可合併——這是規定，不是簡化。實拿回約 10–18%（標準稅率 23%）。
  var TAX_FREE_MIN_PLN = 200;
  var TAX_FREE_NEAR_PLN = 150;
  var TAX_FREE_LOW_RATE = 0.10;
  var TAX_FREE_HIGH_RATE = 0.18;

  function taxRefundStatus(amountPLN, category) {
    var amt = Number(amountPLN);
    if (category !== 'shop' || !isFinite(amt) || amt <= 0) {
      return { state: 'none', shortfallPLN: 0 };
    }
    if (amt >= TAX_FREE_MIN_PLN) return { state: 'eligible', shortfallPLN: 0 };
    if (amt >= TAX_FREE_NEAR_PLN) {
      return { state: 'near', shortfallPLN: Math.round((TAX_FREE_MIN_PLN - amt) * 100) / 100 };
    }
    return { state: 'none', shortfallPLN: 0 };
  }

  function taxRefundEstimate(amountPLN, fxRate) {
    var amt = Number(amountPLN);
    var rate = Number(fxRate);
    if (!isFinite(amt) || amt <= 0 || !isFinite(rate) || rate <= 0) {
      return { lowTWD: 0, highTWD: 0 };
    }
    return {
      lowTWD: Math.round(amt * TAX_FREE_LOW_RATE * rate),
      highTWD: Math.round(amt * TAX_FREE_HIGH_RATE * rate),
    };
  }

  function taxRefundSummary(expenses, fxRate) {
    var count = 0, totalPLN = 0;
    (expenses || []).forEach(function (e) {
      if (!e || taxRefundStatus(e.amountPLN, e.category).state !== 'eligible') return;
      count += 1;
      totalPLN += Number(e.amountPLN) || 0;
    });
    var est = taxRefundEstimate(totalPLN, fxRate);
    return { count: count, totalPLN: totalPLN, lowTWD: est.lowTWD, highTWD: est.highTWD };
  }
```

在 export 物件（124-127）加入 `TAX_FREE_MIN_PLN`、`taxRefundStatus`、`taxRefundEstimate`、`taxRefundSummary`。

- [ ] **Step 4：跑測試確認通過**

Run: `./verify.sh`
Expected: 全綠。

- [ ] **Step 5：Commit**

```bash
git add redesign/pwa-core.js tests/tax-refund.test.mjs
git commit -m "feat(pwa-core): 退稅門檻判斷（單張收據 200 PLN，不可跨筆合併）

依波蘭 PUESC 官方規定：門檻為單張收據同一店家滿 200 PLN 含稅，不同收據
不可合併。taxRefundSummary 因此逐筆判斷而非累加後比較。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 5：下一班車倒數純函式

**Files:**
- Modify: `redesign/pwa-core.js`
- Create: `tests/next-train.test.mjs`

**Interfaces:**
- Consumes: `window.TRIP.trains`（`data.js:258-264`，欄位 `seg/date/type/dep/arr/dur/price`，`date` 格式 `'10/25'`）
- Produces:
  - `warsawOffsetHours(mmdd)` → `2` 或 `1`（2026 年歐洲夏令時間在 10/25 結束，故 `'10/24'` 為 UTC+2，`'10/25'` 起為 UTC+1）
  - `trainDepartureMs(train, year)` → UTC 毫秒
  - `nextTrain(trains, nowMs, year)` → `{ index, train, minutesUntil } | null`
  - `formatCountdown(minutes)` → `'還有 45 分'`／`'還有 14 小時'`／`'3 天後'`／`'即將出發'`

- [ ] **Step 1：寫失敗測試**

建 `tests/next-train.test.mjs`：

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), context);
const core = context.globalThis.PolskaPwaCore;

const TRAINS = [
  { seg: 'WAW → KRK', date: '10/25', type: 'EIP', dep: '09:00' },
  { seg: 'KRK → WRO', date: '10/27', type: 'IC', dep: '19:30' },
  { seg: 'POZ → WAW', date: '10/29', type: 'EIP', dep: '17:30' },
];

test('2026 夏令時間在 10/25 結束：10/24 是 UTC+2，10/25 起是 UTC+1', () => {
  assert.equal(core.warsawOffsetHours('10/24'), 2);
  assert.equal(core.warsawOffsetHours('10/25'), 1);
  assert.equal(core.warsawOffsetHours('10/31'), 1);
});

test('trainDepartureMs 用波蘭當地時間換算 UTC', () => {
  // 10/25 09:00 CET(UTC+1) = 08:00 UTC
  assert.equal(core.trainDepartureMs(TRAINS[0], 2026), Date.UTC(2026, 9, 25, 8, 0));
});

test('nextTrain 回傳下一段未出發的車', () => {
  const now = Date.UTC(2026, 9, 25, 6, 0); // 10/25 07:00 波蘭時間
  const r = core.nextTrain(TRAINS, now, 2026);
  assert.equal(r.index, 0);
  assert.equal(r.minutesUntil, 120);
});

test('已出發的段落會被跳過', () => {
  const now = Date.UTC(2026, 9, 25, 10, 0); // 10/25 11:00 波蘭時間，第一段已開走
  const r = core.nextTrain(TRAINS, now, 2026);
  assert.equal(r.index, 1);
  assert.equal(r.train.seg, 'KRK → WRO');
});

test('全部走完回 null', () => {
  const now = Date.UTC(2026, 10, 5, 0, 0);
  assert.equal(core.nextTrain(TRAINS, now, 2026), null);
  assert.equal(core.nextTrain([], now, 2026), null);
  assert.equal(core.nextTrain(null, now, 2026), null);
});

test('formatCountdown 給非工程師看得懂的字', () => {
  assert.equal(core.formatCountdown(0), '即將出發');
  assert.equal(core.formatCountdown(45), '還有 45 分');
  assert.equal(core.formatCountdown(120), '還有 2 小時');
  assert.equal(core.formatCountdown(150), '還有 2 小時 30 分');
  assert.equal(core.formatCountdown(60 * 24 * 3), '3 天後');
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/next-train.test.mjs`
Expected: FAIL — `warsawOffsetHours` 未定義。

- [ ] **Step 3：實作**

```js
  // 2026 年歐洲夏令時間於 10/25（十月最後一個週日）結束。
  // 本趟行程 10/24–10/31：10/24 為 CEST(UTC+2)，10/25 起為 CET(UTC+1)。
  // 只服務這段日期，不引入時區函式庫。
  var DST_END_MMDD = '10/25';

  function warsawOffsetHours(mmdd) {
    var parts = String(mmdd || '').split('/');
    var m = Number(parts[0]), d = Number(parts[1]);
    if (!isFinite(m) || !isFinite(d)) return 1;
    var endParts = DST_END_MMDD.split('/');
    var em = Number(endParts[0]), ed = Number(endParts[1]);
    if (m < em || (m === em && d < ed)) return 2;
    return 1;
  }

  function trainDepartureMs(train, year) {
    if (!train || !train.date || !train.dep) return NaN;
    var dparts = String(train.date).split('/');
    var tparts = String(train.dep).split(':');
    var m = Number(dparts[0]), d = Number(dparts[1]);
    var hh = Number(tparts[0]), mm = Number(tparts[1]);
    if (![m, d, hh, mm].every(isFinite)) return NaN;
    return Date.UTC(year, m - 1, d, hh - warsawOffsetHours(train.date), mm);
  }

  function nextTrain(trains, nowMs, year) {
    var list = trains || [];
    for (var i = 0; i < list.length; i += 1) {
      var ms = trainDepartureMs(list[i], year);
      if (!isFinite(ms) || ms < nowMs) continue;
      return { index: i, train: list[i], minutesUntil: Math.round((ms - nowMs) / 60000) };
    }
    return null;
  }

  function formatCountdown(minutes) {
    var mins = Number(minutes);
    if (!isFinite(mins) || mins <= 0) return '即將出發';
    if (mins < 60) return '還有 ' + mins + ' 分';
    if (mins < 60 * 24) {
      var h = Math.floor(mins / 60);
      var rest = mins % 60;
      return rest ? '還有 ' + h + ' 小時 ' + rest + ' 分' : '還有 ' + h + ' 小時';
    }
    return Math.floor(mins / (60 * 24)) + ' 天後';
  }
```

加入 export 物件。

- [ ] **Step 4：驗收**

Run: `./verify.sh`
Expected: 全綠。

- [ ] **Step 5：Commit**

```bash
git add redesign/pwa-core.js tests/next-train.test.mjs
git commit -m "feat(pwa-core): 下一班長途車倒數（含 10/25 夏令時間換算）

2026 年夏令時間在旅途第二天 10/25 結束，那天早上還有 09:00 華沙→克拉科夫
的車。不處理這件事會整整算錯一小時。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 6：拍照清單資料結構與舊資料遷移

**Files:**
- Modify: `redesign/data.js`（新增 `photoSpots`、`cities[].photo`、`photoCredits`）
- Modify: `redesign/pwa-core.js`（新增遷移函式）
- Create: `tests/photo-spots.test.mjs`

**Interfaces:**
- Consumes: 既有 `polska.photomap.v1`（形狀為 `{ '華沙': true }`，城市中文名為 key）
- Produces:
  - `window.TRIP.photoSpots` → `Array<{ id, cityKey, name, day, bestTime, light }>`
  - `window.TRIP.cities[].photo` → `{ hero, thumb }`（`assets/photos/*.webp` 相對路徑）
  - `window.TRIP.photoCredits` → `Array<{ file, city, author, license, url }>`
  - `migratePhotoCheckins(old, spots)` → `{ next, migrated: boolean }`：舊的城市級打卡對應到該城第一個景點
  - `PHOTOMAP_BACKUP_KEY = 'polska.photomap.v0.backup'`

- [ ] **Step 1：寫失敗測試**

建 `tests/photo-spots.test.mjs`：

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const coreCtx = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), coreCtx);
const core = coreCtx.globalThis.PolskaPwaCore;

const dataCtx = { window: {} };
vm.runInNewContext(fs.readFileSync('redesign/data.js', 'utf8'), dataCtx);
const TRIP = dataCtx.window.TRIP;

test('四座城市都有 hero 與 thumb 照片路徑', () => {
  assert.equal(TRIP.cities.length, 4);
  for (const c of TRIP.cities) {
    assert.match(c.photo.hero, /^assets\/photos\/[a-z]+-hero\.webp$/);
    assert.match(c.photo.thumb, /^assets\/photos\/[a-z]+-thumb\.webp$/);
  }
});

test('每張照片都有可顯示的授權出處', () => {
  assert.equal(TRIP.photoCredits.length, 8);
  for (const c of TRIP.photoCredits) {
    assert.ok(c.author && c.author.length > 0);
    assert.match(c.license, /^CC BY(-SA)? \d\.\d$/);
    assert.match(c.url, /^https:\/\/commons\.wikimedia\.org\//);
  }
});

test('拍照清單是景點層級且每個景點都有光線建議', () => {
  assert.ok(TRIP.photoSpots.length >= 8);
  const cityKeys = new Set(TRIP.cities.map((c) => c.key));
  for (const s of TRIP.photoSpots) {
    assert.ok(cityKeys.has(s.cityKey), `未知城市 ${s.cityKey}`);
    assert.ok(s.id && s.name && s.bestTime && s.light);
    assert.ok(s.day >= 1 && s.day <= 8);
  }
  assert.equal(new Set(TRIP.photoSpots.map((s) => s.id)).size, TRIP.photoSpots.length);
});

test('舊的城市級打卡遷移到該城第一個景點，且不丟資料', () => {
  const spots = [
    { id: 'waw-oldtown', cityKey: 'WAW' },
    { id: 'waw-castle', cityKey: 'WAW' },
    { id: 'krk-rynek', cityKey: 'KRK' },
  ];
  const r = core.migratePhotoCheckins({ 華沙: true, 克拉科夫: false }, spots);
  assert.equal(r.migrated, true);
  assert.equal(r.next['waw-oldtown'], true);
  assert.equal(r.next['krk-rynek'], undefined);
  assert.equal(core.PHOTOMAP_BACKUP_KEY, 'polska.photomap.v0.backup');
});

test('已是新格式的資料不會被重複遷移', () => {
  const spots = [{ id: 'waw-oldtown', cityKey: 'WAW' }];
  const r = core.migratePhotoCheckins({ 'waw-oldtown': true }, spots);
  assert.equal(r.migrated, false);
  assert.equal(r.next['waw-oldtown'], true);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/photo-spots.test.mjs`
Expected: FAIL — `TRIP.cities[0].photo` 是 undefined。

- [ ] **Step 3：`data.js` 加照片與景點資料**

`cities`（252-257）每筆補 `photo`，例如華沙那筆結尾加：

```js
photo:{hero:'assets/photos/warszawa-hero.webp',thumb:'assets/photos/warszawa-thumb.webp'}
```

（`KRK` → `krakow-*`、`WRO` → `wroclaw-*`、`POZ` → `poznan-*`。）

`cities` 之後新增（`bestTime`／`light` 內容依 10 月底波蘭日落約 16:30–16:45 撰寫）：

```js
  photoSpots: [
    {id:'waw-oldtown', cityKey:'WAW', name:'老城市集廣場', day:1, bestTime:'16:00–16:40', light:'日落前側光打在彩色立面，廣場人少'},
    {id:'waw-castle', cityKey:'WAW', name:'皇家城堡與美人魚', day:1, bestTime:'15:30–16:10', light:'順光；城堡紅牆在低角度陽光下最飽和'},
    {id:'waw-culture', cityKey:'WAW', name:'科學文化宮 30F 城景', day:7, bestTime:'16:10–17:00', light:'日落後藍調 20 分鐘，城市燈與天空同亮度'},
    {id:'krk-rynek', cityKey:'KRK', name:'中央市集廣場與聖瑪利亞聖殿', day:2, bestTime:'16:00–16:45', light:'塔樓逆光，改拍東側迴廊反射光'},
    {id:'krk-wawel', cityKey:'KRK', name:'Wawel 城堡河岸', day:2, bestTime:'15:40–16:30', light:'從 Dębnicki 橋往東拍，維斯瓦河面反光'},
    {id:'krk-kazimierz', cityKey:'KRK', name:'Kazimierz 猶太區街景', day:4, bestTime:'10:00–12:00', light:'上午柔和散射光，適合窄巷與塗鴉'},
    {id:'wro-rynek', cityKey:'WRO', name:'市政廳與彩色老屋', day:5, bestTime:'15:50–16:35', light:'西曬正打彩色立面，是全趟最上色的一刻'},
    {id:'wro-dwarfs', cityKey:'WRO', name:'小矮人與座堂島煤氣燈', day:5, bestTime:'16:45–17:15', light:'點燈人 16:45 起逐盞點燈，需高感光度'},
    {id:'poz-rynek', cityKey:'POZ', name:'舊市集廣場彩色立面', day:6, bestTime:'11:30–12:15', light:'12:00 山羊報時前卡位，正午光平但人潮是主角'},
    {id:'poz-tumski', cityKey:'POZ', name:'教堂島 Ostrów Tumski', day:6, bestTime:'15:40–16:20', light:'雙塔逆光剪影，或轉到橋上拍側光'},
  ],
  photoCredits: [
    // 八列，內容逐字取自 assets/photos/CREDITS.md（Task 7 會把該檔放進 repo）
  ],
```

`photoCredits` 八列的 `file`／`city`／`author`／`license`／`url` 一律**逐字**抄 `assets/photos/CREDITS.md`，不可自行改寫作者名或授權版本。

- [ ] **Step 4：`pwa-core.js` 加遷移函式**

```js
  var PHOTOMAP_BACKUP_KEY = 'polska.photomap.v0.backup';

  function migratePhotoCheckins(old, spots) {
    var src = old && typeof old === 'object' && !Array.isArray(old) ? old : {};
    var list = spots || [];
    var ids = {};
    list.forEach(function (s) { if (s && s.id) ids[s.id] = true; });

    var keys = Object.keys(src);
    var looksOld = keys.some(function (k) { return !ids[k]; });
    if (!keys.length || !looksOld) return { next: src, migrated: false };

    var firstOfCity = {};
    list.forEach(function (s) {
      if (s && s.cityKey && !firstOfCity[s.cityKey]) firstOfCity[s.cityKey] = s.id;
    });

    var next = {};
    keys.forEach(function (k) {
      if (ids[k]) { next[k] = !!src[k]; return; }
      if (!src[k]) return;
      for (var ck in firstOfCity) {
        if (!Object.prototype.hasOwnProperty.call(firstOfCity, ck)) continue;
        var city = null;
        for (var i = 0; i < list.length; i += 1) {
          if (list[i].cityKey === ck) { city = list[i]; break; }
        }
        if (city && cityNameMatches(k, ck)) { next[firstOfCity[ck]] = true; return; }
      }
    });
    return { next: next, migrated: true };
  }

  // 舊 key 是中文城市名（例 '華沙'），對應到城市代碼。
  function cityNameMatches(name, cityKey) {
    var map = { 華沙: 'WAW', 克拉科夫: 'KRK', 樂斯拉夫: 'WRO', 波茲南: 'POZ' };
    return map[name] === cityKey;
  }
```

加入 export 物件：`PHOTOMAP_BACKUP_KEY`、`migratePhotoCheckins`。

- [ ] **Step 5：驗收並 Commit**

Run: `./verify.sh`
Expected: 全綠（`node --check redesign/data.js` 也會檢查語法）。

```bash
git add redesign/data.js redesign/pwa-core.js tests/photo-spots.test.mjs
git commit -m "feat(data): 景點級拍照清單、城市照片路徑與授權表，含舊打卡遷移

polska.photomap.v1 由城市名 key 改為景點 id key，遷移時把已打卡城市對應到
該城第一個景點，並在 Task 7 之後寫入 polska.photomap.v0.backup 備份。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 7：照片入庫、離線快取與發布白名單

**Files:**
- Create: `assets/photos/*.webp`（8 檔）、`assets/photos/CREDITS.md`
- Modify: `sw.js:3`（版本）、`sw.js:6-24`（precache）
- Modify: `index.html`（9 處 `?v=`：66、67、68、85、86、87、88、89、116）、`mobile.html`（6 處：16、17、34、35、36、50）
- Modify: `prepare-site.sh:417`（`mkdir -p`）與 `cp` 區塊
- Test: `tests/sw-contract.test.mjs`、`tests/deploy-contract.test.mjs`

**Interfaces:**
- Consumes: Task 6 的 `cities[].photo` 路徑
- Produces: 8 張照片線上與離線都可取得；`CACHE_VERSION = 'polska-v18'`

- [ ] **Step 1：寫失敗測試**

`tests/sw-contract.test.mjs` 加：

```js
test('八張城市照片都進了 precache 且版本已升 v18', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  assert.match(sw, /CACHE_VERSION = 'polska-v18'/);
  for (const city of ['warszawa', 'krakow', 'wroclaw', 'poznan']) {
    assert.match(sw, new RegExp(`\\./assets/photos/${city}-hero\\.webp`));
    assert.match(sw, new RegExp(`\\./assets/photos/${city}-thumb\\.webp`));
  }
  assert.doesNotMatch(sw, /polska-v17/);
});
```

`tests/deploy-contract.test.mjs` 加：

```js
test('照片目錄有進發布白名單，否則線上 404', () => {
  const prep = fs.readFileSync('prepare-site.sh', 'utf8');
  assert.match(prep, /mkdir -p[^\n]*assets\/photos/);
  assert.match(prep, /cp assets\/photos\/\*\.webp "\$output\/assets\/photos\/"/);
});

test('data.js 引用的照片檔案實際存在', () => {
  const data = fs.readFileSync('redesign/data.js', 'utf8');
  const refs = [...data.matchAll(/assets\/photos\/[a-z-]+\.webp/g)].map((m) => m[0]);
  assert.equal(refs.length, 8);
  for (const r of refs) assert.ok(fs.existsSync(r), `缺檔案 ${r}`);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/sw-contract.test.mjs tests/deploy-contract.test.mjs`
Expected: FAIL — 版本仍為 v17、`assets/photos` 不存在。

- [ ] **Step 3：把照片與授權檔放進 repo**

```bash
mkdir -p assets/photos
cp /private/tmp/claude-501/-Users-xieh/f651e88f-1f75-4af2-89af-03435f37ebc7/scratchpad/photos/*.webp assets/photos/
cp /private/tmp/claude-501/-Users-xieh/f651e88f-1f75-4af2-89af-03435f37ebc7/scratchpad/photos/CREDITS.md assets/photos/
ls -l assets/photos/
```

確認 8 個 `.webp` 加 `CREDITS.md` 共 9 個檔案，總計約 255KB。

- [ ] **Step 4：改 `sw.js`**

`sw.js:3` → `const CACHE_VERSION = 'polska-v18';`
`PRECACHE_URLS` 內所有 `?v=polska-v17` 改 `?v=polska-v18`，並在清單末尾加 8 行：

```js
  './assets/photos/warszawa-hero.webp',
  './assets/photos/warszawa-thumb.webp',
  './assets/photos/krakow-hero.webp',
  './assets/photos/krakow-thumb.webp',
  './assets/photos/wroclaw-hero.webp',
  './assets/photos/wroclaw-thumb.webp',
  './assets/photos/poznan-hero.webp',
  './assets/photos/poznan-thumb.webp',
```

- [ ] **Step 5：同步 15 處版本字串**

```bash
sed -i '' 's/v=polska-v17/v=polska-v18/g' index.html mobile.html
grep -c 'polska-v18' index.html mobile.html   # 期待 9 與 6
grep -rn 'polska-v17' index.html mobile.html sw.js   # 期待無輸出
```

- [ ] **Step 6：改 `prepare-site.sh`**

`mkdir -p` 那行末尾加 `"$output/assets/photos"`，並在 `cp desktop/...` 之後加一行：

```bash
cp assets/photos/*.webp "$output/assets/photos/"
```

- [ ] **Step 7：實跑發布腳本驗證**

```bash
rm -rf /tmp/site-check && mkdir -p /tmp/site-check
./prepare-site.sh /tmp/site-check
ls /tmp/site-check/assets/photos/ | wc -l    # 期待 8
```

- [ ] **Step 8：驗收並 Commit**

Run: `./verify.sh`

```bash
git add assets/photos sw.js index.html mobile.html prepare-site.sh tests/sw-contract.test.mjs tests/deploy-contract.test.mjs
git commit -m "feat(assets): 四城照片入庫，SW 升 v18、precache 與發布白名單同步

照片授權：三張 CC BY-SA、一張 CC BY，出處記於 assets/photos/CREDITS.md，
並將於 Task 13 在 App 內顯示（CC 授權要求出處隨作品呈現）。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 8：方案 A 設計 token（手機作用域，不動桌機）

**Files:**
- Modify: `redesign/B-companion.css`（在檔頭之後新增 token 區段）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: 無
- Produces: `--A-*` 變數與 `.B-card-a`／`.B-pill-a`／`.B-quad`／`.B-num` 四個基礎樣式，Task 9–13 全部沿用。

- [ ] **Step 1：寫失敗測試**

```js
test('方案 A token 存在且不污染桌機 tokens.css', () => {
  assert.match(css, /--A-ground:\s*#F7F4EF/);
  assert.match(css, /--A-ink:\s*#1B1917/);
  assert.match(css, /--A-signal:\s*#B5502E/);
  assert.match(css, /--A-espresso:\s*#33261E/);
  assert.match(css, /font-variant-numeric:\s*lining-nums tabular-nums/);
  const tokens = fs.readFileSync('redesign/tokens.css', 'utf8');
  assert.doesNotMatch(tokens, /--A-/);
  assert.match(tokens, /--paper:\s*#f4ecd8/);  // 桌機色票未被動過
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL — `--A-ground` 不存在。

- [ ] **Step 3：實作 token 與基礎元件**

加在 `redesign/B-companion.css` 檔頭註解之後：

```css
/* ==== 方案 A：暖白紙卡・照片主導（僅手機殼作用域，桌機請用 tokens.css）==== */
.B-companion {
  --A-ground: #F7F4EF;
  --A-board: #FFFFFF;
  --A-ink: #1B1917;
  --A-ink-2: #7C736B;
  --A-ink-3: #8A8078;
  --A-line: #F1EDE6;
  --A-espresso: #33261E;
  --A-brass: #C9A46F;
  --A-signal: #B5502E;
  --A-done: #2F6B4F;
  --A-tag-move-bg: #E8EFF8;
  --A-tag-move-fg: #3F6491;
  --A-tag-book-bg: #FDEDE3;
  --A-tag-book-fg: #C2653A;
  --A-display: "Hoefler Text", "Iowan Old Style", Palatino, serif;
  --A-body: -apple-system, BlinkMacSystemFont, "PingFang TC", "Noto Sans TC", sans-serif;
  --A-mono: "SF Mono", ui-monospace, Menlo, monospace;
  --A-radius: 18px;
  --A-shadow: 0 1px 2px rgba(27, 25, 23, .05), 0 10px 22px -14px rgba(27, 25, 23, .28);
  background: var(--A-ground);
  color: var(--A-ink);
  font-family: var(--A-body);
}

.B-card-a {
  background: var(--A-board);
  border-radius: var(--A-radius);
  box-shadow: var(--A-shadow);
  padding: 16px;
}

/* Hoefler Text 預設是舊式數字，會把 Day 1 排成 Day I。全站數字強制 lining。 */
.B-num {
  font-family: var(--A-display);
  font-variant-numeric: lining-nums tabular-nums;
}

.B-pill-a {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 10px 16px;
  border: 1px solid var(--A-line);
  border-radius: 999px;
  background: var(--A-board);
  color: var(--A-ink-2);
  font-size: 13px;
}
.B-pill-a.is-active {
  background: var(--A-ink);
  border-color: var(--A-ink);
  color: #fff;
  font-weight: 600;
}

.B-quad {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
}
.B-quad > div { text-align: center; padding: 4px 2px; }
.B-quad b {
  display: block;
  font-family: var(--A-display);
  font-variant-numeric: lining-nums tabular-nums;
  font-size: 19px;
  line-height: 1.1;
}
.B-quad span { font-size: 10.5px; color: var(--A-ink-3); letter-spacing: .04em; }

.B-scroll-x {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
```

- [ ] **Step 4：驗收**

Run: `./verify.sh`（CSS 改動不影響 bundle，但仍要跑完整驗收）
Expected: 全綠。

- [ ] **Step 5：Commit**

```bash
git add redesign/B-companion.css tests/ui-contract.test.mjs
git commit -m "style(mobile): 方案 A 暖白紙卡 token 與基礎元件

作用域限定 .B-companion，不動桌機共用的 tokens.css（--paper/--crimson）。
數字一律 lining-nums，避免 Hoefler Text 舊式數字把 Day 1 排成 Day I。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 9：底部四分頁改為 首頁／行程／交通／記帳

**Files:**
- Modify: `redesign/B-companion.jsx:179-208`（`B_PrimaryNav`）、`:266-282`（`B_TOOLS`／`SUBPAGE_TITLES`）、`:298-340`（`B_ToolGrid` 改為「⋯」選單）、`:752`（`activeTab`）、`:1532-1546`（渲染）、記帳區塊掛載
- Modify: `redesign/B-companion.css:912-951`（分頁與工具方格區段）
- Test: `tests/ui-contract.test.mjs`、`tests/entrypoints.test.mjs`

**Interfaces:**
- Consumes: Task 3 的子頁焦點契約、Task 8 的 token
- Produces: 分頁 id 為 `home`／`trip`／`move`／`money`（**第四格用 `money`，不用 `expense`，避免與子頁 id `expense` 混淆**）。工具選單狀態 `toolsOpen`。五個子頁 id 不變：`photomap`／`fx`／`packing`／`sos`／`info`。

- [ ] **Step 1：寫失敗測試**

```js
test('底部四分頁為 首頁/行程/交通/記帳，記帳在第一層', () => {
  assert.match(jsx, /\['home', ?'首頁'\]/);
  assert.match(jsx, /\['trip', ?'行程'\]/);
  assert.match(jsx, /\['move', ?'交通'\]/);
  assert.match(jsx, /\['money', ?'記帳'\]/);
  assert.doesNotMatch(jsx, /\['more', ?'更多'\]/);
  assert.match(jsx, /data-tabsection="money"/);
});

test('五個工具改由首頁右上選單進入，記帳不在選單內', () => {
  assert.match(jsx, /toolsOpen/);
  assert.match(jsx, /aria-label="更多工具"/);
  for (const label of ['拍照清單', '匯率換算', '打包清單', 'SOS 緊急卡', '實用資訊']) {
    assert.match(jsx, new RegExp(label));
  }
  assert.doesNotMatch(jsx, /\['expense', ?'旅行記帳'\]/);
  assert.match(css, /\.B-tools-menu/);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL。

- [ ] **Step 3：改分頁定義**

`B_PrimaryNav`（179-182）的分頁表換成：

```js
  const tabs = [['home', '首頁'], ['trip', '行程'], ['move', '交通'], ['money', '記帳']];
```

`B_TOOLS`（266-273）移除 `expense` 一列，並把 `photomap` 標籤改名：

```js
const B_TOOLS = [
  ['photomap', '拍照清單', 'PHOTO'],
  ['fx', '匯率換算', 'FX RATE'],
  ['packing', '打包清單', 'PACKING'],
  ['sos', 'SOS 緊急卡', 'EMERGENCY'],
  ['info', '實用資訊', 'INFO'],
];
```

`SUBPAGE_TITLES`（275-282）同步：移除 `expense`，`photomap` 改為 `'拍照清單'`。

- [ ] **Step 4：把記帳掛成第四個分頁區塊**

在 `B_Companion` 的 `main` 內，交通區塊之後加：

```jsx
        <section data-tabsection="money">
          <B_Expense storage={storage} />
        </section>
```

並從子頁渲染（1596）移除 `{subpage === 'expense' && <B_Expense storage={storage} />}`。

- [ ] **Step 5：首頁右上「⋯」工具選單**

`B_Companion` 加 state 與還原焦點 ref：

```js
  const [toolsOpen, setToolsOpen] = B_useState(false);
  const toolsBtnRef = B_useRef(null);
```

首頁區塊抬頭右側加按鈕：

```jsx
          <button
            type="button"
            className="B-tools-btn"
            aria-label="更多工具"
            aria-expanded={toolsOpen}
            ref={toolsBtnRef}
            onClick={() => setToolsOpen(true)}
          >⋯</button>
```

`B_ToolGrid` 改寫為選單（原 298-340 整段替換）：

```jsx
function B_ToolGrid({ onOpen, onClose }) {
  return (
    <div className="B-tools-menu" role="dialog" aria-modal="true" aria-label="更多工具">
      <div className="B-tools-menu-panel">
        <div className="B-tools-menu-head">
          <h3>更多工具</h3>
          <button type="button" onClick={onClose} aria-label="關閉">×</button>
        </div>
        <ul>
          {B_TOOLS.map(([key, label, kicker]) => (
            <li key={key}>
              <button type="button" onClick={(ev) => onOpen(key, ev)}>
                <span className="B-tools-menu-label">{label}</span>
                <span className="B-tools-menu-kicker">{kicker}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

渲染（取代原 1532）：

```jsx
      {toolsOpen && (
        <B_ToolGrid
          onClose={() => { setToolsOpen(false); toolsBtnRef.current && toolsBtnRef.current.focus(); }}
          onOpen={(key, ev) => {
            subpageReturnFocusRef.current = (ev && ev.currentTarget) || toolsBtnRef.current;
            setToolsOpen(false);
            setSubpage(key);
          }}
        />
      )}
```

Escape 與 scroll lock effect（Task 3 改過的兩段）把 `toolsOpen` 一併納入條件與相依陣列。

- [ ] **Step 6：CSS**

`redesign/B-companion.css` 加：

```css
/* ---- 首頁右上工具選單 ---- */
.B-tools-btn {
  min-width: 44px;
  min-height: 44px;
  border: 0;
  background: transparent;
  color: var(--A-ink);
  font-size: 22px;
  line-height: 1;
}
.B-tools-menu {
  position: fixed;
  inset: 0;
  z-index: 130;
  display: flex;
  align-items: flex-end;
  background: rgba(27, 25, 23, .38);
}
.B-tools-menu-panel {
  width: 100%;
  background: var(--A-board);
  border-radius: 20px 20px 0 0;
  padding: 14px 16px calc(16px + var(--safe-bottom, 0px));
}
.B-tools-menu-head { display: flex; align-items: center; justify-content: space-between; }
.B-tools-menu-head h3 { margin: 0; font-size: 16.5px; }
.B-tools-menu-head button { min-width: 44px; min-height: 44px; border: 0; background: transparent; font-size: 20px; }
.B-tools-menu ul { list-style: none; margin: 8px 0 0; padding: 0; }
.B-tools-menu li + li { border-top: 1px solid var(--A-line); }
.B-tools-menu li button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 56px;
  padding: 0 4px;
  border: 0;
  background: transparent;
  text-align: left;
}
.B-tools-menu-label { font-size: 15px; color: var(--A-ink); }
.B-tools-menu-kicker { font-family: var(--A-mono); font-size: 10.5px; letter-spacing: .1em; color: var(--A-ink-3); }
```

分頁區段（CSS 912 起）把 `main[data-tab="more"]` 的規則改為 `main[data-tab="money"]`。

- [ ] **Step 7：Build、驗收、Commit**

```bash
./build.sh && ./verify.sh
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 底部四分頁改為 首頁/行程/交通/記帳，五工具收進首頁選單

記帳旅途中每天用好幾次，提到第一層；交通因為跨四城五段長途火車必須留在
第一層。「更多」這個名稱使用者不會記得裡面有什麼，改為首頁右上「⋯」選單。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 10：首頁改版（照片 hero、統計四宮格、下一段交通倒數）

**Files:**
- Modify: `redesign/B-companion.jsx:210-239`（`B_Hero`）、首頁區塊（1057 附近）
- Modify: `redesign/B-companion.css:108-338`（hero 與 dashboard 區段）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: `cities[].photo`（Task 6）、`nextTrain`／`formatCountdown`（Task 5）、Task 8 token
- Produces: 首頁六個區塊順序固定：hero → 統計四宮格 → 今日重點 → 今日硬限制 → 下一段交通 → （右上工具選單）

- [ ] **Step 1：寫失敗測試**

```js
test('首頁 hero 用真實城市照，且四宮格與倒數就位', () => {
  assert.match(jsx, /photo\.hero/);
  assert.match(jsx, /loading="lazy"/);
  assert.match(jsx, /alt=\{/);
  assert.match(jsx, /core\.nextTrain\(/);
  assert.match(jsx, /core\.formatCountdown\(/);
  assert.match(css, /\.B-hero-photo/);
  assert.match(css, /linear-gradient\([^)]*rgba\(27, 25, 23/);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL。

- [ ] **Step 3：`B_Hero` 改用照片**

把 `B_Hero`（210-239）的漸層佔位換成 `<img>` ＋壓字層。保留既有的輪播 index state 與 `prefers-reduced-motion` 判斷（現行行為正確，不要改動判斷邏輯），只換視覺層：

```jsx
      <div className="B-hero-photo">
        <img src={city.photo.hero} alt={`${city.name} ${city.pl}`} loading="lazy" width="1200" height="800" />
        <div className="B-hero-veil" />
        <div className="B-hero-text">
          <p className="B-hero-kicker B-num">DAY {day.n} · {day.date}</p>
          <h2 className="B-num">{city.name}</h2>
          <p className="B-hero-sub">{city.pl} · {day.tag}</p>
        </div>
      </div>
```

- [ ] **Step 4：統計四宮格與下一段交通**

首頁區塊內，hero 之後加：

```jsx
        <div className="B-card-a B-quad">
          <div><b>{moment.momentDay}/8</b><span>今天</span></div>
          <div><b>{day.weather.split('/')[0].trim()}</b><span>白天</span></div>
          <div><b>{budget.spentTWD.toLocaleString('zh-TW')}</b><span>已花 NT$</span></div>
          <div><b>{Math.round(budget.ratio * 100)}%</b><span>預算</span></div>
        </div>
```

下一段交通卡（`nt` 為 `core.nextTrain(t.trains, Date.now(), 2026)`）：

```jsx
        {nt && (
          <div className="B-card-a B-nextmove">
            <p className="B-kicker-a">下一段長途車</p>
            <p className="B-nextmove-seg B-num">{nt.train.seg}</p>
            <p className="B-nextmove-time B-num">{nt.train.date} {nt.train.dep} → {nt.train.arr}</p>
            <p className="B-nextmove-count">{core.formatCountdown(nt.minutesUntil)} · {nt.train.type} · PLN {nt.train.price}</p>
          </div>
        )}
        {!nt && <div className="B-card-a"><p className="B-nextmove-count">今天沒有長途車</p></div>}
```

- [ ] **Step 5：CSS**

```css
/* ---- 方案 A 照片 hero ---- */
.B-hero-photo { position: relative; height: 230px; overflow: hidden; border-radius: 0 0 20px 20px; }
.B-hero-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.B-hero-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(27, 25, 23, 0) 38%, rgba(27, 25, 23, .74) 100%);
}
.B-hero-text { position: absolute; left: 18px; right: 18px; bottom: 16px; color: #fff; }
.B-hero-kicker { margin: 0 0 4px; font-size: 11px; letter-spacing: .12em; opacity: .9; }
.B-hero-photo h2 { margin: 0; font-size: 31px; line-height: 1.05; letter-spacing: -.01em; }
.B-hero-sub { margin: 3px 0 0; font-size: 12.5px; opacity: .88; }
.B-kicker-a { margin: 0 0 6px; font-family: var(--A-mono); font-size: 10.5px; letter-spacing: .1em; color: var(--A-ink-3); }
.B-nextmove-seg { margin: 0; font-size: 26px; }
.B-nextmove-time { margin: 2px 0 0; font-size: 13px; color: var(--A-ink-2); }
.B-nextmove-count { margin: 6px 0 0; font-size: 12.5px; color: var(--A-signal); }
```

- [ ] **Step 6：Build、驗收、Commit**

```bash
./build.sh && ./verify.sh
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 首頁改為照片 hero + 統計四宮格 + 下一段交通倒數

取代原本的漸層色塊 hero 與「標籤＋方框」堆疊，讓使用者三秒內知道今天在
哪座城、下一班車幾點、錢花到哪。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 11：記帳分頁改版與退稅提示接線

**Files:**
- Modify: `redesign/B-companion.jsx:343-499`（`B_Expense`）
- Modify: `redesign/B-companion.css:952-1009`（記帳區段）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: `taxRefundStatus`／`taxRefundEstimate`／`taxRefundSummary`（Task 4）、Task 8 token、Task 2 的 `formError`／`persistOk`
- Produces: 記帳頁結構固定：深咖啡主卡 → 分類四宮格 → Day／可退稅篩選 → 明細列 → 浮動「＋ 記一筆」

- [ ] **Step 1：寫失敗測試**

```js
test('記帳頁接上退稅提示與可退稅篩選', () => {
  assert.match(jsx, /core\.taxRefundStatus\(/);
  assert.match(jsx, /core\.taxRefundSummary\(/);
  assert.match(jsx, /同一張收據/);
  assert.match(jsx, /可退稅/);
  assert.match(css, /\.B-expense-hero/);
  assert.match(css, /--A-espresso/);
});

test('記帳金額格式統一兩位小數且台幣加千分位', () => {
  assert.match(jsx, /toFixed\(2\)/);
  assert.match(jsx, /toLocaleString\('zh-TW'\)/);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL。

- [ ] **Step 3：深咖啡主卡與分類四宮格**

`B_Expense` 的 return 開頭（原 391 附近）換成：

```jsx
    <div className="B-expense">
      {!persistOk && <p className="B-store-warn">目前無法儲存，本次紀錄僅暫存</p>}
      <div className="B-expense-hero">
        <p className="B-expense-hero-kicker">總花費</p>
        <p className="B-expense-hero-amt B-num">{totals.totalPLN.toFixed(2)} <small>PLN</small></p>
        <p className="B-expense-hero-twd B-num">≈ NT${budget.spentTWD.toLocaleString('zh-TW')}</p>
        <div className="B-expense-bar"><i style={{ width: Math.min(100, budget.ratio * 100) + '%' }} /></div>
        <p className="B-expense-hero-budget B-num">
          已花 NT${budget.spentTWD.toLocaleString('zh-TW')} / 預算 NT${budget.budgetTWD.toLocaleString('zh-TW')}
        </p>
      </div>
      <div className="B-card-a B-quad">
        {core.EXPENSE_CATEGORIES.map((c) => (
          <div key={c.key}>
            <b>{Math.round(totals.byCategory[c.key])}</b>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
```

- [ ] **Step 4：退稅提示與篩選**

新增 state 與衍生值：

```js
  const [onlyRefund, setOnlyRefund] = B_useState(false);
  const refund = core.taxRefundSummary(expenses, rate);
  const visible = onlyRefund
    ? expenses.filter((e) => core.taxRefundStatus(e.amountPLN, e.category).state === 'eligible')
    : dayFiltered;
```

`submitForm` 成功後（`setFormOpen(false)` 之前）算一次提示：

```js
    const rs = core.taxRefundStatus(entry.amountPLN, entry.category);
    if (rs.state === 'eligible') {
      const est = core.taxRefundEstimate(entry.amountPLN, rate);
      setHint(`這筆可辦退稅 · 預估可退 NT$${est.lowTWD.toLocaleString('zh-TW')}–${est.highTWD.toLocaleString('zh-TW')}（同一張收據才算）`);
    } else if (rs.state === 'near') {
      setHint(`距離退稅門檻還差 ${rs.shortfallPLN} PLN（同一張收據才算，不同店家不能合併）`);
    } else {
      setHint('');
    }
```

明細列加標籤與退稅彙總列：

```jsx
      {refund.count > 0 && (
        <button type="button" className={'B-pill-a' + (onlyRefund ? ' is-active' : '')} onClick={() => setOnlyRefund(!onlyRefund)}>
          可退稅 {refund.count} 筆 · 預估 NT${refund.lowTWD.toLocaleString('zh-TW')}–{refund.highTWD.toLocaleString('zh-TW')}
        </button>
      )}
```

每一列在品項後面：

```jsx
            {core.taxRefundStatus(e.amountPLN, e.category).state === 'eligible' && <em className="B-tag-refund">可退稅</em>}
```

明細金額統一格式：`{Number(e.amountPLN).toFixed(2)} PLN` 與 `≈NT${core.plnToTwd(e.amountPLN, rate).toLocaleString('zh-TW')}`。

- [ ] **Step 5：CSS**

```css
/* ---- 方案 A 記帳 ---- */
.B-expense-hero {
  background: var(--A-espresso);
  color: #F6EFE6;
  border-radius: var(--A-radius);
  padding: 18px;
  margin-bottom: 12px;
}
.B-expense-hero-kicker { margin: 0; font-family: var(--A-mono); font-size: 10.5px; letter-spacing: .1em; opacity: .72; }
.B-expense-hero-amt {
  margin: 4px 0 0;
  font-family: var(--A-display);
  font-variant-numeric: lining-nums tabular-nums;
  font-size: 34px;
  line-height: 1;
  color: var(--A-brass);
}
.B-expense-hero-amt small { font-size: 14px; letter-spacing: .06em; }
.B-expense-hero-twd { margin: 4px 0 0; font-size: 13px; opacity: .85; }
.B-expense-bar { height: 4px; border-radius: 999px; background: rgba(246, 239, 230, .22); margin: 12px 0 6px; }
.B-expense-bar i { display: block; height: 100%; border-radius: 999px; background: var(--A-brass); }
.B-expense-hero-budget { margin: 0; font-size: 11.5px; opacity: .78; }
.B-tag-refund {
  margin-left: 6px;
  padding: 2px 7px;
  border-radius: 999px;
  background: var(--A-tag-book-bg);
  color: var(--A-tag-book-fg);
  font-size: 10.5px;
  font-style: normal;
}
```

- [ ] **Step 6：Build、驗收、Commit**

```bash
./build.sh && ./verify.sh
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 記帳頁深咖啡主卡、分類四宮格與退稅門檻提示

取代原本四張全紅字分類卡（含三張 NT\$0）；紅色回歸訊號用途。退稅提示逐筆
判斷 200 PLN 門檻，文案明寫「同一張收據才算」避免誤解為可跨店累加。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 12：行程與交通分頁改版（縮圖列表 ＋ 抽屜）

**Files:**
- Modify: `redesign/B-companion.jsx` 行程區塊（1165 附近）與交通區塊（1183 附近）、drawer（809 區段對應 JSX）
- Modify: `redesign/B-companion.css:358-554`（scrub strip 與 timeline）、`:747-850`（train mini 與 drawer）
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: Task 8 token、`cities[].photo.thumb`、`formatCountdown`
- Produces: `.B-tl-row` 列樣式，Task 13 拍照清單沿用

- [ ] **Step 1：寫失敗測試**

```js
test('行程頁為橫向 Day 藥丸 + 帶縮圖的時間軸列', () => {
  assert.match(jsx, /className="B-scroll-x"/);
  assert.match(css, /\.B-tl-row/);
  assert.match(css, /\.B-tl-thumb/);
  assert.doesNotMatch(css, /\.B-day-filter\s*\{[^}]*overflow-y:\s*auto/);
});

test('交通頁五段長途車都帶倒數', () => {
  assert.match(jsx, /data-tabsection="move"/);
  assert.match(jsx, /core\.formatCountdown\(/);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL。

- [ ] **Step 3：Day 藥丸改用 `.B-scroll-x` ＋ `.B-pill-a`**

把行程頁的 `.B-day-filter` 容器 class 換成 `B-day-filter B-scroll-x`，每顆藥丸用 `B-pill-a`，選中加 `is-active`。CSS 把 `.B-day-filter` 的 `overflow-y: auto` 改為 `hidden`（橫向 pill 列不該縱向捲）。

- [ ] **Step 4：時間軸列加縮圖**

每一列改為：

```jsx
              <li className="B-tl-row" key={i}>
                <span className="B-tl-time B-num">{s.t || '—'}</span>
                <img className="B-tl-thumb" src={city.photo.thumb} alt="" loading="lazy" width="200" height="150" />
                <span className="B-tl-body">
                  <b>{s.label}</b>
                  {s.sub && <em>{s.sub}</em>}
                </span>
                {s.cost && <span className="B-tl-cost B-num">{s.cost}</span>}
              </li>
```

（`alt=""` 是刻意的：縮圖是裝飾，旁邊已有文字標題，螢幕閱讀器不需重複讀。）

- [ ] **Step 5：CSS**

```css
/* ---- 方案 A 時間軸列 ---- */
.B-tl-row {
  display: grid;
  grid-template-columns: 46px 62px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid var(--A-line);
}
.B-tl-time { font-family: var(--A-mono); font-size: 12px; color: var(--A-ink-2); }
.B-tl-thumb { width: 62px; height: 52px; object-fit: cover; border-radius: 10px; display: block; }
.B-tl-body b { display: block; font-size: 14.5px; font-weight: 600; }
.B-tl-body em { display: block; font-size: 12px; font-style: normal; color: var(--A-ink-2); }
.B-tl-cost { font-family: var(--A-mono); font-size: 11.5px; color: var(--A-ink-3); }
```

- [ ] **Step 6：交通頁五段車加倒數**

交通區塊每段車尾巴加：

```jsx
                <span className="B-nextmove-count">{core.formatCountdown(core.trainDepartureMs(tr, 2026) > Date.now() ? Math.round((core.trainDepartureMs(tr, 2026) - Date.now()) / 60000) : 0)}</span>
```

- [ ] **Step 7：Build、驗收、Commit**

```bash
./build.sh && ./verify.sh
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 行程與交通改為帶縮圖的時間軸列，長途車顯示倒數

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 13：拍照清單改版、舊資料遷移與照片出處

**Files:**
- Modify: `redesign/B-companion.jsx:501-537`（`B_PhotoMap`）、`:699-744`（`B_Info` 加出處入口）
- Modify: `redesign/B-companion.css:1037-1055`
- Test: `tests/ui-contract.test.mjs`

**Interfaces:**
- Consumes: `TRIP.photoSpots`／`TRIP.photoCredits`（Task 6）、`migratePhotoCheckins`／`PHOTOMAP_BACKUP_KEY`（Task 6）、Task 2 的 `storeOk`
- Produces: `B_PhotoMap` 消費 `trip` prop（目前 1601 已經傳了但沒用，管道現成）

- [ ] **Step 1：寫失敗測試**

```js
test('拍照清單改為景點層級並在首次載入遷移舊打卡', () => {
  assert.match(jsx, /function B_PhotoMap\(\{ trip, storage \}\)/);
  assert.match(jsx, /core\.migratePhotoCheckins\(/);
  assert.match(jsx, /core\.PHOTOMAP_BACKUP_KEY/);
  assert.match(jsx, /bestTime/);
  assert.match(jsx, /light/);
});

test('App 內看得見照片授權出處（CC BY-SA 要求）', () => {
  assert.match(jsx, /照片出處/);
  assert.match(jsx, /photoCredits/);
  assert.match(jsx, /rel="noopener noreferrer"/);
  assert.match(css, /\.B-credits/);
});
```

- [ ] **Step 2：跑測試確認失敗**

Run: `node --test tests/ui-contract.test.mjs`
Expected: FAIL。

- [ ] **Step 3：`B_PhotoMap` 改景點層級並遷移**

```jsx
function B_PhotoMap({ trip, storage }) {
  const core = window.PolskaPwaCore;
  const spots = trip.photoSpots || [];
  const [storeOk, setStoreOk] = B_useState(true);
  const [checked, setChecked] = B_useState(() => {
    const raw = core.readJSON(storage, 'polska.photomap.v1', {});
    const r = core.migratePhotoCheckins(raw, spots);
    if (r.migrated) {
      core.writeJSON(storage, core.PHOTOMAP_BACKUP_KEY, raw);
      core.writeJSON(storage, 'polska.photomap.v1', r.next);
    }
    return r.next;
  });

  const toggle = (id) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    setStoreOk(core.writeJSON(storage, 'polska.photomap.v1', next));
  };

  const done = spots.filter((s) => checked[s.id]).length;
  const pct = spots.length ? Math.round((done / spots.length) * 100) : 0;

  return (
    <div className="B-photomap">
      {!storeOk && <p className="B-store-warn">目前無法儲存，這次的變更只在這個畫面有效</p>}
      <div className="B-card-a B-quad">
        <div><b>{spots.length}</b><span>全部</span></div>
        <div><b>{done}</b><span>已拍</span></div>
        <div><b>{spots.length - done}</b><span>未拍</span></div>
        <div><b>{pct}%</b><span>完成度</span></div>
      </div>
      <ul className="B-photo-list">
        {spots.map((s) => (
          <li className="B-tl-row" key={s.id}>
            <span className="B-tl-time B-num">Day {s.day}</span>
            <span className="B-tl-body">
              <b>{s.name}</b>
              <em>{s.bestTime} · {s.light}</em>
            </span>
            <button
              type="button"
              className={'B-pill-a' + (checked[s.id] ? ' is-active' : '')}
              aria-pressed={!!checked[s.id]}
              onClick={() => toggle(s.id)}
            >{checked[s.id] ? '已拍' : '待拍'}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

`B-companion.jsx:1601` 的 `trip={t}` 已經在傳，簽名改成 `{ trip, storage }` 即可接上。

- [ ] **Step 4：照片出處區塊**

`B_Info`（699-744）末尾加：

```jsx
      <section className="B-credits">
        <h4>照片出處</h4>
        <p>本站城市照片取自 Wikimedia Commons，依授權標示作者與授權條款。</p>
        <ul>
          {trip.photoCredits.map((c) => (
            <li key={c.file}>
              <b>{c.city}</b> — {c.author}（{c.license}）
              <a href={c.url} target="_blank" rel="noopener noreferrer">來源</a>
            </li>
          ))}
        </ul>
      </section>
```

- [ ] **Step 5：CSS**

```css
/* ---- 照片出處 ---- */
.B-credits { margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--A-line); }
.B-credits h4 { margin: 0 0 6px; font-size: 13px; }
.B-credits p { margin: 0 0 8px; font-size: 11.5px; color: var(--A-ink-2); }
.B-credits ul { list-style: none; margin: 0; padding: 0; }
.B-credits li { font-size: 11.5px; color: var(--A-ink-2); padding: 4px 0; }
.B-credits a { margin-left: 6px; color: var(--A-ink); }
```

- [ ] **Step 6：Build、驗收、Commit**

```bash
./build.sh && ./verify.sh
git add redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat(mobile): 拍照清單改景點層級（含光線建議）與 App 內照片出處

舊的城市級打卡會遷移到該城第一個景點，原始值備份到
polska.photomap.v0.backup。四張照片三張 CC BY-SA、一張 CC BY，授權要求
出處隨作品呈現，故在實用資訊頁加可見的照片出處區塊。

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Task 14：真實瀏覽器驗收與文件收尾

**Files:**
- Modify: `README.md:7`（四分頁名稱與工具選單描述）、`README.md:15`（SW 版本）
- Create: `docs/verification/`（新截圖）

**Interfaces:**
- Consumes: Task 1–13 全部
- Produces: 可交付狀態

- [ ] **Step 1：本機起站**

```bash
python3 -m http.server 8123 &
```

- [ ] **Step 2：390px 與 320px 各走一遍（headless Chrome）**

逐項檢查並記錄實際觀察，不接受「應該沒問題」：
1. 四分頁（首頁／行程／交通／記帳）切換，各頁零水平溢出。
2. 首頁四張城市照片都載入（非破圖），輪播四城，`prefers-reduced-motion` 下不自動輪替。
3. 「⋯」開選單 → 五個工具子頁各進出一次；Escape 可關子頁；關閉後焦點回到開啟者。
4. 記帳新增 220 PLN 購物 → 出現「可退稅」提示且文案含「同一張收據」；新增 199 PLN → 顯示「還差 1 PLN」；重整後兩筆都在。
5. 拍照清單勾兩項 → 重整仍在；`localStorage` 內 key 為景點 id。
6. 若 `localStorage` 預先塞入 `{"華沙":true}`，載入後應遷移為 `{"waw-oldtown":true}` 且 `polska.photomap.v0.backup` 存在。
7. console 零 error。
8. 離線（devtools offline）重開 `/mobile.html` 可用且照片仍顯示。

- [ ] **Step 3：更新 README**

`README.md:7` 的分頁名稱改為「首頁／行程／交通／記帳」，並說明五個工具在首頁右上「⋯」選單內。`README.md:15` 的 `polska-v17` 改為 `polska-v18`。

- [ ] **Step 4：派 fresh-context subagent 驗收**

不可自驗。派新 agent 用真實瀏覽器重跑 Step 2 全部 8 項，回報每項通過／不通過與證據。

- [ ] **Step 5：Commit**

```bash
git add README.md docs/verification
git commit -m "docs: README 同步四分頁與 SW v18，補改版驗收截圖

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

- [ ] **Step 6：回報使用者，等他決定是否合併與部署**

不要自行 merge 到 main 或 push。整理：改動檔案清單、`./verify.sh` 實際輸出末段、fresh-context 驗收結果、手機實測網址。

---

## Self-Review

**1. 規格覆蓋率**

| 規格節 | 對應 Task |
|---|---|
| §2 設計語言（色票／字／元件） | Task 8 |
| §3 資訊架構（結構①） | Task 9 |
| §4.1 首頁 | Task 10 |
| §4.2 行程 | Task 12 |
| §4.3 交通 | Task 12 |
| §4.4 記帳 | Task 11 |
| §5.1 退稅門檻提醒 | Task 4（邏輯）＋ Task 11（介面） |
| §5.2 下一班車倒數 | Task 5（邏輯）＋ Task 10、12（介面） |
| §5.3 拍照清單 | Task 6（資料與遷移）＋ Task 13（介面） |
| §6 M1–M4 | Task 1（M1）、Task 2（M2／M3）、Task 3（M4） |
| §6 低優先：README 版本 | Task 14 |
| §7 照片策略 | Task 7 ＋ Task 13（出處，規格外新增的法律要求） |
| §8 部署與離線契約 | Task 7 |
| §9 不做 | 全計畫未觸及桌機、未加可編輯行程／照片上傳／即時 API |
| §10 驗收條件 | Task 14 |

未覆蓋且刻意留下的規格低優先項：「實用資訊頁 1 PLN ≈ 8 TWD 靜態文字改讀即時匯率」——與本次改版無耦合，且會動到 `data.js` 的 `practical` 文案，留待下一輪。**這是刻意的範圍決定，不是遺漏。**

**2. 佔位掃描**

已檢查全文無 TBD／TODO／「類似 Task N」／「加上適當的錯誤處理」。唯一的「內容待填」是 Task 6 的 `photoCredits` 八列——那是刻意的，因為作者名與授權版本必須逐字抄 `CREDITS.md`，不能由計畫代寫，且 Task 6 已明寫來源檔案與禁止改寫。

**3. 型別一致性**

- `taxRefundStatus` 回傳 `{state, shortfallPLN}`：Task 4 定義、Task 11 使用，欄位名一致。
- `nextTrain` 回傳 `{index, train, minutesUntil}`：Task 5 定義、Task 10 使用 `nt.train.seg`／`nt.minutesUntil`，一致。
- `migratePhotoCheckins` 回傳 `{next, migrated}`：Task 6 定義、Task 13 使用 `r.next`／`r.migrated`，一致。
- `storeOk`／`setStoreOk`：Task 2 建立，Task 13 沿用同名。
- 分頁 id `money`：Task 9 定義後，Task 11 的記帳區塊掛在 `data-tabsection="money"`，一致（刻意不叫 `expense`，避免與子頁 id 撞名）。
- `.B-tl-row`：Task 12 定義，Task 13 沿用。
- `.B-store-warn`：Task 2 定義樣式，Task 11、13 沿用。

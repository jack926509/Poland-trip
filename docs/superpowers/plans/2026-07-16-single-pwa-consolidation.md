# POLSKA Single PWA Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 POLSKA 整併為同一網址、同一資料與同一功能核心，電腦呈現完整網頁排版，手機呈現可安裝且可離線的 PWA 旅伴。

**Architecture:** 根網址 `index.html` 載入唯一的 `B_Companion` React 應用；手機採固定四分頁單欄介面，寬螢幕採同一元件樹的網頁雙欄排版。`redesign/data.js` 是唯一旅程資料來源，`redesign/pwa-core.js` 提供可獨立測試的日期選擇與本機儲存邏輯；舊入口只做相容轉址，不再形成獨立版本。

**Tech Stack:** 靜態 HTML、React 18 UMD、esbuild 0.24.0、CSS、Web App Manifest、Service Worker、Node.js 內建 test runner。

## Global Constraints

- 手機 PWA 與桌機網頁共用同一個根網址、React 應用、旅程資料與 Service Worker。
- 手機底部固定保留「今日／行程／交通／訂票」四個主要入口。
- 電腦需呈現完整網頁排版，不得只是固定 480 px 的手機畫面置中。
- `redesign/data.js` 是唯一旅程資料來源；README 不複製完整行程內容。
- 不新增登入、後端、資料庫、定位追蹤、即時火車 API、推播或付款。
- 不改變已確認的 2026/10/24–10/31、8 天 7 晚行程內容。
- 未取得使用者另行確認前，不刪除舊版原始檔、不部署、不對外發布。
- 不提交 `.env`、API key、service role key 或其他 secrets。
- 所有中文介面、註解、文件與 commit 訊息使用繁體中文。

---

## File Responsibility Map

- Create `redesign/pwa-core.js`: 純 JavaScript 日期投影、本機備註讀寫及安全降級；可在瀏覽器與 Node 測試環境載入。
- Create `legacy-redirect.js`: 所有舊 HTML 入口共用的根網址轉址，不複製跳轉邏輯。
- Create `tests/pwa-core.test.mjs`: 驗證旅程日期、旅程前後預覽狀態與本機儲存降級。
- Create `tests/entrypoints.test.mjs`: 驗證唯一入口、舊入口相容轉址、manifest 與 sitemap。
- Create `tests/ui-contract.test.mjs`: 驗證四分頁、桌機布局契約與正式 bundle 載入順序。
- Create `tests/sw-contract.test.mjs`: 驗證單一應用殼、完整 precache 與更新策略。
- Create `verify.sh`: 專案單一驗收入口，依序執行測試、build 與語法檢查。
- Modify `index.html`: 唯一正式應用殼、PWA metadata、更新流程與 React mount。
- Modify `mobile.html`, `desktop.html`, `app-preview.html`: 瘦身為相容入口，導回根網址。
- Modify `redesign/B-companion.jsx`: 唯一產品 UI、真實旅程日期、網路／儲存降級與雙裝置導覽。
- Modify `redesign/B-companion.css`: 手機 App 排版與桌機完整網頁排版。
- Modify `redesign/data.js`: 補上機器可讀的旅程起訖日期與時區，不改行程內容。
- Modify `manifest.json`: 根網址啟動與唯一產品 shortcuts。
- Modify `sw.js`: 只快取正式應用資源，核心資源缺漏時拒絕安裝。
- Modify `build.sh`: 只編譯正式使用的 `B-companion.jsx`，停止產生封存設計稿。
- Modify `README.md`, `MERGE-NOTES.md`: 說明單一 PWA 架構與舊版本封存狀態。
- Modify `.gitignore`: 忽略本機視覺腦力激盪輸出 `.superpowers/`。

---

### Task 1: 建立可測試的日期與本機儲存核心

**Files:**
- Create: `redesign/pwa-core.js`
- Create: `tests/pwa-core.test.mjs`
- Modify: `redesign/data.js:3-16`

**Interfaces:**
- Produces: `window.PolskaPwaCore.projectTripMoment(days, now, override, tripMeta)` → `{ d, idx, now, next, mins, phase, beforeStart, afterEnd }`
- Produces: `window.PolskaPwaCore.readNotes(storage)` → `{ notes, persistent }`
- Produces: `window.PolskaPwaCore.writeNotes(storage, notes)` → `boolean`
- Consumes: `TRIP.meta.tripStart`, `TRIP.meta.tripEnd`, `TRIP.meta.timeZone`

- [ ] **Step 1: 寫出日期與儲存失敗測試**

```js
// tests/pwa-core.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), context);
const { projectTripMoment, readNotes, writeNotes } = context.globalThis.PolskaPwaCore;
const tripMeta = { tripStart: '2026-10-24', tripEnd: '2026-10-31', timeZone: 'Europe/Warsaw' };
const days = [
  { n: 1, date: '10/24 (六)', steps: [{ t: '09:00' }, { t: '12:00' }] },
  { n: 8, date: '10/31 (六)', steps: [{ t: '09:00' }, { t: '12:00' }] },
];

test('旅程日期內選到對應 Day', () => {
  const result = projectTripMoment(days, new Date('2026-10-24T08:30:00Z'), null, tripMeta);
  assert.equal(result.d.n, 1);
  assert.equal(result.phase, 'during');
});

test('旅程前後回到首末日並標示預覽狀態', () => {
  assert.equal(projectTripMoment(days, new Date('2026-10-01T12:00:00Z'), null, tripMeta).phase, 'before');
  assert.equal(projectTripMoment(days, new Date('2026-11-02T12:00:00Z'), null, tripMeta).phase, 'after');
});

test('儲存不可用時不丟出例外', () => {
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.deepEqual(readNotes(broken), { notes: {}, persistent: false });
  assert.equal(writeNotes(broken, { '1-0': '護照' }), false);
});
```

- [ ] **Step 2: 執行測試並確認先失敗**

Run: `node --test tests/pwa-core.test.mjs`

Expected: FAIL，錯誤指出 `redesign/pwa-core.js` 不存在或 `PolskaPwaCore` 尚未定義。

- [ ] **Step 3: 實作最小核心與旅程 metadata**

```js
// redesign/pwa-core.js
(function (root) {
  const dateKey = (date, timeZone) => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(date).reduce((out, part) => ({ ...out, [part.type]: part.value }), {});
    return {
      iso: `${parts.year}-${parts.month}-${parts.day}`,
      day: `${parts.month}/${parts.day}`,
      mins: Number(parts.hour) * 60 + Number(parts.minute),
    };
  };
  const dayKey = (day) => day.date.slice(0, 5);

  function projectTripMoment(days, now = new Date(), override = null, tripMeta) {
    const clock = dateKey(now, tripMeta.timeZone);
    const matched = days.find((day) => dayKey(day) === clock.day);
    const phase = clock.iso < tripMeta.tripStart ? 'before' : clock.iso > tripMeta.tripEnd ? 'after' : 'during';
    const d = override
      ? days.find((day) => day.n === override) || days[0]
      : matched || (phase === 'before' ? days[0] : days[days.length - 1]);
    const stepMins = d.steps.map((step) => {
      const [hour, minute] = step.t.split(':').map(Number);
      return hour * 60 + minute;
    });
    let idx = 0;
    stepMins.forEach((minutes, index) => { if (minutes <= clock.mins) idx = index; });
    return {
      d, idx, now: d.steps[idx], next: d.steps[idx + 1], mins: clock.mins, phase,
      beforeStart: clock.mins < stepMins[0],
      afterEnd: clock.mins > stepMins[stepMins.length - 1] + 60,
    };
  }

  function readNotes(storage) {
    try { return { notes: JSON.parse(storage.getItem('polska-notes') || '{}'), persistent: true }; }
    catch (_) { return { notes: {}, persistent: false }; }
  }

  function writeNotes(storage, notes) {
    try { storage.setItem('polska-notes', JSON.stringify(notes)); return true; }
    catch (_) { return false; }
  }

  root.PolskaPwaCore = { projectTripMoment, readNotes, writeNotes };
})(typeof window === 'undefined' ? globalThis : window);
```

Add to `TRIP.meta`:

```js
tripStart: '2026-10-24',
tripEnd: '2026-10-31',
timeZone: 'Europe/Warsaw',
```

- [ ] **Step 4: 執行核心測試**

Run: `node --test tests/pwa-core.test.mjs`

Expected: 3 tests PASS，0 FAIL。

- [ ] **Step 5: 提交核心邏輯**

```bash
git add redesign/pwa-core.js redesign/data.js tests/pwa-core.test.mjs
git commit -m "feat: 建立 PWA 日期與儲存核心"
```

---

### Task 2: 收斂為唯一根入口並保留舊網址相容性

**Files:**
- Create: `legacy-redirect.js`
- Create: `tests/entrypoints.test.mjs`
- Modify: `index.html`
- Modify: `mobile.html`
- Modify: `desktop.html`
- Modify: `app-preview.html`
- Modify: `manifest.json`
- Modify: `sitemap.xml`

**Interfaces:**
- Consumes: `window.PolskaPwaCore`、`window.TRIP`、`window.B_Companion`
- Produces: 根網址載入唯一應用；三個舊 HTML 路徑以 `location.replace()` 導回同層根網址並保留 hash

- [ ] **Step 1: 寫出入口契約測試**

```js
// tests/entrypoints.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(path, 'utf8');

test('根入口直接載入唯一 PWA，不做裝置跳轉', () => {
  const html = read('index.html');
  assert.match(html, /redesign\/pwa-core\.js/);
  assert.match(html, /redesign\/dist\/B-companion\.js/);
  assert.doesNotMatch(html, /matchMedia\('\(max-width: 640px\)'\)/);
});

test('舊入口只載入共用轉址', () => {
  for (const file of ['mobile.html', 'desktop.html', 'app-preview.html']) {
    const html = read(file);
    assert.match(html, /legacy-redirect\.js/);
    assert.doesNotMatch(html, /B_Companion|A_Magazine|IOSDevice/);
  }
});

test('manifest 與 sitemap 只公開根入口', () => {
  const manifest = JSON.parse(read('manifest.json'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.id, './');
  assert.doesNotMatch(read('sitemap.xml'), /mobile\.html|desktop\.html|app-preview\.html/);
});
```

- [ ] **Step 2: 執行入口測試並確認先失敗**

Run: `node --test tests/entrypoints.test.mjs`

Expected: 3 tests FAIL，顯示根入口仍有裝置跳轉、舊入口仍載入獨立 UI、manifest 仍指向 `mobile.html`。

- [ ] **Step 3: 將現有手機應用殼移到根入口**

`index.html` 保留 SEO／PWA metadata，body 簡化為：

```html
<body>
  <a class="skip-link" href="#app-main">跳到主要內容</a>
  <div id="root"></div>
  <script src="vendor/react.production.min.js"></script>
  <script src="vendor/react-dom.production.min.js"></script>
  <script src="redesign/pwa-core.js"></script>
  <script src="redesign/data.js?v=polska-v13"></script>
  <script src="redesign/dist/B-companion.js?v=polska-v13"></script>
  <script>
    ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(B_Companion));
  </script>
</body>
```

此步將現有 Service Worker 註冊碼留在 `index.html`；Task 4 才抽至 `pwa-register.js` 並以外部 script 取代 inline 註冊碼。

- [ ] **Step 4: 建立共用舊入口轉址並瘦身三個 HTML**

```js
// legacy-redirect.js
(function () {
  const target = new URL('./', window.location.href);
  target.hash = window.location.hash;
  window.location.replace(target.href);
})();
```

三個舊入口均使用同一個最小 body：

```html
<p>POLSKA 已整併，正在前往新版網頁與手機 PWA…</p>
<script src="legacy-redirect.js"></script>
```

- [ ] **Step 5: 將 manifest 與 sitemap 指向根網址**

`manifest.json`：

```json
{
  "id": "./",
  "start_url": "./",
  "scope": "./",
  "display": "standalone"
}
```

保留原有 name、description、icons、theme colors 與 categories；shortcuts 僅保留根網址搭配 `#today`、`#B-tickets`。

- [ ] **Step 6: 執行入口測試與瀏覽器煙霧測試**

Run: `node --test tests/entrypoints.test.mjs`

Expected: 3 tests PASS，0 FAIL。

Run: `python3 -m http.server 4173`

Expected: `http://localhost:4173/` 直接顯示 B Companion；三個舊 HTML 最終 URL 均為 `http://localhost:4173/`。

- [ ] **Step 7: 提交入口整併**

```bash
git add index.html mobile.html desktop.html app-preview.html legacy-redirect.js manifest.json sitemap.xml tests/entrypoints.test.mjs
git commit -m "feat: 將網頁與手機整併至單一入口"
```

---

### Task 3: 讓同一介面同時成為完整網頁與手機 PWA

**Files:**
- Create: `tests/ui-contract.test.mjs`
- Modify: `redesign/B-companion.jsx:125-230, 261-836`
- Modify: `redesign/B-companion.css`
- Modify: `index.html` inline shell styles
- Rebuild: `redesign/dist/B-companion.js`

**Interfaces:**
- Consumes: `PolskaPwaCore.projectTripMoment()`、`PolskaPwaCore.readNotes()`、`PolskaPwaCore.writeNotes()`
- Produces: `B_PrimaryNav({ placement, onToday, onItinerary, onTransport, onTickets })`
- Produces: `.B-web-grid > .B-primary-column + .B-secondary-column`
- Produces: 手機 `.B-mobile-nav` 與桌機 `.B-desktop-nav`，兩者操作同一狀態
- Produces: `B_PreTripGuide({ trip })`，把航班、住宿、安全與實用資訊留在同一應用，不再依賴 A 雜誌版

- [ ] **Step 1: 寫出 UI 契約測試**

```js
// tests/ui-contract.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const jsx = fs.readFileSync('redesign/B-companion.jsx', 'utf8');
const css = fs.readFileSync('redesign/B-companion.css', 'utf8');

test('手機與桌機導覽共用四個固定功能', () => {
  for (const label of ['今日', '行程', '交通', '訂票']) assert.match(jsx, new RegExp(label));
  assert.match(jsx, /B-mobile-nav/);
  assert.match(jsx, /B-desktop-nav/);
});

test('寬螢幕採雙欄網頁布局', () => {
  assert.match(jsx, /B-web-grid/);
  assert.match(jsx, /B-primary-column/);
  assert.match(jsx, /B-secondary-column/);
  assert.match(css, /@media \(min-width: 900px\)/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(18rem,\s*24rem\)/);
});

test('不再使用隨機日期示範', () => {
  assert.doesNotMatch(jsx, /getDate\(\) % 8/);
  assert.match(jsx, /projectTripMoment/);
});

test('完整網頁資訊已整合回同一應用', () => {
  assert.match(jsx, /function B_PreTripGuide/);
  for (const key of ['trip.flights', 'trip.stay', 'trip.safety', 'trip.practical', 'trip.phrases']) {
    assert.match(jsx, new RegExp(key.replace('.', '\\.')));
  }
});
```

- [ ] **Step 2: 執行 UI 測試並確認先失敗**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL，缺少桌機導覽、雙欄 wrapper，且仍存在隨機日期示範。

- [ ] **Step 3: 接入真實旅程日期與儲存狀態**

在 `B_Companion` 開頭加入：

```jsx
const core = window.PolskaPwaCore;
const initialNotes = core.readNotes(window.localStorage);
const [notes, setNotes] = B_useState(initialNotes.notes);
const [notesPersistent, setNotesPersistent] = B_useState(initialNotes.persistent);
const moment = B_useMemo(
  () => core.projectTripMoment(t.days, new Date(), override, t.meta),
  [t.days, t.meta, override, tick]
);
```

儲存備註時以 `setNotesPersistent(core.writeNotes(window.localStorage, next))` 更新降級狀態；刪除 `B_synthetic()` 與直接操作 `localStorage` 的重複邏輯。

- [ ] **Step 4: 抽出共用四功能導覽並建立雙欄 wrapper**

```jsx
function B_PrimaryNav({ placement, onToday, onItinerary, onTransport, onTickets }) {
  const items = [
    ['今日', onToday], ['行程', onItinerary], ['交通', onTransport], ['訂票', onTickets],
  ];
  return (
    <nav className={`B-primary-nav B-${placement}-nav`} aria-label={placement === 'mobile' ? '手機主要導覽' : '網頁主要導覽'}>
      {items.map(([label, action]) => <button type="button" key={label} onClick={action}>{label}</button>)}
    </nav>
  );
}
```

在 `B_Companion` 內建立唯一一組 actions，桌機與手機導覽共用：

```jsx
const navActions = {
  onToday: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
  onItinerary: () => document.querySelector('.B-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  onTransport: () => d.train ? setTrainSheet(true) : document.querySelector('.B-timeline')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  onTickets: () => document.getElementById('B-tickets')?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
};
```

將 A 雜誌版仍有價值的行前資訊，以共用資料建立次要閱讀區；手機放在內容末端與 drawer 的「行前指南」連結，桌機放在右欄：

```jsx
function B_PreTripGuide({ trip }) {
  const sections = [
    ['航班', [...trip.flights.out, ...trip.flights.back].map((flight) => `${flight.code} · ${flight.leg} · ${flight.when}`)],
    ['住宿區域', trip.stay.map((item) => `${item.city} · ${item.pick} · ${item.note}`)],
    ['安全與緊急資訊', [
      ...trip.safety.emergency.map(([label, value]) => `${label} · ${value}`),
      ...trip.safety.tips.map((item) => `${item.label} · ${item.text}`),
    ]],
    ['實用資訊', trip.practical.map((item) => `${item.tag} · ${item.name} · ${item.note}`)],
    ['常用波蘭語', trip.phrases.map(([zh, pl]) => `${zh} · ${pl}`)],
  ];
  return (
    <section id="B-guide" className="B-pretrip-guide" aria-labelledby="B-guide-title">
      <h2 id="B-guide-title">行前指南</h2>
      {sections.map(([title, rows]) => (
        <details key={title}>
          <summary>{title}</summary>
          <ul>{rows.map((row) => <li key={row}>{row}</li>)}</ul>
        </details>
      ))}
    </section>
  );
}
```

`B_Companion` 主要結構調整為：

```jsx
<div className="B-frame paper-tex">
  <header className="B-head">…</header>
  <B_PrimaryNav placement="desktop" {...navActions} />
  <main id="app-main" className="B-web-grid">
    <section className="B-primary-column">…今日、日次、交通、時間軸與警告…</section>
    <aside className="B-secondary-column">…提醒、訂票、美食、備案、實務資訊、城市故事與 B_PreTripGuide…</aside>
  </main>
  <B_PrimaryNav placement="mobile" {...navActions} />
  …drawer 與 sheet…
</div>
```

- [ ] **Step 5: 實作手機與桌機兩種排版**

```css
.B-desktop-nav{display:none}
.B-web-grid{display:block}
.B-mobile-nav{position:fixed;left:50%;bottom:0;transform:translateX(-50%)}

@media (min-width:900px){
  .B-frame{max-width:1180px;margin:0 auto;min-height:100vh}
  .B-desktop-nav{display:grid;grid-template-columns:repeat(4,minmax(7rem,1fr));position:sticky;top:0;z-index:80}
  .B-mobile-nav{display:none}
  .B-web-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(18rem,24rem);gap:clamp(1.5rem,3vw,3rem);padding:1.5rem 2rem 4rem}
  .B-secondary-column{position:sticky;top:5rem;align-self:start;max-height:calc(100vh - 6rem);overflow:auto}
}
```

桌機網頁仍使用相同資料與互動；不載入 `A_Magazine`。

- [ ] **Step 6: 執行測試、build 與語法檢查**

Run: `node --test tests/pwa-core.test.mjs tests/entrypoints.test.mjs tests/ui-contract.test.mjs`

Expected: 10 tests PASS，0 FAIL。

Run: `./build.sh`

Expected: 產生 `redesign/dist/B-companion.js` 並顯示完成訊息。

Run: `node --check redesign/dist/B-companion.js`

Expected: exit code 0，無輸出。

- [ ] **Step 7: 以瀏覽器驗證三種寬度**

Run: `python3 -m http.server 4173`

Expected:

- 320 × 844：四個底部入口完整、無水平捲軸。
- 390 × 844：底部入口固定，安全區不遮內容。
- 1440 × 900：顯示上方四功能導覽與雙欄完整網頁，不是窄版手機框。

- [ ] **Step 8: 提交響應式單一介面**

```bash
git add index.html redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/ui-contract.test.mjs
git commit -m "feat: 建立網頁與手機共用的響應式介面"
```

---

### Task 4: 強化 PWA 安裝、離線與安全更新

**Files:**
- Create: `pwa-register.js`
- Create: `tests/sw-contract.test.mjs`
- Modify: `index.html`
- Modify: `redesign/B-companion.jsx`
- Modify: `redesign/B-companion.css`
- Modify: `sw.js`
- Rebuild: `redesign/dist/B-companion.js`

**Interfaces:**
- Produces: `window` CustomEvents：`pwa-ready`、`pwa-update-ready`、`pwa-error`
- Consumes: `navigator.onLine`、`navigator.serviceWorker`、standalone media query
- Produces: `CACHE_VERSION = 'polska-v13'` 與根應用殼離線 fallback

- [ ] **Step 1: 寫出 Service Worker 契約測試**

```js
// tests/sw-contract.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const sw = fs.readFileSync('sw.js', 'utf8');

test('只預快取單一正式應用', () => {
  assert.match(sw, /'\.\/'/);
  assert.doesNotMatch(sw, /mobile\.html|desktop\.html|app-preview\.html|A-magazine|ios-frame|C-app/);
});

test('核心資源使用完整 addAll，不吞掉安裝錯誤', () => {
  assert.match(sw, /cache\.addAll\(PRECACHE_URLS\)/);
  assert.doesNotMatch(sw, /cache\.add\(url\)\.catch/);
});

test('離線導覽回到根應用殼', () => {
  assert.match(sw, /caches\.match\('\.\/'\)/);
});
```

- [ ] **Step 2: 執行 SW 測試並確認先失敗**

Run: `node --test tests/sw-contract.test.mjs`

Expected: FAIL，舊版資源仍在 precache，安裝仍逐檔吞錯，fallback 仍指向 `index.html`。

- [ ] **Step 3: 收斂 precache 並讓核心安裝具原子性**

```js
const CACHE_VERSION = 'polska-v13';
const PRECACHE_URLS = [
  './', './manifest.json', './pwa-register.js', './apple-touch-icon.png', './icon-192.png', './icon-512.png',
  './vendor/react.production.min.js', './vendor/react-dom.production.min.js',
  './redesign/pwa-core.js', './redesign/data.js?v=polska-v13',
  './redesign/tokens.css?v=polska-v13', './redesign/B-companion.css?v=polska-v13',
  './redesign/dist/B-companion.js?v=polska-v13',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS)));
});
```

HTML 導覽離線 fallback 改為 `cached || caches.match('./')`；保留使用者主動 `SKIP_WAITING` 與 activate 清理舊 cache。

- [ ] **Step 4: 抽出註冊與更新事件**

```js
// pwa-register.js
(function () {
  const emit = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
  if (!('serviceWorker' in navigator)) { emit('pwa-error', { reason: 'unsupported' }); return; }
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      if (registration.waiting) emit('pwa-update-ready', { worker: registration.waiting });
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) emit('pwa-update-ready', { worker });
        });
      });
      emit('pwa-ready', { registration });
    } catch (error) {
      emit('pwa-error', { reason: 'registration', message: error.message });
    }
  });
})();
```

完成後在 `index.html` 移除 inline Service Worker 註冊區塊，並於 React mount 後加入：

```html
<script src="pwa-register.js"></script>
```

- [ ] **Step 5: 在 UI 顯示安裝、離線、儲存與更新狀態**

在 `B_Companion` 新增 `pwaStatus`、`waitingWorker`、`toast` state，監聽三個 PWA events；只有 iOS Safari 且非 standalone 時顯示：

```jsx
<aside className="B-install-hint" role="note">
  <strong>加到 iPhone 主畫面</strong>
  <span>點 Safari 分享按鈕，再選「加入主畫面」，即可離線開啟。</span>
  <button type="button" onClick={dismissInstallHint}>知道了</button>
</aside>
```

更新按鈕只執行 `waitingWorker.postMessage({ type: 'SKIP_WAITING' })`；controllerchange 後重新載入。`notesPersistent === false` 時顯示「備註只保留到這次關閉前」。離線點擊地圖或訂票時阻止開新頁並顯示「目前離線；站名與地址仍可在本頁查看」。

- [ ] **Step 6: 執行全部測試與 build**

Run: `node --test tests/*.test.mjs`

Expected: 13 tests PASS，0 FAIL。

Run: `./build.sh`

Expected: `redesign/dist/B-companion.js` 成功重建。

Run: `node --check sw.js`

Expected: exit code 0，無輸出。

- [ ] **Step 7: 實測離線與更新流程**

透過 `http://localhost:4173/`：

1. 線上載入至 Service Worker activated。
2. 切換瀏覽器 offline 後重新整理。
3. 確認 Day 1–8、交通、訂票與備註 UI 仍可開啟。
4. 離線點地圖時顯示提示、不開空白分頁。
5. 將 cache 版本暫時提高後重新載入，確認出現更新提示；點更新後只重新載入一次。

- [ ] **Step 8: 提交 PWA 強化**

```bash
git add index.html pwa-register.js sw.js redesign/B-companion.jsx redesign/B-companion.css redesign/dist/B-companion.js tests/sw-contract.test.mjs
git commit -m "feat: 強化 PWA 離線安裝與更新流程"
```

---

### Task 5: 收斂 build、文件與單一驗收指令

**Files:**
- Create: `verify.sh`
- Modify: `build.sh`
- Modify: `README.md`
- Modify: `MERGE-NOTES.md`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `./verify.sh` → 測試、build、JavaScript 語法檢查全數成功才回傳 exit code 0
- Consumes: `tests/*.test.mjs`、`./build.sh`、正式 bundle 與 `sw.js`

- [ ] **Step 1: 先將單一 build 目標寫入驗收契約**

在 `tests/ui-contract.test.mjs` 新增：

```js
test('build 只編譯正式 PWA 介面', () => {
  const build = fs.readFileSync('build.sh', 'utf8');
  assert.match(build, /redesign\/B-companion\.jsx/);
  assert.doesNotMatch(build, /A-magazine\.jsx|C-app\.jsx|ios-frame\.jsx|tweaks-panel\.jsx/);
});
```

- [ ] **Step 2: 執行 UI 測試並確認新增案例先失敗**

Run: `node --test tests/ui-contract.test.mjs`

Expected: FAIL，build 仍列出 A、C、iOS frame 與 tweaks panel。

- [ ] **Step 3: 將 build.sh 收斂為正式 bundle**

```bash
#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
ESBUILD_VERSION="${ESBUILD_VERSION:-0.24.0}"
npx --yes "esbuild@${ESBUILD_VERSION}" redesign/B-companion.jsx \
  --jsx=transform \
  --jsx-factory=React.createElement \
  --jsx-fragment=React.Fragment \
  --minify \
  --target=es2018 \
  --outfile=redesign/dist/B-companion.js
echo "✅ 正式網頁與手機 PWA bundle 已完成"
```

- [ ] **Step 4: 建立單一驗收指令**

```bash
#!/bin/bash
# verify.sh
set -euo pipefail
cd "$(dirname "$0")"
node --test tests/*.test.mjs
./build.sh
node --check redesign/dist/B-companion.js
node --check redesign/data.js
node --check redesign/pwa-core.js
node --check pwa-register.js
node --check legacy-redirect.js
node --check sw.js
echo "✅ POLSKA 單一 PWA 自動驗收完成"
```

執行 `chmod +x verify.sh build.sh`。

- [ ] **Step 5: 更新維護文件與忽略本機草圖**

README 的正式入口說明改為：

```markdown
## 網頁與手機 PWA

- 正式入口：根網址 `/`
- 電腦：同一應用自動呈現完整雙欄網頁。
- 手機：同一應用呈現固定「今日／行程／交通／訂票」四分頁；可加入主畫面及離線使用。
- 唯一旅程資料來源：`redesign/data.js`
- 修改後驗收：`./verify.sh`

`mobile.html`、`desktop.html`、`app-preview.html` 僅保留舊書籤相容轉址，不再是獨立版本。
```

`MERGE-NOTES.md` 首行加註「歷史三版本合併紀錄；現況以 README 與單一 PWA 設計規格為準」。`.gitignore` 新增 `.superpowers/`，不處理既有 `.codex-staging/`。

- [ ] **Step 6: 執行完整自動驗收**

Run: `./verify.sh`

Expected: 所有 Node tests PASS、build 成功、六個 JavaScript 語法檢查 exit code 0，最後顯示 `✅ POLSKA 單一 PWA 自動驗收完成`。

- [ ] **Step 7: 提交工程收斂**

```bash
git add .gitignore README.md MERGE-NOTES.md build.sh verify.sh tests/ui-contract.test.mjs
git commit -m "chore: 收斂單一 PWA 建置與驗收流程"
```

---

### Task 6: 真實瀏覽器驗收與 Claude 交叉審查交接

**Files:**
- Create: `docs/reviews/2026-07-16-single-pwa-review-handoff.md`
- Create: `docs/verification/2026-07-16-single-pwa-results.md`

**Interfaces:**
- Consumes: `./verify.sh`、Task 1–5 的完整 diff、設計規格的 9 項驗收條件
- Produces: 可供 Claude 獨立複跑的審查包與實際驗收證據

- [ ] **Step 1: 重跑完整驗收並保存實際結果**

Run: `./verify.sh`

Expected: 全綠。把測試數、build 結果與語法檢查結果逐項寫入 `docs/verification/2026-07-16-single-pwa-results.md`，不得只寫「已通過」。

- [ ] **Step 2: 以本機 HTTP 實測網頁渲染**

Run: `python3 -m http.server 4173`

檢查並記錄：

- 320 × 844：無水平溢出，四個底部入口可見。
- 390 × 844：固定底欄、safe-area、今日與下一站資訊正常。
- 1440 × 900：雙欄完整網頁、桌機導覽可見、手機底欄隱藏。
- `mobile.html`、`desktop.html`、`app-preview.html`：均導向根網址。
- 線上載入後切 offline：根網址重新整理仍可讀核心內容。

每一項在驗收文件記錄 viewport、最終 URL、可見標題、水平 overflow 數值與 console error 數量。

- [ ] **Step 3: 建立 Claude 審查交接包**

```markdown
# POLSKA 單一 PWA 交叉審查

## Diff

請審查 `git diff 2f26402..HEAD`。

## 驗收條件

1. 根網址是唯一正式入口。
2. 手機固定四分頁且 320 px 無水平溢出。
3. 桌機是同一應用的完整雙欄網頁。
4. manifest 從根網址 standalone 啟動。
5. 離線可讀 Day 1–8、交通與訂票。
6. 更新由使用者確認後切換。
7. 三個舊入口安全導回根網址。
8. `./verify.sh` 全綠。
9. 無 secrets、未部署、未刪除舊版原始檔。

## 風險焦點

- Service Worker 是否會留下半套 cache。
- iPhone standalone safe-area 與更新重載是否穩定。
- 寬螢幕雙欄是否仍能操作所有手機功能。
- 舊 GitHub Pages 子路徑部署下，根入口與轉址是否正確。
```

- [ ] **Step 4: 提交驗收紀錄與審查包**

```bash
git add docs/verification/2026-07-16-single-pwa-results.md docs/reviews/2026-07-16-single-pwa-review-handoff.md
git commit -m "test: 記錄單一 PWA 驗收與審查交接"
```

- [ ] **Step 5: 停在部署門檻前**

確認 `git status --short` 只剩使用者原有的 `.codex-staging/` 或已知不提交項目。向使用者回報本機驗收結果與 Claude 審查狀態；只有 Claude 查過無阻擋問題且使用者實際操作核心路徑後，才另行詢問是否提交 GitHub／部署。

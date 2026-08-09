# Free Travel Database Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將現有 20 頁波蘭行程網站擴充成含官方來源、狀態、出發準備度、每日導航與離線 SOS 的 21 頁自由行資料庫。

**Architecture:** 新增 `src/data/travel-database.js` 集中存放旅程操作資料，使用 `status/verifiedAt/sourceUrl/recheckAt` 統一時效與來源。新增獨立資料庫樣板，首頁只引用準備度摘要，每日頁以 `dayOperations` 接上地址、導航和晚間檢查，不在樣板重複旅遊事實。

**Tech Stack:** Node.js ES modules、靜態 HTML、現有 CSS、Node `test`、GitHub Pages 相對路徑。

## Global Constraints

- 一律繁體中文，中英數字之間保留半形空格。
- 只有資訊擁有者的官方來源可標為 `verified`；動態資料用 `recheck`，未公告用 `pending`，私人訂單用 `private-required`。
- 公開 Git 不儲存護照號碼、完整卡號、訂位代碼、保單號、健康史或家人聯絡方式。
- 維持無後端、無新外部依賴的靜態網站。
- 新頁路徑為 `practical/database.html`，建置總數從 20 頁增為 21 頁。
- 駐波蘭代表處地址必須是 `30th Floor, Ul. Emilii Plater 53, 00-113 Warsaw, Poland`，全站不得再出現 `Al. Jerozolimskie 179`。
- 桌機與 390 px 都不得有整頁水平滾動；SOS 文字在外部字型、地圖或 JavaScript 失敗時仍可讀。
- 不修改或納入 `.agents/`、`.claude/`、`skills-lock.json`。

---

### Task 1: 建立統一資料模型與官方內容

**Files:**
- Create: `src/data/travel-database.js`
- Modify: `src/data/essentials.js`
- Test: `tests/build.test.mjs`

**Interfaces:**
- Produces: `databaseEntries`, `readinessItems`, `dayOperations`, `statusLabels`, `databaseSections`
- Each `databaseEntries` item includes `id`, `section`, `category`, `cityKey`, `title`, `summary`, `status`, `sourceUrl`, `verifiedAt`, `recheckAt`, `offlineNote`, `private`.

- [ ] **Step 1: Write failing data-contract tests**

```js
import { databaseEntries, readinessItems, dayOperations } from '../src/data/travel-database.js';
assert.ok(databaseEntries.length >= 15);
assert.deepEqual(new Set(databaseEntries.map(item => item.status)), new Set(['verified', 'recheck', 'pending', 'private-required']));
assert.equal(readinessItems.length, 8);
assert.deepEqual(Object.keys(dayOperations).map(Number), [1,2,3,4,5,6,7,8]);
assert.ok(!JSON.stringify({ databaseEntries, readinessItems, dayOperations }).includes('Al. Jerozolimskie 179'));
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run: `node --test tests/build.test.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `travel-database.js`.

- [ ] **Step 3: Implement the data file**

Create exports with at least these sections: `entry`, `aviation`, `rail`, `connectivity`, `money`, `medical`, `emergency`, `luggage`, `calendar`, `tax-free`, `accessibility`, `daily-basics`, `dining`, `documents`, `accommodation`.

Populate public facts from `docs/research/2026-08-08-free-travel-gaps.md`; private facts remain status-only records. Store no secret values.

- [ ] **Step 4: Correct representative-office data**

Replace the old address in `safety.embassy` and add a source-bearing database entry with `verifiedAt: '2026-08-08'`.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `node build.mjs && node --test tests/build.test.mjs`
Expected: PASS for the new data contracts and all existing tests.

### Task 2: 產生自由行資料庫頁

**Files:**
- Create: `src/templates/database.mjs`
- Modify: `build.mjs`
- Modify: `src/templates/layout.mjs`
- Modify: `src/styles/main.css`
- Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `renderDatabase({ entries, sections, statusLabels })`
- Produces: `dist/practical/database.html`

- [ ] **Step 1: Write failing page-contract tests**

```js
assert.equal(htmlFiles().length, 21);
const html = read('practical/database.html');
for (const heading of ['SOS 離線急救卡', '出入境與 ETIAS', '航班與行李', '醫療與保險', '退稅 TAX FREE']) assert.ok(html.includes(heading));
assert.ok(html.includes('tel:+48668027574'));
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run: `npm test`
Expected: FAIL because the 21st page and renderer do not exist.

- [ ] **Step 3: Implement semantic static renderer**

Render an SOS section first, then a section index and section cards. Every card prints textual status, summary, offline note, verification date, recheck date, and official source. Use headings and real links; no JavaScript is required for core access.

- [ ] **Step 4: Wire build and navigation**

Import `travel-database.js` and `renderDatabase` in `build.mjs`, write `practical/database.html`, change the expected count to 21, add the page to the Practical nav and homepage toolkit.

- [ ] **Step 5: Add responsive status styles**

Add `.status-verified`, `.status-recheck`, `.status-pending`, `.status-private`, `.database-index`, `.database-card`, `.sos-grid`, and `.source-meta`. Status must include text, not color alone.

- [ ] **Step 6: Run focused tests and confirm GREEN**

Run: `npm test`
Expected: all tests pass with exactly 21 HTML pages.

### Task 3: 首頁出發準備度

**Files:**
- Modify: `src/templates/home.mjs`
- Modify: `build.mjs`
- Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `renderHome({ meta, days, flights, cities, readinessItems })`

- [ ] **Step 1: Write failing readiness tests**

```js
const home = read('index.html');
for (const label of ['住宿', '城際車票', '景點票券', '航班行李', '旅平險', '網路離線', 'ETIAS', '緊急聯絡']) assert.ok(home.includes(label));
assert.ok(home.includes('出發準備度'));
```

- [ ] **Step 2: Run focused test and confirm RED**

Run: `node build.mjs && node --test tests/build.test.mjs`
Expected: FAIL because readiness cards are absent.

- [ ] **Step 3: Render readiness summary**

Show `pending` and `private-required` first, with status text and link to `practical/database.html`. Do not expose any private field.

- [ ] **Step 4: Run focused tests and confirm GREEN**

Run: `npm test`
Expected: PASS.

### Task 4: 每日操作導航與晚間檢查

**Files:**
- Modify: `src/templates/day.mjs`
- Modify: `build.mjs`
- Modify: `src/data/travel-database.js`
- Test: `tests/build.test.mjs`

**Interfaces:**
- Consumes: `renderDay(day, photoSpotsForDay, operation)`
- `operation` includes `addresses[]`, `navigation[]`, `dailyAlerts[]`, `nightChecklist[]`.

- [ ] **Step 1: Write failing daily-operation tests**

```js
for (let day = 1; day <= 8; day += 1) {
  const html = read(`day-${String(day).padStart(2, '0')}.html`);
  assert.ok(html.includes('今天怎麼走'));
  assert.ok(html.includes('晚間準備'));
}
assert.ok(read('day-02.html').includes('非營業週日'));
assert.ok(read('day-08.html').includes('離開 EU'));
```

- [ ] **Step 2: Run focused tests and confirm RED**

Run: `npm test`
Expected: FAIL because daily operation sections are absent.

- [ ] **Step 3: Add verified addresses and navigation links**

Use known official/place addresses for airports, main stations and scheduled attractions. For hotels and unconfirmed restaurants, render `待住宿／分店確定後填入` and never invent an address.

- [ ] **Step 4: Render the operation sections**

Add a text-first address list, transport instructions, date-specific alerts, and four nightly checks: charge devices, save tickets, screenshot meeting point/platform, recheck weather/operations.

- [ ] **Step 5: Run focused tests and confirm GREEN**

Run: `npm test`
Expected: PASS.

### Task 5: 安全、時效與內容完整性防護

**Files:**
- Modify: `tests/build.test.mjs`
- Modify: `src/data/travel-database.js`
- Modify: `src/templates/database.mjs`

**Interfaces:**
- Validates all database and page contracts from Tasks 1–4.

- [ ] **Step 1: Add invariant tests**

```js
for (const item of databaseEntries) {
  assert.ok(statusLabels[item.status]);
  if (item.status === 'verified') assert.match(item.sourceUrl, /^https:\/\//);
  assert.match(item.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
}
const rendered = expectedFiles.map(read).join('\n');
assert.ok(!rendered.includes('Al. Jerozolimskie 179'));
for (const secretLabel of ['護照號：', '完整卡號：', '保單號：']) assert.ok(!rendered.includes(secretLabel));
```

- [ ] **Step 2: Run tests and fix any failing content contracts**

Run: `npm test`
Expected: PASS, 0 failures.

- [ ] **Step 3: Run repository verification**

Run: `env -u NODE_OPTIONS ./verify.sh`
Expected: final line `✅ POLSKA 新版靜態網站自動驗收完成`.

### Task 6: 文件與真實瀏覽器驗收

**Files:**
- Modify: `docs/research/2026-08-08-free-travel-gaps.md` only if implementation facts require correction
- Create: `docs/verification/2026-08-08-free-travel-database-results.md`

**Interfaces:**
- Produces a handoff recording exact commands, results, reviewed pages and dynamic pending items.

- [ ] **Step 1: Run static hygiene checks**

Run: `git diff --check`
Expected: no output.

- [ ] **Step 2: Start local preview and inspect desktop pages**

Open `index.html`, `practical/database.html`, `day-02.html`, `day-07.html`, `practical/essentials.html`, and `practical/booking.html`. Confirm headings, status labels, source links, `tel:` links, no page-level horizontal overflow, and no console errors.

- [ ] **Step 3: Inspect 390 px viewport**

Open homepage, database, and one day page at 390×844. Confirm no page-level horizontal overflow and SOS content is readable without interacting with a map.

- [ ] **Step 4: Save verification evidence**

Record build count, test count, browser pages, viewport results, console results and remaining `pending/private-required` items in the verification document.

- [ ] **Step 5: Final diff review**

Run: `git status --short` and `git diff --stat`. Confirm `.agents/`, `.claude/`, and `skills-lock.json` remain untouched and unstaged.


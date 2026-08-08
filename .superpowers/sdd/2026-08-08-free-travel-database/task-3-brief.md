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

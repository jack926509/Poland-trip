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


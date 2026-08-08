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

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
  assert.deepEqual(JSON.parse(JSON.stringify(got)), { a: 1 });
  got.a = 999;
  assert.equal(fb.a, 1, 'fallback 不可被外部改動污染');
});

test('readJSON 在 JSON 壞掉時回 fallback', () => {
  const s = { getItem() { return '{bad'; } };
  assert.deepEqual(JSON.parse(JSON.stringify(core.readJSON(s, 'k', []))), []);
});

test('writeJSON 在 storage 壞掉時回 false 不拋錯', () => {
  const broken = { setItem() { throw new Error('blocked'); } };
  assert.equal(core.writeJSON(broken, 'k', { a: 1 }), false);
});

test('writeJSON 正常寫入回 true 並可回讀', () => {
  const bag = {};
  const s = { getItem: (k) => (k in bag ? bag[k] : null), setItem: (k, v) => { bag[k] = v; } };
  assert.equal(core.writeJSON(s, 'polska.settings.v1', { fxRate: 8 }), true);
  assert.deepEqual(JSON.parse(JSON.stringify(core.readJSON(s, 'polska.settings.v1', null))), { fxRate: 8 });
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
  assert.deepEqual(JSON.parse(JSON.stringify(t.byCategory)), { food: 80, ticket: 120, transport: 0, shop: 0 });
});

test('expenseTotals 空陣列全 0', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(core.expenseTotals([]))), {
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
  assert.deepEqual(JSON.parse(JSON.stringify(core.DEFAULT_SETTINGS)), { fxRate: 7.7, budgetTWD: 21600 });
  assert.deepEqual(JSON.parse(JSON.stringify(core.EXPENSE_CATEGORIES.map((c) => c.key))), ['food', 'ticket', 'transport', 'shop']);
  assert.deepEqual(JSON.parse(JSON.stringify(core.EXPENSE_CATEGORIES.map((c) => c.label))), ['餐飲', '門票', '交通', '購物']);
});

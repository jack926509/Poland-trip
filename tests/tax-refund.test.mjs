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

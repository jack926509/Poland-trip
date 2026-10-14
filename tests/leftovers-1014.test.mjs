import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { renderBookingStatusCard } from '../src/templates/practical.mjs';
import { markOverdueRechecks } from '../src/scripts/dashboard.js';

const deadlines = [{ id: 'etias-x', date: '2026-10-20', title: 'ETIAS 重查', status: '需重查' }];
const flagOf = html => html.match(/<li data-deadline-id="etias-x"[^>]*>[\s\S]*?<\/li>/)[0];
const hiddenAt = today => /data-recheck-flag hidden/.test(flagOf(renderBookingStatusCard([], deadlines, today)));

test('訂票頁「待辦頁以外」：建置時依日期標逾期（未到期／當天不標、過期才標）', () => {
  assert.equal(hiddenAt('2026-10-19'), true, '未到期不該標逾期');
  assert.equal(hiddenAt('2026-10-20'), true, '當天不算逾期');
  assert.equal(hiddenAt('2026-10-21'), false, '過期應標逾期');
  assert.match(flagOf(renderBookingStatusCard([], deadlines, '2026-10-21')), /data-recheck-at="2026-10-20" data-recheck-open="true"/);
});

test('訂票頁「待辦頁以外」：瀏覽器端沿用 markOverdueRechecks，注入日期三種狀態', () => {
  const run = today => {
    const flag = { hidden: true };
    const el = {
      attrs: { 'data-recheck-at': '2026-10-20', 'data-recheck-open': 'true' },
      getAttribute(k) { return this.attrs[k]; },
      toggleAttribute() {},
      querySelector: () => flag,
    };
    const root = { querySelectorAll: () => [el] };
    const prev = { setInterval: globalThis.setInterval, window: globalThis.window, document: globalThis.document };
    globalThis.setInterval = () => 0;
    globalThis.window = { addEventListener() {} };
    globalThis.document = { addEventListener() {}, hidden: false };
    try { markOverdueRechecks(root, () => today); } finally { Object.assign(globalThis, prev); }
    return flag.hidden;
  };
  assert.equal(run('2026-10-19'), true);
  assert.equal(run('2026-10-20'), true);
  assert.equal(run('2026-10-21'), false);
});

test('今日頁：每個指向 #today-* 的連結在同頁都有對應 id，且 id 不重複', () => {
  const html = fs.readFileSync('dist/today.html', 'utf8');
  const targets = [...html.matchAll(/href="#(today-[\w-]+)"/g)].map(m => m[1]);
  assert.ok(targets.includes('today-food'), '應至少有一個指向 #today-food 的連結');
  for (const id of new Set(targets)) {
    assert.equal((html.match(new RegExp(`\\sid="${id}"`, 'g')) || []).length, 1, `#${id} 應恰有一個 id`);
  }
  assert.match(html, /id="today-schedule"/);
});

test('單檔版：每日頁快捷列在桌機不用負邊距外推，避免比視窗寬', () => {
  const html = fs.readFileSync('dist/poland-travel-guide-2026.html', 'utf8');
  assert.match(html, /\.standalone-page > \.day-shortcuts \{ margin-inline: 0; \}/);
});

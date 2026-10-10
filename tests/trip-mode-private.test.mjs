import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

import * as trip from '../src/data/trip.js';
import { privateSlots } from '../src/data/private-slots.js';
import { renderPrivatePanel } from '../src/templates/private-panel.mjs';
import { initializeCountdown, hideDeadlineOnTrip } from '../src/scripts/dashboard.js';
import { privateTelHref as telHref } from '../src/scripts/private-data.js';

const dist = new URL('../dist/', import.meta.url);
const read = file => fs.readFileSync(new URL(file, dist), 'utf8');

function fakeRow(date) {
  const attrs = { 'data-countdown-date': date, 'data-countdown-open': 'true' };
  const label = { textContent: '' };
  const category = { attrs: {}, getAttribute: k => (k === 'data-countdown-class' ? 'tag-red' : null), setAttribute(k, v) { this.attrs[k] = v; } };
  const tag = { textContent: '', getAttribute: () => '已逾期' };
  return {
    attrs, label, category, tag,
    getAttribute: k => attrs[k],
    setAttribute: (k, v) => { attrs[k] = v; },
    querySelector: s => ({ '[data-countdown-label]': label, '[data-countdown-category]': category, '[data-countdown-tag]': tag }[s] || null),
  };
}

function runCountdown(today, date = '2026-09-20', open = true) {
  const row = fakeRow(date);
  row.attrs['data-countdown-open'] = String(open);
  const root = { querySelector: () => null, querySelectorAll: () => [row] };
  const timers = [];
  globalThis.window = { addEventListener() {} };
  globalThis.document = { addEventListener() {}, hidden: false };
  const realSet = globalThis.setInterval;
  globalThis.setInterval = () => 0;
  try { initializeCountdown(root, () => today, trip.meta.tripStart); } finally { globalThis.setInterval = realSet; }
  return row;
}

test('出發前（10/23）倒數表仍顯示紅色已逾期', () => {
  const row = runCountdown('2026-10-23');
  assert.equal(row.attrs['data-urgency'], 'overdue');
  assert.match(row.label.textContent, /逾期 33 天/);
  assert.equal(row.category.attrs.class, 'tag-red');
});

test('旅途中到期的未完成車票核對保持待確認，當日與未到期項目不被覆蓋', () => {
  const expired = runCountdown('2026-10-25', '2026-10-24');
  assert.equal(expired.label.textContent, '仍待確認');
  assert.equal(expired.attrs['data-countdown-open'], 'true');
  assert.equal(expired.tag.textContent, '仍待確認，請完成查核');
  assert.equal(runCountdown('2026-10-24', '2026-10-24').label.textContent, '就是今天');
  assert.equal(runCountdown('2026-10-24', '2026-10-31').label.textContent, 'T-7');
});

test('旅途開始後已完成事項仍為已完成，無期限事項仍為無日期', () => {
  const done = runCountdown('2026-10-25', '2026-10-24', false);
  assert.equal(done.label.textContent, '已完成');
  assert.equal(done.attrs['data-urgency'], 'done');
  const undated = runCountdown('2026-10-25', '');
  assert.equal(undated.label.textContent, '無日期');
  assert.equal(undated.attrs['data-urgency'], 'undated');
});

test('10/24 起未完成的逾期事項仍待確認，旅程結束也不視為完成', () => {
  for (const today of ['2026-10-24', '2026-10-28', '2026-11-02']) {
    const row = runCountdown(today);
    assert.equal(row.attrs['data-urgency'], 'trip', today);
    assert.equal(row.label.textContent, '仍待確認');
    assert.equal(row.category.attrs.class, 'tag-muted');
    assert.doesNotMatch(row.tag.textContent, /逾期/);
    assert.equal(row.tag.textContent, '仍待確認，請完成查核');
  }
});

test('首頁下一個期限提示：出發前顯示、10/24 起隱藏', () => {
  const el = { hidden: false };
  const root = { querySelectorAll: () => [el] };
  globalThis.window = { addEventListener() {} };
  globalThis.document = { addEventListener() {}, hidden: false };
  const realSet = globalThis.setInterval; globalThis.setInterval = () => 0;
  try {
    hideDeadlineOnTrip(root, () => '2026-10-23', trip.meta.tripStart);
    assert.equal(el.hidden, false);
    hideDeadlineOnTrip(root, () => '2026-10-24', trip.meta.tripStart);
    assert.equal(el.hidden, true);
  } finally { globalThis.setInterval = realSet; }
  assert.match(read('index.html'), /class="next-deadline" data-next-deadline/);
  assert.match(read('practical/booking.html'), /initializeCountdown\(root, taipeiToday, "2026-10-24"\)/);
});

test('4 間住宿都有官方電話與來源，並在住宿、SOS、今日卡輸出 tel: 連結', () => {
  assert.ok(trip.stay.length >= 4);
  for (const item of trip.stay) {
    assert.match(item.phone, /^\+48 [\d ]+$/, item.id);
    assert.match(item.phoneSource.url, /^https:\/\//);
    assert.equal(item.phoneSource.checkedAt, '2026-10-06');
    assert.doesNotMatch(item.phoneSource.url, /booking\.com|agoda|expedia|hotels\.com|tripadvisor/);
  }
  const booking = read('practical/booking.html');
  const database = read('practical/database.html');
  const today = read('today.html');
  for (const digits of ['+48223253100', '+48123552950', '+48717966200', '+48531000209']) {
    assert.ok(booking.includes(`href="tel:${digits}"`), `住宿頁缺 ${digits}`);
    assert.ok(database.includes(`href="tel:${digits}"`), `SOS 缺 ${digits}`);
    assert.ok(today.includes(`href="tel:${digits}"`), `今日卡缺 ${digits}`);
  }
});

test('每個已訂妥的當日預約都有票券欄位，今日卡在行程旁邊輸出而不是只在摺疊區', () => {
  const today = read('today.html');
  for (const day of trip.days) {
    const confirmed = (day.mustBook || []).filter(item => /已訂妥|已購票/.test(item) && !/尚未|未購票/.test(item)).length;
    const slots = privateSlots.filter(slot => slot.day === day.n && slot.kind !== 'flight').length;
    assert.ok(slots >= confirmed, `Day ${day.n} 有 ${confirmed} 筆已訂妥項目但只有 ${slots} 個票券欄位`);
  }
  assert.ok(privateSlots.some(slot => slot.id === 'auschwitz-guide' && slot.day === 3));
  assert.ok(today.includes('data-today-tickets'));
  const block = today.slice(today.indexOf('data-today-tickets'));
  assert.ok(block.indexOf('data-private-slot="auschwitz-guide"') > -1);
  assert.ok(today.indexOf('data-today-tickets') < today.indexOf('data-today-schedule'), '票券區應在摺疊區之前');
});

test('私人資料不會出現在任何建置產物：欄位全空、沒有 value 屬性、不含填寫內容', () => {
  const panel = renderPrivatePanel();
  assert.ok(panel.includes('data-private-panel'));
  assert.doesNotMatch(panel, /<input[^>]*\svalue=/, '輸入欄位不能預先帶 value');
  assert.match(panel, /只存在這支手機的這個瀏覽器/);
  assert.match(panel, /換手機[^。]*消失/);
  const SENTINEL = ['ZZPOLICY', '998877'].join('-');
  const targets = [];
  const walk = dir => { for (const entry of fs.readdirSync(dir, { withFileTypes: true })) { const full = path.join(dir, entry.name); if (entry.isDirectory()) walk(full); else if (/\.(html|json|js|css)$/.test(entry.name)) targets.push(full); } };
  walk(fileURLToPath(dist));
  targets.push(fileURLToPath(new URL('../poland-travel-guide-2026.html', import.meta.url)));
  for (const file of targets) assert.ok(!fs.readFileSync(file, 'utf8').includes(SENTINEL), file);
  // 搜尋索引不含欄位輸入值，也不含任何 localStorage 內容。
  assert.ok(!fs.readFileSync(new URL('assets/search-index.json', dist), 'utf8').includes('polska-private'));
});

test('私人資料腳本：localStorage 失敗時不丟例外；電話只在有效時變成 tel: 連結', () => {
  assert.equal(telHref('+886 2 1234-5678'), 'tel:+886212345678');
  assert.equal(telHref('abc'), '');
  assert.equal(telHref(''), '');
  const html = read('today.html');
  assert.ok(html.includes('polska-private-v1'));
  assert.ok(!/localStorage\.setItem\([^)]*['"]ZZ/.test(html));
  const source = fs.readFileSync(new URL('../src/scripts/private-data.js', import.meta.url), 'utf8');
  for (const name of ['privateRead', 'privateWrite', 'privateClear']) {
    const body = source.slice(source.indexOf(`function ${name}`));
    assert.match(body.slice(0, body.indexOf('\n}\n')), /try \{[\s\S]*\} catch/, `${name} 沒有 try/catch`);
  }
  // 沒有 localStorage 的環境：讀回空物件、寫入回 false。
  const ctx = vm.createContext({});
  const fns = ['privateRead', 'privateWrite'].map(n => source.slice(source.indexOf(`export function ${n}`)).replace('export ', '').split('\n}\n')[0] + '\n}\n').join('\n');
  vm.runInContext(`${fns}; this.r = privateRead(); this.w = privateWrite({a:1});`, ctx);
  assert.deepEqual({ ...ctx.r }, {});
  assert.equal(ctx.w, false);
});

test('旅途精簡版：today.js 只在旅途期間加 today-compact；SOS 保留在日卡之前', () => {
  const today = read('today.html');
  assert.ok(today.indexOf('data-today-sos') < today.indexOf('data-today-cards'));
  assert.match(today, /today-sos-compact-only/);
  const css = fs.readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
  assert.match(css, /\.today-compact \.today-head-dek/);
});

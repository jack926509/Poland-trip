import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { initializeToday } from '../src/scripts/today.js';

// 2026-10-22 審查 M10：香港轉機跨過台北午夜（10/25 01:25 QR 815）時，華沙仍是 10/24，
// 狀態列與選卡不能退回 10/24。
class Node {
  constructor(attrs = {}) { this.attrs = attrs; this.nodes = {}; this.lists = {}; this.hidden = false; this.textContent = ''; this.classList = { add() {}, toggle() {} }; }
  getAttribute(key) { return this.attrs[key]; }
  setAttribute(key, value) { this.attrs[key] = value; }
  removeAttribute(key) { delete this.attrs[key]; }
  addEventListener() {}
  querySelector(selector) { return this.nodes[selector] || null; }
  querySelectorAll(selector) { return this.lists[selector] || []; }
  closest() { return null; }
}

function run(iso) {
  const root = new Node();
  const cards = [['2026-10-24', 'Asia/Taipei'], ['2026-10-25', 'Europe/Warsaw']].map(([date, zone]) => new Node({ 'data-today-date': date, 'data-time-zone': zone }));
  root.lists['[data-today-card]'] = cards;
  const status = new Node();
  root.nodes['[data-today-status]'] = status;
  for (const key of ['today-outside', 'today-outside-note', 'date-picker', 'date-prev', 'date-next', 'date-reset']) root.nodes[`[data-${key}]`] = new Node();
  const original = { window: globalThis.window, document: globalThis.document, setInterval: globalThis.setInterval };
  globalThis.window = { addEventListener() {} };
  globalThis.document = { addEventListener() {}, hidden: false };
  globalThis.setInterval = () => 0;
  try { initializeToday(root, () => new Date(iso)); } finally { Object.assign(globalThis, original); }
  return { cards, status };
}

test('台北 2026-10-25 01:30（華沙仍是 10/24）狀態列顯示 10/25、選到 Day 2', () => {
  const { cards, status } = run('2026-10-24T17:30:00Z');
  assert.match(status.textContent, /台北時間 2026-10-25/);
  assert.doesNotMatch(status.textContent, /2026-10-24/);
  assert.deepEqual(cards.map(card => card.hidden), [true, false]);
});

test('台北 2026-10-24 23:30 仍是 Day 1', () => {
  const { cards, status } = run('2026-10-24T15:30:00Z');
  assert.match(status.textContent, /台北時間 2026-10-24/);
  assert.deepEqual(cards.map(card => card.hidden), [false, true]);
});

test('Day 1 晚上的「明天第一件事」包含 01:25 QR 815，不跳到 13:10', () => {
  const html = fs.readFileSync('dist/today.html', 'utf8');
  const day1 = html.split('data-today-date="2026-10-24"')[1].split('data-today-date="2026-10-25"')[0];
  const block = day1.split('data-today-tomorrow')[1];
  assert.match(block.slice(0, 600), /01:25/);
  assert.match(block.slice(0, 600), /QR 815/);
});

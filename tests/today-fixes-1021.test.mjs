import test from 'node:test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { initializeToday } from '../src/scripts/today.js';

class Node {
  constructor(attrs = {}, text = '') { this.attrs = attrs; this.events = {}; this.nodes = {}; this.lists = {}; this.hidden = false; this.textContent = text; this.classList = { add() {}, toggle() {} }; }
  getAttribute(key) { return this.attrs[key]; }
  setAttribute(key, value) { this.attrs[key] = value; }
  addEventListener(name, fn) { this.events[name] = fn; }
  querySelector(selector) { return this.nodes[selector] || null; }
  querySelectorAll(selector) { return this.lists[selector] || []; }
  closest() { return null; }
}

function setup(date, flightMinute) {
  const root = new Node();
  const card = new Node({ 'data-today-date': date, ...(flightMinute ? { 'data-flight-minute': String(flightMinute) } : {}) });
  card.lists['[data-next-step]'] = [600, 1000].map(n => new Node({ 'data-plan-minute': String(n) }));
  const full = new Node({}, '看今天完整行程 →');
  card.nodes['[data-today-full]'] = full;
  const pre = new Node(), post = new Node(), night = new Node();
  post.hidden = true;
  card.lists['[data-leaving-pre],[data-night-link],[data-evening-full]'] = [pre, night];
  card.lists['[data-leaving-post]'] = [post];
  root.lists['[data-today-card]'] = [card];
  for (const key of ['today-status', 'today-outside', 'today-outside-note', 'date-picker', 'date-prev', 'date-next', 'date-reset']) root.nodes[`[data-${key}]`] = new Node();
  return { root, card, full, pre, post, night };
}

function run(env, iso) {
  const original = { window: globalThis.window, document: globalThis.document, setInterval: globalThis.setInterval };
  globalThis.window = { addEventListener() {} };
  globalThis.document = { addEventListener() {}, hidden: false };
  globalThis.setInterval = () => 0;
  try { initializeToday(env.root, () => new Date(iso)); }
  finally { Object.assign(globalThis, original); }
}

// 最後一步 1000 分（16:40），寬限 60 分 → 17:40 之後才切晚上
test('晚上模式寬限：1030 分（17:10）仍白天，1070 分（17:50）切晚上', () => {
  const day = setup('2026-10-26'); run(day, '2026-10-26T16:10:00Z'); // 華沙 UTC+1 → 17:10
  assert.equal(day.card.attrs['data-today-phase'], 'day');
  const eve = setup('2026-10-26'); run(eve, '2026-10-26T16:50:00Z'); // 17:50
  assert.equal(eve.card.attrs['data-today-phase'], 'evening');
});

test('離境日航班起飛後：隱藏離境提醒與晚間準備，顯示結束語', () => {
  const before = setup('2026-10-31', 880); run(before, '2026-10-31T12:00:00Z'); // 13:00
  assert.equal(before.post.hidden, true);
  assert.equal(before.pre.hidden, false);
  const after = setup('2026-10-31', 880); run(after, '2026-10-31T15:00:00Z'); // 16:00
  assert.equal(after.post.hidden, false);
  assert.equal(after.pre.hidden, true);
  assert.equal(after.night.hidden, true);
  assert.equal(after.card.attrs['data-today-phase'], 'evening');
});

test('主按鈕：預覽別天時寫出 Day N，看今天時維持原字', () => {
  const outside = setup('2026-10-31'); run(outside, '2026-11-01T10:00:00Z');
  assert.equal(outside.full.textContent, '看 Day 1 行程 →');
  const live = setup('2026-10-26'); run(live, '2026-10-26T10:00:00Z');
  assert.equal(live.full.textContent, '看今天完整行程 →');
});

test('每日頁第一句結尾不殘留「；」「，」「、」，且超市頁保留「不一定有」語意', () => {
  let total = 0;
  for (let n = 1; n <= 8; n++) {
    const html = fs.readFileSync(`dist/day-0${n}.html`, 'utf8');
    for (const m of html.matchAll(/<br><span class="timeline-note">([\s\S]*?)<\/span>(<details class="step-more">)?/g)) {
      if (m[2] && /[；，、]\s*$/.test(m[1])) total += 1;
    }
  }
  assert.equal(total, 0);
  const groceries = fs.readFileSync('dist/practical/groceries.html', 'utf8');
  assert.ok(groceries.includes('無肉版本不一定有，要先問門市'));
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import { calculateDashboard, dashboardCsv, getTaipeiToday, isOpenTodoStatus, toComparableDate } from '../src/scripts/dashboard.js';
import { renderTodos } from '../src/templates/practical.mjs';
import { todoGroups } from '../src/data/trip.js';

test('台灣午夜前後重新計算統計，無效日期不視為到期', () => {
  const input = {
    metrics: {}, syncRows: [], syncDates: ['2026-09-07'], privateDueDates: ['2026-09-07'],
    alertCandidates: [
      { type: 'todo-overdue', date: '9/7' },
      { type: 'entry-overdue', date: '2026-02-30' },
    ],
  };
  const before = calculateDashboard(input, new Date('2026-09-07T15:59:59Z'));
  const after = calculateDashboard(input, new Date('2026-09-07T16:00:00Z'));
  assert.equal(before.generatedAt, '2026-09-07');
  assert.equal(before.metrics.todaySyncCount, 1);
  assert.equal(before.metrics.overdue, 0);
  assert.equal(after.generatedAt, '2026-09-08');
  assert.equal(after.metrics.todaySyncCount, 0);
  assert.equal(after.metrics.overdue, 2);
  assert.equal(after.handoverAlerts.length, 1);
  assert.equal(toComparableDate('2026-02-30'), null);
  assert.equal(toComparableDate('2/29'), null);
  assert.equal(getTaipeiToday(new Date('2026-12-31T16:00:00Z')), '2027-01-01');
});

test('CSV 使用真實換行並保留中文、逗號、引號和多行欄位', () => {
  const csv = dashboardCsv({
    metrics: { latestSyncDate: '2026-09-07' },
    handoverAlerts: [{ type: 'todo-overdue', name: '車票,"雙人"', date: '9/7', status: '待"確認', action: '第一行\n第二行' }],
    syncRows: [{ id: 'rail', status: 'pending', checkedAt: '2026-09-07', summary: '確認,班次', offlineNote: 'PDF' }],
  });
  assert.ok(csv.startsWith('\uFEFF"類型","關鍵字","日期","狀態","說明"\r\n'));
  assert.ok(csv.includes('"todo-overdue","車票,""雙人""","9/7","待""確認","第一行\n第二行"\r\n'));
  assert.ok(csv.endsWith('"rail","pending","2026-09-07","確認,班次","PDF"\r\n'));
  assert.ok(!csv.includes('\\n'));
});

function dashboardFixture(html, standalone) {
  const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
    .map(match => match[1]).find(script => script.includes('initializeDashboard(root,'));
  assert.ok(script, 'built page contains dashboard runtime');
  let now = '2026-10-25T15:59:59Z';
  const elements = new Map();
  const timers = [];
  const events = new Map();
  const downloads = [];
  const blobs = new Map();
  const root = { querySelector(selector) {
    if (!elements.has(selector)) elements.set(selector, { textContent: '', addEventListener(type, callback) { this[type] = callback; } });
    return elements.get(selector);
  } };
  const document = {
    ...root,
    currentScript: { closest: () => standalone ? root : null },
    addEventListener: (type, callback) => events.set(type, callback),
    body: { appendChild() {} },
    createElement: () => ({ style: {}, remove() {}, click() { downloads.push({ name: this.download, blob: blobs.get(this.href) }); } }),
  };
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } }
  vm.runInNewContext(script, {
    Date: Clock, Intl, Blob, document,
    window: { addEventListener: (type, callback) => events.set(type, callback) },
    setInterval: callback => timers.push(callback), setTimeout() {},
    URL: { createObjectURL(blob) { const key = `blob:${blobs.size}`; blobs.set(key, blob); return key; }, revokeObjectURL() {} },
  });
  return { elements, timers, events, downloads, setNow(value) { now = value; } };
}


test('可查購仍未完成，未記錄查核日期不冒用建置日期', () => {
  assert.equal(isOpenTodoStatus('現可查／購'), true);
  assert.equal(isOpenTodoStatus('已訂妥'), false);
  assert.equal(isOpenTodoStatus('已完成'), false);
  assert.equal(isOpenTodoStatus('已購票'), false);
  const html = renderTodos({ todoGroups });
  assert.ok(html.includes('訂票狀態不是即時庫存'));
  assert.ok(!html.includes('最近人工查核'), '2026-10-20 起不顯示查核日期');
  // 2026-10-21 加聖安妮教堂觀景台：12 → 13 項待辦、21 → 22 項。
  // 2026-10-22 出發前準備完成三項：13 → 10 項待辦；餐廳不訂位、不傳訊息、聖安妮複查後：10 → 1。
  assert.ok(html.includes('3 項待辦'));
  assert.ok(html.includes('共 22 項'));
  // Auschwitz 導覽與巴士、四段火車、10/10 查過的餐廳，
  // 以及 10/12 複查的 Mr. Jerry、Arirang、Rusiko 時段均已有人工核對日期；
  // 2026-10-14 新增的選配午餐與出發前準備兩筆也記了查核日。
  // 2026-10-13 旅客逐項確認 15 項未完成項目仍未訂，原本沒有查核日的 Wawel、辛德勒、鹽礦也有了日期。
  assert.equal((html.match(/未記錄，請重查/g) || []).length, 0);
  const dated = renderTodos({ todoGroups: [{ id: 'test', items: [{ date: '10/25', name: '車票', checkedAt: '2026-09-06', recheckAt: '2026-09-24', status: '需重查', action: '查詢' }] }] });
  assert.ok(!dated.includes('2026-09-06') && !dated.includes('下次查核'), '查核日期不顯示');
});

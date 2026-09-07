import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { test } from 'node:test';
import { calculateDashboard, dashboardCsv, getTaipeiToday, isOpenTodoStatus, toComparableDate } from '../src/scripts/dashboard.js';
import { renderOpsDashboard, renderTodos } from '../src/templates/practical.mjs';
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

for (const [file, standalone] of [['dist/practical/ops-dashboard.html', false], ['dist/poland-travel-guide-2026.html', true]]) {
  test(`${file} 跨日、切回與點擊匯出都使用當下日期`, async () => {
    const fixture = dashboardFixture(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), standalone);
    const text = selector => fixture.elements.get(selector).textContent;
    assert.equal(text('[data-dashboard-today]'), '2026-10-25');
    const before = Number.parseInt(text('[data-dashboard-overdue]'));
    fixture.setNow('2026-10-25T16:00:00Z');
    fixture.timers[0]();
    assert.equal(text('[data-dashboard-today]'), '2026-10-26');
    assert.ok(Number.parseInt(text('[data-dashboard-overdue]')) > before);
    fixture.setNow('2026-10-26T16:00:00Z');
    fixture.events.get('pageshow')();
    assert.equal(text('[data-dashboard-today]'), '2026-10-27');
    fixture.setNow('2026-10-27T16:00:00Z');
    fixture.elements.get('[data-handover-export="json"]').click();
    fixture.elements.get('[data-handover-export="csv"]').click();
    const [json, csv] = fixture.downloads;
    assert.equal(json.name, 'handover-2026-10-28.json');
    assert.equal(csv.name, 'handover-2026-10-28.csv');
    const result = JSON.parse(await json.blob.text());
    assert.equal(result.generatedAt, '2026-10-28');
    assert.equal(result.metrics.overdue, Number.parseInt(text('[data-dashboard-overdue]')));
    assert.ok((await csv.blob.text()).includes('\r\n'));
    assert.ok(!(await csv.blob.text()).includes('\\n'));
  });
}

test('未到期私人紀錄也不會因瀏覽器跨日計算而洩漏', () => {
  const html = renderOpsDashboard({
    entries: [{ id: 'private-id', title: '私人內容不可匯出', summary: '私人摘要不可匯出', private: true, status: 'pending', recheckAt: '2026-12-31' }],
    statusLabels: {}, syncRows: [], todoGroups: [],
  });
  assert.ok(!html.includes('私人內容不可匯出'));
  assert.ok(!html.includes('私人摘要不可匯出'));
  assert.ok(!html.includes('private-id'));
});

test('可查購仍未完成，未記錄查核日期不冒用建置日期', () => {
  assert.equal(isOpenTodoStatus('現可查／購'), true);
  assert.equal(isOpenTodoStatus('已訂妥'), false);
  assert.equal(isOpenTodoStatus('已完成'), false);
  const html = renderTodos({ todoGroups });
  assert.ok(html.includes('未連線查詢即時庫存'));
  assert.ok(html.includes('最近人工查核'));
  assert.equal((html.match(/未記錄，請重查/g) || []).length, 16);
  const dated = renderTodos({ todoGroups: [{ id: 'test', items: [{ date: '10/25', name: '車票', checkedAt: '2026-09-06', recheckAt: '2026-09-24', status: '需重查', action: '查詢' }] }] });
  assert.ok(dated.includes('datetime="2026-09-06"'));
  assert.ok(dated.includes('下次查核：<time datetime="2026-09-24"'));
});

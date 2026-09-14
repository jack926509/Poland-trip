import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import * as trip from '../src/data/trip.js';
import * as essentials from '../src/data/essentials.js';
import { dayDining } from '../src/data/day-dining.js';
import { renderToday } from '../src/templates/today.mjs';
import { selectToday, statusText, dayGap } from '../src/scripts/today.js';

const DATES = ['2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31'];

test('selectToday 在旅程中回傳正確的第幾天', () => {
  assert.deepEqual(selectToday(DATES, '2026-10-24'), { mode: 'during', index: 0, date: '2026-10-24' });
  assert.deepEqual(selectToday(DATES, '2026-10-28'), { mode: 'during', index: 4, date: '2026-10-28' });
  assert.deepEqual(selectToday(DATES, '2026-10-31'), { mode: 'during', index: 7, date: '2026-10-31' });
});

test('旅程前後都要有內容，不是空白頁', () => {
  const before = selectToday(DATES, '2026-09-14');
  assert.equal(before.mode, 'before');
  assert.equal(before.daysUntil, 40);
  assert.match(statusText(before, 8), /距離出發還有 40 天/);

  const after = selectToday(DATES, '2026-11-03');
  assert.equal(after.mode, 'after');
  assert.equal(after.daysSince, 3);
  assert.match(statusText(after, 8), /旅程已於 3 天前結束/);

  assert.equal(selectToday([], '2026-09-14').mode, 'empty');
});

test('dayGap 跨越冬令時轉換仍為整數天', () => {
  assert.equal(dayGap('2026-10-24', '2026-10-26'), 2);
  assert.equal(dayGap('2026-10-24', '2026-10-31'), 7);
});

function renderPage() {
  return renderToday({
    meta: trip.meta, days: trip.days, stay: trip.stay,
    dayDining, daylight: essentials.daylight, safety: essentials.safety,
  });
}

test('八天全部靜態渲染，無 JavaScript 也讀得到內容', () => {
  const html = renderPage();
  for (const date of DATES) {
    assert.ok(html.includes(`data-today-date="${date}"`), `缺少 ${date} 的卡片`);
  }
  assert.equal((html.match(/data-today-card data-today-date=/g) || []).length, 8);
  assert.match(html, /JavaScript 未啟用時無法自動選日/);
  // 沒有 JavaScript 時八張卡必須全部看得到，不能預先 hidden。
  assert.doesNotMatch(html, /data-today-card[^>]*\shidden/);
});

test('今日卡帶上住宿波蘭文地址、緊急電話與當日日照', () => {
  const html = renderPage();
  assert.ok(html.includes('ul. Marszałkowska 99a, 00-693 Warszawa'), '缺少可出示給司機的波蘭文地址');
  assert.ok(html.includes('Towarowa 37/201, 61-896 Poznań'), '缺少波茲南公寓地址');
  assert.ok(html.includes('112'), '缺少歐洲通用緊急號碼');
  assert.ok(html.includes('16:34'), '缺少 Day 5 的日落時間');
});

test('不使用寫死的 id 選取器，單檔版加前綴後才不會失效', () => {
  const html = renderPage();
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
  assert.doesNotMatch(script, /getElementById|querySelector\(\s*['"]#/);
  assert.match(script, /data-today-card/);
});

test('內嵌腳本在 DOM 中真的選出當天那張卡', () => {
  const html = renderPage();
  const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];

  const cards = DATES.map(date => ({ date, hidden: false, getAttribute: () => date }));
  const status = { textContent: '' };
  const outside = { hidden: false };
  const outsideNote = { textContent: '' };
  const root = {
    querySelectorAll: selector => (selector === '[data-today-card]' ? cards : []),
    querySelector: selector => ({
      '[data-today-status]': status,
      '[data-today-outside]': outside,
      '[data-today-outside-note]': outsideNote,
    }[selector] || null),
  };

  const context = {
    document: {
      currentScript: { closest: () => null },
      addEventListener() {},
      hidden: false,
    },
    window: { addEventListener() {} },
    setInterval() {},
    Intl,
    Date,
    Math,
    // 2026-10-28 20:00 UTC → 華沙仍是 10/28（CET）。
    __now: new Date('2026-10-28T20:00:00Z'),
  };
  context.document.currentScript.closest = () => null;
  vm.createContext(context);
  // 以受控的 root 與時間執行內嵌的 runtime。
  vm.runInContext(`${script.replace(/const root = [^;]+;/, 'const root = globalThis.__root;')
    .replace(/initializeToday\(root\);/, 'initializeToday(root, () => globalThis.__now);')}`, Object.assign(context, { __root: root }));

  const visible = cards.filter(card => !card.hidden);
  assert.equal(visible.length, 1, '應只顯示一張卡');
  assert.equal(visible[0].date, '2026-10-28');
  assert.match(status.textContent, /第 5 天/);
  assert.equal(outside.hidden, true, '旅程中不該顯示「還沒出發」區塊');
});

test('產出的 dist 與單檔版都含今日卡，且單檔版 id 已加前綴', () => {
  const dist = fs.readFileSync(new URL('../dist/today.html', import.meta.url), 'utf8');
  assert.match(dist, /data-today-card/);
  assert.match(dist, /id="main-content"/);

  const standalone = fs.readFileSync(new URL('../poland-travel-guide-2026.html', import.meta.url), 'utf8');
  assert.match(standalone, /id="page-today"/, '單檔版缺少今日卡章節');
  assert.match(standalone, /data-today-card/, '單檔版缺少今日卡內容');
});

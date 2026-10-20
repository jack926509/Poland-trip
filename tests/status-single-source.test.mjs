import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import * as trip from '../src/data/trip.js';
import { databaseEntries } from '../src/data/travel-database.js';
import { escapeHtml } from '../src/lib/html.mjs';
import { renderHome } from '../src/templates/home.mjs';
import { renderBooking, renderTodos, todoLinkLabel } from '../src/templates/practical.mjs';
import { resolveTodoRef, statusOfItems, lajkonikInboundWord, railGroupIntro } from '../src/lib/todo-status.mjs';
import { auschwitzBus, bindTodoGroups } from '../src/data/rail.js';
import { resolveHomeStatus, nextStepFor, departureLabel } from '../src/scripts/dashboard.js';

// 獨立於 lib/todo-status.mjs 的算法（測試自己的一份判斷），用來驗各頁數字都等於待辦正本。
const OPEN = /待|需|尚未|未|指定日|可查|可購/;
const isOpen = item => !item.skip && OPEN.test(item.status);
const items = trip.todoGroups.flatMap(group => group.items);
const expected = {
  total: items.length,
  open: items.filter(isOpen).length,
  skipped: items.filter(item => item.skip).length,
};
expected.done = expected.total - expected.open - expected.skipped;
const openByGroup = Object.fromEntries(trip.todoGroups.map(group => [group.id, group.items.filter(isOpen).length]));
const breakdown = trip.todoGroups.filter(group => openByGroup[group.id] > 0).map(group => `${group.title} ${openByGroup[group.id]}`).join('／');

const home = renderHome({ ...trip, cities: [], databaseEntries });
const booking = renderBooking(trip);
const todos = renderTodos(trip);

test('待辦正本本身有待辦、有已完成，測試才有鑑別力', () => {
  assert.ok(expected.open > 0 && expected.done > 0 && expected.skipped > 0);
});

test('每類 eyebrow 的「N 項」等於該類實際項目數', () => {
  for (const group of trip.todoGroups) {
    const match = /(\d+) 項/.exec(group.eyebrow);
    assert.ok(match, `${group.id} eyebrow 缺數字`);
    assert.equal(Number(match[1]), group.items.length, `${group.id} eyebrow 與項目數不符`);
  }
});

test('首頁狀態小卡的待辦數與分類計數等於正本', () => {
  assert.match(home, new RegExp(`<b data-home-open>${expected.open}</b> 項待辦`));
  const sub = /<span class="home-status-sub">(.*?)<\/span>\s*<span class="home-status-cta">/s.exec(home);
  assert.ok(sub, '找不到分類計數');
  assert.equal(sub[1].replace(/<[^>]+>/g, ''), breakdown, '分類計數不符');
  // 「分類＋數字」每組包成 nowrap，手機窄版數字才不會被擠到下一行。
  assert.equal((sub[1].match(/<span class="home-status-cat">/g) || []).length, trip.todoGroups.filter(g => openByGroup[g.id] > 0).length);
  const css = fs.readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
  assert.match(css, /\.home-status-cat\s*\{[^}]*white-space:\s*nowrap/);
  assert.match(home, /data-home-status="before"[^>]*href="practical\/todos\.html"/);
  assert.match(home, /看待辦 →/);
});

test('首頁其餘待辦數字（狀態列、區塊導言、各類卡片）等於正本', () => {
  // 2026-10-20 UX F15：與頁首狀態列重複的兩張統計卡（N 項待辦／已完成）已移除；
  // 待辦數改驗頁首狀態列，並確認統計卡不再出現。
  assert.ok(home.includes(`還有 <b data-home-open>${expected.open}</b> 項待辦`));
  assert.ok(home.includes(`共 ${expected.total} 項，還有 ${expected.open} 項待處理`));
  assert.ok(!home.includes('class="journal-status-strip"'));
  for (const group of trip.todoGroups) {
    const text = openByGroup[group.id] ? `${openByGroup[group.id]} 項待處理` : '已全部完成';
    assert.ok(home.includes(`${text}（共 ${group.items.length} 項）`), `${group.id} 卡片計數不符`);
  }
});

test('待辦頁數字等於正本', () => {
  assert.ok(todos.includes(`<span class="tag-todo">${expected.open} 項待辦</span><p>共 ${expected.total} 項`));
});

test('訂票頁精簡卡的待辦數與各類計數等於正本', () => {
  assert.match(booking, new RegExp(`data-todo-open="${expected.open}" data-todo-total="${expected.total}"`));
  assert.match(booking, new RegExp(`還沒處理 <b class="number" data-booking-open>${expected.open}</b> 項`));
  // 2026-10-20 改成逐項列出還沒買／還沒訂的項目，每筆連到待辦頁那一筆
  const card = booking.slice(booking.indexOf('id="countdown"'), booking.indexOf('</section>', booking.indexOf('id="countdown"')));
  const openItems = trip.todoGroups.flatMap(group => group.items.filter(isOpen));
  assert.equal((card.match(/<li><a href="todos\.html#/g) || []).length, openItems.length);
  for (const item of openItems) assert.ok(card.includes(escapeHtml(item.name)), `訂票頁缺少未完成項目 ${item.name}`);
  assert.ok(card.includes('Lajkonik 回程'));
});

test('訂票頁不再重述待辦：沒有倒數表、優先順序、時程表，也沒有逾期假警報', () => {
  assert.doesNotMatch(booking, /訂票優先順序|什麼時候處理|data-countdown-row|逾期 \d+ 天|訂票與查核倒數/);
  // 2026-10-20 四段火車已購，訂票頁拿掉網路購票教學
  assert.doesNotMatch(booking, /booking-howto/);
});

test('資料庫「景點票券」標題與摘要等於正本', () => {
  const group = trip.todoGroups.find(item => item.id === 'attractions');
  const open = group.items.filter(isOpen);
  const skipped = group.items.filter(item => item.skip);
  const done = group.items.length - open.length - skipped.length;
  const entry = databaseEntries.find(item => item.id === 'documents-attraction-tickets');
  assert.equal(entry.title, `景點票券：已訂 ${done} 項，其餘 ${group.items.length - done} 項（${open.length} 項待訂、${skipped.length} 項線上已售完）`);
  for (const item of group.items) assert.ok(entry.summary.includes(`${item.date} ${item.name}`), `摘要缺 ${item.name}`);
});

test('deadlines 的 status 一律由待辦正本推導，且所有引用都對得到項目', () => {
  const referenced = trip.deadlines.filter(deadline => deadline.todoRef);
  // 2026-10-14 新行程不進付費館，拿掉華沙兩館與全景畫兩筆期限：5 → 3。
  assert.ok(referenced.length >= 3);
  for (const deadline of referenced) {
    const refItems = resolveTodoRef(trip.todoGroups, deadline.todoRef);
    assert.equal(deadline.status, statusOfItems(refItems), `${deadline.id} 的 status 與待辦不符`);
    // 待辦全部完成時，倒數不該再把它當成未完成。
    if (refItems.every(item => !isOpen(item))) assert.doesNotMatch(deadline.status, OPEN, `${deadline.id} 已完成卻仍是未完成狀態`);
    else assert.ok(refItems.some(isOpen) && OPEN.test(deadline.status), `${deadline.id} 未完成卻看起來已完成`);
  }
  // 沒有 todoRef 的只能是不屬於訂票的項目（複查、證件）。
  for (const deadline of trip.deadlines.filter(item => !item.todoRef)) {
    assert.ok(['複查', '證件'].includes(deadline.category), `${deadline.id} 是訂票類卻沒有 todoRef`);
  }
});

test('火車資料的已購狀態與待辦正本一致', () => {
  const railTodos = trip.todoGroups.find(group => group.id === 'rail').items;
  for (const train of trip.trains) {
    if (String(train.id).startsWith('bus-')) {
      // 巴士（Lajkonik）去程已購、回程狀態跟著待辦「Lajkonik 回程」那一筆走。
      const inbound = railTodos.find(item => item.name.includes('Lajkonik 回程'));
      assert.ok(inbound, '待辦找不到 Lajkonik 回程');
      const word = isOpen(inbound) ? '尚未購票' : '已購票';
      assert.equal(train.status, `去程已購票／回程${word}`, 'Lajkonik 的 trains.status 與待辦不一致');
      assert.ok(train.dayLeg.endsWith(word), `dayLeg 與待辦不一致：${train.dayLeg}`);
      continue;
    }
    const todo = railTodos.find(item => item.name.toUpperCase().includes(train.type.toUpperCase()));
    assert.ok(todo, `待辦找不到 ${train.type}`);
    assert.equal(isOpen(todo), train.status !== '已購票', `${train.type} 的 trains.status 與待辦不一致`);
  }
});

test('待辦連結按鈕說實話：地圖叫地圖、評論叫店家頁，只有訂位網址才叫訂位', () => {
  for (const group of trip.todoGroups) {
    for (const item of group.items.filter(entry => entry.url)) {
      const label = todoLinkLabel(item, group);
      if (/google\.[a-z.]+\/maps/.test(item.url)) assert.equal(label, '地圖', item.name);
      if (/restaurantguru|guide\.michelin/.test(item.url)) assert.equal(label, '店家頁', item.name);
      if (label === '訂位') assert.match(item.url, /rezerwac|reserv|booking|mojstolik|thefork|zjedz/i, item.name);
    }
  }
  assert.doesNotMatch(todos, /開啟處理頁/);
  assert.ok(todos.includes('>地圖 →<'));
  assert.ok(todos.includes('>店家頁 →<'));
  assert.ok(todos.includes('>訂位 →<'));
});

test('旅程結束日只有一個：最後一天 Day 8 = 10/31，各處一致；結束後小卡顯示「旅程已結束」而非空殼', async () => {
  const last = trip.days[trip.days.length - 1];
  assert.match(last.date, /^10\/31/);
  assert.equal(trip.meta.tripEnd, '2026-10-31');
  const { TRIP_DATE_RANGE } = await import('../src/lib/routes.mjs');
  assert.equal(TRIP_DATE_RANGE.end, trip.meta.tripEnd);
  assert.equal(TRIP_DATE_RANGE.start, trip.meta.tripStart);
  const nav = fs.readFileSync(new URL('../src/scripts/nav.js', import.meta.url), 'utf8');
  assert.ok(nav.includes(`today > '${trip.meta.tripEnd}'`));
  assert.match(home, /data-home-status="after" hidden>[^]*?旅程已結束/);
});

test('首頁小卡的日期切換：出發前、旅程期間（華沙日期）、旅程後', () => {
  const { travelStart, tripStart, tripEnd } = trip.meta;
  assert.deepEqual(resolveHomeStatus('2026-10-13', '2026-10-13', travelStart, tripStart, tripEnd), { mode: 'before', days: 10 });
  assert.equal(resolveHomeStatus('2026-10-23', '2026-10-24', travelStart, tripStart, tripEnd).mode, 'before');
  assert.deepEqual(resolveHomeStatus('2026-10-24', '2026-10-24', travelStart, tripStart, tripEnd), { mode: 'during', date: '2026-10-24' });
  assert.equal(resolveHomeStatus('2026-10-31', '2026-11-01', travelStart, tripStart, tripEnd).mode, 'during');
  assert.equal(resolveHomeStatus('2026-11-01', '2026-11-01', travelStart, tripStart, tripEnd).mode, 'after');
  assert.equal(departureLabel(10), '距出發 10 天');
  assert.equal(departureLabel(0), '今天出發');
  assert.deepEqual(nextStepFor([[600, 'A'], [900, 'B']], 700), { minutes: 900, label: 'B' });
  assert.equal(nextStepFor([[600, 'A']], 700), null);
});

test('首頁為每個行程日各寫一張旅程期間小卡，Day 1 = 10/24，帶主軸與下一站資料', () => {
  assert.equal((home.match(/data-home-day="/g) || []).length, trip.days.length);
  trip.days.forEach((day, index) => {
    const date = `2026-10-${24 + index}`;
    const match = new RegExp(`data-home-day="${date}" data-home-steps="([^"]*)"`).exec(home);
    assert.ok(match, `缺 ${date}`);
    const steps = JSON.parse(match[1].replaceAll('&quot;', '"').replaceAll('&amp;', '&'));
    assert.ok(steps.length > 0, `${date} 沒有可用的下一站時刻`);
    assert.ok(home.includes(`<b>今天 Day ${day.n}</b>：`));
  });
  assert.match(home, /class="home-status-card home-status-during"[^>]*href="today\.html" hidden/);
});

test('狀態小卡的 hidden 有明寫 display: none，不會被 class 的 display 蓋掉', () => {
  const css = fs.readFileSync(new URL('../src/styles/main.css', import.meta.url), 'utf8');
  assert.match(css, /\.home-status-card\[hidden\]\s*\{\s*display:\s*none;/);
});

test('Lajkonik 回程的購票狀態只有 todoGroups 一個正本：改成已完成，推導結果不再出現「尚未購票」', () => {
  const lajkonik = trip.trains.find(item => item.id === 'bus-lajkonik');
  // 現況：回程未購，各處推導出的字句都說「尚未購票」。
  assert.equal(lajkonikInboundWord(trip.todoGroups), '尚未購票');
  assert.match(railGroupIntro(trip.todoGroups), /回程尚未購票/);
  assert.match(lajkonik.status, /回程尚未購票/);

  // 複製一份 todoGroups，只把 Lajkonik 回程改成已完成。
  const doneGroups = structuredClone(trip.todoGroups);
  const inbound = doneGroups.find(g => g.id === 'rail').items.find(item => item.name.includes('Lajkonik 回程'));
  inbound.status = '已購票';
  assert.equal(lajkonikInboundWord(doneGroups), '已購票');
  const derivedIntro = railGroupIntro(doneGroups);
  assert.doesNotMatch(derivedIntro, /尚未購票/);
  assert.match(derivedIntro, /回程已購票/);

  // rail.js 的 Lajkonik 欄位（status／dayLeg／note、inbound.status）也跟著走：綁定複製版後重讀。
  try {
    bindTodoGroups(doneGroups);
    for (const text of [lajkonik.status, lajkonik.dayLeg, lajkonik.note, auschwitzBus.inbound.status]) {
      assert.doesNotMatch(text, /尚未購票/, text.slice(0, 40));
    }
    assert.equal(lajkonik.status, '去程已購票／回程已購票');
    assert.equal(auschwitzBus.inbound.status, '已購票');
  } finally {
    bindTodoGroups(trip.todoGroups);
  }
  assert.match(lajkonik.status, /回程尚未購票/);
});

test('全景畫（day-05）新行程只看外觀：待辦與倒數都不再要求購票', () => {
  // 2026-10-14 新行程付費景點只在外面拍照，全景畫的待辦、期限與每日頁購票說法一起拿掉。
  const allTodos = trip.todoGroups.flatMap(group => group.items);
  assert.ok(!allTodos.some(item => item.ticketPurchaseId === 'wroclaw-panorama'));
  assert.ok(!trip.deadlines.some(item => item.id === 'ticket-panorama'));
  const day5 = trip.days.find(d => d.n === 5);
  assert.ok(!JSON.stringify(day5).includes('尚未購票'), 'day-05 不應再催買全景畫票');
  assert.match(JSON.stringify(day5), /不用買全景畫票/);
});

test('rail.js 單獨載入（未綁定待辦）時不含任何購票狀態字樣', async () => {
  const fresh = await import('../src/data/rail.js?unbound');
  const bus = fresh.segments.find(item => item.id === 'bus-lajkonik');
  for (const text of [bus.status, bus.dayLeg, fresh.auschwitzBus.inbound.status]) {
    assert.doesNotMatch(text, /尚未購票/);
  }
});

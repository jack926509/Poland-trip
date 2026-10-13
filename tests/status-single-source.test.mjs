import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import * as trip from '../src/data/trip.js';
import { databaseEntries } from '../src/data/travel-database.js';
import { preDepartureNotes } from '../src/data/essentials.js';
import { renderHome } from '../src/templates/home.mjs';
import { renderBooking, renderTodos, renderNotes, todoLinkLabel } from '../src/templates/practical.mjs';
import { resolveTodoRef, statusOfItems } from '../src/lib/todo-status.mjs';
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
const notes = renderNotes({ preDepartureNotes, daylight: [] });

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
  assert.ok(home.includes(`<span class="home-status-sub">${breakdown}</span>`), '分類計數不符');
  assert.match(home, /data-home-status="before"[^>]*href="practical\/todos\.html"/);
  assert.match(home, /看待辦 →/);
});

test('首頁其餘待辦數字（狀態列、區塊導言、各類卡片）等於正本', () => {
  assert.ok(home.includes(`aria-label="${expected.open} 項待辦"`));
  assert.ok(home.includes(`共 ${expected.total} 項，還有 ${expected.open} 項待處理`));
  assert.ok(home.includes(`<strong>${expected.total - expected.open}</strong><span>已完成</span>`));
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
  assert.ok(booking.includes(`共 ${expected.total} 項，已完成 ${expected.done} 項`));
  for (const group of trip.todoGroups) {
    const text = openByGroup[group.id] ? `${openByGroup[group.id]} 項待處理` : '已完成';
    assert.ok(booking.includes(`<span>${group.title}</span><b>${text}</b>`), `${group.id} 計數不符`);
  }
});

test('訂票頁不再重述待辦：沒有倒數表、優先順序、時程表，也沒有逾期假警報', () => {
  assert.doesNotMatch(booking, /訂票優先順序|什麼時候處理|data-countdown-row|逾期 \d+ 天|訂票與查核倒數/);
  assert.match(booking, /<details class="booking-howto"/);
  assert.doesNotMatch(booking, /<details class="booking-howto"[^>]*open/);
});

test('行前提醒第 05、07 條的數字等於正本', () => {
  const rail = trip.todoGroups.find(group => group.id === 'rail');
  const railOpen = rail.items.filter(isOpen).length;
  assert.ok(preDepartureNotes[4].includes(`城際交通共 ${rail.items.length} 項，已購 ${rail.items.length - railOpen} 項，待處理 ${railOpen} 項`));
  assert.ok(preDepartureNotes[6].includes(`待辦共 ${expected.total} 項，已完成 ${expected.done} 項，仍待處理 ${expected.open} 項（${breakdown}）`));
  assert.ok(preDepartureNotes[6].includes(`當天現場再試 ${expected.skipped} 項`));
  for (const index of [4, 6]) assert.match(preDepartureNotes[index], /href="todos\.html"/);
  assert.ok(notes.includes(preDepartureNotes[6]));
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
  assert.ok(referenced.length >= 5);
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
  for (const train of trip.trains.filter(item => !String(item.id).startsWith('bus-'))) {
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

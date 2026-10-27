import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as dining from '../src/data/day-dining.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { days } from '../src/data/trip.js';
import * as rendering from '../src/lib/dining.mjs';

test('八天三餐都有唯一餐位，餐廳引用主檔，自備餐不虛構餐廳', () => {
  assert.ok(dining.dayMeals, '應提供三處頁面共用的每日三餐');
  for (const day of days) {
    const meals = dining.dayMeals[day.n];
    assert.deepEqual(meals.map(item => item.meal), ['breakfast', 'lunch', 'dinner']);
    for (const meal of meals) {
      assert.ok(day.steps.some(step => step.id === meal.stepId), `Day ${day.n} ${meal.meal} 缺少行程`);
      if (meal.placeId) assert.equal(meal.name, diningPlaces[meal.placeId].name);
      else assert.equal(meal.map, undefined, '自備餐／機上餐不可引導到不存在的店');
    }
  }
});

test('自備餐與條件式餐廳可共同呈現，顯示條件且不冒充訂位', () => {
  assert.equal(typeof rendering.renderMealList, 'function');
  const self = rendering.renderMealList(days[2], dining.dayMeals[3]);
  assert.match(self, /自備/);
  assert.match(self, /07:15/);
  const conditional = rendering.renderMealList(days[3], dining.dayMeals[4]);
  assert.match(conditional, /Samarqand/);
  assert.match(conditional, /21:00/);
  assert.match(conditional, /KFC/);
  assert.match(conditional, /不訂位/);
});

test('初稿更換餐廳後仍保留原主選為備選', () => {
  for (const [day, id] of [[2,'krakow-noah'],[2,'krakow-bar-mleczny-pod-temida']]) {
    const item = dining.dayDining[day].find(item => item.placeId === id);
    assert.ok(item);
    assert.equal(item.meal, undefined);
    assert.equal(item.stepId, null);
    assert.match(item.role, /備|替/);
  }
});

test('三處頁面使用同一份三餐呈現，離境與抵站後餐次不漏列', () => {
  for (const day of days) {
    const normalize = html => html.replace(/>\s+</g, '><');
    const shared = normalize(rendering.renderMealList(day, dining.dayMeals[day.n]));
    // 2026-10-20 今日卡改一屏儀表板，只顯示「下一餐」一行，完整三餐清單只在每日頁與餐飲頁。
    for (const file of [`day-${String(day.n).padStart(2,'0')}.html`, 'practical/dining.html']) {
      assert.ok(normalize(fs.readFileSync(`dist/${file}`, 'utf8')).includes(shared), `${file} 缺少 Day ${day.n} 共用三餐`);
    }
    // 今日卡的「下一餐」仍讀同一份三餐資料：每一餐都有對應的時刻資料列，餐次不漏。
    const today = fs.readFileSync('dist/today.html', 'utf8');
    const card = today.split(`data-today-date="2026-10-${String(23 + day.n).padStart(2, '0')}"`)[1].split('</article>')[0];
    for (const item of dining.dayMeals[day.n]) {
      const step = day.steps.find(s => s.id === item.stepId);
      assert.ok(card.includes(`data-meal-time="${step.t}" data-meal-name="${item.name.replaceAll('&', '&amp;')}"`), `today.html Day ${day.n} 缺少 ${item.name} 的下一餐資料`);
    }
  }
});

test('關鍵餐段銜接保留已購車次，付費館只看外觀', () => {
  const step = (day,id) => days[day-1].steps.find(item=>item.id===id);
  assert.equal(step(2,'d2-dinner').t, '19:15');
  assert.match(step(2,'d2-prep').sub, /隔日|隔天/);
  // 2026-10-14 新行程：Day 7 改看 POLIN 外觀（不進館），不再排起義博物館。
  // 2026-10-15 採點版：上午先走完新城、老城，Polka 改 12:30 入座、13:15 離開；POLIN 外觀改 08:35。
  assert.equal(step(7,'d7-lunch').t, '12:30');
  assert.match(step(7,'d7-lunch').label, /Polka/);
  assert.ok(days[6].steps.filter(item=>/POLIN/i.test(item.label)).every(item=>/外觀/.test(item.label) && /不進館/.test(item.sub)));
  assert.ok(!days[6].steps.some(item=>/起義博物館/.test(item.label)));
  assert.ok(days[6].steps.some(item=>item.t==='08:35' && /POLIN 外觀/.test(item.label)));
  assert.equal(step(5,'d5-lunch').t, '12:00');
  assert.match(step(5,'d5-lunch').sub, /13:00 結束/);
  assert.ok(days[4].steps.some(item=>item.t==='18:20 前'));
  assert.ok(days[3].steps.some(item=>item.t==='16:45'));
});

test('每個排定餐段都標出當天營業時段，HH:MM 用餐時刻落在營業時間內（留 45 分鐘用餐）', async () => {
  const { openingCheck } = await import('../src/lib/dining.mjs');
  for (const day of days) {
    for (const item of dining.dayDining[day.n].filter(item => item.planStatus === 'scheduled')) {
      assert.ok(item.dayHours, `Day ${day.n} ${item.name} 缺少當天營業時段`);
      const step = day.steps.find(step => step.id === item.stepId);
      const check = openingCheck(item.dayHours, step.t);
      if (check) assert.ok(check.ok, `Day ${day.n} ${item.name} ${step.t} 不在當天營業時段 ${item.dayHours} 內`);
    }
  }
  assert.equal(openingCheck('08:00–翌日 01:00', '18:05').ok, true);
  assert.equal(openingCheck('13:00–21:00', '20:30').ok, false);
  assert.equal(openingCheck('12:00–22:00', '抵站放行李後'), null);
});

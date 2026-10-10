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
  assert.match(self, /06:00/);
  const conditional = rendering.renderMealList(days[3], dining.dayMeals[4]);
  assert.match(conditional, /Samarqand/);
  assert.match(conditional, /21:00/);
  assert.match(conditional, /KFC/);
  assert.match(conditional, /不代表已訂位/);
});

test('初稿更換餐廳後仍保留原主選為備選', () => {
  for (const [day, id] of [[2,'krakow-noah'],[2,'krakow-bar-mleczny-pod-temida'],[7,'warsaw-cafe-bristol']]) {
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
    for (const file of [`day-${String(day.n).padStart(2,'0')}.html`, 'today.html', 'practical/dining.html']) {
      assert.ok(normalize(fs.readFileSync(`dist/${file}`, 'utf8')).includes(shared), `${file} 缺少 Day ${day.n} 共用三餐`);
    }
  }
});

test('關鍵餐段銜接保留已購車次與博物館參觀', () => {
  const step = (day,id) => days[day-1].steps.find(item=>item.id===id);
  assert.equal(step(2,'d2-dinner').t, '19:45');
  assert.match(step(2,'d2-prep').sub, /隔日|隔天/);
  assert.equal(step(7,'d7-lunch').t, '12:00');
  assert.ok(days[6].steps.some(item=>item.t==='13:15' && /POLIN/.test(item.label)));
  assert.ok(days[4].steps.some(item=>item.t==='18:35 前'));
  assert.ok(days[3].steps.some(item=>item.t==='16:45'));
});

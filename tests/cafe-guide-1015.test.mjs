// 2026-10-15 餐飲指南「咖啡與甜點」一節與行程時刻對齊。
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { cafeGuide } from '../src/data/dining.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { days } from '../src/data/trip.js';

const html = () => fs.readFileSync('dist/practical/dining.html', 'utf8');

test('咖啡與甜點：四城依行程排，每家都有地址、營業時間、導航與順路時段', () => {
  assert.deepEqual(cafeGuide.map(group => group.cityKey), ['warsaw', 'krakow', 'wroclaw', 'poznan']);
  for (const group of cafeGuide) {
    assert.ok(group.items.length >= 4, `${group.city} 咖啡甜點少於 4 家`);
    for (const item of group.items) {
      for (const field of ['name', 'type', 'when', 'address', 'hours']) assert.ok(item[field]?.trim(), `${group.city}「${item.name}」缺 ${field}`);
      assert.match(item.map, /^https:\/\/(www\.google\.com\/maps\/|maps\.google\.com\/)/);
      assert.equal(item.cityKey, group.cityKey, `${item.name} 城市不符`);
    }
  }
  const page = html();
  assert.match(page, /<section class="section" id="cafes">/);
  assert.equal((page.match(/class="day-food-item cafe-item"/g) || []).length, cafeGuide.reduce((sum, group) => sum + group.items.length, 0));
  assert.ok(page.indexOf('id="cafes"') < page.indexOf('<h2>2026 米其林總表'), '咖啡與甜點要排在米其林總表之前');
});

test('咖啡與甜點：標「已排入」的時刻必須真的在當天時間表上', () => {
  for (const group of cafeGuide) {
    for (const item of group.items.filter(item => /已排入/.test(item.when))) {
      const [, n, time] = /Day (\d+) · (\d{2}:\d{2})?/.exec(item.when) || [];
      const day = days.find(entry => entry.n === Number(n));
      assert.ok(day, `${item.name} 的 Day 不存在`);
      if (time) assert.ok(day.steps.some(step => step.t === time), `${item.name} 標 Day ${n} ${time}，但時間表沒有這個時刻`);
    }
  }
});

test('新增的咖啡店都標部分核實並留查核來源與日期，不冒充已核實', () => {
  for (const id of ['krakow-massolit-books-cafe', 'wroclaw-paloma-coffee', 'poznan-stragan-kawiarnia', 'poznan-lagacca-cafe-by-brisman', 'krakow-cafe-camelot']) {
    const place = diningPlaces[id];
    assert.equal(place.verificationStatus, 'partial', id);
    assert.equal(place.checkedAt, '2026-10-15', id);
    assert.match(place.sourceUrl, /^https:\/\//, id);
    assert.ok(place.verificationNote, id);
  }
});

test('餐飲備註跟上 10/15 行程：不再出現舊時刻', () => {
  const text = JSON.stringify(diningPlaces);
  for (const stale of ['10/24 傍晚 17:10', '10/30 城堡廣場拍完，12:00', '10/30 08:10 搭地鐵', '10/30 下午有空檔才去', '10/30 晚餐改 Rusiko', '10/29 12:15 點心站']) {
    assert.ok(!text.includes(stale), `仍有舊時刻：${stale}`);
  }
});

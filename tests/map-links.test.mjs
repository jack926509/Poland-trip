import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { days } from '../src/data/trip.js';
import {
  cityDining, cityFood, foodBackup, michelinReservations,
  verifiedRestaurantHours, snacksAndCafes,
} from '../src/data/dining.js';
import { fares } from '../src/data/tickets.js';
import { souvenirShops, luxuryShopping } from '../src/data/shopping.js';

const isMapUrl = value => typeof value === 'string'
  && /^https:\/\/(maps\.google\.com|www\.google\.com\/maps|maps\.app\.goo\.gl)/.test(value);

test('順路必吃每一筆都有可點的 Google Maps 連結', () => {
  for (const day of days) {
    for (const item of day.eat || []) {
      assert.ok(isMapUrl(item.map), `Day ${day.n}「${item.text}」缺少 Google Maps 連結`);
    }
  }
});

test('景點、餐廳、伴手禮店家都有定位連結', () => {
  for (const item of fares) assert.ok(isMapUrl(item.mapUrl), `景點缺定位：${item.name}`);
  for (const [city, list] of Object.entries(cityDining)) {
    for (const item of list) assert.ok(isMapUrl(item.mapUrl), `${city} 餐廳缺定位：${item.name}`);
  }
  for (const item of michelinReservations) {
    assert.ok(isMapUrl(item.mapUrl), `訂位表缺定位：${item.restaurant}`);
  }
  for (const item of verifiedRestaurantHours) {
    assert.ok(isMapUrl(item.mapUrl), `營業時間表缺定位：${item.name}`);
  }
  for (const group of [...cityFood, ...foodBackup]) {
    for (const item of group.items) {
      const ok = isMapUrl(item.map) || (item.maps?.length && item.maps.every(entry => isMapUrl(entry.url)));
      assert.ok(ok, `${group.city}「${item.name}」缺定位`);
    }
  }
  for (const item of souvenirShops) assert.ok(isMapUrl(item.mapUrl), `伴手禮店缺定位：${item.name}`);
  for (const item of luxuryShopping) assert.ok(isMapUrl(item.mapUrl), `精品店缺定位：${item.shop}`);
});

test('每日備案與延伸選項若是具體地點就要有定位', () => {
  for (const day of days) {
    for (const item of [...(day.backup || []), ...(day.extend || [])]) {
      if (item.map !== undefined) assert.ok(isMapUrl(item.map), `Day ${day.n} 備案定位格式錯誤：${item.where || item.label}`);
    }
  }
});

test('小吃與咖啡廳推薦四城齊全且每筆都有定位', () => {
  assert.deepEqual(Object.keys(snacksAndCafes), ['warsaw', 'krakow', 'wroclaw', 'poznan']);
  assert.deepEqual(Object.values(snacksAndCafes).map(list => list.length), [5, 5, 4, 4]);
  for (const [city, list] of Object.entries(snacksAndCafes)) {
    for (const item of list) {
      assert.ok(isMapUrl(item.map), `${city}「${item.name}」缺定位`);
      for (const field of ['name', 'type', 'note', 'hours']) {
        assert.ok(item[field]?.trim(), `${city}「${item.name}」缺 ${field}`);
      }
    }
  }
});

test('城市頁輸出小吃與咖啡廳區塊並附定位連結', () => {
  const pages = {
    warsaw: 'city-warszawa.html', krakow: 'city-krakow.html',
    wroclaw: 'city-wroclaw.html', poznan: 'city-poznan.html',
  };
  for (const [key, file] of Object.entries(pages)) {
    const html = readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
    assert.ok(html.includes('小吃 · 牛奶吧 · 咖啡廳'), `${file} 缺少小吃區塊`);
    for (const item of snacksAndCafes[key]) {
      assert.ok(html.includes(item.name), `${file} 缺少 ${item.name}`);
      assert.ok(html.includes(item.map), `${file} 缺少 ${item.name} 的定位連結`);
    }
  }
});

test('訂票頁的 Auschwitz 巴士區塊完整反映官方售票頁查得的資料', async () => {
  const { auschwitzBus } = await import('../src/data/trip.js');
  const html = readFileSync(new URL('../dist/practical/booking.html', import.meta.url), 'utf8');

  // 官方網域必須是 .pl，不得殘留舊的 .eu
  assert.equal(auschwitzBus.site, 'https://www.lajkonikbus.pl/');
  assert.ok(!html.includes('lajkonikbus.eu'), '訂票頁仍殘留 lajkonikbus.eu');
  assert.ok(html.includes('lajkonikbus.pl'));

  // 去程：兩班都要列出，且採用／不採用與理由都要在頁面上
  assert.equal(auschwitzBus.outbound.checkedAt, '2026-09-09');
  assert.deepEqual(auschwitzBus.outbound.services.map(item => item.dep), ['07:10', '08:25']);
  assert.deepEqual(auschwitzBus.outbound.services.map(item => item.decision), ['採用', '不採用']);
  for (const service of auschwitzBus.outbound.services) {
    for (const field of ['dep', 'arr', 'dur', 'bay', 'fare', 'why']) {
      assert.ok(service[field]?.trim(), `去程班次缺 ${field}`);
    }
    assert.ok(html.includes(service.dep), `訂票頁缺去程 ${service.dep}`);
    assert.ok(html.includes(service.why), `訂票頁缺 ${service.dep} 的判斷理由`);
  }

  // 回程：三班都要列出，14:00 不可用、15:30 採用、16:30 備案
  assert.equal(auschwitzBus.inbound.checkedAt, '2026-09-09');
  assert.deepEqual(auschwitzBus.inbound.services.map(item => item.dep), ['14:00', '15:30', '16:30']);
  assert.deepEqual(auschwitzBus.inbound.services.map(item => item.decision), ['不採用', '採用', '備案']);
  for (const service of auschwitzBus.inbound.services) {
    assert.ok(html.includes(service.dep), `訂票頁缺回程 ${service.dep}`);
    assert.ok(html.includes(service.why), `訂票頁缺回程 ${service.dep} 的判斷理由`);
  }
  assert.match(auschwitzBus.inbound.threshold, /14:15/);

  // 已訂妥的參觀場次必須和巴士放在同一區塊，因為兩班車都是照它挑的
  const tour = auschwitzBus.tour;
  assert.equal(tour.status, '已訂妥');
  assert.equal(tour.time, '10:30');
  assert.match(tour.arriveBy, /10:00/);
  assert.match(tour.endsAt, /14:15/);
  for (const field of ['date', 'name', 'scope', 'language', 'duration', 'people', 'entryRule']) {
    assert.ok(tour[field]?.trim(), `已訂場次缺 ${field}`);
    assert.ok(html.includes(tour[field]), `訂票頁缺已訂場次的 ${field}`);
  }
  for (const query of [auschwitzBus.outbound.query, auschwitzBus.inbound.query]) {
    assert.equal(query.date, '2026-10-26');
    for (const field of ['from', 'to']) assert.ok(query[field]?.trim());
    assert.ok(html.includes(query.from) && html.includes(query.to));
  }
  assert.ok(html.includes('Auschwitz 往返巴士'), '訂票頁缺 Auschwitz 巴士區塊');
  assert.ok(html.includes('Departure from'), '訂票頁缺可照填的查詢欄位');
  assert.ok(html.includes('這一天的錨點'), '訂票頁未把已訂場次放進巴士區塊');
});

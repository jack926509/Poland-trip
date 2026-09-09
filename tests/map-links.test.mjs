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

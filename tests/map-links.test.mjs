import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { days } from '../src/data/trip.js';
import {
  cityDining, cityFood, michelinReservations,
  verifiedRestaurantHours, snacksAndCafes,
  fastFoodChains, fastFoodBranches, fastFoodHubs,
} from '../src/data/dining.js';
import { dayDining } from '../src/data/day-dining.js';
import { fares } from '../src/data/tickets.js';
import { souvenirShops, luxuryShopping } from '../src/data/shopping.js';

const isMapUrl = value => typeof value === 'string'
  && /^https:\/\/(maps\.google\.com|www\.google\.com\/maps|maps\.app\.goo\.gl)/.test(value);

test('每日餐廳候選（day-dining）每一筆都有 role/name/note 且地圖連結可點', () => {
  for (const [day, items] of Object.entries(dayDining)) {
    for (const item of items) {
      for (const field of ['role', 'name', 'note']) {
        assert.ok(item[field]?.trim(), `day-dining Day ${day}「${item.name || '(未命名)'}」缺 ${field}`);
      }
      assert.ok(isMapUrl(item.map), `day-dining Day ${day}「${item.name}」缺少 Google Maps 連結`);
    }
  }
});

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
  for (const group of cityFood) {
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
  assert.deepEqual(Object.values(snacksAndCafes).map(list => list.length), [6, 5, 6, 4]);
  for (const [city, list] of Object.entries(snacksAndCafes)) {
    for (const item of list) {
      assert.ok(isMapUrl(item.map), `${city}「${item.name}」缺定位`);
      for (const field of ['name', 'type', 'note', 'hours']) {
        assert.ok(item[field]?.trim(), `${city}「${item.name}」缺 ${field}`);
      }
    }
  }
});

test('小吃與咖啡廳併入行程餐廳推薦表且保留定位連結', async () => {
  const { mergeCityDining } = await import('../src/templates/city-dining.mjs');
  const pages = {
    warsaw: ['city-warszawa.html', '華沙'], krakow: ['city-krakow.html', '克拉科夫'],
    wroclaw: ['city-wroclaw.html', '樂斯拉夫'], poznan: ['city-poznan.html', '波茲南'],
  };
  for (const [key, [file, cityName]] of Object.entries(pages)) {
    const html = readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
    assert.ok(html.includes('<h2>行程餐廳推薦</h2>'), `${file} 缺少行程餐廳推薦表`);
    const rows = mergeCityDining(key, cityDining[key], cityFood.find(g => g.city === cityName).items, snacksAndCafes[key]);
    for (const item of snacksAndCafes[key]) {
      assert.ok(html.includes(item.name), `${file} 缺少 ${item.name}`);
      // 與候選或主推同店時只留一條定位連結，因此比對合併後那一列實際使用的連結。
      const row = rows.find(entry => entry.name === item.name || entry.hours === item.hours);
      assert.ok(row && isMapUrl(row.map), `${file}「${item.name}」合併後缺少定位連結`);
      assert.ok(html.includes(row.map), `${file} 缺少 ${item.name} 的定位連結`);
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

test('連鎖速食分店有店家、地址、位置備註與定位連結', () => {
  const chainNames = new Set(fastFoodChains.map(chain => chain.name));
  assert.deepEqual(Object.keys(fastFoodBranches), ['warsaw', 'krakow', 'wroclaw', 'poznan']);
  for (const [city, branches] of Object.entries(fastFoodBranches)) {
    assert.ok(branches.length, `${city} 沒有任何速食分店`);
    for (const branch of branches) {
      for (const field of ['chain', 'address', 'note']) {
        assert.ok(branch[field]?.trim(), `${city}「${branch.chain || '(未命名)'}」缺 ${field}`);
      }
      // 招牌推薦只寫一次，分店表只列地址；店名對不上就代表有一邊漏改。
      assert.ok(chainNames.has(branch.chain), `${city}「${branch.chain}」不在 fastFoodChains 名單內`);
      assert.ok(isMapUrl(branch.map), `${city}「${branch.chain}」缺定位`);
    }
  }
});

test('一站吃到多家的城市與店家都對得上分店表', () => {
  for (const hub of fastFoodHubs) {
    const branches = fastFoodBranches[hub.cityKey];
    assert.ok(branches, `${hub.place} 的 cityKey「${hub.cityKey}」不存在`);
    assert.ok(isMapUrl(hub.map), `${hub.place} 缺定位`);
    for (const chain of hub.chains) {
      assert.ok(branches.some(branch => branch.chain === chain),
        `${hub.place} 列了 ${chain}，但 ${hub.cityKey} 分店表沒有這家`);
    }
  }
});

test('速食與每日行程、城市指南互相接得上', async () => {
  const { daysInCity, cityKeysForDay, cityGuides } = await import('../src/templates/city-dining.mjs');
  const { renderFastFoodFallback } = await import('../src/templates/fast-food.mjs');

  // 每座有分店的城市都要在行程裡有日子，否則城市頁的「這座城的行程日」會是空的
  for (const cityKey of Object.keys(fastFoodBranches)) {
    assert.ok(daysInCity(cityKey).length, `${cityGuides[cityKey].name}在行程裡找不到對應日期`);
  }

  // 每一天都要指得到城市，速食備援才不會在某幾天憑空消失
  for (const day of days) {
    const keys = cityKeysForDay(day);
    assert.ok(keys.length, `Day ${day.n}「${day.city}」對不到任何城市指南`);
    const html = renderFastFoodFallback(keys, { branches: fastFoodBranches, hubs: fastFoodHubs });
    assert.ok(html.includes('#city-fast-food'), `Day ${day.n} 少了連鎖速食備援連結`);
    // 跨城日兩座城都要列出來，不能只給先到的那一座
    assert.equal((html.match(/#city-fast-food/g) || []).length, keys.length,
      `Day ${day.n} 的備援連結數與當天城市數不符`);
  }

  // 地址本身已帶括號（「Pawia 5（中央車站旁）」），版型不得再包一層
  const nested = renderFastFoodFallback(['krakow'], { branches: fastFoodBranches, hubs: fastFoodHubs });
  assert.ok(!/（[^）]*（/.test(nested), `一站提示出現巢狀括號：${nested}`);
});

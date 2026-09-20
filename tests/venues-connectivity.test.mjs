import test from 'node:test';
import assert from 'node:assert/strict';

import { venues } from '../src/data/venues.js';
import { fares, ticketsByCity, venueHours } from '../src/data/tickets.js';
import { resolveVenue, venueAddress, venuesByCity } from '../src/lib/venues.mjs';
import { days } from '../src/data/trip.js';

// 精煉切片 4a 的護欄：venues.js 是景點票價／開放時間的單一來源，這裡鎖住
// 「查得到就是查得到、查不到就留 null」的紀律，不讓推導函式悄悄補資料。

test('venues.js 每筆都有 id／cityKey／name，且 checkedAt 欄位存在（沒有來源時允許 null，但不能整欄缺漏）', () => {
  const allowedCityKeys = new Set(['WAW', 'KRK', 'WRO', 'POZ']);
  for (const [key, venue] of Object.entries(venues)) {
    assert.equal(venue.id, key, `${key} 的 id 欄位應與物件 key 一致`);
    assert.ok(allowedCityKeys.has(venue.cityKey), `${key} 的 cityKey 不合法：${venue.cityKey}`);
    assert.ok(venue.name?.trim(), `${key} 缺 name`);
    assert.ok(Object.hasOwn(venue, 'checkedAt'), `${key} 缺 checkedAt 欄位（沒查到來源要留 null，不能整欄不存在）`);
    if (venue.checkedAt !== null) assert.match(venue.checkedAt, /^\d{4}-\d{2}-\d{2}$/, `${key} 的 checkedAt 格式不符`);
    if (venue.hours?.checkedAt) assert.match(venue.hours.checkedAt, /^\d{4}-\d{2}-\d{2}$/, `${key} 的 hours.checkedAt 格式不符`);
  }
});

test('resolveVenue／venueAddress／venuesByCity 對每個 venues.js 的 key 都能解析', () => {
  for (const key of Object.keys(venues)) {
    const venue = resolveVenue(key);
    assert.equal(venue.id, key);
    const address = venueAddress(key);
    assert.equal(address.name, venue.name);
    assert.equal(address.url, venue.map);
  }
  assert.throws(() => resolveVenue('not-a-real-venue'));

  const warsawVenues = venuesByCity('WAW');
  assert.ok(warsawVenues.length > 0);
  assert.ok(warsawVenues.every(item => item.cityKey === 'WAW'));
});

test('trip.js 步驟的 constraint.venue 全部能對到 venues.js（不是只對到 tickets.venueHours）', () => {
  let checked = 0;
  for (const day of days) {
    for (const step of day.steps) {
      const venueKey = step.constraint?.venue;
      if (!venueKey) continue;
      checked += 1;
      assert.ok(venues[venueKey], `Day ${day.n}「${step.label}」的 constraint.venue 對不到 venues.js：${venueKey}`);
    }
  }
  assert.ok(checked > 0, '應該至少有一個步驟掛 constraint.venue');
});

test('矛盾 #12：Wawel 短路線步驟的 constraint 改指王冠寶庫，與步驟文字、票價一致', () => {
  const day2 = days.find(item => item.n === 2);
  const step = day2.steps.find(item => item.label === '★ Wawel 城堡短路線');
  assert.equal(step.constraint.venue, 'krakow-wawel-treasury');
  assert.match(step.sub, /王冠寶庫 47／35/);
  assert.match(step.cost, /47／35/);
});

test('fares／ticketsByCity／venueHours 仍是 tickets.js 既有 export 形狀，且由 venues.js 推導（新增 POLIN、華沙起義博物館兩筆）', () => {
  assert.equal(fares.length, Object.keys(venues).length);
  for (const item of fares) {
    for (const field of ['name', 'fullPrice', 'discountPrice', 'note', 'officialUrl', 'mapUrl']) {
      assert.ok(field in item, `fares 項目缺欄位 ${field}：${item.name}`);
    }
  }
  assert.ok(fares.some(item => item.name === '華沙 · POLIN 猶太歷史博物館'));
  assert.ok(fares.some(item => item.name === '華沙 · 華沙起義博物館'));

  const totalTicketsByCity = ticketsByCity.reduce((sum, group) => sum + group.items.length, 0);
  assert.equal(totalTicketsByCity, 22, 'ticketsByCity 總筆數不應因為 venues.js 重構而改變');

  for (const [key, venue] of Object.entries(venueHours)) {
    assert.ok(venues[key]?.hours, `venueHours['${key}'] 在 venues.js 已無對應的結構化 hours`);
  }
});

test('矛盾 #5：POLIN 公休日站內無來源，venues.js 與稽核腳本一致地留空、不猜週二休', () => {
  const polin = venues['warsaw-polin'];
  assert.deepEqual(polin.hours.closedWeekdays, []);
  assert.match(polin.hours.note, /公休日站內尚無查證資料/);
});

test('矛盾 #11：辛德勒工廠 hours.opens/closes 已從 prices.note 的官網查證補上，不再是空的結構化欄位', () => {
  const schindler = venues['krakow-schindler'];
  assert.equal(schindler.hours.opens, '09:00');
  assert.equal(schindler.hours.closes, '20:00');
  assert.equal(schindler.hours.lastEntry, '18:30');
  // 「每月第一個週二休」是月頻率例外，不是每週固定公休，不可塞進 closedWeekdays。
  assert.deepEqual(schindler.hours.closedWeekdays, []);
});

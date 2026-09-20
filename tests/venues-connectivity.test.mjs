import test from 'node:test';
import assert from 'node:assert/strict';

import { venues, ticketsByCityExtras } from '../src/data/venues.js';
import { fares, ticketsByCity, venueHours } from '../src/data/tickets.js';
import { resolveVenue, venueAddress, venuesByCity, venuePin } from '../src/lib/venues.mjs';
import { days } from '../src/data/trip.js';
import { attractions, mapPins } from '../src/data/cities.js';
import { daySupplementaryPins } from '../src/data/day-maps.js';

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
  // 切片 4b：venues.js 擴大為景點＋地點共用主檔，fares 只取有 prices 的票券景點。
  assert.equal(fares.length, Object.values(venues).filter(v => v.prices).length);
  assert.equal(fares.length, 23);
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

// 切片 4b 的護欄：cities.js attractions、mapPins 的 venueId 必須對得到
// venues.js；有給座標的 daySupplementaryPins 必須能透過 venuePin() 解析；
// 三個改成動態帶出 hours 的行程步驟不能再殘留跟舊字面值一樣的死數字。

test('cities.js attractions 每筆都有 extra（不再叫 priceNote），venueId 有填的都能對到 venues.js', () => {
  let withVenue = 0;
  for (const [city, items] of Object.entries(attractions)) {
    for (const item of items) {
      assert.ok('extra' in item, `${city}「${item.name}」缺 extra 欄位`);
      assert.ok(!('priceNote' in item), `${city}「${item.name}」不應再有舊的 priceNote 欄位`);
      if (item.venueId === null) continue;
      withVenue += 1;
      assert.ok(venues[item.venueId], `${city}「${item.name}」的 venueId 對不到 venues.js：${item.venueId}`);
    }
  }
  assert.ok(withVenue > 0, '應該至少有一個 attraction 掛上 venueId');
});

test('cities.js mapPins 的 sight 類圖釘，venueId 有填的都能對到 venues.js', () => {
  let withVenue = 0;
  for (const [city, data] of Object.entries(mapPins)) {
    for (const point of data.points) {
      if (point[5] !== 'sight') continue;
      const venueId = point[6];
      if (venueId === undefined || venueId === null) continue;
      withVenue += 1;
      assert.ok(venues[venueId], `${city}「${point[2]}」圖釘的 venueId 對不到 venues.js：${venueId}`);
    }
  }
  assert.ok(withVenue > 0, '應該至少有一個 sight 圖釘掛上 venueId');
});

test('day-maps.js 有座標可用的補充圖釘都改用 venuePin()，回傳形狀與原始 tuple 一致', () => {
  let checked = 0;
  for (const [day, points] of Object.entries(daySupplementaryPins)) {
    for (const point of points) {
      assert.equal(point.length, 7, `Day ${day} 的補充圖釘應為 7 元素 tuple：${point[2]}`);
      assert.equal(typeof point[0], 'number');
      assert.equal(typeof point[1], 'number');
      checked += 1;
    }
  }
  assert.ok(checked > 0);
  // venuePin 對沒有座標的 venue 要直接丟錯，不能悄悄回傳假座標。
  assert.throws(() => venuePin('krakow-plac-nowy', { label: '測試', category: 'sight' }));
});

test('ticketsByCityExtras 的 4 筆非景點主檔項目仍完整存在（蕭邦博物館、聖瑪麗教堂登塔、奧斯威辛導覽、地下市集博物館）', () => {
  assert.equal(Object.keys(ticketsByCityExtras).length, 4);
  for (const [name, note] of Object.values(ticketsByCityExtras)) {
    assert.ok(name?.trim());
    assert.ok(note?.trim());
  }
});

test('切片 4b：辛德勒工廠／皇家城堡／POLIN 三個步驟的 sub 改由 venues.js 的 hours 動態帶出，不是另外手打的固定字串', () => {
  const findStep = (dayN, label) => days.find(item => item.n === dayN).steps.find(item => item.label === label);

  const schindlerStep = findStep(2, '★ 辛德勒工廠');
  const schindlerVenue = resolveVenue('krakow-schindler');
  assert.ok(schindlerStep.sub.includes(schindlerVenue.hours.opens));
  assert.ok(schindlerStep.sub.includes(schindlerVenue.hours.closes));
  assert.ok(schindlerStep.sub.includes(schindlerVenue.hours.lastEntry));

  const royalCastleStep = findStep(7, '★ 皇家城堡');
  const royalCastleVenue = resolveVenue('warsaw-royal-castle');
  assert.ok(royalCastleStep.sub.includes(royalCastleVenue.hours.opens));
  assert.ok(royalCastleStep.sub.includes(royalCastleVenue.hours.closes));
  assert.ok(royalCastleStep.sub.includes(royalCastleVenue.hours.lastEntry));

  const polinStep = findStep(7, '★ POLIN 猶太博物館');
  const polinVenue = resolveVenue('warsaw-polin');
  assert.ok(polinStep.sub.includes(polinVenue.hours.opens));
  assert.ok(polinStep.sub.includes(polinVenue.hours.closes));
  assert.ok(polinStep.sub.includes(polinVenue.hours.lastEntry));

  // 精確檢查「不含票價數字」：這三個步驟的 sub 不應含 PLN 金額（避免誤判無關數字，
  // 只鎖定「數字＋／＋數字」這種全票／優待並列的票價寫法，例如 47／35）。
  const priceListPattern = /\d+(?:\.\d+)?／\d+(?:\.\d+)?/;
  for (const step of [schindlerStep, royalCastleStep, polinStep]) {
    assert.doesNotMatch(step.sub, priceListPattern, `${step.label} 的 sub 仍殘留全票／優待並列的票價寫法`);
  }
});

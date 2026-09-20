import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import * as trip from '../src/data/trip.js';
import { segments, auschwitzBus } from '../src/data/rail.js';
import { resolveSegment, segmentForDay, lajkonikAdopted } from '../src/lib/rail.mjs';

test('days[].train 不再重複火車事實，只用 segmentId 指回 rail.js 的 segments', () => {
  let checked = 0;
  for (const day of trip.days) {
    if (!day.train) continue;
    checked += 1;
    assert.ok(segments.some(item => item.id === day.train.segmentId), `Day ${day.n} 的 segmentId 對不到 segments：${day.train.segmentId}`);
    for (const field of ['dep', 'arr', 'price', 'dur', 'type', 'leg', 'from', 'to', 'saleOpens', 'saleCheckedAt']) {
      assert.equal(day.train[field], undefined, `Day ${day.n} 的 train.${field} 應搬進 rail.js，不該留在 trip.js`);
    }
  }
  // 5 個轉場日（Day 2、3、4、5、6）都應該有 segmentId；Day 1、7、8 沒有城際轉場。
  assert.equal(checked, 5);
});

test('每個 segmentId 都能透過 segmentForDay 換回行程頁要顯示的完整欄位', () => {
  for (const day of trip.days) {
    const segment = segmentForDay(day);
    if (!day.train) {
      assert.equal(segment, null, `Day ${day.n} 沒有 train 卻仍解析出 segment`);
      continue;
    }
    assert.ok(segment.type && segment.dep && segment.arr && segment.dur, `Day ${day.n} 解析出的 segment 缺欄位`);
  }
  assert.throws(() => resolveSegment('not-a-real-segment'));
  assert.equal(trip.trains.length, 5);
  assert.equal(segments.length, 5);
});

test('Lajkonik 採用（decision === 採用）班次是唯一來源，segments 與 trip.js 的引用值彼此一致', () => {
  const { outbound, inbound } = lajkonikAdopted();
  const busSegment = segments.find(item => item.id === 'bus-lajkonik');
  assert.ok(busSegment.dep.startsWith(outbound.dep), 'segments 的 bus-lajkonik.dep 應以 auschwitzBus 採用班次開頭');
  assert.ok(busSegment.arr.startsWith(outbound.arr));
  assert.equal(busSegment.dayDep, outbound.dep);
  assert.equal(busSegment.dayArr, outbound.arr);

  const day3 = trip.days.find(item => item.n === 3);
  // headline／mustBook／warn／returnOptions 都引用同一組 adopted／backup／rejected 班次；
  // 只要其中任一處與 auschwitzBus 的 decision 對不上，這裡就會先壞。
  assert.ok(day3.headline.includes(outbound.dep) && day3.headline.includes(inbound.dep));
  const adoptedOption = day3.returnOptions.find(item => item.rank === '採用');
  assert.ok(adoptedOption.name.includes(inbound.dep) && adoptedOption.name.includes(inbound.arr));
});

test('07:10／25.00／25,00 在 trip.js 只留在 rail.js 這唯一來源，不再手抄第二份', () => {
  // 15:30 不列入本測試：它同時是紡織會館 Sukiennice（Day 2）、可頌博物館營業時間
  // （Day 6）等與 Lajkonik 巴士無關的合法數值，逐字比對會誤判，因此改用上面
  // 「Lajkonik 採用班次」測試守護巴士時刻本身的一致性。
  const tripSource = fs.readFileSync(new URL('../src/data/trip.js', import.meta.url), 'utf8');
  for (const needle of ['07:10', '25.00', '25,00']) {
    assert.ok(!tripSource.includes(needle), `trip.js 仍手抄了 "${needle}"，應改用 rail.js 的 segments／auschwitzBus`);
  }
});

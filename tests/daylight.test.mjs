import test from 'node:test';
import assert from 'node:assert/strict';

import { daylight } from '../src/data/essentials.js';
import { sunTimes, warsawOffset, CITY_COORDINATES } from '../tools/sun-times.mjs';

test('演算法重現專案 2026-08-11 人工查證的四個日落值', () => {
  // 這四筆是獨立於演算法的外部基準。演算法若被改壞，這裡會先失敗。
  const verified = [
    ['2026-10-26', '華沙', '16:19'],
    ['2026-10-31', '華沙', '16:10'],
    ['2026-10-28', '樂斯拉夫', '16:34'],
    ['2026-10-29', '波茲南', '16:29'],
  ];
  for (const [date, city, sunset] of verified) {
    assert.equal(sunTimes(date, city).sunset, sunset, `${date} ${city}`);
  }
});

test('daylight 表每一筆都與演算法一致', () => {
  assert.equal(daylight.length, 8);
  for (const item of daylight) {
    const computed = sunTimes(item.date, item.city);
    assert.equal(item.sunrise, computed.sunrise, `Day ${item.day} 日出`);
    assert.equal(item.sunset, computed.sunset, `Day ${item.day} 日落`);
    assert.equal(item.blueHourEnd, computed.blueHourEnd, `Day ${item.day} 藍調結束`);
    assert.equal(item.tz, computed.tz, `Day ${item.day} 時區`);
  }
});

test('夏令時間在 10/25 結束，只有 Day 1 是 CEST', () => {
  assert.equal(warsawOffset('2026-10-24').tz, 'CEST');
  assert.equal(warsawOffset('2026-10-25').tz, 'CET');
  assert.equal(daylight.filter(item => item.tz === 'CEST').length, 1);
  assert.equal(daylight[0].day, 1);
});

test('換季造成的戶外時間落差確實接近一小時', () => {
  const toMinutes = value => { const [h, m] = value.split(':').map(Number); return h * 60 + m; };
  const drop = toMinutes(daylight[0].sunset) - toMinutes(daylight[1].sunset);
  assert.ok(drop > 45 && drop < 60, `Day 1 → Day 2 日落落差為 ${drop} 分鐘，與敘述不符`);
});

test('每日城市都有座標，且日出早於日落早於藍調結束', () => {
  for (const item of daylight) {
    assert.ok(CITY_COORDINATES[item.city], `${item.city} 缺少座標`);
    assert.ok(item.sunrise < item.sunset, `Day ${item.day} 日出不早於日落`);
    assert.ok(item.sunset < item.blueHourEnd, `Day ${item.day} 藍調結束不晚於日落`);
  }
});

test('未知城市直接拋錯，不回傳猜測值', () => {
  assert.throws(() => sunTimes('2026-10-24', '格但斯克'), /未知城市/);
});

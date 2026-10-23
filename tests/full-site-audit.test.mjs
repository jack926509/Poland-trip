import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { days, todoGroups } from '../src/data/trip.js';
import { makeDayMap } from '../src/lib/day-map.mjs';
import { isOpenTodoStatus } from '../src/scripts/dashboard.js';

test('皇家大道既有查證座標搬至 Day 7 並對回下午步驟', () => {
  const pins = makeDayMap(days[6]).points;
  for (const [name, lat, lon, row] of [
    ['聖十字教堂 Kościół św. Krzyża', 52.2387357, 21.0167603, 20],
    ['哥白尼紀念碑 Pomnik Kopernika', 52.2381578, 21.0179739, 21],
  ]) {
    const point = pins.find(p => p[2] === name);
    assert.deepEqual(point.slice(0, 2), [lat, lon]);
    assert.equal(point[8], row);
  }
});
test('已購巴士顯示綠色已購、公開查票入口與另買備案提示', () => {
  const html = fs.readFileSync('dist/practical/booking.html', 'utf8');
  assert.match(html, /查已購票券（My Ticket）→/);
  assert.match(html, /class="tag-green">已購<\/span>/);
  assert.match(html, /16:30 備案需另買新票/);
  assert.doesNotMatch(html, /到 lajkonikbus.pl 買票/);
});
test('唯一開放待辦仍為聯絡公寓，出發日不顯示空地圖', () => {
  assert.deepEqual(todoGroups.flatMap(g => g.items).filter(i => !i.skip && isOpenTodoStatus(i.status)).map(i => i.name), ['之後聯絡 Poznan Apartments']);
  assert.doesNotMatch(fs.readFileSync('dist/day-01.html', 'utf8'), /data-trip-map/);
});

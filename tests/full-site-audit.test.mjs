import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { days, todoGroups } from '../src/data/trip.js';
import { makeDayMap } from '../src/lib/day-map.mjs';
import { isOpenTodoStatus } from '../src/scripts/dashboard.js';

test('皇家大道既有查證座標搬至 Day 7 並對回下午步驟', () => {
  const pins = makeDayMap(days[6]).points;
  for (const [name, lat, lon, row] of [
    ['聖十字教堂 Kościół św. Krzyża', 52.2387357, 21.0167603, 14],
    ['哥白尼紀念碑 Pomnik Kopernika', 52.2381578, 21.0179739, 15],
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

test('建置後 Day 3 與單檔版保留 MDA 入口說明', () => {
  for (const file of ['dist/day-03.html', 'dist/poland-travel-guide-2026.html']) {
    const html = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /入口：待班次、分店或現場集合點確認。/);
    assert.match(html, /Bosacka 18 客運站下層（dolna płyta）D9 站位/);
  }
});

test('Day 3 地圖維持 Oświęcim 範圍，晚餐使用地址卡導航', () => {
  const map = makeDayMap(days[2]);
  assert.ok(map.points.length > 0);
  assert.ok(map.points.every(point => point[1] < 19.3));
  assert.ok(map.points.every(point => point[2] !== 'Mr. Jerry'));
  assert.match(map.note, /奧斯威辛 Oświęcim／Brzezinka/);
  assert.match(map.note, /晚間抵達城市不納入本圖/);
});

test('建置後城市表格由可見標題提供名稱', () => {
  for (const city of ['krakow', 'warszawa', 'wroclaw', 'poznan']) {
    const html = fs.readFileSync(`dist/city-${city}.html`, 'utf8');
    const tables = [...html.matchAll(/<table\b[^>]*>/g)];
    assert.ok(tables.length > 0);
    for (const [table] of tables) {
      const label = table.match(/aria-labelledby="([^"]+)"/);
      assert.ok(label, `${city}: ${table}`);
      assert.ok(html.includes(`id="${label[1]}"`));
    }
  }
});

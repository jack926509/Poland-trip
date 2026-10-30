import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { days } from '../src/data/trip.js';
import { dayDining } from '../src/data/day-dining.js';
import { dayOperations } from '../src/data/travel-database.js';
import { makeDayMap } from '../src/lib/day-map.mjs';
import { renderToday } from '../src/templates/today.mjs';
import { meta, stay } from '../src/data/trip.js';
import { daylight, safety } from '../src/data/essentials.js';
const day = days.find(d => d.n === 7);
const hash = steps => createHash('sha256').update(JSON.stringify(steps)).digest('hex');
test('Day 7 指定下午時間與上午 hash', () => {
  assert.deepEqual(day.steps.filter(s => s.t >= '13:45').map(s => s.t), ['13:45','14:10','14:25','15:00','15:20','15:45','16:30','16:55','17:40','17:50','18:00','20:15']);
  const morning = structuredClone(day.steps.filter(s => s.t < '13:45'));
  morning.at(-1).sub = morning.at(-1).sub.replace('接著到水上宮殿', '仍要在 16:12 日落前到水上宮殿');
  assert.equal(hash(morning), '019acb68f1529180758ace7b5105b7e88365d4319302ff1dab29fbaf737295f1');
});
test('Day 7 全資料無看日落安排，主線交通與採買齊全', () => {
  const all = JSON.stringify({day, food:dayDining[7], operations:dayOperations[7]});
  assert.doesNotMatch(all, /日落|藍調|16:12|倒影|Bolt|Uber|叫車|計程車|Agrykola|如果放晴|電話確認/);
  const main = JSON.stringify(day.steps);
  for (const text of ['116','180','Hotel Bristol','Łazienki Królewskie','最後入場 17:30','4、16、18','Pl. Unii Lubelskiej','Centrum','Złote Tarasy','Ziaja','144','20 分鐘票 3.40 zł','出發前用 Jakdojade 確認']) assert.ok(main.includes(text), text);
  assert.doesNotMatch(main, /Hala Koszyki|M2/);
});
test('Day 7 隱藏日照，其他日與今日卡保持逐日判斷', () => {
  assert.equal(day.hideDaylight, true);
  assert.ok(days.filter(d => d.n !== 7).every(d => !d.hideDaylight));
  assert.doesNotMatch(readFileSync('dist/day-07.html','utf8'), /<h3>日照<\/h3>/);
  assert.match(readFileSync('dist/day-06.html','utf8'), /<h3>日照<\/h3>/);
  const today = renderToday({ meta, days:[day], stay, daylight, safety });
  assert.doesNotMatch(today, /class="today-weather-sun"/);
  assert.match(renderToday({meta, days:[days.find(d => d.n === 6)], stay, daylight, safety}), /class="today-weather-sun"/);
});
test('Day 7 地圖依時間序列並保留已查證座標及商場範圍狀態', () => {
  const map = makeDayMap(day);
  const sequence = ['聖十字教堂 Kościół św. Krzyża','哥白尼紀念碑 Pomnik Kopernika','Tamka 街蕭邦長椅','河岸美人魚像 Syrena','BUW 華沙大學圖書館屋頂花園','瓦津基公園 · 蕭邦紀念碑','水上宮殿 Pałac na Wyspie','Złote Tarasy','Soul Kitchen','Pijalnia Czekolady E.Wedel（巧克力）'];
  const rows = sequence.map(n => map.points.find(p => p[2] === n)[8]);
  assert.deepEqual(rows, [14,15,15,15,16,18,18,20,23,24]);
  assert.deepEqual(map.points.find(p=>p[2] === 'Tamka 街蕭邦長椅').slice(0,2), [52.236343,21.0232557]);
  assert.equal(map.checks['Złote Tarasy'].status, 'area-reference');
});

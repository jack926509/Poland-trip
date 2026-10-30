import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {days} from '../src/data/trip.js';
import {dayDining} from '../src/data/day-dining.js';
import {dayOperations} from '../src/data/travel-database.js';
import {makeDayMap} from '../src/lib/day-map.mjs';
const day = days.find(d => d.n === 8);
const forbidden = /衛兵|無名塚|薩克森|劇院廣場|Blikle|棕櫚|Bułkę przez Bibułkę|叫車|計程車|Bolt|Uber|電話確認/;
test('Day 8 A 方案時間序列與 b151e99 機場段保持一致', () => {
  assert.deepEqual(day.steps.slice(0,8).map(s=>s.t), ['07:50','08:00','08:35','09:00','09:20','09:40','09:45','10:05']);
  assert.match(day.steps[5].label, /約 09:40/);
  // b151e99 的 10:05 起全部 steps，JSON.stringify 後的 SHA-256。
  assert.equal(createHash('sha256').update(JSON.stringify(day.steps.slice(7))).digest('hex'), '88eea5a6268ee320773148740deb5b64206bbf59586283bcfcb22fd9a5195f13');
});
test('Day 8 清除舊早上與禁止內容，保留新方案查核資訊', () => {
  const text = JSON.stringify({day, dining:dayDining[8], operation:dayOperations[8]});
  assert.doesNotMatch(text, forbidden);
  for (const word of ['BAKEN','Żurawia 6/12','4.4','第三方','Wanderlog 10/30 查，出發前再確認','Plac Trzech Krzyży','Al. Ujazdowskie','蕭邦紀念碑','06:00–21:00','Pl. Unii Lubelskiej','4／16／18','20 分鐘票 3.40 zł','10/31 週六班表，出發前用 Jakdojade 確認','180','改道','累了可略過']) assert.ok(text.includes(word), word);
  assert.ok(!day.steps.some(s=>s.id==='d8-dessert'));
  assert.ok(!dayDining[8].some(s=>s.stepId==='d8-dessert'));
  assert.doesNotMatch(JSON.stringify({day:days[6],operation:dayOperations[7]}), /衛兵|07:20/);
});
test('Day 8 地圖順序、查證座標與範圍代表點', () => {
  const map=makeDayMap(day);
  assert.deepEqual(map.points.map(p=>p[2]), ['Hotel Metropol','BAKEN piekarnia','三十字廣場 Plac Trzech Krzyży','瓦津基公園 · 蕭邦紀念碑','Pl. Unii Lubelskiej','Warszawa Centralna','Warszawa Śródmieście','Warszawa Lotnisko Chopina 機場鐵路站']);
  assert.doesNotMatch(JSON.stringify(map), forbidden);
  assert.deepEqual(map.points.slice(0,5).map(p=>p.slice(0,2)), [[52.2290162,21.0109879],[52.2290438,21.0178075],[52.2286979,21.0225486],[52.2147016,21.0280881],[52.2135765,21.0216761]]);
  for(const name of ['三十字廣場 Plac Trzech Krzyży','Pl. Unii Lubelskiej']) assert.equal(map.checks[name].status,'area-reference');
});

import {auditDay8SupplementaryPins} from '../tools/audit-map-pins.mjs';
import {daySupplementaryPins, pinCoordinateCheckedAt} from '../src/data/day-maps.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {diningPlaces} from '../src/data/dining-places.js';
import {createHash} from 'node:crypto';
import {days} from '../src/data/trip.js';
import {dayDining} from '../src/data/day-dining.js';
import {dayOperations} from '../src/data/travel-database.js';
import {makeDayMap} from '../src/lib/day-map.mjs';
const day = days.find(d => d.n === 8);
const forbidden = /衛兵|無名塚|薩克森|劇院廣場|Blikle|棕櫚|Bułkę przez Bibułkę|叫車|計程車|Bolt|Uber|電話確認/;
test('Day 8 優化版時間序列與 b151e99 機場段保持一致', () => {
  assert.deepEqual(day.steps.slice(0,8).map(s=>s.t), ['07:30','07:55','08:00','08:45','09:00','09:35','09:45','10:05']);
  assert.doesNotMatch(JSON.stringify(day.steps.slice(0,7)), /07:50|09:20|09:40/);
  // b151e99 的 10:05 起全部 steps，JSON.stringify 後的 SHA-256。
  assert.equal(createHash('sha256').update(JSON.stringify(day.steps.slice(7))).digest('hex'), '88eea5a6268ee320773148740deb5b64206bbf59586283bcfcb22fd9a5195f13');
});
test('Day 8 清除舊早上與禁止內容，保留新方案查核資訊', () => {
  const text = JSON.stringify({day, dining:dayDining[8], operation:dayOperations[8]});
  assert.doesNotMatch(text, forbidden);
  for (const word of ['116','Łazienki Królewskie','湖邊倒影','BAKEN','Żurawia 6/12','4.4','第三方','Wanderlog 10/30 查，出發前再確認','Plac Trzech Krzyży','Al. Ujazdowskie','蕭邦紀念碑','06:00–21:00','Pl. Unii Lubelskiej','4／16／18','20 分鐘票 3.40 zł','10/31 週六班表與站名，出發前用 Jakdojade 確認','180','改道','累了可略過']) assert.ok(text.includes(word), word);
  assert.equal(day.steps[4].id, 'd8-breakfast');
  assert.match(dayDining[8].find(s=>s.stepId==='d8-breakfast').note, /09:00–09:35/);
  assert.deepEqual(day.hardConstraints, ['09:45 退房、10:05 出門','11:00 前抵達華沙蕭邦機場','早上只排戶外散步與早餐、不進館']);
  assert.ok(!day.steps.some(s=>s.id==='d8-dessert'));
  assert.ok(!dayDining[8].some(s=>s.stepId==='d8-dessert'));
  assert.doesNotMatch(JSON.stringify({day:days[6],operation:dayOperations[7]}), /衛兵|07:20/);
});
test('Day 8 地圖順序、查證座標與範圍代表點', () => {
  const map=makeDayMap(day);
  assert.deepEqual(map.points.map(p=>p[2]), ['Hotel Metropol','三十字廣場 Plac Trzech Krzyży','瓦津基公園 · 蕭邦紀念碑','水上宮殿 Pałac na Wyspie','Łazienki Królewskie 02','BAKEN piekarnia','Warszawa Śródmieście','Warszawa Centralna','Warszawa Lotnisko Chopina 機場鐵路站']);
  assert.doesNotMatch(JSON.stringify(map), forbidden);
  assert.deepEqual(map.points.slice(0,6).map(p=>p.slice(0,2)), [[52.2290162,21.0109879],[52.2286979,21.0225486],[52.2147016,21.0280881],[52.2150560,21.0358058],[52.2144281,21.0264927],[52.2290438,21.0178075]]);
  assert.equal(map.checks['三十字廣場 Plac Trzech Krzyży'].status,'area-reference');
  assert.equal(map.checks['水上宮殿 Pałac na Wyspie'].coordinateSource,'https://www.openstreetmap.org/way/1325609735');
  assert.equal(map.checks['Łazienki Królewskie 02'].coordinateSource,'https://www.openstreetmap.org/node/3037257659');
  assert.equal(map.checks['Łazienki Królewskie 02'].checkedAt,'2026-10-30');
  assert.equal(map.points[4][5],'transport');
  assert.deepEqual(map.points.slice(0,6).map(p=>p[10]), [[1,6,7],[1],[2,3],[3],[4],[5]]);
  assert.ok(!map.points.some(p=>p[2]==='Pl. Unii Lubelskiej'));
});

test('Day 8 地圖標籤保留早上時間與回飯店安排', () => {
  const {points} = makeDayMap(day);
  const label = name => points.find(p => p[2] === name)[3];
  assert.match(label('瓦津基公園 · 蕭邦紀念碑'), /08:00–08:45/);
  assert.match(label('水上宮殿 Pałac na Wyspie'), /08:00–08:45/);
  assert.match(label('Łazienki Królewskie 02'), /08:45/);
  assert.match(label('BAKEN piekarnia'), /09:00–09:35/);
  assert.match(label('Hotel Metropol'), /07:30 出發/);
  assert.match(label('Hotel Metropol'), /09:35 步行回飯店/);
});
test('查 10/31 交通的前一晚提醒保留在 Day 7，移出 Day 8', () => {
  assert.doesNotMatch(JSON.stringify(dayOperations[8].nightChecklist), /Jakdojade 查 10\/31/);
  assert.match(JSON.stringify(dayOperations[7].nightChecklist), /前一晚用 Jakdojade 查 10\/31/);
});

test('Day 8 機場段快照逐欄保持不變', () => {
  assert.deepEqual(day.steps.slice(7), JSON.parse(readFileSync(new URL('./fixtures/day8-airport-1031.json', import.meta.url), 'utf8')));
});
test('BAKEN 建置卡片完整、官網與第三方來源及無電話', () => {
  const place = diningPlaces['warsaw-baken'];
  assert.equal(place.sourceUrl, 'https://wanderlog.com/place/details/5761970/baken-piekarnia');
  assert.equal(place.officialUrl, 'https://baken.pl/');
  assert.doesNotMatch(JSON.stringify({place, meal:dayDining[8][0], step:day.steps[4], address:dayOperations[8].addresses.find(a=>a.name==='BAKEN piekarnia')}), /602[ -]?157[ -]?120|\+48|電話/);
  for (const file of ['day-08.html','city-warszawa.html']) {
    const html = readFileSync(new URL('../dist/'+file, import.meta.url), 'utf8');
    for (const text of [place.sourceUrl, place.officialUrl, '不收訂位，現場排隊', '每日 08:00–16:30（官網 10/30 查，出發前再確認）', '評分來自第三方評論', '4.4／約 1,400 則']) assert.ok(html.includes(text), file+': '+text);
    assert.ok(!html.includes('https://wanderlog.com/"'));
    assert.ok(!html.includes('自家酸種麵包；出發前再確認）'));
  }
  const city = readFileSync(new URL('../dist/city-warszawa.html', import.meta.url), 'utf8');
  assert.ok(city.includes('早餐首選：Żurawia 6/12，09:00–09:35 丹麥風早餐、自家酸種麵包。'));
});
test('機場圖釘對應抵達第 10 列並顯示編號', () => {
  const map = makeDayMap(day);
  const row = day.steps.findIndex(s=>s.label==='抵 Chopin 第一航廈')+1;
  assert.equal(row,10);
  assert.deepEqual(map.points.find(p=>p[2]==='Warszawa Lotnisko Chopina 機場鐵路站')[10],[row]);
  const html = readFileSync(new URL('../dist/day-08.html', import.meta.url), 'utf8');
  assert.match(html, /title="地圖上的 10 號圖釘"><span class="visually-hidden">地圖圖釘 <\/span>10<\/span>抵 Chopin 第一航廈/);
});

test('Day 8 補充圖釘稽核攔截座標、來源、日期、分類及重名', () => {
  assert.deepEqual(auditDay8SupplementaryPins().issues, []);
  for (const [field,value] of [[0,NaN],[1,0],[4,'http://invalid'],[5,'invalid'],[6,'https://invalid/']]) {
    const points = structuredClone(daySupplementaryPins[8]);
    points[0][field] = value;
    assert.ok(auditDay8SupplementaryPins(points).issues.length);
  }
  assert.ok(auditDay8SupplementaryPins(daySupplementaryPins[8], {}).issues.length);
  assert.ok(auditDay8SupplementaryPins([...daySupplementaryPins[8],daySupplementaryPins[8][0]],pinCoordinateCheckedAt[8]).issues.length);
});

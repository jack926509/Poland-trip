import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { days } from '../src/data/trip.js';
import { dayDining } from '../src/data/day-dining.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { dayOperations } from '../src/data/travel-database.js';
import { dayPinStepRows, pinCoordinateCheckedAt } from '../src/data/day-maps.js';
import { makeDayMap } from '../src/lib/day-map.mjs';
const day = days.find(d => d.n === 7);
const points = makeDayMap(day).points;

test('Day 7 完整時間線依新版合併列，三餐卡對應正確 stepId', () => {
  const timeline = [
    ['08:00', /Metropol.*出發/], ['08:10', /Bułkę/], ['08:55', /MSN.*M1/],
    ['09:25', /POLIN/], ['09:50', /克拉辛斯基/], ['10:10', /新城.*聖母訪親.*Freta/],
    ['10:55', /甕城/], ['11:20', /老城廣場/], ['11:45', /石階街/],
    ['12:05', /聖若望.*Piwna/], ['12:30', /城堡廣場.*聖安妮/], ['12:50', /Gospoda pod Zygmuntem/],
    ['13:50', /皇家大道/], ['14:15', /聖十字/], ['14:30', /哥白尼.*Tamka.*美人魚/],
    ['15:00', /BUW/], ['15:25', /叫 Bolt.*蕭邦紀念碑/], ['15:55', /水上宮殿/],
    ['16:40', /Agrykola/], ['17:50', /Soul Kitchen/], ['18:00', /Soul Kitchen/], ['20:15', /E.Wedel/],
  ];
  assert.equal(day.steps.length, timeline.length);
  timeline.forEach(([time, label], i) => { assert.equal(day.steps[i].t, time); assert.match(day.steps[i].label, label); });
  for (const [id, placeId, time] of [
    ['d7-breakfast', 'warsaw-bulke-przez-bibulke-zgoda', '08:10'],
    ['d7-lunch', 'warsaw-gospoda-pod-zygmuntem', '12:50'], ['d7-dinner', 'warsaw-soul-kitchen', '18:00'],
  ]) {
    assert.equal(dayDining[7].find(e => e.stepId === id).placeId, placeId);
    assert.equal(day.steps.find(s => s.id === id).t, time);
  }
  assert.equal(day.steps[1].dur, '40 min');
  assert.equal(day.steps[11].dur, '55 min');
});

test('Day 7 移除 Polka／Pyzy，早餐與午餐備案及評分快照標示來源', () => {
  assert.doesNotMatch(JSON.stringify({day, food:dayDining[7], operation:dayOperations[7], points}), /Polka|Pyzy|warsaw-polka|warsaw-pyzy/);
  for (const [id, address, hours, rating] of [
    ['warsaw-gospoda-pod-zygmuntem', 'Świętojańska 15', '11:00–23:00', '15,253'],
    ['warsaw-gosciniec-polskie-pierogi', 'Krakowskie Przedmieście 29', '11:00–23:30', '24,488'],
  ]) {
    const place = diningPlaces[id];
    assert.ok(place.address.includes(address));
    assert.ok(place.hours.includes(hours));
    assert.match(place.hours, /出發前再確認/);
    assert.ok(place.notes.join(' ').includes(`Google 4.7／${rating} 則評論，評分來自第三方 Google 評論`));
  }
  const breakfast = dayDining[7].find(e => e.placeId === 'warsaw-kubus-piekarenka-marszalkowska');
  assert.match(breakfast.note, /Marszałkowska 19.*08:00–20:00.*出發前再確認.*1.8 km/);
  assert.match(day.backup[0].label, /Gospoda 客滿 → Gościniec/);
  assert.match(day.backup[0].why, /14:00/);
});

test('Day 7 保留查證說明、日落與訂位限制，公開內容不含敏感編號或禁用用語', () => {
  const text = JSON.stringify({day, food:dayDining[7], operation:dayOperations[7], points});
  assert.doesNotMatch(text, /PNR|訂位編號|票號[:：\s]*[A-Z0-9]|座位(?:號)?[:：\s]*\d|電話確認|打電話|颱風/);
  assert.match(day.steps[10].sub, /觀景台.*整修.*swanna\.waw\.pl/);
  assert.match(day.steps[15].sub, /官方說法不一致.*18:00 保守規劃/);
  assert.match(day.warn, /週五僅開放一樓/);
  assert.match(day.steps[17].sub, /16:12 日落/);
  assert.match(day.steps[20].sub, /保留訂位 15 分鐘.*1 份 Beef Wellington/);
  assert.match(dayOperations[6].nightChecklist.join(' '), /08:00 出門，08:10–08:50/);
});

const order = [
  ['Hotel Metropol','1'], ['Bułkę przez Bibułkę','2'], ['MSN 現代美術館','3a'], ['科學文化宮觀景台','3b'],
  ['POLIN 波蘭猶太人歷史博物館（外觀）','4'], ['克拉辛斯基廣場・起義紀念碑','5'],
  ['新城廣場 Rynek Nowego Miasta','6a'], ['聖母訪親教堂','6b'], ['Freta 16 居禮夫人出生地','6c'],
  ['甕城 Barbakan','7'], ['華沙老城市場廣場','8'], ['聖若望大教堂','10a'], ['聖馬丁教堂','10b'],
  ['皇家城堡','11a'], ['聖安妮教堂（外觀）','11b'], ['Gospoda pod Zygmuntem','12'],
  ['總統府（外觀）','13a'], ['Café Bristol','13b'], ['訪親會教堂 Kościół Wizytek','13c'], ['普魯斯紀念碑','13d'],
  ['聖十字教堂 Kościół św. Krzyża','14'], ['哥白尼紀念碑 Pomnik Kopernika','15a'], ['Ostrogski 宮（外觀）','15b'],
  ['河岸美人魚像 Syrena','15c'], ['BUW 華沙大學圖書館屋頂花園','16'], ['瓦津基公園 · 蕭邦紀念碑','17'],
  ['水上宮殿 Pałac na Wyspie','18'], ['Soul Kitchen','21'], ['Pijalnia Czekolady E.Wedel（巧克力）','22'],
];
test('Day 7 全部地圖圖釘對回新版列序，同行依走法標 a/b/c', () => {
  assert.equal(points.length, order.length);
  assert.deepEqual(Object.keys(dayPinStepRows[7]).sort(), points.map(p=>p[2]).sort());
  for (const [name, label] of order) {
    const pin = points.find(p => p[2] === name);
    const row = Number.parseInt(label);
    assert.equal(pin[9], label, name);
    assert.deepEqual(pin[10], [row], name);
    assert.ok(day.steps[row - 1]);
  }
  const pin = points.find(p => p[2] === 'Gospoda pod Zygmuntem');
  assert.deepEqual(pin.slice(0,2), [52.2486172,21.0130097]);
  assert.equal(pin[6], 'https://www.openstreetmap.org/node/447986211');
  assert.equal(pinCoordinateCheckedAt[7][pin[2]], '2026-10-30');
  assert.ok(!points.some(p=>/Gościniec|Kubuś|Polka|Pyzy/.test(p[2])));
});

test('Day 7 重建頁與 standalone 含新時間線及午餐', () => {
  for (const path of ['dist/day-07.html', 'poland-travel-guide-2026.html']) {
    const html = readFileSync(new URL('../'+path, import.meta.url),'utf8');
    for (const value of ['Gospoda pod Zygmuntem', '15:25', '15:55', '評分來自第三方 Google 評論']) assert.ok(html.includes(value), `${path}: ${value}`);
  }
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { photoSpots } from '../src/data/cities.js';
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
    ['13:45', /皇家大道/], ['14:10', /聖十字/], ['14:25', /哥白尼.*Tamka.*美人魚/],
    ['15:00', /BUW/], ['15:20', /公車 116／180/], ['15:45', /水上宮殿/],
    ['16:15', /電車 4／16／18.*Centrum/], ['16:45', /^Złote Tarasy/], ['17:30', /回 Metropol/], ['17:50', /步行前往 Soul Kitchen/], ['18:00', /最後晚餐.*Soul Kitchen/], ['20:15', /E.Wedel/],
  ];
  assert.equal(day.steps.length, timeline.length);
  timeline.forEach(([time, label]) => {
    const step = day.steps.find(s => label.test(s.label));
    assert.ok(step, String(label));
    assert.equal(step.t, time);
    assert.match(step.label, label);
  });
  assert.deepEqual(day.steps.map(s => s.t), timeline.map(([time]) => time));
  for (const [id, placeId, time] of [
    ['d7-breakfast', 'warsaw-bulke-przez-bibulke-zgoda', '08:10'],
    ['d7-lunch', 'warsaw-gospoda-pod-zygmuntem', '12:50'], ['d7-dinner', 'warsaw-soul-kitchen', '18:00'],
  ]) {
    assert.equal(dayDining[7].find(e => e.stepId === id).placeId, placeId);
    assert.equal(day.steps.find(s => s.id === id).t, time);
  }
  assert.equal(day.steps.find(s => s.id === 'd7-breakfast').dur, '40 min');
  assert.equal(day.steps.find(s => s.id === 'd7-lunch').dur, '55 min');
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

test('Day 7 Gościniec 備案銜接皇家大道、Tamka 公車與水上宮殿', () => {
  const backup = day.backup.find(e => /Gospoda 客滿 → Gościniec/.test(e.label));
  const dining = dayDining[7].find(e => e.placeId === 'warsaw-gosciniec-polskie-pierogi');
  const navigation = dayOperations[7].navigation.find(e => /POLIN →/.test(e.route));
  for (const text of [backup.why, dining.note, navigation.action]) {
    assert.match(text, /12:50 從城堡廣場.*皇家大道往南走.*總統府、Bristol、訪親會教堂、華沙大學/);
    assert.match(text, /約 14:00 在 Krakowskie Przedmieście 29 吃午餐.*吃完接聖十字教堂、哥白尼紀念碑、Tamka 街蕭邦長椅/);
    assert.match(text, /刪掉 BUW 屋頂花園和河邊美人魚.*從 Tamka 走回 Nowy Świat 搭 116 或 180 到 Łazienki Królewskie.*接著到水上宮殿/);
  }
  assert.match(day.steps.find(s => s.id === 'd7-lunch').sub, /刪掉 BUW.*從 Tamka 走回 Nowy Świat 搭 116 或 180 到 Łazienki Królewskie.*接著到水上宮殿/);
});

test('Day 7 保留查證說明、入場與訂位限制，公開內容不含敏感編號或禁用用語', () => {
  const text = JSON.stringify({day, food:dayDining[7], operation:dayOperations[7], points});
  assert.doesNotMatch(text, /PNR|訂位編號|票號[:：\s]*[A-Z0-9]|座位(?:號)?[:：\s]*\d|電話確認|打電話|颱風/);
  assert.match(day.steps.find(s => /城堡廣場.*聖安妮/.test(s.label)).sub, /觀景台.*整修.*swanna\.waw\.pl/);
  assert.match(day.steps.find(s => /BUW/.test(s.label)).sub, /官方說法不一致.*18:00 保守規劃/);
  assert.match(day.warn, /週五僅開放一樓/);
  assert.match(day.steps.find(s => /水上宮殿/.test(s.label)).sub, /最後入場 17:30/);
  assert.match(day.steps.find(s => s.id === 'd7-dinner').sub, /保留訂位 15 分鐘.*1 份 Beef Wellington/);
  assert.match(dayOperations[6].nightChecklist.join(' '), /08:00 出門，08:10–08:50/);
});

const order = [
  ['Hotel Metropol','1·21'], ['Bułkę przez Bibułkę','2'], ['MSN 現代美術館','3a'], ['科學文化宮觀景台','3b'],
  ['POLIN 波蘭猶太人歷史博物館（外觀）','4'], ['克拉辛斯基廣場・起義紀念碑','5'],
  ['新城廣場 Rynek Nowego Miasta','6a'], ['聖母訪親教堂','6b'], ['Freta 16 居禮夫人出生地','6c'],
  ['甕城 Barbakan','7'], ['華沙老城市場廣場','8'], ['聖若望大教堂','10a'], ['聖馬丁教堂','10b'],
  ['皇家城堡','11a'], ['聖安妮教堂（外觀）','11b'], ['Gospoda pod Zygmuntem','12'],
  ['總統府（外觀）','13a'], ['Café Bristol','13b'], ['訪親會教堂 Kościół Wizytek','13c'], ['普魯斯紀念碑','13d'],
  ['聖十字教堂 Kościół św. Krzyża','14'], ['哥白尼紀念碑 Pomnik Kopernika','15a'], ['Ostrogski 宮（外觀）','15c'],
  ['Tamka 街蕭邦長椅','15b'], ['河岸美人魚像 Syrena','15d'], ['BUW 華沙大學圖書館屋頂花園','16'], ['瓦津基公園 · 蕭邦紀念碑','18a'],
  ['水上宮殿 Pałac na Wyspie','18b'], ['Złote Tarasy','20'], ['Soul Kitchen','23'], ['Pijalnia Czekolady E.Wedel（巧克力）','24'],
];
test('Day 7 全部地圖圖釘對回新版列序，同行依走法標 a/b/c', () => {
  assert.equal(points.length, order.length);
  assert.deepEqual(Object.keys(dayPinStepRows[7]).sort(), points.map(p=>p[2]).sort());
  for (const [name, label] of order) {
    const pin = points.find(p => p[2] === name);
    const row = Number.parseInt(label);
    assert.equal(pin[9], label, name);
    assert.deepEqual(pin[10], name === 'Hotel Metropol' ? [1, 21] : [row], name);
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
    for (const value of ['Gospoda pod Zygmuntem', '15:20', '15:45', '評分來自第三方 Google 評論', '刪掉 BUW 屋頂花園和河邊美人魚', '從 Tamka 走回 Nowy Świat 搭 116 或 180 到 Łazienki Królewskie', '接著到水上宮殿']) assert.ok(html.includes(value), `${path}: ${value}`);
  }
});

test('Day 7 拍照建議起點落在對應行程列的時間窗內', () => {
  const labels = {
    'waw-oldtown': /老城廣場/,
    'waw-castle': /城堡廣場.*聖安妮/,
  };
  const minutes = time => {
    const [hours, mins] = time.split(':').map(Number);
    return hours * 60 + mins;
  };
  for (const [id, label] of Object.entries(labels)) {
    const spot = photoSpots.find(p => p.day === 7 && p.id === id);
    const step = day.steps.find(s => label.test(s.label));
    assert.ok(spot, id);
    assert.ok(step, id);
    assert.match(step.dur, /^\d+ min$/);
    const start = minutes(spot.bestTime.split('–')[0]);
    const stepStart = minutes(step.t);
    assert.ok(start >= stepStart && start < stepStart + Number.parseInt(step.dur), `${id}: ${spot.bestTime} / ${step.t} + ${step.dur}`);
  }
});

test('Day 7 下午全程大眾運輸、票券與北門回程鎖定', () => {
  const bus = day.steps.find(s => s.t === '15:20');
  const palace = day.steps.find(s => s.t === '15:45');
  const tram = day.steps.find(s => s.t === '16:15');
  assert.match(bus.label, /公車 116／180/);
  assert.match(bus.sub, /Karowa.*Hotel Bristol.*116 或 180.*Łazienki Królewskie/);
  assert.match(bus.sub, /推估.*出發前用 Jakdojade 確認/);
  assert.match(bus.sub, /06:00–21:00 免費（出發前再確認）/);
  assert.equal(bus.dur, '25 min');
  assert.equal(day.steps.find(s => s.t === '15:00').dur, '20 min');
  assert.match(palace.sub, /週五.*免費.*一樓.*最後入場 17:30/);
  assert.equal(palace.dur, '30 min');
  assert.match(tram.sub, /主步道.*北門.*Al. Ujazdowskie.*Pl. Unii Lubelskiej.*電車 4、16、18.*Centrum.*Złote Tarasy.*16:45.*推估/);
  assert.equal(tram.dur, '30 min');
  for (const step of [bus, tram]) {
    assert.match(step.cost, /20 分鐘票 3.40 zł.*上車馬上打票.*Jakdojade 啟用/);
    assert.match(step.sub, /出發前用 Jakdojade 確認/);
  }
  assert.equal(day.steps.find(s => s.t === '08:55').cost, '75 分第 1 區票 4.40');
  assert.doesNotMatch(JSON.stringify({steps:day.steps, hardConstraints:day.hardConstraints, compressible:day.compressible, backup:day.backup, warn:day.warn, navigation:dayOperations[7].navigation, points}), /Bolt|Uber|計程車|叫車|Agrykola|15:25|15:55/);
  assert.match(day.compressible.join(' '), /從 Tamka 走回 Nowy Świat 搭 116 或 180 到 Łazienki Królewskie/);
  assert.match(day.backup.find(b => b.label === '體力不足').where, /Nowy Świat 搭 116 或 180/);
  assert.match(dayOperations[7].nightChecklist.join(' '), /出發前用 Jakdojade 確認/);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { days, todoGroups } from '../src/data/trip.js';
import { dayDining } from '../src/data/day-dining.js';
import { dayPinStepRows, pinCoordinateCheckedAt } from '../src/data/day-maps.js';
import { makeDayMap } from '../src/lib/day-map.mjs';

const day = days.find(d => d.n === 6);
const points = makeDayMap(day).points;
const pin = name => points.find(p => p[2] === name);

test('Day 6 09:00 新時間線、餐段與已購列車及華沙晚間時間保留', () => {
  for (const [time, text] of [
    ['09:00', /退房/], ['09:10', /置物櫃/], ['09:25', /電車 6/],
    ['09:44', /Śródka/], ['10:02', /教堂島/], ['10:35', /Chwaliszewo/],
    ['11:00', /Manekin/], ['11:30', /皇家城堡山丘/], ['11:55', /卡正面/],
    ['12:00', /山羊/], ['12:05', /牛角麵包/], ['12:15', /Fara/],
    ['12:30', /Plac Wolności/], ['13:00', /Stary Browar/], ['14:15', /Okrąglak/],
    ['14:25', /帝王區/], ['15:08', /Kaponiera/], ['15:45', /走回/],
    ['16:00', /取行李/], ['17:10', /月台/], ['17:40', /EIC 8104/],
    ['19:59', /Warszawa Centralna/], ['20:15', /Hotel Metropol/], ['20:20', /Arirang/],
    ['21:15', /Złote Tarasy/], ['21:55', /科學文化宮/], ['22:10', /Hotel Metropol/],
  ]) assert.match(day.steps.find(s => s.t === time)?.label || '', text, time);
  for (const [meal, id, time] of [['breakfast','poznan-manekin','11:00'], ['lunch','poznan-stary-browar-food-hall','13:00']]) {
    const entry = dayDining[6].find(e => e.meal === meal);
    assert.equal(entry.placeId, id);
    assert.equal(day.steps.find(s => s.id === entry.stepId).t, time);
  }
  assert.match(day.steps.find(s => s.t === '17:10').sub, /17:15 前/);
  assert.match(day.steps.find(s => s.t === '17:40').sub, /17:40 → 19:59/);
  assert.match(day.steps.find(s => s.t === '12:00').sub, /不動就不重排/);
  assert.match(day.steps.find(s => s.t === '12:15').sub, /12:28 前/);
  assert.match(day.steps.find(s => s.t === '14:25').sub, /帝王城堡外觀（不進去）/);
});

test('Day 6 置物櫃、電車資訊與舊行程及隱私防護', () => {
  const text = JSON.stringify({day, dining:dayDining[6], points, todos:todoGroups.flatMap(g => g.items).filter(i => i.date === '10/29')});
  assert.doesNotMatch(text, /Cytadela|Charlotte Krysiewicza|Weranda|Carla|Armii Poznań|Nierozpoznani|寄放公寓/);
  assert.doesNotMatch(text, /PNR|訂位編號|票號[:：\s]*[A-Z0-9]|座位(?:號)?[:：\s]*\d|電話確認|打電話|颱風/);
  const storage = day.steps.find(s => s.t === '09:10').sub;
  for (const pattern of [/24 小時/, /20 zł/, /25 zł/, /TripAdvisor/, /感應付款/, /出發前再確認/, /Radical Storage Dworcowa 1/, /06:00–21:00/, /15 zł/]) assert.match(storage, pattern);
  const tram = day.steps.find(s => s.t === '09:25').sub;
  for (const pattern of [/POGL42/, /Miłostowo/, /09:14 電車 5/, /第三方推算，出發前再確認/, /45 分鐘票 7 zł\/人/, /兩人 14 zł/, /外國卡未確認，備現金/]) assert.match(tram, pattern);
  assert.match(day.steps[0].sub, /官方未寫公寓能否寄放/);
});

const order = [
  ['Poznan Apartments Towarowa','1',[1]], ['Poznań Główny','2·19·20',[2,19,20]],
  ['Śródka 壁畫','4',[4]], ['大教堂島 Ostrów Tumski','5a',[5]], ['波茲南主教座堂','5b',[5]],
  ['Manekin','7',[7]], ['皇家城堡山丘（Przemysł 王城）','8',[8]], ['舊市集廣場 Stary Rynek','9',[9]],
  ['波茲南市政廳・山羊鐘樓','10',[10]], ['ROGAL Świętomarciński','11a',[11]], ['Rogalowe Muzeum','11b',[11]],
  ['Fara 粉紅教堂','12',[12]], ['自由廣場 Plac Wolności','13a',[13]], ['Raczyński 圖書館','13b',[13]],
  ['Stary Browar','14',[14]], ['Okrąglak 圓形百貨','15',[15]], ['Collegium Minus','16a',[16]],
  ['Park Mickiewicza','16b',[16]], ['帝王城堡 Zamek Cesarski（外觀）','16c',[16]],
  ['Kaponiera「5 Figur」','17a',[17]], ['Bałtyk 大樓','17b',[17]],
];
test('Day 6 每顆圖釘依時間表列序編號，同行 a/b/c 依走法排序', () => {
  assert.equal(points.length, order.length);
  assert.deepEqual(Object.keys(dayPinStepRows[6]).sort(), points.map(p => p[2]).sort());
  for (const [name,label,rows] of order) {
    assert.equal(pin(name)[9], label, name);
    assert.deepEqual(pin(name)[10], rows, name);
    assert.deepEqual(label.split('·').map(s => Number.parseInt(s)), rows);
    for (const row of rows) assert.ok(day.steps[row - 1]);
  }
  assert.match(day.steps[18].label, /取行李/);
  assert.match(day.steps[15].sub, /Collegium Minus → Park Mickiewicza .*帝王城堡/);
});

test('Day 6 新增圖釘使用 Nominatim 查證座標、具體 OSM 來源與日期', () => {
  for (const [name,lat,lon,source] of [
    ['Manekin',52.4023960,16.9306208,'node/2212580603'],
    ['Fara 粉紅教堂',52.4062459,16.9340506,'way/365954906'],
    ['Rogalowe Muzeum',52.4083948,16.9348606,'way/366976788'],
    ['Raczyński 圖書館',52.4084386,16.9286465,'way/169874406'],
    ['Collegium Minus',52.4081657,16.9156127,'way/129557623'],
    ['Park Mickiewicza',52.4087909,16.9168701,'way/323061961'],
    ['Bałtyk 大樓',52.4070893,16.9116794,'way/490881244'],
  ]) {
    assert.deepEqual(pin(name).slice(0,2), [lat,lon]);
    assert.equal(pin(name)[6], `https://www.openstreetmap.org/${source}`);
    assert.equal(pinCoordinateCheckedAt[6][name], '2026-10-28');
    assert.ok(lat > 52.39 && lat < 52.43 && lon > 16.90 && lon < 16.97);
    assert.match(pin(name)[4], /^https:\/\//);
  }
  assert.match(pin('Rogalowe Muzeum')[3], /門牌建物/);
  assert.ok(!points.some(p => /1956/.test(p[2])));
  assert.match(day.steps[15].sub, /1956 年六月事件紀念碑（座標未驗證）/);
});

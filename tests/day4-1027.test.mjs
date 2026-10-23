import { test } from 'node:test';
import assert from 'node:assert/strict';
import { days } from '../src/data/trip.js';
import { dayDining } from '../src/data/day-dining.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { daySupplementaryPins, dayMapPlans, pinCoordinateCheckedAt } from '../src/data/day-maps.js';
import { mapPins, mapPinChecks } from '../src/data/cities.js';
import { dayOperations } from '../src/data/travel-database.js';

test('10/27 採 08:08 SKA1、Sztolnia 午餐與圈餅，保留 Kazimierz 選配及 16:45 IC 3830', () => {
  const day = days.find(day => day.n === 4);
  for (const [time, label] of [
    ['08:08', '火車到 Wieliczka Rynek-Kopalnia'],
    ['12:00', '午餐 · Sztolnia Wieliczka 豬肋排'],
    ['13:20', '步行到 Wieliczka Rynek-Kopalnia'],
    ['13:41', 'SKA1 回 Kraków Główny'],
    ['14:10', '買圈餅 · Obwarzanek Krakowski - Tunel'],
    ['14:25', 'Kazimierz 快速散步（有餘裕才去）'],
    ['15:15', '回 ibis 取行李（Kazimierz 選配收尾）'],
    ['16:10', '抵 Kraków Główny'],
    ['16:45', 'IC 3830 前往樂斯拉夫'],
  ]) assert.ok(day.steps.some(step => step.t === time && step.label === label), `${time} ${label}`);
  assert.ok(day.hardConstraints.includes('13:41 SKA1 回 Kraków Główny（最晚 15:11，搭 15:11 就跳過圈餅與 Kazimierz）'));
  assert.ok(day.hardConstraints.includes('15:15 結束 Kazimierz（選配）並回 ibis 取行李；16:10 前抵 Kraków Główny，IC 3830 16:45 發車'));
  assert.ok(day.eat.some(item => item.placeId === 'krakow-cukiernia-michalek'));
  assert.ok(day.eat.some(item => item.placeId === 'krakow-pierozki-u-vincenta'));
  assert.ok(dayMapPlans[4].selections.krakow.includes('Kazimierz 猶太區'));
  assert.ok(dayOperations[4].addresses.some(item => item.name === 'Plac Nowy'));
  const lunch = dayDining[4].find(item => item.placeId === 'wieliczka-sztolnia');
  assert.deepEqual([lunch.role, lunch.stepId, lunch.planStatus, lunch.meal, lunch.dayHours], ['午餐首選', 'd4-lunch', 'scheduled', 'lunch', '11:00–22:00']);
  const backup = dayDining[4].find(item => item.placeId === 'wieliczka-bistro-posolone');
  assert.deepEqual([backup.role, backup.stepId, backup.planStatus], ['午餐備案', null, 'candidate']);
  assert.doesNotMatch(JSON.stringify(day), /【待拍板】/);
  for (const id of ['wieliczka-sztolnia', 'krakow-obwarzanek-tunel']) {
    assert.equal(diningPlaces[id].verificationStatus, 'partial');
    assert.equal(diningPlaces[id].phone, undefined);
    assert.doesNotMatch(JSON.stringify(diningPlaces[id]), /已訂位|電話/);
  }
});

test('Day 4 車站採 OSM 正確位置，兩間新店都有已驗證圖釘', () => {
  const station = daySupplementaryPins[4].find(pin => pin[2] === 'Wieliczka Rynek-Kopalnia 車站');
  assert.deepEqual(station.slice(0, 2), [49.98565, 20.05665]);
  assert.equal(station[6], 'https://www.openstreetmap.org/?mlat=49.98565&mlon=20.05665');
  assert.equal(pinCoordinateCheckedAt[4][station[2]], '2026-10-23');
  for (const [id, lat, lon] of [['wieliczka-sztolnia', 49.9831039, 20.0599403], ['krakow-obwarzanek-tunel', 50.0646599, 19.944894]]) {
    const name = diningPlaces[id].name;
    assert.deepEqual(daySupplementaryPins[4].find(pin => pin[2] === name).slice(0, 2), [lat, lon]);
    assert.deepEqual(mapPins.krakow.points.find(pin => pin[7] === id).slice(0, 2), [lat, lon]);
    assert.equal(mapPinChecks.krakow[name].status, 'coordinate-verified');
    assert.equal(mapPinChecks.krakow[name].coordinateSource, diningPlaces[id].map);
  }
});

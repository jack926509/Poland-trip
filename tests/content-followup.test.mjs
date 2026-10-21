import test from 'node:test';
import assert from 'node:assert/strict';
import { diningPinMatches, auditDiningPinCoverage, auditDataFreshness } from '../tools/audit-map-pins.mjs';
import { mapPins } from '../src/data/cities.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { fastFoodBranches } from '../src/data/dining.js';
import { databaseEntries } from '../src/data/travel-database.js';
import { todoGroups } from '../src/data/trip.js';

test('餐廳圖釘覆蓋依分店 ID，同品牌同名門市不得互算', () => {
  const pin = [52, 21, 'Pijalnia Czekolady E.Wedel', '', '', 'shop', null, 'szpitalna'];
  assert.equal(diningPinMatches({ placeId: 'szpitalna', name: 'Wedel 巧克力' }, pin), true);
  assert.equal(diningPinMatches({ placeId: 'krakowskie', name: pin[2] }, pin), false);
  assert.equal(diningPinMatches({ placeId: 'szpitalna', name: pin[2] }, pin.slice(0, 7)), false);
  const wedel = mapPins.warsaw.points.find(point => point[7] === 'warsaw-wedel-szpitalna-8');
  assert.ok(wedel);
  assert.equal(wedel[4], diningPlaces['warsaw-wedel-szpitalna-8'].map);
  const report = auditDiningPinCoverage();
  assert.ok(!report.byCity['華沙'].missingDetails.some(row => row.placeId === 'warsaw-wedel-szpitalna-8'));
  assert.ok(report.byCity['華沙'].missingDetails.some(row => row.placeId === 'warsaw-wedel-krakowskie-45'));
});

test('缺少餐廳圖釘清單可逐店續查，涵蓋速食並保留主檔地址、來源及狀態', () => {
  const report = auditDiningPinCoverage();
  const places = new Map([...Object.values(diningPlaces), ...Object.values(fastFoodBranches).flat()].map(place => [place.id, place]));
  let missing = 0;
  for (const city of Object.values(report.byCity)) {
    assert.equal(city.missingDetails.length, city.missing.length);
    for (const row of city.missingDetails) {
      const place = places.get(row.placeId);
      assert.ok(place, row.placeId);
      assert.equal(row.address, place.address);
      assert.equal(row.verificationStatus, place.verificationStatus);
      assert.equal(row.sourceUrl, place.sourceUrl || null);
      missing++;
    }
  }
  assert.equal(missing, report.listed - report.covered);
});

test('景點票券摘要對齊既有購票紀錄，私人核對尚未完成且保留逾期提醒', () => {
  const items = todoGroups.filter(group => ['attractions', 'rainy-day'].includes(group.id)).flatMap(group => group.items);
  const confirmed = items.filter(item => ['已訂妥', '已購票'].includes(item.status));
  // 2026-10-14 新行程不進付費館：拿掉全景畫、皇家城堡、起義博物館三筆，7 → 4。
  // 2026-10-21 加 Day 7 聖安妮教堂觀景台（現場購票），4 → 5。
  assert.equal(items.length, 5);
  assert.equal(confirmed.length, 2);
  assert.match(confirmed[0].name, /Auschwitz/);
  assert.match(confirmed[0].action, /10:30.*英文.*2 人/);
  assert.match(confirmed[1].name, /Wieliczka.*09:00/);
  const entry = databaseEntries.find(item => item.id === 'documents-attraction-tickets');
  assert.ok(entry.title.includes(`已訂 ${confirmed.length} 項`));
  assert.ok(entry.title.includes(`其餘 ${items.length - confirmed.length} 項`));
  assert.match(entry.summary, /已訂 10\/26 Auschwitz.*10:30/);
  assert.equal(entry.status, 'private-required');
  assert.equal(entry.verifiedAt, null);
  assert.equal(entry.recheckAt, '2026-09-24');
  assert.equal(entry.private, true);
  assert.match(entry.offlineNote, /PDF.*證件/);
  assert.ok(auditDataFreshness('2026-10-07').overdue.some(item => item.endsWith(` ${entry.id}`)));
});

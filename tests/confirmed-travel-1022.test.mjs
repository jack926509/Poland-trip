import test from 'node:test';
import assert from 'node:assert/strict';
import { days, flights, meta, todoGroups } from '../src/data/trip.js';
import { nightStay, checkoutStay } from '../src/lib/journey.mjs';
import { segments } from '../src/data/rail.js';
import { diningPlaces } from '../src/data/dining-places.js';
import { dayDiningPlans } from '../src/data/day-dining.js';

test('10/22 電子機票：延後出發、去回六段與轉機間隔同步', () => {
  assert.equal(meta.travelStart, '2026-10-24');
  assert.deepEqual(flights.out.map(x => [x.code, x.when]), [
    ['HX 283', '10/24 六 21:45 → 23:45'], ['⇄ HKG', '1h40m'],
    ['QR 815', '10/25 日 01:25 → 04:50'], ['⇄ DOH', '4h20m'],
    ['QR 259', '10/25 日 09:10 → 13:10'],
  ]);
  assert.match(flights.back[2].when, /01:55/);
  assert.equal(flights.back[1].when, '3h45m');
  assert.equal(flights.back[2].dur, '7h55m');
});

test('新火車依截圖採用西站與已證實票面資料', () => {
  const rail = segments.filter(x => x.id !== 'bus-lajkonik');
  assert.deepEqual(rail.map(x => [x.type, x.dep, x.arr, x.class, x.price]), [
    ['EIP 1306', '15:45', '18:12', 1, '409,22 PLN（截圖所示金額）'],
    ['IC 3830', '16:45', '19:50', 1, '48,00 PLN（截圖所示金額）'],
    ['IC 260', '19:10', '20:29', 2, '68,60 PLN（截圖所示金額）'],
    ['EIC 8104', '17:40', '19:59', 2, '235,42 PLN（截圖所示金額）'],
  ]);
  assert.equal(rail[0].from, 'Warszawa Zachodnia');
  assert.match(days[1].warn, /13:10.*15:45/);
  assert.ok(!days[1].steps.some(x => /Wawel|辛德勒|Pimiento/.test(x.label)));
  assert.match(days[0].title, /桃園/);
  assert.ok(!dayDiningPlans[1].some(x => x.planStatus === 'scheduled'));
});

test('Soul Kitchen 已訂妥 18:00–20:00，威靈頓僅記店家已註記', () => {
  const item = todoGroups.find(x => x.id === 'dining').items.find(x => /Soul Kitchen/.test(x.name));
  assert.equal(item.status, '已訂妥');
  assert.match(item.action, /18:00.*20:00.*2 人/);
  assert.match(item.action, /15 分鐘/);
  assert.match(item.action, /註記 1 份/);
  assert.equal(diningPlaces['warsaw-soul-kitchen'].booking, 'booked');
  assert.equal(days[6].steps.find(x => x.id === 'd7-dinner').t, '18:00');
});

test('出發日在香港轉機，舊首晚訂單不算實際住宿或翌日退房', () => {
  assert.equal(nightStay(days[0]), null);
  assert.equal(checkoutStay(days[1]), null);
  assert.equal(days[0].overnight, '香港轉機／機上過夜');
});

test('出發日倒數採台北時間，與華沙時鐘相差 6 小時', async () => {
  const { warsawMinutes } = await import('../src/scripts/today.js');
  const at = new Date('2026-10-24T10:00:00Z');
  assert.equal(18 * 60 + 45 - warsawMinutes(at, 'Asia/Taipei'), 45);
  assert.equal(warsawMinutes(at), 12 * 60);
});

test('公開輸出不再提示舊首晚退房，也不催已訂 Soul Kitchen', async () => {
  const { readFile } = await import('node:fs/promises');
  const html = await readFile(new URL('../dist/today.html', import.meta.url), 'utf8');
  const first = html.split('data-today-date="2026-10-24"')[1].split('</article>')[0];
  assert.doesNotMatch(first, /退房 Hotel Metropol/);
  assert.match(first, /data-time-zone="Asia\/Taipei"/);
  assert.match(first, /香港轉機／機上過夜/);
  const { renderMealList } = await import('../src/lib/dining.mjs');
  const { dayMeals } = await import('../src/data/day-dining.js');
  assert.match(renderMealList(days[6], dayMeals[7]), /晚餐 · 18:00 · 已訂妥/);
});

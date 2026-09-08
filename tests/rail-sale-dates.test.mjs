import test from 'node:test';
import assert from 'node:assert/strict';

import * as trip from '../src/data/trip.js';
import { renderBooking } from '../src/templates/practical.mjs';

test('四段 PKP 規劃班次保留官方預售日與查核日', () => {
  const expected = [
    ['EIP 5300', '2026-09-25', '08:45', '10:58', '2h13'],
    ['IC 3600', '2026-09-27', '17:55', '20:52', '2h57'],
    ['BALTIC EXPRESS 260', '2026-09-28', '19:10', '20:29', '1h19'],
    ['EIC 8104', '2026-09-25', '17:40', '20:00', '2h20'],
  ];

  for (const [type, saleOpens, dep, arr, dur] of expected) {
    const train = trip.trains.find(item => item.type.toUpperCase().includes(type));
    assert.ok(train, `找不到 ${type}`);
    assert.equal(train.saleOpens, saleOpens);
    assert.equal(train.saleCheckedAt, '2026-09-08');
    assert.equal(train.dep, dep);
    assert.equal(train.arr, arr);
    assert.equal(train.dur, dur);
  }
});

test('訂票頁顯示每段火車的官方預售註記', () => {
  const html = renderBooking(trip);

  for (const date of ['2026-09-25', '2026-09-27', '2026-09-28']) {
    assert.match(html, new RegExp(`${date} 起預售`));
  }
  assert.match(html, /PKP Intercity 官方售票系統查核：2026-09-08/);
});

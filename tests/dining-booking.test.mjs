import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { diningPlaces } from '../src/data/dining-places.js';
import { BOOKING_LABELS, renderStoreBadges } from '../src/lib/dining.mjs';

const ALLOWED = ['required', 'recommended', 'walk-in', 'booked'];

test('餐廳主檔的 booking 欄位只能是 required／recommended／walk-in／booked', () => {
  for (const [id, place] of Object.entries(diningPlaces)) {
    if (!('booking' in place)) continue;
    assert.ok(ALLOWED.includes(place.booking), `${id} 的 booking「${place.booking}」不在允許值內`);
  }
  assert.deepEqual(Object.keys(BOOKING_LABELS).sort(), [...ALLOWED].sort());
});

test('10/22 回信只有 Soul Kitchen 已訂妥', () => {
  const booked = Object.entries(diningPlaces).filter(([, place]) => place.booking === 'booked').map(([id]) => id);
  assert.deepEqual(booked, ['warsaw-soul-kitchen']);
});

test('有 booking 才顯示徽章，沒有欄位就不顯示', () => {
  const html = renderStoreBadges({ placeId: 'x', cuisine: '測試', verificationStatus: 'verified', booking: 'required' });
  assert.match(html, /class="store-booking store-booking-required" data-booking="required">必訂</);
  assert.doesNotMatch(renderStoreBadges({ placeId: 'x', cuisine: '測試', verificationStatus: 'verified' }), /store-booking/);
  assert.doesNotMatch(renderStoreBadges({ placeId: 'x', cuisine: '測試', booking: 'maybe' }), /store-booking/);
});

test('離線橫幅：用 navigator.onLine 與 online／offline 事件，不用 alert／confirm', () => {
  const nav = fs.readFileSync('src/scripts/nav.js', 'utf8');
  assert.match(nav, /目前離線，顯示已存的資料；地圖只有看過的區域/);
  assert.match(nav, /addEventListener\('offline'/);
  assert.match(nav, /addEventListener\('online'/);
  assert.doesNotMatch(nav, /\b(alert|confirm)\(/);
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function loadTrip() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync('redesign/data.js', 'utf8'), context);
  return context.window.TRIP;
}

function loadDesktop() {
  const context = { globalThis: {} };
  vm.runInNewContext(fs.readFileSync('desktop/desktop-app.js', 'utf8'), context);
  return context.globalThis.PolskaDesktop;
}

test('桌機 Day 內容直接引用 TRIP.days 的核心資料', () => {
  const trip = loadTrip();
  const { buildDayModel } = loadDesktop();
  const day = buildDayModel(trip, 3);
  assert.equal(day, trip.days[2]);
  assert.equal(day.train, trip.days[2].train);
  assert.equal(day.steps, trip.days[2].steps);
});

test('交通與訂票模型只從 TRIP 公開資料組成', () => {
  const trip = loadTrip();
  const { buildLogisticsModel, buildBookingsModel } = loadDesktop();
  const logistics = buildLogisticsModel(trip);
  const bookings = buildBookingsModel(trip);
  assert.equal(logistics.trains, trip.trains);
  assert.equal(logistics.flights, trip.flights);
  assert.equal(bookings.tickets, trip.tickets);
  assert.equal(bookings.reservations, trip.reservations);
});

test('桌機文章不得重複定義行程班次、抵達時間或票價', () => {
  const source = fs.readFileSync('desktop/chapters.js', 'utf8');
  assert.doesNotMatch(source, /\b(?:dep|arr|price)\s*:/);
  assert.doesNotMatch(source, /2026-10-(?:2[4-9]|3[0-1])/);
});

test('桌機程式包含焦點、目前章節與單一主內容區的可存取契約', () => {
  const source = fs.readFileSync('desktop/desktop-app.js', 'utf8');
  assert.match(source, /aria-current/);
  assert.match(source, /focus\(\)/);
  assert.match(source, /id="desktop-main"/);
});

test('桌機樣式包含紅白國旗、郵票章與 768 px 桌機斷點', () => {
  const css = fs.readFileSync('desktop/desktop.css', 'utf8');
  assert.match(css, /desktop-flag/);
  assert.match(css, /desktop-stamp/);
  assert.match(css, /@media \(min-width:\s*768px\)/);
});

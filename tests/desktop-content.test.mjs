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
  context.window = context.globalThis;
  vm.runInNewContext(fs.readFileSync('desktop/chapters.js', 'utf8'), context);
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

test('交通與住宿章節使用現有資料欄位顯示完整文字', () => {
  const trip = loadTrip();
  const { renderLogistics } = loadDesktop();
  const html = renderLogistics(trip);
  assert.match(html, /WAW → KRK/);
  assert.match(html, /華沙 · Śródmieście Północne \/ Powiśle/);
  assert.match(html, /CX 479 · TPE → HKG/);
  assert.doesNotMatch(html, /undefined|\[object Object\]/);
});

test('門票與預約章節顯示票價、期限與官方連結', () => {
  const trip = loadTrip();
  const { renderBookings } = loadDesktop();
  const html = renderBookings(trip);
  assert.match(html, /皇家城堡/);
  assert.match(html, /PLN 50 \/ 40 \/ 100 分級 · 週三免費/);
  assert.match(html, /❗現在就訂（最急）/);
  assert.match(html, /Auschwitz 英文官方導覽/);
  assert.match(html, /https:\/\/visit\.auschwitz\.org\//);
  assert.doesNotMatch(html, /\[object Object\]/);
});

test('城市美食用波蘭城市名稱找到共用資料中的對應項目', () => {
  const trip = loadTrip();
  const { getCityFood } = loadDesktop();
  const food = getCityFood(trip, 'Kraków');
  assert.equal(food, trip.cityFood[1].items);
  assert.equal(food[0].name, 'Starka / Szara Gęś');
});

test('同一城市 hash 的按鈕需要立即重新渲染', () => {
  const { shouldRenderImmediately } = loadDesktop();
  assert.equal(shouldRenderImmediately('#cities', '#cities'), true);
  assert.equal(shouldRenderImmediately('#overview', '#cities'), false);
});

test('每日行程保留警告、必訂、備案細節與實務節點', () => {
  const trip = loadTrip();
  const { renderDay } = loadDesktop();
  const html = renderDay(trip, 2);
  assert.match(html, /辛德勒工廠週日最後入場為 18:30/);
  assert.match(html, /華沙 → 克拉科夫火車/);
  assert.match(html, /往前壓到下午較早時段/);
  assert.match(html, /mhk\.pl\/en 開放預約後立即下單/);
  assert.match(html, /Kraków Główny 主月台/);
});

test('桌機資料驗證要求 Day 1–8 編號完整且不可重複', () => {
  const trip = loadTrip();
  const { validateTripData } = loadDesktop();
  assert.equal(validateTripData(trip), true);
  assert.equal(validateTripData({ ...trip, days: trip.days.map((day, index) => ({ ...day, n: index === 7 ? 7 : day.n })) }), false);
  assert.equal(validateTripData({ ...trip, days: trip.days.slice(1) }), false);
});

test('交通章依城市顯示住宿、相關路段與實務節點', () => {
  const trip = loadTrip();
  const { renderLogistics } = loadDesktop();
  const html = renderLogistics(trip, 'Kraków');
  assert.match(html, /克拉科夫 · Kazimierz 或 Stradom/);
  assert.match(html, /WAW → KRK/);
  assert.match(html, /KRK → WRO/);
  assert.match(html, /Kraków Główny 主月台/);
  assert.doesNotMatch(html, /華沙 · Śródmieście Północne/);
});

test('城市章保留景點、歷史、現場筆記、購物與雨天備案', () => {
  const trip = loadTrip();
  const { renderCities } = loadDesktop();
  const html = renderCities(trip, 'Warszawa');
  assert.match(html, /POLIN 猶太博物館/);
  assert.match(html, /二戰中被系統性夷平的城市/);
  assert.match(html, /老城廣場地面找/);
  assert.match(html, /Bolesławiec/);
  assert.match(html, /科學文化宮 30F 觀景台/);
});

test('實用資訊包含緊急聯絡、代表處、換錢與常用波蘭語', () => {
  const trip = loadTrip();
  const { renderPractical } = loadDesktop();
  const html = renderPractical(trip);
  assert.match(html, /歐洲通用緊急/);
  assert.match(html, /駐波蘭台北代表處/);
  assert.match(html, /Kantor 民間匯兌/);
  assert.match(html, /Dzień dobry/);
});

test('關於波蘭保留基本資料與四城歷史長文', () => {
  const trip = loadTrip();
  const { renderAbout } = loadDesktop();
  const html = renderAbout(trip);
  assert.match(html, /230V · C\/E\/F 型插座/);
  assert.match(html, /1038–1596 年的波蘭王都/);
  assert.match(html, /波蘭國家的搖籃/);
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
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

import test from 'node:test';
import assert from 'node:assert/strict';

import * as trip from '../src/data/trip.js';
import { renderBooking } from '../src/templates/practical.mjs';
import { renderHome } from '../src/templates/home.mjs';
import { collectDeadlines, calculateCountdown, nextDeadline } from '../src/scripts/dashboard.js';

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

test('倒數看板併入四段火車開賣日，且不與 deadlines 重複維護', () => {
  const items = collectDeadlines(trip);
  const rail = items.filter(item => item.category === '火車');
  assert.equal(rail.length, 4);
  assert.deepEqual(
    rail.map(item => item.date).sort(),
    ['2026-09-25', '2026-09-25', '2026-09-27', '2026-09-28'],
  );
  // 火車開賣日的正本是 trains[].saleOpens；手動 deadlines 裡不該再出現一份。
  for (const deadline of trip.deadlines) {
    assert.notEqual(deadline.category, '火車', `deadlines 不應重抄火車開賣日：${deadline.id}`);
  }
  assert.equal(items.length, 4 + trip.deadlines.length);
});

test('倒數以注入的固定日期計算，涵蓋未到期、當天與逾期', () => {
  const items = collectDeadlines(trip);
  const find = (today, id) => calculateCountdown(items, today).find(item => item.id.includes(id));

  const early = find('2026-09-20', 'eip-5300');
  assert.equal(early.daysLeft, 5);
  assert.equal(early.label, 'T-5');
  assert.equal(early.urgency, 'soon');

  const onSaleDay = find('2026-09-25', 'eip-5300');
  assert.equal(onSaleDay.daysLeft, 0);
  assert.equal(onSaleDay.label, '就是今天');
  assert.equal(onSaleDay.urgency, 'today');

  const late = find('2026-09-26', 'eip-5300');
  assert.equal(late.daysLeft, -1);
  assert.equal(late.label, '逾期 1 天');
  assert.equal(late.urgency, 'overdue');

  // 距離超過一週的仍是一般狀態，不應該一開始就全表紅色。
  assert.equal(find('2026-09-01', 'eip-5300').urgency, 'planned');
});

test('已完成的項目不再被催，不論日期多久以前', () => {
  const done = [{ id: 'x', date: '2026-01-01', category: '門票', title: 't', action: 'a', status: '已訂妥', basis: 'b' }];
  const [item] = calculateCountdown(done, '2026-09-14');
  assert.equal(item.open, false);
  assert.equal(item.urgency, 'done');
  assert.equal(item.label, '已完成');
});

test('nextDeadline 取最迫切的待處理項目，逾期未處理者優先', () => {
  const items = collectDeadlines(trip);
  assert.equal(nextDeadline(items, '2026-09-14').date, '2026-09-25');
  // 開賣日已過卻仍未購票，才是最該動的一件，不能被之後的項目蓋過去。
  const afterSale = nextDeadline(items, '2026-09-26');
  assert.equal(afterSale.date, '2026-09-25');
  assert.equal(afterSale.urgency, 'overdue');
  assert.equal(nextDeadline([], '2026-09-14'), null);
});

test('每個手動維護的截止項目都寫明日期來源', () => {
  for (const deadline of trip.deadlines) {
    assert.ok(deadline.basis && deadline.basis.length > 10, `${deadline.id} 缺少 basis`);
    assert.match(deadline.date, /^\d{4}-\d{2}-\d{2}$/, `${deadline.id} 日期格式不符`);
    assert.ok(deadline.date <= '2026-10-24', `${deadline.id} 的截止日不該晚於出發日`);
  }
});

test('訂票頁與首頁都接上倒數，且無 JavaScript 時仍看得到快照', () => {
  const booking = renderBooking(trip);
  assert.match(booking, /訂票與查核倒數/);
  assert.match(booking, /data-countdown-row/);
  assert.match(booking, /JavaScript 未啟用/);
  // 每一筆都要能在表上找到，否則靜態快照就不完整。
  for (const deadline of trip.deadlines) {
    assert.ok(booking.includes(deadline.title), `訂票頁缺少 ${deadline.id}`);
  }

  const home = renderHome({ ...trip, cities: [], databaseEntries: [] });
  assert.match(home, /class="next-deadline"/);
  assert.match(home, /practical\/booking\.html#countdown/);
});

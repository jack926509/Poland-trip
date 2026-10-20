import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseHardTimes, HARD_TIME_KINDS, HARD_TIME_DEADLINES } from '../src/lib/schedule.mjs';
import { days } from '../src/data/trip.js';

const today = () => fs.readFileSync('dist/today.html', 'utf8');
const cardOf = iso => today().split(`data-today-date="${iso}"`)[1].split('</article>')[0];
const hardRows = iso => [...cardOf(iso).matchAll(/data-hard-time data-plan-minute="(\d+)">(.*?)<\/p>/gs)]
  .map(([, minute, body]) => ({ minute: Number(minute), body }));

test('一句多個時刻各自取出，開門不會蓋掉最後入場', () => {
  const rows = parseHardTimes('皇家城堡 10:00 開門、17:00 最後入場');
  assert.deepEqual(rows.map(r => [r.hhmm, r.kind]), [['10:00', 'open'], ['17:00', 'lastEntry']]);
  // 括號內的「最後入場」不可污染括號前那個時刻的判斷。
  const schindler = parseHardTimes('辛德勒工廠 17:30 入場（最後入場 18:30）');
  assert.deepEqual(schindler.map(r => [r.hhmm, r.kind]), [['17:30', 'entry'], ['18:30', 'lastEntry']]);
});

test('發車、報到與最後入場分屬不同類別，且開門不算期限', () => {
  assert.equal(parseHardTimes('08:45 發車')[0].kind, 'departure');
  assert.equal(parseHardTimes('10:00 前完成 Muzeum Auschwitz 安檢')[0].kind, 'checkin');
  assert.equal(parseHardTimes('17:20 前抵 Kraków Główny')[0].kind, 'checkin');
  for (const kind of ['departure', 'checkin', 'lastEntry', 'entry']) assert.ok(HARD_TIME_DEADLINES.has(kind));
  assert.ok(!HARD_TIME_DEADLINES.has('open'));
  assert.equal(HARD_TIME_KINDS.lastEntry, '最後入場');
  assert.deepEqual(parseHardTimes('不排室內博物館'), []);
  assert.deepEqual(parseHardTimes(''), []);
});

// 2026-10-14 新行程不進皇家城堡；Day 7 的最後入場改由水上宮殿（週五免費、17:30 最後入場）承擔。
test('Day 7 水上宮殿的 17:30 最後入場有獨立提醒，不會在 10:00 過後消失', () => {
  const rows = hardRows('2026-10-30');
  const minutes = rows.map(r => r.minute);
  assert.ok(minutes.includes(17 * 60 + 30), '17:30 最後入場必須自成一筆提醒');
  assert.ok(minutes.includes(10 * 60), '10:00 開門仍列出，但只是資訊');
  assert.match(rows.find(r => r.minute === 17 * 60 + 30).body, /最後入場/);
  assert.match(rows.find(r => r.minute === 10 * 60).body, /開門/);
});

test('每個硬時間都標出類型，且來源原文保持不變', () => {
  for (const day of days) {
    const iso = `2026-10-${String(23 + day.n).padStart(2, '0')}`;
    for (const row of hardRows(iso)) {
      assert.match(row.body, /<b>\d{2}:\d{2} · .+?<\/b>/, `Day ${day.n} 缺類型標籤`);
      assert.match(row.body, /today-hard-source/, `Day ${day.n} 缺來源原文`);
    }
  }
});

test('出發時間只在行程表對得上同一地點時推導，否則標待確認', () => {
  // 交通類期限：行程表有進站步驟，推導出發時間並標示估時來源。
  const trainDep = hardRows('2026-10-25').find(r => r.minute === 8 * 60 + 40);
  assert.match(trainDep.body, /依行程表，這段移動由 08:05/);
  assert.match(trainDep.body, /行程表估時/);

  // 場館類期限：Day 7 水上宮殿最後入場的前一段移動，不可拿之後「走回飯店」那段來推導出發時間。
  const palace = hardRows('2026-10-30').find(r => r.minute === 17 * 60 + 30);
  assert.match(palace.body, /最晚出發時間待確認|依行程表/);
  assert.ok(!/回飯店/.test(palace.body), '不可把別的目的地當成這段移動');

  // 開門不是期限，不推導出發時間。
  assert.ok(!/today-move/.test(hardRows('2026-10-30').find(r => r.minute === 600).body));
});

test('不硬編碼天數，改由資料長度推導', () => {
  const html = today();
  assert.ok(!html.includes('全部八天'), 'noscript 不可寫死八天');
  assert.match(html, new RegExp(`全部 ${days.length} 天`));
  assert.ok(!fs.readFileSync('src/scripts/today.js', 'utf8').includes('完整八天'));
});

test('今日卡不掛自動章節目錄：它連到被 JS 隱藏的日卡，且擠掉首屏的接下來去哪', () => {
  const html = today();
  assert.ok(!html.includes('chapter-index'), '今日卡頁不應出現本頁章節目錄');
  // 其他頁型仍保留目錄，避免誤把全站的目錄關掉；日頁本身在稽核 M3 後
  // 也改用 sticky 的 .day-shortcuts 取代自動目錄（見 paper-travel-journal
  // 的專屬測試），這裡改用實用資料頁驗證機制本身沒壞掉。
  assert.ok(fs.readFileSync('dist/practical/booking.html', 'utf8').includes('chapter-index'));
  // 首屏順序：日期切換 → 當日標題 → 下一站，且都排在「看今天完整行程」主按鈕之前
  // （2026-10-20 卡內快捷列移除，改由主按鈕連到每日頁）。
  const order = ['today-date-controls', 'today-head', 'today-next', 'today-full-link']
    .map(cls => html.indexOf(cls));
  assert.deepEqual(order, [...order].sort((a, b) => a - b), '今日卡首屏順序不符優先級');
});

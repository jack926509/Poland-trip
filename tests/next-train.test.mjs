import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), context);
const core = context.globalThis.PolskaPwaCore;

const TRAINS = [
  { seg: 'WAW → KRK', date: '10/25', type: 'EIP', dep: '09:00' },
  { seg: 'KRK → WRO', date: '10/27', type: 'IC', dep: '19:30' },
  { seg: 'POZ → WAW', date: '10/29', type: 'EIP', dep: '17:30' },
];

test('2026 夏令時間在 10/25 結束：10/24 是 UTC+2，10/25 起是 UTC+1', () => {
  assert.equal(core.warsawOffsetHours('10/24'), 2);
  assert.equal(core.warsawOffsetHours('10/25'), 1);
  assert.equal(core.warsawOffsetHours('10/31'), 1);
});

test('trainDepartureMs 用波蘭當地時間換算 UTC', () => {
  // 10/25 09:00 CET(UTC+1) = 08:00 UTC
  assert.equal(core.trainDepartureMs(TRAINS[0], 2026), Date.UTC(2026, 9, 25, 8, 0));
});

test('nextTrain 回傳下一段未出發的車', () => {
  const now = Date.UTC(2026, 9, 25, 6, 0); // 10/25 07:00 波蘭時間
  const r = core.nextTrain(TRAINS, now, 2026);
  assert.equal(r.index, 0);
  assert.equal(r.minutesUntil, 120);
});

test('已出發的段落會被跳過', () => {
  const now = Date.UTC(2026, 9, 25, 10, 0); // 10/25 11:00 波蘭時間，第一段已開走
  const r = core.nextTrain(TRAINS, now, 2026);
  assert.equal(r.index, 1);
  assert.equal(r.train.seg, 'KRK → WRO');
});

test('全部走完回 null', () => {
  const now = Date.UTC(2026, 10, 5, 0, 0);
  assert.equal(core.nextTrain(TRAINS, now, 2026), null);
  assert.equal(core.nextTrain([], now, 2026), null);
  assert.equal(core.nextTrain(null, now, 2026), null);
});

test('formatCountdown 給非工程師看得懂的字', () => {
  assert.equal(core.formatCountdown(0), '即將出發');
  assert.equal(core.formatCountdown(45), '還有 45 分');
  assert.equal(core.formatCountdown(120), '還有 2 小時');
  assert.equal(core.formatCountdown(150), '還有 2 小時 30 分');
  assert.equal(core.formatCountdown(60 * 24 * 3), '3 天後');
});

// Task 12：交通頁要列出全部長途車段，包含已經開走的。formatCountdown(0) 會
// 回「即將出發」，對一班已開走的車顯示這句話是說謊，所以 trainCountdownState
// 必須明確區分「還沒開」／「剛開走」／「早就開走」三種情境，且不可對已出發
// 的車產生倒數文字。凍結時鐘（Date.UTC 固定值）逐一驗證。
test('trainCountdownState：車還沒開，回傳倒數文字且 departed 為 false', () => {
  const now = Date.UTC(2026, 9, 25, 6, 0); // 10/25 07:00 波蘭時間，第一段 09:00 出發
  const r = core.trainCountdownState(TRAINS[0], now, 2026);
  assert.equal(r.departed, false);
  assert.equal(r.minutesUntil, 120);
  assert.equal(r.text, '還有 2 小時');
});

test('trainCountdownState：車剛好在此刻出發（minutesUntil<=0），標記已出發、不顯示倒數', () => {
  const depMs = core.trainDepartureMs(TRAINS[0], 2026);
  const r = core.trainCountdownState(TRAINS[0], depMs, 2026); // now === 出發時刻，minutesUntil = 0
  assert.equal(r.departed, true);
  assert.equal(r.text, '已出發');
  assert.doesNotMatch(r.text, /即將出發|還有/, '已出發的車不可顯示倒數或「即將出發」這種會被誤讀成尚未出發的字');
});

test('trainCountdownState：全部車段都已開走很久，仍各自標記已出發、不騙人', () => {
  const now = Date.UTC(2026, 10, 5, 0, 0); // 行程結束後很久
  for (const tr of TRAINS) {
    const r = core.trainCountdownState(tr, now, 2026);
    assert.equal(r.departed, true);
    assert.equal(r.text, '已出發');
  }
});

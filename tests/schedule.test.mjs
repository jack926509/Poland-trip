import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TIME_KINDS, toMinutes, formatMinutes, parseStepTime, toIsoDate, daysUntil,
  taipeiToday, warsawToday,
} from '../src/lib/schedule.mjs';
import * as trip from '../src/data/trip.js';

test('toMinutes 接受合法時刻、拒絕越界值', () => {
  assert.equal(toMinutes('00:00'), 0);
  assert.equal(toMinutes('16:15'), 975);
  assert.equal(toMinutes('23:59'), 1439);
  assert.equal(toMinutes('24:00'), null);
  assert.equal(toMinutes('12:60'), null);
  assert.equal(toMinutes(''), null);
  assert.equal(toMinutes(null), null);
});

test('formatMinutes 補零並拒絕非法輸入', () => {
  assert.equal(formatMinutes(0), '00:00');
  assert.equal(formatMinutes(975), '16:15');
  assert.equal(formatMinutes(-1), null);
  assert.equal(formatMinutes(1.5), null);
});

test('parseStepTime 辨識 trip.js 實際出現的五種語意', () => {
  const cases = [
    ['16:15', TIME_KINDS.exact, 975],
    ['參考 10:58', TIME_KINDS.reference, 658],
    ['參考20:00', TIME_KINDS.reference, 1200],   // 來源資料有無空白兩種寫法
    ['約 14:15', TIME_KINDS.estimate, 855],
    ['18:35 前', TIME_KINDS.deadline, 1115],
  ];
  for (const [raw, kind, minutes] of cases) {
    const parsed = parseStepTime(raw);
    assert.ok(parsed, `${raw} 應可解析`);
    assert.equal(parsed.kind, kind, raw);
    assert.equal(parsed.minutes, minutes, raw);
    assert.equal(parsed.raw, raw);
  }
});

test('parseStepTime 解析預留區間的起訖', () => {
  const parsed = parseStepTime('13:30–15:00 預留');
  assert.equal(parsed.kind, TIME_KINDS.window);
  assert.equal(parsed.hhmm, '13:30');
  assert.equal(parsed.endHhmm, '15:00');
  assert.equal(parsed.endMinutes - parsed.minutes, 90);
});

test('parseStepTime 對沒有時刻的步驟回 null 而不拋錯', () => {
  for (const raw of ['', '   ', null, undefined, '早睡倒時差']) {
    assert.equal(parseStepTime(raw), null);
  }
});

test('trip.js 全部 steps[].t 皆可解析', () => {
  const failures = [];
  for (const day of trip.days) {
    for (const step of day.steps) {
      if (step.t && parseStepTime(step.t) === null) failures.push(`Day ${day.n}：${step.t}`);
    }
  }
  assert.deepEqual(failures, [], `無法解析的時刻：${failures.join('、')}`);
});

test('toIsoDate 支援完整日期與行程用的 M/D 簡寫', () => {
  assert.equal(toIsoDate('2026-10-24'), '2026-10-24');
  assert.equal(toIsoDate('10/24'), '2026-10-24');
  assert.equal(toIsoDate('2026-02-30'), null);
  assert.equal(toIsoDate('稍後確認'), null);
});

test('daysUntil 以固定日期計算，涵蓋未來、當天與已過', () => {
  assert.equal(daysUntil('2026-09-25', '2026-09-14'), 11);
  assert.equal(daysUntil('2026-09-25', '2026-09-25'), 0);
  assert.equal(daysUntil('2026-09-25', '2026-09-26'), -1);
  assert.equal(daysUntil('10/24', '2026-09-14'), 40);
  assert.equal(daysUntil('無效', '2026-09-14'), null);
});

test('daysUntil 跨越冬令時轉換仍為整數天', () => {
  // 10/25 歐洲夏令時結束；以 UTC 正午基準計算不受影響。
  assert.equal(daysUntil('2026-10-26', '2026-10-24'), 2);
  assert.equal(daysUntil('2026-10-31', '2026-10-24'), 7);
});

test('兩個時區各自回傳當地日期', () => {
  // 台北 UTC+8 已是 10/25，華沙（此時為 CEST，UTC+2）仍是 10/24。
  const instant = new Date('2026-10-24T20:00:00Z');
  assert.equal(taipeiToday(instant), '2026-10-25');
  assert.equal(warsawToday(instant), '2026-10-24');
});

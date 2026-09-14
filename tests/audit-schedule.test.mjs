import test from 'node:test';
import assert from 'node:assert/strict';

import { auditSchedule } from '../tools/audit-schedule.mjs';
import { days } from '../src/data/trip.js';

test('真實行程目前沒有結構錯誤', () => {
  const result = auditSchedule();
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.days, 8);
  // 每個有時刻的步驟都要被檢查到；解析失敗會讓這個數字掉下來。
  const withTime = days.flatMap(day => day.steps).filter(step => step.t).length;
  assert.equal(result.stats.stepsChecked, withTime);
});

test('規則 1 抓得到倒退的步驟時刻', () => {
  const broken = [{
    n: 99, date: '10/99 (測)', steps: [
      { t: '10:00', label: '前一站' },
      { t: '09:30', label: '倒退的一站' },
    ],
  }];
  const result = auditSchedule(broken);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /步驟順序/);
  assert.match(result.errors[0], /倒退的一站/);
});

test('規則 1 以區間的結束時刻作為下一步基準', () => {
  const withinWindow = [{
    n: 98, date: '10/98 (測)', steps: [
      { t: '13:30–15:00 預留', label: '預留區間' },
      { t: '15:10', label: '區間之後' },
    ],
  }];
  assert.deepEqual(auditSchedule(withinWindow).errors, []);

  const insideWindow = [{
    n: 97, date: '10/97 (測)', steps: [
      { t: '13:30–15:00 預留', label: '預留區間' },
      { t: '14:00', label: '落在區間內' },
    ],
  }];
  assert.equal(auditSchedule(insideWindow).errors.length, 1);
});

test('沒有時刻的步驟不影響順序判斷', () => {
  const result = auditSchedule([{
    n: 96, date: '10/96 (測)', steps: [
      { t: '10:00', label: '有時刻' },
      { label: '無時刻的自由步驟' },
      { t: '11:00', label: '有時刻' },
    ],
  }]);
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.stepsChecked, 2);
});

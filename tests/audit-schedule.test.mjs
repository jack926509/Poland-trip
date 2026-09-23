import test from 'node:test';
import assert from 'node:assert/strict';

import { auditSchedule } from '../tools/audit-schedule.mjs';
import { days } from '../src/data/trip.js';
import { venueHours, fares } from '../src/data/tickets.js';

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

const VENUES = {
  'test-museum': { name: '測試博物館', closedWeekdays: [1], opens: '10:00', closes: '18:00', lastEntry: '17:00', checkedAt: '2026-01-01' },
  'test-always': { name: '全年無休館', closedWeekdays: [], opens: null, closes: null, lastEntry: null, checkedAt: '2026-01-01' },
};
const options = { venues: VENUES, tripStart: '2026-10-24' };

test('已知場館開門時間和明確停留時長衝突會提出複核', () => {
  const result = auditSchedule([{
    n: 1, date: '10/24 (六)', steps: [
      { t: '09:30', label: '進館', dur: '2 h', constraint: { venue: 'test-museum' } },
      { t: '10:30', label: '下一站' },
    ],
  }], options);
  assert.deepEqual(result.errors, []);
  assert.ok(result.warnings.some(warning => /開門時間/.test(warning)));
  assert.ok(result.warnings.some(warning => /停留重疊/.test(warning)));
});

test('規則 2：晚於末入場只警告，不擋流程', () => {
  const late = auditSchedule([{
    n: 1, date: '10/24 (六)', steps: [{ t: '17:30', label: '進館', constraint: { venue: 'test-museum' } }],
  }], options);
  assert.deepEqual(late.errors, []);
  assert.equal(late.warnings.length, 1);
  assert.match(late.warnings[0], /末入場/);

  const onTime = auditSchedule([{
    n: 1, date: '10/24 (六)', steps: [{ t: '16:30', label: '進館', constraint: { venue: 'test-museum' } }],
  }], options);
  assert.deepEqual(onTime.warnings, []);
});

test('規則 2：沒有末入場資料的場館直接跳過，不猜', () => {
  const result = auditSchedule([{
    n: 1, date: '10/24 (六)', steps: [{ t: '23:00', label: '很晚才到', constraint: { venue: 'test-always' } }],
  }], options);
  assert.deepEqual(result.warnings, []);
  assert.equal(result.stats.lastEntryChecked, 0);
});

test('規則 3：轉場緩衝以發車前最後一步計算，不含上車那一步', () => {
  const tight = auditSchedule([{
    n: 1, date: '10/24 (六)',
    train: { type: 'IC 1', dep: '19:10' },
    steps: [
      { t: '18:55', label: '抵站' },
      { t: '19:10', label: '上車' },
    ],
  }], options);
  assert.equal(tight.warnings.length, 1);
  assert.match(tight.warnings[0], /只有 15 分鐘/);

  const roomy = auditSchedule([{
    n: 1, date: '10/24 (六)',
    train: { type: 'IC 1', dep: '19:10' },
    steps: [
      { t: '18:30', label: '抵站' },
      { t: '19:10', label: '上車' },
    ],
  }], options);
  assert.deepEqual(roomy.warnings, []);
});

test('規則 4：公休日排了行程只警告（外觀與周邊仍是合理安排）', () => {
  // 2026-10-26 是週一，測試場館週一公休。
  const result = auditSchedule([{
    n: 3, date: '10/26 (一)', steps: [{ t: '11:00', label: '外觀', constraint: { venue: 'test-museum' } }],
  }], options);
  assert.deepEqual(result.errors, []);
  assert.equal(result.warnings.length, 1);
  assert.match(result.warnings[0], /公休/);
});

test('規則 5：引用不存在的場館是結構錯誤，會擋流程', () => {
  const result = auditSchedule([{
    n: 1, date: '10/24 (六)', steps: [{ t: '11:00', label: '進館', constraint: { venue: '打錯的名字' } }],
  }], options);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /場館引用/);
});

test('規則 6：星期標示與實際日期不符是結構錯誤', () => {
  const result = auditSchedule([{ n: 1, date: '10/24 (日)', steps: [] }], options);
  assert.equal(result.errors.length, 1);
  assert.match(result.errors[0], /星期標示/);
  assert.match(result.errors[0], /實際是週六/);

  assert.deepEqual(auditSchedule([{ n: 1, date: '10/24 (六)', steps: [] }], options).errors, []);
});

test('真實行程：星期標示全對、場館引用全部指得到', () => {
  const result = auditSchedule();
  assert.deepEqual(result.errors, []);
  assert.equal(result.stats.weekdaysChecked, 8);
  assert.ok(result.stats.venueRefs > 0, '應有步驟掛上 constraint.venue');
  assert.ok(result.stats.lastEntryChecked > 0, '應有步驟能與末入場比對');
});

test('真實行程的警告數量維持在已知範圍，新增衝突會被注意到', () => {
  const result = auditSchedule();
  // Day 3 報到提前到 06:40，保留 30 分鐘規劃緩衝；新的時程衝突應直接顯示。
  assert.equal(result.warnings.length, 0, `未預期的警告：\n${result.warnings.join('\n')}`);
});

const SUN = [{ day: 1, date: '2026-10-24', city: '測', tz: 'CET', sunrise: '06:30', sunset: '16:00', blueHourEnd: '16:30', note: '' }];
const lightOptions = spots => ({ ...options, photoSpots: spots, daylight: SUN });

test('規則 7：宣告 daylight 卻收工於日落後會提醒', () => {
  const late = auditSchedule([], lightOptions([{ id: 'a', name: '測站', day: 1, bestTime: '15:30–16:30', lightPhase: 'daylight' }]));
  assert.equal(late.warnings.length, 1);
  assert.match(late.warnings[0], /拍照光線/);

  const fine = auditSchedule([], lightOptions([{ id: 'a', name: '測站', day: 1, bestTime: '14:30–15:30', lightPhase: 'daylight' }]));
  assert.deepEqual(fine.warnings, []);
});

test('規則 7：goldenHour 必須貼著日落前開拍', () => {
  const tooEarly = auditSchedule([], lightOptions([{ id: 'a', name: '測站', day: 1, bestTime: '13:00–14:00', lightPhase: 'goldenHour' }]));
  assert.match(tooEarly.warnings[0], /距日落超過/);

  const tooLate = auditSchedule([], lightOptions([{ id: 'a', name: '測站', day: 1, bestTime: '16:10–16:25', lightPhase: 'goldenHour' }]));
  assert.match(tooLate.warnings[0], /開拍時已過日落/);

  const fine = auditSchedule([], lightOptions([{ id: 'a', name: '測站', day: 1, bestTime: '15:20–16:20', lightPhase: 'goldenHour' }]));
  assert.deepEqual(fine.warnings, []);
});

test('規則 7：dusk 必須真的橫跨日落', () => {
  const spans = auditSchedule([], lightOptions([{ id: 'a', name: '測站', day: 1, bestTime: '15:45–16:45', lightPhase: 'dusk' }]));
  assert.deepEqual(spans.warnings, []);

  const misses = auditSchedule([], lightOptions([{ id: 'a', name: '測站', day: 1, bestTime: '16:10–16:40', lightPhase: 'dusk' }]));
  assert.match(misses.warnings[0], /並未橫跨日落/);
});

test('真實拍照站位的光線宣告全部與當日日落相符', () => {
  const result = auditSchedule();
  assert.ok(result.stats.photoLightChecked >= 9, '應涵蓋所有排入行程的拍照站位');
  assert.deepEqual(result.warnings.filter(item => item.includes('拍照光線')), []);
});

test('venueHours 每筆都有可追溯的出處，fares 引用不得落空', () => {
  const problems = [];
  for (const [key, venue] of Object.entries(venueHours)) {
    if (!venue.sourceRef) problems.push(`${key} 缺少 sourceRef`);
    const faresRef = venue.sourceRef?.match(/^fares\['(.+?)'\]/);
    if (faresRef && !fares.some(item => item.name === faresRef[1])) {
      problems.push(`${key} 的 fares 引用指不到「${faresRef[1]}」`);
    }
    // checkedAt 只在來源本身帶日期時才填；不得為了好看而捏造。
    if (venue.checkedAt !== null) {
      assert.match(venue.checkedAt, /^\d{4}-\d{2}-\d{2}$/, `${key} 的 checkedAt 格式不符`);
    }
  }
  assert.deepEqual(problems, []);
});

test('沒有來源的場館規則必須留空，不得以常識補上', () => {
  // POLIN 站內只查得週五時段與末入場，沒有每週公休日的記載。
  // 這類「大概是週二休」的補充會被稽核當成查證過的規則，因此必須留空。
  const polin = venueHours['warsaw-polin'];
  assert.deepEqual(polin.closedWeekdays, [], 'POLIN 的公休日站內無來源，應留空');
  assert.match(polin.note, /公休日站內尚無查證資料/);
  assert.equal(polin.checkedAt, null, '無來源日期時 checkedAt 應為 null');
});

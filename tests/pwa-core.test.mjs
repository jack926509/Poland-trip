import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const context = { globalThis: {}, Intl, Date };
vm.runInNewContext(fs.readFileSync('redesign/pwa-core.js', 'utf8'), context);
const { projectTripMoment, readNotes, writeNotes } = context.globalThis.PolskaPwaCore;
const tripMeta = { tripStart: '2026-10-24', tripEnd: '2026-10-31', timeZone: 'Europe/Warsaw' };
const days = [
  { n: 1, date: '10/24 (六)', steps: [{ t: '09:00' }, { t: '12:00' }] },
  { n: 8, date: '10/31 (六)', steps: [{ t: '09:00' }, { t: '12:00' }] },
];

test('旅程日期內選到對應 Day', () => {
  const result = projectTripMoment(days, new Date('2026-10-24T08:30:00Z'), null, tripMeta);
  assert.equal(result.d.n, 1);
  assert.equal(result.phase, 'during');
});

test('旅程前後回到首末日並標示預覽狀態', () => {
  assert.equal(projectTripMoment(days, new Date('2026-10-01T12:00:00Z'), null, tripMeta).phase, 'before');
  assert.equal(projectTripMoment(days, new Date('2026-11-02T12:00:00Z'), null, tripMeta).phase, 'after');
});

test('跨年份同月日仍依旅程前後選到首末日', () => {
  const before = projectTripMoment(days, new Date('2025-10-31T12:00:00Z'), null, tripMeta);
  assert.equal(before.phase, 'before');
  assert.equal(before.d.n, 1);

  const after = projectTripMoment(days, new Date('2027-10-24T12:00:00Z'), null, tripMeta);
  assert.equal(after.phase, 'after');
  assert.equal(after.d.n, 8);
});

test('儲存不可用時不丟出例外', () => {
  const broken = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  const result = JSON.parse(JSON.stringify(readNotes(broken)));
  assert.deepEqual(result, { notes: {}, persistent: false });
  assert.equal(writeNotes(broken, { '1-0': '護照' }), false);
});

test('備註不是普通物件時安全降級', () => {
  for (const value of ['null', '[]', '42', '{malformed']) {
    const storage = { getItem() { return value; } };
    const result = JSON.parse(JSON.stringify(readNotes(storage)));
    assert.deepEqual(result, { notes: {}, persistent: false }, `未拒絕 ${value}`);
  }
});

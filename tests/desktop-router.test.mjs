import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

function loadDesktop() {
  const context = { globalThis: {} };
  vm.runInNewContext(fs.readFileSync('desktop/desktop-app.js', 'utf8'), context);
  return context.globalThis.PolskaDesktop;
}

test('合法章節與 Day 1–8 會解析成標準 hash', () => {
  const { normalizeRoute } = loadDesktop();
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeRoute('#itinerary/day-3'))),
    { chapter: 'itinerary', day: 3, canonicalHash: '#itinerary/day-3' },
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeRoute('#logistics'))),
    { chapter: 'logistics', day: null, canonicalHash: '#logistics' },
  );
});

test('未知 hash 與無效 Day 會降級至有效頁面', () => {
  const { normalizeRoute } = loadDesktop();
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeRoute('#not-a-real-chapter'))),
    { chapter: 'overview', day: null, canonicalHash: '#overview' },
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeRoute('#itinerary/day-0'))),
    { chapter: 'itinerary', day: 1, canonicalHash: '#itinerary/day-1' },
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(normalizeRoute('#itinerary/day-9'))),
    { chapter: 'itinerary', day: 8, canonicalHash: '#itinerary/day-8' },
  );
});

test('上一天、下一天只在每日行程內移動且保留有效範圍', () => {
  const { nextRoute } = loadDesktop();
  assert.deepEqual(
    JSON.parse(JSON.stringify(nextRoute({ chapter: 'itinerary', day: 1 }, -1))),
    { chapter: 'itinerary', day: 1, canonicalHash: '#itinerary/day-1' },
  );
  assert.deepEqual(
    JSON.parse(JSON.stringify(nextRoute({ chapter: 'itinerary', day: 8 }, 1))),
    { chapter: 'itinerary', day: 8, canonicalHash: '#itinerary/day-8' },
  );
  assert.equal(nextRoute({ chapter: 'overview', day: null }, 1), null);
});

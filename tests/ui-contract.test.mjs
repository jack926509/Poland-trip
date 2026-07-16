import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const jsx = fs.readFileSync('redesign/B-companion.jsx', 'utf8');
const css = fs.readFileSync('redesign/B-companion.css', 'utf8');

test('手機與桌機導覽共用四個固定功能', () => {
  for (const label of ['今日', '行程', '交通', '訂票']) assert.match(jsx, new RegExp(label));
  assert.match(jsx, /B-mobile-nav/);
  assert.match(jsx, /B-desktop-nav/);
});

test('寬螢幕採雙欄網頁布局', () => {
  assert.match(jsx, /B-web-grid/);
  assert.match(jsx, /B-primary-column/);
  assert.match(jsx, /B-secondary-column/);
  assert.match(css, /@media \(min-width: 900px\)/);
  assert.match(css, /grid-template-columns:\s*minmax\(0,\s*1fr\)\s+minmax\(18rem,\s*24rem\)/);
});

test('不再使用隨機日期示範', () => {
  assert.doesNotMatch(jsx, /getDate\(\) % 8/);
  assert.match(jsx, /projectTripMoment/);
});

test('完整網頁資訊已整合回同一應用', () => {
  assert.match(jsx, /function B_PreTripGuide/);
  for (const key of ['trip.flights', 'trip.stay', 'trip.safety', 'trip.practical', 'trip.phrases']) {
    assert.match(jsx, new RegExp(key.replace('.', '\\.')));
  }
});

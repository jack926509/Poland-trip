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

test('日期 UI 使用 Warsaw 旅程階段與核心分鐘數', () => {
  assert.match(jsx, /phase,\s*mins/);
  assert.match(jsx, /phase === 'before'\s*\?\s*'行程尚未開始 · 預覽'/);
  assert.match(jsx, /phase === 'after'\s*\?\s*'行程已結束 · 回顧'/);
  assert.match(jsx, /B_formatMinutes\(mins\)/);
  assert.match(jsx, /\- mins/);
  assert.doesNotMatch(jsx, /cur\.getHours\(\)|cur\.getMinutes\(\)|n\.getHours\(\)|n\.getMinutes\(\)/);
});

test('localStorage getter 拋出 SecurityError 時可降級', () => {
  assert.match(jsx, /function B_getStorage\(\)\s*{\s*try\s*{\s*return window\.localStorage;\s*}\s*catch/);
  assert.match(jsx, /core\.readNotes\(storage\)/);
  assert.match(jsx, /core\.writeNotes\(storage,\s*next\)/);
  assert.doesNotMatch(jsx, /core\.(?:readNotes|writeNotes)\(window\.localStorage/);
});

test('Drawer 只在開啟時可對焦並還原開啟者焦點', () => {
  assert.match(jsx, /drawerOpen\s*&&\s*\(/);
  assert.match(jsx, /drawerReturnFocusRef/);
  assert.match(jsx, /drawerCloseRef\.current\?\.focus\(\)/);
  assert.match(jsx, /drawerReturnFocusRef\.current\?\.focus\(\)/);
  assert.match(jsx, /if \(e\.key === 'Escape' && drawerOpen\)/);
});

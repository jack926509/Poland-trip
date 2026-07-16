import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const jsx = fs.readFileSync('redesign/B-companion.jsx', 'utf8');
const css = fs.readFileSync('redesign/B-companion.css', 'utf8');

test('build 只編譯正式 PWA 介面', () => {
  const build = fs.readFileSync('build.sh', 'utf8');
  assert.match(build, /redesign\/B-companion\.jsx/);
  assert.doesNotMatch(build, /A-magazine\.jsx|C-app\.jsx|ios-frame\.jsx|tweaks-panel\.jsx/);
});

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
  assert.match(jsx, /initialFocusRef\.current\?\.focus\(\)/);
  assert.match(jsx, /returnFocusRef\.current\?\.focus\(\)/);
  assert.match(jsx, /B_useModalFocus\(drawerOpen,\s*drawerRef,\s*drawerCloseRef,\s*drawerReturnFocusRef\)/);
  assert.match(jsx, /if \(e\.key === 'Escape' && drawerOpen\)/);
});

test('Drawer 與交通 sheet 共用 modal 焦點循環', () => {
  assert.match(jsx, /function B_useModalFocus\(/);
  assert.match(jsx, /e\.key !== 'Tab'/);
  assert.match(jsx, /e\.shiftKey/);
  assert.match(jsx, /e\.preventDefault\(\)/);
  assert.match(jsx, /last\.focus\(\)/);
  assert.match(jsx, /first\.focus\(\)/);
  assert.doesNotMatch(jsx, /offsetParent/, '固定定位 modal 不可用 offsetParent 判斷可對焦項目');
  const uses = jsx.match(/B_useModalFocus\(/g) || [];
  assert.equal(uses.length, 3, '應定義一次並分別套用於 Drawer 與交通 sheet');
  assert.match(jsx, /ref={drawerRef}/);
  assert.match(jsx, /ref={trainSheetRef}/);
});

test('交通卡使用獨立詳情按鈕且不建立巢狀互動元素', () => {
  const card = jsx.slice(jsx.indexOf('{d.train &&'), jsx.indexOf('{trainSheet &&'));
  assert.doesNotMatch(card, /role="button"|tabIndex=\{0\}|onKeyDown=/);
  assert.match(card, /<button[\s\S]*?開啟[\s\S]*?交通詳情[\s\S]*?<\/button>/);
  assert.match(card, /<a className="book-cta"/);
  assert.match(card, /<a className="stop"/);
});

test('交通 sheet 關閉按鈕依類型命名', () => {
  assert.match(jsx, /aria-label=\{`關閉\$\{isBus \? '巴士' : '火車'\}詳情`\}/);
});

test('硬時間只在旅程中查看當日時套用 Warsaw mins', () => {
  assert.match(jsx, /selectHardConstraintForMoment\(d\.hardConstraints,\s*phase,\s*d\.n,\s*momentDay,\s*mins\)/);
});

test('更新失敗會清除 React waiting worker 並隱藏更新按鈕', () => {
  assert.match(jsx, /const onUpdateError = \(\) => \{[\s\S]*?setWaitingWorker\(null\)/);
  assert.match(jsx, /waitingWorker && !updateFailed/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync('src/styles/main.css', 'utf8');

/** 取出指定選擇器的宣告區塊（只取第一個相符的規則）。 */
function ruleBody(selector) {
  const index = css.indexOf(selector);
  assert.notEqual(index, -1, `找不到規則 ${selector}`);
  const open = css.indexOf('{', index);
  return css.slice(open + 1, css.indexOf('}', open));
}

test('表格儲存格一律靠上對齊', () => {
  assert.match(ruleBody('.table-editorial th,\n.table-editorial td'), /vertical-align:\s*top/);
  assert.match(ruleBody('.city-dining-table td, .city-dining-table tbody th'), /vertical-align:\s*top/);
});

test('表格內連結不用上下對稱 padding 撐高度', () => {
  // padding-top 會把連結的第一行文字往下推，同列純文字欄沒有這段 padding，
  // 於是一欄靠上、一欄看起來置中——正是這個規則造成全站 19 個表格對不齊。
  const body = ruleBody('.table-editorial td a,\n.table-editorial th a');
  assert.match(body, /padding-block:\s*0\b/, '不可用上下 padding 撐高度');
  assert.ok(!/padding-block:\s*0\.\d+rem/.test(body), '對稱 padding 會破壞第一行對齊');
  assert.ok(!/padding-top:\s*[^0]/.test(body), '不可有非零的 padding-top');
  assert.ok(!/min-height/.test(body), '觸控高度不應在基礎規則佔版面，見 any-pointer: coarse');
});

test('44px 觸控高度只在有觸控輸入的裝置生效', () => {
  // 一行文字 21px 卻佔 44px，等於每列多付 23px；滑鼠游標不需要這麼大的命中區
  //（WCAG 2.2 AA 最小目標 24×24px，44px 是觸控裝置的建議值）。
  const index = css.indexOf('@media (any-pointer: coarse) {');
  assert.notEqual(index, -1, '缺少觸控裝置的觸控高度規則');
  const block = css.slice(index, index + 400);
  assert.match(block, /\.table-editorial td a,\s*\n\s*\.table-editorial th a \{ min-height: 44px; \}/,
    '觸控裝置上表格連結必須有 44px 命中區');
  assert.match(block, /\.city-dining-name \{ min-height: 44px; \}/,
    '觸控裝置上店名連結必須有 44px 命中區');
});

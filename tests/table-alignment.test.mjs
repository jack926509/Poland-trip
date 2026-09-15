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

test('表格內連結用 min-height 撐觸控高度，不用上下對稱 padding', () => {
  // padding-top 會把連結的第一行文字往下推，同列純文字欄沒有這段 padding，
  // 於是一欄靠上、一欄看起來置中——正是這個規則造成全站 19 個表格對不齊。
  const body = ruleBody('.table-editorial td a,\n.table-editorial th a');
  assert.match(body, /min-height:\s*44px/, '觸控高度必須保留');
  assert.match(body, /padding-block:\s*0\b/, '不可用上下 padding 撐高度');
  assert.ok(!/padding-block:\s*0\.\d+rem/.test(body), '對稱 padding 會破壞第一行對齊');
  assert.ok(!/padding-top:\s*[^0]/.test(body), '不可有非零的 padding-top');
});

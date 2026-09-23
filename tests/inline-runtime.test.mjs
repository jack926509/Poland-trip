import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

/**
 * 內嵌腳本的執行檢查。
 *
 * templates 以 fn.toString() 把函式內嵌進頁面，吐出的是函式「自己的名字」
 * 而不是 import 時用的別名。呼叫端若寫成別名，在瀏覽器裡就是 ReferenceError：
 * 靜態輸出看起來完全正常（數字是建置時算好的），但每分鐘的重算整個不會執行。
 * 2026-09-14 就發生過一次——倒數看板呼叫 getTaipeiToday，
 * 而內嵌後頁面上只有 taipeiToday。
 *
 * 因此這裡「原封不動」執行整段腳本，不替換任何一行；
 * 先前的測試因為把含 bug 的那一行換掉，反而看不到問題。
 */
function makeStubDom() {
  const node = {
    textContent: '',
    hidden: false,
    attributes: {},
    getAttribute: () => null,
    setAttribute(key, value) { this.attributes[key] = value; },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener() {},
    closest: () => null,
  };
  // 提供一張真實日期的卡片，避免 initializeToday 因零張卡提早返回，漏驗日期相依。
  const card = { ...node, getAttribute: key => key === 'data-today-date' ? '2026-10-24' : null };
  node.querySelectorAll = selector => selector === '[data-today-card]' ? [card] : [];
  const document = {
    currentScript: { closest: () => null },
    querySelector: () => node,
    querySelectorAll: node.querySelectorAll,
    createElement: () => ({ ...node, style: {}, click() {}, remove() {} }),
    body: { appendChild() {} },
    addEventListener() {},
    hidden: false,
  };
  return { node, document };
}

function runInline(source) {
  const { document } = makeStubDom();
  const context = {
    document,
    window: { addEventListener() {} },
    setInterval() {}, setTimeout() {}, clearInterval() {},
    URL: { createObjectURL: () => 'blob:x', revokeObjectURL() {} },
    Blob: class {},
    Intl, Date, Math, JSON, String, Number, Object, Array, RegExp, console,
  };
  vm.createContext(context);
  vm.runInContext(source, context, { timeout: 5000 });
}

const OWNED = [
  ['dist/practical/booking.html', 'initializeCountdown', '訂票倒數'],
  ['dist/today.html', 'initializeToday', '今日卡選日'],
  ['dist/practical/ops-dashboard.html', 'initializeDashboard', '資料品質面板'],
  ['dist/practical/groceries.html', 'initializeProductPhotos', '商品照片放大'],
];

for (const [file, marker, label] of OWNED) {
  test(`${label} 的內嵌腳本可原封不動執行，沒有未定義的名稱`, () => {
    const html = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
    const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type=)[^>]*>([\s\S]*?)<\/script>/g)]
      .map(match => match[1])
      .filter(source => source.includes(marker));
    assert.equal(scripts.length, 1, `${file} 應有且僅有一段含 ${marker} 的內嵌腳本`);
    runInline(scripts[0]);
  });
}

test('單檔版的同名內嵌腳本同樣可執行', () => {
  const html = fs.readFileSync(new URL('../poland-travel-guide-2026.html', import.meta.url), 'utf8');
  for (const [, marker, label] of OWNED) {
    const script = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type=)[^>]*>([\s\S]*?)<\/script>/g)]
      .map(match => match[1])
      .find(source => source.includes(marker));
    assert.ok(script, `單檔版缺少 ${label} 的內嵌腳本`);
    runInline(script);
  }
});

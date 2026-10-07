import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(new URL(`../src/scripts/${file}`, import.meta.url), 'utf8');

test('畸形 hash 不會中斷導覽初始化或後續商品 hashchange', () => {
  const listeners = {};
  const appended = [];
  const registered = [];
  let revealed = 0;
  const target = { closest: () => ({ setAttribute() { revealed++; } }), scrollIntoView() {} };
  const location = { hash: '#%E0%A4%A' };
  const context = {
    location, URL,
    document: {
      currentScript: { src: 'https://example.test/assets/nav.js' }, readyState: 'complete',
      querySelectorAll: () => [], querySelector: () => null,
      getElementById: id => id === 'product-1' ? target : null,
      createElement: () => ({ style: {}, setAttribute() {}, addEventListener() {} }),
      body: { append: node => appended.push(node) },
      documentElement: { scrollHeight: 2000 }, addEventListener() {},
    },
    window: { scrollY: 0, innerHeight: 800, addEventListener: (name, handler) => { listeners[name] = handler; } },
    navigator: { serviceWorker: { register: url => { registered.push(url.href); return Promise.resolve(); } } },
    requestAnimationFrame: handler => { handler(); return 1; },
  };
  assert.doesNotThrow(() => vm.runInNewContext(read('nav.js'), context));
  assert.ok(appended.some(node => node.className === 'to-top'));
  assert.ok(appended.some(node => node.className === 'reading-progress'));
  assert.deepEqual(registered, ['https://example.test/sw.js']);
  assert.doesNotThrow(() => listeners.hashchange());
  location.hash = '#product-%31';
  listeners.hashchange();
  assert.equal(revealed, 1);
});

for (const fails of [true, false]) {
  test(`私人資料清除${fails ? '失敗保留內容並顯示錯誤' : '成功清空內容並通知其他區塊'}`, () => {
    const handlers = {};
    const status = { textContent: '', attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } };
    const field = { value: '', getAttribute: () => 'emergency' };
    const clear = { addEventListener: (name, handler) => { handlers[name] = handler; } };
    const panel = {
      querySelector: selector => selector === '[data-private-status]' ? status : clear,
      querySelectorAll: selector => selector === '[data-private-field]' ? [field] : [],
      addEventListener() {},
    };
    const root = { querySelector: () => panel, querySelectorAll: () => [] };
    let stored = JSON.stringify({ emergency: 'Family contact' });
    let announced = 0;
    const context = vm.createContext({
      root, confirm: () => true, Event,
      localStorage: { getItem: () => stored, removeItem() { if (fails) throw new Error('blocked'); stored = null; } },
      window: { addEventListener() {}, dispatchEvent() { announced++; } },
    });
    vm.runInContext(`${read('private-data.js').replace(/export /g, '')}\ninitializePrivate(root);`, context);
    assert.equal(field.value, 'Family contact');
    handlers.click();
    assert.equal(field.value, fails ? 'Family contact' : '');
    assert.equal(status.attrs['data-problem'], String(fails));
    assert.match(status.textContent, fails ? /無法清除/ : /已清除/);
    assert.equal(announced, fails ? 0 : 1);
    assert.equal(stored === null, !fails);
  });
}

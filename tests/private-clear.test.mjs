import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { PRIVATE_RUNTIME } from '../src/templates/private-panel.mjs';

function clearFixture({ fail = false, confirmResult = true } = {}) {
  let stored = JSON.stringify({ policy: 'TEST-POLICY' });
  let click;
  let removeCalls = 0;
  let announcements = 0;
  const note = { textContent: '', attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } };
  const input = { value: '', getAttribute: () => 'policy' };
  const panel = {
    querySelector(s) {
      return s === '[data-private-status]' ? note
        : s === '[data-private-clear]' ? { addEventListener(_, fn) { click = fn; } } : null;
    },
    querySelectorAll: s => s === '[data-private-field]' ? [input] : [],
    addEventListener() {},
  };
  const root = { querySelector: () => panel, querySelectorAll: () => [] };
  const context = vm.createContext({
    root, Event: class {}, confirm: () => confirmResult,
    window: { addEventListener() {}, dispatchEvent() { announcements += 1; } },
    localStorage: {
      getItem: () => stored,
      removeItem() { removeCalls += 1; if (fail) throw new Error('儲存存取被封鎖'); stored = null; },
    },
  });
  vm.runInContext(`${PRIVATE_RUNTIME}\ninitializePrivate(root);`, context);
  return { note, input, click: () => click(), read: () => stored,
    counts: () => ({ removeCalls, announcements }) };
}

test('私人資料清除失敗：保留資料與欄位、提示失敗、不宣告已清除', () => {
  const fixture = clearFixture({ fail: true });
  fixture.click();
  assert.equal(JSON.parse(fixture.read()).policy, 'TEST-POLICY');
  assert.equal(fixture.input.value, 'TEST-POLICY');
  assert.match(fixture.note.textContent, /無法清除/);
  assert.equal(fixture.note.attrs['data-problem'], 'true');
  assert.deepEqual(fixture.counts(), { removeCalls: 1, announcements: 0 });
});

test('私人資料清除成功：移除儲存資料、清空欄位並通知其他顯示區', () => {
  const fixture = clearFixture();
  fixture.click();
  assert.equal(fixture.read(), null);
  assert.equal(fixture.input.value, '');
  assert.equal(fixture.note.textContent, '已清除這支手機上的私人資料。');
  assert.equal(fixture.note.attrs['data-problem'], 'false');
  assert.deepEqual(fixture.counts(), { removeCalls: 1, announcements: 1 });
});

test('取消清除確認：原資料與欄位保留，不執行儲存操作', () => {
  const fixture = clearFixture({ confirmResult: false });
  fixture.click();
  assert.equal(JSON.parse(fixture.read()).policy, 'TEST-POLICY');
  assert.equal(fixture.input.value, 'TEST-POLICY');
  assert.equal(fixture.note.textContent, '');
  assert.deepEqual(fixture.counts(), { removeCalls: 0, announcements: 0 });
});

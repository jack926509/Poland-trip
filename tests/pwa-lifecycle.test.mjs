import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const source = fs.readFileSync('pwa-register.js', 'utf8');

function harness({ registration, controller = null, ready = Promise.resolve(registration) }) {
  const windowListeners = {};
  const serviceWorkerListeners = {};
  const events = [];
  let reloads = 0;
  const context = {
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init?.detail; } },
    navigator: { serviceWorker: {
      controller, ready,
      register: () => Promise.resolve(registration),
      addEventListener(name, fn) { serviceWorkerListeners[name] = fn; },
    } },
    window: {
      location: { reload() { reloads += 1; } },
      addEventListener(name, fn) { windowListeners[name] = fn; },
      dispatchEvent(event) { events.push(event); },
    },
    WeakSet,
  };
  vm.runInNewContext(source, context);
  return { context, events, windowListeners, serviceWorkerListeners, reloads: () => reloads };
}

test('已有 active worker 時背景更新 redundant 保留 ready 並回報更新失敗', async () => {
  let statechange;
  const active = { state: 'activated' };
  const installing = { state: 'installing', addEventListener(_name, fn) { statechange = fn; } };
  const registration = { active, installing, waiting: null, addEventListener() {} };
  const h = harness({ registration, controller: active });
  await h.windowListeners.load();
  installing.state = 'redundant';
  statechange();
  assert.equal(h.context.window.PolskaPwaState.status, 'ready');
  assert.equal(h.events.at(-1).type, 'pwa-update-error');
});

test('首次安裝 worker redundant 仍回報全面失敗', async () => {
  let statechange;
  const installing = { state: 'installing', addEventListener(_name, fn) { statechange = fn; } };
  const registration = { active: null, installing, waiting: null, addEventListener() {} };
  const h = harness({ registration, ready: new Promise(() => {}) });
  h.windowListeners.load();
  await new Promise((resolve) => setImmediate(resolve));
  installing.state = 'redundant';
  statechange();
  assert.equal(h.context.window.PolskaPwaState.status, 'error');
  assert.equal(h.events.at(-1).type, 'pwa-error');
});

test('waiting worker 只在使用者確認後 SKIP_WAITING，controllerchange 最多 reload 一次', async () => {
  const messages = [];
  const waiting = { postMessage(message) { messages.push(message); } };
  const active = { state: 'activated' };
  const registration = { active, installing: null, waiting, addEventListener() {} };
  const h = harness({ registration, controller: active });
  await h.windowListeners.load();
  assert.deepEqual(messages, []);
  h.context.window.PolskaPwaState.applyUpdate();
  assert.deepEqual(JSON.parse(JSON.stringify(messages)), [{ type: 'SKIP_WAITING' }]);
  h.serviceWorkerListeners.controllerchange();
  h.serviceWorkerListeners.controllerchange();
  assert.equal(h.reloads(), 1);
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const sw = fs.readFileSync('sw.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const jsx = fs.readFileSync('redesign/B-companion.jsx', 'utf8');

function loadFetchHandler({ fetchImpl, matchImpl }) {
  const listeners = {};
  const puts = [];
  const matches = [];
  const context = {
    URL,
    fetch: fetchImpl,
    caches: {
      match(request) {
        matches.push(request);
        return Promise.resolve(matchImpl(request));
      },
      open() {
        return Promise.resolve({
          addAll() { return Promise.resolve(); },
          put(request, response) {
            puts.push({ request, response });
            return Promise.resolve();
          },
        });
      },
      keys() { return Promise.resolve([]); },
      delete() { return Promise.resolve(true); },
    },
    self: {
      location: { origin: 'https://example.test' },
      clients: { claim() { return Promise.resolve(); } },
      skipWaiting() {},
      addEventListener(name, handler) { listeners[name] = handler; },
    },
  };
  vm.runInNewContext(sw, context);
  return { handler: listeners.fetch, matches, puts };
}

async function dispatchFetch(handler, request) {
  let responsePromise;
  handler({ request, respondWith(value) { responsePromise = value; } });
  assert.ok(responsePromise, '必須由 Service Worker 回應請求');
  const response = await responsePromise;
  await Promise.resolve();
  return response;
}

function makeRequest(path, { mode = 'cors', accept = '' } = {}) {
  return {
    url: `https://example.test/${path}`,
    method: 'GET',
    mode,
    headers: { get(name) { return name === 'accept' ? accept : ''; } },
  };
}

function loadRegisterHarness({ registration, ready, registerError }) {
  const windowListeners = {};
  const events = [];
  const context = {
    CustomEvent: class CustomEvent {
      constructor(type, init) { this.type = type; this.detail = init?.detail; }
    },
    navigator: {
      serviceWorker: {
        controller: null,
        ready,
        register() {
          return registerError ? Promise.reject(registerError) : Promise.resolve(registration);
        },
      },
    },
    window: {
      addEventListener(name, handler) { windowListeners[name] = handler; },
      dispatchEvent(event) { events.push(event); },
    },
  };
  vm.runInNewContext(fs.readFileSync('pwa-register.js', 'utf8'), context);
  return { events, load: windowListeners.load, navigator: context.navigator };
}

test('只預快取單一正式應用', () => {
  assert.match(sw, /'\.\/'/);
  assert.doesNotMatch(sw, /mobile\.html|desktop\.html|app-preview\.html|A-magazine|ios-frame|C-app/);
});

test('核心資源使用完整 addAll，不吞掉安裝錯誤', () => {
  assert.match(sw, /cache\.addAll\(PRECACHE_URLS\)/);
  assert.doesNotMatch(sw, /cache\.add\(url\)\.catch/);
});

test('離線導覽回到根應用殼', () => {
  assert.match(sw, /caches\.match\('\.\/'\)/);
});

test('舊入口 navigation 離線時不回舊 URL cache，統一回根 app shell', async () => {
  const legacy = { marker: 'legacy' };
  const root = { marker: 'root' };
  const { handler, puts } = loadFetchHandler({
    fetchImpl: () => Promise.reject(new Error('offline')),
    matchImpl: (request) => request === './' ? root : legacy,
  });
  const response = await dispatchFetch(
    handler,
    makeRequest('mobile.html', { mode: 'navigate', accept: 'text/html' }),
  );
  assert.equal(response, root);
  assert.equal(puts.length, 0);
});

test('navigation 線上回應不寫入 URL runtime cache', async () => {
  const network = { marker: 'network', clone() { return this; } };
  const { handler, puts } = loadFetchHandler({
    fetchImpl: () => Promise.resolve(network),
    matchImpl: () => null,
  });
  const response = await dispatchFetch(
    handler,
    makeRequest('desktop.html', { mode: 'navigate', accept: 'text/html' }),
  );
  assert.equal(response, network);
  assert.equal(puts.length, 0);
});

test('非正式同源資產不讀寫 runtime cache', async () => {
  const stale = { marker: 'stale' };
  const network = { marker: 'network', ok: true, clone() { return this; } };
  const { handler, matches, puts } = loadFetchHandler({
    fetchImpl: () => Promise.resolve(network),
    matchImpl: () => stale,
  });
  const response = await dispatchFetch(handler, makeRequest('redesign/A-magazine.css'));
  assert.equal(response, network);
  assert.equal(matches.length, 0);
  assert.equal(puts.length, 0);
});

test('正式根應用資產仍使用 cache-first', async () => {
  const cached = { marker: 'cached' };
  const network = { marker: 'network', ok: true, clone() { return this; } };
  const { handler, matches } = loadFetchHandler({
    fetchImpl: () => Promise.resolve(network),
    matchImpl: () => cached,
  });
  const response = await dispatchFetch(
    handler,
    makeRequest('redesign/B-companion.css?v=polska-v13'),
  );
  assert.equal(response, cached);
  assert.equal(matches.length, 1);
});

test('核心快取與根入口統一使用 polska-v13', () => {
  assert.match(sw, /const CACHE_VERSION = 'polska-v13'/);
  for (const asset of [
    './manifest.json', './pwa-register.js', './redesign/pwa-core.js',
    './redesign/data.js?v=polska-v13', './redesign/tokens.css?v=polska-v13',
    './redesign/B-companion.css?v=polska-v13',
    './redesign/dist/B-companion.js?v=polska-v13',
  ]) assert.match(sw, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(sw, /polska-v12/);
});

test('Service Worker 註冊抽離為三種 PWA 事件', () => {
  const register = fs.readFileSync('pwa-register.js', 'utf8');
  assert.match(html, /<script src="pwa-register\.js"><\/script>/);
  assert.doesNotMatch(html, /navigator\.serviceWorker\.register/);
  for (const eventName of ['pwa-ready', 'pwa-update-ready', 'pwa-error']) {
    assert.match(register, new RegExp(eventName));
  }
});

test('pwa-ready 等 active worker 完成後才送出', async () => {
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  const registration = {
    active: null,
    waiting: null,
    installing: null,
    addEventListener() {},
  };
  const harness = loadRegisterHarness({ registration, ready });
  const loadPromise = harness.load();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(harness.events.some((event) => event.type === 'pwa-ready'), false);
  resolveReady({ active: { state: 'activated' } });
  await loadPromise;
  assert.equal(harness.events.some((event) => event.type === 'pwa-ready'), true);
});

test('worker redundant 與註冊失敗均送出 pwa-error', async () => {
  let stateHandler;
  const worker = {
    state: 'installing',
    addEventListener(name, handler) { if (name === 'statechange') stateHandler = handler; },
  };
  const registration = {
    active: null,
    waiting: null,
    installing: worker,
    addEventListener() {},
  };
  const pendingReady = new Promise(() => {});
  const redundantHarness = loadRegisterHarness({ registration, ready: pendingReady });
  redundantHarness.load();
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(typeof stateHandler, 'function', '必須監聽 installing worker 的狀態');
  worker.state = 'redundant';
  stateHandler();
  assert.equal(
    redundantHarness.events.some((event) => event.type === 'pwa-error' && event.detail.reason === 'worker-redundant'),
    true,
  );

  const errorHarness = loadRegisterHarness({
    registration: null,
    ready: pendingReady,
    registerError: new Error('register failed'),
  });
  await errorHarness.load();
  assert.equal(
    errorHarness.events.some((event) => event.type === 'pwa-error' && event.detail.reason === 'registration'),
    true,
  );
});

test('更新只由使用者按鈕觸發，controllerchange 才重載一次', () => {
  assert.match(jsx, /waitingWorker\.postMessage\(\{ type: 'SKIP_WAITING' \}\)/);
  assert.match(jsx, /controllerchange/);
  assert.match(jsx, /window\.location\.reload\(\)/);
  assert.match(jsx, /updateApprovedRef/);
});

test('顯示安裝、離線、更新與儲存降級狀態', () => {
  for (const label of [
    '已連線', '離線模式', '可安裝', '已安裝', '更新可用',
    '備註只保留到這次關閉前', '加到 iPhone 主畫面',
    '目前離線；站名與地址仍可在本頁查看',
  ]) assert.match(jsx, new RegExp(label));
  assert.match(jsx, /B_isIOSSafari/);
  assert.match(jsx, /onClickCapture/);
});

test('PWA 狀態與 Chromium 安裝訊號來自真實事件', () => {
  for (const state of ['正在準備離線資料', '離線資料已準備', '離線資料準備失敗', '瀏覽器模式']) {
    assert.match(jsx, new RegExp(state));
  }
  assert.match(jsx, /beforeinstallprompt/);
  assert.match(jsx, /appinstalled/);
  assert.match(jsx, /installStatus/);
  assert.doesNotMatch(jsx, /online \? '離線資料已準備'/);
});

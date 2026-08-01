import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';

const sw = fs.readFileSync('sw.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const mobileHtml = fs.readFileSync('mobile.html', 'utf8');
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
      location: { origin: 'https://example.test', href: 'https://example.test/sw.js' },
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
        addEventListener() {},
      },
    },
    window: {
      location: { reload() {} },
      addEventListener(name, handler) { windowListeners[name] = handler; },
      dispatchEvent(event) { events.push(event); },
    },
  };
  vm.runInNewContext(fs.readFileSync('pwa-register.js', 'utf8'), context);
  return { events, load: windowListeners.load, navigator: context.navigator };
}

test('預快取桌機與手機雙殼及其正式資產', () => {
  for (const asset of [
    './', './mobile.html',
    './desktop/desktop.css?v=polska-v21',
    './desktop/desktop-app.js?v=polska-v21',
    './desktop/chapters.js?v=polska-v21',
    './redesign/data.js?v=polska-v21',
    './redesign/dist/B-companion.js?v=polska-v21',
  ]) assert.match(sw, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.doesNotMatch(sw, /desktop\.html|app-preview\.html|A-magazine|ios-frame|C-app/);
});

test('核心資源使用完整 addAll，不吞掉安裝錯誤', () => {
  assert.match(sw, /cache\.addAll\(PRECACHE_URLS\)/);
  assert.doesNotMatch(sw, /cache\.add\(url\)\.catch/);
});

test('離線導覽依網址選擇桌機或手機應用殼', () => {
  assert.match(sw, /function navigationFallback\(url\)/);
  assert.match(sw, /url\.pathname\.endsWith\('\/mobile\.html'\)/);
  assert.match(sw, /caches\.match\(navigationFallback\(url\)\)/);
});

test('手機 navigation 離線時回手機殼', async () => {
  const legacy = { marker: 'legacy' };
  const mobile = { marker: 'mobile' };
  const { handler, puts } = loadFetchHandler({
    fetchImpl: () => Promise.reject(new Error('offline')),
    matchImpl: (request) => request === './mobile.html' ? mobile : legacy,
  });
  const response = await dispatchFetch(
    handler,
    makeRequest('mobile.html', { mode: 'navigate', accept: 'text/html' }),
  );
  assert.equal(response, mobile);
  assert.equal(puts.length, 0);
});

test('根 navigation 離線時回桌機共用根殼', async () => {
  const root = { marker: 'root' };
  const { handler } = loadFetchHandler({
    fetchImpl: () => Promise.reject(new Error('offline')),
    matchImpl: (request) => request === './' ? root : null,
  });
  const response = await dispatchFetch(handler, makeRequest('', { mode: 'navigate', accept: 'text/html' }));
  assert.equal(response, root);
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

test('巢狀路徑下的同名正式資產也不得命中 runtime cache', async () => {
  for (const prefix of ['archive', 'legacy']) {
    const stale = { marker: `stale-${prefix}` };
    const network = { marker: `network-${prefix}`, ok: true, clone() { return this; } };
    const { handler, matches, puts } = loadFetchHandler({
      fetchImpl: () => Promise.resolve(network),
      matchImpl: () => stale,
    });
    const response = await dispatchFetch(
      handler,
      makeRequest(`${prefix}/redesign/B-companion.css?v=polska-v21`),
    );
    assert.equal(response, network, `${prefix} 誤回舊 cache`);
    assert.equal(matches.length, 0, `${prefix} 不得讀 cache`);
    assert.equal(puts.length, 0, `${prefix} 不得寫 cache`);
  }
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
    makeRequest('redesign/B-companion.css?v=polska-v21'),
  );
  assert.equal(response, cached);
  assert.equal(matches.length, 1);
});

test('核心快取與雙入口統一使用 polska-v21', () => {
  assert.match(sw, /const CACHE_VERSION = 'polska-v21'/);
  for (const asset of [
    './manifest.json', './pwa-register.js?v=polska-v21', './redesign/pwa-core.js?v=polska-v21',
    './redesign/data.js?v=polska-v21', './redesign/tokens.css?v=polska-v21',
    './redesign/B-companion.css?v=polska-v21',
    './redesign/dist/B-companion.js?v=polska-v21',
  ]) assert.match(sw, new RegExp(asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  // 收緊：每次升版把字元類往上帶一格，舊版號一律不得殘留（v1[0-9] 涵蓋 v10-v19，
  // 另外併入 v20，因為 v21 的上一版就是它，最容易殘留）。
  assert.doesNotMatch(sw, /polska-v(1[0-9]|20)/);
});

test('八張城市照片都進了 precache 且版本已升 v21', () => {
  assert.match(sw, /CACHE_VERSION = 'polska-v21'/);
  for (const city of ['warszawa', 'krakow', 'wroclaw', 'poznan']) {
    assert.match(sw, new RegExp(`\\./assets/photos/${city}-hero\\.webp`));
    assert.match(sw, new RegExp(`\\./assets/photos/${city}-thumb\\.webp`));
  }
  // 不內嵌任何舊版號字面量：只要不是目前版號 v21 的 polska-vNN 都算殘留，
  // 每次升版自動概化，不必手動把字元類往上帶一格，grep 對使用者才有驗證意義。
  assert.doesNotMatch(sw, /polska-v(?!21)\d+/);
});

/* caches.addAll 是原子操作：只要 index.html 或 mobile.html 裡任何一個帶版本號的
   資產參照，跟 sw.js 的 PRECACHE_URLS 版號不同步，離線時該資產就抓不到快取，
   而目前 176 個測試全綠也驗不出這種局部退版——這條測試專門補這個洞。 */
test('雙入口每個帶版本號的資產都與 SW 預快取清單完全一致', () => {
  const block = sw.match(/const PRECACHE_URLS = \[([\s\S]*?)\];/);
  assert.ok(block, '找不到 PRECACHE_URLS 陣列');
  const pre = new Set(
    [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1].replace(/^\.\//, '')),
  );
  for (const [page, content] of [['index.html', html], ['mobile.html', mobileHtml]]) {
    const refs = [...content.matchAll(/(?:src|href)="([^"]*\?v=[^"]+)"/g)];
    assert.ok(refs.length > 0, `${page} 沒有找到任何帶版本號的資產參照，疑似解析失敗`);
    for (const [, ref] of refs) {
      assert.ok(pre.has(ref), `${page} 的 ${ref} 不在 SW 預快取清單裡，離線會抓不到`);
    }
  }
});

test('Service Worker 註冊抽離為三種 PWA 事件', () => {
  const register = fs.readFileSync('pwa-register.js', 'utf8');
  assert.match(html, /<script src="pwa-register\.js\?v=polska-v21"><\/script>/);
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

test('首次安裝 worker redundant 與註冊失敗均送出 pwa-error', async () => {
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

test('更新按鈕委派給可執行 lifecycle 控制器', () => {
  assert.match(jsx, /PolskaPwaState\?\.applyUpdate\?\.\(\)/);
  assert.match(jsx, /更新失敗，仍使用目前版本/);
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

test('Chromium deferred prompt 只由使用者按鈕觸發並正確清理', () => {
  assert.match(jsx, /installPromptRef/);
  assert.match(jsx, /event\.preventDefault\(\)/);
  assert.match(jsx, /installPromptRef\.current\s*=\s*event/);
  assert.match(jsx, /const installApp\s*=\s*async/);
  assert.match(jsx, /await promptEvent\.prompt\(\)/);
  assert.match(jsx, /await promptEvent\.userChoice/);
  assert.match(jsx, /installPromptRef\.current\s*=\s*null/);
  assert.match(jsx, /outcome\s*===\s*'accepted'/);
  assert.match(jsx, /onClick=\{installApp\}>安裝 App<\/button>/);
  assert.match(jsx, /setInstallStatus\('browser'\)/);
});

/* caches.addAll 是原子操作：PRECACHE_URLS 裡任何一條抓不到，整個 install 就失敗、
   離線完全失效。這條測試逐一確認每個預快取路徑在檔案系統上真的存在。 */
test('PRECACHE_URLS 每一條路徑都對應到實際存在的檔案', () => {
  const block = sw.match(/const PRECACHE_URLS = \[([\s\S]*?)\];/);
  assert.ok(block, '找不到 PRECACHE_URLS 陣列');
  const urls = [...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.ok(urls.length >= 25, `預快取清單只有 ${urls.length} 條，疑似解析失敗`);
  const missing = [];
  for (const url of urls) {
    // './' 是 app shell，實體檔案是 index.html；?v= 查詢字串不是路徑的一部分。
    const filePath = url === './' ? './index.html' : url.split('?')[0];
    if (!fs.existsSync(filePath)) missing.push(`${url} -> ${filePath}`);
  }
  assert.deepEqual(missing, [], `預快取清單指向不存在的檔案：${missing.join('、')}`);
});

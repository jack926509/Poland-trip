import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const origin = 'https://example.test';
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((done, fail) => { resolve = done; reject = fail; });
  return { promise, resolve, reject };
};

function fixture({ fetch, match = async () => undefined, put = async () => {}, keys = [], enforceLifetime = true, timers = { setTimeout, clearTimeout } } = {}) {
  const listeners = {};
  const deleted = [];
  const cache = { match, put, keys: async () => keys, delete: async key => { deleted.push(key); } };
  vm.runInNewContext(source, {
    self: { location: { origin }, addEventListener: (name, handler) => { listeners[name] = handler; } },
    caches: { open: async () => cache, match }, fetch, URL, Response, ...timers,
  });
  return {
    deleted,
    dispatch(url, navigation = false) {
      const lifetimes = [];
      let synchronous = true;
      let response;
      listeners.fetch({
        request: { url, method: 'GET', mode: navigation ? 'navigate' : 'cors', destination: navigation ? 'document' : '' },
        waitUntil(promise) {
          if (enforceLifetime) assert.ok(synchronous || lifetimes.length, 'first waitUntil must run synchronously');
          lifetimes.push(promise);
        },
        respondWith(promise) { response = promise; },
      });
      synchronous = false;
      if (enforceLifetime) assert.ok(lifetimes.length);
      return { response, lifetimes, async finish() { await response; for (let i = 0; i < lifetimes.length; i++) await lifetimes[i]; } };
    },
  };
}

for (const [name, url, navigation] of [
  ['頁面', `${origin}/today`, true],
  ['靜態資源', `${origin}/assets/new.webp`, false],
  ['圖磚', 'https://tile.openstreetmap.org/1/0/0.png', false],
]) {
  test(`${name}回應不等待快取寫入，但 event 存活直到寫入完成`, async () => {
    const gate = deferred();
    let writes = 0;
    const worker = fixture({ fetch: async () => new Response('network'), put: async () => { writes++; await gate.promise; } });
    const event = worker.dispatch(url, navigation);
    assert.equal(await (await event.response).text(), 'network');
    let finished = false;
    const completion = event.finish().then(() => { finished = true; });
    await new Promise(done => setImmediate(done));
    assert.equal(writes, 1);
    assert.equal(finished, false);
    gate.resolve();
    await completion;
    assert.equal(finished, true);
  });

  test(`${name}快取寫入被拒絕仍保留網路回應`, async () => {
    const worker = fixture({ fetch: async () => new Response('network'), put: async () => { throw new Error('quota'); } });
    const event = worker.dispatch(url, navigation);
    assert.equal(await (await event.response).text(), 'network');
    await event.finish();
  });
}

test('圖磚命中快取後仍等待背景網路更新與容量整理', async () => {
  const gate = deferred();
  const keys = Array.from({ length: 402 }, (_, i) => `tile-${i}`);
  const worker = fixture({ fetch: () => gate.promise, match: async () => new Response('cached'), keys });
  const event = worker.dispatch('https://tile.openstreetmap.org/1/0/0.png');
  assert.equal(await (await event.response).text(), 'cached');
  assert.deepEqual(worker.deleted, []);
  gate.resolve(new Response('fresh'));
  await event.finish();
  assert.deepEqual(worker.deleted, ['tile-0', 'tile-1']);
});

for (const pathname of ['/today.html', '/today', '/index.html', '/Poland-trip/index.html', '/Poland-trip/']) {
  test(`離線含 query 導覽 ${pathname} 使用同頁無 query 快取`, async () => {
    const worker = fixture({
      enforceLifetime: false,
      fetch: async () => { throw new Error('offline'); },
      match: async key => key === `${origin}${pathname}` ? new Response('same page') : undefined,
    });
    const event = worker.dispatch(`${origin}${pathname}?from=search`, true);
    assert.equal(await (await event.response).text(), 'same page');
    await event.finish();
  });
}

function fakeTimers() {
  let callback;
  return {
    setTimeout(fn, delay) { assert.equal(delay, 3500); callback = fn; return 1; },
    clearTimeout() { callback = undefined; },
    expire() { assert.ok(callback); callback(); },
  };
}

for (const cachedKey of [`${origin}/today?from=search`, `${origin}/today`, `${origin}/today.html`]) {
  test(`慢速導覽逾時回原頁快取 ${cachedKey}，背景繼續更新乾淨回應`, async () => {
    const gate = deferred();
    const timers = fakeTimers();
    const writes = [];
    const worker = fixture({ fetch: () => gate.promise, timers,
      match: async key => (typeof key === 'string' ? key : key.url) === cachedKey ? new Response('cached') : undefined,
      put: async (key, value) => { writes.push(value); },
    });
    const event = worker.dispatch(`${origin}/today?from=search`, true);
    await new Promise(done => setImmediate(done));
    timers.expire();
    assert.equal(await (await event.response).text(), 'cached');
    let finished = false;
    const completion = event.finish().then(() => { finished = true; });
    await new Promise(done => setImmediate(done));
    assert.equal(finished, false);
    const fresh = new Response('fresh');
    Object.defineProperty(fresh, 'redirected', { value: true });
    gate.resolve(fresh);
    await completion;
    assert.equal(writes.length, 1);
    assert.equal(writes[0].redirected, false);
    assert.equal(await writes[0].text(), 'fresh');
  });
}

test('慢速導覽無原頁快取時逾時仍等網路，不提早回首頁', async () => {
  const gate = deferred();
  const timers = fakeTimers();
  const worker = fixture({ fetch: () => gate.promise, timers,
    match: async key => key === './index.html' ? new Response('home') : undefined });
  const event = worker.dispatch(`${origin}/today`, true);
  let resolved = false;
  event.response.then(() => { resolved = true; });
  await new Promise(done => setImmediate(done));
  timers.expire();
  await new Promise(done => setImmediate(done));
  assert.equal(resolved, false);
  gate.resolve(new Response('late network'));
  assert.equal(await (await event.response).text(), 'late network');
  await event.finish();
});

test('CORS 圖磚寫入後持續修剪至 400 筆，opaque 不寫入', async () => {
  const store = new Map(Array.from({ length: 400 }, (_, i) => [`tile-${i}`, true]));
  const keys = () => [...store.keys()];
  const listeners = {};
  let opaque = false;
  const cache = { match: async () => undefined, keys: async () => keys(),
    put: async (key, value) => { assert.equal(value.type, 'cors'); store.set(key.url, value); },
    delete: async key => store.delete(key) };
  vm.runInNewContext(source, {
    self: { location: { origin }, addEventListener: (name, fn) => { listeners[name] = fn; } },
    caches: { open: async () => cache }, URL, Response,
    fetch: async () => {
      if (opaque) return { ok: false, type: 'opaque' };
      const response = new Response('tile');
      Object.defineProperty(response, 'type', { value: 'cors' });
      response.clone = () => response;
      return response;
    },
  });
  for (let i = 0; i < 5; i++) {
    const lifetimes = [];
    listeners.fetch({ request: { method: 'GET', url: `https://tile.openstreetmap.org/1/0/${i}.png` },
      waitUntil: promise => lifetimes.push(promise), respondWith: () => {} });
    for (let j = 0; j < lifetimes.length; j++) await lifetimes[j];
    assert.equal(store.size, 400);
    assert.ok(store.has(`https://tile.openstreetmap.org/1/0/${i}.png`));
    assert.equal(store.has(`tile-${i}`), false);
  }
  opaque = true;
  const lifetimes = [];
  listeners.fetch({ request: { method: 'GET', url: 'https://tile.openstreetmap.org/opaque.png' },
    waitUntil: promise => lifetimes.push(promise), respondWith: () => {} });
  for (let j = 0; j < lifetimes.length; j++) await lifetimes[j];
  assert.equal(store.size, 400);
  assert.equal(store.has('https://tile.openstreetmap.org/opaque.png'), false);
});

test('日程、城市及單檔產物的所有圖磚圖層皆啟用 crossOrigin', () => {
  for (const path of ['dist/day-02.html', 'dist/city-warszawa.html', 'poland-travel-guide-2026.html']) {
    const html = fs.readFileSync(path, 'utf8');
    const layers = [...html.matchAll(/L\.tileLayer\([^,]+,\s*\{([^}]+)\}/g)];
    assert.ok(layers.length, path);
    for (const layer of layers) assert.match(layer[1], /crossOrigin:\s*true/, path);
  }
});

for (const outcome of ['offline', '503']) {
  test(`慢速導覽無原頁快取逾時後 ${outcome} 保留原有回退`, async () => {
    const gate = deferred();
    const timers = fakeTimers();
    const worker = fixture({ fetch: () => gate.promise, timers,
      match: async key => key === './index.html' ? new Response('home') : undefined });
    const event = worker.dispatch(`${origin}/today`, true);
    await new Promise(done => setImmediate(done));
    timers.expire();
    await new Promise(done => setImmediate(done));
    if (outcome === 'offline') gate.reject(new Error('offline'));
    else gate.resolve(new Response('server error', { status: 503 }));
    const response = await event.response;
    assert.equal(await response.text(), outcome === 'offline' ? 'home' : 'server error');
    await event.finish();
  });
}

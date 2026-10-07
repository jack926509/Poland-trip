import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8');
const origin = 'https://example.test';
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};

function fixture({ fetch, match = async () => undefined, put = async () => {}, keys = [], enforceLifetime = true } = {}) {
  const listeners = {};
  const deleted = [];
  const cache = { match, put, keys: async () => keys, delete: async key => { deleted.push(key); } };
  vm.runInNewContext(source, {
    self: { location: { origin }, addEventListener: (name, handler) => { listeners[name] = handler; } },
    caches: { open: async () => cache, match }, fetch, URL, Response,
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
      return { response, lifetimes, async finish() { await response; await Promise.all(lifetimes); } };
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

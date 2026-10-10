import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

async function navigate({ status = 503, stored = [], path = '/today.html', offline = false } = {}) {
  const origin = 'https://example.test';
  const handlers = new Map();
  const puts = [];
  const cache = {
    async match(key) {
      const url = new URL(typeof key === 'string' ? key : key.url, `${origin}/`).href;
      const item = stored.find(([pathname]) => new URL(pathname, `${origin}/`).href === url);
      return item ? new Response(item[1], { status: 200 }) : undefined;
    },
    async put(key) { puts.push(key); },
  };
  const context = vm.createContext({
    self: { location: { origin }, addEventListener(type, fn) { handlers.set(type, fn); } },
    caches: { open: async () => cache }, URL, Response,
    fetch: async () => {
      if (offline) throw new TypeError('離線');
      return new Response(`NETWORK ${status}`, { status });
    },
  });
  vm.runInContext(fs.readFileSync(new URL('../sw.js', import.meta.url), 'utf8'), context);
  let response;
  handlers.get('fetch')({
    request: { url: `${origin}${path}`, method: 'GET', mode: 'navigate', destination: 'document' },
    respondWith(promise) { response = promise; },
  });
  return { response: await response, puts };
}

test('503 導覽請求有原頁快取時顯示離線行程，不儲存伺服器錯誤', async () => {
  const result = await navigate({ stored: [['/today.html', 'CACHED TODAY']] });
  assert.equal(result.response.status, 200);
  assert.equal(await result.response.text(), 'CACHED TODAY');
  assert.equal(result.puts.length, 0);
});

test('500／502／504 導覽請求皆優先使用原頁快取', async () => {
  for (const status of [500, 502, 504]) {
    const result = await navigate({ status, stored: [['/today.html', 'CACHED TODAY']] });
    assert.equal(result.response.status, 200, String(status));
    assert.equal(await result.response.text(), 'CACHED TODAY');
    assert.equal(result.puts.length, 0);
  }
});

test('503 時乾淨網址與 .html 可互相命中快取，保留 GitHub Pages 子目錄', async () => {
  for (const [path, cached] of [['/today', '/today.html'], ['/today.html', '/today'],
    ['/Poland-trip/today', '/Poland-trip/today.html']]) {
    const result = await navigate({ path, stored: [[cached, 'SAME PAGE']] });
    assert.equal(await result.response.text(), 'SAME PAGE', path);
  }
});

test('503 無原頁快取時保留錯誤回應，不以首頁冒充所查的行程', async () => {
  for (const stored of [[], [['/index.html', 'HOME']]]) {
    const result = await navigate({ stored });
    assert.equal(result.response.status, 503);
    assert.equal(await result.response.text(), 'NETWORK 503');
    assert.equal(result.puts.length, 0);
  }
});

test('正常 200 及 404 回應保持網路結果，不被舊快取覆蓋', async () => {
  for (const status of [200, 404]) {
    const result = await navigate({ status, stored: [['/today.html', 'OLD PAGE']] });
    assert.equal(result.response.status, status);
    assert.equal(await result.response.text(), `NETWORK ${status}`);
  }
});

test('完全斷網時仍可回退原頁或首頁，皆無快取時回傳網路錯誤', async () => {
  const page = await navigate({ offline: true, stored: [['/today.html', 'CACHED TODAY']] });
  assert.equal(await page.response.text(), 'CACHED TODAY');
  const home = await navigate({ offline: true, stored: [['/index.html', 'HOME']] });
  assert.equal(await home.response.text(), 'HOME');
  const missing = await navigate({ offline: true });
  assert.equal(missing.response.type, 'error');
});

// POLSKA 旅遊指南 Service Worker — 離線優先策略
// 出發到波蘭時即使無網路也能看完整指南
const CACHE_VERSION = 'polska-v15';
// Relative paths so the SW works on root domains and
// sub-path deploys like jack926509.github.io/Poland-trip/.
const PRECACHE_URLS = [
  './',
  './manifest.json',
  './pwa-register.js?v=polska-v15',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './vendor/react.production.min.js',
  './vendor/react-dom.production.min.js',
  './redesign/pwa-core.js?v=polska-v15',
  './redesign/data.js?v=polska-v15',
  './redesign/tokens.css?v=polska-v15',
  './redesign/B-companion.css?v=polska-v15',
  './redesign/dist/B-companion.js?v=polska-v15',
];
const OFFICIAL_APP_URLS = new Set(
  PRECACHE_URLS
    .filter((asset) => asset !== './')
    .map((asset) => new URL(asset, self.location.href).href)
);

// 安裝時預先快取核心資源
// 注意：這裡不呼叫 skipWaiting()——讓使用者看到「新版本可用」提示後再決定何時切換
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// 接收主頁傳來的 SKIP_WAITING 訊息：使用者按了「立即更新」才切換
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 啟用時清除舊版本快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k.startsWith('polska-') && k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

function isOfficialAppAsset(url) {
  return OFFICIAL_APP_URLS.has(url.href);
}

// 取資源策略
//   - HTML（導航）：network-first，離線時一律回根 app shell
//   - 正式根應用資產：cache-first，背景更新
//   - 其他同源資產：只走網路，不讀寫 PWA runtime cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isHTML = request.mode === 'navigate' ||
                 (request.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match('./'))
    );
    return;
  }

  // 同源只允許正式根應用資產進 runtime cache。
  if (url.origin === self.location.origin) {
    if (!isOfficialAppAsset(url)) {
      event.respondWith(fetch(request));
      return;
    }
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          fetch(request).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
            }
          }).catch(() => {});
          return cached;
        }
        return fetch(request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return res;
        });
      })
    );
    return;
  }

  // 第三方（Google Fonts 等）：stale-while-revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});

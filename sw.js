// POLSKA 旅行誌離線快取
//
// 使用情境是在波蘭當地漫遊／沒訊號時仍要查得到行程，所以採取：
//   - 導覽請求（HTML）：network-first，有網路就拿最新，沒網路回退快取
//   - 靜態資源（CSS/JS/圖片/字型）：cache-first，命中就不動用網路
//   - OSM 圖磚：stale-while-revalidate 的執行期快取，看過的區域離線仍在
// 同時沿用舊版行為，清掉已封存的 polska-v* 快取。

const VERSION = 'polska-journal-v2';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const TILES = `${VERSION}-tiles`;
const TILE_LIMIT = 400;

const PAGES = [
  './',
  './index.html',
  './day-01.html', './day-02.html', './day-03.html', './day-04.html',
  './day-05.html', './day-06.html', './day-07.html', './day-08.html',
  './city-warszawa.html', './city-krakow.html', './city-wroclaw.html', './city-poznan.html',
  './practical/todos.html', './practical/booking.html', './practical/dining.html',
  './practical/tickets.html', './practical/transit.html', './practical/shopping.html',
  './practical/essentials.html', './practical/notes.html',
  './practical/ops-dashboard.html', './practical/database.html',
];

const ASSETS = [
  './assets/main.css',
  './assets/nav.js',
  './assets/leaflet/leaflet.css',
  './assets/leaflet/leaflet.js',
  './assets/photos/warszawa-hero.webp',
  './assets/photos/krakow-hero.webp',
  './assets/photos/wroclaw-hero.webp',
  './assets/photos/poznan-hero.webp',
];

const PRECACHE = [...PAGES, ...ASSETS];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // 個別 add：任何一頁失敗都不該讓整個安裝失敗
    await Promise.all(PRECACHE.map(url => cache.add(url).catch(() => null)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      // 清掉已封存的舊版 PWA 快取，以及本 worker 前一版的快取
      .filter(key => key.startsWith('polska-') && !key.startsWith(VERSION))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function trimCache(cacheName, limit) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= limit) return;
  await Promise.all(keys.slice(0, keys.length - limit).map(key => cache.delete(key)));
}

// 圖磚：先回快取再背景更新，離線時看過的區域仍在
async function tileStrategy(request) {
  const cache = await caches.open(TILES);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(response => {
      if (response && response.ok) {
        cache.put(request, response.clone()).then(() => trimCache(TILES, TILE_LIMIT));
      }
      return response;
    })
    .catch(() => null);
  return cached || (await network) || Response.error();
}

// HTML：優先取新版，離線回退快取，最後回退首頁
async function pageStrategy(request) {
  const cache = await caches.open(SHELL);
  try {
    const response = await fetch(request);
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await cache.match(request))
      || (await cache.match('./index.html'))
      || Response.error();
  }
}

// 靜態資源：命中快取就直接用，未命中才連線並存起來
async function assetStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok && request.url.startsWith(self.location.origin)) {
      const cache = await caches.open(RUNTIME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return Response.error();
  }
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  if (/tile\.openstreetmap\.org$/.test(url.hostname)) {
    event.respondWith(tileStrategy(request));
    return;
  }

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(pageStrategy(request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(assetStrategy(request));
  }
});

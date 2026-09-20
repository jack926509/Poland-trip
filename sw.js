// POLSKA 旅行誌離線快取
//
// 使用情境是在波蘭當地漫遊／沒訊號時仍要查得到行程，所以採取：
//   - 導覽請求（HTML）：network-first，有網路就拿最新，沒網路回退快取
//   - 靜態資源（CSS/JS/圖片/字型）：cache-first，命中就不動用網路
//   - OSM 圖磚：stale-while-revalidate 的執行期快取，看過的區域離線仍在
// 同時沿用舊版行為，清掉已封存的 polska-v* 快取。
//
// 2026-09-19 修正（稽核 H2）：Cloudflare Pages 會把 `/page.html` 用 308
// 轉址成乾淨網址 `/page`；fetch 預設跟隨轉址，取回的 Response.redirected
// 會是 true。Chrome 不允許把這種「來自轉址」的 Response 從 Cache 交給
// 導覽（navigate）請求使用，離線時會直接 net::ERR_FAILED——結果是預快取
// 的 24 頁全部不能離線打開，只有旅途中「曾經線上開過」的頁才有離線版。
// GitHub Pages 走同一份 dist/，但兩種網址寫法（有無 .html）都可能被
// 實際請求到。修法：
//   1. 預快取與執行期更新時，一律重建一個乾淨的 Response（拿掉
//      redirected 旗標），不直接快取 fetch 回傳的原始 Response。
//   2. 同一頁同時以「.html」與「乾淨網址」兩種 key 存進快取。
//   3. 離線時的 fallback 除了原始請求網址，也嘗試另一種寫法。

const VERSION = 'polska-journal-v21';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const TILES = `${VERSION}-tiles`;
const TILE_LIMIT = 400;

const PAGES = [
  './index.html',
  './today.html',
  './day-01.html', './day-02.html', './day-03.html', './day-04.html',
  './day-05.html', './day-06.html', './day-07.html', './day-08.html',
  './city-warszawa.html', './city-krakow.html', './city-wroclaw.html', './city-poznan.html',
  './practical/todos.html', './practical/booking.html', './practical/dining.html',
  './practical/tickets.html', './practical/transit.html', './practical/shopping.html',
  './practical/essentials.html', './practical/notes.html',
  './practical/ops-dashboard.html', './practical/database.html',
];

const ASSETS = [
  './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  './assets/main.css',
  './assets/nav.js',
  './assets/site-search.js',
  './assets/database-filter.js',
  // 搜尋索引改成外部檔案（稽核 M6）：預快取起來，離線時搜尋才有資料可查。
  './assets/search-index.json',
  './assets/leaflet/leaflet.css',
  './assets/leaflet/leaflet.js',
  './assets/photos/warszawa-hero.webp',
  './assets/photos/krakow-hero.webp',
  './assets/photos/wroclaw-hero.webp',
  './assets/photos/poznan-hero.webp',
  './assets/photos/wroclaw-ostrow-tumski-night.webp',
  './assets/photos/poznan-old-market.webp',
  './assets/photos/warsaw-royal-castle.webp',
  './assets/photos/krakow-wawel.webp',
  './assets/photos/warsaw-skyline.webp',
  './assets/photos/warsaw-lazienki-palace.webp',
  './assets/photos/krakow-szeroka-street.webp',
  './assets/photos/krakow-zapiekanki.webp',
  './assets/photos/wroclaw-dwarf-explorer.webp',
  './assets/photos/wroclaw-centennial-hall.webp',
  './assets/photos/poznan-cathedral-aerial.webp',
  './assets/photos/poznan-imperial-castle-night.webp',
];

// 拿掉 Response 的「來自轉址」旗標：讀出內容後用同樣的狀態碼／標頭重建一個
// 全新的 Response。只有這種乾淨的 Response 可以被 Cache 交給導覽請求使用。
async function stripRedirectFlag(response) {
  const body = await response.clone().arrayBuffer();
  return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
}

// './index.html' 對應網站根目錄 './'；其餘去掉 .html 副檔名，對應
// Cloudflare Pages 轉址後的乾淨網址。
function cleanPageKey(htmlPath) {
  return htmlPath === './index.html' ? './' : htmlPath.replace(/\.html$/, '');
}

async function precachePage(cache, htmlPath) {
  const response = await fetch(htmlPath, { redirect: 'follow' });
  if (!response || !response.ok) throw new Error(`預快取失敗：${htmlPath}`);
  await cache.put(htmlPath, await stripRedirectFlag(response));
  await cache.put(cleanPageKey(htmlPath), await stripRedirectFlag(response));
}

// 同一頁可能被請求成「.html」或「乾淨網址」兩種寫法（依部署平台而定），
// 離線時另一種寫法也要能命中快取。
function alternatePagePathnames(pathname) {
  if (pathname.endsWith('.html')) {
    const trimmed = pathname.slice(0, -'.html'.length);
    return [trimmed === '' ? '/' : trimmed];
  }
  if (pathname === '' || pathname === '/') return ['/index.html'];
  return [`${pathname}.html`];
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // 必要檔案必須全部成功，才允許新版取代目前可用的離線快取。
    // 靜態資源沒有轉址問題，用 addAll 即可；頁面另外處理轉址問題。
    await cache.addAll(ASSETS);
    await Promise.all(PAGES.map(page => precachePage(cache, page)));
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

// HTML：優先取新版，離線回退快取（原始網址與另一種寫法都試），最後回退首頁
async function pageStrategy(request) {
  const cache = await caches.open(SHELL);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      // 不 await：不讓寫快取拖慢回應，但一律存拿掉轉址旗標後的乾淨版本，
      // 否則之後離線時這筆執行期更新一樣會被 Chrome 拒用於導覽。
      stripRedirectFlag(response).then(plain => cache.put(request, plain));
    }
    return response;
  } catch (error) {
    const url = new URL(request.url);
    const candidates = [request, ...alternatePagePathnames(url.pathname).map(pathname => new URL(pathname, url.origin).toString())];
    for (const candidate of candidates) {
      const match = await cache.match(candidate);
      if (match) return match;
    }
    return (await cache.match('./index.html'))
      || (await cache.match('./'))
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

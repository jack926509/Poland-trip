// 新版目前是純網頁，不註冊 PWA。
// 此 Service Worker 只負責接替舊版 polska-v* worker、清除其快取並自行解除註冊，
// 避免已安裝過舊版的裝置持續顯示被封存的手機／桌機介面。
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('polska-'))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.registration.unregister())
  );
});

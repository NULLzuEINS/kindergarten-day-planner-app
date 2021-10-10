
workbox.core.setCacheNameDetails({prefix: 'dayplanner'});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open('dayplanner').then(function (cache) {
      return cache.addAll(
        [
          '/img/icons/apple-icon-180.png',
          '/img/icons/apple-splash/apple-splash-dark-1242-2208.jpg',
          '/img/icons/apple-splash/apple-splash-dark-640-1136.jpg',
          '/img/icons/apple-splash/apple-splash-dark-750-1334.jpg',
          '/img/icons/apple-splash/apple-splash-dark-828-1792.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1125-2436.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1136-640.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1170-2532.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1242-2688.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1284-2778.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1334-750.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1536-2048.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1620-2160.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1668-2224.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1668-2388.jpg',
          '/img/icons/apple-splash/apple-splash-dark-1792-828.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2048-1536.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2048-2732.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2160-1620.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2208-1242.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2224-1668.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2388-1668.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2436-1125.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2532-1170.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2688-1242.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2732-2048.jpg',
          '/img/icons/apple-splash/apple-splash-dark-2778-1284.jpg',
          '/img/icons/apple-touch/apple-touch-icon-57x57.png',
          '/img/icons/apple-touch/apple-touch-icon-60x60.png',
          '/img/icons/apple-touch/apple-touch-icon-72x72.png',
          '/img/icons/apple-touch/apple-touch-icon-76x76.png',
          '/img/icons/apple-touch/apple-touch-icon-114x114.png',
          '/img/icons/apple-touch/apple-touch-icon-120x120.png',
          '/img/icons/apple-touch/apple-touch-icon-144x144.png',
          '/img/icons/apple-touch/apple-touch-icon-152x152.png',
          '/img/icons/apple-touch/apple-touch-icon-180x180.png',
          '/img/icons/apple-touch/apple-touch-icon.png',
          '/img/icons/favicon/favicon-16x16.png',
          '/img/icons/favicon/favicon-32x32.png',
          '/img/icons/favicon/favicon.png',
          '/img/icons/manifest/manifest-icon-192.png',
          '/img/icons/manifest/manifest-icon-512.png',
          '/img/icons/icon.png',
        ]
      );
    })
  );
});

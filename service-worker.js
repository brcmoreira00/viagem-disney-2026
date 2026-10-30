const CACHE = 'orlando-2026-v24';
const MAP_CACHE = 'orlando-2026-maps-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './data.json',
  './strategy-kb.json',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('orlando-2026-v') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (isMapRequest(event.request)) {
    event.respondWith(cacheMapOnDemand(event.request));
    return;
  }

  event.respondWith(caches.match(event.request).then((response) => response || fetch(event.request)));
});

function isMapRequest(request) {
  const path = new URL(request.url).pathname;
  return decodeURIComponent(path).includes('/Mapas dos Parques/');
}

async function cacheMapOnDemand(request) {
  const cache = await caches.open(MAP_CACHE);
  const fullRequest = new Request(request.url);
  const cached = await cache.match(fullRequest);
  if (cached) return cached;
  try {
    const response = await fetch(fullRequest);
    if (response.status === 200) {
      try {
        await cache.put(fullRequest, response.clone());
      } catch {
        // The PDF can still open if the device cannot save another large file.
      }
    }
    return response;
  } catch {
    return cached || Response.error();
  }
}

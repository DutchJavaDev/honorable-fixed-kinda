const CACHE_NAME = 'holotable-shell-v3';
const APP_SHELL = [
  './',
  './index.html',
  './manager.html',
  './life-counter.html',
  './styles.css?v=3',
  './app.js',
  './database-ui.js',
  './calendar-page.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];
const EXTERNAL_ASSETS = [
  'https://cdn.jsdelivr.net/npm/fullcalendar@7.1.3/skeleton.css',
  'https://cdn.jsdelivr.net/npm/fullcalendar@7.1.3/themes/breezy/theme.css',
  'https://cdn.jsdelivr.net/npm/fullcalendar@7.1.3/themes/breezy/palettes/indigo.css',
  'https://cdn.jsdelivr.net/npm/fullcalendar@7.1.3/all/global.js',
  'https://cdn.jsdelivr.net/npm/fullcalendar@7.1.3/themes/breezy/global.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    await cache.addAll(APP_SHELL);
    await Promise.allSettled(EXTERNAL_ASSETS.map(async url => {
      const response = await fetch(url, { mode: 'no-cors' });
      await cache.put(url, response);
    }));
  }).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok || response.type === 'opaque') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }).catch(() => event.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())
  )
  );
});

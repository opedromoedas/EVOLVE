/* EVOLVE Beta — cache por rota: o Research Lab offline nunca deve virar a Home. */
const CACHE = 'evolve-designlab-v07-onboarding';
const ASSETS = [
  './', './index.html', './styles.css', './design-lab.css', './scifi.css', './scifi.js', './cinematic.css', './cinematic.js', './brand-assets.css', './brand-assets.js', './motion-v04.css', './mountains.svg', './life.css', './life.js', './lugares.html', './owner.html', './owner.js', './scifi-kit.css', './scifi-kit.js', './design-system.html', './app.js', './research.js', './config.js',
  './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png',
  './apple-touch-icon.png', './privacidade.html', './research.html',
  './research-dashboard.js', './research-dashboard.css', './design-lab-research.css'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith('evolve-designlab-') && key !== CACHE).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (request.mode === 'navigate') {
    // Cada página é armazenada com sua URL: /research.html nunca substitui /index.html.
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, copy)));
        }
        return response;
      }).catch(async () => {
        const cache = await caches.open(CACHE);
        const exact = await cache.match(request, {ignoreSearch: true});
        if (exact) return exact;
        const pathname = url.pathname;
        const scopePath = new URL(self.registration.scope).pathname;
        if (pathname === scopePath || pathname === scopePath + 'index.html') {
          return cache.match('./index.html');
        }
        return new Response('Esta página não está disponível offline.', {
          status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
        });
      })
    );
    return;
  }
  // Configuracao de autenticação: nunca usar uma copia antiga como primeira opcao.
  if (url.pathname.endsWith('/config.js') || url.pathname.endsWith('/owner.js')) {
    event.respondWith(fetch(request, {cache: 'no-store'}).then(response => {
      if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, response.clone())));
      return response;
    }).catch(() => caches.match(request, {ignoreSearch: true})));
    return;
  }
  event.respondWith(caches.match(request).then(hit => hit || fetch(request).then(response => {
    if (response.ok) event.waitUntil(caches.open(CACHE).then(cache => cache.put(request, response.clone())));
    return response;
  })));
});

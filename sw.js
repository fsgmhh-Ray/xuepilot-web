const CACHE_NAME = 'xuepilot-v4'; // 升级缓存版本
const urlsToCache = [
  '/',
  '/classroom.html',
  '/index.html',
  '/simulator.html',
  '/dashboard.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // 核心规则：不拦截带有 supabase 或带有时间戳的请求
  if (event.request.url.includes('supabase.co') || event.request.url.includes('?t=')) {
      return; 
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
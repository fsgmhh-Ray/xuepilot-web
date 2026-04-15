const CACHE_NAME = 'xuepilot-v2'; // 🚀 升级版本，强制弃用旧缓存
const urlsToCache = [
  '/',
  '/classroom.html',
  '/index.html',
  '/simulator.html',
  '/dashboard.html',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11',
  'https://cdn.quilljs.com/1.3.6/quill.snow.css',
  'https://cdn.quilljs.com/1.3.6/quill.min.js',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // 强制立即接管
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 🚀 清理旧版本拦截，破除卡死
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
  // 🚀 核心修复：绝对不拦截 Supabase 视频流和带参数的请求
  if (event.request.url.includes('supabase.co') || event.request.url.includes('?t=')) {
      return; 
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
const CACHE_NAME = 'pages-cache-v1';
// List the routes (HTML pages) you want to work offline:
const PRECACHE_URLS = [
  '/',           // root
  '/home',       // /home page
  '/products',   // /products page
  '/profile',      // /about page
  '/test',      // /about page
  '/item',      // /about page
  '/cart',      // /about page
  // add any other pages you want to pre-cache
];



self.addEventListener('install', (event) => {
  console.log('🛠️  SW installing and pre-caching routes.');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});


self.addEventListener('activate', (event) => {
  console.log('⚡ SW activated, cleaning up old caches.');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🗑️  Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // 1) Navigation requests (HTML pages)
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match(req)                              // try the cache first
        .then(cachedRes => cachedRes
          || fetch(req).then(networkRes => {         // fallback to network
            // also put in cache for next time
            caches.open(CACHE_NAME)
              .then(cache => cache.put(req, networkRes.clone()));
            return networkRes;
          })
        ).catch(() => caches.match('/'))             // offline fallback to homepage
    );
    return;
  }

  // 2) Other requests (e.g. JS/CSS/images) – you can choose to cache these too
  event.respondWith(
    caches.match(req)
      .then(cachedRes => cachedRes || fetch(req))
  );
});

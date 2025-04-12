const CACHE_NAME = 'mentor-learning-platform-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/config.html',
  '/app',
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/css/landing-styles.css',
  '/assets/css/auth-styles.css',
  '/assets/css/login-styles.css',
  '/assets/css/sidebar.css',
  '/assets/css/dark-mode.css',
  '/assets/css/config-styles.css',
  '/assets/js/app.js',
  '/assets/js/auth.js',
  '/assets/js/auth-ui.js',
  '/assets/js/cloudflare-auth.js',
  '/assets/js/config.js',
  '/assets/js/landing.js',
  '/assets/js/login.js',
  '/assets/js/pwa.js',
  '/assets/js/register-sw.js',
  '/assets/js/sidebar.js',
  '/assets/js/sw.js',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  '/assets/images/hero-illustration.svg',
  '/assets/images/hero-pattern.svg',
  '/assets/images/app-store-badge.svg',
  '/assets/images/google-play-badge.svg'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

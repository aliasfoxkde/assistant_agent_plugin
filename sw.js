const CACHE_NAME = 'mentor-learning-platform-v2';
const urlsToCache = [
  '/manifest.json',
  '/assets/css/styles.css',
  '/assets/css/landing-styles.css',
  '/assets/css/auth-styles.css',
  '/assets/css/login-styles.css',
  '/assets/css/signup-styles.css',
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
  '/assets/js/signup.js',
  '/assets/js/pwa.js',
  '/assets/js/register-sw.js',
  '/assets/js/sidebar.js',
  '/assets/icons/icon-72x72.png',
  '/assets/icons/icon-96x96.png',
  '/assets/icons/icon-128x128.png',
  '/assets/icons/icon-144x144.png',
  '/assets/icons/icon-152x152.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-384x384.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/icon.svg',
  '/assets/images/hero-illustration.svg',
  '/assets/images/hero-pattern.svg',
  '/assets/images/app-store-badge.svg',
  '/assets/images/google-play-badge.svg'
];

// URLs that use redirects - we'll handle these separately
const navigationUrls = [
  '/',
  '/index.html',
  '/login.html',
  '/signup.html',
  '/config.html',
  '/app.html'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');

        // Cache static assets first - these shouldn't have redirects
        const cachePromises = urlsToCache.map(url => {
          return cache.add(url).catch(error => {
            console.error(`Failed to cache: ${url}`, error);
          });
        });

        return Promise.all(cachePromises);
      })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const requestPath = url.pathname;

  // Check if this is a navigation request (HTML page)
  const isNavigationRequest = event.request.mode === 'navigate';

  // Handle navigation requests differently due to redirects
  if (isNavigationRequest || navigationUrls.includes(requestPath)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // If fetch fails (offline), try to return cached version
          return caches.match(event.request);
        })
    );
    return;
  }

  // For non-navigation requests, use standard cache strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request - fetch() uses up the request body
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest, { credentials: 'same-origin' })
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response - the response body can only be used once
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  // Clean up old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Ensure the service worker takes control of all clients ASAP
      console.log('Service Worker activated and controlling all pages');
      return self.clients.claim();
    })
  );
});

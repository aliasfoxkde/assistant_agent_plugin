// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // First check if the service worker can be reached
      const swResponse = await fetch('/sw.js');
      if (!swResponse.ok) {
        throw new Error(`Service worker fetch failed: ${swResponse.status}`);
      }

      // Check the content type
      const contentType = swResponse.headers.get('content-type');
      if (contentType && !contentType.includes('javascript')) {
        console.warn(`Service worker has incorrect MIME type: ${contentType}. Skipping registration.`);
        return;
      }

      // Check if there's an existing service worker
      const registrations = await navigator.serviceWorker.getRegistrations();

      // Unregister any existing service workers to ensure clean installation
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Unregistered old service worker');
      }

      // Register the new service worker with absolute URL to avoid path issues
      const fullUrl = new URL('/sw.js', window.location.origin).href;
      console.log('Registering service worker from:', fullUrl);

      const registration = await navigator.serviceWorker.register(fullUrl, {
        updateViaCache: 'none', // Don't use cached versions of the service worker
        scope: '/' // Explicitly set scope to root
      });

      console.log('ServiceWorker registration successful with scope:', registration.scope);

      // Check for updates immediately
      registration.update();

      // Set up periodic updates
      setInterval(() => {
        registration.update();
        console.log('Checking for service worker updates...');
      }, 60 * 60 * 1000); // Check every hour

    } catch (error) {
      console.error('ServiceWorker registration failed:', error);
      // Continue without service worker - don't break the app
    }
  });
}

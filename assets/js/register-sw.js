// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Check if there's an existing service worker
      const registrations = await navigator.serviceWorker.getRegistrations();

      // Unregister any existing service workers to ensure clean installation
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Unregistered old service worker');
      }

      // Register the new service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none' // Don't use cached versions of the service worker
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
    }
  });
}

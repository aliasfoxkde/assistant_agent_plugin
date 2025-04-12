// PWA Install Prompt
let deferredPrompt;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const pwaInstallPrompt = document.getElementById('pwa-install-prompt');
  const pwaInstallButton = document.getElementById('pwa-install-button');
  const pwaDismissButton = document.getElementById('pwa-dismiss-button');
  const pwaInstallSidebar = document.getElementById('pwa-install-sidebar');

  // Check if at least one install button exists
  if ((!pwaInstallButton && !pwaInstallSidebar) || !pwaInstallPrompt) {
    console.log('PWA install elements not found in the DOM');
    return;
  }

  // Check if the PWA has already been installed
  if ('localStorage' in window) {
    const pwaInstalled = localStorage.getItem('pwaInstalled');
    if (pwaInstalled) {
      // PWA already installed, don't show the prompt
      pwaInstallPrompt.style.display = 'none';
    }
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install prompt
    pwaInstallPrompt.style.display = 'block';
  });

  // Function to handle install
  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
    // Hide the install prompt
    if (pwaInstallPrompt) {
      pwaInstallPrompt.style.display = 'none';
    }
    // Log the outcome
    console.log(`User ${outcome} the A2HS prompt`);
    // Save to localStorage that the PWA was installed
    if (outcome === 'accepted') {
      localStorage.setItem('pwaInstalled', 'true');
      // Hide the sidebar install button if it exists
      if (pwaInstallSidebar) {
        pwaInstallSidebar.parentElement.style.display = 'none';
      }
    }
  }

  // Install button click handler (popup)
  if (pwaInstallButton) {
    pwaInstallButton.addEventListener('click', handleInstall);
  }

  // Sidebar install button click handler
  if (pwaInstallSidebar) {
    pwaInstallSidebar.addEventListener('click', (e) => {
      e.preventDefault();
      handleInstall();
    });
  }

// Dismiss button click handler
if (pwaDismissButton) {
  pwaDismissButton.addEventListener('click', () => {
    // Hide the install prompt
    pwaInstallPrompt.style.display = 'none';
    // Save to localStorage that the user dismissed the prompt
    localStorage.setItem('pwaDismissed', 'true');
  });
}

  // Listen for the appinstalled event
  window.addEventListener('appinstalled', (e) => {
    // Log the installation
    console.log('PWA was installed');
    // Save to localStorage that the PWA was installed
    localStorage.setItem('pwaInstalled', 'true');
    // Hide the install prompt
    if (pwaInstallPrompt) {
      pwaInstallPrompt.style.display = 'none';
    }
    // Hide the sidebar install button if it exists
    if (pwaInstallSidebar) {
      pwaInstallSidebar.parentElement.style.display = 'none';
    }
  });
});

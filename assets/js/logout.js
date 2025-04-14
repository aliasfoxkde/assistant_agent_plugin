// Logout Module for MENTOR Learning Platform
import { logDebug, logInfo } from './debug-utils.js';
import { showNotification } from './settings.js';
import { playNotificationSound } from './sound-effects.js';

/**
 * Show logout confirmation dialog
 */
function showLogoutConfirmation() {
  logInfo('Showing logout confirmation', 'Logout');
  
  // Check if confirmation already exists
  if (document.getElementById('logout-confirmation')) {
    document.getElementById('logout-confirmation').classList.add('visible');
    return;
  }
  
  // Create confirmation container
  const confirmation = document.createElement('div');
  confirmation.id = 'logout-confirmation';
  confirmation.className = 'logout-confirmation';
  
  // Create confirmation content
  confirmation.innerHTML = `
    <div class="logout-confirmation-content">
      <div class="logout-confirmation-icon">
        <i class="fas fa-sign-out-alt"></i>
      </div>
      <h2 class="logout-confirmation-title">Logout Confirmation</h2>
      <p class="logout-confirmation-message">Are you sure you want to logout from MENTOR?</p>
      <div class="logout-confirmation-buttons">
        <button id="logout-cancel" class="logout-confirmation-cancel">Cancel</button>
        <button id="logout-confirm" class="logout-confirmation-confirm">Logout</button>
      </div>
      <div class="logout-confirmation-links">
        <a href="index.html" class="logout-confirmation-link">Go to Home</a>
        <a href="login.html" class="logout-confirmation-link">Go to Login</a>
        <a href="#" id="logout-close-window" class="logout-confirmation-link">Close Window</a>
      </div>
    </div>
  `;
  
  // Add to document
  document.body.appendChild(confirmation);
  
  // Show confirmation
  setTimeout(() => {
    confirmation.classList.add('visible');
  }, 10);
  
  // Play notification sound
  playNotificationSound('info');
  
  // Add event listeners
  document.getElementById('logout-cancel').addEventListener('click', hideLogoutConfirmation);
  document.getElementById('logout-confirm').addEventListener('click', performLogout);
  document.getElementById('logout-close-window').addEventListener('click', (e) => {
    e.preventDefault();
    window.close();
  });
  
  // Prevent clicks inside the confirmation from closing it
  confirmation.querySelector('.logout-confirmation-content').addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Close confirmation when clicking outside
  confirmation.addEventListener('click', (e) => {
    if (e.target === confirmation) {
      hideLogoutConfirmation();
    }
  });
}

/**
 * Hide logout confirmation dialog
 */
function hideLogoutConfirmation() {
  const confirmation = document.getElementById('logout-confirmation');
  if (confirmation) {
    confirmation.classList.remove('visible');
    
    // Remove after animation
    setTimeout(() => {
      if (confirmation.parentNode) {
        confirmation.parentNode.removeChild(confirmation);
      }
    }, 300);
  }
}

/**
 * Perform logout
 */
async function performLogout() {
  logInfo('Performing logout', 'Logout');
  
  try {
    // Import auth module
    const authModule = await import('./auth.js');
    
    // Perform logout
    const result = await authModule.logout();
    
    if (result.success) {
      // Show success notification
      showNotification('Logged out successfully', 'success');
      
      // Play notification sound
      playNotificationSound('success');
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    } else {
      // Show error notification
      showNotification('Logout failed: ' + result.error, 'error');
      
      // Play notification sound
      playNotificationSound('error');
      
      // Hide confirmation
      hideLogoutConfirmation();
    }
  } catch (error) {
    logDebug(`Logout error: ${error.message}`, 'Logout');
    
    // Show error notification
    showNotification('Logout failed: ' + error.message, 'error');
    
    // Play notification sound
    playNotificationSound('error');
    
    // Hide confirmation
    hideLogoutConfirmation();
  }
}

// Export functions
export { showLogoutConfirmation, hideLogoutConfirmation, performLogout };

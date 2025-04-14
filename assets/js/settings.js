// Settings Module for MENTOR Learning Platform
import { logDebug, logInfo } from './debug-utils.js';

// Default settings
const defaultSettings = {
  theme: 'light', // 'light' or 'dark'
  voice: {
    enabled: true,
    language: 'en-US',
    gender: 'female',
    speed: 1.0,
    pitch: 1.0
  },
  notifications: {
    sound: true,
    desktop: false
  },
  interface: {
    fontSize: 'medium',
    animations: true,
    sidebarCollapsed: true
  }
};

// Current settings
let currentSettings = { ...defaultSettings };

/**
 * Initialize settings
 */
function initSettings() {
  logInfo('Initializing settings', 'Settings');

  // Check for theme preference in localStorage first (for backward compatibility)
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    currentSettings.theme = savedTheme;
    logDebug(`Theme preference found in localStorage: ${savedTheme}`, 'Settings');
  }

  // Load full settings from localStorage
  const savedSettings = localStorage.getItem('mentor_settings');
  if (savedSettings) {
    try {
      const parsedSettings = JSON.parse(savedSettings);
      currentSettings = { ...defaultSettings, ...parsedSettings };
      logDebug('Settings loaded from localStorage', 'Settings');
    } catch (error) {
      logDebug('Error parsing settings, using defaults', 'Settings');
      currentSettings = { ...defaultSettings };

      // Still apply theme if we have it
      if (savedTheme) {
        currentSettings.theme = savedTheme;
      }
    }
  } else {
    logDebug('No saved settings found, using defaults', 'Settings');

    // Still apply theme if we have it
    if (savedTheme) {
      currentSettings.theme = savedTheme;
    }
  }

  // Apply settings
  applySettings();

  // Log current theme for debugging
  logDebug(`Current theme after initialization: ${currentSettings.theme}`, 'Settings');
}

/**
 * Apply current settings to the UI
 */
function applySettings() {
  logDebug('Applying settings', 'Settings');
  logDebug(`Current theme: ${currentSettings.theme}`, 'Settings');

  // Apply theme
  if (currentSettings.theme === 'dark') {
    // Add dark mode class to body
    document.body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-theme', 'dark');

    // Force update CSS variables
    document.documentElement.style.setProperty('--bg-color', '#0f172a');
    document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)');
    document.documentElement.style.setProperty('--text-color', '#e2e8f0');
    document.documentElement.style.setProperty('--heading-color', '#f8fafc');
    document.documentElement.style.setProperty('--card-bg', '#1e293b');
    document.documentElement.style.setProperty('--card-shadow', '0 4px 12px rgba(0, 0, 0, 0.3)');
    document.documentElement.style.setProperty('--border-color', '#334155');
    document.documentElement.style.setProperty('--input-bg', '#334155');
    document.documentElement.style.setProperty('--input-border', '#475569');

    // Store theme in localStorage for persistence
    localStorage.setItem('theme', 'dark');

    logDebug('Dark mode applied', 'Settings');
  } else {
    // Remove dark mode class from body
    document.body.classList.remove('dark-mode');
    document.documentElement.setAttribute('data-theme', 'light');

    // Reset CSS variables to light mode
    document.documentElement.style.setProperty('--bg-color', '#f8fafc');
    document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f8fafc 0%, #e9f2ff 100%)');
    document.documentElement.style.setProperty('--text-color', '#334155');
    document.documentElement.style.setProperty('--heading-color', '#1e293b');
    document.documentElement.style.setProperty('--card-bg', '#ffffff');
    document.documentElement.style.setProperty('--card-shadow', '0 4px 12px rgba(0, 0, 0, 0.1)');
    document.documentElement.style.setProperty('--border-color', '#e2e8f0');
    document.documentElement.style.setProperty('--input-bg', '#ffffff');
    document.documentElement.style.setProperty('--input-border', '#cbd5e1');

    // Store theme in localStorage for persistence
    localStorage.setItem('theme', 'light');

    logDebug('Light mode applied', 'Settings');
  }

  // Apply sidebar state
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    if (currentSettings.interface.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
    } else {
      sidebar.classList.remove('collapsed');
    }
  }

  // Apply font size
  document.documentElement.setAttribute('data-font-size', currentSettings.interface.fontSize);

  // Apply animations
  if (!currentSettings.interface.animations) {
    document.documentElement.setAttribute('data-reduce-motion', 'true');
  } else {
    document.documentElement.removeAttribute('data-reduce-motion');
  }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
  logDebug('Saving settings', 'Settings');
  localStorage.setItem('mentor_settings', JSON.stringify(currentSettings));
}

/**
 * Update a setting
 * @param {string} key - Setting key (dot notation supported, e.g., 'voice.speed')
 * @param {any} value - Setting value
 */
function updateSetting(key, value) {
  logDebug(`Updating setting: ${key} = ${value}`, 'Settings');

  // Handle dot notation (e.g., 'voice.speed')
  if (key.includes('.')) {
    const parts = key.split('.');
    const mainKey = parts[0];
    const subKey = parts[1];

    if (currentSettings[mainKey] && subKey in currentSettings[mainKey]) {
      currentSettings[mainKey][subKey] = value;
    }
  } else if (key in currentSettings) {
    currentSettings[key] = value;
  }

  // Save and apply settings
  saveSettings();
  applySettings();

  // Dispatch event
  window.dispatchEvent(new CustomEvent('settings-changed', { detail: { key, value } }));
}

/**
 * Get current settings
 * @returns {Object} Current settings
 */
function getSettings() {
  return { ...currentSettings };
}

/**
 * Reset settings to defaults
 */
function resetSettings() {
  logInfo('Resetting settings to defaults', 'Settings');
  currentSettings = { ...defaultSettings };
  saveSettings();
  applySettings();

  // Dispatch event
  window.dispatchEvent(new CustomEvent('settings-reset'));

  // Show notification
  showNotification('Settings reset to defaults', 'success');

  // Hide settings popup if it's open
  hideSettingsPopup();
}

/**
 * Create and show settings popup
 */
function showSettingsPopup() {
  logInfo('Showing settings popup', 'Settings');

  // Check if popup already exists
  if (document.getElementById('settings-popup')) {
    document.getElementById('settings-popup').classList.add('visible');
    return;
  }

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'settings-popup';
  popup.className = 'settings-popup';

  // Create popup content
  popup.innerHTML = `
    <div class="settings-popup-content">
      <div class="settings-popup-header">
        <h2>Settings</h2>
        <button id="settings-popup-close" class="settings-popup-close">&times;</button>
      </div>
      <div class="settings-popup-body">
        <div class="settings-section">
          <h3>Appearance</h3>
          <div class="settings-option">
            <label for="theme-setting">Theme</label>
            <div class="settings-control">
              <select id="theme-setting">
                <option value="light" ${currentSettings.theme === 'light' ? 'selected' : ''}>Light</option>
                <option value="dark" ${currentSettings.theme === 'dark' ? 'selected' : ''}>Dark</option>
              </select>
            </div>
          </div>
          <div class="settings-option">
            <label for="font-size-setting">Font Size</label>
            <div class="settings-control">
              <select id="font-size-setting">
                <option value="small" ${currentSettings.interface.fontSize === 'small' ? 'selected' : ''}>Small</option>
                <option value="medium" ${currentSettings.interface.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="large" ${currentSettings.interface.fontSize === 'large' ? 'selected' : ''}>Large</option>
              </select>
            </div>
          </div>
          <div class="settings-option">
            <label for="animations-setting">Animations</label>
            <div class="settings-control">
              <label class="toggle-switch">
                <input type="checkbox" id="animations-setting" ${currentSettings.interface.animations ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="settings-option">
            <label for="sidebar-collapsed-setting">Collapse Sidebar</label>
            <div class="settings-control">
              <label class="toggle-switch">
                <input type="checkbox" id="sidebar-collapsed-setting" ${currentSettings.interface.sidebarCollapsed ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Voice Assistant</h3>
          <div class="settings-option">
            <label for="voice-enabled-setting">Voice Enabled</label>
            <div class="settings-control">
              <label class="toggle-switch">
                <input type="checkbox" id="voice-enabled-setting" ${currentSettings.voice.enabled ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="settings-option">
            <label for="voice-language-setting">Language</label>
            <div class="settings-control">
              <select id="voice-language-setting">
                <option value="en-US" ${currentSettings.voice.language === 'en-US' ? 'selected' : ''}>English (US)</option>
                <option value="en-GB" ${currentSettings.voice.language === 'en-GB' ? 'selected' : ''}>English (UK)</option>
                <option value="es-ES" ${currentSettings.voice.language === 'es-ES' ? 'selected' : ''}>Spanish</option>
                <option value="fr-FR" ${currentSettings.voice.language === 'fr-FR' ? 'selected' : ''}>French</option>
                <option value="de-DE" ${currentSettings.voice.language === 'de-DE' ? 'selected' : ''}>German</option>
              </select>
            </div>
          </div>
          <div class="settings-option">
            <label for="voice-gender-setting">Voice Gender</label>
            <div class="settings-control">
              <select id="voice-gender-setting">
                <option value="female" ${currentSettings.voice.gender === 'female' ? 'selected' : ''}>Female</option>
                <option value="male" ${currentSettings.voice.gender === 'male' ? 'selected' : ''}>Male</option>
              </select>
            </div>
          </div>
          <div class="settings-option">
            <label for="voice-speed-setting">Speech Rate</label>
            <div class="settings-control range-control">
              <input type="range" id="voice-speed-setting" min="0.5" max="2" step="0.1" value="${currentSettings.voice.speed}">
              <span class="range-value">${currentSettings.voice.speed}x</span>
            </div>
          </div>
          <div class="settings-option">
            <label for="voice-pitch-setting">Voice Pitch</label>
            <div class="settings-control range-control">
              <input type="range" id="voice-pitch-setting" min="0.5" max="2" step="0.1" value="${currentSettings.voice.pitch}">
              <span class="range-value">${currentSettings.voice.pitch}</span>
            </div>
          </div>
        </div>

        <div class="settings-section">
          <h3>Notifications</h3>
          <div class="settings-option">
            <label for="notification-sound-setting">Sound Effects</label>
            <div class="settings-control">
              <label class="toggle-switch">
                <input type="checkbox" id="notification-sound-setting" ${currentSettings.notifications.sound ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
          <div class="settings-option">
            <label for="notification-desktop-setting">Desktop Notifications</label>
            <div class="settings-control">
              <label class="toggle-switch">
                <input type="checkbox" id="notification-desktop-setting" ${currentSettings.notifications.desktop ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="settings-popup-footer">
        <button id="settings-reset" class="settings-reset">Reset to Defaults</button>
        <button id="settings-save" class="settings-save">Save Changes</button>
      </div>
    </div>
  `;

  // Add to document
  document.body.appendChild(popup);

  // Show popup
  setTimeout(() => {
    popup.classList.add('visible');
  }, 10);

  // Add event listeners
  document.getElementById('settings-popup-close').addEventListener('click', hideSettingsPopup);
  document.getElementById('settings-reset').addEventListener('click', resetSettings);
  document.getElementById('settings-save').addEventListener('click', saveSettingsFromPopup);

  // Add event listeners for range inputs
  document.querySelectorAll('input[type="range"]').forEach(input => {
    const valueDisplay = input.parentElement.querySelector('.range-value');
    input.addEventListener('input', () => {
      let value = input.value;
      if (input.id === 'voice-speed-setting') {
        valueDisplay.textContent = `${value}x`;
      } else {
        valueDisplay.textContent = value;
      }
    });
  });

  // Prevent clicks inside the popup from closing it
  popup.querySelector('.settings-popup-content').addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close popup when clicking outside
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      hideSettingsPopup();
    }
  });
}

/**
 * Hide settings popup
 */
function hideSettingsPopup() {
  const popup = document.getElementById('settings-popup');
  if (popup) {
    popup.classList.remove('visible');

    // Remove after animation
    setTimeout(() => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 300);
  }
}

/**
 * Save settings from popup form
 */
function saveSettingsFromPopup() {
  logInfo('Saving settings from popup', 'Settings');

  // Theme
  const themeSetting = document.getElementById('theme-setting');
  if (themeSetting) {
    currentSettings.theme = themeSetting.value;
    logDebug(`Theme setting changed to: ${currentSettings.theme}`, 'Settings');
  } else {
    logDebug('Theme setting element not found', 'Settings');
  }

  // Interface
  currentSettings.interface.fontSize = document.getElementById('font-size-setting').value;
  currentSettings.interface.animations = document.getElementById('animations-setting').checked;
  currentSettings.interface.sidebarCollapsed = document.getElementById('sidebar-collapsed-setting').checked;

  // Voice
  currentSettings.voice.enabled = document.getElementById('voice-enabled-setting').checked;
  currentSettings.voice.language = document.getElementById('voice-language-setting').value;
  currentSettings.voice.gender = document.getElementById('voice-gender-setting').value;
  currentSettings.voice.speed = parseFloat(document.getElementById('voice-speed-setting').value);
  currentSettings.voice.pitch = parseFloat(document.getElementById('voice-pitch-setting').value);

  // Notifications
  currentSettings.notifications.sound = document.getElementById('notification-sound-setting').checked;
  currentSettings.notifications.desktop = document.getElementById('notification-desktop-setting').checked;

  // Save and apply settings
  saveSettings();
  applySettings();

  // Hide popup
  hideSettingsPopup();

  // Show success message
  showNotification('Settings saved successfully', 'success');
}

/**
 * Show a notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <div class="notification-icon">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      </div>
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close">&times;</button>
  `;

  // Add to document
  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => {
    notification.classList.add('visible');
  }, 10);

  // Add event listener for close button
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('visible');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });

  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('visible');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Export functions
export {
  initSettings,
  getSettings,
  updateSetting,
  resetSettings,
  showSettingsPopup,
  hideSettingsPopup,
  showNotification
};

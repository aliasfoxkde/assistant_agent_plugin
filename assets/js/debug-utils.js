// Debug Utilities for MENTOR Learning Platform
// This file provides utilities for debugging and testing the platform

// Enable verbose logging
const DEBUG_MODE = true;

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Current log level
let currentLogLevel = LOG_LEVELS.DEBUG;

/**
 * Set the current log level
 * @param {number} level - The log level to set
 */
function setLogLevel(level) {
  if (Object.values(LOG_LEVELS).includes(level)) {
    currentLogLevel = level;
    logDebug(`Log level set to ${Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key] === level)}`);
  } else {
    console.error(`Invalid log level: ${level}`);
  }
}

/**
 * Log a debug message
 * @param {string} message - The message to log
 * @param {string} module - The module name (optional)
 */
function logDebug(message, module = 'Debug') {
  if (DEBUG_MODE && currentLogLevel <= LOG_LEVELS.DEBUG) {
    console.log(`[${module}] ${message}`);
    appendToDebugPanel(message, module, 'debug');
  }
}

/**
 * Log an info message
 * @param {string} message - The message to log
 * @param {string} module - The module name (optional)
 */
function logInfo(message, module = 'Info') {
  if (DEBUG_MODE && currentLogLevel <= LOG_LEVELS.INFO) {
    console.info(`[${module}] ${message}`);
    appendToDebugPanel(message, module, 'info');
  }
}

/**
 * Log a warning message
 * @param {string} message - The message to log
 * @param {string} module - The module name (optional)
 */
function logWarn(message, module = 'Warning') {
  if (DEBUG_MODE && currentLogLevel <= LOG_LEVELS.WARN) {
    console.warn(`[${module}] ${message}`);
    appendToDebugPanel(message, module, 'warn');
  }
}

/**
 * Log an error message
 * @param {string} message - The message to log
 * @param {string} module - The module name (optional)
 */
function logError(message, module = 'Error') {
  if (DEBUG_MODE && currentLogLevel <= LOG_LEVELS.ERROR) {
    console.error(`[${module}] ${message}`);
    appendToDebugPanel(message, module, 'error');
  }
}

/**
 * Append a message to the debug panel if it exists
 * @param {string} message - The message to append
 * @param {string} module - The module name
 * @param {string} level - The log level
 */
function appendToDebugPanel(message, module, level) {
  const debugPanel = document.getElementById('debug-panel');
  if (debugPanel) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry log-${level}`;
    logEntry.innerHTML = `<span class="log-timestamp">${timestamp}</span> <span class="log-module">[${module}]</span> <span class="log-message">${message}</span>`;
    debugPanel.appendChild(logEntry);
    debugPanel.scrollTop = debugPanel.scrollHeight;
  }
}

/**
 * Create and inject a debug panel into the page
 */
function createDebugPanel() {
  if (document.getElementById('debug-panel')) {
    return; // Panel already exists
  }

  const debugPanelContainer = document.createElement('div');
  debugPanelContainer.id = 'debug-panel-container';
  debugPanelContainer.classList.add('debug-panel-collapsed'); // Start collapsed by default
  debugPanelContainer.innerHTML = `
    <div id="debug-panel-header">
      <span>Debug Panel</span>
      <div id="debug-panel-controls">
        <button id="debug-panel-clear">Clear</button>
        <button id="debug-panel-test" title="Run Tests"><i class="fas fa-vial"></i></button>
        <button id="debug-panel-toggle">□</button>
      </div>
    </div>
    <div id="debug-panel"></div>
  `;

  document.body.appendChild(debugPanelContainer);

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #debug-panel-container {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 400px;
      height: 300px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      font-family: monospace;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      border-top-right-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    }
    #debug-panel-header {
      padding: 5px 10px;
      background-color: #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top-right-radius: 5px;
    }
    #debug-panel-controls button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      margin-left: 5px;
    }
    #debug-panel {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      font-size: 12px;
    }
    .log-entry {
      margin-bottom: 3px;
      line-height: 1.3;
    }
    .log-timestamp {
      color: #aaa;
    }
    .log-module {
      color: #66c;
      font-weight: bold;
    }
    .log-debug .log-message {
      color: #ccc;
    }
    .log-info .log-message {
      color: #6c6;
    }
    .log-warn .log-message {
      color: #cc6;
    }
    .log-error .log-message {
      color: #c66;
    }
    .debug-panel-collapsed {
      height: 30px !important;
    }
    .debug-panel-collapsed #debug-panel {
      display: none;
    }
  `;
  document.head.appendChild(style);

  // Add event listeners
  document.getElementById('debug-panel-clear').addEventListener('click', () => {
    document.getElementById('debug-panel').innerHTML = '';
  });

  document.getElementById('debug-panel-test').addEventListener('click', async () => {
    logInfo('Running tests...', 'Test');
    try {
      // Import test module
      const testModule = await import('./test-utils.js');
      const results = await testModule.runAllTests();
      testModule.createTestReport(results);
    } catch (error) {
      logError('Failed to run tests: ' + error.message, 'Test');
    }
  });

  // Toggle debug panel on header click
  document.getElementById('debug-panel-header').addEventListener('click', (e) => {
    // Don't toggle if clicking on buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }

    const container = document.getElementById('debug-panel-container');
    const toggleButton = document.getElementById('debug-panel-toggle');

    if (container.classList.contains('debug-panel-collapsed')) {
      container.classList.remove('debug-panel-collapsed');
      toggleButton.textContent = '_';
    } else {
      container.classList.add('debug-panel-collapsed');
      toggleButton.textContent = '□';
    }
  });

  // Also keep the toggle button functionality
  document.getElementById('debug-panel-toggle').addEventListener('click', (e) => {
    const container = document.getElementById('debug-panel-container');
    const button = e.target.closest('button') || e.target;

    if (container.classList.contains('debug-panel-collapsed')) {
      container.classList.remove('debug-panel-collapsed');
      button.textContent = '_';
    } else {
      container.classList.add('debug-panel-collapsed');
      button.textContent = '□';
    }
  });

  logInfo('Debug panel initialized', 'System');
}

/**
 * Test the authentication flow
 */
async function testAuthentication() {
  logInfo('Testing authentication flow', 'Auth');

  try {
    // Import auth module
    const authModule = await import('./auth.js');
    logDebug('Auth module imported successfully', 'Auth');

    // Test getSupabaseClient
    try {
      const client = await authModule.getSupabaseClient();
      logDebug('Supabase client initialized: ' + (client ? 'Success' : 'Failed'), 'Auth');
    } catch (error) {
      logError('Failed to initialize Supabase client: ' + error.message, 'Auth');
    }

    // Test getSession
    try {
      const { success, user } = await authModule.getSession();
      logDebug('Session check: ' + (success ? 'Active' : 'Inactive'), 'Auth');
      if (user) {
        logDebug('User: ' + user.email, 'Auth');
      }
    } catch (error) {
      logError('Failed to check session: ' + error.message, 'Auth');
    }
  } catch (error) {
    logError('Failed to import auth module: ' + error.message, 'Auth');
  }
}

/**
 * Test the navigation flow
 */
function testNavigation() {
  logInfo('Testing navigation flow', 'Nav');

  // Get current page
  const currentPath = window.location.pathname;
  logDebug('Current path: ' + currentPath, 'Nav');

  // Check for redirect loops
  const referrer = document.referrer;
  logDebug('Referrer: ' + (referrer || 'None'), 'Nav');

  if (referrer) {
    const referrerUrl = new URL(referrer);
    if (referrerUrl.pathname === currentPath) {
      logWarn('Potential redirect loop detected between current page and referrer', 'Nav');
    }
  }

  // Check for correct redirects
  if (currentPath === '/login' || currentPath === '/login.html') {
    logDebug('On login page, checking for redirect parameters', 'Nav');
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('redirect')) {
      logDebug('Redirect parameter found: ' + urlParams.get('redirect'), 'Nav');
    }
  }
}

/**
 * Initialize debugging tools
 */
function initDebugTools() {
  if (DEBUG_MODE) {
    // Create debug panel
    createDebugPanel();

    // Log system info
    logInfo('Debug tools initialized', 'System');
    logInfo('User Agent: ' + navigator.userAgent, 'System');
    logInfo('Page URL: ' + window.location.href, 'System');

    // Test authentication and navigation
    testAuthentication();
    testNavigation();
  }
}

// Export functions
export {
  DEBUG_MODE,
  LOG_LEVELS,
  setLogLevel,
  logDebug,
  logInfo,
  logWarn,
  logError,
  createDebugPanel,
  testAuthentication,
  testNavigation,
  initDebugTools
};

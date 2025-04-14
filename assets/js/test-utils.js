// Test Utilities for MENTOR Learning Platform
// This file provides utilities for testing the platform

import { logDebug, logError, logInfo, logWarn } from './debug-utils.js';

/**
 * Test the authentication flow
 * @returns {Promise<Object>} Test results
 */
async function testAuthFlow() {
  logInfo('Running authentication flow test', 'Test');

  const results = {
    success: true,
    tests: [],
    errors: []
  };

  try {
    // Import auth module
    const authModule = await import('./auth.js');

    // Test 1: Initialize Supabase
    try {
      await authModule.initSupabase();
      results.tests.push({ name: 'Initialize Supabase', success: true });
    } catch (error) {
      results.success = false;
      results.tests.push({ name: 'Initialize Supabase', success: false, error: error.message });
      results.errors.push(`Initialize Supabase failed: ${error.message}`);
      logError(`Initialize Supabase failed: ${error.message}`, 'Test');
    }

    // Test 2: Get Supabase Client
    try {
      const client = await authModule.getSupabaseClient();
      const success = client !== null;
      results.tests.push({ name: 'Get Supabase Client', success });
      if (!success) {
        results.success = false;
        results.errors.push('Get Supabase Client failed: Client is null');
        logError('Get Supabase Client failed: Client is null', 'Test');
      }
    } catch (error) {
      results.success = false;
      results.tests.push({ name: 'Get Supabase Client', success: false, error: error.message });
      results.errors.push(`Get Supabase Client failed: ${error.message}`);
      logError(`Get Supabase Client failed: ${error.message}`, 'Test');
    }

    // Test 3: Check Session
    try {
      const { success, user } = await authModule.getSession();
      results.tests.push({
        name: 'Check Session',
        success: true,
        details: {
          sessionActive: success,
          user: user ? { email: user.email, id: user.id } : null
        }
      });
    } catch (error) {
      results.success = false;
      results.tests.push({ name: 'Check Session', success: false, error: error.message });
      results.errors.push(`Check Session failed: ${error.message}`);
      logError(`Check Session failed: ${error.message}`, 'Test');
    }
  } catch (error) {
    results.success = false;
    results.errors.push(`Auth module import failed: ${error.message}`);
    logError(`Auth module import failed: ${error.message}`, 'Test');
  }

  return results;
}

/**
 * Test the navigation flow
 * @returns {Object} Test results
 */
function testNavigationFlow() {
  logInfo('Running navigation flow test', 'Test');

  const results = {
    success: true,
    tests: [],
    errors: []
  };

  try {
    // Test 1: Check current page
    const currentPath = window.location.pathname;
    results.tests.push({
      name: 'Current Path',
      success: true,
      details: { path: currentPath }
    });

    // Test 2: Check for redirect loops
    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        const isRedirectLoop = referrerUrl.pathname === currentPath;
        results.tests.push({
          name: 'Redirect Loop Check',
          success: !isRedirectLoop,
          details: {
            referrer: referrerUrl.pathname,
            currentPath,
            isRedirectLoop
          }
        });

        if (isRedirectLoop) {
          results.success = false;
          results.errors.push(`Redirect loop detected: ${referrerUrl.pathname} -> ${currentPath}`);
          logWarn(`Redirect loop detected: ${referrerUrl.pathname} -> ${currentPath}`, 'Test');
        }
      } catch (error) {
        results.tests.push({
          name: 'Redirect Loop Check',
          success: false,
          error: error.message,
          details: { referrer }
        });
      }
    } else {
      results.tests.push({
        name: 'Redirect Loop Check',
        success: true,
        details: { referrer: 'None' }
      });
    }

    // Test 3: Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const hasRedirectParam = urlParams.has('redirect');
    results.tests.push({
      name: 'URL Parameters',
      success: true,
      details: {
        hasRedirectParam,
        redirectValue: hasRedirectParam ? urlParams.get('redirect') : null,
        allParams: Object.fromEntries(urlParams.entries())
      }
    });
  } catch (error) {
    results.success = false;
    results.errors.push(`Navigation test failed: ${error.message}`);
    logError(`Navigation test failed: ${error.message}`, 'Test');
  }

  return results;
}

/**
 * Test the page rendering
 * @returns {Object} Test results
 */
function testPageRendering() {
  logInfo('Running page rendering test', 'Test');

  const results = {
    success: true,
    tests: [],
    errors: []
  };

  try {
    // Test 1: Check if critical elements exist
    const criticalElements = [
      { name: 'Body', selector: 'body' },
      { name: 'Head', selector: 'head' },
      { name: 'Title', selector: 'title' }
    ];

    for (const element of criticalElements) {
      const exists = document.querySelector(element.selector) !== null;
      results.tests.push({
        name: `Element: ${element.name}`,
        success: exists
      });

      if (!exists) {
        results.success = false;
        results.errors.push(`Critical element missing: ${element.name}`);
        logError(`Critical element missing: ${element.name}`, 'Test');
      }
    }

    // Test 2: Check page-specific elements
    const currentPath = window.location.pathname;
    let pageSpecificElements = [];

    if (currentPath.includes('login') || currentPath === '/login') {
      pageSpecificElements = [
        { name: 'Login Form', selector: '#login-form' },
        { name: 'Login Button', selector: '.auth-button' }
      ];
    } else if (currentPath.includes('signup') || currentPath === '/signup') {
      pageSpecificElements = [
        { name: 'Signup Form', selector: '#signup-form' },
        { name: 'Step Navigation', selector: '.step-navigation' }
      ];
    } else if (currentPath.includes('app') || currentPath === '/app') {
      pageSpecificElements = [
        { name: 'Sidebar', selector: '#sidebar' },
        { name: 'Main Content', selector: '#main-content' }
      ];
    } else if (currentPath === '/' || currentPath.includes('index')) {
      pageSpecificElements = [
        { name: 'Hero Section', selector: '.hero' },
        { name: 'Navigation', selector: '.main-nav' }
      ];
    }

    for (const element of pageSpecificElements) {
      const exists = document.querySelector(element.selector) !== null;
      results.tests.push({
        name: `Page Element: ${element.name}`,
        success: exists
      });

      if (!exists) {
        results.success = false;
        results.errors.push(`Page-specific element missing: ${element.name}`);
        logError(`Page-specific element missing: ${element.name}`, 'Test');
      }
    }

    // Test 3: Check for JavaScript errors
    const hasConsoleErrors = window.hasJsErrors || false;
    results.tests.push({
      name: 'JavaScript Errors',
      success: !hasConsoleErrors,
      details: { hasErrors: hasConsoleErrors }
    });

    if (hasConsoleErrors) {
      results.success = false;
      results.errors.push('JavaScript errors detected in console');
      logWarn('JavaScript errors detected in console', 'Test');
    }
  } catch (error) {
    results.success = false;
    results.errors.push(`Page rendering test failed: ${error.message}`);
    logError(`Page rendering test failed: ${error.message}`, 'Test');
  }

  return results;
}

/**
 * Run all tests
 * @returns {Promise<Object>} Combined test results
 */
async function runAllTests() {
  logInfo('Running all tests', 'Test');

  const results = {
    success: true,
    authFlow: null,
    navigationFlow: null,
    pageRendering: null,
    timestamp: new Date().toISOString()
  };

  try {
    // Run auth flow test
    results.authFlow = await testAuthFlow();
    if (!results.authFlow.success) {
      results.success = false;
    }

    // Run navigation flow test
    results.navigationFlow = testNavigationFlow();
    if (!results.navigationFlow.success) {
      results.success = false;
    }

    // Run page rendering test
    results.pageRendering = testPageRendering();
    if (!results.pageRendering.success) {
      results.success = false;
    }

    logInfo(`All tests completed. Success: ${results.success}`, 'Test');
    if (!results.success) {
      const errorCount =
        (results.authFlow?.errors?.length || 0) +
        (results.navigationFlow?.errors?.length || 0) +
        (results.pageRendering?.errors?.length || 0);
      logWarn(`Tests completed with ${errorCount} errors`, 'Test');
    }
  } catch (error) {
    results.success = false;
    logError(`Test suite failed: ${error.message}`, 'Test');
  }

  return results;
}

/**
 * Create a test report UI
 * @param {Object} results - Test results
 */
function createTestReport(results) {
  logInfo('Creating test report', 'Test');

  // Create report container
  const reportContainer = document.createElement('div');
  reportContainer.id = 'test-report-container';
  reportContainer.innerHTML = `
    <div id="test-report-header">
      <span>Test Report</span>
      <div id="test-report-controls">
        <button id="test-report-run">Run Tests</button>
        <button id="test-report-close">×</button>
      </div>
    </div>
    <div id="test-report-content">
      <div class="test-summary">
        <div class="test-status ${results.success ? 'success' : 'failure'}">
          ${results.success ? 'All Tests Passed' : 'Tests Failed'}
        </div>
        <div class="test-timestamp">
          ${new Date(results.timestamp).toLocaleString()}
        </div>
      </div>

      <div class="test-section">
        <h3>Authentication Flow</h3>
        <div class="test-results">
          ${results.authFlow.tests.map(test => `
            <div class="test-result ${test.success ? 'success' : 'failure'}">
              <div class="test-name">${test.name}</div>
              <div class="test-indicator">${test.success ? '✓' : '✗'}</div>
            </div>
          `).join('')}
        </div>
        ${results.authFlow.errors.length > 0 ? `
          <div class="test-errors">
            <h4>Errors</h4>
            <ul>
              ${results.authFlow.errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>

      <div class="test-section">
        <h3>Navigation Flow</h3>
        <div class="test-results">
          ${results.navigationFlow.tests.map(test => `
            <div class="test-result ${test.success ? 'success' : 'failure'}">
              <div class="test-name">${test.name}</div>
              <div class="test-indicator">${test.success ? '✓' : '✗'}</div>
            </div>
          `).join('')}
        </div>
        ${results.navigationFlow.errors.length > 0 ? `
          <div class="test-errors">
            <h4>Errors</h4>
            <ul>
              ${results.navigationFlow.errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>

      <div class="test-section">
        <h3>Page Rendering</h3>
        <div class="test-results">
          ${results.pageRendering.tests.map(test => `
            <div class="test-result ${test.success ? 'success' : 'failure'}">
              <div class="test-name">${test.name}</div>
              <div class="test-indicator">${test.success ? '✓' : '✗'}</div>
            </div>
          `).join('')}
        </div>
        ${results.pageRendering.errors.length > 0 ? `
          <div class="test-errors">
            <h4>Errors</h4>
            <ul>
              ${results.pageRendering.errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    #test-report-container {
      position: fixed;
      top: 20px;
      left: 20px;
      width: 500px;
      max-height: 80vh;
      background-color: #fff;
      color: #333;
      font-family: Arial, sans-serif;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      border-radius: 5px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
    }
    #test-report-header {
      padding: 10px 15px;
      background-color: #4a6cf7;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      font-weight: bold;
    }
    #test-report-controls button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      margin-left: 10px;
      font-size: 14px;
    }
    #test-report-run {
      background-color: rgba(255, 255, 255, 0.2) !important;
      padding: 5px 10px;
      border-radius: 3px;
    }
    #test-report-close {
      font-size: 18px !important;
    }
    #test-report-content {
      flex: 1;
      overflow-y: auto;
      padding: 15px;
    }
    .test-summary {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .test-status {
      font-size: 18px;
      font-weight: bold;
      padding: 8px 15px;
      border-radius: 4px;
    }
    .test-status.success {
      background-color: #e6f7e6;
      color: #2e7d32;
    }
    .test-status.failure {
      background-color: #fdecea;
      color: #c62828;
    }
    .test-timestamp {
      color: #666;
      font-size: 12px;
    }
    .test-section {
      margin-bottom: 20px;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 15px;
    }
    .test-section h3 {
      margin-top: 0;
      margin-bottom: 15px;
      font-size: 16px;
      color: #333;
    }
    .test-results {
      margin-bottom: 15px;
    }
    .test-result {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #eee;
    }
    .test-result:last-child {
      border-bottom: none;
    }
    .test-name {
      flex: 1;
    }
    .test-indicator {
      font-weight: bold;
      margin-left: 10px;
    }
    .test-result.success .test-indicator {
      color: #2e7d32;
    }
    .test-result.failure .test-indicator {
      color: #c62828;
    }
    .test-errors {
      background-color: #fdecea;
      padding: 10px 15px;
      border-radius: 4px;
    }
    .test-errors h4 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #c62828;
      font-size: 14px;
    }
    .test-errors ul {
      margin: 0;
      padding-left: 20px;
    }
    .test-errors li {
      margin-bottom: 5px;
      font-size: 12px;
    }
  `;
  document.head.appendChild(style);

  // Add to document
  document.body.appendChild(reportContainer);

  // Add event listeners
  document.getElementById('test-report-close').addEventListener('click', () => {
    document.getElementById('test-report-container').remove();
  });

  document.getElementById('test-report-run').addEventListener('click', async () => {
    document.getElementById('test-report-container').remove();
    const newResults = await runAllTests();
    createTestReport(newResults);
  });
}

/**
 * Initialize test utilities
 */
async function initTestUtils() {
  logInfo('Initializing test utilities', 'Test');

  // Capture JavaScript errors
  window.hasJsErrors = false;
  const originalConsoleError = console.error;
  console.error = function(...args) {
    // Ignore specific errors that we can't fix
    if (args[0] && typeof args[0] === 'string' &&
        (args[0].includes('daily-js version') ||
         args[0].includes('no longer supported'))) {
      // Just log it without marking as an error
      originalConsoleError.apply(console, ['[IGNORED]', ...args]);
      return;
    }

    // Mark as a JavaScript error for other cases
    window.hasJsErrors = true;
    originalConsoleError.apply(console, args);
  };

  // We're not adding a floating test button anymore - using the debug panel button instead

  // Run tests automatically if URL parameter is present
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('test') && urlParams.get('test') === 'true') {
    logInfo('Auto-running tests due to URL parameter', 'Test');
    setTimeout(async () => {
      const results = await runAllTests();
      createTestReport(results);
    }, 1000); // Delay to allow page to load
  }
}

// Export functions
export {
  testAuthFlow,
  testNavigationFlow,
  testPageRendering,
  runAllTests,
  createTestReport,
  initTestUtils
};

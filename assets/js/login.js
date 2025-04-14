// Login Page JavaScript
import { signUp, signIn, resetPassword, getSession } from './auth.js';
import { logDebug, logError, logInfo, logWarn, initDebugTools } from './debug-utils.js';

// SIMPLIFIED: No redirects from login page to prevent loops
async function checkAuthStatus() {
  logDebug('Checking authentication status', 'Login');
  try {
    const { success, user } = await getSession();

    // If user is logged in, show a message instead of redirecting
    if (success && user) {
      logInfo(`User is already logged in: ${user.email}`, 'Login');

      // Show a message in the login form
      const loginForm = document.getElementById('login-form');
      const loginError = document.getElementById('login-error');

      if (loginForm && loginError) {
        // Clear the form
        loginForm.innerHTML = '';

        // Add a message
        const messageDiv = document.createElement('div');
        messageDiv.className = 'auth-message success';
        messageDiv.innerHTML = `
          <h3>You are already logged in</h3>
          <p>You are currently logged in as ${user.email}.</p>
          <button type="button" class="auth-button" id="go-to-app-button">Go to App</button>
          <button type="button" class="auth-button secondary" id="logout-button">Logout</button>
        `;

        loginForm.appendChild(messageDiv);

        // Add event listeners to buttons
        document.getElementById('go-to-app-button').addEventListener('click', () => {
          window.location.href = 'app.html';
        });

        document.getElementById('logout-button').addEventListener('click', async () => {
          try {
            const { signOut } = await import('./auth.js');
            await signOut();
            window.location.reload();
          } catch (error) {
            console.error('Error signing out:', error);
          }
        });
      }
    } else {
      // Clear indication that user is not logged in
      logInfo('User is not logged in', 'Login');
    }
  } catch (error) {
    logError(`Error checking auth status: ${error.message}`, 'Login');
    console.error('Error checking auth status:', error);
  }
}

// Initialize login page
function initLoginPage() {
  logDebug('Initializing login page');

  // Set up tab switching
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');

  logDebug(`Found ${authTabs.length} tabs and ${authForms.length} forms`);

  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // If signup tab is clicked, show a link instead of redirecting
      if (tab.dataset.tab === 'signup') {
        logInfo('Showing signup link', 'Login');
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
          const signupLink = document.createElement('div');
          signupLink.className = 'signup-link';
          signupLink.innerHTML = '<p>Please go to the <a href="signup.html" class="manual-link">signup page</a> to create a new account.</p>';
          loginForm.appendChild(signupLink);
        }
        return;
      }

      // Remove active class from all tabs and forms
      authTabs.forEach(t => t.classList.remove('active'));
      authForms.forEach(f => f.classList.remove('active'));

      // Add active class to clicked tab and corresponding form
      tab.classList.add('active');
      const formId = `${tab.dataset.tab}-form`;
      const form = document.getElementById(formId);

      if (form) {
        form.classList.add('active');
        logDebug(`Switched to ${tab.dataset.tab} tab`, 'Login');
      } else {
        logDebug(`Error: Form with ID ${formId} not found`, 'Login');
      }
    });
  });

  // Set up login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
    logDebug('Login form handler attached');
  } else {
    logDebug('Error: Login form not found');
  }

  // Set up signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
    logDebug('Signup form handler attached');
  } else {
    logDebug('Error: Signup form not found');
  }

  // Set up forgot password link
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', showForgotPasswordModal);
    logDebug('Forgot password link handler attached');
  } else {
    logDebug('Error: Forgot password link not found');
  }

  // Set up forgot password form
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    logDebug('Forgot password form handler attached');
  } else {
    logDebug('Error: Forgot password form not found');
  }

  // Set up modal close button
  const modalCloseButton = document.querySelector('.modal-close');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', hideForgotPasswordModal);
    logDebug('Modal close button handler attached');
  } else {
    logDebug('Error: Modal close button not found');
  }

  logDebug('Login page initialization complete');
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  logDebug('Login form submitted');

  const form = event.target; // Get the form from the event
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errorElement = document.getElementById('login-error');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!emailInput || !passwordInput || !errorElement || !submitButton) {
    console.error('Missing form elements:', {
      emailInput: !!emailInput,
      passwordInput: !!passwordInput,
      errorElement: !!errorElement,
      submitButton: !!submitButton
    });
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  logDebug(`Attempting login for email: ${email.substring(0, 3)}...`);

  // Validate inputs
  if (!email || !password) {
    errorElement.textContent = 'Please enter both email and password.';
    logDebug('Login validation failed: missing email or password');
    return;
  }

  // Show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Logging in...';
  errorElement.textContent = '';
  logDebug('Login in progress...');

  try {
    // Sign in user
    logDebug('Calling signIn function...');
    const result = await signIn(email, password);
    logDebug(`Sign in result: ${result.success ? 'success' : 'failed'}`);

    if (result.success) {
      // Redirect to main app
      logDebug('Login successful, redirecting to main app...');

      // Show success message and automatically redirect
      errorElement.textContent = 'Login successful! Redirecting...';
      errorElement.style.color = 'green';

      // Get the redirect URL from query parameters or use app.html as default
      const urlParams = new URLSearchParams(window.location.search);
      const redirectUrl = urlParams.get('redirect') || 'app.html';

      // Automatically redirect after a short delay
      setTimeout(() => {
        // Make sure we're not redirecting to login or signup to avoid loops
        if (redirectUrl.includes('login.html') || redirectUrl.includes('signup.html')) {
          logWarn('Avoiding redirect loop by redirecting to app.html instead', 'Login');
          window.location.href = 'app.html';
        } else {
          logInfo(`Redirecting to: ${redirectUrl}`, 'Login');
          window.location.href = redirectUrl;
        }
      }, 1000); // 1 second delay for user to see the success message
    } else {
      // Show error message
      const errorMsg = result.error || 'Failed to login. Please check your credentials and try again.';
      logDebug(`Login failed: ${errorMsg}`);
      errorElement.textContent = errorMsg;
    }
  } catch (error) {
    // Show error message
    const errorMsg = error.message || 'An unexpected error occurred.';
    logDebug(`Login error: ${errorMsg}`);
    console.error('Login error details:', error);
    errorElement.textContent = errorMsg;
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = 'Login';
    logDebug('Login form reset to initial state');
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();

  const form = event.target; // Get the form from the event
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const confirmPasswordInput = document.getElementById('signup-confirm-password');
  const isInstructorCheckbox = document.getElementById('signup-instructor');
  const errorElement = document.getElementById('signup-error');
  const submitButton = form.querySelector('button[type="submit"]');

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  const isInstructor = isInstructorCheckbox.checked;

  // Validate inputs
  if (!email || !password || !confirmPassword) {
    errorElement.textContent = 'Please fill in all fields.';
    return;
  }

  if (password !== confirmPassword) {
    errorElement.textContent = 'Passwords do not match.';
    return;
  }

  if (password.length < 6) {
    errorElement.textContent = 'Password must be at least 6 characters long.';
    return;
  }

  // Show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Signing up...';
  errorElement.textContent = '';

  try {
    // Sign up user with instructor flag in metadata
    const result = await signUp(email, password, { isInstructor });

    if (result.success) {
      // Show success message
      errorElement.textContent = 'Registration successful! Please check your email to confirm your account.';
      errorElement.style.color = 'green';

      // Clear form
      signupForm.reset();

      // Switch to login tab after a delay
      setTimeout(() => {
        document.querySelector('.auth-tab[data-tab="login"]').click();
      }, 3000);
    } else {
      // Show error message
      errorElement.textContent = result.error || 'Failed to sign up. Please try again.';
    }
  } catch (error) {
    // Show error message
    errorElement.textContent = error.message || 'An unexpected error occurred.';
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = 'Sign Up';
  }
}

// Handle forgot password form submission
async function handleForgotPassword(event) {
  event.preventDefault();

  const form = event.target; // Get the form from the event
  const emailInput = document.getElementById('reset-email');
  const errorElement = document.getElementById('reset-error');
  const submitButton = form.querySelector('button[type="submit"]');

  const email = emailInput.value.trim();

  // Validate input
  if (!email) {
    errorElement.textContent = 'Please enter your email.';
    return;
  }

  // Show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  errorElement.textContent = '';

  try {
    // Reset password
    const result = await resetPassword(email);

    if (result.success) {
      // Show success message
      errorElement.textContent = 'Password reset link sent to your email.';
      errorElement.style.color = 'green';

      // Clear form
      forgotPasswordForm.reset();

      // Hide modal after a delay
      setTimeout(() => {
        hideForgotPasswordModal();
      }, 3000);
    } else {
      // Show error message
      errorElement.textContent = result.error || 'Failed to send reset link. Please try again.';
    }
  } catch (error) {
    // Show error message
    errorElement.textContent = error.message || 'An unexpected error occurred.';
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = 'Send Reset Link';
  }
}

// Show forgot password modal
function showForgotPasswordModal(event) {
  if (event) event.preventDefault();

  const modal = document.getElementById('forgot-password-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// Hide forgot password modal
function hideForgotPasswordModal() {
  const modal = document.getElementById('forgot-password-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Initialize when the page loads
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize debug tools
  initDebugTools();

  logInfo('Login page loaded', 'Login');

  // Check if user is already logged in
  await checkAuthStatus();

  // Initialize login page
  initLoginPage();
});

// Login Page JavaScript
import { signUp, signIn, resetPassword, getSession } from './auth.js';

// Check if user is already logged in
async function checkAuthStatus() {
  try {
    const { success, user } = await getSession();
    
    if (success && user) {
      // User is already logged in, redirect to main app
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Error checking auth status:', error);
  }
}

// Initialize login page
function initLoginPage() {
  // Set up tab switching
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');
  
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and forms
      authTabs.forEach(t => t.classList.remove('active'));
      authForms.forEach(f => f.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding form
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
  });
  
  // Set up login form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Set up signup form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Set up forgot password link
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', showForgotPasswordModal);
  }
  
  // Set up forgot password form
  const forgotPasswordForm = document.getElementById('forgot-password-form');
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
  }
  
  // Set up modal close button
  const modalCloseButton = document.querySelector('.modal-close');
  if (modalCloseButton) {
    modalCloseButton.addEventListener('click', hideForgotPasswordModal);
  }
}

// Handle login form submission
async function handleLogin(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const errorElement = document.getElementById('login-error');
  const submitButton = loginForm.querySelector('button[type="submit"]');
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  
  // Validate inputs
  if (!email || !password) {
    errorElement.textContent = 'Please enter both email and password.';
    return;
  }
  
  // Show loading state
  submitButton.disabled = true;
  submitButton.textContent = 'Logging in...';
  errorElement.textContent = '';
  
  try {
    // Sign in user
    const result = await signIn(email, password);
    
    if (result.success) {
      // Redirect to main app
      window.location.href = 'index.html';
    } else {
      // Show error message
      errorElement.textContent = result.error || 'Failed to login. Please check your credentials and try again.';
    }
  } catch (error) {
    // Show error message
    errorElement.textContent = error.message || 'An unexpected error occurred.';
  } finally {
    // Reset button state
    submitButton.disabled = false;
    submitButton.textContent = 'Login';
  }
}

// Handle signup form submission
async function handleSignup(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const confirmPasswordInput = document.getElementById('signup-confirm-password');
  const isInstructorCheckbox = document.getElementById('signup-instructor');
  const errorElement = document.getElementById('signup-error');
  const submitButton = signupForm.querySelector('button[type="submit"]');
  
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
  
  const emailInput = document.getElementById('reset-email');
  const errorElement = document.getElementById('reset-error');
  const submitButton = forgotPasswordForm.querySelector('button[type="submit"]');
  
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
  // Check if user is already logged in
  await checkAuthStatus();
  
  // Initialize login page
  initLoginPage();
});

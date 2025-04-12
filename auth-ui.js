// Authentication UI Components

// Create and render the authentication UI
function createAuthUI() {
  // Create auth container
  const authContainer = document.createElement('div');
  authContainer.id = 'auth-container';
  authContainer.className = 'auth-container';
  
  // Create auth tabs
  const authTabs = document.createElement('div');
  authTabs.className = 'auth-tabs';
  
  const loginTab = document.createElement('button');
  loginTab.className = 'auth-tab active';
  loginTab.textContent = 'Login';
  loginTab.dataset.tab = 'login';
  
  const signupTab = document.createElement('button');
  signupTab.className = 'auth-tab';
  signupTab.textContent = 'Sign Up';
  signupTab.dataset.tab = 'signup';
  
  authTabs.appendChild(loginTab);
  authTabs.appendChild(signupTab);
  
  // Create auth forms container
  const authForms = document.createElement('div');
  authForms.className = 'auth-forms';
  
  // Create login form
  const loginForm = createLoginForm();
  loginForm.id = 'login-form';
  loginForm.className = 'auth-form active';
  
  // Create signup form
  const signupForm = createSignupForm();
  signupForm.id = 'signup-form';
  signupForm.className = 'auth-form';
  
  // Add forms to container
  authForms.appendChild(loginForm);
  authForms.appendChild(signupForm);
  
  // Add tabs and forms to auth container
  authContainer.appendChild(authTabs);
  authContainer.appendChild(authForms);
  
  // Add event listeners for tab switching
  authTabs.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and forms
      authTabs.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      authForms.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
      
      // Add active class to clicked tab and corresponding form
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
    });
  });
  
  return authContainer;
}

// Create login form
function createLoginForm() {
  const form = document.createElement('form');
  form.className = 'login-form';
  
  // Email input
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  
  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'login-email';
  emailLabel.textContent = 'Email';
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'login-email';
  emailInput.name = 'email';
  emailInput.required = true;
  emailInput.placeholder = 'Enter your email';
  
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);
  
  // Password input
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';
  
  const passwordLabel = document.createElement('label');
  passwordLabel.htmlFor = 'login-password';
  passwordLabel.textContent = 'Password';
  
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'login-password';
  passwordInput.name = 'password';
  passwordInput.required = true;
  passwordInput.placeholder = 'Enter your password';
  
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);
  
  // Forgot password link
  const forgotPassword = document.createElement('a');
  forgotPassword.href = '#';
  forgotPassword.className = 'forgot-password';
  forgotPassword.textContent = 'Forgot password?';
  forgotPassword.addEventListener('click', (e) => {
    e.preventDefault();
    showForgotPasswordModal();
  });
  
  // Submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'auth-button';
  submitButton.textContent = 'Login';
  
  // Error message container
  const errorMessage = document.createElement('div');
  errorMessage.className = 'auth-error';
  errorMessage.id = 'login-error';
  
  // Add elements to form
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(forgotPassword);
  form.appendChild(submitButton);
  form.appendChild(errorMessage);
  
  // Add form submit event listener
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    errorMessage.textContent = '';
    
    try {
      // Import auth functions
      const { signIn } = await import('./auth.js');
      
      // Sign in user
      const result = await signIn(email, password);
      
      if (result.success) {
        // Hide auth container and show user profile
        document.getElementById('auth-container').style.display = 'none';
        showUserProfile(result.data.user);
        
        // Refresh the page or update UI as needed
        window.location.reload();
      } else {
        // Show error message
        errorMessage.textContent = result.error || 'Failed to login. Please try again.';
      }
    } catch (error) {
      // Show error message
      errorMessage.textContent = error.message || 'An unexpected error occurred.';
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = 'Login';
    }
  });
  
  return form;
}

// Create signup form
function createSignupForm() {
  const form = document.createElement('form');
  form.className = 'signup-form';
  
  // Email input
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  
  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'signup-email';
  emailLabel.textContent = 'Email';
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'signup-email';
  emailInput.name = 'email';
  emailInput.required = true;
  emailInput.placeholder = 'Enter your email';
  
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);
  
  // Password input
  const passwordGroup = document.createElement('div');
  passwordGroup.className = 'form-group';
  
  const passwordLabel = document.createElement('label');
  passwordLabel.htmlFor = 'signup-password';
  passwordLabel.textContent = 'Password';
  
  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'signup-password';
  passwordInput.name = 'password';
  passwordInput.required = true;
  passwordInput.placeholder = 'Create a password';
  passwordInput.minLength = 6;
  
  passwordGroup.appendChild(passwordLabel);
  passwordGroup.appendChild(passwordInput);
  
  // Confirm password input
  const confirmPasswordGroup = document.createElement('div');
  confirmPasswordGroup.className = 'form-group';
  
  const confirmPasswordLabel = document.createElement('label');
  confirmPasswordLabel.htmlFor = 'signup-confirm-password';
  confirmPasswordLabel.textContent = 'Confirm Password';
  
  const confirmPasswordInput = document.createElement('input');
  confirmPasswordInput.type = 'password';
  confirmPasswordInput.id = 'signup-confirm-password';
  confirmPasswordInput.name = 'confirmPassword';
  confirmPasswordInput.required = true;
  confirmPasswordInput.placeholder = 'Confirm your password';
  
  confirmPasswordGroup.appendChild(confirmPasswordLabel);
  confirmPasswordGroup.appendChild(confirmPasswordInput);
  
  // Submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'auth-button';
  submitButton.textContent = 'Sign Up';
  
  // Error message container
  const errorMessage = document.createElement('div');
  errorMessage.className = 'auth-error';
  errorMessage.id = 'signup-error';
  
  // Add elements to form
  form.appendChild(emailGroup);
  form.appendChild(passwordGroup);
  form.appendChild(confirmPasswordGroup);
  form.appendChild(submitButton);
  form.appendChild(errorMessage);
  
  // Add form submit event listener
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
      errorMessage.textContent = 'Passwords do not match.';
      return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Signing up...';
    errorMessage.textContent = '';
    
    try {
      // Import auth functions
      const { signUp } = await import('./auth.js');
      
      // Sign up user
      const result = await signUp(email, password);
      
      if (result.success) {
        // Show success message
        errorMessage.textContent = 'Registration successful! Please check your email to confirm your account.';
        errorMessage.style.color = 'green';
        
        // Clear form
        form.reset();
      } else {
        // Show error message
        errorMessage.textContent = result.error || 'Failed to sign up. Please try again.';
      }
    } catch (error) {
      // Show error message
      errorMessage.textContent = error.message || 'An unexpected error occurred.';
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = 'Sign Up';
    }
  });
  
  return form;
}

// Create user profile UI
function createUserProfileUI(user) {
  const profileContainer = document.createElement('div');
  profileContainer.id = 'user-profile';
  profileContainer.className = 'user-profile';
  
  // User info
  const userInfo = document.createElement('div');
  userInfo.className = 'user-info';
  
  const userEmail = document.createElement('div');
  userEmail.className = 'user-email';
  userEmail.textContent = user.email;
  
  userInfo.appendChild(userEmail);
  
  // Logout button
  const logoutButton = document.createElement('button');
  logoutButton.className = 'logout-button';
  logoutButton.textContent = 'Logout';
  
  logoutButton.addEventListener('click', async () => {
    try {
      // Import auth functions
      const { signOut } = await import('./auth.js');
      
      // Sign out user
      const result = await signOut();
      
      if (result.success) {
        // Hide user profile and show auth container
        document.getElementById('user-profile').style.display = 'none';
        document.getElementById('auth-container').style.display = 'block';
        
        // Refresh the page or update UI as needed
        window.location.reload();
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  });
  
  // Add elements to profile container
  profileContainer.appendChild(userInfo);
  profileContainer.appendChild(logoutButton);
  
  return profileContainer;
}

// Show forgot password modal
function showForgotPasswordModal() {
  // Create modal container
  const modalContainer = document.createElement('div');
  modalContainer.className = 'modal-container';
  modalContainer.id = 'forgot-password-modal';
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';
  
  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'modal-header';
  
  const modalTitle = document.createElement('h3');
  modalTitle.textContent = 'Reset Password';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'modal-close';
  closeButton.innerHTML = '&times;';
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modalContainer);
  });
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  // Create modal body
  const modalBody = document.createElement('div');
  modalBody.className = 'modal-body';
  
  const form = document.createElement('form');
  form.id = 'forgot-password-form';
  
  const emailGroup = document.createElement('div');
  emailGroup.className = 'form-group';
  
  const emailLabel = document.createElement('label');
  emailLabel.htmlFor = 'reset-email';
  emailLabel.textContent = 'Email';
  
  const emailInput = document.createElement('input');
  emailInput.type = 'email';
  emailInput.id = 'reset-email';
  emailInput.name = 'email';
  emailInput.required = true;
  emailInput.placeholder = 'Enter your email';
  
  emailGroup.appendChild(emailLabel);
  emailGroup.appendChild(emailInput);
  
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'auth-button';
  submitButton.textContent = 'Send Reset Link';
  
  const errorMessage = document.createElement('div');
  errorMessage.className = 'auth-error';
  errorMessage.id = 'reset-error';
  
  form.appendChild(emailGroup);
  form.appendChild(submitButton);
  form.appendChild(errorMessage);
  
  // Add form submit event listener
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    errorMessage.textContent = '';
    
    try {
      // Import auth functions
      const { resetPassword } = await import('./auth.js');
      
      // Reset password
      const result = await resetPassword(email);
      
      if (result.success) {
        // Show success message
        errorMessage.textContent = 'Password reset link sent to your email.';
        errorMessage.style.color = 'green';
        
        // Clear form
        form.reset();
        
        // Close modal after a delay
        setTimeout(() => {
          document.body.removeChild(modalContainer);
        }, 3000);
      } else {
        // Show error message
        errorMessage.textContent = result.error || 'Failed to send reset link. Please try again.';
      }
    } catch (error) {
      // Show error message
      errorMessage.textContent = error.message || 'An unexpected error occurred.';
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = 'Send Reset Link';
    }
  });
  
  modalBody.appendChild(form);
  
  // Add header and body to modal content
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  
  // Add modal content to modal container
  modalContainer.appendChild(modalContent);
  
  // Add modal to body
  document.body.appendChild(modalContainer);
}

// Show user profile
function showUserProfile(user) {
  // Remove existing profile if it exists
  const existingProfile = document.getElementById('user-profile');
  if (existingProfile) {
    existingProfile.remove();
  }
  
  // Create and add user profile UI
  const profileUI = createUserProfileUI(user);
  document.body.appendChild(profileUI);
  
  // Update UI to show logged in state
  const authContainer = document.getElementById('auth-container');
  if (authContainer) {
    authContainer.style.display = 'none';
  }
}

// Initialize authentication UI
async function initAuthUI() {
  try {
    // Import auth functions
    const { getSession, onAuthStateChange } = await import('./auth.js');
    
    // Get current session
    const { success, user } = await getSession();
    
    // Create auth container
    const authContainer = createAuthUI();
    document.body.appendChild(authContainer);
    
    // Show user profile if logged in
    if (success && user) {
      showUserProfile(user);
      authContainer.style.display = 'none';
    }
    
    // Set up auth state change listener
    onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        showUserProfile(session.user);
        authContainer.style.display = 'none';
      } else if (event === 'SIGNED_OUT') {
        const profileUI = document.getElementById('user-profile');
        if (profileUI) {
          profileUI.style.display = 'none';
        }
        authContainer.style.display = 'block';
      }
    });
  } catch (error) {
    console.error('Error initializing auth UI:', error);
  }
}

// Export functions
export {
  initAuthUI,
  createAuthUI,
  showUserProfile,
};

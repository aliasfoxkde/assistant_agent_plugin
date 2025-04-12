// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get sidebar elements
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mainContent = document.getElementById('main-content');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  // Initialize sidebar state from localStorage if available
  const sidebarExpanded = localStorage.getItem('sidebarExpanded') === 'true';
  if (sidebarExpanded) {
    sidebar.classList.add('expanded');
    mainContent.classList.add('sidebar-expanded');
  }

  // Initialize theme from localStorage if available
  const darkMode = localStorage.getItem('darkMode') === 'true';
  if (darkMode) {
    document.body.classList.add('dark-mode');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
    if (themeToggle && themeToggle.querySelector('.sidebar-text')) {
      themeToggle.querySelector('.sidebar-text').textContent = 'Light Mode';
    }
  }

  // Toggle sidebar function
  function toggleSidebar() {
    sidebar.classList.toggle('expanded');
    mainContent.classList.toggle('sidebar-expanded');

    // Save state to localStorage
    localStorage.setItem('sidebarExpanded', sidebar.classList.contains('expanded'));
  }

  // Add click event to toggle button
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', toggleSidebar);
  }

  // Handle active link
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // If this is a theme toggle
      if (this.id === 'theme-toggle') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // If this is a navigation link (not logout or theme toggle or pwa install)
      if (!this.dataset.action && this.id !== 'pwa-install-sidebar') {
        e.preventDefault();

        // Remove active class from all links
        sidebarLinks.forEach(l => l.classList.remove('active'));

        // Add active class to clicked link
        this.classList.add('active');

        // Get the target section
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        // Hide all sections
        document.querySelectorAll('.tab-content').forEach(section => {
          section.classList.remove('active');
        });

        // Show target section
        if (targetSection) {
          targetSection.classList.add('active');

          // Update tab buttons to match
          document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-tab') === targetId) {
              button.classList.add('active');
            }
          });
        }

        // On mobile, close sidebar after navigation
        if (window.innerWidth <= 768) {
          sidebar.classList.remove('expanded');
          mainContent.classList.remove('sidebar-expanded');
          localStorage.setItem('sidebarExpanded', 'false');
        }
      }
    });
  });

  // Toggle theme function
  function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);

    // Update icon and text
    if (themeIcon) {
      if (isDarkMode) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        if (themeToggle && themeToggle.querySelector('.sidebar-text')) {
          themeToggle.querySelector('.sidebar-text').textContent = 'Light Mode';
        }
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        if (themeToggle && themeToggle.querySelector('.sidebar-text')) {
          themeToggle.querySelector('.sidebar-text').textContent = 'Dark Mode';
        }
      }
    }
  }

  // Handle logout
  const logoutLink = document.querySelector('.sidebar-link[data-action="logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', async function(e) {
      e.preventDefault();

      try {
        // Import auth functions
        const { signOut } = await import('./auth.js');

        // Sign out user
        const result = await signOut();

        if (result.success) {
          // Redirect to login page
          window.location.href = 'login.html';
        } else {
          console.error('Logout failed:', result.error);
        }
      } catch (error) {
        console.error('Error during logout:', error);
      }
    });
  }

  // Set initial active link based on current tab
  function setInitialActiveLink() {
    const activeTab = document.querySelector('.tab-content.active');
    if (activeTab) {
      const tabId = activeTab.id;
      const correspondingLink = document.querySelector(`.sidebar-link[href="#${tabId}"]`);
      if (correspondingLink) {
        correspondingLink.classList.add('active');
      }
    }
  }

  setInitialActiveLink();

  // Update user info in sidebar and account tab
  async function updateUserInfo() {
    try {
      // Import auth module
      const auth = await import('./auth.js');

      // Get current session
      const { success, user } = await auth.getSession();

      if (success && user) {
        // Update user avatar in sidebar
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
          // Use first letter of email as avatar
          userAvatar.textContent = user.email.charAt(0).toUpperCase();
        }

        // Update user name in sidebar
        const userName = document.getElementById('user-name');
        if (userName) {
          userName.textContent = user.email;
        }

        // Update user role in sidebar
        const userRole = document.getElementById('user-role');
        if (userRole) {
          if (user.user_metadata?.isInstructor) {
            userRole.textContent = 'Instructor';
          } else {
            userRole.textContent = 'Student';
          }
        }

        // Update profile info in account tab
        const profileAvatar = document.getElementById('profile-avatar');
        if (profileAvatar) {
          profileAvatar.textContent = user.email.charAt(0).toUpperCase();
        }

        const profileEmail = document.getElementById('profile-email');
        if (profileEmail) {
          profileEmail.textContent = user.email;
        }

        const profileRole = document.getElementById('profile-role');
        if (profileRole) {
          if (user.user_metadata?.isInstructor) {
            profileRole.textContent = 'Instructor';
          } else {
            profileRole.textContent = 'Student';
          }
        }
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }

  updateUserInfo();

  // Set up account tab theme toggle button
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeBtnIcon = document.getElementById('theme-btn-icon');
  const themeText = document.getElementById('theme-text');

  if (themeToggleBtn) {
    // Initialize button state
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
      themeBtnIcon.classList.remove('fa-moon');
      themeBtnIcon.classList.add('fa-sun');
      themeText.textContent = 'Light Mode';
    }

    // Add click event listener
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Set up PWA install button in account tab
  const pwaInstallBtn = document.getElementById('pwa-install-btn');
  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      // Check if PWA is already installed
      if ('localStorage' in window && localStorage.getItem('pwaInstalled') === 'true') {
        alert('App is already installed on your device.');
        return;
      }

      // Check if deferredPrompt is available from pwa.js
      if (typeof deferredPrompt !== 'undefined' && deferredPrompt) {
        try {
          // Show the install prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          const { outcome } = await deferredPrompt.userChoice;
          // We've used the prompt, and can't use it again, throw it away
          deferredPrompt = null;
          // Log the outcome
          console.log(`User ${outcome} the A2HS prompt`);
          // Save to localStorage that the PWA was installed
          if (outcome === 'accepted') {
            localStorage.setItem('pwaInstalled', 'true');
            pwaInstallBtn.disabled = true;
            pwaInstallBtn.innerHTML = '<span class="pwa-icon"><i class="fas fa-check"></i></span><span class="pwa-text">Installed</span>';
          }
        } catch (error) {
          console.error('Error installing PWA:', error);
        }
      } else {
        alert('Installation is not available. You may already have installed the app or your browser does not support PWA installation.');
      }
    });

    // Check if PWA is already installed
    if ('localStorage' in window && localStorage.getItem('pwaInstalled') === 'true') {
      pwaInstallBtn.disabled = true;
      pwaInstallBtn.innerHTML = '<span class="pwa-icon"><i class="fas fa-check"></i></span><span class="pwa-text">Installed</span>';
    }
  }
});

// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get sidebar elements
  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const mainContent = document.getElementById('main-content');
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  
  // Initialize sidebar state from localStorage if available
  const sidebarExpanded = localStorage.getItem('sidebarExpanded') === 'true';
  if (sidebarExpanded) {
    sidebar.classList.add('expanded');
    mainContent.classList.add('sidebar-expanded');
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
      // If this is a navigation link (not logout)
      if (!this.dataset.action) {
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
  
  // Update user info in sidebar
  async function updateUserInfo() {
    try {
      // Import auth module
      const auth = await import('./auth.js');
      
      // Get current session
      const { success, user } = await auth.getSession();
      
      if (success && user) {
        // Update user avatar
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
          // Use first letter of email as avatar
          userAvatar.textContent = user.email.charAt(0).toUpperCase();
        }
        
        // Update user name
        const userName = document.getElementById('user-name');
        if (userName) {
          userName.textContent = user.email;
        }
        
        // Update user role
        const userRole = document.getElementById('user-role');
        if (userRole) {
          if (user.user_metadata?.isInstructor) {
            userRole.textContent = 'Instructor';
          } else {
            userRole.textContent = 'Student';
          }
        }
      }
    } catch (error) {
      console.error('Error updating user info:', error);
    }
  }
  
  updateUserInfo();
});

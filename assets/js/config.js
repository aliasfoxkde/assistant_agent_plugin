// Configuration Page JavaScript

document.addEventListener('DOMContentLoaded', async function() {
  console.log('Config page loaded');
  
  // Get DOM elements
  const saveConfigBtn = document.getElementById('save-config');
  const resetConfigBtn = document.getElementById('reset-config');
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  
  // Form fields
  const supabaseUrlInput = document.getElementById('supabase-url');
  const supabaseAnonKeyInput = document.getElementById('supabase-anon-key');
  const openaiApiKeyInput = document.getElementById('openai-api-key');
  const openaiModelSelect = document.getElementById('openai-model');
  const elevenlabsApiKeyInput = document.getElementById('elevenlabs-api-key');
  const openedxUrlInput = document.getElementById('openedx-url');
  const openedxApiKeyInput = document.getElementById('openedx-api-key');
  
  // Load saved configuration
  loadConfig();
  
  // Toggle password visibility
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      
      if (targetInput.type === 'password') {
        targetInput.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
      } else {
        targetInput.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
      }
    });
  });
  
  // Save configuration
  saveConfigBtn.addEventListener('click', function() {
    const config = {
      supabase: {
        url: supabaseUrlInput.value.trim(),
        anonKey: supabaseAnonKeyInput.value.trim()
      },
      openai: {
        apiKey: openaiApiKeyInput.value.trim(),
        model: openaiModelSelect.value
      },
      elevenlabs: {
        apiKey: elevenlabsApiKeyInput.value.trim()
      },
      openedx: {
        url: openedxUrlInput.value.trim(),
        apiKey: openedxApiKeyInput.value.trim()
      },
      lastUpdated: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('vapi_config', JSON.stringify(config));
    
    // Show success message
    showNotification('Configuration saved successfully!', 'success');
  });
  
  // Reset configuration
  resetConfigBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to reset all configuration to defaults?')) {
      // Default configuration
      const defaultConfig = {
        supabase: {
          url: 'https://alcheqbohkjbgbjfuenb.supabase.co',
          anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsY2hlcWJvaGtqYmdiamZ1ZW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzOTI5NzYsImV4cCI6MjA1ODk2ODk3Nn0.BO-cQ92hcnFuG9HgcwaVXjFtwDL10fn7CPZneC6DAs8'
        },
        openai: {
          apiKey: '',
          model: 'gpt-4'
        },
        elevenlabs: {
          apiKey: ''
        },
        openedx: {
          url: '',
          apiKey: ''
        },
        lastUpdated: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem('vapi_config', JSON.stringify(defaultConfig));
      
      // Update form fields
      loadConfig();
      
      // Show success message
      showNotification('Configuration reset to defaults', 'info');
    }
  });
  
  // Function to load configuration from localStorage
  function loadConfig() {
    try {
      const savedConfig = localStorage.getItem('vapi_config');
      
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        
        // Populate form fields
        supabaseUrlInput.value = config.supabase?.url || '';
        supabaseAnonKeyInput.value = config.supabase?.anonKey || '';
        openaiApiKeyInput.value = config.openai?.apiKey || '';
        openaiModelSelect.value = config.openai?.model || 'gpt-4';
        elevenlabsApiKeyInput.value = config.elevenlabs?.apiKey || '';
        openedxUrlInput.value = config.openedx?.url || '';
        openedxApiKeyInput.value = config.openedx?.apiKey || '';
        
        console.log('Configuration loaded from localStorage');
      } else {
        console.log('No saved configuration found');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  }
  
  // Function to show notification
  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
      </div>
      <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        .notification {
          position: fixed;
          bottom: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 8px;
          background-color: var(--card-bg);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1000;
          min-width: 300px;
          max-width: 400px;
          animation: slideIn 0.3s ease, fadeOut 0.5s ease 4.5s forwards;
          border-left: 4px solid #4a6cf7;
        }
        
        .notification.success {
          border-left-color: #10b981;
        }
        
        .notification.error {
          border-left-color: #ef4444;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .notification-content i {
          font-size: 1.2rem;
          color: #4a6cf7;
        }
        
        .notification.success .notification-content i {
          color: #10b981;
        }
        
        .notification.error .notification-content i {
          color: #ef4444;
        }
        
        .notification-close {
          background: none;
          border: none;
          color: var(--text-color);
          opacity: 0.6;
          cursor: pointer;
          transition: opacity 0.3s ease;
        }
        
        .notification-close:hover {
          opacity: 1;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
      notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
});

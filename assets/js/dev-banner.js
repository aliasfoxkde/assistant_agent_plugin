// Development Banner JavaScript

/**
 * Extracts the latest version number from the CHANGELOG.md file
 * @returns {Promise<string>} The latest version number
 */
async function getLatestVersion() {
  try {
    // Fetch the CHANGELOG.md file
    const response = await fetch('docs/CHANGELOG.md');
    if (!response.ok) {
      console.error('Failed to fetch CHANGELOG.md:', response.status);
      return 'Unknown';
    }
    
    const text = await response.text();
    
    // Use regex to find version numbers in the format [x.y.z]
    const versionRegex = /\[(\d+\.\d+\.\d+)\]/g;
    const matches = [...text.matchAll(versionRegex)];
    
    if (matches.length > 0) {
      // Return the first match (latest version)
      return matches[0][1];
    } else {
      // Try alternative format: Version [x.y.z]
      const altVersionRegex = /Version\s+\[(\d+\.\d+\.\d+)\]/g;
      const altMatches = [...text.matchAll(altVersionRegex)];
      
      if (altMatches.length > 0) {
        return altMatches[0][1];
      }
      
      // If no version found, return unknown
      return 'Unknown';
    }
  } catch (error) {
    console.error('Error fetching version:', error);
    return 'Unknown';
  }
}

/**
 * Creates and adds the development banner to the page
 */
async function createDevBanner() {
  // Get the latest version
  const version = await getLatestVersion();
  
  // Create the banner element
  const banner = document.createElement('div');
  banner.className = 'dev-banner';
  banner.id = 'dev-banner';
  
  // Set the banner content
  banner.innerHTML = `
    <div class="dev-banner-content">
      <span class="dev-banner-icon"><i class="fas fa-code"></i></span>
      <span class="dev-banner-text">
        This site is in development. See 
        <a href="docs/CHANGELOG.md" class="dev-banner-link">CHANGELOG</a> 
        for release details.
      </span>
      <span class="dev-banner-version">v${version}</span>
      <button class="dev-banner-close" id="dev-banner-close" title="Hide banner">×</button>
    </div>
  `;
  
  // Add the banner to the page
  document.body.insertBefore(banner, document.body.firstChild);
  
  // Add class to body for styling adjustments
  document.body.classList.add('has-dev-banner');
  
  // Add event listener to close button
  document.getElementById('dev-banner-close').addEventListener('click', () => {
    // Hide the banner
    banner.style.display = 'none';
    
    // Remove the body class
    document.body.classList.remove('has-dev-banner');
    
    // Store preference in localStorage
    localStorage.setItem('dev-banner-hidden', 'true');
    
    // Dispatch an event to notify other components
    window.dispatchEvent(new CustomEvent('dev-banner-closed'));
  });
  
  // Dispatch an event to notify other components
  window.dispatchEvent(new CustomEvent('dev-banner-created'));
}

/**
 * Initializes the development banner
 */
function initDevBanner() {
  // Check if banner should be hidden
  const isHidden = localStorage.getItem('dev-banner-hidden') === 'true';
  
  if (!isHidden) {
    createDevBanner();
  }
}

// Initialize the banner when the DOM is loaded
document.addEventListener('DOMContentLoaded', initDevBanner);

// Export functions
export { getLatestVersion, createDevBanner, initDevBanner };

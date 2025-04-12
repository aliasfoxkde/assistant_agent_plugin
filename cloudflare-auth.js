// Cloudflare Authentication Handler

// Function to get Supabase credentials from Cloudflare environment
async function getCloudflareSupabaseCredentials() {
  try {
    // Try to get credentials from headers (set by middleware)
    const supabaseUrl = document.querySelector('meta[name="x-supabase-url"]')?.content;
    const supabaseAnonKey = document.querySelector('meta[name="x-supabase-anon-key"]')?.content;
    
    if (supabaseUrl && supabaseAnonKey) {
      console.log('Retrieved Supabase credentials from Cloudflare headers');
      return { supabaseUrl, supabaseAnonKey };
    }
    
    // If not available in headers, try to fetch from Cloudflare Function
    const response = await fetch('/.netlify/functions/get-supabase-credentials');
    if (response.ok) {
      const data = await response.json();
      if (data.supabaseUrl && data.supabaseAnonKey) {
        console.log('Retrieved Supabase credentials from Cloudflare Function');
        return {
          supabaseUrl: data.supabaseUrl,
          supabaseAnonKey: data.supabaseAnonKey
        };
      }
    }
    
    // If still not available, return null
    return null;
  } catch (error) {
    console.error('Error getting Cloudflare Supabase credentials:', error);
    return null;
  }
}

// Export functions
export {
  getCloudflareSupabaseCredentials
};

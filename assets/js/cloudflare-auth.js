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
    try {
      const response = await fetch('/functions/get-supabase-credentials');
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
    } catch (e) {
      console.log('Could not fetch from Cloudflare Functions, using fallback');
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

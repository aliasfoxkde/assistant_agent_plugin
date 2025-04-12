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

      // Check if response is OK and is JSON
      if (response.ok) {
        // Check content type to ensure it's JSON
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const data = await response.json();
            if (data.supabaseUrl && data.supabaseAnonKey) {
              console.log('Retrieved Supabase credentials from Cloudflare Function');
              return {
                supabaseUrl: data.supabaseUrl,
                supabaseAnonKey: data.supabaseAnonKey
              };
            }
          } catch (jsonError) {
            console.log('Error parsing JSON from Cloudflare Function:', jsonError);
          }
        } else {
          console.log('Cloudflare Function response is not JSON, content-type:', contentType);
          // Log the first part of the response for debugging
          const text = await response.text();
          console.log('Response preview:', text.substring(0, 100));
        }
      } else {
        console.log('Cloudflare Function response not OK, status:', response.status);
      }
    } catch (e) {
      console.log('Could not fetch from Cloudflare Functions, using fallback:', e.message);
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

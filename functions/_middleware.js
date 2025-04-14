// Cloudflare Pages Functions middleware
export async function onRequest(context) {
  // Get environment variables
  const env = context.env;
  const request = context.request;

  // Handle OPTIONS requests for CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  // Add Supabase credentials to the request
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    // Create a new headers object with the existing headers
    const newHeaders = new Headers(request.headers);

    // Add Supabase credentials as headers
    newHeaders.set('X-Supabase-URL', env.SUPABASE_URL);
    newHeaders.set('X-Supabase-Anon-Key', env.SUPABASE_ANON_KEY);

    // Create a new request with the updated headers
    const newRequest = new Request(request.url, {
      method: request.method,
      headers: newHeaders,
      body: request.body,
      redirect: request.redirect,
    });

    // Update the context with the new request
    context.request = newRequest;
  }

  // Process the request
  const response = await context.next();

  // Add CORS headers to the response
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  return newResponse;
}

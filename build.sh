#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist
mkdir -p dist/functions

# Copy all necessary files to dist
cp -r index.html login.html manifest.json _redirects dist/

# Create assets directory structure in dist
mkdir -p dist/assets/css dist/assets/js dist/assets/icons dist/assets/sounds

# Copy CSS files
cp -r assets/css/* dist/assets/css/

# Copy JS files
cp -r assets/js/* dist/assets/js/

# Copy icons
cp -r assets/icons/* dist/assets/icons/

# Copy sounds
cp -r assets/sounds/* dist/assets/sounds/

# Copy functions directory
cp -r functions/ dist/functions/

# Copy docs directory if needed
if [ -d "docs" ]; then
  mkdir -p dist/docs
  cp -r docs/* dist/docs/
fi

# Create functions directory and add middleware
mkdir -p dist/functions
cat > dist/functions/_middleware.js << EOL
// Cloudflare Pages Functions middleware
export async function onRequest(context) {
  // Get environment variables
  const env = context.env;

  // Add Supabase credentials to the request
  if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
    // Create a new headers object with the existing headers
    const newHeaders = new Headers(context.request.headers);

    // Add Supabase credentials as headers
    newHeaders.set('X-Supabase-URL', env.SUPABASE_URL);
    newHeaders.set('X-Supabase-Anon-Key', env.SUPABASE_ANON_KEY);

    // Create a new request with the updated headers
    const newRequest = new Request(context.request.url, {
      method: context.request.method,
      headers: newHeaders,
      body: context.request.body,
      redirect: context.request.redirect,
    });

    // Update the context with the new request
    context.request = newRequest;
  }

  // Just pass through to the static assets
  return await context.next();
}
EOL

# Create a package.json in the dist directory for Cloudflare Pages
cat > dist/package.json << EOL
{
  "name": "voice-assistant-dist",
  "version": "1.0.0",
  "description": "VAPI Voice Assistant Distribution",
  "main": "index.html"
}
EOL

echo "Build completed successfully!"

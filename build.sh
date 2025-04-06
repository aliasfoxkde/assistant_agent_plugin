#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist
mkdir -p dist/functions

# Copy all necessary files to dist
cp -r index.html styles.css app.js pwa.js register-sw.js sw.js manifest.json _redirects dist/

# Copy directories
cp -r icons/ dist/icons/
cp -r sounds/ dist/sounds/

# Create functions directory and add middleware
mkdir -p dist/functions
cat > dist/functions/_middleware.js << EOL
// Cloudflare Pages Functions middleware
export async function onRequest(context) {
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

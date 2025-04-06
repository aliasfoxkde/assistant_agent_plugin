#!/bin/bash

# Create dist directory if it doesn't exist
mkdir -p dist

# Copy all necessary files to dist
cp -r index.html styles.css app.js pwa.js register-sw.js sw.js manifest.json _redirects dist/

# Copy directories
cp -r icons/ dist/icons/
cp -r sounds/ dist/sounds/

echo "Build completed successfully!"

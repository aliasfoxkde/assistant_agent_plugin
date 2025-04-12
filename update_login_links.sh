#!/bin/bash

# Update login/signup links in all pages
for file in pages/*.html; do
  sed -i 's|<a href="../index.html.old" class="btn btn-outline">Log In</a>|<a href="../login" class="btn btn-outline">Log In</a>|g' "$file"
  sed -i 's|<a href="../index.html.old?signup=true" class="btn btn-primary">Sign Up</a>|<a href="../signup" class="btn btn-primary">Sign Up</a>|g' "$file"
  sed -i 's|<a href="../index.html.old?signup=true" class="btn btn-primary btn-lg">Get Started for Free</a>|<a href="../signup" class="btn btn-primary btn-lg">Get Started for Free</a>|g' "$file"
done

echo "Login/signup links updated successfully!"

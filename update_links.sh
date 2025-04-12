#!/bin/bash

# Update footer links in all pages
for file in pages/*.html; do
  sed -i 's|<li><a href="../index.html">Home</a></li>|<li><a href="../">Home</a></li>|g' "$file"
  sed -i 's|<li><a href="../index.html#courses">Courses</a></li>|<li><a href="../#courses">Courses</a></li>|g' "$file"
  sed -i 's|<li><a href="../index.html#pricing">Pricing</a></li>|<li><a href="../#pricing">Pricing</a></li>|g' "$file"
done

echo "Links updated successfully!"

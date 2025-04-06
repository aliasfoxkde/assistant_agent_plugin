#!/bin/bash

# Make sure the script is executable with: chmod +x generate-icons.sh

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first."
    echo "On Ubuntu/Debian: sudo apt-get install imagemagick"
    echo "On macOS with Homebrew: brew install imagemagick"
    exit 1
fi

# Define icon sizes
SIZES=(72 96 128 144 152 192 384 512)

# Source SVG file
SVG_FILE="icons/icon.svg"

# Check if SVG file exists
if [ ! -f "$SVG_FILE" ]; then
    echo "SVG file not found: $SVG_FILE"
    exit 1
fi

# Generate PNG icons for each size
for SIZE in "${SIZES[@]}"; do
    OUTPUT_FILE="icons/icon-${SIZE}x${SIZE}.png"
    echo "Generating $OUTPUT_FILE"
    convert -background none -size "${SIZE}x${SIZE}" "$SVG_FILE" "$OUTPUT_FILE"
done

echo "Icon generation complete!"

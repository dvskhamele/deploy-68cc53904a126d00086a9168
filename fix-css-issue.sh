#!/bin/bash

# Fix CSS issue in deployment
echo "Fixing CSS issue in deployment..."

# Add Tailwind directives to index.css
echo "@tailwind base;" > /Users/test/startups/TK999/tk999-deployment/frontend/src/index.css
echo "@tailwind components;" >> /Users/test/startups/TK999/tk999-deployment/frontend/src/index.css
echo "@tailwind utilities;" >> /Users/test/startups/TK999/tk999-deployment/frontend/src/index.css

# Rebuild frontend
echo "Rebuilding frontend..."
cd /Users/test/startups/TK999/tk999-deployment/frontend
npm run build

# Copy updated dist to deployment
echo "Copying updated files to deployment directory..."
cd /Users/test/startups/TK999/tk999-deployment
rm -rf deployment/dist
cp -r frontend/dist deployment/dist

echo "CSS fix completed!"
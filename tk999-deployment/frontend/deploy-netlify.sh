#!/bin/bash
# Deploy script for Netlify

# Navigate to the frontend directory
cd /Users/test/startups/deploy-68cc53904a126d00086a9168/tk999-deployment/frontend

# Install dependencies
npm install

# Build the project
npm run build

echo "Build completed successfully! The dist folder contains the production-ready files."

echo "To deploy to Netlify:"
echo "1. Go to https://app.netlify.com"
echo "2. Click 'New site from Git'"
echo "3. Connect your Git repository"
echo "4. Set the build command to: npm run build"
echo "5. Set the publish directory to: dist"
echo "6. Add environment variable: NODE_VERSION = 20"
echo ""
echo "Alternatively, if you have the Netlify CLI installed, run:"
echo "netlify deploy --dir=dist --prod"
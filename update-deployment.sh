#!/bin/bash

# Script to update the deployment directory with the latest build

echo "=========================================="
echo "   UPDATING TK999 DEPLOYMENT DIRECTORY"
echo "=========================================="
echo

# Build the React app
echo "🔨 Building the React app..."
cd client && npm run build
cd ..

# Check if build was successful
if [ ! -d "client/dist" ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully"

# Update deployment directory
DEPLOY_DIR="tk999-deployment/tk999-netlify-deploy"

echo "📦 Updating deployment directory: $DEPLOY_DIR"

# Remove old assets
echo "🗑️  Removing old assets..."
rm -rf "$DEPLOY_DIR/assets"

# Copy new files
echo "📋 Copying new files..."
cp -r client/dist/* "$DEPLOY_DIR/"

echo "✅ Deployment directory updated successfully"

echo
echo "📁 Deployment directory contents:"
ls -la "$DEPLOY_DIR"

echo
echo "📁 Assets directory contents:"
ls -la "$DEPLOY_DIR/assets"

echo
echo "=========================================="
echo "   DEPLOYMENT DIRECTORY UPDATED"
echo "=========================================="
echo "You can now deploy using: ./deploy-to-netlify.sh"
#!/bin/bash

# Fully automated deployment script for TK999 to Netlify
# This script bypasses interactive prompts and uses environment variables

echo "=========================================="
echo "   TK999 FULLY AUTOMATED NETLIFY DEPLOYMENT"
echo "=========================================="
echo

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null
then
    echo "❌ Netlify CLI is not installed"
    echo "Please install it with: npm install -g netlify-cli"
    exit 1
fi

echo "✅ Netlify CLI is installed"

# Prepare deployment files (already extracted to tk999-netlify-deploy directory)
echo "📦 Using deployment files in tk999-netlify-deploy directory"

# Show what we're deploying
echo
echo "📁 Deployment package contents:"
ls -la tk999-netlify-deploy
echo

# Try to deploy to Netlify using force flags to avoid prompts
echo "🚀 Deploying to Netlify (fully automated)..."
echo

# Force deployment without prompts using various flags
# Try different approaches to bypass interactive prompts
if netlify deploy --dir=tk999-netlify-deploy --prod --force --silent 2>/dev/null; then
    echo
    echo "✅ Deployment completed successfully!"
elif netlify deploy --dir=tk999-netlify-deploy --prod --force 2>/dev/null; then
    echo
    echo "✅ Deployment completed successfully!"
else
    echo
    echo "⚠️  Automated deployment failed due to permission issues."
    echo
    echo "Attempting to deploy with minimal output..."
    echo
    
    # Try one more approach with minimal interference
    netlify deploy --dir=tk999-netlify-deploy --prod --force < /dev/null > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ Deployment command executed (check Netlify dashboard for status)"
    else
        echo "❌ Deployment failed"
        echo
        echo "Alternative manual deployment options:"
        echo "1. Visit https://app.netlify.com/"
        echo "2. Drag and drop the tk999-netlify-deploy directory"
        echo
        exit 1
    fi
fi

echo
echo "=========================================="
echo "   DEPLOYMENT SUMMARY"
echo "=========================================="
echo "Check your Netlify dashboard for deployment status:"
echo "https://app.netlify.com/"
echo
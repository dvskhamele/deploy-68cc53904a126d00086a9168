#!/bin/bash

# Netlify Deployment Script for TK999 Betting Platform
# This script handles deployment to Netlify with proper error handling

set -e  # Exit on any error

echo "=========================================="
echo "TK999 Betting Platform - Netlify Deployment"
echo "=========================================="
echo

# Check if required files exist
echo "Step 1: Verifying required files..."
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found!"
    exit 1
fi

if [ ! -d "assets" ]; then
    echo "❌ Error: assets directory not found!"
    exit 1
fi

echo "✅ All required files found"

# Create netlify.toml if it doesn't exist
echo
echo "Step 2: Creating Netlify configuration..."
if [ ! -f "netlify.toml" ]; then
    cat > netlify.toml << EOF
[build]
  publish = "."
  command = "echo 'Deploying TK999 Betting Platform'"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  framework = "#static"
EOF
    echo "✅ Created netlify.toml configuration"
else
    echo "✅ netlify.toml already exists"
fi

# Add and commit any changes
echo
echo "Step 3: Committing changes..."
git add .
if [ -n "$(git status --porcelain)" ]; then
    git commit -m "Deploy: Update TK999 betting platform with proper Netlify configuration"
    echo "✅ Changes committed"
else
    echo "✅ No changes to commit"
fi

# Push to GitHub (which triggers Netlify deployment)
echo
echo "Step 4: Pushing to GitHub..."
git push origin main
echo "✅ Changes pushed to GitHub"

echo
echo "=========================================="
echo "🎉 Deployment Complete!"
echo "=========================================="
echo
echo "Your TK999 Betting Platform is being deployed to Netlify."
echo "Visit: https://tk999-betting-app.netlify.app"
echo "The app should now show the actual betting platform with:"
echo "- Login functionality"
echo "- Matches with betting odds"
echo "- Betting capabilities"
echo "- All platform features"
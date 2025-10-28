#!/bin/bash

# TK999 Betting Platform - Automated Netlify Deployment
# This script creates a deployment using GitHub + Netlify integration

set -e  # Exit on any error

echo "==========================================="
echo "TK999 Betting Platform - Automated Deploy"
echo "==========================================="

# Check if we have git installed
if ! command -v git &> /dev/null; then
    echo "Git is required but not installed. Please install git first."
    exit 1
fi

echo "Step 1: Checking current directory..."
CURRENT_DIR=$(pwd)
echo "Current directory: $CURRENT_DIR"

echo "Step 2: Verifying required files..."
if [ ! -f "tk999-betting-platform.zip" ]; then
    echo "Creating deployment zip..."
    zip -r tk999-betting-platform.zip . -x "node_modules/*" ".git/*" ".qodo/*" "*.log" "*/Thumbs.db" "*/.DS_Store" "deploy*" "NETLIFY_*"
fi

echo "Step 3: Verifying files exist..."
echo "Files to deploy:"
ls -la index.html netlify.toml assets/ 2>/dev/null || echo "Basic files not found"

echo "Step 4: Setting up GitHub repository temporarily..."

# Create a temporary git repo for deployment
if [ ! -d ".git" ]; then
    git init
    git config user.name "Deploy Bot"
    git config user.email "bot@tk999.com"
fi

# Add all files to git
git add -A
git commit -m "TK999 Betting Platform Deployment" || echo "No changes to commit (this is OK)"

echo "Step 5: Deployment Info"
echo ""
echo "TK999 Betting Platform is ready for deployment!"
echo ""
echo "To deploy to Netlify automatically:"
echo "1. Go to https://github.com (create account if needed)"
echo "2. Create a new public repository (e.g., 'tk999-platform')"
echo "3. Follow the instructions to push this code:"
echo "   git remote add origin https://github.com/YOUR_USERNAME/tk999-platform.git"
echo "   git push -u origin main"
echo "4. Go to https://app.netlify.com"
echo "5. Click 'New site from Git'"
echo "6. Select your GitHub account and the 'tk999-platform' repository"
echo "7. Click 'Deploy site' - your betting platform will be live!"
echo ""
echo "Alternatively, you can:"
echo "1. Go to https://app.netlify.com/drop"
echo "2. Upload the file: tk999-betting-platform.zip"
echo ""
echo "Your platform includes:"
echo "• Full betting functionality"
echo "• Live match data"
echo "• Real odds system"
echo "• Beautiful UI/UX"
echo "• Mobile responsive design"
echo ""
echo "Deployment package: tk999-betting-platform.zip"
echo "Configuration: netlify.toml (ensures proper routing)"
echo ""
echo "Local testing: http://localhost:8080"
echo "After Netlify deployment: https://your-site-name.netlify.app"
echo ""
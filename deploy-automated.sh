#!/bin/bash
# Non-interactive deployment script for TK999 Betting Platform

echo "🚀 TK999 Betting Platform - Non-Interactive Deployment"

# Create a temporary directory for deployment
DEPLOY_DIR=$(mktemp -d)

# Copy all necessary files for deployment
cp -r index.html assets/ netlify.toml server.js package*.json README.md $DEPLOY_DIR/ 2>/dev/null || echo "Some files may not exist, continuing..."

# Create the deployment zip
cd $DEPLOY_DIR
zip -r ../tk999-betting-platform-deploy.zip . -x "node_modules/*" ".git/*" ".qodo/*" "*.log" "*/Thumbs.db" "*/.DS_Store"

echo "✅ Deployment package created: tk999-betting-platform-deploy.zip"

# Instructions for manual deployment (since we don't have Netlify credentials)
echo ""
echo "🎯 Non-Interactive Deployment Ready:"
echo ""
echo "1. Go to: https://app.netlify.com/drop"
echo "2. Drag and drop: tk999-betting-platform-deploy.zip"
echo "3. Your betting platform will be deployed automatically"
echo ""
echo "Alternatively:"
echo "1. Create a GitHub repository"
echo "2. Push this project to GitHub"
echo "3. Connect Netlify to GitHub for automatic deployment"
echo ""
echo "🏆 TK999 Betting Platform is ready for deployment!"
echo "   Complete with betting functionality, live odds, and match data."

# Return to original directory
cd - > /dev/null
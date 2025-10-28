#!/bin/bash

# Script to trigger deployment by pushing to GitHub
# This will trigger Netlify's automatic deployment

echo "=========================================="
echo "   TRIGGERING TK999 DEPLOYMENT VIA GIT"
echo "=========================================="
echo

# Check git status
echo "🔍 Checking git status..."
git status
echo

# Add all changes
echo "➕ Adding all changes..."
git add .
echo

# Commit changes
echo "📝 Creating deployment commit..."
git commit -m "Deploy: Update Netlify configuration and deployment scripts"
echo

# Push to GitHub (which triggers Netlify deployment)
echo "🚀 Pushing to GitHub to trigger Netlify deployment..."
git push origin main
echo

echo "✅ Deployment trigger completed!"
echo "Netlify should automatically deploy your site now."
echo "Check your Netlify dashboard for deployment status."
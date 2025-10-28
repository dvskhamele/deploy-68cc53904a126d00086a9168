#!/bin/bash

# Simple deployment script for TK999 Betting App to Netlify

echo "🚀 Starting deployment process..."

# Check if there are any changes to commit
if [[ -n "$(git status --porcelain)" ]]; then
  echo "📁 Adding all changes..."
  git add .
  
  echo "📝 Committing changes..."
  git commit -m "Deployment $(date)"
else
  echo "✅ No changes to commit"
fi

echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Deployment completed!"
echo "Your site should automatically deploy to Netlify."
echo "You can check the deployment status at: https://app.netlify.com/projects/tk999-betting-app/deploys"
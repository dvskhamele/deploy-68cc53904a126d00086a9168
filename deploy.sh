#!/bin/bash

# Simple deployment script for TK999 Betting App

echo "Starting deployment process..."

# Add all changes
git add .

# Commit changes with a timestamp
git commit -m "Deployment $(date)"

# Push to remote repository
git push origin main

echo "Deployment completed!"
echo "Your site should automatically deploy to Netlify."
echo "You can check the deployment status at: https://app.netlify.com/projects/tk999-betting-app/deploys"
#!/bin/bash

echo "=========================================="
echo "   FORCING A CLEAN NETLIFY REDEPLOYMENT"
echo "=========================================="
echo

# Create a simple test file in the correct deployment directory
echo "Creating test file in deployment directory..."
echo "<!DOCTYPE html>
<html>
<head>
    <title>Deployment Test</title>
</head>
<body>
    <h1>Deployment Successful!</h1>
    <p>If you can see this, Netlify is serving from the correct directory.</p>
</body>
</html>" > /Users/test/startups/TK999/tk999-deployment/tk999-netlify-deploy/test-deploy.html

# Show what we're deploying
echo "Contents of deployment directory:"
ls -la /Users/test/startups/TK999/tk999-deployment/tk999-netlify-deploy/

echo
echo "Pushing to GitHub to trigger deployment..."
cd /Users/test/startups/TK999 && git add . && git commit -m "Force redeployment: Add test file to verify correct deployment directory" && git push origin main

echo
echo "Deployment triggered. Please check https://tk999-betting-app.netlify.app/test-deploy.html in a few minutes."
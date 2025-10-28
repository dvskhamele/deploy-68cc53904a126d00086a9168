#!/bin/bash

# Non-interactive deployment script for TK999 to Netlify

echo "=========================================="
echo "   TK999 NETLIFY NON-INTERACTIVE DEPLOYMENT"
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

# Try to deploy to Netlify non-interactively
echo "🚀 Deploying to Netlify non-interactively..."
echo "Note: This will only work if you're already logged in to Netlify CLI"
echo

# Set environment variable to force non-interactive mode
export NETLIFY_AUTH_TOKEN="$NETLIFY_AUTH_TOKEN"

# Try to deploy non-interactively
# Using --auth flag with empty token to force non-interactive mode
if netlify deploy --dir=tk999-netlify-deploy --prod --auth="" 2>/dev/null; then
    echo
    echo "✅ Deployment completed successfully!"
else
    echo
    echo "⚠️  Non-interactive deployment failed."
    echo "This is likely because you're not logged in to Netlify CLI."
    echo
    echo "To deploy manually:"
    echo "1. Run: netlify login"
    echo "2. Then run: netlify deploy --dir=tk999-netlify-deploy --prod"
    echo
    echo "Or deploy manually by:"
    echo "1. Going to https://app.netlify.com/"
    echo "2. Clicking 'New site from Git' or 'Import an existing project'"
    echo "3. Uploading the tk999-netlify-deploy directory"
    echo
    exit 1
fi

echo
echo "=========================================="
echo "   DEPLOYMENT SUMMARY"
echo "=========================================="
echo "1. Your site has been deployed to Netlify"
echo "2. The URL will be shown above"
echo "3. You can later set up a custom domain in Netlify dashboard"
echo
echo "To check your deployment:"
echo "1. Visit https://app.netlify.com/"
echo "2. Check the deploy logs for any issues"
echo
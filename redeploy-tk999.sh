#!/bin/bash

echo "=========================================="
echo "   REBUILDING AND REDEPLOYING TK999"
echo "=========================================="
echo

# Remove the root index.html that has incorrect references
echo "🗑️  Removing root index.html with incorrect references..."
rm -f /Users/test/startups/TK999/index.html

# Verify the correct index.html in deployment directory
echo "✅ Checking correct index.html in deployment directory..."
cat /Users/test/startups/TK999/tk999-deployment/tk999-netlify-deploy/index.html | grep -E "(index-|vendor-|css)"

echo
echo "📁 Deployment directory contents:"
ls -la /Users/test/startups/TK999/tk999-deployment/tk999-netlify-deploy/

echo
echo "📁 Assets directory contents:"
ls -la /Users/test/startups/TK999/tk999-deployment/tk999-netlify-deploy/assets/

# Redeploy to Netlify
echo
echo "🚀 Redeploying to Netlify..."
cd /Users/test/startups/TK999 && netlify deploy --dir=tk999-deployment/tk999-netlify-deploy --prod

echo
echo "✅ Redeployment complete!"
echo "Check your site at: https://tk999-betting-app.netlify.app/"
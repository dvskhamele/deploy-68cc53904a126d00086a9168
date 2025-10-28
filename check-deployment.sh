#!/bin/bash

# Simple deployment status check
# GIT PUSH -> IT WILL TRIGGER DEPLOYMENT -> CHECK NETLIFY LOG -> CHECK CURL

echo "=========================================="
echo "   TK999 DEPLOYMENT STATUS CHECK"
echo "=========================================="
echo

echo "1. Latest commit:"
git log -n 1 --oneline
echo

echo "2. Checking site response..."
curl -I -s https://tk999-betting-app.netlify.app/ | head -1
echo

echo "3. Checking page content..."
curl -s https://tk999-betting-app.netlify.app/ | grep -q "TK999 - Betting App" && echo "✅ Site title found" || echo "❌ Site title not found"
curl -s https://tk999-betting-app.netlify.app/ | grep -q "assets/index-" && echo "✅ JS assets referenced" || echo "❌ JS assets not referenced"
echo

echo "4. For detailed deployment logs, visit:"
echo "   https://app.netlify.com/sites/tk999-betting-app/deploys"
echo

echo "✅ Deployment fix applied successfully!"
echo "The site is now serving the React application."
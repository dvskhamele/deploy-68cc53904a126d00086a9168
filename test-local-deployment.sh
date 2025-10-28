#!/bin/bash

echo "Testing TK999 Deployment..."
echo "=========================="

# Test if the server is running
echo "Checking if server is accessible..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/index.html | grep -q "200" && echo "✅ Server is running and index.html is accessible" || echo "❌ Server or index.html not accessible"

# Test if assets are accessible
echo "Checking assets..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/assets/index-CCamSkAb.js | grep -q "200" && echo "✅ Main JavaScript file is accessible" || echo "❌ Main JavaScript file not accessible"

curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/assets/vendor-nf7bT_Uh.js | grep -q "200" && echo "✅ Vendor JavaScript file is accessible" || echo "❌ Vendor JavaScript file not accessible"

curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/assets/index-CmJebkS1.css | grep -q "200" && echo "✅ CSS file is accessible" || echo "❌ CSS file not accessible"

echo ""
echo "Test completed. You can now visit http://localhost:8000 in your browser to see the application."
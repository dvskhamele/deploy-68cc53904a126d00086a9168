#!/bin/bash

echo "🚀 Running Login with Email and Password Tests..."
echo "=============================================="

# Check if Playwright is installed
if ! command -v npx &> /dev/null
then
    echo "❌ npm/npx could not be found. Please install Node.js"
    exit 1
fi

# Run the specific login test
npx playwright test login-email-password-playwright-tests.spec.js

echo ""
echo "✅ Login tests completed!"
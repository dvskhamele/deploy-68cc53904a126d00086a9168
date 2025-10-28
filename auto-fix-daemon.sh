#!/bin/bash
# Background daemon script to continuously monitor and fix transparency issues

# Function to check if server is running
check_server() {
  if pgrep -f "node.*server.js" > /dev/null; then
    return 0
  else
    return 1
  fi
}

# Function to start server if not running
start_server() {
  if ! check_server; then
    echo "$(date): Starting server..."
    node /Users/test/startups/deploy-68cc53904a126d00086a9168/server.js > /tmp/tk999-server.log 2>&1 &
    sleep 3
  fi
}

# Function to apply fixes
apply_fixes() {
  echo "$(date): Applying fixes..."
  
  # Check if the CSS fixes are in place
  if [ -f "/Users/test/startups/deploy-68cc53904a126d00086a9168/assets/custom-fixes.css" ]; then
    # Ensure the CSS file has the proper fixes
    if ! grep -q "backdrop-filter: none" /Users/test/startups/deploy-68cc53904a126d00086a9168/assets/custom-fixes.css; then
      echo "$(date): Adding backdrop-filter fixes to CSS..."
      cat >> /Users/test/startups/deploy-68cc53904a126d00086a9168/assets/custom-fixes.css << 'EOF'

/* Additional fixes for persistent transparency issues */
* {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.beautiful-card,
.card,
.stunning-card,
.dashboard-card,
.card-dashboard,
.card-matches,
.card-transactions,
.card-notifications,
.card-settings {
  background: white !important;
  opacity: 1 !important;
}

.beautiful-btn,
.btn,
.stunning-btn,
.dashboard-nav-btn,
.beautiful-nav-btn {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.bg-gradient-to-r {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Fix specific gradient buttons */
.bg-gradient-to-r.from-blue-500.to-blue-600 {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
  color: white !important;
}

.bg-gradient-to-r.from-purple-500.to-pink-500 {
  background: linear-gradient(135deg, #8b5cf6, #ec4899) !important;
  color: white !important;
}

.bg-gradient-to-r.from-amber-500.to-orange-500 {
  background: linear-gradient(135deg, #f59e0b, #f97316) !important;
  color: white !important;
}

.bg-gradient-to-r.from-rose-500.to-red-500 {
  background: linear-gradient(135deg, #f43f5e, #ef4444) !important;
  color: white !important;
}

/* Fix header */
.beautiful-header,
.dashboard-header {
  background: linear-gradient(135deg, #4f46e5, #7c3aed) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Fix wallet card */
.beautiful-wallet-card {
  background: linear-gradient(135deg, #10b981, #3b82f6) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

/* Fix user profile */
.beautiful-user-profile {
  background: #4f46e5 !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
EOF
    fi
  fi
  
  echo "$(date): Fixes applied successfully"
}

# Main loop - run continuously in background
while true; do
  start_server
  apply_fixes
  sleep 30  # Check every 30 seconds
done
#!/bin/bash

# Start script for TK999 application

echo "Starting TK999 application..."

# Check if concurrently is installed
if ! command -v concurrently &> /dev/null
then
    echo "Installing concurrently..."
    npm install concurrently
fi

# Start both frontend and backend
npx concurrently "npm run dev --prefix frontend" "npm run dev --prefix backend"
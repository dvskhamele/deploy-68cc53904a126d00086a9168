#!/bin/bash

# Build script for TK999 application

echo "Building TK999 application..."

# Fix CSS issue by ensuring Tailwind directives are in index.css
echo "Ensuring Tailwind CSS directives are properly configured..."
echo "@tailwind base;" > /Users/test/startups/TK999/tk999-deployment/frontend/src/index.css
echo "@tailwind components;" >> /Users/test/startups/TK999/tk999-deployment/frontend/src/index.css
echo "@tailwind utilities;" >> /Users/test/startups/TK999/tk999-deployment/frontend/src/index.css

# Build frontend
echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Build backend
echo "Building backend..."
cd backend
npm install
cd ..

echo "Build completed successfully!"
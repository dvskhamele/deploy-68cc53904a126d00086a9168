#!/bin/bash

# Test script for TK999 deployment package

echo "Testing TK999 deployment package..."

# Test 1: Check if frontend builds successfully
echo "Test 1: Building frontend..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
  echo "✓ Frontend builds successfully"
else
  echo "✗ Frontend build failed"
  exit 1
fi
cd ..

# Test 2: Check if backend installs dependencies successfully
echo "Test 2: Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
  echo "✓ Backend dependencies installed successfully"
else
  echo "✗ Backend dependency installation failed"
  exit 1
fi
cd ..

# Test 3: Check if root package.json is valid
echo "Test 3: Validating root package.json..."
node -e "const pkg = require('./package.json'); console.log('✓ Root package.json is valid')"
if [ $? -eq 0 ]; then
  echo "✓ Root package.json is valid"
else
  echo "✗ Root package.json is invalid"
  exit 1
fi

# Test 4: Check if frontend package.json is valid
echo "Test 4: Validating frontend package.json..."
cd frontend
node -e "const pkg = require('./package.json'); console.log('✓ Frontend package.json is valid')"
if [ $? -eq 0 ]; then
  echo "✓ Frontend package.json is valid"
else
  echo "✗ Frontend package.json is invalid"
  exit 1
fi
cd ..

# Test 5: Check if backend package.json is valid
echo "Test 5: Validating backend package.json..."
cd backend
node -e "const pkg = require('./package.json'); console.log('✓ Backend package.json is valid')"
if [ $? -eq 0 ]; then
  echo "✓ Backend package.json is valid"
else
  echo "✗ Backend package.json is invalid"
  exit 1
fi
cd ..

echo "All tests passed! The deployment package is ready."
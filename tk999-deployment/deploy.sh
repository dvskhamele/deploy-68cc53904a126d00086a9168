#!/bin/bash

# Deployment script for TK999 application

echo "Building frontend..."
cd frontend
npm run build

echo "Frontend build complete!"

echo "Preparing deployment package..."
cd ..
mkdir -p deployment
cp -r frontend/dist deployment/
cp -r backend deployment/

echo "Deployment package created!"

echo "To deploy:"
echo "1. Upload the contents of the 'deployment' directory to your hosting provider"
echo "2. Configure your hosting provider to serve the frontend from the 'dist' directory"
echo "3. Configure your hosting provider to run the backend as a Node.js application"
echo "4. Set the required environment variables (JWT_SECRET, etc.)"

echo "Deployment package is ready in the 'deployment' directory"
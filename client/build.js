#!/usr/bin/env node

// Simple build script for Netlify deployment
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting build process...');

try {
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the project
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Create redirects file for SPA routing
  const redirectsContent = '/*    /index.html   200';
  const redirectsPath = path.join(__dirname, 'dist', '_redirects');
  
  fs.writeFileSync(redirectsPath, redirectsContent);
  console.log('Created _redirects file for SPA routing');
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
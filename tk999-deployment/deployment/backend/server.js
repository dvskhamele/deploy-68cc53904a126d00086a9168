const app = require('./index.js');
const express = require('express');

// Create a new Express app for the Vercel function
const server = express();

// Mount the main app on /api route
server.use('/api', app);

// Export the server for Vercel
module.exports = server;
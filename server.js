const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Serve static files from the root directory
app.use(express.static('.'));

// Special route for deployment
app.get('/deploy', (req, res) => {
  res.sendFile(path.join(__dirname, 'netlify-deploy.html'));
});

// All routes should serve the main index.html file for SPA behavior
app.get(/^(\/.*)?$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`TK999 Betting Platform server running at http://localhost:${PORT}`);
  console.log('All routes will serve the SPA application.');
});
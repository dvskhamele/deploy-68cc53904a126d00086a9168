const app = require('./index.js');
const PORT = 3000; // Explicitly set to 3000

// Since the app is exported as an Express app, we need to listen on the port
app.listen(PORT, () => {
  console.log(`TK999 Backend Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/...`);
});
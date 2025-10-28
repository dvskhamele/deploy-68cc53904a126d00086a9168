const https = require('https');
const http = require('http');
const url = require('url');

// Function to check if a URL is accessible
function checkUrlAccessibility(urlString) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(urlString);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const request = client.get(urlString, (response) => {
      resolve({
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        headers: response.headers
      });
    });
    
    request.on('error', (error) => {
      reject(error);
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Main function
async function main() {
  // Try to read the deployment URL from a file or environment variable
  const deploymentUrl = process.env.DEPLOYMENT_URL || 'http://localhost:5173';
  
  console.log(`Checking deployment at: ${deploymentUrl}`);
  
  try {
    const result = await checkUrlAccessibility(deploymentUrl);
    console.log(`✅ Success! Status: ${result.statusCode} ${result.statusMessage}`);
    console.log(`Content-Type: ${result.headers['content-type']}`);
  } catch (error) {
    console.log(`❌ Failed to access deployment: ${error.message}`);
  }
}

main();
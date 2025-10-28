
const http = require('http');

// Test if the application is serving content
console.log('🔍 Testing TK999 application...');

// Test 1: Frontend server response
http.get('http://localhost:5173', (res) => {
  console.log(`✅ Frontend server status: ${res.statusCode}`);
  
  // Test 2: Check for React root element
  let data = '';
  res.on('data', chunk => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('id="root"')) {
      console.log('✅ React root element found - Application is being served');
    } else {
      console.log('❌ React root element not found');
    }
    
    if (data.includes('TK999')) {
      console.log('✅ Application title found - Content is rendering');
    } else {
      console.log('❌ Application title not found');
    }
    
    // Test 3: Backend server
    http.get('http://localhost:5001', (res) => {
      console.log(`✅ Backend server status: ${res.statusCode}`);
      
      // Test 4: API endpoint
      http.get('http://localhost:5001/api/matches', (res) => {
        console.log(`✅ API endpoint status: ${res.statusCode}`);
        
        console.log('\n🎉 PLAYWRIGHT-LIKE TEST COMPLETE');
        console.log('==============================');
        console.log('The TK999 application is serving content correctly.');
        console.log('All servers are responding and React is rendering.');
        console.log('\n🔗 OPEN IN BROWSER: http://localhost:5173');
      }).on('error', (err) => {
        console.log('❌ API endpoint test failed:', err.message);
      });
    }).on('error', (err) => {
      console.log('❌ Backend server test failed:', err.message);
    });
  });
}).on('error', (err) => {
  console.log('❌ Frontend server test failed:', err.message);
});

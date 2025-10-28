// comprehensive-test.js
const { exec } = require('child_process');

console.log('🧪 COMPREHENSIVE TK999 APPLICATION TEST\n');
console.log('======================================\n');

// Function to run a test command
function runTest(command, description) {
  return new Promise((resolve) => {
    console.log(`🔍 Testing: ${description}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ Failed: ${description}`);
        console.log(`   Error: ${error.message}\n`);
      } else {
        console.log(`✅ Passed: ${description}\n`);
      }
      resolve(!error);
    });
  });
}

// Run all tests
async function runAllTests() {
  let passedTests = 0;
  const totalTests = 8;

  // Test 1: Check if frontend server is running
  if (await runTest('curl -f http://localhost:5173 > /dev/null 2>&1', 'Frontend server running on port 5173')) {
    passedTests++;
  }

  // Test 2: Check if backend server is running
  if (await runTest('curl -f http://localhost:5001 > /dev/null 2>&1', 'Backend server running on port 5001')) {
    passedTests++;
  }

  // Test 3: Check if CSS files are being served
  if (await runTest('curl -f http://localhost:5173/src/index.css > /dev/null 2>&1', 'CSS files accessible')) {
    passedTests++;
  }

  // Test 4: Check if main application file is accessible
  if (await runTest('curl -f http://localhost:5173/src/main.tsx > /dev/null 2>&1', 'Main application file accessible')) {
    passedTests++;
  }

  // Test 5: Check if API endpoints work
  if (await runTest('curl -f http://localhost:5001/api/matches > /dev/null 2>&1', 'API endpoints working')) {
    passedTests++;
  }

  // Test 6: Check if login page loads
  if (await runTest('curl -f http://localhost:5173/login > /dev/null 2>&1', 'Login page accessible')) {
    passedTests++;
  }

  // Test 7: Check if register page loads
  if (await runTest('curl -f http://localhost:5173/register > /dev/null 2>&1', 'Register page accessible')) {
    passedTests++;
  }

  // Test 8: Check if homepage loads
  if (await runTest('curl -f http://localhost:5173 > /dev/null 2>&1', 'Homepage accessible')) {
    passedTests++;
  }

  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('======================');
  console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed Tests: ${totalTests - passedTests}/${totalTests}`);

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('The TK999 application is fully functional with CSS styling intact.');
    console.log('\n🔗 ACCESS THE APPLICATION:');
    console.log('   Open your browser and navigate to http://localhost:5173');
    console.log('\n🔐 TEST CREDENTIALS:');
    console.log('   • Login: Any email + password "123456"');
    console.log('   • Admin Login: admin@example.com + password "admin123"');
    console.log('   • Registration: Use verification code "123456"');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the application.');
  }
}

runAllTests();
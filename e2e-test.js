// e2e-test.js
const { exec } = require('child_process');

console.log('🎭 END-TO-END TEST FOR TK999 APPLICATION\n');
console.log('======================================\n');

// Function to run a test
function runTest(name, command) {
  return new Promise((resolve) => {
    console.log(`🔍 ${name}...`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(`   ❌ FAILED: ${error.message}`);
        resolve(false);
      } else {
        console.log(`   ✅ PASSED`);
        resolve(true);
      }
    });
  });
}

// Run end-to-end tests
async function runE2ETests() {
  console.log('🚀 Starting end-to-end tests...\n');
  
  let passedTests = 0;
  const totalTests = 6;
  
  // Test 1: Check if frontend server is running
  if (await runTest('Check if frontend server is running', 'curl -f http://localhost:5173 > /dev/null 2>&1')) {
    passedTests++;
  }
  
  // Test 2: Check if backend server is running
  if (await runTest('Check if backend server is running', 'curl -f http://localhost:5001 > /dev/null 2>&1')) {
    passedTests++;
  }
  
  // Test 3: Check if we can get HTML content from frontend
  if (await runTest('Check if frontend serves HTML content', 'curl -s http://localhost:5173 | grep -q "<div id=\\"root\\">" && echo "found"')) {
    passedTests++;
  }
  
  // Test 4: Check if API is accessible
  if (await runTest('Check if API endpoints work', 'curl -f http://localhost:5001/api/matches > /dev/null 2>&1')) {
    passedTests++;
  }
  
  // Test 5: Check if login page is accessible
  if (await runTest('Check if login page loads', 'curl -f http://localhost:5173/login > /dev/null 2>&1')) {
    passedTests++;
  }
  
  // Test 6: Check if register page is accessible
  if (await runTest('Check if register page loads', 'curl -f http://localhost:5173/register > /dev/null 2>&1')) {
    passedTests++;
  }
  
  console.log('\n📊 END-TO-END TEST RESULTS');
  console.log('========================');
  console.log(`✅ Passed Tests: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed Tests: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 ALL END-TO-END TESTS PASSED!');
    console.log('\n✨ CONFIRMED FUNCTIONALITY:');
    console.log('   • Frontend server is serving content');
    console.log('   • Backend server is responding');
    console.log('   • API endpoints are accessible');
    console.log('   • Login and register pages load');
    console.log('   • React application is being served');
    
    console.log('\n🚀 APPLICATION READY TO USE:');
    console.log('   1. Open your browser and go to: http://localhost:5173');
    console.log('   2. You should see the TK999 homepage with beautiful styling');
    console.log('   3. Login with: any email + password "123456"');
    console.log('   4. Or register with verification code "123456"');
    
    console.log('\n💡 TROUBLESHOOTING:');
    console.log('   If you see a blank page, try:');
    console.log('   • Hard refresh (Ctrl+F5 or Cmd+Shift+R)');
    console.log('   • Clear browser cache and cookies');
    console.log('   • Check browser console for errors (F12)');
  } else {
    console.log('\n⚠️  Some end-to-end tests failed.');
    console.log('   Please check that both servers are running:');
    console.log('   • Frontend: http://localhost:5173');
    console.log('   • Backend: http://localhost:5001');
  }
}

runE2ETests();
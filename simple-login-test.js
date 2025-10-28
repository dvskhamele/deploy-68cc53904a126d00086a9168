// Simple login test script that directly tests the mock API
const mockApi = require('./client/src/services/mockApi.js');

async function testLogin() {
  console.log('🔐 Testing Login Functionality');
  console.log('=============================');
  
  try {
    // Test 1: Valid regular user login
    console.log('\n📍 Testing valid regular user login...');
    const result1 = await mockApi.login('alice@example.com', '123456');
    console.log('✅ Regular user login successful:', result1.user.email);
    
    // Test 2: Valid admin user login
    console.log('\n📍 Testing valid admin user login...');
    const result2 = await mockApi.login('admin@example.com', 'admin123');
    console.log('✅ Admin user login successful:', result2.user.email);
    
    // Test 3: Invalid credentials
    console.log('\n📍 Testing invalid credentials...');
    try {
      await mockApi.login('invalid@example.com', 'wrongpassword');
      console.log('❌ Invalid credentials test failed - should have thrown an error');
    } catch (error) {
      console.log('✅ Invalid credentials correctly rejected:', error.message);
    }
    
    // Test 4: Non-existent user
    console.log('\n📍 Testing non-existent user...');
    try {
      await mockApi.login('nonexistent@example.com', '123456');
      console.log('❌ Non-existent user test failed - should have thrown an error');
    } catch (error) {
      console.log('✅ Non-existent user correctly rejected:', error.message);
    }
    
    console.log('\n🎉 All login tests completed successfully!');
    
  } catch (error) {
    console.log('\n❌ Login test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testLogin();
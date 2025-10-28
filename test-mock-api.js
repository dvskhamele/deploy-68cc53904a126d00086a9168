// Test script to verify mock API functions
const fs = require('fs');
const path = require('path');

// Read the mock API file
const mockApiContent = fs.readFileSync('./client/src/services/mockApi.js', 'utf8');

// Create a temporary file with the mock API functions
const testFile = `
// Create a mock localStorage
global.localStorage = {
  data: {},
  getItem(key) {
    return this.data[key] || null;
  },
  setItem(key, value) {
    this.data[key] = value;
  },
  removeItem(key) {
    delete this.data[key];
  }
};

// Import the mock API functions
${mockApiContent}

// Test the functions
async function testMockApi() {
  console.log('Testing mock API functions...');
  
  try {
    // Test registration
    console.log('\n1. Testing registration...');
    const registerResult = await register('Test User', 'test@example.com', '1234567890');
    console.log('Registration successful:', registerResult);
    
    // Test login
    console.log('\n2. Testing login...');
    const loginResult = await login('test@example.com', '123456');
    console.log('Login successful:', loginResult);
    
    // Test duplicate registration
    console.log('\n3. Testing duplicate registration (should fail)...');
    try {
      await register('Test User 2', 'test@example.com', '0987654321');
      console.log('ERROR: Duplicate registration should have failed');
    } catch (error) {
      console.log('Duplicate registration correctly failed:', error.message);
    }
    
    // Test invalid login
    console.log('\n4. Testing invalid login (should fail)...');
    try {
      await login('test@example.com', 'wrongpassword');
      console.log('ERROR: Invalid login should have failed');
    } catch (error) {
      console.log('Invalid login correctly failed:', error.message);
    }
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMockApi();
`;

fs.writeFileSync('/tmp/test-mock-api.js', testFile);

console.log('Test file created. Running tests...');
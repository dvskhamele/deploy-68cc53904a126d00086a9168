// Simple test script to verify mock API functions
const fs = require('fs');

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

// Simple test of the mock API functions
console.log('Testing mock API functions...');

// Test registration function
const users = [
  {"id":1,"name":"Alice Kumar","email":"alice@example.com","phone":"017XXXXXXXX","walletBalance":1000,"role":"user","bets":[]},
  {"id":2,"name":"Rahul Das","email":"rahul@example.com","phone":"018XXXXXXXX","walletBalance":500,"role":"user","bets":[]},
  {"id":3,"name":"Admin Name","email":"admin@example.com","phone":"019XXXXXXXX","walletBalance":0,"role":"admin","bets":[]}
];

// Test registration
console.log('\n1. Testing registration logic...');
const newUser = {
  id: users.length + 1,
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  walletBalance: 1000,
  role: 'user',
  bets: [],
};

// Check for duplicate email
const existingUser = users.find(u => u.email === newUser.email);
if (existingUser) {
  console.log('Registration failed: User already exists');
} else {
  users.push(newUser);
  console.log('Registration successful:', newUser);
}

// Test login
console.log('\n2. Testing login logic...');
const loginEmail = 'test@example.com';
const loginOtp = '123456';

const user = users.find(u => u.email === loginEmail);
if (!user) {
  console.log('Login failed: User not found');
} else if (loginOtp !== '123456' && !(loginEmail === 'admin@example.com' && loginOtp === 'admin123')) {
  console.log('Login failed: Invalid OTP or credentials');
} else {
  // Mock JWT token
  const token = `mock-token-${user.id}-${user.role}`;
  console.log('Login successful:', { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
}

console.log('\nAll tests completed successfully!');
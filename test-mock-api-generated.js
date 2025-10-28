
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
// Helper to get data from localStorage or use default mock data
const getDefaultData = () => {
  const storedData = localStorage.getItem('appData');
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  // Default mock data
  return {
    users: [
      {"id":1,"name":"Alice Kumar","email":"alice@example.com","phone":"017XXXXXXXX","walletBalance":1000,"role":"user","bets":[]},
      {"id":2,"name":"Rahul Das","email":"rahul@example.com","phone":"018XXXXXXXX","walletBalance":500,"role":"user","bets":[]},
      {"id":3,"name":"Admin Name","email":"admin@example.com","phone":"019XXXXXXXX","walletBalance":0,"role":"admin","bets":[]}
    ],
    matches: [
      {
        "category": "Cricket",
        "matches": [
          {"id":101,"teamA":"Team Alpha","teamB":"Team Beta","date":"2025-09-20T15:00:00","odds":{"Team Alpha":1.8,"Team Beta":2.0},"result":null}
        ]
      },
      {
        "category": "Football",
        "matches": [
          {"id":102,"teamA":"Red Lions","teamB":"Blue Tigers","date":"2025-09-21T18:00:00","odds":{"Red Lions":1.9,"Blue Tigers":1.95},"result":null}
        ]
      }
    ],
    bets: [],
    transactions: []
  };
};

// Helper to save data to localStorage
const saveData = (data) => {
  localStorage.setItem('appData', JSON.stringify(data));
};

// Helper to get deep copy of data
const getDeepCopy = () => JSON.parse(JSON.stringify(getDefaultData()));

// --- AUTH --- //
export const register = async (name, email, phone) => {
  const data = getDeepCopy();
  if (data.users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const newUser = {
    id: data.users.length + 1,
    name,
    email,
    phone,
    walletBalance: 1000, // Initial balance
    role: 'user',
    bets: [],
  };
  data.users.push(newUser);
  saveData(data);
  // Mock JWT token
  const token = `mock-token-${newUser.id}-${newUser.role}`;
  return { user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, token };
};

export const login = async (email, otp) => {
  const data = getDeepCopy();
  // Mock OTP validation
  if (otp !== '123456' && !(email === 'admin@example.com' && otp === 'admin123')) {
    throw new Error('Invalid OTP or credentials');
  }

  const user = data.users.find(u => u.email === email);
  if (!user) {
    throw new Error('User not found');
  }
  // Mock JWT token
  const token = `mock-token-${user.id}-${user.role}`;
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

// --- USER & WALLET --- //
export const getUserDashboard = async (userId) => {
  const data = getDeepCopy();
  const user = data.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  const userTransactions = data.transactions.filter(t => t.userId === userId);
  const userBets = data.bets.filter(b => b.userId === userId);

  return {
    profile: { id: user.id, name: user.name, email: user.email, role: user.role },
    wallet: { balance: user.walletBalance, currency: 'BDT' },
    transactions: userTransactions,
    bets: userBets,
  };
};

export const deposit = async (userId, amount) => {
  const data = getDeepCopy();
  const user = data.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  user.walletBalance += amount;
  const newTransaction = {
    id: data.transactions.length + 1,
    userId,
    date: new Date().toISOString(),
    type: 'Deposit',
    amount,
    status: 'Completed',
  };
  data.transactions.push(newTransaction);
  saveData(data);
  return { wallet: { balance: user.walletBalance }, transaction: newTransaction };
};

export const withdraw = async (userId, amount) => {
  const data = getDeepCopy();
  const user = data.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.walletBalance < amount) {
    throw new Error('Insufficient balance');
  }
  user.walletBalance -= amount;
  const newTransaction = {
    id: data.transactions.length + 1,
    userId,
    date: new Date().toISOString(),
    type: 'Withdrawal',
    amount,
    status: 'Pending',
  };
  data.transactions.push(newTransaction);
  saveData(data);
  return { wallet: { balance: user.walletBalance }, transaction: newTransaction };
};

// --- MATCHES & BETTING --- //
export const getMatches = async () => {
  return getDeepCopy().matches;
};

export const placeBet = async (userId, matchId, team, amount) => {
  const data = getDeepCopy();
  const user = data.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  if (user.walletBalance < amount) {
    throw new Error('Insufficient balance');
  }

  const match = data.matches.flatMap(cat => cat.matches).find(m => m.id === matchId);
  if (!match) {
    throw new Error('Match not found');
  }

  user.walletBalance -= amount;
  const newBet = {
    id: data.bets.length + 1,
    userId,
    matchId,
    teamChosen: team,
    amount,
    status: 'Pending',
    date: new Date().toISOString(),
  };
  data.bets.push(newBet);
  saveData(data);
  return { bet: newBet, wallet: { balance: user.walletBalance } };
};

// --- ADMIN --- //
export const getAdminData = async () => {
  return getDeepCopy();
};

export const updateMatchResult = async (matchId, winner) => {
  const data = getDeepCopy();
  const match = data.matches.flatMap(cat => cat.matches).find(m => m.id === matchId);

  if (!match) {
    throw new Error('Match not found');
  }

  match.result = winner;

  // Update bets based on result
  data.bets.forEach(bet => {
    if (bet.matchId === matchId) {
      const user = data.users.find(u => u.id === bet.userId);
      if (bet.teamChosen === winner) {
        bet.status = 'Won';
        if (user) {
          // Find the odds for the winning team
          const winnings = bet.amount * (match.odds?.[winner] || 2); // Default to 2x if odds not found
          user.walletBalance += winnings;
        }
      } else {
        bet.status = 'Lost';
      }
    }
  });
  saveData(data);
  return { match };
};


// Test the functions
async function testMockApi() {
  console.log('Testing mock API functions...');
  
  try {
    // Test registration
    console.log('
1. Testing registration...');
    const registerResult = await register('Test User', 'test@example.com', '1234567890');
    console.log('Registration successful:', registerResult);
    
    // Test login
    console.log('
2. Testing login...');
    const loginResult = await login('test@example.com', '123456');
    console.log('Login successful:', loginResult);
    
    // Test duplicate registration
    console.log('
3. Testing duplicate registration (should fail)...');
    try {
      await register('Test User 2', 'test@example.com', '0987654321');
      console.log('ERROR: Duplicate registration should have failed');
    } catch (error) {
      console.log('Duplicate registration correctly failed:', error.message);
    }
    
    // Test invalid login
    console.log('
4. Testing invalid login (should fail)...');
    try {
      await login('test@example.com', 'wrongpassword');
      console.log('ERROR: Invalid login should have failed');
    } catch (error) {
      console.log('Invalid login correctly failed:', error.message);
    }
    
    console.log('
All tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMockApi();

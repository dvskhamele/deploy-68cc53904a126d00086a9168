const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the frontend dist directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// In-memory data (in a real app, you would use a database)
let { users, matches, bets, transactions } = require('./backend/data');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    wallet: { balance: 1000, currency: 'BDT' },
  };
  users.push(newUser);

  const token = jwt.sign({ id: newUser.id, name: newUser.name }, JWT_SECRET, { expiresIn: '1h' });
  res.status(201).json({ message: 'User registered successfully', token, user: {id: newUser.id, name: newUser.name, email: newUser.email} });
});

app.post('/api/auth/login', (req, res) => {
  const { email, otp } = req.body;
  // Mock OTP validation
  if (otp !== '123456') {
      return res.status(400).json({ message: 'Invalid OTP' });
  }
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login successful', token, user: {id: user.id, name: user.name, email: user.email} });
});

// --- USER ROUTES ---
app.get('/api/user/dashboard', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const userTransactions = transactions.filter(t => t.userId === user.id);
  res.json({
    profile: { id: user.id, name: user.name, email: user.email },
    wallet: user.wallet,
    transactions: userTransactions,
  });
});

// --- WALLET ROUTES ---
app.post('/api/wallet/deposit', authenticateToken, (req, res) => {
    const { amount } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.wallet.balance += amount;
    const newTransaction = { id: transactions.length + 1, userId: user.id, date: new Date().toISOString(), type: 'Deposit', amount, status: 'Completed' };
    transactions.push(newTransaction);

    res.json({ message: 'Deposit successful', wallet: user.wallet, transaction: newTransaction });
});

app.post('/api/wallet/withdraw', authenticateToken, (req, res) => {
    const { amount } = req.body;
    const user = users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }

    user.wallet.balance -= amount;
    const newTransaction = { id: transactions.length + 1, userId: user.id, date: new Date().toISOString(), type: 'Withdrawal', amount, status: 'Pending' };
    transactions.push(newTransaction);

    res.json({ message: 'Withdrawal request successful', wallet: user.wallet, transaction: newTransaction });
});

// --- MATCH & BETTING ROUTES ---
app.get('/api/matches', (req, res) => {
  res.json(matches);
});

app.post('/api/bets/place', authenticateToken, (req, res) => {
  const { matchId, team, amount } = req.body;
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.wallet.balance < amount) {
    return res.status(400).json({ message: 'Insufficient balance' });
  }

  const match = matches.flatMap(cat => cat.matches).find(m => m.id === matchId);
  if (!match) {
    return res.status(404).json({ message: 'Match not found' });
  }

  user.wallet.balance -= amount;
  const newBet = {
    id: bets.length + 1,
    userId: user.id,
    matchId,
    team,
    amount,
    status: 'Pending',
    date: new Date().toISOString(),
  };
  bets.push(newBet);

  res.status(201).json({ message: 'Bet placed successfully', bet: newBet, wallet: user.wallet });
});

// --- ADMIN ROUTES ---
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Mock admin credentials
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign({ id: 'admin', name: 'Admin User', isAdmin: true }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Admin login successful', token });
    } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
});

app.get('/api/admin/data', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    res.json({ users, bets, transactions, matches });
});

app.put('/api/admin/matches/:id', authenticateToken, (req, res) => {
    if (!req.user.isAdmin) return res.sendStatus(403);
    const { winner } = req.body;
    const matchId = parseInt(req.params.id);
    const match = matches.flatMap(cat => cat.matches).find(m => m.id === matchId);

    if (match) {
        match.result = winner;
        // Update bets based on result
        bets.forEach(bet => {
            if (bet.matchId === matchId) {
                if (bet.team === winner) {
                    bet.status = 'Won';
                    const user = users.find(u => u.id === bet.userId);
                    if (user) {
                        const winnings = bet.amount * (match.odds[winner] || 2); // Default to 2x if odds not found
                        user.wallet.balance += winnings;
                    }
                } else {
                    bet.status = 'Lost';
                }
            }
        });
        res.json({ message: 'Match result updated', match });
    } else {
        res.status(404).json({ message: 'Match not found' });
    }
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameFocusedDashboard from './pages/GameFocusedDashboard';
import EnhancedGameDashboard from './pages/EnhancedGameDashboard';
import BeautifulDashboard from './pages/BeautifulDashboard';
import MatchesPage from './pages/MatchesPage';
import GamingMatchesPage from './pages/GamingMatchesPage';
import BeautifulMatchesPage from './pages/BeautifulMatchesPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPage from './pages/EnhancedAdminPage';
import DashboardTestPage from './pages/DashboardTestPage';
import './index.css'; // Import the main CSS file
import './assets/beautiful-solid-cards.css'; // Import the solid color CSS file

// Simple mock functions to avoid TypeScript errors
const mockLogin = async () => true;
const mockRegister = async () => true;

// Mock state for user balance and bets
let mockUserBalance = 1000;
let mockBets: any[] = [];
let mockTransactions: any[] = [
  {id: 1, userId: 1, type: 'Deposit', amount: 500, date: new Date().toISOString(), description: 'Initial deposit', balanceAfter: 1500},
  {id: 2, userId: 1, type: 'Bet', amount: 100, date: new Date().toISOString(), description: 'Bet on Match #123', balanceAfter: 1400},
  {id: 3, userId: 1, type: 'Win', amount: 250, date: new Date().toISOString(), description: 'Winnings from Match #123', balanceAfter: 1650}
];

// Mock user object that matches the expected User interface
const mockUser = {
  id: 1,
  name: 'Demo User',
  email: 'demo@example.com',
  phone: '+1234567890',
  role: 'user' as const,
  balance: 1000,
  registrationDate: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  bettingPreferences: ['Football', 'Basketball'],
  riskLevel: 'medium' as const,
  totalBets: 12,
  totalWins: 7,
  favoriteSports: ['Football', 'Basketball', 'Tennis']
};

// Mock matches data
const mockMatches: any = [
  {
    id: 1,
    teamA: 'Team Alpha',
    teamB: 'Team Beta',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    odds: { 'Team Alpha': 2.1, 'Team Beta': 1.8, 'Draw': 3.2 },
    result: null,
    category: 'Football',
    status: 'upcoming'
  },
  {
    id: 2,
    teamA: 'Team Gamma',
    teamB: 'Team Delta',
    date: new Date(Date.now() + 172800000).toISOString(), // In 2 days
    odds: { 'Team Gamma': 1.9, 'Team Delta': 2.0, 'Draw': 3.0 },
    result: null,
    category: 'Basketball',
    status: 'upcoming'
  },
  {
    id: 3,
    teamA: 'Team Epsilon',
    teamB: 'Team Zeta',
    date: new Date().toISOString(),
    odds: { 'Team Epsilon': 2.5, 'Team Zeta': 1.6, 'Draw': 3.5 },
    result: null,
    category: 'Tennis',
    status: 'live',
    liveScore: { teamA: 2, teamB: 1 }
  }
];

// Function to handle placing bets
const handlePlaceBet = (matchId: number, team: string, amount: number) => {
  if (amount > mockUserBalance) {
    throw new Error('Insufficient balance');
  }
  
  // Deduct amount from balance
  mockUserBalance -= amount;
  
  // Add bet to mock bets
  mockBets.push({
    id: mockBets.length + 1,
    userId: 1,
    matchId,
    teamChosen: team,
    amount,
    status: 'Pending',
    date: new Date().toISOString(),
    potentialWin: amount * 2, // Simple calculation for demo
    odds: 2.0
  });
  
  // Add transaction
  mockTransactions.push({
    id: mockTransactions.length + 1,
    userId: 1,
    type: 'Bet',
    amount,
    date: new Date().toISOString(),
    description: `Bet on ${team} in Match #${matchId}`,
    balanceAfter: mockUserBalance
  });
  
  console.log(`Bet placed: ${amount} BDT on ${team} in match ${matchId}`);
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={mockLogin} />} />
        <Route path="/register" element={<RegisterPage onRegister={mockRegister} />} />
        <Route path="/dashboard" element={<BeautifulDashboard 
          user={mockUser} 
          onLogout={() => {}} 
          onDeposit={() => {}} 
          onWithdraw={() => {}} 
          getUserDashboard={() => ({profile: {...mockUser, balance: mockUserBalance}, transactions: mockTransactions, notifications: [
            {id: 1, userId: 1, title: 'Welcome Bonus', message: 'You received a 500 BDT welcome bonus!', date: new Date().toISOString(), read: false, type: 'success'},
            {id: 2, userId: 1, title: 'Bet Won!', message: 'Congratulations! Your bet on Match #123 won.', date: new Date().toISOString(), read: false, type: 'success'}
          ], wallet: {balance: mockUserBalance}, bets: mockBets, matches: mockMatches})} 
          notifications={[
            {id: 1, userId: 1, title: 'Welcome Bonus', message: 'You received a 500 BDT welcome bonus!', date: new Date().toISOString(), read: false, type: 'success'},
            {id: 2, userId: 1, title: 'Bet Won!', message: 'Congratulations! Your bet on Match #123 won.', date: new Date().toISOString(), read: false, type: 'success'}
          ]} 
          onMarkNotificationRead={() => {}} 
          onShowAssistant={() => {}} 
          onUpdateProfile={() => {}} 
          matches={mockMatches}
          onPlaceBet={handlePlaceBet} 
        />} />
        <Route path="/matches" element={<BeautifulMatchesPage 
          user={mockUser} 
          matches={mockMatches} 
          onPlaceBet={handlePlaceBet} 
          onLogout={() => {}} 
          onShowAssistant={() => {}} 
        />} />
        <Route path="/profile" element={<UserProfilePage 
          user={mockUser} 
          onUpdateProfile={() => {}} 
          onLogout={() => {}} 
          onDeposit={() => {}} 
          onWithdraw={() => {}} 
          onShowAssistant={() => {}} 
          getUserDashboard={() => ({profile: mockUser, transactions: [], notifications: [], wallet: {balance: 1000}, bets: []})} 
        />} />
        <Route path="/admin" element={<AdminPage 
          matches={mockMatches} 
          onUpdateMatchResult={() => {}} 
          getAdminData={() => ({matches: mockMatches, users: [], bets: [], transactions: [], notifications: []})} 
          onLogout={() => {}} 
          analytics={{
            totalUsers: 0,
            totalMatches: 0,
            totalBets: 0,
            totalBetAmount: 0,
            totalWins: 0,
            totalPayouts: 0,
            activeUsers: 0,
            popularSports: [],
            revenue: 0
          }} 
        />} />
        <Route path="/dashboard-test" element={<DashboardTestPage />} />
      </Routes>
    </Router>
  );
};

export default App;// Trigger redeployment

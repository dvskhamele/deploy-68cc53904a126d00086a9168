import React from 'react';
import { createRoot } from 'react-dom/client';
import DashboardPageEnhanced from './pages/DashboardPageEnhanced';

// Simple test component to verify dashboard enhancements
const TestDashboard: React.FC = () => {
  // Mock user data
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '123-456-7890',
    role: 'user' as const,
    balance: 1000,
    registrationDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    bettingPreferences: ['Football', 'Cricket'],
    riskLevel: 'medium' as const,
    totalBets: 10,
    totalWins: 5,
    favoriteSports: ['Football', 'Cricket', 'Basketball']
  };

  // Mock dashboard data
  const mockDashboardData = {
    profile: mockUser,
    transactions: [],
    notifications: [],
    wallet: { balance: 1000 },
    bets: []
  };

  // Mock functions
  const mockFunctions = {
    onLogout: () => console.log('Logout'),
    onDeposit: (amount: number) => console.log('Deposit:', amount),
    onWithdraw: (amount: number) => console.log('Withdraw:', amount),
    getUserDashboard: (_userId: number) => mockDashboardData,
    onMarkNotificationRead: (id: number) => console.log('Mark notification read:', id),
    onShowAssistant: () => console.log('Show assistant'),
    onUpdateProfile: (user: any) => console.log('Update profile:', user)
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Enhancement Test</h1>
      <p className="mb-4">This is a simple test to verify that the enhanced dashboard component loads correctly.</p>
      <div className="border rounded-lg p-4">
        <DashboardPageEnhanced 
          user={mockUser}
          {...mockFunctions}
          notifications={[]}
        />
      </div>
    </div>
  );
};

// Render the test component
const container = document.getElementById('test-root');
if (container) {
  const root = createRoot(container);
  root.render(<TestDashboard />);
}

export default TestDashboard;
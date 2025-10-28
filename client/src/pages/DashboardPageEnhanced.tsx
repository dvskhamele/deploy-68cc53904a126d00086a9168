import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3, 
  Bell, 
  Settings, 
  User, 
  Search, 
  Filter, 
  Eye, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trophy,
  Calendar,
  CalendarDays,
  Clock,
  Target,
  Star,
  Crown,
  Zap,
  Gift,
  Wallet,
  CreditCard,
  Gamepad2,
  Home,
  LogOut,
  Menu,
  X,
  Plus,
  Minus,
  Camera,
  Award,
  Save,
  Edit
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'staff';
  balance: number;
  registrationDate: string;
  lastLogin: string;
  bettingPreferences: string[];
  riskLevel: 'low' | 'medium' | 'high';
  totalBets: number;
  totalWins: number;
  favoriteSports: string[];
}

interface Transaction {
  id: number;
  userId: number;
  type: 'Deposit' | 'Withdrawal' | 'Bet' | 'Win' | 'Bonus' | 'Fee';
  amount: number;
  date: string;
  description: string;
  balanceAfter: number;
}

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface Bet {
  id: number;
  userId: number;
  matchId: number;
  teamChosen: string;
  amount: number;
  status: 'Pending' | 'Won' | 'Lost';
  date: string;
  potentialWin: number;
  odds: number;
}

interface DashboardData {
  profile: User | null;
  transactions: Transaction[];
  notifications: Notification[];
  wallet: { balance: number };
  bets: Bet[];
}

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  getUserDashboard: (userId: number) => DashboardData;
  notifications: Notification[];
  onMarkNotificationRead: (id: number) => void;
  onShowAssistant: () => void;
  onUpdateProfile: (updatedUser: User) => void;
}

const DashboardPageEnhanced: React.FC<DashboardPageProps> = ({ 
  user, 
  onLogout, 
  onDeposit, 
  onWithdraw,
  getUserDashboard,
  notifications,
  onMarkNotificationRead,
  onShowAssistant,
  onUpdateProfile
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({...user});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        const data = getUserDashboard(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id, getUserDashboard]);

  const handleDeposit = () => {
    const amount = prompt('Enter amount to deposit:');
    if (amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0) {
      try {
        onDeposit(parseInt(amount));
        // Refresh data
        const data = getUserDashboard(user.id);
        setDashboardData(data);
      } catch (error: unknown) {
        alert((error as Error).message || 'Deposit failed');
      }
    } else if (amount) {
      alert('Please enter a valid amount');
    }
  };

  const handleWithdraw = () => {
    const amount = prompt('Enter amount to withdraw:');
    if (amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0) {
      try {
        onWithdraw(parseInt(amount));
        // Refresh data
        const data = getUserDashboard(user.id);
        setDashboardData(data);
      } catch (error: unknown) {
        alert((error as Error).message || 'Withdrawal failed');
      }
    } else if (amount) {
      alert('Please enter a valid amount');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Visual status indicators
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return <DollarSign size={16} />;
      case 'Withdrawal':
        return <CreditCard size={16} />;
      case 'Bet':
        return <Gamepad2 size={16} />;
      case 'Win':
        return <Trophy size={16} />;
      case 'Bonus':
        return <Award size={16} />;
      case 'Fee':
        return <DollarSign size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} />;
      case 'Pending':
        return <Clock size={16} />;
      case 'Cancelled':
        return <XCircle size={16} />;
      case 'Failed':
        return <XCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Deposit':
        return 'dashboard-table-badge deposit';
      case 'Withdrawal':
        return 'dashboard-table-badge withdrawal';
      case 'Bet':
        return 'dashboard-table-badge bet';
      case 'Win':
        return 'dashboard-table-badge win';
      case 'Bonus':
        return 'dashboard-table-badge bonus';
      case 'Fee':
        return 'dashboard-table-badge fee';
      default:
        return 'dashboard-table-badge';
    }
  };

  // const getNotificationClass = (type: string) => {
  //   switch (type) {
  //     case 'success':
  //       return 'dashboard-notification-card';
  //     case 'warning':
  //       return 'dashboard-notification-card';
  //     case 'error':
  //       return 'dashboard-notification-card';
  //     default:
  //       return 'dashboard-notification-card';
  //   }
  // };

  const getBetStatusClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'dashboard-table-badge pending';
      case 'Won':
        return 'dashboard-table-badge won';
      case 'Lost':
        return 'dashboard-table-badge lost';
      default:
        return 'dashboard-table-badge';
    }
  };

  const winRate = user.totalBets > 0 ? 
    ((user.totalWins / user.totalBets) * 100).toFixed(1) : '0.0';

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Calculate betting statistics
  const calculateBettingStats = () => {
    if (!dashboardData || !dashboardData.bets) return { totalBets: 0, totalWins: 0, totalLost: 0, winRate: 0 };
    
    const totalBets = dashboardData.bets.length;
    const totalWins = dashboardData.bets.filter(bet => bet.status === 'Won').length;
    const totalLost = dashboardData.bets.filter(bet => bet.status === 'Lost').length;
    const winRate = totalBets > 0 ? (totalWins / totalBets) * 100 : 0;
    
    return { totalBets, totalWins, totalLost, winRate };
  };

  const bettingStats = calculateBettingStats();

  // Get recent bets
  const getRecentBets = () => {
    if (!dashboardData || !dashboardData.bets) return [];
    return [...dashboardData.bets]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const recentBets = getRecentBets();

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Save profile changes
  const saveProfileChanges = () => {
    onUpdateProfile(editedUser);
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Enhanced Header */}
      <header className="beautiful-header">
        <div className="container mx-auto">
          <div className="beautiful-header-content">
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="beautiful-logo"
              >
                <span className="beautiful-logo-icon">🎲</span>
                TK999
              </Link>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="beautiful-wallet-card">
                <span className="beautiful-wallet-icon">💰</span>
                <span className="beautiful-wallet-amount">
                  {dashboardData?.wallet?.balance?.toLocaleString() || user.balance.toLocaleString()} BDT
                </span>
              </div>
              
              <div className="beautiful-user-profile">
                <div className="beautiful-avatar">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="beautiful-user-info">
                  <div className="beautiful-user-name">{user?.name || 'User'}</div>
                  <div className="beautiful-user-role">
                    {user?.role === 'admin' ? 'Admin' : user?.role === 'staff' ? 'Staff' : 'Member'}
                  </div>
                </div>
              </div>
              
              <div className="beautiful-nav-buttons">
                <Link 
                  to="/dashboard" 
                  className="beautiful-nav-btn"
                  title="Dashboard"
                >
                  <span>📊</span>
                  <span className="beautiful-nav-btn-label">Dashboard</span>
                </Link>
                
                <Link 
                  to="/matches" 
                  className="beautiful-nav-btn"
                  title="Matches"
                >
                  <span>⚽</span>
                  <span className="beautiful-nav-btn-label">Matches</span>
                </Link>
                
                {(user?.role === 'admin' || user?.role === 'staff') && (
                  <Link 
                    to="/admin" 
                    className="beautiful-nav-btn"
                    title="Admin"
                  >
                    <span>⚙️</span>
                    <span className="beautiful-nav-btn-label">Admin</span>
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="beautiful-nav-btn"
                  title="Logout"
                >
                  <span>🚪</span>
                  <span className="beautiful-nav-btn-label">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="beautiful-title">Dashboard</h1>
          <p className="beautiful-subtitle">
            Welcome back, <span className="beautiful-welcome-user">{user?.name}</span>! 
            Ready to place some winning bets today?
          </p>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="beautiful-tabs">
          <button
            className={`beautiful-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp size={18} />
            Overview
          </button>
          <button
            className={`beautiful-tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
                          <Clock size={18} />
            Transactions
          </button>
          <button
            className={`beautiful-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            Notifications
            {unreadNotifications > 0 && (
              <span className="dashboard-tab-badge">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            className={`beautiful-tab ${activeTab === 'assistant' ? 'active' : ''}`}
            onClick={onShowAssistant}
          >
            <Zap size={18} />
            Smart Assistant
          </button>
          <button
            className={`beautiful-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="beautiful-card">
                <div className="beautiful-card-header">
                  <User size={24} />
                  Profile
                </div>
                <div className="beautiful-card-body">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="beautiful-spinner mb-4"></div>
                      <p className="text-gray-500">Loading profile...</p>
                    </div>
                  ) : dashboardData?.profile ? (
                    <div className="space-y-6">
                      <div className="dashboard-profile-avatar-container">
                        <div className="beautiful-avatar beautiful-avatar-lg">
                          {profileImage ? (
                            <img 
                              src={profileImage} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            dashboardData.profile.name.charAt(0).toUpperCase()
                          )}
                          <div className="dashboard-profile-avatar-edit">
                            <label className="cursor-pointer">
                              <Camera size={16} className="text-gray-600" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                        </div>
                        <h4 className="dashboard-profile-name">{dashboardData.profile.name}</h4>
                        <p className="dashboard-profile-joined">
                          Member since {new Date(dashboardData.profile.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="dashboard-profile-info">
                        <div className="dashboard-profile-info-item">
                          <div className="dashboard-profile-info-icon bg-blue-100 text-blue-600">
                            📧
                          </div>
                          <div className="dashboard-profile-info-text">
                            <div className="dashboard-profile-info-label">Email</div>
                            <div className="dashboard-profile-info-value">{dashboardData.profile.email}</div>
                          </div>
                        </div>
                        <div className="dashboard-profile-info-item">
                          <div className="dashboard-profile-info-icon bg-green-100 text-green-600">
                            📱
                          </div>
                          <div className="dashboard-profile-info-text">
                            <div className="dashboard-profile-info-label">Phone</div>
                            <div className="dashboard-profile-info-value">{dashboardData.profile.phone}</div>
                          </div>
                        </div>
                        <div className="dashboard-profile-info-item">
                          <div className="dashboard-profile-info-icon bg-purple-100 text-purple-600">
                            🏆
                          </div>
                          <div className="dashboard-profile-info-text">
                            <div className="dashboard-profile-info-label">Win Rate</div>
                            <div className="dashboard-profile-info-value">{winRate}%</div>
                          </div>
                        </div>
                        <div className="dashboard-profile-info-item">
                          <div className="dashboard-profile-info-icon bg-yellow-100 text-yellow-600">
                            🎰
                          </div>
                          <div className="dashboard-profile-info-text">
                            <div className="dashboard-profile-info-label">Total Bets</div>
                            <div className="dashboard-profile-info-value">{dashboardData.profile.totalBets}</div>
                          </div>
                        </div>
                        <div className="dashboard-profile-info-item">
                          <div className="dashboard-profile-info-icon bg-red-100 text-red-600">
                            🛡️
                          </div>
                          <div className="dashboard-profile-info-text">
                            <div className="dashboard-profile-info-label">Risk Level</div>
                            <div className="dashboard-profile-info-value">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                dashboardData.profile.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                                dashboardData.profile.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {dashboardData.profile.riskLevel.charAt(0).toUpperCase() + dashboardData.profile.riskLevel.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">👤</div>
                      <p className="text-gray-500">Profile not available</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="beautiful-card">
                <div className="beautiful-card-header">
                  <Wallet size={24} />
                  Wallet
                </div>
                <div className="beautiful-card-body">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="beautiful-spinner mb-4"></div>
                      <p className="text-gray-500">Loading wallet...</p>
                    </div>
                  ) : dashboardData?.wallet ? (
                    <div className="text-center">
                      <div className="dashboard-balance-container">
                        <p className="dashboard-balance-label">Current Balance</p>
                        <p className="dashboard-balance-amount">
                          {dashboardData.wallet.balance.toLocaleString()}
                          <span className="dashboard-balance-currency">BDT</span>
                        </p>
                      </div>
                      <div className="dashboard-wallet-actions">
                        <button 
                          onClick={handleDeposit} 
                          className="beautiful-btn beautiful-btn-success"
                        >
                          <Plus size={20} className="dashboard-wallet-btn-icon" />
                          <span>Deposit</span>
                        </button>
                        <button 
                          onClick={handleWithdraw} 
                          className="beautiful-btn beautiful-btn-warning"
                        >
                          <Minus size={20} className="dashboard-wallet-btn-icon" />
                          <span>Withdraw</span>
                        </button>
                      </div>
                      
                      {/* Quick Deposit Options */}
                      <div className="dashboard-quick-deposit">
                        <p className="dashboard-quick-deposit-label">Quick Deposit</p>
                        <div className="dashboard-quick-deposit-options">
                          {[500, 1000, 2000, 5000].map(amount => (
                            <button
                              key={amount}
                              onClick={() => onDeposit(amount)}
                              className="beautiful-btn beautiful-btn-secondary"
                            >
                              {amount} BDT
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-5xl mb-4">💰</div>
                      <p className="text-gray-500">Wallet not available</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Performance Stats */}
              <div className="beautiful-card">
                <div className="beautiful-card-header" style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                  <Award size={24} />
                  Performance
                </div>
                <div className="beautiful-card-body">
                  <div className="dashboard-stats-grid">
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{winRate}%</p>
                      <p className="beautiful-stat-label">Win Rate</p>
                    </div>
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{user.totalWins}</p>
                      <p className="beautiful-stat-label">Wins</p>
                    </div>
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{user.totalBets}</p>
                      <p className="beautiful-stat-label">Total Bets</p>
                    </div>
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{user.favoriteSports.length}</p>
                      <p className="beautiful-stat-label">Sports</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-bold mb-3 flex items-center">
                      <Star className="mr-2 text-yellow-500" size={20} />
                      Favorite Sports
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.favoriteSports.map(sport => (
                        <span 
                          key={sport} 
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Activity and Recommendations */}
            <div className="lg:col-span-2 space-y-6">
              {/* Betting Stats */}
              <div className="beautiful-card">
                <div className="beautiful-card-header" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <Gamepad2 size={24} />
                  Today's Play
                </div>
                <div className="beautiful-card-body">
                  <div className="dashboard-stats-grid">
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{bettingStats.totalBets}</p>
                      <p className="beautiful-stat-label">Today's Bets</p>
                    </div>
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{bettingStats.totalWins}</p>
                      <p className="beautiful-stat-label">Wins</p>
                    </div>
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{bettingStats.totalLost}</p>
                      <p className="beautiful-stat-label">Losses</p>
                    </div>
                    <div className="beautiful-stat-card">
                      <p className="beautiful-stat-value">{bettingStats.winRate.toFixed(1)}%</p>
                      <p className="beautiful-stat-label">Win Rate</p>
                    </div>
                  </div>
                  
                  {/* Recent Bets */}
                  <div className="mt-6">
                    <h4 className="font-bold mb-4 flex items-center text-lg">
                      <CalendarDays className="mr-2 text-indigo-600" size={20} />
                      Recent Bets
                    </h4>
                    {recentBets.length > 0 ? (
                      <div className="dashboard-table-container">
                        <table className="beautiful-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Match</th>
                              <th>Amount</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentBets.map((bet) => (
                              <tr key={bet.id}>
                                <td>
                                  <div className="font-medium">
                                    {new Date(bet.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(bet.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </td>
                                <td>
                                  Bet on {bet.teamChosen}
                                </td>
                                <td className="font-bold">
                                  {bet.amount.toFixed(2)} BDT
                                </td>
                                <td>
                                  <span className={getBetStatusClass(bet.status)}>
                                    {bet.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="beautiful-empty-state">
                        <div className="beautiful-empty-state-icon">📋</div>
                        <h4 className="beautiful-empty-state-title">No bets placed yet</h4>
                        <p className="beautiful-empty-state-message">
                          Start placing bets to see your betting history here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Smart Recommendations */}
              <div className="beautiful-card">
                <div className="beautiful-card-header" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}>
                  <Target size={24} />
                  Daily Picks
                </div>
                <div className="beautiful-card-body">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
                    <h4 className="font-bold text-lg mb-3 flex items-center">
                      <Zap className="mr-2 text-yellow-500" size={22} />
                      Personalized for You
                    </h4>
                    <p className="text-gray-700">
                      Based on your betting history, we recommend focusing on <span className="font-semibold text-blue-600">{user.favoriteSports[0] || 'popular'}</span> matches 
                      with value odds above <span className="font-semibold">2.0</span> for better returns.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                      <h5 className="font-bold text-green-800 mb-3 flex items-center">
                        <Trophy className="mr-2" size={20} />
                        Bankroll Management
                      </h5>
                      <p className="text-sm text-green-700">
                        Never bet more than <span className="font-semibold">5%</span> of your total bankroll on a single bet.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                      <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                        <Users className="mr-2" size={20} />
                        Diversification
                      </h5>
                      <p className="text-sm text-blue-700">
                        Spread your bets across different sports to <span className="font-semibold">reduce risk</span>.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-5 rounded-xl border border-purple-100">
                      <h5 className="font-bold text-purple-800 mb-3 flex items-center">
                        <Clock className="mr-2" size={20} />
                        Timing
                      </h5>
                      <p className="text-sm text-purple-700">
                        Place bets <span className="font-semibold">early</span> to get the best odds before they change.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border border-yellow-100">
                      <h5 className="font-bold text-yellow-800 mb-3 flex items-center">
                        <TrendingUp className="mr-2" size={20} />
                        Tracking
                      </h5>
                      <p className="text-sm text-yellow-700">
                        Review your betting history <span className="font-semibold">weekly</span> to identify patterns.
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={onShowAssistant}
                    className="beautiful-btn beautiful-btn-primary w-full mt-8 flex items-center justify-center py-5 hover:scale-[1.02] transition-transform duration-300 animate-beautiful-pulse-glow"
                  >
                    <Zap className="mr-2" size={22} />
                    Get More Smart Recommendations
                  </button>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="beautiful-card">
                <div className="beautiful-card-header" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
                  <Clock size={24} />
                  Recent Activity
                </div>
                <div className="beautiful-card-body">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="beautiful-spinner mb-4"></div>
                      <p className="text-gray-500">Loading activity...</p>
                    </div>
                  ) : dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
                    <div className="dashboard-table-container">
                      <table className="beautiful-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...dashboardData.transactions]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map((tx) => (
                              <tr key={tx.id}>
                                <td>
                                  <div className="font-medium">
                                    {new Date(tx.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </td>
                                <td>
                                  <span className={getTypeClass(tx.type)}>
                                    <span className="mr-1">{getStatusIcon(tx.type)}</span>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="font-bold">
                                  {tx.type === 'Withdrawal' || tx.type === 'Bet' || tx.type === 'Fee' ? '-' : '+'}
                                  {tx.amount.toLocaleString()} BDT
                                </td>
                                <td className="text-gray-600">
                                  {tx.description}
                                </td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => setActiveTab('transactions')}
                          className="text-blue-600 hover:text-blue-800 font-semibold flex items-center justify-center mx-auto group"
                        >
                          View All Transactions 
                          <span className="ml-2 group-hover:ml-3 transition-all duration-300">→</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="beautiful-empty-state">
                      <div className="beautiful-empty-state-icon">📋</div>
                      <h4 className="beautiful-empty-state-title">No activity yet</h4>
                      <p className="beautiful-empty-state-message">
                        Your recent transactions and betting activity will appear here.
                      </p>
                      <div className="mt-4">
                        <Link 
                          to="/matches" 
                          className="beautiful-btn beautiful-btn-primary"
                        >
                          <span>⚽</span>
                          Start Betting
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="beautiful-card">
            <div className="beautiful-card-header" style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <Clock size={24} />
              Transaction History
            </div>
            <div className="beautiful-card-body">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="beautiful-spinner mb-4"></div>
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
                <div className="dashboard-table-container">
                  <table className="beautiful-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Balance After</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...dashboardData.transactions]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((tx) => (
                          <tr key={tx.id}>
                            <td>
                              <div className="font-medium">
                                {new Date(tx.date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </td>
                            <td>
                              <span className={getTypeClass(tx.type)}>
                                <span className="mr-1">{getStatusIcon(tx.type)}</span>
                                {tx.type}
                              </span>
                            </td>
                            <td className="font-bold">
                              {tx.type === 'Withdrawal' || tx.type === 'Bet' || tx.type === 'Fee' ? '-' : '+'}
                              {tx.amount.toLocaleString()} BDT
                            </td>
                            <td className="font-medium">
                              {tx.balanceAfter.toLocaleString()} BDT
                            </td>
                            <td>
                              {tx.description}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="beautiful-empty-state">
                  <div className="beautiful-empty-state-icon">📋</div>
                  <h4 className="beautiful-empty-state-title">No transactions yet</h4>
                  <p className="beautiful-empty-state-message">
                    Your transaction history will appear here once you start making deposits or withdrawals.
                  </p>
                  <div className="mt-4">
                    <button 
                      onClick={handleDeposit} 
                      className="beautiful-btn beautiful-btn-primary"
                    >
                      <span>📥</span>
                      Make Deposit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="beautiful-card">
            <div className="beautiful-card-header" style={{ background: 'linear-gradient(135deg, #8b5cf6, #c026d3)' }}>
              <Bell size={24} />
              Notifications
              {unreadNotifications > 0 && (
                <span className="ml-3 bg-white text-purple-600 text-sm rounded-full px-3 py-1 font-semibold">
                  {unreadNotifications} unread
                </span>
              )}
            </div>
            <div className="beautiful-card-body">
              {notifications.length > 0 ? (
                <div className="dashboard-notifications-container">
                  {[...notifications]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(notification => (
                      <div 
                        key={notification.id} 
                        className={`beautiful-notification-card ${!notification.read ? 'unread' : ''}`}
                      >
                        <div className="beautiful-notification-header">
                          <h4 className="beautiful-notification-title">{notification.title}</h4>
                          {!notification.read && (
                            <button
                              onClick={() => onMarkNotificationRead(notification.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                        <p className="beautiful-notification-message">{notification.message}</p>
                        <p className="beautiful-notification-date">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="beautiful-empty-state">
                  <div className="beautiful-empty-state-icon">🔔</div>
                  <h4 className="beautiful-empty-state-title">No notifications</h4>
                  <p className="beautiful-empty-state-message">
                    You don't have any notifications at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="beautiful-card">
            <div className="beautiful-card-header" style={{ background: 'linear-gradient(135deg, #6b7280, #374151)' }}>
              <Settings size={24} />
              Account Settings
            </div>
            <div className="beautiful-card-body">
              <div className="dashboard-settings-grid">
                <div className="dashboard-settings-section">
                  <h4 className="dashboard-settings-section-title">
                    <User size={22} />
                    Profile Information
                  </h4>
                  <div className="space-y-5">
                    <div className="dashboard-settings-form-group">
                      <label className="dashboard-settings-label">Full Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                          className="beautiful-input"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">{editedUser.name}</p>
                      )}
                    </div>
                    
                    <div className="dashboard-settings-form-group">
                      <label className="dashboard-settings-label">Email Address</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                          className="beautiful-input"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">{editedUser.email}</p>
                      )}
                    </div>
                    
                    <div className="dashboard-settings-form-group">
                      <label className="dashboard-settings-label">Phone Number</label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={editedUser.phone}
                          onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                          className="beautiful-input"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">{editedUser.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="dashboard-settings-section">
                  <h4 className="dashboard-settings-section-title">
                    <Settings size={22} />
                    Preferences
                  </h4>
                  <div className="space-y-5">
                    <div className="dashboard-settings-form-group">
                      <label className="dashboard-settings-label">Risk Level</label>
                      {isEditingProfile ? (
                        <select
                          value={editedUser.riskLevel}
                          onChange={(e) => setEditedUser({...editedUser, riskLevel: e.target.value as 'low' | 'medium' | 'high'})}
                          className="beautiful-input"
                        >
                          <option value="low">Low Risk</option>
                          <option value="medium">Medium Risk</option>
                          <option value="high">High Risk</option>
                        </select>
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200 font-semibold capitalize">{editedUser.riskLevel} Risk</p>
                      )}
                    </div>
                    
                    <div className="dashboard-settings-form-group">
                      <label className="dashboard-settings-label">Favorite Sports</label>
                      {isEditingProfile ? (
                        <div className="dashboard-settings-checkbox-group">
                          {['Football', 'Cricket', 'Basketball', 'Tennis', 'Hockey'].map(sport => (
                            <label key={sport} className="dashboard-settings-checkbox-label">
                              <input
                                type="checkbox"
                                checked={editedUser.favoriteSports.includes(sport)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditedUser({
                                      ...editedUser,
                                      favoriteSports: [...editedUser.favoriteSports, sport]
                                    });
                                  } else {
                                    setEditedUser({
                                      ...editedUser,
                                      favoriteSports: editedUser.favoriteSports.filter(s => s !== sport)
                                    });
                                  }
                                }}
                                className="dashboard-settings-checkbox"
                              />
                              {sport}
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {editedUser.favoriteSports.map(sport => (
                            <span key={sport} className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
                              {sport}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="dashboard-settings-form-group">
                      <label className="dashboard-settings-label">Notification Preferences</label>
                      {isEditingProfile ? (
                        <div className="space-y-3">
                          <label className="flex items-center bg-white px-4 py-3 rounded-xl border border-gray-200">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="mr-3 w-5 h-5" 
                            />
                            <span className="font-medium">Email notifications</span>
                          </label>
                          <label className="flex items-center bg-white px-4 py-3 rounded-xl border border-gray-200">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="mr-3 w-5 h-5" 
                            />
                            <span className="font-medium">SMS notifications</span>
                          </label>
                          <label className="flex items-center bg-white px-4 py-3 rounded-xl border border-gray-200">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              className="mr-3 w-5 h-5" 
                            />
                            <span className="font-medium">Push notifications</span>
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">Email notifications: <span className="font-semibold">Enabled</span></p>
                          <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">SMS notifications: <span className="font-semibold">Enabled</span></p>
                          <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">Push notifications: <span className="font-semibold">Enabled</span></p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="dashboard-settings-actions">
                {isEditingProfile ? (
                  <div className="flex gap-4 flex-wrap">
                    <button 
                      onClick={saveProfileChanges}
                      className="beautiful-btn beautiful-btn-success"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditedUser({...user});
                      }}
                      className="beautiful-btn beautiful-btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="beautiful-btn beautiful-btn-primary"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="beautiful-btn beautiful-btn-danger"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPageEnhanced;
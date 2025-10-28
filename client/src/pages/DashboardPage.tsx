import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Wallet, 
  TrendingUp, 
  History, 
  Bell,
  Zap,
  Award,
  Target,
  Settings,
  CalendarDays,
  Gamepad2,
  Camera,
  Save,
  Edit,
  Star,
  Trophy,
  Users,
  Clock
} from 'lucide-react';

// Ensure CSS is properly imported
import '../index.css';

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

const DashboardPage: React.FC<DashboardPageProps> = ({ 
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
  console.log('DashboardPage component rendered with props:', { user, notifications });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({...user});
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    console.log('DashboardPage useEffect called with user.id:', user.id);
    const fetchData = () => {
      try {
        console.log('Calling getUserDashboard with user.id:', user.id);
        const data = getUserDashboard(user.id);
        console.log('Dashboard data fetched:', data);
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        console.log('Setting isLoading to false');
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
  const getStatusIcon = (type: string) => {
    switch (type) {
      case 'Deposit':
        return '📥';
      case 'Withdrawal':
        return '📤';
      case 'Bet':
        return '🎰';
      case 'Win':
        return '🏆';
      case 'Bonus':
        return '🎁';
      case 'Fee':
        return '💳';
      default:
        return '🔄';
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Deposit':
        return 'bg-green-100 text-green-800';
      case 'Withdrawal':
        return 'bg-purple-100 text-purple-800';
      case 'Bet':
        return 'bg-blue-100 text-blue-800';
      case 'Win':
        return 'bg-yellow-100 text-yellow-800';
      case 'Bonus':
        return 'bg-pink-100 text-pink-800';
      case 'Fee':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-200';
      case 'warning':
        return 'bg-yellow-100 border-yellow-200';
      case 'error':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-blue-100 border-blue-200';
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
      {/* Header */}
      <header className="dashboard-header sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="text-3xl md:text-4xl font-bold text-white flex items-center group"
            >
              <span className="text-3xl md:text-4xl mr-3 group-hover:rotate-12 transition-transform duration-500 float">🎲</span>
              TK999
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="dashboard-wallet-card text-white px-6 py-4 rounded-2xl font-bold flex items-center shadow-xl float">
              <span className="mr-3 text-2xl">💰</span>
              <span className="text-xl">{dashboardData?.wallet?.balance?.toLocaleString() || user.balance.toLocaleString()} BDT</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className="bg-white w-14 h-14 rounded-full flex items-center justify-center text-blue-600 font-bold text-2xl shadow-xl relative float hover:scale-110 transition-transform duration-300"
                >
                  <Bell size={28} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-semibold text-lg">{user?.name || 'User'}</p>
                <p className="text-blue-100 text-sm">
                  {user?.role === 'admin' ? 'Admin' : user?.role === 'staff' ? 'Staff' : 'Member'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                to="/dashboard" 
                className="stunning-btn stunning-btn-success flex flex-col items-center justify-center w-20 h-20 rounded-3xl transform transition-all duration-300 hover:scale-110 animate-float"
                title="Dashboard"
              >
                <span className="text-2xl">📊</span>
                <span className="text-xs mt-1">Dashboard</span>
              </Link>
              
              <Link 
                to="/matches" 
                className="stunning-btn stunning-btn-primary flex flex-col items-center justify-center w-20 h-20 rounded-3xl transform transition-all duration-300 hover:scale-110 animate-float"
                title="Matches"
              >
                <span className="text-2xl">⚽</span>
                <span className="text-xs mt-1">Matches</span>
              </Link>
              
              {(user?.role === 'admin' || user?.role === 'staff') && (
                <Link 
                  to="/admin" 
                  className="stunning-btn stunning-btn-warning flex flex-col items-center justify-center w-20 h-20 rounded-3xl transform transition-all duration-300 hover:scale-110 animate-float"
                  title="Admin"
                >
                  <span className="text-2xl">⚙️</span>
                  <span className="text-xs mt-1">Admin</span>
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="stunning-btn stunning-btn-danger flex flex-col items-center justify-center w-20 h-20 rounded-3xl transform transition-all duration-300 hover:scale-110 animate-float"
                title="Logout"
              >
                <span className="text-2xl">🚪</span>
                <span className="text-xs mt-1">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8 fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center">
            <span className="mr-4 text-4xl float">📊</span>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-600 mt-3 text-lg">Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span>! Ready to place some winning bets today?</p>
        </div>
        
        {/* Enhanced Tabs with better styling */}
        <div className="flex flex-wrap border-b border-gray-200 mb-8 bg-white rounded-t-2xl p-2 shadow-sm">
          <button
            className={`py-3 px-6 font-medium flex items-center rounded-lg transition-all duration-300 mr-2 mb-2 ${
              activeTab === 'overview' 
                ? 'dashboard-tab-active' 
                : 'dashboard-tab-inactive'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp className="mr-2" size={18} />
            Overview
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center rounded-lg transition-all duration-300 mr-2 mb-2 ${
              activeTab === 'transactions' 
                ? 'dashboard-tab-active' 
                : 'dashboard-tab-inactive'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            <History className="mr-2" size={18} />
            Transactions
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center rounded-lg transition-all duration-300 mr-2 mb-2 ${
              activeTab === 'notifications' 
                ? 'dashboard-tab-active' 
                : 'dashboard-tab-inactive'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell className="mr-2" size={18} />
            Notifications
            {unreadNotifications > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center rounded-lg transition-all duration-300 mr-2 mb-2 ${
              activeTab === 'assistant' 
                ? 'dashboard-tab-active' 
                : 'dashboard-tab-inactive'
            }`}
            onClick={onShowAssistant}
          >
            <Zap className="mr-2" size={18} />
            Smart Assistant
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center rounded-lg transition-all duration-300 mr-2 mb-2 ${
              activeTab === 'settings' 
                ? 'dashboard-tab-active' 
                : 'dashboard-tab-inactive'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="mr-2" size={18} />
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile and Stats Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="stunning-card animate-zoom-in delay-100">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <User className="mr-3" size={28} />
                    Profile
                  </h3>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="loading-spinner mb-4"></div>
                      <p className="text-gray-500">Loading profile...</p>
                    </div>
                  ) : dashboardData?.profile ? (
                    <div className="space-y-6">
                      <div className="flex flex-col items-center">
                        <div className="relative group">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                            {profileImage ? (
                              <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-24 h-24 rounded-full object-cover"
                              />
                            ) : (
                              dashboardData.profile.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <button className="absolute bottom-4 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-110">
                            <label className="cursor-pointer">
                              <Camera size={18} className="text-gray-600" />
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </button>
                        </div>
                        <div className="text-center">
                          <h4 className="font-bold text-2xl text-gray-800">{dashboardData.profile.name}</h4>
                          <p className="text-gray-600 text-sm mt-1">Member since {new Date(dashboardData.profile.registrationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="border-t pt-4 space-y-4">
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-semibold mr-3 text-blue-600">📧</span>
                          <span className="text-gray-700">{dashboardData.profile.email}</span>
                        </div>
                        <div className="flex items-center p-3 bg-green-50 rounded-lg">
                          <span className="font-semibold mr-3 text-green-600">📱</span>
                          <span className="text-gray-700">{dashboardData.profile.phone}</span>
                        </div>
                        <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                          <span className="font-semibold mr-3 text-purple-600">🏆</span>
                          <span className="text-gray-700">Win Rate: <span className="font-bold">{winRate}%</span></span>
                        </div>
                        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="font-semibold mr-3 text-yellow-600">🎰</span>
                          <span className="text-gray-700">Total Bets: <span className="font-bold">{dashboardData.profile.totalBets}</span></span>
                        </div>
                        <div className="flex items-center p-3 bg-red-50 rounded-lg">
                          <span className="font-semibold mr-3 text-red-600">🛡️</span>
                          <span className="text-gray-700">Risk Level: 
                            <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                              dashboardData.profile.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                              dashboardData.profile.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {dashboardData.profile.riskLevel.charAt(0).toUpperCase() + dashboardData.profile.riskLevel.slice(1)}
                            </span>
                          </span>
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
              
              <div className="stunning-card animate-zoom-in delay-200">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Wallet className="mr-3" size={28} />
                    Wallet
                  </h3>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="loading-spinner mb-4"></div>
                      <p className="text-gray-500">Loading wallet...</p>
                    </div>
                  ) : dashboardData?.wallet ? (
                    <div className="text-center">
                      <div className="mb-8">
                        <p className="text-sm text-gray-500 mb-2">Current Balance</p>
                        <p className="text-5xl md:text-6xl font-bold text-gray-800 flex items-center justify-center">
                          <span className="mr-3 text-4xl float">💵</span>
                          <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            {dashboardData.wallet.balance.toLocaleString()}
                          </span>
                          <span className="text-2xl md:text-3xl ml-3 text-gray-600">BDT</span>
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <button 
                          onClick={handleDeposit} 
                          className="stunning-btn stunning-btn-success flex flex-col items-center justify-center py-6 hover:scale-105 transition-transform duration-300 animate-float"
                        >
                          <span className="text-3xl mb-2 float">📥</span>
                          <span className="font-semibold text-lg">Deposit</span>
                        </button>
                        <button 
                          onClick={handleWithdraw} 
                          className="stunning-btn stunning-btn-warning flex flex-col items-center justify-center py-6 hover:scale-105 transition-transform duration-300 animate-float"
                        >
                          <span className="text-3xl mb-2 float">📤</span>
                          <span className="font-semibold text-lg">Withdraw</span>
                        </button>
                      </div>
                      
                      {/* Quick Deposit Options */}
                      <div className="mt-6 pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500 mb-4">Quick Deposit</p>
                        <div className="flex justify-center gap-3 flex-wrap">
                          {[500, 1000, 2000, 5000].map(amount => (
                            <button
                              key={amount}
                              onClick={() => onDeposit(amount)}
                              className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
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
              <div className="stunning-card animate-zoom-in delay-300">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Award className="mr-3" size={28} />
                    Performance
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="dashboard-stats-card p-4 text-center">
                      <p className="dashboard-stats-value">{winRate}%</p>
                      <p className="text-sm text-gray-600">Win Rate</p>
                    </div>
                    <div className="dashboard-stats-card p-4 text-center">
                      <p className="dashboard-stats-value">{user.totalWins}</p>
                      <p className="text-sm text-gray-600">Wins</p>
                    </div>
                    <div className="dashboard-stats-card p-4 text-center">
                      <p className="dashboard-stats-value">{user.totalBets}</p>
                      <p className="text-sm text-gray-600">Total Bets</p>
                    </div>
                    <div className="dashboard-stats-card p-4 text-center">
                      <p className="dashboard-stats-value">{user.favoriteSports.length}</p>
                      <p className="text-sm text-gray-600">Sports</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-bold mb-4 flex items-center">
                      <Star className="mr-2 text-yellow-500" size={20} />
                      Favorite Sports
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {user.favoriteSports.map(sport => (
                        <span 
                          key={sport} 
                          className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold hover:shadow-md transition-all duration-300"
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
              <div className="stunning-card animate-zoom-in delay-400">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Gamepad2 className="mr-3" size={28} />
                    Today's Play
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="dashboard-stats-card p-5 text-center">
                      <p className="dashboard-stats-value">{bettingStats.totalBets}</p>
                      <p className="text-sm text-gray-600">Today's Bets</p>
                    </div>
                    <div className="dashboard-stats-card p-5 text-center">
                      <p className="dashboard-stats-value">{bettingStats.totalWins}</p>
                      <p className="text-sm text-gray-600">Wins</p>
                    </div>
                    <div className="dashboard-stats-card p-5 text-center">
                      <p className="dashboard-stats-value">{bettingStats.totalLost}</p>
                      <p className="text-sm text-gray-600">Losses</p>
                    </div>
                    <div className="dashboard-stats-card p-5 text-center">
                      <p className="dashboard-stats-value">{bettingStats.winRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Win Rate</p>
                    </div>
                  </div>
                  
                  {/* Recent Bets */}
                  <div>
                    <h4 className="font-bold mb-4 flex items-center text-lg">
                      <CalendarDays className="mr-2 text-indigo-600" size={20} />
                      Recent Bets
                    </h4>
                    {recentBets.length > 0 ? (
                      <div className="dashboard-activity-table rounded-xl overflow-hidden">
                        <table className="min-w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                              <th className="py-3 px-4 text-left rounded-l-xl text-sm font-semibold text-gray-700">Date</th>
                              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Match</th>
                              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                              <th className="py-3 px-4 text-left rounded-r-xl text-sm font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentBets.map((bet) => (
                              <tr key={bet.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-3 px-4">
                                  <div className="font-medium text-gray-800">
                                    {new Date(bet.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(bet.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-gray-700">
                                  Bet on {bet.teamChosen}
                                </td>
                                <td className="py-3 px-4 font-bold text-gray-800">
                                  {bet.amount.toFixed(2)} BDT
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    bet.status === 'Won' ? 'bg-green-100 text-green-800' :
                                    bet.status === 'Lost' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {bet.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                        <div className="text-5xl mb-4">📋</div>
                        <h4 className="text-lg font-medium text-gray-700 mb-2">No bets placed yet</h4>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Start placing bets to see your betting history here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Smart Recommendations */}
              <div className="stunning-card animate-zoom-in delay-500">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <Target className="mr-3" size={28} />
                    Daily Picks
                  </h3>
                </div>
                <div className="p-6">
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
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100 hover:shadow-md transition-all duration-300">
                      <h5 className="font-bold text-green-800 mb-3 flex items-center">
                        <Trophy className="mr-2" size={20} />
                        Bankroll Management
                      </h5>
                      <p className="text-sm text-green-700">
                        Never bet more than <span className="font-semibold">5%</span> of your total bankroll on a single bet.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-300">
                      <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                        <Users className="mr-2" size={20} />
                        Diversification
                      </h5>
                      <p className="text-sm text-blue-700">
                        Spread your bets across different sports to <span className="font-semibold">reduce risk</span>.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-5 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-300">
                      <h5 className="font-bold text-purple-800 mb-3 flex items-center">
                        <Clock className="mr-2" size={20} />
                        Timing
                      </h5>
                      <p className="text-sm text-purple-700">
                        Place bets <span className="font-semibold">early</span> to get the best odds before they change.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-5 rounded-xl border border-yellow-100 hover:shadow-md transition-all duration-300">
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
                    className="stunning-btn stunning-btn-primary w-full mt-8 flex items-center justify-center py-5 hover:scale-[1.02] transition-transform duration-300 animate-pulse-glow"
                  >
                    <Zap className="mr-2" size={22} />
                    Get More Smart Recommendations
                  </button>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="stunning-card animate-zoom-in delay-600">
                <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-6 rounded-t-3xl">
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <History className="mr-3" size={28} />
                    Recent Activity
                  </h3>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="loading-spinner mb-4"></div>
                      <p className="text-gray-500">Loading activity...</p>
                    </div>
                  ) : dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
                    <div className="dashboard-activity-table rounded-xl overflow-hidden">
                      <table className="min-w-full">
                        <thead>
                          <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <th className="py-3 px-4 text-left rounded-l-xl text-sm font-semibold text-gray-700">Date</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                            <th className="py-3 px-4 text-left rounded-r-xl text-sm font-semibold text-gray-700">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[...dashboardData.transactions]
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .slice(0, 5)
                            .map((tx, index) => (
                              <tr 
                                key={tx.id} 
                                className={`border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                              >
                                <td className="py-3 px-4">
                                  <div className="font-medium text-gray-800">
                                    {new Date(tx.date).toLocaleDateString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getTypeClass(tx.type)}`}>
                                    <span className="mr-1">{getStatusIcon(tx.type)}</span>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-bold text-gray-800">
                                  {tx.type === 'Withdrawal' || tx.type === 'Bet' || tx.type === 'Fee' ? '-' : '+'}
                                  {tx.amount.toLocaleString()} BDT
                                </td>
                                <td className="py-3 px-4 text-gray-600 text-sm">
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
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                      <div className="text-6xl mb-4">📋</div>
                      <h4 className="text-xl font-medium text-gray-900 mb-3">No activity yet</h4>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Your recent transactions and betting activity will appear here.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Link 
                          to="/matches" 
                          className="btn btn-primary flex items-center py-3 px-6"
                        >
                          <span className="mr-2">⚽</span>
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
          <div className="stunning-card animate-zoom-in">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <History className="mr-2" size={24} />
                Transaction History
              </h3>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="loading-spinner mb-4"></div>
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
                <div className="dashboard-activity-table rounded-xl overflow-hidden">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <th className="py-3 px-4 text-left rounded-l-xl text-sm font-semibold text-gray-700">📅 Date</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">🔄 Type</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">💵 Amount</th>
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">💰 Balance After</th>
                        <th className="py-3 px-4 text-left rounded-r-xl text-sm font-semibold text-gray-700">📝 Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...dashboardData.transactions]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((tx, index) => (
                          <tr 
                            key={tx.id} 
                            className={`border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-800">
                                {new Date(tx.date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getTypeClass(tx.type)}`}>
                                <span className="mr-1">{getStatusIcon(tx.type)}</span>
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-gray-800">
                              {tx.type === 'Withdrawal' || tx.type === 'Bet' || tx.type === 'Fee' ? '-' : '+'}
                              {tx.amount.toLocaleString()} BDT
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-700">
                              {tx.balanceAfter.toLocaleString()} BDT
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {tx.description}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-6xl mb-4">📋</div>
                  <h4 className="text-xl font-medium text-gray-900 mb-3">No transactions yet</h4>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Your transaction history will appear here once you start making deposits or withdrawals.
                  </p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={handleDeposit} 
                      className="btn btn-success flex items-center py-3 px-6"
                    >
                      <span className="mr-2">📥</span>
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
          <div className="stunning-card animate-zoom-in">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Bell className="mr-2" size={24} />
                Notifications
                {unreadNotifications > 0 && (
                  <span className="ml-3 bg-white text-purple-600 text-sm rounded-full px-3 py-1 font-semibold">
                    {unreadNotifications} unread
                  </span>
                )}
              </h3>
            </div>
            <div className="p-6">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {[...notifications]
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map(notification => (
                      <div 
                        key={notification.id} 
                        className={`dashboard-notification-card p-5 rounded-xl border ${getNotificationClass(notification.type)} ${
                          !notification.read ? 'border-l-4 border-l-blue-500 bg-opacity-70' : 'bg-opacity-50'
                        } transition-all duration-300 hover:shadow-md`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800 text-lg">{notification.title}</h4>
                          {!notification.read && (
                            <button
                              onClick={() => onMarkNotificationRead(notification.id)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                        <p className="text-gray-700 mt-3">{notification.message}</p>
                        <p className="text-sm text-gray-500 mt-4">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                  <div className="text-6xl mb-4">🔔</div>
                  <h4 className="text-xl font-medium text-gray-900 mb-2">No notifications</h4>
                  <p className="text-gray-500">
                    You don't have any notifications at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="stunning-card animate-zoom-in">
            <div className="bg-gradient-to-r from-gray-500 to-gray-700 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Settings className="mr-2" size={24} />
                Account Settings
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <h4 className="font-bold text-lg mb-5 flex items-center text-gray-800">
                    <User className="mr-2" size={22} />
                    Profile Information
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">Full Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={editedUser.name}
                          onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">{editedUser.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">Email Address</label>
                      {isEditingProfile ? (
                        <input
                          type="email"
                          value={editedUser.email}
                          onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">{editedUser.email}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">Phone Number</label>
                      {isEditingProfile ? (
                        <input
                          type="tel"
                          value={editedUser.phone}
                          onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        />
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200">{editedUser.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <h4 className="font-bold text-lg mb-5 flex items-center text-gray-800">
                    <Settings className="mr-2" size={22} />
                    Preferences
                  </h4>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">Risk Level</label>
                      {isEditingProfile ? (
                        <select
                          value={editedUser.riskLevel}
                          onChange={(e) => setEditedUser({...editedUser, riskLevel: e.target.value as 'low' | 'medium' | 'high'})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                        >
                          <option value="low">Low Risk</option>
                          <option value="medium">Medium Risk</option>
                          <option value="high">High Risk</option>
                        </select>
                      ) : (
                        <p className="px-4 py-3 bg-white rounded-xl border border-gray-200 font-semibold capitalize">{editedUser.riskLevel} Risk</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">Favorite Sports</label>
                      {isEditingProfile ? (
                        <div className="flex flex-wrap gap-2">
                          {['Football', 'Cricket', 'Basketball', 'Tennis', 'Hockey'].map(sport => (
                            <label key={sport} className="flex items-center bg-white px-4 py-2 rounded-full border border-gray-200 hover:shadow-sm transition-all duration-300">
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
                                className="mr-2"
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
                    
                    <div>
                      <label className="block text-gray-700 mb-2 font-semibold">Notification Preferences</label>
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
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                {isEditingProfile ? (
                  <div className="flex gap-4 flex-wrap">
                    <button 
                      onClick={saveProfileChanges}
                      className="stunning-btn stunning-btn-success px-8 py-4 flex items-center hover:scale-105 transition-transform duration-300 animate-pulse-glow"
                    >
                      <Save className="mr-2" size={18} />
                      Save Changes
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingProfile(false);
                        setEditedUser({...user});
                      }}
                      className="stunning-btn stunning-btn-secondary px-8 py-4 hover:scale-105 transition-transform duration-300 animate-float"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="stunning-btn stunning-btn-primary px-8 py-4 flex items-center hover:scale-105 transition-transform duration-300 animate-float"
                  >
                    <Edit className="mr-2" size={18} />
                    Edit Profile
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="stunning-btn stunning-btn-danger px-8 py-4 ml-6 hover:scale-105 transition-transform duration-300 animate-pulse-glow"
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

export default DashboardPage;
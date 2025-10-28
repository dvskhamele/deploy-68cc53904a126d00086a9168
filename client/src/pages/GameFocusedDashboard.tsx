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
  Award,
  Flame
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

const GameFocusedDashboard: React.FC<DashboardPageProps> = ({ 
  user, 
  onLogout, 
  onDeposit, 
  onWithdraw,
  getUserDashboard,
  notifications,
  onMarkNotificationRead,
  onShowAssistant,
  // onUpdateProfile
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bets');
  const navigate = useNavigate();
  
  // Profile editing states
  // const [isEditingProfile, setIsEditingProfile] = useState(false);
  // const [editedUser, setEditedUser] = useState<User>({...user});
  // const [profileImage, setProfileImage] = useState<string | null>(null);

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

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return <Plus size={16} />;
      case 'Withdrawal': return <Minus size={16} />;
      case 'Bet': return <Gamepad2 size={16} />;
      case 'Win': return <Trophy size={16} />;
      case 'Bonus': return <Award size={16} />;
      case 'Fee': return <DollarSign size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };
  
  const getTransactionBadgeClass = (type: string) => {
    switch (type) {
      case 'Deposit': return 'dashboard-table-badge deposit';
      case 'Withdrawal': return 'dashboard-table-badge withdrawal';
      case 'Bet': return 'dashboard-table-badge bet';
      case 'Win': return 'dashboard-table-badge win';
      case 'Bonus': return 'dashboard-table-badge bonus';
      case 'Fee': return 'dashboard-table-badge fee';
      default: return 'dashboard-table-badge';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Handle image upload
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       if (event.target?.result) {
  //         setProfileImage(event.target.result as string);
  //       }
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // Handle profile edit
  // const handleEditProfile = () => {
  //   setIsEditingProfile(true);
  //   setEditedUser({...user});
  // };

  // Save profile changes
  // const saveProfileChanges = () => {
  //   onUpdateProfile(editedUser);
  //   setIsEditingProfile(false);
  // };

  // Calculate win rate
  const winRate = dashboardData?.profile?.totalBets && dashboardData.profile.totalBets > 0 
    ? Math.round((dashboardData.profile.totalWins / dashboardData.profile.totalBets) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Game-Style Header */}
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 shadow-2xl border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"
              >
                <div className="relative">
                  <Gamepad2 className="text-yellow-400" size={32} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span>TK999</span>
              </Link>
              <button 
                className="md:hidden bg-purple-700 hover:bg-purple-600 p-2 rounded-lg transition-all"
                onClick={() => setActiveTab(activeTab === 'mobile-menu' ? 'bets' : 'mobile-menu')}
              >
                <Gamepad2 size={24} />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Wallet Balance */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                <DollarSign size={20} />
                <div>
                  <div className="text-xs opacity-80">BALANCE</div>
                  <div className="font-bold text-lg">
                    {dashboardData?.wallet?.balance?.toLocaleString() || user.balance.toLocaleString()} BDT
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/matches" 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Play size={18} />
                  BET NOW
                </Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-all"
                  title="Logout"
                >
                  <span>🚪</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-700/50 to-purple-700/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-500/30 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, <span className="text-yellow-400">{user?.name}</span>!
              </h1>
              <p className="text-blue-200">
                Ready to place some winning bets today? Your next big win is just a click away!
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-blue-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-yellow-400">{winRate}%</div>
                <div className="text-xs text-blue-200">WIN RATE</div>
              </div>
              <div className="bg-purple-800/50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-green-400">{user.totalBets}</div>
                <div className="text-xs text-purple-200">BETS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game-Style Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 hide-scrollbar">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'bets' 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 shadow-lg' 
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('bets')}
          >
            <Trophy className="text-yellow-500" />
            My Bets
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <TrendingUp />
            Overview
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'transactions' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 shadow-lg' 
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('transactions')}
          >
            <Clock />
            Transactions
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'notifications' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell />
            Notifications
            {unreadNotifications > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'assistant' 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                : 'bg-gray-800/50 hover:bg-gray-700/50'
            }`}
            onClick={onShowAssistant}
          >
            <Zap />
            Smart Assistant
          </button>
        </div>

        {/* Bets Tab - Main Focus */}
        {activeTab === 'bets' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Flame className="text-orange-500" />
                Active Bets
              </h2>
              <Link 
                to="/matches" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <Play size={18} />
                Place New Bet
              </Link>
            </div>
            
            {isLoading ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p>Loading your bets...</p>
              </div>
            ) : dashboardData?.bets && dashboardData.bets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.bets.map((bet) => (
                  <div 
                    key={bet.id} 
                    className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 hover:border-yellow-500/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-lg">{bet.teamChosen}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(bet.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        bet.status === 'Won' ? 'bg-green-500/20 text-green-400' :
                        bet.status === 'Lost' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {bet.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Amount:</span>
                        <span className="font-bold">{bet.amount} BDT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Odds:</span>
                        <span className="font-bold text-yellow-400">{bet.odds}</span>
                      </div>
                      {bet.status === 'Pending' && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Potential Win:</span>
                          <span className="font-bold text-green-400">{bet.potentialWin} BDT</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
                <Trophy className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">No Active Bets</h3>
                <p className="text-gray-400 mb-4">You haven't placed any bets yet. Get started now!</p>
                <Link 
                  to="/matches" 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 transition-all transform hover:scale-105"
                >
                  <Play size={18} />
                  Place Your First Bet
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-700/50 to-blue-800/50 backdrop-blur-sm rounded-2xl p-5 border border-blue-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Total Balance</div>
                    <div className="text-2xl font-bold">
                      {dashboardData?.wallet?.balance?.toLocaleString() || user.balance.toLocaleString()} BDT
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('transactions')}
                  className="text-blue-300 hover:text-blue-100 text-sm font-medium flex items-center gap-1"
                >
                  View transaction history →
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-green-700/50 to-green-800/50 backdrop-blur-sm rounded-2xl p-5 border border-green-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-green-200">Win Rate</div>
                    <div className="text-2xl font-bold">{winRate}%</div>
                  </div>
                </div>
                <div className="text-green-300 text-sm">
                  {user.totalWins} wins out of {user.totalBets} bets
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-700/50 to-purple-800/50 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Gamepad2 size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-purple-200">Total Bets</div>
                    <div className="text-2xl font-bold">{user.totalBets}</div>
                  </div>
                </div>
                <div className="text-purple-300 text-sm">
                  Keep up the great work!
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-700/50 to-orange-800/50 backdrop-blur-sm rounded-2xl p-5 border border-orange-500/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600 p-2 rounded-lg">
                    <Star size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-orange-200">Risk Level</div>
                    <div className="text-2xl font-bold capitalize">{user.riskLevel}</div>
                  </div>
                </div>
                <div className="text-orange-300 text-sm">
                  {user.riskLevel === 'low' ? 'Conservative player' : 
                   user.riskLevel === 'medium' ? 'Balanced approach' : 
                   'High roller'}
                </div>
              </div>
            </div>
            
            {/* Profile Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{user?.name}</h3>
                    <div className="text-sm text-gray-400">
                      {user?.role === 'admin' ? 'Administrator' : 
                       user?.role === 'staff' ? 'Staff Member' : 
                       'Premium Member'}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Member since:</span>
                    <span>{new Date(user.registrationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Last login:</span>
                    <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Favorite sports:</span>
                    <span className="text-right">
                      {user.favoriteSports.slice(0, 2).join(', ')}
                      {user.favoriteSports.length > 2 && ` +${user.favoriteSports.length - 2} more`}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-700/50">
                  <Link 
                    to="/profile" 
                    className="w-full bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-center font-medium transition-all block"
                  >
                    View Full Profile
                  </Link>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="text-yellow-500" size={20} />
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    to="/matches" 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-3 rounded-lg text-center font-bold transition-all"
                  >
                    Bet Now
                  </Link>
                  <button 
                    onClick={() => onDeposit(0)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-3 rounded-lg text-center font-bold transition-all"
                  >
                    Deposit
                  </button>
                  <button 
                    onClick={() => onWithdraw(0)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-3 rounded-lg text-center font-bold transition-all"
                  >
                    Withdraw
                  </button>
                  <button 
                    onClick={onShowAssistant}
                    className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 py-3 rounded-lg text-center font-bold transition-all"
                  >
                    Assistant
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
            
            {isLoading ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p>Loading transaction history...</p>
              </div>
            ) : dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left p-4 font-medium">Type</th>
                        <th className="text-left p-4 font-medium">Description</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-right p-4 font-medium">Amount</th>
                        <th className="text-right p-4 font-medium">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.transactions.map((transaction) => (
                        <tr 
                          key={transaction.id} 
                          className="border-t border-gray-700/50 hover:bg-gray-700/30 transition-all"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="text-lg">
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <span className={getTransactionBadgeClass(transaction.type)}>
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{transaction.description}</div>
                          </td>
                          <td className="p-4 text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className={`p-4 text-right font-bold ${
                            transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}{transaction.amount} BDT
                          </td>
                          <td className="p-4 text-right">
                            {transaction.balanceAfter.toLocaleString()} BDT
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
                <Clock className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
                <p className="text-gray-400 mb-4">Your transaction history will appear here.</p>
                <button 
                  onClick={() => onDeposit(0)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-6 py-3 rounded-lg font-bold inline-flex items-center gap-2 transition-all"
                >
                  <Plus size={18} />
                  Make a Deposit
                </button>
              </div>
            )}
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Notifications</h2>
              {unreadNotifications > 0 && (
                <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  {unreadNotifications} unread
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p>Loading notifications...</p>
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-5 border ${
                      notification.read 
                        ? 'border-gray-700/50' 
                        : 'border-yellow-500/50 bg-yellow-500/10'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg mb-2">{notification.title}</h3>
                        <p className="text-gray-300 mb-3">{notification.message}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(notification.date).toLocaleString()}
                        </div>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => onMarkNotificationRead(notification.id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-3 py-1 rounded-full text-sm font-bold"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 text-center">
                <Bell className="mx-auto text-gray-600 mb-4" size={48} />
                <h3 className="text-xl font-bold mb-2">No Notifications</h3>
                <p className="text-gray-400">You're all caught up!</p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Menu */}
        {activeTab === 'mobile-menu' && (
          <div className="md:hidden bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 space-y-3">
            <Link 
              to="/matches" 
              className="block w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-3 rounded-lg font-bold text-center"
            >
              BET NOW
            </Link>
            <Link 
              to="/profile" 
              className="block w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg text-center"
            >
              Profile
            </Link>
            <Link 
              to="/admin" 
              className="block w-full bg-gray-700 hover:bg-gray-600 py-3 rounded-lg text-center"
            >
              Admin Panel
            </Link>
            <button 
              onClick={handleLogout}
              className="block w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-center"
            >
              Logout
            </button>
          </div>
        )}
      </main>

      <style>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default GameFocusedDashboard;
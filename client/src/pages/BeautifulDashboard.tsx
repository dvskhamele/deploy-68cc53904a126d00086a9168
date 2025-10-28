import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  TrendingUp, 
  History, 
  Bell,
  Zap,
  Award,
  Gamepad2,
  Trophy,
  Star,
  Plus,
  Minus,
  AlertCircle,
  DollarSign,
  TrophyIcon,
  Play,
  Flame,
  Crown,
  Target,
  Users,
  Clock,
  Medal,
  Gift,
  Rocket,
  Search,
  Filter,
  Calendar
} from 'lucide-react';

// Import the beautiful solid card CSS
import '../assets/beautiful-solid-cards.css';
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

interface Match {
  id: number;
  teamA: string;
  teamB: string;
  date: string;
  odds: { [key: string]: number };
  result: string | null;
  category: string;
  status: 'upcoming' | 'live' | 'finished';
  liveScore?: { teamA: number; teamB: number };
  popularity?: number;
}

interface DashboardData {
  profile: User | null;
  transactions: Transaction[];
  notifications: Notification[];
  wallet: { balance: number };
  bets: Bet[];
  matches: Match[];
}

interface BeautifulDashboardProps {
  user: User;
  onLogout: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  getUserDashboard: (userId: number) => DashboardData;
  notifications: Notification[];
  onMarkNotificationRead: (id: number) => void;
  onShowAssistant: () => void;
  onUpdateProfile: (updatedUser: User) => void;
  matches: Match[];
  onPlaceBet: (matchId: number, team: string, amount: number) => void;
}

const BeautifulDashboard: React.FC<BeautifulDashboardProps> = ({ 
  user, 
  onLogout, 
  onDeposit, 
  onWithdraw,
  getUserDashboard,
  notifications,
  onMarkNotificationRead,
  onShowAssistant,
  matches,
  onPlaceBet
}) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [betAmount, setBetAmount] = useState(100);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = () => {
      try {
        const data = getUserDashboard(user.id);
        setDashboardData({
          ...data,
          matches: matches
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user.id, getUserDashboard, matches]);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Deposit': return <Plus size={16} />;
      case 'Withdrawal': return <Minus size={16} />;
      case 'Bet': return <Gamepad2 size={16} />;
      case 'Win': return <TrophyIcon size={16} />;
      case 'Bonus': return <Award size={16} />;
      case 'Fee': return <DollarSign size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };
  
  const getTransactionBadgeClass = (type: string) => {
    switch (type) {
      case 'Deposit': return 'beautiful-solid-badge beautiful-solid-badge-success';
      case 'Withdrawal': return 'beautiful-solid-badge beautiful-solid-badge-secondary';
      case 'Bet': return 'beautiful-solid-badge beautiful-solid-badge-primary';
      case 'Win': return 'beautiful-solid-badge beautiful-solid-badge-success';
      case 'Bonus': return 'beautiful-solid-badge beautiful-solid-badge-warning';
      case 'Fee': return 'beautiful-solid-badge beautiful-solid-badge-danger';
      default: return 'beautiful-solid-badge beautiful-solid-badge-secondary';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  // Calculate win rate
  const winRate = dashboardData?.profile?.totalBets && dashboardData.profile.totalBets > 0 
    ? Math.round((dashboardData.profile.totalWins / dashboardData.profile.totalBets) * 100) 
    : 0;

  // Get user level based on total bets
  const getUserLevel = () => {
    const totalBets = user.totalBets;
    if (totalBets < 10) return { level: 1, title: 'Newbie', progress: totalBets * 10 };
    if (totalBets < 50) return { level: 2, title: 'Rookie', progress: (totalBets - 10) * 2.5 };
    if (totalBets < 100) return { level: 3, title: 'Amateur', progress: (totalBets - 50) * 2 };
    if (totalBets < 250) return { level: 4, title: 'Semi-Pro', progress: (totalBets - 100) * 1.67 };
    if (totalBets < 500) return { level: 5, title: 'Professional', progress: (totalBets - 250) * 1.6 };
    return { level: 6, title: 'Legend', progress: 100 };
  };

  const userLevel = getUserLevel();

  // Get recent bets
  const getRecentBets = () => {
    if (!dashboardData || !dashboardData.bets) return [];
    return [...dashboardData.bets]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  };

  const recentBets = getRecentBets();

  // Get live matches
  const getLiveMatches = () => {
    if (!dashboardData || !dashboardData.matches) return [];
    return dashboardData.matches.filter(match => match.status === 'live');
  };

  const liveMatches = getLiveMatches();

  // Get upcoming matches
  const getUpcomingMatches = () => {
    if (!dashboardData || !dashboardData.matches) return [];
    return dashboardData.matches
      .filter(match => match.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const upcomingMatches = getUpcomingMatches();

  // Handle placing a bet
  const handlePlaceBet = (matchId: number, team: string) => {
    const amount = prompt(`Enter amount to bet on ${team}:`, betAmount.toString());
    if (amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0) {
      try {
        onPlaceBet(matchId, team, parseInt(amount));
        setSelectedMatch(null);
        setSelectedTeam('');
      } catch (err: unknown) {
        alert((err as Error).message || 'Failed to place bet');
      }
    } else if (amount) {
      alert('Please enter a valid amount');
    }
  };

  // Handle quick bet
  const handleQuickBet = (matchId: number, team: string, amount: number) => {
    try {
      onPlaceBet(matchId, team, amount);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to place bet');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Beautiful Solid Header */}
      <header className="beautiful-solid-header sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="text-2xl md:text-3xl font-bold text-white flex items-center group"
            >
              <span className="text-2xl md:text-3xl mr-2 group-hover:rotate-12 transition-transform duration-300">🎲</span>
              <span className="font-extrabold text-white">
                TK999
              </span>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 w-full lg:w-auto">
            {/* Wallet Display */}
            <div className="beautiful-solid-wallet-display">
              <DollarSign className="mr-2" size={20} />
              <span className="text-lg font-extrabold">{user.balance.toLocaleString()} BDT</span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-gray-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {userLevel.level}
                </div>
              </div>
              <div className="hidden md:block">
                <p className="text-white font-semibold text-base">{user?.name || 'User'}</p>
                <p className="text-blue-100 text-xs font-medium flex items-center">
                  <Crown className="mr-1" size={12} />
                  {userLevel.title}
                </p>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex space-x-2">
              <Link 
                to="/dashboard" 
                className="beautiful-solid-btn beautiful-solid-btn-primary flex flex-col items-center justify-center min-w-[70px]"
                title="Dashboard"
              >
                <span className="text-xl">📊</span>
                <span className="text-xs mt-1 font-medium">Dashboard</span>
              </Link>
              
              <Link 
                to="/matches" 
                className="beautiful-solid-btn beautiful-solid-btn-primary flex flex-col items-center justify-center min-w-[70px]"
                title="Matches"
              >
                <span className="text-xl">⚽</span>
                <span className="text-xs mt-1 font-medium">Matches</span>
              </Link>
              
              {(user?.role === 'admin' || user?.role === 'staff') && (
                <Link 
                  to="/admin" 
                  className="beautiful-solid-btn beautiful-solid-btn-warning flex flex-col items-center justify-center min-w-[70px]"
                  title="Admin"
                >
                  <span className="text-xl">⚙️</span>
                  <span className="text-xs mt-1 font-medium">Admin</span>
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="beautiful-solid-btn beautiful-solid-btn-danger flex flex-col items-center justify-center min-w-[70px]"
                title="Logout"
              >
                <span className="text-xl">🚪</span>
                <span className="text-xs mt-1 font-medium">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
            <Gamepad2 className="mr-3 text-3xl text-purple-600" />
            <span className="text-gray-800">
              Welcome Back, {user?.name}!
            </span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Ready to place some winning bets today?</p>
        </div>

        {/* Level Progress Card */}
        <div className="beautiful-solid-card mb-6">
          <div className="p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="text-yellow-500" size={20} />
                  <span className="font-bold text-lg">Level {userLevel.level} {userLevel.title}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full" 
                    style={{ width: `${userLevel.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {100 - userLevel.progress}% to next level
              </div>
            </div>
          </div>
        </div>

        {/* Beautiful Solid Tabs */}
        <div className="beautiful-solid-tabs mb-6">
          <button
            className={`beautiful-solid-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Gamepad2 className="text-purple-600" size={18} />
            Dashboard
          </button>
          <button
            className={`beautiful-solid-tab ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            <Trophy size={18} />
            Matches
          </button>
          <button
            className={`beautiful-solid-tab ${activeTab === 'bets' ? 'active' : ''}`}
            onClick={() => setActiveTab('bets')}
          >
            <Flame className="text-orange-500" size={18} />
            My Bets
          </button>
          <button
            className={`beautiful-solid-tab ${activeTab === 'transactions' ? 'active' : ''}`}
            onClick={() => setActiveTab('transactions')}
          >
            <History size={18} />
            Transactions
          </button>
          <button
            className={`beautiful-solid-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            Notifications
            {unreadNotifications > 0 && (
              <span className="beautiful-solid-badge beautiful-solid-badge-danger">
                {unreadNotifications}
              </span>
            )}
          </button>
        </div>

        {/* Dashboard Tab - Main Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="beautiful-solid-stats-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <DollarSign className="text-blue-600" size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Balance</div>
                        <div className="text-xl font-bold text-gray-800">
                          {dashboardData?.wallet?.balance?.toLocaleString() || user.balance.toLocaleString()} BDT
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="beautiful-solid-stats-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Trophy className="text-green-600" size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Win Rate</div>
                        <div className="text-xl font-bold text-gray-800">{winRate}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="beautiful-solid-stats-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Gamepad2 className="text-purple-600" size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Total Bets</div>
                        <div className="text-xl font-bold text-gray-800">{user.totalBets}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="beautiful-solid-stats-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <Star className="text-orange-600" size={24} />
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Level</div>
                        <div className="text-xl font-bold text-gray-800">{userLevel.level}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Live Matches */}
                <div className="beautiful-solid-card">
                  <div className="beautiful-solid-card-header">
                    <Flame className="text-yellow-300 animate-pulse" size={20} />
                    Live Matches
                  </div>
                  <div className="beautiful-solid-card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <Flame className="text-red-500 animate-pulse" size={20} />
                        Live Matches
                      </h3>
                      <Link 
                        to="/matches" 
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View All →
                      </Link>
                    </div>
                    
                    {liveMatches.length > 0 ? (
                      <div className="space-y-4">
                        {liveMatches.slice(0, 3).map((match) => (
                          <div 
                            key={match.id} 
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-purple-300 transition-all"
                          >
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <span className="beautiful-solid-badge beautiful-solid-badge-danger flex items-center">
                                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                                  LIVE
                                </span>
                                <span className="text-xs text-gray-600">{match.category}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mb-3">
                              <div className="font-bold text-gray-800">{match.teamA}</div>
                              <div className="text-2xl font-bold text-red-600">
                                {match.liveScore?.teamA || 0} - {match.liveScore?.teamB || 0}
                              </div>
                              <div className="font-bold text-gray-800">{match.teamB}</div>
                            </div>
                            
                            <div className="grid grid-cols-3 gap-2">
                              {Object.entries(match.odds).map(([team, odd]) => (
                                <button
                                  key={team}
                                  onClick={() => handleQuickBet(match.id, team, 100)}
                                  className="beautiful-solid-btn beautiful-solid-btn-primary py-2 text-center text-sm font-bold"
                                >
                                  {team} {odd.toFixed(2)}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Trophy className="mx-auto mb-3 opacity-50" size={40} />
                        <p>No live matches at the moment</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Recent Bets */}
                <div className="beautiful-solid-card">
                  <div className="beautiful-solid-card-header">
                    <History className="text-green-300" size={20} />
                    Recent Bets
                  </div>
                  <div className="beautiful-solid-card-body">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        <History className="text-green-600" size={20} />
                        Recent Bets
                      </h3>
                      <button 
                        onClick={() => setActiveTab('bets')}
                        className="text-sm text-green-600 hover:text-green-800 font-medium"
                      >
                        View All →
                      </button>
                    </div>
                    
                    {recentBets.length > 0 ? (
                      <div className="space-y-3">
                        {recentBets.map((bet) => (
                          <div 
                            key={bet.id} 
                            className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-green-300 transition-all"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-bold text-gray-800">{bet.teamChosen}</div>
                                <div className="text-sm text-gray-600">
                                  {new Date(bet.date).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-800">{bet.amount} BDT</div>
                                <div className={`text-sm font-bold ${
                                  bet.status === 'Won' ? 'text-green-600' : 
                                  bet.status === 'Lost' ? 'text-red-600' : 'text-yellow-600'
                                }`}>
                                  {bet.status}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Gamepad2 className="mx-auto mb-3 opacity-50" size={40} />
                        <p>You haven't placed any bets yet</p>
                        <Link 
                          to="/matches" 
                          className="mt-3 inline-block beautiful-solid-btn beautiful-solid-btn-primary"
                        >
                          Place Your First Bet
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="beautiful-solid-profile-card">
                  <div className="beautiful-solid-profile-header">
                    <User size={20} />
                    Profile
                  </div>
                  <div className="beautiful-solid-profile-body">
                    <div className="flex flex-col items-center mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <h3 className="font-bold text-lg text-gray-800">{user?.name}</h3>
                      <div className="text-sm text-gray-600 mb-3">
                        {user?.role === 'admin' ? 'Administrator' : 
                         user?.role === 'staff' ? 'Staff Member' : 
                         'Player'}
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full" 
                          style={{ width: `${userLevel.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-600">
                        Level {userLevel.level} {userLevel.title}
                      </div>
                    </div>
                    
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Member since:</span>
                        <span className="text-gray-800">{new Date(user.registrationDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last login:</span>
                        <span className="text-gray-800">{new Date(user.lastLogin).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className="capitalize text-gray-800">{user.riskLevel}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link 
                        to="/profile" 
                        className="w-full beautiful-solid-btn beautiful-solid-btn-secondary text-center font-medium"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
                
                {/* Achievements */}
                <div className="beautiful-solid-card">
                  <div className="beautiful-solid-card-header">
                    <Medal className="text-yellow-300" size={20} />
                    Achievements
                  </div>
                  <div className="beautiful-solid-card-body">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-3 text-center border border-yellow-200">
                        <Trophy className="mx-auto text-yellow-600 mb-1" size={24} />
                        <div className="text-xs font-bold text-gray-800">First Bet</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-3 text-center border border-green-200">
                        <Star className="mx-auto text-green-600 mb-1" size={24} />
                        <div className="text-xs font-bold text-gray-800">Winner</div>
                      </div>
                      <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl p-3 text-center border border-blue-200">
                        <Rocket className="mx-auto text-blue-600 mb-1" size={24} />
                        <div className="text-xs font-bold text-gray-800">5 Bets</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="beautiful-solid-card">
                  <div className="beautiful-solid-card-header">
                    <Zap className="text-yellow-300" size={20} />
                    Quick Actions
                  </div>
                  <div className="beautiful-solid-card-body">
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        to="/matches" 
                        className="beautiful-solid-btn beautiful-solid-btn-primary py-3 text-center font-bold flex items-center justify-center gap-2"
                      >
                        <Play size={16} />
                        Bet
                      </Link>
                      <button 
                        onClick={() => onDeposit(0)}
                        className="beautiful-solid-btn beautiful-solid-btn-success py-3 text-center font-bold flex items-center justify-center gap-2"
                      >
                        <Plus size={16} />
                        Deposit
                      </button>
                      <button 
                        onClick={() => onWithdraw(0)}
                        className="beautiful-solid-btn beautiful-solid-btn-warning py-3 text-center font-bold flex items-center justify-center gap-2"
                      >
                        <Minus size={16} />
                        Withdraw
                      </button>
                      <button 
                        onClick={onShowAssistant}
                        className="beautiful-solid-btn beautiful-solid-btn-secondary py-3 text-center font-bold flex items-center justify-center gap-2"
                      >
                        <Zap size={16} />
                        Assistant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <Trophy className="text-yellow-600" />
                Upcoming Matches
              </h2>
              <Link 
                to="/matches" 
                className="beautiful-solid-btn beautiful-solid-btn-primary flex items-center gap-2"
              >
                <Play size={18} />
                View All Matches
              </Link>
            </div>
            
            {isLoading ? (
              <div className="beautiful-solid-card">
                <div className="beautiful-solid-card-body text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading matches...</p>
                </div>
              </div>
            ) : upcomingMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingMatches.map((match) => (
                  <div 
                    key={match.id} 
                    className="beautiful-solid-match-card"
                  >
                    <div className="beautiful-solid-match-header">
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
                        {match.category}
                      </span>
                      <span className="text-sm">
                        {new Date(match.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="beautiful-solid-match-body">
                      <div className="text-center">
                        <div className="beautiful-solid-match-team">{match.teamA}</div>
                        <div className="beautiful-solid-match-vs">VS</div>
                        <div className="beautiful-solid-match-team">{match.teamB}</div>
                      </div>
                      
                      <div className="beautiful-solid-odds-container">
                        {Object.entries(match.odds).map(([team, odd]) => (
                          <div key={team} className="beautiful-solid-odd-card">
                            <div className="beautiful-solid-odd-team">{team}</div>
                            <div className="beautiful-solid-odd-value">{odd.toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedMatch(match.id);
                          // Auto-select the first team for betting
                          const firstTeam = Object.keys(match.odds)[0];
                          setSelectedTeam(firstTeam);
                        }}
                        className="w-full beautiful-solid-btn beautiful-solid-btn-primary"
                      >
                        Place Bet
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="beautiful-solid-empty-state">
                <Trophy className="beautiful-solid-empty-state-icon" size={48} />
                <h3 className="beautiful-solid-empty-state-title">No Upcoming Matches</h3>
                <p className="beautiful-solid-empty-state-message">Check back later for new matches!</p>
              </div>
            )}
            
            {/* Bet Placement Form (if selected) */}
            {selectedMatch !== null && (
              <div className="beautiful-solid-bet-form animate-pulse">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="beautiful-solid-bet-form-header">
                    <Play className="text-purple-600" size={20} />
                    Place Your Bet
                  </h3>
                  <button 
                    onClick={() => setSelectedMatch(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {(() => {
                  const match = dashboardData?.matches.find(m => m.id === selectedMatch);
                  if (!match) return null;
                  
                  return (
                    <div>
                      <div className="text-center mb-6">
                        <div className="font-bold text-xl text-gray-800">{match.teamA} vs {match.teamB}</div>
                        <div className="text-gray-600">{match.category}</div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold mb-3 text-gray-800">Select Team</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(match.odds).map(([team, odd]) => (
                              <button
                                key={team}
                                onClick={() => setSelectedTeam(team)}
                                className={`py-3 rounded-lg font-bold transition-all ${
                                  selectedTeam === team
                                    ? 'beautiful-solid-btn beautiful-solid-btn-primary'
                                    : 'beautiful-solid-btn beautiful-solid-btn-secondary'
                                }`}
                              >
                                {team}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-bold mb-3 text-gray-800">Bet Amount</h4>
                          <div className="mb-4">
                            <input
                              type="number"
                              value={betAmount}
                              onChange={(e) => setBetAmount(Number(e.target.value))}
                              className="beautiful-solid-input"
                              min="10"
                              max={user.balance}
                            />
                            <div className="text-sm text-gray-600 mt-2">
                              Max: {user.balance} BDT
                            </div>
                          </div>
                          
                          {selectedTeam && (
                            <div className="beautiful-solid-bet-summary">
                              <div className="beautiful-solid-bet-summary-item">
                                <span className="beautiful-solid-bet-summary-label">Selected Team:</span>
                                <span className="beautiful-solid-bet-summary-value">{selectedTeam}</span>
                              </div>
                              <div className="beautiful-solid-bet-summary-item">
                                <span className="beautiful-solid-bet-summary-label">Odds:</span>
                                <span className="beautiful-solid-bet-summary-value">{match.odds[selectedTeam].toFixed(2)}</span>
                              </div>
                              <div className="beautiful-solid-bet-summary-item">
                                <span className="beautiful-solid-bet-summary-label">Potential Win:</span>
                                <span className="beautiful-solid-bet-summary-value highlight">
                                  {(betAmount * match.odds[selectedTeam]).toFixed(2)} BDT
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <button
                            onClick={() => handlePlaceBet(match.id, selectedTeam)}
                            disabled={!selectedTeam || betAmount > user.balance || betAmount < 10}
                            className="w-full beautiful-solid-btn beautiful-solid-btn-success disabled:opacity-50"
                          >
                            Confirm Bet
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* Bets Tab - Main Focus */}
        {activeTab === 'bets' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
                <Flame className="text-orange-600" />
                Active Bets
              </h2>
              <Link 
                to="/matches" 
                className="beautiful-solid-btn beautiful-solid-btn-primary flex items-center gap-2"
              >
                <Play size={18} />
                Place New Bet
              </Link>
            </div>
            
            {isLoading ? (
              <div className="beautiful-solid-card">
                <div className="beautiful-solid-card-body text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading your bets...</p>
                </div>
              </div>
            ) : dashboardData?.bets && dashboardData.bets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.bets.map((bet) => (
                  <div 
                    key={bet.id} 
                    className="beautiful-solid-card"
                  >
                    <div className="beautiful-solid-card-body">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-bold text-lg text-gray-800">{bet.teamChosen}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(bet.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                          bet.status === 'Won' ? 'beautiful-solid-badge beautiful-solid-badge-success' :
                          bet.status === 'Lost' ? 'beautiful-solid-badge beautiful-solid-badge-danger' :
                          'beautiful-solid-badge beautiful-solid-badge-warning'
                        }`}>
                          {bet.status}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-bold text-gray-800">{bet.amount} BDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Odds:</span>
                          <span className="font-bold text-purple-600">{bet.odds}</span>
                        </div>
                        {bet.status === 'Pending' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Potential Win:</span>
                            <span className="font-bold text-green-600">{bet.potentialWin} BDT</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="beautiful-solid-empty-state">
                <Trophy className="beautiful-solid-empty-state-icon" size={48} />
                <h3 className="beautiful-solid-empty-state-title">No Active Bets</h3>
                <p className="beautiful-solid-empty-state-message">You haven't placed any bets yet. Get started now!</p>
                <Link 
                  to="/matches" 
                  className="beautiful-solid-btn beautiful-solid-btn-primary mt-4"
                >
                  <Play size={18} />
                  Place Your First Bet
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Transaction History</h2>
            
            {isLoading ? (
              <div className="beautiful-solid-card">
                <div className="beautiful-solid-card-body text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading transaction history...</p>
                </div>
              </div>
            ) : dashboardData?.transactions && dashboardData.transactions.length > 0 ? (
              <div className="beautiful-solid-table-container">
                <table className="beautiful-solid-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Date</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="text-lg">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <span className={getTransactionBadgeClass(transaction.type)}>
                              {transaction.type}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="font-medium text-gray-800">{transaction.description}</div>
                        </td>
                        <td className="text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className={`text-right font-bold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} BDT
                        </td>
                        <td className="text-right text-gray-800">
                          {transaction.balanceAfter.toLocaleString()} BDT
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="beautiful-solid-empty-state">
                <History className="beautiful-solid-empty-state-icon" size={48} />
                <h3 className="beautiful-solid-empty-state-title">No Transactions Yet</h3>
                <p className="beautiful-solid-empty-state-message">Your transaction history will appear here.</p>
                <button 
                  onClick={() => onDeposit(0)}
                  className="beautiful-solid-btn beautiful-solid-btn-success mt-4"
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
              <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              {unreadNotifications > 0 && (
                <div className="beautiful-solid-badge beautiful-solid-badge-danger">
                  {unreadNotifications} unread
                </div>
              )}
            </div>
            
            {isLoading ? (
              <div className="beautiful-solid-card">
                <div className="beautiful-solid-card-body text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading notifications...</p>
                </div>
              </div>
            ) : notifications && notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`beautiful-solid-notification-card ${
                      !notification.read ? 'unread' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-gray-800">{notification.title}</h3>
                        <p className="text-gray-700 mb-3">{notification.message}</p>
                        <div className="text-sm text-gray-500">
                          {new Date(notification.date).toLocaleString()}
                        </div>
                      </div>
                      {!notification.read && (
                        <button 
                          onClick={() => onMarkNotificationRead(notification.id)}
                          className="beautiful-solid-btn beautiful-solid-btn-primary px-3 py-1 text-sm font-bold"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="beautiful-solid-empty-state">
                <Bell className="beautiful-solid-empty-state-icon" size={48} />
                <h3 className="beautiful-solid-empty-state-title">No Notifications</h3>
                <p className="beautiful-solid-empty-state-message">You're all caught up!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BeautifulDashboard;
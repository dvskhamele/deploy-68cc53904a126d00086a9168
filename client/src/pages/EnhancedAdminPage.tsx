import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  UserCheck,
  UserX,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Menu,
  Home,
  Gamepad2,
  Trophy,
  Calendar,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  UserPlus,
  Lock,
  Mail,
  Phone,
  MapPin,
  Crown,
  Star,
  Target,
  Zap,
  Clock,
  Play,
  Pause,
  Check,
  Minus,
  Hash,
  Award,
  Gift,
  Wallet,
  Database,
  Server,
  Globe,
  Key,
  RefreshCw
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

interface AdminData {
  matches: Match[];
  users: User[];
  bets: Bet[];
  transactions: Transaction[];
  notifications: Notification[];
}

interface Analytics {
  totalUsers: number;
  totalMatches: number;
  totalBets: number;
  totalBetAmount: number;
  totalWins: number;
  totalPayouts: number;
  activeUsers: number;
  popularSports: { sport: string; count: number }[];
  revenue: number;
}

interface AdminPageProps {
  matches: Match[];
  onUpdateMatchResult: (matchId: number, winner: string) => void;
  getAdminData: () => AdminData;
  onLogout: () => void;
  analytics: Analytics;
}

const EnhancedAdminPage: React.FC<AdminPageProps> = ({ 
  matches, 
  onUpdateMatchResult,
  getAdminData,
  onLogout,
  analytics
}) => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [matchStatusFilter, setMatchStatusFilter] = useState('All');
  const [betStatusFilter, setBetStatusFilter] = useState('All');
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [showUserManipulation, setShowUserManipulation] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMatch, setNewMatch] = useState({
    teamA: '',
    teamB: '',
    date: '',
    category: 'Football',
    odds: { teamA: 1.5, draw: 2.0, teamB: 2.5 }
  });
  
  const [userManipulation, setUserManipulation] = useState({
    balance: 0,
    action: 'add' as 'add' | 'subtract' | 'set',
    reason: 'Bonus'
  });

  // Load data when component mounts
  useEffect(() => {
    const fetchData = () => {
      try {
        const data = getAdminData();
        setAdminData(data);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      }
    };

    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [getAdminData]);

  const handleUpdateResult = (matchId: number) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    const teams = [match.teamA, match.teamB, 'Draw'];
    const winner = prompt(`Enter winning team:\nOptions: ${teams.join(', ')}`);
    
    if (winner && teams.includes(winner)) {
      try {
        onUpdateMatchResult(matchId, winner);
        // Refresh data
        const data = getAdminData();
        setAdminData(data);
        alert(`Match result updated successfully! ${winner} won.`);
      } catch (error: unknown) {
        alert((error as Error).message || 'Failed to update result');
      }
    } else if (winner) {
      alert('Please enter a valid team name');
    }
  };

  const handleStartMatch = (matchId: number) => {
    console.log('Starting match:', matchId);
    // In a real implementation, this would update the match status
    alert('Match would be started in a real implementation');
  };

  const handlePauseMatch = (matchId: number) => {
    console.log('Pausing match:', matchId);
    // In a real implementation, this would pause the match
    alert('Match would be paused in a real implementation');
  };

  const handleAddMatch = () => {
    // In a real implementation, this would call an API
    alert('Match would be added in a real implementation');
    setShowAddMatchForm(false);
    setNewMatch({
      teamA: '',
      teamB: '',
      date: '',
      category: 'Football',
      odds: { teamA: 1.5, draw: 2.0, teamB: 2.5 }
    });
  };

  const handleDeleteMatch = (matchId: number) => {
    console.log('Deleting match:', matchId);
    if (window.confirm('Are you sure you want to delete this match?')) {
      // In a real implementation, this would call an API
      alert('Match would be deleted in a real implementation');
    }
  };

  const handleUserManipulation = (user: User) => {
    setSelectedUser(user);
    setShowUserManipulation(true);
  };

  const executeUserManipulation = () => {
    if (!selectedUser) return;
    
    let amount = userManipulation.balance;
    if (userManipulation.action === 'subtract') {
      amount = -amount;
    } else if (userManipulation.action === 'set') {
      // In a real implementation, this would set the balance directly
      alert(`User balance would be set to ${amount} BDT`);
      setShowUserManipulation(false);
      return;
    }
    
    // In a real implementation, this would update the user's balance
    alert(`Added ${amount > 0 ? '+' : ''}${amount} BDT to ${selectedUser.name}'s account. Reason: ${userManipulation.reason}`);
    setShowUserManipulation(false);
  };

  // Filter users based on search and role filter
  const filteredUsers = adminData?.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  }) || [];

  // Filter matches based on search and status filter
  const filteredMatches = matches.filter(match => {
    const matchesSearch = match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          match.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          match.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = matchStatusFilter === 'All' || match.status === matchStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter bets based on status filter
  const filteredBets = adminData?.bets.filter(bet => {
    const matchesStatus = betStatusFilter === 'All' || bet.status === betStatusFilter;
    return matchesStatus;
  }) || [];

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-blue-800 to-purple-800 shadow-2xl border-b border-purple-500">
        <nav className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between">
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
              >
                <div className="relative">
                  <Shield className="text-yellow-400" size={32} />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                <span>TK999 Admin</span>
              </Link>
              <button 
                className="md:hidden bg-purple-700 hover:bg-purple-600 p-2 rounded-lg transition-all"
                onClick={() => setActiveTab(activeTab === 'mobile-menu' ? 'overview' : 'mobile-menu')}
              >
                <Shield size={24} />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl px-4 py-2 flex items-center gap-2 shadow-lg">
                <Crown size={20} />
                <div>
                  <div className="text-xs opacity-80">ADMIN</div>
                  <div className="font-bold">SYSTEM</div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center gap-2">
                <Link 
                  to="/dashboard" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                >
                  <span>📊</span>
                  <span className="hidden lg:inline">Dashboard</span>
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
        </nav>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Shield className="text-yellow-400" />
            Admin Control Center
          </h1>
          <p className="text-blue-200">
            Manage users, matches, and system settings with full administrative privileges
          </p>
        </div>
        
        {/* Enhanced Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2 hide-scrollbar">
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            <Target className="text-yellow-500" />
            Overview
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <Users />
            Users ({adminData?.users.length || 0})
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'matches' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-gray-900 shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('matches')}
          >
            <Trophy />
            Matches ({matches.length})
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'bets' 
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('bets')}
          >
            <Zap />
            Bets ({adminData?.bets.length || 0})
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings />
            Settings
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl p-5 border border-blue-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <Users size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Total Users</div>
                    <div className="text-2xl font-bold">{analytics.totalUsers}</div>
                  </div>
                </div>
                <div className="text-blue-300 text-sm">
                  {analytics.activeUsers} active users
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-700 to-green-800 rounded-2xl p-5 border border-green-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-green-200">Total Matches</div>
                    <div className="text-2xl font-bold">{analytics.totalMatches}</div>
                  </div>
                </div>
                <div className="text-green-300 text-sm">
                  {matches.filter(m => m.status === 'live').length} live matches
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-700 to-purple-800 rounded-2xl p-5 border border-purple-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-600 p-2 rounded-lg">
                    <Zap size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-purple-200">Total Bets</div>
                    <div className="text-2xl font-bold">{analytics.totalBets}</div>
                  </div>
                </div>
                <div className="text-purple-300 text-sm">
                  {analytics.totalBetAmount.toLocaleString()} BDT wagered
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-700 to-orange-800 rounded-2xl p-5 border border-orange-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-600 p-2 rounded-lg">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-orange-200">Revenue</div>
                    <div className="text-2xl font-bold">{analytics.revenue.toLocaleString()} BDT</div>
                  </div>
                </div>
                <div className="text-orange-300 text-sm">
                  {analytics.totalWins} bets won
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="text-yellow-500" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {adminData?.transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                      <div className={`font-bold ${
                        transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} BDT
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Popular Sports */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-500" />
                  Popular Sports
                </h3>
                <div className="space-y-3">
                  {analytics.popularSports.map((sport, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="font-medium">{sport.sport}</div>
                      <div className="bg-blue-600 px-3 py-1 rounded-full text-sm">
                        {sport.count} bets
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Users className="text-blue-400" />
                User Management
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Role</th>
                      <th className="text-left p-4 font-medium">Balance</th>
                      <th className="text-left p-4 font-medium">Stats</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-t border-gray-700 hover:bg-gray-700 transition-all"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-500 to-purple-500 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-sm text-gray-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin' ? 'bg-red-500 text-red-400' :
                            user.role === 'staff' ? 'bg-blue-500 text-blue-400' :
                            'bg-green-500 text-green-400'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="p-4 font-bold">
                          {user.balance.toLocaleString()} BDT
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{user.totalBets} bets</div>
                            <div className="text-gray-400">
                              {user.totalBets > 0 ? Math.round((user.totalWins / user.totalBets) * 100) : 0}% win rate
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleUserManipulation(user)}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 p-2 rounded-lg transition-all"
                              title="Manipulate Balance"
                            >
                              <DollarSign size={16} />
                            </button>
                            <button 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 p-2 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                Match Management
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search matches..."
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={matchStatusFilter}
                  onChange={(e) => setMatchStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
                </select>
                <button 
                  onClick={() => setShowAddMatchForm(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
                >
                  <Plus size={18} />
                  Add Match
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMatches.map((match) => (
                <div key={match.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-4 border border-gray-700 hover:border-yellow-500 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-lg text-center">{match.teamA}</div>
                      <div className="text-center text-gray-400 text-sm my-1">VS</div>
                      <div className="font-bold text-lg text-center">{match.teamB}</div>
                    </div>
                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      match.status === 'live' ? 'bg-red-500 text-red-400 animate-pulse' :
                      match.status === 'finished' ? 'bg-green-500 text-green-400' :
                      'bg-blue-500 text-blue-400'
                    }`}>
                      {match.status}
                    </div>
                  </div>
                  
                  <div className="text-center text-sm text-gray-400 mb-3">
                    {new Date(match.date).toLocaleString()}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="bg-gray-700 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Team A</div>
                      <div className="font-bold">{match.odds.teamA}</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Draw</div>
                      <div className="font-bold">{match.odds.draw}</div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-2">
                      <div className="text-xs text-gray-400">Team B</div>
                      <div className="font-bold">{match.odds.teamB}</div>
                    </div>
                  </div>
                  
                  {match.status === 'live' && match.liveScore && (
                    <div className="text-center mb-3">
                      <div className="text-lg font-bold">
                        {match.liveScore.teamA} - {match.liveScore.teamB}
                      </div>
                      <div className="text-xs text-red-400 animate-pulse">LIVE</div>
                    </div>
                  )}
                  
                  {match.result && (
                    <div className="text-center mb-3">
                      <div className="text-sm text-gray-400">Winner</div>
                      <div className="font-bold text-green-400">{match.result}</div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {match.status === 'upcoming' && (
                      <>
                        <button 
                          onClick={() => handleStartMatch(match.id)}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Start
                        </button>
                        <button 
                          onClick={() => handleUpdateResult(match.id)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Result
                        </button>
                      </>
                    )}
                    {match.status === 'live' && (
                      <>
                        <button 
                          onClick={() => handlePauseMatch(match.id)}
                          className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Pause
                        </button>
                        <button 
                          onClick={() => handleUpdateResult(match.id)}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 py-2 rounded-lg text-sm font-bold transition-all"
                        >
                          Result
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleDeleteMatch(match.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 p-2 rounded-lg transition-all"
                      title="Delete Match"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bets Tab */}
        {activeTab === 'bets' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="text-purple-400" />
                Bet Management
              </h2>
              <select
                className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={betStatusFilter}
                onChange={(e) => setBetStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Match</th>
                      <th className="text-left p-4 font-medium">Selection</th>
                      <th className="text-left p-4 font-medium">Amount</th>
                      <th className="text-left p-4 font-medium">Odds</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-right p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBets.map((bet) => {
                      const user = adminData?.users.find(u => u.id === bet.userId);
                      const match = matches.find(m => m.id === bet.matchId);
                      return (
                                              <tr 
                        key={bet.id} 
                        className="border-t border-gray-700 hover:bg-gray-700 transition-all"
                        >
                          <td className="p-4">
                            <div className="font-medium">{user?.name || 'Unknown User'}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {match ? `${match.teamA} vs ${match.teamB}` : 'Unknown Match'}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">{bet.teamChosen}</div>
                          </td>
                          <td className="p-4 font-bold">
                            {bet.amount} BDT
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-yellow-400">{bet.odds}</div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              bet.status === 'Won' ? 'bg-green-500 text-green-400' :
                              bet.status === 'Lost' ? 'bg-red-500 text-red-400' :
                              'bg-yellow-500 text-yellow-400'
                            }`}>
                              {bet.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 p-2 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="text-indigo-400" />
              System Settings
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Key className="text-yellow-500" />
                  Security Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Admin Password</label>
                    <input
                      type="password"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Two-Factor Authentication</label>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="2fa" className="w-5 h-5" />
                      <label htmlFor="2fa">Enable 2FA for admin access</label>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 px-4 py-2 rounded-lg font-bold transition-all">
                    Update Security Settings
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border border-gray-700">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-500" />
                  System Configuration
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Maintenance Mode</label>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="maintenance" className="w-5 h-5" />
                      <label htmlFor="maintenance">Enable maintenance mode</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Odds Margin</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.05"
                      defaultValue="0.05"
                    />
                  </div>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-4 py-2 rounded-lg font-bold transition-all">
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Match Form Modal */}
        {showAddMatchForm && (
          <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Match</h3>
                <button 
                  onClick={() => setShowAddMatchForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Team A</label>
                  <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newMatch.teamA}
                    onChange={(e) => setNewMatch({...newMatch, teamA: e.target.value})}
                    placeholder="Enter team name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Team B</label>
                  <input
                      type="text"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newMatch.teamB}
                    onChange={(e) => setNewMatch({...newMatch, teamB: e.target.value})}
                    placeholder="Enter team name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Match Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Sport Category</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newMatch.category}
                    onChange={(e) => setNewMatch({...newMatch, category: e.target.value})}
                  >
                    <option value="Football">Football</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Cricket">Cricket</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">Team A Odds</label>
                                          <input
                        type="number"
                        step="0.01"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newMatch.odds.teamA}
                      onChange={(e) => setNewMatch({
                        ...newMatch, 
                        odds: {...newMatch.odds, teamA: parseFloat(e.target.value) || 1.5}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Draw Odds</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={newMatch.odds.draw}
                      onChange={(e) => setNewMatch({
                        ...newMatch, 
                        odds: {...newMatch.odds, draw: parseFloat(e.target.value) || 2.0}
                      })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Team B Odds</label>
                                          <input
                        type="number"
                        step="0.01"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newMatch.odds.teamB}
                      onChange={(e) => setNewMatch({
                        ...newMatch, 
                        odds: {...newMatch.odds, teamB: parseFloat(e.target.value) || 2.5}
                      })}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowAddMatchForm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddMatch}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-2 rounded-lg font-bold transition-all"
                  >
                    Add Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Manipulation Modal */}
        {showUserManipulation && selectedUser && (
          <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Manipulate User Balance</h3>
                <button 
                  onClick={() => setShowUserManipulation(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                <div className="font-bold">{selectedUser.name}</div>
                <div className="text-sm text-gray-400">{selectedUser.email}</div>
                <div className="mt-2">
                  Current Balance: <span className="font-bold">{selectedUser.balance} BDT</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Action</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userManipulation.action}
                    onChange={(e) => setUserManipulation({...userManipulation, action: e.target.value as 'add' | 'subtract' | 'set'})}
                  >
                    <option value="add">Add to Balance</option>
                    <option value="subtract">Subtract from Balance</option>
                    <option value="set">Set Balance</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (BDT)</label>
                                        <input
                        type="number"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={userManipulation.balance}
                    onChange={(e) => setUserManipulation({...userManipulation, balance: parseFloat(e.target.value) || 0})}
                    placeholder="Enter amount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Reason</label>
                  <select
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={userManipulation.reason}
                    onChange={(e) => setUserManipulation({...userManipulation, reason: e.target.value})}
                  >
                    <option value="Bonus">Bonus</option>
                    <option value="Correction">Balance Correction</option>
                    <option value="Refund">Refund</option>
                    <option value="Promotion">Promotional Credit</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowUserManipulation(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={executeUserManipulation}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 py-2 rounded-lg font-bold transition-all"
                  >
                    Apply Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {activeTab === 'mobile-menu' && (
          <div className="md:hidden bg-gray-800 rounded-2xl p-4 space-y-3">
            <Link 
              to="/dashboard" 
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg font-bold text-center"
            >
              User Dashboard
            </Link>
            <Link 
              to="/matches" 
              className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 py-3 rounded-lg font-bold text-center"
            >
              View Matches
            </Link>
            <button 
              onClick={handleLogout}
              className="block w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold text-center"
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

export default EnhancedAdminPage;
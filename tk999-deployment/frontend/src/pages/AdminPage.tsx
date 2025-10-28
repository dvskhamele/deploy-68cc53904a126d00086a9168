import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Trophy, 
  Calendar,
  Target,
  Search,
  Edit,
  Trash2,
  Plus,
  Eye,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle
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

interface AdminData {
  matches: Match[];
  users: User[];
  bets: Bet[];
  transactions: Transaction[];
  notifications: Notification[];
}

interface AdminPageProps {
  matches: Match[];
  onUpdateMatchResult: (matchId: number, winner: string) => void;
  getAdminData: () => AdminData;
  onLogout: () => void;
  analytics: Analytics;
}

const AdminPage: React.FC<AdminPageProps> = ({ 
  matches, 
  onUpdateMatchResult,
  getAdminData,
  onLogout,
  analytics
}) => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [matchStatusFilter, setMatchStatusFilter] = useState('All');
  const [betStatusFilter, setBetStatusFilter] = useState('All');
  const [showAddMatchForm, setShowAddMatchForm] = useState(false);
  const [newMatch, setNewMatch] = useState({
    teamA: '',
    teamB: '',
    date: '',
    category: 'Football',
    odds: { teamA: 1.5, draw: 2.0, teamB: 2.5 }
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
    const winner = prompt(`Enter winning team:
Options: ${teams.join(', ')}`);
    
    if (winner && teams.includes(winner)) {
      try {
        onUpdateMatchResult(matchId, winner);
        // Show success message
        alert(`Match result updated successfully! ${winner} won.`);
      } catch (error: any) {
        alert(error.message || 'Failed to update result');
      }
    } else if (winner) {
      alert('Please enter a valid team name');
    }
  };

  const handleStartMatch = (_matchId: number) => {
    // In a real implementation, this would update the match status
    alert('Match would be started in a real implementation');
  };

  const handlePauseMatch = (_matchId: number) => {
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

  const handleDeleteMatch = (_matchId: number) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      // In a real implementation, this would call an API
      alert('Match would be deleted in a real implementation');
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Visual status indicators
  const getBetStatusIcon = (status: string) => {
    switch (status) {
      case 'Won':
        return '🏆';
      case 'Lost':
        return '❌';
      case 'Pending':
        return '⏳';
      default:
        return '❓';
    }
  };

  const getBetStatusClass = (status: string) => {
    switch (status) {
      case 'Won':
        return 'bg-green-100 text-green-800';
      case 'Lost':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'staff':
        return '💼';
      default:
        return '👤';
    }
  };

  const getUserRoleClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'staff':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  // Filter data based on search and filters
  const filteredUsers = adminData?.users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = userRoleFilter === 'All' || user.role === userRoleFilter;
    return matchesSearch && matchesRole;
  }) || [];

  const filteredMatches = matches.filter(match => {
    const matchesSearch = searchTerm === '' || 
      match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = matchStatusFilter === 'All' || match.status === matchStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredBets = adminData?.bets.filter(bet => {
    const matchesSearch = searchTerm === '' || 
      bet.teamChosen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = betStatusFilter === 'All' || bet.status === betStatusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  // Calculate additional metrics
  const avgBetSize = analytics.totalBets > 0 ? 
    (analytics.totalBetAmount / analytics.totalBets).toFixed(2) : '0.00';
  
  const profitMargin = analytics.totalBetAmount > 0 ? 
    ((analytics.revenue / analytics.totalBetAmount) * 100).toFixed(2) : '0.00';

  // Get current date formatted
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Link 
              to="/admin" 
              className="text-2xl md:text-3xl font-bold text-white flex items-center group"
            >
              <span className="text-2xl md:text-3xl mr-2 group-hover:rotate-12 transition-transform duration-300">🎲</span>
              TK999 Admin
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg">
                Admin
              </div>
              <div className="hidden sm:block">
                <p className="text-white font-semibold">Administrator</p>
                <p className="text-blue-100 text-sm">Admin Panel</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Link 
                to="/dashboard" 
                className="btn btn-success flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
                title="Dashboard"
              >
                <span className="text-2xl">📊</span>
                <span className="text-xs mt-1">User</span>
              </Link>
              
              <Link 
                to="/matches" 
                className="btn btn-primary flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
                title="Matches"
              >
                <span className="text-2xl">⚽</span>
                <span className="text-xs mt-1">Matches</span>
              </Link>
              
              <Link 
                to="/admin" 
                className="btn btn-warning flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
                title="Admin"
              >
                <span className="text-2xl">⚙️</span>
                <span className="text-xs mt-1">Admin</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="btn btn-danger flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
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
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
            <span className="mr-3 text-3xl">⚙️</span>
            Daily Operations
          </h2>
          <p className="text-gray-600 mt-2">{currentDate} - Manage today's matches, users, and bets</p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users, matches, or bets..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddMatchForm(true)}
                  className="btn btn-success flex items-center"
                >
                  <Plus className="mr-2" size={18} />
                  Add Match
                </button>
                
                <button className="btn btn-primary flex items-center">
                  <Eye className="mr-2" size={18} />
                  Reports
                </button>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex flex-wrap border-b mb-6">
              <button
                className={`py-3 px-6 font-medium flex items-center ${
                  activeTab === 'overview' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                <Target className="mr-2" size={18} />
                Overview
              </button>
              <button
                className={`py-3 px-6 font-medium flex items-center ${
                  activeTab === 'users' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('users')}
              >
                <Users className="mr-2" size={18} />
                Users
              </button>
              <button
                className={`py-3 px-6 font-medium flex items-center ${
                  activeTab === 'matches' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('matches')}
              >
                <Trophy className="mr-2" size={18} />
                Matches
              </button>
              <button
                className={`py-3 px-6 font-medium flex items-center ${
                  activeTab === 'bets' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('bets')}
              >
                <Target className="mr-2" size={18} />
                Bets
              </button>
            </div>
          </div>
        </div>

        {/* Add Match Form */}
        {showAddMatchForm && (
          <div className="card mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-600 p-4 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white flex items-center">
                <Plus className="mr-2" size={20} />
                Add New Match
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Team A</label>
                  <input
                    type="text"
                    value={newMatch.teamA}
                    onChange={(e) => setNewMatch({...newMatch, teamA: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter team name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Team B</label>
                  <input
                    type="text"
                    value={newMatch.teamB}
                    onChange={(e) => setNewMatch({...newMatch, teamB: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter team name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={newMatch.date}
                    onChange={(e) => setNewMatch({...newMatch, date: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Sport Category</label>
                  <select
                    value={newMatch.category}
                    onChange={(e) => setNewMatch({...newMatch, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Football">Football</option>
                    <option value="Cricket">Cricket</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Tennis">Tennis</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Team A Odds</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMatch.odds.teamA}
                    onChange={(e) => setNewMatch({
                      ...newMatch, 
                      odds: {...newMatch.odds, teamA: parseFloat(e.target.value) || 1.5}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Draw Odds</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMatch.odds.draw}
                    onChange={(e) => setNewMatch({
                      ...newMatch, 
                      odds: {...newMatch.odds, draw: parseFloat(e.target.value) || 2.0}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Team B Odds</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMatch.odds.teamB}
                    onChange={(e) => setNewMatch({
                      ...newMatch, 
                      odds: {...newMatch.odds, teamB: parseFloat(e.target.value) || 2.5}
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowAddMatchForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMatch}
                  className="btn btn-success"
                >
                  Add Match
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Time Range Selector */}
            <div className="mb-6 flex justify-end">
              <div className="flex bg-white rounded-lg shadow">
                {['24h', '7d', '30d'].map((range) => (
                  <button
                    key={range}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      timeRange === range
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setTimeRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-blue-100">Total Users</p>
                      <h3 className="text-3xl font-bold mt-2">{analytics.totalUsers}</h3>
                    </div>
                    <Users size={32} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-blue-400">
                    <p className="text-blue-100 text-sm">
                      <span className="font-bold">{analytics.activeUsers}</span> active users
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-r from-green-500 to-green-600 text-white">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-green-100">Total Bets</p>
                      <h3 className="text-3xl font-bold mt-2">{analytics.totalBets}</h3>
                    </div>
                    <Trophy size={32} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-green-400">
                    <p className="text-green-100 text-sm">
                      Avg. bet: {avgBetSize} BDT
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-purple-100">Revenue</p>
                      <h3 className="text-3xl font-bold mt-2">{analytics.revenue.toFixed(2)} BDT</h3>
                    </div>
                    <Target size={32} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-purple-400">
                    <p className="text-purple-100 text-sm">
                      Margin: {profitMargin}%
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="card bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-yellow-100">Matches</p>
                      <h3 className="text-3xl font-bold mt-2">{analytics.totalMatches}</h3>
                    </div>
                    <Calendar size={32} />
                  </div>
                  <div className="mt-4 pt-4 border-t border-yellow-400">
                    <p className="text-yellow-100 text-sm">
                      {matches.filter(m => m.status === 'live').length} live now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="card lg:col-span-2">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Trophy className="mr-2" />
                    Today's Matches
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left rounded-l-lg">Match</th>
                          <th className="py-3 px-4 text-left">Time</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left rounded-r-lg">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredMatches
                          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .slice(0, 5)
                          .map((match, index) => (
                            <tr 
                              key={match.id} 
                              className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {match.teamA} vs {match.teamB}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  match.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                  match.status === 'live' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {match.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-2">
                                  {match.status === 'upcoming' && (
                                    <button 
                                      onClick={() => handleStartMatch(match.id)}
                                      className="text-green-600 hover:text-green-800"
                                      title="Start Match"
                                    >
                                      <Play size={18} />
                                    </button>
                                  )}
                                  {match.status === 'live' && (
                                    <button 
                                      onClick={() => handlePauseMatch(match.id)}
                                      className="text-yellow-600 hover:text-yellow-800"
                                      title="Pause Match"
                                    >
                                      <Pause size={18} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleUpdateResult(match.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Update Result"
                                  >
                                    <Edit size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <AlertCircle className="mr-2" />
                    Alerts
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="text-yellow-500 mr-3" size={24} />
                        <div>
                          <h4 className="font-bold text-gray-800">3 Pending Results</h4>
                          <p className="text-sm text-gray-600 mt-1">Matches that need results entered</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 mr-3" size={24} />
                        <div>
                          <h4 className="font-bold text-gray-800">High Activity</h4>
                          <p className="text-sm text-gray-600 mt-1">Betting volume is 25% above average</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <Clock className="text-blue-500 mr-3" size={24} />
                        <div>
                          <h4 className="font-bold text-gray-800">5 Upcoming Matches</h4>
                          <p className="text-sm text-gray-600 mt-1">Scheduled for the next 2 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Trophy className="mr-2" />
                    Recent Matches
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left rounded-l-lg">Match</th>
                          <th className="py-3 px-4 text-left">Date</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-left rounded-r-lg">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminData && adminData.matches
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .slice(0, 5)
                          .map((match, index) => (
                            <tr 
                              key={match.id} 
                              className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {match.teamA} vs {match.teamB}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {new Date(match.date).toLocaleDateString()}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  match.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                                  match.status === 'live' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {match.status}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                {match.result || 'Pending'}
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <Users className="mr-2" />
                    Recent Users
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="py-3 px-4 text-left rounded-l-lg">Name</th>
                          <th className="py-3 px-4 text-left">Email</th>
                          <th className="py-3 px-4 text-left rounded-r-lg">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminData && adminData.users
                          .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
                          .slice(0, 5)
                          .map((user, index) => (
                            <tr 
                              key={user.id} 
                              className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                            >
                              <td className="py-3 px-4 font-medium">
                                {user.name}
                              </td>
                              <td className="py-3 px-4 text-sm">
                                {user.email}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUserRoleClass(user.role)}`}>
                                  {getUserRoleIcon(user.role)} {user.role}
                                </span>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Users className="mr-2" />
                  User Management
                </h3>
                
                <div className="flex gap-3">
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="All">All Roles</option>
                    <option value="user">Users</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admins</option>
                  </select>
                  
                  <button className="btn btn-primary flex items-center">
                    <Plus className="mr-2" size={18} />
                    Add User
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left rounded-l-lg">Name</th>
                      <th className="py-3 px-4 text-left">Email</th>
                      <th className="py-3 px-4 text-left">Role</th>
                      <th className="py-3 px-4 text-left">Balance</th>
                      <th className="py-3 px-4 text-left">Bets</th>
                      <th className="py-3 px-4 text-left rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers
                      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
                      .map((user, index) => (
                        <tr 
                          key={user.id} 
                          className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="py-3 px-4 font-medium">
                            {user.name}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {user.email}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getUserRoleClass(user.role)}`}>
                              {getUserRoleIcon(user.role)} {user.role}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {user.balance.toFixed(2)} BDT
                          </td>
                          <td className="py-3 px-4">
                            {user.totalBets} bets
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye size={18} />
                              </button>
                              <button className="text-green-600 hover:text-green-800">
                                <Edit size={18} />
                              </button>
                              <button className="text-red-600 hover:text-red-800">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Matches Tab */}
        {activeTab === 'matches' && (
          <div className="card">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Trophy className="mr-2" />
                  Daily Match Management
                </h3>
                
                <div className="flex gap-3">
                  <select
                    value={matchStatusFilter}
                    onChange={(e) => setMatchStatusFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="All">All Statuses</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left rounded-l-lg">Match</th>
                      <th className="py-3 px-4 text-left">Time</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Result</th>
                      <th className="py-3 px-4 text-left rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMatches
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((match, index) => (
                        <tr 
                          key={match.id} 
                          className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                          <td className="py-3 px-4 font-medium">
                            {match.teamA} vs {match.teamB}
                          </td>
                          <td className="py-3 px-4">
                            {new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              match.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              match.status === 'live' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {match.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {match.result || 'Pending'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              {match.status === 'upcoming' && (
                                <button 
                                  onClick={() => handleStartMatch(match.id)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Start Match"
                                >
                                  <Play size={18} />
                                </button>
                              )}
                              {match.status === 'live' && (
                                <button 
                                  onClick={() => handlePauseMatch(match.id)}
                                  className="text-yellow-600 hover:text-yellow-800"
                                  title="Pause Match"
                                >
                                  <Pause size={18} />
                                </button>
                              )}
                              {!match.result && match.status !== 'finished' && (
                                <button
                                  onClick={() => handleUpdateResult(match.id)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Update Result"
                                >
                                  <Edit size={18} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteMatch(match.id)}
                                className="text-red-600 hover:text-red-800"
                                title="Delete Match"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bets Tab */}
        {activeTab === 'bets' && (
          <div className="card">
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center">
                  <Target className="mr-2" />
                  Daily Bets
                </h3>
                
                <div className="flex gap-3">
                  <select
                    value={betStatusFilter}
                    onChange={(e) => setBetStatusFilter(e.target.value)}
                    className="border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 text-left rounded-l-lg">User</th>
                      <th className="py-3 px-4 text-left">Match</th>
                      <th className="py-3 px-4 text-left">Team</th>
                      <th className="py-3 px-4 text-left">Amount</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left rounded-r-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBets
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((bet, index) => {
                        const user = adminData?.users.find(u => u.id === bet.userId);
                        const match = adminData?.matches.find(m => m.id === bet.matchId);
                        return (
                          <tr 
                            key={bet.id} 
                            className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                          >
                            <td className="py-3 px-4 font-medium">
                              {user ? user.name : `User #${bet.userId}`}
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {match ? `${match.teamA} vs ${match.teamB}` : `Match #${bet.matchId}`}
                            </td>
                            <td className="py-3 px-4">
                              {bet.teamChosen}
                            </td>
                            <td className="py-3 px-4 font-bold text-gray-800">
                              {bet.amount.toFixed(2)} BDT
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getBetStatusClass(bet.status)}`}>
                                {getBetStatusIcon(bet.status)} {bet.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              {new Date(bet.date).toLocaleDateString()}
                            </td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
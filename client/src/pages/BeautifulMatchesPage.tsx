import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Gamepad2, 
  Play, 
  DollarSign, 
  Flame, 
  Crown, 
  Target,
  User,
  Plus,
  Minus
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

interface BeautifulMatchesPageProps {
  user: User;
  matches: Match[];
  onPlaceBet: (matchId: number, team: string, amount: number) => void;
  onLogout: () => void;
  onShowAssistant: () => void;
}

const BeautifulMatchesPage: React.FC<BeautifulMatchesPageProps> = ({ 
  user, 
  matches, 
  onPlaceBet,
  onLogout,
  onShowAssistant
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [betAmount, setBetAmount] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const handlePlaceBet = (matchId: number, team: string) => {
    const amount = prompt(`Enter amount to bet on ${team}:`, betAmount.toString());
    if (amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0) {
      try {
        onPlaceBet(matchId, team, parseInt(amount));
        setSelectedMatch(null);
        setSelectedTeam('');
      } catch (err: unknown) {
        setError((err as Error).message || 'Failed to place bet');
        setTimeout(() => setError(''), 3000);
      }
    } else if (amount) {
      alert('Please enter a valid amount');
    }
  };

  const handleQuickBet = (matchId: number, team: string, amount: number) => {
    try {
      onPlaceBet(matchId, team, amount);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to place bet');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Group matches by category
  const matchesByCategory: { [key: string]: Match[] } = {
    'All': matches
  };
  
  matches.forEach(match => {
    if (!matchesByCategory[match.category]) {
      matchesByCategory[match.category] = [];
    }
    matchesByCategory[match.category].push(match);
  });

  // Filter and sort matches
  const filteredMatches = matches.filter(match => {
    // Category filter
    const categoryMatch = activeCategory === 'All' || match.category === activeCategory;
    
    // Status filter
    const statusMatch = statusFilter === 'All' || match.status === statusFilter;
    
    // Search term filter
    const searchMatch = searchTerm === '' || 
      match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && statusMatch && searchMatch;
  });

  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === 'popularity') {
      return (b.popularity || 0) - (a.popularity || 0);
    } else {
      return a.category.localeCompare(b.category);
    }
  });

  const getSportIcon = (category: string) => {
    switch (category) {
      case 'Cricket':
        return '🏏';
      case 'Football':
        return '⚽';
      case 'Basketball':
        return '🏀';
      case 'Tennis':
        return '🎾';
      default:
        return '🏆';
    }
  };

  // Get user's favorite teams
  const getFavoriteTeams = () => {
    const allTeams = matches.flatMap(match => [match.teamA, match.teamB]);
    return [...new Set(allTeams)].slice(0, 5);
  };

  const favoriteTeams = getFavoriteTeams();

  // Get unique categories for filter
  const categories = ['All', ...Object.keys(matchesByCategory).filter(cat => cat !== 'All')];

  // Get user level
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

  // Calculate win rate
  const winRate = user.totalBets > 0 ? 
    ((user.totalWins / user.totalBets) * 100).toFixed(1) : '0.0';

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
                className="beautiful-solid-btn beautiful-solid-btn-primary flex flex-col items-center justify-center min-w-[70px] border-2 border-yellow-300"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
            <Gamepad2 className="mr-3 text-3xl text-purple-600" />
            <span className="text-gray-800">
              Match Arena
            </span>
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Choose your matches and place your bets to climb the leaderboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl text-center font-semibold border-l-4 border-red-500">
            {error}
          </div>
        )}

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

        {/* Search and Filters */}
        <div className="beautiful-solid-card mb-8">
          <div className="beautiful-solid-card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-1/3">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search matches, teams, or sports..."
                  className="beautiful-solid-input pl-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="beautiful-solid-btn beautiful-solid-btn-primary flex items-center"
                >
                  <Filter className="mr-2" size={18} />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                
                <button
                  onClick={onShowAssistant}
                  className="beautiful-solid-btn beautiful-solid-btn-secondary flex items-center"
                >
                  <Zap className="mr-2" size={18} />
                  Smart Tips
                </button>
              </div>
            </div>
              
              {/* Advanced Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-5 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="beautiful-solid-input"
                    >
                      <option value="All">All Statuses</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="live">Live</option>
                      <option value="finished">Finished</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setStatusFilter('All');
                        setSearchTerm('');
                      }}
                      className="beautiful-solid-btn beautiful-solid-btn-secondary w-full"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center shadow-sm hover:shadow-md ${
                      activeCategory === 'All'
                        ? 'beautiful-solid-btn beautiful-solid-btn-primary'
                        : 'beautiful-solid-btn beautiful-solid-btn-secondary'
                    }`}
                    onClick={() => setActiveCategory('All')}
                  >
                    <Trophy className="mr-2" size={16} />
                    All Sports
                  </button>
                  {categories
                    .filter(cat => cat !== 'All')
                    .map(category => (
                      <button
                        key={category}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center shadow-sm hover:shadow-md ${
                          activeCategory === category
                            ? 'beautiful-solid-btn beautiful-solid-btn-primary'
                            : 'beautiful-solid-btn beautiful-solid-btn-secondary'
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        <span className="mr-2">{getSportIcon(category)}</span>
                        {category}
                      </button>
                    ))
                  }
                </div>
                
                <div className="flex gap-3 mt-4 md:mt-0">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="beautiful-solid-input"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="popularity">Sort by Popularity</option>
                    <option value="sport">Sort by Sport</option>
                  </select>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="beautiful-solid-stats-card">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="text-red-500 mr-2 animate-pulse" size={20} />
                    <p className="text-2xl font-bold text-red-600">{matches.filter(m => m.status === 'live').length}</p>
                  </div>
                  <p className="text-sm text-gray-600">Live Matches</p>
                </div>
                <div className="beautiful-solid-stats-card">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="text-blue-500 mr-2" size={20} />
                    <p className="text-2xl font-bold text-blue-600">{matches.filter(m => m.status === 'upcoming').length}</p>
                  </div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                </div>
                <div className="beautiful-solid-stats-card">
                  <div className="flex items-center justify-center mb-2">
                    <Star className="text-purple-500 mr-2" size={20} />
                    <p className="text-2xl font-bold text-purple-600">{user.favoriteSports.length}</p>
                  </div>
                  <p className="text-sm text-gray-600">Favorite Sports</p>
                </div>
                <div className="beautiful-solid-stats-card">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="text-green-500 mr-2" size={20} />
                    <p className="text-2xl font-bold text-green-600">{winRate}%</p>
                  </div>
                  <p className="text-sm text-gray-600">Win Rate</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Smart Recommendations */}
        <div className="beautiful-solid-card mx-4 md:mx-6 mb-8">
          <div className="beautiful-solid-card-header">
            <Zap className="text-yellow-300" size={22} />
            Daily Picks for You
          </div>
          <div className="beautiful-solid-card-body">
            <div className="flex flex-wrap gap-4">
              {favoriteTeams.map((team: string) => (
                <div key={team} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl flex-1 min-w-[200px] border border-blue-200 hover:shadow-md transition-all duration-300">
                  <h4 className="font-bold text-gray-800 text-lg">{team}</h4>
                  <p className="text-sm text-gray-600 mt-2">Based on your preferences</p>
                  <button
                      onClick={() => {
                        // Find upcoming match for this team
                        const match = matches.find(m => 
                          m.status === 'upcoming' && 
                          (m.teamA === team || m.teamB === team)
                        );
                        if (match) {
                          setSelectedMatch(match.id);
                          // Auto-select the team
                          setSelectedTeam(match.teamA === team ? match.teamA : match.teamB);
                        }
                      }}
                      className="beautiful-solid-btn beautiful-solid-btn-primary text-sm mt-4 w-full"
                    >
                      View Picks
                    </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Matches List */}
        <div className="container mx-auto px-4 md:px-6">
          {sortedMatches.length > 0 ? (
            sortedMatches.map((match) => (
              <div key={match.id} className="beautiful-solid-match-card mb-6">
                <div className="beautiful-solid-match-header">
                  <span className="text-2xl mr-3">{getSportIcon(match.category)}</span>
                  <div>
                    <h3 className="text-xl font-bold">{match.teamA} vs {match.teamB}</h3>
                    <p className="text-sm opacity-90">{match.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      match.status === 'live' 
                        ? 'beautiful-solid-badge beautiful-solid-badge-danger animate-pulse' 
                        : match.status === 'upcoming' 
                          ? 'beautiful-solid-badge beautiful-solid-badge-primary' 
                          : 'beautiful-solid-badge beautiful-solid-badge-secondary'
                    }`}>
                      {match.status === 'live' ? '🔴 LIVE' : match.status === 'upcoming' ? '⏰ UPCOMING' : '✅ FINISHED'}
                    </span>
                  </div>
                </div>
                
                <div className="beautiful-solid-match-body">
                  {/* Live Score (if applicable) */}
                  {match.status === 'live' && match.liveScore && (
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5 mb-6 text-center">
                      <div className="text-4xl font-bold text-red-600">
                        {match.liveScore.teamA} - {match.liveScore.teamB}
                      </div>
                      <p className="text-red-700 font-semibold mt-2">LIVE SCORE</p>
                    </div>
                  )}
                  
                  {/* Match Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Teams and Odds */}
                    <div className="md:col-span-2">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Object.entries(match.odds).map(([team, odd]) => (
                          <div 
                            key={team} 
                            className="border rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-gray-200"
                          >
                            <h4 className="font-bold mb-3 text-lg text-gray-800">{team}</h4>
                            <div className="text-3xl font-bold text-purple-600 mb-4">{odd.toFixed(2)}</div>
                            
                            {/* Quick Bet Buttons */}
                            <div className="flex gap-2 justify-center mb-4">
                              {[100, 250, 500].map(amount => (
                                <button
                                  key={amount}
                                  onClick={() => handleQuickBet(match.id, team, amount)}
                                  className="beautiful-solid-btn beautiful-solid-btn-secondary px-3 py-1 text-sm"
                                  disabled={match.status !== 'upcoming' || user.balance < amount}
                                >
                                  {amount}
                                </button>
                              ))}
                            </div>
                            
                            <button
                              onClick={() => {
                                setSelectedMatch(match.id);
                                setSelectedTeam(team);
                              }}
                              className="beautiful-solid-btn beautiful-solid-btn-primary w-full py-3 rounded-lg font-semibold"
                              disabled={match.status !== 'upcoming'}
                              title={match.status !== 'upcoming' ? "Match not available for betting" : `Bet on ${team}`}
                            >
                              <Play className="mr-2 inline" size={18} />
                              Bet Now
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Match Info */}
                    <div className="border rounded-2xl p-5 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
                      <h4 className="font-bold mb-4 flex items-center text-lg text-gray-800">
                        <TrendingUp className="mr-2 text-purple-600" size={20} />
                        Match Info
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">{new Date(match.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Time:</span>
                          <span className="font-medium">{new Date(match.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sport:</span>
                          <span className="font-medium">{match.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className="font-medium capitalize">{match.status}</span>
                        </div>
                        
                        {match.popularity && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Popularity:</span>
                            <span className="font-medium">
                              {match.popularity}/100
                            </span>
                          </div>
                        )}
                        
                        {match.result && (
                          <div className="pt-4 mt-4 border-t border-gray-200">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Result:</span>
                              <span className="font-bold text-green-600">{match.result}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bet Placement Form (if selected) */}
                  {selectedMatch === match.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-bold text-xl mb-5 text-gray-800">Place Your Bet</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2">
                          <div className="beautiful-solid-bet-summary">
                            <div className="beautiful-solid-bet-summary-item">
                              <span className="beautiful-solid-bet-summary-label">Selected Team:</span>
                              <span className="beautiful-solid-bet-summary-value highlight">{selectedTeam}</span>
                            </div>
                            <div className="beautiful-solid-bet-summary-item">
                              <span className="beautiful-solid-bet-summary-label">Odds:</span>
                              <span className="beautiful-solid-bet-summary-value highlight">
                                {match.odds[selectedTeam]?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 font-medium mb-3">
                            Bet Amount (BDT)
                          </label>
                          <input
                            type="number"
                            value={betAmount}
                            onChange={(e) => setBetAmount(Number(e.target.value))}
                            className="beautiful-solid-input"
                            min="10"
                            max={user.balance}
                          />
                          <div className="mt-3 text-sm text-gray-600">
                            Max: {user.balance} BDT
                          </div>
                          <div className="mt-3 text-sm font-medium">
                            Potential Win: <span className="text-green-600 font-bold">
                              {(betAmount * (match.odds[selectedTeam] || 1)).toFixed(2)} BDT
                            </span>
                          </div>
                          <button
                            onClick={() => handlePlaceBet(match.id, selectedTeam)}
                            className="beautiful-solid-btn beautiful-solid-btn-success w-full mt-6 py-3 font-semibold"
                            disabled={betAmount > user.balance || betAmount < 10}
                          >
                            <Play className="mr-2 inline" size={18} />
                            Confirm Bet
                          </button>
                          <button
                            onClick={() => {
                              setSelectedMatch(null);
                              setSelectedTeam('');
                            }}
                            className="beautiful-solid-btn beautiful-solid-btn-secondary w-full mt-4 py-3 font-semibold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="beautiful-solid-empty-state">
              <div className="text-7xl mb-6">⚽</div>
              <h3 className="beautiful-solid-empty-state-title">No Matches Found</h3>
              <p className="beautiful-solid-empty-state-message">
                There are currently no matches matching your filters. Try adjusting your filters or check back later for new matches!
              </p>
              <button
                onClick={() => {
                  setActiveCategory('All');
                  setStatusFilter('All');
                  setSearchTerm('');
                }}
                className="beautiful-solid-btn beautiful-solid-btn-primary mt-4"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default BeautifulMatchesPage;
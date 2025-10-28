// src/components/Matches.tsx
import React, { useState } from 'react';
import { Search, Filter, Calendar, TrendingUp, Trophy, Star } from 'lucide-react';
import { MatchCard } from './MatchCard';
import { useBetting } from '../contexts/BettingContext';

interface Match {
  id: number;
  teamA: string;
  teamB: string;
  date: string;
  category: string;
  odds: {
    teamA: number;
    draw: number | null;
    teamB: number;
  };
  status: string;
  live: boolean;
}

export const Matches: React.FC<{ user: any; matches: Match[] }> = ({ user, matches }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('All Sports');
  const [selectedTimeframe, setSelectedTimeframe] = useState('All');
  const [sortBy, setSortBy] = useState('Date');
  const [showFilters, setShowFilters] = useState(false);
  
  const { placeBet } = useBetting();

  // Filter matches based on search and filters
  const filteredMatches = matches.filter(match => {
    const matchesSearch = 
      match.teamA.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.teamB.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSport = selectedSport === 'All Sports' || match.category === selectedSport;
    
    let matchesTimeframe = true;
    if (selectedTimeframe === 'Live') {
      matchesTimeframe = match.live;
    } else if (selectedTimeframe === 'Upcoming') {
      matchesTimeframe = !match.live && new Date(match.date) > new Date();
    } else if (selectedTimeframe === 'Past') {
      matchesTimeframe = new Date(match.date) < new Date();
    }
    
    return matchesSearch && matchesSport && matchesTimeframe;
  });

  // Sort matches
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'Date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    // Add more sort options as needed
    return 0;
  });

  // Group matches by status
  const liveMatches = sortedMatches.filter(match => match.live);
  const upcomingMatches = sortedMatches.filter(match => !match.live && new Date(match.date) > new Date());

  // Get unique sports for filter dropdown
  const sports = ['All Sports', ...Array.from(new Set(matches.map(match => match.category)))];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Play Today</h1>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search matches, teams, or sports..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button 
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5" />
            Show Filters
          </button>
        </div>

        {/* Additional Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                {sports.map(sport => (
                  <option key={sport} value={sport}>{sport}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Live">Live</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Past">Past</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="Date">Date</option>
                <option value="Odds">Odds</option>
              </select>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Live Matches</p>
                <p className="text-2xl font-bold">{liveMatches.length}</p>
              </div>
              <TrendingUp className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Upcoming</p>
                <p className="text-2xl font-bold">{upcomingMatches.length}</p>
              </div>
              <Calendar className="h-8 w-8 opacity-80" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Favorite Sports</p>
                <p className="text-2xl font-bold">{sports.length - 1}</p>
              </div>
              <Star className="h-8 w-8 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Match Sections */}
      {liveMatches.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Live Matches ({liveMatches.length})
          </h2>
          <div className="space-y-4">
            {liveMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                user={user} 
                onPlaceBet={placeBet}
              />
            ))}
          </div>
        </div>
      )}

      {upcomingMatches.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-500" />
            Upcoming ({upcomingMatches.length})
          </h2>
          <div className="space-y-4">
            {upcomingMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                user={user} 
                onPlaceBet={placeBet}
              />
            ))}
          </div>
        </div>
      )}

      {/* No matches found */}
      {liveMatches.length === 0 && upcomingMatches.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Matches Found</h3>
          <p className="text-gray-500 mb-4">
            There are currently no matches matching your filters. Try adjusting your filters or check back later for new matches!
          </p>
          <button 
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all"
            onClick={() => {
              setSearchTerm('');
              setSelectedSport('All Sports');
              setSelectedTimeframe('All');
              setSortBy('Date');
              setShowFilters(false);
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
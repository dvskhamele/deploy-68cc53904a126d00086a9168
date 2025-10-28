import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, Target, Lightbulb } from 'lucide-react';

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

interface SmartAssistantProps {
  currentUser: User | null;
  matches: Match[];
  onPlaceBet: (matchId: number, team: string, amount: number) => void;
  onClose: () => void;
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ 
  currentUser, 
  matches, 
  onPlaceBet,
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [betAmount, setBetAmount] = useState(100);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  // Generate smart recommendations
  const getRecommendations = () => {
    if (!currentUser) return [];
    
    // High probability bets based on user preferences
    const preferredMatches = matches.filter(match => 
      currentUser.favoriteSports.includes(match.category) &&
      match.status === 'upcoming'
    );
    
    // Value bets (high odds)
    const valueBets = matches.filter(match => 
      match.status === 'upcoming' &&
      Object.values(match.odds).some(odds => odds > 2.5)
    );
    
    // Popular bets (many users betting)
    const popularBets = matches.filter(match => 
      match.status === 'upcoming'
    ).slice(0, 3);
    
    return [
      ...preferredMatches.slice(0, 2),
      ...valueBets.slice(0, 2),
      ...popularBets
    ].slice(0, 5);
  };

  // Get betting tips
  const getBettingTips = () => {
    if (!currentUser) return [];
    
    const tips = [
      "Consider diversifying your bets across different sports to reduce risk",
      "Look for value bets where the odds seem higher than the team's actual chances",
      "Set a budget and stick to it - responsible gambling is key to long-term success",
      "Track your betting history to identify patterns in your wins and losses",
      "Take breaks from betting to maintain a healthy perspective"
    ];
    
    // Personalized tips based on user data
    if (currentUser.totalBets > 50 && currentUser.totalWins / currentUser.totalBets < 0.4) {
      tips.push("Your win rate is below average. Consider reducing bet sizes or focusing on safer bets.");
    }
    
    if (currentUser.balance > 5000) {
      tips.push("With your current balance, you could explore higher-value bets with better odds.");
    }
    
    return tips;
  };

  // Get performance insights
  const getPerformanceInsights = () => {
    if (!currentUser) return null;
    
    const winRate = currentUser.totalBets > 0 ? 
      (currentUser.totalWins / currentUser.totalBets * 100).toFixed(1) : '0.0';
    
    const favoriteSport = currentUser.favoriteSports.length > 0 ? 
      currentUser.favoriteSports[0] : 'Not enough data';
    
    return {
      winRate,
      totalBets: currentUser.totalBets,
      totalWins: currentUser.totalWins,
      favoriteSport,
      riskLevel: currentUser.riskLevel
    };
  };

  const handlePlaceBet = () => {
    if (selectedMatch && selectedTeam && betAmount > 0) {
      onPlaceBet(selectedMatch, selectedTeam, betAmount);
      setSelectedMatch(null);
      setSelectedTeam('');
    }
  };

  const recommendations = getRecommendations();
  const tips = getBettingTips();
  const insights = getPerformanceInsights();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center">
              <Sparkles className="mr-2" />
              Smart Betting Assistant
            </h2>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          <p className="mt-2 opacity-90">
            Your personal AI-powered betting advisor
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'recommendations' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('recommendations')}
          >
            <Target className="inline mr-2" size={18} />
            Recommendations
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'insights' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('insights')}
          >
            <TrendingUp className="inline mr-2" size={18} />
            Performance
          </button>
          <button
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'tips' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('tips')}
          >
            <Lightbulb className="inline mr-2" size={18} />
            Tips
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'recommendations' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Smart Recommendations</h3>
              <p className="text-gray-600 mb-6">
                Based on your betting history and preferences, here are our top recommendations:
              </p>
              
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.map(match => (
                    <div key={match.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{match.teamA} vs {match.teamB}</h4>
                          <p className="text-sm text-gray-500">{match.category} • {new Date(match.date).toLocaleDateString()}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {match.status}
                        </span>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {Object.entries(match.odds).map(([team, odds]) => (
                          <button
                            key={team}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                              selectedMatch === match.id && selectedTeam === team
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                            onClick={() => {
                              setSelectedMatch(match.id);
                              setSelectedTeam(team);
                            }}
                          >
                            {team}: {odds}
                          </button>
                        ))}
                      </div>
                      
                      {selectedMatch === match.id && selectedTeam && (
                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={betAmount}
                              onChange={(e) => setBetAmount(Number(e.target.value))}
                              className="border rounded-lg px-3 py-2 w-24"
                              min="10"
                              max={currentUser?.balance || 1000}
                            />
                            <span className="text-gray-600">
                              Potential win: {(betAmount * (match.odds[selectedTeam] || 1)).toFixed(2)} BDT
                            </span>
                            <button
                              onClick={handlePlaceBet}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                            >
                              Place Bet
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No recommendations available at the moment.</p>
                    <p className="text-sm mt-2">Place some bets to get personalized recommendations.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && insights && (
            <div>
              <h3 className="text-xl font-bold mb-4">Performance Insights</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Win Rate</h4>
                  <div className="text-3xl font-bold text-blue-600">{insights.winRate}%</div>
                  <p className="text-sm text-gray-600 mt-2">Based on {insights.totalBets} bets</p>
                </div>
                
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Total Wins</h4>
                  <div className="text-3xl font-bold text-green-600">{insights.totalWins}</div>
                  <p className="text-sm text-gray-600 mt-2">Successful bets</p>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Favorite Sport</h4>
                  <div className="text-3xl font-bold text-purple-600">{insights.favoriteSport}</div>
                  <p className="text-sm text-gray-600 mt-2">Most bet on sport</p>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                  <h4 className="font-bold text-lg mb-2">Risk Level</h4>
                  <div className="text-3xl font-bold text-yellow-600 capitalize">{insights.riskLevel}</div>
                  <p className="text-sm text-gray-600 mt-2">Your betting risk profile</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-lg mb-4">Personalized Advice</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-full p-1 mr-3 mt-1">
                      <TrendingUp size={16} />
                    </div>
                    <span>
                      {parseFloat(insights.winRate) > 50 
                        ? "Great job! Your win rate is above average." 
                        : "Focus on safer bets to improve your win rate."}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-800 rounded-full p-1 mr-3 mt-1">
                      <Target size={16} />
                    </div>
                    <span>
                      {insights.totalBets > 20 
                        ? "You're experienced! Consider exploring new betting strategies." 
                        : "Keep practicing to improve your betting skills."}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          {activeTab === 'tips' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Betting Tips</h3>
              <p className="text-gray-600 mb-6">
                Expert advice to improve your betting success:
              </p>
              
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-xl">
                    <div className="bg-yellow-100 text-yellow-800 rounded-full p-2 mr-4">
                      <Lightbulb size={20} />
                    </div>
                    <p className="text-gray-800">{tip}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
                <h4 className="font-bold text-lg mb-2">Pro Tip of the Day</h4>
                <p>
                  "Bankroll management is crucial. Never bet more than 5% of your total bankroll on a single bet."
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Powered by AI • Updated in real-time
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartAssistant;
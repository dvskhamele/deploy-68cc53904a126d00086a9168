// src/components/MatchCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface Bet {
  matchId: number;
  userId: number;
  outcome: string;
  amount: number;
  odds: number;
  potentialWin: number;
  date: string;
  match: Match;
  status: string;
}

interface MatchCardProps {
  match: Match;
  user: any;
  onPlaceBet: (bet: Bet) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, user, onPlaceBet }) => {
  const [showBetModal, setShowBetModal] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState(100);
  const [error, setError] = useState('');

  const matchDate = new Date(match.date);
  
  const handleBet = () => {
    if (!user) {
      setError('Please log in to place bets');
      return;
    }
    
    if (!selectedOutcome) {
      setError('Please select an outcome to bet on');
      return;
    }
    
    if (betAmount <= 0) {
      setError('Bet amount must be greater than 0');
      return;
    }
    
    if (betAmount > user.balance) {
      setError('Insufficient balance');
      return;
    }
    
    const betData = {
      matchId: match.id,
      userId: user.id,
      outcome: selectedOutcome,
      amount: betAmount,
      odds: selectedOutcome === 'teamA' ? match.odds.teamA : 
            selectedOutcome === 'teamB' ? match.odds.teamB : 
            match.odds.draw || 0,
      potentialWin: betAmount * (selectedOutcome === 'teamA' ? match.odds.teamA : 
                                selectedOutcome === 'teamB' ? match.odds.teamB : 
                                match.odds.draw || 0),
      date: new Date().toISOString(),
      match: match,
      status: 'pending' // pending, won, lost, cancelled
    };
    
    onPlaceBet(betData);
    setShowBetModal(false);
    setSelectedOutcome(null);
    setBetAmount(100);
    setError('');
  };

  const getOutcomeName = (outcome: string) => {
    switch(outcome) {
      case 'teamA': return match.teamA;
      case 'teamB': return match.teamB;
      case 'draw': return 'Draw';
      default: return '';
    }
  };

  return (
    <>
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="font-semibold text-gray-800 text-lg">{match.teamA}</div>
                <div className="text-sm text-gray-500">{match.category}</div>
              </div>
              
              <div className="flex flex-col items-center gap-1 min-w-[120px]">
                <div className={`text-sm font-medium px-3 py-1 rounded-full text-xs ${match.live ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  {match.live ? 'LIVE' : matchDate.toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500">
                  {match.live ? 'Now' : matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              <div className="text-center">
                <div className="font-semibold text-gray-800 text-lg">{match.teamB}</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all text-sm min-w-[100px]"
              onClick={() => {
                setSelectedOutcome('teamA');
                setShowBetModal(true);
              }}
            >
              {match.teamA} {match.odds.teamA?.toFixed(2)}
            </button>
            {match.odds.draw !== null && (
              <button 
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all text-sm min-w-[100px]"
                onClick={() => {
                  setSelectedOutcome('draw');
                  setShowBetModal(true);
                }}
              >
                Draw {match.odds.draw?.toFixed(2)}
              </button>
            )}
            <button 
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all text-sm min-w-[100px]"
              onClick={() => {
                setSelectedOutcome('teamB');
                setShowBetModal(true);
              }}
            >
              {match.teamB} {match.odds.teamB?.toFixed(2)}
            </button>
          </div>
        </div>
      </div>

      {/* Bet Modal */}
      {showBetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Place Your Bet</h3>
            
            <div className="mb-4">
              <p className="font-semibold">{match.teamA} vs {match.teamB}</p>
              <p className="text-sm text-gray-600">Bet on: {getOutcomeName(selectedOutcome || '')}</p>
              <p className="text-sm text-gray-600">Odds: {(selectedOutcome === 'teamA' ? match.odds.teamA : 
                                                 selectedOutcome === 'teamB' ? match.odds.teamB : 
                                                 match.odds.draw)?.toFixed(2)}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bet Amount (BDT)
              </label>
              <input
                type="number"
                min="10"
                max={user?.balance || 0}
                value={betAmount}
                onChange={(e) => setBetAmount(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
              <div className="flex gap-2 mt-2">
                {[100, 200, 500, 1000].map(amount => (
                  <button
                    key={amount}
                    type="button"
                    className={`px-3 py-1 text-sm rounded ${
                      betAmount === amount 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    onClick={() => setBetAmount(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between">
                <span>Potential Win:</span>
                <span className="font-bold">
                  {(betAmount * (selectedOutcome === 'teamA' ? match.odds.teamA : 
                                selectedOutcome === 'teamB' ? match.odds.teamB : 
                                match.odds.draw || 0)).toFixed(2)} BDT
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Balance: {user?.balance} BDT
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => {
                  setShowBetModal(false);
                  setError('');
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-colors"
                onClick={handleBet}
              >
                Place Bet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
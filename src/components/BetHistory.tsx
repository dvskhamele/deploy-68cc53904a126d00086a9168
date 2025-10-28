// src/components/BetHistory.tsx
import React from 'react';
import { useBetting } from '../contexts/BettingContext';
import { Calendar, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface BetHistoryProps {
  userId?: number;
}

export const BetHistory: React.FC<BetHistoryProps> = ({ userId }) => {
  const { state } = useBetting();
  
  // Filter bets for current user if userId is provided
  const userBets = userId 
    ? state.bets.filter(bet => bet.userId === userId) 
    : state.bets;
  
  // Sort by date (newest first)
  const sortedBets = [...userBets].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'won': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'lost': return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Bet History</h2>
      
      {sortedBets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No bets placed yet</p>
          <p className="text-sm text-gray-400 mt-2">Place your first bet to see it here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBets.map(bet => (
            <div key={bet.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(bet.status)}
                    <h3 className="font-semibold text-gray-800">
                      {bet.match.teamA} vs {bet.match.teamB}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Bet on: <span className="font-medium">{bet.outcome === 'teamA' ? bet.match.teamA : 
                                            bet.outcome === 'teamB' ? bet.match.teamB : 'Draw'}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    {new Date(bet.date).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold">
                    {bet.amount} BDT
                  </div>
                  <div className="text-sm text-gray-600">
                    Odds: {bet.odds.toFixed(2)}
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                    {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {bet.status === 'won' && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <div className="text-green-600 font-semibold">
                    Won: {(bet.amount * bet.odds).toFixed(2)} BDT
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
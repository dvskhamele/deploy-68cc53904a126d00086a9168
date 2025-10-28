// src/contexts/BettingContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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
  id: string;
  matchId: number;
  userId: number;
  outcome: string;
  amount: number;
  odds: number;
  potentialWin: number;
  date: string;
  match: Match;
  status: 'pending' | 'won' | 'lost' | 'cancelled';
}

interface BettingState {
  bets: Bet[];
  balance: number;
  user: any;
}

type BettingAction =
  | { type: 'PLACE_BET'; bet: Bet }
  | { type: 'UPDATE_BALANCE'; amount: number }
  | { type: 'UPDATE_BET_STATUS'; betId: string; status: 'won' | 'lost' | 'cancelled' }
  | { type: 'SET_USER'; user: any };

const initialState: BettingState = {
  bets: [],
  balance: 1000, // Default demo balance
  user: null
};

const BettingContext = createContext<{
  state: BettingState;
  placeBet: (bet: Omit<Bet, 'id'>) => void;
  updateBalance: (amount: number) => void;
  updateBetStatus: (betId: string, status: 'won' | 'lost' | 'cancelled') => void;
  setUser: (user: any) => void;
} | undefined>(undefined);

const bettingReducer = (state: BettingState, action: BettingAction): BettingState => {
  switch (action.type) {
    case 'PLACE_BET':
      // Deduct bet amount from balance
      const newBalance = state.balance - action.bet.amount;
      if (newBalance < 0) {
        throw new Error('Insufficient balance');
      }
      
      const newBet: Bet = {
        ...action.bet,
        id: Date.now().toString()
      };
      
      return {
        ...state,
        bets: [...state.bets, newBet],
        balance: newBalance
      };
    
    case 'UPDATE_BALANCE':
      return {
        ...state,
        balance: state.balance + action.amount
      };
    
    case 'UPDATE_BET_STATUS':
      return {
        ...state,
        bets: state.bets.map(bet => 
          bet.id === action.betId ? { ...bet, status: action.status } : bet
        )
      };
    
    case 'SET_USER':
      return {
        ...state,
        user: action.user,
        balance: action.user?.balance || state.balance
      };
    
    default:
      return state;
  }
};

export const BettingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(bettingReducer, initialState);

  const placeBet = (bet: Omit<Bet, 'id'>) => {
    dispatch({ type: 'PLACE_BET', bet });
  };

  const updateBalance = (amount: number) => {
    dispatch({ type: 'UPDATE_BALANCE', amount });
  };

  const updateBetStatus = (betId: string, status: 'won' | 'lost' | 'cancelled') => {
    dispatch({ type: 'UPDATE_BET_STATUS', betId, status });
  };

  const setUser = (user: any) => {
    dispatch({ type: 'SET_USER', user });
  };

  return (
    <BettingContext.Provider value={{
      state,
      placeBet,
      updateBalance,
      updateBetStatus,
      setUser
    }}>
      {children}
    </BettingContext.Provider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
};
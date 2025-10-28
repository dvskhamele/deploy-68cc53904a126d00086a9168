// src/components/LiveMatchSimulator.tsx
import React, { useEffect, useState } from 'react';
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

interface LiveMatchSimulatorProps {
  matches: Match[];
  updateMatches: (matches: Match[]) => void;
}

export const LiveMatchSimulator: React.FC<LiveMatchSimulatorProps> = ({ matches, updateMatches }) => {
  const { state, updateBetStatus, updateBalance } = useBetting();
  const [activeSimulations, setActiveSimulations] = useState<Set<number>>(new Set());

  useEffect(() => {
    // Find live matches and start simulation
    const liveMatches = matches.filter(match => match.live);
    
    // Create a new set of active simulations
    const newActiveSimulations = new Set<number>();
    
    liveMatches.forEach(match => {
      if (!activeSimulations.has(match.id)) {
        // Start simulation for this match
        startMatchSimulation(match.id);
        newActiveSimulations.add(match.id);
      } else {
        newActiveSimulations.add(match.id);
      }
    });
    
    setActiveSimulations(newActiveSimulations);
    
    // Cleanup function
    return () => {
      // Stop all simulations when component unmounts
      newActiveSimulations.forEach(id => {
        stopMatchSimulation(id);
      });
    };
  }, [matches]);

  const startMatchSimulation = (matchId: number) => {
    // In a real app, this would connect to a live data source
    // For demo purposes, we'll simulate match results after a random time
    
    const match = matches.find(m => m.id === matchId);
    if (!match) return;
    
    // Set a random time between 30-120 seconds for match completion
    const simulationTime = 30000 + Math.random() * 90000; // 30-120 seconds in ms
    
    const simulationTimer = setTimeout(() => {
      // Determine random result
      const results = ['teamA', 'teamB', match.odds.draw !== null ? 'draw' : null].filter(r => r !== null);
      const result = results[Math.floor(Math.random() * results.length)] || 'teamA';
      
      // Update match status to finished
      const updatedMatches = matches.map(m => 
        m.id === matchId 
          ? { ...m, status: 'Finished', live: false, result: result as string } 
          : m
      );
      
      updateMatches(updatedMatches);
      
      // Process bets for this match
      processMatchResults(matchId, result as string);
      
      // Remove from active simulations
      setActiveSimulations(prev => {
        const newSet = new Set(prev);
        newSet.delete(matchId);
        return newSet;
      });
    }, simulationTime);
    
    // Store timer reference if needed (for cleanup)
    (window as any)[`matchTimer_${matchId}`] = simulationTimer;
  };

  const stopMatchSimulation = (matchId: number) => {
    // Clear the timer for this match
    const timerId = (window as any)[`matchTimer_${matchId}`];
    if (timerId) {
      clearTimeout(timerId);
      delete (window as any)[`matchTimer_${matchId}`];
    }
  };

  const processMatchResults = (matchId: number, result: string) => {
    // Find all bets placed on this match
    const matchBets = state.bets.filter(bet => bet.matchId === matchId);
    
    matchBets.forEach(bet => {
      let status: 'won' | 'lost' | 'cancelled' = 'lost';
      let winnings = 0;
      
      if (bet.outcome === result) {
        status = 'won';
        winnings = bet.amount * bet.odds; // Calculate winnings based on odds
      }
      
      // Update bet status
      updateBetStatus(bet.id, status);
      
      // If bet was won, add winnings to balance
      if (status === 'won') {
        updateBalance(winnings);
      }
    });
  };

  return null; // This component doesn't render anything visible
};
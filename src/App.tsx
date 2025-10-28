// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useBetting } from './contexts/BettingContext';
import { Dashboard } from './components/Dashboard';
import { Matches } from './components/Matches';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LiveMatchSimulator } from './components/LiveMatchSimulator';

// Mock match data to show something while we fix the data loading
const mockMatches = [
  {
    id: 1,
    teamA: "Team Alpha",
    teamB: "Team Beta",
    date: new Date(Date.now() + 3600000).toISOString(),
    category: "Football",
    odds: { teamA: 1.8, draw: 3.2, teamB: 2.1 },
    status: "Upcoming",
    live: false
  },
  {
    id: 2,
    teamA: "Team Gamma",
    teamB: "Team Delta",
    date: new Date(Date.now() + 7200000).toISOString(),
    category: "Basketball",
    odds: { teamA: 2.1, draw: 3.5, teamB: 1.7 },
    status: "Upcoming",
    live: false
  },
  {
    id: 3,
    teamA: "Team Epsilon",
    teamB: "Team Zeta",
    date: new Date(Date.now() - 1800000).toISOString(), // Live match
    category: "Tennis",
    odds: { teamA: 1.5, draw: null, teamB: 2.8 },
    status: "Live",
    live: true
  },
  {
    id: 4,
    teamA: "Lakers",
    teamB: "Warriors",
    date: new Date(Date.now() + 10800000).toISOString(),
    category: "Basketball",
    odds: { teamA: 2.0, draw: null, teamB: 1.9 },
    status: "Upcoming",
    live: false
  },
  {
    id: 5,
    teamA: "Barcelona",
    teamB: "Real Madrid",
    date: new Date(Date.now() + 14400000).toISOString(),
    category: "Football",
    odds: { teamA: 2.5, draw: 3.0, teamB: 2.7 },
    status: "Upcoming",
    live: false
  }
];

export const App: React.FC = () => {
  const { state, setUser } = useBetting();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState<any[]>(mockMatches);
  
  useEffect(() => {
    // Simulate loading user data
    const loadUser = () => {
      // Check if user is logged in (mock implementation)
      const userData = {
        id: 1,
        name: "Demo User",
        email: "demo@example.com",
        balance: 1000,
        role: "Member",
        isMember: true
      };
      
      setUser(userData);
      setLoading(false);
    };

    loadUser();
  }, [setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {state.user && <Header user={state.user} onLogout={() => setUser(null)} />}
        <main className="container mx-auto px-4 py-8">
          <LiveMatchSimulator matches={matches} updateMatches={setMatches} />
          <Routes>
            <Route path="/" element={<Dashboard user={state.user} matches={matches} />} />
            <Route path="/matches" element={<Matches user={state.user} matches={matches} />} />
            <Route path="/login" element={<Login onLogin={setUser} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};
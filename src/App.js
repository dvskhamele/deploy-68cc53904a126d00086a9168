import React, { useState, useEffect } from 'react';
import './App.css';

// Mock data
const mockData = {
  user: {
    id: 'TK999',
    name: 'Demo User',
    balance: 1000,
    currency: 'BDT',
    membership: 'Member',
    avatar: '⭐',
    email: 'demo@example.com',
    phone: '+1234567890',
    joinDate: new Date('2025-09-28'),
    totalBets: 0,
    wins: 0,
    losses: 0
  },
  
  dashboardStats: {
    totalMatches: 25,
    liveMatches: 3,
    upcomingMatches: 22,
    favoriteSports: ['Football', 'Cricket', 'Basketball', 'Tennis'],
    dailyPicks: 7,
    winRate: 0,
    totalBetAmount: 0,
    revenue: 0
  },
  
  matches: [
    // Live matches
    {
      id: 1,
      sport: 'Football',
      league: 'Premier League',
      team1: 'Manchester United',
      team2: 'Liverpool',
      team1Score: 1,
      team2Score: 1,
      status: 'live',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      odds: {
        team1: 2.2,
        draw: 3.0,
        team2: 2.8
      },
      isLive: true,
      isFavorite: true
    },
    {
      id: 2,
      sport: 'Cricket',
      league: 'T20 World Cup',
      team1: 'India',
      team2: 'Australia',
      team1Score: 145,
      team2Score: 89,
      status: 'live',
      startTime: new Date(Date.now() - 7200000), // 2 hours ago
      odds: {
        team1: 1.8,
        team2: 2.1
      },
      isLive: true,
      isFavorite: true
    },
    {
      id: 3,
      sport: 'Tennis',
      league: 'Wimbledon',
      team1: 'Djokovic',
      team2: 'Nadal',
      team1Score: 2,
      team2Score: 1,
      status: 'live',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      odds: {
        team1: 1.7,
        team2: 2.2
      },
      isLive: true,
      isFavorite: false
    },
    // Upcoming matches
    {
      id: 4,
      sport: 'Football',
      league: 'La Liga',
      team1: 'Barcelona',
      team2: 'Real Madrid',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 3600000), // 1 hour from now
      odds: {
        team1: 2.3,
        draw: 3.1,
        team2: 3.0
      },
      isLive: false,
      isFavorite: true
    },
    {
      id: 5,
      sport: 'Basketball',
      league: 'NBA',
      team1: 'Lakers',
      team2: 'Warriors',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 7200000), // 2 hours from now
      odds: {
        team1: 1.9,
        team2: 1.95
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 6,
      sport: 'Football',
      league: 'Serie A',
      team1: 'Juventus',
      team2: 'AC Milan',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 10800000), // 3 hours from now
      odds: {
        team1: 2.1,
        draw: 3.0,
        team2: 3.2
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 7,
      sport: 'Football',
      league: 'Bundesliga',
      team1: 'Bayern Munich',
      team2: 'Borussia Dortmund',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 14400000), // 4 hours from now
      odds: {
        team1: 1.7,
        draw: 3.5,
        team2: 4.2
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 8,
      sport: 'Cricket',
      league: 'IPL',
      team1: 'Mumbai Indians',
      team2: 'Chennai Super Kings',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 18000000), // 5 hours from now
      odds: {
        team1: 1.9,
        team2: 1.85
      },
      isLive: false,
      isFavorite: true
    },
    {
      id: 9,
      sport: 'Tennis',
      league: 'US Open',
      team1: 'Alcaraz',
      team2: 'Djokovic',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 21600000), // 6 hours from now
      odds: {
        team1: 2.1,
        team2: 1.7
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 10,
      sport: 'Basketball',
      league: 'NBA',
      team1: 'Celtics',
      team2: 'Heat',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 25200000), // 7 hours from now
      odds: {
        team1: 1.85,
        team2: 1.9
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 11,
      sport: 'Football',
      league: 'Ligue 1',
      team1: 'PSG',
      team2: 'Monaco',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 28800000), // 8 hours from now
      odds: {
        team1: 1.4,
        draw: 4.5,
        team2: 6.0
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 12,
      sport: 'Rugby',
      league: 'Six Nations',
      team1: 'England',
      team2: 'France',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 32400000), // 9 hours from now
      odds: {
        team1: 2.0,
        draw: 18.0,
        team2: 3.2
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 13,
      sport: 'Baseball',
      league: 'MLB',
      team1: 'Yankees',
      team2: 'Red Sox',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 36000000), // 10 hours from now
      odds: {
        team1: 1.95,
        team2: 1.85
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 14,
      sport: 'Hockey',
      league: 'NHL',
      team1: 'Rangers',
      team2: 'Bruins',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 39600000), // 11 hours from now
      odds: {
        team1: 2.1,
        team2: 1.75
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 15,
      sport: 'Football',
      league: 'Eredivisie',
      team1: 'Ajax',
      team2: 'PSV',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 43200000), // 12 hours from now
      odds: {
        team1: 1.8,
        draw: 3.6,
        team2: 4.0
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 16,
      sport: 'Volleyball',
      league: 'World Championship',
      team1: 'Brazil',
      team2: 'Poland',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 46800000), // 13 hours from now
      odds: {
        team1: 2.2,
        team2: 1.65
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 17,
      sport: 'Football',
      league: 'Premier League',
      team1: 'Arsenal',
      team2: 'Chelsea',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 50400000), // 14 hours from now
      odds: {
        team1: 2.1,
        draw: 3.2,
        team2: 3.5
      },
      isLive: false,
      isFavorite: true
    },
    {
      id: 18,
      sport: 'Cricket',
      league: 'Test Series',
      team1: 'England',
      team2: 'Pakistan',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 54000000), // 15 hours from now
      odds: {
        team1: 1.7,
        team2: 2.2
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 19,
      sport: 'Tennis',
      league: 'French Open',
      team1: 'Nadal',
      team2: 'Tsitsipas',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 57600000), // 16 hours from now
      odds: {
        team1: 1.8,
        team2: 2.0
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 20,
      sport: 'Basketball',
      league: 'EuroLeague',
      team1: 'Real Madrid',
      team2: 'Barcelona',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 61200000), // 17 hours from now
      odds: {
        team1: 1.9,
        team2: 1.85
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 21,
      sport: 'Football',
      league: 'Champions League',
      team1: 'Bayern Munich',
      team2: 'PSG',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 64800000), // 18 hours from now
      odds: {
        team1: 2.4,
        draw: 3.4,
        team2: 2.7
      },
      isLive: false,
      isFavorite: true
    },
    {
      id: 22,
      sport: 'Cricket',
      league: 'World Cup',
      team1: 'New Zealand',
      team2: 'Bangladesh',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 68400000), // 19 hours from now
      odds: {
        team1: 1.5,
        team2: 3.8
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 23,
      sport: 'Tennis',
      league: 'Australian Open',
      team1: 'Medvedev',
      team2: 'Zverev',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 72000000), // 20 hours from now
      odds: {
        team1: 2.0,
        team2: 1.8
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 24,
      sport: 'Football',
      league: 'Europa League',
      team1: 'Juventus',
      team2: 'Arsenal',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 75600000), // 21 hours from now
      odds: {
        team1: 2.1,
        draw: 3.3,
        team2: 3.2
      },
      isLive: false,
      isFavorite: false
    },
    {
      id: 25,
      sport: 'Basketball',
      league: 'NBA Playoffs',
      team1: 'Lakers',
      team2: 'Warriors',
      team1Score: null,
      team2Score: null,
      status: 'upcoming',
      startTime: new Date(Date.now() + 79200000), // 22 hours from now
      odds: {
        team1: 2.0,
        team2: 1.8
      },
      isLive: false,
      isFavorite: true
    }
  ],
  
  dailyPicks: [
    {
      id: 1,
      matchId: 1,
      recommendation: 'Manchester United to win',
      confidence: 'High',
      odds: 2.2,
      status: 'pending' // 'won', 'lost', 'pending'
    },
    {
      id
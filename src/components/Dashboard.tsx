// src/components/Dashboard.tsx
import React, { useState } from 'react';
import { Trophy, Star, Target, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';
import { BetHistory } from './BetHistory';

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

interface DashboardProps {
  user: any;
  matches: Match[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, matches }) => {
  // Stats calculations
  const stats = {
    totalMatches: matches.length,
    liveMatches: matches.filter(m => m.live).length,
    upcomingMatches: matches.filter(m => !m.live && new Date(m.date) > new Date()).length,
    userBalance: user?.balance || 0
  };

  // Features data
  const features = [
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Live Betting",
      description: "Bet on ongoing matches with real-time odds that update as the game progresses"
    },
    {
      icon: <DollarSign className="w-12 h-12" />,
      title: "Instant Payouts",
      description: "Get winnings instantly with secure payments directly to your wallet"
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: "100% Secure",
      description: "Your data protected with bank-level security and encryption"
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Smart Recommendations",
      description: "AI-powered betting suggestions based on your preferences and history"
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Rahim Ahmed",
      role: "Professional Bettor",
      content: "TK999 has completely changed how I approach sports betting. The live odds updates and instant payouts are game-changers!",
      rating: 5
    },
    {
      name: "Fatima Khan",
      role: "Casual Bettor",
      content: "I've tried many platforms, but TK999 stands out with its user-friendly interface and excellent customer support.",
      rating: 5
    },
    {
      name: "Siddique Mahmud",
      role: "Sports Enthusiast",
      content: "The smart recommendations feature helped me discover new betting opportunities I never would have considered.",
      rating: 4
    }
  ];

  // Stats for user
  const userStats = [
    { value: "500+", label: "Daily Matches" },
    { value: "10K+", label: "Active Users" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to TK999!</h1>
        <p className="text-xl opacity-90 mb-6">The premier sports betting platform in Bangladesh</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/20 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.userBalance} BDT</div>
            <div className="text-sm opacity-80">Balance</div>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.liveMatches}</div>
            <div className="text-sm opacity-80">Live Matches</div>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.upcomingMatches}</div>
            <div className="text-sm opacity-80">Upcoming</div>
          </div>
          <div className="bg-white/20 p-4 rounded-lg">
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
            <div className="text-sm opacity-80">Total Matches</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-blue-500 mb-4 flex justify-center">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {userStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 text-center shadow">
            <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Bet History Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BetHistory userId={user?.id} />
        
        {/* Testimonials Carousel */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${
                  currentTestimonial === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                } transition-all`}
              >
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
                <div className="mt-3">
                  <div className="font-semibold text-gray-800">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full ${
                  currentTestimonial === index ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Betting?</h2>
        <p className="text-lg mb-6 opacity-90">Join thousands of satisfied users enjoying the best betting experience</p>
        <button className="bg-white text-orange-500 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
          Place Your First Bet
        </button>
      </div>
    </div>
  );
};
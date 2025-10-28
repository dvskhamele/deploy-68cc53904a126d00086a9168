import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Zap, Star, Target } from 'lucide-react';

const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Features data
  const features = [
    {
      icon: <Award className="w-12 h-12" />,
      title: "Live Betting",
      description: "Bet on ongoing matches with real-time odds that update as the game progresses"
    },
    {
      icon: <Zap className="w-12 h-12" />,
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
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: "High Odds",
      description: "Competitive odds that give you the best chance to win"
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: "Performance Tracking",
      description: "Detailed analytics to track your betting performance and improve"
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
  
  // Stats
  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "500+", label: "Daily Matches" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Support" }
  ];
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="fade-in-up">
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent relative z-10">
                TK999
              </h1>
            </div>
            
            <div className="mb-10">
              <p className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
                Sports Betting Platform
              </p>
              <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
                Place bets on your favorite sports with real-time odds and instant payouts. 
                Experience the thrill of prediction with our cutting-edge platform.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20 fade-in-up delay-200">
            <Link 
              to="/register" 
              className="btn btn-success text-lg flex items-center justify-center px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <span className="text-3xl mr-3">📝</span>
              <div className="text-left">
                <span className="text-xl font-bold block">Register</span>
                <span className="text-sm mt-1">Create Account</span>
              </div>
            </Link>
            <Link 
              to="/login" 
              className="btn btn-primary text-lg flex items-center justify-center px-8 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              <span className="text-3xl mr-3">🔑</span>
              <div className="text-left">
                <span className="text-xl font-bold block">Login</span>
                <span className="text-sm mt-1">Existing User</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Why Choose TK999?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We offer the best betting experience with cutting-edge technology and user-focused features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="card p-8 flex flex-col items-center text-center transform transition-all duration-300 hover:-translate-y-2 fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied users
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="card p-8 md:p-12">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-xl text-gray-700 mb-8 italic">
                  "{testimonials[currentSlide].content}"
                </p>
                <div>
                  <p className="font-bold text-lg text-gray-800">{testimonials[currentSlide].name}</p>
                  <p className="text-gray-600">{testimonials[currentSlide].role}</p>
                </div>
              </div>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Betting?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied users and experience the best sports betting platform today
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="btn bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:scale-105 transition-transform duration-300"
            >
              <span className="mr-3">📝</span>
              Create Free Account
            </Link>
            <Link 
              to="/matches" 
              className="btn bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-2xl font-bold flex items-center justify-center hover:scale-105 transition-transform duration-300"
            >
              <span className="mr-3">⚽</span>
              View Matches
            </Link>
          </div>
        </div>
      </div>
      
      <div className="text-center py-8 text-gray-500 text-sm">
        © {new Date().getFullYear()} TK999 - All rights reserved
      </div>
    </div>
  );
};

export default HomePage;
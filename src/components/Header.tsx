// src/components/Header.tsx
import React from 'react';
import { Trophy, User, LogOut, BarChart3, Gamepad2 } from 'lucide-react';
import { useBetting } from '../contexts/BettingContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const { state } = useBetting();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-gray-800">TK999</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
              <BarChart3 className="h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/matches" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
              <Gamepad2 className="h-5 w-5" />
              Matches
            </Link>
          </nav>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Balance Display */}
            <div className="hidden md:flex items-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-2">
              <span className="text-sm font-medium text-gray-600 mr-2">Balance:</span>
              <span className="font-bold text-blue-600">{state.balance} BDT</span>
            </div>

            {/* User Avatar and Name */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <div className="text-sm font-medium text-gray-800">{user?.name}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span className="mr-1">⭐</span>
                  {user?.role}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                {user?.name.charAt(0) || 'D'}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
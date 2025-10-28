import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  CalendarDays, 
  Lock, 
  CreditCard, 
  Bell, 
  Shield, 
  Edit, 
  Save, 
  Camera,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Key,
  Globe,
  Crown,
  Star,
  Target,
  Trophy,
  Award,
  Gift,
  Wallet,
  Settings,
  LogOut,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  BarChart3,
  BarChart,
  DollarSign,
  CheckCircle,
  History,
  Zap,
  ShieldCheck,
  Heart
} from 'lucide-react';

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

interface Transaction {
  id: number;
  userId: number;
  type: 'Deposit' | 'Withdrawal' | 'Bet' | 'Win' | 'Bonus' | 'Fee';
  amount: number;
  date: string;
  description: string;
  balanceAfter: number;
}

interface Bet {
  id: number;
  userId: number;
  matchId: number;
  teamChosen: string;
  amount: number;
  status: 'Pending' | 'Won' | 'Lost';
  date: string;
  potentialWin: number;
  odds: number;
}

interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface DashboardData {
  profile: User;
  transactions: Transaction[];
  bets: Bet[];
  notifications: Notification[];
  wallet: { balance: number };
}

interface UserProfilePageProps {
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
  onLogout: () => void;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onShowAssistant: () => void;
  getUserDashboard: (userId: number) => DashboardData;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ 
  user, 
  onUpdateProfile,
  onLogout,
  onDeposit,
  onWithdraw,
  onShowAssistant,
  getUserDashboard
}) => {
  const navigate = useNavigate();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({...user});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [userBets, setUserBets] = useState<Bet[]>([]);
  
  // Load user data
  useEffect(() => {
    const data = getUserDashboard(user.id);
    setUserTransactions(data.transactions);
    setUserBets(data.bets);
  }, [user.id, getUserDashboard]);

  // Handle profile image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const saveProfileChanges = () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate inputs
      if (!editedUser.name || !editedUser.email || !editedUser.phone) {
        throw new Error('All fields are required');
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editedUser.email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Phone validation (simple)
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(editedUser.phone)) {
        throw new Error('Please enter a valid phone number');
      }
      
      onUpdateProfile(editedUser);
      setIsEditingProfile(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate passwords
      if (!currentPassword || !newPassword || !confirmNewPassword) {
        throw new Error('All password fields are required');
      }
      
      if (newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }
      
      if (newPassword !== confirmNewPassword) {
        throw new Error('New passwords do not match');
      }
      
      // In a real implementation, this would call an API to change the password
      // For demo purposes, we'll just simulate success
      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowPasswordChange(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to change password');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle deposit
  const handleDeposit = () => {
    const amount = prompt('Enter amount to deposit:');
    if (amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0) {
      try {
        onDeposit(parseInt(amount));
        setSuccess(`Successfully deposited ${amount} BDT!`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: unknown) {
        setError((err as Error).message || 'Deposit failed');
        setTimeout(() => setError(''), 3000);
      }
    } else if (amount) {
      alert('Please enter a valid amount');
    }
  };

  // Handle withdrawal
  const handleWithdraw = () => {
    const amount = prompt('Enter amount to withdraw:');
    if (amount && !isNaN(parseInt(amount)) && parseInt(amount) > 0) {
      try {
        onWithdraw(parseInt(amount));
        setSuccess(`Successfully withdrew ${amount} BDT!`);
        setTimeout(() => setSuccess(''), 3000);
      } catch (err: unknown) {
        setError((err as Error).message || 'Withdrawal failed');
        setTimeout(() => setError(''), 3000);
      }
    } else if (amount) {
      alert('Please enter a valid amount');
    }
  };

  // Handle logout
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  // Calculate win rate
  const winRate = user.totalBets > 0 ? 
    ((user.totalWins / user.totalBets) * 100).toFixed(1) : '0.0';

  // Get risk level badge
  const getRiskLevelBadge = (level: string) => {
    switch (level) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="beautiful-header">
        <nav className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <Link 
              to="/dashboard" 
              className="beautiful-logo"
            >
              <span className="beautiful-logo-icon">🎲</span>
              TK999
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="beautiful-wallet-card">
              <span className="beautiful-wallet-icon">💰</span>
              <span className="beautiful-wallet-amount">
                {user.balance.toLocaleString()} BDT
              </span>
            </div>
            
            <div className="beautiful-user-profile">
              <div className="beautiful-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="beautiful-user-info">
                <div className="beautiful-user-name">{user?.name || 'User'}</div>
                <div className="beautiful-user-role">
                  {user?.role === 'admin' ? 'Admin' : user?.role === 'staff' ? 'Staff' : 'Member'}
                </div>
              </div>
            </div>
            
            <div className="beautiful-nav-buttons">
              <Link 
                to="/dashboard" 
                className="beautiful-nav-btn"
                title="Dashboard"
              >
                <span>📊</span>
                <span className="beautiful-nav-btn-label">Dashboard</span>
              </Link>
              
              <Link 
                to="/matches" 
                className="beautiful-nav-btn"
                title="Matches"
              >
                <span>⚽</span>
                <span className="beautiful-nav-btn-label">Matches</span>
              </Link>
              
              {(user?.role === 'admin' || user?.role === 'staff') && (
                <Link 
                  to="/admin" 
                  className="beautiful-nav-btn"
                  title="Admin"
                >
                  <span>⚙️</span>
                  <span className="beautiful-nav-btn-label">Admin</span>
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="beautiful-nav-btn"
                title="Logout"
              >
                <span>🚪</span>
                <span className="beautiful-nav-btn-label">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 flex items-center">
            <User className="mr-3 text-3xl" />
            User Profile
          </h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-center flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg text-center flex items-center">
            <CheckCircle className="mr-2" size={20} />
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap border-b mb-6">
          <button
            className={`py-3 px-6 font-medium flex items-center ${
              activeTab === 'profile' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="mr-2" size={18} />
            Profile
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center ${
              activeTab === 'security' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <Lock className="mr-2" size={18} />
            Security
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center ${
              activeTab === 'preferences' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            <Settings className="mr-2" size={18} />
            Preferences
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center ${
              activeTab === 'wallet' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('wallet')}
          >
            <CreditCard className="mr-2" size={18} />
            Wallet
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center ${
              activeTab === 'history' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('history')}
          >
            <History className="mr-2" size={18} />
            Betting History
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center ${
              activeTab === 'assistant' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={onShowAssistant}
          >
            <Zap className="mr-2" size={18} />
            Smart Assistant
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="card">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <User className="mr-2" size={24} />
                Profile Information
              </h3>
            </div>
            <div className="p-6">
              {isEditingProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                      <User className="mr-2" size={20} />
                      Personal Information
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <User className="mr-2 text-lg" />
                          Full Name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <User size={20} />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Mail className="mr-2 text-lg" />
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Mail size={20} />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Phone className="mr-2 text-lg" />
                          Phone Number
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            value={editedUser.phone}
                            onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Phone size={20} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                      <Settings className="mr-2" size={20} />
                      Account Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Award className="mr-2 text-lg" />
                          Member Since
                        </label>
                        <p className="px-4 py-3 bg-gray-50 rounded-xl">
                          {new Date(editedUser.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <CalendarDays className="mr-2 text-lg" />
                          Last Login
                        </label>
                        <p className="px-4 py-3 bg-gray-50 rounded-xl">
                          {new Date(editedUser.lastLogin).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <ShieldCheck className="mr-2 text-lg" />
                          Account Role
                        </label>
                        <p className="px-4 py-3 bg-gray-50 rounded-xl capitalize">
                          {editedUser.role}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 pt-6 border-t">
                    <div className="flex gap-4">
                      <button 
                        onClick={saveProfileChanges}
                        className="btn btn-success px-6 py-3 flex items-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="loading-spinner mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2" size={20} />
                            Save Changes
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingProfile(false);
                          setEditedUser({...user});
                        }}
                        className="btn btn-secondary px-6 py-3 flex items-center"
                        disabled={isLoading}
                      >
                        <ShieldCheck className="mr-2" size={20} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                      <User className="mr-2" size={20} />
                      Personal Information
                    </h4>
                    <div className="space-y-6">
                      <div className="flex items-center">
                        <div className="relative mr-6">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white">
                            {profileImage ? (
                              <img 
                                src={profileImage} 
                                alt="Profile" 
                                className="w-24 h-24 rounded-full object-cover"
                              />
                            ) : (
                              user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <label className="absolute bottom-2 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                            <Camera size={18} className="text-gray-600" />
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageUpload}
                            />
                          </label>
                        </div>
                        <div>
                          <h5 className="font-bold text-2xl text-gray-800">{user.name}</h5>
                          <p className="text-gray-600 mt-1">Member since {new Date(user.registrationDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <p className="text-gray-700 flex items-center">
                          <Mail className="mr-3 text-lg" />
                          {user.email}
                        </p>
                        <p className="text-gray-700 flex items-center">
                          <Phone className="mr-3 text-lg" />
                          {user.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center">
                      <Settings className="mr-2" size={20} />
                      Account Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">{new Date(user.registrationDate).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Login:</span>
                        <span className="font-medium">{new Date(user.lastLogin).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Role:</span>
                        <span className="font-medium capitalize">{user.role}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Risk Level:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskLevelBadge(user.riskLevel)}`}>
                          {user.riskLevel.charAt(0).toUpperCase() + user.riskLevel.slice(1)} Risk
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Bets:</span>
                        <span className="font-medium">{user.totalBets}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Win Rate:</span>
                        <span className="font-medium">{winRate}%</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Favorite Sports:</span>
                        <div className="flex flex-wrap gap-1">
                          {user.favoriteSports.map(sport => (
                            <span 
                              key={sport} 
                              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 pt-6 border-t">
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="btn btn-primary px-6 py-3 flex items-center"
                    >
                      <Edit className="mr-2" size={20} />
                      Edit Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card">
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Lock className="mr-2" size={24} />
                Security Settings
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <Lock className="mr-2" size={20} />
                    Change Password
                  </h4>
                  
                  {showPasswordChange ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Lock className="mr-2 text-lg" />
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Lock size={20} />
                          </div>
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Lock className="mr-2 text-lg" />
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                            placeholder="At least 6 characters"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Lock size={20} />
                          </div>
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 font-medium mb-2 flex items-center">
                          <Lock className="mr-2 text-lg" />
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmNewPassword ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            disabled={isLoading}
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <Lock size={20} />
                          </div>
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          >
                            {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-4 pt-4">
                        <button 
                          onClick={handleChangePassword}
                          className="btn btn-success px-6 py-3 flex items-center"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <div className="loading-spinner mr-2"></div>
                              Changing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2" size={20} />
                              Change Password
                            </>
                          )}
                        </button>
                        <button 
                          onClick={() => {
                            setShowPasswordChange(false);
                            setCurrentPassword('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                          }}
                          className="btn btn-secondary px-6 py-3 flex items-center"
                          disabled={isLoading}
                        >
                          <ShieldCheck className="mr-2" size={20} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <p className="text-gray-700 mb-4">
                        For security reasons, you should change your password regularly.
                      </p>
                      <button 
                        onClick={() => setShowPasswordChange(true)}
                        className="btn btn-primary px-6 py-3 flex items-center"
                      >
                        <Lock className="mr-2" size={20} />
                        Change Password
                      </button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <ShieldCheck className="mr-2" size={20} />
                    Two-Factor Authentication
                  </h4>
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="font-bold text-gray-800">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="twoFactorToggle"
                        />
                        <label 
                          htmlFor="twoFactorToggle" 
                          className="block w-12 h-6 rounded-full bg-gray-300 cursor-pointer transition-colors duration-300"
                        ></label>
                        <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300"></span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">
                      Enable 2FA to protect your account with an additional verification step.
                    </p>
                    <button className="btn btn-primary px-6 py-3 flex items-center">
                      <ShieldCheck className="mr-2" size={20} />
                      Enable 2FA
                    </button>
                  </div>
                  
                  <h4 className="font-bold text-lg mt-8 mb-4 flex items-center">
                    <History className="mr-2" size={20} />
                    Login History
                  </h4>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <p className="text-gray-700 mb-4">
                      Your account was last accessed from:
                    </p>
                    <div className="flex items-center">
                      <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                        🌐
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">Unknown Device</p>
                        <p className="text-sm text-gray-600">
                          {new Date(user.lastLogin).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button className="btn btn-secondary w-full mt-4 flex items-center justify-center">
                      <Eye className="mr-2" size={20} />
                      View Full History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="card">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Settings className="mr-2" size={24} />
                Preferences & Settings
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <Bell className="mr-2" size={20} />
                    Notification Preferences
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="emailToggle"
                          defaultChecked
                        />
                        <label 
                          htmlFor="emailToggle" 
                          className="block w-12 h-6 rounded-full bg-blue-600 cursor-pointer transition-colors duration-300"
                        ></label>
                        <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300"></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates via SMS</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="smsToggle"
                          defaultChecked
                        />
                        <label 
                          htmlFor="smsToggle" 
                          className="block w-12 h-6 rounded-full bg-blue-600 cursor-pointer transition-colors duration-300"
                        ></label>
                        <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300"></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-600">Receive in-app notifications</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input 
                          type="checkbox" 
                          className="sr-only" 
                          id="pushToggle"
                          defaultChecked
                        />
                        <label 
                          htmlFor="pushToggle" 
                          className="block w-12 h-6 rounded-full bg-blue-600 cursor-pointer transition-colors duration-300"
                        ></label>
                        <span className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300"></span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-lg mb-4 flex items-center">
                    <Target className="mr-2" size={20} />
                    Betting Preferences
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <Award className="mr-2 text-lg" />
                        Risk Level
                      </label>
                      <select
                        value={user.riskLevel}
                        onChange={(e) => setEditedUser({...user, riskLevel: e.target.value as 'low' | 'medium' | 'high'})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="low">Low Risk</option>
                        <option value="medium">Medium Risk</option>
                        <option value="high">High Risk</option>
                      </select>
                      <p className="text-sm text-gray-600 mt-1">
                        Adjusts betting limits and recommendations
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <Heart className="mr-2 text-lg" />
                        Favorite Sports
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Football', 'Cricket', 'Basketball', 'Tennis', 'Hockey'].map(sport => (
                          <label key={sport} className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
                            <input
                              type="checkbox"
                              defaultChecked={user.favoriteSports.includes(sport)}
                              className="mr-2"
                            />
                            {sport}
                          </label>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Personalizes your betting experience
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 flex items-center">
                        <CalendarDays className="mr-2 text-lg" />
                        Betting Schedule
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Morning', 'Afternoon', 'Evening', 'Night'].map(time => (
                          <label key={time} className="flex items-center bg-gray-100 px-3 py-2 rounded-full">
                            <input
                              type="checkbox"
                              defaultChecked
                              className="mr-2"
                            />
                            {time}
                          </label>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Preferred times for betting notifications
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t">
                <button 
                  onClick={saveProfileChanges}
                  className="btn btn-success px-6 py-3 flex items-center"
                >
                  <CheckCircle className="mr-2" size={20} />
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="card">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <CreditCard className="mr-2" size={24} />
                Wallet & Transactions
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="card">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-t-2xl">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Wallet className="mr-2" size={24} />
                        Wallet Balance
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="text-center">
                        <div className="mb-6">
                          <p className="text-sm text-gray-500 mb-1">Current Balance</p>
                          <p className="text-5xl md:text-6xl font-bold text-gray-800 flex items-center justify-center">
                            <span className="mr-3 text-4xl">💵</span>
                            {user.balance.toLocaleString()} 
                            <span className="text-2xl md:text-3xl ml-3">BDT</span>
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <button 
                            onClick={handleDeposit} 
                            className="btn btn-success flex flex-col items-center justify-center py-4"
                          >
                            <span className="text-3xl mb-2">📥</span>
                            <span className="font-semibold">Deposit</span>
                          </button>
                          <button 
                            onClick={handleWithdraw} 
                            className="btn btn-warning flex flex-col items-center justify-center py-4"
                          >
                            <span className="text-3xl mb-2">📤</span>
                            <span className="font-semibold">Withdraw</span>
                          </button>
                        </div>
                        
                        {/* Quick Deposit Options */}
                        <div className="mt-8 pt-8 border-t">
                          <p className="text-sm text-gray-500 mb-3">Quick Deposit</p>
                          <div className="flex justify-center gap-3 flex-wrap">
                            {[500, 1000, 2000, 5000].map(amount => (
                              <button
                                key={amount}
                                onClick={() => onDeposit(amount)}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg text-lg font-medium transition-colors"
                              >
                                {amount}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction Summary */}
                  <div className="card">
                    <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-t-2xl">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                        <BarChart className="mr-2" size={24} />
                        Transaction Summary
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">{user.totalBets}</p>
                          <p className="text-sm text-gray-600">Total Bets</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">{user.totalWins}</p>
                          <p className="text-sm text-gray-600">Wins</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-yellow-600">{user.totalBets}</p>
                          <p className="text-sm text-gray-600">Total Bets</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-600">{user.totalBets > 0 ? ((user.totalWins / user.totalBets) * 100).toFixed(2) : '0.00'}</p>
                          <p className="text-sm text-gray-600">Payouts</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="card">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
                      <h4 className="text-xl font-bold text-white flex items-center">
                        <History className="mr-2" size={24} />
                        Recent Transactions
                      </h4>
                    </div>
                    <div className="p-6">
                      {userTransactions && userTransactions.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left rounded-l-lg">Date</th>
                                <th className="py-3 px-4 text-left">Type</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left rounded-r-lg">Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...userTransactions]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .slice(0, 10)
                                .map((tx, index) => (
                                  <tr 
                                    key={tx.id} 
                                    className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                  >
                                    <td className="py-3 px-4">
                                      <div className="font-medium">
                                        {new Date(tx.date).toLocaleDateString()}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4">
                                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                                        tx.type === 'Deposit' ? 'bg-green-100 text-green-800' :
                                        tx.type === 'Withdrawal' ? 'bg-purple-100 text-purple-800' :
                                        tx.type === 'Bet' ? 'bg-blue-100 text-blue-800' :
                                        tx.type === 'Win' ? 'bg-yellow-100 text-yellow-800' :
                                        tx.type === 'Bonus' ? 'bg-pink-100 text-pink-800' :
                                        'bg-red-100 text-red-800'
                                      }`}>
                                        <span className="mr-1">
                                          {tx.type === 'Deposit' ? '📥' :
                                           tx.type === 'Withdrawal' ? '📤' :
                                           tx.type === 'Bet' ? '🎰' :
                                           tx.type === 'Win' ? '🏆' :
                                           tx.type === 'Bonus' ? '🎁' :
                                           '💳'}
                                        </span>
                                        {tx.type}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-gray-800">
                                      {tx.type === 'Withdrawal' || tx.type === 'Bet' || tx.type === 'Fee' ? '-' : '+'}
                                      {tx.amount.toLocaleString()} BDT
                                    </td>
                                    <td className="py-3 px-4 text-gray-600">
                                      {tx.description}
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">📋</div>
                          <h4 className="text-xl font-medium text-gray-900 mb-2">No transactions yet</h4>
                          <p className="text-gray-500 max-w-md mx-auto">
                            Your transaction history will appear here once you start making deposits or withdrawals.
                          </p>
                          <div className="mt-6 flex justify-center gap-4">
                            <button 
                              onClick={handleDeposit} 
                              className="btn btn-success flex items-center"
                            >
                              <span className="mr-2">📥</span>
                              Make Deposit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="card">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <History className="mr-2" size={24} />
                Betting History
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-1 space-y-6">
                  {/* Performance Stats */}
                  <div className="card">
                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-6 rounded-t-2xl">
                      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                        <Award className="mr-2" size={24} />
                        Performance
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">{winRate}%</p>
                          <p className="text-sm text-gray-600">Win Rate</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">{user.totalWins}</p>
                          <p className="text-sm text-gray-600">Wins</p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-yellow-600">{user.totalBets}</p>
                          <p className="text-sm text-gray-600">Total Bets</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                          <p className="text-2xl font-bold text-purple-600">{user.favoriteSports.length}</p>
                          <p className="text-sm text-gray-600">Sports</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-6 border-t">
                        <h5 className="font-bold mb-3">Favorite Sports</h5>
                        <div className="flex flex-wrap gap-2">
                          {user.favoriteSports.map(sport => (
                            <span 
                              key={sport} 
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              {sport}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Smart Recommendations */}
                  <div className="card">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-2xl">
                      <h4 className="text-xl font-bold text-white flex items-center">
                        <Zap className="mr-2" size={24} />
                        Smart Recommendations
                      </h4>
                    </div>
                    <div className="p-6">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                        <h5 className="font-bold text-lg mb-2 flex items-center">
                          <Zap className="mr-2 text-yellow-500" size={20} />
                          Personalized for You
                        </h5>
                        <p className="text-gray-700">
                          Based on your betting history, we recommend focusing on {user.favoriteSports[0] || 'popular'} matches 
                          with value odds above 2.0 for better returns.
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h6 className="font-bold text-green-800 mb-2">💰 Bankroll Management</h6>
                          <p className="text-sm text-green-700">
                            Never bet more than 5% of your total bankroll on a single bet.
                          </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h6 className="font-bold text-blue-800 mb-2">📊 Diversification</h6>
                          <p className="text-sm text-blue-700">
                            Spread your bets across different sports to reduce risk.
                          </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h6 className="font-bold text-purple-800 mb-2">⏰ Timing</h6>
                          <p className="text-sm text-purple-700">
                            Place bets early to get the best odds before they change.
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h6 className="font-bold text-yellow-800 mb-2">📈 Tracking</h6>
                          <p className="text-sm text-yellow-700">
                            Review your betting history weekly to identify patterns.
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={onShowAssistant}
                        className="btn btn-primary w-full mt-6 flex items-center justify-center"
                      >
                        <Zap className="mr-2" size={20} />
                        Get More Smart Recommendations
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <div className="card">
                    <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-6 rounded-t-2xl">
                      <h4 className="text-xl font-bold text-white flex items-center">
                        <Target className="mr-2" size={24} />
                        Recent Bets
                      </h4>
                    </div>
                    <div className="p-6">
                      {userBets && userBets.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="py-3 px-4 text-left rounded-l-lg">Date</th>
                                <th className="py-3 px-4 text-left">Match</th>
                                <th className="py-3 px-4 text-left">Team</th>
                                <th className="py-3 px-4 text-left">Amount</th>
                                <th className="py-3 px-4 text-left rounded-r-lg">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[...userBets]
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .slice(0, 10)
                                .map((bet, index) => {
                                  return (
                                    <tr 
                                      key={bet.id} 
                                      className={`border-t hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                      <td className="py-3 px-4">
                                        <div className="font-medium">
                                          {new Date(bet.date).toLocaleDateString()}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {new Date(bet.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </div>
                                      </td>
                                      <td className="py-3 px-4 text-sm">
                                        Match #{bet.matchId}
                                      </td>
                                      <td className="py-3 px-4">
                                        {bet.teamChosen}
                                      </td>
                                      <td className="py-3 px-4 font-bold text-gray-800">
                                        {bet.amount.toFixed(2)} BDT
                                      </td>
                                      <td className="py-3 px-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center ${
                                          bet.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                          bet.status === 'Won' ? 'bg-green-100 text-green-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          <span className="mr-1">
                                            {bet.status === 'Pending' ? '⏳' :
                                             bet.status === 'Won' ? '🏆' :
                                             '❌'}
                                          </span>
                                          {bet.status}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })
                              }
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="text-6xl mb-4">🎯</div>
                          <h4 className="text-xl font-medium text-gray-900 mb-2">No bets placed yet</h4>
                          <p className="text-gray-500 max-w-md mx-auto">
                            Your betting history will appear here once you start placing bets.
                          </p>
                          <div className="mt-6 flex justify-center gap-4">
                            <Link 
                              to="/matches" 
                              className="btn btn-primary flex items-center"
                            >
                              <span className="mr-2">⚽</span>
                              Start Betting
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assistant Tab */}
        {activeTab === 'assistant' && (
          <div className="card">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-t-2xl">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Zap className="mr-2" size={24} />
                Smart Assistant
              </h3>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-8">
                <h4 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  <Zap className="mr-3 text-yellow-500" size={32} />
                  Personalized Betting Assistant
                </h4>
                <p className="text-gray-700 text-lg">
                  Based on your betting history, I've analyzed your performance and created 
                  personalized recommendations to help you improve your win rate.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-r from-green-50 to-teal-50">
                  <div className="p-6">
                    <h5 className="font-bold text-lg mb-3 flex items-center">
                      <Award className="mr-2 text-green-600" size={20} />
                      Performance Analysis
                    </h5>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Win Rate:</span>
                        <span className="font-bold text-green-600">{winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Bets:</span>
                        <span className="font-bold text-blue-600">{user.totalBets}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Wins:</span>
                        <span className="font-bold text-purple-600">{user.totalWins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Favorite Sport:</span>
                        <span className="font-bold text-yellow-600">{user.favoriteSports[0] || 'None'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="p-6">
                    <h5 className="font-bold text-lg mb-3 flex items-center">
                      <Target className="mr-2 text-blue-600" size={20} />
                      Smart Recommendations
                    </h5>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Focus on {user.favoriteSports[0] || 'popular'} matches</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Bet on odds above 2.0 for better value</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Diversify across different sports</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>Maintain 5% bankroll management rule</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="card bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="p-6">
                    <h5 className="font-bold text-lg mb-3 flex items-center">
                      <CalendarDays className="mr-2 text-purple-600" size={20} />
                      Upcoming Opportunities
                    </h5>
                    <div className="space-y-3">
                      <p className="text-gray-600">Check the matches page for upcoming opportunities.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-t-2xl">
                  <h5 className="text-xl font-bold text-white flex items-center">
                    <Zap className="mr-2" size={24} />
                    AI-Powered Insights
                  </h5>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h6 className="font-bold text-lg mb-3 flex items-center">
                        <BarChart className="mr-2 text-indigo-600" size={20} />
                        Betting Patterns
                      </h6>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                        <p className="text-gray-700">
                          Your betting pattern shows a preference for {user.favoriteSports[0] || 'popular'} matches. 
                          You tend to bet more during evening hours, with an average bet size of {userBets.length > 0 ? (userBets.reduce((sum, bet) => sum + bet.amount, 0) / userBets.length).toFixed(2) : '0.00'} BDT.
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="font-bold text-lg mb-3 flex items-center">
                        <TrendingUp className="mr-2 text-green-600" size={20} />
                        Improvement Suggestions
                      </h6>
                      <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4">
                        <ul className="space-y-2 text-gray-700">
                          <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Increase bet frequency on value odds (above 2.5)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Reduce bets on low-confidence matches</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-600 mr-2">✓</span>
                            <span>Consider live betting for better engagement</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={onShowAssistant}
                    className="btn btn-primary w-full mt-6 flex items-center justify-center"
                  >
                    <Zap className="mr-2" size={20} />
                    Get More Detailed Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfilePage;
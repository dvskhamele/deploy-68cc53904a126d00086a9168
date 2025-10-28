import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Shield, AlertCircle, CheckCircle, Key, Fingerprint } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [success, setSuccess] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // For demo purposes, we'll simulate 2FA for admin accounts
      if (email === 'admin@example.com') {
        setShowTwoFactor(true);
        setSentCode(true);
        setSuccess('2FA code sent to your registered device!');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }
      
      await onLogin(email, password);
      setSuccess('Login successful! Redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: unknown) {
      setError((err as Error).message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = () => {
    if (!twoFactorCode) {
      setError('Please enter the 2FA code');
      return;
    }
    
    // In a real implementation, this would validate the 2FA code
    if (twoFactorCode === '123456') {
      setSuccess('2FA verified! Logging in...');
      setTimeout(() => {
        setShowTwoFactor(false);
        navigate('/admin');
      }, 1500);
    } else {
      setError('Invalid 2FA code. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality would be implemented in a real application');
  };

  const handleResendCode = () => {
    setSentCode(true);
    setSuccess('2FA code resent to your device!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center px-4 py-12">
      <div className="stunning-card w-full max-w-md animate-zoom-in hover:shadow-2xl transition-all duration-500">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-10 text-center rounded-t-3xl">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
            <Lock size={64} className="text-white" />
          </div>
          <h2 className="text-5xl font-extrabold text-white mb-4">Welcome Back</h2>
          <p className="text-blue-100 text-2xl">Sign in to your TK999 account</p>
        </div>
        
        <form id="login-form" onSubmit={handleSubmit} className="p-10">
          {/* Success Message */}
          {success && (
            <div className="mb-8 p-5 bg-green-100 text-green-700 rounded-3xl text-center flex items-center font-bold text-xl animate-slide-in-top">
              <CheckCircle className="mr-4" size={32} />
              {success}
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-8 p-5 bg-red-100 text-red-700 rounded-3xl text-center flex items-center font-bold text-xl animate-slide-in-top">
              <AlertCircle className="mr-4" size={32} />
              {error}
            </div>
          )}
          
          {/* 2FA Screen */}
          {showTwoFactor ? (
            <div className="space-y-8">
              <div className="text-center">
                <Fingerprint className="mx-auto mb-8 text-blue-600 animate-float" size={72} />
                <h3 className="text-3xl font-extrabold text-gray-800 mb-4">Two-Factor Authentication</h3>
                <p className="text-gray-600 text-2xl">
                  Enter the 6-digit code sent to your registered device
                </p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                  <Key className="mr-3 text-3xl" />
                  2FA Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="stunning-input pl-20 pr-6 py-5 text-2xl"
                    placeholder="Enter 6-digit code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    disabled={isLoading}
                    maxLength={6}
                    autoComplete="off"
                  />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Key size={36} />
                  </div>
                </div>
                <p className="text-lg text-gray-500 mt-4">
                  Didn't receive a code?{' '}
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-blue-600 hover:text-blue-800 font-extrabold"
                    disabled={!sentCode}
                  >
                    Resend Code
                  </button>
                </p>
              </div>
              
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setShowTwoFactor(false)}
                  className="stunning-btn stunning-btn-secondary flex-1 py-5 hover:scale-105 transition-transform duration-300 text-2xl"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleTwoFactorSubmit}
                  className="stunning-btn stunning-btn-primary flex-1 flex items-center justify-center py-5 hover:scale-105 transition-transform duration-300 text-2xl animate-pulse-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="stunning-spinner mr-4"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-3" size={32} />
                      Verify
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Email Field */}
              <div className="mb-8">
                <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                  <Mail className="mr-3 text-3xl" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    className="stunning-input pl-20 pr-6 py-5 text-2xl"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    autoComplete="email"
                  />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail size={36} />
                  </div>
                </div>
              </div>
              
              {/* Password Field */}
              <div className="mb-8">
                <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                  <Lock className="mr-3 text-3xl" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="stunning-input pl-20 pr-20 py-5 text-2xl"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={36} />
                  </div>
                  <button
                    type="button"
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={36} /> : <Eye size={36} />}
                  </button>
                </div>
                
                {/* Remember Me and Forgot Password */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      className="mr-4 w-7 h-7"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe" className="text-gray-600 flex items-center font-extrabold text-2xl">
                      <Shield className="mr-3" size={32} />
                      Remember me
                    </label>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-blue-600 hover:text-blue-800 font-extrabold flex items-center text-2xl"
                  >
                    <Key className="mr-3" size={32} />
                    Forgot password?
                  </button>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="mb-8">
                <button 
                  type="submit" 
                  className="stunning-btn stunning-btn-primary w-full flex items-center justify-center py-6 relative hover:scale-[1.02] transition-transform duration-300 text-2xl animate-pulse-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="stunning-spinner mr-4"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-4" size={36} />
                      Sign In
                    </>
                  )}
                </button>
              </div>
              
              {/* Demo Credentials */}
              <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl border border-green-200 animate-slide-in-bottom">
                <p className="text-gray-700 text-xl">
                  <span className="font-extrabold text-green-700 flex items-center mb-4 text-2xl">
                    <User className="mr-3" size={32} />
                    Demo Credentials:
                  </span>
                  <span className="font-extrabold">Regular User:</span> any email + password <span className="font-mono bg-white px-4 py-2 rounded-2xl font-extrabold text-2xl">123456</span>
                  <br className="my-4" />
                  <span className="font-extrabold">Admin User:</span> <span className="font-mono bg-white px-4 py-2 rounded-2xl font-extrabold text-2xl">admin@example.com</span> + password <span className="font-mono bg-white px-4 py-2 rounded-2xl font-extrabold text-2xl">admin123</span>
                </p>
              </div>
              
              {/* Registration Link */}
              <div className="mt-12 text-center">
                <p className="text-gray-600 text-2xl">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-blue-600 font-extrabold hover:text-blue-800 transition-all duration-300 flex items-center justify-center group text-2xl"
                  >
                    <span className="mr-3 group-hover:mr-4 transition-all duration-300">📝</span>
                    Register now
                    <span className="ml-3 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
                  </Link>
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
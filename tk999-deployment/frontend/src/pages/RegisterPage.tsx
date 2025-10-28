import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Key } from 'lucide-react';

interface RegisterPageProps {
  onRegister: (name: string, email: string, phone: string) => any;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [sentCode, setSentCode] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Phone validation (simple)
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phone)) {
      setError('Please enter a valid phone number');
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // In a real implementation, we would send verification code first
      if (!showVerification) {
        // Mock sending verification code
        setSentCode(true);
        setShowVerification(true);
        setSuccess('Verification code sent to your email!');
        setTimeout(() => setSuccess(''), 3000);
        return;
      }
      
      // Check verification code
      if (verificationCode !== '123456') {
        setError('Invalid verification code');
        return;
      }
      
      await onRegister(name, email, phone);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSubmit = () => {
    // Trigger the main submit handler for verification
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    handleSubmit(fakeEvent);
  };

  const handleResendCode = () => {
    // In a real implementation, this would resend the verification code
    setSentCode(true);
    setSuccess('Verification code resent!');
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-12">
      <div className="stunning-card w-full max-w-md animate-zoom-in hover:shadow-2xl transition-all duration-500">
        <div className="bg-gradient-to-r from-green-500 to-blue-600 p-10 text-center rounded-t-3xl">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
            <User size={64} className="text-white" />
          </div>
          <h2 className="text-5xl font-extrabold text-white mb-4">Create Account</h2>
          <p className="text-blue-100 text-2xl">Join TK999 today and start betting</p>
        </div>
        
        <form id="register-form" onSubmit={handleSubmit} className="p-10">
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
          
          {/* Verification Screen */}
          {showVerification ? (
            <div className="space-y-8">
              <div className="text-center">
                <Key className="mx-auto mb-8 text-green-600 animate-float" size={72} />
                <h3 className="text-3xl font-extrabold text-gray-800 mb-4">Email Verification</h3>
                <p className="text-gray-600 text-2xl">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
              
              <div>
                <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                  <Key className="mr-3 text-3xl" />
                  Verification Code
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="stunning-input pl-20 pr-6 py-5 text-2xl"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
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
                    className="text-green-600 hover:text-green-800 font-extrabold"
                    disabled={!sentCode}
                  >
                    Resend Code
                  </button>
                </p>
              </div>
              
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setShowVerification(false)}
                  className="stunning-btn stunning-btn-secondary flex-1 py-5 hover:scale-105 transition-transform duration-300 text-2xl"
                  disabled={isLoading}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleVerificationSubmit}
                  className="stunning-btn stunning-btn-success flex-1 flex items-center justify-center py-5 hover:scale-105 transition-transform duration-300 text-2xl animate-pulse-glow"
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
              {/* Name Field */}
              <div className="mb-6">
                <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                  <User className="mr-3 text-3xl" />
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="stunning-input pl-20 pr-6 py-5 text-2xl"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    autoComplete="name"
                  />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <User size={36} />
                  </div>
                </div>
              </div>
              
              {/* Email Field */}
              <div className="mb-6">
                <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                  <Mail className="mr-3 text-3xl" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
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
              
              {/* Phone Field */}
              <div className="mb-6">
                <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                  <Phone className="mr-3 text-3xl" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    className="stunning-input pl-20 pr-6 py-5 text-2xl"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    autoComplete="tel"
                  />
                  <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Phone size={36} />
                  </div>
                </div>
              </div>
              
              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                    <Lock className="mr-3 text-3xl" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="stunning-input pl-20 pr-20 py-5 text-2xl"
                      placeholder="Create password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
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
                </div>
                
                <div>
                  <label className="block text-gray-700 font-extrabold mb-4 flex items-center text-2xl">
                    <Lock className="mr-3 text-3xl" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="stunning-input pl-20 pr-20 py-5 text-2xl"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="new-password"
                    />
                    <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Lock size={36} />
                    </div>
                    <button
                      type="button"
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={36} /> : <Eye size={36} />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Terms Agreement */}
              <div className="mb-8">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    className="mr-4 mt-1 w-7 h-7"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                    disabled={isLoading}
                  />
                  <label htmlFor="agreeToTerms" className="text-gray-600 font-extrabold text-xl">
                    I agree to the <Link to="/terms" className="text-green-600 hover:underline font-extrabold">Terms of Service</Link> and <Link to="/privacy" className="text-green-600 hover:underline font-extrabold">Privacy Policy</Link>
                  </label>
                </div>
              </div>
            </>
          )}
          
          {/* Submit Button */}
          <div className="mb-6">
            <button 
              type="submit" 
              className="w-full btn btn-success flex items-center justify-center py-4 relative hover:scale-[1.02] transition-transform duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner mr-3"></div>
                  {showVerification ? 'Verifying...' : 'Creating Account...'}
                </>
              ) : (
                <>
                  <User className="mr-3" size={22} />
                  {showVerification ? 'Verify Account' : 'Create Account'}
                </>
              )}
            </button>
          </div>
          
          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-green-600 font-bold hover:text-green-800 transition-all duration-300 flex items-center justify-center group"
              >
                <span className="mr-2 group-hover:mr-3 transition-all duration-300">🔑</span>
                Sign in
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300">→</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
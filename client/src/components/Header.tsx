import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';

export default function Header() {
  const { user, logout, wallet } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('You have been logged out successfully', 'success');
    navigate('/login');
  };

  return (
    <header className="bg-gradient-primary shadow-xl sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <Link 
            to="/dashboard" 
            className="text-2xl md:text-3xl font-bold text-white flex items-center group"
          >
            <span className="text-2xl md:text-3xl mr-2 group-hover:rotate-12 transition-transform duration-300">🎲</span>
            TK999
          </Link>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          {wallet && (
            <div className="bg-gradient-success text-white px-5 py-3 rounded-full font-bold flex items-center shadow-lg">
              <span className="mr-2 text-xl">💰</span>
              <span className="text-lg">{wallet.balance.toLocaleString()} BDT</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg">
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-semibold">{user?.name || 'User'}</p>
              <p className="text-blue-100 text-sm">{user?.isAdmin ? 'Admin' : 'Member'}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              to="/dashboard" 
              className="btn btn-success flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
              title="Dashboard"
            >
              <span className="text-2xl">📊</span>
              <span className="text-xs mt-1">Dashboard</span>
            </Link>
            
            <Link 
              to="/matches" 
              className="btn btn-primary flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
              title="Matches"
            >
              <span className="text-2xl">⚽</span>
              <span className="text-xs mt-1">Matches</span>
            </Link>
            
            {user?.isAdmin && (
              <Link 
                to="/admin" 
                className="btn btn-warning flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
                title="Admin"
              >
                <span className="text-2xl">⚙️</span>
                <span className="text-xs mt-1">Admin</span>
              </Link>
            )}
            
            <button 
              onClick={handleLogout}
              className="btn btn-danger flex flex-col items-center justify-center w-16 h-16 rounded-2xl transform transition-all duration-300 hover:scale-110"
              title="Logout"
            >
              <span className="text-2xl">🚪</span>
              <span className="text-xs mt-1">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

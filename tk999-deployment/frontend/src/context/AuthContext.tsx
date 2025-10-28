import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { getUserDashboard } from '../services/mockApi';

interface User {
  id: number | string;
  name: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  wallet: { balance: number } | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  fetchWallet: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [wallet, setWallet] = useState<{ balance: number } | null>(null);

  const fetchWallet = async () => {
    const currentToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (currentToken && storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            // Ensure user ID is the correct type
            const userId = typeof userData.id === 'string' ? parseInt(userData.id) : userData.id;
            const dashboardData = await getUserDashboard(userId);
            setWallet(dashboardData.wallet);
        } catch (error) {
            console.error('Failed to fetch wallet', error);
        }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      try {
        const userData = JSON.parse(storedUser);
        // Ensure user ID is the correct type
        const userWithCorrectId = {
          ...userData,
          id: typeof userData.id === 'string' ? parseInt(userData.id) : userData.id
        };
        setUser(userWithCorrectId);
        fetchWallet();
      } catch (error) {
        console.error('Failed to parse user data', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    }
  }, [token]);

  const login = (userData: User, token: string) => {
    // Ensure user ID is stored as a number
    const userWithNumberId = {
      ...userData,
      id: typeof userData.id === 'string' ? parseInt(userData.id) : userData.id
    };
    localStorage.setItem('user', JSON.stringify(userWithNumberId));
    localStorage.setItem('token', token);
    setUser(userWithNumberId);
    setToken(token);
    fetchWallet();
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, wallet, login, logout, fetchWallet, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

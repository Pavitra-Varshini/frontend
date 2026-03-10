import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { getToken, storeToken, clearToken } from '../services/storage';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  userId: string | null;
  login: (token: string, userId: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component
 * Manages authentication state across the app
 * Provides login/logout functions and authentication status
 * Requirements: 4.2, 4.3, 10.5
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const storedToken = await getToken();
      if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      setIsAuthenticated(false);
      return false;
    }
  };

  const login = async (newToken: string, newUserId: string): Promise<void> => {
    try {
      await storeToken(newToken);
      setToken(newToken);
      setUserId(newUserId);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to store token:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await clearToken();
      setToken(null);
      setUserId(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to clear token:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    token,
    userId,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 * Throws error if used outside AuthProvider
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

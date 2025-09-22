
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FAKE_USER = {
  username: 'Entrepreneuse',
  password: 'password', // In a real app, never store plain text passwords
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is logged in from a previous session
    try {
      const loggedIn = sessionStorage.getItem('isMilbusAuthenticated') === 'true';
      setIsAuthenticated(loggedIn);
    } catch (error) {
        // If sessionStorage is not available (e.g. in server rendering), default to false
        setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (username.toLowerCase() === FAKE_USER.username.toLowerCase() && pass === FAKE_USER.password) {
          setIsAuthenticated(true);
          try {
            sessionStorage.setItem('isMilbusAuthenticated', 'true');
          } catch (error) {
            console.warn('sessionStorage is not available. Login state will not persist.');
          }
          setIsLoading(false);
          resolve();
        } else {
          setIsAuthenticated(false);
          setIsLoading(false);
          reject(new Error('Nom d\'utilisateur ou mot de passe incorrect.'));
        }
      }, 500); // Simulate network delay
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
        sessionStorage.removeItem('isMilbusAuthenticated');
    } catch (error) {
        // sessionStorage not available
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


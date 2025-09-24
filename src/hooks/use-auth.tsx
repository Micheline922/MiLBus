
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  username: string | null;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'milbus-user-credentials';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem('isMilbusAuthenticated') === 'true';
      if (loggedIn) {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
            setUsername(JSON.parse(storedUser).storedUsername);
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Could not access localStorage.');
    }
    setIsLoading(false);
  }, []);

  const login = async (user: string, pass: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedUser = localStorage.getItem(USER_KEY);

          if (storedUser) {
            // User exists, validate credentials
            const { storedUsername, storedPassword } = JSON.parse(storedUser);
            if (user.toLowerCase() === storedUsername.toLowerCase() && pass === storedPassword) {
              setIsAuthenticated(true);
              setUsername(storedUsername);
              localStorage.setItem('isMilbusAuthenticated', 'true');
              setIsLoading(false);
              resolve();
            } else {
              setIsLoading(false);
              reject(new Error("Le nom d'utilisateur ou le mot de passe est incorrect."));
            }
          } else {
            // First time login/signup, save credentials
            if (!user || !pass) {
               setIsLoading(false);
               return reject(new Error("Le nom d'utilisateur et le mot de passe ne peuvent pas être vides."));
            }
            const newUser = { storedUsername: user, storedPassword: pass };
            localStorage.setItem(USER_KEY, JSON.stringify(newUser));
            setIsAuthenticated(true);
            setUsername(user);
            localStorage.setItem('isMilbusAuthenticated', 'true');
            setIsLoading(false);
            resolve();
          }
        } catch (error) {
          setIsLoading(false);
          reject(new Error("Une erreur est survenue lors de l'accès au stockage local."));
        }
      }, 500); // Simulate network delay
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    try {
      // We keep the user credentials but log them out
      localStorage.removeItem('isMilbusAuthenticated');
    } catch (error) {
      console.warn('localStorage is not available. Logout state may not persist.');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, username, login, logout }}>
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

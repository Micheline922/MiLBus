
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type UserData = {
    username: string;
    businessName: string;
    businessAddress: string;
    businessContact: string;
    profilePicture: string | null;
};

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<Omit<UserData, 'username'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = 'milbus-user-credentials';

const defaultBusinessInfo = {
    businessName: "MiLBus - Beauté & Style",
    businessAddress: "Votre Adresse, Votre Ville",
    businessContact: "contact@milbus.com",
    profilePicture: null,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem('isMilbusAuthenticated') === 'true';
      if (loggedIn) {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser({
                username: parsed.storedUsername,
                businessName: parsed.businessName || defaultBusinessInfo.businessName,
                businessAddress: parsed.businessAddress || defaultBusinessInfo.businessAddress,
                businessContact: parsed.businessContact || defaultBusinessInfo.businessContact,
                profilePicture: parsed.profilePicture || null,
            });
        }
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.warn('Could not access localStorage.');
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, pass: string) => {
    setIsLoading(true);
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          const storedUser = localStorage.getItem(USER_KEY);

          if (storedUser) {
            // User exists, validate credentials
            const { storedUsername, storedPassword, ...businessInfo } = JSON.parse(storedUser);
            if (username.toLowerCase() === storedUsername.toLowerCase() && pass === storedPassword) {
              setIsAuthenticated(true);
              setUser({ 
                  username: storedUsername,
                  businessName: businessInfo.businessName || defaultBusinessInfo.businessName,
                  businessAddress: businessInfo.businessAddress || defaultBusinessInfo.businessAddress,
                  businessContact: businessInfo.businessContact || defaultBusinessInfo.businessContact,
                  profilePicture: businessInfo.profilePicture || null,
              });
              localStorage.setItem('isMilbusAuthenticated', 'true');
              setIsLoading(false);
              resolve();
            } else {
              setIsLoading(false);
              reject(new Error("Le nom d'utilisateur ou le mot de passe est incorrect."));
            }
          } else {
            // First time login/signup, save credentials
            if (!username || !pass) {
               setIsLoading(false);
               return reject(new Error("Le nom d'utilisateur et le mot de passe ne peuvent pas être vides."));
            }
            const newUser = { 
                storedUsername: username, 
                storedPassword: pass,
                ...defaultBusinessInfo
            };
            localStorage.setItem(USER_KEY, JSON.stringify(newUser));
            setIsAuthenticated(true);
            setUser({ username, ...defaultBusinessInfo });
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
    setUser(null);
    try {
      localStorage.removeItem('isMilbusAuthenticated');
    } catch (error) {
      console.warn('localStorage is not available. Logout state may not persist.');
    }
  };

  const updateUser = (data: Partial<Omit<UserData, 'username'>>) => {
    if (!user) return;
    try {
        const stored = localStorage.getItem(USER_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const updatedData = { ...parsed, ...data };
            localStorage.setItem(USER_KEY, JSON.stringify(updatedData));
            setUser(prev => prev ? { ...prev, ...data } : null);
        }
    } catch(e) {
        console.error("Failed to update user data", e);
    }
  };


  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    updateUser,
    get username() { return user?.username ?? null; } // keep getter for compatibility
  };

  return (
    <AuthContext.Provider value={value}>
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

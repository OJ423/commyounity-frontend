"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  user_id: string;
  username: string;
  email: string;
  status: string;
}

interface Community {
  selectedCommunity: string,
  communityName: string
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  selectedCommunity: Community | null
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setSelectedCommunity: (selectedCommunity: Community | null) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedCommunity = localStorage.getItem('selectedCommunity')
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCommunity) {
      setSelectedCommunity(JSON.parse(savedCommunity));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, selectedCommunity, setToken, setUser, setSelectedCommunity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
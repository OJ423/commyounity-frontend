"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  user_id: string;
  username: string;
  email: string;
  status: string;
}

interface Community {
  community_id: number,
  community_name: string,
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  selectedCommunity: Community | null;
  communities: Community[];
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setSelectedCommunity: (selectedCommunity: Community | null) => void;
  setCommunities: (communities: Community[] | []) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [communities, setCommunities] = useState<Community[] | [] >([]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedCommunity = localStorage.getItem('selectedCommunity')
    const savedCommunities = localStorage.getItem('communities')
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedCommunities) {
      setCommunities(JSON.parse(savedCommunities));
    }
    if (savedCommunity) {
      setSelectedCommunity(JSON.parse(savedCommunity))
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, selectedCommunity, communities, setToken, setUser, setSelectedCommunity, setCommunities  }}>
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
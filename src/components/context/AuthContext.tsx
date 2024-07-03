"use client"

import { BusinessMembership, ChurchCard, GroupCard, SchoolCard } from '@/utils/customTypes';
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

interface UserMemberships {
  user_id: number,
  username: string,
  businesses: BusinessMembership[];
  schools: SchoolCard[];
  groups: GroupCard[];
  churches: ChurchCard[];
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  selectedCommunity: Community | null;
  communities: Community[];
  userMemberships: UserMemberships | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setSelectedCommunity: (selectedCommunity: Community | null) => void;
  setCommunities: (communities: Community[] | []) => void;
  setUserMemberships: (userMemberships: UserMemberships | null) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [communities, setCommunities] = useState<Community[] | [] >([]);
  const [userMemberships, setUserMemberships] = useState<UserMemberships | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedCommunity = localStorage.getItem('selectedCommunity')
    const savedCommunities = localStorage.getItem('communities')
    const savedMemberships = localStorage.getItem('userMemberships')
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
    if (savedMemberships) {
      setUserMemberships(JSON.parse(savedMemberships))
    }
    

  }, []);

  return (
    <AuthContext.Provider value={{ token, user, selectedCommunity, communities, userMemberships, setToken, setUser, setSelectedCommunity, setCommunities, setUserMemberships  }}>
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
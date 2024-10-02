"use client"

import { BusinessMembership, ChurchCard, GroupCard, SchoolCard } from '@/utils/customTypes';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  user_id: string;
  username: string;
  user_bio: string;
  user_avatar: string;
  date_joined: string;
  user_email: string;
  status: string;
}

interface Community {
  community_id: number,
  community_name: string,
}

interface AdminCommunity {
  community_id: number,
  community_name: string,
}

interface UserMemberships {
  user_id: number,
  username: string,
  userMemberships: {
    businesses: BusinessMembership[];
    schools: SchoolCard[];
    groups: GroupCard[];
    churches: ChurchCard[];
  }
}

interface UserAdmins {
  schools: SchoolCard[];
  churches: ChurchCard[];
  businesses: BusinessMembership[];
  groups: GroupCard[];
}

interface UserPostLikes {
  user_post_likes_id: number,
  user_id: number,
  post_id: number
}

interface AuthContextProps {
  token: string | null;
  user: User | null;
  selectedCommunity: Community | null;
  communities: Community[];
  adminCommunities: AdminCommunity[];
  userMemberships: UserMemberships | null;
  userAdmins: UserAdmins | null;
  userPostLikes: UserPostLikes[] | []
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setSelectedCommunity: (selectedCommunity: Community | null) => void;
  setCommunities: (communities: Community[] | []) => void;
  setAdminCommunities: (adminCommunities: AdminCommunity[] | []) => void;
  setUserMemberships: (userMemberships: UserMemberships | null) => void;
  setUserAdmins: (userAdmins: UserAdmins | null) => void;
  setUserPostLikes: (userPostLikes: UserPostLikes[] | []) => void; 
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null)
  const [communities, setCommunities] = useState<Community[] | [] >([]);
  const [adminCommunities, setAdminCommunities] = useState<AdminCommunity[] | []>([])
  const [userMemberships, setUserMemberships] = useState<UserMemberships | null>(null)
  const [userAdmins, setUserAdmins] = useState<UserAdmins | null>(null)
  const [userPostLikes, setUserPostLikes] = useState<UserPostLikes[] | []>([])

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedCommunity = localStorage.getItem('selectedCommunity')
    const savedCommunities = localStorage.getItem('communities')
    const savedAdminCommunities = localStorage.getItem('adminCommunities')
    const savedMemberships = localStorage.getItem('userMemberships')
    const savedAdmins = localStorage.getItem('userAdmins')
    const savedPostLikes = localStorage.getItem('userPostLikes')
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
    if (savedAdminCommunities) {
      setAdminCommunities(JSON.parse(savedAdminCommunities))
    }
    if (savedMemberships) {
      setUserMemberships(JSON.parse(savedMemberships))
    }
    if (savedAdmins) {
      setUserAdmins(JSON.parse(savedAdmins))
    }
    if (savedPostLikes) {
      setUserPostLikes(JSON.parse(savedPostLikes))
    }
    
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, selectedCommunity, communities, adminCommunities, userMemberships, userAdmins, userPostLikes, setToken, setUser, setSelectedCommunity, setCommunities, setAdminCommunities, setUserMemberships, setUserAdmins, setUserPostLikes }}>
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
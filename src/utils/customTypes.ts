export interface Community {
  community_id: number,
  created_date: string,
  community_name: string,
  community_description: string,
  community_img: string,
  member_count: string,
  group_count: string,
  school_count: string,
  church_count: string,
  business_count: string
}

export interface CommunityProfile {
  community_id: number,
  created_date: string,
  community_name: string,
  community_description: string,
  community_img: string,
  member_count: string,
  group_count: string,
  school_count: string,
  church_count: string,
  business_count: string,
  businesses: BusinessCard[]
  groups: GroupCard[],
  schools: SchoolCard[],
  churches: ChurchCard[]
}

export interface CardData {
  id: string;
  name: string;
  img: string;
  bio: string;
}

export interface SchoolCard {
  school_bio: string,
  school_id: number,
  school_img: string,
  school_name: string
}

export interface ChurchCard {
  church_bio: string,
  church_id: number,
  church_img: string,
  church_name: string
}

export interface GroupCard {
  group_bio: string,
  group_id: number,
  group_img: string,
  group_name: string
}

export interface BusinessCard {
  business_bio: string,
  business_id: number,
  business_img: string,
  business_name: string
}

export type LogInInputs = {
  username: string,
  password: string,
}

export type RegistrationInputs = {
  username: string,
  email: string,
  password: string,
}

export type JoinCommunityInputs = {
  user_id: string,
  community_id: string
}

export type JoinedCommunityResponse = {
  msg: string,
  community: {
    community_id: number,
    community_name: string
  }
}
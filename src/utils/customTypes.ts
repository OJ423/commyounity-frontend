// Inputs
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

export type LogInInputs = {
  username: string,
  password: string,
}

export type RegistrationInputs = {
  username: string,
  email: string,
  password: string,
  confirmPassword:string
}

export type UserJoinInputs = {
  user_id: string,
  id: string
}

// API Responses
export type JoinedCommunityResponse = {
  msg: string,
  community: {
    community_id: number,
    community_name: string
  }
}

export type GroupData = {
  group_id: number,
  created_at: string,
  group_name: string,
  group_bio: string,
  group_img: string,
  community_id: number
}

export type ChurchData = {
  church_id: number,
  joined_date: string,
  church_name: string,
  church_bio: string,
  church_email: string,
  church_website: string,
  church_img: string,
  community_id: number
}

export type BusinessData = {
  business_id: number,
  signup_date: string,
  business_name: string,
  business_bio: string,
  business_email: string,
  business_website: string,
  business_img: string,
  community_id: number
}

export type SchoolData = {
  school_id: number,
  create_date: string,
  school_name: string,
  school_bio: string,
  school_email: string,
  school_website: string,
  school_phone: string,
  school_img: string,
  community_id: number
}


export interface GroupJoinResponse  {
  group: GroupCard
}

export type BusinessMembership = {
  business_id: number,
  business_bio: string,
  business_img: string,
  business_name: string,
  business_email: string,
  business_website: string
}

export type PostData = {
  post_id: number,
  post_date: string,
  post_title: string,
  post_description: string,
  post_location: string,
  post_img: string,
  pdf_link: string,
  pdf_title: string,
  author: number,
  church_id: number | null,
  school_id: number | null,
  business_id: number | null,
  group_id: number,
  post_likes: number,
  comment_count: string
}

export interface Comment {
  comment_id: number,
  comment_title: string,
  comment_body: string,
  author: number,
  author_name: string,
  user_avatar:string,
  post_id: number,
  comment_ref: number | null
}


// Transformed Data
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

// Context & Local Storage

export interface CommunitiesLocalStorage {
  community_id: number,
  community_name: string,
}


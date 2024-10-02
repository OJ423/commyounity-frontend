// Inputs
export interface Community {
  community_id: number;
  created_date: string;
  community_name: string;
  community_description: string;
  community_img: string;
  member_count: string;
  group_count: string;
  school_count: string;
  church_count: string;
  business_count: string;
}
export interface CommunityProfile {
  community_id: number;
  created_date: string;
  community_name: string;
  community_description: string;
  community_img: string;
  member_count: string;
  group_count: string;
  school_count: string;
  church_count: string;
  business_count: string;
  businesses: BusinessCard[];
  groups: GroupCard[];
  schools: SchoolCard[];
  churches: ChurchCard[];
}

export type LogInInputs = {
  username: string;
  password: string;
};

export type RegistrationInputs = {
  username: string;
  user_email: string;
  password: string;
  confirmPassword: string;
};

export type UserJoinInputs = {
  user_id: string;
  id: string;
};

export type ParentAccessRequest = {
  school_id: string;
  msg: string;
};

export type ParentApproveReject = {
  parent_access_request_id: number;
  status: string;
};

export type ProfileEdit = {
  username: string;
  user_bio: string;
  user_email: string;
}

export type CommunityImg = {
  community_img: string;
}

// API Responses
export type JoinedCommunityResponse = {
  msg: string;
  community: {
    community_id: number;
    community_name: string;
  };
  token: string;
};

export type GroupData = {
  group_id: number;
  created_at: string;
  group_name: string;
  group_bio: string;
  group_img: string;
  community_id: number;
};

export type ChurchData = {
  church_id: number;
  joined_date: string;
  church_name: string;
  church_bio: string;
  church_email: string;
  church_website: string;
  church_img: string;
  community_id: number;
};

export type BusinessData = {
  business_id: number;
  signup_date: string;
  business_name: string;
  business_bio: string;
  business_email: string;
  business_website: string;
  business_img: string;
  community_id: number;
};

export type SchoolData = {
  school_id: number;
  create_date: string;
  school_name: string;
  school_bio: string;
  school_email: string;
  school_website: string;
  school_phone: string;
  school_img: string;
  community_id: number;
};

export interface GroupJoinResponse {
  group: GroupCard;
}

export interface ChurchJoinResponse {
  church: NewChurchData;
}

export type BusinessMembership = {
  business_id: number;
  business_bio: string;
  business_img: string;
  business_name: string;
  business_email: string;
  business_website: string;
};

export type PostData = {
  post_id: number;
  post_date: string;
  post_title: string;
  post_description: string;
  post_location: string;
  post_img: string;
  web_link: string;
  web_title: string;
  author: number;
  church_id: number | null;
  church_name: string | null;
  school_id: number | null;
  school_name: string | null;
  business_id: number | null;
  business_name: string | null;
  group_id: number | null;
  group_name: string | null;
  post_likes: number;
  comment_count: string;
  name: string;
};

export type TimelinePosts = {
  author: number;
  author_name: string;
  business_id: number | null;
  business_name: string | null;
  church_id: number | null;
  church_name: string | null;
  comment_count: string;
  group_id: number | null;
  group_name: string | null;
  post_date: string;
  post_description: string;
  post_id: number;
  post_img: string | null;
  post_likes: number;
  post_location: string | null;
  post_title: string;
  school_id: number | null;
  school_name: string | null;
  web_link: string | null;
  web_title: string | null;
  name: string | null;
};

export interface Comment {
  comment_id: number;
  comment_title: string;
  comment_body: string;
  author: number;
  author_name: string;
  user_avatar: string;
  post_id: number;
  comment_ref: number | null;
}

export interface Parent {
  school_parent_junction_id: number;
  school_id: number;
  user_id: number;
  username: string;
  user_email: string;
}

export interface ParentAccessData {
  parent_access_request_id: number;
  created_at: string;
  school_id: number;
  user_id: number;
  msg: string;
  status: string;
  username: string;
  user_email:string;
}

export interface UserAdminBase {
  user_id: number,
  username: string,
  user_email: string,
}

export interface BusinessAdmin extends UserAdminBase {
  business_junction_id: number;
}

export interface ChurchAdmin extends UserAdminBase {
  church_owner_junction_id: number;
}

export interface GroupAdmin extends UserAdminBase {
  group_admin_id: number;
}

export interface SchoolAdmin extends UserAdminBase {
  school_owner_junction_id: number;
}

export interface CommunityAdmin extends UserAdminBase {
  community_owner_junction_id: number;
}

export interface Members {
  username: string;
  user_bio: string;
  user_id: number;
}

// New Groups Etc Inputs

export type NewPostData = {
  post_title: string;
  post_description: string;
  post_location: string | null;
  post_img: File[] | null;
  web_link: string | null;
  web_title: string | null;
};

export type PostAPIData = {
  post_title: string;
  post_description: string;
  post_location: string;
  post_img: string | null;
  web_link: string | null;
  web_title: string | null;
  author: number;
  church_id: number | null;
  school_id: number | null;
  business_id: number | null;
  group_id: number | null;
};

export type NewGroupData = {
  group_name: string;
  group_bio: string;
  group_img: string;
  community_id: number;
};

export type NewChurchData = {
  church_name: string;
  church_bio: string;
  church_email: string | null;
  church_website: string | null;
  church_img: string | null;
  community_id: number;
};

export type NewBusinessData = {
  business_name: string;
  business_bio: string;
  business_email: string | null;
  business_website: string | null;
  business_img: string | null;
  community_id: number;
};

export type NewSchoolData = {
  school_name: string;
  school_bio: string;
  school_email: string | null;
  school_website: string | null;
  school_phone: string | null;
  school_img: string | null;
  community_id: number;
};

export type GenericFormData = {
  title: string;
  bio: string;
  img: File[] | null;
  email: string | null;
  website: string | null;
  phone: string | null;
};

export type CommentInputs = {
  comment_title:string;
  comment_body:string;
}

// Patch Entities

export type EditGroupData = {
  group_name: string;
  group_bio: string;
};

export type EditChurchData = {
  church_name: string;
  church_bio: string;
  church_email: string | null;
  church_website: string | null;
};

export type EditBusinessData = {
  business_name: string;
  business_bio: string;
  business_email: string | null;
  business_website: string | null;
};

export type EditSchoolData = {
  school_name: string;
  school_bio: string;
  school_email: string | null;
  school_website: string | null;
  school_phone: string | null;
};

// Transformed Data
export interface CardData {
  id: string;
  name: string;
  img: string;
  bio: string;
}

export interface SchoolCard {
  school_bio: string;
  school_id: number;
  school_img: string;
  school_name: string;
}

export interface ChurchCard {
  church_bio: string;
  church_id: number;
  church_img: string;
  church_name: string;
}

export interface GroupCard {
  group_bio: string;
  group_id: number;
  group_img: string;
  group_name: string;
}

export interface BusinessCard {
  business_bio: string;
  business_id: number;
  business_img: string;
  business_name: string;
}

// Context & Local Storage

export interface CommunitiesLocalStorage {
  community_id: number;
  community_name: string;
}

// Inputs
export interface Community {
  community_id: string;
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
  community_id: string;
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
  parent_access_request_id: string;
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

export interface BlockUser {
  username: string;
  reason: string;
}

export interface PostAdminById {
  community_id: string;
  user_id: string;
}

// API Responses
export type JoinedCommunityResponse = {
  msg: string;
  community: {
    community_id: string;
    community_name: string;
  };
  token: string;
};

export type GroupData = {
  group_id: string;
  created_at: string;
  group_name: string;
  group_bio: string;
  group_img: string;
  community_id: string;
};

export type ChurchData = {
  church_id: string;
  joined_date: string;
  church_name: string;
  church_bio: string;
  church_email: string;
  church_website: string;
  church_img: string;
  community_id: string;
};

export type BusinessData = {
  business_id: string;
  signup_date: string;
  business_name: string;
  business_bio: string;
  business_email: string;
  business_website: string;
  business_img: string;
  community_id: string;
};

export type SchoolData = {
  school_id: string;
  create_date: string;
  school_name: string;
  school_bio: string;
  school_email: string;
  school_website: string;
  school_phone: string;
  school_img: string;
  community_id: string;
};

export interface GroupJoinResponse {
  group: GroupCard;
}

export interface ChurchJoinResponse {
  church: NewChurchData;
}

export type BusinessMembership = {
  business_id: string;
  business_bio: string;
  business_img: string;
  business_name: string;
  business_email: string;
  business_website: string;
};

export type PostData = {
  post_id: string;
  post_date: string;
  post_title: string;
  post_description: string;
  post_location: string;
  post_img: string;
  post_video_url: string | null;
  web_link: string;
  web_title: string;
  author: string;
  church_id: string | null;
  church_name: string | null;
  school_id: string | null;
  school_name: string | null;
  business_id: string | null;
  business_name: string | null;
  group_id: string | null;
  group_name: string | null;
  post_likes: number;
  comment_count: string;
  name: string;
};

export type TimelinePosts = {
  author: string;
  author_name: string;
  business_id: string | null;
  business_name: string | null;
  church_id: string | null;
  church_name: string | null;
  comment_count: string;
  group_id: string | null;
  group_name: string | null;
  post_date: string;
  post_description: string;
  post_id: string;
  post_img: string | null;
  post_video_url: string | null;
  post_likes: number;
  post_location: string | null;
  post_title: string;
  school_id: string | null;
  school_name: string | null;
  web_link: string | null;
  web_title: string | null;
  name: string | null;
};

export interface Comment {
  comment_id: string;
  comment_title: string;
  comment_body: string;
  author: string;
  author_name: string;
  user_avatar: string;
  post_id: string;
  comment_ref: string | null;
}

export interface Parent {
  school_parent_junction_id: string;
  school_id: string;
  user_id: string;
  username: string;
  user_email: string;
}

export interface ParentAccessData {
  parent_access_request_id: string;
  created_at: string;
  school_id: string;
  user_id: string;
  msg: string;
  status: string;
  username: string;
  user_email:string;
}

export interface UserAdminBase {
  user_id: string,
  username: string,
  user_email: string,
}

export interface BusinessAdmin extends UserAdminBase {
  business_junction_id: string;
}

export interface ChurchAdmin extends UserAdminBase {
  church_owner_junction_id: string;
}

export interface GroupAdmin extends UserAdminBase {
  group_admin_id: string;
}

export interface SchoolAdmin extends UserAdminBase {
  school_owner_junction_id: string;
}

export interface CommunityAdmin extends UserAdminBase {
  community_owner_junction_id: string;
}

export interface Members {
  username: string;
  user_bio: string;
  user_avatar:string;
  user_id: string;
}

export interface AdminsLists {
  username: string;
  user_avatar:string;
  date_joined:string;
  community_owner_junction_id:string;
  community_id:string;
  user_id: string;
}

export interface BlockedUser {
  username: string;
  user_avatar: string;
  date_joined: string;
  blocked_user_id: string;
  user_id: string;
  community_id: string;
  reason: string;
  created_at: string;
}


 

// New Groups Etc Inputs

export type NewPostData = {
  post_title: string;
  post_description: string;
  post_location: string | null;
  post_img: File[] | null;
  post_video_url: string | null;
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
  author: string;
  church_id: string | null;
  school_id: string | null;
  business_id: string | null;
  group_id: string | null;
};

export type NewGroupData = {
  group_name: string;
  group_bio: string;
  group_img: string;
  community_id: string;
};

export type NewChurchData = {
  church_name: string;
  church_bio: string;
  church_email: string | null;
  church_website: string | null;
  church_img: string | null;
  community_id: string;
};

export type NewBusinessData = {
  business_name: string;
  business_bio: string;
  business_email: string | null;
  business_website: string | null;
  business_img: string | null;
  community_id: string;
};

export type NewSchoolData = {
  school_name: string;
  school_bio: string;
  school_email: string | null;
  school_website: string | null;
  school_phone: string | null;
  school_img: string | null;
  community_id: string;
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
  school_id: string;
  school_img: string;
  school_name: string;
}

export interface ChurchCard {
  church_bio: string;
  church_id: string;
  church_img: string;
  church_name: string;
}

export interface GroupCard {
  group_bio: string;
  group_id: string;
  group_img: string;
  group_name: string;
}

export interface BusinessCard {
  business_bio: string;
  business_id: string;
  business_img: string;
  business_name: string;
}

// Context & Local Storage

export interface CommunitiesLocalStorage {
  community_id: string;
  community_name: string;
}

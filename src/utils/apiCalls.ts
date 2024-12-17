import axios from "axios";
import {
  BlockUser,
  CommentInputs,
  Community,
  CommunityImg,
  EditBusinessData,
  EditChurchData,
  EditGroupData,
  EditSchoolData,
  LogInInputs,
  NewBusinessData,
  NewChurchData,
  NewCommunity,
  NewGroupData,
  NewPostData,
  NewSchoolData,
  ParentAccessRequest,
  ParentApproveReject,
  PostAdminById,
  PostData,
  RegistrationInputs,
} from "./customTypes";

import { headers } from "next/headers";

const instance = axios.create({
  baseURL: "http://localhost:9090/api/",
});

// COMMUNITY CALLS

export async function getCommunities(token: string | null, limit: number) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await instance.get(`communities?limit=${limit}`, {
      headers,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function getCommunityById(
  community_id: string | null,
  token: string | null
) {
  if (community_id) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await instance.get(`communities/${community_id}`, {
        headers,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export async function fetchUserCommunities(token:string | null) {
  try {
    const response = await instance.get("/users/communities", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
  catch(error:any) {
    console.log(error);
    throw error
  }
}

export async function postCommunity(body: NewCommunity, token: string | null) {
  try {
    const response = await instance.post("/communities/", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function patchCommunity(
  community_id: string,
  user_id: string | undefined,
  token: string | null,
  body: Community | CommunityImg
) {
  try {
    const response = await instance.patch(
      `communities/edit/${community_id}/${user_id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error patching community:", error);
    throw error;
  }
}

export async function getCommunityMembers(
  token: string | null,
  community_id: string
) {
  try {
    const response = await instance.get(`communities/members/${community_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting community members", error);
    throw error;
  }
}

export async function blockUser(
  community_id: string,
  token: string | null,
  body: BlockUser
) {
  try {
    const response = await instance.post(
      `communities/members/block/${community_id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error blocking user", error);
    throw error;
  }
}

export async function unblockUser(
  community_id: string,
  blockedUserId: string,
  token: string | null
) {
  try {
    const response = await instance.delete(
      `communities/members/unblock/${community_id}/${blockedUserId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error blocking user", error);
    throw error;
  }
}

export async function getBlockedUsers(
  community_id: string,
  token: string | null
) {
  try {
    const response = await instance.get(
      `communities/members/blocked/${community_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching blocked users:", error);
    throw error;
  }
}

export async function getCommunityAdmins(
  community_id: string,
  token: string | null
) {
  try {
    const response = await instance.get(`communities/owners/${community_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting community admins:", error);
    throw error;
  }
}

export async function postCommunityAdmin(
  community_id: string,
  token: string | null,
  body: any
) {
  try {
    const response = await instance.post(
      `communities/owners/new/${community_id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding administrator", error);
    throw error;
  }
}

export async function postCommunityAdminById(
  token: string | null,
  body: PostAdminById
) {
  try {
    const response = await instance.post(
      `communities/owners/new/byuserid`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error adding administrator", error);
    throw error;
  }
}

export async function removeCommunityAdmin(
  token: string | null,
  community_id: string,
  user_id: string
) {
  try {
    const response = await instance.delete(
      `communities/owners/remove/${community_id}/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error removing admin:", error);
    throw error;
  }
}

// USER LOGIN, REGISTRATION AND PATCH

export async function logUserIn(body: LogInInputs) {
  const updatedBody = {
    user_email: body.email,
  };
  try {
    const response = await instance.post("users/login", updatedBody);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function confirmLogin(token: string) {
  try {
    const response = await instance.get(`users/login/confirm?token=${token}`);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function registerUser(body: RegistrationInputs) {
  try {
    const registerBody = {
      username: body.username,
      email: body.user_email,
    };
    const response = await instance.post("users/register", registerBody);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function verifyNewUserAccount(token: string) {
  try {
    const response = await instance.get(`/users/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    console.error("Error logged as", error);
    throw error;
  }
}

export async function patchUser(
  body: any,
  user_id: string | undefined,
  token: string | null
) {
  try {
    const response = await instance.patch(`users/edit/${user_id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("An error has occurred: ", error);
    throw error;
  }
}

export async function deleteUser(
  user_id: string | undefined,
  token: string | null
) {
  try {
    const response = await instance.delete(`users/delete/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("An error has occurred: ", error);
    throw error;
  }
}

// Admin Users for Entities

export async function getEntityAdmins(
  type: string,
  entityId: string | undefined,
  token: string | null
) {
  try {
    const response = await instance.get(`users/admin/${type}/${entityId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching Admin Users:", error);
    throw error;
  }
}

export async function addNewAdmin(
  token: string | null,
  id: string | undefined,
  type: string,
  user_email: string
) {
  try {
    const routeUrl =
      type === "group"
        ? `groups/owners/new/${id}`
        : type === "school"
        ? `schools/owners/new/${id}`
        : type === "church"
        ? `churches/owners/new/${id}`
        : type === "business"
        ? `businesses/owners/new/${id}`
        : type === "community"
        ? `communities/owners/new/${id}`
        : null;

    const body = { user_email };

    const response = await instance.post(`${routeUrl}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding new admin", error);
    throw error;
  }
}

export async function removeAdmin(
  token: string | null,
  id: string,
  type: string,
  removedUserId: string
) {
  try {
    const routeUrl =
      type === "group"
        ? `groups/owners/remove/${id}/${removedUserId}`
        : type === "school"
        ? `schools/owners/remove/${id}/${removedUserId}`
        : type === "church"
        ? `churches/owners/remove/${id}/${removedUserId}`
        : type === "business"
        ? `businesses/owners/remove/${id}/${removedUserId}`
        : type === "community"
        ? `communities/owners/remove/${id}/${removedUserId}`
        : null;

    const response = await instance.delete(`${routeUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error adding new admin", error);
    throw error;
  }
}

// GET USER MEMBERSHIPS, ADMIN PROFILES AND POSTS

export async function getUserMemberships(
  community_id: string | undefined,
  token: string | null
) {
  try {
    const response = await instance.get(`users/memberships/${community_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function getUserAdmins(
  community_id: string,
  token: string | null
) {
  try {
    const response = await instance.get(`users/manage/${community_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function getUserPostLikes(token: string) {
  try {
    const response = await instance.get("posts/user/likes/posts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error getting user post likes", error);
    throw error;
  }
}

// HANDLE JOIN AND LEAVE COMMUNITIES

export async function joinUser(
  user_id: string,
  id: string,
  type: string,
  token: string | null
) {
  try {
    let body: any = {};
    if (type === "group") {
      body = { user_id, group_id: id };
    }
    if (type === "community") {
      body = { user_id, community_id: id };
    }
    if (type === "church") {
      body = { user_id, church_id: id };
    }
    const response = await instance.post(`users/${type}/join`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error logging in:", error);
    throw error;
  }
}

export async function leaveUser(
  user_id: string | null,
  id: string | null,
  type: string,
  token: string | null
) {
  try {
    const response = await instance.delete(
      `users/${type}/leave/${id}/${user_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error logging in:", error);
    throw error;
  }
}

// GET COMMUNITY GROUPS ETC

export async function getCommunityGroups(
  community_id: string | null,
  token: string | null
) {
  if (community_id) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await instance.get(
        `communities/${community_id}/groups`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export async function getCommunityChurches(
  community_id: string | null,
  token: string | null
) {
  if (community_id) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await instance.get(
        `communities/${community_id}/churches`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export async function getCommunityBusinesses(
  community_id: string | null,
  token: string | null
) {
  if (community_id) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await instance.get(
        `communities/${community_id}/businesses`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export async function getCommunitySchools(
  community_id: string | undefined,
  token: string | null
) {
  if (community_id) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const response = await instance.get(
        `communities/${community_id}/schools`,
        {
          headers,
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

// GET GROUP ETC PROFILES

export async function getGroupById(
  group_id: string | null,
  token: string | null
) {
  if (group_id) {
    try {
      const response = await instance.get(`groups/${group_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error loggin in:", error);
      throw error;
    }
  }
}

export async function getChurchById(
  church_id: string | null,
  token: string | null
) {
  if (church_id) {
    try {
      const response = await instance.get(`churches/${church_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error loggin in:", error);
      throw error;
    }
  }
}

export async function getBusinessById(
  business_id: string | null,
  token: string | null
) {
  if (business_id) {
    try {
      const response = await instance.get(`businesses/${business_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error loggin in:", error);
      throw error;
    }
  }
}

export async function getSchoolById(
  school_id: string | null,
  token: string | null
) {
  if (school_id) {
    try {
      const response = await instance.get(`schools/${school_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Error loggin in:", error);
      throw error;
    }
  }
}

// POST, PATCH, DELETE GROUPS SCHOOLS ETC

export async function addNewEntity(
  body: NewGroupData | NewChurchData | NewSchoolData | NewBusinessData | null,
  token: string | null,
  type: string,
  user_id: string | null
) {
  let urlParam: string = "void";
  if (type === "group") urlParam = `groups/${body?.community_id}/${user_id}`;
  if (type === "church") urlParam = `churches/${body?.community_id}`;
  if (type === "business") urlParam = `businesses/new/${body?.community_id}`;
  if (type === "school") urlParam = `schools/new/${body?.community_id}`;

  if (body) {
    try {
      const response = await instance.post(`${urlParam}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error adding ${type}`, error);
      throw error;
    }
  }
}

export async function patchEntity(
  body:
    | EditGroupData
    | EditChurchData
    | EditSchoolData
    | EditBusinessData
    | null,
  token: string | null,
  type: string,
  entity_id: string | undefined,
  user_id: string | null
) {
  let urlParam: string = "void";
  if (type === "group") urlParam = `groups/edit/${entity_id}/${user_id}`;
  if (type === "church") urlParam = `churches/edit/${entity_id}`;
  if (type === "business") urlParam = `businesses/edit/${entity_id}`;
  if (type === "school") urlParam = `schoolsedit/${entity_id}`;

  if (body) {
    try {
      const response = await instance.patch(`${urlParam}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error adding ${type}`, error);
      throw error;
    }
  }
}

export async function patchEntityImg(
  imgUrl: string,
  token: string | null,
  type: string,
  entity_id: string | undefined,
  user_id: string | null
) {
  let urlParam: string = "void";
  let body;
  if (type === "group") {
    urlParam = `groups/edit/${entity_id}/${user_id}`;
    body = { group_img: imgUrl };
  }
  if (type === "church") {
    urlParam = `churches/edit/${entity_id}`;
    body = { church_img: imgUrl };
  }
  if (type === "business") {
    urlParam = `businesses/edit/${entity_id}`;
    body = { business_img: imgUrl };
  }
  if (type === "school") {
    urlParam = `schools/edit/${entity_id}`;
    body = { school_img: imgUrl };
  }

  if (body) {
    try {
      const response = await instance.patch(`${urlParam}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error(`Error adding ${type}`, error);
      throw error;
    }
  }
}

export async function deleteEntity(
  type: string,
  id: string | undefined,
  user_id: string | undefined,
  token: string | null
) {
  let urlParam: string = "void";
  if (type === "group") urlParam = `groups/delete/${id}/${user_id}`;
  if (type === "church") urlParam = `churches/delete/${id}`;
  if (type === "business") urlParam = `businesses/delete/${id}`;
  if (type === "school") urlParam = `schools/delete/${id}`;

  try {
    const response = await instance.delete(`${urlParam}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(`Error adding ${type}`, error);
    throw error;
  }
}

// POST AND COMMENT CALLS

export async function addPost(
  type: string,
  id: string | undefined,
  data: NewPostData | undefined,
  webLink: string | null,
  author: string | undefined,
  imageUrl: string,
  token: string | null
) {
  let body: any = {
    post_title: data?.post_title,
    post_description: data?.post_description,
    post_location: data?.post_location,
    post_img: imageUrl,
    post_video_url: data?.post_video_url,
    web_link: webLink,
    web_title: data?.web_title,
    author: author,
  };
  if (type === "group") body.group_id = id;
  if (type === "church") body.church_id = id;
  if (type === "school") body.school_id = id;
  if (type === "business") body.business_id = id;

  try {
    const response = await instance.post("posts/", body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
}

export async function editPost(
  token: string | null,
  post_id: string,
  body: NewPostData
) {
  try {
    const response = await instance.patch(`posts/edit/${post_id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error editing post", error);
    throw error;
  }
}

export async function deletePost(token: string | null, post_id: string) {
  try {
    const response = await instance.delete(`posts/delete/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("Error deleting post:", error);
    throw error;
  }
}

export async function likePost(
  user_id: string | undefined,
  post_id: string | null,
  token: string | null
) {
  if (user_id) {
    const body = { post_id, user_id };
    try {
      const response = await instance.patch(`posts/post/like`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.postLikes;
    } catch (error: any) {
      console.error("Error log in:", error);
      throw error;
    }
  }
}

export async function dislikePost(
  user_id: string | undefined,
  post_id: string | null,
  token: string | null
) {
  if (user_id) {
    const body = { post_id, user_id };
    try {
      const response = await instance.patch(`posts/post/dislike`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.postLikes;
    } catch (error: any) {
      console.error("Error log in:", error);
      throw error;
    }
  }
}

export async function getPostComments(token: string | null, post_id: string) {
  try {
    const response = await instance.get(`posts/${post_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error log in:", error);
    throw error;
  }
}

export async function postNewComment(
  token: string | null,
  post_id: string,
  body: CommentInputs
) {
  try {
    const response = await instance.post(`posts/${post_id}/comment/new`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error posting comment", error);
    throw error;
  }
}

export async function editComment(
  token: string | null,
  comment_id: string,
  body: CommentInputs
) {
  try {
    const response = await instance.patch(`posts/comment/${comment_id}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error posting comment", error);
    throw error;
  }
}

export async function deleteComment(
  token: string | null,
  comment_id: string,
  post_id: string
) {
  try {
    const response = await instance.delete(
      `posts/comment/delete/${comment_id}/${post_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error deleting comment", error);
    throw error;
  }
}

export async function getUsersCommunityPosts(
  token: string | null,
  community_id: string,
  limit: number,
  filter: string | null
) {
  try {
    const response = await instance.get(
      `posts/user/${community_id}?limit=${limit}`,
      {
        params: {
          filter: filter,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error log in:", error);
    throw error;
  }
}

// BLOB STORAGE

export async function uploadFile(formData: any, token: string | null) {
  try {
    const response = await instance.post(`files/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error uploading the file:", error);
    throw error;
  }
}

// School Parent Management

export async function getSchoolParents(token: string | null, schoolId: string) {
  try {
    const response = await instance.get(`schools/parents/${schoolId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching school parents:", error);
    throw error;
  }
}

interface AddParentBody {
  user_email: string;
}

export async function addNewParent(
  token: string | null,
  schoolId: string,
  body: AddParentBody
) {
  try {
    const response = await instance.post(
      `schools/${schoolId}/parent/add`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching school parents:", error);
    throw error;
  }
}

export async function removeParent(
  token: string | null,
  schoolId: string,
  parentId: string
) {
  try {
    const response = await instance.delete(
      `schools/${schoolId}/parent/remove/${parentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching school parents:", error);
    throw error;
  }
}

// Parent Access Requests

export async function getParentAccessRequests(
  token: string | null,
  school_id: string,
  requestStatus: string
) {
  try {
    const response = await instance.get(`schools/requests/${school_id}`, {
      params: {
        status: requestStatus,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching school parents:", error);
    throw error;
  }
}

export async function postParentAccessRequest(
  token: string | null,
  body: ParentAccessRequest
) {
  try {
    const response = await instance.post(`schools/access`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching school parents:", error);
    throw error;
  }
}

export async function patchParentAccessRequest(
  token: string | null,
  school_id: string,
  body: ParentApproveReject
) {
  try {
    const response = await instance.patch(
      `schools/requests/status/${school_id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching school parents:", error);
    throw error;
  }
}

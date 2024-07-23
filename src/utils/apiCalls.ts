import axios from "axios";
import {
  EditBusinessData,
  EditChurchData,
  EditGroupData,
  EditSchoolData,
  GroupData,
  LogInInputs,
  NewBusinessData,
  NewChurchData,
  NewGroupData,
  NewPostData,
  NewSchoolData,
  PostAPIData,
  RegistrationInputs,
  UserJoinInputs,
} from "./customTypes";
import { headers } from "next/headers";

const instance = axios.create({
  baseURL: "http://localhost:9090/api/",
});

// COMMUNITY CALLS

export async function getCommunities() {
  try {
    const response = await instance.get("communities");
    return response.data;
  } catch (error: any) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function getCommunityById(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

// USER LOGIN, REGISTRATION AND PATCH

export async function logUserIn(body: LogInInputs) {
  try {
    const response = await instance.post("users/login", body);
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
      email: body.email,
      password: body.password,
    };
    const response = await instance.post("users/register", registerBody);
    console.log(response);
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

// GET USER MEMBERSHIPS, ADMIN PROFILES AND POSTS

export async function getUserMemberships(
  user_id: number | undefined,
  community_id: number | undefined,
  token: string | null
) {
  try {
    const response = await instance.get(`users/${user_id}/${community_id}`, {
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
  user_id: number | null,
  community_id: number | undefined,
  token: string | null
) {
  try {
    const response = await instance.get(
      `users/manage/${user_id}/${community_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
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

export async function getCommunityGroups(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}/groups`);
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export async function getCommunityChurches(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(
        `communities/${community_id}/churches`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export async function getCommunityBusinesses(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(
        `communities/${community_id}/businesses`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

export async function getCommunitySchools(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(
        `communities/${community_id}/schools`
      );
      return response.data;
    } catch (error: any) {
      console.error("Error logging in:", error);
      throw error;
    }
  }
}

// GET GROUP ETC PROFILES

export async function getGroupById(group_id: string | null) {
  if (group_id) {
    try {
      const response = await instance.get(`groups/${group_id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error loggin in:", error);
      throw error;
    }
  }
}

export async function getChurchById(church_id: string | null) {
  if (church_id) {
    try {
      const response = await instance.get(`churches/${church_id}`);
      return response.data;
    } catch (error: any) {
      console.error("Error loggin in:", error);
      throw error;
    }
  }
}

export async function getBusinessById(business_id: string | null) {
  if (business_id) {
    try {
      const response = await instance.get(`businesses/${business_id}`);
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
  user_id: number | null,
) {

  let urlParam:string = "void";
  if (type === "group") urlParam = "groups"
  if (type === "church") urlParam = "churches"
  if (type === "business") urlParam = "businesses"
  if (type === "school") urlParam = "schools"

  if (body) {
    try {
      const response = await instance.post(`${urlParam}/${body.community_id}/${user_id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        }});
      
        return response.data

    } catch (error: any) {
      
      console.error(`Error adding ${type}`, error);
      throw error;
    }
  }
}

export async function patchEntity(
  body: EditGroupData | EditChurchData | EditSchoolData | EditBusinessData | null,
  token: string | null,
  type: string,
  entity_id: number | undefined,
  user_id: number | null,
) {

  let urlParam:string = "void";
  if (type === "group") urlParam = "groups"
  if (type === "church") urlParam = "churches"
  if (type === "business") urlParam = "businesses"
  if (type === "school") urlParam = "schools"

  if (body) {
    try {
      const response = await instance.patch(`${urlParam}/edit/${entity_id}/${user_id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        }});
      
        return response.data

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
  entity_id: number | undefined,
  user_id: number | null,
) {

  let urlParam:string = "void";
  let body;
  if (type === "group") {
    urlParam = "groups"
    body = {group_img: imgUrl}
  }
  if (type === "church") {
    urlParam = "churches"
    body = {church_img: imgUrl}
  }
  if (type === "business") {
    urlParam = "businesses"
    body = {business_img: imgUrl}
  }
  if (type === "school") {
    urlParam = "schools"
    body = {school_img: imgUrl}
  }

  if (body) {
    try {
      const response = await instance.patch(`${urlParam}/edit/${entity_id}/${user_id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        }});
      
        return response.data

    } catch (error: any) {
      
      console.error(`Error adding ${type}`, error);
      throw error;
    }
  }
}


export async function deleteEntity(type: string, id:number | undefined, user_id:string | undefined, token:string | null) {
  let urlParam:string = "void";
  if (type === "group") urlParam = "groups"
  if (type === "church") urlParam = "churches"
  if (type === "business") urlParam = "businesses"
  if (type === "school") urlParam = "schools"

  try {
    const response = await instance.delete(`${urlParam}/delete/${id}/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }});
      return response.data

  } catch (error: any) {
    
    console.error(`Error adding ${type}`, error);
    throw error;
  }

}


// POST AND COMMENT CALLS

export async function addPost(type:string, id: number | undefined, data: NewPostData | undefined, author: string | undefined, imageUrl:string, token: string | null) {
  let body:any = {
    post_title: data?.post_title,
    post_description: data?.post_description,
    post_location: data?.post_location,
    post_img: imageUrl,
    web_link: data?.web_link,
    web_title: data?.web_title,
    author: author
  }
  if (type === "group") body.group_id = id
  if (type === "church") body.church_id = id
  if (type === "school") body.school_id = id
  if (type === "business") body.business_id = id

  try {
    const response = await instance.post('posts/', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
    
  } catch(error:any) {
    console.log(error)
    throw error
  }

}

export async function likePost(
  user_id: number | undefined,
  post_id: number | null,
  token: string | null
) {
  if (user_id) {
    const body = { post_id, user_id };
    try {
      const response = await instance.patch(`posts/post/like`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
      return response.data.postLikes;
    } catch (error: any) {
      console.error("Error log in:", error);
      throw error;
    }
  }
}

export async function dislikePost(
  user_id: number | undefined,
  post_id: number | null,
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

export async function getPostComments(post_id: number) {
  try {
    const response = await instance.get(`posts/${post_id}`);
    return response.data;
  } catch (error: any) {
    console.error("Error log in:", error);
    throw error;
  }
}

export async function getUsersCommunityPosts(
  user_id: number,
  community_id: number,
  filter: string | null
) {
  try {
    const response = await instance.get(
      `posts/user/${user_id}/${community_id}`,
      {
        params: {
          filter: filter,
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

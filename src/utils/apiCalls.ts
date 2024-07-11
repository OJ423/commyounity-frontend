import axios from 'axios'
import { LogInInputs, RegistrationInputs, UserJoinInputs } from './customTypes';

const instance = axios.create({
  baseURL: 'http://localhost:9090/api/',
});

// COMMUNITY CALLS

export async function getCommunities() {
  try {
    const response = await instance.get('communities');
    return response.data
  }
  catch(error:any) {
    console.error('Error logging in:', error);
    throw error;
  }
}


export async function getCommunityById(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}`)
      return response.data
    } catch(error:any) {
      console.error('Error logging in:', error)
      throw error
    }
  }
}

// LOGIN AND REGISTRATION

export async function logUserIn(body: LogInInputs) {
  try {
    const response = await instance.post('users/login', body);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function registerUser(body: RegistrationInputs) {
  try {
    const response = await instance.post('users/register', body)
    return response.data
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// GET USER MEMBERSHIPS, ADMIN PROFILES AND POSTS

export async function getUserMemberships(user_id:number | undefined, community_id:number | undefined, token: string | null) {
  try {
    const response = await instance.get(`users/${user_id}/${community_id}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }}
    );
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function getUserAdmins(user_id:number | undefined, community_id:number | undefined, token: string | null) {
  try {
    const response = await instance.get(`users/manage/${user_id}/${community_id}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }}
    );
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

// HANDLE JOIN AND LEAVE COMMUNITIES

export async function joinUser(user_id: string, id: string, type:string, token: string | null ) {
  try {
    let body:any = {}
    if(type === 'group') {
      body = {user_id, group_id: id}
    }
    if (type === 'community') {
      body = {user_id, community_id: id}
    }
    if (type === 'church') {
      body = {user_id, church_id: id}
    }
    const response = await instance.post(`users/${type}/join`, body, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }}
    );
    return response.data;
  } catch (error) {
    console.log('Error logging in:', error);
    throw error;
  }
}

export async function leaveUser(user_id: string | null, id: string | null,type: string, token: string | null ) {
  try {
    const response = await instance.delete(`users/${type}/leave/${id}/${user_id}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }}
    );
    return response.data;
  } catch (error) {
    console.log('Error logging in:', error);
    throw error;
  }
}

// GET COMMUNITY GROUPS ETC

export async function getCommunityGroups(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}/groups`)
      return response.data
    } catch(error:any) {
      console.error('Error logging in:', error)
      throw error;
    }
  }
}

export async function getCommunityChurches(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}/churches`)
      return response.data
    } catch(error:any) {
      console.error('Error logging in:', error)
      throw error;
    }
  }
}

export async function getCommunityBusinesses(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}/businesses`)
      return response.data
    } catch(error:any) {
      console.error('Error logging in:', error)
      throw error;
    }
  }
}

export async function getCommunitySchools(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}/schools`)
      return response.data
    } catch(error:any) {
      console.error('Error logging in:', error)
      throw error;
    }
  }
}

// GET GROUP ETC PROFILES

export async function getGroupById(group_id:string | null) {
  if (group_id) {
    try {
      const response = await instance.get(`groups/${group_id}`)
      return response.data
    } catch(error:any) {
      console.error('Error loggin in:', error)
      throw error;
    }
  }
}

export async function getChurchById(church_id:string | null) {
  if (church_id) {
    try {
      const response = await instance.get(`churches/${church_id}`)
      return response.data
    } catch(error:any) {
      console.error('Error loggin in:', error)
      throw error;
    }
  }
}

export async function getBusinessById(business_id:string | null) {
  if (business_id) {
    try {
      const response = await instance.get(`businesses/${business_id}`)
      return response.data
    } catch(error:any) {
      console.error('Error loggin in:', error)
      throw error;
    }
  }
}

export async function getSchoolById(school_id:string | null, token: string | null) {
  if (school_id) {
    try {
      const response = await instance.get(`schools/${school_id}`, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }}
      );
      console.log(response.data)
      return response.data
    } catch(error:any) {
      console.error('Error loggin in:', error)
      throw error;
    }
  }
}

// POST AND COMMENT CALLS

export async function likePost(user_id:number | undefined, post_id:number | null, token: string | null) {
  if (user_id) {
    const body = {post_id, user_id}
    try {
      const response = await instance.patch(`posts/post/like`, body, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }})
      return response.data.postLikes
    } catch(error:any) {
      console.error('Error log in:', error)
      throw error
    }
  }
}

export async function dislikePost(user_id:number | undefined, post_id:number | null, token: string | null) {
  if (user_id) {
    const body = {post_id, user_id}
    try {
      const response = await instance.patch(`posts/post/dislike`, body, {
        headers: {
          'Authorization': `Bearer ${token}` 
        }})
      return response.data.postLikes
    } catch(error:any) {
      console.error('Error log in:', error)
      throw error
    }
  }
}

export async function getPostComments(post_id:number) {
  try {
    const response = await instance.get(`posts/${post_id}`)
    return response.data
  } catch(error:any) {
    console.error('Error log in:', error)
    throw error
  }
}

export async function getUsersCommunityPosts(user_id:number, community_id:number, filter:string | null) {
  try {
    const response = await instance.get(`posts/user/${user_id}/${community_id}`, {
      params: {
        "filter": filter
      }
    })
    return response.data
  } catch(error:any) {
    console.error('Error log in:', error)
    throw error
  }
}






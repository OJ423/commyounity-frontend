import axios from 'axios'
import { LogInInputs, RegistrationInputs, UserJoinInputs } from './customTypes';

const instance = axios.create({
  baseURL: 'http://localhost:9090/api/',
});

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

export async function logUserIn(body: LogInInputs) {
  try {
    const response = await instance.post('users/login', body);
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}

export async function getUserMemberships(user_id:number | undefined, community_id:number | undefined, token: string | null) {
  try {
    const response = await instance.get(`users/${user_id}/${community_id}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }}
    );
    console.log(response.data)
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

export async function joinUser(user_id: string, id: string, type:string, token: string | null ) {
  try {
    let body:any = {}
    if(type === 'group') {
      body = {user_id, group_id: id}
    }
    if (type === 'community') {
      body = {user_id, community_id: id}
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

export async function getCommunityGroups(community_id: string | null) {
  if (community_id) {
    try {
      const response = await instance.get(`communities/${community_id}/groups`)
      return response.data
    } catch(error:any) {
      console.error('Error logging in:', error)
    }
  }
}

export async function getGroupById(group_id:string | null) {
  if (group_id) {
    try {
      const response = await instance.get(`groups/${group_id}`)
      return response.data
    } catch(error:any) {
      console.error('Error loggin in:', error)
    }
  }
}


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






import axios from 'axios'
import { JoinCommunityInputs, LogInInputs, RegistrationInputs } from './customTypes';

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

export async function joinCommunity(body: JoinCommunityInputs, token: string | null ) {
  try {
    const response = await instance.post('users/community/join', body, {
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

export async function leaveCommunity(user_id: string | null, community_id: string | null, token: string | null ) {
  try {
    const response = await instance.delete(`users/community/leave/${community_id}/${user_id}`, {
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
      throw error
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



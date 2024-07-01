import axios from 'axios'
import { LogInInputs, RegistrationInputs } from './customTypes';

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

export async function registerUser(body: RegistrationInputs) {
  try {
    const response = await instance.post('users/register', body)
    return response.data
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
}
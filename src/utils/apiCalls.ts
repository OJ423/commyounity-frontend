import axios from 'axios'

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
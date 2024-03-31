import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1', 
  timeout: 10000, 
});

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/users/create', {
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      NIC: userData.NIC,
      contact_number: userData.contactNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export default api;

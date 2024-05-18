import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
});

const refreshToken = async () => {
  try {
    const response = await api.post('/auth/refresh');
    console.log("Token refreshed successfully"); 
    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error); 
    throw error; 
  }
};

// Axios interceptor to handle token refresh
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     if (error.response && error.response.status === 401) {
//       try {
//         const newToken = await refreshToken();
//         error.config.headers.Authorization = `Bearer ${newToken}`;
//         return api.request(error.config);
//       } catch (refreshError) {
//         console.error('Error handling token refresh:', refreshError); 
//         throw refreshError;
//       }
//     }
//     return Promise.reject(error);
//   }
// );

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

export const getUserInfo = async (token) => {
  try {
    const response = await api.post('/auth/me', null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStationData = async () => {
  try {
    const response = await api.get('/users/stationdetails');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchTrains = async (data) => {
  try {
    const response = await api.post('/users/searchtrains', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchTicketCost = async (data) => {
  const response = await api.post('/users/calculate-ticket-cost', data);
  return response.data;
};

export const bookTicket = async (data) => {
  const response = await api.post('/users/bookTicket', data);
  return response.data;
};

export const getUpcomingTrips = async (data) => {
  const response = await api.post('/users/upcomingTrips', data);
  return response.data;
};

export const deleteBooking = async (bookingId) => {
  const response = await api.delete(`/users/deleteBooking/${bookingId}`);
  return response.data;
};

export const submitForumQuestion = async(data) => {
  const response = await api.post('/users/createForum', data);
  return response.data;
}
export const getForumPost = async() => {
  const response = await api.get('/users/getForum');
  return response.data;
}
// Get all forum posts
export const getForumQuestions = async () => {
  const response = await api.get('/users/getForum');
  return response.data;
};
export const updateForumPost = async (postId, data) => {
  try {
    const response = await api.put(`/users/updateForum/${postId}`, data);
    console.log(data);
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

export const deleteForumPost = async (postId, token) => {
  try {
    const response = await api.delete(`/users/deleteForum/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export default api;

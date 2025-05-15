import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
  timeout: 10000,
});

// const refreshToken = async () => {
//   try {
//     const response = await api.post('/auth/refresh');
//     console.log("Token refreshed successfully"); 
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error refreshing token:', error); 
//     throw error; 
//   }
// };



export const loginUser = async (NIC, password) => {
  try {
    const response = await api.post('/auth/login', { NIC, password });
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
    if (error.response) {
      const { data, status } = error.response;
      throw { message: data.message, status };
    } else {
      throw error; 
    }
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

export const updateUser = async (userID,data) => {
  try {
    const response = await api.put(`/users/update/${userID}`,data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
      throw { message: data.message, status };
    } else {
      throw error; 
    }
  }
}

export const updateUserPassword = async (userID, data) => {
  try {
    const response = await api.put(`/users/updatePassword/${userID}`, data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
      throw { message: data.message, status };
    } else {
      throw error; 
    }
  }
};

export const changeUserPicture = async (userId, formData) => {
  try {
      const response = await api.post(`/users/uploadProfileImage/${userId}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
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

export const requestRefund = async (bookingId) => {
  const response = await api.put(`/users/requestRefund/${bookingId}`);
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

export const searchScheduale = async (data) => {
  try {
    const response = await api.post('/users/searchscheduale', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRecentTrips = async (data) => {
  const response = await api.post('/users/getRecentTrips', data);
  return response.data;
};

export const createPaymentIntent = async (amount) => {
  try {
    const response = await api.post('/users/createPaymentIntent', { amount }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data.clientSecret;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const paymentSuccess = async (data) => {
  const response = await api.post('/users/paymentSuccess', data);
  return response.data;
};

export const getTransactionData = async (data) => {
  const response = await api.post('/users/getTransactionData', data);
  return response.data;
};

export const getNotifications = async() => {
  const response = await api.get('/users/sendNotification');
  return response.data;
}

export default api;

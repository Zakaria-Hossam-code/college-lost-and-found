import axiosClient from './axiosClient';

export const authApi = {
  login: async (credentials) => {
    const res = await axiosClient.post('/auth/login', credentials);
    return res.data;
  },

  register: async (userData) => {
    const res = await axiosClient.post('/auth/register', userData);
    return res.data;
  },

  getProfile: async () => {
    const res = await axiosClient.get('/auth/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await axiosClient.put('/auth/profile', data);
    return res.data;
  },
};

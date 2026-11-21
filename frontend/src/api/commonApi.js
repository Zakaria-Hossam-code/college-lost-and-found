import axiosClient from './axiosClient';

export const categoriesApi = {
  getAll: async () => {
    const res = await axiosClient.get('/categories');
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post('/categories', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/categories/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosClient.delete(`/categories/${id}`);
    return res.data;
  },
};

export const locationsApi = {
  getAll: async () => {
    const res = await axiosClient.get('/locations');
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post('/locations', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/locations/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosClient.delete(`/locations/${id}`);
    return res.data;
  },
};

export const notificationsApi = {
  getAll: async (limit = 30) => {
    const res = await axiosClient.get('/notifications', { params: { limit } });
    return res.data;
  },

  getUnreadCount: async () => {
    const res = await axiosClient.get('/notifications/unread-count');
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await axiosClient.put(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await axiosClient.put('/notifications/read-all');
    return res.data;
  },
};

export const dashboardApi = {
  getAdminStats: async () => {
    const res = await axiosClient.get('/dashboard/admin');
    return res.data;
  },

  getUserStats: async () => {
    const res = await axiosClient.get('/dashboard/user');
    return res.data;
  },
};

import axiosClient from './axiosClient';

export const reportsApi = {
  getAll: async (params = {}) => {
    const res = await axiosClient.get('/reports', { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/reports/${id}`);
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post('/reports', data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axiosClient.put(`/reports/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await axiosClient.delete(`/reports/${id}`);
    return res.data;
  },

  getMatches: async (id) => {
    const res = await axiosClient.get(`/reports/${id}/matches`);
    return res.data;
  },

  getMyReports: async () => {
    const res = await axiosClient.get('/reports/user/my-reports');
    return res.data;
  },

  getUnclaimed: async (daysOld = 14) => {
    const res = await axiosClient.get('/reports/admin/unclaimed', { params: { daysOld } });
    return res.data;
  },

  uploadPhoto: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosClient.post('/reports/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data; // { url: "/uploads/..." }
  },
};

import axiosClient from './axiosClient';

export const claimsApi = {
  getAll: async (status = '') => {
    const res = await axiosClient.get('/claims', { params: { status } });
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/claims/${id}`);
    return res.data;
  },

  getMyClaims: async () => {
    const res = await axiosClient.get('/claims/user/my-claims');
    return res.data;
  },

  create: async (data) => {
    const res = await axiosClient.post('/claims', data);
    return res.data;
  },

  processClaim: async (id, data) => {
    // data: { status: "Approved" | "Rejected", adminNotes: "..." }
    const res = await axiosClient.post(`/claims/${id}/process`, data);
    return res.data;
  },
};

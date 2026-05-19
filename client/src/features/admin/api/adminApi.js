import axiosClient from '@/shared/api/axiosClient';

export const adminApi = {
  getDashboard: () => axiosClient.get('/admin/dashboard'),
  
  getSettings: () => axiosClient.get('/admin/settings'),
  updateSettings: (data) => axiosClient.put('/admin/settings', data),
  
  getUsers: () => axiosClient.get('/admin/users'),
  updateUserRole: (id, role) => axiosClient.put(`/admin/users/${id}/role`, { role }),
  updateUserBalance: (id, balance) => axiosClient.put(`/admin/users/${id}/balance`, { balance }),
  deleteUser: (id) => axiosClient.delete(`/admin/users/${id}`),
  
  getSources: () => axiosClient.get('/admin/sources'),
  createSource: (data, config) => axiosClient.post('/admin/sources', data, config),
  updateSource: (id, data, config) => axiosClient.put(`/admin/sources/${id}`, data, config),
  deleteSource: (id) => axiosClient.delete(`/admin/sources/${id}`),
  
  getCoupons: () => axiosClient.get('/admin/coupons'),
  createCoupon: (data) => axiosClient.post('/admin/coupons', data),
  updateCoupon: (id, data) => axiosClient.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => axiosClient.delete(`/admin/coupons/${id}`),
};

import axiosClient from '@/shared/api/axiosClient';

export const authApi = {
  login: (data) => axiosClient.post('/auth/login', data),
  register: (data) => axiosClient.post('/auth/register', data),
  getMe: () => axiosClient.get('/auth/me'),
  logout: () => axiosClient.post('/auth/logout'),
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),
  resetPassword: (token, data) => axiosClient.post(`/auth/reset-password/${token}`, data),
};

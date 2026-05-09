import axiosClient from '@/shared/api/axiosClient';

export const userApi = {
  updateProfile: (data) => axiosClient.put('/profile', data),
  updatePassword: (data) => axiosClient.put('/profile/password', data),
};

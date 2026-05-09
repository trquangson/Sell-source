import axiosClient from '@/shared/api/axiosClient';

export const productsApi = {
  getSources: () => axiosClient.get('/sources'),
  getSource: (id) => axiosClient.get(`/sources/${id}`),
  validateCoupon: (data) => axiosClient.post('/coupons/validate', data),
};

import axiosClient from '@/shared/api/axiosClient';

export const billingApi = {
  getPurchaseHistory: (type, page) => axiosClient.get(`/purchases/history?type=${type}&page=${page}`),
  checkPurchased: (id) => axiosClient.get(`/purchases/check/${id}`),
  purchase: (data) => axiosClient.post('/purchases', data),
};

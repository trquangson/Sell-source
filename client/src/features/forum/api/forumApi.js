import axiosClient from '@/shared/api/axiosClient';

export const forumApi = {
  getPublicPosts: (params) => axiosClient.get('/forum/posts', { params }),
  getPostById: (id) => axiosClient.get(`/forum/posts/${id}`),
  incrementView: (id) => axiosClient.post(`/forum/posts/${id}/view`),
  getMyPosts: () => axiosClient.get('/forum/my-posts'),

  createPost: (data, config) => axiosClient.post('/forum/posts', data, config),
  updatePost: (id, data, config) => axiosClient.put(`/forum/posts/${id}`, data, config),
  deletePost: (id) => axiosClient.delete(`/forum/posts/${id}`),

  checkPurchased: (id) => axiosClient.get(`/forum/posts/${id}/purchase/check`),
  purchasePost: (id) => axiosClient.post(`/forum/posts/${id}/purchase`),

  getPostReviews: (id, page = 1) => axiosClient.get(`/forum/posts/${id}/reviews`, { params: { page } }),
  addPostReview: (id, data) => axiosClient.post(`/forum/posts/${id}/reviews`, data),

  // Admin
  getAllPostsForAdmin: (params) => axiosClient.get('/admin/forum/posts', { params }),
  updatePostStatus: (id, data) => axiosClient.patch(`/admin/forum/posts/${id}/status`, data),
};

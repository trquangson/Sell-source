import axiosClient from '@/shared/api/axiosClient';

export const notificationApi = {
    getAll: (page = 1, limit = 8) =>
        axiosClient.get('/notifications', { params: { page, limit } }),

    getUnreadCount: () =>
        axiosClient.get('/notifications/unread-count'),

    markAsRead: (id) =>
        axiosClient.patch(`/notifications/${id}/read`),

    markAllAsRead: () =>
        axiosClient.patch('/notifications/read-all'),

    deleteNotification: (id) =>
        axiosClient.delete(`/notifications/${id}`),

    // Admin
    adminSend: (payload) =>
        axiosClient.post('/admin/notifications', payload),

    adminList: (page = 1, limit = 20) =>
        axiosClient.get('/admin/notifications', { params: { page, limit } }),

    adminDelete: (id) =>
        axiosClient.delete(`/admin/notifications/${id}`)
};

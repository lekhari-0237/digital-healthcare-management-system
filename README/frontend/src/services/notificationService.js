import api from './api';

export const notificationService = {
  getNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  getPatientNotifications: async () => {
    const response = await api.get('/patient/notifications');
    return response.data;
  },

  markPatientNotificationRead: async (id) => {
    const response = await api.put(`/patient/notifications/${id}/read`);
    return response.data;
  }
};

import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data.data || response.data;
  },

  getPatients: async (params = {}) => {
    const response = await api.get('/admin/patients', { params });
    return response.data.data || response.data;
  },

  togglePatientStatus: async (id) => {
    const response = await api.put(`/admin/patients/${id}/status`);
    return response.data.data || response.data;
  },

  getAllAppointments: async () => {
    const response = await api.get('/admin/appointments');
    return response.data.data || response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/admin/bookings');
    return response.data.data || response.data;
  },

  getAllPayments: async () => {
    const response = await api.get('/admin/payments');
    return response.data.data || response.data;
  },

  getAllReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data.data || response.data;
  },

  notifyDoctorUnavailable: async (appointmentId, data) => {
    const response = await api.post(`/admin/appointments/${appointmentId}/notify-unavailable`, data);
    return response.data;
  }
};

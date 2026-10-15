import api from './api';

export const appointmentService = {
  createAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data.data || response.data;
  },

  getMyAppointments: async () => {
    const response = await api.get('/appointments/my');
    return response.data.data || response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data.data || response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/appointments/${id}/status`, { status });
    return response.data.data || response.data;
  },

  rescheduleAppointment: async (id, data) => {
    const response = await api.put(`/appointments/${id}/reschedule`, data);
    return response.data.data || response.data;
  }
};


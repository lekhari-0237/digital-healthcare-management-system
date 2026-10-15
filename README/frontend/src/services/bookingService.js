import api from './api';

export const bookingService = {
  createBooking: async (data) => {
    const response = await api.post('/test-bookings', data);
    return response.data.data || response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/test-bookings/my');
    return response.data.data || response.data;
  },

  getBookingById: async (id) => {
    const response = await api.get(`/test-bookings/${id}`);
    return response.data.data || response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.put(`/test-bookings/${id}/status`, { status });
    return response.data.data || response.data;
  }
};

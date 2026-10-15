import api from './api';

export const paymentService = {
  submitPayment: async (data) => {
    const response = await api.post('/payments', data);
    return response.data.data || response.data;
  },

  getMyPayments: async () => {
    const response = await api.get('/payments/my');
    return response.data.data || response.data;
  },

  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data.data || response.data;
  },

  approvePayment: async (id) => {
    const response = await api.put(`/payments/${id}/approve`);
    return response.data;
  },

  rejectPayment: async (id, reason) => {
    const response = await api.put(`/payments/${id}/reject`, { reason });
    return response.data;
  }
};

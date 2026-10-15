import api from './api';

export const prescriptionService = {
  getMyPrescriptions: async () => {
    const response = await api.get('/prescriptions/my');
    return response.data.data || response.data;
  },

  getPrescriptionById: async (id) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data.data || response.data;
  },

  createPrescription: async (data) => {
    const response = await api.post('/prescriptions', data);
    return response.data.data || response.data;
  }
};

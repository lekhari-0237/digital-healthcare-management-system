import api from './api';

export const testService = {
  getTests: async (params = {}) => {
    const response = await api.get('/tests', { params });
    return response.data.data || response.data;
  },

  getTestById: async (id) => {
    const response = await api.get(`/tests/${id}`);
    return response.data.data || response.data;
  },

  createTest: async (data) => {
    const response = await api.post('/tests', data);
    return response.data.data || response.data;
  },

  updateTest: async (id, data) => {
    const response = await api.put(`/tests/${id}`, data);
    return response.data.data || response.data;
  },

  deleteTest: async (id) => {
    const response = await api.delete(`/tests/${id}`);
    return response.data;
  }
};

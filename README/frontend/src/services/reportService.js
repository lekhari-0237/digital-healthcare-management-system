import api from './api';

export const reportService = {
  getMyReports: async () => {
    const response = await api.get('/reports/my');
    return response.data.data || response.data;
  },

  getReportById: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data.data || response.data;
  },

  createReport: async (data) => {
    const response = await api.post('/reports', data);
    return response.data.data || response.data;
  },

  updateReport: async (id, data) => {
    const response = await api.put(`/reports/${id}`, data);
    return response.data.data || response.data;
  }
};

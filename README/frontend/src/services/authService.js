import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data) {
      localStorage.setItem('healthtrack_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data) {
      localStorage.setItem('healthtrack_user', JSON.stringify(response.data));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('healthtrack_user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('healthtrack_user') || 'null');
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePatientProfile: async (data) => {
    const response = await api.put('/patients/profile', data);
    return response.data;
  }
};

import api from './api';

export const getOwnerDashboard = () => api.get('/owner/dashboard').then((r) => r.data);

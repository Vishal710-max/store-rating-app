import api from './api';

export const getDashboard = () => api.get('/admin/dashboard').then((r) => r.data);

export const getUsers = (params) => api.get('/admin/users', { params }).then((r) => r.data);
export const getUserDetail = (id) => api.get(`/admin/users/${id}`).then((r) => r.data);
export const addUser = (payload) => api.post('/admin/users', payload).then((r) => r.data);

export const getStores = (params) => api.get('/admin/stores', { params }).then((r) => r.data);
export const addStore = (payload) => api.post('/admin/stores', payload).then((r) => r.data);

import api from './api';

export const getStores = (params) => api.get('/stores', { params }).then((r) => r.data);
export const submitRating = (storeId, rating) =>
  api.post(`/stores/${storeId}/rating`, { rating }).then((r) => r.data);
export const updateRating = (storeId, rating) =>
  api.put(`/stores/${storeId}/rating`, { rating }).then((r) => r.data);

import { api } from './apiClient'

export const vendorsService = {
  getAll:  (params = '') => api.get(`/vendors${params}`),
  getById: (id)          => api.get(`/vendors/${id}`),
  create:  (data)        => api.post('/vendors', data),
  update:  (id, data)    => api.put(`/vendors/${id}`, data),
  delete:  (id)          => api.delete(`/vendors/${id}`),
}

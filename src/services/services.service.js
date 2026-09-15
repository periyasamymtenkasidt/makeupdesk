import { api } from './apiClient'

export const servicesService = {
  getAll:  ()         => api.get('/services'),
  create:  (data)     => api.post('/services', data),
  update:  (id, data) => api.put(`/services/${id}`, data),
  delete:  (id)       => api.delete(`/services/${id}`),
}

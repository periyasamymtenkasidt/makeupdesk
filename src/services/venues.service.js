import { api } from './apiClient'

export const venuesService = {
  getAll:  ()         => api.get('/venues'),
  create:  (data)     => api.post('/venues', data),
  update:  (id, data) => api.put(`/venues/${id}`, data),
  delete:  (id)       => api.delete(`/venues/${id}`),
}

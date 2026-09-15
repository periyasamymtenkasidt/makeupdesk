import { api } from './apiClient'

export const appointmentsService = {
  getAll:    (params = '') => api.get(`/appointments${params}`),
  getById:   (id)          => api.get(`/appointments/${id}`),
  create:    (data)        => api.post('/appointments', data),
  update:    (id, data)    => api.put(`/appointments/${id}`, data),
  updateStatus: (id, data) => api.patch(`/appointments/${id}/status`, data),
  delete:    (id)          => api.delete(`/appointments/${id}`),
}

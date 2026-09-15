import { api } from './apiClient'

export const authService = {
  register:      (data)  => api.post('/auth/register', data),
  login:         (data)  => api.post('/auth/login', data),
  me:            ()      => api.get('/auth/me'),
  forgotPassword:(data)  => api.post('/auth/forgot-password', data),
  verifyOtp:     (data)  => api.post('/auth/verify-otp', data),
  resetPassword: (data)  => api.post('/auth/reset-password', data),
  updateProfile: (data)  => api.put('/auth/profile', data),
}

import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData, { withCredentials: true });
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials, { withCredentials: true });
  // Guardar token si viene en respuesta (opcional si usas cookies)
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
  }
  return response.data;
};

export const logout = async () => {
  await api.post('/auth/logout', {}, { withCredentials: true });
  localStorage.removeItem('access_token');
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/user', { withCredentials: true });
  return response.data;
};

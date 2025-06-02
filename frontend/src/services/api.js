import axios from "axios";

// URL base del backend
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Cambia según tu backend
  withCredentials: true, // Para cookies, si usas JWT en cookies
});

// Interceptor para agregar token automáticamente si usas token en headers
api.interceptors.request.use(
  (config) => {
    // Aquí puedes obtener el token del localStorage o contexto si es necesario
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ejemplo: manejar 401 para logout automático o alertas
    if (error.response && error.response.status === 401) {
      // Puedes agregar lógica para logout automático
      console.error("No autorizado - Sesión expirada");
    }
    return Promise.reject(error);
  }
);

export default api;

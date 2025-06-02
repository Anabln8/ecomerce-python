import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/auth';

// Crear el contexto aquí mismo
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carga usuario autenticado al inicio
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('access_token');
      console.log('Token encontrado:', token);
      if (token) {
        // Si tienes endpoint para obtener usuario real, úsalo aquí:
        // const userData = await authService.getCurrentUser();
        // setUser(userData);
        setUser({}); // Aquí deberías poner datos reales o mínimo un objeto válido
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setUser(data.user);
      console.log('Usuario autenticado:', data);
    } catch (error) {
      console.error('Error en login:', error);
      setUser(null);
      throw error; // para que el componente que llama pueda manejar el error
    } finally {
      setLoading(false);
    }
  };

  const logout = async (credentials) => {
    setLoading(true);
    try {
      // authService.logout() debe enviar la cookie con el token para que el backend valide la sesión
      await authService.logout(credentials);
      setUser(null);
    } catch (error) {
      console.error('Error en logout:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      setUser(data.user || data); // según qué retorna register
    } catch (error) {
      console.error('Error en registro:', error);
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

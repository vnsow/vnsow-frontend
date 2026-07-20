import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para limpiar completamente el estado de autenticación de admin
  const clearAdminAuthState = useCallback(() => {
    setAdmin(null);
  }, []);

  useEffect(() => {
    initializeAdminAuth();

    // Configurar interceptor de Axios para manejar errores 401 (sesión expirada de admin)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Solo procesar errores 401 de rutas de admin si NO estamos en la página de login
        const isAdminLoginPage = window.location.pathname === '/admin/login';
        if (error.response && error.response.status === 401 && error.config.url.includes('/admin/') && !isAdminLoginPage) {
          // Sesión de admin expirada o inválida - limpiar estado y redirigir
          clearAdminAuthState();
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );

    // Limpiar interceptor cuando el componente se desmonte
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [clearAdminAuthState]);

  const initializeAdminAuth = async () => {
    try {
      // Solo verificar sesión de admin si estamos en rutas de admin
      // Las cookies httpOnly no son accesibles desde JS, así que solo verificamos la ruta
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      const isAdminLoginPage = window.location.pathname === '/admin/login';

      // No verificar sesión si no estamos en ruta de admin o si estamos en el login
      if (!isAdminRoute || isAdminLoginPage) {
        clearAdminAuthState();
        setLoading(false);
        return;
      }

      // Intentar verificar sesión (el backend verificará la cookie httpOnly)
      const response = await axios.get(`${API}/admin/auth/me`, { withCredentials: true });
      setAdmin(response.data);
    } catch (error) {
      // Si no hay sesión de admin o hay error, dejamos admin en null
      // No mostramos error porque es esperado cuando no hay sesión
      clearAdminAuthState();
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirect = true) => {
    try {
      // Llamar al endpoint de logout de admin en el backend
      await axios.post(`${API}/admin/auth/logout`, {}, { withCredentials: true });

      // Limpiar completamente el estado de autenticación
      clearAdminAuthState();

      // Redirigir al login de admin solo si redirect es true
      if (redirect) {
        window.location.href = '/admin/login';
      }
    } catch (error) {
      // Incluso si hay error, limpiar el estado local
      clearAdminAuthState();

      // Redirigir solo si redirect es true
      if (redirect) {
        window.location.href = '/admin/login';
      }
    }
  };

  const refreshAdmin = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/admin/auth/me`, { withCredentials: true });
      setAdmin(response.data);
    } catch (error) {
      // Si hay error al refrescar, limpiar estado
      clearAdminAuthState();
    }
  }, [clearAdminAuthState]);

  return (
    <AdminAuthContext.Provider value={{ admin, loading, logout, refreshAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

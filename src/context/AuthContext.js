import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Función para limpiar completamente el estado de autenticación
  const clearAuthState = useCallback(() => {
    setUser(null);
    setIsAdmin(false);
  }, []);

  useEffect(() => {
    initializeAuth();

    // Configurar interceptor de Axios para manejar errores 401 (sesión expirada)
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Solo procesar errores 401 de rutas de usuario si NO estamos en páginas públicas
        const isPublicPage = window.location.pathname === '/' ||
                            window.location.pathname === '/faq' ||
                            window.location.pathname === '/terminos' ||
                            window.location.pathname.startsWith('/admin');

        if (error.response && error.response.status === 401 && !isPublicPage) {
          // Sesión expirada o inválida - limpiar estado y redirigir
          clearAuthState();
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );

    // Limpiar interceptor cuando el componente se desmonte
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [clearAuthState]);

  const initializeAuth = async () => {
    try {
      // Verificar sesión solo si NO estamos en rutas específicas que no la necesitan
      const isLandingPage = window.location.pathname === '/';
      const isPublicRoute = window.location.pathname === '/faq' ||
                           window.location.pathname === '/terminos' ||
                           window.location.pathname.startsWith('/admin');

      if (isLandingPage || isPublicRoute) {
        // En landing o rutas públicas/admin, no verificamos sesión de usuario
        clearAuthState();
        setLoading(false);
        return;
      }

      // Intentar verificar sesión (el backend verificará la cookie httpOnly)
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
      setIsAdmin(response.data.is_admin || false);
    } catch (error) {
      // Si no hay sesión o hay error, simplemente dejamos user en null
      // No mostramos error porque es esperado cuando no hay sesión
      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  const logout = async (redirect = true) => {
    try {
      // Llamar al endpoint de logout en el backend
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });

      // Limpiar completamente el estado de autenticación
      clearAuthState();

      // Redirigir a la landing page solo si redirect es true
      if (redirect) {
        window.location.href = '/';
      }
    } catch (error) {
      // Incluso si hay error, limpiar el estado local
      clearAuthState();

      // Redirigir solo si redirect es true
      if (redirect) {
        window.location.href = '/';
      }
    }
  };

  const refreshUser = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
      setUser(response.data);
      setIsAdmin(response.data.is_admin || false);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

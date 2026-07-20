// Helper para autenticación Emergent

const REDIRECT_URL = window.location.origin + '/dashboard';
const AUTH_URL = process.env.REACT_APP_AUTH_URL || 'https://auth.emergentagent.com';
const SESSION_API = process.env.REACT_APP_SESSION_API || 'https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data';

export const redirectToLogin = () => {
  window.location.href = `${AUTH_URL}/?redirect=${encodeURIComponent(REDIRECT_URL)}`;
};

export const getSessionIdFromUrl = () => {
  const hash = window.location.hash;
  if (hash.includes('session_id=')) {
    const sessionId = hash.split('session_id=')[1].split('&')[0];
    return sessionId;
  }
  return null;
};

export const clearSessionIdFromUrl = () => {
  if (window.location.hash) {
    window.history.replaceState(null, '', window.location.pathname);
  }
};

export const fetchSessionData = async (sessionId) => {
  const response = await fetch(SESSION_API, {
    headers: {
      'X-Session-ID': sessionId
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch session data');
  }
  
  return await response.json();
};

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const hasSessionToken = () => {
  return getCookie('session_token') !== null;
};

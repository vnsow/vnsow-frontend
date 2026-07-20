const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const BACKEND_UNAVAILABLE_MESSAGE =
  'El sistema no está disponible en este momento. Por favor intenta de nuevo en 5 minutos.';

/**
 * Hace una petición GET a /api/health con timeout.
 * Sirve para despertar el backend (Render free tier suspende tras inactividad).
 * Lanza error si el backend no responde dentro del timeout.
 */
export const pingBackend = async (timeoutMs = 60000) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${BACKEND_URL}/api/health`, {
      method: 'GET',
      signal: controller.signal,
      credentials: 'omit',
    });
    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }
    return true;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Pre-warm "fire-and-forget" del backend. Pensado para llamarse al cargar la app,
 * silenciosamente despierta Render mientras el usuario lee la landing.
 * Cualquier error se ignora (no impacta al usuario).
 */
export const prewarmBackend = () => {
  pingBackend(30000).catch(() => {
    // silencio intencional: es un best-effort
  });
};

/**
 * Verifica que el backend esté disponible y luego redirige al flujo OAuth de Google.
 * Lanza error si el backend no responde — el caller debe atrapar y mostrar mensaje.
 */
export const loginWithGoogle = async (timeoutMs = 60000) => {
  await pingBackend(timeoutMs);
  window.location.href = `${BACKEND_URL}/api/auth/google/login`;
};

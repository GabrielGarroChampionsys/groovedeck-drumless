// Servicio de Autenticación y Control de Acceso Privado (Google Whitelist)

export const ALLOWED_EMAILS = [
  'gabriel.alejandro.garro@gmail.com'
];

const AUTH_STORAGE_KEY = 'groovedeck_auth_user_v1';

/**
 * Obtiene el usuario autenticado actual desde localStorage
 */
export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Verificar que siga en la lista blanca
    if (user && isEmailAuthorized(user.email)) {
      return user;
    }
    logoutUser();
    return null;
  } catch {
    return null;
  }
}

/**
 * Valida si el email pertenece a la lista blanca estricta
 */
export function isEmailAuthorized(email) {
  if (!email) return false;
  return ALLOWED_EMAILS.includes(email.trim().toLowerCase());
}

/**
 * Guarda la sesión del usuario si está autorizado
 */
export function saveAuthorizedSession(userData) {
  if (!isEmailAuthorized(userData.email)) {
    throw new Error('UNAUTHORIZED_EMAIL');
  }
  const sessionUser = {
    email: userData.email.toLowerCase(),
    name: userData.name || 'Gabriel Garro',
    avatar: userData.avatar || 'https://lh3.googleusercontent.com/a/default-user',
    role: 'Owner & Drummer',
    loginAt: new Date().toISOString()
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionUser));
  return sessionUser;
}

/**
 * Cierra la sesión
 */
export function logoutUser() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Decodifica el token JWT de Google Identity Services
 */
export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

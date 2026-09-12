// Gestor de Temas y Apariencia para GrooveDeck

export const THEMES = [
  { id: 'dark', label: 'Dark Pro Audio', icon: '🌙', desc: 'Grafito oscuro de estudio (Logic Pro style)' },
  { id: 'light', label: 'Light Studio', icon: '☀️', desc: 'Blanco perla y aluminio refinado de Apple' },
  { id: 'auto', label: 'Auto (Sistema)', icon: '💻', desc: 'Sigue automáticamente el modo de macOS' },
  { id: 'neon', label: 'Cyber Synthwave', icon: '⚡', desc: 'Neón violeta y cian para tocar de noche' },
  { id: 'vintage', label: 'Vintage Wood', icon: '🪵', desc: 'Latón pulido y caoba de baterías clásicas' }
];

const THEME_STORAGE_KEY = 'groovedeck_theme_preference_v1';

export function getStoredTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
}

export function applyTheme(themeId) {
  localStorage.setItem(THEME_STORAGE_KEY, themeId);

  let effectiveTheme = themeId;
  if (themeId === 'auto') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    effectiveTheme = prefersDark ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', effectiveTheme);
  return effectiveTheme;
}

export function initThemeListener(onThemeChange) {
  const current = getStoredTheme();
  applyTheme(current);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e) => {
    if (getStoredTheme() === 'auto') {
      const effective = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', effective);
      if (onThemeChange) onThemeChange('auto', effective);
    }
  };

  mediaQuery.addEventListener('change', handler);
  return () => mediaQuery.removeEventListener('change', handler);
}

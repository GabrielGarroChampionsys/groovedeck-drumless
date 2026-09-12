// Gestor de persistencia en localStorage para repertorio de canciones drumless
import { INITIAL_SONGS } from '../data/initialCatalog';

const STORAGE_KEY = 'groovedeck_drumless_catalog_v1';
const RECENT_HISTORY_KEY = 'groovedeck_recent_history_v1';

export function getStoredSongs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SONGS));
      return INITIAL_SONGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SONGS;
  } catch (err) {
    console.error('Error al leer catálogo de localStorage:', err);
    return INITIAL_SONGS;
  }
}

export function saveSongs(songs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
  } catch (err) {
    console.error('Error al guardar canciones en localStorage:', err);
  }
}

export function getPracticeStats() {
  try {
    const raw = localStorage.getItem('groovedeck_practice_stats');
    if (!raw) return { totalSessions: 12, totalMinutes: 240, lastPlayed: new Date().toISOString() };
    return JSON.parse(raw);
  } catch {
    return { totalSessions: 0, totalMinutes: 0, lastPlayed: null };
  }
}

export function logPracticeSession(minutes = 15) {
  try {
    const current = getPracticeStats();
    current.totalSessions += 1;
    current.totalMinutes += minutes;
    current.lastPlayed = new Date().toISOString();
    localStorage.setItem('groovedeck_practice_stats', JSON.stringify(current));
  } catch (e) {
    console.error(e);
  }
}

export function exportCatalogJSON(songs) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(songs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `GrooveDeck_Repertorio_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PlayerCockpit from './components/PlayerCockpit';
import SongLibrary from './components/SongLibrary';
import SongDetailModal from './components/SongDetailModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import StageModeView from './components/StageModeView';
import LoginGate from './components/LoginGate';
import ThemeSelectorModal from './components/ThemeSelectorModal';
import { getStoredSongs, saveSongs, exportCatalogJSON, logPracticeSession } from './services/storage';
import { getStoredUser, logoutUser } from './services/auth';
import { getStoredTheme, applyTheme, initThemeListener } from './services/themeManager';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [currentTheme, setCurrentTheme] = useState(() => getStoredTheme());
  const [songs, setSongs] = useState(() => getStoredSongs());
  const [activeSongId, setActiveSongId] = useState(() => songs[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMoodFilter, setActiveMoodFilter] = useState('ALL');

  // Modales
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [songToEdit, setSongToEdit] = useState(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isStageModeOpen, setIsStageModeOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Inicializar Tema y escuchar cambios de sistema (auto)
  useEffect(() => {
    applyTheme(currentTheme);
    const cleanup = initThemeListener((mode, effective) => {
      // Listener de auto-switch
    });
    return cleanup;
  }, [currentTheme]);

  // Canción activa
  const currentSong = songs.find(s => s.id === activeSongId) || songs[0] || null;

  // Persistir canciones cuando cambien
  useEffect(() => {
    saveSongs(songs);
  }, [songs]);

  // Atajos globales (V para Asistente de Voz, F para TV Stage Mode)
  useEffect(() => {
    const handleGlobalKey = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        setIsVoiceModalOpen(prev => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsStageModeOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // Handlers CRUD
  const handleSaveSong = (songData) => {
    setSongs(prev => {
      const exists = prev.some(s => s.id === songData.id);
      if (exists) {
        return prev.map(s => s.id === songData.id ? songData : s);
      } else {
        return [songData, ...prev];
      }
    });
    setActiveSongId(songData.id);
  };

  const handleDeleteSong = (songId) => {
    if (window.confirm('¿Seguro que deseas eliminar esta canción de tu repertorio?')) {
      setSongs(prev => {
        const next = prev.filter(s => s.id !== songId);
        if (activeSongId === songId && next.length > 0) {
          setActiveSongId(next[0].id);
        }
        return next;
      });
    }
  };

  const handleUpdateCurrentSong = (updated) => {
    setSongs(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleOpenEdit = (song) => {
    setSongToEdit(song);
    setIsAddModalOpen(true);
  };

  const handleOpenAdd = () => {
    setSongToEdit(null);
    setIsAddModalOpen(true);
  };

  // Procesador de Intents del Drum DJ (Voz)
  const handleApplyVoiceIntent = (intent) => {
    if (!intent) return;

    if (intent.type === 'PLAY') {
      const playBtn = document.querySelector('.btn-emerald, .btn-primary');
      if (playBtn) playBtn.click();
    } else if (intent.type === 'PAUSE') {
      const pauseBtn = document.querySelector('.btn-primary');
      if (pauseBtn) pauseBtn.click();
    } else if (intent.type === 'TOGGLE_FULLSCREEN') {
      setIsStageModeOpen(true);
    } else if (intent.type === 'MOOD_FILTER') {
      // Filtrar por mood detectado
      if (intent.mood === 'warmup') setActiveMoodFilter('WARMUP');
      else if (intent.mood === 'rock') setActiveMoodFilter('ROCK');
      else if (intent.mood === 'funk') setActiveMoodFilter('FUNK');
      else if (intent.mood === 'challenge') setActiveMoodFilter('CHALLENGE');
      else if (intent.mood === 'favorites') setActiveMoodFilter('FAVORITES');

      // Buscar primera coincidencia y seleccionarla
      const match = songs.find(intent.criteria);
      if (match) {
        setActiveSongId(match.id);
      }
    } else if (intent.type === 'SEARCH_SONG') {
      const q = intent.query.toLowerCase();
      const match = songs.find(s => 
        s.title.toLowerCase().includes(q) || 
        s.artist.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q)
      );
      if (match) {
        setActiveSongId(match.id);
      } else {
        setSearchTerm(intent.query);
      }
    }
  };

  // Filtrar canciones para la biblioteca
  const searchedSongs = songs.filter(song => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      song.title.toLowerCase().includes(q) ||
      song.artist.toLowerCase().includes(q) ||
      song.genre.toLowerCase().includes(q) ||
      song.ssd5Preset?.toLowerCase().includes(q) ||
      song.tags?.some(t => t.toLowerCase().includes(q))
    );
  });

  // Si no está autenticado como Gabriel Garro, mostrar LoginGate
  if (!currentUser) {
    return <LoginGate onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenVoiceAssistant={() => setIsVoiceModalOpen(true)}
        onOpenAddModal={handleOpenAdd}
        onToggleStageMode={() => setIsStageModeOpen(true)}
        onExportCatalog={() => exportCatalogJSON(songs)}
        totalSongs={songs.length}
        currentUser={currentUser}
        onLogout={() => {
          logoutUser();
          setCurrentUser(null);
        }}
        currentTheme={currentTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '24px 28px' }}>
        {/* Active Player Cockpit */}
        <PlayerCockpit
          currentSong={currentSong}
          onUpdateSong={handleUpdateCurrentSong}
          onOpenEditModal={handleOpenEdit}
        />

        {/* Library & Repertoire */}
        <SongLibrary
          songs={searchedSongs}
          activeSongId={activeSongId}
          onSelectSong={(song) => setActiveSongId(song.id)}
          onDeleteSong={handleDeleteSong}
          onEditSong={handleOpenEdit}
          activeMoodFilter={activeMoodFilter}
          setActiveMoodFilter={setActiveMoodFilter}
        />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
        marginTop: '40px'
      }}>
        GrooveDeck • Diseñado para Donner DED-200 Max + Logic Pro & SSD5 • Control Manos Libres con Drum DJ
      </footer>

      {/* Modales */}
      <SongDetailModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveSong}
        songToEdit={songToEdit}
      />

      <VoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSelectSongDirectly={(song) => {
          setActiveSongId(song.id);
          // Incrementar contador de prácticas
          setSongs(prev => prev.map(s => s.id === song.id ? { ...s, playCount: (s.playCount || 0) + 1 } : s));
        }}
        songs={songs}
      />

      <StageModeView
        isOpen={isStageModeOpen}
        onClose={() => setIsStageModeOpen(false)}
        currentSong={currentSong}
      />

      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={(newTheme) => {
          setCurrentTheme(newTheme);
          applyTheme(newTheme);
        }}
      />
    </div>
  );
}

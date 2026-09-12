import React, { useState } from 'react';
import { Play, Star, Sparkles, Filter, Trash2, Edit3, Music } from 'lucide-react';

export default function SongLibrary({
  songs = [],
  activeSongId,
  onSelectSong,
  onDeleteSong,
  onEditSong,
  activeMoodFilter,
  setActiveMoodFilter
}) {
  const [activeGenreFilter, setActiveGenreFilter] = useState('ALL');

  // Mood filters
  const MOOD_OPTIONS = [
    { id: 'ALL', label: 'Todo el Repertorio', icon: '🎵' },
    { id: 'WARMUP', label: 'Calentamiento (Lento)', icon: '🧘' },
    { id: 'ROCK', label: 'Rock con Energía', icon: '🔥' },
    { id: 'FUNK', label: 'Funk & Síncopa', icon: '🎷' },
    { id: 'CHALLENGE', label: 'Desafío Técnico', icon: '⚡' },
    { id: 'FAVORITES', label: 'Favoritos', icon: '⭐' }
  ];

  // Filtrado compuesto (por mood y género)
  const filteredSongs = songs.filter(song => {
    // Filtro por Mood
    if (activeMoodFilter === 'WARMUP' && !(song.bpm <= 100 || song.difficulty <= 2)) return false;
    if (activeMoodFilter === 'ROCK' && !(song.genre.toLowerCase().includes('rock') || song.genre.toLowerCase().includes('grunge'))) return false;
    if (activeMoodFilter === 'FUNK' && !song.genre.toLowerCase().includes('funk')) return false;
    if (activeMoodFilter === 'CHALLENGE' && song.difficulty < 4) return false;
    if (activeMoodFilter === 'FAVORITES' && !song.favorite) return false;

    // Filtro por Género
    if (activeGenreFilter !== 'ALL' && song.genre !== activeGenreFilter) return false;

    return true;
  });

  return (
    <div style={{ marginTop: '32px' }}>
      {/* Header & Mood Pills */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Tu Repertorio Drumless
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {filteredSongs.length} de {songs.length} pistas disponibles para tocar
          </p>
        </div>

        {/* Mood Selector Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {MOOD_OPTIONS.map(mood => (
            <button
              key={mood.id}
              onClick={() => setActiveMoodFilter(mood.id)}
              className="btn"
              style={{
                padding: '6px 12px',
                fontSize: '0.8rem',
                borderRadius: 'var(--radius-full)',
                background: activeMoodFilter === mood.id 
                  ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)' 
                  : 'rgba(255, 255, 255, 0.04)',
                borderColor: activeMoodFilter === mood.id ? 'var(--amber)' : 'var(--border-subtle)',
                color: activeMoodFilter === mood.id ? 'var(--amber-light)' : 'var(--text-secondary)',
                fontWeight: activeMoodFilter === mood.id ? 600 : 400
              }}
            >
              <span>{mood.icon}</span>
              <span>{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Canciones */}
      {filteredSongs.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <Music size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px auto' }} />
          <p style={{ color: 'var(--text-secondary)' }}>No hay canciones que coincidan con este filtro.</p>
          <button 
            onClick={() => setActiveMoodFilter('ALL')}
            className="btn btn-primary" 
            style={{ marginTop: '14px' }}
          >
            Ver todo el repertorio
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '18px'
        }}>
          {filteredSongs.map(song => {
            const isActive = song.id === activeSongId;
            const thumbUrl = song.youtubeId 
              ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg` 
              : null;

            return (
              <div
                key={song.id}
                className="glass-panel"
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--amber)' : '1px solid var(--border-subtle)',
                  boxShadow: isActive ? 'var(--shadow-glow-amber)' : 'var(--shadow-card)',
                  background: isActive ? 'rgba(30, 38, 54, 0.85)' : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onClick={() => onSelectSong(song)}
              >
                {/* Thumbnail Image */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 9',
                  background: '#111',
                  overflow: 'hidden'
                }}>
                  {thumbUrl ? (
                    <img
                      src={thumbUrl}
                      alt={song.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Music size={40} color="var(--text-muted)" />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.85) 100%)'
                  }} />

                  {/* Floating Badges */}
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    display: 'flex',
                    gap: '6px'
                  }}>
                    <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                      {song.bpm} BPM
                    </span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                      {song.genre}
                    </span>
                  </div>

                  {/* Mastery Indicator */}
                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    {song.mastery === 'mastered' && (
                      <span className="badge badge-emerald">Dominada</span>
                    )}
                    {song.mastery === 'practicing' && (
                      <span className="badge badge-cyan">En práctica</span>
                    )}
                    {song.mastery === 'learning' && (
                      <span className="badge badge-amber">Aprendiendo</span>
                    )}
                  </div>

                  {/* Play Action Button on Hover */}
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px'
                  }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: isActive ? 'var(--amber)' : 'rgba(255,255,255,0.9)',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }}>
                      <Play size={18} fill="#000" style={{ marginLeft: '2px' }} />
                    </div>
                  </div>
                </div>

                {/* Song Meta Body */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {song.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {song.artist}
                    </p>

                    {/* SSD5 Kit Info */}
                    <div style={{
                      marginTop: '10px',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span style={{ color: 'var(--amber-light)', fontWeight: 600 }}>Kit: </span>
                      {song.ssd5Preset ? song.ssd5Preset.split('(')[0] : 'Kit Estándar'}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '14px',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)'
                  }}>
                    {/* Dificultad */}
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1, 2, 3, 4, 5].map((lvl) => (
                        <span key={lvl} style={{ fontSize: '0.8rem', opacity: lvl <= (song.difficulty || 3) ? 1 : 0.2 }}>
                          🥢
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onEditSong(song)}
                        className="btn"
                        style={{ padding: '6px 8px', fontSize: '0.75rem' }}
                        title="Editar metadatos / notas"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => onDeleteSong(song.id)}
                        className="btn"
                        style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--crimson)' }}
                        title="Eliminar de mi repertorio"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { 
  Play, Sparkles, Flame, Clock, Star, Shuffle, 
  Mic, Search, ArrowRight, Music, Sliders, CheckCircle2, 
  TrendingUp, Award, Compass 
} from 'lucide-react';

export default function HomeDashboard({
  songs = [],
  onSelectSong,
  onOpenVoiceAssistant,
  onOpenAddModal,
  searchTerm,
  setSearchTerm,
  userName = 'Gabriel'
}) {
  // Saludo según la hora
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  // Recientes / Más practicadas
  const recentSongs = [...songs]
    .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
    .slice(0, 4);

  // Favoritos
  const favoriteSongs = songs.filter(s => s.favorite).slice(0, 4);

  // Selector aleatorio "Sorpréndeme"
  const handleSurpriseMe = () => {
    if (songs.length === 0) return;
    const randomIndex = Math.floor(Math.random() * songs.length);
    onSelectSong(songs[randomIndex]);
  };

  // Acciones Rápidas de Mood
  const MOOD_LAUNCHERS = [
    {
      id: 'warmup',
      title: 'Calentamiento',
      desc: 'Tempo relajado para calentar muñecas',
      icon: '🧘',
      bpmRange: '< 100 BPM',
      filter: (s) => s.bpm <= 100 || s.difficulty <= 2,
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.05) 100%)',
      accentColor: 'var(--emerald)'
    },
    {
      id: 'rock',
      title: 'Pura Energía',
      desc: 'Rock sólido con pegada y rimshots',
      icon: '🔥',
      bpmRange: '115 - 160 BPM',
      filter: (s) => s.genre.toLowerCase().includes('rock') || s.genre.toLowerCase().includes('grunge'),
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)',
      accentColor: 'var(--amber)'
    },
    {
      id: 'funk',
      title: 'Funk & Groove',
      desc: 'Síncopas y control de hi-hat',
      icon: '🎷',
      bpmRange: '95 - 110 BPM',
      filter: (s) => s.genre.toLowerCase().includes('funk') || s.tags.some(t => t.toLowerCase().includes('funk')),
      gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(2, 132, 199, 0.05) 100%)',
      accentColor: 'var(--cyan)'
    },
    {
      id: 'challenge',
      title: 'Desafío Técnico',
      desc: 'Ghost notes, shuffles e independencia',
      icon: '⚡',
      bpmRange: 'Avanzado',
      filter: (s) => s.difficulty >= 4,
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(147, 51, 234, 0.05) 100%)',
      accentColor: '#A855F7'
    }
  ];

  const handleLaunchMood = (launcher) => {
    const match = songs.find(launcher.filter) || songs[0];
    if (match) onSelectSong(match);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '40px' }}>
      
      {/* 1. HERO DE BIENVENIDA & ESTADO DEL SETUP */}
      <div className="glass-panel" style={{
        position: 'relative',
        padding: '36px 40px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(6, 182, 212, 0.04) 50%, rgba(18, 23, 33, 0.7) 100%)',
        border: '1px solid var(--border-bright)'
      }}>
        {/* Glow de fondo */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--amber-glow) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.9rem' }}>🥁</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--amber-light)', letterSpacing: '0.04em' }}>
                DONNER DED-200 MAX • LOGIC PRO + SSD5
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: '10px', lineHeight: '1.15' }}>
              {greeting}, {userName}.
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '24px' }}>
              Tu estación drumless está lista y calibrada. ¿Qué ritmo tienes ganas de estudiar o descargar en los parches hoy?
            </p>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenVoiceAssistant}
                className="btn btn-primary btn-large"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <Mic size={20} />
                <span>Hablar con Drum DJ</span>
                <span className="mono" style={{ fontSize: '0.75rem', padding: '2px 6px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>V</span>
              </button>

              <button
                onClick={handleSurpriseMe}
                className="btn btn-large"
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                title="Elegir una canción al azar de tu repertorio"
              >
                <Shuffle size={18} color="var(--amber)" />
                <span>Sorpréndeme con un tema</span>
              </button>
            </div>
          </div>

          {/* Stats Widget de Baterista */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            minWidth: '280px',
            background: 'rgba(0, 0, 0, 0.35)',
            padding: '18px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Repertorio</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {songs.length}
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--emerald)' }}>Tracks drumless</span>
            </div>

            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sesiones</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--amber-light)', marginTop: '2px' }}>
                14
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Esta semana</span>
            </div>

            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dominadas</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--emerald)', marginTop: '2px' }}>
                {songs.filter(s => s.mastery === 'mastered').length}
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--emerald)' }}>Listas en vivo</span>
            </div>

            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.03)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Favoritas</span>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--cyan)', marginTop: '2px' }}>
                {favoriteSongs.length}
              </p>
              <span style={{ fontSize: '0.7rem', color: 'var(--cyan)' }}>De cabecera</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ¿QUÉ DESEAS TOCAR HOY? (MOOD LAUNCHERS) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ¿Qué ritmo te pide el cuerpo hoy?
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Elige un objetivo de práctica y salta directo a la pista calibrada para ese estilo.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {MOOD_LAUNCHERS.map((mood) => (
            <div
              key={mood.id}
              onClick={() => handleLaunchMood(mood)}
              className="glass-panel"
              style={{
                padding: '22px',
                cursor: 'pointer',
                background: mood.gradient,
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '160px',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2rem' }}>{mood.icon}</span>
                  <span className="badge" style={{ background: 'rgba(0,0,0,0.3)', color: mood.accentColor, border: `1px solid ${mood.accentColor}44`, fontSize: '0.7rem' }}>
                    {mood.bpmRange}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {mood.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {mood.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', color: mood.accentColor, fontSize: '0.85rem', fontWeight: 600 }}>
                <span>Empezar a tocar</span>
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CONTINUAR PRACTICANDO (LO QUE MÁS TOCAS / RECIENTES) */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Flame size={20} color="var(--amber)" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Continuar Practicando
            </h2>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tus pistas más frecuentes</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {recentSongs.map((song) => {
            const thumbUrl = song.youtubeId 
              ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg` 
              : null;

            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="glass-panel"
                style={{
                  display: 'flex',
                  gap: '14px',
                  padding: '12px',
                  cursor: 'pointer',
                  alignItems: 'center',
                  background: 'var(--bg-card)'
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  position: 'relative',
                  width: '100px',
                  height: '65px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: '#000'
                }}>
                  {thumbUrl && (
                    <img src={thumbUrl} alt={song.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--amber)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000'
                    }}>
                      <Play size={14} fill="#000" style={{ marginLeft: '1px' }} />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {song.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {song.artist}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--amber-light)' }}>
                      {song.bpm} BPM
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      • {song.playCount || 5} prácticas
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. TUS CLÁSICOS FAVORITOS */}
      {favoriteSongs.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={20} color="var(--amber)" fill="var(--amber)" />
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Tus Clásicos Favoritos
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Temas para disfrutar tocando</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {favoriteSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="glass-panel"
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'rgba(255, 255, 255, 0.03)'
                }}
              >
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {song.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {song.artist} • <span className="mono">{song.bpm} BPM</span>
                  </p>
                  <span className="badge badge-amber" style={{ fontSize: '0.65rem', marginTop: '6px' }}>
                    {song.genre}
                  </span>
                </div>

                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--amber)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--amber)'
                }}>
                  <Play size={16} fill="var(--amber)" style={{ marginLeft: '1px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BANNER INVITACIÓN PARA AÑADIR NUEVA PISTA */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(18, 23, 33, 0.6) 100%)',
        border: '1px solid var(--border-bright)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--cyan-glow)',
            border: '1px solid var(--cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan)'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ¿Encontraste una nueva canción drumless en YouTube?
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Pega el link y nuestra IA detectará automáticamente el BPM, el estilo y te sugerirá el kit de SSD5 para Logic Pro.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.95rem' }}
        >
          <span>Pegar Link de YouTube</span>
        </button>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Repeat, Clock, Tv, Sliders, Volume2 } from 'lucide-react';
import MetronomeBeat from './MetronomeBeat';

export default function StageModeView({
  isOpen,
  onClose,
  currentSong
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'f') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKey);
    }
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  if (!isOpen || !currentSong) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: '#07090D',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px 32px'
    }}>
      {/* Top Bar for Big Distance Reading */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '2rem' }}>🥁</span>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              {currentSong.title}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              {currentSong.artist} • <span style={{ color: 'var(--amber-light)' }}>{currentSong.genre}</span>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Big BPM & Metronome Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            padding: '10px 24px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-bright)',
            borderRadius: 'var(--radius-full)'
          }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--amber)' }}>
              {currentSong.bpm}
            </span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              BPM • {currentSong.timeSignature || '4/4'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="btn btn-large"
            style={{ borderRadius: 'var(--radius-full)', padding: '12px 20px' }}
            title="Salir de modo TV (Esc)"
          >
            <X size={24} />
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>Salir (Esc)</span>
          </button>
        </div>
      </div>

      {/* Main Video Viewport (Maximized for TV) */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 0',
        minHeight: 0
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          maxWidth: '1400px',
          maxHeight: '80vh',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          background: '#000',
          border: '1px solid var(--border-bright)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
        }}>
          <iframe
            src={`https://www.youtube.com/embed/${currentSong.youtubeId}?autoplay=1&controls=1&modestbranding=1`}
            title={currentSong.title}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      {/* Bottom Hub Bar (SSD5 Kit + Drumming Cues visible from distance) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '24px',
        padding: '18px 24px',
        background: 'rgba(14, 18, 24, 0.85)',
        backdropFilter: 'blur(25px)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-bright)'
      }}>
        {/* SSD5 Kit Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Sliders size={28} color="var(--amber)" />
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kit en Logic Pro (SSD5)
            </span>
            <p style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--amber-light)' }}>
              {currentSong.ssd5Preset || 'SSD5 Rock Vintage'}
            </p>
          </div>
        </div>

        {/* Technical Cues */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Clock size={28} color="var(--emerald)" />
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Consejo de Práctica
            </span>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: '1.3' }}>
              {currentSong.notes || 'Mantén el pulso constante y las muñecas relajadas.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function MetronomeBeat({ bpm = 120, isPlaying = false, countInActive = false, currentCount = 0 }) {
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!isPlaying && !countInActive) {
      setBeat(0);
      return;
    }

    const intervalMs = (60 / bpm) * 1000;
    const interval = setInterval(() => {
      setBeat(prev => (prev + 1) % 4);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [bpm, isPlaying, countInActive]);

  if (countInActive) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '6px 16px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid var(--crimson)',
        color: '#FCA5A5'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em' }}>COUNT-IN:</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1rem',
                fontFamily: 'var(--font-mono)',
                background: currentCount === num ? 'var(--crimson)' : 'rgba(255, 255, 255, 0.1)',
                color: '#fff',
                transform: currentCount === num ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '6px 14px',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(0, 0, 0, 0.4)',
      border: '1px solid var(--border-subtle)'
    }}>
      <div style={{ display: 'flex', gap: '6px' }}>
        {[0, 1, 2, 3].map((b) => {
          const isCurrent = isPlaying && beat === b;
          const isAccent = b === 0;
          return (
            <div
              key={b}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: isCurrent 
                  ? (isAccent ? 'var(--amber)' : 'var(--emerald)') 
                  : 'rgba(255, 255, 255, 0.15)',
                boxShadow: isCurrent 
                  ? (isAccent ? '0 0 10px var(--amber)' : '0 0 8px var(--emerald)') 
                  : 'none',
                transform: isCurrent ? 'scale(1.3)' : 'scale(1)',
                transition: 'all 0.1s ease'
              }}
            />
          );
        })}
      </div>
      <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
        {bpm} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>BPM</span>
      </span>
    </div>
  );
}

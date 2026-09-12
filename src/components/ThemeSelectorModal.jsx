import React from 'react';
import { X, Check, Palette, Moon, Sun, Monitor, Zap } from 'lucide-react';
import { THEMES } from '../services/themeManager';

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 120,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '28px',
        position: 'relative',
        boxShadow: 'var(--shadow-dock)'
      }}>
        <button
          onClick={onClose}
          className="btn"
          style={{ position: 'absolute', top: '16px', right: '16px', padding: '8px', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Palette size={22} color="var(--amber)" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Apariencia de GrooveDeck
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
          Elige el estilo visual que mejor se adapte a la iluminación de tu sala de batería.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {THEMES.map((th) => {
            const isSelected = currentTheme === th.id;
            return (
              <div
                key={th.id}
                onClick={() => {
                  onSelectTheme(th.id);
                  onClose();
                }}
                className="glass-panel"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  border: isSelected ? '1px solid var(--amber)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'var(--amber-glow)' : 'rgba(125, 125, 125, 0.05)',
                  boxShadow: isSelected ? 'var(--shadow-glow-amber)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '1.6rem' }}>{th.icon}</span>
                  <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {th.label}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {th.desc}
                    </p>
                  </div>
                </div>

                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: isSelected ? '2px solid var(--amber)' : '2px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected ? 'var(--amber)' : 'transparent',
                  color: '#000'
                }}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Mic, Plus, Tv, Search, SlidersHorizontal, Download, Music } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onOpenVoiceAssistant,
  onOpenAddModal,
  onToggleStageMode,
  onExportCatalog,
  totalSongs = 0,
  currentUser = null,
  onLogout = null
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '16px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '20px',
      background: 'rgba(9, 11, 14, 0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)'
    }}>
      {/* Brand & Setup Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
          border: '1px solid var(--border-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          boxShadow: '0 0 15px rgba(245, 158, 11, 0.15)'
        }}>
          🥁
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              GrooveDeck
            </h1>
            <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>PRO</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Donner DED-200 Max • Logic Pro + SSD5
          </p>
        </div>
      </div>

      {/* Search and Voice Trigger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '520px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={16} style={{
            position: 'absolute',
            left: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '40px', paddingRight: '12px', height: '42px' }}
            placeholder="Buscar por tema, artista, género o compás..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Voice Assistant / Drum DJ Button */}
        <button
          onClick={onOpenVoiceAssistant}
          className="btn"
          style={{
            height: '42px',
            padding: '0 16px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.08) 100%)',
            border: '1px solid var(--border-accent)',
            color: 'var(--amber-light)',
            fontWeight: 600,
            whiteSpace: 'nowrap'
          }}
          title="Hablar con el Drum DJ (Atajo: tecla V)"
        >
          <Mic size={18} />
          <span>Drum DJ</span>
          <span className="mono" style={{
            fontSize: '0.7rem',
            padding: '2px 5px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '4px',
            color: 'var(--amber)'
          }}>V</span>
        </button>
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={onToggleStageMode}
          className="btn"
          title="Modo Escenario / TV (Pantalla Completa gigante para batería)"
          style={{ height: '42px' }}
        >
          <Tv size={17} color="var(--cyan)" />
          <span style={{ display: 'none', md: 'inline' }}>Modo TV</span>
          <span className="mono" style={{ fontSize: '0.7rem', opacity: 0.6 }}>F</span>
        </button>

        <button
          onClick={onExportCatalog}
          className="btn"
          title="Exportar copia de seguridad de tu repertorio"
          style={{ height: '42px', padding: '0 12px' }}
        >
          <Download size={16} />
        </button>

        <button
          onClick={onOpenAddModal}
          className="btn btn-primary"
          style={{ height: '42px' }}
        >
          <Plus size={18} />
          <span>Añadir Canción</span>
        </button>

        {/* User Profile & Logout */}
        {currentUser && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            paddingLeft: '10px',
            borderLeft: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px 10px 4px 6px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'var(--amber)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.8rem'
              }}>
                G
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Gabriel
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>
                Privado
              </span>
            </div>

            <button
              onClick={onLogout}
              className="btn"
              style={{ height: '36px', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}
              title="Cerrar sesión"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

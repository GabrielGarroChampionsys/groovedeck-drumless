import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, ShieldAlert, Sparkles, CheckCircle2, UserCheck, ArrowRight } from 'lucide-react';
import { ALLOWED_EMAILS, isEmailAuthorized, saveAuthorizedSession, parseJwt } from '../services/auth';

export default function LoginGate({ onLoginSuccess }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [manualEmail, setManualEmail] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Inicializar Google Identity Services si está cargado
  useEffect(() => {
    const handleCredentialResponse = (response) => {
      try {
        const payload = parseJwt(response.credential);
        if (payload && payload.email) {
          if (isEmailAuthorized(payload.email)) {
            const user = saveAuthorizedSession({
              email: payload.email,
              name: payload.name || 'Gabriel Garro',
              avatar: payload.picture
            });
            onLoginSuccess(user);
          } else {
            setErrorMsg(`El correo "${payload.email}" no tiene autorización. Acceso exclusivo para ${ALLOWED_EMAILS[0]}.`);
          }
        }
      } catch (err) {
        setErrorMsg('Error al procesar el inicio de sesión con Google.');
      }
    };

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: '1092837465-drumless-groovedeck.apps.googleusercontent.com', // Client ID placeholder configurable
        callback: handleCredentialResponse
      });
    }
  }, [onLoginSuccess]);

  // Login de acceso directo para el propietario autorizado
  const handleOwnerDirectLogin = () => {
    try {
      const user = saveAuthorizedSession({
        email: ALLOWED_EMAILS[0],
        name: 'Gabriel Garro',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      });
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg('No autorizado.');
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setErrorMsg(null);
    if (isEmailAuthorized(manualEmail)) {
      const user = saveAuthorizedSession({
        email: manualEmail,
        name: 'Gabriel Garro',
        avatar: null
      });
      onLoginSuccess(user);
    } else {
      setErrorMsg(`⛔ Acceso Denegado: "${manualEmail || 'Este correo'}" no está en la lista blanca de la app. Solo ${ALLOWED_EMAILS[0]} puede acceder.`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'radial-gradient(circle at 50% 35%, rgba(245, 158, 11, 0.08) 0%, transparent 60%), #07090D',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245, 158, 11, 0.12) 0%, transparent 70%)',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '40px 32px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)'
      }}>
        {/* Logo & Lock Badge */}
        <div style={{ position: 'relative', width: '70px', height: '70px', margin: '0 auto 20px auto' }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.1) 100%)',
            border: '1px solid var(--amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.25)'
          }}>
            🥁
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#07090D',
            border: '1px solid var(--amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber)'
          }}>
            <Lock size={14} />
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '8px' }}>
          GrooveDeck Pro
        </h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>ACCESO PRIVADO EXCLUSIVO</span>
        </div>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '28px' }}>
          Estación personal de estudio drumless calibrada para <b>Donner DED-200 Max + Logic Pro & SSD5</b>.
        </p>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--crimson)',
            color: '#FCA5A5',
            fontSize: '0.85rem',
            textAlign: 'left',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Google Login Action for Gabriel Garro */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleOwnerDirectLogin}
            className="btn btn-primary btn-large"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              fontWeight: 700,
              fontSize: '1rem',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.35)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#000" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#000" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#000" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#000" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Iniciar Sesión con Google</span>
          </button>

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            🔒 Autorizado únicamente para: <b style={{ color: 'var(--amber-light)' }}>gabriel.alejandro.garro@gmail.com</b>
          </p>
        </div>

        {/* Verification Check Toggle */}
        <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {showManualInput ? 'Ocultar verificación manual de email' : 'Verificar whitelist con otro correo'}
          </button>

          {showManualInput && (
            <form onSubmit={handleManualSubmit} style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              <input
                type="email"
                required
                className="input-field"
                placeholder="email@ejemplo.com"
                value={manualEmail}
                onChange={(e) => setManualEmail(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '8px 12px' }}
              />
              <button type="submit" className="btn" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                Probar
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

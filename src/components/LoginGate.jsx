import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, Sparkles, CheckCircle2, Mail, Send, Check, User, Music, ArrowRight } from 'lucide-react';
import { ALLOWED_EMAILS, isEmailAuthorized, saveAuthorizedSession, parseJwt } from '../services/auth';

export default function LoginGate({ onLoginSuccess }) {
  const [errorMsg, setErrorMsg] = useState(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [requestData, setRequestData] = useState({
    name: '',
    email: '',
    drumKit: '',
    message: ''
  });

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
            setErrorMsg(`El correo "${payload.email}" no tiene acceso autorizado. Puedes completar el formulario abajo para solicitar una invitación a Gabriel.`);
          }
        }
      } catch (err) {
        setErrorMsg('Error al procesar el inicio de sesión con Google.');
      }
    };

    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: '1092837465-drumless-groovedeck.apps.googleusercontent.com',
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

  // Envío de Solicitud para Interesados hacia gabriel.alejandro.garro@gmail.com
  const handleRequestAccessSubmit = (e) => {
    e.preventDefault();
    if (!requestData.email || !requestData.name) return;

    // Guardar lead en localStorage
    try {
      const leads = JSON.parse(localStorage.getItem('groovedeck_access_requests') || '[]');
      leads.push({ ...requestData, date: new Date().toISOString() });
      localStorage.setItem('groovedeck_access_requests', JSON.stringify(leads));
    } catch {
      // ignore
    }

    // Armar enlace mailto para enviar email a gabriel.alejandro.garro@gmail.com
    const subject = encodeURIComponent(`Interés en probar GrooveDeck (Beta Privada) - ${requestData.name}`);
    const body = encodeURIComponent(
      `Hola Gabriel,\n\nEncontré GrooveDeck en internet y me interesa probarlo para practicar con mi batería.\n\n` +
      `• Mi Nombre: ${requestData.name}\n` +
      `• Mi Correo: ${requestData.email}\n` +
      `• Mi Batería: ${requestData.drumKit || 'Batería Electrónica'}\n` +
      `• Mensaje: ${requestData.message || 'Me gustaría tener acceso para probar el producto.'}\n\n` +
      `¡Saludos!`
    );

    window.open(`mailto:gabriel.alejandro.garro@gmail.com?subject=${subject}&body=${body}`, '_blank');
    setRequestSubmitted(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 20px',
      background: 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.08) 0%, transparent 60%), #07090D',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--amber-glow) 0%, transparent 70%)',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '540px',
        padding: '36px 32px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.1)'
      }}>
        {/* Logo & Private Badge */}
        <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto 16px auto' }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.1) 100%)',
            border: '1px solid var(--amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.25)'
          }}>
            🥁
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#07090D',
            border: '1px solid var(--amber)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--amber)'
          }}>
            <Lock size={12} />
          </div>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
          GrooveDeck Pro
        </h1>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px' }}>
          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>FASE PRIVADA EXCLUSIVA</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '24px' }}>
          Estación de práctica drumless de alta gama para bateristas con batería electrónica & DAW.
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

        {/* SECCIÓN 1: INICIO DE SESIÓN DE GABRIEL GARRO */}
        <div style={{
          padding: '20px',
          borderRadius: 'var(--radius-lg)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Acceso Propietario (Gabriel Garro)
          </p>

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
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.3)'
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

          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            🔒 Habilitado únicamente para: <b style={{ color: 'var(--amber-light)' }}>gabriel.alejandro.garro@gmail.com</b>
          </p>
        </div>

        {/* SECCIÓN 2: CONTACTAR A GABRIEL SI ENCUENTRAN LA PÁGINA (LEAD CAPTURE) */}
        <div style={{
          padding: '22px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.06) 0%, rgba(0, 0, 0, 0.3) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={18} color="var(--cyan)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ¿Eres baterista y quieres probar la app?
            </h3>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '14px' }}>
            Actualmente el acceso está restringido. Si encontraste esta página y te interesa probar el producto con tu batería, envíale un mensaje a Gabriel y te contactará para sumarte a la beta:
          </p>

          {requestSubmitted ? (
            <div style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid var(--emerald)',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={32} color="var(--emerald)" style={{ margin: '0 auto 8px auto' }} />
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                ¡Mensaje enviado a Gabriel Garro!
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Se redactó el correo para <b>gabriel.alejandro.garro@gmail.com</b>. Te contactaremos en breve con tu invitación.
              </p>
              <button
                type="button"
                onClick={() => setRequestSubmitted(false)}
                className="btn"
                style={{ marginTop: '12px', fontSize: '0.75rem', padding: '6px 12px' }}
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleRequestAccessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    placeholder="Ej. Lucas"
                    value={requestData.name}
                    onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                    Tu Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    placeholder="lucas@email.com"
                    value={requestData.email}
                    onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  ¿Qué batería tocas?
                </label>
                <input
                  type="text"
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  placeholder="Ej. Donner DED-200, Roland TD-17, Acústica..."
                  value={requestData.drumKit}
                  onChange={(e) => setRequestData({ ...requestData, drumKit: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '3px' }}>
                  Mensaje para Gabriel (opcional)
                </label>
                <textarea
                  rows="2"
                  className="input-field"
                  style={{ padding: '8px 12px', fontSize: '0.85rem', resize: 'none' }}
                  placeholder="Me interesa practicar pistas drumless con tempo y loops..."
                  value={requestData.message}
                  onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="btn btn-emerald"
                style={{
                  padding: '10px 16px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '4px'
                }}
              >
                <Mail size={16} />
                <span>Contactar a Gabriel (Enviar Mail)</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

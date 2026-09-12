import React, { useState, useEffect } from 'react';
import { Lock, ShieldAlert, Sparkles, CheckCircle2, Mail, Send, Check, User, Music } from 'lucide-react';
import { ALLOWED_EMAILS, isEmailAuthorized, saveAuthorizedSession, parseJwt } from '../services/auth';

export default function LoginGate({ onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'request_access'
  const [errorMsg, setErrorMsg] = useState(null);
  const [manualEmail, setManualEmail] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Formulario de Solicitud de Acceso / Lead
  const [requestData, setRequestData] = useState({
    name: '',
    email: '',
    drumKit: 'Batería Electrónica (Roland, Donner, Alesis...)',
    message: ''
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);

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
            setErrorMsg(`El correo "${payload.email}" no tiene autorización. Si deseas probar la app, puedes solicitar acceso en la pestaña "Solicitar Acceso".`);
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
      setErrorMsg(`⛔ Acceso Denegado: "${manualEmail || 'Este correo'}" no está en la lista blanca de la app. Si te interesa probarla, solicítale una invitación a Gabriel.`);
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

    // Armar enlace mailto para que se abra el cliente de correo directo hacia Gabriel
    const subject = encodeURIComponent(`Interés en probar GrooveDeck (Beta Privada) - ${requestData.name}`);
    const body = encodeURIComponent(
      `Hola Gabriel,\n\nMe interesa probar GrooveDeck para practicar batería.\n\n` +
      `• Nombre: ${requestData.name}\n` +
      `• Mi correo: ${requestData.email}\n` +
      `• Mi batería: ${requestData.drumKit}\n` +
      `• Mensaje: ${requestData.message || 'Me gustaría tener acceso a la beta.'}\n\n` +
      `Saludos!`
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
        background: 'radial-gradient(circle, var(--amber-glow) 0%, transparent 70%)',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none'
      }} />

      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        padding: '36px 32px',
        textAlign: 'center',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(255, 255, 255, 0.1)'
      }}>
        {/* Logo & Lock Badge */}
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
            bottom: '-6px',
            right: '-6px',
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
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '6px' }}>
          GrooveDeck Pro
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Estación de práctica drumless de alta gama para bateristas.
        </p>

        {/* Tabs Switcher: Login vs Solicitar Acceso */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px'
        }}>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(null); }}
            className="btn"
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'login' ? 'var(--amber)' : 'transparent',
              color: activeTab === 'login' ? '#000' : 'var(--text-secondary)',
              fontWeight: activeTab === 'login' ? 700 : 500,
              fontSize: '0.85rem',
              padding: '8px'
            }}
          >
            🔒 Acceso Propietario
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('request_access'); setErrorMsg(null); }}
            className="btn"
            style={{
              flex: 1,
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeTab === 'request_access' ? 'var(--amber)' : 'transparent',
              color: activeTab === 'request_access' ? '#000' : 'var(--text-secondary)',
              fontWeight: activeTab === 'request_access' ? 700 : 500,
              fontSize: '0.85rem',
              padding: '8px'
            }}
          >
            ✨ ¿Interesado? Contáctame
          </button>
        </div>

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

        {/* TAB 1: LOGIN PROPIETARIO */}
        {activeTab === 'login' && (
          <div>
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
                🔒 Acceso restringido exclusivamente a: <b style={{ color: 'var(--amber-light)' }}>gabriel.alejandro.garro@gmail.com</b>
              </p>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
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
        )}

        {/* TAB 2: SOLICITAR ACCESO / LEAD GENERATION */}
        {activeTab === 'request_access' && (
          <div style={{ textAlign: 'left' }}>
            {requestSubmitted ? (
              <div style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--emerald)',
                textAlign: 'center'
              }}>
                <CheckCircle2 size={40} color="var(--emerald)" style={{ margin: '0 auto 12px auto' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  ¡Solicitud Enviada a Gabriel!
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Se abrió tu cliente de correo para enviar el mensaje directo a <b>gabriel.alejandro.garro@gmail.com</b>. Te responderemos en breve para coordinar tu acceso a la beta de GrooveDeck.
                </p>
                <button
                  type="button"
                  onClick={() => setRequestSubmitted(false)}
                  className="btn"
                  style={{ marginTop: '16px' }}
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestAccessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  ¿Te gustaría probar <b>GrooveDeck</b> con tu batería? Déjale tus datos a Gabriel y te contactará para darte acceso o invitarte a la beta:
                </p>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Ej. Lucas Silva"
                    value={requestData.name}
                    onChange={(e) => setRequestData({ ...requestData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Tu Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    className="input-field"
                    placeholder="lucas@ejemplo.com"
                    value={requestData.email}
                    onChange={(e) => setRequestData({ ...requestData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    ¿Qué batería tocas?
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Ej. Donner DED-200, Roland TD-17, Acústica..."
                    value={requestData.drumKit}
                    onChange={(e) => setRequestData({ ...requestData, drumKit: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Mensaje o interés (opcional)
                  </label>
                  <textarea
                    rows="2"
                    className="input-field"
                    placeholder="Me gustaría usarla para practicar backing tracks sin batería..."
                    value={requestData.message}
                    onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '12px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '4px'
                  }}
                >
                  <Mail size={18} />
                  <span>Contactar a Gabriel (Enviar Mail)</span>
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, Repeat, Zap, Star, 
  Volume2, FastForward, Rewind, Bookmark, Clock, 
  Sliders, FileText, CheckCircle2, ShieldAlert, Sparkles 
} from 'lucide-react';
import MetronomeBeat from './MetronomeBeat';

export default function PlayerCockpit({
  currentSong,
  onUpdateSong,
  onOpenEditModal
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopActive, setLoopActive] = useState(false);
  const [loopA, setLoopA] = useState(currentSong?.loopA ?? null);
  const [loopB, setLoopB] = useState(currentSong?.loopB ?? null);
  const [countInEnabled, setCountInEnabled] = useState(true);
  const [countInActive, setCountInActive] = useState(false);
  const [currentCount, setCurrentCount] = useState(0);

  const playerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const iframeContainerRef = useRef(null);

  // Sincronizar loops si cambia la canción
  useEffect(() => {
    if (currentSong) {
      setLoopA(currentSong.loopA ?? null);
      setLoopB(currentSong.loopB ?? null);
      setLoopActive(currentSong.loopA !== null && currentSong.loopB !== null);
      setIsPlaying(false);
    }
  }, [currentSong?.id]);

  // Cargar YouTube IFrame Player API
  useEffect(() => {
    if (!currentSong?.youtubeId) return;

    // Función de inicialización
    const initPlayer = () => {
      if (window.YT && window.YT.Player) {
        if (playerRef.current && playerRef.current.destroy) {
          playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player('youtube-player-frame', {
          videoId: currentSong.youtubeId,
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            iv_load_policy: 3
          },
          events: {
            onReady: (event) => {
              setDuration(event.target.getDuration() || 0);
            },
            onStateChange: (event) => {
              // 1 = Playing, 2 = Paused, 0 = Ended
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else {
                setIsPlaying(false);
              }
            }
          }
        });
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initPlayer;
    } else {
      initPlayer();
    }

    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [currentSong?.youtubeId]);

  // Polling de tiempo actual y control de A-B Looper
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        try {
          const curr = playerRef.current.getCurrentTime();
          setCurrentTime(curr);

          // Lógica de bucle A-B
          if (loopActive && loopA !== null && loopB !== null && loopB > loopA) {
            if (curr >= loopB) {
              if (countInEnabled) {
                triggerCountInAndSeek(loopA);
              } else {
                playerRef.current.seekTo(loopA, true);
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }, 200);

    return () => clearInterval(timerIntervalRef.current);
  }, [loopActive, loopA, loopB, countInEnabled]);

  // Ejecuta Count-In de 4 tiempos antes de arrancar
  const triggerCountInAndSeek = (targetTime = null) => {
    if (playerRef.current && playerRef.current.pauseVideo) {
      playerRef.current.pauseVideo();
    }
    setCountInActive(true);
    setCurrentCount(1);

    const bpm = currentSong?.bpm || 120;
    const intervalMs = (60 / bpm) * 1000;

    let step = 1;
    const countTimer = setInterval(() => {
      step += 1;
      if (step <= 4) {
        setCurrentCount(step);
      } else {
        clearInterval(countTimer);
        setCountInActive(false);
        setCurrentCount(0);
        if (targetTime !== null && playerRef.current?.seekTo) {
          playerRef.current.seekTo(targetTime, true);
        }
        if (playerRef.current?.playVideo) {
          playerRef.current.playVideo();
        }
      }
    }, intervalMs);
  };

  // Controles de Reproducción
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      if (countInEnabled && currentTime === 0) {
        triggerCountInAndSeek(0);
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleSeek = (seconds) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds, true);
    }
  };

  const changePlaybackRate = (rate) => {
    setPlaybackRate(rate);
    if (playerRef.current?.setPlaybackRate) {
      playerRef.current.setPlaybackRate(rate);
    }
  };

  // Guardar puntos de Loop
  const setLoopPointA = () => {
    const time = Math.floor(currentTime);
    setLoopA(time);
    setLoopActive(true);
    onUpdateSong({ ...currentSong, loopA: time });
  };

  const setLoopPointB = () => {
    const time = Math.ceil(currentTime);
    setLoopB(time);
    setLoopActive(true);
    onUpdateSong({ ...currentSong, loopB: time });
  };

  const clearLoop = () => {
    setLoopA(null);
    setLoopB(null);
    setLoopActive(false);
    onUpdateSong({ ...currentSong, loopA: null, loopB: null });
  };

  // Atajos de Teclado para Bateristas
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Si está escribiendo en un input, ignorar
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === '[') {
        e.preventDefault();
        setLoopPointA();
      } else if (e.key === ']') {
        e.preventDefault();
        setLoopPointB();
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        setLoopActive(prev => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleSeek(Math.max(0, currentTime - 5));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleSeek(Math.min(duration, currentTime + 5));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, duration, loopA, loopB]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentSong) {
    return (
      <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Selecciona una canción de tu repertorio para comenzar a tocar.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', alignItems: 'start' }}>
      {/* Columna Principal: Video + Looper Cockpit */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Video Player Card */}
        <div className="glass-panel" style={{ overflow: 'hidden', padding: '16px' }}>
          {/* Header del Track Activo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            gap: '12px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {currentSong.title}
                </h2>
                <span className="badge badge-amber">{currentSong.genre}</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {currentSong.artist} • Compás {currentSong.timeSignature || '4/4'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Metrónomo visual */}
              <MetronomeBeat 
                bpm={currentSong.bpm} 
                isPlaying={isPlaying} 
                countInActive={countInActive}
                currentCount={currentCount}
              />
              {/* Botón de Favorito */}
              <button
                onClick={() => onUpdateSong({ ...currentSong, favorite: !currentSong.favorite })}
                className="btn"
                style={{
                  padding: '8px 12px',
                  background: currentSong.favorite ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.06)',
                  borderColor: currentSong.favorite ? 'var(--amber)' : 'var(--border-subtle)',
                  color: currentSong.favorite ? 'var(--amber)' : 'var(--text-muted)'
                }}
              >
                <Star size={16} fill={currentSong.favorite ? 'var(--amber)' : 'none'} />
              </button>
            </div>
          </div>

          {/* YouTube Video Frame */}
          <div 
            ref={iframeContainerRef}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              background: '#000',
              boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
            }}
          >
            <div id="youtube-player-frame" style={{ width: '100%', height: '100%' }}></div>
          </div>

          {/* Time & Section Progress */}
          <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', minWidth: '45px' }}>
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              style={{
                flex: 1,
                accentColor: 'var(--amber)',
                cursor: 'pointer',
                height: '6px'
              }}
            />
            <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', minWidth: '45px' }}>
              {formatTime(duration)}
            </span>
          </div>

          {/* Marcadores de Sección (Intro, Verso, Coro, etc.) */}
          {currentSong.sections && currentSong.sections.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginTop: '12px', paddingBottom: '4px' }}>
              {currentSong.sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleSeek(sec.time)}
                  className="btn"
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'var(--border-subtle)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Bookmark size={12} color="var(--amber)" />
                  <span>{sec.name}</span>
                  <span className="mono" style={{ opacity: 0.6, fontSize: '0.7rem' }}>
                    {formatTime(sec.time)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Barra de Control Ergonómica de Batería (Cockpit Controls) */}
        <div className="glass-panel" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            
            {/* Play / Pause y Controles Principales */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => handleSeek(Math.max(0, currentTime - 5))}
                className="btn btn-drummer-stick"
                title="Rebobinar 5 seg (Flecha Izq)"
              >
                <Rewind size={20} />
              </button>

              <button
                onClick={togglePlay}
                className={`btn btn-drummer-stick ${isPlaying ? 'btn-primary' : 'btn-emerald'}`}
                style={{ minWidth: '80px', fontSize: '1.2rem' }}
                title="Play / Pausa (Barra Espaciadora)"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '2px' }} />}
              </button>

              <button
                onClick={() => handleSeek(Math.min(duration, currentTime + 5))}
                className="btn btn-drummer-stick"
                title="Adelantar 5 seg (Flecha Der)"
              >
                <FastForward size={20} />
              </button>

              {/* Botón Count-in Toggle */}
              <button
                onClick={() => setCountInEnabled(!countInEnabled)}
                className="btn"
                style={{
                  height: '52px',
                  padding: '0 14px',
                  background: countInEnabled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  borderColor: countInEnabled ? 'var(--crimson)' : 'var(--border-subtle)',
                  color: countInEnabled ? '#FCA5A5' : 'var(--text-muted)'
                }}
                title="Conteo previo de 4 tiempos antes de empezar"
              >
                <Clock size={16} />
                <span>4-Count</span>
              </button>
            </div>

            {/* A-B Looper Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 'var(--radius-md)',
              border: loopActive ? '1px solid var(--amber)' : '1px solid var(--border-subtle)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginRight: '4px' }}>
                LOOPER:
              </span>
              
              <button
                onClick={setLoopPointA}
                className="btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: loopA !== null ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: loopA !== null ? 'var(--amber-light)' : 'var(--text-primary)'
                }}
                title="Marcar Punto A (Atajo: [)"
              >
                Set A: {loopA !== null ? formatTime(loopA) : '--'}
              </button>

              <button
                onClick={setLoopPointB}
                className="btn"
                style={{
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: loopB !== null ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                  color: loopB !== null ? 'var(--amber-light)' : 'var(--text-primary)'
                }}
                title="Marcar Punto B (Atajo: ])"
              >
                Set B: {loopB !== null ? formatTime(loopB) : '--'}
              </button>

              <button
                onClick={() => setLoopActive(!loopActive)}
                className={`btn ${loopActive ? 'btn-primary' : ''}`}
                style={{ padding: '6px 12px' }}
                title="Activar / Pausar Bucle (Atajo: L)"
                disabled={loopA === null || loopB === null}
              >
                <Repeat size={16} />
              </button>

              {(loopA !== null || loopB !== null) && (
                <button
                  onClick={clearLoop}
                  className="btn"
                  style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--crimson)' }}
                  title="Borrar Loop"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Selector de Velocidad (Playback Rate) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Velocidad:</span>
              {[0.75, 0.85, 1.0, 1.1].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changePlaybackRate(rate)}
                  className="btn"
                  style={{
                    padding: '6px 10px',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    background: playbackRate === rate ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: playbackRate === rate ? 'var(--cyan)' : 'var(--border-subtle)',
                    color: playbackRate === rate ? 'var(--cyan)' : 'var(--text-secondary)'
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>

          </div>

          {/* Atajos de Teclado Visibles para Bateristas */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)'
          }}>
            <span>⌨️ <b>Espacio:</b> Play/Pausa</span>
            <span><b>[ :</b> Set A</span>
            <span><b>] :</b> Set B</span>
            <span><b>L :</b> Bucle</span>
            <span><b>←/→ :</b> -5s/+5s</span>
            <span><b>V :</b> Asistente Drum DJ</span>
            <span><b>F :</b> Pantalla Completa</span>
          </div>
        </div>
      </div>

      {/* Columna Lateral: Hub de Batería & Logic/SSD5 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Preset de SSD5 & Configuración de Logic */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={18} color="var(--amber)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                SSD5 Drum Kit
              </h3>
            </div>
            <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>LOGIC PRO</span>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '14px'
          }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              Preset recomendado:
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--amber-light)', lineHeight: '1.3' }}>
              {currentSong.ssd5Preset || 'SSD5 Rock Vintage Kit'}
            </p>
          </div>

          {/* Nivel de Maestría */}
          <div style={{ marginBottom: '14px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Estado de Aprendizaje:
            </p>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { key: 'learning', label: 'Aprendiendo', color: 'var(--amber)' },
                { key: 'practicing', label: 'Pulido', color: 'var(--cyan)' },
                { key: 'mastered', label: 'Dominada', color: 'var(--emerald)' }
              ].map(status => (
                <button
                  key={status.key}
                  onClick={() => onUpdateSong({ ...currentSong, mastery: status.key })}
                  className="btn"
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    fontSize: '0.75rem',
                    background: currentSong.mastery === status.key ? `${status.color}22` : 'rgba(255,255,255,0.04)',
                    borderColor: currentSong.mastery === status.key ? status.color : 'var(--border-subtle)',
                    color: currentSong.mastery === status.key ? status.color : 'var(--text-muted)',
                    fontWeight: currentSong.mastery === status.key ? 700 : 400
                  }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dificultad en Baquetas */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Dificultad:</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[1, 2, 3, 4, 5].map((level) => (
                <span 
                  key={level} 
                  style={{ 
                    fontSize: '1rem', 
                    opacity: level <= (currentSong.difficulty || 3) ? 1 : 0.2 
                  }}
                >
                  🥢
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Notas de Técnica y Consejos para el Baterista */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--emerald)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Notas de Práctica
              </h3>
            </div>
            <button
              onClick={() => onOpenEditModal(currentSong)}
              className="btn"
              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
            >
              Editar
            </button>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid var(--border-subtle)',
            minHeight: '80px'
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {currentSong.notes || 'No hay notas añadidas para este tema. Haz clic en Editar para agregar consejos de dinámica o fills.'}
            </p>
          </div>

          {/* Tags */}
          {currentSong.tags && currentSong.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
              {currentSong.tags.map((tag, i) => (
                <span key={i} className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

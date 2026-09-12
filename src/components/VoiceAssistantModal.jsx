import React, { useState, useEffect } from 'react';
import { Mic, MicOff, X, Sparkles, Volume2, Play, Flame, Music, History, Check } from 'lucide-react';
import { DrumVoiceAssistant } from '../services/voiceCommander';
import { askDrumDJWithGemini } from '../services/geminiService';

const QUICK_GENRES = [
  { id: 'rock', label: 'Rock', icon: '🎸' },
  { id: 'funk', label: 'Funk & Groove', icon: '🎷' },
  { id: 'grunge', label: 'Grunge 90s', icon: '⚡' },
  { id: 'shuffle', label: 'Shuffle / Jazz', icon: '🥁' },
  { id: 'pop', label: 'Pop & Dance', icon: '🕺' },
  { id: 'metal', label: 'Metal', icon: '🤘' }
];

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  onSelectSongDirectly,
  songs = []
}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [activeGenreSelected, setActiveGenreSelected] = useState(null);
  const [interpretedIntent, setInterpretedIntent] = useState(null);
  const [geminiCoach, setGeminiCoach] = useState(null);
  const [isThinkingGemini, setIsThinkingGemini] = useState(false);
  const [assistantInstance, setAssistantInstance] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      if (assistantInstance) assistantInstance.cancel();
      setIsListening(false);
      setTranscript('');
      setActiveGenreSelected(null);
      setInterpretedIntent(null);
      return;
    }

    const assistant = new DrumVoiceAssistant(
      // Actualización en tiempo real del dictado continuo
      (accumulatedText) => {
        setTranscript(accumulatedText);
      },
      // Al presionar stop y analizar
      (result) => {
        setInterpretedIntent(result.intent);
        if (result.intent.genres?.length > 0) {
          setActiveGenreSelected(result.intent.genres[0]);
        }
      },
      (err) => {
        console.warn('Speech error:', err);
      }
    );

    setAssistantInstance(assistant);
    assistant.start();
    setIsListening(true);

    return () => {
      assistant.cancel();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle de micrófono: no para hasta que el usuario lo pulsa
  const toggleListening = async () => {
    if (!assistantInstance) return;
    if (isListening) {
      // El usuario terminó de hablar voluntariamente -> procesar
      const intent = assistantInstance.stopAndAnalyze();
      setIsListening(false);
      setInterpretedIntent(intent);
      if (intent.genres?.length > 0) {
        setActiveGenreSelected(intent.genres[0]);
      }

      // Consulta a Gemini AI
      if (transcript && transcript.trim().length > 3) {
        setIsThinkingGemini(true);
        try {
          const geminiResult = await askDrumDJWithGemini(transcript, songs);
          if (geminiResult) {
            setGeminiCoach(geminiResult);
            // Si Gemini recomendó una canción específica, resaltarla
            if (geminiResult.selectedSongId) {
              const recommended = songs.find(s => s.id === geminiResult.selectedSongId);
              if (recommended) {
                // Auto-marcar el género si aplica
                if (recommended.genre) {
                  const gLower = recommended.genre.toLowerCase();
                  if (gLower.includes('rock')) setActiveGenreSelected('rock');
                  else if (gLower.includes('funk')) setActiveGenreSelected('funk');
                  else if (gLower.includes('grunge')) setActiveGenreSelected('grunge');
                  else if (gLower.includes('pop')) setActiveGenreSelected('pop');
                  else if (gLower.includes('shuffle')) setActiveGenreSelected('shuffle');
                  else if (gLower.includes('metal')) setActiveGenreSelected('metal');
                }
              }
            }
          }
        } catch (e) {
          console.error(e);
        } finally {
          setIsThinkingGemini(false);
        }
      }
    } else {
      // Volver a encender micrófono para seguir dictando
      setGeminiCoach(null);
      assistantInstance.start();
      setIsListening(true);
      setInterpretedIntent(null);
    }
  };

  const handleSelectGenreButton = (genreKey) => {
    setActiveGenreSelected(genreKey);
  };

  // Algoritmo de Ranking de Canciones:
  // 1. Coincidencia con género o intención de voz
  // 2. Ordenado: Primero los más tocados (playCount alto + favoritos), luego el resto
  const getRankedSuggestions = () => {
    let filtered = [...songs];

    if (activeGenreSelected) {
      filtered = filtered.filter(song => {
        const g = song.genre.toLowerCase();
        const t = song.tags.map(x => x.toLowerCase()).join(' ');
        if (activeGenreSelected === 'rock') return g.includes('rock') || g.includes('grunge') || t.includes('rock');
        if (activeGenreSelected === 'funk') return g.includes('funk') || t.includes('funk') || t.includes('groove');
        if (activeGenreSelected === 'grunge') return g.includes('grunge') || t.includes('grunge');
        if (activeGenreSelected === 'shuffle') return g.includes('shuffle') || g.includes('jazz') || t.includes('shuffle');
        if (activeGenreSelected === 'pop') return g.includes('pop') || t.includes('pop');
        if (activeGenreSelected === 'metal') return g.includes('metal') || t.includes('metal');
        return true;
      });
    }

    // Ordenar: Los más tocados primero (playCount descendente, favoritos primero)
    const mostPlayed = [...filtered].sort((a, b) => {
      const scoreA = (a.playCount || 0) + (a.favorite ? 10 : 0);
      const scoreB = (b.playCount || 0) + (b.favorite ? 10 : 0);
      return scoreB - scoreA;
    });

    // Separar en: "Lo que más tocas" (top 2 o 3) y "Otras opciones para tocar"
    const topPlayed = mostPlayed.slice(0, 2);
    const others = mostPlayed.slice(2);

    return { topPlayed, others, all: mostPlayed };
  };

  const { topPlayed, others, all } = getRankedSuggestions();

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 110,
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(25px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '30px',
        position: 'relative'
      }}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="btn"
          style={{ position: 'absolute', top: '20px', right: '20px', padding: '8px', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.6rem' }}>🎙️</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Drum DJ — Asistente de Repertorio
            </h2>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Dicta todo lo que quieras con tus baquetas o selecciona un género para ver lo que más tocas.
          </p>
        </div>

        {/* BOTONES RÁPIDOS DE GÉNEROS */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
            Sugerencias rápidas por género:
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {QUICK_GENRES.map((g) => {
              const isSelected = activeGenreSelected === g.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => handleSelectGenreButton(g.id)}
                  className="btn"
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(217, 119, 6, 0.2) 100%)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    borderColor: isSelected ? 'var(--amber)' : 'var(--border-subtle)',
                    color: isSelected ? 'var(--amber-light)' : 'var(--text-primary)',
                    fontWeight: isSelected ? 700 : 500
                  }}
                >
                  <span>{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECCIÓN DE DICTADO CONTINUO */}
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0, 0, 0, 0.45)',
          border: isListening ? '1px solid var(--amber)' : '1px solid var(--border-subtle)',
          marginBottom: '24px',
          boxShadow: isListening ? 'var(--shadow-glow-amber)' : 'none',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div
                onClick={toggleListening}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: isListening ? 'var(--amber)' : 'rgba(255, 255, 255, 0.1)',
                  color: isListening ? '#000' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: isListening ? '0 0 15px var(--amber)' : 'none',
                  transition: 'all 0.2s ease'
                }}
                title={isListening ? "Presiona para terminar de hablar y analizar" : "Presiona para comenzar a dictar"}
              >
                {isListening ? <Mic size={22} /> : <MicOff size={22} />}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: isListening ? 'var(--amber-light)' : 'var(--text-muted)' }}>
                  {isListening ? '🔴 Escuchando sin parar (puedes explayarte todo lo que quieras)...' : 'Micrófono en pausa. Haz clic para dictar.'}
                </p>
                <p style={{ fontSize: '0.95rem', color: transcript ? 'var(--text-primary)' : 'var(--text-muted)', fontStyle: transcript ? 'normal' : 'italic', marginTop: '4px' }}>
                  {transcript || '"Quiero tocar un rock de tempo medio con buen groove de redoblante..."'}
                </p>
              </div>
            </div>

            {/* Botón de terminar dictado */}
            {isListening && (
              <button
                onClick={toggleListening}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                <Check size={16} />
                <span>Listo / Buscar</span>
              </button>
            )}
          </div>

          {/* Feedback de lo que entendió el análisis semántico */}
          {interpretedIntent && interpretedIntent.label && (
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem', color: 'var(--amber-light)' }}>
              ✨ <b>Criterio detectado:</b> {interpretedIntent.label}
            </div>
          )}

          {/* Gemini AI Thinking Indicator */}
          {isThinkingGemini && (
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--cyan)' }}>
              <Sparkles size={16} className="beat-pulse" />
              <span>Gemini AI está analizando tu técnica y tu repertorio...</span>
            </div>
          )}
        </div>

        {/* TARJETA DE RECOMENDACIÓN GEMINI COACH */}
        {geminiCoach && (
          <div className="glass-panel" style={{
            padding: '16px 20px',
            marginBottom: '22px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(245, 158, 11, 0.08) 100%)',
            border: '1px solid var(--cyan)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="var(--cyan)" />
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Recomendación de tu Drum Coach (Gemini AI)
              </h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.4', marginBottom: '12px' }}>
              "{geminiCoach.coachMessage}"
            </p>
            {geminiCoach.selectedSongId && (
              <button
                type="button"
                onClick={() => {
                  const song = songs.find(s => s.id === geminiCoach.selectedSongId);
                  if (song) {
                    onSelectSongDirectly(song);
                    onClose();
                  }
                }}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Play size={14} fill="#000" />
                <span>Tocar tema sugerido por Gemini</span>
              </button>
            )}
          </div>
        )}

        {/* LISTA RANKING: LO QUE MÁS TOCAS + LOS OTROS */}
        <div>
          {/* Top: Lo que más tocas */}
          {topPlayed.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Flame size={16} color="var(--amber)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--amber-light)' }}>
                  Lo que más tocas en tu repertorio
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {topPlayed.map(song => (
                  <div
                    key={song.id}
                    onClick={() => {
                      onSelectSongDirectly(song);
                      onClose();
                    }}
                    className="glass-panel"
                    style={{
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderColor: 'rgba(245, 158, 11, 0.3)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--amber)',
                        color: '#000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={16} fill="#000" style={{ marginLeft: '2px' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {song.title}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {song.artist} • <span className="mono">{song.bpm} BPM</span>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
                        🔥 {song.playCount || 10} prácticas
                      </span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem' }}>
                        {song.genre}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Otros temas del género */}
          {others.length > 0 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Music size={16} color="var(--text-muted)" />
                <h4 style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Otras opciones disponibles
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {others.map(song => (
                  <div
                    key={song.id}
                    onClick={() => {
                      onSelectSongDirectly(song);
                      onClose();
                    }}
                    className="glass-panel"
                    style={{
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Play size={14} fill="#fff" style={{ marginLeft: '1px' }} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {song.title}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {song.artist} • <span className="mono">{song.bpm} BPM</span>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                        {song.genre}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {all.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
              No se encontraron canciones para este criterio. ¡Prueba seleccionar otro género o dictar otro ritmo!
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

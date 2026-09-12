import React, { useState, useEffect } from 'react';
import { X, Sparkles, Video, Sliders, Check } from 'lucide-react';
import { extractYouTubeId, analyzeDrumlessTitle } from '../services/youtubeParser';
import { analyzeSongWithGemini } from '../services/geminiService';
import { SSD5_PRESETS } from '../data/initialCatalog';

export default function SongDetailModal({
  isOpen,
  onClose,
  onSave,
  songToEdit = null
}) {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    youtubeUrl: '',
    youtubeId: '',
    bpm: 120,
    timeSignature: '4/4',
    genre: 'Rock',
    difficulty: 3,
    mastery: 'learning',
    ssd5Preset: SSD5_PRESETS[0],
    notes: '',
    tags: []
  });

  const [tagInput, setTagInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (songToEdit) {
      setFormData({
        ...songToEdit,
        tags: songToEdit.tags || []
      });
    } else {
      setFormData({
        title: '',
        artist: '',
        youtubeUrl: '',
        youtubeId: '',
        bpm: 120,
        timeSignature: '4/4',
        genre: 'Rock',
        difficulty: 3,
        mastery: 'learning',
        ssd5Preset: SSD5_PRESETS[0],
        notes: '',
        tags: ['Drumless']
      });
    }
  }, [songToEdit, isOpen]);

  if (!isOpen) return null;

  // Acción de Autocompletado con Gemini AI
  const handleAutoAnalyze = async () => {
    const rawText = formData.youtubeUrl || formData.title;
    if (!rawText) return;

    setAnalyzing(true);
    const ytId = extractYouTubeId(rawText);

    try {
      const analysis = await analyzeSongWithGemini(rawText);
      setFormData(prev => ({
        ...prev,
        youtubeId: ytId || prev.youtubeId,
        title: analysis.title || prev.title,
        artist: analysis.artist || prev.artist,
        genre: analysis.genre || prev.genre,
        bpm: analysis.bpm || prev.bpm,
        timeSignature: analysis.timeSignature || prev.timeSignature,
        difficulty: analysis.difficulty || prev.difficulty,
        ssd5Preset: analysis.ssd5Preset || prev.ssd5Preset,
        notes: analysis.notes || prev.notes,
        tags: Array.from(new Set([...prev.tags, ...(analysis.tags || [])]))
      }));
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    const ytId = extractYouTubeId(url);
    setFormData(prev => ({
      ...prev,
      youtubeUrl: url,
      youtubeId: ytId || prev.youtubeId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    onSave({
      ...formData,
      id: songToEdit?.id || `song-${Date.now()}`,
      favorite: songToEdit?.favorite ?? false,
      sections: songToEdit?.sections || [
        { id: 'sec-1', name: 'Intro', time: 0 },
        { id: 'sec-2', name: 'Verso 1', time: 30 },
        { id: 'sec-3', name: 'Coro 1', time: 60 }
      ]
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(15px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {songToEdit ? 'Editar Canción Drumless' : 'Añadir Nueva Canción al Repertorio'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Pega un link de YouTube y usa el analizador para autocompletar el ritmo y preset.
            </p>
          </div>
          <button onClick={onClose} className="btn" style={{ padding: '8px', borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* YouTube Link / Video ID */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Link de YouTube o Video ID
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="https://www.youtube.com/watch?v=... o pega el título"
                value={formData.youtubeUrl}
                onChange={handleUrlChange}
              />
              <button
                type="button"
                onClick={handleAutoAnalyze}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%)',
                  border: '1px solid var(--amber)',
                  color: 'var(--amber-light)',
                  whiteSpace: 'nowrap',
                  fontWeight: 600
                }}
                title="Detectar Artista, Ritmo, BPM y Preset de SSD5"
              >
                <Sparkles size={16} />
                <span>{analyzing ? 'Analizando...' : 'Auto-Detectar'}</span>
              </button>
            </div>
          </div>

          {/* Título y Artista */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Título del Tema *
              </label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Ej. Everlong"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Artista / Banda
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Ej. Foo Fighters"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              />
            </div>
          </div>

          {/* BPM, Compás y Género */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.4fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                BPM (Tempo)
              </label>
              <input
                type="number"
                min="40"
                max="260"
                className="input-field mono"
                value={formData.bpm}
                onChange={(e) => setFormData({ ...formData, bpm: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Compás
              </label>
              <input
                type="text"
                className="input-field mono"
                placeholder="4/4, 6/8, etc."
                value={formData.timeSignature}
                onChange={(e) => setFormData({ ...formData, timeSignature: e.target.value })}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Género / Estilo
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Rock, Funk, Pop..."
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              />
            </div>
          </div>

          {/* Preset SSD5 para Logic Pro */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Preset Sugerido de Steven Slate Drums 5 (SSD5)
            </label>
            <select
              className="input-field"
              value={formData.ssd5Preset}
              onChange={(e) => setFormData({ ...formData, ssd5Preset: e.target.value })}
            >
              {SSD5_PRESETS.map((p, idx) => (
                <option key={idx} value={p} style={{ background: '#111', color: '#fff' }}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Dificultad */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Dificultad (1 a 5 baquetas)
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setFormData({ ...formData, difficulty: lvl })}
                  className="btn"
                  style={{
                    flex: 1,
                    background: formData.difficulty === lvl ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.05)',
                    borderColor: formData.difficulty === lvl ? 'var(--amber)' : 'var(--border-subtle)',
                    color: formData.difficulty === lvl ? 'var(--amber)' : 'var(--text-muted)'
                  }}
                >
                  🥢 {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Notas de Técnica */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Notas Técnicas de Batería (Ghost notes, fills, dinámicas)
            </label>
            <textarea
              className="input-field"
              rows="3"
              placeholder="Ej. Cuidado con el tempo en el fill del segundo verso. Abrir hi-hat en el estribillo."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={onClose} className="btn">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px' }}>
              <Check size={18} />
              <span>Guardar Canción</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

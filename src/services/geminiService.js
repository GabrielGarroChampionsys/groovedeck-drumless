// Servicio de Integración con Google Gemini AI para GrooveDeck Pro
import { analyzeDrumlessTitle } from './youtubeParser';
import { SSD5_PRESETS } from '../data/initialCatalog';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

/**
 * Analiza un video drumless con la IA de Google Gemini para extraer metadatos de batería de alta precisión
 */
export async function analyzeSongWithGemini(rawInput) {
  if (!rawInput) return analyzeDrumlessTitle(rawInput);

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const prompt = `Actúa como un baterista profesional y productor musical experto en Steven Slate Drums 5 (SSD5) y baterías electrónicas como la Donner DED-200 Max.
Analiza la siguiente pista o canción drumless:
"${rawInput}"

Devuelve EXCLUSIVAMENTE un JSON válido (sin formato markdown adicional, sin bloques de código) con la siguiente estructura:
{
  "title": "Nombre limpio de la canción",
  "artist": "Nombre del artista o banda",
  "genre": "Género musical principal (Rock, Funk, Pop, Metal, Grunge, Shuffle, etc.)",
  "bpm": 120,
  "timeSignature": "4/4",
  "difficulty": 3,
  "ssd5Preset": "Uno de estos presets: [${SSD5_PRESETS.join(', ')}]",
  "notes": "Consejo técnico clave para tocarla en batería (dinámica, ghost notes, hi-hat, acentos)",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "suggestedSections": [
    { "name": "Intro", "time": 0 },
    { "name": "Verso 1", "time": 25 },
    { "name": "Coro 1", "time": 60 }
  ]
}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800
        }
      })
    });

    if (!response.ok) {
      console.warn('Gemini API returned status:', response.status);
      return analyzeDrumlessTitle(rawInput);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return analyzeDrumlessTitle(rawInput);
    }

    // Limpiar posibles bloques ```json ... ```
    const cleanedJson = candidateText
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim();

    const parsed = JSON.parse(cleanedJson);
    return {
      title: parsed.title || 'Pista Drumless',
      artist: parsed.artist || 'Artista',
      genre: parsed.genre || 'Rock',
      bpm: Number(parsed.bpm) || 120,
      timeSignature: parsed.timeSignature || '4/4',
      difficulty: Math.min(5, Math.max(1, Number(parsed.difficulty) || 3)),
      ssd5Preset: parsed.ssd5Preset || SSD5_PRESETS[0],
      notes: parsed.notes || '',
      tags: Array.isArray(parsed.tags) ? parsed.tags : ['Drumless'],
      sections: parsed.suggestedSections || []
    };
  } catch (err) {
    console.warn('Error llamando a Gemini API, usando fallback heurístico:', err);
    return analyzeDrumlessTitle(rawInput);
  }
}

/**
 * Consulta al Drum DJ impulsado por Gemini para recomendar temas del catálogo según el dictado del usuario
 */
export async function askDrumDJWithGemini(userDictation, availableSongs = []) {
  if (!userDictation || !userDictation.trim()) return null;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const catalogSummary = availableSongs.map(s => ({
    id: s.id,
    title: s.title,
    artist: s.artist,
    genre: s.genre,
    bpm: s.bpm,
    difficulty: s.difficulty,
    favorite: s.favorite
  }));

  const prompt = `Actúa como un profesor de batería personal motivador.
El alumno baterista te dice lo siguiente por micrófono:
"${userDictation}"

Este es su catálogo actual de canciones disponibles en GrooveDeck:
${JSON.stringify(catalogSummary, null, 2)}

Selecciona la MEJOR canción de su catálogo que coincida con lo que tiene ganas de tocar o practicar.
Responde EXCLUSIVAMENTE con un JSON válido (sin bloques de código markdown) con esta estructura:
{
  "selectedSongId": "id-de-la-cancion",
  "coachMessage": "Mensaje corto y motivador (máximo 2 líneas) explicándole por qué elegiste esta canción para su práctica."
}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 400
        }
      })
    });

    if (!response.ok) return null;
    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) return null;

    const cleanedJson = candidateText.replace(/```json/gi, '').replace(/```/gi, '').trim();
    return JSON.parse(cleanedJson);
  } catch (e) {
    console.warn('Error en askDrumDJWithGemini:', e);
    return null;
  }
}

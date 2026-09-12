// Extractor y clasificador inteligente de pistas drumless de YouTube

/**
 * Extrae el YouTube Video ID desde URLs variadas o texto con ID
 */
export function extractYouTubeId(urlOrId) {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // Si ya es un ID simple de 11 caracteres
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Patrones comunes de URL de YouTube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = trimmed.match(regExp);

  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Analizador heurístico inteligente:
 * Deduce artista, título, género, BPM estimado, dificultad y preset de SSD5
 */
export function analyzeDrumlessTitle(rawInput) {
  const result = {
    title: '',
    artist: '',
    genre: 'Rock',
    bpm: 120,
    timeSignature: '4/4',
    difficulty: 3,
    ssd5Preset: 'SSD5 Rock Vintage Kit (Punchy Maple)',
    tags: ['Drumless', 'Práctica'],
    notes: ''
  };

  let clean = rawInput
    .replace(/https?:\/\/\S+/g, '') // Quitar links
    .replace(/\[.*?\]/g, '')        // Quitar corchetes [Drumless Track]
    .replace(/\(.*?\)/g, (match) => {
      // Guardar info si dice BPM adentro
      const bpmMatch = match.match(/(\d{2,3})\s*bpm/i);
      if (bpmMatch) result.bpm = parseInt(bpmMatch[1], 10);
      return '';
    })
    .replace(/drumless|minus drums|no drums|drum playalong|drum play-along|backing track|isolated/gi, '')
    .trim();

  // Buscar BPM en texto si no se encontró antes
  const bpmMatch = rawInput.match(/(\d{2,3})\s*bpm/i);
  if (bpmMatch) {
    result.bpm = parseInt(bpmMatch[1], 10);
  }

  // Separar artista y título por " - "
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    result.artist = parts[0].trim();
    result.title = parts.slice(1).join(' - ').trim();
  } else if (clean.includes(':')) {
    const parts = clean.split(':');
    result.artist = parts[0].trim();
    result.title = parts.slice(1).join(':').trim();
  } else {
    result.title = clean || 'Canción Drumless';
    result.artist = 'Artista';
  }

  const combinedText = (rawInput + ' ' + result.artist + ' ' + result.title).toLowerCase();

  // Inferencia inteligente de género, preset de SSD5 y dificultad
  if (combinedText.match(/funk|soul|james brown|stevie wonder|vulfpeck|earth wind|groove/)) {
    result.genre = 'Funk / Soul';
    result.ssd5Preset = 'SSD5 70s Tight Funk (Snare seca + punch)';
    result.tags.push('Funk', 'Groove', 'Síncopa');
    result.notes = 'Enfocarse en la solidez del hi-hat y los acentos del bombo con síncopa.';
    result.difficulty = 3;
    if (!bpmMatch) result.bpm = 104;
  } else if (combinedText.match(/metal|iron maiden|metallica|slipknot|avenged|pantera|double bass/)) {
    result.genre = 'Heavy Metal';
    result.ssd5Preset = 'SSD5 Modern Metal Attack (Doble Bombo procesado)';
    result.tags.push('Metal', 'Doble Bombo', 'Velocidad', 'Fuerza');
    result.notes = 'Precisión en los golpes de bombo y potencia en los remates de caja.';
    result.difficulty = 4;
    if (!bpmMatch) result.bpm = 140;
  } else if (combinedText.match(/grunge|nirvana|soundgarden|pearl jam|alice in chains/)) {
    result.genre = 'Grunge / 90s Rock';
    result.ssd5Preset = 'SSD5 90s Grunge Heavy Oak (Big Room)';
    result.tags.push('Grunge', 'Rock', 'Dinámicas');
    result.difficulty = 3;
    if (!bpmMatch) result.bpm = 118;
  } else if (combinedText.match(/pop|michael jackson|bruno mars|dua lipa|weeknd|dance/)) {
    result.genre = 'Pop / Dance';
    result.ssd5Preset = 'SSD5 Studio Tight Pop (Dry & Direct)';
    result.tags.push('Pop', 'Tempo Constante', 'Backbeat');
    result.notes = 'Mantener el pulso perfecto cual máquina de ritmo. Cero aceleradas.';
    result.difficulty = 2;
    if (!bpmMatch) result.bpm = 116;
  } else if (combinedText.match(/jazz|bop|swing|miles davis|coltrane|shuffle|toto|porcaro/)) {
    result.genre = 'Jazz / Shuffle / Fusion';
    result.ssd5Preset = 'SSD5 Jeff Porcaro Custom Shuffle (Ghost Notes claras)';
    result.tags.push('Shuffle', 'Swing', 'Ghost Notes');
    result.notes = 'Sensibilidad en el rebote de la baqueta y dinámica baja en las notas fantasma.';
    result.difficulty = 5;
    if (!bpmMatch) result.bpm = 92;
  } else if (combinedText.match(/foo fighters|queen|ac\/dc|led zeppelin|rock|bonham|oasis/)) {
    result.genre = 'Classic / Hard Rock';
    result.ssd5Preset = 'SSD5 Rock Vintage Kit (Punchy Maple)';
    result.tags.push('Rock', 'Energía', 'Rimshots');
    result.notes = 'Tocar con rimshots sólidos en el redoblante y bombo con pegada definida.';
    result.difficulty = 3;
    if (!bpmMatch) result.bpm = 124;
  } else {
    result.genre = 'Rock / Modern';
    result.ssd5Preset = 'SSD5 Custom Gabriel Kit (Logic Default)';
    result.tags.push('Repertorio');
  }

  return result;
}

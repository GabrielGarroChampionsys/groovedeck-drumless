// Catálogo inicial con canciones drumless reales y datos enriquecidos para bateristas
export const INITIAL_SONGS = [
  {
    id: 'song-1',
    title: 'Everlong',
    artist: 'Foo Fighters',
    youtubeId: 'eBG7P-K-r1Y', // Foo Fighters - Everlong
    youtubeUrl: 'https://www.youtube.com/watch?v=eBG7P-K-r1Y',
    genre: 'Rock / Alternative',
    bpm: 158,
    timeSignature: '4/4',
    difficulty: 4, // 1 a 5 baquetas
    mastery: 'learning', // 'learning' | 'practicing' | 'mastered'
    favorite: true,
    playCount: 15,
    lastPracticed: '2026-09-11T19:00:00Z',
    ssd5Preset: 'SSD5 Rock Vintage Kit (Dave Grohl Punchy Snare)',
    notes: 'Hi-hat constante a semicorcheas rápidas con una sola mano. Mantener la muñeca relajada para no cansarse en los versos.',
    sections: [
      { id: 'sec-1', name: 'Intro', time: 0 },
      { id: 'sec-2', name: 'Verso 1', time: 26 },
      { id: 'sec-3', name: 'Pre-Coro', time: 58 },
      { id: 'sec-4', name: 'Coro 1', time: 73 },
      { id: 'sec-5', name: 'Verso 2', time: 104 },
      { id: 'sec-6', name: 'Coro 2', time: 152 },
      { id: 'sec-7', name: 'Bridge / Build', time: 183 },
      { id: 'sec-8', name: 'Outro Fill', time: 220 }
    ],
    loopA: 58,
    loopB: 88,
    tags: ['Rock', 'Energía', 'Resistencia', 'Semicorcheas']
  },
  {
    id: 'song-2',
    title: 'Superstition',
    artist: 'Stevie Wonder',
    youtubeId: 'ftdZ363R9kQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=ftdZ363R9kQ',
    genre: 'Funk / Soul',
    bpm: 100,
    timeSignature: '4/4',
    difficulty: 3,
    mastery: 'practicing',
    favorite: true,
    playCount: 11,
    ssd5Preset: 'SSD5 70s Tight Funk (Snare seca + Bombo afinado bajo)',
    notes: 'El groove del clavinet manda. Marcar el bombo sincopado en los tiempos débiles con precisión milimétrica.',
    sections: [
      { id: 'sec-1', name: 'Drum Intro', time: 0 },
      { id: 'sec-2', name: 'Clavinet Groove', time: 9 },
      { id: 'sec-3', name: 'Verso 1', time: 27 },
      { id: 'sec-4', name: 'Coro ("When you believe...")', time: 64 },
      { id: 'sec-5', name: 'Horns Section', time: 99 }
    ],
    loopA: 0,
    loopB: 27,
    tags: ['Funk', 'Groove', 'Síncopa', 'Hi-Hat abierto']
  },
  {
    id: 'song-3',
    title: 'Californication',
    artist: 'Red Hot Chili Peppers',
    youtubeId: 'YlUKcNNmywk',
    youtubeUrl: 'https://www.youtube.com/watch?v=YlUKcNNmywk',
    genre: 'Alternative Rock',
    bpm: 96,
    timeSignature: '4/4',
    difficulty: 2,
    mastery: 'mastered',
    favorite: false,
    playCount: 22,
    ssd5Preset: 'SSD5 Chad Smith Signature / Modern Warm Rock',
    notes: 'Ideal para calentar y asentar el tempo. Chad Smith toca con golpes secos y consistentes en el centro del redoblante.',
    sections: [
      { id: 'sec-1', name: 'Intro', time: 0 },
      { id: 'sec-2', name: 'Verso 1', time: 18 },
      { id: 'sec-3', name: 'Coro', time: 54 },
      { id: 'sec-4', name: 'Solo de Guitarra', time: 172 },
      { id: 'sec-5', name: 'Outro', time: 270 }
    ],
    loopA: null,
    loopB: null,
    tags: ['Calentamiento', 'Rock', 'Tempo Medio', 'Básico']
  },
  {
    id: 'song-4',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    youtubeId: 'hTWKbfoikeg',
    youtubeUrl: 'https://www.youtube.com/watch?v=hTWKbfoikeg',
    genre: 'Grunge / Rock',
    bpm: 117,
    timeSignature: '4/4',
    difficulty: 3,
    mastery: 'practicing',
    favorite: true,
    playCount: 8,
    ssd5Preset: 'SSD5 90s Grunge Heavy Oak (Room Reverb alta)',
    notes: 'El fill de entrada icónico (flam + toms). En el verso usar solo cross-stick o hi-hat suave, y en el coro explotar en el crash.',
    sections: [
      { id: 'sec-1', name: 'Riff Intro', time: 0 },
      { id: 'sec-2', name: 'Drum Entry Fill', time: 8 },
      { id: 'sec-3', name: 'Verso 1 (Dinámica suave)', time: 24 },
      { id: 'sec-4', name: 'Pre-Coro (Build)', time: 50 },
      { id: 'sec-5', name: 'Coro (Crash wash)', time: 64 }
    ],
    loopA: 8,
    loopB: 24,
    tags: ['Grunge', 'Fills', 'Dinámicas', 'Rock']
  },
  {
    id: 'song-5',
    title: 'Rosanna',
    artist: 'Toto',
    youtubeId: 'qmOLtTGvsbM',
    youtubeUrl: 'https://www.youtube.com/watch?v=qmOLtTGvsbM',
    genre: 'Classic Rock / Fusion',
    bpm: 86,
    timeSignature: '4/4 (Half-Time Shuffle)',
    difficulty: 5,
    mastery: 'learning',
    favorite: true,
    playCount: 26,
    ssd5Preset: 'SSD5 Jeff Porcaro Custom Shuffle (Snare con ghost notes claras)',
    notes: 'El legendario Porcaro Shuffle. Ghost notes imperceptibles en el snare entre los pulsos del hi-hat en tresillos.',
    sections: [
      { id: 'sec-1', name: 'Half-Time Shuffle Intro', time: 0 },
      { id: 'sec-2', name: 'Verso 1', time: 20 },
      { id: 'sec-3', name: 'Pre-Coro', time: 54 },
      { id: 'sec-4', name: 'Coro', time: 76 }
    ],
    loopA: 0,
    loopB: 20,
    tags: ['Shuffle', 'Ghost Notes', 'Avanzado', 'Técnica']
  },
  {
    id: 'song-6',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    youtubeId: 'Zi_XLOBDo_Y',
    youtubeUrl: 'https://www.youtube.com/watch?v=Zi_XLOBDo_Y',
    genre: 'Pop / Dance',
    bpm: 117,
    timeSignature: '4/4',
    difficulty: 2,
    mastery: 'mastered',
    favorite: false,
    playCount: 19,
    ssd5Preset: 'SSD5 Studio Tight Pop (Leon Ndugu Chancler sound)',
    notes: 'El patrón más famoso de la historia: 4 en el bombo con backbeat en 2 y 4. Clave: cero variaciones, precisión de máquina de ritmo.',
    sections: [
      { id: 'sec-1', name: 'Drum Beat Intro', time: 0 },
      { id: 'sec-2', name: 'Bassline joins', time: 10 },
      { id: 'sec-3', name: 'Verso 1', time: 28 },
      { id: 'sec-4', name: 'Coro', time: 75 }
    ],
    loopA: null,
    loopB: null,
    tags: ['Pop', 'Metrónomo humano', 'Groove', 'Principiante']
  }
];

// Presets comunes de SSD5 para recomendación rápida
export const SSD5_PRESETS = [
  'SSD5 Rock Vintage Kit (Punchy Maple)',
  'SSD5 70s Tight Funk (Snare seca + punch)',
  'SSD5 Chad Smith Signature / Modern Warm Rock',
  'SSD5 90s Grunge Heavy Oak (Big Room)',
  'SSD5 Jeff Porcaro Custom Shuffle (Ghost Notes claras)',
  'SSD5 Studio Tight Pop (Dry & Direct)',
  'SSD5 Modern Metal Attack (Doble Bombo procesado)',
  'SSD5 Jazz Bebop Bop-Kit (Afinación alta)',
  'SSD5 Custom Gabriel Kit (Logic Default)'
];

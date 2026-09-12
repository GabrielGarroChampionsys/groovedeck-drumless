// Servicio de Comandos y Asistente de Voz para Bateristas ("Drum DJ")
// Modo Dictado Continuo: no se corta hasta que el usuario vuelva a presionar el micrófono

export class DrumVoiceAssistant {
  constructor(onTranscriptUpdate, onFinalResult, onErrorCallback) {
    this.recognition = null;
    this.isListening = false;
    this.accumulatedTranscript = '';
    this.onTranscriptUpdate = onTranscriptUpdate;
    this.onFinalResult = onFinalResult;
    this.onError = onErrorCallback;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;       // NO SE CORTA
      this.recognition.interimResults = true;    // Muestra lo que vas diciendo en tiempo real
      this.recognition.lang = 'es-ES';

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onend = () => {
        // Si el usuario no presionó stop conscientemente, reiniciar para mantenerlo continuo
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch {
            // ignore
          }
        }
      };

      this.recognition.onerror = (event) => {
        if (event.error === 'no-speech') return; // Silencio temporal no es error
        console.warn('SpeechRecognition error:', event.error);
        if (this.onError) this.onError(event.error);
      };

      this.recognition.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalText += event.results[i][0].transcript + ' ';
          } else {
            interimText += event.results[i][0].transcript;
          }
        }

        if (finalText) {
          this.accumulatedTranscript += finalText;
        }

        const fullText = (this.accumulatedTranscript + interimText).trim();
        if (this.onTranscriptUpdate) {
          this.onTranscriptUpdate(fullText);
        }
      };
    }
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  start() {
    if (!this.isSupported()) {
      if (this.onError) this.onError('not-supported');
      return false;
    }
    this.accumulatedTranscript = '';
    this.isListening = true;
    try {
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Error starting speech recognition:', e);
      return false;
    }
  }

  stopAndAnalyze() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    const fullText = this.accumulatedTranscript.trim();
    const intent = this.interpretDrummerIntent(fullText);
    if (this.onFinalResult) {
      this.onFinalResult({
        rawTranscript: fullText,
        intent
      });
    }
    return intent;
  }

  cancel() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.accumulatedTranscript = '';
  }

  /**
   * Intérprete semántico de lenguaje natural amplio para bateristas
   */
  interpretDrummerIntent(text) {
    if (!text || !text.trim()) {
      return { type: 'NONE', label: 'Sin texto detectado' };
    }

    const lower = text.toLowerCase();

    // 1. Controles directos de un solo comando (si la frase es corta)
    if (text.split(' ').length <= 4) {
      if (lower.match(/\b(play|reproducir|tocar|dale|arranca)\b/)) return { type: 'PLAY', action: 'play' };
      if (lower.match(/\b(pausa|pausar|para|parar|stop|detener)\b/)) return { type: 'PAUSE', action: 'pause' };
      if (lower.match(/\b(pantalla completa|fullscreen|modo escenario|stage mode|modo tv)\b/)) return { type: 'TOGGLE_FULLSCREEN', action: 'fullscreen' };
      if (lower.match(/\b(loop|bucle|repetir)\b/)) return { type: 'TOGGLE_LOOP', action: 'loop' };
    }

    // 2. Extracción de entidades ricas en frases largas / dictado
    const extracted = {
      type: 'SMART_RECOMMENDATION',
      genres: [],
      tempoPreference: null, // 'slow' | 'fast' | 'medium'
      difficultyPreference: null, // 'easy' | 'hard'
      keywords: [],
      raw: text,
      label: ''
    };

    // Géneros
    if (lower.match(/\b(rock|hard rock|grunge|alternativo|punk)\b/)) extracted.genres.push('rock');
    if (lower.match(/\b(funk|groove|síncopa|sincopa|soul|disco)\b/)) extracted.genres.push('funk');
    if (lower.match(/\b(pop|dance|comercial)\b/)) extracted.genres.push('pop');
    if (lower.match(/\b(metal|heavy|doble bombo)\b/)) extracted.genres.push('metal');
    if (lower.match(/\b(jazz|shuffle|swing|fusion|porcaro)\b/)) extracted.genres.push('shuffle', 'jazz');

    // Tempo / Velocidad
    if (lower.match(/\b(lento|tranquilo|despacio|calentar|calentamiento|relajado|balada)\b/)) {
      extracted.tempoPreference = 'slow';
    } else if (lower.match(/\b(rápido|rapido|velocidad|arriba|enérgico|energico|fuerte|power)\b/)) {
      extracted.tempoPreference = 'fast';
    } else if (lower.match(/\b(medio|moderado|estándar|tranqui)\b/)) {
      extracted.tempoPreference = 'medium';
    }

    // Dificultad
    if (lower.match(/\b(fácil|facil|sencillo|básico|basico|para arrancar|principiante)\b/)) {
      extracted.difficultyPreference = 'easy';
    } else if (lower.match(/\b(difícil|dificil|complejo|desafío|desafio|técnico|tecnico|independencia)\b/)) {
      extracted.difficultyPreference = 'hard';
    }

    // Artistas específicos mencionados
    const potentialArtists = ['foo fighters', 'stevie wonder', 'red hot', 'chili peppers', 'nirvana', 'toto', 'michael jackson', 'queen', 'ac/dc', 'metallica', 'led zeppelin', 'blink 182'];
    for (const art of potentialArtists) {
      if (lower.includes(art)) {
        extracted.keywords.push(art);
      }
    }

    // Etiqueta amigable de lo que entendió
    const summaryParts = [];
    if (extracted.genres.length > 0) summaryParts.push(`Género: ${extracted.genres.join(', ').toUpperCase()}`);
    if (extracted.tempoPreference) summaryParts.push(`Tempo: ${extracted.tempoPreference === 'slow' ? 'Tranquilo (<105 BPM)' : extracted.tempoPreference === 'fast' ? 'Rápido (>125 BPM)' : 'Medio'}`);
    if (extracted.difficultyPreference) summaryParts.push(`Dificultad: ${extracted.difficultyPreference === 'easy' ? 'Accesible' : 'Exigente'}`);
    if (extracted.keywords.length > 0) summaryParts.push(`Artista: ${extracted.keywords.join(', ')}`);

    extracted.label = summaryParts.length > 0 ? summaryParts.join(' • ') : `Contexto: "${text.slice(0, 45)}..."`;

    return extracted;
  }
}

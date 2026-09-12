# 🥁 GROOVEDECK (DrumFlow AI)
### Drummer's Cockpit & Drumless Repertoire Hub

Aplicación web diseñada específicamente para bateristas de batería electrónica (**Donner DED-200 Max** conectada a **MacBook con Logic Pro y Steven Slate Drums 5 - SSD5**) para practicar sobre pistas *drumless* de YouTube sin fricción.

---

## 🚀 Estado Actual de la Aplicación

La aplicación ya está completamente construida y corriendo localmente en:
👉 **`http://localhost:5173/`**

### Tecnologías & Stack:
- **Core:** React 19 + Vite 8
- **Estilos:** Vanilla CSS con Sistema de Diseño **Apple Pro Audio Glassmorphism** (`src/index.css`)
- **Iconos:** Lucide-React
- **Audio/Video:** YouTube IFrame Player API oficial
- **Voz / Manos Libres:** Web Speech API nativa con dictado continuo ininterrumpido
- **Seguridad & Acceso:** Autenticación con Google y lista blanca estricta exclusiva para `gabriel.alejandro.garro@gmail.com`
- **Persistencia:** LocalStorage estructurado con importación/exportación JSON (`src/services/storage.js`)

---

## 🎯 Funcionalidades Implementadas

0. **Seguridad y Acceso Privado Exclusivo (`LoginGate.jsx` & `auth.js`):**
   - Sistema de bloqueo inicial donde solo el correo `gabriel.alejandro.garro@gmail.com` puede ingresar.
   - Cualquier otra cuenta que intente registrarse o entrar es rechazada de inmediato.
   - En el futuro, este módulo se puede expandir para aceptar pagos o suscripciones con Stripe / LemonSqueezy.

1. **YouTube Player Cockpit Ergonómico (`PlayerCockpit.jsx`):**
   - Integración oficial de YouTube IFrame API sin anuncios intermedios molestos.
   - **A-B Precision Looper:** Marcadores `Set A` y `Set B` para repetir compases difíciles, fills o solos en bucle continuo.
   - **Count-in / Lead-in de 4 Tiempos:** Conteo visual (1 - 2 - 3 - 4) antes de que empiece la canción o el loop para posicionar las baquetas.
   - **Variador de Velocidad sin cambio de tono:** `0.75x`, `0.85x`, `1.0x`, `1.1x` con un solo toque.
   - **Marcadores de Estructura:** Salto instantáneo a *Intro, Verso, Coro, Fill, Solo*.

2. **Asistente de Voz y Reconocimiento Manos Libres "Drum DJ" (`VoiceAssistantModal.jsx` & `voiceCommander.js`):**
   - Atajo de teclado directo con tecla `V` o botón dedicado.
   - Permite decir:
     - *"Quiero un rock con energía"*
     - *"Ponme un funk bailable con síncopa"*
     - *"Algo para calentar"* (tempo lento < 100 BPM)
     - *"Play"*, *"Pausa"*, *"Pantalla completa"*
     - *"Pon Everlong"*, *"Pon Nirvana"*
   - Si no se usa el micrófono, incluye píldoras interactivas de Moods rítmicos.

3. **Auto-Detección y Clasificador Inteligente de Pistas (`youtubeParser.js` & `SongDetailModal.jsx`):**
   - Al pegar una URL de YouTube, el analizador extrae el ID y deduce automáticamente: Artista, Título limpio, Género, BPM sugerido, Compás, Nivel de dificultad y **Preset recomendado de SSD5**.

4. **Modo Escenario / TV Pantalla Completa (`StageModeView.jsx`):**
   - Atajo tecla `F` o botón TV.
   - Optimizado para verse nítido a 2-3 metros de distancia (conectado a una TV por HDMI o AirPlay mientras estás en la batería).
   - Metrónomo visual gigante titilando al compás, video expandido y notas técnicas visibles sin forzar la vista.

5. **Hub de Integración con Logic Pro & SSD5:**
   - Registro visible del Preset de SSD5 para cada pista (ej. *SSD5 Rock Vintage Kit, Chad Smith Signature, 70s Tight Funk*).
   - Cuaderno de notas técnicas por tema (ghost notes, dinámicas, baquetas).
   - Estado de maestría: 🟢 *Dominada*, 🟡 *En práctica*, ⚪ *Por aprender*.

6. **Atajos de Teclado Stick-Friendly (fáciles de tocar con la baqueta):**
   - `Espacio`: Play / Pausa
   - `[`: Marcar A (inicio de loop)
   - `]`: Marcar B (fin de loop)
   - `L`: Alternar Looper
   - `←` / `→`: Saltar 5 segundos atrás o adelante
   - `V`: Activar Drum DJ (asistente de voz)
   - `F`: Pantalla completa / Modo TV
   - `Esc`: Salir de pantalla completa

---

## 📂 Arquitectura de Archivos

```
Drumless Songs/
├── index.html
├── package.json
├── vite.config.js
├── CLAUDE.md                      <-- Este archivo y super prompt
├── src/
│   ├── main.jsx                   <-- Punto de entrada React
│   ├── index.css                  <-- Sistema de diseño Apple Pro Audio Glassmorphism
│   ├── App.jsx                    <-- Coordinador de estado global y comandos
│   ├── components/
│   │   ├── Navbar.jsx             <-- Header, búsqueda, Drum DJ trigger, modo TV
│   │   ├── PlayerCockpit.jsx      <-- Reproductor YouTube, A-B looper, variador, atajos
│   │   ├── SongLibrary.jsx        <-- Galería con mood pills, tarjetas y dificultad
│   │   ├── SongDetailModal.jsx    <-- Carga y auto-detección inteligente de canciones
│   │   ├── VoiceAssistantModal.jsx<-- Modal de escucha manos libres del Drum DJ
│   │   ├── StageModeView.jsx      <-- Vista TV / Pantalla completa de alta distancia
│   │   └── MetronomeBeat.jsx      <-- Pulso visual de BPM y 4-count in
│   ├── services/
│   │   ├── youtubeParser.js       <-- Extractor de video y analizador heurístico de ritmo
│   │   ├── voiceCommander.js      <-- Web Speech API y motor semántico de intents
│   │   └── storage.js             <-- Persistencia en LocalStorage y exportación JSON
│   └── data/
│       └── initialCatalog.js      <-- Catálogo inicial con canciones drumless reales
```

---

## 🤖 SUPER PROMPT PARA CLAUDE CODE (A las 18:20)

> **Instrucciones para el usuario:** Cuando sean las 18:20 y se renueven tus créditos, abre Claude Code en esta carpeta (`/Users/gabrielgarro/Documents/Antigravity/Apliaciones creadas/Drumless Songs`) y copia/pega el siguiente prompt:

```text
Hola Claude. Estoy desarrollando GrooveDeck, una aplicación web de alto nivel (diseño Apple Pro Audio, dark mode glassmorphism) para bateristas que practican con batería electrónica (tengo una Donner DED-200 Max conectada por USB a mi MacBook usando Logic Pro y Steven Slate Drums 5 - SSD5).

El proyecto ya cuenta con una base funcional completa construida con React + Vite + Vanilla CSS, corriendo actualmente en http://localhost:5173/. Toda la arquitectura está documentada en CLAUDE.md.

Revisa los archivos del proyecto (App.jsx, PlayerCockpit.jsx, StageModeView.jsx, index.css, services/):

1. AUDITORÍA UX/UI Y REFINAMIENTO ESTÉTICO:
   - Como usuario enfocado profundamente en la estética de Apple (macOS/visionOS), revisa que la experiencia visual sea impecable: micro-animaciones, contrastes, legibilidad a 2 metros de distancia (desde el banquito de la batería), espaciados y sensación de producto premium.
   - Propón o implementa mejoras visuales o funcionales donde veas oportunidades para llevarla a un nivel superior.

2. POSIBLES EXPANSIONES TÉCNICAS A EVALUAR:
   - Integración con Web MIDI API: ¿Podríamos escuchar mensajes MIDI de la Donner DED-200 Max para que al golpear un borde de tom o presionar un pad secundario actúe como pedal de Play/Pause o marcaje de Loop sin tocar la laptop ni el teclado?
   - Detección de BPM en tiempo real o tap tempo interactivo con la baqueta en una tecla.
   - Separación o integración de audio adicional si lo ves viable.

Examina el código existente, dime qué te parece la base actual y propón el siguiente salto de calidad.
```

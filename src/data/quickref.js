export const QUICKREF_CARDS = [
  {
    id: 'session',
    title: 'Session: Bank / Pattern',
    color: '#E8750A',
    items: [
      { label: 'Selectionner bank', keys: ['BANK + VBx'] },
      { label: 'Sauvegarder bank', keys: ['CTRL + BANK + VBx'] },
      { label: 'Selectionner pattern', keys: ['PATTERN + VBx'] },
      { label: 'Selection silencieuse', keys: ['CTRL + PATTERN + VBx'], note: 'sans interruption' },
    ],
  },
  {
    id: 'edit',
    title: 'Edition: Copy / Clear',
    color: '#5BA3C9',
    items: [
      { label: 'Copier track', keys: ['Hold CTRL + COPY', 'src -> dst'] },
      { label: 'Copier pattern', keys: ['Hold CTRL + COPY + PATTERN', 'src -> dst'] },
      { label: 'Effacer track', keys: ['CLEAR + VBx'] },
      { label: 'Effacer pattern', keys: ['CLEAR + PATTERN + VBx'] },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Live',
    color: '#E09930',
    items: [
      { label: 'Mute prepare (release)', keys: ['Hold MUTE + VBx'] },
      { label: 'Quick mute immediat', keys: ['CTRL + MUTE + VBx'] },
      { label: 'Variation temporaire', keys: ['Hold TEMP + Turn Knob'] },
      { label: 'Variation relative pattern', keys: ['Hold TEMP + PATTERN + Turn Knob'] },
    ],
  },
  {
    id: 'transport',
    title: 'Transport & Securite',
    color: '#3DAA6A',
    items: [
      { label: 'Demarrer / arreter', keys: ['PLAY'] },
      { label: 'Play isole', keys: ['CTRL + PLAY'], note: 'sans transport externe' },
      { label: 'Panic MIDI', keys: ['CLEAR + PLAY'], note: 'coupe les notes bloquees' },
      { label: 'Retour home', keys: ['BANK'] },
    ],
  },
  {
    id: 'shape',
    title: 'Shape Rapide',
    color: '#5BA3C9',
    items: [
      { label: 'Longueur du pattern', keys: ['Turn STEPS'] },
      { label: 'Densite euclidienne', keys: ['Turn PULSES'] },
      { label: 'Nombre de cycles', keys: ['CTRL + Turn CYCLES'] },
      { label: 'Signature rythmique', keys: ['Turn DIVISION'] },
      { label: 'Note repeats', keys: ['Turn REPEATS'] },
    ],
  },
  {
    id: 'groove',
    title: 'Groove Rapide',
    color: '#9A72C4',
    items: [
      { label: 'Velocite de base', keys: ['Turn VELOCITY'] },
      { label: 'Longueur de note', keys: ['Turn SUSTAIN'] },
      { label: 'Micro-timing', keys: ['Turn TIMING'] },
      { label: 'Accent dynamique', keys: ['Turn ACCENT'] },
      { label: 'Ecart des repeats', keys: ['Turn TIME'] },
    ],
  },
  {
    id: 'tonal',
    title: 'Tonal Rapide',
    color: '#6AB870',
    items: [
      { label: 'Verrouiller vue clavier', keys: ['Double-press PITCH'] },
      { label: 'Variation harmonique', keys: ['CTRL + Turn HARMONY'] },
      { label: 'Choisir style de jeu', keys: ['CTRL + STYLE + VBx'] },
      { label: 'Etendue melodique', keys: ['Turn RANGE'] },
      { label: 'Changer la fondamentale', keys: ['CTRL + Turn ROOT'] },
    ],
  },
  {
    id: 'setup',
    title: 'Setup Essentiel',
    color: '#C49042',
    items: [
      { label: 'Tempo global', keys: ['Turn TEMPO'] },
      { label: 'Longueur de boucle track', keys: ['Turn LENGTH'] },
      { label: 'Canal MIDI de track', keys: ['Turn CHANNEL'] },
      { label: 'Random amount / rate', keys: ['Turn RANDOM', 'CTRL + Turn RATE'] },
    ],
  },
  {
    id: 'advanced',
    title: 'Fonctions Avancees Utiles',
    color: '#9A72C4',
    items: [
      { label: 'Entrer en vue cycles', keys: ['Hold CYCLES'] },
      { label: 'Editer un cycle', keys: ['CYCLES + VBx', 'Turn Parametre'] },
      { label: 'Hold step (latch)', keys: ['Hold VBx + tap CLEAR'] },
      { label: 'Octave -1 clavier', keys: ['CTRL + VB16'], note: 'en keyboard view' },
    ],
  },
]

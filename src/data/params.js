// Section color map
export const SECTIONS = {
  SHAPE:  { color: '#5BA3C9', label: 'SHAPE'  },
  GROOVE: { color: '#9A72C4', label: 'GROOVE' },
  TONAL:  { color: '#6AB870', label: 'TONAL'  },
  SETUP:  { color: '#C49042', label: 'SETUP'  },
}

// ─── KNOBS ─────────────────────────────────────────────────────────────────
// c = column (1-indexed within section), r = row (1 or 2)
export const KNOBS = [
  // ── SHAPE (7 knobs) ─────────────────────────────────────────────────────
  {
    id: 'STEPS', label: 'STEPS', secondary: null, section: 'SHAPE', c: 1, r: 1,
    description: 'Longueur du pattern (nombre de steps). En modifiant STEPS, les pulses euclidiens sont redistribués. Peut être étendu au-delà de 16 jusqu’à 64 steps sur 4 pages.',
    shortcuts: [
      { key: 'Turn', action: 'Modifier le nombre de steps (1–16)' },
      { key: 'Press & Turn STEPS', action: 'Modifier les steps en visualisant la page' },
      { key: 'Hold STEPS', action: 'Afficher la vue steps sur les VBs' },
      { key: 'Double-press STEPS', action: 'Verrouiller la vue steps' },
      { key: 'Hold CTRL + Turn STEPS', action: 'Étendre/réduire la longueur jusqu’à 64 steps' },
      { key: 'En vue STEPS: Hold STEPS + Press VBx', action: 'Fixer directement le dernier step actif' },
      { key: 'En vue STEPS: Hold CTRL + BANK/PATTERN/TEMP/MUTE', action: 'Naviguer pages 1–4 (1–64)' },
      { key: 'En vue STEPS: Press CLEAR', action: 'Retrigger step (reset de la séquence)' },
    ],
  },
  {
    id: 'PULSES', label: 'PULSES', secondary: 'ROTATE', section: 'SHAPE', c: 2, r: 1,
    description: 'Nombre de pulses euclidiens répartis dans les steps. Les pulses ajoutés manuellement en vue PULSES restent indépendants des edits euclidiens. ROTATE décale le point de départ du pattern.',
    shortcuts: [
      { key: 'Turn PULSES', action: 'Ajouter/retirer des pulses euclidiens' },
      { key: 'Press & Turn PULSES', action: 'Éditer les pulses en visualisant la page' },
      { key: 'Hold ou Double-press PULSES', action: 'Afficher/verrouiller la vue pulses' },
      { key: 'En vue pulses: Press VBx', action: 'Ajouter/retirer un pulse manuel' },
      { key: 'En vue pulses: CTRL + VBx', action: 'Entrer en per-step edit mode sur le step' },
      { key: 'En step edit pulses: Press BANK', action: 'Quitter le step edit mode' },
      { key: 'CTRL + Turn PULSES', action: 'ROTATE — décaler le pattern de départ' },
    ],
  },
  {
    id: 'CYCLES', label: 'CYCLES', secondary: null, section: 'SHAPE', c: 3, r: 1,
    description: 'Conteneurs de variations de paramètres qui se rejouent en séquence sur le pattern. Par défaut 4 cycles actifs, jusqu’à 16. Un cycle édité locke les valeurs de paramètres modifiées.',
    shortcuts: [
      { key: 'Hold ou Double-press CYCLES', action: 'Afficher/verrouiller la vue cycles' },
      { key: 'En vue cycles: Press VBx', action: 'Sélectionner cycle(s) à éditer' },
      { key: 'BANK rouge clignotant', action: 'Indique le cycle edit mode actif' },
      { key: 'Turn un paramètre (ex: PITCH/REPEATS)', action: 'Locker la valeur dans le cycle sélectionné' },
      { key: 'Press BANK', action: 'Quitter le cycle edit mode' },
      { key: 'CTRL + Turn CYCLES', action: 'Changer le nombre de cycles actifs' },
      { key: 'CTRL + CYCLES + VBx', action: 'Définir directement 1–16 cycles actifs' },
      { key: 'En vue cycles: CLEAR + VBx', action: 'Effacer les edits du cycle' },
    ],
  },
  {
    id: 'DIVISION', label: 'DIVISION', secondary: null, section: 'SHAPE', c: 4, r: 1,
    description: 'Valeur rythmique des steps (time signature de la track): options quadruplets et triplets via VBs. Possibilité de mode libre avec résolution 96 PPQN.',
    shortcuts: [
      { key: 'Turn DIVISION', action: 'Parcourir les divisions presets' },
      { key: 'Hold ou Double-press DIVISION', action: 'Afficher/verrouiller la vue divisions' },
      { key: 'Press & Turn DIVISION', action: 'Éditer la division tout en visualisant la page DIVISION' },
      { key: 'En vue division: Press VB1–VB7', action: 'Choisir un quadruplet (1/1 à 1/64)' },
      { key: 'En vue division: Press VB11–VB15', action: 'Choisir un triplet (1/3 à 1/48)' },
      { key: 'Hold DIVISION + Press VBx', action: 'Choisir directement une division depuis la vue' },
      { key: 'CTRL + Turn DIVISION', action: 'Division libre (96 PPQN)' },
    ],
  },
  {
    id: 'VELOCITY', label: 'VELOCITY', secondary: 'PROBABILITY', section: 'GROOVE', c: 1, r: 2,
    description: 'Vélocité de base des notes (1–127, défaut 100). PROBABILITY agit de façon aléatoire en bi-polaire: à gauche il coupe d’abord les pulses (et leurs repeats), à droite il coupe des notes individuelles (pulse ou repeat).',
    shortcuts: [
      { key: 'Turn', action: 'Modifier la vélocité de base' },
      { key: 'Hold / Double-press', action: 'Afficher/verrouiller la vue VELOCITY sur les VBs' },
      { key: '[CTRL] + Turn', action: 'PROBABILITY — régler la probabilité de silence (bi-polaire)' },
      { key: '[CTRL] + (PROBABILITY) + [VB9]-[VB11]', action: 'Coarse gauche: probabilité de couper les pulses (et repeats associés)' },
      { key: '[CTRL] + (PROBABILITY) + [VB13]-[VB15]', action: 'Coarse droite: probabilité de couper des notes (pulse ou repeat)' },
      { key: '[CTRL] + (PROBABILITY) + [VB1]-[VB7]', action: 'Fine tuning de la probabilité' },
      { key: '[CTRL] + (PROBABILITY) + [VB8]/[VB16]', action: 'Décaler la modulation phase' },
    ],
  },
  {
    id: 'SUSTAIN', label: 'SUSTAIN', secondary: null, section: 'GROOVE', c: 2, r: 2,
    description: 'Longueur des notes relative à DIVISION. S’applique aux pulses et repeats; un nouveau trigger coupe la note précédente.',
    shortcuts: [
      { key: 'Turn', action: 'Modifier la durée des notes' },
      { key: 'Hold / Double-press', action: 'Afficher/verrouiller la vue SUSTAIN sur les VBs' },
      { key: '[VB1]-[VB16] (dans la vue)', action: 'Choisir une longueur ciblée (VB8≈50%, VB16=100%)' },
      { key: 'Hold [VBx] + tap [CLEAR]', action: 'Mode Hold step (latch)' },
    ],
    notes: 'La longueur est appliquée aux notes et repeats; un nouveau trigger coupe la note précédente. Sustain 100% ≠ latch.',
  },
  {
    id: 'REPEATS', label: 'REPEATS', secondary: 'RAMP', section: 'SHAPE', c: 3, r: 2,
    description: 'Répétitions de note après chaque pulse. RAMP crée une rampe de vélocité sur les répétitions (montante ou descendante).',
    shortcuts: [
      { key: 'Turn', action: 'Modifier le nombre de répétitions' },
      { key: '[CTRL] + Turn', action: 'RAMP — rampe de vélocité sur les répétitions' },
      { key: 'En vue REPEATS: Press VB8', action: 'Choke des repeats sur nouveau pulse' },
      { key: 'En vue REPEATS: Press VB16', action: 'Tail: superposition des repeats' },
      { key: 'En vue REPEATS: Press CLEAR', action: 'Stop des repeats' },
    ],
  },

  // ── GROOVE (3 knobs) ────────────────────────────────────────────────────
  {
    id: 'TIME', label: 'TIME', secondary: 'PACE', section: 'GROOVE', c: 1, r: 1,
    description: 'Intervalle de temps entre les répétitions de note. PACE règle l\'accélération ou décélération du rythme des répétitions.',
    shortcuts: [
      { key: 'Turn', action: 'Modifier l\'intervalle de temps des répétitions' },
      { key: '[CTRL] + Turn', action: 'PACE — régler accélération / décélération' },
    ],
  },
  {
    id: 'ACCENT', label: 'ACCENT', secondary: 'GROOVE', section: 'GROOVE', c: 2, r: 1,
    description: 'ACCENT règle la quantité de variation appliquée à la vélocité de base (VELOCITY). GROOVE choisit la forme de variation (8 templates: presets + waves). Les deux fonctionnent ensemble.',
    shortcuts: [
      { key: 'Turn', action: 'Régler la quantité d’accent (variation de vélocité)' },
      { key: 'Hold / Double-press', action: 'Afficher/verrouiller la vue ACCENT' },
      { key: '[CTRL] + Turn', action: 'GROOVE — sélectionner le template' },
      { key: '[CTRL] + Press (GROOVE)', action: 'Afficher la vue GROOVE sur les VBs' },
      { key: '[VB1]-[VB7] (vue ACCENT)', action: 'Fine accent' },
      { key: '[VB9]-[VB15] (vue ACCENT)', action: 'Coarse accent bi-polaire' },
      { key: '[VB8]/[VB16] (vue ACCENT)', action: 'Groove tempo ÷2 / ×2' },
      { key: '[VB1]-[VB4] / [VB9]-[VB12] (vue GROOVE)', action: 'Presets / waves' },
    ],
  },
  {
    id: 'TIMING', label: 'TIMING', secondary: 'DELAY', section: 'GROOVE', c: 1, r: 2,
    description: 'TIMING décale certaines notes plus tôt ou plus tard (micro-timing) pour humaniser le groove. DELAY décale toutes les notes de la track en avance/retard selon des divisions de note.',
    shortcuts: [
      { key: 'Turn', action: 'Régler le micro-timing des notes ciblées' },
      { key: 'Press & Turn TIMING', action: 'Micro-timing itératif tout en visualisant la page' },
      { key: 'Hold / Double-press', action: 'Afficher/verrouiller la vue TIMING' },
      { key: '[VB9]-[VB11] / [VB13]-[VB15]', action: 'Coarse: tôt / tard' },
      { key: '[VB1]-[VB7]', action: 'Fine timing' },
      { key: '[VB4] + [VB12]', action: 'Aucun décalage (on-grid)' },
      { key: '[VB8] / [VB16]', action: 'Division de notes ciblées x2 / x4 (les deux allumés = x1)' },
      { key: '[CTRL] + Turn', action: 'DELAY — décalage global de la track' },
      { key: '[CTRL] + Press & Turn DELAY', action: 'Delay itératif avec visualisation' },
      { key: '[CTRL] + (DELAY) + [VB11|10|9]', action: 'Delay tôt: 1/16, 1/8, 1/4' },
      { key: '[CTRL] + (DELAY) + [VB13|14|15]', action: 'Delay tard: 1/16, 1/8, 1/4' },
    ],
  },

  // ── TONAL (4 knobs) ─────────────────────────────────────────────────────
  {
    id: 'PITCH', label: 'PITCH', secondary: 'HARMONY', section: 'TONAL', c: 1, r: 1,
    description: 'Transposition de pitch façon clavier dans la gamme active. HARMONY crée des variations d\'accord: chaque click déplace une note individuelle dans la scale.',
    shortcuts: [
      { key: 'Turn', action: 'Transposer par step dans la gamme' },
      { key: 'Double-press', action: 'Verrouiller la vue clavier (VBs)' },
      { key: 'Hold PITCH + VBx', action: 'Ajouter/retirer des notes dans le pitch menu' },
      { key: '[CTRL] + Turn', action: 'HARMONY — variation d\'accord (1 note / click)' },
      { key: '[CTRL] + [VB16] en keyboard view', action: 'Octave −1' },
    ],
    notes: 'Double-press (PITCH) verrouille la vue clavier. [CTRL]+[VB16] = −1 octave. Sans notes dans Pitch = rien ne joue avec VOICING.',
  },
  {
    id: 'VOICING', label: 'VOICING', secondary: 'STYLE', section: 'TONAL', c: 2, r: 1,
    description: 'Réordonne les notes définies dans PITCH sur les octaves. STYLE fixe l\'algorithme de lecture (Poly/Mono, Ramp/Climb/Up-Down) et influe directement sur le comportement mélodique.',
    shortcuts: [
      { key: 'Turn', action: 'Modifier l\'ordre des voix (bipolaire)' },
      { key: '[CTRL] + (STYLE) → [VBx]', action: 'Sélectionner le style de jeu' },
    ],
    details: [
      'VB1   PolyFixed', 'VB2   PolyRamp', 'VB3   PolyClimb', 'VB4   PolyUp/Down ✦',
      'VB5   PolyClimbUp/Down ✦', 'VB8   Direction UP', 'VB9   MonoFixed',
      'VB10  MonoRamp', 'VB11  MonoClimb', 'VB12  MonoUp/Down ✦',
      'VB13  MonoClimbUp/Down ✦', 'VB16  Direction DOWN',
    ],
    notes: '✦ Nouveaux styles en v2.1.0. VB8 = direction UP, VB16 = direction DOWN. Sans notes dans Pitch = rien ne joue.',
  },
  {
    id: 'RANGE', label: 'RANGE', secondary: 'PHRASE', section: 'TONAL', c: 1, r: 2,
    description: 'Contrôle l\'étendue et la vitesse de transformation des notes issues de PITCH. PHRASE choisit la forme mélodique parmi 8 templates (Cad 1–4, Saw, Triangle, Sine, Pulse).',
    shortcuts: [
      { key: 'Turn', action: 'Modifier la portée de modulation' },
      { key: '[CTRL] + Turn', action: 'PHRASE — sélectionner la forme (cadence/LFO)' },
      { key: '[CTRL] + PHRASE + [VBx]', action: 'Sélection directe du template phrase' },
    ],
    details: [
      'VB1   Cad 1', 'VB2   Cad 2', 'VB3   Cad 3', 'VB4   Cad 4',
      'VB9   Saw', 'VB10  Triangle', 'VB11  Sine', 'VB12  Pulse',
    ],
  },
  {
    id: 'SCALE', label: 'SCALE', secondary: 'ROOT', section: 'TONAL', c: 2, r: 2,
    description: 'Gamme utilisée par la track. ROOT définit la note fondamentale. 8 gammes prédéfinies + 1 gamme personnalisable (User).',
    shortcuts: [
      { key: 'Turn', action: 'Sélectionner la gamme' },
      { key: 'Hold SCALE + VBx', action: 'Sélection directe de la scale sur les VBs' },
      { key: '[CTRL] + Turn', action: 'ROOT — définir la note racine' },
    ],
    details: [
      'VB9   Chromatic', 'VB10  Major', 'VB11  Minor', 'VB12  Pentatonic',
      'VB13  Hirajoshi', 'VB14  Iwato', 'VB15  Tetratonic', 'VB16  User',
    ],
  },

  // ── SETUP (4 knobs) ─────────────────────────────────────────────────────
  {
    id: 'TEMPO', label: 'TEMPO', secondary: null, section: 'SETUP', c: 1, r: 1,
    description: 'BPM du clock interne (24–280, défaut 120). Le tempo agit sur tout le bank et est sauvegardé avec le bank.',
    shortcuts: [
      { key: 'Turn TEMPO', action: 'Modifier le BPM (1 BPM par cran)' },
      { key: 'Hold & Turn TEMPO', action: 'Ajustement fin avec visualisation directe' },
      { key: 'Hold / Double-press TEMPO', action: 'Afficher / verrouiller la vue tempo' },
      { key: 'Hold TEMPO + VBx', action: 'Saut rapide par paliers (24 → 280)' },
      { key: 'Hold TEMPO + VB6', action: 'Reset rapide sur 120 BPM' },
      { key: '[CTRL] + Turn', action: 'Régler la luminosité des LEDs' },
    ],
    notes: 'Si une clock externe prend la priorité (Analog > MIDI > Link), le tempo interne est ignoré.',
  },
  {
    id: 'LENGTH', label: 'LENGTH', secondary: 'QUANTIZE', section: 'SETUP', c: 2, r: 1,
    description: 'Réduit la longueur de boucle de la track. QUANTIZE (secondaire) règle la fenêtre de synchronisation pour le changement de pattern.',
    shortcuts: [
      { key: 'Turn LENGTH', action: 'Réduire la longueur de boucle de la track' },
      { key: 'Hold / Double-press LENGTH', action: 'Afficher / verrouiller la vue length' },
      { key: 'En vue LENGTH: [CLEAR]', action: 'Définir un random start (glitch)' },
      { key: 'En vue LENGTH: [CLEAR] + Turn LENGTH', action: 'Changer longueur + random start' },
      { key: '[CTRL] + Press QUANTIZE', action: 'Afficher la vue quantize' },
      { key: '[CTRL] + Turn QUANTIZE', action: 'Modifier le quantize du pattern' },
    ],
    notes: 'LENGTH est stocké au niveau track. QUANTIZE est stocké au niveau pattern.',
  },
  {
    id: 'CHANNEL', label: 'CHANNEL', secondary: 'OUTPUT', section: 'SETUP', c: 1, r: 2,
    description: 'Canal MIDI de la track (1–16). Plusieurs channels peuvent être sélectionnés sur une même track. OUTPUT route une track vers l’entrée d’une autre track.',
    shortcuts: [
      { key: 'Turn CHANNEL', action: 'Modifier le canal MIDI de la track' },
      { key: 'Press & Turn CHANNEL', action: 'Changer le canal en visualisant la page' },
      { key: 'Hold / Double-press CHANNEL', action: 'Afficher / verrouiller la vue channel' },
      { key: 'En vue CHANNEL: Press VBx', action: 'Sélectionner un ou plusieurs channels' },
      { key: '[CTRL] + CHANNEL + [VBx]', action: 'OUTPUT — router vers une autre track' },
    ],
    notes: 'Par défaut, Track N correspond à Channel N.',
  },
  {
    id: 'RANDOM', label: 'RANDOM', secondary: 'RATE', section: 'SETUP', c: 2, r: 2,
    description: 'Modulation aléatoire globale sur 16 pas. RANDOM règle la probabilité d’application (souvent perçue comme intensité d’évolution). RATE règle la division temporelle de la séquence random.',
    shortcuts: [
      { key: 'Turn RANDOM', action: 'Ajuster la probabilité globale de randomisation (0–100%)' },
      { key: 'Hold / Double-press RANDOM', action: 'Afficher / verrouiller la vue random' },
      { key: 'Hold RANDOM + Turn Knob', action: 'Appliquer un amount bi-polaire sur ce paramètre' },
      { key: 'Hold RANDOM + Press Knob + VBx', action: 'Régler finement l’amount du paramètre' },
      { key: 'Hold RANDOM + Press Knob + [VB8]/[VB16]', action: 'Décaler la phase de la séquence random' },
      { key: '[CTRL] + RANDOM + Turn Knob', action: 'Appliquer du slew (lissage) sur la lane random du paramètre' },
      { key: '[CTRL] + Turn RATE', action: 'Régler la division/vitesse de la séquence random' },
    ],
    notes: 'Le manuel indique que TEMPO ne fait pas partie des paramètres randomisables.',
  },
]

// ─── BUTTONS ───────────────────────────────────────────────────────────────
export const BUTTONS = [
  {
    id: 'PLAY', label: 'PLAY', secondary: 'STOP', color: '#3DAA6A', perf: false,
    description: 'Transport global du T-1: démarre/arrête la lecture. Le statut LED reflète l’état du clock (lecture active, Link, etc.).',
    shortcuts: [
      { key: '[PLAY]', action: 'Démarrer / arrêter le transport' },
      { key: '[CTRL] + [PLAY]', action: 'Play isolé (sans MIDI / Link / reset analog)' },
      { key: '[CLEAR] + [PLAY]', action: 'Tuer toutes les notes MIDI bloquées (panic)' },
    ],
    notes: '[CTRL]+[PLAY] lance en mode isolé (sans Start/Stop MIDI, Link ni reset analog). [CLEAR]+[PLAY] envoie un panic pour couper les notes MIDI bloquées.',
  },
  {
    id: 'BANK', label: 'BANK', secondary: 'SAVE', color: '#E8750A', perf: false,
    description: 'Sélectionne le bank actif (1–16). En tout mode : retour à la vue home (tracks). SAVE est le seul niveau de sauvegarde du T-1.',
    shortcuts: [
      { key: '[BANK]', action: 'Retour home / sortie du mode en cours' },
      { key: 'Hold [BANK]', action: 'Afficher la vue banks' },
      { key: 'Hold [BANK] + [VBx]', action: 'Sélectionner bank 1–16' },
      { key: '[CTRL] + [BANK] + [VBx]', action: 'Sauvegarder le bank courant' },
      { key: 'Hold [BANK] + [VBx] (1 sec)', action: 'Recharger bank (flash vert = OK)' },
      { key: '[CLEAR] + [BANK] + [VBx] + [VBx]', action: 'Effacer bank (double confirmation)' },
      { key: 'Hold [CTRL]+[COPY]+[BANK]+[src→dst]', action: 'Copier bank' },
      { key: 'Démarrer T-1 en tenant [BANK]', action: 'Full reload complet' },
    ],
    notes: 'Le manuel précise: pas de sauvegarde manuelle track/pattern seule, la sauvegarde se fait au niveau BANK. Le T-1 dispose aussi d\'un autosave et recharge le bank précédent au démarrage.',
  },
  {
    id: 'PATTERN', label: 'PATTERN', secondary: 'SELECT', color: '#E8750A', perf: false,
    description: 'Sélectionne le pattern actif (1–16). SELECT (secondaire) permet la sélection silencieuse sans interrompre le jeu en cours.',
    shortcuts: [
      { key: 'Hold [PATTERN]', action: 'Afficher la vue patterns' },
      { key: '[PATTERN] + [VBx]', action: 'Sélectionner pattern' },
      { key: '[CTRL] + [PATTERN] + [VBx]', action: 'Sélection silencieuse (sans interruption)' },
      { key: 'Press [VBx] + [VBy] + ...', action: 'Chaîner des patterns dans l’ordre' },
      { key: '[CLEAR] + [PATTERN] + [VBx]', action: 'Effacer pattern' },
      { key: 'Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]', action: 'Copier pattern' },
    ],
  },
  {
    id: 'CTRL', label: 'CTRL', secondary: null, color: '#5BA3C9', perf: false,
    description: 'Modificateur global du T-1. Maintenu, il donne accès aux fonctions secondaires des knobs/boutons et à des actions avancées de sélection/édition.',
    shortcuts: [
      { key: 'Hold [CTRL] + Turn (knob)', action: 'Accéder à la fonction secondaire du knob' },
      { key: 'Hold [CTRL] + [bouton]', action: 'Accéder à la fonction secondaire' },
      { key: 'Hold [CTRL] + [VBx] + [VBy]', action: 'Sélection multiple via VBs (quand le mode le permet)' },
      { key: '[CTRL] + double-tap (track)', action: 'Assigner statut MAGENTA (FX track)' },
      { key: '[CTRL] + [VB16] (keyboard view)', action: 'Octave −1' },
      { key: '[CTRL] + Turn (TEMPO)', action: 'Régler la luminosité des LEDs' },
      { key: '[CTRL] + [PLAY]', action: 'Play isolé sans MIDI / Link' },
      { key: '[CTRL] + [BANK] + [VBx]', action: 'Sauvegarder bank' },
    ],
  },
  {
    id: 'CLEAR', label: 'CLEAR', secondary: 'COPY', color: '#CC4444', perf: false,
    description: 'Efface la cible courante (track/pattern/bank selon combinaison). Avec [CTRL], bascule en mode COPY pour dupliquer tracks, patterns ou banks.',
    shortcuts: [
      { key: '[CLEAR]', action: 'Entrer en clear mode pour la cible courante' },
      { key: '[CTRL] + [CLEAR]', action: 'Entrer en copy mode' },
      { key: '[CLEAR] + [VBx]', action: 'Effacer track' },
      { key: '[CLEAR] + [BANK] + [VBx] + [VBx]', action: 'Effacer bank (double confirmation)' },
      { key: '[CLEAR] + [PATTERN] + [VBx]', action: 'Effacer pattern' },
      { key: 'Hold [CTRL]+[COPY]+[src→dst]', action: 'Copier track' },
      { key: 'Hold [CTRL]+[COPY]+[BANK]+[src→dst]', action: 'Copier bank' },
      { key: 'Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]', action: 'Copier pattern' },
      { key: 'Hold [VBx] + tap [CLEAR]', action: 'Mode Hold step (latch)' },
    ],
  },
  {
    id: 'TEMP', label: 'TEMP', secondary: null, color: '#E09930', perf: true,
    description: 'Modificateur performance temporaire: Hold [TEMP] + Turn (param) applique une variation momentanée. Relâcher [TEMP] restaure la valeur d’origine.',
    shortcuts: [
      { key: 'Hold [TEMP] + Turn (param)', action: 'Modifier temporairement un paramètre' },
    ],
    notes: 'Idéal en live pour faire un break/sweep puis revenir instantanément au réglage de base, sans réécrire la valeur définitive.',
  },
  {
    id: 'MUTE', label: 'MUTE', secondary: null, color: '#E09930', perf: true,
    description: 'Contrôle de mute des tracks. Hold [MUTE] + [VBx] prépare un toggle de mute, appliqué au relâchement. [CTRL]+[MUTE]+[VBx] applique un mute/unmute immédiat.',
    shortcuts: [
      { key: 'Hold [MUTE] + [VBx]', action: 'Muter / démuter (appliqué au relâchement)' },
      { key: '[CTRL] + [MUTE] + [VBx]', action: 'Quick mute / unmute immédiat' },
    ],
  },
  {
    id: 'VB', label: 'VB 1–16', secondary: null, color: '#888888', perf: false,
    description: '16 boutons multifonction illuminés (Value Buttons). L\'illumination colorée indique le mode actif. Par défaut : sélection et visualisation des tracks.',
    shortcuts: [
      { key: '[VBx] (mode BANK)', action: 'Sélectionner bank 1–16' },
      { key: '[VBx] (mode PATTERN)', action: 'Sélectionner pattern 1–16' },
      { key: '[VBx] (mode TRACK)', action: 'Sélectionner track 1–16' },
      { key: '[VBx] + [VBy] (track view)', action: 'Sélection multi-track' },
      { key: '[CTRL] + [VBx] (track view)', action: 'Cycle type de track: Note / CC / FX' },
      { key: 'Double-tap [VBx] (selon type)', action: 'Basculer en Pulse / CC / FX view' },
      { key: '[VBx] (keyboard view)', action: 'Jouer / sélectionner notes dans la gamme' },
      { key: 'VB8', action: 'Direction UP (voicing)' },
      { key: 'VB16', action: 'Direction DOWN · [CTRL]+VB16 = Octave −1' },
      { key: 'Hold [VBx] + tap [CLEAR]', action: 'Mode Hold step (latch)' },
    ],
  },
]

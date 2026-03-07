const frQuickref = {
  title: 'Essentiels',
  subtitle: 'Selection courte des fonctions critiques pour naviguer, editer et performer sans surcharge.',
  cards: {
    session: {
      title: 'Session: Bank / Pattern',
      items: {
        selectBank: { label: 'Selectionner bank' },
        saveBank: { label: 'Sauvegarder bank' },
        selectPattern: { label: 'Selectionner pattern' },
        silentSelect: { label: 'Selection silencieuse', note: 'sans interruption' },
      },
    },
    edit: {
      title: 'Edition: Copy / Clear',
      items: {
        copyTrack: { label: 'Copier track' },
        copyPattern: { label: 'Copier pattern' },
        clearTrack: { label: 'Effacer track' },
        clearPattern: { label: 'Effacer pattern' },
      },
    },
    performance: {
      title: 'Performance Live',
      items: {
        mutePrepare: { label: 'Mute prepare (release)' },
        quickMute: { label: 'Quick mute immediat' },
        tempVariation: { label: 'Variation temporaire' },
        patternVariation: { label: 'Variation relative pattern' },
      },
    },
    transport: {
      title: 'Transport & Securite',
      items: {
        startStop: { label: 'Demarrer / arreter' },
        isolatedPlay: { label: 'Play isole', note: 'sans transport externe' },
        midiPanic: { label: 'Panic MIDI', note: 'coupe les notes bloquees' },
        home: { label: 'Retour home' },
      },
    },
    shape: {
      title: 'Shape Rapide',
      items: {
        patternLength: { label: 'Longueur du pattern' },
        euclideanDensity: { label: 'Densite euclidienne' },
        cycleCount: { label: 'Nombre de cycles' },
        timeDivision: { label: 'Signature rythmique' },
        noteRepeats: { label: 'Note repeats' },
      },
    },
    groove: {
      title: 'Groove Rapide',
      items: {
        baseVelocity: { label: 'Velocite de base' },
        noteLength: { label: 'Longueur de note' },
        microTiming: { label: 'Micro-timing' },
        dynamicAccent: { label: 'Accent dynamique' },
        repeatSpacing: { label: 'Ecart des repeats' },
      },
    },
    tonal: {
      title: 'Tonal Rapide',
      items: {
        lockKeyboard: { label: 'Verrouiller vue clavier' },
        harmonyVariation: { label: 'Variation harmonique' },
        playStyle: { label: 'Choisir style de jeu' },
        melodicRange: { label: 'Etendue melodique' },
        changeRoot: { label: 'Changer la fondamentale' },
      },
    },
    setup: {
      title: 'Setup Essentiel',
      items: {
        globalTempo: { label: 'Tempo global' },
        trackLoopLength: { label: 'Longueur de boucle track' },
        trackMidiChannel: { label: 'Canal MIDI de track' },
        randomAmountRate: { label: 'Random amount / rate' },
      },
    },
    advanced: {
      title: 'Fonctions Avancees Utiles',
      items: {
        cyclesView: { label: 'Entrer en vue cycles' },
        editCycle: { label: 'Editer un cycle' },
        holdStepLatch: { label: 'Hold step (latch)' },
        keyboardOctaveDown: { label: 'Octave -1 clavier', note: 'en keyboard view' },
      },
    },
  },
}

export default frQuickref

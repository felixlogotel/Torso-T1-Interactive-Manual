const enQuickref = {
  title: 'Essentials',
  subtitle: 'Short selection of critical functions to navigate, edit, and perform without overload.',
  cards: {
    session: {
      title: 'Session: Bank / Pattern',
      items: {
        selectBank: { label: 'Select bank' },
        saveBank: { label: 'Save bank' },
        selectPattern: { label: 'Select pattern' },
        silentSelect: { label: 'Silent selection', note: 'without interruption' },
      },
    },
    edit: {
      title: 'Editing: Copy / Clear',
      items: {
        copyTrack: { label: 'Copy track' },
        copyPattern: { label: 'Copy pattern' },
        clearTrack: { label: 'Clear track' },
        clearPattern: { label: 'Clear pattern' },
      },
    },
    performance: {
      title: 'Live Performance',
      items: {
        mutePrepare: { label: 'Mute prepare (release)' },
        quickMute: { label: 'Quick mute' },
        tempVariation: { label: 'Temporary variation' },
        patternVariation: { label: 'Pattern-wide relative variation' },
      },
    },
    transport: {
      title: 'Transport & Safety',
      items: {
        startStop: { label: 'Start / stop' },
        isolatedPlay: { label: 'Isolated play', note: 'without external transport' },
        midiPanic: { label: 'MIDI panic', note: 'cuts stuck notes' },
        home: { label: 'Back home' },
      },
    },
    shape: {
      title: 'Quick Shape',
      items: {
        patternLength: { label: 'Pattern length' },
        euclideanDensity: { label: 'Euclidean density' },
        cycleCount: { label: 'Number of cycles' },
        timeDivision: { label: 'Time division' },
        noteRepeats: { label: 'Note repeats' },
      },
    },
    groove: {
      title: 'Quick Groove',
      items: {
        baseVelocity: { label: 'Base velocity' },
        noteLength: { label: 'Note length' },
        microTiming: { label: 'Micro-timing' },
        dynamicAccent: { label: 'Dynamic accent' },
        repeatSpacing: { label: 'Repeat spacing' },
      },
    },
    tonal: {
      title: 'Quick Tonal',
      items: {
        lockKeyboard: { label: 'Lock keyboard view' },
        harmonyVariation: { label: 'Harmony variation' },
        playStyle: { label: 'Choose play style' },
        melodicRange: { label: 'Melodic range' },
        changeRoot: { label: 'Change root note' },
      },
    },
    setup: {
      title: 'Core Setup',
      items: {
        globalTempo: { label: 'Global tempo' },
        trackLoopLength: { label: 'Track loop length' },
        trackMidiChannel: { label: 'Track MIDI channel' },
        randomAmountRate: { label: 'Random amount / rate' },
      },
    },
    advanced: {
      title: 'Useful Advanced Functions',
      items: {
        cyclesView: { label: 'Enter cycles view' },
        editCycle: { label: 'Edit one cycle' },
        holdStepLatch: { label: 'Hold step (latch)' },
        keyboardOctaveDown: { label: 'Keyboard octave -1', note: 'in keyboard view' },
      },
    },
  },
}

export default enQuickref

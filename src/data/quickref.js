export const QUICKREF_CARDS = [
  {
    id: 'session',
    color: '#E8750A',
    items: [
      { id: 'selectBank', keys: ['BANK + VBx'] },
      { id: 'saveBank', keys: ['CTRL + BANK + VBx'] },
      { id: 'selectPattern', keys: ['PATTERN + VBx'] },
      { id: 'silentSelect', keys: ['CTRL + PATTERN + VBx'] },
    ],
  },
  {
    id: 'edit',
    color: '#5BA3C9',
    items: [
      { id: 'copyTrack', keys: ['Hold CTRL + COPY', 'src -> dst'] },
      { id: 'copyPattern', keys: ['Hold CTRL + COPY + PATTERN', 'src -> dst'] },
      { id: 'clearTrack', keys: ['CLEAR + VBx'] },
      { id: 'clearPattern', keys: ['CLEAR + PATTERN + VBx'] },
    ],
  },
  {
    id: 'performance',
    color: '#E09930',
    items: [
      { id: 'mutePrepare', keys: ['Hold MUTE + VBx'] },
      { id: 'quickMute', keys: ['CTRL + MUTE + VBx'] },
      { id: 'tempVariation', keys: ['Hold TEMP + Turn Knob'] },
      { id: 'patternVariation', keys: ['Hold TEMP + PATTERN + Turn Knob'] },
    ],
  },
  {
    id: 'transport',
    color: '#3DAA6A',
    items: [
      { id: 'startStop', keys: ['PLAY'] },
      { id: 'isolatedPlay', keys: ['CTRL + PLAY'] },
      { id: 'midiPanic', keys: ['CLEAR + PLAY'] },
      { id: 'home', keys: ['BANK'] },
    ],
  },
  {
    id: 'shape',
    color: '#5BA3C9',
    items: [
      { id: 'patternLength', keys: ['Turn STEPS'] },
      { id: 'euclideanDensity', keys: ['Turn PULSES'] },
      { id: 'cycleCount', keys: ['CTRL + Turn CYCLES'] },
      { id: 'timeDivision', keys: ['Turn DIVISION'] },
      { id: 'noteRepeats', keys: ['Turn REPEATS'] },
    ],
  },
  {
    id: 'groove',
    color: '#9A72C4',
    items: [
      { id: 'baseVelocity', keys: ['Turn VELOCITY'] },
      { id: 'noteLength', keys: ['Turn SUSTAIN'] },
      { id: 'microTiming', keys: ['Turn TIMING'] },
      { id: 'dynamicAccent', keys: ['Turn ACCENT'] },
      { id: 'repeatSpacing', keys: ['Turn TIME'] },
    ],
  },
  {
    id: 'tonal',
    color: '#6AB870',
    items: [
      { id: 'lockKeyboard', keys: ['Double-press PITCH'] },
      { id: 'harmonyVariation', keys: ['CTRL + Turn HARMONY'] },
      { id: 'playStyle', keys: ['CTRL + STYLE + VBx'] },
      { id: 'melodicRange', keys: ['Turn RANGE'] },
      { id: 'changeRoot', keys: ['CTRL + Turn ROOT'] },
    ],
  },
  {
    id: 'setup',
    color: '#C49042',
    items: [
      { id: 'globalTempo', keys: ['Turn TEMPO'] },
      { id: 'trackLoopLength', keys: ['Turn LENGTH'] },
      { id: 'trackMidiChannel', keys: ['Turn CHANNEL'] },
      { id: 'randomAmountRate', keys: ['Turn RANDOM', 'CTRL + Turn RATE'] },
    ],
  },
  {
    id: 'advanced',
    color: '#9A72C4',
    items: [
      { id: 'cyclesView', keys: ['Hold CYCLES'] },
      { id: 'editCycle', keys: ['CYCLES + VBx', 'Turn Parameter'] },
      { id: 'holdStepLatch', keys: ['Hold VBx + tap CLEAR'] },
      { id: 'keyboardOctaveDown', keys: ['CTRL + VB16'] },
    ],
  },
]

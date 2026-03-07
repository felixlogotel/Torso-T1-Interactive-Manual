const enStructure = {
  hero: {
    title: 'Global T-1 Structure',
    subtitle: 'Simple overview to navigate banks, patterns, tracks, and cycles without getting lost.',
  },
  cards: {
    hierarchyTitle: 'Sequencer hierarchy',
    logicPath: 'Logical path',
    essentialShortcuts: 'Essential shortcuts',
  },
  levels: {
    sequencer: {
      title: 'T-1 SEQUENCER',
      subtitle: 'Global level',
      count: '16 Banks',
      detail: 'Global project container. Navigation then descends into the active [BANK].',
      shortcuts: [
        { key: '[PLAY]', action: 'Start / stop global transport.' },
        { key: '[BANK]', action: 'Return home and navigate to the BANK layer.' },
        { key: '[CTRL] + [PLAY]', action: 'Launch in isolated mode (without external transport).' },
      ],
    },
    bank: {
      title: 'Bank',
      subtitle: 'Active bank',
      count: '16 patterns / bank',
      detail: 'Each bank contains 16 patterns. [TEMPO] is stored at bank level.',
      shortcuts: [
        { key: 'Hold [BANK]', action: 'Open banks view.' },
        { key: '[BANK] + [VBx]', action: 'Select bank 1-16.' },
        { key: '[CTRL] + [BANK] + [VBx]', action: 'Save active bank.' },
        { key: '[CLEAR] + [BANK] + [VBx] + [VBx]', action: 'Clear a bank (double confirmation).' },
      ],
    },
    pattern: {
      title: 'Pattern',
      subtitle: 'Rhythmic arrangement',
      count: '16 Tracks',
      detail: 'Each pattern contains 16 tracks. [QUANTIZE] is stored at pattern level, and patterns can be chained.',
      shortcuts: [
        { key: 'Hold [PATTERN]', action: 'Open patterns view.' },
        { key: '[PATTERN] + [VBx]', action: 'Select pattern 1-16.' },
        { key: '[CTRL] + [PATTERN] + [VBx]', action: 'Silent selection (without interruption).' },
        { key: 'Press [VBx] + [VBy] + ...', action: 'Chain patterns in sequence.' },
      ],
    },
    track: {
      title: 'Track',
      subtitle: 'Voice/musical material',
      count: '16 Cycles',
      detail: 'Each pattern contains 16 tracks. A track can run in Note / CC / FX mode and [LENGTH] is stored at track level.',
      shortcuts: [
        { key: '[VBx] (TRACK mode)', action: 'Select track 1-16.' },
        { key: '[VBx] + [VBy] (TRACK mode)', action: 'Multi-track selection.' },
        { key: '[CTRL] + [VBx] (TRACK mode)', action: 'Cycle track type: Note / CC / FX.' },
        { key: 'Hold [MUTE] + [VBx]', action: 'Mute / unmute target track.' },
      ],
    },
    cycle: {
      title: 'Cycle',
      subtitle: 'Parameter variation',
      count: 'Cycle 1-16',
      detail: 'Each track can contain 16 cycles. A cycle is a set of parameter values replayed over time.',
      shortcuts: [
        { key: 'Hold / Double-press [CYCLES]', action: 'Open / latch cycles view.' },
        { key: '[CYCLES] + [VBx]', action: 'Select target cycle.' },
        { key: '[CTRL] + Turn [CYCLES]', action: 'Change number of active cycles.' },
        { key: 'Press [BANK]', action: 'Exit cycle edit mode.' },
      ],
    },
  },
}

export default enStructure

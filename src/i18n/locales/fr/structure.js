const frStructure = {
  hero: {
    title: 'Structure Globale du T-1',
    subtitle: "Vue d'ensemble simple pour ne plus se perdre entre banks, patterns, tracks et cycles.",
  },
  cards: {
    hierarchyTitle: 'Hierarchie du sequencer',
    logicPath: 'Chemin logique',
    essentialShortcuts: 'Raccourcis essentiels',
  },
  levels: {
    sequencer: {
      title: 'T-1 SEQUENCER',
      subtitle: 'Niveau global',
      count: '16 Banks',
      detail: 'Conteneur global du projet. Toute navigation descend ensuite vers la [BANK] active.',
      shortcuts: [
        { key: '[PLAY]', action: 'Démarrer / arrêter le transport global.' },
        { key: '[BANK]', action: 'Retour home et navigation vers la couche BANK.' },
        { key: '[CTRL] + [PLAY]', action: 'Lancer en mode isolé (sans transport externe).' },
      ],
    },
    bank: {
      title: 'Bank',
      subtitle: 'Banque active',
      count: '16 patterns / bank',
      detail: 'Chaque bank contient 16 patterns. [TEMPO] est stocké au niveau bank.',
      shortcuts: [
        { key: 'Hold [BANK]', action: 'Afficher la vue banks.' },
        { key: '[BANK] + [VBx]', action: 'Sélectionner bank 1-16.' },
        { key: '[CTRL] + [BANK] + [VBx]', action: 'Sauvegarder le bank actif.' },
        { key: '[CLEAR] + [BANK] + [VBx] + [VBx]', action: 'Effacer un bank (double confirmation).' },
      ],
    },
    pattern: {
      title: 'Pattern',
      subtitle: 'Arrangement rythmique',
      count: '16 Tracks',
      detail: 'Chaque pattern contient 16 tracks. [QUANTIZE] est stocké au niveau pattern, et les patterns peuvent être chaînés.',
      shortcuts: [
        { key: 'Hold [PATTERN]', action: 'Afficher la vue patterns.' },
        { key: '[PATTERN] + [VBx]', action: 'Sélectionner pattern 1-16.' },
        { key: '[CTRL] + [PATTERN] + [VBx]', action: 'Sélection silencieuse (sans interruption).' },
        { key: 'Press [VBx] + [VBy] + ...', action: 'Chaîner des patterns dans l’ordre.' },
      ],
    },
    track: {
      title: 'Track',
      subtitle: 'Voix/matiere musicale',
      count: '16 Cycles',
      detail: 'Chaque pattern contient 16 tracks. Une track peut être en mode Note / CC / FX et [LENGTH] est stocké au niveau track.',
      shortcuts: [
        { key: '[VBx] (mode TRACK)', action: 'Sélectionner la track 1-16.' },
        { key: '[VBx] + [VBy] (mode TRACK)', action: 'Sélection multi-track.' },
        { key: '[CTRL] + [VBx] (mode TRACK)', action: 'Cycle type de track: Note / CC / FX.' },
        { key: 'Hold [MUTE] + [VBx]', action: 'Muter / démuter la track ciblée.' },
      ],
    },
    cycle: {
      title: 'Cycle',
      subtitle: 'Variation de parametres',
      count: 'Cycle 1-16',
      detail: 'Chaque track peut contenir 16 cycles. Un cycle est une collection de réglages rejouée dans le temps.',
      shortcuts: [
        { key: 'Hold / Double-press [CYCLES]', action: 'Afficher / verrouiller la vue cycles.' },
        { key: '[CYCLES] + [VBx]', action: 'Sélectionner le cycle cible.' },
        { key: '[CTRL] + Turn [CYCLES]', action: 'Changer le nombre de cycles actifs.' },
        { key: 'Press [BANK]', action: 'Quitter le mode cycle edit.' },
      ],
    },
  },
}

export default frStructure

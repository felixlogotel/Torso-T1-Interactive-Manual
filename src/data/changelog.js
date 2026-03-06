export const VERSIONS = [
  {
    version: '2.1.3',
    date: '2 mars 2026',
    type: 'bugfix',
    entries: {
      bugfixes: [
        'Correction d\'un bug où la quantization de pattern ne fonctionnait pas avec SYNC IN.',
        'Correction d\'un bug où les paramètres CC étaient envoyés en double pendant la lecture.',
      ],
    },
  },
  {
    version: '2.1.2',
    date: '2 février 2026',
    type: 'bugfix',
    entries: {
      bugfixes: [
        'Les banks utilisant les nouveaux styles de voicing ne pouvaient pas se charger.',
      ],
    },
  },
  {
    version: '2.1.1',
    date: '18 décembre 2025',
    type: 'bugfix',
    entries: {
      bugfixes: [
        'Correction d\'un crash lors du tap d\'un knob après changement de track en vue latched.',
      ],
    },
  },
  {
    version: '2.1.0',
    date: '16 décembre 2025',
    type: 'major',
    highlight: true,
    entries: {
      features: [
        'Project Save/Load via T1 Config : sauvegarde/restauration complète de l\'état du device (.zip).',
        'Hold Mode : latch de notes depuis le clavier interne ou MIDI externe.',
        'Deux nouveaux styles de voicing : Up/Down et Climb Up/Down (Poly et Mono).',
        'Verrouillage de la séquence aléatoire par paramètre.',
        'Options de routage FX Mode : Omni, Same, Fixed.',
        'Filtre de tracks actives en mode FX.',
      ],
      enhancements: [
        'Sauvegarde et chargement plus rapides.',
        'CC auto-sauvegardé dans les tracks.',
        'Effacer PITCH remet la note racine.',
        'Random RATE et TIME ne suivent plus DIVISION.',
        'Les tracks FX continuent à tourner même quand le T-1 est stoppé.',
        'Meilleure plage de valeurs des Value Buttons en mode CC.',
        'Option dans T1 Config pour sortir les CC entrants et Pitch Bend.',
      ],
      bugfixes: [
        'Visualisation LED du tempo plus précise.',
        'Les banks sauvegardés manuellement se chargent correctement au boot.',
        'Baisser VOICING ne déclenche plus de notes incorrectes.',
        'Sélection de notes corrigée avec les gammes alternatives dans Cycles.',
        'Program Change des banks 9–16 sur canal MIDI 2 corrigé.',
        'Correction d\'un crash lors du changement de track en vue latched.',
        'Les cycles ne changent plus de manière inattendue quand le T-1 est à l\'arrêt.',
        'Le tempo est correctement sauvegardé et rechargé dans les banks.',
        'Le start/stop avec clock analog reset correctement le point de départ.',
        'La sélection de pattern suit correctement la lecture.',
        'Les CC peuvent maintenant être envoyés sur tous les canaux.',
        'Correction d\'un problème empêchant la suppression des pitches dans le menu PITCH.',
        'Program Change devient instantané quand la lecture est stoppée.',
        'Comportement des éditions CC mis à jour (sélection des boutons correcte).',
        'Correction d\'un problème de track delay qui faisait démarrer Cycle 2.',
        'Random Repeats Time fonctionne correctement (plus limité au max).',
      ],
    },
  },
  {
    version: '2.0.14',
    date: '1 mai 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Suppression de la limite de 8 éditions par step.'],
    },
  },
  {
    version: '2.0.13',
    date: '27 avril 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Correction de la copie des step edits entre pages (>16 steps).'],
    },
  },
  {
    version: '2.0.12',
    date: '21 avril 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Temp + CC ne fonctionnait pas (régression depuis v2.0.7).'],
    },
  },
  {
    version: '2.0.11',
    date: '21 avril 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Correction du scintillement des LEDs sur des batches récents de T-1.'],
    },
  },
  {
    version: '2.0.10',
    date: '23 mars 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Correction d\'un bug lors des changements relatifs de step edits CC.'],
    },
  },
  {
    version: '2.0.9',
    date: '14 mars 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['La multi-sélection ne fonctionnait pas pour des sélections > 2 items (régression depuis v2.0.7).'],
    },
  },
  {
    version: '2.0.8',
    date: '13 mars 2023',
    type: 'bugfix',
    entries: {
      bugfixes: [
        'Les menus de knob se bloquaient parfois à l\'ouverture avec [CTRL] ou RANDOM.',
        'Accent et vélocité random se comportaient incorrectement (régression depuis v2.0.7).',
      ],
    },
  },
  {
    version: '2.0.7',
    date: '8 mars 2023',
    type: 'bugfix',
    entries: {
      bugfixes: [
        'Stabilité générale fortement améliorée via fuzz testing.',
        'Resync des cycles en sortie de mode edit/loop et lors du changement du nombre de cycles.',
        'Correction d\'un crash avec cycles aléatoires pendant l\'édition.',
        'Les step edits vides sont correctement copiés.',
        'Correction de logique des accords/step edits à travers les cycles.',
        'Édition timing des steps désactivée temporairement pour réimplémentation.',
      ],
    },
  },
  {
    version: '2.0.6',
    date: '13 février 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Les cycles mutés n\'étaient pas effacés avec [CLEAR].'],
    },
  },
  {
    version: '2.0.5',
    date: '5 février 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['L\'édition des step edits sur les pages 2–4 ne fonctionnait pas (régression depuis v2.0.3).'],
    },
  },
  {
    version: '2.0.4',
    date: '3 février 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Les valeurs CC n\'étaient pas envoyées en appuyant sur VB en vue CC pendant la lecture.'],
    },
  },
  {
    version: '2.0.3',
    date: '30 janvier 2023',
    type: 'bugfix',
    entries: {
      bugfixes: ['Version de stabilité générale (résolution de la majorité des crashes).'],
    },
  },
  {
    version: '2.0.2',
    date: '21 novembre 2022',
    type: 'bugfix',
    entries: {
      bugfixes: ['Correction d\'un bug dans l\'algorithme de voicing (régression depuis v2.0.0).'],
    },
  },
  {
    version: '2.0.1',
    date: '13 décembre 2022',
    type: 'bugfix',
    entries: {
      bugfixes: ['Correction d\'un crash lors de la rencontre de patterns/banks invalides.'],
    },
  },
  {
    version: '2.0.0',
    date: '9 décembre 2022',
    type: 'major',
    entries: {
      features: [
        'Édition de paramètres par step, incluant les CCs.',
        'Type de track FX pour traitement de l\'entrée MIDI.',
        'Affichage quick view des paramètres.',
        'Workflow des Cycles repensé : boucle et multi-sélection.',
        'Routage de notes entre tracks.',
        'Support multi-canal par track.',
        'Ajustement du Slew sur les modulations aléatoires.',
        'Réglage libre des paramètres Division / Time.',
        'Options aléatoires polyphoniques / monophoniques.',
        'Buffer de Repeats sauvegardé dans les tracks (capacité looper).',
      ],
      enhancements: [
        'Double-tap track pour entrer en vue pulses.',
        'Réorganisation du menu Cycles.',
        'Comportement macro Division pour Time et Rate.',
        'Stop all repeats de la track : [CLEAR].',
        'Mise à jour du comportement de voicing aléatoire.',
        'Compatibilité Tempo avec les CCs.',
        'Nouveau manuel par Synthdawg.',
      ],
    },
  },
  {
    version: '1.3.2',
    date: '22 septembre 2022',
    type: 'bugfix',
    entries: {
      bugfixes: [
        'Saut de steps avec clock externe.',
        'Crash potentiel du T-1 avec T1 Config.',
      ],
    },
  },
]

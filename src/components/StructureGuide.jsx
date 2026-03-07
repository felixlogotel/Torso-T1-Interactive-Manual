import { useMemo, useState } from 'react'
import InlineControlText from './InlineControlText.jsx'
import './StructureGuide.css'

const LEVELS = [
  {
    id: 'sequencer',
    tone: 'global',
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
  {
    id: 'bank',
    tone: 'bank',
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
  {
    id: 'pattern',
    tone: 'pattern',
    title: 'Pattern',
    subtitle: 'Arrangement rythmique',
    count: '16 Tracks',
    detail:
      'Chaque pattern contient 16 tracks. [QUANTIZE] est stocké au niveau pattern, et les patterns peuvent être chaînés.',
    shortcuts: [
      { key: 'Hold [PATTERN]', action: 'Afficher la vue patterns.' },
      { key: '[PATTERN] + [VBx]', action: 'Sélectionner pattern 1-16.' },
      { key: '[CTRL] + [PATTERN] + [VBx]', action: 'Sélection silencieuse (sans interruption).' },
      { key: 'Press [VBx] + [VBy] + ...', action: 'Chaîner des patterns dans l’ordre.' },
    ],
  },
  {
    id: 'track',
    tone: 'track',
    title: 'Track',
    subtitle: 'Voix/matiere musicale',
    count: '16 Cycles',
    detail:
      'Chaque pattern contient 16 tracks. Une track peut être en mode Note / CC / FX et [LENGTH] est stocké au niveau track.',
    shortcuts: [
      { key: '[VBx] (mode TRACK)', action: 'Sélectionner la track 1-16.' },
      { key: '[VBx] + [VBy] (mode TRACK)', action: 'Sélection multi-track.' },
      { key: '[CTRL] + [VBx] (mode TRACK)', action: 'Cycle type de track: Note / CC / FX.' },
      { key: 'Hold [MUTE] + [VBx]', action: 'Muter / démuter la track ciblée.' },
    ],
  },
  {
    id: 'cycle',
    tone: 'cycle',
    title: 'Cycle',
    subtitle: 'Variation de parametres',
    count: 'Cycle 1-16',
    detail:
      'Chaque track peut contenir 16 cycles. Un cycle est une collection de réglages rejouée dans le temps.',
    shortcuts: [
      { key: 'Hold / Double-press [CYCLES]', action: 'Afficher / verrouiller la vue cycles.' },
      { key: '[CYCLES] + [VBx]', action: 'Sélectionner le cycle cible.' },
      { key: '[CTRL] + Turn [CYCLES]', action: 'Changer le nombre de cycles actifs.' },
      { key: 'Press [BANK]', action: 'Quitter le mode cycle edit.' },
    ],
  },
]

function levelIndex(id) {
  return LEVELS.findIndex((entry) => entry.id === id)
}

export default function StructureGuide({ onNavigateControl }) {
  const [activeLevel, setActiveLevel] = useState('pattern')

  const active = useMemo(() => LEVELS.find((level) => level.id === activeLevel) || LEVELS[0], [activeLevel])
  const path = useMemo(() => {
    const index = Math.max(0, levelIndex(active.id))
    return LEVELS.slice(0, index + 1).map((item) => item.title).join(' > ')
  }, [active.id])

  return (
    <div className="structure-page">
      <div className="structure-hero">
        <h1 className="structure-title">Structure Globale du T-1</h1>
        <p className="structure-subtitle">
          Vue d&apos;ensemble simple pour ne plus se perdre entre banks, patterns, tracks et cycles.
        </p>
      </div>

      <div className="structure-main-grid">
        <section className="structure-card structure-level-card">
          <div className="structure-card-title">Hierarchie du sequencer</div>
          <div className="structure-levels">
            {LEVELS.map((level, index) => (
              <div key={level.id} className="structure-level-row">
                <button
                  type="button"
                  className={`structure-level-btn is-${level.tone} ${activeLevel === level.id ? 'is-active' : ''}`}
                  onClick={() => setActiveLevel(level.id)}
                >
                  <span className={`structure-level-index is-${level.tone}`}>{index + 1}</span>
                  <span className="structure-level-copy">
                    <span className="structure-level-name">{level.title}</span>
                    <span className="structure-level-meta">{level.count}</span>
                  </span>
                  <span className={`structure-level-tag is-${level.tone}`}>{level.subtitle}</span>
                </button>
                {index < LEVELS.length - 1 && <span className="structure-level-arrow">↓</span>}
              </div>
            ))}
          </div>
        </section>

        <section className={`structure-card structure-focus-card is-${active.tone}`}>
          <div className="structure-focus-kicker">
            <span className={`structure-focus-badge is-${active.tone}`}>{active.subtitle}</span>
            <span className={`structure-focus-count is-${active.tone}`}>{active.count}</span>
          </div>
          <div className="structure-focus-head">
            <span className="structure-focus-title">{active.title}</span>
          </div>
          <p className="structure-focus-text">
            <InlineControlText text={active.detail} onNavigateControl={onNavigateControl} />
          </p>

          <div className="structure-path-block">
            <span className="structure-path-label">Chemin logique</span>
            <span className="structure-path-value">{path}</span>
          </div>

          <div className="structure-focus-shortcuts">
            <span className="structure-focus-shortcuts-title">Raccourcis essentiels</span>
            <div className="structure-shortcut-flow">
              {active.shortcuts.map((shortcut) => (
                <div key={`${shortcut.key}-${shortcut.action}`} className="structure-shortcut-item">
                  <div className="structure-shortcut-copy">
                    <span className="structure-shortcut-key">
                      <InlineControlText text={shortcut.key} onNavigateControl={onNavigateControl} />
                    </span>
                    <span className="structure-shortcut-action">
                      <InlineControlText text={shortcut.action} onNavigateControl={onNavigateControl} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </div>
    </div>
  )
}

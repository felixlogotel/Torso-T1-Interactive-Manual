import { useMemo, useState } from 'react'
import { SECTIONS } from '../data/params.js'
import InlineControlText from './InlineControlText.jsx'
import TonalStaffGraph from './TonalStaffGraph.jsx'
import RhythmLaneGraph from './RhythmLaneGraph.jsx'
import { normalizeControlText } from '../lib/textFormatting.js'
import './ExplanationPanel.css'

const RHYTHM_IDS = new Set(['STEPS', 'PULSES', 'CYCLES', 'DIVISION', 'REPEATS', 'TIME', 'ACCENT', 'TIMING', 'LENGTH', 'TEMPO'])
const HARMONY_IDS = new Set(['PITCH', 'VOICING', 'RANGE', 'SCALE', 'CHANNEL'])
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const WHITE_KEY_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const BLACK_KEY_LAYOUT = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]
const SCALE_LIBRARY = [
  { id: 'chromatic', vb: 'VB9', name: 'Chromatic', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { id: 'major', vb: 'VB10', name: 'Major', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { id: 'minor', vb: 'VB11', name: 'Minor', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { id: 'pentatonic', vb: 'VB12', name: 'Pentatonic', intervals: [0, 3, 5, 7, 10] },
  { id: 'hirajoshi', vb: 'VB13', name: 'Hirajoshi', intervals: [0, 2, 3, 7, 8] },
  { id: 'iwato', vb: 'VB14', name: 'Iwato', intervals: [0, 1, 5, 6, 10] },
  { id: 'tetratonic', vb: 'VB15', name: 'Tetratonic', intervals: [0, 4, 7, 11] },
  { id: 'user', vb: 'VB16', name: 'User', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], isUser: true },
]

const USAGE_HINTS = {
  REPEATS: 'RAMP applique une rampe de vélocité sur cette série de répétitions.',
  TIME: 'TIME règle l’écart entre les répétitions; combine-le avec PACE pour obtenir des accélérations/décélérations naturelles.',
  VOICING: 'VOICING réordonne les notes du même accord. C’est idéal pour ouvrir/resserrer l’harmonie sans changer la tonalité.',
  PITCH: 'PITCH transposera le mouvement mélodique dans la gamme active: utile pour créer des variations sans sortir de la tonalité.',
  SCALE: 'Choisis d’abord SCALE/ROOT pour verrouiller l’univers harmonique, puis travaille PITCH/VOICING.',
}

function normalizeDescriptionText(text) {
  if (!text) return ''
  return normalizeControlText(text).replace(/\[([^[\]]+)\]/g, '$1')
}

function buildRhythmProfile(id) {
  const seed = Array.from(id || '').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return Array.from({ length: 16 }, (_, index) => {
    const value = (index * 7 + seed) % 11
    if (value < 2) return 0
    if (value < 7) return 1
    return 2
  })
}

function RhythmVisual({ id, color }) {
  const bars = buildRhythmProfile(id)
  return (
    <div className="exp-visual rhythm">
      {bars.map((value, index) => (
        <div
          key={`${id}-${index}`}
          className="exp-rhythm-bar"
          style={{
            height: `${10 + value * 9}px`,
            opacity: value === 0 ? 0.2 : value === 1 ? 0.55 : 0.95,
            background: color,
          }}
        />
      ))}
    </div>
  )
}

function HarmonyVisual({ id, color }) {
  const seed = Array.from(id || '').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const notes = [12, 34, 56, 78].map((left, index) => ({
    left,
    top: 65 - (((seed + index * 9) % 34) + 8),
  }))

  return (
    <div className="exp-visual harmony">
      <div className="exp-harmony-staff" />
      {notes.map((note, index) => (
        <div
          key={`${id}-note-${index}`}
          className="exp-harmony-note"
          style={{
            left: `${note.left}%`,
            top: `${note.top}%`,
            borderColor: color,
            background: `${color}44`,
          }}
        />
      ))}
      <div className="exp-harmony-arrow" style={{ color }}>↕</div>
    </div>
  )
}

function ControlVisual({ color }) {
  return (
    <div className="exp-visual control">
      <div className="exp-control-knob" style={{ borderColor: color }}>
        <div className="exp-control-indicator" style={{ background: color }} />
      </div>
      <div className="exp-control-arrows" style={{ color }}>← ajuster →</div>
    </div>
  )
}

function buildEuclideanStepSet(totalSteps, pulses, rotation = 0) {
  const safeSteps = Math.max(1, Math.floor(totalSteps))
  const safePulses = Math.max(0, Math.min(safeSteps, Math.floor(pulses)))
  const set = new Set()
  for (let step = 0; step < safeSteps; step += 1) {
    const hasPulse = Math.floor(((step + 1) * safePulses) / safeSteps) - Math.floor((step * safePulses) / safeSteps) > 0
    if (hasPulse) {
      set.add(wrapGridStep(step + rotation, safeSteps))
    }
  }
  return set
}

function SequencerStrip({
  totalSteps = 16,
  activeSteps = 16,
  pulseSteps = new Set(),
  manualSteps = new Set(),
  editedSteps = new Set(),
  currentStep = null,
  highlightActive = false,
}) {
  const safeSteps = Math.max(1, totalSteps)
  const beatMarkers = new Set(
    Array.from({ length: 4 }, (_, index) => index * Math.max(1, Math.floor(safeSteps / 4)))
  )

  return (
    <div className="exp-seq-strip-wrap">
      <div className="exp-seq-strip-labels">
        {Array.from({ length: safeSteps }, (_, index) => (
          <span key={`label-${index}`} className={beatMarkers.has(index) ? 'is-beat' : ''}>
            {beatMarkers.has(index) ? index + 1 : ''}
          </span>
        ))}
      </div>
      <div className="exp-seq-strip">
        {Array.from({ length: safeSteps }, (_, index) => {
          const isPulse = pulseSteps.has(index)
          const isManual = manualSteps.has(index)
          const isEdited = editedSteps.has(index)
          const isCurrent = currentStep === index
          const isInactive = index >= activeSteps
          const isActive = !isInactive
          return (
            <span
              key={`cell-${index}`}
              className={[
                'exp-seq-cell',
                isInactive ? 'is-inactive' : '',
                highlightActive && isActive ? 'is-active' : '',
                isPulse ? 'is-pulse' : '',
                isManual ? 'is-manual' : '',
                isEdited ? 'is-edited' : '',
                isCurrent ? 'is-current' : '',
              ].filter(Boolean).join(' ')}
            />
          )
        })}
      </div>
    </div>
  )
}

function StepsVisual() {
  const stepRows = [
    { label: '8 steps · cycle court', activeSteps: 8 },
    { label: '12 steps · cycle intermédiaire', activeSteps: 12 },
    { label: '16 steps · cycle complet', activeSteps: 16 },
  ]

  const pageRows = [
    { page: 'Page 1', keyLabel: 'CTRL + BANK', range: '1–16' },
    { page: 'Page 2', keyLabel: 'CTRL + PATTERN', range: '17–32' },
    { page: 'Page 3', keyLabel: 'CTRL + TEMP', range: '33–48' },
    { page: 'Page 4', keyLabel: 'CTRL + MUTE', range: '49–64' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-steps-length-card">
          <div className="exp-repeat-card-title">STEPS · longueur du pattern</div>
          <div className="exp-shape-stack">
            {stepRows.map((row) => (
              <div key={row.label} className="exp-shape-row">
                <span className="exp-time-label">{row.label}</span>
                <SequencerStrip totalSteps={16} activeSteps={row.activeSteps} highlightActive />
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">STEPS · extension 17–64</div>
          <div className="exp-shape-pages">
            {pageRows.map((row) => (
              <div key={row.page} className="exp-shape-page-card">
                <span className="exp-shape-page-title">{row.page}</span>
                <span className="exp-shape-page-range">{row.range}</span>
                <span className="exp-shape-page-key">{row.keyLabel}</span>
              </div>
            ))}
          </div>
          <div className="exp-style-note">
            Hold CTRL + Turn + STEPS pour étendre/réduire. Hold CTRL + bouton page pour naviguer entre les pages.
          </div>
        </div>
      </div>
    </div>
  )
}

function PulsesVisual() {
  const euclid3 = buildEuclideanStepSet(16, 3)
  const euclid5 = buildEuclideanStepSet(16, 5)
  const euclid5Rot = buildEuclideanStepSet(16, 5, 2)
  const euclid7 = buildEuclideanStepSet(16, 7)
  const manualSteps = new Set([1, 8])

  return (
    <div className="exp-repeat-wrap exp-pulses-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">PULSES · distribution euclidienne</div>
          <div className="exp-shape-stack">
            <div className="exp-shape-row">
              <span className="exp-time-label">3 pulses sur 16</span>
              <SequencerStrip totalSteps={16} pulseSteps={euclid3} />
            </div>
            <div className="exp-shape-row">
              <span className="exp-time-label">5 pulses sur 16</span>
              <SequencerStrip totalSteps={16} pulseSteps={euclid5} />
            </div>
            <div className="exp-shape-row">
              <span className="exp-time-label">ROTATE +2 (CTRL + PULSES)</span>
              <SequencerStrip totalSteps={16} pulseSteps={euclid5Rot} />
            </div>
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">PULSES · euclidien vs manuel</div>
          <div className="exp-shape-stack">
            <div className="exp-shape-row">
              <span className="exp-time-label">Avant: Euclid 5 + pulses manuels</span>
              <SequencerStrip totalSteps={16} pulseSteps={euclid5} manualSteps={manualSteps} />
            </div>
            <div className="exp-shape-row">
              <span className="exp-time-label">Après Turn + PULSES: Euclid 7 + manuels inchangés</span>
              <SequencerStrip totalSteps={16} pulseSteps={euclid7} manualSteps={manualSteps} />
            </div>
          </div>
          <div className="exp-shape-legend">
            <span className="exp-shape-legend-item"><i className="is-pulse" />Euclidien</span>
            <span className="exp-shape-legend-item"><i className="is-manual" />Manuel (VBx)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CyclesVisual() {
  const activeCycles = new Set([0, 1, 2, 3])
  const editedCycles = new Set([2])
  const currentCycle = 1
  const workflow = [
    { step: '1', title: 'Ouvrir la vue CYCLES', detail: 'Hold ou double-tap CYCLES' },
    { step: '2', title: 'Sélectionner cycle à éditer', detail: 'Press VBx en vue CYCLES (plusieurs possibles)' },
    { step: '3', title: 'BANK passe en rouge', detail: 'Le cycle sélectionné clignote et boucle' },
    { step: '4', title: 'Tourner les paramètres', detail: 'Ex: PITCH, REPEATS... valeurs lockées dans le cycle' },
    { step: '5', title: 'Sortir de l’édition', detail: 'Press BANK pour revenir au playback normal' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-cycles-view">
          <div className="exp-repeat-card-title">CYCLES · vue et états</div>
          <div className="exp-cycle-strip">
            {Array.from({ length: 16 }, (_, index) => {
              const isActive = activeCycles.has(index)
              const isEdited = editedCycles.has(index)
              const isCurrent = currentCycle === index
              return (
                <span
                  key={`cycle-${index + 1}`}
                  className={[
                    'exp-cycle-cell',
                    isActive ? 'is-active' : 'is-inactive',
                    isEdited ? 'is-edited' : '',
                    isCurrent ? 'is-current' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {index + 1}
                </span>
              )
            })}
          </div>
          <div className="exp-shape-legend">
            <span className="exp-shape-legend-item"><i className="is-cycle-current" />Cycle courant</span>
            <span className="exp-shape-legend-item"><i className="is-active" />Actif</span>
            <span className="exp-shape-legend-item"><i className="is-edited" />Édité</span>
            <span className="exp-shape-legend-item"><i className="is-inactive" />Inactif</span>
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">CYCLES · workflow d’édition</div>
          <div className="exp-cycle-flow">
            {workflow.map((item) => (
              <div key={item.step} className="exp-cycle-flow-item">
                <span className="exp-cycle-flow-step">{item.step}</span>
                <div className="exp-cycle-flow-text">
                  <span className="exp-cycle-flow-title">{item.title}</span>
                  <span className="exp-cycle-flow-detail">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="exp-style-note">
            Nombre de cycles: CTRL + Turn + CYCLES ou CTRL + CYCLES + VBx (1 à 16).
          </div>
        </div>
      </div>
    </div>
  )
}

function DivisionVisual() {
  const divisionMap = {
    1: '1/1',
    2: '1/2',
    3: '1/4',
    4: '1/8',
    5: '1/16',
    6: '1/32',
    7: '1/64',
    11: '1/3',
    12: '1/6',
    13: '1/12',
    14: '1/24',
    15: '1/48',
  }

  const divisionKeys = Array.from({ length: 16 }, (_, index) => {
    const vbNumber = index + 1
    const value = divisionMap[vbNumber] ?? null
    return {
      vb: `VB${vbNumber}`,
      value,
      tone: vbNumber <= 7 ? 'quad' : vbNumber >= 11 && vbNumber <= 15 ? 'triplet' : 'unused',
    }
  })

  const keyboardRows = [divisionKeys.slice(0, 8), divisionKeys.slice(8, 16)]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">DIVISION · sélection sur clavier VB</div>
          <div className="exp-division-keyboard">
            {keyboardRows.map((row, rowIndex) => (
              <div key={`division-row-${rowIndex + 1}`} className="exp-division-keyboard-row">
                {row.map((entry) => (
                  <div key={entry.vb} className={`exp-division-key is-${entry.tone}`}>
                    <span className="exp-division-key-vb">{entry.vb}</span>
                    <span className="exp-division-key-value">{entry.value ?? '—'}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="exp-shape-legend">
            <span className="exp-shape-legend-item"><i className="is-division-quad" />Quadruplets</span>
            <span className="exp-shape-legend-item"><i className="is-division-triplet" />Triplets</span>
            <span className="exp-shape-legend-item"><i className="is-division-unused" />Sans fonction directe</span>
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">DIVISION · impact et mode libre</div>
          <div className="exp-division-impact">
            <span>À tempo identique, une division plus fine augmente la densité rythmique perçue.</span>
            <span>STEPS/PULSES/REPEATS gardent leur structure, mais leur durée réelle change avec DIVISION.</span>
            <span>SUSTAIN est directement calculé relativement à DIVISION.</span>
            <span>DELAY se lit en valeurs de note (1/16, 1/8, 1/4) dans ce contexte rythmique.</span>
          </div>
          <div className="exp-cycle-flow">
            <div className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">1</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">Voir la division active</span>
                <span className="exp-cycle-flow-detail">Hold ou double-tap DIVISION</span>
              </div>
            </div>
            <div className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">2</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">Sélection rapide</span>
                <span className="exp-cycle-flow-detail">Turn + DIVISION ou press VBx</span>
              </div>
            </div>
            <div className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">3</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">Mode libre 96 PPQN</span>
                <span className="exp-cycle-flow-detail">CTRL + Turn + DIVISION (statut blanc clignotant)</span>
              </div>
            </div>
          </div>
          <div className="exp-style-note">Depuis v2.1.0: RANDOM RATE et TIME ne suivent plus DIVISION.</div>
        </div>
      </div>
    </div>
  )
}

function TempoVisual() {
  const workflow = [
    { step: '1', title: 'Voir le tempo', detail: 'Hold ou double-tap TEMPO' },
    { step: '2', title: 'Ajustement fin', detail: 'Turn + TEMPO: 1 BPM par cran' },
    { step: '3', title: 'Portée', detail: 'Tempo global du BANK' },
    { step: '4', title: 'Clock externe', detail: 'Si Analog/MIDI/Link pilote la clock, le tempo interne est ignoré' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-tempo-edit-card">
        <div className="exp-repeat-card-title">TEMPO · édition</div>
        <div className="exp-cycle-flow exp-tempo-edit-flow">
          {workflow.map((item) => (
            <div key={item.step} className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">{item.step}</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">{item.title}</span>
                <span className="exp-cycle-flow-detail">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ButtonModeGrid({ title, items, note, columns = 2, onNavigateControl }) {
  return (
    <div className="exp-repeat-card">
      <div className="exp-repeat-card-title">{title}</div>
      <div className={`exp-button-mode-grid ${columns === 1 ? 'is-one' : ''}`}>
        {items.map((item) => (
          <div key={`${item.key}-${item.action}`} className="exp-button-mode-item">
            <span className="exp-button-mode-key">
              {normalizeDescriptionText(item.key)}
            </span>
            <span className="exp-button-mode-action">
              <InlineControlText text={normalizeDescriptionText(item.action)} onNavigateControl={onNavigateControl} />
            </span>
          </div>
        ))}
      </div>
      {note && (
        <div className="exp-style-note">
          <InlineControlText text={note} onNavigateControl={onNavigateControl} />
        </div>
      )}
    </div>
  )
}

function PlayButtonVisual({ onNavigateControl }) {
  const flow = [
    { step: '1', title: 'Transport principal', detail: 'Press PLAY: start/stop global du T-1' },
    { step: '2', title: 'Mode isolé', detail: 'CTRL + PLAY: lecture locale sans Start/Stop MIDI, Link ni reset analog' },
    { step: '3', title: 'Sécurité live', detail: 'CLEAR + PLAY: panic MIDI (coupe les notes bloquées)' },
  ]

  const commands = [
    { key: '[PLAY]', action: 'Démarrer / arrêter le transport' },
    { key: '[CTRL] + [PLAY]', action: 'Play isolé (sans transport externe)' },
    { key: '[CLEAR] + [PLAY]', action: 'Panic: couper toutes les notes MIDI bloquées' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">PLAY · logique transport</div>
          <div className="exp-cycle-flow">
            {flow.map((item) => (
              <div key={item.step} className="exp-cycle-flow-item">
                <span className="exp-cycle-flow-step">{item.step}</span>
                <div className="exp-cycle-flow-text">
                  <span className="exp-cycle-flow-title">{item.title}</span>
                  <span className="exp-cycle-flow-detail">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ButtonModeGrid
          title="PLAY · commandes directes"
          items={commands}
          note="Point clé: [PLAY] agit sur la lecture globale, tandis que [CTRL]+[PLAY] évite d’envoyer un transport externe."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function TempButtonVisual({ onNavigateControl }) {
  const rows = [
    { label: 'Valeur normale', values: [14, 14, 14, 14, 14, 14, 14, 14] },
    { label: 'Hold TEMP + Turn + param', values: [14, 18, 22, 28, 28, 24, 18, 14] },
    { label: 'Release TEMP', values: [14, 14, 14, 14, 14, 14, 14, 14] },
  ]

  const usages = [
    { key: 'Hold [TEMP] + Turn (param)', action: 'Variation temporaire du paramètre' },
    { key: 'Release [TEMP]', action: 'Retour immédiat à la valeur d’origine' },
    { key: 'TEMP (perf)', action: 'Parfait pour break, fill ou montée ponctuelle' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">TEMP · modulation temporaire</div>
          <div className="exp-temp-stack">
            {rows.map((row) => (
              <div key={row.label} className="exp-temp-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-temp-bars">
                  {row.values.map((value, index) => (
                    <span key={`${row.label}-${index}`} className="exp-temp-bar" style={{ height: `${value}px` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ButtonModeGrid
          title="TEMP · usage pratique"
          items={usages}
          note="TEMP ne remplace pas l’édition permanente: c’est un modificateur de performance, relâché = valeur restaurée."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function MuteButtonVisual({ onNavigateControl }) {
  const rows = [
    { label: 'Tracks actives', muted: [] },
    { label: 'Hold MUTE + VBx (toggle au relâchement)', muted: [2, 6, 11], armed: [2, 6, 11] },
    { label: 'CTRL + MUTE + VBx (immédiat)', muted: [2, 6], armed: [6] },
  ]

  const commands = [
    { key: 'Hold [MUTE] + [VBx]', action: 'Préparer mute/unmute (appliqué au release)' },
    { key: '[CTRL] + [MUTE] + [VBx]', action: 'Quick mute / unmute immédiat' },
    { key: '[MUTE] (perf)', action: 'Contrôle live des tracks sans quitter le flux' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">MUTE · état des tracks</div>
          <div className="exp-mute-stack">
            {rows.map((row) => (
              <div key={row.label} className="exp-mute-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-mute-strip">
                  {Array.from({ length: 16 }, (_, index) => {
                    const trackIndex = index + 1
                    const isMuted = row.muted.includes(trackIndex)
                    const isArmed = row.armed?.includes(trackIndex)
                    return (
                      <span
                        key={`${row.label}-${trackIndex}`}
                        className={`exp-mute-cell ${isMuted ? 'is-muted' : ''} ${isArmed ? 'is-armed' : ''}`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="exp-shape-legend">
            <span className="exp-shape-legend-item"><i className="is-muted-track" />Track mutée</span>
            <span className="exp-shape-legend-item"><i className="is-armed-track" />Track ciblée</span>
          </div>
        </div>

        <ButtonModeGrid
          title="MUTE · commandes"
          items={commands}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function BankPatternHierarchyVisual({ focus = 'bank', onNavigateControl }) {
  const levels = [
    {
      id: 'bank',
      title: 'BANK',
      meta: '16 banks',
      detail: 'Chaque bank contient 16 patterns.',
    },
    {
      id: 'pattern',
      title: 'PATTERN',
      meta: '16 patterns / bank',
      detail: 'Chaque pattern contient 16 tracks.',
    },
    {
      id: 'track',
      title: 'TRACK',
      meta: '16 tracks / pattern',
      detail: 'Chaque track peut contenir 16 cycles.',
    },
    {
      id: 'cycle',
      title: 'CYCLE',
      meta: '16 cycles / track',
      detail: 'Variantes de paramètres rejouées dans le temps.',
    },
  ]

  const chain = levels.flatMap((level, index) => (
    index < levels.length - 1
      ? [{ type: 'node', level }, { type: 'arrow', id: `${level.id}-arrow` }]
      : [{ type: 'node', level }]
  ))

  const focusLabel = focus === 'pattern' ? 'PATTERN' : 'BANK'
  const focusCopy = focus === 'pattern'
    ? 'Tu es ici: PATTERN dans la BANK active. [QUANTIZE] est stocké au niveau PATTERN.'
    : 'Tu es ici: BANK (niveau organisation). [TEMPO] est stocké au niveau BANK.'

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-bank-pattern-card">
        <div className="exp-repeat-card-title">STRUCTURE · BANK → PATTERN → TRACK → CYCLE</div>

        <div className="exp-bank-pattern-root">
          <span className="exp-bank-pattern-root-title">T-1 SEQUENCER</span>
          <span className="exp-bank-pattern-root-meta">conteneur global</span>
        </div>

        <div className="exp-bank-pattern-chain">
          {chain.map((item) => (
            item.type === 'arrow' ? (
              <span key={item.id} className="exp-bank-pattern-arrow" aria-hidden>
                →
              </span>
            ) : (
              <div
                key={item.level.id}
                className={`exp-bank-pattern-node ${focus === item.level.id ? 'is-focus' : ''}`}
              >
                <span className="exp-bank-pattern-node-title">{item.level.title}</span>
                <span className="exp-bank-pattern-node-meta">{item.level.meta}</span>
                <span className="exp-bank-pattern-node-detail">{item.level.detail}</span>
              </div>
            )
          ))}
        </div>

        <div className="exp-bank-pattern-focus">
          <span className="exp-bank-pattern-focus-chip">Section active: {focusLabel}</span>
          <span className="exp-bank-pattern-focus-text">
            <InlineControlText text={focusCopy} onNavigateControl={onNavigateControl} />
          </span>
        </div>
      </div>
    </div>
  )
}

function CtrlButtonVisual({ onNavigateControl }) {
  const principles = [
    { step: '1', title: 'Maintenir CTRL', detail: 'Active les fonctions secondaires (labels gris).' },
    { step: '2', title: 'Ajouter le geste', detail: 'Turn + knob, press bouton ou combinaison VB selon le contexte.' },
    { step: '3', title: 'Relâcher CTRL', detail: 'Retour au comportement principal.' },
  ]

  const examples = [
    { key: '[CTRL] + Turn (knob)', action: 'Fonction secondaire du knob (ex: RAMP, PACE, HARMONY, ROOT...)' },
    { key: '[CTRL] + [BANK] + [VBx]', action: 'Sauvegarder le bank actif' },
    { key: '[CTRL] + [CLEAR]', action: 'Entrer en mode COPY' },
    { key: '[CTRL] + [PLAY]', action: 'Lancer en mode isolé' },
    { key: '[CTRL] + [VBx] (track view)', action: 'Changer le type de track (Note / CC / FX)' },
    { key: '[CTRL] + Turn [TEMPO]', action: 'Régler la luminosité des LEDs' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">CTRL · principe d’usage</div>
          <div className="exp-cycle-flow">
            {principles.map((item) => (
              <div key={item.step} className="exp-cycle-flow-item">
                <span className="exp-cycle-flow-step">{item.step}</span>
                <div className="exp-cycle-flow-text">
                  <span className="exp-cycle-flow-title">{item.title}</span>
                  <span className="exp-cycle-flow-detail">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ButtonModeGrid
          title="CTRL · exemples fréquents"
          items={examples}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function ClearButtonVisual({ onNavigateControl }) {
  const clearTargets = [
    { key: '[CLEAR] + [VBx]', action: 'Effacer track' },
    { key: '[CLEAR] + [PATTERN] + [VBx]', action: 'Effacer pattern' },
    { key: '[CLEAR] + [BANK] + [VBx] + [VBx]', action: 'Effacer bank (double confirmation)' },
  ]

  const copyTargets = [
    { key: '[CTRL] + [CLEAR]', action: 'Entrer en mode COPY' },
    { key: 'Hold [CTRL]+[COPY]+[src→dst]', action: 'Copier track' },
    { key: 'Hold [CTRL]+[COPY]+[PATTERN]+[src→dst]', action: 'Copier pattern' },
    { key: 'Hold [CTRL]+[COPY]+[BANK]+[src→dst]', action: 'Copier bank' },
    { key: 'Hold [VBx] + tap [CLEAR]', action: 'Hold mode (latch)' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <ButtonModeGrid
          title="CLEAR · effacer"
          items={clearTargets}
          note="Le niveau effacé dépend de la combinaison: track, pattern ou bank."
          onNavigateControl={onNavigateControl}
        />

        <ButtonModeGrid
          title="COPY · via CTRL + CLEAR"
          items={copyTargets}
          note="En mode COPY, conserve les touches de combinaison maintenues jusqu’à la destination."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function VBVisual({ onNavigateControl }) {
  const colorGuide = [
    {
      tone: 'yellow',
      label: 'Jaune',
      text: 'Étape/pulse actif ou focus d’édition selon la vue.',
    },
    {
      tone: 'white',
      label: 'Blanc',
      text: 'Valeur active / état de référence visible.',
    },
    {
      tone: 'green',
      label: 'Vert',
      text: 'Validation/état OK selon le contexte (ex. reload/save).',
    },
    {
      tone: 'pink',
      label: 'Rose',
      text: 'Fonction spéciale (root, phase, mode user, etc.).',
    },
  ]

  const pulseSet = new Set([0, 3, 6, 9, 12, 15])
  const manualSet = new Set([7, 10])
  const focusedStep = 3
  const playingStep = 12
  const pulseRows = [Array.from({ length: 8 }, (_, index) => index), Array.from({ length: 8 }, (_, index) => index + 8)]

  const keyboardTop = [null, 'C#', 'D#', null, 'F#', 'G#', 'A#', null]
  const keyboardBottom = ['C', 'D', 'E', 'F', 'G', 'A', 'B', null]
  const inScale = new Set(['C', 'D', 'E', 'F', 'G', 'A', 'B'])
  const activeNotes = new Set(['C', 'E', 'G'])
  const rootNote = 'C'
  const focusedNote = 'D'

  const pitchRows = [
    keyboardTop.map((note, index) => ({ vb: index + 1, note })),
    keyboardBottom.map((note, index) => ({ vb: index + 9, note })),
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card">
        <div className="exp-repeat-card-title">VB 1–16 · guide couleur</div>
        <div className="exp-vb-color-grid">
          {colorGuide.map((entry) => (
            <div key={entry.tone} className="exp-vb-color-item">
              <span className={`exp-vb-color-dot is-${entry.tone}`} />
              <div className="exp-vb-color-copy">
                <span className="exp-vb-color-name">{entry.label}</span>
                <span className="exp-vb-color-text">{entry.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="exp-style-note">
          Les couleurs dépendent de la page active. Ce bloc te donne des repères visuels rapides, pas une règle absolue pour tous les menus.
        </div>
      </div>

      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">VB · mode PULSES</div>
          <div className="exp-vb-stack">
            {pulseRows.map((row, rowIndex) => (
              <div key={`pulse-row-${rowIndex + 1}`} className="exp-vb-mode-grid">
                {row.map((index) => {
                  let tone = 'off'
                  if (pulseSet.has(index)) tone = 'yellow'
                  if (manualSet.has(index)) tone = 'pink'
                  if (index === focusedStep) tone = 'white'
                  if (index === playingStep) tone = 'green'

                  return (
                    <div key={`pulse-vb-${index + 1}`} className={`exp-vb-mode-cell is-${tone}`}>
                      <span className="exp-vb-mode-label">VB{index + 1}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="exp-shape-legend">
            <span className="exp-shape-legend-item"><i className="is-vb-yellow" />Pulse euclidien</span>
            <span className="exp-shape-legend-item"><i className="is-vb-pink" />Pulse manuel</span>
            <span className="exp-shape-legend-item"><i className="is-vb-white" />Focus d’édition</span>
            <span className="exp-shape-legend-item"><i className="is-vb-green" />Step en lecture</span>
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">VB · mode PITCH (keyboard view)</div>
          <div className="exp-vb-stack">
            {pitchRows.map((row, rowIndex) => (
              <div key={`pitch-row-${rowIndex + 1}`} className="exp-vb-mode-grid">
                {row.map((entry) => {
                  if (!entry.note) {
                    return (
                      <div key={`pitch-gap-${entry.vb}`} className="exp-vb-mode-cell is-gap">
                        <span className="exp-vb-mode-label">VB{entry.vb}</span>
                      </div>
                    )
                  }

                  let tone = inScale.has(entry.note) ? 'white' : 'off'
                  if (activeNotes.has(entry.note)) tone = 'green'
                  if (entry.note === rootNote) tone = 'pink'
                  if (entry.note === focusedNote) tone = 'yellow'

                  return (
                    <div key={`pitch-vb-${entry.vb}`} className={`exp-vb-mode-cell is-${tone}`}>
                      <span className="exp-vb-mode-label">VB{entry.vb}</span>
                      <span className="exp-vb-mode-note">{entry.note}</span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <div className="exp-style-note">
            Exemple pédagogique: en keyboard view, les VBs représentent les notes. La couleur indique le rôle musical courant (note active, root, focus, etc.).
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Repère: les [VBx] changent de rôle selon la page (BANK, PATTERN, TRACK, PULSES, PITCH...). Lis d’abord le contexte affiché, puis la couleur."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function LengthQuantizeVisual() {
  const lengthRows = [
    { label: 'Length inf · boucle complète', activeSteps: 16 },
    { label: 'Length 1/2 · boucle courte', activeSteps: 8 },
    { label: 'Length 1/4 · boucle très courte', activeSteps: 4 },
  ]

  const quantizeBars = ['1', '2', '3', '4', '5', '6', '7', '8', '16']
  const quantizeSubdivisions = ['1/2', '1/4', '1/8']

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">LENGTH · fenêtre de lecture de la track</div>
          <div className="exp-shape-stack">
            {lengthRows.map((row) => (
              <div key={row.label} className="exp-shape-row">
                <span className="exp-time-label">{row.label}</span>
                <SequencerStrip totalSteps={16} activeSteps={row.activeSteps} />
              </div>
            ))}
          </div>
          <div className="exp-style-note">
            En vue LENGTH: [CLEAR] choisit un random start (effet glitch), et [CLEAR] + Turn + LENGTH combine les deux.
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">QUANTIZE · changement de pattern</div>
          <div className="exp-shape-group-title">Bars (1–8, 16)</div>
          <div className="exp-quantize-grid">
            {quantizeBars.map((value, index) => (
              <div key={`quantize-bar-${value}`} className={`exp-quantize-cell ${index === 3 ? 'is-active' : ''}`}>
                <span className="exp-quantize-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="exp-shape-group-title">Subdivisions</div>
          <div className="exp-quantize-grid is-subdiv">
            {quantizeSubdivisions.map((value) => (
              <div key={`quantize-sub-${value}`} className="exp-quantize-cell">
                <span className="exp-quantize-value">{value}</span>
              </div>
            ))}
          </div>
          <div className="exp-style-note">
            QUANTIZE est stocké au niveau PATTERN: il détermine quand un pattern en file d’attente démarre.
          </div>
        </div>
      </div>
    </div>
  )
}

function ChannelOutputVisual() {
  const selectedChannels = new Set([1, 4])
  const routeExamples = [
    { from: 'Track 3 OUT', to: 'Track 9 IN (FX)' },
    { from: 'Track 3 OUT', to: 'Track 12 IN' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">CHANNEL · assignation MIDI (par track)</div>
          <div className="exp-channel-grid">
            {Array.from({ length: 16 }, (_, index) => {
              const channel = index + 1
              const isSelected = selectedChannels.has(channel)
              return (
                <div key={`channel-${channel}`} className={`exp-channel-cell ${isSelected ? 'is-selected' : ''}`}>
                  CH {channel}
                </div>
              )
            })}
          </div>
          <div className="exp-shape-legend">
            <span className="exp-shape-legend-item"><i className="is-current" />Canal sélectionné</span>
            <span className="exp-shape-legend-item"><i className="is-active" />Canal disponible</span>
          </div>
          <div className="exp-style-note">
            Par défaut, Track N utilise Channel N. Une track peut cibler plusieurs channels en parallèle.
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">OUTPUT · routage track vers track</div>
          <div className="exp-output-stack">
            {routeExamples.map((route, index) => (
              <div key={`route-${index}`} className="exp-output-flow">
                <span className="exp-output-node">{route.from}</span>
                <span className="exp-output-arrow">→</span>
                <span className="exp-output-node">{route.to}</span>
              </div>
            ))}
          </div>
          <div className="exp-style-note">
            Fonction avancée: CTRL + CHANNEL + VBx route la sortie de la track courante vers l’entrée d’une autre track.
          </div>
        </div>
      </div>
    </div>
  )
}

function RandomRateVisual({ color }) {
  const stableProfile = [44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44]
  const mediumProfile = [42, 50, 40, 48, 44, 52, 38, 50, 42, 48, 40, 54, 42, 50, 38, 48]
  const highProfile = [22, 68, 30, 74, 18, 62, 34, 80, 24, 58, 16, 72, 28, 64, 20, 78]
  const randomRows = [
    { label: 'Random 0% · évolution minimale', profile: stableProfile },
    { label: 'Random 50% · évolution modérée', profile: mediumProfile },
    { label: 'Random 100% · évolution forte', profile: highProfile },
  ]
  const rateRows = [
    { label: 'RATE /2 · plus lent', activeSteps: [0, 4, 8, 12] },
    { label: 'RATE x1 · normal', activeSteps: [0, 2, 4, 6, 8, 10, 12, 14] },
    { label: 'RATE x2 · plus rapide', activeSteps: Array.from({ length: 16 }, (_, index) => index) },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">RANDOM · évolution globale (0–100%)</div>
          <div className="exp-random-stack">
            {randomRows.map((row) => (
              <div key={row.label} className="exp-random-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-random-strip">
                  {row.profile.map((height, index) => (
                    <span
                      key={`${row.label}-${index}`}
                      className="exp-random-step"
                      style={{ '--random-h': `${height}%`, '--random-color': color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="exp-style-note">
            Le manuel parle de probabilité d’événement random; en pratique cela se perçoit aussi comme une intensité d’évolution de la séquence.
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">RANDOM + RATE · réglages</div>
          <div className="exp-random-controls">
            <div className="exp-random-bipolar">
              <span className="is-neg">-100% (souvent mono)</span>
              <span className="is-zero">0</span>
              <span className="is-pos">+100% (souvent poly)</span>
            </div>
            <div className="exp-rate-stack">
              {rateRows.map((row) => (
                <div key={row.label} className="exp-rate-row">
                  <span className="exp-time-label">{row.label}</span>
                  <div className="exp-rate-track">
                    {Array.from({ length: 16 }, (_, index) => (
                      <span
                        key={`${row.label}-${index}`}
                        className={`exp-rate-step ${row.activeSteps.includes(index) ? 'is-active' : ''}`}
                        style={{ '--rate-color': color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="exp-random-rate-row">
              <span className="exp-phase-badge">RANDOM + Knob + VB8</span>
              <span className="exp-phase-badge">RANDOM + Knob + VB16</span>
            </div>
            <div className="exp-style-note">
              RATE = division temporelle de la séquence random (pas le tempo BPM). RANDOM + Knob = amount du paramètre. CTRL + RANDOM + Turn + Knob = slew.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function RepeatsVisual({ color, onNavigateControl }) {
  const repeatBursts = [2, 4, 3, 5, 4]
  const rampUp = [18, 34, 50, 66, 82, 96]
  const rampDown = [96, 82, 66, 50, 34, 18]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-repeat-density">
          <div className="exp-repeat-card-title">REPEATS · densité</div>
          <div className="exp-repeat-lanes">
            {repeatBursts.map((count, laneIndex) => (
              <div key={`burst-${laneIndex}`} className="exp-repeat-lane">
                <div className="exp-repeat-origin" style={{ background: color }} />
                <div className="exp-repeat-trail">
                  {Array.from({ length: count }).map((_, dotIndex) => (
                    <div
                      key={`trail-${laneIndex}-${dotIndex}`}
                      className="exp-repeat-dot"
                      style={{
                        background: color,
                        opacity: 0.35 + ((dotIndex + 1) / (count + 1)) * 0.55,
                        transform: `scale(${0.72 + dotIndex * 0.08})`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">RAMP · vélocité</div>
          <div className="exp-ramp-rows">
            <div className="exp-ramp-row">
              <span className="exp-ramp-label">↗ up</span>
              <div className="exp-ramp-bars">
                {rampUp.map((value, index) => (
                  <div
                    key={`up-${index}`}
                    className="exp-ramp-bar"
                    style={{ height: `${value}%`, background: color }}
                  />
                ))}
              </div>
            </div>
            <div className="exp-ramp-row">
              <span className="exp-ramp-label">↘ down</span>
              <div className="exp-ramp-bars">
                {rampDown.map((value, index) => (
                  <div
                    key={`down-${index}`}
                    className="exp-ramp-bar"
                    style={{ height: `${value}%`, background: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Interaction clé: REPEATS fixe la quantité, TIME règle l’espacement, PACE accélère ou décélère la série."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function TimeVisual({ color, onNavigateControl }) {
  const timeRows = [
    { label: 'TIME bas', gap: 8 },
    { label: 'TIME médian', gap: 14 },
    { label: 'TIME haut', gap: 22 },
  ]

  const paceRows = [
    { label: '↗ accel', gaps: [34, 24, 14, 8] },
    { label: '↘ decel', gaps: [8, 14, 24, 34] },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">TIME · espacement</div>
          <div className="exp-time-stack">
            {timeRows.map((row) => (
              <div key={row.label} className="exp-time-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-time-track" style={{ '--time-gap': `${row.gap}px` }}>
                  <div className="exp-time-dot origin" style={{ background: color }} />
                  <div className="exp-time-dot" style={{ background: color }} />
                  <div className="exp-time-dot" style={{ background: color }} />
                  <div className="exp-time-dot" style={{ background: color }} />
                  <div className="exp-time-dot" style={{ background: color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">PACE · accélération</div>
          <div className="exp-time-stack">
            {paceRows.map((row) => (
              <div key={row.label} className="exp-time-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-pace-track">
                  <div className="exp-time-dot origin" style={{ background: color }} />
                  {row.gaps.map((gap, index) => (
                    <div key={`${row.label}-${index}`} className="exp-pace-step" style={{ '--pace-gap': `${gap}px` }}>
                      <div className="exp-time-dot" style={{ background: color, opacity: 0.8 }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Interaction clé: TIME définit l’écart entre les répétitions; PACE applique une accélération ou une décélération sur cette série."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function RhythmExampleRow({
  label,
  color,
  events,
  totalSteps = 16,
  beats = 4,
  fullBlockEvents = false,
}) {
  return (
    <div className="exp-rhythm-example-row">
      <span className="exp-time-label">{label}</span>
      <RhythmLaneGraph
        color={color}
        totalSteps={totalSteps}
        beats={beats}
        events={events}
        fullBlockEvents={fullBlockEvents}
      />
    </div>
  )
}

function wrapGridStep(step, totalSteps) {
  const safeTotal = Math.max(1, totalSteps)
  return ((step % safeTotal) + safeTotal) % safeTotal
}

function buildNormalizedGridEvents({
  totalSteps = 16,
  beats = 4,
  lengthSteps = 1,
  startSteps,
  shiftByIndex = {},
  colorsByIndex = {},
}) {
  const baseSteps = Array.isArray(startSteps) && startSteps.length > 0
    ? startSteps
    : Array.from({ length: beats }, (_, beatIndex) => beatIndex * (totalSteps / beats))

  return baseSteps.map((baseStep, index) => {
    const shift = shiftByIndex[index] || 0
    const noteColor = colorsByIndex[index]
    return {
      startStep: wrapGridStep(baseStep + shift, totalSteps),
      lengthSteps,
      kind: 'pulse',
      ...(noteColor ? { color: noteColor } : {}),
    }
  })
}

function SustainVisual({ color, onNavigateControl }) {
  const sustainRows = [
    { label: 'Sustain 19% · ≈ 1/4 division', lengthSteps: 0.25, starts: [0, 4, 8, 12] },
    { label: 'Sustain 50% · 1x division', lengthSteps: 1, starts: [0, 4, 8, 12] },
    { label: 'Sustain 100% · 16x division', lengthSteps: 16, starts: [0] },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card">
        <div className="exp-repeat-card-title">SUSTAIN · longueur relative à DIVISION</div>
        <div className="exp-sustain-stack">
          {sustainRows.map((row) => (
            <RhythmExampleRow
              key={row.label}
              label={row.label}
              color={color}
              fullBlockEvents
              events={row.starts.map((step) => ({
                startStep: step,
                lengthSteps: row.lengthSteps,
                kind: 'pulse',
              }))}
            />
          ))}
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Interaction clé: Turn [SUSTAIN] règle la longueur de note (pas de sous-menu [CTRL]). La longueur s’applique aussi aux repeats; un nouveau trigger coupe la note précédente. Pour un vrai latch, utiliser Hold [VBx] + tap [CLEAR] (Hold mode)."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function VelocityProbabilityVisual({ color, onNavigateControl }) {
  const stepKinds = [
    'pulse', 'repeat', 'empty', 'empty',
    'empty', 'empty', 'empty', 'empty',
    'manual', 'repeat', 'empty', 'empty',
    'empty', 'empty', 'empty', 'empty',
  ]

  const probabilityRows = [
    { label: 'Prob 0% · aucune note silencée', muted: new Set() },
    { label: 'Prob -30% · Pulses silencés (+ repeats si existants)', muted: new Set([0, 1]) },
    { label: 'Prob +30% · Notes silencées (+ repeats si existants)', muted: new Set([1, 8]) },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-probability-card">
        <div className="exp-repeat-card-title">PROBABILITY · silence bi-polaire</div>
        <div className="exp-probability-stack">
          <div className="exp-probability-legend">
            <span className="exp-probability-random-note">Note = pulse, note ajoutée à la main ou repeat.</span>
            <span className="is-left">-100% à 0: agit d’abord sur les pulses</span>
            <span className="is-right">0 à +100%: agit d’abord sur les notes</span>
          </div>

          {probabilityRows.map((row) => (
            <div key={row.label} className="exp-probability-row">
              <span className="exp-time-label">{row.label}</span>
              <div className="exp-probability-strip">
                {stepKinds.map((kind, index) => {
                  const isMuted = row.muted.has(index)
                  return (
                    <span
                      key={`${row.label}-${index}`}
                      className={`exp-prob-step is-${kind} ${isMuted ? 'is-muted' : ''}`}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          <div className="exp-probability-reading">
            <div className="exp-prob-reading-item">
              <span className="exp-prob-reading-dot is-pulse" />
              <span>Pulse</span>
            </div>
            <div className="exp-prob-reading-item">
              <span className="exp-prob-reading-dot is-repeat" />
              <span>Repeat</span>
            </div>
            <div className="exp-prob-reading-item">
              <span className="exp-prob-reading-dot is-manual" />
              <span>Note ajoutée</span>
            </div>
          </div>

          <div className="exp-probability-phase">
            <div className="exp-probability-phase-badges">
              <span className="exp-phase-badge">[VB8]</span>
              <span className="exp-phase-arrow">↔</span>
              <span className="exp-phase-badge">[VB16]</span>
              <span className="exp-time-label">Modulation de phase</span>
            </div>
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Interaction clé: [CTRL] + Turn [PROBABILITY]. Gauche: probabilité de couper les pulses (leurs repeats suivent). Droite: probabilité de couper des notes individuelles (pulse ou repeat). [VB8]/[VB16]: modulation phase."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function AccentGrooveVisual({ color }) {
  const profile = [0.44, 0.14, 0.58, 0.2, 0.72, 0.84, 0.2, 0.54, 0.2, 0.56, 0.14, 0.62, 0.18, 0.92, 0.72, 0.18]
  const accentRows = [
    { label: 'Accent faible', amount: 0.38 },
    { label: 'Accent moyen', amount: 0.68 },
    { label: 'Accent fort', amount: 1 },
  ]

  const groovePresetRows = [
    { vb: 'VB1', name: 'Agogo', shape: [46, 12, 54, 14, 66, 76, 14, 52, 14, 50, 12, 56, 14, 94, 68, 14] },
    { vb: 'VB2', name: 'Timbales', shape: [22, 88, 18, 40, 20, 34, 42, 64, 38, 72, 40, 34, 28, 58, 42, 18] },
    { vb: 'VB3', name: 'Congas', shape: [30, 38, 56, 24, 38, 36, 96, 34, 24, 28, 66, 42, 74, 32, 94, 20] },
    { vb: 'VB4', name: 'Bongo', shape: [36, 28, 34, 76, 18, 26, 40, 18, 32, 44, 88, 24, 36, 68, 28, 22] },
  ]

  const grooveWaveRows = [
    { vb: 'VB9', name: 'Saw', shape: [16, 21, 26, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91] },
    { vb: 'VB10', name: 'Triangle', shape: [16, 26, 36, 46, 56, 66, 76, 86, 86, 76, 66, 56, 46, 36, 26, 16] },
    { vb: 'VB11', name: 'Sine', shape: [18, 26, 36, 48, 60, 72, 82, 88, 88, 82, 72, 60, 48, 36, 26, 18] },
    { vb: 'VB12', name: 'Pulse', shape: [86, 86, 22, 22, 86, 86, 22, 22, 86, 86, 22, 22, 86, 86, 22, 22] },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid exp-accent-groove-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">ACCENT · quantité de variation</div>
          <div className="exp-accent-stack">
            {accentRows.map((row) => (
              <div key={row.label} className="exp-accent-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-accent-track">
                  <div className="exp-accent-bars">
                    {profile.map((value, index) => (
                      <span
                        key={`${row.label}-${index}`}
                        className="exp-accent-bar"
                        style={{ height: `${Math.min(100, Math.max(8, value * row.amount * 108))}%`, background: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">GROOVE · templates</div>
          <div className="exp-groove-stack">
            <div className="exp-groove-grid">
              {groovePresetRows.map((groove) => (
                <div key={groove.vb} className="exp-groove-card">
                  <div className="exp-groove-head">
                    <span className="exp-groove-vb">{groove.vb}</span>
                    <span className="exp-groove-head-sep" />
                    <span className="exp-groove-name">{groove.name}</span>
                  </div>
                  <div className="exp-groove-shape">
                    {groove.shape.map((value, index) => (
                      <span
                        key={`${groove.vb}-${index}`}
                        className="exp-groove-step"
                        style={{ height: `${value}%`, background: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="exp-phrase-separator" />

            <div className="exp-groove-grid">
              {grooveWaveRows.map((groove) => (
                <div key={groove.vb} className="exp-groove-card">
                  <div className="exp-groove-head">
                    <span className="exp-groove-vb">{groove.vb}</span>
                    <span className="exp-groove-head-sep" />
                    <span className="exp-groove-name">{groove.name}</span>
                  </div>
                  <div className="exp-groove-shape">
                    {groove.shape.map((value, index) => (
                      <span
                        key={`${groove.vb}-${index}`}
                        className="exp-groove-step"
                        style={{ height: `${value}%`, background: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TimingDelayVisual({ color }) {
  const totalSteps = 8
  const beats = 2
  const baseStartSteps = [0, 2, 4, 6]
  const timingFocusColor = '#e6b44a'
  const timingTopRow = [
    { vb: 'VB1', role: 'Fine tune', tone: 'fine' },
    { vb: 'VB2', role: 'Fine tune', tone: 'fine' },
    { vb: 'VB3', role: 'Fine tune', tone: 'fine' },
    { vb: 'VB4', role: 'On-grid', tone: 'center' },
    { vb: 'VB5', role: 'Fine tune', tone: 'fine' },
    { vb: 'VB6', role: 'Fine tune', tone: 'fine' },
    { vb: 'VB7', role: 'Fine tune', tone: 'fine' },
    { vb: 'VB8', role: 'Division x2', tone: 'division' },
  ]
  const timingBottomRow = [
    { vb: 'VB9', role: 'Coarse + tôt', tone: 'early' },
    { vb: 'VB10', role: 'Coarse + tôt', tone: 'early' },
    { vb: 'VB11', role: 'Coarse + tôt', tone: 'early' },
    { vb: 'VB12', role: 'On-grid', tone: 'center' },
    { vb: 'VB13', role: 'Coarse + tard', tone: 'late' },
    { vb: 'VB14', role: 'Coarse + tard', tone: 'late' },
    { vb: 'VB15', role: 'Coarse + tard', tone: 'late' },
    { vb: 'VB16', role: 'Division x4', tone: 'division' },
  ]

  const timingRows = [
    {
      label: 'Timing on-grid',
      events: buildNormalizedGridEvents({
        totalSteps,
        beats,
        startSteps: baseStartSteps,
        lengthSteps: 1,
        colorsByIndex: { 1: timingFocusColor },
      }),
    },
    {
      label: 'Timing plus tôt',
      events: buildNormalizedGridEvents({
        totalSteps,
        beats,
        startSteps: baseStartSteps,
        lengthSteps: 1,
        shiftByIndex: { 1: -0.35 },
        colorsByIndex: { 1: timingFocusColor },
      }),
    },
    {
      label: 'Timing plus tard',
      events: buildNormalizedGridEvents({
        totalSteps,
        beats,
        startSteps: baseStartSteps,
        lengthSteps: 1,
        shiftByIndex: { 1: 0.35 },
        colorsByIndex: { 1: timingFocusColor },
      }),
    },
  ]

  const delayRows = [
    {
      label: 'Delay on-grid',
      events: buildNormalizedGridEvents({ totalSteps, beats, startSteps: baseStartSteps, lengthSteps: 1 }),
    },
    {
      label: 'Delay plus tôt',
      events: buildNormalizedGridEvents({
        totalSteps,
        beats,
        startSteps: baseStartSteps,
        lengthSteps: 1,
        shiftByIndex: { 0: -0.75, 1: -0.75, 2: -0.75, 3: -0.75 },
      }),
    },
    {
      label: 'Delay plus tard',
      events: buildNormalizedGridEvents({
        totalSteps,
        beats,
        startSteps: baseStartSteps,
        lengthSteps: 1,
        shiftByIndex: { 0: 0.75, 1: 0.75, 2: 0.75, 3: 0.75 },
      }),
    },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-timing-controls-card">
        <div className="exp-repeat-card-title">TIMING · REGLAGE TIMING EN APPUYANT</div>
        <div className="exp-timing-controls-layout">
          <div className="exp-timing-vb-grid">
            {timingTopRow.map((entry) => (
              <div key={entry.vb} className={`exp-timing-vb-cell is-${entry.tone}`}>
                <span className="exp-timing-vb-role">{entry.role}</span>
                <span className={`exp-timing-vb-chip is-${entry.tone}`}>{entry.vb}</span>
              </div>
            ))}
          </div>

          <div className="exp-timing-vb-grid">
            {timingBottomRow.map((entry) => (
              <div key={entry.vb} className={`exp-timing-vb-cell is-${entry.tone}`}>
                <span className="exp-timing-vb-role">{entry.role}</span>
                <span className={`exp-timing-vb-chip is-${entry.tone}`}>{entry.vb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="exp-repeat-grid exp-timing-delay-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">TIMING · micro-shift</div>
          <div className="exp-timing-stack">
            {timingRows.map((row) => (
              <RhythmExampleRow
                key={row.label}
                label={row.label}
                color={color}
                totalSteps={totalSteps}
                beats={beats}
                fullBlockEvents
                events={row.events}
              />
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">DELAY · décalage track</div>
          <div className="exp-timing-stack">
            {delayRows.map((row) => (
              <RhythmExampleRow
                key={row.label}
                label={row.label}
                color={color}
                totalSteps={totalSteps}
                beats={beats}
                fullBlockEvents
                events={row.events}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PitchHarmonyVisual({ color, onNavigateControl }) {
  const pitchRows = [
    { label: 'PITCH source', intervals: [0, 2, 4, 5, 7], fundamentalIndex: 0 },
    { label: 'PITCH +1 (gamme définie par "Scale")', intervals: [2, 4, 5, 7, 9], fundamentalIndex: 0 },
    { label: 'PITCH -1 (gamme définie par "Scale")', intervals: [-1, 0, 2, 4, 5], fundamentalIndex: 0 },
  ]

  const harmonyRows = [
    {
      label: 'HARMONY +3',
      intervals: [5, 4, 7, 11, 14],
      movedIndex: 0,
    },
    {
      label: 'HARMONY -4',
      intervals: [0, 4, 0, 11, 14],
      movedIndex: 2,
    },
    {
      label: 'HARMONY +2',
      intervals: [0, 4, 7, 11, 16],
      movedIndex: 4,
    },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">PITCH · transposition</div>
          <div className="exp-tonal-stack">
            {pitchRows.map((row) => (
              <div key={row.label} className="exp-tonal-row">
                <span className="exp-voicing-label">{row.label}</span>
                <TonalStaffGraph
                  className="exp-tonal-graph"
                  intervals={row.intervals}
                  fundamentalIndex={row.fundamentalIndex}
                  color={color}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">HARMONY · variation d'accord</div>
          <div className="exp-tonal-stack">
            {harmonyRows.map((row) => (
              <div key={row.label} className="exp-tonal-row">
                <span className="exp-voicing-label">{row.label}</span>
                <TonalStaffGraph
                  className="exp-tonal-graph"
                  intervals={row.intervals}
                  fundamentalIndex={0}
                  color={color}
                  highlightIndices={[row.movedIndex]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Interaction clé: Hold [CTRL] + Turn [HARMONY]. +3, -4 ou +2 correspondent à des crans de knob. À chaque cran, une seule note est déplacée dans la scale active. La note ciblée est choisie automatiquement par l’algorithme, avec une recette interne souvent perçue comme aléatoire."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function ScaleRootVisual({ color, onNavigateControl }) {
  const [selectedScaleId, setSelectedScaleId] = useState('major')
  const [selectedRootIndex, setSelectedRootIndex] = useState(0)

  const activeScale = useMemo(
    () => SCALE_LIBRARY.find((scale) => scale.id === selectedScaleId) || SCALE_LIBRARY[1],
    [selectedScaleId]
  )
  const isUserScale = Boolean(activeScale.isUser)

  const transposedNoteIndices = useMemo(
    () => (isUserScale ? [] : activeScale.intervals.map((interval) => (interval + selectedRootIndex) % 12)),
    [activeScale, isUserScale, selectedRootIndex]
  )

  const transposedNotes = transposedNoteIndices.map((index) => CHROMATIC_NOTES[index])
  const transposedNoteNameSet = useMemo(
    () => new Set(transposedNotes),
    [transposedNotes]
  )
  const selectedRootNote = CHROMATIC_NOTES[selectedRootIndex]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-scale-single-card">
        <div className="exp-repeat-card-title">SCALE + ROOT · notes résultantes</div>
        <div className="exp-scale-tool">
          <div className="exp-scale-tool-group">
            <span className="exp-voicing-label">Sélectionner la root note</span>
            <div className="exp-root-choice-grid">
              {CHROMATIC_NOTES.map((note, index) => (
                <button
                  key={note}
                  type="button"
                  className={`exp-root-choice ${selectedRootIndex === index ? 'is-active' : ''}`}
                  onClick={() => setSelectedRootIndex(index)}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          <div className="exp-scale-tool-group">
            <span className="exp-voicing-label">Sélectionner la scale</span>
            <div className="exp-scale-choice-grid">
              {SCALE_LIBRARY.map((scale) => (
                <button
                  key={scale.id}
                  type="button"
                  className={`exp-scale-choice ${selectedScaleId === scale.id ? 'is-active' : ''}`}
                  onClick={() => setSelectedScaleId(scale.id)}
                >
                  <span className="exp-scale-choice-name">{scale.name}</span>
                  <span className="exp-scale-choice-vb">{scale.vb}</span>
                </button>
              ))}
            </div>
          </div>

          {!isUserScale ? (
            <div className="exp-active-notes-panel">
              <div className="exp-active-notes-title">Visualisation des notes actives</div>
              <div className="exp-active-notes-layout">
                <div className="exp-active-notes-list">
                  {transposedNotes.map((note, index) => (
                    <span
                      key={`active-note-${note}-${index}`}
                      className={`exp-active-note-chip ${note === selectedRootNote ? 'is-root' : ''}`}
                    >
                      {note}
                    </span>
                  ))}
                </div>

                <div className="exp-mini-keyboard" aria-label="Clavier chromatique">
                  <div className="exp-mini-white-row">
                    {WHITE_KEY_NOTES.map((note) => {
                      const isActive = transposedNoteNameSet.has(note)
                      const isRoot = note === selectedRootNote
                      return (
                        <span
                          key={`white-${note}`}
                          className={`exp-mini-white-key ${isActive ? 'is-active' : ''} ${isRoot ? 'is-root' : ''}`}
                        />
                      )
                    })}
                  </div>
                  <div className="exp-mini-black-row">
                    {BLACK_KEY_LAYOUT.map((note, index) => {
                      if (!note) return <span key={`black-gap-${index}`} className="exp-mini-black-gap" />
                      const isActive = transposedNoteNameSet.has(note)
                      const isRoot = note === selectedRootNote
                      return (
                        <span
                          key={`black-${note}`}
                          className={`exp-mini-black-key ${isActive ? 'is-active' : ''} ${isRoot ? 'is-root' : ''}`}
                          style={{ gridColumn: index + 1 }}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="exp-user-scale-panel">
              <div className="exp-user-scale-title">USER scale · comment ça marche</div>
              <div className="exp-user-scale-steps">
                <div>1. Mettre ROOT sur C comme référence.</div>
                <div>2. Hold (SCALE) + Hold [VB16] pour entrer l’édition USER.</div>
                <div>3. Presser [VBx] pour retirer/ajouter des notes dans la USER scale.</div>
                <div>4. Relâcher (SCALE) + [VB16] pour valider.</div>
              </div>
              <div className="exp-user-scale-note">
                La USER scale dépend de ton réglage track par track, donc il n’y a pas de tableau fixe ici.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VoicingVisual({ color, onNavigateControl }) {
  const voicingRows = [
    { label: 'voicing plus', values: [24, 50, 74, 94] },
    { label: 'voicing moins', values: [94, 74, 50, 24] },
  ]

  const styleRows = {
    poly: [
      { vb: 'VB1', label: 'Poly Fixed' },
      { vb: 'VB2', label: 'Poly Ramp' },
      { vb: 'VB3', label: 'Poly Climb' },
      { vb: 'VB4', label: 'Poly Up/Down' },
      { vb: 'VB5', label: 'Poly Climb Up/Down' },
    ],
    mono: [
      { vb: 'VB9', label: 'Mono Fixed' },
      { vb: 'VB10', label: 'Mono Ramp' },
      { vb: 'VB11', label: 'Mono Climb' },
      { vb: 'VB12', label: 'Mono Up/Down' },
      { vb: 'VB13', label: 'Mono Climb Up/Down' },
    ],
    direction: [
      { vb: 'VB8', label: 'Direction UP', isDirection: true },
      { vb: 'VB16', label: 'Direction DOWN', isDirection: true },
    ],
  }

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid exp-voicing-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">VOICING · ordre / octaves</div>
          <div className="exp-voicing-stack">
            {voicingRows.map((row) => (
              <div key={row.label} className="exp-voicing-row">
                <span className="exp-voicing-label">{row.label}</span>
                <div className="exp-voicing-bars">
                  {row.values.map((value, index) => (
                    <div
                      key={`${row.label}-${index}`}
                      className="exp-voicing-bar"
                      style={{ height: `${value}%`, background: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">STYLE · mapping VBx</div>
          <div className="exp-style-layout">
            <div className="exp-style-grid5">
              {styleRows.poly.map((entry) => (
                <div key={entry.vb} className="exp-style-cell">
                  <span className="exp-style-vb">{entry.vb}</span>
                  <span className="exp-style-name">{entry.label}</span>
                </div>
              ))}
            </div>
            <div className="exp-style-grid5">
              {styleRows.mono.map((entry) => (
                <div key={entry.vb} className="exp-style-cell">
                  <span className="exp-style-vb">{entry.vb}</span>
                  <span className="exp-style-name">{entry.label}</span>
                </div>
              ))}
            </div>
            <div className="exp-style-grid2 exp-style-grid-direction">
              {styleRows.direction.map((entry) => (
                <div key={entry.vb} className="exp-style-cell is-direction">
                  <span className="exp-style-vb is-direction">{entry.vb}</span>
                  <span className="exp-style-name">{entry.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Interaction clé: PITCH/HARMONY choisissent les notes, VOICING/STYLE organisent leur lecture. VB8/VB16 pilotent la direction pour les styles Up/Down et Climb Up/Down."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function RangeVisual({ color, onNavigateControl }) {
  const rangeRows = [
    { label: 'RANGE bas', intervals: [0, -1, 1, -1, 1], fundamentalIndex: 0 },
    { label: 'RANGE médian', intervals: [0, 3, -3, 2, -2], fundamentalIndex: 0 },
    { label: 'RANGE haut', intervals: [0, 7, -7, 12, -12], fundamentalIndex: 0 },
  ]

  const phraseGroups = [
    {
      id: 'torso',
      items: [
        { name: 'Torso 1', shape: [28, 40, 52, 64, 76] },
        { name: 'Torso 2', shape: [76, 64, 52, 40, 28] },
        { name: 'Torso 3', shape: [40, 62, 36, 68, 44] },
        { name: 'Torso 4', shape: [62, 34, 66, 42, 72] },
      ],
    },
    {
      id: 'lfo',
      items: [
        { name: 'Saw', shape: [24, 36, 48, 60, 72] },
        { name: 'Triangle', shape: [24, 48, 72, 48, 24] },
        { name: 'Sine', shape: [34, 52, 64, 52, 34] },
        { name: 'Pulse', shape: [72, 26, 72, 26, 72] },
      ],
    },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">RANGE · étendue / rate</div>
          <div className="exp-range-stack">
            {rangeRows.map((row) => (
              <div key={row.label} className="exp-range-row">
                <span className="exp-voicing-label">{row.label}</span>
                <div className="exp-range-row-content">
                  <TonalStaffGraph
                    className="exp-range-tonal-graph"
                    intervals={row.intervals}
                    fundamentalIndex={row.fundamentalIndex}
                    color={color}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">PHRASE · 8 templates</div>
          <div className="exp-phrase-groups">
            <div className="exp-phrase-grid">
              {phraseGroups[0].items.map((phrase) => (
                <div key={phrase.name} className="exp-phrase-card">
                  <div className="exp-phrase-name">{phrase.name}</div>
                  <div className="exp-phrase-shape">
                    {phrase.shape.map((value, index) => (
                      <div
                        key={`${phrase.name}-${index}`}
                        className="exp-phrase-step"
                        style={{ height: `${value}%`, background: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="exp-phrase-separator" />

            <div className="exp-phrase-grid">
              {phraseGroups[1].items.map((phrase) => (
                <div key={phrase.name} className="exp-phrase-card">
                  <div className="exp-phrase-name">{phrase.name}</div>
                  <div className="exp-phrase-shape">
                    {phrase.shape.map((value, index) => (
                      <div
                        key={`${phrase.name}-${index}`}
                        className="exp-phrase-step"
                        style={{ height: `${value}%`, background: color }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text="Interaction clé: PHRASE définit la forme mélodique, RANGE applique l’étendue et la vitesse; le rendu dépend aussi des notes fixées par PITCH/HARMONY et du comportement VOICING/STYLE."
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

export default function ExplanationPanel({ item, onNavigateControl }) {
  if (!item) {
    return (
      <section className="exp-panel">
        <p className="exp-placeholder">
          Sélectionne un bouton/knob sur le Torso pour afficher une explication détaillée ici.
        </p>
      </section>
    )
  }

  const sectionDef = item.section ? SECTIONS[item.section] : null
  const color = sectionDef?.color || item.color || '#8890c0'

  const mode = RHYTHM_IDS.has(item.id)
    ? 'rhythm'
    : HARMONY_IDS.has(item.id)
      ? 'harmony'
      : 'control'
  const displaySecondary = item.id === 'REPEATS' ? 'RAMP' : item.secondary

  const usageSupplement = USAGE_HINTS[item.id] || item.notes || null
  const mergedDescription = item.id === 'REPEATS'
    ? 'REPEATS ajoute des notes après chaque pulse. RAMP applique une rampe de vélocité sur cette série de répétitions. TIME et PACE agissent directement sur ces répétitions.'
      : item.id === 'STEPS'
      ? 'STEPS définit la longueur du pattern euclidien. En tournant, les pulses euclidiens sont redistribués automatiquement sur la nouvelle longueur. La longueur peut être étendue jusqu’à 64 steps (4 pages de 16).'
      : item.id === 'PULSES'
      ? 'PULSES règle combien de pulses euclidiens sont distribués dans les steps. Les pulses ajoutés manuellement en vue PULSES ne sont pas modifiés par Turn PULSES. ROTATE décale ensuite le point de départ du pattern.'
      : item.id === 'CYCLES'
      ? 'CYCLES joue des variantes de paramètres par itérations de pattern. Un cycle est un conteneur de valeurs alternatives: en mode édition, les paramètres tournés sont lockés dans le cycle sélectionné, puis rejoués en séquence.'
      : item.id === 'DIVISION'
      ? 'DIVISION fixe la valeur rythmique des steps de la track (quadruplets et triplets). Tu peux choisir une division preset via les VBs, ou passer en division libre haute résolution avec CTRL + Turn DIVISION.'
      : item.id === 'SUSTAIN'
      ? 'SUSTAIN règle la longueur des notes en pourcentage, relative à DIVISION. Cette longueur s’applique aux pulses et aux repeats; un nouveau trigger coupe la note précédente.'
      : item.id === 'VELOCITY'
      ? 'VELOCITY règle la vélocité de base des notes (1–127, défaut 100). PROBABILITY agit de façon aléatoire en bi-polaire: vers -100% (gauche), il coupe d’abord les pulses (et leurs repeats associés); vers +100% (droite), il coupe des notes individuelles (pulse ou repeat).'
      : item.id === 'TIME'
      ? 'TIME règle l’écart entre les répétitions générées par REPEATS. PACE accélère ou décélère ce même mouvement.'
      : item.id === 'ACCENT'
      ? 'ACCENT dose la variation de vélocité autour de la base VELOCITY. GROOVE sélectionne la forme de cette variation (8 templates), donc ACCENT et GROOVE fonctionnent ensemble.'
      : item.id === 'TIMING'
      ? 'TIMING fonctionne sur 2 niveaux: niveau 1, dans la vue boutons, tu choisis les notes candidates et la subdivision (VB8 x2, VB16 x4, les deux = x1). Niveau 2, tu règles la quantité de micro-shift vers plus tôt ou plus tard. DELAY est séparé: CTRL + DELAY décale ensuite toute la track vers plus tôt ou plus tard.'
      : item.id === 'TEMPO'
      ? 'TEMPO règle le BPM global du bank (24–280). Turn TEMPO ajuste finement (1 BPM par cran). Si une clock externe prend la main, le tempo interne n’est plus maître.'
      : item.id === 'LENGTH'
      ? 'LENGTH réduit la fenêtre de lecture de la track: la boucle rejoue cette longueur en continu. En vue LENGTH, CLEAR peut forcer un random start pour des variations glitch. QUANTIZE (CTRL + LENGTH) est stocké par pattern et détermine quand un pattern en attente prend la main.'
      : item.id === 'CHANNEL'
      ? 'CHANNEL assigne un ou plusieurs canaux MIDI (1–16) à la track, avec Track N -> Channel N par défaut. OUTPUT permet un routage track-vers-track (sortie de la track courante vers l’entrée d’une autre), utile pour des traitements internes/FX.'
      : item.id === 'RANDOM'
      ? 'RANDOM pilote une modulation globale en 16 pas. Turn RANDOM règle la probabilité d’application (perçue comme intensité d’évolution). RANDOM + un paramètre règle sa quantité bi-polaire. RATE règle la division temporelle de la séquence random (pas le BPM). D’après le manuel, TEMPO ne fait pas partie des paramètres randomisables.'
      : item.id === 'BANK'
      ? 'BANK est le niveau d’organisation le plus haut dans le T-1: 1 sequencer contient 16 banks, et chaque bank contient 16 patterns. Quand tu changes de bank, tu changes donc de “dossier” complet de patterns. Le [TEMPO] est stocké au niveau bank.'
      : item.id === 'PATTERN'
      ? 'PATTERN vit toujours à l’intérieur de la bank active: 16 patterns par bank. Chaque pattern contient 16 tracks, et chaque track peut contenir jusqu’à 16 cycles. Le [QUANTIZE] est stocké au niveau pattern, alors que [LENGTH] est stocké au niveau track.'
      : item.id === 'PLAY'
      ? 'PLAY contrôle le transport global du T-1 (start/stop). [CTRL] + [PLAY] lance en mode isolé sans transport externe (MIDI/Link/reset analog). [CLEAR] + [PLAY] envoie un panic MIDI pour couper les notes bloquées.'
      : item.id === 'CTRL'
      ? 'CTRL est le modificateur global du T-1: maintiens-le pour accéder aux fonctions secondaires des knobs et boutons. C’est la porte d’entrée des actions avancées (save bank, copy, modes secondaires, etc.).'
      : item.id === 'CLEAR'
      ? 'CLEAR efface selon la combinaison active (track, pattern ou bank). Avec [CTRL], CLEAR devient COPY pour dupliquer tracks, patterns et banks via source -> destination.'
      : item.id === 'TEMP'
      ? 'TEMP applique des variations de performance temporaires: Hold [TEMP] + Turn (param), puis relâchement = retour automatique à la valeur d’origine.'
      : item.id === 'MUTE'
      ? 'MUTE gère l’état des tracks en live: Hold [MUTE] + [VBx] prépare un toggle appliqué au relâchement; [CTRL]+[MUTE]+[VBx] applique un mute/unmute immédiat.'
      : item.id === 'VB'
      ? 'Les 16 Value Buttons (VB1–VB16) sont contextuels: leur fonction et leur couleur changent selon la vue active (BANK, PATTERN, TRACK, PULSES, PITCH, etc.). Lis toujours la page active pour interpréter correctement l’état lumineux.'
      : item.id === 'PITCH'
        ? 'PITCH construit un groupe de notes selon la SCALE active, puis transpose ce groupe dans la gamme. HARMONY crée des variations d’accord: chaque cran de knob déplace une seule note dans la scale active. La note est choisie automatiquement par l’algorithme (recette interne, souvent perçue comme aléatoire).'
      : item.id === 'SCALE'
        ? 'SCALE définit le pool de notes utilisé par les fonctions tonales. ROOT change la note de référence de la scale, sans transposer automatiquement les notes déjà enregistrées dans PITCH.'
      : item.id === 'VOICING'
        ? 'VOICING redistribue les notes issues de PITCH sur les octaves. STYLE fixe la logique de lecture, tandis que HARMONY peut changer les notes de base avant ce traitement.'
      : item.id === 'RANGE'
        ? 'RANGE contrôle l’étendue et la vitesse de transformation mélodique des notes provenant de PITCH. PHRASE sélectionne la forme de passage (8 templates) et le résultat final dépend aussi de VOICING/STYLE.'
    : [item.description, usageSupplement]
      .filter(Boolean)
      .filter((part, index, arr) => arr.indexOf(part) === index)
      .join(' ')

  return (
    <section className="exp-panel">
      <div className="exp-header">
        <div className="exp-chip" style={{ color, borderColor: `${color}4a`, background: `${color}18` }}>
          {(item.label || item.id)}{displaySecondary ? ` / ${displaySecondary}` : ''}
        </div>
      </div>

      <p className="exp-description">
        <InlineControlText text={normalizeDescriptionText(mergedDescription)} onNavigateControl={onNavigateControl} />
      </p>

      {item.id === 'STEPS' ? (
        <StepsVisual />
      ) : item.id === 'PULSES' ? (
        <PulsesVisual />
      ) : item.id === 'CYCLES' ? (
        <CyclesVisual />
      ) : item.id === 'DIVISION' ? (
        <DivisionVisual />
      ) : item.id === 'VELOCITY' ? (
        <VelocityProbabilityVisual color={color} onNavigateControl={onNavigateControl} />
      ) : item.id === 'SUSTAIN' ? (
        <SustainVisual color={color} onNavigateControl={onNavigateControl} />
      ) : item.id === 'REPEATS' ? (
        <RepeatsVisual color={color} onNavigateControl={onNavigateControl} />
      ) : item.id === 'TIME' ? (
        <TimeVisual color={color} onNavigateControl={onNavigateControl} />
      ) : item.id === 'ACCENT' ? (
        <AccentGrooveVisual color={color} />
      ) : item.id === 'TIMING' ? (
        <TimingDelayVisual color={color} />
      ) : item.id === 'TEMPO' ? (
        <TempoVisual />
      ) : item.id === 'LENGTH' ? (
        <LengthQuantizeVisual />
      ) : item.id === 'CHANNEL' ? (
        <ChannelOutputVisual />
      ) : item.id === 'RANDOM' ? (
        <RandomRateVisual color={color} />
      ) : item.id === 'BANK' ? (
        <BankPatternHierarchyVisual focus="bank" onNavigateControl={onNavigateControl} />
      ) : item.id === 'PATTERN' ? (
        <BankPatternHierarchyVisual focus="pattern" onNavigateControl={onNavigateControl} />
      ) : item.id === 'PLAY' ? (
        <PlayButtonVisual onNavigateControl={onNavigateControl} />
      ) : item.id === 'CTRL' ? (
        <CtrlButtonVisual onNavigateControl={onNavigateControl} />
      ) : item.id === 'CLEAR' ? (
        <ClearButtonVisual onNavigateControl={onNavigateControl} />
      ) : item.id === 'TEMP' ? (
        <TempButtonVisual onNavigateControl={onNavigateControl} />
      ) : item.id === 'MUTE' ? (
        <MuteButtonVisual onNavigateControl={onNavigateControl} />
      ) : item.id === 'VB' ? (
        <VBVisual onNavigateControl={onNavigateControl} />
      ) : item.id === 'PITCH' ? (
        <PitchHarmonyVisual color={color} onNavigateControl={onNavigateControl} />
      ) : item.id === 'SCALE' ? (
        <ScaleRootVisual color={color} onNavigateControl={onNavigateControl} />
      ) : item.id === 'VOICING' ? (
        <VoicingVisual color={color} onNavigateControl={onNavigateControl} />
      ) : item.id === 'RANGE' ? (
        <RangeVisual color={color} onNavigateControl={onNavigateControl} />
      ) : (
        <>
          {mode === 'rhythm' && <RhythmVisual id={item.id} color={color} />}
          {mode === 'harmony' && <HarmonyVisual id={item.id} color={color} />}
          {mode === 'control' && <ControlVisual color={color} />}
        </>
      )}

      {item.details?.length > 0 && item.id !== 'VOICING' && item.id !== 'RANGE' && item.id !== 'SCALE' && (
        <>
          <div className="exp-subtitle">Repères Clés</div>
          <div className="exp-details">
            {item.details.slice(0, 6).map((detail, index) => (
              <div key={`${item.id}-detail-${index}`} className="exp-detail-item">
                <InlineControlText text={detail} onNavigateControl={onNavigateControl} />
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

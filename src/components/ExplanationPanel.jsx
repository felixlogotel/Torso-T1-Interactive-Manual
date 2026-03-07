import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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

const VBX_COLOR_MAP = Object.freeze({
  off: { label: 'Off' },
  white: { label: 'White' },
  orange: { label: 'Orange' },
  cyan: { label: 'Cyan' },
  magenta: { label: 'Magenta' },
  blueGrey: { label: 'Blue Grey' },
  darkBlue: { label: 'Dark Blue' },
  blue: { label: 'Blue' },
  brightBlue: { label: 'Bright Blue' },
  dimmedBlue: { label: 'Dimmed Blue' },
  darkGreen: { label: 'Dark Green' },
  green: { label: 'Green' },
  pink: { label: 'Pink' },
  red: { label: 'Red' },
})

const VBX_REFERENCE_FAMILIES = [
  {
    id: 'global',
    title: 'Global Views',
    modes: [
      {
        title: 'Tracks',
        entries: [
          { name: 'Note Track', detail: 'Active Track', color: 'orange' },
          { name: 'CC Track', detail: 'Active Track', color: 'cyan' },
          { name: 'FX Track', detail: 'Active Track', color: 'magenta' },
          { name: 'Track', detail: 'Muted', color: 'blueGrey' },
          { name: 'Tracks', detail: 'Not Selected', color: 'off' },
        ],
      },
      {
        title: 'Pattern',
        entries: [
          { name: 'Pattern', detail: 'Active / Queued', color: 'white' },
          { name: 'Pattern', detail: 'Empty Pattern', color: 'darkBlue' },
          { name: 'Pattern', detail: 'Edited Pattern', color: 'blue' },
          { name: 'Chained', detail: 'Pending Play', color: 'brightBlue' },
          { name: 'Playing Pattern', detail: 'Flashing', color: 'white', flashing: true },
        ],
      },
      {
        title: 'Bank',
        entries: [
          { name: 'Bank', detail: 'Active Bank', color: 'white' },
          { name: 'Bank', detail: 'Empty Bank', color: 'darkGreen' },
          { name: 'Bank', detail: 'Saved Bank', color: 'green' },
          { name: 'Edited', detail: 'Unsaved', color: 'pink' },
        ],
      },
    ],
  },
  {
    id: 'shape',
    title: 'Shape',
    modes: [
      {
        title: 'Shape - Euclidean (Step View)',
        entries: [
          { name: 'Steps', detail: 'Active Steps', color: 'dimmedBlue' },
          { name: 'Pulses', detail: 'Note Pulses', color: 'blueGrey' },
          { name: 'Playhead', detail: 'Position', color: 'white' },
        ],
      },
      {
        title: 'Shape - Euclidean (Pulse View)',
        entries: [
          { name: 'Steps', detail: 'Active Steps', color: 'blueGrey' },
          { name: 'Pulses', detail: 'Note Pulses', color: 'orange' },
        ],
      },
      {
        title: 'Shape - Division',
        entries: [
          { name: 'Note Value', detail: 'Quadruplets', color: 'blueGrey' },
          { name: 'Note Value', detail: 'Triplets', color: 'blue' },
          { name: 'Division', detail: 'Active Div', color: 'white' },
          { name: 'Division', detail: 'Free Running', color: 'pink' },
        ],
      },
      {
        title: 'Shape - Cycles',
        entries: [
          { name: 'Cycle', detail: 'Number', color: 'blueGrey' },
          { name: 'Cycle', detail: 'Playing Cycle', color: 'white' },
          { name: 'Playing Cycle', detail: 'Active Cycle', color: 'blueGrey', flashing: true },
          { name: 'Cycle', detail: 'Edited', color: 'red' },
        ],
      },
      {
        title: 'Shape - Repeats',
        entries: [
          { name: 'Repeats', detail: 'Number', color: 'blueGrey' },
          { name: 'Repeats', detail: 'Infinite', color: 'blue' },
          { name: 'Page', detail: 'Repeat Page', color: 'orange' },
          { name: 'Repeat', detail: 'Active', color: 'white' },
        ],
      },
      {
        title: 'Shape - Repeat Mode',
        entries: [
          { name: 'Choke Mode', detail: 'Top Button', color: 'pink' },
          { name: 'Tail Mode', detail: 'Bottom Button', color: 'pink' },
        ],
      },
      {
        title: 'Shape - Repeats Time',
        entries: [
          { name: 'Repeat Time', detail: 'Quadruplets', color: 'blueGrey' },
          { name: 'Repeat Time', detail: 'Triplets', color: 'blue' },
          { name: 'Repeat Time', detail: 'Active Time', color: 'white' },
          { name: 'Quantize', detail: 'Time', color: 'pink' },
        ],
      },
      {
        title: 'Shape - Repeat Pace',
        entries: [
          { name: 'Pace', detail: 'Fine Resolution', color: 'blueGrey' },
          { name: 'Pace', detail: 'Active Fine Res', color: 'white' },
          { name: 'Pace', detail: 'Active Course', color: 'orange' },
        ],
      },
      {
        title: 'Shape - Voicing',
        entries: [
          { name: 'Order Up', detail: 'Top Button', color: 'pink' },
          { name: 'Order Down', detail: 'Bottom Button', color: 'pink' },
          { name: 'Note Order', detail: 'Active', color: 'white' },
          { name: 'Note Order', detail: 'Selection Page', color: 'orange' },
        ],
      },
      {
        title: 'Shape - Style',
        entries: [
          { name: 'Poly Styles', detail: 'Top 3 Btns', color: 'darkGreen' },
          { name: 'Mono Styles', detail: 'Bottom 3 Btns', color: 'darkGreen' },
        ],
      },
      {
        title: 'Shape - Phrase',
        entries: [
          { name: 'Cadence', detail: 'Top 4 Btns', color: 'darkGreen' },
          { name: "LFO's", detail: 'Bottom 4 Btns', color: 'darkGreen' },
          { name: 'Phrase', detail: 'CV Controlled', color: 'pink' },
          { name: 'Phrase / Style', detail: 'Active', color: 'white' },
        ],
      },
      {
        title: 'Shape - Range',
        entries: [
          { name: 'Rate x2', detail: 'Top Button', color: 'pink' },
          { name: 'Rate /2', detail: 'Bottom Button', color: 'pink' },
          { name: 'Pitch Variation', detail: 'Active', color: 'white' },
          { name: 'Pitch Variation', detail: 'Selection Page', color: 'orange' },
        ],
      },
    ],
  },
  {
    id: 'groove',
    title: 'Groove',
    modes: [
      {
        title: 'Groove (Velocity / Sustain)',
        entries: [
          { name: 'Velocity', detail: 'Active 0-127', color: 'blueGrey' },
          { name: 'Sustain', detail: 'Lit Active', color: 'blueGrey' },
        ],
      },
      {
        title: 'Groove Probability',
        entries: [
          { name: 'Note Phase', detail: 'Notes to Silence', color: 'pink' },
          { name: 'Probability', detail: 'Active', color: 'white' },
          { name: 'Probability', detail: 'Selection Page', color: 'orange' },
        ],
      },
      {
        title: 'Groove - Accent',
        entries: [
          { name: 'Accent', detail: 'Top Button', color: 'pink' },
          { name: 'Accent', detail: 'Bottom Button', color: 'pink' },
          { name: 'Accent', detail: 'Active', color: 'white' },
          { name: 'Accent', detail: 'Selection Page', color: 'orange' },
        ],
      },
      {
        title: 'Groove',
        entries: [
          { name: 'Groove 1-4', detail: 'Top Buttons', color: 'darkGreen' },
          { name: 'Groove 5-8', detail: 'Bottom Buttons', color: 'darkGreen' },
          { name: 'Groove', detail: 'CV Control', color: 'pink' },
        ],
      },
      {
        title: 'Groove - Timing',
        entries: [
          { name: 'Micro-Timing', detail: 'Sub-divisions', color: 'pink' },
          { name: 'Micro-Timing', detail: 'Active', color: 'white' },
          { name: 'Micro-Timing', detail: 'Course Adjust', color: 'orange' },
          { name: 'Micro-Timing', detail: 'Fine Adjust', color: 'blueGrey' },
        ],
      },
      {
        title: 'Groove - Delay',
        entries: [
          { name: 'Delay', detail: 'Active', color: 'white' },
          { name: 'Delay', detail: 'Fixed Intervals', color: 'orange' },
          { name: 'Delay', detail: '+/- Options', color: 'blueGrey' },
        ],
      },
    ],
  },
  {
    id: 'tonal',
    title: 'Tonal',
    modes: [
      {
        title: 'Tonal - Pitch',
        entries: [
          { name: 'Pitch Notes', detail: 'Black Keys', color: 'blue' },
          { name: 'Pitch Notes', detail: 'White Keys', color: 'white' },
          { name: 'Pitch Notes', detail: 'Selected', color: 'orange' },
          { name: 'Notes', detail: 'Out of Scale', color: 'blueGrey' },
          { name: 'Octave', detail: 'Up / Down', color: 'pink' },
        ],
      },
      {
        title: 'Tonal - Scale',
        entries: [
          { name: 'Scale', detail: 'Active', color: 'white' },
          { name: 'Scales', detail: 'Chro, Maj, Min', color: 'blueGrey' },
          { name: 'Scales', detail: 'Other Scales', color: 'blue' },
          { name: 'Scale', detail: 'User Defined', color: 'pink' },
        ],
      },
      {
        title: 'Tonal - Root',
        entries: [
          { name: 'Root Note', detail: 'Selected', color: 'pink' },
          { name: 'Notes', detail: 'Black Keys', color: 'blue' },
          { name: 'Notes', detail: 'White Keys', color: 'white' },
        ],
      },
    ],
  },
  {
    id: 'setup-randomness',
    title: 'Setup + Randomness',
    modes: [
      {
        title: 'Randomness',
        entries: [
          { name: 'Mod Sequence Amount', detail: 'Amount', color: 'pink' },
          { name: 'Modulation', detail: 'Phase Shift', color: 'blueGrey' },
          { name: 'Mod Range', detail: '-100% to 100%', color: 'pink' },
          { name: 'Modulation', detail: 'Active Amount', color: 'white' },
        ],
      },
      {
        title: 'Randomness - Rate',
        entries: [
          { name: 'Random Rate', detail: 'Quadruplets', color: 'blueGrey' },
          { name: 'Random Rate', detail: 'Triplets', color: 'pink' },
          { name: 'Rate', detail: 'Active', color: 'white' },
        ],
      },
      {
        title: 'Setup - Length',
        entries: [
          { name: 'Length', detail: 'In Bars', color: 'green' },
          { name: 'Length', detail: 'Bar Divisions', color: 'darkGreen' },
          { name: 'Length', detail: 'Active', color: 'white' },
          { name: 'Length', detail: 'Infinite', color: 'blue' },
        ],
      },
      {
        title: 'Setup - Quantize',
        entries: [
          { name: 'Quantize', detail: 'In Bars', color: 'green' },
          { name: 'Quantize', detail: 'Bar Divisions', color: 'darkGreen' },
          { name: 'Quantize', detail: 'Active', color: 'white' },
        ],
      },
      {
        title: 'Setup - Channel',
        entries: [
          { name: 'MIDI Channel', detail: 'Active', color: 'white' },
          { name: 'MIDI Channel', detail: 'Available', color: 'darkGreen' },
        ],
      },
      {
        title: 'Tempo',
        entries: [{ name: 'Tempo', detail: 'Active', color: 'blueGrey' }],
      },
    ],
  },
]

const MANUAL_BASE_URL = 'http://downloads.torsoelectronics.com/t-1/manual/T-1%20User%20Manual.pdf'
const MANUAL_PAGE_BY_CONTROL = Object.freeze({
  STEPS: 60,
  PULSES: 60,
  CYCLES: 144,
  DIVISION: 68,
  VELOCITY: 84,
  SUSTAIN: 81,
  REPEATS: 100,
  TIME: 101,
  ACCENT: 86,
  TIMING: 91,
  PITCH: 112,
  VOICING: 128,
  RANGE: 136,
  SCALE: 118,
  TEMPO: 38,
  LENGTH: 70,
  CHANNEL: 44,
  RANDOM: 152,
  PLAY: 34,
  BANK: 35,
  PATTERN: 55,
  CTRL: 34,
  CLEAR: 39,
  TEMP: 141,
  MUTE: 72,
  VB: 57,
})

function getDocReference(item) {
  const primaryLabel = item.id
  const primaryPage = MANUAL_PAGE_BY_CONTROL[primaryLabel]
  if (!primaryPage) return null

  return {
    href: `${MANUAL_BASE_URL}#page=${primaryPage}`,
    title: `Manual reference (${primaryLabel}: p.${primaryPage})`,
  }
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

function SequencerGrid2x8({
  pulseSteps = new Set(),
  manualSteps = new Set(),
}) {
  const rows = [Array.from({ length: 8 }, (_, i) => i), Array.from({ length: 8 }, (_, i) => i + 8)]

  return (
    <div className="exp-seq-grid-wrap">
      {rows.map((row, rowIndex) => (
        <div key={`grid-row-${rowIndex}`} className="exp-seq-grid-row">
          {row.map((index) => {
            const isPulse = pulseSteps.has(index)
            const isManual = manualSteps.has(index)
            return (
              <span
                key={`grid-cell-${index}`}
                className={[
                  'exp-seq-cell',
                  isPulse ? 'is-pulse' : '',
                  isManual ? 'is-manual' : '',
                ].filter(Boolean).join(' ')}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}

function StepsVisual({ onNavigateControl, isFrench = true }) {
  const stepRows = isFrench
    ? [
      { label: '8 steps · cycle court', activeSteps: 8 },
      { label: '12 steps · cycle intermédiaire', activeSteps: 12 },
      { label: '16 steps · cycle complet', activeSteps: 16 },
    ]
    : [
      { label: '8 steps · short cycle', activeSteps: 8 },
      { label: '12 steps · mid cycle', activeSteps: 12 },
      { label: '16 steps · full cycle', activeSteps: 16 },
    ]

  const pageRows = [
    { page: 'Page 1', keyLabel: 'CTRL + BANK', range: '1–16' },
    { page: 'Page 2', keyLabel: 'CTRL + PATTERN', range: '17–32' },
    { page: 'Page 3', keyLabel: 'CTRL + TEMP', range: '33–48' },
    { page: 'Page 4', keyLabel: 'CTRL + MUTE', range: '49–64' },
  ]

  const extensionShortcuts = isFrench
    ? [
      { key: 'Hold CTRL + Turn + STEPS', action: 'Étendre ou réduire la longueur du pattern au-dessus de la limite de base de 16 temps.' },
    ]
    : [
      { key: 'Hold CTRL + Turn + STEPS', action: 'Extend or reduce pattern length beyond the base 16-step limit.' },
    ]

  return (
    <div className="exp-repeat-wrap exp-random-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-steps-length-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'STEPS · longueur du pattern' : 'STEPS · pattern length'}
          </div>
          <div className="exp-shape-stack">
            {stepRows.map((row) => (
              <div key={row.label} className="exp-shape-row">
                <span className="exp-time-label">{row.label}</span>
                <SequencerStrip totalSteps={16} activeSteps={row.activeSteps} highlightActive />
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card exp-steps-extension-card">
          <div className="exp-repeat-card-title">STEPS · {isFrench ? 'extension 17–64' : '17-64 extension'}</div>
          <div className="exp-note-box">
            {isFrench
              ? 'Les steps au-delà de 16 sont répartis sur 4 pages. Utilisez les raccourcis ci-dessous pour étendre ou réduire la longueur et pour changer de page.'
              : 'Steps beyond 16 are distributed across 4 pages. Use the shortcuts below to extend or reduce length and switch pages.'}
          </div>
          <div className="exp-button-mode-grid is-one">
            {extensionShortcuts.map((item) => (
              <div key={item.key} className="exp-button-mode-item">
                <span className="exp-button-mode-key">
                  {normalizeDescriptionText(item.key)}
                </span>
                <span className="exp-button-mode-action">
                  {onNavigateControl ? (
                    <InlineControlText text={normalizeDescriptionText(item.action)} onNavigateControl={onNavigateControl} />
                  ) : (
                    normalizeDescriptionText(item.action)
                  )}
                </span>
              </div>
            ))}
          </div>
          <div className="exp-shape-pages">
            {pageRows.map((row) => (
              <div key={row.page} className="exp-shape-page-card">
                <span className="exp-shape-page-title">{row.page}</span>
                <span className="exp-shape-page-range">{row.range}</span>
                <span className="exp-shape-page-key">{row.keyLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PulsesVisual({ isFrench = true }) {
  const twoPulses = new Set([0, 8]) // steps 1 and 9
  const threePulses = new Set([0, 6, 11]) // steps 1, 7 and 12
  const threePulsesRot2 = new Set(Array.from(threePulses, (step) => wrapGridStep(step + 2, 16)))
  const manualBaseSteps = new Set([2, 12]) // manual additions (VBx), fixed before rotate
  const manualRot2Steps = new Set(Array.from(manualBaseSteps, (step) => wrapGridStep(step + 2, 16)))

  return (
    <div className="exp-repeat-wrap exp-pulses-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'PULSES · distribution euclidienne' : 'PULSES · Euclidean distribution'}
          </div>
          <div className="exp-shape-stack">
            <div className="exp-shape-row">
              <span className="exp-time-label">{isFrench ? '2 pulses' : '2 pulses'}</span>
              <SequencerGrid2x8 pulseSteps={twoPulses} />
            </div>
            <div className="exp-shape-row">
              <span className="exp-time-label">{isFrench ? '3 Pulses' : '3 pulses'}</span>
              <SequencerGrid2x8 pulseSteps={threePulses} />
            </div>
            <div className="exp-shape-row">
              <span className="exp-time-label">Rotate +2</span>
              <SequencerGrid2x8 pulseSteps={threePulsesRot2} />
            </div>
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'PULSES · euclidien + ajouts manuels' : 'PULSES · Euclidean + manual additions'}
          </div>
          <div className="exp-shape-stack">
            <div className="exp-shape-row">
              <span className="exp-time-label">{isFrench ? '2 pulses + manuels' : '2 pulses + manual'}</span>
              <SequencerGrid2x8 pulseSteps={twoPulses} manualSteps={manualBaseSteps} />
            </div>
            <div className="exp-shape-row">
              <span className="exp-time-label">{isFrench ? '3 Pulses + manuels' : '3 pulses + manual'}</span>
              <SequencerGrid2x8 pulseSteps={threePulses} manualSteps={manualBaseSteps} />
            </div>
            <div className="exp-shape-row">
              <span className="exp-time-label">{isFrench ? 'Rotate +2 + manuels' : 'Rotate +2 + manual'}</span>
              <SequencerGrid2x8 pulseSteps={threePulsesRot2} manualSteps={manualRot2Steps} />
            </div>
          </div>
          <div className="exp-shape-legend">
            <span className="exp-shape-legend-item"><i className="is-pulse" />{isFrench ? 'Euclidien' : 'Euclidean'}</span>
            <span className="exp-shape-legend-item"><i className="is-manual" />{isFrench ? 'Manuel' : 'Manual'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function CyclesVisual({ onNavigateControl, isFrench = true }) {
  const activeCycles = new Set([0, 1, 2, 3])
  const editedCycles = new Set([2])
  const currentCycle = 1
  const workflow = isFrench
    ? [
      { step: '1', title: 'Se placer en vue TRACK', detail: 'Dans la BANK et le PATTERN actifs, sélectionner la track à éditer.' },
      { step: '2', title: 'Ouvrir la vue CYCLES', detail: 'Hold ou double-tap CYCLES' },
      { step: '3', title: 'Sélectionner cycle à éditer', detail: 'Press VBx en vue CYCLES (plusieurs possibles)' },
      { step: '4', title: 'BANK passe en rouge', detail: 'Le cycle sélectionné clignote et boucle' },
      { step: '5', title: 'Éditer ce que vous souhaitez', detail: 'Ex: PITCH, ajout de note... les valeurs sont lockées dans le cycle' },
      { step: '6', title: 'Sortir de l’édition', detail: 'Press BANK pour revenir à la vue track normale' },
    ]
    : [
      { step: '1', title: 'Go to TRACK view', detail: 'Within the active BANK and PATTERN, select the track to edit.' },
      { step: '2', title: 'Open CYCLES view', detail: 'Hold or double-tap CYCLES' },
      { step: '3', title: 'Select cycle to edit', detail: 'Press VBx in CYCLES view (multiple possible)' },
      { step: '4', title: 'BANK turns red', detail: 'The selected cycle flashes and loops' },
      { step: '5', title: 'Edit what you need', detail: 'Example: PITCH, note addition... values are locked into that cycle' },
      { step: '6', title: 'Exit edit mode', detail: 'Press BANK to return to normal track view' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-cycles-view">
          <div className="exp-repeat-card-title">{isFrench ? 'CYCLES · vue et états' : 'CYCLES · view and states'}</div>
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
          <div className="exp-shape-legend is-cycles">
            <span className="exp-shape-legend-item"><i className="is-cycle-current" />{isFrench ? 'Cycle courant' : 'Current cycle'}</span>
            <span className="exp-shape-legend-item"><i className="is-active" />{isFrench ? 'Actif' : 'Active'}</span>
            <span className="exp-shape-legend-item"><i className="is-edited" />{isFrench ? 'Éditions' : 'Edits'}</span>
            <span className="exp-shape-legend-item"><i className="is-inactive" />{isFrench ? 'Inactif' : 'Inactive'}</span>
          </div>
          <div className="exp-cycles-legend-divider" aria-hidden="true" />
          <div className="exp-cycles-count-note">
            <InlineControlText
              text={isFrench
                ? 'Nombre de cycles: CTRL + Turn + CYCLES ou CTRL + CYCLES + VBx (1 à 16).'
                : 'Cycle count: CTRL + Turn + CYCLES or CTRL + CYCLES + VBx (1 to 16).'}
              onNavigateControl={onNavigateControl}
            />
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">{isFrench ? 'CYCLES · workflow d’édition' : 'CYCLES · editing workflow'}</div>
          <div className="exp-cycle-flow is-cycles-workflow">
            {workflow.map((item) => (
              <div key={item.step} className="exp-cycle-flow-item">
                <span className="exp-cycle-flow-step">{item.step}</span>
                <div className="exp-cycle-flow-text">
                  <span className="exp-cycle-flow-title">
                    <InlineControlText text={item.title} onNavigateControl={onNavigateControl} />
                  </span>
                  <span className="exp-cycle-flow-detail">
                    <InlineControlText text={item.detail} onNavigateControl={onNavigateControl} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DivisionVisual({ onNavigateControl, isFrench = true }) {
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
        <div className="exp-repeat-card exp-division-select-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'DIVISION · sélection sur clavier VB' : 'DIVISION · VB keyboard selection'}
          </div>
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
          <div className="exp-shape-legend is-division">
            <span className="exp-shape-legend-item"><i className="is-division-quad" />{isFrench ? 'Quadruplets' : 'Straight divisions'}</span>
            <span className="exp-shape-legend-item"><i className="is-division-triplet" />Triplets</span>
            <span className="exp-shape-legend-item"><i className="is-division-unused" />{isFrench ? 'Sans fonction directe' : 'No direct mapping'}</span>
          </div>
          <div className="exp-division-legend-divider" aria-hidden="true" />
          <div className="exp-division-shortcuts-note">
            <InlineControlText
              text={isFrench
                ? 'Sélection rapide: Turn + DIVISION ou press VBx. Mode libre 96 PPQN: CTRL + Turn + DIVISION.'
                : 'Quick selection: Turn + DIVISION or press VBx. Free 96 PPQN mode: CTRL + Turn + DIVISION.'}
              onNavigateControl={onNavigateControl}
            />
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'DIVISION · impact et mode libre' : 'DIVISION · impact and free mode'}
          </div>
          <div className="exp-division-impact">
            <span>
              {isFrench
                ? 'À tempo identique, une division plus fine augmente la densité rythmique perçue. STEPS/PULSES/REPEATS gardent leur structure, mais leur durée réelle change avec DIVISION.'
                : 'At the same tempo, a finer division increases perceived rhythmic density. STEPS/PULSES/REPEATS keep their structure, but real duration changes with DIVISION.'}
            </span>
          </div>
          <div className="exp-cycle-flow is-cycles-workflow">
            <div className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">1</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">
                  <InlineControlText
                    text={isFrench ? 'Voir la division active' : 'Check current division'}
                    onNavigateControl={onNavigateControl}
                  />
                </span>
                <span className="exp-cycle-flow-detail">
                  <InlineControlText
                    text={isFrench ? 'Hold ou double-tap DIVISION' : 'Hold or double-tap DIVISION'}
                    onNavigateControl={onNavigateControl}
                  />
                </span>
              </div>
            </div>
            <div className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">2</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">
                  <InlineControlText
                    text={isFrench ? 'Sélection rapide' : 'Quick selection'}
                    onNavigateControl={onNavigateControl}
                  />
                </span>
                <span className="exp-cycle-flow-detail">
                  <InlineControlText
                    text={isFrench ? 'Turn + DIVISION ou press VBx' : 'Turn + DIVISION or press VBx'}
                    onNavigateControl={onNavigateControl}
                  />
                </span>
              </div>
            </div>
            <div className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">3</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">
                  <InlineControlText
                    text={isFrench ? 'Mode libre 96 PPQN' : '96 PPQN free mode'}
                    onNavigateControl={onNavigateControl}
                  />
                </span>
                <span className="exp-cycle-flow-detail">
                  <InlineControlText
                    text={isFrench
                      ? 'CTRL + Turn + DIVISION (statut blanc clignotant)'
                      : 'CTRL + Turn + DIVISION (flashing white state)'}
                    onNavigateControl={onNavigateControl}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TempoVisual({ onNavigateControl, isFrench = true }) {
  const workflow = isFrench
    ? [
      { step: '1', title: 'Voir le tempo', detail: 'Hold ou double-tap TEMPO' },
      { step: '2', title: 'Ajustement fin', detail: 'Turn + TEMPO: 1 BPM par cran' },
      { step: '3', title: 'Portée', detail: 'Tempo global du BANK' },
      { step: '4', title: 'Clock externe', detail: 'Si Analog/MIDI/Link pilote la clock, le tempo interne est ignoré' },
    ]
    : [
      { step: '1', title: 'Check tempo', detail: 'Hold or double-tap TEMPO' },
      { step: '2', title: 'Fine adjustment', detail: 'Turn + TEMPO: 1 BPM per detent' },
      { step: '3', title: 'Scope', detail: 'Bank-wide global tempo' },
      { step: '4', title: 'External clock', detail: 'If Analog/MIDI/Link drives clock, internal tempo is ignored' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-tempo-edit-card">
        <div className="exp-repeat-card-title">{isFrench ? 'TEMPO · édition' : 'TEMPO · editing'}</div>
        <div className="exp-cycle-flow exp-tempo-edit-flow is-cycles-workflow">
          {workflow.map((item) => (
            <div key={item.step} className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">{item.step}</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">
                  <InlineControlText text={item.title} onNavigateControl={onNavigateControl} />
                </span>
                <span className="exp-cycle-flow-detail">
                  <InlineControlText text={item.detail} onNavigateControl={onNavigateControl} />
                </span>
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

function PlayButtonVisual({ onNavigateControl, isFrench = true }) {
  const flow = isFrench
    ? [
      { step: '1', title: 'Transport principal', detail: 'Press PLAY: start/stop global du T-1' },
      { step: '2', title: 'Mode isolé', detail: 'CTRL + PLAY: lecture locale sans Start/Stop MIDI, Link ni reset analog' },
      { step: '3', title: 'Sécurité live', detail: 'CLEAR + PLAY: panic MIDI (coupe les notes bloquées)' },
    ]
    : [
      { step: '1', title: 'Main transport', detail: 'Press PLAY: global start/stop of the T-1' },
      { step: '2', title: 'Isolated mode', detail: 'CTRL + PLAY: local playback without MIDI Start/Stop, Link, or analog reset' },
      { step: '3', title: 'Live safety', detail: 'CLEAR + PLAY: MIDI panic (cuts stuck notes)' },
    ]

  const commands = isFrench
    ? [
      { key: '[PLAY]', action: 'Démarrer / arrêter le transport' },
      { key: '[CTRL] + [PLAY]', action: 'Play isolé (sans transport externe)' },
      { key: '[CLEAR] + [PLAY]', action: 'Panic: couper toutes les notes MIDI bloquées' },
    ]
    : [
      { key: '[PLAY]', action: 'Start / stop transport' },
      { key: '[CTRL] + [PLAY]', action: 'Isolated play (without external transport)' },
      { key: '[CLEAR] + [PLAY]', action: 'Panic: cut all stuck MIDI notes' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">{isFrench ? 'PLAY · logique transport' : 'PLAY · transport logic'}</div>
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
          title={isFrench ? 'PLAY · commandes directes' : 'PLAY · direct commands'}
          items={commands}
          note={isFrench
            ? 'Point clé: [PLAY] agit sur la lecture globale, tandis que [CTRL]+[PLAY] évite d’envoyer un transport externe.'
            : 'Key point: [PLAY] controls global playback, while [CTRL]+[PLAY] avoids sending external transport.'}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function TempButtonVisual({ onNavigateControl, isFrench = true }) {
  const workflow = isFrench
    ? [
      { step: '1', title: 'Se placer en vue TRACK', detail: 'Press BANK puis sélectionner une ou plusieurs tracks (VBx).' },
      { step: '2', title: 'Variation temporaire', detail: 'Hold TEMP + Turn + Knob.' },
      { step: '3', title: 'Variation relative de pattern', detail: 'Hold TEMP + PATTERN + Turn + Knob.' },
      { step: '4', title: 'Retour état initial', detail: 'Release TEMP restaure les valeurs d’origine.' },
      { step: '5', title: 'Verrouiller TEMP (optionnel)', detail: 'Double-tap TEMP pour garder la sélection active.' },
      { step: '6', title: 'Sauver les changements (optionnel)', detail: 'Hold TEMP + PATTERN + VBx pour enregistrer vers le pattern x.' },
    ]
    : [
      { step: '1', title: 'Go to TRACK view', detail: 'Press BANK, then select one or more tracks (VBx).' },
      { step: '2', title: 'Temporary variation', detail: 'Hold TEMP + Turn + Knob.' },
      { step: '3', title: 'Relative pattern variation', detail: 'Hold TEMP + PATTERN + Turn + Knob.' },
      { step: '4', title: 'Return to initial state', detail: 'Release TEMP to restore original values.' },
      { step: '5', title: 'Lock TEMP (optional)', detail: 'Double-tap TEMP to keep selection active.' },
      { step: '6', title: 'Save changes (optional)', detail: 'Hold TEMP + PATTERN + VBx to save to pattern x.' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-tempo-edit-card">
        <div className="exp-repeat-card-title">{isFrench ? 'TEMP · workflow live' : 'TEMP · live workflow'}</div>
        <div className="exp-cycle-flow exp-tempo-edit-flow is-cycles-workflow">
          {workflow.map((item) => (
            <div key={item.step} className="exp-cycle-flow-item">
              <span className="exp-cycle-flow-step">{item.step}</span>
              <div className="exp-cycle-flow-text">
                <span className="exp-cycle-flow-title">
                  <InlineControlText text={item.title} onNavigateControl={onNavigateControl} />
                </span>
                <span className="exp-cycle-flow-detail">
                  <InlineControlText text={item.detail} onNavigateControl={onNavigateControl} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MuteButtonVisual({ onNavigateControl, isFrench = true }) {
  const trackTypes = Array.from({ length: 16 }, (_, index) => {
    const track = index + 1
    if (track >= 13) return 'fx'
    return 'note'
  })

  const stateRows = isFrench
    ? [
      { label: 'Exemple: track note mutée', muted: [3], armed: [] },
      { label: 'Exemple: track FX mutée', muted: [14], armed: [] },
    ]
    : [
      { label: 'Example: muted note track', muted: [3], armed: [] },
      { label: 'Example: muted FX track', muted: [14], armed: [] },
    ]

  const performanceFlow = isFrench
    ? [
      { step: '1', title: 'Se placer en vue TRACK', detail: 'Press BANK puis sélectionner les tracks si besoin.' },
      { step: '2', title: 'Préparer le mute', detail: 'Hold MUTE + Press VBx (multi-sélection possible).' },
      { step: '3', title: 'MUTE clignote', detail: 'Les tracks ciblées sont armées pour l’action.' },
      { step: '4', title: 'Release MUTE', detail: 'Le mute/unmute est appliqué aux tracks sélectionnées.' },
    ]
    : [
      { step: '1', title: 'Go to TRACK view', detail: 'Press BANK, then select tracks if needed.' },
      { step: '2', title: 'Prepare mute', detail: 'Hold MUTE + Press VBx (multi-select possible).' },
      { step: '3', title: 'MUTE flashes', detail: 'Targeted tracks are armed for the action.' },
      { step: '4', title: 'Release MUTE', detail: 'Mute/unmute is applied to selected tracks.' },
    ]

  const instantFlow = isFrench
    ? [
      { step: '1', title: 'Mode instantané', detail: 'Hold CTRL + MUTE + Press VBx.' },
      { step: '2', title: 'Application immédiate', detail: 'Le mute/unmute est actif sans attendre le release.' },
      { step: '3', title: 'Repère visuel', detail: 'Les tracks mutées passent en BLUE GREY.' },
    ]
    : [
      { step: '1', title: 'Instant mode', detail: 'Hold CTRL + MUTE + Press VBx.' },
      { step: '2', title: 'Immediate apply', detail: 'Mute/unmute is active without waiting for release.' },
      { step: '3', title: 'Visual cue', detail: 'Muted tracks switch to BLUE GREY.' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid exp-mute-grid">
        <div className="exp-repeat-card exp-mute-view-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'MUTE · état des tracks (vue TRACK)' : 'MUTE · track states (TRACK view)'}
          </div>
          <div className="exp-mute-vb-stack">
            {stateRows.map((row) => (
              <div key={row.label} className="exp-mute-vb-row-block">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-mute-vb-grid">
                  {[0, 1].map((line) => (
                    <div key={`${row.label}-line-${line + 1}`} className="exp-mute-vb-line">
                      {Array.from({ length: 8 }, (_, col) => {
                        const index = line * 8 + col
                        const trackIndex = index + 1
                        const baseTone = trackTypes[index]
                        const isMuted = row.muted.includes(trackIndex)
                        const isArmed = row.armed.includes(trackIndex)
                        return (
                          <span
                            key={`${row.label}-${trackIndex}`}
                            className={[
                              'exp-mute-vb-cell',
                              `is-${baseTone}`,
                              isMuted ? 'is-muted' : '',
                              isArmed ? 'is-armed' : '',
                            ].filter(Boolean).join(' ')}
                          >
                            {trackIndex}
                          </span>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="exp-shape-legend is-mute">
            <span className="exp-shape-legend-item"><i className="is-mute-note" />{isFrench ? 'Track note' : 'Note track'}</span>
            <span className="exp-shape-legend-item"><i className="is-mute-fx" />Track FX</span>
            <span className="exp-shape-legend-item"><i className="is-muted-track" />{isFrench ? 'Mutée' : 'Muted'}</span>
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">{isFrench ? 'MUTE · workflow live' : 'MUTE · live workflow'}</div>

          <div className="exp-mute-flow-group">
            <span className="exp-mute-flow-heading">{isFrench ? 'Mute instantané' : 'Instant Muting'}</span>
            <div className="exp-cycle-flow is-cycles-workflow">
              {instantFlow.map((item) => (
                <div key={`instant-${item.step}`} className="exp-cycle-flow-item">
                  <span className="exp-cycle-flow-step">{item.step}</span>
                  <div className="exp-cycle-flow-text">
                    <span className="exp-cycle-flow-title">
                      <InlineControlText text={item.title} onNavigateControl={onNavigateControl} />
                    </span>
                    <span className="exp-cycle-flow-detail">
                      <InlineControlText text={item.detail} onNavigateControl={onNavigateControl} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="exp-mute-flow-group is-separated">
            <span className="exp-mute-flow-heading">{isFrench ? 'Mute performance' : 'Performance Muting'}</span>
            <div className="exp-cycle-flow is-cycles-workflow">
              {performanceFlow.map((item) => (
                <div key={`perf-${item.step}`} className="exp-cycle-flow-item">
                  <span className="exp-cycle-flow-step">{item.step}</span>
                  <div className="exp-cycle-flow-text">
                    <span className="exp-cycle-flow-title">
                      <InlineControlText text={item.title} onNavigateControl={onNavigateControl} />
                    </span>
                    <span className="exp-cycle-flow-detail">
                      <InlineControlText text={item.detail} onNavigateControl={onNavigateControl} />
                    </span>
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

function BankPatternHierarchyVisual({ focus = 'bank', onNavigateControl, isFrench = true }) {
  const levels = isFrench
    ? [
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
    : [
      {
        id: 'bank',
        title: 'BANK',
        meta: '16 banks',
        detail: 'Each bank contains 16 patterns.',
      },
      {
        id: 'pattern',
        title: 'PATTERN',
        meta: '16 patterns / bank',
        detail: 'Each pattern contains 16 tracks.',
      },
      {
        id: 'track',
        title: 'TRACK',
        meta: '16 tracks / pattern',
        detail: 'Each track can contain 16 cycles.',
      },
      {
        id: 'cycle',
        title: 'CYCLE',
        meta: '16 cycles / track',
        detail: 'Parameter variants replayed over time.',
      },
    ]

  const chain = levels.flatMap((level, index) => (
    index < levels.length - 1
      ? [{ type: 'node', level }, { type: 'arrow', id: `${level.id}-arrow` }]
      : [{ type: 'node', level }]
  ))

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-bank-pattern-card">
        <div className="exp-repeat-card-title">STRUCTURE · BANK → PATTERN → TRACK → CYCLE</div>

        <div className="exp-bank-pattern-root">
          <span className="exp-bank-pattern-root-title">T-1 SEQUENCER</span>
          <span className="exp-bank-pattern-root-meta">{isFrench ? 'conteneur global' : 'global container'}</span>
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
      </div>
    </div>
  )
}

function CtrlButtonVisual({ onNavigateControl, isFrench = true }) {
  const principles = isFrench
    ? [
      { step: '1', title: 'Maintenir CTRL', detail: 'Active les fonctions secondaires (labels gris).' },
      { step: '2', title: 'Ajouter le geste', detail: 'Turn + knob, press bouton ou combinaison VB selon le contexte.' },
      { step: '3', title: 'Relâcher CTRL', detail: 'Retour au comportement principal.' },
    ]
    : [
      { step: '1', title: 'Hold CTRL', detail: 'Activates secondary functions (grey labels).' },
      { step: '2', title: 'Add the gesture', detail: 'Turn + knob, press a button, or use a VB combination depending on context.' },
      { step: '3', title: 'Release CTRL', detail: 'Returns to primary behavior.' },
    ]

  const examples = isFrench
    ? [
      { key: '[CTRL] + Turn (knob)', action: 'Fonction secondaire du knob (ex: RAMP, PACE, HARMONY, ROOT...)' },
      { key: '[CTRL] + [BANK] + [VBx]', action: 'Sauvegarder le bank actif' },
      { key: '[CTRL] + [CLEAR]', action: 'Entrer en mode COPY' },
      { key: '[CTRL] + [PLAY]', action: 'Lancer en mode isolé' },
      { key: '[CTRL] + [VBx] (track view)', action: 'Changer le type de track (Note / CC / FX)' },
      { key: '[CTRL] + Turn [TEMPO]', action: 'Régler la luminosité des LEDs' },
    ]
    : [
      { key: '[CTRL] + Turn (knob)', action: 'Secondary knob function (e.g. RAMP, PACE, HARMONY, ROOT...)' },
      { key: '[CTRL] + [BANK] + [VBx]', action: 'Save the active bank' },
      { key: '[CTRL] + [CLEAR]', action: 'Enter COPY mode' },
      { key: '[CTRL] + [PLAY]', action: 'Launch isolated playback' },
      { key: '[CTRL] + [VBx] (track view)', action: 'Change track type (Note / CC / FX)' },
      { key: '[CTRL] + Turn [TEMPO]', action: 'Adjust LED brightness' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">{isFrench ? 'CTRL · principe d’usage' : 'CTRL · usage principle'}</div>
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
          title={isFrench ? 'CTRL · exemples fréquents' : 'CTRL · common examples'}
          items={examples}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function ClearButtonVisual({ onNavigateControl, isFrench = true }) {
  const clearFlow = isFrench
    ? [
      { step: '1', title: 'Choisir la cible', detail: 'Hold CLEAR + VBx (track), ou CLEAR + PATTERN + VBx, ou CLEAR + BANK + VBx.' },
      { step: '2', title: 'Track / Pattern', detail: 'L’effacement s’applique directement sur la cible sélectionnée.' },
      { step: '3', title: 'Bank: confirmation', detail: 'Avec CLEAR + BANK maintenus, press VBx une 2e fois pour confirmer.' },
      { step: '4', title: 'Sortie sans action', detail: 'Release CLEAR (et BANK/PATTERN) pour annuler si besoin.' },
    ]
    : [
      { step: '1', title: 'Choose target', detail: 'Hold CLEAR + VBx (track), or CLEAR + PATTERN + VBx, or CLEAR + BANK + VBx.' },
      { step: '2', title: 'Track / Pattern', detail: 'Clear is applied directly to the selected target.' },
      { step: '3', title: 'Bank: confirmation', detail: 'With CLEAR + BANK held, press VBx a second time to confirm.' },
      { step: '4', title: 'Exit without action', detail: 'Release CLEAR (and BANK/PATTERN) to cancel if needed.' },
    ]

  const copyFlow = isFrench
    ? [
      { step: '1', title: 'Entrer en COPY', detail: 'Hold CTRL + CLEAR (CLEAR devient COPY).' },
      { step: '2', title: 'Sélection source', detail: 'Ajouter TRACK / PATTERN / BANK + VBx source selon ce que tu copies.' },
      { step: '3', title: 'Maintenir la combinaison', detail: 'Garder les touches maintenues pendant la sélection destination.' },
      { step: '4', title: 'Sélection destination', detail: 'Press VBx destination pour coller la copie.' },
    ]
    : [
      { step: '1', title: 'Enter COPY', detail: 'Hold CTRL + CLEAR (CLEAR becomes COPY).' },
      { step: '2', title: 'Select source', detail: 'Add TRACK / PATTERN / BANK + source VBx depending on what you copy.' },
      { step: '3', title: 'Keep combo held', detail: 'Keep buttons held while selecting destination.' },
      { step: '4', title: 'Select destination', detail: 'Press destination VBx to paste the copy.' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">{isFrench ? 'CLEAR · effacer' : 'CLEAR · erase'}</div>
          <div className="exp-clear-intro-box">
            <InlineControlText
              text={isFrench
                ? 'Action destructive: CLEAR remet la cible à l’état vide/défaut.'
                : 'Destructive action: CLEAR resets the target to empty/default state.'}
              onNavigateControl={onNavigateControl}
            />
          </div>
          <div className="exp-cycle-flow is-cycles-workflow">
            {clearFlow.map((item) => (
              <div key={`clear-${item.step}`} className="exp-cycle-flow-item">
                <span className="exp-cycle-flow-step">{item.step}</span>
                <div className="exp-cycle-flow-text">
                  <span className="exp-cycle-flow-title">
                    <InlineControlText text={item.title} onNavigateControl={onNavigateControl} />
                  </span>
                  <span className="exp-cycle-flow-detail">
                    <InlineControlText text={item.detail} onNavigateControl={onNavigateControl} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">{isFrench ? 'COPY · via CTRL + CLEAR' : 'COPY · via CTRL + CLEAR'}</div>
          <div className="exp-copy-intro-box">
            <InlineControlText
              text={isFrench
                ? 'COPY duplique l’état source vers une destination.'
                : 'COPY duplicates the source state to a destination.'}
              onNavigateControl={onNavigateControl}
            />
          </div>
          <div className="exp-cycle-flow is-cycles-workflow">
            {copyFlow.map((item) => (
              <div key={`copy-${item.step}`} className="exp-cycle-flow-item">
                <span className="exp-cycle-flow-step">{item.step}</span>
                <div className="exp-cycle-flow-text">
                  <span className="exp-cycle-flow-title">
                    <InlineControlText text={item.title} onNavigateControl={onNavigateControl} />
                  </span>
                  <span className="exp-cycle-flow-detail">
                    <InlineControlText text={item.detail} onNavigateControl={onNavigateControl} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function VBVisual({ onNavigateControl, isFrench = true }) {
  const [activeFamilyId, setActiveFamilyId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const familyTabs = [{ id: 'all', label: isFrench ? 'Toutes' : 'All' }, ...VBX_REFERENCE_FAMILIES.map((family) => ({ id: family.id, label: family.title }))]
  const baseFamilies = activeFamilyId === 'all'
    ? VBX_REFERENCE_FAMILIES
    : VBX_REFERENCE_FAMILIES.filter((family) => family.id === activeFamilyId)

  const searchLower = searchQuery.trim().toLowerCase()
  const visibleFamilies = useMemo(() => {
    if (!searchLower) return baseFamilies
    return baseFamilies
      .map((family) => {
        const filteredModes = family.modes
          .map((mode) => {
            const filteredEntries = mode.entries.filter(
              (e) =>
                (e.name && e.name.toLowerCase().includes(searchLower)) ||
                (e.detail && e.detail.toLowerCase().includes(searchLower)) ||
                (mode.title && mode.title.toLowerCase().includes(searchLower)) ||
                (family.title && family.title.toLowerCase().includes(searchLower))
            )
            return filteredEntries.length ? { ...mode, entries: filteredEntries } : null
          })
          .filter(Boolean)
        return filteredModes.length ? { ...family, modes: filteredModes } : null
      })
      .filter(Boolean)
  }, [baseFamilies, searchLower])

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-vbx-toolbar">
        <input
          type="search"
          placeholder={isFrench ? 'Rechercher…' : 'Search…'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="exp-vbx-search"
          aria-label={isFrench ? 'Rechercher dans la référence couleur' : 'Search in color reference'}
        />
        <div className="exp-vbx-filter" role="tablist" aria-label={isFrench ? 'Filtrer les vues VB' : 'Filter VB views'}>
        {familyTabs.map((tab) => {
          const isActive = activeFamilyId === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`exp-vbx-filter-btn${isActive ? ' is-active' : ''}`}
              onClick={() => setActiveFamilyId(tab.id)}
            >
              {tab.label}
            </button>
          )
        })}
        </div>
      </div>

      <div className="exp-vbx-family-list">
        {visibleFamilies.map((family) => (
          <section key={family.id} className="exp-vbx-family">
            <div className="exp-vbx-family-head">
              <h3 className="exp-vbx-family-title">{family.title}</h3>
            </div>
            <div className="exp-vbx-mode-grid">
              {family.modes.map((mode) => (
                <article key={`${family.id}-${mode.title}`} className="exp-vbx-mode-card">
                  <div className="exp-vbx-mode-title">{mode.title}</div>
                  <div className="exp-vbx-mode-rows">
                    {mode.entries.map((entry) => {
                      const tone = VBX_COLOR_MAP[entry.color] || VBX_COLOR_MAP.off
                      return (
                        <div key={`${mode.title}-${entry.name}-${entry.detail || ''}`} className="exp-vbx-row">
                          <div className="exp-vbx-row-labels">
                            <span className="exp-vbx-row-main">{entry.name}</span>
                            {entry.detail ? <span className="exp-vbx-row-sub">{entry.detail}</span> : null}
                          </div>
                          <div className="exp-vbx-row-color">
                            <span className="exp-vbx-color-token">
                              <span className="exp-vbx-row-color-label">
                                {tone.label}{entry.flashing ? ` · ${isFrench ? 'Clignotant' : 'Flashing'}` : ''}
                              </span>
                              <span className={`exp-vbx-swatch is-${entry.color}${entry.flashing ? ' is-flashing' : ''}`} />
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

    </div>
  )
}

function LengthQuantizeVisual({ onNavigateControl, isFrench = true }) {
  const lengthButtons = [
    { vb: 1, value: '1', tone: 'bar' },
    { vb: 2, value: '2', tone: 'bar' },
    { vb: 3, value: '3', tone: 'bar' },
    { vb: 4, value: '4', tone: 'bar' },
    { vb: 5, value: '5', tone: 'bar', selected: true },
    { vb: 6, value: '6', tone: 'bar' },
    { vb: 7, value: '7', tone: 'bar' },
    { vb: 8, value: '8', tone: 'bar' },
    { vb: 9, value: 'inf', tone: 'infinite' },
    { vb: 10, value: '1/2', tone: 'sub' },
    { vb: 11, value: '1/4', tone: 'sub' },
    { vb: 12, value: '1/8', tone: 'sub' },
    { vb: 13, value: '1/16', tone: 'sub' },
    { vb: 14, value: '1/32', tone: 'sub' },
    { vb: 15, value: '1/64', tone: 'sub' },
    { vb: 16, value: '16', tone: 'bar' },
  ]

  const quantizeButtons = [
    { vb: 1, value: '1', tone: 'bar', selected: true },
    { vb: 2, value: '2', tone: 'bar' },
    { vb: 3, value: '3', tone: 'bar' },
    { vb: 4, value: '4', tone: 'bar' },
    { vb: 5, value: '5', tone: 'bar' },
    { vb: 6, value: '6', tone: 'bar' },
    { vb: 7, value: '7', tone: 'bar' },
    { vb: 8, value: '8', tone: 'bar' },
    { vb: 9, value: '', tone: 'empty' },
    { vb: 10, value: '1/2', tone: 'sub' },
    { vb: 11, value: '1/4', tone: 'sub' },
    { vb: 12, value: '1/8', tone: 'sub' },
    { vb: 13, value: '', tone: 'empty' },
    { vb: 14, value: '', tone: 'empty' },
    { vb: 15, value: '', tone: 'empty' },
    { vb: 16, value: '16', tone: 'bar' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-length-setup-card exp-steps-length-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'LENGTH · vue et réduction de boucle' : 'LENGTH · view and loop reduction'}
          </div>
          <div className="exp-length-note-box">
            {isFrench
              ? 'LENGTH est stocké au niveau TRACK. Il définit la portion de la track rejouée en boucle.'
              : 'LENGTH is stored at TRACK level. It defines the part of the track that loops.'}
          </div>
          <div className="exp-length-vb-grid">
            {[lengthButtons.slice(0, 8), lengthButtons.slice(8, 16)].map((row, rowIndex) => (
              <div key={`length-row-${rowIndex + 1}`} className="exp-length-vb-row">
                {row.map((entry) => (
                  <div
                    key={`length-vb-${entry.vb}`}
                    className={[
                      'exp-length-vb-cell',
                      `is-${entry.tone}`,
                      entry.selected ? 'is-selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <span className="exp-length-vb-value">{entry.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="exp-shape-legend is-length">
            <span className="exp-shape-legend-item"><i className="is-length-selected" />{isFrench ? 'Sélection' : 'Selection'}</span>
            <span className="exp-shape-legend-item"><i className="is-length-bar" />Bars</span>
            <span className="exp-shape-legend-item"><i className="is-length-sub" />{isFrench ? 'Subdivisions' : 'Subdivisions'}</span>
            <span className="exp-shape-legend-item"><i className="is-length-inf" />Infinite</span>
          </div>
          <div className="exp-length-glitch-box">
            <span className="exp-length-glitch-title">
              {isFrench ? 'Optionnel · Random Start (glitch)' : 'Optional · Random Start (glitch)'}
            </span>
            <InlineControlText
              text={isFrench
                ? 'En vue LENGTH: Press CLEAR pour choisir un point de départ aléatoire du cycle. CLEAR + Turn + LENGTH combine random start et changement de longueur.'
                : 'In LENGTH view: Press CLEAR to choose a random cycle start point. CLEAR + Turn + LENGTH combines random start and length change.'}
              onNavigateControl={onNavigateControl}
            />
          </div>
        </div>

        <div className="exp-repeat-card exp-length-setup-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'QUANTIZE · changement de pattern' : 'QUANTIZE · pattern switching'}
          </div>
          <div className="exp-length-note-box">
            {isFrench
              ? 'QUANTIZE est stocké au niveau PATTERN. Il détermine quand un pattern en attente prend la main (barre ou subdivision).'
              : 'QUANTIZE is stored at PATTERN level. It decides when a queued pattern takes over (bar or subdivision).'}
          </div>
          <div className="exp-length-vb-grid">
            {[quantizeButtons.slice(0, 8), quantizeButtons.slice(8, 16)].map((row, rowIndex) => (
              <div key={`quantize-row-${rowIndex + 1}`} className="exp-length-vb-row">
                {row.map((entry) => (
                  <div
                    key={`quantize-vb-${entry.vb}`}
                    className={[
                      'exp-length-vb-cell',
                      `is-${entry.tone}`,
                      entry.selected ? 'is-selected' : '',
                    ].filter(Boolean).join(' ')}
                  >
                    <span className="exp-length-vb-value">{entry.value}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="exp-shape-legend is-length">
            <span className="exp-shape-legend-item"><i className="is-length-selected" />{isFrench ? 'Sélection' : 'Selection'}</span>
            <span className="exp-shape-legend-item"><i className="is-length-bar" />Bars</span>
            <span className="exp-shape-legend-item"><i className="is-length-sub" />{isFrench ? 'Subdivisions' : 'Subdivisions'}</span>
          </div>
          <div className="exp-length-points">
            <span>
              {isFrench
                ? 'Quantize synchronise le changement de pattern avec le transport.'
                : 'Quantize syncs pattern switching with transport.'}
            </span>
            <span>
              {isFrench
                ? 'Quantize détermine combien de temps le pattern courant joue avant le pattern en file d’attente.'
                : 'Quantize defines how long the current pattern plays before the queued pattern takes over.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ChannelOutputVisual({ onNavigateControl, isFrench = true }) {
  const selectedChannels = new Set([1])
  const routeExamples = [
    { from: 'Track 3 OUT', to: 'Track 9 IN (FX)' },
    { from: 'Track 3 OUT', to: 'Track 12 IN' },
  ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-channel-view-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'CHANNEL · vue par track' : 'CHANNEL · per-track view'}
          </div>
          <div className="exp-channel-grid">
            {Array.from({ length: 16 }, (_, index) => {
              const channel = index + 1
              const isSelected = selectedChannels.has(channel)
              return (
                <div
                  key={`channel-${channel}`}
                  className={[
                    'exp-channel-cell',
                    'is-available',
                    isSelected ? 'is-selected' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {channel}
                </div>
              )
            })}
          </div>
          <div className="exp-shape-legend is-channel">
            <span className="exp-shape-legend-item"><i className="is-channel-selected" />{isFrench ? 'Canal sélectionné' : 'Selected channel'}</span>
            <span className="exp-shape-legend-item"><i className="is-channel-available" />{isFrench ? 'Canal disponible' : 'Available channel'}</span>
          </div>
          <div className="exp-channel-note-box">
            <InlineControlText
              text={isFrench
                ? 'Par défaut, Track N utilise Channel N. Une track peut cibler plusieurs channels en parallèle.'
                : 'By default, Track N uses Channel N. One track can target multiple channels in parallel.'}
              onNavigateControl={onNavigateControl}
            />
          </div>
        </div>

        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'OUTPUT · routage track vers track' : 'OUTPUT · track-to-track routing'}
          </div>
          <div className="exp-output-stack">
            {routeExamples.map((route, index) => (
              <div key={`route-${index}`} className="exp-output-flow">
                <span className="exp-output-node">{route.from}</span>
                <span className="exp-output-arrow">→</span>
                <span className="exp-output-node">{route.to}</span>
              </div>
            ))}
          </div>
          <div className="exp-output-use-box">
            <span className="exp-output-use-title">
              {isFrench ? 'Pourquoi router vers une autre track' : 'Why route to another track'}
            </span>
            <span>
              {isFrench
                ? '1. Envoyer une track source vers une track en mode FX pour que cette deuxième track transforme les notes reçues.'
                : '1. Send a source track into an FX track so that the second track transforms incoming notes.'}
            </span>
            <span>
              {isFrench
                ? '2. Créer des couches complémentaires (une track source, une track de renfort).'
                : '2. Build complementary layers (a source track and a supporting track).'}
            </span>
            <span>
              {isFrench
                ? '3. Construire des chaînes d’évolution plus complexes sans quitter le pattern courant.'
                : '3. Build more complex evolution chains without leaving the current pattern.'}
            </span>
          </div>
          <div className="exp-channel-note-box">
            <InlineControlText
              text={isFrench
                ? 'Fonction avancée: CTRL + CHANNEL + VBx route la sortie de la track courante vers l’entrée d’une autre track.'
                : 'Advanced function: CTRL + CHANNEL + VBx routes the current track output into another track input.'}
              onNavigateControl={onNavigateControl}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function RandomRateVisual({ color, onNavigateControl, isFrench = true }) {
  const probabilityRows = isFrench
    ? [
      { label: 'Random 0% · aucun événement appliqué', appliedSteps: [] },
      { label: 'Random 50% · application partielle', appliedSteps: [1, 3, 5, 8, 11] },
      { label: 'Random 100% · événement toujours appliqué', appliedSteps: Array.from({ length: 12 }, (_, index) => index) },
    ]
    : [
      { label: 'Random 0% · no event applied', appliedSteps: [] },
      { label: 'Random 50% · partial application', appliedSteps: [1, 3, 5, 8, 11] },
      { label: 'Random 100% · event always applied', appliedSteps: Array.from({ length: 12 }, (_, index) => index) },
    ]

  const rateRows = isFrench
    ? [
      { label: 'RATE lent (/2)', activeSteps: [0, 4, 8, 12] },
      { label: 'RATE normal (x1)', activeSteps: [0, 2, 4, 6, 8, 10, 12, 14] },
      { label: 'RATE rapide (x2)', activeSteps: Array.from({ length: 16 }, (_, index) => index) },
    ]
    : [
      { label: 'RATE slow (/2)', activeSteps: [0, 4, 8, 12] },
      { label: 'RATE normal (x1)', activeSteps: [0, 2, 4, 6, 8, 10, 12, 14] },
      { label: 'RATE fast (x2)', activeSteps: Array.from({ length: 16 }, (_, index) => index) },
    ]

  const randomSelectableRows = isFrench
    ? [
      { parameter: 'STEPS', control: 'Cycle', affects: 'Change le nombre de steps à la fin de chaque cycle.' },
      { parameter: 'PULSES', control: 'Cycle', affects: 'Change le nombre de pulses à la fin de chaque cycle.' },
      { parameter: 'CYCLES', control: 'Cycle', affects: 'Probabilité de skip ou repeat d’un cycle.' },
      { parameter: 'DIVISION', control: 'Cycle', affects: 'Probabilité d’appliquer le macro multiplicateur de division; en négatif, inclut aussi triplets/quadruplets.' },
      { parameter: 'VELOCITY', control: 'Cycle', affects: 'Random sur la vélocité des notes du menu pitch.' },
      { parameter: 'PITCH', control: 'Cycle', affects: 'Transpose les notes à chaque cycle.' },
      { parameter: 'SCALE', control: 'Cycle', affects: 'Ajuste l’algorithme de scale (variantes majeures/mineures).' },
      { parameter: 'SUSTAIN', control: 'Rate', affects: 'Random sur la longueur de note.' },
      { parameter: 'REPEATS', control: 'Rate', affects: 'Random sur le nombre de répétitions.' },
      { parameter: 'TIME', control: 'Rate', affects: 'Probabilité d’appliquer le macro multiplicateur de division; en négatif, inclut aussi triplets/quadruplets.' },
      { parameter: 'VOICING', control: 'Rate', affects: 'Ajoute du random au voicing: côté droit/positif sur la range, côté gauche/négatif sur le style.' },
      { parameter: 'RANGE', control: 'Rate', affects: 'Random sur l’amplitude de mouvement mélodique.' },
      { parameter: 'ACCENT', control: 'Rate', affects: 'Random sur la vélocité d’accent.' },
      { parameter: 'TIMING', control: 'Rate', affects: 'Random sur le micro-timing.' },
      { parameter: 'CHANNEL', control: 'Rate', affects: 'Change les notes transmises (gauche: mono, droite: poly).' },
      { parameter: 'PROBABILITY', control: 'Rate', affects: 'Random sur le comportement de probability par pas.' },
      { parameter: 'LENGTH', control: '—', affects: 'Longueur de track + random start (positif).' },
      { parameter: 'CC TRACKS', control: '—', affects: 'Applique la séquence random bi-polaire 16 pas à la valeur d’un paramètre CC track.' },
    ]
    : [
      { parameter: 'STEPS', control: 'Cycle', affects: 'Changes the number of steps at the end of each cycle.' },
      { parameter: 'PULSES', control: 'Cycle', affects: 'Changes the number of pulses at the end of each cycle.' },
      { parameter: 'CYCLES', control: 'Cycle', affects: 'Probability of skipping or repeating a cycle.' },
      { parameter: 'DIVISION', control: 'Cycle', affects: 'Probability of applying the division macro multiplier; on negative values it also includes triplets/quadruplets.' },
      { parameter: 'VELOCITY', control: 'Cycle', affects: 'Applies random variation to note velocity in the pitch menu.' },
      { parameter: 'PITCH', control: 'Cycle', affects: 'Transposes notes on each cycle.' },
      { parameter: 'SCALE', control: 'Cycle', affects: 'Adjusts the scale algorithm (major/minor variants).' },
      { parameter: 'SUSTAIN', control: 'Rate', affects: 'Applies random variation to note length.' },
      { parameter: 'REPEATS', control: 'Rate', affects: 'Applies random variation to repeat count.' },
      { parameter: 'TIME', control: 'Rate', affects: 'Probability of applying the division macro multiplier; on negative values it also includes triplets/quadruplets.' },
      { parameter: 'VOICING', control: 'Rate', affects: 'Adds random voicing: right/positive side on range, left/negative side on style.' },
      { parameter: 'RANGE', control: 'Rate', affects: 'Applies random variation to melodic movement range.' },
      { parameter: 'ACCENT', control: 'Rate', affects: 'Applies random variation to accent velocity.' },
      { parameter: 'TIMING', control: 'Rate', affects: 'Applies random variation to micro-timing.' },
      { parameter: 'CHANNEL', control: 'Rate', affects: 'Changes transmitted notes (left: mono, right: poly).' },
      { parameter: 'PROBABILITY', control: 'Rate', affects: 'Applies random variation to per-step probability behavior.' },
      { parameter: 'LENGTH', control: '—', affects: 'Track length plus positive-side random start behavior.' },
      { parameter: 'CC TRACKS', control: '—', affects: 'Applies the 16-step bipolar random sequence to a CC track parameter value.' },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid exp-random-top-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'RANDOM · probabilité globale d’application' : 'RANDOM · global application probability'}
          </div>
          <div className="exp-random-stack">
            {probabilityRows.map((row) => (
              <div key={row.label} className="exp-random-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-random-strip is-probability">
                  {Array.from({ length: 12 }, (_, index) => (
                    <span
                      key={`${row.label}-${index}`}
                      className={`exp-random-prob-step ${row.appliedSteps.includes(index) ? 'is-applied' : 'is-off'}`}
                      style={{ '--random-color': color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="exp-repeat-card exp-random-rate-card">
          <div className="exp-repeat-card-title">
            {isFrench ? 'RATE · vitesse de la séquence random' : 'RATE · random sequence speed'}
          </div>
          <div className="exp-random-stack">
            {rateRows.map((row) => (
              <div key={row.label} className="exp-random-row">
                <span className="exp-time-label">{row.label}</span>
                <div className="exp-random-strip is-rate">
                  {Array.from({ length: 16 }, (_, index) => (
                    <span
                      key={`${row.label}-${index}`}
                      className={`exp-random-prob-step ${row.activeSteps.includes(index) ? 'is-applied' : 'is-off'}`}
                      style={{ '--random-color': color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="exp-repeat-card exp-random-param-card">
        <div className="exp-repeat-card-title">
          {isFrench ? 'RANDOM + PARAMÈTRE · intensité locale' : 'RANDOM + PARAMETER · local intensity'}
        </div>
        <div className="exp-random-bipolar">
          <span className="is-neg">
            {isFrench
              ? '-100%: côté gauche, souvent mono (selon paramètres compatibles)'
              : '-100%: left side, often mono (depending on compatible parameters)'}
          </span>
          <span className="is-zero">0</span>
          <span className="is-pos">
            {isFrench
              ? '+100%: côté droit, souvent poly (selon paramètres compatibles)'
              : '+100%: right side, often poly (depending on compatible parameters)'}
          </span>
        </div>
        <div className="exp-random-mode-list">
          <div className="exp-random-mode-item">
            <span className="exp-random-mode-key">Hold RANDOM + Turn Knob</span>
            <span className="exp-random-mode-text">
              {isFrench
                ? 'Règle l’intensité bi-polaire du paramètre choisi.'
                : 'Sets the bipolar intensity of the selected parameter.'}
            </span>
          </div>
          <div className="exp-random-mode-item">
            <span className="exp-random-mode-key">Hold RANDOM + Press Knob + VBx</span>
            <span className="exp-random-mode-text">
              {isFrench
                ? 'Sélection fine de la valeur du paramètre.'
                : 'Fine selection of the parameter value.'}
            </span>
          </div>
          <div className="exp-random-mode-item">
            <span className="exp-random-mode-key">Hold RANDOM + Press Knob + VB8 / VB16</span>
            <span className="exp-random-mode-text">
              {isFrench
                ? 'Décale la phase de la séquence random (plus tôt / plus tard).'
                : 'Offsets random sequence phase (earlier / later).'}
            </span>
          </div>
          <div className="exp-random-mode-item">
            <span className="exp-random-mode-key">CTRL + RANDOM + Turn Knob</span>
            <span className="exp-random-mode-text">
              {isFrench
                ? 'Applique du slew (lissage) sur la lane du paramètre.'
                : 'Applies slew (smoothing) on the parameter lane.'}
            </span>
          </div>
        </div>
      </div>

      <div className="exp-repeat-card exp-random-table-card">
        <div className="exp-repeat-card-title">
          {isFrench ? 'RANDOM · paramètres randomisables (manuel)' : 'RANDOM · randomizable parameters (manual)'}
        </div>
        <div className="exp-random-table">
          <div className="exp-random-table-head">
            <span>{isFrench ? 'Paramètre' : 'Parameter'}</span>
            <span>{isFrench ? 'Contrôle' : 'Control'}</span>
            <span>{isFrench ? 'Effet principal' : 'Main effect'}</span>
          </div>
          {randomSelectableRows.map((entry) => (
            <div key={entry.parameter} className="exp-random-table-row">
              <div className="exp-random-table-cell is-param">
                <InlineControlText text={entry.parameter} onNavigateControl={onNavigateControl} />
              </div>
              <div className="exp-random-table-cell is-control">
                <span className="exp-random-control-chip">
                  {entry.control}
                </span>
              </div>
              <div className="exp-random-table-cell is-effect">
                <InlineControlText text={entry.affects} onNavigateControl={onNavigateControl} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function RepeatsVisual({ color, onNavigateControl, isFrench = true }) {
  const repeatBursts = [2, 4, 3, 5, 4]
  const rampUp = [18, 34, 50, 66, 82, 96]
  const rampDown = [96, 82, 66, 50, 34, 18]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card exp-repeat-density">
          <div className="exp-repeat-card-title">
            {isFrench ? 'REPEATS · densité' : 'REPEATS · density'}
          </div>
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
          <div className="exp-repeat-card-title">{isFrench ? 'RAMP · vélocité' : 'RAMP · velocity'}</div>
          <div className="exp-ramp-rows">
            <div className="exp-ramp-row">
              <span className="exp-ramp-label">↗ {isFrench ? 'up' : 'up'}</span>
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
              <span className="exp-ramp-label">↘ {isFrench ? 'down' : 'down'}</span>
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
          text={isFrench
            ? 'Interaction clé: REPEATS fixe la quantité, TIME règle l’espacement, PACE accélère ou décélère la série.'
            : 'Key interaction: REPEATS sets amount, TIME sets spacing, and PACE accelerates or decelerates the series.'}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function TimeVisual({ color, onNavigateControl, isFrench = true }) {
  const timeRows = isFrench
    ? [
      { label: 'TIME bas', gap: 8 },
      { label: 'TIME médian', gap: 14 },
      { label: 'TIME haut', gap: 22 },
    ]
    : [
      { label: 'TIME low', gap: 8 },
      { label: 'TIME medium', gap: 14 },
      { label: 'TIME high', gap: 22 },
    ]

  const paceRows = isFrench
    ? [
      { label: '↗ accel', gaps: [34, 24, 14, 8] },
      { label: '↘ decel', gaps: [8, 14, 24, 34] },
    ]
    : [
      { label: '↗ accel', gaps: [34, 24, 14, 8] },
      { label: '↘ decel', gaps: [8, 14, 24, 34] },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-grid">
        <div className="exp-repeat-card">
          <div className="exp-repeat-card-title">{isFrench ? 'TIME · espacement' : 'TIME · spacing'}</div>
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
          <div className="exp-repeat-card-title">{isFrench ? 'PACE · accélération' : 'PACE · acceleration'}</div>
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
          text={isFrench
            ? 'Interaction clé: TIME définit l’écart entre les répétitions; PACE applique une accélération ou une décélération sur cette série.'
            : 'Key interaction: TIME sets the spacing between repeats; PACE applies acceleration or deceleration across the series.'}
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

function SustainVisual({ color, onNavigateControl, isFrench = true }) {
  const sustainRows = isFrench
    ? [
      { label: 'Sustain 19% · ≈ 1/4 division', lengthSteps: 0.25, starts: [0, 4, 8, 12] },
      { label: 'Sustain 50% · 1x division', lengthSteps: 1, starts: [0, 4, 8, 12] },
      { label: 'Sustain 100% · 16x division', lengthSteps: 16, starts: [0] },
    ]
    : [
      { label: 'Sustain 19% · ~1/4 division', lengthSteps: 0.25, starts: [0, 4, 8, 12] },
      { label: 'Sustain 50% · 1x division', lengthSteps: 1, starts: [0, 4, 8, 12] },
      { label: 'Sustain 100% · 16x division', lengthSteps: 16, starts: [0] },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card">
        <div className="exp-repeat-card-title">
          {isFrench ? 'SUSTAIN · longueur relative à DIVISION' : 'SUSTAIN · length relative to DIVISION'}
        </div>
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
          text={isFrench
            ? 'Interaction clé: Turn [SUSTAIN] règle la longueur de note (pas de sous-menu [CTRL]). La longueur s’applique aussi aux repeats; un nouveau trigger coupe la note précédente. Pour un vrai latch, utiliser Hold [VBx] + tap [CLEAR] (Hold mode).'
            : 'Key interaction: Turn [SUSTAIN] adjusts note length (no [CTRL] sub-menu). Length also applies to repeats; a new trigger cuts the previous note. For true latch behavior, use Hold [VBx] + tap [CLEAR] (Hold mode).'}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function VelocityProbabilityVisual({ color, onNavigateControl, isFrench = true }) {
  const stepKinds = [
    'pulse', 'repeat', 'empty', 'empty',
    'empty', 'empty', 'empty', 'empty',
    'manual', 'repeat', 'empty', 'empty',
    'empty', 'empty', 'empty', 'empty',
  ]

  const probabilityRows = isFrench
    ? [
      { label: 'Prob 0% · aucune note silencée', muted: new Set() },
      { label: 'Prob -30% · Pulses silencés (+ repeats si existants)', muted: new Set([0, 1]) },
      { label: 'Prob +30% · Notes silencées (+ repeats si existants)', muted: new Set([1, 8]) },
    ]
    : [
      { label: 'Prob 0% · no muted notes', muted: new Set() },
      { label: 'Prob -30% · muted pulses (+ repeats if present)', muted: new Set([0, 1]) },
      { label: 'Prob +30% · muted notes (+ repeats if present)', muted: new Set([1, 8]) },
    ]

  return (
    <div className="exp-repeat-wrap">
      <div className="exp-repeat-card exp-probability-card">
        <div className="exp-repeat-card-title">
          {isFrench ? 'PROBABILITY · silence bi-polaire' : 'PROBABILITY · bipolar silence'}
        </div>
        <div className="exp-probability-stack">
          <div className="exp-probability-legend">
            <span className="exp-probability-random-note">
              {isFrench ? 'Note = pulse, note ajoutée à la main ou repeat.' : 'A note can be a pulse, manual note, or repeat.'}
            </span>
            <span className="is-left">
              {isFrench ? '-100% à 0: agit d’abord sur les pulses' : '-100% to 0: acts on pulses first'}
            </span>
            <span className="is-right">
              {isFrench ? '0 à +100%: agit d’abord sur les notes' : '0 to +100%: acts on notes first'}
            </span>
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
              <span>{isFrench ? 'Note ajoutée' : 'Manual note'}</span>
            </div>
          </div>

          <div className="exp-probability-phase">
            <div className="exp-probability-phase-badges">
              <span className="exp-phase-badge">[VB8]</span>
              <span className="exp-phase-arrow">↔</span>
              <span className="exp-phase-badge">[VB16]</span>
              <span className="exp-time-label">{isFrench ? 'Modulation de phase' : 'Phase modulation'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="exp-repeat-link">
        <InlineControlText
          text={isFrench
            ? 'Interaction clé: [CTRL] + Turn [PROBABILITY]. Gauche: probabilité de couper les pulses (leurs repeats suivent). Droite: probabilité de couper des notes individuelles (pulse ou repeat). [VB8]/[VB16]: modulation phase.'
            : 'Key interaction: [CTRL] + Turn [PROBABILITY]. Left side sets probability of muting pulses (their repeats follow). Right side sets probability of muting individual notes (pulse or repeat). [VB8]/[VB16]: phase modulation.'}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function AccentGrooveVisual({ color, isFrench = true }) {
  const profile = [0.44, 0.14, 0.58, 0.2, 0.72, 0.84, 0.2, 0.54, 0.2, 0.56, 0.14, 0.62, 0.18, 0.92, 0.72, 0.18]
  const accentRows = isFrench
    ? [
      { label: 'Accent faible', amount: 0.38 },
      { label: 'Accent moyen', amount: 0.68 },
      { label: 'Accent fort', amount: 1 },
    ]
    : [
      { label: 'Light accent', amount: 0.38 },
      { label: 'Medium accent', amount: 0.68 },
      { label: 'Strong accent', amount: 1 },
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
          <div className="exp-repeat-card-title">
            {isFrench ? 'ACCENT · quantité de variation' : 'ACCENT · variation amount'}
          </div>
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
          <div className="exp-repeat-card-title">
            {isFrench ? 'GROOVE · templates' : 'GROOVE · templates'}
          </div>
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

function TimingDelayVisual({ color, isFrench = true }) {
  const totalSteps = 8
  const beats = 2
  const baseStartSteps = [0, 2, 4, 6]
  const timingFocusColor = '#e6b44a'
  const timingTopRow = isFrench
    ? [
      { vb: 'VB1', role: 'Réglage fin', tone: 'fine' },
      { vb: 'VB2', role: 'Réglage fin', tone: 'fine' },
      { vb: 'VB3', role: 'Réglage fin', tone: 'fine' },
      { vb: 'VB4', role: 'On-grid', tone: 'center' },
      { vb: 'VB5', role: 'Réglage fin', tone: 'fine' },
      { vb: 'VB6', role: 'Réglage fin', tone: 'fine' },
      { vb: 'VB7', role: 'Réglage fin', tone: 'fine' },
      { vb: 'VB8', role: 'Division x2', tone: 'division' },
    ]
    : [
      { vb: 'VB1', role: 'Fine adjust', tone: 'fine' },
      { vb: 'VB2', role: 'Fine adjust', tone: 'fine' },
      { vb: 'VB3', role: 'Fine adjust', tone: 'fine' },
      { vb: 'VB4', role: 'On-grid', tone: 'center' },
      { vb: 'VB5', role: 'Fine adjust', tone: 'fine' },
      { vb: 'VB6', role: 'Fine adjust', tone: 'fine' },
      { vb: 'VB7', role: 'Fine adjust', tone: 'fine' },
      { vb: 'VB8', role: 'Division x2', tone: 'division' },
    ]

  const timingBottomRow = isFrench
    ? [
      { vb: 'VB9', role: 'Coarse + tôt', tone: 'early' },
      { vb: 'VB10', role: 'Coarse + tôt', tone: 'early' },
      { vb: 'VB11', role: 'Coarse + tôt', tone: 'early' },
      { vb: 'VB12', role: 'On-grid', tone: 'center' },
      { vb: 'VB13', role: 'Coarse + tard', tone: 'late' },
      { vb: 'VB14', role: 'Coarse + tard', tone: 'late' },
      { vb: 'VB15', role: 'Coarse + tard', tone: 'late' },
      { vb: 'VB16', role: 'Division x4', tone: 'division' },
    ]
    : [
      { vb: 'VB9', role: 'Coarse + early', tone: 'early' },
      { vb: 'VB10', role: 'Coarse + early', tone: 'early' },
      { vb: 'VB11', role: 'Coarse + early', tone: 'early' },
      { vb: 'VB12', role: 'On-grid', tone: 'center' },
      { vb: 'VB13', role: 'Coarse + late', tone: 'late' },
      { vb: 'VB14', role: 'Coarse + late', tone: 'late' },
      { vb: 'VB15', role: 'Coarse + late', tone: 'late' },
      { vb: 'VB16', role: 'Division x4', tone: 'division' },
    ]

  const timingRows = isFrench
    ? [
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
    : [
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
        label: 'Timing earlier',
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
        label: 'Timing later',
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

  const delayRows = isFrench
    ? [
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
    : [
      {
        label: 'Delay on-grid',
        events: buildNormalizedGridEvents({ totalSteps, beats, startSteps: baseStartSteps, lengthSteps: 1 }),
      },
      {
        label: 'Delay earlier',
        events: buildNormalizedGridEvents({
          totalSteps,
          beats,
          startSteps: baseStartSteps,
          lengthSteps: 1,
          shiftByIndex: { 0: -0.75, 1: -0.75, 2: -0.75, 3: -0.75 },
        }),
      },
      {
        label: 'Delay later',
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
        <div className="exp-repeat-card-title">
          {isFrench ? 'TIMING · REGLAGE TIMING EN APPUYANT' : 'TIMING · PRESS-EDIT MAPPING'}
        </div>
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
          <div className="exp-repeat-card-title">
            {isFrench ? 'TIMING · micro-shift' : 'TIMING · micro-shift'}
          </div>
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
          <div className="exp-repeat-card-title">
            {isFrench ? 'DELAY · décalage track' : 'DELAY · track offset'}
          </div>
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

function PitchHarmonyVisual({ color, onNavigateControl, isFrench = true }) {
  const pitchRows = isFrench
    ? [
      { label: 'PITCH source', intervals: [0, 2, 4, 5, 7], fundamentalIndex: 0 },
      { label: 'PITCH +1 (gamme définie par "Scale")', intervals: [2, 4, 5, 7, 9], fundamentalIndex: 0 },
      { label: 'PITCH -1 (gamme définie par "Scale")', intervals: [-1, 0, 2, 4, 5], fundamentalIndex: 0 },
    ]
    : [
      { label: 'PITCH source', intervals: [0, 2, 4, 5, 7], fundamentalIndex: 0 },
      { label: 'PITCH +1 (scale defined by "Scale")', intervals: [2, 4, 5, 7, 9], fundamentalIndex: 0 },
      { label: 'PITCH -1 (scale defined by "Scale")', intervals: [-1, 0, 2, 4, 5], fundamentalIndex: 0 },
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
          <div className="exp-repeat-card-title">{isFrench ? 'PITCH · transposition' : 'PITCH · transposition'}</div>
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
          <div className="exp-repeat-card-title">{isFrench ? "HARMONY · variation d'accord" : 'HARMONY · chord variation'}</div>
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
          text={isFrench
            ? 'Interaction clé: Hold [CTRL] + Turn [HARMONY]. +3, -4 ou +2 correspondent à des crans de knob. À chaque cran, une seule note est déplacée dans la scale active. La note ciblée est choisie automatiquement par l’algorithme, avec une recette interne souvent perçue comme aléatoire.'
            : 'Key interaction: Hold [CTRL] + Turn [HARMONY]. +3, -4 or +2 match knob detents. At each detent, one note is moved in the active scale. The targeted note is chosen automatically by the algorithm, using an internal recipe often perceived as random.'}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function ScaleRootVisual({ color, onNavigateControl, isFrench = true }) {
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
        <div className="exp-repeat-card-title">
          {isFrench ? 'SCALE + ROOT · notes résultantes' : 'SCALE + ROOT · resulting notes'}
        </div>
        <div className="exp-scale-tool">
          <div className="exp-scale-tool-group">
            <span className="exp-voicing-label">{isFrench ? 'Sélectionner la root note' : 'Select root note'}</span>
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
            <span className="exp-voicing-label">{isFrench ? 'Sélectionner la scale' : 'Select scale'}</span>
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
              <div className="exp-active-notes-title">{isFrench ? 'Visualisation des notes actives' : 'Active notes preview'}</div>
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

                <div className="exp-mini-keyboard" aria-label={isFrench ? 'Clavier chromatique' : 'Chromatic keyboard'}>
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
              <div className="exp-user-scale-title">{isFrench ? 'USER scale · comment ça marche' : 'USER scale · how it works'}</div>
              <div className="exp-user-scale-steps">
                <div>{isFrench ? '1. Mettre ROOT sur C comme référence.' : '1. Set ROOT to C as reference.'}</div>
                <div>{isFrench ? '2. Hold (SCALE) + Hold [VB16] pour entrer l’édition USER.' : '2. Hold (SCALE) + Hold [VB16] to enter USER edit mode.'}</div>
                <div>{isFrench ? '3. Presser [VBx] pour retirer/ajouter des notes dans la USER scale.' : '3. Press [VBx] to remove/add notes in the USER scale.'}</div>
                <div>{isFrench ? '4. Relâcher (SCALE) + [VB16] pour valider.' : '4. Release (SCALE) + [VB16] to confirm.'}</div>
              </div>
              <div className="exp-user-scale-note">
                {isFrench
                  ? 'La USER scale dépend de ton réglage track par track, donc il n’y a pas de tableau fixe ici.'
                  : 'USER scale depends on per-track settings, so there is no fixed table here.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VoicingVisual({ color, onNavigateControl, isFrench = true }) {
  const voicingRows = isFrench
    ? [
      { label: 'voicing plus', values: [24, 50, 74, 94] },
      { label: 'voicing moins', values: [94, 74, 50, 24] },
    ]
    : [
      { label: 'voicing up', values: [24, 50, 74, 94] },
      { label: 'voicing down', values: [94, 74, 50, 24] },
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
          <div className="exp-repeat-card-title">
            {isFrench ? 'VOICING · ordre / octaves' : 'VOICING · order / octaves'}
          </div>
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
          <div className="exp-repeat-card-title">
            {isFrench ? 'STYLE · mapping VBx' : 'STYLE · VBx mapping'}
          </div>
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
          text={isFrench
            ? 'Interaction clé: PITCH/HARMONY choisissent les notes, VOICING/STYLE organisent leur lecture. VB8/VB16 pilotent la direction pour les styles Up/Down et Climb Up/Down.'
            : 'Key interaction: PITCH/HARMONY choose the notes, while VOICING/STYLE organize playback. VB8/VB16 control direction for Up/Down and Climb Up/Down styles.'}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

function RangeVisual({ color, onNavigateControl, isFrench = true }) {
  const rangeRows = isFrench
    ? [
      { label: 'RANGE bas', intervals: [0, -1, 1, -1, 1], fundamentalIndex: 0 },
      { label: 'RANGE médian', intervals: [0, 3, -3, 2, -2], fundamentalIndex: 0 },
      { label: 'RANGE haut', intervals: [0, 7, -7, 12, -12], fundamentalIndex: 0 },
    ]
    : [
      { label: 'RANGE low', intervals: [0, -1, 1, -1, 1], fundamentalIndex: 0 },
      { label: 'RANGE medium', intervals: [0, 3, -3, 2, -2], fundamentalIndex: 0 },
      { label: 'RANGE high', intervals: [0, 7, -7, 12, -12], fundamentalIndex: 0 },
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
          <div className="exp-repeat-card-title">
            {isFrench ? 'RANGE · étendue / rate' : 'RANGE · span / rate'}
          </div>
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
          text={isFrench
            ? 'Interaction clé: PHRASE définit la forme mélodique, RANGE applique l’étendue et la vitesse; le rendu dépend aussi des notes fixées par PITCH/HARMONY et du comportement VOICING/STYLE.'
            : 'Key interaction: PHRASE defines melodic shape, RANGE sets span and motion speed; the result also depends on notes selected in PITCH/HARMONY and on VOICING/STYLE behavior.'}
          onNavigateControl={onNavigateControl}
        />
      </div>
    </div>
  )
}

export default function ExplanationPanel({ item, onNavigateControl }) {
  const { i18n } = useTranslation()
  const language = String(i18n.resolvedLanguage || i18n.language || 'fr').toLowerCase()
  const isFrench = language.startsWith('fr')

  if (!item) {
    return (
      <section className="exp-panel">
        <p className="exp-placeholder">
          {isFrench
            ? 'Sélectionne un bouton/knob sur le Torso pour afficher une explication détaillée ici.'
            : 'Select a Torso button/knob to display a detailed explanation here.'}
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
  const docReference = getDocReference(item)

  const usageSupplement = isFrench
    ? (USAGE_HINTS[item.id] || item.notes || null)
    : (item.notes || null)

  const mergedDescription = isFrench
    ? (item.id === 'REPEATS'
    ? 'REPEATS ajoute des notes après chaque pulse. RAMP applique une rampe de vélocité sur cette série de répétitions. TIME et PACE agissent directement sur ces répétitions.'
      : item.id === 'STEPS'
      ? 'STEPS définit la longueur du pattern euclidien. En tournant, les pulses euclidiens sont redistribués automatiquement sur la nouvelle longueur. La longueur peut être étendue jusqu’à 64 steps (4 pages de 16).'
      : item.id === 'PULSES'
      ? 'PULSES règle combien de pulses euclidiens sont distribués dans les steps. Tu peux aussi ajouter ou retirer des pulses manuellement en vue PULSES via les VBx.'
      : item.id === 'CYCLES'
      ? 'CYCLES crée des variantes de la même track dans le temps. Par défaut, 4 cycles actifs sont présents. Tu peux ensuite éditer certains cycles pour créer une progression. Chaque cycle rejoue sa propre version des paramètres.'
      : item.id === 'DIVISION'
      ? 'DIVISION fixe la valeur rythmique des steps de la track. Tu peux choisir un preset de division via les VBx, ou passer en division libre haute résolution avec CTRL + Turn DIVISION.'
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
      ? 'LENGTH réduit la fenêtre de lecture de la track: la boucle rejoue cette longueur en continu au niveau track. QUANTIZE est stocké au niveau pattern: il synchronise le changement de pattern avec le transport et fixe le moment où le pattern en attente démarre.'
      : item.id === 'CHANNEL'
      ? 'CHANNEL assigne un ou plusieurs canaux MIDI (1–16) à la track, avec Track N -> Channel N par défaut. OUTPUT permet un routage track-vers-track (sortie de la track courante vers l’entrée d’une autre), utile pour des traitements internes/FX.'
      : item.id === 'RANDOM'
      ? 'Probabilité globale d’application: Turn + RANDOM.\nRégler la vitesse de la séquence: CTRL + Turn + RANDOM.\nRégler l’intensité du paramètre ciblé: Hold + RANDOM + Turn + Knob.'
      : item.id === 'BANK'
      ? 'BANK est le niveau d’organisation le plus haut dans le T-1: 1 sequencer contient 16 banks, et chaque bank contient 16 patterns. Quand tu changes de bank, tu changes donc de “dossier” complet de patterns. Le [TEMPO] est stocké au niveau bank.'
      : item.id === 'PATTERN'
      ? 'PATTERN vit toujours à l’intérieur de la bank active: 16 patterns par bank. Chaque pattern contient 16 tracks, et chaque track peut contenir jusqu’à 16 cycles. Le [QUANTIZE] est stocké au niveau pattern, alors que [LENGTH] est stocké au niveau track.'
      : item.id === 'PLAY'
      ? 'PLAY contrôle le transport global du T-1 (start/stop). [CTRL] + [PLAY] lance en mode isolé sans transport externe (MIDI/Link/reset analog). [CLEAR] + [PLAY] envoie un panic MIDI pour couper les notes bloquées.'
      : item.id === 'CTRL'
      ? 'CTRL est le modificateur global du T-1: maintiens-le pour accéder aux fonctions secondaires des knobs et boutons. C’est la porte d’entrée des actions avancées (save bank, copy, modes secondaires, etc.).'
      : item.id === 'CLEAR'
      ? 'CLEAR efface selon la combinaison active (track, pattern ou bank).\nAvec CTRL, CLEAR devient COPY pour dupliquer tracks, patterns et banks via source -> destination.'
      : item.id === 'TEMP'
      ? 'TEMP applique des variations de performance temporaires: Hold TEMP + Turn Knob, puis relâchement = retour automatique à la valeur d’origine. C’est pensé pour le jeu live sans détruire les réglages de base.'
      : item.id === 'MUTE'
      ? 'MUTE gère l’état des tracks en live.\nLes tracks FX gardent leur couleur tant qu’elles ne sont pas mutées.\nHold MUTE + VBx prépare l’action au relâchement; CTRL + MUTE + VBx applique un mute/unmute immédiat.'
      : item.id === 'VB'
      ? 'Les 16 Value Buttons (VB1–VB16) sont contextuels: leur fonction et leur couleur changent selon la vue active (BANK, PATTERN, TRACK, PULSES, PITCH, etc.). Le guide ci-dessous reprend la référence couleur complète (section 2.10) mode par mode.'
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
      .join(' '))
    : (item.id === 'RANDOM'
      ? 'Global application probability: Turn + RANDOM.\nSet sequence speed: CTRL + Turn + RANDOM.\nSet targeted parameter intensity: Hold + RANDOM + Turn + Knob.'
      : item.id === 'CTRL'
      ? 'CTRL is the global modifier of the T-1: hold it to access secondary knob and button functions. It is the entry point for advanced actions (save bank, copy, secondary modes, etc.).'
      : item.id === 'REPEATS'
      ? 'REPEATS adds notes after each pulse. RAMP applies a velocity ramp over this repeat series. TIME and PACE directly shape these repeats.'
      : item.id === 'STEPS'
      ? 'STEPS defines Euclidean pattern length. When turning it, Euclidean pulses are automatically redistributed over the new length. Length can be extended up to 64 steps (4 pages of 16).'
      : item.id === 'PULSES'
      ? 'PULSES sets how many Euclidean pulses are distributed across the steps. You can also add or remove pulses manually in PULSES view via VBx.'
      : item.id === 'CYCLES'
      ? 'CYCLES creates time-based variants of the same track. By default, 4 active cycles are present. You can edit selected cycles to create progression. Each cycle replays its own parameter state.'
      : item.id === 'DIVISION'
      ? 'DIVISION sets the rhythmic value of track steps. You can select a division preset via VBx, or switch to high-resolution free division with CTRL + Turn DIVISION.'
      : item.id === 'SUSTAIN'
      ? 'SUSTAIN sets note length as a percentage, relative to DIVISION. This length applies to pulses and repeats; a new trigger cuts the previous note.'
      : item.id === 'VELOCITY'
      ? 'VELOCITY sets base note velocity (1–127, default 100). PROBABILITY acts in bipolar random mode: toward -100% (left), it first mutes pulses (and their repeats); toward +100% (right), it mutes individual notes (pulse or repeat).'
      : item.id === 'TIME'
      ? 'TIME sets spacing between repeats generated by REPEATS. PACE accelerates or decelerates that same movement.'
      : item.id === 'ACCENT'
      ? 'ACCENT controls velocity variation around the VELOCITY base. GROOVE selects the variation shape (8 templates), so ACCENT and GROOVE work together.'
      : item.id === 'TIMING'
      ? 'TIMING works on 2 levels: level 1, in button view, choose candidate notes and subdivision (VB8 x2, VB16 x4, both = x1). Level 2, adjust micro-shift amount earlier or later. DELAY is separate: CTRL + DELAY shifts the whole track earlier or later.'
      : item.id === 'LENGTH'
      ? 'LENGTH reduces the track playback window: the loop continuously replays this length at track level. QUANTIZE is stored at pattern level: it syncs pattern switching with transport and defines when the queued pattern starts.'
      : item.id === 'CHANNEL'
      ? 'CHANNEL assigns one or more MIDI channels (1–16) to the track, with Track N -> Channel N by default. OUTPUT enables track-to-track routing (current track output into another track input), useful for internal processing/FX.'
      : item.id === 'PITCH'
      ? 'PITCH builds a note group according to the active SCALE, then transposes this group in the scale. HARMONY creates chord variations: each knob detent moves one note in the active scale. The note is selected automatically by the algorithm (internal recipe, often perceived as random).'
      : item.id === 'SCALE'
      ? 'SCALE defines the note pool used by tonal functions. ROOT changes the scale reference note, without automatically transposing notes already recorded in PITCH.'
      : item.id === 'VOICING'
      ? 'VOICING redistributes notes from PITCH across octaves. STYLE defines playback logic, while HARMONY can change base notes before this processing.'
      : item.id === 'RANGE'
      ? 'RANGE controls melodic span and transformation speed of notes coming from PITCH. PHRASE selects movement shape (8 templates), and final result also depends on VOICING/STYLE.'
      : item.id === 'TEMPO'
      ? 'TEMPO sets the bank-wide BPM (24–280). Turn TEMPO adjusts finely (1 BPM per detent). If an external clock takes over, internal tempo is no longer master.'
      : item.id === 'BANK'
      ? 'BANK is the highest organization level in the T-1: 1 sequencer contains 16 banks, and each bank contains 16 patterns. Changing bank switches the full pattern folder. [TEMPO] is stored at bank level.'
      : item.id === 'PATTERN'
      ? 'PATTERN always lives inside the active bank: 16 patterns per bank. Each pattern contains 16 tracks, and each track can contain up to 16 cycles. [QUANTIZE] is stored at pattern level, while [LENGTH] is stored at track level.'
      : item.id === 'PLAY'
      ? 'PLAY controls the global transport of the T-1 (start/stop). [CTRL] + [PLAY] launches isolated mode without external transport (MIDI/Link/analog reset). [CLEAR] + [PLAY] sends MIDI panic to cut stuck notes.'
      : item.id === 'CLEAR'
      ? 'CLEAR erases according to the active combination (track, pattern, or bank).\nWith CTRL, CLEAR becomes COPY to duplicate tracks, patterns, and banks via source -> destination.'
      : item.id === 'TEMP'
      ? 'TEMP applies temporary performance variations: Hold TEMP + Turn Knob, then release = automatic return to the original value. It is designed for live play without destroying base settings.'
      : item.id === 'MUTE'
      ? 'MUTE manages track states in live context.\nFX tracks keep their color while they are not muted.\nHold MUTE + VBx prepares the action on release; CTRL + MUTE + VBx applies immediate mute/unmute.'
      : item.id === 'VB'
      ? 'The 16 Value Buttons (VB1–VB16) are contextual: their role and color change depending on active view (BANK, PATTERN, TRACK, PULSES, PITCH, etc.). The guide below summarizes the complete color reference (section 2.10) mode by mode.'
      : [item.description, usageSupplement]
        .filter(Boolean)
        .filter((part, index, arr) => arr.indexOf(part) === index)
        .join(' '))

  return (
    <section className="exp-panel">
      <div className="exp-header">
        <div className="exp-chip" style={{ color, borderColor: `${color}4a`, background: `${color}18` }}>
          {(item.label || item.id)}{displaySecondary ? ` / ${displaySecondary}` : ''}
        </div>
        {docReference && (
          <a
            className="exp-doc-link"
            href={docReference.href}
            target="_blank"
            rel="noopener noreferrer"
            title={docReference.title}
          >
            <span className="exp-doc-link-label">DOCUMENTATION</span>
            <svg className="exp-doc-link-icon" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
      </div>

      <p className={`exp-description${item.id === 'RANDOM' || item.id === 'MUTE' || item.id === 'CLEAR' ? ' is-random' : ''}`}>
        <InlineControlText text={normalizeDescriptionText(mergedDescription)} onNavigateControl={onNavigateControl} />
      </p>

      {item.id === 'STEPS' ? (
        <StepsVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'PULSES' ? (
        <PulsesVisual isFrench={isFrench} />
      ) : item.id === 'CYCLES' ? (
        <CyclesVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'DIVISION' ? (
        <DivisionVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'VELOCITY' ? (
        <VelocityProbabilityVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'SUSTAIN' ? (
        <SustainVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'REPEATS' ? (
        <RepeatsVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'TIME' ? (
        <TimeVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'ACCENT' ? (
        <AccentGrooveVisual color={color} isFrench={isFrench} />
      ) : item.id === 'TIMING' ? (
        <TimingDelayVisual color={color} isFrench={isFrench} />
      ) : item.id === 'TEMPO' ? (
        <TempoVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'LENGTH' ? (
        <LengthQuantizeVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'CHANNEL' ? (
        <ChannelOutputVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'RANDOM' ? (
        <RandomRateVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'BANK' ? (
        <BankPatternHierarchyVisual focus="bank" onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'PATTERN' ? (
        <BankPatternHierarchyVisual focus="pattern" onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'PLAY' ? (
        <PlayButtonVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'CTRL' ? (
        <CtrlButtonVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'CLEAR' ? (
        <ClearButtonVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'TEMP' ? (
        <TempButtonVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'MUTE' ? (
        <MuteButtonVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'VB' ? (
        <VBVisual onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'PITCH' ? (
        <PitchHarmonyVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'SCALE' ? (
        <ScaleRootVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'VOICING' ? (
        <VoicingVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : item.id === 'RANGE' ? (
        <RangeVisual color={color} onNavigateControl={onNavigateControl} isFrench={isFrench} />
      ) : (
        <>
          {mode === 'rhythm' && <RhythmVisual id={item.id} color={color} />}
          {mode === 'harmony' && <HarmonyVisual id={item.id} color={color} />}
          {mode === 'control' && <ControlVisual color={color} />}
        </>
      )}

      {item.details?.length > 0 && item.id !== 'VOICING' && item.id !== 'RANGE' && item.id !== 'SCALE' && (
        <>
          <div className="exp-subtitle">{isFrench ? 'Repères Clés' : 'Key Points'}</div>
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

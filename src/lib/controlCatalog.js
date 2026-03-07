import { BUTTONS, KNOBS, SECTIONS } from '../data/params.js'

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const CONTROL_ENTRIES = [
  ...KNOBS.map((item) => ({
    id: item.id,
    type: 'knob',
    label: item.label,
    secondary: item.secondary,
    color: item.section ? SECTIONS[item.section]?.color || '#8890c0' : item.color || '#8890c0',
    data: item,
  })),
  ...BUTTONS.map((item) => ({
    id: item.id,
    type: 'button',
    label: item.label,
    secondary: item.secondary,
    color: item.color || '#8890c0',
    data: item,
  })),
]

const CONTROL_BY_ID = new Map(CONTROL_ENTRIES.map((item) => [item.id, item]))
const CONTROL_ALIAS_MAP = new Map()

function registerAlias(alias, id, source = 'primary') {
  if (!alias) return
  const normalizedAlias = String(alias).toUpperCase()
  const existing = CONTROL_ALIAS_MAP.get(normalizedAlias)

  // Prefer primary labels over secondary aliases when collisions happen.
  if (existing?.source === 'primary' && source !== 'primary') return

  CONTROL_ALIAS_MAP.set(normalizedAlias, { id, source })
}

for (const control of CONTROL_ENTRIES) {
  registerAlias(control.label, control.id, 'primary')
  registerAlias(control.secondary, control.id, 'secondary')
}

registerAlias('VB', 'VB', 'primary')
registerAlias('VBX', 'VB', 'primary')

for (let index = 1; index <= 16; index += 1) {
  registerAlias(`VB${index}`, 'VB', 'primary')
}

const CONTROL_ALIAS_PATTERN = Array.from(CONTROL_ALIAS_MAP.keys())
  .sort((left, right) => right.length - left.length)
  .map(escapeRegex)
  .join('|')

const CONTROL_REFERENCE_REGEX = CONTROL_ALIAS_PATTERN
  ? new RegExp(`(?<![A-Z0-9])(${CONTROL_ALIAS_PATTERN})(?![A-Z0-9])`, 'gi')
  : null

export function getControlById(id) {
  return CONTROL_BY_ID.get(id) || null
}

export function splitTextWithControls(text) {
  const source = String(text ?? '')

  if (!source || !CONTROL_REFERENCE_REGEX) {
    return [{ type: 'text', value: source }]
  }

  const parts = []
  let lastIndex = 0

  for (const match of source.matchAll(CONTROL_REFERENCE_REGEX)) {
    const [value] = match
    const start = match.index ?? 0
    const end = start + value.length
    const hasWrappingBrackets = start > 0
      && end < source.length
      && source[start - 1] === '['
      && source[end] === ']'

    const tokenStart = hasWrappingBrackets ? start - 1 : start
    const tokenEnd = hasWrappingBrackets ? end + 1 : end

    if (tokenStart > lastIndex) {
      parts.push({ type: 'text', value: source.slice(lastIndex, tokenStart) })
    }

    const aliasEntry = CONTROL_ALIAS_MAP.get(value.toUpperCase())
    const isUppercaseReference = value === value.toUpperCase()
    const isSecondaryAlias = aliasEntry?.source === 'secondary'
    const allowSecondaryAlias = hasWrappingBrackets || isUppercaseReference
    const shouldResolve = aliasEntry && (!isSecondaryAlias || allowSecondaryAlias)
    const control = shouldResolve ? getControlById(aliasEntry.id) : null

    if (control) {
      parts.push({
        type: 'control',
        value,
        control,
      })
    } else {
      parts.push({ type: 'text', value })
    }

    lastIndex = tokenEnd
  }

  if (lastIndex < source.length) {
    parts.push({ type: 'text', value: source.slice(lastIndex) })
  }

  return parts.length > 0 ? parts : [{ type: 'text', value: source }]
}

export function extractControlIdsFromText(text) {
  const ids = new Set()

  for (const part of splitTextWithControls(text)) {
    if (part.type === 'control') {
      ids.add(part.control.id)
    }
  }

  return Array.from(ids)
}

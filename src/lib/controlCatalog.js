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
const CONTROL_ALIAS_TO_ID = new Map()

function registerAlias(alias, id) {
  if (!alias) return
  CONTROL_ALIAS_TO_ID.set(String(alias).toUpperCase(), id)
}

for (const control of CONTROL_ENTRIES) {
  registerAlias(control.label, control.id)
  registerAlias(control.secondary, control.id)
}

registerAlias('VB', 'VB')
registerAlias('VBX', 'VB')

for (let index = 1; index <= 16; index += 1) {
  registerAlias(`VB${index}`, 'VB')
}

const CONTROL_ALIAS_PATTERN = Array.from(CONTROL_ALIAS_TO_ID.keys())
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

    const controlId = CONTROL_ALIAS_TO_ID.get(value.toUpperCase())
    const control = controlId ? getControlById(controlId) : null

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

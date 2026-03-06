export function normalizeControlText(text) {
  if (text == null) return ''

  let value = String(text)

  // Prefer explicit "+" separators in shortcut syntax.
  value = value.replace(/\s*&\s*/g, ' + ')

  // Normalize "Turn(...)" and "Turn X" to "Turn + X".
  value = value.replace(/\b[Tt]urn\s*\(\s*([^)]+?)\s*\)/g, 'Turn + $1')
  value = value.replace(/\b[Tt]urn\s+(?!\+)(?=\S)/g, 'Turn + ')

  // Keep spacing around "+" consistent.
  value = value.replace(/\s*\+\s*/g, ' + ')

  return value.trim()
}


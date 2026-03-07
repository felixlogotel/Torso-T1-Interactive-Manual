function safeString(value, fallback) {
  return typeof value === 'string' ? value : fallback
}

function safeStringArray(value, fallback) {
  if (!Array.isArray(value)) return fallback
  if (value.every((entry) => typeof entry === 'string')) return value
  return fallback
}

function localizeShortcut(t, baseKey, index, shortcut) {
  return {
    ...shortcut,
    key: t(`${baseKey}.shortcuts.${index}.key`, { ns: 'controls', defaultValue: shortcut.key }),
    action: t(`${baseKey}.shortcuts.${index}.action`, { ns: 'controls', defaultValue: shortcut.action }),
  }
}

function localizeControlItem(t, control) {
  const baseKey = control.id

  const localizedDetails = control.details
    ? safeStringArray(
      t(`${baseKey}.details`, { ns: 'controls', returnObjects: true, defaultValue: control.details }),
      control.details,
    )
    : control.details

  const localizedShortcuts = (control.shortcuts || []).map((shortcut, index) => localizeShortcut(t, baseKey, index, shortcut))

  return {
    ...control,
    description: safeString(
      t(`${baseKey}.description`, { ns: 'controls', defaultValue: control.description }),
      control.description,
    ),
    notes: control.notes
      ? safeString(t(`${baseKey}.notes`, { ns: 'controls', defaultValue: control.notes }), control.notes)
      : control.notes,
    details: localizedDetails,
    shortcuts: localizedShortcuts,
  }
}

export function localizeControlCatalog(t, knobs, buttons) {
  return {
    knobs: knobs.map((control) => localizeControlItem(t, control)),
    buttons: buttons.map((control) => localizeControlItem(t, control)),
  }
}

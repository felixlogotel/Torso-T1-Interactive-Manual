import { Fragment } from 'react'
import { splitTextWithControls } from '../lib/controlCatalog.js'
import { normalizeControlText } from '../lib/textFormatting.js'
import './InlineControlText.css'

function getVariantStyle(control, variant) {
  const color = control?.color

  if (!color) return undefined

  if (variant === 'kbd') {
    return {
      background: `${color}16`,
      borderColor: `${color}32`,
      color,
    }
  }

  return {
    background: `${color}12`,
    borderColor: `${color}30`,
    color: 'inherit',
  }
}

export default function InlineControlText({
  text,
  onNavigateControl,
  variant = 'text',
}) {
  if (text == null) return null

  const normalizedText = normalizeControlText(text)
  const parts = splitTextWithControls(normalizedText)

  return (
    <span className="inline-control-text">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <Fragment key={`text-${index}`}>{part.value}</Fragment>
        }

        const className = `inline-control-link is-${variant}${onNavigateControl ? '' : ' is-static'}`

        if (!onNavigateControl) {
          return (
            <span
              key={`control-${part.control.id}-${index}`}
              className={className}
              style={getVariantStyle(part.control, variant)}
            >
              {part.value}
            </span>
          )
        }

        return (
          <button
            type="button"
            key={`control-${part.control.id}-${index}`}
            className={className}
            style={getVariantStyle(part.control, variant)}
            onClick={(event) => {
              event.stopPropagation()
              onNavigateControl(part.control.id)
            }}
          >
            {part.value}
          </button>
        )
      })}
    </span>
  )
}

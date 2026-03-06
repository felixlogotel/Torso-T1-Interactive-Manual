import { useMemo } from 'react'
import { KNOBS, BUTTONS, SECTIONS } from '../data/params.js'
import {
  KNOB_HOTSPOTS,
  BUTTON_HOTSPOTS,
  VALUE_BUTTON_HOTSPOTS,
  HOTSPOT_SIZES,
  VBX_ZONE,
} from '../data/deviceLayout.js'
import './Device.css'

function Hotspot({
  className,
  x,
  y,
  size,
  color,
  title,
  isSelected,
  isHinted,
  onClick,
}) {
  return (
    <button
      type="button"
      aria-label={title}
      title={title}
      onClick={onClick}
      className={`t1-hotspot ${className} ${isSelected ? 'is-selected' : ''} ${isHinted ? 'is-hinted' : ''}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}%`,
        '--spot-color': color,
      }}
    />
  )
}

export default function Device({
  selected,
  onSelect,
  hint,
}) {
  const knobsById = useMemo(
    () => Object.fromEntries(KNOBS.map((knob) => [knob.id, knob])),
    [],
  )

  const buttonsById = useMemo(
    () => Object.fromEntries(BUTTONS.map((button) => [button.id, button])),
    [],
  )

  const vbButton = buttonsById.VB
  const hintedControls = useMemo(() => new Set(hint?.controls || []), [hint])
  const isVBHinted = Boolean(hint?.vb || hintedControls.has('VB'))
  const isVBSelected = selected?.id === 'VB'

  return (
    <div className="t1-device">
      <div className="t1-device-scroll">
        <div className="t1-device-board">
          {KNOB_HOTSPOTS.map(({ id, x, y }) => {
            const knob = knobsById[id]
            if (!knob) return null
            const sectionColor = SECTIONS[knob.section]?.color || '#9aa3b2'

            return (
              <Hotspot
                key={id}
                className="t1-hotspot-knob"
                x={x}
                y={y}
                size={HOTSPOT_SIZES.knob}
                color={sectionColor}
                title={knob.secondary ? `${knob.label} / ${knob.secondary}` : knob.label}
                isSelected={selected?.id === id}
                isHinted={hintedControls.has(id)}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect('knob', knob)
                }}
              />
            )
          })}

          {BUTTON_HOTSPOTS.map(({ id, x, y }) => {
            const button = buttonsById[id]
            if (!button) return null

            return (
              <Hotspot
                key={id}
                className="t1-hotspot-button"
                x={x}
                y={y}
                size={HOTSPOT_SIZES.button}
                color={button.color || '#c8d4ea'}
                title={button.secondary ? `${button.label} / ${button.secondary}` : button.label}
                isSelected={selected?.id === id}
                isHinted={hintedControls.has(id)}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect('button', button)
                }}
              />
            )
          })}

          {vbButton && VALUE_BUTTON_HOTSPOTS.map(({ vb, x, y }) => (
            <Hotspot
              key={vb}
              className="t1-hotspot-vb"
              x={x}
              y={y}
              size={HOTSPOT_SIZES.vb}
              color="#e87a0a"
              title={`Value Button ${vb}`}
              isSelected={false}
              isHinted={false}
              onClick={(event) => {
                event.stopPropagation()
                onSelect('button', vbButton)
              }}
            />
          ))}

          {vbButton && (
            <button
              type="button"
              aria-label="Zone VBX"
              title="Zone VBX"
              className={`t1-hotspot-vbx-zone ${isVBSelected ? 'is-selected' : ''} ${isVBHinted ? 'is-hinted' : ''}`}
              style={{
                left: `${VBX_ZONE.x}%`,
                top: `${VBX_ZONE.y}%`,
                width: `${VBX_ZONE.width}%`,
                height: `${VBX_ZONE.height}%`,
              }}
              onClick={(event) => {
                event.stopPropagation()
                onSelect('button', vbButton)
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

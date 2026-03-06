import './TonalStaffGraph.css'

const STAFF_LINE_POSITIONS = [16, 32, 48, 64, 80]
const STAFF_ROOT_POSITION = 48
const STAFF_SLOT_STEP = 8
const STAFF_MIN_POSITION = 8
const STAFF_MAX_POSITION = 88

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function semitoneToStaffOffset(interval) {
  if (interval >= 0) return Math.round(interval / 2)
  return -Math.round(Math.abs(interval) / 2)
}

export default function TonalStaffGraph({
  intervals = [0],
  fundamentalIndex = 0,
  color = '#6AB870',
  highlightIndices = [],
  highlightColor = '#E87A0A',
  className = '',
}) {
  const safeIntervals = Array.isArray(intervals) && intervals.length > 0 ? intervals : [0]
  const highlighted = new Set(highlightIndices)
  const count = safeIntervals.length
  const minX = 12
  const maxX = 88
  const xStep = count > 1 ? (maxX - minX) / (count - 1) : 0

  return (
    <div className={`tonal-staff-graph ${className}`.trim()}>
      <div className="tonal-staff-lines">
        {STAFF_LINE_POSITIONS.map((position) => (
          <span key={position} className="tonal-staff-line" style={{ top: `${position}%` }} />
        ))}
      </div>

      <div className="tonal-staff-points">
        {safeIntervals.map((interval, index) => {
          const left = minX + xStep * index
          const staffOffset = semitoneToStaffOffset(interval)
          const top = clamp(
            STAFF_ROOT_POSITION - staffOffset * STAFF_SLOT_STEP,
            STAFF_MIN_POSITION,
            STAFF_MAX_POSITION
          )
          const isRoot = index === fundamentalIndex
          const isHighlighted = highlighted.has(index)
          const noteBorderColor = isHighlighted ? highlightColor : color
          const noteBackground = isHighlighted ? `${highlightColor}33` : isRoot ? color : `${color}2f`
          return (
            <span
              key={`${interval}-${index}`}
              className={`tonal-staff-note ${isRoot ? 'is-root' : ''}`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                borderColor: noteBorderColor,
                background: noteBackground,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

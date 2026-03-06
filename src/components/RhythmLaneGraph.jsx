import './RhythmLaneGraph.css'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export default function RhythmLaneGraph({
  totalSteps = 16,
  beats = 4,
  events = [],
  markers = [],
  color = '#8890c0',
  showBeatLabels = true,
  fullBlockEvents = false,
  className = '',
}) {
  const safeTotalSteps = Math.max(1, Math.floor(totalSteps))
  const safeBeats = Math.max(1, Math.floor(beats))
  const beatStep = safeTotalSteps / safeBeats

  const gridSteps = Array.from({ length: safeTotalSteps - 1 }, (_, index) => index + 1)
  const beatLabels = Array.from({ length: safeBeats }, (_, index) => index + 1)

  return (
    <div className={`rhythm-lane-graph ${fullBlockEvents ? 'is-full-block' : ''} ${className}`.trim()}>
      {showBeatLabels && (
        <div
          className="rhythm-lane-beat-labels"
          style={{ gridTemplateColumns: `repeat(${safeBeats}, minmax(0, 1fr))` }}
        >
          {beatLabels.map((label) => (
            <span key={`beat-${label}`} className={label === 1 ? 'is-downbeat' : ''}>
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="rhythm-lane-track">
        {gridSteps.map((step) => {
          const isMajor = Number.isInteger(beatStep) && step % beatStep === 0
          return (
            <span
              key={`grid-${step}`}
              className={`rhythm-lane-grid-line ${isMajor ? 'is-major' : 'is-sub'}`}
              style={{ left: `${(step / safeTotalSteps) * 100}%` }}
            />
          )
        })}

        {events.map((event, index) => {
          const startStep = clamp(event.startStep ?? 0, 0, safeTotalSteps)
          const lengthSteps = clamp(event.lengthSteps ?? 1, 0.25, safeTotalSteps)
          const left = (startStep / safeTotalSteps) * 100
          const width = Math.max((lengthSteps / safeTotalSteps) * 100, 1.2)
          return (
            <span
              key={`event-${index}`}
              className={`rhythm-lane-event is-${event.kind || 'note'}`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
                background: event.color || color,
              }}
            />
          )
        })}

        {markers.map((marker, index) => {
          const step = clamp(marker.step ?? 0, 0, safeTotalSteps)
          return (
            <span
              key={`marker-${index}`}
              className={`rhythm-lane-marker ${marker.kind ? `is-${marker.kind}` : ''}`}
              style={{ left: `${(step / safeTotalSteps) * 100}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}

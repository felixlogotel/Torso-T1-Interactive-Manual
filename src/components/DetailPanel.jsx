import { useState } from 'react'
import { SECTIONS } from '../data/params.js'
import InlineControlText from './InlineControlText.jsx'
import { normalizeControlText } from '../lib/textFormatting.js'

// Keyboard shortcut badge
function KbdBadge({ text, color }) {
  const normalized = normalizeControlText(text)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
      padding: '5px 11px', borderRadius: 7,
      background: `${color}16`, border: `1px solid ${color}35`,
      color, whiteSpace: 'nowrap', letterSpacing: 0.35,
    }}>{normalized}</span>
  )
}

function ShortcutRow({ shortcut, color, onHoverStart, onHoverEnd, onNavigateControl }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => {
        setHovered(true)
        onHoverStart?.()
      }}
      onMouseLeave={() => {
        setHovered(false)
        onHoverEnd?.()
      }}
      style={{
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
      padding: '11px 13px',
      border: '1px solid var(--border)',
      borderRadius: 8,
      background: hovered ? `${color}12` : 'transparent',
      borderLeft: `3px solid ${hovered ? color : `${color}40`}`,
      transition: 'all 0.12s ease',
      cursor: 'pointer',
    }}
    >
      <div style={{
        width: '100%',
        fontSize: 15, fontWeight: 600, color: hovered ? 'var(--text)' : 'var(--text-2)',
        lineHeight: 1.34,
      }}>
        <InlineControlText text={shortcut.action} onNavigateControl={onNavigateControl} />
      </div>
      <div style={{ width: '100%' }}>
        <KbdBadge text={shortcut.key} color={color} />
      </div>
    </div>
  )
}

export default function DetailPanel({
  item,
  sideLayout = false,
  shortcutsOnly = false,
  onClose,
  onNavigateControl,
  onShortcutHover,
  onShortcutLeave,
}) {
  if (!item) return null

  const sectionDef = item.section ? SECTIONS[item.section] : null
  const color = sectionDef?.color || item.color || '#888'
  const isNew = item.notes?.includes('v2.1')
    || (item.details || []).some(d => d.includes('✦'))

  return (
    <div
      className="anim-fade-up"
      style={{
        marginTop: sideLayout ? 0 : 14,
        background: 'var(--surface)',
        border: `1px solid ${color}28`,
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: `0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px ${color}10`,
      }}
    >
      {/* Header strip */}
      <div style={{
        padding: '14px 18px',
        background: `linear-gradient(90deg, ${color}12, transparent)`,
        borderBottom: `1px solid ${color}20`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 8, flexShrink: 0,
          background: `${color}18`, border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${color}`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 2, height: 6, borderRadius: 1, background: color }} />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 19, fontWeight: 700, fontFamily: 'var(--font-mono)',
              letterSpacing: 1, color: 'var(--text)',
            }}>{item.label || item.p}</span>

            {(item.secondary || item.sub) && (
              <span style={{ fontSize: 13, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
                / {item.secondary || item.sub}
              </span>
            )}

            {sectionDef && (
              <span style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 2.2,
                fontWeight: 700, color, background: `${color}15`,
                border: `1px solid ${color}30`, borderRadius: 4, padding: '2px 8px',
              }}>{item.section}</span>
            )}

            {item.perf && (
              <span style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 1.3,
                color: '#E09930bb', background: '#E0993015',
                border: '1px solid #E0993028', borderRadius: 4, padding: '2px 8px',
              }}>PERFORMANCE</span>
            )}

            {isNew && (
              <span style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', letterSpacing: 1.3,
                color: '#9A72C4', background: '#9A72C415',
                border: '1px solid #9A72C430', borderRadius: 4, padding: '2px 8px',
              }}>✦ v2.1</span>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            flexShrink: 0, width: 30, height: 30, borderRadius: 6,
            background: 'transparent', border: '1px solid var(--border-2)',
            color: 'var(--text-3)', cursor: 'pointer', fontSize: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.1s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-2)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-3)' }}
        >×</button>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: shortcutsOnly ? 14 : 20 }}>

        {/* Description */}
        {!shortcutsOnly && (
          <p style={{
            fontSize: 16, color: 'var(--text)', lineHeight: 1.52, margin: 0,
          }}>
            <InlineControlText text={item.description} onNavigateControl={onNavigateControl} />
          </p>
        )}

        {/* Shortcuts */}
        {item.shortcuts?.length > 0 ? (
          <div>
            <div style={{
              fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: 2.2,
              color: 'var(--text-3)', marginBottom: 8, fontWeight: 700,
            }}>RACCOURCIS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {item.shortcuts.map((s, i) => (
                <ShortcutRow
                  key={i}
                  shortcut={s}
                  color={color}
                  onNavigateControl={onNavigateControl}
                  onHoverStart={() => onShortcutHover?.(s)}
                  onHoverEnd={() => onShortcutLeave?.()}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: 'var(--text-3)' }}>
            Aucun raccourci pour ce contrôle.
          </div>
        )}

        {/* Details list */}
        {!shortcutsOnly && item.details?.length > 0 && (
          <div>
            <div style={{
              fontSize: 12, fontFamily: 'var(--font-mono)', letterSpacing: 2.2,
              color: 'var(--text-3)', marginBottom: 8, fontWeight: 700,
            }}>DÉTAILS</div>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 4,
            }}>
              {item.details.map((d, i) => (
                <div key={i} style={{
                  fontSize: 14, fontFamily: 'var(--font-mono)',
                  color: d.includes('✦') ? color : 'var(--text-2)',
                  paddingLeft: 10, lineHeight: 1.62,
                  borderLeft: `2px solid ${color}30`,
                  fontWeight: d.includes('✦') ? 600 : 400,
                }}>
                  <InlineControlText text={d} onNavigateControl={onNavigateControl} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes/Tips */}
        {!shortcutsOnly && item.notes && (
          <div style={{
            background: '#0e0a04',
            border: '1px solid rgba(196,144,66,0.2)',
            borderLeft: '3px solid var(--setup)',
            borderRadius: '0 6px 6px 0',
            padding: '10px 14px',
            fontSize: 14, color: '#c49042cc', lineHeight: 1.54,
          }}>
            <span style={{ fontWeight: 700, marginRight: 6, color: 'var(--setup)' }}>💡</span>
            <InlineControlText text={item.notes} onNavigateControl={onNavigateControl} />
          </div>
        )}

      </div>
    </div>
  )
}

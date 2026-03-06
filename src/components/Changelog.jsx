import { VERSIONS } from '../data/changelog.js'
import InlineControlText from './InlineControlText.jsx'

const TYPE_STYLES = {
  major:  { color: '#9A72C4', bg: 'rgba(154,114,196,0.12)', border: 'rgba(154,114,196,0.25)', label: 'Majeure' },
  bugfix: { color: '#5BA3C9', bg: 'rgba(91,163,201,0.08)',  border: 'rgba(91,163,201,0.18)',  label: 'Bugfix'  },
}

const ENTRY_ICONS = {
  features:     { icon: '✦', color: '#6AB870', label: 'Nouvelles fonctionnalités' },
  enhancements: { icon: '↑', color: '#C49042', label: 'Améliorations'            },
  bugfixes:     { icon: '⬡', color: '#5BA3C9', label: 'Corrections'              },
}

export default function ChangelogView({ onNavigateControl }) {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', margin: 0 }}>
            Changelog
          </h1>
          <a
            href="https://torsoelectronics.com/pages/t-1-changelog"
            target="_blank"
            rel="noopener noreferrer"
            className="changelog-official-btn"
          >
            Official Changelog
          </a>
        </div>
        <p style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 1.48 }}>
          Historique des mises à jour du firmware T-1.
        </p>
      </div>

      {/* Version list */}
      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute', left: 14, top: 0, bottom: 0,
          width: 1, background: 'var(--border)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {VERSIONS.map((ver, vi) => {
            const style = TYPE_STYLES[ver.type] || TYPE_STYLES.bugfix
            const isMajor = ver.type === 'major'

            return (
              <div key={ver.version} style={{
                display: 'flex', gap: 20, paddingLeft: 36,
                position: 'relative',
              }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute', left: 7, top: 18,
                  width: isMajor ? 16 : 10, height: isMajor ? 16 : 10,
                  borderRadius: '50%',
                  background: isMajor ? style.color : 'var(--surface-3)',
                  border: `2px solid ${isMajor ? style.color : 'var(--border-2)'}`,
                  marginLeft: isMajor ? -3 : 0,
                  boxShadow: isMajor ? `0 0 12px ${style.color}66` : 'none',
                  zIndex: 1,
                }} />

                <div style={{
                  flex: 1,
                  background: isMajor ? style.bg : 'var(--surface)',
                  border: `1px solid ${isMajor ? style.border : 'var(--border)'}`,
                  borderRadius: 10, padding: isMajor ? '16px 18px' : '12px 16px',
                  marginBottom: 8,
                }}>
                  {/* Version header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    marginBottom: isMajor ? 14 : 8, flexWrap: 'wrap',
                  }}>
                    <span style={{
                      fontSize: isMajor ? 18 : 15, fontWeight: 700,
                      fontFamily: 'var(--font-mono)', letterSpacing: 0.5,
                      color: isMajor ? style.color : 'var(--text)',
                    }}>v{ver.version}</span>

                    <span style={{
                      fontSize: 12, fontFamily: 'var(--font-mono)',
                      color: 'var(--text-3)', letterSpacing: 0.5,
                    }}>{ver.date}</span>

                    {isMajor && (
                      <span style={{
                        fontSize: 10, fontFamily: 'var(--font-mono)', fontWeight: 700,
                        letterSpacing: 2, color: style.color,
                        background: `${style.color}18`, border: `1px solid ${style.color}30`,
                        borderRadius: 3, padding: '2px 7px',
                      }}>{style.label.toUpperCase()}</span>
                    )}
                  </div>

                  {/* Entries by category */}
                  {Object.entries(ver.entries).map(([cat, items]) => {
                    const { icon, color, label } = ENTRY_ICONS[cat] || {}
                    return (
                      <div key={cat} style={{ marginBottom: 12 }}>
                        {isMajor && (
                          <div style={{
                            fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 700,
                            letterSpacing: 2, color: color || 'var(--text-3)',
                            marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5,
                          }}>
                            <span>{icon}</span> {label}
                          </div>
                        )}
                        <ul style={{
                          listStyle: 'none', padding: 0,
                          display: 'flex', flexDirection: 'column', gap: 4,
                        }}>
                          {items.map((item, i) => (
                            <li key={i} style={{
                              fontSize: isMajor ? 14 : 13,
                              color: isMajor ? 'var(--text)' : 'var(--text-2)',
                              lineHeight: 1.48,
                              paddingLeft: 14, position: 'relative',
                            }}>
                              <span style={{
                                position: 'absolute', left: 0, top: '0.3em',
                                width: 5, height: 5, borderRadius: '50%',
                                background: isMajor ? (color || style.color) + '88' : 'var(--text-4)',
                                display: 'inline-block',
                              }} />
                              <InlineControlText text={item} onNavigateControl={onNavigateControl} />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

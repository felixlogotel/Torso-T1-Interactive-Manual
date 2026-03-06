import { QUICKREF_CARDS } from '../data/quickref.js'
import { normalizeControlText } from '../lib/textFormatting.js'

function KeyBadge({ text }) {
  const normalized = normalizeControlText(text)
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
      padding: '5px 10px', borderRadius: 6,
      background: 'var(--surface-3)', border: '1px solid var(--border-2)',
      color: '#5BA3C9', whiteSpace: 'nowrap', letterSpacing: 0.3,
      boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.3)',
      lineHeight: 1,
    }}>{normalized}</span>
  )
}

function QuickCard({ card }) {
  const { title, icon, color, items } = card

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${color}40`,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: `0 4px 16px ${color}15`,
    }}>
      {/* Card header */}
      <div
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px',
          background: `${color}0e`,
          borderBottom: `1px solid ${color}20`,
        }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{
          flex: 1, textAlign: 'left',
          fontSize: 15, fontWeight: 600, color,
          fontFamily: 'var(--font-mono)', letterSpacing: 0.5,
        }}>{title}</span>
      </div>

      {/* Card content */}
      <div style={{ padding: '4px 0 8px' }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '9px 16px',
            borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            {/* Label */}
            <span style={{
              fontSize: 14, color: 'var(--text-2)',
              minWidth: 172, flexShrink: 0, paddingTop: 4,
              lineHeight: 1.38,
            }}>{item.label}</span>

            {/* Keys */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center', flex: 1 }}>
              {item.keys.map((k, ki) => (
                <span key={ki} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <KeyBadge text={k} />
                  {ki < item.keys.length - 1 && (
                    <span style={{ fontSize: 12, color: 'var(--text-4)' }}>+</span>
                  )}
                </span>
              ))}
              {item.note && (
                <span style={{
                  fontSize: 12, color: color + 'aa', fontStyle: 'italic',
                  fontFamily: 'var(--font-mono)', marginLeft: 2,
                }}>{normalizeControlText(item.note)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function QuickRef() {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          Essentiels & Cheat Sheets
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 1.48 }}>
          Raccourcis essentiels regroupés par thème.
        </p>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))',
        gap: 10,
      }}>
        {QUICKREF_CARDS.map(card => (
          <QuickCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  )
}

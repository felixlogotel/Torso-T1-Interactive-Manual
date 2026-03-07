import { QUICKREF_CARDS } from '../data/quickref.js'
import { normalizeControlText } from '../lib/textFormatting.js'
import InlineControlText from './InlineControlText.jsx'
import './QuickRef.css'

function KeyBadge({ text }) {
  return (
    <span className="quickref-kbd">{normalizeControlText(text)}</span>
  )
}

function QuickCard({ card, onNavigateControl }) {
  const { title, color, items } = card

  return (
    <article className="quickref-card" style={{ '--quickref-color': color }}>
      <header className="quickref-card-head">
        <h2 className="quickref-card-title">{title}</h2>
      </header>

      <div className="quickref-card-body">
        {items.map((item) => (
          <div key={`${item.label}-${item.keys.join('|')}`} className="quickref-row">
            <div className="quickref-row-label">
              <InlineControlText text={item.label} onNavigateControl={onNavigateControl} />
            </div>

            <div className="quickref-row-keys">
              {item.keys.map((key, index) => (
                <div key={`${item.label}-${key}`} className="quickref-key-wrap">
                  <KeyBadge text={key} />
                  {index < item.keys.length - 1 && <span className="quickref-key-sep">→</span>}
                </div>
              ))}
              {item.note && <span className="quickref-note">{normalizeControlText(item.note)}</span>}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function QuickRef({ onNavigateControl }) {
  return (
    <div className="quickref-page">
      <header className="quickref-hero">
        <h1 className="quickref-title">Essentiels</h1>
        <p className="quickref-subtitle">
          Selection courte des fonctions critiques pour naviguer, editer et performer sans surcharge.
        </p>
      </header>

      <section className="quickref-grid">
        {QUICKREF_CARDS.map((card) => (
          <QuickCard key={card.id} card={card} onNavigateControl={onNavigateControl} />
        ))}
      </section>
    </div>
  )
}

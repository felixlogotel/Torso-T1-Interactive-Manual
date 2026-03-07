import { QUICKREF_CARDS } from '../data/quickref.js'
import { useTranslation } from 'react-i18next'
import { normalizeControlText } from '../lib/textFormatting.js'
import InlineControlText from './InlineControlText.jsx'
import './QuickRef.css'

function KeyBadge({ text }) {
  return (
    <span className="quickref-kbd">{normalizeControlText(text)}</span>
  )
}

function QuickCard({ card, onNavigateControl }) {
  const { t, i18n } = useTranslation('quickref')
  const { color, items } = card
  const title = t(`cards.${card.id}.title`)

  return (
    <article className="quickref-card" style={{ '--quickref-color': color }}>
      <header className="quickref-card-head">
        <h2 className="quickref-card-title">{title}</h2>
      </header>

      <div className="quickref-card-body">
        {items.map((item) => (
          <div key={`${item.id}-${item.keys.join('|')}`} className="quickref-row">
            <div className="quickref-row-label">
              <InlineControlText
                text={t(`cards.${card.id}.items.${item.id}.label`)}
                onNavigateControl={onNavigateControl}
              />
            </div>

            <div className="quickref-row-keys">
              {item.keys.map((key, index) => (
                <div key={`${item.id}-${key}`} className="quickref-key-wrap">
                  <KeyBadge text={key} />
                  {index < item.keys.length - 1 && <span className="quickref-key-sep">→</span>}
                </div>
              ))}
              {i18n.exists(`quickref:cards.${card.id}.items.${item.id}.note`) && (
                <span className="quickref-note">
                  {normalizeControlText(t(`cards.${card.id}.items.${item.id}.note`))}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function QuickRef({ onNavigateControl }) {
  const { t } = useTranslation('quickref')

  return (
    <div className="quickref-page">
      <header className="quickref-hero">
        <h1 className="quickref-title">{t('title')}</h1>
        <p className="quickref-subtitle">
          {t('subtitle')}
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

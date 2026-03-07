import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InlineControlText from './InlineControlText.jsx'
import './StructureGuide.css'

const LEVEL_ORDER = [
  { id: 'sequencer', tone: 'global' },
  { id: 'bank', tone: 'bank' },
  { id: 'pattern', tone: 'pattern' },
  { id: 'track', tone: 'track' },
  { id: 'cycle', tone: 'cycle' },
]

function levelIndex(levels, id) {
  return levels.findIndex((entry) => entry.id === id)
}

export default function StructureGuide({ onNavigateControl }) {
  const { t, i18n } = useTranslation('structure')
  const [activeLevel, setActiveLevel] = useState('pattern')

  const levels = useMemo(
    () => LEVEL_ORDER.map(({ id, tone }) => ({
      id,
      tone,
      ...t(`levels.${id}`, { returnObjects: true }),
    })),
    [t, i18n.language],
  )

  const active = useMemo(
    () => levels.find((level) => level.id === activeLevel) || levels[0],
    [activeLevel, levels],
  )

  const path = useMemo(() => {
    const index = Math.max(0, levelIndex(levels, active.id))
    return levels.slice(0, index + 1).map((item) => item.title).join(' > ')
  }, [active.id, levels])

  return (
    <div className="structure-page">
      <div className="structure-hero">
        <h1 className="structure-title">{t('hero.title')}</h1>
        <p className="structure-subtitle">{t('hero.subtitle')}</p>
      </div>

      <div className="structure-main-grid">
        <section className="structure-card structure-level-card">
          <div className="structure-card-title">{t('cards.hierarchyTitle')}</div>
          <div className="structure-levels">
            {levels.map((level, index) => (
              <div key={level.id} className="structure-level-row">
                <button
                  type="button"
                  className={`structure-level-btn is-${level.tone} ${activeLevel === level.id ? 'is-active' : ''}`}
                  onClick={() => setActiveLevel(level.id)}
                >
                  <span className={`structure-level-index is-${level.tone}`}>{index + 1}</span>
                  <span className="structure-level-copy">
                    <span className="structure-level-name">{level.title}</span>
                    <span className="structure-level-meta">{level.count}</span>
                  </span>
                  <span className={`structure-level-tag is-${level.tone}`}>{level.subtitle}</span>
                </button>
                {index < levels.length - 1 && <span className="structure-level-arrow">↓</span>}
              </div>
            ))}
          </div>
        </section>

        <section className={`structure-card structure-focus-card is-${active.tone}`}>
          <div className="structure-focus-kicker">
            <span className={`structure-focus-badge is-${active.tone}`}>{active.subtitle}</span>
            <span className={`structure-focus-count is-${active.tone}`}>{active.count}</span>
          </div>
          <div className="structure-focus-head">
            <span className="structure-focus-title">{active.title}</span>
          </div>
          <p className="structure-focus-text">
            <InlineControlText text={active.detail} onNavigateControl={onNavigateControl} />
          </p>

          <div className="structure-path-block">
            <span className="structure-path-label">{t('cards.logicPath')}</span>
            <span className="structure-path-value">{path}</span>
          </div>

          <div className="structure-focus-shortcuts">
            <span className="structure-focus-shortcuts-title">{t('cards.essentialShortcuts')}</span>
            <div className="structure-shortcut-flow">
              {(active.shortcuts || []).map((shortcut) => (
                <div key={`${shortcut.key}-${shortcut.action}`} className="structure-shortcut-item">
                  <div className="structure-shortcut-copy">
                    <span className="structure-shortcut-key">
                      <InlineControlText text={shortcut.key} onNavigateControl={onNavigateControl} />
                    </span>
                    <span className="structure-shortcut-action">
                      <InlineControlText text={shortcut.action} onNavigateControl={onNavigateControl} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

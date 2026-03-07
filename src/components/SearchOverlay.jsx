import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './SearchOverlay.css'

const QUICK_SUGGESTIONS = ['PITCH', 'CYCLES', 'BANK', 'VOICING', 'RANDOM', 'TEMPO']

export default function SearchOverlay({ query, setQuery, results, onSelect, onClose }) {
  const { t } = useTranslation()
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setCursor(0)
  }, [results])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      if (results.length === 0) return
      event.preventDefault()
      setCursor((value) => Math.min(value + 1, results.length - 1))
    }

    if (event.key === 'ArrowUp') {
      if (results.length === 0) return
      event.preventDefault()
      setCursor((value) => Math.max(value - 1, 0))
    }

    if (event.key === 'Enter' && results[cursor]) {
      onSelect(results[cursor])
    }
  }

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-dialog anim-fade-up" onClick={(event) => event.stopPropagation()}>
        <div className="search-input-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('searchOverlay.placeholder')}
            className="search-input"
          />
          <button type="button" className="search-esc" onClick={onClose}>ESC</button>
        </div>

        {results.length > 0 && (
          <div className="search-results">
            {results.map((item, index) => (
              <button
                type="button"
                key={item.id}
                onClick={() => onSelect(item)}
                onMouseEnter={() => setCursor(index)}
                className={`search-result ${index === cursor ? 'is-active' : ''}`}
              >
                <div className="search-result-kind" style={{ '--item-color': item.color }}>
                  {item.type === 'button' ? 'BTN' : item.section?.slice(0, 3)}
                </div>

                <div className="search-result-main">
                  <div className="search-result-title-row">
                    <span className="search-result-title">{item.label}</span>
                    {item.secondary && <span className="search-result-secondary">/ {item.secondary}</span>}
                    {item.section && (
                      <span className="search-result-section" style={{ '--item-color': item.color }}>
                        {item.section}
                      </span>
                    )}
                  </div>
                  <div className="search-result-description">{item.data.description}</div>
                </div>

                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth="2" className="search-result-arrow" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="search-empty">{t('searchOverlay.empty', { query })}</div>
        )}

        {!query && (
          <div className="search-suggestions">
            <span className="search-suggestions-label">{t('searchOverlay.quickSuggestions')}</span>
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button key={suggestion} onClick={() => setQuery(suggestion)} className="search-suggestion-btn">
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

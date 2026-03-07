import { useMemo, useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { I18N_DEFAULT_LANGUAGE, I18N_LANGUAGES, I18N_STORAGE_KEY } from '../i18n/config.js'

function normalizeLanguage(input) {
  if (!input) return null
  const normalized = String(input).toLowerCase().split('-')[0]
  return I18N_LANGUAGES.includes(normalized) ? normalized : null
}

const LANGUAGE_META = {
  fr: { flag: '🇫🇷' },
  en: { flag: '🇬🇧' },
}

export default function LanguageSelector() {
  const { t, i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const currentLanguage = useMemo(
    () => normalizeLanguage(i18n.resolvedLanguage || i18n.language) || I18N_DEFAULT_LANGUAGE,
    [i18n.language, i18n.resolvedLanguage],
  )

  useEffect(() => {
    const onClickAway = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false)
      }
    }

    const onEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('mousedown', onClickAway)
    window.addEventListener('keydown', onEscape)
    return () => {
      window.removeEventListener('mousedown', onClickAway)
      window.removeEventListener('keydown', onEscape)
    }
  }, [])

  const handleSelect = (language) => {
    const nextLanguage = normalizeLanguage(language)
    if (!nextLanguage || nextLanguage === currentLanguage) return

    i18n.changeLanguage(nextLanguage)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(I18N_STORAGE_KEY, nextLanguage)
    }
    setIsOpen(false)
  }

  const currentMeta = LANGUAGE_META[currentLanguage] || LANGUAGE_META.en

  return (
    <div className="app-language-menu" ref={menuRef}>
      <button
        type="button"
        className="app-search-btn app-language-btn"
        onClick={() => setIsOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t('app.language.label')}
      >
        <span className="app-language-flag" aria-hidden>{currentMeta.flag}</span>
      </button>

      {isOpen && (
        <div className="app-language-dropdown" role="menu" aria-label={t('app.language.label')}>
        {I18N_LANGUAGES.map((language) => (
          <button
            key={language}
            type="button"
            role="menuitemradio"
            aria-checked={language === currentLanguage}
            className={`app-language-option ${language === currentLanguage ? 'is-active' : ''}`}
            onClick={() => handleSelect(language)}
          >
            <span className="app-language-option-flag" aria-hidden>{LANGUAGE_META[language]?.flag || '🌐'}</span>
            <span className="app-language-option-label">{t(`app.language.options.${language}`)}</span>
          </button>
        ))}
        </div>
      )}
    </div>
  )
}

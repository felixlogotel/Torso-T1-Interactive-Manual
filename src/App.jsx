import { useState, useEffect, useCallback, useMemo, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { KNOBS, BUTTONS, SECTIONS } from './data/params.js'
import Device from './components/Device.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import ExplanationPanel from './components/ExplanationPanel.jsx'
import QuickRef from './components/QuickRef.jsx'
import ChangelogView from './components/Changelog.jsx'
import SearchOverlay from './components/SearchOverlay.jsx'
import StructureGuide from './components/StructureGuide.jsx'
import LanguageSelector from './components/LanguageSelector.jsx'
import { localizeControlCatalog } from './i18n/localizeControls.js'
import { extractControlIdsFromText, getControlById } from './lib/controlCatalog.js'
import './App.css'

const TAB_IDS = ['device', 'structure', 'quickref', 'changelog']

function buildShortcutHint(shortcut, selectedControlId) {
  const source = `${shortcut?.key || ''} ${shortcut?.action || ''}`.toUpperCase()
  const controls = new Set()
  const controlIds = extractControlIdsFromText(source)
  let highlightVB = controlIds.includes('VB') || /\bTRACK\b/i.test(source)

  for (const controlId of controlIds) {
    if (controlId === 'VB') continue
    controls.add(controlId)
  }

  if (selectedControlId) {
    if (selectedControlId === 'VB') highlightVB = true
    else controls.add(selectedControlId)
  }

  return {
    controls: Array.from(controls),
    vb: highlightVB,
  }
}

function buildSearchIndex(knobs, buttons) {
  const items = []

  for (const knob of knobs) {
    items.push({
      type: 'knob',
      id: knob.id,
      label: knob.label,
      secondary: knob.secondary,
      section: knob.section,
      color: SECTIONS[knob.section].color,
      text: [
        knob.label,
        knob.secondary,
        knob.description,
        ...(knob.shortcuts || []).map((shortcut) => `${shortcut.key} ${shortcut.action}`),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
      data: knob,
    })
  }

  for (const button of buttons) {
    items.push({
      type: 'button',
      id: button.id,
      label: button.label,
      secondary: button.secondary,
      section: null,
      color: button.color,
      text: [
        button.label,
        button.secondary,
        button.description,
        ...(button.shortcuts || []).map((shortcut) => `${shortcut.key} ${shortcut.action}`),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase(),
      data: button,
    })
  }

  return items
}

export default function App() {
  const { t, i18n } = useTranslation()
  const language = String(i18n.resolvedLanguage || i18n.language || 'fr').toLowerCase()
  const tutorialLanguage = language.startsWith('fr') ? 'fr' : 'en'
  const tutorialVideoUrl = String(import.meta.env.VITE_TUTORIAL_VIDEO_URL || '').trim()
  const tutorialQuery = new URLSearchParams({ lang: tutorialLanguage })

  if (tutorialVideoUrl) {
    tutorialQuery.set('video', tutorialVideoUrl)
  }

  const tutorialHref = `/tutorial.html?${tutorialQuery.toString()}`
  const [tab, setTab] = useState('device')
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [deviceHint, setDeviceHint] = useState(null)

  const { knobs, buttons } = useMemo(
    () => localizeControlCatalog(t, KNOBS, BUTTONS),
    [t, i18n.language],
  )

  const controlsById = useMemo(
    () => new Map([
      ...knobs.map((item) => [item.id, { type: 'knob', id: item.id, data: item }]),
      ...buttons.map((item) => [item.id, { type: 'button', id: item.id, data: item }]),
    ]),
    [knobs, buttons],
  )

  const searchIndex = useMemo(
    () => buildSearchIndex(knobs, buttons),
    [knobs, buttons],
  )

  const tabs = [
    { id: TAB_IDS[0], label: t('app.tabs.device') },
    { id: TAB_IDS[1], label: t('app.tabs.structure') },
    { id: TAB_IDS[2], label: t('app.tabs.quickref') },
    { id: TAB_IDS[3], label: t('app.tabs.changelog') },
  ]

  useEffect(() => {
    setSelected((current) => {
      if (!current?.id) return current
      const localizedTarget = controlsById.get(current.id)
      if (!localizedTarget) return current
      if (current.data === localizedTarget.data && current.type === localizedTarget.type) return current

      return {
        type: localizedTarget.type,
        id: localizedTarget.id,
        data: localizedTarget.data,
      }
    })
  }, [controlsById])

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setQuery('')
  }, [])

  useEffect(() => {
    if (!selected) setDeviceHint(null)
  }, [selected])

  useEffect(() => {
    const handler = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }

      if (event.key === 'Escape') {
        closeSearch()
        setSelected(null)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeSearch])

  const searchResults = useMemo(() => {
    if (!query.trim()) return []

    const normalizedQuery = query.toLowerCase()

    return searchIndex
      .filter((item) => item.text.includes(normalizedQuery))
      .sort((a, b) => {
        const aExact = a.label.toLowerCase().startsWith(normalizedQuery) ? 2 : 0
        const bExact = b.label.toLowerCase().startsWith(normalizedQuery) ? 2 : 0
        return bExact - aExact
      })
      .slice(0, 8)
  }, [query, searchIndex])

  const handleSelect = useCallback((type, data) => {
    if (!data?.id) return
    setDeviceHint(null)
    setSelected((current) => (current?.id === data.id ? null : { type, id: data.id, data }))
  }, [])

  const openControlById = useCallback(
    (controlId) => {
      const target = controlsById.get(controlId) || getControlById(controlId)
      if (!target) return

      closeSearch()
      setTab('device')
      setDeviceHint(null)
      setSelected({ type: target.type, id: target.id, data: target.data })
    },
    [closeSearch, controlsById],
  )

  const handleSearchSelect = useCallback(
    (item) => {
      openControlById(item.id)
    },
    [openControlById],
  )

  const handleTabChange = (nextTab) => {
    setTab(nextTab)
    setSelected(null)
    setDeviceHint(null)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <img
            src="/logo_boxed_white.svg"
            alt="Torso"
            className="app-brand-logo"
          />
          <div>
            <div className="app-brand-title">TORSO T-1</div>
            <div className="app-brand-subtitle">{t('app.brand.subtitle')}</div>
          </div>
        </div>

        <nav className="app-tabs">
          {tabs.map((tabItem, i) => (
            <Fragment key={tabItem.id}>
              {i > 0 && <span className="app-tab-sep" aria-hidden>|</span>}
              <button
                onClick={() => handleTabChange(tabItem.id)}
                className={`app-tab-btn ${tab === tabItem.id ? 'is-active' : ''}`}
              >
                {tabItem.label}
              </button>
            </Fragment>
          ))}
          <span className="app-tab-sep" aria-hidden>|</span>
          <a
            href="https://downloads.torsoelectronics.com/t-1/manual/T-1%20User%20Manual.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="app-tab-btn app-tab-link"
          >
            {t('app.tabs.officialManual')}
          </a>
        </nav>

        <div className="app-header-spacer" />

        <div className="app-version-badge">v2.1.3</div>

        <div className="app-header-controls">
          <a
            href={tutorialHref}
            className="app-search-btn app-help-btn"
            aria-label={t('app.tutorial.button')}
            title={t('app.tutorial.button')}
          >
            <span className="app-help-icon" aria-hidden>?</span>
          </a>
          <button onClick={() => setSearchOpen(true)} className="app-search-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span className="app-search-label">{t('app.search.button')}</span>
            <span className="app-search-kbd">⌘K</span>
          </button>
          <LanguageSelector />
        </div>
      </header>

      <main className="app-main">
        {tab === 'device' && (
          <div className="anim-fade-up app-device-layout">
            <div className="app-device-left">
              <Device
                selected={selected}
                onSelect={handleSelect}
                hint={deviceHint}
                knobs={knobs}
                buttons={buttons}
              />
              <ExplanationPanel
                item={selected?.data || null}
                onNavigateControl={openControlById}
              />
            </div>

            <aside className="app-device-right">
                {selected ? (
                  <DetailPanel
                    item={selected.data}
                    sideLayout
                    shortcutsOnly
                    onClose={() => setSelected(null)}
                    onNavigateControl={openControlById}
                    onShortcutHover={(shortcut) => setDeviceHint(buildShortcutHint(shortcut, selected.id))}
                    onShortcutLeave={() => setDeviceHint(null)}
                  />
                ) : (
                  <div className="app-device-hint-card">
                    <div className="app-device-hint-title">{t('app.deviceHint.title')}</div>
                    <div className="app-device-hint-body">
                      {t('app.deviceHint.body')}
                    </div>
                  </div>
                )}
            </aside>
          </div>
        )}

        {tab === 'structure' && (
          <div className="anim-fade-up">
            <StructureGuide onNavigateControl={openControlById} />
          </div>
        )}

        {tab === 'quickref' && (
          <div className="anim-fade-up">
            <QuickRef onNavigateControl={openControlById} />
          </div>
        )}

        {tab === 'changelog' && (
          <div className="anim-fade-up">
            <ChangelogView onNavigateControl={openControlById} />
          </div>
        )}
      </main>

      {searchOpen && (
        <SearchOverlay
          query={query}
          setQuery={setQuery}
          results={searchResults}
          onSelect={handleSearchSelect}
          onClose={closeSearch}
        />
      )}
    </div>
  )
}

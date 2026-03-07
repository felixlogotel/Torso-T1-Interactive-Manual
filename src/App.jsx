import { useState, useEffect, useCallback, useMemo, Fragment } from 'react'
import { KNOBS, BUTTONS, SECTIONS } from './data/params.js'
import Device from './components/Device.jsx'
import DetailPanel from './components/DetailPanel.jsx'
import ExplanationPanel from './components/ExplanationPanel.jsx'
import QuickRef from './components/QuickRef.jsx'
import ChangelogView from './components/Changelog.jsx'
import SearchOverlay from './components/SearchOverlay.jsx'
import StructureGuide from './components/StructureGuide.jsx'
import { extractControlIdsFromText, getControlById } from './lib/controlCatalog.js'
import './App.css'

const TABS = [
  { id: 'device', label: 'Device' },
  { id: 'structure', label: 'Structure' },
  { id: 'quickref', label: 'Essentiels' },
  { id: 'changelog', label: 'Changelog' },
]

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

function buildSearchIndex() {
  const items = []

  for (const knob of KNOBS) {
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

  for (const button of BUTTONS) {
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

const SEARCH_INDEX = buildSearchIndex()

export default function App() {
  const [tab, setTab] = useState('device')
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [deviceHint, setDeviceHint] = useState(null)

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

    return SEARCH_INDEX
      .filter((item) => item.text.includes(normalizedQuery))
      .sort((a, b) => {
        const aExact = a.label.toLowerCase().startsWith(normalizedQuery) ? 2 : 0
        const bExact = b.label.toLowerCase().startsWith(normalizedQuery) ? 2 : 0
        return bExact - aExact
      })
      .slice(0, 8)
  }, [query])

  const handleSelect = useCallback((type, data) => {
    if (!data?.id) return
    setDeviceHint(null)
    setSelected((current) => (current?.id === data.id ? null : { type, id: data.id, data }))
  }, [])

  const openControlById = useCallback(
    (controlId) => {
      const target = getControlById(controlId)
      if (!target) return

      closeSearch()
      setTab('device')
      setDeviceHint(null)
      setSelected({ type: target.type, id: target.id, data: target.data })
    },
    [closeSearch],
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
            <div className="app-brand-subtitle">MANUEL INTERACTIF</div>
          </div>
        </div>

        <nav className="app-tabs">
          {TABS.map((tabItem, i) => (
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
            Official Manual
          </a>
        </nav>

        <div className="app-header-spacer" />

        <div className="app-version-badge">v2.1.3</div>

        <button onClick={() => setSearchOpen(true)} className="app-search-btn">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <span className="app-search-label">Rechercher</span>
          <span className="app-search-kbd">⌘K</span>
        </button>
      </header>

      <main className="app-main">
        {tab === 'device' && (
          <div className="anim-fade-up app-device-layout">
            <div className="app-device-left">
              <Device
                selected={selected}
                onSelect={handleSelect}
                hint={deviceHint}
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
                    <div className="app-device-hint-title">Raccourcis</div>
                    <div className="app-device-hint-body">
                      Les raccourcis du contrôle sélectionné s’affichent ici.
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

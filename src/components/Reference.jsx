import { useState } from 'react'
import { KNOBS, BUTTONS, SECTIONS } from '../data/params.js'
import InlineControlText from './InlineControlText.jsx'

function ParamCard({ data, type, color, onNavigateControl }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={() => onNavigateControl?.(data.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}0c` : 'var(--surface)',
        border: `1px solid ${hovered ? color + '40' : 'var(--border)'}`,
        borderRadius: 12, padding: '15px',
        cursor: onNavigateControl ? 'pointer' : 'default',
        transition: 'all 0.15s',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
    >
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-mono)',
              letterSpacing: 0.8, color: hovered ? color : 'var(--text)',
              transition: 'color 0.15s',
            }}>{data.label}</span>
            {data.secondary && (
              <span style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', color: color + '99',
                background: color + '12', border: `1px solid ${color}22`,
                borderRadius: 3, padding: '1px 6px', letterSpacing: 0.5,
              }}>/ {data.secondary}</span>
            )}
          </div>
        </div>
        <div style={{ width: 30, height: 30, borderRadius: 5, flexShrink: 0, marginTop: 1 }}>
          {type === 'knob' ? (
            <div style={{
              width: '100%', height: '100%', borderRadius: '50%',
              background: `${color}18`, border: `1.5px solid ${color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ width: 1.5, height: 7, borderRadius: 1, background: color, marginTop: -4 }} />
            </div>
          ) : (
            <div style={{
              width: '100%', height: '100%', borderRadius: 4,
              background: `${color}18`, border: `1.5px solid ${color}44`,
            }} />
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.52, margin: 0 }}>
        <InlineControlText text={data.description} onNavigateControl={onNavigateControl} />
      </p>

      {onNavigateControl && (
        <div style={{ fontSize: 13, color: color + '88', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>Afficher le device</span>
          <span>→</span>
        </div>
      )}
    </div>
  )
}

function SectionGroup({ title, color, items, type, onNavigateControl }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
        paddingBottom: 10, borderBottom: `1px solid ${color}22`,
      }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, background: color }} />
        <h2 style={{
          fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700,
          letterSpacing: 2.4, color,
        }}>{title}</h2>
        <span style={{ fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font-mono)' }}>
          {items.length} paramètre{items.length > 1 ? 's' : ''}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
        marginBottom: 32,
      }}>
        {items.map(item => (
          <ParamCard
            key={item.id}
            data={item}
            type={type || 'knob'}
            color={color}
            onNavigateControl={onNavigateControl}
          />
        ))}
      </div>
    </div>
  )
}

export default function Reference({ onNavigateControl }) {
  const [filter, setFilter] = useState('all')

  const FILTERS = [
    { id: 'all',    label: 'Tout' },
    { id: 'SHAPE',  label: 'SHAPE',  color: '#5BA3C9' },
    { id: 'GROOVE', label: 'GROOVE', color: '#9A72C4' },
    { id: 'TONAL',  label: 'TONAL',  color: '#6AB870' },
    { id: 'SETUP',  label: 'SETUP',  color: '#C49042' },
    { id: 'BUTTONS',label: 'Boutons', color: '#888888' },
  ]

  const sectionsToShow = filter === 'all'
    ? ['SHAPE', 'GROOVE', 'TONAL', 'SETUP']
    : filter === 'BUTTONS' ? []
    : [filter]

  const showButtons = filter === 'all' || filter === 'BUTTONS'

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          Référence des Paramètres
        </h1>
        <p style={{ fontSize: 17, color: 'var(--text-2)', lineHeight: 1.48 }}>
          Documentation complète des 18 knobs et boutons du Torso T-1. Cliquer sur une carte pour l'explorer dans la vue Device.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 28,
        padding: '6px', background: 'var(--surface)', borderRadius: 10,
        border: '1px solid var(--border)', width: 'fit-content',
      }}>
        {FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              padding: '6px 15px', borderRadius: 6, cursor: 'pointer',
              fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700,
              letterSpacing: 1.2,
              background: filter === f.id ? (f.color ? f.color + '20' : 'var(--surface-3)') : 'transparent',
              border: `1px solid ${filter === f.id ? (f.color || 'var(--border-2)') + '50' : 'transparent'}`,
              color: filter === f.id ? (f.color || 'var(--text)') : 'var(--text-3)',
              transition: 'all 0.15s',
            }}
          >{f.label}</button>
        ))}
      </div>

      {/* Content */}
      {sectionsToShow.map(sec => {
        const { color } = SECTIONS[sec]
        const items = KNOBS.filter(k => k.section === sec)
        return (
          <SectionGroup
            key={sec}
            title={sec}
            color={color}
            items={items}
            type="knob"
            onNavigateControl={onNavigateControl}
          />
        )
      })}

      {showButtons && (
        <SectionGroup
          title="BOUTONS & CONTRÔLES"
          color="#6688aa"
          items={BUTTONS}
          type="button"
          onNavigateControl={onNavigateControl}
        />
      )}
    </div>
  )
}

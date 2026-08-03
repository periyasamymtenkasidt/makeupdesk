import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

export function ClientCombobox({ label, value, options = [], onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [query,  setQuery]  = useState('')
  const wrapperRef = useRef(null)
  const searchRef  = useRef(null)

  useEffect(() => {
    function handleOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (isOpen) setTimeout(() => searchRef.current?.focus(), 0)
  }, [isOpen])

  const newOpt     = options.find(o => o.value === 'new')
  const clientOpts = options.filter(o => o.value !== 'new')
  const filtered   = query
    ? clientOpts.filter(o => o.label.toLowerCase().includes(query.toLowerCase()))
    : clientOpts

  const selectedOpt = options.find(o => String(o.value) === String(value))

  function pick(val) {
    onChange(val)
    setIsOpen(false)
    setQuery('')
  }

  const triggerLabel = selectedOpt?.value === 'new' || !selectedOpt
    ? '+ New Client'
    : selectedOpt.label

  const isNew = !selectedOpt || selectedOpt.value === 'new'

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
          marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {label}
        </label>
      )}

      {/* Trigger */}
      <div
        onClick={() => setIsOpen(o => !o)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '12px', cursor: 'pointer',
          border: isOpen ? '1.5px solid var(--color-rose-gold)' : '1.5px solid var(--dash-border)',
          background: 'var(--dash-input-bg)',
          fontSize: '13.5px', color: isNew ? 'var(--dash-text-muted)' : 'var(--dash-text-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
          boxShadow: isOpen ? '0 0 14px rgba(201,149,108,0.25)' : 'none',
          transition: 'all 0.2s ease', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {triggerLabel}
        </span>
        <ChevronDown size={15} style={{
          color: 'var(--dash-text-muted)', flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease',
        }} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, zIndex: 400,
          background: 'var(--dash-card-bg)', borderRadius: '14px',
          border: '1.5px solid var(--dash-border)',
          boxShadow: '0 16px 40px var(--dash-shadow)',
          padding: '6px', boxSizing: 'border-box',
        }}>

          {/* Search input */}
          <div style={{ padding: '4px 2px 6px', position: 'relative' }}>
            <Search size={13} style={{
              position: 'absolute', left: 12, top: '50%', transform: 'translateY(-52%)',
              color: 'var(--dash-text-muted)', pointerEvents: 'none',
            }} />
            <input
              ref={searchRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or phone…"
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%', padding: '8px 10px 8px 30px', borderRadius: '8px',
                border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
                fontSize: '12.5px', color: 'var(--dash-text-primary)', outline: 'none',
                fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Scrollable list */}
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>

            {/* + New Client — always at top, hidden when searching */}
            {!query && newOpt && (
              <OptionRow
                label="+ New Client"
                isSelected={value === 'new'}
                accent
                onClick={() => pick('new')}
              />
            )}

            {clientOpts.length > 0 && !query && (
              <div style={{ height: 1, background: 'var(--dash-border)', margin: '4px 8px' }} />
            )}

            {filtered.length === 0 && query ? (
              <div style={{ padding: '10px 12px', fontSize: '12.5px', color: 'var(--dash-text-muted)', textAlign: 'center' }}>
                No clients match "{query}"
              </div>
            ) : (
              filtered.map(opt => (
                <OptionRow
                  key={opt.value}
                  label={opt.label}
                  isSelected={String(opt.value) === String(value)}
                  onClick={() => pick(opt.value)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function OptionRow({ label, isSelected, accent, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '9px 14px', borderRadius: '8px', cursor: 'pointer', margin: '2px 0',
        fontSize: '13px', fontWeight: isSelected ? 700 : accent ? 600 : 500,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: isSelected
          ? 'var(--select-active-bg)'
          : hovered ? 'var(--select-hover-bg)' : 'transparent',
        color: isSelected
          ? 'var(--select-active-text)'
          : accent ? 'var(--color-rose-gold)' : hovered ? 'var(--select-hover-text)' : 'var(--dash-text-primary)',
        transition: 'background 0.12s, color 0.12s',
      }}
    >
      <span>{label}</span>
      {isSelected && <Check size={14} strokeWidth={3} style={{ flexShrink: 0 }} color="var(--select-active-text)" />}
    </div>
  )
}

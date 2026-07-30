import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export function CustomSelect({
  label,
  value,
  onChange,
  options = [], // Array of { value, label } or strings
  placeholder = 'Select an option…',
  style: extraStyle,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Normalize options array
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return { value: opt.value ?? opt.id ?? opt.name, label: opt.label ?? opt.name ?? String(opt.value) }
    }
    return { value: opt, label: String(opt) }
  })

  const selectedOpt = normalizedOptions.find(o => String(o.value) === String(value))

  function handleSelect(val) {
    onChange(val)
    setIsOpen(false)
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', ...extraStyle }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
          marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.07em',
        }}>
          {label}
        </label>
      )}

      {/* Select Box Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '12px',
          border: isOpen ? '1.5px solid var(--color-rose-gold)' : '1.5px solid var(--dash-border)',
          background: 'var(--dash-input-bg)', cursor: 'pointer',
          fontSize: '13.5px', color: selectedOpt ? 'var(--dash-text-primary)' : 'var(--dash-text-muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: isOpen ? '0 0 14px rgba(201,149,108,0.25)' : 'none',
          transition: 'all 0.2s ease', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
        }}
      >
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {selectedOpt ? selectedOpt.label : placeholder}
        </span>
        <ChevronDown size={15} style={{
          color: 'var(--dash-text-muted)', flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease',
        }} />
      </div>

      {/* Custom Rose-Gold Styled Dropdown Menu */}
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
          maxHeight: '240px', overflowY: 'auto', zIndex: 400,
          background: 'var(--dash-card-bg)', borderRadius: '14px',
          border: '1.5px solid var(--dash-border)',
          boxShadow: '0 16px 40px var(--dash-shadow)',
          padding: '6px', boxSizing: 'border-box',
        }}>
          {normalizedOptions.length === 0 ? (
            <div style={{ padding: '10px 12px', fontSize: '13px', color: 'var(--dash-text-muted)', textAlign: 'center' }}>
              No options available
            </div>
          ) : (
            normalizedOptions.map(opt => {
              const isSelected = String(opt.value) === String(value)
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    padding: '9px 14px', borderRadius: '8px', cursor: 'pointer',
                    fontSize: '13px', fontWeight: isSelected ? 700 : 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: isSelected ? 'var(--select-active-bg)' : 'transparent',
                    color: isSelected ? 'var(--select-active-text)' : 'var(--dash-text-primary)',
                    boxShadow: isSelected ? '0 4px 12px rgba(201,149,108,0.3)' : 'none',
                    transition: 'all 0.15s ease', margin: '3px 0',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'var(--select-hover-bg)'
                      e.currentTarget.style.color = 'var(--select-hover-text)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'var(--dash-text-primary)'
                    }
                  }}
                >
                  <span style={{ fontWeight: isSelected ? 700 : 500 }}>{opt.label}</span>
                  {isSelected && <Check size={14} color="var(--select-active-text)" strokeWidth={3} />}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

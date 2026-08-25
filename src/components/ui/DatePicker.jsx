import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function toYMD(y, m, d) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

function parseYMD(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  return { y, m, d }
}

export function DatePicker({ label, value, onChange, min, dark = false }) {
  const today = new Date()
  const todayParts = { y: today.getFullYear(), m: today.getMonth() + 1, d: today.getDate() }
  const minParts = min ? parseYMD(min) : todayParts

  const parsed = parseYMD(value)

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const [viewYear, setViewYear] = useState(() => parsed?.y || today.getFullYear())
  const [viewMonth, setViewMonth] = useState(() => parsed ? parsed.m - 1 : today.getMonth())

  const triggerRef = useRef(null)
  const dropRef = useRef(null)

  useEffect(() => {
    if (parsed) { setViewYear(parsed.y); setViewMonth(parsed.m - 1) }
  }, [value])

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (
        dropRef.current && !dropRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  function openPicker() {
    const rect = triggerRef.current.getBoundingClientRect()
    // Determine if calendar should open upward (too close to bottom)
    const spaceBelow = window.innerHeight - rect.bottom
    const calHeight = 310
    if (spaceBelow < calHeight && rect.top > calHeight) {
      setPos({ bottom: window.innerHeight - rect.top + 6, left: rect.left, top: 'auto' })
    } else {
      setPos({ top: rect.bottom + 6, left: rect.left, bottom: 'auto' })
    }
    setOpen(o => !o)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function getDays() {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay()
    const total = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells = Array(firstDay).fill(null)
    for (let d = 1; d <= total; d++) cells.push(d)
    return cells
  }

  function isPast(d) {
    if (!d) return true
    const m = viewMonth + 1
    if (viewYear < minParts.y) return true
    if (viewYear === minParts.y && m < minParts.m) return true
    if (viewYear === minParts.y && m === minParts.m && d < minParts.d) return true
    return false
  }

  function isSelected(d) {
    return !!d && !!parsed && parsed.y === viewYear && parsed.m === viewMonth + 1 && parsed.d === d
  }

  function selectDay(d) {
    if (!d || isPast(d)) return
    onChange(toYMD(viewYear, viewMonth + 1, d))
    setOpen(false)
  }

  const displayValue = parsed
    ? new Date(parsed.y, parsed.m - 1, parsed.d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  const lblStyle = {
    display: 'block', fontSize: '11px', fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.08em',
    color: 'var(--dash-label-text)', marginBottom: '6px',
  }

  const accentColor = dark ? '#c9956c' : 'var(--icon-booking)'
  const textPrimary = dark ? '#f5e1c0' : 'var(--dash-text-primary)'
  const textMuted   = dark ? 'rgba(255,255,255,0.35)' : 'var(--dash-text-muted)'
  const textDisabled = dark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.2)'
  const dropBg      = dark ? '#2d1b2e' : 'var(--dash-card-bg)'
  const dropBorder  = dark ? 'rgba(201,149,108,0.35)' : 'var(--dash-border)'
  const hoverBg     = dark ? 'rgba(201,149,108,0.18)' : 'var(--dash-subtle-row-bg, #f5f0eb)'

  return (
    <>
      <div>
        {label && <label style={lblStyle}>{label}</label>}
        <div style={{ position: 'relative' }} ref={triggerRef}>
          <Calendar size={14} style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--color-rose-gold)', pointerEvents: 'none',
          }} />
          <input
            readOnly
            value={displayValue}
            placeholder="Select date…"
            onClick={openPicker}
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              borderRadius: '12px',
              border: `1.5px solid ${open ? 'var(--color-rose-gold)' : 'var(--dash-border)'}`,
              outline: 'none', fontSize: '14px',
              color: displayValue ? 'var(--dash-input-text)' : 'var(--dash-text-muted)',
              background: 'var(--dash-input-bg)',
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer', boxSizing: 'border-box',
              transition: 'border-color 0.2s',
            }}
          />
        </div>
      </div>

      {open && (
        <div
          ref={dropRef}
          style={{
            position: 'fixed',
            top: pos.top !== 'auto' ? pos.top : 'auto',
            bottom: pos.bottom !== 'auto' ? pos.bottom : 'auto',
            left: pos.left,
            zIndex: 99999,
            background: dropBg,
            border: `1px solid ${dropBorder}`,
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.24)',
            width: '284px',
          }}
        >
          {/* Month navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <button type="button" onClick={prevMonth} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              borderRadius: '8px', padding: '4px 6px',
              color: textPrimary, display: 'flex', alignItems: 'center',
            }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '14px', color: textPrimary }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              borderRadius: '8px', padding: '4px 6px',
              color: textPrimary, display: 'flex', alignItems: 'center',
            }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
            {DAYS.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: '10px', fontWeight: 700,
                padding: '3px 0', color: textMuted,
              }}>{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {getDays().map((d, i) => {
              const past = isPast(d)
              const sel  = isSelected(d)
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!d || past}
                  onClick={() => selectDay(d)}
                  style={{
                    height: '34px', borderRadius: '8px', border: 'none',
                    background: sel ? accentColor : 'none',
                    color: !d ? 'transparent'
                      : past ? textDisabled
                      : sel  ? '#fff'
                      : textPrimary,
                    cursor: !d || past ? 'default' : 'pointer',
                    fontSize: '13px', fontWeight: sel ? 700 : 400,
                    transition: 'background 0.12s',
                    opacity: !d ? 0 : 1,
                  }}
                  onMouseEnter={e => { if (d && !past && !sel) e.currentTarget.style.background = hoverBg }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = 'none' }}
                >
                  {d || ''}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

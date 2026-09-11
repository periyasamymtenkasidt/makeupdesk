import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, X, CalendarRange } from 'lucide-react'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

const HDR_BTN = {
  width: '26px', height: '26px', borderRadius: '7px',
  border: '1px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  color: 'var(--dash-text-muted)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
}

const NAV_BTN = {
  width: '28px', height: '28px', borderRadius: '8px',
  border: '1px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  color: 'var(--dash-text-primary)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0,
}

const SEL = {
  padding: '4px 8px', borderRadius: '7px', border: '1px solid var(--dash-border)',
  background: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)',
  fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', outline: 'none',
  fontFamily: 'Inter, sans-serif',
}

function buildDays(year, month) {
  const firstWd  = new Date(year, month, 1).getDay()
  const count    = new Date(year, month + 1, 0).getDate()
  const days     = []
  for (let i = 0; i < firstWd; i++)
    days.push({ date: new Date(year, month, 1 - firstWd + i), cur: false })
  for (let d = 1; d <= count; d++)
    days.push({ date: new Date(year, month, d), cur: true })
  while (days.length % 7 !== 0) {
    const p = days[days.length - 1].date
    days.push({ date: new Date(p.getFullYear(), p.getMonth(), p.getDate() + 1), cur: false })
  }
  return days
}

function sameDay(a, b) {
  return a && b
    && a.getFullYear() === b.getFullYear()
    && a.getMonth()    === b.getMonth()
    && a.getDate()     === b.getDate()
}

function toStr(d) {
  if (!d) return ''
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function parseStr(s) {
  if (!s) return null
  const d = new Date(s)
  if (isNaN(d)) return null
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function fmtDisplay(d) {
  return d
    ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
}

export function DateRangePopup({ dateFrom, dateTo, onApply, onClose }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const initFrom = parseStr(dateFrom)

  const [vm,    setVm]    = useState((initFrom || today).getMonth())
  const [vy,    setVy]    = useState((initFrom || today).getFullYear())
  const [from,  setFrom]  = useState(initFrom)
  const [to,    setTo]    = useState(parseStr(dateTo))
  const [hover, setHover] = useState(null)
  const [phase, setPhase] = useState('from')

  const days  = buildDays(vy, vm)
  const years = Array.from({ length: 12 }, (_, i) => today.getFullYear() - 4 + i)

  function prev() {
    if (vm === 0) { setVm(11); setVy(y => y - 1) }
    else setVm(m => m - 1)
  }
  function next() {
    if (vm === 11) { setVm(0); setVy(y => y + 1) }
    else setVm(m => m + 1)
  }

  function clickDay(date) {
    if (phase === 'from') {
      setFrom(date); setTo(null); setPhase('to')
    } else {
      const [f, t] = date < from ? [date, from] : [from, date]
      setFrom(f); setTo(t); setPhase('from')
    }
  }

  function reset() {
    setFrom(null); setTo(null); setHover(null); setPhase('from')
  }

  // range endpoints including hover preview
  const rawEnd = phase === 'to' && hover ? hover : to
  const ef = from && rawEnd ? (from <= rawEnd ? from : rawEnd) : from
  const et = from && rawEnd ? (from <= rawEnd ? rawEnd : from) : to

  function cellState(date) {
    const s     = !!(ef && sameDay(date, ef))
    const e     = !!(et && sameDay(date, et))
    const r     = !!(ef && et && date > ef && date < et)
    const isToday = sameDay(date, today)
    return { s, e, both: s && e, r, isToday }
  }

  const canApply = from || to

  return (
    <div style={{
      background: 'var(--dash-card-bg)', borderRadius: '16px',
      boxShadow: '0 14px 44px rgba(0,0,0,0.22)', border: '1px solid var(--dash-border)',
      width: '316px', fontFamily: 'Inter, sans-serif', overflow: 'hidden',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <CalendarRange size={14} style={{ color: '#c9956c' }} />
          <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--dash-text-primary)' }}>
            Select Date Range
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button onClick={reset} title="Reset" style={HDR_BTN}><RotateCcw size={12} /></button>
          <button onClick={onClose} title="Close" style={HDR_BTN}><X size={12} /></button>
        </div>
      </div>

      {/* From / To display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '0 16px 12px' }}>
        {[
          { label: 'From', date: from, active: phase === 'from' },
          { label: 'To',   date: to,   active: phase === 'to'   },
        ].map(({ label, date, active }) => (
          <div key={label} style={{
            padding: '8px 10px', borderRadius: '10px',
            border: `1.5px solid ${active ? '#c9956c' : 'var(--dash-border)'}`,
            background: active ? 'rgba(201,149,108,0.08)' : 'var(--dash-input-bg)',
          }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '2px' }}>
              {label}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: date ? 'var(--dash-text-primary)' : 'var(--dash-text-muted)' }}>
              {date ? fmtDisplay(date) : 'Select…'}
            </div>
          </div>
        ))}
      </div>

      {/* Month / Year nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px 8px' }}>
        <button onClick={prev} style={NAV_BTN}><ChevronLeft size={14} /></button>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select value={vm} onChange={e => setVm(+e.target.value)} style={SEL}>
            {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
          </select>
          <select value={vy} onChange={e => setVy(+e.target.value)} style={SEL}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button onClick={next} style={NAV_BTN}><ChevronRight size={14} /></button>
      </div>

      {/* Weekday headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 10px 4px' }}>
        {WEEK_DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', padding: '2px 0' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 10px 12px' }}>
        {days.map(({ date, cur }, i) => {
          const { s, e, both, r, isToday } = cellState(date)

          const outerBg = r
            ? 'rgba(201,149,108,0.12)'
            : (s && !both) ? 'linear-gradient(to right, transparent 50%, rgba(201,149,108,0.12) 50%)'
            : (e && !both) ? 'linear-gradient(to left,  transparent 50%, rgba(201,149,108,0.12) 50%)'
            : 'transparent'

          const innerBg = (s || e)
            ? 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)'
            : (isToday && !r)
            ? 'rgba(201,149,108,0.15)'
            : 'transparent'

          const color = !cur
            ? 'var(--dash-text-muted)'
            : (s || e) ? '#fff'
            : isToday  ? '#c9956c'
            : 'var(--dash-text-primary)'

          return (
            <div key={i} style={{ background: outerBg, padding: '2px 0' }}>
              <div
                onClick={() => cur && clickDay(date)}
                onMouseEnter={() => phase === 'to' && setHover(date)}
                onMouseLeave={() => setHover(null)}
                style={{
                  width: '34px', height: '34px', margin: '0 auto',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12.5px', fontWeight: (s || e || isToday) ? 700 : 500,
                  cursor: cur ? 'pointer' : 'default',
                  background: innerBg, color,
                  border: (isToday && !s && !e) ? '1.5px solid rgba(201,149,108,0.4)' : '1.5px solid transparent',
                  boxSizing: 'border-box', transition: 'background 0.1s',
                }}
              >
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Apply */}
      <div style={{ padding: '0 16px 16px' }}>
        <button
          onClick={() => canApply && onApply(toStr(from), toStr(to))}
          style={{
            width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
            background: canApply
              ? 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)'
              : 'var(--dash-border)',
            color: canApply ? '#fff' : 'var(--dash-text-muted)',
            fontSize: '13px', fontWeight: 700,
            cursor: canApply ? 'pointer' : 'default',
            fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

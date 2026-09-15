import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WEEK_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

const NAV_BTN = {
  width: '28px', height: '28px', borderRadius: '8px',
  border: '1px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  color: 'var(--dash-text-primary)', cursor: 'pointer',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
}

const SEL = {
  padding: '4px 8px', borderRadius: '7px', border: '1px solid var(--dash-border)',
  background: 'var(--dash-input-bg)', color: 'var(--dash-text-primary)',
  fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', outline: 'none',
  fontFamily: 'Inter, sans-serif',
}

function buildDays(year, month) {
  const firstWd = new Date(year, month, 1).getDay()
  const count   = new Date(year, month + 1, 0).getDate()
  const days    = []
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

function toStr(d) {
  if (!d) return ''
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
}

function parseStr(s) {
  if (!s) return null
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function sameDay(a, b) {
  return a && b
    && a.getFullYear() === b.getFullYear()
    && a.getMonth()    === b.getMonth()
    && a.getDate()     === b.getDate()
}

export function DatePickerPopup({ value, onChange, min, onClose }) {
  const today   = new Date(); today.setHours(0, 0, 0, 0)
  const minDate = min ? parseStr(min) : null
  const init    = parseStr(value)

  const [vm,       setVm]       = useState((init || today).getMonth())
  const [vy,       setVy]       = useState((init || today).getFullYear())
  const [selected, setSelected] = useState(init)

  const days  = buildDays(vy, vm)
  const years = Array.from({ length: 12 }, (_, i) => today.getFullYear() - 2 + i)

  function prev() {
    if (vm === 0) { setVm(11); setVy(y => y - 1) } else setVm(m => m - 1)
  }
  function next() {
    if (vm === 11) { setVm(0); setVy(y => y + 1) } else setVm(m => m + 1)
  }

  function clickDay(date) {
    if (minDate && date < minDate) return
    setSelected(date)
    onChange(toStr(date))
    onClose()
  }

  return (
    <div style={{
      background: 'var(--dash-card-bg)', borderRadius: '16px',
      boxShadow: '0 14px 44px rgba(0,0,0,0.22)', border: '1px solid var(--dash-border)',
      width: '300px', fontFamily: 'Inter, sans-serif', overflow: 'hidden',
    }}>

      {/* Month / Year nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px 10px' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', padding: '0 10px 16px' }}>
        {days.map(({ date, cur }, i) => {
          const isSelected = sameDay(date, selected)
          const isToday    = sameDay(date, today)
          const isDisabled = !cur || (minDate && date < minDate)

          return (
            <div key={i} style={{ padding: '2px 0' }}>
              <div
                onClick={() => !isDisabled && clickDay(date)}
                style={{
                  width: '34px', height: '34px', margin: '0 auto',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12.5px', fontWeight: isSelected || isToday ? 700 : 500,
                  cursor: isDisabled ? 'default' : 'pointer',
                  background: isSelected
                    ? 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)'
                    : isToday ? 'rgba(201,149,108,0.15)' : 'transparent',
                  color: isDisabled
                    ? 'var(--dash-text-muted)'
                    : isSelected ? '#fff'
                    : isToday ? '#c9956c'
                    : 'var(--dash-text-primary)',
                  border: isToday && !isSelected ? '1.5px solid rgba(201,149,108,0.4)' : '1.5px solid transparent',
                  boxSizing: 'border-box', transition: 'background 0.1s',
                  opacity: isDisabled ? 0.35 : 1,
                }}
              >
                {date.getDate()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

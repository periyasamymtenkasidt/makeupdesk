import { useState, useEffect, useRef } from 'react'
import { Clock } from 'lucide-react'
import { getFreeWindows } from '../../utils/slots'

// ── helpers ────────────────────────────────────────────────────────────────────

const HOURS    = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
const EARLIEST = 5 * 60

export function parseSlotHour(v) {
  if (!v) return 9
  return parseInt(v.split(':')[0], 10)
}

export function slotTo24h(h) {
  return `${String(h).padStart(2, '0')}:00`
}

function slotLabel(h) {
  if (h < 12)   return `${h}:00 AM`
  if (h === 12) return `12:00 PM`
  return `${h - 12}:00 PM`
}

// ── component ──────────────────────────────────────────────────────────────────

export function SlotTimePicker({
  value,
  onChange,
  dark       = false,
  date,
  appointments = [],
  durationMins = 120,
  vendorId     = null,
  excludeId    = null,
}) {
  const [selHour, setSelHour] = useState(() => parseSlotHour(value))
  const skipEmit = useRef(true)

  useEffect(() => {
    const h = parseSlotHour(value)
    setSelHour(s => s === h ? s : h)
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (skipEmit.current) { skipEmit.current = false; return }
    onChange(slotTo24h(selHour))
  }, [selHour]) // eslint-disable-line react-hooks/exhaustive-deps

  // Availability
  const freeWindows = date
    ? getFreeWindows(date, appointments, vendorId, durationMins).filter(w => w.start >= EARLIEST)
    : []

  const hasBlocking = date && appointments.some(a => {
    if (excludeId && a.id === excludeId) return false
    const BS = new Set([
      'Shift Reserved', 'Approved', 'Payment Pending', 'Advance Paid',
      'Confirmed', 'In Progress', 'Completed', 'Balance Paid', 'Closed',
    ])
    if (!BS.has(a.status)) return false
    const [y, mo, dy] = date.split('-').map(Number)
    const d = new Date(a.date)
    if (d.getFullYear() !== y || d.getMonth() + 1 !== mo || d.getDate() !== dy) return false
    if (vendorId !== null && a.vendorId !== vendorId) return false
    return true
  })
  const fullyFree = date && !hasBlocking

  function slotOk(h) {
    if (!date || fullyFree) return true
    const mins = h * 60
    return freeWindows.some(w => mins >= w.start && mins + durationMins <= w.end)
  }

  const freeCount = HOURS.filter(h => slotOk(h)).length

  // Theme tokens
  const t = dark ? {
    header:    'rgba(255,255,255,0.45)',
    cardBg:    'rgba(255,255,255,0.05)',
    cardBorder:'rgba(255,255,255,0.09)',
    cardText:  'rgba(255,255,255,0.88)',
    icon:      'rgba(255,255,255,0.32)',
    dimBg:     'rgba(255,255,255,0.02)',
  } : {
    header:    'var(--dash-label-text)',
    cardBg:    'var(--dash-card-bg)',
    cardBorder:'var(--dash-border)',
    cardText:  'var(--dash-text-primary)',
    icon:      'var(--dash-text-muted)',
    dimBg:     'transparent',
  }

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12,
      }}>
        <span style={{
          fontSize: 10.5, fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: t.header,
        }}>
          Available Time Slots
        </span>
        {date && (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>
            {freeCount} slots free
          </span>
        )}
      </div>

      {/* 4-column grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {HOURS.map(h => {
          const ok    = slotOk(h)
          const isSel = selHour === h
          return (
            <button
              key={h}
              type="button"
              onClick={() => { setSelHour(h) }}
              disabled={!ok && !isSel}
              style={{
                padding: '12px 6px',
                borderRadius: 12,
                border: '1.5px solid',
                borderColor: isSel ? '#c9956c' : t.cardBorder,
                background: isSel
                  ? 'linear-gradient(135deg, #c9956c 0%, #d4729f 100%)'
                  : ok ? t.cardBg : t.dimBg,
                opacity: !ok && !isSel ? 0.32 : 1,
                cursor: ok || isSel ? 'pointer' : 'default',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 5,
                boxShadow: isSel ? '0 4px 14px rgba(201,149,108,0.38)' : 'none',
                transition: 'all 0.14s ease',
                outline: 'none', fontFamily: 'Inter, sans-serif',
              }}
            >
              <Clock
                size={13}
                style={{ color: isSel ? 'rgba(255,255,255,0.75)' : t.icon }}
              />
              <span style={{
                fontSize: 13.5, fontWeight: 700, lineHeight: 1,
                color: isSel ? '#fff' : t.cardText,
                whiteSpace: 'nowrap',
              }}>
                {slotLabel(h)}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

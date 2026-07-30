import { Clock } from 'lucide-react'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * @param {object[]} slots          - [{ value, label, booked }] from generateSlots
 * @param {string}   value          - currently selected slot value ("HH:MM")
 * @param {function} onChange       - (value: string) => void
 * @param {boolean}  offDay         - artist is not working on selected date
 * @param {string}   date           - "YYYY-MM-DD" (to show day name in off-day msg)
 * @param {'dash'|'landing'}  variant
 */
export function SlotPicker({ slots = [], value, onChange, offDay, date, variant = 'dash' }) {
  const isLanding = variant === 'landing'

  const textPrimary   = isLanding ? 'rgba(255,255,255,0.9)'    : 'var(--dash-text-primary)'
  const textMuted     = isLanding ? 'rgba(255,255,255,0.45)'   : 'var(--dash-text-muted)'
  const surfaceBg     = isLanding ? 'rgba(255,255,255,0.07)'   : 'var(--dash-surface)'
  const bookedBg      = isLanding ? 'rgba(255,255,255,0.03)'   : 'rgba(0,0,0,0.04)'
  const bookedColor   = isLanding ? 'rgba(255,255,255,0.2)'    : 'rgba(0,0,0,0.25)'
  const bookedBorder  = isLanding ? 'rgba(255,255,255,0.08)'   : 'rgba(0,0,0,0.08)'
  const takenColor    = isLanding ? 'rgba(255,255,255,0.25)'   : 'rgba(0,0,0,0.3)'
  const labelStyle    = {
    fontSize: '11px', fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '0.07em', color: textMuted,
  }

  if (offDay) {
    const dayName = date ? DAY_NAMES[new Date(date + 'T00:00:00').getDay()] : 'this day'
    return (
      <div style={{
        padding: '16px 20px', borderRadius: '12px', textAlign: 'center',
        background: 'rgba(220,38,38,0.06)', border: '1.5px dashed rgba(220,38,38,0.2)',
        color: '#dc2626', fontSize: '13px', fontWeight: 500,
      }}>
        Artist is off on {dayName}s. Please pick a different date.
      </div>
    )
  }

  if (!slots.length) return null

  const freeCount = slots.filter(s => !s.booked).length

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={labelStyle}>Available Time Slots</span>
        <span style={{ fontSize: '11px', fontWeight: 600, color: freeCount > 0 ? '#059669' : '#dc2626' }}>
          {freeCount} slot{freeCount !== 1 ? 's' : ''} free
        </span>
      </div>

      {freeCount === 0 ? (
        <div style={{
          padding: '16px', borderRadius: '12px', textAlign: 'center',
          background: 'rgba(220,38,38,0.06)', border: '1.5px dashed rgba(220,38,38,0.2)',
          color: '#dc2626', fontSize: '13px', fontWeight: 500,
        }}>
          Fully booked on this date. Please pick another day.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {slots.map(slot => {
            const selected = value === slot.value
            return (
              <button
                key={slot.value}
                type="button"
                disabled={slot.booked}
                onClick={() => !slot.booked && onChange(slot.value)}
                style={{
                  padding: '8px 4px', borderRadius: '10px', fontSize: '12px',
                  fontWeight: 600, fontFamily: 'Inter, sans-serif',
                  cursor: slot.booked ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                  border: selected
                    ? '1.5px solid transparent'
                    : slot.booked
                    ? `1.5px solid ${bookedBorder}`
                    : '1.5px solid rgba(201,149,108,0.3)',
                  background: selected
                    ? 'linear-gradient(135deg,#c9956c,#d4728f)'
                    : slot.booked
                    ? bookedBg
                    : surfaceBg,
                  color: selected ? 'white' : slot.booked ? bookedColor : textPrimary,
                  boxShadow: selected ? '0 2px 10px rgba(201,149,108,0.4)' : 'none',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Clock size={10} style={{ opacity: slot.booked ? 0.3 : 0.6 }} />
                  {slot.label}
                  {slot.booked && (
                    <span style={{ fontSize: '9px', color: takenColor, fontWeight: 500 }}>Taken</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

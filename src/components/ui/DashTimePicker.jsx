import { checkTimeAvailability, getFreeWindows } from '../../utils/slots'
import { SlotTimePicker, parseSlotHour, slotTo24h } from './SlotTimePicker'

const EARLIEST = 5 * 60

function minsTo12h(mins) {
  if (mins >= 1440) return 'Midnight'
  const h   = Math.floor(mins / 60) % 24
  const m   = mins % 60
  const ap  = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`
}

function windowDur(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`
}

export function DashTimePicker({
  value,
  onChange,
  date,
  appointments = [],
  durationMins  = 120,
  vendorId      = null,
  excludeId     = null,
  artistObjs    = [],
}) {
  const currentVal = slotTo24h(parseSlotHour(value))

  const avail = date
    ? checkTimeAvailability(currentVal, durationMins, date, appointments, excludeId, vendorId)
    : { available: null }

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

  const lbl = {
    display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--dash-label-text)',
    marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Available Windows */}
      {date && (
        <div>
          <div style={lbl}>Available Windows</div>
          {fullyFree ? (
            <div style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11.5, fontWeight: 600,
              background: 'var(--badge-confirmed-bg)', color: 'var(--badge-confirmed)',
              border: '1px solid rgba(5,150,105,0.2)',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              ✓ Artist is fully available on this date
            </div>
          ) : freeWindows.length === 0 ? (
            <div style={{
              padding: '6px 12px', borderRadius: 8, fontSize: 11.5, fontWeight: 600,
              background: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected)',
              border: '1px solid rgba(220,38,38,0.2)',
              display: 'inline-flex', alignItems: 'center', gap: 5,
            }}>
              ✗ No slots available for this service duration
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {freeWindows.map((w, i) => (
                <div key={i} style={{
                  padding: '5px 10px', borderRadius: 7,
                  background: 'var(--badge-confirmed-bg)',
                  border: '1px solid rgba(5,150,105,0.2)',
                  fontSize: 11.5, fontWeight: 600, color: 'var(--badge-confirmed)',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                }}>
                  {minsTo12h(w.start)} → {minsTo12h(w.end)}
                  <span style={{ fontWeight: 500, opacity: 0.7 }}>· {windowDur(w.end - w.start)} free</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Slot grid */}
      <SlotTimePicker
        value={value}
        onChange={onChange}
        dark={false}
        date={date}
        appointments={appointments}
        durationMins={durationMins}
        vendorId={vendorId}
        excludeId={excludeId}
        artistObjs={artistObjs}
      />

      {/* Availability badge */}
      {date && avail.available !== null && (
        <div style={{
          padding: '7px 13px', borderRadius: 9,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11.5, fontWeight: 600,
          background: avail.available ? 'var(--badge-confirmed-bg)' : 'var(--badge-rejected-bg)',
          color:      avail.available ? 'var(--badge-confirmed)'    : 'var(--badge-rejected)',
          border: `1px solid ${avail.available ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)'}`,
        }}>
          {avail.available
            ? '✓ Slot available'
            : '✗ Unavailable — artist blocked including 2h travel window'}
        </div>
      )}

    </div>
  )
}

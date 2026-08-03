import { useState, useMemo } from 'react'
import { Clock, MapPin, User, MessageCircle, Plus } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { to24h } from '../../utils/timeFormat'
import { useAppointments } from '../../context/AppointmentContext'
import { useAvailability } from '../../context/AvailabilityContext'

function parse12h(t) {
  if (!t) return null
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return null
  let h = +m[1], mn = +m[2], p = m[3].toUpperCase()
  if (p === 'PM' && h !== 12) h += 12
  if (p === 'AM' && h === 12) h = 0
  return h * 60 + mn
}

function hhmm2mins(hhmm) {
  if (!hhmm) return null
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

function mins2display(mins) {
  const h = Math.floor(mins / 60) % 24
  const m = mins % 60
  const p = h >= 12 ? 'PM' : 'AM'
  const hr = h % 12 || 12
  return `${hr}:${String(m).padStart(2, '0')} ${p}`
}

function fmtDur(mins) {
  const h = Math.floor(mins / 60), m = mins % 60
  if (h === 0) return `${m} mins`
  if (m === 0) return `${h} hr${h > 1 ? 's' : ''}`
  return `${h} hr${h > 1 ? 's' : ''} ${m} mins`
}

function waNum(phone) {
  const digits = String(phone || '').replace(/\D/g, '')
  if (digits.length === 10) return '91' + digits
  return digits
}

export default function TodayTimeline({ onBookSlot }) {
  const [filter, setFilter] = useState('all')
  const { appointments } = useAppointments()
  const { availability } = useAvailability()

  const timeline = useMemo(() => {
    const todayStr  = new Date().toISOString().split('T')[0]
    const workStart = hhmm2mins(availability?.startTime) ?? 9 * 60
    const workEnd   = hhmm2mins(availability?.endTime)   ?? 18 * 60

    const todayAppts = appointments
      .filter(a => a.date === todayStr && !['Rejected', 'Closed'].includes(a.status))
      .map(a => {
        const startMins = parse12h(a.time)
        if (startMins == null) return null
        const dur     = a.totalDurationMins || 60
        const endMins = startMins + dur
        const isVenue = a.location && !a.location.toLowerCase().includes('studio')
        const team    = Array.isArray(a.assignedArtists) && a.assignedArtists.length > 0
          ? a.assignedArtists
          : a.artist ? a.artist.split(',').map(s => s.trim()).filter(Boolean) : []
        return {
          id: `booking-${a.id}`, type: 'booking',
          startMins, endMins,
          startTime: mins2display(startMins),
          endTime:   mins2display(endMins),
          duration:  fmtDur(dur),
          client:    a.name,
          service:   a.service,
          locationType:  isVenue ? 'venue' : 'studio',
          locationName:  a.venueAddress || a.location || 'Studio',
          team, status: a.status,
          phone: waNum(a.phone),
          notes: a.notes || '',
        }
      })
      .filter(Boolean)
      .sort((a, b) => a.startMins - b.startMins)

    if (todayAppts.length === 0) {
      return [{
        id: 'open-all', type: 'open',
        startMins: workStart, endMins: workEnd,
        startTime: mins2display(workStart), endTime: mins2display(workEnd),
        duration: `${fmtDur(workEnd - workStart)} free`,
        label: 'Open for Bookings',
      }]
    }

    const result = []

    todayAppts.filter(a => a.startMins < workStart && a.endMins <= workStart).forEach(a => result.push(a))

    let cursor = workStart
    const withinWork = todayAppts.filter(a => a.endMins > workStart && a.startMins < workEnd)

    for (const appt of withinWork) {
      const slotStart = Math.max(appt.startMins, workStart)
      if (slotStart > cursor) {
        result.push({
          id: `open-${cursor}`, type: 'open',
          startMins: cursor, endMins: slotStart,
          startTime: mins2display(cursor), endTime: mins2display(slotStart),
          duration: `${fmtDur(slotStart - cursor)} free`,
          label: 'Open for Bookings',
        })
      }
      result.push(appt)
      cursor = Math.max(cursor, appt.endMins)
    }

    if (cursor < workEnd) {
      result.push({
        id: `open-${cursor}`, type: 'open',
        startMins: cursor, endMins: workEnd,
        startTime: mins2display(cursor), endTime: mins2display(workEnd),
        duration: `${fmtDur(workEnd - cursor)} free`,
        label: 'Open for Bookings',
      })
    }

    todayAppts.filter(a => a.startMins >= workEnd).forEach(a => result.push(a))

    return result
  }, [appointments, availability])

  const bookedCount = timeline.filter(s => s.type === 'booking').length
  const openCount   = timeline.filter(s => s.type === 'open').length

  const filteredItems = timeline.filter(item => {
    if (filter === 'booked') return item.type === 'booking'
    if (filter === 'open')   return item.type === 'open'
    return true
  })

  const handleWhatsApp = (phone, name, time) => {
    const sName = (() => { try { return JSON.parse(localStorage.getItem('md_settings') || '{}').studioName || 'MakeupDesk' } catch { return 'MakeupDesk' } })()
    const text = encodeURIComponent(`Hi ${name}! This is a reminder from ${sName} for your makeup appointment today at ${time}. Let us know if you need anything! ✨`)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
  }

  return (
    <Card>
      <CardHeader style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'var(--icon-booking-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Clock size={18} style={{ color: 'var(--icon-booking)' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px', margin: 0 }}>
              Today's Live Availability & Slots
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', margin: '2px 0 0' }}>
              Real-time schedule breakdown based on slot availability
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--dash-filter-wrap)', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'all',    label: 'All Slots' },
            { id: 'booked', label: `Booked (${bookedCount})` },
            { id: 'open',   label: `Open Slots (${openCount})` },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              border: 'none',
              background: filter === f.id ? 'var(--dash-filter-active-bg)' : 'transparent',
              color: filter === f.id ? 'var(--dash-filter-active-tx)' : 'var(--dash-filter-muted-tx)',
              fontWeight: filter === f.id ? 600 : 500, fontSize: '11px',
              padding: '4px 10px', borderRadius: '7px', cursor: 'pointer',
              boxShadow: filter === f.id ? '0 2px 6px var(--dash-shadow)' : 'none',
              transition: 'all 0.15s ease',
            }}>
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardBody className="no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px', maxHeight: '520px', overflowY: 'auto' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--dash-text-muted)', fontSize: '13px' }}>
            No slots to show
          </div>
        ) : filteredItems.map(slot => {

          if (slot.type === 'booking') {
            return (
              <div key={slot.id} style={{
                display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px',
                borderRadius: '16px', background: 'var(--dash-surface)',
                border: '1px solid var(--dash-border)', boxShadow: '0 2px 10px var(--dash-shadow)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '14px',
                      color: 'var(--dash-text-primary)', background: 'var(--dash-time-badge-bg)',
                      padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                    }}>
                      <Clock size={13} style={{ color: 'var(--icon-booking)' }} />
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--icon-booking)', background: 'var(--icon-booking-bg)', padding: '2px 8px', borderRadius: '9999px' }}>
                      {slot.duration}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px',
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: slot.locationType === 'venue' ? 'var(--badge-venue-bg)' : 'var(--badge-studio-bg)',
                    color: slot.locationType === 'venue' ? 'var(--badge-venue)' : 'var(--badge-studio)',
                  }}>
                    <MapPin size={12} />
                    {slot.locationType === 'venue' ? 'On-Venue' : 'In-Studio'}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                      {slot.client}
                    </h4>
                    <div style={{ fontSize: '13px', color: 'var(--icon-booking)', fontWeight: 500, marginTop: '2px' }}>
                      {slot.service}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ flexShrink: 0, color: 'var(--icon-booking)' }} />
                      {slot.locationName}
                    </div>
                  </div>
                  <Button
                    variant="outline" size="xs"
                    onClick={() => handleWhatsApp(slot.phone, slot.client, slot.startTime)}
                    style={{ color: '#25D366', borderColor: 'rgba(37,211,102,0.3)', background: 'rgba(37,211,102,0.05)', fontSize: '12px', padding: '6px 12px' }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </Button>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
                  paddingTop: '10px', borderTop: '1px dashed var(--dash-border-subtle)', fontSize: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dash-text-secondary)' }}>
                    <User size={12} style={{ color: 'var(--icon-booking)' }} />
                    {slot.team.length > 0
                      ? <span>Team: <strong style={{ color: 'var(--dash-text-primary)', fontWeight: 500 }}>{slot.team.join(', ')}</strong></span>
                      : <span style={{ fontStyle: 'italic' }}>No team assigned</span>
                    }
                  </div>
                  {slot.notes && (
                    <span style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--dash-text-secondary)' }}>
                      "{slot.notes}"
                    </span>
                  )}
                </div>
              </div>
            )
          }

          return (
            <div key={slot.id} style={{
              display: 'flex', alignItems: 'center', padding: '12px 16px', borderRadius: '14px',
              background: 'var(--slot-open-bg)', border: '1px solid var(--slot-open-border)',
              flexWrap: 'wrap', gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--slot-open)', background: 'var(--slot-open-badge-bg)', padding: '3px 8px', borderRadius: '6px' }}>
                  {slot.startTime} – {slot.endTime}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                  {slot.label}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--slot-open)', fontWeight: 500 }}>
                  ({slot.duration})
                </span>
              </div>
              <Button
                variant="outline" size="xs"
                onClick={() => onBookSlot?.({ time: to24h(slot.startTime), date: new Date().toISOString().split('T')[0] })}
                style={{ color: 'var(--slot-open)', borderColor: 'var(--slot-open-border)', background: 'var(--slot-open-bg)', fontSize: '12px' }}
              >
                <Plus size={13} /> Book This Slot
              </Button>
            </div>
          )
        })}
      </CardBody>
    </Card>
  )
}

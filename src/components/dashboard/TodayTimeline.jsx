import { useState } from 'react'
import { Clock, MapPin, User, MessageCircle, Plus, Car } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { to24h } from '../../utils/timeFormat'

const SCHEDULE_TIMELINE = [
  {
    id: 1,
    type: 'booking',
    startTime: '05:30 AM',
    endTime: '08:30 AM',
    duration: '3 hrs',
    client: 'Priya Mehta',
    service: 'Bridal Muhurtham Makeup',
    locationType: 'venue',
    locationName: 'Taj Banjara, Ballroom A',
    team: ['Ananya (Lead MUA)', 'Sneha (Hair)', 'Laxmi (Draper)'],
    status: 'Confirmed',
    phone: '919876543210',
    notes: 'Airbrush HD Makeup & Saree Draping',
  },
  {
    id: 2,
    type: 'buffer',
    startTime: '08:30 AM',
    endTime: '09:30 AM',
    duration: '60 mins',
    label: 'Travel & Studio Setup Buffer',
    notes: 'Commute from Taj Banjara to Jubilee Hills Studio & Sanitization',
  },
  {
    id: 3,
    type: 'open',
    startTime: '09:30 AM',
    endTime: '01:30 PM',
    duration: '4 hrs free',
    label: 'Open for Bookings (Studio Available)',
  },
  {
    id: 4,
    type: 'booking',
    startTime: '02:00 PM',
    endTime: '03:45 PM',
    duration: '1 hr 45 mins',
    client: 'Kavya Nair',
    service: 'Pre-Wedding Shoot Look',
    locationType: 'studio',
    locationName: 'MakeupDesk Studio, Jubilee Hills',
    team: ['Ananya (Lead MUA)', 'Pooja (Stylist)'],
    status: 'Confirmed',
    phone: '919876543211',
    notes: 'Soft Glam with Glossy Lips & Soft Curls',
  },
  {
    id: 5,
    type: 'open',
    startTime: '03:45 PM',
    endTime: '06:00 PM',
    duration: '2 hrs 15 mins free',
    label: 'Open for Bookings (Studio Available)',
  },
  {
    id: 6,
    type: 'booking',
    startTime: '06:00 PM',
    endTime: '08:00 PM',
    duration: '2 hrs',
    client: 'Anjali Sharma',
    service: 'Sangeet Party Glam',
    locationType: 'venue',
    locationName: 'Convention Centre, Hall 2',
    team: ['Divya (Senior Artist)'],
    status: 'Payment Pending',
    phone: '919123456789',
    notes: 'Smokey Eyes & Hollywood Waves',
  },
]

export default function TodayTimeline({ onBookSlot }) {
  const [filter, setFilter] = useState('all')

  const handleWhatsApp = (phone, name, time) => {
    const text = encodeURIComponent(`Hi ${name}! This is a reminder from MakeupDesk for your makeup appointment today at ${time}. Let us know if you need anything! ✨`)
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank')
  }

  const filteredItems = SCHEDULE_TIMELINE.filter(item => {
    if (filter === 'booked') return item.type === 'booking'
    if (filter === 'open') return item.type === 'open'
    return true
  })

  return (
    <Card>
      <CardHeader style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'var(--icon-booking-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
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

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--dash-filter-wrap)', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'all', label: 'All Slots' },
            { id: 'booked', label: 'Booked (3)' },
            { id: 'open', label: 'Open Slots (2)' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                border: 'none',
                background: filter === f.id ? 'var(--dash-filter-active-bg)' : 'transparent',
                color: filter === f.id ? 'var(--dash-filter-active-tx)' : 'var(--dash-filter-muted-tx)',
                fontWeight: filter === f.id ? 600 : 500,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: filter === f.id ? '0 2px 6px var(--dash-shadow)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px' }}>
        {filteredItems.map((slot) => {

          if (slot.type === 'booking') {
            return (
              <div
                key={slot.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'var(--dash-surface)',
                  border: '1px solid var(--dash-border)',
                  boxShadow: '0 2px 10px var(--dash-shadow)',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '14px', color: 'var(--dash-text-primary)',
                      background: 'var(--dash-time-badge-bg)', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px'
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
                    color: slot.locationType === 'venue' ? 'var(--badge-venue)' : 'var(--badge-studio)'
                  }}>
                    <MapPin size={12} />
                    {slot.locationType === 'venue' ? 'On-Venue' : 'In-Studio'}
                  </span>
                </div>

                {/* Details */}
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
                    variant="outline"
                    size="xs"
                    onClick={() => handleWhatsApp(slot.phone, slot.client, slot.startTime)}
                    style={{
                      color: '#25D366',
                      borderColor: 'rgba(37,211,102,0.3)',
                      background: 'rgba(37,211,102,0.05)',
                      fontSize: '12px',
                      padding: '6px 12px'
                    }}
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </Button>
                </div>

                {/* Team & Notes */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
                  paddingTop: '10px', borderTop: '1px dashed var(--dash-border-subtle)', fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dash-text-secondary)' }}>
                    <User size={12} style={{ color: 'var(--icon-booking)' }} />
                    <span>Team: <strong style={{ color: 'var(--dash-text-primary)', fontWeight: 500 }}>{slot.team.join(', ')}</strong></span>
                  </div>
                  <span style={{ fontSize: '11px', fontStyle: 'italic', color: 'var(--dash-text-secondary)' }}>
                    "{slot.notes}"
                  </span>
                </div>
              </div>
            )
          }

          if (slot.type === 'buffer') {
            return (
              <div
                key={slot.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 16px',
                  borderRadius: '12px',
                  background: 'var(--slot-buffer-bg)',
                  border: `1px dashed var(--slot-buffer-border)`,
                  fontSize: '12px',
                  color: 'var(--dash-text-secondary)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <Car size={15} style={{ color: 'var(--icon-booking)' }} />
                  <span>{slot.label} ({slot.startTime} – {slot.endTime})</span>
                </div>
                <span style={{ fontSize: '11px', fontStyle: 'italic' }}>{slot.notes}</span>
              </div>
            )
          }

          return (
            <div
              key={slot.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'var(--slot-open-bg)',
                border: `1px solid var(--slot-open-border)`,
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                <span style={{
                  fontSize: '12px', fontWeight: 700, color: 'var(--slot-open)',
                  background: 'var(--slot-open-badge-bg)', padding: '3px 8px', borderRadius: '6px'
                }}>
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
                variant="outline"
                size="xs"
                onClick={() => {
                  if (onBookSlot) {
                    onBookSlot({
                      time: to24h(slot.startTime),
                      duration: (slot.duration || '').replace(/\s*free\s*/gi, '').trim(),
                      date: new Date().toISOString().split('T')[0],
                    })
                  }
                }}
                style={{
                  color: 'var(--slot-open)',
                  borderColor: 'var(--slot-open-border)',
                  background: 'var(--slot-open-bg)',
                  fontSize: '12px'
                }}
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

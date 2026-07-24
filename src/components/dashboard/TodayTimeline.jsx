import { useState } from 'react'
import { Clock, MapPin, User, MessageCircle, Sparkles, Plus, Car, CheckCircle2 } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'

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
    phone: '919988776655',
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

export default function TodayTimeline() {
  const [filter, setFilter] = useState('all') // 'all' | 'booked' | 'open'

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
            background: 'rgba(201,149,108,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Clock size={18} style={{ color: '#c9956c' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#2d1b2e', fontSize: '17px', margin: 0 }}>
              Today's Live Availability & Slots
            </h3>
            <p style={{ fontSize: '12px', color: '#8b6e7e', margin: '2px 0 0' }}>
              Real-time schedule breakdown based on slot availability
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(45,27,46,0.04)', padding: '4px', borderRadius: '10px' }}>
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
                background: filter === f.id ? 'white' : 'transparent',
                color: filter === f.id ? '#2d1b2e' : '#8b6e7e',
                fontWeight: filter === f.id ? 600 : 500,
                fontSize: '11px',
                padding: '4px 10px',
                borderRadius: '7px',
                cursor: 'pointer',
                boxShadow: filter === f.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
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
          
          /* Render Booked Slot */
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
                  background: '#fdfbf9',
                  border: '1px solid rgba(201,149,108,0.2)',
                  boxShadow: '0 2px 10px rgba(45,27,46,0.02)',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '14px', color: '#2d1b2e',
                      background: 'rgba(45,27,46,0.05)', padding: '4px 10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                      <Clock size={13} style={{ color: '#c9956c' }} />
                      {slot.startTime} – {slot.endTime}
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#c9956c', background: 'rgba(201,149,108,0.1)', padding: '2px 8px', borderRadius: '9999px' }}>
                      {slot.duration}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '9999px',
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    background: slot.locationType === 'venue' ? 'rgba(212,114,143,0.1)' : 'rgba(201,149,108,0.1)',
                    color: slot.locationType === 'venue' ? '#d4728f' : '#a87655'
                  }}>
                    <MapPin size={12} />
                    {slot.locationType === 'venue' ? 'On-Venue' : 'In-Studio'}
                  </span>
                </div>

                {/* Details */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#2d1b2e' }}>
                      {slot.client}
                    </h4>
                    <div style={{ fontSize: '13px', color: '#c9956c', fontWeight: 500, marginTop: '2px' }}>
                      {slot.service}
                    </div>
                    <div style={{ fontSize: '12px', color: '#8b6e7e', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} style={{ flexShrink: 0, color: '#a87655' }} />
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
                  paddingTop: '10px', borderTop: '1px dashed rgba(201,149,108,0.15)', fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8b6e7e' }}>
                    <User size={12} style={{ color: '#c9956c' }} />
                    <span>Team: <strong style={{ color: '#2d1b2e', fontWeight: 500 }}>{slot.team.join(', ')}</strong></span>
                  </div>
                  <span style={{ fontSize: '11px', fontStyle: 'italic', color: '#a87655' }}>
                    "{slot.notes}"
                  </span>
                </div>
              </div>
            )
          }

          /* Render Travel / Buffer Block */
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
                  background: 'rgba(168,118,85,0.05)',
                  border: '1px dashed rgba(168,118,85,0.25)',
                  fontSize: '12px',
                  color: '#a87655',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <Car size={15} style={{ color: '#a87655' }} />
                  <span>{slot.label} ({slot.startTime} – {slot.endTime})</span>
                </div>
                <span style={{ fontSize: '11px', fontStyle: 'italic' }}>{slot.notes}</span>
              </div>
            )
          }

          /* Render Open Available Slot */
          return (
            <div
              key={slot.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'rgba(5,150,105,0.03)',
                border: '1px solid rgba(5,150,105,0.2)',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '12px', fontWeight: 700, color: '#059669',
                  background: 'rgba(5,150,105,0.1)', padding: '3px 8px', borderRadius: '6px'
                }}>
                  {slot.startTime} – {slot.endTime}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#2d1b2e' }}>
                  {slot.label}
                </span>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 500 }}>
                  ({slot.duration})
                </span>
              </div>

              <Button
                variant="outline"
                size="xs"
                as="a"
                href="#book"
                style={{
                  color: '#059669',
                  borderColor: 'rgba(5,150,105,0.3)',
                  background: 'rgba(5,150,105,0.06)',
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

import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { MessageCircle, MapPin, Clock } from 'lucide-react'

export default function AppointmentTable({ appointments, onManage }) {
  const handleWhatsApp = (phone, name) => {
    const cleanPhone = phone?.replace(/[^0-9]/g, '') || '919876543210'
    const text = encodeURIComponent(`Hi ${name}! Thank you for choosing MakeupDesk. Let us know if you need assistance with your booking! ✨`)
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank')
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(201,149,108,0.12)' }}>
            {['Client', 'Service', 'Location', 'Date', 'Time & Duration', 'Status', 'Amount', 'Actions'].map(h => (
              <th key={h} style={{
                padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                fontWeight: 600, color: '#8b6e7e', textTransform: 'uppercase',
                letterSpacing: '0.07em', whiteSpace: 'nowrap'
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px solid rgba(201,149,108,0.07)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(253,248,244,0.7)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Client */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg,#c9956c,#e8a4b8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: 600, color: 'white',
                  }}>
                    {appt.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#2d1b2e' }}>{appt.name}</div>
                    {appt.phone && <div style={{ fontSize: '11px', color: '#8b6e7e' }}>{appt.phone}</div>}
                  </div>
                </div>
              </td>

              {/* Service */}
              <td style={{ padding: '14px 16px', color: '#2d1b2e', fontWeight: 500, whiteSpace: 'nowrap' }}>
                {appt.service}
              </td>

              {/* Location */}
              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 500, padding: '3px 8px', borderRadius: '6px',
                  background: appt.service?.includes('Bridal') ? 'rgba(212,114,143,0.08)' : 'rgba(201,149,108,0.08)',
                  color: appt.service?.includes('Bridal') ? '#d4728f' : '#a87655',
                  display: 'inline-flex', alignItems: 'center', gap: '4px'
                }}>
                  <MapPin size={11} />
                  {appt.service?.includes('Bridal') ? 'Venue' : 'Studio'}
                </span>
              </td>

              {/* Date */}
              <td style={{ padding: '14px 16px', color: '#8b6e7e', whiteSpace: 'nowrap' }}>{appt.date}</td>

              {/* Time & Duration */}
              <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2d1b2e', fontWeight: 500 }}>
                  <Clock size={13} style={{ color: '#c9956c' }} />
                  {appt.time || appt.shift || '06:00 AM'}
                  {appt.duration && <span style={{ fontSize: '11px', color: '#8b6e7e' }}>({appt.duration})</span>}
                </div>
              </td>

              {/* Status */}
              <td style={{ padding: '14px 16px' }}><Badge status={appt.status} /></td>

              {/* Amount */}
              <td style={{ padding: '14px 16px', fontWeight: 600, color: '#2d1b2e', whiteSpace: 'nowrap' }}>
                {appt.amount}
              </td>

              {/* Actions */}
              <td style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleWhatsApp(appt.phone, appt.name)}
                    title="Send WhatsApp Message"
                    style={{
                      width: '28px', height: '28px', borderRadius: '6px', border: '1px solid rgba(37,211,102,0.3)',
                      background: 'rgba(37,211,102,0.08)', color: '#25D366', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                  >
                    <MessageCircle size={14} />
                  </button>
                  <Button variant="ghost" size="xs" onClick={() => onManage?.(appt)}>
                    Manage
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {appointments.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px', color: '#8b6e7e', fontSize: '14px' }}>
          No appointments found.
        </div>
      )}
    </div>
  )
}

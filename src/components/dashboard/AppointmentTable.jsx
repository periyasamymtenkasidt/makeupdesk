import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { MapPin, Clock, Calendar } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { EmptyState } from '../ui/EmptyState'

const HEADERS = ['Appt ID', 'Client', 'Mobile', 'Service', 'Location', 'Date & Time', 'Status', 'Amount']

const thStyle = {
  padding: '14px 20px', textAlign: 'left', fontSize: '10.5px',
  fontWeight: 700, color: 'var(--dash-label-text, #a0622a)', textTransform: 'uppercase',
  letterSpacing: '0.08em', whiteSpace: 'nowrap',
  position: 'sticky', top: 0, zIndex: 10,
  background: 'var(--dash-surface)',
  borderBottom: '1.5px solid var(--dash-border)',
}

const tdBase = { padding: '16px 20px', whiteSpace: 'nowrap' }

export default function AppointmentTable({ appointments }) {
  const navigate = useNavigate()

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }} className="no-scrollbar">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13.5px' }}>

        <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <tr>
            {HEADERS.map((h, i) => (
              <th key={i} style={{ ...thStyle, textAlign: h === 'Amount' ? 'right' : 'left' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {appointments.map((appt, i) => (
            <tr
              key={appt.id ?? i}
              onClick={() => navigate(`/dashboard/appointments/${appt.id}`)}
              style={{
                borderBottom: '1px solid var(--dash-border-subtle)',
                background: 'transparent',
                transition: 'background 0.15s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-row-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Appt ID */}
              <td style={tdBase}>
                <span style={{
                  fontSize: '12px', fontWeight: 700,
                  fontFamily: '"Courier New", Courier, monospace',
                  color: 'var(--icon-booking)',
                  background: 'var(--icon-booking-bg)',
                  padding: '4px 9px', borderRadius: '6px',
                  border: '1px solid var(--dash-border-subtle)',
                  display: 'inline-block',
                }}>
                  {appt.id}
                </span>
              </td>

              {/* Client */}
              <td style={tdBase}>
                <span style={{
                  fontWeight: 600, fontSize: '13.5px', color: 'var(--icon-booking)',
                  textDecoration: 'underline', textDecorationStyle: 'dotted',
                  textUnderlineOffset: '3px',
                }}>
                  {appt.name}
                </span>
              </td>

              {/* Mobile */}
              <td style={{ ...tdBase, fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                {appt.phone ? appt.phone.replace(/^\+\d{1,3}/, '') : '—'}
              </td>

              {/* Service */}
              <td style={{ ...tdBase, fontSize: '13.5px', fontWeight: 500, color: 'var(--dash-text-primary)' }}>
                {appt.service}
              </td>

              {/* Location */}
              <td style={tdBase}>
                {(() => {
                  const loc = appt.location || (appt.service?.includes('Bridal') ? 'Venue' : 'Studio')
                  return (
                    <span style={{
                      fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '7px',
                      background: appt.location === 'Venue' ? 'var(--badge-venue-bg)' : 'var(--badge-studio-bg)',
                      color: appt.location === 'Venue' ? 'var(--badge-venue)' : 'var(--badge-studio)',
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      maxWidth: '160px', overflow: 'hidden',
                    }}>
                      <MapPin size={11} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {loc}
                      </span>
                    </span>
                  )
                })()}
              </td>

              {/* Date & Time */}
              <td style={tdBase}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--dash-text-secondary)', marginBottom: '5px' }}>
                  <Calendar size={12} style={{ color: 'var(--dash-text-muted)', flexShrink: 0 }} />
                  {appt.date ? formatDate(appt.date) : '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--dash-text-primary)', fontWeight: 500 }}>
                  <Clock size={12} style={{ color: 'var(--icon-booking)', flexShrink: 0 }} />
                  {appt.time || '—'}
                  {appt.duration && (
                    <span style={{
                      fontSize: '11px', fontWeight: 600, color: 'var(--icon-booking)',
                      background: 'var(--icon-booking-bg)', padding: '2px 7px',
                      borderRadius: '9999px', border: '1px solid var(--dash-border-subtle)',
                    }}>
                      {appt.duration}
                    </span>
                  )}
                </div>
              </td>

              {/* Status */}
              <td style={tdBase}>
                <Badge status={appt.status} />
              </td>

              {/* Amount */}
              <td style={{ ...tdBase, fontWeight: 700, fontSize: '14px', color: 'var(--dash-text-primary)', textAlign: 'right' }}>
                {typeof appt.amount === 'number' ? formatCurrency(appt.amount) : appt.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {appointments.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No Appointments Found"
          subtitle="There are no appointments matching your current filters or date selection."
          style={{ border: 'none', background: 'transparent', padding: '48px 20px' }}
        />
      )}
    </div>
  )
}

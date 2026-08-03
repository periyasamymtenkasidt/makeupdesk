import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertTriangle, Calendar, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAppointments } from '../../context/AppointmentContext'
import { useClients } from '../../context/ClientContext'

export default function SkinAlertsWidget() {
  const navigate = useNavigate()
  const { appointments } = useAppointments()
  const { clients } = useClients()

  const now = new Date()
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcoming = appointments
    .filter(a => {
      if (['Rejected', 'Closed'].includes(a.status)) return false
      const d = new Date(a.date)
      return !isNaN(d.getTime()) && d >= now && d <= in7Days
    })
    .map(a => {
      const client = clients.find(c => c.id === a.clientId || c.phone === a.phone)
      return { appt: a, client }
    })
    .filter(({ client }) => client && (client.skinType || client.allergies || client.preferredLook))

  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'rgba(232,164,184,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={18} style={{ color: 'var(--icon-client)' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px', margin: 0 }}>
              Upcoming Skin Notes
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', margin: '2px 0 0' }}>
              Client skin preferences & safety alerts · next 7 days
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px' }}>
        {upcoming.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--dash-text-muted)', fontSize: '13px' }}>
            No upcoming appointments with skin notes in the next 7 days.
          </div>
        ) : (
          upcoming.map(({ appt, client }) => (
            <div
              key={appt.id}
              style={{
                padding: '14px', borderRadius: '14px',
                background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
                display: 'flex', flexDirection: 'column', gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--dash-text-primary)' }}>
                  {client.name}
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 600, color: 'var(--icon-booking)', background: 'var(--icon-booking-bg)',
                  padding: '3px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <Calendar size={11} /> {appt.date}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)' }}>
                Type: <strong style={{ color: 'var(--dash-text-primary)', fontWeight: 600 }}>{appt.service}</strong>
              </div>

              {client.allergies ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '5px 10px', borderRadius: '8px',
                  background: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected)',
                  fontSize: '11px', fontWeight: 600
                }}>
                  <AlertTriangle size={13} /> Safety Alert: {client.allergies}
                </div>
              ) : (
                <div style={{ fontSize: '11px', color: 'var(--badge-confirmed)', fontWeight: 600 }}>
                  ✓ No known product allergies
                </div>
              )}

              {(client.preferredLook || client.skinType) && (
                <div style={{
                  fontSize: '11px', color: 'var(--dash-text-primary)', background: 'var(--icon-booking-bg)',
                  border: '1px solid var(--dash-border)',
                  padding: '6px 10px', borderRadius: '8px', marginTop: '2px'
                }}>
                  ✨ <strong>Preferred Look:</strong> {[client.preferredLook, client.skinType].filter(Boolean).join(' · ')}
                </div>
              )}
            </div>
          ))
        )}

        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => navigate('/dashboard/clients')}
          style={{ justifyContent: 'center', marginTop: '4px' }}
        >
          View All Client Profiles <ChevronRight size={14} />
        </Button>
      </CardBody>
    </Card>
  )
}

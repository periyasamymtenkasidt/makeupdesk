import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, CreditCard, TrendingUp, CheckCircle, Star, MessageSquare } from 'lucide-react'
import { useAppointments } from '../../context/AppointmentContext'
import { useClients } from '../../context/ClientContext'
import EditAppointmentModal from '../../components/dashboard/EditAppointmentModal'
import MarkDoneFlow from '../../components/dashboard/MarkDoneFlow'
import SendQuoteModal from '../../components/dashboard/SendQuoteModal'
import { sendQuoteViaWhatsApp } from '../../utils/whatsapp'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardHeader } from '../../components/ui/Card'
import { formatCurrency } from '../../utils/formatCurrency'
import { PIPELINE_NEXT } from '../../data/navigation'

function InfoRow({ label, value, muted }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <span style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {label}
      </span>
      <span style={{ fontSize: '13.5px', fontWeight: 600, color: muted ? 'var(--dash-text-secondary)' : 'var(--dash-text-primary)' }}>
        {value || '—'}
      </span>
    </div>
  )
}

function StatBox({ icon: Icon, label, value, color, bg }) {
  return (
    <div style={{
      background: 'var(--dash-card-bg)', border: '1px solid var(--dash-border)',
      borderRadius: '14px', padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: '12px',
    }}>
      <div style={{ width: 38, height: 38, borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={17} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '10.5px', color: 'var(--dash-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 700, color: 'var(--dash-text-primary)', lineHeight: 1.2, marginTop: '2px' }}>{value}</div>
      </div>
    </div>
  )
}

export default function AppointmentProfile() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { appointments, updateAppointment } = useAppointments()
  const { clients } = useClients()
  const [editOpen,      setEditOpen]      = useState(false)
  const [markDoneOpen,  setMarkDoneOpen]  = useState(false)
  const [sendQuoteOpen, setSendQuoteOpen] = useState(false)

  const appt = appointments.find(a => a.id === appointmentId)

  if (!appt) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <p style={{ color: 'var(--dash-text-muted)', marginBottom: '20px' }}>Appointment not found.</p>
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/appointments')}>
          <ArrowLeft size={15} /> Back to Appointments
        </Button>
      </div>
    )
  }

  const client = clients.find(c => c.id === appt.clientId || c.phone === appt.phone)
  const advancePaid  = appt.advancePaid  ? (appt.advanceAmount || 0) : 0
  const balancePaid  = appt.balancePaid  ? ((appt.amount || 0) - (appt.advanceAmount || 0)) : 0
  const totalPaid    = advancePaid + balancePaid
  const balanceDue   = (appt.amount || 0) - totalPaid

  const nextAction = PIPELINE_NEXT[appt.status]

  return (
    <>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Back */}
        <div>
          <button
            onClick={() => navigate('/dashboard/appointments')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--dash-border)',
              background: 'var(--dash-surface)', color: 'var(--dash-text-secondary)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-row-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--dash-surface)'}
          >
            <ArrowLeft size={14} /> Back to Appointments
          </button>
        </div>

        {/* Header card */}
        <div style={{
          background: 'var(--dash-card-bg)', border: '1px solid var(--dash-border)',
          borderRadius: '20px', padding: '24px 28px',
          boxShadow: '0 4px 24px var(--dash-shadow)',
          display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0 }}>
                {appt.service}
              </h2>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)', letterSpacing: '0.06em' }}>
                {appt.id}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Badge status={appt.status} />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                <Calendar size={13} style={{ color: 'var(--icon-booking)' }} /> {appt.date}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                <Clock size={13} style={{ color: 'var(--icon-booking)' }} /> {appt.time}
                {appt.duration && <span style={{ color: 'var(--dash-text-muted)' }}>· {appt.duration}</span>}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                <MapPin size={13} style={{ color: 'var(--icon-booking)' }} /> {appt.location || 'Studio'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {nextAction && (
              <Button
                variant="primary" size="sm"
                onClick={() => {
                  if (nextAction.action === 'send-quote')    return setSendQuoteOpen(true)
                  if (nextAction.action === 'mark-done')     return setMarkDoneOpen(true)
                  updateAppointment(appt.id, {
                    'approve-quote':   { status: 'Approved' },
                    'collect-advance': { status: 'Advance Paid', advancePaid: true },
                    'confirm-slot':    { status: 'Confirmed' },
                  }[nextAction.action])
                }}
                style={{
                  gap: '6px',
                  ...(nextAction.action === 'mark-done' && {
                    background: 'linear-gradient(135deg,#22c55e,#16a34a)',
                    boxShadow: '0 2px 8px rgba(34,197,94,0.3)',
                  }),
                }}
              >
                <CheckCircle size={14} /> {nextAction.label}
              </Button>
            )}
            <Button variant="primary" size="sm" onClick={() => setEditOpen(true)}>
              Edit Appointment
            </Button>
          </div>
        </div>

        {/* Financial stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <StatBox icon={TrendingUp} label="Total Amount"  value={formatCurrency(appt.amount || 0)} color="var(--icon-revenue)" bg="var(--icon-revenue-bg)" />
          <StatBox icon={CreditCard} label="Advance Paid"  value={formatCurrency(advancePaid)}       color="var(--badge-confirmed)" bg="var(--badge-confirmed-bg)" />
          <StatBox icon={DollarSign} label="Balance Due"   value={formatCurrency(balanceDue)}        color={balanceDue > 0 ? 'var(--badge-pending)' : 'var(--badge-confirmed)'} bg={balanceDue > 0 ? 'var(--badge-pending-bg)' : 'var(--badge-confirmed-bg)'} />
        </div>

        {/* Details grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

          {/* Client info */}
          <Card style={{ padding: '20px 24px' }}>
            <CardHeader style={{ padding: '0 0 14px', borderBottom: '1px solid var(--dash-border)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)' }}>Client</span>
              {client && (
                <button
                  onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                  style={{
                    fontSize: '11.5px', fontWeight: 600, color: 'var(--icon-booking)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif', textDecoration: 'underline',
                    textUnderlineOffset: '2px',
                  }}
                >
                  View Profile
                </button>
              )}
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: client ? `linear-gradient(135deg, ${client.color}, ${client.color}99)` : 'linear-gradient(135deg, #c9956c 0%, #e8a4b8 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 700, color: 'white',
                }}>
                  {appt.name?.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--dash-text-primary)' }}>{appt.name}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)', marginTop: '1px' }}>{appt.clientId ?? 'Walk-in'}</div>
                </div>
              </div>
              <InfoRow label="Phone" value={appt.phone} muted />
              {client?.email && <InfoRow label="Email" value={client.email} muted />}
            </div>
          </Card>

          {/* Appointment details */}
          <Card style={{ padding: '20px 24px' }}>
            <CardHeader style={{ padding: '0 0 14px', borderBottom: '1px solid var(--dash-border)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)' }}>Appointment Details</span>
            </CardHeader>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <InfoRow label="Service"   value={appt.service} />
              <InfoRow label="Location"  value={appt.location || 'Studio'} />
              {appt.venue && <InfoRow label="Venue Category" value={appt.venue} />}
              <InfoRow label="Date"      value={appt.date} />
              <InfoRow label="Time"      value={appt.time} />
              <InfoRow label="Duration"  value={appt.duration} muted />
              <InfoRow label="Advance ₹" value={appt.advanceAmount ? formatCurrency(appt.advanceAmount) : '—'} muted />
            </div>
          </Card>
        </div>

        {/* Notes */}
        {appt.notes && (
          <Card style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Notes
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--dash-text-primary)', lineHeight: 1.6 }}>
              {appt.notes}
            </p>
          </Card>
        )}

        {/* Feedback */}
        {appt.feedback && (
          <Card style={{ padding: '20px 24px' }}>
            <CardHeader style={{ padding: '0 0 14px', borderBottom: '1px solid var(--dash-border)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <MessageSquare size={15} style={{ color: 'var(--color-rose-gold)' }} /> Client Feedback
              </span>
              <span style={{ fontSize: '11px', color: 'var(--dash-text-muted)' }}>{appt.feedback.collectedAt}</span>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={20}
                    fill={i <= appt.feedback.rating ? '#f59e0b' : 'var(--dash-border)'}
                    style={{ color: i <= appt.feedback.rating ? '#f59e0b' : 'var(--dash-border)' }}
                  />
                ))}
                <span style={{ marginLeft: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-secondary)' }}>
                  {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][appt.feedback.rating]}
                </span>
              </div>
              {appt.feedback.comment && (
                <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--dash-text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                  "{appt.feedback.comment}"
                </p>
              )}
            </div>
          </Card>
        )}

        {/* Prompt to collect feedback on completed appointments without it */}
        {appt.status === 'Completed' && !appt.feedback && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderRadius: '12px',
            border: '1.5px dashed var(--dash-border)', background: 'var(--dash-surface)',
          }}>
            <span style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>No feedback collected yet.</span>
            <Button variant="ghost" size="xs" onClick={() => setMarkDoneOpen('feedback')} style={{ gap: '5px' }}>
              <Star size={12} /> Add Feedback
            </Button>
          </div>
        )}

      </div>

      <EditAppointmentModal appt={editOpen ? appt : null} onClose={() => setEditOpen(false)} />

      {sendQuoteOpen && (
        <SendQuoteModal
          appt={appt}
          onClose={() => setSendQuoteOpen(false)}
          onSend={async (amount, note) => {
            updateAppointment(appt.id, { amount, status: 'Quotation Sent' })
            const res = await sendQuoteViaWhatsApp(appt, amount, note)
            if (res?.method === 'download_and_whatsapp') {
              alert(`📄 Quote PDF downloaded (${res.fileName})\n📲 WhatsApp launched! In the WhatsApp window, click the attachment 📎 icon to attach the PDF file.`)
            }
            setSendQuoteOpen(false)
          }}
        />
      )}

      {markDoneOpen && (
        <MarkDoneFlow
          appt={appt}
          startAt={markDoneOpen === 'feedback' ? 'feedback' : 'balance'}
          onUpdate={data => updateAppointment(appt.id, data)}
          onDone={() => setMarkDoneOpen(false)}
        />
      )}
    </>
  )
}

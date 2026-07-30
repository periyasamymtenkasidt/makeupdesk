import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, Mail, MessageCircle, Pencil, Calendar, TrendingUp, DollarSign, CreditCard } from 'lucide-react'
import { useClients } from '../../context/ClientContext'
import { useAppointments } from '../../context/AppointmentContext'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import EditAppointmentModal from '../../components/dashboard/EditAppointmentModal'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { formatCurrency } from '../../utils/formatCurrency'

const inpStyle = {
  width: '100%', padding: '9.5px 12px', borderRadius: '10px',
  border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
  marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em',
}

function StatBox({ icon: Icon, label, value, color, bg }) {
  return (
    <div style={{
      background: 'var(--dash-card-bg)', border: '1px solid var(--dash-border)',
      borderRadius: '16px', padding: '18px 20px',
      display: 'flex', alignItems: 'center', gap: '14px',
      boxShadow: '0 2px 12px var(--dash-shadow)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '12px', flexShrink: 0,
        background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--dash-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text-primary)', lineHeight: 1.2, marginTop: '2px' }}>{value}</div>
      </div>
    </div>
  )
}

export default function ClientProfile() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { clients, updateClient } = useClients()
  const { appointments } = useAppointments()

  const [editOpen, setEditOpen]     = useState(false)
  const [editForm, setEditForm]     = useState({})
  const [editAppt, setEditAppt]     = useState(null)
  const setF = (k, v) => setEditForm(f => ({ ...f, [k]: v }))

  const client = clients.find(c => c.id === clientId)

  if (!client) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <p style={{ color: 'var(--dash-text-muted)', marginBottom: '20px' }}>Client not found.</p>
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/clients')}>
          <ArrowLeft size={15} /> Back to Clients
        </Button>
      </div>
    )
  }

  const clientApts = appointments.filter(a =>
    a.clientId === client.id || a.phone === client.phone
  )

  const totalValue  = clientApts.reduce((s, a) => s + (a.amount || 0), 0)
  const totalPaid   = clientApts.reduce((s, a) => {
    let p = a.advancePaid ? (a.advanceAmount || 0) : 0
    if (a.balancePaid) p += (a.amount || 0) - (a.advanceAmount || 0)
    return s + p
  }, 0)
  const balanceDue  = totalValue - totalPaid

  function openEdit() {
    setEditForm({ name: client.name, phone: client.phone, email: client.email || '', notes: client.notes || '' })
    setEditOpen(true)
  }
  function handleEditSave() {
    if (!editForm.name?.trim()) return
    updateClient(client.id, editForm)
    setEditOpen(false)
  }

  return (
    <>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Back */}
        <div>
          <button
            onClick={() => navigate('/dashboard/clients')}
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
            <ArrowLeft size={14} /> Back to Clients
          </button>
        </div>

        {/* Client Header Card */}
        <div style={{
          background: 'var(--dash-card-bg)', border: '1px solid var(--dash-border)',
          borderRadius: '20px', padding: '24px 28px',
          boxShadow: '0 4px 24px var(--dash-shadow)',
          display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
        }}>
          {/* Avatar */}
          <div style={{
            width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
            background: `linear-gradient(135deg, ${client.color}, ${client.color}99)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', fontWeight: 700, color: 'white',
            boxShadow: `0 4px 16px ${client.color}66`,
          }}>
            {client.initials}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{
                fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700,
                color: 'var(--dash-text-primary)', margin: 0,
              }}>
                {client.name}
              </h2>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '9999px',
                background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)',
                color: '#fff', letterSpacing: '0.08em',
              }}>
                {client.id}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                <Phone size={13} style={{ color: 'var(--icon-booking)' }} /> {client.phone}
              </span>
              {client.email && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                  <Mail size={13} style={{ color: 'var(--icon-booking)' }} /> {client.email}
                </span>
              )}
              <span style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>
                Client since {client.createdAt}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => window.open(`https://wa.me/${client.phone.replace(/\D/g,'')}`, '_blank')}
              title="Open WhatsApp"
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                border: '1.5px solid var(--dash-border)', background: 'var(--dash-surface)',
                color: 'var(--icon-booking)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <MessageCircle size={16} />
            </button>
            <Button variant="ghost" size="sm" onClick={openEdit}>
              <Pencil size={14} /> Edit Profile
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <StatBox icon={Calendar}   label="Total Bookings" value={clientApts.length}          color="var(--icon-booking)" bg="var(--icon-booking-bg)" />
          <StatBox icon={TrendingUp} label="Total Value"    value={formatCurrency(totalValue)} color="var(--icon-revenue)" bg="var(--icon-revenue-bg)" />
          <StatBox icon={CreditCard} label="Amount Paid"    value={formatCurrency(totalPaid)}  color="var(--badge-confirmed)" bg="var(--badge-confirmed-bg)" />
          <StatBox icon={DollarSign} label="Balance Due"    value={formatCurrency(balanceDue)} color={balanceDue > 0 ? 'var(--badge-pending)' : 'var(--badge-confirmed)'} bg={balanceDue > 0 ? 'var(--badge-pending-bg)' : 'var(--badge-confirmed-bg)'} />
        </div>

        {/* Notes */}
        {client.notes && (
          <Card style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Notes & Preferences
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--dash-text-primary)', lineHeight: 1.6 }}>
              {client.notes}
            </p>
          </Card>
        )}

        {/* Appointment History */}
        <Card style={{ overflow: 'hidden', padding: 0 }}>
          <CardHeader>
            <div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px' }}>
                Appointment History
              </span>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--dash-text-secondary)' }}>
                {clientApts.length} booking{clientApts.length !== 1 ? 's' : ''} · click an ID to manage the appointment
              </p>
            </div>
          </CardHeader>
          {clientApts.length > 0 ? (
            <AppointmentTable appointments={clientApts} onEdit={setEditAppt} />
          ) : (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--dash-text-muted)', fontSize: '14px' }}>
              No appointments yet for this client.
            </div>
          )}
        </Card>

      </div>

      <EditAppointmentModal appt={editAppt} onClose={() => setEditAppt(null)} />

      {/* Edit Profile Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Client Profile"
        onSave={handleEditSave}
        saveLabel="Save Changes"
        width="480px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Full Name *</label>
              <input style={inpStyle} value={editForm.name || ''} onChange={e => setF('name', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Phone</label>
              <input style={inpStyle} value={editForm.phone || ''} onChange={e => setF('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input style={inpStyle} placeholder="client@email.com" value={editForm.email || ''} onChange={e => setF('email', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Notes & Skin Preferences</label>
            <textarea
              style={{ ...inpStyle, resize: 'vertical', minHeight: '90px', lineHeight: 1.5 }}
              placeholder="e.g. Sensitive skin, prefers natural look, airbrush only…"
              value={editForm.notes || ''}
              onChange={e => setF('notes', e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

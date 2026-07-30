import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, UserPlus, Phone, Calendar, TrendingUp } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { formatCurrency } from '../../utils/formatCurrency'
import { useClients } from '../../context/ClientContext'
import { useAppointments } from '../../context/AppointmentContext'

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

const EMPTY = { name: '', phone: '', email: '', notes: '' }

export default function Clients() {
  const navigate = useNavigate()
  const { clients, addClient } = useClients()
  const { appointments }       = useAppointments()

  const [search,   setSearch]  = useState('')
  const [addOpen,  setAddOpen] = useState(false)
  const [form,     setForm]    = useState(EMPTY)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const enriched = clients.map(c => {
    const apts = appointments.filter(a => a.clientId === c.id || a.phone === c.phone)
    return {
      ...c,
      bookings:    apts.length,
      totalValue:  apts.reduce((s, a) => s + (a.amount || 0), 0),
      lastService: apts[0]?.service || '—',
      lastDate:    apts[0]?.date    || '—',
    }
  })

  const filtered = enriched.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  function handleAdd() {
    if (!form.name.trim() || !form.phone.trim()) return
    addClient(form)
    setForm(EMPTY)
    setAddOpen(false)
  }

  return (
    <>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Top Controls Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
              <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--icon-booking)', pointerEvents: 'none' }} />
              <input
                placeholder="Search clients…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '9px 14px 9px 32px', borderRadius: '10px',
                         border: '1.5px solid var(--dash-border)', fontSize: '13px', color: 'var(--dash-input-text)',
                         background: 'var(--dash-input-bg)', outline: 'none', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box' }}
              />
            </div>
            <span style={{ fontSize: '12.5px', color: 'var(--dash-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
              {clients.length} total clients
            </span>
          </div>

          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            <UserPlus size={15} /> Add Client
          </Button>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '16px' }}>
          {filtered.map(client => (
            <Card key={client.id} hover style={{ padding: '24px', cursor: 'default' }}>

              {/* Avatar + name + ID */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div
                  onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                  style={{
                    width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                    background: `linear-gradient(135deg, ${client.color}, ${client.color}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: 700, color: 'white', cursor: 'pointer',
                  }}
                >
                  {client.initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                    style={{
                      fontWeight: 600, fontSize: '15px', color: 'var(--dash-text-primary)',
                      cursor: 'pointer', textDecoration: 'none',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--icon-booking)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--dash-text-primary)'}
                  >
                    {client.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px',
                      background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)', color: '#fff',
                      letterSpacing: '0.07em',
                    }}>
                      {client.id}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>{client.email}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { icon: Calendar,   label: 'Bookings',   value: client.bookings,                   color: 'var(--icon-booking)' },
                  { icon: TrendingUp, label: 'Total Value', value: formatCurrency(client.totalValue), color: 'var(--icon-revenue)' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} style={{
                    padding: '10px 12px', borderRadius: '12px',
                    background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)',
                  }}>
                    <Icon size={13} style={{ color, marginBottom: '4px' }} />
                    <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>{value}</div>
                    <div style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>

              {/* Last service */}
              <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', marginBottom: '16px' }}>
                Last: <span style={{ color: 'var(--dash-text-primary)', fontWeight: 500 }}>{client.lastService}</span>
                {client.lastDate !== '—' && <> · {client.lastDate}</>}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="ghost" size="xs" fullWidth as="a"
                  href={`https://wa.me/${client.phone.replace(/\D/g, '')}`} target="_blank">
                  <Phone size={12} /> WhatsApp
                </Button>
                <Button variant="primary" size="xs" fullWidth onClick={() => navigate(`/dashboard/clients/${client.id}`)}>
                  View Profile
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Client Modal */}
      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); setForm(EMPTY) }}
        title="Add New Client"
        onSave={handleAdd}
        saveLabel="Add Client"
        width="460px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Full Name *</label>
              <input style={inpStyle} placeholder="e.g. Ananya Roy"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Phone *</label>
              <input style={inpStyle} placeholder="+91 98765 43210"
                value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Email</label>
            <input style={inpStyle} placeholder="client@email.com"
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Notes & Skin Preferences</label>
            <textarea
              style={{ ...inpStyle, resize: 'vertical', minHeight: '80px', lineHeight: 1.5 }}
              placeholder="e.g. Sensitive skin, prefers natural look, airbrush only…"
              value={form.notes} onChange={e => set('notes', e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

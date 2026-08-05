import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, CreditCard, TrendingUp, CheckCircle, Star, MessageSquare, History, Wallet, BadgeDollarSign, Users, Check, Hourglass, Smartphone, Banknote } from 'lucide-react'
import { useAppointments } from '../../context/AppointmentContext'
import { useClients } from '../../context/ClientContext'
import { useToast } from '../../context/ToastContext'
import { useMaster } from '../../hooks/useMaster'
import { VENDOR_KEY, VENDOR_DEFAULTS } from '../../data/vendors'
import { Modal } from '../../components/ui/Modal'
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
  const { appointments, updateAppointment, updateVendorPayments } = useAppointments()
  const { clients } = useClients()
  const { showToast } = useToast()
  const { items: allVendors } = useMaster(VENDOR_KEY, VENDOR_DEFAULTS)
  const [editOpen,      setEditOpen]      = useState(false)
  const [markDoneOpen,  setMarkDoneOpen]  = useState(false)
  const [sendQuoteOpen, setSendQuoteOpen] = useState(false)
  const [vendorPayModal, setVendorPayModal] = useState(null)
  const [vpMethod, setVpMethod]   = useState('UPI')
  const [vpTxnRef, setVpTxnRef]   = useState('')

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
        {(() => {
          const vendorCost = appt.vendorCost || 0
          const profit     = (appt.amount || 0) - vendorCost
          const hasVendor  = vendorCost > 0
          return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              <StatBox icon={TrendingUp}       label="Total Amount"  value={formatCurrency(appt.amount || 0)} color="var(--icon-revenue)"   bg="var(--icon-revenue-bg)" />
              <StatBox icon={CreditCard}       label="Advance Paid"  value={formatCurrency(advancePaid)}      color="var(--badge-confirmed)" bg="var(--badge-confirmed-bg)" />
              <StatBox icon={DollarSign}       label="Balance Due"   value={formatCurrency(balanceDue)}       color={balanceDue > 0 ? 'var(--badge-pending)' : 'var(--badge-confirmed)'} bg={balanceDue > 0 ? 'var(--badge-pending-bg)' : 'var(--badge-confirmed-bg)'} />
              {hasVendor && (
                <StatBox icon={Wallet}         label="Vendor Cost"   value={formatCurrency(vendorCost)}       color="var(--badge-pending)"   bg="var(--badge-pending-bg)" />
              )}
              {hasVendor && (
                <StatBox icon={BadgeDollarSign} label="Profit"       value={formatCurrency(profit)}           color={profit >= 0 ? 'var(--badge-confirmed)' : 'var(--badge-rejected)'} bg={profit >= 0 ? 'var(--badge-confirmed-bg)' : 'var(--badge-rejected-bg)'} />
              )}
            </div>
          )
        })()}

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
            {appt.addOns?.length > 0 && (
              <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--dash-border)' }}>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                  Team Requested by Client
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {appt.addOns.map(role => (
                    <span key={role} style={{
                      fontSize: '12px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px',
                      background: 'var(--icon-booking-bg)', color: 'var(--icon-booking)',
                      border: '1px solid var(--dash-border-subtle)',
                    }}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
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

        {/* Change History */}
        {appt.changeLog && appt.changeLog.length > 0 && (() => {
          const CH_LABELS = {
            service: 'Service', date: 'Date', time: 'Time',
            location: 'Location', venue: 'Venue Category', venueAddress: 'Venue Address',
            status: 'Status', amount: 'Total Amount', advanceAmount: 'Advance Amount',
            vendorCost: 'Vendor Cost', duration: 'Duration', notes: 'Notes', artist: 'Artist',
          }
          const CH_MONEY = new Set(['amount', 'advanceAmount', 'vendorCost'])
          const normalizeDate = (val) => {
            if (!val) return null
            const d = new Date(val)
            return isNaN(d.getTime()) ? val : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
          }
          const fmtVal = (field, val) => {
            if (CH_MONEY.has(field)) return val ? `₹ ${Number(val).toLocaleString('en-IN')}` : null
            if (field === 'date') return normalizeDate(val)
            return val || null
          }
          return (
            <Card style={{ padding: '20px 24px' }}>
              <CardHeader style={{ padding: '0 0 14px', borderBottom: '1px solid var(--dash-border)', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <History size={15} style={{ color: 'var(--color-rose-gold)' }} /> Change History
                </span>
                <span style={{ fontSize: '11px', color: 'var(--dash-text-muted)' }}>
                  {appt.changeLog.length} edit{appt.changeLog.length > 1 ? 's' : ''}
                </span>
              </CardHeader>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[...appt.changeLog].reverse().map((entry, i, arr) => {
                  const isLast = i === arr.length - 1
                  const d = new Date(entry.timestamp)
                  const dateLabel = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  const timeLabel = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

                  return (
                    <div key={i} style={{ display: 'flex', gap: '14px' }}>
                      {/* Timeline spine */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 10 }}>
                        <div style={{
                          width: 9, height: 9, borderRadius: '50%', marginTop: 4, flexShrink: 0,
                          background: 'var(--dash-card-bg)',
                          border: '2px solid var(--color-rose-gold)',
                        }} />
                        {!isLast && (
                          <div style={{ width: 1, flex: 1, marginTop: 4, background: 'var(--dash-border)', minHeight: 28 }} />
                        )}
                      </div>

                      {/* Entry content */}
                      <div style={{ paddingBottom: isLast ? 0 : 16, flex: 1 }}>
                        <div style={{ fontSize: '11px', color: 'var(--dash-text-muted)', fontWeight: 600, marginBottom: 6 }}>
                          {dateLabel} · {timeLabel}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {entry.changes.map((c, j) => {
                            const fromVal = fmtVal(c.field, c.from)
                            const toVal   = fmtVal(c.field, c.to)
                            return (
                              <div key={j} style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '12.5px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--dash-text-secondary)', width: 120, flexShrink: 0 }}>
                                  {CH_LABELS[c.field] || c.field}
                                </span>
                                <span style={{ color: 'var(--dash-text-muted)', textDecoration: fromVal ? 'line-through' : 'none', fontSize: '12px', fontStyle: fromVal ? 'normal' : 'italic' }}>
                                  {fromVal ?? '(empty)'}
                                </span>
                                <span style={{ color: 'var(--dash-text-muted)', fontSize: '11px' }}>→</span>
                                <span style={{ fontWeight: toVal ? 600 : 400, fontStyle: toVal ? 'normal' : 'italic', color: toVal ? 'var(--dash-text-primary)' : 'var(--dash-text-muted)' }}>
                                  {toVal ?? '(removed)'}
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )
        })()}

        {/* Team Payments */}
        {(() => {
          const assigned = Array.isArray(appt.assignedArtists) ? appt.assignedArtists : []
          const vendorPayments = Array.isArray(appt.vendorPayments) ? appt.vendorPayments : []
          if (assigned.length === 0 && vendorPayments.length === 0) return null

          function initVendorPayments() {
            const entries = assigned.map(name => {
              const v = allVendors.find(x => x.name === name)
              return { vendorName: name, category: v?.category || 'Other', amount: v?.charges || 0, paid: false, paidDate: null, method: null, note: '' }
            })
            updateVendorPayments(appt.id, entries)
          }

          function openVpModal(vp) {
            setVendorPayModal({ apptId: appt.id, vendorName: vp.vendorName, amount: vp.amount })
            setVpMethod('UPI')
            setVpTxnRef('')
          }

          function handleVpMarkPaid() {
            if (!vendorPayModal) return
            const paidDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            const updated = vendorPayments.map(vp =>
              vp.vendorName === vendorPayModal.vendorName
                ? { ...vp, paid: true, paidDate, method: vpMethod, note: vpTxnRef }
                : vp
            )
            updateVendorPayments(appt.id, updated)
            setVendorPayModal(null)
          }

          return (
            <Card style={{ padding: '20px 24px' }}>
              <CardHeader style={{ padding: '0 0 14px', borderBottom: '1px solid var(--dash-border)', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Users size={15} style={{ color: 'var(--color-rose-gold)' }} /> Team Payments
                </span>
                {vendorPayments.length > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--dash-text-muted)' }}>
                    {vendorPayments.filter(v => v.paid).length}/{vendorPayments.length} settled
                  </span>
                )}
              </CardHeader>

              {vendorPayments.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)', marginBottom: '3px' }}>
                      {assigned.length} artist{assigned.length !== 1 ? 's' : ''} assigned
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>
                      {assigned.join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={initVendorPayments}
                    style={{
                      padding: '8px 16px', borderRadius: '10px', fontSize: '12.5px', fontWeight: 600,
                      border: '1.5px solid #c9956c',
                      background: '#c9956c', color: '#fff',
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Set Up Payments
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {vendorPayments.map((vp, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 16px', borderRadius: '12px',
                      background: 'var(--dash-subtle-row-bg)', border: '1px solid var(--dash-border-subtle)',
                      gap: '12px', flexWrap: 'wrap',
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--dash-text-primary)' }}>{vp.vendorName}</div>
                        <div style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)', marginTop: '1px' }}>{vp.category}</div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                        {formatCurrency(vp.amount || 0)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600,
                          border: '1.5px solid',
                          ...(vp.paid
                            ? { background: 'var(--badge-confirmed-bg)', color: 'var(--badge-confirmed)', borderColor: 'var(--badge-confirmed)' }
                            : { background: 'var(--badge-pending-bg)',   color: 'var(--badge-pending)',   borderColor: 'var(--badge-pending)' }
                          ),
                        }}>
                          {vp.paid ? <Check size={11} /> : <Hourglass size={11} />}
                          {vp.paid ? 'Paid' : 'Pending'}
                        </span>
                        {!vp.paid && (
                          <button
                            onClick={() => openVpModal(vp)}
                            style={{
                              padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                              border: '1.5px solid #c9956c',
                              background: '#c9956c', color: '#fff',
                              cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                            }}
                          >
                            Pay
                          </button>
                        )}
                        {vp.paid && vp.paidDate && (
                          <span style={{ fontSize: '11px', color: 'var(--dash-text-muted)' }}>
                            {vp.paidDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Modal
                open={!!vendorPayModal}
                onClose={() => setVendorPayModal(null)}
                title="Mark Vendor Payment"
                onSave={handleVpMarkPaid}
                saveLabel="Confirm Payment Made"
                width="440px"
              >
                {vendorPayModal && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'var(--dash-subtle-row-bg)', border: '1.5px solid var(--dash-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--dash-text-secondary)' }}>Vendor</span>
                        <span style={{ fontWeight: 700, color: 'var(--dash-text-primary)' }}>{vendorPayModal.vendorName}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', paddingTop: '8px', borderTop: '1px solid var(--dash-border-subtle)' }}>
                        <span style={{ color: 'var(--dash-text-secondary)', fontWeight: 600 }}>Amount</span>
                        <span style={{ fontWeight: 800, color: 'var(--dash-text-primary)' }}>{formatCurrency(vendorPayModal.amount || 0)}</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Payment Mode *
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {[
                          { id: 'UPI',  icon: Smartphone, label: 'UPI / QR' },
                          { id: 'Cash', icon: Banknote,   label: 'Cash' },
                          { id: 'Card', icon: CreditCard, label: 'Card / NetBank' },
                        ].map(({ id, icon: Icon, label }) => (
                          <button key={id} type="button" onClick={() => setVpMethod(id)} style={{
                            padding: '10px 8px', borderRadius: '12px', border: '2px solid',
                            borderColor: vpMethod === id ? '#c9956c' : 'rgba(201,149,108,0.22)',
                            background: vpMethod === id ? 'linear-gradient(135deg, rgba(201,149,108,0.16), rgba(232,164,184,0.1))' : 'var(--dash-card-bg)',
                            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            fontFamily: 'Inter, sans-serif',
                          }}>
                            <Icon size={16} style={{ color: vpMethod === id ? '#c9956c' : 'var(--dash-text-muted)' }} />
                            <span style={{ fontSize: '11.5px', fontWeight: 700, color: vpMethod === id ? '#8b5a2b' : 'var(--dash-text-secondary)' }}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Reference / Note (optional)
                      </label>
                      <input
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)', fontSize: '13px', color: 'var(--dash-input-text)', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}
                        placeholder="e.g. GPay Ref #4821033"
                        value={vpTxnRef}
                        onChange={e => setVpTxnRef(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </Modal>
            </Card>
          )
        })()}

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

      {editOpen && <EditAppointmentModal appt={appt} onClose={() => setEditOpen(false)} />}

      {sendQuoteOpen && (
        <SendQuoteModal
          appt={appt}
          onClose={() => setSendQuoteOpen(false)}
          onSend={async (amount, note) => {
            updateAppointment(appt.id, { amount, status: 'Quotation Sent' })
            const res = await sendQuoteViaWhatsApp(appt, amount, note)
            if (res?.method === 'download_and_whatsapp') {
              showToast('Quote PDF downloaded — attach it in the WhatsApp window that just opened.', 'success', 7000)
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

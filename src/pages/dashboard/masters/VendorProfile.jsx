import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { usePagination } from '../../../hooks/usePagination'
import { Pagination } from '../../../components/ui/Pagination'
import {
  ArrowLeft, Phone, MessageCircle, Pencil, Calendar,
  Wallet, Clock, MapPin, TrendingUp, Check, Hourglass,
} from 'lucide-react'
import { useMaster } from '../../../hooks/useMaster'
import { useAppointments } from '../../../context/AppointmentContext'
import { VENDOR_KEY, VENDOR_DEFAULTS, VENDOR_CATEGORIES, ALL_DAYS } from '../../../data/vendors'
import { Card, CardHeader } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { Badge } from '../../../components/ui/Badge'
import { CustomSelect } from '../../../components/ui/CustomSelect'
import { formatCurrency } from '../../../utils/formatCurrency'
import { formatDate } from '../../../utils/formatDate'

const AVAIL_COLORS = {
  Available: { color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)' },
  Busy:      { color: 'var(--badge-pending)',   bg: 'var(--badge-pending-bg)'   },
  Inactive:  { color: 'var(--dash-text-muted)', bg: 'var(--dash-subtle-row-bg)' },
}

const inp = {
  width: '100%', padding: '9.5px 14px', borderRadius: '10px',
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
      <div style={{ width: 40, height: 40, borderRadius: '12px', flexShrink: 0, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: '11px', color: 'var(--dash-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text-primary)', lineHeight: 1.2, marginTop: '2px' }}>{value}</div>
      </div>
    </div>
  )
}

function Stars({ rating }) {
  return (
    <span style={{ letterSpacing: '2px', fontSize: '17px' }}>
      {[1, 2, 3, 4, 5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#f59e0b' : 'var(--dash-border)' }}>★</span>
      ))}
    </span>
  )
}

export default function VendorProfile() {
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const { items, update } = useMaster(VENDOR_KEY, VENDOR_DEFAULTS)
  const { appointments } = useAppointments()

  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState({})
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const vendor = items.find(v => String(v.id) === String(vendorId))

  if (!vendor) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <p style={{ color: 'var(--dash-text-muted)', marginBottom: '20px' }}>Vendor not found.</p>
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/masters/vendors')}>
          <ArrowLeft size={15} /> Back to Vendors
        </Button>
      </div>
    )
  }

  const categoryLabel = vendor.category === 'Other' && vendor.customCategory
    ? vendor.customCategory
    : vendor.category

  const avail = AVAIL_COLORS[vendor.availability] ?? AVAIL_COLORS.Inactive

  // Appointments this vendor is linked to
  const vendorAppts = appointments.filter(a =>
    a.vendorId === vendor.id ||
    (Array.isArray(a.assignedArtists) && a.assignedArtists.includes(vendor.name)) ||
    (Array.isArray(a.vendorPayments) && a.vendorPayments.some(vp => vp.vendorName === vendor.name))
  )

  const { page, setPage, totalPages, paginated: pagedAppts } = usePagination(vendorAppts, 6)

  const totalEarned = vendorAppts.reduce((sum, a) => {
    const vp = (a.vendorPayments || []).find(v => v.vendorName === vendor.name)
    return sum + (vp?.paid ? (vp.amount || 0) : 0)
  }, 0)

  const totalPending = vendorAppts.reduce((sum, a) => {
    const vp = (a.vendorPayments || []).find(v => v.vendorName === vendor.name)
    return sum + (vp && !vp.paid ? (vp.amount || 0) : 0)
  }, 0)

  function openEdit() {
    setForm({
      name:           vendor.name,
      category:       vendor.category,
      customCategory: vendor.customCategory || '',
      contact:        vendor.contact,
      whatsapp:       vendor.whatsapp,
      charges:        vendor.charges,
      serviceArea:    vendor.serviceArea,
      availability:   vendor.availability,
      rating:         vendor.rating,
      notes:          vendor.notes || '',
      workDays:       vendor.workDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      shiftStart:     vendor.shiftStart || '08:00',
      shiftEnd:       vendor.shiftEnd   || '20:00',
    })
    setEditOpen(true)
  }

  function handleSave() {
    if (!form.name?.trim()) { alert('Vendor name is required.'); return }
    if (form.category === 'Other' && !form.customCategory?.trim()) {
      alert('Please specify the category.'); return
    }
    update(vendor.id, { ...form, charges: Number(form.charges) || 0, rating: Number(form.rating) })
    setEditOpen(false)
  }

  return (
    <>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header */}
        <div style={{
          background: 'var(--dash-card-bg)', border: '1px solid var(--dash-border)',
          borderRadius: '20px', padding: '24px 28px',
          boxShadow: '0 4px 24px var(--dash-shadow)',
          display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap',
        }}>
          <div style={{
            width: 68, height: 68, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #c9956c, #e8a4b8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 700, color: 'white',
            boxShadow: '0 4px 16px rgba(201,149,108,0.4)',
          }}>
            {vendor.name.charAt(0)}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0 }}>
                {vendor.name}
              </h2>
              <span style={{
                fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '6px',
                background: 'var(--icon-booking-bg)', color: 'var(--icon-booking)',
                border: '1px solid var(--dash-border)',
              }}>
                {categoryLabel}
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                color: avail.color, background: avail.bg,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: avail.color }} />
                {vendor.availability}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
              {vendor.contact && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                  <Phone size={13} style={{ color: 'var(--icon-booking)' }} /> {vendor.contact}
                </span>
              )}
              {vendor.serviceArea && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                  <MapPin size={13} style={{ color: 'var(--icon-booking)' }} /> {vendor.serviceArea}
                </span>
              )}
              <Stars rating={vendor.rating} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => {
                const phone = (vendor.whatsapp || vendor.contact)?.replace(/[^0-9]/g, '')
                if (phone) window.open(`https://wa.me/${phone}`, '_blank')
              }}
              title="WhatsApp"
              style={{
                width: 36, height: 36, borderRadius: '10px',
                border: '1.5px solid rgba(37,211,102,0.3)', background: 'rgba(37,211,102,0.08)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <MessageCircle size={16} style={{ color: '#25D366' }} />
            </button>
            <Button variant="ghost" size="sm" onClick={openEdit}>
              <Pencil size={14} /> Edit Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/masters/vendors')}>
              <ArrowLeft size={14} /> Back
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px' }}>
          <StatBox icon={Calendar}   label="Total Jobs"      value={vendorAppts.length}              color="var(--icon-booking)"    bg="var(--icon-booking-bg)"    />
          <StatBox icon={Wallet}     label="Total Earned"    value={formatCurrency(totalEarned)}     color="var(--badge-confirmed)" bg="var(--badge-confirmed-bg)" />
          <StatBox icon={TrendingUp} label="Pending Payout"  value={formatCurrency(totalPending)}    color={totalPending > 0 ? 'var(--badge-pending)' : 'var(--badge-confirmed)'} bg={totalPending > 0 ? 'var(--badge-pending-bg)' : 'var(--badge-confirmed-bg)'} />
          <StatBox icon={Clock}      label="Std. Charges"    value={formatCurrency(vendor.charges || 0)} color="var(--icon-revenue)" bg="var(--icon-revenue-bg)" />
        </div>

        {/* Schedule + Notes */}
        <div style={{ display: 'grid', gridTemplateColumns: vendor.notes ? '1fr 1fr' : '1fr', gap: '16px' }}>
          <Card style={{ padding: '20px 24px' }}>
            <CardHeader style={{ padding: '0 0 14px', borderBottom: '1px solid var(--dash-border)', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Clock size={14} style={{ color: 'var(--color-rose-gold)' }} /> Schedule
              </span>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
                  Shift Hours
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                  {vendor.shiftStart || '08:00'} — {vendor.shiftEnd || '20:00'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                  Working Days
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {ALL_DAYS.map(day => {
                    const on = (vendor.workDays || []).includes(day)
                    return (
                      <span key={day} style={{
                        padding: '4px 10px', borderRadius: '7px', fontSize: '12px', fontWeight: 600,
                        border: '1.5px solid',
                        borderColor: on ? 'var(--icon-booking)' : 'var(--dash-border-subtle)',
                        background:  on ? 'var(--icon-booking-bg)' : 'var(--dash-surface)',
                        color:       on ? 'var(--icon-booking)' : 'var(--dash-text-muted)',
                      }}>
                        {day}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </Card>

          {vendor.notes && (
            <Card style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
                Notes
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: 'var(--dash-text-primary)', lineHeight: 1.6 }}>
                {vendor.notes}
              </p>
            </Card>
          )}
        </div>

        {/* Collaboration History */}
        <Card style={{ overflow: 'hidden', padding: 0 }}>
          <CardHeader>
            <div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px' }}>
                Collaboration History
              </span>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--dash-text-secondary)' }}>
                {vendorAppts.length} appointment{vendorAppts.length !== 1 ? 's' : ''} — click a row to open
              </p>
            </div>
          </CardHeader>

          {vendorAppts.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--dash-text-muted)', fontSize: '14px' }}>
              No appointments assigned to this vendor yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }} className="no-scrollbar">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Appt ID', 'Client', 'Service', 'Date', 'Status', 'Their Fee', 'Paid?'].map(h => (
                      <th key={h} style={{
                        padding: '12px 16px', textAlign: 'left', fontSize: '10.5px', fontWeight: 700,
                        color: 'var(--dash-label-text)', textTransform: 'uppercase', letterSpacing: '0.08em',
                        whiteSpace: 'nowrap', position: 'sticky', top: 0, zIndex: 10,
                        background: 'var(--dash-surface)', borderBottom: '1.5px solid var(--dash-border)',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pagedAppts.map(a => {
                    const vp = (a.vendorPayments || []).find(v => v.vendorName === vendor.name)
                    return (
                      <tr
                        key={a.id}
                        onClick={() => navigate(`/dashboard/appointments/${a.id}`)}
                        style={{ borderBottom: '1px solid var(--dash-border-subtle)', transition: 'background 0.15s', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-row-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: '12px', fontWeight: 700, fontFamily: 'monospace',
                            color: 'var(--icon-booking)', background: 'var(--icon-booking-bg)',
                            padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--dash-border-subtle)',
                          }}>
                            {a.id}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>{a.name}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--dash-text-secondary)' }}>{a.service}</td>
                        <td style={{ padding: '14px 16px', color: 'var(--dash-text-muted)', whiteSpace: 'nowrap' }}>
                          {a.date ? formatDate(a.date) : '—'}
                        </td>
                        <td style={{ padding: '14px 16px' }}><Badge status={a.status} /></td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                          {vp ? formatCurrency(vp.amount || 0) : '—'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {vp ? (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: '5px',
                              padding: '3px 9px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                              border: '1.5px solid',
                              ...(vp.paid
                                ? { background: 'var(--badge-confirmed-bg)', color: 'var(--badge-confirmed)', borderColor: 'var(--badge-confirmed)' }
                                : { background: 'var(--badge-pending-bg)',   color: 'var(--badge-pending)',   borderColor: 'var(--badge-pending)'   }
                              ),
                            }}>
                              {vp.paid ? <Check size={11} /> : <Hourglass size={11} />}
                              {vp.paid ? 'Paid' : 'Pending'}
                            </span>
                          ) : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

      </div>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Vendor Profile" onSave={handleSave} saveLabel="Save Changes" width="580px">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Vendor Name</label>
              <input style={inp} placeholder="Full name" value={form.name || ''} onChange={e => setF('name', e.target.value)} />
            </div>
            <CustomSelect
              label="Category"
              value={form.category}
              options={VENDOR_CATEGORIES}
              onChange={val => { setF('category', val); if (val !== 'Other') setF('customCategory', '') }}
            />
          </div>
          {form.category === 'Other' && (
            <div>
              <label style={lbl}>Specify Category</label>
              <input style={inp} placeholder="e.g. Florist, Decorator…" value={form.customCategory || ''} onChange={e => setF('customCategory', e.target.value)} />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Contact Number</label>
              <input style={inp} placeholder="99999 88888" value={form.contact || ''} onChange={e => setF('contact', e.target.value.replace(/[^0-9 ]/g, '').slice(0, 11))} />
            </div>
            <div>
              <label style={lbl}>WhatsApp Number</label>
              <input style={inp} placeholder="99999 88888" value={form.whatsapp || ''} onChange={e => setF('whatsapp', e.target.value.replace(/[^0-9 ]/g, '').slice(0, 15))} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Standard Charges (₹ / event)</label>
              <input style={inp} type="number" placeholder="2500" value={form.charges || ''} onChange={e => setF('charges', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Service Area</label>
              <input style={inp} placeholder="e.g. Chennai, Pune" value={form.serviceArea || ''} onChange={e => setF('serviceArea', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CustomSelect label="Availability" value={form.availability} options={['Available', 'Busy', 'Inactive']} onChange={val => setF('availability', val)} />
            <CustomSelect label="Rating" value={form.rating} options={[5,4,3,2,1].map(r => ({ value: r, label: `${r} Star${r !== 1 ? 's' : ''}` }))} onChange={val => setF('rating', Number(val))} />
          </div>
          <div>
            <label style={lbl}>Working Days</label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {ALL_DAYS.map(day => {
                const on = (form.workDays || []).includes(day)
                return (
                  <button key={day} type="button"
                    onClick={() => setF('workDays', on ? (form.workDays || []).filter(d => d !== day) : [...(form.workDays || []), day])}
                    style={{
                      padding: '5px 11px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                      cursor: 'pointer', border: '1.5px solid',
                      borderColor: on ? 'var(--icon-booking)' : 'var(--dash-border)',
                      background:  on ? 'var(--icon-booking-bg)' : 'var(--dash-input-bg)',
                      color:       on ? 'var(--icon-booking)' : 'var(--dash-text-muted)',
                    }}
                  >{day}</button>
                )
              })}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Shift Start</label>
              <input type="time" style={inp} value={form.shiftStart || '08:00'} onChange={e => setF('shiftStart', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Shift End</label>
              <input type="time" style={inp} value={form.shiftEnd || '20:00'} onChange={e => setF('shiftEnd', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Notes</label>
            <input style={inp} placeholder="Any special notes…" value={form.notes || ''} onChange={e => setF('notes', e.target.value)} />
          </div>
        </div>
      </Modal>
    </>
  )
}

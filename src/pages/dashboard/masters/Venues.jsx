import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, TrendingUp, TrendingDown, Minus, MapPin, Sparkles, Building2, Users, BookOpen, Clock } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useMaster } from '../../../hooks/useMaster'
import { formatCurrency } from '../../../utils/formatCurrency'
import { VENUE_DEFAULTS } from '../../../data/venues'

const EMPTY = { category: '', badge: '🏨', adjustment: '', travelCharge: '', notes: '' }

const inp = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 650,
  color: 'var(--dash-label-text)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em',
}

function AdjBadge({ value }) {
  if (value > 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
      color: 'var(--badge-confirmed)', fontWeight: 700, fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
      <TrendingUp size={14} /> +{formatCurrency(value)}
    </span>
  )
  if (value < 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
      color: 'var(--badge-rejected)', fontWeight: 700, fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
      <TrendingDown size={14} /> −{formatCurrency(Math.abs(value))}
    </span>
  )
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
      color: 'var(--dash-text-muted)', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
      <Minus size={14} /> Base Rate
    </span>
  )
}

export default function Venues() {
  const { items, add, update, remove } = useMaster('md_venues', VENUE_DEFAULTS)
  const [search, setSearch]   = useState('')
  const [open, setOpen]       = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(EMPTY)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = items.filter(i =>
    !search || i.category.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd()   { setEditing(null); setForm(EMPTY); setOpen(true) }
  function openEdit(i) { setEditing(i.id); setForm({ category: i.category, badge: i.badge || '🏨', adjustment: i.adjustment, travelCharge: i.travelCharge, notes: i.notes }); setOpen(true) }
  function handleSaveFixed() {
    if (!form.category.trim()) return
    const data = { category: form.category, badge: form.badge || '🏨', adjustment: Number(form.adjustment) || 0, travelCharge: Number(form.travelCharge) || 0, notes: form.notes }
    editing ? update(editing, data) : add(data)
    setOpen(false)
  }
  function handleDelete(id) {
    if (window.confirm('Delete this venue category?')) remove(id)
  }

  const sorted = [...filtered].sort((a, b) => b.adjustment - a.adjustment)

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '0px' }}>

      {/* Sticky Header Section */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--dash-bg)',
        paddingTop: '20px',
        marginTop: '-24px',
        paddingBottom: '14px',
        marginBottom: '10px',
      }}>
        {/* Master Tab Nav */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '28px',
          borderBottom: '1.5px solid var(--dash-border)', marginBottom: '22px',
        }}>
          <Link to="/dashboard/masters/services" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            paddingBottom: '12px', fontSize: '14px', fontWeight: 500,
            color: 'var(--dash-text-secondary)', borderBottom: '2.5px solid transparent',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
          }}>
            <Sparkles size={15} /> Service Master
          </Link>
          <Link to="/dashboard/masters/venues" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            paddingBottom: '12px', fontSize: '14px', fontWeight: 700,
            color: 'var(--icon-booking)', borderBottom: '2.5px solid var(--icon-booking)',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
          }}>
            <Building2 size={15} style={{ color: 'var(--icon-booking)' }} /> Venue Pricing Master
          </Link>
          <Link to="/dashboard/masters/vendors" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            paddingBottom: '12px', fontSize: '14px', fontWeight: 500,
            color: 'var(--dash-text-secondary)', borderBottom: '2.5px solid transparent',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
          }}>
            <Users size={15} /> Vendor Master
          </Link>
          <Link to="/dashboard/masters/availability" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            paddingBottom: '12px', fontSize: '14px', fontWeight: 500,
            color: 'var(--dash-text-secondary)', borderBottom: '2.5px solid transparent',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
          }}>
            <Clock size={15} /> Availability Master
          </Link>
        </div>

        {/* Sub-Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '13px', color: 'var(--dash-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={14} style={{ color: 'var(--icon-booking)' }} /> <strong>{items.length}</strong> Venue Categories
            </span>
            <span style={{ fontSize: '13px', color: 'var(--dash-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} style={{ color: 'var(--icon-booking)' }} /> <strong>₹750</strong> avg travel charge
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--icon-booking)' }} />
              <input
                placeholder="Search venues…"
                value={search} onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '8px 12px 8px 32px', borderRadius: '9px',
                  border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
                  fontSize: '12.5px', color: 'var(--dash-input-text)', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              onClick={openAdd}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '8.5px 18px', borderRadius: '9px', border: 'none',
                background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)',
                color: 'white', fontWeight: 700, fontSize: '13px',
                cursor: 'pointer', boxShadow: '0 4px 14px rgba(201,149,108,0.35)',
                transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <Plus size={15} /> Add Venue
            </button>
          </div>
        </div>
      </div>

      {/* Venues Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
        {sorted.map(item => (
          <div
            key={item.id}
            style={{
              background: 'var(--dash-card-bg)',
              borderRadius: '16px',
              border: '1.5px solid var(--dash-border)',
              padding: '18px 20px',
              display: 'flex', flexDirection: 'column', gap: '14px',
              boxShadow: '0 4px 16px -2px var(--dash-shadow)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#c9956c'
              e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(201,149,108,0.32)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,149,108,0.38)'
              e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(201,149,108,0.18)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--dash-text-primary)', fontFamily: 'Inter, sans-serif', lineHeight: 1.35 }}>
                {item.category}
              </h3>
              <p style={{
                margin: '6px 0 0', fontSize: '12.5px', color: 'var(--dash-text-muted)', lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                minHeight: '36px',
              }}>
                {item.notes || 'No venue notes specs provided.'}
              </p>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: '12px', borderTop: '1px dashed rgba(var(--rgb-rose-gold),0.22)', marginTop: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--dash-text-muted)', fontWeight: 600 }}>
                  # {String(item.id).padStart(4, '0')}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--icon-booking)', fontWeight: 650, background: 'var(--icon-booking-bg)', padding: '2px 7px', borderRadius: '5px', border: '1px solid var(--dash-border)' }}>
                  Venue
                </span>
                {item.travelCharge > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={11} style={{ color: 'var(--icon-booking)' }} /> {formatCurrency(item.travelCharge)}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <AdjBadge value={item.adjustment} />
                  <span style={{ fontSize: '10px', color: 'var(--dash-text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    price delta
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(item) }} title="Edit Venue" style={{
                    width: '28px', height: '28px', borderRadius: '7px', border: 'none',
                    background: 'var(--btn-ghost-bg)', color: 'var(--icon-booking)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--icon-booking-bg)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--btn-ghost-bg)' }}
                  ><Pencil size={13} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }} title="Delete Venue" style={{
                    width: '28px', height: '28px', borderRadius: '7px', border: 'none',
                    background: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--rgb-danger),0.22)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--badge-rejected-bg)' }}
                  ><Trash2 size={13} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {sorted.length === 0 && (
        <EmptyState
          icon={Building2}
          title="No Venue Categories Found"
          subtitle={search ? `No venues match "${search}". Try adjusting your search query.` : 'Add your first venue pricing category to start tracking venue price adjustments.'}
          actionLabel={!search ? '+ Add Venue' : undefined}
          onAction={openAdd}
        />
      )}

      {/* Legend - Sticky Bottom */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        zIndex: 20,
        background: 'var(--dash-bg)',
        paddingTop: '12px',
        paddingBottom: '16px',
        marginTop: '16px',
      }}>
        <div style={{
          display: 'flex', gap: '20px', flexWrap: 'wrap',
          background: 'var(--dash-card-bg)', padding: '12px 18px',
          borderRadius: '12px', border: '1px solid var(--dash-border)',
          boxShadow: '0 -4px 16px var(--dash-shadow)',
        }}>
          {[
            { color: 'var(--badge-confirmed)', label: 'Premium surcharge added to base price' },
            { color: 'var(--dash-text-muted)', label: 'No price change' },
            { color: 'var(--badge-rejected)', label: 'Discount applied to base price' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span style={{ fontSize: '12.5px', color: 'var(--dash-text-secondary)', fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Venue Category' : 'Add Venue Category'} onSave={handleSaveFixed} saveLabel={editing ? 'Update' : 'Add Venue'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={lbl}>Venue Category</label>
            <input style={inp} placeholder="e.g. Luxury Hotel" value={form.category} onChange={e => set('category', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Price Adjustment (₹)</label>
              <input style={inp} type="number" placeholder="0 · use negative to deduct" value={form.adjustment} onChange={e => set('adjustment', e.target.value)} />
              <p style={{ fontSize: '11px', color: 'var(--dash-text-muted)', margin: '4px 0 0' }}>Negative value = discount</p>
            </div>
            <div>
              <label style={lbl}>Travel Charge (₹)</label>
              <input style={inp} type="number" placeholder="0" value={form.travelCharge} onChange={e => set('travelCharge', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Notes</label>
            <input style={inp} placeholder="Brief description of this venue type…" value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

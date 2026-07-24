import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, TrendingUp, TrendingDown, Minus, MapPin, Layers, Sparkles, Building2, Users, BookOpen, Clock, Tag, CheckCircle2 } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'
import { useMaster } from '../../../hooks/useMaster'
import { formatCurrency } from '../../../utils/formatCurrency'

const DEFAULTS = [
  { id: 4412, category: 'Grand Convention Center (EC)', badge: '🏛️', adjustment: 5000,  travelCharge: 1000, notes: 'Large 5-star convention halls · AC & Stage Setup Included' },
  { id: 9403, category: '5-Star Hotel Ballroom (EC)',       badge: '⭐', adjustment: 4000,  travelCharge: 750,  notes: 'Premium 4–5 star hotel banquets & suite bridal suites' },
  { id: 9404, category: 'Luxury Resort Property (EC)',      badge: '🏨', adjustment: 3000,  travelCharge: 500,  notes: 'Exclusive heritage resorts & luxury beachfront properties' },
  { id: 9405, category: 'Outdoor Garden & Farmhouse',      badge: '🌿', adjustment: 2500,  travelCharge: 1500, notes: 'Open air beach, lawn, pool side & farmhouse setups' },
  { id: 9406, category: 'Premium Marriage Hall (EC)',      badge: '🏰', adjustment: 2000,  travelCharge: 0,    notes: 'Air-conditioned premium marriage & banquet halls' },
  { id: 9407, category: 'Temple Wedding Venue',             badge: '🛕', adjustment: 1500,  travelCharge: 500,  notes: 'Traditional temple mandapams & religious premises' },
  { id: 9408, category: 'Standard Community Hall',          badge: '🏢', adjustment: 0,     travelCharge: 0,    notes: 'Regular community & local marriage halls' },
  { id: 9409, category: 'Home Function / House Wedding',    badge: '🏡', adjustment: -1000, travelCharge: 0,    notes: 'In-house ceremony setups & residential home functions' },
]

const EMPTY = { category: '', badge: '🏨', adjustment: '', travelCharge: '', notes: '' }

const inp = {
  width: '100%', padding: '9px 12px', borderRadius: '8px',
  border: '1px solid #cbd5e1', background: '#f8fafc',
  fontSize: '13px', color: '#0f172a', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 650,
  color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em',
}

function AdjBadge({ value }) {
  if (value > 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
      color: '#059669', fontWeight: 700, fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
      <TrendingUp size={14} /> +{formatCurrency(value)}
    </span>
  )
  if (value < 0) return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
      color: '#dc2626', fontWeight: 700, fontSize: '15px', fontFamily: 'Inter, sans-serif' }}>
      <TrendingDown size={14} /> −{formatCurrency(Math.abs(value))}
    </span>
  )
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px',
      color: '#64748b', fontWeight: 600, fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
      <Minus size={14} /> Base Rate
    </span>
  )
}

export default function Venues() {
  const { items, add, update, remove } = useMaster('md_venues', DEFAULTS)
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

      {/* Top Navigation Tabs (Horizontal Line Tabs in MakeupDesk Theme) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '28px',
        borderBottom: '1.5px solid rgba(201,149,108,0.2)', marginBottom: '22px',
      }}>
        <Link to="/dashboard/masters/services" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          paddingBottom: '12px', fontSize: '14px', fontWeight: 500,
          color: '#5a4253', borderBottom: '2.5px solid transparent',
          textDecoration: 'none', fontFamily: 'Inter, sans-serif',
        }}>
          <Sparkles size={15} /> Service Master
        </Link>

        <Link to="/dashboard/masters/venues" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          paddingBottom: '12px', fontSize: '14px', fontWeight: 700,
          color: '#8a5934', borderBottom: '2.5px solid #c9956c',
          textDecoration: 'none', fontFamily: 'Inter, sans-serif',
        }}>
          <Building2 size={15} style={{ color: '#c9956c' }} /> Venue Pricing Master
        </Link>

        <Link to="/dashboard/masters/vendors" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          paddingBottom: '12px', fontSize: '14px', fontWeight: 500,
          color: '#5a4253', borderBottom: '2.5px solid transparent',
          textDecoration: 'none', fontFamily: 'Inter, sans-serif',
        }}>
          <Users size={15} /> Vendor Master
        </Link>
      </div>

      {/* Sub-Toolbar (MakeupDesk Palette: Metrics + Search + Auto-saved + Primary CTA) */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '14px', marginBottom: '22px',
      }}>
        {/* Left Micro-metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#4a3847', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} style={{ color: '#c9956c' }} /> <strong>{items.length}</strong> Venue Categories
          </span>
          <span style={{ fontSize: '13px', color: '#4a3847', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} style={{ color: '#c9956c' }} /> <strong>₹750</strong> avg travel charge
          </span>
        </div>

        {/* Right Actions Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Search Input Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#c9956c' }} />
            <input
              placeholder="Search venues…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 32px', borderRadius: '9px',
                border: '1.5px solid rgba(201,149,108,0.3)', background: '#fdf8f4',
                fontSize: '12.5px', color: '#2d1b2e', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* + New Venue Primary Button (MakeupDesk Terracotta Gradient) */}
          <button
            onClick={openAdd}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '8.5px 18px', borderRadius: '9px', border: 'none',
              background: 'linear-gradient(135deg, #c9956c, #d4728f)',
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

      {/* Venues Grid (MakeupDesk Luxury Theme Architecture) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
        {sorted.map(item => (
          <div
            key={item.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              border: '1.5px solid rgba(201,149,108,0.28)',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              gap: '14px',
              boxShadow: '0 4px 16px -2px rgba(45,27,46,0.04)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#c9956c'
              e.currentTarget.style.boxShadow = '0 10px 24px -4px rgba(45,27,46,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(201,149,108,0.28)'
              e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(45,27,46,0.04)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            {/* Header Title & Specs Description */}
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#2d1b2e', fontFamily: 'Inter, sans-serif', lineHeight: 1.35 }}>
                {item.category}
              </h3>
              <p style={{
                margin: '6px 0 0', fontSize: '12.5px', color: '#5c4858', lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                minHeight: '36px',
              }}>
                {item.notes || 'No venue notes specs provided.'}
              </p>
            </div>

            {/* Bottom Row: Specs Tags Left + Price Adjustment & Actions Right */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: '12px', borderTop: '1px dashed rgba(201,149,108,0.22)', marginTop: 'auto',
            }}>
              {/* Left Metadata Specs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: '#8b6e7e', fontWeight: 600 }}>
                  # {String(item.id).padStart(4, '0')}
                </span>
                <span style={{ fontSize: '11px', color: '#8a5934', fontWeight: 650, background: 'rgba(201,149,108,0.12)', padding: '2px 7px', borderRadius: '5px', border: '1px solid rgba(201,149,108,0.25)' }}>
                  Venue
                </span>
                {item.travelCharge > 0 && (
                  <span style={{ fontSize: '11px', color: '#4a3847', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <MapPin size={11} style={{ color: '#c9956c' }} /> {formatCurrency(item.travelCharge)}
                  </span>
                )}
              </div>

              {/* Right Price Adjustment Block & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <AdjBadge value={item.adjustment} />
                  <span style={{ fontSize: '10px', color: '#8b6e7e', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    price delta
                  </span>
                </div>

                {/* Ghost Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(item) }}
                    title="Edit Venue"
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px', border: 'none',
                      background: 'rgba(201,149,108,0.08)', color: '#c9956c', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.2)'; e.currentTarget.style.color = '#a86f44' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.08)'; e.currentTarget.style.color = '#c9956c' }}
                  >
                    <Pencil size={13} />
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                    title="Delete Venue"
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px', border: 'none',
                      background: 'rgba(220,38,38,0.06)', color: '#dc2626', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.16)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Venue Ghost Card */}
        <div
          onClick={openAdd}
          style={{
            background: 'rgba(253,248,244,0.6)',
            borderRadius: '16px',
            border: '2px dashed rgba(201,149,108,0.4)',
            padding: '18px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justify: 'center',
            gap: '8px',
            cursor: 'pointer',
            minHeight: '140px',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.borderColor = '#c9956c'
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 20px -3px rgba(201,149,108,0.18)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(253,248,244,0.6)'
            e.currentTarget.style.borderColor = 'rgba(201,149,108,0.4)'
            e.currentTarget.style.transform = 'none'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(201,149,108,0.2), rgba(212,114,143,0.2))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#c9956c', boxShadow: '0 2px 8px rgba(201,149,108,0.15)',
          }}>
            <Plus size={18} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#2d1b2e', fontFamily: 'Inter, sans-serif', display: 'block' }}>
              Add New Venue
            </span>
            <span style={{ fontSize: '11.5px', color: '#5a4253', marginTop: '1px', display: 'block' }}>
              Click to add pricing category
            </span>
          </div>
        </div>
      </div>

      {sorted.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px', color: '#4a3847', fontSize: '14px' }}>
          No venue categories found.
        </Card>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', background: 'white', padding: '12px 18px', borderRadius: '12px', border: '1px solid rgba(201,149,108,0.18)' }}>
        {[
          { color: '#059669', label: 'Premium surcharge added to base price' },
          { color: '#5a4253', label: 'No price change' },
          { color: '#dc2626', label: 'Discount applied to base price' },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
            <span style={{ fontSize: '12.5px', color: '#4a3847', fontWeight: 500 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Venue Category' : 'Add Venue Category'}
        onSave={handleSaveFixed}
        saveLabel={editing ? 'Update' : 'Add Venue'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={lbl}>Venue Category</label>
            <input style={inp} placeholder="e.g. Luxury Hotel"
              value={form.category} onChange={e => set('category', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Price Adjustment (₹)</label>
              <input style={inp} type="number" placeholder="0 · use negative to deduct"
                value={form.adjustment} onChange={e => set('adjustment', e.target.value)} />
              <p style={{ fontSize: '11px', color: '#8b6e7e', margin: '4px 0 0' }}>
                Negative value = discount
              </p>
            </div>
            <div>
              <label style={lbl}>Travel Charge (₹)</label>
              <input style={inp} type="number" placeholder="0"
                value={form.travelCharge} onChange={e => set('travelCharge', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Notes</label>
            <input style={inp} placeholder="Brief description of this venue type…"
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

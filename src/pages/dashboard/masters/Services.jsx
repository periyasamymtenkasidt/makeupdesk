import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Clock, Search, BookOpen, Tag, CheckCircle2, Layers, Sparkles, Building2, Users } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'
import { useMaster } from '../../../hooks/useMaster'
import { formatCurrency } from '../../../utils/formatCurrency'

const CATEGORIES = ['All', 'Bridal', 'Events', 'Photoshoot']

const DEFAULTS = [
  { id: 4412, name: 'Bridal Makeup — HD / Airbrush Finish',   category: 'Bridal',     badge: '✨', basePrice: 8000,  duration: '3–4 hrs', description: 'Plywood (BWP / MR 18-19mm) · Premium HD / Airbrush Finish · Lashes & Hair Styling Included', active: true },
  { id: 9403, name: 'Reception Glam — Long-Lasting Finish',  category: 'Bridal',     badge: '👑', basePrice: 9000,  duration: '3–4 hrs', description: 'Grand reception looks with waterproof long-lasting finish for evening lights & stage.', active: true },
  { id: 9404, name: 'Engagement Ceremony Look',             category: 'Bridal',     badge: '💍', basePrice: 6500,  duration: '2–3 hrs', description: 'Elegant, camera-ready subtle glam for engagement & ring ceremony.', active: true },
  { id: 9405, name: 'Party Makeup — Cocktail & Sangeet',    category: 'Events',     badge: '🎉', basePrice: 3500,  duration: '1–2 hrs', description: 'Bold, glamorous looks for sangeet, cocktail parties & guest family functions.', active: true },
  { id: 9406, name: 'HD Shoot Makeup — Studio Ready',      category: 'Photoshoot', badge: '📸', basePrice: 4500,  duration: '1.5 hrs', description: 'High-definition formulas optimized for studio 4K lighting & high-res photography.', active: true },
  { id: 9407, name: 'Airbrush Perfection Finish',          category: 'Photoshoot', badge: '💨', basePrice: 5000,  duration: '2 hrs',   description: 'Ultra-fine micro-spray finish for skin-like featherweight texture all day.', active: true },
  { id: 9408, name: 'Pre-Wedding Shoot & Mehendi Glam',    category: 'Events',     badge: '🌸', basePrice: 5500,  duration: '2–3 hrs', description: 'Trial sessions, vibrant mehendi color tones & outdoor shoot glam.', active: true },
  { id: 9409, name: 'Editorial High-Fashion Look',          category: 'Photoshoot', badge: '💄', basePrice: 6000,  duration: '2–3 hrs', description: 'Avant-garde runway & magazine shoot styling with custom artistic accents.', active: true },
]

const EMPTY = { name: '', category: 'Bridal', badge: '✨', basePrice: '', duration: '', description: '', active: true }

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

function ToggleWithLabel({ on, onChange }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <button type="button" onClick={onChange} title={on ? 'Click to deactivate' : 'Click to activate'} style={{
        width: '38px', height: '22px', borderRadius: '11px', border: 'none',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        background: on ? '#059669' : '#cbd5e1',
        transition: 'background 0.2s', padding: 0,
      }}>
        <span style={{
          position: 'absolute', top: '2.5px',
          left: on ? '18.5px' : '2.5px', width: '17px', height: '17px',
          borderRadius: '50%', background: 'white', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
      <span style={{
        fontSize: '12px', fontWeight: 600,
        color: on ? '#059669' : '#64748b',
      }}>
        {on ? 'Active' : 'Inactive'}
      </span>
    </div>
  )
}

export default function Services() {
  const { items, add, update, remove, toggle } = useMaster('md_services', DEFAULTS)
  const [search, setSearch]       = useState('')
  const [activeTab, setActiveTab] = useState('All')
  const [open, setOpen]           = useState(false)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(EMPTY)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = items.filter(i => {
    const matchCat = activeTab === 'All' || (i.category || 'Bridal') === activeTab
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || (i.description && i.description.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  function openAdd()     { setEditing(null); setForm(EMPTY); setOpen(true) }
  function openEdit(i)   { setEditing(i.id); setForm({ name: i.name, category: i.category || 'Bridal', badge: i.badge || '✨', basePrice: i.basePrice, duration: i.duration, description: i.description, active: i.active }); setOpen(true) }
  function handleSave()  {
    if (!form.name.trim()) return
    const data = { ...form, basePrice: Number(form.basePrice) || 0 }
    editing ? update(editing, data) : add(data)
    setOpen(false)
  }
  function handleDelete(id) {
    if (window.confirm('Delete this service item?')) remove(id)
  }

  const activeCount = items.filter(i => i.active).length
  const avgPrice = items.length ? Math.round(items.reduce((acc, curr) => acc + (Number(curr.basePrice) || 0), 0) / items.length) : 0

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '0px' }}>

      {/* Top Navigation Tabs (Horizontal Line Tabs in MakeupDesk Theme) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '28px',
        borderBottom: '1.5px solid rgba(201,149,108,0.2)', marginBottom: '22px',
      }}>
        <Link to="/dashboard/masters/services" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          paddingBottom: '12px', fontSize: '14px', fontWeight: 700,
          color: '#8a5934', borderBottom: '2.5px solid #c9956c',
          textDecoration: 'none', fontFamily: 'Inter, sans-serif',
        }}>
          <Sparkles size={15} style={{ color: '#c9956c' }} /> Service Master
        </Link>

        <Link to="/dashboard/masters/venues" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          paddingBottom: '12px', fontSize: '14px', fontWeight: 500,
          color: '#5a4253', borderBottom: '2.5px solid transparent',
          textDecoration: 'none', fontFamily: 'Inter, sans-serif',
        }}>
          <Building2 size={15} /> Venue Pricing Master
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

      {/* Sub-Toolbar (MakeupDesk Palette: Metrics + Filter Tabs + Search + Auto-saved + Primary CTA) */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '14px', marginBottom: '22px',
      }}>
        {/* Left Micro-metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: '#4a3847', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <BookOpen size={14} style={{ color: '#c9956c' }} /> <strong>{items.length}</strong> Services
          </span>
          <span style={{ fontSize: '13px', color: '#4a3847', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} style={{ color: '#c9956c' }} /> <strong>3h</strong> avg duration
          </span>
          <span style={{ fontSize: '13px', color: '#4a3847', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Tag size={14} style={{ color: '#c9956c' }} /> <strong>{formatCurrency(avgPrice)}</strong> avg rate
          </span>
          <span style={{ fontSize: '13px', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <CheckCircle2 size={14} /> <strong>{activeCount}</strong> Active
          </span>
        </div>

        {/* Right Actions Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Category Pill Switcher */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(201,149,108,0.12)', padding: '3px', borderRadius: '8px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
                  fontWeight: activeTab === cat ? 700 : 500, border: 'none',
                  background: activeTab === cat ? 'white' : 'transparent',
                  color: activeTab === cat ? '#8a5934' : '#5a4253',
                  cursor: 'pointer', boxShadow: activeTab === cat ? '0 2px 6px rgba(45,27,46,0.06)' : 'none',
                  transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#c9956c' }} />
            <input
              placeholder="Search services…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 32px', borderRadius: '9px',
                border: '1.5px solid rgba(201,149,108,0.3)', background: '#fdf8f4',
                fontSize: '12.5px', color: '#2d1b2e', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* + New Service Primary Button (MakeupDesk Terracotta Gradient) */}
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
            <Plus size={15} /> Add Service
          </button>
        </div>
      </div>

      {/* Services Grid (MakeupDesk Luxury Theme Architecture) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
        {filtered.map(item => (
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
                {item.name}
              </h3>
              <p style={{
                margin: '6px 0 0', fontSize: '12.5px', color: '#5c4858', lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                minHeight: '36px',
              }}>
                {item.description || 'No service description specs provided.'}
              </p>
            </div>

            {/* Bottom Row: Specs Tags Left + Price & Actions Right */}
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
                  {item.category || 'Bridal'}
                </span>
                {item.duration && (
                  <span style={{ fontSize: '11px', color: '#4a3847', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} style={{ color: '#c9956c' }} /> {item.duration}
                  </span>
                )}
              </div>

              {/* Right Price Block & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '17.5px', fontWeight: 800, color: '#2d1b2e', lineHeight: 1.1, display: 'block' }}>
                    {formatCurrency(item.basePrice)}
                  </span>
                  <span style={{ fontSize: '10px', color: '#8b6e7e', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    base price
                  </span>
                </div>

                {/* Ghost Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(item) }}
                    title="Edit Service"
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
                    title="Delete Service"
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

        {/* Add New Service Ghost Card */}
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
              Add New Service
            </span>
            <span style={{ fontSize: '11.5px', color: '#5a4253', marginTop: '1px', display: 'block' }}>
              Click to create service template
            </span>
          </div>
        </div>
      </div>

      {filtered.length === 0 && (
        <Card style={{ textAlign: 'center', padding: '48px', color: '#4a3847', fontSize: '14px' }}>
          No services match your filters.
        </Card>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Service' : 'Add Service'}
        onSave={handleSave}
        saveLabel={editing ? 'Update' : 'Add Service'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={lbl}>Service Name</label>
            <input style={inp} placeholder="e.g. Bridal Makeup"
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Category</label>
              <select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="Bridal">Bridal</option>
                <option value="Events">Events</option>
                <option value="Photoshoot">Photoshoot</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Emoji Icon Badge</label>
              <input style={inp} placeholder="✨"
                value={form.badge} onChange={e => set('badge', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Base Price (₹)</label>
              <input style={inp} type="number" placeholder="8000"
                value={form.basePrice} onChange={e => set('basePrice', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Duration</label>
              <input style={inp} placeholder="e.g. 2–3 hrs"
                value={form.duration} onChange={e => set('duration', e.target.value)} />
            </div>
          </div>

          <div>
            <label style={lbl}>Description</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: '80px', lineHeight: 1.5 }}
              placeholder="Brief description of the service…"
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ToggleWithLabel on={form.active} onChange={() => set('active', !form.active)} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

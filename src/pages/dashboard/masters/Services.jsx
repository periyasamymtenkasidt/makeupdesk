import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, Clock, Search, BookOpen, Tag, CheckCircle2, Sparkles, Building2, Users } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Modal } from '../../../components/ui/Modal'
import { EmptyState } from '../../../components/ui/EmptyState'
import { useMaster } from '../../../hooks/useMaster'
import { formatCurrency } from '../../../utils/formatCurrency'
import { CustomSelect } from '../../../components/ui/CustomSelect'

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
  border: '1px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 650,
  color: 'var(--dash-label-text)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em',
}

function ToggleWithLabel({ on, onChange }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <button type="button" onClick={onChange} title={on ? 'Click to deactivate' : 'Click to activate'} style={{
        width: '38px', height: '22px', borderRadius: '11px', border: 'none',
        cursor: 'pointer', position: 'relative', flexShrink: 0,
        background: on ? 'var(--badge-confirmed)' : 'var(--dash-toggle-off)',
        transition: 'background 0.2s', padding: 0,
      }}>
        <span style={{
          position: 'absolute', top: '2.5px',
          left: on ? '18.5px' : '2.5px', width: '17px', height: '17px',
          borderRadius: '50%', background: 'white', transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
      <span style={{ fontSize: '12px', fontWeight: 600, color: on ? 'var(--badge-confirmed)' : 'var(--dash-text-muted)' }}>
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

  function openAdd()    { setEditing(null); setForm(EMPTY); setOpen(true) }
  function openEdit(i)  { setEditing(i.id); setForm({ name: i.name, category: i.category || 'Bridal', badge: i.badge || '✨', basePrice: i.basePrice, duration: i.duration, description: i.description, active: i.active }); setOpen(true) }
  function handleSave() {
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
            paddingBottom: '12px', fontSize: '14px', fontWeight: 700,
            color: 'var(--icon-booking)', borderBottom: '2.5px solid var(--icon-booking)',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
          }}>
            <Sparkles size={15} style={{ color: 'var(--icon-booking)' }} /> Service Master
          </Link>
          <Link to="/dashboard/masters/venues" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            paddingBottom: '12px', fontSize: '14px', fontWeight: 500,
            color: 'var(--dash-text-secondary)', borderBottom: '2.5px solid transparent',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
          }}>
            <Building2 size={15} /> Venue Pricing Master
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
              <BookOpen size={14} style={{ color: 'var(--icon-booking)' }} /> <strong>{items.length}</strong> Services
            </span>
            <span style={{ fontSize: '13px', color: 'var(--dash-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} style={{ color: 'var(--icon-booking)' }} /> <strong>3h</strong> avg duration
            </span>
            <span style={{ fontSize: '13px', color: 'var(--dash-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={14} style={{ color: 'var(--icon-booking)' }} /> <strong>{formatCurrency(avgPrice)}</strong> avg rate
            </span>
            <span style={{ fontSize: '13px', color: 'var(--badge-confirmed)', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <CheckCircle2 size={14} /> <strong>{activeCount}</strong> Active
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Category Pill Switcher */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--dash-filter-wrap)', padding: '3px', borderRadius: '8px' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  style={{
                    padding: '5px 12px', borderRadius: '6px', fontSize: '12px',
                    fontWeight: activeTab === cat ? 700 : 500, border: 'none',
                    background: activeTab === cat ? 'var(--dash-filter-active-bg)' : 'transparent',
                    color: activeTab === cat ? 'var(--dash-filter-active-tx)' : 'var(--dash-filter-muted-tx)',
                    cursor: 'pointer', boxShadow: activeTab === cat ? '0 2px 6px var(--dash-shadow)' : 'none',
                    transition: 'all 0.15s ease', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--icon-booking)' }} />
              <input
                placeholder="Search services…"
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
              <Plus size={15} /> Add Service
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '18px' }}>
        {filtered.map(item => (
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
                {item.name}
              </h3>
              <p style={{
                margin: '6px 0 0', fontSize: '12.5px', color: 'var(--dash-text-muted)', lineHeight: 1.45,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                minHeight: '36px',
              }}>
                {item.description || 'No service description specs provided.'}
              </p>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              paddingTop: '12px', borderTop: '1px dashed var(--dash-border-subtle)', marginTop: 'auto',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', color: 'var(--dash-text-muted)', fontWeight: 600 }}>
                  # {String(item.id).padStart(4, '0')}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--icon-booking)', fontWeight: 650, background: 'var(--icon-booking-bg)', padding: '2px 7px', borderRadius: '5px', border: '1px solid var(--dash-border)' }}>
                  {item.category || 'Bridal'}
                </span>
                {item.duration && (
                  <span style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} style={{ color: 'var(--icon-booking)' }} /> {item.duration}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '17.5px', fontWeight: 800, color: 'var(--dash-text-primary)', lineHeight: 1.1, display: 'block' }}>
                    {formatCurrency(item.basePrice)}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--dash-text-muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    base price
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(item) }}
                    title="Edit Service"
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px', border: 'none',
                      background: 'var(--btn-ghost-bg)', color: 'var(--btn-ghost-color)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--icon-booking-bg)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--btn-ghost-bg)' }}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id) }}
                    title="Delete Service"
                    style={{
                      width: '28px', height: '28px', borderRadius: '7px', border: 'none',
                      background: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(var(--rgb-danger),0.22)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--badge-rejected-bg)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No Services Found"
          subtitle={search ? `No service matches "${search}". Try adjusting your search or category filter.` : 'Click below to create your first service package.'}
          actionLabel={!search ? '+ Add Service' : undefined}
          onAction={openAdd}
        />
      )}

      {/* Add / Edit Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Service' : 'Add Service'} onSave={handleSave} saveLabel={editing ? 'Update' : 'Add Service'}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={lbl}>Service Name</label>
            <input style={inp} placeholder="e.g. Bridal Makeup" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <CustomSelect
              label="Category"
              value={form.category}
              options={['Bridal', 'Events', 'Photoshoot']}
              onChange={val => set('category', val)}
            />
            <div>
              <label style={lbl}>Emoji Icon Badge</label>
              <input style={inp} placeholder="✨" value={form.badge} onChange={e => set('badge', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Base Price (₹)</label>
              <input style={inp} type="number" placeholder="8000" value={form.basePrice} onChange={e => set('basePrice', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Duration</label>
              <input style={inp} placeholder="e.g. 2–3 hrs" value={form.duration} onChange={e => set('duration', e.target.value)} />
            </div>
          </div>
          <div>
            <label style={lbl}>Description</label>
            <textarea style={{ ...inp, resize: 'vertical', minHeight: '80px', lineHeight: 1.5 }}
              placeholder="Brief description of the service…" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ToggleWithLabel on={form.active} onChange={() => set('active', !form.active)} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

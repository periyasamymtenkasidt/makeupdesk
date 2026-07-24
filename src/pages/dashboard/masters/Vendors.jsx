import { useState } from 'react'
import { Plus, Search, Pencil, Trash2, Phone, MessageCircle, Filter } from 'lucide-react'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { useMaster } from '../../../hooks/useMaster'
import { formatCurrency } from '../../../utils/formatCurrency'

const CATEGORIES = [
  'Hair Stylist', 'Saree Draper', 'Costume Designer', 'Mehendi Artist',
  'Nail Artist', 'Photographer', 'Videographer', 'Assistant Makeup Artist', 'Other',
]

const DEFAULTS = [
  { id: 1, name: 'Preethi Nair',  category: 'Hair Stylist',           contact: '+91 99887 11223', whatsapp: '+91 99887 11223', charges: 2500,  serviceArea: 'Mumbai',        availability: 'Available', rating: 5, notes: 'Expert in bridal hair' },
  { id: 2, name: 'Kavitha Menon', category: 'Saree Draper',           contact: '+91 88776 22334', whatsapp: '+91 88776 22334', charges: 1500,  serviceArea: 'Mumbai',        availability: 'Available', rating: 4, notes: 'Specializes in silk sarees' },
  { id: 3, name: 'Rahul Sharma',  category: 'Photographer',           contact: '+91 77665 33445', whatsapp: '+91 77665 33445', charges: 15000, serviceArea: 'Mumbai, Delhi', availability: 'Busy',      rating: 5, notes: 'Candid & portrait specialist' },
  { id: 4, name: 'Meena Iyer',    category: 'Mehendi Artist',         contact: '+91 66554 44556', whatsapp: '+91 66554 44556', charges: 3000,  serviceArea: 'Mumbai',        availability: 'Available', rating: 4, notes: 'Rajasthani & Arabic patterns' },
  { id: 5, name: 'Sundar Raj',    category: 'Videographer',           contact: '+91 55443 55667', whatsapp: '+91 55443 55667', charges: 12000, serviceArea: 'Mumbai',        availability: 'Available', rating: 4, notes: 'Cinematic wedding films' },
  { id: 6, name: 'Anita Desai',   category: 'Assistant Makeup Artist',contact: '+91 44332 66778', whatsapp: '+91 44332 66778', charges: 2000,  serviceArea: 'Mumbai, Pune',  availability: 'Available', rating: 4, notes: 'Trained in HD & Airbrush' },
]

const EMPTY = { name: '', category: 'Hair Stylist', contact: '', whatsapp: '', charges: '', serviceArea: '', availability: 'Available', rating: 5, notes: '' }

const AVAIL_COLORS = {
  Available: { color: '#059669', bg: 'rgba(5,150,105,0.1)'  },
  Busy:      { color: '#d97706', bg: 'rgba(217,119,6,0.1)'  },
  Inactive:  { color: '#5a4253', bg: 'rgba(90,66,83,0.1)' },
}

const inp = {
  width: '100%', padding: '9.5px 14px', borderRadius: '10px',
  border: '1.5px solid rgba(201,149,108,0.3)', background: '#fdf8f4',
  fontSize: '13px', color: '#2d1b2e', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 700,
  color: '#4a3847', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em',
}

function Stars({ rating }) {
  return (
    <span style={{ letterSpacing: '1px', fontSize: '13px' }}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#c9956c' : 'rgba(201,149,108,0.22)' }}>★</span>
      ))}
    </span>
  )
}

export default function Vendors() {
  const { items, add, update, remove } = useMaster('md_vendors', DEFAULTS)
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('All')
  const [open, setOpen]         = useState(false)
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(EMPTY)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const cats = ['All', ...CATEGORIES]

  const filtered = items.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase())
    const matchCat    = catFilter === 'All' || i.category === catFilter
    return matchSearch && matchCat
  })

  function openAdd()   { setEditing(null); setForm(EMPTY); setOpen(true) }
  function openEdit(i) {
    setEditing(i.id)
    setForm({ name: i.name, category: i.category, contact: i.contact, whatsapp: i.whatsapp, charges: i.charges, serviceArea: i.serviceArea, availability: i.availability, rating: i.rating, notes: i.notes })
    setOpen(true)
  }
  function handleSave() {
    if (!form.name.trim()) return
    const data = { ...form, charges: Number(form.charges) || 0, rating: Number(form.rating) }
    editing ? update(editing, data) : add(data)
    setOpen(false)
  }
  function handleDelete(id) {
    if (window.confirm('Remove this vendor?')) remove(id)
  }
  function openWhatsApp(v) {
    const phone = v.whatsapp?.replace(/[^0-9]/g, '') || v.contact?.replace(/[^0-9]/g, '')
    if (phone) window.open(`https://wa.me/${phone}`, '_blank')
  }

  const availCount = items.filter(i => i.availability === 'Available').length

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Contextual Action Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '14px', background: 'white', padding: '14px 18px',
        borderRadius: '14px', border: '1.5px solid rgba(201,149,108,0.25)',
        boxShadow: '0 2px 10px rgba(45,27,46,0.03)',
      }}>
        {/* Left: Stats & Filter Vendors input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', flex: 1 }}>
          <div style={{
            background: 'rgba(201,149,108,0.12)', padding: '6px 14px', borderRadius: '8px',
            fontSize: '12.5px', fontWeight: 650, color: '#4a3847', display: 'inline-flex', alignItems: 'center', gap: '6px',
            whiteSpace: 'nowrap',
          }}>
            <span>{items.length} vendors</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span style={{ color: '#059669' }}>{availCount} available</span>
          </div>

          <div style={{ position: 'relative', minWidth: '220px', maxWidth: '300px', flex: 1 }}>
            <Filter size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#c9956c', pointerEvents: 'none' }} />
            <input
              placeholder="Filter vendors by name/category…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inp, paddingLeft: '32px', background: '#fdf8f4', height: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['All', 'Hair Stylist', 'Photographer', 'Saree Draper', 'Mehendi Artist'].map(c => (
              <button key={c} onClick={() => setCatFilter(c)} style={{
                padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', border: 'none', transition: 'all 0.2s',
                ...(catFilter === c
                  ? { background: '#c9956c', color: 'white' }
                  : { background: 'rgba(201,149,108,0.08)', color: '#4a3847', border: '1px solid rgba(201,149,108,0.2)' }
                ),
              }}>{c}</button>
            ))}
          </div>
        </div>

        {/* Right: Action */}
        <Button variant="primary" size="sm" onClick={openAdd}>
          <Plus size={15} /> Add Vendor
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(201,149,108,0.12)' }}>
                {['Vendor', 'Category', 'Contact', 'Charges / Event', 'Service Area', 'Availability', 'Rating', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left', fontSize: '11px',
                    fontWeight: 600, color: '#8b6e7e', textTransform: 'uppercase',
                    letterSpacing: '0.07em', whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const avail = AVAIL_COLORS[item.availability] ?? AVAIL_COLORS.Inactive
                return (
                  <tr key={item.id}
                    style={{ borderBottom: '1px solid rgba(201,149,108,0.07)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(253,248,244,0.7)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Vendor */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                          background: 'linear-gradient(135deg,#c9956c,#e8a4b8)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '13px', fontWeight: 600, color: 'white',
                        }}>
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#2d1b2e' }}>{item.name}</div>
                          {item.notes && <div style={{ fontSize: '11px', color: '#8b6e7e' }}>{item.notes}</div>}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '11px', fontWeight: 500, padding: '3px 9px', borderRadius: '6px',
                        background: 'rgba(201,149,108,0.1)', color: '#a87655',
                      }}>{item.category}</span>
                    </td>

                    {/* Contact */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', color: '#2d1b2e', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={11} style={{ color: '#c9956c' }} /> {item.contact}
                        </span>
                      </div>
                    </td>

                    {/* Charges */}
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#c9956c', whiteSpace: 'nowrap' }}>
                      {formatCurrency(item.charges)}
                    </td>

                    {/* Service Area */}
                    <td style={{ padding: '14px 16px', color: '#8b6e7e', whiteSpace: 'nowrap' }}>
                      {item.serviceArea || '—'}
                    </td>

                    {/* Availability */}
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                        color: avail.color, background: avail.bg,
                      }}>
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: avail.color }} />
                        {item.availability}
                      </span>
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '14px 16px' }}>
                      <Stars rating={item.rating} />
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => openWhatsApp(item)} title="WhatsApp" style={{
                          width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid rgba(37,211,102,0.3)',
                          background: 'rgba(37,211,102,0.07)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <MessageCircle size={13} style={{ color: '#25D366' }} />
                        </button>
                        <button onClick={() => openEdit(item)} title="Edit" style={{
                          width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid rgba(201,149,108,0.25)',
                          background: 'rgba(201,149,108,0.06)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Pencil size={13} style={{ color: '#c9956c' }} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} title="Delete" style={{
                          width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid rgba(220,38,38,0.2)',
                          background: 'rgba(220,38,38,0.05)', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <Trash2 size={13} style={{ color: '#dc2626' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#8b6e7e', fontSize: '14px' }}>
              No vendors found.
            </div>
          )}
        </div>
      </Card>

      {/* Add / Edit Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Vendor' : 'Add Vendor'}
        onSave={handleSave}
        saveLabel={editing ? 'Update' : 'Add Vendor'}
        width="580px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Vendor Name</label>
              <input style={inp} placeholder="Full name"
                value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Category</label>
              <select style={{ ...inp }} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Contact Number</label>
              <input style={inp} placeholder="+91 99999 88888"
                value={form.contact} onChange={e => set('contact', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>WhatsApp Number</label>
              <input style={inp} placeholder="+91 99999 88888"
                value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Standard Charges (₹ / event)</label>
              <input style={inp} type="number" placeholder="2500"
                value={form.charges} onChange={e => set('charges', e.target.value)} />
            </div>
            <div>
              <label style={lbl}>Service Area</label>
              <input style={inp} placeholder="e.g. Mumbai, Pune"
                value={form.serviceArea} onChange={e => set('serviceArea', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={lbl}>Availability</label>
              <select style={{ ...inp }} value={form.availability} onChange={e => set('availability', e.target.value)}>
                <option>Available</option>
                <option>Busy</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label style={lbl}>Rating</label>
              <select style={{ ...inp }} value={form.rating} onChange={e => set('rating', Number(e.target.value))}>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label style={lbl}>Notes</label>
            <input style={inp} placeholder="Any special notes about this vendor…"
              value={form.notes} onChange={e => set('notes', e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

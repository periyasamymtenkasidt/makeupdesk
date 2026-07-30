import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { useMaster } from '../../hooks/useMaster'
import { useAppointments } from '../../context/AppointmentContext'
import { useClients } from '../../context/ClientContext'
import { to12h } from '../../utils/timeFormat'
import { generateSlots, parseDurationMins } from '../../utils/slots'
import { useAvailability } from '../../context/AvailabilityContext'
import { useArtists, checkArtistAvailability } from '../../hooks/useArtists'
import { SlotPicker } from '../ui/SlotPicker'
import { VENUE_DEFAULTS } from '../../data/venues'
import { MultiArtistPicker } from '../ui/MultiArtistPicker'
import { CustomSelect } from '../ui/CustomSelect'
import { Users, UserCheck } from 'lucide-react'

const SVC_DEFAULTS = [
  { id: 4412, name: 'Bridal Makeup — HD / Airbrush Finish', basePrice: 8000, duration: '3–4 hrs', active: true },
  { id: 9403, name: 'Reception Glam — Long-Lasting Finish',  basePrice: 9000, duration: '3–4 hrs', active: true },
  { id: 9404, name: 'Engagement Ceremony Look',              basePrice: 6500, duration: '2–3 hrs', active: true },
  { id: 9405, name: 'Party Makeup — Cocktail & Sangeet',    basePrice: 3500, duration: '1–2 hrs', active: true },
  { id: 9406, name: 'HD Shoot Makeup — Studio Ready',       basePrice: 4500, duration: '1.5 hrs', active: true },
  { id: 9407, name: 'Airbrush Perfection Finish',           basePrice: 5000, duration: '2 hrs',   active: true },
  { id: 9408, name: 'Pre-Wedding Shoot & Mehendi Glam',     basePrice: 5500, duration: '2–3 hrs', active: true },
  { id: 9409, name: 'Editorial High-Fashion Look',          basePrice: 6000, duration: '2–3 hrs', active: true },
]

const EMPTY = {
  clientId: '', client: '', phone: '',
  serviceId: '', service: '', duration: '',
  vendorId: '1',
  assignedArtists: {
    makeup: 'Studio Artist',
    hair: '',
    draper: '',
  },
  date: new Date().toISOString().split('T')[0],
  time: '', location: 'Studio', venue: '', venueAddress: '',
  amount: '', advanceAmount: '',
  notes: '',
}

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

export default function NewBookingModal({ open, onClose, initialData }) {
  const { appointments, addAppointment, genId } = useAppointments()
  const { availability }            = useAvailability()
  const { clients, addClient }      = useClients()
  const artists                     = useArtists()
  const { items: allServices }      = useMaster('md_services', SVC_DEFAULTS)
  const { items: venues }           = useMaster('md_venues', VENUE_DEFAULTS)
  const services = allServices.filter(s => s.active !== false)

  const [form, setForm] = useState(EMPTY)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const setRoleArtist = (role, artistName) => {
    setForm(f => {
      const updatedRoles = { ...(f.assignedArtists || {}), [role]: artistName }
      const foundVendor = artists.find(a => a.name === (role === 'makeup' ? artistName : f.assignedArtists?.makeup))
      return {
        ...f,
        assignedArtists: updatedRoles,
        vendorId: foundVendor ? String(foundVendor.id) : (f.vendorId || '1'),
      }
    })
  }

  useEffect(() => {
    if (open) {
      setForm({
        ...EMPTY,
        ...(initialData || {}),
        date: initialData?.date || new Date().toISOString().split('T')[0],
      })
    }
  }, [open, initialData])

  function handleClientSelect(e) {
    const val = e.target.value
    if (val === 'new') {
      setForm(f => ({ ...f, clientId: '', client: '', phone: '' }))
    } else {
      const c = clients.find(c => c.id === val)
      if (c) setForm(f => ({ ...f, clientId: c.id, client: c.name, phone: c.phone }))
    }
  }

  function recalculateAmounts(serviceId, venueCategory) {
    const svc = services.find(s => s.id === serviceId)
    const basePrice = svc ? (svc.basePrice || 0) : 0
    const v = venues.find(item => item.category === venueCategory)
    const venueDelta = v ? ((v.adjustment || 0) + (v.travelCharge || 0)) : 0
    const total = Math.max(0, basePrice + venueDelta)
    const advance = Math.round(total * 0.4)
    return {
      amount: String(total || ''),
      advanceAmount: String(advance || ''),
    }
  }

  function handleServiceChange(e) {
    const id  = Number(e.target.value)
    const svc = services.find(s => s.id === id)
    if (svc) {
      const calc = recalculateAmounts(id, form.venue)
      setForm(f => ({
        ...f,
        serviceId: id,
        service:       svc.name.split('—')[0].trim(),
        duration:      svc.duration || '',
        ...calc,
      }))
    }
  }

  function handleLocationChange(e) {
    const locType = e.target.value
    const isVenue = locType === 'Venue'
    const calc = recalculateAmounts(form.serviceId, isVenue ? form.venue : '')
    setForm(f => ({
      ...f,
      location: locType,
      venue: isVenue ? form.venue : '',
      venueAddress: isVenue ? form.venueAddress : '',
      ...calc,
    }))
  }

  function handleVenueChange(e) {
    const venueCat = e.target.value
    const calc = recalculateAmounts(form.serviceId, venueCat)
    setForm(f => ({
      ...f,
      venue: venueCat,
      ...calc,
    }))
  }

  function handleSave() {
    if (!form.client.trim() || !form.phone.trim()) {
      alert('Please fill in client name and phone number.')
      return
    }

    let clientId = form.clientId || null

    if (!clientId) {
      const existing = clients.find(c => c.phone === form.phone)
      if (existing) {
        clientId = existing.id
      } else {
        clientId = addClient({ name: form.client, phone: form.phone })
      }
    }

    const isVenue = form.location === 'Venue'
    const finalLocation = isVenue ? (form.venueAddress || 'On-Location') : 'In-Studio (Sofdoesmakeup Studio)'

    const selectedTeam = form.selectedArtists && form.selectedArtists.length > 0 ? form.selectedArtists : ['Studio Artist']
    const combinedArtistStr = selectedTeam.join(', ')

    addAppointment({
      id:            genId(),
      clientId,
      name:          form.client,
      phone:         form.phone,
      service:       form.service || 'General Makeup',
      duration:      form.duration,
      date:          form.date,
      vendorId:      vendorId || 1,
      artist:        combinedArtistStr,
      assignedArtists: selectedTeam,
      time:          to12h(form.time),
      location:      finalLocation,
      venue:         isVenue ? form.venue : '',
      venueAddress:  isVenue ? form.venueAddress : '',
      status:        'Inquiry',
      amount:        Number(form.amount) || 0,
      advanceAmount: Number(form.advanceAmount) || 0,
      advancePaid:   false,
      balancePaid:   false,
      notes:         form.notes,
    })

    setForm(EMPTY)
    onClose()
  }

  function handleClose() { setForm(EMPTY); onClose() }

  const isExistingClient  = !!form.clientId
  const vendorId          = form.vendorId ? Number(form.vendorId) : 1
  const durationMins      = parseDurationMins(form.duration)
  const slots             = form.date ? generateSlots(form.date, availability, appointments, durationMins, null, vendorId) : []
  const dayOfWeek         = form.date ? new Date(form.date + 'T00:00:00').getDay() : -1
  const offDay            = form.date ? !availability.workDays.includes(dayOfWeek) : false

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Lead / Booking"
      onSave={handleSave}
      saveLabel="Create Booking"
      width="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Client selector */}
        <CustomSelect
          label="Client"
          value={form.clientId || 'new'}
          options={[
            { value: 'new', label: '+ New Client' },
            ...clients.map(c => ({ value: c.id, label: `${c.name} · ${c.phone}` })),
          ]}
          onChange={val => handleClientSelect({ target: { value: val } })}
        />

        {/* Name + Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>Client Name *</label>
            <input style={{ ...inpStyle, opacity: isExistingClient ? 0.6 : 1 }}
              placeholder="e.g. Ananya Roy"
              readOnly={isExistingClient}
              value={form.client} onChange={e => set('client', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Phone Number *</label>
            <input style={{ ...inpStyle, opacity: isExistingClient ? 0.6 : 1 }}
              placeholder="+91 98765 43210"
              readOnly={isExistingClient}
              value={form.phone} onChange={e => set('phone', e.target.value)} />
          </div>
        </div>

        {/* Service Package */}
        <CustomSelect
          label="Service Package"
          value={form.serviceId}
          placeholder="— Select a service package —"
          options={services.map(s => ({ value: s.id, label: s.name }))}
          onChange={val => {
            const id = Number(val)
            const svc = services.find(s => s.id === id)
            if (svc) {
              const calc = recalculateAmounts(id, form.venue)
              setForm(f => ({
                ...f,
                serviceId: id,
                service: svc.name.split('—')[0].trim(),
                duration: svc.duration || '',
                ...calc,
              }))
            }
          }}
        />

        {/* Single Multi-Select Category-Grouped Artist Picker */}
        <MultiArtistPicker
          selected={form.selectedArtists || ['Studio Artist']}
          onChange={newSelected => {
            const primaryName = newSelected[0] || 'Studio Artist'
            const primaryObj = artists.find(a => a.name === primaryName)
            setForm(f => ({
              ...f,
              selectedArtists: newSelected,
              vendorId: primaryObj ? String(primaryObj.id) : '1',
            }))
          }}
          artists={artists}
          date={form.date}
          time={form.time}
          appointments={appointments}
        />

        {/* Date */}
        <div>
          <label style={lbl}>Event Date</label>
          <input type="date" min={new Date().toISOString().split('T')[0]} style={inpStyle} value={form.date}
            onChange={e => { set('date', e.target.value); set('time', '') }} />
        </div>

        {/* Slot picker */}
        {form.date && (
          <SlotPicker
            slots={slots} value={form.time}
            onChange={v => set('time', v)}
            offDay={offDay} date={form.date}
            variant="dash"
          />
        )}

        {/* Location + Venue Category */}
        <div style={{ display: 'grid', gridTemplateColumns: form.location === 'Venue' ? '1fr 1fr' : '1fr', gap: '12px' }}>
          <CustomSelect
            label="Appointment Location"
            value={form.location}
            options={[
              { value: 'Studio', label: '🏠 Studio Appointment (In-Studio)' },
              { value: 'Venue', label: '📍 On-Location / Client Venue' },
            ]}
            onChange={val => handleLocationChange({ target: { value: val } })}
          />

          {form.location === 'Venue' && (
            <CustomSelect
              label="Venue Category"
              value={form.venue}
              placeholder="— Select Venue Category —"
              options={venues.map(v => ({
                value: v.category,
                label: v.category,
              }))}
              onChange={val => handleVenueChange({ target: { value: val } })}
            />
          )}
        </div>

        {/* Venue Address (Only shown for On-Location) */}
        {form.location === 'Venue' && (
          <div>
            <label style={lbl}>Venue Address / Exact Location *</label>
            <input
              style={inpStyle}
              placeholder="e.g. Taj Banjara, Road No. 1, Banjara Hills, Hyderabad"
              value={form.venueAddress || ''}
              onChange={e => set('venueAddress', e.target.value)}
            />
          </div>
        )}

        {/* Amount & Advance */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>Total Package Amount (₹)</label>
            <input type="number" style={inpStyle} placeholder="8000"
              value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Advance Required (₹)</label>
            <input type="number" style={inpStyle} placeholder="3200"
              value={form.advanceAmount} onChange={e => set('advanceAmount', e.target.value)} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={lbl}>Notes / Client Requirements</label>
          <textarea style={{ ...inpStyle, height: '60px', resize: 'vertical' }}
            placeholder="e.g. Skin allergies, preferred look, early morning slot"
            value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

      </div>
    </Modal>
  )
}

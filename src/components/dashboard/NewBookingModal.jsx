import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { useMaster } from '../../hooks/useMaster'
import { useAppointments } from '../../context/AppointmentContext'
import { useClients } from '../../context/ClientContext'
import { useSettings } from '../../hooks/useSettings'
import { useToast } from '../../context/ToastContext'
import { to12h } from '../../utils/timeFormat'
import { parseDurationMins, checkTimeAvailability } from '../../utils/slots'
import { useArtists, checkArtistAvailability } from '../../hooks/useArtists'
import { DashTimePicker } from '../ui/DashTimePicker'
import { DrumRollTimePicker } from '../ui/DrumRollTimePicker'
import { NominatimVenueSearch } from '../ui/NominatimVenueSearch'
import { VENUE_DEFAULTS } from '../../data/venues'
import { MultiArtistPicker } from '../ui/MultiArtistPicker'
import { CustomSelect } from '../ui/CustomSelect'
import { ClientCombobox } from '../ui/ClientCombobox'
import { Users, UserCheck } from 'lucide-react'
import { DatePicker } from '../ui/DatePicker'

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

function computeEndTime(time24h, mins) {
  if (!time24h || !mins) return ''
  const [h, m] = time24h.split(':').map(Number)
  const total = h * 60 + (m || 0) + mins
  const eh = Math.floor(total / 60) % 24
  const em = total % 60
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`
}

const EMPTY = {
  clientId: '', client: '', phone: '',
  serviceId: '', service: '', duration: '',
  personCount: 1,
  vendorId: '1',
  assignedArtists: {
    makeup: '',
    hair: '',
    draper: '',
  },
  selectedArtists: [],
  date: new Date().toISOString().split('T')[0],
  time: '', location: 'Studio', venue: '', venueAddress: '',
  amount: '', advanceAmount: '', vendorCost: '',
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
  const { clients, addClient }      = useClients()
  const { settings }                = useSettings()
  const { showToast }               = useToast()
  const artists                     = useArtists()
  const { items: allServices }      = useMaster('md_services', SVC_DEFAULTS)
  const { items: venues }           = useMaster('md_venues', VENUE_DEFAULTS)
  const services = allServices.filter(s => s.active !== false)

  const [form, setForm] = useState(() => ({
    ...EMPTY,
    ...(initialData || {}),
    date: initialData?.date || new Date().toISOString().split('T')[0],
  }))
  const [showSlots, setShowSlots] = useState(false)
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


  function handleClientSelect(e) {
    const val = e.target.value
    if (val === 'new') {
      setForm(f => ({ ...f, clientId: '', client: '', phone: '' }))
    } else {
      const c = clients.find(c => c.id === val)
      if (c) setForm(f => ({ ...f, clientId: c.id, client: c.name, phone: c.phone.replace(/^\+\d{1,3}/, '') }))
    }
  }

  function recalculateAmounts(serviceId, venueCategory, personCount = 1) {
    const svc = services.find(s => s.id === serviceId)
    const basePrice = svc ? (svc.basePrice || 0) : 0
    const v = venues.find(item => item.category === venueCategory)
    const venueDelta = v ? ((v.adjustment || 0) + (v.travelCharge || 0)) : 0
    const total = Math.max(0, (basePrice + venueDelta) * personCount)
    const advance = Math.round(total * ((settings.advancePct ?? 40) / 100))
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
    const calc = recalculateAmounts(form.serviceId, isVenue ? form.venue : '', form.personCount)
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
    const calc = recalculateAmounts(form.serviceId, venueCat, form.personCount)
    setForm(f => ({
      ...f,
      venue: venueCat,
      ...calc,
    }))
  }

  function handleSave() {
    if (!form.client.trim() || form.phone.replace(/\s/g, '').length !== 10) {
      alert('Please fill in client name and a valid 10-digit phone number.')
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
    const finalLocation = isVenue ? (form.venueAddress || 'On-Location') : `In-Studio (${settings.studioName || 'Studio'})`

    const selectedTeam = form.selectedArtists && form.selectedArtists.length > 0 ? form.selectedArtists : []
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
      status:             'Inquiry',
      personCount:        form.personCount || 1,
      totalDurationMins:  effectiveDurationMins,
      amount:             Number(form.amount) || 0,
      advanceAmount:      Number(form.advanceAmount) || 0,
      vendorCost:         Number(form.vendorCost) || 0,
      advancePaid:        false,
      balancePaid:        false,
      notes:              form.notes,
    })

    if (settings.leadAlerts) {
      showToast(`New lead: ${form.client} · ${form.service || 'General Makeup'}`, 'info')
    }

    setForm(EMPTY)
    onClose()
  }

  function handleClose() { setForm(EMPTY); onClose() }

  const isExistingClient       = !!form.clientId
  const vendorId               = form.vendorId ? Number(form.vendorId) : 1
  const durationMins           = parseDurationMins(form.duration)
  const effectiveDurationMins  = durationMins * (form.personCount || 1)
  const selectedArtistObjs     = artists.filter(a => (form.selectedArtists || []).includes(a.name))

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
        <ClientCombobox
          label="Client"
          value={form.clientId || 'new'}
          options={[
            { value: 'new', label: '+ New Client' },
            ...clients.map(c => ({ value: c.id, label: `${c.name} · ${c.phone.replace(/^\+\d{1,3}/, '')}` })),
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
              value={form.client} onChange={e => set('client', e.target.value.replace(/[^a-zA-Z\s.'`-]/g, ''))} />
          </div>
          <div>
            <label style={lbl}>Phone Number *</label>
            <input style={{ ...inpStyle, opacity: isExistingClient ? 0.6 : 1 }}
              placeholder="98765 43210"
              readOnly={isExistingClient}
              value={form.phone} onChange={e => set('phone', e.target.value.replace(/[^0-9 ]/g, '').slice(0, 15))} />
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
              const calc = recalculateAmounts(id, form.venue, form.personCount || 1)
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
          disabled={!form.serviceId}
          selected={form.selectedArtists || []}
          onChange={newSelected => {
            const primaryName = newSelected[0] || ''
            const primaryObj = artists.find(a => a.name === primaryName)
            const totalVendorCost = newSelected.reduce((sum, name) => {
              const a = artists.find(x => x.name === name)
              return sum + (a?.charges || 0)
            }, 0)
            setForm(f => ({
              ...f,
              selectedArtists: newSelected,
              vendorId: primaryObj ? String(primaryObj.id) : '1',
              vendorCost: totalVendorCost > 0 ? String(totalVendorCost) : f.vendorCost,
            }))
          }}
          artists={artists}
          date={form.date}
          time={form.time}
          appointments={appointments}
          durationMins={effectiveDurationMins}
        />

        {/* Number of Persons */}
        <div>
          <label style={lbl}>Number of Persons</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button type="button"
              onClick={() => {
                const n = Math.max(1, (form.personCount || 1) - 1)
                const calc = recalculateAmounts(form.serviceId, form.venue, n)
                setForm(f => ({ ...f, personCount: n, ...calc }))
              }}
              style={{
                width: 34, height: 34, borderRadius: '9px', border: '1.5px solid var(--dash-border)',
                background: 'var(--dash-card-bg)', cursor: 'pointer', fontSize: '18px', lineHeight: 1,
                color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>−</button>

            <span style={{
              minWidth: 28, textAlign: 'center', fontSize: '17px', fontWeight: 700,
              color: 'var(--dash-text-primary)', fontFamily: 'Playfair Display, serif',
            }}>
              {form.personCount || 1}
            </span>

            <button type="button"
              onClick={() => {
                const n = Math.min(10, (form.personCount || 1) + 1)
                const calc = recalculateAmounts(form.serviceId, form.venue, n)
                setForm(f => ({ ...f, personCount: n, ...calc }))
              }}
              style={{
                width: 34, height: 34, borderRadius: '9px', border: '1.5px solid var(--dash-border)',
                background: 'var(--dash-card-bg)', cursor: 'pointer', fontSize: '18px', lineHeight: 1,
                color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>+</button>

            {(form.personCount || 1) > 1 && form.duration && (
              <span style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)', fontStyle: 'italic' }}>
                {form.personCount} × {form.duration} ≈ {Math.round(effectiveDurationMins / 60 * 10) / 10}h total session
              </span>
            )}
          </div>
        </div>

        {/* Date */}
        <DatePicker
          label="Event Date"
          min={new Date().toISOString().split('T')[0]}
          value={form.date}
          onChange={val => { set('date', val); set('time', '') }}
        />

        {/* Time section */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={showSlots}
              onChange={e => setShowSlots(e.target.checked)}
              style={{ accentColor: '#c9956c', width: 15, height: 15, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--dash-label-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Show Available Slots
            </span>
          </label>

          {showSlots ? (
            <DashTimePicker
              value={form.time}
              onChange={v => set('time', v)}
              date={form.date}
              appointments={appointments}
              durationMins={effectiveDurationMins}
              vendorId={vendorId}
              artistObjs={selectedArtistObjs}
            />
          ) : (
            <div>
              <DrumRollTimePicker
                value={form.time}
                onChange={v => set('time', v)}
                theme="dash"
                date={form.date}
                appointments={appointments}
                durationMins={effectiveDurationMins}
                vendorId={vendorId}
                artistObjs={selectedArtistObjs}
              />
              {form.time && effectiveDurationMins > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--dash-text-muted)' }}>
                  Ends at: <strong style={{ color: 'var(--dash-text-primary)' }}>{to12h(computeEndTime(form.time, effectiveDurationMins))}</strong>
                </div>
              )}
            </div>
          )}
        </div>

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
            <NominatimVenueSearch
              value={form.venueAddress || ''}
              onChange={addr => set('venueAddress', addr)}
              onCategoryDetect={cat => handleVenueChange({ target: { value: cat } })}
              venues={venues}
              dark={false}
              placeholder="e.g. Taj Banjara, Banjara Hills, Hyderabad"
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

        {/* Vendor Cost & Profit — internal only */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>
              Vendor Cost (₹)
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 5, color: 'var(--dash-text-muted)', fontSize: 10 }}>
                internal
              </span>
            </label>
            <input
              type="number" style={inpStyle} placeholder="0"
              value={form.vendorCost}
              onChange={e => set('vendorCost', e.target.value)}
            />
          </div>
          <div>
            <label style={lbl}>Estimated Profit (₹)</label>
            {(() => {
              const profit = (Number(form.amount) || 0) - (Number(form.vendorCost) || 0)
              const hasValues = form.amount || form.vendorCost
              return (
                <div style={{
                  ...inpStyle,
                  display: 'flex', alignItems: 'center',
                  fontWeight: 700, fontSize: '14px',
                  color: !hasValues ? 'var(--dash-text-muted)'
                    : profit >= 0 ? 'var(--badge-confirmed)' : 'var(--badge-rejected)',
                  background: !hasValues ? 'var(--dash-input-bg)'
                    : profit >= 0 ? 'var(--badge-confirmed-bg)' : 'var(--badge-rejected-bg)',
                  border: `1.5px solid ${!hasValues ? 'var(--dash-border)'
                    : profit >= 0 ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)'}`,
                }}>
                  {hasValues ? `₹ ${profit.toLocaleString('en-IN')}` : '—'}
                </div>
              )
            })()}
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

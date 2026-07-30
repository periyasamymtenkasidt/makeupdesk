import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { useMaster } from '../../hooks/useMaster'
import { useAppointments } from '../../context/AppointmentContext'
import { APPOINTMENT_PIPELINE } from '../../data/navigation'
import { to24h, to12h } from '../../utils/timeFormat'
import { generateSlots, parseDurationMins } from '../../utils/slots'
import { useAvailability } from '../../context/AvailabilityContext'
import { useArtists, checkArtistAvailability } from '../../hooks/useArtists'
import { SlotPicker } from '../ui/SlotPicker'
import { VENUE_DEFAULTS } from '../../data/venues'
import { MultiArtistPicker } from '../ui/MultiArtistPicker'
import { CustomSelect } from '../ui/CustomSelect'
import { Users } from 'lucide-react'

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

const ALL_STAGES = [...APPOINTMENT_PIPELINE, 'Rejected']
const LOCKED_STATUSES = new Set(['Confirmed', 'Advance Paid', 'In Progress', 'Completed', 'Balance Paid', 'Closed'])

const inp = {
  width: '100%', padding: '9.5px 12px', borderRadius: '10px',
  border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
  marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em',
}

export default function EditAppointmentModal({ appt, onClose }) {
  const { appointments, updateAppointment } = useAppointments()
  const { availability }       = useAvailability()
  const artists                = useArtists()
  const { items: allServices } = useMaster('md_services', SVC_DEFAULTS)
  const { items: venues }      = useMaster('md_venues', VENUE_DEFAULTS)
  const services = allServices.filter(s => s.active !== false)

  const [form, setForm] = useState({})
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    if (!appt) return
    let initialSelected = ['Studio Artist']
    if (Array.isArray(appt.assignedArtists)) {
      initialSelected = appt.assignedArtists
    } else if (typeof appt.assignedArtists === 'object' && appt.assignedArtists) {
      initialSelected = Object.values(appt.assignedArtists).filter(Boolean)
    } else if (appt.artist) {
      initialSelected = [appt.artist.split('+')[0].trim()]
    }

    setForm({
      service:         appt.service       ?? '',
      date:            appt.date          ?? '',
      time:            to24h(appt.time),
      location:        appt.location      ?? 'Studio',
      venue:           appt.venue         ?? '',
      status:          appt.status        ?? 'Inquiry',
      amount:          String(appt.amount        ?? ''),
      advanceAmount:   String(appt.advanceAmount ?? ''),
      duration:        appt.duration      ?? '',
      notes:           appt.notes         ?? '',
      vendorId:        appt.vendorId      ?? '1',
      selectedArtists: initialSelected,
    })
  }, [appt])

  function recalculateAmounts(serviceIdentifier, venueCategory) {
    let basePrice = 0
    if (typeof serviceIdentifier === 'number') {
      const svc = services.find(s => s.id === serviceIdentifier)
      basePrice = svc ? (svc.basePrice || 0) : 0
    } else if (typeof serviceIdentifier === 'string' && serviceIdentifier) {
      const svc = services.find(s => s.name.toLowerCase().includes(serviceIdentifier.toLowerCase()))
      basePrice = svc ? (svc.basePrice || 0) : 0
    }
    const v = venues.find(item => item.category === venueCategory)
    const venueDelta = v ? ((v.adjustment || 0) + (v.travelCharge || 0)) : 0
    const total = basePrice ? Math.max(0, basePrice + venueDelta) : (Number(form.amount) || 0)
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
        service:       svc.name.split('—')[0].trim(),
        duration:      svc.duration || '',
        ...calc,
      }))
    }
  }

  function handleVenueChange(e) {
    const venueCat = e.target.value
    const calc = recalculateAmounts(form.service, venueCat)
    setForm(f => ({
      ...f,
      venue: venueCat,
      ...calc,
    }))
  }

  function handleSave() {
    if (!appt) return

    const selectedTeam = form.selectedArtists && form.selectedArtists.length > 0 ? form.selectedArtists : ['Studio Artist']
    const combinedArtistStr = selectedTeam.join(', ')

    updateAppointment(appt.id, {
      service:         form.service,
      date:            form.date,
      time:            to12h(form.time),
      location:        form.location,
      venue:           form.venue,
      status:          form.status,
      amount:          Number(form.amount)        || 0,
      advanceAmount:   Number(form.advanceAmount) || 0,
      duration:        form.duration,
      notes:           form.notes,
      vendorId:        form.vendorId ? Number(form.vendorId) : 1,
      artist:          combinedArtistStr,
      assignedArtists: selectedTeam,
    })
    onClose()
  }

  const timeLocked     = appt && LOCKED_STATUSES.has(appt.status)
  const vendorId       = form.vendorId ? Number(form.vendorId) : 1
  const dateForSlots   = form.date || appt?.date || ''
  const durationMins   = parseDurationMins(form.duration || appt?.duration || '')
  const slots          = dateForSlots ? generateSlots(dateForSlots, availability, appointments, durationMins, appt?.id, vendorId) : []
  const dayOfWeek      = dateForSlots ? new Date(dateForSlots + 'T00:00:00').getDay() : -1
  const offDay         = dateForSlots ? !availability.workDays.includes(dayOfWeek) : false

  return (
    <Modal open={!!appt} onClose={onClose} title={`Edit Booking — ${appt?.name || ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Client Info Header */}
        <div style={{
          padding: '10px 14px', borderRadius: '10px', background: 'var(--dash-subtle-row-bg)',
          border: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: 'var(--dash-text-primary)' }}>{appt?.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--dash-text-secondary)' }}>{appt?.phone} · #{appt?.id}</div>
          </div>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
            background: 'var(--dash-border)', color: 'var(--dash-text-primary)'
          }}>
            {appt?.status}
          </span>
        </div>

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
          date={form.date || appt?.date}
          time={form.time || appt?.time}
          appointments={appointments}
          currentApptId={appt?.id}
        />

        {/* Date */}
        <div>
          <label style={lbl}>Event Date</label>
          <input type="date" min={new Date().toISOString().split('T')[0]} style={inp} value={form.date ?? ''} onChange={e => set('date', e.target.value)} />
        </div>

        {/* Service Package */}
        <CustomSelect
          label="Service Package"
          value=""
          placeholder={`— Change service (current: ${form.service}) —`}
          options={services.map(s => ({ value: s.id, label: s.name }))}
          onChange={val => handleServiceChange({ target: { value: val } })}
        />
        {form.service && (
          <div style={{ fontSize: '11px', color: 'var(--icon-booking)', marginTop: '-8px', fontWeight: 500 }}>
            Current: {form.service} {form.duration && `· ${form.duration}`}
          </div>
        )}

        {/* Time Slot */}
        <div>
          <label style={lbl}>Time Slot</label>
          {timeLocked ? (
            <>
              <div style={{ ...inp, opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center' }}>
                {appt?.time || '—'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--badge-pending)', marginTop: '4px', fontWeight: 500 }}>
                Locked — appointment is {appt?.status}.
              </div>
            </>
          ) : (
            <SlotPicker
              slots={slots} value={form.time ?? ''}
              onChange={v => set('time', v)}
              offDay={offDay} date={dateForSlots}
              variant="dash"
            />
          )}
        </div>

        {/* Location + Venue Category */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <CustomSelect
            label="Location"
            value={form.location ?? 'Studio'}
            options={[
              { value: 'Studio', label: 'Studio Appointment' },
              { value: 'Venue', label: 'On-Location / Venue' },
            ]}
            onChange={val => set('location', val)}
          />

          <CustomSelect
            label="Venue"
            value={form.venue ?? ''}
            placeholder="— Select Venue —"
            options={venues.map(v => {
              const delta = (v.adjustment || 0) + (v.travelCharge || 0)
              const deltaLabel = delta > 0 ? ` (+₹${delta.toLocaleString()})` : delta < 0 ? ` (-₹${Math.abs(delta).toLocaleString()})` : ''
              return {
                value: v.category,
                label: `${v.badge || '🏨'} ${v.category}${deltaLabel}`,
              }
            })}
            onChange={val => handleVenueChange({ target: { value: val } })}
          />
        </div>

        {/* Stage */}
        <CustomSelect
          label="Stage"
          value={form.status ?? 'Inquiry'}
          options={ALL_STAGES.map(s => ({ value: s, label: s }))}
          onChange={val => set('status', val)}
        />

        {/* Amounts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>Total Amount (₹)</label>
            <input type="number" style={inp} value={form.amount ?? ''} onChange={e => set('amount', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Advance Amount (₹)</label>
            <input type="number" style={inp} value={form.advanceAmount ?? ''} onChange={e => set('advanceAmount', e.target.value)} />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={lbl}>Notes</label>
          <input style={inp} placeholder="Any special requirements or remarks…"
            value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} />
        </div>

      </div>
    </Modal>
  )
}

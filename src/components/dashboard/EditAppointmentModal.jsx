import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { useMaster } from '../../hooks/useMaster'
import { useAppointments } from '../../context/AppointmentContext'
import { APPOINTMENT_PIPELINE } from '../../data/navigation'
import { to24h, to12h } from '../../utils/timeFormat'
import { formatDateInput } from '../../utils/formatDate'
import { parseDurationMins } from '../../utils/slots'
import { useArtists, checkArtistAvailability } from '../../hooks/useArtists'
import { useSettings } from '../../hooks/useSettings'
import { DashTimePicker } from '../ui/DashTimePicker'
import { DrumRollTimePicker } from '../ui/DrumRollTimePicker'
import { VENUE_DEFAULTS } from '../../data/venues'
import { MultiArtistPicker } from '../ui/MultiArtistPicker'
import { CustomSelect } from '../ui/CustomSelect'
import { NominatimVenueSearch } from '../ui/NominatimVenueSearch'
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

function buildForm(appt) {
  let initialSelected = []
  if (Array.isArray(appt.assignedArtists) && appt.assignedArtists.length > 0) {
    initialSelected = appt.assignedArtists
  } else if (typeof appt.assignedArtists === 'object' && appt.assignedArtists && !Array.isArray(appt.assignedArtists)) {
    initialSelected = Object.values(appt.assignedArtists).filter(Boolean)
  } else if (appt.artist && appt.artist !== 'Any Available') {
    initialSelected = [appt.artist.split('+')[0].trim()]
  }
  const locType = (appt.venue && appt.venue.trim())
    || appt.locationType === 'Venue'
    || appt.location === 'Venue'
    || appt.location === 'On-Location'
      ? 'Venue' : 'Studio'
  return {
    clientId:        appt.clientId      ?? '',
    name:            appt.name          ?? '',
    phone:           appt.phone         ?? '',
    service:         appt.service       ?? '',
    date:            formatDateInput(appt.date),
    time:            to24h(appt.time),
    location:        locType,
    venue:           appt.venue         ?? '',
    venueAddress:    appt.venueAddress  ?? '',
    status:          appt.status        ?? 'Inquiry',
    amount:          String(appt.amount        ?? ''),
    advanceAmount:   String(appt.advanceAmount ?? ''),
    vendorCost:      String(appt.vendorCost    ?? ''),
    duration:        appt.duration      ?? '',
    notes:           appt.notes         ?? '',
    vendorId:        appt.vendorId      ?? '1',
    selectedArtists: initialSelected,
  }
}

function computeEndTime(time24h, mins) {
  if (!time24h || !mins) return ''
  const [h, m] = time24h.split(':').map(Number)
  const total = h * 60 + (m || 0) + mins
  const eh = Math.floor(total / 60) % 24
  const em = total % 60
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`
}

export default function EditAppointmentModal({ appt, onClose }) {
  const { appointments, updateAppointment } = useAppointments()
  const artists                = useArtists()
  const { settings }           = useSettings()
  const { items: allServices } = useMaster('md_services', SVC_DEFAULTS)
  const { items: venues }      = useMaster('md_venues', VENUE_DEFAULTS)
  const services = allServices.filter(s => s.active !== false)

  const [form, setForm] = useState(() => buildForm(appt))
  const [showSlots, setShowSlots] = useState(false)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

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
    if (form.phone && form.phone.replace(/\s/g, '').length !== 10) {
      alert('Phone number must be exactly 10 digits.')
      return
    }
    if (
      (form.status === 'Rejected' || form.status === 'Closed') &&
      form.status !== appt.status
    ) {
      const label = form.status === 'Rejected' ? 'reject' : 'close'
      if (!window.confirm(`Are you sure you want to ${label} this appointment for ${appt.name}? This cannot be easily undone.`))
        return
    }

    const selectedTeam = form.selectedArtists && form.selectedArtists.length > 0 ? form.selectedArtists : []
    const combinedArtistStr = selectedTeam.join(', ')

    updateAppointment(appt.id, {
      name:            form.name,
      phone:           form.phone,
      service:         form.service,
      date:            form.date,
      time:            to12h(form.time),
      location:        form.location,
      venue:           form.venue,
      venueAddress:    form.location === 'Venue' ? (form.venueAddress ?? '') : '',
      status:          form.status,
      amount:          Number(form.amount)        || 0,
      advanceAmount:   Number(form.advanceAmount) || 0,
      vendorCost:      Number(form.vendorCost)    || 0,
      duration:        form.duration,
      notes:           form.notes,
      vendorId:        form.vendorId ? Number(form.vendorId) : 1,
      artist:          combinedArtistStr,
      assignedArtists: selectedTeam,
    })
    onClose()
  }

  const timeLocked         = appt && LOCKED_STATUSES.has(appt.status)
  const vendorId           = form.vendorId ? Number(form.vendorId) : 1
  const dateForSlots       = form.date || appt?.date || ''
  const durationMins       = parseDurationMins(form.duration || appt?.duration || '')
  const selectedArtistObjs = artists.filter(a => (form.selectedArtists || []).includes(a.name))

  return (
    <Modal open={!!appt} onClose={onClose} onSave={handleSave} saveLabel="Save Changes" title={`Edit Booking — ${appt?.name || ''}`}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Appointment ID + Status */}
        <div style={{
          padding: '8px 12px', borderRadius: '10px', background: 'var(--dash-subtle-row-bg)',
          border: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--dash-text-muted)', fontWeight: 600 }}>
            #{appt?.id}
          </span>
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
            background: 'var(--dash-border)', color: 'var(--dash-text-primary)',
          }}>
            {appt?.status}
          </span>
        </div>

        {/* Client Name + Phone */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>Client Name</label>
            <input
              style={inp}
              placeholder="e.g. Ananya Roy"
              value={form.name ?? ''}
              onChange={e => set('name', e.target.value.replace(/[^a-zA-Z\s.'`-]/g, ''))}
            />
          </div>
          <div>
            <label style={lbl}>Phone Number</label>
            <input
              style={inp}
              placeholder="98765 43210"
              value={form.phone ?? ''}
              onChange={e => set('phone', e.target.value.replace(/[^0-9 ]/g, '').slice(0, 15))}
            />
          </div>
        </div>

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

        {/* Client Requested Team — from booking form */}
        {appt?.addOns?.length > 0 && (
          <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'var(--dash-subtle-row-bg)', border: '1px solid var(--dash-border)' }}>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Client Requested Team
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {appt.addOns.map(role => {
                const isFilled = (form.selectedArtists || []).some(name => {
                  const a = artists.find(x => x.name === name)
                  return a?.category === role
                })
                return (
                  <span key={role} style={{
                    fontSize: '11.5px', fontWeight: 600, padding: '3px 10px', borderRadius: '9999px',
                    background: isFilled ? 'var(--badge-confirmed-bg)' : 'var(--badge-pending-bg)',
                    color: isFilled ? 'var(--badge-confirmed)' : 'var(--badge-pending)',
                    border: `1px solid ${isFilled ? 'rgba(5,150,105,0.2)' : 'rgba(245,158,11,0.2)'}`,
                  }}>
                    {isFilled ? '✓' : '!'} {role}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        {/* Single Multi-Select Category-Grouped Artist Picker */}
        <MultiArtistPicker
          disabled={!form.service}
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
          date={form.date || appt?.date}
          time={form.time || appt?.time}
          appointments={appointments}
          currentApptId={appt?.id}
          durationMins={durationMins}
        />

        {/* Time Slot */}
        <div>
          {timeLocked ? (
            <>
              <label style={lbl}>Time Slot</label>
              <div style={{ ...inp, opacity: 0.6, cursor: 'not-allowed', display: 'flex', alignItems: 'center' }}>
                {appt?.time || '—'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--badge-pending)', marginTop: '4px', fontWeight: 500 }}>
                Locked — appointment is {appt?.status}.
              </div>
            </>
          ) : (
            <>
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
                  value={form.time ?? ''}
                  onChange={v => set('time', v)}
                  date={dateForSlots}
                  appointments={appointments}
                  durationMins={durationMins}
                  vendorId={vendorId}
                  excludeId={appt?.id}
                  artistObjs={selectedArtistObjs}
                />
              ) : (
                <div>
                  <DrumRollTimePicker
                    value={form.time ?? ''}
                    onChange={v => set('time', v)}
                    theme="dash"
                    date={dateForSlots}
                    appointments={appointments}
                    durationMins={durationMins}
                    vendorId={vendorId}
                    artistObjs={selectedArtistObjs}
                  />
                  {form.time && durationMins > 0 && (
                    <div style={{ marginTop: 8, fontSize: 12, color: 'var(--dash-text-muted)' }}>
                      Ends at: <strong style={{ color: 'var(--dash-text-primary)' }}>{to12h(computeEndTime(form.time, durationMins))}</strong>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Location */}
        <CustomSelect
          label="Location"
          value={form.location ?? 'Studio'}
          options={[
            { value: 'Studio', label: 'Studio Appointment' },
            { value: 'Venue', label: 'On-Location / Venue' },
          ]}
          onChange={val => {
            set('location', val)
            if (val === 'Studio') setForm(f => ({ ...f, location: 'Studio', venue: '', venueAddress: '' }))
          }}
        />

        {/* Venue Category + Address — only for on-location appointments */}
        {form.location === 'Venue' && (
          <>
            <CustomSelect
              label="Venue Category"
              value={form.venue ?? ''}
              placeholder="— Select Venue Category —"
              options={venues.map(v => ({
                value: v.category,
                label: `${v.badge || '🏨'} ${v.category}`,
              }))}
              onChange={val => handleVenueChange({ target: { value: val } })}
            />

            <div>
              <label style={lbl}>Venue Address / Exact Location</label>
              <NominatimVenueSearch
                value={form.venueAddress || ''}
                onChange={addr => set('venueAddress', addr)}
                onCategoryDetect={cat => handleVenueChange({ target: { value: cat } })}
                venues={venues}
                dark={false}
                placeholder="e.g. Taj Banjara, Banjara Hills, Hyderabad"
              />
            </div>
          </>
        )}

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

        {/* Vendor Cost & Profit — internal */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={lbl}>
              Vendor Cost (₹)
              <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, marginLeft: 5, color: 'var(--dash-text-muted)', fontSize: 10 }}>
                internal
              </span>
            </label>
            <input type="number" style={inp} placeholder="0"
              value={form.vendorCost ?? ''} onChange={e => set('vendorCost', e.target.value)} />
          </div>
          <div>
            <label style={lbl}>Estimated Profit (₹)</label>
            {(() => {
              const profit = (Number(form.amount) || 0) - (Number(form.vendorCost) || 0)
              const hasValues = form.amount || form.vendorCost
              return (
                <div style={{
                  ...inp,
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
          <label style={lbl}>Notes</label>
          <input style={inp} placeholder="Any special requirements or remarks…"
            value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} />
        </div>

      </div>
    </Modal>
  )
}

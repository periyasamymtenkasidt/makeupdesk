import { useState, useEffect } from "react"
import { X, Calendar, User, Phone, MapPin, CheckCircle, Sparkles } from "lucide-react"
import { useBookingForm } from "../../hooks/useBookingForm"
import { useAppointments } from "../../context/AppointmentContext"
import { useClients } from "../../context/ClientContext"
import { chatOnWhatsApp } from "../../utils/whatsapp"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"
import { SERVICES, SERVICE_NAMES, SERVICE_DURATIONS } from "../../data/services"
import { to12h } from "../../utils/timeFormat"
import { generateSlots, parseDurationMins } from "../../utils/slots"
import { useAvailability } from "../../context/AvailabilityContext"
import { BOOKING_STAFF_CATEGORIES } from "../../hooks/useArtists"
import { useMaster } from "../../hooks/useMaster"
import { VENUE_DEFAULTS } from "../../data/venues"
import { SlotPicker } from "../ui/SlotPicker"
import { CustomSelect } from "../ui/CustomSelect"

function formatDateForStorage(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  })
}

function minsToLabel(mins) {
  const hrs = mins / 60
  return `${hrs} hrs`
}

// ── styles ────────────────────────────────────────────────────────────────────
const inpStyle = {
  width: "100%", padding: "10px 14px", borderRadius: "12px",
  border: "1.5px solid rgba(201,149,108,0.25)", fontSize: "14px",
  color: "rgba(255,255,255,0.9)", background: "rgba(255,255,255,0.07)", fontFamily: "Inter,sans-serif",
  outline: "none", boxSizing: "border-box",
}
const lblStyle = {
  display: "block", fontSize: "11px", fontWeight: 600,
  textTransform: "uppercase", letterSpacing: "0.08em",
  color: "rgba(255,255,255,0.45)", marginBottom: "6px",
}

// ── modal ─────────────────────────────────────────────────────────────────────
function BookingModal({ onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const { step, form, setField, nextStep, prevStep, reset, step1Valid, step1Touched, step2Valid } = useBookingForm()
  const { appointments, addAppointment, genId } = useAppointments()
  const { availability }       = useAvailability()
  const { clients, addClient } = useClients()
  const { items: venues }      = useMaster('md_venues', VENUE_DEFAULTS)
  const [confirmed, setConfirmed] = useState(null)

  const ARTIST_EMOJI = {
    'Makeup Artist':           '💄',
    'Hair Stylist':            '💇',
    'Saree Draper':            '🥻',
    'Assistant Makeup Artist': '🪞',
    'Mehendi Artist':          '🌿',
  }

  const artistPreferenceOptions = [
    { value: 'Any Available', label: '✨ Any Available' },
    ...BOOKING_STAFF_CATEGORIES.map(cat => ({
      value: cat,
      label: `${ARTIST_EMOJI[cat] || '🎨'} ${cat}`,
    })),
  ]

  const durationMins    = SERVICE_DURATIONS[form.service] ?? parseDurationMins(null)
  const servicePriceRaw = SERVICES.find(s => s.title === form.service)?.priceRaw ?? 0

  const selectedVenueObj = venues.find(v => v.category === form.venue)
  const venueExtra       = selectedVenueObj ? ((selectedVenueObj.adjustment || 0) + (selectedVenueObj.travelCharge || 0)) : 0
  const totalAmount      = Math.max(0, servicePriceRaw + venueExtra)

  const slots     = form.date ? generateSlots(form.date, availability, appointments, durationMins, null, null) : []
  const dayOfWeek = form.date ? new Date(form.date + 'T00:00:00').getDay() : -1
  const offDay    = form.date ? !availability.workDays.includes(dayOfWeek) : false

  function handleRegister() {
    if (!step2Valid) return

    const existing = clients.find(c => c.phone === form.phone)
    const clientId = existing ? existing.id : addClient({ name: form.name, phone: form.phone })

    const artistPreference = form.artistPreference || 'Any Available'
    const isVenue = form.locationType === 'Venue'
    const finalAmount = isVenue ? totalAmount : servicePriceRaw
    const finalLocation = isVenue ? (form.venueAddress || 'On-Location') : 'In-Studio (Sofdoesmakeup Studio)'

    const appt = {
      id:              genId(),
      clientId,
      name:            form.name,
      phone:           form.phone,
      service:         form.service,
      vendorId:        1,
      artist:          artistPreference,
      assignedArtists: [],
      date:            formatDateForStorage(form.date),
      time:            to12h(form.time),
      duration:        minsToLabel(durationMins),
      location:        finalLocation,
      venue:           isVenue ? form.venue : '',
      locationType:    form.locationType || 'Studio',
      venueAddress:    isVenue ? form.venueAddress : '',
      status:          "Inquiry",
      amount:          finalAmount,
      advanceAmount:   Math.round(finalAmount * 0.4),
      advancePaid:     false,
      balancePaid:     false,
      notes:           form.notes,
    }

    addAppointment(appt)
    setConfirmed(appt)
    reset()
  }

  function handleClose() { reset(); setConfirmed(null); onClose() }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(26,15,27,0.72)", backdropFilter: "blur(10px)" }}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "#1a0f1b", maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* ── success screen ── */}
        {confirmed ? (
          <div style={{ padding: "48px 40px", textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", margin: "0 auto 20px",
              background: "linear-gradient(135deg,#c9956c,#d4728f)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 12px 28px rgba(201,149,108,0.4)",
            }}>
              <CheckCircle size={36} color="#fff" />
            </div>

            <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "22px", fontWeight: 700, color: "#f5e1c0", marginBottom: "8px" }}>
              Slot Request Submitted!
            </h3>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", marginBottom: "24px" }}>
              Thank you, <strong style={{ color: "#f5e1c0" }}>{confirmed.name}</strong>. We've received your booking request for <strong style={{ color: "#f5e1c0" }}>{confirmed.service}</strong> on <strong style={{ color: "#f5e1c0" }}>{confirmed.date}</strong> at <strong style={{ color: "#f5e1c0" }}>{confirmed.time}</strong>.
            </p>

            <div style={{ background: "rgba(201,149,108,0.08)", borderRadius: "16px", padding: "16px 20px", marginBottom: "24px", border: "1px solid rgba(201,149,108,0.2)", textAlign: "center", fontSize: "13px" }}>
              <p style={{ color: "rgba(255,255,255,0.55)", margin: "0 0 6px", lineHeight: 1.6 }}>
                Your personalised quote will be sent to your WhatsApp within <strong style={{ color: "#e8c4a0" }}>2 hours</strong>.
              </p>
              <p style={{ color: "rgba(255,255,255,0.35)", margin: 0, fontSize: "12px" }}>
                Artist Preference — <span style={{ color: "#f5e1c0", fontWeight: 600 }}>{confirmed.artist}</span>
              </p>
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={handleClose}>
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* ── header ── */}
            <div style={{ background: "linear-gradient(135deg,#2d1b2e,#1a0f1b)", padding: "24px 28px", color: "#fff", position: "relative" }}>
              <button onClick={handleClose}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}>
                <X size={16} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#e8c4a0", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                <Sparkles size={13} /> Exclusive Studio Appointment
              </div>
              <h3 style={{ fontFamily: "Playfair Display, serif", fontSize: "20px", fontWeight: 700, margin: 0 }}>
                Reserve Your Glam Session
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: "4px 0 0" }}>
                Step {step} of 2 — {step === 1 ? "Your Details & Preferences" : "Date, Slot & Location"}
              </p>

              {/* step indicator */}
              <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
                <div style={{ flex: 1, height: "3px", borderRadius: "2px",
                             background: step >= 1 ? "#c9956c" : "rgba(255,255,255,0.2)" }} />
                <div style={{ flex: 1, height: "3px", borderRadius: "2px",
                             background: step === 2 ? "#c9956c" : "rgba(255,255,255,0.2)" }} />
              </div>
            </div>

            {/* ── body ── */}
            <div className="p-8 space-y-4">
              {step === 1 ? (
                <>
                  <div>
                    <Input label="Full Name *" icon={User} placeholder="e.g. Priya Sharma"
                           value={form.name} onChange={e => setField("name", e.target.value)} />
                    {step1Touched && !form.name.trim() && (
                      <p style={{ fontSize: "11.5px", color: "#e8748a", marginTop: "4px", marginLeft: "2px" }}>
                        Please enter your full name.
                      </p>
                    )}
                  </div>
                  <div>
                    <Input label="WhatsApp Number *" icon={Phone} placeholder="+91 98765 43210"
                           value={form.phone} onChange={e => setField("phone", e.target.value)} />
                    {step1Touched && !form.phone.trim() && (
                      <p style={{ fontSize: "11.5px", color: "#e8748a", marginTop: "4px", marginLeft: "2px" }}>
                        Please enter your WhatsApp number.
                      </p>
                    )}
                  </div>
                  <div>
                    <CustomSelect
                      label="Service Package *"
                      value={form.service}
                      placeholder="Select a service package…"
                      options={SERVICE_NAMES}
                      onChange={val => setField("service", val)}
                    />
                    {step1Touched && !form.service && (
                      <p style={{ fontSize: "11.5px", color: "#e8748a", marginTop: "4px", marginLeft: "2px" }}>
                        Please select a service package.
                      </p>
                    )}
                  </div>
                  <CustomSelect
                    label="Artist Preference"
                    value={form.artistPreference || 'Any Available'}
                    options={artistPreferenceOptions}
                    onChange={val => setField("artistPreference", val)}
                  />
                  <Button
                    variant="primary" size="lg" fullWidth onClick={nextStep}
                    style={{
                      marginTop: "8px",
                      opacity: step1Valid ? 1 : 0.55,
                      cursor: step1Valid ? "pointer" : "not-allowed",
                    }}
                  >
                    Next Step →
                  </Button>
                </>
              ) : (
                <>
                  {/* Date */}
                  <Input label="Event Date *" icon={Calendar} type="date"
                         min={new Date().toISOString().split('T')[0]}
                         value={form.date}
                         onChange={e => setField("date", e.target.value)} />

                  {/* Slot picker */}
                  {form.date && (
                    <SlotPicker
                      slots={slots} value={form.time}
                      onChange={v => setField("time", v)}
                      offDay={offDay} date={form.date}
                      variant="landing"
                    />
                  )}

                  {/* Appointment Location Type */}
                  <CustomSelect
                    label="Appointment Location *"
                    value={form.locationType || 'Studio'}
                    options={[
                      { value: 'Studio', label: '🏠 In-Studio (Sofdoesmakeup Studio)' },
                      { value: 'Venue', label: '📍 On-Location / Client Venue' },
                    ]}
                    onChange={val => {
                      setField("locationType", val)
                      if (val === 'Studio') {
                        setField("venue", "")
                        setField("venueAddress", "")
                      }
                    }}
                  />

                  {/* Conditional Venue Category & Address Fields */}
                  {form.locationType === 'Venue' ? (
                    <>
                      <CustomSelect
                        label="Venue Category"
                        value={form.venue}
                        placeholder="Select venue type…"
                        options={venues.map(v => {
                          return {
                            value: v.category,
                            label: `${v.badge || '🏨'} ${v.category}`,
                          }
                        })}
                        onChange={val => setField("venue", val)}
                      />

                      <Input
                        label="Exact Venue Address / Landmark *"
                        icon={MapPin}
                        placeholder="e.g. Taj Banjara, Ballroom A, Banjara Hills"
                        value={form.venueAddress || ''}
                        onChange={e => setField("venueAddress", e.target.value)}
                      />
                    </>
                  ) : (
                    <div style={{
                      background: 'rgba(201,149,108,0.1)',
                      border: '1px solid rgba(201,149,108,0.25)',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '12.5px',
                      color: 'rgba(255,255,255,0.55)',
                    }}>
                      <MapPin size={13} style={{ display: 'inline', marginRight: '6px', color: '#c9956c' }} />
                      <strong style={{ color: '#e8c4a0' }}>Studio Address:</strong> Sofdoesmakeup Studio, Road No. 36, Chennai.
                    </div>
                  )}

                  {/* Notes */}
                  <div>
                    <label style={lblStyle}>Additional Notes</label>
                    <textarea
                      placeholder="Skin type, theme, reference images, etc."
                      value={form.notes} onChange={e => setField("notes", e.target.value)}
                      style={{ ...inpStyle, resize: "vertical", minHeight: "72px" }}
                    />
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button variant="ghost" size="lg" onClick={prevStep}
                            style={{ flex: 1, justifyContent: "center", background: "rgba(255,255,255,0.08)", color: "#ffffff", border: "1.5px solid rgba(255,255,255,0.2)" }}>
                      ← Back
                    </Button>
                    <Button variant="primary" size="lg" onClick={handleRegister}
                            style={{ flex: 1, justifyContent: "center", opacity: step2Valid ? 1 : 0.45 }}>
                      Register Slot
                    </Button>
                  </div>

                  <p style={{ textAlign: "center", fontSize: "11.5px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>
                    We'll send you a quote &amp; payment details on WhatsApp.
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── section ───────────────────────────────────────────────────────────────────
export default function BookingCTA() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <section id="book" className="py-32 relative overflow-hidden"
               style={{ background: "linear-gradient(180deg,#0e0710 0%,#1a0f1b 40%,#2d1b2e 100%)" }}>
        <div className="absolute inset-0 hero-dots" style={{ opacity: 0.05 }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
             style={{ background: "radial-gradient(ellipse,rgba(201,149,108,0.18) 0%,transparent 65%)", filter: "blur(60px)" }} />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full pointer-events-none"
             style={{ background: "radial-gradient(circle,rgba(232,164,184,0.15) 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full pointer-events-none"
             style={{ background: "radial-gradient(circle,rgba(201,149,108,0.12) 0%,transparent 70%)", filter: "blur(80px)" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
               style={{ background: "rgba(201,149,108,0.1)", border: "1px solid rgba(201,149,108,0.3)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#c9956c" }} />
            <span style={{ color: "#f5e1c0", fontSize: "11px", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Ready to Glow?
            </span>
          </div>

          <h2 className="font-display text-white"
              style={{ fontSize: "clamp(40px,7vw,80px)", fontWeight: 800, lineHeight: 1.06 }}>
            Book Your Dream
            <br />
            <span className="gradient-text italic">Makeup Look</span>
          </h2>

          <p className="mt-6 max-w-xl mx-auto text-base leading-relaxed"
             style={{ color: "rgba(255,255,255,0.55)" }}>
            Slots fill up fast — especially for weekends &amp; wedding seasons.
            Reserve yours today and get an instant quotation on WhatsApp.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="dark" size="lg" onClick={() => setOpen(true)}>
              Book Appointment
            </Button>
            <Button
              variant="darkOutline"
              size="lg"
              as="a"
              href={chatOnWhatsApp()}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                color: "#ffffff",
                border: "1.5px solid rgba(255, 255, 255, 0.28)",
                fontWeight: 600,
              }}
            >
              Chat on WhatsApp
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {["✓ Instant WhatsApp Quotation", "✓ UPI Advance Payment", "✓ Doorstep Service"].map(b => (
              <span key={b} className="px-4 py-2 rounded-full text-sm"
                    style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {open && <BookingModal onClose={() => setOpen(false)} />}
    </>
  )
}

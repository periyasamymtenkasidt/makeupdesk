import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Building2, Users, Clock } from 'lucide-react'
import { useAvailability } from '../../../context/AvailabilityContext'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'

const DAYS = [
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
]

const INTERVALS = [15, 30, 45, 60]

const inp = {
  padding: '9.5px 12px', borderRadius: '10px',
  border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}
const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
  marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em',
}
const section = {
  display: 'flex', flexDirection: 'column', gap: '6px',
  paddingBottom: '20px', borderBottom: '1px solid var(--dash-border)',
}

export default function Availability() {
  const { availability, updateAvailability } = useAvailability()
  const [form, setForm]   = useState({ ...availability })
  const [saved, setSaved] = useState(false)

  function toggleDay(d) {
    setForm(f => ({
      ...f,
      workDays: f.workDays.includes(d)
        ? f.workDays.filter(x => x !== d)
        : [...f.workDays, d].sort((a, b) => a - b),
    }))
    setSaved(false)
  }

  function handleSave() {
    updateAvailability(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Master Tab Nav */}
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
          borderBottom: '1.5px solid var(--dash-border)',
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
            paddingBottom: '12px', fontSize: '14px', fontWeight: 700,
            color: 'var(--icon-booking)', borderBottom: '2.5px solid var(--icon-booking)',
            textDecoration: 'none', fontFamily: 'Inter, sans-serif',
          }}>
            <Clock size={15} style={{ color: 'var(--icon-booking)' }} /> Availability Master
          </Link>
        </div>
      </div>

      <Card style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Working days */}
        <div style={section}>
          <label style={lbl}>Working Days</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {DAYS.map(d => {
              const active = form.workDays.includes(d.value)
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  style={{
                    padding: '8px 16px', borderRadius: '9999px', fontSize: '13px',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    border: active ? '1.5px solid transparent' : '1.5px solid var(--dash-border)',
                    background: active ? 'linear-gradient(135deg,#c9956c,#d4728f)' : 'var(--dash-surface)',
                    color: active ? 'white' : 'var(--dash-text-secondary)',
                    boxShadow: active ? '0 2px 8px rgba(201,149,108,0.35)' : 'none',
                  }}
                >
                  {d.label}
                </button>
              )
            })}
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--dash-text-muted)' }}>
            Clients can only book on selected days. Off days show "Artist unavailable."
          </p>
        </div>

        {/* Working hours */}
        <div style={section}>
          <label style={lbl}>Working Hours</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '360px' }}>
            <div>
              <label style={{ ...lbl, marginBottom: '4px' }}>Start Time</label>
              <input
                type="time"
                style={{ ...inp, width: '100%' }}
                value={form.startTime}
                onChange={e => { setForm(f => ({ ...f, startTime: e.target.value })); setSaved(false) }}
              />
            </div>
            <div>
              <label style={{ ...lbl, marginBottom: '4px' }}>End Time</label>
              <input
                type="time"
                style={{ ...inp, width: '100%' }}
                value={form.endTime}
                onChange={e => { setForm(f => ({ ...f, endTime: e.target.value })); setSaved(false) }}
              />
            </div>
          </div>
        </div>

        {/* Slot interval */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={lbl}>Slot Interval</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {INTERVALS.map(i => {
              const active = form.slotInterval === i
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => { setForm(f => ({ ...f, slotInterval: i })); setSaved(false) }}
                  style={{
                    padding: '8px 20px', borderRadius: '9999px', fontSize: '13px',
                    fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                    fontFamily: 'Inter, sans-serif',
                    border: active ? '1.5px solid transparent' : '1.5px solid var(--dash-border)',
                    background: active ? 'linear-gradient(135deg,#c9956c,#d4728f)' : 'var(--dash-surface)',
                    color: active ? 'white' : 'var(--dash-text-secondary)',
                    boxShadow: active ? '0 2px 8px rgba(201,149,108,0.35)' : 'none',
                  }}
                >
                  {i} min
                </button>
              )
            })}
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--dash-text-muted)' }}>
            Each booking slot shown to clients is this many minutes apart.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Button variant="primary" size="sm" onClick={handleSave}>
            Save Availability
          </Button>
          {saved && (
            <span style={{ fontSize: '13px', color: '#059669', fontWeight: 500 }}>
              ✓ Saved
            </span>
          )}
        </div>
      </Card>
    </div>
  )
}

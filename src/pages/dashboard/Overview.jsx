import { useState, useEffect } from 'react'
import { earliestBookableMins } from '../../utils/slots'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, TrendingUp, Clock, ChevronRight, Plus } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import TodayTimeline from '../../components/dashboard/TodayTimeline'
import FinancialSummary from '../../components/dashboard/FinancialSummary'
import SkinAlertsWidget from '../../components/dashboard/SkinAlertsWidget'
import WeekCalendar from '../../components/dashboard/WeekCalendar'
import NewBookingModal from '../../components/dashboard/NewBookingModal'
import RecordPaymentModal from '../../components/dashboard/RecordPaymentModal'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { APPOINTMENT_PIPELINE } from '../../data/navigation'
import { useAppointments } from '../../context/AppointmentContext'
import { useClients } from '../../context/ClientContext'
import { useSettings } from '../../hooks/useSettings'
import { useToast } from '../../context/ToastContext'

export default function Overview() {
  const navigate = useNavigate()
  const [openBookingModal, setOpenBookingModal]   = useState(false)
  const [slotInitialData, setSlotInitialData]     = useState(null)
  const [openRecordPayment, setOpenRecordPayment] = useState(false)
  const { appointments }  = useAppointments()
  const { clients }       = useClients()
  const { settings }      = useSettings()
  const { showToast }    = useToast()
  const recentAppointments = appointments.slice(0, 5)

  // ── helpers ──────────────────────────────────────────────────────
  function parse12h(t) {
    if (!t) return null
    const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
    if (!m) return null
    let h = +m[1], mn = +m[2], p = m[3].toUpperCase()
    if (p === 'PM' && h !== 12) h += 12
    if (p === 'AM' && h === 12) h = 0
    return h * 60 + mn
  }
  function fmtRevenue(n) {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    if (n >= 1000)   return `₹${(n / 1000).toFixed(0)}K`
    return `₹${n.toLocaleString('en-IN')}`
  }
  function pctDelta(curr, prev) {
    if (!prev) return curr > 0 ? '+100%' : null
    const d = Math.round(((curr - prev) / prev) * 100)
    return `${d >= 0 ? '+' : ''}${d}%`
  }

  // ── today ────────────────────────────────────────────────────────
  const todayStr   = new Date().toISOString().split('T')[0]
  const nowMins    = new Date().getHours() * 60 + new Date().getMinutes()
  const todayAppts = appointments.filter(a =>
    a.date === todayStr && !['Rejected', 'Closed'].includes(a.status)
  )
  const onVenue   = todayAppts.filter(a => a.location && !a.location.toLowerCase().includes('studio')).length
  const inStudio  = todayAppts.length - onVenue
  const nextAppt  = [...todayAppts]
    .filter(a => parse12h(a.time) != null)
    .sort((a, b) => parse12h(a.time) - parse12h(b.time))
    .find(a => parse12h(a.time) >= nowMins) || null
  const todayRevenue    = todayAppts.reduce((s, a) => s + (a.amount || 0), 0)
  const confirmedToday  = todayAppts.filter(a =>
    ['Confirmed', 'Advance Paid', 'In Progress', 'Balance Paid', 'Completed'].includes(a.status)
  ).length

  // ── open slots today ─────────────────────────────────────────────
  const isWorkingDay = true
  let openSlotsToday = 0
  {
    const dur = 60
    const cutoff = earliestBookableMins(new Date().toISOString().split('T')[0])
    for (let t = 5 * 60; t + dur <= 21 * 60; t += dur) {
      if (t < cutoff) continue
      const occupied = todayAppts.some(a => {
        const at = parse12h(a.time)
        if (at == null) return false
        const ae = at + (a.totalDurationMins || dur)
        return t < ae && t + dur > at
      })
      if (!occupied) openSlotsToday++
    }
  }

  // ── monthly stats ─────────────────────────────────────────────────
  const now2 = new Date()
  const cm = now2.getMonth(), cy = now2.getFullYear()
  const lm = cm === 0 ? 11 : cm - 1, ly = cm === 0 ? cy - 1 : cy

  const thisMonth = appointments.filter(a => {
    const d = new Date(a.date)
    return !isNaN(d) && d.getMonth() === cm && d.getFullYear() === cy && a.status !== 'Rejected'
  })
  const lastMonth = appointments.filter(a => {
    const d = new Date(a.date)
    return !isNaN(d) && d.getMonth() === lm && d.getFullYear() === ly && a.status !== 'Rejected'
  })
  const thisMonthRevenue  = thisMonth.reduce((s, a) => s + (a.amount || 0), 0)
  const lastMonthRevenue  = lastMonth.reduce((s, a) => s + (a.amount || 0), 0)
  const thisMonthConfirmed = thisMonth.filter(a =>
    ['Confirmed', 'Advance Paid', 'In Progress', 'Balance Paid', 'Completed'].includes(a.status)
  ).length

  const pendingList = appointments.filter(a => {
    if (['Rejected', 'Closed'].includes(a.status) || !(a.amount > 0)) return false
    const paid = (a.advancePaid ? (a.advanceAmount || 0) : 0)
               + (a.balancePaid ? Math.max(0, (a.amount || 0) - (a.advanceAmount || 0)) : 0)
    return paid < (a.amount || 0)
  })
  const pendingAmount = pendingList.reduce((s, a) => {
    const paid = (a.advancePaid ? (a.advanceAmount || 0) : 0)
               + (a.balancePaid ? Math.max(0, (a.amount || 0) - (a.advanceAmount || 0)) : 0)
    return s + ((a.amount || 0) - paid)
  }, 0)
  const lastMonthPending = lastMonth.filter(a => {
    const paid = (a.advancePaid ? (a.advanceAmount || 0) : 0)
               + (a.balancePaid ? Math.max(0, (a.amount || 0) - (a.advanceAmount || 0)) : 0)
    return (a.amount || 0) > 0 && paid < (a.amount || 0)
  }).length
  const pendingDelta = pendingList.length - lastMonthPending

  const repeatClients = clients.filter(c =>
    appointments.filter(a => a.clientId === c.id || a.phone === c.phone).length > 1
  ).length

  // ── derived arrays ────────────────────────────────────────────────
  const TODAY_SNAPSHOT = [
    {
      icon: Calendar, color: 'var(--icon-booking)', bg: 'var(--icon-booking-bg)',
      label: "Today's Appointments",
      value: String(todayAppts.length),
      sub: todayAppts.length === 0 ? 'No appointments today' : `${onVenue} On-venue · ${inStudio} In-studio`,
    },
    {
      icon: Clock, color: 'var(--icon-client)', bg: 'var(--icon-client-bg)',
      label: 'Next Appointment',
      value: nextAppt ? nextAppt.time : '—',
      sub: nextAppt ? `${nextAppt.name} · ${nextAppt.service}` : 'No more today',
    },
    {
      icon: TrendingUp, color: 'var(--icon-revenue)', bg: 'var(--icon-revenue-bg)',
      label: "Today's Expected Revenue",
      value: `₹${todayRevenue.toLocaleString('en-IN')}`,
      sub: confirmedToday > 0 ? `Across ${confirmedToday} confirmed session${confirmedToday !== 1 ? 's' : ''}` : 'No confirmed sessions',
    },
    {
      icon: Plus, color: 'var(--icon-purple)', bg: 'var(--icon-purple-bg)',
      label: 'Open Slots Today',
      value: isWorkingDay ? String(openSlotsToday) : '—',
      sub: !isWorkingDay ? 'Off today' : openSlotsToday > 0 ? `${openSlotsToday} slot${openSlotsToday !== 1 ? 's' : ''} available` : 'Fully booked',
    },
  ]

  const STATS = [
    {
      label: 'Total Appointments', value: String(appointments.length),
      delta: pctDelta(thisMonth.length, lastMonth.length) || '—',
      icon: Calendar, color: 'var(--icon-booking)', bg: 'var(--icon-booking-bg)',
      subtitle: `${thisMonthConfirmed} confirmed this month`,
    },
    {
      label: 'Active Clients', value: String(clients.length),
      delta: '—',
      icon: Users, color: 'var(--icon-client)', bg: 'var(--icon-client-bg)',
      subtitle: `${repeatClients} repeat client${repeatClients !== 1 ? 's' : ''}`,
    },
    {
      label: 'Monthly Revenue', value: fmtRevenue(thisMonthRevenue),
      delta: pctDelta(thisMonthRevenue, lastMonthRevenue) || '—',
      icon: TrendingUp, color: 'var(--icon-revenue)', bg: 'var(--icon-revenue-bg)',
      subtitle: `Last month ${fmtRevenue(lastMonthRevenue)}`,
    },
    {
      label: 'Pending Balances', value: String(pendingList.length),
      delta: `${pendingDelta >= 0 ? '+' : ''}${pendingDelta}`,
      icon: Clock, color: 'var(--icon-warning)', bg: 'var(--icon-warning-bg)',
      subtitle: `${fmtRevenue(pendingAmount)} to collect`,
    },
  ]

  const PIPELINE_COUNTS = Object.fromEntries(
    APPOINTMENT_PIPELINE.map(s => [s, appointments.filter(a => a.status === s).length])
  )
  useEffect(() => {
    if (!settings.autoReminders || sessionStorage.getItem('overviewReminderShown')) return
    sessionStorage.setItem('overviewReminderShown', '1')

    const now = new Date()
    const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)

    const upcoming = appointments.filter(a => {
      if (['Rejected', 'Closed'].includes(a.status)) return false
      const d = new Date(a.date)
      return !isNaN(d.getTime()) && d > now && d <= in24h
    })

    upcoming.forEach((a, i) => {
      setTimeout(() => {
        showToast(`Reminder: ${a.name} · ${a.service} on ${a.date} at ${a.time}`, 'warning', 9000)
      }, 800 + i * 700)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleBookSlot(slotData) {
    setSlotInitialData(slotData)
    setOpenBookingModal(true)
  }

  return (
    <>
      <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1600px', margin: '0 auto' }}>

        {/* Header & Quick Action Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '16px', background: 'var(--dash-card-bg)', padding: '20px 24px',
          borderRadius: '20px', border: '1px solid var(--dash-border)',
          boxShadow: '0 4px 20px var(--dash-shadow)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: 'var(--dash-text-primary)', margin: 0 }}>
                Good morning, Ananya ✨
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--dash-text-secondary)', margin: '4px 0 0' }}>
              {todayAppts.length === 0
                ? 'No appointments today.'
                : `You have ${todayAppts.length} appointment${todayAppts.length !== 1 ? 's' : ''} today.`
              }
              {isWorkingDay && openSlotsToday > 0
                ? ` ${openSlotsToday} open slot${openSlotsToday !== 1 ? 's' : ''} remaining for booking.`
                : !isWorkingDay ? ' Off day.' : ' Fully booked today.'
              }
            </p>
          </div>

          {/* Quick Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Button variant="primary" size="sm" onClick={() => { setSlotInitialData(null); setOpenBookingModal(true); }}>
              <Plus size={16} /> New Booking
            </Button>
          </div>
        </div>

        {/* Today's Snapshot */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {TODAY_SNAPSHOT.map(({ icon: Icon, color, bg, label, value, sub }) => (
            <div key={label} style={{
              background: 'var(--dash-card-bg)',
              border: '1px solid var(--dash-border)',
              borderRadius: '16px', padding: '16px',
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              boxShadow: '0 2px 12px var(--dash-shadow)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '12px', flexShrink: 0,
                background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text-primary)', lineHeight: 1.2, marginTop: '2px' }}>
                  {value}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--dash-text-secondary)', marginTop: '3px' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MUA Key Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {STATS.map(s => <StatsCard key={s.label} {...s} />)}
        </div>

        {/* Main 2-Column Dashboard Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: '24px', alignItems: 'start' }} className="overview-responsive-grid">

          {/* Left Column */}
          <div className="overview-left-col no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

            <TodayTimeline onBookSlot={handleBookSlot} />

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px', margin: 0 }}>
                    Recent Appointments
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', margin: '2px 0 0' }}>
                    Manage upcoming makeup sessions
                  </p>
                </div>
                <Button variant="ghost" size="xs" onClick={() => navigate('/dashboard/appointments')}>
                  View All <ChevronRight size={14} />
                </Button>
              </CardHeader>
              <AppointmentTable appointments={recentAppointments} />
            </Card>

            {/* Pipeline */}
            <Card>
              <CardHeader>
                <div>
                  <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px' }}>
                    Booking Pipeline
                  </span>
                  <p style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', margin: '2px 0 0' }}>
                    Live counts across all {APPOINTMENT_PIPELINE.length} stages
                  </p>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--icon-booking)' }}>
                  {Object.values(PIPELINE_COUNTS).reduce((a, b) => a + b, 0)} total active
                </div>
              </CardHeader>
              <CardBody style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                  {APPOINTMENT_PIPELINE.map((stage, i, arr) => {
                    const count = PIPELINE_COUNTS[stage] ?? 0
                    return (
                      <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', opacity: count === 0 ? 0.8 : 1, transition: 'opacity 0.2s' }}>
                          <Badge status={stage} />
                          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)', fontFamily: 'Playfair Display, serif', lineHeight: 1 }}>
                            {count}
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--dash-text-muted)" strokeWidth="2.5" style={{ flexShrink: 0, marginBottom: '14px' }}>
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardBody>
            </Card>

          </div>

          {/* Right Column */}
          <div className="overview-right-col no-scrollbar" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <FinancialSummary onRecordPayment={() => setOpenRecordPayment(true)} />
            <WeekCalendar />
            {settings.allergyAlerts && <SkinAlertsWidget />}
          </div>

        </div>

      </div>

      {openBookingModal && (
        <NewBookingModal
          open={openBookingModal}
          onClose={() => {
            setOpenBookingModal(false)
            setSlotInitialData(null)
          }}
          initialData={slotInitialData}
        />
      )}
      <RecordPaymentModal
        open={openRecordPayment}
        onClose={() => setOpenRecordPayment(false)}
      />
    </>
  )
}

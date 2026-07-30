import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Users, TrendingUp, Clock, ChevronRight, Plus } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import TodayTimeline from '../../components/dashboard/TodayTimeline'
import FinancialSummary from '../../components/dashboard/FinancialSummary'
import SkinAlertsWidget from '../../components/dashboard/SkinAlertsWidget'
import WeekCalendar from '../../components/dashboard/WeekCalendar'
import NewBookingModal from '../../components/dashboard/NewBookingModal'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { APPOINTMENT_PIPELINE } from '../../data/navigation'
import { useAppointments } from '../../context/AppointmentContext'

const STATS = [
  { label: 'Total Appointments', value: '42',    delta: '+12%', icon: Calendar,   color: 'var(--icon-booking)', bg: 'var(--icon-booking-bg)', subtitle: '18 confirmed this month' },
  { label: 'Active Clients',     value: '128',   delta: '+8%',  icon: Users,      color: 'var(--icon-client)',  bg: 'var(--icon-client-bg)',  subtitle: '34 repeat clients' },
  { label: 'Monthly Revenue',    value: '₹1.2L', delta: '+22%', icon: TrendingUp, color: 'var(--icon-revenue)', bg: 'var(--icon-revenue-bg)', subtitle: 'Target ₹1.5L (80%)' },
  { label: 'Pending Balances',   value: '6',     delta: '-2',   icon: Clock,      color: 'var(--icon-warning)', bg: 'var(--icon-warning-bg)', subtitle: '₹42,000 to collect' },
]

const PIPELINE_COUNTS = {
  'Inquiry': 4, 'Shift Reserved': 2, 'Quotation Sent': 3, 'Approved': 5,
  'Payment Pending': 3, 'Advance Paid': 8, 'Confirmed': 12,
  'In Progress': 1, 'Completed': 18, 'Balance Paid': 2, 'Closed': 0,
}

const TODAY_SNAPSHOT = [
  { icon: Calendar,   color: 'var(--icon-booking)', bg: 'var(--icon-booking-bg)', label: "Today's Appointments",    value: '3',       sub: '2 On-venue · 1 In-studio' },
  { icon: Clock,      color: 'var(--icon-client)',  bg: 'var(--icon-client-bg)',  label: 'Next Appointment',        value: '05:30 AM', sub: 'Priya Mehta · Bridal Muhurtham' },
  { icon: TrendingUp, color: 'var(--icon-revenue)', bg: 'var(--icon-revenue-bg)', label: "Today's Expected Revenue", value: '₹21,500', sub: 'Across 3 confirmed sessions' },
  { icon: Plus,       color: 'var(--icon-purple)',  bg: 'var(--icon-purple-bg)',  label: 'Open Slots Today',         value: '2',       sub: '09:30–1:30 PM & 3:45–6:00 PM' },
]

export default function Overview() {
  const navigate = useNavigate()
  const [openBookingModal, setOpenBookingModal] = useState(false)
  const [slotInitialData, setSlotInitialData] = useState(null)
  const { appointments } = useAppointments()
  const recentAppointments = appointments.slice(0, 5)

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
              You have 3 appointments today. 2 Open slots remaining for booking.
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
            <FinancialSummary />
            <WeekCalendar />
            <SkinAlertsWidget />
          </div>

        </div>

      </div>

      <NewBookingModal
        open={openBookingModal}
        onClose={() => {
          setOpenBookingModal(false)
          setSlotInitialData(null)
        }}
        initialData={slotInitialData}
      />
    </>
  )
}

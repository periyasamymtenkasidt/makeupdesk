import { Calendar, Users, TrendingUp, Clock, ChevronRight, Plus, FileText } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import TodayTimeline from '../../components/dashboard/TodayTimeline'
import FinancialSummary from '../../components/dashboard/FinancialSummary'
import SkinAlertsWidget from '../../components/dashboard/SkinAlertsWidget'
import WeekCalendar from '../../components/dashboard/WeekCalendar'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { APPOINTMENT_PIPELINE } from '../../data/navigation'

const STATS = [
  { label: 'Total Bookings',     value: '48',    delta: '+12%', icon: Calendar,   color: '#c9956c', bg: 'rgba(201,149,108,0.12)', subtitle: '18 Bridal, 30 Party' },
  { label: 'Active Clients',     value: '32',    delta: '+5%',  icon: Users,      color: '#e8a4b8', bg: 'rgba(232,164,184,0.15)', subtitle: '89% Retention Rate' },
  { label: 'Revenue This Month', value: '₹1.2L', delta: '+18%', icon: TrendingUp, color: '#d4728f', bg: 'rgba(212,114,143,0.15)', subtitle: '₹30k to monthly target' },
  { label: 'Pending Balances',   value: '6',     delta: '-2',   icon: Clock,      color: '#a87655', bg: 'rgba(168,118,85,0.12)',  subtitle: '₹42,000 to collect' },
]

const RECENT = [
  { name:'Priya Mehta',    phone:'+91 98765 43210', service:'Bridal Muhurtham', date:'Jul 26, 2026', time:'05:30 AM', duration:'3 hrs',     status:'Confirmed',       amount:'₹12,000' },
  { name:'Anjali Sharma',  phone:'+91 91234 56789', service:'Sangeet Party',    date:'Jul 27, 2026', time:'06:00 PM', duration:'2 hrs',     status:'Payment Pending', amount:'₹4,500'  },
  { name:'Kavya Nair',     phone:'+91 99887 76655', service:'HD Shoot Glam',    date:'Jul 28, 2026', time:'02:00 PM', duration:'1.75 hrs',  status:'Quotation Sent',  amount:'₹5,000'  },
  { name:'Ritika Joshi',   phone:'+91 87654 32109', service:'Pre-Wedding Shoot',date:'Jul 30, 2026', time:'07:00 AM', duration:'2.5 hrs',   status:'Confirmed',       amount:'₹7,500'  },
  { name:'Meera Iyer',     phone:'+91 76543 21098', service:'Airbrush Bridal',  date:'Aug 01, 2026', time:'05:00 AM', duration:'3.5 hrs',   status:'Inquiry',         amount:'₹15,000' },
]

const PIPELINE_COUNTS = {
  'Inquiry':         3,
  'Shift Reserved':  2,
  'Quotation Sent':  4,
  'Approved':        1,
  'Payment Pending': 6,
  'Advance Paid':    8,
  'Confirmed':       12,
  'In Progress':     1,
  'Completed':       18,
  'Balance Paid':    2,
  'Closed':          0,
}

const TODAY_SNAPSHOT = [
  {
    icon: Calendar,
    color: '#c9956c',
    bg: 'rgba(201,149,108,0.1)',
    label: "Today's Appointments",
    value: '3',
    sub: '2 On-venue · 1 In-studio',
  },
  {
    icon: Clock,
    color: '#d4728f',
    bg: 'rgba(212,114,143,0.1)',
    label: 'Next Appointment',
    value: '05:30 AM',
    sub: 'Priya Mehta · Bridal Muhurtham',
  },
  {
    icon: TrendingUp,
    color: '#059669',
    bg: 'rgba(5,150,105,0.1)',
    label: "Today's Expected Revenue",
    value: '₹21,500',
    sub: 'Across 3 confirmed sessions',
  },
  {
    icon: Plus,
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.08)',
    label: 'Open Slots Today',
    value: '2',
    sub: '09:30–1:30 PM & 3:45–6:00 PM',
  },
]

export default function Overview() {
  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1600px', margin: '0 auto' }}>

      {/* Header & Quick Action Bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px', background: 'white', padding: '20px 24px',
        borderRadius: '20px', border: '1px solid rgba(201,149,108,0.15)',
        boxShadow: '0 4px 20px rgba(45,27,46,0.03)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '24px', fontWeight: 700, color: '#2d1b2e', margin: 0 }}>
              Good morning, Ananya ✨
            </h2>
            <span style={{
              fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(201,149,108,0.15), rgba(232,164,184,0.15))',
              color: '#c9956c'
            }}>
              Master MUA
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#8b6e7e', margin: '4px 0 0' }}>
            You have 3 appointments today. 2 Open slots remaining for booking.
          </p>
        </div>

        {/* Quick Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Button variant="outline" size="sm" as="a" href="/dashboard/quotations" style={{ color: '#2d1b2e', borderColor: 'rgba(201,149,108,0.3)', background: '#fdfbf9' }}>
            <FileText size={15} /> New Quote
          </Button>
          <Button variant="primary" size="sm" as="a" href="#book">
            <Plus size={16} /> New Booking
          </Button>
        </div>
      </div>

      {/* Today's Snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {TODAY_SNAPSHOT.map(({ icon: Icon, color, bg, label, value, sub }) => (
          <div key={label} style={{
            background: 'white',
            border: '1px solid rgba(201,149,108,0.12)',
            borderRadius: '16px',
            padding: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            boxShadow: '0 2px 12px rgba(45,27,46,0.03)',
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: '12px', flexShrink: 0,
              background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '11px', color: '#8b6e7e', fontWeight: 500 }}>{label}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: '#2d1b2e', lineHeight: 1.2, marginTop: '2px' }}>
                {value}
              </div>
              <div style={{ fontSize: '10px', color: '#a87655', marginTop: '3px' }}>{sub}</div>
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
        
        {/* Left Column: Timeline, Recent Appointments, Pipeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          
          {/* Today's Schedule & Slots */}
          <TodayTimeline />

          {/* Recent Appointments */}
          <Card>
            <CardHeader>
              <div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#2d1b2e', fontSize: '17px', margin: 0 }}>
                  Recent Appointments
                </h3>
                <p style={{ fontSize: '12px', color: '#8b6e7e', margin: '2px 0 0' }}>
                  Manage upcoming makeup sessions
                </p>
              </div>
              <Button variant="ghost" size="xs" style={{ color: '#c9956c' }}>
                View All <ChevronRight size={14} />
              </Button>
            </CardHeader>
            <AppointmentTable appointments={RECENT} />
          </Card>

          {/* Pipeline */}
          <Card>
            <CardHeader>
              <div>
                <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#2d1b2e', fontSize: '17px' }}>
                  Booking Pipeline
                </span>
                <p style={{ fontSize: '12px', color: '#8b6e7e', margin: '2px 0 0' }}>
                  Live counts across all {APPOINTMENT_PIPELINE.length} stages
                </p>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#c9956c' }}>
                {Object.values(PIPELINE_COUNTS).reduce((a, b) => a + b, 0)} total active
              </div>
            </CardHeader>
            <CardBody style={{ padding: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {APPOINTMENT_PIPELINE.map((stage, i, arr) => {
                  const count = PIPELINE_COUNTS[stage] ?? 0
                  return (
                    <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                        opacity: count === 0 ? 0.35 : 1,
                        transition: 'opacity 0.2s',
                      }}>
                        <Badge status={stage} />
                        <span style={{
                          fontSize: '13px', fontWeight: 700, color: '#2d1b2e',
                          fontFamily: 'Playfair Display, serif', lineHeight: 1,
                        }}>
                          {count}
                        </span>
                      </div>
                      {i < arr.length - 1 && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d4a8da" strokeWidth="2.5" style={{ flexShrink: 0, marginBottom: '14px' }}>
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

        {/* Right Column: Financial Highlights, Bridal Trials & Week Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Financial Breakdown */}
          <FinancialSummary />

          {/* 7-Day Mini Calendar */}
          <WeekCalendar />

          {/* Skin Alerts & Trials */}
          <SkinAlertsWidget />

        </div>

      </div>

    </div>
  )
}

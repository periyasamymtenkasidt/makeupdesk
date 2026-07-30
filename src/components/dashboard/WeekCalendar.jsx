import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { useAppointments } from '../../context/AppointmentContext'

const TYPE_COLOR = {
  bridal:     'var(--color-rose-gold)',
  party:      'var(--color-blush-dark)',
  editorial:  '#9b4dc0',
  prewedding: 'var(--color-blush)',
  hd:         '#2563eb',
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Helper to get Sunday to Saturday dates for current week
function getSundayToSaturdayWeek(baseDate = new Date()) {
  const d = new Date(baseDate)
  const day = d.getDay() // 0 = Sun
  const sunday = new Date(d)
  sunday.setDate(d.getDate() - day)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sunday)
    date.setDate(sunday.getDate() + i)
    return date
  })
}

// Sample appointment presets mapped by relative day offsets
const SAMPLE_MOCK = {
  0: [{ time: '05:30 AM', client: 'Priya Mehta',   service: 'Reception Look',    type: 'bridal'     }],
  1: [{ time: '06:00 PM', client: 'Anjali Sharma', service: 'Sangeet Party',     type: 'party'      }],
  2: [{ time: '02:00 PM', client: 'Kavya Nair',    service: 'HD Shoot Glam',     type: 'hd'         }],
  3: [
    { time: '11:00 AM', client: 'Sneha Reddy',   service: 'Bridal Trial',      type: 'bridal'     },
    { time: '02:30 PM', client: 'Ritika Joshi',  service: 'Pre-Wedding Shoot', type: 'prewedding' },
  ],
  4: [{ time: '10:00 AM', client: 'Divya Rao',     service: 'Party Makeup',      type: 'party'      }],
}

const TODAY_DATE = new Date()
const TODAY_STR  = TODAY_DATE.toDateString()

export default function WeekCalendar() {
  const { appointments = [] } = useAppointments()
  const weekDates = getSundayToSaturdayWeek(TODAY_DATE)

  // Map real or mock appointments into the Sunday-Saturday week
  const weekData = weekDates.map((dateObj, idx) => {
    const dateStr = dateObj.toISOString().split('T')[0]
    const realAppts = appointments.filter(a => String(a.date) === dateStr && a.status !== 'Rejected')

    const appts = realAppts.length > 0
      ? realAppts.map(a => ({
          time: a.time,
          client: a.name,
          service: a.service,
          type: a.service.toLowerCase().includes('bridal') ? 'bridal' : 'party',
        }))
      : (SAMPLE_MOCK[idx] || [])

    return { date: dateObj, appts }
  })

  const sundayObj   = weekDates[0]
  const saturdayObj = weekDates[6]
  const headerRange = `${MONTHS[sundayObj.getMonth()]} ${sundayObj.getDate()} – ${MONTHS[saturdayObj.getMonth()]} ${saturdayObj.getDate()}, ${saturdayObj.getFullYear()}`

  const todayIdx = weekDates.findIndex(d => d.toDateString() === TODAY_STR)
  const [sel, setSel] = useState(todayIdx >= 0 ? todayIdx : 0)
  const selected = weekData[sel]
  const isToday  = selected.date.toDateString() === TODAY_STR

  const TOTAL = weekData.reduce((s, d) => s + d.appts.length, 0)
  const FREE  = weekData.filter(d => d.appts.length === 0).length

  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'var(--icon-booking-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calendar size={18} style={{ color: 'var(--icon-booking)' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px', margin: 0 }}>
              This Week
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', margin: '2px 0 0' }}>{headerRange}</p>
          </div>
        </div>
      </CardHeader>

      <CardBody style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Day strip (Sunday to Saturday) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {weekData.map((day, i) => {
            const dayIsToday = day.date.toDateString() === TODAY_STR
            const isSelected = sel === i
            return (
              <button
                key={i}
                onClick={() => setSel(i)}
                style={{
                  border: 'none', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                  padding: '8px 4px', borderRadius: '12px',
                  background: isSelected
                    ? 'linear-gradient(135deg, #c9956c 0%, #b87b50 100%)'
                    : dayIsToday
                    ? 'var(--icon-booking-bg)'
                    : 'transparent',
                  boxShadow: isSelected ? '0 4px 14px rgba(201,149,108,0.45)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{
                  fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: isSelected ? '#ffffff' : 'var(--dash-text-secondary)',
                }}>
                  {DAYS[day.date.getDay()]}
                </span>
                <span style={{
                  fontSize: '16px', fontWeight: 800, lineHeight: 1,
                  fontFamily: 'Playfair Display, serif',
                  color: isSelected ? '#ffffff' : dayIsToday ? 'var(--icon-booking)' : 'var(--dash-text-primary)',
                }}>
                  {day.date.getDate()}
                </span>
                <div style={{ display: 'flex', gap: '2px', height: '6px', alignItems: 'center' }}>
                  {day.appts.slice(0, 3).map((a, j) => (
                    <div key={j} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: isSelected ? '#ffffff' : TYPE_COLOR[a.type] || 'var(--icon-booking)',
                    }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ height: '1px', background: 'var(--dash-border-subtle)' }} />

        {/* Selected day detail */}
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: 'var(--dash-text-secondary)', margin: '0 0 10px',
          }}>
            {isToday ? 'Today' : DAYS[selected.date.getDay()]},&nbsp;
            {MONTHS[selected.date.getMonth()]} {selected.date.getDate()}
            {selected.appts.length > 0 && (
              <span style={{ marginLeft: '6px', color: 'var(--icon-booking)', textTransform: 'none' }}>
                · {selected.appts.length} appointment{selected.appts.length > 1 ? 's' : ''}
              </span>
            )}
          </p>

          {selected.appts.length === 0 ? (
            <div style={{
              padding: '18px', textAlign: 'center', borderRadius: '12px',
              background: 'var(--badge-confirmed-bg)', border: '1px dashed var(--badge-confirmed)',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🌿</div>
              <div style={{ fontSize: '12px', color: 'var(--badge-confirmed)', fontWeight: 600 }}>Day Open</div>
              <div style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', marginTop: '2px' }}>No appointments · Available for booking</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {selected.appts.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '11px',
                  background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
                }}>
                  <div style={{
                    width: 3, height: 32, borderRadius: 9999, flexShrink: 0,
                    background: TYPE_COLOR[a.type] || 'var(--icon-booking)',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.client}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', marginTop: '1px' }}>{a.service}</div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, flexShrink: 0,
                    color: 'var(--icon-booking)', background: 'var(--icon-booking-bg)',
                    padding: '3px 8px', borderRadius: '6px',
                  }}>
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Week summary footer */}
        <div style={{
          padding: '10px 14px', borderRadius: '12px',
          background: 'var(--btn-ghost-bg)',
          border: '1px solid var(--btn-ghost-border)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--dash-text-secondary)' }}>Week total</span>
          <div style={{ display: 'flex', gap: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--icon-booking)' }}>{TOTAL} bookings</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--badge-confirmed)' }}>{FREE} free day{FREE !== 1 ? 's' : ''}</span>
          </div>
        </div>

      </CardBody>
    </Card>
  )
}

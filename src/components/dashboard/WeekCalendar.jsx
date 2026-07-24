import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'

const TYPE_COLOR = {
  bridal:     '#c9956c',
  party:      '#d4728f',
  editorial:  '#9b4dc0',
  prewedding: '#e8a4b8',
  hd:         '#2563eb',
}

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const WEEK = [
  {
    date: new Date(2026, 6, 23),
    appts: [
      { time: '05:30 AM', client: 'Priya Mehta',   service: 'Bridal Muhurtham',   type: 'bridal'     },
      { time: '02:00 PM', client: 'Kavya Nair',    service: 'Pre-Wedding Shoot',  type: 'prewedding' },
      { time: '06:00 PM', client: 'Anjali Sharma', service: 'Sangeet Party Glam', type: 'party'      },
    ],
  },
  {
    date: new Date(2026, 6, 24),
    appts: [],
  },
  {
    date: new Date(2026, 6, 25),
    appts: [
      { time: '10:00 AM', client: 'Divya Rao',     service: 'Party Makeup',       type: 'party'      },
    ],
  },
  {
    date: new Date(2026, 6, 26),
    appts: [
      { time: '05:30 AM', client: 'Priya Mehta',   service: 'Reception Look',     type: 'bridal'     },
    ],
  },
  {
    date: new Date(2026, 6, 27),
    appts: [
      { time: '06:00 PM', client: 'Anjali Sharma', service: 'Sangeet Party',      type: 'party'      },
    ],
  },
  {
    date: new Date(2026, 6, 28),
    appts: [
      { time: '02:00 PM', client: 'Kavya Nair',    service: 'HD Shoot Glam',      type: 'hd'         },
    ],
  },
  {
    date: new Date(2026, 6, 29),
    appts: [
      { time: '11:00 AM', client: 'Sneha Reddy',   service: 'Bridal Trial',       type: 'bridal'     },
      { time: '02:30 PM', client: 'Ritika Joshi',  service: 'Pre-Wedding Shoot',  type: 'prewedding' },
    ],
  },
]

const TODAY_STR = new Date(2026, 6, 23).toDateString()
const TOTAL = WEEK.reduce((s, d) => s + d.appts.length, 0)
const FREE  = WEEK.filter(d => d.appts.length === 0).length

export default function WeekCalendar() {
  const [sel, setSel] = useState(0)
  const selected = WEEK[sel]
  const isToday  = selected.date.toDateString() === TODAY_STR

  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'rgba(201,149,108,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calendar size={18} style={{ color: '#c9956c' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#2d1b2e', fontSize: '17px', margin: 0 }}>
              This Week
            </h3>
            <p style={{ fontSize: '12px', color: '#8b6e7e', margin: '2px 0 0' }}>Jul 23 – 29, 2026</p>
          </div>
        </div>
      </CardHeader>

      <CardBody style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

        {/* Day strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
          {WEEK.map((day, i) => {
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
                    ? 'linear-gradient(135deg,#c9956c,#d4728f)'
                    : dayIsToday
                    ? 'rgba(201,149,108,0.1)'
                    : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                <span style={{
                  fontSize: '9px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
                  color: isSelected ? 'rgba(255,255,255,0.75)' : '#8b6e7e',
                }}>
                  {DAYS[day.date.getDay()]}
                </span>
                <span style={{
                  fontSize: '16px', fontWeight: 700, lineHeight: 1,
                  fontFamily: 'Playfair Display, serif',
                  color: isSelected ? 'white' : dayIsToday ? '#c9956c' : '#2d1b2e',
                }}>
                  {day.date.getDate()}
                </span>
                <div style={{ display: 'flex', gap: '2px', height: '6px', alignItems: 'center' }}>
                  {day.appts.slice(0, 3).map((a, j) => (
                    <div key={j} style={{
                      width: '5px', height: '5px', borderRadius: '50%',
                      background: isSelected ? 'rgba(255,255,255,0.65)' : TYPE_COLOR[a.type] || '#c9956c',
                    }} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ height: '1px', background: 'rgba(201,149,108,0.1)' }} />

        {/* Selected day detail */}
        <div>
          <p style={{
            fontSize: '11px', fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.1em', color: '#8b6e7e', margin: '0 0 10px',
          }}>
            {isToday ? 'Today' : DAYS[selected.date.getDay()]},&nbsp;
            {MONTHS[selected.date.getMonth()]} {selected.date.getDate()}
            {selected.appts.length > 0 && (
              <span style={{ marginLeft: '6px', color: '#c9956c', textTransform: 'none' }}>
                · {selected.appts.length} appointment{selected.appts.length > 1 ? 's' : ''}
              </span>
            )}
          </p>

          {selected.appts.length === 0 ? (
            <div style={{
              padding: '18px', textAlign: 'center', borderRadius: '12px',
              background: 'rgba(5,150,105,0.04)', border: '1px dashed rgba(5,150,105,0.2)',
            }}>
              <div style={{ fontSize: '18px', marginBottom: '4px' }}>🌿</div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>Day Open</div>
              <div style={{ fontSize: '11px', color: '#8b6e7e', marginTop: '2px' }}>No appointments · Available for booking</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {selected.appts.map((a, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '9px 12px', borderRadius: '11px',
                  background: '#fdfbf9', border: '1px solid rgba(201,149,108,0.12)',
                }}>
                  <div style={{
                    width: 3, height: 32, borderRadius: 9999, flexShrink: 0,
                    background: TYPE_COLOR[a.type] || '#c9956c',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#2d1b2e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {a.client}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8b6e7e', marginTop: '1px' }}>{a.service}</div>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 700, flexShrink: 0,
                    color: '#c9956c', background: 'rgba(201,149,108,0.1)',
                    padding: '2px 7px', borderRadius: '6px',
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
          background: 'linear-gradient(135deg,rgba(201,149,108,0.06),rgba(232,164,184,0.06))',
          border: '1px solid rgba(201,149,108,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: '12px', color: '#8b6e7e' }}>Week total</span>
          <div style={{ display: 'flex', gap: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#c9956c' }}>{TOTAL} bookings</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#059669' }}>{FREE} free day{FREE !== 1 ? 's' : ''}</span>
          </div>
        </div>

      </CardBody>
    </Card>
  )
}

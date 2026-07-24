import { Sparkles, AlertTriangle, Calendar, ChevronRight } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'

const UPCOMING_TRIALS = [
  {
    id: 1,
    client: 'Sneha Reddy',
    event: 'Bridal Trial',
    date: 'Jul 29, 2026',
    skinType: 'Dry & Sensitive Skin',
    allergies: 'Latex, Heavy Fragrance',
    preferredLook: 'Natural Dewy Airbrush',
    status: 'Scheduled',
  },
  {
    id: 2,
    client: 'Rhea Kapoor',
    event: 'Reception Look Trial',
    date: 'Aug 02, 2026',
    skinType: 'Oily T-Zone',
    allergies: 'None reported',
    preferredLook: 'Matte Glam with Glitter Cut-Crease',
    status: 'Confirmed',
  },
]

export default function SkinAlertsWidget() {
  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'rgba(232,164,184,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Sparkles size={18} style={{ color: '#d4728f' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#2d1b2e', fontSize: '17px', margin: 0 }}>
              Bridal Trials & Skin Notes
            </h3>
            <p style={{ fontSize: '12px', color: '#8b6e7e', margin: '2px 0 0' }}>
              Client skin preferences & safety alerts
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '20px' }}>
        {UPCOMING_TRIALS.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '14px',
              borderRadius: '14px',
              background: '#fdfbf9',
              border: '1px solid rgba(201,149,108,0.14)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#2d1b2e' }}>
                {item.client}
              </div>
              <span style={{
                fontSize: '11px', fontWeight: 500, color: '#c9956c', background: 'rgba(201,149,108,0.1)',
                padding: '2px 8px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px'
              }}>
                <Calendar size={11} /> {item.date}
              </span>
            </div>

            <div style={{ fontSize: '12px', color: '#8b6e7e' }}>
              Type: <strong style={{ color: '#2d1b2e', fontWeight: 500 }}>{item.event}</strong>
            </div>

            {/* Allergy alert */}
            {item.allergies && item.allergies !== 'None reported' ? (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '4px 10px', borderRadius: '8px',
                background: 'rgba(220,38,38,0.08)', color: '#dc2626',
                fontSize: '11px', fontWeight: 600
              }}>
                <AlertTriangle size={13} /> Safety Alert: {item.allergies}
              </div>
            ) : (
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 500 }}>
                ✓ No known product allergies
              </div>
            )}

            {/* Preferred Look */}
            <div style={{
              fontSize: '11px', color: '#a87655', background: 'rgba(168,118,85,0.06)',
              padding: '6px 10px', borderRadius: '8px', marginTop: '2px'
            }}>
              ✨ <strong>Preferred Look:</strong> {item.preferredLook} ({item.skinType})
            </div>
          </div>
        ))}

        <Button variant="ghost" size="xs" style={{ justifyContent: 'center', marginTop: '4px', color: '#c9956c' }}>
          View All Client Profiles <ChevronRight size={14} />
        </Button>
      </CardBody>
    </Card>
  )
}

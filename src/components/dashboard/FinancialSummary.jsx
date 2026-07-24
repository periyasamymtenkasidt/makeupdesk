import { TrendingUp, CreditCard, AlertCircle, ArrowUpRight, DollarSign } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'

export default function FinancialSummary() {
  const totalTarget = 150000 // ₹1.5L Target
  const achieved = 120000   // ₹1.2L Achieved
  const percentage = Math.round((achieved / totalTarget) * 100)

  return (
    <Card>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '10px',
            background: 'rgba(212,114,143,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <TrendingUp size={18} style={{ color: '#d4728f' }} />
          </div>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: '#2d1b2e', fontSize: '17px', margin: 0 }}>
              Financial Highlights
            </h3>
            <p style={{ fontSize: '12px', color: '#8b6e7e', margin: '2px 0 0' }}>
              July Wedding Season Target
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
        {/* Goal Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#2d1b2e' }}>Monthly Target</span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#c9956c' }}>
              ₹1.2L <span style={{ fontSize: '11px', color: '#8b6e7e', fontWeight: 400 }}>/ ₹1.5L ({percentage}%)</span>
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', background: 'rgba(201,149,108,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${percentage}%`, height: '100%',
              background: 'linear-gradient(90deg, #c9956c 0%, #d4728f 100%)',
              borderRadius: '9999px', transition: 'width 0.6s ease'
            }} />
          </div>
        </div>

        {/* Revenue split breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{
            padding: '14px', borderRadius: '14px', background: '#fdfbf9',
            border: '1px solid rgba(201,149,108,0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#059669', fontWeight: 600 }}>
              <CreditCard size={13} /> Advance Received
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: '#2d1b2e', marginTop: '4px' }}>
              ₹78,000
            </div>
            <div style={{ fontSize: '11px', color: '#8b6e7e', marginTop: '2px' }}>65% of bookings</div>
          </div>

          <div style={{
            padding: '14px', borderRadius: '14px', background: '#fdfbf9',
            border: '1px solid rgba(212,114,143,0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#d4728f', fontWeight: 600 }}>
              <AlertCircle size={13} /> Pending Balance
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: '#2d1b2e', marginTop: '4px' }}>
              ₹42,000
            </div>
            <div style={{ fontSize: '11px', color: '#8b6e7e', marginTop: '2px' }}>6 Client balances</div>
          </div>
        </div>

        {/* Payment mode quick stats */}
        <div style={{
          padding: '12px 14px', borderRadius: '12px', background: 'rgba(45,27,46,0.03)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px'
        }}>
          <span style={{ color: '#8b6e7e' }}>Payment Modes:</span>
          <div style={{ display: 'flex', gap: '12px', fontWeight: 600, color: '#2d1b2e' }}>
            <span>UPI: <strong style={{ color: '#c9956c' }}>70%</strong></span>
            <span>Cash: <strong style={{ color: '#d4728f' }}>20%</strong></span>
            <span>Card: <strong style={{ color: '#a87655' }}>10%</strong></span>
          </div>
        </div>

        {/* Fast Action */}
        <Button variant="primary" size="sm" style={{ width: '100%', justifyContent: 'center' }}>
          Record Payment / Advance <ArrowUpRight size={15} />
        </Button>
      </CardBody>
    </Card>
  )
}

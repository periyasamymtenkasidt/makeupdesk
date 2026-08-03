import { TrendingUp, CreditCard, AlertCircle, ArrowUpRight } from 'lucide-react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAppointments } from '../../context/AppointmentContext'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency'
import { useSettings } from '../../hooks/useSettings'

export default function FinancialSummary({ onRecordPayment }) {
  const { appointments = [] } = useAppointments()
  const { settings }          = useSettings()

  // Calculate live financial statistics from appointment state
  const totalTarget = 150000

  const activeAppts = appointments.filter(a => a.status !== 'Rejected' && a.status !== 'Closed')

  let totalCollected = 0
  let totalAdvance = 0
  let totalPending = 0
  let pendingClientsCount = 0

  let upiCount = 0, cashCount = 0, cardCount = 0, totalMethodCount = 0

  activeAppts.forEach(a => {
    const tot = Number(a.amount || 0)
    const adv = Number(a.advanceAmount || Math.round(tot * ((settings.advancePct ?? 40) / 100)))
    const bal = Math.max(0, tot - adv)

    if (a.advancePaid) {
      totalCollected += adv
      totalAdvance += adv
      if (a.advanceMethod === 'UPI') upiCount++
      else if (a.advanceMethod === 'Cash') cashCount++
      else if (a.advanceMethod === 'Card') cardCount++
      totalMethodCount++
    } else {
      totalPending += adv
      pendingClientsCount++
    }

    if (a.balancePaid) {
      totalCollected += bal
      if (a.balanceMethod === 'UPI') upiCount++
      else if (a.balanceMethod === 'Cash') cashCount++
      else if (a.balanceMethod === 'Card') cardCount++
      totalMethodCount++
    } else if (a.advancePaid) {
      totalPending += bal
      pendingClientsCount++
    }
  })

  // Fallback to default ratios if no method logged yet
  const upiPct  = totalMethodCount > 0 ? Math.round((upiCount / totalMethodCount) * 100) : 70
  const cashPct = totalMethodCount > 0 ? Math.round((cashCount / totalMethodCount) * 100) : 20
  const cardPct = totalMethodCount > 0 ? Math.round((cardCount / totalMethodCount) * 100) : 10

  // Calculate live progress percentage
  const percentage = Math.min(100, Math.round((totalCollected / totalTarget) * 100))

  return (
    <>
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 34, height: 34, borderRadius: '10px',
              background: 'var(--icon-client-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <TrendingUp size={18} style={{ color: 'var(--icon-client)' }} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px', margin: 0 }}>
                Financial Highlights
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--dash-text-secondary)', margin: '2px 0 0' }}>
                July Wedding Season Target
              </p>
            </div>
          </div>
        </CardHeader>

        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
          {/* Goal Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>Monthly Target</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-rose-gold)' }}>
                {formatCurrencyShort(totalCollected)} <span style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', fontWeight: 500 }}>/ {formatCurrencyShort(totalTarget)} ({percentage}%)</span>
              </span>
            </div>
            {/* Progress Bar Track & Dynamic Fill */}
            <div style={{ width: '100%', height: '10px', background: 'var(--icon-booking-bg)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{
                width: `${percentage}%`, height: '100%',
                background: 'linear-gradient(90deg, #c9956c 0%, #e8a4b8 100%)',
                borderRadius: '9999px', transition: 'width 0.6s ease',
                boxShadow: '0 0 10px rgba(201,149,108,0.5)'
              }} />
            </div>
          </div>

          {/* Revenue split breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{
              padding: '14px', borderRadius: '14px',
              background: 'var(--dash-surface)',
              border: '1px solid var(--dash-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--badge-confirmed)', fontWeight: 600 }}>
                <CreditCard size={13} /> Advance Received
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text-primary)', marginTop: '4px' }}>
                {formatCurrency(totalAdvance)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', marginTop: '2px' }}>
                {activeAppts.length > 0 ? `${Math.round((activeAppts.filter(a => a.advancePaid).length / activeAppts.length) * 100)}% of bookings` : '0% of bookings'}
              </div>
            </div>

            <div style={{
              padding: '14px', borderRadius: '14px',
              background: 'var(--dash-surface)',
              border: '1px solid rgba(212,114,143,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--badge-pending)', fontWeight: 600 }}>
                <AlertCircle size={13} /> Pending Balance
              </div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '20px', fontWeight: 700, color: 'var(--dash-text-primary)', marginTop: '4px' }}>
                {formatCurrency(totalPending)}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', marginTop: '2px' }}>
                {pendingClientsCount} Pending Payments
              </div>
            </div>
          </div>

          {/* Payment mode quick stats */}
          <div style={{
            padding: '12px 14px', borderRadius: '12px', background: 'var(--dash-subtle-row-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px'
          }}>
            <span style={{ color: 'var(--dash-text-secondary)' }}>Payment Modes:</span>
            <div style={{ display: 'flex', gap: '12px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
              <span>UPI: <strong style={{ color: 'var(--color-rose-gold)' }}>{upiPct}%</strong></span>
              <span>Cash: <strong style={{ color: 'var(--color-rose-gold)' }}>{cashPct}%</strong></span>
              <span>Card: <strong style={{ color: 'var(--color-rose-gold)' }}>{cardPct}%</strong></span>
            </div>
          </div>

          {/* Fast Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={onRecordPayment}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Record Payment / Advance <ArrowUpRight size={15} />
          </Button>
        </CardBody>
      </Card>

    </>
  )
}

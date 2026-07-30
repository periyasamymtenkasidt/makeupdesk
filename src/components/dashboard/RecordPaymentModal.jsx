import { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { useAppointments } from '../../context/AppointmentContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { CustomSelect } from '../ui/CustomSelect'
import { Smartphone, Banknote, CreditCard, ShieldCheck, Check } from 'lucide-react'

const inpStyle = {
  width: '100%', padding: '11.5px 14px', borderRadius: '12px',
  border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13.5px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
  transition: 'all 0.2s ease',
}

const lbl = {
  display: 'block', fontSize: '11.5px', fontWeight: 700, color: 'var(--dash-label-text)',
  marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.08em',
}

export default function RecordPaymentModal({ open, onClose }) {
  const { appointments, updateAppointment } = useAppointments()

  // Find all active appointments that have pending payments
  const pendingAppointments = appointments.filter(a =>
    a.status !== 'Rejected' && a.status !== 'Closed' && (!a.advancePaid || !a.balancePaid)
  )

  const [selectedId, setSelectedId]   = useState('')
  const [paymentType, setPaymentType] = useState('advance') // 'advance' | 'balance'
  const [method, setMethod]           = useState('UPI')
  const [txnRef, setTxnRef]           = useState('')

  // Set default selected appointment when modal opens
  useEffect(() => {
    if (open && pendingAppointments.length > 0) {
      const first = pendingAppointments[0]
      setSelectedId(first.id)
      setPaymentType(!first.advancePaid ? 'advance' : 'balance')
    }
  }, [open])

  const selectedAppt = appointments.find(a => a.id === selectedId) || pendingAppointments[0]

  // Auto-switch payment type if selected appointment only has balance pending
  useEffect(() => {
    if (selectedAppt) {
      if (!selectedAppt.advancePaid) {
        setPaymentType('advance')
      } else if (!selectedAppt.balancePaid) {
        setPaymentType('balance')
      }
    }
  }, [selectedId])

  if (!selectedAppt && open) {
    return (
      <Modal open={open} onClose={onClose} title="Record Payment" width="480px">
        <div style={{ padding: '36px 20px', textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--icon-booking-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
            <ShieldCheck size={28} style={{ color: 'var(--badge-confirmed)' }} />
          </div>
          <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--dash-text-primary)', margin: '0 0 6px', fontFamily: 'Playfair Display, serif' }}>
            All Payments Up-to-Date!
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--dash-text-secondary)', margin: 0 }}>
            There are currently no bookings with pending advance or balance payments.
          </p>
        </div>
      </Modal>
    )
  }

  const totalAmount   = Number(selectedAppt?.amount || 0)
  const advanceAmount = Number(selectedAppt?.advanceAmount || Math.round(totalAmount * 0.4))
  const balanceAmount = Math.max(0, totalAmount - advanceAmount)
  const advPct        = totalAmount > 0 ? Math.round((advanceAmount / totalAmount) * 100) : 40
  const balPct        = 100 - advPct

  const paymentRecordAmount = paymentType === 'advance' ? advanceAmount : balanceAmount

  function handleConfirmPayment() {
    if (!selectedAppt) return

    const updateObj = {}
    if (paymentType === 'advance') {
      updateObj.advancePaid = true
      updateObj.advanceMethod = method
    } else {
      updateObj.balancePaid = true
      updateObj.balanceMethod = method
    }
    if (txnRef) {
      updateObj.notes = (selectedAppt.notes ? `${selectedAppt.notes} | ` : '') + `Txn Ref (${method}): ${txnRef}`
    }

    updateAppointment(selectedAppt.id, updateObj)
    alert(`✅ Payment Logged Successfully!\n\nClient: ${selectedAppt.name}\nType: ${paymentType === 'advance' ? 'Advance Deposit' : 'Balance Settlement'}\nAmount: ${formatCurrency(paymentRecordAmount)}\nMode: ${method}`)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record Payment / Advance"
      onSave={handleConfirmPayment}
      saveLabel="Confirm Payment Received"
      width="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

        {/* Client / Booking Selector */}
        <CustomSelect
          label="Select Appointment / Client *"
          value={selectedId}
          placeholder="— Select an appointment —"
          options={pendingAppointments.map(a => {
            const pendingStr = !a.advancePaid ? 'Adv Pending' : 'Bal Pending'
            return {
              value: a.id,
              label: `${a.name} — ${a.service} (${pendingStr})`,
            }
          })}
          onChange={val => setSelectedId(val)}
        />

        {selectedAppt && (
          <>
            {/* Financial Ledger Breakdown */}
            <div style={{
              background: 'var(--dash-subtle-row-bg)',
              border: '1.5px solid var(--dash-border)',
              borderRadius: '16px', padding: '16px 20px',
              boxShadow: '0 4px 16px var(--dash-shadow)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--icon-booking)', textTransform: 'uppercase', letterSpacing: '0.09em' }}>
                  Booking Payment Details
                </span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)' }}>
                  ID: #{selectedAppt.id}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--dash-border-subtle)', fontSize: '13px' }}>
                <span style={{ color: 'var(--dash-text-secondary)', fontWeight: 500 }}>Total Service Package</span>
                <span style={{ fontWeight: 700, color: 'var(--dash-text-primary)' }}>{formatCurrency(totalAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--dash-border-subtle)', fontSize: '13px' }}>
                <span style={{ color: 'var(--dash-text-secondary)', fontWeight: 500 }}>Advance ({advPct}%)</span>
                <span style={{ fontWeight: 700, color: selectedAppt.advancePaid ? 'var(--badge-confirmed)' : 'var(--icon-booking)' }}>
                  {formatCurrency(advanceAmount)} {selectedAppt.advancePaid ? '✓ Paid' : '(Pending)'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0 2px', fontSize: '13px' }}>
                <span style={{ color: 'var(--dash-text-secondary)', fontWeight: 500 }}>Remaining Balance ({balPct}%)</span>
                <span style={{ fontWeight: 700, color: selectedAppt.balancePaid ? 'var(--badge-confirmed)' : 'var(--dash-text-primary)' }}>
                  {formatCurrency(balanceAmount)} {selectedAppt.balancePaid ? '✓ Paid' : '(Pending)'}
                </span>
              </div>
            </div>

            {/* Payment Stage Selector */}
            <div>
              <label style={lbl}>Logging Payment For *</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  disabled={selectedAppt.advancePaid}
                  onClick={() => setPaymentType('advance')}
                  style={{
                    padding: '14px', borderRadius: '14px', border: '2px solid',
                    borderColor: paymentType === 'advance' ? '#c9956c' : 'rgba(201,149,108,0.22)',
                    background: paymentType === 'advance' ? 'linear-gradient(135deg, rgba(201,149,108,0.16), rgba(232,164,184,0.1))' : 'var(--dash-card-bg)',
                    boxShadow: paymentType === 'advance' ? '0 4px 16px rgba(201,149,108,0.22)' : 'none',
                    opacity: selectedAppt.advancePaid ? 0.45 : 1,
                    cursor: selectedAppt.advancePaid ? 'not-allowed' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease', position: 'relative',
                  }}
                >
                  {paymentType === 'advance' && !selectedAppt.advancePaid && (
                    <div style={{ position: 'absolute', top: 8, right: 10 }}>
                      <Check size={15} style={{ color: '#c9956c' }} strokeWidth={3} />
                    </div>
                  )}
                  <span style={{ fontSize: '11px', fontWeight: 700, color: paymentType === 'advance' ? '#8b5a2b' : 'var(--dash-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {selectedAppt.advancePaid ? '✓ Advance Paid' : 'Advance Deposit'}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dash-text-primary)' }}>
                    {formatCurrency(advanceAmount)}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={selectedAppt.balancePaid}
                  onClick={() => setPaymentType('balance')}
                  style={{
                    padding: '14px', borderRadius: '14px', border: '2px solid',
                    borderColor: paymentType === 'balance' ? '#c9956c' : 'rgba(201,149,108,0.22)',
                    background: paymentType === 'balance' ? 'linear-gradient(135deg, rgba(201,149,108,0.16), rgba(232,164,184,0.1))' : 'var(--dash-card-bg)',
                    boxShadow: paymentType === 'balance' ? '0 4px 16px rgba(201,149,108,0.22)' : 'none',
                    opacity: selectedAppt.balancePaid ? 0.45 : 1,
                    cursor: selectedAppt.balancePaid ? 'not-allowed' : 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.2s ease', position: 'relative',
                  }}
                >
                  {paymentType === 'balance' && !selectedAppt.balancePaid && (
                    <div style={{ position: 'absolute', top: 8, right: 10 }}>
                      <Check size={15} style={{ color: '#c9956c' }} strokeWidth={3} />
                    </div>
                  )}
                  <span style={{ fontSize: '11px', fontWeight: 700, color: paymentType === 'balance' ? '#8b5a2b' : 'var(--dash-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {selectedAppt.balancePaid ? '✓ Balance Paid' : 'Balance Settlement'}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dash-text-primary)' }}>
                    {formatCurrency(balanceAmount)}
                  </span>
                </button>
              </div>
            </div>

            {/* Payment Method Picker */}
            <div>
              <label style={lbl}>Payment Mode *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { id: 'UPI', icon: Smartphone, label: 'UPI / QR' },
                  { id: 'Cash', icon: Banknote, label: 'Cash' },
                  { id: 'Card', icon: CreditCard, label: 'Card / NetBank' },
                ].map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    style={{
                      padding: '12px 10px', borderRadius: '12px', border: '2px solid',
                      borderColor: method === id ? '#c9956c' : 'rgba(201,149,108,0.22)',
                      background: method === id ? 'linear-gradient(135deg, rgba(201,149,108,0.16), rgba(232,164,184,0.1))' : 'var(--dash-card-bg)',
                      boxShadow: method === id ? '0 4px 14px rgba(201,149,108,0.22)' : 'none',
                      cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                      fontFamily: 'Inter, sans-serif', transition: 'all 0.18s ease',
                    }}
                  >
                    <Icon size={18} style={{ color: method === id ? '#c9956c' : 'var(--dash-text-muted)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: method === id ? '#8b5a2b' : 'var(--dash-text-secondary)' }}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Ref / Note */}
            <div>
              <label style={lbl}>Transaction Reference / Note (optional)</label>
              <input
                style={inpStyle}
                placeholder="e.g. GPay Ref #3948102 or Received in cash"
                value={txnRef}
                onChange={e => setTxnRef(e.target.value)}
              />
            </div>
          </>
        )}

      </div>
    </Modal>
  )
}

import { useState } from 'react'
import { Wallet, TrendingDown, CheckCircle, Clock, Check, Hourglass, Smartphone, Banknote, CreditCard, Users } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { useAppointments } from '../../context/AppointmentContext'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'

function VendorPayBadge({ paid }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '4px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 600,
        border: '1.5px solid', fontFamily: 'Inter, sans-serif',
        ...(paid
          ? { background: 'var(--badge-confirmed-bg)', color: 'var(--badge-confirmed)', borderColor: 'var(--badge-confirmed)' }
          : { background: 'var(--badge-pending-bg)',   color: 'var(--badge-pending)',   borderColor: 'var(--badge-pending)' }
        ),
      }}
    >
      {paid ? <Check size={11} /> : <Hourglass size={11} />}
      {paid ? 'Paid' : 'Pending'}
    </span>
  )
}

const inpStyle = {
  width: '100%', padding: '11.5px 14px', borderRadius: '12px',
  border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13.5px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}

const lbl = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
  marginBottom: '7px', textTransform: 'uppercase', letterSpacing: '0.08em',
}

export default function VendorPayments() {
  const { appointments, updateVendorPayments } = useAppointments()

  const rows = appointments
    .filter(a => Array.isArray(a.vendorPayments) && a.vendorPayments.length > 0)
    .flatMap(appt =>
      appt.vendorPayments.map(vp => ({
        ...vp,
        apptId:     appt.id,
        apptDate:   appt.date,
        clientName: appt.name,
        service:    appt.service,
      }))
    )

  const totalCost    = rows.reduce((s, r) => s + (r.amount || 0), 0)
  const totalPaid    = rows.filter(r => r.paid).reduce((s, r) => s + (r.amount || 0), 0)
  const totalPending = totalCost - totalPaid
  const pendingCount = rows.filter(r => !r.paid).length

  const STATS = [
    { label: 'Total Vendor Cost',  value: formatCurrencyShort(totalCost),    delta: '', icon: TrendingDown, color: 'var(--badge-pending)',   bg: 'var(--badge-pending-bg)'   },
    { label: 'Paid to Vendors',    value: formatCurrencyShort(totalPaid),    delta: '', icon: CheckCircle,  color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)' },
    { label: 'Pending Payouts',    value: formatCurrencyShort(totalPending), delta: '', icon: Clock,        color: 'var(--badge-rejected)',  bg: 'var(--badge-rejected-bg)'  },
    { label: 'Awaiting Payment',   value: `${pendingCount} vendors`,         delta: '', icon: Wallet,       color: 'var(--icon-booking)',    bg: 'var(--icon-booking-bg)'    },
  ]

  const [payModal, setPayModal] = useState(null)
  const [method, setMethod]     = useState('UPI')
  const [txnRef, setTxnRef]     = useState('')

  const { page, setPage, totalPages, paginated } = usePagination(rows, 8)

  function openPayModal(row) {
    setPayModal({ apptId: row.apptId, vendorName: row.vendorName, amount: row.amount })
    setMethod('UPI')
    setTxnRef('')
  }

  function handleMarkPaid() {
    if (!payModal) return
    const appt = appointments.find(a => a.id === payModal.apptId)
    if (!appt) return
    const paidDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    const updated = (appt.vendorPayments || []).map(vp =>
      vp.vendorName === payModal.vendorName
        ? { ...vp, paid: true, paidDate, method, note: txnRef }
        : vp
    )
    updateVendorPayments(payModal.apptId, updated)
    setPayModal(null)
  }

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '20px', boxSizing: 'border-box' }}>

      {/* Stats */}
      <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
        {STATS.map(s => <StatsCard key={s.label} {...s} />)}
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Vendor Payments Yet"
          subtitle="Assign artists to appointments and use the Team Payments section on each appointment to set up vendor payment tracking."
        />
      ) : (
        <Card style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
          <CardHeader style={{ flexShrink: 0 }}>
            <span style={{ fontFamily: 'Playfair Display,serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px' }}>
              Vendor Payment Tracker
            </span>
            <span style={{ fontSize: '12px', color: 'var(--dash-text-muted)', fontWeight: 500 }}>
              Payments owed to your team
            </span>
          </CardHeader>

          <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }} className="no-scrollbar">
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  {['Vendor', 'Category', 'Appointment', 'Client', 'Amount', 'Status', 'Action'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left', fontSize: '11px',
                      fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase',
                      letterSpacing: '0.07em', whiteSpace: 'nowrap',
                      position: 'sticky', top: 0, zIndex: 10,
                      background: 'var(--dash-surface)',
                      borderBottom: '1px solid var(--dash-border)',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((row, i) => (
                  <tr
                    key={`${row.apptId}-${row.vendorName}-${i}`}
                    style={{ borderBottom: '1px solid var(--dash-border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-row-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                      {row.vendorName}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--dash-text-secondary)', fontSize: '12px' }}>
                      {row.category}
                    </td>
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontWeight: 600, fontSize: '12px', color: 'var(--dash-text-secondary)' }}>{row.apptId}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--dash-text-muted)' }}>{row.apptDate}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 500, color: 'var(--dash-text-primary)' }}>{row.clientName}</span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--dash-text-muted)' }}>{row.service}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                      {formatCurrency(row.amount || 0)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <VendorPayBadge paid={row.paid} />
                        {row.paid && row.paidDate && (
                          <span style={{ fontSize: '10px', color: 'var(--dash-text-muted)' }}>
                            {row.paidDate} · {row.method}
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {!row.paid ? (
                        <button
                          onClick={() => openPayModal(row)}
                          style={{
                            padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                            border: '1.5px solid #c9956c',
                            background: '#c9956c', color: '#fff',
                            cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#b5845a' }}
                          onMouseLeave={e => { e.currentTarget.style.background = '#c9956c' }}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--badge-confirmed)', fontWeight: 600 }}>✓ Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 24px', borderTop: '1px solid var(--dash-border)',
            background: 'var(--dash-subtle-row-bg)', flexWrap: 'wrap', gap: '12px',
          }}>
            <span style={{ fontSize: '12.5px', color: 'var(--dash-text-secondary)', fontWeight: 500 }}>
              Showing {rows.length > 0 ? Math.min((page - 1) * 8 + 1, rows.length) : 0}–{Math.min(page * 8, rows.length)} of {rows.length} entries
            </span>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </Card>
      )}

      {/* Mark Paid Modal */}
      <Modal
        open={!!payModal}
        onClose={() => setPayModal(null)}
        title="Mark Vendor Payment"
        onSave={handleMarkPaid}
        saveLabel="Confirm Payment Made"
        width="460px"
      >
        {payModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{
              padding: '14px 18px', borderRadius: '14px',
              background: 'var(--dash-subtle-row-bg)', border: '1.5px solid var(--dash-border)',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--icon-booking)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Payment Summary
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--dash-text-secondary)' }}>Vendor</span>
                <span style={{ fontWeight: 700, color: 'var(--dash-text-primary)' }}>{payModal.vendorName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                <span style={{ color: 'var(--dash-text-secondary)' }}>Appointment</span>
                <span style={{ fontWeight: 600, color: 'var(--dash-text-primary)' }}>{payModal.apptId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid var(--dash-border-subtle)' }}>
                <span style={{ color: 'var(--dash-text-secondary)', fontWeight: 600 }}>Amount</span>
                <span style={{ fontWeight: 800, color: 'var(--dash-text-primary)' }}>{formatCurrency(payModal.amount || 0)}</span>
              </div>
            </div>

            <div>
              <label style={lbl}>Payment Mode *</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {[
                  { id: 'UPI',  icon: Smartphone, label: 'UPI / QR' },
                  { id: 'Cash', icon: Banknote,   label: 'Cash' },
                  { id: 'Card', icon: CreditCard, label: 'Card / NetBank' },
                ].map(({ id, icon: Icon, label }) => (
                  <button key={id} type="button" onClick={() => setMethod(id)} style={{
                    padding: '12px 10px', borderRadius: '12px', border: '2px solid',
                    borderColor: method === id ? '#c9956c' : 'rgba(201,149,108,0.22)',
                    background: method === id ? 'linear-gradient(135deg, rgba(201,149,108,0.16), rgba(232,164,184,0.1))' : 'var(--dash-card-bg)',
                    boxShadow: method === id ? '0 4px 14px rgba(201,149,108,0.22)' : 'none',
                    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px',
                    fontFamily: 'Inter, sans-serif', transition: 'all 0.18s ease',
                  }}>
                    <Icon size={18} style={{ color: method === id ? '#c9956c' : 'var(--dash-text-muted)' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: method === id ? '#8b5a2b' : 'var(--dash-text-secondary)' }}>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={lbl}>Transaction Reference / Note (optional)</label>
              <input
                style={inpStyle}
                placeholder="e.g. GPay Ref #4821033 or Paid in cash"
                value={txnRef}
                onChange={e => setTxnRef(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

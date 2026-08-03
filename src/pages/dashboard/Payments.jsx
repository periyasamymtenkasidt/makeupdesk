import { Smartphone, DollarSign, TrendingUp, Clock, CheckCircle, Check, Hourglass } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import { Card, CardHeader } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency, formatCurrencyShort } from '../../utils/formatCurrency'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { useAppointments } from '../../context/AppointmentContext'
import { sendBalanceInvoiceViaWhatsApp } from '../../utils/whatsapp'

function PaymentStatus({ paid }) {
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

export default function Payments() {
  const { appointments } = useAppointments()

  const active = appointments.filter(a => a.status !== 'Rejected' && a.status !== 'Closed')

  const totalRevenue   = active.reduce((s, a) => s + (a.amount || 0), 0)
  const collected      = active.reduce((s, a) => {
    let c = a.advancePaid ? (a.advanceAmount || 0) : 0
    if (a.balancePaid) c += (a.amount || 0) - (a.advanceAmount || 0)
    return s + c
  }, 0)
  const advPending = active.filter(a => !a.advancePaid).length
  const balPending = active.filter(a => a.advancePaid && !a.balancePaid).length

  const PAYMENT_STATS = [
    { label: 'Total Revenue',   value: formatCurrencyShort(totalRevenue), delta: '+18%', icon: TrendingUp,  color: 'var(--icon-revenue)',    bg: 'var(--icon-revenue-bg)'    },
    { label: 'Collected',       value: formatCurrencyShort(collected),    delta: '+15%', icon: CheckCircle, color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)' },
    { label: 'Advance Pending', value: String(advPending) + ' bookings',  delta: '',     icon: Clock,       color: 'var(--badge-pending)',   bg: 'var(--badge-pending-bg)'   },
    { label: 'Balance Pending', value: String(balPending) + ' bookings',  delta: '',     icon: DollarSign,  color: 'var(--badge-rejected)',  bg: 'var(--badge-rejected-bg)'  },
  ]

  const { page, setPage, totalPages, paginated } = usePagination(active, 6)

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '20px', boxSizing: 'border-box' }}>

      {/* Stats */}
      <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
        {PAYMENT_STATS.map(s => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Table */}
      <Card style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
        <CardHeader style={{ flexShrink: 0 }}>
          <span style={{ fontFamily: 'Playfair Display,serif', fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '17px' }}>
            Payment Tracker
          </span>
          <span style={{ fontSize: '12px', color: 'var(--dash-text-muted)', fontWeight: 500 }}>
            Payment status overview
          </span>
        </CardHeader>
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }} className="no-scrollbar">
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                {['Client', 'Service', 'Total', 'Advance', 'Balance', 'Adv. Status', 'Bal. Status', 'Stage'].map(h => (
                  <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '11px',
                                       fontWeight: 600, color: 'var(--dash-text-muted)', textTransform: 'uppercase',
                                       letterSpacing: '0.07em', whiteSpace: 'nowrap',
                                       position: 'sticky', top: 0, zIndex: 10,
                                       background: 'var(--dash-surface)',
                                       borderBottom: '1px solid var(--dash-border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((p, i) => {
                const balance = (p.amount || 0) - (p.advanceAmount || 0)
                return (
                  <tr key={p.id ?? i}
                    style={{ borderBottom: '1px solid var(--dash-border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-row-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                      {p.name}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--dash-text-secondary)' }}>{p.service}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                      {formatCurrency(p.amount || 0)}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, whiteSpace: 'nowrap',
                                 color: p.advancePaid ? 'var(--badge-confirmed)' : 'var(--badge-pending)' }}>
                      {formatCurrency(p.advanceAmount || 0)}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, whiteSpace: 'nowrap',
                                 color: p.balancePaid ? 'var(--badge-confirmed)' : 'var(--dash-text-muted)' }}>
                      {formatCurrency(balance)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <PaymentStatus paid={p.advancePaid} />
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PaymentStatus paid={p.balancePaid} />
                        {!p.balancePaid && (
                          <button
                            onClick={async () => {
                              const res = await sendBalanceInvoiceViaWhatsApp(p)
                              if (res?.method === 'download_and_whatsapp') {
                                alert(`📄 Balance Invoice PDF downloaded (${res.fileName})\n📲 WhatsApp launched for ${p.name}! Click the attachment 📎 icon in WhatsApp to send.`)
                              }
                            }}
                            title="Send Balance Invoice on WhatsApp"
                            style={{
                              width: '28px', height: '28px', borderRadius: '6px',
                              border: '1px solid rgba(37,211,102,0.4)', background: 'rgba(37,211,102,0.1)',
                              color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s',
                            }}
                          >
                            <Smartphone size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}><Badge status={p.status} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 24px', borderTop: '1px solid var(--dash-border)',
          background: 'var(--dash-subtle-row-bg)', flexWrap: 'wrap', gap: '12px'
        }}>
          <span style={{ fontSize: '12.5px', color: 'var(--dash-text-secondary)', fontWeight: 500 }}>
            Showing {active.length > 0 ? Math.min((page - 1) * 6 + 1, active.length) : 0}–{Math.min(page * 6, active.length)} of {active.length} payments
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>
    </div>
  )
}

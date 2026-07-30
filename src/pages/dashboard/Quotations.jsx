import { useState } from 'react'
import { Send, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { useAppointments } from '../../context/AppointmentContext'
import { formatCurrency } from '../../utils/formatCurrency'
import { generateQuotePDF } from '../../utils/generateQuotePDF'
import SendQuoteModal from '../../components/dashboard/SendQuoteModal'
import { sendQuoteViaWhatsApp } from '../../utils/whatsapp'

const TAB_STATUSES = ['All', 'Inquiry', 'Quotation Sent', 'Approved', 'Rejected']

const QUOTATION_STATUSES = new Set([
  'Inquiry', 'Quotation Sent', 'Approved', 'Rejected',
])


// ── page ──────────────────────────────────────────────────────────────────────
export default function Quotations() {
  const navigate = useNavigate()
  const { appointments, updateAppointment } = useAppointments()
  const [activeTab,   setActiveTab]   = useState('All')
  const [quoteTarget, setQuoteTarget] = useState(null)

  const quotations = appointments.filter(a => QUOTATION_STATUSES.has(a.status))
  const filtered   = activeTab === 'All' ? quotations : quotations.filter(a => a.status === activeTab)

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 8, activeTab)

  async function handleSend(amount, note) {
    updateAppointment(quoteTarget.id, { amount, status: 'Quotation Sent' })
    const res = await sendQuoteViaWhatsApp(quoteTarget, amount, note)
    if (res?.method === 'download_and_whatsapp') {
      alert(`📄 Quote PDF downloaded (${res.fileName})\n📲 WhatsApp launched! In the WhatsApp window, click the attachment 📎 icon to attach the PDF file.`)
    }
    setQuoteTarget(null)
  }

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Tabs & Pipeline Count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {TAB_STATUSES.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
                ...(activeTab === tab
                  ? { background: 'var(--dash-filter-active-bg)', color: 'var(--dash-filter-active-tx)', border: '1px solid transparent' }
                  : { background: 'var(--dash-filter-wrap)', color: 'var(--dash-filter-muted-tx)', border: '1px solid var(--dash-border)' }
                ),
              }}>
              {tab}
              {tab !== 'All' && (
                <span style={{
                  marginLeft: '6px', fontSize: '10px', fontWeight: 700,
                  padding: '1px 6px', borderRadius: '9999px',
                  background: activeTab === tab ? 'rgba(255,255,255,0.25)' : 'var(--dash-subtle-row-bg)',
                  color: activeTab === tab ? 'white' : 'var(--dash-text-muted)',
                }}>
                  {appointments.filter(a => a.status === tab).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <span style={{ fontSize: '12.5px', color: 'var(--dash-text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
          {quotations.length} lead{quotations.length !== 1 ? 's' : ''} in pipeline
        </span>
      </div>

      {/* Table */}
      <Card style={{ overflow: 'hidden', padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid rgba(201,149,108,0.2)' }}>
                {['Appt ID', 'Client', 'Service', 'Event Date', 'Amount', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '13px 20px', textAlign: 'left', fontSize: '10.5px',
                    fontWeight: 700, color: '#a0622a', textTransform: 'uppercase',
                    letterSpacing: '0.08em', whiteSpace: 'nowrap',
                    background: 'rgba(201,149,108,0.07)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map((q, i) => (
                <tr key={q.id}
                  style={{
                    borderBottom: '1px solid var(--dash-border-subtle)',
                    background: i % 2 !== 0 ? 'var(--dash-subtle-row-bg)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-row-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 !== 0 ? 'var(--dash-subtle-row-bg)' : 'transparent'}
                >
                  <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                    <span
                      onClick={() => navigate(`/dashboard/appointments/${q.id}`)}
                      style={{
                        fontSize: '12px', fontWeight: 700,
                        fontFamily: '"Courier New",Courier,monospace',
                        color: 'var(--icon-booking)', background: 'var(--icon-booking-bg)',
                        padding: '3px 8px', borderRadius: '6px',
                        border: '1px solid var(--dash-border-subtle)',
                        cursor: 'pointer', transition: 'opacity 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      {q.id}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                    {q.name}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                    {q.service}
                  </td>
                  <td style={{ padding: '14px 20px', color: 'var(--dash-text-secondary)', whiteSpace: 'nowrap', fontWeight: 500 }}>
                    {q.date}
                  </td>
                  <td style={{ padding: '14px 20px', fontWeight: 700, color: 'var(--dash-text-primary)', whiteSpace: 'nowrap' }}>
                    {q.amount ? formatCurrency(q.amount) : '—'}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <Badge status={q.status} />
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <Button variant="ghost" size="xs" onClick={() => navigate(`/dashboard/appointments/${q.id}`)}>
                        <Eye size={12} /> View
                      </Button>
                      {q.status === 'Inquiry' && (
                        <Button variant="primary" size="xs" onClick={() => setQuoteTarget(q)}>
                          <Send size={12} /> Send Quote
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginated.length === 0 && (
          <div style={{ textAlign: 'center', padding: '52px', color: 'var(--dash-text-muted)', fontSize: '14px' }}>
            No {activeTab === 'All' ? '' : activeTab.toLowerCase() + ' '}leads found.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 20px' }}>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </Card>

      {quoteTarget && (
        <SendQuoteModal
          appt={quoteTarget}
          onClose={() => setQuoteTarget(null)}
          onSend={handleSend}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { Send, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { useAppointments } from '../../context/AppointmentContext'
import { generateQuotePDF } from '../../utils/generateQuotePDF'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import SendQuoteModal from '../../components/dashboard/SendQuoteModal'
import { sendQuoteViaWhatsApp } from '../../utils/whatsapp'

const TAB_STATUSES = ['All', 'Inquiry', 'Quotation Sent', 'Approved', 'Rejected']

const QUOTATION_STATUSES = new Set([
  'Inquiry', 'Quotation Sent', 'Approved', 'Rejected',
])

export default function Quotations() {
  const navigate = useNavigate()
  const { appointments, updateAppointment } = useAppointments()
  const [activeTab,   setActiveTab]   = useState('All')
  const [quoteTarget, setQuoteTarget] = useState(null)

  const quotations = appointments.filter(a => QUOTATION_STATUSES.has(a.status))
  const filtered   = activeTab === 'All' ? quotations : quotations.filter(a => a.status === activeTab)

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 6, activeTab)

  async function handleSend(amount, note) {
    updateAppointment(quoteTarget.id, { amount, status: 'Quotation Sent' })
    const res = await sendQuoteViaWhatsApp(quoteTarget, amount, note)
    if (res?.method === 'download_and_whatsapp') {
      alert(`📄 Quote PDF downloaded (${res.fileName})\n📲 WhatsApp launched! In the WhatsApp window, click the attachment 📎 icon to attach the PDF file.`)
    }
    setQuoteTarget(null)
  }

  return (
    <>
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>

        {/* Tabs & Pipeline Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {TAB_STATUSES.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '7px 16px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', border: 'none',
                  ...(activeTab === tab
                    ? { background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)', color: '#ffffff', boxShadow: '0 2px 8px rgba(201,149,108,0.35)' }
                    : { background: 'var(--dash-surface)', color: 'var(--dash-text-secondary)', border: '1px solid var(--dash-border)' }
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
        <Card style={{ overflow: 'hidden', padding: 0, flex: 1 }}>
          <AppointmentTable
            appointments={paginated}
            renderRowActions={q => (
              <>
                <Button variant="ghost" size="xs" onClick={() => navigate(`/dashboard/appointments/${q.id}`)}>
                  <Eye size={12} /> View
                </Button>
                {q.status === 'Inquiry' && (
                  <Button variant="primary" size="xs" onClick={() => setQuoteTarget(q)}>
                    <Send size={12} /> Send Quote
                  </Button>
                )}
              </>
            )}
          />
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>

      </div>

      {quoteTarget && (
        <SendQuoteModal
          appt={quoteTarget}
          onClose={() => setQuoteTarget(null)}
          onSend={handleSend}
        />
      )}
    </>
  )
}

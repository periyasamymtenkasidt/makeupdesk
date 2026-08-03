import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import NewBookingModal from '../../components/dashboard/NewBookingModal'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { usePagination } from '../../hooks/usePagination'
import { useAppointments } from '../../context/AppointmentContext'

const STATUS_TABS = ['All', 'Inquiry', 'Payment Pending','Confirmed', 'Completed']

export default function Appointments() {
  const { appointments, updateStatus, deleteAppointment } = useAppointments()
  const [activeTab, setActiveTab] = useState('All')
  const [search,    setSearch]    = useState('')
  const [openNew,   setOpenNew]   = useState(false)

  const filtered = appointments.filter(a => {
    const matchTab    = activeTab === 'All' || a.status === activeTab
    const matchSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const { page, setPage, totalPages, paginated } = usePagination(filtered, 6, activeTab + search)

  return (
    <>
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '16px', boxSizing: 'border-box' }}>

        {/* Search + Filters + Action */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-rose-gold)', pointerEvents: 'none' }} />
            <input
              placeholder="Search by name or service…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '9px 14px 9px 32px', borderRadius: '10px',
                       border: '1.5px solid var(--dash-border)', fontSize: '13px', color: 'var(--dash-input-text)',
                       background: 'var(--dash-input-bg)', outline: 'none', fontFamily: 'Inter,sans-serif', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {STATUS_TABS.map(tab => (
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
              </button>
            ))}
          </div>

          <Button variant="primary" size="sm" onClick={() => setOpenNew(true)}>
            <Plus size={15} /> New Appointment
          </Button>
        </div>

        {/* Table */}
        <Card style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
          <AppointmentTable
            appointments={paginated}
            onReject={appt => {
              if (window.confirm(`Reject booking for ${appt.name}? This will mark the appointment as rejected.`))
                updateStatus(appt.id, 'Rejected')
            }}
            onDelete={id => deleteAppointment(id)}
          />
        </Card>

        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      <NewBookingModal open={openNew} onClose={() => setOpenNew(false)} />
    </>
  )
}

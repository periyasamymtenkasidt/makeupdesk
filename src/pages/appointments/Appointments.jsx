import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import NewBookingModal from '../../components/dashboard/NewBookingModal'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Pagination } from '../../components/ui/Pagination'
import { TableControls } from '../../components/ui/TableControls'
import { usePagination } from '../../hooks/usePagination'
import { useTableFilters } from '../../hooks/useTableFilters'
import { useAppointments } from '../../context/AppointmentContext'

const STATUS_TABS = ['All', 'Inquiry', 'Payment Pending', 'Confirmed', 'Completed']

const SORTS = [
  { label: 'Date (Newest)', key: 'date',   dir: 'desc' },
  { label: 'Date (Oldest)', key: 'date',   dir: 'asc'  },
  { label: 'Amount ↓',      key: 'amount', dir: 'desc' },
  { label: 'Amount ↑',      key: 'amount', dir: 'asc'  },
  { label: 'Name A–Z',      key: 'name',   dir: 'asc'  },
]

export default function Appointments() {
  const { appointments } = useAppointments()
  const [activeTab, setActiveTab] = useState('All')
  const [openNew,   setOpenNew]   = useState(false)

  const [locFilter, setLocFilter] = useState('all')

  const tabFiltered = useMemo(
    () => appointments
      .filter(a => activeTab === 'All' || a.status === activeTab)
      .filter(a => locFilter === 'all' || a.location === locFilter),
    [appointments, activeTab, locFilter]
  )

  const {
    result, search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo,
    sort, setSort, sorts, hasFilters, clearFilters,
  } = useTableFilters(tabFiltered, { searchFields: ['name', 'service'], dateField: 'date', sorts: SORTS })

  const allHasFilters = hasFilters || locFilter !== 'all'
  function clearAll() { clearFilters(); setLocFilter('all') }

  const filterFields = [
    {
      label: 'Location',
      value: locFilter,
      onChange: setLocFilter,
      options: [
        { label: 'All Locations', value: 'all'    },
        { label: 'Studio',        value: 'Studio' },
        { label: 'Venue',         value: 'Venue'  },
      ],
    },
  ]

  const resetKey = `${activeTab}|${locFilter}|${search}|${dateFrom}|${dateTo}|${sort?.key}|${sort?.dir}`
  const { page, setPage, totalPages, paginated } = usePagination(result, 6, resetKey)

  return (
    <>
      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, gap: '16px', boxSizing: 'border-box' }}>

        {/* Filters row */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <TableControls
            search={search} onSearch={setSearch} searchPlaceholder="Search by name or service…"
            dateFrom={dateFrom} dateTo={dateTo} onDateFrom={setDateFrom} onDateTo={setDateTo}
            sorts={sorts} sort={sort} onSort={setSort}
            filterFields={filterFields}
            hasFilters={allHasFilters} onClear={clearAll}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
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
        </div>

        {/* Table */}
        <Card style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
          <AppointmentTable appointments={paginated} />
        </Card>

        <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>

      {openNew && <NewBookingModal open={openNew} onClose={() => setOpenNew(false)} />}
    </>
  )
}

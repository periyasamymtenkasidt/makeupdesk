import { useState, useMemo } from 'react'
import { Card } from '../../components/ui/Card'
import { Pagination } from '../../components/ui/Pagination'
import { TableControls } from '../../components/ui/TableControls'
import { usePagination } from '../../hooks/usePagination'
import { useTableFilters } from '../../hooks/useTableFilters'
import { useAppointments } from '../../context/AppointmentContext'
import AppointmentTable from '../../components/dashboard/AppointmentTable'

const TAB_STATUSES = ['All', 'Inquiry', 'Shift Reserved', 'Quotation Sent', 'Approved', 'Rejected']

const QUOTATION_STATUSES = new Set([
  'Inquiry', 'Shift Reserved', 'Quotation Sent', 'Approved', 'Rejected',
])

const SORTS = [
  { label: 'Date (Newest)', key: 'date',   dir: 'desc' },
  { label: 'Date (Oldest)', key: 'date',   dir: 'asc'  },
  { label: 'Amount ↓',      key: 'amount', dir: 'desc' },
  { label: 'Amount ↑',      key: 'amount', dir: 'asc'  },
  { label: 'Name A–Z',      key: 'name',   dir: 'asc'  },
]

export default function Quotations() {
  const { appointments } = useAppointments()
  const [activeTab, setActiveTab] = useState('All')

  const quotations = useMemo(
    () => appointments.filter(a => QUOTATION_STATUSES.has(a.status)),
    [appointments]
  )

  const tabFiltered = useMemo(
    () => activeTab === 'All' ? quotations : quotations.filter(a => a.status === activeTab),
    [quotations, activeTab]
  )

  const {
    result, search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo,
    sort, setSort, sorts, hasFilters, clearFilters,
  } = useTableFilters(tabFiltered, { searchFields: ['name', 'service'], dateField: 'date', sorts: SORTS })

  const resetKey = `${activeTab}|${search}|${dateFrom}|${dateTo}|${sort?.key}|${sort?.dir}`
  const { page, setPage, totalPages, paginated } = usePagination(result, 6, resetKey)

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>

      {/* Filters + Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <TableControls
          search={search} onSearch={setSearch} searchPlaceholder="Search by name or service…"
          dateFrom={dateFrom} dateTo={dateTo} onDateFrom={setDateFrom} onDateTo={setDateTo}
          sorts={sorts} sort={sort} onSort={setSort}
          hasFilters={hasFilters} onClear={clearFilters}
        />
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
      </div>

      {/* Table */}
      <Card style={{ overflow: 'hidden', padding: 0, flex: 1 }}>
        <AppointmentTable appointments={paginated} />
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

    </div>
  )
}

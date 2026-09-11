import { useState, useEffect, useRef } from 'react'
import { Search, CalendarRange, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react'
import { DateRangePopup } from './DateRangePopup'

const INPUT_STYLE = {
  paddingLeft: '30px', paddingRight: '12px',
  paddingTop: '8.5px', paddingBottom: '8.5px',
  borderRadius: '10px', border: '1.5px solid var(--dash-border)',
  fontSize: '13px', color: 'var(--dash-input-text)',
  background: 'var(--dash-input-bg)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', width: '100%',
}

function IconBtn({ active, dot, onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        position: 'relative', width: '36px', height: '36px', borderRadius: '10px',
        border: `1.5px solid ${active ? '#c9956c' : 'var(--dash-border)'}`,
        background: active ? 'rgba(201,149,108,0.12)' : 'var(--dash-input-bg)',
        color: active ? '#c9956c' : 'var(--dash-text-secondary)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
      }}
    >
      {children}
      {dot && (
        <span style={{
          position: 'absolute', top: '5px', right: '5px',
          width: '6px', height: '6px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #c9956c, #d4728f)',
          pointerEvents: 'none',
        }} />
      )}
    </button>
  )
}

export function TableControls({
  search, onSearch, searchPlaceholder = 'Search…',
  dateFrom, dateTo, onDateFrom, onDateTo,
  sorts, sort, onSort,
  filterFields,
  hasFilters, onClear,
}) {
  const [open, setOpen] = useState(null)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(null)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  function toggle(panel) {
    setOpen(o => o === panel ? null : panel)
  }

  const hasDate    = !!(dateFrom || dateTo)
  const sortActive = !!(sorts?.length && sort && (sort.key !== sorts[0]?.key || sort.dir !== sorts[0]?.dir))
  const filterActive = !!(filterFields?.some(f => f.value !== f.options?.[0]?.value))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

      {/* Search input */}
      {onSearch != null && (
        <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '300px' }}>
          <Search size={13} style={{
            position: 'absolute', left: '10px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--color-rose-gold)', pointerEvents: 'none',
          }} />
          <input
            placeholder={searchPlaceholder}
            value={search}
            onChange={e => onSearch(e.target.value)}
            style={INPUT_STYLE}
          />
        </div>
      )}

      {/* Icon buttons + popups — pinned to the right */}
      <div ref={ref} style={{ position: 'relative', display: 'flex', gap: '4px', alignItems: 'center', marginLeft: 'auto' }}>

        {/* Calendar */}
        {onDateFrom != null && (
          <IconBtn active={open === 'date'} dot={hasDate} onClick={() => toggle('date')} title="Date Range">
            <CalendarRange size={15} />
          </IconBtn>
        )}

        {/* Sort */}
        {sorts?.length > 0 && (
          <IconBtn active={open === 'sort'} dot={sortActive} onClick={() => toggle('sort')} title="Sort">
            <ArrowUpDown size={15} />
          </IconBtn>
        )}

        {/* Filter */}
        {filterFields?.length > 0 && (
          <IconBtn active={open === 'filter'} dot={filterActive} onClick={() => toggle('filter')} title="Filter">
            <SlidersHorizontal size={15} />
          </IconBtn>
        )}

        {/* Clear */}
        {hasFilters && (
          <button
            onClick={() => { onClear(); setOpen(null) }}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '4px',
              padding: '7px 12px', borderRadius: '9999px',
              fontSize: '12px', fontWeight: 600,
              border: '1.5px solid rgba(201,149,108,0.4)',
              background: 'rgba(201,149,108,0.08)', color: '#c9956c',
              cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0,
            }}
          >
            <X size={12} /> Clear
          </button>
        )}

        {/* ── Date range popup ── */}
        {open === 'date' && (
          <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 1000 }}>
            <DateRangePopup
              dateFrom={dateFrom}
              dateTo={dateTo}
              onApply={(from, to) => { onDateFrom(from); onDateTo(to); setOpen(null) }}
              onClose={() => setOpen(null)}
            />
          </div>
        )}

        {/* ── Sort popup ── */}
        {open === 'sort' && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 1000,
            background: 'var(--dash-card-bg)', borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.16)', border: '1px solid var(--dash-border)',
            minWidth: '210px', overflow: 'hidden',
          }}>
            <div style={{
              padding: '12px 16px 8px', fontWeight: 700, fontSize: '11px',
              color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em',
            }}>
              Sort By
            </div>
            {sorts.map(s => {
              const isActive = sort?.key === s.key && sort?.dir === s.dir
              return (
                <button
                  key={`${s.key}|${s.dir}`}
                  onClick={() => { onSort(s); setOpen(null) }}
                  style={{
                    width: '100%', textAlign: 'left', padding: '10px 16px',
                    border: 'none',
                    background: isActive ? 'rgba(201,149,108,0.1)' : 'transparent',
                    color: isActive ? '#c9956c' : 'var(--dash-text-primary)',
                    fontSize: '13.5px', fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--dash-row-hover)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                >
                  <span>{s.label}</span>
                  {isActive && (
                    <span style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: '#c9956c', flexShrink: 0,
                    }} />
                  )}
                </button>
              )
            })}
            <div style={{ height: '8px' }} />
          </div>
        )}

        {/* ── Filter popup ── */}
        {open === 'filter' && filterFields?.length > 0 && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 1000,
            background: 'var(--dash-card-bg)', borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.16)', border: '1px solid var(--dash-border)',
            minWidth: '230px', padding: '16px',
          }}>
            <div style={{
              fontWeight: 700, fontSize: '11px', color: 'var(--dash-text-muted)',
              textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px',
            }}>
              Filter Options
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filterFields.map(field => (
                <div key={field.label}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
                    marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>
                    {field.label}
                  </div>
                  <select
                    value={field.value}
                    onChange={e => field.onChange(e.target.value)}
                    style={{
                      width: '100%', padding: '8px 10px', borderRadius: '9px',
                      border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
                      color: 'var(--dash-input-text)', fontSize: '13px',
                      fontFamily: 'Inter, sans-serif', outline: 'none', cursor: 'pointer',
                    }}
                  >
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

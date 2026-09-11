import { useState, useMemo } from 'react'

export function useTableFilters(items, {
  searchFields = [],
  dateField    = 'date',
  sorts        = [],
} = {}) {
  const [search,   setSearch]   = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo,   setDateTo]   = useState('')
  const [sort,     setSort]     = useState(sorts[0] || null)

  const hasFilters = !!(search || dateFrom || dateTo) ||
    (sorts.length > 0 && sort && (sort.key !== sorts[0].key || sort.dir !== sorts[0].dir))

  function clearFilters() {
    setSearch('')
    setDateFrom('')
    setDateTo('')
    setSort(sorts[0] || null)
  }

  const result = useMemo(() => {
    let out = items

    if (search) {
      const q = search.toLowerCase()
      out = out.filter(item =>
        searchFields.some(f => String(item[f] ?? '').toLowerCase().includes(q))
      )
    }

    if (dateFrom || dateTo) {
      const from = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0)     : null
      const to   = dateTo   ? new Date(dateTo).setHours(23, 59, 59, 999)  : null
      out = out.filter(item => {
        const ts = item[dateField] ? new Date(item[dateField]).getTime() : null
        if (!ts || isNaN(ts)) return true
        if (from && ts < from) return false
        if (to   && ts > to)   return false
        return true
      })
    }

    if (sort) {
      out = [...out].sort((a, b) => {
        const av = a[sort.key]
        const bv = b[sort.key]
        let cmp
        if (typeof av === 'number' || typeof bv === 'number') {
          cmp = (av || 0) - (bv || 0)
        } else {
          const ad = new Date(av)
          const bd = new Date(bv)
          if (!isNaN(ad) && !isNaN(bd)) {
            cmp = ad - bd
          } else {
            cmp = String(av ?? '').toLowerCase().localeCompare(String(bv ?? '').toLowerCase())
          }
        }
        return sort.dir === 'desc' ? -cmp : cmp
      })
    }

    return out
  }, [items, search, dateFrom, dateTo, sort])

  return {
    result,
    search,   setSearch,
    dateFrom, setDateFrom,
    dateTo,   setDateTo,
    sort,     setSort,
    sorts,
    hasFilters,
    clearFilters,
  }
}

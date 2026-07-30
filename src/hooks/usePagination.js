import { useState, useMemo, useEffect } from 'react'

export function usePagination(items, pageSize = 6, resetKey = '') {
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [resetKey])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const clampedPage = Math.min(page, totalPages)

  const paginated = useMemo(
    () => items.slice((clampedPage - 1) * pageSize, clampedPage * pageSize),
    [items, clampedPage, pageSize]
  )

  return { page: clampedPage, setPage, totalPages, paginated }
}

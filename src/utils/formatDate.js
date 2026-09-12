const SHORT_OPTS = { day: 'numeric', month: 'short', year: 'numeric' }
const LONG_OPTS  = { day: 'numeric', month: 'long',  year: 'numeric' }

// Normalises any date string to YYYY-MM-DD (ISO).
// Handles both 'Jul 26, 2026' (legacy locale) and '2026-07-26' (ISO) safely.
export function parseToISO(d) {
  if (!d) return ''
  const s = String(d).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s   // already ISO – pass through
  const dt = new Date(s)
  if (isNaN(dt.getTime())) return ''
  const y  = dt.getFullYear()
  const mo = String(dt.getMonth() + 1).padStart(2, '0')
  const dy = String(dt.getDate()).padStart(2, '0')
  return `${y}-${mo}-${dy}`
}

export const formatDate      = (d) => new Date(parseToISO(d) + 'T00:00:00').toLocaleDateString('en-IN', SHORT_OPTS)
export const formatDateLong  = (d) => new Date(parseToISO(d) + 'T00:00:00').toLocaleDateString('en-IN', LONG_OPTS)
export const formatDateInput = (d) => parseToISO(d)

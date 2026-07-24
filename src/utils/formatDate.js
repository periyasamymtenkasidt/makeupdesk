const SHORT_OPTS = { day: 'numeric', month: 'short', year: 'numeric' }
const LONG_OPTS  = { day: 'numeric', month: 'long',  year: 'numeric' }

export const formatDate      = (d) => new Date(d).toLocaleDateString('en-IN', SHORT_OPTS)
export const formatDateLong  = (d) => new Date(d).toLocaleDateString('en-IN', LONG_OPTS)
export const formatDateInput = (d) => {
  if (!d) return ''
  const dt = new Date(d)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  return `${dt.getFullYear()}-${mm}-${dd}`
}

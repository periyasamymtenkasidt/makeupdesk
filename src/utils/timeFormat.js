// "05:30 AM" → "05:30"  (for <input type="time">)
export function to24h(str) {
  if (!str) return ''
  const parts = str.trim().split(' ')
  if (parts.length === 1) return str // already HH:MM
  const [time, period] = parts
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// "05:30" → "05:30 AM"  (for storage)
export function to12h(str) {
  if (!str) return ''
  const [h, m] = str.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${period}`
}

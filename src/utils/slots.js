import { to12h } from './timeFormat'

const BLOCKING_STATUSES = new Set([
  'Shift Reserved', 'Approved', 'Payment Pending',
  'Advance Paid', 'Confirmed', 'In Progress',
  'Completed', 'Balance Paid', 'Closed',
])

function parseTimeMins(str) {
  if (!str) return 0
  const parts = str.trim().split(' ')
  const [h, m] = parts[0].split(':').map(Number)
  let hours = h
  if (parts[1] === 'PM' && h !== 12) hours += 12
  if (parts[1] === 'AM' && h === 12) hours = 0
  return hours * 60 + (m || 0)
}

export function parseDurationMins(dur) {
  if (!dur) return 120
  const range = dur.match(/(\d+\.?\d*)[–\-](\d+\.?\d*)/)
  if (range) return Math.ceil(parseFloat(range[2]) * 60)
  const single = dur.match(/(\d+\.?\d*)/)
  return single ? Math.ceil(parseFloat(single[1]) * 60) : 120
}

function isSameDate(apptDateStr, inputDateStr) {
  const d = new Date(apptDateStr)
  const [y, mo, day] = inputDateStr.split('-').map(Number)
  return d.getFullYear() === y && d.getMonth() + 1 === mo && d.getDate() === day
}

/**
 * Generate time slots for a given date.
 * @param {string}      date                 - "YYYY-MM-DD"
 * @param {object}      availability         - from AvailabilityContext (studio hours)
 * @param {array}       appointments         - all appointments from context
 * @param {number}      serviceDurationMins
 * @param {string|null} excludeId            - appointment id to skip in conflict check (edit flow)
 * @param {number|null} vendorId             - only flag conflicts for this artist; null = no filtering
 * @returns {{ value, label, booked }[]}
 */
export function generateSlots(date, availability, appointments, serviceDurationMins = 60, excludeId = null, vendorId = null) {
  if (!date) return []

  const dayOfWeek = new Date(date + 'T00:00:00').getDay()
  if (!availability.workDays.includes(dayOfWeek)) return []

  const [startH, startM] = availability.startTime.split(':').map(Number)
  const [endH,   endM]   = availability.endTime.split(':').map(Number)
  const dayStart = startH * 60 + startM
  const dayEnd   = endH   * 60 + endM
  const interval = availability.slotInterval || 30

  const slots = []
  for (let t = dayStart; t + serviceDurationMins <= dayEnd; t += interval) {
    const slotEnd = t + serviceDurationMins

    const booked = appointments.some(appt => {
      if (excludeId && appt.id === excludeId)    return false
      if (!BLOCKING_STATUSES.has(appt.status))   return false
      if (!isSameDate(appt.date, date))           return false
      // Only block if same artist — artist is always available unless already booked
      if (vendorId !== null && appt.vendorId !== vendorId) return false
      const start = parseTimeMins(appt.time)
      const end   = start + parseDurationMins(appt.duration)
      return !(slotEnd <= start || t >= end)
    })

    const hh    = Math.floor(t / 60)
    const mm    = t % 60
    const value = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
    slots.push({ value, label: to12h(value), booked })
  }
  return slots
}

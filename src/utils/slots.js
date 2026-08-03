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

/**
 * Return free time windows on a given date for a given artist.
 * Windows shorter than durationMins are excluded.
 * Returns [] when the day has no blocking appointments (caller shows "fully free").
 *
 * @param {string}      date
 * @param {array}       appointments
 * @param {number|null} vendorId
 * @param {number}      durationMins   - Minimum window length to include
 * @param {number}      bufferMins     - Travel buffer around each booking
 * @returns {{ start: number, end: number }[]}  (minutes-from-midnight)
 */
export function getFreeWindows(date, appointments, vendorId = null, durationMins = 120, bufferMins = 120) {
  if (!date) return []

  const blocked = appointments
    .filter(appt => {
      if (!BLOCKING_STATUSES.has(appt.status))             return false
      if (!isSameDate(appt.date, date))                    return false
      if (vendorId !== null && appt.vendorId !== vendorId) return false
      return true
    })
    .map(appt => {
      const s = parseTimeMins(appt.time)
      const e = s + (appt.totalDurationMins || parseDurationMins(appt.duration))
      return { start: Math.max(0, s - bufferMins), end: Math.min(1440, e + bufferMins) }
    })
    .sort((a, b) => a.start - b.start)

  if (blocked.length === 0) return []

  const windows = []
  let cursor = 0

  for (const blk of blocked) {
    if (blk.start > cursor && blk.start - cursor >= durationMins) {
      windows.push({ start: cursor, end: blk.start })
    }
    cursor = Math.max(cursor, blk.end)
  }

  if (cursor < 1440 && 1440 - cursor >= durationMins) {
    windows.push({ start: cursor, end: 1440 })
  }

  return windows
}

/**
 * Check whether a proposed time is available for a given artist.
 * Accounts for a ±bufferMins travel window around every booked appointment.
 *
 * @param {string}      timeHHMM      - Proposed start time "HH:MM" (24-h)
 * @param {number}      durationMins  - Duration of the proposed appointment
 * @param {string}      date          - "YYYY-MM-DD"
 * @param {array}       appointments
 * @param {any}         excludeId     - Appointment id to skip (edit flow)
 * @param {number|null} vendorId      - Only check conflicts for this artist
 * @param {number}      bufferMins    - Travel buffer before/after each booking (default 120)
 * @returns {{ available: boolean|null }}
 */
export function checkTimeAvailability(timeHHMM, durationMins, date, appointments, excludeId = null, vendorId = null, bufferMins = 120) {
  if (!timeHHMM || !date) return { available: null }

  const [hh, mm] = timeHHMM.split(':').map(Number)
  const newStart = hh * 60 + mm
  const newEnd   = newStart + (durationMins || 120)

  const conflict = appointments.some(appt => {
    if (excludeId && appt.id === excludeId)             return false
    if (!BLOCKING_STATUSES.has(appt.status))            return false
    if (!isSameDate(appt.date, date))                   return false
    if (vendorId !== null && appt.vendorId !== vendorId) return false

    const existStart = parseTimeMins(appt.time)
    const existEnd   = existStart + (appt.totalDurationMins || parseDurationMins(appt.duration))
    // Conflict: proposed window overlaps the existing appointment's blocked window (±buffer)
    return newStart < (existEnd + bufferMins) && newEnd > (existStart - bufferMins)
  })

  return { available: !conflict }
}

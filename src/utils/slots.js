/**
 * Returns the earliest bookable minute-of-day for a given date.
 * - Past date  → Infinity  (nothing bookable)
 * - Today      → now + 120 min (2-hour lead time)
 * - Future     → 0          (only studio hours constrain it)
 */
export function earliestBookableMins(dateStr) {
  const today = new Date().toISOString().split('T')[0]
  if (dateStr < today) return Infinity
  if (dateStr === today) {
    const now = new Date()
    return now.getHours() * 60 + now.getMinutes() + 120
  }
  return 0
}

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

  const cutoff = earliestBookableMins(date)
  if (cutoff === Infinity) return []

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
  let cursor = cutoff

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

  const cutoff = earliestBookableMins(date)
  const [hh, mm] = timeHHMM.split(':').map(Number)
  const newStart = hh * 60 + mm
  const newEnd   = newStart + (durationMins || 120)

  if (newStart < cutoff) return { available: false }

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

// ── team-based availability ────────────────────────────────────────────────────

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function isAssignedToArtist(appt, artistName) {
  const name = artistName.toLowerCase()
  if (appt.artist && appt.artist.toLowerCase().includes(name)) return true
  if (Array.isArray(appt.assignedArtists) && appt.assignedArtists.some(n => n && n.toLowerCase() === name)) return true
  if (appt.assignedArtists && typeof appt.assignedArtists === 'object' && !Array.isArray(appt.assignedArtists)) {
    if (Object.values(appt.assignedArtists).some(n => n && String(n).toLowerCase().includes(name))) return true
  }
  return false
}

/**
 * Returns the team's working window on a given date as { start, end } in minutes.
 * start = earliest shiftStart among artists working that day.
 * end   = latest shiftEnd among artists working that day.
 * Returns null if no artist works on that date.
 */
export function getTeamWorkWindow(artists, dateStr) {
  if (!dateStr || !artists || artists.length === 0) return null
  const dayName = DAY_NAMES[new Date(dateStr + 'T00:00:00').getDay()]
  let earliest = Infinity, latest = -Infinity
  for (const a of artists) {
    if (a.availability === 'Inactive') continue
    const workDays = a.workDays || DAY_NAMES
    if (!workDays.includes(dayName)) continue
    const [ssh, ssm] = (a.shiftStart || '05:00').split(':').map(Number)
    const [seh, sem] = (a.shiftEnd   || '21:00').split(':').map(Number)
    earliest = Math.min(earliest, ssh * 60 + ssm)
    latest   = Math.max(latest,   seh * 60 + sem)
  }
  if (earliest === Infinity) return null
  return { start: earliest, end: latest }
}

/**
 * Returns a Set of slot-start minutes where at least one artist is free.
 * Accounts for work days, shift hours, the 2-hour booking cutoff, and appointment conflicts.
 */
export function getTeamOpenMinutes(artists, dateStr, appointments, durationMins = 120, slotInterval = 30) {
  if (!dateStr || !artists || artists.length === 0) return new Set()
  const cutoff  = earliestBookableMins(dateStr)
  if (cutoff === Infinity) return new Set()
  const dayName = DAY_NAMES[new Date(dateStr + 'T00:00:00').getDay()]
  const open    = new Set()

  for (const artist of artists) {
    if (artist.availability === 'Inactive') continue
    const workDays = artist.workDays || DAY_NAMES
    if (!workDays.includes(dayName)) continue

    const [ssh, ssm] = (artist.shiftStart || '05:00').split(':').map(Number)
    const [seh, sem] = (artist.shiftEnd   || '21:00').split(':').map(Number)
    const shiftStart = ssh * 60 + ssm
    const shiftEnd   = seh * 60 + sem

    const artistAppts = appointments.filter(a =>
      BLOCKING_STATUSES.has(a.status) && isSameDate(a.date, dateStr) && isAssignedToArtist(a, artist.name)
    )

    for (let t = shiftStart; t + durationMins <= shiftEnd; t += slotInterval) {
      if (t < cutoff) continue
      const slotEnd = t + durationMins
      const booked  = artistAppts.some(a => {
        const s = parseTimeMins(a.time)
        const e = s + parseDurationMins(a.duration)
        return !(slotEnd <= s || t >= e)
      })
      if (!booked) open.add(t)
    }
  }

  return open
}

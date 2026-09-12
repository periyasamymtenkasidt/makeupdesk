import { useMaster } from './useMaster'
import { VENDOR_KEY, VENDOR_DEFAULTS } from '../data/vendors'
import { parseDurationMins } from '../utils/slots'
import { parseToISO } from '../utils/formatDate'

export const BOOKING_STAFF_CATEGORIES = [
  'Makeup Artist',
  'Hair Stylist',
  'Saree Draper',
  'Assistant Makeup Artist',
  'Mehendi Artist',
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function useArtists() {
  const { items } = useMaster(VENDOR_KEY, VENDOR_DEFAULTS)
  return items.filter(v =>
    (BOOKING_STAFF_CATEGORIES.includes(v.category) || v.category === 'Studio Artist') && v.availability !== 'Inactive'
  )
}

/**
 * Returns true if the artist's schedule allows them to work at the given date/time.
 * Checks work days and shift hours only — does NOT check appointment conflicts.
 */
export function isArtistAvailableAt(artist, dateStr, startTimeHHMM, durationMins = 120) {
  if (!artist || !dateStr || !startTimeHHMM) return true

  // Work day check
  const dayName = DAY_NAMES[new Date(dateStr + 'T00:00:00').getDay()]
  const workDays = artist.workDays || DAY_NAMES
  if (!workDays.includes(dayName)) return false

  // Shift hours check
  const [ssh, ssm] = (artist.shiftStart || '05:00').split(':').map(Number)
  const [seh, sem] = (artist.shiftEnd   || '21:00').split(':').map(Number)
  const shiftStart = ssh * 60 + ssm
  const shiftEnd   = seh * 60 + sem

  const [hh, mm] = startTimeHHMM.split(':').map(Number)
  const slotStart = hh * 60 + mm
  const slotEnd   = slotStart + durationMins

  return slotStart >= shiftStart && slotEnd <= shiftEnd
}

/**
 * Checks if an artist is assigned to a given appointment record.
 */
function isAssignedTo(appt, artistName) {
  const name = artistName.toLowerCase()
  if (appt.artist && appt.artist.toLowerCase().includes(name)) return true
  if (Array.isArray(appt.assignedArtists) && appt.assignedArtists.some(n => n && n.toLowerCase() === name)) return true
  if (appt.assignedArtists && typeof appt.assignedArtists === 'object' && !Array.isArray(appt.assignedArtists)) {
    if (Object.values(appt.assignedArtists).some(n => n && String(n).toLowerCase().includes(name))) return true
  }
  return false
}

// Parses both "HH:MM" (24h) and "HH:MM AM/PM" (12h) to minutes from midnight
function toMins(str) {
  if (!str) return null
  const parts = str.trim().split(' ')
  const [h, m] = parts[0].split(':').map(Number)
  let hours = h
  if (parts[1] === 'PM' && h !== 12) hours += 12
  if (parts[1] === 'AM' && h === 12) hours = 0
  return hours * 60 + (m || 0)
}

/**
 * Checks if a specific artist has a conflicting appointment at the given date & time.
 * When selectedTime is provided, checks actual time overlap (not just same-day).
 */
export function checkArtistAvailability(artistName, selectedDate, selectedTime, appointments = [], currentApptId = null, durationMins = 120) {
  if (!artistName || !selectedDate) return { isBooked: false }

  const newStart = toMins(selectedTime)
  const newEnd   = newStart !== null ? newStart + durationMins : null

  const conflict = appointments.find(a => {
    if (currentApptId && String(a.id) === String(currentApptId)) return false
    if (a.status === 'Rejected' || a.status === 'Closed') return false
    const sameDate = parseToISO(a.date) === parseToISO(selectedDate)
    if (!sameDate) return false
    if (!isAssignedTo(a, artistName)) return false

    // If no time given, any appointment on this date counts
    if (newStart === null) return true

    // Check actual time overlap
    const existStart = toMins(a.time)
    const existEnd   = existStart + parseDurationMins(a.duration)
    return newStart < existEnd && newEnd > existStart
  })

  if (conflict) {
    return {
      isBooked: true,
      bookedTime: conflict.time || 'Same Day Slot',
      clientName: conflict.name || 'Existing Booking',
    }
  }

  return { isBooked: false }
}

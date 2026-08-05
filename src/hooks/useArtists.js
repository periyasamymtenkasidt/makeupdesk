import { useMaster } from './useMaster'
import { VENDOR_KEY, VENDOR_DEFAULTS } from '../data/vendors'

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

/**
 * Checks if a specific artist is booked (appointment conflict) AND available per their schedule.
 */
export function checkArtistAvailability(artistName, selectedDate, selectedTime, appointments = [], currentApptId = null) {
  if (!artistName || !selectedDate) return { isBooked: false }

  const conflict = appointments.find(a => {
    if (currentApptId && String(a.id) === String(currentApptId)) return false
    if (a.status === 'Rejected' || a.status === 'Closed') return false
    const sameDate = String(a.date).toLowerCase() === String(selectedDate).toLowerCase()
    if (!sameDate) return false
    return isAssignedTo(a, artistName)
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

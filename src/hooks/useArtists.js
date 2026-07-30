import { useMaster } from './useMaster'
import { VENDOR_KEY, VENDOR_DEFAULTS } from '../data/vendors'

export const BOOKING_STAFF_CATEGORIES = [
  'Makeup Artist',
  'Hair Stylist',
  'Saree Draper',
  'Assistant Makeup Artist',
  'Mehendi Artist',
]

export function useArtists() {
  const { items } = useMaster(VENDOR_KEY, VENDOR_DEFAULTS)
  return items.filter(v =>
    (BOOKING_STAFF_CATEGORIES.includes(v.category) || v.category === 'Studio Artist') && v.availability !== 'Inactive'
  )
}

/**
 * Utility to check if a specific artist/vendor is already booked on a given date/time slot
 */
export function checkArtistAvailability(artistName, selectedDate, selectedTime, appointments = [], currentApptId = null) {
  if (!artistName || !selectedDate) return { isBooked: false }

  const conflict = appointments.find(a => {
    if (currentApptId && String(a.id) === String(currentApptId)) return false
    if (a.status === 'Rejected' || a.status === 'Closed') return false

    // Same date check
    const sameDate = String(a.date).toLowerCase() === String(selectedDate).toLowerCase()
    if (!sameDate) return false

    // Check if artist is assigned (legacy artist string or assignedArtists object)
    let isAssigned = false
    if (a.artist && a.artist.toLowerCase().includes(artistName.toLowerCase())) {
      isAssigned = true
    }
    if (a.assignedArtists && typeof a.assignedArtists === 'object') {
      const assignedNames = Object.values(a.assignedArtists).map(v => String(v).toLowerCase())
      if (assignedNames.some(name => name && name.includes(artistName.toLowerCase()))) {
        isAssigned = true
      }
    }

    return isAssigned
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

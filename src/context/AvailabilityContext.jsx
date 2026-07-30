import { createContext, useContext, useState } from 'react'

const KEY = 'md_availability'

export const DEFAULT_AVAILABILITY = {
  workDays:     [1, 2, 3, 4, 5, 6], // Mon–Sat (0 = Sun)
  startTime:    '05:00',
  endTime:      '21:00',
  slotInterval: 30,                  // minutes
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...DEFAULT_AVAILABILITY, ...JSON.parse(raw) } : DEFAULT_AVAILABILITY
  } catch { return DEFAULT_AVAILABILITY }
}

const Ctx = createContext(null)

export function AvailabilityProvider({ children }) {
  const [availability, setAvailability] = useState(load)

  function updateAvailability(data) {
    const next = { ...availability, ...data }
    setAvailability(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  return (
    <Ctx.Provider value={{ availability, updateAvailability }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAvailability() {
  return useContext(Ctx)
}

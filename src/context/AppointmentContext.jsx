import { createContext, useContext, useState, useMemo } from 'react'
import { SERVICES } from '../data/services'
import { VENDOR_KEY, VENDOR_DEFAULTS } from '../data/vendors'
import { useClients } from './ClientContext'

const KEY = 'md_appointments'

const INITIAL = [
  { id: 'APT-001', vendorId: 1, clientId: 'CLT-001', name: 'Priya Mehta',   phone: '98765 43210', service: 'Bridal Makeup',    date: 'Jul 26, 2026', time: '05:30 AM', duration: '3 hrs',    status: 'Confirmed',       amount: 12000, advanceAmount: 4000, advancePaid: true,  balancePaid: false, location: 'Venue', venue: 'Grand Convention Center (EC)' },
  { id: 'APT-002', vendorId: 1, clientId: 'CLT-002', name: 'Anjali Sharma', phone: ' 91234 56789', service: 'Party Makeup',     date: 'Jul 27, 2026', time: '06:00 PM', duration: '2 hrs',    status: 'Payment Pending', amount: 4500,  advanceAmount: 1500, advancePaid: false, balancePaid: false, location: 'Studio', venue: '' },
  { id: 'APT-003', vendorId: 7, clientId: 'CLT-003', name: 'Kavya Nair',    phone: ' 99887 76655', service: 'HD Makeup',        date: 'Jul 28, 2026', time: '02:00 PM', duration: '1.75 hrs', status: 'Quotation Sent',  amount: 5000,  advanceAmount: 2000, advancePaid: false, balancePaid: false, location: 'Studio', venue: '' },
  { id: 'APT-004', vendorId: 1, clientId: 'CLT-004', name: 'Ritika Joshi',  phone: ' 87654 32109', service: 'Pre-Wedding',      date: 'Jul 30, 2026', time: '07:00 AM', duration: '2.5 hrs',  status: 'Confirmed',       amount: 7500,  advanceAmount: 2500, advancePaid: true,  balancePaid: false, location: 'Venue', venue: '5-Star Hotel Ballroom (EC)' },
  { id: 'APT-005', vendorId: 7, clientId: 'CLT-005', name: 'Meera Iyer',    phone: ' 76543 21098', service: 'Airbrush Makeup',  date: 'Aug 01, 2026', time: '05:00 AM', duration: '3.5 hrs',  status: 'Inquiry',         amount: 6000,  advanceAmount: 2000, advancePaid: false, balancePaid: false, location: 'Venue', venue: 'Luxury Resort Property (EC)' },
  { id: 'APT-006', vendorId: 1, clientId: 'CLT-006', name: 'Sunita Rao',    phone: ' 85432 10987', service: 'Editorial Makeup', date: 'Aug 03, 2026', time: '10:00 AM', duration: '2 hrs',    status: 'Advance Paid',    amount: 8000,  advanceAmount: 3000, advancePaid: true,  balancePaid: false, location: 'Studio', venue: '' },
  { id: 'APT-007', vendorId: 1, clientId: 'CLT-007', name: 'Deepa Verma',   phone: ' 74321 09876', service: 'Bridal Makeup',    date: 'Aug 05, 2026', time: '05:30 AM', duration: '3 hrs',    status: 'Shift Reserved',  amount: 15000, advanceAmount: 5000, advancePaid: false, balancePaid: false, location: 'Venue', venue: 'Outdoor Garden & Farmhouse' },
  { id: 'APT-008', vendorId: 7, clientId: 'CLT-008', name: 'Nisha Patil',   phone: ' 63210 98765', service: 'Party Makeup',     date: 'Aug 07, 2026', time: '06:00 PM', duration: '2 hrs',    status: 'Rejected',        amount: 3500,  advanceAmount: 0,    advancePaid: false, balancePaid: false, location: 'Studio', venue: '' },
]

const isTimestampId = id => {
  const n = parseInt((id || '').replace('APT-', ''), 10)
  return !isNaN(n) && n > 9999
}

function nextId(appointments) {
  const max = appointments.reduce((m, a) => {
    const n = parseInt((a.id || '').replace('APT-', ''), 10)
    return (!isNaN(n) && n <= 9999) ? Math.max(m, n) : m
  }, 0)
  return 'APT-' + String(max + 1).padStart(3, '0')
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    let records = raw ? JSON.parse(raw) : INITIAL.map(r => ({ ...r }))

    // backfill clientId for records saved before it was added
    records = records.map(a => {
      if (a.clientId !== undefined) return a
      const seed = INITIAL.find(s => s.id === a.id)
      return { ...a, clientId: seed ? seed.clientId : null }
    })

    // backfill amount=0 from service master price
    records = records.map(a => {
      if (a.amount) return a
      const svc = SERVICES.find(s => s.title === a.service)
      return { ...a, amount: svc ? svc.priceRaw : 0 }
    })

    // replace timestamp-based IDs (APT-1785006921701) with sequential APT-NNN
    const maxClean = records.reduce((m, a) => {
      const n = parseInt((a.id || '').replace('APT-', ''), 10)
      return (!isNaN(n) && n <= 9999) ? Math.max(m, n) : m
    }, 0)
    let counter = maxClean
    records = records.map(a => {
      if (!isTimestampId(a.id)) return a
      counter++
      return { ...a, id: 'APT-' + String(counter).padStart(3, '0') }
    })

    // backfill vendorPayments from vendorId / assignedArtists
    let vendorList = VENDOR_DEFAULTS
    try {
      const sv = localStorage.getItem(VENDOR_KEY)
      if (sv) vendorList = JSON.parse(sv)
    } catch {}

    records = records.map(a => {
      if (Array.isArray(a.vendorPayments)) return a
      if (a.status === 'Rejected' || a.status === 'Closed') return a

      if (Array.isArray(a.assignedArtists) && a.assignedArtists.length > 0) {
        const vendorPayments = a.assignedArtists.map(name => {
          const v = vendorList.find(x => x.name === name)
          return { vendorName: name, category: v?.category || 'Other', amount: v?.charges || 0, paid: false, paidDate: null, method: null, note: '' }
        })
        return { ...a, vendorPayments }
      }

      if (a.vendorId) {
        const v = vendorList.find(x => x.id === Number(a.vendorId))
        if (v) {
          return {
            ...a,
            vendorPayments: [{
              vendorName: v.name,
              category: v.category,
              amount: a.vendorCost || v.charges || 0,
              paid: false,
              paidDate: null,
              method: null,
              note: '',
            }],
          }
        }
      }

      return a
    })

    return records
  } catch {
    return INITIAL
  }
}

const Ctx = createContext(null)

export function AppointmentProvider({ children }) {
  const [appointments, setAppointments] = useState(load)
  const clientCtx = useClients()
  const clients = clientCtx?.clients || []
  const updateClient = clientCtx?.updateClient

  // Dynamically enrich appointments with current client details
  const enrichedAppointments = useMemo(() => {
    return appointments.map(a => {
      let client = null
      if (a.clientId) {
        client = clients.find(c => c.id === a.clientId)
      }
      if (!client && a.phone) {
        client = clients.find(c => c.phone === a.phone)
      }
      if (!client && a.name) {
        client = clients.find(c => c.name.toLowerCase() === a.name.toLowerCase())
      }
      if (!client) return a
      return {
        ...a,
        clientId: client.id || a.clientId,
        name: client.name || a.name,
        phone: client.phone || a.phone,
        email: client.email || a.email,
      }
    })
  }, [appointments, clients])

  function mutate(fn) {
    setAppointments(prev => {
      const next = fn(prev)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  function genId()                      { return nextId(appointments) }
  function addAppointment(appt)        { mutate(prev => [appt, ...prev]) }
  function updateStatus(id, status)    { mutate(prev => prev.map(a => a.id === id ? { ...a, status } : a)) }
  function updateAppointment(id, data) {
    mutate(prev => prev.map(a => {
      if (a.id !== id) return a

      const TRACKED = [
        'service', 'date', 'time', 'location', 'venue', 'venueAddress',
        'status', 'amount', 'advanceAmount', 'vendorCost',
        'duration', 'notes', 'artist',
      ]
      const changes = TRACKED.reduce((acc, field) => {
        if (!(field in data)) return acc
        const from = String(a[field] ?? '')
        const to   = String(data[field] ?? '')
        if (from !== to) acc.push({ field, from, to })
        return acc
      }, [])

      const updated = { ...a, ...data }

      if (changes.length > 0) {
        updated.changeLog = [
          ...(a.changeLog || []),
          { timestamp: new Date().toISOString(), changes },
        ]
      }

      if (updated.clientId && updateClient && (data.name || data.phone || data.email)) {
        const patch = {}
        if (data.name)  patch.name  = data.name
        if (data.phone) patch.phone = data.phone
        if (data.email) patch.email = data.email
        updateClient(updated.clientId, patch)
      }
      return updated
    }))
  }
  function deleteAppointment(id)       { mutate(prev => prev.filter(a => a.id !== id)) }
  function updateVendorPayments(id, payments) {
    mutate(prev => prev.map(a => a.id === id ? { ...a, vendorPayments: payments } : a))
  }

  return (
    <Ctx.Provider value={{ appointments: enrichedAppointments, genId, addAppointment, updateStatus, updateAppointment, deleteAppointment, updateVendorPayments }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAppointments() {
  return useContext(Ctx)
}


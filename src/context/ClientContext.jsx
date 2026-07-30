import { createContext, useContext, useState } from 'react'

const KEY = 'md_clients'
const COLORS = ['#e8a4b8','#c9956c','#d4728f','#a87655','#7c3aed','#0891b2','#059669','#b45309','#be185d','#1d4ed8']

const INITIAL = [
  { id:'CLT-001', name:'Priya Mehta',   phone:'+91 98765 43210', email:'priya@email.com',  initials:'PM', color:'#e8a4b8', notes:'', createdAt:'2026-01-15' },
  { id:'CLT-002', name:'Anjali Sharma', phone:'+91 91234 56789', email:'anjali@email.com', initials:'AS', color:'#c9956c', notes:'', createdAt:'2026-02-01' },
  { id:'CLT-003', name:'Kavya Nair',    phone:'+91 99887 76655', email:'kavya@email.com',  initials:'KN', color:'#d4728f', notes:'', createdAt:'2026-02-20' },
  { id:'CLT-004', name:'Ritika Joshi',  phone:'+91 87654 32109', email:'ritika@email.com', initials:'RJ', color:'#a87655', notes:'', createdAt:'2026-03-05' },
  { id:'CLT-005', name:'Meera Iyer',    phone:'+91 76543 21098', email:'meera@email.com',  initials:'MI', color:'#7c3aed', notes:'', createdAt:'2026-03-18' },
  { id:'CLT-006', name:'Sunita Rao',    phone:'+91 85432 10987', email:'sunita@email.com', initials:'SR', color:'#0891b2', notes:'', createdAt:'2026-04-02' },
  { id:'CLT-007', name:'Deepa Verma',   phone:'+91 74321 09876', email:'deepa@email.com',  initials:'DV', color:'#059669', notes:'', createdAt:'2026-04-10' },
  { id:'CLT-008', name:'Nisha Patil',   phone:'+91 63210 98765', email:'nisha@email.com',  initials:'NP', color:'#b45309', notes:'', createdAt:'2026-04-15' },
]

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : INITIAL
  } catch { return INITIAL }
}

function makeInitials(name) {
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function nextId(clients) {
  const max = clients.reduce((m, c) => {
    const n = parseInt((c.id || '').replace('CLT-', ''), 10)
    return isNaN(n) ? m : Math.max(m, n)
  }, 0)
  return 'CLT-' + String(max + 1).padStart(3, '0')
}

const Ctx = createContext(null)

export function ClientProvider({ children }) {
  const [clients, setClients] = useState(load)

  function mutate(fn) {
    setClients(prev => {
      const next = fn(prev)
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  function addClient(data) {
    const id    = data.id    ?? nextId(clients)
    const color = data.color ?? COLORS[clients.length % COLORS.length]
    mutate(prev => [...prev, {
      email: '', notes: '',
      ...data,
      id,
      initials: makeInitials(data.name),
      color,
      createdAt: new Date().toISOString().split('T')[0],
    }])
    return id
  }

  function updateClient(id, data) {
    const patch = { ...data }
    if (data.name) {
      patch.initials = makeInitials(data.name)
    }
    mutate(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c))

    // Sync changes to stored md_appointments in localStorage
    try {
      const raw = localStorage.getItem('md_appointments')
      if (raw) {
        const appts = JSON.parse(raw)
        const updated = appts.map(a => {
          if (a.clientId === id) {
            return {
              ...a,
              ...(data.name ? { name: data.name } : {}),
              ...(data.phone ? { phone: data.phone } : {}),
              ...(data.email ? { email: data.email } : {}),
            }
          }
          return a
        })
        localStorage.setItem('md_appointments', JSON.stringify(updated))
      }
    } catch (e) {
      console.error('Failed to sync client updates to appointments in storage', e)
    }
  }

  function removeClient(id) {
    mutate(prev => prev.filter(c => c.id !== id))
  }

  return (
    <Ctx.Provider value={{ clients, addClient, updateClient, removeClient }}>
      {children}
    </Ctx.Provider>
  )
}


export function useClients() { return useContext(Ctx) }

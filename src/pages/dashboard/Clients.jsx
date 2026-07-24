import { useState } from 'react'
import { Search, UserPlus, Phone, Calendar, TrendingUp } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { formatCurrency } from '../../utils/formatCurrency'

const CLIENTS = [
  { name:'Priya Mehta',    phone:'+91 98765 43210', email:'priya@email.com',   bookings:3, lastService:'Bridal Makeup',   lastDate:'Jul 26, 2026', totalSpent:28000, initials:'PM', color:'#e8a4b8' },
  { name:'Anjali Sharma',  phone:'+91 91234 56789', email:'anjali@email.com',  bookings:2, lastService:'Party Makeup',    lastDate:'Jul 27, 2026', totalSpent:8500,  initials:'AS', color:'#c9956c' },
  { name:'Kavya Nair',     phone:'+91 99887 76655', email:'kavya@email.com',   bookings:4, lastService:'HD Makeup',       lastDate:'Jul 28, 2026', totalSpent:22000, initials:'KN', color:'#d4728f' },
  { name:'Ritika Joshi',   phone:'+91 87654 32109', email:'ritika@email.com',  bookings:1, lastService:'Pre-Wedding',     lastDate:'Jul 30, 2026', totalSpent:7500,  initials:'RJ', color:'#a87655' },
  { name:'Meera Iyer',     phone:'+91 76543 21098', email:'meera@email.com',   bookings:2, lastService:'Airbrush Makeup', lastDate:'Aug 1, 2026',  totalSpent:11000, initials:'MI', color:'#7c3aed' },
  { name:'Sunita Rao',     phone:'+91 85432 10987', email:'sunita@email.com',  bookings:5, lastService:'Editorial Makeup',lastDate:'Aug 3, 2026',  totalSpent:35000, initials:'SR', color:'#0891b2' },
]

export default function Clients() {
  const [search, setSearch] = useState('')
  const filtered = CLIENTS.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  )

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'22px', fontWeight:600, color:'#2d1b2e', margin:0 }}>
            Clients
          </h2>
          <p style={{ fontSize:'13px', color:'#8b6e7e', margin:'3px 0 0' }}>{CLIENTS.length} total clients</p>
        </div>
        <Button variant="primary" size="sm">
          <UserPlus size={15} /> Add Client
        </Button>
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:'360px' }}>
        <Search size={14} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'#c9956c', pointerEvents:'none' }} />
        <input
          placeholder="Search clients…"
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width:'100%', padding:'9px 14px 9px 32px', borderRadius:'10px',
                   border:'1.5px solid rgba(201,149,108,0.2)', fontSize:'13px', color:'#2d1b2e',
                   background:'white', outline:'none', fontFamily:'Inter,sans-serif', boxSizing:'border-box' }}
        />
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
        {filtered.map(client => (
          <Card key={client.name} hover style={{ padding:'24px' }}>
            {/* Avatar + name */}
            <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'18px' }}>
              <div style={{
                width:48, height:48, borderRadius:'50%', flexShrink:0,
                background:`linear-gradient(135deg, ${client.color}, ${client.color}99)`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'16px', fontWeight:700, color:'white',
              }}>
                {client.initials}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:'15px', color:'#2d1b2e' }}>{client.name}</div>
                <div style={{ fontSize:'12px', color:'#8b6e7e', marginTop:'2px' }}>{client.email}</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'18px' }}>
              {[
                { icon: Calendar, label:'Bookings',    value: client.bookings },
                { icon: TrendingUp, label:'Total Spent', value: formatCurrency(client.totalSpent) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ padding:'10px 12px', borderRadius:'12px', background:'rgba(201,149,108,0.05)' }}>
                  <Icon size={13} style={{ color:'#c9956c', marginBottom:'4px' }} />
                  <div style={{ fontSize:'15px', fontWeight:600, color:'#2d1b2e' }}>{value}</div>
                  <div style={{ fontSize:'11px', color:'#8b6e7e' }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Last service */}
            <div style={{ fontSize:'12px', color:'#8b6e7e', marginBottom:'16px' }}>
              Last: <span style={{ color:'#2d1b2e', fontWeight:500 }}>{client.lastService}</span> · {client.lastDate}
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:'8px' }}>
              <Button variant="ghost" size="xs" fullWidth as="a"
                href={`https://wa.me/${client.phone.replace(/\D/g,'')}`} target="_blank">
                <Phone size={12} /> WhatsApp
              </Button>
              <Button variant="primary" size="xs" fullWidth>
                View Profile
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

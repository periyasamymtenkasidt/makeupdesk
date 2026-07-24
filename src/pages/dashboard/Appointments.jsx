import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import AppointmentTable from '../../components/dashboard/AppointmentTable'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

const ALL = [
  { name:'Priya Mehta',    phone:'+91 98765 43210', service:'Bridal Makeup',   date:'Jul 26, 2026', shift:'Morning',   status:'Confirmed',       amount:'₹12,000' },
  { name:'Anjali Sharma',  phone:'+91 91234 56789', service:'Party Makeup',    date:'Jul 27, 2026', shift:'Evening',   status:'Payment Pending', amount:'₹4,500'  },
  { name:'Kavya Nair',     phone:'+91 99887 76655', service:'HD Makeup',       date:'Jul 28, 2026', shift:'Afternoon', status:'Quotation Sent',  amount:'₹5,000'  },
  { name:'Ritika Joshi',   phone:'+91 87654 32109', service:'Pre-Wedding',     date:'Jul 30, 2026', shift:'Morning',   status:'Confirmed',       amount:'₹7,500'  },
  { name:'Meera Iyer',     phone:'+91 76543 21098', service:'Airbrush Makeup', date:'Aug 1, 2026',  shift:'Morning',   status:'Inquiry',         amount:'₹6,000'  },
  { name:'Sunita Rao',     phone:'+91 85432 10987', service:'Editorial Makeup',date:'Aug 3, 2026',  shift:'Afternoon', status:'Advance Paid',    amount:'₹8,000'  },
  { name:'Deepa Verma',    phone:'+91 74321 09876', service:'Bridal Makeup',   date:'Aug 5, 2026',  shift:'Morning',   status:'Shift Reserved',  amount:'₹15,000' },
  { name:'Nisha Patil',    phone:'+91 63210 98765', service:'Party Makeup',    date:'Aug 7, 2026',  shift:'Evening',   status:'Rejected',        amount:'₹3,500'  },
]

const STATUS_TABS = ['All', 'Inquiry', 'Confirmed', 'Payment Pending', 'Completed']

export default function Appointments() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = ALL.filter(a => {
    const matchTab = activeTab === 'All' || a.status === activeTab
    const matchSearch = !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.service.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:'20px' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'22px', fontWeight:600, color:'#2d1b2e', margin:0 }}>
            Appointments
          </h2>
          <p style={{ fontSize:'13px', color:'#8b6e7e', margin:'3px 0 0' }}>{ALL.length} total appointments</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus size={15} /> New Appointment
        </Button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1', minWidth:'200px' }}>
          <Search size={14} style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'#c9956c', pointerEvents:'none' }} />
          <input
            placeholder="Search by name or service…"
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ width:'100%', padding:'9px 14px 9px 32px', borderRadius:'10px',
                     border:'1.5px solid rgba(201,149,108,0.2)', fontSize:'13px', color:'#2d1b2e',
                     background:'white', outline:'none', fontFamily:'Inter,sans-serif', boxSizing:'border-box' }}
          />
        </div>
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {STATUS_TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                padding:'7px 16px', borderRadius:'9999px', fontSize:'13px', fontWeight:500,
                cursor:'pointer', border:'none', transition:'all 0.2s',
                ...(activeTab === tab
                  ? { background:'linear-gradient(135deg,#c9956c,#e8a4b8)', color:'white' }
                  : { background:'white', color:'#8b6e7e', border:'1px solid rgba(201,149,108,0.2)' }
                ),
              }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <AppointmentTable appointments={filtered} />
      </Card>
    </div>
  )
}

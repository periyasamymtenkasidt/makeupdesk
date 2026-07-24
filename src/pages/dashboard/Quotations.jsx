import { useState } from 'react'
import { Plus, Send, Eye, RefreshCw } from 'lucide-react'
import { Card, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'

const QUOTATIONS = [
  { id:'Q-001', client:'Priya Mehta',   service:'Bridal Makeup',   date:'Jul 20, 2026', validTill:'Jul 27, 2026', amount:'₹12,000', status:'Approved'       },
  { id:'Q-002', client:'Anjali Sharma', service:'Party Makeup',    date:'Jul 21, 2026', validTill:'Jul 28, 2026', amount:'₹4,500',  status:'Quotation Sent'  },
  { id:'Q-003', client:'Kavya Nair',    service:'HD Makeup',       date:'Jul 22, 2026', validTill:'Jul 29, 2026', amount:'₹5,000',  status:'Quotation Sent'  },
  { id:'Q-004', client:'Ritika Joshi',  service:'Pre-Wedding',     date:'Jul 18, 2026', validTill:'Jul 25, 2026', amount:'₹7,500',  status:'Approved'       },
  { id:'Q-005', client:'Nisha Patil',   service:'Party Makeup',    date:'Jul 15, 2026', validTill:'Jul 22, 2026', amount:'₹3,500',  status:'Rejected'        },
  { id:'Q-006', client:'Deepa Verma',   service:'Bridal Makeup',   date:'Jul 23, 2026', validTill:'Jul 30, 2026', amount:'₹15,000', status:'Inquiry'         },
]

const TAB_STATUSES = ['All', 'Inquiry', 'Quotation Sent', 'Approved', 'Rejected']

export default function Quotations() {
  const [activeTab, setActiveTab] = useState('All')
  const filtered = activeTab === 'All' ? QUOTATIONS : QUOTATIONS.filter(q => q.status === activeTab)

  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:'20px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'22px', fontWeight:600, color:'#2d1b2e', margin:0 }}>
            Quotations
          </h2>
          <p style={{ fontSize:'13px', color:'#8b6e7e', margin:'3px 0 0' }}>{QUOTATIONS.length} quotations</p>
        </div>
        <Button variant="primary" size="sm">
          <Plus size={15} /> Generate Quotation
        </Button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
        {TAB_STATUSES.map(tab => (
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

      {/* Table card */}
      <Card>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(201,149,108,0.1)' }}>
                {['Quote #','Client','Service','Date','Valid Till','Amount','Status','Actions'].map(h => (
                  <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px',
                                       fontWeight:600, color:'#8b6e7e', textTransform:'uppercase',
                                       letterSpacing:'0.07em', whiteSpace:'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id}
                  style={{ borderBottom:'1px solid rgba(201,149,108,0.07)', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(253,248,244,0.8)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'#c9956c', fontFamily:'monospace' }}>{q.id}</td>
                  <td style={{ padding:'14px 16px', fontWeight:500, color:'#2d1b2e' }}>{q.client}</td>
                  <td style={{ padding:'14px 16px', color:'#2d1b2e' }}>{q.service}</td>
                  <td style={{ padding:'14px 16px', color:'#8b6e7e', whiteSpace:'nowrap' }}>{q.date}</td>
                  <td style={{ padding:'14px 16px', color:'#8b6e7e', whiteSpace:'nowrap' }}>{q.validTill}</td>
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'#2d1b2e' }}>{q.amount}</td>
                  <td style={{ padding:'14px 16px' }}><Badge status={q.status} /></td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <Button variant="ghost" size="xs"><Eye size={12} /></Button>
                      {q.status === 'Inquiry' && <Button variant="primary" size="xs"><Send size={12} /> Send</Button>}
                      {q.status === 'Rejected' && <Button variant="outline" size="xs"><RefreshCw size={12} /> Resend</Button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

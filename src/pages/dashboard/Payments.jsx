import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import StatsCard from '../../components/dashboard/StatsCard'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { Badge } from '../../components/ui/Badge'
import { formatCurrency } from '../../utils/formatCurrency'

const PAYMENT_STATS = [
  { label:'Total Revenue',     value:'₹1.85L', delta:'+18%', icon:TrendingUp,   color:'#c9956c', bg:'rgba(201,149,108,0.1)' },
  { label:'Collected',         value:'₹1.42L', delta:'+15%', icon:CheckCircle,  color:'#059669', bg:'rgba(5,150,105,0.1)'   },
  { label:'Advance Pending',   value:'₹24,000',delta:'-3',   icon:Clock,        color:'#d97706', bg:'rgba(217,119,6,0.1)'   },
  { label:'Balance Pending',   value:'₹19,000',delta:'-2',   icon:DollarSign,   color:'#d4728f', bg:'rgba(212,114,143,0.1)' },
]

const PAYMENTS = [
  { client:'Priya Mehta',   service:'Bridal Makeup',   total:12000, advance:4000,  balance:8000,  advPaid:true,  balPaid:false, status:'Advance Paid'    },
  { client:'Anjali Sharma', service:'Party Makeup',    total:4500,  advance:1500,  balance:3000,  advPaid:false, balPaid:false, status:'Payment Pending' },
  { client:'Kavya Nair',    service:'HD Makeup',       total:5000,  advance:2000,  balance:3000,  advPaid:false, balPaid:false, status:'Quotation Sent'  },
  { client:'Ritika Joshi',  service:'Pre-Wedding',     total:7500,  advance:2500,  balance:5000,  advPaid:true,  balPaid:true,  status:'Balance Paid'    },
  { client:'Sunita Rao',    service:'Editorial Makeup',total:8000,  advance:3000,  balance:5000,  advPaid:true,  balPaid:false, status:'Advance Paid'    },
  { client:'Deepa Verma',   service:'Bridal Makeup',   total:15000, advance:5000,  balance:10000, advPaid:false, balPaid:false, status:'Shift Reserved'  },
]

function AmountCell({ amount, paid }) {
  return (
    <span style={{ fontWeight:500, color: paid ? '#059669' : '#d97706' }}>
      {formatCurrency(amount)}
      <span style={{ fontSize:'10px', marginLeft:'4px', color: paid ? '#059669' : '#d97706' }}>
        {paid ? '✓' : '⏳'}
      </span>
    </span>
  )
}

export default function Payments() {
  return (
    <div style={{ padding:'28px 32px', display:'flex', flexDirection:'column', gap:'24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'22px', fontWeight:600, color:'#2d1b2e', margin:0 }}>
          Payments
        </h2>
        <p style={{ fontSize:'13px', color:'#8b6e7e', margin:'3px 0 0' }}>Track advance and balance payments</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'16px' }}>
        {PAYMENT_STATS.map(s => <StatsCard key={s.label} {...s} />)}
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <span style={{ fontFamily:'Playfair Display,serif', fontWeight:600, color:'#2d1b2e', fontSize:'17px' }}>
            Payment Tracker
          </span>
        </CardHeader>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(201,149,108,0.1)' }}>
                {['Client','Service','Total','Advance','Balance','Adv. Status','Bal. Status','Status'].map(h => (
                  <th key={h} style={{ padding:'10px 16px', textAlign:'left', fontSize:'11px',
                                       fontWeight:600, color:'#8b6e7e', textTransform:'uppercase',
                                       letterSpacing:'0.07em', whiteSpace:'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PAYMENTS.map((p, i) => (
                <tr key={i}
                  style={{ borderBottom:'1px solid rgba(201,149,108,0.07)', transition:'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background='rgba(253,248,244,0.8)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', fontWeight:500, color:'#2d1b2e' }}>{p.client}</td>
                  <td style={{ padding:'14px 16px', color:'#8b6e7e' }}>{p.service}</td>
                  <td style={{ padding:'14px 16px', fontWeight:600, color:'#2d1b2e' }}>{formatCurrency(p.total)}</td>
                  <td style={{ padding:'14px 16px' }}><AmountCell amount={p.advance} paid={p.advPaid} /></td>
                  <td style={{ padding:'14px 16px' }}><AmountCell amount={p.balance} paid={p.balPaid} /></td>
                  <td style={{ padding:'14px 16px' }}>
                    <Badge status={p.advPaid ? 'Advance Paid' : 'Payment Pending'} />
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <Badge status={p.balPaid ? 'Balance Paid' : 'Payment Pending'} />
                  </td>
                  <td style={{ padding:'14px 16px' }}><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

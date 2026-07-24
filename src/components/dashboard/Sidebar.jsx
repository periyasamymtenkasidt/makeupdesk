import { NavLink, Link } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, FileText, CreditCard,
  Sparkles, ArrowLeft, Settings, Scissors, MapPin, UserCheck,
} from 'lucide-react'

const MAIN_NAV = [
  { icon: LayoutDashboard, label: 'Overview',     to: '/dashboard' },
  { icon: Calendar,        label: 'Appointments', to: '/dashboard/appointments' },
  { icon: Users,           label: 'Clients',      to: '/dashboard/clients' },
  { icon: FileText,        label: 'Quotations',   to: '/dashboard/quotations' },
  { icon: CreditCard,      label: 'Payments',     to: '/dashboard/payments' },
]

const MASTER_NAV = [
  { icon: Scissors,   label: 'Services', to: '/dashboard/masters/services' },
  { icon: MapPin,     label: 'Venues',   to: '/dashboard/masters/venues'   },
  { icon: UserCheck,  label: 'Vendors',  to: '/dashboard/masters/vendors'  },
]

const navStyle = (isActive) => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '10px 12px', borderRadius: '12px', textDecoration: 'none',
  fontSize: '14px', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s ease',
  boxSizing: 'border-box',
  ...(isActive
    ? { background: 'linear-gradient(135deg,#c9956c,#d4728f)', color: 'white', boxShadow: '0 4px 12px rgba(201,149,108,0.3)' }
    : { color: 'rgba(255,255,255,0.65)', background: 'transparent' }
  ),
})

export default function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-64 min-h-screen"
      style={{ background: '#1a0f1b', flexShrink: 0 }}
    >
      {/* Logo */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'linear-gradient(135deg,#c9956c,#e8a4b8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '20px', color: 'white' }}>
            MakeupDesk
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>

        {/* Main menu */}
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(201,149,108,0.85)', padding: '10px 12px 6px', margin: 0 }}>
          Main Menu
        </p>
        {MAIN_NAV.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            style={({ isActive }) => navStyle(isActive)}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {/* Masters */}
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'rgba(201,149,108,0.85)', padding: '22px 12px 6px', margin: 0 }}>
          Masters
        </p>
        {MASTER_NAV.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to}
            style={({ isActive }) => navStyle(isActive)}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section with generous breathing room */}
      <div style={{ padding: '18px 14px 32px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 'auto' }}>
        <NavLink to="/dashboard/settings"
          style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px',
            textDecoration:'none', fontSize:'14px', fontWeight: 500, color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
            background: isActive ? 'rgba(201,149,108,0.2)' : 'transparent', marginBottom:'6px', transition: 'all 0.2s',
          })}>
          <Settings size={17} style={{ color: '#c9956c' }} /> Settings
        </NavLink>
        <Link to="/"
          style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px',
                   textDecoration:'none', fontSize:'14px', fontWeight: 500, color:'rgba(255,255,255,0.55)', transition: 'all 0.2s' }}>
          <ArrowLeft size={17} /> Back to Site
        </Link>
      </div>
    </aside>
  )
}

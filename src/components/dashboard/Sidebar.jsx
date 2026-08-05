import { useState, useEffect } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Calendar, Users, FileText, CreditCard, Wallet,
  Settings, Scissors, MapPin, UserCheck, LogOut,
  Layers, ChevronDown, X, Sparkles
} from 'lucide-react'
import { Modal } from '../ui/Modal'

const MAIN_NAV = [
  { icon: LayoutDashboard, label: 'Overview',     to: '/dashboard' },
  { icon: Calendar,        label: 'Appointments', to: '/dashboard/appointments' },
  { icon: Users,           label: 'Clients',      to: '/dashboard/clients' },
  { icon: FileText,        label: 'Quotations',   to: '/dashboard/quotations' },
]

const PAYMENTS_NAV = [
  { icon: CreditCard, label: 'Client Payments', to: '/dashboard/payments' },
  { icon: Wallet,     label: 'Vendor Pay',      to: '/dashboard/vendor-payments' },
]

const MASTER_NAV = [
  { icon: Scissors,   label: 'Services',      to: '/dashboard/masters/services'     },
  { icon: MapPin,     label: 'Venues',        to: '/dashboard/masters/venues'       },
  { icon: UserCheck,  label: 'Vendors',       to: '/dashboard/masters/vendors'      },
]

const navStyle = (isActive) => ({
  display: 'flex', alignItems: 'center', gap: '10px',
  padding: '10px 12px', borderRadius: '12px', textDecoration: 'none',
  fontSize: '14px', fontWeight: isActive ? 600 : 500, transition: 'all 0.2s ease',
  boxSizing: 'border-box',
  color: isActive ? '#ffffff' : 'var(--sidebar-link-color)',
})

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const [openSignOut, setOpenSignOut] = useState(false)
  const navigate  = useNavigate()
  const location  = useLocation()
  const [mastersOpen, setMastersOpen] = useState(() =>
    location.pathname.startsWith('/dashboard/masters')
  )
  const [paymentsOpen, setPaymentsOpen] = useState(() =>
    location.pathname.startsWith('/dashboard/payments') || location.pathname.startsWith('/dashboard/vendor-payments')
  )

  useEffect(() => {
    if (location.pathname.startsWith('/dashboard/masters')) setMastersOpen(true)
    if (location.pathname.startsWith('/dashboard/payments') || location.pathname.startsWith('/dashboard/vendor-payments')) setPaymentsOpen(true)
  }, [location.pathname])

  // Close mobile drawer on route change
  useEffect(() => {
    onClose()
  }, [location.pathname])

  function handleConfirmSignOut() {
    setOpenSignOut(false)
    onClose()
    navigate('/login')
  }

  const renderNavList = () => (
    <>
      <nav className="no-scrollbar" style={{ flex: 1, padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto' }}>

        {/* Main menu */}
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--sidebar-label-color)', padding: '10px 12px 6px', margin: 0 }}>
          Main Menu
        </p>
        {MAIN_NAV.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' sidebar-nav-active' : ''}`}
            style={({ isActive }) => navStyle(isActive)}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}

        {/* Payments Accordion */}
        <div>
          <button
            onClick={() => setPaymentsOpen(o => !o)}
            className="sidebar-btn-no-filter"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '10px 12px', borderRadius: '12px',
              border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '14px', fontWeight: 500, textAlign: 'left',
              background: paymentsOpen ? 'var(--sidebar-masters-open)' : 'transparent',
              color: 'var(--sidebar-link-color)', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!paymentsOpen) e.currentTarget.style.background = 'var(--sidebar-link-hover-bg)' }}
            onMouseLeave={e => { if (!paymentsOpen) e.currentTarget.style.background = 'transparent' }}
          >
            <CreditCard size={17} style={{ color: 'var(--sidebar-label-color)', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>Payments</span>
            <ChevronDown
              size={14}
              style={{
                color: 'var(--sidebar-label-color)',
                transform: paymentsOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
              }}
            />
          </button>

          {paymentsOpen && (
            <div style={{ marginTop: '2px', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ borderLeft: '1.5px solid var(--sidebar-accent-border)', paddingLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {PAYMENTS_NAV.map(({ icon: Icon, label, to }) => (
                  <NavLink key={to} to={to}
                    onClick={onClose}
                    className={({ isActive }) => `sidebar-nav-link${isActive ? ' sidebar-nav-active' : ''}`}
                    style={({ isActive }) => ({
                      ...navStyle(isActive),
                      fontSize: '13.5px',
                      padding: '8px 12px',
                    })}>
                    <Icon size={15} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Masters Accordion */}
        <div style={{ marginTop: '12px' }}>
          <button
            onClick={() => setMastersOpen(o => !o)}
            className="sidebar-btn-no-filter"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '10px 12px', borderRadius: '12px',
              border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              fontSize: '14px', fontWeight: 500, textAlign: 'left',
              background: mastersOpen ? 'var(--sidebar-masters-open)' : 'transparent',
              color: 'var(--sidebar-link-color)', transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (!mastersOpen) e.currentTarget.style.background = 'var(--sidebar-link-hover-bg)' }}
            onMouseLeave={e => { if (!mastersOpen) e.currentTarget.style.background = 'transparent' }}
          >
            <Layers size={17} style={{ color: 'var(--sidebar-label-color)', flexShrink: 0 }} />
            <span style={{ flex: 1 }}>Masters</span>
            <ChevronDown
              size={14}
              style={{
                color: 'var(--sidebar-label-color)',
                transform: mastersOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s ease',
                flexShrink: 0,
              }}
            />
          </button>

          {mastersOpen && (
            <div style={{ marginTop: '2px', paddingLeft: '14px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ borderLeft: '1.5px solid var(--sidebar-accent-border)', paddingLeft: '10px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {MASTER_NAV.map(({ icon: Icon, label, to }) => (
                  <NavLink key={to} to={to}
                    onClick={onClose}
                    className={({ isActive }) => `sidebar-nav-link${isActive ? ' sidebar-nav-active' : ''}`}
                    style={({ isActive }) => ({
                      ...navStyle(isActive),
                      fontSize: '13.5px',
                      padding: '8px 12px',
                    })}>
                    <Icon size={15} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '18px 14px 28px', marginTop: 'auto' }}>
        <NavLink to="/dashboard/settings"
          onClick={onClose}
          style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px',
            textDecoration:'none', fontSize:'14px', fontWeight: 500, color: isActive ? 'var(--sidebar-logo-text)' : 'var(--sidebar-link-muted)',
            background: isActive ? 'rgba(var(--rgb-rose-gold),0.2)' : 'transparent', marginBottom:'6px', transition: 'all 0.2s',
          })}>
          <Settings size={17} style={{ color: 'var(--color-rose-gold)' }} /> Settings
        </NavLink>
        <button
          type="button"
          onClick={() => setOpenSignOut(true)}
          className="sidebar-btn-no-filter"
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', borderRadius: '12px', border: 'none',
            fontSize: '14px', fontWeight: 500, color: '#f87171',
            background: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
            textAlign: 'left', fontFamily: 'Inter, sans-serif'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-signout-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={17} style={{ color: '#f87171' }} /> Sign Out
        </button>
      </div>
    </>
  )

  const renderCollapsedNavList = () => (
    <>
      <nav className="no-scrollbar" style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', overflowY: 'auto' }}>
        {MAIN_NAV.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to} end={to === '/dashboard'}
            onClick={onClose}
            data-tooltip={label}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' sidebar-nav-active' : ''}`}
            style={({ isActive }) => ({
              width: '42px', height: '42px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', transition: 'all 0.2s ease',
              color: isActive ? '#ffffff' : 'var(--sidebar-link-color)',
            })}>
            <Icon size={18} />
          </NavLink>
        ))}

        {/* Payment Icons */}
        {PAYMENTS_NAV.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to}
            onClick={onClose}
            data-tooltip={label}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' sidebar-nav-active' : ''}`}
            style={({ isActive }) => ({
              width: '42px', height: '42px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', transition: 'all 0.2s ease',
              color: isActive ? '#ffffff' : 'var(--sidebar-link-color)',
            })}>
            <Icon size={17} />
          </NavLink>
        ))}

        {/* Master Icons */}
        {MASTER_NAV.map(({ icon: Icon, label, to }) => (
          <NavLink key={to} to={to}
            onClick={onClose}
            data-tooltip={`Master: ${label}`}
            className={({ isActive }) => `sidebar-nav-link${isActive ? ' sidebar-nav-active' : ''}`}
            style={({ isActive }) => ({
              width: '42px', height: '42px', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', transition: 'all 0.2s ease',
              color: isActive ? '#ffffff' : 'var(--sidebar-link-color)',
            })}>
            <Icon size={17} />
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '16px 8px 24px', marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <NavLink to="/dashboard/settings"
          onClick={onClose}
          data-tooltip="Settings"
          style={({ isActive }) => ({
            width: '42px', height: '42px', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none', color: isActive ? 'var(--sidebar-logo-text)' : 'var(--sidebar-link-muted)',
            background: isActive ? 'rgba(var(--rgb-rose-gold),0.2)' : 'transparent', transition: 'all 0.2s',
          })}>
          <Settings size={18} style={{ color: 'var(--color-rose-gold)' }} />
        </NavLink>

        <button
          type="button"
          onClick={() => setOpenSignOut(true)}
          data-tooltip="Sign Out"
          className="sidebar-btn-no-filter"
          style={{
            width: '42px', height: '42px', borderRadius: '12px', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#f87171', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--sidebar-signout-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <LogOut size={18} style={{ color: '#f87171' }} />
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* 1. Desktop Sidebar (visible on ≥ lg, w-64) */}
      <aside
        className="hidden lg:flex flex-col w-64 no-scrollbar"
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)', borderRadius: '0 16px 16px 0', flexShrink: 0, height: '100%', overflowY: 'auto', boxShadow: 'var(--sidebar-shadow)' }}
      >
        {renderNavList()}
      </aside>

      {/* 2. Tablet Collapsed Icon Rail (visible on sm to lg, w-16 / 64px) */}
      <aside
        className="hidden sm:flex lg:hidden flex-col w-16 no-scrollbar"
        style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)', borderRadius: '0 16px 16px 0', flexShrink: 0, height: '100%', overflowY: 'auto', boxShadow: 'var(--sidebar-shadow)' }}
      >
        {renderCollapsedNavList()}
      </aside>

      {/* 3. Mobile Phone Drawer (visible on < sm when mobileOpen is true) */}
      {mobileOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50 flex"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <aside
            className="w-72 max-w-[85vw] h-full flex flex-col no-scrollbar shadow-2xl animate-fade-in-up"
            style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--sidebar-border)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header bar in drawer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', borderBottom: '1px solid var(--sidebar-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c9956c 0%, #e8a4b8 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Sparkles size={13} color="white" />
                </div>
                <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '16px', color: 'var(--dash-text-primary)' }}>
                  MakeupDesk
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'var(--dash-surface)', border: '1px solid var(--dash-border)',
                  borderRadius: '50%', width: 30, height: 30, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: 'var(--dash-text-secondary)',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            </div>

            {renderNavList()}
          </aside>
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        open={openSignOut}
        onClose={() => setOpenSignOut(false)}
        title="Sign Out Confirmation"
        onSave={handleConfirmSignOut}
        saveLabel="Sign Out"
        width="440px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', color: 'var(--dash-text-primary)' }}>
          <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.5, fontWeight: 500 }}>
            Are you sure you want to sign out of <strong>MakeupDesk</strong>?
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--dash-text-secondary)' }}>
            You will be redirected to the login page and will need to sign in again to access your dashboard.
          </p>
        </div>
      </Modal>
    </>
  )
}


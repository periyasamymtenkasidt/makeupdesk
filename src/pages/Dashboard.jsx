import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar  from '../components/dashboard/TopBar'

const TITLES = {
  '/dashboard':                     { title: 'Overview',             subtitle: "Here's what's happening with your bookings today." },
  '/dashboard/appointments':        { title: 'Appointments',         subtitle: 'Manage all your bookings in one place.'            },
  '/dashboard/clients':             { title: 'Clients',              subtitle: 'Your complete client directory.'                   },
  '/dashboard/quotations':          { title: 'Quotations',           subtitle: 'Generate and track client quotations.'             },
  '/dashboard/payments':            { title: 'Payments',             subtitle: 'Track advance and balance payments.'               },
  '/dashboard/masters/services':    { title: 'Service Master',       subtitle: 'Manage makeup services and base pricing.'          },
  '/dashboard/masters/venues':      { title: 'Venue Pricing Master', subtitle: 'Configure price adjustments per venue type.'       },
  '/dashboard/masters/vendors':       { title: 'Vendor Master',        subtitle: 'Manage your external professionals and partners.'  },
  '/dashboard/masters/availability':  { title: 'Availability',         subtitle: 'Set your working days, hours, and slot intervals.'  },
  '/dashboard/settings':              { title: 'Settings',             subtitle: 'Manage studio profile, payment options, templates & preferences.' },
}

function getPageTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname]
  if (pathname.startsWith('/dashboard/appointments/')) return { title: 'Appointment Details', subtitle: 'View and manage appointment details.' }
  if (pathname.startsWith('/dashboard/clients/')) return { title: 'Client Profile', subtitle: 'Full booking history and payment record.' }
  return TITLES['/dashboard']
}

export default function Dashboard() {
  const { pathname } = useLocation()
  const { title, subtitle } = getPageTitle(pathname)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--dash-bg)' }}>
      <TopBar onMenuToggle={() => setMobileNavOpen(true)} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

          {/* Page title bar */}
          <div style={{
            padding: '14px 20px', flexShrink: 0,
            background: 'transparent',
          }}>
            <h1 style={{
              fontFamily: 'Inter, sans-serif', fontSize: '19px', fontWeight: 700,
              color: 'var(--dash-topbar-title)', margin: 0, letterSpacing: '-0.02em',
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ fontSize: '12.5px', color: 'var(--dash-topbar-sub)', margin: '2px 0 0', fontWeight: 450 }}>
                {subtitle}
              </p>
            )}
          </div>

          <main className="no-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

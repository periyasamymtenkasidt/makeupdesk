import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/dashboard/Sidebar'
import TopBar  from '../components/dashboard/TopBar'

const TITLES = {
  '/dashboard':                     { title: 'Overview',            subtitle: "Here's what's happening with your bookings today." },
  '/dashboard/appointments':        { title: 'Appointments',        subtitle: 'Manage all your bookings in one place.'            },
  '/dashboard/clients':             { title: 'Clients',             subtitle: 'Your complete client directory.'                   },
  '/dashboard/quotations':          { title: 'Quotations',          subtitle: 'Generate and track client quotations.'             },
  '/dashboard/payments':            { title: 'Payments',            subtitle: 'Track advance and balance payments.'               },
  '/dashboard/masters/services':    { title: 'Service Master',      subtitle: 'Manage makeup services and base pricing.'          },
  '/dashboard/masters/venues':      { title: 'Venue Pricing Master',subtitle: 'Configure price adjustments per venue type.'       },
  '/dashboard/masters/vendors':     { title: 'Vendor Master',       subtitle: 'Manage your external professionals and partners.'  },
}

export default function Dashboard() {
  const { pathname } = useLocation()
  const meta = TITLES[pathname] ?? TITLES['/dashboard']

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(180deg, #fdf8f4 0%, #faf3ec 100%)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

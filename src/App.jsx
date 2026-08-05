import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AppointmentProvider } from './context/AppointmentContext'
import { ClientProvider } from './context/ClientContext'
import { ToastProvider } from './context/ToastContext'
import LandingPage    from './pages/LandingPage'
import PortfolioPage  from './pages/PortfolioPage'
import Login          from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Overview     from './pages/dashboard/Overview'
import Appointments      from './pages/dashboard/Appointments'
import AppointmentProfile from './pages/dashboard/AppointmentProfile'
import Clients       from './pages/dashboard/Clients'
import ClientProfile from './pages/dashboard/ClientProfile'
import Quotations   from './pages/dashboard/Quotations'
import Payments     from './pages/dashboard/Payments'
import VendorPayments from './pages/dashboard/VendorPayments'
import Services     from './pages/dashboard/masters/Services'
import Venues        from './pages/dashboard/masters/Venues'
import Vendors       from './pages/dashboard/masters/Vendors'
import Settings      from './pages/dashboard/Settings'

export default function App() {
  return (
    <ThemeProvider>
    <ToastProvider>
    <ClientProvider>
    <AppointmentProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index                       element={<Overview />}     />
          <Route path="appointments"                    element={<Appointments />}      />
          <Route path="appointments/:appointmentId"   element={<AppointmentProfile />} />
          <Route path="clients"              element={<Clients />}      />
          <Route path="clients/:clientId"    element={<ClientProfile />} />
          <Route path="quotations"           element={<Quotations />}   />
          <Route path="payments"             element={<Payments />}     />
          <Route path="vendor-payments"     element={<VendorPayments />} />
          <Route path="masters/services"     element={<Services />}     />
          <Route path="masters/venues"       element={<Venues />}       />
          <Route path="masters/vendors"       element={<Vendors />}       />
          <Route path="settings"             element={<Settings />}     />
        </Route>
      </Routes>
    </BrowserRouter>
    </AppointmentProvider>
    </ClientProvider>
    </ToastProvider>
    </ThemeProvider>
  )
}

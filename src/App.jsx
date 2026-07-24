import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage  from './pages/LandingPage'
import Login        from './pages/Login'
import Dashboard    from './pages/Dashboard'
import Overview     from './pages/dashboard/Overview'
import Appointments from './pages/dashboard/Appointments'
import Clients      from './pages/dashboard/Clients'
import Quotations   from './pages/dashboard/Quotations'
import Payments     from './pages/dashboard/Payments'
import Services     from './pages/dashboard/masters/Services'
import Venues       from './pages/dashboard/masters/Venues'
import Vendors      from './pages/dashboard/masters/Vendors'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index                       element={<Overview />}     />
          <Route path="appointments"         element={<Appointments />} />
          <Route path="clients"              element={<Clients />}      />
          <Route path="quotations"           element={<Quotations />}   />
          <Route path="payments"             element={<Payments />}     />
          <Route path="masters/services"     element={<Services />}     />
          <Route path="masters/venues"       element={<Venues />}       />
          <Route path="masters/vendors"      element={<Vendors />}      />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

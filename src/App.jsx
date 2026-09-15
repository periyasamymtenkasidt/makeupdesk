import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AppointmentProvider } from "./context/AppointmentContext";
import { ClientProvider } from "./context/ClientContext";
import { ToastProvider } from "./context/ToastContext";
import LandingPage from "./pages/landing/LandingPage";
import PortfolioPage from "./pages/portfolio/PortfolioPage";
import Login from "./pages/login/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Overview from "./pages/overview/Overview";
import Appointments from "./pages/appointments/Appointments";
import AppointmentProfile from "./pages/appointments/AppointmentProfile";
import Clients from "./pages/clients/Clients";
import ClientProfile from "./pages/clients/ClientProfile";
import Quotations from "./pages/quotation/Quotations";
import Payments from "./pages/payments/Payments";
import VendorPayments from "./pages/payments/VendorPayments";
import Services from "./pages/masters/Services";
import Venues from "./pages/masters/Venues";
import Vendors from "./pages/masters/Vendors";
import VendorProfile from "./pages/masters/VendorProfile";
import Settings from "./pages/settings/Settings";
import NotFound from "./pages/NotFound";

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
                <Route element={<DashboardLayout />}>
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/appointments" element={<Appointments />} />
                  <Route
                    path="/appointments/:appointmentId"
                    element={<AppointmentProfile />}
                  />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/clients/:clientId" element={<ClientProfile />} />
                  <Route path="/quotations" element={<Quotations />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/payments/vendors" element={<VendorPayments />} />
                  <Route path="/masters/services" element={<Services />} />
                  <Route path="/masters/venues" element={<Venues />} />
                  <Route path="/masters/vendors" element={<Vendors />} />
                  <Route
                    path="/masters/vendors/:vendorId"
                    element={<VendorProfile />}
                  />
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AppointmentProvider>
        </ClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

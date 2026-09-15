import { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const TITLES = {
  "/overview": {
    title: "Overview",
    subtitle: "Here's what's happening with your bookings today.",
  },
  "/appointments": {
    title: "Appointments",
    subtitle: "Manage all your bookings in one place.",
  },
  "/clients": {
    title: "Clients",
    subtitle: "Your complete client directory.",
  },
  "/quotations": {
    title: "Quotations",
    subtitle: "Generate and track client quotations.",
  },
  "/payments": {
    title: "Payments",
    subtitle: "Track advance and balance payments.",
  },
  "/payments/vendors": {
    title: "Vendor Payments",
    subtitle: "Track and manage payments owed to your team.",
  },
  "/masters/services": {
    title: "Service Master",
    subtitle: "Manage makeup services and base pricing.",
  },
  "/masters/venues": {
    title: "Venue Pricing Master",
    subtitle: "Configure price adjustments per venue type.",
  },
  "/masters/vendors": {
    title: "Vendor Master",
    subtitle: "Manage your external professionals and partners.",
  },
  "/settings": {
    title: "Settings",
    subtitle:
      "Manage studio profile, payment options, templates & preferences.",
  },
};

function getPageTitle(pathname) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/appointments/"))
    return {
      title: "Appointment Details",
      subtitle: "View and manage appointment details.",
      backPath: "/appointments",
    };
  if (pathname.startsWith("/clients/"))
    return {
      title: "Client Profile",
      subtitle: "Full booking history and payment record.",
      backPath: "/clients",
    };
  if (pathname.startsWith("/masters/vendors/"))
    return {
      title: "Vendor Profile",
      subtitle: "Vendor details, assigned appointments and payment history.",
      backPath: "/masters/vendors",
    };
  return TITLES["/overview"];
}

export default function Dashboard() {
  const { pathname } = useLocation();
  const { title, subtitle, backPath } = getPageTitle(pathname);
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mainRef = useRef(null);
  const fadeOverlayRef = useRef(null);

  useEffect(() => {
    const el = mainRef.current;
    const overlay = fadeOverlayRef.current;
    if (!el || !overlay) return;

    const updateOverlayBounds = () => {
      const rect = el.getBoundingClientRect();
      overlay.style.left = `${rect.left}px`;
      overlay.style.width = `${rect.width}px`;
    };
    updateOverlayBounds();

    const onScroll = () => {
      const scrolled = el.scrollTop > 10;
      el.classList.toggle("is-scrolled", scrolled);

      const stickyHeader = el.querySelector(".master-sticky-header");
      if (stickyHeader && scrolled) {
        overlay.style.top = `${stickyHeader.getBoundingClientRect().bottom}px`;
        overlay.style.opacity = "1";
      } else {
        overlay.style.opacity = "0";
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateOverlayBounds);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateOverlayBounds);
    };
  }, [pathname]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "var(--dash-bg)",
      }}
    >
      <TopBar onMenuToggle={() => setMobileNavOpen(true)} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          mobileOpen={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          {/* Page title bar */}
          <div
            style={{
              padding: "14px 20px",
              flexShrink: 0,
              background: "transparent",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {backPath && (
                <button
                  onClick={() => navigate(backPath)}
                  title="Go back"
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "none",
                    background: "var(--dash-subtle-row-bg)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--dash-text-secondary)",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--dash-row-hover)";
                    e.currentTarget.style.color = "var(--dash-text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      "var(--dash-subtle-row-bg)";
                    e.currentTarget.style.color = "var(--dash-text-secondary)";
                  }}
                >
                  <ArrowLeft size={14} />
                </button>
              )}
              <h1
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "19px",
                  fontWeight: 700,
                  color: "var(--dash-topbar-title)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h1>
            </div>
            {subtitle && (
              <p
                style={{
                  fontSize: "12.5px",
                  color: "var(--dash-topbar-sub)",
                  margin: "2px 0 0",
                  fontWeight: 450,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          <main
            ref={mainRef}
            className="no-scrollbar"
            style={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>

      {/* Fixed fade overlay — appears below sticky headers on master pages when scrolled */}
      <div
        ref={fadeOverlayRef}
        style={{
          position: "fixed",
          height: 64,
          background: "linear-gradient(to bottom, var(--dash-bg), transparent)",
          pointerEvents: "none",
          zIndex: 30,
          opacity: 0,
          transition: "opacity 0.2s ease",
        }}
      />
    </div>
  );
}

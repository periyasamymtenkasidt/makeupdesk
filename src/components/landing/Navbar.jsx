import { useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useScrolled } from '../../hooks/useScrolled'
import { NAV_LINKS } from '../../data/navigation'

export default function Navbar() {
  const scrolled    = useScrolled(60)
  const [open, setOpen] = useState(false)

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'py-3'
        : 'bg-transparent py-5'
    }`}
    style={scrolled ? {
      background: 'rgba(14,7,16,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(201,149,108,0.15)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.4)',
    } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-full flex items-center justify-center"
                 style={{ background: 'linear-gradient(135deg,#c9956c,#e8a4b8)' }}>
              <Sparkles size={17} color="white" />
            </div>
            <span className="font-display font-semibold text-xl text-white">
              MakeupDesk
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href}
                 className="text-sm font-medium transition-colors hover:text-rose-gold"
                 style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>
                {label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login"
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
              Artist Login
            </Link>
            <a href="#book" className="btn-primary" style={{ padding:'9px 22px', fontSize:'14px' }}>
              Book Now
            </a>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg"
                  style={{ color: 'white' }}
                  onClick={() => setOpen(o => !o)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="md:hidden mt-4 pb-4 space-y-1"
               style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {NAV_LINKS.map(({ label, href }) => (
              <a key={label} href={href} onClick={() => setOpen(false)}
                 className="block px-2 py-2.5 text-sm font-medium rounded-lg"
                 style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
                {label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <Link to="/login" onClick={() => setOpen(false)}
                    className="block px-2 py-2.5 text-sm font-medium"
                    style={{ color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
                Artist Login
              </Link>
              <a href="#book" className="btn-primary text-center justify-center"
                 onClick={() => setOpen(false)}>
                Book Now
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

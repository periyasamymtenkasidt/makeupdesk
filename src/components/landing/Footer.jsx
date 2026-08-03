import { Sparkles, Phone, Mail, MapPin, Camera, MessageCircle } from 'lucide-react'
import { NAV_LINKS, FOOTER_SERVICES } from '../../data/navigation'
import { chatOnWhatsApp } from '../../utils/whatsapp'

const PHONE    = import.meta.env.VITE_BUSINESS_PHONE    ?? '99999 99999'
const EMAIL    = import.meta.env.VITE_BUSINESS_EMAIL    ?? 'hello@makeupdesk.in'
const LOCATION = import.meta.env.VITE_BUSINESS_LOCATION ?? 'Chennai, Tamil Nadu, India'
const NAME     = import.meta.env.VITE_BUSINESS_NAME     ?? 'MakeupDesk'
const INSTAGRAM = import.meta.env.VITE_INSTAGRAM_LINK   ?? 'https://www.instagram.com/sofdoesmakeup_'

const SOCIALS = [
  { icon: Camera,        href: '#',             label: 'Instagram' },
  { icon: MessageCircle, href: chatOnWhatsApp(), label: 'WhatsApp'  },
]

export default function Footer() {
  return (
    <footer style={{ background: '#07040a' }}>

      {/* Top gradient line */}
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,149,108,0.4), rgba(232,164,184,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg,#c9956c,#e8a4b8)' }}>
                <Sparkles size={16} color="white" />
              </div>
              <span className="font-display font-semibold text-xl text-white">{NAME}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Professional makeup artistry for every occasion. Your beauty, perfectly crafted.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                   className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                   style={{ background: 'rgba(201,149,108,0.1)', border: '1px solid rgba(201,149,108,0.25)' }}
                   onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.2)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,149,108,0.3)' }}
                   onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.1)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  <Icon size={15} style={{ color: '#c9956c' }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm tracking-wide uppercase" style={{ letterSpacing: '0.1em' }}>
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href}
                     className="text-sm block transition-colors duration-200"
                     style={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
                     onMouseEnter={e => { e.currentTarget.style.color = '#c9956c' }}
                     onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm tracking-wide uppercase" style={{ letterSpacing: '0.1em' }}>
              Services
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_SERVICES.map(s => (
                <li key={s}>
                  <a href="#services"
                     className="text-sm block transition-colors duration-200"
                     style={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
                     onMouseEnter={e => { e.currentTarget.style.color = '#c9956c' }}
                     onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-5 text-sm tracking-wide uppercase" style={{ letterSpacing: '0.1em' }}>
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                { icon: Phone,  value: PHONE,    href: `tel:${PHONE.replace(/\s/g,'')}` },
                { icon: Mail,   value: EMAIL,    href: `mailto:${EMAIL}` },
                { icon: MapPin, value: LOCATION, href: '#' },
                { icon: Camera, value: INSTAGRAM,href: INSTAGRAM },
              ].map(({ icon: Icon, value, href }) => (
                <li key={value}>
                  <a href={href}
                     className="flex items-start gap-3 text-sm transition-colors duration-200"
                     style={{ color: 'rgba(255,255,255,0.38)', textDecoration: 'none' }}
                     onMouseEnter={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
                     onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.38)' }}
                  >
                    <Icon size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#c9956c' }} />
                    {value}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#book"
               className="mt-6 inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300"
               style={{ background: 'linear-gradient(135deg,#c9956c,#d4728f)', color: 'white' }}
               onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(201,149,108,0.4)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
               onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Book an Appointment
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>
            © {new Date().getFullYear()} {NAME}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service'].map(t => (
              <a key={t} href="#"
                 className="text-xs transition-colors duration-200"
                 style={{ color: 'rgba(255,255,255,0.22)', textDecoration: 'none' }}
                 onMouseEnter={e => { e.currentTarget.style.color = '#c9956c' }}
                 onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.22)' }}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

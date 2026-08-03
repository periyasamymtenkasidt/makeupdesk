import { ArrowRight } from 'lucide-react'
import { SERVICES } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'
import bride2 from '../../assets/images/Bride_2.png'
import reception from '../../assets/images/Reception_makeup.png'
import partyMakeup from '../../assets/images/Party_makeup.png'

const GLOW = {
  bridal:     'rgba(232,164,184,0.4)',
  party:      'rgba(212,114,143,0.4)',
  hd:         'rgba(245,225,192,0.35)',
  airbrush:   'rgba(232,164,184,0.35)',
  prewedding: 'rgba(201,149,108,0.35)',
  editorial:  'rgba(212,114,143,0.4)',
}

const CARD_BG = {
  bridal:     'rgba(232,164,184,0.06)',
  party:      'rgba(212,114,143,0.06)',
  hd:         'rgba(245,225,192,0.05)',
  airbrush:   'rgba(232,164,184,0.05)',
  prewedding: 'rgba(201,149,108,0.05)',
  editorial:  'rgba(212,114,143,0.06)',
}

export default function Services() {
  const ref = useReveal(0.1)

  return (
    <section
      id="services"
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'var(--land-sec1-bg)' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 hero-dots" style={{ opacity: 0.045 }} />

      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(201,149,108,0.13) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="absolute top-1/4 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(232,164,184,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-0 -right-24 w-[400px] h-[400px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(201,149,108,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10">
          <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            What We Offer
          </span>
          <h2 className="font-display mt-3" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--land-text)' }}>
            Our Services
          </h2>
          <div className="section-divider" />
          <p className="mt-5 max-w-lg mx-auto text-base leading-relaxed" style={{ color: 'var(--land-text-muted)' }}>
            Every look is custom-crafted to match your personality, event type &amp; skin tone.
          </p>
        </div>

        {/* Client photo strip */}
        <div className="flex items-center justify-center gap-4 mb-14">
          {[
            { img: bride2,     label: 'Bridal Glam' },
            { img: reception,  label: 'Reception' },
            { img: partyMakeup, label: 'Party Look' },
          ].map(({ img, label }) => (
            <div key={label} className="relative overflow-hidden rounded-2xl flex-shrink-0"
                 style={{ width: '96px', height: '120px', border: '1px solid rgba(201,149,108,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              <img src={img} alt={label} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,5,12,0.75) 0%, transparent 55%)' }} />
              <span className="absolute bottom-2 left-0 right-0 text-center"
                    style={{ fontSize: '9px', fontWeight: 700, color: '#e8c4a0', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {label}
              </span>
            </div>
          ))}
          <div className="hidden sm:flex flex-col gap-1.5 ml-2">
            {['Real client photos', 'Every look custom-crafted', 'by certified artists'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#c9956c' }} />
                <span style={{ fontSize: '11px', color: 'var(--land-text-muted)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ id, icon: Icon, title, desc, iconColor, tag }) => (
            <div
              key={id}
              className="service-card group relative rounded-3xl p-7 flex flex-col"
              style={{
                background: CARD_BG[id],
                border: `1px solid ${iconColor}22`,
                backdropFilter: 'blur(12px)',
                transition: 'all 0.35s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 20px 60px ${GLOW[id]}, 0 0 0 1px ${iconColor}35`
                e.currentTarget.style.background = `${CARD_BG[id].replace('0.06', '0.1').replace('0.05', '0.09')}`
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = CARD_BG[id]
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px"
                   style={{ background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`, opacity: 0.7 }} />

              {/* Tag */}
              {tag && (
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                     style={{ background: 'rgba(201,149,108,0.18)', color: '#c9956c', border: '1px solid rgba(201,149,108,0.3)' }}>
                  {tag}
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                   style={{ background: `${iconColor}20`, border: `1px solid ${iconColor}40` }}>
                <Icon size={22} style={{ color: iconColor }} />
              </div>

              {/* Text */}
              <h3 className="font-display text-xl font-semibold mb-2" style={{ color: 'var(--land-text)' }}>{title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--land-text-muted)' }}>{desc}</p>

              {/* Footer */}
              <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${iconColor}20` }}>
                <a
                  href="#book"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                  style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}40`, color: iconColor }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${iconColor}30` }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${iconColor}18` }}
                >
                  Get a Quote
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

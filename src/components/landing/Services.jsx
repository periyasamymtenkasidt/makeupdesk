import { ArrowRight } from 'lucide-react'
import { SERVICES } from '../../data/services'
import { useReveal } from '../../hooks/useReveal'

const GLOW = {
  bridal:     'rgba(232,164,184,0.35)',
  party:      'rgba(201,149,108,0.35)',
  hd:         'rgba(245,225,192,0.3)',
  airbrush:   'rgba(232,164,184,0.3)',
  prewedding: 'rgba(201,149,108,0.3)',
  editorial:  'rgba(92,47,96,0.5)',
}

export default function Services() {
  const ref = useReveal(0.1)

  return (
    <section
      id="services"
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a050c 0%, #140c16 60%, #1a0f1b 100%)' }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 hero-dots" style={{ opacity: 0.04 }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(201,149,108,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            What We Offer
          </span>
          <h2 className="font-display mt-3 text-white" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1 }}>
            Our Services
          </h2>
          <div className="section-divider" />
          <p className="mt-5 max-w-lg mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Every look is custom-crafted to match your personality, event type &amp; skin tone.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
          {SERVICES.map(({ id, icon: Icon, title, desc, price, iconColor, tag }) => (
            <div
              key={id}
              className="service-card reveal reveal-scale group relative rounded-3xl p-7 flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 20px 60px ${GLOW[id]}, 0 0 0 1px rgba(255,255,255,0.1)`
                e.currentTarget.style.background = 'rgba(255,255,255,0.055)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-8 right-8 h-px"
                   style={{ background: `linear-gradient(90deg, transparent, ${iconColor}, transparent)`, opacity: 0.6 }} />

              {/* Tag */}
              {tag && (
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                     style={{ background: 'rgba(201,149,108,0.18)', color: '#c9956c', border: '1px solid rgba(201,149,108,0.3)' }}>
                  {tag}
                </div>
              )}

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                   style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}>
                <Icon size={22} style={{ color: iconColor }} />
              </div>

              {/* Text */}
              <h3 className="font-display text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>

              {/* Footer */}
              <div className="flex items-center justify-between mt-6 pt-5"
                   style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div>
                  <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Starting from
                  </div>
                  <div className="font-display font-semibold text-lg" style={{ color: '#c9956c' }}>{price}</div>
                </div>
                <a href="#book"
                   className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                   style={{ background: `${iconColor}20`, border: `1px solid ${iconColor}40` }}>
                  <ArrowRight size={15} style={{ color: iconColor }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

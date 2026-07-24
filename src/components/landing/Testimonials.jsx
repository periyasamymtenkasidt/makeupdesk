import { Star } from 'lucide-react'
import { TESTIMONIALS } from '../../data/testimonials'
import { useReveal } from '../../hooks/useReveal'

function Stars() {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />
      ))}
    </div>
  )
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #e8a4b8, #c9956c)',
  'linear-gradient(135deg, #c9956c, #a87655)',
  'linear-gradient(135deg, #d4728f, #e8a4b8)',
]

export default function Testimonials() {
  const ref = useReveal(0.1)

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #1a0f1b 0%, #0e0710 100%)' }}
    >
      <div className="absolute inset-0 hero-dots" style={{ opacity: 0.04 }} />

      {/* Large decorative quote */}
      <div
        className="absolute select-none pointer-events-none"
        style={{
          top: '60px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: 'Georgia, serif', fontSize: '320px', lineHeight: 1,
          color: 'rgba(201,149,108,0.04)', fontWeight: 700, whiteSpace: 'nowrap',
        }}
        aria-hidden="true"
      >
        ❝
      </div>

      {/* Ambient blobs */}
      <div className="absolute -left-20 top-1/3 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(201,149,108,0.1) 0%, transparent 70%)', filter: 'blur(70px)' }} />
      <div className="absolute -right-20 bottom-1/3 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(232,164,184,0.1) 0%, transparent 70%)', filter: 'blur(70px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 reveal">
          <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Client Love
          </span>
          <h2 className="font-display mt-3 text-white" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1 }}>
            What They Say
          </h2>
          <div className="section-divider" />
          <p className="mt-5 max-w-lg mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Real words from real clients who trusted us with their most important moments.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger">
          {TESTIMONIALS.map(({ id, name, event, rating, text, initials, color }, i) => (
            <div
              key={id}
              className="reveal reveal-scale group relative rounded-3xl p-7 flex flex-col transition-all duration-400"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.055)'
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px ${color}25`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Top accent */}
              <div className="absolute top-0 left-8 right-8 h-px"
                   style={{ background: `linear-gradient(90deg, transparent, ${color}80, transparent)` }} />

              {/* Large decorative open-quote */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute', top: '18px', right: '24px',
                  fontFamily: 'Georgia,serif', fontSize: '72px', lineHeight: 1,
                  color: `${color}18`, fontWeight: 700, pointerEvents: 'none',
                }}
              >
                ❝
              </div>

              {/* Stars */}
              <Stars />

              {/* Quote */}
              <p className="mt-4 text-sm leading-relaxed flex-1 relative z-10"
                 style={{ color: 'rgba(255,255,255,0.68)' }}>
                "{text}"
              </p>

              {/* Author */}
              <div className="mt-6 pt-5 flex items-center gap-3"
                   style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm text-white flex-shrink-0"
                  style={{ background: AVATAR_GRADIENTS[i], boxShadow: `0 4px 16px ${color}40` }}
                >
                  {initials}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{name}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{event}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Rating bar */}
        <div className="mt-14 flex justify-center reveal">
          <div
            className="inline-flex items-center gap-6 px-8 py-5 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">4.9</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>Google Rating</div>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <div className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.38)' }}>Based on 200+ reviews</div>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <div className="text-center">
              <div className="font-display text-3xl font-bold text-white">500+</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

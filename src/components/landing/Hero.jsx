import { useState, useEffect } from 'react'
import { ArrowRight, Star, Award, Users, Calendar } from 'lucide-react'
import { useCounter } from '../../hooks/useCounter'
import bridePic    from '../../assets/images/Bride_1.png'
import bridePic2   from '../../assets/images/Bride_2.png'
import etherealPic from '../../assets/images/Engagement_bridal.png'
import roseGoldPic from '../../assets/images/Reception_makeup.png'

export default function Hero() {
  const [triggered, setTriggered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTriggered(true), 700)
    return () => clearTimeout(t)
  }, [])

  const clients = useCounter(500,  { duration: 2000, triggered })
  const years   = useCounter(8,    { duration: 1500, triggered })
  const events  = useCounter(1000, { duration: 2400, triggered })

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #0e0710 0%, #1a0f1b 35%, #2d1b2e 68%, #4a2e4d 100%)' }}
    >
      {/* Film grain texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          opacity: 0.038,
          mixBlendMode: 'overlay',
          zIndex: 1,
        }}
      />

      {/* Dot pattern */}
      <div className="absolute inset-0 hero-dots" style={{ zIndex: 2 }} />

      {/* Radial vignette — darkens edges for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 38%, rgba(8,4,9,0.72) 100%)',
          zIndex: 3,
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute -top-40 -right-40 w-[620px] h-[620px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(201,149,108,0.22) 0%, transparent 70%)', filter: 'blur(120px)', zIndex: 1 }} />
      <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(232,164,184,0.15) 0%, transparent 70%)', filter: 'blur(110px)', zIndex: 1 }} />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(92,47,96,0.32) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1 }} />

      {/* Main grid */}
      <div
        className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16
                   grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        style={{ zIndex: 10 }}
      >
        {/* ── Left: Content ── */}
        <div className="text-white space-y-7">

          {/* Badge */}
          <div
            className="animate-fade-in-up delay-100 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full"
            style={{
              background: 'rgba(201,149,108,0.1)',
              border: '1px solid rgba(201,149,108,0.38)',
              color: '#f5e1c0',
              boxShadow: '0 0 24px rgba(201,149,108,0.12)',
            }}
          >
            <Star size={12} style={{ color: '#c9956c', fill: '#c9956c' }} />
            <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Certified Professional Makeup Artist
            </span>
          </div>

          {/* Headline — weight contrast creates premium feel */}
          <div className="animate-fade-in-up delay-200">
            <h1 className="font-display" style={{ lineHeight: 1.06, margin: 0 }}>
              <span
                className="block text-5xl md:text-6xl lg:text-[70px] text-white"
                style={{ fontWeight: 900 }}
              >
                Transforming
              </span>
              <span
                className="block text-5xl md:text-6xl lg:text-[70px] text-white"
                style={{ fontWeight: 900 }}
              >
              Beauty Into Art
              </span>
            </h1>
          </div>

          {/* Subtext */}
          <p
            className="animate-fade-in-up delay-300 text-lg leading-relaxed max-w-[420px]"
            style={{ color: 'rgba(255,255,255,0.58)' }}
          >
            Expert bridal, party &amp; editorial makeup by certified artists.
            From your first inquiry to your glam look — seamlessly managed.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up delay-400 flex flex-wrap gap-4 pt-1">
            <a href="#book" className="btn-primary">
              Book Appointment <ArrowRight size={16} />
            </a>
            <a href="#portfolio" className="btn-outline">
              View Portfolio
            </a>
          </div>

          {/* Animated mini stats */}
          <div
            className="animate-fade-in-up delay-500 flex items-center gap-8 pt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            {[
              { value: clients, suffix: '+', label: 'Happy Clients' },
              { value: years,   suffix: '+', label: 'Years Exp.' },
              { value: events,  suffix: '+', label: 'Events' },
            ].map(s => (
              <div key={s.label}>
                <div
                  className="font-display text-2xl font-semibold"
                  style={{ color: '#c9956c' }}
                >
                  {s.value}{s.suffix}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.04em' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Makeup Collage ── */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-[360px] h-[380px] md:w-[420px] md:h-[440px]">

            {/* Ambient glow behind the whole collage */}
            <div className="absolute pointer-events-none"
                 style={{ inset: '-40px', background: 'radial-gradient(ellipse at 55% 50%, rgba(201,149,108,0.18) 0%, rgba(232,164,184,0.1) 45%, transparent 70%)', filter: 'blur(28px)' }} />

            {/* ── Thumbnail 1: Bride portrait — top-left, large ── */}
            <div className="absolute overflow-hidden animate-float"
                 style={{
                   top: '18px', left: '10px',
                   width: '152px', height: '192px',
                   borderRadius: '20px',
                   transform: 'rotate(-3.8deg)',
                   border: '2px solid rgba(201,149,108,0.55)',
                   boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,149,108,0.18), 0 4px 20px rgba(201,149,108,0.2)',
                   animationDelay: '0s',
                 }}>
              <img src={bridePic} alt="Bridal makeup" className="w-full h-full object-cover"
                   style={{ objectPosition: 'center 10%' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,4,10,0.45) 0%, transparent 55%)' }} />
              <div className="absolute bottom-2.5 left-3 text-white" style={{ fontSize: '9px', fontWeight: 600, opacity: 0.85 }}>Bridal Glam</div>
            </div>

            {/* ── Thumbnail 2: Editorial look — top-right ── */}
            <div className="absolute overflow-hidden animate-float"
                 style={{
                   top: '10px', right: '14px',
                   width: '116px', height: '138px',
                   borderRadius: '16px',
                   transform: 'rotate(3deg)',
                   border: '2px solid rgba(212,184,232,0.55)',
                   boxShadow: '0 20px 50px rgba(0,0,0,0.55), 0 4px 20px rgba(180,150,200,0.3)',
                   animationDelay: '1.5s',
                 }}>
              <img src={etherealPic} alt="Editorial look" className="w-full h-full object-cover"
                   style={{ objectPosition: 'center 15%' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,4,12,0.6) 0%, transparent 55%)' }} />
              <div className="absolute bottom-2.5 left-3 text-white" style={{ fontSize: '9px', fontWeight: 600, opacity: 0.9 }}>Editorial</div>
            </div>

            {/* ── Thumbnail 3: Bride close-up — bottom-right, large ── */}
            <div className="absolute overflow-hidden animate-float-reverse"
                 style={{
                   bottom: '14px', right: '10px',
                   width: '150px', height: '185px',
                   borderRadius: '20px',
                   transform: 'rotate(2.5deg)',
                   border: '2px solid rgba(245,225,192,0.45)',
                   boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,225,192,0.12), 0 4px 20px rgba(245,225,192,0.15)',
                   animationDelay: '0.9s',
                 }}>
              <img src={bridePic2} alt="HD bridal look" className="w-full h-full object-cover"
                   style={{ objectPosition: 'center 18%' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,4,10,0.5) 0%, transparent 55%)' }} />
              <div className="absolute bottom-2.5 left-3 flex items-center gap-1">
                <span style={{ color: '#fbbf24', fontSize: '9px', letterSpacing: '1px' }}>★★★★★</span>
              </div>
            </div>

            {/* ── Thumbnail 4: Pre-wedding look — bottom-left ── */}
            <div className="absolute overflow-hidden animate-float-delay"
                 style={{
                   bottom: '12px', left: '14px',
                   width: '112px', height: '132px',
                   borderRadius: '16px',
                   transform: 'rotate(-2.8deg)',
                   border: '2px solid rgba(232,164,184,0.5)',
                   boxShadow: '0 20px 50px rgba(0,0,0,0.55), 0 4px 20px rgba(232,164,184,0.22)',
                   animationDelay: '2.4s',
                 }}>
              <img src={roseGoldPic} alt="Pre-wedding look" className="w-full h-full object-cover"
                   style={{ objectPosition: 'center 15%' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,4,12,0.6) 0%, transparent 55%)' }} />
              <div className="absolute bottom-2.5 left-3 text-white" style={{ fontSize: '9px', fontWeight: 600, opacity: 0.9 }}>Pre-Wedding</div>
            </div>

            {/* ── Center: Rating badge — floats above the collage ── */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center pointer-events-none animate-float"
                 style={{
                   padding: '10px 16px',
                   borderRadius: '18px',
                   background: 'rgba(12,6,14,0.92)',
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)',
                   border: '1px solid rgba(201,149,108,0.45)',
                   boxShadow: '0 12px 40px rgba(0,0,0,0.65), 0 0 0 1px rgba(201,149,108,0.12), 0 4px 20px rgba(201,149,108,0.2)',
                   animationDelay: '0.4s',
                 }}>
              <div style={{ color: '#fbbf24', fontSize: '14px', letterSpacing: '2.5px', textShadow: '0 0 14px rgba(251,191,36,0.6)' }}>★★★★★</div>
              <div className="font-display font-bold text-white" style={{ fontSize: '20px', lineHeight: 1, marginTop: '2px' }}>5.0</div>
              <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.45)', letterSpacing: '1.2px', textTransform: 'uppercase', marginTop: '3px' }}>Google Rating</div>
            </div>

            {/* Floating card: Clients */}
            <div className="animate-float float-card-glow absolute -top-4 -right-5 glass rounded-2xl px-4 py-3 flex items-center gap-3 text-white"
                 style={{ borderTop: '2px solid rgba(201,149,108,0.65)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(201,149,108,0.18)' }}>
                <Users size={18} style={{ color: '#c9956c' }} />
              </div>
              <div>
                <div className="font-semibold text-sm leading-none">500+</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.48)' }}>Happy Clients</div>
              </div>
            </div>

            {/* Floating card: Certified */}
            <div className="animate-float-delay float-card-glow absolute -bottom-5 -left-5 glass rounded-2xl px-4 py-3 flex items-center gap-3 text-white"
                 style={{ borderTop: '2px solid rgba(232,164,184,0.65)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(232,164,184,0.18)' }}>
                <Award size={18} style={{ color: '#e8a4b8' }} />
              </div>
              <div>
                <div className="font-semibold text-sm leading-none">Certified</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.48)' }}>Professional</div>
              </div>
            </div>

            {/* Floating card: Events */}
            <div className="animate-float-reverse float-card-glow absolute top-1/2 -right-14 -translate-y-1/2 glass rounded-2xl px-4 py-3 flex items-center gap-3 text-white"
                 style={{ borderTop: '2px solid rgba(245,225,192,0.55)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,225,192,0.13)' }}>
                <Calendar size={18} style={{ color: '#f5e1c0' }} />
              </div>
              <div>
                <div className="font-semibold text-sm leading-none">1000+</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.48)' }}>Events Done</div>
              </div>
            </div>

            {/* Decorative dot cluster */}
            <div className="absolute -top-10 -left-10 grid grid-cols-4 gap-2" style={{ opacity: 0.22 }}>
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9956c' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade — blends Hero into MarqueeBar */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '120px', background: 'linear-gradient(to bottom, transparent 0%, #08040a 100%)', zIndex: 4 }}
      />

      {/* Premium mouse scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
        style={{ zIndex: 10 }}
      >
        <div
          style={{
            width: '20px',
            height: '32px',
            border: '1.5px solid rgba(255,255,255,0.18)',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '6px',
          }}
        >
          <div
            className="scroll-dot"
            style={{ width: '4px', height: '6px', borderRadius: '2px', background: '#c9956c' }}
          />
        </div>
      </div>
    </section>
  )
}

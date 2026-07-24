import { useEffect, useRef, useState } from 'react'
import { useCounter } from '../../hooks/useCounter'
import { useReveal } from '../../hooks/useReveal'

const STATS = [
  { end: 500,  suffix: '+', label: 'Happy Clients',    sublabel: 'And counting',        decimal: false, color: '#c9956c' },
  { end: 8,    suffix: '+', label: 'Years Experience', sublabel: 'Expert artistry',      decimal: false, color: '#e8a4b8' },
  { end: 1000, suffix: '+', label: 'Events Completed', sublabel: 'Bridal to editorial',  decimal: false, color: '#f5e1c0' },
  { end: 4.9,  suffix: '★', label: 'Average Rating',   sublabel: 'Google & Instagram',  decimal: true,  color: '#f59e0b' },
]

const BADGES = ['Bridal Specialist', 'Airbrush Certified', 'HD Makeup Expert', 'Pan India Service', 'WhatsApp Support']

function StatItem({ end, suffix, label, sublabel, decimal, triggered, color }) {
  const val = useCounter(end, { decimal, triggered })
  return (
    <div className="text-center group">
      <div
        className="font-display font-bold mb-2 transition-all duration-300 group-hover:scale-105"
        style={{ fontSize: 'clamp(44px,6vw,72px)', color, lineHeight: 1, textShadow: `0 0 40px ${color}40` }}
      >
        {val}{suffix}
      </div>
      <div className="font-medium text-base text-white">{label}</div>
      <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{sublabel}</div>
    </div>
  )
}

export default function Stats() {
  const [triggered, setTriggered] = useState(false)
  const triggerRef = useRef(null)
  const ref = useReveal(0.1)

  useEffect(() => {
    const el = triggerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #140c16 0%, #1a0f1b 100%)' }}
    >
      {/* Grid dots */}
      <div className="absolute inset-0 hero-dots" style={{ opacity: 0.05 }} />

      {/* Center glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(201,149,108,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div ref={triggerRef} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Label */}
        <div className="text-center mb-16 reveal">
          <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Our Track Record
          </span>
          <h2 className="font-display mt-3 text-white" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1 }}>
            Numbers That Speak
          </h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 reveal stagger">
          {STATS.map(stat => <StatItem key={stat.label} {...stat} triggered={triggered} />)}
        </div>

        {/* Divider line */}
        <div className="mt-16 mb-12" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)' }} />

        {/* Badge pills */}
        <div className="flex flex-wrap justify-center gap-3 reveal">
          {BADGES.map(b => (
            <span
              key={b}
              className="px-5 py-2 rounded-full text-xs font-medium transition-all duration-300 cursor-default"
              style={{ background: 'rgba(201,149,108,0.08)', color: 'rgba(245,225,192,0.7)', border: '1px solid rgba(201,149,108,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.18)'; e.currentTarget.style.color = '#f5e1c0' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,149,108,0.08)'; e.currentTarget.style.color = 'rgba(245,225,192,0.7)' }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

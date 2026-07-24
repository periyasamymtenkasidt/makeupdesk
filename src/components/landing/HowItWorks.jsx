import { useRef, useEffect, useState } from 'react'
import { ClipboardList, MessageCircle, CreditCard, Smile } from 'lucide-react'
import { useReveal } from '../../hooks/useReveal'

const STEPS = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Book an Appointment',
    desc: 'Fill out our quick form with your event details, preferred date, shift & location — takes under 2 minutes.',
    color: '#c9956c',
    glow: 'rgba(201,149,108,0.35)',
  },
  {
    icon: MessageCircle,
    step: '02',
    title: 'Get Your Quotation',
    desc: 'We check availability, reserve your slot & send a detailed quotation to your WhatsApp instantly.',
    color: '#e8a4b8',
    glow: 'rgba(232,164,184,0.35)',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Confirm & Pay Advance',
    desc: 'Approve the quote, pay a small advance via UPI to lock your booking. Balance is due after the service.',
    color: '#f5e1c0',
    glow: 'rgba(245,225,192,0.3)',
  },
  {
    icon: Smile,
    step: '04',
    title: 'Look Amazing!',
    desc: 'Your artist arrives on time, creates your dream look & checks in 7 days, 1 day & same-day via WhatsApp.',
    color: '#d4728f',
    glow: 'rgba(212,114,143,0.35)',
  },
]

export default function HowItWorks() {
  const ref = useReveal(0.1)
  const lineRef = useRef(null)
  const [lineVisible, setLineVisible] = useState(false)

  useEffect(() => {
    const el = lineRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setLineVisible(true); obs.disconnect() } },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #140c16 0%, #1a0f1b 100%)' }}
    >
      <div className="absolute inset-0 hero-dots" style={{ opacity: 0.04 }} />

      {/* Ambient blob */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(232,164,184,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-20 reveal">
          <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Simple Process
          </span>
          <h2 className="font-display mt-3 text-white" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1 }}>
            How It Works
          </h2>
          <div className="section-divider" />
          <p className="mt-5 max-w-lg mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
            From inquiry to a flawless look — our seamless 4-step process keeps you informed at every stage.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">

          {/* Animated connector line (desktop) */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute h-px"
            style={{ top: '36px', left: 'calc(12.5% + 36px)', right: 'calc(12.5% + 36px)', background: 'rgba(255,255,255,0.07)' }}
          >
            <div
              className={lineVisible ? 'line-fill' : ''}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, #c9956c, #e8a4b8, #f5e1c0, #d4728f)',
                transformOrigin: 'left',
                transform: lineVisible ? 'scaleX(1)' : 'scaleX(0)',
                transition: lineVisible ? 'transform 1.4s cubic-bezier(0.16,1,0.3,1) 0.3s' : 'none',
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 stagger">
            {STEPS.map(({ icon: Icon, step, title, desc, color, glow }) => (
              <div key={step} className="reveal flex flex-col items-center text-center group">

                {/* Icon circle */}
                <div
                  className="relative w-18 h-18 rounded-full flex items-center justify-center mb-7 z-10 transition-all duration-500 group-hover:scale-110 icon-glow"
                  style={{
                    width: '72px', height: '72px',
                    background: `radial-gradient(circle, ${color}22 0%, ${color}08 100%)`,
                    border: `1.5px solid ${color}50`,
                    boxShadow: `0 0 0 8px ${color}0a`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 0 32px ${glow}, 0 0 0 8px ${color}15` }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = `0 0 0 8px ${color}0a` }}
                >
                  <Icon size={26} style={{ color }} />
                  {/* Step badge */}
                  <div
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: color, fontSize: '9px', boxShadow: `0 4px 12px ${color}60` }}
                  >
                    {step}
                  </div>
                </div>

                {/* Card */}
                <div
                  className="rounded-2xl p-6 w-full transition-all duration-400 group-hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderTop: `1px solid ${color}30`,
                  }}
                >
                  <h3 className="font-display font-semibold text-lg mb-2 text-white">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center reveal">
          <a href="#book" className="btn-primary">
            Start Your Journey
          </a>
        </div>
      </div>
    </section>
  )
}

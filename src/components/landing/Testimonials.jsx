import { useState } from 'react'
import { Star, X, MessageSquare, ArrowRight } from 'lucide-react'
import { TESTIMONIALS } from '../../data/testimonials'
import { useReveal } from '../../hooks/useReveal'
import { useMaster } from '../../hooks/useMaster'

function Stars({ count = 5 }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={13} fill="#f59e0b" style={{ color: '#f59e0b' }} />
      ))}
    </div>
  )
}

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #e8a4b8, #c9956c)',
  'linear-gradient(135deg, #c9956c, #a87655)',
  'linear-gradient(135deg, #d4728f, #e8a4b8)',
  'linear-gradient(135deg, #9b51e0, #e8a4b8)',
]

export default function Testimonials() {
  const ref = useReveal(0.1)
  const [showModal, setShowModal] = useState(false)
  const { items: allReviews } = useMaster('md_reviews', TESTIMONIALS)
  const displayReviews = allReviews.filter(r => r.featured !== false)
  const initialReviews = displayReviews.slice(0, 4)

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
        <div className="text-center mb-14 reveal">
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

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
          {initialReviews.map(({ id, name, event, rating, text, initials, color }, i) => {
            const avatarGradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
            const cardColor = color || '#c9956c'
            return (
              <div
                key={id}
                className="reveal reveal-scale group relative rounded-3xl p-6 flex flex-col transition-all duration-400"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.055)'
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = `0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px ${cardColor}25`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-8 right-8 h-px"
                     style={{ background: `linear-gradient(90deg, transparent, ${cardColor}80, transparent)` }} />

                {/* Large decorative open-quote */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute', top: '16px', right: '20px',
                    fontFamily: 'Georgia,serif', fontSize: '64px', lineHeight: 1,
                    color: `${cardColor}18`, fontWeight: 700, pointerEvents: 'none',
                  }}
                >
                  ❝
                </div>

                {/* Stars */}
                <Stars count={rating || 5} />

                {/* Quote */}
                <p className="mt-4 text-xs sm:text-sm leading-relaxed flex-1 relative z-10"
                   style={{ color: 'rgba(255,255,255,0.68)' }}>
                  "{text}"
                </p>

                {/* Author */}
                <div className="mt-5 pt-4 flex items-center gap-3"
                     style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0"
                    style={{ background: avatarGradient, boxShadow: `0 4px 16px ${cardColor}40` }}
                  >
                    {initials || (name ? name.slice(0, 2).toUpperCase() : 'CL')}
                  </div>
                  <div>
                    <div className="font-semibold text-xs sm:text-sm text-white">{name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.38)' }}>{event}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        {displayReviews.length > 4 && (
          <div className="mt-10 flex justify-center reveal">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-xl group hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, rgba(201,149,108,0.15) 0%, rgba(212,114,143,0.15) 100%)',
                border: '1px solid rgba(201,149,108,0.4)',
                color: '#ffffff',
                backdropFilter: 'blur(8px)',
              }}
            >
              <MessageSquare size={16} style={{ color: '#c9956c' }} />
              <span>View All Reviews ({displayReviews.length})</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" style={{ color: '#c9956c' }} />
            </button>
          </div>
        )}

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

      {/* All Reviews Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          />

          {/* Modal Content */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl p-6 sm:p-8 flex flex-col z-10 shadow-2xl animate-fade-in-up"
            style={{
              background: '#120815',
              border: '1px solid rgba(201,149,108,0.25)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 40px rgba(201,149,108,0.1)',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-5 mb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Client Feedback
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white mt-0.5">
                  All Client Reviews ({displayReviews.length})
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body - Scrollable Grid */}
            <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                {displayReviews.map(({ id, name, event, rating, text, initials, color }, i) => {
                  const avatarGradient = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]
                  const cardColor = color || '#c9956c'
                  return (
                    <div
                      key={id}
                      className="relative rounded-2xl p-5 flex flex-col transition-all duration-300"
                      style={{
                        background: 'rgba(255,255,255,0.035)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <Stars count={rating || 5} />
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.72)' }}>
                        "{text}"
                      </p>
                      <div className="mt-4 pt-3.5 flex items-center gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0"
                          style={{ background: avatarGradient }}
                        >
                          {initials || (name ? name.slice(0, 2).toUpperCase() : 'CL')}
                        </div>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm text-white">{name}</div>
                          <div className="text-[11px]" style={{ color: 'rgba(255,255,255,0.38)' }}>{event}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 mt-2 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-white transition-all"
                style={{ background: 'rgba(255,255,255,0.08)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}


import { useState, useRef } from 'react'
import { Star, X, MessageSquare, ArrowRight, Play, Volume2, VolumeX } from 'lucide-react'
import { TESTIMONIALS } from '../../data/testimonials'
import { useReveal } from '../../hooks/useReveal'
import { useMaster } from '../../hooks/useMaster'
import vid1 from '../../assets/videos/testimonal_1.mp4'
import vid2 from '../../assets/videos/testimonal_2.mp4'
import vid3 from '../../assets/videos/testimonal_3.mp4'

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

const VIDEO_SOURCES = [vid1, vid2, vid3]

function VideoTestiCard({ item, index }) {
  const videoRef            = useRef(null)
  const [muted, setMuted]   = useState(true)
  const [hovering, setHovering] = useState(false)
  const gradient            = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length]

  function onEnter() {
    setHovering(true)
    videoRef.current?.play()
  }
  function onLeave() {
    setHovering(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
    setMuted(true)
  }
  function toggleMute(e) {
    e.stopPropagation()
    setMuted(m => !m)
  }

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        borderRadius: '20px',
        aspectRatio: '9/16',
        background: '#0d0a10',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s ease',
        transform: hovering ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovering
          ? `0 24px 48px rgba(0,0,0,0.7), 0 0 0 1.5px ${item.color}50`
          : '0 8px 24px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <video
        ref={videoRef}
        src={item.src}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 35%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.1) 60%, transparent 80%)' }} />

      {/* Top row: Mute toggle */}
      <div style={{ position: 'absolute', top: 14, left: 14, right: 14, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={toggleMute}
          style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0,
            opacity: hovering ? 1 : 0, transition: 'opacity 0.25s ease',
          }}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>

      {/* Center play icon shown when paused */}
      {!hovering && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Play size={20} fill="white" color="white" style={{ marginLeft: 3 }} />
          </div>
        </div>
      )}

      {/* Bottom: Author */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '14px 16px', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: gradient, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '11px', fontWeight: 700,
            boxShadow: `0 0 0 2px ${item.color}50`,
          }}>
            {item.initials}
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px', lineHeight: 1.2 }}>{item.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', marginTop: '2px' }}>{item.event}</div>
          </div>
        </div>
      </div>

      {/* Accent border on hover */}
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '20px', pointerEvents: 'none',
        boxShadow: hovering ? `inset 0 0 0 1.5px ${item.color}45` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
        transition: 'box-shadow 0.3s ease',
      }} />
    </div>
  )
}

export default function Testimonials() {
  const ref = useReveal(0.1)
  const [showModal, setShowModal] = useState(false)
  const { items: crmReviews } = useMaster('md_reviews', [])
  const crmFeatured    = crmReviews.filter(r => r.featured !== false)
  const displayReviews = crmFeatured.length > 0 ? crmFeatured : TESTIMONIALS
  const initialReviews = displayReviews.slice(0, 4)
  const videoItems     = VIDEO_SOURCES.map((src, i) => ({
    ...(TESTIMONIALS[i] || {}),
    ...(displayReviews[i] || {}),
    src,
    id: `video-${i}`,
  }))

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'var(--land-sec5-bg)' }}
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
          <h2 className="font-display mt-3" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--land-text)' }}>
            What They Say
          </h2>
          <div className="section-divider" />
          <p className="mt-5 max-w-lg mx-auto text-base leading-relaxed" style={{ color: 'var(--land-text-muted)' }}>
            Real words from real clients who trusted us with their most important moments.
          </p>
        </div>

        {/* ── Video Testimonials ── */}
        <div className="mb-16 reveal">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ color: '#c9956c', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              Watch & Believe
            </span>
            <h3 className="font-display mt-2" style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: 'var(--land-text)' }}>
              Hear It In Their Own Words
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-2xl mx-auto">
            {videoItems.map((item, i) => (
              <VideoTestiCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* ── Written Reviews ── */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ color: '#c9956c', fontSize: '10.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Written Reviews
          </span>
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
                  background: 'var(--land-card-bg)',
                  border: '1px solid var(--land-card-border)',
                  boxShadow: 'var(--land-card-shadow)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--land-pill-bg)'
                  e.currentTarget.style.transform = 'translateY(-6px)'
                  e.currentTarget.style.boxShadow = `0 16px 36px rgba(0,0,0,0.18), 0 0 0 1px ${cardColor}25`
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--land-card-bg)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--land-card-shadow)'
                }}
              >
                <div className="absolute top-0 left-8 right-8 h-px"
                     style={{ background: `linear-gradient(90deg, transparent, ${cardColor}80, transparent)` }} />
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

                <Stars count={rating || 5} />
                <p className="mt-4 text-xs sm:text-sm leading-relaxed flex-1 relative z-10"
                   style={{ color: 'var(--land-text-sub)' }}>
                  "{text}"
                </p>
                <div className="mt-5 pt-4 flex items-center gap-3"
                     style={{ borderTop: '1px solid var(--land-card-border)' }}>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0"
                    style={{ background: avatarGradient, boxShadow: `0 4px 16px ${cardColor}40` }}
                  >
                    {initials || (name ? name.slice(0, 2).toUpperCase() : 'CL')}
                  </div>
                  <div>
                    <div className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--land-text)' }}>{name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--land-text-faint)' }}>{event}</div>
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
                color: 'var(--land-text)',
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
              background: 'var(--land-card-bg)',
              border: '1px solid var(--land-card-border)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="text-center">
              <div className="font-display text-3xl font-bold" style={{ color: 'var(--land-text)' }}>4.9</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--land-text-faint)' }}>Google Rating</div>
            </div>
            <div className="w-px h-10" style={{ background: 'var(--land-divider)' }} />
            <div>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="#f59e0b" style={{ color: '#f59e0b' }} />
                ))}
              </div>
              <div className="text-xs mt-1.5" style={{ color: 'var(--land-text-faint)' }}>Based on 200+ reviews</div>
            </div>
            <div className="w-px h-10" style={{ background: 'var(--land-divider)' }} />
            <div className="text-center">
              <div className="font-display text-3xl font-bold" style={{ color: 'var(--land-text)' }}>500+</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--land-text-faint)' }}>Happy Clients</div>
            </div>
          </div>
        </div>

      </div>

      {/* All Reviews Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          />
          <div
            className="relative w-full max-w-4xl max-h-[85vh] rounded-3xl p-6 sm:p-8 flex flex-col z-10 shadow-2xl animate-fade-in-up"
            style={{
              background: 'var(--land-card-bg)',
              border: '1px solid var(--land-card-border)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
            }}
          >
            <div className="flex items-center justify-between pb-5 mb-5" style={{ borderBottom: '1px solid var(--land-divider)' }}>
              <div>
                <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Client Feedback
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold mt-0.5" style={{ color: 'var(--land-text)' }}>
                  All Client Reviews ({displayReviews.length})
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--land-pill-bg)', color: 'var(--land-text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--land-card-border)'; e.currentTarget.style.color = 'var(--land-text)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--land-pill-bg)'; e.currentTarget.style.color = 'var(--land-text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>
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
                        background: 'var(--land-pill-bg)',
                        border: '1px solid var(--land-card-border)',
                      }}
                    >
                      <Stars count={rating || 5} />
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed flex-1" style={{ color: 'var(--land-text-sub)' }}>
                        "{text}"
                      </p>
                      <div className="mt-4 pt-3.5 flex items-center gap-3" style={{ borderTop: '1px solid var(--land-card-border)' }}>
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs text-white flex-shrink-0"
                          style={{ background: avatarGradient }}
                        >
                          {initials || (name ? name.slice(0, 2).toUpperCase() : 'CL')}
                        </div>
                        <div>
                          <div className="font-semibold text-xs sm:text-sm" style={{ color: 'var(--land-text)' }}>{name}</div>
                          <div className="text-[11px]" style={{ color: 'var(--land-text-faint)' }}>{event}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="pt-4 mt-2 flex justify-end" style={{ borderTop: '1px solid var(--land-divider)' }}>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-full text-xs font-semibold transition-all"
                style={{ background: 'var(--land-pill-bg)', color: 'var(--land-text)', border: '1px solid var(--land-card-border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--land-card-border)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--land-pill-bg)'}
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

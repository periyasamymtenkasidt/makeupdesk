import { useState } from 'react'
import { Eye, ArrowUpRight, ArrowRight } from 'lucide-react'
import { useReveal } from '../../hooks/useReveal'
import goldenBride  from '../../assets/images/GoldenBride.jpg'
import goldenBride2 from '../../assets/images/GoldenBride_2.jpg'
import goldenBride3 from '../../assets/images/GoldenBride_3.jpg'
import partyMakeup  from '../../assets/images/Partymakeup.jpg'
import ethereal     from '../../assets/images/Ethereal.jpg'
import roseGold     from '../../assets/images/Rose_Gold.jpg'

const CATEGORIES = ['All', 'Bridal', 'Party', 'Editorial', 'Pre-Wedding', 'HD']

const ITEMS = [
  {
    id: 0,
    title: 'The Golden Bride',
    category: 'Bridal',
    subtitle: 'Reception Look · Mumbai',
    tag: 'Featured',
    accent: '#c9956c',
    glow: 'rgba(201,149,108,0.4)',
    img: goldenBride,  pos: 'center 15%',
    img2: goldenBride2, pos2: 'center 18%',
  },
  {
    id: 1,
    title: 'Midnight Glamour',
    category: 'Party',
    subtitle: 'Cocktail Evening · Delhi',
    tag: null,
    accent: '#e8a4b8',
    glow: 'rgba(232,164,184,0.35)',
    img: partyMakeup,  pos: 'top center',
    img2: partyMakeup, pos2: 'center 58%',
  },
  {
    id: 2,
    title: 'Ethereal Vision',
    category: 'Editorial',
    subtitle: 'Magazine Feature · Vogue India',
    tag: null,
    accent: '#d4b8e8',
    glow: 'rgba(212,184,232,0.35)',
    img: ethereal,  pos: 'center 12%',
    img2: ethereal, pos2: 'center 60%',
  },
  {
    id: 3,
    title: 'Rose & Gold',
    category: 'Pre-Wedding',
    subtitle: 'Pre-Shoot · Goa Beachside',
    tag: null,
    accent: '#e8a4b8',
    glow: 'rgba(232,164,184,0.35)',
    img: roseGold,  pos: 'center 10%',
    img2: roseGold, pos2: 'center 58%',
  },
  {
    id: 4,
    title: 'Crystal Clear',
    category: 'HD',
    subtitle: 'HD Close-Up · Bangalore',
    tag: null,
    accent: '#f5e1c0',
    glow: 'rgba(245,225,192,0.32)',
    img: goldenBride2,  pos: 'center 12%',
    img2: goldenBride3, pos2: 'center 22%',
  },
  {
    id: 5,
    title: 'Dark Siren',
    category: 'Editorial',
    subtitle: 'Fashion Week · Lakme',
    tag: 'Award Winner',
    accent: '#d4728f',
    glow: 'rgba(212,114,143,0.4)',
    img: goldenBride3,  pos: 'center 12%',
    img2: goldenBride3, pos2: 'center 58%',
  },
]


export default function Portfolio() {
  const [active, setActive]         = useState('All')
  const [hovered, setHovered]       = useState(null)
  const ref                         = useReveal(0.08)

  const filtered = active === 'All' ? ITEMS : ITEMS.filter(i => i.category === active)
  const isBento  = active === 'All' && filtered.length === 6

  return (
    <section
      id="portfolio"
      ref={ref}
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0e0710 0%, #140c16 60%, #0e0710 100%)' }}
    >
      {/* Background ambience */}
      <div className="absolute inset-0 hero-dots" style={{ opacity: 0.035 }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(201,149,108,0.07) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute top-2/3 right-0 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(180,80,120,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-12 reveal">
          <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Our Work
          </span>
          <h2 className="font-display mt-3 text-white" style={{ fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, lineHeight: 1.08 }}>
            Looks We've Created
          </h2>
          <div className="section-divider" />
          <p className="mt-5 max-w-lg mx-auto text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)' }}>
            Every look tells a story — of confidence, beauty, and artistry.
          </p>
        </div>

        {/* ── Filter pills ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 reveal">
          {CATEGORIES.map(cat => {
            const count = cat === 'All' ? ITEMS.length : ITEMS.filter(i => i.category === cat).length
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className="filter-tab px-5 py-2 rounded-full text-sm font-medium transition-all duration-250 flex items-center gap-2"
                style={isActive
                  ? { background: 'linear-gradient(135deg, #c9956c, #d4728f)', color: 'white', boxShadow: '0 4px 20px rgba(201,149,108,0.4)', border: '1px solid transparent' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.48)', border: '1px solid rgba(255,255,255,0.09)' }
                }
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(201,149,108,0.35)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}
              >
                {cat}
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)', color: isActive ? 'white' : 'rgba(255,255,255,0.35)' }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Grid ── */}
        {isBento ? (
          /* BENTO LAYOUT for "All" with 6 items */
          <div className="space-y-5">
            {/* Row 1: Featured + 2 stacked */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Featured card (spans 2 cols) */}
              <PortfolioCard item={ITEMS[0]} hovered={hovered} setHovered={setHovered} height="460px" className="lg:col-span-2" featured />
              {/* Stacked pair */}
              <div className="flex flex-col gap-5">
                <PortfolioCard item={ITEMS[1]} hovered={hovered} setHovered={setHovered} height="220px" />
                <PortfolioCard item={ITEMS[2]} hovered={hovered} setHovered={setHovered} height="220px" />
              </div>
            </div>
            {/* Row 2: 2 stacked + Featured */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Stacked pair */}
              <div className="flex flex-col gap-5">
                <PortfolioCard item={ITEMS[3]} hovered={hovered} setHovered={setHovered} height="220px" />
                <PortfolioCard item={ITEMS[4]} hovered={hovered} setHovered={setHovered} height="220px" />
              </div>
              {/* Featured card (spans 2 cols) */}
              <PortfolioCard item={ITEMS[5]} hovered={hovered} setHovered={setHovered} height="460px" className="lg:col-span-2" featured />
            </div>
          </div>
        ) : (
          /* STANDARD GRID for filtered views */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(item => (
              <PortfolioCard key={item.id} item={item} hovered={hovered} setHovered={setHovered} height="340px" />
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-14 text-center reveal">
          <button className="btn-primary">
            View Full Portfolio <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ── Portfolio Card Component ── */
function PortfolioCard({ item, hovered, setHovered, height, className = '', featured = false }) {
  const { id, title, category, subtitle, tag, img, img2, pos, pos2, accent, glow } = item
  const isHovered = hovered === id

  return (
    <div
      className={`relative overflow-hidden cursor-pointer select-none animate-fade-in-up ${className}`}
      style={{
        height,
        borderRadius: '20px',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1), box-shadow 0.45s ease',
        transform: isHovered ? 'translateY(-6px) scale(1.012)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? `0 32px 72px rgba(0,0,0,0.65), 0 0 0 1px ${glow}`
          : '0 8px 32px rgba(0,0,0,0.32)',
      }}
      onMouseEnter={() => setHovered(id)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* ── 2-panel image split ── */}
      <div className="absolute inset-0 flex" style={{ gap: '2px', background: '#060210' }}>

        {/* Left panel — face / makeup focus */}
        <div className="relative overflow-hidden" style={{ flex: featured ? '3 3 0%' : '1 1 0%' }}>
          <img
            src={img}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              objectPosition: pos,
              transition: 'transform 0.75s cubic-bezier(0.16,1,0.3,1)',
              transform: isHovered ? 'scale(1.07)' : 'scale(1)',
            }}
          />
        </div>

        {/* Right panel — outfit / jewelry / detail */}
        <div className="relative overflow-hidden" style={{ flex: featured ? '2 2 0%' : '1 1 0%' }}>
          <img
            src={img2}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              objectPosition: pos2,
              transition: 'transform 0.75s cubic-bezier(0.16,1,0.3,1) 0.04s',
              transform: isHovered ? 'scale(1.07)' : 'scale(1)',
            }}
          />
        </div>
      </div>

      {/* Top-edge shadow for badge readability */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.06) 26%, transparent 48%)' }} />

      {/* Bottom gradient for title area */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'linear-gradient(to top, rgba(4,2,7,0.97) 0%, rgba(4,2,7,0.72) 30%, rgba(4,2,7,0.08) 58%, transparent 100%)' }} />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div className="px-3 py-1.5 rounded-full text-[11px] font-semibold"
             style={{ background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(14px)', color: 'rgba(255,255,255,0.93)', border: '1px solid rgba(255,255,255,0.18)' }}>
          {category}
        </div>
        {tag && (
          <div className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
               style={{ background: `${accent}28`, border: `1px solid ${accent}60`, color: accent, backdropFilter: 'blur(12px)' }}>
            {tag}
          </div>
        )}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0" style={{ padding: featured ? '68px 24px 24px' : '48px 20px 18px' }}>
        <p style={{
          fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
          color: accent, marginBottom: '6px',
          opacity: isHovered ? 1 : 0.75,
          transform: isHovered ? 'translateY(0)' : 'translateY(3px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          {subtitle}
        </p>

        <div className="flex items-end justify-between">
          <h3 className="font-display font-bold text-white leading-tight"
              style={{ fontSize: featured ? 'clamp(20px,2.2vw,26px)' : '17px' }}>
            {title}
          </h3>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ml-3"
            style={{
              background: `${accent}22`,
              border: `1px solid ${accent}60`,
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-45deg)',
              transition: 'opacity 0.3s ease, transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            }}>
            <ArrowUpRight size={15} style={{ color: accent }} />
          </div>
        </div>

        {/* Slide-in CTA on hover */}
        <div style={{ height: isHovered ? '34px' : '0px', overflow: 'hidden', transition: 'height 0.38s cubic-bezier(0.16,1,0.3,1)' }}>
          <div className="flex items-center gap-2 pt-3">
            <Eye size={12} style={{ color: 'rgba(255,255,255,0.4)' }} />
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>View Look Details</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.12), transparent)' }} />
          </div>
        </div>
      </div>

      {/* Hover glow border */}
      <div className="absolute inset-0 rounded-[20px] pointer-events-none"
           style={{
             boxShadow: isHovered ? `inset 0 0 0 1.5px ${accent}45` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
             transition: 'box-shadow 0.38s ease',
           }} />
    </div>
  )
}

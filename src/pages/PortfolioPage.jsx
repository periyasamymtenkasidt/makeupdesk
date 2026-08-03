import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ITEMS, CATEGORIES, PortfolioCard } from '../components/landing/Portfolio'

export default function PortfolioPage() {
  const [active, setActive]   = useState('All')
  const [hovered, setHovered] = useState(null)
  const navigate              = useNavigate()

  const filtered = active === 'All' ? ITEMS : ITEMS.filter(i => i.category === active)

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0e0710 0%, #140c16 60%, #0e0710 100%)' }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(14,7,16,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f5e1c0'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '15px', fontWeight: 700, color: '#f5e1c0', letterSpacing: '0.04em' }}>
          Full Portfolio
        </span>
        <div style={{ width: 100 }} />
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{ color: '#c9956c', fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
            Our Work
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(32px,5vw,52px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.1, margin: '12px 0 0' }}>
            Looks We've Created
          </h1>
          <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.42)', fontSize: '15px', lineHeight: 1.6 }}>
            Every look tells a story — of confidence, beauty, and artistry.
          </p>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          {CATEGORIES.map(cat => {
            const count    = cat === 'All' ? ITEMS.length : ITEMS.filter(i => i.category === cat).length
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                style={{
                  padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                  transition: 'all 0.25s',
                  ...(isActive
                    ? { background: 'linear-gradient(135deg,#c9956c,#d4728f)', color: '#fff', boxShadow: '0 4px 20px rgba(201,149,108,0.4)', border: '1px solid transparent' }
                    : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.48)', border: '1px solid rgba(255,255,255,0.09)' }),
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(201,149,108,0.35)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)' }}
              >
                {cat}
                <span style={{
                  fontSize: '10px', padding: '2px 6px', borderRadius: '9999px', fontWeight: 700,
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.35)',
                }}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map(item => (
            <PortfolioCard key={item.id} item={item} hovered={hovered} setHovered={setHovered} height="340px" />
          ))}
        </div>

      </div>
    </div>
  )
}

import { useState, useEffect, useRef } from 'react'
import { MapPin, X, Loader2 } from 'lucide-react'

// ── category matcher ──────────────────────────────────────────────────────────

const KEYWORD_MAP = [
  { keys: ['convention', 'expo center', 'exhibition hall', 'conference center', 'international center'], cat: 'Grand Convention Center' },
  { keys: ['taj', 'hyatt', 'hilton', 'marriott', 'sheraton', 'westin', 'oberoi', 'itc hotel', 'leela', 'four seasons', 'ritz', 'radisson', 'intercontinental', '5 star', 'five star', 'novotel', 'jw marriott', 'the park'], cat: '5-Star Hotel Ballroom' },
  { keys: ['resort', 'heritage hotel', 'palace hotel', 'beachfront', 'beach resort', 'spa resort'], cat: 'Luxury Resort Property' },
  { keys: ['garden', 'farmhouse', 'farm house', 'lawn', 'beach', 'poolside', 'outdoor', 'open air'], cat: 'Outdoor Garden & Farmhouse' },
  { keys: ['kalyan mandapam', 'banquet hall', 'marriage hall', 'function hall', 'auditorium', 'mahal', 'samaj', 'sabha griha'], cat: 'Premium Marriage Hall' },
  { keys: ['temple', 'mandir', 'kovil', 'church', 'masjid', 'mosque', 'gurudwara'], cat: 'Temple Wedding Venue' },
  { keys: ['community hall', 'community center', 'society hall', 'municipal hall', 'town hall'], cat: 'Standard Community Hall' },
  { keys: ['apartment', 'flat', 'residence', 'house', 'home', 'villa', 'bungalow', 'residential'], cat: 'Home Function / House Wedding' },
]

function guessCategory(result, venues) {
  const name = (result.display_name || '').toLowerCase()
  const type = (result.type || '').toLowerCase()
  const cls  = (result.class || '').toLowerCase()

  for (const { keys, cat } of KEYWORD_MAP) {
    if (keys.some(k => name.includes(k))) {
      return venues.find(v => v.category === cat)?.category ?? null
    }
  }

  if (cls === 'tourism' && type === 'hotel')  return venues.find(v => v.category === '5-Star Hotel Ballroom')?.category ?? null
  if (cls === 'tourism' && type === 'resort') return venues.find(v => v.category === 'Luxury Resort Property')?.category ?? null

  return null
}

function shortAddress(displayName) {
  return displayName.split(', ').slice(0, 3).join(', ')
}

// ── component ─────────────────────────────────────────────────────────────────

export function NominatimVenueSearch({
  value,
  onChange,
  onCategoryDetect,
  venues        = [],
  dark          = false,
  placeholder   = 'Search venue name or address…',
}) {
  const [query,      setQuery]      = useState(value || '')
  const [results,    setResults]    = useState([])
  const [loading,    setLoading]    = useState(false)
  const [open,       setOpen]       = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const [confirmed,  setConfirmed]  = useState(!!value)

  const containerRef = useRef(null)
  const timerRef     = useRef(null)

  // Reset when parent clears value
  useEffect(() => {
    if (!value) {
      setQuery('')
      setConfirmed(false)
      setResults([])
      setOpen(false)
    }
  }, [value])

  // Debounced Nominatim fetch (max 1 req/sec)
  useEffect(() => {
    if (confirmed) return
    if (query.trim().length < 3) { setResults([]); setOpen(false); return }

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const url =
          `https://nominatim.openstreetmap.org/search` +
          `?q=${encodeURIComponent(query)}` +
          `&format=json&addressdetails=1&limit=6&countrycodes=in`
        const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } })
        const data = await res.json()
        setResults(data)
        setOpen(data.length > 0)
      } catch {
        setResults([])
        setOpen(false)
      } finally {
        setLoading(false)
      }
    }, 850)

    return () => clearTimeout(timerRef.current)
  }, [query, confirmed])

  // Close on outside click
  useEffect(() => {
    function onDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function handleSelect(result) {
    const addr = shortAddress(result.display_name)
    setQuery(addr)
    setConfirmed(true)
    setOpen(false)
    setResults([])
    onChange(addr)
    const cat = guessCategory(result, venues)
    if (cat && onCategoryDetect) onCategoryDetect(cat)
  }

  function handleClear() {
    setQuery('')
    setConfirmed(false)
    setResults([])
    setOpen(false)
    onChange('')
  }

  // ── theme tokens ──────────────────────────────────────────────────────────

  const inp = dark ? {
    width: '100%', padding: '10px 36px 10px 36px', borderRadius: '12px',
    border: '1.5px solid rgba(201,149,108,0.25)', fontSize: '14px',
    color: 'rgba(255,255,255,0.9)', background: 'rgba(255,255,255,0.07)',
    fontFamily: 'Inter,sans-serif', outline: 'none', boxSizing: 'border-box',
  } : {
    width: '100%', padding: '9.5px 32px 9.5px 32px', borderRadius: '10px',
    border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
    fontSize: '13px', color: 'var(--dash-input-text)', outline: 'none',
    fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
  }

  const drop = dark ? {
    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60,
    background: '#1a0f1b', borderRadius: 14,
    border: '1.5px solid rgba(201,149,108,0.25)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
    overflow: 'hidden',
  } : {
    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 60,
    background: 'var(--dash-card-bg)', borderRadius: 12,
    border: '1.5px solid var(--dash-border)',
    boxShadow: '0 8px 24px var(--dash-shadow)',
    overflow: 'hidden',
  }

  function rowBg(hovered) {
    return hovered
      ? dark ? 'rgba(201,149,108,0.1)' : 'rgba(201,149,108,0.07)'
      : 'transparent'
  }

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>

      {/* Input */}
      <div style={{ position: 'relative' }}>
        <MapPin size={14} style={{
          position: 'absolute', left: dark ? 12 : 11, top: '50%',
          transform: 'translateY(-50%)',
          color: confirmed ? '#c9956c' : dark ? 'rgba(201,149,108,0.6)' : '#c9956c',
          pointerEvents: 'none',
        }} />

        <input
          style={inp}
          placeholder={placeholder}
          value={query}
          autoComplete="off"
          onChange={e => { setQuery(e.target.value); setConfirmed(false) }}
          onFocus={() => { if (results.length > 0 && !confirmed) setOpen(true) }}
        />

        {loading && (
          <Loader2
            size={14}
            className="animate-spin"
            style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)', color: '#c9956c',
            }}
          />
        )}

        {!loading && (confirmed || query) && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: 'absolute', right: 10, top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
              color: dark ? 'rgba(255,255,255,0.35)' : 'var(--dash-text-muted)',
              display: 'flex', alignItems: 'center',
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div style={drop}>
          {results.map((result, i) => {
            const parts = result.display_name.split(', ')
            const name  = parts.slice(0, 2).join(', ')
            const area  = parts.slice(2, 5).join(', ')
            const cat   = guessCategory(result, venues)
            const hov   = hoveredIdx === i

            return (
              <div
                key={result.place_id}
                style={{
                  padding: dark ? '10px 14px' : '9px 12px',
                  cursor: 'pointer',
                  background: rowBg(hov),
                  borderBottom: dark
                    ? '1px solid rgba(255,255,255,0.05)'
                    : '1px solid var(--dash-border)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(-1)}
                onClick={() => handleSelect(result)}
              >
                <div style={{
                  fontSize: dark ? 13.5 : 13, fontWeight: 600,
                  color: dark ? 'rgba(255,255,255,0.9)' : 'var(--dash-text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {name}
                </div>
                <div style={{
                  fontSize: 11.5, marginTop: 2, display: 'flex', alignItems: 'center', gap: 6,
                  color: dark ? 'rgba(255,255,255,0.38)' : 'var(--dash-text-muted)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{area}</span>
                  {cat && (
                    <span style={{
                      flexShrink: 0, padding: '1px 7px', borderRadius: 5, fontSize: 10.5,
                      background: 'rgba(201,149,108,0.15)', color: '#c9956c', fontWeight: 700,
                    }}>
                      {cat}
                    </span>
                  )}
                </div>
              </div>
            )
          })}

          <div style={{
            padding: '5px 12px', fontSize: 10,
            color: dark ? 'rgba(255,255,255,0.18)' : 'var(--dash-text-muted)',
            borderTop: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid var(--dash-border)',
            opacity: 0.75,
          }}>
            © OpenStreetMap contributors
          </div>
        </div>
      )}
    </div>
  )
}

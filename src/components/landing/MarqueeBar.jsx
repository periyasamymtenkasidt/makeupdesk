const ITEMS = [
  { icon: '★', text: 'Google 5.0 Rating' },
  { icon: '✦', text: 'Bridal Makeup Specialist' },
  { icon: '✦', text: '500+ Happy Clients' },
  { icon: '✦', text: '1000+ Events Completed' },
  { icon: '✦', text: 'Party & Editorial Looks' },
  { icon: '✦', text: 'Certified Professional Artists' },
  { icon: '✦', text: 'Premium Products Only' },
  { icon: '✦', text: 'Trusted Makeup Studio' },
]

const ALL = [...ITEMS, ...ITEMS]

export default function MarqueeBar() {
  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #08040a, #0e0710, #08040a)',
        borderTop: '1px solid rgba(201,149,108,0.12)',
        borderBottom: '1px solid rgba(201,149,108,0.12)',
        padding: '14px 0',
      }}
    >
      <div className="marquee-wrap">
        <div className="marquee-track">
          {ALL.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <span style={{ color: '#c9956c', fontSize: '11px' }}>{item.icon}</span>
              <span
                style={{
                  color: 'rgba(245,225,192,0.48)',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0 32px 0 10px',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

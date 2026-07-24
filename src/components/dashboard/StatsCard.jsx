export default function StatsCard({ label, value, delta, icon: Icon, color, bg, subtitle }) {
  const positive = delta?.startsWith('+')
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid rgba(201,149,108,0.18)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 20px rgba(45,27,46,0.03)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(45,27,46,0.08)'
        e.currentTarget.style.borderColor = 'rgba(201,149,108,0.35)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(45,27,46,0.03)'
        e.currentTarget.style.borderColor = 'rgba(201,149,108,0.18)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: bg || 'rgba(201,149,108,0.1)', flexShrink: 0
        }}>
          <Icon size={20} style={{ color }} />
        </div>
        {delta && (
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '9999px',
            background: positive ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.08)',
            color: positive ? '#059669' : '#dc2626',
            display: 'inline-flex', alignItems: 'center', gap: '3px'
          }}>
            {delta}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: '#2d1b2e', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#8b6e7e', marginTop: '6px' }}>{label}</div>
      {subtitle && (
        <div style={{ fontSize: '11px', color: '#a87655', marginTop: '4px' }}>{subtitle}</div>
      )}
    </div>
  )
}

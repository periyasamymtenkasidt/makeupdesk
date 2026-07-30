export default function StatsCard({ label, value, delta, icon: Icon, color, bg, subtitle }) {
  const positive = delta?.startsWith('+')
  return (
    <div
      style={{
        background: 'var(--dash-card-bg)',
        border: '1px solid var(--dash-border)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 4px 20px var(--dash-shadow)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 12px 28px var(--dash-shadow-hover)'
        e.currentTarget.style.borderColor = 'var(--dash-border-hover)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px var(--dash-shadow)'
        e.currentTarget.style.borderColor = 'var(--dash-border)'
      }}
    >
      {/* Top accent line using icon color */}
      <div style={{
        position: 'absolute', top: 0, left: '16px', right: '16px', height: '2px', borderRadius: '0 0 2px 2px',
        background: `linear-gradient(90deg, transparent, ${color || 'var(--color-rose-gold)'}, transparent)`,
        opacity: 0.7,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: bg || 'var(--icon-booking-bg)', flexShrink: 0,
          boxShadow: `0 4px 12px ${(bg || 'rgba(201,149,108,0.12)')}`,
        }}>
          <Icon size={20} style={{ color }} />
        </div>
        {delta && (
          <span style={{
            fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '9999px',
            background: positive ? 'var(--badge-confirmed-bg)' : 'var(--badge-rejected-bg)',
            color: positive ? 'var(--badge-confirmed)' : 'var(--badge-rejected)',
            display: 'inline-flex', alignItems: 'center', gap: '3px'
          }}>
            {delta}
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '28px', fontWeight: 700, color: 'var(--dash-text-primary)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dash-text-secondary)', marginTop: '6px' }}>{label}</div>
      {subtitle && (
        <div style={{ fontSize: '11px', color: 'var(--dash-text-secondary)', marginTop: '4px' }}>{subtitle}</div>
      )}
    </div>
  )
}

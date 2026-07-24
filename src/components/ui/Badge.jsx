import { STATUS_CONFIG } from '../../data/navigation'

export function Badge({ status, children }) {
  const label = status || children
  const cfg   = STATUS_CONFIG[label] ?? { color: '#8b6e7e', bg: 'rgba(139,110,126,0.1)' }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '9999px',
      fontSize: '12px', fontWeight: 500,
      color: cfg.color, background: cfg.bg,
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {label}
    </span>
  )
}

export function Input({ label, icon: Icon, error, className = '', style: extra, ...props }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '11px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: '#8b6e7e', marginBottom: '6px',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={14} style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: '#c9956c', pointerEvents: 'none',
          }} />
        )}
        <input
          {...props}
          style={{
            width: '100%', padding: Icon ? '10px 14px 10px 36px' : '10px 14px',
            borderRadius: '12px', border: error ? '1.5px solid #dc2626' : '1.5px solid rgba(201,149,108,0.25)',
            outline: 'none', fontSize: '14px', color: '#2d1b2e',
            background: 'white', fontFamily: 'Inter, system-ui, sans-serif',
            transition: 'border-color 0.2s', boxSizing: 'border-box',
            ...extra,
          }}
          onFocus={e  => { e.target.style.borderColor = '#c9956c' }}
          onBlur={e   => { e.target.style.borderColor = error ? '#dc2626' : 'rgba(201,149,108,0.25)' }}
        />
      </div>
      {error && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

export function Select({ label, icon: Icon, children, error, style: extra, ...props }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '11px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: '#8b6e7e', marginBottom: '6px',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={14} style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: '#c9956c', pointerEvents: 'none', zIndex: 1,
          }} />
        )}
        <select
          {...props}
          style={{
            width: '100%', padding: Icon ? '10px 36px 10px 36px' : '10px 36px 10px 14px',
            borderRadius: '12px', border: '1.5px solid rgba(201,149,108,0.25)',
            outline: 'none', fontSize: '14px', color: '#2d1b2e',
            background: 'white', fontFamily: 'Inter, system-ui, sans-serif',
            appearance: 'none', cursor: 'pointer', boxSizing: 'border-box',
            ...extra,
          }}
        >
          {children}
        </select>
        <svg style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#c9956c' }}
             width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {error && <p style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

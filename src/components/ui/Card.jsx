export function Card({ children, style, className = '', hover = false, ...props }) {
  return (
    <div
      {...props}
      className={hover ? `card-lift ${className}` : className}
      style={{
        background: 'var(--dash-card-bg)',
        border: '1px solid var(--dash-border)',
        borderRadius: '20px',
        boxShadow: '0 4px 24px var(--dash-shadow), 0 1px 3px rgba(0,0,0,0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, style, ...props }) {
  return (
    <div
      {...props}
      style={{
        padding: '18px 24px',
        borderBottom: '1px solid var(--dash-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardBody({ children, style, ...props }) {
  return (
    <div {...props} style={{ padding: '24px', ...style }}>
      {children}
    </div>
  )
}

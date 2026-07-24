export function Card({ children, style, className = '', hover = false, ...props }) {
  return (
    <div
      {...props}
      className={hover ? `card-lift ${className}` : className}
      style={{
        background: 'white',
        border: '1px solid rgba(201,149,108,0.12)',
        borderRadius: '20px',
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
        borderBottom: '1px solid rgba(201,149,108,0.1)',
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

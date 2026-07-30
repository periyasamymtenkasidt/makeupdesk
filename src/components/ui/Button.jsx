const VARIANTS = {
  primary:     { background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)', color: '#ffffff', border: '1.5px solid transparent' },
  outline:     { background: 'transparent', color: 'var(--dash-text-primary)', border: '1.5px solid var(--dash-border)' },
  ghost:       { background: 'var(--btn-ghost-bg)', color: 'var(--btn-ghost-color)', border: '1.5px solid var(--btn-ghost-border)' },
  dark:        { background: '#ffffff', color: '#1a0f1b', border: '1.5px solid #ffffff' },
  darkOutline: { background: 'rgba(255, 255, 255, 0.08)', color: '#ffffff', border: '1.5px solid rgba(255, 255, 255, 0.28)' },
  whatsapp:    { background: '#25D366', color: '#ffffff', border: '1.5px solid #25D366' },
  danger:      { background: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected)', border: '1.5px solid transparent' },
  success:     { background: 'var(--badge-confirmed-bg)', color: 'var(--badge-confirmed)', border: '1.5px solid transparent' },
}

const SIZES = {
  xs:   { padding: '5px 12px',  fontSize: '12px', borderRadius: '8px'    },
  sm:   { padding: '7px 16px',  fontSize: '13px', borderRadius: '8px'    },
  md:   { padding: '10px 20px', fontSize: '14px', borderRadius: '10px'   },
  lg:   { padding: '13px 28px', fontSize: '15px', borderRadius: '9999px' },
  pill: { padding: '10px 24px', fontSize: '14px', borderRadius: '9999px' },
}

export function Button({
  variant = 'primary',
  size = 'pill',
  as: Tag = 'button',
  children,
  style: extra,
  fullWidth,
  ...props
}) {
  return (
    <Tag
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: fullWidth ? 'center' : undefined,
        gap: '7px',
        width: fullWidth ? '100%' : undefined,
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 500,
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'all 0.25s ease',
        whiteSpace: 'nowrap',
        ...VARIANTS[variant],
        ...SIZES[size],
        ...extra,
      }}
    >
      {children}
    </Tag>
  )
}

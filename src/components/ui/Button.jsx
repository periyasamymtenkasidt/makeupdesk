const VARIANTS = {
  primary:     { background: 'linear-gradient(135deg,#c9956c,#d4728f)', color: 'white',    border: '1.5px solid transparent'            },
  outline:     { background: 'transparent',                              color: '#c9956c',  border: '1.5px solid #c9956c'                },
  ghost:       { background: 'rgba(201,149,108,0.08)',                  color: '#c9956c',  border: '1.5px solid transparent'            },
  dark:        { background: 'white',                                    color: '#2d1b2e',  border: '1.5px solid transparent'            },
  darkOutline: { background: 'rgba(255,255,255,0.1)',                   color: 'white',    border: '1.5px solid rgba(255,255,255,0.35)' },
  danger:      { background: 'rgba(220,38,38,0.08)',                    color: '#dc2626',  border: '1.5px solid transparent'            },
  success:     { background: 'rgba(5,150,105,0.08)',                    color: '#059669',  border: '1.5px solid transparent'            },
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

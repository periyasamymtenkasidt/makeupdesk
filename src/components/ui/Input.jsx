export function Input({ label, icon: Icon, error, className = '', style: extra, ...props }) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{
          display: 'block', fontSize: '11px', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.08em',
          color: 'var(--dash-label-text)', marginBottom: '6px',
        }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <Icon size={14} style={{
            position: 'absolute', left: '12px', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--color-rose-gold)', pointerEvents: 'none',
          }} />
        )}
        <input
          {...props}
          style={{
            width: '100%', padding: Icon ? '10px 14px 10px 36px' : '10px 14px',
            borderRadius: '12px', border: error ? '1.5px solid var(--color-danger)' : '1.5px solid var(--dash-border)',
            outline: 'none', fontSize: '14px', color: 'var(--dash-input-text)',
            background: 'var(--dash-input-bg)', fontFamily: 'Inter, system-ui, sans-serif',
            transition: 'border-color 0.2s', boxSizing: 'border-box',
            ...extra,
          }}
          onFocus={e  => { e.target.style.borderColor = 'var(--color-rose-gold)' }}
          onBlur={e   => { e.target.style.borderColor = error ? 'var(--color-danger)' : 'var(--dash-border)' }}
        />
      </div>
      {error && <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

import { CustomSelect } from './CustomSelect'

export function Select({ label, children, value, onChange, placeholder, style: extra, error }) {
  let options = []
  if (Array.isArray(children)) {
    options = children.filter(Boolean).map(child => ({
      value: child.props?.value ?? child.props?.children,
      label: child.props?.children ?? String(child.props?.value),
    }))
  }

  return (
    <div style={{ width: '100%' }}>
      <CustomSelect
        label={label}
        value={value}
        placeholder={placeholder}
        options={options}
        onChange={val => onChange && onChange({ target: { value: val } })}
        style={extra}
      />
      {error && <p style={{ color: 'var(--color-danger)', fontSize: '12px', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

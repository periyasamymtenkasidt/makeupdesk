import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({ open, onClose, title, children, onSave, saveLabel = 'Save', width = '540px' }) {
  if (!open) return null
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(14,7,16,0.55)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white', borderRadius: '20px', width: '100%', maxWidth: width,
        boxShadow: '0 32px 80px rgba(0,0,0,0.18)', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid rgba(201,149,108,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 600, color: '#2d1b2e', margin: 0 }}>
            {title}
          </h3>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '50%', border: 'none',
            background: 'rgba(201,149,108,0.08)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={15} style={{ color: '#c9956c' }} />
          </button>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        <div style={{
          padding: '16px 24px', borderTop: '1px solid rgba(201,149,108,0.1)',
          display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0,
        }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={onSave}>{saveLabel}</Button>
        </div>
      </div>
    </div>
  )
}

import { X } from 'lucide-react'
import { Button } from './Button'

export function Modal({ open, onClose, title, children, onSave, saveLabel = 'Save', width = '540px' }) {
  if (!open) return null
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'var(--dash-modal-overlay)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <div style={{
        background: 'var(--dash-card-bg)', borderRadius: '20px', width: '100%', maxWidth: width,
        boxShadow: '0 32px 80px var(--dash-shadow)', maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
        border: '1.5px solid var(--dash-border)',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px', borderBottom: '1px solid var(--dash-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '18px', fontWeight: 600, color: 'var(--dash-text-primary)', margin: 0 }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '32px', height: '32px', borderRadius: '50%', border: 'none',
              background: 'var(--dash-subtle-row-bg)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <X size={16} style={{ color: 'var(--dash-text-primary)' }} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {children}
        </div>

        {/* Modal Footer Actions */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--dash-border)',
          display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0,
        }}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={onSave}>
            {saveLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

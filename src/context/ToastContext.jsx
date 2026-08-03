import { createContext, useContext, useState, useCallback } from 'react'
import { X, Bell, AlertTriangle, CheckCircle } from 'lucide-react'

const ToastCtx = createContext(null)

let uid = 0

const TYPES = {
  info:    { Icon: Bell,          color: 'var(--icon-booking)',    bg: 'var(--icon-booking-bg)',    border: 'var(--dash-border)' },
  success: { Icon: CheckCircle,   color: 'var(--badge-confirmed)', bg: 'var(--badge-confirmed-bg)', border: 'rgba(5,150,105,0.25)' },
  warning: { Icon: AlertTriangle, color: 'var(--badge-pending)',   bg: 'var(--badge-pending-bg)',   border: 'rgba(217,119,6,0.25)' },
}

function ToastItem({ toast, onDismiss }) {
  const cfg = TYPES[toast.type] || TYPES.info
  const { Icon } = cfg
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px', borderRadius: 14,
      background: 'var(--dash-card-bg)', border: `1.5px solid ${cfg.border}`,
      boxShadow: '0 8px 24px var(--dash-shadow)',
      fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--dash-text-primary)',
      animation: 'toastSlideIn 0.25s ease',
      maxWidth: 360, width: '100%',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: cfg.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={14} style={{ color: cfg.color }} />
      </div>
      <div style={{ flex: 1, lineHeight: 1.5, paddingTop: 2 }}>{toast.message}</div>
      <button
        onClick={onDismiss}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--dash-text-muted)', padding: 0,
          display: 'flex', alignItems: 'center', flexShrink: 0, paddingTop: 4,
        }}
      >
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = ++uid
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastCtx.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto' }}>
            <ToastItem toast={t} onDismiss={() => dismiss(t.id)} />
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}

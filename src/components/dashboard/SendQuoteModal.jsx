import { useState } from 'react'
import { X, Send, FileText, MessageCircle, QrCode } from 'lucide-react'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../utils/formatCurrency'
import { useSettings } from '../../hooks/useSettings'

export default function SendQuoteModal({ appt, onClose, onSend }) {
  const { settings } = useSettings()
  const [amount, setAmount] = useState(String(appt.amount || ''))
  const [note,   setNote]   = useState('')

  const advanceAmount = Math.round((Number(amount) || 0) * ((settings?.advancePct || 40) / 100))
  const qrImage = settings?.qrCodeImage || (settings?.upiId ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${settings.upiId}&pn=${settings.studioName || 'Makeup Studio'}`)}` : '')

  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '9px 0', borderBottom: '1px solid var(--dash-border-subtle)' }
  const lblStyle = { fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', paddingTop: '1px' }
  const valStyle = { fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)', textAlign: 'right', maxWidth: '60%' }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'var(--dash-modal-overlay)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
      }}
    >
      <div style={{
        background: 'var(--dash-card-bg)', borderRadius: '20px', width: '100%', maxWidth: '500px',
        boxShadow: '0 32px 80px var(--dash-shadow)', display: 'flex', flexDirection: 'column',
        maxHeight: '92vh',
      }}>
        {/* header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--dash-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
        }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: '18px', fontWeight: 600, color: 'var(--dash-text-primary)', margin: 0 }}>
              Send Quote
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--dash-text-muted)', margin: '2px 0 0' }}>
              Downloads a branded PDF quote, then opens WhatsApp
            </p>
          </div>
          <button onClick={onClose} style={{
            width: '32px', height: '32px', borderRadius: '50%', border: 'none',
            background: 'rgba(var(--rgb-rose-gold),0.08)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={15} style={{ color: 'var(--color-rose-gold)' }} />
          </button>
        </div>

        {/* body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* quote preview */}
          <div style={{
            background: 'rgba(201,149,108,0.06)', border: '1.5px solid rgba(201,149,108,0.2)',
            borderRadius: '14px', padding: '16px 20px',
          }}>
            <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#a0622a', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 10px' }}>
              Quote Preview
            </p>
            {[
              ['Client',   appt.name],
              ['Mobile',   appt.phone],
              ['Service',  appt.service],
              ['Date',     appt.date],
              ['Time',     appt.time],
              ['Duration', appt.duration],
              ['Location', appt.location],
            ].map(([l, v]) => (
              <div key={l} style={rowStyle}>
                <span style={lblStyle}>{l}</span>
                <span style={valStyle}>{v || '—'}</span>
              </div>
            ))}
          </div>

          {/* editable amount */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>
              Quote Amount (₹)
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                fontSize: '14px', fontWeight: 700, color: 'var(--dash-text-secondary)',
              }}>₹</span>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{
                  width: '100%', padding: '11px 14px 11px 28px', borderRadius: '10px',
                  border: '1.5px solid var(--dash-border)', fontSize: '15px', fontWeight: 700,
                  color: 'var(--dash-text-primary)', background: 'var(--dash-card-bg)',
                  outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Payment & QR Code Preview */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: '12px',
            background: 'var(--dash-subtle-row-bg)', border: '1px solid var(--dash-border)',
            gap: '14px',
          }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Advance Deposit ({settings?.advancePct || 40}%)
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--icon-booking)', marginTop: '2px' }}>
                {formatCurrency(advanceAmount)}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)', marginTop: '2px' }}>
                UPI VPA: <strong>{settings?.upiId || 'Not set'}</strong>
              </div>
            </div>

            {qrImage ? (
              <div style={{
                width: 68, height: 68, borderRadius: '10px', border: '1.5px solid var(--dash-border)',
                background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 6px var(--dash-shadow)', padding: '2px',
              }}>
                <img src={qrImage} alt="Payment QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: '8px', background: 'var(--dash-card-bg)', border: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={22} style={{ color: 'var(--dash-text-muted)' }} />
              </div>
            )}
          </div>

          {/* optional note */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '7px' }}>
              Custom Note <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              placeholder="e.g. Includes HD finish + touch-up kit…"
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={2}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '10px',
                border: '1.5px solid var(--dash-border)', fontSize: '13.5px',
                color: 'var(--dash-text-primary)', background: 'var(--dash-card-bg)',
                resize: 'vertical', outline: 'none', boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* flow info */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '6px', padding: '12px 14px',
            background: 'rgba(201,149,108,0.06)', borderRadius: '10px',
            border: '1px solid rgba(201,149,108,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={13} style={{ color: 'var(--color-rose-gold)', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: 'var(--dash-text-secondary)' }}>
                A branded PDF quote will be <strong>downloaded</strong> to your device
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageCircle size={13} style={{ color: '#25d366', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: 'var(--dash-text-secondary)' }}>
                WhatsApp opens so you can share it with <strong>{appt.phone}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* footer */}
        <div style={{
          padding: '16px 24px', borderTop: '1px solid var(--dash-border)',
          display: 'flex', justifyContent: 'flex-end', gap: '10px', flexShrink: 0,
        }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            variant="whatsapp" size="sm"
            onClick={() => onSend(Number(amount) || 0, note)}
            style={{ gap: '6px', fontWeight: 600 }}
          >
            <MessageCircle size={15} /> Download PDF & Send on WhatsApp
          </Button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { X, CheckCircle, Star, MessageSquare, Banknote, Smartphone } from 'lucide-react'
import { Button } from '../ui/Button'
import { formatCurrency } from '../../utils/formatCurrency'
import { sendBalanceInvoiceViaWhatsApp } from '../../utils/whatsapp'

// ── Collect Balance Modal ─────────────────────────────────────────────────────
function CollectBalanceModal({ appt, onClose, onConfirm }) {
  const [method, setMethod] = useState('Cash')
  const advance    = appt.advancePaid ? (appt.advanceAmount || 0) : 0
  const balanceDue = Math.max(0, (appt.amount || 0) - advance)

  const overlay = { position: 'fixed', inset: 0, zIndex: 300, background: 'var(--dash-modal-overlay)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }
  const sheet   = { background: 'var(--dash-card-bg)', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 32px 80px var(--dash-shadow)', display: 'flex', flexDirection: 'column' }

  return (
    <div style={overlay}>
      <div style={sheet}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: '18px', fontWeight: 600, color: 'var(--dash-text-primary)', margin: 0 }}>Collect Balance</h3>
            <p style={{ fontSize: '12px', color: 'var(--dash-text-muted)', margin: '2px 0 0' }}>Confirm payment received from {appt.name}</p>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(var(--rgb-rose-gold),0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} style={{ color: 'var(--color-rose-gold)' }} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: 'rgba(201,149,108,0.06)', border: '1.5px solid rgba(201,149,108,0.18)', borderRadius: '14px', padding: '16px 20px' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 700, color: '#a0622a', textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 12px' }}>Payment Summary</p>
            {[['Total Amount', formatCurrency(appt.amount || 0)], ['Advance Paid', formatCurrency(advance)]].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--dash-border-subtle)' }}>
                <span style={{ fontSize: '12px', color: 'var(--dash-text-muted)', fontWeight: 600 }}>{l}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)' }}>Balance Due</span>
              <span style={{ fontSize: '18px', fontWeight: 800, color: balanceDue > 0 ? 'var(--color-rose-gold)' : 'var(--badge-confirmed)' }}>
                {formatCurrency(balanceDue)}
              </span>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>Payment Method</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[{ id: 'Cash', icon: Banknote }, { id: 'UPI', icon: Smartphone }].map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setMethod(id)} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid',
                  borderColor: method === id ? 'var(--color-rose-gold)' : 'var(--dash-border)',
                  background: method === id ? 'rgba(201,149,108,0.08)' : 'var(--dash-card-bg)',
                  cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s',
                }}>
                  <Icon size={18} style={{ color: method === id ? 'var(--color-rose-gold)' : 'var(--dash-text-muted)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: method === id ? 'var(--color-rose-gold)' : 'var(--dash-text-secondary)' }}>{id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Send Balance Invoice Banner */}
          <div style={{ borderTop: '1px solid var(--dash-border-subtle)', paddingTop: '14px' }}>
            <button
              onClick={async () => {
                const res = await sendBalanceInvoiceViaWhatsApp(appt)
                if (res?.method === 'download_and_whatsapp') {
                  alert(`📄 Balance Invoice PDF downloaded (${res.fileName})\n📲 WhatsApp launched for ${appt.name}! Click the attachment 📎 icon in WhatsApp to send the PDF.`)
                }
              }}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '10px',
                background: '#25D366', color: 'white', border: 'none',
                fontWeight: 700, fontSize: '12.5px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                fontFamily: 'Inter, sans-serif', boxShadow: '0 2px 8px rgba(37,211,102,0.3)',
              }}
            >
              <Smartphone size={15} /> Send Balance Invoice on WhatsApp
            </button>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => onConfirm(method)} style={{ gap: '6px' }}>
            <CheckCircle size={13} /> Confirm Received
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Feedback Modal ────────────────────────────────────────────────────────────
function FeedbackModal({ appt, onSkip, onSave }) {
  const [rating,   setRating]   = useState(0)
  const [hovered,  setHovered]  = useState(0)
  const [comment,  setComment]  = useState('')
  const [featured, setFeatured] = useState(true)

  const overlay = { position: 'fixed', inset: 0, zIndex: 300, background: 'var(--dash-modal-overlay)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }
  const sheet   = { background: 'var(--dash-card-bg)', borderRadius: '20px', width: '100%', maxWidth: '420px', boxShadow: '0 32px 80px var(--dash-shadow)', display: 'flex', flexDirection: 'column' }
  const starClr  = i => (hovered || rating) >= i ? '#f59e0b' : 'var(--dash-border)'

  function sendWhatsAppRequest() {
    const text = `Hi ${appt.name}! ✨ Thank you for choosing us for your ${appt.service || 'Makeup Service'}. We would love to hear your feedback! Please send us a quick rating or review.`
    const phone = (appt.phone || '').replace(/[^0-9]/g, '')
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div style={overlay}>
      <div style={sheet}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--dash-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'Playfair Display,serif', fontSize: '18px', fontWeight: 600, color: 'var(--dash-text-primary)', margin: 0 }}>Client Feedback</h3>
            <p style={{ fontSize: '12px', color: 'var(--dash-text-muted)', margin: '2px 0 0' }}>Log feedback from {appt.name}</p>
          </div>
          <button onClick={onSkip} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'rgba(var(--rgb-rose-gold),0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={15} style={{ color: 'var(--color-rose-gold)' }} />
          </button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* WhatsApp Request Banner */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', borderRadius: '12px',
            background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)',
          }}>
            <div>
              <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#16a34a' }}>Need client review?</div>
              <div style={{ fontSize: '11px', color: 'var(--dash-text-muted)' }}>Send a 1-click WhatsApp feedback message</div>
            </div>
            <button
              onClick={sendWhatsAppRequest}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                padding: '6px 12px', borderRadius: '8px', border: 'none',
                background: '#25D366', color: 'white', fontWeight: 700,
                fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
              }}
            >
              <Smartphone size={13} /> Request
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dash-text-secondary)', margin: '0 0 14px' }}>
              How was the client's experience?
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <button key={i} onClick={() => setRating(i)}
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(0)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'transform 0.15s' }}
                >
                  <Star size={34} fill={starClr(i)} style={{ color: starClr(i), transition: 'all 0.15s' }} />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p style={{ fontSize: '12px', color: 'var(--dash-text-muted)', marginTop: '8px' }}>
                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][rating]}
              </p>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>
              Comment <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              placeholder="What did the client say about the work?"
              value={comment} onChange={e => setComment(e.target.value)} rows={3}
              style={{
                width: '100%', padding: '11px 14px', borderRadius: '10px',
                border: '1.5px solid var(--dash-border)', fontSize: '13.5px',
                color: 'var(--dash-text-primary)', background: 'var(--dash-card-bg)',
                resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Featured on landing page checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12.5px', color: 'var(--dash-text-secondary)', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
              style={{ accentColor: 'var(--color-rose-gold)', width: 16, height: 16, cursor: 'pointer' }}
            />
            Show on Landing Page Testimonials
          </label>
        </div>

        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--dash-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <Button variant="ghost" size="sm" onClick={onSkip}>Skip</Button>
          <Button variant="primary" size="sm" onClick={() => onSave(rating, comment, featured)}
            disabled={rating === 0} style={{ gap: '6px', opacity: rating === 0 ? 0.5 : 1 }}>
            <MessageSquare size={13} /> Save Feedback
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── MarkDoneFlow ──────────────────────────────────────────────────────────────
// Manages the balance-collection → feedback sequence.
// onUpdate(data) — called for each incremental appointment update
// onDone()       — called when the entire flow finishes
export default function MarkDoneFlow({ appt, onUpdate, onDone, startAt = 'balance' }) {
  const [step, setStep] = useState(startAt)

  function handleBalanceConfirmed(method) {
    onUpdate({ balancePaid: true, balancePaymentMethod: method })
    setStep('feedback')
  }

  function handleFeedbackSave(rating, comment, featured) {
    const feedbackObj = {
      rating,
      comment,
      featured,
      collectedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    }
    onUpdate({
      status:   'Completed',
      feedback: feedbackObj,
    })

    // Also sync to md_reviews in localStorage for Testimonials section
    try {
      const stored = JSON.parse(localStorage.getItem('md_reviews') || '[]')
      const filtered = stored.filter(r => r.appointmentId !== appt.id)
      const newReview = {
        id: `REV-${Date.now()}`,
        appointmentId: appt.id,
        name: appt.name,
        event: `${appt.service} · ${appt.location || 'Studio'}`,
        rating,
        text: comment || 'Loved the makeup look and service!',
        initials: appt.name ? appt.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'CL',
        color: '#c9956c',
        bg: '#f5e1c0',
        featured: featured !== false,
      }
      localStorage.setItem('md_reviews', JSON.stringify([newReview, ...filtered]))
    } catch (e) {
      console.error(e)
    }

    onDone()
  }

  function handleFeedbackSkip() {
    onUpdate({ status: 'Completed' })
    onDone()
  }

  if (step === 'balance') {
    return <CollectBalanceModal appt={appt} onClose={onDone} onConfirm={handleBalanceConfirmed} />
  }
  return <FeedbackModal appt={appt} onSkip={handleFeedbackSkip} onSave={handleFeedbackSave} />
}

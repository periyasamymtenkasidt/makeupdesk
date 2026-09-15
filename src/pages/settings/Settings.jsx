import { useState } from 'react'
import {
  Building2, CreditCard, MessageSquare, Bell, Save,
  CheckCircle2, RotateCcw, QrCode, Shield, Sparkles, AlertCircle
} from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useSettings } from '../../hooks/useSettings'

const TABS = [
  { id: 'profile',     label: 'Studio Profile',       icon: Building2     },
  { id: 'payments',    label: 'Payments & UPI',       icon: CreditCard    },
  { id: 'templates',   label: 'WhatsApp Templates',   icon: MessageSquare },
  { id: 'preferences', label: 'Alerts & Preferences', icon: Bell          },
]

const inpStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1.5px solid var(--dash-border)', background: 'var(--dash-input-bg)',
  fontSize: '13.5px', color: 'var(--dash-input-text)', outline: 'none',
  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
}

const lblStyle = {
  display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
  marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em',
}

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [activeTab, setActiveTab] = useState('profile')
  const [formState, setFormState] = useState(settings)
  const [savedToast, setSavedToast] = useState(false)

  const set = (key, val) => setFormState(f => ({ ...f, [key]: val }))

  function handleSave(e) {
    e?.preventDefault()
    if (formState.phone && formState.phone.replace(/\s/g, '').length !== 10) {
      alert('Phone number must be exactly 10 digits.')
      return
    }
    updateSettings(formState)
    setSavedToast(true)
    setTimeout(() => setSavedToast(false), 3000)
  }

  function handleReset() {
    if (window.confirm('Reset all settings to default values?')) {
      resetSettings()
      setFormState(settings)
    }
  }

  function handleQrUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Image file size should be less than 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      set('qrCodeImage', reader.result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Save Notification Toast */}
      {savedToast && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 20px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white', fontWeight: 600, fontSize: '13.5px',
          boxShadow: '0 4px 18px rgba(16,185,129,0.35)',
          animation: 'fade-in-up 0.3s ease-out',
        }}>
          <CheckCircle2 size={18} />
          Settings saved successfully!
        </div>
      )}

      {/* Sticky Header Section */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'var(--dash-bg)',
        paddingTop: '20px',
        marginTop: '-24px',
        paddingBottom: '14px',
        marginBottom: '10px',
      }}>
        {/* Tabs Bar */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid var(--dash-border)', paddingBottom: '12px' }}>
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '9px 18px', borderRadius: '12px', fontSize: '13.5px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s ease', border: 'none',
                fontFamily: 'Inter, sans-serif',
                ...(activeTab === id
                  ? { background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)', color: '#ffffff', boxShadow: '0 2px 10px rgba(201,149,108,0.35)' }
                  : { background: 'var(--dash-surface)', color: 'var(--dash-text-secondary)', border: '1px solid var(--dash-border)' }
                ),
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Form */}
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Tab 1: Studio Profile */}
        {activeTab === 'profile' && (
          <Card style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--dash-border)', paddingBottom: '16px' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #c9956c 0%, #e8a4b8 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '20px',
                boxShadow: '0 4px 16px rgba(201,149,108,0.3)',
              }}>
                {formState.artistName?.charAt(0) || 'A'}
              </div>
              <div>
                <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'var(--dash-text-primary)' }}>
                  {formState.studioName || 'Studio Profile'}
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--dash-text-muted)' }}>
                  Manage your business profile, contact details, and invoice headers.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lblStyle}>Studio / Brand Name *</label>
                <input style={inpStyle} value={formState.studioName} onChange={e => set('studioName', e.target.value)} placeholder="e.g. Ananya Makeup Studio" />
              </div>
              <div>
                <label style={lblStyle}>Lead Artist Name *</label>
                <input style={inpStyle} value={formState.artistName} onChange={e => set('artistName', e.target.value)} placeholder="e.g. Ananya Roy" />
              </div>
            </div>

            <div>
              <label style={lblStyle}>Tagline / Professional Title</label>
              <input style={inpStyle} value={formState.tagline} onChange={e => set('tagline', e.target.value)} placeholder="e.g. Certified Luxury Bridal & Editorial Artist" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lblStyle}>Phone / WhatsApp Number *</label>
                <input style={inpStyle} value={formState.phone} onChange={e => set('phone', e.target.value.replace(/[^0-9 ]/g, '').slice(0, 15))} placeholder="98765 43210" />
              </div>
              <div>
                <label style={lblStyle}>Business Email *</label>
                <input style={inpStyle} value={formState.email} onChange={e => set('email', e.target.value)} placeholder="artist@studio.com" />
              </div>
            </div>

            <div>
              <label style={lblStyle}>Studio Address</label>
              <input style={inpStyle} value={formState.address} onChange={e => set('address', e.target.value)} placeholder="Studio address or primary city base" />
            </div>

            <div>
              <label style={lblStyle}>GSTIN / Tax ID (Optional)</label>
              <input style={inpStyle} value={formState.gstin} onChange={e => set('gstin', e.target.value)} placeholder="e.g. 27AABCU9603R1ZM" />
            </div>
          </Card>
        )}

        {/* Tab 2: Payments & UPI */}
        {activeTab === 'payments' && (
          <Card style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'var(--dash-text-primary)' }}>
                Payment & UPI Setup
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--dash-text-muted)' }}>
                Configure your UPI VPA, QR code image, bank details, and default advance deposit requirements.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={lblStyle}>UPI VPA ID *</label>
                <input style={inpStyle} value={formState.upiId} onChange={e => set('upiId', e.target.value)} placeholder="e.g. artistname@upi" />
              </div>
              <div>
                <label style={lblStyle}>Default Advance Deposit %</label>
                <input type="number" style={inpStyle} value={formState.advancePct} onChange={e => set('advancePct', Number(e.target.value))} placeholder="40" />
              </div>
            </div>

            {/* QR Code Upload & Preview Section */}
            <div style={{
              background: 'var(--dash-subtle-row-bg)',
              border: '1.5px dashed var(--dash-border)',
              borderRadius: '16px',
              padding: '18px 22px',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{
                  width: 96, height: 96, borderRadius: '12px', border: '1.5px solid var(--dash-border)',
                  background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px var(--dash-shadow)',
                }}>
                  {formState.qrCodeImage ? (
                    <img src={formState.qrCodeImage} alt="Uploaded Studio QR Code" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : formState.upiId ? (
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${formState.upiId}&pn=${formState.studioName || 'Makeup Studio'}`)}`} alt="Auto Generated UPI QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <QrCode size={36} style={{ color: 'var(--dash-text-muted)' }} />
                  )}
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <QrCode size={16} style={{ color: 'var(--icon-booking)' }} />
                    {formState.qrCodeImage ? 'Uploaded Official QR Code' : 'UPI Payment QR Code'}
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--dash-text-muted)', margin: '4px 0 12px', maxWidth: '340px', lineHeight: 1.45 }}>
                    {formState.qrCodeImage
                      ? 'Official GPay / PhonePe / Paytm QR Code image is active.'
                      : 'Upload an image file of your GPay / PhonePe QR code, or use auto-generated UPI QR.'}
                  </p>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      padding: '7.5px 16px', borderRadius: '8px',
                      background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)',
                      color: 'white', fontSize: '12px', fontWeight: 700,
                      cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                      boxShadow: '0 2px 8px rgba(201,149,108,0.3)',
                    }}>
                      📁 Upload QR Code
                      <input type="file" accept="image/*" onChange={handleQrUpload} style={{ display: 'none' }} />
                    </label>
                    {formState.qrCodeImage && (
                      <button
                        type="button"
                        onClick={() => set('qrCodeImage', '')}
                        style={{
                          padding: '7.5px 14px', borderRadius: '8px', border: '1px solid var(--dash-border)',
                          background: 'var(--dash-surface)', color: 'var(--badge-rejected)',
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--dash-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={16} style={{ color: 'var(--icon-booking)' }} /> Bank Transfer Details
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={lblStyle}>Bank Name</label>
                  <input style={inpStyle} value={formState.bankName} onChange={e => set('bankName', e.target.value)} placeholder="e.g. HDFC Bank" />
                </div>
                <div>
                  <label style={lblStyle}>Account Number</label>
                  <input style={inpStyle} value={formState.accountNo} onChange={e => set('accountNo', e.target.value)} placeholder="Bank Account Number" />
                </div>
              </div>

              <div>
                <label style={lblStyle}>IFSC Code</label>
                <input style={inpStyle} value={formState.ifscCode} onChange={e => set('ifscCode', e.target.value)} placeholder="e.g. HDFC0001234" />
              </div>
            </div>
          </Card>
        )}

        {/* Tab 3: WhatsApp Templates */}
        {activeTab === 'templates' && (
          <Card style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'var(--dash-text-primary)' }}>
                WhatsApp Communication Templates
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--dash-text-muted)' }}>
                Customize message templates sent to clients on WhatsApp. Use variables like <code>{'{client}'}</code>, <code>{'{service}'}</code>, <code>{'{date}'}</code>, <code>{'{amount}'}</code>.
              </p>
            </div>

            <div>
              <label style={lblStyle}>Quotation Message Template</label>
              <textarea
                rows={3}
                style={{ ...inpStyle, resize: 'vertical' }}
                value={formState.quoteTemplate}
                onChange={e => set('quoteTemplate', e.target.value)}
              />
            </div>

            <div>
              <label style={lblStyle}>Booking Confirmation Template</label>
              <textarea
                rows={3}
                style={{ ...inpStyle, resize: 'vertical' }}
                value={formState.confirmTemplate}
                onChange={e => set('confirmTemplate', e.target.value)}
              />
            </div>

            <div>
              <label style={lblStyle}>Payment Receipt Template</label>
              <textarea
                rows={3}
                style={{ ...inpStyle, resize: 'vertical' }}
                value={formState.receiptTemplate}
                onChange={e => set('receiptTemplate', e.target.value)}
              />
            </div>
          </Card>
        )}

        {/* Tab 4: Preferences & Alerts */}
        {activeTab === 'preferences' && (
          <Card style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Playfair Display, serif', fontSize: '18px', color: 'var(--dash-text-primary)' }}>
                Alerts & System Preferences
              </h3>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: 'var(--dash-text-muted)' }}>
                Manage sound effects, lead notifications, and skin sensitivity warnings.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Lead Alerts */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'var(--dash-subtle-row-bg)', border: '1px solid var(--dash-border)' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                    New Lead & Inquiry Alerts
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>
                    Show popup notifications when new website inquiries come in.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formState.leadAlerts}
                  onChange={e => set('leadAlerts', e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--icon-booking)' }}
                />
              </div>

              {/* Allergy Alerts */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'var(--dash-subtle-row-bg)', border: '1px solid var(--dash-border)' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                    Skin Allergy & Sensitivity Warnings
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>
                    Highlight high-risk client skin allergy tags in appointment profiles.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formState.allergyAlerts}
                  onChange={e => set('allergyAlerts', e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--icon-booking)' }}
                />
              </div>

              {/* Auto Reminders */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', background: 'var(--dash-subtle-row-bg)', border: '1px solid var(--dash-border)' }}>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                    Automated Event Reminders
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--dash-text-muted)' }}>
                    Send automated reminder alerts 24 hours before Muhurtham time slots.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formState.autoReminders}
                  onChange={e => set('autoReminders', e.target.checked)}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: 'var(--icon-booking)' }}
                />
              </div>

            </div>
          </Card>
        )}

        {/* Actions Bar - Sticky Bottom Footer */}
        <div style={{
          position: 'sticky',
          bottom: 0,
          zIndex: 30,
          background: 'var(--dash-bg)',
          paddingTop: '16px',
          paddingBottom: '16px',
          marginTop: '24px',
          borderTop: '1.5px solid var(--dash-border)',
          display: 'flex',
          alignItems: 'center',
          justify: 'flex-end',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              style={{
                gap: '6px',
                color: 'var(--dash-text-muted)',
              }}
            >
              <RotateCcw size={14} /> Reset Defaults
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              style={{
                gap: '8px',
                fontWeight: 700,
                boxShadow: '0 4px 16px rgba(201, 149, 108, 0.35)',
              }}
            >
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

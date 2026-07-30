import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Calendar, Users, Sparkles, UserCheck, ArrowRight, X } from 'lucide-react'
import { useAppointments } from '../../context/AppointmentContext'
import { useClients } from '../../context/ClientContext'
import { useMaster } from '../../hooks/useMaster'
import { SERVICES } from '../../data/services'
import { VENDOR_DEFAULTS } from '../../data/vendors'
import { formatCurrency } from '../../utils/formatCurrency'

export default function GlobalSearchModal({ open, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const { appointments = [] } = useAppointments() || {}
  const { clients = [] } = useClients() || {}
  const { items: services = [] } = useMaster('md_services', SERVICES) || {}
  const { items: vendors = [] } = useMaster('md_vendors', VENDOR_DEFAULTS) || {}

  // Auto-focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Keybindings (Esc to close)
  useEffect(() => {
    function handleKeyDown(e) {
      if (!open) return
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const q = query.trim().toLowerCase()

  // Filter items
  const matchedAppts = q
    ? appointments.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.phone?.includes(q) ||
        a.id?.toLowerCase().includes(q) ||
        a.service?.toLowerCase().includes(q)
      ).slice(0, 4)
    : []

  const matchedClients = q
    ? clients.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.phone?.includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.id?.toLowerCase().includes(q)
      ).slice(0, 4)
    : []

  const matchedServices = q
    ? services.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
      ).slice(0, 3)
    : []

  const matchedVendors = q
    ? vendors.filter(v =>
        v.name?.toLowerCase().includes(q) ||
        v.role?.toLowerCase().includes(q) ||
        v.category?.toLowerCase().includes(q)
      ).slice(0, 3)
    : []

  // Combine results flat list for keyboard arrow selection
  const allResults = [
    ...matchedAppts.map(item => ({ type: 'appt', item, path: '/dashboard/appointments' })),
    ...matchedClients.map(item => ({ type: 'client', item, path: '/dashboard/clients' })),
    ...matchedServices.map(item => ({ type: 'service', item, path: '/dashboard/masters/services' })),
    ...matchedVendors.map(item => ({ type: 'vendor', item, path: '/dashboard/masters/vendors' })),
  ]

  function handleSelect(res) {
    onClose()
    if (res.path) {
      navigate(res.path)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(15, 10, 18, 0.65)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: '80px', paddingLeft: '16px', paddingRight: '16px',
      }}
    >
      <div style={{
        width: '100%', maxWidth: '620px', background: 'var(--dash-card-bg)',
        borderRadius: '20px', border: '1.5px solid var(--dash-border)',
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35)', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Input Bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 20px', borderBottom: '1px solid var(--dash-border)',
          background: 'var(--dash-subtle-row-bg)',
        }}>
          <Search size={20} style={{ color: 'var(--icon-booking)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0) }}
            placeholder="Search appointments, clients, services, or artists..."
            style={{
              width: '100%', background: 'transparent', border: 'none',
              outline: 'none', fontSize: '15px', color: 'var(--dash-text-primary)',
              fontFamily: 'Inter, sans-serif', fontWeight: 500,
            }}
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              style={{
                border: 'none', background: 'transparent', cursor: 'pointer',
                color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center',
              }}
            >
              <X size={16} />
            </button>
          ) : (
            <span style={{
              fontSize: '11px', fontWeight: 700, padding: '3px 7px', borderRadius: '6px',
              border: '1px solid var(--dash-border)', color: 'var(--dash-text-muted)',
              background: 'var(--dash-card-bg)', letterSpacing: '0.04em',
            }}>
              ESC
            </span>
          )}
        </div>

        {/* Results Body */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px 16px' }}>

          {!query && (
            <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--dash-text-muted)' }}>
              <Sparkles size={32} style={{ color: 'var(--icon-booking)', margin: '0 auto 12px', opacity: 0.8 }} />
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                Global Spotlight Search
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: 'var(--dash-text-muted)' }}>
                Type client names, phone numbers, appointment IDs, or services to search.
              </p>
            </div>
          )}

          {query && allResults.length === 0 && (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--dash-text-muted)' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>
                No results found for "{query}"
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px' }}>
                Check for typos or try searching another keyword.
              </p>
            </div>
          )}

          {/* Appointments section */}
          {matchedAppts.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#a0622a', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} /> Appointments ({matchedAppts.length})
              </div>
              {matchedAppts.map(a => (
                <div
                  key={a.id}
                  onClick={() => handleSelect({ type: 'appt', item: a, path: '/dashboard/appointments' })}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                    transition: 'all 0.15s ease', marginBottom: '2px',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-subtle-row-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(201,149,108,0.15)', color: 'var(--icon-booking)' }}>
                      {a.id}
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>{a.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)' }}>{a.service} · {a.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dash-text-primary)' }}>{formatCurrency(a.amount)}</span>
                    <ArrowRight size={14} style={{ color: 'var(--dash-text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Clients section */}
          {matchedClients.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#a0622a', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={13} /> Clients Directory ({matchedClients.length})
              </div>
              {matchedClients.map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelect({ type: 'client', item: c, path: '/dashboard/clients' })}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                    transition: 'all 0.15s ease', marginBottom: '2px',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-subtle-row-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: '50%', background: c.color || 'var(--icon-booking)',
                      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: 700,
                    }}>
                      {c.initials || c.name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>{c.name}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)' }}>{c.phone} {c.email && `· ${c.email}`}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--dash-text-muted)' }} />
                </div>
              ))}
            </div>
          )}

          {/* Services section */}
          {matchedServices.length > 0 && (
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#a0622a', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={13} /> Service Packages ({matchedServices.length})
              </div>
              {matchedServices.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleSelect({ type: 'service', item: s, path: '/dashboard/masters/services' })}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                    transition: 'all 0.15s ease', marginBottom: '2px',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-subtle-row-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>{s.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)' }}>{s.category || 'Package'} · {s.duration || '2 hrs'}</div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--icon-booking)' }}>
                    {formatCurrency(s.price)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Vendors / Artists section */}
          {matchedVendors.length > 0 && (
            <div>
              <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#a0622a', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '6px 10px 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={13} /> Artists & Vendors ({matchedVendors.length})
              </div>
              {matchedVendors.map(v => (
                <div
                  key={v.id}
                  onClick={() => handleSelect({ type: 'vendor', item: v, path: '/dashboard/masters/vendors' })}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                    transition: 'all 0.15s ease', marginBottom: '2px',
                    background: 'transparent',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-subtle-row-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--dash-text-primary)' }}>{v.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--dash-text-muted)' }}>{v.role || v.category} · {v.contact || 'Phone'}</div>
                  </div>
                  <ArrowRight size={14} style={{ color: 'var(--dash-text-muted)' }} />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Shortcut Bar */}
        <div style={{
          padding: '10px 20px', borderTop: '1px solid var(--dash-border)',
          background: 'var(--dash-subtle-row-bg)', display: 'flex', alignItems: 'center',
          justify: 'space-between', fontSize: '11.5px', color: 'var(--dash-text-muted)',
        }}>
          <div>Quick Navigation Spotlight</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span><strong>Ctrl + K</strong> Open</span>
            <span><strong>ESC</strong> Dismiss</span>
          </div>
        </div>

      </div>
    </div>
  )
}

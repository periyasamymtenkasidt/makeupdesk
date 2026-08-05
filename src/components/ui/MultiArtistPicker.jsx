import { useState, useRef, useEffect } from 'react'
import { Check, X, Users, ChevronDown } from 'lucide-react'
import { checkArtistAvailability, isArtistAvailableAt } from '../../hooks/useArtists'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function MultiArtistPicker({
  selected = [],
  onChange,
  artists = [],
  date = '',
  time = '',
  appointments = [],
  currentApptId = null,
  disabled = false,
  durationMins = 120,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Group artists by category
  const categories = Array.from(new Set(artists.map(a => a.category || 'Other Artists')))

  function toggleArtist(artistName) {
    if (selected.includes(artistName)) {
      onChange(selected.filter(name => name !== artistName))
    } else {
      onChange([...selected, artistName])
    }
  }

  function removeArtist(artistName, e) {
    e.stopPropagation()
    onChange(selected.filter(name => name !== artistName))
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <label style={{
        display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--dash-label-text)',
        marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.07em',
      }}>
        Assign Team & Artists ({selected.length} Selected)
      </label>

      {/* Main Select Field Container */}
      <div
        onClick={() => { if (!disabled) setIsOpen(!isOpen) }}
        style={{
          minHeight: '44px', padding: '6px 12px', borderRadius: '12px',
          border: isOpen ? '1.5px solid var(--color-rose-gold)' : '1.5px solid var(--dash-border)',
          background: disabled ? 'var(--dash-subtle-row-bg)' : 'var(--dash-input-bg)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px',
          boxShadow: isOpen ? '0 0 12px rgba(201,149,108,0.25)' : 'none',
          transition: 'all 0.2s ease', flexWrap: 'wrap',
          opacity: disabled ? 0.55 : 1,
        }}
      >
        {disabled ? (
          <span style={{ fontSize: '13px', color: 'var(--dash-text-muted)', fontStyle: 'italic' }}>
            Select a service package first…
          </span>
        ) : selected.length === 0 ? (
          <span style={{ fontSize: '13px', color: 'var(--dash-text-muted)' }}>
            Click to assign artists & specialists…
          </span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
            {selected.map(artistName => {
              const artistObj = artists.find(a => a.name === artistName)
              const catLabel = artistObj?.category ? ` (${artistObj.category.split(' ')[0]})` : ''
              return (
                <span
                  key={artistName}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    padding: '4px 10px', borderRadius: '20px',
                    background: 'var(--icon-booking-bg)',
                    border: '1px solid var(--dash-border)',
                    fontSize: '12px', fontWeight: 600, color: 'var(--dash-text-primary)',
                  }}
                >
                  {artistName}{catLabel}
                  <button
                    type="button"
                    onClick={(e) => removeArtist(artistName, e)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--dash-text-muted)', borderRadius: '50%',
                    }}
                  >
                    <X size={13} />
                  </button>
                </span>
              )
            })}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
          <Users size={16} style={{ color: 'var(--dash-text-muted)' }} />
          <ChevronDown size={14} style={{ color: 'var(--dash-text-muted)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
        </div>
      </div>

      {/* Category-Grouped Dropdown Menu */}
      {isOpen && !disabled && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '6px',
          maxHeight: '260px', overflowY: 'auto', zIndex: 300,
          background: 'var(--dash-card-bg)', borderRadius: '14px',
          border: '1.5px solid var(--dash-border)',
          boxShadow: '0 12px 32px var(--dash-shadow)',
          padding: '8px 0',
        }}>
          {categories.map(cat => {
            const group = artists.filter(a => a.category === cat)
            if (group.length === 0) return null

            return (
              <div key={cat} style={{ marginBottom: '6px' }}>
                <div style={{
                  padding: '6px 14px', fontSize: '10.5px', fontWeight: 800,
                  color: 'var(--color-rose-gold)', textTransform: 'uppercase', letterSpacing: '0.08em',
                  background: 'var(--dash-subtle-row-bg)', borderBottom: '1px solid var(--dash-border-subtle)',
                }}>
                  {cat}s
                </div>

                {group.map(artist => {
                  const isSelected = selected.includes(artist.name)
                  const bookCheck = checkArtistAvailability(artist.name, date, time, appointments, currentApptId)

                  const worksToday = !date || (() => {
                    const dayName = DAY_NAMES[new Date(date + 'T00:00:00').getDay()]
                    return (artist.workDays || DAY_NAMES).includes(dayName)
                  })()
                  const inShift = !date || !time || isArtistAvailableAt(artist, date, time, durationMins)
                  const isUnavailable = bookCheck.isBooked || !worksToday || !inShift

                  let statusLabel, statusColor
                  if (bookCheck.isBooked) {
                    statusLabel = `⚠️ Booked (${bookCheck.bookedTime})`
                    statusColor = 'var(--badge-pending)'
                  } else if (!worksToday) {
                    statusLabel = '📅 Day off'
                    statusColor = 'var(--badge-rejected)'
                  } else if (!inShift) {
                    statusLabel = `⏰ Off-shift (${artist.shiftStart || '08:00'}–${artist.shiftEnd || '20:00'})`
                    statusColor = 'var(--badge-pending)'
                  } else {
                    statusLabel = '✓ Available'
                    statusColor = 'var(--badge-confirmed)'
                  }

                  return (
                    <div
                      key={artist.id}
                      onClick={() => !isUnavailable && toggleArtist(artist.name)}
                      style={{
                        padding: '9px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        fontSize: '12.5px', cursor: isUnavailable ? 'not-allowed' : 'pointer',
                        opacity: isUnavailable ? 0.45 : 1,
                        background: isSelected ? 'var(--select-hover-bg)' : 'transparent',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '4px',
                          border: isSelected ? '1.5px solid var(--color-rose-gold)' : '1.5px solid var(--dash-border)',
                          background: isSelected ? 'var(--color-rose-gold)' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                        </div>
                        <span style={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? 'var(--color-rose-gold)' : 'var(--dash-text-primary)' }}>
                          {artist.name}
                        </span>
                      </div>

                      <span style={{ fontSize: '11px', fontWeight: 600, color: statusColor }}>
                        {statusLabel}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

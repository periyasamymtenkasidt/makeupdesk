import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../ui/Badge'
import { MapPin, Clock, Pencil, Calendar, Trash2, XCircle, CheckCircle, MoreHorizontal } from 'lucide-react'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'
import { EmptyState } from '../ui/EmptyState'
import { Modal } from '../ui/Modal'

const BASE_HEADERS = ['Appt ID', 'Client', 'Mobile', 'Service', 'Location', 'Date & Time', 'Status', 'Amount']

const thStyle = {
  padding: '14px 20px', textAlign: 'left', fontSize: '10.5px',
  fontWeight: 700, color: 'var(--dash-label-text, #a0622a)', textTransform: 'uppercase',
  letterSpacing: '0.08em', whiteSpace: 'nowrap',
  position: 'sticky', top: 0, zIndex: 10,
  background: 'var(--dash-surface)',
  borderBottom: '1.5px solid var(--dash-border)',
}

const tdBase = { padding: '16px 20px', whiteSpace: 'nowrap' }

const iconBtn = (color = 'var(--icon-booking)', bg = 'var(--dash-surface)') => ({
  width: '30px', height: '30px', borderRadius: '8px',
  border: '1px solid var(--dash-border)', background: bg, color,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0,
})

function MenuItem({ icon, label, onClick, color = 'var(--dash-text-primary)', disabled = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '9px',
        padding: '9px 14px', background: hovered && !disabled ? 'var(--dash-row-hover)' : 'transparent',
        border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--dash-text-muted)' : color,
        fontSize: '13px', fontWeight: 500, textAlign: 'left',
        opacity: disabled ? 0.5 : 1, transition: 'background 0.12s',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

export default function AppointmentTable({ appointments, onEdit, onDelete, onReject, onMarkDone, renderRowActions }) {
  const navigate = useNavigate()
  const [apptToDelete, setApptToDelete] = useState(null)
  const [openMenuId,   setOpenMenuId]   = useState(null)
  const hasActions = onEdit || onDelete || onReject || renderRowActions
  const headers  = [...BASE_HEADERS, ...(hasActions ? [''] : [])]

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }} className="no-scrollbar">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: '13.5px' }}>

        <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <tr>
            {headers.map((h, i) => (
              <th key={i} style={{ ...thStyle, textAlign: h === 'Amount' ? 'right' : 'left' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {appointments.map((appt, i) => (
            <tr
              key={appt.id ?? i}
              style={{
                borderBottom: '1px solid var(--dash-border-subtle)',
                background: 'transparent',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--dash-row-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {/* Appt ID */}
              <td style={tdBase}>
                <span
                  onClick={() => navigate(`/dashboard/appointments/${appt.id}`)}
                  title="View appointment"
                  style={{
                    fontSize: '12px', fontWeight: 700,
                    fontFamily: '"Courier New", Courier, monospace',
                    color: 'var(--icon-booking)',
                    background: 'var(--icon-booking-bg)',
                    padding: '4px 9px', borderRadius: '6px',
                    border: '1px solid var(--dash-border-subtle)',
                    cursor: 'pointer', transition: 'opacity 0.15s', display: 'inline-block',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {appt.id}
                </span>
              </td>

              {/* Client */}
              <td style={tdBase}>
                <span
                  onClick={() => navigate(`/dashboard/appointments/${appt.id}`)}
                  title="View appointment"
                  style={{
                    fontWeight: 600, fontSize: '13.5px', color: 'var(--icon-booking)',
                    cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted',
                    textUnderlineOffset: '3px', transition: 'opacity 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {appt.name}
                </span>
              </td>

              {/* Mobile */}
              <td style={{ ...tdBase, fontSize: '13px', color: 'var(--dash-text-secondary)' }}>
                {appt.phone ? appt.phone.replace(/^\+\d{1,3}/, '') : '—'}
              </td>

              {/* Service */}
              <td style={{ ...tdBase, fontSize: '13.5px', fontWeight: 500, color: 'var(--dash-text-primary)' }}>
                {appt.service}
              </td>

              {/* Location */}
              <td style={tdBase}>
                {(() => {
                  const loc = appt.location || (appt.service?.includes('Bridal') ? 'Venue' : 'Studio')
                  return (
                    <span
                      title={loc}
                      style={{
                        fontSize: '12px', fontWeight: 600, padding: '4px 10px', borderRadius: '7px',
                        background: appt.location === 'Venue' ? 'var(--badge-venue-bg)' : 'var(--badge-studio-bg)',
                        color: appt.location === 'Venue' ? 'var(--badge-venue)' : 'var(--badge-studio)',
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        maxWidth: '160px', overflow: 'hidden',
                      }}>
                      <MapPin size={11} style={{ flexShrink: 0 }} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {loc}
                      </span>
                    </span>
                  )
                })()}
              </td>

              {/* Date & Time */}
              <td style={tdBase}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--dash-text-secondary)', marginBottom: '5px' }}>
                  <Calendar size={12} style={{ color: 'var(--dash-text-muted)', flexShrink: 0 }} />
                  {appt.date ? formatDate(appt.date) : '—'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--dash-text-primary)', fontWeight: 500 }}>
                  <Clock size={12} style={{ color: 'var(--icon-booking)', flexShrink: 0 }} />
                  {appt.time || '—'}
                  {appt.duration && (
                    <span style={{
                      fontSize: '11px', fontWeight: 600, color: 'var(--icon-booking)',
                      background: 'var(--icon-booking-bg)', padding: '2px 7px',
                      borderRadius: '9999px', border: '1px solid var(--dash-border-subtle)',
                    }}>
                      {appt.duration}
                    </span>
                  )}
                </div>
              </td>

              {/* Status — badge only, no dropdown */}
              <td style={tdBase}>
                <Badge status={appt.status} />
              </td>

              {/* Amount */}
              <td style={{ ...tdBase, fontWeight: 700, fontSize: '14px', color: 'var(--dash-text-primary)', textAlign: 'right' }}>
                {typeof appt.amount === 'number' ? formatCurrency(appt.amount) : appt.amount}
              </td>

              {hasActions && (
                <td style={{ ...tdBase, whiteSpace: 'nowrap' }}>
                  {renderRowActions ? renderRowActions(appt) : (
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === appt.id ? null : appt.id) }}
                        style={iconBtn()}
                        title="Actions"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {openMenuId === appt.id && (() => {
                        const canReject = appt.status !== 'Rejected' && appt.status !== 'Completed'
                        const canMarkDone = onMarkDone && ['Confirmed', 'In Progress'].includes(appt.status)

                        return (
                          <>
                            <div
                              style={{ position: 'fixed', inset: 0, zIndex: 99 }}
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div style={{
                              position: 'absolute', right: 0, top: '36px', zIndex: 100,
                              background: 'var(--dash-card-bg)',
                              border: '1px solid var(--dash-border)',
                              borderRadius: '10px',
                              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                              minWidth: '168px',
                              overflow: 'hidden',
                            }}>
                              {onEdit && (
                                <MenuItem
                                  icon={<Pencil size={13} />}
                                  label="Edit"
                                  onClick={() => { setOpenMenuId(null); onEdit(appt) }}
                                />
                              )}
                              {canMarkDone && (
                                <MenuItem
                                  icon={<CheckCircle size={13} />}
                                  label="Mark as Done"
                                  color="#16a34a"
                                  onClick={() => { setOpenMenuId(null); onMarkDone(appt) }}
                                />
                              )}
                              {onReject && canReject && (
                                <MenuItem
                                  icon={<XCircle size={13} />}
                                  label="Reject"
                                  color="var(--badge-pending)"
                                  onClick={() => { setOpenMenuId(null); onReject(appt) }}
                                />
                              )}
                              {onDelete && (
                                <>
                                  {(onEdit || canMarkDone || (onReject && canReject)) && (
                                    <div style={{ height: '1px', background: 'var(--dash-border)', margin: '4px 0' }} />
                                  )}
                                  <MenuItem
                                    icon={<Trash2 size={13} />}
                                    label="Delete"
                                    color="var(--badge-rejected)"
                                    onClick={() => { setOpenMenuId(null); setApptToDelete(appt) }}
                                  />
                                </>
                              )}
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {appointments.length === 0 && (
        <EmptyState
          icon={Calendar}
          title="No Appointments Found"
          subtitle="There are no appointments matching your current filters or date selection."
          style={{ border: 'none', background: 'transparent', padding: '48px 20px' }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!apptToDelete}
        onClose={() => setApptToDelete(null)}
        title="Confirm Deletion"
        width="440px"
        saveLabel="Delete Appointment"
        saveVariant="danger"
        onSave={() => {
          if (apptToDelete) {
            onDelete(apptToDelete.id)
            setApptToDelete(null)
          }
        }}
      >
        {apptToDelete && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'var(--badge-rejected-bg)', color: 'var(--badge-rejected)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                border: '1px solid rgba(239, 68, 68, 0.25)',
              }}>
                <Trash2 size={20} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--dash-text-primary)' }}>
                  Delete Appointment?
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--dash-text-muted)', marginTop: '2px' }}>
                  This action cannot be undone.
                </div>
              </div>
            </div>

            {/* Appointment Details Box */}
            <div style={{
              background: 'var(--dash-surface)',
              border: '1px solid var(--dash-border)',
              borderRadius: '12px',
              padding: '14px 16px',
              fontSize: '13px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--icon-booking)', background: 'var(--icon-booking-bg)', padding: '2px 8px', borderRadius: '6px', fontFamily: 'monospace' }}>
                  {apptToDelete.id}
                </span>
                <span style={{ fontWeight: 700, color: 'var(--dash-text-primary)' }}>
                  {typeof apptToDelete.amount === 'number' ? formatCurrency(apptToDelete.amount) : apptToDelete.amount}
                </span>
              </div>

              <div style={{ fontWeight: 600, color: 'var(--dash-text-primary)', fontSize: '14px' }}>
                {apptToDelete.name}
                {apptToDelete.phone && (
                  <span style={{ fontWeight: 400, color: 'var(--dash-text-muted)', fontSize: '12.5px', marginLeft: '6px' }}>
                    ({apptToDelete.phone})
                  </span>
                )}
              </div>

              <div style={{ color: 'var(--dash-text-secondary)', fontSize: '12.5px' }}>
                {apptToDelete.service}
              </div>

              <div style={{ fontSize: '12px', color: 'var(--dash-text-muted)', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '2px' }}>
                <span>📅 {apptToDelete.date ? formatDate(apptToDelete.date) : '—'}</span>
                <span>⏰ {apptToDelete.time || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { checkTimeAvailability } from '../../utils/slots'

// ── constants ─────────────────────────────────────────────────────────────────

const ITEM_H  = 52
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
const AMPM    = ['AM', 'PM']
const DARK_BG = '#1a0f1b'

// ── helpers ───────────────────────────────────────────────────────────────────

function nearestMinute(mm) {
  return MINUTES.reduce((prev, cur) =>
    Math.abs(Number(cur) - mm) < Math.abs(Number(prev) - mm) ? cur : prev
  )
}

function parse24(v) {
  if (!v) return { h: '09', m: '00', ap: 'AM' }
  const [hh, mm] = v.split(':').map(Number)
  const ap  = hh >= 12 ? 'PM' : 'AM'
  const h12 = hh === 0 ? 12 : hh > 12 ? hh - 12 : hh
  return { h: String(h12).padStart(2, '0'), m: nearestMinute(mm), ap }
}

function to24(h, m, ap) {
  let h24 = Number(h)
  if (ap === 'AM' && h24 === 12) h24 = 0
  if (ap === 'PM' && h24 !== 12) h24 += 12
  return `${String(h24).padStart(2, '0')}:${m}`
}

// ── drum column ───────────────────────────────────────────────────────────────

function DrumColumn({ items, value, onChange, narrow = false, theme = 'dark' }) {
  const scrollRef  = useRef(null)
  const timerRef   = useRef(null)
  const valueRef   = useRef(value)
  valueRef.current = value

  const n         = items.length
  const virtItems = [...items, ...items, ...items]
  const idx       = items.indexOf(value)
  const isDark    = theme === 'dark'
  const colW      = narrow ? 64 : 76
  const viewH     = ITEM_H * 3

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el || idx < 0) return
    el.scrollTop = (n + idx) * ITEM_H
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el || idx < 0) return
    const target = (n + idx) * ITEM_H
    if (Math.abs(el.scrollTop - target) > ITEM_H * 0.5) {
      el.scrollTop = target
    }
  }, [idx, n])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const mid = n * ITEM_H
    if (el.scrollTop < mid) { el.scrollTop += mid; return }
    if (el.scrollTop >= 2 * mid) { el.scrollTop -= mid; return }
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const el2 = scrollRef.current
      if (!el2) return
      const nearest = Math.round(el2.scrollTop / ITEM_H) % n
      el2.scrollTo({ top: (n + nearest) * ITEM_H, behavior: 'smooth' })
      if (items[nearest] !== valueRef.current) onChange(items[nearest])
    }, 80)
  }, [items, n, onChange])

  return (
    <div style={{ position: 'relative', width: colW, height: viewH, flexShrink: 0, overflow: 'hidden' }}>

      {/* Selection highlight ring */}
      <div style={{
        position: 'absolute', top: ITEM_H, left: 4, right: 4, height: ITEM_H,
        borderRadius: 12,
        background: 'rgba(201,149,108,0.13)',
        border: '1.5px solid rgba(201,149,108,0.4)',
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Gradient fades — dark theme uses BG-colored overlays */}
      {isDark ? (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H,
            background: `linear-gradient(to bottom, ${DARK_BG} 0%, rgba(26,15,27,0.55) 55%, transparent 100%)`,
            pointerEvents: 'none', zIndex: 2,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H,
            background: `linear-gradient(to top, ${DARK_BG} 0%, rgba(26,15,27,0.55) 55%, transparent 100%)`,
            pointerEvents: 'none', zIndex: 2,
          }} />
        </>
      ) : (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H,
            background: 'linear-gradient(to bottom, var(--dash-input-bg) 0%, transparent 100%)',
            pointerEvents: 'none', zIndex: 2,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H,
            background: 'linear-gradient(to top, var(--dash-input-bg) 0%, transparent 100%)',
            pointerEvents: 'none', zIndex: 2,
          }} />
        </>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scrollbar"
        style={{ height: viewH, overflowY: 'scroll', overflowX: 'hidden' }}
      >
        <div style={{ height: ITEM_H, flexShrink: 0 }} />

        {virtItems.map((item, j) => {
          const selected = item === value
          return (
            <div
              key={j}
              onClick={() => {
                const i      = j % n
                const target = (n + i) * ITEM_H
                scrollRef.current?.scrollTo({ top: target, behavior: 'smooth' })
                onChange(items[i])
              }}
              style={{
                height: ITEM_H,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize:   item.length > 2 ? 14 : 22,
                fontWeight: 700,
                fontFamily: 'Playfair Display, serif',
                color: selected
                  ? isDark ? 'rgba(255,255,255,0.95)' : 'var(--dash-text-primary)'
                  : isDark ? 'rgba(255,255,255,0.28)'  : 'var(--dash-text-muted)',
                transform:  selected ? 'scale(1.1)' : 'scale(0.85)',
                transition: 'color 0.15s, transform 0.15s',
                cursor:     'pointer',
                userSelect: 'none',
              }}
            >
              {item}
            </div>
          )
        })}

        <div style={{ height: ITEM_H, flexShrink: 0 }} />
      </div>
    </div>
  )
}

// ── main export ───────────────────────────────────────────────────────────────

const DAY_NAMES_DRUM = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getShiftWarning(artistObjs, dateStr, timeHHMM, durationMins) {
  if (!artistObjs || artistObjs.length === 0 || !dateStr) return null
  const dayName = DAY_NAMES_DRUM[new Date(dateStr + 'T00:00:00').getDay()]
  const offToday = artistObjs.filter(a => !(a.workDays || DAY_NAMES_DRUM).includes(dayName))
  if (offToday.length > 0) {
    const names = offToday.map(a => a.name).join(', ')
    return `${names} ${offToday.length === 1 ? 'doesn\'t' : 'don\'t'} work today`
  }
  if (!timeHHMM) return null
  const [hh, mm] = timeHHMM.split(':').map(Number)
  const slotStart = hh * 60 + mm
  const slotEnd = slotStart + durationMins
  const offShift = artistObjs.filter(a => {
    const [ssh, ssm] = (a.shiftStart || '05:00').split(':').map(Number)
    const [seh, sem] = (a.shiftEnd   || '21:00').split(':').map(Number)
    return slotStart < ssh * 60 + ssm || slotEnd > seh * 60 + sem
  })
  if (offShift.length === 0) return null
  const names = offShift.map(a => a.name).join(', ')
  return `${names} ${offShift.length === 1 ? 'is' : 'are'} off-shift at this time`
}

export function DrumRollTimePicker({
  value,
  onChange,
  date,
  appointments = [],
  durationMins  = 120,
  vendorId      = null,
  theme         = 'dark',
  artistObjs    = [],
}) {
  const [state, setState] = useState(() => parse24(value))
  const skipEmit          = useRef(true)
  const isDark            = theme === 'dark'

  useEffect(() => {
    if (skipEmit.current) { skipEmit.current = false; return }
    onChange(to24(state.h, state.m, state.ap))
  }, [state.h, state.m, state.ap]) // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const parsed = parse24(value)
    setState(s => {
      if (s.h === parsed.h && s.m === parsed.m && s.ap === parsed.ap) return s
      return parsed
    })
  }, [value])

  const currentVal = to24(state.h, state.m, state.ap)
  const avail = date
    ? checkTimeAvailability(currentVal, durationMins, date, appointments, null, vendorId)
    : { available: null }
  const shiftWarning = getShiftWarning(artistObjs, date, currentVal, durationMins)

  const colonColor = isDark ? 'rgba(255,255,255,0.5)' : 'var(--dash-text-muted)'

  return (
    <div>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--dash-label-text)',
        marginBottom: 10,
      }}>
        Start Time
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
        ...(isDark ? {} : {
          background: 'var(--dash-input-bg)',
          border: '1.5px solid var(--dash-border)',
          borderRadius: 12,
          padding: '2px 10px',
        }),
      }}>
        <DrumColumn items={HOURS}   value={state.h}  onChange={h  => setState(s => ({ ...s, h }))}  theme={theme} />

        <span style={{
          fontSize: 22, fontWeight: 700, fontFamily: 'Playfair Display, serif',
          color: colonColor, lineHeight: 1, flexShrink: 0,
        }}>:</span>

        <DrumColumn items={MINUTES} value={state.m}  onChange={m  => setState(s => ({ ...s, m }))}  theme={theme} />

        <div style={{ width: 4, flexShrink: 0 }} />

        <DrumColumn items={AMPM}    value={state.ap} onChange={ap => setState(s => ({ ...s, ap }))} narrow theme={theme} />
      </div>

      {date && avail.available !== null && (
        <div style={{
          marginTop: 12, padding: '8px 14px', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 12, fontWeight: 600,
          background: avail.available
            ? isDark ? 'rgba(5,150,105,0.13)' : 'var(--badge-confirmed-bg)'
            : isDark ? 'rgba(220,38,38,0.13)'  : 'var(--badge-rejected-bg)',
          color: avail.available
            ? isDark ? '#34d399' : 'var(--badge-confirmed)'
            : isDark ? '#f87171' : 'var(--badge-rejected)',
          border: `1px solid ${avail.available
            ? isDark ? 'rgba(52,211,153,0.25)' : 'rgba(5,150,105,0.2)'
            : isDark ? 'rgba(248,113,113,0.25)' : 'rgba(220,38,38,0.2)'}`,
        }}>
          {avail.available
            ? '✓ This time slot looks available'
            : "✗ Artist may be unavailable — we'll confirm after review"}
        </div>
      )}
      {shiftWarning && (
        <div style={{
          marginTop: 8, padding: '7px 14px', borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontSize: 12, fontWeight: 600,
          background: isDark ? 'rgba(245,158,11,0.13)' : 'var(--badge-pending-bg)',
          color: isDark ? '#fbbf24' : 'var(--badge-pending)',
          border: `1px solid ${isDark ? 'rgba(251,191,36,0.25)' : 'rgba(245,158,11,0.2)'}`,
        }}>
          ⏰ {shiftWarning}
        </div>
      )}
    </div>
  )
}

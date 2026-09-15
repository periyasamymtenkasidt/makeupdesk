import { useState, useRef, useLayoutEffect, useCallback } from 'react'

const ITEM_H  = 34
const HOURS   = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55']
const AMPM    = ['AM', 'PM']

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

function fmt12h(hhmm) {
  if (!hhmm) return ''
  const [h, m] = hhmm.split(':').map(Number)
  const ap = h >= 12 ? 'PM' : 'AM'
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`
}

function DrumCol({ items, value, onChange, narrow = false }) {
  const scrollRef  = useRef(null)
  const timerRef   = useRef(null)
  const valueRef   = useRef(value)
  valueRef.current = value

  const n         = items.length
  const virtItems = [...items, ...items, ...items]
  const idx       = items.indexOf(value)
  const colW      = narrow ? 44 : 54
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
    if (Math.abs(el.scrollTop - target) > ITEM_H * 0.5) el.scrollTop = target
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
      {/* selection ring */}
      <div style={{
        position: 'absolute', top: ITEM_H, left: 4, right: 4, height: ITEM_H,
        borderRadius: 10, background: 'rgba(201,149,108,0.1)',
        border: '1.5px solid rgba(201,149,108,0.4)', pointerEvents: 'none', zIndex: 1,
      }} />
      {/* top fade */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_H,
        background: 'linear-gradient(to bottom, var(--dash-card-bg) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      {/* bottom fade */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_H,
        background: 'linear-gradient(to top, var(--dash-card-bg) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />

      <div ref={scrollRef} onScroll={handleScroll} className="no-scrollbar"
        style={{ height: viewH, overflowY: 'scroll', overflowX: 'hidden' }}>
        <div style={{ height: ITEM_H }} />
        {virtItems.map((item, j) => {
          const selected = item === value
          return (
            <div
              key={j}
              onClick={() => {
                const i = j % n
                scrollRef.current?.scrollTo({ top: (n + i) * ITEM_H, behavior: 'smooth' })
                onChange(items[i])
              }}
              style={{
                height: ITEM_H, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: item.length > 2 ? 11 : 16, fontWeight: 700,
                fontFamily: 'Playfair Display, serif',
                color: selected ? 'var(--dash-text-primary)' : 'var(--dash-text-muted)',
                transform: selected ? 'scale(1.1)' : 'scale(0.82)',
                transition: 'color 0.15s, transform 0.15s',
                cursor: 'pointer', userSelect: 'none',
              }}
            >
              {item}
            </div>
          )
        })}
        <div style={{ height: ITEM_H }} />
      </div>
    </div>
  )
}

export function TimePickerPopup({ value, onChange, onClose, label = 'Select Time' }) {
  const [state, setState] = useState(() => parse24(value))

  function commit() {
    onChange(to24(state.h, state.m, state.ap))
    onClose()
  }

  return (
    <div style={{
      background: 'var(--dash-card-bg)', borderRadius: '16px',
      boxShadow: '0 14px 44px rgba(0,0,0,0.22)', border: '1px solid var(--dash-border)',
      fontFamily: 'Inter, sans-serif', overflow: 'hidden', width: '210px',
    }}>
      {/* Header */}
      <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--dash-border)' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--dash-text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          {label}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Playfair Display, serif', color: 'var(--dash-text-primary)', marginTop: '2px' }}>
          {fmt12h(to24(state.h, state.m, state.ap))}
        </div>
      </div>

      {/* Drum rolls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', padding: '6px 12px' }}>
        <DrumCol items={HOURS}   value={state.h}  onChange={h  => setState(s => ({ ...s, h }))} />
        <span style={{ fontSize: 16, fontWeight: 700, fontFamily: 'Playfair Display, serif', color: 'var(--dash-text-muted)', flexShrink: 0 }}>:</span>
        <DrumCol items={MINUTES} value={state.m}  onChange={m  => setState(s => ({ ...s, m }))} />
        <div style={{ width: 4 }} />
        <DrumCol items={AMPM}    value={state.ap} onChange={ap => setState(s => ({ ...s, ap }))} narrow />
      </div>

      {/* Done button */}
      <div style={{ padding: '0 12px 12px' }}>
        <button
          onClick={commit}
          style={{
            width: '100%', padding: '8px', borderRadius: '9px', border: 'none',
            background: 'linear-gradient(135deg, #c9956c 0%, #d4728f 100%)',
            color: '#fff', fontSize: '12px', fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Inter, sans-serif',
          }}
        >
          Done
        </button>
      </div>
    </div>
  )
}

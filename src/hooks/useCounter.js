import { useState, useEffect, useRef } from 'react'

export function useCounter(end, { duration = 1800, decimal = false, triggered = false } = {}) {
  const [val, setVal] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!triggered || started.current) return
    started.current = true
    const steps = 60
    const ms = duration / steps
    let step = 0
    const timer = setInterval(() => {
      step++
      const eased = 1 - Math.pow(1 - step / steps, 3)
      setVal(decimal ? parseFloat((end * eased).toFixed(1)) : Math.round(end * eased))
      if (step >= steps) clearInterval(timer)
    }, ms)
    return () => clearInterval(timer)
  }, [triggered, end, decimal, duration])

  return val
}

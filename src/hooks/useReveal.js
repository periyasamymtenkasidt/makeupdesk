import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.15) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const targets = el.querySelectorAll
      ? [el, ...el.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')]
      : [el]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold }
    )

    targets.forEach(t => observer.observe(t))
    return () => observer.disconnect()
  }, [threshold])

  return ref
}

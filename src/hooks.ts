import { useEffect, useRef, useState } from 'react'

/** true, если пользователь попросил систему уменьшить анимации */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Добавляет класс is-visible, когда элемент появляется во вьюпорте (один раз). */
export function useReveal<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('is-visible')
            io.disconnect()
          }
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

/** Таймер, который очищается при размонтировании. */
export function useTimeouts() {
  const ids = useRef<number[]>([])
  useEffect(() => () => ids.current.forEach((id) => window.clearTimeout(id)), [])
  return (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms)
    ids.current.push(id)
    return id
  }
}

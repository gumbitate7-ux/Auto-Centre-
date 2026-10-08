/**
 * One passive scroll/resize listener for the whole page, throttled to
 * animation frames. Components subscribe instead of adding their own
 * listeners, which keeps scroll-linked effects cheap.
 */
type Subscriber = (scrollY: number, viewportHeight: number) => void

const subscribers = new Set<Subscriber>()
let scheduled = false

function flush() {
  scheduled = false
  const y = window.scrollY
  const vh = window.innerHeight
  subscribers.forEach((fn) => fn(y, vh))
}

function schedule() {
  if (!scheduled) {
    scheduled = true
    requestAnimationFrame(flush)
  }
}

export function subscribeScroll(fn: Subscriber) {
  subscribers.add(fn)
  if (subscribers.size === 1) {
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
  }
  fn(window.scrollY, window.innerHeight)
  return () => {
    subscribers.delete(fn)
    if (subscribers.size === 0) {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

/** Smoothly scrolls to a section by id, respecting reduced motion. */
export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

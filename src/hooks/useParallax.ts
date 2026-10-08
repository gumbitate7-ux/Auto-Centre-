import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion, subscribeScroll } from '../lib/scroll'

/**
 * Writes a `--parallax` (px) custom property on `ref` based on how far the
 * element's centre is from the viewport centre. CSS decides what to do with
 * it (usually a translate on an inner image), keeping the effect on the
 * compositor. `speed` of 0.1 moves 10% of the offset. The shift is capped
 * at `overscan` x element height, matching how far the inner image
 * extends beyond its frame, so an edge is never exposed.
 */
export function useParallax<T extends HTMLElement>(ref: RefObject<T | null>, speed = 0.12, overscan = 0.075) {
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    let top = 0
    let height = 0
    let visible = false

    const measure = () => {
      const rect = el.getBoundingClientRect()
      top = rect.top + window.scrollY
      height = rect.height
    }
    measure()

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
      },
      { rootMargin: '20% 0px' },
    )
    io.observe(el)

    const ro = new ResizeObserver(measure)
    ro.observe(document.body)

    const unsubscribe = subscribeScroll((y, vh) => {
      if (!visible) return
      const offset = top + height / 2 - (y + vh / 2)
      const max = height * overscan
      const shift = Math.max(-max, Math.min(max, -offset * speed))
      el.style.setProperty('--parallax', `${shift.toFixed(1)}px`)
    })

    return () => {
      unsubscribe()
      io.disconnect()
      ro.disconnect()
    }
  }, [ref, speed, overscan])
}

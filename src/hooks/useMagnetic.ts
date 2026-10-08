import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from '../lib/scroll'

/**
 * Subtle magnetic pull toward the pointer for primary CTAs.
 * Only on fine pointers; capped so it never feels gimmicky.
 */
export function useMagnetic<T extends HTMLElement>(ref: RefObject<T | null>, enabled = true, strength = 0.22, max = 7) {
  useEffect(() => {
    const el = ref.current
    if (!enabled || !el || prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = Math.max(-max, Math.min(max, dx * strength))
        const y = Math.max(-max, Math.min(max, dy * strength))
        el.style.setProperty('--mx', `${x.toFixed(2)}px`)
        el.style.setProperty('--my', `${y.toFixed(2)}px`)
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--mx', '0px')
      el.style.setProperty('--my', '0px')
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [ref, enabled, strength, max])
}

import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/scroll'

/** Animates a number towards `target` (ease-out), e.g. for running totals. */
export function useCountUp(target: number, duration = 520) {
  const [value, setValue] = useState(target)
  const from = useRef(target)

  useEffect(() => {
    if (prefersReducedMotion() || from.current === target) {
      from.current = target
      setValue(target)
      return
    }
    const start = performance.now()
    const begin = from.current
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const next = begin + (target - begin) * eased
      setValue(next)
      from.current = next
      if (t < 1) raf = requestAnimationFrame(tick)
      else from.current = target
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

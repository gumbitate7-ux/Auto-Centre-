import { useCallback, useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { prefersReducedMotion } from '../../lib/scroll'
import { Icon } from './Icon'
import { Picture } from './Picture'
import './CompareSlider.css'

interface CompareSliderProps {
  before: string
  after: string
  altBefore: string
  altAfter: string
  sizes?: string
  /** Play one gentle sweep the first time the slider scrolls into view. */
  demo?: boolean
  className?: string
  label?: string
}

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function CompareSlider({
  before,
  after,
  altBefore,
  altAfter,
  sizes = '(min-width: 1360px) 1360px, 100vw',
  demo = true,
  className = '',
  label = 'Before and after comparison',
}: CompareSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const handleRef = useRef<HTMLDivElement>(null)
  const position = useRef(50)
  const dragging = useRef(false)
  const interacted = useRef(false)
  const frame = useRef(0)

  const apply = useCallback((value: number) => {
    const v = Math.min(100, Math.max(0, value))
    position.current = v
    const root = rootRef.current
    const handle = handleRef.current
    if (root) {
      root.style.setProperty('--pos', `${v}%`)
      root.style.setProperty('--pos-n', v.toFixed(2))
    }
    if (handle) {
      const rounded = Math.round(v)
      handle.setAttribute('aria-valuenow', String(rounded))
      handle.setAttribute('aria-valuetext', `${rounded}% before, ${100 - rounded}% after`)
    }
  }, [])

  const fromPointer = useCallback(
    (clientX: number) => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (!rect) return
      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => apply(((clientX - rect.left) / rect.width) * 100))
    },
    [apply],
  )

  // Reset when the images change (switching comparisons).
  useEffect(() => {
    apply(50)
  }, [before, after, apply])

  // One-time demo sweep to signal the interaction.
  useEffect(() => {
    const root = rootRef.current
    if (!demo || !root || prefersReducedMotion()) return
    let raf = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || interacted.current) return
        io.disconnect()
        const keys = [50, 30, 68, 50]
        const segment = 650
        const start = performance.now() + 250
        const tick = (now: number) => {
          if (interacted.current) return
          const t = Math.max(0, now - start)
          const i = Math.min(keys.length - 2, Math.floor(t / segment))
          const local = Math.min(1, (t - i * segment) / segment)
          apply(keys[i] + (keys[i + 1] - keys[i]) * easeInOut(local))
          if (t < segment * (keys.length - 1)) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(root)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [demo, apply, before])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    interacted.current = true
    dragging.current = true
    rootRef.current?.classList.add('is-dragging')
    event.currentTarget.setPointerCapture(event.pointerId)
    fromPointer(event.clientX)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(event.clientX)
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    dragging.current = false
    rootRef.current?.classList.remove('is-dragging')
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2
    const map: Record<string, number> = {
      ArrowLeft: position.current - step,
      ArrowDown: position.current - step,
      ArrowRight: position.current + step,
      ArrowUp: position.current + step,
      PageDown: position.current - 10,
      PageUp: position.current + 10,
      Home: 0,
      End: 100,
    }
    if (event.key in map) {
      event.preventDefault()
      interacted.current = true
      rootRef.current?.classList.add('is-keyboard')
      apply(map[event.key])
    }
  }

  return (
    <div
      ref={rootRef}
      className={`compare ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <Picture name={after} alt={altAfter} sizes={sizes} className="compare__layer compare__after" draggable={false} />
      <div className="compare__before-clip">
        <Picture
          name={before}
          alt={altBefore}
          sizes={sizes}
          className="compare__layer compare__before"
          draggable={false}
        />
      </div>

      <span className="compare__tag compare__tag--before" aria-hidden="true">
        Before
      </span>
      <span className="compare__tag compare__tag--after" aria-hidden="true">
        After
      </span>

      <div
        ref={handleRef}
        className="compare__handle"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        <span className="compare__line" aria-hidden="true" />
        <span className="compare__grip" aria-hidden="true">
          <Icon name="chevron-left" size={16} strokeWidth={2} />
          <Icon name="chevron-right" size={16} strokeWidth={2} />
        </span>
      </div>
    </div>
  )
}

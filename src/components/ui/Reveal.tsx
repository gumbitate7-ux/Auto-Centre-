import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

let observer: IntersectionObserver | null = null

function getObserver() {
  if (observer || typeof window === 'undefined') return observer
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in')
          observer?.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  )
  return observer
}

interface RevealProps {
  as?: ElementType
  delay?: number
  fade?: boolean
  className?: string
  style?: CSSProperties
  children: ReactNode
  [key: string]: unknown
}

/** Fades/slides content in once, when it first scrolls into view. */
export function Reveal({
  as: Tag = 'div',
  delay = 0,
  fade = false,
  className = '',
  style,
  children,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    const io = getObserver()
    if (!el) return
    if (!io) {
      el.classList.add('is-in')
      return
    }
    io.observe(el)
    return () => io.unobserve(el)
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal${fade ? ' reveal--fade' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  )
}

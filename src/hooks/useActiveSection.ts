import { useEffect, useState } from 'react'

/**
 * Scrollspy. `map` links DOM section ids to the navigation item they
 * belong to (e.g. the gallery highlights "Our Work").
 */
export function useActiveSection(map: Record<string, string>) {
  const [active, setActive] = useState<string>('home')

  useEffect(() => {
    const elements = Object.keys(map)
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!elements.length) return

    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio)
          else visible.delete(entry.target.id)
        })
        // Prefer the section nearest the top of the reading area.
        let best: string | null = null
        let bestTop = Infinity
        visible.forEach((_, id) => {
          const top = Math.abs(document.getElementById(id)!.getBoundingClientRect().top)
          if (top < bestTop) {
            bestTop = top
            best = id
          }
        })
        if (best) setActive(map[best])
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.01] },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [map])

  return active
}

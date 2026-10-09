import { useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { panelInfo, type PanelId, type ViewId } from '../../data/damage'
import { diagramViews } from './vehicleDiagram'

interface VehicleDiagramProps {
  view: ViewId
  viewLabel: string
  /** Marked panels, in list order (used for marker numbers). */
  selected: PanelId[]
  active: PanelId | null
  highlight: PanelId | null
  onSelect: (panel: PanelId) => void
  onHover: (panel: PanelId | null) => void
}

const UNDER = new Set(['shadow', 'tyre'])
const ARROW_STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
const PAD = 14
const GRID = 18

const overlaps = (a: DOMRect, b: DOMRect) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

/**
 * A point well inside the visible part of a panel for its number marker. The bounding-box
 * centre can fall outside concave shapes (a wing wrapping a wheel arch) or under parts drawn
 * on top (a tail light on a quarter panel), so sample a grid and take the visible point
 * furthest from any hidden or outside point.
 */
function markerPoint(path: SVGPathElement, above: SVGPathElement[]): [number, number] {
  const b = path.getBBox()
  const covers = above.filter((p) => overlaps(b, p.getBBox()))
  const centre: [number, number] = [b.x + b.width / 2, b.y + b.height / 2]
  const sx = b.width / GRID
  const sy = b.height / GRID
  const inside: [number, number][] = []
  const outside: [number, number][] = []
  // One extra ring of samples outside the box so the panel edge counts as outside.
  for (let i = -1; i <= GRID + 1; i++) {
    for (let j = -1; j <= GRID + 1; j++) {
      const x = b.x + i * sx
      const y = b.y + j * sy
      const pt = new DOMPoint(x, y)
      const isIn =
        i >= 0 && i <= GRID && j >= 0 && j <= GRID && path.isPointInFill(pt) && !covers.some((c) => c.isPointInFill(pt))
      ;(isIn ? inside : outside).push([x, y])
    }
  }
  let best = centre
  let bestScore = -1
  for (const [x, y] of inside) {
    let nearest = Infinity
    for (const [ox, oy] of outside) nearest = Math.min(nearest, (x - ox) ** 2 + (y - oy) ** 2)
    // Prefer roomier points, then points nearer the middle.
    const score = Math.sqrt(nearest) - Math.hypot(x - centre[0], y - centre[1]) * 0.05
    if (score > bestScore) {
      bestScore = score
      best = [x, y]
    }
  }
  return best
}

export function VehicleDiagram({
  view,
  viewLabel,
  selected,
  active,
  highlight,
  onSelect,
  onHover,
}: VehicleDiagramProps) {
  const data = diagramViews[view]
  const uid = useId().replace(/:/g, '')
  const contentRef = useRef<SVGGElement>(null)
  const [viewBox, setViewBox] = useState('0 0 800 400')
  const [centres, setCentres] = useState<Partial<Record<PanelId, [number, number]>>>({})
  const [focused, setFocused] = useState<PanelId | null>(null)

  // Crop to the drawing so every view fills the stage, and find panel centres for markers.
  useLayoutEffect(() => {
    const g = contentRef.current
    if (!g) return
    const box = g.getBBox()
    setViewBox(`${box.x - PAD} ${box.y - PAD} ${box.width + PAD * 2} ${box.height + PAD * 2}`)
    const next: Partial<Record<PanelId, [number, number]>> = {}
    const paths = [...g.querySelectorAll<SVGPathElement>('path[data-panel]')]
    paths.forEach((p, i) => {
      next[p.dataset.panel as PanelId] = markerPoint(p, paths.slice(i + 1))
    })
    setCentres(next)
  }, [view])

  // Panels are one Tab stop; arrow keys move across the car in reading order (paint order stays as drawn).
  const order = useMemo(
    () =>
      data.panels
        .map((p) => p.id)
        .sort((a, b) => {
          const ca = centres[a]
          const cb = centres[b]
          return ca && cb ? ca[0] - cb[0] || ca[1] - cb[1] : 0
        }),
    [data, centres],
  )
  const inView = (id: PanelId | null): id is PanelId => !!id && data.panels.some((p) => p.id === id)
  const tabStop = inView(focused) ? focused : inView(active) ? active : order[0]

  const onKey = (event: KeyboardEvent<SVGPathElement>, panel: PanelId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(panel)
      return
    }
    const step = ARROW_STEP[event.key]
    if (!step && event.key !== 'Home' && event.key !== 'End') return
    event.preventDefault()
    const i = order.indexOf(panel)
    const next =
      event.key === 'Home'
        ? order[0]
        : event.key === 'End'
          ? order[order.length - 1]
          : order[(i + step + order.length) % order.length]
    contentRef.current?.querySelector<SVGPathElement>(`path[data-panel="${next}"]`)?.focus()
  }

  const visibleSelected = selected.filter((id) => data.panels.some((p) => p.id === id))

  return (
    <svg
      className="vd"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label={`${viewLabel} view of the vehicle. Select a panel to mark damage; use the arrow keys to move between panels.`}
      onMouseLeave={() => onHover(null)}
    >
      <defs>
        <pattern id={`hatch-${uid}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" className="vd__hatch-line" />
        </pattern>
      </defs>
      <g ref={contentRef}>
        <g aria-hidden="true">
          {data.details
            .filter((d) => UNDER.has(d.kind))
            .map((d, i) => (
              <path key={i} d={d.d} className={`vd__detail vd__detail--${d.kind}`} />
            ))}
        </g>
        <g>
          {data.panels.map((p) => {
            const info = panelInfo[p.id]
            const isSelected = selected.includes(p.id)
            const index = selected.indexOf(p.id)
            return (
              <g key={p.id}>
                <path
                  d={p.d}
                  data-panel={p.id}
                  className={`vd__panel${isSelected ? ' is-selected' : ''}${active === p.id ? ' is-active' : ''}${
                    highlight === p.id ? ' is-highlight' : ''
                  }`}
                  role="button"
                  tabIndex={p.id === tabStop ? 0 : -1}
                  aria-label={`${info.label}${info.side ? `, ${info.side.toLowerCase()}` : ''}${
                    isSelected ? `, marked as damage ${index + 1}, select to edit` : ''
                  }`}
                  onClick={() => onSelect(p.id)}
                  onKeyDown={(e) => onKey(e, p.id)}
                  onMouseEnter={() => onHover(p.id)}
                  onFocus={() => {
                    setFocused(p.id)
                    onHover(p.id)
                  }}
                  onBlur={() => onHover(null)}
                />
                {/* Hatch sits directly on its own panel so parts drawn later (lights, mirrors) stay clean. */}
                {isSelected && <path d={p.d} fill={`url(#hatch-${uid})`} className="vd__hatch" aria-hidden="true" />}
              </g>
            )
          })}
        </g>
        <g aria-hidden="true" className="vd__overlay">
          {data.details
            .filter((d) => !UNDER.has(d.kind))
            .map((d, i) => (
              <path key={i} d={d.d} className={`vd__detail vd__detail--${d.kind}`} />
            ))}
        </g>
      </g>
      <g aria-hidden="true" className="vd__markers">
        {visibleSelected.map((id) => {
          const c = centres[id]
          if (!c) return null
          const n = selected.indexOf(id) + 1
          return (
            <g
              key={id}
              className={`vd__marker${active === id ? ' is-active' : ''}`}
              transform={`translate(${c[0]} ${c[1]})`}
            >
              <circle r="13" />
              <text dy="0.36em" textAnchor="middle">
                {n}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}

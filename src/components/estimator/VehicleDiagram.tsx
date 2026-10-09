import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
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
const PAD = 14

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

  // Crop to the drawing so every view fills the stage, and find panel centres for markers.
  useLayoutEffect(() => {
    const g = contentRef.current
    if (!g) return
    const box = g.getBBox()
    setViewBox(`${box.x - PAD} ${box.y - PAD} ${box.width + PAD * 2} ${box.height + PAD * 2}`)
    const next: Partial<Record<PanelId, [number, number]>> = {}
    g.querySelectorAll<SVGPathElement>('path[data-panel]').forEach((p) => {
      const b = p.getBBox()
      next[p.dataset.panel as PanelId] = [b.x + b.width / 2, b.y + b.height / 2]
    })
    setCentres(next)
  }, [view])

  const onKey = (event: KeyboardEvent<SVGPathElement>, panel: PanelId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(panel)
    }
  }

  const visibleSelected = selected.filter((id) => data.panels.some((p) => p.id === id))

  return (
    <svg
      className="vd"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label={`${viewLabel} view of the vehicle. Select a panel to mark damage.`}
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
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`${info.label}${info.side ? `, ${info.side.toLowerCase()}` : ''}${
                    isSelected ? `, marked as damage ${index + 1}` : ''
                  }`}
                  onClick={() => onSelect(p.id)}
                  onKeyDown={(e) => onKey(e, p.id)}
                  onMouseEnter={() => onHover(p.id)}
                  onFocus={() => onHover(p.id)}
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

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  damageSizes,
  damageTypes,
  defaultTypeFor,
  estimate,
  formatRand,
  paintFinishes,
  panelInfo,
  pricing,
  serviceFor,
  typesFor,
  vehicleTypes,
  views,
  type DamageItem,
  type DamageSize,
  type DamageType,
  type PaintFinish,
  type PanelId,
  type VehicleType,
  type ViewId,
} from '../../data/damage'
import { useCountUp } from '../../hooks/useCountUp'
import { goToSection } from '../../lib/scroll'
import { useQuote } from '../quote/QuoteContext'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { VehicleDiagram } from './VehicleDiagram'
import { diagramViews } from './vehicleDiagram'
import './DamageEstimator.css'

const viewsWith = (panel: PanelId) =>
  views.filter((v) => diagramViews[v.id].panels.some((p) => p.id === panel)).map((v) => v.id)

/** Panels grouped for the accessible "choose from a list" control. */
const listGroups: { label: string; ids: PanelId[] }[] = [
  { label: 'Front', ids: ['front-bumper', 'bonnet', 'windscreen', 'headlight-l', 'headlight-r'] },
  {
    label: 'Left side (passenger)',
    ids: ['wing-fl', 'door-fl', 'door-rl', 'quarter-rl', 'sill-l', 'mirror-l', 'wheel-fl', 'wheel-rl'],
  },
  {
    label: 'Right side (driver)',
    ids: ['wing-fr', 'door-fr', 'door-rr', 'quarter-rr', 'sill-r', 'mirror-r', 'wheel-fr', 'wheel-rr'],
  },
  { label: 'Rear', ids: ['rear-bumper', 'boot', 'rear-window', 'taillight-l', 'taillight-r'] },
  { label: 'Top', ids: ['roof'] },
]

function Choice<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  compact = false,
}: {
  name: string
  legend: string
  options: { value: T; label: string; hint?: string }[]
  value: T
  onChange: (value: T) => void
  compact?: boolean
}) {
  return (
    <fieldset className={`dmg-choice${compact ? ' dmg-choice--compact' : ''}`}>
      <legend className="dmg-choice__legend">{legend}</legend>
      <div className="dmg-choice__options">
        {options.map((o) => (
          <label key={o.value} className="dmg-choice__option">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span className="dmg-choice__box">
              <span className="dmg-choice__label">{o.label}</span>
              {o.hint && <span className="dmg-choice__hint">{o.hint}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function DamageEstimator() {
  const { damage, attachDamage, detachDamage, presetService } = useQuote()
  const [items, setItems] = useState<DamageItem[]>([])
  const [active, setActive] = useState<PanelId | null>(null)
  const [view, setView] = useState<ViewId>('left')
  const [hover, setHover] = useState<PanelId | null>(null)
  const [vehicle, setVehicle] = useState<VehicleType>('compact')
  const [paint, setPaint] = useState<PaintFinish>('solid')
  const [pick, setPick] = useState<PanelId | ''>('')
  const listRef = useRef<HTMLDivElement>(null)
  const listHeadRef = useRef<HTMLHeadingElement>(null)

  const result = useMemo(() => estimate(items, vehicle, paint), [items, vehicle, paint])
  const low = useCountUp(result.low)
  const high = useCountUp(result.high)
  const attached = damage !== null

  // Once attached, the quote form always carries the live map. Clearing every item detaches it;
  // a map removed from the form stays removed until it is requested again.
  useEffect(() => {
    if (!attached) return
    if (!items.length) detachDamage()
    else attachDamage({ items, vehicle, paint, estimate: pricing.showPrices ? result : null })
    // `result` changes exactly when items, vehicle or paint change.
  }, [result])

  const selected = items.map((i) => i.panel)
  const currentView = views.find((v) => v.id === view)!

  const select = (panel: PanelId) => {
    if (!selected.includes(panel)) {
      setItems((prev) => [...prev, { panel, type: defaultTypeFor(panel), size: 'medium' }])
    }
    setActive(panel)
  }

  const update = (panel: PanelId, patch: Partial<DamageItem>) => {
    setItems((prev) => prev.map((i) => (i.panel === panel ? { ...i, ...patch } : i)))
  }

  // Buttons that remove themselves would drop focus to <body>; hand it to the nearest sensible control.
  const focusItem = (panel: PanelId | undefined) =>
    requestAnimationFrame(() => {
      const toggle = panel && listRef.current?.querySelector<HTMLElement>(`.dmg-item__toggle[data-panel="${panel}"]`)
      ;(toggle || listHeadRef.current)?.focus()
    })

  const remove = (panel: PanelId) => {
    const index = selected.indexOf(panel)
    setItems((prev) => prev.filter((i) => i.panel !== panel))
    if (active === panel) setActive(null)
    focusItem(selected[index + 1] ?? selected[index - 1])
  }

  const clear = () => {
    setItems([])
    setActive(null)
    focusItem(undefined)
  }

  const addPick = () => {
    if (!pick) return
    const inViews = viewsWith(pick)
    if (!inViews.includes(view)) setView(inViews[0])
    select(pick)
    setPick('')
  }

  const request = () => {
    if (!items.length) return
    // Already attached: the form is in sync, so don't override a repair type the customer picked.
    if (!attached) {
      attachDamage({ items, vehicle, paint, estimate: pricing.showPrices ? result : null })
      presetService(serviceFor(items))
    }
    window.setTimeout(() => goToSection('quote', '.quote-step__title'), 30)
  }

  const countIn = (v: ViewId) => selected.filter((id) => diagramViews[v].panels.some((p) => p.id === id)).length
  const hoverInfo = hover ? panelInfo[hover] : null
  const priced = result.lines.filter((l) => l.range).length

  return (
    <section id="estimate" className="section estimator" aria-labelledby="estimate-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow section-head__eyebrow">Instant Estimate</p>
            </Reveal>
            <Reveal as="h2" id="estimate-title" className="h2 section-head__title" delay={60}>
              Show Us Where the Damage Is.
            </Reveal>
          </div>
          <Reveal className="section-head__aside" delay={140}>
            <p className="body-copy">
              Tap the damaged areas on the vehicle, tell us what happened and how big it is, and get an indicative price
              range in seconds. Send it to us for a formal quote.
            </p>
          </Reveal>
        </div>

        <div className="estimator__grid">
          <Reveal className="estimator__stage-wrap">
            <div className="estimator__tabs" role="group" aria-label="Vehicle view">
              {views.map((v) => {
                const n = countIn(v.id)
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={view === v.id}
                    className={`estimator__tab${view === v.id ? ' is-active' : ''}`}
                    onClick={() => setView(v.id)}
                  >
                    {v.short ? (
                      <>
                        <span className="estimator__tab-long">{v.label}</span>
                        <span className="estimator__tab-short">{v.short}</span>
                      </>
                    ) : (
                      v.label
                    )}
                    {n > 0 && (
                      <span className="estimator__tab-count tabular" aria-label={`${n} marked`}>
                        {n}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="estimator__stage">
              <div key={view} className="estimator__diagram">
                <VehicleDiagram
                  view={view}
                  viewLabel={currentView.label}
                  selected={selected}
                  active={active}
                  highlight={hover}
                  onSelect={select}
                  onHover={setHover}
                />
              </div>
              <div className="estimator__stage-foot">
                <p className="estimator__hover" aria-hidden="true">
                  {hoverInfo ? (
                    <>
                      <strong>{hoverInfo.label}</strong>
                      {hoverInfo.side && <span> · {hoverInfo.side}</span>}
                    </>
                  ) : (
                    <span>{currentView.hint}</span>
                  )}
                </p>
                <div className="estimator__list-pick">
                  <label htmlFor="estimate-pick" className="visually-hidden">
                    Damaged area
                  </label>
                  <div className="estimator__list-select">
                    <select id="estimate-pick" value={pick} onChange={(e) => setPick(e.target.value as PanelId | '')}>
                      <option value="" disabled>
                        Or choose an area from a list…
                      </option>
                      {listGroups.map((g) => (
                        <optgroup key={g.label} label={g.label}>
                          {g.ids.map((id) => (
                            <option key={id} value={id}>
                              {panelInfo[id].label}
                              {selected.includes(id) ? ' (marked)' : ''}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    <Icon name="chevron-right" size={16} className="estimator__list-chevron" />
                  </div>
                  <button type="button" className="estimator__list-add" onClick={addPick} disabled={!pick}>
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="estimator__panel" delay={100}>
            <div className="estimator__vehicle">
              <Choice
                name="est-vehicle"
                legend="Vehicle"
                compact
                value={vehicle}
                onChange={setVehicle}
                options={(Object.keys(vehicleTypes) as VehicleType[]).map((k) => ({
                  value: k,
                  label: vehicleTypes[k],
                }))}
              />
              <Choice
                name="est-paint"
                legend="Paint"
                compact
                value={paint}
                onChange={setPaint}
                options={(Object.keys(paintFinishes) as PaintFinish[]).map((k) => ({
                  value: k,
                  label: paintFinishes[k],
                }))}
              />
            </div>

            <div className="estimator__items" ref={listRef}>
              <div className="estimator__items-head">
                <h3 className="estimator__subhead" ref={listHeadRef} tabIndex={-1}>
                  Marked damage{items.length > 0 && <span className="tabular"> · {items.length}</span>}
                </h3>
                {items.length > 0 && (
                  <button type="button" className="estimator__clear" onClick={clear}>
                    Clear all
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="estimator__empty">
                  <span className="estimator__empty-icon" aria-hidden="true">
                    <Icon name="plus" size={18} />
                  </span>
                  <p>
                    <strong>Tap a panel on the vehicle</strong> to mark where it&rsquo;s damaged. Switch views to reach
                    the front, rear and roof.
                  </p>
                </div>
              ) : (
                <ol className="estimator__list">
                  {result.lines.map((line, i) => {
                    const info = panelInfo[line.panel]
                    const isActive = active === line.panel
                    const allowed = typesFor[info.cls]
                    return (
                      <li key={line.panel} className={`dmg-item${isActive ? ' is-active' : ''}`}>
                        <div className="dmg-item__head">
                          <button
                            type="button"
                            className="dmg-item__toggle"
                            data-panel={line.panel}
                            aria-expanded={isActive}
                            aria-controls={`dmg-${line.panel}`}
                            onClick={() => setActive(isActive ? null : line.panel)}
                            onMouseEnter={() => setHover(line.panel)}
                            onMouseLeave={() => setHover(null)}
                          >
                            <span className="dmg-item__num tabular" aria-hidden="true">
                              {i + 1}
                            </span>
                            <span className="dmg-item__title">
                              <span className="dmg-item__label">{info.label}</span>
                              <span className="dmg-item__meta">
                                {damageTypes[line.type].label} · {damageSizes[line.size].label}
                              </span>
                            </span>
                            {pricing.showPrices && (
                              <span className="dmg-item__price tabular">
                                {line.range
                                  ? `${formatRand(line.range[0])} – ${formatRand(line.range[1])}`
                                  : 'On inspection'}
                              </span>
                            )}
                          </button>
                          <button
                            type="button"
                            className="dmg-item__remove"
                            onClick={() => remove(line.panel)}
                            aria-label={`Remove ${info.label}`}
                          >
                            <Icon name="close" size={15} />
                          </button>
                        </div>
                        {isActive && (
                          <div id={`dmg-${line.panel}`} className="dmg-item__body">
                            <Choice
                              name={`type-${line.panel}`}
                              legend="What happened?"
                              value={line.type}
                              onChange={(t: DamageType) => update(line.panel, { type: t })}
                              options={allowed.map((t) => ({ value: t, label: damageTypes[t].label }))}
                            />
                            <Choice
                              name={`size-${line.panel}`}
                              legend="How big is it?"
                              value={line.size}
                              onChange={(s: DamageSize) => update(line.panel, { size: s })}
                              options={(Object.keys(damageSizes) as DamageSize[]).map((s) => ({
                                value: s,
                                label: damageSizes[s].label,
                                hint: damageSizes[s].hint,
                              }))}
                            />
                            <button
                              type="button"
                              className="dmg-item__done"
                              onClick={() => {
                                setActive(null)
                                focusItem(line.panel)
                              }}
                            >
                              Done
                            </button>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ol>
              )}
            </div>

            <div className={`estimator__total on-dark${items.length ? ' has-items' : ''}`}>
              {pricing.showPrices ? (
                <>
                  <p className="estimator__subhead">Indicative estimate</p>
                  <p className="estimator__amount tabular" aria-hidden="true">
                    {priced > 0 ? (
                      <>
                        {formatRand(Math.round(low / 10) * 10)}
                        <span className="estimator__dash"> – </span>
                        {formatRand(Math.round(high / 10) * 10)}
                      </>
                    ) : items.length > 0 ? (
                      'On inspection'
                    ) : (
                      <span className="estimator__amount-empty">{formatRand(0)}</span>
                    )}
                  </p>
                  <p className="visually-hidden" aria-live="polite">
                    {priced > 0
                      ? `Indicative estimate ${formatRand(result.low)} to ${formatRand(result.high)}`
                      : items.length
                        ? 'Marked items are priced on inspection'
                        : ''}
                  </p>
                  {result.onInspection > 0 && priced > 0 && (
                    <p className="estimator__poi">
                      + {result.onInspection} item{result.onInspection > 1 ? 's' : ''} priced on inspection
                    </p>
                  )}
                </>
              ) : (
                <p className="estimator__subhead">Your damage map is ready to send</p>
              )}
              {attached && (
                <p className="estimator__synced">
                  <Icon name="check" size={15} />
                  Attached to your quote request. Changes here update it.
                </p>
              )}
              <Button block size="lg" icon="arrow-right" onClick={request} disabled={!items.length} magnetic>
                {attached ? 'Continue your quote request' : 'Request a formal quote'}
              </Button>
              <p className="estimator__disclaimer">
                {pricing.showPrices
                  ? 'Demo rates for this concept. An indicative range only: your final quote is confirmed after an in-person assessment.'
                  : 'We’ll confirm your quote after an in-person assessment.'}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

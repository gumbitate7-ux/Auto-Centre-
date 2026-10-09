import type { ServiceId } from './services'

/**
 * Damage estimator data: panels, damage types and indicative pricing.
 *
 * PLACEHOLDER PRICING: every rand amount below is a demo figure for the
 * concept site. Dino's must replace these with their own rates (or set
 * `pricing.showPrices` to false to collect damage maps without showing
 * prices) before the estimator goes live.
 */

export type PanelId =
  | 'front-bumper'
  | 'bonnet'
  | 'windscreen'
  | 'roof'
  | 'rear-window'
  | 'boot'
  | 'rear-bumper'
  | 'headlight-l'
  | 'headlight-r'
  | 'taillight-l'
  | 'taillight-r'
  | 'wing-fl'
  | 'door-fl'
  | 'door-rl'
  | 'quarter-rl'
  | 'sill-l'
  | 'mirror-l'
  | 'wheel-fl'
  | 'wheel-rl'
  | 'wing-fr'
  | 'door-fr'
  | 'door-rr'
  | 'quarter-rr'
  | 'sill-r'
  | 'mirror-r'
  | 'wheel-fr'
  | 'wheel-rr'

export type PanelClass = 'bumper' | 'large' | 'side' | 'sill' | 'mirror' | 'glass' | 'light' | 'wheel'
export type DamageType = 'scratch' | 'dent' | 'major' | 'paint' | 'chip'
export type DamageSize = 'small' | 'medium' | 'large'
export type VehicleType = 'compact' | 'suv' | 'luxury'
export type PaintFinish = 'solid' | 'metallic'
export type ViewId = 'left' | 'right' | 'front' | 'rear' | 'top'

interface PanelInfo {
  label: string
  /** South Africa is right-hand drive: the driver sits on the right. */
  side?: 'Passenger side' | 'Driver side'
  cls: PanelClass
}

const L = 'Passenger side' as const
const R = 'Driver side' as const

export const panelInfo: Record<PanelId, PanelInfo> = {
  'front-bumper': { label: 'Front bumper', cls: 'bumper' },
  bonnet: { label: 'Bonnet', cls: 'large' },
  windscreen: { label: 'Windscreen', cls: 'glass' },
  roof: { label: 'Roof', cls: 'large' },
  'rear-window': { label: 'Rear window', cls: 'glass' },
  boot: { label: 'Boot / tailgate', cls: 'large' },
  'rear-bumper': { label: 'Rear bumper', cls: 'bumper' },
  'headlight-l': { label: 'Left headlight', side: L, cls: 'light' },
  'headlight-r': { label: 'Right headlight', side: R, cls: 'light' },
  'taillight-l': { label: 'Left tail light', side: L, cls: 'light' },
  'taillight-r': { label: 'Right tail light', side: R, cls: 'light' },
  'wing-fl': { label: 'Left front wing', side: L, cls: 'side' },
  'door-fl': { label: 'Left front door', side: L, cls: 'side' },
  'door-rl': { label: 'Left rear door', side: L, cls: 'side' },
  'quarter-rl': { label: 'Left rear quarter panel', side: L, cls: 'side' },
  'sill-l': { label: 'Left sill', side: L, cls: 'sill' },
  'mirror-l': { label: 'Left mirror', side: L, cls: 'mirror' },
  'wheel-fl': { label: 'Left front wheel', side: L, cls: 'wheel' },
  'wheel-rl': { label: 'Left rear wheel', side: L, cls: 'wheel' },
  'wing-fr': { label: 'Right front wing', side: R, cls: 'side' },
  'door-fr': { label: 'Right front door', side: R, cls: 'side' },
  'door-rr': { label: 'Right rear door', side: R, cls: 'side' },
  'quarter-rr': { label: 'Right rear quarter panel', side: R, cls: 'side' },
  'sill-r': { label: 'Right sill', side: R, cls: 'sill' },
  'mirror-r': { label: 'Right mirror', side: R, cls: 'mirror' },
  'wheel-fr': { label: 'Right front wheel', side: R, cls: 'wheel' },
  'wheel-rr': { label: 'Right rear wheel', side: R, cls: 'wheel' },
}

export const views: { id: ViewId; label: string; short?: string; hint: string }[] = [
  { id: 'left', label: 'Left side', short: 'Left', hint: 'Passenger side · front of vehicle on the left' },
  { id: 'right', label: 'Right side', short: 'Right', hint: 'Driver side · front of vehicle on the right' },
  { id: 'front', label: 'Front', hint: 'Looking at the front of the vehicle' },
  { id: 'rear', label: 'Rear', hint: 'Looking at the back of the vehicle' },
  { id: 'top', label: 'Top', hint: 'From above · front of vehicle on the left' },
]

export const damageTypes: Record<DamageType, { label: string; hint: string }> = {
  scratch: { label: 'Scratch / scuff', hint: 'Marks in the paint or plastic' },
  dent: { label: 'Dent', hint: 'Pushed-in panel, paint may be intact' },
  major: { label: 'Crumpled / cracked', hint: 'Torn, creased, cracked or broken' },
  paint: { label: 'Paint fade / peel', hint: 'Oxidised, faded or peeling paint' },
  chip: { label: 'Stone chips', hint: 'Small chips from road debris' },
}

export const damageSizes: Record<DamageSize, { label: string; hint: string }> = {
  small: { label: 'Small', hint: 'Smaller than your palm' },
  medium: { label: 'Medium', hint: 'Up to an A4 page' },
  large: { label: 'Large', hint: 'Bigger than A4 or most of the panel' },
}

export const vehicleTypes: Record<VehicleType, string> = {
  compact: 'Hatch / sedan',
  suv: 'SUV / bakkie',
  luxury: 'Luxury / performance',
}

export const paintFinishes: Record<PaintFinish, string> = {
  solid: 'Solid colour',
  metallic: 'Metallic / pearl',
}

/** Which damage types make sense for each kind of part. */
export const typesFor: Record<PanelClass, DamageType[]> = {
  bumper: ['scratch', 'dent', 'major', 'paint'],
  large: ['scratch', 'dent', 'major', 'paint', 'chip'],
  side: ['scratch', 'dent', 'major', 'paint', 'chip'],
  sill: ['scratch', 'dent', 'major', 'paint', 'chip'],
  mirror: ['scratch', 'major'],
  light: ['scratch', 'major'],
  wheel: ['scratch', 'major'],
  glass: ['chip', 'major'],
}

type Range = [number, number]

export const pricing = {
  /** PLACEHOLDER: set to false to hide prices and only collect the damage map. */
  showPrices: true,
  currency: 'ZAR',
  /** PLACEHOLDER: indicative ranges (rand) for a medium-sized area on a hatch/sedan in solid paint. `null` = priced on inspection. */
  base: {
    bumper: { scratch: [1800, 3200], dent: [2200, 3800], major: [3500, 7500], paint: [2400, 3800] },
    large: { scratch: [2200, 3800], dent: [2400, 4800], major: [4500, 9500], paint: [3200, 5200], chip: [1500, 2800] },
    side: { scratch: [2000, 3500], dent: [2200, 4500], major: [4000, 8500], paint: [2800, 4600], chip: [1300, 2400] },
    sill: { scratch: [1400, 2600], dent: [1800, 3600], major: [3000, 6500], paint: [1800, 3200], chip: [1000, 1900] },
    mirror: { scratch: [700, 1400], major: [1500, 4500] },
    light: { scratch: [450, 950], major: [1500, 6500] },
    wheel: { scratch: [650, 1400], major: null },
    glass: { chip: null, major: null },
  } as Record<PanelClass, Partial<Record<DamageType, Range | null>>>,
  /** PLACEHOLDER multipliers. */
  size: { small: 0.65, medium: 1, large: 1.45 } as Record<DamageSize, number>,
  vehicle: { compact: 1, suv: 1.18, luxury: 1.35 } as Record<VehicleType, number>,
  /** Applied to paintwork only (not lights, glass or wheels). */
  metallic: 1.12,
  roundTo: 100,
}

export interface DamageItem {
  panel: PanelId
  type: DamageType
  size: DamageSize
}

export interface EstimateLine extends DamageItem {
  range: Range | null
}

export interface Estimate {
  lines: EstimateLine[]
  low: number
  high: number
  onInspection: number
}

const PAINTWORK: PanelClass[] = ['bumper', 'large', 'side', 'sill', 'mirror']

export function defaultTypeFor(panel: PanelId): DamageType {
  const cls = panelInfo[panel].cls
  return cls === 'glass' ? 'chip' : 'scratch'
}

export function estimate(items: DamageItem[], vehicle: VehicleType, paint: PaintFinish): Estimate {
  const round = (n: number, dir: 'down' | 'up') =>
    (dir === 'down' ? Math.floor : Math.ceil)(n / pricing.roundTo) * pricing.roundTo
  let low = 0
  let high = 0
  let onInspection = 0
  const lines = items.map((item) => {
    const cls = panelInfo[item.panel].cls
    const base = pricing.base[cls][item.type]
    if (!base) {
      onInspection++
      return { ...item, range: null }
    }
    const factor =
      pricing.size[item.size] *
      pricing.vehicle[vehicle] *
      (paint === 'metallic' && PAINTWORK.includes(cls) ? pricing.metallic : 1)
    const range: Range = [round(base[0] * factor, 'down'), round(base[1] * factor, 'up')]
    low += range[0]
    high += range[1]
    return { ...item, range }
  })
  return { lines, low, high, onInspection }
}

/** Best-matching service for the quote form, based on what was marked. */
export function serviceFor(items: DamageItem[]): ServiceId | 'unsure' {
  const notBody: PanelClass[] = ['glass', 'light', 'wheel']
  const body = items.filter((i) => !notBody.includes(panelInfo[i.panel].cls))
  const isMajor = (i: DamageItem) => i.type === 'major' && !['glass', 'wheel'].includes(panelInfo[i.panel].cls)
  if (items.some(isMajor)) return 'accident'
  // Glass, lights or wheels only: let the team decide after seeing it.
  if (!body.length) return 'unsure'
  if (body.every((i) => panelInfo[i.panel].cls === 'bumper')) return 'bumper'
  if (body.every((i) => i.type === 'dent')) return 'dent'
  if (body.every((i) => ['scratch', 'paint', 'chip'].includes(i.type))) return 'spray'
  return 'panel'
}

export const formatRand = (value: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(value)

/** The indicative range as text, noting items that can only be priced on inspection. */
export function formatEstimate(estimate: Estimate | null) {
  if (!estimate) return null
  const { low, high, onInspection } = estimate
  if (high === 0) return onInspection ? 'On inspection' : null
  return `${formatRand(low)} – ${formatRand(high)}${onInspection ? ` + ${onInspection} on inspection` : ''}`
}

export const describeItem = (item: DamageItem) =>
  `${panelInfo[item.panel].label}: ${damageTypes[item.type].label.toLowerCase()}, ${damageSizes[item.size].label.toLowerCase()}`

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { DamageItem, Estimate, PaintFinish, VehicleType } from '../../data/damage'
import type { RepairType } from './quoteModel'

/** A damage map handed over from the estimator to the quote form. */
export interface DamageReport {
  items: DamageItem[]
  vehicle: VehicleType
  paint: PaintFinish
  /** Null when prices are switched off. */
  estimate: Estimate | null
}

interface QuoteContextValue {
  /** Repair type pre-selected by a service card, project or the estimator, if any. */
  preset: { service: RepairType; nonce: number } | null
  presetService: (service: RepairType) => void
  damage: DamageReport | null
  attachDamage: (report: DamageReport) => void
  detachDamage: () => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<QuoteContextValue['preset']>(null)
  const [damage, setDamage] = useState<DamageReport | null>(null)
  const presetService = useCallback((service: RepairType) => {
    setPreset({ service, nonce: Date.now() })
  }, [])
  const attachDamage = useCallback((report: DamageReport) => setDamage(report), [])
  const detachDamage = useCallback(() => setDamage(null), [])
  const value = useMemo(
    () => ({ preset, presetService, damage, attachDamage, detachDamage }),
    [preset, presetService, damage, attachDamage, detachDamage],
  )
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used inside <QuoteProvider>')
  return ctx
}

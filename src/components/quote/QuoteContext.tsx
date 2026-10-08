import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ServiceId } from '../../data/services'

interface QuoteContextValue {
  /** Repair type pre-selected by a service card or project, if any. */
  preset: { service: ServiceId; nonce: number } | null
  presetService: (service: ServiceId) => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<QuoteContextValue['preset']>(null)
  const presetService = useCallback((service: ServiceId) => {
    setPreset({ service, nonce: Date.now() })
  }, [])
  const value = useMemo(() => ({ preset, presetService }), [preset, presetService])
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used inside <QuoteProvider>')
  return ctx
}

import { business } from '../data/business'
import { repairLabel, type QuoteValues } from '../components/quote/quoteModel'

const endpoint = import.meta.env.VITE_QUOTE_ENDPOINT

/** True when no endpoint is configured: the form simulates a submission. */
export const isDemoMode = !endpoint

const makeReference = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = ''
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  bytes.forEach((b) => (ref += alphabet[b % alphabet.length]))
  return `DQ-${ref}`
}

/**
 * Sends a quote request. With VITE_QUOTE_ENDPOINT set, posts
 * multipart/form-data (including photos) to that URL. Otherwise waits
 * briefly and resolves, so the demo flow can be shown end to end.
 * Add `?simulate-error` to the URL to preview the error state.
 */
export async function submitQuote(values: QuoteValues): Promise<{ reference: string }> {
  const reference = makeReference()

  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 1400))
    if (new URLSearchParams(window.location.search).has('simulate-error')) {
      throw new Error('Simulated network error')
    }
    return { reference }
  }

  const data = new FormData()
  data.append('reference', reference)
  data.append('business', business.name)
  data.append('name', values.name.trim())
  data.append('phone', values.phone.trim())
  data.append('email', values.email.trim())
  data.append('contactMethod', values.contactMethod)
  data.append('vehicleMake', values.make.trim())
  data.append('vehicleModel', values.model.trim())
  data.append('vehicleYear', values.year.trim())
  data.append('repairType', repairLabel(values.repairType))
  data.append('message', values.message.trim())
  values.photos.forEach((file) => data.append('photos', file, file.name))

  const response = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
  if (!response.ok) throw new Error(`Quote request failed with status ${response.status}`)
  return { reference }
}

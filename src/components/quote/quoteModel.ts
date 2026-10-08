import { services, type ServiceId } from '../../data/services'

export type RepairType = ServiceId | 'unsure'
export type ContactMethod = 'call' | 'whatsapp' | 'email'

export interface QuoteValues {
  name: string
  phone: string
  email: string
  contactMethod: ContactMethod
  make: string
  model: string
  year: string
  repairType: RepairType | ''
  message: string
  photos: File[]
  consent: boolean
}

export type QuoteErrors = Partial<Record<keyof QuoteValues, string>>

export const initialValues: QuoteValues = {
  name: '',
  phone: '',
  email: '',
  contactMethod: 'call',
  make: '',
  model: '',
  year: '',
  repairType: '',
  message: '',
  photos: [],
  consent: false,
}

export const repairOptions: { value: RepairType; label: string }[] = [
  ...services.map((s) => ({ value: s.id as RepairType, label: s.title })),
  { value: 'unsure', label: 'Not sure yet' },
]

export const repairLabel = (value: QuoteValues['repairType']) =>
  repairOptions.find((o) => o.value === value)?.label ?? ''

export const steps = [
  { id: 'details', title: 'Your Details', fields: ['name', 'phone', 'email'] },
  { id: 'vehicle', title: 'Vehicle', fields: ['make', 'model', 'year'] },
  { id: 'damage', title: 'Damage', fields: ['repairType', 'message', 'photos'] },
  { id: 'submit', title: 'Submit', fields: ['consent'] },
] as const satisfies readonly { id: string; title: string; fields: readonly (keyof QuoteValues)[] }[]

export const MAX_PHOTOS = 6
export const MAX_PHOTO_MB = 10
export const MESSAGE_MAX = 1000

const normalisePhone = (value: string) => value.replace(/[\s\-().]/g, '')

export function validateField(field: keyof QuoteValues, values: QuoteValues): string | undefined {
  const v = values[field]
  switch (field) {
    case 'name':
      return (v as string).trim().length < 2 ? 'Please enter your name.' : undefined
    case 'phone': {
      const phone = normalisePhone(v as string)
      if (!phone) return 'Please enter a phone number so we can reach you.'
      // South African numbers (0XX XXX XXXX / +27 XX XXX XXXX) or other international numbers.
      if (!/^(\+27|0)\d{9}$/.test(phone) && !/^\+\d{10,15}$/.test(phone)) {
        return 'Please enter a valid phone number, e.g. 082 123 4567.'
      }
      return undefined
    }
    case 'email': {
      const email = (v as string).trim()
      if (values.contactMethod === 'email' && !email) return 'Please add an email address, or choose another contact method.'
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return 'Please enter a valid email address.'
      return undefined
    }
    case 'make':
      return (v as string).trim() ? undefined : 'Please enter the vehicle make.'
    case 'model':
      return (v as string).trim() ? undefined : 'Please enter the vehicle model.'
    case 'year': {
      const year = (v as string).trim()
      if (!year) return undefined
      const n = Number(year)
      const max = new Date().getFullYear() + 1
      return /^\d{4}$/.test(year) && n >= 1950 && n <= max ? undefined : `Please enter a year between 1950 and ${max}.`
    }
    case 'repairType':
      return v ? undefined : 'Please choose the type of repair (or “Not sure yet”).'
    case 'message':
      return (v as string).length > MESSAGE_MAX ? `Please keep the description under ${MESSAGE_MAX} characters.` : undefined
    case 'consent':
      return v ? undefined : 'Please confirm that we may contact you about this quote.'
    default:
      return undefined
  }
}

export function validateStep(stepIndex: number, values: QuoteValues): QuoteErrors {
  const errors: QuoteErrors = {}
  steps[stepIndex].fields.forEach((field) => {
    const error = validateField(field, values)
    if (error) errors[field] = error
  })
  return errors
}

/**
 * Single source of truth for business details.
 *
 * Every value marked PLACEHOLDER must be replaced with Dino's real details
 * before the site goes live. These values also feed the page <title>, meta
 * tags and LocalBusiness structured data at build time (see vite.config.ts).
 */

export interface BusinessHours {
  days: string
  time: string
  /** schema.org openingHours fragment, e.g. "Mo-Fr 07:30-17:00" */
  schema?: string
}

export const business = {
  name: "Dino's Auto Body Repairs",
  wordmark: "DINO'S",
  descriptor: 'Auto Body Repairs',
  summary:
    'Professional auto body repairs, panel beating, spray painting and accident repairs, carried out with care and finished to a high standard.',

  /** Set to false once every PLACEHOLDER below has been replaced. */
  usesPlaceholderDetails: true,

  // PLACEHOLDER: replace with the real number.
  phone: {
    display: '000 000 0000',
    href: 'tel:+27000000000',
    international: '+27 00 000 0000',
  },

  // PLACEHOLDER: replace with the real WhatsApp number (international format, no +).
  whatsapp: {
    display: '000 000 0000',
    number: '27000000000',
    greeting: "Hi Dino's, I'd like a quote for a vehicle repair.",
  },

  // PLACEHOLDER: replace with the real email address.
  email: 'info@yourdomain.co.za',

  // PLACEHOLDER: replace with the real workshop address.
  address: {
    street: 'Workshop street address',
    suburb: 'Suburb',
    city: 'City',
    province: 'Province',
    postalCode: '0000',
    country: 'ZA',
  },

  // PLACEHOLDER: confirm trading hours with the business.
  hours: [
    { days: 'Monday – Friday', time: '07:30 – 17:00', schema: 'Mo-Fr 07:30-17:00' },
    { days: 'Saturday', time: '08:00 – 12:00', schema: 'Sa 08:00-12:00' },
    { days: 'Sunday & public holidays', time: 'Closed' },
  ] satisfies BusinessHours[],

  // PLACEHOLDER: replace with a Google Maps link to the workshop.
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dino's+Auto+Body+Repairs",

  // PLACEHOLDER: replace with real profile URLs (or remove unused ones).
  social: [
    { label: 'Facebook', href: '#' },
    { label: 'Instagram', href: '#' },
  ],

  // PLACEHOLDER: replace with the live domain.
  siteUrl: 'https://www.example.co.za',
} as const

export const whatsappHref = (message: string = business.whatsapp.greeting) =>
  `https://wa.me/${business.whatsapp.number}?text=${encodeURIComponent(message)}`

export const formattedAddress = () => {
  const a = business.address
  return [a.street, `${a.suburb}, ${a.city}`, `${a.province}, ${a.postalCode}`]
}

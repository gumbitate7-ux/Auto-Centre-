import type { ServiceId } from './services'

export const navigation = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Our Work' },
  { id: 'about', label: 'About' },
  { id: 'why', label: "Why Dino's" },
  { id: 'estimate', label: 'Estimate' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navigation)[number]['id'] | 'quote' | 'process'

export const heroSlides = [
  {
    image: 'hero-booth',
    label: 'Refinishing',
    alt: 'Graphite sports car in a bright refinishing bay, lit by overhead light panels',
  },
  {
    image: 'hero-profile',
    label: 'Panel & paint detail',
    alt: 'Close-up of a silver rear wheel arch with clean reflections across the panel',
  },
  {
    image: 'hero-rear',
    label: 'Colour & finish',
    alt: 'Sage-metallic vehicle seen from the rear three-quarter in a refinishing bay',
  },
] as const

export const trustPoints = [
  {
    icon: 'shield',
    title: 'Professional Repairs',
    text: 'Structural and cosmetic work done properly, not patched over.',
  },
  {
    icon: 'spark',
    title: 'Quality Finishes',
    text: 'Careful preparation, colour matching and refinishing.',
  },
  {
    icon: 'hand',
    title: 'Experienced Craftsmanship',
    text: 'Hands-on panel and paint work by people who care about it.',
  },
  {
    icon: 'chat',
    title: 'Customer Focused',
    text: 'Clear communication from first assessment to collection.',
  },
] as const

export const pillars = [
  {
    title: 'Attention to Detail',
    text: 'Panel gaps, body lines and reflections are checked, not assumed. The small things are what make a repair disappear.',
  },
  {
    title: 'Quality Workmanship',
    text: 'Damage is repaired at the source. Proper preparation comes before any paint is applied.',
  },
  {
    title: 'Professional Finish',
    text: 'Colour is matched to your vehicle and blended so the repair sits seamlessly with the original paint.',
  },
  {
    title: 'Customer Confidence',
    text: 'You know what is being done and why, with honest advice before any work begins.',
  },
] as const

export const processSteps = [
  { title: 'Bring It In', text: 'Vehicle assessment and initial inspection.' },
  { title: 'Assess & Quote', text: 'Damage is assessed and the repair process is explained.' },
  { title: 'Repair & Restore', text: 'Our team completes the required bodywork and refinishing.' },
  { title: 'Drive Away', text: 'Final quality check before your vehicle is returned.' },
] as const

export interface Comparison {
  id: string
  label: string
  title: string
  text: string
  before: string
  after: string
  alt: { before: string; after: string }
}

export const comparisons: Comparison[] = [
  {
    id: 'door',
    label: 'Side damage',
    title: 'Side-swipe scrape and door dent',
    text: 'Door reshaped, prepared and refinished, with the colour blended into the adjoining panels.',
    before: 'ba-door-before',
    after: 'ba-door-after',
    alt: {
      before: 'Graphite door with long horizontal scrapes, chipped paint and a shallow dent',
      after: 'The same graphite door fully repaired with clean, undistorted reflections',
    },
  },
  {
    id: 'front',
    label: 'Front corner',
    title: 'Front-corner collision',
    text: 'Fender and bumper corner repaired, refinished and checked for clean panel alignment.',
    before: 'ba-front-before',
    after: 'ba-front-after',
    alt: {
      before: 'Silver car with a dented front fender and scraped bumper corner',
      after: 'The same silver car with the front fender and bumper restored',
    },
  },
  {
    id: 'rear',
    label: 'Rear bumper',
    title: 'Rear bumper and quarter panel',
    text: 'Bumper corner and rear quarter repaired, then colour-matched to the original pearl finish.',
    before: 'ba-rear-before',
    after: 'ba-rear-after',
    alt: {
      before: 'Pearl-white car with a scuffed, dented rear bumper corner and quarter panel',
      after: 'The same pearl-white car with the rear bumper and quarter panel restored',
    },
  },
]

export type ProjectCategory = 'Accident Repairs' | 'Panel Beating' | 'Spray Painting' | 'Restorations'

export const projectCategories: ProjectCategory[] = [
  'Accident Repairs',
  'Panel Beating',
  'Spray Painting',
  'Restorations',
]

export interface Project {
  id: string
  title: string
  category: ProjectCategory
  description: string
  work: string[]
  image: string
  alt: string
  /** Visual size in the editorial grid. */
  shape: 'portrait' | 'landscape' | 'wide' | 'cinema'
  beforeAfter?: { before: string; after: string }
  service: ServiceId
}

export const projects: Project[] = [
  {
    id: 'front-corner',
    title: 'Front-corner collision repair',
    category: 'Accident Repairs',
    description:
      'A typical front-corner impact: a creased fender and a scraped, pushed-in bumper corner, repaired and refinished to match.',
    work: ['Damage assessment', 'Fender reshaping', 'Bumper repair', 'Colour-matched refinish'],
    image: 'ba-front-after',
    alt: 'Silver coupé after front-corner collision repair in a refinishing bay',
    shape: 'landscape',
    beforeAfter: { before: 'ba-front-before', after: 'ba-front-after' },
    service: 'accident',
  },
  {
    id: 'wheel-detail',
    title: 'Finishing and detail',
    category: 'Restorations',
    description:
      'The final stage of a restoration, where trim, wheels and paint are inspected under strong light before handover.',
    work: ['Final inspection', 'Paint correction', 'Detail finishing'],
    image: 'gal-wheel',
    alt: 'Close-up of a graphite vehicle wheel and front fender',
    shape: 'portrait',
    service: 'restoration',
  },
  {
    id: 'respray',
    title: 'Full respray in sage metallic',
    category: 'Spray Painting',
    description:
      'Complete colour change with full preparation, base coat and clear coat, finished for a deep, even gloss.',
    work: ['Surface preparation', 'Masking', 'Base and clear coat', 'Cut and polish'],
    image: 'gal-respray',
    alt: 'Side profile of a sage-metallic convertible after a full respray',
    shape: 'wide',
    service: 'spray',
  },
  {
    id: 'bonnet',
    title: 'Bonnet and front-end refinish',
    category: 'Spray Painting',
    description:
      'Stone-chipped bonnet and front end refinished and blended into the wings for an invisible transition.',
    work: ['Chip repair', 'Preparation', 'Refinish and blend'],
    image: 'gal-bonnet',
    alt: 'White bonnet and front end with clean reflections after refinishing',
    shape: 'portrait',
    service: 'spray',
  },
  {
    id: 'panel-prep',
    title: 'Panel repair and primer',
    category: 'Panel Beating',
    description: 'A damaged panel section repaired and taken back to primer, with feathered edges ready for paint.',
    work: ['Panel repair', 'Feather sanding', 'Primer'],
    image: 'svc-panel',
    alt: 'Graphite fender and door section in primer during panel repair',
    shape: 'portrait',
    service: 'panel',
  },
  {
    id: 'door-swipe',
    title: 'Side-swipe door repair',
    category: 'Panel Beating',
    description:
      'Long scrapes and a shallow dent across the driver-side door, reshaped and refinished without replacing the panel.',
    work: ['Panel reshaping', 'Filler and primer', 'Refinish and blend'],
    image: 'ba-door-after',
    alt: 'Graphite door after side-swipe repair',
    shape: 'landscape',
    beforeAfter: { before: 'ba-door-before', after: 'ba-door-after' },
    service: 'panel',
  },
  {
    id: 'rear-quarter',
    title: 'Rear bumper and quarter repair',
    category: 'Accident Repairs',
    description:
      'Low-speed rear impact with bumper and quarter-panel damage, repaired and matched to the original pearl finish.',
    work: ['Bumper repair', 'Quarter panel reshaping', 'Pearl colour match'],
    image: 'ba-rear-after',
    alt: 'Pearl-white car after rear bumper and quarter repair',
    shape: 'landscape',
    beforeAfter: { before: 'ba-rear-before', after: 'ba-rear-after' },
    service: 'bumper',
  },
  {
    id: 'paint-finish',
    title: 'Paint finishing and correction',
    category: 'Spray Painting',
    description:
      'Refinished panels are flatted and polished so reflections run cleanly from one panel to the next, with no visible repair edges.',
    work: ['Refinish', 'Flatting', 'Machine polish', 'Final inspection'],
    image: 'hero-profile',
    alt: 'Silver rear wheel arch with clean, unbroken reflections across the panel',
    shape: 'cinema',
    service: 'spray',
  },
  {
    id: 'restoration',
    title: 'Exterior restoration',
    category: 'Restorations',
    description: 'Bodywork brought back to a straight, primed shell before being refinished in a deep bronze metallic.',
    work: ['Full strip and assessment', 'Body repairs', 'High-build primer', 'Bronze metallic refinish'],
    image: 'gal-resto-after',
    alt: 'Bronze-metallic convertible after an exterior restoration',
    shape: 'landscape',
    beforeAfter: { before: 'gal-resto-before', after: 'gal-resto-after' },
    service: 'restoration',
  },
]

export const about = {
  statement: 'Repairs carried out properly, finished so you would never know they happened.',
  paragraphs: [
    "Dino's Auto Body Repairs handles everything from minor dents and parking scuffs to accident damage and full exterior restorations.",
    'Every job starts with a proper assessment and a clear explanation of what your vehicle needs. Damage is repaired at the source, surfaces are prepared carefully, and paint is matched to the rest of the car, so the result looks right in any light.',
  ],
  focus: ['Accident damage', 'Panel beating', 'Spray painting', 'Dents & bumpers', 'Restorations'],
} as const

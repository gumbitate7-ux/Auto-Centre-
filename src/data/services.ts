export type ServiceId = 'accident' | 'panel' | 'spray' | 'dent' | 'bumper' | 'restoration'

export interface Service {
  id: ServiceId
  title: string
  summary: string
  /** Base name of an image in public/images (see src/data/images.generated.json). */
  image: string
  alt: string
}

export const services: Service[] = [
  {
    id: 'accident',
    title: 'Accident Repairs',
    summary: 'Collision damage repaired and restored with attention to structural and cosmetic detail.',
    image: 'svc-accident',
    alt: 'Silver coupé with front-corner collision damage to the bumper and front fender',
  },
  {
    id: 'panel',
    title: 'Panel Beating',
    summary: 'Professional restoration of damaged body panels.',
    image: 'svc-panel',
    alt: 'Graphite vehicle with a repaired front fender section taken back to primer',
  },
  {
    id: 'spray',
    title: 'Spray Painting',
    summary: 'High-quality vehicle refinishing and colour matching.',
    image: 'svc-spray',
    alt: 'Freshly refinished pearl-white rear quarter, wheels masked, under booth lighting',
  },
  {
    id: 'dent',
    title: 'Dent Repairs',
    summary: "Precision dent restoration while preserving the vehicle's original appearance.",
    image: 'svc-dent',
    alt: 'Close-up of a dent in a silver door panel, visible in the distorted reflections',
  },
  {
    id: 'bumper',
    title: 'Bumper Repairs',
    summary: 'Repair and refinishing for damaged bumpers.',
    image: 'svc-bumper',
    alt: 'Graphite vehicle with scuffed and dented rear bumper corner',
  },
  {
    id: 'restoration',
    title: 'Full Vehicle Restoration',
    summary: 'Comprehensive exterior restoration for vehicles requiring extensive repair.',
    image: 'svc-restoration',
    alt: 'Vehicle in grey primer with glass and wheels masked, ready for refinishing',
  },
]

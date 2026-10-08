import { useEffect, useRef, useState, type CSSProperties } from 'react'
import manifest from '../../data/images.generated.json'
import './Picture.css'

interface ImageEntry {
  width: number
  height: number
  widths: number[]
  lqip: string
}

const images = manifest as Record<string, ImageEntry>
const base = import.meta.env.BASE_URL

const imageUrl = (name: string, width: number, format: 'avif' | 'webp' = 'webp') =>
  `${base}images/${name}-${width}.${format}`

interface PictureProps {
  /** Base name of the image (see scripts/optimize-images.mjs). */
  name: string
  alt: string
  /** The `sizes` attribute: how wide the image renders at each breakpoint. */
  sizes?: string
  priority?: boolean
  className?: string
  imgClassName?: string
  style?: CSSProperties
  draggable?: boolean
}

/**
 * Responsive, lazy-loaded image with AVIF/WebP sources, intrinsic size
 * (no layout shift) and a blurred low-quality placeholder.
 */
export function Picture({
  name,
  alt,
  sizes = '100vw',
  priority = false,
  className = '',
  imgClassName = '',
  style,
  draggable,
}: PictureProps) {
  const entry = images[name]
  const imgRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) setLoaded(true)
  }, [name])

  if (!entry) {
    return <span className={`picture picture--missing ${className}`} role="img" aria-label={alt} style={style} />
  }

  const srcSet = (format: 'avif' | 'webp') => entry.widths.map((w) => `${imageUrl(name, w, format)} ${w}w`).join(', ')
  const fallback = entry.widths.find((w) => w >= 1280) ?? entry.widths[entry.widths.length - 1]

  return (
    <picture
      className={`picture${loaded ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, '--lqip': `url("${entry.lqip}")` } as CSSProperties}
    >
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        ref={imgRef}
        src={imageUrl(name, fallback)}
        alt={alt}
        width={entry.width}
        height={entry.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        draggable={draggable}
        onLoad={() => setLoaded(true)}
        className={imgClassName}
      />
    </picture>
  )
}

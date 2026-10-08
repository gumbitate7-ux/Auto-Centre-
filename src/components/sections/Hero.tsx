import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { heroSlides } from '../../data/content'
import { prefersReducedMotion, subscribeScroll, clamp } from '../../lib/scroll'
import { Button } from '../ui/Button'
import { Picture } from '../ui/Picture'
import './Hero.css'

const SLIDE_MS = 6500

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(false)
  // Secondary slides mount after the first image has had time to load (protects LCP).
  const [extrasReady, setExtrasReady] = useState(false)

  useEffect(() => {
    const t = window.setTimeout(() => setExtrasReady(true), 2000)
    return () => window.clearTimeout(t)
  }, [])

  // Scroll-linked frame: the media band opens from inset to full-bleed and
  // the imagery drifts slightly slower than the page (parallax).
  useEffect(() => {
    const media = mediaRef.current
    const intro = introRef.current
    if (!media || !intro) return

    const measure = () => {
      const styles = getComputedStyle(intro)
      const inset = intro.getBoundingClientRect().left + parseFloat(styles.paddingLeft)
      media.style.setProperty('--inset-x', `${Math.max(0, Math.round(inset))}px`)
    }
    measure()
    window.addEventListener('resize', measure)

    if (prefersReducedMotion()) {
      return () => window.removeEventListener('resize', measure)
    }
    const top = () => media.getBoundingClientRect().top + window.scrollY
    let mediaTop = top()
    let maxShift = media.offsetHeight * 0.085
    const ro = new ResizeObserver(() => {
      mediaTop = top()
      maxShift = media.offsetHeight * 0.085
      measure()
    })
    ro.observe(document.body)

    const unsubscribe = subscribeScroll((y, vh) => {
      // 0 at the top of the page (frame aligned to the content), 1 = full-bleed.
      const p = clamp(y / (vh * 0.6))
      media.style.setProperty('--p', p.toFixed(4))
      if (y < mediaTop + vh) media.style.setProperty('--shift', `${Math.min(y * 0.16, maxShift).toFixed(1)}px`)
    })

    return () => {
      unsubscribe()
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Autoplay only while the hero is on screen and the tab is visible.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const media = mediaRef.current
    if (!media) return
    let onScreen = true
    const update = () => setAutoplay(onScreen && document.visibilityState === 'visible')
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting
      update()
    })
    io.observe(media)
    document.addEventListener('visibilitychange', update)
    update()
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  useEffect(() => {
    if (!autoplay) return
    const timer = window.setTimeout(() => setIndex((i) => (i + 1) % heroSlides.length), SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [autoplay, index])

  const slide = heroSlides[index]

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div ref={introRef} className="container hero__intro">
        <p className="eyebrow hero__eyebrow">
          <span>Auto Body Repairs</span>
          <span className="hero__dot-sep" aria-hidden="true" />
          <span>Spray Painting</span>
          <span className="hero__dot-sep" aria-hidden="true" />
          <span>Accident Repairs</span>
        </p>

        <div className="hero__grid">
          <h1 id="hero-title" className="display hero__title">
            <span className="hero__line">
              <span>Precision Repairs.</span>
            </span>
            <span className="hero__line muted-tone">
              <span>Restored With Confidence.</span>
            </span>
          </h1>

          <div className="hero__aside">
            <p className="lead hero__lead">
              Professional auto body repairs, accident restoration and vehicle refinishing carried out with precision.
            </p>
            <div className="hero__ctas">
              <Button href="#quote" size="lg" icon="arrow-right" magnetic>
                Get a Repair Quote
              </Button>
              <Button href="#work" size="lg" variant="secondary">
                View Our Work
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div ref={mediaRef} className="hero__media" style={{ '--slide-ms': `${SLIDE_MS}ms` } as CSSProperties}>
        <div className="hero__frame">
          {heroSlides.map((s, i) => (
            <div key={s.image} className={`hero__slide${i === index ? ' is-active' : ''}`} aria-hidden={i !== index}>
              {(i === 0 || extrasReady || i === index) && (
                <Picture name={s.image} alt={s.alt} sizes="100vw" priority={i === 0} className="hero__picture" />
              )}
            </div>
          ))}
          <div className="hero__shade" aria-hidden="true" />

          <div className="hero__meta">
            <p className="hero__label" aria-live="polite">
              <span className="tabular">{String(index + 1).padStart(2, '0')}</span>
              <span className="hero__label-total tabular">/ {String(heroSlides.length).padStart(2, '0')}</span>
              <span className="hero__label-text">{slide.label}</span>
            </p>
            <div className="hero__progress" role="group" aria-label="Hero images">
              {heroSlides.map((s, i) => (
                <button
                  key={s.image}
                  type="button"
                  className={`hero__bar${i === index ? ' is-active' : ''}${i === index && autoplay ? ' is-playing' : ''}`}
                  aria-label={`Show image ${i + 1}: ${s.label}`}
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                >
                  <span className="hero__bar-fill" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

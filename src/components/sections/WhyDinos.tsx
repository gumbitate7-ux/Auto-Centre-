import { useRef } from 'react'
import { business } from '../../data/business'
import { pillars } from '../../data/content'
import { useParallax } from '../../hooks/useParallax'
import { Button } from '../ui/Button'
import { Picture } from '../ui/Picture'
import { Reveal } from '../ui/Reveal'
import './WhyDinos.css'

export function WhyDinos() {
  const mediaRef = useRef<HTMLDivElement>(null)
  useParallax(mediaRef, 0.09)

  return (
    <section id="why" className="section why on-dark" aria-labelledby="why-title">
      <div className="container why__grid">
        <Reveal className="why__media-wrap" fade>
          <div ref={mediaRef} className="why__media">
            <Picture
              name="why-detail"
              alt="Midnight-blue front wing and headlight with clean, undistorted reflections"
              sizes="(min-width: 1024px) 40vw, 92vw"
              className="why__picture"
            />
          </div>
          <p className="why__caption">
            <span className="why__caption-line" aria-hidden="true" />
            Reflections tell you everything about a repair.
          </p>
        </Reveal>

        <div className="why__content">
          <Reveal>
            <p className="eyebrow section-head__eyebrow">Why Dino&rsquo;s</p>
          </Reveal>
          <Reveal as="h2" id="why-title" className="h2 why__title" delay={60}>
            Your Vehicle Deserves Better Than a Quick Fix.
          </Reveal>
          <Reveal as="p" className="why__lead" delay={120}>
            A quick fix hides damage. A proper repair removes it. Taking the time to repair, prepare and refinish
            correctly means the work holds up, and the finish matches the rest of your vehicle in any light.
          </Reveal>

          <ol className="why__pillars">
            {pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.title} className="why__pillar" delay={140 + i * 90}>
                <span className="why__pillar-index tabular">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="why__pillar-title">{pillar.title}</h3>
                <p className="why__pillar-text">{pillar.text}</p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="why__ctas" delay={200}>
            <Button href="#quote" variant="light" size="lg" icon="arrow-right">
              Book an Assessment
            </Button>
            <Button href={business.phone.href} variant="outline-light" size="lg" iconStart="phone">
              Call Dino&rsquo;s
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

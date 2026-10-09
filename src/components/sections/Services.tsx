import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { services } from '../../data/services'
import { useQuote } from '../quote/QuoteContext'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Picture } from '../ui/Picture'
import { Reveal } from '../ui/Reveal'
import './Services.css'

export function Services() {
  const { presetService } = useQuote()
  const trackRef = useRef<HTMLUListElement>(null)
  const [progress, setProgress] = useState(0)

  // Mobile carousel progress indicator.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth
      setProgress(max > 0 ? track.scrollLeft / max : 0)
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow section-head__eyebrow">Services</p>
            </Reveal>
            <Reveal as="h2" id="services-title" className="h2 section-head__title" delay={60}>
              Complete Auto Body Repair
            </Reveal>
          </div>
          <Reveal className="section-head__aside" delay={140}>
            <p className="body-copy services__intro">
              From minor dents to major collision damage, every repair gets the same care: proper preparation, accurate
              colour matching and a quality finish.
            </p>
            <div className="services__links">
              <Button href="#estimate" variant="ghost" icon="arrow-right">
                Get an instant estimate
              </Button>
              <Button href="#quote" variant="ghost" icon="arrow-right">
                Discuss your repair
              </Button>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="services__viewport">
        <ul ref={trackRef} className="container services__grid" aria-label="Services">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} className="svc" delay={(i % 3) * 110}>
              <a href="#quote" className="svc__link" onClick={() => presetService(service.id)}>
                <div className="svc__media">
                  <Picture
                    name={service.image}
                    alt={service.alt}
                    sizes="(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 80vw"
                    className="svc__picture"
                  />
                  <span className="svc__index tabular" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="svc__arrow" aria-hidden="true">
                    <Icon name="arrow-up-right" size={20} />
                  </span>
                  <span className="svc__hint" aria-hidden="true">
                    Request a quote
                  </span>
                </div>
                <div className="svc__body">
                  <h3 className="h3 svc__title">{service.title}</h3>
                  <p className="svc__summary">{service.summary}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
        <div className="container services__progress" aria-hidden="true">
          <span className="services__progress-bar" style={{ '--progress': progress } as CSSProperties} />
        </div>
      </div>
    </section>
  )
}

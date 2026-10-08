import { useRef } from 'react'
import { business, whatsappHref } from '../../data/business'
import { useParallax } from '../../hooks/useParallax'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Picture } from '../ui/Picture'
import { Reveal } from '../ui/Reveal'
import './CtaBand.css'

export function CtaBand() {
  const mediaRef = useRef<HTMLDivElement>(null)
  useParallax(mediaRef, 0.1)

  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container">
        <Reveal className="cta-band__panel on-dark" fade>
          <div ref={mediaRef} className="cta-band__media" aria-hidden="true">
            <Picture name="cta-wide" alt="" sizes="(min-width: 1360px) 1360px, 100vw" className="cta-band__picture" />
          </div>
          <div className="cta-band__shade" aria-hidden="true" />

          <div className="cta-band__content">
            <p className="eyebrow">Ready when you are</p>
            <h2 id="cta-title" className="h2 cta-band__title">
              Let&rsquo;s Get Your Vehicle Back To Its Best.
            </h2>
            <p className="cta-band__text">
              Talk to Dino&rsquo;s Auto Body Repairs about your repair requirements and receive a professional
              assessment.
            </p>
            <div className="cta-band__actions">
              <Button href="#quote" variant="light" size="lg" icon="arrow-right" magnetic>
                Request a Quote
              </Button>
              <Button href={business.phone.href} variant="outline-light" size="lg" iconStart="phone">
                Call Dino&rsquo;s
              </Button>
            </div>
            <a className="cta-band__wa" href={whatsappHref()} target="_blank" rel="noopener noreferrer">
              <Icon name="whatsapp" size={18} />
              Or send photos on WhatsApp
              <Icon name="arrow-up-right" size={16} />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

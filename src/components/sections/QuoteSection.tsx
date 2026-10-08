import { business, whatsappHref } from '../../data/business'
import { QuoteForm } from '../quote/QuoteForm'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import './QuoteSection.css'

const nextSteps = [
  'We review your details and photos.',
  'We contact you to discuss the repair and arrange an inspection.',
  'You receive a clear, professional quote.',
]

export function QuoteSection() {
  return (
    <section id="quote" className="section quote-section" aria-labelledby="quote-title">
      <div className="container quote-section__grid">
        <div className="quote-section__intro">
          <Reveal>
            <p className="eyebrow section-head__eyebrow">Request a Quote</p>
          </Reveal>
          <Reveal as="h2" id="quote-title" className="h2 quote-section__title" delay={60}>
            Tell Us About Your Vehicle.
          </Reveal>
          <Reveal as="p" className="lead quote-section__lead" delay={120}>
            Share a few details and, if you can, some photos of the damage. We&rsquo;ll review everything and get back
            to you to arrange an assessment.
          </Reveal>

          <Reveal className="quote-section__next" delay={160}>
            <h3 className="quote-section__subhead">What happens next</h3>
            <ol>
              {nextSteps.map((s, i) => (
                <li key={s}>
                  <span className="tabular">{String(i + 1).padStart(2, '0')}</span>
                  {s}
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal className="quote-section__direct" delay={200}>
            <h3 className="quote-section__subhead">Prefer to talk?</h3>
            <div className="quote-section__direct-actions">
              <Button href={business.phone.href} variant="secondary" iconStart="phone">
                Call Dino&rsquo;s
              </Button>
              <Button
                href={whatsappHref()}
                variant="secondary"
                iconStart="whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal className="quote-section__form" delay={100}>
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  )
}

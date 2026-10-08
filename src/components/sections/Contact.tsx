import { business, formattedAddress, whatsappHref } from '../../data/business'
import { Button } from '../ui/Button'
import { Icon, type IconName } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import { MapIllustration } from './MapIllustration'
import './Contact.css'

interface Method {
  icon: IconName
  label: string
  value: string
  action: string
  href: string
  external?: boolean
}

export function Contact() {
  const address = formattedAddress()
  const methods: Method[] = [
    { icon: 'phone', label: 'Phone', value: business.phone.display, action: 'Call', href: business.phone.href },
    {
      icon: 'whatsapp',
      label: 'WhatsApp',
      value: business.whatsapp.display,
      action: 'Message',
      href: whatsappHref(),
      external: true,
    },
    { icon: 'mail', label: 'Email', value: business.email, action: 'Email', href: `mailto:${business.email}` },
    {
      icon: 'pin',
      label: 'Workshop',
      value: address.join('\n'),
      action: 'Directions',
      href: business.mapsUrl,
      external: true,
    },
  ]

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow section-head__eyebrow">Contact</p>
            </Reveal>
            <Reveal as="h2" id="contact-title" className="h2 section-head__title" delay={60}>
              Visit, Call or Message Us.
            </Reveal>
          </div>
          <Reveal className="section-head__aside" delay={140}>
            <p className="body-copy">
              Pop in for an assessment, give us a call, or send photos of the damage on WhatsApp for a quicker first look.
            </p>
          </Reveal>
        </div>

        {/* Mobile: the three things people want most, first. */}
        <div className="contact__quick">
          <a href={business.phone.href} className="contact__quick-btn">
            <Icon name="phone" size={20} />
            Call
          </a>
          <a href={whatsappHref()} className="contact__quick-btn" target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" size={20} />
            WhatsApp
          </a>
          <a href={business.mapsUrl} className="contact__quick-btn" target="_blank" rel="noopener noreferrer">
            <Icon name="navigation" size={20} />
            Directions
          </a>
        </div>

        <div className="contact__grid">
          <Reveal className="contact__details">
            <ul className="contact__methods">
              {methods.map((m) => (
                <li key={m.label}>
                  <a
                    href={m.href}
                    className="contact__method"
                    {...(m.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <span className="contact__method-icon">
                      <Icon name={m.icon} size={19} />
                    </span>
                    <span className="contact__method-text">
                      <span className="contact__method-label">{m.label}</span>
                      <span className="contact__method-value">{m.value}</span>
                    </span>
                    <span className="contact__method-action">
                      {m.action}
                      <Icon name="arrow-up-right" size={16} />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="contact__hours">
              <h3 className="contact__subhead">
                <Icon name="clock" size={16} />
                Business hours
              </h3>
              <dl>
                {business.hours.map((h) => (
                  <div key={h.days} className="contact__hours-row">
                    <dt>{h.days}</dt>
                    <dd className="tabular">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {business.usesPlaceholderDetails && (
              <p className="contact__placeholder">
                <span className="contact__placeholder-tag">Placeholder</span>
                Contact details, address and hours shown are placeholders for this concept and must be replaced before
                launch.
              </p>
            )}
          </Reveal>

          <Reveal className="contact__map" delay={120}>
            <MapIllustration />
            <div className="contact__map-card">
              <p className="contact__map-name">{business.name}</p>
              <p className="contact__map-address">{address.slice(0, 2).join(', ')}</p>
              <div className="contact__map-actions">
                <Button href={business.mapsUrl} size="sm" iconStart="navigation" target="_blank" rel="noopener noreferrer">
                  Get Directions
                </Button>
                <Button href={business.phone.href} size="sm" variant="secondary" iconStart="phone">
                  Call
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

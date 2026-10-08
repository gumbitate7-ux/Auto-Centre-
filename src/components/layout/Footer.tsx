import { business, formattedAddress, whatsappHref } from '../../data/business'
import { navigation } from '../../data/content'
import { services } from '../../data/services'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import './Footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo />
            <p className="footer__summary">{business.summary}</p>
            <ul className="footer__social" aria-label="Social media">
              {business.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={`${business.name} on ${s.label}`} className="footer__social-link">
                    <Icon name={s.label === 'Facebook' ? 'facebook' : 'instagram'} size={18} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav className="footer__col" aria-label="Footer">
            <h2 className="footer__heading">Navigate</h2>
            <ul>
              {navigation.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="footer__link">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#quote" className="footer__link">
                  Get a Quote
                </a>
              </li>
            </ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__heading">Services</h2>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <a href="#services" className="footer__link">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Contact</h2>
            <ul>
              <li>
                <a href={business.phone.href} className="footer__link">
                  {business.phone.display}
                </a>
              </li>
              <li>
                <a href={whatsappHref()} className="footer__link" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email}`} className="footer__link">
                  {business.email}
                </a>
              </li>
              <li className="footer__address">{formattedAddress().join(', ')}</li>
            </ul>
          </div>

          <div className="footer__col">
            <h2 className="footer__heading">Hours</h2>
            <dl className="footer__hours">
              {business.hours.map((h) => (
                <div key={h.days}>
                  <dt>{h.days}</dt>
                  <dd className="tabular">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {year} {business.name}. All rights reserved.
          </p>
          <p className="footer__concept">Website concept. Imagery and contact details are placeholders.</p>
          <a href="#home" className="footer__top-link">
            Back to top
            <Icon name="arrow-up" size={16} />
          </a>
        </div>
      </div>
      <p className="footer__wordmark" aria-hidden="true">
        DINO&rsquo;S
      </p>
    </footer>
  )
}

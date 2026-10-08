import { trustPoints } from '../../data/content'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import './TrustStrip.css'

export function TrustStrip() {
  return (
    <section className="trust" aria-label="What you can expect">
      <div className="container">
        <ul className="trust__list">
          {trustPoints.map((point, i) => (
            <Reveal as="li" key={point.title} className="trust__item" delay={i * 90}>
              <span className="trust__icon">
                <Icon name={point.icon} size={22} strokeWidth={1.4} />
              </span>
              <div>
                <p className="trust__title">{point.title}</p>
                <p className="trust__text">{point.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

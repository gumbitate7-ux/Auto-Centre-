import { useEffect, useState } from 'react'
import { business, whatsappHref } from '../../data/business'
import { subscribeScroll } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import './MobileActionBar.css'

/**
 * Sticky Call / WhatsApp / Get Quote bar for phones. Appears once the
 * hero CTAs have scrolled away and steps aside while the quote form or
 * contact section (which have the same actions) are on screen.
 */
export function MobileActionBar() {
  const [pastHero, setPastHero] = useState(false)
  const [suppressed, setSuppressed] = useState(false)

  useEffect(() => subscribeScroll((y, vh) => setPastHero(y > vh * 0.75)), [])

  useEffect(() => {
    const targets = ['quote', 'contact'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const visible = new Set<string>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target.id) : visible.delete(e.target.id)))
        setSuppressed(visible.size > 0)
      },
      { rootMargin: '-30% 0px -30% 0px' },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  const shown = pastHero && !suppressed

  return (
    <nav className={`action-bar${shown ? ' is-shown' : ''}`} aria-label="Quick actions" inert={!shown}>
      <a href={business.phone.href} className="action-bar__btn">
        <Icon name="phone" size={19} />
        <span>Call</span>
      </a>
      <a href={whatsappHref()} className="action-bar__btn" target="_blank" rel="noopener noreferrer">
        <Icon name="whatsapp" size={19} />
        <span>WhatsApp</span>
      </a>
      <a href="#quote" className="action-bar__btn action-bar__btn--primary">
        <span>Get a Quote</span>
        <Icon name="arrow-right" size={18} />
      </a>
    </nav>
  )
}

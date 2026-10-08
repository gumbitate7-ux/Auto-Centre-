import { useRef, type CSSProperties } from 'react'
import { business, whatsappHref } from '../../data/business'
import { navigation } from '../../data/content'
import { useDialog } from '../../hooks/useDialog'
import { Button } from '../ui/Button'
import './MobileMenu.css'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  active: string
}

export function MobileMenu({ open, onClose, active }: MobileMenuProps) {
  const ref = useRef<HTMLDivElement>(null)
  useDialog(open, ref, onClose)

  return (
    <div
      ref={ref}
      id="mobile-menu"
      className={`mobile-menu${open ? ' is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      inert={!open}
    >
      <div className="mobile-menu__panel container">
        <nav aria-label="Mobile">
          <ol className="mobile-menu__list">
            {navigation.map((item, index) => (
              <li key={item.id} style={{ '--i': index } as CSSProperties}>
                <a
                  href={`#${item.id}`}
                  className={`mobile-menu__link${active === item.id ? ' is-active' : ''}`}
                  onClick={onClose}
                >
                  <span className="mobile-menu__index tabular">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mobile-menu__footer">
          <Button href="#quote" size="lg" block icon="arrow-right" onClick={onClose}>
            Get a Quote
          </Button>
          <div className="mobile-menu__quick">
            <Button href={business.phone.href} variant="secondary" iconStart="phone" block>
              Call
            </Button>
            <Button
              href={whatsappHref()}
              variant="secondary"
              iconStart="whatsapp"
              block
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </Button>
          </div>
          <p className="mobile-menu__hours">
            {business.hours[0].days} · {business.hours[0].time}
          </p>
        </div>
      </div>
    </div>
  )
}

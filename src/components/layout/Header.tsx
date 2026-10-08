import { useCallback, useEffect, useRef, useState } from 'react'
import { business } from '../../data/business'
import { navigation } from '../../data/content'
import { subscribeScroll } from '../../lib/scroll'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { MobileMenu } from './MobileMenu'
import './Header.css'

export function Header({ active }: { active: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => subscribeScroll((y) => setScrolled(y > 24)), [])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
        <div className="container site-header__inner">
          <a href="#home" className="site-header__brand" onClick={closeMenu}>
            <Logo />
            <span className="visually-hidden">, home</span>
          </a>

          <nav className="site-nav" aria-label="Primary">
            <ul className="site-nav__list">
              {navigation.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`site-nav__link${active === item.id ? ' is-active' : ''}`}
                    aria-current={active === item.id ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <a href={business.phone.href} className="site-header__call">
              <Icon name="phone" size={17} />
              <span>Call Dino&rsquo;s</span>
            </a>
            <Button href="#quote" size="sm" className="site-header__cta">
              Get a Quote
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="menu-toggle__bar" />
              <span className="menu-toggle__bar" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} active={active} />
    </>
  )
}

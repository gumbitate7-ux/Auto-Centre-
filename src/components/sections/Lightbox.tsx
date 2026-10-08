import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '../../data/content'
import { scrollToSection } from '../../lib/scroll'
import { useDialog } from '../../hooks/useDialog'
import { useQuote } from '../quote/QuoteContext'
import { Button } from '../ui/Button'
import { CompareSlider } from '../ui/CompareSlider'
import { Icon } from '../ui/Icon'
import { Picture } from '../ui/Picture'
import './Lightbox.css'

interface LightboxProps {
  projects: Project[]
  index: number | null
  onClose: () => void
  onNavigate: (index: number) => void
}

const EXIT_MS = 320

export function Lightbox({ projects, index, onClose, onNavigate }: LightboxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { presetService } = useQuote()
  const isOpen = index !== null
  // Keep the last project on screen while the exit animation plays.
  const lastIndex = useRef<number>(index ?? 0)
  if (index !== null) lastIndex.current = index
  const [closing, setClosing] = useState(false)
  const wasOpen = useRef(false)
  const [view, setView] = useState<'compare' | 'final'>('compare')

  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true
      setClosing(false)
      return
    }
    if (!wasOpen.current) return
    wasOpen.current = false
    setClosing(true)
    const t = window.setTimeout(() => setClosing(false), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [isOpen])

  useEffect(() => setView('compare'), [index])

  useDialog(isOpen, ref, onClose)

  const count = projects.length
  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return
      onNavigate((index + dir + count) % count)
    },
    [index, count, onNavigate],
  )

  // Arrow keys move between projects (unless the comparison slider has focus).
  useEffect(() => {
    if (!isOpen) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.getAttribute('role') === 'slider') return
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, go])

  if (!isOpen && !closing) return null
  const shown = Math.min(lastIndex.current, count - 1)
  const project = projects[shown]
  if (!project) return null
  const hasPair = Boolean(project.beforeAfter)

  return (
    <div
      className={`lightbox ${isOpen ? 'is-open' : 'is-closing'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={ref}
        className="lightbox__dialog on-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lightbox-title"
      >
        <div className="lightbox__topbar">
          <p className="lightbox__counter tabular" aria-live="polite">
            {String(shown + 1).padStart(2, '0')} <span>/ {String(count).padStart(2, '0')}</span>
          </p>
          <div className="lightbox__nav">
            <button type="button" className="lightbox__icon-btn" onClick={() => go(-1)} aria-label="Previous project">
              <Icon name="arrow-left" size={20} />
            </button>
            <button type="button" className="lightbox__icon-btn" onClick={() => go(1)} aria-label="Next project">
              <Icon name="arrow-right" size={20} />
            </button>
            <button
              type="button"
              className="lightbox__icon-btn lightbox__close"
              onClick={onClose}
              aria-label="Close project"
              data-autofocus
            >
              <Icon name="close" size={20} />
            </button>
          </div>
        </div>

        <div className="lightbox__body" key={project.id}>
          <div className="lightbox__media">
            {hasPair && view === 'compare' ? (
              <CompareSlider
                before={project.beforeAfter!.before}
                after={project.beforeAfter!.after}
                altBefore={`${project.title}: before repair`}
                altAfter={`${project.title}: after repair`}
                sizes="(min-width: 1100px) 66vw, 100vw"
                demo={false}
                className="lightbox__compare"
                label={`${project.title}: before and after`}
              />
            ) : (
              <Picture
                name={project.image}
                alt={project.alt}
                sizes="(min-width: 1100px) 66vw, 100vw"
                className="lightbox__picture"
              />
            )}
            {hasPair && (
              <div className="lightbox__toggle" role="group" aria-label="Image view">
                <button type="button" aria-pressed={view === 'compare'} onClick={() => setView('compare')}>
                  Before / After
                </button>
                <button type="button" aria-pressed={view === 'final'} onClick={() => setView('final')}>
                  Finished
                </button>
              </div>
            )}
          </div>

          <aside className="lightbox__info">
            <p className="eyebrow">{project.category}</p>
            <h2 id="lightbox-title" className="lightbox__title">
              {project.title}
            </h2>
            <p className="lightbox__desc">{project.description}</p>
            <h3 className="lightbox__subhead">Work carried out</h3>
            <ul className="lightbox__work">
              {project.work.map((w) => (
                <li key={w}>
                  <Icon name="check" size={16} strokeWidth={2} />
                  {w}
                </li>
              ))}
            </ul>
            <Button
              href="#quote"
              variant="light"
              icon="arrow-right"
              block
              onClick={(event) => {
                event.preventDefault()
                presetService(project.service)
                onClose()
                // Wait for the scroll lock to release before moving the page.
                window.setTimeout(() => scrollToSection('quote'), 40)
              }}
            >
              Get a quote for similar work
            </Button>
            <p className="lightbox__note">Concept imagery for demonstration purposes.</p>
          </aside>
        </div>
      </div>
    </div>
  )
}

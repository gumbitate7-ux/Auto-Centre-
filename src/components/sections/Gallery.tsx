import { useCallback, useMemo, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { projectCategories, projects, type ProjectCategory } from '../../data/content'
import { prefersReducedMotion } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import { Picture } from '../ui/Picture'
import { Reveal } from '../ui/Reveal'
import { Lightbox } from './Lightbox'
import './Gallery.css'

type Filter = 'All' | ProjectCategory

const withTransition = (update: () => void) => {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (doc.startViewTransition && !prefersReducedMotion()) {
    doc.startViewTransition(() => flushSync(update))
  } else {
    update()
  }
}

export function Gallery() {
  const [filter, setFilter] = useState<Filter>('All')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length }
    projectCategories.forEach((c) => (map[c] = projects.filter((p) => p.category === c).length))
    return map
  }, [])

  const close = useCallback(() => setOpenIndex(null), [])

  return (
    <section id="gallery" className="section gallery" aria-labelledby="gallery-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow section-head__eyebrow">Our Work</p>
            </Reveal>
            <Reveal as="h2" id="gallery-title" className="h2 section-head__title" delay={60}>
              Work That Speaks For Itself.
            </Reveal>
          </div>
          <Reveal className="section-head__aside" delay={140}>
            <p className="body-copy">
              A selection of accident repairs, panel work, refinishing and restorations. Open a project to see the work
              involved.
            </p>
          </Reveal>
        </div>

        <Reveal className="gallery__filters" role="group" aria-label="Filter projects by category">
          {(['All', ...projectCategories] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              className={`gallery__filter${filter === f ? ' is-active' : ''}`}
              aria-pressed={filter === f}
              onClick={() => f !== filter && withTransition(() => setFilter(f))}
            >
              {f}
              <span className="gallery__count tabular">{counts[f]}</span>
            </button>
          ))}
        </Reveal>

        <Reveal className="gallery__grid-wrap" delay={80} fade>
          <p className="visually-hidden" role="status">
            Showing {visible.length} project{visible.length === 1 ? '' : 's'}
            {filter === 'All' ? '' : `: ${filter}`}
          </p>
          <ul className="gallery__grid">
            {visible.map((project, i) => (
              <li
                key={project.id}
                className={`gallery__item gallery__item--${project.shape}`}
                style={{ '--i': i, viewTransitionName: `project-${project.id}` } as CSSProperties}
              >
                <button
                  type="button"
                  className="gallery__card"
                  onClick={() => setOpenIndex(i)}
                  aria-label={`${project.title}, ${project.category}. Open project details`}
                >
                  <span className="gallery__media">
                    <Picture
                      name={project.image}
                      alt={project.alt}
                      sizes="(min-width: 1100px) 32vw, (min-width: 640px) 48vw, 92vw"
                    />
                    <span className="gallery__overlay" aria-hidden="true">
                      <span className="gallery__view">
                        <Icon name="plus" size={18} />
                        View project
                      </span>
                      {project.beforeAfter && <span className="gallery__badge">Before / After</span>}
                    </span>
                  </span>
                  <span className="gallery__caption">
                    <span className="gallery__category">{project.category}</span>
                    <span className="gallery__title">{project.title}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
        <p className="concept-note">Concept renders for demonstration. Replace with Dino&rsquo;s own project photography.</p>
      </div>

      <Lightbox
        projects={visible}
        index={openIndex}
        onClose={close}
        onNavigate={setOpenIndex}
      />
    </section>
  )
}

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import { flushSync } from 'react-dom'
import { projectCategories, projects, type Project, type ProjectCategory } from '../../data/content'
import { prefersReducedMotion } from '../../lib/scroll'
import { Icon } from '../ui/Icon'
import { Picture } from '../ui/Picture'
import { Reveal } from '../ui/Reveal'
import { Lightbox } from './Lightbox'
import './Gallery.css'

type Filter = 'All' | ProjectCategory

/** Relative card heights (image height / width + caption) used to balance columns. */
const SHAPE_HEIGHT: Record<Project['shape'], number> = {
  portrait: 1.25 + 0.16,
  landscape: 2 / 3 + 0.16,
  wide: 10 / 16 + 0.16,
  cinema: 9 / 16 + 0.16,
}

/** Shortest-column-first masonry: keeps reading order roughly left to right. */
function toColumns(items: Project[], count: number) {
  const columns: { items: { project: Project; index: number }[]; height: number }[] = Array.from(
    { length: count },
    () => ({
      items: [],
      height: 0,
    }),
  )
  items.forEach((project, index) => {
    const target = columns.reduce((min, col) => (col.height < min.height - 0.01 ? col : min), columns[0])
    target.items.push({ project, index })
    target.height += SHAPE_HEIGHT[project.shape]
  })
  return columns
}

function useColumnCount() {
  const get = () =>
    window.matchMedia('(min-width: 1100px)').matches ? 3 : window.matchMedia('(min-width: 640px)').matches ? 2 : 1
  const [count, setCount] = useState(get)
  useEffect(() => {
    const onResize = () => setCount(get())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return count
}

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
  const [expanded, setExpanded] = useState(false)

  const visible = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)), [filter])

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: projects.length }
    projectCategories.forEach((c) => (map[c] = projects.filter((p) => p.category === c).length))
    return map
  }, [])

  const close = useCallback(() => setOpenIndex(null), [])
  const columnCount = useColumnCount()
  // On phones, show a short selection first so the quote and contact sections stay close.
  const MOBILE_PREVIEW = 4
  const collapsed = columnCount === 1 && !expanded && visible.length > MOBILE_PREVIEW
  const shown = collapsed ? visible.slice(0, MOBILE_PREVIEW) : visible
  const columns = useMemo(() => toColumns(shown, columnCount), [shown, columnCount])

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
          <div className="gallery__grid" style={{ '--cols': columnCount } as CSSProperties}>
            {columns.map((column, c) => (
              <ul key={c} className="gallery__col">
                {column.items.map(({ project, index: i }) => (
                  <li
                    key={project.id}
                    className={`gallery__item gallery__item--${project.shape}`}
                    style={{ '--i': i, viewTransitionName: `project-${project.id}` } as CSSProperties}
                  >
                    <button
                      type="button"
                      className="gallery__card"
                      onClick={() => setOpenIndex(i)}
                      aria-label={`${project.category}: ${project.title}. View project`}
                    >
                      <span className="gallery__media">
                        <Picture
                          name={project.image}
                          alt=""
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
                      <span className="gallery__caption" aria-hidden="true">
                        <span className="gallery__category">{project.category}</span>
                        <span className="gallery__title">{project.title}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </Reveal>
        {collapsed && (
          <div className="gallery__more">
            <button type="button" className="gallery__more-btn" onClick={() => setExpanded(true)}>
              Show all {visible.length} projects
              <Icon name="plus" size={16} />
            </button>
          </div>
        )}
        <p className="concept-note">
          Concept renders for demonstration. Replace with Dino&rsquo;s own project photography.
        </p>
      </div>

      <Lightbox projects={visible} index={openIndex} onClose={close} onNavigate={setOpenIndex} />
    </section>
  )
}

import { useState, type CSSProperties } from 'react'
import { comparisons } from '../../data/content'
import { CompareSlider } from '../ui/CompareSlider'
import { Icon } from '../ui/Icon'
import { Reveal } from '../ui/Reveal'
import './BeforeAfter.css'

export function BeforeAfter() {
  const [activeId, setActiveId] = useState(comparisons[0].id)
  const active = comparisons.find((c) => c.id === activeId) ?? comparisons[0]
  const activeIndex = comparisons.indexOf(active)

  return (
    <section id="work" className="section compare-section" aria-labelledby="compare-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow section-head__eyebrow">Before &amp; After</p>
            </Reveal>
            <Reveal as="h2" id="compare-title" className="h2 section-head__title" delay={60}>
              The Difference Is in the Finish.
            </Reveal>
          </div>
          <Reveal className="section-head__aside" delay={140}>
            <p className="body-copy">
              Drag across the image to compare. Damage that looks serious can often be repaired properly, and when the
              preparation is right the repair disappears.
            </p>
          </Reveal>
        </div>

        <Reveal
          className="compare-section__tabs"
          role="group"
          aria-label="Choose a comparison"
          style={{ '--tab-count': comparisons.length } as CSSProperties}
        >
          {comparisons.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={`compare-section__tab${c.id === active.id ? ' is-active' : ''}`}
              aria-pressed={c.id === active.id}
              onClick={() => setActiveId(c.id)}
            >
              <span className="tabular compare-section__tab-index">{String(i + 1).padStart(2, '0')}</span>
              {c.label}
            </button>
          ))}
          <span
            className="compare-section__tab-indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          />
        </Reveal>

        <Reveal className="compare-section__stage" delay={80}>
          <div key={active.id} className="compare-section__swap">
            <CompareSlider
              before={active.before}
              after={active.after}
              altBefore={active.alt.before}
              altAfter={active.alt.after}
              label={`${active.title}: before and after`}
            />
          </div>
        </Reveal>

        <div className="compare-section__meta">
          <div className="compare-section__details" aria-live="polite">
            <h3 className="h3">{active.title}</h3>
            <p className="body-copy">{active.text}</p>
          </div>
          <p className="compare-section__hint">
            <Icon name="chevron-left" size={16} />
            <span>Drag or use arrow keys to compare</span>
            <Icon name="chevron-right" size={16} />
          </p>
        </div>
        <p className="concept-note">
          Concept renders for demonstration. Replace with Dino&rsquo;s own project photography.
        </p>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { processSteps } from '../../data/content'
import { clamp, prefersReducedMotion, subscribeScroll } from '../../lib/scroll'
import { Reveal } from '../ui/Reveal'
import './Process.css'

export function Process() {
  const listRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(prefersReducedMotion() ? processSteps.length : 0)

  // The timeline fills as the section scrolls through the viewport.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    if (prefersReducedMotion()) {
      list.style.setProperty('--progress', '1')
      return
    }
    return subscribeScroll((_, vh) => {
      const rect = list.getBoundingClientRect()
      if (rect.bottom < -vh || rect.top > vh * 2) return
      const p = clamp((vh * 0.78 - rect.top) / (rect.height + vh * 0.25))
      list.style.setProperty('--progress', p.toFixed(4))
      // Markers sit at roughly i / n along the track.
      const reached = p <= 0.01 ? 0 : Math.min(processSteps.length, Math.floor(p * processSteps.length) + 1)
      setStep((prev) => (prev === reached ? prev : reached))
    })
  }, [])

  return (
    <section id="process" className="section process" aria-labelledby="process-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <Reveal>
              <p className="eyebrow section-head__eyebrow">How It Works</p>
            </Reveal>
            <Reveal as="h2" id="process-title" className="h2 section-head__title" delay={60}>
              A Clear Process, Start to Finish.
            </Reveal>
          </div>
          <Reveal className="section-head__aside" delay={140}>
            <p className="body-copy">
              No surprises. You will know what needs to be done, how it will be done and when your vehicle will be
              ready.
            </p>
          </Reveal>
        </div>

        <div ref={listRef} className="process__timeline" style={{ '--count': processSteps.length } as CSSProperties}>
          <span className="process__track" aria-hidden="true">
            <span className="process__fill" />
          </span>
          <ol className="process__steps">
            {processSteps.map((s, i) => (
              <li key={s.title} className={`process__step${i < step ? ' is-reached' : ''}`}>
                <span className="process__marker" aria-hidden="true">
                  <span className="process__dot" />
                </span>
                <span className="process__num tabular" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="h3 process__title">
                  <span className="visually-hidden">Step {i + 1}: </span>
                  {s.title}
                </h3>
                <p className="process__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

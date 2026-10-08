import { about } from '../../data/content'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'
import './About.css'

export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title">
      <div className="container about__grid">
        <Reveal className="about__label">
          <p className="eyebrow">About Dino&rsquo;s</p>
        </Reveal>

        <Reveal as="h2" id="about-title" className="h2 about__statement" delay={80}>
          {about.statement}
        </Reveal>

        <div className="about__body">
          {about.paragraphs.map((p, i) => (
            <Reveal as="p" key={i} className="body-copy about__para" delay={120 + i * 80}>
              {p}
            </Reveal>
          ))}
          <Reveal delay={300} className="about__cta">
            <Button href="#why" variant="ghost" icon="arrow-right">
              Our approach to every repair
            </Button>
          </Reveal>
        </div>

        <Reveal as="ul" className="about__focus" delay={200} aria-label="What we handle">
          {about.focus.map((item, i) => (
            <li key={item}>
              <span className="about__focus-index tabular">{String(i + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

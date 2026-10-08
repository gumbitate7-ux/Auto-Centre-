import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileActionBar } from './components/layout/MobileActionBar'
import { QuoteProvider } from './components/quote/QuoteContext'
import { About } from './components/sections/About'
import { BeforeAfter } from './components/sections/BeforeAfter'
import { Contact } from './components/sections/Contact'
import { CtaBand } from './components/sections/CtaBand'
import { Gallery } from './components/sections/Gallery'
import { Hero } from './components/sections/Hero'
import { Process } from './components/sections/Process'
import { QuoteSection } from './components/sections/QuoteSection'
import { Services } from './components/sections/Services'
import { TrustStrip } from './components/sections/TrustStrip'
import { WhyDinos } from './components/sections/WhyDinos'
import { useActiveSection } from './hooks/useActiveSection'

/** DOM section id -> navigation item it highlights ('' = none). */
const sectionMap: Record<string, string> = {
  home: 'home',
  about: 'about',
  services: 'services',
  why: 'why',
  work: 'work',
  gallery: 'work',
  process: '',
  quote: '',
  contact: 'contact',
}

export default function App() {
  const active = useActiveSection(sectionMap)

  return (
    <QuoteProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header active={active} />
      <main id="main">
        <Hero />
        <TrustStrip />
        <About />
        <Services />
        <WhyDinos />
        <BeforeAfter />
        <Gallery />
        <Process />
        <CtaBand />
        <QuoteSection />
        <Contact />
      </main>
      <Footer />
      <MobileActionBar />
    </QuoteProvider>
  )
}

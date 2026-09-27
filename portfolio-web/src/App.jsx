import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

// --- Everything that is on screen right now (the shell) ---------
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import CustomCursor from './components/CustomCursor'
import CommandPalette from './components/CommandPalette'
import ShortcutSheet from './components/ShortcutSheet'
import KonamiOverlay from './components/KonamiOverlay'
import BackToTop from './components/BackToTop'

// --- Our own hooks ----------------------------------------------
import useKeyboardShortcuts from './hooks/useKeyboardShortcuts'
import useKonamiCode from './hooks/useKonamiCode'

// --- Pages -------------------------------------------------------
//  Home is imported directly because it is the landing page and
//  should load instantly. Every other page is lazy loaded with
//  React.lazy, which means the browser only downloads that page's
//  code when you actually go there. Smaller first paint, faster
//  site, and it all works with the router for free.
import Home from './pages/Home'
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Journey = lazy(() => import('./pages/Journey'))
const Lab = lazy(() => import('./pages/Lab'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

// ---------------------------------------------------------------
//  ScrollToTop
// ---------------------------------------------------------------
//  Routers do NOT scroll to the top for you. Go from /contact
//  (scrolled to the bottom) to / and you would land halfway down
//  the page. This fixes that by watching the URL.
//
//  useLocation gives us a new object every time the path changes,
//  so depending on location.pathname re-runs the effect only on
//  real navigations.
// ---------------------------------------------------------------
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

// ---------------------------------------------------------------
//  PageFade
// ---------------------------------------------------------------
//  A tiny wrapper that fades the page in whenever the route
//  changes. The key is the pathname, which forces React to throw
//  away the old element and mount a fresh one, restarting the
//  CSS animation. That is why it works.
// ---------------------------------------------------------------
function PageFade({ children }) {
  const { pathname } = useLocation()
  return (
    <div className="page-fade" key={pathname}>
      {children}
    </div>
  )
}

// ---------------------------------------------------------------
//  RouteLoader
// ---------------------------------------------------------------
//  What you see while a lazy page is downloading. Suspense shows
//  this instead of the page when the promise is still pending.
// ---------------------------------------------------------------
function RouteLoader() {
  return (
    <div className="loader">
      <div className="loader-bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <p>Loading...</p>
    </div>
  )
}

// ===============================================================
//  App
// ===============================================================
export default function App() {
  // Which of the two overlay panels is open. Only one at a time.
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [konamiOpen, setKonamiOpen] = useState(false)

  const location = useLocation()

  // Close both panels when the route changes, so you do not land
  // on a new page with the palette still covering it.
  useEffect(() => {
    setPaletteOpen(false)
    setShortcutsOpen(false)
  }, [location.pathname])

  // All the global keyboard shortcuts, in one hook.
  useKeyboardShortcuts({
    onOpenPalette: () => setPaletteOpen(true),
    onOpenShortcuts: () => setShortcutsOpen(true),
  })

  // The Konami Code. It can also be triggered from the command
  // palette, which fires this custom event.
  useKonamiCode(() => setKonamiOpen(true))

  useEffect(() => {
    const tryKonami = () => setKonamiOpen(true)
    window.addEventListener('konami:try', tryKonami)
    return () => window.removeEventListener('konami:try', tryKonami)
  }, [])

  return (
    <>
      {/* Jumps to the top on every route change. Must be rendered
          to do anything at all. */}
      <ScrollToTop />

      {/* Reading progress bar, pinned to the very top */}
      <ScrollProgress />

      {/* The custom cursor sits outside everything, above all pages */}
      <CustomCursor />

      <Navbar onOpenPalette={() => setPaletteOpen(true)} />

      <main>
        <PageFade>
          {/* Suspense catches the lazy pages while they download.
              fallback is what shows in the meantime. */}
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />

              {/* The dynamic route. :id is whatever comes after
                  /projects/, and ProjectDetail reads it with
                  useParams(). One component, four pages. */}
              <Route path="/projects/:id" element={<ProjectDetail />} />

              <Route path="/journey" element={<Journey />} />
              <Route path="/lab" element={<Lab />} />
              <Route path="/contact" element={<Contact />} />

              {/* path="*" matches anything we did not list above,
                  so this is the catch-all 404. */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageFade>
      </main>

      <Footer />

      <BackToTop />

      {/* ---------- the two global panels ---------- */}
      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenShortcuts={() => {
          setPaletteOpen(false)
          setShortcutsOpen(true)
        }}
      />

      <ShortcutSheet open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />

      {/* ---------- the easter egg ---------- */}
      <KonamiOverlay open={konamiOpen} onClose={() => setKonamiOpen(false)} />
    </>
  )
}

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ListingsPage from './pages/ListingsPage'
import PropertyPage from './pages/PropertyPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import AdminProperties from './pages/admin/AdminProperties'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import ToastContainer from './components/Toast'

function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 0)
      if (y > 500 && y > last) {
        setHidden(true)
      } else if (y < last) {
        setHidden(false)
      }
      last = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* Navbar - flush at top, floats on scroll */}
      <header
        className={`fixed left-0 right-0 z-20 flex items-center justify-between border-white/10 bg-black/80 backdrop-blur-xl transition-all duration-300 ${
          hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        } ${
          scrolled
            ? 'top-4 mx-4 rounded-2xl border px-5 py-3 shadow-lg shadow-black/20 sm:mx-6 lg:mx-auto lg:max-w-6xl'
            : 'top-0 border-b px-5 py-3 sm:px-8'
        }`}
      >
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <img src="/logo.ico" alt="Kigali Home Hub" className="h-12 w-auto" />
          Kigali Home Hub
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          <Link to="/listings" className="rounded-xl px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            Listings
          </Link>
          <a
            href="https://wa.me/250784764923"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl px-3.5 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Contact on <span className="text-green-400">WhatsApp</span>
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 sm:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </header>

      {/* Spacer for fixed navbar */}
      <div className="h-[57px]" />

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          className={`fixed z-20 border border-white/10 bg-black/90 px-4 py-3 shadow-lg shadow-black/20 backdrop-blur-xl sm:hidden ${
            scrolled
              ? 'left-4 right-4 top-20 rounded-2xl'
              : 'left-0 right-0 top-[57px] border-b'
          }`}
          aria-label="Mobile navigation"
        >
          <Link to="/listings" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            Listings
          </Link>
          <a
            href="https://wa.me/250784764923"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Contact on <span className="text-green-400">WhatsApp</span>
          </a>
        </nav>
      )}

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/60 bg-white/70 text-slate-500 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-black">Kigali Home Hub</p>
              <p className="mt-1 text-xs">Find your perfect home in Kigali.</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-black">Quick Links</p>
              <div className="space-y-1.5 text-xs">
                <Link to="/" className="block transition-colors hover:text-slate-700">Home</Link>
                <Link to="/listings" className="block transition-colors hover:text-slate-700">Listings</Link>
                <a href="https://wa.me/250784764923" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-slate-700">
                  Contact on <span className="text-green-500">WhatsApp</span>
                </a>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-black">Areas We Serve</p>
              <div className="space-y-1.5 text-xs">
                <Link to="/listings?location=Kacyiru" className="block transition-colors hover:text-slate-700">Kacyiru</Link>
                <Link to="/listings?location=Nyarutarama" className="block transition-colors hover:text-slate-700">Nyarutarama</Link>
                <Link to="/listings?location=Remera" className="block transition-colors hover:text-slate-700">Remera</Link>
                <Link to="/listings?location=Kimihurura" className="block transition-colors hover:text-slate-700">Kimihurura</Link>
                <Link to="/listings?location=Kicukiro" className="block transition-colors hover:text-slate-700">Kicukiro</Link>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-black">Contact</p>
              <div className="space-y-1.5 text-xs">
                <a href="tel:+250784764923" className="block transition-colors hover:text-slate-700">+250 784 764 923</a>
                <a href="mailto:info@kigalihomehub.rw" className="block transition-colors hover:text-slate-700">info@kigalihomehub.rw</a>
                <a href="https://wa.me/250784764923" target="_blank" rel="noopener noreferrer" className="block transition-colors hover:text-slate-700">
                  <span className="text-green-500">WhatsApp</span>
                </a>
                <p>Kigali, Rwanda</p>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-200/60 pt-6 text-center text-xs">
            &copy; {new Date().getFullYear()} Kigali Home Hub
          </div>
        </div>
      </footer>

      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/property/:id" element={<PropertyPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminProperties />} />
          <Route path="properties" element={<AdminProperties />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuthActions } from '@convex-dev/auth/react'
import ToastContainer from '../Toast'

const navItems = [
  {
    path: '/admin/properties',
    label: 'Properties',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export default function AdminLayout() {
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100">
      {/* Sidebar — hidden on mobile */}
      <aside className="hidden w-64 flex-col bg-slate-900/90 text-white backdrop-blur-2xl lg:flex">
        <div className="absolute right-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Brand */}
        <div className="relative flex h-16 items-center px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-tight">Kigali Home Hub</span>
          </div>
        </div>

        <div className="mx-5 border-t border-white/10" />

        <div className="px-6 pt-6 pb-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/30">Menu</p>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/60 hover:bg-white/5 hover:text-white/80'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-white" />
                )}
                <span className={isActive ? 'text-white' : 'text-white/50'}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 pb-4">
          <div className="mb-3 mx-3 border-t border-white/10" />
          <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-[11px] font-semibold text-white shadow-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white/90">Admin</p>
              <p className="truncate text-xs text-white/40">admin@kigalihomehub.rw</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col pb-16 lg:pb-0">
        {/* Top bar — mobile + desktop */}
        <header className="flex h-14 items-center justify-end gap-4 border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-xl lg:px-8">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium text-red-500 transition-all hover:bg-red-50 active:scale-[0.97]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 p-5 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom navbar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-slate-200/60 bg-white/90 px-2 pb-safe backdrop-blur-2xl lg:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-all ${
                isActive ? 'text-slate-900' : 'text-slate-400'
              }`}
            >
              <span className={isActive ? 'text-slate-900' : 'text-slate-400'}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <ToastContainer />
    </div>
  )
}

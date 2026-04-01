import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080810' }}>
      <header className="border-b sticky top-0 z-50" style={{ borderColor: '#1e1e35', background: 'rgba(8,8,16,0.92)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-bold tracking-tight text-white">modell</span>
            <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: '#16162a', color: '#3b82f6', border: '1px solid #1e1e35' }}>
              beta
            </span>
          </NavLink>
          <nav className="flex items-center gap-1">
            {[
              { to: '/', label: 'gallery', exact: true },
              { to: '/compare', label: 'compare' },
              { to: '/timeline', label: 'timeline' },
              { to: '/build', label: 'build' },
            ].map(({ to, label, exact }) => (
              <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { background: '#16162a' } : {}
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 mt-16" style={{ borderColor: '#1e1e35' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="text-sm font-mono" style={{ color: '#3d3d6b' }}>modell · brnrot.fun</span>
          <span className="text-sm" style={{ color: '#3d3d6b' }}>LLM architectures, ranked by how unhinged they are.</span>
        </div>
      </footer>
    </div>
  )
}

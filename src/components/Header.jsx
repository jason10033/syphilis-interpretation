import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/titer', label: 'Interpret' },
  { path: '/algorithms', label: 'Algorithms' },
  { path: '/scenarios', label: 'Cases' },
  { path: '/stages', label: 'Stages' },
  { path: '/reference', label: 'Reference' },
  { path: '/about', label: 'About' },
]

const BRAND_CRIMSON = '#8B1A1A'
const BRAND_BLUE = '#5B9EC9'

// A path is "active" if it matches, or (for /algorithms) the legacy paths.
function isActive(pathname, navPath) {
  if (navPath === '/') return pathname === '/'
  if (navPath === '/algorithms') return pathname.startsWith('/algorithms') || pathname === '/traditional' || pathname === '/reverse'
  return pathname === navPath
}

export default function Header() {
  const { pathname } = useLocation()
  const [isNarrow, setIsNarrow] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const update = () => setIsNarrow(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      background: BRAND_BLUE,
      borderBottom: `3px solid ${BRAND_CRIMSON}`,
      height: 'var(--header-h)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      gap: 8,
    }}>
      <Link
        to="/"
        style={{ display: 'flex', alignItems: 'center', minWidth: 0, textDecoration: 'none', flexShrink: 0 }}
      >
        <img
          src="/ptc-logo.png"
          alt="NYC STI/HIV Prevention Training Center"
          style={{ height: 36, width: 'auto', display: 'block' }}
        />
      </Link>

      {!isNarrow && (
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          justifyContent: 'flex-end',
          margin: '0 6px',
        }}>
          {NAV.map(({ path, label }) => {
            const active = isActive(pathname, path)
            return (
              <Link
                key={path}
                to={path}
                style={{
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  color: 'white',
                  padding: '5px 8px',
                  borderRadius: 6,
                  background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                  transition: 'background 0.15s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  opacity: active ? 1 : 0.8,
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.06em',
          color: 'white',
          border: '1.5px solid rgba(255,255,255,0.5)',
          borderRadius: 4,
          padding: '3px 7px',
        }}>
          BETA
        </span>

        {isNarrow && (
          <button
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 6,
              background: open ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '1.5px solid rgba(255,255,255,0.5)',
              color: 'white',
              fontSize: 18,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            {open ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile dropdown menu */}
      {isNarrow && open && (
        <nav style={{
          position: 'absolute',
          top: 'var(--header-h)',
          left: 0,
          right: 0,
          background: BRAND_BLUE,
          borderBottom: `3px solid ${BRAND_CRIMSON}`,
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          padding: '6px 10px 12px',
          gap: 2,
        }}>
          {NAV.map(({ path, label }) => {
            const active = isActive(pathname, path)
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 15,
                  fontWeight: active ? 700 : 500,
                  color: 'white',
                  padding: '11px 12px',
                  borderRadius: 8,
                  background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                  opacity: active ? 1 : 0.9,
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      )}
    </header>
  )
}

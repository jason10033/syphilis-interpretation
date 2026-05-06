import { Link, useLocation } from 'react-router-dom'


const NAV = [
  { path: '/', label: 'Home' },
  { path: '/titer', label: 'Interpret' },
  { path: '/traditional', label: 'Traditional' },
  { path: '/reverse', label: 'Reverse' },
  { path: '/scenarios', label: 'Cases' },
  { path: '/stages', label: 'Stages' },
  { path: '/reference', label: 'Reference' },
  { path: '/about', label: 'About' },
]

const BRAND_CRIMSON = '#8B1A1A'
const BRAND_BLUE = '#5B9EC9'

export default function Header() {
  const { pathname } = useLocation()

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

      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch',
        flex: 1,
        margin: '0 6px',
      }}>
        {NAV.map(({ path, label }) => {
          const active = pathname === path
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
                opacity: active ? 1 : 0.75,
              }}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.06em',
        color: 'white',
        border: '1.5px solid rgba(255,255,255,0.5)',
        borderRadius: 4,
        padding: '3px 7px',
        flexShrink: 0,
      }}>
        BETA
      </div>
    </header>
  )
}

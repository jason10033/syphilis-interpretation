import { useNavigate } from 'react-router-dom'
import Disclaimer from '../components/Disclaimer'

const ROUTES = [
  {
    id: 'titer',
    icon: '?',
    label: 'My patient has multiple tests back and I want to interpret them',
    sublabel: 'Enter results and titers, get interpretation and next steps',
    path: '/titer',
    color: '#162447',
    bg: 'var(--primary-bg)',
    border: 'var(--primary-border)',
  },
  {
    id: 'reactive-nontreponemal',
    icon: '+',
    label: 'My patient has a reactive RPR',
    sublabel: 'Traditional algorithm: nontreponemal screen first',
    path: '/algorithms?seq=traditional',
    color: 'var(--reactive)',
    bg: 'var(--reactive-bg)',
    border: 'var(--reactive-border)',
  },
  {
    id: 'reactive-treponemal',
    icon: 'T',
    label: 'My patient has a reactive treponemal screen (EIA or CIA)',
    sublabel: 'Reverse algorithm: treponemal screen first',
    path: '/algorithms?seq=reverse',
    color: 'var(--crimson)',
    bg: 'var(--crimson-bg)',
    border: 'var(--crimson-border)',
  },
  {
    id: 'scenarios',
    icon: 'Rx',
    label: 'Walk through clinical cases',
    sublabel: 'Six common scenarios to review',
    path: '/scenarios',
    color: 'var(--negative)',
    bg: 'var(--negative-bg)',
    border: 'var(--negative-border)',
  },
  {
    id: 'stages',
    icon: 'S',
    label: 'Review syphilis stages and serology timeline',
    sublabel: 'Primary, secondary, latent, tertiary, neurosyphilis',
    path: '/stages',
    color: 'var(--primary-mid)',
    bg: 'var(--primary-bg)',
    border: 'var(--primary-border)',
  },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      padding: '32px 16px 48px',
    }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontSize: 26,
          fontWeight: 700,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          marginBottom: 8,
        }}>What syphilis results are you looking at?</h1>
        <p style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
        }}>
          Select your scenario to go directly to relevant guidance.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ROUTES.map((route) => (
          <button
            key={route.id}
            onClick={() => navigate(route.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              background: route.bg,
              border: `1px solid ${route.border}`,
              borderRadius: 'var(--radius)',
              padding: '16px 18px',
              textAlign: 'left',
              boxShadow: 'var(--shadow)',
              cursor: 'pointer',
              width: '100%',
            }}
            onTouchStart={e => e.currentTarget.style.opacity = '0.85'}
            onTouchEnd={e => e.currentTarget.style.opacity = '1'}
          >
            <span style={{
              fontSize: 13,
              fontWeight: 800,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              borderRadius: 8,
              boxShadow: 'var(--shadow)',
              flexShrink: 0,
              color: route.color,
              letterSpacing: '-0.03em',
            }}>{route.icon}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: route.color,
                lineHeight: 1.3,
                marginBottom: 2,
              }}>{route.label}</div>
              <div style={{
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}>{route.sublabel}</div>
            </div>
            <span style={{
              marginLeft: 'auto',
              color: route.color,
              opacity: 0.45,
              fontSize: 18,
              flexShrink: 0,
            }}>›</span>
          </button>
        ))}
      </div>

      <Disclaimer />
    </div>
  )
}

import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Disclaimer from '../components/Disclaimer'
import TraditionalAlgorithm from './TraditionalAlgorithm'
import ReverseAlgorithm from './ReverseAlgorithm'

const OPTIONS = [
  { value: 'traditional', label: 'Traditional (nontreponemal first)' },
  { value: 'reverse', label: 'Reverse (treponemal first)' },
]

export default function Algorithms() {
  const [searchParams] = useSearchParams()
  const initial = searchParams.get('seq') === 'reverse' ? 'reverse' : 'traditional'
  const [seq, setSeq] = useState(initial)

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px 56px' }}>
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Testing Algorithms</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Syphilis Testing Algorithms</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Choose the sequence your lab uses. Most labs run one or the other.</p>
      </div>

      {/* Sequence selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {OPTIONS.map(opt => {
          const active = seq === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => setSeq(opt.value)}
              style={{
                flex: 1,
                padding: '12px 10px',
                borderRadius: 'var(--radius-sm)',
                border: active ? '2px solid #162447' : '2px solid var(--border)',
                background: active ? '#162447' : 'var(--surface)',
                color: active ? 'white' : 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 700,
                lineHeight: 1.3,
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {opt.label}
            </button>
          )
        })}
      </div>

      {seq === 'traditional' ? <TraditionalAlgorithm /> : <ReverseAlgorithm />}

      <Disclaimer />
    </div>
  )
}

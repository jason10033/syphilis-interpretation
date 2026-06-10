import { useState } from 'react'
import Disclaimer from '../components/Disclaimer'
import { TITER_VALUES, TITER_LABELS, interpret } from '../lib/titer'

const RESULT_STYLES = {
  reactive: { bg: 'var(--reactive-bg)', border: 'var(--reactive-border)', dot: 'var(--reactive-dot)', text: 'var(--reactive)' },
  negative: { bg: 'var(--negative-bg)', border: 'var(--negative-border)', dot: 'var(--negative-dot)', text: 'var(--negative)' },
  indeterminate: { bg: 'var(--indeterminate-bg)', border: 'var(--indeterminate-border)', dot: 'var(--indeterminate-dot)', text: 'var(--indeterminate)' },
}

function OptionButton({ label, selected, onClick, color }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 8px',
        borderRadius: 10,
        border: selected ? `2px solid ${color}` : '2px solid var(--border)',
        background: selected ? color : 'var(--surface)',
        color: selected ? 'white' : 'var(--text-secondary)',
        fontWeight: 700,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.12s',
        opacity: selected === false ? 0.4 : 1,
        minWidth: 0,
      }}
    >
      {label}
    </button>
  )
}

function StepCard({ number, title, children }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{
        background: '#162447',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0,
        }}>{number}</div>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>{title}</span>
      </div>
      <div style={{ padding: '16px' }}>{children}</div>
    </div>
  )
}

function TiterSelect({ value, onChange, includeNonreactive }) {
  const options = includeNonreactive ? TITER_VALUES : TITER_VALUES.filter(v => v > 0)
  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
      style={{
        width: '100%',
        padding: '12px 14px',
        borderRadius: 10,
        border: '2px solid var(--border)',
        background: 'var(--surface)',
        fontSize: 14,
        fontWeight: 600,
        color: value !== null ? 'var(--text-primary)' : 'var(--text-muted)',
        cursor: 'pointer',
        appearance: 'none',
        WebkitAppearance: 'none',
      }}
    >
      <option value="">Select titer...</option>
      {options.map(v => (
        <option key={v} value={v}>{TITER_LABELS[v]}</option>
      ))}
    </select>
  )
}

export default function TiterInterpreter() {
  const [testType, setTestType] = useState(null)       // 'rpr' | 'syphilis-ab'
  const [treponemal, setTreponemal] = useState(null)
  const [currentTiter, setCurrentTiter] = useState(null)
  const [priorTiterType, setPriorTiterType] = useState(null)
  const [priorTiter, setPriorTiter] = useState(null)
  const [priorDate, setPriorDate] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [treated, setTreated] = useState(null)

  function reset() {
    setTestType(null)
    setTreponemal(null)
    setCurrentTiter(null)
    setPriorTiterType(null)
    setPriorTiter(null)
    setPriorDate('')
    setCurrentDate('')
    setTreated(null)
  }

  function handleTestType(val) {
    setTestType(val)
    // If syphilis Ab selected, treponemal is implicitly reactive, skip that question
    setTreponemal(val === 'syphilis-ab' ? 'reactive' : null)
    setCurrentTiter(null)
    setPriorTiterType(null)
    setPriorTiter(null)
    setPriorDate('')
    setCurrentDate('')
    setTreated(null)
  }

  function handleCurrentTiter(val) {
    setCurrentTiter(val)
    // In RPR path, treponemal is asked AFTER titer, reset it when titer changes
    if (testType === 'rpr') setTreponemal(null)
    setPriorTiterType(null)
    setPriorTiter(null)
    setPriorDate('')
    setCurrentDate('')
    setTreated(null)
  }

  function handleTreponemal(val) {
    setTreponemal(val)
    setPriorTiterType(null)
    setPriorTiter(null)
    setPriorDate('')
    setCurrentDate('')
    setTreated(null)
  }

  function handlePriorTiterType(val) {
    setPriorTiterType(val)
    setPriorTiter(null)
    setPriorDate('')
    setCurrentDate('')
    setTreated(null)
  }

  const rprPath = testType === 'rpr'
  const abPath = testType === 'syphilis-ab'

  // RPR path: titer first, then treponemal
  // Ab path: titer first (treponemal auto-set reactive), then prior RPR
  const showRPRTiter = rprPath || abPath                              // Step 1 both paths
  const showTreponemal = rprPath && currentTiter !== null             // Step 2 RPR path only
  const showPriorRPR = treponemal === 'reactive' && currentTiter !== null && currentTiter > 0
  const showPriorTiter = showPriorRPR && priorTiterType === 'reactive'
  const showTreated = showPriorTiter && priorTiter !== null

  // Step numbers
  const priorStep = rprPath ? 3 : 2
  const priorTiterStep = rprPath ? 4 : 3
  const treatedStep = rprPath ? 5 : 4

  const readyForResult = (rprPath || abPath) && (
    treponemal !== null &&
    currentTiter !== null &&
    (
      treponemal === 'nonreactive' ||
      currentTiter === 0 ||
      priorTiterType !== null
    ) &&
    (priorTiterType !== 'reactive' || (priorTiter !== null && treated !== null))
  )

  const result = readyForResult ? interpret({
    treponemal,
    currentTiter,
    priorTiterType,
    priorTiter,
    priorDate: priorDate || null,
    currentDate: currentDate || null,
    treated,
  }) : null

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 16px 56px' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Step-by-step</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>What do my results mean?</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Enter current and prior results. Interpretation and next steps appear automatically.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Step 0: Test type triage */}
        <StepCard number="?" title="What test result are you evaluating?">
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Select the test you have in hand</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <OptionButton
              label="RPR"
              selected={testType === null ? null : testType === 'rpr'}
              onClick={() => handleTestType('rpr')}
              color="var(--reactive)"
            />
            <OptionButton
              label="Syphilis Ab (EIA/CIA)"
              selected={testType === null ? null : testType === 'syphilis-ab'}
              onClick={() => handleTestType('syphilis-ab')}
              color="var(--primary-mid)"
            />
          </div>
        </StepCard>

        {/* Step 1: RPR titer (both paths) */}
        {showRPRTiter && (
          <StepCard number={1} title="Current RPR titer">
            {abPath && (
              <div style={{ fontSize: 12, color: 'var(--primary-mid)', fontWeight: 600, marginBottom: 10 }}>
                Syphilis Ab (treponemal) is reactive. Now enter the RPR result.
              </div>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Select current result</div>
            <TiterSelect value={currentTiter} onChange={handleCurrentTiter} includeNonreactive={true} />
            {currentTiter !== null && currentTiter > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Date of current RPR (optional, improves interpretation)</div>
                <input
                  type="date"
                  value={currentDate}
                  onChange={e => setCurrentDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '2px solid var(--border)',
                    background: 'var(--surface)',
                    fontSize: 14,
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            )}
          </StepCard>
        )}

        {/* Step 2: Treponemal (RPR path only, asked after titer) */}
        {showTreponemal && (
          <StepCard number={2} title="Treponemal test (EIA, CIA, TP-PA, or FTA-ABS)">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Current result</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <OptionButton
                label="Reactive"
                selected={treponemal === null ? null : treponemal === 'reactive'}
                onClick={() => handleTreponemal('reactive')}
                color="var(--reactive)"
              />
              <OptionButton
                label="Nonreactive"
                selected={treponemal === null ? null : treponemal === 'nonreactive'}
                onClick={() => handleTreponemal('nonreactive')}
                color="var(--negative)"
              />
            </div>
          </StepCard>
        )}

        {/* Prior RPR available? */}
        {showPriorRPR && (
          <StepCard number={priorStep} title="Prior RPR available?">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Most recent prior result</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <OptionButton
                label="No prior available"
                selected={priorTiterType === null ? null : priorTiterType === 'none'}
                onClick={() => handlePriorTiterType('none')}
                color="var(--indeterminate)"
              />
              <OptionButton
                label="Nonreactive"
                selected={priorTiterType === null ? null : priorTiterType === 'nonreactive'}
                onClick={() => handlePriorTiterType('nonreactive')}
                color="var(--negative)"
              />
              <OptionButton
                label="Reactive"
                selected={priorTiterType === null ? null : priorTiterType === 'reactive'}
                onClick={() => handlePriorTiterType('reactive')}
                color="var(--reactive)"
              />
            </div>
          </StepCard>
        )}

        {/* Prior titer value and date */}
        {showPriorTiter && (
          <StepCard number={priorTiterStep} title="Prior RPR titer and date">
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Prior RPR titer</div>
              <TiterSelect value={priorTiter} onChange={val => { setPriorTiter(val); setTreated(null) }} includeNonreactive={false} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>Date of prior RPR (optional)</div>
              <input
                type="date"
                value={priorDate}
                onChange={e => setPriorDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '2px solid var(--border)',
                  background: 'var(--surface)',
                  fontSize: 14,
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </StepCard>
        )}

        {/* Treated? */}
        {showTreated && (
          <StepCard number={treatedStep} title="Treated for syphilis since prior titer?">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Has the patient received syphilis treatment between the prior titer and today?</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <OptionButton
                label="Yes, treated"
                selected={treated === null ? null : treated === 'yes'}
                onClick={() => setTreated('yes')}
                color="var(--negative)"
              />
              <OptionButton
                label="No"
                selected={treated === null ? null : treated === 'no'}
                onClick={() => setTreated('no')}
                color="var(--reactive)"
              />
              <OptionButton
                label="Unknown"
                selected={treated === null ? null : treated === 'unknown'}
                onClick={() => setTreated('unknown')}
                color="var(--indeterminate)"
              />
            </div>
          </StepCard>
        )}

        {/* Result */}
        {result && (() => {
          const s = RESULT_STYLES[result.type] || RESULT_STYLES.indeterminate
          return (
            <div style={{
              background: s.bg,
              border: `2px solid ${s.border}`,
              borderRadius: 'var(--radius)',
              padding: '20px',
              boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                <span style={{ fontSize: 16, fontWeight: 700, color: s.text }}>{result.title}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{result.body}</p>
              <div style={{ borderTop: `1px solid ${s.border}`, paddingTop: 12 }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: s.text, marginBottom: 8 }}>Recommended next steps</div>
                {result.nextItems ? (
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {result.nextItems.map((item, i) => (
                      <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.next}</p>
                )}
              </div>
            </div>
          )
        })()}

        {/* Fourfold explainer */}
        {result && result.flag !== null && (
          <div style={{
            padding: '14px 16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Understanding fourfold changes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Fourfold rise (2 dilution steps up)', desc: 'Example: 1:4 to 1:16, or 1:8 to 1:32. Indicates reinfection or treatment failure. Retreat regardless of symptoms.' },
                { label: 'Fourfold decline (2 dilution steps down)', desc: 'Example: 1:32 to 1:8, or 1:16 to 1:4. Confirms adequate treatment response. Target for primary/secondary is fourfold decline within 6-12 months.' },
                { label: 'Less than fourfold change', desc: 'Not clinically significant by itself. May reflect serofast reaction, early follow-up, or stable latent infection. Context and timing determine management.' },
              ].map(({ label, desc }, i, arr) => (
                <div key={label} style={{ paddingBottom: 8, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
                  <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset */}
        {(rprPath || abPath) && (
          <button
            onClick={reset}
            style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '10px',
              cursor: 'pointer',
              marginTop: 4,
            }}
          >
            Start over
          </button>
        )}
      </div>

      <Disclaimer />
    </div>
  )
}

import { useState } from 'react'
import Disclaimer from '../components/Disclaimer'

// Dilution series. Index 0 = nonreactive.
const TITER_VALUES = [0, 1, 2, 4, 8, 16, 32, 64, 128, 256]
const TITER_LABELS = {
  0: 'Nonreactive',
  1: '1:1',
  2: '1:2',
  4: '1:4',
  8: '1:8',
  16: '1:16',
  32: '1:32',
  64: '1:64',
  128: '1:128',
  256: '1:256',
}

function dilutionSteps(from, to) {
  const fromIdx = TITER_VALUES.indexOf(from)
  const toIdx = TITER_VALUES.indexOf(to)
  return toIdx - fromIdx
}

function monthsBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1)
  const d2 = new Date(dateStr2)
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
}

function interpret({ treponemal, currentTiter, priorTiterType, priorTiter, priorDate, currentDate, treated }) {
  // Nonreactive treponemal
  if (treponemal === 'nonreactive') {
    if (currentTiter === 0) {
      return {
        type: 'negative',
        title: 'No syphilis detected',
        body: 'Nonreactive treponemal and nonreactive RPR. No serologic evidence of syphilis.',
        next: 'No treatment indicated. If primary syphilis is suspected clinically (painless ulcer, recent exposure within 90 days), serology may not yet be positive. Consider dark-field microscopy or PCR on ulcer exudate, and repeat serology in 4–6 weeks.',
        flag: null,
      }
    } else {
      return {
        type: 'negative',
        title: 'False-positive RPR',
        body: 'Reactive RPR with nonreactive treponemal test is a biologic false positive. This is not syphilis infection.',
        next: 'Do not treat for syphilis. Investigate cause of false-positive RPR (pregnancy, autoimmune disease, acute viral infection, older age, injection drug use). Document in the medical record to prevent inadvertent treatment in the future.',
        flag: null,
      }
    }
  }

  // Treponemal reactive, RPR nonreactive = discordant
  if (currentTiter === 0) {
    return {
      type: 'indeterminate',
      title: 'Discordant result: treponemal reactive, RPR nonreactive',
      body: 'This pattern has three explanations: (1) past treated syphilis with RPR that has declined to nonreactive; (2) very early primary syphilis before the RPR has risen; (3) false-positive treponemal screen. Without documented prior treatment, this result should prompt treatment, not observation.',
      next: 'If prior adequate treatment is not clearly documented in the medical record: treat as late latent syphilis (benzathine penicillin G 2.4M units IM weekly × 3 doses). Do not defer treatment while awaiting TP-PA confirmation. Order TP-PA in parallel to confirm exposure. If prior treatment is well-documented and the patient has no new symptoms or exposures, repeat RPR in 6 months rather than retreating.',
      flag: null,
    }
  }

  // Treponemal reactive, RPR reactive — no prior for comparison
  if (priorTiterType === 'none') {
    const tierNote = currentTiter >= 32
      ? `RPR ${TITER_LABELS[currentTiter]}: high titer. This may represent new or active infection, but staging by history and prior testing is still required.`
      : `RPR ${TITER_LABELS[currentTiter]}: this result is consistent with either new infection or previously treated syphilis. Do not assume stage without clinical history and prior testing.`
    return {
      type: 'reactive',
      title: 'Reactive syphilis serology: staging required',
      body: `Both treponemal and RPR are reactive. No prior RPR is available for comparison. ${tierNote}`,
      nextItems: [
        'Ask about prior syphilis diagnosis and any documented treatment',
        'Assess recent sexual exposures and pre-test probability',
        'Obtain prior testing and treatment history from DOH if available',
        'Assess for symptoms: painless ulcer, diffuse rash (especially palms/soles), mucous patches, condyloma lata, lymphadenopathy',
        'Treatment: Most commonly default to late latent / latent of unknown duration and treat with benzathine penicillin G 2.4M units IM weekly x 3 doses.',
      ],
      flag: null,
    }
  }

  // Prior was nonreactive, now reactive = new seroconversion
  if (priorTiterType === 'nonreactive') {
    return {
      type: 'reactive',
      title: 'New seroconversion: RPR newly reactive',
      body: `RPR was previously nonreactive and is now reactive at ${TITER_LABELS[currentTiter]}. This represents new T. pallidum infection.`,
      next: 'Treat as early syphilis (benzathine penicillin G 2.4M units IM × 1 dose). Offer partner services and notify partners from the prior 3–12 months depending on stage. Screen for HIV and other STIs. Repeat RPR at 6 and 12 months to confirm fourfold decline.',
      flag: null,
    }
  }

  // Both prior and current titers: calculate change
  const steps = dilutionSteps(priorTiter, currentTiter)
  const months = priorDate && currentDate ? monthsBetween(priorDate, currentDate) : null

  if (steps >= 2) {
    const timeNote = months !== null ? ` The prior titer was ${months} month${months === 1 ? '' : 's'} ago.` : ''
    const context = treated === 'yes'
      ? 'Given prior treatment, a fourfold rise most likely represents reinfection. Reinfection is far more common than true treatment failure.'
      : treated === 'no'
        ? 'The patient was not previously treated. This rise may reflect disease progression or worsening latent infection.'
        : 'Treatment history is unknown. Approach as reinfection or treatment failure until clarified.'
    return {
      type: 'reactive',
      title: 'Fourfold or greater rise: reinfection or treatment failure',
      body: `RPR rose from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]} (${steps} dilution step${steps === 1 ? '' : 's'} up, a ${Math.pow(2, steps)}-fold increase).${timeNote} ${context}`,
      next: 'Retreat as early syphilis: benzathine penicillin G 2.4M units IM × 1 dose if reinfection is likely. Perform lumbar puncture if any neurologic or ophthalmic symptoms are present, if the patient is HIV-positive, or if stage is uncertain. Do not wait for LP before treating if LP cannot be done promptly. Offer partner services. Screen for HIV. Repeat RPR in 6 months to confirm decline.',
      flag: 'rise',
    }
  }

  if (steps <= -2) {
    const timeNote = months !== null ? ` (${months} month${months === 1 ? '' : 's'} since prior titer)` : ''
    let adequacy = 'This is consistent with an adequate treatment response.'
    if (months !== null) {
      if (months <= 12 && currentTiter <= 4) adequacy = 'Fourfold decline achieved within 12 months: excellent treatment response.'
      else if (months > 24 && currentTiter > 4) adequacy = 'Decline is adequate but titer remains above 1:4 after more than 2 years. Lumbar puncture should be strongly considered to exclude neurosyphilis if not previously done.'
    }
    return {
      type: 'negative',
      title: 'Fourfold or greater decline: adequate treatment response',
      body: `RPR declined from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]}${timeNote} (${Math.abs(steps)} dilution step${Math.abs(steps) === 1 ? '' : 's'} down, a ${Math.pow(2, Math.abs(steps))}-fold decrease). ${adequacy}`,
      next: currentTiter === 0
        ? 'RPR is now nonreactive. Continue monitoring at scheduled intervals. For primary/secondary: recheck at 12 months. For late latent: recheck at 24 months. Treponemal tests remain reactive for life and should not be used to assess treatment response.'
        : `RPR is still reactive at ${TITER_LABELS[currentTiter]}. Continue monitoring. For primary/secondary syphilis, the target is nonreactive or 1:1–1:4 within 12–24 months. For late latent, a stable low titer (serofast) is acceptable if fourfold decline has been achieved. If RPR rises fourfold at any future visit, evaluate for reinfection.`,
      flag: 'decline',
    }
  }

  // Less than fourfold change in either direction
  const direction = steps > 0 ? 'risen' : steps < 0 ? 'fallen' : 'unchanged'
  const changeNote = steps === 0
    ? `RPR is unchanged at ${TITER_LABELS[currentTiter]}.`
    : `RPR has ${direction} by ${Math.abs(steps)} dilution step from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]}: less than a fourfold change.`
  const timeNote = months !== null ? ` (${months} month${months === 1 ? '' : 's'} since prior titer)` : ''

  let interpretation = ''
  let next = ''

  if (treated === 'yes') {
    if (months !== null && months >= 12 && currentTiter <= 4) {
      interpretation = `${changeNote}${timeNote} Low stable titer after treatment: consistent with serofast reaction.`
      next = 'A serofast RPR (low stable titer persisting after adequate treatment) does not indicate treatment failure. No retreatment is needed in the absence of new symptoms, new exposures, or a rising titer. Document the serofast baseline clearly to prevent unnecessary retreatment at future visits. Continue annual monitoring.'
    } else if (months !== null && months < 6) {
      interpretation = `${changeNote}${timeNote} It is too early to determine adequacy of treatment response.`
      next = 'Fourfold decline is expected within 6-12 months for primary/secondary syphilis, and 12-24 months for late latent. Recheck at the appropriate interval. If titer rises fourfold or fails to decline fourfold within 12 months, evaluate urgently for reinfection or treatment failure. Do not continue routine monitoring without action.'
    } else if (months !== null && months >= 12 && currentTiter > 4) {
      interpretation = `${changeNote}${timeNote} Titer has not declined fourfold after more than 12 months: likely treatment failure or reinfection. Action is required.`
      next = 'Do not continue monitoring without intervention. Evaluate for reinfection (new exposure history, new partner). Perform lumbar puncture to exclude neurosyphilis. If no new exposure and no neurosyphilis: retreat with benzathine penicillin G 2.4M units IM weekly × 3 doses. If reinfection is likely: treat as early syphilis (single dose). Repeat RPR 6 months after retreatment.'
    } else {
      interpretation = `${changeNote}${timeNote} Titer is stable. Treatment response cannot yet be fully assessed.`
      next = 'Continue monitoring RPR at scheduled intervals. If titer does not achieve fourfold decline within 12 months of treatment for primary/secondary syphilis (or 24 months for late latent), evaluate for failure or reinfection. Do not simply continue observation. If titer rises fourfold at any point, treat promptly.'
    }
  } else if (treated === 'no') {
    interpretation = `${changeNote}${timeNote} Stable titer in an untreated patient.`
    next = 'Stable serology in untreated syphilis does not mean the infection is clinically inactive. This likely represents latent infection. Treat without delay. Stage by clinical history. If stage is unclear, treat as late latent or unknown duration (benzathine penicillin G 2.4M units IM weekly × 3 doses). Perform LP if any neurologic or ophthalmic symptoms are present.'
  } else {
    interpretation = `${changeNote}${timeNote} Stable titer with unknown treatment history.`
    next = 'Do not defer treatment pending further history. Treat as late latent syphilis (benzathine penicillin G 2.4M units IM weekly × 3 doses) unless early syphilis can be confirmed by history. Monitor RPR at 6, 12, and 24 months after treatment.'
  }

  return {
    type: 'indeterminate',
    title: 'Stable titer: less than fourfold change',
    body: interpretation,
    next,
    flag: 'stable',
  }
}

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
    // If syphilis Ab selected, treponemal is implicitly reactive — skip that question
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
    // In RPR path, treponemal is asked AFTER titer — reset it when titer changes
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
                { label: 'Fourfold decline (2 dilution steps down)', desc: 'Example: 1:32 to 1:8, or 1:16 to 1:4. Confirms adequate treatment response. Target for primary/secondary is fourfold decline within 6–12 months.' },
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

      <Disclaimer source="Workowski KA et al. MMWR Recomm Rep 2021;70(4):1-187." />
    </div>
  )
}

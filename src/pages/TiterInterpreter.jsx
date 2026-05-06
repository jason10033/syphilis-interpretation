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
  // dateStr1 is older, dateStr2 is newer
  const d1 = new Date(dateStr1)
  const d2 = new Date(dateStr2)
  const months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
  return months
}

function interpret({ treponemal, currentTiter, priorTiterType, priorTiter, priorDate, currentDate, treated }) {
  // No treponemal = no syphilis basis
  if (treponemal === 'nonreactive') {
    if (currentTiter === 0) {
      return {
        type: 'negative',
        title: 'No syphilis detected',
        body: 'Nonreactive treponemal and nonreactive RPR. No evidence of syphilis.',
        next: 'No treatment needed. If primary syphilis is suspected clinically (painless ulcer, recent exposure), dark-field microscopy or PCR on the lesion can detect T. pallidum before serology turns positive. Repeat serology in 4-6 weeks if exposure was recent.',
        flag: null,
      }
    } else {
      return {
        type: 'negative',
        title: 'False-positive RPR',
        body: 'Reactive RPR with nonreactive treponemal test = biologic false positive. No syphilis infection.',
        next: 'No syphilis treatment. Investigate cause of false-positive RPR (pregnancy, autoimmune disease, acute viral infection, older age, IV drug use). Document in the medical record.',
        flag: null,
      }
    }
  }

  // Treponemal reactive, current RPR nonreactive
  if (currentTiter === 0) {
    return {
      type: 'indeterminate',
      title: 'Discordant result: treponemal reactive, RPR nonreactive',
      body: 'This pattern has three possible explanations: (1) past treated syphilis with RPR that has declined to nonreactive; (2) very early primary syphilis before the RPR has risen; (3) false-positive treponemal screen.',
      next: 'If no second treponemal test (TP-PA) has been done, order one to resolve. If TP-PA is also reactive with no documented prior treatment, treat as late latent syphilis (benzathine penicillin G 2.4M units IM weekly x 3 doses). If prior treatment is documented and TP-PA reactive, this is consistent with past treated syphilis: no retreatment needed unless RPR rises.',
      flag: null,
    }
  }

  // Treponemal reactive, current RPR reactive: now interpret with prior context
  if (priorTiterType === 'none') {
    // New diagnosis, no prior for comparison
    const stage = currentTiter >= 32
      ? 'The high titer (1:32 or greater) suggests active early infection (primary, secondary, or early latent).'
      : currentTiter >= 8
        ? 'The titer may reflect active early or late infection. Stage by clinical history.'
        : 'The low titer may reflect late latent, past treated, or early infection. Stage carefully.'
    return {
      type: 'reactive',
      title: 'Reactive syphilis serology: new diagnosis or no prior on file',
      body: `Both treponemal and nontreponemal tests are reactive. ${stage} No prior titer available for comparison.`,
      next: 'Stage by clinical history: ask about prior diagnosis, prior treatment, prior serology, symptoms (ulcer, rash), and epidemiologic exposure history. Treat by stage. This RPR titer becomes the new baseline for monitoring treatment response.',
      flag: null,
    }
  }

  if (priorTiterType === 'nonreactive') {
    // Was nonreactive before, now reactive
    return {
      type: 'reactive',
      title: 'New seroconversion: RPR newly reactive',
      body: `RPR was previously nonreactive and is now reactive at ${TITER_LABELS[currentTiter]}. This represents new infection with T. pallidum.`,
      next: 'Treat as early syphilis. Stage by clinical history and titer. If titer is 1:8 or greater or symptoms are present, treat as primary or secondary (benzathine penicillin G 2.4M units IM x 1 dose). Offer partner services. Screen for HIV and other STIs.',
      flag: null,
    }
  }

  // Both prior and current titers exist: calculate change
  const steps = dilutionSteps(priorTiter, currentTiter)
  const months = priorDate && currentDate ? monthsBetween(priorDate, currentDate) : null

  if (steps >= 2) {
    // Fourfold or greater rise
    const timeNote = months !== null ? ` The prior titer was ${months} month${months === 1 ? '' : 's'} ago.` : ''
    const reinfectionVsFailure = treated === 'yes'
      ? 'Given prior treatment, a fourfold rise most likely represents reinfection rather than treatment failure.'
      : treated === 'no'
        ? 'The patient was not previously treated. This rise may reflect disease progression.'
        : 'Treatment history is unknown. Consider both reinfection and treatment failure.'
    return {
      type: 'reactive',
      title: 'Fourfold or greater rise in RPR: reinfection or treatment failure',
      body: `RPR rose from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]} (${steps} dilution step${steps === 1 ? '' : 's'} up, representing a ${Math.pow(2, steps)}-fold increase).${timeNote} ${reinfectionVsFailure}`,
      next: 'Retreat as early syphilis: benzathine penicillin G 2.4M units IM x 1 dose if within 1 year of likely reinfection. Perform lumbar puncture if neurologic or ophthalmic symptoms are present. Offer partner services. Screen for HIV. Repeat RPR in 6 months to confirm decline.',
      flag: 'rise',
    }
  }

  if (steps <= -2) {
    // Fourfold or greater decline
    const timeNote = months !== null ? ` (${months} month${months === 1 ? '' : 's'} since prior titer)` : ''
    let adequacy = 'This is consistent with an adequate treatment response.'
    if (months !== null) {
      if (months <= 12 && currentTiter <= 4) adequacy = 'Fourfold decline achieved within 12 months: excellent treatment response.'
      else if (months > 24 && currentTiter > 4) adequacy = 'Decline is adequate but titer remains elevated after more than 2 years. Consider LP to rule out neurosyphilis if not previously done.'
    }
    return {
      type: 'negative',
      title: 'Fourfold or greater decline in RPR: adequate treatment response',
      body: `RPR declined from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]}${timeNote} (${Math.abs(steps)} dilution step${Math.abs(steps) === 1 ? '' : 's'} down, representing a ${Math.pow(2, Math.abs(steps))}-fold decrease). ${adequacy}`,
      next: currentTiter === 0
        ? 'RPR is now nonreactive. Continue monitoring at scheduled intervals. For primary/secondary: recheck at 12 months. For late latent: recheck at 24 months. Treponemal tests will remain reactive for life.'
        : `RPR is still reactive at ${TITER_LABELS[currentTiter]}. Continue monitoring. For primary/secondary syphilis, expect the RPR to reach its nadir (often nonreactive or 1:1 to 1:4) within 12-24 months of treatment. For late latent, titers may stabilize at a low level (serofast).`,
      flag: 'decline',
    }
  }

  // Stable: less than fourfold change in either direction
  const direction = steps > 0 ? 'risen' : steps < 0 ? 'fallen' : 'unchanged'
  const changeNote = steps === 0
    ? `RPR is unchanged at ${TITER_LABELS[currentTiter]}.`
    : `RPR has ${direction} by ${Math.abs(steps)} dilution step (${steps > 0 ? '+' : ''}${steps}) from ${TITER_LABELS[priorTiter]} to ${TITER_LABELS[currentTiter]}: less than a fourfold change.`

  const timeNote = months !== null ? ` (${months} month${months === 1 ? '' : 's'} since prior titer)` : ''

  let interpretation = ''
  let next = ''

  if (treated === 'yes') {
    if (months !== null && months >= 12 && currentTiter <= 4) {
      interpretation = `${changeNote}${timeNote} Low stable titer after treatment: consistent with serofast reaction.`
      next = 'A serofast RPR (low stable titer persisting after adequate treatment) does not indicate treatment failure. No retreatment needed in the absence of symptoms or rising titer. Continue annual RPR monitoring. Document serofast status to avoid unnecessary retreatment in the future.'
    } else if (months !== null && months < 6) {
      interpretation = `${changeNote}${timeNote} It is too early to determine adequacy of treatment response.`
      next = 'Adequate treatment response is defined as a fourfold decline within 6-12 months for primary/secondary syphilis, and 12-24 months for late latent. Recheck RPR at the appropriate interval. If titer rises fourfold or fails to decline fourfold by 12 months, evaluate for treatment failure or reinfection.'
    } else if (months !== null && months >= 12 && currentTiter > 4) {
      interpretation = `${changeNote}${timeNote} Titer has not declined fourfold after more than 12 months: possible treatment failure.`
      next = 'Evaluate for reinfection (new exposure history) vs. treatment failure. Perform lumbar puncture to rule out neurosyphilis. If no new exposure and no neurosyphilis: retreat with benzathine penicillin G 2.4M units IM weekly x 3 doses. If reinfection is likely, treat as early syphilis (single dose).'
    } else {
      interpretation = `${changeNote}${timeNote} Titer is stable. This may represent an adequate early response, serofast reaction, or insufficient follow-up time.`
      next = 'Continue monitoring RPR at scheduled intervals. Flag for possible treatment failure if titer does not decline fourfold within 12 months of treatment for primary/secondary syphilis (or 24 months for late latent). If titer rises fourfold at any point, treat for reinfection or failure.'
    }
  } else if (treated === 'no') {
    interpretation = `${changeNote}${timeNote} Titer is stable in an untreated patient.`
    next = 'The patient has not been treated. Stable serology in untreated syphilis does not mean the infection is inactive; it may represent latent syphilis. Stage by clinical history and treat accordingly. Late latent or unknown duration: benzathine penicillin G 2.4M units IM weekly x 3 doses.'
  } else {
    interpretation = `${changeNote}${timeNote} Titer is stable.`
    next = 'Determine whether the patient was previously treated. If treatment history is uncertain, treat as late latent syphilis (benzathine penicillin G 2.4M units IM weekly x 3 doses). Monitor RPR at 6, 12, and 24 months after treatment.'
  }

  return {
    type: treated === 'yes' && months !== null && months >= 12 && currentTiter <= 4 ? 'indeterminate' : 'indeterminate',
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
  info: { bg: 'var(--primary-bg)', border: 'var(--primary-border)', dot: 'var(--primary-mid)', text: 'var(--primary-mid)' },
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

function StepCard({ number, title, children, dimmed }) {
  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      opacity: dimmed ? 0.4 : 1,
      pointerEvents: dimmed ? 'none' : 'auto',
      transition: 'opacity 0.15s',
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
  const [treponemal, setTreponemal] = useState(null)
  const [currentTiter, setCurrentTiter] = useState(null)
  const [priorTiterType, setPriorTiterType] = useState(null)
  const [priorTiter, setPriorTiter] = useState(null)
  const [priorDate, setPriorDate] = useState('')
  const [currentDate, setCurrentDate] = useState('')
  const [treated, setTreated] = useState(null)

  function reset() {
    setTreponemal(null)
    setCurrentTiter(null)
    setPriorTiterType(null)
    setPriorTiter(null)
    setPriorDate('')
    setCurrentDate('')
    setTreated(null)
  }

  function handleTreponemal(val) {
    setTreponemal(val)
    setCurrentTiter(null)
    setPriorTiterType(null)
    setPriorTiter(null)
    setPriorDate('')
    setCurrentDate('')
    setTreated(null)
  }

  function handleCurrentTiter(val) {
    setCurrentTiter(val)
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

  // When to show each step
  const showStep2 = treponemal !== null
  const showStep3 = treponemal === 'reactive' && currentTiter !== null && currentTiter > 0
  const showStep4 = showStep3 && priorTiterType === 'reactive'
  const showStep5 = showStep3 && (priorTiterType === 'reactive' || priorTiterType === 'nonreactive')

  // Ready to interpret
  const readyForResult = (
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

        {/* Step 1: Treponemal */}
        <StepCard number={1} title="Treponemal test (EIA, CIA, TP-PA, or FTA-ABS)">
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

        {/* Step 2: Current RPR */}
        {showStep2 && (
          <StepCard number={2} title="Current RPR (nontreponemal) titer">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Select current result</div>
            <TiterSelect value={currentTiter} onChange={handleCurrentTiter} includeNonreactive={true} />
            {currentDate !== undefined && currentTiter !== null && currentTiter > 0 && (
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

        {/* Step 3: Prior RPR */}
        {showStep3 && (
          <StepCard number={3} title="Prior RPR on file?">
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Most recent prior result</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <OptionButton
                label="No prior"
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

        {/* Step 4: Prior titer value and dates */}
        {showStep4 && (
          <StepCard number={4} title="Prior RPR titer and date">
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

        {/* Step 5: Treated? (only needed when prior reactive titer is selected) */}
        {showStep4 && priorTiter !== null && (
          <StepCard number={5} title="Treated for syphilis since prior titer?">
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
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: s.text, marginBottom: 6 }}>Recommended next steps</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.next}</p>
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
                { label: 'Less than fourfold change', desc: 'Not clinically significant by itself. May reflect serofast reaction (low stable post-treatment titer), early follow-up, or stable latent infection. Context determines management.' },
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
        {treponemal !== null && (
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

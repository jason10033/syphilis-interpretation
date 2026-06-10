import Disclaimer from '../components/Disclaimer'

const STAGES = [
  {
    id: 'primary',
    name: 'Primary Syphilis',
    timing: 'Incubation: 10-90 days (average 21 days)',
    color: 'var(--reactive)',
    bg: 'var(--reactive-bg)',
    border: 'var(--reactive-border)',
    dot: 'var(--reactive-dot)',
    symptoms: [
      'Painless ulcer (chancre) at site of inoculation',
      'Indurated, clean base, non-tender edges',
      'Regional lymphadenopathy (firm, non-tender)',
      'Chancre heals spontaneously in 3-6 weeks without treatment',
      'May be missed if internal (cervix, rectum, pharynx)',
    ],
    serology: [
      { test: 'Treponemal (EIA/TP-PA)', result: 'Reactive (becomes positive first, within days of chancre)' },
      { test: 'RPR/VDRL', result: 'May be nonreactive early; becomes reactive within 1-2 weeks of chancre' },
    ],
    notes: 'Both treponemal and nontreponemal tests may be nonreactive in very early primary. If suspicion is high and serology is negative, repeat in 2-4 weeks or use dark-field microscopy or PCR on ulcer exudate.',
  },
  {
    id: 'secondary',
    name: 'Secondary Syphilis',
    timing: 'Onset: 4-10 weeks after primary chancre appears',
    color: 'var(--reactive)',
    bg: 'var(--reactive-bg)',
    border: 'var(--reactive-border)',
    dot: 'var(--reactive-dot)',
    symptoms: [
      'Diffuse maculopapular rash, classically involving palms and soles',
      'Condyloma lata (moist, flat, gray-white papules in moist areas)',
      'Mucous patches (painless white patches in mouth or genitals)',
      'Systemic symptoms: fever, malaise, lymphadenopathy, headache',
      'Patchy alopecia ("moth-eaten" appearance)',
      'Symptoms resolve spontaneously without treatment in 3-12 weeks',
    ],
    serology: [
      { test: 'RPR/VDRL', result: 'Reactive at highest titers (often 1:32 or greater)' },
      { test: 'Treponemal (EIA/TP-PA)', result: 'Reactive' },
    ],
    notes: 'RPR titers peak in secondary syphilis. A prozone phenomenon (false-negative RPR due to antibody excess) can occur at very high titers; request dilutions if clinical suspicion is high despite a nonreactive result.',
  },
  {
    id: 'early-latent',
    name: 'Early Latent Syphilis',
    timing: 'Within 1 year of initial infection',
    color: 'var(--indeterminate)',
    bg: 'var(--indeterminate-bg)',
    border: 'var(--indeterminate-border)',
    dot: 'var(--indeterminate-dot)',
    symptoms: [
      'No signs or symptoms',
      'Reactive serology only',
      'Patient may recall a prior chancre or rash',
      'Sexual transmission is still possible in early latent',
    ],
    serology: [
      { test: 'RPR/VDRL', result: 'Reactive (titer variable)' },
      { test: 'Treponemal (EIA/TP-PA)', result: 'Reactive' },
    ],
    notes: 'Stage assigned based on exposure history, prior serology, or clinical history of a recent chancre or rash within the past year. If staging is uncertain, treat as late latent.',
  },
  {
    id: 'late-latent',
    name: 'Late Latent Syphilis',
    timing: '1 year or more after initial infection',
    color: 'var(--indeterminate)',
    bg: 'var(--indeterminate-bg)',
    border: 'var(--indeterminate-border)',
    dot: 'var(--indeterminate-dot)',
    symptoms: [
      'No signs or symptoms',
      'Reactive serology only',
      'Sexual transmission unlikely',
      'Risk of progression to tertiary syphilis if untreated',
    ],
    serology: [
      { test: 'RPR/VDRL', result: 'Reactive, often at low titer (1:1 to 1:4)' },
      { test: 'Treponemal (EIA/TP-PA)', result: 'Reactive' },
    ],
    notes: 'If staging cannot be established (no prior serology, unclear history), treat as late latent. Requires 3 weekly doses of benzathine penicillin G rather than a single dose.',
  },
  {
    id: 'tertiary',
    name: 'Tertiary Syphilis',
    timing: 'Years to decades after initial infection (in untreated patients)',
    color: '#7C3AED',
    bg: '#F5F3FF',
    border: '#C4B5FD',
    dot: '#8B5CF6',
    symptoms: [
      'Gummatous syphilis: destructive granulomatous lesions of skin, bone, or viscera',
      'Cardiovascular syphilis: aortitis, aortic aneurysm, aortic regurgitation',
      'Not infectious; does not involve the CNS (vs. neurosyphilis)',
      'Rare in the antibiotic era',
    ],
    serology: [
      { test: 'RPR/VDRL', result: 'Variable; may be low titer or nonreactive' },
      { test: 'Treponemal (EIA/TP-PA)', result: 'Reactive' },
    ],
    notes: 'Tertiary syphilis is diagnosed clinically with supportive serology. A nonreactive RPR does not exclude tertiary syphilis. Requires 3 weekly doses of benzathine penicillin G.',
  },
  {
    id: 'neuro',
    name: 'Neurosyphilis',
    timing: 'Can occur at any stage of infection',
    color: 'var(--crimson)',
    bg: 'var(--crimson-bg)',
    border: 'var(--crimson-border)',
    dot: 'var(--crimson)',
    symptoms: [
      'Early: asymptomatic (detected by CSF analysis only)',
      'Meningitis: headache, neck stiffness, photophobia',
      'Meningovascular: stroke syndromes in young patients',
      'Late parenchymal: dementia, personality change, Argyll Robertson pupils (accommodate but do not react to light), tabes dorsalis (dorsal column disease)',
      'Ocular syphilis: uveitis, optic neuritis, retinitis (any stage)',
      'Otosyphilis: sensorineural hearing loss, tinnitus (any stage)',
    ],
    serology: [
      { test: 'Serum RPR', result: 'Usually reactive; titer variable' },
      { test: 'CSF-VDRL', result: 'Reactive: highly specific, confirms neurosyphilis. Nonreactive does not exclude it (sensitivity ~50-60%)' },
      { test: 'CSF WBC', result: 'Greater than 5 cells/uL supports CNS inflammation; treat as neurosyphilis' },
    ],
    notes: 'Perform lumbar puncture in all patients with neurologic or ophthalmic symptoms, or when serum RPR is 1:32 or greater with unclear stage. IV penicillin G is required (IM benzathine penicillin does not achieve treponemicidal CSF levels). HIV co-infection increases neurosyphilis risk.',
  },
]

const SEROLOGY_TIMELINE = [
  { label: 'Days 1-10', rpr: 'Nonreactive', trep: 'Nonreactive or early reactive', note: 'Incubation period. No serologic markers detectable.' },
  { label: 'Days 10-21', rpr: 'Nonreactive or borderline', trep: 'Becoming reactive', note: 'Chancre may appear. Treponemal test turns positive first.' },
  { label: 'Weeks 3-6', rpr: 'Reactive (rising)', trep: 'Reactive', note: 'Classic primary stage: both tests positive; titer rising.' },
  { label: 'Weeks 6-24', rpr: 'Reactive, titer peak', trep: 'Reactive', note: 'Secondary stage. RPR at highest titer. Systemic symptoms.' },
  { label: 'After treatment', rpr: 'Declining (expect fourfold drop in 6-12 months)', trep: 'Remains reactive lifelong', note: 'Nontreponemal titer declines with treatment. Treponemal test stays positive forever.' },
  { label: 'Late/Latent (untreated)', rpr: 'Low titer or nonreactive', trep: 'Reactive', note: 'RPR can decline spontaneously over years. Treponemal test remains reactive.' },
]

export default function Stages() {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px 56px' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Clinical Reference</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Syphilis Stages and Serology</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Each stage has distinct clinical features, serologic patterns, and treatment implications.
        </p>
      </div>

      {/* Stage cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
        {STAGES.map(stage => (
          <div
            key={stage.id}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderLeft: `4px solid ${stage.dot}`,
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
            }}
          >
            <div style={{
              padding: '14px 16px 10px',
              borderBottom: '1px solid var(--border)',
              background: stage.bg,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: stage.color }}>{stage.name}</h2>
              </div>
              <p style={{ fontSize: 11, color: stage.color, opacity: 0.8, marginTop: 2, fontWeight: 600 }}>{stage.timing}</p>
            </div>

            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Clinical Features</div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 5 }}>
                {stage.symptoms.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: stage.dot, flexShrink: 0, marginTop: 5 }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>Expected Serology</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {stage.serology.map(({ test, result }) => (
                  <div key={test} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0, minWidth: 120 }}>{test}:</span>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '10px 16px', background: 'var(--background)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{stage.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Serology timeline */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        marginBottom: 20,
      }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', background: 'var(--background)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>Serologic Timeline After Infection</h2>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>How RPR and treponemal tests change over the course of untreated infection</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '90px 1fr 1fr',
          background: '#162447',
        }}>
          {['Time', 'RPR/VDRL', 'Treponemal (EIA/TP-PA)'].map((h, i) => (
            <div key={h} style={{ padding: '8px 10px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</div>
            </div>
          ))}
        </div>

        {SEROLOGY_TIMELINE.map((row, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '90px 1fr 1fr',
              borderTop: '1px solid var(--border)',
              background: i % 2 === 0 ? 'var(--surface)' : 'var(--background)',
            }}
          >
            <div style={{ padding: '10px 10px', borderRight: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>{row.label}</span>
            </div>
            <div style={{ padding: '10px 10px', borderRight: '1px solid var(--border)' }}>
              <span style={{ fontSize: 11, color: 'var(--reactive)', fontWeight: row.rpr.includes('Reactive') ? 600 : 400 }}>{row.rpr}</span>
            </div>
            <div style={{ padding: '10px 10px' }}>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{row.trep}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Treatment response key concept */}
      <div style={{
        padding: '16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        marginBottom: 20,
      }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>RPR After Treatment: Key Milestones</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: 'Adequate response', desc: 'Fourfold (2 dilution) decline in RPR titer within 6-12 months. Example: 1:16 drops to 1:4 or lower. Check at 6 and 12 months for primary/secondary; 6, 12, and 24 months for late latent. Titer may take longer to decline in late latent; a fourfold decline by 24 months is the target.' },
            { label: 'Serofast reaction', desc: 'Low stable RPR titer (often 1:1 to 1:4) that persists after adequate treatment without further decline. Does not indicate treatment failure in the absence of clinical symptoms or a rising titer. Most common in patients treated for late latent or unknown-duration syphilis, and in those treated late in the course of early syphilis. Document the serofast state to prevent unnecessary retreatment at future visits.' },
            { label: 'Reinfection', desc: 'Fourfold or greater rise in RPR titer after a documented decline, with a plausible new exposure history. By far the more common cause of a rising titer compared to treatment failure. Treat as early syphilis (benzathine penicillin G 2.4M units IM x 1 dose). Offer partner services. Perform LP if neurologic or ophthalmic symptoms are present.' },
            { label: 'Treatment failure', desc: 'Failure of RPR to decline fourfold within 12 months (primary/secondary) or 24 months (late latent) despite adequate treatment, or a fourfold rise without new exposure. Much less common than reinfection. Perform LP to exclude neurosyphilis before retreating. Retreat with benzathine penicillin G 2.4M units IM weekly x 3 doses if no neurosyphilis and no clear reinfection.' },
          ].map(({ label, desc }, i, arr) => (
            <div key={label} style={{ paddingBottom: 10, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}

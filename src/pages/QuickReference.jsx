import Disclaimer from '../components/Disclaimer'

const TYPE_STYLES = {
  reactive: { dot: 'var(--reactive-dot)', bg: 'var(--reactive-bg)', border: 'var(--reactive-border)', text: 'var(--reactive)' },
  negative: { dot: 'var(--negative-dot)', bg: 'var(--negative-bg)', border: 'var(--negative-border)', text: 'var(--negative)' },
  indeterminate: { dot: 'var(--indeterminate-dot)', bg: 'var(--indeterminate-bg)', border: 'var(--indeterminate-border)', text: 'var(--indeterminate)' },
  info: { dot: 'var(--primary-mid)', bg: 'var(--primary-bg)', border: 'var(--primary-border)', text: 'var(--primary-mid)' },
}

const TRADITIONAL_ROWS = [
  {
    nontreponemal: 'Nonreactive',
    treponemal: '-',
    interpretation: 'Syphilis unlikely',
    detail: 'No further testing needed. If primary lesion present and recent exposure, consider dark-field or PCR on ulcer exudate. Repeat serology if exposure was within 3 months.',
    type: 'negative',
  },
  {
    nontreponemal: 'Reactive',
    treponemal: 'Reactive',
    interpretation: 'Syphilis (active or past)',
    detail: 'Confirmed syphilis. Stage by clinical history and RPR titer. Treat by stage. Monitor RPR for treatment response.',
    type: 'reactive',
  },
  {
    nontreponemal: 'Reactive',
    treponemal: 'Nonreactive',
    interpretation: 'False-positive nontreponemal',
    detail: 'Biologic false positive. No syphilis treatment. Investigate cause (pregnancy, autoimmune, viral infection, older age).',
    type: 'negative',
  },
]

const REVERSE_ROWS = [
  {
    eia: 'Nonreactive',
    rpr: '-',
    tppa: '-',
    interpretation: 'Syphilis negative',
    detail: 'No syphilis antibodies. Report negative.',
    type: 'negative',
  },
  {
    eia: 'Reactive',
    rpr: 'Reactive',
    tppa: '-',
    interpretation: 'Syphilis confirmed',
    detail: 'EIA and RPR both reactive. Active or prior syphilis. Stage by titer and history. Treat accordingly.',
    type: 'reactive',
  },
  {
    eia: 'Reactive',
    rpr: 'Nonreactive',
    tppa: 'Reactive',
    interpretation: 'Past or latent syphilis',
    detail: 'Two treponemal tests positive, RPR negative. Most likely past treated syphilis. If no documented prior treatment, treat as late latent.',
    type: 'indeterminate',
  },
  {
    eia: 'Reactive',
    rpr: 'Nonreactive',
    tppa: 'Nonreactive',
    interpretation: 'False-positive EIA screen',
    detail: 'Initial treponemal screen was a false positive. No treatment needed. Document and counsel patient.',
    type: 'negative',
  },
]

const TREATMENT_ROWS = [
  {
    stage: 'Primary',
    rx: 'Benzathine PCN G 2.4M units IM x 1 dose',
    alt: 'Doxycycline 100 mg PO BID x 14 days (non-pregnant)',
    follow: 'RPR at 6 and 12 months; expect fourfold decline',
  },
  {
    stage: 'Secondary',
    rx: 'Benzathine PCN G 2.4M units IM x 1 dose',
    alt: 'Doxycycline 100 mg PO BID x 14 days (non-pregnant)',
    follow: 'RPR at 6 and 12 months; expect fourfold decline',
  },
  {
    stage: 'Early Latent (under 1 year)',
    rx: 'Benzathine PCN G 2.4M units IM x 1 dose',
    alt: 'Doxycycline 100 mg PO BID x 14 days (non-pregnant)',
    follow: 'RPR at 6, 12, and 24 months',
  },
  {
    stage: 'Late Latent or Unknown Duration',
    rx: 'Benzathine PCN G 2.4M units IM weekly x 3 doses',
    alt: 'Doxycycline 100 mg PO BID x 28 days (non-pregnant)',
    follow: 'RPR at 6, 12, and 24 months',
  },
  {
    stage: 'Tertiary (without neurosyphilis)',
    rx: 'Benzathine PCN G 2.4M units IM weekly x 3 doses',
    alt: 'Consult specialist',
    follow: 'RPR at 6, 12, and 24 months',
  },
  {
    stage: 'Neurosyphilis / Ocular / Otosyphilis',
    rx: 'Aqueous crystalline PCN G 18-24M units/day IV x 10-14 days',
    alt: 'Procaine PCN G 2.4M IM daily + probenecid 500 mg QID x 10-14 days',
    follow: 'Repeat CSF at 6 months. RPR monitoring.',
  },
  {
    stage: 'Pregnancy (any stage)',
    rx: 'Penicillin G regimen appropriate to stage (same as non-pregnant)',
    alt: 'No acceptable alternative. Must desensitize if penicillin-allergic.',
    follow: 'Monthly RPR for remainder of pregnancy. Evaluate neonate.',
  },
]

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</h2>
      {subtitle && <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </div>
  )
}

export default function QuickReference() {
  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 16px 56px' }}>
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>CDC 2021 STI Guidelines</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Quick Reference Card</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All result patterns and treatments. Built to bookmark.</p>
      </div>

      {/* Traditional Algorithm Table */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader title="Traditional Algorithm Results" subtitle="Nontreponemal (RPR/VDRL) screen first" />
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ background: '#162447', display: 'grid', gridTemplateColumns: '1fr 1fr 2fr' }}>
            {[
              { top: 'Step 1', bottom: 'RPR/VDRL' },
              { top: 'Step 2', bottom: 'Treponemal' },
              { top: 'Result', bottom: 'Interpretation' },
            ].map(({ top, bottom }, i) => (
              <div key={i} style={{ padding: '10px 12px', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>{top}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{bottom}</div>
              </div>
            ))}
          </div>
          {TRADITIONAL_ROWS.map((row, i) => {
            const s = TYPE_STYLES[row.type]
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 2fr',
                borderTop: '1px solid var(--border)',
                background: i % 2 === 0 ? 'var(--surface)' : 'var(--background)',
                borderLeft: `3px solid ${s.dot}`,
              }}>
                <div style={{ padding: '10px 12px', borderRight: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: row.nontreponemal === 'Reactive' ? 'var(--reactive)' : 'var(--text-secondary)' }}>{row.nontreponemal}</span>
                </div>
                <div style={{ padding: '10px 12px', borderRight: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{row.treponemal}</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.text, marginBottom: 3 }}>{row.interpretation}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{row.detail}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reverse Algorithm Table */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader title="Reverse Algorithm Results" subtitle="Treponemal EIA/CIA screen first" />
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ background: '#162447', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr' }}>
            {[
              { top: 'Step 1', bottom: 'EIA/CIA' },
              { top: 'Step 2', bottom: 'RPR' },
              { top: 'Step 3', bottom: 'TP-PA' },
              { top: 'Result', bottom: 'Interpretation' },
            ].map(({ top, bottom }, i) => (
              <div key={i} style={{ padding: '10px 10px', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.65)', marginBottom: 2 }}>{top}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'white' }}>{bottom}</div>
              </div>
            ))}
          </div>
          {REVERSE_ROWS.map((row, i) => {
            const s = TYPE_STYLES[row.type]
            return (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                borderTop: '1px solid var(--border)',
                background: i % 2 === 0 ? 'var(--surface)' : 'var(--background)',
                borderLeft: `3px solid ${s.dot}`,
              }}>
                <div style={{ padding: '10px 10px', borderRight: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: row.eia === 'Reactive' ? 'var(--reactive)' : 'var(--text-secondary)' }}>{row.eia}</span>
                </div>
                <div style={{ padding: '10px 10px', borderRight: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: row.rpr === 'Reactive' ? 'var(--reactive)' : row.rpr === 'Nonreactive' ? 'var(--negative)' : 'var(--text-muted)' }}>{row.rpr}</span>
                </div>
                <div style={{ padding: '10px 10px', borderRight: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, color: row.tppa === 'Reactive' ? 'var(--reactive)' : row.tppa === 'Nonreactive' ? 'var(--negative)' : 'var(--text-muted)' }}>{row.tppa}</span>
                </div>
                <div style={{ padding: '10px 10px' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: s.text, marginBottom: 3 }}>{row.interpretation}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{row.detail}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Treatment Table */}
      <div style={{ marginBottom: 28 }}>
        <SectionHeader title="Treatment by Stage" subtitle="CDC 2021 STI Treatment Guidelines" />
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
        }}>
          {TREATMENT_ROWS.map(({ stage, rx, alt, follow }, i, arr) => (
            <div key={stage} style={{
              padding: '12px 16px',
              borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
              background: i % 2 === 0 ? 'var(--surface)' : 'var(--background)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{stage}</div>
              <div style={{ fontSize: 12, color: 'var(--reactive)', fontWeight: 600, marginBottom: 4 }}>{rx}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>Alt: </span>{alt}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ fontWeight: 600 }}>Follow-up: </span>{follow}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Situations */}
      <div style={{
        marginBottom: 28,
        padding: '16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Special Situations</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              title: 'HIV co-infection',
              text: 'Syphilis is common in people with HIV. Higher risk of neurosyphilis and atypical serologic responses (may have unusually high or low RPR titers). Perform LP if neurologic symptoms, RPR 1:32 or greater with stage uncertainty, or treatment failure. Screen for syphilis at every HIV visit.',
            },
            {
              title: 'Prozone phenomenon',
              text: 'Excess antibody in secondary syphilis can cause a false-negative RPR. If RPR is unexpectedly nonreactive but secondary syphilis is strongly suspected (rash on palms/soles, condyloma lata), request that the lab dilute the specimen and repeat the RPR.',
            },
            {
              title: 'Reinfection vs. treatment failure: distinguishing the two',
              text: 'Both present as a fourfold or greater RPR titer rise after a documented decline. Reinfection is far more common. Clues favoring reinfection: new sexual partner or exposure, prior RPR had declined to low titer before rising, rapid rise. Clues favoring treatment failure: no new exposure, adequate partner treatment, prior RPR did not decline fourfold by 12 months. Lumbar puncture is recommended in either case to rule out neurosyphilis before retreating. Retreat as early syphilis if reinfection is likely (single dose); as late latent if unclear (3 weekly doses).',
            },
            {
              title: 'RPR titer monitoring after treatment',
              text: 'Primary/secondary: recheck at 6 and 12 months; expect fourfold decline by 12 months. Late latent or unknown duration: recheck at 6, 12, and 24 months. Serofast reaction (low stable titer of 1:1 to 1:4 after adequate treatment) is common and does not indicate failure. A fourfold rise at any point warrants evaluation for reinfection or failure and retreatment.',
            },
            {
              title: 'Partner notification and treatment',
              text: 'For primary syphilis: notify partners within 3 months plus duration of symptoms. Secondary syphilis: 6 months. Early latent: 12 months. Late latent: consider notifying long-term partners.',
            },
            {
              title: 'Jarisch-Herxheimer reaction',
              text: 'Fever, chills, headache, and myalgias occurring within hours of treatment for early syphilis. Self-limited, usually resolving in 24 hours. Antipyretics may reduce symptoms. Warn patients, especially those who are pregnant (may induce preterm labor).',
            },
            {
              title: 'Congenital syphilis prevention',
              text: 'All pregnant patients should be screened at first prenatal visit, 28 weeks, and at delivery in high-prevalence areas. Treatment at least 30 days before delivery is required to prevent congenital infection. Neonates born to mothers with reactive syphilis require evaluation and management per CDC guidelines.',
            },
            {
              title: 'When to perform lumbar puncture',
              text: 'Perform LP in: (1) any neurologic or ophthalmic symptoms; (2) evidence of active tertiary disease; (3) treatment failure; (4) RPR titer 1:32 or greater with unknown stage in HIV-infected patients (some experts recommend regardless of stage in HIV). LP is not routinely required for early syphilis without neurologic symptoms.',
            },
          ].map(({ title, text }, i, arr) => (
            <div key={title} style={{ paddingBottom: 10, borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</div>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}

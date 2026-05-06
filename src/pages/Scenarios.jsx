import { useState } from 'react'
import Disclaimer from '../components/Disclaimer'

const SCENARIOS = [
  {
    id: 1,
    title: 'Classic Primary Syphilis',
    tag: 'Primary Syphilis',
    tagType: 'reactive',
    context: '24-year-old man presents with a painless genital ulcer for 10 days. No prior syphilis history. Reports a new male partner 3 weeks ago. No systemic symptoms.',
    results: [
      { test: 'RPR (nontreponemal)', result: 'REACTIVE, titer 1:8', type: 'reactive' },
      { test: 'TP-PA (treponemal confirmatory)', result: 'REACTIVE', type: 'reactive' },
    ],
    algorithm: 'Traditional',
    interpretation: 'Primary syphilis. Reactive RPR confirmed by reactive treponemal test with active chancre.',
    rationale: 'The painless ulcer (chancre) and 3-week exposure history are consistent with primary syphilis (incubation 10-90 days, average 21 days). Both nontreponemal and treponemal tests are reactive. An RPR titer of 1:8 is typical for primary stage; titers are often lower early in primary compared to secondary.',
    source: 'Workowski et al. MMWR 2021; CDC 2021 STI Guidelines',
    nextSteps: 'Benzathine penicillin G 2.4 million units IM, single dose. Repeat RPR at 6 and 12 months: expect fourfold (2 dilution) decline. Offer partner services. Screen for other STIs including HIV.',
  },
  {
    id: 2,
    title: 'Secondary Syphilis with Rash',
    tag: 'Secondary Syphilis',
    tagType: 'reactive',
    context: '31-year-old woman presents with a diffuse maculopapular rash involving the palms and soles, low-grade fever, and lymphadenopathy for 2 weeks. She was treated for a "sore" on her labia 6 weeks ago with topical antifungal without improvement.',
    results: [
      { test: 'RPR (nontreponemal)', result: 'REACTIVE, titer 1:64', type: 'reactive' },
      { test: 'FTA-ABS (treponemal confirmatory)', result: 'REACTIVE', type: 'reactive' },
    ],
    algorithm: 'Traditional',
    interpretation: 'Secondary syphilis. High RPR titer with classic rash involving palms and soles confirms secondary stage.',
    rationale: 'Secondary syphilis typically appears 4-10 weeks after the primary chancre (which may go unnoticed). A rash on the palms and soles is a hallmark finding. RPR titers are highest in secondary syphilis, often 1:32 or greater. The missed "sore" was likely the primary chancre.',
    source: 'Workowski et al. MMWR 2021',
    nextSteps: 'Benzathine penicillin G 2.4 million units IM, single dose (same as primary). Repeat RPR at 6 and 12 months; expect fourfold decline by 12 months. Partner notification and testing. Screen for HIV and other STIs.',
  },
  {
    id: 3,
    title: 'Reverse Screen Discordant: Past Treated',
    tag: 'Past Syphilis',
    tagType: 'indeterminate',
    context: '45-year-old man undergoes routine lab work. His physician orders a treponemal EIA screen. Medical records document he was treated for syphilis 8 years ago with benzathine penicillin G. He has no current symptoms.',
    results: [
      { test: 'Treponemal EIA screen', result: 'REACTIVE', type: 'reactive' },
      { test: 'RPR (reflex)', result: 'NONREACTIVE', type: 'negative' },
      { test: 'TP-PA (second treponemal)', result: 'REACTIVE', type: 'reactive' },
    ],
    algorithm: 'Reverse',
    interpretation: 'Consistent with past treated syphilis. No evidence of active infection.',
    rationale: 'This is the classic reverse algorithm discordant pattern. Treponemal antibodies (EIA, TP-PA) persist for life after infection, even after successful treatment. The RPR has declined to nonreactive, consistent with successful prior treatment. Two reactive treponemal tests with a nonreactive RPR and documented prior treatment: no further treatment needed.',
    source: 'Workowski et al. MMWR 2021; Tong ML et al. J Clin Microbiol 2014',
    nextSteps: 'No treatment needed if prior treatment is documented and the clinical history is consistent. Establish a baseline RPR for future monitoring. If treatment history is uncertain, treat as late latent (benzathine penicillin G 2.4M units IM weekly x 3). Counsel patient that treponemal tests will remain reactive lifelong.',
  },
  {
    id: 4,
    title: 'False-Positive Treponemal Screen',
    tag: 'Syphilis Negative',
    tagType: 'negative',
    context: '38-year-old woman with systemic lupus erythematosus (SLE) presents for annual labs. No history of syphilis or exposure. No genital lesions or rash. Treponemal EIA screen ordered as part of routine panel.',
    results: [
      { test: 'Treponemal EIA screen', result: 'REACTIVE', type: 'reactive' },
      { test: 'RPR (reflex)', result: 'NONREACTIVE', type: 'negative' },
      { test: 'TP-PA (second treponemal)', result: 'NONREACTIVE', type: 'negative' },
    ],
    algorithm: 'Reverse',
    interpretation: 'False-positive treponemal EIA screen. No evidence of syphilis infection.',
    rationale: 'A reactive EIA with nonreactive RPR and nonreactive TP-PA is a false positive. The reverse algorithm requires a second treponemal test precisely to resolve this pattern. Autoimmune diseases including SLE are known causes of false-positive treponemal tests, likely due to cross-reactive antibodies to phospholipid antigens.',
    source: 'Workowski et al. MMWR 2021; Jurado RL et al. Arch Intern Med 1993',
    nextSteps: 'No syphilis treatment. Document false-positive result in the medical record. Counsel patient. If future treponemal screening is performed, expect similar false-positive results and note the confirmed negative TP-PA.',
  },
  {
    id: 5,
    title: 'Neurosyphilis',
    tag: 'Neurosyphilis',
    tagType: 'reactive',
    context: '52-year-old man with HIV (CD4 240, not on ART) presents with progressive memory loss, personality change, and new-onset focal seizures over 3 months. Neurologic exam shows cognitive impairment. No known syphilis history.',
    results: [
      { test: 'RPR (serum)', result: 'REACTIVE, titer 1:32', type: 'reactive' },
      { test: 'TP-PA (treponemal)', result: 'REACTIVE', type: 'reactive' },
      { test: 'CSF-VDRL (cerebrospinal fluid)', result: 'REACTIVE', type: 'reactive' },
      { test: 'CSF WBC', result: '22 cells/uL (elevated)', type: 'reactive' },
    ],
    algorithm: 'Traditional',
    interpretation: 'Neurosyphilis. Positive serum serology with reactive CSF-VDRL and pleocytosis confirms CNS involvement.',
    rationale: 'Neurosyphilis should be considered in any patient with unexplained neurologic or psychiatric findings and reactive syphilis serology. CSF-VDRL is highly specific but only 50-60% sensitive; a reactive result is diagnostic. Pleocytosis supports CNS inflammation. HIV co-infection and low CD4 count increase the risk of neurosyphilis. Standard IM benzathine penicillin does not achieve treponemicidal CSF concentrations.',
    source: 'Workowski et al. MMWR 2021; CDC Neurosyphilis Guidance 2021',
    nextSteps: 'Aqueous crystalline penicillin G 18-24 million units/day IV x 10-14 days (preferred) OR procaine penicillin G 2.4M units IM daily plus probenecid 500 mg PO QID x 10-14 days. Initiate or optimize HIV ART. Repeat CSF analysis at 6 months to confirm response. Ophthalmologic and audiologic evaluation.',
  },
  {
    id: 6,
    title: 'Syphilis in Pregnancy',
    tag: 'Congenital Risk',
    tagType: 'reactive',
    context: '26-year-old woman at 16 weeks gestation presents for prenatal care. First prenatal visit. No known syphilis history. Reports one new sexual partner in the past 3 months. Asymptomatic.',
    results: [
      { test: 'RPR (nontreponemal)', result: 'REACTIVE, titer 1:16', type: 'reactive' },
      { test: 'TP-PA (treponemal confirmatory)', result: 'REACTIVE', type: 'reactive' },
    ],
    algorithm: 'Traditional',
    interpretation: 'Active syphilis in pregnancy. Stage uncertain; treat as early latent given the 3-month exposure history.',
    rationale: 'Syphilis in pregnancy carries high risk of adverse outcomes: stillbirth, premature delivery, and congenital syphilis. All pregnant patients should be screened at first prenatal visit. An RPR of 1:16 with no known prior treatment suggests active infection. The 3-month exposure history makes early latent the most likely stage. Congenital syphilis is preventable with treatment at least 30 days before delivery.',
    source: 'Workowski et al. MMWR 2021; ACOG Practice Bulletin 2021',
    nextSteps: 'Benzathine penicillin G 2.4 million units IM, single dose (early latent). Penicillin allergy: must desensitize and treat with penicillin; no acceptable alternative in pregnancy. Repeat RPR monthly for remainder of pregnancy. Evaluate neonate at delivery. Treat sexual partner(s). Report to public health.',
  },
]

// Outlined style: transparent bg, colored border + text (matches hivalgorithm.com)
const TAG_STYLES = {
  reactive: { bg: 'transparent', border: 'var(--reactive-border)', color: 'var(--reactive)' },
  negative: { bg: 'transparent', border: 'var(--negative-border)', color: 'var(--negative)' },
  indeterminate: { bg: 'transparent', border: 'var(--indeterminate-border)', color: 'var(--indeterminate)' },
  info: { bg: 'transparent', border: 'var(--primary-border)', color: 'var(--primary-mid)' },
  neutral: { bg: 'transparent', border: 'var(--border)', color: 'var(--text-muted)' },
}

const ALGO_BADGE = {
  Traditional: { bg: 'transparent', border: 'var(--reactive-border)', color: 'var(--reactive)' },
  Reverse: { bg: 'transparent', border: 'var(--crimson-border)', color: 'var(--crimson)' },
}

function ResultRow({ test, result, type }) {
  const s = TAG_STYLES[type] || TAG_STYLES.neutral
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      padding: '10px 14px',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.3, flex: 1 }}>{test}</span>
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 6,
        padding: '3px 8px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>{result}</span>
    </div>
  )
}

function ScenarioCard({ scenario }) {
  const [revealed, setRevealed] = useState(false)
  const algoBadge = ALGO_BADGE[scenario.algorithm] || ALGO_BADGE.Traditional

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
    }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 4 }}>
            Case {scenario.id} of {SCENARIOS.length}
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{scenario.title}</h2>
          <span style={{
            display: 'inline-block',
            marginTop: 4,
            fontSize: 10,
            fontWeight: 700,
            color: algoBadge.color,
            background: algoBadge.bg,
            border: `1px solid ${algoBadge.border}`,
            borderRadius: 4,
            padding: '2px 7px',
            letterSpacing: '0.05em',
          }}>{scenario.algorithm} Algorithm</span>
        </div>
        {(() => {
          const s = TAG_STYLES[scenario.tagType]
          return (
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: s.color,
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: 20,
              padding: '4px 10px',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}>{scenario.tag}</span>
          )
        })()}
      </div>

      <div style={{ padding: '14px 16px', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{scenario.context}</p>
      </div>

      <div>
        <div style={{ padding: '8px 14px 4px', background: 'var(--background)', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>Laboratory Results</span>
        </div>
        {scenario.results.map((r, i) => (
          <ResultRow key={i} {...r} />
        ))}
      </div>

      {!revealed ? (
        <div style={{ padding: '16px' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
            What is your interpretation?
          </p>
          <button
            onClick={() => setRevealed(true)}
            style={{
              width: '100%',
              background: '#162447',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 20px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            Understand Interpretation
          </button>
        </div>
      ) : (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            padding: '14px',
            background: TAG_STYLES[scenario.tagType].bg,
            border: `1.5px solid ${TAG_STYLES[scenario.tagType].border}`,
            borderRadius: 'var(--radius-sm)',
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: TAG_STYLES[scenario.tagType].color, marginBottom: 6 }}>Interpretation</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: TAG_STYLES[scenario.tagType].color, lineHeight: 1.4 }}>{scenario.interpretation}</p>
          </div>

          <div style={{ padding: '14px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 6 }}>Rationale</div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{scenario.rationale}</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Source: {scenario.source}</p>
          </div>

          <div style={{ padding: '14px', background: 'var(--primary-bg)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary-mid)', marginBottom: 6 }}>Recommended Next Steps</div>
            <p style={{ fontSize: 13, color: 'var(--primary)', lineHeight: 1.6 }}>{scenario.nextSteps}</p>
          </div>

          <button
            onClick={() => setRevealed(false)}
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 6,
              padding: '8px',
              cursor: 'pointer',
            }}
          >Reset case</button>
        </div>
      )}
    </div>
  )
}

export default function Scenarios() {
  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '28px 16px 56px' }}>
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>6 canonical patterns</p>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Clinical Scenario Library</h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Read the case and lab results, form your interpretation, then reveal the answer with evidence-based rationale.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {SCENARIOS.map(s => <ScenarioCard key={s.id} scenario={s} />)}
      </div>

      <Disclaimer source="Based on CDC 2021 STI Treatment Guidelines (MMWR Recomm Rep 2021;70(4):1-187)." />
    </div>
  )
}
